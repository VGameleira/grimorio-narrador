import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect, notFound } from "next/navigation";
import Link from "next/link";
import { PageHeader } from "@/components/shared/page-header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { WikiPage } from "@/components/wiki/wiki-page";
import { ArrowLeft, Edit } from "lucide-react";

export default async function WikiSlugPage({
  params,
}: {
  params: Promise<{ campaignId: string; slug: string }>;
}) {
  const { campaignId, slug } = await params;
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

  const page = await prisma.wikiPage.findUnique({
    where: { campaignId_slug: { campaignId, slug } },
  });

  if (!page) notFound();

  return (
    <div>
      <div className="mb-4">
        <Link
          href={`/campaigns/${campaignId}/wiki`}
          className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" />
          Voltar para Wiki
        </Link>
      </div>

      <PageHeader
        title={page.title}
        description={<Badge variant="secondary">{page.type}</Badge>}
        action={
          isMaster && (
            <Link href={`/campaigns/${campaignId}/wiki/${slug}/edit`}>
              <Button variant="outline">
                <Edit className="mr-2 h-4 w-4" />
                Editar
              </Button>
            </Link>
          )
        }
      />

      <div className="mt-6 rounded-lg border border-border p-6">
        {page.content ? (
          <WikiPage content={page.content} campaignId={campaignId} />
        ) : (
          <p className="text-sm text-muted-foreground">
            Esta página ainda não possui conteúdo.
          </p>
        )}
      </div>
    </div>
  );
}
