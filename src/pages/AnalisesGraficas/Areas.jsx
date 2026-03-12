import './areas.css'
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

export default function Areas() {

    const dadosConformidadeArea = [
        { area: "Lavra a céu aberto", conformidade: 93 },
        { area: "Britagem primária", conformidade: 88 },
        { area: "Britagem secundária", conformidade: 91 },
        { area: "Moagem", conformidade: 86 },
        { area: "Flotação", conformidade: 70 },
        { area: "Espessamento", conformidade: 94 },
        { area: "Filtragem", conformidade: 69 },
        { area: "Pelotização", conformidade: 95 },
        { area: "Pátio de estocagem", conformidade: 84 },
        { area: "Expedição ferroviária", conformidade: 89 },
        { area: "Manutenção mecânica", conformidade: 58 },
        { area: "Manutenção elétrica", conformidade: 96 },
        { area: "Oficina de equipamentos", conformidade: 83 },
        { area: "Laboratório mineral", conformidade: 97 },
        { area: "Sala de controle", conformidade: 98 }
    ];

    const dadosAreaOrdenados = [...dadosConformidadeArea].sort(
        (a, b) => b.conformidade - a.conformidade
    );

    const corPorConformidade = (valor) => {
        if (valor < 70) return "red";
        if (valor < 85) return "gold";
        return "green";
    };

    const pioresAreas = [...dadosConformidadeArea]
        .sort((a, b) => a.conformidade - b.conformidade)
        .slice(0, 3);

    const cores = ["red", "orange", "gold"];

    const dadosRadialAreas = pioresAreas.map((item, index) => ({
        name: item.area,
        value: item.conformidade,
        fill: cores[index]
    }));

    const legendaStyle = {
        top: "50%",
        right: 0,
        transform: "translate(0, -50%)",
        lineHeight: "24px"
    };

    return (
        <>
            <main className="conformidadeMain">
                <div className="distribuicaoBloco porArea">
                    <p><b>Conformidade por área</b></p>
                    <div className='auxiliarGraficoPorArea'>
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart
                                layout="vertical"
                                data={dadosAreaOrdenados}
                                margin={{ left: 20 }}
                            >
                                <CartesianGrid strokeDasharray="3 3" />

                                <XAxis
                                    type="number"
                                    domain={[0, 100]}
                                />

                                <YAxis
                                    type="category"
                                    dataKey="area"
                                    width={150}
                                />

                                <Tooltip formatter={(v) => `${v}%`} />

                                <Bar
                                    dataKey="conformidade"
                                    radius={[0, 6, 6, 0]}
                                >
                                    {dadosAreaOrdenados.map((entry, index) => (
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
                <div className='distribuicaoBloco radaArea'>
                    <p><b>Para as três áreas críticas</b></p>
                    <hr />
                    <ResponsiveContainer width="100%" height="100%">
                        <RadialBarChart
                            cx="30%"
                            innerRadius="10%"
                            outerRadius="70%"
                            barSize={25}
                            data={dadosRadialAreas}
                        >
                            <RadialBar
                                dataKey="value"
                                background
                                label={{ position: "insideStart", fill: "#fff" }}
                            />

                            <PolarAngleAxis
                                type="number"
                                domain={[0, 100]}
                                tick={false}
                            />

                            <Legend
                                iconSize={10}
                                layout="vertical"
                                verticalAlign="middle"
                                wrapperStyle={legendaStyle}
                            />

                            <Tooltip formatter={(v) => `${v}%`} />
                        </RadialBarChart>
                    </ResponsiveContainer>
                </div>
                <div className='distribuicaoBloco blocoMelhorPior'>
                    <h3><b>Melhor área</b></h3>
                    <hr />
                    <h1>{dadosAreaOrdenados[0].area}</h1>
                </div>
                <div className='distribuicaoBloco blocoMelhorPior'>
                    <h3><b>Pior área</b></h3>
                    <hr />
                    <h1
                        style={{ color: 'red' }}
                    >{dadosAreaOrdenados.slice(-1)[0].area}</h1>
                </div>
            </main>
        </>
    )
}