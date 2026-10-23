const apiUrl = (import.meta.env.DEV ? '' : import.meta.env.VITE_API_URL || '').replace(/\/$/, '')

async function lerResposta(resposta) {
  const texto = await resposta.text()
  if (!texto.trim()) return null

  try {
    return JSON.parse(texto)
  } catch {
    throw new Error(`A API respondeu com conteúdo inesperado (HTTP ${resposta.status}).`)
  }
}

export async function fazerLogin(login, senha, tipo) {
  if (!login.trim() || !senha) {
    throw new Error('Preencha o login e a senha para continuar.')
  }

  let resposta
  try {
    resposta = await fetch(`${apiUrl}/usuarios/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({
        login_usuario: login.trim(),
        senha_usuario: senha,
        tipo_usuario: String(tipo),
      }),
    })
  } catch {
    throw new Error('Não foi possível conectar à API. Verifique se o backend e o banco estão ativos.')
  }

  const resultado = await lerResposta(resposta)
  if (!resposta.ok) {
    throw new Error(resultado?.erro || resultado?.error || `Falha no login (HTTP ${resposta.status}). Confira as credenciais e o perfil selecionado.`)
  }
  if (!resultado?.usuario) {
    throw new Error('A API aceitou o login, mas não retornou os dados do usuário.')
  }
  return resultado
}

export async function trocarSenha(id, senha) {
  let resposta
  try {
    resposta = await fetch(`${apiUrl}/usuarios/${id}/senha`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ senha_usuario: senha }),
    })
  } catch {
    throw new Error('Não foi possível conectar à API. Tente novamente.')
  }

  const resultado = await lerResposta(resposta)
  if (!resposta.ok) {
    throw new Error(resultado?.erro || `Não foi possível alterar a senha (HTTP ${resposta.status}).`)
  }
  if (!resultado?.usuario) {
    throw new Error('A API não retornou os dados atualizados do usuário.')
  }
  return resultado.usuario
}

export async function encerrarSessao() {
  try {
    await fetch(`${apiUrl}/usuarios/logout`, {
      method: 'POST',
      credentials: 'include',
    })
  } catch {
    // Limpa a sessão local mesmo se o backend estiver indisponível.
  } finally {
    localStorage.removeItem('usuario')
  }
}
