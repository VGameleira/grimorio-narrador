import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

export async function GET(
  _req: NextRequest,
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

  const npcsWithSecrets = await prisma.npc.findMany({
    where: {
      campaignId,
      secrets: { not: null },
    },
    select: {
      id: true,
      name: true,
      secrets: true,
    },
    orderBy: { name: "asc" },
  });

  const hiddenNpcs = await prisma.npc.findMany({
    where: {
      campaignId,
      isPublic: false,
    },
    select: {
      id: true,
      name: true,
    },
    orderBy: { name: "asc" },
  });

  return NextResponse.json({
    npcSecrets: npcsWithSecrets,
    hiddenNpcs,
  });
}
