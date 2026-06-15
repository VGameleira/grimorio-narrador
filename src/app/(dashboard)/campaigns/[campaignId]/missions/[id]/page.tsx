import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect, notFound } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatDate } from "@/lib/utils";

const statusLabels: Record<string, string> = {
  AVAILABLE: "Disponível",
  IN_PROGRESS: "Em Andamento",
  COMPLETED: "Concluída",
  FAILED: "Falha",
};

const statusVariants: Record<
  string,
  "default" | "secondary" | "destructive" | "outline"
> = {
  AVAILABLE: "outline",
  IN_PROGRESS: "default",
  COMPLETED: "secondary",
  FAILED: "destructive",
};

export default async function MissionDetailPage({
  params,
}: {
  params: Promise<{ campaignId: string; id: string }>;
}) {
  const { campaignId, id } = await params;
  const session = await auth();
  if (!session?.user) redirect("/login");

  const mission = await prisma.mission.findFirst({
    where: { id, campaignId },
  });

  if (!mission) notFound();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">{mission.title}</h1>
          <div className="mt-2 flex items-center gap-2">
            {mission.grade && <Badge variant="outline">{mission.grade}</Badge>}
            <Badge variant={statusVariants[mission.status]}>
              {statusLabels[mission.status]}
            </Badge>
          </div>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {mission.description && (
          <Card>
            <CardHeader>
              <CardTitle>Descrição</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground whitespace-pre-wrap">
                {mission.description}
              </p>
            </CardContent>
          </Card>
        )}

        {mission.objectives && (
          <Card>
            <CardHeader>
              <CardTitle>Objetivos</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground whitespace-pre-wrap">
                {mission.objectives}
              </p>
            </CardContent>
          </Card>
        )}

        {mission.reward && (
          <Card>
            <CardHeader>
              <CardTitle>Recompensa</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground whitespace-pre-wrap">
                {mission.reward}
              </p>
            </CardContent>
          </Card>
        )}

        <Card>
          <CardHeader>
            <CardTitle>Detalhes</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Criada em</span>
              <span>{formatDate(mission.createdAt)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Atualizada em</span>
              <span>{formatDate(mission.updatedAt)}</span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
