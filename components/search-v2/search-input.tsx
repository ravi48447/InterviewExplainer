/**
 * search-input.tsx — Canonical search input (P07-T188..T197).
 *
 * The single search input primitive. Debounced query normalization,
 * keyboard-accessible, theme-integrated. No competing search inputs
 * across the app — every search surface uses this component (P07-T022).
 *
 * Client component — needs interactivity for debounce + keyboard nav.
 */

"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { Search, X, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { normalizeQuery, search, getNoResultsSuggestions } from "@/lib/search";
import type { SearchState, SearchResult, NoResultsSuggestion } from "@/lib/search";
import { DEFAULT_SEARCH_CONFIG } from "@/lib/search";
import { SearchResults } from "./search-results";
import { NoResults } from "./no-results";

export interface SearchInputProps {
  /** Placeholder text (P07-T189). */
  placeholder?: string;
  /** autoFocus on mount. */
  autoFocus?: boolean;
  /** Called when a result is selected. */
  onSelectResult?: (result: SearchResult) => void;
  /** Called when the search is closed (escape or click-away). */
  onClose?: () => void;
  /** Variant: standalone (page) or overlay (modal). */
  variant?: "standalone" | "overlay";
  className?: string;
}

export function SearchInput({
  placeholder = "Search questions, topics, technologies…",
  autoFocus = false,
  onSelectResult,
  onClose,
  variant = "standalone",
  className,
}: SearchInputProps) {
  const [rawValue, setRawValue] = useState("");
  const [state, setState] = useState<SearchState>({
    status: "idle",
    query: null,
    results: [],
    totalCount: 0,
  });
  const [activeIndex, setActiveIndex] = useState(-1);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (autoFocus) inputRef.current?.focus();
  }, [autoFocus]);

  // Debounced search (P07-T).
  const executeSearch = useCallback((raw: string) => {
    if (raw.trim().length < DEFAULT_SEARCH_CONFIG.minQueryLength) {
      setState({ status: "idle", query: null, results: [], totalCount: 0 });
      return;
    }

    const query = normalizeQuery(raw);
    const results = search(query, DEFAULT_SEARCH_CONFIG.maxResults);

    setState({
      status: results.length > 0 ? "success" : "no_results",
      query,
      results,
      totalCount: results.length,
    });
    setActiveIndex(-1);
  }, []);

  const handleChange = useCallback((value: string) => {
    setRawValue(value);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => executeSearch(value), DEFAULT_SEARCH_CONFIG.debounceMs);
  }, [executeSearch]);

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (state.status !== "success" && state.status !== "no_results") {
      if (e.key === "Escape") onClose?.();
      return;
    }

    const maxIdx = state.results.length - 1;

    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIndex((prev) => Math.min(prev + 1, maxIdx));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIndex((prev) => Math.max(prev - 1, 0));
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (activeIndex >= 0 && activeIndex < state.results.length) {
        onSelectResult?.(state.results[activeIndex]);
      } else if (state.results.length > 0) {
        onSelectResult?.(state.results[0]);
      }
    } else if (e.key === "Escape") {
      onClose?.();
    }
  }, [state, activeIndex, onSelectResult, onClose]);

  const handleClear = useCallback(() => {
    setRawValue("");
    setState({ status: "idle", query: null, results: [], totalCount: 0 });
    setActiveIndex(-1);
    inputRef.current?.focus();
  }, []);

  return (
    <div className={cn("w-full", className)}>
      <div className="relative">
        <Search
          className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground"
          aria-hidden="true"
        />
        <input
          ref={inputRef}
          type="search"
          value={rawValue}
          onChange={(e) => handleChange(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          aria-label="Search"
          role="searchbox"
          aria-expanded={state.status === "success" || state.status === "no_results"}
          aria-controls="search-results"
          className={cn(
            "w-full pl-10 pr-10 py-2.5 rounded-lg",
            "bg-surface border border-border",
            "text-foreground placeholder:text-muted-foreground",
            "focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent",
            "transition-colors",
          )}
        />
        {rawValue && (
          <button
            type="button"
            onClick={handleClear}
            aria-label="Clear search"
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
          >
            <X className="h-4 w-4" />
          </button>
        )}
        {state.status === "loading" && (
          <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground animate-spin" />
        )}
      </div>

      {state.status === "success" && (
        <SearchResults
          results={state.results}
          activeIndex={activeIndex}
          onSelect={onSelectResult}
        />
      )}

      {state.status === "no_results" && state.query && (
        <NoResults
          query={state.query}
          suggestions={getNoResultsSuggestions(state.query)}
          onSelectSuggestion={(s) => {
            if (s.url) {
              window.location.href = s.url;
            } else if (s.query) {
              handleChange(s.query);
            }
          }}
        />
      )}
    </div>
  );
}
