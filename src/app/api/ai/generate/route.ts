import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { aiGenerateSchema } from "@/lib/validations";
import { generateContent } from "@/lib/openai";
import { buildSystemPrompt, buildGenerationPrompt } from "@/lib/ai-prompts";
import { createAuditLog } from "@/lib/audit";
export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  if (session.user.role !== "MASTER") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }
  const body = await req.json();
  const result = aiGenerateSchema.safeParse(body);
  if (!result.success) {
    return NextResponse.json(
      { error: result.error.issues[0].message },
      { status: 400 }
    );
  }
  const { type, campaignId, tone, grade, theme, description } = result.data;
  const campaign = await prisma.campaign.findUnique({
    where: { id: campaignId },
    include: {
      npcs: { select: { name: true, personality: true, backstory: true } },
      locations: { select: { name: true, description: true } },
      factions: { select: { name: true, description: true } },
    },
  });
  if (!campaign) {
    return NextResponse.json({ error: "Campaign not found" }, { status: 404 });
  }
  const systemPrompt = buildSystemPrompt({
    name: campaign.name,
    system: campaign.system,
    avgLevel: campaign.avgLevel,
    npcs: campaign.npcs,
    locations: campaign.locations,
    factions: campaign.factions,
  });
  const userPrompt = buildGenerationPrompt({
    type,
    tone,
    grade,
    theme,
    description,
  });
  try {
    const content = await generateContent({ systemPrompt, userPrompt });
    let parsed: { title: string; content: string };
    try {
      parsed = JSON.parse(content);
    } catch {
      parsed = {
        title:
          type === "npc"
            ? "Novo NPC"
            : type === "mission"
              ? "Nova Missão"
              : "Conteúdo Gerado",
        content,
      };
    }
    await createAuditLog({
      userId: session.user.id,
      action: "AI_GENERATE",
      entity: "ai_generation",
      campaignId,
      details: { type, tone, grade, theme },
    });
    return NextResponse.json(parsed);
  } catch (error) {
    console.error("AI generation error:", error);
    return NextResponse.json(
      { error: "Falha ao gerar conteúdo com IA" },
      { status: 500 }
    );
  }
}
