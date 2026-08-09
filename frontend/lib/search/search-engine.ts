/**
 * search-engine.ts — Canonical query normalization + ranking (P07-G..M).
 *
 * The search engine: normalizes the query, matches against the index, ranks
 * results, and returns suggestions for no-results recovery (P07-W).
 *
 * Ranking model (P07-M):
 *   - Exact match on title > exact match on keywords > partial match on title
 *   - Multi-token queries: all tokens must match (AND) for inclusion
 *   - Typo tolerance (P07-L): Levenshtein-1 on tokens for typo correction
 *   - Acronym expansion (P07-H): common acronyms expand before matching
 *
 * This is a deterministic, client-safe ranking engine — no external search
 * service dependency (P07-F technology decision: build, not buy).
 */

import { getSearchIndex } from "./search-index";
import type {
  SearchDocument,
  SearchResult,
  SearchQuery,
  SearchQueryIntent,
  NoResultsSuggestion,
} from "./search-types";

// ─── Acronym map (P07-H) ─────────────────────────────────────────────────────

const ACRONYM_MAP: Record<string, string[]> = {
  jvm: ["java virtual machine", "java"],
  jpa: ["java persistence api", "java"],
  spring: ["spring boot", "spring framework"],
  api: ["application programming interface"],
  sql: ["structured query language", "database"],
  rest: ["representational state transfer"],
  oop: ["object oriented programming"],
  dsa: ["data structures and algorithms"],
  ci: ["continuous integration"],
  cd: ["continuous deployment", "continuous delivery"],
  orm: ["object relational mapping"],
  di: ["dependency injection"],
};

// ─── Query normalization (P07-G) ──────────────────────────────────────────────

/**
 * Normalize a raw query into a SearchQuery (P07-T023..T027).
 * Trims, lowercases, normalizes punctuation, splits into tokens, removes
 * stopwords, and expands acronyms (P07-H).
 */
export function normalizeQuery(raw: string): SearchQuery {
  const trimmed = raw.trim();
  const normalized = trimmed
    .toLowerCase()
    .replace(/[^\w\s-]/g, " ")
    .replace(/\s+/g, " ")
    .trim();

  const rawTokens = normalized.split(" ").filter(Boolean);
  const stopWords = new Set(["the", "a", "an", "is", "are", "in", "on", "for", "of", "to", "and", "or", "with"]);
  const tokens: string[] = [];

  for (const token of rawTokens) {
    if (stopWords.has(token)) continue;
    // Acronym expansion (P07-H).
    const expanded = ACRONYM_MAP[token];
    if (expanded) {
      tokens.push(token, ...expanded.flatMap((e) => e.split(" ")));
    } else {
      tokens.push(token);
    }
  }

  const intent = detectIntent(normalized, tokens);

  return { raw, normalized, tokens, intent };
}

function detectIntent(normalized: string, tokens: string[]): SearchQueryIntent {
  if (tokens.length === 0) return "unknown";
  // Navigational: single token that looks like a slug or known entity name.
  if (tokens.length === 1 && /^[a-z]+-[a-z]+/.test(tokens[0])) return "navigational";
  // Exact match: quoted or single token.
  if (normalized.startsWith('"') && normalized.endsWith('"')) return "exact_match";
  if (tokens.length === 1) return "exact_match";
  return "partial_match";
}

// ─── Search (P07-J..M) ───────────────────────────────────────────────────────

/**
 * Execute a search against the index (P07-J..M).
 * Returns ranked results. Empty array if no matches.
 */
export function search(query: SearchQuery, maxResults = 20): SearchResult[] {
  if (query.tokens.length === 0) return [];

  const index = getSearchIndex();
  const results: SearchResult[] = [];

  for (const doc of index) {
    const result = matchDocument(doc, query);
    if (result) results.push(result);
  }

  // Sort by score descending (P07-M).
  results.sort((a, b) => b.score - a.score);

  return results.slice(0, maxResults);
}

function matchDocument(doc: SearchDocument, query: SearchQuery): SearchResult | null {
  const titleLower = doc.title.toLowerCase();
  const keywordLower = (doc.keywords ?? []).map((k) => k.toLowerCase());
  const descLower = (doc.description ?? "").toLowerCase();

  let score = 0;
  let matchedFields: string[] = [];

  for (const token of query.tokens) {
    let tokenMatched = false;

    // Exact match on title (P07-J) — highest score.
    if (titleLower === token || titleLower.startsWith(`${token} `) || titleLower.includes(` ${token} `)) {
      score += token === titleLower ? 1.0 : 0.7;
      matchedFields.push("title");
      tokenMatched = true;
    } else if (titleLower.includes(token)) {
      // Partial match on title (P07-K).
      score += 0.5;
      matchedFields.push("title");
      tokenMatched = true;
    }

    // Exact match on keywords.
    if (keywordLower.some((k) => k === token)) {
      score += 0.6;
      matchedFields.push("keywords");
      tokenMatched = true;
    } else if (keywordLower.some((k) => k.includes(token))) {
      score += 0.3;
      matchedFields.push("keywords");
      tokenMatched = true;
    }

    // Match on description (lower weight).
    if (descLower.includes(token)) {
      score += 0.15;
      matchedFields.push("description");
      tokenMatched = true;
    }

    // Typo tolerance (P07-L) — Levenshtein-1 on title tokens.
    if (!tokenMatched) {
      const titleTokens = titleLower.split(/[\s-]+/);
      if (titleTokens.some((t) => levenshtein(token, t) <= 1 && t.length >= 3)) {
        score += 0.4;
        matchedFields.push("title~");
        tokenMatched = true;
      }
    }

    // All tokens must match (AND) for multi-token queries.
    if (!tokenMatched) return null;
  }

  // Normalize score.
  score = Math.min(1, score / query.tokens.length);

  return {
    document: doc,
    score,
    matchedFields: Array.from(new Set(matchedFields)),
    snippet: buildSnippet(doc, query.tokens),
  };
}

function buildSnippet(doc: SearchDocument, tokens: string[]): string | undefined {
  if (!doc.description) return undefined;
  const desc = doc.description;
  const lower = desc.toLowerCase();
  for (const token of tokens) {
    const idx = lower.indexOf(token);
    if (idx >= 0) {
      const start = Math.max(0, idx - 40);
      const end = Math.min(desc.length, idx + token.length + 40);
      return (start > 0 ? "…" : "") + desc.slice(start, end) + (end < desc.length ? "…" : "");
    }
  }
  return desc.slice(0, 120);
}

// ─── No-results recovery (P07-W) ─────────────────────────────────────────────

/**
 * Generate suggestions when search returns no results (P07-W).
 * Includes typo corrections and browse suggestions.
 */
export function getNoResultsSuggestions(query: SearchQuery): NoResultsSuggestion[] {
  const suggestions: NoResultsSuggestion[] = [];

  // Typo corrections: find close matches in index.
  const index = getSearchIndex();
  const titleSet = new Set(index.map((d) => d.title.toLowerCase()));

  for (const token of query.tokens) {
    if (token.length < 3) continue;
    for (const title of titleSet) {
      const dist = levenshtein(token, title.split(/[\s-]+/)[0] ?? title);
      if (dist === 1 && dist < token.length) {
        suggestions.push({
          query: title,
          reason: "typo_correction",
        });
        if (suggestions.length >= 3) break;
      }
    }
    if (suggestions.length >= 3) break;
  }

  // Browse suggestions.
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

// ─── Levenshtein distance (P07-L) ───────────────────────────────────────────

function levenshtein(a: string, b: string): number {
  if (a.length === 0) return b.length;
  if (b.length === 0) return a.length;

  let prev = new Array<number>(b.length + 1);
  let curr = new Array<number>(b.length + 1);

  for (let j = 0; j <= b.length; j++) prev[j] = j;

  for (let i = 1; i <= a.length; i++) {
    curr[0] = i;
    for (let j = 1; j <= b.length; j++) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1;
      curr[j] = Math.min(prev[j] + 1, curr[j - 1] + 1, prev[j - 1] + cost);
    }
    [prev, curr] = [curr, prev];
  }

  return prev[b.length];
}
