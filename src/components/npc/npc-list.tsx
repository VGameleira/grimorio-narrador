"use client";
import { useState } from "react";
import Link from "next/link";
import { Users, Plus, Search, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { NPCForm } from "./npc-form";
type NPCListItem = {
  id: string;
  name: string;
  image: string | null;
  age: string | null;
  organization: string | null;
  status: string;
};
type NPCListProps = { npcs: NPCListItem[]; campaignId: string };
const statusLabels: Record<string, string> = {
  ALIVE: "Vivo",
  DEAD: "Morto",
  MISSING: "Desaparecido",
  UNKNOWN: "Desconhecido",
};
export function NPCList({ npcs, campaignId }: NPCListProps) {
  const [search, setSearch] = useState("");
  const filtered = npcs.filter(
    (npc) =>
      npc.name.toLowerCase().includes(search.toLowerCase()) ||
      (npc.organization?.toLowerCase().includes(search.toLowerCase()) ?? false)
  );
  return (
    <div className="space-y-4">
      {" "}
      <div className="flex items-center gap-2">
        {" "}
        <div className="relative flex-1">
          {" "}
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />{" "}
          <Input
            placeholder="Buscar NPC..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />{" "}
          {search && (
            <button
              onClick={() => setSearch("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
            >
              {" "}
              <X className="h-4 w-4" />{" "}
            </button>
          )}{" "}
        </div>{" "}
        <Dialog>
          {" "}
          <DialogTrigger
            render={
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Novo NPC
              </Button>
            }
          />{" "}
          <DialogContent className="sm:max-w-lg">
            {" "}
            <DialogHeader>
              {" "}
              <DialogTitle>Novo NPC</DialogTitle>{" "}
            </DialogHeader>{" "}
            <NPCForm campaignId={campaignId} />{" "}
          </DialogContent>{" "}
        </Dialog>{" "}
      </div>{" "}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {" "}
        {filtered.map((npc) => (
          <Link
            key={npc.id}
            href={`/campaigns/${campaignId}/npcs/${npc.id}`}
            className="block"
          >
            {" "}
            <div className="flex items-center gap-3 rounded-lg border border-border p-4 transition-all hover:border-primary/50 hover:shadow-sm">
              {" "}
              <Avatar className="h-10 w-10">
                {" "}
                <AvatarFallback className="bg-primary/20 text-primary text-sm">
                  {" "}
                  {npc.name.charAt(0).toUpperCase()}{" "}
                </AvatarFallback>{" "}
              </Avatar>{" "}
              <div className="flex-1 min-w-0">
                {" "}
                <p className="text-sm font-medium truncate">{npc.name}</p>{" "}
                {npc.organization && (
                  <p className="text-xs text-muted-foreground truncate">
                    {" "}
                    {npc.organization}{" "}
                  </p>
                )}{" "}
              </div>{" "}
              <Badge
                variant={
                  npc.status === "ALIVE"
                    ? "default"
                    : npc.status === "DEAD"
                      ? "destructive"
                      : "secondary"
                }
                className="text-[10px]"
              >
                {" "}
                {statusLabels[npc.status] ?? npc.status}{" "}
              </Badge>{" "}
            </div>{" "}
          </Link>
        ))}{" "}
      </div>{" "}
      {filtered.length === 0 && (
        <div className="flex flex-col items-center justify-center rounded-lg border border-dashed border-border p-12 text-center">
          {" "}
          <div className="mb-4 rounded-full bg-muted p-3">
            {" "}
            <Users className="h-6 w-6 text-muted-foreground" />{" "}
          </div>{" "}
          <h3 className="text-lg font-semibold">Nenhum NPC encontrado</h3>{" "}
          <p className="mt-1 text-sm text-muted-foreground">
            {" "}
            Tente ajustar sua busca{" "}
          </p>{" "}
        </div>
      )}{" "}
    </div>
  );
}
