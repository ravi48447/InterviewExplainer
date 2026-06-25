"use client";

import { useEffect, useId, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import type {
  DSAArrayStateDiagram,
  DSADiagram as DSADiagramType,
  DSAHashmapStateDiagram,
  DSAMermaidDiagram,
} from "@/lib/contentV2-types";

/**
 * Dispatcher — picks the right renderer for each diagram type.
 *
 * Designed so the JSON authoring stays declarative ({ type, data }) and
 * the page never has to know which underlying tech (mermaid vs custom
 * SVG vs HTML/CSS) is in play for a given diagram.
 */
export function DSADiagram({ diagram }: { diagram: DSADiagramType }) {
  switch (diagram.type) {
    case "mermaid":
      return <MermaidDiagram diagram={diagram} />;
    case "hashmap-state":
      return <HashmapStateDiagram diagram={diagram} />;
    case "array-state":
      return <ArrayStateDiagram diagram={diagram} />;
    default:
      return null;
  }
}

// ─── Shared chrome ──────────────────────────────────────────────────────

function DiagramShell({
  title,
  caption,
  input,
  toneClass = "border-border",
  headerClass = "bg-surface border-border text-foreground",
  children,
}: {
  title: string;
  caption?: string;
  input?: string;
  toneClass?: string;
  headerClass?: string;
  children: React.ReactNode;
}) {
  return (
    <figure
      className={cn(
        "my-4 rounded-lg border bg-background overflow-hidden",
        toneClass,
      )}
    >
      <figcaption
        className={cn(
          "px-4 py-2 border-b flex items-center justify-between gap-3 flex-wrap",
          headerClass,
        )}
      >
        <span className="text-[10px] font-bold uppercase tracking-widest">
          {title}
        </span>
        {input && (
          <code className="text-[11px] font-mono text-foreground bg-background border border-border rounded px-2 py-0.5">
            {input}
          </code>
        )}
      </figcaption>
      {caption && (
        <p className="px-4 pt-3 text-[12.5px] text-secondary leading-relaxed italic">
          {caption}
        </p>
      )}
      <div className="px-4 py-4">{children}</div>
    </figure>
  );
}

// ─── 1. Mermaid (lazy-loaded) ───────────────────────────────────────────

function MermaidDiagram({ diagram }: { diagram: DSAMermaidDiagram }) {
  const reactId = useId();
  // Mermaid requires a DOM-id-friendly identifier; React's useId returns
  // colon-separated strings that mermaid v10's CSS selectors choke on.
  const id = `mmd-${reactId.replace(/[^a-zA-Z0-9_-]/g, "")}`;
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [svg, setSvg] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const mermaid = (await import("mermaid")).default;
        mermaid.initialize({
          startOnLoad: false,
          theme: "neutral",
          securityLevel: "strict",
          fontFamily:
            'ui-sans-serif, system-ui, -apple-system, "Segoe UI", Roboto, sans-serif',
          flowchart: { htmlLabels: true, curve: "basis", padding: 12 },
        });
        const { svg: rendered } = await mermaid.render(id, diagram.source);
        if (!cancelled) setSvg(rendered);
      } catch (e) {
        if (!cancelled)
          setError(e instanceof Error ? e.message : "Failed to render diagram");
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [diagram.source, id]);

  return (
    <DiagramShell
      title={diagram.title}
      caption={diagram.caption}
      toneClass="border-indigo-200"
      headerClass="bg-indigo-50 border-indigo-200 text-indigo-700"
    >
      {error ? (
        <pre className="text-[11px] text-red-600 whitespace-pre-wrap break-words">
          Could not render diagram: {error}
        </pre>
      ) : svg ? (
        <div
          ref={containerRef}
          className="overflow-x-auto flex justify-center [&>svg]:max-w-full [&>svg]:h-auto"
          dangerouslySetInnerHTML={{ __html: svg }}
        />
      ) : (
        <div className="h-32 flex items-center justify-center text-[11px] text-slate-400">
          Rendering diagram…
        </div>
      )}
    </DiagramShell>
  );
}

// ─── 2. Hash-map state evolution ────────────────────────────────────────

function HashmapStateDiagram({
  diagram,
}: {
  diagram: DSAHashmapStateDiagram;
}) {
  return (
    <DiagramShell
      title={diagram.title}
      caption={diagram.caption}
      input={diagram.input}
      toneClass="border-violet-200"
      headerClass="bg-violet-50 border-violet-200 text-violet-700"
    >
      <ol className="space-y-3">
        {diagram.frames.map((f, i) => (
          <li key={i} className="grid grid-cols-1 md:grid-cols-[140px_1fr] gap-3 items-start">
            <div className="md:pt-1.5">
              <div className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                Frame {i + 1}
              </div>
              <code className="block mt-0.5 text-[11.5px] font-mono text-foreground">
                {f.step}
              </code>
              <p className="text-[11.5px] text-secondary mt-1 leading-relaxed">
                {f.action}
              </p>
            </div>

            <div className="rounded-md border border-border bg-surface/60 p-2">
              {f.entries.length === 0 ? (
                <div className="px-3 py-2 text-[11.5px] font-mono text-slate-400 italic">
                  map = {`{}`} (empty)
                </div>
              ) : (
                <div className="flex flex-wrap gap-1.5">
                  {f.entries.map((e, j) => {
                    const isHighlighted = e.key === f.highlightKey;
                    const isLookup = e.key === f.lookupKey;
                    return (
                      <div
                        key={j}
                        className={cn(
                          "inline-flex items-stretch rounded-md border-2 overflow-hidden font-mono text-[11.5px] transition-colors",
                          isLookup && f.found
                            ? "border-emerald-500 shadow-sm shadow-emerald-200"
                            : isLookup
                              ? "border-amber-500"
                              : isHighlighted
                                ? "border-violet-500 bg-violet-50"
                                : "border-border bg-background",
                        )}
                      >
                        <span
                          className={cn(
                            "px-2 py-1 font-bold",
                            isLookup && f.found
                              ? "bg-emerald-500 text-primary-foreground dark:text-foreground"
                              : isLookup
                                ? "bg-amber-500 text-primary-foreground dark:text-foreground"
                                : isHighlighted
                                  ? "bg-violet-500 text-primary-foreground dark:text-foreground"
                                  : "bg-surface text-foreground",
                          )}
                        >
                          {e.key}
                        </span>
                        <span className="px-2 py-1 text-foreground">
                          → {e.value}
                        </span>
                      </div>
                    );
                  })}
                </div>
              )}
              {f.lookupKey && !f.entries.some((e) => e.key === f.lookupKey) && (
                <div className="mt-2 text-[11px] text-amber-700 font-medium flex items-center gap-1.5">
                  <span aria-hidden="true">🔍</span>
                  Looked up{" "}
                  <code className="font-mono bg-amber-50 border border-amber-200 px-1 rounded">
                    {f.lookupKey}
                  </code>{" "}
                  — not in map.
                </div>
              )}
              {f.found && (
                <div className="mt-2 text-[11px] text-emerald-700 font-bold flex items-center gap-1.5">
                  <span aria-hidden="true">✓</span> Match found.
                </div>
              )}
            </div>
          </li>
        ))}
      </ol>

      <div className="mt-4 pt-3 border-t border-slate-100 flex flex-wrap gap-3 text-[10.5px] text-muted-foreground">
        <Legend swatch="bg-violet-500" label="Just inserted / updated" />
        <Legend swatch="bg-amber-500" label="Looking up" />
        <Legend swatch="bg-emerald-500" label="Match" />
      </div>
    </DiagramShell>
  );
}

// ─── 3. Array state with pointers ───────────────────────────────────────

function ArrayStateDiagram({ diagram }: { diagram: DSAArrayStateDiagram }) {
  return (
    <DiagramShell
      title={diagram.title}
      caption={diagram.caption}
      input={diagram.input}
      toneClass="border-sky-200"
      headerClass="bg-sky-50 border-sky-200 text-sky-700"
    >
      <ol className="space-y-3">
        {diagram.frames.map((f, i) => {
          const highlight = new Set(f.highlight ?? []);
          const dim = new Set(f.dim ?? []);
          const pointersByIndex = new Map<number, string[]>();
          (f.pointers ?? []).forEach((p) => {
            const arr = pointersByIndex.get(p.index) ?? [];
            arr.push(p.name);
            pointersByIndex.set(p.index, arr);
          });
          return (
            <li
              key={i}
              className="grid grid-cols-1 md:grid-cols-[140px_1fr] gap-3 items-start"
            >
              <div className="md:pt-1.5">
                <div className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                  Frame {i + 1}
                </div>
                <code className="block mt-0.5 text-[11.5px] font-mono text-foreground">
                  {f.step}
                </code>
                <p className="text-[11.5px] text-secondary mt-1 leading-relaxed">
                  {f.action}
                </p>
              </div>

              <div className="rounded-md border border-border bg-surface/60 p-3 overflow-x-auto">
                <div className="flex items-end gap-1">
                  {f.values.map((v, idx) => {
                    const ptrs = pointersByIndex.get(idx) ?? [];
                    const isH = highlight.has(idx);
                    const isD = dim.has(idx);
                    return (
                      <div
                        key={idx}
                        className="flex flex-col items-center min-w-[44px]"
                      >
                        {/* Pointer labels above the cell */}
                        <div className="h-5 flex items-end gap-0.5 mb-0.5">
                          {ptrs.map((p) => (
                            <span
                              key={p}
                              className="text-[10px] font-bold font-mono text-sky-700 bg-sky-100 border border-sky-300 px-1 rounded leading-none py-0.5"
                            >
                              {p}↓
                            </span>
                          ))}
                        </div>
                        <div
                          className={cn(
                            "w-full px-2 py-2 rounded-md border-2 text-center font-mono text-[12.5px] transition-colors",
                            isH
                              ? "border-emerald-500 bg-emerald-50 text-emerald-900 font-bold"
                              : isD
                                ? "border-border bg-surface text-slate-400"
                                : "border-border bg-background text-foreground",
                          )}
                        >
                          {v}
                        </div>
                        <div className="text-[9.5px] text-slate-400 font-mono mt-0.5">
                          [{idx}]
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </li>
          );
        })}
      </ol>
    </DiagramShell>
  );
}

// ─── Tiny helpers ───────────────────────────────────────────────────────

function Legend({ swatch, label }: { swatch: string; label: string }) {
  return (
    <span className="inline-flex items-center gap-1.5">
      <span className={cn("w-2.5 h-2.5 rounded-sm", swatch)} aria-hidden="true" />
      {label}
    </span>
  );
}
