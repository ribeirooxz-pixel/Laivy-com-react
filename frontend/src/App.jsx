import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import Login from './pages/Login'
import Inicio from './pages/Home'
import PerfilAtleta from './pages/PerfilAtleta'
import TrocarSenha from './pages/TrocarSenha'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<Login />} />
        <Route path="/trocar-senha" element={<TrocarSenha />} />
        <Route path="/home" element={<Inicio />} />
        <Route path="/perfil-atleta/:id" element={<PerfilAtleta />} />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
