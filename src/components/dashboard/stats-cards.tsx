import { Swords, ScrollText, Users, Siren } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
type StatsCardsProps = {
  totalCampaigns: number;
  totalSessions: number;
  totalNPCs: number;
  activeMissions: number;
};
export function StatsCards({
  totalCampaigns,
  totalSessions,
  totalNPCs,
  activeMissions,
}: StatsCardsProps) {
  const stats = [
    {
      title: "Campanhas",
      value: totalCampaigns,
      icon: Swords,
      color: "text-primary",
      bg: "bg-primary/10",
    },
    {
      title: "Sessões",
      value: totalSessions,
      icon: ScrollText,
      color: "text-accent",
      bg: "bg-accent/10",
    },
    {
      title: "NPCs",
      value: totalNPCs,
      icon: Users,
      color: "text-purple-500",
      bg: "bg-purple-500/10",
    },
    {
      title: "Missões Ativas",
      value: activeMissions,
      icon: Siren,
      color: "text-destructive",
      bg: "bg-destructive/10",
    },
  ];
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {" "}
      {stats.map((stat) => (
        <Card key={stat.title}>
          {" "}
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            {" "}
            <CardTitle className="text-sm font-medium text-muted-foreground">
              {" "}
              {stat.title}{" "}
            </CardTitle>{" "}
            <div className={`rounded-lg p-2 ${stat.bg}`}>
              {" "}
              <stat.icon className={`h-4 w-4 ${stat.color}`} />{" "}
            </div>{" "}
          </CardHeader>{" "}
          <CardContent>
            {" "}
            <div className="text-3xl font-bold">{stat.value}</div>{" "}
          </CardContent>{" "}
        </Card>
      ))}{" "}
    </div>
  );
}
