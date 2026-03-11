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
    ReferenceLine,
    AreaChart,
    Area,
    Brush,
    Cell,
    RadarChart,
    Radar,
    PolarGrid,
    PolarRadiusAxis,
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

    const getCorConformidade = (valor) => {
        if (valor < 60) return "red";
        if (valor < 80) return "gold";
        return "green";
    };

    const dadosSazonalidadeHora = [
        { hora: "06h", conformidade: 23 },
        { hora: "07h", conformidade: 75 },
        { hora: "08h", conformidade: 84 },
        { hora: "09h", conformidade: 59 },
        { hora: "10h", conformidade: 91 },
        { hora: "11h", conformidade: 89 },
        { hora: "12h", conformidade: 43 },
        { hora: "13h", conformidade: 59 },
        { hora: "14h", conformidade: 86 },
        { hora: "15h", conformidade: 90 },
        { hora: "16h", conformidade: 63 },
        { hora: "17h", conformidade: 56 },
        { hora: "18h", conformidade: 44 }
    ];

    const dadosEvolucaoConformidade = [
        { mes: "Jul", conformidade: 48 },
        { mes: "Ago", conformidade: 53 },
        { mes: "Set", conformidade: 68 },
        { mes: "Out", conformidade: 74 },
        { mes: "Nov", conformidade: 70 },
        { mes: "Dez", conformidade: 69 },
        { mes: "Jan", conformidade: 82 },
        { mes: "Fev", conformidade: 78 },
        { mes: "Mar", conformidade: 86 },
        { mes: "Abr", conformidade: 89 },
        { mes: "Mai", conformidade: 94 },
        { mes: "Jun", conformidade: 92 }
    ];

    const dadosTendencia30Dias = [
        { dia: "01", conformidade: 89 },
        { dia: "02", conformidade: 90 },
        { dia: "03", conformidade: 88 },
        { dia: "04", conformidade: 91 },
        { dia: "05", conformidade: 92 },
        { dia: "06", conformidade: 90 },
        { dia: "07", conformidade: 87 },
        { dia: "08", conformidade: 88 },
        { dia: "09", conformidade: 89 },
        { dia: "10", conformidade: 90 },
        { dia: "11", conformidade: 92 },
        { dia: "12", conformidade: 93 },
        { dia: "13", conformidade: 91 },
        { dia: "14", conformidade: 90 },
        { dia: "15", conformidade: 89 },
        { dia: "16", conformidade: 91 },
        { dia: "17", conformidade: 92 },
        { dia: "18", conformidade: 94 },
        { dia: "19", conformidade: 93 },
        { dia: "20", conformidade: 92 },
        { dia: "21", conformidade: 91 },
        { dia: "22", conformidade: 90 },
        { dia: "23", conformidade: 89 },
        { dia: "24", conformidade: 91 },
        { dia: "25", conformidade: 92 },
        { dia: "26", conformidade: 94 },
        { dia: "27", conformidade: 93 },
        { dia: "28", conformidade: 92 },
        { dia: "29", conformidade: 94 },
        { dia: "30", conformidade: 95 }
    ];

    const dadosMediaMovel = dadosTendencia30Dias.map((item, index, array) => {
        const janela = array.slice(Math.max(0, index - 6), index + 1);

        const media =
            janela.reduce((acc, val) => acc + val.conformidade, 0) / janela.length;

        return {
            ...item,
            mediaMovel: Number(media.toFixed(2))
        };
    });

    const dadosRadarSemana = [
        { dia: "Seg", conformidade: 92 },
        { dia: "Ter", conformidade: 90 },
        { dia: "Qua", conformidade: 91 },
        { dia: "Qui", conformidade: 93 },
        { dia: "Sex", conformidade: 89 },
        { dia: "Sáb", conformidade: 86 },
        { dia: "Dom", conformidade: 84 }
    ];

    return (
        <>
            <main className='conformidadeMain'>
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
                <div className='distribuicaoBloco diasDaSemana'>
                    <h3>Conformidade média entre os 7 dias da semana</h3>
                    <ResponsiveContainer width="100%" height="100%">
                        <RadarChart data={dadosRadarSemana}>
                            <PolarGrid />

                            <PolarAngleAxis dataKey="dia" />

                            <PolarRadiusAxis domain={[65, 100]} />

                            <Tooltip />

                            <Radar
                                dataKey="conformidade"
                                stroke="var(--azulDetaque)"
                                fill="var(--azulDestaque)"
                                fillOpacity={0.3}
                            />
                        </RadarChart>
                    </ResponsiveContainer>
                </div>
                <div className='distribuicaoBloco tendenciaConformidade'>
                    <p><b>Tendência de conformidade para os últimos 30 dias</b></p>
                    <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={dadosTendencia30Dias}>
                            <CartesianGrid strokeDasharray="3 3" />

                            <XAxis dataKey="dia" />

                            <YAxis domain={[80, 100]} />

                            <Tooltip />

                            <ReferenceLine
                                y={95}
                                stroke="red"
                                strokeDasharray="5 5"
                                label="Meta 95%"
                            />

                            <Line
                                type="linear"
                                dataKey="conformidade"
                                stroke="var(--azulDestaque)"
                                strokeWidth={2}
                                dot={false}
                            />
                        </LineChart>
                    </ResponsiveContainer>
                </div>
                <div className='distribuicaoBloco mediaMovel'>
                    <p><b>Média móvel de conformidade nos últimos 30 dias</b></p>
                    <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={dadosMediaMovel}>
                            <CartesianGrid strokeDasharray="3 3" />

                            <XAxis dataKey="dia" />

                            <YAxis domain={[80, 100]} />

                            <Tooltip />

                            <ReferenceLine
                                y={95}
                                stroke="red"
                                strokeDasharray="5 5"
                                label="Meta 95%"
                            />

                            {/* valores reais */}
                            <Line
                                type="linear"
                                dataKey="conformidade"
                                stroke="var(--bordaCor)"
                                strokeWidth={2}
                                strokeDasharray="4 4"
                                dot={false}
                            />

                            {/* média móvel */}
                            <Line
                                type="monotone"
                                dataKey="mediaMovel"
                                stroke="var(--azulDestaque)"
                                strokeWidth={3}
                                dot={false}
                            />
                        </LineChart>
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
                                radius={[4, 4, 0, 0]}
                            >
                                {dadosSazonalidadeHora.map((entry, index) => (
                                    <Cell
                                        key={`cell-${index}`}
                                        fill={getCorConformidade(entry.conformidade)}
                                    />
                                ))}
                            </Bar>
                        </BarChart>
                    </ResponsiveContainer>
                </div>
                <div className='distribuicaoBloco evolucaoConformidade'>
                    <p><b>Evolução de conformidade (últimos 12 meses)</b></p>
                    {/* <ResponsiveContainer width="100%" height="100%">
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
                    </ResponsiveContainer> */}
                    <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={dadosEvolucaoConformidade}>
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

                            <Area
                                type="monotone"
                                dataKey="conformidade"
                                stroke="var(--azulDetaque)"
                                fill="var(--azulDetaque)"
                                fillOpacity={0.2}
                                strokeWidth={3}
                            />

                            <Brush
                                dataKey="mes"
                                height={20}
                                stroke="var(--azulDetaque)"
                            />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>
            </main>

        </>
    )
}