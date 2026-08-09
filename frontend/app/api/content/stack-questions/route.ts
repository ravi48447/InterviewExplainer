import { NextRequest, NextResponse } from 'next/server';
import { getSubcategoriesWithQuestions } from '@/lib/content-reader';
import type { StackSubcategory } from '@/lib/api';
import { readStaticAsset } from '@/lib/static-asset';

/**
 * GET /api/content/stack-questions?domainSlug=java-backend-3-5&stackSlug=spring-boot
 *
 * Returns StackSubcategory[] built from local JSON content files.
 * Drop-in replacement for the Spring Boot /stacks/{slug}/subcategories endpoint.
 */

export const revalidate = 3600;
// Pre-render at build time and serve the static snapshot. The handler reads
// from the ASSETS binding (see readStaticAsset) first; `force-static` freezes
// the build-time output so the worker never re-runs the fs-walking fallback,
// which has no filesystem on Cloudflare Workers.
export const dynamic = 'force-static';

// Process-wide cache shared across HMR reloads in dev. Without this the entire
// content-reader module graph has to recompile on every request, blocking the
// rest of the dev server (e.g. the user cannot navigate to the next question
// while this route is still compiling).
const g = globalThis as typeof globalThis & {
  _ie_stackQuestionsCache?: Map<string, { at: number; body: StackSubcategory[] }>;
};
g._ie_stackQuestionsCache ??= new Map();
const STACK_QUESTIONS_TTL_MS = 10 * 60 * 1000;

// Returned to the browser so question→question navigation doesn't even
// round-trip to the server. 60 s is way longer than a dev compile cycle but
// short enough that content edits become visible quickly.
const BROWSER_CACHE_CONTROL =
  'private, max-age=60, stale-while-revalidate=300';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const domainSlug = searchParams.get('domainSlug');
  const stackSlug = searchParams.get('stackSlug');

  if (!domainSlug || !stackSlug) {
    return NextResponse.json(
      { error: 'Missing domainSlug or stackSlug' },
      { status: 400 }
    );
  }

  // Bump when StackSubcategory shape changes — avoids stale caches.
  // ::v6 = invalidate stale caches from concurrent enrichment writes.
  const cacheKey = `${domainSlug}::${stackSlug}::v6`;

  // On Cloudflare Workers (and after pre-render on Node), serve the static
  // snapshot from the ASSETS binding — no filesystem walk at request time.
  const staticSnapshot = await readStaticAsset<StackSubcategory[]>(
    `/api/content/stack-questions/${domainSlug}/${stackSlug}.json`
  );
  if (staticSnapshot) {
    return NextResponse.json(staticSnapshot, {
      headers: { 'Cache-Control': BROWSER_CACHE_CONTROL },
    });
  }

  const cached = g._ie_stackQuestionsCache!.get(cacheKey);
  if (cached && Date.now() - cached.at < STACK_QUESTIONS_TTL_MS) {
    return NextResponse.json(cached.body, {
      headers: { 'Cache-Control': BROWSER_CACHE_CONTROL },
    });
  }

  const subcategories = getSubcategoriesWithQuestions(domainSlug, stackSlug);

  if (subcategories.length === 0) {
    return NextResponse.json(
      { error: 'No content found for this stack' },
      { status: 404 }
    );
  }

  g._ie_stackQuestionsCache!.set(cacheKey, {
    at: Date.now(),
    body: subcategories,
  });

  return NextResponse.json(subcategories, {
    headers: { 'Cache-Control': BROWSER_CACHE_CONTROL },
  });
}
