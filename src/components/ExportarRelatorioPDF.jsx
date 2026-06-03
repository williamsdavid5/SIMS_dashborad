// components/ExportarRelatorioPDF.jsx
// Dependência: npm install @react-pdf/renderer

import { useApp } from '../context/AppContext';
import { useState, useEffect } from 'react';
import { pdf, Document, Page, View, Text, StyleSheet, Image } from '@react-pdf/renderer';
import bwipjs from 'bwip-js';

import * as XLSX from 'xlsx';
import html2canvas from 'html2canvas';
import { createRoot } from 'react-dom/client';
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
    LineChart, Line,
    PieChart, Pie, Cell, Legend
} from 'recharts';

import SIMSLogo from '../assets/sims_horizontal.png'
import VIICLogo from '../assets/viic_logo_azul.png'

// ─── Paleta de cores ──────────────────────────────────────────────────────────
const COR_AZUL = '#0A1E3F';
const COR_FUNDO = '#FFFFFF';
const COR_BADGE = '#D4DBED';
const COR_CINZA = '#a7abb5';
const COR_TEXTO = '#333333';

// ─── Estilos ──────────────────────────────────────────────────────────────────
const s = StyleSheet.create({
    page: {
        backgroundColor: COR_FUNDO,
        paddingTop: 40,
        paddingBottom: 40,
        paddingHorizontal: 48,
        fontFamily: 'Helvetica',
    },

    //graficos
    grafico: {
        width: '100%',
        height: 170,
        marginTop: 6,
    },
    graficoPie: {
        width: '70%',
        height: 150,
        marginTop: 6,
    },
    graficoText: {
        fontSize: 11,
        color: '#444444',
        marginTop: 15,
        fontWeight: 'Bold'
    },
    // Header
    header: {
        alignItems: 'center',
        marginBottom: 16,
    },
    headerTitulo: {
        fontSize: 22,
        fontFamily: 'Helvetica-Bold',
        color: COR_AZUL,
    },
    headerSubtitulo: {
        fontSize: 10,
        color: COR_CINZA,
        marginTop: 2,
    },
    headerResumo: {
        fontSize: 11,
        color: COR_TEXTO,
        marginTop: 5,
        marginBottom: 5
    },
    badge: {
        marginTop: 8,
        backgroundColor: COR_BADGE,
        borderRadius: 4,
        paddingVertical: 5,
        paddingHorizontal: 12,
        width: '100%',
        alignItems: 'center',
    },
    badgeTexto: {
        fontSize: 12,
        color: COR_AZUL,
        fontFamily: 'Helvetica-Bold',
    },
    nomeResponsavel: {
        fontSize: 12,
        color: COR_TEXTO,
        fontFamily: 'Helvetica-Bold',
        marginBottom: 20
    },
    headerLogos: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        width: '100%',
        marginBottom: 10,
    },
    logo: {
        height: 20,
        objectFit: 'contain',
    },
    logo2: {
        height: 16,
        objectFit: 'contain',
    },
    logoView: {
        display: 'flex',
        flexDirection: 'column',
        gap: 5
    },

    // Seções
    secao: {
        marginBottom: 18,
    },
    secaoTitulo: {
        fontSize: 12,
        fontFamily: 'Helvetica-Bold',
        color: COR_AZUL,
        marginBottom: 4,
    },
    divisor: {
        borderBottomWidth: 1.5,
        borderBottomColor: COR_AZUL,
        marginBottom: 6,
    },
    descricao: {
        fontSize: 11,
        color: '#444444',
        marginBottom: 5,
    },

    // Linhas de dados
    linha: {
        flexDirection: 'row',
        marginBottom: 3,
        paddingLeft: 12,
    },
    label: {
        fontSize: 11,
        fontFamily: 'Helvetica-Bold',
        color: COR_TEXTO,
    },
    valor: {
        fontSize: 11,
        color: COR_TEXTO,
    },

    // Duas colunas
    duasColunas: {
        flexDirection: 'row',
        paddingLeft: 12,
    },
    coluna: {
        flex: 1,
    },

    // Obs
    obs: {
        fontSize: 9,
        color: COR_CINZA,
        paddingLeft: 12,
        marginBottom: 5,
    },

    //Rodape
    rodape: {
        position: 'absolute',
        bottom: 28,
        right: 48,
        alignItems: 'flex-end',
    },
    codigoTexto: {
        fontSize: 7,
        color: COR_CINZA,
        marginBottom: 3,
    },
    codigoBarras: {
        width: 100,
        height: 40,
    },

    //para a tabela
    tabela: {
        width: '100%',
        marginTop: 10,
    },
    tabelaCabecalho: {
        flexDirection: 'row',
        backgroundColor: COR_AZUL,
        paddingVertical: 6,
        paddingHorizontal: 8,
        marginBottom: 2,
    },
    tabelaCabecalhoTexto: {
        fontSize: 9,
        fontFamily: 'Helvetica-Bold',
        color: '#FFFFFF',
    },
    tabelaLinha: {
        flexDirection: 'row',
        borderBottomWidth: 0.5,
        borderBottomColor: '#E0E0E0',
        paddingVertical: 4,
        paddingHorizontal: 8,
    },
    tabelaLinhaAlternada: {
        backgroundColor: '#F5F5F5',
    },
    colunaData: {
        width: '10%',
        fontSize: 8,
    },
    colunaHorario: {
        width: '10%',
        fontSize: 8,
        textAlign: 'center'
    },
    colunaCamera: {
        width: '35%',
        fontSize: 8,
        flexWrap: 'wrap',
        textAlign: 'center'
    },
    celulaCamera: {
        width: '27%',
        fontSize: 8,
        flexWrap: 'wrap',
        wordBreak: 'break-word',
    },
    colunaEPI: {
        width: '20%',
        fontSize: 8,
    },
    colunaStatus: {
        width: '25%',
        fontSize: 8,
    },
    paginaTitulo: {
        fontSize: 14,
        fontFamily: 'Helvetica-Bold',
        color: COR_AZUL,
        marginBottom: 8,
        marginTop: 10,
    },
});

// ─── Componentes auxiliares ───────────────────────────────────────────────────

const Linha = ({ label, valor }) => (
    <View style={s.linha}>
        <Text style={s.label}>{label} </Text>
        <Text style={s.valor}>{valor}</Text>
    </View>
);

const Secao = ({ titulo, descricao, children }) => (
    <View style={s.secao}>
        <Text style={s.secaoTitulo}>{titulo}</Text>
        {descricao && <Text style={s.descricao}>{descricao}</Text>}
        <View style={s.divisor} />
        {children}
    </View>
);

const TabelaOcorrencias = ({ ocorrencias, formatarDataHora }) => (
    <View style={s.tabela}>
        {/* Cabeçalho */}
        <View style={s.tabelaCabecalho}>
            <Text style={[s.tabelaCabecalhoTexto, s.colunaData]}>Data</Text>
            <Text style={[s.tabelaCabecalhoTexto, s.colunaHorario]}>Horário</Text>
            <Text style={[s.tabelaCabecalhoTexto, s.colunaCamera]}>Câmera</Text>
            <Text style={[s.tabelaCabecalhoTexto, s.colunaEPI]}>EPI</Text>
            <Text style={[s.tabelaCabecalhoTexto, s.colunaStatus]}>Status</Text>
        </View>

        {/* Linhas */}
        {ocorrencias.map((occ, i) => {
            const dataHora = formatarDataHora(occ.data_hora);
            const [data, horario] = dataHora.split(', ');
            const nomeCamera = occ.camera?.length > 25
                ? occ.camera.substring(0, 22) + '...'
                : occ.camera || 'N/A';
            return (
                <View key={i} style={[s.tabelaLinha, i % 2 === 0 && s.tabelaLinhaAlternada]}>
                    <Text style={s.colunaData}>{data || 'N/A'}</Text>
                    <Text style={s.colunaHorario}>{horario || 'N/A'}</Text>
                    <Text style={[s.colunaCamera, { flexWrap: 'wrap', wordBreak: 'break-word' }]}>
                        {nomeCamera}
                    </Text>
                    <Text style={s.colunaEPI}>{occ.epi || 'N/A'}</Text>
                    <Text style={s.colunaStatus}>{occ.status || 'N/A'}</Text>
                </View>
            );
        })}
    </View>
);

const capturarGraficoComoPng = (componenteJSX, largura = 500, altura = 220) => {
    return new Promise((resolve, reject) => {
        const container = document.createElement('div');
        container.style.cssText = `
            position: absolute; top: -9999px; left: -9999px;
            width: ${largura}px; height: ${altura}px;
            background-color: #FFFFFF;
        `;
        document.body.appendChild(container);
        const root = createRoot(container);
        root.render(componenteJSX);

        setTimeout(async () => {
            try {
                const canvas = await html2canvas(container, {
                    scale: 2,
                    backgroundColor: '#FFFFFF',
                    logging: false,
                });
                resolve(canvas.toDataURL('image/png'));
            } catch (err) {
                reject(err);
            } finally {
                root.unmount();
                document.body.removeChild(container);
            }
        }, 400);
    });
};

const formatarDataParaExibicao = (dataISO) => {
    if (!dataISO) return 'N/I';
    const partes = dataISO.split('-');
    if (partes.length !== 3) return dataISO;
    return `${partes[2]}/${partes[1]}/${partes[0]}`;
};

// ─── Documento PDF ────────────────────────────────────────────────────────────

const RelatorioPDF = ({
    incluirGraficos,
    totalHoje,
    mediaDiaria,
    taxaConformidade,
    epiMaisNegligenciadoText,
    cameraMaiorIncidencia,
    horarioPico,
    tiposPrimeiraColuna,
    tiposSegundaColuna,
    camerasOrdenadas,
    intervalosComOcorrencias,
    ultimasOcorrencias,
    formatarDataHora,
    codigoAleatorio,
    codigoBarrasPng,
    graficoPng,
    graficoPiePng,
    graficoBarraPng,
    incluirHistorico,
    dataInicio,
    dataFim,
    totalRegistros,
    todasOcorrencias,
    incluirGeral,
    nomeResponsavel
}) => (
    <Document>
        {/* PÁGINA 1 - RESUMO EXECUTIVO */}
        {incluirGeral && (
            <Page size="A4" style={s.page}>
                {/* Header */}
                <View style={s.header}>
                    <View style={s.headerLogos}>
                        <View style={s.logoView}>
                            <Image src={SIMSLogo} style={s.logo2} />
                            <Image src={VIICLogo} style={s.logo} />
                        </View>
                        <View>
                            <Text style={s.codigoTexto}>{codigoAleatorio}</Text>
                            <Image src={codigoBarrasPng} style={s.codigoBarras} />
                        </View>
                    </View>

                    <Text style={s.headerTitulo}>Relatório Geral</Text>
                    <Text style={s.headerSubtitulo}>SIMS- Sistema Inteligente de Monitoramento e Segurança</Text>
                    {(nomeResponsavel != null && nomeResponsavel != '') && (
                        <Text style={s.headerResumo}>Responsável: {nomeResponsavel}</Text>
                    )}
                    <View style={s.badge}>
                        <Text style={s.badgeTexto}>
                            Emitido em: {new Date().toLocaleDateString('pt-BR')} - {new Date().toLocaleTimeString('pt-BR')}
                        </Text>
                    </View>
                </View>
                {/* Informações Gerais */}
                <Secao titulo="Informações Gerais">
                    <View style={s.duasColunas}>
                        <View>
                            <Linha label="EPI(s) mais negligenciado(s):" valor={epiMaisNegligenciadoText} />
                            <Linha label="Câmera com maior incidência:" valor={cameraMaiorIncidencia} />
                            <Linha label="Intervalo com mais ocorrências:" valor={horarioPico} />
                        </View>
                        <View style={s.coluna}>
                            <Linha label="Total de alertas hoje:" valor={String(totalHoje)} />
                            <Linha label="Média diária de alertas:" valor={String(mediaDiaria)} />
                            <Linha label="Taxa geral de conformidade:" valor={`${taxaConformidade}%`} />
                        </View>
                    </View>
                </Secao>

                {/* Ocorrências por Tipo */}
                <Secao
                    titulo="Ocorrências por Tipo"
                    descricao="Números de detecções para cada EPI, esse dado permite visualizar o cenário atual, indicando quais os EPIs mais negligenciados."
                >
                    <View style={s.duasColunas}>
                        <View style={s.coluna}>
                            {tiposPrimeiraColuna.map((tipo, i) => (
                                <View key={i} style={s.linha}>
                                    <Text style={s.label}>{tipo.epi}: </Text>
                                    <Text style={s.valor}>{tipo.total}</Text>
                                </View>
                            ))}
                        </View>
                        <View style={s.coluna}>
                            {tiposSegundaColuna.map((tipo, i) => (
                                <View key={i} style={s.linha}>
                                    <Text style={s.label}>{tipo.epi}: </Text>
                                    <Text style={s.valor}>{tipo.total}</Text>
                                </View>
                            ))}
                        </View>
                    </View>
                    {incluirGraficos && (
                        <>
                            <Text style={s.graficoText}>Visualização gráfica:</Text>
                            <Image src={graficoBarraPng} style={s.grafico} />
                        </>
                    )}
                </Secao>

                {/* Detecções por câmera */}
                <Secao
                    titulo="Detecções por câmera"
                    descricao="Números de detecções para cada câmera, esse dado indica as áreas com maior negligência."
                >
                    {camerasOrdenadas.map((camera, i) => (
                        <Linha key={i} label={`${camera.camera}:`} valor={String(camera.total)} />
                    ))}
                    {incluirGraficos && (
                        <>
                            <Text style={s.graficoText}>Visualização gráfica:</Text>
                            <View style={s.header}>
                                <Image src={graficoPiePng} style={s.graficoPie} />
                            </View>
                        </>
                    )}
                </Secao>

                {/* Detecções por intervalo */}
                <Secao
                    titulo="Detecções por intervalo"
                    descricao="Intervalos com maior quantidade de detecções, os horários indicam o início do intervalo, durando exatamente 1 hora."
                >
                    <Text style={s.obs}>
                        Obs: os intervalos estão organizados por número de detecções, os intervalos que não aparecem, não possuem detecções registradas.
                    </Text>
                    {intervalosComOcorrencias.slice(0, 6).map((item, i) => (
                        <Linha key={i} label={`${item.horario} -`} valor={`${item.quantidade} ocorrências`} />
                    ))}
                    {incluirGraficos && (
                        <>
                            <Text style={s.graficoText}>Visualização gráfica:</Text>
                            <Image src={graficoPng} style={s.grafico} />
                        </>
                    )}
                </Secao>

                {/* Rodapé da página 1 */}
                <View style={s.rodape}>
                    <Text style={s.codigoTexto}>{codigoAleatorio}</Text>
                    <Image src={codigoBarrasPng} style={s.codigoBarras} />
                </View>
            </Page>
        )}

        {/* PÁGINA 2 - HISTÓRICO COMPLETO (apenas se incluirHistorico e tiver registros) */}
        {incluirHistorico && totalRegistros > 0 && (
            <Page size="A4" style={s.page}>
                {/* Header da página 2 */}
                <View style={s.header}>
                    <View style={s.headerLogos}>
                        <View style={s.logoView}>
                            <Image src={SIMSLogo} style={s.logo2} />
                            <Image src={VIICLogo} style={s.logo} />
                        </View>
                        <View>
                            <Text style={s.codigoTexto}>{codigoAleatorio}</Text>
                            <Image src={codigoBarrasPng} style={s.codigoBarras} />
                        </View>
                    </View>

                    <Text style={s.headerTitulo}>Histórico de Ocorrências</Text>
                    <Text style={s.headerSubtitulo}>SIMS- Sistema Inteligente de Monitoramento e Segurança</Text>
                    {(nomeResponsavel != null && nomeResponsavel != '') && (
                        <Text style={s.headerResumo}>Responsável: {nomeResponsavel}</Text>
                    )}
                    <View style={s.badge}>
                        <Text style={s.badgeTexto}>
                            Emitido em: {new Date().toLocaleDateString('pt-BR')} - {new Date().toLocaleTimeString('pt-BR')}
                        </Text>
                    </View>
                </View>

                {/* Tabela completa de ocorrências */}
                {/* <Text style={s.paginaTitulo}>Lista Completa de Ocorrências</Text> */}
                <Secao
                    titulo="Lista completa de ocorrências"
                    descricao="Todas as infrações registradas no período selecionado"
                ></Secao>
                <Text style={s.headerResumo}>Histórico para o período de {formatarDataParaExibicao(dataInicio) || 'N/I'} a {formatarDataParaExibicao(dataFim) || 'N/I'} | Total: {totalRegistros} registro(s)</Text>
                <TabelaOcorrencias
                    ocorrencias={todasOcorrencias}
                    formatarDataHora={formatarDataHora}
                />

                {/* Rodapé da página 2 */}
                <View style={s.rodape}>
                    <Text style={s.codigoTexto}>{codigoAleatorio}</Text>
                    <Image src={codigoBarrasPng} style={s.codigoBarras} />
                </View>
            </Page>
        )}
    </Document>
);

// ─── Componente principal ─────────────────────────────────────────────────────

const ExportarRelatorioPDF = ({
    incluirGraficos = true,
    tipoRelatorio = 'pdf',
    dataInicio,
    dataFim,
    incluirHistorico = false,
    incluirGeral = true,
    nomeResponsavel = null
}) => {
    const {
        ocorrencias,
        fetchOcorrencias,
        dadosGraficoTipoOcorrencia,
        fetchGraficoTipos,
        dadosGraficoLinha,
        fetchGraficoLinha,
        metricasGerais,
        fetchMetricasGerais,
        dadosGraficoCameras,
        fetchGraficoCameras,
        conformidade,
        fetchConformidade,
        fetchOcorrenciasPorPeriodo,
        ocorrenciasPorPeriodo
    } = useApp();

    const [carregandoDados, setCarregandoDados] = useState(false);
    const [gerandoPDF, setGerandoPDF] = useState(false);
    const [dadosPeriodo, setDadosPeriodo] = useState(null);

    const carregarDados = async (dataInicioParam, dataFimParam) => {
        setCarregandoDados(true);
        try {

            const [
                ocorrenciasResult,
                tiposResult,
                linhaResult,
                metricasResult,
                camerasResult,
                conformidadeResult
            ] = await Promise.all([
                fetchOcorrencias(),
                fetchGraficoTipos(),
                fetchGraficoLinha(),
                fetchMetricasGerais(),
                fetchGraficoCameras(),
                fetchConformidade()
            ]);

            let periodoResult = null;

            const deveBuscarPeriodo = dataInicioParam && dataFimParam &&
                (incluirHistorico || tipoRelatorio === 'csv' || tipoRelatorio === 'excel');

            if (deveBuscarPeriodo) {
                periodoResult = await fetchOcorrenciasPorPeriodo(dataInicioParam, dataFimParam);
                setDadosPeriodo(periodoResult);
            } else {
                setDadosPeriodo(null);
            }

            // Retornar os dados para uso imediato
            return {
                ocorrencias: ocorrenciasResult,
                tipos: tiposResult,
                linha: linhaResult,
                metricas: metricasResult,
                cameras: camerasResult,
                conformidade: conformidadeResult,
                periodo: periodoResult
            };

        } finally {
            setCarregandoDados(false);
        }
    };


    const formatarDataHora = (dataHora) => {
        if (!dataHora) return '';
        try {
            const date = new Date(dataHora);
            if (isNaN(date.getTime())) return '';
            return date.toLocaleString('pt-BR', {
                day: '2-digit',
                month: '2-digit',
                hour: '2-digit',
                minute: '2-digit',
            });
        } catch {
            return '';
        }
    };

    // ── Gerador CSV ───────────────────────────────────────────────────────────
    // const gerarCSV = (dadosOcorrencias) => {
    //     const cabecalho = ['Data/Hora', 'Câmera', 'EPI', 'Tipo', 'Status'];
    //     const linhas = dadosOcorrencias.map(occ => [
    //         formatarDataHora(occ.data_hora),
    //         occ.camera,
    //         occ.epi,
    //         occ.tipo,
    //         occ.status,
    //     ]);

    //     const conteudo = [cabecalho, ...linhas]
    //         .map(linha => linha.map(cel => `"${String(cel ?? '').replace(/"/g, '""')}"`).join(','))
    //         .join('\n');

    //     const blob = new Blob(['\uFEFF' + conteudo], { type: 'text/csv;charset=utf-8;' });
    //     const url = URL.createObjectURL(blob);
    //     const link = document.createElement('a');
    //     link.href = url;
    //     link.download = `ocorrencias_sims_${new Date().toISOString().slice(0, 10)}.csv`;
    //     link.click();
    //     URL.revokeObjectURL(url);
    // };

    // ── Gerador Excel ─────────────────────────────────────────────────────────
    // const gerarExcel = (dadosOcorrencias) => {
    //     const dados = dadosOcorrencias.map(occ => ({
    //         'Data/Hora': formatarDataHora(occ.data_hora),
    //         'Câmera': occ.camera,
    //         'EPI': occ.epi,
    //         'Tipo': occ.tipo,
    //         'Status': occ.status,
    //     }));

    //     const worksheet = XLSX.utils.json_to_sheet(dados);
    //     const workbook = XLSX.utils.book_new();
    //     XLSX.utils.book_append_sheet(workbook, worksheet, 'Ocorrências');
    //     XLSX.writeFile(workbook, `ocorrencias_sims_${new Date().toISOString().slice(0, 10)}.xlsx`);
    // };

    // ── Auxiliar para detectar se está dentro do App React Native ──
    const estaNoApp = () => {
        return window.ReactNativeWebView !== undefined;
    };

    // ── Gerador CSV Atualizado ───────────────────────────────────────────────────────────
    const gerarCSV = (dadosOcorrencias) => {
        const cabecalho = ['Data/Hora', 'Câmera', 'EPI', 'Tipo', 'Status'];
        const linhas = dadosOcorrencias.map(occ => [
            formatarDataHora(occ.data_hora),
            occ.camera,
            occ.epi,
            occ.tipo,
            occ.status,
        ]);

        const conteudo = [cabecalho, ...linhas]
            .map(linha => linha.map(cel => `"${String(cel ?? '').replace(/"/g, '""')}"`).join(','))
            .join('\n');

        const nomeArquivo = `ocorrencias_sims_${new Date().toISOString().slice(0, 10)}.csv`;

        if (estaNoApp()) {
            // Envia para o React Native como texto simples (com o prefixo para sabermos o tipo)
            window.ReactNativeWebView.postMessage(JSON.stringify({
                tipo: 'download',
                extensao: 'csv',
                nome: nomeArquivo,
                payload: btoa(unescape(encodeURIComponent(conteudo))) // Converte string para Base64 seguro
            }));
        } else {
            // Comportamento normal no navegador do computador
            const blob = new Blob(['\uFEFF' + conteudo], { type: 'text/csv;charset=utf-8;' });
            const url = URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = nomeArquivo;
            link.click();
            URL.revokeObjectURL(url);
        }
    };

    // ── Gerador Excel Atualizado ─────────────────────────────────────────────────────────
    const gerarExcel = (dadosOcorrencias) => {
        const dados = dadosOcorrencias.map(occ => ({
            'Data/Hora': formatarDataHora(occ.data_hora),
            'Câmera': occ.camera,
            'EPI': occ.epi,
            'Tipo': occ.tipo,
            'Status': occ.status,
        }));

        const worksheet = XLSX.utils.json_to_sheet(dados);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, 'Ocorrências');
        const nomeArquivo = `ocorrencias_sims_${new Date().toISOString().slice(0, 10)}.xlsx`;

        if (estaNoApp()) {
            // Gera o Excel em formato de string binária base64
            const wbout = XLSX.write(workbook, { bookType: 'xlsx', type: 'base64' });
            window.ReactNativeWebView.postMessage(JSON.stringify({
                tipo: 'download',
                extensao: 'xlsx',
                nome: nomeArquivo,
                payload: wbout
            }));
        } else {
            XLSX.writeFile(workbook, nomeArquivo);
        }
    };

    // ── Orquestrador ──────────────────────────────────────────────────────────
    const gerarRelatorio = async () => {
        if (gerandoPDF) return;
        setGerandoPDF(true);

        if (nomeResponsavel != null && nomeResponsavel != '') {
            localStorage.setItem('nomeResponsavel', nomeResponsavel);
        }

        try {
            let dataInicioFinal = dataInicio;
            let dataFimFinal = dataFim;

            if (incluirHistorico && (!dataInicio || !dataFim)) {
                const hoje = new Date().toISOString().split('T')[0];
                dataInicioFinal = hoje;
                dataFimFinal = hoje;
            }

            // Pegar os dados diretamente da função
            const dadosCarregados = await carregarDados(dataInicioFinal, dataFimFinal);

            // Usar os dados retornados (NÃO usar os estados!)
            const tiposOcorrencias = dadosCarregados?.tipos || dadosGraficoTipoOcorrencia || [];
            const camerasData = dadosCarregados?.cameras || dadosGraficoCameras || [];
            const dadosGraficoLinhaLocal = dadosCarregados?.linha || dadosGraficoLinha || { horas: [], quantidades: [] };
            const metricas = dadosCarregados?.metricas || metricasGerais || {};
            const taxaConformidade = dadosCarregados?.conformidade || conformidade || 0;
            const ocorrenciasGerais = dadosCarregados?.ocorrencias || ocorrencias || [];

            // Extrair dadosCompletos das câmeras (importante!)
            let camerasDataCompletos = [];
            if (camerasData.dadosCompletos) {
                camerasDataCompletos = camerasData.dadosCompletos;
            } else if (Array.isArray(camerasData) && camerasData.length > 0 && camerasData[0].camera) {
                camerasDataCompletos = camerasData;
            } else if (camerasData.labels && camerasData.valores) {
                camerasDataCompletos = camerasData.labels.map((label, i) => ({
                    camera: label,
                    total: camerasData.valores[i]
                }));
            }

            // Dados do período (quando incluir histórico)
            let ocorrenciasPeriodo = [];
            let totalRegistrosPeriodo = 0;
            let todasOcorrenciasPeriodo = [];

            // Para CSV e Excel, o histórico é obrigatório (sempre usa dados do período)
            const usarHistorico = incluirHistorico || tipoRelatorio === 'csv' || tipoRelatorio === 'excel';

            if (usarHistorico && dadosCarregados?.periodo) {
                ocorrenciasPeriodo = dadosCarregados.periodo.ocorrencias || [];
                totalRegistrosPeriodo = dadosCarregados.periodo.total_registros || 0;
                todasOcorrenciasPeriodo = ocorrenciasPeriodo;
            }

            // ── Gerar CSV ou Excel (usando dados do período) ─────────────────────────
            if (tipoRelatorio === 'csv') {
                const dadosParaExportar = usarHistorico ? ocorrenciasPeriodo : ocorrenciasGerais;
                gerarCSV(dadosParaExportar);
                return;
            }

            if (tipoRelatorio === 'excel') {
                const dadosParaExportar = usarHistorico ? ocorrenciasPeriodo : ocorrenciasGerais;
                gerarExcel(dadosParaExportar);
                return;
            }

            // ── Calcular dados usando os dados retornados ─────────────────────
            const maiorTotal = tiposOcorrencias.length > 0
                ? Math.max(...tiposOcorrencias.map(i => i.total || 0))
                : 0;
            const epiMaisNegligenciadoText = tiposOcorrencias
                .filter(i => (i.total || 0) === maiorTotal)
                .map(i => i.epi)
                .join(', ') || 'N/A';

            const cameraMaiorIncidencia = camerasDataCompletos.length > 0
                ? camerasDataCompletos.reduce((max, i) => (i.total || 0) > (max.total || 0) ? i : max, camerasDataCompletos[0]).camera || 'N/A'
                : 'N/A';

            let horarioPico = 'N/A';
            if (dadosGraficoLinhaLocal?.quantidades?.length > 0) {
                const maiorQtd = Math.max(...dadosGraficoLinhaLocal.quantidades);
                if (maiorQtd > 0) {
                    const idx = dadosGraficoLinhaLocal.quantidades.indexOf(maiorQtd);
                    if (idx !== -1) horarioPico = dadosGraficoLinhaLocal.horas[idx] || 'N/A';
                }
            }

            const metade = Math.ceil(tiposOcorrencias.length / 2);
            const tiposPrimeiraColuna = tiposOcorrencias.slice(0, metade);
            const tiposSegundaColuna = tiposOcorrencias.slice(metade);

            const camerasOrdenadas = [...camerasDataCompletos].sort((a, b) => (b.total || 0) - (a.total || 0));

            const intervalosComOcorrencias = [];
            if (dadosGraficoLinhaLocal?.horas && dadosGraficoLinhaLocal.quantidades) {
                dadosGraficoLinhaLocal.horas.forEach((hora, i) => {
                    const qtd = dadosGraficoLinhaLocal.quantidades[i];
                    if (qtd > 0) intervalosComOcorrencias.push({ horario: hora, quantidade: qtd });
                });
                intervalosComOcorrencias.sort((a, b) => b.quantidade - a.quantidade);
            }

            // Para a página 1 (resumo) - mostrar apenas as 8 mais recentes
            const ultimasOcorrencias = incluirHistorico && ocorrenciasPeriodo.length > 0
                ? ocorrenciasPeriodo.slice(0, 8)
                : (ocorrenciasGerais || []).slice(0, 8);

            const totalHoje = metricas?.totalHoje || 0;
            const mediaDiaria = metricas?.mediaDiaria || 0;

            // Gerar código aleatório
            const codigoAleatorio = `SIMS-${Date.now()}-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;

            // Converter para PNG base64 via canvas
            const codigoBarrasPng = await new Promise((resolve, reject) => {
                try {
                    const canvas = document.createElement('canvas');
                    bwipjs.toCanvas(canvas, {
                        bcid: 'code128',
                        text: codigoAleatorio,
                        scale: 3,
                        height: 10,
                        includetext: false,
                    });
                    resolve(canvas.toDataURL('image/png'));
                } catch (err) {
                    reject(err);
                }
            });

            const dadosLinha = dadosGraficoLinhaLocal?.horas?.map((hora, i) => ({
                hora,
                quantidade: dadosGraficoLinhaLocal.quantidades[i] || 0,
            })) || [];

            const distribuicaoPorCameraData = camerasDataCompletos.map(item => ({
                camera: item.camera,
                Quantidade: Number(item.total),
            })) || [];


            // Paleta de azuis para o PieChart
            const coresPie = distribuicaoPorCameraData.map((_, i) => {
                const lightness = 20 + (i * 50 / Math.max(distribuicaoPorCameraData.length - 1, 1));
                return `hsl(214, 68%, ${lightness}%)`;
            });

            const [graficoPng, graficoPiePng, graficoBarraPng] = await Promise.all([
                capturarGraficoComoPng(
                    <LineChart width={500} height={220} data={dadosLinha}>
                        <XAxis dataKey="hora" tick={{ fontSize: 10 }} />
                        <YAxis tick={{ fontSize: 10 }} />
                        <Tooltip />
                        <Line type="monotone" dataKey="quantidade" stroke="#0A1E3F" strokeWidth={3} dot={false} isAnimationActive={false} />
                    </LineChart>
                ),
                capturarGraficoComoPng(
                    <PieChart width={500} height={220}>
                        <Pie data={distribuicaoPorCameraData} dataKey="Quantidade" nameKey="camera" cx="50%" cy="50%" outerRadius={80} isAnimationActive={false}>
                            {distribuicaoPorCameraData.map((_, i) => (
                                <Cell key={i} fill={coresPie[i]} />
                            ))}
                        </Pie>
                        <Tooltip />
                        <Legend />
                    </PieChart>
                ),
                capturarGraficoComoPng(
                    <BarChart width={500} height={220} data={tiposOcorrencias}>
                        <CartesianGrid strokeDasharray="1 1" />
                        <XAxis dataKey="epi" tick={{ fontSize: 10 }} />
                        <YAxis tick={{ fontSize: 10 }} />
                        <Tooltip />
                        <Bar dataKey="total" fill="#0A1E3F" isAnimationActive={false} />
                    </BarChart>
                ),
            ]);

            // ── Gerar e baixar PDF ──────────────────────────────────────────
            const blob = await pdf(
                <RelatorioPDF
                    incluirGraficos={incluirGraficos}
                    totalHoje={totalHoje}
                    mediaDiaria={mediaDiaria}
                    taxaConformidade={taxaConformidade}
                    epiMaisNegligenciadoText={epiMaisNegligenciadoText}
                    cameraMaiorIncidencia={cameraMaiorIncidencia}
                    horarioPico={horarioPico}
                    tiposPrimeiraColuna={tiposPrimeiraColuna}
                    tiposSegundaColuna={tiposSegundaColuna}
                    camerasOrdenadas={camerasOrdenadas}
                    intervalosComOcorrencias={intervalosComOcorrencias}
                    ultimasOcorrencias={ultimasOcorrencias}
                    formatarDataHora={formatarDataHora}
                    codigoAleatorio={codigoAleatorio}
                    codigoBarrasPng={codigoBarrasPng}
                    graficoPng={graficoPng}
                    graficoPiePng={graficoPiePng}
                    graficoBarraPng={graficoBarraPng}
                    incluirHistorico={incluirHistorico}
                    dataInicio={dataInicioFinal}
                    dataFim={dataFimFinal}
                    totalRegistros={totalRegistrosPeriodo}
                    todasOcorrencias={todasOcorrenciasPeriodo}
                    incluirGeral={incluirGeral}
                    nomeResponsavel={nomeResponsavel}
                />
            ).toBlob();
            const nomeArquivoPdf = `relatorio_sims_${new Date().toISOString().slice(0, 19).replace(/:/g, '-')}.pdf`;

            if (estaNoApp()) {
                // Converte o Blob do PDF em Base64 para enviar ao app
                const reader = new FileReader();
                reader.onloadend = () => {
                    const base64data = reader.result.split(',')[1]; // Pega apenas a string base64
                    window.ReactNativeWebView.postMessage(JSON.stringify({
                        tipo: 'download',
                        extensao: 'pdf',
                        nome: nomeArquivoPdf,
                        payload: base64data
                    }));
                };
                reader.readAsDataURL(blob);
            } else {
                // Comportamento original no PC
                const url = URL.createObjectURL(blob);
                const link = document.createElement('a');
                link.href = url;
                link.download = nomeArquivoPdf;
                link.click();
                URL.revokeObjectURL(url);
            }

        } catch (error) {
            console.error('Erro ao gerar PDF:', error);
        } finally {
            setGerandoPDF(false);
        }
    };

    const labelBotao = {
        pdf: 'Gerar PDF',
        csv: 'Gerar CSV',
        excel: 'Gerar Excel',
    }[tipoRelatorio] ?? 'Gerar Relatório';

    const desabilitado = carregandoDados || gerandoPDF || (nomeResponsavel == null || nomeResponsavel == '' || nomeResponsavel.length < 10);

    return (
        <button
            onClick={gerarRelatorio}
            className="botaoExportarPDF"
            disabled={desabilitado}
            style={{
                backgroundColor: '#0A1E3F',
                color: 'white',
                border: 'none',
                padding: '10px 20px',
                borderRadius: '6px',
                cursor: desabilitado ? 'not-allowed' : 'pointer',
                fontSize: '14px',
                fontWeight: '500',
                transition: 'background-color 0.2s',
                opacity: desabilitado ? 0.6 : 1,
            }}
            onMouseEnter={(e) => { if (!desabilitado) e.target.style.backgroundColor = '#1a2e4f'; }}
            onMouseLeave={(e) => { if (!desabilitado) e.target.style.backgroundColor = '#0A1E3F'; }}
        >
            {gerandoPDF ? 'Gerando...' : labelBotao}
        </button>
    );
};

export default ExportarRelatorioPDF;