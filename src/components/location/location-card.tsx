import Link from "next/link";
import { MapPin, Users, Clock } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
type LocationCardProps = {
  location: {
    id: string;
    name: string;
    image: string | null;
    description: string | null;
    _count: { npcs: number; events: number };
  };
  campaignId: string;
  isMaster: boolean;
};
export function LocationCard({ location, campaignId }: LocationCardProps) {
  return (
    <Link href={`/campaigns/${campaignId}/locations/${location.id}`}>
      {" "}
      <Card className="group transition-all hover:border-primary/50 hover:shadow-lg hover:shadow-primary/5 h-full">
        {" "}
        <CardHeader>
          {" "}
          <div className="flex items-start gap-3">
            {" "}
            <div className="rounded-lg bg-muted p-2">
              {" "}
              <MapPin className="h-5 w-5 text-muted-foreground" />{" "}
            </div>{" "}
            <div className="flex-1 min-w-0">
              {" "}
              <CardTitle className="text-base group-hover:text-primary transition-colors truncate">
                {" "}
                {location.name}{" "}
              </CardTitle>{" "}
              {location.description && (
                <CardDescription className="line-clamp-2 mt-1">
                  {" "}
                  {location.description}{" "}
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
              <Users className="h-3.5 w-3.5" /> {location._count.npcs} NPCs{" "}
            </span>{" "}
            <span className="flex items-center gap-1">
              {" "}
              <Clock className="h-3.5 w-3.5" /> {location._count.events}{" "}
              eventos{" "}
            </span>{" "}
          </div>{" "}
        </CardContent>{" "}
      </Card>{" "}
    </Link>
  );
}
