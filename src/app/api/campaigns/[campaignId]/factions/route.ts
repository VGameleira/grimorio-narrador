import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { factionSchema } from "@/lib/validations";
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

  const factions = await prisma.faction.findMany({
    where: { campaignId },
    include: {
      _count: { select: { relationsFrom: true } },
    },
    orderBy: { name: "asc" },
  });

  return NextResponse.json(factions);
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
  const result = factionSchema.safeParse(body);
  if (!result.success) {
    return NextResponse.json(
      { error: result.error.issues[0].message },
      { status: 400 }
    );
  }

  const faction = await prisma.faction.create({
    data: {
      ...result.data,
      campaignId,
    },
  });

  await createAuditLog({
    userId: session.user.id,
    action: "CREATE",
    entity: "faction",
    entityId: faction.id,
    campaignId,
    details: { name: faction.name },
  });

  return NextResponse.json(faction, { status: 201 });
}
