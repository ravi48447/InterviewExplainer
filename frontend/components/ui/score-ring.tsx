/**
 * score-ring.tsx — Circular score gauge primitive.
 *
 * A self-contained SVG ring that visualises a 0–100 score. This is the
 * canonical replacement for the flat `<p className="type-display text-4xl">`
 * number blocks that every scoring surface (resume analysis, job match,
 * mock-interview results) used to render. The ring gives an immediate,
 * glanceable signal of where a score sits on its scale without requiring
 * the reader to parse a numeral out of context.
 *
 * Design notes:
 *  - Size and stroke are token-driven (no arbitrary px math at call sites).
 *  - The arc colour follows the score band via `--difficulty-*`-style
 *    semantic tokens so it reads correctly in light + dark.
 *  - Reduced-motion users get a static arc (no draw animation).
 *  - The number inside is exposed to assistive tech via aria-label; the
 *    ring itself is decorative (aria-hidden) so SR users hear "score 82
 *    out of 100" once, not twice.
 */

import * as React from "react";
import { cn } from "@/lib/utils";

export interface ScoreRingProps {
  /** Score to render, 0–100. Values outside the range are clamped. */
  value: number;
  /** Optional suffix appended to the central label (e.g. "%"). */
  suffix?: string;
  /** Optional short label rendered under the number (e.g. "Overall"). */
  label?: string;
  /** Diameter in pixels. Defaults to 120. */
  size?: number;
  /** Stroke width as a fraction of the radius. Defaults to 8. */
  stroke?: number;
  /** Override the automatic band colour with a fixed semantic class. */
  colorClassName?: string;
  /** Accessible description used for the aria-label. */
  ariaLabel?: string;
  className?: string;
}

function bandClassFor(score: number): string {
  if (score >= 75) return "text-success";
  if (score >= 50) return "text-warning";
  return "text-destructive";
}

export function ScoreRing({
  value,
  suffix,
  label,
  size = 120,
  stroke = 8,
  colorClassName,
  ariaLabel,
  className,
}: ScoreRingProps) {
  const clamped = Math.max(0, Math.min(100, Math.round(value)));
  const radius = (size - stroke) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (clamped / 100) * circumference;
  const color = colorClassName ?? bandClassFor(clamped);
  const desc = ariaLabel ?? `Score ${clamped} out of 100`;

  return (
    <div
      className={cn("inline-flex flex-col items-center justify-center", className)}
      role="img"
      aria-label={desc}
    >
      <div className="relative" style={{ width: size, height: size }}>
        <svg
          width={size}
          height={size}
          viewBox={`0 0 ${size} ${size}`}
          className="-rotate-90"
          aria-hidden="true"
        >
          {/* Track */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            strokeWidth={stroke}
            className="stroke-border"
          />
          {/* Value arc */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            strokeWidth={stroke}
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            className={cn(color, "transition-[stroke-dashoffset] duration-700 ease-out motion-reduce:transition-none")}
            style={{ stroke: "currentColor" }}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className={cn("type-display leading-none tabular-nums", color)}>
            {clamped}
            {suffix}
          </span>
          {label && (
            <span className="type-label mt-1 text-muted-foreground">{label}</span>
          )}
        </div>
      </div>
    </div>
  );
}
