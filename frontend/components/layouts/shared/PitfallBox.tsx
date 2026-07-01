"use client";
import { AlertTriangle } from "lucide-react";

interface PitfallBoxProps {
  title?: string;
  children: React.ReactNode;
}

export function PitfallBox({ title = "Common Pitfall", children }: PitfallBoxProps) {
  return (
    <div className="rounded-lg border border-red-200 dark:border-red-500/20 bg-red-50 dark:bg-red-500/10 p-4">
      <div className="flex items-center gap-2 mb-2">
        <AlertTriangle className="h-4 w-4 text-red-600 dark:text-red-400" />
        <span className="text-xs font-bold text-red-800 dark:text-red-400 uppercase tracking-wide">{title}</span>
      </div>
      <div className="text-sm text-red-900 dark:text-red-400">{children}</div>
    </div>
  );
}
