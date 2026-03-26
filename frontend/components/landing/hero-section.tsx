"use client";

import { Button } from "@/components/ui/button";
import { FadeInUp } from "@/components/motion-wrapper";
import { ArrowRight, Sparkles } from "lucide-react";
import { motion } from "framer-motion";

function MacCodeWindow() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30, rotateX: 8 }}
      whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8, delay: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
      className="perspective-1000"
    >
      <div className="rounded-xl glow-soft overflow-hidden bg-card">
        {/* Mac titlebar */}
        <div className="flex items-center gap-2 border-b border-border/50 bg-muted/40 px-4 py-3">
          <div className="flex gap-1.5">
            <div className="h-3 w-3 rounded-full bg-[#ff5f57]" />
            <div className="h-3 w-3 rounded-full bg-[#febc2e]" />
            <div className="h-3 w-3 rounded-full bg-[#28c840]" />
          </div>
          <span className="mx-auto text-xs text-muted-foreground font-mono">
            interview-prep.java
          </span>
        </div>
        {/* Code content */}
        <div className="p-5 font-mono text-[13px] leading-6 overflow-hidden">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.6 }}
          >
            <div className="text-muted-foreground/60">
              {'// Q: Explain the difference between HashMap and ConcurrentHashMap'}
            </div>
            <div className="mt-3">
              <span className="text-chart-3">public class</span>{" "}
              <span className="text-chart-4">MapComparison</span>{" "}
              <span className="text-muted-foreground">{"{"}</span>
            </div>
            <div className="ml-4">
              <span className="text-chart-3">static</span>{" "}
              <span className="text-chart-5">Map</span>
              <span className="text-muted-foreground/70">{"<String, Integer>"}</span>{" "}
              <span className="text-foreground">cache</span>{" "}
              <span className="text-muted-foreground">{"="}</span>
            </div>
            <div className="ml-8">
              <span className="text-chart-3">new</span>{" "}
              <span className="text-chart-4">ConcurrentHashMap</span>
              <span className="text-muted-foreground/70">{"<>"}</span>
              <span className="text-muted-foreground">{"();"}</span>
            </div>
            <div className="mt-2 ml-4">
              <span className="text-muted-foreground/60">
                {'// Thread-safe without external sync'}
              </span>
            </div>
            <div className="ml-4">
              <span className="text-chart-3">public void</span>{" "}
              <span className="text-chart-2">updateCache</span>
              <span className="text-muted-foreground">{"("}</span>
              <span className="text-chart-5">String</span>{" "}
              <span className="text-foreground">key</span>
              <span className="text-muted-foreground">{") {"}</span>
            </div>
            <div className="ml-8">
              <span className="text-foreground">cache</span>
              <span className="text-muted-foreground">.</span>
              <span className="text-chart-2">computeIfAbsent</span>
              <span className="text-muted-foreground">{"("}</span>
              <span className="text-foreground">key</span>
              <span className="text-muted-foreground">,</span>{" "}
              <span className="text-foreground">k</span>{" "}
              <span className="text-chart-3">{"->"}</span>{" "}
              <span className="text-chart-5">0</span>
              <span className="text-muted-foreground">{");"}</span>
            </div>
            <div className="ml-4 text-muted-foreground">{"}"}</div>
            <div className="text-muted-foreground">{"}"}</div>
          </motion.div>
        </div>
        {/* Answer hint strip */}
        <div className="flex items-center gap-2 border-t border-border/50 bg-accent/30 px-4 py-2.5">
          <div className="h-1.5 w-1.5 rounded-full bg-chart-4 animate-pulse-soft" />
          <span className="text-xs text-accent-foreground font-medium">
            Mastery: Segment-level locking vs full-table sync
          </span>
        </div>
      </div>
    </motion.div>
  );
}

function FloatingStatCard({
  label,
  value,
  className,
  delay,
}: {
  label: string;
  value: string;
  className: string;
  delay: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay, ease: "easeOut" }}
      className={className}
    >
      <motion.div
        animate={{ y: [-3, 3, -3] }}
        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
        className="rounded-lg glass-strong px-3.5 py-2.5 glow-soft"
      >
        <p className="text-xs text-muted-foreground">{label}</p>
        <p className="text-sm font-semibold text-foreground">{value}</p>
      </motion.div>
    </motion.div>
  );
}

export function HeroSection() {
  const scrollToDomains = () => {
    document.getElementById("domain-discovery")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section className="relative overflow-hidden px-4 py-16 sm:py-24 lg:py-28 lg:px-6">
      {/* Subtle gradient orbs */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute right-[15%] top-[10%] h-64 w-64 rounded-full bg-primary/[0.04] blur-[80px]" />
        <div className="absolute left-[10%] bottom-[15%] h-48 w-48 rounded-full bg-chart-2/[0.04] blur-[60px]" />
      </div>

      <div className="relative mx-auto max-w-6xl">
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
          {/* Left content */}
          <div className="max-w-xl">
            <FadeInUp>
              <div className="mb-5 inline-flex items-center gap-2 rounded-full glass px-3.5 py-1.5 text-xs font-medium text-muted-foreground">
                <Sparkles className="h-3 w-3 text-primary" />
                Structured interview preparation
              </div>
            </FadeInUp>

            <FadeInUp delay={0.08}>
              <h1 className="text-3xl font-bold leading-[1.15] tracking-tight text-foreground sm:text-4xl lg:text-[44px] text-balance">
                Prepare smarter.{" "}
                <span className="text-primary">Perform better</span> in interviews.
              </h1>
            </FadeInUp>

            <FadeInUp delay={0.16}>
              <p className="mt-5 text-base leading-relaxed text-muted-foreground text-pretty lg:text-lg">
                Structured interview prep with real questions, mastery tracking, and guided practice across multiple domains.
              </p>
            </FadeInUp>

            <FadeInUp delay={0.24}>
              <div className="mt-7 flex items-center gap-3">
                <Button
                  size="lg"
                  className="h-11 gap-2 rounded-xl px-7 text-sm font-medium shadow-lg shadow-primary/15 transition-all hover:shadow-xl hover:shadow-primary/25"
                >
                  Start Guided Prep
                  <ArrowRight className="h-3.5 w-3.5" />
                </Button>
                <Button
                  variant="ghost"
                  size="lg"
                  onClick={scrollToDomains}
                  className="h-11 rounded-xl px-6 text-sm font-medium text-muted-foreground"
                >
                  Browse Questions
                </Button>
              </div>
            </FadeInUp>

            {/* Trust indicators */}
            <FadeInUp delay={0.32}>
              <div className="mt-10 flex items-center gap-6 text-xs text-muted-foreground">
                <span className="flex items-center gap-1.5">
                  <div className="h-1.5 w-1.5 rounded-full bg-chart-4" />
                  2,000+ questions
                </span>
                <span className="flex items-center gap-1.5">
                  <div className="h-1.5 w-1.5 rounded-full bg-chart-2" />
                  6 domains
                </span>
                <span className="flex items-center gap-1.5">
                  <div className="h-1.5 w-1.5 rounded-full bg-chart-5" />
                  All experience levels
                </span>
              </div>
            </FadeInUp>
          </div>

          {/* Right: Mac-style code window with floating cards */}
          <div className="relative">
            <MacCodeWindow />
            <FloatingStatCard
              label="Accuracy"
              value="68%"
              className="absolute -left-4 top-6 z-10 sm:-left-8"
              delay={0.7}
            />
            <FloatingStatCard
              label="Streak"
              value="6 days"
              className="absolute -right-2 bottom-12 z-10 sm:-right-6"
              delay={0.9}
            />
          </div>
        </div>
      </div>
    </section>
  );
}
