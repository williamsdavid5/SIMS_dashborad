import './inventario.css'
import Capacete from '../../assets/epis/capacete.jpg'
import Oculos from '../../assets/epis/oculos.jpeg'
import Colete from '../../assets/epis/colete.png'
import Protetor_auricular from '../../assets/epis/protetor_auricular.jpg'
import Luvas from '../../assets/epis/luvas.jpg'
import Mascara from '../../assets/epis/mascara.jpg'
import Botas from '../../assets/epis/botas.jpeg'
import { useState } from 'react'

function ModalEmprestimo({ epi, setModalAberto }) {
    const disponivel = epi.disponiveis > 0;

    return (
        <>
            <div className='modalBackground'>
                <main className='janelaModal modalEmprestimo'>
                    <div className='auxiliarModal'>
                        <h2>Retirada de Equipamento</h2>
                        <h1 className='tituloEPI'>{epi.nome.toUpperCase()}
                            <span className={`cardDisponibilidade ${disponivel ? 'disponivel' : 'indisponivel'}`}>
                                {disponivel ?
                                    <span>Disponível</span> : <span>Indisponível</span>
                                }
                            </span>
                        </h1>
                        <p>Disponíveis: {epi.disponiveis}</p>
                        <p><b>Nome completo</b></p>
                        <input type="text" name="" id="" disabled={!disponivel} />
                        <p><b>ID de funcionário</b></p>
                        <input type="text" disabled={!disponivel} />
                        <span className='spanHorizontal'>
                            <p><b>Variante</b></p>
                            <select name="" id="" disabled={!disponivel}>
                                <option value="">Tamanho 1</option>
                                <option value="">Tamanho 2</option>
                                <option value="">Tamanho 3</option>
                                <option value="">Tamanho 4</option>
                                <option value="" disabled>Tamanho 5</option>
                                <option value="">Tamanho 6</option>
                                <option value="">Tamanho 7</option>
                                <option value="">Tamanho 8</option>
                            </select>
                            <p><b>Área</b></p>
                            <select name="" id="" disabled={!disponivel}>
                                <option value="Lavra a Céu Aberto">Lavra a Céu Aberto</option>
                                <option value="Beneficiamento de Minério">Beneficiamento de Minério</option>
                                <option value="Operação de Equipamentos">Operação de Equipamentos</option>
                                <option value="Manutenção Mecânica">Manutenção Mecânica</option>
                                <option value="Transporte e Logística">Transporte e Logística</option>
                                <option value="Geologia e Pesquisa">Geologia e Pesquisa</option>
                                <option value="Administração de Mina">Administração de Mina</option>
                                <option value="Segurança do Trabalho">Segurança do Trabalho</option>
                            </select>
                        </span>
                        <div className='auxBotaoHorizontal'>
                            <button
                                onClick={() => setModalAberto(false)}
                                disabled={!disponivel}
                            >Retirar</button>
                            <button
                                onClick={() => setModalAberto(false)}
                            >Fechar</button>
                        </div>
                    </div>
                </main>
            </div>
        </>
    )
}

export default function Inventario() {
    const [modalAberto, setModalAberto] = useState(false);
    const [epiSelecionado, setEpiSelecionado] = useState([]);
    const epi_lista = [
        {
            nome: 'Capacete',
            total: '28',
            disponiveis: '0',
            imagem: Capacete,
        },
        {
            nome: 'Óculos de Proteção',
            total: '32',
            disponiveis: '8',
            imagem: Oculos
        },
        {
            nome: 'Colete Reflexivo',
            total: '25',
            disponiveis: '5',
            imagem: Colete
        },
        {
            nome: 'Protetor Auricular',
            total: '41',
            disponiveis: '0',
            imagem: Protetor_auricular
        },
        {
            nome: 'Luvas de Raspa',
            total: '53',
            disponiveis: '0',
            imagem: Luvas
        },
        {
            nome: 'Máscara PFF2',
            total: '28',
            disponiveis: '7',
            imagem: Mascara
        },
        {
            nome: 'Botas de Segurança',
            total: '36',
            disponiveis: '9',
            imagem: Botas
        }
    ]

    return (
        <>
            <section className="episBlocos">
                {epi_lista.map((epi) => {
                    const disponivel = parseInt(epi.disponiveis, 10) > 0;

                    return (
                        <>
                            <div
                                className="blocoEpi"
                                onClick={() => {
                                    setEpiSelecionado(epi);
                                    setModalAberto(true);
                                }}
                            >
                                <div className={`auxiliarImagem`}>
                                    <img src={epi.imagem} alt="" className={`${disponivel ? '' : 'indisponivelImg'}`} />
                                </div>
                                <div className='auxiliarTexto'>
                                    <h3>{epi.nome.toUpperCase()}</h3>
                                    <div className='divisaoInterna'>
                                        <div className='esquerda'>
                                            <p>Total: {epi.total}</p>
                                            <p>Disponíveis: {epi.disponiveis}</p>
                                        </div>
                                        <div className='direita'>
                                            <p className={`cardDisponibilidade ${disponivel ? 'disponivel' : 'indisponivel'}`}>
                                                {disponivel ?
                                                    <span>Disponível</span> : <span>Indisponível</span>
                                                }
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </>
                    )
                })}
            </section>
            {modalAberto &&
                <ModalEmprestimo
                    epi={epiSelecionado}
                    setModalAberto={setModalAberto}
                />
            }
        </>
    )
}