import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect, notFound } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatDate } from "@/lib/utils";

export default async function SessionDetailPage({
  params,
}: {
  params: Promise<{ campaignId: string; id: string }>;
}) {
  const { campaignId, id } = await params;
  const session = await auth();
  if (!session?.user) redirect("/login");

  const gameSession = await prisma.gameSession.findFirst({
    where: { id, campaignId },
    include: {
      master: { select: { id: true, name: true, image: true } },
      npcs: {
        include: {
          npc: { select: { id: true, name: true, image: true } },
        },
      },
    },
  });

  if (!gameSession) notFound();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">
          Sessão {gameSession.number}
        </h1>
        {gameSession.date && (
          <p className="mt-1 text-sm text-muted-foreground">
            {formatDate(gameSession.date)}
          </p>
        )}
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {gameSession.summary && (
          <Card className="md:col-span-2">
            <CardHeader>
              <CardTitle>Resumo</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground whitespace-pre-wrap">
                {gameSession.summary}
              </p>
            </CardContent>
          </Card>
        )}

        {gameSession.importantEvents && (
          <Card>
            <CardHeader>
              <CardTitle>Eventos Importantes</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground whitespace-pre-wrap">
                {gameSession.importantEvents}
              </p>
            </CardContent>
          </Card>
        )}

        {gameSession.consequences && (
          <Card>
            <CardHeader>
              <CardTitle>Consequências</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground whitespace-pre-wrap">
                {gameSession.consequences}
              </p>
            </CardContent>
          </Card>
        )}

        {gameSession.nextHooks && (
          <Card>
            <CardHeader>
              <CardTitle>Próximos Ganchos</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground whitespace-pre-wrap">
                {gameSession.nextHooks}
              </p>
            </CardContent>
          </Card>
        )}

        {gameSession.npcs.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>NPCs Presentes</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {gameSession.npcs.map((sn) => (
                  <Badge key={sn.npc.id} variant="secondary">
                    {sn.npc.name}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {gameSession.content && (
          <Card className="md:col-span-2">
            <CardHeader>
              <CardTitle>Conteúdo da Sessão</CardTitle>
            </CardHeader>
            <CardContent>
              <div
                className="prose prose-sm dark:prose-invert max-w-none"
                dangerouslySetInnerHTML={{ __html: gameSession.content }}
              />
            </CardContent>
          </Card>
        )}

        <Card>
          <CardHeader>
            <CardTitle>Detalhes</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Mestre</span>
              <span>{gameSession.master.name ?? "Desconhecido"}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Criada em</span>
              <span>{formatDate(gameSession.createdAt)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Atualizada em</span>
              <span>{formatDate(gameSession.updatedAt)}</span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
