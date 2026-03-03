import './inventario.css'
import Capacete from '../../assets/epis/capacete.jpg'
import Oculos from '../../assets/epis/oculos.jpeg'
import Colete from '../../assets/epis/colete.png'
import Protetor_auricular from '../../assets/epis/protetor_auricular.jpg'
import Luvas from '../../assets/epis/luvas.jpg'
import Mascara from '../../assets/epis/mascara.jpg'
import Botas from '../../assets/epis/botas.jpeg'

export default function Inventario() {
    return (
        <>
            <section className="episBlocos">
                <div className="blocoEpi">
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
                </div>
            </section>
        </>
    )
}