import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { PageHeader } from "@/components/shared/page-header";
import { StatsCards } from "@/components/dashboard/stats-cards";
import { NextSessionCard } from "@/components/dashboard/next-session-card";
import { ActiveMissionsWidget } from "@/components/dashboard/active-missions-widget";
import { RecentNPCsWidget } from "@/components/dashboard/recent-npcs-widget";
import { RecentEventsWidget } from "@/components/dashboard/recent-events-widget";
import { ScrollText } from "lucide-react";
export default async function DashboardPage() {
  const session = await auth();
  if (!session?.user) redirect("/login");
  const userId = session.user.id;
  const campaigns = await prisma.campaign.findMany({
    where: { members: { some: { userId } } },
    include: {
      _count: { select: { sessions: true, npcs: true, missions: true } },
      sessions: { orderBy: { date: "desc" }, take: 1 },
    },
    orderBy: { updatedAt: "desc" },
  });
  const totalCampaigns = campaigns.length;
  const totalSessions = campaigns.reduce(
    (acc, c) => acc + c._count.sessions,
    0
  );
  const totalNPCs = campaigns.reduce((acc, c) => acc + c._count.npcs, 0);
  const activeMissions = await prisma.mission.count({
    where: {
      campaign: { members: { some: { userId } } },
      status: "IN_PROGRESS",
    },
  });
  const recentNPCs = await prisma.npc.findMany({
    where: { campaign: { members: { some: { userId } } } },
    orderBy: { updatedAt: "desc" },
    take: 5,
    include: { campaign: { select: { name: true } } },
  });
  const recentTimeline = await prisma.timelineEvent.findMany({
    where: { campaign: { members: { some: { userId } } } },
    orderBy: { createdAt: "desc" },
    take: 5,
    include: { campaign: { select: { name: true } } },
  });
  const nextSession =
    campaigns
      .map((c) => {
        const lastSession = c.sessions[0];
        return lastSession?.date
          ? {
              date: lastSession.date,
              number: lastSession.number,
              campaign: c.name,
            }
          : null;
      })
      .filter(Boolean)[0] ?? null;
  return (
    <div>
      {" "}
      <PageHeader
        title={`Bem-vindo, ${session.user.name ?? "Narrador"}!`}
        description="Visão geral do seu grimório de campanhas"
      />{" "}
      <StatsCards
        totalCampaigns={totalCampaigns}
        totalSessions={totalSessions}
        totalNPCs={totalNPCs}
        activeMissions={activeMissions}
      />{" "}
      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        {" "}
        {nextSession ? (
          <NextSessionCard session={nextSession} />
        ) : (
          <div className="rounded-lg border border-border p-6">
            {" "}
            <div className="flex items-center gap-2 text-muted-foreground">
              {" "}
              <ScrollText className="h-5 w-5" />{" "}
              <span className="text-sm">Nenhuma sessão agendada</span>{" "}
            </div>{" "}
          </div>
        )}{" "}
        <ActiveMissionsWidget
          total={activeMissions}
          campaignCount={campaigns.length}
        />{" "}
      </div>{" "}
      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        {" "}
        <RecentNPCsWidget npcs={recentNPCs} />{" "}
        <RecentEventsWidget events={recentTimeline} />{" "}
      </div>{" "}
    </div>
  );
}
