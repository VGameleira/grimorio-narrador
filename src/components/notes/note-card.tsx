"use client";
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Pin, Trash2, Loader2 } from "lucide-react";
import { formatDate } from "@/lib/utils";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
type NoteCardProps = {
  note: {
    id: string;
    title: string | null;
    content: string | null;
    pinned: boolean;
    createdAt: Date;
    updatedAt: Date;
  };
};
export function NoteCard({ note }: NoteCardProps) {
  const [pinning, setPinning] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const router = useRouter();
  async function togglePin() {
    setPinning(true);
    try {
      const res = await fetch(`/api/notes/${note.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ pinned: !note.pinned }),
      });
      if (!res.ok) throw new Error();
      toast.success(note.pinned ? "Nota desafixada" : "Nota fixada");
      router.refresh();
    } catch {
      toast.error("Erro ao atualizar nota");
    } finally {
      setPinning(false);
    }
  }
  async function deleteNote() {
    setDeleting(true);
    try {
      const res = await fetch(`/api/notes/${note.id}`, { method: "DELETE" });
      if (!res.ok) throw new Error();
      toast.success("Nota excluída");
      router.refresh();
    } catch {
      toast.error("Erro ao excluir nota");
    } finally {
      setDeleting(false);
    }
  }
  return (
    <Card className="group relative">
      {" "}
      <CardHeader className="pb-2">
        {" "}
        <div className="flex items-start justify-between">
          {" "}
          <CardTitle className="text-sm font-medium">
            {" "}
            {note.title ?? "Sem título"}{" "}
          </CardTitle>{" "}
          <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
            {" "}
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7"
              onClick={togglePin}
              disabled={pinning}
            >
              {" "}
              {pinning ? (
                <Loader2 className="h-3 w-3 animate-spin" />
              ) : (
                <Pin
                  className={`h-3 w-3 ${note.pinned ? "fill-primary text-primary" : ""}`}
                />
              )}{" "}
            </Button>{" "}
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7 text-destructive hover:text-destructive"
              onClick={deleteNote}
              disabled={deleting}
            >
              {" "}
              {deleting ? (
                <Loader2 className="h-3 w-3 animate-spin" />
              ) : (
                <Trash2 className="h-3 w-3" />
              )}{" "}
            </Button>{" "}
          </div>{" "}
        </div>{" "}
      </CardHeader>{" "}
      <CardContent>
        {" "}
        <p className="text-sm text-muted-foreground whitespace-pre-wrap line-clamp-4">
          {" "}
          {note.content}{" "}
        </p>{" "}
        <p className="mt-2 text-xs text-muted-foreground">
          {" "}
          {formatDate(note.updatedAt)}{" "}
        </p>{" "}
      </CardContent>{" "}
    </Card>
  );
}
