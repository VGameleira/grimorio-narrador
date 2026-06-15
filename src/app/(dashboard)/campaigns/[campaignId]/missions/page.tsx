import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { PageHeader } from "@/components/shared/page-header";
import { Button } from "@/components/ui/button";
import { PlusIcon } from "lucide-react";
import { MissionBoard } from "@/components/mission/mission-board";

export default async function MissionsPage({
  params,
}: {
  params: Promise<{ campaignId: string }>;
}) {
  const { campaignId } = await params;
  const session = await auth();
  if (!session?.user) redirect("/login");

  const missions = await prisma.mission.findMany({
    where: { campaignId },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div>
      <PageHeader
        title="Missões"
        action={
          <Button>
            <PlusIcon className="h-4 w-4" />
            Nova Missão
          </Button>
        }
      />
      <MissionBoard missions={missions} campaignId={campaignId} />
    </div>
  );
}
