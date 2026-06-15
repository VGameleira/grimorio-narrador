import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { notFound, redirect } from "next/navigation";
import { FactionDetail } from "@/components/faction/faction-detail";
import { PageHeader } from "@/components/shared/page-header";
import { Button } from "@/components/ui/button";
import { Pencil } from "lucide-react";
import Link from "next/link";

export default async function FactionDetailPage({
  params,
}: {
  params: Promise<{ campaignId: string; id: string }>;
}) {
  const { campaignId, id } = await params;
  const session = await auth();
  if (!session?.user) redirect("/login");

  const member = await prisma.campaignMember.findUnique({
    where: { userId_campaignId: { userId: session.user.id, campaignId } },
  });
  if (!member) redirect("/campaigns");

  const isMaster = member.role === "MASTER";

  const faction = await prisma.faction.findUnique({
    where: { id },
    include: {
      relationsFrom: {
        include: { toFaction: { select: { id: true, name: true } } },
      },
      relationsTo: {
        include: { fromFaction: { select: { id: true, name: true } } },
      },
    },
  });

  if (!faction || faction.campaignId !== campaignId) notFound();

  const allFactions = await prisma.faction.findMany({
    where: { campaignId, id: { not: id } },
    select: { id: true, name: true },
    orderBy: { name: "asc" },
  });

  return (
    <div>
      <PageHeader
        title={faction.name}
        description="Detalhes da facção"
        action={
          isMaster && (
            <Link href={`/campaigns/${campaignId}/factions/${id}/edit`}>
              <Button variant="outline">
                <Pencil className="mr-2 h-4 w-4" />
                Editar
              </Button>
            </Link>
          )
        }
      />
      <FactionDetail
        faction={faction}
        allFactions={allFactions}
        campaignId={campaignId}
        isMaster={isMaster}
      />
    </div>
  );
}
