import './inventario.css'
import Capacete from '../../assets/epis/capacete.jpg'
import Oculos from '../../assets/epis/oculos.jpeg'
import Colete from '../../assets/epis/colete.png'
import Protetor_auricular from '../../assets/epis/protetor_auricular.jpg'
import Luvas from '../../assets/epis/luvas.jpg'
import Mascara from '../../assets/epis/mascara.jpg'
import Botas from '../../assets/epis/botas.jpeg'

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

export default function Inventario() {
    return (
        <>
            <section className="episBlocos">
                {epi_lista.map((epi) => {
                    const disponivel = parseInt(epi.disponiveis, 10) > 0;

                    return (
                        <>
                            <div className="blocoEpi">
                                <div className={`auxiliarImagem`}>
                                    <img src={epi.imagem} alt="" className={`${disponivel ? '' : 'indisponivelImg'}`} />
                                </div>
                                <div className='auxiliarTexto'>
                                    <h3>{epi.nome}</h3>
                                    <p>Total: {epi.total}</p>
                                    <p>Disponíveis: {epi.disponiveis}</p>
                                    <p className={`cardDisponibilidade ${disponivel ? 'disponivel' : 'indisponivel'}`}>
                                        {disponivel ?
                                            <span>Disponível</span> : <span>Indisponível</span>
                                        }
                                    </p>
                                </div>
                            </div>
                        </>
                    )
                })}
            </section>
        </>
    )
}