"use client";

import { useEffect, useRef, useState } from "react";

// The full mermaid runtime is ~1 MB. We dynamically import it only after the
// component mounts, so question pages without diagrams never ship the library
// to the client bundle. Every other question page compile is much faster.
type MermaidApi = {
  initialize: (cfg: Record<string, unknown>) => void;
  render: (id: string, chart: string) => Promise<{ svg: string }>;
};

let mermaidPromise: Promise<MermaidApi> | null = null;

function loadMermaid(): Promise<MermaidApi> {
  if (mermaidPromise) return mermaidPromise;
  mermaidPromise = import("mermaid").then((mod) => {
    const api = (mod.default ?? mod) as MermaidApi;
    api.initialize({
      startOnLoad: false,
      theme: "default",
      securityLevel: "loose",
      fontFamily: "ui-sans-serif, system-ui, -apple-system, sans-serif",
      flowchart: {
        curve: "basis",
        padding: 16,
        htmlLabels: true,
        useMaxWidth: true,
      },
      themeVariables: {
        // Mermaid parses these values before the SVG reaches the page, so CSS
        // variable expressions are not supported by every renderer version.
        // Stable, accessible colours keep diagrams reliable in both themes.
        primaryColor: "#eff6ff",
        primaryTextColor: "#0f172a",
        primaryBorderColor: "#2563eb",
        lineColor: "#64748b",
        secondaryColor: "#f0fdf4",
        tertiaryColor: "#fff7ed",
        fontSize: "14px",
      },
    });
    return api;
  });
  return mermaidPromise;
}

interface MermaidDiagramProps {
  chart: string;
  className?: string;
}

export default function MermaidDiagram({ chart, className = "" }: MermaidDiagramProps) {
  const ref = useRef<HTMLDivElement | null>(null);
  const [svg, setSvg] = useState<string>("");
  const [error, setError] = useState<string>("");
  // Only fetch + render the diagram once it scrolls into view. System-design
  // questions have 5-8 diagrams on a single page; rendering all of them at
  // once during first paint is what caused the long "Rendering diagram…"
  // flashes across the whole page after navigation. With viewport gating
  // the first diagram renders immediately (it's in view on load) and the
  // rest render lazily as the user scrolls.
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node || typeof IntersectionObserver === "undefined") {
      // Older browsers: just render immediately.
      setInView(true);
      return;
    }
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setInView(true);
            observer.disconnect();
            break;
          }
        }
      },
      { rootMargin: "200px" },
    );
    observer.observe(node);

    // Safety net: if the observer never fires (element is inside a
    // collapsed parent, or the observed node gets swapped out before the
    // first intersection), render anyway after 2.5s. Without this fallback
    // a diagram on a page that the user doesn't scroll past could stay as
    // a blank gray box indefinitely, which is what prompted the "diagrams
    // completely gone" bug report.
    const fallback = window.setTimeout(() => setInView(true), 2500);

    return () => {
      observer.disconnect();
      window.clearTimeout(fallback);
    };
  }, []);

  useEffect(() => {
    if (!inView) return;
    let cancelled = false;
    setSvg("");
    setError("");
    const id = `mermaid-${Math.random().toString(36).slice(2, 11)}`;
    loadMermaid()
      .then((api) => api.render(id, chart))
      .then(({ svg }) => {
        if (!cancelled) setSvg(svg);
      })
      .catch((err: unknown) => {
        if (!cancelled) {
          const msg = err instanceof Error ? err.message : String(err);
          if (typeof document !== "undefined") {
            document.getElementById(id)?.remove();
            document.querySelector(`#d${id}`)?.remove();
          }
          setError(msg || "Unknown mermaid render error");
        }
      });
    return () => {
      cancelled = true;
    };
  }, [chart, inView]);

  if (error) {
    return (
      <div
        ref={ref}
        className="rounded-lg border border-default dark:border-default/20 bg-red-50 dark:bg-red-500/10 p-4 my-4 text-[13px] text-red-700 dark:text-red-400"
      >
        <div className="font-bold mb-1">Diagram render error</div>
        <pre className="text-[12px] whitespace-pre-wrap font-mono">{error}</pre>
        <details className="mt-2">
          <summary className="cursor-pointer text-[12px] font-semibold">show source</summary>
          <pre className="text-[12px] whitespace-pre-wrap font-mono mt-2 text-foreground">{chart}</pre>
        </details>
      </div>
    );
  }

  if (!svg) {
    // Placeholder covers two cases:
    //   1. Not yet in viewport — the observer hasn't flipped `inView` true.
    //   2. In viewport, mermaid still loading/rendering.
    // Both look identical on purpose: a calm skeleton box rather than the
    // prominent "Rendering diagram…" banner, which read as "stuck" on pages
    // with 5+ diagrams.
    return (
      <div
        ref={ref}
        className={`my-4 h-40 rounded-lg border border-border bg-surface ${className}`}
        aria-hidden="true"
      />
    );
  }

  return (
    <div
      ref={ref}
      className={`my-4 flex justify-center overflow-x-auto rounded-lg border border-border bg-background px-4 py-6 [&>svg]:!w-full [&>svg]:!max-w-[250%] [&>svg]:!h-auto ${className}`}
      dangerouslySetInnerHTML={{ __html: svg }}
    />
  );
}
