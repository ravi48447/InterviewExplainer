/**
 * index.ts — Barrel for the canonical search layer (P07).
 */
export type {
  SearchDocument,
  SearchEntityType,
  SearchResult,
  SearchQuery,
  SearchQueryIntent,
  SearchState,
  SearchStatus,
  SearchConfig,
  NoResultsSuggestion,
} from "./search-types";

export { DEFAULT_SEARCH_CONFIG } from "./search-types";

export {
  getSearchIndex,
  getSearchDocument,
  getDocumentsByType,
  clearSearchIndex,
} from "./search-index";

export {
  normalizeQuery,
  search,
  getNoResultsSuggestions,
} from "./search-engine";
