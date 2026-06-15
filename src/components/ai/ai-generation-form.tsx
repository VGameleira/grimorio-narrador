"use client";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Sparkles, Loader2 } from "lucide-react";
import { AIResultPreview } from "./ai-result-preview";
import type { AIGenerationType, AIGenerationResult } from "@/types/ai";
import { toast } from "sonner";
const generationSchema = z.object({
  type: z.string().min(1, "Selecione o tipo"),
  tone: z.string().optional(),
  grade: z.string().optional(),
  theme: z.string().optional(),
  description: z.string().optional(),
});
type GenerationFormValues = z.infer<typeof generationSchema>;
type AIGenerationFormProps = { campaignId: string };
export function AIGenerationForm({ campaignId }: AIGenerationFormProps) {
  const [result, setResult] = useState<AIGenerationResult | null>(null);
  const [loading, setLoading] = useState(false);
  const form = useForm<GenerationFormValues>({
    resolver: zodResolver(generationSchema),
    defaultValues: {
      type: "",
      tone: "",
      grade: "",
      theme: "",
      description: "",
    },
  });
  async function onSubmit(values: GenerationFormValues) {
    setLoading(true);
    setResult(null);
    try {
      const res = await fetch("/api/ai/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...values, campaignId }),
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error ?? "Erro ao gerar conteúdo");
      }
      const data = await res.json();
      setResult(data);
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Falha ao gerar conteúdo"
      );
    } finally {
      setLoading(false);
    }
  }
  if (result) {
    return (
      <AIResultPreview
        result={result}
        onBack={() => setResult(null)}
        campaignId={campaignId}
      />
    );
  }
  return (
    <Card>
      {" "}
      <CardHeader>
        {" "}
        <CardTitle className="flex items-center gap-2">
          {" "}
          <Sparkles className="h-5 w-5 text-primary" /> Gerar Conteúdo com
          IA{" "}
        </CardTitle>{" "}
      </CardHeader>{" "}
      <CardContent>
        {" "}
        <Form {...form}>
          {" "}
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            {" "}
            <FormField
              control={form.control}
              name="type"
              render={({ field }) => (
                <FormItem>
                  {" "}
                  <FormLabel>Tipo</FormLabel>{" "}
                  <Select onValueChange={field.onChange} value={field.value}>
                    {" "}
                    <FormControl>
                      {" "}
                      <SelectTrigger>
                        {" "}
                        <SelectValue placeholder="Selecione o tipo de conteúdo" />{" "}
                      </SelectTrigger>{" "}
                    </FormControl>{" "}
                    <SelectContent>
                      {" "}
                      <SelectItem value="npc">NPC</SelectItem>{" "}
                      <SelectItem value="mission">Missão</SelectItem>{" "}
                      <SelectItem value="curse">Maldição</SelectItem>{" "}
                      <SelectItem value="technique">Técnica</SelectItem>{" "}
                      <SelectItem value="arc">Arco Narrativo</SelectItem>{" "}
                      <SelectItem value="session">Sessão</SelectItem>{" "}
                    </SelectContent>{" "}
                  </Select>{" "}
                  <FormMessage />{" "}
                </FormItem>
              )}
            />{" "}
            <div className="grid gap-4 sm:grid-cols-2">
              {" "}
              <FormField
                control={form.control}
                name="tone"
                render={({ field }) => (
                  <FormItem>
                    {" "}
                    <FormLabel>Tom</FormLabel>{" "}
                    <Select
                      onValueChange={field.onChange}
                      value={field.value ?? ""}
                    >
                      {" "}
                      <FormControl>
                        {" "}
                        <SelectTrigger>
                          {" "}
                          <SelectValue placeholder="Tom (opcional)" />{" "}
                        </SelectTrigger>{" "}
                      </FormControl>{" "}
                      <SelectContent>
                        {" "}
                        <SelectItem value="sombrio">Sombrio</SelectItem>{" "}
                        <SelectItem value="epico">Épico</SelectItem>{" "}
                        <SelectItem value="humoristico">Humorístico</SelectItem>{" "}
                        <SelectItem value="misterioso">Misterioso</SelectItem>{" "}
                        <SelectItem value="romantico">Romântico</SelectItem>{" "}
                        <SelectItem value="tragico">Trágico</SelectItem>{" "}
                      </SelectContent>{" "}
                    </Select>{" "}
                    <FormMessage />{" "}
                  </FormItem>
                )}
              />{" "}
              <FormField
                control={form.control}
                name="grade"
                render={({ field }) => (
                  <FormItem>
                    {" "}
                    <FormLabel>Grade</FormLabel>{" "}
                    <Select
                      onValueChange={field.onChange}
                      value={field.value ?? ""}
                    >
                      {" "}
                      <FormControl>
                        {" "}
                        <SelectTrigger>
                          {" "}
                          <SelectValue placeholder="Grade (opcional)" />{" "}
                        </SelectTrigger>{" "}
                      </FormControl>{" "}
                      <SelectContent>
                        {" "}
                        <SelectItem value="E">E</SelectItem>{" "}
                        <SelectItem value="D">D</SelectItem>{" "}
                        <SelectItem value="C">C</SelectItem>{" "}
                        <SelectItem value="B">B</SelectItem>{" "}
                        <SelectItem value="A">A</SelectItem>{" "}
                        <SelectItem value="S">S</SelectItem>{" "}
                      </SelectContent>{" "}
                    </Select>{" "}
                    <FormMessage />{" "}
                  </FormItem>
                )}
              />{" "}
            </div>{" "}
            <FormField
              control={form.control}
              name="theme"
              render={({ field }) => (
                <FormItem>
                  {" "}
                  <FormLabel>Tema</FormLabel>{" "}
                  <FormControl>
                    {" "}
                    <Input
                      placeholder="Ex: vingança, exploração, política..."
                      {...field}
                    />{" "}
                  </FormControl>{" "}
                  <FormMessage />{" "}
                </FormItem>
              )}
            />{" "}
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  {" "}
                  <FormLabel>Descrição</FormLabel>{" "}
                  <FormControl>
                    {" "}
                    <Textarea
                      placeholder="Descreva ideias adicionais para o conteúdo..."
                      className="min-h-[100px]"
                      {...field}
                    />{" "}
                  </FormControl>{" "}
                  <FormMessage />{" "}
                </FormItem>
              )}
            />{" "}
            <Button type="submit" disabled={loading} className="w-full">
              {" "}
              {loading ? (
                <>
                  {" "}
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />{" "}
                  Gerando...{" "}
                </>
              ) : (
                <>
                  {" "}
                  <Sparkles className="mr-2 h-4 w-4" /> Gerar com IA{" "}
                </>
              )}{" "}
            </Button>{" "}
          </form>{" "}
        </Form>{" "}
      </CardContent>{" "}
    </Card>
  );
}
