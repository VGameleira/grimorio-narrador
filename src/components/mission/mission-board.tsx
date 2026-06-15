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
import { MissionCard } from "./mission-card";
import { MissionForm } from "./mission-form";
type Mission = {
  id: string;
  title: string;
  grade: string | null;
  description: string | null;
  objectives: string | null;
  reward: string | null;
  status: string;
  createdAt: Date;
};
type MissionBoardProps = { missions: Mission[]; campaignId: string };
const columns = [
  { key: "AVAILABLE", label: "Disponíveis" },
  { key: "IN_PROGRESS", label: "Em Andamento" },
  { key: "COMPLETED", label: "Concluídas" },
  { key: "FAILED", label: "Falhas" },
] as const;
export function MissionBoard({ missions, campaignId }: MissionBoardProps) {
  const [open, setOpen] = useState(false);
  return (
    <div>
      {" "}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
        {" "}
        {columns.map((column) => {
          const columnMissions = missions.filter(
            (m) => m.status === column.key
          );
          return (
            <div key={column.key} className="space-y-3">
              {" "}
              <div className="flex items-center justify-between">
                {" "}
                <h3 className="text-sm font-medium text-muted-foreground">
                  {" "}
                  {column.label}{" "}
                </h3>{" "}
                <span className="text-xs text-muted-foreground">
                  {" "}
                  {columnMissions.length}{" "}
                </span>{" "}
              </div>{" "}
              <div className="space-y-3">
                {" "}
                {columnMissions.map((mission) => (
                  <MissionCard
                    key={mission.id}
                    mission={mission}
                    campaignId={campaignId}
                  />
                ))}{" "}
                {columnMissions.length === 0 && (
                  <p className="text-center text-sm text-muted-foreground py-8 border border-dashed border-border rounded-lg">
                    {" "}
                    Nenhuma missão{" "}
                  </p>
                )}{" "}
              </div>{" "}
            </div>
          );
        })}{" "}
      </div>{" "}
      <Dialog open={open} onOpenChange={setOpen}>
        {" "}
        <DialogTrigger
          render={
            <Button className="mt-6">
              <PlusIcon className="h-4 w-4" />
              Nova Missão
            </Button>
          }
        />{" "}
        <DialogContent>
          {" "}
          <DialogHeader>
            {" "}
            <DialogTitle>Nova Missão</DialogTitle>{" "}
          </DialogHeader>{" "}
          <MissionForm
            campaignId={campaignId}
            onClose={() => setOpen(false)}
          />{" "}
        </DialogContent>{" "}
      </Dialog>{" "}
    </div>
  );
}
