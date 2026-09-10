"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { ArrowUp } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * DSAReadingNav — the reading companion for the long-form answer page.
 *
 * The answer page is the one place on the site people actually *read* a
 * long technical walkthrough (quick answer → revise → approach 1..N →
 * try-it → mistakes → more). That scroll is currently unanchored: no
 * sense of position, no way to jump between zones, no way back up, and
 * if you leave and come back you start from the top every time.
 *
 * This component pins a slim sticky bar to the top of the reading column
 * and provides four reading affordances:
 *
 *   1. Section chips — jump to any zone; the zone currently in view is
 *      highlighted (IntersectionObserver, desktop-pane or viewport root).
 *   2. Reading-progress line — a hair-thin bar = % through the page so
 *      the reader knows how much is left.
 *   3. Back-to-top — appears after the first screenful, smooth-scrolls up.
 *   4. Continue where you left off — remembers scroll position per slug
 *      in localStorage and restores it on return, with a short toast so
 *      the silent restore isn't disorienting.
 *
 * Scroll root handling: on desktop the reading column is an independent
 * scroll container (`data-reading-scroll`); on mobile the column flows
 * with the page and the window scrolls. We detect which one is actually
 * scrolling and bind to it, re-evaluating on each tick so a resize that
 * crosses the lg breakpoint keeps working.
 */
export type ReadingSection = { id: string; label: string };

const RESUME_HINT_MS = 4500;
const STORAGE_PREFIX = "intex:readpos:";

export function DSAReadingNav({
  sections,
  slug,
  className,
}: {
  sections: ReadingSection[];
  slug: string;
  className?: string;
}) {
  const barRef = useRef<HTMLDivElement>(null);
  const activeIdRef = useRef<string | null>(null);
  const [progress, setProgress] = useState(0);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [showTop, setShowTop] = useState(false);
  const [resumed, setResumed] = useState(false);

  /** Resolve the real scroll root: the desktop pane if it is itself
   *  scrolling, otherwise the window (mobile layout). The pane only
   *  becomes scrollable at the lg breakpoint (`lg:overflow-y-auto`), so
   *  we verify the computed overflow-y actually allows scrolling rather
   *  than trusting scrollHeight alone — a non-scrolling visible box can
   *  report scrollHeight > clientHeight and would otherwise swallow the
   *  listeners on mobile where the window is the true scroller. */
  const getScroller = useCallback((): HTMLElement | Window => {
    const el = barRef.current;
    if (el) {
      const box = el.closest<HTMLElement>("[data-reading-scroll]");
      if (box) {
        const oy = getComputedStyle(box).overflowY;
        const scrollable =
          (oy === "auto" || oy === "scroll") &&
          box.scrollHeight - box.clientHeight > 1;
        if (scrollable) return box;
      }
    }
    return window;
  }, []);

  // ── Progress + back-to-top visibility ───────────────────────────────
  useEffect(() => {
    let raf = 0;
    const update = () => {
      raf = 0;
      const scroller = getScroller();
      let top: number;
      let max: number;
      if (scroller === window) {
        top = window.scrollY || document.documentElement.scrollTop;
        max = document.documentElement.scrollHeight - window.innerHeight;
      } else {
        const el = scroller as HTMLElement;
        top = el.scrollTop;
        max = el.scrollHeight - el.clientHeight;
      }
      setProgress(max > 0 ? Math.min(1, top / max) : 0);
      setShowTop(top > 400);
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    const scroller = getScroller();
    (scroller === window ? window : scroller).addEventListener("scroll", onScroll, {
      passive: true,
    });
    window.addEventListener("resize", onScroll);
    update();
    return () => {
      if (raf) cancelAnimationFrame(raf);
      (scroller === window ? window : scroller).removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [getScroller]);

  // ── Active section via IntersectionObserver ──────────────────────────
  useEffect(() => {
    if (!sections.length) return;
    const rootEl = (() => {
      const el = barRef.current?.closest<HTMLElement>("[data-reading-scroll]");
      if (el) {
        const oy = getComputedStyle(el).overflowY;
        const scrollable =
          (oy === "auto" || oy === "scroll") &&
          el.scrollHeight - el.clientHeight > 1;
        if (scrollable) return el;
      }
      return null; // viewport
    })();
    const visible = new Map<string, number>();
    const obs = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) visible.set(e.target.id, e.intersectionRatio);
          else visible.delete(e.target.id);
        }
        // Most-visible wins; tie-break = document order (sections is ordered).
        let best: string | null = null;
        let bestRatio = -1;
        for (const s of sections) {
          const r = visible.get(s.id) ?? 0;
          if (r > bestRatio) {
            bestRatio = r;
            best = s.id;
          }
        }
        if (best && best !== activeIdRef.current) {
          activeIdRef.current = best;
          setActiveId(best);
        }
      },
      {
        root: rootEl,
        // Highlight a section once its top has crossed the upper ~45% of
        // the viewport, so the active chip tracks the reader's eye line.
        rootMargin: "0px 0px -55% 0px",
        threshold: [0, 0.1, 0.25, 0.5, 1],
      },
    );
    for (const s of sections) {
      const t = document.getElementById(s.id);
      if (t) obs.observe(t);
    }
    return () => obs.disconnect();
  }, [sections]);

  // ── Continue where you left off — restore ───────────────────────────
  useEffect(() => {
    const key = STORAGE_PREFIX + slug;
    let saved: number | null = null;
    try {
      const raw = localStorage.getItem(key);
      if (raw) saved = Number(JSON.parse(raw).y);
    } catch {
      saved = null;
    }
    if (saved == null || !Number.isFinite(saved) || saved < 200) return;
    const scroller = getScroller();
    const t = window.setTimeout(() => {
      if (scroller === window) window.scrollTo({ top: saved });
      else (scroller as HTMLElement).scrollTop = saved;
      setResumed(true);
      window.setTimeout(() => setResumed(false), RESUME_HINT_MS);
    }, 80);
    return () => window.clearTimeout(t);
    // slug change = new page; re-run restore only then.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [slug]);

  // ── Continue where you left off — persist ────────────────────────────
  useEffect(() => {
    const key = STORAGE_PREFIX + slug;
    let raf = 0;
    let lastY = 0;
    const persist = () => {
      raf = 0;
      try {
        localStorage.setItem(key, JSON.stringify({ y: lastY, t: Date.now() }));
      } catch {
        /* storage may be unavailable (private mode) — reading still works */
      }
    };
    const onScroll = () => {
      const scroller = getScroller();
      lastY =
        scroller === window
          ? window.scrollY || document.documentElement.scrollTop
          : (scroller as HTMLElement).scrollTop;
      if (!raf) raf = requestAnimationFrame(persist);
    };
    const scroller = getScroller();
    (scroller === window ? window : scroller).addEventListener("scroll", onScroll, {
      passive: true,
    });
    return () => {
      (scroller === window ? window : scroller).removeEventListener("scroll", onScroll);
      if (raf) cancelAnimationFrame(raf);
      try {
        localStorage.setItem(key, JSON.stringify({ y: lastY, t: Date.now() }));
      } catch {
        /* ignore */
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [slug]);

  const jumpTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const scrollTop = () => {
    const scroller = getScroller();
    if (scroller === window) window.scrollTo({ top: 0, behavior: "smooth" });
    else scroller.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div
      ref={barRef}
      className={cn(
        "sticky top-0 z-20 -mb-px border-b border-border",
        "bg-surface/90 backdrop-blur supports-[backdrop-filter]:bg-surface/75",
        className,
      )}
    >
      {/* reading-progress hairline */}
      <div className="h-0.5 w-full bg-transparent">
        <div
          className="h-full bg-primary transition-[width] duration-150 ease-out"
          style={{ width: `${progress * 100}%` }}
        />
      </div>

      <div className="flex items-center gap-2 py-2">
        <div
          className={cn(
            "flex-1 min-w-0 flex items-center gap-1 overflow-x-auto",
            "[scrollbar-width:none] [&::-webkit-scrollbar]:hidden",
          )}
        >
          {sections.map((s) => {
            const active = activeId === s.id;
            return (
              <button
                key={s.id}
                type="button"
                onClick={() => jumpTo(s.id)}
                aria-current={active ? "location" : undefined}
                className={cn(
                  "shrink-0 whitespace-nowrap rounded-full px-3 py-1 text-[11.5px] font-semibold transition-colors",
                  active
                    ? "bg-primary/10 text-primary border border-primary/30"
                    : "text-muted-foreground hover:text-foreground hover:bg-hover border border-transparent",
                )}
              >
                {s.label}
              </button>
            );
          })}
        </div>

        <button
          type="button"
          onClick={scrollTop}
          aria-label="Back to top"
          className={cn(
            "shrink-0 grid place-items-center h-7 w-7 rounded-full border transition-all duration-150",
            showTop
              ? "opacity-100 border-border text-muted-foreground hover:text-foreground hover:bg-hover"
              : "opacity-0 pointer-events-none border-transparent",
          )}
        >
          <ArrowUp className="h-3.5 w-3.5" />
        </button>
      </div>

      {/* resume hint — brief, non-blocking */}
      <div
        aria-live="polite"
        className={cn(
          "pointer-events-none absolute right-0 top-full mt-1 transition-all duration-200",
          resumed ? "opacity-100 translate-y-0" : "opacity-0 translate-y-1",
        )}
      >
        {resumed && (
          <span className="inline-flex items-center gap-1.5 rounded-md border border-border bg-card px-2.5 py-1 text-[11px] font-medium text-muted-foreground shadow-sm">
            <ArrowUp className="h-3 w-3 text-primary" />
            Resumed where you left off
          </span>
        )}
      </div>
    </div>
  );
}
