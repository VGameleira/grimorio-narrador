import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { timelineEventSchema } from "@/lib/validations";
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

  const events = await prisma.timelineEvent.findMany({
    where: { campaignId },
    include: {
      location: { select: { id: true, name: true } },
    },
    orderBy: { order: "asc" },
  });

  return NextResponse.json(events);
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
  const result = timelineEventSchema.safeParse(body);
  if (!result.success) {
    return NextResponse.json(
      { error: result.error.issues[0].message },
      { status: 400 }
    );
  }

  const event = await prisma.timelineEvent.create({
    data: {
      ...result.data,
      campaignId,
    },
  });

  await createAuditLog({
    userId: session.user.id,
    action: "CREATE",
    entity: "timelineEvent",
    entityId: event.id,
    campaignId,
    details: { title: event.title },
  });

  return NextResponse.json(event, { status: 201 });
}
