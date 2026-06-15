"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { RichEditor } from "@/components/shared/rich-editor";
import { sessionSchema } from "@/lib/validations";
type SessionFormProps = { campaignId: string; onClose: () => void };
type NPC = { id: string; name: string };
export function SessionForm({ campaignId, onClose }: SessionFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [npcs, setNpcs] = useState<NPC[]>([]);
  const [number, setNumber] = useState(1);
  const [summary, setSummary] = useState("");
  const [date, setDate] = useState("");
  const [content, setContent] = useState("");
  const [importantEvents, setImportantEvents] = useState("");
  const [consequences, setConsequences] = useState("");
  const [nextHooks, setNextHooks] = useState("");
  const [selectedNpcIds, setSelectedNpcIds] = useState<string[]>([]);
  useEffect(() => {
    fetch(`/api/campaigns/${campaignId}/npcs`)
      .then((res) => res.json())
      .then((data) => setNpcs(Array.isArray(data) ? data : []))
      .catch(() => {});
  }, [campaignId]);
  function toggleNpc(npcId: string) {
    setSelectedNpcIds((prev) =>
      prev.includes(npcId)
        ? prev.filter((id) => id !== npcId)
        : [...prev, npcId]
    );
  }
  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const result = sessionSchema.safeParse({
      number,
      summary: summary || undefined,
      content: content || undefined,
      date: date || undefined,
      importantEvents: importantEvents || undefined,
      consequences: consequences || undefined,
      nextHooks: nextHooks || undefined,
      npcIds: selectedNpcIds.length > 0 ? selectedNpcIds : undefined,
    });
    if (!result.success) {
      toast.error(result.error.issues[0].message);
      return;
    }
    setLoading(true);
    try {
      const res = await fetch(`/api/campaigns/${campaignId}/sessions`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(result.data),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error ?? "Erro ao criar sessão");
      }
      toast.success("Sessão criada com sucesso!");
      router.refresh();
      onClose();
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Erro ao criar sessão"
      );
    } finally {
      setLoading(false);
    }
  }
  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-4 max-h-[70vh] overflow-y-auto"
    >
      {" "}
      <div className="space-y-2">
        {" "}
        <label className="text-sm font-medium">Número da Sessão</label>{" "}
        <Input
          type="number"
          min={1}
          value={number}
          onChange={(e) => setNumber(Number(e.target.value))}
          required
        />{" "}
      </div>{" "}
      <div className="space-y-2">
        {" "}
        <label className="text-sm font-medium">Data</label>{" "}
        <Input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
        />{" "}
      </div>{" "}
      <div className="space-y-2">
        {" "}
        <label className="text-sm font-medium">Resumo</label>{" "}
        <Textarea
          value={summary}
          onChange={(e) => setSummary(e.target.value)}
          placeholder="Resumo da sessão"
          rows={3}
        />{" "}
      </div>{" "}
      <div className="space-y-2">
        {" "}
        <label className="text-sm font-medium">Eventos Importantes</label>{" "}
        <Textarea
          value={importantEvents}
          onChange={(e) => setImportantEvents(e.target.value)}
          placeholder="Eventos importantes que ocorreram"
          rows={3}
        />{" "}
      </div>{" "}
      <div className="space-y-2">
        {" "}
        <label className="text-sm font-medium">Consequências</label>{" "}
        <Textarea
          value={consequences}
          onChange={(e) => setConsequences(e.target.value)}
          placeholder="Consequências das ações dos jogadores"
          rows={3}
        />{" "}
      </div>{" "}
      <div className="space-y-2">
        {" "}
        <label className="text-sm font-medium">Próximos Ganchos</label>{" "}
        <Textarea
          value={nextHooks}
          onChange={(e) => setNextHooks(e.target.value)}
          placeholder="Ganchos para a próxima sessão"
          rows={3}
        />{" "}
      </div>{" "}
      <div className="space-y-2">
        {" "}
        <label className="text-sm font-medium">Conteúdo</label>{" "}
        <RichEditor content={content} onChange={setContent} />{" "}
      </div>{" "}
      {npcs.length > 0 && (
        <div className="space-y-2">
          {" "}
          <label className="text-sm font-medium">NPCs Presentes</label>{" "}
          <div className="flex flex-wrap gap-2">
            {" "}
            {npcs.map((npc) => {
              const isSelected = selectedNpcIds.includes(npc.id);
              return (
                <button
                  key={npc.id}
                  type="button"
                  onClick={() => toggleNpc(npc.id)}
                  className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-medium transition-colors ${isSelected ? "bg-primary text-primary-foreground" : "bg-secondary text-secondary-foreground hover:bg-secondary/80"}`}
                >
                  {" "}
                  {npc.name}{" "}
                </button>
              );
            })}{" "}
          </div>{" "}
        </div>
      )}{" "}
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
