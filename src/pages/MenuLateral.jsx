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
                        to="/GestaoEPI"
                        className={({ isActive }) => isActive ? "itemAtivado" : "itemDesativado"}

                    >
                        Gestão de EPIs
                    </NavLink>
                    <NavLink
                        to="/analises-graficas"
                        className={({ isActive }) => isActive ? "itemAtivado" : "itemDesativado"}
                    >
                        Análises Gráficas
                    </NavLink>
                    <NavLink
                        to="/emissao-relatorios"
                        className={({ isActive }) => isActive ? "itemAtivado" : "itemDesativado"}
                    >
                        Emissão de relatórios
                    </NavLink>
                    <NavLink
                        to="/monitoramento"
                        className={({ isActive }) => isActive ? "itemAtivado" : "itemDesativado"}
                    >
                        Monitoramento ao vivo
                    </NavLink>
                </div>
            </aside>
        </>
    )
}