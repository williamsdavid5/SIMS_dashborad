import MenuLateral from "./MenuLateral"
import { useEffect } from 'react'
import './styles/monitoramento.css'

import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, LabelList } from "recharts";

function BlocoCamera({ data }) {

    const confianca = data.confianca;

    const chartData = [
        { name: "valor", value: confianca },
        { name: "resto", value: 100 - confianca }
    ];

    const corValor =
        confianca < 40 ? "red" :
            confianca < 70 ? "gold" :
                "green";
    const corRestante = "var(--bordaCor)";

    return (
        <div className="blocoCamera">
            <div className="esquerda">
                <h1>{data.camera}</h1>
                <p><b>{data.area}</b></p>
                <hr />
            </div>

            <div className="direita">
                <ResponsiveContainer width="100%" height="100%">
                    <PieChart>

                        <Pie
                            data={chartData}
                            dataKey="value"
                            startAngle={180}
                            endAngle={0}
                            cx="50%"
                            cy="100%"
                            innerRadius={0}
                            outerRadius={90}
                            stroke="none"
                        >
                            <Cell fill={corValor} />
                            <Cell fill={corRestante} />
                        </Pie>
                    </PieChart>
                </ResponsiveContainer>
                <text
                    x="50%"
                    y="90%"
                    textAnchor="middle"
                    fontSize="18"
                    fontWeight="bold"
                >
                    {confianca}% de confiança
                </text>
            </div>
        </div>
    )
}

export default function Monitoramento() {

    const data = [
        { camera: 'CAM-01', area: 'Frente de Lavra - Norte', confianca: 88 },
        { camera: 'CAM-02', area: 'Britagem Primária', confianca: 80 },
        { camera: 'CAM-03', area: 'Correia Transportadora 04', confianca: 45 },
        { camera: 'CAM-04', area: 'Pátio de Estocagem', confianca: 78 },
        { camera: 'CAM-05', area: 'Oficina de Máquinas Pesadas', confianca: 95 },
        { camera: 'CAM-06', area: 'Barragem de Rejeitos - Talude A', confianca: 69 },
        { camera: 'CAM-07', area: 'Moagem de Minério', confianca: 62 },
        { camera: 'CAM-08', area: 'Peneiramento Vibratório', confianca: 34 },
        { camera: 'CAM-09', area: 'Acesso Principal - Portaria', confianca: 100 },
        { camera: 'CAM-10', area: 'Flotação de Cobre', confianca: 81 },
        { camera: 'CAM-11', area: 'Espessador de Concentrado', confianca: 56 },
        { camera: 'CAM-12', area: 'Laboratório Químico', confianca: 94 },
        { camera: 'CAM-13', area: 'Estação de Tratamento de Água', confianca: 87 },
        { camera: 'CAM-14', area: 'Depósito de Explosivos', confianca: 98 },
        { camera: 'CAM-15', area: 'Pilha Pulmão', confianca: 41 },
        { camera: 'CAM-16', area: 'Carregamento de Vagões', confianca: 89 },
        { camera: 'CAM-17', area: 'Refeitório Central', confianca: 91 },
        { camera: 'CAM-18', area: 'Área de Descarte de Estéril', confianca: 29 },
        { camera: 'CAM-19', area: 'Subestação Elétrica', confianca: 97 },
        { camera: 'CAM-20', area: 'Almoxarifado Geral', confianca: 83 },
        { camera: 'CAM-21', area: 'Dique de Contenção 02', confianca: 93 },
        { camera: 'CAM-22', area: 'Pátio de Combustíveis', confianca: 96 },
        { camera: 'CAM-23', area: 'Silo de Armazenamento', confianca: 54 },
        { camera: 'CAM-24', area: 'Área de Preservação Ambiental', confianca: 75 },
        // { camera: 'CAM-25', area: 'Centro de Controle Operacional', confianca: 99 }
    ];

    const getCorValor = (confianca) =>
        confianca < 40 ? "red" :
            confianca < 70 ? "gold" :
                "green";

    const corRestante = "var(--corJanela)";

    return (
        <main className="dashboardMain">
            <MenuLateral />
            <section className="principalDash">

                <header className='superiorDash'>
                    <h2>Monitoramento ao vivo</h2>
                    <p>Feedback visual sobre o monitoramento, observe dados relevantes.</p>
                </header>

                <div className="camerasBlocos">
                    <div className="blocoGraficoGeralCamreas">
                        <div className="divAuxGraficoCameras">
                            <ResponsiveContainer width="100%" height="90%" className={'containerGraficoBarra'}>
                                <BarChart
                                    data={data}
                                    margin={{ top: 40, right: 20, left: 20, bottom: 10 }}
                                >
                                    <XAxis
                                        dataKey="camera"
                                        type="category"
                                        angle={-90}
                                        textAnchor="end"
                                        interval={0}
                                        height={70}
                                    />

                                    <LabelList
                                        dataKey="confianca"
                                        position="insideTop"
                                        formatter={(v) => `${v}%`}
                                    />

                                    <Bar
                                        dataKey="confianca"
                                        background={{ fill: corRestante }}
                                        radius={[4, 4, 0, 0]}
                                    >

                                        {data.map((entry, index) => (
                                            <Cell
                                                key={`cell-${index}`}
                                                fill={getCorValor(entry.confianca)}
                                            />
                                        ))}

                                        <LabelList
                                            dataKey="confianca"
                                            position="top"
                                            formatter={(v) => `${v}%`}
                                        />

                                    </Bar>
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                    {data.map((camera) => {
                        return (
                            <BlocoCamera data={camera} />
                        )
                    })}
                </div>

            </section>
        </main>
    )
}