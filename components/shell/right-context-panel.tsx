"use client";

import { CheckCircle2, Circle, Clock3, File, PanelRightClose, PanelRightOpen, Rocket, SlidersHorizontal } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";

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
}

export function RightContextPanel({ open, onToggle }: RightContextPanelProps) {
  return (
    <aside
      className={cn(
        "hidden h-screen shrink-0 border-l bg-card/60 backdrop-blur-xl transition-all duration-300 xl:flex xl:flex-col",
        open ? "w-[330px]" : "w-[72px]",
      )}
    >
      <div className={cn("flex h-16 items-center px-4", open ? "justify-between" : "justify-center")}> 
        {open && (
          <div>
            <p className="text-sm font-semibold">Contexte projet</p>
            <p className="text-xs text-muted-foreground">Mission OS Shell</p>
          </div>
        )}
        <Button variant="ghost" size="iconSm" onClick={onToggle} aria-label="Basculer le panneau contexte">
          {open ? <PanelRightClose className="h-4 w-4" /> : <PanelRightOpen className="h-4 w-4" />}
        </Button>
      </div>

      {!open ? (
        <div className="flex flex-1 flex-col items-center gap-3 px-3 py-4 text-muted-foreground">
          <Rocket className="h-5 w-5" />
          <SlidersHorizontal className="h-5 w-5" />
          <Clock3 className="h-5 w-5" />
        </div>
      ) : (
        <div className="flex-1 space-y-4 overflow-y-auto p-4 no-scrollbar">
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
      )}
    </aside>
  );
}
