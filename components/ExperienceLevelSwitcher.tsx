"use client";

/**
 * ExperienceLevelSwitcher
 *
 * Used ONLY in:
 *   - Signup flow (onboarding step "What's your experience?")
 *   - Profile page (to change later)
 *   - Dashboard settings
 *
 * NOT used on question pages, stack pages, or any content reading experience.
 * Level is an account setting — set once, applies globally across all content.
 *
 * Architecture:
 *   - Unauthenticated users always see intermediate content (SEO default)
 *   - Logged-in users are redirected to their saved level's URL
 *   - To change level: Profile → Experience Level
 */

import { useState } from "react";
import { EXPERIENCE_LEVELS, LEVEL_KEYS, type ExperienceLevelKey, saveLevel } from "@/lib/levels";
import { CheckCircle } from "lucide-react";

interface Props {
  currentLevel?: ExperienceLevelKey;
  onSave?: (level: ExperienceLevelKey) => void;
  /** "cards" = large onboarding cards (signup), "pills" = compact row (profile) */
  variant?: "cards" | "pills";
}

const LEVEL_DETAILS: Record<ExperienceLevelKey, { bullets: string[]; example: string }> = {
  beginner: {
    bullets: [
      "Foundation concepts — what and why",
      "Simple code examples with full explanation",
      "No production jargon — plain English answers",
    ],
    example: "\"What is a Spring Bean?\" → What it is, why it exists, simple config example.",
  },
  intermediate: {
    bullets: [
      "Production patterns and trade-offs",
      "Real framework usage with context",
      "The answer a 2–5 yr engineer gives in an interview",
    ],
    example: "\"What is a Spring Bean?\" → Singleton scope, lifecycle, when to use @Component vs @Bean.",
  },
};

export default function ExperienceLevelSwitcher({
  currentLevel = "intermediate",
  onSave,
  variant = "cards",
}: Props) {
  const [selected, setSelected] = useState<ExperienceLevelKey>(currentLevel);
  const [saved, setSaved] = useState(false);

  function handleSave() {
    saveLevel(selected);
    setSaved(true);
    onSave?.(selected);
    setTimeout(() => setSaved(false), 2000);
  }

  if (variant === "pills") {
    return (
      <div className="space-y-3">
        <div className="flex rounded-xl border border-border bg-surface p-1 w-fit">
          {LEVEL_KEYS.map(level => {
            const meta = EXPERIENCE_LEVELS[level];
            const isActive = selected === level;
            return (
              <button
                key={level}
                onClick={() => setSelected(level)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold transition-all ${
                  isActive
                    ? `${meta.colorClass} shadow-sm border`
                    : "text-muted-foreground hover:text-foreground hover:bg-background"
                }`}
              >
                {meta.label}
                <span className="text-xs font-normal opacity-70">{meta.range}</span>
              </button>
            );
          })}
        </div>

        {selected !== currentLevel && (
          <button
            onClick={handleSave}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 dark:bg-blue-800 text-white rounded-lg text-sm font-bold hover:bg-blue-700 dark:bg-blue-800 transition-colors"
          >
            {saved ? <><CheckCircle className="h-4 w-4" /> Saved!</> : "Save Preference"}
          </button>
        )}

        <p className="text-xs text-muted-foreground">
          This applies to your entire session. All question pages will serve{" "}
          <strong>{EXPERIENCE_LEVELS[selected].label}</strong> answers.
        </p>
      </div>
    );
  }

  // Cards variant — for signup/onboarding
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {LEVEL_KEYS.map(level => {
          const meta = EXPERIENCE_LEVELS[level];
          const details = LEVEL_DETAILS[level];
          const isSelected = selected === level;

          return (
            <button
              key={level}
              onClick={() => setSelected(level)}
              className={`group text-left rounded-2xl border-2 p-6 transition-all ${
                isSelected
                  ? `${meta.colorClass} border-current shadow-lg scale-[1.02]`
                  : "border-border bg-background hover:border-border hover:shadow-md"
              }`}
            >
              <div className="flex items-center justify-between mb-3">
                <div>
                  <div className="text-lg font-black text-foreground">{meta.label}</div>
                  <div className="text-xs font-semibold text-muted-foreground">{meta.range}</div>
                </div>
                <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${
                  isSelected ? "border-current bg-current" : "border-border"
                }`}>
                  {isSelected && <div className="w-2 h-2 rounded-full bg-background" />}
                </div>
              </div>

              <ul className="space-y-1.5 mb-4">
                {details.bullets.map((b, i) => (
                  <li key={i} className="flex items-start gap-2 text-xs text-foreground">
                    <span className="mt-0.5 shrink-0 text-muted-foreground">→</span>
                    {b}
                  </li>
                ))}
              </ul>

              <div className="rounded-lg bg-foreground /5 p-3">
                <div className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-1">Example</div>
                <p className="text-xs text-foreground leading-relaxed">{details.example}</p>
              </div>
            </button>
          );
        })}
      </div>

      <div className="flex items-center gap-4 pt-2">
        <button
          onClick={handleSave}
          disabled={saved}
          className={`flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-bold transition-all ${
            saved
              ? "bg-emerald-100 dark:bg-emerald-950/20 text-emerald-700 dark:text-emerald-400 border border-default dark:border-default/20"
              : "bg-blue-600 dark:bg-blue-800 text-white hover:bg-blue-700 dark:bg-blue-800 shadow-md hover:shadow-lg"
          }`}
        >
          {saved ? <><CheckCircle className="h-4 w-4" /> Saved!</> : "Save My Level"}
        </button>
        <p className="text-xs text-muted-foreground">
          You can always change this in <strong>Profile → Experience Level</strong>.
        </p>
      </div>
    </div>
  );
}
