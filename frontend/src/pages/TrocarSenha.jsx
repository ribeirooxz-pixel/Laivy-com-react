import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { trocarSenha } from '../services/usuarioService'
import Footer from '../componentes/Footer'
import '../styles/Login.css'

function TrocarSenha() {
  const navigate = useNavigate()
  const usuario = JSON.parse(localStorage.getItem('usuario') || 'null')
  const [senha, setSenha] = useState('')
  const [confirmacao, setConfirmacao] = useState('')
  const [erro, setErro] = useState('')
  const [carregando, setCarregando] = useState(false)

  useEffect(() => {
    if (!usuario?.id_usuario) navigate('/login', { replace: true })
    else if (usuario.primeiro_login !== 1) navigate('/home', { replace: true })
  }, [navigate, usuario?.id_usuario, usuario?.primeiro_login])

  async function salvar(event) {
    event.preventDefault()
    setErro('')
    if (senha !== confirmacao) {
      setErro('As senhas nao coincidem.')
      return
    }

    setCarregando(true)
    try {
      const usuarioAtualizado = await trocarSenha(usuario.id_usuario, senha)
      localStorage.setItem('usuario', JSON.stringify(usuarioAtualizado))
      navigate('/home', { replace: true })
    } catch (error) {
      setErro(error.message)
    } finally {
      setCarregando(false)
    }
  }

  if (!usuario?.id_usuario || usuario.primeiro_login !== 1) return null

  return (
    <>
      <main className="login">
        <form className="formulario_login" onSubmit={salvar}>
          <span className="login-marca">LAIVY <span>•</span></span>
          <h1>Crie sua senha</h1>
          <p>Por seguranca, defina uma nova senha antes de continuar.</p>
          <div className="senha">
            <label htmlFor="nova-senha">Nova senha</label>
            <input
              id="nova-senha"
              type="password"
              autoComplete="new-password"
              minLength={8}
              value={senha}
              onChange={(event) => setSenha(event.target.value)}
              required
            />
          </div>
          <div className="senha">
            <label htmlFor="confirmacao-senha">Confirme a nova senha</label>
            <input
              id="confirmacao-senha"
              type="password"
              autoComplete="new-password"
              minLength={8}
              value={confirmacao}
              onChange={(event) => setConfirmacao(event.target.value)}
              required
            />
          </div>
          <p>A senha deve ter pelo menos 8 caracteres, com letras e numeros.</p>
          {erro && <p className="login-erro" role="alert">{erro}</p>}
          <button className="login__button" type="submit" disabled={carregando}>
            {carregando ? 'Salvando...' : 'Salvar nova senha'}
          </button>
        </form>
      </main>
      <Footer />
    </>
  )
}

export default TrocarSenha
