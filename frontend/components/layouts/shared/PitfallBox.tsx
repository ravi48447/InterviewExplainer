"use client";
import { AlertTriangle } from "lucide-react";

interface PitfallBoxProps {
  title?: string;
  children: React.ReactNode;
}

export function PitfallBox({ title = "Common Pitfall", children }: PitfallBoxProps) {
  return (
    <div className="rounded-lg border border-red-200 bg-red-50 p-4">
      <div className="flex items-center gap-2 mb-2">
        <AlertTriangle className="h-4 w-4 text-red-600" />
        <span className="text-xs font-bold text-red-800 uppercase tracking-wide">{title}</span>
      </div>
      <div className="text-sm text-red-900">{children}</div>
    </div>
  );
}
