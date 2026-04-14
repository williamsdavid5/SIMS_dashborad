// CloudCamPlayerModal.jsx - Versão simplificada
import './styles/cloudCamPlayerModal.css';
import { useEffect, useRef, useState } from 'react';
import Hls from 'hls.js';

export default function CloudCamPlayerModal({ setModalPlayer, camera, streamUrl, enableDetection = false }) {
    const [telaInteira, setTelaInteira] = useState(false);

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

    useEffect(() => {
        if (enableDetection) return;  // Não usa HLS quando detecção está ativa

        const video = videoRef.current;
        const finalStreamUrl = getStreamUrl();

        if (!video || !finalStreamUrl) return;

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
            });

            hlsRef.current = hls;
        } else {
            video.src = finalStreamUrl;
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
                    <p>Status: {camera.status === 'online' ? 'Online' : 'Offline'}</p>
                    {enableDetection && <p style={{ color: '#4CAF50' }}>Detecção ATIVA</p>}
                    <button className={`botaoTelaInteira`} onClick={() => { setTelaInteira(!telaInteira) }}>
                        Tela inteira
                    </button>
                    <button onClick={() => setModalPlayer(false)} className='botaoFecharModal'>
                        Fechar
                    </button>
                </div>
                <div className='auxVideo'>
                    {enableDetection ? (
                        <img
                            ref={imgRef}
                            className='playerVideo'
                            alt={`Camera ${camera.nome} com detecção`}
                        />
                    ) : (
                        <video
                            ref={videoRef}
                            controls
                            autoPlay
                            playsInline
                            className='playerVideo'
                        />
                    )}
                </div>
            </main>
        </div>
    );
}