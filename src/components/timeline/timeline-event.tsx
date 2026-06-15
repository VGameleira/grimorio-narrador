"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Pencil, Trash2, MapPin } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
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
type TimelineEventProps = {
  event: Event;
  campaignId: string;
  isMaster: boolean;
  isFirst?: boolean;
  isLast?: boolean;
};
const typeColors: Record<string, string> = {
  battle: "bg-red-500/10 text-red-500 border-red-500/20",
  story: "bg-blue-500/10 text-blue-500 border-blue-500/20",
  session: "bg-green-500/10 text-green-500 border-green-500/20",
  discovery: "bg-purple-500/10 text-purple-500 border-purple-500/20",
  npc: "bg-yellow-500/10 text-yellow-500 border-yellow-500/20",
};
export function TimelineEvent({
  event,
  campaignId,
  isMaster,
}: TimelineEventProps) {
  const router = useRouter();
  const [editOpen, setEditOpen] = useState(false);
  async function handleDelete() {
    await fetch(`/api/campaigns/${campaignId}/timeline/${event.id}`, {
      method: "DELETE",
    });
    router.refresh();
  }
  return (
    <Card className="transition-all hover:border-primary/50">
      {" "}
      <CardHeader className="pb-3">
        {" "}
        <div className="flex items-start justify-between">
          {" "}
          <div className="space-y-1">
            {" "}
            <div className="flex items-center gap-2">
              {" "}
              <CardTitle className="text-base">{event.title}</CardTitle>{" "}
              <Badge
                variant="outline"
                className={`text-xs ${typeColors[event.type] ?? "bg-muted text-muted-foreground border-border"}`}
              >
                {" "}
                {event.type}{" "}
              </Badge>{" "}
            </div>{" "}
            <div className="flex items-center gap-3 text-xs text-muted-foreground">
              {" "}
              {event.dateText && <span>{event.dateText}</span>}{" "}
              {event.location && (
                <span className="flex items-center gap-1">
                  {" "}
                  <MapPin className="h-3 w-3" /> {event.location.name}{" "}
                </span>
              )}{" "}
            </div>{" "}
          </div>{" "}
          {isMaster && (
            <div className="flex items-center gap-1">
              {" "}
              <Dialog open={editOpen} onOpenChange={setEditOpen}>
                {" "}
                <DialogTrigger >
                  {" "}
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    {" "}
                    <Pencil className="h-4 w-4" />{" "}
                  </Button>{" "}
                </DialogTrigger>{" "}
                <DialogContent>
                  {" "}
                  <DialogHeader>
                    {" "}
                    <DialogTitle>Editar Evento</DialogTitle>{" "}
                    <DialogDescription>
                      {" "}
                      Altere os detalhes do evento{" "}
                    </DialogDescription>{" "}
                  </DialogHeader>{" "}
                  <TimelineForm
                    campaignId={campaignId}
                    initialData={event}
                    onSuccess={() => {
                      setEditOpen(false);
                      router.refresh();
                    }}
                  />{" "}
                </DialogContent>{" "}
              </Dialog>{" "}
              <AlertDialog>
                {" "}
                <AlertDialogTrigger >
                  {" "}
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-muted-foreground hover:text-destructive"
                  >
                    {" "}
                    <Trash2 className="h-4 w-4" />{" "}
                  </Button>{" "}
                </AlertDialogTrigger>{" "}
                <AlertDialogContent>
                  {" "}
                  <AlertDialogHeader>
                    {" "}
                    <AlertDialogTitle>Excluir Evento</AlertDialogTitle>{" "}
                    <AlertDialogDescription>
                      {" "}
                      Tem certeza que deseja excluir este evento? Esta ação não
                      pode ser desfeita.{" "}
                    </AlertDialogDescription>{" "}
                  </AlertDialogHeader>{" "}
                  <AlertDialogFooter>
                    {" "}
                    <AlertDialogCancel>Cancelar</AlertDialogCancel>{" "}
                    <AlertDialogAction onClick={handleDelete}>
                      {" "}
                      Excluir{" "}
                    </AlertDialogAction>{" "}
                  </AlertDialogFooter>{" "}
                </AlertDialogContent>{" "}
              </AlertDialog>{" "}
            </div>
          )}{" "}
        </div>{" "}
      </CardHeader>{" "}
      {event.description && (
        <CardContent>
          {" "}
          <CardDescription className="text-sm">
            {event.description}
          </CardDescription>{" "}
        </CardContent>
      )}{" "}
    </Card>
  );
}
