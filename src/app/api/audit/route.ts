import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
export async function GET(req: NextRequest) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  if (session.user.role !== "MASTER") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }
  const campaignId = req.nextUrl.searchParams.get("campaignId");
  const limit = Math.min(
    parseInt(req.nextUrl.searchParams.get("limit") ?? "50"),
    100
  );
  const where = campaignId ? { campaignId } : {};
  const logs = await prisma.auditLog.findMany({
    where,
    include: { user: { select: { id: true, name: true, image: true } } },
    orderBy: { createdAt: "desc" },
    take: limit,
  });
  return NextResponse.json(logs);
}
