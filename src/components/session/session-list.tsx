"use client";
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { PlusIcon } from "lucide-react";
import { SessionCard } from "./session-card";
import { SessionForm } from "./session-form";
type Session = {
  id: string;
  number: number;
  summary: string | null;
  date: Date | null;
  master: { id: string; name: string | null; image: string | null };
  _count?: { npcs: number };
};
type SessionListProps = { sessions: Session[]; campaignId: string };
export function SessionList({ sessions, campaignId }: SessionListProps) {
  const [open, setOpen] = useState(false);
  return (
    <div>
      {" "}
      <div className="space-y-3">
        {" "}
        {sessions.map((session) => (
          <SessionCard
            key={session.id}
            session={session}
            campaignId={campaignId}
          />
        ))}{" "}
        {sessions.length === 0 && (
          <p className="text-center text-sm text-muted-foreground py-12 border border-dashed border-border rounded-lg">
            {" "}
            Nenhuma sessão registrada{" "}
          </p>
        )}{" "}
      </div>{" "}
      <Dialog open={open} onOpenChange={setOpen}>
        {" "}
        <DialogTrigger
          render={
            <Button className="mt-6">
              <PlusIcon className="h-4 w-4" />
              Nova Sessão
            </Button>
          }
        />{" "}
        <DialogContent className="sm:max-w-lg">
          {" "}
          <DialogHeader>
            {" "}
            <DialogTitle>Nova Sessão</DialogTitle>{" "}
          </DialogHeader>{" "}
          <SessionForm
            campaignId={campaignId}
            onClose={() => setOpen(false)}
          />{" "}
        </DialogContent>{" "}
      </Dialog>{" "}
    </div>
  );
}
