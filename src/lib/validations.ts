import { z } from "zod";
export const loginSchema = z.object({
  email: z.string().email("Email inválido"),
  password: z.string().min(6, "Senha deve ter no mínimo 6 caracteres"),
});
export const registerSchema = z
  .object({
    name: z.string().min(2, "Nome deve ter no mínimo 2 caracteres"),
    email: z.string().email("Email inválido"),
    password: z.string().min(6, "Senha deve ter no mínimo 6 caracteres"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Senhas não conferem",
    path: ["confirmPassword"],
  });
export const campaignSchema = z.object({
  name: z.string().min(2, "Nome deve ter no mínimo 2 caracteres"),
  description: z.string().optional(),
  coverImage: z.string().optional(),
  status: z.enum(["ACTIVE", "PAUSED", "COMPLETED", "ARCHIVED"]).optional(),
  avgLevel: z.number().int().min(1).optional(),
  system: z.string().optional(),
});
export const npcSchema = z.object({
  name: z.string().min(1, "Nome é obrigatório"),
  image: z.string().optional(),
  age: z.string().optional(),
  organization: z.string().optional(),
  objectives: z.string().optional(),
  personality: z.string().optional(),
  backstory: z.string().optional(),
  secrets: z.string().optional(),
  status: z.enum(["ALIVE", "DEAD", "MISSING", "UNKNOWN"]).optional(),
  isPublic: z.boolean().optional(),
});
export const npcRelationshipSchema = z.object({
  type: z.string().min(1, "Tipo de relacionamento é obrigatório"),
  description: z.string().optional(),
  toNPCId: z.string().min(1, "NPC alvo é obrigatório"),
});
export const missionSchema = z.object({
  title: z.string().min(1, "Título é obrigatório"),
  grade: z.string().optional(),
  description: z.string().optional(),
  objectives: z.string().optional(),
  reward: z.string().optional(),
  status: z
    .enum(["AVAILABLE", "IN_PROGRESS", "COMPLETED", "FAILED"])
    .optional(),
});
export const sessionSchema = z.object({
  number: z.number().int().min(1),
  summary: z.string().optional(),
  content: z.string().optional(),
  date: z.string().optional(),
  importantEvents: z.string().optional(),
  consequences: z.string().optional(),
  nextHooks: z.string().optional(),
  npcIds: z.array(z.string()).optional(),
});
export const factionSchema = z.object({
  name: z.string().min(1, "Nome é obrigatório"),
  image: z.string().optional(),
  description: z.string().optional(),
  influence: z.number().int().min(0).optional(),
  resources: z.number().int().min(0).optional(),
});
export const factionRelationSchema = z.object({
  type: z.enum(["ALLIANCE", "RIVALRY", "NEUTRAL", "HOSTILE", "FRIENDLY"]),
  description: z.string().optional(),
  toFactionId: z.string().min(1, "Facção alvo é obrigatória"),
});
export const locationSchema = z.object({
  name: z.string().min(1, "Nome é obrigatório"),
  image: z.string().optional(),
  description: z.string().optional(),
  mapData: z.any().optional(),
  npcIds: z.array(z.string()).optional(),
});
export const timelineEventSchema = z.object({
  title: z.string().min(1, "Título é obrigatório"),
  description: z.string().optional(),
  date: z.string().optional(),
  dateText: z.string().optional(),
  order: z.number().int().optional().default(0),
  type: z.string().optional(),
  locationId: z.string().optional(),
});
export const wikiPageSchema = z.object({
  title: z.string().min(1, "Título é obrigatório"),
  content: z.string().optional(),
  type: z.string().optional(),
  referenceId: z.string().optional(),
});
export const noteSchema = z.object({
  title: z.string().optional(),
  content: z.string().optional(),
  pinned: z.boolean().optional(),
  campaignId: z.string().optional(),
});
export const aiGenerateSchema = z.object({
  type: z.enum(["npc", "mission", "curse", "technique", "arc", "session"]),
  campaignId: z.string().min(1),
  tone: z.string().optional(),
  grade: z.string().optional(),
  theme: z.string().optional(),
  description: z.string().optional(),
});
