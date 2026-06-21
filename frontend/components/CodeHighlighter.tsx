"use client";

/**
 * CodeHighlighter
 *
 * Single-instance client component that runs `highlight.js` against every
 * `<pre><code class="hljs language-...">` block on the page AFTER hydration.
 *
 * Why a client-side pass instead of the previous server-side marked renderer
 * call:
 *   - Server-side `hljs.highlight()` inlined hundreds of <span class="hljs-*">
 *     tags into the RSC payload. A system-design question ballooned to
 *     ~450 KB per navigation; the same page with raw code is ~60 KB.
 *   - Parsing a 450 KB RSC payload + hydrating it is what made "click next
 *     question" feel frozen. Shrinking the payload is the single biggest
 *     perceived-perf win available short of a full SSG build.
 *
 * The trade-off is a tiny visual flash of unstyled (monochrome) code on very
 * slow devices before the client-side highlighter runs. In practice the
 * highlight pass completes in <30 ms per page even with a dozen blocks and
 * happens *inside* the useEffect — so it doesn't block first paint at all.
 *
 * The module is a singleton — we only need one instance mounted per page.
 * It uses a MutationObserver so dynamically rendered code (e.g. inside a
 * <details> that's expanded after mount) also gets picked up.
 */

import { useEffect } from "react";

type HljsApi = {
  highlightElement: (el: HTMLElement) => void;
};

let hljsPromise: Promise<HljsApi> | null = null;

function loadHljs(): Promise<HljsApi> {
  if (hljsPromise) return hljsPromise;
  // ONE dynamic import of the pre-bundled "common" subset (~35 languages
  // including java, js/ts, python, sql, bash, json, yaml, xml, etc.).
  // An earlier version fanned out into 19 parallel dynamic imports and
  // caused Turbopack's dev-mode module-graph work to spike so hard that the
  // Next memory monitor auto-restarted the server in a loop. A single
  // import resolves to a single lazy chunk and Turbopack handles it fine.
  hljsPromise = import("highlight.js/lib/common").then(
    (mod) => (mod.default ?? mod) as HljsApi,
  );
  return hljsPromise;
}

// Marker attribute so the same node isn't highlighted twice. hljs also sets
// `data-highlighted="yes"` itself but keeping our own marker makes the guard
// explicit and cheaper to check.
const DONE_ATTR = "data-ie-highlighted";

function highlightAll(root: ParentNode, hljs: HljsApi) {
  const nodes = root.querySelectorAll<HTMLElement>(
    `pre code.hljs:not([${DONE_ATTR}])`,
  );
  nodes.forEach((el) => {
    try {
      hljs.highlightElement(el);
    } catch {
      // hljs throws on malformed lang tags; fall back silently.
    }
    el.setAttribute(DONE_ATTR, "1");
  });
}

export default function CodeHighlighter() {
  useEffect(() => {
    let cancelled = false;
    let observer: MutationObserver | null = null;

    loadHljs().then((hljs) => {
      if (cancelled) return;
      highlightAll(document, hljs);

      observer = new MutationObserver((mutations) => {
        for (const m of mutations) {
          m.addedNodes.forEach((n) => {
            if (n.nodeType !== Node.ELEMENT_NODE) return;
            highlightAll(n as ParentNode, hljs);
          });
        }
      });
      observer.observe(document.body, { childList: true, subtree: true });
    });

    return () => {
      cancelled = true;
      observer?.disconnect();
    };
  }, []);

  return null;
}
