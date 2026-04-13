import React, { useRef, useEffect } from 'react';
import Hls from 'hls.js';

const CloudCamPlayer = ({ streamUrl, cameraName, onClose }) => {
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

                // Cleanup
                return () => {
                    if (hlsRef.current) {
                        hlsRef.current.destroy();
                    }
                };
            } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
                // Safari nativo
                video.src = streamUrl;
                video.addEventListener('loadedmetadata', () => {
                    video.play().catch(e => console.log('Autoplay prevented:', e));
                });
            }
        } else {
            // Stream direto (MJPEG, etc)
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
        <div style={styles.overlay}>
            <div style={styles.modal}>
                <div style={styles.header}>
                    <h3>{cameraName}</h3>
                    <button onClick={onClose} style={styles.closeBtn}>✕</button>
                </div>
                <div style={styles.videoContainer}>
                    <video
                        ref={videoRef}
                        controls
                        autoPlay
                        playsInline
                        style={styles.video}
                    />
                </div>
                <div style={styles.footer}>
                    <button onClick={onClose} style={styles.closeButton}>
                        Fechar
                    </button>
                </div>
            </div>
        </div>
    );
};

const styles = {
    overlay: {
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.9)',
        zIndex: 9999,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
    },
    modal: {
        backgroundColor: '#1a1a1a',
        borderRadius: '8px',
        width: '90%',
        maxWidth: '1200px',
        height: '80%',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
    },
    header: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '15px 20px',
        backgroundColor: '#2d2d2d',
        color: 'white',
        borderBottom: '1px solid #444',
    },
    videoContainer: {
        flex: 1,
        backgroundColor: '#000',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
    },
    video: {
        width: '100%',
        height: '100%',
        objectFit: 'contain',
    },
    footer: {
        padding: '15px',
        textAlign: 'center',
        borderTop: '1px solid #444',
    },
    closeBtn: {
        background: 'none',
        border: 'none',
        color: 'white',
        fontSize: '24px',
        cursor: 'pointer',
        padding: '0 10px',
    },
    closeButton: {
        padding: '8px 20px',
        backgroundColor: '#dc3545',
        color: 'white',
        border: 'none',
        borderRadius: '4px',
        cursor: 'pointer',
        fontSize: '14px',
    },
};

export default CloudCamPlayer;