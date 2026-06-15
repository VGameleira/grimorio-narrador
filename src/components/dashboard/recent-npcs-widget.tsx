import Link from "next/link";
import { Users, ArrowRight } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
type RecentNPCsWidgetProps = {
  npcs: Array<{
    id: string;
    name: string;
    status: string;
    campaign: { name: string };
  }>;
};
export function RecentNPCsWidget({ npcs }: RecentNPCsWidgetProps) {
  return (
    <Card>
      {" "}
      <CardHeader className="flex flex-row items-center justify-between">
        {" "}
        <CardTitle className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
          {" "}
          <Users className="h-4 w-4" /> NPCs Recentes{" "}
        </CardTitle>{" "}
        {npcs.length > 0 && (
          <Link
            href="/campaigns"
            className="inline-flex items-center justify-center rounded-lg hover:bg-muted h-7 px-2 py-1 text-xs font-medium whitespace-nowrap"
          >
            {" "}
            Ver todos <ArrowRight className="ml-1 h-3 w-3" />{" "}
          </Link>
        )}{" "}
      </CardHeader>{" "}
      <CardContent>
        {" "}
        {npcs.length === 0 ? (
          <p className="text-sm text-muted-foreground">
            {" "}
            Nenhum NPC criado ainda{" "}
          </p>
        ) : (
          <div className="space-y-3">
            {" "}
            {npcs.map((npc) => (
              <div
                key={npc.id}
                className="flex items-center gap-3 rounded-lg border border-border p-3"
              >
                {" "}
                <Avatar className="h-8 w-8">
                  {" "}
                  <AvatarFallback className="bg-primary/20 text-primary text-xs">
                    {" "}
                    {npc.name.charAt(0).toUpperCase()}{" "}
                  </AvatarFallback>{" "}
                </Avatar>{" "}
                <div className="flex-1 min-w-0">
                  {" "}
                  <p className="text-sm font-medium truncate">
                    {npc.name}
                  </p>{" "}
                  <p className="text-xs text-muted-foreground">
                    {" "}
                    {npc.campaign.name}{" "}
                  </p>{" "}
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
                  {npc.status}{" "}
                </Badge>{" "}
              </div>
            ))}{" "}
          </div>
        )}{" "}
      </CardContent>{" "}
    </Card>
  );
}
