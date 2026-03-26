"use client";

import { FadeInUp } from "@/components/motion-wrapper";
import { motion } from "framer-motion";
import { AlertTriangle } from "lucide-react";

const weakAreas = [
  { topic: "Java Memory Model", accuracy: 28, severity: "high" },
  { topic: "Thread Synchronization", accuracy: 35, severity: "medium" },
  { topic: "Exception Handling", accuracy: 42, severity: "medium" },
];

export function WeakSpots() {
  return (
    <FadeInUp className="rounded-xl border border-border/40 bg-card p-5 glow-soft">
      <div className="flex items-center gap-2 mb-4">
        <AlertTriangle className="h-3.5 w-3.5 text-chart-5" />
        <h3 className="text-sm font-semibold text-foreground">Weak Areas</h3>
      </div>
      <div className="flex flex-col gap-2.5">
        {weakAreas.map((area, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, x: -8 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.3, delay: i * 0.08 }}
            className="flex items-center justify-between rounded-lg bg-muted/30 px-3.5 py-2.5"
          >
            <div className="flex items-center gap-2.5">
              <div
                className={`h-1.5 w-1.5 rounded-full ${
                  area.severity === "high" ? "bg-destructive" : "bg-chart-5"
                }`}
              />
              <span className="text-xs text-foreground font-medium">{area.topic}</span>
            </div>
            <span className="text-[11px] text-muted-foreground tabular-nums">
              {area.accuracy}% acc
            </span>
          </motion.div>
        ))}
      </div>
    </FadeInUp>
  );
}
