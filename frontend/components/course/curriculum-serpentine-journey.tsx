"use client";

import React from "react";
import type { DomainCategory, TechStack } from "@/lib/api";
import { cn } from "@/lib/utils";
import { PillarCurveCard } from "@/components/course/pillar-curve-card";

export type CurriculumPillarRow = DomainCategory & { stacks: TechStack[] };

/** One width for the middle column and the full-height road (wider, single strip — no per-row breaks). */
const ROAD_LG = "10.5rem" as const;
const ROAD_BACKDROP: React.CSSProperties = {
  backgroundImage: "url('/road-atlas-bg.svg')",
  backgroundSize: "cover",
  backgroundPosition: "center",
  backgroundRepeat: "no-repeat",
};

function HighwayStrip({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "pointer-events-none relative h-full w-full min-h-[2.5rem] overflow-hidden rounded-xl",
        "bg-[#1a1e2a]",
        "shadow-[inset_0_0_0_1px_rgba(255,255,255,0.07),0_4px_24px_-4px_rgba(0,0,0,0.5)]",
        className,
      )}
      aria-hidden
    >
      {/* asphalt texture gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#22263a] via-[#1a1e2a] to-[#14172200]" />
      {/* left shoulder double line */}
      <div className="absolute inset-y-0 left-2.5 w-px bg-background/10" />
      <div className="absolute inset-y-0 left-3.5 w-px bg-background/6" />
      {/* right shoulder double line */}
      <div className="absolute inset-y-0 right-2.5 w-px bg-background/10" />
      <div className="absolute inset-y-0 right-3.5 w-px bg-background/6" />
      {/* centre dashed yellow lane divider */}
      <div
        className="absolute inset-y-0 left-1/2 w-[3px] -translate-x-1/2"
        style={{
          background: `repeating-linear-gradient(
            to bottom,
            rgba(251,191,36,0.75) 0 10px,
            transparent 10px 22px
          )`,
        }}
      />
      {/* subtle edge glows */}
      <div className="absolute inset-y-0 left-0 w-3 bg-gradient-to-r from-white/[0.03] to-transparent" />
      <div className="absolute inset-y-0 right-0 w-3 bg-gradient-to-l from-white/[0.03] to-transparent" />
    </div>
  );
}

function RoadStop({ n, expanded, compact }: { n: number; expanded: boolean; compact?: boolean }) {
  return (
    <div className={cn("relative z-10 flex max-w-full flex-col items-center", compact ? "pt-0" : "pt-0.5")}>
      {/* outer glow ring — only when expanded */}
      {expanded && (
        <div className={cn(
          "absolute rounded-2xl bg-amber-400/20 blur-[6px]",
          compact ? "inset-[-4px]" : "inset-[-5px]",
        )} aria-hidden />
      )}
      <div
        className={cn(
          "relative flex shrink-0 items-center justify-center rounded-2xl border-2 font-black text-primary-foreground dark:text-foreground transition-all duration-300",
          compact ? "h-10 w-10 text-xs" : "h-12 w-12 text-sm lg:h-[3.25rem] lg:w-[3.25rem] lg:text-base",
          expanded
            ? "border-amber-300/80 bg-gradient-to-br from-amber-400 via-orange-400 to-amber-500 shadow-lg shadow-amber-900/40"
            : "border-slate-600/70 bg-gradient-to-br from-slate-600 to-slate-800 shadow-md shadow-black/30",
        )}
      >
        {n}
      </div>
      {!compact ? <div className="mt-1 h-1.5 w-0.5 rounded-full bg-amber-300/25" aria-hidden /> : null}
    </div>
  );
}

function MobileLaneHaze({ toStop }: { toStop: "left" | "right" }) {
  return (
    <div
      className={cn(
        "mb-1 flex w-full min-w-0 max-w-lg items-center gap-1.5 py-0.5 sm:max-w-xl",
        toStop === "right" && "ml-auto max-w-lg flex-row-reverse",
      )}
    >
      <div
        className={cn(
          "h-1.5 min-w-0 flex-1 rounded-full bg-gradient-to-r",
          toStop === "left"
            ? "from-slate-200/0 via-violet-200/35 to-slate-600/55"
            : "from-slate-600/55 via-violet-200/35 to-slate-200/0",
        )}
      />
      <div className="h-2.5 w-7 shrink-0 overflow-hidden rounded-sm border border-slate-500/25 shadow-inner">
        <div className="h-1.5 w-full bg-gradient-to-b from-slate-500 to-slate-800" />
        <div className="h-0.5 w-full bg-amber-200/45" />
      </div>
      <div
        className={cn(
          "h-1.5 min-w-0 flex-1 rounded-full bg-gradient-to-r",
          toStop === "left"
            ? "from-slate-600/50 via-violet-200/25 to-slate-200/0"
            : "from-slate-200/0 via-violet-200/25 to-slate-600/50",
        )}
      />
    </div>
  );
}

/**
 * Pillar in left column: DOM = [ card, track, empty ] so lg grid col 1,2,3 is correct
 * and unqualified `order` is never used (it breaks grid placement).
 * Mobile: `max-lg:order-1/2` only on flex to show track above card.
 */
/** Wider track + larger column gaps + outer padding keep pillars off the “highway” */
const rowLg = cn(
  "w-full min-w-0",
  "max-lg:flex max-lg:flex-col max-lg:gap-2",
  "lg:grid lg:items-start lg:gap-x-6 xl:gap-x-8",
  "lg:grid-cols-[minmax(0,1fr)_10.5rem_minmax(0,1fr)]",
);

function CenterTrack({
  stopN,
  expanded,
  mobileHaze,
  /** When the mobile haze area already includes the stop marker (e.g. right-column rows). */
  mobileStopInHaze = false,
}: {
  stopN: number;
  expanded: boolean;
  mobileHaze: React.ReactNode;
  mobileStopInHaze?: boolean;
}) {
  return (
    <div
      className={cn(
        "relative w-full min-w-0",
        "max-lg:order-1",
        "lg:col-start-2 lg:row-start-1",
        "flex flex-col items-center justify-start self-stretch",
      )}
    >
      <div className="flex w-full min-w-0 max-w-2xl flex-col items-stretch gap-0.5 lg:max-w-none">
        {mobileHaze}
        <div
          className={cn(
            "relative z-[2] flex w-full min-w-0 min-h-[3.5rem] flex-1 flex-col items-center",
            "lg:min-h-0",
          )}
        >
          {!mobileStopInHaze ? (
            <div className="lg:hidden">
              <RoadStop n={stopN} expanded={expanded} compact />
            </div>
          ) : null}
          <div className="hidden pt-0.5 lg:block">
            <RoadStop n={stopN} expanded={expanded} />
          </div>
        </div>
      </div>
    </div>
  );
}

/**
 * Center highway (lg+): grid columns are explicit — never use unqualified `order` on
 * grid children. Road strip lives in the middle column for each row.
 */
export function CurriculumSerpentineJourney({
  categories,
  pillarRows,
  domainSlug,
  expandedPillarIds,
  onTogglePillar,
  filterActive,
}: {
  categories: DomainCategory[];
  pillarRows: CurriculumPillarRow[];
  domainSlug: string;
  expandedPillarIds: Set<number>;
  onTogglePillar: (id: number) => void;
  filterActive: boolean;
}) {
  return (
    <div
      className={cn(
        "relative rounded-[1.5rem]",
      )}
    >
      <div className="relative px-3 py-7 sm:px-4 sm:py-9 md:px-5">
        <div className="relative z-[1] mx-auto w-full min-w-0 max-w-6xl xl:max-w-7xl">
          <div
            className="relative"
            style={{ "--road-lg": ROAD_LG } as React.CSSProperties}
          >
            {/* One full-height road — not per-row (those showed gaps in the list spacing) */}
            <div
              className="pointer-events-none absolute inset-y-0 left-1/2 z-0 hidden w-[var(--road-lg)] max-w-[min(100%,var(--road-lg))] -translate-x-1/2 overflow-hidden rounded-2xl lg:block"
              aria-hidden
            >
              <HighwayStrip className="h-full" />
            </div>
            <ol className="relative z-[1] m-0 list-none space-y-5 p-0 lg:space-y-7">
            {categories.map((cat, i) => {
              const pr = pillarRows.find((p) => p.id === cat.id);
              const stacks = pr?.stacks ?? [];
              const expanded = expandedPillarIds.has(cat.id);
              const disabled = !stacks.length && filterActive;
              const isLeft = i % 2 === 0;
              const stopN = i + 1;

              const card = (
                <div className="min-w-0 max-w-full">
                  <PillarCurveCard
                    cat={cat}
                    index={i}
                    side={isLeft ? "left" : "right"}
                    domainSlug={domainSlug}
                    stacks={stacks}
                    expanded={expanded}
                    disabled={disabled}
                    filterActive={filterActive}
                    onToggle={() => onTogglePillar(cat.id)}
                    variant="premium"
                  />
                </div>
              );

              return (
                <li key={cat.id} className="m-0 list-none p-0">
                  {isLeft ? (
                    <div className={rowLg}>
                      <div
                        className={cn(
                          "min-w-0 max-w-full",
                          "max-lg:order-2 max-lg:max-w-2xl",
                          "lg:col-start-1 lg:row-start-1",
                          "lg:pr-2 lg:pl-0 xl:pr-4",
                        )}
                      >
                        {card}
                      </div>
                      <CenterTrack
                        stopN={stopN}
                        expanded={expanded}
                        mobileHaze={
                          <div className="flex w-full min-w-0 flex-col items-center gap-0.5 lg:hidden">
                            <MobileLaneHaze toStop="right" />
                          </div>
                        }
                      />
                      <div className="hidden min-h-0 min-w-0 lg:col-start-3 lg:row-start-1 lg:block" aria-hidden />
                    </div>
                  ) : (
                    <div className={rowLg}>
                      <div className="hidden min-h-0 min-w-0 lg:col-start-1 lg:row-start-1 lg:block" aria-hidden />
                      <CenterTrack
                        stopN={stopN}
                        expanded={expanded}
                        mobileStopInHaze
                        mobileHaze={
                          <div className="flex w-full min-w-0 max-w-2xl flex-col items-end gap-0.5 lg:max-w-none">
                            <div className="w-full lg:hidden">
                              <MobileLaneHaze toStop="left" />
                              <div className="flex justify-end pr-0.5">
                                <RoadStop n={stopN} expanded={expanded} compact />
                              </div>
                            </div>
                          </div>
                        }
                      />
                      <div
                        className={cn(
                          "min-w-0 max-w-full",
                          "max-lg:order-2 max-lg:ml-auto max-lg:max-w-2xl",
                          "lg:col-start-3 lg:row-start-1",
                          "lg:pl-2 lg:pr-0 xl:pl-4",
                        )}
                      >
                        {card}
                      </div>
                    </div>
                  )}
                </li>
              );
            })}
            </ol>
          </div>
        </div>
      </div>
    </div>
  );
}
