import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { timelineEventSchema } from "@/lib/validations";
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

  const event = await prisma.timelineEvent.findUnique({
    where: { id },
    include: {
      location: { select: { id: true, name: true } },
    },
  });

  if (!event || event.campaignId !== campaignId) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  return NextResponse.json(event);
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
  const result = timelineEventSchema.partial().safeParse(body);
  if (!result.success) {
    return NextResponse.json(
      { error: result.error.issues[0].message },
      { status: 400 }
    );
  }

  const event = await prisma.timelineEvent.update({
    where: { id },
    data: result.data,
  });

  await createAuditLog({
    userId: session.user.id,
    action: "UPDATE",
    entity: "timelineEvent",
    entityId: id,
    campaignId,
    details: result.data,
  });

  return NextResponse.json(event);
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

  await prisma.timelineEvent.delete({ where: { id } });

  await createAuditLog({
    userId: session.user.id,
    action: "DELETE",
    entity: "timelineEvent",
    entityId: id,
    campaignId,
  });

  return NextResponse.json({ message: "Timeline event deleted" });
}
