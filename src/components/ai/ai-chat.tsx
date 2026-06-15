"use client";
import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Send, Bot, User, Loader2 } from "lucide-react";
import type { AIMessage } from "@/types/ai";
type AIChatProps = { campaignId: string };
export function AIChat({ campaignId }: AIChatProps) {
  const [messages, setMessages] = useState<AIMessage[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);
  async function handleSend() {
    if (!input.trim() || loading) return;
    const userMessage: AIMessage = { role: "user", content: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setLoading(true);
    try {
      const res = await fetch("/api/ai/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          campaignId,
          messages: messages.map((m) => ({ role: m.role, content: m.content })),
          message: input,
        }),
      });
      if (!res.ok) throw new Error("Erro no chat");
      const reader = res.body?.getReader();
      if (!reader) throw new Error("No reader");
      const assistantMessage: AIMessage = { role: "assistant", content: "" };
      setMessages((prev) => [...prev, assistantMessage]);
      const decoder = new TextDecoder();
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        const text = decoder.decode(value, { stream: true });
        setMessages((prev) => {
          const updated = [...prev];
          const last = updated[updated.length - 1];
          if (last.role === "assistant") {
            updated[updated.length - 1] = {
              ...last,
              content: last.content + text,
            };
          }
          return updated;
        });
      }
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "Desculpe, ocorreu um erro ao processar sua mensagem.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  }
  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  }
  return (
    <Card className="flex flex-col h-[600px]">
      {" "}
      <CardHeader>
        {" "}
        <CardTitle className="flex items-center gap-2">
          {" "}
          <Bot className="h-5 w-5 text-primary" /> Chat com IA{" "}
        </CardTitle>{" "}
      </CardHeader>{" "}
      <CardContent className="flex-1 flex flex-col p-0">
        {" "}
        <ScrollArea ref={scrollRef} className="flex-1 px-4 py-2">
          {" "}
          <div className="space-y-4">
            {" "}
            {messages.length === 0 && (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                {" "}
                <Bot className="h-12 w-12 text-muted-foreground mb-4" />{" "}
                <p className="text-sm text-muted-foreground">
                  {" "}
                  Pergunte sobre a campanha, peça sugestões de NPCs, missões, ou
                  qualquer ajuda para o seu RPG!{" "}
                </p>{" "}
              </div>
            )}{" "}
            {messages.map((msg, i) => (
              <div
                key={i}
                className={`flex gap-3 ${msg.role === "user" ? "justify-end" : "justify-start"}`}
              >
                {" "}
                {msg.role === "assistant" && (
                  <Avatar className="h-8 w-8">
                    {" "}
                    <AvatarFallback className="bg-primary/10 text-primary">
                      {" "}
                      <Bot className="h-4 w-4" />{" "}
                    </AvatarFallback>{" "}
                  </Avatar>
                )}{" "}
                <div
                  className={`rounded-lg px-3 py-2 max-w-[80%] text-sm ${msg.role === "user" ? "bg-primary text-primary-foreground" : "bg-muted"}`}
                >
                  {" "}
                  <p className="whitespace-pre-wrap">{msg.content}</p>{" "}
                </div>{" "}
                {msg.role === "user" && (
                  <Avatar className="h-8 w-8">
                    {" "}
                    <AvatarFallback className="bg-muted">
                      {" "}
                      <User className="h-4 w-4" />{" "}
                    </AvatarFallback>{" "}
                  </Avatar>
                )}{" "}
              </div>
            ))}{" "}
            {loading && (
              <div className="flex gap-3">
                {" "}
                <Avatar className="h-8 w-8">
                  {" "}
                  <AvatarFallback className="bg-primary/10 text-primary">
                    {" "}
                    <Bot className="h-4 w-4" />{" "}
                  </AvatarFallback>{" "}
                </Avatar>{" "}
                <div className="rounded-lg bg-muted px-3 py-2">
                  {" "}
                  <Loader2 className="h-4 w-4 animate-spin" />{" "}
                </div>{" "}
              </div>
            )}{" "}
          </div>{" "}
        </ScrollArea>{" "}
        <div className="border-t border-border p-4">
          {" "}
          <div className="flex gap-2">
            {" "}
            <Textarea
              placeholder="Digite sua mensagem..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              className="min-h-[44px] max-h-[120px]"
              rows={1}
            />{" "}
            <Button
              size="icon"
              onClick={handleSend}
              disabled={!input.trim() || loading}
              className="shrink-0"
            >
              {" "}
              <Send className="h-4 w-4" />{" "}
            </Button>{" "}
          </div>{" "}
        </div>{" "}
      </CardContent>{" "}
    </Card>
  );
}
