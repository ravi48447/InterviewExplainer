/**
 * search-result-item.tsx — Canonical search result item (P07-T198..T210).
 *
 * A single search result row. Title is the primary visual focus (P07-T199),
 * description/snippet secondary, difficulty badge + read time tertiary.
 * Whole-row is a link to the canonical URL (P07-T552). Keyboard-active
 * highlight for arrow navigation (P07-S).
 */

"use client";

import Link from "next/link";
import { ArrowRight, Clock } from "lucide-react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import type { SearchResult } from "@/lib/search";

export interface SearchResultItemProps {
  result: SearchResult;
  isActive: boolean;
  onSelect?: (result: SearchResult) => void;
}

const difficultyVariant = {
  easy: "difficulty-easy",
  medium: "difficulty-medium",
  hard: "difficulty-hard",
} as const;

export function SearchResultItem({ result, isActive, onSelect }: SearchResultItemProps) {
  const { document: doc, snippet } = result;

  return (
    <Link
      href={doc.url}
      onClick={() => onSelect?.(result)}
      role="option"
      aria-selected={isActive}
      className={cn(
        "flex items-start gap-3 px-3 py-2.5",
        "border-b border-border last:border-b-0",
        "hover:bg-card focus:bg-card",
        "transition-colors",
        isActive && "bg-card ring-1 ring-inset ring-ring",
      )}
    >
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <h3 className="text-sm font-medium text-foreground truncate">
            {doc.title}
          </h3>
          {doc.difficulty && (
            <Badge variant={difficultyVariant[doc.difficulty]} className="shrink-0">
              {doc.difficulty}
            </Badge>
          )}
        </div>
        {snippet && (
          <p className="mt-0.5 text-xs text-muted-foreground line-clamp-2">
            {snippet}
          </p>
        )}
        {doc.hierarchyPath && doc.hierarchyPath.length > 0 && (
          <p className="mt-0.5 text-xs text-muted-foreground/70 truncate">
            {doc.hierarchyPath.join(" › ")}
          </p>
        )}
      </div>
      {doc.readTimeMinutes && (
        <div className="flex items-center gap-1 text-xs text-muted-foreground shrink-0 mt-0.5">
          <Clock className="h-3 w-3" />
          {doc.readTimeMinutes}m
        </div>
      )}
      <ArrowRight
        className={cn(
          "h-4 w-4 text-muted-foreground shrink-0 mt-1",
          isActive && "text-foreground",
        )}
      />
    </Link>
  );
}
