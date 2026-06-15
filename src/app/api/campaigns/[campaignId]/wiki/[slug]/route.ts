import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { wikiPageSchema } from "@/lib/validations";
import { createAuditLog } from "@/lib/audit";
import { slugify } from "@/lib/utils";

export async function GET(
  _req: NextRequest,
  context: { params: Promise<{ campaignId: string; slug: string }> }
) {
  const { campaignId, slug } = await context.params;
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const page = await prisma.wikiPage.findUnique({
    where: { campaignId_slug: { campaignId, slug } },
  });

  if (!page) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  return NextResponse.json(page);
}

export async function PUT(
  req: NextRequest,
  context: { params: Promise<{ campaignId: string; slug: string }> }
) {
  const { campaignId, slug } = await context.params;
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

  const existing = await prisma.wikiPage.findUnique({
    where: { campaignId_slug: { campaignId, slug } },
  });

  if (!existing) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const body = await req.json();
  const result = wikiPageSchema.partial().safeParse(body);
  if (!result.success) {
    return NextResponse.json(
      { error: result.error.issues[0].message },
      { status: 400 }
    );
  }

  const updateData: Record<string, unknown> = { ...result.data };

  if (result.data.title) {
    updateData.slug = slugify(result.data.title);
  }

  const page = await prisma.wikiPage.update({
    where: { id: existing.id },
    data: updateData,
  });

  await createAuditLog({
    userId: session.user.id,
    action: "UPDATE",
    entity: "wiki",
    entityId: page.id,
    campaignId,
    details: { title: page.title },
  });

  return NextResponse.json(page);
}

export async function DELETE(
  _req: NextRequest,
  context: { params: Promise<{ campaignId: string; slug: string }> }
) {
  const { campaignId, slug } = await context.params;
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

  const existing = await prisma.wikiPage.findUnique({
    where: { campaignId_slug: { campaignId, slug } },
  });

  if (!existing) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  await prisma.wikiPage.delete({ where: { id: existing.id } });

  await createAuditLog({
    userId: session.user.id,
    action: "DELETE",
    entity: "wiki",
    entityId: existing.id,
    campaignId,
  });

  return NextResponse.json({ message: "Wiki page deleted" });
}
