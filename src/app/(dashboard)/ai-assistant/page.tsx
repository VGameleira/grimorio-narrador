import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { PageHeader } from "@/components/shared/page-header";
import { AIAssistantPanel } from "@/components/ai/ai-assistant-panel";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
export default async function AIAssistantPage({
  searchParams,
}: {
  searchParams: Promise<{ campaignId?: string }>;
}) {
  const session = await auth();
  if (!session?.user) redirect("/login");
  if (session.user.role !== "MASTER") {
    redirect("/dashboard");
  }
  const { campaignId } = await searchParams;
  const campaigns = await prisma.campaign.findMany({
    where: { members: { some: { userId: session.user.id } } },
    select: { id: true, name: true },
    orderBy: { updatedAt: "desc" },
  });
  return (
    <div className="max-w-3xl mx-auto">
      {" "}
      <PageHeader
        title="Assistente IA"
        description="Gere conteúdo e converse com a IA sobre sua campanha"
      />{" "}
      {campaigns.length > 0 && (
        <div className="mb-6">
          {" "}
          <form>
            {" "}
            <Select
              name="campaignId"
              defaultValue={campaignId ?? campaigns[0].id}
            >
              {" "}
              <SelectTrigger className="w-full">
                {" "}
                <SelectValue placeholder="Selecione uma campanha" />{" "}
              </SelectTrigger>{" "}
              <SelectContent>
                {" "}
                {campaigns.map((c) => (
                  <SelectItem key={c.id} value={c.id}>
                    {" "}
                    {c.name}{" "}
                  </SelectItem>
                ))}{" "}
              </SelectContent>{" "}
            </Select>{" "}
          </form>{" "}
        </div>
      )}{" "}
      <AIAssistantPanel campaignId={campaignId ?? campaigns[0]?.id} />{" "}
    </div>
  );
}
