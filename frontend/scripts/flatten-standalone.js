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
 * Because the trace root is the repo root, `next build` (standalone mode) traces
 * the repo-root siblings of `frontend/` (e.g. `content/`, `scripts/`,
 * `.data/`) into `.next/standalone/` directly, while everything reachable from
 * `frontend/` is nested under `.next/standalone/frontend/`:
 *
 *     .next/standalone/frontend/.next/...
 *     .next/standalone/frontend/node_modules/...
 *     .next/standalone/frontend/package.json
 *     .next/standalone/frontend/scripts/flatten-standalone.js   (app scripts)
 *     .next/standalone/content/...            (traced from the repo root)
 *     .next/standalone/scripts/audit_speakable.py               (repo scripts)
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
 * the layout is flat — exactly what open-next expects. When a nested entry
 * shares a name with a top-level entry (this happens for `scripts/`: the repo
 * root traces `<repo>/scripts/` to the top level, while the app's
 * `frontend/scripts/` is nested), the two must be **merged**:
 *
 *   - directory ↔ directory  → recurse and merge children
 *   - file    ↔ file        → the nested (app) copy wins (it is the app's own)
 *   - file    ↔ directory   → error (a name clash between a file and a dir is
 *                              unexpected and should not be silently resolved)
 *   - directory ↔ file      → error (same)
 *
 * `content/` only ever exists at the top level (it is traced from the repo
 * root and is not duplicated inside `frontend/`), so it never collides. We
 * then invoke `opennextjs-cloudflare build --skipNextBuild` so open-next
 * consumes the already-flattened tree instead of rebuilding.
 *
 * Run via `npm run build:cf` (which chains: next build → this script →
 * opennextjs-cloudflare build --skipNextBuild).
 */
const fs = require("node:fs");
const path = require("node:path");

const standaloneDir = path.join(process.cwd(), ".next", "standalone");
const nestedAppDir = path.join(standaloneDir, "frontend");

/**
 * Move every entry from `srcDir` into `dstDir`, merging into any entries that
 * already exist there. `fileWins` controls what happens on a file↔file clash:
 * the nested (app) file replaces the top-level one.
 *
 * @param {string} srcDir   - source directory (the nested `frontend/` subtree)
 * @param {string} dstDir   - destination directory (the flat standalone root)
 * @param {number[]} moved  - accumulator: [filesMoved, dirsMoved, merges]
 */
function mergeDir(srcDir, dstDir, moved) {
  const entries = fs.readdirSync(srcDir, { withFileTypes: true });
  for (const entry of entries) {
    if (entry.name === "." || entry.name === "..") continue;
    const src = path.join(srcDir, entry.name);
    const dst = path.join(dstDir, entry.name);

    if (fs.existsSync(dst)) {
      const srcStat = fs.statSync(src);
      const dstStat = fs.statSync(dst);
      const srcIsDir = srcStat.isDirectory();
      const dstIsDir = dstStat.isDirectory();

      if (srcIsDir && dstIsDir) {
        // directory ↔ directory → recurse and merge children
        mergeDir(src, dst, moved);
        // src is now empty (all children moved/merged); remove it
        fs.rmdirSync(src);
        moved[2]++;
      } else if (!srcIsDir && !dstIsDir) {
        // file ↔ file → nested (app) copy wins
        fs.renameSync(src, dst);
        moved[0]++;
        moved[2]++;
      } else {
        // file ↔ directory (or directory ↔ file) — name clash of different
        // kinds is unexpected; refuse rather than guess.
        console.error(
          `flatten-standalone: type clash for "${entry.name}" — ` +
            `${srcIsDir ? "dir" : "file"} vs existing ${dstIsDir ? "dir" : "file"}. Refusing to guess.`,
        );
        process.exit(1);
      }
    } else {
      // No collision: a plain rename is enough.
      fs.renameSync(src, dst);
      if (entry.isDirectory()) moved[1]++;
      else moved[0]++;
    }
  }
}

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

  // Move/merge every entry (including dotfiles) from .next/standalone/frontend/
  // up into .next/standalone/. Directories that already exist at the top level
  // (e.g. `scripts/` traced from the repo root) are merged recursively instead
  // of clobbering each other.
  const moved = [0, 0, 0]; // [files, dirs, merges]
  mergeDir(nestedAppDir, standaloneDir, moved);

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
    `flatten-standalone: moved ${moved[0]} file(s) and ${moved[1]} dir(s) from frontend/ up to .next/standalone/` +
      (moved[2] > 0 ? ` (${moved[2]} merged into existing top-level entries).` : ".") +
      " Standalone is now flat.",
  );
}

main();
