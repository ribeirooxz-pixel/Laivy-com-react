const baseUrl = import.meta.env.VITE_API_URL || ''

const perfilDemonstracao = {
  atleta: {
    id_usuario: 1,
    nome_usuario: 'Atleta LAIVY',
    cpf_usuario: '000.000.000-00',
    data_nasc_usuario: '2006-04-18',
    cel_usuario: '(11) 90000-0000',
    time: { nome_time: 'LAIVY Esporte Clube' },
  },
  exames: [
    { id_exame: 1, data_inicio_exame: '2026-08-12', peso_usuario: 68.4, altura_usuario: 1.74, taxa_gordura_usuario: 14.2, status_usuario: 1, observacoes_exame: 'Avaliação física em boas condições.' },
    { id_exame: 2, data_inicio_exame: '2026-03-10', peso_usuario: 69.1, altura_usuario: 1.74, taxa_gordura_usuario: 15.1, status_usuario: 1 },
  ],
  atividades: [
    { id_atividade: 1, nome_atividade: 'Treino técnico e tático', data_atividade: '2026-09-18', lugar_atividade: 'Centro esportivo LAIVY', tipo_atividade: 1 },
    { id_atividade: 2, nome_atividade: 'Jogo amistoso', data_atividade: '2026-09-12', lugar_atividade: 'Ginásio municipal', tipo_atividade: 2 },
    { id_atividade: 3, nome_atividade: 'Treino de preparação física', data_atividade: '2026-09-08', lugar_atividade: 'Centro esportivo LAIVY', tipo_atividade: 1 },
  ],
  desempenhos: [
    { id_desempenho: 1, data_desempenho: '2026-04-20', pontuacao: 62, salto_horizontal: 2.1, salto_vertical: 0.48 },
    { id_desempenho: 2, data_desempenho: '2026-06-15', pontuacao: 74, salto_horizontal: 2.24, salto_vertical: 0.52 },
    { id_desempenho: 3, data_desempenho: '2026-08-12', pontuacao: 86, salto_horizontal: 2.38, salto_vertical: 0.57 },
    { id_desempenho: 4, data_desempenho: '2026-09-18', pontuacao: 91, salto_horizontal: 2.46, salto_vertical: 0.61 },
  ],
}

async function requisitar(caminho) {
  const resposta = await fetch(`${baseUrl}${caminho}`, {
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
  })
  if (resposta.status === 401 || resposta.status === 403) {
    localStorage.removeItem('usuario')
    throw new Error('Sua sessão expirou. Entre novamente para continuar.')
  }
  if (!resposta.ok) throw new Error(`Não foi possível carregar os dados (${resposta.status}).`)
  return resposta.json()
}

export async function buscarPerfilAtleta(id) {
  if (import.meta.env.DEV) {
    if (String(id) !== '1') throw new Error('Atleta não encontrado.')
    return perfilDemonstracao
  }
  const [atleta, exames, desempenhos, atividades] = await Promise.all([
    requisitar(`/usuarios/${id}`),
    requisitar(`/exames/usuario/${id}`),
    requisitar(`/desempenhos/usuario/${id}`),
    requisitar(`/atividades/usuario/${id}`),
  ])
  return { atleta, exames, desempenhos, atividades }
}
