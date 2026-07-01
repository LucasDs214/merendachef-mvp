import { useState } from 'react'
import { Link } from 'react-router-dom'
import StepIdentificacao from '../components/StepIdentificacao'
import StepIngredientes from '../components/StepIngredientes'
import StepPreparo from '../components/StepPreparo'

const API_URL = 'https://merendachef-mvp.onrender.com/api/receitas'

const ESTADO_INICIAL = {
  nomeFuncionario: '',
  whatsapp: '',
  escola: '',
  ingredientes: [],
  nomeReceita: '',
  modoPreparo: '',
}

const TITULOS_PASSO = ['Identificação', 'Ingredientes', 'Preparo']

export default function Cadastro() {
  const [passo, setPasso] = useState(1)
  const [dados, setDados] = useState(ESTADO_INICIAL)
  const [loading, setLoading] = useState(false)
  const [erro, setErro] = useState(null)
  const [sucesso, setSucesso] = useState(false)

  const proximoPasso = () => setPasso((p) => Math.min(p + 1, 3))
  const passoAnterior = () => setPasso((p) => Math.max(p - 1, 1))

  const enviarReceita = async () => {
    setLoading(true)
    setErro(null)

    const payload = {
      nomeFuncionario: dados.nomeFuncionario,
      whatsApp: dados.whatsapp,
      escola: dados.escola,
      nomeReceita: dados.nomeReceita,
      modoPreparo: dados.modoPreparo,
      ingredientes: dados.ingredientes.map((i) => ({
        ingredienteNome: i.ingredienteNome,
        quantidade: Number(i.quantidade),
        medida: i.medida,
      })),
    }

    try {
      const res = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })

      if (!res.ok) {
        const body = await res.json().catch(() => null)
        throw new Error(body?.erro || 'Não foi possível enviar a receita. Tente novamente.')
      }

      setSucesso(true)
    } catch (err) {
      setErro(err.message)
    } finally {
      setLoading(false)
    }
  }

  const reiniciar = () => {
    setDados(ESTADO_INICIAL)
    setPasso(1)
    setSucesso(false)
    setErro(null)
  }

  if (sucesso) {
    return (
      <div className="min-h-screen flex items-center justify-center px-6 bg-gray-50">
        <div className="max-w-sm w-full text-center space-y-4">
          <div className="mx-auto h-16 w-16 rounded-full bg-green-100 flex items-center justify-center">
            <span className="text-3xl">✅</span>
          </div>
          <h1 className="text-xl font-bold text-gray-800">Receita enviada com sucesso!</h1>
          <p className="text-sm text-gray-500">
            Obrigado por contribuir com a pesquisa do MerendaChef, {dados.nomeFuncionario.split(' ')[0]}!
          </p>
          <button
            onClick={reiniciar}
            className="w-full rounded-xl bg-brand-600 text-white font-semibold py-3.5"
          >
            Enviar outra receita
          </button>
          <Link to="/" className="block text-sm text-gray-400 hover:text-brand-600">
            Voltar ao início
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <header className="bg-white border-b border-gray-100 px-5 py-4 sticky top-0 z-10">
        <Link to="/" className="text-xs text-gray-400 hover:text-brand-600">← Voltar ao início</Link>
        <h1 className="text-xl font-bold text-brand-600 mt-1">🍲 MerendaChef</h1>
        <p className="text-xs text-gray-400">Pesquisa de receitas das cozinhas escolares</p>
      </header>

      <div className="px-5 pt-4">
        <div className="flex items-center gap-2">
          {[1, 2, 3].map((n) => (
            <div key={n} className="flex-1">
              <div className={`h-1.5 rounded-full ${n <= passo ? 'bg-brand-600' : 'bg-gray-200'}`} />
            </div>
          ))}
        </div>
        <p className="text-xs text-gray-400 mt-1.5">
          Passo {passo} de 3 — {TITULOS_PASSO[passo - 1]}
        </p>
      </div>

      <main className="flex-1 px-5 py-5 max-w-md w-full mx-auto">
        {erro && (
          <div className="mb-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3">
            {erro}
          </div>
        )}

        {passo === 1 && (
          <StepIdentificacao dados={dados} onChange={setDados} onNext={proximoPasso} />
        )}
        {passo === 2 && (
          <StepIngredientes
            dados={dados}
            onChange={setDados}
            onNext={proximoPasso}
            onBack={passoAnterior}
          />
        )}
        {passo === 3 && (
          <StepPreparo
            dados={dados}
            onChange={setDados}
            onBack={passoAnterior}
            onSubmit={enviarReceita}
            loading={loading}
          />
        )}
      </main>
    </div>
  )
}
