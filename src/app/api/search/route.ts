import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
type SearchResult = {
  id: string;
  title: string;
  type: string;
  href: string;
  subtitle?: string;
};
export async function GET(req: NextRequest) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const q = req.nextUrl.searchParams.get("q") ?? "";
  const campaignId = req.nextUrl.searchParams.get("campaignId");
  if (!q.trim()) {
    return NextResponse.json({ results: [] });
  }
  const results: SearchResult[] = [];
  const campaignsFilter = campaignId
    ? { campaignId }
    : { campaign: { members: { some: { userId: session.user.id } } } };
  const [npcs, missions, sessions, factions, locations] = await Promise.all([
    prisma.npc.findMany({
      where: { ...campaignsFilter, name: { contains: q, mode: "insensitive" } },
      select: { id: true, name: true, campaignId: true },
    }),
    prisma.mission.findMany({
      where: {
        ...campaignsFilter,
        title: { contains: q, mode: "insensitive" },
      },
      select: { id: true, title: true, campaignId: true, status: true },
    }),
    prisma.gameSession.findMany({
      where: {
        ...campaignsFilter,
        summary: { contains: q, mode: "insensitive" },
      },
      select: { id: true, number: true, campaignId: true },
    }),
    prisma.faction.findMany({
      where: { ...campaignsFilter, name: { contains: q, mode: "insensitive" } },
      select: { id: true, name: true, campaignId: true },
    }),
    prisma.location.findMany({
      where: { ...campaignsFilter, name: { contains: q, mode: "insensitive" } },
      select: { id: true, name: true, campaignId: true },
    }),
  ]);
  const cid = campaignId ?? "{campaignId}";
  npcs.forEach((n) =>
    results.push({
      id: n.id,
      title: n.name,
      type: "NPCs",
      href: `/campaigns/${n.campaignId}/npcs/${n.id}`,
    })
  );
  missions.forEach((m) =>
    results.push({
      id: m.id,
      title: m.title,
      type: "Missões",
      href: `/campaigns/${m.campaignId}/missions/${m.id}`,
      subtitle: m.status,
    })
  );
  sessions.forEach((s) =>
    results.push({
      id: s.id,
      title: `Sessão #${s.number}`,
      type: "Sessões",
      href: `/campaigns/${s.campaignId}/sessions/${s.id}`,
    })
  );
  factions.forEach((f) =>
    results.push({
      id: f.id,
      title: f.name,
      type: "Facções",
      href: `/campaigns/${f.campaignId}/factions/${f.id}`,
    })
  );
  locations.forEach((l) =>
    results.push({
      id: l.id,
      title: l.name,
      type: "Locais",
      href: `/campaigns/${l.campaignId}/locations/${l.id}`,
    })
  );
  return NextResponse.json({ results });
}
