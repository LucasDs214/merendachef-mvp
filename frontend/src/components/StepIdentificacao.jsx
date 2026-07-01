import { ESCOLAS } from '../data/constants'

export default function StepIdentificacao({ dados, onChange, onNext }) {
  const podeAvancar = dados.nomeFuncionario.trim() && dados.whatsapp.trim() && dados.escola

  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-lg font-semibold text-gray-800">Identificação</h2>
        <p className="text-sm text-gray-500">Conte pra gente quem é você</p>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Nome completo
        </label>
        <input
          type="text"
          value={dados.nomeFuncionario}
          onChange={(e) => onChange({ ...dados, nomeFuncionario: e.target.value })}
          placeholder="Ex: Maria Aparecida"
          className="w-full rounded-xl border border-gray-300 px-4 py-3 text-base focus:outline-none focus:ring-2 focus:ring-brand-500"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          WhatsApp
        </label>
        <input
          type="tel"
          value={dados.whatsapp}
          onChange={(e) => onChange({ ...dados, whatsapp: e.target.value })}
          placeholder="(21) 90000-0000"
          className="w-full rounded-xl border border-gray-300 px-4 py-3 text-base focus:outline-none focus:ring-2 focus:ring-brand-500"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Escola
        </label>
        <select
          value={dados.escola}
          onChange={(e) => onChange({ ...dados, escola: e.target.value })}
          className="w-full rounded-xl border border-gray-300 px-4 py-3 text-base bg-white focus:outline-none focus:ring-2 focus:ring-brand-500"
        >
          <option value="">Selecione sua escola</option>
          {ESCOLAS.map((escola) => (
            <option key={escola} value={escola}>{escola}</option>
          ))}
        </select>
      </div>

      <button
        type="button"
        disabled={!podeAvancar}
        onClick={onNext}
        className="w-full rounded-xl bg-brand-600 disabled:bg-gray-300 text-white font-semibold py-3.5 text-base active:scale-[0.98] transition"
      >
        Avançar
      </button>
    </div>
  )
}
