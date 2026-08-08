/**
 * question-header.tsx — Question page header (P06-T061..T080).
 *
 * Renders the single H1 (the question), the breadcrumb trail, simplified
 * metadata (difficulty, companies, read time), and the "where am I" context.
 * No competing CTAs, no badge walls, no decorative gradients
 * (P06-T201..T210/T261/T271).
 *
 * Server component — no client JS.
 */

import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Clock, BookOpen } from "lucide-react";
import type {
  QuestionPageData,
  QuestionMetadata,
} from "@/lib/question";

const difficultyVariant = {
  easy: "difficulty-easy",
  medium: "difficulty-medium",
  hard: "difficulty-hard",
} as const;

export interface QuestionHeaderProps {
  data: QuestionPageData;
}

export function QuestionHeader({ data }: QuestionHeaderProps) {
  const { question, metadata, breadcrumbs } = data;

  return (
    <header className="border-b border-border">
      <div className="page-container py-8 sm:py-10 lg:py-12">
        {/* Breadcrumb trail — "where am I" (P06-T281). */}
        <nav aria-label="Breadcrumb" className="mb-4">
          <ol className="flex flex-wrap items-center gap-1.5 text-xs text-muted-foreground">
            {breadcrumbs.map((crumb, i) => (
              <li key={crumb.href} className="flex items-center gap-1.5">
                {i > 0 && (
                  <span className="text-muted-foreground/50" aria-hidden="true">
                    /
                  </span>
                )}
                <span className={cn(i === breadcrumbs.length - 1 && "font-medium text-foreground")}>
                  {crumb.label}
                </span>
              </li>
            ))}
          </ol>
        </nav>

        {/* Single H1 — the question (P06-T021/T061). */}
        <h1
          id="question-title"
          className="type-display text-foreground max-w-3xl"
        >
          {question}
        </h1>

        {/* Simplified metadata row (P06-T201..T210). */}
        <QuestionMetadataRow metadata={metadata} />
      </div>
    </header>
  );
}

function QuestionMetadataRow({ metadata }: { metadata: QuestionMetadata }) {
  const items: React.ReactNode[] = [];

  if (metadata.difficulty) {
    items.push(
      <Badge key="difficulty" variant={difficultyVariant[metadata.difficulty]}>
        {metadata.difficulty}
      </Badge>
    );
  }

  if (metadata.readTimeMinutes) {
    items.push(
      <span
        key="readtime"
        className="flex items-center gap-1 text-xs text-muted-foreground"
      >
        <Clock className="size-3.5" aria-hidden="true" />
        {metadata.readTimeMinutes} min read
      </span>
    );
  }

  if (metadata.companies && metadata.companies.length > 0) {
    items.push(
      <span
        key="companies"
        className="flex items-center gap-1 text-xs text-muted-foreground"
      >
        <BookOpen className="size-3.5" aria-hidden="true" />
        {metadata.companies.join(", ")}
      </span>
    );
  }

  if (items.length === 0) return null;

  return (
    <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-2">
      {items}
    </div>
  );
}
