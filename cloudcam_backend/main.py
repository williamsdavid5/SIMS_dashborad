"""
Backend FastAPI - CloudCam (Atualizado)
Baseado no acesso2.py com suporte a HLS
"""

import re
import json
import logging
from typing import Optional, Dict, Any
from datetime import datetime

import requests
import uvicorn
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import StreamingResponse
from pydantic import BaseModel

# ──────────────────────────────────────────────
# CONFIGURAÇÃO
# ──────────────────────────────────────────────
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI(title="CloudCam Backend - HLS Support")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Armazenamento da sessão ativa
active_session: Optional['CloudCamSession'] = None


class LoginRequest(BaseModel):
    email: str
    password: str


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

        # Headers como no acesso2.py
        self.session.headers.update({
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
            "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
            "Accept-Language": "pt-BR,pt;q=0.9",
        })

    def login(self) -> bool:
        """Login exatamente como no acesso2.py"""
        try:
            logger.info(f"🔐 Tentando login: {self.email}")

            # 1. GET na página de login
            login_page = self.session.get(
                f"{self.BASE_URL}/login",
                timeout=30
            )

            if login_page.status_code != 200:
                logger.error(
                    f"Erro ao acessar login: {login_page.status_code}")
                return False

            # 2. Extrair CSRF token
            csrf = None
            patterns = [
                r'name="csrf-token" content="([^"]+)"',
                r'name="_token" value="([^"]+)"'
            ]

            for pattern in patterns:
                match = re.search(pattern, login_page.text)
                if match:
                    csrf = match.group(1)
                    logger.info(f"CSRF encontrado: {csrf[:20]}...")
                    break

            # 3. Preparar payload
            payload = {"email": self.email, "password": self.password}
            if csrf:
                payload["_token"] = csrf

            # 4. POST do login
            response = self.session.post(
                f"{self.BASE_URL}/login",
                data=payload,
                timeout=30
            )

            if response.status_code != 200:
                logger.error(f"Erro no POST login: {response.status_code}")
                return False

            # 5. Verificar sucesso (como no acesso2.py)
            dashboard = self.session.get(
                f"{self.BASE_URL}/dashboard",
                timeout=10
            )

            if "login" not in dashboard.url.lower():
                self.logged_in = True
                logger.info("✅ Login realizado com sucesso!")
                return True

            logger.error("❌ Falha na autenticação - redirecionado para login")
            return False

        except requests.exceptions.Timeout:
            logger.error("Timeout na conexão")
            return False
        except requests.exceptions.ConnectionError:
            logger.error("Erro de conexão")
            return False
        except Exception as e:
            logger.error(f"Erro inesperado no login: {e}")
            return False

    def load_cameras(self, force_refresh: bool = False) -> list:
        """Carrega lista de câmeras do /camera/grid"""
        if not self.logged_in:
            logger.error("Sessão não autenticada")
            return []

        # Cache de 30 segundos
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
                logger.error(f"Erro ao buscar câmeras: {grid.status_code}")
                return []

            # Extrai o JSON como no acesso2.py
            json_match = re.search(
                r"id='camerasJson'[^>]*>([^<]+)<",
                grid.text
            )

            if not json_match:
                logger.error("JSON de câmeras não encontrado na página")
                # Debug: mostra parte do HTML
                logger.debug(f"HTML snippet: {grid.text[:500]}")
                return []

            self.cameras = json.loads(json_match.group(1))
            self.last_update = datetime.now()

            logger.info(f"✅ {len(self.cameras)} câmeras encontradas")

            # Log da primeira câmera para debug
            if self.cameras:
                logger.debug(
                    f"Exemplo de câmera: {json.dumps(self.cameras[0], indent=2)[:200]}")

            return self.cameras

        except json.JSONDecodeError as e:
            logger.error(f"Erro ao decodificar JSON: {e}")
            return []
        except Exception as e:
            logger.error(f"Erro ao buscar câmeras: {e}")
            return []

    def get_camera_info(self, camera_id: int) -> Optional[Dict[str, Any]]:
        """Obtém informações completas de uma câmera específica"""
        for cam in self.cameras:
            if cam.get("id") == camera_id:
                return cam
        return None

    def get_stream_url(self, camera_id: int) -> Optional[str]:
        """Obtém URL do stream HLS da câmera"""
        cam = self.get_camera_info(camera_id)
        if not cam:
            logger.error(f"Câmera {camera_id} não encontrada")
            return None

        # Prioridade: live_url_html5 (para HLS) depois live_url
        stream_url = cam.get("live_url_html5") or cam.get("live_url")

        if not stream_url:
            logger.error(f"Stream URL não disponível para câmera {camera_id}")
            logger.debug(f"Dados da câmera: {cam.keys()}")
            return None

        logger.info(
            f"🎥 Stream URL para câmera {camera_id}: {stream_url[:100]}...")

        # Detecta o tipo
        if ".m3u8" in stream_url:
            logger.info(f"📱 Tipo HLS detectado")
        elif stream_url.startswith("rtsp"):
            logger.info(f"📡 Tipo RTSP detectado")

        return stream_url

    def get_thumbnail_url(self, camera_id: int) -> Optional[str]:
        """Obtém URL da thumbnail da câmera"""
        cam = self.get_camera_info(camera_id)
        if not cam:
            return None
        return cam.get("thumb_url")

    def proxy_hls_segment(self, segment_url: str):
        """Proxy para segmentos HLS (.ts) - evita CORS e mantém autenticação"""
        try:
            # Faz a requisição com a sessão autenticada
            resp = self.session.get(segment_url, timeout=10, stream=True)
            return StreamingResponse(
                resp.iter_content(chunk_size=8192),
                media_type=resp.headers.get("content-type", "video/MP2T"),
                headers={
                    "Access-Control-Allow-Origin": "*",
                    "Cache-Control": "no-cache",
                }
            )
        except Exception as e:
            logger.error(f"Erro no proxy do segmento HLS: {e}")
            raise HTTPException(status_code=502, detail=f"Erro no proxy: {e}")


# ──────────────────────────────────────────────
# ROTAS DA API
# ──────────────────────────────────────────────

@app.get("/")
def root():
    return {
        "status": "online",
        "service": "CloudCam Backend",
        "hls_support": True,
        "endpoints": [
            "POST /api/login",
            "GET /api/cameras",
            "GET /api/stream/{camera_id}",
            "GET /api/thumbnail/{camera_id}",
            "GET /api/status",
            "POST /api/logout"
        ]
    }


@app.post("/api/login")
def login(request: LoginRequest):
    """Login com email e senha (mesmo método do acesso2.py)"""
    global active_session

    logger.info(f"📝 Login request para: {request.email}")

    # Cria nova sessão
    session = CloudCamSession(request.email, request.password)

    # Tenta login
    if not session.login():
        raise HTTPException(
            status_code=401,
            detail="Login falhou. Verifique email e senha."
        )

    # Carrega câmeras após login bem-sucedido
    cameras = session.load_cameras()

    if not cameras:
        logger.warning("Login OK mas nenhuma câmera encontrada")

    active_session = session

    return {
        "ok": True,
        "message": "Login realizado com sucesso!",
        "cameras_count": len(cameras)
    }


@app.get("/api/cameras")
def list_cameras():
    """Lista todas as câmeras disponíveis"""
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


@app.get("/api/camera/{camera_id}")
def camera_details(camera_id: int):
    """Detalhes completos de uma câmera específica"""
    if not active_session or not active_session.logged_in:
        raise HTTPException(status_code=401, detail="Não autenticado")

    cam = active_session.get_camera_info(camera_id)

    if not cam:
        raise HTTPException(status_code=404, detail="Câmera não encontrada")

    return {
        "id": cam.get("id"),
        "nome": cam.get("description") or cam.get("name"),
        "status": "online" if cam.get("is_online", True) else "offline",
        "stream_type": "hls" if ".m3u8" in str(cam.get("live_url_html5", "")) else "unknown",
        "details": cam  # Dados brutos para debug (remover em produção)
    }


@app.get("/api/stream/{camera_id}")
def get_stream_info(camera_id: int):
    """Retorna informações do stream HLS para o frontend"""
    if not active_session or not active_session.logged_in:
        raise HTTPException(status_code=401, detail="Não autenticado")

    stream_url = active_session.get_stream_url(camera_id)

    if not stream_url:
        raise HTTPException(
            status_code=404,
            detail="Stream não disponível para esta câmera"
        )

    # Verifica se precisa de proxy
    needs_proxy = any([
        "localhost" in stream_url,
        "127.0.0.1" in stream_url,
        not stream_url.startswith("http")  # RTSP etc
    ])

    return {
        "stream_url": stream_url,
        "tipo": "hls" if ".m3u8" in stream_url else "other",
        "needs_proxy": needs_proxy,
        "camera_id": camera_id
    }


@app.get("/api/thumbnail/{camera_id}")
def get_thumbnail(camera_id: int):
    """Retorna a thumbnail da câmera (imagem)"""
    if not active_session or not active_session.logged_in:
        raise HTTPException(status_code=401, detail="Não autenticado")

    thumb_url = active_session.get_thumbnail_url(camera_id)

    if not thumb_url:
        raise HTTPException(status_code=404, detail="Thumbnail não disponível")

    try:
        # Usa a sessão autenticada para baixar a thumbnail
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
    if active_session and active_session.logged_in:
        return {
            "logado": True,
            "email": active_session.email,
            "cameras_count": len(active_session.cameras) if active_session.cameras else 0,
            "session_active": True
        }

    return {
        "logado": False,
        "session_active": False
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


# ──────────────────────────────────────────────
# HEALTH CHECK E INIT
# ──────────────────────────────────────────────
@app.on_event("startup")
async def startup_event():
    logger.info("🚀 CloudCam Backend iniciado!")
    logger.info("📧 Use POST /api/login com email e senha")
    logger.info("🎥 Suporte a HLS nativo")


if __name__ == "__main__":
    print("=" * 50)
    print("🚀 CloudCam Backend - HLS Support")
    print("=" * 50)
    print("📧 POST /api/login - Autenticação")
    print("📷 GET /api/cameras - Listar câmeras")
    print("🎬 GET /api/stream/{id} - Info do stream HLS")
    print("🖼️ GET /api/thumbnail/{id} - Thumbnail")
    print("=" * 50)

    uvicorn.run(
        "main:app",
        host="0.0.0.0",
        port=8000,
        reload=True,
        log_level="info"
    )
