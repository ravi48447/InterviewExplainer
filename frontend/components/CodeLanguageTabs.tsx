"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { CopyButton } from "@/components/CopyButton";
import { isDSALang, useDSALang } from "@/components/dsa/DSALangContext";
import { cn } from "@/lib/utils";

interface CodeLanguageTabsProps {
  /** Map of language → source. Tab order = Object.keys order. */
  code: Record<string, string>;
  /** Optional per-language label override (e.g. "Two Sum — one-pass"). */
  labels?: Record<string, string>;
  /** Title shown above the tab row (e.g. section/step name). */
  title?: string;
  /**
   * When `true`, the tab strip syncs with the DSA language context
   * (Java/Python). Languages outside that set are stripped (e.g. JS won't
   * leak into a problem page even if the JSON ships it). The local tab
   * controls are hidden — the page-level <DSALangToggle /> drives the pick.
   *
   * Auto-detected: if a DSA provider is present we behave this way unless
   * the caller explicitly opts out.
   */
  bindToDSALang?: boolean;
}

const LANG_DISPLAY: Record<string, string> = {
  java: "Java",
  python: "Python",
  javascript: "JavaScript",
  typescript: "TypeScript",
  js: "JavaScript",
  ts: "TypeScript",
  go: "Go",
  ruby: "Ruby",
  cpp: "C++",
  c: "C",
  csharp: "C#",
  kotlin: "Kotlin",
  swift: "Swift",
  rust: "Rust",
  sql: "SQL",
  bash: "Bash",
  shell: "Shell",
  sh: "Shell",
  yaml: "YAML",
  yml: "YAML",
  json: "JSON",
  xml: "XML",
  html: "HTML",
  css: "CSS",
  pseudocode: "Pseudocode",
  plaintext: "Text",
  text: "Text",
};

function displayName(lang: string): string {
  return LANG_DISPLAY[lang.toLowerCase()] ?? lang;
}

// Module-level singleton — load hljs once per tab and reuse for every code
// block on the page. Avoids the situation where each <CodeLanguageTabs>
// instance fires its own dynamic import.
type HljsApi = {
  highlightElement: (el: HTMLElement) => void;
  getLanguage?: (name: string) => unknown;
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
 * Language-switchable code block.
 *
 * Two reasons we self-highlight inside this component instead of leaning on
 * the page-level <CodeHighlighter>:
 *
 *   1. When the user switches tabs we replace `<code>` content via React's
 *      `key` prop (forces a fresh DOM node). The shared CodeHighlighter
 *      uses a `data-highlighted` guard so it would skip the replaced node.
 *      Re-running highlightElement here on every active change paints the
 *      new language reliably.
 *
 *   2. The shared CodeHighlighter relies on a MutationObserver. In dev
 *      with Turbopack the observer occasionally fires before children are
 *      attached, leaving the very first paint un-highlighted ("dead white
 *      on black"). Doing it locally with useEffect guarantees the colour
 *      pass runs after the <code> is in the DOM.
 */
export default function CodeLanguageTabs({
  code,
  labels,
  title,
  bindToDSALang,
}: CodeLanguageTabsProps) {
  const dsaCtx = useDSALang();
  // Default behaviour: if we're inside a DSA provider, sync. Callers can
  // explicitly opt out by passing bindToDSALang={false}.
  const useDSA = bindToDSALang ?? !!dsaCtx;

  // When bound to DSA, we filter the language map down to the ones the DSA
  // section officially supports. Anything else (e.g. javascript) is ignored
  // even if shipped in the JSON — keeps the page consistent with the
  // Java + Python promise on the hub.
  const languages = useMemo(() => {
    const all = Object.keys(code);
    if (!useDSA) return all;
    const filtered = all.filter((l) => isDSALang(l));
    // Defensive: preserve at least one language so the block never blanks.
    return filtered.length > 0 ? filtered : all;
  }, [code, useDSA]);

  // Pick initial language: the DSA-context choice if available, otherwise
  // first key. Subsequent renders track the context when bound.
  const initial =
    useDSA && dsaCtx && languages.includes(dsaCtx.lang)
      ? dsaCtx.lang
      : (languages[0] ?? "");
  const [localActive, setLocalActive] = useState(initial);

  const active =
    useDSA && dsaCtx && languages.includes(dsaCtx.lang)
      ? dsaCtx.lang
      : localActive;

  const codeRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const el = codeRef.current;
    if (!el) return;
    let cancelled = false;
    loadHljs().then((hljs) => {
      if (cancelled || !codeRef.current) return;
      // Strip the previous highlight pass (if any) so the new language gets
      // re-tokenized from the raw text instead of being treated as
      // already-highlighted markup.
      el.removeAttribute("data-highlighted");
      try {
        hljs.highlightElement(el);
      } catch {
        // hljs throws on unknown languages; degrade silently.
      }
    });
    return () => {
      cancelled = true;
    };
  }, [active]);

  if (languages.length === 0) return null;

  const handleSelect = (lang: string) => {
    setLocalActive(lang);
    if (useDSA && dsaCtx && isDSALang(lang)) {
      dsaCtx.setLang(lang);
    }
  };

  const activeSrc = code[active] ?? "";
  const activeLabel = labels?.[active];

  // `key={active}` forces React to mount a fresh <code> element when the
  // tab changes. Combined with the useEffect above this gives hljs a clean
  // node every time and keeps the SSR/client trees in sync.
  const renderedCode = (
    <pre className="m-0 overflow-x-auto bg-[#1f2330]">
      <code
        key={active}
        ref={codeRef}
        className={cn(
          "hljs",
          `language-${active || "plaintext"}`,
          "block px-4 py-4 text-[12.5px] leading-relaxed font-mono whitespace-pre",
        )}
      >
        {activeSrc}
      </code>
    </pre>
  );

  // When bound to DSA we render a compact, header-less code block — the
  // page-level <DSALangToggle /> is the single source of truth, no need
  // for a per-block tab strip duplicating the same Java | Python choice.
  if (useDSA) {
    return (
      <div className="rounded-lg border border-border/70 overflow-hidden my-3 bg-[#1f2330]">
        <div className="flex items-center justify-between gap-3 px-4 py-1.5 dark:bg-surface border-b border-border">
          <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
            {displayName(active)}
            {(activeLabel || title) && (
              <span className="text-muted-foreground font-medium normal-case tracking-normal ml-2">
                · {activeLabel ?? title}
              </span>
            )}
          </span>
          <CopyButton text={activeSrc} />
        </div>
        {renderedCode}
      </div>
    );
  }

  if (languages.length === 1) {
    const lang = languages[0];
    return (
      <div className="rounded-lg border border-border/70 overflow-hidden my-3 bg-[#1f2330]">
        <div className="flex items-center justify-between gap-3 px-4 py-2 dark:bg-surface text-xs border-b border-border">
          <div className="flex items-center gap-2 min-w-0">
            <span className="text-muted-foreground font-bold uppercase tracking-wider text-[11px] shrink-0">
              {displayName(lang)}
            </span>
            {(labels?.[lang] || title) && (
              <span className="text-muted-foreground font-medium truncate text-[11px]">
                {labels?.[lang] ?? title}
              </span>
            )}
          </div>
          <CopyButton text={code[lang]} />
        </div>
        {renderedCode}
      </div>
    );
  }

  return (
    <div className="rounded-lg border border-border/70 overflow-hidden my-3 bg-[#1f2330]">
      <div className="flex items-stretch dark:bg-surface border-b border-border">
        <div className="flex items-center gap-0 flex-1 overflow-x-auto">
          {languages.map((lang) => (
            <button
              key={lang}
              onClick={() => handleSelect(lang)}
              className={cn(
                "px-4 py-2.5 text-[11px] font-bold uppercase tracking-wider transition-colors whitespace-nowrap border-b-2",
                active === lang
                  ? "text-white border-default dark:border-default bg-slate-700/80"
                  : "text-muted-foreground border-transparent hover:text-muted-foreground hover:dark:bg-surface/50",
              )}
              aria-pressed={active === lang}
              aria-label={`Show ${displayName(lang)} code`}
            >
              {displayName(lang)}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-3 px-3 shrink-0">
          {(activeLabel || title) && (
            <span className="hidden sm:inline text-[11px] text-muted-foreground font-medium truncate max-w-[260px]">
              {activeLabel ?? title}
            </span>
          )}
          <CopyButton text={activeSrc} />
        </div>
      </div>
      {renderedCode}
    </div>
  );
}
