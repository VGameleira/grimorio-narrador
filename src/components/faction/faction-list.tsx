"use client";
import { Building2 } from "lucide-react";
import { EmptyState } from "@/components/shared/empty-state";
import { FactionCard } from "@/components/faction/faction-card";
type Faction = {
  id: string;
  name: string;
  image: string | null;
  description: string | null;
  influence: number;
  resources: number;
  _count: { relationsFrom: number };
};
type FactionListProps = {
  factions: Faction[];
  campaignId: string;
  isMaster: boolean;
};
export function FactionList({
  factions,
  campaignId,
  isMaster,
}: FactionListProps) {
  if (factions.length === 0) {
    return (
      <EmptyState
        icon={Building2}
        title="Nenhuma facção cadastrada"
        description="Crie facções para representar organizações, grupos e facções da sua campanha."
      />
    );
  }
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {" "}
      {factions.map((faction) => (
        <FactionCard
          key={faction.id}
          faction={faction}
          campaignId={campaignId}
          isMaster={isMaster}
        />
      ))}{" "}
    </div>
  );
}
