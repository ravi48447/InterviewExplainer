"use client";

import { StaggerContainer, StaggerItem } from "@/components/motion-wrapper";
import { motion } from "framer-motion";
import { BookOpen, Target, Clock, Flame } from "lucide-react";

const stats = [
  { label: "Practiced", value: "210", sub: "/340", icon: BookOpen, color: "text-chart-1", bg: "bg-chart-1/8" },
  { label: "Accuracy", value: "68", sub: "%", icon: Target, color: "text-chart-2", bg: "bg-chart-2/8" },
  { label: "Avg Time", value: "5.2", sub: "min", icon: Clock, color: "text-chart-3", bg: "bg-chart-3/8" },
  { label: "Streak", value: "6", sub: "days", icon: Flame, color: "text-chart-5", bg: "bg-chart-5/8" },
];

export function StatCards() {
  return (
    <StaggerContainer className="grid grid-cols-2 gap-2.5 lg:grid-cols-4">
      {stats.map((stat, i) => (
        <StaggerItem key={i}>
          <motion.div
            whileHover={{ y: -2, scale: 1.01 }}
            transition={{ duration: 0.2 }}
            className="rounded-xl border border-border/40 bg-card p-4 glow-soft"
          >
            <div className="flex items-center justify-between mb-2.5">
              <span className="text-xs text-muted-foreground">{stat.label}</span>
              <div className={`flex h-7 w-7 items-center justify-center rounded-md ${stat.bg}`}>
                <stat.icon className={`h-3.5 w-3.5 ${stat.color}`} />
              </div>
            </div>
            <div className="flex items-baseline gap-0.5">
              <span className="text-xl font-bold text-foreground">{stat.value}</span>
              <span className="text-xs text-muted-foreground">{stat.sub}</span>
            </div>
          </motion.div>
        </StaggerItem>
      ))}
    </StaggerContainer>
  );
}
