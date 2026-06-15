"use client";
import { useEffect } from "react";
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
import { Switch } from "@/components/ui/switch";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Loader2, Save } from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
const noteFormSchema = z.object({
  title: z.string().optional(),
  content: z.string().optional(),
  pinned: z.boolean().optional(),
});
type NoteFormValues = z.infer<typeof noteFormSchema>;
type NoteFormProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  note?: {
    id: string;
    title: string | null;
    content: string | null;
    pinned: boolean;
  } | null;
};
export function NoteForm({ open, onOpenChange, note }: NoteFormProps) {
  const router = useRouter();
  const form = useForm<NoteFormValues>({
    resolver: zodResolver(noteFormSchema),
    defaultValues: {
      title: note?.title ?? "",
      content: note?.content ?? "",
      pinned: note?.pinned ?? false,
    },
  });
  useEffect(() => {
    if (note) {
      form.reset({
        title: note.title ?? "",
        content: note.content ?? "",
        pinned: note.pinned,
      });
    } else {
      form.reset({ title: "", content: "", pinned: false });
    }
  }, [note, form]);
  async function onSubmit(values: NoteFormValues) {
    try {
      const url = note ? `/api/notes/${note.id}` : "/api/notes";
      const method = note ? "PUT" : "POST";
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });
      if (!res.ok) throw new Error("Erro ao salvar nota");
      toast.success(note ? "Nota atualizada" : "Nota criada");
      onOpenChange(false);
      router.refresh();
    } catch {
      toast.error("Erro ao salvar nota");
    }
  }
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      {" "}
      <DialogContent>
        {" "}
        <DialogHeader>
          {" "}
          <DialogTitle>{note ? "Editar Nota" : "Nova Nota"}</DialogTitle>{" "}
        </DialogHeader>{" "}
        <Form {...form}>
          {" "}
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            {" "}
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  {" "}
                  <FormLabel>Título</FormLabel>{" "}
                  <FormControl>
                    {" "}
                    <Input placeholder="Título da nota" {...field} />{" "}
                  </FormControl>{" "}
                  <FormMessage />{" "}
                </FormItem>
              )}
            />{" "}
            <FormField
              control={form.control}
              name="content"
              render={({ field }) => (
                <FormItem>
                  {" "}
                  <FormLabel>Conteúdo</FormLabel>{" "}
                  <FormControl>
                    {" "}
                    <Textarea
                      placeholder="Escreva sua nota..."
                      className="min-h-[120px]"
                      {...field}
                    />{" "}
                  </FormControl>{" "}
                  <FormMessage />{" "}
                </FormItem>
              )}
            />{" "}
            <FormField
              control={form.control}
              name="pinned"
              render={({ field }) => (
                <FormItem className="flex items-center justify-between rounded-lg border border-border p-3">
                  {" "}
                  <div>
                    {" "}
                    <FormLabel>Fixar nota</FormLabel>{" "}
                  </div>{" "}
                  <FormControl>
                    {" "}
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />{" "}
                  </FormControl>{" "}
                </FormItem>
              )}
            />{" "}
            <Button type="submit" className="w-full">
              {" "}
              <Save className="mr-2 h-4 w-4" /> Salvar{" "}
            </Button>{" "}
          </form>{" "}
        </Form>{" "}
      </DialogContent>{" "}
    </Dialog>
  );
}
