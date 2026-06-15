import { CalendarDays, ScrollText } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatDate } from "@/lib/utils";
type NextSessionCardProps = {
  session: { date: Date; number: number; campaign: string };
};
export function NextSessionCard({ session }: NextSessionCardProps) {
  return (
    <Card>
      {" "}
      <CardHeader>
        {" "}
        <CardTitle className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
          {" "}
          <CalendarDays className="h-4 w-4" /> Próxima Sessão{" "}
        </CardTitle>{" "}
      </CardHeader>{" "}
      <CardContent>
        {" "}
        <div className="flex items-center justify-between">
          {" "}
          <div>
            {" "}
            <p className="text-lg font-semibold">
              {" "}
              Sessão #{session.number}{" "}
            </p>{" "}
            <p className="text-sm text-muted-foreground">
              {" "}
              {formatDate(session.date)}{" "}
            </p>{" "}
          </div>{" "}
          <Badge variant="secondary" className="gap-1">
            {" "}
            <ScrollText className="h-3 w-3" /> {session.campaign}{" "}
          </Badge>{" "}
        </div>{" "}
      </CardContent>{" "}
    </Card>
  );
}
