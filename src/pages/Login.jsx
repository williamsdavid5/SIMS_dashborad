import './styles/login.css'
import LogoCompletaAzul from '../assets/SIMS_logo_branca.png'
import ViicLogo from '../assets/viic_logo_branca.png'
import SIMSOlho from '../assets/SIMS_olho.png'
import SIMSazul from '../assets/SIMS_logo_azul.png'
import EPIback from '../assets/background_epi_image.jpg'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

export default function Login() {

    const navigate = useNavigate();

    const [usuario, setUsuario] = useState('');
    const [senha, setSenha] = useState('');

    function login() {
        if (usuario == 'user' && senha == '12345') {
            navigate('/dashboard');
        } else {
            alert('dados incorretos!!!!!');
        }
    }

    return (
        <>
            <main className="backgroundLogin">
                <div className="janelaLogin">
                    <div className='logoAux'>
                        <img src={SIMSazul} alt="" className='logoCompleta' />
                        <img src={SIMSOlho} alt="" className='logoOlho' />
                    </div>
                    <h1>Login</h1>
                    <p>Usuário</p>
                    <input type="text" name="" id=""
                        onChange={(e) => setUsuario(e.target.value)}
                    />
                    <p>Senha</p>
                    <input type="password" name="" id=""
                        onChange={(e) => setSenha(e.target.value)}
                    />
                    <button className='botaoLogin'
                        onClick={() => login()}
                    >Entrar</button>
                    <p>Atenção: É importante que você evite fornecer esses dados para terceiros.</p>
                </div>
                <div className='gradienteLogin'>
                    <div className='divApresentação'>
                        <h1>Olá, Bem vindo!</h1>
                        <p>Utilize seu login e senha para acessar as funcionalidades da plataforma. Está com problemas? <a href="">Entre em contato conosco.</a></p>
                    </div>
                    <div className='logosCanto'>
                        <img src={LogoCompletaAzul} alt="" className='logo' />
                        <img src={ViicLogo} alt="" />
                    </div>
                    {/* <img src={EPIback} alt="" className='backgroundEpi' /> */}
                </div>
            </main>
        </>
    )
}