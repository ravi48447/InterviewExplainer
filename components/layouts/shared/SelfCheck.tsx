"use client";
import { useState } from "react";
import { ChevronDown, ChevronUp, HelpCircle } from "lucide-react";

interface SelfCheckProps {
  questions: string[];
}

export function SelfCheck({ questions }: SelfCheckProps) {
  const [open, setOpen] = useState(false);
  return (
    <div className="rounded-lg border border-border bg-background overflow-hidden">
      <button
        onClick={() => setOpen(v => !v)}
        className="w-full flex items-center justify-between px-4 py-3 text-left hover:bg-surface transition-colors"
      >
        <div className="flex items-center gap-2">
          <HelpCircle className="h-4 w-4 text-muted-foreground" />
          <span className="text-xs font-bold text-foreground uppercase tracking-wide">Quick Self-Check</span>
        </div>
        {open ? <ChevronUp className="h-4 w-4 text-muted-foreground" /> : <ChevronDown className="h-4 w-4 text-muted-foreground" />}
      </button>
      {open && (
        <div className="px-4 pb-4 space-y-2">
          {questions.map((q, i) => (
            <div key={i} className="text-sm text-muted-foreground flex items-start gap-2">
              <span className="text-muted-foreground mt-0.5">○</span>
              <span>{q}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
