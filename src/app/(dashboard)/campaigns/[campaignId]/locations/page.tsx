import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { PageHeader } from "@/components/shared/page-header";
import { LocationList } from "@/components/location/location-list";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import Link from "next/link";

export default async function LocationsPage({
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

  const locations = await prisma.location.findMany({
    where: { campaignId },
    include: {
      _count: { select: { npcs: true, events: true } },
    },
    orderBy: { name: "asc" },
  });

  return (
    <div>
      <PageHeader
        title="Locais"
        description="Locais importantes da campanha"
        action={
          isMaster && (
            <Link href={`/campaigns/${campaignId}/locations/new`}>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Novo Local
              </Button>
            </Link>
          )
        }
      />
      <LocationList
        locations={locations}
        campaignId={campaignId}
        isMaster={isMaster}
      />
    </div>
  );
}
