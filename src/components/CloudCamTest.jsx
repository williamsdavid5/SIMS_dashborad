import React, { useState, useEffect } from 'react';
import cloudcamApi from '../services/cloudcamApi';
import CloudCamPlayer from './CloudCamPlayer';

const CloudCamTest = () => {
    const [cameras, setCameras] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedCamera, setSelectedCamera] = useState(null);
    const [streamInfo, setStreamInfo] = useState(null);
    const [loadingStream, setLoadingStream] = useState(false);

    // Login automático e carregamento das câmeras
    useEffect(() => {
        const init = async () => {
            try {
                setLoading(true);
                // Login automático
                await cloudcamApi.login();
                // Carrega câmeras
                const camerasList = await cloudcamApi.getCameras();
                setCameras(camerasList);
                setError(null);
            } catch (err) {
                setError('Erro ao conectar com o servidor. Verifique se o backend está rodando.');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        init();
    }, []);

    const handleCameraClick = async (camera) => {
        try {
            setLoadingStream(true);
            setSelectedCamera(camera);

            // Busca informações do stream
            const stream = await cloudcamApi.getStreamInfo(camera.id);
            setStreamInfo(stream);
        } catch (err) {
            console.error('Erro ao abrir stream:', err);
            alert('Não foi possível abrir o stream desta câmera');
            setSelectedCamera(null);
        } finally {
            setLoadingStream(false);
        }
    };

    const handleClosePlayer = () => {
        setSelectedCamera(null);
        setStreamInfo(null);
    };

    if (loading) {
        return (
            <div style={styles.container}>
                <div style={styles.loading}>
                    <div>🔄 Conectando ao servidor...</div>
                    <div style={styles.subtext}>Fazendo login e carregando câmeras</div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div style={styles.container}>
                <div style={styles.error}>
                    <div>❌ {error}</div>
                    <button onClick={() => window.location.reload()} style={styles.retryBtn}>
                        Tentar novamente
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div style={styles.container}>
            <div style={styles.header}>
                <h1>📹 CloudCam - Teste de Integração</h1>
                <div style={styles.info}>
                    <span>✅ Conectado</span>
                    <span>📷 {cameras.length} câmeras disponíveis</span>
                </div>
            </div>

            <div style={styles.cameraGrid}>
                {cameras.map((camera) => (
                    <div
                        key={camera.id}
                        style={styles.cameraCard}
                        onClick={() => handleCameraClick(camera)}
                    >
                        <div style={styles.thumbnail}>
                            {camera.has_thumb ? (
                                <img
                                    src={`http://localhost:8000/api/thumbnail/${camera.id}`}
                                    alt={camera.nome}
                                    style={styles.thumbImage}
                                    onError={(e) => {
                                        e.target.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="100" height="100" viewBox="0 0 24 24" fill="none" stroke="%23666" stroke-width="2"%3E%3Crect x="2" y="2" width="20" height="20" rx="2.18"%3E%3C/rect%3E%3Ccircle cx="8.5" cy="8.5" r="1.5"%3E%3C/circle%3E%3Cpath d="M21 15l-5-4-3 3-4-4-5 5"%3E%3C/path%3E%3C/svg%3E';
                                    }}
                                />
                            ) : (
                                <div style={styles.noThumb}>📷</div>
                            )}
                        </div>
                        <div style={styles.cameraInfo}>
                            <div style={styles.cameraName}>{camera.nome}</div>
                            <div style={styles.cameraStatus}>
                                <span style={{
                                    ...styles.statusDot,
                                    backgroundColor: camera.status === 'online' ? '#4caf50' : '#f44336'
                                }} />
                                {camera.status}
                            </div>
                            {camera.has_stream && (
                                <div style={styles.streamBadge}>HLS</div>
                            )}
                        </div>
                    </div>
                ))}
            </div>

            {loadingStream && (
                <div style={styles.loadingOverlay}>
                    <div style={styles.loadingContent}>
                        <div>🎥 Carregando stream...</div>
                    </div>
                </div>
            )}

            {selectedCamera && streamInfo && (
                <CloudCamPlayer
                    streamUrl={streamInfo.stream_url}
                    cameraName={selectedCamera.nome}
                    onClose={handleClosePlayer}
                />
            )}
        </div>
    );
};

const styles = {
    container: {
        padding: '20px',
        maxWidth: '1400px',
        margin: '0 auto',
        fontFamily: 'Arial, sans-serif',
    },
    header: {
        marginBottom: '30px',
        borderBottom: '2px solid #e0e0e0',
        paddingBottom: '20px',
    },
    info: {
        display: 'flex',
        gap: '20px',
        marginTop: '10px',
        color: '#666',
        fontSize: '14px',
    },
    cameraGrid: {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
        gap: '20px',
    },
    cameraCard: {
        border: '1px solid #e0e0e0',
        borderRadius: '8px',
        overflow: 'hidden',
        cursor: 'pointer',
        transition: 'transform 0.2s, box-shadow 0.2s',
        backgroundColor: 'white',
    },
    cameraCardHover: {
        transform: 'translateY(-4px)',
        boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
    },
    thumbnail: {
        height: '180px',
        backgroundColor: '#f5f5f5',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
    },
    thumbImage: {
        width: '100%',
        height: '100%',
        objectFit: 'cover',
    },
    noThumb: {
        fontSize: '48px',
        color: '#ccc',
    },
    cameraInfo: {
        padding: '15px',
        position: 'relative',
    },
    cameraName: {
        fontWeight: 'bold',
        fontSize: '16px',
        marginBottom: '8px',
        color: '#333',
    },
    cameraStatus: {
        display: 'flex',
        alignItems: 'center',
        gap: '6px',
        fontSize: '12px',
        color: '#666',
        textTransform: 'capitalize',
    },
    statusDot: {
        width: '8px',
        height: '8px',
        borderRadius: '50%',
        display: 'inline-block',
    },
    streamBadge: {
        position: 'absolute',
        top: '10px',
        right: '10px',
        backgroundColor: '#ff5722',
        color: 'white',
        padding: '2px 8px',
        borderRadius: '4px',
        fontSize: '10px',
        fontWeight: 'bold',
    },
    loading: {
        textAlign: 'center',
        padding: '50px',
        fontSize: '18px',
        color: '#666',
    },
    subtext: {
        fontSize: '12px',
        marginTop: '10px',
        color: '#999',
    },
    error: {
        textAlign: 'center',
        padding: '50px',
        color: '#f44336',
    },
    retryBtn: {
        marginTop: '20px',
        padding: '10px 20px',
        backgroundColor: '#2196f3',
        color: 'white',
        border: 'none',
        borderRadius: '4px',
        cursor: 'pointer',
    },
    loadingOverlay: {
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0,0,0,0.7)',
        zIndex: 9998,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
    },
    loadingContent: {
        backgroundColor: 'white',
        padding: '30px',
        borderRadius: '8px',
        textAlign: 'center',
    },
};

export default CloudCamTest;