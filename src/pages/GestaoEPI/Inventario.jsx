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
        total: '17',
        disponiveis: '2',
        imagem: Capacete  // Sem chaves, pois já é a variável importada
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
        disponiveis: '12',
        imagem: Protetor_auricular
    },
    {
        nome: 'Luvas de Raspa',
        total: '53',
        disponiveis: '15',
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
                    return (
                        <>
                            <div className="blocoEpi">
                                <h3>{epi.nome}</h3>
                                <img src={epi.imagem} alt="" />
                                <p>Total: {epi.total}</p>
                                <p>Disponíveis: {epi.disponiveis}</p>
                            </div>
                        </>
                    )
                })}
                {/* <div className="blocoEpi">
                    <img src={Capacete} alt="" />
                    <h3>Capacete</h3>
                    <p>Total: 17</p>
                    <p>Disponíveis: 8</p>
                </div>
                <div className="blocoEpi">
                    <img src={Oculos} alt="" />
                    <h3>Óculos</h3>
                    <p>Total: 17</p>
                    <p>Disponíveis: 8</p>
                </div>
                <div className="blocoEpi">
                    <img src={Colete} alt="" />
                    <h3>Colete</h3>
                    <p>Total: 17</p>
                    <p>Disponíveis: 8</p>
                </div>
                <div className="blocoEpi">
                    <img src={Luvas} alt="" />
                    <h3>Luvas</h3>
                    <p>Total: 17</p>
                    <p>Disponíveis: 8</p>
                </div>
                <div className="blocoEpi">
                    <img src={Protetor_auricular} alt="" />
                    <h3>Protetor auricular</h3>
                    <p>Total: 17</p>
                    <p>Disponíveis: 8</p>
                </div>
                <div className="blocoEpi">
                    <img src={Mascara} alt="" />
                    <h3>Máscara</h3>
                    <p>Total: 17</p>
                    <p>Disponíveis: 8</p>
                </div>
                <div className="blocoEpi">
                    <img src={Botas} alt="" />
                    <h3>Botas</h3>
                    <p>Total: 17</p>
                    <p>Disponíveis: 8</p>
                </div> */}
            </section>
        </>
    )
}