import { Link } from 'react-router-dom'

const PASSOS = [
  {
    numero: '01',
    titulo: 'Identificação',
    texto: 'A merendeira ou cozinheiro informa nome, WhatsApp e a escola onde atua.',
  },
  {
    numero: '02',
    titulo: 'Ingredientes',
    texto: 'Monta a lista de ingredientes com quantidade e medida de cada item.',
  },
  {
    numero: '03',
    titulo: 'Modo de preparo',
    texto: 'Descreve o passo a passo da receita e envia para a pesquisa.',
  },
]

function IlustracaoTigela() {
  return (
    <svg
      viewBox="0 0 320 320"
      className="w-full max-w-[320px] mx-auto"
      aria-hidden="true"
    >
      <g className="animate-float">
        <path
          d="M40 150c0-12 108-12 108 0s-108 12-108 0Z"
          fill="none"
        />
        <path
          d="M45 150c60 20 170 20 230 0"
          stroke="#ffedd5"
          strokeWidth="70"
          strokeLinecap="round"
          fill="none"
        />
        <path
          d="M40 150c25 62 75 100 140 100s115-38 140-100"
          fill="#ea580c"
        />
        <ellipse cx="180" cy="150" rx="140" ry="26" fill="#fb923c" />
        <ellipse cx="180" cy="146" rx="118" ry="18" fill="#fff7ed" />
      </g>
      <g stroke="#ea580c" strokeWidth="6" strokeLinecap="round" fill="none" opacity="0.55">
        <path d="M140 90c-10-14-10-24 2-38">
          <animate attributeName="opacity" values="0.2;0.6;0.2" dur="3.2s" repeatCount="indefinite" />
        </path>
        <path d="M180 82c-10-14-10-26 2-40">
          <animate attributeName="opacity" values="0.5;0.15;0.5" dur="3.6s" repeatCount="indefinite" />
        </path>
        <path d="M220 90c-10-14-10-24 2-38">
          <animate attributeName="opacity" values="0.3;0.65;0.3" dur="2.8s" repeatCount="indefinite" />
        </path>
      </g>
    </svg>
  )
}

export default function Landing() {
  return (
    <div className="min-h-screen bg-white text-ink font-sans">
      {/* Navegação */}
      <header className="border-b border-line">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-xl">🍲</span>
            <span className="font-display font-bold text-lg tracking-tight">MerendaChef</span>
          </div>
          <div className="flex items-center gap-4">
            <span className="hidden sm:inline text-xs font-medium text-brand-700 bg-brand-50 border border-brand-100 px-3 py-1 rounded-full">
              Iniciativa FAETEC
            </span>
            <Link
              to="/cadastro"
              className="text-sm font-semibold text-brand-700 hover:text-brand-600"
            >
              Cadastrar receita
            </Link>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="max-w-6xl mx-auto px-6 pt-14 pb-20 grid md:grid-cols-2 gap-12 items-center">
        <div>
          <span className="inline-block text-xs font-semibold tracking-widest text-brand-600 uppercase mb-4">
            Pesquisa · Rede Estadual FAETEC
          </span>
          <h1 className="font-display text-4xl sm:text-5xl font-bold leading-[1.08] tracking-tight text-ink">
            MerendaChef
            <span className="block text-brand-600">Valorizando a Culinária Escolar</span>
          </h1>
          <p className="mt-5 text-base sm:text-lg text-stone-600 max-w-md">
            Um espaço para merendeiras e cozinheiros das escolas técnicas
            registrarem suas receitas — reconhecendo o talento por trás de
            cada prato servido aos estudantes.
          </p>

          <div className="mt-8 flex flex-col sm:flex-row gap-3">
            <Link
              to="/cadastro"
              className="text-center rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-semibold px-6 py-3.5 transition"
            >
              Cadastrar Receita
            </Link>
            <Link
              to="/login"
              className="text-center rounded-xl border-2 border-ink/10 hover:border-brand-600 hover:text-brand-600 text-ink font-semibold px-6 py-3.5 transition"
            >
              Acesso Administrativo
            </Link>
          </div>
        </div>

        <IlustracaoTigela />
      </section>

      {/* Como funciona */}
      <section className="bg-brand-50 border-y border-line">
        <div className="max-w-6xl mx-auto px-6 py-16">
          <h2 className="font-display text-2xl font-bold text-ink text-center mb-10">
            Como funciona o cadastro
          </h2>
          <div className="grid sm:grid-cols-3 gap-6">
            {PASSOS.map((passo) => (
              <div key={passo.numero} className="bg-white rounded-2xl border border-line p-6">
                <span className="font-display text-3xl font-bold text-brand-500">
                  {passo.numero}
                </span>
                <h3 className="mt-3 font-semibold text-ink">{passo.titulo}</h3>
                <p className="mt-1.5 text-sm text-stone-600">{passo.texto}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="max-w-6xl mx-auto px-6 py-8 flex flex-col sm:flex-row items-center justify-between gap-3 text-sm text-stone-500">
        <span>© {new Date().getFullYear()} MerendaChef — Fundação de Apoio à Escola Técnica (FAETEC)</span>
        <Link to="/login" className="hover:text-brand-600">Acesso administrativo</Link>
      </footer>
    </div>
  )
}
