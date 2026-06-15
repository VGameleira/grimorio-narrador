"use client";
import { MapPin } from "lucide-react";
import { EmptyState } from "@/components/shared/empty-state";
import { LocationCard } from "@/components/location/location-card";
type Location = {
  id: string;
  name: string;
  image: string | null;
  description: string | null;
  _count: { npcs: number; events: number };
};
type LocationListProps = {
  locations: Location[];
  campaignId: string;
  isMaster: boolean;
};
export function LocationList({
  locations,
  campaignId,
  isMaster,
}: LocationListProps) {
  if (locations.length === 0) {
    return (
      <EmptyState
        icon={MapPin}
        title="Nenhum local cadastrado"
        description="Adicione locais importantes para o cenário da campanha."
      />
    );
  }
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {" "}
      {locations.map((location) => (
        <LocationCard
          key={location.id}
          location={location}
          campaignId={campaignId}
          isMaster={isMaster}
        />
      ))}{" "}
    </div>
  );
}
