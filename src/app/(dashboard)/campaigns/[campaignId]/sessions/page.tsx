import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { PageHeader } from "@/components/shared/page-header";
import { Button } from "@/components/ui/button";
import { PlusIcon } from "lucide-react";
import { SessionList } from "@/components/session/session-list";

export default async function SessionsPage({
  params,
}: {
  params: Promise<{ campaignId: string }>;
}) {
  const { campaignId } = await params;
  const session = await auth();
  if (!session?.user) redirect("/login");

  const sessions = await prisma.gameSession.findMany({
    where: { campaignId },
    include: {
      master: { select: { id: true, name: true, image: true } },
      _count: { select: { npcs: true } },
    },
    orderBy: { number: "desc" },
  });

  return (
    <div>
      <PageHeader
        title="Sessões"
        action={
          <Button>
            <PlusIcon className="h-4 w-4" />
            Nova Sessão
          </Button>
        }
      />
      <SessionList sessions={sessions} campaignId={campaignId} />
    </div>
  );
}
