import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { campaignSchema } from "@/lib/validations";
import { createAuditLog } from "@/lib/audit";
export async function GET() {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const campaigns = await prisma.campaign.findMany({
    where: { members: { some: { userId: session.user.id } } },
    include: {
      _count: { select: { sessions: true, npcs: true, missions: true } },
    },
    orderBy: { updatedAt: "desc" },
  });
  return NextResponse.json(campaigns);
}
export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const body = await req.json();
  const result = campaignSchema.safeParse(body);
  if (!result.success) {
    return NextResponse.json(
      { error: result.error.issues[0].message },
      { status: 400 }
    );
  }
  const campaign = await prisma.campaign.create({
    data: {
      ...result.data,
      members: { create: { userId: session.user.id, role: "MASTER" } },
    },
  });
  await createAuditLog({
    userId: session.user.id,
    action: "CREATE",
    entity: "campaign",
    entityId: campaign.id,
    details: { name: campaign.name },
  });
  return NextResponse.json(campaign, { status: 201 });
}
