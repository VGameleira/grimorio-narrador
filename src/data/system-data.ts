export const ATTRIBUTES = [
  { name: "Força", short: "FOR", desc: "Poder muscular, dano corpo a corpo" },
  { name: "Destreza", short: "DES", desc: "Agilidade, reflexos, equilíbrio" },
  { name: "Constituição", short: "CON", desc: "Resistência, vigor, PV" },
  { name: "Inteligência", short: "INT", desc: "Raciocínio, perícias técnicas" },
  { name: "Sabedoria", short: "SAB", desc: "Percepção, intuição, experiência" },
  { name: "Presença", short: "PRE", desc: "Carisma, força da personalidade" },
] as const;

export function attrMod(value: number): number {
  return Math.floor((value - 10) / 2);
}

export const ORIGINS = [
  {
    name: "Inato",
    desc: "Nasceu com afinidade para usar energia amaldiçoada e técnica própria",
    bonus: "Aumenta 1 atributo em +2 e outro em +1",
    hpBonus: 0,
    peBonus: 0,
    features: ["Talento Natural (1 talento extra no Nv1)", "Marca Registrada (1 feitiço extra, custo -1 PE)"],
  },
  {
    name: "Herdado",
    desc: "Poder vem da linhagem sanguínea de um clã de feiticeiros",
    bonus: "Bônus variam por clã (Gojo, Inumaki, Kamo, Zenin)",
    hpBonus: 0,
    peBonus: 0,
    features: ["Treinamentos de Clã", "Herança de Clã (técnicas e capacidades herdadas)"],
  },
  {
    name: "Derivado",
    desc: "Ganhou poder ao consumir um objeto amaldiçoado",
    bonus: "Aumenta 1 atributo em +2 e outro em +1",
    hpBonus: 0,
    peBonus: 0,
    features: ["Resquício Amaldiçoado (habilidade do objeto)", "Potencial Instável (bônus situacional)"],
  },
  {
    name: "Restringido",
    desc: "Troca a capacidade de usar energia por capacidades físicas extremas",
    bonus: "Aumenta 3 atributos em +1 cada",
    hpBonus: 4,
    peBonus: 0,
    features: ["Sem Energia Amaldiçoada (usa Estamina)", "Corpo Supremo (+4 PV iniciais)", "Restrição Congênita (habilidades físicas únicas)"],
    restricted: true,
  },
  {
    name: "Feto Amaldiçoado Híbrido",
    desc: "Existência介于 humana e maldição, meio-espírito amaldiçoado",
    bonus: "Aumenta 2 atributos em +1 cada",
    hpBonus: 2,
    peBonus: 2,
    features: ["Núcleo Amaldiçoado (+2 PV, +2 PE)", "Percepção Sobrenatural (visão de maldições sempre ativa)"],
  },
  {
    name: "Sem Técnica",
    desc: "Não possui técnica inata, mas pode usar ferramentas amaldiçoadas",
    bonus: "Aumenta 1 atributo em +2",
    hpBonus: 2,
    peBonus: 0,
    features: ["Especialização em Ferramentas (+1 em ataques com ferramentas)", "Versatilidade (1 perícia adicional)"],
  },
  {
    name: "Corpo Amaldiçoado Mutante",
    desc: "Corpo artificial ou possuído por maldição, com núcleo próprio",
    bonus: "Aumenta 2 atributos em +1 cada",
    hpBonus: 4,
    peBonus: 1,
    features: ["Núcleo Artificial (+4 PV, +1 PE)", "Resistência a dano físico", "Não precisa de alimentação ou sono"],
  },
] as const;

export const CLANS = [
  {
    name: "Clã Gojo",
    desc: "Herdeiros de Michizane Sugawara, técnica Ilimitado e Seis Olhos",
    bonus: "+2 Inteligência ou Sabedoria, +1 no outro",
    skills: ["Feitiçaria", "Percepção", "Intuição"],
    features: ["Potencial Lendário (+1 PE em níveis pares, +1 feitiço nos níveis 1, 5, 10, 15, 20)"],
  },
  {
    name: "Clã Inumaki",
    desc: "Clã com técnica Fala Amaldiçoada, sigilos ao redor da boca",
    bonus: "+2 Inteligência ou Presença, +1 no outro",
    skills: ["Feitiçaria", "Percepção", "Intuição"],
    features: ["Olhos de Cobra e Presas", "Fala Amaldiçoada (versátil)"],
  },
  {
    name: "Clã Kamo",
    desc: "Clã com técnica Manipulação Sanguínea, tradicionalistas",
    bonus: "+2 Constituição ou Sabedoria, +1 no outro",
    skills: ["Feitiçaria", "Ofício (Alquimia)", "Investigação"],
    features: ["Manipulação Sanguínea (versátil)", "Tradição de Clã (perícia extra)"],
  },
  {
    name: "Clã Zenin",
    desc: "Clã mais poderoso, técnicas Dez Sombras e Projeção",
    bonus: "+2 em qualquer atributo, +1 em outro qualquer",
    skills: ["Qualquer 2 perícias"],
    features: ["Herança Versátil (escolhe técnica entre Dez Sombras ou Projeção)"],
  },
] as const;

export const SPECIALIZATIONS = [
  {
    name: "Lutador",
    desc: "Mestre do combate corpo a corpo, resistente e agressivo",
    pvBase: 12,
    peBase: 4,
    peAttr: false,
    pvDice: "d12",
    resistencia: ["Fortitude"],
    pericias: ["Atletismo", "Acrobacia", "mais 3 quaisquer"],
    armas: ["Simples", "Marciais"],
    armadura: ["Leve", "Média"],
    atributoCD: ["Força", "Destreza"],
    features: ["Repertório do Lutador (estilos de luta)", "Artes Marciais (golpes especiais)"],
  },
  {
    name: "Especialista em Combate",
    desc: "Versátil no manejo de armas, domínio do campo de batalha",
    pvBase: 12,
    peBase: 4,
    peAttr: false,
    pvDice: "d10",
    resistencia: ["Fortitude", "Reflexos"],
    pericias: ["Ofício", "Atletismo ou Acrobacia", "mais 3 quaisquer"],
    armas: ["Todas"],
    armadura: ["Todas"],
    atributoCD: ["Força", "Destreza", "Sabedoria"],
    features: ["Repertório do Especialista (estilos de combate)", "Artes do Combate (Pontos de Preparo)"],
  },
  {
    name: "Especialista em Técnica",
    desc: "Focado em desenvolver e potencializar sua técnica amaldiçoada",
    pvBase: 10,
    peBase: 6,
    peAttr: true,
    pvDice: "d8",
    resistencia: ["Vontade", "Reflexos"],
    pericias: ["Feitiçaria", "Concentração", "mais 2 quaisquer"],
    armas: ["Simples"],
    armadura: ["Leve"],
    atributoCD: ["Inteligência", "Sabedoria", "Presença"],
    features: ["Aprimoramento de Técnica (+1 dado de dano em feitiços)", "Potencial Mágico (mais PE)"],
  },
  {
    name: "Controlador",
    desc: "Especialista em invocações, shikigamis e controle de batalha",
    pvBase: 10,
    peBase: 5,
    peAttr: true,
    pvDice: "d8",
    resistencia: ["Vontade", "Astúcia"],
    pericias: ["Feitiçaria", "Percepção", "mais 2 quaisquer"],
    armas: ["Simples"],
    armadura: ["Leve"],
    atributoCD: ["Inteligência", "Sabedoria", "Presença"],
    features: ["Invocações (shikigamis e familiares)", "Concentrar Poder (amplifica invocações)"],
  },
  {
    name: "Suporte",
    desc: "Focado em curar, buffar aliados e controle de campo com barreiras",
    pvBase: 10,
    peBase: 5,
    peAttr: true,
    pvDice: "d8",
    resistencia: ["Vontade", "Fortitude"],
    pericias: ["Intuição", "Medicina", "mais 2 quaisquer"],
    armas: ["Simples"],
    armadura: ["Leve", "Média"],
    atributoCD: ["Sabedoria", "Presença", "Inteligência"],
    features: ["Técnica de Barreira (escudos e defesas)", "Energia Reversa (cura)"],
  },
  {
    name: "Restringido",
    desc: "Origem Restringido obrigatória. Usa Estamina, não PE. Corpo supremo.",
    pvBase: 16,
    peBase: 0,
    peAttr: false,
    pvDice: "d12",
    resistencia: ["Fortitude", "Reflexos"],
    pericias: ["Atletismo", "Acrobacia", "Percepção", "mais 2 quaisquer"],
    armas: ["Todas"],
    armadura: ["Todas"],
    atributoCD: ["Força", "Destreza"],
    features: ["Arsenal Amaldiçoado (Estamina no lugar de PE)", "Dádivas do Céu (bônus físicos)", "Estilo Marcial (técnicas de combate únicas)"],
  },
] as const;

export const EQUIPMENT_TIERS = [
  { name: "Simples", cost: 1, desc: "Armas básicas, itens comuns" },
  { name: "Marcial", cost: 2, desc: "Armas de combate profissional" },
  { name: "Especial", cost: 3, desc: "Armas e itens de elite" },
  { name: "Místico", cost: 4, desc: "Ferramentas amaldiçoadas menores" },
  { name: "Lendário", cost: 5, desc: "Ferramentas amaldiçoadas maiores" },
];

export const WEAPONS = [
  { name: "Soco Ingatu", tier: "Simples", damage: "1d4", type: "Contusão", properties: ["Leve", "Desarmado"] },
  { name: "Adaga", tier: "Simples", damage: "1d4", type: "Perfuração", properties: ["Leve", "Fina"] },
  { name: "Bastão", tier: "Simples", damage: "1d6", type: "Contusão", properties: ["Duas Mãos", "Versátil"] },
  { name: "Katana", tier: "Marcial", damage: "1d8", type: "Corte", properties: ["Versátil (1d10)"] },
  { name: "Nodachi", tier: "Marcial", damage: "1d10", type: "Corte", properties: ["Duas Mãos", "Pesada"] },
  { name: "Shuriken", tier: "Simples", damage: "1d4", type: "Perfuração", properties: ["Leve", "Arremesso"] },
  { name: "Arco Longo", tier: "Marcial", damage: "1d8", type: "Perfuração", properties: ["Duas Mãos", "Disparo"] },
  { name: "Machadinha", tier: "Simples", damage: "1d6", type: "Corte", properties: ["Leve", "Arremesso"] },
  { name: "Lança", tier: "Simples", damage: "1d6", type: "Perfuração", properties: ["Versátil (1d8)", "Alcance"] },
  { name: "Espada Longa", tier: "Marcial", damage: "1d8", type: "Corte", properties: ["Versátil (1d10)"] },
  { name: "Martelo de Guerra", tier: "Marcial", damage: "1d10", type: "Contusão", properties: ["Duas Mãos", "Pesada"] },
  { name: "Foice", tier: "Marcial", damage: "1d8", type: "Corte", properties: ["Duas Mãos", "Fina"] },
  { name: "Kusarigama", tier: "Especial", damage: "1d6", type: "Corte", properties: ["Alcance", "Versátil", "Fina"] },
  { name: "Shamshir", tier: "Especial", damage: "1d10", type: "Corte", properties: ["Versátil (1d12)", "Fina"] },
];

export const SKILLS = [
  "Acrobacia", "Atletismo", "Atuação", "Concentração", "Enganação",
  "Feitiçaria", "Furtividade", "História", "Intimidação", "Intuição",
  "Investigação", "Ludibriação", "Medicina", "Natureza", "Ofício",
  "Percepção", "Persuasão", "Prestidigitação", "Sobrevivência",
];

export const ND_TABLE = [
  { min: 1, max: 4, bonus: 2 },
  { min: 5, max: 8, bonus: 3 },
  { min: 9, max: 12, bonus: 4 },
  { min: 13, max: 16, bonus: 5 },
  { min: 17, max: 30, bonus: 6 },
];

export function getTrainingBonus(nd: number): number {
  const row = ND_TABLE.find((r) => nd >= r.min && nd <= r.max);
  return row ? row.bonus : 2;
}

export const PATAMARES = [
  { name: "Lacaio", difficulty: "Muito Fácil", players: 1, hpMult: 0.5, peMult: 0.5 },
  { name: "Capanga", difficulty: "Fácil", players: 1, hpMult: 0.75, peMult: 0.75 },
  { name: "Comum", difficulty: "Média", players: 2, hpMult: 1, peMult: 1 },
  { name: "Desafio", difficulty: "Difícil", players: 4, hpMult: 1.5, peMult: 1.5 },
  { name: "Calamidade", difficulty: "Experiente", players: 6, hpMult: 2, peMult: 2 },
] as const;

export const ENEMY_TYPES = [
  {
    name: "Espírito Amaldiçoado Comum",
    desc: "Vagam procurando pessoas emocionalmente instáveis",
    bonus: "+1 Destreza, +1 Constituição",
    features: ["Visão no Escuro", "Imunidade a dano não-mágico"],
  },
  {
    name: "Espírito Amaldiçoado de Medo",
    desc: "Surgem do medo popular sobre algo específico",
    bonus: "+2 Presença, +2 Inteligência",
    features: ["Aura de Medo", "Técnica Amaldiçoada Inata"],
  },
  {
    name: "Espírito Amaldiçoado Vingativo",
    desc: "Humanos que se tornaram maldição após a morte",
    bonus: "+2 em dois atributos",
    features: ["Técnica Amaldiçoada Preservada", "Vínculo com local ou objeto"],
  },
  {
    name: "Feiticeiro Renegado",
    desc: "Feiticeiro humano que usa jujutsu para seus próprios fins",
    bonus: "Padrão de personagem",
    features: ["Técnica Amaldiçoada", "Uso de ferramentas amaldiçoadas"],
  },
  {
    name: "Criatura Amaldiçoada",
    desc: "Animal ou ser possuído por energia amaldiçoada",
    bonus: "+2 Destreza, +2 Constituição",
    features: ["Sentidos Aguçados", "Ataque Natural (1d8)"],
  },
  {
    name: "Corpo Amaldiçoado Artificial",
    desc: "Criado artificialmente, núcleo como coração",
    bonus: "+3 Constituição",
    features: ["Núcleo (vulnerabilidade e resistência)", "Não sente dor", "Imunidade a mental"],
  },
] as const;