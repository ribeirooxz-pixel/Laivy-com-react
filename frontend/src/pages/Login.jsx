import '../styles/Login.css'
import { useNavigate } from 'react-router-dom'
import { useUsuario } from '../hooks/useUsuario'
import Footer from '../componentes/Footer'

function Login() {
    const navigate = useNavigate()
    const { email, senha, tipo, erro, carregando, setEmail, setSenha, setTipo, entrar } = useUsuario()
    async function handleSubmit(event) {
        event.preventDefault()
        const usuario = await entrar()
        if (usuario) {
            localStorage.setItem('usuario', JSON.stringify(usuario.usuario))
            navigate(usuario.usuario.primeiro_login === 1 ? '/trocar-senha' : '/home')
        }
    }
    return (
        <>
        <main className="login">
            <form className="formulario_login" onSubmit={handleSubmit}>
                <span className="login-marca">LAIVY <span>•</span></span>
                <h1>Entrar</h1>
                <div className="campo-login">
                    <label htmlFor="login">Login</label>
                    <input
                        id="login"
                        name="login"
                        type="text"
                        autoComplete="username"
                        placeholder="Digite seu login"
                        value={email}
                        onChange={(event) => setEmail(event.target.value)}
                        required
                    />
                </div>

                <div className="senha">
                    <label htmlFor="senha">Senha</label>
                    <input
                        id="senha"
                        name="senha"
                        type="password"
                        autoComplete="current-password"
                        placeholder="Digite sua senha"
                        value={senha}
                        onChange={(event) => setSenha(event.target.value)}
                        required
                    />
                </div>
                <div className="campo-login">
                    <label htmlFor="tipo">Perfil</label>
                    <select id="tipo" name="tipo" value={tipo} onChange={(event) => setTipo(event.target.value)}>
                        <option value="1">Administrador</option>
                        <option value="2">Treinador</option>
                        <option value="3">Atleta</option>
                    </select>
                </div>
                {erro && <p className="login-erro" role="alert">{erro}</p>}
                <button className="login__button" type="submit" disabled={carregando}>
                    {carregando ? 'Entrando…' : 'Entrar'}
                </button>
            </form>
        </main>
        <Footer />
        </>
    )
}

export default Login
