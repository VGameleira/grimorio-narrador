import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { factionRelationSchema } from "@/lib/validations";
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

  const relations = await prisma.factionRelation.findMany({
    where: {
      OR: [{ fromFactionId: id }, { toFactionId: id }],
      fromFaction: { campaignId },
    },
    include: {
      fromFaction: { select: { id: true, name: true } },
      toFaction: { select: { id: true, name: true } },
    },
  });

  return NextResponse.json(relations);
}

export async function POST(
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
  const result = factionRelationSchema.safeParse(body);
  if (!result.success) {
    return NextResponse.json(
      { error: result.error.issues[0].message },
      { status: 400 }
    );
  }

  const relation = await prisma.factionRelation.create({
    data: {
      type: result.data.type,
      description: result.data.description,
      fromFactionId: id,
      toFactionId: result.data.toFactionId,
    },
  });

  await createAuditLog({
    userId: session.user.id,
    action: "CREATE",
    entity: "factionRelation",
    entityId: relation.id,
    campaignId,
    details: { type: relation.type },
  });

  return NextResponse.json(relation, { status: 201 });
}

export async function DELETE(
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
  const { relationId } = body;
  if (!relationId) {
    return NextResponse.json(
      { error: "relationId is required" },
      { status: 400 }
    );
  }

  await prisma.factionRelation.delete({ where: { id: relationId } });

  await createAuditLog({
    userId: session.user.id,
    action: "DELETE",
    entity: "factionRelation",
    entityId: relationId,
    campaignId,
  });

  return NextResponse.json({ message: "Relation deleted" });
}
