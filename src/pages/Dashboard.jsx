import './styles/dashboard.css'
import MenuLateral from './MenuLateral'

export default function Dashboard() {
    return (
        <>
            <main className="dashboardMain">
                <MenuLateral></MenuLateral>
                <section className='principalDash'>
                    <div className='superiorDash'>
                        <h2>Dashboard</h2>
                        <p>Feedback visual sobre o monitoramento, observe dados relevantes.</p>
                    </div>
                </section>
            </main>
        </>
    )
}