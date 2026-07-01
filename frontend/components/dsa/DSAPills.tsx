import type { Difficulty, Level } from "@/lib/contentV2-types";

export const DIFFICULTY_CLASSES: Record<Difficulty, string> = {
  easy: "bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-200 dark:border-emerald-500/20",
  medium: "bg-amber-50 dark:bg-amber-500/10 text-amber-700 dark:text-amber-400 border-amber-200 dark:border-amber-500/20",
  hard: "bg-red-50 dark:bg-red-500/10 text-red-700 dark:text-red-400 border-red-200 dark:border-red-500/20",
};

export const LEVEL_CLASSES: Record<Level, string> = {
  beginner: "bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-200 dark:border-emerald-500/20",
  intermediate: "bg-amber-50 dark:bg-amber-500/10 text-amber-700 dark:text-amber-400 border-amber-200 dark:border-amber-500/20",
  advanced: "bg-red-50 dark:bg-red-500/10 text-red-700 dark:text-red-400 border-red-200 dark:border-red-500/20",
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
    violet: "bg-violet-50 dark:bg-violet-500/10 text-violet-700 dark:text-violet-400 border-violet-200 dark:border-violet-500/20",
    emerald: "bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-200 dark:border-emerald-500/20",
    amber: "bg-amber-50 dark:bg-amber-500/10 text-amber-700 dark:text-amber-400 border-amber-200 dark:border-amber-500/20",
    red: "bg-red-50 dark:bg-red-500/10 text-red-700 dark:text-red-400 border-red-200 dark:border-red-500/20",
    blue: "bg-blue-50 dark:bg-blue-500/10 text-blue-700 dark:text-blue-400 border-blue-200 dark:border-blue-500/20",
    fuchsia: "bg-fuchsia-50 dark:bg-fuchsia-950/20 text-fuchsia-700 dark:text-fuchsia-400 border-fuchsia-200 dark:border-fuchsia-500/20",
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
