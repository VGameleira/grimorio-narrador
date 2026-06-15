import { PageHeader } from "@/components/shared/page-header";
import { CurseGenerator } from "@/components/generators/curse-generator";
export default function CurseGeneratorPage() {
  return (
    <div className="max-w-2xl mx-auto">
      {" "}
      <PageHeader
        title="Gerador de Maldições"
        description="Crie maldições aleatórias para sua campanha"
      />{" "}
      <CurseGenerator />{" "}
    </div>
  );
}
