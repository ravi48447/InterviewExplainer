"use client";

import { useDSALang, type DSALang } from "@/components/dsa/DSALangContext";
import { cn } from "@/lib/utils";

const LANG_LABEL: Record<DSALang, string> = {
  java: "Java",
  python: "Python",
};

const LANGS: DSALang[] = ["java", "python"];

/**
 * Sticky-friendly Java | Python segmented control. Reads/writes the
 * `DSALangContext` so every code block + walkthrough on the page reacts
 * instantly, and the choice survives page navigation.
 */
export function DSALangToggle({ className = "" }: { className?: string }) {
  const ctx = useDSALang();

  // Outside the provider this component is meaningless — render nothing
  // rather than a confusing toggle that does nothing.
  if (!ctx) return null;

  return (
    <div
      role="tablist"
      aria-label="Code language"
      className={cn(
        "inline-flex items-center rounded-lg border border-border bg-background p-0.5 shadow-sm",
        className,
      )}
    >
      {LANGS.map((lang) => {
        const active = ctx.lang === lang;
        return (
          <button
            key={lang}
            type="button"
            role="tab"
            aria-selected={active}
            onClick={() => ctx.setLang(lang)}
            className={cn(
              "px-3 py-1 text-[11px] font-bold uppercase tracking-wider rounded-md transition-colors",
              active
                ? "bg-blue-600 dark:bg-blue-800 text-primary-foreground dark:text-foreground shadow-sm"
                : "text-secondary hover:text-foreground hover:bg-surface",
            )}
          >
            {LANG_LABEL[lang]}
          </button>
        );
      })}
    </div>
  );
}
