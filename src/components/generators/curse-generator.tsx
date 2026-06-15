"use client";
import { useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { RefreshCw, Skull } from "lucide-react";
type Curse = {
  name: string;
  type: string;
  effect: string;
  trigger: string;
  breakCondition: string;
};
const curses: Curse[] = [
  {
    name: "Toque do Esquecimento",
    type: "Mental",
    effect:
      "A cada dia, a vítima perde uma memória importante. Começa com memórias recentes e avança para as mais antigas.",
    trigger: "Ser tocado por uma criatura das sombras durante a lua nova.",
    breakCondition:
      "Recuperar todas as memórias perdidas enfrentando a criatura em seu plano de origem.",
  },
  {
    name: "Pele de Vidro",
    type: "Física",
    effect:
      "A pele da vítima torna-se transparente como vidro. Qualquer impacto causa ferimentos graves. +50% de dano de ataques físicos.",
    trigger: "Ingerir uma poção preparada durante um eclipse solar.",
    breakCondition: "Banhar-se no sangue de um elemental de terra puro.",
  },
  {
    name: "Maldição do Eco",
    type: "Amaldiçoada",
    effect:
      "Todas as palavras ditas pela vítima são repetidas três vezes em volume crescente. Não consegue se mover silenciosamente.",
    trigger: "Quebrar um juramento feito em um local sagrado.",
    breakCondition: "Completar uma jornada de silêncio absoluto por 7 dias.",
  },
  {
    name: "Sombra Invertida",
    type: "Espiritual",
    effect:
      "A sombra da vítima ganha vida própria e tenta sabotá-la. Às vezes a sombra age de forma independente, revelando segredos.",
    trigger: "Atravessar um véu dimensional sem permissão.",
    breakCondition:
      "Capturar a própria sombra e selá-la em um recipiente de prata.",
  },
  {
    name: "Fome Eterna",
    type: "Fisiológica",
    effect:
      "A vítima sente fome insaciável. Qualquer comida ingerida não a satisfaz. Perde 1 ponto de constituição por semana.",
    trigger: "Comer a carne de uma criatura amaldiçoada.",
    breakCondition:
      "Jejuar por 30 dias enquanto usa um amuleto de purificação benta.",
  },
  {
    name: "Olhos do Passado",
    type: "Visual",
    effect:
      "A vítima vê visões do passado em todos os lugares, misturando passado e presente. Difícil distinguir realidade de memória.",
    trigger: "Olhar diretamente para um artefato temporal.",
    breakCondition:
      "Testemunhar um evento histórico crucial e intervir corretamente.",
  },
  {
    name: "Peso da Culpa",
    type: "Mental",
    effect:
      "Objetos ao redor da vítima tornam-se cada vez mais pesados para ela. Carregar sua própria mochila torna-se exaustivo.",
    trigger: "Trair um companheiro de forma irreversível.",
    breakCondition:
      "Realizar um ato de sacrifício genuíno para salvar a pessoa traída.",
  },
  {
    name: "Voz das Bestas",
    type: "Comunicação",
    effect:
      "A vítima perde a capacidade de falar línguas humanas e só consegue se comunicar com animais. Animais a tratam como um deles.",
    trigger: "Ser mordido por um lobo durante a lua cheia.",
    breakCondition: "Convencer um rei animal a levantar a maldição.",
  },
];
export function CurseGenerator() {
  const [curse, setCurse] = useState<Curse | null>(null);
  const generate = useCallback(() => {
    const c = curses[Math.floor(Math.random() * curses.length)];
    setCurse(c);
  }, []);
  return (
    <Card>
      {" "}
      <CardHeader>
        {" "}
        <CardTitle className="flex items-center gap-2">
          {" "}
          <Skull className="h-5 w-5 text-destructive" /> Gerador de
          Maldições{" "}
        </CardTitle>{" "}
      </CardHeader>{" "}
      <CardContent className="space-y-4">
        {" "}
        <Button onClick={generate}>
          {" "}
          <RefreshCw className="mr-2 h-4 w-4" /> Gerar Maldição{" "}
        </Button>{" "}
        {curse && (
          <div className="rounded-lg border border-border p-4 space-y-3">
            {" "}
            <div className="flex items-center gap-2">
              {" "}
              <h3 className="font-semibold text-lg">{curse.name}</h3>{" "}
              <Badge variant="destructive">{curse.type}</Badge>{" "}
            </div>{" "}
            <div className="space-y-2 text-sm">
              {" "}
              <div>
                {" "}
                <span className="font-medium text-muted-foreground">
                  Efeito:{" "}
                </span>{" "}
                <span>{curse.effect}</span>{" "}
              </div>{" "}
              <div>
                {" "}
                <span className="font-medium text-muted-foreground">
                  Ativação:{" "}
                </span>{" "}
                <span>{curse.trigger}</span>{" "}
              </div>{" "}
              <div>
                {" "}
                <span className="font-medium text-muted-foreground">
                  Reversão:{" "}
                </span>{" "}
                <span>{curse.breakCondition}</span>{" "}
              </div>{" "}
            </div>{" "}
          </div>
        )}{" "}
      </CardContent>{" "}
    </Card>
  );
}
