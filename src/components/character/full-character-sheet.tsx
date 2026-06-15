"use client"

import { useState, useMemo } from "react"
import { ATTRIBUTES, attrMod, ORIGINS, CLANS, SPECIALIZATIONS, SKILLS, WEAPONS } from "@/data/system-data"

interface CharState {
  name: string
  playerName: string
  origin: string
  clan: string
  spec: string
  xp: number
  level: number
  attrs: Record<string, number>
  skills: string[]
  weapon: string
  appearance: string
  personality: string
  history: string
}

const DEF = { FOR: 10, DES: 10, CON: 10, INT: 10, SAB: 10, PRE: 10 }

function calcDerived(attrs: Record<string, number>, specName: string, originName: string) {
  const spec = SPECIALIZATIONS.find((s) => s.name === specName)
  const origin = ORIGINS.find((o) => o.name === originName)
  const desPenalty = attrs.DES < 10 ? attrs.DES - 10 : 0

  const armaduraList = spec?.armadura ?? []
  const hasAllArmor = armaduraList.includes("Todas" as never)
  const hasMediumArmor = armaduraList.includes("Média" as never)
  const defesa = 10 + attrMod(attrs.DES) + (hasAllArmor || hasMediumArmor ? Math.max(0, attrMod(attrs.CON)) : 0)
  const atencao = 10 + attrMod(attrs.SAB) + attrMod(attrs.INT)
  const iniciativa = attrMod(attrs.DES) + attrMod(attrs.PRE)

  const basePV = spec ? spec.pvBase + attrMod(attrs.CON) : 10
  const originHpBonus = origin ? origin.hpBonus : 0
  const pv = basePV + originHpBonus + (attrs.CON >= 16 ? 2 : 0) + (attrs.CON >= 18 ? 2 : 0)

  const peBonus = ((spec as { peAttr?: boolean } | undefined)?.peAttr ? attrMod(attrs.INT) : 0)
  const basePE = (spec ? spec.peBase : 2) + Math.max(0, peBonus) + (origin ? origin.peBonus : 0)
  const pe = basePE

  return { defesa, atencao, iniciativa, pv, pe }
}

export function FullCharacterSheet() {
  const [step, setStep] = useState(1)
  const [char, setChar] = useState<CharState>({
    name: "", playerName: "", origin: "", clan: "", spec: "",
    xp: 0, level: 1, attrs: { ...DEF },
    skills: [], weapon: "", appearance: "", personality: "", history: "",
  })

  const update = (field: string, value: unknown) => setChar((prev) => ({ ...prev, [field]: value }))

  const origin = ORIGINS.find((o) => o.name === char.origin)
  const clan = CLANS.find((c) => c.name === char.clan)
  const spec = SPECIALIZATIONS.find((s) => s.name === char.spec)
  const derived = useMemo(() => calcDerived(char.attrs, char.spec, char.origin), [char.attrs, char.spec, char.origin])

  const attrPoints = useMemo(() => {
    let used = 0
    for (const a of ATTRIBUTES) {
      if (char.attrs[a.short] > 10) used += (char.attrs[a.short] - 10) * 2
      else if (char.attrs[a.short] < 10) used += Math.abs(char.attrs[a.short] - 10)
    }
    return 70 - used
  }, [char.attrs])

  const canAdvance = {
    1: char.name.trim().length > 0 && char.origin !== "" && (char.origin !== "Herdado" || char.clan !== ""),
    2: char.spec !== "",
    3: attrPoints >= 0 && Object.values(char.attrs).every((v) => v >= 1 && v <= 20),
    4: true,
  }

  return (
    <div className="space-y-6">
      <div className="flex gap-2 border-b pb-2">
        {["Básico", "Especialização", "Atributos", "Finalizar"].map((label, i) => (
          <button
            key={i}
            onClick={() => setStep(i + 1)}
            className={`px-4 py-2 rounded-t text-sm transition-colors ${
              step === i + 1 ? "bg-yellow-500 text-black font-bold" : "text-yellow-400 hover:text-yellow-300"
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {step === 1 && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-yellow-400">Identidade</h3>
            <div>
              <label className="block text-sm text-zinc-400">Nome do Personagem</label>
              <input
                type="text" value={char.name}
                onChange={(e) => update("name", e.target.value)}
                className="w-full bg-zinc-800 rounded px-3 py-2 text-white border border-zinc-700 focus:border-yellow-500 outline-none"
                placeholder="Ex: Yuji Itadori"
              />
            </div>
            <div>
              <label className="block text-sm text-zinc-400">Nome do Jogador</label>
              <input
                type="text" value={char.playerName}
                onChange={(e) => update("playerName", e.target.value)}
                className="w-full bg-zinc-800 rounded px-3 py-2 text-white border border-zinc-700 focus:border-yellow-500 outline-none"
              />
            </div>
            <div>
              <label className="block text-sm text-zinc-400">Nível</label>
              <div className="flex items-center gap-2">
                <input
                  type="number" min={1} max={20} value={char.level}
                  onChange={(e) => update("level", Math.max(1, Math.min(20, parseInt(e.target.value) || 1)))}
                  className="w-20 bg-zinc-800 rounded px-3 py-2 text-white border border-zinc-700 focus:border-yellow-500 outline-none"
                />
                <span className="text-zinc-500">XP: {char.xp}</span>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-bold text-yellow-400">Origem</h3>
            <select
              value={char.origin}
              onChange={(e) => update("origin", e.target.value)}
              className="w-full bg-zinc-800 rounded px-3 py-2 text-white border border-zinc-700 focus:border-yellow-500 outline-none"
            >
              <option value="">Selecione uma origem</option>
              {ORIGINS.map((o) => (
                <option key={o.name} value={o.name}>{o.name}</option>
              ))}
            </select>
            {origin && (
              <div className="bg-zinc-800/50 rounded p-3 border border-zinc-700 space-y-1 text-sm">
                <p className="text-zinc-300">{origin.desc}</p>
                <p className="text-yellow-400">{origin.bonus}</p>
                {origin.features.map((f, i) => (
                  <p key={i} className="text-green-400 text-xs">◆ {f}</p>
                ))}
              </div>
            )}
            {char.origin === "Herdado" && (
              <>
                <h3 className="text-lg font-bold text-yellow-400 mt-4">Clã</h3>
                <select
                  value={char.clan}
                  onChange={(e) => update("clan", e.target.value)}
                  className="w-full bg-zinc-800 rounded px-3 py-2 text-white border border-zinc-700 focus:border-yellow-500 outline-none"
                >
                  <option value="">Selecione um clã</option>
                  {CLANS.map((c) => (
                    <option key={c.name} value={c.name}>{c.name}</option>
                  ))}
                </select>
                {clan && (
                  <div className="bg-zinc-800/50 rounded p-3 border border-zinc-700 space-y-1 text-sm">
                    <p className="text-zinc-300">{clan.desc}</p>
                    <p className="text-yellow-400">{clan.bonus}</p>
                    {clan.features.map((f, i) => (
                      <p key={i} className="text-green-400 text-xs">◆ {f}</p>
                    ))}
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      )}

      {step === 2 && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {SPECIALIZATIONS.map((s) => {
            const disabled = s.name === "Restringido" && char.origin !== "Restringido"
            const selected = char.spec === s.name
            return (
              <button
                key={s.name}
                onClick={() => !disabled && update("spec", s.name)}
                disabled={disabled}
                className={`text-left p-4 rounded-lg border transition-colors ${
                  disabled ? "opacity-40 cursor-not-allowed border-zinc-800" :
                  selected ? "border-yellow-500 bg-yellow-500/10" : "border-zinc-700 bg-zinc-800/50 hover:border-zinc-500"
                }`}
              >
                <h4 className={`font-bold ${selected ? "text-yellow-400" : "text-white"}`}>{s.name}</h4>
                <p className="text-xs text-zinc-400 mt-1">{s.desc}</p>
                <div className="flex gap-3 mt-2 text-xs text-zinc-500">
                  <span className="text-red-400">PV: {s.pvBase}+CON</span>
                  <span className="text-blue-400">PE: {s.peBase}{s.peAttr ? "+atributo" : ""}</span>
                  <span>Dado: {s.pvDice}</span>
                </div>
                <div className="flex flex-wrap gap-1 mt-2">
                  {s.features.map((f) => (
                    <span key={f} className="text-xs bg-zinc-700 text-green-400 px-2 py-0.5 rounded">{f}</span>
                  ))}
                </div>
              </button>
            )
          })}
          {char.origin === "Restringido" && (
            <p className="text-yellow-400 text-sm col-span-full">Origem Restringido selecionada - apenas a especialização Restringido está disponível.</p>
          )}
        </div>
      )}

      {step === 3 && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold text-yellow-400">Atributos</h3>
            <div className={`text-sm font-bold ${attrPoints >= 0 ? "text-green-400" : "text-red-400"}`}>
              Pontos restantes: {attrPoints}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {ATTRIBUTES.map((attr) => (
              <div key={attr.short} className="bg-zinc-800/50 rounded-lg p-4 border border-zinc-700">
                <div className="flex items-center justify-between mb-2">
                  <div>
                    <span className="text-yellow-400 font-bold">{attr.short}</span>
                    <span className="text-zinc-400 text-sm ml-2">{attr.name}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => char.attrs[attr.short] > 1 && setChar((prev) => ({ ...prev, attrs: { ...prev.attrs, [attr.short]: prev.attrs[attr.short] - 1 } }))}
                      className="w-8 h-8 rounded bg-zinc-700 text-white hover:bg-zinc-600 disabled:opacity-30 font-bold text-lg flex items-center justify-center"
                      disabled={char.attrs[attr.short] <= 1}
                    >-</button>
                    <span className="text-2xl font-bold text-white w-10 text-center">{char.attrs[attr.short]}</span>
                    <button
                      onClick={() => attrPoints > 0 && char.attrs[attr.short] < 20 && setChar((prev) => ({ ...prev, attrs: { ...prev.attrs, [attr.short]: prev.attrs[attr.short] + 1 } }))}
                      className="w-8 h-8 rounded bg-zinc-700 text-white hover:bg-zinc-600 disabled:opacity-30 font-bold text-lg flex items-center justify-center"
                      disabled={attrPoints <= 0 || char.attrs[attr.short] >= 20}
                    >+</button>
                  </div>
                </div>
                <div className="flex justify-between text-xs text-zinc-500">
                  <span>Mod: {attrMod(char.attrs[attr.short]) >= 0 ? "+" : ""}{attrMod(char.attrs[attr.short])}</span>
                  <span>{attr.desc}</span>
                </div>
              </div>
            ))}
          </div>

          {attrPoints > 0 && (
            <p className="text-yellow-400 text-sm">Você ainda tem {attrPoints} pontos de atributo para distribuir.</p>
          )}
          {Object.values(char.attrs).some((v) => v > 18) && (
            <p className="text-red-400 text-sm">Atributos acima de 18 são considerados de elite e podem exigir justificativa narrativa.</p>
          )}
        </div>
      )}

      {step === 4 && (
        <div className="space-y-6">
          <h3 className="text-lg font-bold text-yellow-400">Ficha Completa</h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-zinc-800/50 rounded-lg p-4 border border-zinc-700 text-center">
              <span className="text-zinc-400 text-sm">PV</span>
              <div className="text-3xl font-bold text-red-400">{derived.pv}</div>
            </div>
            <div className="bg-zinc-800/50 rounded-lg p-4 border border-zinc-700 text-center">
              <span className="text-zinc-400 text-sm">PE</span>
              <div className="text-3xl font-bold text-blue-400">{derived.pe}</div>
            </div>
            <div className="bg-zinc-800/50 rounded-lg p-4 border border-zinc-700 text-center">
              <span className="text-zinc-400 text-sm">Defesa</span>
              <div className="text-3xl font-bold text-yellow-400">{derived.defesa}</div>
            </div>
            <div className="bg-zinc-800/50 rounded-lg p-4 border border-zinc-700 text-center">
              <span className="text-zinc-400 text-sm">Atenção</span>
              <div className="text-3xl font-bold text-yellow-400">{derived.atencao}</div>
            </div>
            <div className="bg-zinc-800/50 rounded-lg p-4 border border-zinc-700 text-center">
              <span className="text-zinc-400 text-sm">Iniciativa</span>
              <div className="text-3xl font-bold text-green-400">{derived.iniciativa >= 0 ? "+" : ""}{derived.iniciativa}</div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="bg-zinc-800/50 rounded-lg p-4 border border-zinc-700">
                <h4 className="text-yellow-400 font-bold mb-2">Atributos</h4>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  {ATTRIBUTES.map((a) => (
                    <div key={a.short} className="flex justify-between">
                      <span className="text-zinc-400">{a.short}</span>
                      <span className="text-white font-bold">{char.attrs[a.short]} ({attrMod(char.attrs[a.short]) >= 0 ? "+" : ""}{attrMod(char.attrs[a.short])})</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-zinc-800/50 rounded-lg p-4 border border-zinc-700">
                <h4 className="text-yellow-400 font-bold mb-2">Perícias</h4>
                <select
                  value=""
                  onChange={(e) => {
                    const skill = e.target.value
                    if (skill && !char.skills.includes(skill)) {
                      update("skills", [...char.skills, skill])
                    }
                  }}
                  className="w-full bg-zinc-700 rounded px-2 py-1 text-sm mb-2"
                >
                  <option value="">Selecionar perícia</option>
                  {SKILLS.filter((s) => !char.skills.includes(s)).map((s) => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
                <div className="flex flex-wrap gap-1">
                  {char.skills.map((s) => (
                    <span key={s} className="text-xs bg-zinc-700 text-green-400 px-2 py-0.5 rounded-full flex items-center gap-1">
                      {s}
                      <button onClick={() => setChar((p) => ({ ...p, skills: p.skills.filter((x) => x !== s) }))} className="text-red-400 hover:text-red-300">×</button>
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="bg-zinc-800/50 rounded-lg p-4 border border-zinc-700">
                <h4 className="text-yellow-400 font-bold mb-2">Equipamento</h4>
                <select
                  value={char.weapon}
                  onChange={(e) => update("weapon", e.target.value)}
                  className="w-full bg-zinc-700 rounded px-2 py-1 text-sm mb-2"
                >
                  <option value="">Selecionar arma</option>
                  {WEAPONS.map((w) => (
                    <option key={w.name} value={w.name}>
                      {w.name} ({w.damage} {w.type}) - {w.tier}
                    </option>
                  ))}
                </select>
                {char.weapon && (
                  <div className="bg-zinc-900/50 rounded p-2 mt-2">
                    <p className="text-xs text-zinc-400">{WEAPONS.find((w) => w.name === char.weapon)?.properties.join(", ")}</p>
                  </div>
                )}
              </div>

              <div className="bg-zinc-800/50 rounded-lg p-4 border border-zinc-700">
                <h4 className="text-yellow-400 font-bold mb-2">História & Aparência</h4>
                <textarea
                  placeholder="Aparência"
                  value={char.appearance}
                  onChange={(e) => update("appearance", e.target.value)}
                  className="w-full bg-zinc-700 rounded px-2 py-1 text-sm mb-2 resize-none h-16"
                />
                <textarea
                  placeholder="Personalidade"
                  value={char.personality}
                  onChange={(e) => update("personality", e.target.value)}
                  className="w-full bg-zinc-700 rounded px-2 py-1 text-sm mb-2 resize-none h-16"
                />
                <textarea
                  placeholder="História"
                  value={char.history}
                  onChange={(e) => update("history", e.target.value)}
                  className="w-full bg-zinc-700 rounded px-2 py-1 text-sm resize-none h-16"
                />
              </div>
            </div>
          </div>

          <button className="w-full bg-yellow-500 hover:bg-yellow-400 text-black font-bold py-3 rounded-lg transition-colors">
            Salvar Ficha
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
          onClick={() => setStep(Math.min(4, step + 1))}
          disabled={!canAdvance[step as keyof typeof canAdvance]}
          className="px-4 py-2 bg-yellow-500 hover:bg-yellow-400 disabled:opacity-30 rounded text-black font-bold transition-colors"
        >
          {step === 4 ? "Finalizado" : "Próximo"}
        </button>
      </div>
    </div>
  )
}
