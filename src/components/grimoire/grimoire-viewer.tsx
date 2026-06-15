"use client";
import { useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { curseDatabase, curseTypes, curseGrades } from "./curse-database";
import { Search, Skull, BookOpen, RefreshCw, ChevronDown, ChevronUp } from "lucide-react";

export function GrimoireViewer() {
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("todas");
  const [gradeFilter, setGradeFilter] = useState("todas");
  const [selectedCurse, setSelectedCurse] = useState<string | null>(null);
  const [randomCurse, setRandomCurse] = useState<typeof curseDatabase[0] | null>(null);

  const filtered = curseDatabase.filter((c) => {
    if (typeFilter !== "todas" && c.type !== typeFilter) return false;
    if (gradeFilter !== "todas" && c.grade !== gradeFilter) return false;
    if (search) {
      const s = search.toLowerCase();
      return (
        c.name.toLowerCase().includes(s) ||
        c.effect.toLowerCase().includes(s) ||
        c.type.toLowerCase().includes(s) ||
        c.origin.toLowerCase().includes(s)
      );
    }
    return true;
  });

  const generateRandom = useCallback(() => {
    const c = curseDatabase[Math.floor(Math.random() * curseDatabase.length)];
    setRandomCurse(c);
  }, []);

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Skull className="h-5 w-5 text-destructive" />
            Grimório das Maldições
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2">
            <Input
              placeholder="Buscar maldição..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="flex-1"
            />
            <Button onClick={generateRandom} variant="secondary">
              <RefreshCw className="mr-2 h-4 w-4" />
              Aleatório
            </Button>
          </div>
          <div className="flex gap-2">
            <Select value={typeFilter} onValueChange={(v) => v && setTypeFilter(v)}>
              <SelectTrigger>
                <SelectValue placeholder="Tipo" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="todas">Todas</SelectItem>
                {curseTypes.map((t) => (
                  <SelectItem key={t} value={t}>{t}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={gradeFilter} onValueChange={(v) => v && setGradeFilter(v)}>
              <SelectTrigger>
                <SelectValue placeholder="Grade" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="todas">Todas</SelectItem>
                {curseGrades.map((g) => (
                  <SelectItem key={g} value={g}>{g}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {randomCurse && (
        <CurseDetailCard
          curse={randomCurse}
          onClose={() => setRandomCurse(null)}
        />
      )}

      <div className="grid gap-3">
        {filtered.length === 0 ? (
          <p className="text-center text-muted-foreground py-8">
            Nenhuma maldição encontrada
          </p>
        ) : (
          filtered.map((curse) => (
            <Card
              key={curse.name}
              className="cursor-pointer transition-colors hover:border-primary/30"
              onClick={() =>
                setSelectedCurse(selectedCurse === curse.name ? null : curse.name)
              }
            >
              <CardHeader className="py-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold">{curse.name}</h3>
                    <Badge variant="destructive">{curse.type}</Badge>
                    <Badge variant="secondary">{curse.grade}</Badge>
                  </div>
                  {selectedCurse === curse.name ? (
                    <ChevronUp className="h-4 w-4 text-muted-foreground" />
                  ) : (
                    <ChevronDown className="h-4 w-4 text-muted-foreground" />
                  )}
                </div>
              </CardHeader>
              {selectedCurse === curse.name && (
                <CardContent className="space-y-3 text-sm border-t border-border pt-4">
                  <div>
                    <span className="font-medium text-muted-foreground">Origem: </span>
                    <span>{curse.origin}</span>
                  </div>
                  <div>
                    <span className="font-medium text-muted-foreground">Efeito: </span>
                    <span>{curse.effect}</span>
                  </div>
                  <div>
                    <span className="font-medium text-muted-foreground">Ativação: </span>
                    <span>{curse.trigger}</span>
                  </div>
                  <div>
                    <span className="font-medium text-muted-foreground">Reversão: </span>
                    <span>{curse.breakCondition}</span>
                  </div>
                  <div>
                    <span className="font-medium text-muted-foreground">Efeitos Secundários: </span>
                    <span>{curse.sideEffects}</span>
                  </div>
                </CardContent>
              )}
            </Card>
          ))
        )}
      </div>
    </div>
  );
}

function CurseDetailCard({
  curse,
  onClose,
}: {
  curse: (typeof curseDatabase)[0];
  onClose: () => void;
}) {
  return (
    <Card className="border-2 border-destructive/20 bg-destructive/5">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="flex items-center gap-2 text-lg">
          <Skull className="h-5 w-5 text-destructive" />
          {curse.name}
        </CardTitle>
        <Button variant="ghost" size="sm" onClick={onClose}>
          <BookOpen className="h-4 w-4" />
        </Button>
      </CardHeader>
      <CardContent className="space-y-3 text-sm">
        <div className="flex gap-2">
          <Badge variant="destructive">{curse.type}</Badge>
          <Badge variant="secondary">{curse.grade}</Badge>
        </div>
        <div>
          <span className="font-medium text-muted-foreground">Origem: </span>
          <span>{curse.origin}</span>
        </div>
        <div>
          <span className="font-medium text-muted-foreground">Efeito: </span>
          <span>{curse.effect}</span>
        </div>
        <div>
          <span className="font-medium text-muted-foreground">Ativação: </span>
          <span>{curse.trigger}</span>
        </div>
        <div>
          <span className="font-medium text-muted-foreground">Reversão: </span>
          <span>{curse.breakCondition}</span>
        </div>
        <div>
          <span className="font-medium text-muted-foreground">Efeitos Secundários: </span>
          <span>{curse.sideEffects}</span>
        </div>
      </CardContent>
    </Card>
  );
}