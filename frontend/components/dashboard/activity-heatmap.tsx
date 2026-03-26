"use client";

import { FadeInUp } from "@/components/motion-wrapper";
import { motion } from "framer-motion";

function seededRandom(seed: number) {
  let s = seed;
  return () => {
    s = (s * 16807 + 0) % 2147483647;
    return (s - 1) / 2147483646;
  };
}

const HEATMAP_DATA = (() => {
  const rand = seededRandom(42);
  const cells: number[] = [];
  for (let i = 0; i < 70; i++) {
    const r = rand();
    if (r < 0.25) cells.push(0);
    else if (r < 0.5) cells.push(1);
    else if (r < 0.75) cells.push(2);
    else cells.push(3);
  }
  for (let i = cells.length - 6; i < cells.length; i++) {
    cells[i] = Math.max(2, cells[i]);
  }
  return cells;
})();

const levelClasses = ["bg-muted/60", "bg-primary/20", "bg-primary/45", "bg-primary"];

export function ActivityHeatmap() {
  const weeks: number[][] = [];
  for (let i = 0; i < HEATMAP_DATA.length; i += 7) {
    weeks.push(HEATMAP_DATA.slice(i, i + 7));
  }

  return (
    <FadeInUp className="rounded-xl border border-border/40 bg-card p-5 glow-soft">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-sm font-semibold text-foreground">Activity</h3>
          <p className="text-[11px] text-muted-foreground">Last 10 weeks</p>
        </div>
        <div className="flex items-center gap-1 text-[10px] text-muted-foreground">
          <span>Less</span>
          {levelClasses.map((cls, i) => (
            <div key={i} className={`h-2.5 w-2.5 rounded-sm ${cls}`} />
          ))}
          <span>More</span>
        </div>
      </div>

      <div className="flex gap-1">
        {weeks.map((week, wi) => (
          <div key={wi} className="flex flex-col gap-1">
            {week.map((level, di) => (
              <motion.div
                key={`${wi}-${di}`}
                initial={{ opacity: 0, scale: 0 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.15, delay: wi * 0.03 + di * 0.01 }}
                className={`h-2.5 w-2.5 rounded-sm ${levelClasses[level]} transition-colors`}
                title={`Activity level: ${level}`}
              />
            ))}
          </div>
        ))}
      </div>

      <div className="mt-3 flex items-center gap-4 text-[11px] text-muted-foreground">
        <span>
          Current streak:{" "}
          <span className="font-medium text-foreground">6 days</span>
        </span>
        <span>
          Best: <span className="font-medium text-foreground">12 days</span>
        </span>
      </div>
    </FadeInUp>
  );
}
