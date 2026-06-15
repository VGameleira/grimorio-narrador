import { prisma } from "./prisma";

type AuditDetails = Record<string, unknown>;

export async function createAuditLog(params: {
  userId: string;
  action: string;
  entity: string;
  entityId?: string;
  campaignId?: string;
  details?: AuditDetails;
}) {
  try {
    await prisma.auditLog.create({
      data: {
        userId: params.userId,
        action: params.action,
        entity: params.entity,
        entityId: params.entityId,
        campaignId: params.campaignId,
        details: (params.details ?? {}) as any,
      },
    });
  } catch (error) {
    console.error("Failed to create audit log:", error);
  }
}
