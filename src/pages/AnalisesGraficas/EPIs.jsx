import { useState, useEffect } from 'react'
import './epis.css'
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
    Rectangle,
    PieChart,
    Pie,
    Legend

} from "recharts";

export default function EPIs() {

    const dadosConformidadeEPI = [
        { epi: "Capacete", conformidade: 96 },
        { epi: "Óculos de proteção", conformidade: 92 },
        { epi: "Luvas de segurança", conformidade: 65 },
        { epi: "Protetor auricular", conformidade: 88 },
        { epi: "Máscara PFF2", conformidade: 91 },
        { epi: "Botas de segurança", conformidade: 94 },
        { epi: "Colete refletivo", conformidade: 70 },
        { epi: "Cinto de segurança", conformidade: 95 },
        { epi: "Respirador semifacial", conformidade: 87 },
        { epi: "Protetor facial", conformidade: 76 },
        { epi: "Avental de proteção", conformidade: 90 },
        { epi: "Mangote", conformidade: 59 },
        { epi: "Perneira", conformidade: 83 },
        { epi: "Capuz de proteção", conformidade: 84 },
        { epi: "Máscara de solda", conformidade: 88 }
    ];

    const corPorConformidade = (valor) => {
        if (valor < 70) return "red";
        if (valor < 90) return "gold";
        return "green";
    };

    const AnimatedShape = (props) => {
        return (
            <>
                <Rectangle {...props} fill="transparent" />

                <Rectangle
                    {...props}
                    fill={props.fill}
                    style={{
                        transform: props.isActive ? undefined : `scaleX(20%)`,
                        transformOrigin: `${props.x}px center`,
                        transition: "all 0.2s ease-out",
                        pointerEvents: "none"
                    }}
                />
            </>
        );
    };

    const dadosEPIOrdenados = [...dadosConformidadeEPI].sort(
        (a, b) => b.conformidade - a.conformidade
    );

    const cores = [
        "#0088FE",
        "#00C49F",
        "#FFBB28",
        "#FF8042",
        "#845EC2",
        "#4CAF50",
        "#F44336",
        "#2196F3",
        "#9C27B0",
        "#FF5722",
        "#795548",
        "#3F51B5",
        "#009688",
        "#FFC107",
        "#E91E63"
    ];

    const dadosPizzaEPI = dadosConformidadeEPI.map((item, index) => ({
        name: item.epi,
        value: item.conformidade,
        fill: cores[index % cores.length]
    }));

    return (
        <>
            <main className='conformidadeMain'>
                <div className='distribuicaoBloco porEPI'>
                    <p><b>Conformidade por EPI</b></p>
                    <div className='auxiliarPorEpi'>
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart
                                data={dadosConformidadeEPI}
                                barCategoryGap={4}
                            >
                                <XAxis
                                    dataKey="epi"
                                    interval={0}
                                    angle={90}
                                    textAnchor="start"
                                    height={120}
                                />

                                <YAxis domain={[0, 100]} />

                                <Tooltip formatter={(v) => `${v}%`} />

                                <Bar
                                    dataKey="conformidade"
                                    shape={AnimatedShape}
                                    activeBar={AnimatedShape}
                                >
                                    {dadosConformidadeEPI.map((entry, index) => (
                                        <Cell
                                            key={`cell-${index}`}
                                            fill={corPorConformidade(entry.conformidade)}
                                        />
                                    ))}
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>
                <div className='distribuicaoBloco epiOrdem'>
                    <p><b>EPIs em ordem de conformidade</b></p>
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart
                            layout="vertical"
                            data={dadosEPIOrdenados}
                            margin={{ left: 20 }}
                        >
                            <CartesianGrid strokeDasharray="3 3" />

                            <XAxis
                                type="number"
                                domain={[0, 100]}
                            />

                            <YAxis
                                type="category"
                                dataKey="epi"
                                width={80}
                            />

                            <Tooltip formatter={(v) => `${v}%`} />

                            <Bar
                                dataKey="conformidade"
                                radius={[0, 6, 6, 0]}
                            >
                                {dadosEPIOrdenados.map((entry, index) => (
                                    <Cell
                                        key={`cell-${index}`}
                                        fill={corPorConformidade(entry.conformidade)}
                                    />
                                ))}
                            </Bar>
                        </BarChart>
                    </ResponsiveContainer>
                </div>
                <div className='distribuicaoBloco tresMaisCriticos'>
                    <p><b>Os três EPIs mais críticos e taxa mensal de conformidade</b></p>
                    <hr />
                    <span className='auxTresEpisCriticos'>
                        {dadosEPIOrdenados.slice(-3).reverse().map((epi, index) => {
                            return (
                                <>
                                    <h2>{index + 1}- {epi.epi} ({epi.conformidade}%)</h2>
                                </>
                            );
                        })}
                    </span>
                </div>
                <div className='distribuicaoBloco episPizza'>
                    <p><b>Taxa de conformidade de EPIs</b></p>
                    <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                            <Pie
                                data={dadosPizzaEPI}
                                dataKey="value"
                                nameKey="name"
                            />

                            <Tooltip formatter={(v) => `${v}%`} />

                            <Legend />
                        </PieChart>
                    </ResponsiveContainer>
                </div>
            </main>
        </>
    )
}