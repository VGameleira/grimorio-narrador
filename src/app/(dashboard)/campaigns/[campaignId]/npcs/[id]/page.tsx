import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect, notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

export default async function NPCDetailPage({
  params,
}: {
  params: Promise<{ campaignId: string; id: string }>;
}) {
  const { campaignId, id } = await params;
  const session = await auth();
  if (!session?.user) redirect("/login");

  const npc = await prisma.npc.findUnique({
    where: { id },
    include: {
      relationshipsFrom: {
        include: { toNPC: { select: { id: true, name: true, status: true } } },
      },
      relationshipsTo: {
        include: {
          fromNPC: { select: { id: true, name: true, status: true } },
        },
      },
    },
  });

  if (!npc) notFound();

  const statusLabels: Record<string, string> = {
    ALIVE: "Vivo",
    DEAD: "Morto",
    MISSING: "Desaparecido",
    UNKNOWN: "Desconhecido",
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link
          href={`/campaigns/${campaignId}/npcs`}
          className="inline-flex items-center justify-center rounded-lg border border-transparent hover:bg-muted h-9 w-9"
        >
          <ArrowLeft className="h-4 w-4" />
        </Link>
        <div className="flex items-center gap-3">
          <Avatar className="h-12 w-12">
            <AvatarFallback className="bg-primary/20 text-primary text-lg">
              {npc.name.charAt(0).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-bold">{npc.name}</h1>
              <Badge
                variant={
                  npc.status === "ALIVE"
                    ? "default"
                    : npc.status === "DEAD"
                      ? "destructive"
                      : "secondary"
                }
              >
                {statusLabels[npc.status] ?? npc.status}
              </Badge>
            </div>
            <p className="text-sm text-muted-foreground">
              {npc.age && `${npc.age}`}
              {npc.age && npc.organization && " · "}
              {npc.organization}
            </p>
          </div>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {npc.objectives && (
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Objetivos</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground whitespace-pre-wrap">
                {npc.objectives}
              </p>
            </CardContent>
          </Card>
        )}
        {npc.personality && (
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Personalidade</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground whitespace-pre-wrap">
                {npc.personality}
              </p>
            </CardContent>
          </Card>
        )}
      </div>

      {npc.backstory && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">História</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground whitespace-pre-wrap">
              {npc.backstory}
            </p>
          </CardContent>
        </Card>
      )}

      {npc.secrets && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Segredos</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground whitespace-pre-wrap">
              {npc.secrets}
            </p>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <Users className="h-4 w-4" />
            Relacionamentos
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {npc.relationshipsFrom.map((rel) => (
              <div
                key={rel.id}
                className="flex items-center justify-between rounded-lg border border-border p-3"
              >
                <div className="flex items-center gap-2">
                  <Avatar className="h-8 w-8">
                    <AvatarFallback className="text-xs">
                      {rel.toNPC.name.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <Link
                      href={`/campaigns/${campaignId}/npcs/${rel.toNPC.id}`}
                      className="text-sm font-medium hover:text-primary"
                    >
                      {rel.toNPC.name}
                    </Link>
                    <p className="text-xs text-muted-foreground">{rel.type}</p>
                  </div>
                </div>
                <Badge variant="outline" className="text-[10px]">
                  {rel.toNPC.status}
                </Badge>
              </div>
            ))}
            {npc.relationshipsTo.map((rel) => (
              <div
                key={rel.id}
                className="flex items-center justify-between rounded-lg border border-border p-3"
              >
                <div className="flex items-center gap-2">
                  <Avatar className="h-8 w-8">
                    <AvatarFallback className="text-xs">
                      {rel.fromNPC.name.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <Link
                      href={`/campaigns/${campaignId}/npcs/${rel.fromNPC.id}`}
                      className="text-sm font-medium hover:text-primary"
                    >
                      {rel.fromNPC.name}
                    </Link>
                    <p className="text-xs text-muted-foreground">
                      {rel.type} (recíproco)
                    </p>
                  </div>
                </div>
                <Badge variant="outline" className="text-[10px]">
                  {rel.fromNPC.status}
                </Badge>
              </div>
            ))}
            {npc.relationshipsFrom.length === 0 &&
              npc.relationshipsTo.length === 0 && (
                <p className="text-sm text-muted-foreground">
                  Nenhum relacionamento registrado.
                </p>
              )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
