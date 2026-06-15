import { PageHeader } from "@/components/shared/page-header";
import { EnemyBuilder } from "@/components/enemy/enemy-builder";
export default function EnemyBuilderPage() {
  return (
    <div className="max-w-4xl mx-auto">
      <PageHeader
        title="Construtor de Inimigos"
        description="Crie inimigos, monstros e NPCs hostis para suas campanhas de Feiticeiros & Maldições 2.5"
      />
      <EnemyBuilder />
    </div>
  );
}
