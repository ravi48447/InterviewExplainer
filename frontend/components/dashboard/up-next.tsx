"use client";

import { FadeInUp } from "@/components/motion-wrapper";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowRight, Clock, Zap, Shield, Server } from "lucide-react";

const recommendations = [
  { title: "Strengthen Concurrency", desc: "Low accuracy in synchronization", duration: "45m", icon: Zap, color: "text-chart-5", bg: "bg-chart-5/8" },
  { title: "Practice DP Patterns", desc: "40% mastery - key for interviews", duration: "60m", icon: Server, color: "text-chart-1", bg: "bg-chart-1/8" },
  { title: "Review Spring Security", desc: "Weakest area in Spring domain", duration: "30m", icon: Shield, color: "text-chart-2", bg: "bg-chart-2/8" },
];

export function UpNext() {
  return (
    <FadeInUp className="rounded-xl border border-border/40 bg-card p-5 glow-soft">
      <h3 className="text-sm font-semibold text-foreground mb-4">Recommended Next</h3>
      <div className="flex flex-col gap-2.5">
        {recommendations.map((rec, i) => (
          <motion.div
            key={i}
            whileHover={{ y: -1 }}
            transition={{ duration: 0.15 }}
            className="flex items-center justify-between rounded-lg border border-border/30 p-3.5 hover:border-primary/15 transition-all"
          >
            <div className="flex items-center gap-3">
              <div className={`flex h-8 w-8 items-center justify-center rounded-lg ${rec.bg} shrink-0`}>
                <rec.icon className={`h-3.5 w-3.5 ${rec.color}`} />
              </div>
              <div>
                <p className="text-xs font-medium text-foreground">{rec.title}</p>
                <p className="text-[10px] text-muted-foreground">{rec.desc}</p>
              </div>
            </div>
            <div className="flex items-center gap-2.5 shrink-0 ml-2">
              <span className="hidden sm:flex items-center gap-1 text-[10px] text-muted-foreground">
                <Clock className="h-2.5 w-2.5" />
                {rec.duration}
              </span>
              <Button size="sm" variant="ghost" className="h-7 gap-1 text-[11px] font-medium text-primary hover:text-primary px-2">
                Start <ArrowRight className="h-2.5 w-2.5" />
              </Button>
            </div>
          </motion.div>
        ))}
      </div>
    </FadeInUp>
  );
}
