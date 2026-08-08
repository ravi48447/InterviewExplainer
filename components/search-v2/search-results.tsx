/**
 * search-results.tsx — Canonical search result list (P07-T198..T210).
 *
 * Renders the ranked search results as a list of SearchResultItem.
 * Keyboard-navigable (active index highlight), accessible (ARIA listbox).
 * Grouped by entity type when results span multiple types (P07-N).
 */

"use client";

import Link from "next/link";
import { ArrowRight, Clock } from "lucide-react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import type { SearchResult } from "@/lib/search";
import { SearchResultItem } from "./search-result-item";

export interface SearchResultsProps {
  results: SearchResult[];
  activeIndex: number;
  onSelect?: (result: SearchResult) => void;
}

export function SearchResults({ results, activeIndex, onSelect }: SearchResultsProps) {
  if (results.length === 0) return null;

  // Group by type (P07-N).
  const groups = groupByType(results);

  let flatIndex = -1;

  return (
    <div
      id="search-results"
      role="listbox"
      aria-label="Search results"
      className="mt-2 w-full rounded-lg border border-border bg-surface shadow-lg overflow-hidden"
    >
      {groups.map((group) => (
        <div key={group.type} className="border-b border-border last:border-b-0">
          <div className="px-3 py-1.5 text-xs font-medium text-muted-foreground uppercase tracking-wide bg-card">
            {group.type} ({group.results.length})
          </div>
          {group.results.map((result) => {
            flatIndex++;
            const isActive = flatIndex === activeIndex;
            return (
              <SearchResultItem
                key={result.document.id}
                result={result}
                isActive={isActive}
                onSelect={onSelect}
              />
            );
          })}
        </div>
      ))}
    </div>
  );
}

function groupByType(results: SearchResult[]): { type: string; results: SearchResult[] }[] {
  const groups = new Map<string, SearchResult[]>();
  for (const r of results) {
    const type = r.document.type;
    if (!groups.has(type)) groups.set(type, []);
    groups.get(type)!.push(r);
  }
  return Array.from(groups.entries()).map(([type, results]) => ({ type, results }));
}
