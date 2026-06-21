import type { Difficulty, Level } from "@/lib/contentV2-types";

export const DIFFICULTY_CLASSES: Record<Difficulty, string> = {
  easy: "bg-emerald-50 text-emerald-700 border-emerald-200",
  medium: "bg-amber-50 text-amber-700 border-amber-200",
  hard: "bg-red-50 text-red-700 border-red-200",
};

export const LEVEL_CLASSES: Record<Level, string> = {
  beginner: "bg-emerald-50 text-emerald-700 border-emerald-200",
  intermediate: "bg-amber-50 text-amber-700 border-amber-200",
  advanced: "bg-red-50 text-red-700 border-red-200",
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
    slate: "bg-slate-50 text-slate-700 border-slate-200",
    violet: "bg-violet-50 text-violet-700 border-violet-200",
    emerald: "bg-emerald-50 text-emerald-700 border-emerald-200",
    amber: "bg-amber-50 text-amber-700 border-amber-200",
    red: "bg-red-50 text-red-700 border-red-200",
    blue: "bg-blue-50 text-blue-700 border-blue-200",
    fuchsia: "bg-fuchsia-50 text-fuchsia-700 border-fuchsia-200",
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
