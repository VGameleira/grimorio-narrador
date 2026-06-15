import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { npcSchema } from "@/lib/validations";
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

  const npcs = await prisma.npc.findMany({
    where: { campaignId },
    orderBy: { updatedAt: "desc" },
  });

  return NextResponse.json(npcs);
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
  const result = npcSchema.safeParse(body);
  if (!result.success) {
    return NextResponse.json(
      { error: result.error.issues[0].message },
      { status: 400 }
    );
  }

  const npc = await prisma.npc.create({
    data: {
      ...result.data,
      campaignId,
      creatorId: session.user.id,
    },
  });

  await createAuditLog({
    userId: session.user.id,
    action: "CREATE",
    entity: "npc",
    entityId: npc.id,
    campaignId,
    details: { name: npc.name },
  });

  return NextResponse.json(npc, { status: 201 });
}
