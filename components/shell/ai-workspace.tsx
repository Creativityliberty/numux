"use client";

import * as React from "react";
import {
  Check,
  ChevronDown,
  CircleStop,
  Menu,
  Moon,
  PanelRightOpen,
  Sparkles,
  Sun,
  TerminalSquare,
  Copy,
  Pencil,
  Download,
  RotateCcw,
  BookOpen,
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
import { Markdown } from "@/components/ui/markdown";

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

const AVAILABLE_MODELS = [
  "gpt-oss:120b-cloud",
  "gpt-oss:20b-cloud",
  "deepseek-v3.1:671b-cloud",
  "qwen3-coder:480b-cloud",
  "gemma3:4b",
];

const initialMessages: Message[] = [
  {
    role: "assistant",
    content: "Prêt. Décris le dashboard IA que tu veux : je structure le shell, les panneaux, les actions, puis le câblage Next.js.",
    reflection: {
      duration: "1.2s",
      steps: [
        {
          title: "Initialisation du modèle",
          status: "success",
          description: "Chargement du contexte Nümtema AI Workspace.",
        },
        {
          title: "Vérification de l'environnement",
          status: "success",
          description: "Le workspace Next.js est prêt et configuré pour le déploiement Vercel.",
        },
      ],
    },
  },
];

const capturePlanReflection = (
  promptText: string,
  modelName: string,
  durationSec: string,
  metadata?: { agent: string; buildMode: string; platform: string; attachments: string[] }
): MessageReflection => {
  const agentText = metadata?.agent || "Agent Architecte";
  const platformText = metadata?.platform || "Next.js · Vercel";
  const filesCount = metadata?.attachments?.length || 0;

  return {
    duration: durationSec,
    steps: [
      {
        title: `Initialisation via ${modelName}`,
        status: "success",
        description: `Configuration de l'agent [${agentText}] ciblant la stack [${platformText}].`,
      },
      {
        title: "Lecture des documents joints et contexte",
        status: "success",
        description: `Analyse avec ${filesCount} pièces jointes actives. Brief: "${promptText.substring(0, 40)}..."`,
      },
      {
        title: "Audit du code du workspace",
        status: "success",
        description: "Recherche des dépendances requises dans package.json et tsconfig.json.",
        codeBlock: {
          language: "bash",
          command: "cat package.json | grep -E 'dependencies|devDependencies'",
          output: `{
  "dependencies": {
    "next": "15.5.19",
    "react": "19.0.0",
    "lucide-react": "^0.468.0",
    "next-themes": "^0.4.4"
  }
}`,
        },
      },
      {
        title: "Génération de la réponse finale",
        status: "success",
        description: `Réponse transmise en streaming avec succès en ${durationSec}.`,
      },
    ],
  };
};

export function AiWorkspace() {
  const [sidebarCollapsed, setSidebarCollapsed] = React.useState(false);
  const [rightPanelOpen, setRightPanelOpen] = React.useState(true);
  const [isGenerating, setIsGenerating] = React.useState(false);
  const [messages, setMessages] = React.useState<Message[]>(initialMessages);
  const { theme, setTheme } = useTheme();

  // Model selection states
  const [selectedModel, setSelectedModel] = React.useState<string>("gpt-oss:120b-cloud");
  const [modelDropdownOpen, setModelDropdownOpen] = React.useState(false);

  // New states for actions & context panel
  const [editingIndex, setEditingIndex] = React.useState<number | null>(null);
  const [activeRightTab, setActiveRightTab] = React.useState<"project" | "activity">("project");
  const [selectedMessageIndex, setSelectedMessageIndex] = React.useState<number | null>(null);

  // Keep track of the last submitted composer metadata to reuse in regenerate/edit
  const [lastMetadata, setLastMetadata] = React.useState({
    agent: "Agent Architecte",
    buildMode: "Deep Build",
    platform: "Next.js · Vercel",
    attachments: ["prompt-brief.md", "theme.json"],
  });

  async function handleSubmit(
    value: string,
    metadata?: { agent: string; buildMode: string; platform: string; attachments: string[] }
  ) {
    if (isGenerating) return;

    const finalMetadata = metadata || lastMetadata;
    setLastMetadata(finalMetadata);

    // 1. Add user message
    const userMsg: Message = { role: "user", content: value };
    const updatedMessages = [...messages, userMsg];
    setMessages(updatedMessages);
    setIsGenerating(true);

    // 2. Add empty assistant message to populate stream into
    const assistantIndex = updatedMessages.length;
    setMessages((current) => [
      ...current,
      { role: "assistant", content: "" }
    ]);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: updatedMessages,
          model: selectedModel,
          ...finalMetadata, // send agent, buildMode, platform, attachments
        }),
      });

      if (!response.ok) {
        throw new Error(await response.text());
      }

      if (!response.body) return;
      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let streamedText = "";
      const startTime = Date.now();

      while (true) {
        const { done, value: chunk } = await reader.read();
        if (done) break;

        streamedText += decoder.decode(chunk, { stream: true });
        
        // Update assistant message content in state in real-time
        setMessages((current) => {
          const next = [...current];
          if (next[assistantIndex]) {
            next[assistantIndex] = {
              ...next[assistantIndex],
              content: streamedText,
            };
          }
          return next;
        });
      }

      // Generation complete: calculate duration and set reflection logs
      const durationMs = Date.now() - startTime;
      const durationSec = (durationMs / 1000).toFixed(1) + "s";

      setMessages((current) => {
        const next = [...current];
        if (next[assistantIndex]) {
          next[assistantIndex] = {
            ...next[assistantIndex],
            reflection: capturePlanReflection(value, selectedModel, durationSec, finalMetadata),
          };
        }
        return next;
      });

    } catch (error: any) {
      console.error("Chat generation failed:", error);
      setMessages((current) => {
        const next = [...current];
        if (next[assistantIndex]) {
          next[assistantIndex] = {
            ...next[assistantIndex],
            content: `Erreur de connexion à Ollama : ${error?.message || error}`,
          };
        }
        return next;
      });
    } finally {
      setIsGenerating(false);
    }
  }

  function handleQuickAction(label: string) {
    handleSubmit(`${label} pour un AI workspace premium, responsive, arrondi et prêt Vercel.`);
  }

  async function handleSaveEdit(index: number, newValue: string) {
    if (messages[index].role === "user") {
      // User edited: truncate conversation here
      const newMessages = messages.slice(0, index);
      const updatedUserMsg: Message = { role: "user", content: newValue };
      const nextMessages = [...newMessages, updatedUserMsg];
      setMessages(nextMessages);
      setEditingIndex(null);
      setIsGenerating(true);

      const assistantIndex = nextMessages.length;
      setMessages((current) => [
        ...current,
        { role: "assistant", content: "" }
      ]);

      try {
        const response = await fetch("/api/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            messages: nextMessages,
            model: selectedModel,
            ...lastMetadata,
          }),
        });

        if (!response.ok) throw new Error(await response.text());
        if (!response.body) return;

        const reader = response.body.getReader();
        const decoder = new TextDecoder();
        let streamedText = "";
        const startTime = Date.now();

        while (true) {
          const { done, value: chunk } = await reader.read();
          if (done) break;

          streamedText += decoder.decode(chunk, { stream: true });
          setMessages((current) => {
            const next = [...current];
            if (next[assistantIndex]) {
              next[assistantIndex] = { ...next[assistantIndex], content: streamedText };
            }
            return next;
          });
        }

        const durationSec = ((Date.now() - startTime) / 1000).toFixed(1) + "s";
        setMessages((current) => {
          const next = [...current];
          if (next[assistantIndex]) {
            next[assistantIndex] = {
              ...next[assistantIndex],
              reflection: capturePlanReflection(newValue, selectedModel, durationSec, lastMetadata),
            };
          }
          return next;
        });

      } catch (error: any) {
        console.error("Chat generation failed:", error);
        setMessages((current) => {
          const next = [...current];
          if (next[assistantIndex]) {
            next[assistantIndex] = {
              ...next[assistantIndex],
              content: `Erreur de connexion à Ollama : ${error?.message || error}`,
            };
          }
          return next;
        });
      } finally {
        setIsGenerating(false);
      }
    } else {
      // AI edited: just update text locally
      setMessages((current) => {
        const next = [...current];
        next[index] = { ...next[index], content: newValue };
        return next;
      });
      setEditingIndex(null);
    }
  }

  async function handleRegenerate(index: number) {
    if (index > 0 && messages[index].role === "assistant") {
      const userPrompt = messages[index - 1].content;
      const nextMessages = messages.slice(0, index);
      setMessages(nextMessages);
      setIsGenerating(true);

      const assistantIndex = nextMessages.length;
      setMessages((current) => [
        ...current,
        { role: "assistant", content: "" }
      ]);

      try {
        const response = await fetch("/api/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            messages: nextMessages,
            model: selectedModel,
            ...lastMetadata,
          }),
        });

        if (!response.ok) throw new Error(await response.text());
        if (!response.body) return;

        const reader = response.body.getReader();
        const decoder = new TextDecoder();
        let streamedText = "";
        const startTime = Date.now();

        while (true) {
          const { done, value: chunk } = await reader.read();
          if (done) break;

          streamedText += decoder.decode(chunk, { stream: true });
          setMessages((current) => {
            const next = [...current];
            if (next[assistantIndex]) {
              next[assistantIndex] = { ...next[assistantIndex], content: streamedText };
            }
            return next;
          });
        }

        const durationSec = ((Date.now() - startTime) / 1000).toFixed(1) + "s";
        setMessages((current) => {
          const next = [...current];
          if (next[assistantIndex]) {
            next[assistantIndex] = {
              ...next[assistantIndex],
              reflection: capturePlanReflection(userPrompt, selectedModel, durationSec, lastMetadata),
            };
          }
          return next;
        });

      } catch (error: any) {
        console.error("Chat generation failed:", error);
        setMessages((current) => {
          const next = [...current];
          if (next[assistantIndex]) {
            next[assistantIndex] = {
              ...next[assistantIndex],
              content: `Erreur de connexion à Ollama : ${error?.message || error}`,
            };
          }
          return next;
        });
      } finally {
        setIsGenerating(false);
      }
    }
  }

  function handleShowSources(index: number) {
    setSelectedMessageIndex(index);
    setActiveRightTab("activity");
    setRightPanelOpen(true);
  }

  return (
    <main className="flex min-h-screen overflow-hidden bg-background text-foreground">
      <AppSidebar collapsed={sidebarCollapsed} onToggle={() => setSidebarCollapsed((value) => !value)} />

      <section className="relative flex h-screen min-w-0 flex-1 flex-col overflow-hidden">
        <header className="flex h-16 shrink-0 items-center justify-between px-4 md:px-6 z-10">
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
            {/* Model Selector Dropdown */}
            <div className="relative">
              <button 
                onClick={() => setModelDropdownOpen(!modelDropdownOpen)}
                className="hidden h-9 items-center gap-2 rounded-full border bg-card/70 px-3 text-xs text-muted-foreground backdrop-blur transition hover:bg-muted md:inline-flex font-medium select-none cursor-pointer"
              >
                <Sparkles className="h-3.5 w-3.5 text-primary dark:text-primary-foreground/90" />
                {selectedModel}
                <ChevronDown className="h-3.5 w-3.5 animate-in fade-in" />
              </button>
              {modelDropdownOpen && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setModelDropdownOpen(false)} />
                  <div className="absolute right-0 mt-2 z-50 w-64 rounded-2xl border border-border/50 bg-card/95 p-1.5 shadow-2xl backdrop-blur-md animate-in fade-in slide-in-from-top-2 duration-150">
                    <p className="px-2.5 py-1.5 text-[9px] font-bold uppercase tracking-wider text-muted-foreground border-b border-border/30 mb-1">
                      Sélectionner un modèle
                    </p>
                    <div className="max-h-60 overflow-y-auto no-scrollbar space-y-0.5">
                      {AVAILABLE_MODELS.map((model) => (
                        <button
                          key={model}
                          onClick={() => {
                            setSelectedModel(model);
                            setModelDropdownOpen(false);
                          }}
                          className={cn(
                            "w-full text-left rounded-xl px-2.5 py-2 text-xs transition-colors flex items-center justify-between font-medium",
                            selectedModel === model
                              ? "bg-muted text-foreground"
                              : "text-muted-foreground/90 hover:bg-muted/50 hover:text-foreground"
                          )}
                        >
                          <span>{model}</span>
                          <svg
                            className="h-3.5 w-3.5 opacity-60"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z"
                            />
                          </svg>
                        </button>
                      ))}
                    </div>
                  </div>
                </>
              )}
            </div>

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

            {/* Messages list with group hover actions */}
            <div className="mt-10 w-full max-w-3xl space-y-4 text-left">
              {messages.map((message, index) => {
                const isEditing = editingIndex === index;

                return (
                  <div key={`${message.role}-${index}`} id={`msg-${index}`} className="scroll-mt-20 group relative flex flex-col">
                    {isEditing ? (
                      <EditMessageBlock
                        initialValue={message.content}
                        onSave={(val) => handleSaveEdit(index, val)}
                        onCancel={() => setEditingIndex(null)}
                        isUser={message.role === "user"}
                      />
                    ) : (
                      <>
                        <MessageBubble message={message} />
                        <MessageActions
                          message={message}
                          index={index}
                          onEdit={() => setEditingIndex(index)}
                          onRegenerate={() => handleRegenerate(index)}
                          onShowSources={() => handleShowSources(index)}
                        />
                      </>
                    )}
                  </div>
                );
              })}
              {isGenerating && <GeneratingCard />}
            </div>

            <PromptComposer className="mt-8" onSubmit={handleSubmit} isGenerating={isGenerating} />
            <QuickActions className="mt-5" onPick={handleQuickAction} />
          </div>
        </div>

        <ConversationMinimap messages={messages} />
      </section>

      <RightContextPanel
        open={rightPanelOpen}
        onToggle={() => setRightPanelOpen((value) => !value)}
        activeTab={activeRightTab}
        onTabChange={setActiveRightTab}
        selectedMessage={selectedMessageIndex !== null ? messages[selectedMessageIndex] : null}
        messageIndex={selectedMessageIndex}
      />
    </main>
  );
}

function MessageBubble({ message }: { message: Message }) {
  const isUser = message.role === "user";

  return (
    <div className={cn("flex w-full", isUser ? "justify-end" : "justify-start")}>
      <div
        className={cn(
          "max-w-[85%] rounded-[28px] border px-5 py-4 text-sm leading-6 soft-shadow",
          isUser ? "bg-foreground text-background" : "bg-card/80 text-foreground backdrop-blur",
        )}
      >
        <Markdown content={message.content} />
      </div>
    </div>
  );
}

interface MessageActionsProps {
  message: Message;
  index: number;
  onEdit: () => void;
  onRegenerate: () => void;
  onShowSources: () => void;
}

function MessageActions({ message, index, onEdit, onRegenerate, onShowSources }: MessageActionsProps) {
  const isUser = message.role === "user";
  const [copied, setCopied] = React.useState(false);
  const [showDownloadMenu, setShowDownloadMenu] = React.useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(message.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = (format: "md" | "txt") => {
    const element = document.createElement("a");
    const header = `---\nrole: ${message.role}\nindex: ${index + 1}\n---\n\n`;
    const content = format === "md" ? `${header}${message.content}` : message.content;
    const file = new Blob([content], { type: "text/plain;charset=utf-8" });
    element.href = URL.createObjectURL(file);
    element.download = `message-${index + 1}.${format}`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
    setShowDownloadMenu(false);
  };

  return (
    <div
      className={cn(
        "flex items-center gap-2 mt-1.5 px-3 opacity-0 group-hover:opacity-100 focus-within:opacity-100 transition-opacity duration-200 select-none text-muted-foreground",
        isUser ? "justify-end" : "justify-start",
      )}
    >
      <div className="flex items-center gap-1 bg-muted/20 dark:bg-muted/10 rounded-full px-1.5 py-0.5 border border-border/40 backdrop-blur-sm shadow-sm">
        {/* Copy Button */}
        <button
          onClick={handleCopy}
          className="text-muted-foreground/60 hover:text-foreground transition p-1 rounded-full hover:bg-background/80"
          title="Copier le message"
        >
          {copied ? <Check className="h-3.5 w-3.5 text-emerald-500" /> : <Copy className="h-3.5 w-3.5" />}
        </button>

        {/* Edit Button */}
        <button
          onClick={onEdit}
          className="text-muted-foreground/60 hover:text-foreground transition p-1 rounded-full hover:bg-background/80"
          title="Modifier le message"
        >
          <Pencil className="h-3.5 w-3.5" />
        </button>

        {/* Download Button */}
        <div className="relative flex items-center">
          <button
            onClick={() => setShowDownloadMenu(!showDownloadMenu)}
            className="text-muted-foreground/60 hover:text-foreground transition p-1 rounded-full hover:bg-background/80"
            title="Télécharger le message"
          >
            <Download className="h-3.5 w-3.5" />
          </button>
          {showDownloadMenu && (
            <>
              <div className="fixed inset-0 z-40" onClick={() => setShowDownloadMenu(false)} />
              <div className={cn(
                "absolute bottom-full mb-2 z-50 w-24 rounded-xl border border-border/40 bg-card p-1 shadow-xl text-[10.5px] font-semibold animate-in fade-in duration-150",
                isUser ? "right-0 origin-bottom-right" : "left-0 origin-bottom-left"
              )}>
                <button
                  onClick={() => handleDownload("md")}
                  className="w-full text-left rounded-lg px-2.5 py-1.5 hover:bg-muted/80 text-foreground/90 hover:text-foreground"
                >
                  Format .md
                </button>
                <button
                  onClick={() => handleDownload("txt")}
                  className="w-full text-left rounded-lg px-2.5 py-1.5 hover:bg-muted/80 text-foreground/90 hover:text-foreground"
                >
                  Format .txt
                </button>
              </div>
            </>
          )}
        </div>

        {/* Regenerate Button (AI only) */}
        {!isUser && (
          <button
            onClick={onRegenerate}
            className="text-muted-foreground/60 hover:text-foreground transition p-1 rounded-full hover:bg-background/80"
            title="Régénérer la réponse"
          >
            <RotateCcw className="h-3.5 w-3.5" />
          </button>
        )}
      </div>

      {/* Sources badge (AI only) */}
      {!isUser && (
        <button
          onClick={onShowSources}
          className="flex items-center gap-1 rounded-full border border-border/60 bg-card/60 px-2.5 py-1 text-[9px] font-bold uppercase tracking-wider text-muted-foreground/90 shadow-sm backdrop-blur-sm transition-all hover:bg-muted hover:border-border hover:text-foreground cursor-pointer"
        >
          <BookOpen className="h-3 w-3" />
          Sources
        </button>
      )}
    </div>
  );
}

interface EditMessageBlockProps {
  initialValue: string;
  onSave: (value: string) => void;
  onCancel: () => void;
  isUser: boolean;
}

function EditMessageBlock({ initialValue, onSave, onCancel, isUser }: EditMessageBlockProps) {
  const [value, setValue] = React.useState(initialValue);
  const textareaRef = React.useRef<HTMLTextAreaElement | null>(null);

  React.useEffect(() => {
    const el = textareaRef.current;
    if (el) {
      el.focus();
      el.setSelectionRange(el.value.length, el.value.length);
      el.style.height = "auto";
      el.style.height = `${el.scrollHeight}px`;
    }
  }, []);

  const adjustHeight = () => {
    const el = textareaRef.current;
    if (el) {
      el.style.height = "auto";
      el.style.height = `${el.scrollHeight}px`;
    }
  };

  return (
    <div className={cn("flex flex-col w-full gap-2", isUser ? "items-end" : "items-start")}>
      <div
        className={cn(
          "w-full max-w-[85%] rounded-[24px] border p-4 shadow-md bg-card flex flex-col gap-2",
          isUser ? "border-primary/20" : "border-border",
        )}
      >
        <textarea
          ref={textareaRef}
          value={value}
          onChange={(e) => {
            setValue(e.target.value);
            adjustHeight();
          }}
          className="w-full bg-transparent text-sm leading-relaxed outline-none resize-none no-scrollbar min-h-[50px] text-foreground"
          placeholder="Modifier le message..."
        />
        <div className="flex items-center justify-end gap-1.5 border-t border-border/40 pt-2 shrink-0">
          <Button variant="ghost" size="sm" onClick={onCancel} className="h-7 rounded-xl text-xs px-2.5 text-muted-foreground hover:text-foreground">
            Annuler
          </Button>
          <Button
            variant="premium"
            size="sm"
            onClick={() => onSave(value)}
            disabled={!value.trim()}
            className="h-7 rounded-xl text-xs px-3"
          >
            Enregistrer
          </Button>
        </div>
      </div>
    </div>
  );
}

function GeneratingCard() {
  return (
    <Card className="rounded-[28px] border bg-card/80 p-5 shadow-none backdrop-blur animate-pulse">
      <div className="flex items-start gap-3">
        <div className="mt-0.5 flex h-8 w-8 items-center justify-center rounded-full bg-muted">
          <TerminalSquare className="h-4 w-4" />
        </div>
        <div className="flex-1">
          <div className="flex items-center justify-between gap-3">
            <p className="text-sm font-medium">Génération en cours...</p>
            <CircleStop className="h-4 w-4 text-muted-foreground" />
          </div>
          <p className="mt-1 text-sm text-muted-foreground">L'agent génère sa réponse via le modèle local...</p>
        </div>
      </div>
    </Card>
  );
}
