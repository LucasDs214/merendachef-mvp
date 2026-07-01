export default function StepPreparo({ dados, onChange, onBack, onSubmit, loading }) {
  const podeEnviar = dados.nomeReceita.trim() && dados.modoPreparo.trim().length > 10

  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-lg font-semibold text-gray-800">Modo de Preparo</h2>
        <p className="text-sm text-gray-500">Últimos detalhes da sua receita</p>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Nome da receita
        </label>
        <input
          type="text"
          value={dados.nomeReceita}
          onChange={(e) => onChange({ ...dados, nomeReceita: e.target.value })}
          placeholder="Ex: Cenoura refogada com frango"
          className="w-full rounded-xl border border-gray-300 px-4 py-3 text-base focus:outline-none focus:ring-2 focus:ring-brand-500"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Modo de preparo
        </label>
        <textarea
          value={dados.modoPreparo}
          onChange={(e) => onChange({ ...dados, modoPreparo: e.target.value })}
          placeholder="Descreva o passo a passo do preparo..."
          rows={6}
          className="w-full rounded-xl border border-gray-300 px-4 py-3 text-base focus:outline-none focus:ring-2 focus:ring-brand-500"
        />
      </div>

      <div className="flex gap-3 pt-2">
        <button
          type="button"
          onClick={onBack}
          disabled={loading}
          className="w-1/3 rounded-xl border border-gray-300 text-gray-600 font-semibold py-3.5 disabled:opacity-50"
        >
          Voltar
        </button>
        <button
          type="button"
          disabled={!podeEnviar || loading}
          onClick={onSubmit}
          className="w-2/3 rounded-xl bg-brand-600 disabled:bg-gray-300 text-white font-semibold py-3.5 active:scale-[0.98] transition flex items-center justify-center gap-2"
        >
          {loading && (
            <span className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
          )}
          {loading ? 'Enviando...' : 'Enviar receita'}
        </button>
      </div>
    </div>
  )
}
