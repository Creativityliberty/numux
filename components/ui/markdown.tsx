"use client";

import * as React from "react";
import { Check, Copy } from "lucide-react";
import { cn } from "@/lib/utils";

interface MarkdownProps {
  content: string;
  className?: string;
}

export function Markdown({ content, className }: MarkdownProps) {
  if (!content) return null;

  // Split content by code blocks: ```lang\ncode```
  const parts = content.split(/(```[\s\S]*?```)/g);

  return (
    <div className={cn("space-y-2.5 font-normal text-sm leading-relaxed break-words text-foreground/95", className)}>
      {parts.map((part, index) => {
        if (part.startsWith("```") && part.endsWith("```")) {
          // It's a code block
          const match = part.match(/```(\w*)\n([\s\S]*?)```/);
          const lang = match ? match[1] : "";
          const code = match ? match[2] : part.slice(3, -3);

          return <CodeBlock key={index} language={lang} code={code} />;
        }

        // Parse regular text and other block elements line-by-line
        const lines = part.split("\n");
        return (
          <div key={index} className="space-y-1.5">
            {lines.map((line, lineIdx) => {
              const trimmed = line.trim();

              // Empty lines
              if (!trimmed) {
                return <div key={lineIdx} className="h-1.5" />;
              }

              // Heading 1
              if (line.startsWith("# ")) {
                return (
                  <h1 key={lineIdx} className="text-xl font-bold tracking-tight text-foreground mt-4 mb-2">
                    {parseInlineStyles(line.slice(2))}
                  </h1>
                );
              }

              // Heading 2
              if (line.startsWith("## ")) {
                return (
                  <h2 key={lineIdx} className="text-base font-bold tracking-tight text-foreground mt-3.5 mb-2">
                    {parseInlineStyles(line.slice(3))}
                  </h2>
                );
              }

              // Heading 3
              if (line.startsWith("### ")) {
                return (
                  <h3 key={lineIdx} className="text-sm font-bold tracking-tight text-foreground mt-3 mb-1.5">
                    {parseInlineStyles(line.slice(4))}
                  </h3>
                );
              }

              // Unordered list item
              if (line.startsWith("* ") || line.startsWith("- ")) {
                return (
                  <ul key={lineIdx} className="list-disc pl-5 space-y-1 my-1">
                    <li className="text-foreground/90 leading-relaxed">
                      {parseInlineStyles(line.slice(2))}
                    </li>
                  </ul>
                );
              }

              // Ordered list item
              if (/^\d+\.\s/.test(line)) {
                const match = line.match(/^(\d+)\.\s(.*)/);
                const num = match ? match[1] : "1";
                const rest = match ? match[2] : line;
                return (
                  <ol key={lineIdx} className="list-decimal pl-5 space-y-1 my-1" start={parseInt(num, 10)}>
                    <li className="text-foreground/90 leading-relaxed">
                      {parseInlineStyles(rest)}
                    </li>
                  </ol>
                );
              }

              // Horizontal rule
              if (trimmed === "---") {
                return <hr key={lineIdx} className="my-4 border-border/40" />;
              }

              // Blockquote
              if (line.startsWith("> ")) {
                return (
                  <blockquote key={lineIdx} className="border-l-4 border-primary/20 bg-muted/30 pl-4 py-1 pr-2 my-2 rounded-r-lg text-muted-foreground text-[13px] leading-relaxed">
                    {parseInlineStyles(line.slice(2))}
                  </blockquote>
                );
              }

              // Regular paragraph line
              return (
                <p key={lineIdx} className="leading-relaxed">
                  {parseInlineStyles(line)}
                </p>
              );
            })}
          </div>
        );
      })}
    </div>
  );
}

function CodeBlock({ language, code }: { language: string; code: string }) {
  const [copied, setCopied] = React.useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="my-3.5 rounded-2xl border border-border/50 bg-muted/35 overflow-hidden font-mono text-[11.5px] leading-relaxed shadow-sm">
      <div className="flex items-center justify-between px-4 py-2 bg-muted/80 border-b border-border/30 select-none text-[9.5px] font-bold text-muted-foreground uppercase">
        <span>{language || "code"}</span>
        <button
          onClick={handleCopy}
          className="text-muted-foreground/60 hover:text-foreground p-0.5 rounded transition flex items-center gap-1 cursor-pointer font-sans"
        >
          {copied ? (
            <>
              <Check className="h-3 w-3 text-emerald-500" />
              <span className="text-[9px] text-emerald-500 font-bold">Copié!</span>
            </>
          ) : (
            <>
              <Copy className="h-3 w-3" />
              <span className="text-[9px]">Copier</span>
            </>
          )}
        </button>
      </div>
      <pre className="p-4 overflow-x-auto no-scrollbar font-mono text-foreground/90 bg-muted/10 leading-normal">
        <code>{code}</code>
      </pre>
    </div>
  );
}

function parseInlineStyles(text: string): React.ReactNode[] {
  // Regex to capture bold (**text**), italic (*text* or _text_), links ([text](url)), and inline code (`code`)
  const regex = /(\*\*.*?\*\*|\*.*?\*|_.*?_|\[.*?\]\(.*?\)|`.*?`)/g;
  const parts = text.split(regex);

  return parts.map((part, index) => {
    // Bold
    if (part.startsWith("**") && part.endsWith("**")) {
      return (
        <strong key={index} className="font-semibold text-foreground">
          {part.slice(2, -2)}
        </strong>
      );
    }
    // Italic 1 (*text*)
    if (part.startsWith("*") && part.endsWith("*")) {
      return (
        <em key={index} className="italic text-foreground/90">
          {part.slice(1, -1)}
        </em>
      );
    }
    // Italic 2 (_text_)
    if (part.startsWith("_") && part.endsWith("_")) {
      return (
        <em key={index} className="italic text-foreground/90">
          {part.slice(1, -1)}
        </em>
      );
    }
    // Inline code (`code`)
    if (part.startsWith("`") && part.endsWith("`")) {
      return (
        <code key={index} className="font-mono bg-muted/70 px-1 py-0.5 rounded text-[11px] text-primary dark:text-primary-foreground font-medium">
          {part.slice(1, -1)}
        </code>
      );
    }
    // Markdown link: [text](url)
    if (part.startsWith("[") && part.includes("](") && part.endsWith(")")) {
      const match = part.match(/\[(.*?)\]\((.*?)\)/);
      if (match) {
        const linkText = match[1];
        const linkUrl = match[2];
        return (
          <a
            key={index}
            href={linkUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary hover:underline font-semibold"
          >
            {linkText}
          </a>
        );
      }
    }

    return part;
  });
}
