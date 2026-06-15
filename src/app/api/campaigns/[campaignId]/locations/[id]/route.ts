import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { locationSchema } from "@/lib/validations";
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

  const location = await prisma.location.findUnique({
    where: { id },
    include: {
      npcs: {
        include: { npc: { select: { id: true, name: true } } },
      },
      events: {
        select: { id: true, title: true, dateText: true, type: true },
        orderBy: { order: "asc" },
      },
    },
  });

  if (!location || location.campaignId !== campaignId) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  return NextResponse.json(location);
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
  const result = locationSchema.partial().safeParse(body);
  if (!result.success) {
    return NextResponse.json(
      { error: result.error.issues[0].message },
      { status: 400 }
    );
  }

  const { npcIds, ...locationData } = result.data;

  const location = await prisma.location.update({
    where: { id },
    data: {
      ...locationData,
      npcs: npcIds
        ? {
            deleteMany: {},
            create: npcIds.map((npcId: string) => ({ npcId })),
          }
        : undefined,
    },
  });

  await createAuditLog({
    userId: session.user.id,
    action: "UPDATE",
    entity: "location",
    entityId: id,
    campaignId,
    details: locationData,
  });

  return NextResponse.json(location);
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

  await prisma.location.delete({ where: { id } });

  await createAuditLog({
    userId: session.user.id,
    action: "DELETE",
    entity: "location",
    entityId: id,
    campaignId,
  });

  return NextResponse.json({ message: "Location deleted" });
}
