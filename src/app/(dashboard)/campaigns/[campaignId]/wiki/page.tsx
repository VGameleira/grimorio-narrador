import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect, notFound } from "next/navigation";
import Link from "next/link";
import { PageHeader } from "@/components/shared/page-header";
import { EmptyState } from "@/components/shared/empty-state";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { BookOpen, Plus, FileText, Search } from "lucide-react";

export default async function WikiPage({
  params,
  searchParams,
}: {
  params: Promise<{ campaignId: string }>;
  searchParams: Promise<{ q?: string }>;
}) {
  const { campaignId } = await params;
  const { q } = await searchParams;
  const session = await auth();
  if (!session?.user) redirect("/login");

  const campaign = await prisma.campaign.findUnique({
    where: { id: campaignId },
    include: {
      members: {
        where: { userId: session.user.id },
        select: { role: true },
      },
    },
  });

  if (!campaign) notFound();
  if (campaign.members.length === 0) redirect("/campaigns");

  const isMaster = campaign.members[0].role === "MASTER";

  const wikiPages = await prisma.wikiPage.findMany({
    where: {
      campaignId,
      ...(q ? { title: { contains: q, mode: "insensitive" } } : {}),
    },
    orderBy: { updatedAt: "desc" },
  });

  return (
    <div>
      <PageHeader
        title="Wiki"
        description="Base de conhecimento da campanha"
        action={
          isMaster && (
            <Link href={`/campaigns/${campaignId}/wiki/new`}>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Nova Página
              </Button>
            </Link>
          )
        }
      />

      <form className="mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            name="q"
            placeholder="Buscar páginas..."
            defaultValue={q ?? ""}
            className="pl-9"
          />
        </div>
      </form>

      {wikiPages.length === 0 ? (
        <EmptyState
          icon={BookOpen}
          title="Nenhuma página encontrada"
          description={
            q
              ? "Tente outros termos de busca"
              : "Crie a primeira página da wiki"
          }
          action={
            isMaster && !q ? (
              <Link href={`/campaigns/${campaignId}/wiki/new`}>
                <Button>
                  <Plus className="mr-2 h-4 w-4" />
                  Criar Página
                </Button>
              </Link>
            ) : undefined
          }
        />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {wikiPages.map((page) => (
            <Link
              key={page.id}
              href={`/campaigns/${campaignId}/wiki/${page.slug}`}
            >
              <Card className="h-full transition-colors hover:bg-muted/50">
                <CardHeader>
                  <CardTitle className="flex items-start justify-between gap-2">
                    <span className="text-base">{page.title}</span>
                    <Badge variant="secondary" className="shrink-0">
                      {page.type}
                    </Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <FileText className="h-3 w-3" />
                    <span>
                      {page.content
                        ? page.content.replace(/<[^>]*>/g, "").slice(0, 100) +
                          "..."
                        : "Sem conteúdo"}
                    </span>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
