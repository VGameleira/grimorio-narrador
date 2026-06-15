import { prisma } from "@/lib/prisma";
import { ScrollText, Users, Swords, Flag, MapPin } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatDate } from "@/lib/utils";
type CampaignOverviewProps = {
  campaign: {
    id: string;
    name: string;
    createdAt: Date;
    _count: {
      sessions: number;
      npcs: number;
      missions: number;
      factions: number;
      locations: number;
    };
    sessions: Array<{
      number: number;
      date: Date | null;
      summary: string | null;
    }>;
  };
};
export async function CampaignOverview({ campaign }: CampaignOverviewProps) {
  const stats = [
    { label: "Sessões", value: campaign._count.sessions, icon: ScrollText },
    { label: "NPCs", value: campaign._count.npcs, icon: Users },
    { label: "Missões", value: campaign._count.missions, icon: Swords },
    { label: "Facções", value: campaign._count.factions, icon: Flag },
    { label: "Locais", value: campaign._count.locations, icon: MapPin },
  ];
  return (
    <div className="grid gap-6 lg:grid-cols-3">
      {" "}
      <div className="lg:col-span-2 space-y-6">
        {" "}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {" "}
          {stats.map((stat) => (
            <Card key={stat.label}>
              {" "}
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                {" "}
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  {" "}
                  {stat.label}{" "}
                </CardTitle>{" "}
                <stat.icon className="h-4 w-4 text-muted-foreground" />{" "}
              </CardHeader>{" "}
              <CardContent>
                {" "}
                <div className="text-2xl font-bold">{stat.value}</div>{" "}
              </CardContent>{" "}
            </Card>
          ))}{" "}
        </div>{" "}
        {campaign.sessions.length > 0 && (
          <Card>
            {" "}
            <CardHeader>
              {" "}
              <CardTitle className="text-sm font-medium">
                {" "}
                Última Sessão{" "}
              </CardTitle>{" "}
            </CardHeader>{" "}
            <CardContent>
              {" "}
              <p className="text-lg font-semibold">
                {" "}
                Sessão #{campaign.sessions[0].number}{" "}
              </p>{" "}
              {campaign.sessions[0].date && (
                <p className="text-sm text-muted-foreground">
                  {" "}
                  {formatDate(campaign.sessions[0].date)}{" "}
                </p>
              )}{" "}
              {campaign.sessions[0].summary && (
                <p className="mt-2 text-sm text-muted-foreground line-clamp-3">
                  {" "}
                  {campaign.sessions[0].summary}{" "}
                </p>
              )}{" "}
            </CardContent>{" "}
          </Card>
        )}{" "}
      </div>{" "}
      <div>
        {" "}
        <Card>
          {" "}
          <CardHeader>
            {" "}
            <CardTitle className="text-sm font-medium">
              {" "}
              Informações da Campanha{" "}
            </CardTitle>{" "}
          </CardHeader>{" "}
          <CardContent className="space-y-3 text-sm">
            {" "}
            <div className="flex justify-between">
              {" "}
              <span className="text-muted-foreground">Criada em</span>{" "}
              <span>{formatDate(campaign.createdAt)}</span>{" "}
            </div>{" "}
            <div className="flex justify-between">
              {" "}
              <span className="text-muted-foreground">
                Média de Sessões
              </span>{" "}
              <span>--</span>{" "}
            </div>{" "}
          </CardContent>{" "}
        </Card>{" "}
      </div>{" "}
    </div>
  );
}
