/**
 * Phase 15 — Behavioral hub V2 component.
 *
 * Renders the /behavioral catalog from the canonical `lib/learning` data layer.
 */

import Link from "next/link";
import {
  Home,
  ChevronRight,
  ArrowRight,
  Brain,
  BookOpen,
  Layers,
  Target,
  MessageSquare,
  Users,
  TrendingUp,
  AlertTriangle,
  Star,
  Lightbulb,
  Shield,
  Heart,
  Award,
  Briefcase,
  type LucideIcon,
} from "lucide-react";
import {
  BEHAVIORAL_CATEGORIES,
  COMPANY_SPECIFIC,
  STAR_STEPS,
  TOTAL_BEHAVIORAL_QUESTIONS,
} from "@/lib/learning";

const ICON_MAP: Record<string, LucideIcon> = {
  star: Star,
  users: Users,
  shield: Shield,
  "alert-triangle": AlertTriangle,
  lightbulb: Lightbulb,
  "message-square": MessageSquare,
  "trending-up": TrendingUp,
  heart: Heart,
  target: Target,
  award: Award,
};

function iconFor(key: string): LucideIcon {
  return ICON_MAP[key] ?? Brain;
}

export function BehavioralHub() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 dark:from-slate-950/40  to-orange-50/20 dark:to-orange-950/40 font-sans text-foreground selection:bg-amber-200  ">
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
            Behavioral Interview
          </span>
        </nav>

        {/* Hero */}
        <header className="mb-12 rounded-xl border border-border bg-background/90 backdrop-blur-sm shadow-lg overflow-hidden">
          <div className="relative px-8 py-8 bg-surface via-orange-50 dark:via-orange-950/40 to-rose-50 dark:to-rose-950/40  ">
            <div className="flex items-center gap-2 mb-3">
              <Brain className="h-5 w-5 text-amber-600 dark:text-amber-400" />
              <span className="text-[10px] font-bold uppercase tracking-widest text-amber-600 dark:text-amber-400">
                Soft Skills & Culture Fit
              </span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-foreground mb-3">
              Behavioral Interview Prep
            </h1>
            <p className="text-sm sm:text-base text-muted-foreground leading-relaxed max-w-3xl">
              Behavioral questions are asked in every single tech interview — at
              Amazon it&apos;s 50% of the evaluation. Master the STAR framework,
              practice with {TOTAL_BEHAVIORAL_QUESTIONS}+ real questions organized by theme,
              and prepare company-specific responses for FAANG and top tech.
            </p>
          </div>
          <div className="px-8 py-4 bg-gradient-to-r from-slate-50 to-white dark:from-slate-900/40 dark:to-background border-t border-border">
            <div className="flex items-center gap-6 flex-wrap">
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 rounded-lg bg-amber-100 dark:bg-amber-950/20 flex items-center justify-center">
                  <Layers className="h-5 w-5 text-amber-600 dark:text-amber-400" />
                </div>
                <div>
                  <div className="text-xs text-muted-foreground font-medium">
                    Categories
                  </div>
                  <div className="text-lg font-bold text-foreground">
                    {BEHAVIORAL_CATEGORIES.length}
                  </div>
                </div>
              </div>
              <div className="h-10 w-px bg-slate-200 dark:bg-slate-800" />
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 rounded-lg bg-orange-100 dark:bg-orange-950/20 flex items-center justify-center">
                  <BookOpen className="h-5 w-5 text-orange-600 dark:text-orange-400" />
                </div>
                <div>
                  <div className="text-xs text-muted-foreground font-medium">
                    Total Questions
                  </div>
                  <div className="text-lg font-bold text-foreground">
                    {TOTAL_BEHAVIORAL_QUESTIONS}+
                  </div>
                </div>
              </div>
              <div className="h-10 w-px bg-slate-200 dark:bg-slate-800" />
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 rounded-lg bg-rose-100 dark:bg-rose-950/20 flex items-center justify-center">
                  <Briefcase className="h-5 w-5 text-rose-600 dark:text-rose-400" />
                </div>
                <div>
                  <div className="text-xs text-muted-foreground font-medium">
                    Company-Specific
                  </div>
                  <div className="text-lg font-bold text-foreground">
                    {COMPANY_SPECIFIC.length}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* STAR Method */}
        <section className="mb-12">
          <div className="flex items-center gap-2 mb-2">
            <Target className="h-5 w-5 text-amber-600 dark:text-amber-400" />
            <h2 className="text-xl font-black text-foreground">
              The STAR Method
            </h2>
          </div>
          <p className="text-sm text-muted-foreground mb-5 max-w-2xl">
            Every behavioral answer should follow this framework. Interviewers
            are trained to listen for it.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {STAR_STEPS.map((step) => (
              <div
                key={step.letter}
                className="rounded-xl border border-border bg-background shadow-sm p-5"
              >
                <div
                  className={`w-12 h-12 rounded-xl bg-gradient-to-br ${step.color} flex items-center justify-center mb-3`}
                >
                  <span className="text-xl font-black text-white">
                    {step.letter}
                  </span>
                </div>
                <h3 className="text-sm font-bold text-foreground mb-1.5">
                  {step.title}
                </h3>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  {step.desc}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Question Categories */}
        <section className="mb-12">
          <div className="flex items-center gap-2 mb-2">
            <MessageSquare className="h-5 w-5 text-orange-600 dark:text-orange-400" />
            <h2 className="text-xl font-black text-foreground">
              Question Categories
            </h2>
          </div>
          <p className="text-sm text-muted-foreground mb-5 max-w-2xl">
            Browse questions by theme. Each category includes sample answers
            with the STAR method applied, plus tips on what interviewers look
            for.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {BEHAVIORAL_CATEGORIES.map((cat) => {
              const Icon = iconFor(cat.iconKey);
              return (
                <Link
                  key={cat.slug}
                  href={`/behavioral/${cat.slug}`}
                  className="group rounded-xl border border-border bg-background shadow-sm hover:shadow-md hover:border-default dark:border-default/30 transition-all p-5"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div
                      className={`w-10 h-10 rounded-lg ${cat.bg} flex items-center justify-center group-hover:scale-105 transition-transform`}
                    >
                      <Icon className={`h-5 w-5 ${cat.color}`} />
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-semibold text-muted-foreground">
                        {cat.count} Qs
                      </span>
                      <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-amber-500 dark:text-amber-400 group-hover:translate-x-1 transition-all" />
                    </div>
                  </div>
                  <h3 className="text-[15px] font-bold text-foreground group-hover:text-amber-600 dark:text-amber-400 transition-colors mb-1.5">
                    {cat.name}
                  </h3>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    {cat.desc}
                  </p>
                </Link>
              );
            })}
          </div>
        </section>

        {/* Company-Specific */}
        <section className="mb-12">
          <div className="flex items-center gap-2 mb-2">
            <Briefcase className="h-5 w-5 text-rose-600 dark:text-rose-400" />
            <h2 className="text-xl font-black text-foreground">
              Company-Specific Behavioral Prep
            </h2>
          </div>
          <p className="text-sm text-muted-foreground mb-5 max-w-2xl">
            Every company has different behavioral expectations. Amazon lives
            and breathes Leadership Principles. Google values Googleyness. We
            break it down for each.
          </p>
          <div className="space-y-3">
            {COMPANY_SPECIFIC.map((comp) => (
              <Link
                key={comp.slug}
                href={`/behavioral/company/${comp.slug}`}
                className="group flex items-start gap-4 rounded-xl border border-border bg-background shadow-sm hover:shadow-md hover:border-default dark:border-default/30 transition-all p-5"
              >
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1.5">
                    <h3 className="text-[15px] font-bold text-foreground group-hover:text-amber-600 dark:text-amber-400 transition-colors">
                      {comp.name}
                    </h3>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${comp.tagColor}`}
                    >
                      {comp.tag}
                    </span>
                    <span className="text-xs font-semibold text-muted-foreground">
                      {comp.count} areas
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    {comp.desc}
                  </p>
                </div>
                <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-amber-500 dark:text-amber-400 group-hover:translate-x-1 transition-all mt-1 shrink-0" />
              </Link>
            ))}
          </div>
        </section>

        {/* CTA */}
        <section className="rounded-xl border border-default dark:border-default/20 bg-surface p-8 text-center mb-12  ">
          <h2 className="text-2xl font-black text-foreground mb-3">
            Behavioral Prep Is Part of Every Interview Domain
          </h2>
          <p className="text-sm text-muted-foreground mb-6 max-w-xl mx-auto">
            Select your domain and get behavioral questions mapped to your
            experience level alongside Q&A, system design, DSA, and a complete
            roadmap.
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
