import './estoque.css'

export default function Estoque() {
    const dadosEstoque = [
        // Capacete
        {
            epi: 'Capacete',
            areaAtual: 'Lavra a Céu Aberto',
            variacao: 'M',
            ultimoUsuario: 'João Santos',
            dataUltimoUsuario: '2026-03-04T14:30:00',
            estado: 'normal'
        },
        {
            epi: 'Capacete',
            areaAtual: 'Lavra a Céu Aberto',
            variacao: 'G',
            ultimoUsuario: 'Arthur da Silva',
            dataUltimoUsuario: '2026-03-04T10:15:00',
            estado: 'normal'
        },
        {
            epi: 'Capacete',
            areaAtual: 'Beneficiamento de Minério',
            variacao: 'M',
            ultimoUsuario: 'Maria Oliveira',
            dataUltimoUsuario: '2026-03-03T16:45:00',
            estado: 'danificado'
        },
        {
            epi: 'Capacete',
            areaAtual: 'Operação de Equipamentos',
            variacao: 'GG',
            ultimoUsuario: 'Pedro Souza',
            dataUltimoUsuario: '2026-03-03T09:20:00',
            estado: 'normal'
        },
        {
            epi: 'Capacete',
            areaAtual: 'Manutenção Mecânica',
            variacao: 'P',
            ultimoUsuario: 'Carlos Eduardo',
            dataUltimoUsuario: '2026-03-02T13:10:00',
            estado: 'alerta'
        },

        // Óculos de Proteção
        {
            epi: 'Óculos de Proteção',
            areaAtual: 'Geologia e Pesquisa',
            variacao: 'Único',
            ultimoUsuario: 'Fernanda Lima',
            dataUltimoUsuario: '2026-03-04T11:30:00',
            estado: 'normal'
        },
        {
            epi: 'Óculos de Proteção',
            areaAtual: 'Lavra a Céu Aberto',
            variacao: 'Único',
            ultimoUsuario: 'Roberto Alves',
            dataUltimoUsuario: '2026-03-04T08:50:00',
            estado: 'normal'
        },
        {
            epi: 'Óculos de Proteção',
            areaAtual: 'Transporte e Logística',
            variacao: 'Único',
            ultimoUsuario: 'Anderson Silva',
            dataUltimoUsuario: '2026-03-03T15:20:00',
            estado: 'danificado'
        },
        {
            epi: 'Óculos de Proteção',
            areaAtual: 'Administração de Mina',
            variacao: 'Único',
            ultimoUsuario: 'Vanessa Rodrigues',
            dataUltimoUsuario: '2026-03-02T10:05:00',
            estado: 'normal'
        },

        // Colete Reflexivo
        {
            epi: 'Colete Reflexivo',
            areaAtual: 'Segurança do Trabalho',
            variacao: 'M',
            ultimoUsuario: 'Larissa Medeiros',
            dataUltimoUsuario: '2026-03-04T09:40:00',
            estado: 'normal'
        },
        {
            epi: 'Colete Reflexivo',
            areaAtual: 'Operação de Equipamentos',
            variacao: 'G',
            ultimoUsuario: 'Marcos Paulo',
            dataUltimoUsuario: '2026-03-03T14:15:00',
            estado: 'alerta'
        },
        {
            epi: 'Colete Reflexivo',
            areaAtual: 'Lavra a Céu Aberto',
            variacao: 'M',
            ultimoUsuario: 'Lucas Ferreira',
            dataUltimoUsuario: '2026-03-03T07:55:00',
            estado: 'normal'
        },
        {
            epi: 'Colete Reflexivo',
            areaAtual: 'Beneficiamento de Minério',
            variacao: 'GG',
            ultimoUsuario: 'Ana Costa',
            dataUltimoUsuario: '2026-03-02T16:30:00',
            estado: 'danificado'
        },

        // Protetor Auricular
        {
            epi: 'Protetor Auricular',
            areaAtual: 'Manutenção Mecânica',
            variacao: 'Único',
            ultimoUsuario: 'Gustavo Henrique',
            dataUltimoUsuario: '2026-03-04T13:20:00',
            estado: 'normal'
        },
        {
            epi: 'Protetor Auricular',
            areaAtual: 'Beneficiamento de Minério',
            variacao: 'Único',
            ultimoUsuario: 'Juliana Rocha',
            dataUltimoUsuario: '2026-03-04T08:30:00',
            estado: 'normal'
        },
        {
            epi: 'Protetor Auricular',
            areaAtual: 'Lavra a Céu Aberto',
            variacao: 'Único',
            ultimoUsuario: 'Thiago Martins',
            dataUltimoUsuario: '2026-03-03T11:45:00',
            estado: 'alerta'
        },
        {
            epi: 'Protetor Auricular',
            areaAtual: 'Transporte e Logística',
            variacao: 'Único',
            ultimoUsuario: 'Fábio Araújo',
            dataUltimoUsuario: '2026-03-02T14:10:00',
            estado: 'danificado'
        },

        // Luvas de Raspa
        {
            epi: 'Luvas de Raspa',
            areaAtual: 'Lavra a Céu Aberto',
            variacao: 'P',
            ultimoUsuario: 'Arthur da Silva',
            dataUltimoUsuario: '2026-03-04T15:40:00',
            estado: 'normal'
        },
        {
            epi: 'Luvas de Raspa',
            areaAtual: 'Operação de Equipamentos',
            variacao: 'M',
            ultimoUsuario: 'Patrícia Gomes',
            dataUltimoUsuario: '2026-03-04T09:15:00',
            estado: 'normal'
        },
        {
            epi: 'Luvas de Raspa',
            areaAtual: 'Manutenção Mecânica',
            variacao: 'G',
            ultimoUsuario: 'Camila Fernandes',
            dataUltimoUsuario: '2026-03-03T17:00:00',
            estado: 'danificado'
        },
        {
            epi: 'Luvas de Raspa',
            areaAtual: 'Beneficiamento de Minério',
            variacao: 'M',
            ultimoUsuario: 'Ricardo Oliveira',
            dataUltimoUsuario: '2026-03-02T11:20:00',
            estado: 'alerta'
        },

        // Máscara PFF2
        {
            epi: 'Máscara PFF2',
            areaAtual: 'Geologia e Pesquisa',
            variacao: 'P',
            ultimoUsuario: 'Eduardo Costa',
            dataUltimoUsuario: '2026-03-04T10:50:00',
            estado: 'normal'
        },
        {
            epi: 'Máscara PFF2',
            areaAtual: 'Administração de Mina',
            variacao: 'M',
            ultimoUsuario: 'Carla Mendes',
            dataUltimoUsuario: '2026-03-03T15:30:00',
            estado: 'normal'
        },
        {
            epi: 'Máscara PFF2',
            areaAtual: 'Segurança do Trabalho',
            variacao: 'P',
            ultimoUsuario: 'Beatriz Santos',
            dataUltimoUsuario: '2026-03-03T08:40:00',
            estado: 'danificado'
        },
        {
            epi: 'Máscara PFF2',
            areaAtual: 'Lavra a Céu Aberto',
            variacao: 'G',
            ultimoUsuario: 'Pedro Souza',
            dataUltimoUsuario: '2026-03-02T13:55:00',
            estado: 'alerta'
        },

        // Botas de Segurança
        {
            epi: 'Botas de Segurança',
            areaAtual: 'Lavra a Céu Aberto',
            variacao: '38',
            ultimoUsuario: 'João Santos',
            dataUltimoUsuario: '2026-03-04T12:10:00',
            estado: 'normal'
        },
        {
            epi: 'Botas de Segurança',
            areaAtual: 'Beneficiamento de Minério',
            variacao: '40',
            ultimoUsuario: 'Maria Oliveira',
            dataUltimoUsuario: '2026-03-04T07:45:00',
            estado: 'normal'
        },
        {
            epi: 'Botas de Segurança',
            areaAtual: 'Transporte e Logística',
            variacao: '42',
            ultimoUsuario: 'Anderson Silva',
            dataUltimoUsuario: '2026-03-03T10:30:00',
            estado: 'danificado'
        },
        {
            epi: 'Botas de Segurança',
            areaAtual: 'Operação de Equipamentos',
            variacao: '39',
            ultimoUsuario: 'Marcos Paulo',
            dataUltimoUsuario: '2026-03-03T08:15:00',
            estado: 'normal'
        },
        {
            epi: 'Botas de Segurança',
            areaAtual: 'Manutenção Mecânica',
            variacao: '41',
            ultimoUsuario: 'Carlos Eduardo',
            dataUltimoUsuario: '2026-03-02T09:50:00',
            estado: 'alerta'
        }
    ];

    const formatarData = (dataISO) => {
        const data = new Date(dataISO);
        return data.toLocaleString("pt-BR");
    };

    return (
        <>
            <section className="mainEstoque">
                <h2>Estoque</h2>
                <p>Todos os EPIs cadastrados no sistema, e suas informações relevantes.</p>
                <span className='auxiliarInputPesquisaHistorico'>
                    <input className='inputPesquisaHistorico' type="text" name="" id="" placeholder='Pesquise qualquer coisa (nomes, datas, equipamento, área...)' />
                    <button>Pesquisar</button>
                </span>
                <div className='janelaListaHistorico janelaEstoque'>
                    <table className='tabelaEstoque'>
                        <thead>
                            <tr>
                                <th>Equipamento</th>
                                <th>Variação</th>
                                <th>Estado</th>
                                <th>Área atual</th>
                                <th>Último usuário</th>
                                <th>Data último uso</th>
                            </tr>
                        </thead>
                        <tbody>
                            {dadosEstoque.map((epi, i) => {
                                return (
                                    <tr key={i}>
                                        <td>{epi.epi}</td>
                                        <td>{epi.variacao}</td>
                                        <td>
                                            <p className={`estadoEPI ${epi.estado == 'normal' ? 'normal' : epi.estado == 'alerta' ? 'alerta' : 'danificado'}`}>
                                                {epi.estado == 'normal' ? 'normal' : epi.estado == 'alerta' ? 'usado muitas vezes!' : 'danificado'}
                                            </p>
                                        </td>
                                        <td>{epi.areaAtual}</td>
                                        <td>{epi.ultimoUsuario}</td>
                                        <td>{formatarData(epi.dataUltimoUsuario)}</td>
                                    </tr>
                                )
                            })}
                        </tbody>
                    </table>

                </div>
            </section>
        </>
    )
}