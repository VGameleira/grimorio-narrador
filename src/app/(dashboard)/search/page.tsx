"use client";
import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { PageHeader } from "@/components/shared/page-header";
import { EmptyState } from "@/components/shared/empty-state";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Search, ArrowRight } from "lucide-react";
import { useRouter } from "next/navigation";
type SearchResult = {
  id: string;
  title: string;
  type: string;
  href: string;
  subtitle?: string;
};
type GroupedResults = Record<string, SearchResult[]>;
export default function SearchPage() {
  return (
    <Suspense fallback={<div className="h-96 animate-pulse rounded-lg bg-muted" />}>
      <SearchContent />
    </Suspense>
  );
}
function SearchContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const q = searchParams.get("q") ?? "";
  const [query, setQuery] = useState(q);
  const [results, setResults] = useState<GroupedResults>({});
  const [loading, setLoading] = useState(false);
  const handleSearch = useCallback(async (searchQuery: string) => {
    if (!searchQuery.trim()) {
      setResults({});
      return;
    }
    setLoading(true);
    try {
      const res = await fetch(
        `/api/search?q=${encodeURIComponent(searchQuery)}`
      );
      const data = await res.json();
      const grouped: GroupedResults = {};
      for (const r of data.results ?? []) {
        (grouped[r.type] ??= []).push(r);
      }
      setResults(grouped);
    } catch {
      setResults({});
    } finally {
      setLoading(false);
    }
  }, []);
  useEffect(() => {
    if (q) handleSearch(q);
  }, [q, handleSearch]);
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    router.push(`/search?q=${encodeURIComponent(query)}`);
  };
  return (
    <div>
      {" "}
      <PageHeader
        title="Busca Global"
        description="Encontre qualquer item em suas campanhas"
      />{" "}
      <form onSubmit={handleSubmit} className="mb-8">
        {" "}
        <div className="relative">
          {" "}
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />{" "}
          <Input
            placeholder="Buscar NPCs, missões, facções, locais, sessões..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="pl-9 h-12 text-base"
          />{" "}
        </div>{" "}
      </form>{" "}
      {loading ? (
        <div className="space-y-4">
          {" "}
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="h-24 animate-pulse rounded-lg bg-muted" />
          ))}{" "}
        </div>
      ) : Object.keys(results).length === 0 && q ? (
        <EmptyState
          icon={Search}
          title="Nenhum resultado encontrado"
          description={`Nada encontrado para "${q}"`}
        />
      ) : (
        <div className="space-y-8">
          {" "}
          {Object.entries(results).map(([type, items]) => (
            <div key={type}>
              {" "}
              <h2 className="mb-3 text-lg font-semibold">{type}</h2>{" "}
              <div className="space-y-2">
                {" "}
                {items.map((item) => (
                  <Link key={item.id} href={item.href}>
                    {" "}
                    <Card className="transition-colors hover:bg-muted/50">
                      {" "}
                      <CardContent className="flex items-center justify-between p-4">
                        {" "}
                        <div className="flex items-center gap-3">
                          {" "}
                          <span className="font-medium">{item.title}</span>{" "}
                          {item.subtitle && (
                            <Badge variant="secondary">{item.subtitle}</Badge>
                          )}{" "}
                        </div>{" "}
                        <ArrowRight className="h-4 w-4 text-muted-foreground" />{" "}
                      </CardContent>{" "}
                    </Card>{" "}
                  </Link>
                ))}{" "}
              </div>{" "}
            </div>
          ))}{" "}
        </div>
      )}{" "}
    </div>
  );
}
