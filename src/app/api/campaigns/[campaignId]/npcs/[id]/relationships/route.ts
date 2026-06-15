import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { npcRelationshipSchema } from "@/lib/validations";
import { createAuditLog } from "@/lib/audit";

export async function GET(
  _req: NextRequest,
  context: { params: Promise<{ campaignId: string; id: string }> }
) {
  const { id } = await context.params;
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const relationships = await prisma.npcRelationship.findMany({
    where: {
      OR: [{ fromNPCId: id }, { toNPCId: id }],
    },
    include: {
      fromNPC: { select: { id: true, name: true, status: true } },
      toNPC: { select: { id: true, name: true, status: true } },
    },
  });

  return NextResponse.json(relationships);
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
  const result = npcRelationshipSchema.safeParse(body);
  if (!result.success) {
    return NextResponse.json(
      { error: result.error.issues[0].message },
      { status: 400 }
    );
  }

  const relationship = await prisma.npcRelationship.create({
    data: {
      type: result.data.type,
      description: result.data.description,
      fromNPCId: id,
      toNPCId: result.data.toNPCId,
    },
    include: {
      fromNPC: { select: { id: true, name: true } },
      toNPC: { select: { id: true, name: true } },
    },
  });

  await createAuditLog({
    userId: session.user.id,
    action: "CREATE",
    entity: "npc_relationship",
    entityId: relationship.id,
    campaignId,
    details: { from: id, to: result.data.toNPCId, type: result.data.type },
  });

  return NextResponse.json(relationship, { status: 201 });
}
