"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

type Message = {
  role: "user" | "assistant";
  content: string;
};

interface ConversationMinimapProps {
  messages: Message[];
}

export function ConversationMinimap({ messages }: ConversationMinimapProps) {
  const [isOpen, setIsOpen] = React.useState(false);
  const [hoveredIndex, setHoveredIndex] = React.useState<number | null>(null);

  // We only show the minimap if there are messages to navigate
  if (messages.length <= 1) return null;

  const scrollToMessage = (index: number) => {
    const el = document.getElementById(`msg-${index}`);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  };

  return (
    <div
      className="absolute right-4 top-1/2 -translate-y-1/2 z-40 flex items-center"
      onMouseEnter={() => setIsOpen(true)}
      onMouseLeave={() => {
        setIsOpen(false);
        setHoveredIndex(null);
      }}
    >
      {/* Popover Menu to the left of the ticks */}
      {isOpen && (
        <div 
          className="mr-3 w-80 rounded-2xl border border-border/60 bg-card/95 p-3 shadow-2xl backdrop-blur-lg animate-in fade-in slide-in-from-right-3 duration-200"
        >
          <div className="flex items-center justify-between px-1 pb-2 mb-2 border-b border-border/50">
            <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
              Sommaire de la discussion
            </span>
            <span className="text-[9px] px-1.5 py-0.5 rounded bg-muted text-muted-foreground font-mono">
              {messages.length} messages
            </span>
          </div>
          
          <div className="max-h-64 overflow-y-auto pr-1 space-y-1 no-scrollbar">
            {messages.map((msg, index) => {
              const isUser = msg.role === "user";
              const isHovered = hoveredIndex === index;

              return (
                <button
                  key={index}
                  onClick={() => scrollToMessage(index)}
                  onMouseEnter={() => setHoveredIndex(index)}
                  className={cn(
                    "w-full text-left rounded-xl px-2.5 py-2 text-xs transition-all duration-150 flex flex-col gap-1 border border-transparent",
                    isHovered 
                      ? "bg-muted/80 border-border/50 translate-x-0.5" 
                      : "hover:bg-muted/40"
                  )}
                >
                  <div className="flex items-center justify-between w-full">
                    <span
                      className={cn(
                        "text-[9px] font-semibold uppercase tracking-widest",
                        isUser ? "text-primary" : "text-emerald-500"
                      )}
                    >
                      {isUser ? "Vous" : "IA"}
                    </span>
                    <span className="text-[9px] text-muted-foreground/70">
                      #{index + 1}
                    </span>
                  </div>
                  <p className="truncate text-foreground/90 font-normal leading-relaxed w-full">
                    {msg.content}
                  </p>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Vertical Ticks Track */}
      <div className="flex flex-col gap-1.5 py-4 px-2 select-none">
        {messages.map((msg, index) => {
          const isUser = msg.role === "user";
          const isHovered = hoveredIndex === index;

          return (
            <div
              key={index}
              onClick={() => scrollToMessage(index)}
              onMouseEnter={() => setHoveredIndex(index)}
              onMouseLeave={() => setHoveredIndex(null)}
              className={cn(
                "h-[3px] w-5 rounded-full transition-all duration-200 cursor-pointer origin-right",
                isHovered
                  ? isUser 
                    ? "bg-primary w-7 scale-y-125" 
                    : "bg-emerald-500 w-7 scale-y-125"
                  : "bg-foreground/20 hover:bg-foreground/60"
              )}
              title={isUser ? `Message ${index + 1} (Vous)` : `Message ${index + 1} (IA)`}
            />
          );
        })}
      </div>
    </div>
  );
}
