/**
 * Phase 14 — Curriculum V2 role page for non-curriculum interview tracks
 * (ruby, business-analyst, data-analyst). Hoisted from the per-role pages.
 */

import Link from "next/link";
import { ChevronRight, ArrowLeft, Sparkles } from "lucide-react";
import type { RolePageData } from "@/lib/curriculum";

const ACCENT_BG: Record<string, string> = {
  rose: "bg-rose-100 dark:bg-rose-950/20 text-rose-600 dark:text-rose-400",
  amber: "bg-amber-100 dark:bg-amber-950/20 text-amber-600 dark:text-amber-400",
  teal: "bg-teal-100 dark:bg-teal-950/20 text-teal-600 dark:text-teal-400",
};

const ACCENT_BORDER: Record<string, string> = {
  rose: "border-rose-200 dark:border-rose-500/20",
  amber: "border-amber-200 dark:border-amber-500/20",
  teal: "border-teal-200 dark:border-teal-500/20",
};

export function RolePage({ data }: { data: RolePageData }) {
  const { slug, title, eyebrow, description, topics, accent } = data;
  const accentBg = ACCENT_BG[accent] ?? ACCENT_BG.rose;
  const accentBorder = ACCENT_BORDER[accent] ?? ACCENT_BORDER.rose;

  return (
    <div className="min-h-screen bg-surface border border-default dark:from-slate-950 font-sans text-foreground selection:bg-blue-200">
      <div className="max-w-4xl mx-auto px-6 py-12">
        <nav className="flex items-center gap-2 text-xs text-muted-foreground mb-8">
          <Link href="/interview" className="inline-flex items-center gap-1.5 font-bold uppercase tracking-wider hover:text-primary dark:text-primary transition-colors">
            <ArrowLeft className="h-3 w-3" />
            All Interview Tracks
          </Link>
        </nav>

        <div className="mb-10">
          <span className={`inline-block text-[10px] font-bold uppercase tracking-widest px-3 py-1.5 rounded-lg border shadow-sm ${accentBg} ${accentBorder} mb-4`}>
            {eyebrow}
          </span>
          <h1 className="text-4xl font-black tracking-tight text-foreground mb-4">{title}</h1>
          <p className="text-base text-foreground leading-relaxed max-w-2xl">{description}</p>
        </div>

        <div className="space-y-3">
          <div className="flex items-center gap-2 mb-2">
            <Sparkles className={`h-4 w-4 ${accentBg.split(" ").find((c) => c.startsWith("text-"))}`} />
            <h2 className="text-xs font-bold text-foreground uppercase tracking-wide">Topics &amp; Areas</h2>
          </div>
          {topics.map((topic) => (
            <div key={topic.name} className={`flex items-center justify-between p-4 rounded-xl border ${accentBorder} bg-surface-subtle shadow-sm`}>
              <div className="flex items-start gap-3 min-w-0">
                {topic.emoji && <span className="text-xl leading-none mt-0.5">{topic.emoji}</span>}
                <div className="min-w-0">
                  <h3 className="text-sm font-bold text-foreground leading-tight">{topic.name}</h3>
                  {topic.desc && <p className="text-xs text-muted-foreground leading-relaxed mt-1">{topic.desc}</p>}
                </div>
              </div>
              <span className={`text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-md ${accentBg} ${accentBorder} border shrink-0 ml-3`}>
                Coming Soon
              </span>
            </div>
          ))}
        </div>

        <div className="mt-12 pt-8 border-t border-default dark:border-default/20">
          <Link href="/interview" className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-muted-foreground hover:text-primary dark:text-primary transition-colors">
            <ChevronRight className="h-3.5 w-3.5 rotate-180" />
            Back to all interview tracks
          </Link>
        </div>
      </div>
    </div>
  );
}
