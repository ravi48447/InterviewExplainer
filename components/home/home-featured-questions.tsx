import Link from "next/link";
import { ArrowRight, HelpCircle } from "lucide-react";
import { SectionHeader } from "@/components/ui/section-header";
import { PageContainer } from "@/components/page-container";
import { EmptyState } from "@/components/ui/empty-state";
import { Badge } from "@/components/ui/badge";
import { getHomeFeaturedQuestions } from "@/lib/home/home-data";

/**
 * HomeFeaturedQuestions — question discovery (P04-T097..T109).
 *
 * Featured questions are derived from canonical content (P04-T098/T100/T300),
 * never random (P04-T099) and never fake "trending"/"popular" (P04-T374/T375).
 * Titles remain the visual focus (P04-T105); context is shown as concise muted
 * metadata with a domain badge (P04-T103). Links are canonical and unique
 * (P04-T104/T261). No full answers on the homepage (P04-T102), no large lists
 * (P04-T159), no aggressive difficulty colours (P04-T107). The section renders
 * null if no questions are available (P04-T305/T337).
 */
export function HomeFeaturedQuestions() {
  const questions = getHomeFeaturedQuestions(5);

  return (
    <section
      aria-labelledby="home-featured-questions-heading"
      className="border-b border-border bg-background"
    >
      <PageContainer className="py-16 sm:py-20">
        <SectionHeader
          as="h2"
          title="Featured interview questions"
          description="A small sample of the curated, domain-specific questions on the platform."
          actions={
            <Link href="/domains" className="inline-flex items-center gap-1 text-sm font-medium text-primary hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background rounded-sm">
              Browse all questions
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
          }
        />

        {questions.length === 0 ? (
          <EmptyState
            icon={<HelpCircle aria-hidden="true" />}
            title="No featured questions available yet"
            description="We're curating domain-specific interview questions. Browse all questions to explore the full catalog."
            className="mt-10"
          />
        ) : (
        <ul className="mt-10 divide-y divide-border" aria-live="polite">
          {questions.map((q, i) => (
            <li key={`${q.href}-${i}`}>
              <Link
                href={q.href}
                className="group relative flex items-center justify-between gap-4 py-4 pl-5 transition-colors duration-200 ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background rounded-md"
              >
                {/* Hover accent rail — a small primary bar on the left edge
                     so rows feel curated rather than dumped. */}
                <span
                  className="absolute left-0 top-1/2 h-0 w-0.5 -translate-y-1/2 rounded-full bg-primary transition-all duration-200 ease-out group-hover:h-2/3 group-focus-visible:h-2/3"
                  aria-hidden="true"
                />
                <span
                  className="hidden sm:flex h-7 w-7 shrink-0 items-center justify-center rounded-md border border-border bg-surface text-xs font-semibold tabular-nums text-muted-foreground transition-colors duration-200 ease-out group-hover:border-primary/30 group-hover:text-primary"
                  aria-hidden="true"
                >
                  {String(i + 1).padStart(2, "0")}
                </span>
                <div className="min-w-0 flex-1">
                  {/* P04-T105: title is the visual focus. */}
                  <h3 className="truncate text-base font-medium text-foreground group-hover:text-primary">
                    {q.title}
                  </h3>
                  {/* P04-T103: concise muted metadata + domain badge. */}
                  <div className="mt-1 flex items-center gap-2">
                    <Badge variant="outline" className="text-xs">{q.context}</Badge>
                    <span className="text-xs text-muted-foreground">Domain-specific</span>
                  </div>
                </div>
                <span className="hidden sm:inline-flex shrink-0 items-center gap-1 text-sm font-medium text-muted-foreground group-hover:text-primary">
                  Read answer
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" aria-hidden="true" />
                </span>
                <ArrowRight
                  className="sm:hidden h-4 w-4 shrink-0 text-muted-foreground transition-colors group-hover:text-primary"
                  aria-hidden="true"
                />
              </Link>
            </li>
          ))}
        </ul>
        )}
      </PageContainer>
    </section>
  );
}
