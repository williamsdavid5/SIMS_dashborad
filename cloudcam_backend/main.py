"""
Backend FastAPI - CloudCam com Detecção de EPIs
Baseado no acesso2.py com suporte a HLS e YOLO
"""

import re
import json
import logging
import time
import threading
import asyncio
from typing import Optional, Dict, Any, List
from datetime import datetime
from queue import Queue
from concurrent.futures import ThreadPoolExecutor
import os

import requests
import uvicorn
from fastapi import FastAPI, HTTPException, File, UploadFile, Response
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import StreamingResponse
from pydantic import BaseModel

# Processamento de imagem e visão computacional
import cv2
import numpy as np
from ultralytics import YOLO
from PIL import Image
import base64
import io

# ──────────────────────────────────────────────
# CONFIGURAÇÃO
# ──────────────────────────────────────────────
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI(title="CloudCam Backend - Com Detecção de EPIs")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Armazenamento da sessão ativa
active_session: Optional['CloudCamSession'] = None

# Configurações de detecção
DETECTION_CONFIG = {
    'enabled': True,
    'confidence_threshold': 0.25,
    'iou_threshold': 0.45,
    'target_fps': 15,
    'max_queue_size': 10,
    'epis_interesse': ["Capacete", "Mascara", "Oculos", "Colete", "Luva", "Bota", "Abafador"],
    # NOVO: Processa 1 a cada 3 frames (ex: 30fps -> 10 detecções/segundo)
    'frame_skip': 3,
    'use_gpu': False,  # Se tiver GPU, mude para True
}

# Thread pool para processamento
executor = ThreadPoolExecutor(max_workers=2)

# Fila para processamento assíncrono (opcional)
frame_queue = Queue(maxsize=DETECTION_CONFIG['max_queue_size'])
result_cache = {}  # Cache de resultados recentes

# Carregar modelo YOLO
modelo_yolo = None


def carregar_modelo():
    """Carrega o modelo YOLO da pasta atual"""
    global modelo_yolo

    try:
        import torch
        device = 'cuda' if torch.cuda.is_available() else 'cpu'
        if device == 'cuda':
            logger.info("🚀 GPU CUDA disponível! Usando aceleração por GPU")
            DETECTION_CONFIG['use_gpu'] = True
        else:
            logger.info("💻 GPU não disponível, usando CPU")
    except:
        logger.info("💻 PyTorch não instalado, usando CPU")
        device = 'cpu'

    # Possíveis nomes de arquivo do modelo
    possiveis_nomes = [
        "modeloA.pt",
        "best.pt",
        "yolov8n.pt",
        "epi_model.pt"
    ]

    for nome in possiveis_nomes:
        if os.path.exists(nome):
            try:
                logger.info(f"📦 Carregando modelo: {nome}")
                modelo_yolo = YOLO(nome)

                # Move para GPU se disponível
                if device == 'cuda' and hasattr(modelo_yolo, 'to'):
                    modelo_yolo.to('cuda')
                    logger.info("✅ Modelo movido para GPU")

                logger.info(f"✅ Modelo carregado com sucesso de: {nome}")
                return True
            except Exception as e:
                logger.error(f"❌ Erro ao carregar {nome}: {e}")

    # Tenta carregar qualquer arquivo .pt na pasta
    arquivos_pt = [f for f in os.listdir('.') if f.endswith('.pt')]
    for arquivo in arquivos_pt:
        try:
            logger.info(f"📦 Carregando modelo: {arquivo}")
            modelo_yolo = YOLO(arquivo)
            logger.info(f"✅ Modelo carregado com sucesso de: {arquivo}")
            return True
        except Exception as e:
            logger.error(f"❌ Erro ao carregar {arquivo}: {e}")

    logger.warning("⚠️ Nenhum modelo YOLO encontrado na pasta atual!")
    logger.warning(f"   Pasta atual: {os.getcwd()}")
    logger.warning("   Detecção de EPIs estará DESATIVADA")
    return False


# Carrega o modelo na inicialização
MODELO_CARREGADO = carregar_modelo()


class LoginRequest(BaseModel):
    email: str
    password: str


class DetectionResult(BaseModel):
    timestamp: str
    detections: List[Dict[str, Any]]
    total_objects: int
    processing_time_ms: float


# ──────────────────────────────────────────────
# CLASSE PRINCIPAL (baseada no acesso2.py)
# ──────────────────────────────────────────────
class CloudCamSession:
    BASE_URL = "https://acessoweb.cloudcamserver.com.br"

    def __init__(self, email: str, password: str):
        self.email = email
        self.password = password
        self.session = requests.Session()
        self.logged_in = False
        self.cameras: list = []
        self.last_update = None

        self.session.headers.update({
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
            "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
            "Accept-Language": "pt-BR,pt;q=0.9",
        })

    def login(self) -> bool:
        """Login exatamente como no acesso2.py"""
        try:
            logger.info(f"🔐 Tentando login: {self.email}")

            login_page = self.session.get(
                f"{self.BASE_URL}/login",
                timeout=30
            )

            if login_page.status_code != 200:
                logger.error(
                    f"Erro ao acessar login: {login_page.status_code}")
                return False

            csrf = None
            patterns = [
                r'name="csrf-token" content="([^"]+)"',
                r'name="_token" value="([^"]+)"'
            ]

            for pattern in patterns:
                match = re.search(pattern, login_page.text)
                if match:
                    csrf = match.group(1)
                    break

            payload = {"email": self.email, "password": self.password}
            if csrf:
                payload["_token"] = csrf

            response = self.session.post(
                f"{self.BASE_URL}/login",
                data=payload,
                timeout=30
            )

            if response.status_code != 200:
                logger.error(f"Erro no POST login: {response.status_code}")
                return False

            dashboard = self.session.get(
                f"{self.BASE_URL}/dashboard",
                timeout=10
            )

            if "login" not in dashboard.url.lower():
                self.logged_in = True
                logger.info("✅ Login realizado com sucesso!")
                return True

            logger.error("❌ Falha na autenticação")
            return False

        except Exception as e:
            logger.error(f"Erro no login: {e}")
            return False

    def load_cameras(self, force_refresh: bool = False) -> list:
        """Carrega lista de câmeras do /camera/grid"""
        if not self.logged_in:
            return []

        if not force_refresh and self.cameras and self.last_update:
            if (datetime.now() - self.last_update).seconds < 30:
                return self.cameras

        try:
            logger.info("📡 Buscando câmeras...")

            grid = self.session.get(
                f"{self.BASE_URL}/camera/grid",
                timeout=30
            )

            if grid.status_code != 200:
                return []

            json_match = re.search(
                r"id='camerasJson'[^>]*>([^<]+)<",
                grid.text
            )

            if not json_match:
                return []

            self.cameras = json.loads(json_match.group(1))
            self.last_update = datetime.now()
            logger.info(f"✅ {len(self.cameras)} câmeras encontradas")

            return self.cameras

        except Exception as e:
            logger.error(f"Erro ao buscar câmeras: {e}")
            return []

    def get_camera_info(self, camera_id: int) -> Optional[Dict[str, Any]]:
        for cam in self.cameras:
            if cam.get("id") == camera_id:
                return cam
        return None

    def get_stream_url(self, camera_id: int) -> Optional[str]:
        cam = self.get_camera_info(camera_id)
        if not cam:
            return None

        stream_url = cam.get("live_url_html5") or cam.get("live_url")
        return stream_url

    def get_thumbnail_url(self, camera_id: int) -> Optional[str]:
        cam = self.get_camera_info(camera_id)
        if not cam:
            return None
        return cam.get("thumb_url")


# ──────────────────────────────────────────────
# FUNÇÕES DE DETECÇÃO DE EPIs
# ──────────────────────────────────────────────

def process_frame_with_yolo(frame: np.ndarray, conf_threshold: float = 0.25) -> tuple:
    """
    Processa um frame com YOLO e retorna a imagem anotada e as detecções

    Returns:
        tuple: (frame_annotated, detections_list)
    """
    if modelo_yolo is None or not DETECTION_CONFIG['enabled']:
        return frame, []

    try:
        # Redimensiona se necessário (opcional, para performance)
        h, w = frame.shape[:2]
        if w > 1280:
            scale = 1280 / w
            new_w = 1280
            new_h = int(h * scale)
            frame_resized = cv2.resize(frame, (new_w, new_h))
        else:
            frame_resized = frame
            scale = 1.0

        # Predição
        resultados = modelo_yolo.predict(
            frame_resized,
            conf=conf_threshold,
            iou=DETECTION_CONFIG['iou_threshold'],
            verbose=False
        )

        detections = []
        frame_annotated = frame_resized.copy()

        for resultado in resultados:
            for box in resultado.boxes:
                x1, y1, x2, y2 = map(int, box.xyxy[0].tolist())
                conf = float(box.conf[0].tolist())
                cls = int(box.cls[0].tolist())
                nome_classe = resultado.names[cls]

                # Verifica se é um EPI de interesse
                is_epi = any(epi.lower() in nome_classe.lower()
                             for epi in DETECTION_CONFIG['epis_interesse'])

                # Cor baseada na confiança
                if conf > 0.7:
                    cor = (0, 255, 0)  # Verde - alta confiança
                elif conf > 0.4:
                    cor = (0, 255, 255)  # Amarelo - média confiança
                else:
                    cor = (0, 0, 255)  # Vermelho - baixa confiança

                # Desenha bounding box
                cv2.rectangle(frame_annotated, (x1, y1), (x2, y2), cor, 2)

                # Prepara label
                label = f"{nome_classe}"
                if is_epi:
                    label += f" EPI"
                label += f" {conf:.2f}"

                # Fundo do texto
                (label_w, label_h), _ = cv2.getTextSize(
                    label, cv2.FONT_HERSHEY_SIMPLEX, 0.5, 2)
                cv2.rectangle(frame_annotated, (x1, y1 - label_h - 5),
                              (x1 + label_w, y1), cor, -1)

                # Texto
                cv2.putText(frame_annotated, label, (x1, y1 - 5),
                            cv2.FONT_HERSHEY_SIMPLEX, 0.5, (255, 255, 255), 2)

                # Registra detecção
                detections.append({
                    "objeto": nome_classe,
                    "confianca": round(conf, 3),
                    "bbox": [int(x1/scale), int(y1/scale), int(x2/scale), int(y2/scale)] if scale != 1.0 else [x1, y1, x2, y2],
                    "tipo": "EPI" if is_epi else "OUTRO"
                })

        # Se redimensionou, volta ao tamanho original
        if scale != 1.0:
            frame_annotated = cv2.resize(frame_annotated, (w, h))

        return frame_annotated, detections

    except Exception as e:
        logger.error(f"Erro no processamento YOLO: {e}")
        return frame, []


def frame_to_jpeg_bytes(frame: np.ndarray, quality: int = 85) -> bytes:
    """Converte frame numpy para bytes JPEG"""
    _, buffer = cv2.imencode(
        '.jpg', frame, [cv2.IMWRITE_JPEG_QUALITY, quality])
    return buffer.tobytes()


def frame_to_base64(frame: np.ndarray) -> str:
    """Converte frame numpy para base64"""
    _, buffer = cv2.imencode('.jpg', frame)
    return base64.b64encode(buffer).decode()


# ──────────────────────────────────────────────
# ROTAS DA API (Endpoints Originais)
# ──────────────────────────────────────────────

@app.get("/")
def root():
    return {
        "status": "online",
        "service": "CloudCam Backend com Detecção de EPIs",
        "detection_enabled": DETECTION_CONFIG['enabled'] and modelo_yolo is not None,
        "model_loaded": modelo_yolo is not None,
        "endpoints": [
            "POST /api/login",
            "GET /api/cameras",
            "GET /api/stream/{camera_id}",
            # NOVO: stream com detecção
            "GET /api/stream-detected/{camera_id}",
            "POST /api/detect-frame",  # NOVO: detectar em frame enviado
            "GET /api/thumbnail/{camera_id}",
            "GET /api/status",
            "POST /api/logout",
            "GET /api/detection/stats"
        ]
    }


@app.post("/api/login")
def login(request: LoginRequest):
    global active_session

    logger.info(f"📝 Login request para: {request.email}")

    session = CloudCamSession(request.email, request.password)

    if not session.login():
        raise HTTPException(
            status_code=401,
            detail="Login falhou. Verifique email e senha."
        )

    cameras = session.load_cameras()

    active_session = session

    return {
        "ok": True,
        "message": "Login realizado com sucesso!",
        "cameras_count": len(cameras),
        "detection_available": modelo_yolo is not None
    }


@app.get("/api/cameras")
def list_cameras():
    if not active_session or not active_session.logged_in:
        raise HTTPException(
            status_code=401, detail="Não autenticado. Faça login primeiro.")

    cameras = active_session.load_cameras()

    result = []
    for cam in cameras:
        result.append({
            "id": cam.get("id"),
            "nome": cam.get("description") or cam.get("name") or f"Câmera {cam.get('id')}",
            "status": "online" if cam.get("is_online", True) else "offline",
            "has_thumb": bool(cam.get("thumb_url")),
            "has_stream": bool(cam.get("live_url_html5") or cam.get("live_url"))
        })

    return {
        "total": len(result),
        "cameras": result
    }


@app.get("/api/stream/{camera_id}")
def get_stream_info(camera_id: int):
    """Retorna informações do stream original (sem detecção)"""
    if not active_session or not active_session.logged_in:
        raise HTTPException(status_code=401, detail="Não autenticado")

    stream_url = active_session.get_stream_url(camera_id)

    if not stream_url:
        raise HTTPException(
            status_code=404,
            detail="Stream não disponível para esta câmera"
        )

    return {
        "stream_url": stream_url,
        "tipo": "hls" if ".m3u8" in stream_url else "other",
        "camera_id": camera_id,
        "detection_supported": False
    }


@app.get("/api/stream-detected/{camera_id}")
async def stream_with_detection(camera_id: int):
    """
    Stream MJPEG com detecção de EPIs em tempo real
    """
    if not active_session or not active_session.logged_in:
        raise HTTPException(401, "Não autenticado")

    if modelo_yolo is None:
        logger.warning(f"⚠️ Modelo não carregado!")
        raise HTTPException(503, "Modelo de detecção não disponível")

    stream_url = active_session.get_stream_url(camera_id)
    if not stream_url:
        raise HTTPException(404, "Stream não disponível")

    logger.info(f"🎥 Iniciando stream com detecção para câmera {camera_id}")
    logger.info(f"📍 URL do stream: {stream_url}")
    logger.info(
        f"🤖 Tipo do stream: {'HLS' if '.m3u8' in stream_url else 'Outro'}")

    async def generate_detected_stream():
        loop = asyncio.get_event_loop()
        cap = None
        frame_count = 0
        processed_count = 0
        error_count = 0
        max_errors = 10
        last_successful_frame = None
        last_detections = []
        frame_skip = DETECTION_CONFIG['frame_skip']
        last_frame_time = time.time()

        # Tempo alvo por frame (para 30fps = 0.033s)
        target_frame_time = 1.0 / 30.0

        try:
            logger.info(f"🔌 Tentando abrir stream...")

            # Otimização: Usar buffer menor para menor latência
            if '.m3u8' in stream_url:
                cap = cv2.VideoCapture(stream_url, cv2.CAP_FFMPEG)
            else:
                cap = cv2.VideoCapture(stream_url)

            # Configurações para baixa latência
            cap.set(cv2.CAP_PROP_BUFFERSIZE, 1)  # Buffer mínimo
            cap.set(cv2.CAP_PROP_FOURCC, cv2.VideoWriter_fourcc(
                *'MJPG'))  # Tentar MJPEG
            cap.set(cv2.CAP_PROP_OPEN_TIMEOUT_MSEC, 5000)  # 5 segundos timeout

            if not cap.isOpened():
                logger.error(f"❌ Falha ao abrir stream")
                return

            logger.info(
                f"✅ Stream aberto com sucesso! Frame skip: {frame_skip}")

            while True:
                frame_start = time.time()

                try:
                    ret, frame = cap.read()

                    if not ret or frame is None:
                        error_count += 1
                        if error_count > max_errors:
                            logger.warning(
                                "⚠️ Muitos erros, tentando reconectar...")
                            cap.release()
                            await asyncio.sleep(1)

                            if '.m3u8' in stream_url:
                                cap = cv2.VideoCapture(
                                    stream_url, cv2.CAP_FFMPEG)
                            else:
                                cap = cv2.VideoCapture(stream_url)
                            cap.set(cv2.CAP_PROP_BUFFERSIZE, 1)

                            if not cap.isOpened():
                                break

                            error_count = 0
                        continue

                    error_count = 0
                    frame_count += 1

                    # Processa apenas a cada N frames
                    should_process = (frame_count % frame_skip == 0)

                    if should_process:
                        processed_count += 1

                        # Processa com YOLO
                        frame_annotated, detections = await loop.run_in_executor(
                            executor,
                            process_frame_with_yolo,
                            frame,
                            DETECTION_CONFIG['confidence_threshold']
                        )
                        last_detections = detections
                        last_successful_frame = frame_annotated

                        if len(detections) > 0 and processed_count % 5 == 0:
                            logger.info(
                                f"🎯 Detecções (frame {frame_count}): {[d['objeto'] for d in detections]}")
                    else:
                        # Reutiliza último frame processado com anotações
                        if last_successful_frame is not None:
                            frame_annotated = last_successful_frame.copy()
                            # Atualiza apenas o número do frame
                            cv2.putText(frame_annotated, f"Frame: {frame_count}", (10, 30),
                                        cv2.FONT_HERSHEY_SIMPLEX, 0.7, (0, 255, 0), 2)
                        else:
                            frame_annotated = frame.copy()
                            cv2.putText(frame_annotated, "AGUARDANDO DETECCAO...", (10, 30),
                                        cv2.FONT_HERSHEY_SIMPLEX, 0.7, (0, 0, 255), 2)

                        detections = last_detections

                    # Adiciona informações de performance
                    cv2.putText(frame_annotated, f"Frame: {frame_count}", (10, 30),
                                cv2.FONT_HERSHEY_SIMPLEX, 0.6, (0, 255, 0), 2)
                    cv2.putText(frame_annotated, f"Dets: {len(detections)}", (10, 55),
                                cv2.FONT_HERSHEY_SIMPLEX, 0.6, (0, 255, 0), 2)

                    # Mostra status do skip
                    skip_text = f"Detect: {processed_count}/s" if should_process else f"Skip: {frame_count % frame_skip}/{frame_skip}"
                    cv2.putText(frame_annotated, skip_text, (frame_annotated.shape[1] - 120, 30),
                                cv2.FONT_HERSHEY_SIMPLEX, 0.5, (255, 255, 0), 1)

                    # Converte para JPEG com qualidade ajustável
                    # Qualidade 70% para menor tamanho
                    encode_param = [cv2.IMWRITE_JPEG_QUALITY, 70]
                    _, buffer = cv2.imencode(
                        '.jpg', frame_annotated, encode_param)

                    yield (b'--frame\r\n'
                           b'Content-Type: image/jpeg\r\n\r\n' + buffer.tobytes() + b'\r\n')

                    # Controle de taxa - mantém FPS estável
                    elapsed = time.time() - frame_start
                    sleep_time = max(0, target_frame_time - elapsed)
                    if sleep_time > 0:
                        await asyncio.sleep(sleep_time)

                except Exception as e:
                    logger.error(f"Erro no loop: {e}")
                    await asyncio.sleep(0.01)

        except Exception as e:
            logger.error(f"Erro fatal: {e}")
        finally:
            if cap is not None:
                cap.release()
            logger.info(
                f"📹 Stream encerrado. Frames totais: {frame_count}, Processados: {processed_count}")

    return StreamingResponse(
        generate_detected_stream(),
        media_type="multipart/x-mixed-replace; boundary=frame",
        headers={
            "Cache-Control": "no-cache",
            "Connection": "keep-alive",
        }
    )


@app.post("/api/detect-frame")
async def detect_frame(file: UploadFile = File(...)):
    """
    Detecta EPIs em um frame enviado pelo frontend
    Retorna imagem anotada em base64 e lista de detecções
    """
    if modelo_yolo is None:
        raise HTTPException(503, "Modelo de detecção não disponível")

    start_time = time.time()

    try:
        # Lê e decodifica imagem
        contents = await file.read()
        nparr = np.frombuffer(contents, np.uint8)
        frame = cv2.imdecode(nparr, cv2.IMREAD_COLOR)

        if frame is None:
            raise HTTPException(400, "Não foi possível decodificar a imagem")

        # Processa com YOLO
        frame_annotated, detections = process_frame_with_yolo(
            frame, DETECTION_CONFIG['confidence_threshold'])

        # Converte para base64
        img_base64 = frame_to_base64(frame_annotated)

        processing_time = (time.time() - start_time) * 1000

        # Filtra apenas EPIs (opcional)
        epis_detectados = [d for d in detections if d['tipo'] == 'EPI']

        return DetectionResult(
            timestamp=datetime.now().isoformat(),
            detections=detections,
            total_objects=len(detections),
            processing_time_ms=round(processing_time, 2)
        )

    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Erro no detect-frame: {e}")
        raise HTTPException(500, f"Erro no processamento: {str(e)}")


@app.get("/api/thumbnail/{camera_id}")
def get_thumbnail(camera_id: int):
    """Retorna a thumbnail da câmera (imagem)"""
    if not active_session or not active_session.logged_in:
        raise HTTPException(status_code=401, detail="Não autenticado")

    thumb_url = active_session.get_thumbnail_url(camera_id)

    if not thumb_url:
        raise HTTPException(status_code=404, detail="Thumbnail não disponível")

    try:
        response = active_session.session.get(thumb_url, timeout=10)

        if response.status_code != 200:
            raise HTTPException(
                status_code=502, detail="Erro ao buscar thumbnail")

        return StreamingResponse(
            response.iter_content(chunk_size=8192),
            media_type=response.headers.get("content-type", "image/jpeg")
        )
    except Exception as e:
        logger.error(f"Erro ao buscar thumbnail: {e}")
        raise HTTPException(status_code=502, detail=f"Erro: {str(e)}")


@app.get("/api/status")
def get_status():
    """Verifica status da sessão atual"""
    return {
        "logado": active_session is not None and active_session.logged_in,
        "email": active_session.email if active_session else None,
        "cameras_count": len(active_session.cameras) if active_session and active_session.cameras else 0,
        "session_active": active_session is not None,
        "detection_available": modelo_yolo is not None,
        "detection_enabled": DETECTION_CONFIG['enabled']
    }


@app.get("/api/detection/stats")
def get_detection_stats():
    """Retorna estatísticas do sistema de detecção"""
    return {
        "model_loaded": modelo_yolo is not None,
        "model_path": "modeloA.pt" if os.path.exists("modeloA.pt") else None,
        "enabled": DETECTION_CONFIG['enabled'],
        "confidence_threshold": DETECTION_CONFIG['confidence_threshold'],
        "target_fps": DETECTION_CONFIG['target_fps'],
        "epis_monitorados": DETECTION_CONFIG['epis_interesse'],
        "worker_threads": executor._max_workers
    }


@app.post("/api/logout")
def logout():
    """Encerra a sessão atual"""
    global active_session

    if active_session:
        active_session.session.close()
        active_session = None
        logger.info("Sessão encerrada")

    return {"ok": True, "message": "Logout realizado com sucesso"}


@app.on_event("shutdown")
async def shutdown_event():
    """Limpeza ao desligar"""
    logger.info("🛑 Desligando servidor...")
    executor.shutdown(wait=True)
    cv2.destroyAllWindows()


# ──────────────────────────────────────────────
# INICIALIZAÇÃO
# ──────────────────────────────────────────────
@app.on_event("startup")
async def startup_event():
    logger.info("=" * 50)
    logger.info("🚀 CloudCam Backend com Detecção de EPIs iniciado!")
    logger.info("=" * 50)
    logger.info(f"📁 Pasta atual: {os.getcwd()}")
    logger.info(
        f"🤖 Modelo YOLO: {'✅ CARREGADO' if modelo_yolo else '❌ NÃO CARREGADO'}")
    logger.info(f"🎯 EPIs monitorados: {DETECTION_CONFIG['epis_interesse']}")
    logger.info("=" * 50)
    logger.info("📌 ENDPOINTS DISPONÍVEIS:")
    logger.info("   POST /api/login - Autenticação")
    logger.info("   GET /api/cameras - Listar câmeras")
    logger.info("   GET /api/stream/{id} - Stream original (sem detecção)")
    logger.info("   GET /api/stream-detected/{id} - Stream COM DETECÇÃO ⭐")
    logger.info("   POST /api/detect-frame - Detecção em frame único")
    logger.info("   GET /api/thumbnail/{id} - Thumbnail")
    logger.info("=" * 50)


if __name__ == "__main__":
    print("=" * 50)
    print("🚀 CloudCam Backend - Com Detecção de EPIs")
    print("=" * 50)
    print(f"📁 Pasta atual: {os.getcwd()}")
    print(f"🤖 Modelo: {'✅ Carregado' if modelo_yolo else '❌ Não encontrado'}")
    print("=" * 50)
    print("📌 Para testar a detecção:")
    print("   GET http://localhost:8000/api/stream-detected/{camera_id}")
    print("=" * 50)

    uvicorn.run(
        "main:app",
        host="0.0.0.0",
        port=8000,
        reload=True,
        log_level="info"
    )
