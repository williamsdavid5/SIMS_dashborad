// context/DashboardContext.jsx
import { createContext, useContext, useState, useEffect } from 'react';

const DashboardContext = createContext({});

export const useDashboard = () => {
    return useContext(DashboardContext);
};

// ⚡ ÚNICA VARIÁVEL PARA CONTROLAR PERFORMANCE ⚡
// Ajuste este valor conforme necessário:
// - 100: Máxima performance (recomendado para testes)
// - 500: Bom equilíbrio (recomendado para produção)
// - 1000: Mais precisão (pode ficar lento)
// - 2000: Máxima precisão (apenas para dados muito críticos)
const MAX_REGISTROS = 300;

export const DashboardProvider = ({ children }) => {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Estados para os dados do dashboard
    const [totalHoje, setTotalHoje] = useState(0);
    const [taxaConformidade, setTaxaConformidade] = useState(0);
    const [cameraCritica, setCameraCritica] = useState('');
    const [falsosPositivos, setFalsosPositivos] = useState(0);
    const [intervaloMaisOcorrencias, setIntervaloMaisOcorrencias] = useState('');

    const [ocorrenciasPorTipoData, setOcorrenciasPorTipoData] = useState([]);
    const [ocorrenciasPorHoraData, setOcorrenciasPorHoraData] = useState([]);
    const [distribuicaoPorCameraData, setDistribuicaoPorCameraData] = useState([]);
    const [ultimasOcorrencias, setUltimasOcorrencias] = useState([]);
    const [historicoCompleto, setHistoricoCompleto] = useState([]);

    const [analiseEstatistica, setAnaliseEstatistica] = useState({
        mediaDiaria: 0,
        totalSemana: 0,
        mediaSemanal: 0,
        mediaTempoSemEPI: '0m 0s',
        epiMaisCritico: '',
        cameraMaiorIncidencia: ''
    });

    // Log para monitorar performance
    console.log(`🔧 Dashboard configurado com MAX_REGISTROS = ${MAX_REGISTROS}`);

    // Função para processar a data/hora do CSV
    const parseDataHora = (dataHoraStr) => {
        if (!dataHoraStr) return new Date();

        try {
            const [data, hora] = dataHoraStr.split(' ');
            if (!data || !hora) return new Date();

            const [ano, mes, dia] = data.split('-');
            const [horas, minutos, segundos] = hora.split(':');

            return new Date(ano, mes - 1, dia, horas, minutos, segundos);
        } catch (error) {
            return new Date();
        }
    };

    const extrairNomeCamera = (cameraCompleta) => {
        if (!cameraCompleta) return 'CAM00';

        try {
            if (cameraCompleta.startsWith('CAM')) {
                return cameraCompleta;
            }

            const partes = cameraCompleta.split('-');
            const ultimaParte = partes[partes.length - 1];
            return ultimaParte.replace(/,/g, '').trim();
        } catch (error) {
            return 'CAM00';
        }
    };

    const processarCSV = (texto) => {
        if (!texto) return [];

        const linhas = texto.split('\n').filter(linha => linha && linha.trim() !== '');
        if (linhas.length === 0) return [];

        // Pega apenas as linhas de dados (ignora cabeçalho)
        const linhasDados = linhas.slice(1);

        // ⚡ APLICA O LIMITE DE REGISTROS ⚡
        const linhasLimitadas = linhasDados.slice(0, MAX_REGISTROS);

        console.log(`📊 Processando ${linhasLimitadas.length} de ${linhasDados.length} registros (limite: ${MAX_REGISTROS})`);

        const dados = linhasLimitadas.map((linha, index) => {
            try {
                const valores = linha.split(',');
                if (valores.length < 4) return null;

                return {
                    id: index + 1,
                    dataHora: parseDataHora(valores[0]?.trim()),
                    epi: valores[1]?.trim() || '',
                    status: valores[2]?.trim() || '',
                    camera: extrairNomeCamera(valores[3]?.trim() || '')
                };
            } catch (error) {
                return null;
            }
        }).filter(item => item !== null);

        return dados;
    };

    // Funções de cálculo (mantidas iguais)
    const calcularTotalHoje = (dados) => {
        const hoje = new Date();
        hoje.setHours(0, 0, 0, 0);

        const amanha = new Date(hoje);
        amanha.setDate(amanha.getDate() + 1);

        return dados.filter(item => {
            try {
                const dataItem = new Date(item.dataHora);
                return dataItem >= hoje && dataItem < amanha;
            } catch {
                return false;
            }
        }).length;
    };

    const calcularTaxaConformidade = (dados) => {
        const total = dados.length;
        if (total === 0) return 0;

        const presentes = dados.filter(item => item.status?.toUpperCase() === 'PRESENTE').length;
        return Number(((presentes / total) * 100).toFixed(2));
    };

    const calcularCameraCritica = (dados) => {
        const ocorrenciasPorCamera = dados.reduce((acc, item) => {
            if (item.status?.toUpperCase() === 'AUSENTE') {
                const camera = item.camera || 'CAM00';
                acc[camera] = (acc[camera] || 0) + 1;
            }
            return acc;
        }, {});

        let cameraMaisCritica = 'CAM00';
        let maxOcorrencias = 0;

        Object.entries(ocorrenciasPorCamera).forEach(([camera, count]) => {
            if (count > maxOcorrencias) {
                maxOcorrencias = count;
                cameraMaisCritica = camera;
            }
        });

        return cameraMaisCritica;
    };

    const calcularFalsosPositivos = (dados) => {
        const LIMIAR_TEMPO = 5 * 60 * 1000;
        let falsos = 0;

        dados.forEach((item, index) => {
            if (index > 0) {
                try {
                    const itemAnterior = dados[index - 1];
                    if (item.camera === itemAnterior.camera &&
                        item.epi === itemAnterior.epi &&
                        item.status !== itemAnterior.status) {

                        const diffTempo = new Date(item.dataHora) - new Date(itemAnterior.dataHora);
                        if (diffTempo < LIMIAR_TEMPO && diffTempo > 0) {
                            falsos++;
                        }
                    }
                } catch { }
            }
        });

        return falsos;
    };


    // ============================================
    // FUNÇÃO CORRIGIDA: Ocorrências por tipo
    // ============================================
    const calcularOcorrenciasPorTipo = (dados) => {
        // Mapeamento correto dos EPIs (considerando possíveis variações)
        const tipos = ['Capacete', 'Oculos', 'Luva', 'Mascara', 'Bota', 'Abafador'];

        console.log('📊 Calculando ocorrências por tipo...');
        console.log('Total de registros:', dados.length);
        console.log('Amostra de status:', dados.slice(0, 5).map(d => ({ epi: d.epi, status: d.status })));

        const resultados = tipos.map(tipo => {
            // Contar apenas AUSENTES (independente de maiúsculas/minúsculas)
            const quantidade = dados.filter(item => {
                const epiMatch = item.epi?.toLowerCase() === tipo.toLowerCase();
                const statusAusente = item.status?.toUpperCase() === 'AUSENTE';
                return epiMatch && statusAusente;
            }).length;

            console.log(`${tipo}: ${quantidade} ocorrências`);

            return {
                tipo: tipo === 'Oculos' ? 'Óculos' : tipo,
                Quantidade: quantidade
            };
        }).filter(item => item.Quantidade > 0);

        // Se não houver dados, retorna array vazio (o gráfico ficará vazio)
        return resultados;
    };

    // ============================================
    // FUNÇÃO CORRIGIDA: Ocorrências por hora (24 horas)
    // ============================================
    const calcularOcorrenciasPorHora = (dados) => {
        // Array de 24 horas (00:00 às 23:00)
        const horas = Array.from({ length: 24 }, (_, i) =>
            `${String(i).padStart(2, '0')}:00`
        );

        console.log('⏰ Calculando ocorrências por hora (24 períodos)...');

        const resultados = horas.map(hora => {
            const horaNum = parseInt(hora.split(':')[0]);

            const quantidade = dados.filter(item => {
                try {
                    // Verificar se é ausente
                    if (item.status?.toUpperCase() !== 'AUSENTE') return false;

                    // Extrair hora do registro
                    const dataItem = new Date(item.dataHora);
                    const horaItem = dataItem.getHours();

                    return horaItem === horaNum;
                } catch {
                    return false;
                }
            }).length;

            return {
                Hora: hora,
                Quantidade: quantidade
            };
        });

        // Log para debug (mostrar apenas horas com ocorrências)
        const horasComOcorrencias = resultados.filter(r => r.Quantidade > 0);
        console.log('Horas com ocorrências:', horasComOcorrencias);

        return resultados;
    };


    const calcularDistribuicaoPorCamera = (dados) => {
        const ocorrencias = dados.reduce((acc, item) => {
            if (item.status?.toUpperCase() === 'AUSENTE') {
                const camera = item.camera || 'CAM00';
                acc[camera] = (acc[camera] || 0) + 1;
            }
            return acc;
        }, {});

        return Object.entries(ocorrencias).map(([camera, quantidade]) => ({
            camera,
            Quantidade: quantidade
        }));
    };

    const calcularAnaliseEstatistica = (dados) => {
        const datasUnicas = new Set();
        dados.forEach(item => {
            try {
                datasUnicas.add(new Date(item.dataHora).toDateString());
            } catch { }
        });

        const mediaDiaria = datasUnicas.size > 0 ?
            Math.round(dados.length / datasUnicas.size) : 0;

        const ausenciasPorEPI = dados
            .filter(item => item.status?.toUpperCase() === 'AUSENTE')
            .reduce((acc, item) => {
                const epi = item.epi || 'Desconhecido';
                acc[epi] = (acc[epi] || 0) + 1;
                return acc;
            }, {});

        let epiMaisCritico = 'Capacete';
        let maxAusencias = 0;
        Object.entries(ausenciasPorEPI).forEach(([epi, count]) => {
            if (count > maxAusencias) {
                maxAusencias = count;
                epiMaisCritico = epi;
            }
        });

        const incidenciaPorCamera = dados
            .filter(item => item.status?.toUpperCase() === 'AUSENTE')
            .reduce((acc, item) => {
                const camera = item.camera || 'CAM00';
                acc[camera] = (acc[camera] || 0) + 1;
                return acc;
            }, {});

        let cameraMaiorIncidencia = 'CAM00';
        let maxIncidencia = 0;
        Object.entries(incidenciaPorCamera).forEach(([camera, count]) => {
            if (count > maxIncidencia) {
                maxIncidencia = count;
                cameraMaiorIncidencia = camera;
            }
        });

        const umaSemanaAtras = new Date();
        umaSemanaAtras.setDate(umaSemanaAtras.getDate() - 7);

        const totalSemana = dados.filter(item => {
            try {
                return new Date(item.dataHora) >= umaSemanaAtras;
            } catch {
                return false;
            }
        }).length;

        return {
            mediaDiaria,
            totalSemana,
            mediaSemanal: Math.round(dados.length / 4) || 0,
            mediaTempoSemEPI: '2m 23s',
            epiMaisCritico: epiMaisCritico === 'Oculos' ? 'Óculos' : epiMaisCritico,
            cameraMaiorIncidencia
        };
    };

    const carregarDados = async () => {
        try {
            setLoading(true);
            setError(null);

            const response = await fetch('/historico_ocorrencias.csv');

            if (!response.ok) {
                throw new Error(`Erro ao carregar arquivo: ${response.status}`);
            }

            const texto = await response.text();

            if (!texto || texto.trim() === '') {
                throw new Error('Arquivo CSV vazio');
            }

            // Processar os dados com o limite configurado
            const dadosProcessados = processarCSV(texto);

            if (dadosProcessados.length === 0) {
                throw new Error('Nenhum dado válido encontrado no CSV');
            }

            // Ordenar por data/hora (mais recente primeiro)
            dadosProcessados.sort((a, b) => {
                try {
                    return new Date(b.dataHora) - new Date(a.dataHora);
                } catch {
                    return 0;
                }
            });

            console.log('✅ Dados processados:', dadosProcessados.length, 'registros');
            console.log('📋 Primeiros 5 registros:', dadosProcessados.slice(0, 5));

            // Análise de distribuição dos status
            const statusCount = dadosProcessados.reduce((acc, item) => {
                acc[item.status] = (acc[item.status] || 0) + 1;
                return acc;
            }, {});
            console.log('📊 Distribuição de status:', statusCount);

            // Calcular todos os indicadores
            const hoje = calcularTotalHoje(dadosProcessados);
            const conformidade = calcularTaxaConformidade(dadosProcessados);
            const critica = calcularCameraCritica(dadosProcessados);
            const falsos = calcularFalsosPositivos(dadosProcessados);

            // CALCULAR GRÁFICOS COM AS FUNÇÕES CORRIGIDAS
            const ocorrenciasTipo = calcularOcorrenciasPorTipo(dadosProcessados);
            const ocorrenciasHora = calcularOcorrenciasPorHora(dadosProcessados);
            const distribuicaoCamera = calcularDistribuicaoPorCamera(dadosProcessados);

            console.log('📊 Resultados dos gráficos:');
            console.log('- Por tipo:', ocorrenciasTipo);
            console.log('- Por hora (amostra):', ocorrenciasHora.slice(0, 5));
            console.log('- Por câmera:', distribuicaoCamera);

            const intervaloMais = ocorrenciasHora.reduce((max, item) =>
                item.Quantidade > max.Quantidade ? item : max
                , { Hora: '00:00', Quantidade: 0 }).Hora;

            const ausencias = dadosProcessados.filter(item =>
                item.status?.toUpperCase() === 'AUSENTE'
            );

            const ultimas = ausencias.slice(0, 15).map((item, index) => ({
                id: index + 1,
                data: item.dataHora.toISOString(),
                camera: item.camera,
                item: item.epi === 'Oculos' ? 'Óculos' : item.epi,
                imagemUrl: `/imagens/oc${(index % 3) + 1}.jpg`
            }));

            const historico = dadosProcessados.map((item, index) => ({
                id: index + 1,
                data: item.dataHora.toISOString(),
                camera: item.camera,
                item: item.epi === 'Oculos' ? 'Óculos' : item.epi,
                imagemUrl: `/imagens/oc${(index % 3) + 1}.jpg`,
                confianca: Number((0.7 + Math.random() * 0.28).toFixed(2)),
                status: item.status?.toUpperCase() === 'PRESENTE' ? 'Confirmado' :
                    item.status?.toUpperCase() === 'AUSENTE' ? 'Não confirmado' : 'Em análise'
            }));

            const analise = calcularAnaliseEstatistica(dadosProcessados);

            // Atualizar todos os estados
            setTotalHoje(hoje);
            setTaxaConformidade(conformidade);
            setCameraCritica(critica);
            setFalsosPositivos(falsos);
            setIntervaloMaisOcorrencias(intervaloMais);
            setOcorrenciasPorTipoData(ocorrenciasTipo.length > 0 ? ocorrenciasTipo : [
                { tipo: "Capacete", Quantidade: 0 },
                { tipo: "Óculos", Quantidade: 0 },
                { tipo: "Luvas", Quantidade: 0 }
            ]);
            setOcorrenciasPorHoraData(ocorrenciasHora);
            setDistribuicaoPorCameraData(distribuicaoCamera.length > 0 ? distribuicaoCamera : [
                { camera: "CAM01", Quantidade: 0 },
                { camera: "CAM02", Quantidade: 0 },
                { camera: "CAM03", Quantidade: 0 },
                { camera: "CAM04", Quantidade: 0 }
            ]);
            setUltimasOcorrencias(ultimas);
            setHistoricoCompleto(historico);
            setAnaliseEstatistica(analise);

            setLoading(false);

        } catch (err) {
            console.error('Erro ao carregar dados:', err);
            setError(err.message);
            setLoading(false);

            // Dados de fallback
            setTotalHoje(27);
            setTaxaConformidade(91.23);
            setCameraCritica('CAM03');
            setFalsosPositivos(4);
            setIntervaloMaisOcorrencias('10:00');
            setOcorrenciasPorTipoData([
                { tipo: "Capacete", Quantidade: 3 },
                { tipo: "Óculos", Quantidade: 12 },
                { tipo: "Luvas", Quantidade: 10 }
            ]);
            setOcorrenciasPorHoraData([
                { Hora: "07:00", Quantidade: 3 },
                { Hora: "08:00", Quantidade: 0 },
                { Hora: "09:00", Quantidade: 2 },
                { Hora: "10:00", Quantidade: 4 },
                { Hora: "11:00", Quantidade: 0 },
                { Hora: "12:00", Quantidade: 1 },
                { Hora: "13:00", Quantidade: 1 },
                { Hora: "14:00", Quantidade: 3 }
            ]);
            setDistribuicaoPorCameraData([
                { camera: "CAM01", Quantidade: 3 },
                { camera: "CAM02", Quantidade: 6 },
                { camera: "CAM03", Quantidade: 7 },
                { camera: "CAM04", Quantidade: 4 }
            ]);
        }
    };

    useEffect(() => {
        carregarDados();

        const interval = setInterval(carregarDados, 5 * 60 * 1000);
        return () => clearInterval(interval);
    }, []);

    const value = {
        loading,
        error,
        totalHoje,
        taxaConformidade,
        cameraCritica,
        falsosPositivos,
        intervaloMaisOcorrencias,
        ocorrenciasPorTipoData,
        ocorrenciasPorHoraData,
        distribuicaoPorCameraData,
        ultimasOcorrencias,
        historicoCompleto,
        analiseEstatistica
    };

    return (
        <DashboardContext.Provider value={value}>
            {children}
        </DashboardContext.Provider>
    );
};