"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle, Loader2 } from "lucide-react";
import { locationSchema } from "@/lib/validations";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
type LocationFormProps = {
  campaignId: string;
  initialData?: {
    id: string;
    name: string;
    description: string | null;
    npcs: Array<{ npcId: string }>;
  };
};
type NPC = { id: string; name: string };
export function LocationForm({ campaignId, initialData }: LocationFormProps) {
  const router = useRouter();
  const [name, setName] = useState(initialData?.name ?? "");
  const [description, setDescription] = useState(
    initialData?.description ?? ""
  );
  const [selectedNpcs, setSelectedNpcs] = useState<string[]>(
    initialData?.npcs.map((n) => n.npcId) ?? []
  );
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [npcs, setNpcs] = useState<NPC[]>([]);
  useEffect(() => {
    fetch(`/api/campaigns/${campaignId}/npcs`)
      .then((res) => res.json())
      .then((data) => setNpcs(data))
      .catch(() => {});
  }, [campaignId]);
  function handleToggleNpc(npcId: string) {
    setSelectedNpcs((prev) =>
      prev.includes(npcId)
        ? prev.filter((id) => id !== npcId)
        : [...prev, npcId]
    );
  }
  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    const result = locationSchema.safeParse({
      name,
      description: description || undefined,
      npcIds: selectedNpcs.length > 0 ? selectedNpcs : undefined,
    });
    if (!result.success) {
      setError(result.error.issues[0].message);
      return;
    }
    setLoading(true);
    try {
      const url = initialData
        ? `/api/campaigns/${campaignId}/locations/${initialData.id}`
        : `/api/campaigns/${campaignId}/locations`;
      const method = initialData ? "PUT" : "POST";
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(result.data),
      });
      if (!res.ok) {
        const data = await res.json();
        setError(data.error ?? "Erro ao salvar local");
        return;
      }
      router.push(`/campaigns/${campaignId}/locations`);
      router.refresh();
    } catch {
      setError("Ocorreu um erro ao salvar local");
    } finally {
      setLoading(false);
    }
  }
  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {" "}
      {error && (
        <Alert variant="destructive">
          {" "}
          <AlertCircle className="h-4 w-4" />{" "}
          <AlertDescription>{error}</AlertDescription>{" "}
        </Alert>
      )}{" "}
      <div className="space-y-2">
        {" "}
        <Label htmlFor="name">Nome</Label>{" "}
        <Input
          id="name"
          placeholder="Nome do local"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />{" "}
      </div>{" "}
      <div className="space-y-2">
        {" "}
        <Label htmlFor="description">Descrição</Label>{" "}
        <Textarea
          id="description"
          placeholder="Descreva o local, sua atmosfera e importância..."
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={4}
        />{" "}
      </div>{" "}
      <div className="space-y-2">
        {" "}
        <Label>NPCs Presentes</Label>{" "}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
          {" "}
          {npcs.map((npc) => (
            <Button
              key={npc.id}
              type="button"
              variant={selectedNpcs.includes(npc.id) ? "default" : "outline"}
              size="sm"
              className="justify-start"
              onClick={() => handleToggleNpc(npc.id)}
            >
              {" "}
              {npc.name}{" "}
            </Button>
          ))}{" "}
          {npcs.length === 0 && (
            <p className="text-sm text-muted-foreground col-span-full">
              {" "}
              Nenhum NPC disponível{" "}
            </p>
          )}{" "}
        </div>{" "}
      </div>{" "}
      <div className="flex gap-3">
        {" "}
        <Button type="button" variant="outline" onClick={() => router.back()}>
          {" "}
          Cancelar{" "}
        </Button>{" "}
        <Button type="submit" disabled={loading}>
          {" "}
          {loading ? (
            <>
              {" "}
              <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Salvando...{" "}
            </>
          ) : initialData ? (
            "Atualizar Local"
          ) : (
            "Criar Local"
          )}{" "}
        </Button>{" "}
      </div>{" "}
    </form>
  );
}
