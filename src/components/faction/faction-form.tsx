"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle, Loader2 } from "lucide-react";
import { factionSchema } from "@/lib/validations";
type FactionFormProps = {
  campaignId: string;
  initialData?: {
    id: string;
    name: string;
    description: string | null;
    influence: number;
    resources: number;
  };
};
export function FactionForm({ campaignId, initialData }: FactionFormProps) {
  const router = useRouter();
  const [name, setName] = useState(initialData?.name ?? "");
  const [description, setDescription] = useState(
    initialData?.description ?? ""
  );
  const [influence, setInfluence] = useState(
    String(initialData?.influence ?? 1)
  );
  const [resources, setResources] = useState(
    String(initialData?.resources ?? 1)
  );
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    const result = factionSchema.safeParse({
      name,
      description: description || undefined,
      influence: parseInt(influence),
      resources: parseInt(resources),
    });
    if (!result.success) {
      setError(result.error.issues[0].message);
      return;
    }
    setLoading(true);
    try {
      const url = initialData
        ? `/api/campaigns/${campaignId}/factions/${initialData.id}`
        : `/api/campaigns/${campaignId}/factions`;
      const method = initialData ? "PUT" : "POST";
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(result.data),
      });
      if (!res.ok) {
        const data = await res.json();
        setError(data.error ?? "Erro ao salvar facção");
        return;
      }
      router.push(`/campaigns/${campaignId}/factions`);
      router.refresh();
    } catch {
      setError("Ocorreu um erro ao salvar facção");
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
          placeholder="Nome da facção"
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
          placeholder="Descreva a facção, seus objetivos e ideologia..."
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={4}
        />{" "}
      </div>{" "}
      <div className="grid gap-4 md:grid-cols-2">
        {" "}
        <div className="space-y-2">
          {" "}
          <Label htmlFor="influence">Influência</Label>{" "}
          <Input
            id="influence"
            type="number"
            min={0}
            value={influence}
            onChange={(e) => setInfluence(e.target.value)}
          />{" "}
        </div>{" "}
        <div className="space-y-2">
          {" "}
          <Label htmlFor="resources">Recursos</Label>{" "}
          <Input
            id="resources"
            type="number"
            min={0}
            value={resources}
            onChange={(e) => setResources(e.target.value)}
          />{" "}
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
            "Atualizar Facção"
          ) : (
            "Criar Facção"
          )}{" "}
        </Button>{" "}
      </div>{" "}
    </form>
  );
}
