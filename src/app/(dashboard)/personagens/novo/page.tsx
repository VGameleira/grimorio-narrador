import { PageHeader } from "@/components/shared/page-header";
import { FullCharacterSheet } from "@/components/character/full-character-sheet";
export default function NewCharacterPage() {
  return (
    <div className="max-w-4xl mx-auto">
      <PageHeader
        title="Ficha Completa de Personagem"
        description="Crie seu personagem para Feiticeiros & Maldições 2.5 com regras oficiais"
      />
      <FullCharacterSheet />
    </div>
  );
}
