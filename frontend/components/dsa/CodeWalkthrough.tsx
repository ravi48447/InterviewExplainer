"use client";

import { Fragment, useEffect, useMemo, useState } from "react";
import { CopyButton } from "@/components/CopyButton";
import {
  isDSALang,
  useDSALang,
  type DSALang,
} from "@/components/dsa/DSALangContext";
import { cn } from "@/lib/utils";

type Annotation = { line: string; explanation: string };
type LineByLine = Record<string, Annotation[]>;

type CodeWalkthroughProps = {
  /** Per-language line-by-line annotations from the problem JSON. */
  lineByLine: LineByLine;
  /** Optional fallback full source when a language has no line-by-line yet. */
  code?: Record<string, string>;
  /** Optional title (e.g. "Walk-through"). Shown in the header. */
  title?: string;
};

const LANG_DISPLAY: Record<string, string> = {
  java: "Java",
  python: "Python",
};

const LANG_COMMENT: Record<string, "//" | "#"> = {
  java: "//",
  python: "#",
  javascript: "//",
};

type HljsResult = { value: string };
type HljsApi = {
  highlight: (code: string, opts: { language: string }) => HljsResult;
};
let hljsPromise: Promise<HljsApi> | null = null;
function loadHljs(): Promise<HljsApi> {
  if (hljsPromise) return hljsPromise;
  hljsPromise = import("highlight.js/lib/common").then(
    (mod) => (mod.default ?? mod) as HljsApi,
  );
  return hljsPromise;
}

/**
 * Word-wrap a long explanation across narrow comment lines so the
 * injected inline comment doesn't run off the right edge on a typical
 * viewport. Greedy.
 */
function wrapExplanation(text: string, maxLen: number): string[] {
  const words = text.split(/\s+/).filter(Boolean);
  const out: string[] = [];
  let cur = "";
  for (const w of words) {
    if (!cur) {
      cur = w;
      continue;
    }
    if ((cur + " " + w).length <= maxLen) {
      cur = cur + " " + w;
    } else {
      out.push(cur);
      cur = w;
    }
  }
  if (cur) out.push(cur);
  return out.length > 0 ? out : [text];
}

type BuiltCode = {
  source: string;
  annotationLineNumbers: Set<number>;
  explainedLineNumbers: Set<number>;
};

/**
 * Walk the authored source line-by-line. For every annotation that
 * trim-matches a line, prepend the explanation as one or more `//` / `#`
 * comment lines whose indentation mirrors the matched source line.
 * Annotations are consumed in order, so if the same source line repeats
 * (e.g. a closing `}`), each annotation binds to a different occurrence.
 */
function buildAnnotatedSource(
  rawSource: string,
  annotations: Annotation[],
  commentPrefix: "//" | "#",
): BuiltCode {
  const srcLines = rawSource.split("\n");
  const pending = annotations.filter(
    (a) => a.explanation && a.explanation.trim().length > 0,
  );
  const out: string[] = [];
  const annotationLineNumbers = new Set<number>();
  const explainedLineNumbers = new Set<number>();
  let outLineNo = 0;

  for (const src of srcLines) {
    const trimmed = src.trim();
    const indent = src.match(/^(\s*)/)?.[1] ?? "";
    const idx = pending.findIndex(
      (a) => a.line.trim() === trimmed && trimmed.length > 0,
    );
    if (idx !== -1) {
      const ann = pending.splice(idx, 1)[0];
      const budget = Math.max(
        40,
        88 - indent.length - commentPrefix.length - 1,
      );
      const wrapped = wrapExplanation(ann.explanation.trim(), budget);
      for (const w of wrapped) {
        out.push(`${indent}${commentPrefix} ${w}`);
        outLineNo += 1;
        annotationLineNumbers.add(outLineNo);
      }
      out.push(src);
      outLineNo += 1;
      explainedLineNumbers.add(outLineNo);
    } else {
      out.push(src);
      outLineNo += 1;
    }
  }

  return {
    source: out.join("\n"),
    annotationLineNumbers,
    explainedLineNumbers,
  };
}

/**
 * "Editor panel" for a single approach's code. Mimics the three-part
 * chrome of a real IDE:
 *
 *   1. **Tab bar** — filename tab + language pill + copy button. Gives
 *      the reader the familiar "this is actual code you can run" feel.
 *   2. **Gutter + code** — line numbers on the left, source on the
 *      right. Annotated lines get a bright yellow highlighter row and
 *      their gutter numbers go bold amber so the eye finds the
 *      teaching content at a glance.
 *   3. **Teaching comments** — authored `lineByLine` annotations are
 *      injected as inline `//` / `#` comment blocks directly above the
 *      line they describe. The comment text renders in a vivid amber
 *      that overrides hljs's muted default comment color so the reader
 *      can't accidentally skim past them.
 *
 * Why we apply the `hljs` class ourselves: we are not using the
 * default `.hljs-theme` wrapper around a raw `<pre>`, so the base text
 * color (identifiers, punctuation) needs to be set explicitly. Without
 * it the tokens get colored by atom-one-dark but the rest of the text
 * inherits the page's slate-800 body color — on a near-black panel
 * that renders as invisible. We set a light slate fallback
 * (`text-slate-100 dark:text-slate-300`) + apply `hljs` at the wrapper so the theme's
 * background/foreground defaults kick in.
 */
export function CodeWalkthrough({
  lineByLine,
  code,
  title = "Solution",
}: CodeWalkthroughProps) {
  const ctx = useDSALang();
  const fallbackLang =
    (Object.keys(lineByLine).find(isDSALang) as DSALang | undefined) ?? "java";
  const active: DSALang = ctx?.lang ?? fallbackLang;

  const rawSource = code?.[active] ?? "";
  const annotations = lineByLine[active] ?? [];
  const commentPrefix = LANG_COMMENT[active] ?? "//";

  const built = useMemo(
    () => buildAnnotatedSource(rawSource, annotations, commentPrefix),
    [rawSource, annotations, commentPrefix],
  );

  const [highlightedHtmlLines, setHighlightedHtmlLines] = useState<
    string[] | null
  >(null);

  useEffect(() => {
    let cancelled = false;
    if (!built.source) {
      setHighlightedHtmlLines(null);
      return;
    }
    loadHljs()
      .then((hljs) => {
        if (cancelled) return;
        try {
          const { value } = hljs.highlight(built.source, { language: active });
          setHighlightedHtmlLines(value.split("\n"));
        } catch {
          setHighlightedHtmlLines(null);
        }
      })
      .catch(() => {
        if (!cancelled) setHighlightedHtmlLines(null);
      });
    return () => {
      cancelled = true;
    };
  }, [built.source, active]);

  const rawLines = built.source.split("\n");
  const gutterWidth = String(rawLines.length).length;
  const annotationCount = annotations.filter(
    (a) => a.explanation && a.explanation.trim().length > 0,
  ).length;
  const fileExt = active === "python" ? "py" : "java";
  // Keep the filename tab generic ("solution.java") LeetCode-style.
  // The approach-specific title renders next to it as italic chrome,
  // so we don't need to embed the approach name in the filename.
  const fileBase = "solution";

  return (
    <div className="rounded-xl overflow-hidden my-3 shadow-xl ring-1 ring-slate-950/5 border border-border">
      {/* Tab bar — filename + lang pill + copy */}
      <div className="flex items-stretch justify-between bg-code-surface border-b border-code-border">
        <div className="flex items-stretch">
          {/* Filename tab */}
          <div className="flex items-center gap-2 px-4 py-2 bg-code text-slate-200 dark:text-slate-300 border-r border-code-border border-t-2 border-t-sky-500">
            <span className="text-[11px] font-mono text-slate-500 dark:text-slate-400">
              {fileBase}.{fileExt}
            </span>
            <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[9.5px] font-black uppercase tracking-wider dark:bg-surface text-sky-300 dark:text-sky-300 border border-border">
              {LANG_DISPLAY[active] ?? active}
            </span>
          </div>
          {/* Title / role hint */}
          <div className="hidden sm:flex items-center px-3 text-[11px] text-slate-500 dark:text-slate-400 italic">
            {title}
          </div>
        </div>
        <div className="flex items-center gap-2 px-3">
          {annotationCount > 0 && (
            <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[9.5px] font-black uppercase tracking-wider bg-amber-400/10 text-amber-300 border border-default/30">
              <span className="h-1.5 w-1.5 rounded-full bg-amber-400" />
              {annotationCount} teaching {annotationCount === 1 ? "note" : "notes"}
            </span>
          )}
          <CopyButton text={rawSource} />
        </div>
      </div>

      {/* Code area — apply `hljs` class so atom-one-dark's `.hljs`
          background + default text color kick in, then pin text-slate-100 dark:text-slate-300
          as a safety floor. */}
      {built.source ? (
        <div className="hljs overflow-x-auto bg-code text-slate-100 dark:text-slate-300">
          <div
            className="grid grid-cols-[auto_1fr] text-[13.5px] leading-[1.7] font-mono min-w-max"
            style={{
              fontFamily:
                'var(--font-geist-mono), ui-monospace, SFMono-Regular, "SF Mono", Menlo, Consolas, monospace',
            }}
          >
            {rawLines.map((plainLine, i) => {
              const lineNo = i + 1;
              const isAnnotation = built.annotationLineNumbers.has(lineNo);
              const isExplained = built.explainedLineNumbers.has(lineNo);
              const html = highlightedHtmlLines?.[i];
              return (
                <Fragment key={i}>
                  <div
                    aria-hidden="true"
                    className={cn(
                      "select-none tabular-nums text-right py-[1px] px-3 border-r",
                      isAnnotation
                        ? "text-amber-300/90 bg-amber-400/10 border-default/40 font-bold"
                        : isExplained
                          ? "text-amber-200 bg-amber-400/20 border-default/60 font-black"
                          : "text-slate-500 border-slate-700/60 bg-code-surface",
                    )}
                    style={{ minWidth: `${gutterWidth + 2}ch` }}
                  >
                    {lineNo}
                  </div>
                  <div
                    className={cn(
                      "py-[1px] px-4 whitespace-pre",
                      isAnnotation && "bg-amber-400/10",
                      isExplained && "bg-amber-400/20",
                    )}
                  >
                    {html != null ? (
                      <span
                        // Injected comment lines: force their (hljs-
                        // tokenised) descendants to a bright amber that
                        // can't be missed. For regular code rows we
                        // let hljs colors win.
                        className={cn(
                          isAnnotation
                            ? "[&_*]:!text-amber-300 text-amber-300 not-italic font-medium"
                            : "text-slate-100",
                        )}
                        dangerouslySetInnerHTML={{
                          __html: html.length > 0 ? html : "&nbsp;",
                        }}
                      />
                    ) : (
                      <span
                        className={cn(
                          isAnnotation
                            ? "text-amber-300 font-medium"
                            : "text-slate-100",
                        )}
                      >
                        {plainLine.length > 0 ? plainLine : "\u00A0"}
                      </span>
                    )}
                  </div>
                </Fragment>
              );
            })}
          </div>
        </div>
      ) : (
        <p className="px-4 py-6 text-[13px] text-slate-500 dark:text-slate-400 italic bg-code">
          Code coming soon for {LANG_DISPLAY[active] ?? active}.
        </p>
      )}

      {/* Footer — status-bar-like strip, tells the reader what the
          yellow rows mean without a second section. */}
      {annotationCount > 0 && built.source && (
        <div className="px-4 py-1.5 bg-code-surface border-t border-code-border text-[11px] text-slate-500 dark:text-slate-400 flex flex-wrap items-center gap-x-4 gap-y-1">
          <span className="inline-flex items-center gap-1.5">
            <span className="inline-block h-2.5 w-4 bg-amber-400 dark:bg-amber-800/30 border border-default dark:border-default/60 rounded-sm" />
            <span>
              Yellow row = the algorithm's core logic. Amber `{commentPrefix}`
              lines above it = what you'd say out loud.
            </span>
          </span>
          <span className="ml-auto text-muted-foreground font-mono text-[10.5px]">
            {rawLines.length} lines
          </span>
        </div>
      )}
    </div>
  );
}
