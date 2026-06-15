import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { streamChat } from "@/lib/openai";
import { buildSystemPrompt } from "@/lib/ai-prompts";
import { createAuditLog } from "@/lib/audit";
export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  if (session.user.role !== "MASTER") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }
  const { campaignId, messages, message } = await req.json();
  if (!campaignId || !message) {
    return NextResponse.json(
      { error: "campaignId and message are required" },
      { status: 400 }
    );
  }
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
  const chatMessages = [
    ...(messages ?? []),
    { role: "user" as const, content: message },
  ];
  try {
    const stream = await streamChat({ systemPrompt, messages: chatMessages });
    if (!stream) {
      return NextResponse.json(
        { error: "IA não configurada. Configure OPENAI_API_KEY" },
        { status: 500 }
      );
    }
    const encoder = new TextEncoder();
    const readable = new ReadableStream({
      async start(controller) {
        for await (const chunk of stream) {
          const content = chunk.choices[0]?.delta?.content ?? "";
          if (content) {
            controller.enqueue(encoder.encode(content));
          }
        }
        controller.close();
      },
    });
    await createAuditLog({
      userId: session.user.id,
      action: "AI_CHAT",
      entity: "ai_chat",
      campaignId,
      details: { messageLength: message.length },
    });
    return new NextResponse(readable, {
      headers: { "Content-Type": "text/plain; charset=utf-8" },
    });
  } catch (error) {
    console.error("AI chat error:", error);
    return NextResponse.json(
      { error: "Falha ao processar mensagem com IA" },
      { status: 500 }
    );
  }
}
