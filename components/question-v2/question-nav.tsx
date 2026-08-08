/**
 * question-nav.tsx — Prev/next + related + follow-up navigation (P06-T221..T260).
 *
 * Renders the prev/next question pair, the related-questions list, and the
 * follow-up questions list. All navigation is server-rendered as crawlable
 * anchors (P06-T264). No client JS.
 *
 * Design (P06-T221..T260):
 *   - Prev/next is a two-card pair at the bottom of the reading flow
 *   - Related questions are a simple list (same module/stack)
 *   - Follow-up questions are a separate list (deeper exploration)
 *   - Each link is a whole-card/row link with an arrow affordance
 */

import Link from "next/link";
import { ArrowLeft, ArrowRight, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import type {
  PrevNextNav,
  RelatedQuestion,
  FollowUpQuestion,
} from "@/lib/question";

const difficultyVariant = {
  easy: "difficulty-easy",
  medium: "difficulty-medium",
  hard: "difficulty-hard",
} as const;

// ─── Prev/Next (P06-T221..T240) ────────────────────────────────────────────────

export interface PrevNextProps {
  prevNext: PrevNextNav;
}

export function PrevNext({ prevNext }: PrevNextProps) {
  if (!prevNext.prev && !prevNext.next) return null;

  return (
    <nav aria-label="Question navigation" className="grid gap-4 sm:grid-cols-2">
      {prevNext.prev ? (
        <Link
          href={prevNext.prev.href}
          className={cn(
            "group flex flex-col gap-1 rounded-lg border border-border bg-card p-4",
            "transition-colors hover:border-strong hover:bg-muted/50",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          )}
        >
          <span className="flex items-center gap-1 text-xs text-muted-foreground">
            <ArrowLeft className="size-3.5" aria-hidden="true" />
            Previous
          </span>
          <span className="text-sm font-medium text-foreground">
            {prevNext.prev.title}
          </span>
        </Link>
      ) : (
        <div className="hidden sm:block" aria-hidden="true" />
      )}
      {prevNext.next ? (
        <Link
          href={prevNext.next.href}
          className={cn(
            "group flex flex-col gap-1 rounded-lg border border-border bg-card p-4 text-right",
            "transition-colors hover:border-strong hover:bg-muted/50",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          )}
        >
          <span className="flex items-center justify-end gap-1 text-xs text-muted-foreground">
            Next
            <ArrowRight className="size-3.5" aria-hidden="true" />
          </span>
          <span className="text-sm font-medium text-foreground">
            {prevNext.next.title}
          </span>
        </Link>
      ) : null}
    </nav>
  );
}

// ─── Related questions (P06-T241..T250) ───────────────────────────────────────

export interface RelatedQuestionsProps {
  questions: RelatedQuestion[];
}

export function RelatedQuestions({ questions }: RelatedQuestionsProps) {
  if (questions.length === 0) return null;

  return (
    <section aria-labelledby="related-heading">
      <h2 id="related-heading" className="type-section mb-3">
        Related Questions
      </h2>
      <ul className="divide-y divide-border">
        {questions.map((q) => (
          <li key={q.slug}>
            <Link
              href={q.href}
              className={cn(
                "group flex items-center justify-between gap-3 py-3 px-1",
                "transition-colors hover:bg-muted/30",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              )}
            >
              <div className="flex min-w-0 items-center gap-3">
                {q.difficulty ? (
                  <Badge variant={difficultyVariant[q.difficulty]} className="shrink-0">
                    {q.difficulty}
                  </Badge>
                ) : null}
                <span className="truncate text-sm font-medium text-foreground">
                  {q.title}
                </span>
              </div>
              <ChevronRight
                className="size-4 shrink-0 text-muted-foreground"
                aria-hidden="true"
              />
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}

// ─── Follow-up questions (P06-T251..T260) ─────────────────────────────────────

export interface FollowUpQuestionsProps {
  questions: FollowUpQuestion[];
}

export function FollowUpQuestions({ questions }: FollowUpQuestionsProps) {
  if (questions.length === 0) return null;

  return (
    <section aria-labelledby="followup-heading">
      <h2 id="followup-heading" className="type-section mb-3">
        Follow-Up Questions
      </h2>
      <ul className="divide-y divide-border">
        {questions.map((q) => (
          <li key={q.slug}>
            <Link
              href={q.href}
              className={cn(
                "group flex items-center justify-between gap-3 py-3 px-1",
                "transition-colors hover:bg-muted/30",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              )}
            >
              <span className="truncate text-sm font-medium text-foreground">
                {q.title}
              </span>
              <ChevronRight
                className="size-4 shrink-0 text-muted-foreground"
                aria-hidden="true"
              />
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
