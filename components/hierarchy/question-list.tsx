/**
 * question-list.tsx — Canonical question list for module/stack pages
 * (P05-T135..T150, O-Workstream).
 *
 * A simple, readable list of questions. Each question is a whole-row link with
 * the title as the visual focus and an optional difficulty badge. No
 * competing colours, no card-in-card nesting, no dense icon grids
 * (P05-T193/T237/T261).
 *
 * Server component — no client JS.
 */

import Link from "next/link";
import { ArrowRight, MessageSquare } from "lucide-react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { EmptyState } from "@/components/ui/empty-state";

export interface QuestionListItem {
  slug: string;
  title: string;
  href: string;
  difficulty?: "easy" | "medium" | "hard";
  isLocked?: boolean;
}

export interface QuestionListProps {
  questions: QuestionListItem[];
  /** Show difficulty badges (default true). */
  showDifficulty?: boolean;
  emptyMessage?: string;
}

const difficultyVariant: Record<
  NonNullable<QuestionListItem["difficulty"]>,
  "difficulty-easy" | "difficulty-medium" | "difficulty-hard"
> = {
  easy: "difficulty-easy",
  medium: "difficulty-medium",
  hard: "difficulty-hard",
};

export function QuestionList({
  questions,
  showDifficulty = true,
  emptyMessage = "No questions in this module yet.",
}: QuestionListProps) {
  if (questions.length === 0) {
    return (
      <EmptyState
        icon={<MessageSquare className="h-6 w-6" />}
        title="No questions yet"
        description={emptyMessage}
      />
    );
  }

  return (
    <ul className="divide-y divide-border" aria-live="polite">
      {questions.map((q) => (
        <li key={q.slug}>
          <Link
            href={q.href}
            className={cn(
              "group flex items-center justify-between gap-3 py-3.5 px-1",
              "transition-colors hover:bg-muted/30",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            )}
          >
            <div className="flex min-w-0 items-center gap-3">
              {showDifficulty && q.difficulty ? (
                <Badge variant={difficultyVariant[q.difficulty]} className="shrink-0">
                  {q.difficulty}
                </Badge>
              ) : null}
              <span className="truncate text-base font-medium text-foreground">
                {q.title}
              </span>
            </div>
            <ArrowRight
              className="size-4 shrink-0 text-muted-foreground transition-colors duration-200 ease-out group-hover:text-foreground"
              aria-hidden="true"
            />
          </Link>
        </li>
      ))}
    </ul>
  );
}
