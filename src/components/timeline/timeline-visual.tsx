"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Clock, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { PageHeader } from "@/components/shared/page-header";
import { EmptyState } from "@/components/shared/empty-state";
import { TimelineEvent } from "@/components/timeline/timeline-event";
import { TimelineForm } from "@/components/timeline/timeline-form";
type Event = {
  id: string;
  title: string;
  description: string | null;
  date: Date | string | null;
  dateText: string | null;
  order: number;
  type: string;
  location: { id: string; name: string } | null;
};
type TimelineVisualProps = {
  events: Event[];
  campaignId: string;
  isMaster: boolean;
};
export function TimelineVisual({
  events,
  campaignId,
  isMaster,
}: TimelineVisualProps) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  if (events.length === 0) {
    return (
      <div>
        {" "}
        <PageHeader
          title="Timeline"
          description="Linha do tempo dos eventos da campanha"
          action={
            isMaster && (
              <Dialog open={open} onOpenChange={setOpen}>
                {" "}
                <DialogTrigger >
                  {" "}
                  <Button>
                    {" "}
                    <Plus className="mr-2 h-4 w-4" /> Novo Evento{" "}
                  </Button>{" "}
                </DialogTrigger>{" "}
                <DialogContent>
                  {" "}
                  <DialogHeader>
                    {" "}
                    <DialogTitle>Novo Evento</DialogTitle>{" "}
                    <DialogDescription>
                      {" "}
                      Adicione um evento à linha do tempo{" "}
                    </DialogDescription>{" "}
                  </DialogHeader>{" "}
                  <TimelineForm
                    campaignId={campaignId}
                    onSuccess={() => {
                      setOpen(false);
                      router.refresh();
                    }}
                  />{" "}
                </DialogContent>{" "}
              </Dialog>
            )
          }
        />{" "}
        <EmptyState
          icon={Clock}
          title="Nenhum evento registrado"
          description="Adicione eventos para construir a linha do tempo da campanha."
        />{" "}
      </div>
    );
  }
  return (
    <div>
      {" "}
      <PageHeader
        title="Timeline"
        description="Linha do tempo dos eventos da campanha"
        action={
          isMaster && (
            <Dialog open={open} onOpenChange={setOpen}>
              {" "}
              <DialogTrigger >
                {" "}
                <Button>
                  {" "}
                  <Plus className="mr-2 h-4 w-4" /> Novo Evento{" "}
                </Button>{" "}
              </DialogTrigger>{" "}
              <DialogContent>
                {" "}
                <DialogHeader>
                  {" "}
                  <DialogTitle>Novo Evento</DialogTitle>{" "}
                  <DialogDescription>
                    {" "}
                    Adicione um evento à linha do tempo{" "}
                  </DialogDescription>{" "}
                </DialogHeader>{" "}
                <TimelineForm
                  campaignId={campaignId}
                  onSuccess={() => {
                    setOpen(false);
                    router.refresh();
                  }}
                />{" "}
              </DialogContent>{" "}
            </Dialog>
          )
        }
      />{" "}
      <div className="relative">
        {" "}
        <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-border" />{" "}
        <div className="space-y-6">
          {" "}
          {events.map((event, index) => (
            <div key={event.id} className="relative pl-10">
              {" "}
              <div className="absolute left-2.5 top-1.5 h-3 w-3 rounded-full border-2 border-primary bg-background z-10" />{" "}
              <TimelineEvent
                event={event}
                campaignId={campaignId}
                isMaster={isMaster}
                isFirst={index === 0}
                isLast={index === events.length - 1}
              />{" "}
            </div>
          ))}{" "}
        </div>{" "}
      </div>{" "}
    </div>
  );
}
