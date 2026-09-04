"use client";

import { useEffect, useState } from "react";
import { ChevronLeft, ChevronRight, GitBranch, Pause, PencilLine, Play, RotateCcw, Sparkles } from "lucide-react";
import type { DSADiagram, DSADryRun as DSADryRunType } from "@/lib/contentV2-types";
import { cn } from "@/lib/utils";
import { InteractiveVisualFrame } from "@/components/dsa/interactive/InteractiveVisualFrame";
import { getLiveSimulatorKind, simulateLiveDryRun } from "@/components/dsa/interactive/liveDryRun";

export function DSADryRun({ run, diagram }: { run: DSADryRunType; diagram?: DSADiagram }) {
  const [stepIndex, setStepIndex] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [activeRun, setActiveRun] = useState(run);
  const [activeDiagram, setActiveDiagram] = useState(diagram);
  const [editingInput, setEditingInput] = useState(false);
  const [draftInput, setDraftInput] = useState(run.input);
  const [inputError, setInputError] = useState<string | null>(null);
  const simulatorKind = getLiveSimulatorKind(run, diagram);
  const currentStep = activeRun.steps[stepIndex];
  const previousStep = stepIndex > 0 ? activeRun.steps[stepIndex - 1] : undefined;
  const totalSteps = activeRun.steps.length;

  useEffect(() => {
    setActiveRun(run);
    setActiveDiagram(diagram);
    setDraftInput(run.input);
    setStepIndex(0);
    setInputError(null);
  }, [diagram, run]);

  useEffect(() => {
    if (!playing || totalSteps <= 1) return;
    const timer = window.setInterval(() => {
      setStepIndex((index) => {
        if (index >= totalSteps - 1) {
          setPlaying(false);
          return index;
        }
        return index + 1;
      });
    }, 3000);
    return () => window.clearInterval(timer);
  }, [playing, totalSteps]);

  const selectStep = (index: number) => {
    setPlaying(false);
    setStepIndex(Math.max(0, Math.min(index, totalSteps - 1)));
  };

  const applyLiveInput = () => {
    try {
      const simulated = simulateLiveDryRun(run, diagram, draftInput);
      setActiveRun(simulated.run);
      setActiveDiagram(simulated.diagram);
      setDraftInput(simulated.run.input);
      setInputError(null);
      setPlaying(false);
      setStepIndex(0);
      setEditingInput(false);
    } catch (error) {
      setInputError(error instanceof Error ? error.message : "Could not build this dry run.");
    }
  };

  const restoreExample = () => {
    setActiveRun(run);
    setActiveDiagram(diagram);
    setDraftInput(run.input);
    setInputError(null);
    setPlaying(false);
    setStepIndex(0);
  };

  return (
    <figure className="my-4 overflow-hidden rounded-xl border border-slate-300 bg-white shadow-sm">
      <figcaption className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 bg-slate-50/80 px-4 py-3 text-slate-900">
        <div>
          <p className="text-[10px] font-black uppercase tracking-[0.16em] text-indigo-700">Interactive dry run</p>
          <p className="mt-0.5 text-xs text-slate-600">Select a frame to connect the decision with its visual state.</p>
        </div>
        <div className="flex max-w-full items-center gap-2">
          <code className="max-w-full overflow-x-auto rounded-md border border-slate-200 bg-white px-2.5 py-1.5 text-[10px] text-slate-700 shadow-sm">
            {activeRun.input}
          </code>
          {simulatorKind && (
            <button
              type="button"
              onClick={() => setEditingInput((value) => !value)}
              className="inline-flex shrink-0 items-center gap-1.5 rounded-md border border-indigo-300 bg-indigo-50 px-2.5 py-1.5 text-[10px] font-bold text-indigo-700 hover:bg-indigo-100"
            >
              <PencilLine className="h-3 w-3" />
              Try data
            </button>
          )}
        </div>
      </figcaption>

      {simulatorKind && editingInput && (
        <div className="border-b border-indigo-200 bg-indigo-50/70 px-4 py-3">
          <div className="flex flex-wrap items-center gap-2">
            <div className="flex min-w-[260px] flex-1 items-center gap-2 rounded-lg border border-indigo-300 bg-white px-3 py-2 shadow-sm focus-within:ring-2 focus-within:ring-indigo-200">
              <Sparkles className="h-3.5 w-3.5 shrink-0 text-indigo-600" />
              <input
                value={draftInput}
                onChange={(event) => {
                  setDraftInput(event.target.value);
                  setInputError(null);
                }}
                onKeyDown={(event) => {
                  if (event.key === "Enter") applyLiveInput();
                }}
                aria-label="Dry-run input"
                className="min-w-0 flex-1 bg-transparent font-mono text-xs text-slate-800 outline-none"
              />
            </div>
            <button type="button" onClick={applyLiveInput} className="rounded-lg bg-indigo-600 px-3.5 py-2 text-xs font-bold text-white hover:bg-indigo-700">
              Build live trace
            </button>
            <button type="button" onClick={restoreExample} className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs font-bold text-slate-600 hover:bg-slate-50">
              Restore example
            </button>
          </div>
          <p className="mt-2 text-[11px] leading-relaxed text-slate-600">
            The simulator rebuilds every decision, visual state, and result from this input. Keep the case small so each frame remains readable.
          </p>
          {inputError && <p className="mt-2 text-xs font-bold text-rose-700" role="alert">{inputError}</p>}
        </div>
      )}

      <div className="grid xl:grid-cols-[210px_minmax(0,1fr)]">
        <ol className="border-b border-slate-200 bg-white p-3 xl:border-b-0 xl:border-r">
          {activeRun.steps.map((step, index) => {
            const active = index === stepIndex;
            const complete = index < stepIndex;
            return (
              <li key={`${step.step}-${index}`}>
                <button
                  type="button"
                  onClick={() => selectStep(index)}
                  className={cn(
                    "mb-1.5 flex w-full gap-3 rounded-lg border px-3 py-2.5 text-left transition-colors last:mb-0",
                    active
                      ? "border-indigo-300 bg-indigo-50"
                      : complete
                        ? "border-teal-100 bg-teal-50/60"
                        : "border-transparent hover:border-slate-200 hover:bg-slate-50",
                  )}
                >
                  <span className={cn(
                    "flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-[10px] font-black",
                    active ? "bg-indigo-600 text-white" : complete ? "bg-teal-600 text-white" : "bg-slate-100 text-slate-500",
                  )}>
                    {index + 1}
                  </span>
                  <span className="min-w-0">
                    <code className={cn("block truncate text-[11px] font-bold", active ? "text-indigo-900" : "text-slate-700")}>{step.step}</code>
                    <span className="mt-1 line-clamp-2 block text-[11px] leading-relaxed text-slate-500">{step.action}</span>
                  </span>
                </button>
              </li>
            );
          })}
        </ol>

        <div className="bg-slate-100/70 p-3 sm:p-4">
          <div className="grid gap-3 xl:grid-cols-[minmax(0,1fr)_220px] xl:items-stretch 2xl:grid-cols-[minmax(0,1fr)_250px]">
            <InteractiveVisualFrame diagram={activeDiagram} run={activeRun} stepIndex={stepIndex} />
            {currentStep && (
              <aside
                className="grid overflow-hidden rounded-xl border border-slate-200 bg-white sm:grid-cols-3 xl:grid-cols-1"
                aria-label="Current frame explanation"
              >
                <ExplanationItem
                  eyebrow="Decision"
                  text={currentStep.action}
                  secondaryLabel="Current frame"
                  secondaryText={currentStep.step}
                  tone="indigo"
                  icon={<GitBranch className="h-3.5 w-3.5" />}
                />
                <ExplanationItem
                  eyebrow="Why"
                  text={currentStep.note ?? activeRun.intro ?? "This follows the condition shown in the active frame."}
                  secondaryLabel={currentStep.note && activeRun.intro ? "Rule being applied" : undefined}
                  secondaryText={currentStep.note ? activeRun.intro : undefined}
                  tone="amber"
                />
                <ExplanationItem
                  eyebrow="State change"
                  text={currentStep.state}
                  secondaryLabel="Before"
                  secondaryText={previousStep?.state ?? "Start from the given input"}
                  tone="teal"
                  code
                />
              </aside>
            )}
          </div>
        </div>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3 border-t border-slate-200 bg-white px-4 py-3">
        <div className="flex items-center gap-2">
          <button type="button" onClick={() => selectStep(stepIndex - 1)} disabled={stepIndex === 0} aria-label="Previous dry-run frame" className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-300 text-slate-600 disabled:opacity-35">
            <ChevronLeft className="h-3.5 w-3.5" />
          </button>
          <button type="button" onClick={() => setPlaying((value) => !value)} disabled={totalSteps <= 1} className="inline-flex h-8 items-center gap-2 rounded-lg bg-indigo-600 px-3 text-[11px] font-bold text-white hover:bg-indigo-700 disabled:opacity-40">
            {playing ? <Pause className="h-3.5 w-3.5" /> : <Play className="h-3.5 w-3.5" />}
            {playing ? "Pause" : "Play frames"}
          </button>
          <button type="button" onClick={() => selectStep(stepIndex + 1)} disabled={stepIndex >= totalSteps - 1} aria-label="Next dry-run frame" className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-300 text-slate-600 disabled:opacity-35">
            <ChevronRight className="h-3.5 w-3.5" />
          </button>
          <button type="button" onClick={() => selectStep(0)} aria-label="Restart dry run" className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-500 hover:bg-slate-100">
            <RotateCcw className="h-3.5 w-3.5" />
          </button>
        </div>
        <div className="flex items-baseline gap-2 rounded-lg border border-teal-200 bg-teal-50 px-3 py-2">
          <span className="text-[9px] font-black uppercase tracking-widest text-teal-700">Final result</span>
          <code className="text-xs font-bold text-teal-900">{activeRun.result}</code>
        </div>
      </div>
    </figure>
  );
}

function ExplanationItem({
  eyebrow,
  text,
  tone,
  code = false,
  icon,
  secondaryLabel,
  secondaryText,
}: {
  eyebrow: string;
  text: string;
  tone: "indigo" | "amber" | "teal";
  code?: boolean;
  icon?: React.ReactNode;
  secondaryLabel?: string;
  secondaryText?: string;
}) {
  const toneClasses = {
    indigo: "border-indigo-300 bg-indigo-50/70 text-indigo-700",
    amber: "border-slate-300 bg-slate-50/80 text-slate-600",
    teal: "border-teal-300 bg-teal-50/70 text-teal-700",
  }[tone];

  return (
    <div className={cn("border-l-2 px-3.5 py-3.5 sm:border-l sm:first:border-l-2 xl:border-b xl:border-l-2 xl:last:border-b-0", toneClasses)}>
      <p className="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-[0.14em]">
        {icon}
        {eyebrow}
      </p>
      {code ? (
        <code className="mt-2 block break-words text-[13px] font-bold leading-[1.55] text-slate-800">{text}</code>
      ) : (
        <p className="mt-2 text-[13px] font-semibold leading-[1.55] text-slate-800">{text}</p>
      )}
      {secondaryLabel && secondaryText && (
        <div className="mt-2.5 border-t border-current/15 pt-2">
          <p className="text-[9px] font-black uppercase tracking-[0.12em] opacity-75">{secondaryLabel}</p>
          {code ? (
            <code className="mt-1 block break-words text-[11.5px] font-semibold leading-relaxed text-slate-600">{secondaryText}</code>
          ) : (
            <p className="mt-1 text-[11.5px] font-medium leading-relaxed text-slate-600">{secondaryText}</p>
          )}
        </div>
      )}
    </div>
  );
}
