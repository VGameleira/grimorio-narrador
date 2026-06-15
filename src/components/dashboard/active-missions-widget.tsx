import { Siren } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
type ActiveMissionsWidgetProps = { total: number; campaignCount: number };
export function ActiveMissionsWidget({
  total,
  campaignCount,
}: ActiveMissionsWidgetProps) {
  return (
    <Card>
      {" "}
      <CardHeader>
        {" "}
        <CardTitle className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
          {" "}
          <Siren className="h-4 w-4" /> Missões Ativas{" "}
        </CardTitle>{" "}
      </CardHeader>{" "}
      <CardContent>
        {" "}
        <div className="flex items-end justify-between">
          {" "}
          <div>
            {" "}
            <p className="text-3xl font-bold">{total}</p>{" "}
            <p className="text-sm text-muted-foreground">
              {" "}
              em {campaignCount} campanha{campaignCount !== 1 ? "s" : ""}{" "}
            </p>{" "}
          </div>{" "}
          <div className="rounded-full bg-destructive/10 p-3">
            {" "}
            <Siren className="h-6 w-6 text-destructive" />{" "}
          </div>{" "}
        </div>{" "}
      </CardContent>{" "}
    </Card>
  );
}
