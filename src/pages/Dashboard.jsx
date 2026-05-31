import './styles/dashboard.css'
import MenuLateral from './MenuLateral'
import ModalImg from './ModalImg';
import { useEffect, useState } from 'react'
import { useApp } from '../context/AppContext';
import LoadingGif from '../assets/loading.gif'

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
    const [epiCritico, setEpiCritico] = useState('');
    const [taxaConformidade, setTaxaConformidade] = useState(91.23);
    const [cameraCritica, setCameraCritica] = useState("");
    const [falsosPositivos, setFalsosPositivos] = useState(4);
    const [intervaloMaisOcorrencias, setIntervaloMaisOcorrencias] = useState({
        horario: '00:00',
        quantidade: 3
    });
    const [carregandoDado, setCarregandoDado] = useState(true);

    function formatarData(dataHora) {
        if (!dataHora) return "";
        const date = new Date(dataHora.replace("Z", ""));

        return date.toLocaleString("pt-BR", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        });
    }

    // const COLORS = ["#0A1E43", "#243757", "#4b6185", "#879dc0"];

    const [modalImagem, setModalImagem] = useState(false);
    const [dadosOcorrencia, setDadosOcorrencia] = useState([]);

    const {
        ocorrencias,
        carregando,
        temMais,
        verMais,
        fetchOcorrencias,
        dadosGraficoTipoOcorrencia,
        fetchGraficoTipos,
        dadosGraficoLinha,
        fetchGraficoLinha,
        metricasGerais,
        fetchMetricasGerais,
        dadosGraficoCameras,
        fetchGraficoCameras
    } = useApp();

    async function carregarDadosCompletos() {
        await Promise.all([
            fetchOcorrencias(),
            fetchGraficoTipos(),
            fetchGraficoLinha(),
            fetchMetricasGerais(),
            fetchGraficoCameras()
        ]);
    }

    useEffect(() => {
        const carregarDados = async () => {
            setCarregandoDado(true);
            try {
                await carregarDadosCompletos();
            } finally {
                setCarregandoDado(false);
            }
        };

        carregarDados();
    }, []);

    const dadosLinha = dadosGraficoLinha.horas.map((hora, index) => ({
        hora: hora,
        quantidade: dadosGraficoLinha.quantidades[index]
    }));

    const distribuicaoPorCameraData = dadosGraficoCameras.dadosCompletos?.map(item => ({
        camera: item.camera,
        Quantidade: Number(item.total)
    })) || [];

    useEffect(() => {

        if (!dadosGraficoTipoOcorrencia || dadosGraficoTipoOcorrencia.length === 0) {
            return;
        }

        const maiorTotal = Math.max(...dadosGraficoTipoOcorrencia.map(item => item.total));

        const episComMaiorTotal = dadosGraficoTipoOcorrencia.filter(item => item.total === maiorTotal);

        if (episComMaiorTotal.length === 1) {
            setEpiCritico(episComMaiorTotal[0].epi);
        } else {
            const indiceAleatorio = Math.floor(Math.random() * episComMaiorTotal.length);
            setEpiCritico(episComMaiorTotal[indiceAleatorio].epi);
        }

        // Lógica para horário com mais ocorrências
        if (dadosGraficoLinha && dadosGraficoLinha.quantidades && dadosGraficoLinha.quantidades.length > 0) {
            const maiorQuantidade = Math.max(...dadosGraficoLinha.quantidades);
            const indiceMaior = dadosGraficoLinha.quantidades.indexOf(maiorQuantidade);
            const horarioMaior = dadosGraficoLinha.horas[indiceMaior];

            setIntervaloMaisOcorrencias({
                horario: horarioMaior,
                quantidade: maiorQuantidade
            });
        }

        const listaCameras = dadosGraficoCameras?.dadosCompletos;

        if (listaCameras && listaCameras.length > 0) {
            const maiorTotalCamera = Math.max(...listaCameras.map(item => item.total));

            const camerasComMaiorTotal = listaCameras.filter(item => item.total === maiorTotalCamera);

            if (camerasComMaiorTotal.length === 1) {
                setCameraCritica(camerasComMaiorTotal[0].camera);
            } else {
                const indiceAleatorio = Math.floor(Math.random() * camerasComMaiorTotal.length);
                setCameraCritica(camerasComMaiorTotal[indiceAleatorio].camera);
            }
        }

    }, [dadosGraficoTipoOcorrencia, dadosGraficoLinha, dadosGraficoCameras]);

    const COLORS = (() => {
        const corBase = "#0A1E3F";
        const quantidade = distribuicaoPorCameraData.length || 1;
        const cores = [corBase];

        if (quantidade === 1) return cores;

        // Converte a cor base para HSL
        const r = parseInt(corBase.slice(1, 3), 16) / 255;
        const g = parseInt(corBase.slice(3, 5), 16) / 255;
        const b = parseInt(corBase.slice(5, 7), 16) / 255;

        const max = Math.max(r, g, b);
        const min = Math.min(r, g, b);
        let h, s, l = (max + min) / 2;

        if (max === min) {
            h = s = 0;
        } else {
            const d = max - min;
            s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
            switch (max) {
                case r: h = ((g - b) / d + (g < b ? 6 : 0)) / 6; break;
                case g: h = ((b - r) / d + 2) / 6; break;
                default: h = ((r - g) / d + 4) / 6; break;
            }
        }

        // Mantém o MATIZ (hue) e SATURAÇÃO originais (azul)
        const matizFixo = h * 360; // Matiz do azul original
        const saturacaoFixa = Math.min(50, Math.max(10, s * 100)); // Saturação entre 50-70%

        // Gera apenas variações de LUMINOSIDADE dentro do azul
        const luminosidadeMin = 15;  // mínimo (mais escuro)
        const luminosidadeMax = 50;  // máximo (mais claro)
        const step = (luminosidadeMax - luminosidadeMin) / (quantidade - 1);

        for (let i = 1; i < quantidade; i++) {
            const luminosidade = luminosidadeMin + (i * step);
            cores.push(`hsl(${matizFixo}, ${saturacaoFixa}%, ${luminosidade}%)`);
        }

        return cores;
    })();

    return (
        <>
            <main className="dashboardMain">
                <MenuLateral></MenuLateral>
                <section className='principalDash'>
                    <header className='superiorDash'>
                        <h2>Dashboard</h2>
                        <p>Feedback visual sobre o monitoramento, observe dados relevantes.</p>
                    </header>
                    {carregandoDado ?
                        <>
                            <img src={LoadingGif} alt="" style={{ width: '60px' }} />
                        </>
                        :
                        <>
                            <section className='blocosDash'>
                                <div className='bloco infoNumerica'>
                                    <p className='tituloBloco'>Total hoje</p>
                                    <h1>{metricasGerais.totalHoje}</h1>
                                </div>
                                <div className='bloco infoNumerica'>
                                    <p className='tituloBloco'>Taxa de conformidade</p>
                                    <h1>{taxaConformidade}%</h1>
                                </div>
                                <div className='bloco infoNumerica cameraCritica'>
                                    <p className='tituloBloco'>Câmera crítica</p>
                                    <h2>{cameraCritica}</h2>
                                </div>
                                <div className='bloco infoNumerica epiCritico'>
                                    <p className='tituloBloco'>EPI Crítico</p>
                                    <h1>{epiCritico}</h1>
                                </div>
                                <div className='bloco inforOcorrenciasHora'>
                                    <p className='tituloBloco'>Ocorrências por intervalo de horário</p>
                                    <div className='auxiliarGrafico'>
                                        <ResponsiveContainer width="90%" height="100%">
                                            <LineChart data={dadosLinha}>
                                                <XAxis dataKey="hora" />
                                                <YAxis />
                                                <Tooltip />
                                                <Line type="monotone" dataKey="quantidade" stroke="var(--azulDestaque)" strokeWidth={3} />
                                            </LineChart>
                                        </ResponsiveContainer>
                                    </div>
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
                                <div className='bloco falsosPositivos'>
                                    <p className='tituloBloco'>Intervalo com mais ocorrências</p>
                                    <h1>{intervaloMaisOcorrencias.horario}</h1>
                                    <hr />
                                    <p className='tituloBloco'>Ocorrências no intervalo</p>
                                    <h1>{intervaloMaisOcorrencias.quantidade}</h1>
                                </div>
                                <div className='bloco analiseEstatistica'>
                                    <p className='tituloBloco'>Análise estatística</p>
                                    <hr />
                                    <p className='inforEstatistica'>
                                        <b>Média diária:</b>{metricasGerais.mediaDiaria}<br />
                                        <b>Total para esta semana: </b> {metricasGerais.totalSemana} <br />
                                        <b>Média semanal:</b> {metricasGerais.mediaSemanal} <br />
                                        <b>EPI crítico:</b>{epiCritico}<br />
                                        <b>Câmera com maior incidência:</b>{cameraCritica}<br />
                                    </p>
                                </div>
                                <div className='bloco ocorrenciasPorTipo'>
                                    <p className='tituloBloco'>Ocorrências por tipo</p>
                                    <div className='auxiliarGrafico'>
                                        <ResponsiveContainer width="100%" height="100%">
                                            <BarChart data={dadosGraficoTipoOcorrencia}>
                                                {/* <Legend /> */}
                                                <CartesianGrid strokeDasharray="1 1" />
                                                <XAxis dataKey="epi" />
                                                <YAxis />
                                                <Tooltip />
                                                <Bar dataKey="total" fill="var(--azulDestaque)" />
                                            </BarChart>
                                        </ResponsiveContainer>
                                    </div>
                                </div>
                                <div className='bloco historicoCompleto'>
                                    <p className='tituloBloco'>Histórico completo</p>
                                    <table border={1} className='tabelaUltimasOcorrencias'>
                                        <thead>
                                            <tr>
                                                <th>Data</th>
                                                <th>Câmera</th>
                                                <th>EPI</th>
                                                <th>Captura</th>
                                                <th>Tipo</th>
                                                <th>Status</th>
                                            </tr>
                                        </thead>

                                        <tbody>
                                            {ocorrencias.map((ocorrencia) => (
                                                <tr key={ocorrencia.id}>
                                                    <td>{formatarData(ocorrencia.data_hora)}</td>
                                                    <td>{ocorrencia.camera}</td>
                                                    <td>{ocorrencia.epi}</td>
                                                    {ocorrencia.url_imagem ? (
                                                        <td>
                                                            <button
                                                                className='botaoVerImagem'
                                                                onClick={() => {
                                                                    setModalImagem(true)
                                                                    setDadosOcorrencia({
                                                                        data: ocorrencia.data_hora,
                                                                        camera: ocorrencia.camera,
                                                                        item: ocorrencia.epi,
                                                                        imagem: ocorrencia.url_imagem
                                                                    })
                                                                }}
                                                            >Ver</button>
                                                        </td>
                                                    )
                                                        :
                                                        <>
                                                            <td>
                                                                <p>Sem captura</p>
                                                            </td>
                                                        </>

                                                    }
                                                    <td>{ocorrencia.tipo}</td>
                                                    <td>
                                                        <p className={ocorrencia.status == 'Em análise' ? 'analise' : ocorrencia.status == 'Não confirmado' ? 'naoConfirmado' : ocorrencia.status == 'Confirmado' ? 'confirmado' : ''}>
                                                            {ocorrencia.status}
                                                        </p>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                    {temMais && (
                                        <button onClick={verMais} disabled={carregando} className='botaoVerMais'>
                                            {carregando ? 'Carregando...' : 'Ver mais'}
                                        </button>
                                    )}
                                </div>
                            </section>
                        </>
                    }

                </section>
                {modalImagem && (
                    <ModalImg setModalImagem={setModalImagem} dadosOcorrencia={dadosOcorrencia}></ModalImg>
                )}
            </main>
        </>
    )
}