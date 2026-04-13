import MenuLateral from "./MenuLateral"
import './styles/monitoramento.css'

import React, { useState, useEffect } from 'react';
import cloudcamApi from '../services/cloudcamApi';
import CloudCamPlayerModal from "./CloudCamPlayerModal";

export default function Monitoramento() {

    const [cameras, setCameras] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [modalPlayer, setModalPlayer] = useState(false);
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

            // Busca informações do stream
            const stream = await cloudcamApi.getStreamInfo(camera.id);
            setStreamInfo(stream);
            setSelectedCamera(camera);
            setModalPlayer(true);
        } catch (err) {
            console.error('Erro ao abrir stream:', err);
            alert('Não foi possível abrir o stream desta câmera');
        } finally {
            setLoadingStream(false);
        }
    };

    const handleClosePlayer = () => {
        setModalPlayer(false);
        setSelectedCamera(null);
        setStreamInfo(null);
    };

    if (loading) {
        return (
            <main className="dashboardMain">
                <MenuLateral />
                <section className="principalDash">
                    <header className='superiorDash'>
                        <h2>Monitoramento ao vivo</h2>
                        <p>Carregando câmeras...</p>
                    </header>
                    <div className="camerasBlocos">
                        <div className="loading">Aguarde, carregando...</div>
                    </div>
                </section>
            </main>
        );
    }

    if (error) {
        return (
            <main className="dashboardMain">
                <MenuLateral />
                <section className="principalDash">
                    <header className='superiorDash'>
                        <h2>Monitoramento ao vivo</h2>
                        <p>Erro na conexão</p>
                    </header>
                    <div className="camerasBlocos">
                        <div className="error">
                            {error}
                            <button onClick={() => window.location.reload()} className="retryBtn">
                                Tentar novamente
                            </button>
                        </div>
                    </div>
                </section>
            </main>
        );
    }

    return (
        <main className="dashboardMain">
            <MenuLateral />
            <section className="principalDash">

                <header className='superiorDash'>
                    <h2>Monitoramento ao vivo</h2>
                    <p>Feedback visual sobre o monitoramento, observe dados relevantes.</p>
                </header>

                <div className="camerasBlocos">
                    {cameras.map((camera) => (
                        <div
                            className="blocoCamera"
                            key={camera.id}
                            onClick={() => handleCameraClick(camera)}
                            style={{ cursor: 'pointer' }}
                        >
                            <div className="thumbCamera">
                                {camera.has_thumb ? (
                                    <img
                                        src={`http://localhost:8000/api/thumbnail/${camera.id}`}
                                        alt={camera.nome}
                                        onError={(e) => {
                                            e.target.style.display = 'none';
                                            e.target.parentElement.innerHTML = '<p>Sem prévia</p>';
                                        }}
                                    />
                                ) : (
                                    <p>Sem prévia</p>
                                )}
                            </div>
                            <div className="infoCamera">
                                <p className="nomeCamera">{camera.nome}</p>
                                <p className={`statusCamera ${camera.status}`}>
                                    {camera.status === 'online' ? 'Online' : 'Offline'}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>

                {loadingStream && (
                    <div className="loadingOverlay">
                        <div className="loadingContent">
                            <p>Carregando stream...</p>
                        </div>
                    </div>
                )}

                {modalPlayer && selectedCamera && streamInfo && (
                    <CloudCamPlayerModal
                        setModalPlayer={handleClosePlayer}
                        camera={selectedCamera}
                        streamUrl={streamInfo.stream_url}
                    />
                )}

            </section>
        </main>
    )
}