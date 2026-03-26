"use client";

import { FadeInUp, StaggerContainer, StaggerItem } from "@/components/motion-wrapper";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";

const paths = [
  { name: "Core Java", progress: 70, topics: ["OOP 82%", "Collections 75%", "Exceptions 68%"], weak: "Generics", color: "bg-chart-1" },
  { name: "Concurrency", progress: 30, topics: ["Threads 45%", "Sync 22%", "Executors 28%"], weak: "Locks", color: "bg-chart-5" },
  { name: "Spring Boot", progress: 55, topics: ["DI 72%", "REST 65%", "JPA 48%"], weak: "Security", color: "bg-chart-2" },
  { name: "System Design", progress: 42, topics: ["LB 55%", "Caching 48%", "DB 38%"], weak: "Microservices", color: "bg-chart-3" },
  { name: "DSA", progress: 58, topics: ["Arrays 78%", "Trees 52%", "DP 40%"], weak: "DP", color: "bg-chart-4" },
  { name: "SQL & DB", progress: 65, topics: ["Joins 80%", "Index 62%", "Norm 58%"], weak: "Transactions", color: "bg-chart-1" },
];

export function LearningPaths() {
  return (
    <div>
      <FadeInUp>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-semibold text-foreground">Learning Paths</h3>
          <Button variant="ghost" size="sm" className="text-[11px] text-muted-foreground h-7 px-2">
            View all
          </Button>
        </div>
      </FadeInUp>

      <StaggerContainer className="grid gap-2.5 sm:grid-cols-2 lg:grid-cols-3">
        {paths.map((path, i) => (
          <StaggerItem key={i}>
            <motion.div
              whileHover={{ y: -2 }}
              transition={{ duration: 0.15 }}
              className="flex flex-col rounded-xl border border-border/40 bg-card p-4 h-full glow-soft"
            >
              <div className="flex items-center justify-between mb-3">
                <h4 className="text-xs font-semibold text-foreground">{path.name}</h4>
                <span className="text-[11px] font-medium text-foreground tabular-nums">{path.progress}%</span>
              </div>

              <div className="h-1 rounded-full bg-muted/60 overflow-hidden mb-3">
                <motion.div
                  className={`h-full rounded-full ${path.color}`}
                  initial={{ width: 0 }}
                  whileInView={{ width: `${path.progress}%` }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.8, ease: "easeOut" }}
                />
              </div>

              <div className="flex flex-col gap-1.5 flex-1">
                {path.topics.map((topic, ti) => (
                  <span key={ti} className="text-[10px] text-muted-foreground">{topic}</span>
                ))}
              </div>

              <div className="mt-3 pt-2.5 border-t border-border/30 flex items-center justify-between">
                <span className="text-[10px] text-chart-5 font-medium">Weak: {path.weak}</span>
                <Button variant="ghost" size="sm" className="h-6 text-[10px] text-primary hover:text-primary px-1.5">
                  Practice
                </Button>
              </div>
            </motion.div>
          </StaggerItem>
        ))}
      </StaggerContainer>
    </div>
  );
}
