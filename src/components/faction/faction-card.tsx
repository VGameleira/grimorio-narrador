import Link from "next/link";
import { Building2, GitBranch, TrendingUp, DollarSign } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
type FactionCardProps = {
  faction: {
    id: string;
    name: string;
    image: string | null;
    description: string | null;
    influence: number;
    resources: number;
    _count: { relationsFrom: number };
  };
  campaignId: string;
  isMaster: boolean;
};
export function FactionCard({ faction, campaignId }: FactionCardProps) {
  return (
    <Link href={`/campaigns/${campaignId}/factions/${faction.id}`}>
      {" "}
      <Card className="group transition-all hover:border-primary/50 hover:shadow-lg hover:shadow-primary/5 h-full">
        {" "}
        <CardHeader>
          {" "}
          <div className="flex items-start gap-3">
            {" "}
            <div className="rounded-lg bg-muted p-2">
              {" "}
              <Building2 className="h-5 w-5 text-muted-foreground" />{" "}
            </div>{" "}
            <div className="flex-1 min-w-0">
              {" "}
              <CardTitle className="text-base group-hover:text-primary transition-colors truncate">
                {" "}
                {faction.name}{" "}
              </CardTitle>{" "}
              {faction.description && (
                <CardDescription className="line-clamp-2 mt-1">
                  {" "}
                  {faction.description}{" "}
                </CardDescription>
              )}{" "}
            </div>{" "}
          </div>{" "}
        </CardHeader>{" "}
        <CardContent>
          {" "}
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            {" "}
            <span className="flex items-center gap-1">
              {" "}
              <TrendingUp className="h-3.5 w-3.5" /> Influência{" "}
              {faction.influence}{" "}
            </span>{" "}
            <span className="flex items-center gap-1">
              {" "}
              <DollarSign className="h-3.5 w-3.5" /> Recursos{" "}
              {faction.resources}{" "}
            </span>{" "}
            <span className="flex items-center gap-1">
              {" "}
              <GitBranch className="h-3.5 w-3.5" />{" "}
              {faction._count.relationsFrom} relações{" "}
            </span>{" "}
          </div>{" "}
        </CardContent>{" "}
      </Card>{" "}
    </Link>
  );
}
