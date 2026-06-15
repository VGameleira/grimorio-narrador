import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { PageHeader } from "@/components/shared/page-header";
import { QuickNotes } from "@/components/notes/quick-notes";
import { NoteCard } from "@/components/notes/note-card";
import { Separator } from "@/components/ui/separator";
import { Pin, StickyNote } from "lucide-react";
export default async function NotesPage() {
  const session = await auth();
  if (!session?.user) redirect("/login");
  const notes = await prisma.note.findMany({
    where: { userId: session.user.id },
    orderBy: [{ pinned: "desc" }, { updatedAt: "desc" }],
  });
  const pinnedNotes = notes.filter((n) => n.pinned);
  const unpinnedNotes = notes.filter((n) => !n.pinned);
  return (
    <div>
      {" "}
      <PageHeader title="Notas" description="Suas anotações rápidas" />{" "}
      <QuickNotes />{" "}
      {pinnedNotes.length > 0 && (
        <div className="mb-8">
          {" "}
          <div className="flex items-center gap-2 mb-4">
            {" "}
            <Pin className="h-4 w-4 text-primary" />{" "}
            <h2 className="text-sm font-medium text-muted-foreground">
              Fixadas
            </h2>{" "}
          </div>{" "}
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {" "}
            {pinnedNotes.map((note) => (
              <NoteCard key={note.id} note={note} />
            ))}{" "}
          </div>{" "}
        </div>
      )}{" "}
      <Separator className="my-6" />{" "}
      <div className="flex items-center gap-2 mb-4">
        {" "}
        <StickyNote className="h-4 w-4 text-muted-foreground" />{" "}
        <h2 className="text-sm font-medium text-muted-foreground">
          {" "}
          Todas as Notas{" "}
        </h2>{" "}
      </div>{" "}
      {unpinnedNotes.length === 0 && pinnedNotes.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-lg border border-dashed border-border p-12 text-center">
          {" "}
          <StickyNote className="h-8 w-8 text-muted-foreground mb-2" />{" "}
          <p className="text-sm text-muted-foreground">
            {" "}
            Nenhuma nota ainda. Use o campo acima para criar uma.{" "}
          </p>{" "}
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {" "}
          {unpinnedNotes.map((note) => (
            <NoteCard key={note.id} note={note} />
          ))}{" "}
        </div>
      )}{" "}
    </div>
  );
}
