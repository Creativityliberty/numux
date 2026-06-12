"use client";

import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

interface SidebarItemProps {
  icon: LucideIcon;
  label: string;
  active?: boolean;
  collapsed?: boolean;
  badge?: string;
}

export function SidebarItem({ icon: Icon, label, active, collapsed, badge }: SidebarItemProps) {
  const item = (
    <button
      type="button"
      className={cn(
        "group flex h-10 w-full items-center gap-3 rounded-2xl px-3 text-sm text-muted-foreground transition-all hover:bg-muted hover:text-foreground",
        active && "bg-foreground text-background hover:bg-foreground hover:text-background",
        collapsed && "justify-center px-0",
      )}
    >
      <Icon className="h-4 w-4 shrink-0" />
      {!collapsed && <span className="min-w-0 flex-1 truncate text-left">{label}</span>}
      {!collapsed && badge ? (
        <span className="rounded-full bg-secondary px-2 py-0.5 text-[10px] text-secondary-foreground">{badge}</span>
      ) : null}
    </button>
  );

  if (!collapsed) return item;

  return (
    <Tooltip>
      <TooltipTrigger asChild>{item}</TooltipTrigger>
      <TooltipContent side="right">{label}</TooltipContent>
    </Tooltip>
  );
}
