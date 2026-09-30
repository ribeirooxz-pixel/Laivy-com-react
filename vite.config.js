import react from '@vitejs/plugin-react'
import { defineConfig, loadEnv } from 'vite'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  const api = env.VITE_API_PROXY_TARGET || 'http://localhost:8080'
  const proxy = Object.fromEntries(
    ['/usuarios', '/exames', '/desempenhos', '/atividades'].map((path) => [path, { target: api, changeOrigin: true }]),
  )
  return { plugins: [react()], server: { proxy } }
})
