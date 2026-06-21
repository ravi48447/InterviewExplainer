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
    <div className="rounded-xl border border-slate-200 overflow-hidden">
      <div className="flex items-center gap-1 px-3 py-2 bg-slate-50 border-b border-slate-200">
        {(["split", "before", "after"] as const).map(m => (
          <button
            key={m}
            onClick={() => setMode(m)}
            className={`px-3 py-1 rounded text-xs font-medium transition-colors ${
              mode === m ? "bg-white shadow-sm text-slate-800" : "text-slate-500 hover:text-slate-700"
            }`}
          >
            {m === "split" ? "Side by Side" : m === "before" ? beforeLabel : afterLabel}
          </button>
        ))}
      </div>
      <div className={`${mode === "split" ? "grid grid-cols-2 divide-x divide-slate-200" : ""}`}>
        {(mode === "split" || mode === "before") && (
          <div className="p-4">
            <div className="text-[11px] font-bold text-red-600 uppercase tracking-wide mb-2 flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-red-500 inline-block" />
              {beforeLabel}
            </div>
            <MarkdownContent content={before} />
          </div>
        )}
        {(mode === "split" || mode === "after") && (
          <div className="p-4">
            <div className="text-[11px] font-bold text-emerald-600 uppercase tracking-wide mb-2 flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block" />
              {afterLabel}
            </div>
            <MarkdownContent content={after} />
          </div>
        )}
      </div>
    </div>
  );
}
