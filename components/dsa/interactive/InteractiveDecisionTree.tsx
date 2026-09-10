"use client";

import { useId, useMemo, useState } from "react";
import { ArrowRight, CheckCircle2, RotateCcw, Sparkles } from "lucide-react";
import { DSADiagram } from "@/components/dsa/DSADiagram";
import type { DSAMermaidDiagram } from "@/lib/contentV2-types";

type DecisionNode = {
  id: string;
  label: string;
  kind: "goal" | "decision" | "action" | "result";
  winner: boolean;
};

type DecisionEdge = { from: string; to: string; label?: string };
type DecisionGraph = { nodes: DecisionNode[]; edges: DecisionEdge[]; rootId: string };

type Props = {
  diagram: DSAMermaidDiagram;
  optimal?: { name: string; time: string; space: string };
};

export function InteractiveDecisionTree({ diagram, optimal }: Props) {
  const graph = useMemo(() => parseDecisionGraph(diagram.source), [diagram.source]);
  if (!graph) return <DSADiagram diagram={diagram} mode="guide" />;
  return <DecisionTreeExperience graph={graph} diagram={diagram} optimal={optimal} />;
}

function DecisionTreeExperience({ graph, diagram, optimal }: { graph: DecisionGraph; diagram: DSAMermaidDiagram; optimal?: Props["optimal"] }) {
  const initialPath = useMemo(() => findInitialPath(graph), [graph]);
  const initialId = initialPath[initialPath.length - 1];
  const [currentId, setCurrentId] = useState(initialId);
  const [path, setPath] = useState<string[]>(initialPath);
  const [inspectedId, setInspectedId] = useState(initialId);
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [selectedEdge, setSelectedEdge] = useState<DecisionEdge | null>(null);
  const reactId = useId().replace(/[^a-zA-Z0-9_-]/g, "");
  const arrowId = `decision-arrow-${reactId}`;
  const activeArrowId = `decision-arrow-active-${reactId}`;
  const gradientId = `decision-active-edge-${reactId}`;
  const shadowId = `decision-node-shadow-${reactId}`;
  const positions = useMemo(() => layoutDecisionGraph(graph), [graph]);
  const canvasHeight = Math.max(300, ...[...positions.values()].map((position) => position.y + 78));
  const current = graph.nodes.find((node) => node.id === currentId)!;
  const inspected = graph.nodes.find((node) => node.id === (hoveredId ?? inspectedId)) ?? current;
  const choices = graph.edges.filter((edge) => edge.from === currentId);
  const activeEdges = new Set(path.slice(1).map((id, index) => `${path[index]}-${id}`));
  const recommendedPath = findRecommendedPath(graph);

  const choose = (edge: DecisionEdge) => {
    setCurrentId(edge.to);
    setInspectedId(edge.to);
    setSelectedEdge(edge);
    setPath((existing) => [...existing, edge.to]);
  };

  const reset = () => {
    setCurrentId(initialId);
    setInspectedId(initialId);
    setHoveredId(null);
    setSelectedEdge(null);
    setPath(initialPath);
  };

  const showRecommended = () => {
    if (!recommendedPath) return;
    setPath(recommendedPath);
    setCurrentId(recommendedPath[recommendedPath.length - 1]);
    setInspectedId(recommendedPath[recommendedPath.length - 1]);
    setSelectedEdge(recommendedPath.length > 1 ? graph.edges.find((edge) => edge.from === recommendedPath[recommendedPath.length - 2] && edge.to === recommendedPath[recommendedPath.length - 1]) ?? null : null);
  };

  const selectNode = (nodeId: string) => {
    const directEdge = choices.find((edge) => edge.to === nodeId);
    if (directEdge) {
      choose(directEdge);
      return;
    }
    const nextPath = findPathToNode(graph, nodeId);
    if (!nextPath) {
      setInspectedId(nodeId);
      return;
    }
    const lastEdge = nextPath.length > 1
      ? graph.edges.find((edge) => edge.from === nextPath[nextPath.length - 2] && edge.to === nodeId) ?? null
      : null;
    setPath(nextPath);
    setCurrentId(nodeId);
    setInspectedId(nodeId);
    setSelectedEdge(lastEdge);
  };

  return (
    <figure className="m-0 overflow-hidden rounded-xl border border-slate-300 bg-white shadow-sm">
      <div className="grid gap-0 lg:grid-cols-[208px_minmax(0,1fr)]">
        <aside className="border-b border-slate-200 bg-white p-3 lg:border-b-0 lg:border-r" aria-live="polite">
          <p className="text-[9px] font-black uppercase tracking-[0.14em] text-indigo-700">
            {inspected.kind === "decision" ? "Question to answer" : inspected.kind === "result" ? "What this gives you" : "What this step means"}
          </p>
          <h4 className="mt-1.5 text-[13px] font-black leading-snug text-slate-900">{inspected.label}</h4>
          <p className="mt-1.5 text-[11px] leading-[1.55] text-slate-600">{explainNode(inspected)}</p>
          <p className="mt-2 text-[9.5px] font-medium leading-relaxed text-slate-400">Hover over a block to understand it. Click it to make that route active.</p>

          {selectedEdge && current.id === inspected.id && (
            <div className="mt-2.5 rounded-lg border border-indigo-200 bg-indigo-50/70 px-2.5 py-2">
              <p className="text-[9px] font-black uppercase tracking-[0.13em] text-indigo-700">Your answer · {selectedEdge.label || "Continue"}</p>
              <p className="mt-1 text-[10.5px] font-medium leading-[1.5] text-slate-700">
                {explainEdge(selectedEdge, graph)}
              </p>
              {explainRejectedBranches(selectedEdge, graph) && (
                <p className="mt-1.5 border-t border-indigo-200/70 pt-1.5 text-[10px] leading-[1.45] text-slate-600">
                  <span className="font-bold text-slate-700">This rules out: </span>
                  {explainRejectedBranches(selectedEdge, graph)}
                </p>
              )}
            </div>
          )}

          {current.id === inspected.id && choices.length > 0 && (
            <div className="mt-3 border-t border-slate-200 pt-2.5">
              <p className="text-[9px] font-black uppercase tracking-[0.13em] text-slate-500">Choose an answer</p>
              <div className="mt-1.5 space-y-1.5">
                {choices.map((edge) => {
                  const target = graph.nodes.find((node) => node.id === edge.to)!;
                  return (
                    <button key={`${edge.from}-${edge.to}`} type="button" onClick={() => choose(edge)} className="group flex w-full items-center gap-2 rounded-lg border border-slate-200 bg-white px-2.5 py-2 text-left transition-colors hover:border-indigo-300 hover:bg-indigo-50/60">
                      <span className="min-w-0 flex-1">
                        <span className="block text-[11px] font-black text-indigo-700">{edge.label || "Continue"}</span>
                        <span className="mt-0.5 block truncate text-[10.5px] text-slate-600">{target.label}</span>
                      </span>
                      <ArrowRight className="h-3.5 w-3.5 shrink-0 text-slate-400 group-hover:text-indigo-600" />
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {choices.length === 0 && current.id === inspected.id && (
            <div className="mt-4 rounded-lg border border-teal-200 bg-teal-50 px-3 py-2.5">
              <p className="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-wider text-teal-700">
                <CheckCircle2 className="h-3.5 w-3.5" /> Endpoint reached
              </p>
              {current.winner && optimal && (
                <div className="mt-2">
                  <p className="text-xs font-black text-teal-950">{optimal.name}</p>
                  <p className="mt-1 text-[11px] font-semibold text-teal-800">{optimal.time} time · {optimal.space} space</p>
                </div>
              )}
            </div>
          )}

          {diagram.caption && <p className="mt-4 border-t border-slate-200 pt-3 text-[11px] leading-relaxed text-slate-500">{diagram.caption}</p>}
        </aside>

        <div className="relative min-w-0 overflow-x-auto bg-slate-50/50 p-2.5 [background-image:radial-gradient(circle_at_1px_1px,rgb(203_213_225)_1px,transparent_0)] [background-size:22px_22px]">
          <div className="absolute right-3 top-3 z-10 flex items-center gap-1.5">
            {recommendedPath && (
              <button type="button" onClick={showRecommended} className="inline-flex items-center gap-1.5 rounded-lg border border-teal-300 bg-white/95 px-2.5 py-1.5 text-[10px] font-bold text-teal-800 shadow-sm backdrop-blur-sm hover:bg-teal-50">
                <Sparkles className="h-3 w-3" /> Recommended path
              </button>
            )}
            <button type="button" onClick={reset} className="inline-flex items-center gap-1.5 rounded-lg border border-slate-300 bg-white/95 px-2.5 py-1.5 text-[10px] font-bold text-slate-600 shadow-sm backdrop-blur-sm hover:bg-slate-50">
              <RotateCcw className="h-3 w-3" /> Reset
            </button>
          </div>
          <svg viewBox={`0 0 720 ${canvasHeight}`} className="mx-auto block min-w-[590px] max-w-full" role="img" aria-label={`${diagram.title}. Select a branch to explore the decision.`}>
            <defs>
              <filter id={shadowId} x="-30%" y="-30%" width="160%" height="160%">
                <feDropShadow dx="0" dy="4" stdDeviation="5" floodColor="#6366f1" floodOpacity="0.18" />
              </filter>
              <linearGradient id={gradientId} x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="#4f46e5" />
                <stop offset="100%" stopColor="#0891b2" />
              </linearGradient>
              <marker id={arrowId} viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                <path d="M 0 0 L 10 5 L 0 10 z" fill="#94a3b8" />
              </marker>
              <marker id={activeArrowId} viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
                <path d="M 0 0 L 10 5 L 0 10 z" fill="#4f46e5" />
              </marker>
            </defs>
            {graph.edges.map((edge) => {
              const from = positions.get(edge.from);
              const to = positions.get(edge.to);
              const fromNode = graph.nodes.find((node) => node.id === edge.from);
              const toNode = graph.nodes.find((node) => node.id === edge.to);
              if (!from || !to || !fromNode || !toNode) return null;
              const active = activeEdges.has(`${edge.from}-${edge.to}`);
              const connected = hoveredId === edge.from || hoveredId === edge.to;
              const midpointX = (from.x + to.x) / 2;
              const midpointY = (from.y + to.y) / 2;
              const startY = from.y + nodeHeight(fromNode.label, fromNode.kind) / 2 + 3;
              const endY = to.y - nodeHeight(toNode.label, toNode.kind) / 2 - 8;
              const controlY = startY + (endY - startY) * 0.5;
              return (
                <g key={`${edge.from}-${edge.to}`}>
                  <path
                    d={`M ${from.x} ${startY} C ${from.x} ${controlY}, ${to.x} ${controlY}, ${to.x} ${endY}`}
                    fill="none"
                    stroke={active ? "#a5b4fc" : connected ? "#8b5cf6" : "#cbd5e1"}
                    strokeWidth={active ? 3.2 : connected ? 2.4 : 1.7}
                    opacity={active || connected ? 1 : 0.78}
                    markerEnd={active ? `url(#${activeArrowId})` : `url(#${arrowId})`}
                    className="transition-all duration-300"
                  />
                  {active && (
                    <path
                      d={`M ${from.x} ${startY} C ${from.x} ${controlY}, ${to.x} ${controlY}, ${to.x} ${endY}`}
                      fill="none"
                      stroke={`url(#${gradientId})`}
                      strokeWidth="3.2"
                      strokeDasharray="8 5"
                      pointerEvents="none"
                    >
                      <animate attributeName="stroke-dashoffset" from="26" to="0" dur="1.15s" repeatCount="indefinite" />
                    </path>
                  )}
                  {edge.label && (
                    <g transform={`translate(${midpointX},${midpointY})`}>
                      <rect x="-40" y="-11" width="80" height="22" rx="11" fill={active ? "#eef2ff" : "#ffffff"} stroke={active ? "#818cf8" : "#e2e8f0"} filter={active ? `url(#${shadowId})` : undefined} />
                      <text textAnchor="middle" dominantBaseline="middle" fontSize="11" fontWeight="750" fill={active ? "#4338ca" : "#64748b"}>{truncate(edge.label, 12)}</text>
                    </g>
                  )}
                </g>
              );
            })}
            {graph.nodes.map((node) => {
              const position = positions.get(node.id);
              if (!position) return null;
              const active = path.includes(node.id);
              const currentNode = node.id === currentId;
              const inspectedNode = node.id === (hoveredId ?? inspectedId);
              const width = nodeWidth(node.label, node.kind);
              const height = nodeHeight(node.label, node.kind);
              const fill = currentNode
                ? "#eef2ff"
                : node.winner
                  ? "#ecfdf5"
                  : node.kind === "goal"
                    ? "#eff6ff"
                    : node.kind === "decision"
                      ? "#faf5ff"
                      : node.kind === "result"
                        ? "#f0fdfa"
                        : "#ffffff";
              const stroke = currentNode
                ? "#6366f1"
                : inspectedNode
                  ? "#7c3aed"
                  : node.winner
                    ? "#34d399"
                    : node.kind === "goal"
                      ? "#93c5fd"
                      : node.kind === "decision"
                        ? "#c4b5fd"
                        : node.kind === "result"
                          ? "#5eead4"
                          : active
                            ? "#94a3b8"
                            : "#cbd5e1";
              return (
                <g
                  key={node.id}
                  transform={`translate(${position.x},${position.y})`}
                  role="button"
                  tabIndex={0}
                  aria-label={`${node.kind}: ${node.label}`}
                  className="cursor-pointer outline-none"
                  onMouseEnter={() => setHoveredId(node.id)}
                  onMouseLeave={() => setHoveredId(null)}
                  onClick={() => selectNode(node.id)}
                  onKeyDown={(event) => {
                    if (event.key === "Enter" || event.key === " ") selectNode(node.id);
                  }}
                >
                  <rect
                    x={-width / 2}
                    y={-height / 2}
                    width={width}
                    height={height}
                    rx="13"
                    fill={fill}
                    stroke={stroke}
                    strokeWidth={currentNode || inspectedNode ? 2.5 : 1.6}
                    filter={currentNode || inspectedNode ? `url(#${shadowId})` : undefined}
                    className="transition-all duration-300"
                  />
                  <foreignObject x={-width / 2 + 10} y={-height / 2 + 7} width={width - 20} height={height - 14}>
                    <div className="flex h-full items-center justify-center text-center text-[10px] font-bold leading-[1.25] tracking-[-0.005em] text-slate-800">
                      {node.label}
                    </div>
                  </foreignObject>
                </g>
              );
            })}
          </svg>
        </div>
      </div>
    </figure>
  );
}

function explainNode(node: DecisionNode): string {
  const label = node.label.toLowerCase();
  if (node.kind === "goal") return "Keep this required output fixed while you compare approaches. A faster method is still wrong if it changes what must be returned.";
  if (node.kind === "decision") {
    if (label.includes("sorted") || label.includes("order")) return "Check whether ordering is guaranteed in the original input. Sorted data enables directional moves such as two pointers or binary search; unsorted data does not.";
    if (label.includes("index") || label.includes("indices")) return "Check whether the answer must preserve original positions. Sorting may simplify the search, but it can lose those positions unless you store them separately.";
    if (label.includes("in-place") || label.includes("extra space") || label.includes("memory")) return "This is a space constraint. It decides whether an auxiliary map, array, or copied structure is allowed.";
    if (label.includes("one") || label.includes("all") || label.includes("any")) return "Clarify how many answers are required. Finding one valid result and enumerating every result need different stopping and duplicate-handling rules.";
    if (label.includes("many quer") || label.includes("fixed range")) return "Decide whether setup work can be reused. Repeated queries can justify preprocessing that would be wasteful for a single query.";
    if (label.includes("feasible") || label.includes("possible")) return "Test whether this candidate satisfies every constraint. A monotonic yes/no result lets you safely discard one side of the search space.";
    return "Answer using a fact from the prompt—not a guess about the implementation. This fact determines which technique is valid and which shortcuts are unsafe.";
  }
  if (node.kind === "result") return node.winner
    ? "This route best matches the stated constraints. Be ready to explain the invariant that makes it correct, then state its time and space cost."
    : "This route is valid under the choices above, but may trade more time or memory for simpler logic. Compare that cost with the highlighted route.";
  if (/o\s*\(/i.test(node.label)) return "This box records the cost of the route above it. Explain what operation repeats and which extra data structure creates the space cost.";
  return "This is the technique unlocked by the previous answer. Verify its core assumption before treating it as a candidate solution.";
}

function explainEdge(edge: DecisionEdge, graph: DecisionGraph): string {
  const target = graph.nodes.find((node) => node.id === edge.to);
  if (!target) return "This answer determines the next valid step.";
  const source = graph.nodes.find((node) => node.id === edge.from);
  if (edge.label && source?.kind === "decision") return `For “${source.label}”, the prompt supports “${edge.label}”. That makes “${target.label}” the next relevant option.`;
  if (edge.label) return `The “${edge.label}” case leads to “${target.label}”. Follow it only when that condition is actually guaranteed.`;
  return `Once the previous fact is established, “${target.label}” follows as the next technique or trade-off to evaluate.`;
}

function explainRejectedBranches(edge: DecisionEdge, graph: DecisionGraph): string | null {
  const alternatives = graph.edges
    .filter((candidate) => candidate.from === edge.from && candidate.to !== edge.to)
    .map((candidate) => candidate.label || graph.nodes.find((node) => node.id === candidate.to)?.label)
    .filter((label): label is string => Boolean(label));
  if (!alternatives.length) return null;
  return `${alternatives.map((label) => `“${label}”`).join(" and ")} because ${alternatives.length === 1 ? "it assumes" : "they assume"} a different fact about the input.`;
}

function parseDecisionGraph(source: string): DecisionGraph | null {
  const nodeMap = new Map<string, DecisionNode>();
  const edges: DecisionEdge[] = [];
  const winnerIds = new Set<string>();

  for (const line of source.split("\n")) {
    const classMatch = line.match(/^\s*class\s+([\w,-]+)\s+(winner|winnerSub)\s*;/i);
    if (classMatch) classMatch[1].split(",").forEach((id) => winnerIds.add(id.trim()));
  }

  const addNode = (token: string) => {
    const parsed = parseNodeToken(token);
    if (!parsed) return null;
    const existing = nodeMap.get(parsed.id);
    if (!existing || parsed.label !== parsed.id) nodeMap.set(parsed.id, { ...parsed, winner: winnerIds.has(parsed.id) });
    return parsed.id;
  };

  for (const rawLine of source.split("\n")) {
    const line = rawLine.trim();
    if (!line || /^(flowchart|graph|classDef|class\s|style\s)/i.test(line)) continue;
    let left = "";
    let right = "";
    let label: string | undefined;
    const quoted = line.match(/^(.*?)\s+--\s+"([^"]+)"\s+-->\s+(.*)$/);
    const dotted = line.match(/^(.*?)\s+-\.\s+"?([^".]+)"?\s+\.->\s+(.*)$/);
    const labelled = line.match(/^(.*?)\s+--\s+(.+?)\s+-->\s+(.*)$/);
    const piped = line.match(/^(.*?)\s*-->\|([^|]+)\|\s*(.*)$/);
    const plain = line.match(/^(.*?)\s*-->\s*(.*)$/);
    if (quoted) [, left, label, right] = quoted;
    else if (dotted) [, left, label, right] = dotted;
    else if (labelled) [, left, label, right] = labelled;
    else if (piped) [, left, label, right] = piped;
    else if (plain) [, left, right] = plain;
    else continue;
    const from = addNode(left);
    const to = addNode(right);
    if (from && to) edges.push({ from, to, label: cleanLabel(label ?? "") || undefined });
  }

  if (edges.length < 2 || ![...nodeMap.values()].some((node) => node.kind === "decision")) return null;
  for (const [id, node] of nodeMap) {
    if (!edges.some((edge) => edge.from === id)) nodeMap.set(id, { ...node, kind: "result" });
  }
  const childIds = new Set(edges.map((edge) => edge.to));
  const rootId = [...nodeMap.keys()].find((id) => !childIds.has(id));
  if (!rootId) return null;
  nodeMap.set(rootId, { ...nodeMap.get(rootId)!, kind: "goal" });
  return { nodes: [...nodeMap.values()], edges, rootId };
}

function parseNodeToken(token: string): Omit<DecisionNode, "winner"> | null {
  const trimmed = token.trim();
  const idMatch = trimmed.match(/^([A-Za-z][\w-]*)/);
  if (!idMatch) return null;
  const id = idMatch[1];
  const remainder = trimmed.slice(id.length).trim();
  const decision = remainder.startsWith("{");
  const labelMatch = remainder.match(/^[\[{]\s*"([\s\S]*?)"\s*[\]}]$/) ?? remainder.match(/^\[([\s\S]*?)\]$/);
  const label = cleanLabel(labelMatch?.[1] ?? id);
  return { id, label, kind: decision ? "decision" : "action" };
}

function cleanLabel(value: string): string {
  return value.replace(/<br\s*\/?\s*>/gi, " ").replace(/\\n/g, " ").replace(/^"|"$/g, "").replace(/\s+/g, " ").trim();
}

function layoutDecisionGraph(graph: DecisionGraph): Map<string, { x: number; y: number }> {
  const levels = new Map<number, string[]>();
  const queue = [{ id: graph.rootId, depth: 0 }];
  const seen = new Set<string>();
  const placeQueuedNodes = () => {
    while (queue.length) {
      const item = queue.shift()!;
      if (seen.has(item.id)) continue;
      seen.add(item.id);
      levels.set(item.depth, [...(levels.get(item.depth) ?? []), item.id]);
      graph.edges.filter((edge) => edge.from === item.id).forEach((edge) => queue.push({ id: edge.to, depth: item.depth + 1 }));
    }
  };
  placeQueuedNodes();
  for (const node of graph.nodes) {
    if (seen.has(node.id)) continue;
    queue.push({ id: node.id, depth: 0 });
    placeQueuedNodes();
  }
  const positions = new Map<string, { x: number; y: number }>();
  for (const [depth, ids] of levels) {
    const gap = 660 / Math.max(1, ids.length);
    ids.forEach((id, index) => positions.set(id, { x: 30 + gap * (index + 0.5), y: 52 + depth * 118 }));
  }
  return positions;
}

function findRecommendedPath(graph: DecisionGraph): string[] | null {
  const terminalWinners = graph.nodes.filter((node) => node.winner && !graph.edges.some((edge) => edge.from === node.id));
  const winners = terminalWinners.length ? terminalWinners : graph.nodes.filter((node) => node.winner);
  const winnerIds = new Set(winners.map((node) => node.id));
  if (!winnerIds.size) return null;
  const queue: string[][] = [[graph.rootId]];
  while (queue.length) {
    const path = queue.shift()!;
    const last = path[path.length - 1];
    if (winnerIds.has(last)) return path;
    graph.edges.filter((edge) => edge.from === last && !path.includes(edge.to)).forEach((edge) => queue.push([...path, edge.to]));
  }
  return null;
}

function findPathToNode(graph: DecisionGraph, targetId: string): string[] | null {
  const queue: string[][] = [[graph.rootId]];
  while (queue.length) {
    const path = queue.shift()!;
    const last = path[path.length - 1];
    if (last === targetId) return path;
    graph.edges
      .filter((edge) => edge.from === last && !path.includes(edge.to))
      .forEach((edge) => queue.push([...path, edge.to]));
  }
  return null;
}

function findInitialPath(graph: DecisionGraph): string[] {
  const path = [graph.rootId];
  while (true) {
    const outgoing = graph.edges.filter((edge) => edge.from === path[path.length - 1]);
    if (outgoing.length !== 1 || outgoing[0].label) break;
    const next = outgoing[0].to;
    if (path.includes(next)) break;
    path.push(next);
    const node = graph.nodes.find((item) => item.id === next);
    if (node?.kind === "decision") break;
  }
  return path;
}

function nodeWidth(label: string, kind: DecisionNode["kind"]): number {
  const minimum = kind === "goal" ? 126 : kind === "decision" ? 116 : kind === "result" ? 106 : 92;
  const maximum = kind === "goal" ? 188 : kind === "decision" ? 176 : 166;
  const contentWidth = 76 + Math.min(label.length, 52) * 2.2;
  return Math.round(Math.min(maximum, Math.max(minimum, contentWidth)));
}

function nodeHeight(label: string, kind: DecisionNode["kind"]): number {
  const width = nodeWidth(label, kind);
  const usableWidth = Math.max(72, width - 20);
  const estimatedLines = Math.max(1, Math.ceil((label.length * 5.7) / usableWidth));
  return Math.min(68, 32 + estimatedLines * 12);
}

function truncate(value: string, max: number): string {
  return value.length > max ? `${value.slice(0, max - 1)}…` : value;
}
