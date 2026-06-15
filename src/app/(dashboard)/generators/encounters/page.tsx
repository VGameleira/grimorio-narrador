import { PageHeader } from "@/components/shared/page-header";
import { EncounterGenerator } from "@/components/generators/encounter-generator";
export default function EncounterGeneratorPage() {
  return (
    <div className="max-w-2xl mx-auto">
      {" "}
      <PageHeader
        title="Gerador de Encontros"
        description="Crie encontros aleatórios para suas sessões"
      />{" "}
      <EncounterGenerator />{" "}
    </div>
  );
}
