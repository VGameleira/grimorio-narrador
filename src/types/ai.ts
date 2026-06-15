export type AIGenerationType =
  | "npc"
  | "mission"
  | "curse"
  | "technique"
  | "arc"
  | "session";
export type AIGenerationParams = {
  type: AIGenerationType;
  campaignId: string;
  tone?: string;
  grade?: string;
  theme?: string;
  description?: string;
};
export type AIGenerationResult = {
  title: string;
  content: string;
  structured: Record<string, string | string[]>;
};
export type AIMessage = {
  role: "user" | "assistant" | "system";
  content: string;
};
export type AIChatRequest = {
  campaignId: string;
  messages: AIMessage[];
  message: string;
};
