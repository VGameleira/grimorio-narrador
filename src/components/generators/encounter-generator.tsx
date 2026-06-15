"use client";
import { useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { RefreshCw, Swords, ScrollText } from "lucide-react";

type Encounter = {
  title: string;
  description: string;
  difficulty: string;
  type: string;
  loot?: string;
  threat?: string;
  optionalRule?: string;
};

const encounterTypes = [
  "Combate",
  "Exploração",
  "Social",
  "Armadilha",
  "Evento",
  "Mistério",
  "Maldição",
  "Fadiga",
];

const difficulties = ["Fácil", "Médio", "Difícil", "Desafiador", "Épico"];

const encounterTemplates: Encounter[] = [
  {
    title: "Emboscada na Estrada",
    description: "Os jogadores são surpreendidos por uma emboscada enquanto viajam por uma estrada estreita entre colinas. Atacantes usam o terreno elevado para vantagem. Se o combate passar de 5 rounds, todos ganham 1 nível de fadiga.",
    difficulty: "Médio", type: "Combate",
    loot: "1d6 PO por bandido, possível informação sobre a região",
    threat: "Bandidos humanos (Nv 2)",
    optionalRule: "Fadiga de Combate",
  },
  {
    title: "Templo Antigo",
    description: "Um templo em ruínas guarda segredos e armadilhas. Os jogadores precisam desvendar enigmas e evitar perigos para alcançar a câmara principal. Armadilhas de pressão e jatos de fogo.",
    difficulty: "Difícil", type: "Exploração",
    loot: "Itens mágicos comuns, pergaminhos, 2d10 PO",
    threat: "Armadilhas (CD 15), constructos antigos",
  },
  {
    title: "Negociação Tensa",
    description: "Um encontro diplomático com uma facção rival onde palavras afiadas são tão perigosas quanto espadas. Concessões e ameaças trocam de lado. Um erro pode iniciar uma guerra.",
    difficulty: "Médio", type: "Social",
    loot: "Acordo comercial, informações, aliados",
    threat: "Consequências diplomáticas",
  },
  {
    title: "Fenômeno Misterioso",
    description: "Eventos estranhos assombram uma vila. Testemunhas desaparecem durante a noite e marcas arcanas aparecem nas portas das casas. Uma criatura do plano etéreo está se alimentando de memórias.",
    difficulty: "Médio", type: "Mistério",
    loot: "Artefato arcano, gratidão da vila (2d6 PO)",
    threat: "Espectro faminto (Nv 4)",
    optionalRule: "Ferimentos Críticos",
  },
  {
    title: "Caçada Real",
    description: "Uma criatura lendária foi avistada nas montanhas. Caçadores, mercenários e aventureiros competem para abatê-la primeiro. Quem chegar primeiro leva a recompensa.",
    difficulty: "Desafiador", type: "Combate",
    loot: "Peças da criatura (válidas por 5d10 PO), reputação",
    threat: "Criatura lendária (Nv 6)",
    optionalRule: "Sorte e Azar",
  },
  {
    title: "Ponte Perigosa",
    description: "Uma ponte de corda velha sobre um desfiladeiro profundo. Rachaduras e cordas desfiadas tornam a travessia arriscada. Testes de Destreza CD 12 ou a ponte arrebenta.",
    difficulty: "Fácil", type: "Armadilha",
    threat: "Queda de 30m (3d6 de dano)",
  },
  {
    title: "Feira do Reino",
    description: "Durante um festival, os jogadores precisam participar de provas, investigar desaparecimentos e lidar com a tensão entre as guildas locais. Muitas oportunidades de RP e combate.",
    difficulty: "Médio", type: "Evento",
    loot: "Prêmios das provas, informações, contatos",
    threat: "Larápios, brigas de rua",
    optionalRule: "Treinamento Avançado",
  },
  {
    title: "A Fuga",
    description: "Presos em uma fortaleza inimiga, os jogadores precisam encontrar uma saída enquanto evitam patrulhas e guardas. Cada erro aumenta o alarme e a dificuldade.",
    difficulty: "Difícil", type: "Exploração",
    loot: "Equipamento dos guardas, mapa da fortaleza",
    threat: "Guarda de elite (Nv 5), cães de caça",
    optionalRule: "Fadiga de Combate",
  },
  {
    title: "Culto Secreto",
    description: "Um culto realiza rituais nas sombras da cidade. Os jogadores devem se infiltrar e descobrir seus planos antes que seja tarde. O culto planeja abrir um portal para o plano das sombras.",
    difficulty: "Desafiador", type: "Mistério",
    loot: "Artefatos do culto, grimórios proibidos",
    threat: "Líder do culto (Nv 6), criatura invocada",
    optionalRule: "Sorte e Azar",
  },
  {
    title: "A Fera da Caverna",
    description: "Uma caverna ecoa com rugidos. Uma criatura territorial protege seu ninho cheio de tesouros e ossos de aventureiros anteriores. O chão está coberto de armadilhas naturais.",
    difficulty: "Épico", type: "Combate",
    loot: "Tesouro acumulado (5d10 PO, item mágico raro)",
    threat: "Dragão jovem ou Fera anciã (Nv 8+)",
    optionalRule: "Ferimentos Críticos",
  },
  {
    title: "A Maldição do Bosque",
    description: "Um bosque inteiro foi amaldiçoado. Árvores atacam viajantes, animais falam enigmas e uma névoa faz as pessoas esquecerem quem são. A origem é uma druida traída.",
    difficulty: "Médio", type: "Maldição",
    loot: "Fruto da árvore anciã (cura 2d8+4)",
    threat: "Druida corrompida (Nv 4), árvores animadas",
    optionalRule: "Ferimentos Críticos",
  },
  {
    title: "A Sorte Virada",
    description: "Os jogadores entram em uma área onde a sorte é distorcida. Moedas sempre caem no lado errado, dados dão resultados opostos. Uma entidade do caos está brincando com eles.",
    difficulty: "Fácil", type: "Evento",
    loot: "Moeda da sorte (rerrolar 1x/dia)",
    threat: "Entidade do caos (Nv 3)",
    optionalRule: "Sorte e Azar",
  },
  {
    title: "Treinamento dos Mestres",
    description: "Um mestre oferece treinamento avançado em troca de um favor. Os jogadores precisam completar provas para aprender técnicas especiais. Cada prova testa uma habilidade diferente.",
    difficulty: "Médio", type: "Social",
    loot: "Talento gratuito, perícia nova",
    threat: "Provas de combate e conhecimento",
    optionalRule: "Treinamento Avançado",
  },
  {
    title: "O Ferido na Estrada",
    description: "Um viajante ferido pede ajuda. Pode ser uma armadilha, uma missão legítima ou alguém amaldiçoado. As escolhas dos jogadores determinam o rumo. Curar vs. Desconfiar.",
    difficulty: "Fácil", type: "Social",
    loot: "Recompensa do viajante (1d10 PO) ou emboscada",
    threat: "Possível emboscada",
  },
  {
    title: "Exército de Ossos",
    description: "Um necromante está levantando mortos-vivos em um cemitério antigo. Os jogadores precisam deter o ritual antes que um exército de esqueletos marche sobre a cidade vizinha.",
    difficulty: "Difícil", type: "Combate",
    loot: "Cetro do necromante (item mágico), 3d10 PO",
    threat: "Necromante (Nv 5), esqueletos (Nv 2)",
    optionalRule: "Fadiga de Combate",
  },
  {
    title: "Arena dos Campeões",
    description: "Os jogadores são desafiados a lutar na arena local. Combates em equipe contra campeões de outras regiões. Glória, fama e uma premiação em ouro para os vencedores.",
    difficulty: "Médio", type: "Combate",
    loot: "Prêmio: 5d10 PO + arma da arena",
    threat: "Campeões locais (Nv 3-4)",
    optionalRule: "Ferimentos Críticos",
  },
  {
    title: "Pesadelo Vivo",
    description: "Uma criatura dos sonhos está invadindo os pesadelos dos habitantes. As vítimas acordam exaustas com níveis de fadiga reais. Os jogadores precisam entrar no mundo dos sonhos para enfrentá-la.",
    difficulty: "Desafiador", type: "Maldição",
    loot: "Essência de sonho (poção rara)",
    threat: "Criatura onírica (Nv 5)",
    optionalRule: "Fadiga de Combate",
  },
  {
    title: "Correio Perigoso",
    description: "Uma mensagem crítica precisa ser entregue através de território hostil. Os jogadores são perseguidos por inimigos que querem interceptar a mensagem. Corrida contra o tempo.",
    difficulty: "Médio", type: "Evento",
    loot: "Pagamento: 2d10 PO, informação privilegiada",
    threat: "Perseguidores (Nv 3), armadilhas de estrada",
    optionalRule: "Sorte e Azar",
  },
];

export function EncounterGenerator() {
  const [encounter, setEncounter] = useState<Encounter | null>(null);
  const [typeFilter, setTypeFilter] = useState("todos");
  const [difficultyFilter, setDifficultyFilter] = useState("todas");

  const generate = useCallback(() => {
    let pool = encounterTemplates;
    if (typeFilter !== "todos") {
      pool = pool.filter((e) => e.type === typeFilter);
    }
    if (difficultyFilter !== "todas") {
      pool = pool.filter((e) => e.difficulty === difficultyFilter);
    }
    if (pool.length === 0) pool = encounterTemplates;
    const template = pool[Math.floor(Math.random() * pool.length)];
    setEncounter({
      ...template,
      difficulty: difficultyFilter === "todas"
        ? template.difficulty
        : difficultyFilter,
      type: typeFilter === "todos" ? template.type : typeFilter,
    });
  }, [typeFilter, difficultyFilter]);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Swords className="h-5 w-5 text-primary" />
          Gerador de Encontros
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-2">
          <Select value={typeFilter} onValueChange={(v) => v && setTypeFilter(v)}>
            <SelectTrigger>
              <SelectValue placeholder="Tipo" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="todos">Todos</SelectItem>
              {encounterTypes.map((t) => (
                <SelectItem key={t} value={t}>{t}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={difficultyFilter} onValueChange={(v) => v && setDifficultyFilter(v)}>
            <SelectTrigger>
              <SelectValue placeholder="Dificuldade" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="todas">Todas</SelectItem>
              {difficulties.map((d) => (
                <SelectItem key={d} value={d}>{d}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <Button onClick={generate}>
          <RefreshCw className="mr-2 h-4 w-4" /> Gerar Encontro
        </Button>

        {encounter && (
          <div className="rounded-lg border border-border p-4 space-y-3">
            <div className="flex items-center gap-2">
              <h3 className="font-semibold text-lg">{encounter.title}</h3>
            </div>
            <div className="flex flex-wrap gap-1">
              <Badge>{encounter.type}</Badge>
              <Badge variant="secondary">{encounter.difficulty}</Badge>
              {encounter.optionalRule && (
                <Badge variant="outline" className="flex items-center gap-1">
                  <ScrollText className="h-3 w-3" /> {encounter.optionalRule}
                </Badge>
              )}
            </div>
            <p className="text-sm text-muted-foreground">
              {encounter.description}
            </p>
            <div className="grid grid-cols-2 gap-3 text-sm border-t border-border pt-3">
              {encounter.threat && (
                <div>
                  <span className="font-medium text-muted-foreground">Ameaça: </span>
                  <span>{encounter.threat}</span>
                </div>
              )}
              {encounter.loot && (
                <div>
                  <span className="font-medium text-muted-foreground">Tesouro: </span>
                  <span>{encounter.loot}</span>
                </div>
              )}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}