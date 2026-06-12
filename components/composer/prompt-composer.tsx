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
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

const demoAttachments = [
  { name: "layout-reference.png", type: "image", icon: Image },
  { name: "prompt-brief.md", type: "doc", icon: FileText },
  { name: "theme.json", type: "code", icon: FileCode2 },
];

interface PromptComposerProps {
  onSubmit: (value: string) => void;
  isGenerating: boolean;
  className?: string;
}

export function PromptComposer({ onSubmit, isGenerating, className }: PromptComposerProps) {
  const [value, setValue] = React.useState("");
  const textareaRef = React.useRef<HTMLTextAreaElement | null>(null);

  React.useEffect(() => {
    const element = textareaRef.current;
    if (!element) return;
    element.style.height = "0px";
    element.style.height = `${Math.min(element.scrollHeight, 180)}px`;
  }, [value]);

  function submit() {
    const clean = value.trim();
    if (!clean || isGenerating) return;
    onSubmit(clean);
    setValue("");
  }

  return (
    <section className={cn("w-full max-w-3xl", className)}>
      <div className="rounded-[34px] border bg-card/90 p-3 soft-shadow backdrop-blur-xl transition-all focus-within:ring-2 focus-within:ring-ring/10">
        <div className="flex gap-2 overflow-x-auto px-1 pb-2 no-scrollbar">
          {demoAttachments.map((attachment) => {
            const Icon = attachment.icon;
            return (
              <div
                key={attachment.name}
                className="flex min-w-fit items-center gap-2 rounded-2xl border bg-muted/60 px-3 py-2 text-xs text-muted-foreground"
              >
                <Icon className="h-3.5 w-3.5" />
                <span>{attachment.name}</span>
              </div>
            );
          })}
        </div>

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
            className="max-h-[180px] min-h-[54px] flex-1 resize-none bg-transparent px-1 py-4 text-base outline-none placeholder:text-muted-foreground"
          />
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3 px-1 pt-2">
          <div className="flex flex-wrap items-center gap-2">
            <button className="inline-flex h-9 items-center gap-2 rounded-full border bg-background px-3 text-xs text-muted-foreground transition hover:bg-muted">
              <Bot className="h-3.5 w-3.5" />
              Agent Architecte
              <ChevronDown className="h-3.5 w-3.5" />
            </button>
            <button className="inline-flex h-9 items-center gap-2 rounded-full border bg-background px-3 text-xs text-muted-foreground transition hover:bg-muted">
              <Sparkles className="h-3.5 w-3.5" />
              Deep Build
              <ChevronDown className="h-3.5 w-3.5" />
            </button>
            <Badge variant="success" className="h-9 border-0 px-3">
              Next.js · Vercel
            </Badge>
          </div>

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
}
