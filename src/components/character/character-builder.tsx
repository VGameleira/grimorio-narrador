"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  ChevronLeft,
  ChevronRight,
  Check,
  User,
  Shield,
  Wand2,
  Sparkles,
  Download,
} from "lucide-react";

const races = [
  { name: "Humano", bonus: "+1 em dois atributos", skills: "Versátil" },
  { name: "Elfo", bonus: "+2 Destreza, -2 Constituição", skills: "Visão Noturna, Percepção" },
  { name: "Anão", bonus: "+2 Constituição, -2 Carisma", skills: "Resistência a Veneno" },
  { name: "Meio-Orc", bonus: "+2 Força, -2 Inteligência", skills: "Visão Escura, Intimidação" },
  { name: "Halfling", bonus: "+2 Destreza", skills: "Sortudo, Furtividade" },
  { name: "Gnomo", bonus: "+2 Inteligência", skills: "Engenhoso, Ilusões Menores" },
];

const classes = [
  { name: "Guerreiro", desc: "Especialista em combate corpo a corpo", pm: 0, pv: 12 },
  { name: "Mago", desc: "Usuário de magia arcana poderosa", pm: 12, pv: 6 },
  { name: "Ladino", desc: "Mestre em furtividade e ataques furtivos", pm: 4, pv: 8 },
  { name: "Clérigo", desc: "Canalizador de poder divino", pm: 8, pv: 10 },
  { name: "Caçador", desc: "Rastreador e combatente à distância", pm: 4, pv: 10 },
  { name: "Bardo", desc: "Inspira e manipula com música e palavras", pm: 8, pv: 8 },
];

const attributes = [
  { name: "Força", short: "FOR", desc: "Ataques corpo a corpo, carga" },
  { name: "Destreza", short: "DES", desc: "Ataques à distância, furtividade" },
  { name: "Constituição", short: "CON", desc: "Vida, resistência" },
  { name: "Inteligência", short: "INT", desc: "Magia arcana, conhecimento" },
  { name: "Sabedoria", short: "SAB", desc: "Percepção, magia divina" },
  { name: "Carisma", short: "CAR", desc: "Persuasão, intimidação" },
];

type StepProps = {
  step: number;
  total: number;
  children: React.ReactNode;
  onNext: () => void;
  onPrev: () => void;
  canNext: boolean;
};

function Step({ step, total, children, onNext, onPrev, canNext }: StepProps) {
  return (
    <div className="space-y-6">
      <Progress value={(step / total) * 100} className="h-2" />
      <div className="flex items-center justify-between text-sm text-muted-foreground">
        <span>
          Passo {step} de {total}
        </span>
        <span>{Math.round((step / total) * 100)}%</span>
      </div>
      {children}
      <div className="flex justify-between pt-4">
        <Button variant="outline" onClick={onPrev} disabled={step === 1}>
          <ChevronLeft className="mr-2 h-4 w-4" /> Anterior
        </Button>
        <Button onClick={onNext} disabled={!canNext}>
          {step === total ? (
            <>
              Finalizar <Check className="ml-2 h-4 w-4" />
            </>
          ) : (
            <>
              Próximo <ChevronRight className="ml-2 h-4 w-4" />
            </>
          )}
        </Button>
      </div>
    </div>
  );
}

export function CharacterBuilder() {
  const [step, setStep] = useState(1);
  const [name, setName] = useState("");
  const [race, setRace] = useState("");
  const [charClass, setCharClass] = useState("");
  const [attrPoints, setAttrPoints] = useState(70);
  const [attrs, setAttrs] = useState({ Força: 8, Destreza: 8, Constituição: 8, Inteligência: 8, Sabedoria: 8, Carisma: 8 });
  const [completed, setCompleted] = useState(false);

  const updateAttr = (attr: string, delta: number) => {
    const current = attrs[attr as keyof typeof attrs];
    if (delta > 0 && attrPoints <= 0) return;
    if (delta > 0 && current >= 18) return;
    if (delta < 0 && current <= 8) return;
    setAttrs({ ...attrs, [attr]: current + delta });
    setAttrPoints(attrPoints - delta);
  };

  const selectedClass = classes.find((c) => c.name === charClass);
  const totalPv = selectedClass ? selectedClass.pv + Math.floor((attrs.Constituição - 10) / 2) : 0;
  const totalPm = selectedClass ? selectedClass.pm + Math.floor((attrs.Inteligência - 10) / 2) : 0;

  function handleFinish() {
    setCompleted(true);
    setStep(5);
  }

  if (completed) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Check className="h-5 w-5 text-green-500" />
            Personagem Criado!
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="rounded-lg border-2 border-green-500/20 bg-green-500/5 p-6 text-center space-y-2">
            <p className="text-2xl font-bold">{name}</p>
            <div className="flex justify-center gap-2">
              <Badge>{race}</Badge>
              <Badge variant="secondary">{charClass}</Badge>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-2">
            {attributes.map((a) => (
              <div key={a.name} className="rounded-lg border border-border p-3 text-center">
                <p className="text-xs text-muted-foreground">{a.short}</p>
                <p className="text-2xl font-bold">{attrs[a.name as keyof typeof attrs]}</p>
              </div>
            ))}
          </div>
          <div className="flex gap-4 justify-center">
            <div className="text-center">
              <p className="text-sm text-muted-foreground">PV Máximo</p>
              <p className="text-xl font-bold text-green-600">{totalPv}</p>
            </div>
            <div className="text-center">
              <p className="text-sm text-muted-foreground">PM Máximo</p>
              <p className="text-xl font-bold text-blue-600">{totalPm}</p>
            </div>
          </div>
          <Button
            variant="outline"
            className="w-full"
            onClick={() => window.print()}
          >
            <Download className="mr-2 h-4 w-4" /> Exportar Ficha
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          {step === 1 && <User className="h-5 w-5 text-primary" />}
          {step === 2 && <Shield className="h-5 w-5 text-primary" />}
          {step === 3 && <Wand2 className="h-5 w-5 text-primary" />}
          {step === 4 && <Sparkles className="h-5 w-5 text-primary" />}
          {step === 1 && "Identidade"}
          {step === 2 && "Raça & Classe"}
          {step === 3 && "Atributos"}
          {step === 4 && "Revisão Final"}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Step
          step={step}
          total={4}
          onNext={() => setStep(step + 1)}
          onPrev={() => setStep(step - 1)}
          canNext={
            (step === 1 && name.length >= 2) ||
            (step === 2 && race !== "" && charClass !== "") ||
            (step === 3 && attrPoints === 0) ||
            step === 4
          }
        >
          {step === 1 && (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="char-name">Nome do Personagem</Label>
                <Input
                  id="char-name"
                  placeholder="Ex: Aris, Thorne, Lyra..."
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-6">
              <div className="space-y-3">
                <Label>Raça</Label>
                <div className="grid grid-cols-2 gap-2">
                  {races.map((r) => (
                    <Button
                      key={r.name}
                      variant={race === r.name ? "default" : "outline"}
                      className="h-auto flex-col py-3"
                      onClick={() => setRace(r.name)}
                    >
                      <span className="font-semibold">{r.name}</span>
                      <span className="text-xs text-muted-foreground mt-1">{r.bonus}</span>
                    </Button>
                  ))}
                </div>
              </div>

              <div className="space-y-3">
                <Label>Classe</Label>
                <div className="grid grid-cols-2 gap-2">
                  {classes.map((c) => (
                    <Button
                      key={c.name}
                      variant={charClass === c.name ? "default" : "outline"}
                      className="h-auto flex-col py-3"
                      onClick={() => setCharClass(c.name)}
                    >
                      <span className="font-semibold">{c.name}</span>
                      <span className="text-xs text-muted-foreground mt-1">{c.desc}</span>
                    </Button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-4">
              <div className="text-center">
                <p className="text-sm text-muted-foreground">
                  Pontos restantes:{" "}
                  <span className="font-bold text-lg text-primary">{attrPoints}</span>
                </p>
              </div>
              <div className="grid grid-cols-2 gap-3">
                {attributes.map((a) => (
                  <div
                    key={a.name}
                    className="rounded-lg border border-border p-3 flex items-center justify-between"
                  >
                    <div>
                      <p className="font-medium">{a.short}</p>
                      <p className="text-xs text-muted-foreground">{a.desc}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => updateAttr(a.name, -1)}
                      >
                        -
                      </Button>
                      <span className="w-8 text-center font-bold text-lg">
                        {attrs[a.name as keyof typeof attrs]}
                      </span>
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => updateAttr(a.name, 1)}
                        disabled={attrPoints <= 0}
                      >
                        +
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {step === 4 && (
            <div className="space-y-4">
              <div className="rounded-lg bg-muted/50 p-4 space-y-3">
                <div className="flex justify-between items-center">
                  <span className="font-medium">{name}</span>
                  <div className="flex gap-1">
                    <Badge>{race}</Badge>
                    <Badge variant="secondary">{charClass}</Badge>
                  </div>
                </div>
                <div className="grid grid-cols-6 gap-1">
                  {attributes.map((a) => (
                    <div key={a.name} className="text-center">
                      <p className="text-xs text-muted-foreground">{a.short}</p>
                      <p className="font-bold">{attrs[a.name as keyof typeof attrs]}</p>
                    </div>
                  ))}
                </div>
                <div className="flex justify-center gap-6 text-sm">
                  <span>
                    PV: <strong className="text-green-600">{totalPv}</strong>
                  </span>
                  <span>
                    PM: <strong className="text-blue-600">{totalPm}</strong>
                  </span>
                </div>
              </div>
              <Button className="w-full" size="lg" onClick={handleFinish}>
                <Check className="mr-2 h-5 w-5" /> Finalizar Personagem
              </Button>
            </div>
          )}
        </Step>
      </CardContent>
    </Card>
  );
}