"use client";
import { useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Dices, Plus, RotateCcw, History, Trash2 } from "lucide-react";

type DiceRoll = {
  id: string;
  label: string;
  formula: string;
  result: number;
  details: number[];
  timestamp: Date;
};

function rollDice(formula: string): { total: number; details: number[] } {
  const match = formula.match(/^(\d*)d(\d+)([+-]\d+)?$/i);
  if (!match) return { total: 0, details: [] };

  const count = parseInt(match[1] || "1", 10);
  const sides = parseInt(match[2], 10);
  const modifier = parseInt(match[3] || "0", 10);

  const details: number[] = [];
  for (let i = 0; i < count; i++) {
    details.push(Math.floor(Math.random() * sides) + 1);
  }
  const total = details.reduce((a, b) => a + b, 0) + modifier;
  return { total, details };
}

const quickRolls = [
  { label: "d4", formula: "1d4" },
  { label: "d6", formula: "1d6" },
  { label: "d8", formula: "1d8" },
  { label: "d10", formula: "1d10" },
  { label: "d12", formula: "1d12" },
  { label: "d20", formula: "1d20" },
  { label: "d100", formula: "1d100" },
  { label: "2d6", formula: "2d6" },
  { label: "3d6", formula: "3d6" },
  { label: "4d6", formula: "4d6" },
];

const systemRolls = [
  { label: "Teste Habilidade", formula: "1d20", desc: "d20 + modificador" },
  { label: "Dano Arma Leve", formula: "1d6", desc: "Arma de 1 mão" },
  { label: "Dano Arma Pesada", formula: "2d6", desc: "Arma de 2 mãos" },
  { label: "Dano Arma Mágica", formula: "3d6", desc: "Nível 3+" },
  { label: "Dano Crítico", formula: "4d6", desc: "Acerto crítico" },
  { label: "Cura Básica", formula: "1d8", desc: "Poção ou magia" },
];

export function DiceRoller() {
  const [customFormula, setCustomFormula] = useState("1d20");
  const [rolls, setRolls] = useState<DiceRoll[]>([]);
  const [lastRoll, setLastRoll] = useState<DiceRoll | null>(null);
  const [view, setView] = useState<"quick" | "system">("quick");

  const doRoll = useCallback((formula: string, label: string) => {
    const { total, details } = rollDice(formula);
    const roll: DiceRoll = {
      id: Date.now().toString(),
      label,
      formula,
      result: total,
      details,
      timestamp: new Date(),
    };
    setLastRoll(roll);
    setRolls((prev) => [roll, ...prev].slice(0, 50));
  }, []);

  const clearHistory = () => {
    setRolls([]);
    setLastRoll(null);
  };

  const formatDetails = (details: number[]) => {
    return details.map((d, i) => (
      <span
        key={i}
        className={`inline-block w-8 h-8 leading-8 text-center rounded-md mx-0.5 font-bold text-sm ${
          d === (details.length > 0 ? Math.max(...details) : d)
            ? "bg-green-500/20 text-green-600"
            : "bg-muted"
        }`}
      >
        {d}
      </span>
    ));
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Dices className="h-5 w-5 text-primary" />
            Rolo de Dados
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {lastRoll && (
            <div className="rounded-lg border-2 border-primary/20 bg-primary/5 p-6 text-center space-y-3">
              <p className="text-sm text-muted-foreground">{lastRoll.label}</p>
              <p className="text-5xl font-bold text-primary">{lastRoll.result}</p>
              <div className="flex justify-center gap-1">
                {formatDetails(lastRoll.details)}
              </div>
              <p className="text-xs text-muted-foreground">
                {lastRoll.formula}
                {lastRoll.details.length > 1 &&
                  ` = ${lastRoll.details.join(" + ")}`}
              </p>
            </div>
          )}

          <Tabs value={view} onValueChange={(v) => setView(v as any)}>
            <TabsList className="grid grid-cols-2">
              <TabsTrigger value="quick">Rápidos</TabsTrigger>
              <TabsTrigger value="system">Sistema F&M</TabsTrigger>
            </TabsList>
            <TabsContent value="quick" className="pt-4">
              <div className="grid grid-cols-5 gap-2">
                {quickRolls.map((r) => (
                  <Button
                    key={r.formula}
                    variant="outline"
                    className="h-14 text-lg font-bold"
                    onClick={() => doRoll(r.formula, r.label)}
                  >
                    {r.label}
                  </Button>
                ))}
              </div>
            </TabsContent>
            <TabsContent value="system" className="pt-4">
              <div className="grid grid-cols-2 gap-2">
                {systemRolls.map((r) => (
                  <Button
                    key={r.label}
                    variant="outline"
                    className="h-16 flex-col gap-0.5"
                    onClick={() => doRoll(r.formula, r.label)}
                  >
                    <span className="text-base font-bold">{r.label}</span>
                    <span className="text-xs text-muted-foreground">{r.desc}</span>
                  </Button>
                ))}
              </div>
            </TabsContent>
          </Tabs>

          <div className="flex gap-2 pt-2">
            <input
              type="text"
              value={customFormula}
              onChange={(e) => setCustomFormula(e.target.value)}
              placeholder="ex: 2d6+3"
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            />
            <Button onClick={() => doRoll(customFormula, customFormula)}>
              <Plus className="mr-2 h-4 w-4" />
              Rolar
            </Button>
          </div>
        </CardContent>
      </Card>

      {rolls.length > 0 && (
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-base flex items-center gap-2">
              <History className="h-4 w-4" />
              Histórico
            </CardTitle>
            <Button variant="ghost" size="sm" onClick={clearHistory}>
              <Trash2 className="h-4 w-4" />
            </Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 max-h-60 overflow-y-auto">
              {rolls.map((roll) => (
                <div
                  key={roll.id}
                  className="flex items-center justify-between rounded-lg border border-border p-2.5 text-sm"
                >
                  <div className="flex items-center gap-2">
                    <span className="font-medium">{roll.label}</span>
                    <span className="text-xs text-muted-foreground">
                      ({roll.formula})
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="flex gap-0.5">
                      {roll.details.map((d, i) => (
                        <span
                          key={i}
                          className="text-xs text-muted-foreground"
                        >
                          {d}
                          {i < roll.details.length - 1 ? ", " : ""}
                        </span>
                      ))}
                    </div>
                    <Badge variant="secondary" className="text-sm font-bold">
                      {roll.result}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}