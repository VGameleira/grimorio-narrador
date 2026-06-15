"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  ScrollText,
  Users,
  Swords,
  Flag,
  MapPin,
  Clock,
  EyeOff,
  BookOpen,
} from "lucide-react";
type Tab = {
  label: string;
  href: string;
  icon: React.ElementType;
  masterOnly?: boolean;
};
export function CampaignTabs({
  campaignId,
  isMaster,
}: {
  campaignId: string;
  isMaster: boolean;
}) {
  const pathname = usePathname();
  const tabs: Tab[] = [
    {
      label: "Visão Geral",
      href: `/campaigns/${campaignId}`,
      icon: LayoutDashboard,
    },
    {
      label: "Sessões",
      href: `/campaigns/${campaignId}/sessions`,
      icon: ScrollText,
    },
    { label: "NPCs", href: `/campaigns/${campaignId}/npcs`, icon: Users },
    {
      label: "Missões",
      href: `/campaigns/${campaignId}/missions`,
      icon: Swords,
    },
    { label: "Facções", href: `/campaigns/${campaignId}/factions`, icon: Flag },
    {
      label: "Locais",
      href: `/campaigns/${campaignId}/locations`,
      icon: MapPin,
    },
    {
      label: "Timeline",
      href: `/campaigns/${campaignId}/timeline`,
      icon: Clock,
    },
    {
      label: "Segredos",
      href: `/campaigns/${campaignId}/secrets`,
      icon: EyeOff,
      masterOnly: true,
    },
    { label: "Wiki", href: `/campaigns/${campaignId}/wiki`, icon: BookOpen },
  ];
  return (
    <nav className="flex gap-1 border-b border-border pb-px">
      {" "}
      {tabs.map((tab) => {
        if (tab.masterOnly && !isMaster) return null;
        const isActive = tab.href === pathname;
        return (
          <Link
            key={tab.href}
            href={tab.href}
            className={cn(
              "flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-colors",
              isActive
                ? "border-primary text-primary"
                : "border-transparent text-muted-foreground hover:text-foreground hover:border-border"
            )}
          >
            {" "}
            <tab.icon className="h-4 w-4" /> {tab.label}{" "}
          </Link>
        );
      })}{" "}
    </nav>
  );
}
