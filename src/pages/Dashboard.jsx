import './styles/dashboard.css'
import MenuLateral from './MenuLateral'
import { useState } from 'react'

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
    const [totalHoje, setTotalHoje] = useState(27);
    const [taxaConformidade, setTaxaConformidade] = useState(91);
    const [cameraCritica, setCameraCritica] = useState("CAM03");
    const [falsosPositivos, setFalsosPositivos] = useState(4);
    const [intervaloMaisOcorrencias, setIntervaloMaisOcorrencias] = useState('10:00');

    const data = [
        { name: "Jan", valor: 40 },
        { name: "Fev", valor: 55 },
        { name: "Mar", valor: 78 },
        { name: "Abr", valor: 62 }
    ];

    const ocorrenciasPorTipoData = [
        { tipo: "Capacete", Quantidade: 3 },
        { tipo: "Óculos", Quantidade: 12 },
        { tipo: "Luvas", Quantidade: 10 },
    ];

    const ocorrenciasPorHoraData = [
        { Hora: "07:00", Quantidade: 3 },
        { Hora: "08:00", Quantidade: 0 },
        { Hora: "09:00", Quantidade: 2 },
        { Hora: "10:00", Quantidade: 4 },
        { Hora: "11:00", Quantidade: 0 },
        { Hora: "12:00", Quantidade: 1 },
        { Hora: "13:00", Quantidade: 1 },
        { Hora: "14:00", Quantidade: 3 },
    ]

    const distribuicaoPorCameraData = [
        { camera: "CAM01", Quantidade: 3 },
        { camera: "CAM02", Quantidade: 6 },
        { camera: "CAM03", Quantidade: 7 }
    ]

    const COLORS = ["#0A1E43", "#243757", "#364765", "#4F5F79"];


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
                                        // label
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
                        </div>
                        <div className='bloco ocorrenciasPorTipo'>
                            <p className='tituloBloco'>Ocorrências por tipo</p>
                            <div className='auxiliarGrafico'>
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart data={ocorrenciasPorTipoData}>
                                        {/* <Legend /> */}
                                        <CartesianGrid strokeDasharray="1 1" />
                                        <XAxis dataKey="tipo" />
                                        <YAxis />
                                        <Tooltip />
                                        <Bar dataKey="Quantidade" fill="var(--azulDestaque)" />
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>
                        </div>
                        {/* <div className='bloco falsosPositivos'>
                            <p className='tituloBloco'>Horário com mais ocorrências</p>
                            <h1>{falsosPositivos}</h1>
                        </div> */}
                        <div className='bloco ultimasOcorrencias'>
                            <p className='tituloBloco'>Últimas ocorrências</p>
                        </div>
                        <div className='bloco historicoCompleto'>
                            <p className='tituloBloco'>Histórico completo</p>
                        </div>
                    </section>
                </section>
            </main>
        </>
    )
}