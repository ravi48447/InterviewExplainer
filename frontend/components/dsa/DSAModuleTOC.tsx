"use client";

import { useEffect, useState } from "react";
import { List, Target, BookOpen, Clock, Zap } from "lucide-react";
import { cn } from "@/lib/utils";

interface TOCItem {
  id: string;
  label: string;
  kind?: "theory" | "practice" | "extras";
}

interface DSAModuleTOCProps {
  /** Ordered list of anchor targets on the page. Pass the same list the page
   * renders so the TOC never drifts from the actual headings. */
  items: TOCItem[];
  /** Optional meta shown at the top of the rail. */
  meta?: {
    level?: string;
    focus?: string;
    problemCount?: number;
    theoryCount?: number;
  };
}

/**
 * Right-rail "On this page" navigation for /dsa/module/<slug>.
 *
 * - Uses IntersectionObserver to highlight the currently-visible section.
 * - Token-driven active state uses the primary accent instead of the old
 *   blue-500/blue-50 ad-hoc palette.
 */
export function DSAModuleTOC({ items, meta }: DSAModuleTOCProps) {
  const [active, setActive] = useState<string | null>(items[0]?.id ?? null);

  useEffect(() => {
    if (items.length === 0 || typeof window === "undefined") return;

    const els = items
      .map((i) => document.getElementById(i.id))
      .filter((e): e is HTMLElement => !!e);

    if (els.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort(
            (a, b) =>
              a.target.getBoundingClientRect().top -
              b.target.getBoundingClientRect().top,
          );
        if (visible[0]) setActive(visible[0].target.id);
      },
      {
        rootMargin: "-80px 0px -60% 0px",
        threshold: 0.01,
      },
    );
    els.forEach((e) => observer.observe(e));
    return () => observer.disconnect();
  }, [items]);

  if (items.length === 0) return null;

  return (
    <div className="space-y-4">
      {meta && (
        <div className="rounded-lg border border-border/60 bg-card shadow-sm overflow-hidden">
          <div className="flex items-center gap-2 px-4 py-2.5 bg-surface border-b border-border">
            <Zap className="h-3.5 w-3.5 text-primary" />
            <span className="text-[11px] font-black uppercase tracking-widest text-foreground">
              Overview
            </span>
          </div>
          <dl className="px-4 py-3 space-y-1.5 text-[12px]">
            {meta.level && (
              <div className="flex items-center justify-between gap-3">
                <dt className="text-muted-foreground font-medium">Level</dt>
                <dd className="font-bold text-foreground capitalize">
                  {meta.level}
                </dd>
              </div>
            )}
            {meta.focus && (
              <div className="flex items-center justify-between gap-3">
                <dt className="text-muted-foreground font-medium">Focus</dt>
                <dd className="font-bold text-foreground capitalize">
                  {meta.focus}
                </dd>
              </div>
            )}
            {typeof meta.theoryCount === "number" && (
              <div className="flex items-center justify-between gap-3">
                <dt className="text-muted-foreground font-medium flex items-center gap-1.5">
                  <BookOpen className="h-3 w-3 text-primary" />
                  Theory sections
                </dt>
                <dd className="font-bold text-foreground tabular-nums">
                  {meta.theoryCount}
                </dd>
              </div>
            )}
            {typeof meta.problemCount === "number" && (
              <div className="flex items-center justify-between gap-3">
                <dt className="text-muted-foreground font-medium flex items-center gap-1.5">
                  <Target className="h-3 w-3 text-primary" />
                  Practice problems
                </dt>
                <dd className="font-bold text-foreground tabular-nums">
                  {meta.problemCount}
                </dd>
              </div>
            )}
          </dl>
        </div>
      )}

      <nav
        aria-label="On this page"
        className="rounded-lg border border-border/60 bg-card shadow-sm overflow-hidden"
      >
        <div className="flex items-center gap-2 px-4 py-2.5 bg-surface border-b border-border">
          <List className="h-3.5 w-3.5 text-muted-foreground" />
          <span className="text-[11px] font-black uppercase tracking-widest text-muted-foreground">
            On this page
          </span>
        </div>
        <ul className="py-1.5">
          {items.map((it) => (
            <li key={it.id}>
              <a
                href={`#${it.id}`}
                className={cn(
                  "block pl-4 pr-3 py-1.5 text-[12.5px] leading-snug border-l-2 transition-colors",
                  active === it.id
                    ? "border-primary bg-primary/5 text-primary font-bold"
                    : "border-transparent text-muted-foreground hover:text-foreground hover:border-border hover:bg-hover",
                )}
              >
                {it.label}
              </a>
            </li>
          ))}
        </ul>
        <div className="flex items-center gap-1.5 px-4 py-2 border-t border-border bg-surface text-[10px] text-muted-foreground">
          <Clock className="h-2.5 w-2.5" />
          Scroll to jump to a section
        </div>
      </nav>
    </div>
  );
}
