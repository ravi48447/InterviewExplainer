"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  ChevronRight, FolderOpen, Folder, BookOpen,
  Circle, CheckCircle2, Layers, PanelLeftClose,
  PanelLeftOpen, ArrowLeft, Menu, X,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { ListSkeleton } from "@/components/ui/skeleton";

// ─── Types ────────────────────────────────────────────────────────────────────

interface Question {
  id: number;
  slug: string;
  title: string;
  difficulty?: string;
  estimatedReadTime?: number;
}

interface Subcategory {
  slug: string;
  name: string;
  questionCount: number;
  questions: Question[];
}

interface Stack {
  id: number;
  slug: string;
  name: string;
  questionCount: number;
}

interface Category {
  id: number;
  slug: string;
  name: string;
  stacks: Stack[];
}

interface Props {
  domainSlug: string;
  activeStackSlug: string;
  activeQuestionSlug?: string;
}

// ── Module-level caches ──────────────────────────────────────────────────────
//
// This component unmounts and remounts on every question-to-question
// navigation (the question page is the granular unit in the Next.js app
// router), which means React state is lost each time. Without an external
// cache the component would refetch `/api/content/domain-stacks` and
// `/api/content/stack-questions` on every single click, blocking the whole
// app behind Turbopack's dev-mode recompilation of those API routes.
//
// Caching here survives remounts for the lifetime of the browser tab.
const _treeCategoriesCache = new Map<string, Category[]>();
const _treeStackCache = new Map<string, Subcategory[]>();
const _treeCategoriesInflight = new Map<string, Promise<Category[]>>();
const _treeStackInflight = new Map<string, Promise<Subcategory[]>>();

function fetchCategories(domainSlug: string): Promise<Category[]> {
  const cached = _treeCategoriesCache.get(domainSlug);
  if (cached) return Promise.resolve(cached);
  const inflight = _treeCategoriesInflight.get(domainSlug);
  if (inflight) return inflight;
  const p = fetch(`/api/content/domain-stacks?domainSlug=${domainSlug}`)
    .then(r => (r.ok ? r.json() : { categories: [] }))
    .then((data: { categories?: Category[] }) => {
      const cats = data.categories ?? [];
      _treeCategoriesCache.set(domainSlug, cats);
      return cats;
    })
    .catch(() => [] as Category[])
    .finally(() => {
      _treeCategoriesInflight.delete(domainSlug);
    });
  _treeCategoriesInflight.set(domainSlug, p);
  return p;
}

function fetchStack(
  domainSlug: string,
  stackSlug: string,
): Promise<Subcategory[]> {
  const key = `${domainSlug}::${stackSlug}::sidebarV2`;
  const cached = _treeStackCache.get(key);
  if (cached) return Promise.resolve(cached);
  const inflight = _treeStackInflight.get(key);
  if (inflight) return inflight;
  const p = fetch(
    `/api/content/stack-questions?domainSlug=${domainSlug}&stackSlug=${stackSlug}`,
  )
    .then(r => (r.ok ? r.json() : []))
    .then((data: Subcategory[]) => {
      _treeStackCache.set(key, data);
      return data;
    })
    .catch(() => [] as Subcategory[])
    .finally(() => {
      _treeStackInflight.delete(key);
    });
  _treeStackInflight.set(key, p);
  return p;
}

// ─── Main component ──────────────────────────────────────────────────────────

export default function ContentTreeNav({
  domainSlug,
  activeStackSlug,
  activeQuestionSlug,
}: Props) {
  const pathname = usePathname();
  const router = useRouter();
  const activeRef = useRef<HTMLAnchorElement>(null);

  // Sidebar link prefetching is intentionally DISABLED in dev.
  //
  // Context: an earlier version prefetched question RSC payloads on hover
  // (debounced) to make clicks feel instant. In production that works great,
  // but in Next 16's Turbopack dev mode every uncompiled route is a 5-60
  // second cold compile, and each prefetched URL joins the compile queue.
  // When a user swept or lingered over several links, the dev server ended
  // up CPU-pegged at 400%+ for minutes and the user's actual click got
  // stuck behind all the speculative compiles.
  //
  // We still rely on Next's built-in prev/next <Link prefetch> in
  // QuestionPageLayout, which only prefetches two known routes per page.
  // The noop functions below keep the call sites unchanged so we can flip
  // prefetching back on for prod without touching JSX.
  const prefetchLink = useCallback((_href: string) => {
    // no-op in dev — see comment above
  }, []);
  const cancelPrefetch = useCallback(() => {
    // no-op — see comment above
  }, []);
  void router;

  // Seed synchronously from the module cache so the very first render of
  // subsequent navigations is already populated — no loading flash.
  const [categories, setCategories] = useState<Category[]>(
    () => _treeCategoriesCache.get(domainSlug) ?? [],
  );
  const [expandedCats, setExpandedCats] = useState<Set<string>>(() => {
    const cats = _treeCategoriesCache.get(domainSlug);
    const activeCat = cats?.find(c =>
      c.stacks.some(s => s.slug === activeStackSlug),
    );
    return new Set(activeCat ? [activeCat.slug] : []);
  });
  const [expandedStacks, setExpandedStacks] = useState<Set<string>>(new Set([activeStackSlug]));
  const [expandedSubcats, setExpandedSubcats] = useState<Set<string>>(() => {
    const seeded = _treeStackCache.get(`${domainSlug}::${activeStackSlug}`);
    if (!seeded) return new Set();
    return new Set(
      seeded
        .filter(sc => sc.questionCount > 0)
        .map(sc => `${activeStackSlug}:${sc.slug}`),
    );
  });
  const [stackData, setStackData] = useState<Record<string, Subcategory[]>>(
    () => {
      const seeded = _treeStackCache.get(`${domainSlug}::${activeStackSlug}`);
      return seeded ? { [activeStackSlug]: seeded } : {};
    },
  );
  const [loadingStacks, setLoadingStacks] = useState<Set<string>>(new Set());
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  // ── Resize logic ──────────────────────────────────────────────────────────
  const [sidebarWidth, setSidebarWidth] = useState(360);
  const isResizing = useRef(false);
  const startX = useRef(0);
  const startWidth = useRef(0);

  const handleResizeStart = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    isResizing.current = true;
    startX.current = e.clientX;
    startWidth.current = sidebarWidth;
    document.body.style.cursor = "col-resize";
    document.body.style.userSelect = "none";
  }, [sidebarWidth]);

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      if (!isResizing.current) return;
      const delta = e.clientX - startX.current;
      setSidebarWidth(Math.min(520, Math.max(200, startWidth.current + delta)));
    };
    const onUp = () => {
      if (!isResizing.current) return;
      isResizing.current = false;
      document.body.style.cursor = "";
      document.body.style.userSelect = "";
    };
    document.addEventListener("mousemove", onMove);
    document.addEventListener("mouseup", onUp);
    return () => {
      document.removeEventListener("mousemove", onMove);
      document.removeEventListener("mouseup", onUp);
    };
  }, []);
  const totalStacks = categories.reduce((sum, c) => sum + c.stacks.length, 0);
  const totalQuestions = categories.reduce(
    (sum, c) => sum + c.stacks.reduce((s, st) => s + st.questionCount, 0),
    0,
  );

  // ── Load categories + stacks ─────────────────────────────────────────────
  useEffect(() => {
    let cancelled = false;
    fetchCategories(domainSlug).then(cats => {
      if (cancelled) return;
      setCategories(cats);
      const activeCat = cats.find(c => c.stacks.some(s => s.slug === activeStackSlug));
      if (activeCat) setExpandedCats(prev => (prev.has(activeCat.slug) ? prev : new Set([...prev, activeCat.slug])));
    });
    return () => {
      cancelled = true;
    };
  }, [domainSlug, activeStackSlug]);

  // ── Load questions for a stack (lazy, cached) ─────────────────────────────
  const loadStack = useCallback((stackSlug: string) => {
    if (stackData[stackSlug] || loadingStacks.has(stackSlug)) return;
    setLoadingStacks(prev => new Set([...prev, stackSlug]));
    fetchStack(domainSlug, stackSlug)
      .then(data => {
        setStackData(prev => ({ ...prev, [stackSlug]: data }));
        const toExpand = data
          .filter(sc => sc.questionCount > 0)
          .map(sc => `${stackSlug}:${sc.slug}`);
        setExpandedSubcats(prev => new Set([...prev, ...toExpand]));
      })
      .finally(() =>
        setLoadingStacks(prev => { const n = new Set(prev); n.delete(stackSlug); return n; })
      );
  }, [domainSlug, stackData, loadingStacks]);

  // ── Auto-load + expand the active stack ───────────────────────────────────
  useEffect(() => {
    loadStack(activeStackSlug);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeStackSlug, domainSlug]);

  // ── Scroll active question into view ──────────────────────────────────────
  useEffect(() => {
    activeRef.current?.scrollIntoView({ behavior: "smooth", block: "nearest" });
  }, [pathname]);

  // Close mobile drawer when navigating
  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  // ── Toggle helpers ────────────────────────────────────────────────────────
  const toggleCat = (slug: string) =>
    setExpandedCats(prev => {
      const n = new Set(prev);
      n.has(slug) ? n.delete(slug) : n.add(slug);
      return n;
    });

  const toggleStack = (slug: string) => {
    setExpandedStacks(prev => {
      const n = new Set(prev);
      if (n.has(slug)) {
        n.delete(slug);
      } else {
        n.add(slug);
        loadStack(slug);
      }
      return n;
    });
  };

  const toggleSubcat = (key: string) =>
    setExpandedSubcats(prev => {
      const n = new Set(prev);
      n.has(key) ? n.delete(key) : n.add(key);
      return n;
    });

  // ── Render tree content ───────────────────────────────────────────────────
  const treeContent = (
    <div className="flex flex-col h-full overflow-hidden">
      {/* Header */}
      <div className="shrink-0 border-b border-border/80 bg-background z-[var(--z-sticky)]">
        <div className="flex items-center justify-between gap-2 px-4 py-3">
          <Link
            href={`/${domainSlug}`}
            className="flex items-center gap-1.5 text-sm font-bold text-muted-foreground hover:text-primary dark:text-primary transition-colors truncate"
          >
            <ArrowLeft className="h-4 w-4 shrink-0" />
            {!collapsed && <span className="truncate">Back to roadmap</span>}
          </Link>
          <button
            onClick={() => setCollapsed(c => !c)}
            title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
            aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
            className="touch-target shrink-0 p-1.5 rounded-lg hover:bg-surface transition-colors duration-200 ease-out text-muted-foreground hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            {collapsed
              ? <PanelLeftOpen className="h-4 w-4" />
              : <PanelLeftClose className="h-4 w-4" />}
          </button>
        </div>
        {!collapsed && (
          <div className="px-4 pb-3">
            <p className="text-[10px] font-extrabold uppercase tracking-[0.18em] text-muted-foreground">
              Curriculum Navigator
            </p>
            <div className="mt-2 flex items-center gap-2 text-[11px]">
              <span className="rounded-md border border-border dark:bg-surface px-2 py-1 font-bold text-muted-foreground">
                {totalStacks} modules
              </span>
              <span className="rounded-md border border-primary/30 bg-primary/10 px-2 py-1 font-bold text-primary">
                {totalQuestions} questions
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Collapsed mini-strip */}
      {collapsed && (
        <div className="flex flex-col items-center gap-2 py-3 overflow-y-auto flex-1">
          {categories.flatMap(cat =>
            cat.stacks.map(stack => (
              <Link
                key={stack.slug}
                href={`/${domainSlug}/${stack.slug}`}
                title={stack.name}
                className={cn(
                  "w-8 h-8 rounded-lg flex items-center justify-center transition-colors",
                  stack.slug === activeStackSlug
                    ? "bg-primary text-primary-foreground"
                    : "bg-surface text-muted-foreground hover:bg-primary/10 hover:text-primary"
                )}
              >
                <BookOpen className="h-4 w-4" />
              </Link>
            ))
          )}
        </div>
      )}

      {/* Full tree */}
      {!collapsed && (
        <div className="flex-1 overflow-y-auto py-2 px-2 space-y-1.5">
          {categories.map((cat, catIdx) => {
            const isCatOpen = expandedCats.has(cat.slug);
            const hasCatActive = cat.stacks.some(s => s.slug === activeStackSlug);

            return (
              <div key={cat.slug} className="mb-2">
                {/* ── Category / Pillar header ── */}
                <button
                  onClick={() => toggleCat(cat.slug)}
                  className={cn(
                    "w-full flex items-center gap-3 px-3 py-3 rounded-xl transition-colors duration-200 ease-out",
                    hasCatActive
                      ? "bg-surface border border-default text-warning dark:text-warning ring-1 ring-ring/50 shadow-sm"
                      : "bg-surface text-muted-foreground hover:bg-hover hover:text-foreground border border-border/50"
                  )}
                >
                  {/* Pillar number badge */}
                  <span className={cn(
                    "shrink-0 w-7 h-7 rounded-lg flex items-center justify-center text-[12px] font-extrabold",
                    hasCatActive ? "bg-warning/20 text-foreground" : "bg-muted text-muted-foreground"
                  )}>
                    {catIdx + 1}
                  </span>
                  <span className="flex-1 text-left text-[14px] font-extrabold leading-snug truncate tracking-tight">{cat.name}</span>
                  <span className={cn(
                    "text-[11px] font-bold px-1.5 py-0.5 rounded shrink-0",
                    hasCatActive ? "bg-warning/20 text-foreground" : "bg-hover text-muted-foreground"
                  )}>
                    {cat.stacks.length}
                  </span>
                  <ChevronRight className={cn(
                    "h-4 w-4 shrink-0 transition-transform duration-200",
                    isCatOpen && "rotate-90",
                    hasCatActive ? "text-warning dark:text-warning" : "text-muted-foreground"
                  )} />
                </button>

                {/* ── Stacks ── */}
                {isCatOpen && (
                  <div className="ml-1 mt-1.5 space-y-0.5 border-l-2 border-border pl-3">
                    {cat.stacks.map(stack => {
                      const isActiveStack = stack.slug === activeStackSlug;
                      const isExpStack = expandedStacks.has(stack.slug);
                      const isLoadingStack = loadingStacks.has(stack.slug);
                      const subs = stackData[stack.slug] ?? [];

                      return (
                        <div key={stack.slug}>
                          {/* Stack row */}
                          <div className={cn(
                            "flex items-center rounded-lg transition-colors duration-200 ease-out",
                            isActiveStack
                              ? "bg-primary/10 ring-1 ring-ring/50"
                              : "hover:bg-hover"
                          )}>
                            <button
                              onClick={() => toggleStack(stack.slug)}
                              className="flex items-center gap-2 flex-1 min-w-0 px-2.5 py-2.5 text-left"
                            >
                              {/* Active indicator bar */}
                              <div className={cn(
                                "w-1 h-5 rounded-full shrink-0",
                                isActiveStack ? "bg-primary" : "bg-transparent"
                              )} />
                              <span className={cn(
                                "flex-1 text-[13px] leading-tight truncate",
                                isActiveStack ? "font-bold text-primary dark:text-primary" : "font-semibold text-muted-foreground hover:text-muted-foreground"
                              )}>
                                {stack.name}
                              </span>
                              <span className={cn(
                                "text-[11px] shrink-0 mr-1 px-1.5 py-0.5 rounded font-bold",
                                isActiveStack ? "bg-primary/20 text-primary" : "text-muted-foreground"
                              )}>
                                {stack.questionCount}
                              </span>
                              {isLoadingStack ? (
                                <span className="h-3 w-3 rounded-full border-2 border-primary/40 border-t-primary animate-spin shrink-0" />
                              ) : (
                                <ChevronRight className={cn(
                                  "h-3.5 w-3.5 transition-transform duration-200 shrink-0",
                                  isExpStack && "rotate-90",
                                  isActiveStack ? "text-primary dark:text-primary" : "text-muted-foreground"
                                )} />
                              )}
                            </button>
                          </div>

                          {/* ── Subcategories / Questions ── */}
                          {isExpStack && subs.length > 0 && (() => {
                            const isFlatStack = subs.length === 1 && subs[0].slug === '_root';
                            const flatQuestions = isFlatStack ? subs[0].questions : [];

                            if (isFlatStack) {
                              return (
                                <div className="ml-3 border-l border-border pl-2 mt-1 mb-1 space-y-0.5">
                                  {flatQuestions.map(q => {
                                    const isActiveQ = q.slug === activeQuestionSlug;
                                    const qHref = `/${domainSlug}/${stack.slug}/${q.slug}`;
                                    return (
                                      <Link
                                        key={q.slug}
                                        href={qHref}
                                        ref={isActiveQ ? activeRef : undefined}
                                        onClick={() => setMobileOpen(false)}
                                        onMouseEnter={() => prefetchLink(qHref)}
                                        onMouseLeave={cancelPrefetch}
                                        onFocus={() => prefetchLink(qHref)}
                                        onBlur={cancelPrefetch}
                                        className={cn(
                                          "flex items-start gap-1.5 px-2 py-1.5 rounded-md text-[12px] leading-snug transition-colors duration-200 ease-out",
                                          isActiveQ
                                            ? "bg-success text-success-foreground font-bold shadow-sm ring-1 ring-ring"
                                            : "text-muted-foreground hover:bg-hover hover:text-foreground"
                                        )}
                                      >
                                        <span className={cn("mt-0.5 shrink-0", isActiveQ ? "text-success-foreground" : "text-muted-foreground")}>
                                          {isActiveQ ? <CheckCircle2 className="h-3 w-3" /> : <Circle className="h-3 w-3" />}
                                        </span>
                                        <span className="line-clamp-2 leading-snug">{q.title}</span>
                                      </Link>
                                    );
                                  })}
                                </div>
                              );
                            }

                            return (
                              <div className="ml-3 border-l border-border pl-2 mt-1 mb-1 space-y-0.5">
                                {subs.map(sc => {
                                  const subcatKey = `${stack.slug}:${sc.slug}`;
                                  const isExpSubcat = expandedSubcats.has(subcatKey);
                                  const hasActiveQ = sc.questions.some(
                                    q => q.slug === activeQuestionSlug
                                  );

                                  return (
                                    <div key={sc.slug}>
                                      <button
                                        onClick={() => toggleSubcat(subcatKey)}
                                        className={cn(
                                          "w-full flex items-center gap-1.5 px-2 py-2 rounded-md text-[12.5px] transition-colors duration-200 ease-out",
                                          hasActiveQ
                                            ? "bg-warning/20 text-warning dark:text-warning font-bold ring-1 ring-ring/40"
                                            : "text-muted-foreground hover:bg-hover font-semibold hover:text-foreground"
                                        )}
                                      >
                                        {isExpSubcat
                                          ? <FolderOpen className="h-3.5 w-3.5 shrink-0 text-warning dark:text-warning" />
                                          : <Folder className="h-3.5 w-3.5 shrink-0 text-muted-foreground" />}
                                        <span className="flex-1 text-left truncate">{sc.name}</span>
                                        <span className="text-[11px] font-bold px-1.5 py-0.5 rounded bg-warning/20 text-warning dark:text-warning shrink-0">
                                          {sc.questionCount}
                                        </span>
                                        <ChevronRight
                                          className={cn(
                                            "h-3 w-3 text-muted-foreground transition-transform duration-200 shrink-0",
                                            isExpSubcat && "rotate-90"
                                          )}
                                        />
                                      </button>

                                      {isExpSubcat && (
                                        <div className="ml-3 border-l border-border pl-1.5 space-y-0.5 mt-0.5 mb-1.5">
                                          {sc.questions.map(q => {
                                            const isActiveQ = q.slug === activeQuestionSlug;
                                            const qHref = `/${domainSlug}/${stack.slug}/${q.slug}`;
                                            return (
                                              <Link
                                                key={q.slug}
                                                href={qHref}
                                                ref={isActiveQ ? activeRef : undefined}
                                                onClick={() => setMobileOpen(false)}
                                                onMouseEnter={() => prefetchLink(qHref)}
                                                onMouseLeave={cancelPrefetch}
                                                onFocus={() => prefetchLink(qHref)}
                                                onBlur={cancelPrefetch}
                                                className={cn(
                                                  "flex items-start gap-1.5 px-2 py-1.5 rounded-md text-[12px] leading-snug transition-colors duration-200 ease-out",
                                                  isActiveQ
                                                    ? "bg-success text-success-foreground font-bold shadow-sm ring-1 ring-ring"
                                                    : "text-muted-foreground hover:bg-hover hover:text-foreground"
                                                )}
                                              >
                                                <span className={cn("mt-0.5 shrink-0", isActiveQ ? "text-success-foreground" : "text-muted-foreground")}>
                                                  {isActiveQ ? <CheckCircle2 className="h-3 w-3" /> : <Circle className="h-3 w-3" />}
                                                </span>
                                                <span className="line-clamp-2 leading-snug">{q.title}</span>
                                              </Link>
                                            );
                                          })}
                                        </div>
                                      )}
                                    </div>
                                  );
                                })}
                              </div>
                            );
                          })()}

                          {/* Loading skeleton */}
                          {isExpStack && isLoadingStack && (
                            <div className="ml-6 space-y-1.5 py-2">
                              {[80, 65, 72].map(w => (
                                <div
                                  key={w}
                                  className="h-2.5 dark:bg-surface rounded animate-pulse"
                                  style={{ width: `${w}%` }}
                                />
                              ))}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}

          {categories.length === 0 && (
            <div className="px-3 py-4">
              <ListSkeleton rows={3} />
            </div>
          )}
        </div>
      )}
    </div>
  );

  return (
    <>
      {/* ── Desktop sidebar ──────────────────────────────────────────── */}
      <aside
        className={cn(
          "hidden lg:flex flex-col shrink-0 relative",
          "dark:bg-surface border border-border/60 rounded-2xl shadow-xl",
          "overflow-hidden",
          "max-h-[calc(100vh-2.5rem)]",
          collapsed ? "transition-all duration-300 ease-in-out" : "",
        )}
        style={{ width: collapsed ? 48 : sidebarWidth }}
      >
        {/* ── Drag-to-resize handle ── */}
        {!collapsed && (
          <div
            onMouseDown={handleResizeStart}
            title="Drag to resize sidebar"
            className="absolute right-0 top-0 h-full w-3 z-[var(--z-fixed)] cursor-col-resize group/handle flex items-center justify-center"
          >
            {/* Hover highlight line */}
            <div className="absolute inset-y-0 right-0 w-px bg-primary/40 group-hover/handle:bg-primary/20 transition-colors duration-150" />
            {/* Arrow badge — always faintly visible, bright on hover */}
            <div className="absolute top-1/2 -translate-y-1/2 right-0 translate-x-1/2
                            flex items-center gap-0.5 px-1 py-0.5 rounded-full
                            dark:bg-surface border border-border/80 shadow-lg
                            opacity-30 group-hover/handle:opacity-100 transition-opacity duration-150">
              <span className="text-[9px] font-extrabold text-muted-foreground leading-none select-none">‹</span>
              <span className="text-[9px] font-extrabold text-muted-foreground leading-none select-none">›</span>
            </div>
          </div>
        )}
        {treeContent}
      </aside>

      {/* ── Mobile FAB ───────────────────────────────────────────────── */}
      <button
        onClick={() => setMobileOpen(true)}
        className="lg:hidden fixed bottom-6 left-4 z-[var(--z-fixed)] w-12 h-12 rounded-full bg-primary text-primary-foreground shadow-xl flex items-center justify-center hover:bg-primary/90 active:scale-95 transition-colors duration-200 ease-out"
        aria-label="Open navigation"
      >
        <Menu className="h-5 w-5" />
      </button>

      {/* ── Mobile drawer ────────────────────────────────────────────── */}
      {mobileOpen && (
        <div className="lg:hidden fixed inset-0 z-[var(--z-drawer)] flex">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-foreground /40 backdrop-blur-sm"
            onClick={() => setMobileOpen(false)}
          />
          {/* Drawer panel */}
          <aside className="relative z-10 w-[280px] bg-background shadow-2xl flex flex-col h-full overflow-hidden">
            <div className="flex items-center justify-between px-4 py-3 border-b border-border shrink-0">
              <span className="text-sm font-bold text-foreground">Navigation</span>
              <button
                onClick={() => setMobileOpen(false)}
                className="p-1.5 rounded-lg hover:bg-surface transition-colors touch-target focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
                aria-label="Close navigation"
              >
                <X className="h-4 w-4 text-muted-foreground" />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto">
              {treeContent}
            </div>
          </aside>
        </div>
      )}
    </>
  );
}
