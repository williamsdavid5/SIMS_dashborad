import { useEffect } from 'react';
import { Label, RadialBarChart, RadialBar, PolarAngleAxis, ResponsiveContainer } from "recharts";
import './distribuicao.css'

function BlocoDistribuicao({ area }) {
    // useEffect(() => {
    //     console.log(area);
    // }, area)

    const graficoData = [
        {
            name: 'Total',
            value: parseInt(area.porcentagem)
        }
    ]

    return (
        <>
            <div className='distribuicaoBloco'>
                <h2>{area.area}</h2>
                <div className='auxiliarAreaBloco'>
                    <div className='esquerda'>
                        {area.epis.map((epi) => (
                            <>
                                <p>{epi.epi}: {epi.quantidade}</p>
                            </>
                        ))}
                        <p><b>Total nesta área: {area.total}</b></p>
                    </div>
                    <div className='direita'>
                        <ResponsiveContainer width="100%" height="100%">
                            <RadialBarChart
                                innerRadius="70%"
                                outerRadius="100%"
                                data={
                                    graficoData
                                }
                                startAngle={90}
                                endAngle={-270}
                            >
                                <Label
                                    value={`${graficoData[0].value}%`}
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
                                    cornerRadius={10}
                                    background={{ fill: "var(--bordaCor)" }}
                                />
                            </RadialBarChart>
                        </ResponsiveContainer>
                        <p>dos EPIs estão nesta área</p>
                    </div>
                </div>
            </div>
        </>
    )
}

export default function Distribuicao() {

    const distribuicaoEpis = [
        {
            area: 'Lavra a Céu Aberto',
            total: '156',
            epis: [
                { epi: 'Capacete', quantidade: '28' },
                { epi: 'Óculos de Proteção', quantidade: '32' },
                { epi: 'Colete Reflexivo', quantidade: '25' },
                { epi: 'Protetor Auricular', quantidade: '18' },
                { epi: 'Luvas de Raspa', quantidade: '22' },
                { epi: 'Máscara PFF2', quantidade: '12' },
                { epi: 'Botas de Segurança', quantidade: '19' }
            ],
            porcentagem: '32'
        },
        {
            area: 'Beneficiamento de Minério',
            total: '98',
            epis: [
                { epi: 'Capacete', quantidade: '18' },
                { epi: 'Óculos de Proteção', quantidade: '15' },
                { epi: 'Colete Reflexivo', quantidade: '10' },
                { epi: 'Protetor Auricular', quantidade: '22' },
                { epi: 'Luvas de Raspa', quantidade: '12' },
                { epi: 'Máscara PFF2', quantidade: '8' },
                { epi: 'Botas de Segurança', quantidade: '13' }
            ],
            porcentagem: '20'
        },
        {
            area: 'Manutenção Mecânica',
            total: '73',
            epis: [
                { epi: 'Capacete', quantidade: '14' },
                { epi: 'Óculos de Proteção', quantidade: '12' },
                { epi: 'Colete Reflexivo', quantidade: '8' },
                { epi: 'Protetor Auricular', quantidade: '10' },
                { epi: 'Luvas de Raspa', quantidade: '16' },
                { epi: 'Máscara PFF2', quantidade: '4' },
                { epi: 'Botas de Segurança', quantidade: '9' }
            ],
            porcentagem: '15'
        },
        {
            area: 'Operação de Equipamentos',
            total: '112',
            epis: [
                { epi: 'Capacete', quantidade: '24' },
                { epi: 'Óculos de Proteção', quantidade: '20' },
                { epi: 'Colete Reflexivo', quantidade: '18' },
                { epi: 'Protetor Auricular', quantidade: '16' },
                { epi: 'Luvas de Raspa', quantidade: '12' },
                { epi: 'Máscara PFF2', quantidade: '8' },
                { epi: 'Botas de Segurança', quantidade: '14' }
            ],
            porcentagem: '23'
        },
        {
            area: 'Geologia e Pesquisa',
            total: '45',
            epis: [
                { epi: 'Capacete', quantidade: '9' },
                { epi: 'Óculos de Proteção', quantidade: '8' },
                { epi: 'Colete Reflexivo', quantidade: '5' },
                { epi: 'Protetor Auricular', quantidade: '4' },
                { epi: 'Luvas de Raspa', quantidade: '6' },
                { epi: 'Máscara PFF2', quantidade: '7' },
                { epi: 'Botas de Segurança', quantidade: '6' }
            ],
            porcentagem: '9'
        },
        {
            area: 'Administração de Mina',
            total: '38',
            epis: [
                { epi: 'Capacete', quantidade: '8' },
                { epi: 'Óculos de Proteção', quantidade: '6' },
                { epi: 'Colete Reflexivo', quantidade: '7' },
                { epi: 'Protetor Auricular', quantidade: '3' },
                { epi: 'Luvas de Raspa', quantidade: '4' },
                { epi: 'Máscara PFF2', quantidade: '5' },
                { epi: 'Botas de Segurança', quantidade: '5' }
            ],
            porcentagem: '8'
        },
        {
            area: 'Transporte e Logística',
            total: '67',
            epis: [
                { epi: 'Capacete', quantidade: '15' },
                { epi: 'Óculos de Proteção', quantidade: '12' },
                { epi: 'Colete Reflexivo', quantidade: '14' },
                { epi: 'Protetor Auricular', quantidade: '8' },
                { epi: 'Luvas de Raspa', quantidade: '7' },
                { epi: 'Máscara PFF2', quantidade: '4' },
                { epi: 'Botas de Segurança', quantidade: '7' }
            ],
            porcentagem: '14'
        },
        {
            area: 'Segurança do Trabalho',
            total: '29',
            epis: [
                { epi: 'Capacete', quantidade: '6' },
                { epi: 'Óculos de Proteção', quantidade: '5' },
                { epi: 'Colete Reflexivo', quantidade: '4' },
                { epi: 'Protetor Auricular', quantidade: '3' },
                { epi: 'Luvas de Raspa', quantidade: '4' },
                { epi: 'Máscara PFF2', quantidade: '3' },
                { epi: 'Botas de Segurança', quantidade: '4' }
            ],
            porcentagem: '6'
        }
    ];

    return (
        <>
            <main className='distribuicaoMain'>
                {distribuicaoEpis.map((area, i) => {
                    return (
                        <BlocoDistribuicao
                            area={area}
                            key={i}
                        />
                    )
                })}
            </main>
        </>
    )
}