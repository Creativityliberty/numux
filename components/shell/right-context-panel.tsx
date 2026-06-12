"use client";

import * as React from "react";
import {
  BookOpen,
  Check,
  CheckCircle2,
  Circle,
  Clock3,
  Copy,
  File,
  PanelRightClose,
  PanelRightOpen,
  Rocket,
  SlidersHorizontal,
  Terminal,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";

type CommandStep = {
  command: string;
  language: string;
  output: string;
};

type ReflectionStep = {
  title: string;
  status: "pending" | "success" | "info" | "error";
  description?: string;
  codeBlock?: CommandStep;
};

type MessageReflection = {
  duration: string;
  steps: ReflectionStep[];
};

type Message = {
  role: "user" | "assistant";
  content: string;
  reflection?: MessageReflection;
};

const tasks = [
  { label: "AI App Shell", done: true },
  { label: "Sidebar rétractable", done: true },
  { label: "Composer central", done: true },
  { label: "Panneau contexte", done: true },
  { label: "Streaming réel", done: false },
  { label: "Upload backend", done: false },
];

const files = ["app/page.tsx", "components/shell/ai-workspace.tsx", "components/composer/prompt-composer.tsx"];

interface RightContextPanelProps {
  open: boolean;
  onToggle: () => void;
  activeTab: "project" | "activity";
  onTabChange: (tab: "project" | "activity") => void;
  selectedMessage: Message | null;
  messageIndex: number | null;
}

export function RightContextPanel({
  open,
  onToggle,
  activeTab,
  onTabChange,
  selectedMessage,
  messageIndex,
}: RightContextPanelProps) {
  return (
    <aside
      className={cn(
        "hidden h-screen shrink-0 border-l bg-card/60 backdrop-blur-xl transition-all duration-300 xl:flex xl:flex-col",
        open ? "w-[330px]" : "w-[72px]",
      )}
    >
      {/* Header */}
      <div className={cn("flex h-16 items-center px-4 shrink-0", open ? "justify-between" : "justify-center")}>
        {open && (
          <div>
            <p className="text-sm font-semibold">
              {activeTab === "project" ? "Contexte projet" : "Activité agent"}
            </p>
            <p className="text-xs text-muted-foreground">
              {activeTab === "project" ? "Mission OS Shell" : `Message #${(messageIndex ?? 0) + 1}`}
            </p>
          </div>
        )}
        <Button variant="ghost" size="iconSm" onClick={onToggle} aria-label="Basculer le panneau contexte">
          {open ? <PanelRightClose className="h-4 w-4" /> : <PanelRightOpen className="h-4 w-4" />}
        </Button>
      </div>

      {!open ? (
        <div className="flex flex-1 flex-col items-center gap-3 px-3 py-4 text-muted-foreground">
          {activeTab === "project" ? (
            <>
              <Rocket className="h-5 w-5 cursor-pointer hover:text-foreground transition-colors" onClick={() => { onToggle(); onTabChange("project"); }} />
              <SlidersHorizontal className="h-5 w-5 cursor-pointer hover:text-foreground transition-colors" onClick={() => { onToggle(); onTabChange("project"); }} />
              <Clock3 className="h-5 w-5 cursor-pointer hover:text-foreground transition-colors" onClick={() => { onToggle(); onTabChange("project"); }} />
            </>
          ) : (
            <>
              <Terminal className="h-5 w-5 text-emerald-500 cursor-pointer hover:text-foreground transition-colors" onClick={() => { onToggle(); onTabChange("activity"); }} />
              <Clock3 className="h-5 w-5 cursor-pointer hover:text-foreground transition-colors" onClick={() => { onToggle(); onTabChange("activity"); }} />
            </>
          )}
        </div>
      ) : (
        <div className="flex flex-1 flex-col overflow-hidden">
          {/* Tab Selector Headers */}
          <div className="flex border-b border-border/40 px-2 bg-card/20 shrink-0">
            <button
              onClick={() => onTabChange("project")}
              className={cn(
                "flex-1 py-3 text-[10px] font-bold tracking-[0.1em] uppercase border-b-2 text-center transition-all",
                activeTab === "project"
                  ? "border-primary text-foreground"
                  : "border-transparent text-muted-foreground hover:text-foreground"
              )}
            >
              Projet
            </button>
            <button
              onClick={() => onTabChange("activity")}
              className={cn(
                "flex-1 py-3 text-[10px] font-bold tracking-[0.1em] uppercase border-b-2 text-center transition-all",
                activeTab === "activity"
                  ? "border-primary text-foreground"
                  : "border-transparent text-muted-foreground hover:text-foreground"
              )}
            >
              Activité
            </button>
          </div>

          {/* Scrollable Contents */}
          <div className="flex-1 overflow-y-auto no-scrollbar">
            {activeTab === "project" ? (
              <div className="p-4 space-y-4 animate-in fade-in duration-200">
                <Card className="rounded-3xl border bg-background/70 shadow-none">
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between gap-3">
                      <CardTitle className="text-base">Projet actif</CardTitle>
                      <Badge variant="success">V0.1</Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3 text-sm text-muted-foreground">
                    <p>
                      Construire un template IA moderne : sidebar, prompt composer, quick actions, contexte projet et base Vercel.
                    </p>
                    <Separator />
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div className="rounded-2xl bg-muted p-3">
                        <p className="font-medium text-foreground">Stack</p>
                        <p>Next.js</p>
                      </div>
                      <div className="rounded-2xl bg-muted p-3">
                        <p className="font-medium text-foreground">UI</p>
                        <p>shadcn-like</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="rounded-3xl border bg-background/70 shadow-none">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base">Todo build</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {tasks.map((task) => (
                      <div key={task.label} className="flex items-center gap-3 text-sm">
                        {task.done ? <CheckCircle2 className="h-4 w-4 text-emerald-500" /> : <Circle className="h-4 w-4 text-muted-foreground" />}
                        <span className={cn(task.done ? "text-foreground" : "text-muted-foreground")}>{task.label}</span>
                      </div>
                    ))}
                  </CardContent>
                </Card>

                <Card className="rounded-3xl border bg-background/70 shadow-none">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base">Fichiers clés</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    {files.map((file) => (
                      <div key={file} className="flex items-center gap-2 rounded-2xl bg-muted px-3 py-2 text-xs text-muted-foreground">
                        <File className="h-3.5 w-3.5" />
                        <span>{file}</span>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </div>
            ) : (
              <div className="p-4 space-y-4 animate-in fade-in duration-200">
                {!selectedMessage || !selectedMessage.reflection ? (
                  <div className="flex flex-col items-center justify-center py-20 text-center px-4">
                    <BookOpen className="h-8 w-8 text-muted-foreground/30 mb-3" />
                    <p className="text-xs font-semibold text-muted-foreground">Aucune réflexion sélectionnée</p>
                    <p className="text-[10px] text-muted-foreground/60 mt-1 max-w-[220px] leading-relaxed">
                      Cliquez sur le bouton <strong>"Sources"</strong> sous un message de l'IA pour afficher son journal de réflexion.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {/* Header Details */}
                    <div className="flex items-center justify-between border-b border-border/30 pb-3">
                      <div className="flex items-center gap-2">
                        <Terminal className="h-4 w-4 text-emerald-500" />
                        <h3 className="text-sm font-bold tracking-tight text-foreground">Réflexion</h3>
                      </div>
                      <span className="text-[9px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-bold border border-emerald-500/10">
                        {selectedMessage.reflection.duration}
                      </span>
                    </div>

                    {/* Timeline List */}
                    <div className="relative border-l border-border/80 pl-4 ml-2.5 py-1 space-y-5">
                      {selectedMessage.reflection.steps.map((step, idx) => (
                        <div key={idx} className="relative">
                          {/* Circle dot on the left line */}
                          <div className={cn(
                            "absolute -left-[23px] top-0.5 flex h-4.5 w-4.5 items-center justify-center rounded-full border bg-background text-[8px] font-bold shadow-sm",
                            step.status === "success" 
                              ? "border-emerald-500/60 text-emerald-600 dark:text-emerald-400" 
                              : "border-border text-muted-foreground"
                          )}>
                            {idx + 1}
                          </div>
                          
                          <div className="space-y-1.5">
                            <h4 className="text-xs font-semibold leading-tight text-foreground">{step.title}</h4>
                            {step.description && (
                              <p className="text-[10.5px] leading-relaxed text-muted-foreground">{step.description}</p>
                            )}
                            
                            {/* Command details if any */}
                            {step.codeBlock && (
                              <CodeExecutionBlock block={step.codeBlock} />
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </aside>
  );
}

function CodeExecutionBlock({ block }: { block: CommandStep }) {
  const [copied, setCopied] = React.useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(block.command);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="mt-2.5 rounded-xl border border-border/50 bg-muted/40 overflow-hidden font-mono text-[10px] leading-relaxed shadow-sm">
      {/* Header bar */}
      <div className="flex items-center justify-between px-3 py-1.5 bg-muted/80 border-b border-border/30 select-none">
        <span className="text-[8.5px] font-bold text-muted-foreground/85 uppercase flex items-center gap-1">
          <span className="text-emerald-500 font-mono">&lt;&gt;</span> {block.language}
        </span>
        <button
          onClick={handleCopy}
          className="text-muted-foreground/50 hover:text-foreground transition p-0.5 rounded"
          title="Copier la commande"
        >
          {copied ? <Check className="h-3 w-3 text-emerald-500" /> : <Copy className="h-3 w-3" />}
        </button>
      </div>
      
      {/* Command input */}
      <div className="px-3 py-2 bg-muted/30 font-mono text-foreground/95 overflow-x-auto no-scrollbar font-medium">
        <span className="text-muted-foreground/60 mr-1.5 select-none">$</span>
        <span>{block.command}</span>
      </div>
      
      {/* Terminal logs output */}
      <div className="px-3 py-2 border-t border-border/20 bg-background/40 text-[9.5px] text-muted-foreground/90 whitespace-pre overflow-x-auto no-scrollbar">
        {block.output}
      </div>
    </div>
  );
}
