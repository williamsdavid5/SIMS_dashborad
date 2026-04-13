import './styles/cloudCamPlayerModal.css';
import { useEffect, useRef } from 'react';
import Hls from 'hls.js';

export default function CloudCamPlayerModal({ setModalPlayer, camera, streamUrl }) {
    const videoRef = useRef(null);
    const hlsRef = useRef(null);

    useEffect(() => {
        const video = videoRef.current;

        if (!video || !streamUrl) return;

        // Limpa player anterior
        if (hlsRef.current) {
            hlsRef.current.destroy();
        }

        // Verifica se é HLS (.m3u8)
        if (streamUrl.includes('.m3u8')) {
            if (Hls.isSupported()) {
                const hls = new Hls({
                    debug: false,
                    enableWorker: true,
                    lowLatencyMode: true,
                });

                hls.loadSource(streamUrl);
                hls.attachMedia(video);
                hls.on(Hls.Events.MANIFEST_PARSED, () => {
                    video.play().catch(e => console.log('Autoplay prevented:', e));
                });

                hlsRef.current = hls;
            } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
                // Safari nativo
                video.src = streamUrl;
                video.addEventListener('loadedmetadata', () => {
                    video.play().catch(e => console.log('Autoplay prevented:', e));
                });
            }
        } else {
            // Stream direto
            video.src = streamUrl;
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
    }, [streamUrl]);

    return (
        <div className='modalBackground'>
            <main className='janelaModalPlayer'>
                <div className='topoModalPlayer'>
                    <p><b>{camera.nome}</b></p>
                    <p>Status: {camera.status === 'online' ? 'Online' : 'Offline'}</p>
                    <button onClick={() => setModalPlayer(false)} className='botaoFecharModal'>
                        Fechar
                    </button>
                </div>
                <div className='auxVideo'>
                    <video
                        ref={videoRef}
                        controls
                        autoPlay
                        playsInline
                        className='playerVideo'
                    />
                </div>
            </main>
        </div>
    );
}