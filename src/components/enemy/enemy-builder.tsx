"use client"

import { useState, useMemo } from "react"
import { ATTRIBUTES, attrMod, PATAMARES, ENEMY_TYPES, getTrainingBonus, SKILLS, WEAPONS } from "@/data/system-data"

interface EnemyState {
  name: string
  nd: number
  patamar: string
  type: string
  intentions: string
  originName: string
  attrs: Record<string, number>
  skills: string[]
  weapons: string[]
  techniques: string[]
  notes: string
  hpMult: number
  peMult: number
}

const DEF_ENEMY = { FOR: 10, DES: 10, CON: 10, INT: 10, SAB: 10, PRE: 10 }

export function EnemyBuilder() {
  const [step, setStep] = useState(1)
  const [enemy, setEnemy] = useState<EnemyState>({
    name: "", nd: 1, patamar: "Comum", type: "", intentions: "", originName: "",
    attrs: { ...DEF_ENEMY }, skills: [], weapons: [],
    techniques: [], notes: "", hpMult: 1, peMult: 1,
  })

  const update = <K extends keyof EnemyState>(field: K, value: EnemyState[K]) =>
    setEnemy((prev) => ({ ...prev, [field]: value }))

  const patamarData = PATAMARES.find((p) => p.name === enemy.patamar) || PATAMARES[2]
  const typeData = ENEMY_TYPES.find((t) => t.name === enemy.type)
  const tb = getTrainingBonus(enemy.nd)
  const totalAttr = Object.values(enemy.attrs).reduce((a, b) => a + b, 0)
  const attrBudget = 60 + enemy.nd * 3

  const derived = useMemo(() => {
    const hp = Math.floor((12 + attrMod(enemy.attrs.CON) * 2 + enemy.nd * 2) * patamarData.hpMult)
    const pe = Math.floor((4 + enemy.nd) * patamarData.peMult)
    const defesa = 10 + attrMod(enemy.attrs.DES)
    const atencao = 10 + attrMod(enemy.attrs.SAB)
    const iniciativa = attrMod(enemy.attrs.DES)
    return { hp, pe, defesa, atencao, iniciativa }
  }, [enemy.attrs, enemy.nd, patamarData])

  const canAdvance = {
    1: enemy.name.trim() !== "" && enemy.type !== "" && enemy.patamar !== "",
    2: totalAttr <= attrBudget + 10,
    3: true,
  }

  return (
    <div className="space-y-6">
      <div className="flex gap-2 border-b pb-2">
        {["Identidade", "Atributos", "Habilidades"].map((label, i) => (
          <button
            key={i}
            onClick={() => setStep(i + 1)}
            className={`px-4 py-2 rounded-t text-sm transition-colors ${
              step === i + 1 ? "bg-red-500 text-black font-bold" : "text-red-400 hover:text-red-300"
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {step === 1 && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-red-400">Identidade</h3>
            <div>
              <label className="block text-sm text-zinc-400">Nome do Inimigo</label>
              <input
                type="text" value={enemy.name}
                onChange={(e) => update("name", e.target.value)}
                className="w-full bg-zinc-800 rounded px-3 py-2 text-white border border-zinc-700 focus:border-red-500 outline-none"
                placeholder="Ex: Sukuna, Jogo, Mahito..."
              />
            </div>
            <div>
              <label className="block text-sm text-zinc-400">ND (Nível de Desafio)</label>
              <input
                type="number" min={1} max={30} value={enemy.nd}
                onChange={(e) => update("nd", Math.max(1, Math.min(30, parseInt(e.target.value) || 1)))}
                className="w-full bg-zinc-800 rounded px-3 py-2 text-white border border-zinc-700 focus:border-red-500 outline-none"
              />
              <div className="flex justify-between mt-1 text-xs text-zinc-500">
                <span>Bônus de Treinamento: +{tb}</span>
                <span>Orçamento de Atributos: {attrBudget}</span>
              </div>
            </div>
            <div>
              <label className="block text-sm text-zinc-400">Patamar</label>
              <select
                value={enemy.patamar}
                onChange={(e) => update("patamar", e.target.value)}
                className="w-full bg-zinc-800 rounded px-3 py-2 text-white border border-zinc-700 focus:border-red-500 outline-none"
              >
                {PATAMARES.map((p) => (
                  <option key={p.name} value={p.name}>
                    {p.name} - {p.difficulty} ({p.players} jogadores)
                  </option>
                ))}
              </select>
              <div className="mt-1 text-xs text-zinc-500">
                Multiplicadores: PV ×{patamarData.hpMult}, PE ×{patamarData.peMult}
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-bold text-red-400">Tipo</h3>
            <select
              value={enemy.type}
              onChange={(e) => update("type", e.target.value)}
              className="w-full bg-zinc-800 rounded px-3 py-2 text-white border border-zinc-700 focus:border-red-500 outline-none"
            >
              <option value="">Selecione o tipo</option>
              {ENEMY_TYPES.map((t) => (
                <option key={t.name} value={t.name}>{t.name}</option>
              ))}
            </select>
            {typeData && (
              <div className="bg-zinc-800/50 rounded p-3 border border-zinc-700 space-y-1 text-sm">
                <p className="text-zinc-300">{typeData.desc}</p>
                <p className="text-yellow-400">Bônus: {typeData.bonus}</p>
                {typeData.features.map((f, i) => (
                  <p key={i} className="text-green-400 text-xs">◆ {f}</p>
                ))}
              </div>
            )}
            <div>
              <label className="block text-sm text-zinc-400">Intenção / Motivação</label>
              <input
                type="text" value={enemy.intentions}
                onChange={(e) => update("intentions", e.target.value)}
                className="w-full bg-zinc-800 rounded px-3 py-2 text-white border border-zinc-700 focus:border-red-500 outline-none"
                placeholder="Ex: Destruir humanos, coletar dedos..."
              />
            </div>
          </div>
        </div>
      )}

      {step === 2 && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold text-red-400">Atributos</h3>
            <div className={`text-sm font-bold ${totalAttr <= attrBudget + 10 ? "text-green-400" : "text-red-400"}`}>
              Total: {totalAttr} / {attrBudget + 10}
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {ATTRIBUTES.map((attr) => (
              <div key={attr.short} className="bg-zinc-800/50 rounded-lg p-4 border border-zinc-700">
                <div className="flex items-center justify-between mb-2">
                  <div>
                    <span className="text-red-400 font-bold">{attr.short}</span>
                    <span className="text-zinc-400 text-sm ml-2">{attr.name}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => enemy.attrs[attr.short] > 1 && setEnemy((prev) => ({ ...prev, attrs: { ...prev.attrs, [attr.short]: prev.attrs[attr.short] - 1 } }))}
                      className="w-8 h-8 rounded bg-zinc-700 text-white hover:bg-zinc-600 disabled:opacity-30 font-bold text-lg flex items-center justify-center"
                      disabled={enemy.attrs[attr.short] <= 1}
                    >-</button>
                    <span className="text-2xl font-bold text-white w-10 text-center">{enemy.attrs[attr.short]}</span>
                    <button
                      onClick={() => enemy.attrs[attr.short] < 25 && setEnemy((prev) => ({ ...prev, attrs: { ...prev.attrs, [attr.short]: prev.attrs[attr.short] + 1 } }))}
                      className="w-8 h-8 rounded bg-zinc-700 text-white hover:bg-zinc-600 disabled:opacity-30 font-bold text-lg flex items-center justify-center"
                      disabled={enemy.attrs[attr.short] >= 25}
                    >+</button>
                  </div>
                </div>
                <div className="text-xs text-zinc-500">
                  Mod: {attrMod(enemy.attrs[attr.short]) >= 0 ? "+" : ""}{attrMod(enemy.attrs[attr.short])}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {step === 3 && (
        <div className="space-y-6">
          <h3 className="text-lg font-bold text-red-400">Ficha do Inimigo</h3>

          <div className="bg-zinc-900/50 rounded-lg p-6 border border-red-900/50">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-2xl font-bold text-white">{enemy.name}</h2>
                <p className="text-zinc-400 text-sm">
                  {enemy.type} · ND {enemy.nd} · {enemy.patamar}
                </p>
              </div>
              <div className="text-right">
                <div className="text-3xl font-bold text-red-400">{derived.hp}</div>
                <div className="text-xs text-zinc-500">PV</div>
                <div className="text-xl font-bold text-blue-400">{derived.pe}</div>
                <div className="text-xs text-zinc-500">PE</div>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3 mb-4">
              <div className="bg-zinc-800/50 rounded p-2 text-center">
                <span className="text-xs text-zinc-500">Defesa</span>
                <div className="text-lg font-bold text-yellow-400">{derived.defesa}</div>
              </div>
              <div className="bg-zinc-800/50 rounded p-2 text-center">
                <span className="text-xs text-zinc-500">Atenção</span>
                <div className="text-lg font-bold text-yellow-400">{derived.atencao}</div>
              </div>
              <div className="bg-zinc-800/50 rounded p-2 text-center">
                <span className="text-xs text-zinc-500">Iniciativa</span>
                <div className="text-lg font-bold text-green-400">{derived.iniciativa >= 0 ? "+" : ""}{derived.iniciativa}</div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <h4 className="text-red-400 font-bold mb-2">Atributos</h4>
                {ATTRIBUTES.map((a) => (
                  <div key={a.short} className="flex justify-between py-0.5">
                    <span className="text-zinc-400">{a.short}</span>
                    <span className="text-white">{enemy.attrs[a.short]} ({attrMod(enemy.attrs[a.short]) >= 0 ? "+" : ""}{attrMod(enemy.attrs[a.short])})</span>
                  </div>
                ))}
              </div>
              <div>
                <h4 className="text-red-400 font-bold mb-2">Perícias</h4>
                <div className="flex flex-wrap gap-1">
                  <button
                    onClick={() => {
                      const s = prompt("Nome da perícia:")
                      if (s && !enemy.skills.includes(s)) update("skills", [...enemy.skills, s])
                    }}
                    className="text-xs bg-red-900/30 text-red-400 px-2 py-0.5 rounded border border-red-900 hover:bg-red-900/50"
                  >
                    + Adicionar
                  </button>
                  {enemy.skills.map((s) => (
                    <span key={s} className="text-xs bg-zinc-700 text-green-400 px-2 py-0.5 rounded-full flex items-center gap-1">
                      {s} +{tb}
                      <button onClick={() => update("skills", enemy.skills.filter((x) => x !== s))} className="text-red-400">×</button>
                    </span>
                  ))}
                </div>

                <h4 className="text-red-400 font-bold mt-4 mb-2">Técnicas</h4>
                <div className="flex flex-wrap gap-1">
                  <button
                    onClick={() => {
                      const t = prompt("Nome da técnica:")
                      if (t) update("techniques", [...enemy.techniques, t])
                    }}
                    className="text-xs bg-red-900/30 text-red-400 px-2 py-0.5 rounded border border-red-900 hover:bg-red-900/50"
                  >
                    + Adicionar
                  </button>
                  {enemy.techniques.map((t, i) => (
                    <span key={i} className="text-xs bg-zinc-700 text-purple-400 px-2 py-0.5 rounded-full flex items-center gap-1">
                      {t}
                      <button onClick={() => update("techniques", enemy.techniques.filter((_, j) => j !== i))} className="text-red-400">×</button>
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {enemy.intentions && (
              <div className="mt-4 text-xs text-zinc-500 border-t border-zinc-700 pt-3">
                Motivação: {enemy.intentions}
              </div>
            )}
          </div>

          <button className="w-full bg-red-500 hover:bg-red-400 text-black font-bold py-3 rounded-lg transition-colors">
            Salvar Inimigo
          </button>
        </div>
      )}

      <div className="flex justify-between pt-4 border-t border-zinc-700">
        <button
          onClick={() => setStep(Math.max(1, step - 1))}
          disabled={step === 1}
          className="px-4 py-2 bg-zinc-700 hover:bg-zinc-600 disabled:opacity-30 rounded text-white transition-colors"
        >
          Anterior
        </button>
        <button
          onClick={() => setStep(Math.min(3, step + 1))}
          disabled={!canAdvance[step as keyof typeof canAdvance]}
          className="px-4 py-2 bg-red-500 hover:bg-red-400 disabled:opacity-30 rounded text-black font-bold transition-colors"
        >
          {step === 3 ? "Finalizado" : "Próximo"}
        </button>
      </div>
    </div>
  )
}
