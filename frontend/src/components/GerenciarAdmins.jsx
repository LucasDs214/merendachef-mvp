import { useEffect, useState } from 'react'

const API_URL = 'https://merendachef-mvp.onrender.com/api/admins'

export default function GerenciarAdmins({ onClose }) {
  const [admins, setAdmins] = useState([])
  const [carregando, setCarregando] = useState(true)
  const [erro, setErro] = useState(null)
  const [sucesso, setSucesso] = useState(null)
  const [salvando, setSalvando] = useState(false)

  const [form, setForm] = useState({ nome: '', email: '', senha: '' })

  useEffect(() => {
    carregarAdmins()
  }, [])

  const carregarAdmins = async () => {
    setCarregando(true)
    try {
      const res = await fetch(API_URL)
      if (!res.ok) throw new Error('Não foi possível carregar os administradores.')
      setAdmins(await res.json())
    } catch (err) {
      setErro(err.message)
    } finally {
      setCarregando(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setErro(null)
    setSucesso(null)

    if (form.senha.length < 6) {
      setErro('A senha deve ter ao menos 6 caracteres.')
      return
    }

    setSalvando(true)
    try {
      const res = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      const body = await res.json().catch(() => null)

      if (!res.ok) {
        throw new Error(body?.erro || 'Não foi possível criar o administrador.')
      }

      setSucesso(`Admin "${body.nome}" criado com sucesso.`)
      setForm({ nome: '', email: '', senha: '' })
      carregarAdmins()
    } catch (err) {
      setErro(err.message)
    } finally {
      setSalvando(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-white w-full max-w-sm p-6 rounded-2xl shadow-xl space-y-5 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-stone-900">Gerenciar Admins</h2>
          <button onClick={onClose} className="text-stone-400 text-sm font-semibold">
            Fechar
          </button>
        </div>

        {erro && (
          <div className="bg-red-50 text-red-700 text-sm px-4 py-3 rounded-xl border border-red-200">
            {erro}
          </div>
        )}
        {sucesso && (
          <div className="bg-green-50 text-green-700 text-sm px-4 py-3 rounded-xl border border-green-200">
            {sucesso}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-3 border-b border-stone-100 pb-5">
          <p className="text-sm font-semibold text-stone-700">Novo administrador</p>

          <input
            type="text"
            placeholder="Nome"
            value={form.nome}
            onChange={(e) => setForm((f) => ({ ...f, nome: e.target.value }))}
            required
            className="w-full rounded-lg border border-stone-300 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
          />
          <input
            type="email"
            placeholder="E-mail"
            value={form.email}
            onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
            required
            className="w-full rounded-lg border border-stone-300 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
          />
          <input
            type="password"
            placeholder="Senha (mín. 6 caracteres)"
            value={form.senha}
            onChange={(e) => setForm((f) => ({ ...f, senha: e.target.value }))}
            required
            minLength={6}
            className="w-full rounded-lg border border-stone-300 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
          />

          <button
            type="submit"
            disabled={salvando}
            className="w-full bg-orange-600 hover:bg-orange-700 disabled:bg-stone-300 text-white font-bold py-2.5 rounded-lg transition"
          >
            {salvando ? 'Criando...' : '+ Criar administrador'}
          </button>
        </form>

        <div>
          <p className="text-sm font-semibold text-stone-700 mb-2">
            Administradores atuais {!carregando && `(${admins.length})`}
          </p>
          {carregando ? (
            <p className="text-sm text-stone-400">Carregando...</p>
          ) : (
            <ul className="space-y-2">
              {admins.map((a) => (
                <li
                  key={a.id}
                  className="flex flex-col bg-stone-50 border border-stone-100 rounded-lg px-3 py-2"
                >
                  <span className="text-sm font-medium text-stone-900">{a.nome}</span>
                  <span className="text-xs text-stone-500">{a.email}</span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  )
}
