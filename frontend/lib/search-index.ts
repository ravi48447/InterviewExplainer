/**
 * lib/search-index.ts — shared search index builder.
 *
 * Extracted from `app/api/search/route.ts` so the index can be built in two
 * places without duplicating logic:
 *   1. At runtime in the `/api/search` route (on Node dev, when no pre-rendered
 *      static index is available).
 *   2. At build time by `scripts/pre-render-api.ts`, which snapshots the index
 *      to `public/api/search-index.json` so the Workers runtime can serve it
 *      from the ASSETS binding without a filesystem walk.
 */

import {
  listLanguages,
  listTracks,
  listLevels,
  listStacksForPath,
  resolveStackContent,
  listSharedTools,
  listSharedFrontendLibs,
  getQuestionsForTool,
} from '@/lib/contentV2';

export interface SearchResult {
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
  type: 'interview' | 'tool';
}

function toDisplay(s: string): string {
  return s.split('-').map((w) => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
}

export function buildSearchIndex(): SearchResult[] {
  const results: SearchResult[] = [];

  for (const lang of listLanguages()) {
    for (const track of listTracks(lang)) {
      for (const level of listLevels(lang, track)) {
        const domainSlug = `${lang}-${track}-${level}`;
        for (const stack of listStacksForPath(lang, track, level)) {
          const content = resolveStackContent(lang, track, level, stack);
          if (!content) continue;
          for (const q of content.questions) {
            results.push({
              title: q.title || q.question,
              slug: q.slug,
              domainSlug,
              stackSlug: stack,
              questionSlug: q.slug,
              difficulty: q.difficulty || 'medium',
              readingTime: q.reading_time_minutes || 5,
              language: toDisplay(lang),
              track: toDisplay(track),
              level: toDisplay(level),
              stack: toDisplay(stack),
              type: 'interview',
            });
          }
        }
      }
    }
  }

  const tools = [...listSharedTools(), ...listSharedFrontendLibs()];
  for (const tool of tools) {
    const levels = getQuestionsForTool(tool);
    for (const { level, questions } of levels) {
      for (const q of questions) {
        results.push({
          title: q.title || q.question,
          slug: q.slug,
          domainSlug: '',
          stackSlug: tool,
          questionSlug: q.slug,
          difficulty: q.difficulty || 'medium',
          readingTime: q.reading_time_minutes || 5,
          language: 'Shared',
          track: 'Tools',
          level: toDisplay(level),
          stack: toDisplay(tool),
          type: 'tool',
        });
      }
    }
  }

  return results;
}

export function scoreMatch(query: string, title: string): number {
  const q = query.toLowerCase();
  const t = title.toLowerCase();
  if (t === q) return 100;
  if (t.startsWith(q)) return 90;
  if (t.includes(q)) return 80;
  const words = q.split(/\s+/).filter(Boolean);
  const matched = words.filter((w) => t.includes(w));
  if (matched.length === words.length) return 70;
  if (matched.length > 0) return 30 + (matched.length / words.length) * 40;
  return 0;
}
