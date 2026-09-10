/**
 * search-input.tsx — Canonical search input (P07-T188..T197).
 *
 * The single search input primitive. Debounced query normalization,
 * keyboard-accessible, theme-integrated. No competing search inputs
 * across the app — every search surface uses this component (P07-T022).
 *
 * Client component — needs interactivity for debounce + keyboard nav.
 *
 * IMPORTANT (Next 16 build fix): This is a "use client" component, so it
 * must NOT import anything that transitively pulls Node-only modules
 * (`fs`, `path`) into the browser bundle. The previous version imported
 * `search`/`getNoResultsSuggestions`/`normalizeQuery` from `@/lib/search`,
 * whose barrel re-exports `search-index.ts` → `content-reader.ts`
 * (`import fs from 'fs'`) and `contentV2.ts` (`import fs from 'fs'`), which
 * broke `next build` with "Module not found: Can't resolve 'fs'".
 *
 * Fix: queries are now sent to the server-side `/api/search` route (which
 * already builds the index from `contentV2`/`content-reader` and returns
 * scored JSON). The response is mapped back into the canonical
 * `SearchResult`/`SearchDocument` shape that `<SearchResults/>` and
 * `<NoResults/>` already consume. No server-only code is imported here.
 */

"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { Search, X, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
// NOTE: import types + config from the LEAF module (search-types.ts), not the
// @/lib/search barrel. The barrel re-exports runtime functions from
// search-index.ts → content-reader.ts (which does `import fs from 'fs'`);
// importing the barrel in a "use client" component drags that Node-only
// module into the browser bundle and breaks `next build`. search-types.ts
// is a pure types/constants module with no server-only imports.
import type {
  SearchState,
  SearchResult,
  SearchDocument,
  SearchQuery,
  NoResultsSuggestion,
} from "@/lib/search/search-types";
import { DEFAULT_SEARCH_CONFIG } from "@/lib/search/search-types";
import { SearchResults } from "./search-results";
import { NoResults } from "./no-results";

// ─── /api/search response shape (server-side route) ──────────────────────────
// See app/api/search/route.ts — this is the JSON contract the route returns.
interface ApiSearchItem {
  title: string;
  slug: string;
  domainSlug: string;
  stackSlug: string;
  questionSlug: string;
  difficulty: string;
  readingTime: number;
  language: string;
  track: string;
  level: string;
  stack: string;
  type: "interview" | "tool";
}

/** Map one /api/search item → the canonical SearchResult the UI expects. */
function toSearchResult(item: ApiSearchItem, score: number): SearchResult {
  // Build the public canonical URL. Interview questions live under
  // /{domainSlug}/{stackSlug}/{questionSlug}; shared tools under /prep/{stack}.
  const url =
    item.type === "interview" && item.domainSlug
      ? `/${item.domainSlug}/${item.stackSlug}/${item.questionSlug}`
      : item.type === "tool"
        ? `/prep/${item.stackSlug}`
        : `/domains`;

  // Map the route's loose difficulty ("easy"/"medium"/"hard" as strings)
  // to the typed union SearchDocument.difficulty expects.
  const difficulty: SearchDocument["difficulty"] =
    item.difficulty === "easy" || item.difficulty === "medium" || item.difficulty === "hard"
      ? item.difficulty
      : undefined;

  // Map the route's entity type to the SearchEntityType union. The route
  // only emits "interview" (a question) or "tool" (a resource); both render
  // as documents the result list groups by `type`.
  const type: SearchDocument["type"] =
    item.type === "interview" ? "question" : "resource";

  // Hierarchy path powers the "Java Backend › Spring Boot" breadcrumb line
  // under each result title (see SearchResultItem).
  const hierarchyPath = [item.language, item.track, item.level, item.stack].filter(
    (s): s is string => Boolean(s && s !== "Shared"),
  );

  const document: SearchDocument = {
    id: `${item.type}:${item.domainSlug || item.stackSlug}:${item.questionSlug}`,
    type,
    title: item.title,
    url,
    difficulty,
    hierarchyPath,
    readTimeMinutes: item.readingTime,
    language: item.language,
  };

  return { document, score };
}

/** Tiny client-side normalizer (mirrors the server's normalizeQuery intent). */
function normalizeQueryClient(raw: string): SearchQuery {
  const normalized = raw.trim().toLowerCase().replace(/[^\w\s-]/g, " ");
  const tokens = normalized.split(/\s+/).filter((t) => t.length > 0);
  return { raw, normalized, tokens };
}

/** Build no-results suggestions client-side from the returned titles. */
function buildNoResultsSuggestions(query: SearchQuery, titles: string[]): NoResultsSuggestion[] {
  const suggestions: NoResultsSuggestion[] = [];

  // Typo corrections: Levenshtein-1 against the first token of each title.
  const titleSet = new Set(titles.map((t) => t.toLowerCase()));
  const levenshtein = (a: string, b: string): number => {
    const m = a.length, n = b.length;
    if (Math.abs(m - n) > 1) return 99;
    const dp = Array.from({ length: m + 1 }, (_, i) => i);
    for (let j = 1; j <= n; j++) {
      let prev = dp[0];
      dp[0] = j;
      for (let i = 1; i <= m; i++) {
        const tmp = dp[i];
        dp[i] = Math.min(dp[i] + 1, dp[i - 1] + 1, prev + (a[i - 1] === b[j - 1] ? 0 : 1));
        prev = tmp;
      }
    }
    return dp[m];
  };

  for (const token of query.tokens) {
    if (token.length < 3) continue;
    for (const title of titleSet) {
      const firstWord = title.split(/[\s-]+/)[0] ?? title;
      const dist = levenshtein(token, firstWord);
      if (dist === 1 && dist < token.length) {
        suggestions.push({ query: title, reason: "typo_correction" });
        if (suggestions.length >= 3) break;
      }
    }
    if (suggestions.length >= 3) break;
  }

  // Browse suggestions — always offer a path forward (P07-T247).
  suggestions.push({
    query: "Browse all domains",
    reason: "browse",
    url: "/domains",
    label: "Browse all domains",
  });
  suggestions.push({
    query: "Browse pillars",
    reason: "browse",
    url: "/prep",
    label: "Browse prep hubs",
  });

  return suggestions.slice(0, 5);
}

export interface SearchInputProps {
  /** Placeholder text (P07-T189). */
  placeholder?: string;
  /** Optional query supplied by the page URL. */
  initialValue?: string;
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
  initialValue = "",
  autoFocus = false,
  onSelectResult,
  onClose,
  variant = "standalone",
  className,
}: SearchInputProps) {
  const [rawValue, setRawValue] = useState(initialValue);
  const [state, setState] = useState<SearchState>({
    status: "idle",
    query: null,
    results: [],
    totalCount: 0,
  });
  const [activeIndex, setActiveIndex] = useState(-1);
  const [noResultsSuggestions, setNoResultsSuggestions] = useState<NoResultsSuggestion[]>([]);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  // Track the latest in-flight request so a slow response can't overwrite a
  // newer one (race guard for the debounced fetch loop).
  const reqIdRef = useRef(0);

  useEffect(() => {
    if (autoFocus) inputRef.current?.focus();
  }, [autoFocus]);

  // Debounced search — hits the server /api/search route (P07-T).
  const executeSearch = useCallback((raw: string) => {
    const query = normalizeQueryClient(raw);

    if (raw.trim().length < DEFAULT_SEARCH_CONFIG.minQueryLength) {
      reqIdRef.current++;
      setState({ status: "idle", query: null, results: [], totalCount: 0 });
      setNoResultsSuggestions([]);
      return;
    }

    setState((prev) => ({ ...prev, status: "loading", query }));
    const myReqId = ++reqIdRef.current;

    const url = `/api/search?q=${encodeURIComponent(raw)}&limit=${DEFAULT_SEARCH_CONFIG.maxResults}`;

    fetch(url)
      .then((res) => (res.ok ? res.json() : []))
      .then((items: ApiSearchItem[]) => {
        if (myReqId !== reqIdRef.current) return; // stale response
        const results = items.map((item, i) =>
          toSearchResult(item, 1 - i * 0.001),
        );
        if (results.length > 0) {
          setState({
            status: "success",
            query,
            results,
            totalCount: results.length,
          });
          setNoResultsSuggestions([]);
        } else {
          setState({
            status: "no_results",
            query,
            results: [],
            totalCount: 0,
          });
          setNoResultsSuggestions(
            buildNoResultsSuggestions(query, items.map((i) => i.title)),
          );
        }
        setActiveIndex(-1);
      })
      .catch(() => {
        if (myReqId !== reqIdRef.current) return;
        setState({
          status: "error",
          query,
          results: [],
          totalCount: 0,
          error: "Search temporarily unavailable",
        });
        setNoResultsSuggestions([]);
        setActiveIndex(-1);
      });
  }, []);

  useEffect(() => {
    if (initialValue.trim().length >= DEFAULT_SEARCH_CONFIG.minQueryLength) {
      executeSearch(initialValue);
    }
  }, [executeSearch, initialValue]);

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
    setNoResultsSuggestions([]);
    setActiveIndex(-1);
    inputRef.current?.focus();
  }, []);

  const isLoading = state.status === "loading";
  const resultsCount = state.status === "success" ? state.results.length : 0;

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
          aria-busy={isLoading}
          className={cn(
            "w-full pl-10 pr-10 py-2.5 rounded-lg",
            "bg-surface border border-border",
            "text-foreground placeholder:text-muted-foreground",
            "focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus:border-transparent",
            "transition-colors duration-200 ease-out",
          )}
        />
        {rawValue && (
          <button
            type="button"
            onClick={handleClear}
            aria-label="Clear search"
            className={cn(
              "touch-target absolute right-3 top-1/2 -translate-y-1/2",
              "flex items-center justify-center",
              "text-muted-foreground hover:text-foreground",
              "focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1 focus-visible:ring-offset-surface rounded",
              "transition-colors duration-200 ease-out",
            )}
          >
            <X className="h-4 w-4" />
          </button>
        )}
        {isLoading && (
          <Loader2
            className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground animate-spin"
            aria-hidden="true"
          />
        )}
      </div>

      <div
        id="search-results"
        aria-live="polite"
        aria-busy={isLoading}
        aria-setsize={resultsCount}
      >
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
            suggestions={noResultsSuggestions}
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
    </div>
  );
}
