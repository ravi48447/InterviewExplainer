/**
 * Phase 15 — Roadmaps hub V2 component.
 *
 * Renders the /roadmaps catalog from the canonical `lib/learning` data layer.
 * Icon components are restored from `iconKey` strings via ICON_MAP.
 */

import Link from "next/link";
import {
  Home,
  ChevronRight,
  ArrowRight,
  Map,
  BookOpen,
  Clock,
  Target,
  Code2,
  Layers,
  Briefcase,
  GraduationCap,
  Rocket,
  Calendar,
  CheckCircle2,
  TrendingUp,
  type LucideIcon,
} from "lucide-react";
import {
  DOMAIN_ROADMAPS,
  DSA_PLANS,
  TIMELINE_PLANS,
} from "@/lib/learning";

const ICON_MAP: Record<string, LucideIcon> = {
  rocket: Rocket,
  "trending-up": TrendingUp,
  "book-open": BookOpen,
  "graduation-cap": GraduationCap,
};

export function RoadmapsHub() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-surface-subtle to-background font-sans text-foreground selection:bg-success/20">
      <div className="w-full min-w-0 px-6 py-8">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-1.5 text-xs text-muted-foreground mb-8">
          <Link
            href="/"
            className="hover:text-muted-foreground flex items-center gap-1"
          >
            <Home className="h-3 w-3" /> Home
          </Link>
          <ChevronRight className="h-3 w-3" />
          <span className="text-muted-foreground font-medium">
            Roadmaps & Study Plans
          </span>
        </nav>

        {/* Hero */}
        <header className="mb-12 rounded-xl border border-border bg-background/90 backdrop-blur-sm shadow-lg overflow-hidden">
          <div className="relative px-8 py-8 bg-gradient-to-br from-green-50 dark:from-green-950/40  to-teal-50 dark:to-teal-950/40  ">
            <div className="flex items-center gap-2 mb-3">
              <Map className="h-5 w-5 text-green-600 dark:text-green-400" />
              <span className="text-[10px] font-bold uppercase tracking-widest text-green-600 dark:text-green-400">
                Structured Learning Paths
              </span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-foreground mb-3">
              Interview Roadmaps & Study Plans
            </h1>
            <p className="text-sm sm:text-base text-muted-foreground leading-relaxed max-w-3xl">
              Stop guessing what to study. Follow structured, week-by-week plans
              designed for your domain and timeline. Includes domain-specific
              roadmaps, curated DSA problem sets, and flexible timeline-based
              plans from 2-week sprints to 12-week mastery programs.
            </p>
          </div>
          <div className="px-8 py-4 bg-gradient-to-r from-surface-subtle to-surface border-t border-border">
            <div className="flex items-center gap-6 flex-wrap">
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 rounded-lg bg-green-100 dark:bg-green-950/20 flex items-center justify-center">
                  <Briefcase className="h-5 w-5 text-green-600 dark:text-green-400" />
                </div>
                <div>
                  <div className="text-xs text-muted-foreground font-medium">
                    Domain Roadmaps
                  </div>
                  <div className="text-lg font-bold text-foreground">
                    {DOMAIN_ROADMAPS.length}
                  </div>
                </div>
              </div>
              <div className="h-10 w-px bg-border" />
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 rounded-lg bg-emerald-100 dark:bg-emerald-950/20 flex items-center justify-center">
                  <Code2 className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
                </div>
                <div>
                  <div className="text-xs text-muted-foreground font-medium">
                    DSA Study Plans
                  </div>
                  <div className="text-lg font-bold text-foreground">
                    {DSA_PLANS.length}
                  </div>
                </div>
              </div>
              <div className="h-10 w-px bg-border" />
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 rounded-lg bg-teal-100 dark:bg-teal-950/20 flex items-center justify-center">
                  <Calendar className="h-5 w-5 text-teal-600 dark:text-teal-400" />
                </div>
                <div>
                  <div className="text-xs text-muted-foreground font-medium">
                    Timeline Plans
                  </div>
                  <div className="text-lg font-bold text-foreground">
                    {TIMELINE_PLANS.length}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Timeline Plans */}
        <section className="mb-12">
          <div className="flex items-center gap-2 mb-2">
            <Clock className="h-5 w-5 text-green-600 dark:text-green-400" />
            <h2 className="text-xl font-black text-foreground">
              Choose Your Timeline
            </h2>
          </div>
          <p className="text-sm text-muted-foreground mb-5 max-w-2xl">
            Got an interview in 2 weeks or planning 3 months ahead? Pick the
            plan that fits your schedule.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {TIMELINE_PLANS.map((plan) => {
              const Icon = ICON_MAP[plan.iconKey] ?? Clock;
              return (
                <div
                  key={plan.duration}
                  className="rounded-xl border border-border bg-background shadow-sm hover:shadow-md transition-all p-5"
                >
                  <div
                    className={`w-10 h-10 rounded-lg ${plan.bg} flex items-center justify-center mb-3`}
                  >
                    <Icon className={`h-5 w-5 ${plan.color}`} />
                  </div>
                  <h3 className="text-sm font-bold text-foreground mb-1.5">
                    {plan.duration}
                  </h3>
                  <p className="text-xs text-muted-foreground leading-relaxed mb-3">
                    {plan.desc}
                  </p>
                  <div className="pt-3 border-t border-border/60">
                    <p className="text-[10px] font-bold uppercase text-muted-foreground mb-1">
                      Ideal for
                    </p>
                    <p className="text-xs text-muted-foreground font-medium">
                      {plan.ideal}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* Domain Roadmaps */}
        <section className="mb-12">
          <div className="flex items-center gap-2 mb-2">
            <Target className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
            <h2 className="text-xl font-black text-foreground">
              Domain-Specific Roadmaps
            </h2>
          </div>
          <p className="text-sm text-muted-foreground mb-5 max-w-2xl">
            Complete week-by-week study plans tailored to your specific career
            path and experience level. Each includes Q&A, system design, DSA,
            behavioral, and tools.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {DOMAIN_ROADMAPS.map((roadmap) => (
              <Link
                key={roadmap.slug}
                href={`/roadmaps/${roadmap.slug}`}
                className="group rounded-xl border border-border bg-background shadow-sm hover:shadow-md hover:border-green-300 dark:border-green-700 transition-all p-5"
              >
                <div className="flex items-start gap-4">
                  <div
                    className={`w-12 h-12 rounded-xl bg-gradient-to-br ${roadmap.gradient} flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform`}
                  >
                    <Layers className="h-6 w-6 text-foreground" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <h3 className="text-[15px] font-bold text-foreground group-hover:text-green-600 dark:text-green-400 transition-colors">
                        {roadmap.name}
                      </h3>
                      <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-green-500 dark:text-green-400 group-hover:translate-x-1 transition-all shrink-0" />
                    </div>
                    <p className="text-xs text-muted-foreground mb-2">
                      {roadmap.stacks}
                    </p>
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-[10px] font-bold text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-950/20 px-2 py-0.5 rounded-full">
                        {roadmap.weeks}
                      </span>
                      {roadmap.levels.map((level) => (
                        <span
                          key={level}
                          className="text-[10px] font-medium text-muted-foreground bg-surface px-2 py-0.5 rounded-full"
                        >
                          {level}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* DSA Study Plans */}
        <section className="mb-12">
          <div className="flex items-center gap-2 mb-2">
            <Code2 className="h-5 w-5 text-blue-600 dark:text-blue-400" />
            <h2 className="text-xl font-black text-foreground">
              Curated DSA Problem Sets
            </h2>
          </div>
          <p className="text-sm text-muted-foreground mb-5 max-w-2xl">
            The internet&apos;s most trusted problem lists, restructured with
            explanations, pattern tags, and progress tracking.
          </p>
          <div className="space-y-3">
            {DSA_PLANS.map((plan) => (
              <Link
                key={plan.slug}
                href={`/roadmaps/dsa/${plan.slug}`}
                className="group flex items-start gap-4 rounded-xl border border-border bg-background shadow-sm hover:shadow-md hover:border-blue-300 dark:border-blue-500/30 transition-all p-5"
              >
                <div className="w-10 h-10 rounded-lg bg-blue-100 dark:bg-blue-950/20 flex items-center justify-center shrink-0">
                  <Code2 className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="text-[15px] font-bold text-foreground group-hover:text-blue-600 dark:text-blue-400 transition-colors">
                      {plan.name}
                    </h3>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${plan.tagColor}`}
                    >
                      {plan.tag}
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground leading-relaxed mb-2">
                    {plan.desc}
                  </p>
                  <div className="flex items-center gap-4 text-xs font-semibold text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <CheckCircle2 className="h-3 w-3" /> {plan.count}{" "}
                      problems
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="h-3 w-3" /> {plan.duration}
                    </span>
                  </div>
                </div>
                <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-blue-500 dark:text-blue-400 group-hover:translate-x-1 transition-all mt-1 shrink-0" />
              </Link>
            ))}
          </div>
        </section>

        {/* CTA */}
        <section className="rounded-xl border border-green-200 dark:border-green-500/20 bg-gradient-to-r from-green-50 dark:from-green-950/40  p-8 text-center mb-12  ">
          <h2 className="text-2xl font-black text-foreground mb-3">
            Get a Personalized Roadmap for Your Domain
          </h2>
          <p className="text-sm text-muted-foreground mb-6 max-w-xl mx-auto">
            Select your language, track, and experience level to get a
            customized study plan with progress tracking across Q&A, system
            design, DSA, and behavioral prep.
          </p>
          <Link
            href="/domains"
            className="inline-flex items-center gap-2 px-8 py-3 bg-surface border border-default text-foreground font-bold rounded-xl hover:shadow-lg hover:scale-105 transition-all"
          >
            Select Your Domain
            <ArrowRight className="h-4 w-4" />
          </Link>
        </section>
      </div>
    </div>
  );
}
