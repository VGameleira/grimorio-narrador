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

  const [
    totalSessions,
    totalNPCs,
    totalMissions,
    totalFactions,
    totalLocations,
    totalWikiPages,
    totalTimelineEvents,
    activeMissions,
    recentSessions,
  ] = await Promise.all([
    prisma.gameSession.count({ where: { campaignId } }),
    prisma.npc.count({ where: { campaignId } }),
    prisma.mission.count({ where: { campaignId } }),
    prisma.faction.count({ where: { campaignId } }),
    prisma.location.count({ where: { campaignId } }),
    prisma.wikiPage.count({ where: { campaignId } }),
    prisma.timelineEvent.count({ where: { campaignId } }),
    prisma.mission.count({
      where: { campaignId, status: "IN_PROGRESS" },
    }),
    prisma.gameSession.findMany({
      where: { campaignId },
      orderBy: { date: "desc" },
      take: 5,
      select: { number: true, date: true, summary: true },
    }),
  ]);

  return NextResponse.json({
    totalSessions,
    totalNPCs,
    totalMissions,
    totalFactions,
    totalLocations,
    totalWikiPages,
    totalTimelineEvents,
    activeMissions,
    recentSessions,
  });
}
