import react from '@vitejs/plugin-react'
import { defineConfig, loadEnv } from 'vite'

// Rotas da API do Spring (JwtFilter). Em desenvolvimento o Vite repassa para o backend.
// Regex com limite de segmento: '/atividades' não pode casar com '/atividades.html'.
const API = ['/usuarios', '/times', '/atividades', '/calendarios', '/desempenhos',
  '/exames', '/escalacoes', '/visitantes', '/assistente', '/auditoria']

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  const api = env.VITE_API_PROXY_TARGET || 'http://localhost:8080'
  const proxy = Object.fromEntries(
    API.map((path) => ['^' + path + '(/|\\?|$)', { target: api, changeOrigin: true }]),
  )
  return {
    plugins: [react()],
    // O build sai em src/main/resources/static, que o Spring serve (e de onde o
    // SvgJogadaService lê img/quadra-fiba.svg). O Dockerfile já espera esse caminho.
    build: { outDir: '../src/main/resources/static', emptyOutDir: true },
    server: { port: 5173, proxy },
  }
})
