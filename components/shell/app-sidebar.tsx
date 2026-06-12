"use client";

import {
  Archive,
  Bot,
  ChevronLeft,
  ChevronRight,
  Command,
  FileText,
  FolderKanban,
  Home,
  Library,
  LifeBuoy,
  MessageSquarePlus,
  Puzzle,
  Search,
  Settings,
  Sparkles,
  UserRound,
  Zap,
} from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { TooltipProvider } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { SidebarItem } from "@/components/shell/sidebar-item";

const navItems = [
  { label: "Accueil", icon: Home, active: true },
  { label: "Nouveau workspace", icon: MessageSquarePlus },
  { label: "Recherche", icon: Search },
  { label: "Bibliothèque", icon: Library },
  { label: "Agents", icon: Bot, badge: "5" },
  { label: "Skills", icon: Puzzle, badge: "100+" },
  { label: "Templates", icon: Archive },
  { label: "Artifacts", icon: FileText },
];

const projects = ["Mission OS", "FunnelHub Builder", "FrigoDesk", "Sensation Zen"];

interface AppSidebarProps {
  collapsed: boolean;
  onToggle: () => void;
}

export function AppSidebar({ collapsed, onToggle }: AppSidebarProps) {
  return (
    <TooltipProvider delayDuration={120}>
      <aside
        className={cn(
          "hidden h-screen shrink-0 border-r bg-[var(--shell-sidebar)] transition-all duration-300 md:flex md:flex-col",
          collapsed ? "w-[72px]" : "w-[292px]",
        )}
      >
        <div className={cn("flex h-16 items-center px-4", collapsed ? "justify-center" : "justify-between")}>
          <div className="flex items-center gap-3">
            {!collapsed && (
              <div className="leading-tight">
                <p className="font-semibold tracking-tight">Nümtema Shell</p>
                <p className="text-xs text-muted-foreground">AI Workspace</p>
              </div>
            )}
          </div>
          {!collapsed && (
            <Button variant="ghost" size="iconSm" onClick={onToggle} aria-label="Réduire la barre latérale">
              <ChevronLeft className="h-4 w-4" />
            </Button>
          )}
        </div>

        {collapsed && (
          <div className="px-4 pb-2">
            <Button variant="ghost" size="iconSm" onClick={onToggle} aria-label="Étendre la barre latérale">
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        )}

        <div className="px-3">
          <Button className={cn("w-full", collapsed && "h-10 w-10 px-0")} variant="premium">
            <Command className="h-4 w-4" />
            {!collapsed && <span>Nouvelle mission</span>}
          </Button>
        </div>

        <nav className="mt-4 flex-1 space-y-1 overflow-y-auto px-3 no-scrollbar">
          {navItems.map((item) => (
            <SidebarItem key={item.label} collapsed={collapsed} {...item} />
          ))}

          <Separator className="my-4" />

          {!collapsed && <p className="px-3 pb-2 text-xs font-medium uppercase tracking-[0.18em] text-muted-foreground">Projets récents</p>}
          {projects.map((project, index) => (
            <SidebarItem key={project} collapsed={collapsed} label={project} icon={FolderKanban} active={index === 0} />
          ))}
        </nav>

        <div className="space-y-2 p-3">
          <SidebarItem collapsed={collapsed} label="Accélération" icon={Zap} />
          <SidebarItem collapsed={collapsed} label="Support" icon={LifeBuoy} />
          <SidebarItem collapsed={collapsed} label="Paramètres" icon={Settings} />
          <Separator />
          <div className={cn("flex items-center gap-3 rounded-3xl p-2", collapsed && "justify-center")}> 
            <Avatar className="h-10 w-10">
              <AvatarFallback className="bg-foreground text-background">N</AvatarFallback>
            </Avatar>
            {!collapsed && (
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium">Nümtema</p>
                <p className="truncate text-xs text-muted-foreground">Vercel-ready</p>
              </div>
            )}
            {!collapsed && <UserRound className="h-4 w-4 text-muted-foreground" />}
          </div>
        </div>
      </aside>
    </TooltipProvider>
  );
}
