"use client";

import * as React from "react";
import {
  BrainCircuit,
  Check,
  ChevronDown,
  CircleStop,
  Menu,
  Moon,
  PanelRightOpen,
  Sparkles,
  Sun,
  TerminalSquare,
} from "lucide-react";
import { useTheme } from "next-themes";
import { AppSidebar } from "@/components/shell/app-sidebar";
import { ConversationMinimap } from "@/components/shell/conversation-minimap";
import { RightContextPanel } from "@/components/shell/right-context-panel";
import { PromptComposer } from "@/components/composer/prompt-composer";
import { QuickActions } from "@/components/composer/quick-actions";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

type Message = {
  role: "user" | "assistant";
  content: string;
};

const initialMessages: Message[] = [
  {
    role: "assistant",
    content: "Prêt. Décris le dashboard IA que tu veux : je structure le shell, les panneaux, les actions, puis le câblage Next.js.",
  },
];

export function AiWorkspace() {
  const [sidebarCollapsed, setSidebarCollapsed] = React.useState(false);
  const [rightPanelOpen, setRightPanelOpen] = React.useState(true);
  const [isGenerating, setIsGenerating] = React.useState(false);
  const [messages, setMessages] = React.useState<Message[]>(initialMessages);
  const { theme, setTheme } = useTheme();

  function handleSubmit(value: string) {
    setMessages((current) => [...current, { role: "user", content: value }]);
    setIsGenerating(true);

    window.setTimeout(() => {
      setMessages((current) => [
        ...current,
        {
          role: "assistant",
          content:
            "Plan capté : je prépare une structure Next.js App Router avec composants shadcn-like, sidebar rétractable, composer premium, actions rapides, panneau contexte et base prête Vercel.",
        },
      ]);
      setIsGenerating(false);
    }, 900);
  }

  function handleQuickAction(label: string) {
    handleSubmit(`${label} pour un AI workspace premium, responsive, arrondi et prêt Vercel.`);
  }

  return (
    <main className="flex min-h-screen overflow-hidden bg-background text-foreground">
      <AppSidebar collapsed={sidebarCollapsed} onToggle={() => setSidebarCollapsed((value) => !value)} />

      <section className="relative flex h-screen min-w-0 flex-1 flex-col overflow-hidden">
        <header className="flex h-16 shrink-0 items-center justify-between px-4 md:px-6">
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" className="md:hidden" aria-label="Menu mobile">
              <Menu className="h-5 w-5" />
            </Button>
            <Badge variant="outline" className="hidden h-9 gap-2 rounded-full bg-card/70 px-3 md:inline-flex">
              <Sparkles className="h-3.5 w-3.5" />
              Nümtema AI Shell · Vercel Ready
            </Badge>
          </div>

          <div className="flex items-center gap-2">
            <button className="hidden h-9 items-center gap-2 rounded-full border bg-card/70 px-3 text-xs text-muted-foreground backdrop-blur transition hover:bg-muted md:inline-flex">
              Flash Build
              <ChevronDown className="h-3.5 w-3.5" />
            </button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              aria-label="Changer le thème"
            >
              <Sun className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
              <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
            </Button>
            <Button variant="ghost" size="icon" className="xl:hidden" onClick={() => setRightPanelOpen((value) => !value)}>
              <PanelRightOpen className="h-4 w-4" />
            </Button>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto px-4 pb-10 pt-10 md:px-8 md:pt-16 no-scrollbar">
          <div className="mx-auto flex max-w-5xl flex-col items-center text-center">
            <h1 className="max-w-3xl text-balance text-3xl font-semibold tracking-tight md:text-5xl">
              Comment puis-je t’aider à construire, Nümtema ?
            </h1>
            <p className="mt-4 max-w-2xl text-balance text-sm leading-6 text-muted-foreground md:text-base">
              Un shell IA moderne : même calme visuel que les meilleurs assistants, mais pensé pour créer des apps, piloter des agents et livrer des projets.
            </p>

            <div className="mt-10 w-full max-w-3xl space-y-3 text-left">
              {messages.map((message, index) => (
                <div key={`${message.role}-${index}`} id={`msg-${index}`} className="scroll-mt-20">
                  <MessageBubble message={message} />
                </div>
              ))}
              {isGenerating && <GeneratingCard />}
            </div>

            <PromptComposer className="mt-8" onSubmit={handleSubmit} isGenerating={isGenerating} />
            <QuickActions className="mt-5" onPick={handleQuickAction} />
          </div>
        </div>

        <ConversationMinimap messages={messages} />
      </section>

      <RightContextPanel open={rightPanelOpen} onToggle={() => setRightPanelOpen((value) => !value)} />
    </main>
  );
}

function MessageBubble({ message }: { message: Message }) {
  const isUser = message.role === "user";

  return (
    <div className={cn("flex", isUser ? "justify-end" : "justify-start")}>
      <div
        className={cn(
          "max-w-[85%] rounded-[28px] border px-5 py-4 text-sm leading-6 soft-shadow",
          isUser ? "bg-foreground text-background" : "bg-card/80 text-foreground backdrop-blur",
        )}
      >
        {message.content}
      </div>
    </div>
  );
}

function GeneratingCard() {
  return (
    <Card className="rounded-[28px] border bg-card/80 p-5 shadow-none backdrop-blur">
      <div className="flex items-start gap-3">
        <div className="mt-0.5 flex h-8 w-8 items-center justify-center rounded-full bg-muted">
          <TerminalSquare className="h-4 w-4" />
        </div>
        <div className="flex-1">
          <div className="flex items-center justify-between gap-3">
            <p className="text-sm font-medium">Génération du workspace...</p>
            <CircleStop className="h-4 w-4 text-muted-foreground" />
          </div>
          <p className="mt-1 text-sm text-muted-foreground">Analyse du brief, structure des composants, préparation du shell.</p>
          <div className="mt-4 grid gap-2 text-xs text-muted-foreground md:grid-cols-3">
            {[
              "App Router",
              "shadcn-like UI",
              "Vercel Ready",
            ].map((item) => (
              <div key={item} className="flex items-center gap-2 rounded-full bg-muted px-3 py-2">
                <Check className="h-3.5 w-3.5 text-emerald-500" />
                {item}
              </div>
            ))}
          </div>
        </div>
      </div>
    </Card>
  );
}
