import Link from "next/link";
import {
  BookOpen,
  Check,
  ChevronRight,
  GraduationCap,
  Target,
} from "lucide-react";
import type { DSAModule } from "@/lib/contentV2-types";
import { cn } from "@/lib/utils";

interface DSACurriculumNavProps {
  modules: DSAModule[];
  /** Slugs of modules that have an authored learn/index.json. */
  learnSlugs: Set<string>;
  /** Slug of the currently active module — gets highlighted + auto-scrolled. */
  activeModuleSlug: string;
}

const LEVEL_DOT: Record<string, string> = {
  beginner: "bg-success",
  intermediate: "bg-amber-500 dark:bg-amber-400",
  advanced: "bg-rose-500 dark:bg-rose-400",
};

/**
 * Left-rail curriculum navigator for all 18 DSA modules.
 *
 * Rendered on /dsa/module/<slug> so learners always know
 *   (a) where they are in the sequence,
 *   (b) which modules have full theory (BookOpen icon) vs practice-only,
 *   (c) the difficulty level at a glance (coloured dot).
 *
 * Token-driven: the active module uses the primary accent, the number
 * badge uses `bg-primary` / `bg-surface`, and the level dots ride the
 * success/amber/rose warmth axis consistent with the difficulty pills.
 */
export function DSACurriculumNav({
  modules,
  learnSlugs,
  activeModuleSlug,
}: DSACurriculumNavProps) {
  return (
    <nav
      aria-label="DSA curriculum"
      className="rounded-lg border border-border/60 bg-card shadow-sm overflow-hidden"
    >
      <Link
        href="/dsa"
        className="flex items-center gap-2 px-4 py-3 border-b border-border bg-surface hover:bg-hover transition-colors group"
      >
        <div className="w-7 h-7 rounded-lg bg-primary flex items-center justify-center shrink-0">
          <GraduationCap className="h-4 w-4 text-primary-foreground" />
        </div>
        <div className="min-w-0 flex-1">
          <div className="text-[10px] font-black uppercase tracking-widest text-primary">
            DSA Curriculum
          </div>
          <div className="text-[12px] font-bold text-foreground truncate">
            {modules.length} modules
          </div>
        </div>
        <ChevronRight className="h-3.5 w-3.5 text-muted-foreground group-hover:text-primary shrink-0 transition-colors" />
      </Link>

      <ol className="py-1 max-h-[calc(100vh-7rem)] overflow-y-auto">
        {modules.map((m) => {
          const isActive = m.moduleSlug === activeModuleSlug;
          const hasTheory = learnSlugs.has(m.moduleSlug);
          const levelDot = LEVEL_DOT[m.level] ?? LEVEL_DOT.intermediate;

          return (
            <li key={m.moduleSlug}>
              <Link
                href={`/dsa/module/${m.moduleSlug}`}
                className={cn(
                  "group flex items-start gap-2 px-3 py-2 border-l-2 transition-colors",
                  isActive
                    ? "bg-primary/5 border-primary"
                    : "border-transparent hover:bg-hover hover:border-border",
                )}
                aria-current={isActive ? "page" : undefined}
              >
                <span className="shrink-0 w-7 flex items-center justify-center pt-0.5">
                  <span
                    className={cn(
                      "text-[10px] font-black tabular-nums px-1.5 py-0.5 rounded",
                      isActive
                        ? "bg-primary text-primary-foreground"
                        : "bg-surface text-muted-foreground group-hover:bg-hover",
                    )}
                  >
                    {m.moduleNumber.replace(/^M/, "")}
                  </span>
                </span>
                <div className="min-w-0 flex-1">
                  <div
                    className={cn(
                      "text-[12.5px] leading-snug",
                      isActive
                        ? "font-black text-primary"
                        : "font-semibold text-foreground group-hover:text-foreground",
                    )}
                  >
                    {m.title}
                  </div>
                  <div className="mt-0.5 flex items-center gap-1.5 text-[10px]">
                    <span
                      className={cn("h-1.5 w-1.5 rounded-full", levelDot)}
                      aria-hidden="true"
                    />
                    <span className="text-muted-foreground font-medium capitalize">
                      {m.level}
                    </span>
                    {hasTheory && (
                      <span
                        className="ml-auto inline-flex items-center gap-0.5 text-primary font-bold"
                        title="Full theory walk-through authored"
                      >
                        <BookOpen className="h-2.5 w-2.5" />
                      </span>
                    )}
                  </div>
                </div>
              </Link>
            </li>
          );
        })}
      </ol>

      <Link
        href="/dsa"
        className="flex items-center gap-2 px-4 py-2.5 border-t border-border bg-surface hover:bg-hover transition-colors text-[11px] font-bold text-muted-foreground hover:text-foreground"
      >
        <Target className="h-3.5 w-3.5 text-muted-foreground" />
        <span>All tracks &amp; sheets</span>
        <Check className="h-3 w-3 text-success ml-auto" />
      </Link>
    </nav>
  );
}
