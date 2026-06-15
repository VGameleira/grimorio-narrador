import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { TimelineVisual } from "@/components/timeline/timeline-visual";

export default async function TimelinePage({
  params,
}: {
  params: Promise<{ campaignId: string }>;
}) {
  const { campaignId } = await params;
  const session = await auth();
  if (!session?.user) redirect("/login");

  const member = await prisma.campaignMember.findUnique({
    where: { userId_campaignId: { userId: session.user.id, campaignId } },
  });
  if (!member) redirect("/campaigns");

  const isMaster = member.role === "MASTER";

  const events = await prisma.timelineEvent.findMany({
    where: { campaignId },
    include: {
      location: { select: { id: true, name: true } },
    },
    orderBy: { order: "asc" },
  });

  return (
    <div>
      <TimelineVisual
        events={events}
        campaignId={campaignId}
        isMaster={isMaster}
      />
    </div>
  );
}
