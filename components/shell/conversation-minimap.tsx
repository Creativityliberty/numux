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
      {/* Premium Glassmorphic Popover Menu */}
      {isOpen && (
        <div 
          className="mr-4 w-80 rounded-[24px] border border-border/50 bg-card/75 p-3.5 shadow-2xl backdrop-blur-xl animate-in fade-in slide-in-from-right-3 duration-300"
        >
          {/* Header */}
          <div className="flex items-center justify-between px-1.5 pb-2.5 mb-2.5 border-b border-border/30">
            <span className="text-[9px] font-bold tracking-[0.12em] uppercase text-muted-foreground/80">
              Sommaire de la discussion
            </span>
            <span className="text-[9px] px-2.5 py-0.5 rounded-full bg-secondary text-secondary-foreground font-semibold">
              {messages.length} messages
            </span>
          </div>
          
          {/* List of Messages */}
          <div className="max-h-80 overflow-y-auto pr-1 space-y-1.5 no-scrollbar">
            {messages.map((msg, index) => {
              const isUser = msg.role === "user";
              const isHovered = hoveredIndex === index;

              return (
                <button
                  key={index}
                  onClick={() => scrollToMessage(index)}
                  onMouseEnter={() => setHoveredIndex(index)}
                  className={cn(
                    "relative w-full text-left rounded-[14px] px-3.5 py-2.5 text-xs transition-all duration-300 flex flex-col gap-1 border border-transparent overflow-hidden",
                    isHovered 
                      ? "bg-foreground/[0.03] dark:bg-foreground/[0.03] translate-x-1" 
                      : "hover:bg-foreground/[0.015]"
                  )}
                >
                  {/* Left accent colored bar shown on hover */}
                  <div
                    className={cn(
                      "absolute left-0 top-2 bottom-2 w-[3px] rounded-r-full transition-all duration-300",
                      isHovered
                        ? isUser
                          ? "bg-primary"
                          : "bg-emerald-500"
                        : "bg-transparent"
                    )}
                  />

                  {/* Message role & index */}
                  <div className="flex items-center justify-between w-full">
                    <span
                      className={cn(
                        "text-[9px] font-bold tracking-[0.15em] uppercase",
                        isUser 
                          ? "text-primary/80 dark:text-primary-foreground/85" 
                          : "text-emerald-600 dark:text-emerald-400"
                      )}
                    >
                      {isUser ? "Vous" : "IA"}
                    </span>
                    <span className="text-[9px] text-muted-foreground/40 font-mono">
                      #{index + 1}
                    </span>
                  </div>

                  {/* Content snippet (line-clamp-2 for premium look) */}
                  <p 
                    className={cn(
                      "text-[11px] font-normal leading-relaxed transition-colors duration-200 line-clamp-2 pr-1",
                      isHovered ? "text-foreground" : "text-muted-foreground"
                    )}
                  >
                    {msg.content}
                  </p>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Vertical Ticks Track */}
      <div className="flex flex-col gap-1.5 py-4 px-2 select-none items-end">
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
                "h-[2px] rounded-full transition-all duration-300 cursor-pointer origin-right",
                isHovered
                  ? isUser 
                    ? "bg-primary w-6 h-[3px]" 
                    : "bg-emerald-500 w-6 h-[3px]"
                  : "bg-foreground/20 hover:bg-foreground/50 w-3.5"
              )}
              title={isUser ? `Message ${index + 1} (Vous)` : `Message ${index + 1} (IA)`}
            />
          );
        })}
      </div>
    </div>
  );
}
