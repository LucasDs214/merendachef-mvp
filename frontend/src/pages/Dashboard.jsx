import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { estaAutenticado, sair } from '../utils/auth'
import GerenciarAdmins from '../components/GerenciarAdmins'

const API_URL = 'https://merendachef-mvp.onrender.com/api/receitas'

export default function Dashboard() {
  const navigate = useNavigate()
  const [receitas, setReceitas] = useState([])
  const [notas, setNotas] = useState({})
  const [salvandoId, setSalvandoId] = useState(null)
  const [carregando, setCarregando] = useState(true)
  const [erro, setErro] = useState(null)
  const [modalReceita, setModalReceita] = useState(null)
  const [modalAdmins, setModalAdmins] = useState(false)

  useEffect(() => {
    if (!estaAutenticado()) {
      navigate('/login')
      return
    }
    carregarReceitas()
  }, [navigate])

  const carregarReceitas = async () => {
    setCarregando(true)
    setErro(null)
    try {
      const res = await fetch(API_URL)
      if (!res.ok) throw new Error('Não foi possível carregar as receitas.')
      const data = await res.json()
      setReceitas(data)

      const notasIniciais = {}
      data.forEach((r) => {
        notasIniciais[r.id] = r.nota ?? ''
      })
      setNotas(notasIniciais)
    } catch (err) {
      setErro(err.message)
    } finally {
      setCarregando(false)
    }
  }

  const salvarNota = async (id) => {
    const valor = notas[id]
    if (valor === '' || valor === undefined || Number(valor) < 0 || Number(valor) > 10) {
      setErro('Informe uma nota válida entre 0 e 10.')
      return
    }

    setSalvandoId(id)
    setErro(null)
    try {
      const res = await fetch(`${API_URL}/${id}/nota`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nota: Number(valor) }),
      })
      if (!res.ok) throw new Error('Não foi possível salvar a nota.')
    } catch (err) {
      setErro(err.message)
    } finally {
      setSalvandoId(null)
    }
  }

  const handleLogout = () => {
    sair()
    navigate('/login')
  }

  return (
    <div className="min-h-screen bg-stone-50 font-sans">
      <header className="bg-white border-b border-stone-200">
        <div className="max-w-2xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-xl">🍲</span>
            <span className="font-bold text-lg text-stone-800">MerendaChef · Admin</span>
          </div>
          <div className="flex items-center gap-4">
            <button
              onClick={() => setModalAdmins(true)}
              className="text-sm font-semibold text-stone-600 hover:text-orange-600"
            >
              Gerenciar Admins
            </button>
            <button onClick={handleLogout} className="text-sm font-semibold text-orange-600 hover:text-orange-700">Sair</button>
          </div>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-stone-800">Ranking</h1>
          <span className="text-sm text-stone-500">{receitas.length} receitas</span>
        </div>

        {erro && <div className="mb-4 bg-red-50 text-red-700 text-sm px-4 py-3 rounded-xl border border-red-200">{erro}</div>}

        {carregando ? (
          <p className="text-center text-stone-500">Carregando...</p>
        ) : receitas.length === 0 ? (
          <div className="bg-white p-10 text-center text-stone-500 rounded-2xl border border-stone-200">Nenhuma receita ainda.</div>
        ) : (
          <div className="space-y-4">
            {[...receitas].sort((a, b) => (b.nota || 0) - (a.nota || 0)).map((r, index) => (
              <div key={r.id} className="bg-white p-5 rounded-2xl border border-stone-200 shadow-sm flex justify-between items-center">
                <div className="flex items-center gap-4">
                  <span className="text-2xl font-black text-orange-500 w-8">#{index + 1}</span>
                  <div>
                    <h3 className="font-bold text-stone-900">{r.nomeReceita}</h3>
                    <p className="text-xs text-stone-500">{r.nomeFuncionario}</p>
                  </div>
                </div>
                <button 
                  onClick={() => setModalReceita(r)}
                  className="text-xs bg-stone-100 px-3 py-2 rounded-lg text-stone-700 font-semibold hover:bg-stone-200 transition"
                >
                  Detalhes
                </button>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* MODAL DE DETALHES */}
{modalReceita && (
  <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
    <div className="bg-white w-full max-w-sm p-6 rounded-2xl shadow-xl space-y-4 max-h-[90vh] overflow-y-auto">
      <h2 className="text-xl font-bold text-stone-900">{modalReceita.nomeReceita}</h2>
      
      <div className="text-sm text-stone-600 space-y-3 border-t pt-4">
        <p><strong>Chef:</strong> {modalReceita.nomeFuncionario}</p>
        <p><strong>WhatsApp:</strong> {modalReceita.whatsApp}</p>
        <p><strong>Escola:</strong> {modalReceita.escola}</p>
        
        {/* Tabela de Ingredientes */}
        <div className="mt-4">
          <p className="font-bold text-stone-900 mb-2">Ingredientes:</p>
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-stone-200">
                <th className="py-1">Item</th>
                <th className="py-1">Qtd</th>
                <th className="py-1">Unid</th>
              </tr>
            </thead>
            <tbody>
              {modalReceita.ingredientes?.map((i, idx) => (
                <tr key={idx} className="border-b border-stone-100">
                  <td className="py-2">{i.ingredienteNome}</td>
                  <td className="py-2">{i.quantidade}</td>
                  <td className="py-2">{i.medida}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <p className="pt-2"><strong>Modo de Preparo:</strong><br />{modalReceita.modoPreparo}</p>
      </div>
      
      <div className="flex items-center gap-3 pt-4 border-t">
        <input
          type="number"
          min="0" max="10" step="0.1"
          value={notas[modalReceita.id] ?? ''}
          onChange={(e) => setNotas((prev) => ({ ...prev, [modalReceita.id]: e.target.value }))}
          className="w-20 p-2 rounded-lg border border-stone-300 text-center font-bold"
        />
        <button
          onClick={() => { salvarNota(modalReceita.id); setModalReceita(null); }}
          className="flex-1 bg-orange-600 hover:bg-orange-700 text-white font-bold py-2 rounded-lg transition"
        >
          Salvar Nota
        </button>
      </div>
      <button 
        onClick={() => setModalReceita(null)}
        className="w-full text-stone-400 text-sm font-semibold"
      >
        Fechar
      </button>
    </div>
  </div>
)}

      {modalAdmins && <GerenciarAdmins onClose={() => setModalAdmins(false)} />}
    </div>
  )
}
