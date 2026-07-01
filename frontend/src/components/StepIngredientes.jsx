import { INGREDIENTES, MEDIDAS } from '../data/constants'

let nextId = 1

export default function StepIngredientes({ dados, onChange, onNext, onBack }) {
  const ingredientes = dados.ingredientes

  const adicionarLinha = () => {
    onChange({
      ...dados,
      ingredientes: [
        ...ingredientes,
        { id: nextId++, ingredienteNome: '', quantidade: '', medida: '' },
      ],
    })
  }

  const atualizarLinha = (id, campo, valor) => {
    onChange({
      ...dados,
      ingredientes: ingredientes.map((item) =>
        item.id === id ? { ...item, [campo]: valor } : item
      ),
    })
  }

  const removerLinha = (id) => {
    onChange({
      ...dados,
      ingredientes: ingredientes.filter((item) => item.id !== id),
    })
  }

  const linhasValidas = ingredientes.length > 0 && ingredientes.every(
    (i) => i.ingredienteNome && i.quantidade && Number(i.quantidade) > 0 && i.medida
  )

  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-lg font-semibold text-gray-800">Ingredientes</h2>
        <p className="text-sm text-gray-500">Adicione todos os ingredientes da receita</p>
      </div>

      <div className="space-y-3">
        {ingredientes.map((item, idx) => (
          <div key={item.id} className="rounded-xl border border-gray-200 p-3 bg-white shadow-sm space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-gray-400">Ingrediente {idx + 1}</span>
              <button
                type="button"
                onClick={() => removerLinha(item.id)}
                className="text-red-500 text-sm font-medium px-2 py-1"
                aria-label="Remover ingrediente"
              >
                Remover
              </button>
            </div>

            <select
              value={item.ingredienteNome}
              onChange={(e) => atualizarLinha(item.id, 'ingredienteNome', e.target.value)}
              className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-brand-500"
            >
              <option value="">Selecione o ingrediente</option>
              {INGREDIENTES.map((ing) => (
                <option key={ing} value={ing}>{ing}</option>
              ))}
            </select>

            <div className="grid grid-cols-2 gap-2">
              <input
                type="number"
                min="0"
                step="0.01"
                inputMode="decimal"
                value={item.quantidade}
                onChange={(e) => atualizarLinha(item.id, 'quantidade', e.target.value)}
                placeholder="Qtd."
                className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
              />
              <select
                value={item.medida}
                onChange={(e) => atualizarLinha(item.id, 'medida', e.target.value)}
                className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-brand-500"
              >
                <option value="">Medida</option>
                {MEDIDAS.map((m) => (
                  <option key={m} value={m}>{m}</option>
                ))}
              </select>
            </div>
          </div>
        ))}

        {ingredientes.length === 0 && (
          <p className="text-sm text-gray-400 text-center py-4">
            Nenhum ingrediente adicionado ainda.
          </p>
        )}
      </div>

      <button
        type="button"
        onClick={adicionarLinha}
        className="w-full rounded-xl border-2 border-dashed border-brand-500 text-brand-600 font-medium py-3 text-sm"
      >
        + Adicionar Ingrediente
      </button>

      <div className="flex gap-3 pt-2">
        <button
          type="button"
          onClick={onBack}
          className="w-1/3 rounded-xl border border-gray-300 text-gray-600 font-semibold py-3.5"
        >
          Voltar
        </button>
        <button
          type="button"
          disabled={!linhasValidas}
          onClick={onNext}
          className="w-2/3 rounded-xl bg-brand-600 disabled:bg-gray-300 text-white font-semibold py-3.5 active:scale-[0.98] transition"
        >
          Avançar
        </button>
      </div>
    </div>
  )
}
