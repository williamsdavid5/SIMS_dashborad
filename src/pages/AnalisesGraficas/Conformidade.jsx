import './conformidade.css'
import { useState, useEffect } from 'react'
import { Label, RadialBarChart, RadialBar, PolarAngleAxis, ResponsiveContainer } from "recharts";

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
            </main>

        </>
    )
}