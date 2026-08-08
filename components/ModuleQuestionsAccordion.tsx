"use client";

import { useState, useMemo, useEffect } from "react";
import Link from "next/link";
import {
  BookOpen,
  ChevronRight,
  ChevronDown,
  Layers,
  Clock,
  List,
  ChevronsDown,
  ChevronsUp,
} from "lucide-react";
import { cn } from "@/lib/utils";
import {
  difficultyColor,
  difficultyLabel,
  type StackSubcategory,
  type QuestionSummary,
  type ModuleRevision,
} from "@/lib/api";
import { ModuleRevisionPanel } from "@/components/ModuleRevisionPanel";

/**
 * Topic-grouped question list for a single module.
 *
 * - `card` — collapsible module shell (pillar / multi-module pages).
 * - `inline` — topic groups only; no outer collapse (SEO module landings).
 * Includes expand/collapse-all for topics when there are 2+ groups.
 *
 * If a `revision` prop is supplied (one per module, from
 * `_revision.json`), it renders as a synthetic FIRST topic ("Revision —
 * read me first") above the regular topic groups. The actual interview
 * topics are sorted curriculum-first, with `scenario-based` always pushed
 * to the end so learners drill fundamentals before applied scenarios.
 */

const REVISION_GROUP_SLUG = "__revision__";

function withScenarioLast(groups: StackSubcategory[]): StackSubcategory[] {
  const main: StackSubcategory[] = [];
  const tail: StackSubcategory[] = [];
  for (const g of groups) {
    if (g.slug === "scenario-based" || g.slug === "scenario_based") tail.push(g);
    else main.push(g);
  }
  return [...main, ...tail];
}

interface Props {
  seoSlug: string;
  moduleTitle: string;
  pillarLabel?: string;
  /** From `getSubcategoriesWithQuestions`. Topic groups (no per-topic theory). */
  groups: StackSubcategory[];
  /** Optional module-level revision sheet — rendered as the first topic. */
  revision?: ModuleRevision | null;
  totalQuestions: number;
  accentIndex?: number;
  defaultOpen?: boolean;
  /** `inline` = full question list always visible (no module-level collapse). */
  variant?: "card" | "inline";
  /**
   * When true (default for `inline`), each row gets `id="q-{slug}"` and a
   * global reading-order index (Q1…Qn) across topic groups. Deep links and
   * the right rail use `/{seoSlug}#q-{slug}`.
   */
  readingOrderAnchors?: boolean;
}

const ACCENT_COLORS = [
  "from-blue-500 to-blue-600",
  "from-teal-500 to-teal-600",
  "from-blue-400 to-blue-500",
  "from-orange-500 to-orange-600",
  "from-rose-500 to-rose-600",
  "from-sky-500 to-sky-600",
];

export default function ModuleQuestionsAccordion({
  seoSlug,
  moduleTitle,
  pillarLabel,
  groups,
  revision,
  totalQuestions,
  accentIndex = 0,
  defaultOpen = true,
  variant = "card",
  readingOrderAnchors,
}: Props) {
  const isInline = variant === "inline";
  const anchorsOn = readingOrderAnchors ?? isInline;
  const [moduleOpen, setModuleOpen] = useState<boolean>(defaultOpen);
  const [closedGroups, setClosedGroups] = useState<Set<string>>(new Set());

  const accent = ACCENT_COLORS[accentIndex % ACCENT_COLORS.length];

  // Curriculum order with `scenario-based` pushed last (interviewers ask it
  // last, and we want learners to drill fundamentals before scenario answers).
  const orderedGroups = useMemo(() => withScenarioLast(groups), [groups]);

  const hasRevision = !!revision && revision.sections.length > 0;

  const groupSlugs = useMemo(
    () => [
      ...(hasRevision ? [REVISION_GROUP_SLUG] : []),
      ...orderedGroups.map((g) => g.slug),
    ],
    [orderedGroups, hasRevision],
  );

  const toggleGroup = (slug: string) =>
    setClosedGroups((prev) => {
      const n = new Set(prev);
      if (n.has(slug)) n.delete(slug);
      else n.add(slug);
      return n;
    });

  const expandAllTopics = () => setClosedGroups(new Set());
  const collapseAllTopics = () => setClosedGroups(new Set(groupSlugs));

  const allTopicsExpanded =
    groups.length === 0 ||
    groupSlugs.every((slug) => !closedGroups.has(slug));

  /** Expand the topic that contains a `q-` hash target so deep links always reveal the row. */
  useEffect(() => {
    if (!anchorsOn || typeof window === "undefined") return;
    const syncFromHash = () => {
      const raw = window.location.hash.replace(/^#/, "");
      if (!raw.startsWith("q-")) return;
      const slug = raw.slice(2);
      const groupWith = groups.find((g) =>
        g.questions.some((q) => q.slug === slug),
      );
      if (!groupWith) return;
      setClosedGroups((prev) => {
        if (!prev.has(groupWith.slug)) return prev;
        const next = new Set(prev);
        next.delete(groupWith.slug);
        return next;
      });
    };
    syncFromHash();
    window.addEventListener("hashchange", syncFromHash);
    return () => window.removeEventListener("hashchange", syncFromHash);
  }, [anchorsOn, groups]);

  let runningGlobal = 0;

  const topicToolbar =
    groups.length > 1 ? (
      <div className="flex flex-wrap items-center justify-between gap-2 px-1 pb-2">
        <span className="text-[11px] font-semibold text-muted-foreground inline-flex items-center gap-1.5">
          <List className="h-3.5 w-3.5" aria-hidden />
          {allTopicsExpanded ? "All topics expanded" : "Some topics collapsed"}
        </span>
        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={expandAllTopics}
            className="inline-flex items-center gap-1 rounded-md border border-border bg-background px-2 py-1 text-[11px] font-bold text-foreground hover:border-default dark:border-default hover:bg-blue-50 dark:bg-blue-500/10 hover:text-primary dark:text-primary transition-colors"
          >
            <ChevronsDown className="h-3.5 w-3.5" aria-hidden />
            Expand all
          </button>
          <button
            type="button"
            onClick={collapseAllTopics}
            className="inline-flex items-center gap-1 rounded-md border border-border bg-background px-2 py-1 text-[11px] font-bold text-foreground hover:border-border hover:bg-surface transition-colors"
          >
            <ChevronsUp className="h-3.5 w-3.5" aria-hidden />
            Collapse all
          </button>
        </div>
      </div>
    ) : null;

  const groupsBlock = (
    <div className="border-t border-slate-100 dark:border-slate-800/60 bg-gradient-to-b from-slate-50/90 dark:from-slate-950/40 to-slate-50/30 dark:to-slate-950/40 px-3 sm:px-4 py-4 space-y-2.5  ">
      {topicToolbar}

      {/*
        Revision row: synthetic first "topic" backed by the module's
        `_revision.json`. Sits above the real topics so learners skim the
        concept refresher before drilling questions.
      */}
      {hasRevision && revision && (() => {
        const isClosed = closedGroups.has(REVISION_GROUP_SLUG);
        return (
          <div
            key={REVISION_GROUP_SLUG}
            id={REVISION_GROUP_SLUG}
            className="rounded-xl border border-default dark:border-default/90 bg-background overflow-hidden shadow-sm ring-1 ring-ring/[0.04]"
          >
            <button
              type="button"
              onClick={() => toggleGroup(REVISION_GROUP_SLUG)}
              className="w-full flex items-center gap-3 px-4 py-2.5 bg-surface to-white hover: transition-colors text-left  "
            >
              <span className="text-[11px] font-black text-primary dark:text-primary shrink-0 tabular-nums">00</span>
              <span className="flex min-w-0 flex-1 flex-wrap items-center gap-2 text-sm font-bold text-foreground">
                <BookOpen className="h-3.5 w-3.5 text-primary dark:text-primary shrink-0" />
                <span className="truncate">Revision</span>
                <span className="truncate rounded border border-default dark:border-default/20 bg-blue-50 dark:bg-blue-500/10 px-1.5 py-0 text-[9px] font-black uppercase tracking-wider text-primary dark:text-primary">
                  Read me first
                </span>
              </span>
              <span className="text-[11px] font-bold px-2 py-0.5 rounded-md bg-blue-100 dark:bg-blue-950/20 text-primary dark:text-primary shrink-0">
                {revision.sections.length}
              </span>
              <ChevronDown
                className={cn(
                  "h-4 w-4 text-primary dark:text-primary transition-transform shrink-0",
                  isClosed && "-rotate-90",
                )}
              />
            </button>
            {!isClosed && (
              <ModuleRevisionPanel
                revision={revision}
                stackLabel={moduleTitle}
                className="border-t border-default dark:border-default/20"
              />
            )}
          </div>
        );
      })()}

      {orderedGroups.map((g, gIdx) => {
        const isClosed = closedGroups.has(g.slug);
        return (
          <div
            key={g.slug}
            id={g.slug}
            className="rounded-xl border border-border/90 bg-background overflow-hidden shadow-sm scroll-mt-24 ring-1 ring-slate-900/[0.02]"
          >
            <button
              type="button"
              onClick={() => toggleGroup(g.slug)}
              className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-surface transition-colors text-left"
            >
              <span className="text-[11px] font-black text-muted-foreground shrink-0">
                {String(gIdx + 1).padStart(2, "0")}
              </span>
              <span className="flex min-w-0 flex-1 flex-wrap items-center gap-2 text-sm font-bold text-foreground">
                <span className="truncate">{g.name}</span>
              </span>
              <span className="text-[11px] font-bold px-2 py-0.5 rounded-md bg-blue-50 dark:bg-blue-500/10 text-primary dark:text-primary shrink-0">
                {g.questionCount}
              </span>
              <ChevronDown
                className={cn(
                  "h-4 w-4 text-muted-foreground transition-transform shrink-0",
                  isClosed && "-rotate-90",
                )}
              />
            </button>

            {!isClosed && (
              <ol className="divide-y divide-slate-100 dark:divide-slate-800/60 border-t border-slate-100 dark:border-slate-800/60">
                {g.questions.map((q: QuestionSummary, qIdx) => {
                  runningGlobal += 1;
                  const globalN = runningGlobal;
                  return (
                  <li
                    key={q.slug}
                    id={anchorsOn ? `q-${q.slug}` : undefined}
                    className={anchorsOn ? "scroll-mt-28" : undefined}
                  >
                    <Link
                      href={`/${seoSlug}/${q.slug}`}
                      className="group flex items-center gap-3 px-4 py-2.5 hover:bg-gradient-to-r hover: hover:to-transparent transition-colors  "
                    >
                      {anchorsOn ? (
                        <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg dark:bg-surface text-[11px] font-bold text-white tabular-nums shadow-sm group-hover:bg-blue-600 dark:bg-blue-800 transition-colors">
                          {globalN}
                        </span>
                      ) : (
                        <span className="w-6 h-6 rounded-md bg-surface flex items-center justify-center text-[10px] font-black text-muted-foreground shrink-0 group-hover:bg-blue-100 dark:bg-blue-950/20 group-hover:text-primary dark:group-hover:text-primary transition-colors">
                          {String(qIdx + 1).padStart(2, "0")}
                        </span>
                      )}
                      <span className="flex-1 min-w-0">
                        <span className="block text-[13.5px] font-semibold text-foreground group-hover:text-primary dark:group-hover:text-primary transition-colors leading-snug">
                          {q.title}
                        </span>
                        {anchorsOn && g.questionCount > 1 && (
                          <span className="mt-0.5 block text-[11px] text-muted-foreground">
                            In this topic: {qIdx + 1} of {g.questionCount}
                          </span>
                        )}
                      </span>
                      {q.difficulty && (
                        <span
                          className="hidden sm:inline-flex text-[9px] font-bold uppercase tracking-widest px-1.5 py-0.5 rounded text-white shadow-sm shrink-0"
                          style={{
                            backgroundColor: difficultyColor(q.difficulty),
                          }}
                        >
                          {difficultyLabel(q.difficulty)}
                        </span>
                      )}
                      {q.estimatedReadTime != null && (
                        <span className="hidden md:inline-flex items-center gap-1 text-[11px] font-medium text-muted-foreground min-w-[40px] shrink-0">
                          <Clock className="w-3 h-3 text-muted-foreground" />
                          {q.estimatedReadTime || 5}m
                        </span>
                      )}
                      <ChevronRight className="h-3.5 w-3.5 text-muted-foreground group-hover:text-primary dark:group-hover:text-primary group-hover:translate-x-0.5 transition-all shrink-0" />
                    </Link>
                  </li>
                  );
                })}
              </ol>
            )}
          </div>
        );
      })}
    </div>
  );

  if (isInline) {
    return (
      <div className="rounded-2xl border border-border/90 bg-background shadow-md shadow-slate-200/40 overflow-hidden ring-1 ring-slate-900/[0.03]">
        <div className="px-4 sm:px-5 py-4 border-b border-slate-100 dark:border-slate-800/60 bg-gradient-to-r from-white via-slate-50/60 dark:via-slate-950/40  flex flex-wrap items-center justify-between gap-3  ">
          <div className="min-w-0">
            <div className="text-[10px] font-bold uppercase tracking-[0.18em] text-primary dark:text-primary mb-0.5">
              Full catalog · reading order
            </div>
            <div className="text-base font-bold tracking-tight text-foreground">
              {moduleTitle}
            </div>
            <p className="mt-1 max-w-xl text-[13px] leading-relaxed text-muted-foreground">
              Numbers <span className="font-semibold text-foreground">1–{totalQuestions}</span>{" "}
              follow the order we recommend — click any row to open the full answer,
              or use the sticky <span className="font-semibold text-foreground">Next</span>{" "}
              link at the bottom of each page to go Q1 → Q{totalQuestions}.
            </p>
            <div className="mt-2 flex flex-wrap items-center gap-3 text-[12px] text-muted-foreground">
              <span className="inline-flex items-center gap-1">
                <BookOpen className="h-3.5 w-3.5 text-primary dark:text-primary" />
                <span className="font-bold text-foreground">{totalQuestions}</span>{" "}
                questions
              </span>
              <span className="text-muted-foreground">·</span>
              <span className="inline-flex items-center gap-1">
                <Layers className="h-3.5 w-3.5 text-primary dark:text-primary" />
                <span className="font-bold text-foreground">{groups.length}</span> topics
              </span>
            </div>
          </div>
        </div>
        {groupsBlock}
      </div>
    );
  }

  return (
    <div
      className={cn(
        "rounded-xl border bg-background shadow-sm overflow-hidden transition-shadow",
        moduleOpen
          ? "border-border shadow-md"
          : "border-border hover:shadow-md",
      )}
    >
      <button
        type="button"
        onClick={() => setModuleOpen((v) => !v)}
        className="w-full flex items-stretch text-left group"
      >
        <div className={cn("shrink-0 w-1.5 bg-gradient-to-b", accent)} />
        <div className="flex-1 min-w-0 px-5 py-4 flex items-center gap-3">
          <div className="flex-1 min-w-0">
            {pillarLabel && (
              <div className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-0.5">
                {pillarLabel}
              </div>
            )}
            <h3 className="text-base md:text-lg font-black text-foreground group-hover:text-primary dark:group-hover:text-primary transition-colors leading-snug">
              {moduleTitle}
            </h3>
            <div className="mt-1 flex items-center gap-3 text-[12px] text-muted-foreground">
              <span className="inline-flex items-center gap-1">
                <BookOpen className="h-3 w-3" />
                <span className="font-bold text-foreground">{totalQuestions}</span>{" "}
                questions
              </span>
              <span className="inline-flex items-center gap-1">
                <Layers className="h-3 w-3" />
                <span className="font-bold text-foreground">{groups.length}</span> topics
              </span>
            </div>
          </div>
          <Link
            href={`/${seoSlug}`}
            onClick={(e) => e.stopPropagation()}
            className="hidden sm:inline-flex shrink-0 items-center gap-1 px-3 py-1.5 rounded-md bg-background border border-border text-primary dark:text-primary text-[11px] font-bold uppercase tracking-wider hover:border-default dark:border-default hover:bg-blue-50 dark:bg-blue-500/10 transition-colors"
          >
            Open module
            <ChevronRight className="h-3.5 w-3.5" />
          </Link>
          <div
            className={cn(
              "w-8 h-8 rounded-full border flex items-center justify-center transition-all shrink-0",
              moduleOpen
                ? "border-default dark:border-default bg-blue-50 dark:bg-blue-500/10 text-primary dark:text-primary"
                : "border-border bg-background text-muted-foreground group-hover:border-default dark:border-default group-hover:text-primary dark:group-hover:text-primary",
            )}
          >
            <ChevronDown
              className={cn(
                "h-4 w-4 transition-transform duration-300",
                moduleOpen && "rotate-180",
              )}
            />
          </div>
        </div>
      </button>

      {moduleOpen && groupsBlock}
    </div>
  );
}
