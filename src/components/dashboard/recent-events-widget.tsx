import { CalendarDays } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatDateShort } from "@/lib/utils";
type RecentEventsWidgetProps = {
  events: Array<{
    id: string;
    title: string;
    createdAt: Date;
    campaign: { name: string };
  }>;
};
export function RecentEventsWidget({ events }: RecentEventsWidgetProps) {
  return (
    <Card>
      {" "}
      <CardHeader>
        {" "}
        <CardTitle className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
          {" "}
          <CalendarDays className="h-4 w-4" /> Eventos Recentes{" "}
        </CardTitle>{" "}
      </CardHeader>{" "}
      <CardContent>
        {" "}
        {events.length === 0 ? (
          <p className="text-sm text-muted-foreground">
            {" "}
            Nenhum evento registrado ainda{" "}
          </p>
        ) : (
          <div className="space-y-3">
            {" "}
            {events.map((event) => (
              <div
                key={event.id}
                className="flex items-center justify-between rounded-lg border border-border p-3"
              >
                {" "}
                <div className="min-w-0">
                  {" "}
                  <p className="text-sm font-medium truncate">
                    {event.title}
                  </p>{" "}
                  <p className="text-xs text-muted-foreground">
                    {" "}
                    {event.campaign.name}{" "}
                  </p>{" "}
                </div>{" "}
                <span className="text-xs text-muted-foreground shrink-0 ml-2">
                  {" "}
                  {formatDateShort(event.createdAt)}{" "}
                </span>{" "}
              </div>
            ))}{" "}
          </div>
        )}{" "}
      </CardContent>{" "}
    </Card>
  );
}
