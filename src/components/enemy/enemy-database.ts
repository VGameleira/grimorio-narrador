import { attrMod } from "@/data/system-data"

export interface EnemyTemplate {
  name: string
  nd: number
  patamar: string
  type: string
  hp: number
  pe: number
  defesa: number
  atencao: number
  iniciativa: number
  for: number; des: number; con: number; int: number; sab: number; pre: number
  pericias: string[]
  ataques: { nome: string; dano: string; tipo: string; efeito?: string }[]
  habilidades: string[]
  tecnicas?: string[]
  loot?: string
  descricao: string
}

export const ENEMY_TEMPLATES: EnemyTemplate[] = [
  {
    name: "Humano Amaldiçoado",
    nd: 1, patamar: "Lacaio", type: "Espírito Amaldiçoado Comum",
    hp: 15, pe: 4,
    defesa: 11, atencao: 10, iniciativa: 0,
    for: 12, des: 10, con: 12, int: 8, sab: 10, pre: 8,
    pericias: ["Percepção", "Intimidação"],
    ataques: [
      { nome: "Soco", dano: "1d4", tipo: "Contusão" },
      { nome: "Toque Gélido", dano: "1d6", tipo: "Frio", efeito: "Vítima fica lenta (-1d em DES)" },
    ],
    habilidades: ["Visão no Escuro", "Imunidade a dano não-mágico"],
    descricao: "Um humano comum que foi possuído por energia amaldiçoada. Sua pele é pálida e seus olhos brilham com um tom amarelado.",
  },
  {
    name: "Cachorro Amaldiçoado",
    nd: 1, patamar: "Lacaio", type: "Criatura Amaldiçoada",
    hp: 12, pe: 2,
    defesa: 12, atencao: 14, iniciativa: 2,
    for: 12, des: 14, con: 10, int: 3, sab: 14, pre: 6,
    pericias: ["Percepção", "Furtividade"],
    ataques: [
      { nome: "Mordida", dano: "1d6+1", tipo: "Perfuração" },
    ],
    habilidades: ["Faro Aguçado (vantagem em Percepção para sentir cheiro)", "Trabalho em Grupo (+1d em ataques quando aliado adjacente)"],
    descricao: "Um cão selvagem distorcido pela energia amaldiçoada. Seus olhos brilham vermelhos e sua baba queima o chão.",
  },
  {
    name: "Assombração Menor",
    nd: 2, patamar: "Lacaio", type: "Espírito Amaldiçoado Comum",
    hp: 18, pe: 6,
    defesa: 11, atencao: 12, iniciativa: 1,
    for: 8, des: 12, con: 12, int: 10, sab: 12, pre: 14,
    pericias: ["Furtividade", "Enganação", "Percepção"],
    ataques: [
      { nome: "Toque Fantasma", dano: "1d6", tipo: "Necrótico", efeito: "Ignora armadura se vítima estiver com medo" },
    ],
    habilidades: ["Invisibilidade (enquanto imóvel)", "Imunidade a dano físico não-mágico"],
    descricao: "Um espírito vago que assombra locais com forte energia negativa. Difícil de detectar, fácil de subestimar.",
  },
  {
    name: "Fanático Cultista",
    nd: 3, patamar: "Capanga", type: "Feiticeiro Renegado",
    hp: 30, pe: 8,
    defesa: 13, atencao: 11, iniciativa: 1,
    for: 12, des: 12, con: 14, int: 10, sab: 10, pre: 14,
    pericias: ["Feitiçaria", "Intimidação", "Enganação"],
    ataques: [
      { nome: "Adaga Ritualística", dano: "1d4+1", tipo: "Perfuração" },
      { nome: "Explosão Amaldiçoada", dano: "2d6", tipo: "Energia", efeito: "Alcance 18m" },
    ],
    habilidades: ["Resistência a Medo", "Fanatismo (imune a efeitos de persuasão)"],
    tecnicas: ["Explosão Amaldiçoada"],
    descricao: "Um humano que voluntariamente se entregou à energia amaldiçoada. Serve a uma maldição mais poderosa e acredita estar sendo abençoado.",
  },
  {
    name: "Maldição de Medo (Grau 3)",
    nd: 5, patamar: "Capanga", type: "Espírito Amaldiçoado de Medo",
    hp: 45, pe: 12,
    defesa: 13, atencao: 13, iniciativa: 2,
    for: 12, des: 14, con: 14, int: 12, sab: 12, pre: 16,
    pericias: ["Intimidação", "Percepção", "Enganação"],
    ataques: [
      { nome: "Garras do Medo", dano: "1d8+2", tipo: "Corte", efeito: "Vítima faz teste de Vontade ou fica com medo" },
      { nome: "Grito Aterrorizante", dano: "2d6", tipo: "Psíquico", efeito: "Área 6m, Vontade CD 13 para metade" },
    ],
    habilidades: ["Aura de Medo (6m, Vontade CD 13 ou desvantagem em ataques)", "Imunidade a dano não-mágico"],
    tecnicas: ["Grito Aterrorizante", "Forma do Medo"],
    loot: "Núcleo Amaldiçoado (250g)",
    descricao: "Uma manifestação do medo popular. Seu corpo distorcido muda de forma baseado no que sua vítima mais teme.",
  },
  {
    name: "Feiticeiro Clã Kamo",
    nd: 6, patamar: "Comum", type: "Feiticeiro Renegado",
    hp: 55, pe: 20,
    defesa: 14, atencao: 14, iniciativa: 3,
    for: 12, des: 14, con: 12, int: 16, sab: 14, pre: 12,
    pericias: ["Feitiçaria", "Investigação", "Concentração", "Percepção"],
    ataques: [
      { nome: "Lança de Sangue", dano: "2d8", tipo: "Perfuração", efeito: "Alcance 18m" },
    ],
    habilidades: ["Manipulação Sanguínea", "Criação de Ferramentas de Sangue", "Resistência a Veneno"],
    tecnicas: ["Manipulação Sanguínea - Lança", "Manipulação Sanguínea - Escudo de Sangue (3 PE, +2 Defesa por cena)"],
    loot: "Ferramenta Amaldiçoada Menor (1d4 itens)",
    descricao: "Um membro do Clã Kamo que domina a técnica de Manipulação Sanguínea. Pode criar armas e escudos com seu próprio sangue.",
  },
  {
    name: "Maldição da Doença (Grau 2)",
    nd: 9, patamar: "Comum", type: "Espírito Amaldiçoado Vingativo",
    hp: 80, pe: 22,
    defesa: 15, atencao: 12, iniciativa: 1,
    for: 14, des: 10, con: 18, int: 8, sab: 10, pre: 8,
    pericias: ["Intimidação"],
    ataques: [
      { nome: "Toque Pestilento", dano: "2d6", tipo: "Necrótico", efeito: "Vítima faz Fortitude CD 15 ou contrai uma doença" },
      { nome: "Nuvem Pútrida", dano: "3d6", tipo: "Ácido", efeito: "Área 6m, Fortitude CD 15 para metade" },
    ],
    habilidades: ["Aura de Doença (3m, Fortitude CD 15 ou enjoado)", "Imunidade a veneno e doença", "Regeneração Lenta (5 PV/rodada se não tomar dano de fogo)"],
    loot: "Glândula de Veneno (500g)",
    descricao: "Uma maldição nascida do medo coletivo de epidemias. Seu corpo é coberto por feridas abertas e pus, e um odor nauseante a acompanha.",
  },
  {
    name: "Sukuna (Dedo)",
    nd: 10, patamar: "Desafio", type: "Espírito Amaldiçoado Vingativo",
    hp: 120, pe: 40,
    defesa: 17, atencao: 16, iniciativa: 4,
    for: 18, des: 16, con: 18, int: 14, sab: 16, pre: 20,
    pericias: ["Feitiçaria", "Percepção", "Intimidação", "Intuição", "História"],
    ataques: [
      { nome: "Corte (Dismantle)", dano: "3d10+5", tipo: "Corte", efeito: "Alcance 30m" },
      { nome: "Corte Limpo (Cleave)", dano: "4d8+5", tipo: "Corte", efeito: "Ajusta dano à resistência do alvo" },
    ],
    habilidades: ["Controle de Energia Amaldiçoada Perfeito", "Visão de Energia Amaldiçoada", "Rei das Maldições (vantagem em testes de Vontade)"],
    tecnicas: ["Dismantle", "Cleave", "Expansão de Domínio: Santuário Malevolente (20 PE, 20m)"],
    loot: "Dedo de Sukuna (relíquia de Grau Especial)",
    descricao: "Um dos 20 dedos de Ryomen Sukuna, o Rei das Maldições. Mesmo um único dedo contém poder imenso e pode manifestar uma forma parcial de Sukuna.",
  },
  {
    name: "Maldição da Morte (Grau Especial)",
    nd: 25, patamar: "Calamidade", type: "Espírito Amaldiçoado Vingativo",
    hp: 350, pe: 80,
    defesa: 20, atencao: 18, iniciativa: 5,
    for: 20, des: 18, con: 22, int: 16, sab: 20, pre: 22,
    pericias: ["Intimidação", "Percepção", "Intuição", "Investida"],
    ataques: [
      { nome: "Toque da Morte", dano: "6d10", tipo: "Necrótico", efeito: "Metade do dano é permanente até próximo descanso longo" },
      { nome: "Ceifar", dano: "8d8", tipo: "Corte", efeito: "Se reduzir a 0 PV, vítima morre instantaneamente" },
      { nome: "Grito dos Mortos", dano: "4d10", tipo: "Psíquico", efeito: "Área 12m, Vontade CD 20 ou paralisado 1 rodada" },
    ],
    habilidades: ["Aura de Morte (9m, cura reduzida à metade)", "Regeneração (10 PV/rodada)", "Imunidade a dano não-mágico", "Imunidade a crítico"],
    tecnicas: ["Ceifar", "Grito dos Mortos", "Expansão de Domínio: Vale da Morte (25 PE, 30m, criaturas morrem em 1d4 rodadas)"],
    loot: "Núcleo da Morte (lendário, 5000g)",
    descricao: "A manifestação suprema do medo da morte, acumulado por toda a humanidade ao longo dos milênios. É uma das Maldições Mais Antigas já registradas. Sua forma é uma figura encapuzada com uma foice feita de ossos humanos.",
  },
  {
    name: "Maldição da Perfeição (Grau 1)",
    nd: 14, patamar: "Desafio", type: "Espírito Amaldiçoado de Medo",
    hp: 150, pe: 35,
    defesa: 18, atencao: 17, iniciativa: 4,
    for: 16, des: 16, con: 16, int: 20, sab: 18, pre: 20,
    pericias: ["Feitiçaria", "Percepção", "Investigação", "Intuição"],
    ataques: [
      { nome: "Correção Forçada", dano: "3d8+4", tipo: "Energia", efeito: "Vítima tem um atributo reduzido em 1 até descanso longo" },
    ],
    habilidades: ["Olhos da Crítica (identifica falhas em qualquer coisa)", "Perfeição Impossível (imune a dano de ataques 'imperfeitos')"],
    tecnicas: ["Correção Forçada", "Expansão de Domínio: Galeria da Perfeição"],
    descricao: "Nascida do medo da imperfeição e do julgamento social. Tem aparência de uma escultura humana de beleza impecável, mas seus olhos são vazios e críticos.",
  },
  {
    name: "Líder de Facção Humana",
    nd: 8, patamar: "Comum", type: "Feiticeiro Renegado",
    hp: 70, pe: 25,
    defesa: 15, atencao: 15, iniciativa: 3,
    for: 14, des: 14, con: 14, int: 16, sab: 14, pre: 16,
    pericias: ["Enganação", "Persuasão", "Intimidação", "Feitiçaria", "Investigação"],
    ataques: [
      { nome: "Técnica Secreta", dano: "2d10+3", tipo: "Conforme técnica", efeito: "Efeito variado" },
    ],
    habilidades: ["Presença de Líder (aliados dentro de 6m têm +1 em testes de Vontade)", "Recursos da Facção (pode ter subordinados)"],
    tecnicas: ["Técnica Amaldiçoada Pessoal"],
    loot: "Relíquia de Facção (750g)",
    descricao: "Um líder humano de uma facção de feiticeiros renegados. Inteligente, carismático e perigoso. Mantém seguidores leais e acesso a recursos proibidos.",
  },
  {
    name: "Golem Amaldiçoado",
    nd: 7, patamar: "Comum", type: "Corpo Amaldiçoado Artificial",
    hp: 100, pe: 10,
    defesa: 16, atencao: 10, iniciativa: -1,
    for: 20, des: 8, con: 20, int: 4, sab: 8, pre: 6,
    pericias: ["Intimidação"],
    ataques: [
      { nome: "Soco Esmagador", dano: "2d10+5", tipo: "Contusão" },
      { nome: "Pisão", dano: "3d6+5", tipo: "Contusão", efeito: "Área 3m" },
    ],
    habilidades: ["Núcleo (vulnerabilidade: dano perfurante no ponto fraco/vez; resistência: todo dano reduzido em 5)", "Imune a mental e crítico"],
    descricao: "Uma construção artificial de barro e metal, animada por energia amaldiçoada. Obedece a ordens simples de seu criador. Seu núcleo está escondido em algum lugar de seu corpo.",
  },
]
