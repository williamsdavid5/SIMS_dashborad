import './conformidade.css'
import { useState, useEffect } from 'react'
import {
    Label,
    RadialBarChart,
    RadialBar,
    PolarAngleAxis,
    ResponsiveContainer,
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    LineChart,
    Line,
    ReferenceLine
} from "recharts";

export default function Conformidade() {

    const mediaMensalConformidade = [
        {
            name: 'Média mensal de conformidade',
            value: 86
        }
    ]

    const conformidadeHoje = [
        {
            name: 'Taxa de conformidade',
            value: 78
        }
    ]

    const dadosSazonalidadeHora = [
        { hora: "06h", conformidade: 72 },
        { hora: "07h", conformidade: 78 },
        { hora: "08h", conformidade: 84 },
        { hora: "09h", conformidade: 88 },
        { hora: "10h", conformidade: 91 },
        { hora: "11h", conformidade: 89 },
        { hora: "12h", conformidade: 83 },
        { hora: "13h", conformidade: 80 },
        { hora: "14h", conformidade: 86 },
        { hora: "15h", conformidade: 90 },
        { hora: "16h", conformidade: 92 },
        { hora: "17h", conformidade: 88 },
        { hora: "18h", conformidade: 81 }
    ];

    const dadosEvolucaoConformidade = [
        { mes: "Jul", conformidade: 88 },
        { mes: "Ago", conformidade: 89 },
        { mes: "Set", conformidade: 90 },
        { mes: "Out", conformidade: 91 },
        { mes: "Nov", conformidade: 92 },
        { mes: "Dez", conformidade: 90 },
        { mes: "Jan", conformidade: 87 },
        { mes: "Fev", conformidade: 89 },
        { mes: "Mar", conformidade: 91 },
        { mes: "Abr", conformidade: 93 },
        { mes: "Mai", conformidade: 94 },
        { mes: "Jun", conformidade: 92 }
    ];

    return (
        <>
            <main className='distribuicaoMain conformidadeMain'>
                <div className='distribuicaoBloco'>
                    <h3>Média geral de conformidade este mês</h3>
                    <hr />
                    <ResponsiveContainer width="100%" height="100%">
                        <RadialBarChart
                            innerRadius="60%"
                            outerRadius="100%"
                            data={
                                mediaMensalConformidade
                            }
                            startAngle={90}
                            endAngle={450}
                        >
                            <Label
                                value={`${mediaMensalConformidade[0].value}%`}
                                position="center"
                                style={{
                                    fontSize: "20px",
                                    fontWeight: "bold",
                                    fill: "#333"
                                }}
                            />
                            <PolarAngleAxis
                                type="number"
                                domain={[0, 100]}
                                tick={false}
                            />

                            <RadialBar
                                dataKey="value"
                                fill="var(--azulDetaque)"
                                cornerRadius={5}
                                background={{ fill: "var(--bordaCor)" }}
                            /> </RadialBarChart>
                    </ResponsiveContainer>
                </div>
                <div className='distribuicaoBloco'>
                    <h3>Taxa de conformidade Hoje</h3>
                    <hr />
                    <ResponsiveContainer width="100%" height="100%">
                        <RadialBarChart
                            innerRadius="60%"
                            outerRadius="100%"
                            data={
                                conformidadeHoje
                            }
                            startAngle={90}
                            endAngle={450}
                        >
                            <Label
                                value={`${conformidadeHoje[0].value}%`}
                                position="center"
                                style={{
                                    fontSize: "20px",
                                    fontWeight: "bold",
                                    fill: "#333"
                                }}
                            />

                            <PolarAngleAxis
                                type="number"
                                domain={[0, 100]}
                                tick={false}
                            />

                            <RadialBar
                                dataKey="value"
                                fill="var(--azulDetaque)"
                                cornerRadius={5}
                                background={{ fill: "var(--bordaCor)" }}
                            /> </RadialBarChart>
                    </ResponsiveContainer>
                </div>
                <div className='distribuicaoBloco sazonalidade'>
                    <p><b>Sazonalidade por hora do dia</b></p>
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={dadosSazonalidadeHora}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="hora" />
                            <YAxis domain={[0, 100]} />
                            <Tooltip />
                            <Bar
                                dataKey="conformidade"
                                fill="var(--azulDetaque)"
                                radius={[4, 4, 0, 0]}
                            />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
                <div className='distribuicaoBloco evolucaoConformidade'>
                    <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={dadosEvolucaoConformidade}>
                            <CartesianGrid strokeDasharray="3 3" />

                            <XAxis dataKey="mes" />

                            <YAxis domain={[80, 100]} />

                            <Tooltip />

                            <ReferenceLine
                                y={95}
                                stroke="red"
                                strokeDasharray="5 5"
                                label="Meta 95%"
                            />

                            <Line
                                type="monotone"
                                dataKey="conformidade"
                                stroke="var(--azulDestaque)"
                                strokeWidth={3}
                                dot={{ r: 4 }}
                            />
                        </LineChart>
                    </ResponsiveContainer>
                </div>
            </main>

        </>
    )
}