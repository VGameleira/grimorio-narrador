import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { npcSchema } from "@/lib/validations";
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

  const npc = await prisma.npc.findUnique({
    where: { id },
    include: {
      relationshipsFrom: {
        include: { toNPC: { select: { id: true, name: true, status: true } } },
      },
      relationshipsTo: {
        include: {
          fromNPC: { select: { id: true, name: true, status: true } },
        },
      },
    },
  });

  if (!npc) {
    return NextResponse.json({ error: "NPC not found" }, { status: 404 });
  }

  return NextResponse.json(npc);
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
  const result = npcSchema.partial().safeParse(body);
  if (!result.success) {
    return NextResponse.json(
      { error: result.error.issues[0].message },
      { status: 400 }
    );
  }

  const npc = await prisma.npc.update({
    where: { id },
    data: result.data,
  });

  await createAuditLog({
    userId: session.user.id,
    action: "UPDATE",
    entity: "npc",
    entityId: id,
    campaignId,
    details: result.data,
  });

  return NextResponse.json(npc);
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

  await prisma.npc.delete({ where: { id } });

  await createAuditLog({
    userId: session.user.id,
    action: "DELETE",
    entity: "npc",
    entityId: id,
    campaignId,
  });

  return NextResponse.json({ message: "NPC deleted" });
}
