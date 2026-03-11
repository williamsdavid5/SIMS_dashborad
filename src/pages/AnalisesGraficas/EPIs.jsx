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
} from "recharts";

export default function EPIs() {

    const dadosConformidadeEPI = [
        { epi: "Capacete", conformidade: 96 },
        { epi: "Óculos de proteção", conformidade: 92 },
        { epi: "Luvas de segurança", conformidade: 90 },
        { epi: "Protetor auricular", conformidade: 88 },
        { epi: "Máscara PFF2", conformidade: 91 },
        { epi: "Botas de segurança", conformidade: 94 },
        { epi: "Colete refletivo", conformidade: 89 },
        { epi: "Cinto de segurança", conformidade: 95 },
        { epi: "Respirador semifacial", conformidade: 87 },
        { epi: "Protetor facial", conformidade: 86 },
        { epi: "Avental de proteção", conformidade: 90 },
        { epi: "Mangote", conformidade: 85 },
        { epi: "Perneira", conformidade: 83 },
        { epi: "Capuz de proteção", conformidade: 84 },
        { epi: "Máscara de solda", conformidade: 88 }
    ];

    const corPorConformidade = (valor) => {
        if (valor < 90) return "red";
        if (valor < 95) return "gold";
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
            </main>
        </>
    )
}