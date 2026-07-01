import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { autenticar } from '../utils/auth'

export default function Login() {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [senha, setSenha] = useState('')
  const [erro, setErro] = useState(null)
  const [carregando, setCarregando] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setErro(null)
    setCarregando(true)

    try {
      const resultado = await autenticar(email.trim(), senha)
      if (resultado.ok) {
        navigate('/dashboard')
      } else {
        setErro(resultado.erro)
      }
    } catch {
      setErro('Não foi possível conectar ao servidor. Tente novamente.')
    } finally {
      setCarregando(false)
    }
  }

  return (
    <div className="min-h-screen bg-white flex flex-col font-sans">
      <header className="px-6 py-4 border-b border-line">
        <Link to="/" className="text-sm text-stone-400 hover:text-brand-600">
          ← Voltar ao início
        </Link>
      </header>

      <main className="flex-1 flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-sm">
          <div className="text-center mb-8">
            <span className="text-2xl">🍲</span>
            <h1 className="font-display text-2xl font-bold text-ink mt-2">
              Acesso Administrativo
            </h1>
            <p className="text-sm text-stone-500 mt-1">
              Entre para visualizar e avaliar as receitas cadastradas.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {erro && (
              <div className="rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3">
                {erro}
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-ink mb-1">E-mail</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@faetec.rj.gov.br"
                className="w-full rounded-xl border border-line px-4 py-3 text-base focus:outline-none focus:ring-2 focus:ring-brand-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-ink mb-1">Senha</label>
              <input
                type="password"
                value={senha}
                onChange={(e) => setSenha(e.target.value)}
                placeholder="••••••••"
                className="w-full rounded-xl border border-line px-4 py-3 text-base focus:outline-none focus:ring-2 focus:ring-brand-500"
                required
              />
            </div>

            <button
              type="submit"
              disabled={carregando}
              className="w-full rounded-xl bg-brand-600 hover:bg-brand-700 disabled:bg-stone-300 text-white font-semibold py-3.5 transition"
            >
              {carregando ? 'Entrando...' : 'Entrar'}
            </button>
          </form>

          <p className="text-xs text-stone-400 text-center mt-6">
            MVP: autenticação simplificada, apenas para fins de demonstração.
          </p>
        </div>
      </main>
    </div>
  )
}
