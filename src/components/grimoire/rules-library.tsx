"use client";
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { BookOpen, Search, ChevronDown, ChevronUp } from "lucide-react";

type RuleCategory = {
  name: string;
  icon: string;
  rules: {
    title: string;
    description: string;
    details: string;
    reference: string;
  }[];
};

const ruleCategories: RuleCategory[] = [
  {
    name: "Criação de Personagem",
    icon: "🎭",
    rules: [
      {
        title: "Atributos",
        description: "Força, Destreza, Constituição, Inteligência, Sabedoria, Carisma",
        details: "Distribua 70 pontos entre os 6 atributos. Máximo 18 em um atributo no level 1. Raças fornecem bônus: Humanos (+1 em dois), Elfos (+2 Destreza, -2 Constituição), Anões (+2 Constituição, -2 Carisma), Meio-Orcs (+2 Força, -2 Inteligência).",
        reference: "Livro de Regras v2.5.2 - Cap. 2",
      },
      {
        title: "Perícias",
        description: "Cada personagem começa com 12 pontos de perícia",
        details: "Perícias incluem: Atletismo, Furtividade, Percepção, Persuasão, Intimidação, Arcanismo, História, Natureza, Medicina, Investigação, Atuação, Enganação, Prestidigitação, Sobrevivência, Ofício. Custo: 1 ponto por nível. Nível máximo inicial: 4.",
        reference: "Livro de Regras v2.5.2 - Cap. 2",
      },
      {
        title: "Classes",
        description: "Guerreiro, Mago, Ladino, Clérigo, Caçador, Bardo",
        details: "Cada classe tem uma habilidade única: Guerreiro (+1 de ataque), Mago (magia arcana), Ladino (dano furtivo), Clérigo (magia divina), Caçador (marca da presa), Bardo (inspiração). No level 1, escolha uma classe base. No level 5, pode escolher uma subclasse.",
        reference: "Livro de Regras v2.5.2 - Cap. 3",
      },
      {
        title: "Raças",
        description: "Humano, Elfo, Anão, Meio-Orc, Halfling, Gnomo",
        details: "Cada raça concede: Humanos (versáteis, +1 em dois atributos), Elfos (visão noturna, +2 Destreza), Anões (resistência a veneno, +2 Constituição), Meio-Orcs (visão escura, +2 Força), Halflings (sortudos, +2 Destreza), Gnomos (engenhosos, +2 Inteligência).",
        reference: "Livro de Regras v2.5.2 - Cap. 2",
      },
    ],
  },
  {
    name: "Combate",
    icon: "⚔️",
    rules: [
      {
        title: "Iniciativa",
        description: "Rolagem de d20 + modificador de Destreza",
        details: "No início do combate, cada participante rola Iniciativa (d20 + Destreza). Ordem decrescente. Empates são resolvidos por maior Destreza, depois por rolagem de desempate.",
        reference: "Livro de Regras v2.5.2 - Cap. 5",
      },
      {
        title: "Ações",
        description: "Cada turno: 1 ação principal, 1 ação de movimento, 1 ação bônus",
        details: "Ação Principal: Atacar, Lançar Magia, Usar Item, Correr (dobro), Esquivar, Ajudar. Ação de Movimento: Andar (até deslocamento), Escalar, Nadar. Ação Bônus: Poção, Habilidade de Classe, Ataque secundário (se tiver).",
        reference: "Livro de Regras v2.5.2 - Cap. 5",
      },
      {
        title: "Ataque e Dano",
        description: "d20 + modificador de atributo + bônus de proficiência",
        details: "Ataque corpo a corpo: d20 + Força + Proficiência. Ataque à distância: d20 + Destreza + Proficiência. Ataque mágico: d20 + Inteligência/Sabedoria + Proficiência. Dano: dado da arma + modificador de atributo. Crítico: 20 natural, dobre os dados de dano.",
        reference: "Livro de Regras v2.5.2 - Cap. 5",
      },
      {
        title: "Armadura e Defesa",
        description: "Classe de Armadura (CA) = 10 + modificador de Destreza + armadura",
        details: "Armadura Leve: 11 + Destreza (couro). Armadura Média: 13 + Destreza (máx +2) (malha). Armadura Pesada: 15 (aço), 17 (aço pesado). Escudo: +2 CA. Redução de dano: Armadura pesada reduz dano físico em 2.",
        reference: "Livro de Regras v2.5.2 - Cap. 5",
      },
    ],
  },
  {
    name: "Magia",
    icon: "🔮",
    rules: [
      {
        title: "Sistema de Mana",
        description: "Pontos de Mana = Inteligência x Nível + 10",
        details: "Magias custam Mana igual ao seu nível. Descanso longo recupera todos os PM. Descanso curto recupera 1d6 + nível de PM. Poções de Mana: 1d8+2 PM (comum), 2d8+4 PM (superior).",
        reference: "Livro de Regras v2.5.2 - Cap. 6",
      },
      {
        title: "Círculos Mágicos",
        description: "6 círculos de poder, do básico ao arcano",
        details: "1º Círculo (Nv 1-3): Magias básicas (Bola de Fogo menor, Cura Leve). 2º Círculo (Nv 4-6): Magias intermediárias (Invisibilidade, Vôo). 3º Círculo (Nv 7-9): Magias superiores (Bola de Fogo, Cura Total). Cada círculo acima exige nível mínimo mais alto.",
        reference: "Livro de Regras v2.5.2 - Cap. 6",
      },
      {
        title: "Maldições",
        description: "Escola especial de magia negativa, requer pacto ou estudo proibido",
        details: "Maldições são permanentes até serem quebradas. Cada maldição tem: Nível de poder (Baixo/Médio/Alto/Épico), Gatilho de ativação, Condição de reversão. Arremessar maldição: teste de Arcanismo CD 15 + nível da maldição. Falha crítica: maldição ricocheteia.",
        reference: "Grimório das Maldições v1 - Introdução",
      },
    ],
  },
  {
    name: "Progressão",
    icon: "📈",
    rules: [
      {
        title: "Experiência",
        description: "XP por sessão: 100-200 base + bônus por objetivos",
        details: "XP base por sessão: 100. Bônus: Missão concluída (+50), RP excepcional (+25), Solução criativa (+25), Combate difícil (+25). Nível 2: 300 XP. Nível 3: 700 XP. Nível 4: 1200 XP. Nível 5: 2000 XP.",
        reference: "Livro de Regras v2.5.2 - Cap. 7",
      },
      {
        title: "Nível",
        description: "A cada nível: +1d8 de vida, +1 proficiência, talento a cada 3 níveis",
        details: "Vida: d8 + Constituição por nível. Talento: escolha um a cada 3 níveis (3, 6, 9, 12...). Aumento de Atributo: +2 em um atributo ou +1 em dois a cada 4 níveis (4, 8, 12...).",
        reference: "Livro de Regras v2.5.2 - Cap. 7",
      },
    ],
  },
  {
    name: "Equipamento",
    icon: "🛡️",
    rules: [
      {
        title: "Armas",
        description: "Simples (1d6), Marciais (1d8/2d6), Exóticas (1d10/2d8)",
        details: "Armas Simples: adaga (1d4), bordão (1d6), clava (1d6). Armas Marciais: espada longa (1d8), machado (1d10), arco longo (1d8). Armas Exóticas: cimitarra élfica (1d10), martelo anão (2d6), lâmina sombria (1d12). Proficiência necessária para não ter desvantagem.",
        reference: "Livro de Regras v2.5.2 - Cap. 4",
      },
      {
        title: "Itens Mágicos",
        description: "Comuns, Incomuns, Raros, Épicos, Lendários",
        details: "Itens Comuns: Poções, Pergaminhos. Incomuns: Armas +1, Anéis de Proteção. Raros: Armas +2, Armaduras Encantadas. Épicos: Armas +3, Artefatos Menores. Lendários: Artefatos Maiores. Sintonização: alguns itens exigem 1 hora de sintonia (máximo 3 itens sintonizados).",
        reference: "Livro de Regras v2.5.2 - Cap. 8",
      },
    ],
  },
  {
    name: "Regras Opcionais",
    icon: "📜",
    rules: [
      {
        title: "Fadiga de Combate",
        description: "Após 5 rounds de combate, personagens ganham 1 nível de fadiga",
        details: "Nível 1: -1 em testes. Nível 2: -2 em testes, velocidade reduzida. Nível 3: Desvantagem em testes, -1 defesa. Nível 4: Inconsciente. Descanso curto remove 1 nível. Descanso longo remove todos.",
        reference: "Regras Opcionais - Fadiga",
      },
      {
        title: "Ferimentos Críticos",
        description: "Quando um personagem cai a 0 PV, rola na tabela de ferimentos",
        details: "d20: 1-5: Contusão (1 nível fadiga). 6-10: Corte profundo (sangramento). 11-15: Fratura (-1 deslocamento). 16-19: Ferimento interno ( -1 Constituição permanente até cura mágica). 20: Ferimento fatal (morte ou sequelas permanentes).",
        reference: "Regras Opcionais - Ferimentos",
      },
      {
        title: "Sorte e Azar",
        description: "Cada personagem tem 3 pontos de Sorte por sessão",
        details: "Gastar 1 ponto: Rerrolar um dado. Gastar 2 pontos: Transformar um fallho em sucesso. Gastar 3 pontos: Criar uma coincidência favorável. Recupera todos os pontos no início da próxima sessão. Mestre pode dar pontos extras por RP excepcional.",
        reference: "Regras Opcionais - Sorte",
      },
      {
        title: "Treinamento Avançado",
        description: "Entre níveis, personagens podem aprender perícias extras com tempo e dinheiro",
        details: "Perícia nova: 1 semana de treino + 100 PO. Talento novo: 1 mês de treino + 500 PO + mentor. Proficiência em arma: 2 semanas + 200 PO. Idiomas: 1 mês + 100 PO. Limitado a 1 treinamento por período de descanso.",
        reference: "Regras Opcionais - Treinamento",
      },
    ],
  },
];

export function RulesLibrary() {
  const [search, setSearch] = useState("");
  const [expanded, setExpanded] = useState<string | null>(null);
  const [category, setCategory] = useState("Criação de Personagem");

  const filtered = ruleCategories
    .map((cat) => ({
      ...cat,
      rules: cat.rules.filter(
        (r) =>
          !search ||
          r.title.toLowerCase().includes(search.toLowerCase()) ||
          r.description.toLowerCase().includes(search.toLowerCase()) ||
          r.details.toLowerCase().includes(search.toLowerCase())
      ),
    }))
    .filter((cat) => cat.rules.length > 0);

  const currentCategory = filtered.find((c) => c.name === category) || filtered[0];

  return (
    <div className="space-y-6">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Buscar regra..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-10"
        />
      </div>

      <Tabs value={category} onValueChange={(v) => v && setCategory(v)}>
        <TabsList className="flex-wrap h-auto">
          {filtered.map((cat) => (
            <TabsTrigger key={cat.name} value={cat.name} className="text-xs">
              {cat.icon} {cat.name}
            </TabsTrigger>
          ))}
        </TabsList>

        {filtered.map((cat) => (
          <TabsContent key={cat.name} value={cat.name} className="space-y-3 pt-4">
            {cat.rules.map((rule) => (
              <Card
                key={rule.title}
                className="cursor-pointer transition-colors hover:border-primary/30"
                onClick={() =>
                  setExpanded(expanded === rule.title ? null : rule.title)
                }
              >
                <CardHeader className="py-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-base">{rule.title}</CardTitle>
                      <p className="text-sm text-muted-foreground mt-0.5">
                        {rule.description}
                      </p>
                    </div>
                    {expanded === rule.title ? (
                      <ChevronUp className="h-4 w-4 text-muted-foreground shrink-0" />
                    ) : (
                      <ChevronDown className="h-4 w-4 text-muted-foreground shrink-0" />
                    )}
                  </div>
                </CardHeader>
                {expanded === rule.title && (
                  <CardContent className="space-y-3 text-sm border-t border-border pt-4">
                    <p>{rule.details}</p>
                    <Badge variant="outline" className="text-xs">
                      {rule.reference}
                    </Badge>
                  </CardContent>
                )}
              </Card>
            ))}
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}