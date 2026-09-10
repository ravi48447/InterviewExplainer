/**
 * static-asset.ts — Cloudflare Workers / Node dual-runtime content reader.
 *
 * Cloudflare Workers have NO filesystem (`fs` is a no-op stub). Content that
 * used to be read from `content/` at request time is instead pre-rendered to
 * `public/api/...` as static JSON at build time (see `scripts/pre-render-api.ts`)
 * and served through the Workers `ASSETS` binding at runtime.
 *
 * This module gives every content API route a single helper that:
 *   1. On Cloudflare Workers: fetches the pre-rendered JSON via `env.ASSETS`.
 *   2. On Node (local `next dev` / `next start` / build-time): reads the same
 *      file from `public/` with `fs` — so local development is unchanged.
 *
 * The helper returns `null` when the pre-rendered asset is missing (e.g. a
 * new content entry that hasn't been re-rendered yet). Routes fall back to
 * their original fs-walking logic in that case, which is a no-op on Workers
 * but keeps Node dev resilient.
 */

import fs from 'fs';
import path from 'path';

type AssetsBinding = { fetch: (req: Request) => Promise<Response> };

interface CloudflareEnv {
  ASSETS?: AssetsBinding;
}

/**
 * Read a pre-rendered static JSON asset by its public URL path.
 *
 * @param assetPath  URL path beginning with `/api/...` (the public location
 *                   of the pre-rendered JSON, e.g. `/api/content/all-domains.json`).
 * @returns          parsed JSON, or `null` if the asset is unavailable.
 */
export async function readStaticAsset<T = unknown>(assetPath: string): Promise<T | null> {
  // ── Cloudflare Workers: read via the ASSETS binding ────────────────────────
  // `getCloudflareContext` is only available in the Workers runtime; a dynamic
  // import keeps Node (where the package's dev shim may not exist) from crashing
  // at module load.
  try {
    const mod = await import('@opennextjs/cloudflare');
    if (typeof mod.getCloudflareContext === 'function') {
      const ctx = await mod.getCloudflareContext();
      const env = ctx.env as CloudflareEnv;
      if (env?.ASSETS) {
        const res = await env.ASSETS.fetch(new Request(`https://assets.local${assetPath}`));
        if (res.ok) {
          return (await res.json()) as T;
        }
      }
    }
  } catch {
    // Not on Workers, or the binding is absent — fall through to fs.
  }

  // ── Node (dev / build / next start): read from public/ ──────────────────────
  try {
    const filePath = path.join(process.cwd(), 'public', assetPath);
    if (fs.existsSync(filePath)) {
      const raw = fs.readFileSync(filePath, 'utf-8');
      return JSON.parse(raw) as T;
    }
  } catch {
    // fall through
  }

  return null;
}

/**
 * Whether the current runtime can serve pre-rendered assets. On Workers this
 * is always true once the ASSETS binding is wired; on Node it's true only when
 * the pre-rendered files exist under `public/` (i.e. the pre-render script
 * has run). Used by routes to decide whether to skip their fs-walk fallback.
 */
export function hasStaticAssets(): boolean {
  try {
    const mod = require('@opennextjs/cloudflare');
    if (typeof mod.getCloudflareContext === 'function') {
      // On Workers the context resolves synchronously enough for a presence
      // check; if it throws, we're on Node and fall through.
      return true;
    }
  } catch {
    // not on Workers
  }
  // Node: assets exist iff the pre-render output is on disk.
  return fs.existsSync(path.join(process.cwd(), 'public', 'api'));
}
