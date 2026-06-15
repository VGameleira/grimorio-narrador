"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Sparkles, Save, ArrowLeft, Check } from "lucide-react";
import type { AIGenerationResult } from "@/types/ai";
import { toast } from "sonner";
type AIResultPreviewProps = {
  result: AIGenerationResult;
  onBack: () => void;
  campaignId: string;
  onSaved?: () => void;
};
export function AIResultPreview({
  result,
  onBack,
  campaignId,
  onSaved,
}: AIResultPreviewProps) {
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  async function handleSave() {
    if (saved) return;
    setSaving(true);
    try {
      const res = await fetch(`/api/ai/save`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          campaignId,
          title: result.title,
          content: result.content,
        }),
      });
      if (!res.ok) throw new Error("Erro ao salvar");
      setSaved(true);
      toast.success("Conteúdo salvo com sucesso.");
      onSaved?.();
    } catch {
      toast.error("Falha ao salvar o conteúdo.");
    } finally {
      setSaving(false);
    }
  }
  return (
    <Card>
      {" "}
      <CardHeader>
        {" "}
        <CardTitle className="flex items-center gap-2">
          {" "}
          <Sparkles className="h-5 w-5 text-primary" /> {result.title}{" "}
          <Badge variant="secondary" className="ml-2">
            {" "}
            Gerado por IA{" "}
          </Badge>{" "}
        </CardTitle>{" "}
      </CardHeader>{" "}
      <CardContent className="space-y-4">
        {" "}
        <div
          className="prose prose-sm dark:prose-invert max-w-none rounded-lg border border-border bg-muted/30 p-4"
          dangerouslySetInnerHTML={{ __html: result.content }}
        />{" "}
        <div className="flex items-center gap-2">
          {" "}
          <Button variant="outline" onClick={onBack}>
            {" "}
            <ArrowLeft className="mr-2 h-4 w-4" /> Descartar{" "}
          </Button>{" "}
          <Button onClick={handleSave} disabled={saving || saved}>
            {" "}
            {saved ? (
              <>
                {" "}
                <Check className="mr-2 h-4 w-4" /> Salvo{" "}
              </>
            ) : saving ? (
              "Salvando..."
            ) : (
              <>
                {" "}
                <Save className="mr-2 h-4 w-4" /> Salvar{" "}
              </>
            )}{" "}
          </Button>{" "}
        </div>{" "}
      </CardContent>{" "}
    </Card>
  );
}
