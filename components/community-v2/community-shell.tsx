/**
 * community-shell.tsx — Community landing client shell (P13-WA..WF, T001..T320).
 *
 * Owns the community landing state: featured companies + reported-question
 * search. Composes the community-v2 primitives.
 */

"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { Search, Building2, ArrowRight, Inbox } from "lucide-react";
import { fetchFeaturedCompanies, fetchReportedQuestions } from "@/lib/community";
import type { ReportedQuestion } from "@/lib/community";
import { Input } from "@/components/ui/input";
import { ListSkeleton, CardSkeleton } from "@/components/ui/skeleton";
import { EmptyState } from "@/components/ui/empty-state";
import { ErrorState } from "@/components/ui/error-state";

export function CommunityShell() {
  const [featured, setFeatured] = useState<string[]>([]);
  const [questions, setQuestions] = useState<ReportedQuestion[]>([]);
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setLoading(true);
      setError(false);
      try {
        const [companies, qs] = await Promise.all([
          fetchFeaturedCompanies(),
          fetchReportedQuestions({}, 0, 12),
        ]);
        if (cancelled) return;
        setFeatured(companies);
        setQuestions(qs);
      } catch {
        if (!cancelled) setError(true);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const onSearch = useCallback((q: string) => {
    setQuery(q);
    let cancelled = false;
    (async () => {
      const result = await fetchReportedQuestions({ query: q }, 0, 12);
      if (!cancelled) setQuestions(result);
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      {/* Featured companies */}
      {loading ? (
        <section aria-label="Companies">
          <h2 className="type-display text-lg font-extrabold text-foreground mb-3">Companies</h2>
          <div className="grid gap-3 sm:grid-cols-2 md:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <CardSkeleton key={i} />
            ))}
          </div>
        </section>
      ) : featured.length > 0 ? (
        <section aria-label="Companies">
          <h2 className="type-display text-lg font-extrabold text-foreground mb-3">Companies</h2>
          <div className="grid gap-3 sm:grid-cols-2 md:grid-cols-3">
            {featured.map((c) => (
              <Link
                key={c}
                href={`/community/companies/${encodeURIComponent(c)}`}
                className="flex items-center justify-between rounded-xl border border-border bg-card p-4 hover:border-primary/50 transition-colors duration-200 ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              >
                <span className="flex items-center gap-2 text-sm font-semibold text-foreground">
                  <Building2 className="h-4 w-4 text-primary" />
                  {c}
                </span>
                <ArrowRight className="h-4 w-4 text-muted-foreground" />
              </Link>
            ))}
          </div>
        </section>
      ) : null}

      {/* Question search */}
      <section aria-label="Reported questions">
        <h2 className="type-display text-lg font-extrabold text-foreground mb-3">Reported questions</h2>
        <div className="mb-4">
          <Input
            type="text"
            value={query}
            onChange={(e) => onSearch(e.target.value)}
            placeholder="Search reported questions by company, role, or topic…"
            leftIcon={<Search />}
            aria-label="Search reported questions"
          />
        </div>

        {loading ? (
          <ListSkeleton rows={6} />
        ) : error ? (
          <ErrorState
            title="Couldn't load questions"
            description="We were unable to fetch reported questions. Please try again."
            retryLabel="Retry"
            onRetry={() => {
              setQuery("");
              setError(false);
              setLoading(true);
              (async () => {
                try {
                  const [companies, qs] = await Promise.all([
                    fetchFeaturedCompanies(),
                    fetchReportedQuestions({}, 0, 12),
                  ]);
                  setFeatured(companies);
                  setQuestions(qs);
                } catch {
                  setError(true);
                } finally {
                  setLoading(false);
                }
              })();
            }}
          />
        ) : (
          <>
            <p className="text-xs text-muted-foreground mb-2" aria-live="polite">
              {questions.length} question{questions.length === 1 ? "" : "s"} found
            </p>
            {questions.length === 0 ? (
              <EmptyState
                icon={<Inbox />}
                title="No questions found"
                description={query ? `No questions match "${query}". Try a different search.` : "No community questions have been reported yet."}
              />
            ) : (
              <div className="space-y-2" aria-live="polite">
                {questions.map((q) => (
                  <Link
                    key={q.id}
                    href={`/community/questions/${q.id}`}
                    className="block rounded-lg border border-border bg-card p-4 hover:border-primary/50 transition-colors duration-200 ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                  >
                    <p className="text-sm font-medium text-foreground">{q.question}</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {q.company} · {q.role} · {q.upvotes} upvotes
                    </p>
                  </Link>
                ))}
              </div>
            )}
          </>
        )}
      </section>
    </div>
  );
}
