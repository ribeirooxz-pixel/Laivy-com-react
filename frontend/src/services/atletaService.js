const baseUrl = (import.meta.env.DEV ? '' : import.meta.env.VITE_API_URL || '').replace(/\/$/, '')

async function requisitar(caminho) {
  let resposta
  try {
    resposta = await fetch(`${baseUrl}${caminho}`, {
      headers: { Accept: 'application/json' },
      credentials: 'include',
    })
  } catch {
    throw new Error('Não foi possível conectar à API. Verifique se o backend está ativo.')
  }

  if (resposta.status === 401 || resposta.status === 403) {
    localStorage.removeItem('usuario')
    throw new Error(resposta.status === 401
      ? 'Sua sessão expirou. Entre novamente para continuar.'
      : 'Sua conta não tem permissão para consultar esses dados.')
  }
  if (!resposta.ok) {
    throw new Error(`Não foi possível carregar os dados (${resposta.status}).`)
  }
  return resposta.json()
}

export async function buscarPerfilAtleta(id) {
  const [atleta, exames, desempenhos, atividades] = await Promise.all([
    requisitar(`/usuarios/${id}`),
    requisitar(`/exames/usuario/${id}`),
    requisitar(`/desempenhos/usuario/${id}`),
    requisitar(`/atividades/usuario/${id}`),
  ])
  return { atleta, exames, desempenhos, atividades }
}
