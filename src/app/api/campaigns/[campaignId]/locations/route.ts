import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { locationSchema } from "@/lib/validations";
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

  const locations = await prisma.location.findMany({
    where: { campaignId },
    include: {
      _count: { select: { npcs: true, events: true } },
    },
    orderBy: { name: "asc" },
  });

  return NextResponse.json(locations);
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
  const result = locationSchema.safeParse(body);
  if (!result.success) {
    return NextResponse.json(
      { error: result.error.issues[0].message },
      { status: 400 }
    );
  }

  const { npcIds, ...locationData } = result.data;

  const location = await prisma.location.create({
    data: {
      ...locationData,
      campaignId,
      npcs: npcIds?.length
        ? { create: npcIds.map((npcId: string) => ({ npcId })) }
        : undefined,
    },
  });

  await createAuditLog({
    userId: session.user.id,
    action: "CREATE",
    entity: "location",
    entityId: location.id,
    campaignId,
    details: { name: location.name },
  });

  return NextResponse.json(location, { status: 201 });
}
