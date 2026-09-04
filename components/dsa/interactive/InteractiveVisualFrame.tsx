"use client";

import { CheckCircle2, CircleDot, Search } from "lucide-react";
import { DSADiagram } from "@/components/dsa/DSADiagram";
import type {
  DSAArrayStateDiagram,
  DSADiagram as DSADiagramType,
  DSADryRun,
  DSAHashmapStateDiagram,
} from "@/lib/contentV2-types";
import { cn } from "@/lib/utils";

type Props = {
  diagram?: DSADiagramType | null;
  run?: DSADryRun;
  stepIndex: number;
};

export function InteractiveVisualFrame({ diagram, run, stepIndex }: Props) {
  const grid = parseGrid(run?.input);
  if (grid) {
    return <InteractiveGridFrame grid={grid} run={run} stepIndex={stepIndex} />;
  }

  if (diagram?.type === "array-state") {
    return <InteractiveArrayFrame diagram={diagram} stepIndex={stepIndex} />;
  }

  if (diagram?.type === "hashmap-state") {
    return <InteractiveHashmapFrame diagram={diagram} stepIndex={stepIndex} />;
  }

  if (diagram?.type === "mermaid") {
    const graph = parseMermaidGraph(diagram.source);
    if (graph && graph.nodes.length >= 2) {
      return (
        <InteractiveGraphFrame
          title={diagram.title}
          caption={diagram.caption}
          graph={graph}
          run={run}
          stepIndex={stepIndex}
        />
      );
    }
    return (
      <div className="rounded-xl border border-border bg-background px-2 sm:px-3">
        <DSADiagram diagram={diagram} />
      </div>
    );
  }

  return <NarrativeStateFrame run={run} stepIndex={stepIndex} />;
}

function InteractiveGridFrame({
  grid,
  run,
  stepIndex,
}: {
  grid: Array<Array<string | number>>;
  run?: DSADryRun;
  stepIndex: number;
}) {
  const step = run?.steps[Math.min(stepIndex, Math.max(0, run.steps.length - 1))];
  const currentCoordinates = new Set(
    extractCoordinates(`${step?.step ?? ""} ${step?.action ?? ""}`),
  );
  const visitedCoordinates = new Set(
    (run?.steps ?? [])
      .slice(0, stepIndex + 1)
      .flatMap((item) => extractCoordinates(`${item.step} ${item.action} ${item.state}`)),
  );
  const countMatch = `${step?.action ?? ""} ${step?.state ?? ""}`.match(/count\s*=\s*(\d+)/i);

  return (
    <div className="overflow-hidden rounded-xl border border-border bg-background">
      <div className="flex flex-wrap items-start justify-between gap-3 border-b border-border bg-white px-4 py-3">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-blue-700">Live grid state</p>
          <p className="mt-1 text-sm font-bold text-foreground">Cells change as the traversal moves</p>
        </div>
        <div className="flex items-center gap-3">
          {countMatch && (
            <span className="rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-1.5 text-xs font-bold text-emerald-800">
              Islands: {countMatch[1]}
            </span>
          )}
          <code className="text-[11px] font-bold text-blue-700">{step?.step}</code>
        </div>
      </div>
      <div className="grid min-h-[320px] place-items-center bg-slate-50/60 p-6 [background-image:radial-gradient(circle_at_1px_1px,rgb(203_213_225)_1px,transparent_0)] [background-size:22px_22px]">
        <div>
          <div
            className="grid gap-2 rounded-xl border border-border bg-white p-4 shadow-sm"
            style={{ gridTemplateColumns: `repeat(${grid[0]?.length ?? 1}, minmax(48px, 62px))` }}
          >
            {grid.flatMap((row, rowIndex) =>
              row.map((value, columnIndex) => {
                const key = `${rowIndex},${columnIndex}`;
                const isLand = String(value) === "1";
                const active = currentCoordinates.has(key);
                const visited = visitedCoordinates.has(key);
                return (
                  <div
                    key={key}
                    className={cn(
                      "relative flex aspect-square items-center justify-center rounded-lg border-2 font-mono text-sm font-black transition-all duration-300",
                      active
                        ? "animate-pulse border-indigo-500 bg-indigo-50 text-indigo-800 shadow-sm"
                        : visited && isLand
                          ? "border-emerald-300 bg-emerald-50 text-emerald-800"
                          : isLand
                            ? "border-slate-400 bg-white text-slate-800"
                            : "border-slate-200 bg-slate-100 text-slate-400",
                    )}
                  >
                    {visited && isLand && !active ? "0" : value}
                    <span className="absolute bottom-1 right-1 text-[8px] font-medium text-muted-foreground">
                      {rowIndex},{columnIndex}
                    </span>
                  </div>
                );
              }),
            )}
          </div>
          <div className="mt-4 flex flex-wrap justify-center gap-3 text-[10px] text-muted-foreground">
            <Legend className="border-blue-500 bg-blue-50" label="Current traversal" />
            <Legend className="border-emerald-300 bg-emerald-50" label="Visited / sunk" />
            <Legend className="border-slate-400 bg-white" label="Unvisited land" />
          </div>
        </div>
      </div>
      {step?.action && (
        <p className="border-t border-border px-4 py-2.5 text-xs leading-relaxed text-muted-foreground">{step.action}</p>
      )}
    </div>
  );
}

function parseGrid(input?: string): Array<Array<string | number>> | null {
  if (!input || !/\bgrid\s*=/.test(input)) return null;
  const start = input.indexOf("[[");
  const end = input.lastIndexOf("]]" ) + 2;
  if (start < 0 || end <= start) return null;
  try {
    const parsed = JSON.parse(input.slice(start, end));
    return Array.isArray(parsed) && parsed.every((row) => Array.isArray(row)) ? parsed : null;
  } catch {
    return null;
  }
}

function extractCoordinates(text: string): string[] {
  return [...text.matchAll(/\((\d+)\s*,\s*(\d+)\)/g)].map((match) => `${match[1]},${match[2]}`);
}

type ParsedGraph = {
  nodes: Array<{ id: string; label: string }>;
  edges: Array<{ from: string; to: string }>;
};

function InteractiveGraphFrame({
  title,
  caption,
  graph,
  run,
  stepIndex,
}: {
  title: string;
  caption?: string;
  graph: ParsedGraph;
  run?: DSADryRun;
  stepIndex: number;
}) {
  const step = run?.steps[Math.min(stepIndex, Math.max(0, run.steps.length - 1))];
  const positions = layoutGraph(graph);
  const directContext = (step?.step ?? "").toLowerCase();
  const supportingContext = `${step?.action ?? ""} ${step?.state ?? ""}`.toLowerCase();
  const returned = extractReturnedValue(step?.state ?? step?.action ?? "");
  const isMentionedIn = (label: string, context: string) => {
    const normalized = label.toLowerCase().replace(/["']/g, "").trim();
    if (!normalized) return false;
    const leadingNumber = normalized.match(/^-?\d+/)?.[0];
    if (leadingNumber) {
      return new RegExp(`(^|\\D)${escapeRegExp(leadingNumber)}(\\D|$)`).test(context);
    }
    return context.includes(normalized);
  };
  const hasDirectMatch = graph.nodes.some((node) => isMentionedIn(node.label, directContext));
  const isDirect = (label: string) =>
    hasDirectMatch
      ? isMentionedIn(label, directContext)
      : isMentionedIn(label, supportingContext);
  const isSupporting = (label: string) =>
    hasDirectMatch && !isDirect(label) && isMentionedIn(label, supportingContext);

  return (
    <div className="overflow-hidden rounded-xl border border-border bg-background">
      <div className="flex flex-wrap items-start justify-between gap-3 border-b border-border bg-white px-4 py-3">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-blue-700">
            Interactive diagram
          </p>
          <p className="mt-1 text-sm font-bold text-foreground">{title}</p>
        </div>
        {step && (
          <div className="max-w-sm rounded-md bg-blue-50 px-2 py-1 text-right">
            <code className="text-[11px] font-bold text-blue-700">{step.step}</code>
          </div>
        )}
      </div>

      <div className="relative min-h-[220px] overflow-x-auto bg-slate-50/50 p-2.5 [background-image:radial-gradient(circle_at_1px_1px,rgb(203_213_225)_1px,transparent_0)] [background-size:22px_22px]">
        <svg
          viewBox="0 0 760 280"
          role="img"
          aria-label={`${title}. ${step?.action ?? caption ?? ""}`}
          className="mx-auto block h-auto min-w-[350px] max-w-full"
        >
          {graph.edges.map((edge) => {
            const from = positions.get(edge.from);
            const to = positions.get(edge.to);
            if (!from || !to) return null;
            const fromLabel = graph.nodes.find((node) => node.id === edge.from)?.label ?? edge.from;
            const toLabel = graph.nodes.find((node) => node.id === edge.to)?.label ?? edge.to;
            const active = isDirect(fromLabel) && isDirect(toLabel);
            const supporting =
              !active &&
              (isDirect(fromLabel) || isDirect(toLabel)) &&
              (isSupporting(fromLabel) || isSupporting(toLabel));
            return (
              <line
                key={`${edge.from}-${edge.to}`}
                x1={from.x}
                y1={from.y}
                x2={to.x}
                y2={to.y}
                stroke={active ? "#2563eb" : supporting ? "#60a5fa" : "#94a3b8"}
                strokeWidth={active ? 3 : supporting ? 2.5 : 2}
                strokeDasharray={active ? "7 5" : undefined}
                className="transition-all duration-300"
              >
                {active && <animate attributeName="stroke-dashoffset" from="24" to="0" dur="0.9s" repeatCount="indefinite" />}
              </line>
            );
          })}

          {graph.nodes.map((node) => {
            const position = positions.get(node.id);
            if (!position) return null;
            const active = isDirect(node.label);
            const supporting = isSupporting(node.label);
            const resolved = returned !== null && normalizeGraphLabel(node.label) === normalizeGraphLabel(returned);
            const compact = node.label.length <= 5;
            const width = compact ? 44 : 104;
            const height = compact ? 44 : 40;
            return (
              <g key={node.id} transform={`translate(${position.x},${position.y})`} className="transition-all duration-300">
                {active && (
                  <circle r={compact ? 29 : 34} fill="none" stroke="#818cf8" strokeWidth="2">
                    <animate attributeName="r" values={compact ? "25;31;25" : "30;37;30"} dur="1.5s" repeatCount="indefinite" />
                    <animate attributeName="opacity" values="0.7;0.15;0.7" dur="1.5s" repeatCount="indefinite" />
                  </circle>
                )}
                <rect
                  x={-width / 2}
                  y={-height / 2}
                  width={width}
                  height={height}
                  rx={compact ? 22 : 10}
                  fill={resolved ? "#ecfdf5" : active ? "#eff6ff" : supporting ? "#f8fafc" : "#ffffff"}
                  stroke={resolved ? "#10b981" : active ? "#2563eb" : supporting ? "#60a5fa" : "#94a3b8"}
                  strokeWidth={resolved || active ? 3 : supporting ? 2.5 : 2}
                />
                <text
                  x="0"
                  y="1"
                  textAnchor="middle"
                  dominantBaseline="middle"
                  fill={resolved ? "#047857" : active ? "#1d4ed8" : supporting ? "#475569" : "#334155"}
                  fontSize={compact ? 14 : 10}
                  fontWeight={active || resolved ? 800 : supporting ? 700 : 650}
                >
                  {truncateLabel(node.label, compact ? 6 : 15)}
                </text>
                {resolved && (
                  <text x="0" y={height / 2 + 17} textAnchor="middle" fill="#047857" fontSize="10" fontWeight="700">
                    returns here
                  </text>
                )}
              </g>
            );
          })}
        </svg>

        <div className="absolute bottom-2 left-2 flex flex-wrap gap-2.5 rounded-lg border border-border bg-white/95 px-2.5 py-1.5 text-[9.5px] text-muted-foreground">
          <Legend className="border-blue-500 bg-blue-50" label="Active call / node" />
          <Legend className="border-blue-300 bg-slate-50" label="Supporting context" />
          <Legend className="border-emerald-500 bg-emerald-50" label="Returned state" />
          <Legend className="border-slate-400 bg-white" label="Not active" />
        </div>
      </div>

      {caption && <p className="border-t border-border px-4 py-2.5 text-xs leading-relaxed text-muted-foreground">{caption}</p>}
    </div>
  );
}

function parseMermaidGraph(source: string): ParsedGraph | null {
  const nodes = new Map<string, string>();
  const edges: Array<{ from: string; to: string }> = [];
  const edgePattern = /^\s*([A-Za-z][\w-]*)(?:\(\(([^)]*)\)\)|\["([^"]*)"\]|\[([^\]]*)\])?\s*(?:-->|---|==>)\s*([A-Za-z][\w-]*)(?:\(\(([^)]*)\)\)|\["([^"]*)"\]|\[([^\]]*)\])?/;

  for (const line of source.split("\n")) {
    if (line.includes("-.")) continue;
    const match = line.match(edgePattern);
    if (!match) continue;
    const from = match[1];
    const to = match[5];
    const fromLabel = cleanMermaidLabel(match[2] ?? match[3] ?? match[4] ?? from);
    const toLabel = cleanMermaidLabel(match[6] ?? match[7] ?? match[8] ?? to);
    nodes.set(from, nodes.get(from) ?? fromLabel);
    nodes.set(to, nodes.get(to) ?? toLabel);
    edges.push({ from, to });
  }

  if (nodes.size < 2 || edges.length === 0) return null;
  return { nodes: [...nodes.entries()].map(([id, label]) => ({ id, label })), edges };
}

function layoutGraph(graph: ParsedGraph): Map<string, { x: number; y: number }> {
  const children = new Map<string, string[]>();
  const childIds = new Set<string>();
  for (const edge of graph.edges) {
    children.set(edge.from, [...(children.get(edge.from) ?? []), edge.to]);
    childIds.add(edge.to);
  }
  const roots = graph.nodes.map((node) => node.id).filter((id) => !childIds.has(id));
  const queue = (roots.length ? roots : [graph.nodes[0].id]).map((id) => ({ id, depth: 0 }));
  const seen = new Set<string>();
  const levels = new Map<number, string[]>();
  while (queue.length) {
    const item = queue.shift()!;
    if (seen.has(item.id)) continue;
    seen.add(item.id);
    levels.set(item.depth, [...(levels.get(item.depth) ?? []), item.id]);
    for (const child of children.get(item.id) ?? []) queue.push({ id: child, depth: item.depth + 1 });
  }
  const unplaced = graph.nodes.map((node) => node.id).filter((id) => !seen.has(id));
  if (unplaced.length) levels.set(0, [...(levels.get(0) ?? []), ...unplaced]);

  const positions = new Map<string, { x: number; y: number }>();
  const maxDepth = Math.max(0, ...levels.keys());
  for (const [depth, ids] of levels) {
    const span = 650;
    const gap = span / Math.max(1, ids.length);
    ids.forEach((id, index) => {
      positions.set(id, {
        x: 55 + gap * (index + 0.5),
        y: 42 + (depth * 180) / Math.max(1, maxDepth),
      });
    });
  }
  return positions;
}

function extractReturnedValue(text: string): string | null {
  const match = text.match(/return(?:s|ed)?\s*(?:=|:)?\s*([A-Za-z0-9(),-]+)/i);
  return match?.[1] ?? null;
}

function cleanMermaidLabel(label: string): string {
  return label.replace(/<br\s*\/?\s*>/gi, " ").replace(/["']/g, "").replace(/\s+/g, " ").trim();
}

function normalizeGraphLabel(label: string): string {
  return label.toLowerCase().replace(/[^a-z0-9,-]/g, "");
}

function truncateLabel(label: string, max: number): string {
  return label.length > max ? `${label.slice(0, max - 1)}…` : label;
}

function escapeRegExp(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function InteractiveArrayFrame({
  diagram,
  stepIndex,
}: {
  diagram: DSAArrayStateDiagram;
  stepIndex: number;
}) {
  const frame = diagram.frames[Math.min(stepIndex, diagram.frames.length - 1)];
  if (!frame) return null;

  const highlighted = new Set(frame.highlight ?? []);
  const dimmed = new Set(frame.dim ?? []);
  const pointers = new Map<number, string[]>();
  for (const pointer of frame.pointers ?? []) {
    const labels = pointers.get(pointer.index) ?? [];
    labels.push(pointer.name);
    pointers.set(pointer.index, labels);
  }

  return (
    <div className="rounded-xl border border-border bg-background p-4 sm:p-5">
      <div className="mb-5 flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-muted-foreground">
            Array state
          </p>
          <p className="mt-1 text-sm font-semibold text-foreground">{frame.step}</p>
        </div>
        <p className="max-w-sm text-right text-xs leading-relaxed text-muted-foreground">
          {frame.action}
        </p>
      </div>

      <div className="overflow-x-auto pb-2">
        <div className="flex min-w-max items-end justify-center gap-2 px-2 pt-8">
          {frame.values.map((value, index) => {
            const labels = pointers.get(index) ?? [];
            const isHighlighted = highlighted.has(index);
            const isDimmed = dimmed.has(index);
            return (
              <div key={`${index}-${value}`} className="relative flex min-w-[58px] flex-col items-center">
                <div className="absolute -top-8 flex gap-1">
                  {labels.map((label) => (
                    <span
                      key={label}
                      className="rounded-md border border-blue-200 bg-blue-50 px-1.5 py-0.5 font-mono text-[10px] font-bold text-blue-700"
                    >
                      {label} ↓
                    </span>
                  ))}
                </div>
                <div
                  className={cn(
                    "flex h-14 w-14 items-center justify-center rounded-lg border-2 font-mono text-base font-bold transition-all duration-300",
                    isHighlighted
                      ? "animate-pulse border-teal-500 bg-teal-50 text-teal-800"
                      : labels.length > 0
                        ? "animate-pulse border-indigo-500 bg-indigo-50 text-indigo-900"
                        : "border-border bg-white text-foreground",
                    isDimmed && "opacity-35",
                  )}
                >
                  {value}
                </div>
                <span className="mt-1 font-mono text-[10px] text-muted-foreground">[{index}]</span>
              </div>
            );
          })}
        </div>
      </div>

      <div className="mt-4 flex flex-wrap justify-center gap-4 border-t border-border pt-3 text-[11px] text-muted-foreground">
        <Legend className="border-blue-500 bg-blue-50" label="Current pointer" />
        <Legend className="border-emerald-500 bg-emerald-50" label="Resolved state" />
        <Legend className="border-border bg-white" label="Not processed" />
      </div>
    </div>
  );
}

function InteractiveHashmapFrame({
  diagram,
  stepIndex,
}: {
  diagram: DSAHashmapStateDiagram;
  stepIndex: number;
}) {
  const frame = diagram.frames[Math.min(stepIndex, diagram.frames.length - 1)];
  if (!frame) return null;

  return (
    <div className="rounded-xl border border-border bg-background p-4 sm:p-5">
      <div className="mb-4 flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-muted-foreground">
            Hash-map state
          </p>
          <p className="mt-1 text-sm font-semibold text-foreground">{frame.step}</p>
        </div>
        {frame.lookupKey && (
          <div className="inline-flex items-center gap-2 rounded-lg border border-amber-200 bg-amber-50 px-3 py-2">
            <Search className="h-3.5 w-3.5 text-amber-700" />
            <span className="text-xs text-amber-900">
              lookup <code className="font-bold">{frame.lookupKey}</code>
            </span>
          </div>
        )}
      </div>

      <div className="grid gap-4 md:grid-cols-[1fr_180px]">
        <div className="rounded-lg border border-border bg-surface/60 p-3">
          <div className="mb-2 grid grid-cols-2 border-b border-border pb-2 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
            <span>Value</span>
            <span>Index / state</span>
          </div>
          {frame.entries.length === 0 ? (
            <p className="py-5 text-center font-mono text-xs text-muted-foreground">map = {"{}"}</p>
          ) : (
            <div className="space-y-1.5">
              {frame.entries.map((entry) => {
                const isLookup = entry.key === frame.lookupKey;
                const isNew = entry.key === frame.highlightKey;
                return (
                  <div
                    key={`${entry.key}-${entry.value}`}
                    className={cn(
                      "grid grid-cols-2 rounded-md border px-3 py-2 font-mono text-sm transition-colors",
                      isLookup && frame.found
                        ? "animate-pulse border-teal-300 bg-teal-50 text-teal-900"
                        : isLookup
                          ? "animate-pulse border-amber-300 bg-amber-50 text-amber-900"
                          : isNew
                            ? "border-blue-300 bg-blue-50 text-blue-900"
                            : "border-border bg-background text-foreground",
                    )}
                  >
                    <span className="font-bold">{entry.key}</span>
                    <span>→ {entry.value}</span>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        <div
          className={cn(
            "flex min-h-28 flex-col items-center justify-center rounded-lg border p-4 text-center",
            frame.found
              ? "border-emerald-300 bg-emerald-50"
              : "border-border bg-surface/50",
          )}
        >
          {frame.found ? (
            <CheckCircle2 className="mb-2 h-7 w-7 text-emerald-600" />
          ) : (
            <CircleDot className="mb-2 h-7 w-7 text-blue-600" />
          )}
          <p className="text-xs font-bold text-foreground">
            {frame.found ? "Match found" : "Continue scanning"}
          </p>
          <p className="mt-1 text-[11px] leading-relaxed text-muted-foreground">{frame.action}</p>
        </div>
      </div>
    </div>
  );
}

function NarrativeStateFrame({ run, stepIndex }: { run?: DSADryRun; stepIndex: number }) {
  const step = run?.steps[Math.min(stepIndex, Math.max(0, run.steps.length - 1))];
  if (!step) {
    return (
      <div className="flex min-h-64 items-center justify-center rounded-xl border border-dashed border-border bg-background p-6 text-center text-sm text-muted-foreground">
        This approach is explained through the authored walkthrough below.
      </div>
    );
  }

  return (
    <div className="relative flex min-h-64 items-center justify-center overflow-hidden rounded-xl border border-border bg-background p-6">
      <div className="absolute inset-0 opacity-50 [background-image:radial-gradient(circle_at_1px_1px,rgb(203_213_225)_1px,transparent_0)] [background-size:22px_22px]" />
      <div className="relative w-full max-w-lg">
        <div className="grid grid-cols-[auto_1fr] items-stretch gap-3">
          <div className="flex w-10 items-center justify-center rounded-lg border border-blue-200 bg-blue-50 font-mono text-sm font-black text-blue-700">
            {stepIndex + 1}
          </div>
          <div className="rounded-lg border border-border bg-white p-4 shadow-sm">
            <p className="font-mono text-xs font-bold text-blue-700">{step.step}</p>
            <p className="mt-2 text-sm leading-relaxed text-foreground">{step.action}</p>
            <div className="mt-3 flex items-center gap-2 rounded-md bg-surface px-3 py-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">State</span>
              <code className="text-xs font-semibold text-foreground">{step.state}</code>
            </div>
            {step.note && <p className="mt-2 text-xs font-medium text-emerald-700">{step.note}</p>}
          </div>
        </div>
      </div>
    </div>
  );
}

function Legend({ className, label }: { className: string; label: string }) {
  return (
    <span className="inline-flex items-center gap-1.5">
      <span className={cn("h-3 w-3 rounded border-2", className)} />
      {label}
    </span>
  );
}
