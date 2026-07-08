/**
 * Legacy — markdown-blob fallback. Phase 1.4.
 *
 * Renders a question's existing `speakable_answer` markdown as it
 * currently appears, preserving byte-equivalent output with the inline
 * JSX in QuestionPageLayout.tsx (lines ~475–561) for the `question`
 * variant. The `preview` variant is added in Phase 1.9 when the
 * preview-page integration lands.
 *
 * Until a question carries `speakable_v2.speakable_status === "approved"`
 * (Phase 2/3), the Speakable wrapper falls through to this component
 * for every render — see Speakable.tsx for the branch logic.
 */

"use client";

import { Star } from "lucide-react";
import { CopyButton } from "@/components/CopyButton";
import MarkdownContent from "@/components/MarkdownContent";
import { MarkCompleteButton } from "@/components/mark-complete-button";
import { useContentTheme } from "@/components/question/ThemeContext";
import type { SpeakableLegacy } from "@/lib/speakable/schema";

export type LegacyVariant = "question" | "preview" | "minimal";

export interface LegacyProps {
  data: SpeakableLegacy;
  variant?: LegacyVariant;
  /** `question` variant only — plumbs the mark-complete button to the question id. */
  questionId?: string | number;
  /** `question` variant only — drives the "X-Y min" chip in the card header. */
  readTime?: number;
}

export function Legacy({ data, variant = "question", questionId, readTime }: LegacyProps) {
  if (variant === "minimal") {
    return <MarkdownContent content={data.content} />;
  }
  if (variant === "preview") {
    // Phase 1.9 will replace the inline rendering in
    // PreviewArticle.tsx with this branch. Until then we emit the
    // magazine-shape markup using MarkdownContent — the four hardcoded
    // OOP CSS rules in PreviewArticle are intentionally dropped per
    // §1.9, so the preview-styled rendering here is data-driven only.
    return (
      <div className="speakable-prose">
        <MarkdownContent content={data.content} />
      </div>
    );
  }
  return (
    <LegacyQuestionCard
      data={data}
      questionId={questionId}
      readTime={readTime ?? 3}
    />
  );
}

/**
 * Verbatim port of the Interview-Answer card in QuestionPageLayout.tsx
 * (lines ~487–559). Pulled out so 1.9 can call `<Speakable>` instead of
 * inlining 75 lines of JSX. Visual output is byte-equivalent to the
 * existing renderer — the integration commit (1.9) verifies parity on
 * three representative questions.
 */
function LegacyQuestionCard({
  data,
  questionId,
  readTime,
}: {
  data: SpeakableLegacy;
  questionId?: string | number;
  readTime: number;
}) {
  const { theme } = useContentTheme();
  const d = theme === "dark";
  const speakableText = data.content;
  const paraBreak = speakableText.indexOf("\n\n");
  const lede = paraBreak > -1 ? speakableText.slice(0, paraBreak).trim() : "";
  const rest =
    paraBreak > -1 ? speakableText.slice(paraBreak).trim() : speakableText;
  return (
    <section className="mb-6">
      <div
        className={`rounded-xl overflow-hidden shadow-lg ${
          d
            ? "border border-default dark:border-default/50 bg-[#0d1c15] shadow-black/40"
            : "border border-default dark:border-default/20/70 bg-emerald-50 dark:bg-emerald-500/10 dark:bg-emerald-950/20/60 shadow-sm"
        }`}
      >
        <div
          className={`flex items-center gap-2 px-5 py-2.5 border-b ${
            d
              ? "border-default dark:border-default/50 bg-emerald-900 dark:bg-emerald-800/30"
              : "border-default dark:border-default/20/60 bg-emerald-100 dark:bg-emerald-950/20/40"
          }`}
        >
          <Star
            className={`h-3.5 w-3.5 ${
              d
                ? "text-emerald-400 fill-emerald-400"
                : "text-emerald-600 dark:text-emerald-400 fill-emerald-600"
            }`}
          />
          <span
            className={`text-[11px] font-bold uppercase tracking-widest ${
              d ? "text-emerald-700" : "text-emerald-700 dark:text-emerald-400"
            }`}
          >
            Interview Answer
          </span>
          <div className="ml-auto flex items-center gap-3">
            <span
              className={`text-[11px] ${
                d ? "text-emerald-500" : "text-emerald-600 dark:text-emerald-400"
              }`}
            >
              {readTime}–{Math.min(readTime + 1, 5)} min
            </span>
            <CopyButton text={speakableText} />
          </div>
        </div>
        <div className="px-6 py-5 sm:px-7 sm:py-6">
          {lede && (
            <p
              className={`text-[17px] leading-[1.6] font-medium mb-5 pb-5 border-b border-dashed ${
                d
                  ? "text-white border-default dark:border-default/60"
                  : "text-foreground border-default dark:border-default/20/60"
              }`}
            >
              <MarkdownContent content={lede} inline />
            </p>
          )}
          <div
            className={`interview-answer-body text-[15.5px] leading-[1.78] [&_p]:mb-4 [&_p:last-child]:mb-0 ${
              d ? "text-muted-foreground" : "text-foreground"
            }`}
          >
            <MarkdownContent content={lede ? rest : speakableText} />
          </div>
          {questionId !== undefined && (
            <div
              className={`mt-5 pt-4 border-t ${
                d ? "border-default dark:border-default/50" : "border-default dark:border-default/20/50"
              }`}
            >
              <MarkCompleteButton questionId={Number(questionId)} />
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
