"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Plus, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
export function QuickNotes() {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!content.trim()) return;
    setLoading(true);
    try {
      const res = await fetch("/api/notes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: title.trim() || undefined,
          content: content.trim(),
        }),
      });
      if (!res.ok) throw new Error("Erro ao criar nota");
      setTitle("");
      setContent("");
      toast.success("Nota criada!");
      router.refresh();
    } catch {
      toast.error("Erro ao criar nota");
    } finally {
      setLoading(false);
    }
  }
  return (
    <Card className="mb-8">
      {" "}
      <CardContent className="pt-6">
        {" "}
        <form onSubmit={handleSubmit} className="space-y-3">
          {" "}
          <Input
            placeholder="Título (opcional)"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />{" "}
          <Textarea
            placeholder="Escreva sua nota rápida..."
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="min-h-[80px]"
          />{" "}
          <Button type="submit" disabled={loading || !content.trim()} size="sm">
            {" "}
            {loading ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Plus className="mr-2 h-4 w-4" />
            )}{" "}
            Adicionar Nota{" "}
          </Button>{" "}
        </form>{" "}
      </CardContent>{" "}
    </Card>
  );
}
