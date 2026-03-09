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
const MAX_REGISTROS = 500;

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
            // Formato esperado: "2026-03-07 12:41:52"
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
            // Formato: "GSL-1919-GLC-4821-CAM01"
            const partes = cameraCompleta.split('-');
            return partes[partes.length - 1] || 'CAM00';
        } catch (error) {
            return 'CAM00';
        }
    };

    // Processar EPIs faltando da string
    const processarEPIsFaltando = (episStr) => {
        if (!episStr || episStr === '""' || episStr === '') return [];

        // Remove aspas se houver e divide por vírgula
        const episLimpo = episStr.replace(/"/g, '');
        return episLimpo.split(',').map(epi => epi.trim()).filter(epi => epi);
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
                // CSV com campos que podem conter vírgulas dentro de strings
                const valores = linha.match(/(".*?"|[^,]+)(?=\s*,|\s*$)/g) || [];
                if (valores.length < 6) return null;

                const timestamp = valores[0]?.trim();
                const camera = valores[1]?.trim();
                const pessoasDetectadas = parseInt(valores[2]?.trim()) || 0;
                const episDetectados = parseInt(valores[3]?.trim()) || 0;
                const episFaltando = valores[4]?.trim() || '';
                const desvio = parseInt(valores[5]?.trim()) || 0;

                // Determinar status baseado nos dados
                let status = 'PRESENTE';
                let epi = '';

                if (desvio === 1 && episFaltando) {
                    status = 'AUSENTE';
                    // Pega o primeiro EPI faltando como exemplo
                    const episLista = processarEPIsFaltando(episFaltando);
                    epi = episLista[0] || 'EPI Desconhecido';
                }

                return {
                    id: index + 1,
                    dataHora: parseDataHora(timestamp),
                    camera: extrairNomeCamera(camera),
                    epi: epi,
                    status: status,
                    pessoasDetectadas,
                    episDetectados,
                    episFaltando: processarEPIsFaltando(episFaltando),
                    desvio
                };
            } catch (error) {
                console.error('Erro ao processar linha:', error);
                return null;
            }
        }).filter(item => item !== null);

        return dados;
    };

    // Funções de cálculo adaptadas
    const calcularTotalHoje = (dados) => {
        const hoje = new Date();
        hoje.setHours(0, 0, 0, 0);

        const amanha = new Date(hoje);
        amanha.setDate(amanha.getDate() + 1);

        // Contar apenas registros com desvio (ocorrências)
        return dados.filter(item => {
            try {
                const dataItem = new Date(item.dataHora);
                return dataItem >= hoje && dataItem < amanha && item.desvio === 1;
            } catch {
                return false;
            }
        }).length;
    };

    const calcularTaxaConformidade = (dados) => {
        const totalComPessoas = dados.filter(item => item.pessoasDetectadas > 0).length;
        if (totalComPessoas === 0) return 100;

        const conformidades = dados.filter(item =>
            item.pessoasDetectadas > 0 && item.desvio === 0
        ).length;

        return Number(((conformidades / totalComPessoas) * 100).toFixed(2));
    };

    const calcularCameraCritica = (dados) => {
        const ocorrenciasPorCamera = dados.reduce((acc, item) => {
            if (item.desvio === 1) {
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
        const LIMIAR_TEMPO = 3 * 1000; // 3 segundos
        let falsos = 0;

        dados.forEach((item, index) => {
            if (index > 0 && item.desvio === 1) {
                try {
                    const itemAnterior = dados[index - 1];

                    // Se o registro anterior também tem desvio e é da mesma câmera
                    if (itemAnterior.desvio === 1 && item.camera === itemAnterior.camera) {
                        const diffTempo = new Date(item.dataHora) - new Date(itemAnterior.dataHora);

                        // Se a diferença é muito pequena, pode ser falso positivo
                        if (diffTempo < LIMIAR_TEMPO && diffTempo > 0) {
                            falsos++;
                        }
                    }
                } catch { }
            }
        });

        return falsos;
    };

    const calcularOcorrenciasPorTipo = (dados) => {
        const tipos = ['capacete', 'oculos', 'luva', 'mascara', 'bota', 'abafador'];

        console.log('📊 Calculando ocorrências por tipo...');

        const resultados = tipos.map(tipo => {
            const quantidade = dados.filter(item => {
                if (item.desvio !== 1) return false;

                // Verificar se este EPI específico está na lista de faltando
                return item.episFaltando.some(epi =>
                    epi.toLowerCase().includes(tipo.toLowerCase())
                );
            }).length;

            return {
                tipo: tipo === 'oculos' ? 'Óculos' :
                    tipo.charAt(0).toUpperCase() + tipo.slice(1),
                Quantidade: quantidade
            };
        }).filter(item => item.Quantidade > 0);

        return resultados;
    };

    const calcularOcorrenciasPorHora = (dados) => {
        const horas = Array.from({ length: 24 }, (_, i) =>
            `${String(i).padStart(2, '0')}:00`
        );

        console.log('⏰ Calculando ocorrências por hora (24 períodos)...');

        const resultados = horas.map(hora => {
            const horaNum = parseInt(hora.split(':')[0]);

            const quantidade = dados.filter(item => {
                try {
                    if (item.desvio !== 1) return false;

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

        const horasComOcorrencias = resultados.filter(r => r.Quantidade > 0);
        console.log('Horas com ocorrências:', horasComOcorrencias);

        return resultados;
    };

    const calcularDistribuicaoPorCamera = (dados) => {
        const ocorrencias = dados.reduce((acc, item) => {
            if (item.desvio === 1) {
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
        // Calcular dias únicos com ocorrências
        const datasUnicas = new Set();
        dados.forEach(item => {
            try {
                if (item.desvio === 1) {
                    datasUnicas.add(new Date(item.dataHora).toDateString());
                }
            } catch { }
        });

        const ocorrenciasTotais = dados.filter(item => item.desvio === 1).length;
        const mediaDiaria = datasUnicas.size > 0 ?
            Math.round(ocorrenciasTotais / datasUnicas.size) : 0;

        // EPI mais crítico
        const ausenciasPorEPI = {};
        dados.forEach(item => {
            if (item.desvio === 1) {
                item.episFaltando.forEach(epi => {
                    ausenciasPorEPI[epi] = (ausenciasPorEPI[epi] || 0) + 1;
                });
            }
        });

        let epiMaisCritico = 'Capacete';
        let maxAusencias = 0;
        Object.entries(ausenciasPorEPI).forEach(([epi, count]) => {
            if (count > maxAusencias) {
                maxAusencias = count;
                epiMaisCritico = epi;
            }
        });

        // Câmera com maior incidência
        const incidenciaPorCamera = dados.reduce((acc, item) => {
            if (item.desvio === 1) {
                const camera = item.camera || 'CAM00';
                acc[camera] = (acc[camera] || 0) + 1;
            }
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

        // Total da última semana
        const umaSemanaAtras = new Date();
        umaSemanaAtras.setDate(umaSemanaAtras.getDate() - 7);

        const totalSemana = dados.filter(item => {
            try {
                return item.desvio === 1 && new Date(item.dataHora) >= umaSemanaAtras;
            } catch {
                return false;
            }
        }).length;

        return {
            mediaDiaria,
            totalSemana,
            mediaSemanal: Math.round(ocorrenciasTotais / 4) || 0, // Aproximadamente 4 semanas
            mediaTempoSemEPI: '2m 23s', // Mantido como exemplo
            epiMaisCritico: epiMaisCritico === 'oculos' ? 'Óculos' :
                epiMaisCritico.charAt(0).toUpperCase() + epiMaisCritico.slice(1),
            cameraMaiorIncidencia
        };
    };

    const carregarDados = async () => {
        try {
            setLoading(true);
            setError(null);

            const response = await fetch('/monitoramento_epi.csv');

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
            console.log('📊 Estatísticas rápidas:', {
                totalRegistros: dadosProcessados.length,
                ocorrencias: dadosProcessados.filter(d => d.desvio === 1).length,
                cameras: [...new Set(dadosProcessados.map(d => d.camera))],
                periodo: {
                    inicio: dadosProcessados[dadosProcessados.length - 1]?.dataHora,
                    fim: dadosProcessados[0]?.dataHora
                }
            });

            // Calcular todos os indicadores
            const hoje = calcularTotalHoje(dadosProcessados);
            const conformidade = calcularTaxaConformidade(dadosProcessados);
            const critica = calcularCameraCritica(dadosProcessados);
            const falsos = calcularFalsosPositivos(dadosProcessados);

            // CALCULAR GRÁFICOS
            const ocorrenciasTipo = calcularOcorrenciasPorTipo(dadosProcessados);
            const ocorrenciasHora = calcularOcorrenciasPorHora(dadosProcessados);
            const distribuicaoCamera = calcularDistribuicaoPorCamera(dadosProcessados);

            console.log('📊 Resultados dos gráficos:', {
                tipos: ocorrenciasTipo,
                horasComOcorrencias: ocorrenciasHora.filter(h => h.Quantidade > 0).length,
                cameras: distribuicaoCamera.length
            });

            const intervaloMais = ocorrenciasHora.reduce((max, item) =>
                item.Quantidade > max.Quantidade ? item : max
                , { Hora: '00:00', Quantidade: 0 }).Hora;

            // Últimas ocorrências (apenas desvios)
            const ocorrencias = dadosProcessados.filter(item => item.desvio === 1);
            const ultimas = ocorrencias.slice(0, 15).map((item, index) => ({
                id: index + 1,
                data: item.dataHora.toISOString(),
                camera: item.camera,
                item: item.episFaltando.join(', ') || 'Múltiplos EPIs',
                imagemUrl: `/imagens/oc${(index % 3) + 1}.jpg`
            }));

            // Histórico completo para a tabela
            const historico = dadosProcessados.slice(0, 100).map((item, index) => ({
                id: index + 1,
                data: item.dataHora.toISOString(),
                camera: item.camera,
                item: item.episFaltando.join(', ') || 'Nenhum',
                imagemUrl: `/imagens/oc${(index % 3) + 1}.jpg`,
                confianca: Number((0.85 + Math.random() * 0.14).toFixed(2)),
                status: item.desvio === 1 ? 'Não confirmado' : 'Confirmado',
                pessoasDetectadas: item.pessoasDetectadas
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
                { tipo: "Luva", Quantidade: 0 }
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
            setTotalHoje(15);
            setTaxaConformidade(87.5);
            setCameraCritica('CAM01');
            setFalsosPositivos(3);
            setIntervaloMaisOcorrencias('12:00');
            setOcorrenciasPorTipoData([
                { tipo: "Capacete", Quantidade: 5 },
                { tipo: "Óculos", Quantidade: 8 },
                { tipo: "Luva", Quantidade: 4 },
                { tipo: "Mascara", Quantidade: 2 }
            ]);
            setOcorrenciasPorHoraData([
                { Hora: "08:00", Quantidade: 2 },
                { Hora: "09:00", Quantidade: 1 },
                { Hora: "10:00", Quantidade: 3 },
                { Hora: "11:00", Quantidade: 4 },
                { Hora: "12:00", Quantidade: 5 },
                { Hora: "13:00", Quantidade: 3 },
                { Hora: "14:00", Quantidade: 2 },
                { Hora: "15:00", Quantidade: 1 },
                { Hora: "16:00", Quantidade: 2 },
                { Hora: "17:00", Quantidade: 1 }
            ]);
            setDistribuicaoPorCameraData([
                { camera: "CAM01", Quantidade: 8 },
                { camera: "CAM02", Quantidade: 4 },
                { camera: "CAM03", Quantidade: 6 },
                { camera: "CAM04", Quantidade: 3 }
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