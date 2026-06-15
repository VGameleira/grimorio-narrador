import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { notFound, redirect } from "next/navigation";
import { PageHeader } from "@/components/shared/page-header";
import { Button } from "@/components/ui/button";
import { Pencil } from "lucide-react";
import Link from "next/link";
import { MapPin, Users, Clock } from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";

export default async function LocationDetailPage({
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

  const location = await prisma.location.findUnique({
    where: { id },
    include: {
      npcs: {
        include: { npc: { select: { id: true, name: true } } },
      },
      events: {
        select: { id: true, title: true, dateText: true, type: true },
        orderBy: { order: "asc" },
      },
    },
  });

  if (!location || location.campaignId !== campaignId) notFound();

  return (
    <div>
      <PageHeader
        title={location.name}
        description="Detalhes do local"
        action={
          isMaster && (
            <Link href={`/campaigns/${campaignId}/locations/${id}/edit`}>
              <Button variant="outline">
                <Pencil className="mr-2 h-4 w-4" />
                Editar
              </Button>
            </Link>
          )
        }
      />

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-start gap-3">
                <div className="rounded-lg bg-muted p-3">
                  <MapPin className="h-6 w-6 text-muted-foreground" />
                </div>
                <div>
                  <CardTitle className="text-xl">{location.name}</CardTitle>
                  {location.description && (
                    <CardDescription className="mt-1">
                      {location.description}
                    </CardDescription>
                  )}
                </div>
              </div>
            </CardHeader>
          </Card>

          {location.events.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Clock className="h-5 w-5" />
                  Eventos neste local
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {location.events.map((event) => (
                    <Link
                      key={event.id}
                      href={`/campaigns/${campaignId}/timeline`}
                      className="flex items-center justify-between rounded-lg border border-border p-3 hover:border-primary/50 transition-colors"
                    >
                      <span className="text-sm font-medium">{event.title}</span>
                      <div className="flex items-center gap-2">
                        {event.dateText && (
                          <span className="text-xs text-muted-foreground">
                            {event.dateText}
                          </span>
                        )}
                        <span className="text-xs uppercase text-muted-foreground">
                          {event.type}
                        </span>
                      </div>
                    </Link>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        <div>
          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <Users className="h-4 w-4" />
                NPCs neste local
              </CardTitle>
            </CardHeader>
            <CardContent>
              {location.npcs.length === 0 ? (
                <p className="text-sm text-muted-foreground">
                  Nenhum NPC neste local
                </p>
              ) : (
                <div className="space-y-2">
                  {location.npcs.map((ln) => (
                    <Link
                      key={ln.npcId}
                      href={`/campaigns/${campaignId}/npcs/${ln.npc.id}`}
                      className="block rounded-md border border-border p-2 text-sm hover:border-primary/50 transition-colors"
                    >
                      {ln.npc.name}
                    </Link>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
