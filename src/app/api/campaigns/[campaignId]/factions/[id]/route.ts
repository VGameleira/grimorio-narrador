import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { factionSchema } from "@/lib/validations";
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

  const faction = await prisma.faction.findUnique({
    where: { id },
    include: {
      relationsFrom: {
        include: { toFaction: { select: { id: true, name: true } } },
      },
      relationsTo: {
        include: { fromFaction: { select: { id: true, name: true } } },
      },
    },
  });

  if (!faction || faction.campaignId !== campaignId) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  return NextResponse.json(faction);
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
  const result = factionSchema.partial().safeParse(body);
  if (!result.success) {
    return NextResponse.json(
      { error: result.error.issues[0].message },
      { status: 400 }
    );
  }

  const faction = await prisma.faction.update({
    where: { id },
    data: result.data,
  });

  await createAuditLog({
    userId: session.user.id,
    action: "UPDATE",
    entity: "faction",
    entityId: id,
    campaignId,
    details: result.data,
  });

  return NextResponse.json(faction);
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

  await prisma.faction.delete({ where: { id } });

  await createAuditLog({
    userId: session.user.id,
    action: "DELETE",
    entity: "faction",
    entityId: id,
    campaignId,
  });

  return NextResponse.json({ message: "Faction deleted" });
}
