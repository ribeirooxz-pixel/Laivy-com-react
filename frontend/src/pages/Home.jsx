import '../styles/Home.css'
import { Link } from 'react-router-dom'
import Footer from '../componentes/Footer'

function Inicio() {
    return (
        <>
        <main className="inicio">
            <section className="inicio_conteudo">
                <span className="inicio-etiqueta">GESTÃO ESPORTIVA</span>
                <h1>Bem-vindo ao LAIVY</h1>
                <p>Uma visão completa para acompanhar a jornada e o desempenho dos atletas.</p>
                <div className="inicio-acoes">
                    <Link className="acao-principal" to="/perfil-atleta/1">Conhecer perfil do atleta <span aria-hidden="true">→</span></Link>
                    <Link className="acao-secundaria" to="/login" onClick={() => localStorage.removeItem('usuario')}>Sair</Link>
                </div>
                <div className="inicio-resumo">
                    <div><strong>Atletas</strong><span>Perfis e informações pessoais</span></div>
                    <div><strong>Desempenho</strong><span>Histórico e evolução</span></div>
                    <div><strong>Saúde</strong><span>Acompanhamento de exames</span></div>
                </div>
            </section>
        </main>
        <Footer />
        </>
    )
}

export default Inicio
