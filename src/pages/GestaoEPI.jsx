import MenuLateral from "./MenuLateral"
import './styles/gestaoEPI.css'
import { Outlet, NavLink } from "react-router-dom"

export default function GestaoEPI() {
    return (
        <>
            <main className="dashboardMain">
                <MenuLateral></MenuLateral>
                <section className="mainGestaoEPI">
                    <header className="superiorDash superiorGestaoEPI">
                        <h1>Gestão de EPIs</h1>
                        <p>Controle a distribuição de EPIs entre os funcionários autorizados.</p>
                    </header>
                    <nav className="menuSuperiorGestaoEPI">
                        <NavLink
                            to="." end
                            className={({ isActive }) => isActive ? "ativado primeiro" : "primeiro"}
                        >Inventário</NavLink>
                        <NavLink
                            to="distribuicao"
                            className={({ isActive }) => isActive ? "ativado" : ""}
                        >Distribuição</NavLink>
                        <NavLink
                            to="historico"
                            className={({ isActive }) => isActive ? "ativado" : ""}
                        >Histórico</NavLink>
                        <NavLink
                            to="estoque"
                            className={({ isActive }) => isActive ? "ativado" : ""}
                        >Estoque</NavLink>
                    </nav>
                    <Outlet></Outlet>
                </section>
            </main >
        </>
    )
}