"use client";
import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Search } from "lucide-react";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Button } from "@/components/ui/button";
import { useHotkeys } from "@/hooks/use-hotkeys";
type SearchResult = {
  id: string;
  title: string;
  type: string;
  href: string;
  subtitle?: string;
};
export function GlobalSearch() {
  const [open, setOpen] = useState(false);
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  useHotkeys("k", () => setOpen(true));
  const handleSearch = useCallback(async (query: string) => {
    if (!query.trim()) {
      setResults([]);
      return;
    }
    setLoading(true);
    try {
      const res = await fetch(`/api/search?q=${encodeURIComponent(query)}`);
      const data = await res.json();
      setResults(data.results ?? []);
    } catch {
      setResults([]);
    } finally {
      setLoading(false);
    }
  }, []);
  return (
    <>
      {" "}
      <Button
        variant="outline"
        className="relative w-full justify-start text-sm text-muted-foreground"
        onClick={() => setOpen(true)}
      >
        {" "}
        <Search className="mr-2 h-4 w-4" />{" "}
        <span>Buscar NPCs, missões, sessões...</span>{" "}
        <kbd className="pointer-events-none absolute right-2 top-1/2 hidden -translate-y-1/2 items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium opacity-100 sm:flex">
          {" "}
          <span className="text-xs">⌘</span>K{" "}
        </kbd>{" "}
      </Button>{" "}
      <CommandDialog open={open} onOpenChange={setOpen}>
        {" "}
        <CommandInput
          placeholder="Buscar em toda campanha..."
          onValueChange={handleSearch}
        />{" "}
        <CommandList>
          {" "}
          <CommandEmpty>
            {" "}
            {loading ? "Buscando..." : "Nenhum resultado encontrado."}{" "}
          </CommandEmpty>{" "}
          {Object.entries(
            results.reduce(
              (acc, r) => {
                (acc[r.type] ??= []).push(r);
                return acc;
              },
              {} as Record<string, SearchResult[]>
            )
          ).map(([type, items]) => (
            <CommandGroup key={type} heading={type}>
              {" "}
              {items.map((item) => (
                <CommandItem
                  key={item.id}
                  onSelect={() => {
                    setOpen(false);
                    router.push(item.href);
                  }}
                >
                  {" "}
                  <span>{item.title}</span>{" "}
                  {item.subtitle && (
                    <span className="ml-2 text-xs text-muted-foreground">
                      {" "}
                      {item.subtitle}{" "}
                    </span>
                  )}{" "}
                </CommandItem>
              ))}{" "}
            </CommandGroup>
          ))}{" "}
        </CommandList>{" "}
      </CommandDialog>{" "}
    </>
  );
}
