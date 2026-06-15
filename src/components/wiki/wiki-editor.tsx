"use client";
import { RichEditor } from "@/components/shared/rich-editor";
type WikiEditorProps = { content: string; onChange: (html: string) => void };
export function WikiEditor({ content, onChange }: WikiEditorProps) {
  return (
    <RichEditor
      content={content}
      onChange={onChange}
      placeholder="Escreva o conteúdo da wiki... Use [[link]] para criar links internos."
    />
  );
}
