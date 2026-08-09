import { defineCloudflareConfig } from "@opennextjs/cloudflare";
import staticAssetsIncrementalCache from "@opennextjs/cloudflare/overrides/incremental-cache/static-assets-incremental-cache";

/**
 * OpenNext → Cloudflare Workers adapter config.
 *
 * The site is read-only: every page is fully static (SSG) and every API route
 * reads from the ASSETS binding instead of the filesystem. We therefore pin
 * the incremental cache to `staticAssetsIncrementalCache` — a read-only store
 * backed by Workers Static Assets.
 *
 * Why this matters: pages that still carry `export const revalidate` would,
 * with the default cache, attempt a background re-render on cache expiry —
 * which re-runs the page body (and thus `fs`) on Workers, where there is no
 * filesystem. `staticAssetsIncrementalCache` is explicitly read-only and does
 * NOT support revalidation, so the worker always serves the build-time
 * pre-rendered HTML and never re-renders at runtime. This makes the "no fs on
 * Workers" constraint a non-issue regardless of any leftover `revalidate`.
 *
 * `enableCacheInterception` improves cold-start performance for cached SSG
 * routes (safe for a read-only site; not compatible with PPR, which we don't
 * use).
 *
 * See: https://opennext.js.org/cloudflare/caching
 */
export default defineCloudflareConfig({
  incrementalCache: staticAssetsIncrementalCache,
  enableCacheInterception: true,
});
