"use client";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle, Loader2 } from "lucide-react";
import { timelineEventSchema } from "@/lib/validations";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
const eventTypes = [
  { value: "event", label: "Evento" },
  { value: "battle", label: "Batalha" },
  { value: "story", label: "História" },
  { value: "session", label: "Sessão" },
  { value: "discovery", label: "Descoberta" },
  { value: "npc", label: "NPC" },
];
type TimelineFormProps = {
  campaignId: string;
  initialData?: {
    id: string;
    title: string;
    description: string | null;
    dateText: string | null;
    order: number;
    type: string;
    locationId?: string | null;
  };
  onSuccess: () => void;
};
type Location = { id: string; name: string };
export function TimelineForm({
  campaignId,
  initialData,
  onSuccess,
}: TimelineFormProps) {
  const [title, setTitle] = useState(initialData?.title ?? "");
  const [description, setDescription] = useState(
    initialData?.description ?? ""
  );
  const [dateText, setDateText] = useState(initialData?.dateText ?? "");
  const [order, setOrder] = useState(String(initialData?.order ?? 1));
  const [type, setType] = useState(initialData?.type ?? "event");
  const [locationId, setLocationId] = useState(initialData?.locationId ?? "");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [locations, setLocations] = useState<Location[]>([]);
  useEffect(() => {
    fetch(`/api/campaigns/${campaignId}/locations`)
      .then((res) => res.json())
      .then((data) => setLocations(data))
      .catch(() => {});
  }, [campaignId]);
  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    const result = timelineEventSchema.safeParse({
      title,
      description: description || undefined,
      dateText: dateText || undefined,
      order: parseInt(order) || 1,
      type,
      locationId: locationId || undefined,
    });
    if (!result.success) {
      setError(result.error.issues[0].message);
      return;
    }
    setLoading(true);
    try {
      const url = initialData
        ? `/api/campaigns/${campaignId}/timeline/${initialData.id}`
        : `/api/campaigns/${campaignId}/timeline`;
      const method = initialData ? "PUT" : "POST";
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(result.data),
      });
      if (!res.ok) {
        const data = await res.json();
        setError(data.error ?? "Erro ao salvar evento");
        return;
      }
      onSuccess();
    } catch {
      setError("Ocorreu um erro ao salvar evento");
    } finally {
      setLoading(false);
    }
  }
  return (
    <form onSubmit={handleSubmit} className="space-y-4">
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
        <Label htmlFor="title">Título</Label>{" "}
        <Input
          id="title"
          placeholder="Título do evento"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />{" "}
      </div>{" "}
      <div className="space-y-2">
        {" "}
        <Label htmlFor="description">Descrição</Label>{" "}
        <Textarea
          id="description"
          placeholder="Descreva o evento..."
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={3}
        />{" "}
      </div>{" "}
      <div className="grid gap-4 md:grid-cols-2">
        {" "}
        <div className="space-y-2">
          {" "}
          <Label htmlFor="dateText">Data (texto)</Label>{" "}
          <Input
            id="dateText"
            placeholder="Ex: Primavera de 1024"
            value={dateText}
            onChange={(e) => setDateText(e.target.value)}
          />{" "}
        </div>{" "}
        <div className="space-y-2">
          {" "}
          <Label htmlFor="order">Ordem</Label>{" "}
          <Input
            id="order"
            type="number"
            min={1}
            value={order}
            onChange={(e) => setOrder(e.target.value)}
          />{" "}
        </div>{" "}
      </div>{" "}
      <div className="grid gap-4 md:grid-cols-2">
        {" "}
        <div className="space-y-2">
          {" "}
          <Label htmlFor="type">Tipo</Label>{" "}
          <Select value={type} onValueChange={(v) => v && setType(v)}>
            {" "}
            <SelectTrigger>
              {" "}
              <SelectValue />{" "}
            </SelectTrigger>{" "}
            <SelectContent>
              {" "}
              {eventTypes.map((t) => (
                <SelectItem key={t.value} value={t.value}>
                  {" "}
                  {t.label}{" "}
                </SelectItem>
              ))}{" "}
            </SelectContent>{" "}
          </Select>{" "}
        </div>{" "}
        <div className="space-y-2">
          {" "}
          <Label htmlFor="location">Local</Label>{" "}
          <Select
            value={locationId}
            onValueChange={(v) => setLocationId(v === null ? "" : v === "none" ? "" : v)}
          >
            {" "}
            <SelectTrigger>
              {" "}
              <SelectValue placeholder="Nenhum" />{" "}
            </SelectTrigger>{" "}
            <SelectContent>
              {" "}
              <SelectItem value="none">Nenhum</SelectItem>{" "}
              {locations.map((loc) => (
                <SelectItem key={loc.id} value={loc.id}>
                  {" "}
                  {loc.name}{" "}
                </SelectItem>
              ))}{" "}
            </SelectContent>{" "}
          </Select>{" "}
        </div>{" "}
      </div>{" "}
      <Button type="submit" className="w-full" disabled={loading}>
        {" "}
        {loading ? (
          <>
            {" "}
            <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Salvando...{" "}
          </>
        ) : initialData ? (
          "Atualizar Evento"
        ) : (
          "Criar Evento"
        )}{" "}
      </Button>{" "}
    </form>
  );
}
