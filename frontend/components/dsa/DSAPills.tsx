import type { Difficulty, Level } from "@/lib/contentV2-types";

/**
 * Difficulty / level / generic pill colour maps.
 *
 * Token-driven: every fill, text, and border uses a design token. The
 * difficulty colour stays in the *warmth* axis — easy → success (green),
 * medium → amber, hard → rose — so the semantic never drifts, but the
 * borders are now hairline token borders instead of the old broken
 * `border-default` + dark-mode `border-default/20` that never resolved.
 */
export const DIFFICULTY_CLASSES: Record<Difficulty, string> = {
  easy:
    "bg-success/10 text-success border-success/30",
  medium:
    "bg-amber-50 dark:bg-amber-500/10 text-amber-700 dark:text-amber-400 border-amber-200 dark:border-amber-500/30",
  hard:
    "bg-rose-50 dark:bg-rose-500/10 text-rose-700 dark:text-rose-400 border-rose-200 dark:border-rose-500/30",
};

export const LEVEL_CLASSES: Record<Level, string> = {
  beginner:
    "bg-success/10 text-success border-success/30",
  intermediate:
    "bg-amber-50 dark:bg-amber-500/10 text-amber-700 dark:text-amber-400 border-amber-200 dark:border-amber-500/30",
  advanced:
    "bg-rose-50 dark:bg-rose-500/10 text-rose-700 dark:text-rose-400 border-rose-200 dark:border-rose-500/30",
};

/**
 * Small, consistent pill used for labels across DSA pages.
 * Intentionally simple — uppercase, tight tracking, bordered.
 */
export function DSAPill({
  label,
  tone = "slate",
  className = "",
}: {
  label: string;
  tone?:
    | "slate"
    | "violet"
    | "emerald"
    | "amber"
    | "red"
    | "blue"
    | "fuchsia";
  className?: string;
}) {
  const toneClass: Record<string, string> = {
    slate: "bg-surface text-foreground border-border",
    violet:
      "bg-primary/5 text-primary border-primary/30",
    emerald:
      "bg-success/10 text-success border-success/30",
    amber:
      "bg-amber-50 dark:bg-amber-500/10 text-amber-700 dark:text-amber-400 border-amber-200 dark:border-amber-500/30",
    red: "bg-rose-50 dark:bg-rose-500/10 text-rose-700 dark:text-rose-400 border-rose-200 dark:border-rose-500/30",
    blue: "bg-primary/5 text-primary border-primary/30",
    fuchsia:
      "bg-primary/5 text-primary border-primary/30",
  };
  return (
    <span
      className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded border ${toneClass[tone]} ${className}`}
    >
      {label}
    </span>
  );
}

export function DifficultyPill({
  difficulty,
  className = "",
}: {
  difficulty: Difficulty;
  className?: string;
}) {
  return (
    <span
      className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded border ${DIFFICULTY_CLASSES[difficulty]} ${className}`}
    >
      {difficulty}
    </span>
  );
}

export function LevelPill({
  level,
  className = "",
}: {
  level: Level;
  className?: string;
}) {
  return (
    <span
      className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded border ${LEVEL_CLASSES[level]} ${className}`}
    >
      {level}
    </span>
  );
}
