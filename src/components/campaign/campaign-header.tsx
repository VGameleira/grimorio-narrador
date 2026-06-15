import { Badge } from "@/components/ui/badge";
type CampaignHeaderProps = {
  campaign: {
    id: string;
    name: string;
    description: string | null;
    coverImage: string | null;
    status: string;
    avgLevel: number;
    system: string;
  };
  isMaster: boolean;
};
const statusColors: Record<string, string> = {
  ACTIVE: "bg-green-500/10 text-green-500",
  PAUSED: "bg-yellow-500/10 text-yellow-500",
  COMPLETED: "bg-blue-500/10 text-blue-500",
  ARCHIVED: "bg-muted text-muted-foreground",
};
const statusLabels: Record<string, string> = {
  ACTIVE: "Ativo",
  PAUSED: "Pausado",
  COMPLETED: "Concluído",
  ARCHIVED: "Arquivado",
};
export function CampaignHeader({ campaign, isMaster }: CampaignHeaderProps) {
  return (
    <div className="mb-8">
      {" "}
      <div className="flex items-start justify-between">
        {" "}
        <div>
          {" "}
          <h1 className="text-3xl font-bold tracking-tight">
            {" "}
            {campaign.name}{" "}
          </h1>{" "}
          {campaign.description && (
            <p className="mt-2 text-muted-foreground max-w-2xl">
              {" "}
              {campaign.description}{" "}
            </p>
          )}{" "}
        </div>{" "}
        <Badge className={`${statusColors[campaign.status]} border-0`}>
          {" "}
          {statusLabels[campaign.status]}{" "}
        </Badge>{" "}
      </div>{" "}
      <div className="mt-4 flex items-center gap-4 text-sm text-muted-foreground">
        {" "}
        <span>
          {" "}
          Sistema:{" "}
          <span className="text-foreground font-medium">
            {" "}
            {campaign.system === "feiticos-maldicoes-v2.5"
              ? "Feitiços & Maldições v2.5"
              : campaign.system}{" "}
          </span>{" "}
        </span>{" "}
        <span>
          {" "}
          Nível:{" "}
          <span className="text-foreground font-medium">
            {" "}
            {campaign.avgLevel}{" "}
          </span>{" "}
        </span>{" "}
        {isMaster && (
          <Badge variant="outline" className="border-primary/30 text-primary">
            {" "}
            Mestre{" "}
          </Badge>
        )}{" "}
      </div>{" "}
    </div>
  );
}
