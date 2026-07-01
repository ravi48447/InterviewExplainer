"use client";

import { useState } from "react";
import { Copy, Check } from "lucide-react";

export function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard API unavailable — silently fail
    }
  };

  return (
    <button
      onClick={handleCopy}
      className="flex items-center gap-2 px-4 py-2 bg-background border-2 border-emerald-300 dark:border-emerald-500/30 hover:bg-emerald-50 dark:bg-emerald-500/10 rounded-lg text-xs font-bold text-foreground hover:text-emerald-900 dark:text-emerald-400 transition-all shadow-sm"
    >
      {copied ? <Check className="h-4 w-4 text-emerald-600 dark:text-emerald-400" /> : <Copy className="h-4 w-4" />}
      {copied ? "Copied!" : "Copy to Clipboard"}
    </button>
  );
}
