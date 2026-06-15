import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect, notFound } from "next/navigation";
import { CampaignHeader } from "@/components/campaign/campaign-header";
import { CampaignTabs } from "@/components/campaign/campaign-tabs";
import { CampaignOverview } from "@/components/campaign/campaign-overview";

export default async function CampaignDetailPage({
  params,
}: {
  params: Promise<{ campaignId: string }>;
}) {
  const { campaignId } = await params;
  const session = await auth();
  if (!session?.user) redirect("/login");

  const campaign = await prisma.campaign.findUnique({
    where: { id: campaignId },
    include: {
      members: {
        where: { userId: session.user.id },
        select: { role: true },
      },
      _count: {
        select: {
          sessions: true,
          npcs: true,
          missions: true,
          factions: true,
          locations: true,
        },
      },
      sessions: {
        orderBy: { date: "desc" },
        take: 1,
      },
    },
  });

  if (!campaign) notFound();
  if (campaign.members.length === 0) redirect("/campaigns");

  const isMaster = campaign.members[0].role === "MASTER";

  return (
    <div>
      <CampaignHeader campaign={campaign} isMaster={isMaster} />
      <CampaignTabs campaignId={campaignId} isMaster={isMaster} />
      <div className="mt-6">
        <CampaignOverview campaign={campaign} />
      </div>
    </div>
  );
}
