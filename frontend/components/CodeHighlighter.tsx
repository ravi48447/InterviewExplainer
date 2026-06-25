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
    const pre = el.parentElement;
    if (!pre) return;

    // 1. Run highlight.js
    try {
      hljs.highlightElement(el);
    } catch {
      // fallback
    }
    el.setAttribute(DONE_ATTR, "1");

    // 2. Wrap and build interface
    const container = document.createElement("div");
    container.className = "relative border border-border rounded-xl bg-card my-6 overflow-hidden group shadow-sm transition-all";
    
    // Get language name
    let lang = "Code";
    const classes = Array.from(el.classList);
    const langClass = classes.find(c => c.startsWith("language-"));
    if (langClass) {
      lang = langClass.replace("language-", "").toUpperCase();
    }

    // Capture code text for copying
    const rawCode = el.textContent || "";

    // Create top bar
    const topBar = document.createElement("div");
    topBar.className = "flex items-center justify-between px-4 py-2 border-b border-border/40 bg-surface/50 text-xs text-muted-foreground font-semibold select-none";
    topBar.innerHTML = `
      <span class="font-mono text-[10px] tracking-wider text-primary bg-primary/10 px-2 py-0.5 rounded">${lang}</span>
      <div class="flex items-center gap-3">
        <button class="wrap-toggle-btn hover:text-foreground transition-colors" title="Toggle word wrap">
          Wrap
        </button>
        <button class="copy-btn flex items-center gap-1 hover:text-foreground transition-colors" title="Copy to clipboard">
          Copy
        </button>
      </div>
    `;

    // Process line numbers
    const lines = el.innerHTML.split("\n");
    // If the last line is empty (common in hljs output), drop it
    if (lines.length > 1 && lines[lines.length - 1].trim() === "") {
      lines.pop();
    }

    const linesContainer = document.createElement("div");
    linesContainer.className = "py-3 font-mono text-[13px] leading-[1.65] overflow-x-auto whitespace-pre";
    
    lines.forEach((lineHtml, idx) => {
      const lineRow = document.createElement("div");
      lineRow.className = "flex hover:bg-hover/20 px-4 transition-colors line-row";
      
      const lineNum = document.createElement("span");
      lineNum.className = "inline-block w-8 text-right pr-4 select-none text-muted-foreground/30 font-mono text-xs border-r border-border/20 mr-4";
      lineNum.textContent = String(idx + 1);
      
      const lineContent = document.createElement("span");
      lineContent.className = "flex-1 whitespace-pre-wrap break-all";
      lineContent.innerHTML = lineHtml || " "; // non-empty spacer

      lineRow.appendChild(lineNum);
      lineRow.appendChild(lineContent);
      linesContainer.appendChild(lineRow);
    });

    // Replace original contents
    el.innerHTML = "";
    el.appendChild(linesContainer);
    
    // Style pre and code classes
    pre.className = "p-0 m-0 bg-transparent border-none overflow-visible max-w-full";
    el.className = "hljs p-0 m-0 bg-transparent block overflow-visible";

    // Setup wrap toggle
    const wrapBtn = topBar.querySelector(".wrap-toggle-btn") as HTMLButtonElement;
    let isWrapped = true;
    const toggleWrap = () => {
      isWrapped = !isWrapped;
      if (isWrapped) {
        linesContainer.classList.remove("whitespace-pre-wrap");
        linesContainer.classList.add("whitespace-pre");
        wrapBtn.textContent = "Wrap";
        wrapBtn.classList.remove("text-primary");
      } else {
        linesContainer.classList.remove("whitespace-pre");
        linesContainer.classList.add("whitespace-pre-wrap");
        wrapBtn.textContent = "Unwrap";
        wrapBtn.classList.add("text-primary");
      }
    };
    wrapBtn.addEventListener("click", toggleWrap);

    // Setup copy btn
    const copyBtn = topBar.querySelector(".copy-btn") as HTMLButtonElement;
    copyBtn.addEventListener("click", () => {
      navigator.clipboard.writeText(rawCode).then(() => {
        copyBtn.textContent = "Copied!";
        copyBtn.classList.add("text-success");
        setTimeout(() => {
          copyBtn.textContent = "Copy";
          copyBtn.classList.remove("text-success");
        }, 2000);
      });
    });

    // Wrap elements
    pre.parentNode?.insertBefore(container, pre);
    container.appendChild(topBar);
    container.appendChild(pre);

    // Collapsible logic for long blocks (>25 lines)
    if (lines.length > 25) {
      container.classList.add("max-h-[380px]", "pb-12");
      linesContainer.classList.add("max-h-[320px]", "overflow-hidden");

      const fadeOverlay = document.createElement("div");
      fadeOverlay.className = "absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-card to-transparent pointer-events-none z-10 transition-opacity duration-300";

      const showMoreBtn = document.createElement("button");
      showMoreBtn.className = "absolute bottom-3 left-1/2 -translate-x-1/2 px-4 py-1.5 bg-primary text-primary-foreground rounded-full text-xs font-semibold shadow-md hover:scale-105 transition-all z-20";
      showMoreBtn.textContent = "Show More";

      showMoreBtn.addEventListener("click", () => {
        container.classList.remove("max-h-[380px]", "pb-12");
        linesContainer.classList.remove("max-h-[320px]", "overflow-hidden");
        fadeOverlay.remove();
        showMoreBtn.remove();
      });

      container.appendChild(fadeOverlay);
      container.appendChild(showMoreBtn);
    }
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
