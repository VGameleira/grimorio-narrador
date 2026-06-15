"use client";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AIGenerationForm } from "./ai-generation-form";
import { AIChat } from "./ai-chat";
import { Sparkles, MessageSquare } from "lucide-react";
type AIAssistantPanelProps = { campaignId?: string };
export function AIAssistantPanel({ campaignId }: AIAssistantPanelProps) {
  return (
    <Tabs defaultValue="generate" className="w-full">
      {" "}
      <TabsList className="grid w-full grid-cols-2">
        {" "}
        <TabsTrigger value="generate">
          {" "}
          <Sparkles className="mr-2 h-4 w-4" /> Gerar{" "}
        </TabsTrigger>{" "}
        <TabsTrigger value="chat">
          {" "}
          <MessageSquare className="mr-2 h-4 w-4" /> Chat{" "}
        </TabsTrigger>{" "}
      </TabsList>{" "}
      <TabsContent value="generate" className="mt-4">
        {" "}
        <AIGenerationForm campaignId={campaignId ?? ""} />{" "}
      </TabsContent>{" "}
      <TabsContent value="chat" className="mt-4">
        {" "}
        <AIChat campaignId={campaignId ?? ""} />{" "}
      </TabsContent>{" "}
    </Tabs>
  );
}
