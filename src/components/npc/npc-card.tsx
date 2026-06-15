import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
type NPCCardProps = {
  npc: {
    id: string;
    name: string;
    image: string | null;
    age: string | null;
    organization: string | null;
    status: string;
  };
  campaignId: string;
};
const statusLabels: Record<string, string> = {
  ALIVE: "Vivo",
  DEAD: "Morto",
  MISSING: "Desaparecido",
  UNKNOWN: "Desconhecido",
};
export function NPCCard({ npc, campaignId }: NPCCardProps) {
  return (
    <Link href={`/campaigns/${campaignId}/npcs/${npc.id}`}>
      {" "}
      <Card className="group transition-all hover:border-primary/50 hover:shadow-lg hover:shadow-primary/5">
        {" "}
        <CardContent className="p-4">
          {" "}
          <div className="flex items-center gap-3">
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
              <p className="text-sm font-medium truncate group-hover:text-primary transition-colors">
                {" "}
                {npc.name}{" "}
              </p>{" "}
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                {" "}
                {npc.age && <span>{npc.age}</span>}{" "}
                {npc.organization && (
                  <>
                    {" "}
                    {npc.age && <span>·</span>}{" "}
                    <span className="truncate">{npc.organization}</span>{" "}
                  </>
                )}{" "}
              </div>{" "}
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
        </CardContent>{" "}
      </Card>{" "}
    </Link>
  );
}
