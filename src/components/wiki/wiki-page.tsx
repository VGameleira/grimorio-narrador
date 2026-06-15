"use client";
import { useMemo } from "react";
import Link from "next/link";
type WikiPageProps = { content: string; campaignId: string };
export function WikiPage({ content, campaignId }: WikiPageProps) {
  const rendered = useMemo(() => {
    const linkRegex = /\[\[([^\]]+)\]\]/g;
    return content.replace(
      linkRegex,
      (_, slug: string) =>
        `<a href="/campaigns/${campaignId}/wiki/${encodeURIComponent(slug)}" class="text-primary underline decoration-primary/30 hover:decoration-primary">${slug}</a>`
    );
  }, [content, campaignId]);
  return (
    <div className="prose prose-sm dark:prose-invert max-w-none">
      {" "}
      <div dangerouslySetInnerHTML={{ __html: rendered }} />{" "}
    </div>
  );
}
