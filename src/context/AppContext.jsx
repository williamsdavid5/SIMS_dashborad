import React, { createContext, useState, useContext, useCallback } from 'react';
import api from '../services/api';

const AppContext = createContext({});

export function AppProvider({ children }) {
    const [ocorrencias, setOcorrencias] = useState([]);
    const [pagina, setPagina] = useState(1);
    const [temMais, setTemMais] = useState(true);
    const [carregando, setCarregando] = useState(false);
    const [dadosGraficoTipoOcorrencia, setDadosGraficoTipoOcorrencia,] = useState([]);

    const [dadosGraficoLinha, setDadosGraficoLinha] = useState({
        horas: [],
        quantidades: []
    });

    const [metricasGerais, setMetricasGerais] = useState({
        totalHoje: 0,
        mediaDiaria: 0,
        totalSemana: 0,
        mediaSemanal: 0
    });
    const [dadosGraficoCameras, setDadosGraficoCameras] = useState({
        labels: [],
        valores: []
    });


    const fetchOcorrencias = useCallback(async (carregarMais = false) => {
        if (carregando) return;

        setCarregando(true);

        try {
            const paginaAtual = carregarMais ? pagina + 1 : 1;
            const response = await api.get('/ocorrencias', {
                params: {
                    pagina: paginaAtual,
                    limite: 10
                }
            });

            const novosDados = response.data.dados || response.data;
            const paginacao = response.data.paginacao;

            if (carregarMais) {
                setOcorrencias(prev => [...prev, ...novosDados]);
            } else {
                setOcorrencias(novosDados);
            }

            setPagina(paginaAtual);
            setTemMais(paginaAtual < (paginacao?.totalPaginas || 0));

        } catch (err) {
            console.error("Erro ao buscar ocorrências:", err);
        } finally {
            setCarregando(false);
        }
    }, [pagina, carregando]);

    const verMais = useCallback(() => {
        if (temMais && !carregando) {
            fetchOcorrencias(true);
        }
    }, [temMais, carregando, fetchOcorrencias]);


    const fetchGraficoTipos = useCallback(async () => {
        try {
            const response = await api.get('/grafico-tipos');
            setDadosGraficoTipoOcorrencia(response.data);
            return response.data;
        } catch (err) {
            console.error("Erro ao buscar dados do gráfico:", err);
            return [];
        }
    }, []);

    const fetchGraficoLinha = useCallback(async () => {
        try {
            const response = await api.get('/grafico-intervalos');
            const dadosDoBanco = response.data;

            const labels24Horas = Array.from({ length: 24 }, (_, i) => `${String(i).padStart(2, '0')}:00`);
            const valores24Horas = Array(24).fill(0);

            dadosDoBanco.forEach(item => {
                const index = labels24Horas.indexOf(item.Hora);
                if (index !== -1) {
                    valores24Horas[index] = Number(item.Quantidade);
                }
            });

            setDadosGraficoLinha({
                horas: labels24Horas,
                quantidades: valores24Horas
            });

            return { horas: labels24Horas, quantidades: valores24Horas };
        } catch (err) {
            console.error("Erro ao buscar dados do gráfico de linha:", err);
            return { horas: [], quantidades: [] };
        }
    }, []);


    const fetchMetricasGerais = useCallback(async () => {
        try {
            const response = await api.get('/metricas-gerais');
            const metricas = response.data;

            setMetricasGerais({
                totalHoje: metricas.totalHoje,
                mediaDiaria: metricas.mediaDiaria,
                totalSemana: metricas.totalSemana,
                mediaSemanal: metricas.mediaSemanal
            });

            return metricas;
        } catch (err) {
            console.error("Erro ao buscar métricas gerais:", err);
            return null;
        }
    }, []);

    const fetchGraficoCameras = useCallback(async () => {
        try {
            const response = await api.get('/grafico-cameras');
            const dadosCameras = response.data;

            const labelsCameras = dadosCameras.map(item => item.camera);
            const valoresOcorrencias = dadosCameras.map(item => Number(item.total));

            setDadosGraficoCameras({
                labels: labelsCameras,
                valores: valoresOcorrencias,
                dadosCompletos: dadosCameras
            });

            return { labels: labelsCameras, valores: valoresOcorrencias };
        } catch (err) {
            console.error("Erro ao buscar dados do gráfico de câmeras:", err);
            return { labels: [], valores: [] };
        }
    }, []);

    return (
        <AppContext.Provider
            value={{
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
            }}
        >
            {children}
        </AppContext.Provider>
    );
}

export function useApp() {
    const context = useContext(AppContext);
    if (!context) {
        throw new Error('useApp deve ser usado dentro de um AppProvider');
    }
    return context;
}