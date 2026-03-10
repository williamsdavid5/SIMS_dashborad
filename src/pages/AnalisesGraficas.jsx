import { Outlet, NavLink } from "react-router-dom"
import MenuLateral from "./MenuLateral"

export default function AnalisesGraficas() {
    return (
        <>
            <main className="dashboardMain">
                <MenuLateral></MenuLateral>
                <section className="mainGestaoEPI">
                    <header className="superiorDash superiorGestaoEPI">
                        <h1>Análises gráficas</h1>
                        <p>Tenha o controle de todos os dados coletados pelo sistema com um feedback visual.</p>
                    </header>
                    <nav className="menuSuperiorGestaoEPI">
                        <NavLink
                            to="." end
                            className={({ isActive }) => isActive ? "ativado primeiro" : "primeiro"}
                        >Conformidade</NavLink>
                        <NavLink
                            to="epis"
                            className={({ isActive }) => isActive ? "ativado" : ""}
                        >EPIs</NavLink>
                        <NavLink
                            to="areas"
                            className={({ isActive }) => isActive ? "ativado" : ""}
                        >Áreas</NavLink>
                    </nav>
                    <Outlet></Outlet>
                </section>
            </main>
        </>
    )
}