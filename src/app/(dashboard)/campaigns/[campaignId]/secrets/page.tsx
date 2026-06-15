import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect, notFound } from "next/navigation";
import { PageHeader } from "@/components/shared/page-header";
import { EyeOff, AlertTriangle } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";

export default async function SecretsPage({
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
  if (member.role !== "MASTER") notFound();

  const campaign = await prisma.campaign.findUnique({
    where: { id: campaignId },
    select: { name: true },
  });

  if (!campaign) notFound();

  const npcsWithSecrets = await prisma.npc.findMany({
    where: {
      campaignId,
      secrets: { not: null },
    },
    select: {
      id: true,
      name: true,
      secrets: true,
    },
    orderBy: { name: "asc" },
  });

  const hiddenNpcs = await prisma.npc.findMany({
    where: {
      campaignId,
      isPublic: false,
    },
    select: {
      id: true,
      name: true,
      isPublic: true,
    },
    orderBy: { name: "asc" },
  });

  return (
    <div>
      <PageHeader
        title="Segredos"
        description={`Informações ocultas da campanha ${campaign.name}`}
      />

      <Alert className="mb-6">
        <AlertTriangle className="h-4 w-4" />
        <AlertDescription>
          Esta página contém informações que apenas o Mestre pode ver. NPCs e
          segredos aqui listados não são visíveis para jogadores.
        </AlertDescription>
      </Alert>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <EyeOff className="h-5 w-5" />
              Segredos de NPCs
            </CardTitle>
            <CardDescription>
              Segredos e informações ocultas dos NPCs
            </CardDescription>
          </CardHeader>
          <CardContent>
            {npcsWithSecrets.length === 0 ? (
              <p className="text-sm text-muted-foreground">
                Nenhum NPC possui segredos registrados
              </p>
            ) : (
              <div className="space-y-4">
                {npcsWithSecrets.map((npc) => (
                  <div
                    key={npc.id}
                    className="rounded-lg border border-border p-4"
                  >
                    <h4 className="font-medium text-sm mb-2">{npc.name}</h4>
                    <p className="text-sm text-muted-foreground whitespace-pre-wrap">
                      {npc.secrets}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <EyeOff className="h-5 w-5" />
              NPCs Ocultos
            </CardTitle>
            <CardDescription>
              NPCs que não estão visíveis para jogadores
            </CardDescription>
          </CardHeader>
          <CardContent>
            {hiddenNpcs.length === 0 ? (
              <p className="text-sm text-muted-foreground">Nenhum NPC oculto</p>
            ) : (
              <div className="space-y-2">
                {hiddenNpcs.map((npc) => (
                  <div
                    key={npc.id}
                    className="rounded-lg border border-border p-3 text-sm"
                  >
                    {npc.name}
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
