import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { PageHeader } from "@/components/shared/page-header";
import { CampaignForm } from "@/components/campaign/campaign-form";
export default async function NewCampaignPage() {
  const session = await auth();
  if (!session?.user) redirect("/login");
  return (
    <div className="max-w-2xl mx-auto">
      {" "}
      <PageHeader
        title="Nova Campanha"
        description="Crie uma nova campanha para suas aventuras"
      />{" "}
      <CampaignForm />{" "}
    </div>
  );
}
