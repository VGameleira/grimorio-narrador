import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import Link from "next/link";
import { PageHeader } from "@/components/shared/page-header";
import { Button } from "@/components/ui/button";
import { Plus, Users } from "lucide-react";
import { EmptyState } from "@/components/shared/empty-state";
import { NPCList } from "@/components/npc/npc-list";

export default async function NPCsPage({
  params,
}: {
  params: Promise<{ campaignId: string }>;
}) {
  const { campaignId } = await params;
  const session = await auth();
  if (!session?.user) redirect("/login");

  const npcs = await prisma.npc.findMany({
    where: { campaignId },
    orderBy: { updatedAt: "desc" },
  });

  return (
    <div>
      <PageHeader
        title="NPCs"
        description="Gerencie os personagens não-jogadores da campanha"
        action={
          <Link
            href={`/campaigns/${campaignId}/npcs/new`}
            className="inline-flex items-center justify-center rounded-lg bg-primary text-primary-foreground hover:bg-primary/80 h-9 px-4 py-2 text-sm font-medium whitespace-nowrap"
          >
            <Plus className="mr-2 h-4 w-4" />
            Novo NPC
          </Link>
        }
      />

      {npcs.length === 0 ? (
        <EmptyState
          icon={Users}
          title="Nenhum NPC ainda"
          description="Crie NPCs para povoar o mundo da sua campanha"
          action={
            <Link
              href={`/campaigns/${campaignId}/npcs/new`}
              className="inline-flex items-center justify-center rounded-lg bg-primary text-primary-foreground hover:bg-primary/80 h-9 px-4 py-2 text-sm font-medium whitespace-nowrap"
            >
              <Plus className="mr-2 h-4 w-4" />
              Criar NPC
            </Link>
          }
        />
      ) : (
        <NPCList npcs={npcs} campaignId={campaignId} />
      )}
    </div>
  );
}
