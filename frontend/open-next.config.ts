import { defineCloudflareConfig } from "@opennextjs/cloudflare";

/**
 * OpenNext → Cloudflare Workers adapter config.
 *
 * The default config is sufficient for a read-only site whose content is
 * pre-rendered at build time and served as static assets. No incremental
 * cache override (R2) is needed because every page is fully static (SSG) and
 * the API routes read from the ASSETS binding instead of the filesystem.
 *
 * See: https://opennext.js.org/cloudflare
 */
export default defineCloudflareConfig({});
