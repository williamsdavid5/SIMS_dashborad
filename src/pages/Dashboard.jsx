// Dashboard.jsx (modificado)
import './styles/dashboard.css'
import MenuLateral from './MenuLateral'
import ModalImg from './ModalImg';
import { useState } from 'react'
import { useDashboard } from '../context/DashboardContext';

import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    Cell,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
    LineChart,
    Line,
    PieChart,
    Pie
} from "recharts";

export default function Dashboard() {
    const {
        loading,
        error,
        totalHoje,
        taxaConformidade,
        cameraCritica,
        falsosPositivos,
        intervaloMaisOcorrencias,
        ocorrenciasPorTipoData,
        ocorrenciasPorHoraData,
        distribuicaoPorCameraData,
        ultimasOcorrencias,
        historicoCompleto,
        analiseEstatistica
    } = useDashboard();

    const COLORS = ["#0A1E43", "#243757", "#4b6185", "#879dc0"];

    const [modalImagem, setModalImagem] = useState(false);
    const [dadosOcorrencia, setDadosOcorrencia] = useState([]);

    const formatarData = (dataISO) => {
        const data = new Date(dataISO);
        return data.toLocaleString("pt-BR");
    };

    if (loading) {
        return (
            <main className="dashboardMain">
                <MenuLateral />
                <section className='principalDash'>
                    <div className="loading-container">
                        <p>Carregando dados do dashboard...</p>
                    </div>
                </section>
            </main>
        );
    }

    if (error) {
        return (
            <main className="dashboardMain">
                <MenuLateral />
                <section className='principalDash'>
                    <div className="error-container">
                        <p>Erro ao carregar dados: {error}</p>
                        <button onClick={() => window.location.reload()}>Tentar novamente</button>
                    </div>
                </section>
            </main>
        );
    }

    return (
        <>
            <main className="dashboardMain">
                <MenuLateral></MenuLateral>
                <section className='principalDash'>
                    <header className='superiorDash'>
                        <h2>Dashboard</h2>
                        <p>Feedback visual sobre o monitoramento, observe dados relevantes.</p>
                    </header>
                    <section className='blocosDash'>
                        <div className='bloco infoNumerica'>
                            <p className='tituloBloco'>Total hoje</p>
                            <h1>{totalHoje}</h1>
                        </div>
                        <div className='bloco infoNumerica'>
                            <p className='tituloBloco'>Taxa de conformidade</p>
                            <h1>{taxaConformidade}%</h1>
                        </div>
                        <div className='bloco infoNumerica cameraCritica'>
                            <p className='tituloBloco'>Câmera crítica</p>
                            <h1>{cameraCritica}</h1>
                        </div>
                        <div className='bloco distribuicaoPorCamera'>
                            <p className='tituloBloco'>Distribuição por câmera</p>
                            <div className='auxiliarGrafico'>
                                <ResponsiveContainer width="100%" height="100%">
                                    <PieChart>
                                        <Pie
                                            data={distribuicaoPorCameraData}
                                            dataKey="Quantidade"
                                            nameKey="camera"
                                            cx="50%"
                                            cy="50%"
                                            outerRadius="90%"
                                        >
                                            {distribuicaoPorCameraData.map((entry, index) => (
                                                <Cell
                                                    key={`cell-${index}`}
                                                    fill={COLORS[index % COLORS.length]}
                                                />
                                            ))}
                                        </Pie>
                                        <Tooltip />
                                        <Legend />
                                    </PieChart>
                                </ResponsiveContainer>
                            </div>
                        </div>
                        <div className='bloco inforOcorrenciasHora'>
                            <p className='tituloBloco'>Ocorrências por intervalo de horário</p>
                            <div className='auxiliarGrafico'>
                                <ResponsiveContainer width="90%" height="100%">
                                    <LineChart data={ocorrenciasPorHoraData}>
                                        <XAxis dataKey="Hora" />
                                        <YAxis />
                                        <Tooltip />
                                        <Line type="monotone" dataKey="Quantidade" stroke="var(--azulDestaque)" strokeWidth={3} />
                                    </LineChart>
                                </ResponsiveContainer>
                            </div>
                        </div>
                        <div className='bloco falsosPositivos'>
                            <p className='tituloBloco'>Falsos positívos</p>
                            <h1>{falsosPositivos}</h1>
                            <hr />
                            <p className='tituloBloco'>Intervalo com mais ocorrências</p>
                            <h1>{intervaloMaisOcorrencias}</h1>
                        </div>
                        <div className='bloco analiseEstatistica'>
                            <p className='tituloBloco'>Análise estatística</p>
                            <hr />
                            <p className='inforEstatistica'>
                                <b>Média diária:</b> {analiseEstatistica.mediaDiaria} Ocorrências <br />
                                <b>Total para esta semana: </b> {analiseEstatistica.totalSemana} Ocorrências <br />
                                <b>Média semanal:</b> {analiseEstatistica.mediaSemanal} Ocorrências <br />
                                <b>Média de tempo sem EPI:</b> {analiseEstatistica.mediaTempoSemEPI} <br />
                                <b>EPI mais crítico:</b> {analiseEstatistica.epiMaisCritico} <br />
                                <b>Câmera com maior incidência:</b> {analiseEstatistica.cameraMaiorIncidencia} <br />
                            </p>
                        </div>
                        <div className='bloco ocorrenciasPorTipo'>
                            <p className='tituloBloco'>Ocorrências por tipo</p>
                            <div className='auxiliarGrafico'>
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart data={ocorrenciasPorTipoData}>
                                        <CartesianGrid strokeDasharray="1 1" />
                                        <XAxis dataKey="tipo" />
                                        <YAxis />
                                        <Tooltip />
                                        <Bar dataKey="Quantidade" fill="var(--azulDestaque)" />
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>
                        </div>
                        <div className='bloco ultimasOcorrencias'>
                            <p className='tituloBloco'>Últimas ocorrências</p>
                            <table border={1} className='tabelaUltimasOcorrencias'>
                                <thead>
                                    <tr>
                                        <th>Data</th>
                                        <th>Câmera</th>
                                        <th>Item envolvido</th>
                                        <th>Imagem</th>
                                    </tr>
                                </thead>

                                <tbody>
                                    {ultimasOcorrencias.map((ocorrencia) => (
                                        <tr key={ocorrencia.id}>
                                            <td>{formatarData(ocorrencia.data)}</td>
                                            <td>{ocorrencia.camera}</td>
                                            <td>{ocorrencia.item}</td>
                                            <td>
                                                <button
                                                    className='botaoVerImagem'
                                                    onClick={() => {
                                                        setModalImagem(true);
                                                        setDadosOcorrencia({
                                                            data: ocorrencia.data,
                                                            camera: ocorrencia.camera,
                                                            item: ocorrencia.item
                                                        });
                                                    }}
                                                >Ver</button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                        <div className='bloco historicoCompleto'>
                            <p className='tituloBloco'>Histórico completo</p>
                            <table border={1} className='tabelaUltimasOcorrencias'>
                                <thead>
                                    <tr>
                                        <th>Data</th>
                                        <th>Câmera</th>
                                        <th>Item envolvido</th>
                                        <th>Imagem</th>
                                        <th>Confiança</th>
                                        <th>Status</th>
                                    </tr>
                                </thead>

                                <tbody>
                                    {historicoCompleto.map((ocorrencia) => (
                                        <tr key={ocorrencia.id}>
                                            <td>{formatarData(ocorrencia.data)}</td>
                                            <td>{ocorrencia.camera}</td>
                                            <td>{ocorrencia.item}</td>
                                            <td>
                                                <button
                                                    className='botaoVerImagem'
                                                    onClick={() => {
                                                        setModalImagem(true);
                                                        setDadosOcorrencia({
                                                            data: ocorrencia.data,
                                                            camera: ocorrencia.camera,
                                                            item: ocorrencia.item
                                                        });
                                                    }}
                                                >Ver</button>
                                            </td>
                                            <td>{ocorrencia.confianca}</td>
                                            <td>
                                                <p className={
                                                    ocorrencia.status === 'Em análise' ? 'analise' :
                                                        ocorrencia.status === 'Não confirmado' ? 'naoConfirmado' :
                                                            ocorrencia.status === 'Confirmado' ? 'confirmado' : ''
                                                }>
                                                    {ocorrencia.status}
                                                </p>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </section>
                </section>
                {modalImagem && (
                    <ModalImg setModalImagem={setModalImagem} dadosOcorrencia={dadosOcorrencia}></ModalImg>
                )}
            </main>
        </>
    );
}