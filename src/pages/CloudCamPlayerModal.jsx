// CloudCamPlayerModal.jsx - Com indicador de carregamento
import './styles/cloudCamPlayerModal.css';
import { useEffect, useRef, useState } from 'react';
import Hls from 'hls.js';
import LoadingGif from '../assets/loading.gif'

export default function CloudCamPlayerModal({ setModalPlayer, camera, streamUrl }) {
    const [telaInteira, setTelaInteira] = useState(false);
    const [enableDetection, setEnableDetection] = useState(true);
    const [isLoading, setIsLoading] = useState(true); // NOVO: estado de carregamento

    const videoRef = useRef(null);
    const hlsRef = useRef(null);
    const imgRef = useRef(null);  // Para MJPEG

    // Constrói a URL correta baseada no modo
    const getStreamUrl = () => {
        if (enableDetection) {
            // Usa o endpoint com detecção (MJPEG)
            return `http://localhost:8000/api/stream-detected/${camera.id}`;
        }
        // Usa o stream original (HLS)
        return streamUrl;
    };

    // NOVO: Monitora quando a imagem carregou
    const handleImageLoad = () => {
        console.log('✅ Imagem carregada');
        setIsLoading(false);
    };

    // NOVO: Monitora erro na imagem
    const handleImageError = () => {
        console.log('❌ Erro ao carregar imagem');
        setIsLoading(true);
        // Tenta recarregar após 3 segundos
        setTimeout(() => {
            if (imgRef.current) {
                imgRef.current.src = getStreamUrl();
            }
        }, 3000);
    };

    // Monitora carregamento do vídeo (modo sem detecção)
    const handleVideoLoad = () => {
        console.log('✅ Vídeo carregado');
        setIsLoading(false);
    };

    const handleVideoError = () => {
        console.log('❌ Erro no vídeo');
        setIsLoading(true);
    };

    useEffect(() => {
        if (enableDetection) return;  // Não usa HLS quando detecção está ativa

        const video = videoRef.current;
        const finalStreamUrl = getStreamUrl();

        if (!video || !finalStreamUrl) return;

        // Reseta loading quando troca de stream
        setIsLoading(true);

        if (hlsRef.current) {
            hlsRef.current.destroy();
        }

        if (finalStreamUrl.includes('.m3u8') && Hls.isSupported()) {
            const hls = new Hls({
                debug: false,
                enableWorker: true,
                lowLatencyMode: true,
            });

            hls.loadSource(finalStreamUrl);
            hls.attachMedia(video);

            hls.on(Hls.Events.MANIFEST_PARSED, () => {
                video.play().catch(e => console.log('Autoplay prevented:', e));
                setIsLoading(false); // Esconde loading quando o HLS carregou
            });

            hls.on(Hls.Events.ERROR, () => {
                setIsLoading(true); // Mostra loading em caso de erro
            });

            hlsRef.current = hls;
        } else {
            video.src = finalStreamUrl;
            // Para streams diretos, aguarda o evento canplay
            video.addEventListener('canplay', () => setIsLoading(false));
            video.addEventListener('error', () => setIsLoading(true));
        }

        return () => {
            if (video) {
                video.pause();
                video.src = '';
            }
            if (hlsRef.current) {
                hlsRef.current.destroy();
            }
        };
    }, [streamUrl, camera.id, enableDetection]);

    useEffect(() => {
        if (!enableDetection) return;

        const img = imgRef.current;
        const finalStreamUrl = getStreamUrl();

        if (!img || !finalStreamUrl) return;

        console.log('🖼️ Iniciando stream MJPEG com detecção:', finalStreamUrl);

        // Reseta loading quando troca de stream
        setIsLoading(true);

        // Adiciona timestamp para evitar cache
        img.src = finalStreamUrl;

        return () => {
            if (img) {
                img.src = '';
            }
        };
    }, [enableDetection, camera.id]);

    return (
        <div className='modalBackground'>
            <main className={`janelaModalPlayer ${telaInteira && 'telaInteira'}`}>
                <div className='topoModalPlayer'>
                    <p><b>{camera.nome}</b></p>
                    {/* <p>Status: {camera.status === 'online' ? 'Online' : 'Offline'}</p> */}
                    <label htmlFor="">
                        <input type="checkbox" checked={enableDetection} onChange={(e => setEnableDetection(e.target.checked))} />
                        Ativar detecção
                    </label>
                    <button className={`botaoTelaInteira`} onClick={() => { setTelaInteira(!telaInteira) }}>
                        Tela inteira
                    </button>
                    <button onClick={() => setModalPlayer(false)} className='botaoFecharModal'>
                        Fechar
                    </button>
                </div>
                <div className='auxVideo'>
                    {/* NOVO: Indicador de carregamento */}
                    {isLoading && (
                        <div className="loadingOverlayPlayer">
                            <div className="loadingSpinnerPlayer">
                                <img src={LoadingGif} alt="" />
                                <p>Carregando stream...</p>
                            </div>

                        </div>
                    )}

                    {enableDetection ? (
                        <img
                            ref={imgRef}
                            className='playerVideo'
                            alt={`Camera ${camera.nome} com detecção`}
                            onLoad={handleImageLoad}
                            onError={handleImageError}
                            style={{ display: isLoading ? 'none' : 'block' }}
                        />
                    ) : (
                        <video
                            ref={videoRef}
                            controls
                            autoPlay
                            playsInline
                            className='playerVideo'
                            onCanPlay={handleVideoLoad}
                            onError={handleVideoError}
                            style={{ display: isLoading ? 'none' : 'block' }}
                        />
                    )}
                </div>
            </main>
        </div>
    );
}