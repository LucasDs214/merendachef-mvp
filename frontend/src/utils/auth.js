// Autenticação via API (tabela Admin no backend).
// A sessão em si continua simples (MVP): guardamos os dados do
// admin logado no sessionStorage após o backend validar a senha.

const SESSION_KEY = 'merendachef_admin_session'
const API_URL = 'http://localhost:5000/api'

export async function autenticar(email, senha) {
  const res = await fetch(`${API_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, senha }),
  })

  if (!res.ok) {
    return { ok: false, erro: 'E-mail ou senha inválidos.' }
  }

  const admin = await res.json()
  sessionStorage.setItem(SESSION_KEY, JSON.stringify(admin))
  return { ok: true, admin }
}

export function estaAutenticado() {
  return sessionStorage.getItem(SESSION_KEY) !== null
}

export function adminLogado() {
  const raw = sessionStorage.getItem(SESSION_KEY)
  return raw ? JSON.parse(raw) : null
}

export function sair() {
  sessionStorage.removeItem(SESSION_KEY)
}
