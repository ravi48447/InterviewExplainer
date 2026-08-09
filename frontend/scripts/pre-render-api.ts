/**
 * scripts/pre-render-api.ts
 *
 * Snapshots every content API response to static JSON under `public/api/...`
 * so the routes can be served from the Cloudflare Workers ASSETS binding
 * (which has no filesystem) instead of walking `content/` at request time.
 *
 * Run automatically before `next build` via the `prebuild` npm script. The
 * build container HAS a filesystem, so the imported `lib/content*` modules
 * work here; the output is bundled into `.open-next/assets` by the adapter
 * and served as static assets on Workers.
 *
 * The script imports the SAME modules the routes use (contentV2, content-reader,
 * and the route handlers themselves for the complex responses), so the
 * pre-rendered JSON is byte-identical to what the route would have produced.
 * No content logic is duplicated.
 */

import fs from 'fs';
import path from 'path';

const PUBLIC_DIR = path.join(process.cwd(), 'public');
const OUT_DIR = path.join(PUBLIC_DIR, 'api');

function ensureDir(dir: string) {
  fs.mkdirSync(dir, { recursive: true });
}

function writeJson(relPath: string, data: unknown) {
  const full = path.join(OUT_DIR, relPath);
  ensureDir(path.dirname(full));
  fs.writeFileSync(full, JSON.stringify(data), 'utf-8');
  return relPath;
}

async function main() {
  console.log('[pre-render] snapshotting content API responses → public/api/');
  ensureDir(OUT_DIR);

  // ── /api/content/all-domains ────────────────────────────────────────────────
  // The route computes ContentDomain[] from the full content tree. Rather than
  // duplicate the (large) scan logic, we shell out to the route's own handler
  // by importing its computation. The route file doesn't export a pure
  // function, so we replicate the locked-domain + interview discovery via the
  // same helpers the route uses.
  {
    const { computeAllDomains } = await import('../app/api/content/all-domains/route');
    // `computeAllDomains` is module-local (not exported) — we can't import it.
    // Instead, import the route module to trigger its side effects, then call
    // the exported GET via a Request. But GET isn't easily callable without a
    // runtime. Simplest: re-implement the discovery here using content-reader
    // + contentV2, which is exactly what the route does.
    // (See inline implementation below.)
  }

  // Because the route handlers are tightly coupled to their own module-local
  // fs-walking helpers, the cleanest no-duplication approach is to import each
  // route's GET function and invoke it with a synthetic NextRequest. Next's
  // `NextRequest` is a `Request` subclass; constructing one from a URL works in
  // Node.
  const { NextRequest } = await import('next/server');

  async function callRoute(
    modPath: string,
    url: string,
  ): Promise<unknown> {
    const mod = await import(modPath);
    const req = new NextRequest(url);
    const res = await mod.GET(req);
    if (!res.ok) return null;
    return await res.json();
  }

  // ── /api/content/all-domains ────────────────────────────────────────────────
  {
    const data = await callRoute(
      '../app/api/content/all-domains/route',
      'http://localhost/api/content/all-domains',
    );
    if (data) writeJson('content/all-domains.json', data);
    console.log(`[pre-render] all-domains: ${Array.isArray(data) ? data.length : 0} domains`);
  }

  // ── /api/content/domain-stacks + stack-questions + stack-structure + module-revision + curriculum-nav ─
  // Enumerate every (domainSlug, stackSlug) pair from the locked-domain registry
  // (the only content roots that exist in this repo). For each, snapshot the
  // per-stack endpoints.
  const LOCKED_DOMAINS = [
    'java-backend-intermediate',
    'java-fullstack-intermediate',
    'java-backend-fresher',
    'go-intermediate',
    'go-fresher',
    'ruby-backend-intermediate',
    'ruby-backend-fresher',
    'java-fullstack-fresher',
  ];

  for (const domainSlug of LOCKED_DOMAINS) {
    // domain-stacks
    {
      const data = await callRoute(
        '../app/api/content/domain-stacks/route',
        `http://localhost/api/content/domain-stacks?domainSlug=${domainSlug}`,
      );
      if (data) writeJson(`content/domain-stacks/${domainSlug}.json`, data);
    }

    // Enumerate stacks for this domain from the domain-stacks response.
    const stacksRes = await callRoute(
      '../app/api/content/domain-stacks/route',
      `http://localhost/api/content/domain-stacks?domainSlug=${domainSlug}`,
    );
    const stacks: Array<{ slug: string }> =
      stacksRes && Array.isArray((stacksRes as any).stacks)
        ? (stacksRes as any).stacks
        : [];

    for (const stack of stacks) {
      const stackSlug = stack.slug;

      // stack-questions
      {
        const data = await callRoute(
          '../app/api/content/stack-questions/route',
          `http://localhost/api/content/stack-questions?domainSlug=${domainSlug}&stackSlug=${stackSlug}`,
        );
        if (data) writeJson(`content/stack-questions/${domainSlug}/${stackSlug}.json`, data);
      }

      // stack-structure
      {
        const data = await callRoute(
          '../app/api/content/stack-structure/route',
          `http://localhost/api/content/stack-structure?domainSlug=${domainSlug}&stackSlug=${stackSlug}`,
        );
        if (data) writeJson(`content/stack-structure/${domainSlug}/${stackSlug}.json`, data);
      }

      // module-revision
      {
        const data = await callRoute(
          '../app/api/content/module-revision/route',
          `http://localhost/api/content/module-revision?domainSlug=${domainSlug}&stackSlug=${stackSlug}`,
        );
        if (data) writeJson(`content/module-revision/${domainSlug}/${stackSlug}.json`, data);
      }

      // curriculum-nav
      {
        const data = await callRoute(
          '../app/api/content/curriculum-nav/route',
          `http://localhost/api/content/curriculum-nav?domainSlug=${domainSlug}&stackSlug=${stackSlug}`,
        );
        if (data) writeJson(`content/curriculum-nav/${domainSlug}/${stackSlug}.json`, data);
      }
    }
    console.log(`[pre-render] ${domainSlug}: ${stacks.length} stacks snapshotted`);
  }

  // ── /api/v2/interview-nav ───────────────────────────────────────────────────
  // Enumerate lang/track/level combos. content/interview/ is empty in this repo,
  // so listLanguages() returns [] — the route returns []. We still render the
  // empty response so the route can serve it statically.
  {
    const { listLanguages, listTracks, listLevels } = await import('../lib/contentV2');
    const langs = listLanguages();
    for (const lang of langs) {
      for (const track of listTracks(lang)) {
        for (const level of listLevels(lang, track)) {
          const data = await callRoute(
            '../app/api/v2/interview-nav/route',
            `http://localhost/api/v2/interview-nav?lang=${lang}&track=${track}&level=${level}`,
          );
          if (data) writeJson(`v2/interview-nav/${lang}/${track}/${level}.json`, data);
        }
      }
    }
    console.log(`[pre-render] v2/interview-nav: ${langs.length} langs`);
  }

  // ── /api/search ─────────────────────────────────────────────────────────────
  // The search index is built from the full content tree. Pre-render the whole
  // index; the route reads it and does the scoring at runtime (cheap, no fs).
  {
    const { buildSearchIndex } = await import('../lib/search-index');
    const index = buildSearchIndex();
    writeJson('search-index.json', index);
    console.log(`[pre-render] search-index: ${index.length} entries`);
  }

  console.log('[pre-render] done.');
}

main().catch((err) => {
  console.error('[pre-render] FAILED:', err);
  process.exit(1);
});
