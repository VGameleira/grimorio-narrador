import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { wikiPageSchema } from "@/lib/validations";
import { createAuditLog } from "@/lib/audit";
import { slugify } from "@/lib/utils";

export async function GET(
  _req: NextRequest,
  context: { params: Promise<{ campaignId: string }> }
) {
  const { campaignId } = await context.params;
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const pages = await prisma.wikiPage.findMany({
    where: { campaignId },
    orderBy: { updatedAt: "desc" },
  });

  return NextResponse.json(pages);
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
  const result = wikiPageSchema.safeParse(body);
  if (!result.success) {
    return NextResponse.json(
      { error: result.error.issues[0].message },
      { status: 400 }
    );
  }

  let slug = slugify(result.data.title);

  const existing = await prisma.wikiPage.findUnique({
    where: { campaignId_slug: { campaignId, slug } },
  });

  if (existing) {
    slug = `${slug}-${Date.now()}`;
  }

  const page = await prisma.wikiPage.create({
    data: {
      title: result.data.title,
      slug,
      content: result.data.content ?? "",
      type: result.data.type ?? "geral",
      referenceId: result.data.referenceId,
      campaignId,
    },
  });

  await createAuditLog({
    userId: session.user.id,
    action: "CREATE",
    entity: "wiki",
    entityId: page.id,
    campaignId,
    details: { title: page.title, slug },
  });

  return NextResponse.json(page, { status: 201 });
}
