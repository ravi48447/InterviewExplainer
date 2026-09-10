"use client";

import { useEffect, useMemo, useState } from "react";
import {
  ChevronLeft,
  ChevronRight,
  Pause,
  Play,
  RotateCcw,
  Sparkles,
} from "lucide-react";
import { DSALangToggle } from "@/components/dsa/DSALangToggle";
import { useDSALang } from "@/components/dsa/DSALangContext";
import type {
  DSAApproach,
  DSAArrayStateDiagram,
  DSADiagram,
  DSAHashmapStateDiagram,
} from "@/lib/contentV2-types";
import { cn } from "@/lib/utils";

type TypedDiagram = DSAArrayStateDiagram | DSAHashmapStateDiagram;

function isTypedDiagram(diagram: DSADiagram): diagram is TypedDiagram {
  return diagram.type === "array-state" || diagram.type === "hashmap-state";
}

function mappedFrameIndex(step: number, stepCount: number, frameCount: number) {
  if (frameCount <= 1 || stepCount <= 1) return 0;
  return Math.round((step / (stepCount - 1)) * (frameCount - 1));
}

function numberFrom(text: string | undefined, name: string) {
  if (!text) return undefined;
  const match = text.match(new RegExp(`${name}\\s*=\\s*(\\d+)`, "i"));
  return match ? Number(match[1]) : undefined;
}

function connectedAnnotation(
  annotations: NonNullable<DSAApproach["lineByLine"]>["java"],
  action: string | undefined,
  fallbackIndex: number,
) {
  if (!annotations?.length) return undefined;
  const words = (action ?? "").toLowerCase();
  const byText = (patterns: string[]) =>
    annotations.find((item) => {
      const haystack = `${item.line} ${item.explanation}`.toLowerCase();
      return patterns.some((pattern) => haystack.includes(pattern));
    });

  if (words.includes("no repeat") || words.includes("last=") || words.includes("insert") || words.includes("update")) {
    return byText(["newest index", "last.put", "last[c] = right", "always update", "record c"]);
  }
  if (words.includes("repeat") || words.includes("duplicate") || words.includes("jump")) {
    return byText(["inside the current window", "guard", ">= left", "only jump"]);
  }
  if (words.includes("best") || words.includes("length")) {
    return byText(["window length", "track the longest", "best ="]);
  }
  return annotations[fallbackIndex];
}

function ArrayFrame({
  diagram,
  frameIndex,
  reduceMotion,
}: {
  diagram: DSAArrayStateDiagram;
  frameIndex: number;
  reduceMotion: boolean;
}) {
  const frame = diagram.frames[frameIndex];
  const highlighted = new Set(frame.highlight ?? []);
  const dimmed = new Set(frame.dim ?? []);
  const pointers = new Map<number, string[]>();
  for (const pointer of frame.pointers ?? []) {
    pointers.set(pointer.index, [...(pointers.get(pointer.index) ?? []), pointer.name]);
  }

  return (
    <div className="overflow-x-auto pb-2 pt-8" aria-label={`${frame.step}. ${frame.action}`}>
      <div className="flex min-w-max items-end gap-2 px-2">
        {frame.values.map((value, index) => {
          const labels = pointers.get(index) ?? [];
          const active = highlighted.has(index);
          return (
            <div key={`${index}-${value}`} className="relative flex w-14 flex-col items-center">
              <div className="absolute -top-8 flex gap-1">
                {labels.map((label) => (
                  <span
                    key={label}
                    className="rounded-md bg-[#E87500] px-1.5 py-0.5 font-mono text-[10px] font-bold text-white shadow-sm"
                  >
                    {label} ↓
                  </span>
                ))}
              </div>
              <div
                className={cn(
                  "flex h-14 w-14 items-center justify-center rounded-xl border-2 font-mono text-base font-semibold",
                  reduceMotion ? "" : "transition-all duration-250 ease-out",
                  active
                    ? "-translate-y-1 border-[#1E7AF2] bg-[#EAF3FF] text-[#0F2346] shadow-[0_8px_20px_rgba(30,122,242,0.14)]"
                    : dimmed.has(index)
                      ? "border-[#E0E7F0] bg-[#F5F7FA] text-[#99A7B9]"
                      : "border-[#D7E1EE] bg-white text-[#263B5A]",
                )}
              >
                {value}
              </div>
              <span className="mt-1 font-mono text-[10px] text-[#71839D]">{index}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function HashmapFrame({
  diagram,
  frameIndex,
}: {
  diagram: DSAHashmapStateDiagram;
  frameIndex: number;
}) {
  const frame = diagram.frames[frameIndex];
  return (
    <div className="flex min-h-28 flex-wrap content-center gap-2 py-5" aria-label={`${frame.step}. ${frame.action}`}>
      {frame.entries.length === 0 ? (
        <div className="rounded-xl border border-dashed border-[#B9C9DD] bg-white px-5 py-4 font-mono text-sm text-[#71839D]">
          map = {"{}"}
        </div>
      ) : (
        frame.entries.map((entry) => {
          const active = entry.key === frame.highlightKey;
          const lookup = entry.key === frame.lookupKey;
          return (
            <div
              key={`${entry.key}-${entry.value}`}
              className={cn(
                "overflow-hidden rounded-xl border-2 bg-white font-mono text-sm shadow-sm transition-colors duration-250",
                frame.found && lookup
                  ? "border-[#23A46D]"
                  : lookup
                    ? "border-[#E87500]"
                    : active
                      ? "border-[#1E7AF2]"
                      : "border-[#D7E1EE]",
              )}
            >
              <span
                className={cn(
                  "inline-block px-3 py-2 font-bold",
                  frame.found && lookup
                    ? "bg-[#E8F8F0] text-[#137A4E]"
                    : lookup
                      ? "bg-[#FFF2E4] text-[#A84D00]"
                      : active
                        ? "bg-[#EAF3FF] text-[#155FB7]"
                        : "bg-[#F5F8FC] text-[#526985]",
                )}
              >
                {entry.key}
              </span>
              <span className="inline-block px-3 py-2 text-[#0F2346]">→ {entry.value}</span>
            </div>
          );
        })
      )}
    </div>
  );
}

export function DSAStudyWorkbench({
  problemTitle,
  pattern,
  approach,
}: {
  problemTitle: string;
  pattern: string;
  approach: DSAApproach;
}) {
  const steps = approach.dryRun?.steps ?? [];
  const diagram = approach.diagrams?.find(isTypedDiagram);
  const stepCount = Math.max(steps.length, diagram?.frames.length ?? 0, 1);
  const [current, setCurrent] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [speed, setSpeed] = useState(1);
  const [reduceMotion, setReduceMotion] = useState(false);
  const langContext = useDSALang();
  const language = langContext?.lang ?? "java";

  useEffect(() => {
    const query = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReduceMotion(query.matches);
    update();
    query.addEventListener("change", update);
    return () => query.removeEventListener("change", update);
  }, []);

  useEffect(() => {
    if (!playing || reduceMotion || stepCount <= 1) return;
    const timer = window.setInterval(() => {
      setCurrent((value) => {
        if (value >= stepCount - 1) {
          setPlaying(false);
          return value;
        }
        return value + 1;
      });
    }, 1500 / speed);
    return () => window.clearInterval(timer);
  }, [playing, reduceMotion, speed, stepCount]);

  const dryIndex = steps.length
    ? mappedFrameIndex(current, stepCount, steps.length)
    : 0;
  const frameIndex = diagram
    ? mappedFrameIndex(current, stepCount, diagram.frames.length)
    : 0;
  const step = steps[dryIndex];
  const diagramFrame = diagram?.frames[frameIndex];
  const annotations = approach.lineByLine?.[language] ?? [];
  const annotation = connectedAnnotation(
    annotations,
    step?.action ?? diagramFrame?.action,
    mappedFrameIndex(current, stepCount, annotations.length),
  );

  const derivedArrayDiagram = useMemo(() => {
    if (diagram?.type !== "array-state" || !step || diagram.frames.length === 0) {
      return null;
    }
    const right = numberFrom(step.step, "right");
    const left = numberFrom(step.state, "left") ?? 0;
    if (right === undefined || right >= diagram.frames[0].values.length) return null;
    const highlight = Array.from(
      { length: Math.max(0, right - left + 1) },
      (_, index) => left + index,
    );
    return {
      ...diagram,
      frames: [
        {
          ...diagram.frames[0],
          step: step.step,
          action: step.action,
          pointers: [
            { name: "left", index: left },
            { name: "right", index: right },
          ],
          highlight,
          dim: Array.from({ length: left }, (_, index) => index),
        },
      ],
    } satisfies DSAArrayStateDiagram;
  }, [diagram, step]);

  const timelineLabel = useMemo(
    () => `Step ${current + 1} of ${stepCount}`,
    [current, stepCount],
  );

  const moveTo = (next: number) => {
    setPlaying(false);
    setCurrent(Math.min(stepCount - 1, Math.max(0, next)));
  };

  return (
    <section
      aria-labelledby="study-workbench-title"
      className="mb-7 overflow-hidden rounded-[15px] border border-[#CAD8EA] bg-white shadow-[0_18px_50px_rgba(28,67,118,0.08)] dark:border-border dark:bg-card"
    >
      <div className="flex flex-wrap items-center gap-3 border-b border-[#D7E1EE] bg-[linear-gradient(110deg,#F7FAFF_0%,#FFF9F2_100%)] px-5 py-4 dark:border-border dark:bg-muted/40">
        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#EAF3FF] text-[#1E7AF2]">
          <Sparkles className="h-4 w-4" aria-hidden="true" />
        </div>
        <div className="min-w-0">
          <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[#60738F]">
            Learn by stepping through it
          </p>
          <h2 id="study-workbench-title" className="text-[17px] font-semibold text-[#0F2346] dark:text-foreground sm:text-[18px]">
            Visual walkthrough
          </h2>
        </div>
        <div className="ml-auto flex items-center gap-2">
          <span className="hidden rounded-full border border-[#F2CC9D] bg-[#FFF5E9] px-2.5 py-1 text-[11px] font-semibold text-[#A84D00] sm:inline-flex">
            {pattern}
          </span>
          <DSALangToggle />
        </div>
      </div>

      <div className="border-b border-[#D7E1EE] px-4 py-3 dark:border-border sm:px-5">
        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => moveTo(0)}
            disabled={current === 0}
            className="inline-flex min-h-10 items-center gap-1 rounded-lg border border-[#D7E1EE] bg-white px-3 text-xs font-semibold text-[#405674] transition-colors hover:bg-[#F5F8FC] disabled:cursor-not-allowed disabled:opacity-40 dark:border-border dark:bg-background dark:text-foreground"
          >
            <RotateCcw className="h-3.5 w-3.5" /> Reset
          </button>
          <button
            type="button"
            aria-label="Previous explanation step"
            onClick={() => moveTo(current - 1)}
            disabled={current === 0}
            className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-[#D7E1EE] bg-white text-[#405674] transition-colors hover:bg-[#F5F8FC] disabled:cursor-not-allowed disabled:opacity-40 dark:border-border dark:bg-background dark:text-foreground"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={() => setPlaying((value) => !value)}
            disabled={reduceMotion || stepCount <= 1}
            className="inline-flex min-h-10 min-w-24 items-center justify-center gap-2 rounded-lg bg-[#1E7AF2] px-4 text-xs font-semibold text-white shadow-sm transition-colors hover:bg-[#1767CF] disabled:cursor-not-allowed disabled:opacity-50"
          >
            {playing ? <Pause className="h-3.5 w-3.5" /> : <Play className="h-3.5 w-3.5" />}
            {playing ? "Pause" : "Play"}
          </button>
          <button
            type="button"
            aria-label="Next explanation step"
            onClick={() => moveTo(current + 1)}
            disabled={current === stepCount - 1}
            className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-[#D7E1EE] bg-white text-[#405674] transition-colors hover:bg-[#F5F8FC] disabled:cursor-not-allowed disabled:opacity-40 dark:border-border dark:bg-background dark:text-foreground"
          >
            <ChevronRight className="h-4 w-4" />
          </button>

          <label className="ml-auto flex min-h-10 items-center gap-2 text-xs font-medium text-[#60738F]">
            Speed
            <select
              value={speed}
              onChange={(event) => setSpeed(Number(event.target.value))}
              className="h-10 rounded-lg border border-[#D7E1EE] bg-white px-2 text-xs font-semibold text-[#0F2346] outline-none focus-visible:ring-2 focus-visible:ring-[#1E7AF2] dark:border-border dark:bg-background dark:text-foreground"
            >
              <option value={0.75}>0.75x</option>
              <option value={1}>1x</option>
              <option value={1.5}>1.5x</option>
            </select>
          </label>
        </div>

        <div className="mt-3 flex items-center gap-3">
          <span className="shrink-0 text-[11px] font-semibold text-[#526985]">{timelineLabel}</span>
          <input
            aria-label="Explanation timeline"
            type="range"
            min={0}
            max={stepCount - 1}
            value={current}
            onChange={(event) => moveTo(Number(event.target.value))}
            className="h-1.5 w-full cursor-pointer accent-[#E87500]"
          />
        </div>
        {reduceMotion && (
          <p className="mt-2 text-[11px] text-[#60738F]">Autoplay is off because reduced motion is enabled. Step controls remain available.</p>
        )}
      </div>

      <div className="grid lg:grid-cols-[minmax(0,1fr)_240px]">
        <div className="min-w-0 border-b border-[#D7E1EE] bg-[#FBFCFE] px-4 py-5 dark:border-border dark:bg-background lg:border-b-0 lg:border-r sm:px-6">
          <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[#60738F]">Persistent rule</p>
              <p className="mt-1 text-sm font-semibold text-[#0F2346] dark:text-foreground">{pattern}</p>
            </div>
            {diagram?.input && (
              <code className="rounded-lg border border-[#D7E1EE] bg-white px-2.5 py-1.5 font-mono text-[11px] text-[#405674] dark:border-border dark:bg-card dark:text-foreground">
                {diagram.input}
              </code>
            )}
          </div>

          {diagram?.type === "array-state" ? (
            <ArrayFrame
              diagram={derivedArrayDiagram ?? diagram}
              frameIndex={derivedArrayDiagram ? 0 : frameIndex}
              reduceMotion={reduceMotion}
            />
          ) : diagram?.type === "hashmap-state" ? (
            <HashmapFrame diagram={diagram} frameIndex={frameIndex} />
          ) : (
            <div className="flex min-h-36 items-center justify-center rounded-xl border border-dashed border-[#B9C9DD] bg-white px-6 text-center dark:border-border dark:bg-card">
              <div>
                <p className="text-sm font-semibold text-[#0F2346] dark:text-foreground">{step?.step ?? problemTitle}</p>
                <p className="mt-2 max-w-lg text-sm leading-6 text-[#60738F] dark:text-muted-foreground">{step?.state ?? approach.dryRun?.intro ?? approach.explanation}</p>
              </div>
            </div>
          )}

          <div className="mt-5 rounded-xl border border-[#CFE0F5] bg-[#EEF6FF] px-4 py-3 dark:border-border dark:bg-muted/30" aria-live="polite">
            <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[#1E7AF2]">What changed?</p>
            <p className="mt-1 text-sm leading-6 text-[#263B5A] dark:text-foreground">
              {step?.action ?? diagramFrame?.action ?? "Use Next to reveal the algorithm one decision at a time."}
            </p>
          </div>
        </div>

        <aside className="bg-white px-4 py-5 dark:bg-card sm:px-5">
          <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[#60738F]">Current state</p>
          <p className="mt-2 rounded-xl border border-[#D7E1EE] bg-[#F8FAFD] px-3 py-3 font-mono text-xs leading-5 text-[#263B5A] dark:border-border dark:bg-background dark:text-foreground">
            {step?.state ?? diagramFrame?.step ?? "Ready to begin"}
          </p>

          <div className="mt-5 border-t border-[#E2E9F2] pt-4 dark:border-border">
            <div className="flex items-center justify-between gap-2">
              <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[#60738F]">Code connection</p>
              <span className="text-[10px] font-semibold uppercase text-[#1E7AF2]">{language}</span>
            </div>
            {annotation ? (
              <div className="mt-2 overflow-hidden rounded-xl bg-[#101C30] text-white">
                <code className="block overflow-x-auto px-3 py-3 font-mono text-[11px] leading-5 text-[#DDE9F7]">{annotation.line}</code>
                <p className="border-t border-white/10 bg-white/[0.04] px-3 py-2.5 text-[11px] leading-5 text-[#AFC2DA]">{annotation.explanation}</p>
              </div>
            ) : (
              <p className="mt-2 text-xs leading-5 text-[#60738F]">The complete annotated solution remains directly below this walkthrough.</p>
            )}
          </div>

          <div className="mt-5 border-t border-[#E2E9F2] pt-4 dark:border-border">
            <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[#60738F]">Result</p>
            <p className="mt-1 font-mono text-sm font-semibold text-[#137A4E]">{approach.dryRun?.result ?? approach.complexity.time}</p>
          </div>
        </aside>
      </div>
    </section>
  );
}
