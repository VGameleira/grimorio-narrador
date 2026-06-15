import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import Link from "next/link";
import { PageHeader } from "@/components/shared/page-header";
import { Button } from "@/components/ui/button";
import { Plus, Swords } from "lucide-react";
import { CampaignCard } from "@/components/campaign/campaign-card";
import { EmptyState } from "@/components/shared/empty-state";
export default async function CampaignsPage() {
  const session = await auth();
  if (!session?.user) redirect("/login");
  const campaigns = await prisma.campaign.findMany({
    where: { members: { some: { userId: session.user.id } } },
    include: {
      _count: { select: { sessions: true, npcs: true, missions: true } },
      members: { where: { userId: session.user.id }, select: { role: true } },
    },
    orderBy: { updatedAt: "desc" },
  });
  return (
    <div>
      {" "}
      <PageHeader
        title="Campanhas"
        description="Gerencie suas campanhas de RPG"
        action={
          <Link
            href="/campaigns/new"
            className="inline-flex items-center justify-center rounded-lg bg-primary text-primary-foreground hover:bg-primary/80 h-9 px-4 py-2 text-sm font-medium whitespace-nowrap"
          >
            <Plus className="mr-2 h-4 w-4" />
            Nova Campanha
          </Link>
        }
      />{" "}
      {campaigns.length === 0 ? (
        <EmptyState
          icon={Swords}
          title="Nenhuma campanha ainda"
          description="Crie sua primeira campanha para começar a aventura"
          action={
            <Link
              href="/campaigns/new"
              className="inline-flex items-center justify-center rounded-lg bg-primary text-primary-foreground hover:bg-primary/80 h-9 px-4 py-2 text-sm font-medium whitespace-nowrap"
            >
              <Plus className="mr-2 h-4 w-4" />
              Criar Campanha
            </Link>
          }
        />
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {" "}
          {campaigns.map((campaign) => (
            <CampaignCard
              key={campaign.id}
              campaign={campaign}
              isMaster={campaign.members[0]?.role === "MASTER"}
            />
          ))}{" "}
        </div>
      )}{" "}
    </div>
  );
}
