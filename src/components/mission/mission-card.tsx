"use client";
import { useRouter } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { truncate } from "@/lib/utils";
type MissionCardProps = {
  mission: {
    id: string;
    title: string;
    grade: string | null;
    description: string | null;
    status: string;
  };
  campaignId: string;
};
const statusLabels: Record<string, string> = {
  AVAILABLE: "Disponível",
  IN_PROGRESS: "Em Andamento",
  COMPLETED: "Concluída",
  FAILED: "Falha",
};
const statusVariants: Record<
  string,
  "default" | "secondary" | "destructive" | "outline"
> = {
  AVAILABLE: "outline",
  IN_PROGRESS: "default",
  COMPLETED: "secondary",
  FAILED: "destructive",
};
export function MissionCard({ mission, campaignId }: MissionCardProps) {
  const router = useRouter();
  return (
    <Card
      className="cursor-pointer hover:bg-muted/50 transition-colors"
      onClick={() =>
        router.push(`/campaigns/${campaignId}/missions/${mission.id}`)
      }
    >
      {" "}
      <CardHeader>
        {" "}
        <div className="flex items-center justify-between">
          {" "}
          <CardTitle>{mission.title}</CardTitle>{" "}
          {mission.grade && (
            <Badge variant="outline">{mission.grade}</Badge>
          )}{" "}
        </div>{" "}
      </CardHeader>{" "}
      <CardContent className="space-y-2">
        {" "}
        <Badge variant={statusVariants[mission.status]}>
          {" "}
          {statusLabels[mission.status]}{" "}
        </Badge>{" "}
        {mission.description && (
          <p className="text-sm text-muted-foreground">
            {" "}
            {truncate(mission.description, 120)}{" "}
          </p>
        )}{" "}
      </CardContent>{" "}
    </Card>
  );
}
