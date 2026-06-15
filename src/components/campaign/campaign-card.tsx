import Link from "next/link";
import { ScrollText, Users, Swords, CalendarDays } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatDateShort } from "@/lib/utils";
type CampaignCardProps = {
  campaign: {
    id: string;
    name: string;
    description: string | null;
    coverImage: string | null;
    status: string;
    avgLevel: number;
    createdAt: Date;
    _count: { sessions: number; npcs: number; missions: number };
  };
  isMaster: boolean;
};
const statusColors: Record<string, string> = {
  ACTIVE: "bg-green-500/10 text-green-500 border-green-500/20",
  PAUSED: "bg-yellow-500/10 text-yellow-500 border-yellow-500/20",
  COMPLETED: "bg-blue-500/10 text-blue-500 border-blue-500/20",
  ARCHIVED: "bg-muted text-muted-foreground border-border",
};
const statusLabels: Record<string, string> = {
  ACTIVE: "Ativo",
  PAUSED: "Pausado",
  COMPLETED: "Concluído",
  ARCHIVED: "Arquivado",
};
export function CampaignCard({ campaign, isMaster }: CampaignCardProps) {
  return (
    <Link href={`/campaigns/${campaign.id}`}>
      {" "}
      <Card className="group transition-all hover:border-primary/50 hover:shadow-lg hover:shadow-primary/5">
        {" "}
        <CardHeader>
          {" "}
          <div className="flex items-start justify-between">
            {" "}
            <CardTitle className="text-lg group-hover:text-primary transition-colors">
              {" "}
              {campaign.name}{" "}
            </CardTitle>{" "}
            <Badge
              variant="outline"
              className={`${statusColors[campaign.status] ?? statusColors.ACTIVE}`}
            >
              {" "}
              {statusLabels[campaign.status] ?? campaign.status}{" "}
            </Badge>{" "}
          </div>{" "}
          {campaign.description && (
            <CardDescription className="line-clamp-2">
              {" "}
              {campaign.description}{" "}
            </CardDescription>
          )}{" "}
        </CardHeader>{" "}
        <CardContent>
          {" "}
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            {" "}
            <span className="flex items-center gap-1">
              {" "}
              <ScrollText className="h-3.5 w-3.5" /> {campaign._count.sessions}{" "}
              sessões{" "}
            </span>{" "}
            <span className="flex items-center gap-1">
              {" "}
              <Users className="h-3.5 w-3.5" /> {campaign._count.npcs} NPCs{" "}
            </span>{" "}
            <span className="flex items-center gap-1">
              {" "}
              <Swords className="h-3.5 w-3.5" /> {campaign._count.missions}{" "}
              missões{" "}
            </span>{" "}
          </div>{" "}
        </CardContent>{" "}
        <CardFooter className="flex items-center justify-between text-xs text-muted-foreground">
          {" "}
          <span className="flex items-center gap-1">
            {" "}
            <CalendarDays className="h-3 w-3" />{" "}
            {formatDateShort(campaign.createdAt)}{" "}
          </span>{" "}
          <span>Nv. {campaign.avgLevel}</span>{" "}
        </CardFooter>{" "}
      </Card>{" "}
    </Link>
  );
}
