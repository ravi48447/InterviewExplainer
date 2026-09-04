"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import {
  Code2,
  GitCompareArrows,
  ListChecks,
  Mic,
  RotateCcw,
  Square,
  Volume2,
} from "lucide-react";
import MarkdownContent from "@/components/MarkdownContent";
import { MarkCompleteButton } from "@/components/mark-complete-button";
import { Speakable } from "@/components/speakable";
import type { SpeakingCue, SpeakingCueSupport } from "@/lib/api";
import type { SpeakableV2 } from "@/lib/speakable/schema";
import { toSpeech } from "@/lib/speakable/toSpeech";
import { useContentTheme } from "./ThemeContext";

interface InterviewSpeakingStudioProps {
  content: string;
  questionId: number;
  technologySlug?: string;
  cues?: SpeakingCue[];
  speakableV2?: SpeakableV2;
}

function plainText(markdown: string): string {
  return markdown
    .replace(/```[\s\S]*?```/g, " ")
    .replace(/`([^`]+)`/g, "$1")
    .replace(/[*_#>|~-]/g, " ")
    .replace(/\[([^\]]+)]\([^)]*\)/g, "$1")
    .replace(/\s+/g, " ")
    .trim();
}

function learningStatement(markdown: string): string {
  return markdown.replace(/^([a-z])/, (letter) => letter.toUpperCase());
}

function toSentences(markdown: string): string[] {
  const text = markdown
    .replace(/```[\s\S]*?```/g, " ")
    .replace(/^\s{0,3}#{1,6}\s+/gm, "")
    .replace(/^\s*[-*+]\s+/gm, "")
    .replace(/\n+/g, " ")
    .replace(/\s+/g, " ")
    .trim();
  const matches = text.match(/[^.!?]+[.!?]+|[^.!?]+$/g) ?? [];
  return matches.map((sentence) => sentence.trim()).filter(Boolean);
}

function groupIntoSpeakingPoints(sentences: string[]): string[] {
  if (sentences.length <= 1) return sentences;
  const totalWords = sentences.reduce(
    (total, sentence) => total + plainText(sentence).split(/\s+/).filter(Boolean).length,
    0,
  );
  const groupCount = Math.min(5, Math.max(2, Math.ceil(totalWords / 45)));
  const points: string[] = [];
  let cursor = 0;
  for (let index = 0; index < groupCount; index += 1) {
    const take = Math.ceil((sentences.length - cursor) / (groupCount - index));
    points.push(sentences.slice(cursor, cursor + take).join(" "));
    cursor += take;
  }
  return points.filter(Boolean);
}

function fallbackStageNames(count: number): string[] {
  if (count <= 1) return ["Core idea"];
  if (count === 2) return ["Core idea", "Takeaway"];
  if (count === 3) return ["Core idea", "Example", "Takeaway"];
  if (count === 4) return ["Core idea", "Example", "Important points", "Takeaway"];
  return ["Core idea", "How it works", "Example", "Important points", "Takeaway"];
}

function learningStageNames(cues: SpeakingCue[]): string[] {
  return cues.map((cue, index) => {
    if (index === 0) return "Core idea";
    if (cue.support?.type === "code") return "Example";
    if (index === cues.length - 1) return "Practical takeaway";
    if (cue.support?.type === "comparison") return "Comparison";
    return "Important points";
  });
}

const supportIcon = {
  code: Code2,
  trace: GitCompareArrows,
  checklist: ListChecks,
  comparison: GitCompareArrows,
};

const supportTone = {
  neutral: "border-border bg-background text-foreground",
  blue: "border-primary/20 bg-primary/[0.055] text-primary",
  green: "border-success/20 bg-success/[0.055] text-success",
  orange: "border-warning/25 bg-warning/[0.07] text-warning-foreground",
};

const stageTone = [
  "border-primary/25 bg-background text-primary dark:bg-surface-elevated/30",
  "border-success/25 bg-background text-success dark:bg-surface-elevated/30",
  "border-warning/30 bg-background text-amber-800 dark:bg-surface-elevated/30 dark:text-amber-300",
  "border-slate-300 bg-background text-slate-700 dark:border-slate-600 dark:bg-surface-elevated/30 dark:text-slate-200",
];

const stageDot = ["bg-primary", "bg-success", "bg-warning", "bg-slate-600 dark:bg-slate-300"];

const leadTone = [
  "text-primary",
  "text-success",
  "text-amber-700 dark:text-amber-300",
  "text-slate-700 dark:text-slate-200",
];

function CanvasSupport({ support }: { support?: SpeakingCueSupport }) {
  if (!support) return null;
  const Icon = supportIcon[support.type];
  const isExample = support.type === "code";

  return (
    <div className="mt-4" aria-label={support.title ?? "Visual explanation"}>
      <div className="mb-2.5 flex items-center gap-2">
        <span className={`flex h-6 w-6 items-center justify-center rounded-md border bg-background ${isExample ? "border-success/25 text-success" : "border-warning/30 text-amber-700 dark:text-amber-300"}`}>
          <Icon className="h-3.5 w-3.5" />
        </span>
        <p className="text-[11px] font-extrabold text-foreground">
          {support.title ?? "See it in the example"}
        </p>
      </div>

      {support.code && (
        <pre className="overflow-x-auto rounded-lg border border-slate-800/10 bg-slate-950 px-3.5 py-3 text-[11.5px] leading-5 text-slate-100 shadow-inner">
          <code>{support.code}</code>
        </pre>
      )}

      {support.items && support.items.length > 0 && (
        support.type === "comparison" ? (
          <div className="overflow-hidden rounded-lg border border-border/70 bg-background/80">
            {support.items.map((item, index) => (
              <div key={`${item.label}-${index}`} className={`flex items-start gap-2.5 px-3 py-2.5 ${index > 0 ? "border-t border-border/55" : ""}`}>
                <span className={`mt-1.5 h-2 w-2 shrink-0 rounded-full ${item.tone === "green" ? "bg-success" : item.tone === "orange" ? "bg-warning" : "bg-primary"}`} />
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-3">
                    <span className="text-[11px] font-extrabold text-foreground">{item.label}</span>
                    {item.value && <code className="shrink-0 text-[10.5px] font-black text-foreground/75">{item.value}</code>}
                  </div>
                  {item.detail && <p className="mt-0.5 text-[10.5px] leading-4 text-muted-foreground">{item.detail}</p>}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid gap-2 sm:grid-cols-2">
            {support.items.map((item, index) => (
              <div key={`${item.label}-${index}`} className={`rounded-lg border px-3 py-2 ${supportTone[item.tone ?? "neutral"]}`}>
                <div className="flex items-start justify-between gap-3">
                  <span className="text-[11px] font-bold leading-5">{item.label}</span>
                  {item.value && <code className="shrink-0 rounded bg-background/80 px-1.5 py-0.5 text-[11px] font-black">{item.value}</code>}
                </div>
                {item.detail && <p className="mt-1 text-[10.5px] leading-4 text-muted-foreground">{item.detail}</p>}
              </div>
            ))}
          </div>
        )
      )}

      {support.caption && (
        <p className="mt-2 text-[10.5px] leading-4 text-muted-foreground">
          {support.caption}
        </p>
      )}
    </div>
  );
}

export function InterviewSpeakingStudio({
  content,
  questionId,
  technologySlug,
  cues,
  speakableV2,
}: InterviewSpeakingStudioProps) {
  const { theme } = useContentTheme();
  const dark = theme === "dark";
  const structuredCues = useMemo(
    () => (cues ?? []).filter((cue) => cue.cue.trim() && cue.spokenText.trim()),
    [cues],
  );
  const hasStructuredCues = structuredCues.length > 0;
  const approvedV2 = speakableV2?.speakable_status === "approved" ? speakableV2 : undefined;
  const legacyPoints = useMemo(
    () => groupIntoSpeakingPoints(toSentences(approvedV2 ? toSpeech(approvedV2) : content)),
    [approvedV2, content],
  );
  const points = hasStructuredCues
    ? structuredCues.map((cue) => learningStatement(cue.spokenText.trim()))
    : legacyPoints;
  const [activePoint, setActivePoint] = useState<number | null>(hasStructuredCues ? 0 : null);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [recordingUrl, setRecordingUrl] = useState<string | null>(null);
  const [recordingError, setRecordingError] = useState<string | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const speechRunRef = useRef(0);

  const selectedText = plainText(points.join(" "));
  const wordCount = selectedText.split(/\s+/).filter(Boolean).length;
  const speakingMinutes = Math.max(1, Math.round((wordCount / 135) * 10) / 10);

  useEffect(() => {
    setActivePoint(hasStructuredCues ? 0 : null);
  }, [questionId, hasStructuredCues]);

  useEffect(() => {
    return () => {
      speechRunRef.current += 1;
      if (typeof window !== "undefined") window.speechSynthesis?.cancel();
      if (recordingUrl) URL.revokeObjectURL(recordingUrl);
      mediaRecorderRef.current?.stream.getTracks().forEach((track) => track.stop());
    };
  }, [recordingUrl]);

  function stopSpeaking() {
    speechRunRef.current += 1;
    window.speechSynthesis?.cancel();
    setIsSpeaking(false);
    if (!hasStructuredCues) setActivePoint(null);
  }

  function listen(startIndex = 0) {
    if (!("speechSynthesis" in window) || points.length === 0) return;
    stopSpeaking();
    const run = speechRunRef.current;
    setIsSpeaking(true);

    const speakAt = (index: number) => {
      if (speechRunRef.current !== run || index >= points.length) {
        setIsSpeaking(false);
        if (!hasStructuredCues) setActivePoint(null);
        return;
      }
      setActivePoint(index);
      const utterance = new SpeechSynthesisUtterance(plainText(points[index]));
      utterance.rate = 0.96;
      utterance.onend = () => speakAt(index + 1);
      utterance.onerror = () => setIsSpeaking(false);
      window.speechSynthesis.speak(utterance);
    };

    speakAt(startIndex);
  }

  async function startRecording() {
    setRecordingError(null);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream);
      const chunks: Blob[] = [];
      recorder.ondataavailable = (event) => {
        if (event.data.size > 0) chunks.push(event.data);
      };
      recorder.onstop = () => {
        const blob = new Blob(chunks, { type: recorder.mimeType || "audio/webm" });
        if (recordingUrl) URL.revokeObjectURL(recordingUrl);
        setRecordingUrl(URL.createObjectURL(blob));
        stream.getTracks().forEach((track) => track.stop());
      };
      mediaRecorderRef.current = recorder;
      recorder.start();
      setIsRecording(true);
    } catch {
      setRecordingError("Microphone access is needed to record a practice answer.");
    }
  }

  function stopRecording() {
    const recorder = mediaRecorderRef.current;
    if (recorder && recorder.state !== "inactive") recorder.stop();
    setIsRecording(false);
  }

  function resetPractice() {
    stopSpeaking();
    if (recordingUrl) URL.revokeObjectURL(recordingUrl);
    setRecordingUrl(null);
    setRecordingError(null);
  }

  if (!selectedText) return null;

  const header = (
    <div className={`flex flex-wrap items-center gap-3 border-b px-5 py-3.5 ${dark ? "border-border/60 bg-surface-elevated/40" : "border-slate-200 bg-stone-50/70"}`}>
      <div className="flex min-w-0 flex-1 items-center gap-2.5">
        <span className="text-[11px] font-extrabold tabular-nums text-success">02</span>
        {technologySlug ? (
          <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-success/20 bg-background">
            <Image src={`/logos/${technologySlug}.svg`} alt={`${technologySlug} logo`} width={20} height={20} className="h-5 w-5 object-contain" />
          </span>
        ) : (
          <Mic className="h-4 w-4 text-primary" />
        )}
        <div>
          <h2 className="text-[13px] font-extrabold text-foreground">Interview answer</h2>
          <p className="text-[11px] text-muted-foreground">
            {hasStructuredCues ? "Learn the idea first, then explain it naturally in your own words" : "Understand the points, then answer naturally in your own words"}
          </p>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <span className="hidden rounded-full border border-success/20 bg-background px-2.5 py-1 text-[11px] font-semibold text-success sm:inline-flex">~{speakingMinutes} min answer</span>
        <button type="button" onClick={isSpeaking ? stopSpeaking : () => listen(0)} className="inline-flex items-center gap-2 rounded-lg border border-success/25 bg-background px-3 py-2 text-[12px] font-bold text-success hover:bg-success/5">
          {isSpeaking ? <Square className="h-3.5 w-3.5" /> : <Volume2 className="h-3.5 w-3.5" />}
          {isSpeaking ? "Stop" : "Listen"}
        </button>
        <button type="button" onClick={isRecording ? stopRecording : startRecording} className={`inline-flex items-center gap-2 rounded-lg px-3 py-2 text-[12px] font-bold ${isRecording ? "bg-destructive text-destructive-foreground" : "bg-primary text-primary-foreground hover:bg-primary/90"}`}>
          {isRecording ? <Square className="h-3.5 w-3.5" /> : <Mic className="h-3.5 w-3.5" />}
          <span className="hidden sm:inline">{isRecording ? "Stop recording" : "Practice aloud"}</span>
          <span className="sm:hidden">{isRecording ? "Stop" : "Practice"}</span>
        </button>
      </div>
    </div>
  );

  const recordingPanel = recordingUrl || recordingError ? (
    <div className="mt-4 rounded-lg border border-border bg-surface/40 p-3">
      {recordingUrl && <div className="flex flex-wrap items-center gap-3"><audio controls src={recordingUrl} className="h-9 flex-1" aria-label="Your recorded answer" /><button type="button" onClick={resetPractice} className="inline-flex items-center gap-1.5 text-[11px] font-bold text-muted-foreground hover:text-foreground"><RotateCcw className="h-3.5 w-3.5" /> Retry</button></div>}
      {recordingError && <p className="text-[12px] text-destructive">{recordingError}</p>}
    </div>
  ) : null;

  if (approvedV2 && !hasStructuredCues) {
    return (
      <section className="mb-6" data-testid="interview-speaking-answer" data-answer-source="reviewed-v2">
        <div className={`overflow-hidden rounded-xl border ${dark ? "border-border/60 bg-surface" : "border-slate-200 bg-[#fffdf9] shadow-sm"}`}>
          {header}
          <div className="p-4 sm:p-5">
            <div className={`overflow-hidden rounded-xl border ${dark ? "border-border/60 bg-surface-elevated/20" : "border-stone-200 bg-white"}`}>
              <div className={`border-b border-border/60 px-5 py-3 ${dark ? "bg-surface-elevated/35" : "bg-stone-50/80"}`}>
                <p className="text-[10px] font-extrabold uppercase tracking-[0.15em] text-success">Reviewed interview answer</p>
                <p className="mt-1 text-[11px] text-muted-foreground">Understand the flow, then explain it naturally in your own words.</p>
              </div>
              <div className="px-5 py-5 sm:px-7 sm:py-6">
                <Speakable source={{ kind: "v2", v2: approvedV2 }} theme={dark ? "dark" : "light"} />
              </div>
            </div>
            {recordingPanel}
            <div className="mt-5 border-t border-border pt-4"><MarkCompleteButton questionId={questionId} /></div>
          </div>
        </div>
      </section>
    );
  }

  if (hasStructuredCues) {
    const exampleSupport = structuredCues.find((cue) => cue.support?.type === "code")?.support;
    const decisionSupport = structuredCues.at(-1)?.support;
    const foundationItems = structuredCues[0]?.support?.items?.slice(1);
    const recallRule = structuredCues.at(-1)?.recallRule;
    const learningStages = learningStageNames(structuredCues);

    return (
      <section className="mb-6" data-testid="interview-speaking-answer">
        <div className={`overflow-hidden rounded-xl border ${dark ? "border-border/60 bg-surface" : "border-slate-200 bg-[#fffdf9] shadow-sm"}`}>
          {header}
          <div className="p-4 sm:p-5">
            <div className={`overflow-hidden rounded-xl border ${dark ? "border-border/60 bg-surface-elevated/20" : "border-stone-200 bg-white"}`}>
              <div className={`border-b border-border/60 px-5 py-3 ${dark ? "bg-surface-elevated/35" : "bg-stone-50/80"}`}>
                <div className="flex items-center gap-1.5 overflow-hidden" aria-label="Answer flow">
                  {structuredCues.map((cue, index) => (
                    <div key={`flow-${cue.cue}`} className="flex min-w-0 flex-1 items-center">
                      <div className={`flex min-w-0 flex-1 items-center justify-center gap-1.5 rounded-md border px-2 py-1.5 transition-all ${stageTone[index % stageTone.length]} ${isSpeaking && activePoint === index ? "shadow-sm ring-1 ring-current/10" : "opacity-80"}`}>
                        <span className={`h-1.5 w-1.5 shrink-0 rounded-full ${stageDot[index % stageDot.length]}`} />
                        <span className="truncate text-[10px] font-extrabold uppercase tracking-[0.1em]">{learningStages[index]}</span>
                      </div>
                      {index < structuredCues.length - 1 && <span className="mx-1 h-px w-4 shrink-0 bg-border" />}
                    </div>
                  ))}
                </div>
              </div>

              <div className="grid lg:grid-cols-[minmax(0,1.18fr)_minmax(300px,0.82fr)]">
                <article className="p-5 sm:p-6 lg:border-r lg:border-border/60">
                  <div className="mb-4">
                    <p className="text-[10px] font-extrabold uppercase tracking-[0.15em] text-success">Interview-ready explanation</p>
                    <p className="mt-1 text-[11px] text-muted-foreground">Understand the knowledge; the wording can remain your own.</p>
                  </div>

                  <div className="relative ml-1 border-l-2 border-slate-200 pl-5 dark:border-border">
                    {structuredCues.map((cue, index) => (
                      <div key={`script-${cue.cue}`} className={`relative rounded-r-lg py-3 pr-3 transition-colors ${index > 0 ? "border-t border-border/45" : ""} ${isSpeaking && activePoint === index ? "bg-primary/[0.045] pl-3" : ""}`}>
                        <span className={`absolute -left-[27px] top-[23px] h-2.5 w-2.5 rounded-full border-2 border-background ${stageDot[index % stageDot.length]} ${isSpeaking && activePoint === index ? "ring-2 ring-primary/15" : ""}`} />
                        <p className={`mb-1 text-[10px] font-extrabold uppercase tracking-[0.08em] ${leadTone[index % leadTone.length]}`}>{learningStages[index]}</p>
                        <div className="text-[14px] leading-7 text-foreground/88 [&_code]:border-slate-300 [&_code]:bg-slate-100 [&_code]:text-slate-700 dark:[&_code]:border-slate-600 dark:[&_code]:bg-slate-800 dark:[&_code]:text-slate-100">
                          <MarkdownContent content={learningStatement(cue.spokenText.trim())} inline />
                        </div>

                        {index === 0 && foundationItems && foundationItems.length > 0 && (
                          <div className="mt-3 grid overflow-hidden rounded-lg border border-border/65 bg-surface/30 sm:grid-cols-3 sm:divide-x sm:divide-border/55">
                            {foundationItems.map((item, itemIndex) => (
                              <div key={item.label} className={`px-2.5 py-2 ${itemIndex > 0 ? "border-t border-border/55 sm:border-t-0" : ""}`}>
                                <p className={`text-[10px] font-extrabold ${leadTone[itemIndex % leadTone.length]}`}>{item.label}</p>
                                <p className="mt-0.5 text-[9.5px] leading-4 text-muted-foreground">{item.detail}</p>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </article>

                <aside className={`p-5 sm:p-6 ${dark ? "bg-surface-elevated/20" : "bg-stone-50/65"}`}>
                  <div>
                    <p className="text-[10px] font-extrabold uppercase tracking-[0.14em] text-success">Example in code</p>
                    <CanvasSupport support={exampleSupport} />
                  </div>
                  <div className="my-5 border-t border-border/60" />
                  <div>
                    <p className="text-[10px] font-extrabold uppercase tracking-[0.14em] text-amber-700 dark:text-amber-300">Quick comparison</p>
                    <CanvasSupport support={decisionSupport} />
                  </div>
                </aside>
              </div>

              {recallRule && (
                <div className={`flex items-start gap-3 border-t border-border/60 px-5 py-3.5 ${dark ? "bg-warning/[0.04]" : "bg-amber-50/55"}`}>
                  <span className="mt-1 h-2 w-2 shrink-0 rounded-full bg-warning" />
                  <p className="text-[11.5px] leading-5 text-foreground/80 [&_code]:border-amber-200 [&_code]:bg-amber-100/70 [&_code]:text-amber-900 dark:[&_code]:border-amber-700 dark:[&_code]:bg-amber-950/40 dark:[&_code]:text-amber-200"><strong className="font-extrabold text-foreground">Recall rule:</strong> <MarkdownContent content={recallRule} inline /></p>
                </div>
              )}
            </div>
            {recordingPanel}
            <div className="mt-5 border-t border-border pt-4"><MarkCompleteButton questionId={questionId} /></div>
          </div>
        </div>
      </section>
    );
  }

  const legacyStages = fallbackStageNames(points.length);

  return (
    <section className="mb-6" data-testid="interview-speaking-answer" data-answer-source="legacy-guided">
      <div className={`overflow-hidden rounded-xl border ${dark ? "border-border/60 bg-surface" : "border-slate-200 bg-[#fffdf9] shadow-sm"}`}>
        {header}
        <div className="p-4 sm:p-5">
          <div className={`overflow-hidden rounded-xl border ${dark ? "border-border/60 bg-surface-elevated/20" : "border-stone-200 bg-white"}`} aria-live="polite">
            <div className={`border-b border-border/60 px-5 py-3 ${dark ? "bg-surface-elevated/35" : "bg-stone-50/80"}`}>
              <div className="flex items-center gap-1.5 overflow-hidden" aria-label="Answer flow">
                {legacyStages.map((stage, index) => (
                  <div key={`${stage}-${index}`} className="flex min-w-0 flex-1 items-center">
                    <div className={`flex min-w-0 flex-1 items-center justify-center gap-1.5 rounded-md border px-2 py-1.5 transition-all ${stageTone[index % stageTone.length]} ${isSpeaking && activePoint === index ? "shadow-sm ring-1 ring-current/10" : "opacity-80"}`}>
                      <span className={`h-1.5 w-1.5 shrink-0 rounded-full ${stageDot[index % stageDot.length]}`} />
                      <span className="truncate text-[10px] font-extrabold uppercase tracking-[0.1em]">{stage}</span>
                    </div>
                    {index < legacyStages.length - 1 && <span className="mx-1 h-px w-4 shrink-0 bg-border" />}
                  </div>
                ))}
              </div>
            </div>

            <article className="mx-auto max-w-4xl p-5 sm:p-7">
              <div className="mb-4">
                <p className="text-[10px] font-extrabold uppercase tracking-[0.15em] text-success">A natural answer you can speak</p>
                <p className="mt-1 text-[11px] text-muted-foreground">Learn the idea in order; use your own words in the interview.</p>
              </div>
              <div className="relative ml-1 border-l-2 border-slate-200 pl-5 dark:border-border">
                {points.map((point, index) => (
                  <div key={`${point}-${index}`} data-testid="speaking-beat" className={`relative rounded-r-lg py-3 pr-3 transition-colors ${index > 0 ? "border-t border-border/45" : ""} ${isSpeaking && activePoint === index ? "bg-primary/[0.045] pl-3" : ""}`}>
                    <span className={`absolute -left-[27px] top-[23px] h-2.5 w-2.5 rounded-full border-2 border-background ${stageDot[index % stageDot.length]} ${isSpeaking && activePoint === index ? "ring-2 ring-primary/15" : ""}`} />
                    <p className={`mb-1 text-[10px] font-extrabold uppercase tracking-[0.08em] ${leadTone[index % leadTone.length]}`}>{legacyStages[index] ?? `Point ${index + 1}`}</p>
                    <div className="text-[14px] leading-7 text-foreground/88 [&_code]:border-slate-300 [&_code]:bg-slate-100 [&_code]:text-slate-700 dark:[&_code]:border-slate-600 dark:[&_code]:bg-slate-800 dark:[&_code]:text-slate-100"><MarkdownContent content={point} inline /></div>
                  </div>
                ))}
              </div>
            </article>
          </div>
          {recordingPanel}
          <div className="mt-5 border-t border-border pt-4"><MarkCompleteButton questionId={questionId} /></div>
        </div>
      </div>
    </section>
  );
}
