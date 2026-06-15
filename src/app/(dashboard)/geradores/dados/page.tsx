import { PageHeader } from "@/components/shared/page-header";
import { DiceRoller } from "@/components/dice-roller/dice-roller";
export default function DiceRollerPage() {
  return (
    <div className="max-w-2xl mx-auto">
      <PageHeader
        title="Rolo de Dados"
        description="Role dados para o sistema Feiticeiros & Maldições 2.5"
      />
      <DiceRoller />
    </div>
  );
}