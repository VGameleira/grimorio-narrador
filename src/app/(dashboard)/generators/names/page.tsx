import { PageHeader } from "@/components/shared/page-header";
import { NameGenerator } from "@/components/generators/name-generator";
export default function NameGeneratorPage() {
  return (
    <div className="max-w-2xl mx-auto">
      {" "}
      <PageHeader
        title="Gerador de Nomes"
        description="Gere nomes aleatórios para NPCs japoneses e portugueses"
      />{" "}
      <NameGenerator />{" "}
    </div>
  );
}
