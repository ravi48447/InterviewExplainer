#!/usr/bin/env node
/**
 * Flatten Next.js standalone output so @opennextjs/cloudflare can bundle it.
 *
 * Why this exists
 * ---------------
 * This app lives at `<repo>/frontend/` and imports shared content from
 * `<repo>/content/` via the `@content/*` alias. For that alias to resolve at
 * build time, `next.config.mjs` sets `outputFileTracingRoot` (and the Turbopack
 * `root`) to the **repo root** (the parent of `frontend/`).
 *
 * Because the trace root is the repo root, `next build` (standalone mode)
 * nests the standalone output under the app's package path:
 *
 *     .next/standalone/frontend/.next/...
 *     .next/standalone/frontend/node_modules/...
 *     .next/standalone/frontend/package.json
 *     .next/standalone/content/...            (traced from the repo root)
 *
 * @opennextjs/cloudflare, however, computes the package path as
 * `path.relative(monorepoRoot, appBuildOutputPath)`. Its `findPackagerAndRoot`
 * detects `frontend/package-lock.json` and locks `monorepoRoot` to `frontend/`,
 * so `getPackagePath()` returns `""` (empty) and it expects a **flat** layout:
 *
 *     .next/standalone/.next/...
 *     .next/standalone/node_modules/...
 *
 * That mismatch makes the Cloudflare build fail with
 * `ENOENT ...standalone/.next/server/pages-manifest.json` (and later a missing
 * `@vercel/og` font in `node_modules`). There is no config option that
 * reconciles the two: the trace root must be the repo root for `@content/*`,
 * and the lockfile pins the open-next monorepo root to `frontend/`.
 *
 * The fix
 * -------
 * After `next build` produces the nested standalone tree, move everything
 * from `.next/standalone/frontend/` up one level into `.next/standalone/` so
 * the layout is flat — exactly what open-next expects. `content/` already
 * lives at `.next/standalone/content/` (traced from the repo root) and is not
 * present inside `frontend/`, so there is no collision. We then invoke
 * `opennextjs-cloudflare build --skipNextBuild` so open-next consumes the
 * already-flattened tree instead of rebuilding.
 *
 * Run via `npm run build:cf` (which chains: next build → this script →
 * opennextjs-cloudflare build --skipNextBuild).
 */
const fs = require("node:fs");
const path = require("node:path");

const standaloneDir = path.join(process.cwd(), ".next", "standalone");
const nestedAppDir = path.join(standaloneDir, "frontend");

function main() {
  if (!fs.existsSync(standaloneDir)) {
    console.error(
      `flatten-standalone: "${standaloneDir}" not found. Run "next build" first.`,
    );
    process.exit(1);
  }

  // Already flat? Nothing to do (e.g. script re-run after a successful flatten).
  if (!fs.existsSync(nestedAppDir)) {
    if (fs.existsSync(path.join(standaloneDir, ".next"))) {
      console.log("flatten-standalone: standalone already flat, nothing to do.");
      return;
    }
    console.error(
      `flatten-standalone: neither "${nestedAppDir}" nor a flat ".next/standalone/.next" was found — unexpected standalone layout.`,
    );
    process.exit(1);
  }

  // Move every entry (including dotfiles) from .next/standalone/frontend/ up
  // into .next/standalone/. Skip "." and "..". Refuse to overwrite an existing
  // top-level entry to avoid silently clobbering the repo-root-traced
  // `content/` dir (which should never be duplicated inside frontend/, but
  // we guard anyway).
  const entries = fs.readdirSync(nestedAppDir, { withFileTypes: true });
  let moved = 0;
  for (const entry of entries) {
    const src = path.join(nestedAppDir, entry.name);
    const dst = path.join(standaloneDir, entry.name);
    if (fs.existsSync(dst)) {
      // `content/` legitimately exists at the top level (traced from the repo
      // root) and is not duplicated inside frontend/. Any other collision is
      // unexpected — surface it loudly rather than guess.
      console.error(
        `flatten-standalone: refusing to overwrite "${dst}" (already exists). Nested entry "${entry.name}" would collide.`,
      );
      process.exit(1);
    }
    fs.renameSync(src, dst);
    moved++;
  }

  // Remove the now-empty frontend/ directory.
  fs.rmdirSync(nestedAppDir);

  // Sanity-check the result.
  const required = [
    path.join(standaloneDir, ".next", "server", "pages-manifest.json"),
    path.join(standaloneDir, "node_modules"),
    path.join(standaloneDir, "package.json"),
  ];
  for (const p of required) {
    if (!fs.existsSync(p)) {
      console.error(`flatten-standalone: expected file/dir missing after flatten: ${p}`);
      process.exit(1);
    }
  }

  console.log(
    `flatten-standalone: moved ${moved} entries from frontend/ up to .next/standalone/. Standalone is now flat.`,
  );
}

main();
