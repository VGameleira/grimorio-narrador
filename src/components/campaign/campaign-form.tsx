"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle, Loader2 } from "lucide-react";
import { campaignSchema } from "@/lib/validations";
export function CampaignForm() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [system, setSystem] = useState("feiticos-maldicoes-v2.5");
  const [avgLevel, setAvgLevel] = useState("1");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    const result = campaignSchema.safeParse({
      name,
      description,
      system,
      avgLevel: parseInt(avgLevel),
    });
    if (!result.success) {
      setError(result.error.issues[0].message);
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("/api/campaigns", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(result.data),
      });
      if (!res.ok) {
        const data = await res.json();
        setError(data.error ?? "Erro ao criar campanha");
        return;
      }
      const data = await res.json();
      router.push(`/campaigns/${data.id}`);
      router.refresh();
    } catch {
      setError("Ocorreu um erro ao criar campanha");
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
        <Label htmlFor="name">Nome da Campanha</Label>{" "}
        <Input
          id="name"
          placeholder="Ex: Jujutsu High - Crônicas Amaldiçoadas"
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
          placeholder="Descreva o cenário e a premissa da campanha..."
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={4}
        />{" "}
      </div>{" "}
      <div className="grid gap-4 md:grid-cols-2">
        {" "}
        <div className="space-y-2">
          {" "}
          <Label htmlFor="system">Sistema</Label>{" "}
          <Select value={system} onValueChange={(v) => v && setSystem(v)}>
            {" "}
            <SelectTrigger>
              {" "}
              <SelectValue />{" "}
            </SelectTrigger>{" "}
            <SelectContent>
              {" "}
              <SelectItem value="feiticos-maldicoes-v2.5">
                {" "}
                Feitiços & Maldições v2.5{" "}
              </SelectItem>{" "}
              <SelectItem value="custom">Personalizado</SelectItem>{" "}
            </SelectContent>{" "}
          </Select>{" "}
        </div>{" "}
        <div className="space-y-2">
          {" "}
          <Label htmlFor="avgLevel">Nível Médio</Label>{" "}
          <Select value={avgLevel} onValueChange={(v) => v && setAvgLevel(v)}>
            {" "}
            <SelectTrigger>
              {" "}
              <SelectValue />{" "}
            </SelectTrigger>{" "}
            <SelectContent>
              {" "}
              {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((n) => (
                <SelectItem key={n} value={String(n)}>
                  {" "}
                  {n === 1
                    ? `${n} (Iniciante)`
                    : n === 10
                      ? `${n} (Lendário)`
                      : String(n)}{" "}
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
            <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Criando...{" "}
          </>
        ) : (
          "Criar Campanha"
        )}{" "}
      </Button>{" "}
    </form>
  );
}
