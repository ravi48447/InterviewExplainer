"use client";

import { FadeInUp } from "@/components/motion-wrapper";
import { motion } from "framer-motion";
import { Clock, CheckCircle2, XCircle } from "lucide-react";

const sessions = [
  { topic: "Core Java", date: "Feb 10", questions: 18, correct: 14, duration: "42m" },
  { topic: "Collections", date: "Feb 09", questions: 12, correct: 9, duration: "38m" },
  { topic: "Spring Boot", date: "Feb 08", questions: 15, correct: 12, duration: "45m" },
];

export function RecentSessions() {
  return (
    <FadeInUp className="rounded-xl border border-border/40 bg-card p-5 glow-soft">
      <h3 className="text-sm font-semibold text-foreground mb-4">Recent Sessions</h3>
      <div className="flex flex-col gap-2">
        {sessions.map((session, i) => (
          <motion.div
            key={i}
            whileHover={{ x: 2 }}
            transition={{ duration: 0.15 }}
            className="flex items-center justify-between rounded-lg bg-muted/30 px-3.5 py-2.5 cursor-pointer hover:bg-muted/50 transition-colors"
          >
            <div className="flex items-center gap-2.5">
              <div className="flex h-7 w-7 items-center justify-center rounded-md bg-primary/8 shrink-0">
                <span className="text-[10px] font-bold text-primary">
                  {session.topic.slice(0, 2).toUpperCase()}
                </span>
              </div>
              <div>
                <p className="text-xs font-medium text-foreground">{session.topic}</p>
                <p className="text-[10px] text-muted-foreground">{session.date}</p>
              </div>
            </div>
            <div className="flex items-center gap-3 text-[11px] text-muted-foreground">
              <span className="hidden sm:flex items-center gap-1">
                <CheckCircle2 className="h-3 w-3 text-chart-4" />
                {session.correct}/{session.questions}
              </span>
              <span className="flex items-center gap-1">
                <Clock className="h-3 w-3" />
                {session.duration}
              </span>
            </div>
          </motion.div>
        ))}
      </div>
    </FadeInUp>
  );
}
