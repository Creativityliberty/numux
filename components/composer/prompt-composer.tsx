"use client";

import * as React from "react";
import {
  Bot,
  ChevronDown,
  FileCode2,
  FileText,
  Image,
  Mic,
  Paperclip,
  Plus,
  Send,
  Square,
  Sparkles,
  Check,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const demoAttachments = [
  { name: "layout-reference.png", type: "image", icon: Image },
  { name: "prompt-brief.md", type: "doc", icon: FileText },
  { name: "theme.json", type: "code", icon: FileCode2 },
];

const AGENTS = ["Agent Architecte", "Agent Développeur", "Agent Auditeur", "Agent Rédacteur"];
const BUILD_MODES = ["Deep Build", "Flash Build"];
const PLATFORMS = ["Next.js · Vercel", "React · Vite", "HTML · Tailwind"];

interface PromptComposerProps {
  onSubmit: (
    value: string,
    metadata: {
      agent: string;
      buildMode: string;
      platform: string;
      attachments: string[];
    }
  ) => void;
  isGenerating: boolean;
  className?: string;
}

export function PromptComposer({ onSubmit, isGenerating, className }: PromptComposerProps) {
  const [value, setValue] = React.useState("");
  const textareaRef = React.useRef<HTMLTextAreaElement | null>(null);

  // Connection states
  const [activeAttachments, setActiveAttachments] = React.useState<string[]>([
    "prompt-brief.md",
    "theme.json",
  ]);
  const [selectedAgent, setSelectedAgent] = React.useState("Agent Architecte");
  const [selectedBuildMode, setSelectedBuildMode] = React.useState("Deep Build");
  const [selectedPlatform, setSelectedPlatform] = React.useState("Next.js · Vercel");

  // Dropdown states
  const [agentDropdownOpen, setAgentDropdownOpen] = React.useState(false);
  const [modeDropdownOpen, setModeDropdownOpen] = React.useState(false);
  const [platformDropdownOpen, setPlatformDropdownOpen] = React.useState(false);

  React.useEffect(() => {
    const element = textareaRef.current;
    if (!element) return;
    element.style.height = "0px";
    element.style.height = `${Math.min(element.scrollHeight, 180)}px`;
  }, [value]);

  function submit() {
    const clean = value.trim();
    if (!clean || isGenerating) return;
    onSubmit(clean, {
      agent: selectedAgent,
      buildMode: selectedBuildMode,
      platform: selectedPlatform,
      attachments: activeAttachments,
    });
    setValue("");
  }

  const toggleAttachment = (name: string) => {
    setActiveAttachments((current) =>
      current.includes(name) ? current.filter((a) => a !== name) : [...current, name]
    );
  };

  return (
    <section className={cn("w-full max-w-3xl z-10", className)}>
      <div className="rounded-[34px] border bg-card/90 p-3 soft-shadow backdrop-blur-xl transition-all focus-within:ring-2 focus-within:ring-ring/10">
        
        {/* Toggleable Attachments */}
        <div className="flex gap-2 overflow-x-auto px-1 pb-2 no-scrollbar">
          {demoAttachments.map((attachment) => {
            const Icon = attachment.icon;
            const isActive = activeAttachments.includes(attachment.name);

            return (
              <button
                key={attachment.name}
                onClick={() => toggleAttachment(attachment.name)}
                className={cn(
                  "flex min-w-fit items-center gap-2 rounded-2xl border px-3 py-2 text-xs transition-all duration-200 cursor-pointer select-none font-medium",
                  isActive
                    ? "bg-primary/10 border-primary/20 text-foreground"
                    : "opacity-45 hover:opacity-75 bg-muted/40 text-muted-foreground border-border/40"
                )}
                title={isActive ? "Cliquez pour détacher" : "Cliquez pour attacher le fichier"}
              >
                <Icon className={cn("h-3.5 w-3.5", isActive && "text-primary")} />
                <span>{attachment.name}</span>
                {isActive && <Check className="h-3 w-3 ml-0.5 text-primary" />}
              </button>
            );
          })}
        </div>

        {/* Input box Textarea */}
        <div className="flex items-start gap-2 px-1 py-1">
          <Button variant="ghost" size="icon" className="mt-1 shrink-0" aria-label="Ajouter un fichier">
            <Plus className="h-5 w-5" />
          </Button>
          <textarea
            ref={textareaRef}
            value={value}
            onChange={(event) => setValue(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === "Enter" && !event.shiftKey) {
                event.preventDefault();
                submit();
              }
            }}
            placeholder="Décris ton application, ton agent ou ton dashboard..."
            rows={1}
            className="max-h-[180px] min-h-[54px] flex-1 resize-none bg-transparent px-1 py-4 text-base outline-none placeholder:text-muted-foreground text-foreground"
          />
        </div>

        {/* Action Selectors & Submit Button */}
        <div className="flex flex-wrap items-center justify-between gap-3 px-1 pt-2 border-t border-border/20">
          <div className="flex flex-wrap items-center gap-2">
            
            {/* Agent Dropdown */}
            <div className="relative">
              <button
                onClick={() => setAgentDropdownOpen(!agentDropdownOpen)}
                className="inline-flex h-9 items-center gap-2 rounded-full border bg-background px-3 text-xs text-muted-foreground transition hover:bg-muted font-semibold select-none cursor-pointer"
              >
                <Bot className="h-3.5 w-3.5" />
                {selectedAgent}
                <ChevronDown className="h-3.5 w-3.5" />
              </button>
              {agentDropdownOpen && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setAgentDropdownOpen(false)} />
                  <div className="absolute left-0 bottom-full mb-2 z-50 w-48 rounded-2xl border border-border/50 bg-card p-1.5 shadow-2xl animate-in fade-in duration-150">
                    {AGENTS.map((agent) => (
                      <button
                        key={agent}
                        onClick={() => {
                          setSelectedAgent(agent);
                          setAgentDropdownOpen(false);
                        }}
                        className={cn(
                          "w-full text-left rounded-xl px-2.5 py-1.5 text-xs transition-colors font-medium",
                          selectedAgent === agent ? "bg-muted text-foreground" : "text-muted-foreground hover:bg-muted/60 hover:text-foreground"
                        )}
                      >
                        {agent}
                      </button>
                    ))}
                  </div>
                </>
              )}
            </div>

            {/* Build Mode Dropdown */}
            <div className="relative">
              <button
                onClick={() => setBuildModeDropdownOpen(!modeDropdownOpen)}
                className="inline-flex h-9 items-center gap-2 rounded-full border bg-background px-3 text-xs text-muted-foreground transition hover:bg-muted font-semibold select-none cursor-pointer"
              >
                <Sparkles className="h-3.5 w-3.5" />
                {selectedBuildMode}
                <ChevronDown className="h-3.5 w-3.5" />
              </button>
              {modeDropdownOpen && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setModeDropdownOpen(false)} />
                  <div className="absolute left-0 bottom-full mb-2 z-50 w-40 rounded-2xl border border-border/50 bg-card p-1.5 shadow-2xl animate-in fade-in duration-150">
                    {BUILD_MODES.map((mode) => (
                      <button
                        key={mode}
                        onClick={() => {
                          setSelectedBuildMode(mode);
                          setModeDropdownOpen(false);
                        }}
                        className={cn(
                          "w-full text-left rounded-xl px-2.5 py-1.5 text-xs transition-colors font-medium",
                          selectedBuildMode === mode ? "bg-muted text-foreground" : "text-muted-foreground hover:bg-muted/60 hover:text-foreground"
                        )}
                      >
                        {mode}
                      </button>
                    ))}
                  </div>
                </>
              )}
            </div>

            {/* Platform Dropdown Badge */}
            <div className="relative">
              <button
                onClick={() => setPlatformDropdownOpen(!platformDropdownOpen)}
                className="inline-flex h-9 items-center gap-2 rounded-full border bg-emerald-500/10 hover:bg-emerald-500/25 border-emerald-500/25 px-3 text-xs text-emerald-600 dark:text-emerald-400 font-bold select-none cursor-pointer transition-colors"
              >
                {selectedPlatform}
                <ChevronDown className="h-3.5 w-3.5" />
              </button>
              {platformDropdownOpen && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setPlatformDropdownOpen(false)} />
                  <div className="absolute left-0 bottom-full mb-2 z-50 w-44 rounded-2xl border border-border/50 bg-card p-1.5 shadow-2xl animate-in fade-in duration-150">
                    {PLATFORMS.map((plat) => (
                      <button
                        key={plat}
                        onClick={() => {
                          setSelectedPlatform(plat);
                          setPlatformDropdownOpen(false);
                        }}
                        className={cn(
                          "w-full text-left rounded-xl px-2.5 py-1.5 text-xs transition-colors font-medium",
                          selectedPlatform === plat ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400" : "text-muted-foreground hover:bg-muted/60 hover:text-foreground"
                        )}
                      >
                        {plat}
                      </button>
                    ))}
                  </div>
                </>
              )}
            </div>

          </div>

          {/* Composer Footer Actions */}
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" aria-label="Joindre un fichier">
              <Paperclip className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon" aria-label="Dicter">
              <Mic className="h-4 w-4" />
            </Button>
            <Button onClick={submit} size="icon" variant={isGenerating ? "secondary" : "premium"} aria-label="Envoyer">
              {isGenerating ? <Square className="h-4 w-4 fill-current" /> : <Send className="h-4 w-4" />}
            </Button>
          </div>
        </div>
      </div>
    </section>
  );

  // Helper because TypeScript can complain about state setter names
  function setBuildModeDropdownOpen(open: boolean) {
    setModeDropdownOpen(open);
  }
}
