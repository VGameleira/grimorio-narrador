"use client"

import { useState, useMemo } from "react"
import { FULL_CURSES, type CurseGrade, type CurseType } from "./full-curse-database"

const GRADES: CurseGrade[] = ["Grau 4", "Grau 3", "Grau 2", "Grau 1", "Grau Especial", "Maldição de Dispersão"]
const TYPES: CurseType[] = ["Natural", "Medo", "Vingativa", "Artificial", "Híbrida", "Ancestral", "Conceitual"]

const GRADE_ORDER: Record<CurseGrade, number> = {
  "Grau 4": 1, "Grau 3": 2, "Grau 2": 3, "Grau 1": 4,
  "Grau Especial": 5, "Maldição de Dispersão": 6,
}

export function EnhancedGrimoireViewer() {
  const [search, setSearch] = useState("")
  const [gradeFilter, setGradeFilter] = useState<CurseGrade | "">("")
  const [typeFilter, setTypeFilter] = useState<CurseType | "">("")
  const [expanded, setExpanded] = useState<string | null>(null)

  const filtered = useMemo(() => {
    return FULL_CURSES.filter((c) => {
      if (search && !c.name.toLowerCase().includes(search.toLowerCase()) && !c.effect.toLowerCase().includes(search.toLowerCase())) return false
      if (gradeFilter && c.grade !== gradeFilter) return false
      if (typeFilter && c.type !== typeFilter) return false
      return true
    }).sort((a, b) => GRADE_ORDER[a.grade] - GRADE_ORDER[b.grade] || a.name.localeCompare(b.name))
  }, [search, gradeFilter, typeFilter])

  const randomCurse = () => {
    const c = FULL_CURSES[Math.floor(Math.random() * FULL_CURSES.length)]
    setExpanded(c.name)
    setSearch("")
    setGradeFilter("")
    setTypeFilter("")
  }

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
        <input
          type="text"
          placeholder="Buscar maldição ou efeito..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="bg-zinc-800 rounded px-3 py-2 text-white border border-zinc-700 focus:border-yellow-500 outline-none md:col-span-2"
        />
        <select
          value={gradeFilter}
          onChange={(e) => setGradeFilter(e.target.value as CurseGrade | "")}
          className="bg-zinc-800 rounded px-3 py-2 text-white border border-zinc-700 focus:border-yellow-500 outline-none"
        >
          <option value="">Todos os Graus</option>
          {GRADES.map((g) => (
            <option key={g} value={g}>{g}</option>
          ))}
        </select>
        <select
          value={typeFilter}
          onChange={(e) => setTypeFilter(e.target.value as CurseType | "")}
          className="bg-zinc-800 rounded px-3 py-2 text-white border border-zinc-700 focus:border-yellow-500 outline-none"
        >
          <option value="">Todos os Tipos</option>
          {TYPES.map((t) => (
            <option key={t} value={t}>{t}</option>
          ))}
        </select>
      </div>

      <button
        onClick={randomCurse}
        className="w-full bg-purple-600 hover:bg-purple-500 text-white font-bold py-2 rounded transition-colors text-sm"
      >
        Sortear Maldição Aleatória
      </button>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {filtered.map((curse) => {
          const isExpanded = expanded === curse.name
          return (
            <div
              key={curse.name}
              className={`bg-zinc-800/50 rounded-lg border transition-all cursor-pointer ${
                isExpanded ? "border-yellow-500 md:col-span-2" : "border-zinc-700 hover:border-zinc-500"
              }`}
              onClick={() => setExpanded(isExpanded ? null : curse.name)}
            >
              <div className="p-4">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-bold text-white">{curse.name}</h3>
                    <div className="flex gap-2 mt-1">
                      <span className={`text-xs px-2 py-0.5 rounded font-medium ${
                        curse.grade === "Grau Especial" ? "bg-red-900/50 text-red-400" :
                        curse.grade === "Grau 1" ? "bg-orange-900/50 text-orange-400" :
                        curse.grade === "Grau 2" ? "bg-yellow-900/50 text-yellow-400" :
                        curse.grade === "Grau 3" ? "bg-green-900/50 text-green-400" :
                        "bg-zinc-700 text-zinc-300"
                      }`}>{curse.grade}</span>
                      <span className="text-xs bg-blue-900/50 text-blue-400 px-2 py-0.5 rounded">{curse.type}</span>
                      <span className="text-xs bg-red-900/30 text-red-400 px-2 py-0.5 rounded">ND {curse.nd}</span>
                    </div>
                  </div>
                </div>
                <p className="text-sm text-zinc-300 mt-2">{curse.effect}</p>

                {isExpanded && (
                  <div className="mt-4 pt-4 border-t border-zinc-700 space-y-3">
                    <div>
                      <h4 className="text-xs text-zinc-500 uppercase tracking-wide">Gatilho</h4>
                      <p className="text-sm text-zinc-200">{curse.trigger}</p>
                    </div>
                    <div>
                      <h4 className="text-xs text-zinc-500 uppercase tracking-wide">Condição de Remoção</h4>
                      <p className="text-sm text-green-400">{curse.breakCondition}</p>
                    </div>
                    <div>
                      <h4 className="text-xs text-zinc-500 uppercase tracking-wide">Origem</h4>
                      <p className="text-sm text-zinc-300">{curse.origin}</p>
                    </div>
                    {curse.sideEffects.length > 0 && (
                      <div>
                        <h4 className="text-xs text-zinc-500 uppercase tracking-wide">Efeitos Colaterais</h4>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {curse.sideEffects.map((s) => (
                            <span key={s} className="text-xs bg-red-900/20 text-red-300 px-2 py-0.5 rounded">{s}</span>
                          ))}
                        </div>
                      </div>
                    )}
                    {curse.techniques && curse.techniques.length > 0 && (
                      <div>
                        <h4 className="text-xs text-zinc-500 uppercase tracking-wide">Técnicas</h4>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {curse.techniques.map((t) => (
                            <span key={t} className="text-xs bg-purple-900/30 text-purple-400 px-2 py-0.5 rounded">{t}</span>
                          ))}
                        </div>
                      </div>
                    )}
                    {curse.domain && (
                      <div>
                        <h4 className="text-xs text-zinc-500 uppercase tracking-wide">Domínio</h4>
                        <p className="text-sm text-red-400">{curse.domain}</p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          )
        })}
        {filtered.length === 0 && (
          <div className="col-span-full text-center py-8 text-zinc-500">Nenhuma maldição encontrada.</div>
        )}
      </div>
    </div>
  )
}
