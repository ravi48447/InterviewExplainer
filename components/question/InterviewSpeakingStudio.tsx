"use client";

import { useEffect, useId, useMemo, useRef, useState } from "react";
import Image from "next/image";
import {
  ChevronDown,
  ChevronUp,
  Code2,
  GitCompareArrows,
  ListChecks,
  Square,
  Volume2,
} from "lucide-react";
import MarkdownContent from "@/components/MarkdownContent";
import { MarkCompleteButton } from "@/components/mark-complete-button";
import type { SpeakingCue, SpeakingCueSupport } from "@/lib/api";
import type { SpeakableV2 } from "@/lib/speakable/schema";
import { toSpeech } from "@/lib/speakable/toSpeech";

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

function sentenceFragment(value: string): string {
  return /^[A-Z]{2,}\b/.test(value) ? value : value.replace(/^([A-Z])/, (letter) => letter.toLowerCase());
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

const supportIcon = {
  code: Code2,
  trace: GitCompareArrows,
  checklist: ListChecks,
  comparison: GitCompareArrows,
};

const supportAccent = {
  neutral: "bg-slate-400 dark:bg-slate-500",
  blue: "bg-blue-500 dark:bg-blue-400",
  green: "bg-emerald-500 dark:bg-emerald-400",
  orange: "bg-amber-500 dark:bg-amber-400",
};

const supportPresentation: Record<SpeakingCueSupport["type"], { header: string; icon: string }> = {
  code: {
    header: "bg-slate-100/80 dark:bg-slate-800/80",
    icon: "text-slate-600 dark:text-slate-300",
  },
  comparison: {
    header: "bg-blue-50/75 dark:bg-blue-950/20",
    icon: "text-blue-700 dark:text-blue-300",
  },
  trace: {
    header: "bg-emerald-50/70 dark:bg-emerald-950/20",
    icon: "text-emerald-700 dark:text-emerald-300",
  },
  checklist: {
    header: "bg-amber-50/70 dark:bg-amber-950/20",
    icon: "text-amber-700 dark:text-amber-300",
  },
};

function structuredArticleText(cues: SpeakingCue[]): string {
  return cues
    .flatMap((cue) => [
      cue.stage,
      cue.spokenText,
      cue.recallRule,
      cue.support?.title,
      cue.support?.code,
      cue.support?.caption,
      ...(cue.support?.items ?? []).flatMap((item) => [item.label, item.value, item.detail]),
    ])
    .filter(Boolean)
    .join(" ");
}

function wordCount(value: string): number {
  const text = plainText(value);
  return text ? text.split(/\s+/).filter(Boolean).length : 0;
}

/**
 * Older answers sometimes contain several ideas in one very long paragraph.
 * Preserve the authored wording, but add reading breaks when there is no
 * existing Markdown structure for the author to have chosen deliberately.
 */
function addReadingRhythm(markdown: string): string {
  const value = markdown.trim();
  const alreadyStructured = /\n\s*\n|^\s{0,3}(?:#{1,6}\s|[-*+]\s|\d+[.)]\s|>|```|\|)/m.test(value);
  if (alreadyStructured || wordCount(value) < 120) return value;

  const sentences = value.match(/[^.!?]+(?:[.!?]+(?=\s|$)|$)/g)?.map((sentence) => sentence.trim()).filter(Boolean) ?? [];
  if (sentences.length < 5) return value;

  const paragraphs: string[] = [sentences[0]];
  let current: string[] = [];
  let currentWords = 0;
  const beginsNewIdea = /^(?:The\s+[A-Z]\s+(?:is|stands)\b|For example\b|In practice\b|A common\b|The trade-off\b|Finally\b)/i;

  for (const sentence of sentences.slice(1)) {
    const sentenceWords = wordCount(sentence);
    const shouldBreak = current.length > 0 && (
      current.length >= 3
      || currentWords + sentenceWords > 72
      || beginsNewIdea.test(sentence)
    );
    if (shouldBreak) {
      paragraphs.push(current.join(" "));
      current = [];
      currentWords = 0;
    }
    current.push(sentence);
    currentWords += sentenceWords;
  }
  if (current.length > 0) paragraphs.push(current.join(" "));
  return paragraphs.join("\n\n");
}

type GuidedParagraphRole = "core" | "explanation" | "example" | "boundary" | "takeaway" | "rich";

interface GuidedParagraph {
  id: string;
  label: string;
  role: GuidedParagraphRole;
  content: string;
}

const guidedParagraphMeta: Record<GuidedParagraphRole, { label: string; shell: string; marker: string }> = {
  core: {
    label: "Core idea",
    shell: "border-l-[3px] border-blue-500 bg-blue-50/55 pl-4 pr-3 py-3.5 dark:border-blue-400 dark:bg-blue-950/15",
    marker: "text-blue-700 dark:text-blue-300",
  },
  explanation: {
    label: "How it works",
    shell: "border-t border-[#e3ebe8] pt-5 dark:border-slate-800",
    marker: "text-[#50706b] dark:text-slate-400",
  },
  example: {
    label: "Example",
    shell: "rounded-xl border border-emerald-200/80 bg-emerald-50/45 px-4 py-4 dark:border-emerald-900/60 dark:bg-emerald-950/15 sm:px-5",
    marker: "text-emerald-700 dark:text-emerald-300",
  },
  boundary: {
    label: "Important boundary",
    shell: "rounded-xl border border-amber-200/90 bg-amber-50/55 px-4 py-4 dark:border-amber-900/55 dark:bg-amber-950/15 sm:px-5",
    marker: "text-amber-800 dark:text-amber-300",
  },
  takeaway: {
    label: "Practical takeaway",
    shell: "border-t border-[#d8e5e1] pt-5 dark:border-slate-700",
    marker: "text-[#2d7165] dark:text-emerald-300",
  },
  rich: {
    label: "Complete answer",
    shell: "",
    marker: "text-[#50706b] dark:text-slate-400",
  },
};

function roleForParagraph(markdown: string, index: number, total: number): GuidedParagraphRole {
  if (index === 0) return "core";

  const value = plainText(markdown);
  if (/^(?:for example|for instance|consider|suppose|imagine|take the case)\b/i.test(value)) {
    return "example";
  }
  if (/^(?:however|the trade-?off|a limitation|the (?:important )?boundary|one (?:important )?boundary|a common mistake|be careful|watch out)\b/i.test(value)) {
    return "boundary";
  }
  if (index === total - 1 && /\b(?:choose|default|therefore|in practice|the main point|the practical|use)\b/i.test(value)) {
    return "takeaway";
  }
  return "explanation";
}

function guidedParagraphs(markdown: string): GuidedParagraph[] {
  const readable = addReadingRhythm(markdown);
  // Legacy answers do not contain authored semantic headings. Keep their
  // wording as one readable article instead of guessing labels such as
  // “What matters” from paragraph position. Reviewed answers provide
  // explicit structured cues, so their real headings are rendered above.
  return [{
    id: "complete-answer",
    label: guidedParagraphMeta.rich.label,
    role: "rich",
    content: readable,
  }];
}

function AnswerSupport({ support }: { support?: SpeakingCueSupport }) {
  const codeRegionId = useId();
  const [codeExpanded, setCodeExpanded] = useState(false);

  useEffect(() => {
    setCodeExpanded(false);
  }, [support?.code]);

  if (!support) return null;
  const Icon = supportIcon[support.type];
  const isFlow = support.type === "trace";
  const items = support.items ?? [];
  const codeLineCount = support.code?.trimEnd().split("\n").length ?? 0;
  const canCollapseCode = codeLineCount > 16;
  const ItemList = isFlow ? "ol" : "ul";
  const presentation = supportPresentation[support.type];
  const traceLayout = items.length === 4
    ? "sm:grid-cols-2"
    : items.length === 3
      ? "md:grid-cols-3"
      : items.length === 2
        ? "sm:grid-cols-2"
        : "";
  const itemLayout = isFlow
    ? traceLayout
    : items.length === 4
      ? "sm:grid-cols-2"
      : items.length === 3
      ? "md:grid-cols-3"
      : items.length > 1
        ? "sm:grid-cols-2"
        : "";
  const flowArrowBreakpoint = items.length === 3 ? "md:flex" : "sm:flex";

  return (
    <figure
      data-support-type={support.type}
      className="mt-5 max-w-[48rem] overflow-hidden rounded-xl border border-[#d8e4e1] bg-[#fbfdfc] shadow-[0_1px_2px_rgba(28,70,61,0.035)] dark:border-slate-700 dark:bg-slate-900/70"
      aria-label={support.title ?? "Supporting example"}
    >
      <figcaption className={`flex min-h-11 items-center gap-2.5 border-b border-[#dce7e4] px-4 py-2.5 dark:border-slate-700 ${presentation.header}`}>
        <Icon aria-hidden="true" className={`h-4 w-4 shrink-0 ${presentation.icon}`} />
        <span className="min-w-0 flex-1 font-display text-[13px] font-semibold text-[#26485a] dark:text-slate-200">
          {support.title ?? "Supporting example"}
        </span>
        {support.language && (
          <span className="rounded bg-white/70 px-2 py-0.5 font-mono text-[10px] font-medium uppercase tracking-[0.08em] text-[#657985] dark:bg-slate-900/70 dark:text-slate-400">
            {support.language}
          </span>
        )}
      </figcaption>

      {support.code && (
        <>
          <div className={`relative ${canCollapseCode && !codeExpanded ? "max-h-[320px] overflow-hidden" : ""}`}>
            <pre id={codeRegionId} className="overflow-x-auto bg-[#101827] px-4 py-4 font-mono text-[13px] leading-[1.62] text-slate-100 outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-emerald-400/70 sm:px-5" tabIndex={0} aria-label={`${support.title ?? "Example"} code`}>
              <code>{support.code}</code>
            </pre>
            {canCollapseCode && !codeExpanded && (
              <span aria-hidden="true" className="pointer-events-none absolute inset-x-0 bottom-0 h-20 bg-gradient-to-b from-transparent to-[#101827]" />
            )}
          </div>
          {canCollapseCode && (
            <button
              type="button"
              onClick={() => setCodeExpanded((value) => !value)}
              aria-expanded={codeExpanded}
              aria-controls={codeRegionId}
              className="flex min-h-10 w-full items-center justify-center gap-1.5 border-t border-[#dce7e4] bg-[#f7faf9] px-4 text-[11.5px] font-semibold text-[#3f675f] outline-none transition-colors hover:bg-[#eef5f2] hover:text-[#21695c] focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-emerald-500/60 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-emerald-300"
            >
              {codeExpanded ? <ChevronUp aria-hidden="true" className="h-3.5 w-3.5" /> : <ChevronDown aria-hidden="true" className="h-3.5 w-3.5" />}
              {codeExpanded ? "Collapse example" : `Show all ${codeLineCount} lines`}
            </button>
          )}
        </>
      )}

      {items.length > 0 && (
        <ItemList className={`grid gap-px bg-[#e2ebe8] dark:bg-slate-700 ${itemLayout}`}>
          {items.map((item, index) => (
            <li
              key={`${item.label}-${index}`}
              className="relative min-w-0 bg-white px-4 py-4 dark:bg-slate-900 sm:px-5"
            >
              <div className="flex min-w-0 flex-wrap items-start gap-x-2.5 gap-y-1">
                {isFlow ? (
                  <span aria-hidden="true" className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full border border-[#cbdcd7] bg-[#f4f9f7] font-mono text-[10px] font-semibold text-[#3e6f65] dark:border-slate-600 dark:bg-slate-800 dark:text-emerald-300">
                    {index + 1}
                  </span>
                ) : (
                  <span aria-hidden="true" className={`mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full ${supportAccent[item.tone ?? "neutral"]}`} />
                )}
                <span className="min-w-[8rem] flex-1 font-display text-[13px] font-semibold leading-5 text-[#243e50] dark:text-slate-200">{item.label}</span>
                {item.value && <code className="max-w-full break-words rounded-[3px] bg-[#eef3f3] px-1.5 py-0.5 font-mono text-[11px] font-semibold leading-5 text-[#365566] dark:bg-slate-800 dark:text-slate-200">{item.value}</code>}
              </div>
              {item.detail && <p className="mt-2 text-[12.5px] leading-[1.62] text-[#5d707b] dark:text-slate-400">{item.detail}</p>}
              {isFlow && items.length <= 3 && index < items.length - 1 && (
                <span aria-hidden="true" className={`absolute -right-2.5 top-1/2 z-10 hidden h-5 w-5 -translate-y-1/2 items-center justify-center rounded-full border border-[#d2dfdc] bg-white text-[12px] text-[#4a776d] shadow-sm dark:border-slate-600 dark:bg-slate-900 dark:text-emerald-300 ${flowArrowBreakpoint}`}>→</span>
              )}
            </li>
          ))}
        </ItemList>
      )}

      {support.caption && (
        <p className="border-t border-[#e1e9e7] bg-[#f8fbfa] px-4 py-3 text-[12px] leading-[1.6] text-[#60727d] dark:border-slate-700 dark:bg-slate-900 dark:text-slate-400 sm:px-5">
          {support.caption}
        </p>
      )}
    </figure>
  );
}

function FullAnswerArticle({ content }: { content: string }) {
  const blocks = guidedParagraphs(content);
  const isRichMarkdown = blocks.length === 1 && blocks[0].role === "rich";

  if (isRichMarkdown) {
    return (
      <article data-testid="interview-answer-article" data-presentation="authored-markdown" className="interview-answer-copy font-sans text-[15.5px] leading-[1.75] text-[#334861] dark:text-slate-300 [&_h2]:mb-3 [&_h2]:mt-8 [&_h2]:font-display [&_h2]:text-[21px] [&_h2]:font-bold [&_h2]:tracking-[-0.016em] [&_h2]:text-[#173b4d] [&_h3]:mb-2.5 [&_h3]:mt-7 [&_h3]:font-display [&_h3]:text-[18px] [&_h3]:font-semibold [&_h3]:text-[#285565] [&_p]:mb-4 [&_li]:mb-2 [&_strong]:font-semibold [&_strong]:text-[#173b4d] [&_code]:!rounded-[3px] [&_code]:!border-0 [&_code]:!bg-[#eef3f3] [&_code]:!text-[#263e4b] dark:[&_h2]:text-slate-100 dark:[&_h3]:text-emerald-200 dark:[&_strong]:text-slate-100 dark:[&_code]:!bg-slate-800 dark:[&_code]:!text-slate-200">
        <MarkdownContent content={blocks[0].content} />
      </article>
    );
  }

  return (
    <article data-testid="interview-answer-article" data-presentation="guided-prose" className="interview-answer-copy space-y-6 font-sans text-[#334861] dark:text-slate-300">
      {blocks.map((block) => {
        const meta = guidedParagraphMeta[block.role];
        return (
          <section key={block.id} id={block.id} data-answer-role={block.role} className={`scroll-mt-24 ${meta.shell}`}>
            <p className={`mb-2 font-sans text-[10.5px] font-bold uppercase tracking-[0.14em] ${meta.marker}`}>
              {block.label}
            </p>
            <div className={`max-w-[68ch] text-[15.5px] leading-[1.75] tracking-[-0.002em] [&_.markdown-body>p]:mb-0 [&_strong]:font-semibold [&_strong]:text-[#173b4d] [&_code]:!rounded-[3px] [&_code]:!border-0 [&_code]:!bg-[#eef3f3] [&_code]:!px-1 [&_code]:!py-[2px] [&_code]:!font-mono [&_code]:!text-[0.88em] [&_code]:!font-medium [&_code]:!text-[#263e4b] dark:[&_strong]:text-slate-100 dark:[&_code]:!bg-slate-800 dark:[&_code]:!text-slate-200 ${block.role === "core" ? "text-[16.5px] font-medium leading-[1.76] text-[#294656] dark:text-slate-200" : ""}`}>
              <MarkdownContent content={block.content} />
            </div>
          </section>
        );
      })}
    </article>
  );
}

export function InterviewSpeakingStudio({
  content,
  questionId,
  technologySlug,
  cues,
  speakableV2,
}: InterviewSpeakingStudioProps) {
  const structuredCues = useMemo(
    () => (cues ?? []).filter((cue) => cue.cue.trim() && cue.spokenText.trim()),
    [cues],
  );
  const hasStructuredCues = structuredCues.length > 0;
  const approvedV2 = speakableV2?.speakable_status === "approved" ? speakableV2 : undefined;
  const structuredText = useMemo(() => structuredArticleText(structuredCues), [structuredCues]);
  // Structured cues are explicitly authored article blocks. When they exist,
  // they are the visible source; plain Markdown and approved V2 are fallbacks.
  const useStructuredArticle = hasStructuredCues;
  const structuredPracticeText = structuredCues
    .flatMap((cue) => [
      cue.spokenText,
      ...(cue.support?.items ?? []).flatMap((item) => [item.label, item.detail]),
      cue.support?.caption,
      cue.recallRule,
    ])
    .filter(Boolean)
    .join("\n\n");
  const practiceSource = useStructuredArticle
    ? structuredPracticeText
    : content.trim() || (approvedV2 ? toSpeech(approvedV2) : "");
  const points = useMemo(() => toSentences(practiceSource), [practiceSource]);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const speechRunRef = useRef(0);

  useEffect(() => {
    setIsSpeaking(false);
    speechRunRef.current += 1;
    if (typeof window !== "undefined") window.speechSynthesis?.cancel();
  }, [questionId]);

  useEffect(() => {
    return () => {
      speechRunRef.current += 1;
      if (typeof window !== "undefined") window.speechSynthesis?.cancel();
    };
  }, []);

  function stopSpeaking() {
    speechRunRef.current += 1;
    window.speechSynthesis?.cancel();
    setIsSpeaking(false);
  }

  function listen(startIndex = 0) {
    if (!("speechSynthesis" in window) || points.length === 0) return;
    window.speechSynthesis.cancel();
    speechRunRef.current += 1;
    const run = speechRunRef.current;
    setIsSpeaking(true);

    const speakAt = (index: number) => {
      if (speechRunRef.current !== run || index >= points.length) {
        setIsSpeaking(false);
        return;
      }
      const utterance = new SpeechSynthesisUtterance(plainText(points[index]));
      utterance.rate = 0.96;
      utterance.onend = () => speakAt(index + 1);
      utterance.onerror = () => {
        if (speechRunRef.current === run) setIsSpeaking(false);
      };
      window.speechSynthesis.speak(utterance);
    };

    speakAt(startIndex);
  }

  if (!content.trim() && !structuredText.trim() && !approvedV2) return null;

  const sectionTitle = (cue: SpeakingCue) => {
    const stage = cue.stage?.trim().toLowerCase();
    const supportTitle = cue.support?.title?.trim();
    if (stage === "meaning") return "What it means";
    if (stage === "example") return supportTitle ? `A working ${sentenceFragment(supportTitle)}` : "A working example";
    if (stage === "request flow") return supportTitle ? `What happens during ${supportTitle}` : "How the request works";
    if (stage === "design") return "Responsibilities and practical boundaries";
    if (stage === "use") return "Where it is useful";
    if (stage === "best fit") return "Where it fits best";
    if (stage === "decision") return "How to choose safely";
    if (stage === "important points") return "Details that matter";
    if (stage === "trade-off") return "Trade-offs";
    if (stage === "practical takeaway") return "Practical takeaway";
    return cue.stage?.trim() || cue.cue.trim();
  };

  let answerSource = "full-content";
  let articleContent;

  if (useStructuredArticle) {
    const takeaway = [...structuredCues].reverse().find((cue) => cue.recallRule)?.recallRule;
    answerSource = "structured-article";
    articleContent = (
      <>
        <article
          data-testid="interview-answer-article"
          data-presentation="guided-article"
          className="interview-answer-copy"
        >
          {structuredCues.map((cue, index) => (
            <section
              id={`interview-part-${index + 1}`}
              key={`answer-part-${cue.cue}`}
              data-testid="speaking-beat"
              className={`scroll-mt-24 ${index > 0 ? "mt-7 border-t border-[#e0e9e6] pt-6 dark:border-slate-800" : ""}`}
            >
              <h3 className="max-w-[42rem] font-display text-[19px] font-semibold leading-[1.4] tracking-[-0.012em] text-[#173b4d] sm:text-[20px] dark:text-slate-100">
                {sectionTitle(cue)}
              </h3>
              <div className="mt-3 max-w-[42rem] font-sans text-[16px] leading-[1.72] tracking-[-0.002em] text-[#334861] [&_strong]:font-semibold [&_strong]:text-[#173b4d] [&_code]:!rounded-[3px] [&_code]:!border-0 [&_code]:!bg-[#eef3f3] [&_code]:!px-1 [&_code]:!py-[2px] [&_code]:!font-mono [&_code]:!text-[0.88em] [&_code]:!font-medium [&_code]:!text-[#263e4b] dark:text-slate-300 dark:[&_strong]:text-slate-100 dark:[&_code]:!bg-slate-800 dark:[&_code]:!text-slate-200">
                <MarkdownContent content={learningStatement(cue.spokenText.trim())} inline />
              </div>
              <AnswerSupport support={cue.support} />
            </section>
          ))}

          {takeaway && (
            <aside className="mt-7 max-w-[42rem] border-l-[3px] border-amber-400 bg-[#fff9ed] px-5 py-3.5 dark:border-amber-500/70 dark:bg-amber-950/15" aria-label="Key takeaway">
              <p className="font-sans text-[10.5px] font-bold uppercase tracking-[0.15em] text-[#8a5a12] dark:text-amber-300">Key takeaway</p>
              <div className="mt-2 font-sans text-[14.5px] leading-[1.68] text-[#4f5660] [&_strong]:font-semibold [&_strong]:text-[#394550] [&_code]:!rounded-[3px] [&_code]:!border-0 [&_code]:!bg-amber-100/80 [&_code]:!text-[#5c461d] dark:text-slate-300 dark:[&_strong]:text-slate-100 dark:[&_code]:!bg-amber-950/40 dark:[&_code]:!text-amber-200">
                <MarkdownContent content={takeaway} inline />
              </div>
            </aside>
          )}
        </article>
      </>
    );
  } else if (content.trim()) {
    articleContent = <FullAnswerArticle content={content} />;
  } else {
    answerSource = "approved-v2-fallback";
    articleContent = <FullAnswerArticle content={toSpeech(approvedV2!)} />;
  }

  return (
    <section id="zone-interview" aria-labelledby="interview-answer-title" className="mb-8 scroll-mt-8" data-testid="interview-speaking-answer" data-answer-source={answerSource}>
      <div className="relative overflow-hidden rounded-2xl border border-[#d7e4e0] bg-[#fbfdfc] shadow-[0_8px_30px_rgba(27,67,57,0.05)] dark:border-slate-800 dark:bg-slate-950">
        <span aria-hidden="true" className="absolute inset-x-0 top-0 z-10 h-[3px] bg-gradient-to-r from-emerald-500 via-blue-600 to-sky-400" />
        <header className="border-b border-[#dce7e4] bg-[linear-gradient(112deg,#eaf5f1_0%,#f4f8f7_58%,#eef4f8_100%)] px-5 py-5 sm:px-8 sm:py-6 dark:border-slate-800 dark:bg-none dark:bg-slate-900">
          <div className="flex items-start gap-3.5">
            <span aria-hidden="true" className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-[#b8d2ca] bg-white/75 font-sans text-[11px] font-extrabold tabular-nums text-[#286556] shadow-sm dark:border-slate-700 dark:bg-slate-950 dark:text-emerald-300">02</span>
            {technologySlug && (
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-[#c7d9d3] bg-white/75 dark:border-slate-700 dark:bg-slate-950">
                <Image src={`/logos/${technologySlug}.svg`} alt={`${technologySlug} logo`} width={20} height={20} className="h-5 w-5 object-contain" />
              </span>
            )}
            <div className="min-w-0 flex-1">
              <p className="mb-1 font-sans text-[10.5px] font-bold uppercase tracking-[0.17em] text-[#287568] dark:text-emerald-300">Interview-ready guide</p>
              <h2 id="interview-answer-title" className="font-display text-[21px] font-bold tracking-[-0.018em] text-[#17324d] sm:text-[23px] dark:text-slate-100">Interview answer</h2>
            </div>
          </div>
        </header>

        <div className="bg-[radial-gradient(circle_at_top_left,rgba(225,241,235,0.38),transparent_28%),#fbfdfc] px-5 py-7 sm:px-8 sm:py-8 lg:px-12 dark:bg-none dark:bg-slate-950">
          <div className="mx-auto max-w-[48rem]">
            {articleContent}

            <footer className="mt-8 flex flex-col-reverse gap-4 border-t border-[#dce7e4] pt-4 sm:flex-row sm:items-center sm:justify-between dark:border-slate-800">
              <button type="button" onClick={isSpeaking ? stopSpeaking : () => listen(0)} aria-pressed={isSpeaking} className="inline-flex min-h-9 items-center justify-center gap-2 rounded-md px-2.5 text-[12px] font-semibold text-[#527069] outline-none transition-colors hover:bg-[#edf5f2] hover:text-[#21695c] focus-visible:ring-2 focus-visible:ring-emerald-500/60 focus-visible:ring-offset-2 sm:justify-start dark:text-slate-400 dark:hover:bg-slate-900 dark:hover:text-emerald-300">
                {isSpeaking ? <Square aria-hidden="true" className="h-3.5 w-3.5" /> : <Volume2 aria-hidden="true" className="h-4 w-4" />}
                {isSpeaking ? "Stop reading" : "Read answer aloud"}
              </button>
              <MarkCompleteButton questionId={questionId} />
            </footer>
          </div>
        </div>
      </div>
    </section>
  );
}
