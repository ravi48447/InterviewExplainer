/**
 * community-shell.tsx — Community landing client shell (P13-WA..WF, T001..T320).
 *
 * Owns the community landing state: featured companies + reported-question
 * search. Composes the community-v2 primitives.
 */

"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { Search, Building2, ArrowRight, Loader2, Inbox } from "lucide-react";
import { fetchFeaturedCompanies, fetchReportedQuestions } from "@/lib/community";
import type { ReportedQuestion } from "@/lib/community";

export function CommunityShell() {
  const [featured, setFeatured] = useState<string[]>([]);
  const [questions, setQuestions] = useState<ReportedQuestion[]>([]);
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setLoading(true);
      try {
        const [companies, qs] = await Promise.all([
          fetchFeaturedCompanies(),
          fetchReportedQuestions({}, 0, 12),
        ]);
        if (cancelled) return;
        setFeatured(companies);
        setQuestions(qs);
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
      {featured.length > 0 && (
        <section>
          <h2 className="text-lg font-bold text-foreground mb-3">Companies</h2>
          <div className="grid gap-3 sm:grid-cols-2 md:grid-cols-3">
            {featured.map((c) => (
              <Link
                key={c}
                href={`/community/companies/${encodeURIComponent(c)}`}
                className="flex items-center justify-between rounded-xl border border-border bg-card p-4 hover:border-primary/50 transition-colors group"
              >
                <span className="flex items-center gap-2 text-sm font-semibold text-foreground">
                  <Building2 className="h-4 w-4 text-primary" />
                  {c}
                </span>
                <ArrowRight className="h-4 w-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Question search */}
      <section>
        <h2 className="text-lg font-bold text-foreground mb-3">Reported questions</h2>
        <div className="relative mb-4">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            value={query}
            onChange={(e) => onSearch(e.target.value)}
            placeholder="Search reported questions by company, role, or topic…"
            className="w-full rounded-lg border border-border bg-background pl-9 pr-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40"
          />
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-5 w-5 animate-spin text-primary" />
          </div>
        ) : questions.length === 0 ? (
          <div className="text-center py-12">
            <Inbox className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
            <p className="text-sm text-muted-foreground">No questions found.</p>
          </div>
        ) : (
          <div className="space-y-2">
            {questions.map((q) => (
              <Link
                key={q.id}
                href={`/community/questions/${q.id}`}
                className="block rounded-lg border border-border bg-card p-4 hover:border-primary/50 transition-colors"
              >
                <p className="text-sm font-medium text-foreground">{q.question}</p>
                <p className="text-xs text-muted-foreground mt-1">
                  {q.company} · {q.role} · {q.upvotes} upvotes
                </p>
              </Link>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
