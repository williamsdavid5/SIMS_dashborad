import { useState } from 'react';
import './historico.css'

export default function Historico() {

    const dadosHistorico = [
        // 24 de Fevereiro de 2026
        {
            funcionario: 'Arthur da Silva',
            equipamento: 'Capacete',
            tipo: 'Devolução',
            timestamp: '2026-02-24T07:30:00'
        },
        {
            funcionario: 'Maria Oliveira',
            equipamento: 'Óculos de Proteção',
            tipo: 'Retirada',
            timestamp: '2026-02-24T07:32:00'
        },
        {
            funcionario: 'João Santos',
            equipamento: 'Botas de Segurança',
            tipo: 'Devolução',
            timestamp: '2026-02-24T07:35:00'
        },
        {
            funcionario: 'Ana Costa',
            equipamento: 'Luvas de Raspa',
            tipo: 'Retirada',
            timestamp: '2026-02-24T07:40:00'
        },
        {
            funcionario: 'Pedro Souza',
            equipamento: 'Máscara PFF2',
            tipo: 'Retirada',
            timestamp: '2026-02-24T07:42:00'
        },
        {
            funcionario: 'Carla Mendes',
            equipamento: 'Protetor Auricular',
            tipo: 'Retirada',
            timestamp: '2026-02-24T07:45:00'
        },
        {
            funcionario: 'Lucas Ferreira',
            equipamento: 'Colete Reflexivo',
            tipo: 'Retirada',
            timestamp: '2026-02-24T07:50:00'
        },
        {
            funcionario: 'Arthur da Silva',
            equipamento: 'Capacete',
            tipo: 'Devolução',
            timestamp: '2026-02-24T12:15:00'
        },
        {
            funcionario: 'Maria Oliveira',
            equipamento: 'Óculos de Proteção',
            tipo: 'Devolução',
            timestamp: '2026-02-24T12:20:00'
        },
        {
            funcionario: 'João Santos',
            equipamento: 'Botas de Segurança',
            tipo: 'Devolução',
            timestamp: '2026-02-24T12:25:00'
        },
        {
            funcionario: 'Ana Costa',
            equipamento: 'Luvas de Raspa',
            tipo: 'Devolução',
            timestamp: '2026-02-24T12:30:00'
        },

        // 25 de Fevereiro de 2026
        {
            funcionario: 'Roberto Alves',
            equipamento: 'Capacete',
            tipo: 'Retirada',
            timestamp: '2026-02-25T08:15:00'
        },
        {
            funcionario: 'Fernanda Lima',
            equipamento: 'Máscara PFF2',
            tipo: 'Retirada',
            timestamp: '2026-02-25T08:18:00'
        },
        {
            funcionario: 'Carlos Eduardo',
            equipamento: 'Protetor Auricular',
            tipo: 'Retirada',
            timestamp: '2026-02-25T08:20:00'
        },
        {
            funcionario: 'Juliana Rocha',
            equipamento: 'Luvas de Raspa',
            tipo: 'Retirada',
            timestamp: '2026-02-25T08:25:00'
        },
        {
            funcionario: 'Marcos Paulo',
            equipamento: 'Colete Reflexivo',
            tipo: 'Retirada',
            timestamp: '2026-02-25T08:30:00'
        },
        {
            funcionario: 'Roberto Alves',
            equipamento: 'Capacete',
            tipo: 'Devolução',
            timestamp: '2026-02-25T11:45:00'
        },
        {
            funcionario: 'Fernanda Lima',
            equipamento: 'Máscara PFF2',
            tipo: 'Devolução',
            timestamp: '2026-02-25T11:50:00'
        },
        {
            funcionario: 'Carlos Eduardo',
            equipamento: 'Protetor Auricular',
            tipo: 'Devolução',
            timestamp: '2026-02-25T11:55:00'
        },

        // 26 de Fevereiro de 2026
        {
            funcionario: 'Patrícia Gomes',
            equipamento: 'Botas de Segurança',
            tipo: 'Retirada',
            timestamp: '2026-02-26T09:10:00'
        },
        {
            funcionario: 'Anderson Silva',
            equipamento: 'Óculos de Proteção',
            tipo: 'Retirada',
            timestamp: '2026-02-26T09:12:00'
        },
        {
            funcionario: 'Beatriz Santos',
            equipamento: 'Colete Reflexivo',
            tipo: 'Retirada',
            timestamp: '2026-02-26T09:15:00'
        },
        {
            funcionario: 'Ricardo Oliveira',
            equipamento: 'Máscara PFF2',
            tipo: 'Retirada',
            timestamp: '2026-02-26T09:20:00'
        },
        {
            funcionario: 'Patrícia Gomes',
            equipamento: 'Botas de Segurança',
            tipo: 'Devolução',
            timestamp: '2026-02-26T14:30:00'
        },
        {
            funcionario: 'Anderson Silva',
            equipamento: 'Óculos de Proteção',
            tipo: 'Devolução',
            timestamp: '2026-02-26T14:35:00'
        },
        {
            funcionario: 'Beatriz Santos',
            equipamento: 'Colete Reflexivo',
            tipo: 'Devolução',
            timestamp: '2026-02-26T14:40:00'
        },
        {
            funcionario: 'Ricardo Oliveira',
            equipamento: 'Máscara PFF2',
            tipo: 'Devolução',
            timestamp: '2026-02-26T14:45:00'
        },

        // 27 de Fevereiro de 2026
        {
            funcionario: 'Thiago Martins',
            equipamento: 'Capacete',
            tipo: 'Retirada',
            timestamp: '2026-02-27T07:55:00'
        },
        {
            funcionario: 'Camila Fernandes',
            equipamento: 'Luvas de Raspa',
            tipo: 'Retirada',
            timestamp: '2026-02-27T08:00:00'
        },
        {
            funcionario: 'Gustavo Henrique',
            equipamento: 'Protetor Auricular',
            tipo: 'Retirada',
            timestamp: '2026-02-27T08:05:00'
        },
        {
            funcionario: 'Larissa Medeiros',
            equipamento: 'Botas de Segurança',
            tipo: 'Retirada',
            timestamp: '2026-02-27T08:10:00'
        },
        {
            funcionario: 'Thiago Martins',
            equipamento: 'Capacete',
            tipo: 'Devolução',
            timestamp: '2026-02-27T12:40:00'
        },
        {
            funcionario: 'Camila Fernandes',
            equipamento: 'Luvas de Raspa',
            tipo: 'Devolução',
            timestamp: '2026-02-27T12:45:00'
        },
        {
            funcionario: 'Gustavo Henrique',
            equipamento: 'Protetor Auricular',
            tipo: 'Devolução',
            timestamp: '2026-02-27T12:50:00'
        },
        {
            funcionario: 'Larissa Medeiros',
            equipamento: 'Botas de Segurança',
            tipo: 'Devolução',
            timestamp: '2026-02-27T12:55:00'
        },

        // 28 de Fevereiro de 2026
        {
            funcionario: 'Eduardo Costa',
            equipamento: 'Óculos de Proteção',
            tipo: 'Retirada',
            timestamp: '2026-02-28T08:30:00'
        },
        {
            funcionario: 'Vanessa Rodrigues',
            equipamento: 'Máscara PFF2',
            tipo: 'Retirada',
            timestamp: '2026-02-28T08:32:00'
        },
        {
            funcionario: 'Fábio Araújo',
            equipamento: 'Colete Reflexivo',
            tipo: 'Retirada',
            timestamp: '2026-02-28T08:35:00'
        },
        {
            funcionario: 'Eduardo Costa',
            equipamento: 'Óculos de Proteção',
            tipo: 'Devolução',
            timestamp: '2026-02-28T13:10:00'
        },
        {
            funcionario: 'Vanessa Rodrigues',
            equipamento: 'Máscara PFF2',
            tipo: 'Devolução',
            timestamp: '2026-02-28T13:15:00'
        },
        {
            funcionario: 'Fábio Araújo',
            equipamento: 'Colete Reflexivo',
            tipo: 'Devolução',
            timestamp: '2026-02-28T13:20:00'
        },

        // 1 de Março de 2026
        {
            funcionario: 'Arthur da Silva',
            equipamento: 'Luvas de Raspa',
            tipo: 'Retirada',
            timestamp: '2026-03-01T07:45:00'
        },
        {
            funcionario: 'Maria Oliveira',
            equipamento: 'Capacete',
            tipo: 'Retirada',
            timestamp: '2026-03-01T07:48:00'
        },
        {
            funcionario: 'João Santos',
            equipamento: 'Protetor Auricular',
            tipo: 'Retirada',
            timestamp: '2026-03-01T07:50:00'
        },
        {
            funcionario: 'Ana Costa',
            equipamento: 'Botas de Segurança',
            tipo: 'Retirada',
            timestamp: '2026-03-01T07:52:00'
        },
        {
            funcionario: 'Arthur da Silva',
            equipamento: 'Luvas de Raspa',
            tipo: 'Devolução',
            timestamp: '2026-03-01T12:05:00'
        },
        {
            funcionario: 'Maria Oliveira',
            equipamento: 'Capacete',
            tipo: 'Devolução',
            timestamp: '2026-03-01T12:10:00'
        },
        {
            funcionario: 'João Santos',
            equipamento: 'Protetor Auricular',
            tipo: 'Devolução',
            timestamp: '2026-03-01T12:15:00'
        },
        {
            funcionario: 'Ana Costa',
            equipamento: 'Botas de Segurança',
            tipo: 'Devolução',
            timestamp: '2026-03-01T12:20:00'
        }
    ];

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

    const formatarData = (dataISO) => {
        const data = new Date(dataISO);
        return data.toLocaleString("pt-BR");
    };

    return (
        <>
            <section className='HistoricoJanelaPrincipal'>
                <p><b>Histórico de retirada e devolução de equipamentos</b></p>
                <span className='auxiliarInputPesquisaHistorico'>
                    <input className='inputPesquisaHistorico' type="text" name="" id="" placeholder='Pesquise qualquer coisa (nomes, datas, equipamento...)' />
                    <button>Pesquisar</button>
                </span>
                <p><b>Período</b><br />
                    Deixe vazio para percorrer todo o histórico, preencha os dois campos para adicionar a filtragem.
                </p>
                <span className='auxiliarFiltroHistorico'>
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
                    <button>Aplicar</button>
                </span>
                <section className='janelaListaHistorico'>
                    <table border={1} className='tabelaUltimasOcorrencias tableHistorico'>
                        <thead>
                            <tr>
                                <th>Funcionário</th>
                                <th>Equipamento</th>
                                <th>Tipo</th>
                                <th>Horário</th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                dadosHistorico.map((dado, i) => {
                                    return (
                                        <tr key={i}>
                                            <td>{dado.funcionario}</td>
                                            <td><b>{dado.equipamento}</b></td>
                                            <td>
                                                <p
                                                    className={`tipoDadoLista ${dado.tipo == 'Devolução' ? 'devolucao' : 'retirada'}`}
                                                >{dado.tipo}</p>
                                            </td>
                                            <td>{formatarData(dado.timestamp)}</td>
                                        </tr>
                                    )
                                })
                            }
                        </tbody>
                    </table>
                </section>
            </section>
        </>
    )
}