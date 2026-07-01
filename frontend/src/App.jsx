import { Routes, Route } from 'react-router-dom'
import Landing from './pages/Landing'
import Cadastro from './pages/Cadastro'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/cadastro" element={<Cadastro />} />
      <Route path="/login" element={<Login />} />
      <Route path="/dashboard" element={<Dashboard />} />
    </Routes>
  )
}
