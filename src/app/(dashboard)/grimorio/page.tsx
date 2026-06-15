import { PageHeader } from "@/components/shared/page-header";
import { EnhancedGrimoireViewer } from "@/components/grimoire/enhanced-grimoire-viewer";
export default function GrimorioPage() {
  return (
    <div className="max-w-4xl mx-auto">
      <PageHeader
        title="Grimório das Maldições"
        description="Catálogo completo de maldições do sistema Feiticeiros & Maldições 2.5"
      />
      <EnhancedGrimoireViewer />
    </div>
  );
}
