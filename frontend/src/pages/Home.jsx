import '../styles/Home.css'
import { Link, useNavigate } from 'react-router-dom'
import { useEffect } from 'react'
import { encerrarSessao } from '../services/usuarioService'
import Footer from '../componentes/Footer'

function Inicio() {
    const navigate = useNavigate()
    const usuario = JSON.parse(localStorage.getItem('usuario') || 'null')

    useEffect(() => {
        if (!usuario?.id_usuario) navigate('/login', { replace: true })
        else if (usuario.primeiro_login === 1) navigate('/trocar-senha', { replace: true })
    }, [navigate, usuario?.id_usuario, usuario?.primeiro_login])

    async function sair() {
        await encerrarSessao()
        navigate('/login', { replace: true })
    }

    if (!usuario?.id_usuario || usuario.primeiro_login === 1) return null

    return (
        <>
        <main className="inicio">
            <section className="inicio_conteudo">
                <span className="inicio-etiqueta">GESTÃO ESPORTIVA</span>
                <h1>Bem-vindo ao LAIVY</h1>
                <p>Uma visão completa para acompanhar a jornada e o desempenho dos atletas.</p>
                <div className="inicio-acoes">
                    <Link className="acao-principal" to={`/perfil-atleta/${usuario.id_usuario}`}>Ver meu perfil <span aria-hidden="true">→</span></Link>
                    <Link className="acao-secundaria" to="/login" onClick={(event) => { event.preventDefault(); void sair() }}>Sair</Link>
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
