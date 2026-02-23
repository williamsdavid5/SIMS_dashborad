import './styles/dashboard.css'
import MenuLateral from './MenuLateral'

export default function Dashboard() {
    return (
        <>
            <main className="dashboardMain">
                <MenuLateral></MenuLateral>
                <section className='principalDash'>
                    <header className='superiorDash'>
                        <h2>Dashboard</h2>
                        <p>Feedback visual sobre o monitoramento, observe dados relevantes.</p>
                    </header>
                    <section className='blocosDash'>
                        <div className='bloco infoNumerica'>
                            <p>Total hoje</p>
                            <h1>28</h1>
                        </div>
                        <div className='bloco infoNumerica'>
                            <p>Taxa de conformidade</p>
                            <h1>91%</h1>
                        </div>
                        <div className='bloco infoNumerica cameraCritica'>
                            <p>Câmera crítica</p>
                            <h1>3</h1>
                        </div>
                        <div className='bloco distribuicaoPorCamera'>
                            <p>Distribuição por câmera</p>
                        </div>
                        <div className='bloco inforOcorrenciasHora'>
                            <p>Ocorrências por hora</p>
                        </div>
                        <div className='bloco falsosPositivos'>
                            <p>Falsos positívos</p>
                            <h1>3</h1>
                        </div>
                        <div className='bloco analiseEstatistica'>
                            <p>Análise estatística</p>
                        </div>
                        <div className='bloco ocorrenciasPorTipo'>
                            <p>Ocorrências por tipo</p>
                        </div>
                        <div className='bloco ultimasOcorrencias'>
                            <p>Últimas ocorrências</p>
                        </div>
                        <div className='bloco historicoCompleto'>
                            <p>Histórico completo</p>
                        </div>
                    </section>
                </section>
            </main>
        </>
    )
}