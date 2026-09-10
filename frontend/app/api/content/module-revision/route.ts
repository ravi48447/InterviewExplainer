import { NextRequest, NextResponse } from 'next/server';
import { getModuleRevision } from '@/lib/content-reader';
import type { ModuleRevision } from '@/lib/api';
import { readStaticAsset } from '@/lib/static-asset';

/**
 * GET /api/content/module-revision?domainSlug=...&stackSlug=...
 *
 * Returns the single ModuleRevision (5–6 sections) attached to a module's
 * `_revision.json` file. This is intentionally a **separate** endpoint from
 * `stack-questions` — revisions are large markdown blobs that we don't want
 * to ship with every navigation fetch (sidebar, topic counts, etc.).
 *
 * Response shape:
 *   200 → { revision: ModuleRevision }
 *   404 → { revision: null }   (module exists but has no revision yet)
 *
 * We never 404 for "no revision available" because the UI uses the absence
 * to hide the synthetic Revision card silently — a 404 would noisily appear
 * in the dev console for every revision-less module.
 */

export const revalidate = 3600;
// Pre-render at build time and serve the static snapshot. The handler reads
// from the ASSETS binding (see readStaticAsset) first; `force-static` freezes
// the build-time output so the worker never re-runs the fs-walking fallback,
// which has no filesystem on Cloudflare Workers.
export const dynamic = 'force-static';

const g = globalThis as typeof globalThis & {
  _ie_moduleRevisionCache?: Map<string, { at: number; body: ModuleRevision | null }>;
};
g._ie_moduleRevisionCache ??= new Map();
const TTL_MS = 10 * 60 * 1000;

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

  const cacheKey = `${domainSlug}::${stackSlug}::v1`;

  // On Cloudflare Workers (and after pre-render on Node), serve the static
  // snapshot from the ASSETS binding — no filesystem walk at request time.
  const staticSnapshot = await readStaticAsset<{ revision: ModuleRevision | null }>(
    `/api/content/module-revision/${domainSlug}/${stackSlug}.json`
  );
  if (staticSnapshot) return NextResponse.json(staticSnapshot);

  const cached = g._ie_moduleRevisionCache!.get(cacheKey);
  if (cached && Date.now() - cached.at < TTL_MS) {
    return NextResponse.json({ revision: cached.body });
  }

  const revision = getModuleRevision(domainSlug, stackSlug) ?? null;
  g._ie_moduleRevisionCache!.set(cacheKey, { at: Date.now(), body: revision });

  return NextResponse.json({ revision });
}
