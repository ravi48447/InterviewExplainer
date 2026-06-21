"use client";
import { useState } from "react";
import { ChevronDown, ChevronUp, HelpCircle } from "lucide-react";

interface SelfCheckProps {
  questions: string[];
}

export function SelfCheck({ questions }: SelfCheckProps) {
  const [open, setOpen] = useState(false);
  return (
    <div className="rounded-lg border border-slate-200 bg-white overflow-hidden">
      <button
        onClick={() => setOpen(v => !v)}
        className="w-full flex items-center justify-between px-4 py-3 text-left hover:bg-slate-50 transition-colors"
      >
        <div className="flex items-center gap-2">
          <HelpCircle className="h-4 w-4 text-slate-500" />
          <span className="text-xs font-bold text-slate-700 uppercase tracking-wide">Quick Self-Check</span>
        </div>
        {open ? <ChevronUp className="h-4 w-4 text-slate-400" /> : <ChevronDown className="h-4 w-4 text-slate-400" />}
      </button>
      {open && (
        <div className="px-4 pb-4 space-y-2">
          {questions.map((q, i) => (
            <div key={i} className="text-sm text-slate-600 flex items-start gap-2">
              <span className="text-slate-400 mt-0.5">○</span>
              <span>{q}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
