"use client";
import { useState } from "react";
import MarkdownContent from "@/components/MarkdownContent";

interface DiffViewerProps {
  before: string;
  after: string;
  beforeLabel?: string;
  afterLabel?: string;
}

export function DiffViewer({
  before,
  after,
  beforeLabel = "Before (Problem)",
  afterLabel  = "After (Fixed)",
}: DiffViewerProps) {
  const [mode, setMode] = useState<"split" | "before" | "after">("split");

  return (
    <div className="rounded-xl border border-border overflow-hidden">
      <div className="flex items-center gap-1 px-3 py-2 bg-surface border-b border-border">
        {(["split", "before", "after"] as const).map(m => (
          <button
            key={m}
            onClick={() => setMode(m)}
            className={`px-3 py-1 rounded text-xs font-medium transition-colors ${
              mode === m ? "bg-background shadow-sm text-foreground" : "text-muted-foreground hover:text-foreground"
            }`}
          >
            {m === "split" ? "Side by Side" : m === "before" ? beforeLabel : afterLabel}
          </button>
        ))}
      </div>
      <div className={`${mode === "split" ? "grid grid-cols-2 divide-x divide-slate-200" : ""}`}>
        {(mode === "split" || mode === "before") && (
          <div className="p-4">
            <div className="text-[11px] font-bold text-red-600 dark:text-red-400 uppercase tracking-wide mb-2 flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-red-500 dark:bg-red-800 inline-block" />
              {beforeLabel}
            </div>
            <MarkdownContent content={before} />
          </div>
        )}
        {(mode === "split" || mode === "after") && (
          <div className="p-4">
            <div className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wide mb-2 flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-emerald-500 dark:bg-emerald-800 inline-block" />
              {afterLabel}
            </div>
            <MarkdownContent content={after} />
          </div>
        )}
      </div>
    </div>
  );
}
