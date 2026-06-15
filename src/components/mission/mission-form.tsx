"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
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
import { missionSchema } from "@/lib/validations";
type MissionFormProps = { campaignId: string; onClose: () => void };
export function MissionForm({ campaignId, onClose }: MissionFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [title, setTitle] = useState("");
  const [grade, setGrade] = useState("");
  const [description, setDescription] = useState("");
  const [objectives, setObjectives] = useState("");
  const [reward, setReward] = useState("");
  const [status, setStatus] = useState("AVAILABLE");
  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const result = missionSchema.safeParse({
      title,
      grade: grade || undefined,
      description: description || undefined,
      objectives: objectives || undefined,
      reward: reward || undefined,
      status: status as any,
    });
    if (!result.success) {
      toast.error(result.error.issues[0].message);
      return;
    }
    setLoading(true);
    try {
      const res = await fetch(`/api/campaigns/${campaignId}/missions`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(result.data),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error ?? "Erro ao criar missão");
      }
      toast.success("Missão criada com sucesso!");
      router.refresh();
      onClose();
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Erro ao criar missão"
      );
    } finally {
      setLoading(false);
    }
  }
  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {" "}
      <div className="space-y-2">
        {" "}
        <label className="text-sm font-medium">Título</label>{" "}
        <Input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Título da missão"
          required
        />{" "}
      </div>{" "}
      <div className="space-y-2">
        {" "}
        <label className="text-sm font-medium">Grau</label>{" "}
        <Select value={grade} onValueChange={(v) => v && setGrade(v)}>
          {" "}
          <SelectTrigger className="w-full">
            {" "}
            <SelectValue placeholder="Selecione um grau" />{" "}
          </SelectTrigger>{" "}
          <SelectContent>
            {" "}
            <SelectItem value="D">D</SelectItem>{" "}
            <SelectItem value="C">C</SelectItem>{" "}
            <SelectItem value="B">B</SelectItem>{" "}
            <SelectItem value="A">A</SelectItem>{" "}
            <SelectItem value="S">S</SelectItem>{" "}
          </SelectContent>{" "}
        </Select>{" "}
      </div>{" "}
      <div className="space-y-2">
        {" "}
        <label className="text-sm font-medium">Descrição</label>{" "}
        <Textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Descrição da missão"
          rows={3}
        />{" "}
      </div>{" "}
      <div className="space-y-2">
        {" "}
        <label className="text-sm font-medium">Objetivos</label>{" "}
        <Textarea
          value={objectives}
          onChange={(e) => setObjectives(e.target.value)}
          placeholder="Objetivos da missão"
          rows={3}
        />{" "}
      </div>{" "}
      <div className="space-y-2">
        {" "}
        <label className="text-sm font-medium">Recompensa</label>{" "}
        <Textarea
          value={reward}
          onChange={(e) => setReward(e.target.value)}
          placeholder="Recompensa da missão"
          rows={2}
        />{" "}
      </div>{" "}
      <div className="space-y-2">
        {" "}
        <label className="text-sm font-medium">Status</label>{" "}
        <Select value={status} onValueChange={(v) => v && setStatus(v)}>
          {" "}
          <SelectTrigger className="w-full">
            {" "}
            <SelectValue />{" "}
          </SelectTrigger>{" "}
          <SelectContent>
            {" "}
            <SelectItem value="AVAILABLE">Disponível</SelectItem>{" "}
            <SelectItem value="IN_PROGRESS">Em Andamento</SelectItem>{" "}
            <SelectItem value="COMPLETED">Concluída</SelectItem>{" "}
            <SelectItem value="FAILED">Falha</SelectItem>{" "}
          </SelectContent>{" "}
        </Select>{" "}
      </div>{" "}
      <div className="flex justify-end gap-2 pt-2">
        {" "}
        <Button type="button" variant="outline" onClick={onClose}>
          {" "}
          Cancelar{" "}
        </Button>{" "}
        <Button type="submit" disabled={loading}>
          {" "}
          {loading ? "Salvando..." : "Salvar"}{" "}
        </Button>{" "}
      </div>{" "}
    </form>
  );
}
