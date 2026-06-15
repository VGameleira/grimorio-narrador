"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Building2, TrendingUp, DollarSign, Plus, Trash2 } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
type Relation = {
  id: string;
  type: string;
  description: string | null;
  fromFactionId: string;
  toFaction: { id: string; name: string };
};
type RelationFrom = {
  id: string;
  type: string;
  description: string | null;
  toFactionId: string;
  fromFaction: { id: string; name: string };
};
type FactionDetailProps = {
  faction: {
    id: string;
    name: string;
    description: string | null;
    influence: number;
    resources: number;
    relationsFrom: Relation[];
    relationsTo: RelationFrom[];
  };
  allFactions: Array<{ id: string; name: string }>;
  campaignId: string;
  isMaster: boolean;
};
const relationColors: Record<string, string> = {
  ALLIANCE: "bg-green-500/10 text-green-500 border-green-500/20",
  RIVALRY: "bg-red-500/10 text-red-500 border-red-500/20",
  NEUTRAL: "bg-muted text-muted-foreground border-border",
  HOSTILE: "bg-orange-500/10 text-orange-500 border-orange-500/20",
  FRIENDLY: "bg-blue-500/10 text-blue-500 border-blue-500/20",
};
const relationLabels: Record<string, string> = {
  ALLIANCE: "Aliada",
  RIVALRY: "Rival",
  NEUTRAL: "Neutra",
  HOSTILE: "Hostil",
  FRIENDLY: "Amigável",
};
export function FactionDetail({
  faction,
  allFactions,
  campaignId,
  isMaster,
}: FactionDetailProps) {
  const router = useRouter();
  const [showForm, setShowForm] = useState(false);
  const [relationType, setRelationType] = useState("NEUTRAL");
  const [relationDesc, setRelationDesc] = useState("");
  const [relationTarget, setRelationTarget] = useState("");
  const [loading, setLoading] = useState(false);
  const otherFactions = allFactions.filter((f) => f.id !== faction.id);
  const allRelations = [
    ...faction.relationsFrom.map((r) => ({
      id: r.id,
      type: r.type,
      description: r.description,
      other: r.toFaction,
      direction: "out" as const,
    })),
    ...faction.relationsTo.map((r) => ({
      id: r.id,
      type: r.type,
      description: r.description,
      other: r.fromFaction,
      direction: "in" as const,
    })),
  ];
  async function handleAddRelation() {
    if (!relationTarget || !relationType) return;
    setLoading(true);
    try {
      const res = await fetch(
        `/api/campaigns/${campaignId}/factions/${faction.id}/relations`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            type: relationType,
            description: relationDesc || undefined,
            toFactionId: relationTarget,
          }),
        }
      );
      if (res.ok) {
        setShowForm(false);
        setRelationType("NEUTRAL");
        setRelationDesc("");
        setRelationTarget("");
        router.refresh();
      }
    } finally {
      setLoading(false);
    }
  }
  async function handleDeleteRelation(relationId: string) {
    await fetch(
      `/api/campaigns/${campaignId}/factions/${faction.id}/relations`,
      {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ relationId }),
      }
    );
    router.refresh();
  }
  return (
    <div className="grid gap-6 lg:grid-cols-3">
      {" "}
      <div className="lg:col-span-2 space-y-6">
        {" "}
        <Card>
          {" "}
          <CardHeader>
            {" "}
            <div className="flex items-start gap-3">
              {" "}
              <div className="rounded-lg bg-muted p-3">
                {" "}
                <Building2 className="h-6 w-6 text-muted-foreground" />{" "}
              </div>{" "}
              <div>
                {" "}
                <CardTitle className="text-xl">{faction.name}</CardTitle>{" "}
                {faction.description && (
                  <CardDescription className="mt-1">
                    {" "}
                    {faction.description}{" "}
                  </CardDescription>
                )}{" "}
              </div>{" "}
            </div>{" "}
          </CardHeader>{" "}
          <CardContent>
            {" "}
            <div className="flex items-center gap-6 text-sm">
              {" "}
              <span className="flex items-center gap-1.5">
                {" "}
                <TrendingUp className="h-4 w-4 text-muted-foreground" />{" "}
                Influência: <strong>{faction.influence}</strong>{" "}
              </span>{" "}
              <span className="flex items-center gap-1.5">
                {" "}
                <DollarSign className="h-4 w-4 text-muted-foreground" />{" "}
                Recursos: <strong>{faction.resources}</strong>{" "}
              </span>{" "}
            </div>{" "}
          </CardContent>{" "}
        </Card>{" "}
        <Card>
          {" "}
          <CardHeader className="flex flex-row items-center justify-between">
            {" "}
            <CardTitle className="text-lg">Relações</CardTitle>{" "}
            {isMaster && (
              <Button size="sm" onClick={() => setShowForm(!showForm)}>
                {" "}
                <Plus className="mr-2 h-4 w-4" /> Adicionar{" "}
              </Button>
            )}{" "}
          </CardHeader>{" "}
          <CardContent className="space-y-4">
            {" "}
            {showForm && (
              <div className="rounded-lg border border-border p-4 space-y-3">
                {" "}
                <div className="space-y-2">
                  {" "}
                  <Label>Facção</Label>{" "}
                  <Select
                    value={relationTarget}
                    onValueChange={(v) => v && setRelationTarget(v)}
                  >
                    {" "}
                    <SelectTrigger>
                      {" "}
                      <SelectValue placeholder="Selecione uma facção" />{" "}
                    </SelectTrigger>{" "}
                    <SelectContent>
                      {" "}
                      {otherFactions.map((f) => (
                        <SelectItem key={f.id} value={f.id}>
                          {" "}
                          {f.name}{" "}
                        </SelectItem>
                      ))}{" "}
                    </SelectContent>{" "}
                  </Select>{" "}
                </div>{" "}
                <div className="space-y-2">
                  {" "}
                  <Label>Tipo de Relação</Label>{" "}
                  <Select value={relationType} onValueChange={(v) => v && setRelationType(v)}>
                    {" "}
                    <SelectTrigger>
                      {" "}
                      <SelectValue />{" "}
                    </SelectTrigger>{" "}
                    <SelectContent>
                      {" "}
                      {Object.entries(relationLabels).map(([key, label]) => (
                        <SelectItem key={key} value={key}>
                          {" "}
                          {label}{" "}
                        </SelectItem>
                      ))}{" "}
                    </SelectContent>{" "}
                  </Select>{" "}
                </div>{" "}
                <div className="space-y-2">
                  {" "}
                  <Label>Descrição</Label>{" "}
                  <Textarea
                    value={relationDesc}
                    onChange={(e) => setRelationDesc(e.target.value)}
                    placeholder="Descreva a natureza da relação..."
                  />{" "}
                </div>{" "}
                <div className="flex gap-2">
                  {" "}
                  <Button
                    size="sm"
                    onClick={handleAddRelation}
                    disabled={loading}
                  >
                    {" "}
                    {loading ? "Salvando..." : "Salvar"}{" "}
                  </Button>{" "}
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => setShowForm(false)}
                  >
                    {" "}
                    Cancelar{" "}
                  </Button>{" "}
                </div>{" "}
              </div>
            )}{" "}
            {allRelations.length === 0 && !showForm && (
              <p className="text-sm text-muted-foreground text-center py-4">
                {" "}
                Nenhuma relação cadastrada{" "}
              </p>
            )}{" "}
            {allRelations.map((rel) => (
              <div
                key={rel.id}
                className="flex items-center justify-between rounded-lg border border-border p-3"
              >
                {" "}
                <div className="flex items-center gap-3">
                  {" "}
                  <Badge
                    variant="outline"
                    className={`${relationColors[rel.type] ?? relationColors.NEUTRAL}`}
                  >
                    {" "}
                    {relationLabels[rel.type] ?? rel.type}{" "}
                  </Badge>{" "}
                  <span className="text-sm font-medium">
                    {" "}
                    {rel.direction === "out" ? "→" : "←"} {rel.other.name}{" "}
                  </span>{" "}
                  {rel.description && (
                    <span className="text-sm text-muted-foreground hidden md:inline">
                      {" "}
                      — {rel.description}{" "}
                    </span>
                  )}{" "}
                </div>{" "}
                {isMaster && (
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-muted-foreground hover:text-destructive"
                    onClick={() => handleDeleteRelation(rel.id)}
                  >
                    {" "}
                    <Trash2 className="h-4 w-4" />{" "}
                  </Button>
                )}{" "}
              </div>
            ))}{" "}
          </CardContent>{" "}
        </Card>{" "}
      </div>{" "}
    </div>
  );
}
