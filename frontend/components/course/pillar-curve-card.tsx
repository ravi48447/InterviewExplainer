"use client";

import Link from "next/link";
import { BookOpen, ChevronDown, Clock, Layers } from "lucide-react";
import type { DomainCategory, TechStack } from "@/lib/api";
import { cn } from "@/lib/utils";

export function PillarCurveCard({
  cat,
  index,
  side,
  domainSlug,
  stacks,
  expanded,
  disabled,
  filterActive,
  onToggle,
  variant = "standard",
}: {
  cat: DomainCategory;
  index: number;
  side: "left" | "right";
  domainSlug: string;
  stacks: TechStack[];
  expanded: boolean;
  disabled: boolean;
  filterActive: boolean;
  onToggle: () => void;
  variant?: "standard" | "premium";
}) {
  const totalQ = stacks.reduce((s, st) => s + st.questionCount, 0);
  const totalQAll = cat.stacks.reduce((s, st) => s + st.questionCount, 0);
  const isRight = side === "right";

  return (
    <div className={cn("min-w-0", disabled && "pointer-events-none opacity-35")}>
      <div
        className={cn(
          "group relative overflow-hidden rounded-2xl border bg-background transition-all duration-300",
          expanded
            ? "border-default dark:border-default/20 shadow-[0_8px_40px_-12px_rgba(245,158,11,0.18)]"
            : "border-border shadow-[0_2px_16px_-4px_rgba(15,23,42,0.08)] hover:border-default dark:border-default/20 hover:shadow-[0_6px_28px_-8px_rgba(245,158,11,0.12)]",
        )}
      >
        {/* top accent bar */}
        <div className={cn(
          "h-[3px] w-full bg-surface border border-default transition-opacity duration-300",
          expanded ? "opacity-100" : "opacity-0 group-hover:opacity-40",
        )} />

        {/* card header button */}
        <button
          type="button"
          disabled={disabled}
          onClick={onToggle}
          aria-expanded={expanded}
          className={cn(
            "relative flex w-full items-center gap-4 px-5 py-4 text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-ring/60 sm:px-6 sm:py-5",
            isRight ? "sm:flex-row-reverse" : "",
          )}
        >
          {/* pillar number badge */}
          <span
            className={cn(
              "flex h-12 w-12 shrink-0 items-center justify-center rounded-xl text-[15px] font-black text-foreground shadow-md transition-all duration-200",
              expanded
                ? "bg-surface border border-default shadow-sm group-hover:scale-105"
                : "bg-surface border border-default group-hover:bg-hover",
            )}
          >
            {index + 1}
          </span>

          {/* text block */}
          <span className={cn("min-w-0 flex-1", isRight && "sm:text-right")}>
            <span className={cn(
              "block text-[10px] font-bold uppercase tracking-[0.22em]",
              expanded ? "text-amber-500 dark:text-amber-400" : "text-muted-foreground",
            )}>
              Pillar {index + 1}
            </span>
            <span className="mt-1 block text-[18px] font-bold leading-snug tracking-tight text-foreground sm:text-[19px]">
              {cat.name}
            </span>
            <span className={cn(
              "mt-2.5 flex flex-wrap items-center gap-2 text-[11px]",
              isRight && "sm:justify-end",
            )}>
              <span className="inline-flex items-center gap-1 rounded-full border border-sky-200 dark:border-sky-500/20 bg-sky-50 dark:bg-sky-500/10 px-2.5 py-0.5 font-semibold tabular-nums text-sky-700 dark:text-sky-400">
                <Layers className="h-3 w-3" />
                {cat.stacks.length} modules
              </span>
              <span className="inline-flex items-center gap-1 rounded-full border border-default dark:border-default/20 bg-amber-50 dark:bg-amber-500/10 px-2.5 py-0.5 font-semibold text-amber-700 dark:text-amber-400">
                <Clock className="h-3 w-3" />
                {totalQAll} questions
              </span>
            </span>
          </span>

          {/* chevron */}
          <span
            className={cn(
              "flex h-8 w-8 shrink-0 items-center justify-center rounded-full border-2 transition-all duration-200",
              expanded
                ? "border-default dark:border-default/30 bg-amber-50 dark:bg-amber-500/10 text-amber-600 dark:text-amber-400"
                : "border-border bg-background text-muted-foreground group-hover:border-border",
              isRight && "sm:order-first",
            )}
          >
            <ChevronDown
              className={cn("h-4 w-4 transition-transform duration-200", expanded && "rotate-180")}
              strokeWidth={2.5}
            />
          </span>
        </button>

        {/* expandable modules list */}
        <div className={cn(
          "grid transition-[grid-template-rows] duration-300 ease-out",
          expanded ? "grid-rows-[1fr]" : "grid-rows-[0fr]",
        )}>
          <div className="min-h-0 overflow-hidden">
            <div className={cn(
              "max-h-[min(65vh,26rem)] overflow-y-auto border-t px-4 py-4 sm:px-5 bg-surface",
              expanded ? "border-default dark:border-default/20" : "border-transparent",
            )}>
              {stacks.length === 0 ? (
                <p className="rounded-xl border border-dashed border-border bg-surface/50 px-3 py-6 text-center text-[11px] text-muted-foreground">
                  No modules match your filter.
                </p>
              ) : (
                <ul className="space-y-1.5">
                  {stacks.map((stack, i) => (
                    <li key={stack.id} className="list-none">
                      <Link
                        href={`/${domainSlug}/${stack.slug}`}
                        className="group/link flex items-center gap-3 overflow-hidden rounded-xl border border-border/70 bg-background p-3 shadow-sm transition-all hover:border-default dark:border-default/20 hover:shadow-[0_4px_16px_-4px_rgba(245,158,11,0.15)] sm:p-3.5"
                      >
                        <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-surface border border-default text-[11px] font-black text-foreground shadow-sm">
                          {String(i + 1).padStart(2, "0")}
                        </span>
                        <span className="min-w-0 flex-1">
                          <span className="block truncate text-[13px] font-semibold text-foreground group-hover/link:text-amber-700 dark:text-amber-400">
                            {stack.name}
                          </span>
                          {stack.description && (
                            <span className="mt-0.5 line-clamp-1 text-[11px] text-muted-foreground">
                              {stack.description}
                            </span>
                          )}
                        </span>
                        <span className="flex shrink-0 items-center gap-1 rounded-full bg-surface px-2 py-0.5 text-[11px] font-semibold text-muted-foreground">
                          <Clock className="h-3 w-3" />
                          {stack.questionCount}
                        </span>
                        <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg border border-default dark:border-default/20 bg-amber-50 dark:bg-amber-500/10 text-amber-600 dark:text-amber-400 transition-all group-hover/link:scale-110 group-hover/link:bg-amber-100 dark:bg-amber-950/30">
                          <BookOpen className="h-3.5 w-3.5" strokeWidth={2} />
                        </span>
                      </Link>
                    </li>
                  ))}
                </ul>
              )}
              <p className="mt-3 text-center text-[10px] text-muted-foreground">
                {filterActive
                  ? <><strong className="text-muted-foreground">{totalQ}</strong> matching &middot; <strong className="text-muted-foreground">{totalQAll}</strong> total</>
                  : <>{totalQAll} questions across this pillar</>
                }
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
