import { PageHeader } from "@/components/shared/page-header";
import { RulesLibrary } from "@/components/grimoire/rules-library";
export default function BibliotecaPage() {
  return (
    <div className="max-w-3xl mx-auto">
      <PageHeader
        title="Biblioteca de Regras"
        description="Consulte as regras do sistema Feiticeiros & Maldições 2.5"
      />
      <RulesLibrary />
    </div>
  );
}