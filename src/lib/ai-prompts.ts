import type { AIGenerationType } from "@/types/ai";
type CampaignContext = {
  name: string;
  system: string;
  avgLevel: number;
  npcs: Array<{
    name: string;
    personality: string | null;
    backstory: string | null;
  }>;
  locations: Array<{ name: string; description: string | null }>;
  factions: Array<{ name: string; description: string | null }>;
};
export function buildSystemPrompt(context: CampaignContext): string {
  return `Você é um assistente de RPG especializado em ajudar mestres a criar conteúdo para suas campanhas.Contexto da Campanha:- Nome: ${context.name}- Sistema: ${context.system}- Nível Médio: ${context.avgLevel}NPCs Existentes:${context.npcs.map((n) => `- ${n.name}${n.personality ? `: ${n.personality}` : ""}`).join("\n")}Locais Existentes:${context.locations.map((l) => `- ${l.name}${l.description ? `: ${l.description}` : ""}`).join("\n")}Facções Existentes:${context.factions.map((f) => `- ${f.name}${f.description ? `: ${f.description}` : ""}`).join("\n")}Responda em português brasileiro. Sempre retorne JSON válido com os campos "title" (string) e "content" (string com HTML formatado).`;
}
function getGenerationInstructions(type: AIGenerationType): string {
  const instructions: Record<AIGenerationType, string> = {
    npc: `Crie um NPC completo para o RPG com:- Nome, idade, aparência- Personalidade (tracos, motivacoes, medos)- Historia e origem- Objetivos e segredos- Habilidades e fraquezas- Ganchos para missao`,
    mission: `Crie uma missao para o RPG com:- Titulo e tipo (principal, secundaria, pessoal)- Resumo da trama- Objetivos claros- NPCs envolvidos- Recompensas sugeridas- Dificuldade e grade recomendada`,
    curse: `Crie uma maledicao para o RPG com:- Nome e tipo- Origem e historia- Efeitos e manifestacoes- Condicoes para ativacao- Forma de quebra ou reversao- Nivel de poder`,
    technique: `Crie uma tecnica/habilidade para o RPG com:- Nome e categoria- Descricao dos efeitos- Custo e requisitos- Nivel minimo- Duração e alcance- Variantes ou evolucoes`,
    arc: `Crie um arco narrativo para a campanha com:- Titulo e tema central- Resumo da trama em 3 atos- NPCs principais e antagonistas- Locais importantes- Reviravoltas e revelacoes- Conexoes com a historia dos personagens`,
    session: `Crie uma sessao para o RPG com:- Resumo da sessao- Cenas planejadas- Encontros e desafios- NPCs que aparecem- Ganchos para proxima sessao- Notas para o mestre`,
  };
  return instructions[type];
}
export function buildGenerationPrompt(params: {
  type: AIGenerationType;
  tone?: string;
  grade?: string;
  theme?: string;
  description?: string;
}): string {
  const parts: string[] = [getGenerationInstructions(params.type)];
  if (params.tone) parts.push(`Tom: ${params.tone}`);
  if (params.grade) parts.push(`Grade/Nivel: ${params.grade}`);
  if (params.theme) parts.push(`Tema: ${params.theme}`);
  if (params.description)
    parts.push(`Descricao adicional: ${params.description}`);
  parts.push(
    '\nResponda APENAS com JSON no formato: { "title": "...", "content": "<html_formatado>" }'
  );
  return parts.join("\n");
}
