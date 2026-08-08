/**
 * no-results.tsx — Canonical no-results recovery state (P07-W, T247..T260).
 *
 * When search returns no results, this component offers:
 *   - Typo correction suggestions (P07-T248)
 *   - Browse suggestions for nearby content (P07-T249)
 *   - A clear "no results for X" message, no false "did you mean" if not confident
 *
 * Never shows an empty blank state — always offers a path forward (P07-T247).
 */

"use client";

import Link from "next/link";
import { SearchX, ArrowRight } from "lucide-react";
import type { SearchQuery, NoResultsSuggestion } from "@/lib/search";

export interface NoResultsProps {
  query: SearchQuery;
  suggestions: NoResultsSuggestion[];
  onSelectSuggestion?: (suggestion: NoResultsSuggestion) => void;
}

export function NoResults({ query, suggestions, onSelectSuggestion }: NoResultsProps) {
  const typoCorrections = suggestions.filter((s) => s.reason === "typo_correction");
  const browseSuggestions = suggestions.filter((s) => s.reason === "browse");

  return (
    <div className="mt-2 w-full rounded-lg border border-border bg-surface shadow-lg overflow-hidden p-4">
      <div className="flex items-start gap-3">
        <SearchX className="h-5 w-5 text-muted-foreground shrink-0 mt-0.5" />
        <div className="flex-1">
          <p className="text-sm text-foreground">
            No results for <span className="font-medium">&ldquo;{query.raw}&rdquo;</span>
          </p>

          {typoCorrections.length > 0 && (
            <div className="mt-3">
              <p className="text-xs text-muted-foreground mb-1.5">Did you mean:</p>
              <div className="flex flex-wrap gap-2">
                {typoCorrections.map((s, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => onSelectSuggestion?.(s)}
                    className="px-2.5 py-1 text-sm rounded-md border border-border bg-card hover:bg-surface text-foreground"
                  >
                    {s.query}
                  </button>
                ))}
              </div>
            </div>
          )}

          {browseSuggestions.length > 0 && (
            <div className="mt-3">
              <p className="text-xs text-muted-foreground mb-1.5">Or browse:</p>
              <div className="flex flex-wrap gap-2">
                {browseSuggestions.map((s, i) => (
                  <Link
                    key={i}
                    href={s.url ?? "#"}
                    onClick={() => onSelectSuggestion?.(s)}
                    className="flex items-center gap-1 px-2.5 py-1 text-sm rounded-md border border-border bg-card hover:bg-surface text-foreground"
                  >
                    {s.label ?? s.query}
                    <ArrowRight className="h-3 w-3" />
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
