import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { missionSchema } from "@/lib/validations";
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

  const mission = await prisma.mission.findFirst({
    where: { id, campaignId },
  });

  if (!mission) {
    return NextResponse.json({ error: "Mission not found" }, { status: 404 });
  }

  return NextResponse.json(mission);
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
  const result = missionSchema.partial().safeParse(body);
  if (!result.success) {
    return NextResponse.json(
      { error: result.error.issues[0].message },
      { status: 400 }
    );
  }

  const mission = await prisma.mission.updateMany({
    where: { id, campaignId },
    data: result.data,
  });

  if (mission.count === 0) {
    return NextResponse.json({ error: "Mission not found" }, { status: 404 });
  }

  await createAuditLog({
    userId: session.user.id,
    action: "UPDATE",
    entity: "mission",
    entityId: id,
    campaignId,
    details: result.data,
  });

  const updated = await prisma.mission.findUnique({ where: { id } });
  return NextResponse.json(updated);
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

  const mission = await prisma.mission.deleteMany({
    where: { id, campaignId },
  });

  if (mission.count === 0) {
    return NextResponse.json({ error: "Mission not found" }, { status: 404 });
  }

  await createAuditLog({
    userId: session.user.id,
    action: "DELETE",
    entity: "mission",
    entityId: id,
    campaignId,
  });

  return NextResponse.json({ message: "Mission deleted" });
}
