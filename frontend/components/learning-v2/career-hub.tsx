/**
 * Phase 15 — Career hub V2 component.
 *
 * Renders the /career catalog from the canonical `lib/learning` data layer.
 */

import Link from "next/link";
import {
  Home,
  ChevronRight,
  ArrowRight,
  Briefcase,
  BookOpen,
  Layers,
  FileText,
  DollarSign,
  TrendingUp,
  Building2,
  Users,
  Search,
  Star,
  Target,
  Lightbulb,
  GraduationCap,
  Award,
  Shield,
  type LucideIcon,
} from "lucide-react";
import {
  CAREER_SECTIONS,
  QUICK_GUIDES,
  CATEGORY_COLORS,
  TOTAL_CAREER_ARTICLES,
} from "@/lib/learning";

const ICON_MAP: Record<string, LucideIcon> = {
  "file-text": FileText,
  search: Search,
  "dollar-sign": DollarSign,
  "building-2": Building2,
  "trending-up": TrendingUp,
  users: Users,
  lightbulb: Lightbulb,
  shield: Shield,
  star: Star,
  "graduation-cap": GraduationCap,
  award: Award,
  target: Target,
};

function iconFor(key: string): LucideIcon {
  return ICON_MAP[key] ?? Briefcase;
}

export function CareerHub() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 dark:from-slate-950/40 via-rose-50/20 dark:via-rose-950/40  font-sans text-foreground selection:bg-rose-200  ">
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
          <span className="text-muted-foreground font-medium">Career Guide</span>
        </nav>

        {/* Hero */}
        <header className="mb-12 rounded-xl border border-border bg-background/90 backdrop-blur-sm shadow-lg overflow-hidden">
          <div className="relative px-8 py-8 bg-gradient-to-br from-rose-50 dark:from-rose-950/40  to-blue-50 dark:to-blue-950/40  ">
            <div className="flex items-center gap-2 mb-3">
              <Briefcase className="h-5 w-5 text-rose-600 dark:text-rose-400" />
              <span className="text-[10px] font-bold uppercase tracking-widest text-rose-600 dark:text-rose-400">
                Beyond the Interview
              </span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-foreground mb-3">
              Career Guide for Software Engineers
            </h1>
            <p className="text-sm sm:text-base text-muted-foreground leading-relaxed max-w-3xl">
              Acing the technical interview is only half the battle. This guide
              covers everything else — crafting a resume that passes ATS
              screens, understanding interview processes at 20+ companies,
              negotiating offers with real scripts, evaluating company tiers, and
              planning career transitions. Written by engineers who&apos;ve been
              through it.
            </p>
          </div>
          <div className="px-8 py-4 bg-gradient-to-r from-slate-50 to-white dark:from-slate-900/40 dark:to-background border-t border-border">
            <div className="flex items-center gap-6 flex-wrap">
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 rounded-lg bg-rose-100 dark:bg-rose-950/20 flex items-center justify-center">
                  <Layers className="h-5 w-5 text-rose-600 dark:text-rose-400" />
                </div>
                <div>
                  <div className="text-xs text-muted-foreground font-medium">
                    Sections
                  </div>
                  <div className="text-lg font-bold text-foreground">
                    {CAREER_SECTIONS.length}
                  </div>
                </div>
              </div>
              <div className="h-10 w-px bg-slate-200 dark:bg-slate-800" />
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 rounded-lg bg-pink-100 dark:bg-pink-950/20 flex items-center justify-center">
                  <BookOpen className="h-5 w-5 text-primary dark:text-primary" />
                </div>
                <div>
                  <div className="text-xs text-muted-foreground font-medium">
                    Articles
                  </div>
                  <div className="text-lg font-bold text-foreground">
                    {TOTAL_CAREER_ARTICLES}+
                  </div>
                </div>
              </div>
              <div className="h-10 w-px bg-slate-200 dark:bg-slate-800" />
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 rounded-lg bg-blue-100 dark:bg-blue-950/20 flex items-center justify-center">
                  <Target className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <div className="text-xs text-muted-foreground font-medium">
                    Templates
                  </div>
                  <div className="text-lg font-bold text-foreground">
                    Included
                  </div>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Main Sections */}
        <section className="mb-12">
          <div className="flex items-center gap-2 mb-2">
            <BookOpen className="h-5 w-5 text-rose-600 dark:text-rose-400" />
            <h2 className="text-xl font-black text-foreground">
              Complete Career Sections
            </h2>
          </div>
          <p className="text-sm text-muted-foreground mb-5 max-w-2xl">
            Each section is a comprehensive guide with actionable advice,
            templates, and real examples from industry professionals.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {CAREER_SECTIONS.map((section) => {
              const Icon = iconFor(section.iconKey);
              return (
                <Link
                  key={section.slug}
                  href={`/career/${section.slug}`}
                  className="group rounded-xl border border-border bg-background shadow-sm hover:shadow-md hover:border-rose-300 dark:border-rose-500/30 transition-all p-5"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div
                      className={`w-10 h-10 rounded-lg ${section.bg} flex items-center justify-center group-hover:scale-105 transition-transform`}
                    >
                      <Icon className={`h-5 w-5 ${section.color}`} />
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-semibold text-muted-foreground">
                        {section.articles} articles
                      </span>
                      <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-rose-500 dark:text-rose-400 group-hover:translate-x-1 transition-all" />
                    </div>
                  </div>
                  <h3 className="text-[15px] font-bold text-foreground group-hover:text-rose-600 dark:text-rose-400 transition-colors mb-1.5">
                    {section.name}
                  </h3>
                  <p className="text-xs text-muted-foreground leading-relaxed mb-3">
                    {section.desc}
                  </p>
                  <div className="pt-2 border-t border-slate-100 dark:border-slate-800/60">
                    <span className="text-[10px] font-bold text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-500/10 px-2.5 py-1 rounded-full">
                      {section.highlight}
                    </span>
                  </div>
                </Link>
              );
            })}
          </div>
        </section>

        {/* Popular Articles */}
        <section className="mb-12">
          <div className="flex items-center gap-2 mb-2">
            <Star className="h-5 w-5 text-amber-600 dark:text-amber-400" />
            <h2 className="text-xl font-black text-foreground">
              Popular Articles
            </h2>
          </div>
          <p className="text-sm text-muted-foreground mb-5 max-w-2xl">
            The most-read career guides. Each one is a deep-dive with actionable
            takeaways you can implement immediately.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {QUICK_GUIDES.map((guide) => {
              const Icon = iconFor(guide.iconKey);
              return (
                <Link
                  key={guide.slug}
                  href={`/career/articles/${guide.slug}`}
                  className="group flex items-center gap-3 rounded-xl border border-border bg-background shadow-sm hover:shadow-md hover:border-rose-200 dark:border-rose-500/20 transition-all p-4"
                >
                  <div className="w-9 h-9 rounded-lg bg-surface flex items-center justify-center shrink-0 group-hover:bg-rose-100 dark:bg-rose-950/20 transition-colors">
                    <Icon className="h-4 w-4 text-muted-foreground group-hover:text-rose-600 dark:text-rose-400 transition-colors" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-sm font-bold text-foreground group-hover:text-rose-600 dark:text-rose-400 transition-colors leading-snug mb-0.5">
                      {guide.title}
                    </h3>
                    <div className="flex items-center gap-2">
                      <span
                        className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${CATEGORY_COLORS[guide.category] ?? "bg-surface text-muted-foreground"}`}
                      >
                        {guide.category}
                      </span>
                      <span className="text-[10px] text-muted-foreground font-medium">
                        {guide.readTime}
                      </span>
                    </div>
                  </div>
                  <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-rose-500 dark:text-rose-400 group-hover:translate-x-1 transition-all shrink-0" />
                </Link>
              );
            })}
          </div>
        </section>

        {/* CTA */}
        <section className="rounded-xl border border-rose-200 dark:border-rose-500/20 bg-gradient-to-r from-rose-50 dark:from-rose-950/40  p-8 text-center mb-12  ">
          <h2 className="text-2xl font-black text-foreground mb-3">
            Career Guidance + Technical Prep = Complete Package
          </h2>
          <p className="text-sm text-muted-foreground mb-6 max-w-xl mx-auto">
            Combine career strategy with domain-specific interview prep. Select
            your path and get Q&A, system design, DSA, behavioral, roadmap,
            cheatsheets — plus all the career guidance above.
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
