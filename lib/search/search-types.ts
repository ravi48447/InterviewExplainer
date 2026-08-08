/**
 * search-types.ts — Canonical search entity model (P07-T036..T050).
 *
 * The single contract for a searchable document. Every search source maps
 * to SearchDocument; every search UI component consumes SearchDocument,
 * never a source-specific shape (P07-T021/T022 — one canonical model).
 *
 * Design (P07-T036..T050):
 *   - Stable entity ID (T052) — never array position
 *   - Canonical entity type separate from display type (T053)
 *   - Search document is read-only; never mutated by ranking (T055)
 *   - Canonical URL (T056) — always the public route, never internal
 */

// ─── Entity types (P07-T040) ────────────────────────────────────────────────

export type SearchEntityType =
  | "domain"
  | "stack"
  | "pillar"
  | "module"
  | "question"
  | "company"
  | "role"
  | "topic"
  | "resource";

// ─── Search document (P07-T051) ───────────────────────────────────────────────

export interface SearchDocument {
  /** Stable entity ID (P07-T052) — slug-based, never array position. */
  id: string;
  /** Canonical entity type (P07-T040). */
  type: SearchEntityType;
  /** Display title — the primary text in search results (P07-T199). */
  title: string;
  /** Public canonical URL (P07-T056) — never an internal rendering path. */
  url: string;
  /** Short description / snippet for the result item (P07-T200). */
  description?: string;
  /** Difficulty for questions (P07-T044). */
  difficulty?: "easy" | "medium" | "hard";
  /** Hierarchy path for grouping (P07-N) — e.g. ["Java Backend", "Spring Boot"]. */
  hierarchyPath?: string[];
  /** Read time in minutes for questions (P07-T045). */
  readTimeMinutes?: number;
  /** Language tag for code/tech content (P07-T043). */
  language?: string;
  /** Searchable keywords / tags (P07-T046). */
  keywords?: string[];
  /** Content status — draft content is excluded from search (P07-T551). */
  status?: "published" | "draft";
}

// ─── Search result (P07-T198..T210) ──────────────────────────────────────────

export interface SearchResult {
  /** The matched document. */
  document: SearchDocument;
  /** Relevance score (0-1, higher = more relevant). */
  score: number;
  /** Matched snippet with highlighting context (P07-T200). */
  snippet?: string;
  /** Matched field(s) for debugging/analytics (P07-T204). */
  matchedFields?: string[];
}

// ─── Search query (P07-T023..T035) ────────────────────────────────────────────

export interface SearchQuery {
  /** Raw user input. */
  raw: string;
  /** Normalized query (P07-T023..T027 — trimmed, lowercased, punctuation-normalized). */
  normalized: string;
  /** Tokens after splitting + stopword removal (P07-T028). */
  tokens: string[];
  /** Detected query intent (P07-I) — optional. */
  intent?: SearchQueryIntent;
}

export type SearchQueryIntent =
  | "exact_match"
  | "partial_match"
  | "navigational"
  | "informational"
  | "unknown";

// ─── Search state (P07-AP) ───────────────────────────────────────────────────

export type SearchStatus =
  | "idle"
  | "loading"
  | "success"
  | "no_results"
  | "error";

export interface SearchState {
  status: SearchStatus;
  query: SearchQuery | null;
  results: SearchResult[];
  totalCount: number;
  error?: string;
}

// ─── Search configuration (P07-T005..T010) ───────────────────────────────────

export interface SearchConfig {
  /** Minimum query length before search activates (P07-T024). */
  minQueryLength: number;
  /** Debounce delay in ms (P07-T). */
  debounceMs: number;
  /** Max results to return (P07-T). */
  maxResults: number;
  /** Whether to include draft content (P07-T551 — default false). */
  includeDrafts: boolean;
}

export const DEFAULT_SEARCH_CONFIG: SearchConfig = {
  minQueryLength: 2,
  debounceMs: 200,
  maxResults: 20,
  includeDrafts: false,
};

// ─── No-results state (P07-W) ────────────────────────────────────────────────

export interface NoResultsSuggestion {
  /** Suggested query text. */
  query: string;
  /** Why it was suggested (typo correction, popular, related). */
  reason: "typo_correction" | "popular" | "related" | "browse";
  /** Optional URL for browse suggestions. */
  url?: string;
  /** Display label for browse suggestions. */
  label?: string;
}
