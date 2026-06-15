import { auth } from "./auth";
import { prisma } from "./prisma";
export type Role = "MASTER" | "PLAYER";
export async function getUserRole(): Promise<Role | null> {
  const session = await auth();
  if (!session?.user?.id) return null;
  return session.user.role as Role;
}
export async function requireRole(role: Role): Promise<void> {
  const userRole = await getUserRole();
  if (userRole !== role) {
    throw new Error("Unauthorized: insufficient permissions");
  }
}
export async function requireMaster(): Promise<void> {
  return requireRole("MASTER");
}
export async function isMaster(): Promise<boolean> {
  const role = await getUserRole();
  return role === "MASTER";
}
export async function getCampaignMemberRole(
  campaignId: string,
  userId: string
): Promise<Role | null> {
  const member = await prisma.campaignMember.findUnique({
    where: { userId_campaignId: { userId, campaignId } },
  });
  return member?.role as Role | null;
}
export async function requireCampaignAccess(
  campaignId: string,
  userId: string,
  requireWrite: boolean = false
): Promise<void> {
  const member = await prisma.campaignMember.findUnique({
    where: { userId_campaignId: { userId, campaignId } },
  });
  if (!member) {
    throw new Error("Unauthorized: not a member of this campaign");
  }
  if (requireWrite && member.role !== "MASTER") {
    throw new Error("Unauthorized: only masters can modify this resource");
  }
}
