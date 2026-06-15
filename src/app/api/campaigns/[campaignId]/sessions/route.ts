import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { sessionSchema } from "@/lib/validations";
import { createAuditLog } from "@/lib/audit";

export async function GET(
  _req: NextRequest,
  context: { params: Promise<{ campaignId: string }> }
) {
  const { campaignId } = await context.params;
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const sessions = await prisma.gameSession.findMany({
    where: { campaignId },
    include: {
      master: { select: { id: true, name: true, image: true } },
      npcs: {
        include: {
          npc: { select: { id: true, name: true, image: true } },
        },
      },
    },
    orderBy: { number: "desc" },
  });

  return NextResponse.json(sessions);
}

export async function POST(
  req: NextRequest,
  context: { params: Promise<{ campaignId: string }> }
) {
  const { campaignId } = await context.params;
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const member = await prisma.campaignMember.findUnique({
    where: {
      userId_campaignId: { userId: session.user.id, campaignId },
    },
  });

  if (!member || member.role !== "MASTER") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const body = await req.json();
  const result = sessionSchema.safeParse(body);
  if (!result.success) {
    return NextResponse.json(
      { error: result.error.issues[0].message },
      { status: 400 }
    );
  }

  const { npcIds, date, ...data } = result.data;

  const gameSession = await prisma.gameSession.create({
    data: {
      ...data,
      date: date ? new Date(date) : null,
      campaignId,
      masterId: session.user.id,
      npcs: npcIds?.length
        ? {
            create: npcIds.map((npcId) => ({ npcId })),
          }
        : undefined,
    },
    include: {
      master: { select: { id: true, name: true, image: true } },
      npcs: {
        include: {
          npc: { select: { id: true, name: true, image: true } },
        },
      },
    },
  });

  await createAuditLog({
    userId: session.user.id,
    action: "CREATE",
    entity: "session",
    entityId: gameSession.id,
    campaignId,
    details: { number: gameSession.number },
  });

  return NextResponse.json(gameSession, { status: 201 });
}
