import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { PageHeader } from "@/components/shared/page-header";
import { FactionList } from "@/components/faction/faction-list";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import Link from "next/link";

export default async function FactionsPage({
  params,
}: {
  params: Promise<{ campaignId: string }>;
}) {
  const { campaignId } = await params;
  const session = await auth();
  if (!session?.user) redirect("/login");

  const member = await prisma.campaignMember.findUnique({
    where: { userId_campaignId: { userId: session.user.id, campaignId } },
  });
  if (!member) redirect("/campaigns");

  const isMaster = member.role === "MASTER";

  const factions = await prisma.faction.findMany({
    where: { campaignId },
    include: {
      _count: { select: { relationsFrom: true } },
    },
    orderBy: { name: "asc" },
  });

  return (
    <div>
      <PageHeader
        title="Facções"
        description="Organizações e grupos que atuam na campanha"
        action={
          isMaster && (
            <Link href={`/campaigns/${campaignId}/factions/new`}>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Nova Facção
              </Button>
            </Link>
          )
        }
      />
      <FactionList
        factions={factions}
        campaignId={campaignId}
        isMaster={isMaster}
      />
    </div>
  );
}
