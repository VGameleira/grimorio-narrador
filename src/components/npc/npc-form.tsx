"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle, Loader2 } from "lucide-react";
import { npcSchema } from "@/lib/validations";
type NPCFormProps = { campaignId: string };
export function NPCForm({ campaignId }: NPCFormProps) {
  const router = useRouter();
  const [name, setName] = useState("");
  const [age, setAge] = useState("");
  const [organization, setOrganization] = useState("");
  const [objectives, setObjectives] = useState("");
  const [personality, setPersonality] = useState("");
  const [backstory, setBackstory] = useState("");
  const [secrets, setSecrets] = useState("");
  const [status, setStatus] = useState("ALIVE");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    const result = npcSchema.safeParse({
      name,
      age: age || undefined,
      organization: organization || undefined,
      objectives: objectives || undefined,
      personality: personality || undefined,
      backstory: backstory || undefined,
      secrets: secrets || undefined,
      status: status as "ALIVE" | "DEAD" | "MISSING" | "UNKNOWN",
    });
    if (!result.success) {
      setError(result.error.issues[0].message);
      return;
    }
    setLoading(true);
    try {
      const res = await fetch(`/api/campaigns/${campaignId}/npcs`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(result.data),
      });
      if (!res.ok) {
        const data = await res.json();
        setError(data.error ?? "Erro ao criar NPC");
        return;
      }
      router.refresh();
    } catch {
      setError("Ocorreu um erro ao criar NPC");
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
        <label htmlFor="name" className="text-sm font-medium">
          Nome
        </label>{" "}
        <Input
          id="name"
          placeholder="Nome do NPC"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />{" "}
      </div>{" "}
      <div className="grid gap-4 md:grid-cols-2">
        {" "}
        <div className="space-y-2">
          {" "}
          <label htmlFor="age" className="text-sm font-medium">
            Idade
          </label>{" "}
          <Input
            id="age"
            placeholder="Ex: 35 anos"
            value={age}
            onChange={(e) => setAge(e.target.value)}
          />{" "}
        </div>{" "}
        <div className="space-y-2">
          {" "}
          <label htmlFor="organization" className="text-sm font-medium">
            Organização
          </label>{" "}
          <Input
            id="organization"
            placeholder="Ex: Escola Jujutsu"
            value={organization}
            onChange={(e) => setOrganization(e.target.value)}
          />{" "}
        </div>{" "}
      </div>{" "}
      <div className="space-y-2">
        {" "}
        <label htmlFor="status" className="text-sm font-medium">
          Status
        </label>{" "}
        <Select value={status} onValueChange={(v) => v && setStatus(v)}>
          {" "}
          <SelectTrigger>
            {" "}
            <SelectValue />{" "}
          </SelectTrigger>{" "}
          <SelectContent>
            {" "}
            <SelectItem value="ALIVE">Vivo</SelectItem>{" "}
            <SelectItem value="DEAD">Morto</SelectItem>{" "}
            <SelectItem value="MISSING">Desaparecido</SelectItem>{" "}
            <SelectItem value="UNKNOWN">Desconhecido</SelectItem>{" "}
          </SelectContent>{" "}
        </Select>{" "}
      </div>{" "}
      <div className="space-y-2">
        {" "}
        <label htmlFor="objectives" className="text-sm font-medium">
          Objetivos
        </label>{" "}
        <Textarea
          id="objectives"
          placeholder="O que esse NPC deseja alcançar?"
          value={objectives}
          onChange={(e) => setObjectives(e.target.value)}
          rows={3}
        />{" "}
      </div>{" "}
      <div className="space-y-2">
        {" "}
        <label htmlFor="personality" className="text-sm font-medium">
          Personalidade
        </label>{" "}
        <Textarea
          id="personality"
          placeholder="Traços de personalidade, maneirismos..."
          value={personality}
          onChange={(e) => setPersonality(e.target.value)}
          rows={3}
        />{" "}
      </div>{" "}
      <div className="space-y-2">
        {" "}
        <label htmlFor="backstory" className="text-sm font-medium">
          História
        </label>{" "}
        <Textarea
          id="backstory"
          placeholder="História e background do NPC..."
          value={backstory}
          onChange={(e) => setBackstory(e.target.value)}
          rows={4}
        />{" "}
      </div>{" "}
      <div className="space-y-2">
        {" "}
        <label htmlFor="secrets" className="text-sm font-medium">
          Segredos
        </label>{" "}
        <Textarea
          id="secrets"
          placeholder="Segredos que apenas o mestre conhece..."
          value={secrets}
          onChange={(e) => setSecrets(e.target.value)}
          rows={3}
        />{" "}
      </div>{" "}
      <Button type="submit" className="w-full" disabled={loading}>
        {" "}
        {loading ? (
          <>
            {" "}
            <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Criando...{" "}
          </>
        ) : (
          "Criar NPC"
        )}{" "}
      </Button>{" "}
    </form>
  );
}
