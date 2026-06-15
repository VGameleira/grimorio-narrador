import type { User } from "../generated/prisma/client";
declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      name: string | null;
      email: string;
      image: string | null;
      role: string;
    };
  }
  interface User {
    role: string;
  }
}
export type CampaignWithCounts = {
  id: string;
  name: string;
  description: string | null;
  coverImage: string | null;
  status: string;
  avgLevel: number;
  system: string;
  createdAt: Date;
  _count: {
    sessions: number;
    npcs: number;
    missions: number;
    factions: number;
    locations: number;
  };
};
export type DashboardStats = {
  totalCampaigns: number;
  totalSessions: number;
  totalNPCs: number;
  totalMissions: number;
  nextSession: {
    date: Date | null;
    number: number | null;
    campaign: string | null;
  } | null;
  activeMissions: number;
  recentNPCs: number;
};
