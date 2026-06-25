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
  beginner: "bg-emerald-500",
  intermediate: "bg-amber-500",
  advanced: "bg-rose-500",
};

/**
 * Left-rail curriculum navigator for all 18 DSA modules.
 *
 * Rendered sticky on /dsa/module/<slug> so learners always know
 *   (a) where they are in the sequence,
 *   (b) which modules have full theory (BookOpen icon) vs practice-only,
 *   (c) the difficulty level at a glance (coloured dot).
 *
 * The nav is keyboard-navigable (plain anchors) and the active module is
 * styled with a left indigo bar + bold title so screen-readers and sighted
 * users both see the current position without extra aria-current clutter.
 */
export function DSACurriculumNav({
  modules,
  learnSlugs,
  activeModuleSlug,
}: DSACurriculumNavProps) {
  return (
    <nav
      aria-label="DSA curriculum"
      className="rounded-xl border border-border bg-background shadow-sm overflow-hidden"
    >
      <Link
        href="/dsa"
        className="flex items-center gap-2 px-4 py-3 border-b border-border bg-gradient-to-r from-violet-50 via-indigo-50 to-blue-50 hover:from-violet-100/80 hover:via-indigo-100/80 hover:to-blue-100/80 transition-colors group"
      >
        <div className="w-7 h-7 rounded-lg bg-violet-600 flex items-center justify-center shrink-0">
          <GraduationCap className="h-4 w-4 text-primary-foreground dark:text-foreground" />
        </div>
        <div className="min-w-0 flex-1">
          <div className="text-[10px] font-black uppercase tracking-widest text-violet-700">
            DSA Curriculum
          </div>
          <div className="text-[12px] font-bold text-foreground truncate">
            {modules.length} modules
          </div>
        </div>
        <ChevronRight className="h-3.5 w-3.5 text-slate-400 group-hover:text-violet-500 shrink-0" />
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
                    ? "bg-violet-50 border-violet-500"
                    : "border-transparent hover:bg-surface hover:border-border",
                )}
                aria-current={isActive ? "page" : undefined}
              >
                <span className="shrink-0 w-7 flex items-center justify-center pt-0.5">
                  <span
                    className={cn(
                      "text-[10px] font-black tabular-nums px-1.5 py-0.5 rounded",
                      isActive
                        ? "bg-violet-600 text-primary-foreground dark:text-foreground"
                        : "bg-surface text-muted-foreground group-hover:bg-slate-200",
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
                        ? "font-black text-violet-900"
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
                    <span className="text-slate-400 font-medium capitalize">
                      {m.level}
                    </span>
                    {hasTheory && (
                      <span
                        className="ml-auto inline-flex items-center gap-0.5 text-blue-600 font-bold"
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
        className="flex items-center gap-2 px-4 py-2.5 border-t border-border bg-surface/70 hover:bg-surface transition-colors text-[11px] font-bold text-secondary hover:text-foreground"
      >
        <Target className="h-3.5 w-3.5 text-slate-400" />
        <span>All tracks &amp; sheets</span>
        <Check className="h-3 w-3 text-emerald-500 ml-auto" />
      </Link>
    </nav>
  );
}
