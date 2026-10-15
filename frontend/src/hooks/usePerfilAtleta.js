import { useEffect, useState } from 'react'
import { buscarPerfilAtleta } from '../services/atletaService'

export function usePerfilAtleta(id) {
  const [resultado, setResultado] = useState(null)
  useEffect(() => {
    let ativo = true
    buscarPerfilAtleta(id)
      .then((dados) => { if (ativo) setResultado({ id, dados, erro: '' }) })
      .catch((error) => { if (ativo) setResultado({ id, dados: null, erro: error.message }) })
    return () => { ativo = false }
  }, [id])
  if (!resultado || resultado.id !== id) return { dados: null, carregando: true, erro: '' }
  return { dados: resultado.dados, carregando: false, erro: resultado.erro }
}
