import { useNavigate } from "react-router-dom"
import MenuLateral from "./MenuLateral";

export default function Home() {
    const navigate = useNavigate();

    return (
        <>
            <main className="dashboardMain">
                <MenuLateral></MenuLateral>
                <section className="principalDash">

                </section>
            </main>
            {/* <button
                onClick={() => navigate('/')}
            >Login</button> */}
        </>
    )
}