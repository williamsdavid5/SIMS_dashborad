import MenuLateral from "./MenuLateral"
import { useState } from 'react';
import './styles/relatorios.css'

export default function EmissaoRelatorios() {

    const [dataFiltroInicio, setDataFiltroInicio] = useState("");
    const [dataFiltroFim, setDataFiltroFim] = useState("");

    function handleChange(e, setE) {
        let input = e.target.value.replace(/\D/g, "");
        if (input.length > 8) input = input.slice(0, 8);

        if (input.length > 4) {
            input = input.replace(/(\d{2})(\d{2})(\d{1,4})/, "$1/$2/$3");
        } else if (input.length > 2) {
            input = input.replace(/(\d{2})(\d{1,2})/, "$1/$2");
        }

        setE(input);
    };

    const dadosRelatorios = [
        // Relatórios Diários
        {
            id: 1,
            tipo: "Relatório Executivo Diário",
            timestamp: "2026-03-09T08:30:00",
            periodo: "08/03/2026",
            formato: "PDF"
        },
        {
            id: 2,
            tipo: "Relatório Executivo Diário",
            timestamp: "2026-03-08T08:30:00",
            periodo: "07/03/2026",
            formato: "PDF"
        },
        {
            id: 3,
            tipo: "Relatório Executivo Diário",
            timestamp: "2026-03-07T08:30:00",
            periodo: "06/03/2026",
            formato: "PDF"
        },

        // Análise de Não Conformidades
        {
            id: 4,
            tipo: "Análise de Não Conformidades",
            timestamp: "2026-03-09T10:15:00",
            periodo: "01/03/2026 - 07/03/2026",
            formato: "Excel"
        },
        {
            id: 5,
            tipo: "Análise de Não Conformidades",
            timestamp: "2026-03-02T10:15:00",
            periodo: "23/02/2026 - 01/03/2026",
            formato: "Excel"
        },
        {
            id: 6,
            tipo: "Análise de Não Conformidades",
            timestamp: "2026-02-23T10:15:00",
            periodo: "16/02/2026 - 22/02/2026",
            formato: "CSV"
        },

        // Relatório por Área/Setor
        {
            id: 7,
            tipo: "Relatório por Área/Setor",
            timestamp: "2026-03-09T14:30:00",
            periodo: "Produção - Março/2026",
            formato: "PDF"
        },
        {
            id: 8,
            tipo: "Relatório por Área/Setor",
            timestamp: "2026-03-09T14:45:00",
            periodo: "Logística - Março/2026",
            formato: "PDF"
        },
        {
            id: 9,
            tipo: "Relatório por Área/Setor",
            timestamp: "2026-03-09T15:00:00",
            periodo: "Manutenção - Março/2026",
            formato: "Excel"
        },
        {
            id: 10,
            tipo: "Relatório por Área/Setor",
            timestamp: "2026-03-02T14:30:00",
            periodo: "Produção - Fevereiro/2026",
            formato: "PDF"
        },
        {
            id: 11,
            tipo: "Relatório por Área/Setor",
            timestamp: "2026-03-02T14:45:00",
            periodo: "Logística - Fevereiro/2026",
            formato: "CSV"
        },

        // Análise de Tendências
        {
            id: 12,
            tipo: "Análise de Tendências",
            timestamp: "2026-03-09T16:20:00",
            periodo: "1º Trimestre 2026",
            formato: "PDF"
        },
        {
            id: 13,
            tipo: "Análise de Tendências",
            timestamp: "2026-02-09T16:20:00",
            periodo: "Janeiro 2026",
            formato: "Excel"
        },
        {
            id: 14,
            tipo: "Análise de Tendências",
            timestamp: "2026-01-09T16:20:00",
            periodo: "Dezembro 2025",
            formato: "CSV"
        },

        // Relatório de Performance por EPI
        {
            id: 15,
            tipo: "Relatório de Performance por EPI",
            timestamp: "2026-03-09T11:10:00",
            periodo: "Fevereiro/2026",
            formato: "Excel"
        },
        {
            id: 16,
            tipo: "Relatório de Performance por EPI",
            timestamp: "2026-02-09T11:10:00",
            periodo: "Janeiro/2026",
            formato: "PDF"
        },
        {
            id: 17,
            tipo: "Relatório de Performance por EPI",
            timestamp: "2026-01-09T11:10:00",
            periodo: "Dezembro/2025",
            formato: "CSV"
        },
        {
            id: 18,
            tipo: "Relatório de Performance por EPI",
            timestamp: "2025-12-09T11:10:00",
            periodo: "Novembro/2025",
            formato: "Excel"
        },

        // Resumo de Alertas Críticos
        {
            id: 19,
            tipo: "Resumo de Alertas Críticos",
            timestamp: "2026-03-09T09:45:00",
            periodo: "Últimas 24h",
            formato: "PDF"
        },
        {
            id: 20,
            tipo: "Resumo de Alertas Críticos",
            timestamp: "2026-03-08T09:45:00",
            periodo: "07/03/2026",
            formato: "PDF"
        },
        {
            id: 21,
            tipo: "Resumo de Alertas Críticos",
            timestamp: "2026-03-07T09:45:00",
            periodo: "06/03/2026",
            formato: "CSV"
        },
        {
            id: 22,
            tipo: "Resumo de Alertas Críticos",
            timestamp: "2026-03-06T09:45:00",
            periodo: "05/03/2026",
            formato: "Excel"
        },

        // Relatório para Auditoria
        {
            id: 23,
            tipo: "Relatório para Auditoria",
            timestamp: "2026-03-09T13:20:00",
            periodo: "Fevereiro/2026",
            formato: "PDF"
        },
        {
            id: 24,
            tipo: "Relatório para Auditoria",
            timestamp: "2026-02-01T13:20:00",
            periodo: "Janeiro/2026",
            formato: "PDF"
        },
        {
            id: 25,
            tipo: "Relatório para Auditoria",
            timestamp: "2026-01-02T13:20:00",
            periodo: "Dezembro/2025",
            formato: "Excel"
        },
        {
            id: 26,
            tipo: "Relatório para Auditoria",
            timestamp: "2025-12-01T13:20:00",
            periodo: "Novembro/2025",
            formato: "CSV"
        },
        {
            id: 27,
            tipo: "Relatório para Auditoria",
            timestamp: "2025-11-03T13:20:00",
            periodo: "Outubro/2025",
            formato: "PDF"
        },

        // Dashboard para Diretoria
        {
            id: 28,
            tipo: "Dashboard para Diretoria",
            timestamp: "2026-03-09T07:00:00",
            periodo: "08/03/2026",
            formato: "PDF"
        },
        {
            id: 29,
            tipo: "Dashboard para Diretoria",
            timestamp: "2026-03-08T07:00:00",
            periodo: "07/03/2026",
            formato: "PDF"
        },
        {
            id: 30,
            tipo: "Dashboard para Diretoria",
            timestamp: "2026-03-07T07:00:00",
            periodo: "06/03/2026",
            formato: "Excel"
        },
        {
            id: 31,
            tipo: "Dashboard para Diretoria",
            timestamp: "2026-03-01T07:00:00",
            periodo: "Fevereiro/2026",
            formato: "PDF"
        },
        {
            id: 32,
            tipo: "Dashboard para Diretoria",
            timestamp: "2026-02-01T07:00:00",
            periodo: "Janeiro/2026",
            formato: "CSV"
        }
    ];

    const formatarData = (dataISO) => {
        const data = new Date(dataISO);
        return data.toLocaleString("pt-BR");
    };

    return (
        <>
            <main className="dashboardMain relatoriosMain">
                <MenuLateral></MenuLateral>
                <section className="principalDash principalRelatorios">
                    <div className="janelaRelatório">
                        <h1>Emissão de relatórios</h1>
                        <p>Aqui você pode gerar relatórios personalizados que auxiliam na tomada de decisão, no acompanhamento de conformidades e na identificação de tendências de segurança. Os relatórios disponíveis permitem desde análises executivas rápidas até detalhamentos específicos por setor, garantindo que gestores e equipes tenham acesso às informações necessárias para fortalecer a cultura de segurança e reduzir riscos operacionais.</p>
                        <hr />
                        <p>Tipo</p>
                        <select>
                            <option value="relatorio-executivo-diario">Relatório Executivo Diário</option>
                            <option value="analise-nao-conformidades">Análise de Não Conformidades</option>
                            <option value="relatorio-area-setor">Relatório por Área/Setor</option>
                            <option value="analise-tendencias">Análise de Tendências</option>
                            <option value="relatorio-performance-epi">Relatório de Performance por EPI</option>
                            <option value="resumo-alertas-criticos">Resumo de Alertas Críticos</option>
                            <option value="relatorio-auditoria">Relatório para Auditoria</option>
                            <option value="dashboard-diretoria">Dashboard para Diretoria</option>
                        </select>
                        Período
                        <span className='auxiliarFiltroHistorico auxiliarPeriodoRelatorio'>
                            <input
                                type="text"
                                name=""
                                id=""
                                placeholder='DD/MM/AAAA'
                                value={dataFiltroInicio}
                                onChange={(e) => handleChange(e, setDataFiltroInicio)}
                            />
                            <p>a</p>
                            <input
                                type="text"
                                name=""
                                id=""
                                placeholder='DD/MM/AAAA'
                                value={dataFiltroFim}
                                onChange={(e) => handleChange(e, setDataFiltroFim)}
                            />
                            <p>ou</p>
                            <select name="" id="">
                                <option value="">Hoje</option>
                                <option value="">Últimos 7 dias</option>
                                <option value="">Últimos 30 dias</option>
                                <option value="">Últimos 60 dias</option>
                                <option value="">Últimos 90 dias</option>
                            </select>
                        </span>
                        <p>Formato</p>
                        <select name="" id="">
                            <option value="">PDF</option>
                            <option value="">Excel</option>
                            <option value="">CSV</option>
                        </select>
                        <span className="auxiliarFiltroHistorico auxiliarPeriodoRelatorio">
                            <label htmlFor="">
                                <input type="checkbox" name="" id="" />
                                Incluir gráficos
                            </label>
                            <label htmlFor="">
                                <input type="checkbox" name="" id="" />
                                Incluir recomendações
                            </label>
                        </span>
                        <button>
                            Gerar
                        </button>
                    </div>
                    <div className="janelaHistoricoRelatorio">
                        <h2>Última emissões</h2>
                        <div className="divAuxiliarTabela">
                            <table border={1} className='tabelaHistoricoRelatorio '>
                                <thead>
                                    <tr>
                                        <th>Tipo de Relatório</th>
                                        <th>Data de Emissão</th>
                                        <th>Período</th>
                                        <th>Formato</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {
                                        dadosRelatorios.map((relatorio) => {
                                            return (
                                                <tr key={relatorio.id}>
                                                    <td>
                                                        <b>{relatorio.tipo}</b>
                                                    </td>
                                                    <td>{new Date(relatorio.timestamp).toLocaleString("pt-BR")}</td>
                                                    <td>{relatorio.periodo}</td>
                                                    <td>
                                                        <span className={`formatoRelatorio ${relatorio.formato.toLowerCase()}`}>
                                                            {relatorio.formato}
                                                        </span>
                                                    </td>
                                                </tr>
                                            )
                                        })
                                    }
                                </tbody>
                            </table>
                        </div>
                    </div>
                </section>
            </main>
        </>
    )
}