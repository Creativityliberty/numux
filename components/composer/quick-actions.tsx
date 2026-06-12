"use client";

import type { LucideIcon } from "lucide-react";
import { Bot, Code2, FileText, Image, LayoutDashboard, SearchCheck, WandSparkles } from "lucide-react";
import { cn } from "@/lib/utils";

interface QuickAction {
  label: string;
  icon: LucideIcon;
}

const actions: QuickAction[] = [
  { label: "Créer une app", icon: LayoutDashboard },
  { label: "Coder un dashboard", icon: Code2 },
  { label: "Auditer un projet", icon: SearchCheck },
  { label: "Générer un PDF", icon: FileText },
  { label: "Créer une image", icon: Image },
  { label: "Lancer un agent", icon: Bot },
];

interface QuickActionsProps {
  onPick: (label: string) => void;
  className?: string;
}

export function QuickActions({ onPick, className }: QuickActionsProps) {
  return (
    <div className={cn("flex max-w-4xl flex-wrap items-center justify-center gap-2", className)}>
      {actions.map((action) => {
        const Icon = action.icon;
        return (
          <button
            key={action.label}
            onClick={() => onPick(action.label)}
            className="group inline-flex h-11 items-center gap-2 rounded-full border bg-card/70 px-4 text-sm text-muted-foreground shadow-sm backdrop-blur transition-all hover:-translate-y-0.5 hover:bg-muted hover:text-foreground"
          >
            <Icon className="h-4 w-4 transition group-hover:scale-110" />
            {action.label}
          </button>
        );
      })}
      <button
        onClick={() => onPick("Composer un workflow complet")}
        className="group inline-flex h-11 items-center gap-2 rounded-full border bg-foreground px-4 text-sm text-background shadow-sm transition-all hover:-translate-y-0.5 hover:opacity-90"
      >
        <WandSparkles className="h-4 w-4" />
        Workflow complet
      </button>
    </div>
  );
}
