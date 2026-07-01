"use client";
import { Sparkles } from "lucide-react";

interface InterviewSignalProps {
  title?: string;
  children: React.ReactNode;
}

export function InterviewSignal({ title = "Interview Signal", children }: InterviewSignalProps) {
  return (
    <div className="rounded-lg border border-violet-200 dark:border-violet-500/20 bg-gradient-to-r from-violet-50 to-purple-50 p-4 dark:from-background dark:to-background/50">
      <div className="flex items-center gap-2 mb-2">
        <Sparkles className="h-4 w-4 text-violet-600 dark:text-violet-400" />
        <span className="text-xs font-bold text-violet-800 dark:text-violet-400 uppercase tracking-wide">{title}</span>
      </div>
      <div className="text-sm text-foreground">{children}</div>
    </div>
  );
}
