// components/ExportarRelatorioPDF.jsx
// Dependência: npm install @react-pdf/renderer

import { useApp } from '../context/AppContext';
import { useState, useEffect } from 'react';
import { pdf, Document, Page, View, Text, StyleSheet, Image } from '@react-pdf/renderer';
import bwipjs from 'bwip-js';

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
        marginTop: 2,
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
    headerLogos: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        width: '100%',
        marginBottom: 10,
    },
    logo: {
        height: 28,
        objectFit: 'contain',
    },
    logo2: {
        height: 24,
        objectFit: 'contain',
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

// ─── Documento PDF ────────────────────────────────────────────────────────────

const RelatorioPDF = ({
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
}) => (
    <Document>
        <Page size="A4" style={s.page}>

            {/* Header */}
            <View style={s.header}>
                <View style={s.headerLogos}>
                    <Image src={SIMSLogo} style={s.logo2} />
                    <Image src={VIICLogo} style={s.logo} />
                </View>
                <Text style={s.headerTitulo}>Relatório SIMS</Text>
                <Text style={s.headerSubtitulo}>Sistema Inteligente de Monitoramento e Segurança</Text>
                <Text style={s.headerResumo}>Resumo de detecções de EPI</Text>
                <View style={s.badge}>
                    <Text style={s.badgeTexto}>
                        Emitido em: {new Date().toLocaleDateString('pt-BR')}
                    </Text>
                </View>
            </View>

            {/* Informações Gerais */}
            <Secao titulo="Informações Gerais">
                <Linha label="Total de alertas hoje:" valor={String(totalHoje)} />
                <Linha label="Média diária de alertas:" valor={String(mediaDiaria)} />
                <Linha label="Taxa geral de conformidade:" valor={`${taxaConformidade}%`} />
                <Linha label="EPI(s) mais negligenciado(s):" valor={epiMaisNegligenciadoText} />
                <Linha label="Câmera com maior incidência:" valor={cameraMaiorIncidencia} />
                <Linha label="Intervalo com mais ocorrências:" valor={horarioPico} />
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
            </Secao>

            {/* Detecções por câmera */}
            <Secao
                titulo="Detecções por câmera"
                descricao="Números de detecções para cada câmera, esse dado indica as áreas com maior negligência."
            >
                {camerasOrdenadas.map((camera, i) => (
                    <Linha key={i} label={`${camera.camera}:`} valor={String(camera.total)} />
                ))}
            </Secao>

            {/* Detecções por intervalo */}
            <Secao
                titulo="Detecções por intervalo"
                descricao="Intervalos com maior quantidade de detecções, os horários indicam o início do intervalo, durando exatamente 1 hora. Exemplo: o intervalo das 08:00 finaliza às 08:59, e as detecções registradas ocorreram dentro desse horário."
            >
                <Text style={s.obs}>
                    Obs: os intervalos estão organizados por número de detecções, os intervalos que não aparecem, não possuem detecções registradas.
                </Text>
                {intervalosComOcorrencias.slice(0, 6).map((item, i) => (
                    <Linha key={i} label={`${item.horario} -`} valor={`${item.quantidade} ocorrências`} />
                ))}
            </Secao>

            {/* Últimas Ocorrências */}
            {/* <Secao titulo="Últimas Ocorrências">
                {ultimasOcorrencias.map((occ, i) => (
                    <View key={i} style={s.linha}>
                        <Text style={s.label}>{formatarDataHora(occ.data_hora)} </Text>
                        <Text style={s.valor}>- {occ.camera} - {occ.epi}</Text>
                    </View>
                ))}
            </Secao> */}

            <View style={s.rodape}>
                <Text style={s.codigoTexto}>{codigoAleatorio}</Text>
                <Image src={codigoBarrasPng} style={s.codigoBarras} />
            </View>
        </Page>
    </Document>
);

// ─── Componente principal ─────────────────────────────────────────────────────

const ExportarRelatorioPDF = () => {
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
    } = useApp();

    const [carregandoDados, setCarregandoDados] = useState(false);
    const [gerandoPDF, setGerandoPDF] = useState(false);

    const carregarDados = async () => {
        setCarregandoDados(true);
        try {
            await Promise.all([
                fetchOcorrencias(),
                fetchGraficoTipos(),
                fetchGraficoLinha(),
                fetchMetricasGerais(),
                fetchGraficoCameras(),
            ]);
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

    const gerarRelatorioPDF = async () => {

        carregarDados();

        if (gerandoPDF) return;
        setGerandoPDF(true);

        try {
            // ── Calcular dados ──────────────────────────────────────────────
            const tiposOcorrencias = dadosGraficoTipoOcorrencia || [];

            const maiorTotal = tiposOcorrencias.length > 0
                ? Math.max(...tiposOcorrencias.map(i => i.total || 0))
                : 0;
            const epiMaisNegligenciadoText = tiposOcorrencias
                .filter(i => (i.total || 0) === maiorTotal)
                .map(i => i.epi)
                .join(', ') || 'N/A';

            const camerasData = dadosGraficoCameras?.dadosCompletos || [];
            const cameraMaiorIncidencia = camerasData.length > 0
                ? camerasData.reduce((max, i) => (i.total || 0) > (max.total || 0) ? i : max, camerasData[0]).camera || 'N/A'
                : 'N/A';

            let horarioPico = 'N/A';
            if (dadosGraficoLinha?.quantidades?.length > 0) {
                const maiorQtd = Math.max(...dadosGraficoLinha.quantidades);
                if (maiorQtd > 0) {
                    const idx = dadosGraficoLinha.quantidades.indexOf(maiorQtd);
                    if (idx !== -1) horarioPico = dadosGraficoLinha.horas[idx] || 'N/A';
                }
            }

            const metade = Math.ceil(tiposOcorrencias.length / 2);
            const tiposPrimeiraColuna = tiposOcorrencias.slice(0, metade);
            const tiposSegundaColuna = tiposOcorrencias.slice(metade);

            const camerasOrdenadas = [...camerasData].sort((a, b) => (b.total || 0) - (a.total || 0));

            const intervalosComOcorrencias = [];
            if (dadosGraficoLinha?.horas && dadosGraficoLinha.quantidades) {
                dadosGraficoLinha.horas.forEach((hora, i) => {
                    const qtd = dadosGraficoLinha.quantidades[i];
                    if (qtd > 0) intervalosComOcorrencias.push({ horario: hora, quantidade: qtd });
                });
                intervalosComOcorrencias.sort((a, b) => b.quantidade - a.quantidade);
            }

            const ultimasOcorrencias = (ocorrencias || []).slice(0, 8);
            const totalHoje = metricasGerais?.totalHoje || 0;
            const mediaDiaria = metricasGerais?.mediaDiaria || 0;
            const taxaConformidade = 93.52;

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

            // ── Gerar e baixar PDF ──────────────────────────────────────────
            const blob = await pdf(
                <RelatorioPDF
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
                />
            ).toBlob();

            const url = URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = `relatorio_sims_${new Date().toISOString().slice(0, 19).replace(/:/g, '-')}.pdf`;
            link.click();
            URL.revokeObjectURL(url);

        } catch (error) {
            console.error('Erro ao gerar PDF:', error);
        } finally {
            setGerandoPDF(false);
        }
    };

    const desabilitado = carregandoDados || gerandoPDF;

    return (
        <button
            onClick={gerarRelatorioPDF}
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
            {gerandoPDF ? 'Gerando PDF...' : carregandoDados ? 'Gerando PDF...' : 'Gerar Relatório'}
        </button>
    );
};

export default ExportarRelatorioPDF;