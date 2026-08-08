"use client";
import { Sparkles } from "lucide-react";

interface InterviewSignalProps {
  title?: string;
  children: React.ReactNode;
}

export function InterviewSignal({ title = "Interview Signal", children }: InterviewSignalProps) {
  return (
    <div className="rounded-lg border border-blue-200 dark:border-blue-500/20 bg-gradient-to-r from-blue-50 dark:from-blue-950/40  p-4  ">
      <div className="flex items-center gap-2 mb-2">
        <Sparkles className="h-4 w-4 text-blue-600 dark:text-blue-400" />
        <span className="text-xs font-bold text-blue-800 dark:text-blue-400 uppercase tracking-wide">{title}</span>
      </div>
      <div className="text-sm text-foreground">{children}</div>
    </div>
  );
}
