"use client";

import { FadeInUp } from "@/components/motion-wrapper";
import { motion } from "framer-motion";
import { TrendingUp } from "lucide-react";

const categories = [
  { label: "Core Java", pct: 70, color: "bg-chart-1" },
  { label: "Collections", pct: 45, color: "bg-chart-2" },
  { label: "Concurrency", pct: 30, color: "bg-chart-5" },
  { label: "Spring", pct: 55, color: "bg-chart-4" },
];

export function MasteryProgress() {
  const progress = 62;
  const circumference = 2 * Math.PI * 46;
  const offset = circumference - (progress / 100) * circumference;

  return (
    <FadeInUp className="rounded-xl border border-border/40 bg-card p-5 glow-soft">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-semibold text-foreground">Overall Mastery</h3>
        <span className="inline-flex items-center gap-1 rounded-full bg-chart-4/8 px-2 py-0.5 text-[10px] font-medium text-chart-4">
          <TrendingUp className="h-2.5 w-2.5" />
          +8%
        </span>
      </div>

      <div className="flex items-center gap-6">
        {/* Ring */}
        <div className="relative flex-shrink-0">
          <svg width="104" height="104" viewBox="0 0 104 104">
            <circle cx="52" cy="52" r="46" fill="none" stroke="hsl(var(--border))" strokeWidth="6" />
            <motion.circle
              cx="52" cy="52" r="46" fill="none"
              stroke="hsl(var(--primary))" strokeWidth="6" strokeLinecap="round"
              strokeDasharray={circumference}
              initial={{ strokeDashoffset: circumference }}
              whileInView={{ strokeDashoffset: offset }}
              viewport={{ once: true }}
              transition={{ duration: 1.2, ease: "easeOut" }}
              transform="rotate(-90 52 52)"
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-lg font-bold text-foreground">{progress}%</span>
            <span className="text-[10px] text-muted-foreground">mastery</span>
          </div>
        </div>

        {/* Category bars */}
        <div className="flex-1 flex flex-col gap-2.5">
          {categories.map((cat) => (
            <div key={cat.label}>
              <div className="flex items-center justify-between text-[11px] mb-1">
                <span className="text-muted-foreground">{cat.label}</span>
                <span className="font-medium text-foreground tabular-nums">{cat.pct}%</span>
              </div>
              <div className="h-1.5 rounded-full bg-muted/60 overflow-hidden">
                <motion.div
                  className={`h-full rounded-full ${cat.color}`}
                  initial={{ width: 0 }}
                  whileInView={{ width: `${cat.pct}%` }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.8, ease: "easeOut" }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </FadeInUp>
  );
}
