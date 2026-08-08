"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  ArrowRight,
  BookOpen,
  ChevronRight,
  CheckCircle2,
  Circle,
  Compass,
  Folder,
  FolderOpen,
  Grid3x3,
  Layers,
  Menu,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { ListSkeleton } from "@/components/ui/skeleton";

/**
 * Pillar-scoped left navigation.
 *
 * Renders the modules that belong to a single pillar hub (e.g. `/spring`,
 * `/sre`, `/java`) as a collapsible tree. Each module expands to show its
 * topic-grouped questions, fetched on-demand from
 * `/api/content/stack-questions`.
 *
 * Replaces the legacy `ContentTreeNav` on every standalone SEO surface so
 * the sidebar reflects the *pillar's* table of contents — not the entire
 * Java backend curriculum the modules happen to live in.
 *
 * Why a separate component (vs. parameterising ContentTreeNav)?
 *   - ContentTreeNav fetches the whole domain tree (`/api/content/domain-stacks`)
 *     and groups by `category`. A pillar hub doesn't have categories — it has
 *     a flat, hand-curated module list. Re-using that component would mean
 *     loading the entire JBI tree just to filter it down to 2–6 modules,
 *     and would lose the pillar's authored ordering.
 *   - The hub-side links are SEO URLs (`/spring-boot-interview-questions/...`),
 *     not App URLs (`/{domainSlug}/{moduleSlug}/...`).
 */

interface PillarModule {
  /** SEO URL slug, e.g. "spring-boot-interview-questions" */
  seoSlug: string;
  /** App-side module slug, e.g. "spring-boot" — used for the API call */
  moduleSlug: string;
  /** Domain that physically owns the content (always JBI today) */
  domainSlug: string;
  /** Display title, e.g. "Spring Boot" */
  title: string;
}

interface QuestionRef {
  slug: string;
  title: string;
}

interface SubcategoryGroup {
  slug: string;
  name: string;
  questionCount: number;
  questions: QuestionRef[];
}

interface Props {
  /** Pillar hub display name, shown in the header. */
  pillarTitle: string;
  /** Pillar hub URL slug — the "Back to {pillar}" link target. */
  pillarSlug: string;
  /** Modules in this pillar, in display order. */
  modules: PillarModule[];
  /** Currently active module's seoSlug (auto-expanded on mount). */
  activeSeoSlug?: string;
  /** Currently active question slug (highlighted). */
  activeQuestionSlug?: string;
  /**
   * Footer link to the flagship structured track (wording varies for
   * language-agnostic topic hubs vs Java-first pillars).
   */
  structuredTrackHref?: string;
  structuredTrackCtaLabel?: string;
}

// Cross-mount cache so question→question navigation never refetches.
const _stackCache = new Map<string, SubcategoryGroup[]>();
const _stackInflight = new Map<string, Promise<SubcategoryGroup[]>>();

function moduleStackFetchKey(domainSlug: string, moduleSlug: string) {
  return `${domainSlug}::${moduleSlug}::pillarSidebarV2`;
}

function fetchModule(
  domainSlug: string,
  moduleSlug: string,
): Promise<SubcategoryGroup[]> {
  const key = moduleStackFetchKey(domainSlug, moduleSlug);
  const cached = _stackCache.get(key);
  if (cached) return Promise.resolve(cached);
  const inflight = _stackInflight.get(key);
  if (inflight) return inflight;
  const p = fetch(
    `/api/content/stack-questions?domainSlug=${domainSlug}&stackSlug=${moduleSlug}`,
  )
    .then((r) => (r.ok ? r.json() : []))
    .then((data: SubcategoryGroup[]) => {
      _stackCache.set(key, data);
      return data;
    })
    .catch(() => [] as SubcategoryGroup[])
    .finally(() => _stackInflight.delete(key));
  _stackInflight.set(key, p);
  return p;
}

export default function PillarTreeNav({
  pillarTitle,
  pillarSlug,
  modules,
  activeSeoSlug,
  activeQuestionSlug,
  structuredTrackHref = "/java-backend-intermediate",
  structuredTrackCtaLabel = "Open full roadmap",
}: Props) {
  const activeRef = useRef<HTMLAnchorElement>(null);

  const [expandedModules, setExpandedModules] = useState<Set<string>>(() =>
    activeSeoSlug ? new Set([activeSeoSlug]) : new Set(),
  );
  const [moduleData, setModuleData] = useState<
    Record<string, SubcategoryGroup[]>
  >(() => {
    const init: Record<string, SubcategoryGroup[]> = {};
    if (activeSeoSlug) {
      const m = modules.find((x) => x.seoSlug === activeSeoSlug);
      if (m) {
        const cached = _stackCache.get(moduleStackFetchKey(m.domainSlug, m.moduleSlug));
        if (cached) init[m.seoSlug] = cached;
      }
    }
    return init;
  });
  const [loadingModules, setLoadingModules] = useState<Set<string>>(new Set());
  const [expandedSubcats, setExpandedSubcats] = useState<Set<string>>(() => {
    const init = new Set<string>();
    if (activeSeoSlug) {
      const m = modules.find((x) => x.seoSlug === activeSeoSlug);
      if (m) {
        const cached = _stackCache.get(moduleStackFetchKey(m.domainSlug, m.moduleSlug));
        cached
          ?.filter((sc) => sc.questionCount > 0)
          .forEach((sc) => init.add(`${m.seoSlug}:${sc.slug}`));
      }
    }
    return init;
  });
  const [mobileOpen, setMobileOpen] = useState(false);

  const loadModule = useCallback(
    (m: PillarModule) => {
      if (moduleData[m.seoSlug] || loadingModules.has(m.seoSlug)) return;
      setLoadingModules((prev) => new Set([...prev, m.seoSlug]));
      fetchModule(m.domainSlug, m.moduleSlug)
        .then((data) => {
          setModuleData((prev) => ({ ...prev, [m.seoSlug]: data }));
          setExpandedSubcats((prev) => {
            const n = new Set(prev);
            data
              .filter((sc) => sc.questionCount > 0)
              .forEach((sc) => n.add(`${m.seoSlug}:${sc.slug}`));
            return n;
          });
        })
        .finally(() =>
          setLoadingModules((prev) => {
            const n = new Set(prev);
            n.delete(m.seoSlug);
            return n;
          }),
        );
    },
    [moduleData, loadingModules],
  );

  // Auto-load the active module on mount / when navigating.
  useEffect(() => {
    if (!activeSeoSlug) return;
    const m = modules.find((x) => x.seoSlug === activeSeoSlug);
    if (m) loadModule(m);
  }, [activeSeoSlug, modules, loadModule]);

  // Scroll active question into view after navigation.
  useEffect(() => {
    activeRef.current?.scrollIntoView({ block: "nearest", behavior: "smooth" });
  }, [activeQuestionSlug]);

  const toggleModule = (m: PillarModule) => {
    setExpandedModules((prev) => {
      const n = new Set(prev);
      if (n.has(m.seoSlug)) {
        n.delete(m.seoSlug);
      } else {
        n.add(m.seoSlug);
        loadModule(m);
      }
      return n;
    });
  };

  const toggleSubcat = (key: string) => {
    setExpandedSubcats((prev) => {
      const n = new Set(prev);
      if (n.has(key)) n.delete(key);
      else n.add(key);
      return n;
    });
  };

  // ─── Tree body ────────────────────────────────────────────────────────────
  const activeModuleTitle =
    modules.find((m) => m.seoSlug === activeSeoSlug)?.title ?? "";
  const cleanPillar = pillarTitle.replace(/\s+Interview Prep.*$/, "");

  const tree = (
    <div className="flex flex-col h-full overflow-hidden">
      {/* Header — crumbs-style so "you are here" is explicit: Pillar ▸ Module. */}
      <div className="px-4 pt-3 pb-2.5 border-b border-border shrink-0 bg-background">
        <div className="text-[10px] font-extrabold uppercase tracking-widest text-muted-foreground mb-1">
          You are here
        </div>
        <Link
          href={`/${pillarSlug}`}
          className="flex items-center gap-1.5 text-[13px] font-bold text-foreground hover:text-primary dark:text-primary transition-colors truncate"
        >
          <ArrowLeft className="h-3.5 w-3.5 shrink-0" />
          <span className="truncate">{cleanPillar}</span>
        </Link>
        {activeModuleTitle && (
          <div className="mt-1 flex items-center gap-1 text-[12px] text-muted-foreground pl-5">
            <ChevronRight className="h-3 w-3 shrink-0 text-muted-foreground" />
            <span className="font-bold text-primary dark:text-primary truncate">
              {activeModuleTitle}
            </span>
          </div>
        )}
      </div>

      {/* Full tree */}
      <div className="flex-1 overflow-y-auto py-2 px-2 space-y-0.5" aria-live="polite">
          <div className="flex items-center justify-between gap-1.5 px-2 mb-2">
            <div className="flex items-center gap-1.5">
              <Layers className="h-3.5 w-3.5 text-muted-foreground" />
              <span className="text-[10px] font-extrabold uppercase tracking-widest text-muted-foreground">
                Modules in {cleanPillar}
              </span>
            </div>
            <span className="text-[10px] font-bold text-muted-foreground">
              {modules.length}
            </span>
          </div>

          {modules.map((m) => {
            const isActiveModule = m.seoSlug === activeSeoSlug;
            const isExpanded = expandedModules.has(m.seoSlug);
            const isLoading = loadingModules.has(m.seoSlug);
            const subs = moduleData[m.seoSlug] ?? [];
            const totalQ = subs.reduce((s, sc) => s + sc.questionCount, 0);

            return (
              <div key={m.seoSlug}>
                <div
                  className={cn(
                    "flex items-center rounded-lg border-l-2 transition-colors duration-200 ease-out",
                    isActiveModule
                      ? "border-primary bg-primary/10"
                      : "border-transparent hover:border-border hover:bg-surface",
                  )}
                >
                  <Link
                    href={`/${m.seoSlug}`}
                    onClick={() => setMobileOpen(false)}
                    className="flex items-center gap-2 flex-1 min-w-0 px-2 py-2 text-left"
                  >
                    <BookOpen
                      className={cn(
                        "h-3.5 w-3.5 shrink-0",
                        isActiveModule ? "text-primary dark:text-primary" : "text-muted-foreground",
                      )}
                    />
                    <span
                      className={cn(
                        "flex-1 text-[13px] leading-tight truncate",
                        isActiveModule
                          ? "font-bold text-primary dark:text-primary"
                          : "font-semibold text-foreground",
                      )}
                    >
                      {m.title}
                    </span>
                  </Link>
                  <button
                    onClick={() => toggleModule(m)}
                    className="shrink-0 p-1.5 mr-1 rounded hover:bg-surface transition-colors"
                    aria-label={isExpanded ? "Collapse module" : "Expand module"}
                  >
                    {totalQ > 0 && (
                      <span className="text-[11px] text-muted-foreground mr-1.5">
                        {totalQ}
                      </span>
                    )}
                    {isLoading ? (
                      <span className="h-3 w-3 rounded-full border-2 border-primary/40 border-t-primary animate-spin inline-block shrink-0" />
                    ) : (
                      <ChevronRight
                        className={cn(
                          "h-3 w-3 text-muted-foreground transition-transform inline",
                          isExpanded && "rotate-90",
                        )}
                      />
                    )}
                  </button>
                </div>

                {/* Subcategories */}
                {isExpanded && subs.length > 0 && (
                  <div className="ml-4 border-l border-border pl-1 mt-0.5 mb-1 space-y-0.5">
                    {subs.map((sc) => {
                      const subKey = `${m.seoSlug}:${sc.slug}`;
                      const isExpSub = expandedSubcats.has(subKey);
                      const hasActiveQ = sc.questions.some(
                        (q) => q.slug === activeQuestionSlug,
                      );
                      const isFlat = sc.slug === "_root" && subs.length === 1;

                      if (isFlat) {
                        return (
                          <div key={sc.slug} className="space-y-0.5">
                            {sc.questions.map((q) => {
                              const isActiveQ = q.slug === activeQuestionSlug;
                              return (
                                <Link
                                  key={q.slug}
                                  href={`/${m.seoSlug}/${q.slug}`}
                                  ref={isActiveQ ? activeRef : undefined}
                                  onClick={() => setMobileOpen(false)}
                                  className={cn(
                                    "flex items-start gap-1.5 px-2 py-1.5 rounded-md text-xs leading-snug transition-colors duration-200 ease-out",
                                    isActiveQ
                                      ? "bg-primary text-primary-foreground font-bold shadow-sm"
                                      : "text-muted-foreground hover:bg-primary/10 hover:text-primary",
                                  )}
                                >
                                  <span
                                    className={cn(
                                      "mt-0.5 shrink-0",
                                      isActiveQ
                                        ? "text-primary dark:text-primary"
                                        : "text-muted-foreground",
                                    )}
                                  >
                                    {isActiveQ ? (
                                      <CheckCircle2 className="h-3 w-3" />
                                    ) : (
                                      <Circle className="h-3 w-3" />
                                    )}
                                  </span>
                                  <span className="line-clamp-2 leading-snug">
                                    {q.title}
                                  </span>
                                </Link>
                              );
                            })}
                          </div>
                        );
                      }

                      return (
                        <div key={sc.slug}>
                          <button
                            onClick={() => toggleSubcat(subKey)}
                            className={cn(
                              "w-full flex items-center gap-1.5 px-2 py-1.5 rounded-md text-xs transition-colors duration-200 ease-out",
                              hasActiveQ
                                ? "bg-primary/10 text-primary font-bold"
                                : "text-muted-foreground hover:bg-surface font-semibold",
                            )}
                          >
                            {isExpSub ? (
                              <FolderOpen className="h-3 w-3 shrink-0 text-primary dark:text-primary" />
                            ) : (
                              <Folder className="h-3 w-3 shrink-0 text-muted-foreground" />
                            )}
                            <span className="flex-1 text-left truncate">
                              {sc.name}
                            </span>
                            <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-primary/10 text-primary dark:text-primary shrink-0">
                              {sc.questionCount}
                            </span>
                            <ChevronRight
                              className={cn(
                                "h-2.5 w-2.5 text-muted-foreground transition-transform shrink-0",
                                isExpSub && "rotate-90",
                              )}
                            />
                          </button>

                          {isExpSub && (
                            <div className="ml-3 border-l border-border pl-1 space-y-0.5 mt-0.5 mb-1">
                              {sc.questions.map((q) => {
                                const isActiveQ = q.slug === activeQuestionSlug;
                                return (
                                  <Link
                                    key={q.slug}
                                    href={`/${m.seoSlug}/${q.slug}`}
                                    ref={isActiveQ ? activeRef : undefined}
                                    onClick={() => setMobileOpen(false)}
                                    className={cn(
                                      "flex items-start gap-1.5 px-2 py-1.5 rounded-md text-xs leading-snug transition-colors duration-200 ease-out",
                                      isActiveQ
                                        ? "bg-primary text-primary-foreground font-bold shadow-sm"
                                        : "text-muted-foreground hover:bg-primary/10 hover:text-primary",
                                    )}
                                  >
                                    <span
                                      className={cn(
                                        "mt-0.5 shrink-0",
                                        isActiveQ
                                          ? "text-primary dark:text-primary"
                                          : "text-muted-foreground",
                                      )}
                                    >
                                      {isActiveQ ? (
                                        <CheckCircle2 className="h-3 w-3" />
                                      ) : (
                                        <Circle className="h-3 w-3" />
                                      )}
                                    </span>
                                    <span className="line-clamp-2 leading-snug">
                                      {q.title}
                                    </span>
                                  </Link>
                                );
                              })}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}

                {isExpanded && isLoading && subs.length === 0 && (
                  <div className="ml-6 py-2">
                    <ListSkeleton rows={3} />
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Footer — discovery rail. Always visible so a visitor reading any
            standalone page (pillar hub / module landing / question) can hop
            into the structured Java backend roadmap or browse other
            interview-prep categories without scrolling the article body. */}
        <div className="shrink-0 border-t border-border bg-surface/80 px-3 py-3 space-y-1.5">
          <Link
            href={structuredTrackHref}
            onClick={() => setMobileOpen(false)}
            className="group flex items-center gap-2 px-2 py-1.5 rounded-md hover:bg-background hover:shadow-sm transition-colors duration-200 ease-out"
          >
            <Compass className="h-3.5 w-3.5 text-primary dark:text-primary shrink-0" />
            <span className="flex-1 text-[12px] font-bold text-foreground group-hover:text-primary dark:group-hover:text-primary leading-tight">
              {structuredTrackCtaLabel}
            </span>
            <ArrowRight className="h-3 w-3 text-muted-foreground group-hover:text-primary dark:group-hover:text-primary transition-colors duration-200 ease-out" />
          </Link>
          <Link
            href="/prep"
            onClick={() => setMobileOpen(false)}
            className="group flex items-center gap-2 px-2 py-1.5 rounded-md hover:bg-background hover:shadow-sm transition-colors duration-200 ease-out"
          >
            <Grid3x3 className="h-3.5 w-3.5 text-primary dark:text-primary shrink-0" />
            <span className="flex-1 text-[12px] font-bold text-foreground group-hover:text-primary dark:group-hover:text-primary leading-tight">
              Browse all categories
            </span>
            <ArrowRight className="h-3 w-3 text-muted-foreground group-hover:text-primary dark:group-hover:text-primary transition-colors duration-200 ease-out" />
          </Link>
        </div>
    </div>
  );

  return (
    <>
      {/* Desktop — fills its parent container; the *parent* decides width,
          background, and stickiness so this component can be dropped into
          the pillar hub layout, the SEO module landing layout, and the
          question-page sidebar slot without nesting double borders. */}
      <div className="hidden lg:flex flex-col h-full w-full overflow-hidden">
        {tree}
      </div>

      {/* Mobile FAB */}
      <button
        onClick={() => setMobileOpen(true)}
        className="lg:hidden fixed bottom-6 left-4 z-[var(--z-fixed)] w-12 h-12 rounded-full bg-primary text-primary-foreground shadow-xl flex items-center justify-center hover:bg-primary/90 active:scale-95 transition-colors duration-200 ease-out touch-target focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
        aria-label="Open navigation"
      >
        <Menu className="h-5 w-5" />
      </button>

      {/* Mobile drawer */}
      {mobileOpen && (
        <div className="lg:hidden fixed inset-0 z-[var(--z-drawer)] flex">
          <div
            className="absolute inset-0 bg-foreground /40 backdrop-blur-sm"
            onClick={() => setMobileOpen(false)}
          />
          <aside className="relative z-10 w-[300px] bg-background shadow-2xl flex flex-col h-full overflow-hidden">
            <div className="flex items-center justify-between px-4 py-3 border-b border-border shrink-0">
              <span className="text-sm font-bold text-foreground">
                Navigation
              </span>
              <button
                onClick={() => setMobileOpen(false)}
                className="p-1.5 rounded-lg hover:bg-surface transition-colors touch-target focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
                aria-label="Close navigation"
              >
                <X className="h-4 w-4 text-muted-foreground" />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto">{tree}</div>
          </aside>
        </div>
      )}
    </>
  );
}
