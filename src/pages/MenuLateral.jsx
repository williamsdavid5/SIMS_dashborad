import './styles/menuLateral.css'
import LogoHorizontal from '../assets/sims_horizontal.png'
import { NavLink } from 'react-router-dom'
import { useState } from 'react'

export default function MenuLateral() {

    const [mostrarMenu, setMostrarMenu] = useState(false);

    function mostrarMenuBtn() {
        setMostrarMenu(!mostrarMenu);
    }

    return (
        <>
            <button className='botaoMenu' onClick={() => mostrarMenuBtn()}>Menu</button>
            <aside className={`menuLateralDiv ${mostrarMenu ? 'menuMobile' : ''}`}>
                <div className='logoAux'>
                    <img src={LogoHorizontal} alt="" />
                </div>
                <h3 className='titulo'>Sistema Inteligente de Monitoramento e Segurança</h3>
                <p className='paragrafoPadrao'>Bem vindo ao nosso sistema, veja as funcionalidades disponíveis para você.</p>
                <div className={`menuLateral`}>
                    <NavLink
                        to="/dashboard"
                        className={({ isActive }) => isActive ? "itemAtivado" : "itemDesativado"}
                    >
                        Dashboard
                    </NavLink>
                    <NavLink
                        to="/"
                        className={({ isActive }) => isActive ? "itemAtivado" : "itemDesativado"}

                    >
                        Função 1
                    </NavLink>
                    <NavLink
                        to="/"
                        className={({ isActive }) => isActive ? "itemAtivado" : "itemDesativado"}
                    >
                        Função 2
                    </NavLink>
                    <NavLink
                        to="/"
                        className={({ isActive }) => isActive ? "itemAtivado" : "itemDesativado"}
                    >
                        Função 3
                    </NavLink>
                    <NavLink
                        to="/"
                        className={({ isActive }) => isActive ? "itemAtivado" : "itemDesativado"}
                    >
                        Função 4
                    </NavLink>
                </div>
            </aside>
        </>
    )
}