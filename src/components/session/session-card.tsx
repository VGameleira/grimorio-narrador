"use client";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatDateShort, truncate } from "@/lib/utils";
type SessionCardProps = {
  session: {
    id: string;
    number: number;
    summary: string | null;
    date: Date | null;
    master: { id: string; name: string | null; image: string | null };
    _count?: { npcs: number };
  };
  campaignId: string;
};
export function SessionCard({ session, campaignId }: SessionCardProps) {
  const router = useRouter();
  return (
    <Card
      className="cursor-pointer hover:bg-muted/50 transition-colors"
      onClick={() =>
        router.push(`/campaigns/${campaignId}/sessions/${session.id}`)
      }
    >
      {" "}
      <CardHeader>
        {" "}
        <div className="flex items-center justify-between">
          {" "}
          <CardTitle>Sessão {session.number}</CardTitle>{" "}
          {session.date && (
            <Badge variant="outline">{formatDateShort(session.date)}</Badge>
          )}{" "}
        </div>{" "}
      </CardHeader>{" "}
      <CardContent className="space-y-2">
        {" "}
        {session.summary && (
          <p className="text-sm text-muted-foreground">
            {" "}
            {truncate(session.summary, 150)}{" "}
          </p>
        )}{" "}
        <div className="flex gap-2 text-xs text-muted-foreground">
          {" "}
          <span>Mestre: {session.master.name ?? "Desconhecido"}</span>{" "}
          {session._count && (
            <>
              {" "}
              <span>·</span> <span>{session._count.npcs} NPCs</span>{" "}
            </>
          )}{" "}
        </div>{" "}
      </CardContent>{" "}
    </Card>
  );
}
