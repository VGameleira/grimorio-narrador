import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { sessionSchema } from "@/lib/validations";
import { createAuditLog } from "@/lib/audit";

export async function GET(
  _req: NextRequest,
  context: { params: Promise<{ campaignId: string; id: string }> }
) {
  const { campaignId, id } = await context.params;
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const gameSession = await prisma.gameSession.findFirst({
    where: { id, campaignId },
    include: {
      master: { select: { id: true, name: true, image: true } },
      npcs: {
        include: {
          npc: { select: { id: true, name: true, image: true } },
        },
      },
    },
  });

  if (!gameSession) {
    return NextResponse.json({ error: "Session not found" }, { status: 404 });
  }

  return NextResponse.json(gameSession);
}

export async function PUT(
  req: NextRequest,
  context: { params: Promise<{ campaignId: string; id: string }> }
) {
  const { campaignId, id } = await context.params;
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
  const result = sessionSchema.partial().safeParse(body);
  if (!result.success) {
    return NextResponse.json(
      { error: result.error.issues[0].message },
      { status: 400 }
    );
  }

  const { npcIds, date, ...data } = result.data;

  if (npcIds !== undefined) {
    await prisma.sessionNpc.deleteMany({ where: { sessionId: id } });
    if (npcIds.length > 0) {
      await prisma.sessionNpc.createMany({
        data: npcIds.map((npcId) => ({ sessionId: id, npcId })),
      });
    }
  }

  const gameSession = await prisma.gameSession.updateMany({
    where: { id, campaignId },
    data: {
      ...data,
      ...(date !== undefined ? { date: date ? new Date(date) : null } : {}),
    },
  });

  if (gameSession.count === 0) {
    return NextResponse.json({ error: "Session not found" }, { status: 404 });
  }

  await createAuditLog({
    userId: session.user.id,
    action: "UPDATE",
    entity: "session",
    entityId: id,
    campaignId,
    details: result.data,
  });

  const updated = await prisma.gameSession.findUnique({
    where: { id },
    include: {
      master: { select: { id: true, name: true, image: true } },
      npcs: {
        include: {
          npc: { select: { id: true, name: true, image: true } },
        },
      },
    },
  });
  return NextResponse.json(updated);
}

export async function DELETE(
  _req: NextRequest,
  context: { params: Promise<{ campaignId: string; id: string }> }
) {
  const { campaignId, id } = await context.params;
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

  const gameSession = await prisma.gameSession.deleteMany({
    where: { id, campaignId },
  });

  if (gameSession.count === 0) {
    return NextResponse.json({ error: "Session not found" }, { status: 404 });
  }

  await createAuditLog({
    userId: session.user.id,
    action: "DELETE",
    entity: "session",
    entityId: id,
    campaignId,
  });

  return NextResponse.json({ message: "Session deleted" });
}
