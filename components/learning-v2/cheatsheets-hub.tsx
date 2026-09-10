/**
 * Phase 15 — Cheatsheets hub V2 component.
 *
 * Renders the /cheatsheets catalog from the canonical `lib/learning` data layer.
 */

import Link from "next/link";
import {
  Home,
  ChevronRight,
  ArrowRight,
  Zap,
  BookOpen,
  Layers,
  Code2,
  Database,
  Server,
  Globe,
  Network,
  Shield,
  Terminal,
  GitBranch,
  Cloud,
  Cpu,
  FileText,
  Wrench,
  Workflow,
  Container,
  type LucideIcon,
} from "lucide-react";
import {
  LANGUAGE_CHEATSHEETS,
  CONCEPT_CHEATSHEETS,
  TOOL_CHEATSHEETS,
  TOTAL_CHEATSHEETS,
} from "@/lib/learning";

const ICON_MAP: Record<string, LucideIcon> = {
  code2: Code2,
  database: Database,
  server: Server,
  globe: Globe,
  network: Network,
  shield: Shield,
  terminal: Terminal,
  "git-branch": GitBranch,
  cloud: Cloud,
  cpu: Cpu,
  layers: Layers,
  workflow: Workflow,
  container: Container,
};

function iconFor(key: string): LucideIcon {
  return ICON_MAP[key] ?? FileText;
}

export function CheatsheetsHub() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-surface-subtle to-background font-sans text-foreground selection:bg-warning/20">
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
          <span className="text-muted-foreground font-medium">Cheatsheets</span>
        </nav>

        {/* Hero */}
        <header className="mb-12 rounded-xl border border-border bg-background/90 backdrop-blur-sm shadow-lg overflow-hidden">
          <div className="relative px-8 py-8 bg-gradient-to-br from-yellow-50 dark:from-yellow-950/40  to-orange-50 dark:to-orange-950/40  ">
            <div className="flex items-center gap-2 mb-3">
              <Zap className="h-5 w-5 text-yellow-600 dark:text-yellow-400" />
              <span className="text-[10px] font-bold uppercase tracking-widest text-yellow-600 dark:text-yellow-400">
                Quick Reference
              </span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-foreground mb-3">
              Interview Cheatsheets
            </h1>
            <p className="text-sm sm:text-base text-muted-foreground leading-relaxed max-w-3xl">
              Last-minute review before your interview? These cheatsheets distill
              the most important concepts, syntax, and patterns into scannable,
              print-friendly references. From Java collections to system design
              trade-offs, Big-O complexities to Docker commands — everything you
              need at a glance.
            </p>
          </div>
          <div className="px-8 py-4 bg-gradient-to-r from-surface-subtle to-surface border-t border-border">
            <div className="flex items-center gap-6 flex-wrap">
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 rounded-lg bg-yellow-100 dark:bg-yellow-950/20 flex items-center justify-center">
                  <FileText className="h-5 w-5 text-yellow-600 dark:text-yellow-400" />
                </div>
                <div>
                  <div className="text-xs text-muted-foreground font-medium">
                    Total Sheets
                  </div>
                  <div className="text-lg font-bold text-foreground">
                    {TOTAL_CHEATSHEETS}
                  </div>
                </div>
              </div>
              <div className="h-10 w-px bg-border" />
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 rounded-lg bg-amber-100 dark:bg-amber-950/20 flex items-center justify-center">
                  <Layers className="h-5 w-5 text-amber-600 dark:text-amber-400" />
                </div>
                <div>
                  <div className="text-xs text-muted-foreground font-medium">
                    Categories
                  </div>
                  <div className="text-lg font-bold text-foreground">3</div>
                </div>
              </div>
              <div className="h-10 w-px bg-border" />
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 rounded-lg bg-orange-100 dark:bg-orange-950/20 flex items-center justify-center">
                  <BookOpen className="h-5 w-5 text-orange-600 dark:text-orange-400" />
                </div>
                <div>
                  <div className="text-xs text-muted-foreground font-medium">
                    Print-Friendly
                  </div>
                  <div className="text-lg font-bold text-foreground">Yes</div>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Language Cheatsheets */}
        <section className="mb-12">
          <div className="flex items-center gap-2 mb-2">
            <Code2 className="h-5 w-5 text-yellow-600 dark:text-yellow-400" />
            <h2 className="text-xl font-black text-foreground">
              Language & Framework
            </h2>
          </div>
          <p className="text-sm text-muted-foreground mb-5 max-w-2xl">
            Syntax, patterns, and tricks specific to each language. Perfect for
            quick review before a language-specific technical round.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {LANGUAGE_CHEATSHEETS.map((sheet) => {
              const Icon = iconFor(sheet.iconKey);
              return (
                <Link
                  key={sheet.slug}
                  href={`/cheatsheets/${sheet.slug}`}
                  className="group rounded-xl border border-border bg-background shadow-sm hover:shadow-md hover:border-yellow-300 dark:border-yellow-700 transition-all p-5"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div
                      className={`w-10 h-10 rounded-lg ${sheet.bg} flex items-center justify-center group-hover:scale-105 transition-transform`}
                    >
                      <Icon className={`h-5 w-5 ${sheet.color}`} />
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-semibold text-muted-foreground">
                        {sheet.items} sheets
                      </span>
                      <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-yellow-500 dark:text-yellow-400 group-hover:translate-x-1 transition-all" />
                    </div>
                  </div>
                  <h3 className="text-[15px] font-bold text-foreground group-hover:text-yellow-600 dark:text-yellow-400 transition-colors mb-1.5">
                    {sheet.name}
                  </h3>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    {sheet.desc}
                  </p>
                </Link>
              );
            })}
          </div>
        </section>

        {/* Concept Cheatsheets */}
        <section className="mb-12">
          <div className="flex items-center gap-2 mb-2">
            <Layers className="h-5 w-5 text-amber-600 dark:text-amber-400" />
            <h2 className="text-xl font-black text-foreground">
              Core Concepts
            </h2>
          </div>
          <p className="text-sm text-muted-foreground mb-5 max-w-2xl">
            Language-agnostic fundamentals. System design patterns, complexity
            analysis, design patterns, and API conventions that apply everywhere.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {CONCEPT_CHEATSHEETS.map((sheet) => {
              const Icon = iconFor(sheet.iconKey);
              return (
                <Link
                  key={sheet.slug}
                  href={`/cheatsheets/${sheet.slug}`}
                  className="group rounded-xl border border-border bg-background shadow-sm hover:shadow-md hover:border-default dark:border-default/30 transition-all p-5"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div
                      className={`w-10 h-10 rounded-lg ${sheet.bg} flex items-center justify-center group-hover:scale-105 transition-transform`}
                    >
                      <Icon className={`h-5 w-5 ${sheet.color}`} />
                    </div>
                    <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-amber-500 dark:text-amber-400 group-hover:translate-x-1 transition-all mt-1" />
                  </div>
                  <h3 className="text-sm font-bold text-foreground group-hover:text-amber-600 dark:text-amber-400 transition-colors mb-1.5">
                    {sheet.name}
                  </h3>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    {sheet.desc}
                  </p>
                </Link>
              );
            })}
          </div>
        </section>

        {/* Tool Cheatsheets */}
        <section className="mb-12">
          <div className="flex items-center gap-2 mb-2">
            <Wrench className="h-5 w-5 text-orange-600 dark:text-orange-400" />
            <h2 className="text-xl font-black text-foreground">
              Tools & DevOps
            </h2>
          </div>
          <p className="text-sm text-muted-foreground mb-5 max-w-2xl">
            Command references and configuration patterns for the tools every
            engineer encounters. Git, Docker, Kubernetes, Linux, AWS, and
            security.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {TOOL_CHEATSHEETS.map((sheet) => {
              const Icon = iconFor(sheet.iconKey);
              return (
                <Link
                  key={sheet.slug}
                  href={`/cheatsheets/${sheet.slug}`}
                  className="group rounded-xl border border-border bg-background shadow-sm hover:shadow-md hover:border-orange-300 dark:border-orange-700 transition-all p-5"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div
                      className={`w-10 h-10 rounded-lg ${sheet.bg} flex items-center justify-center group-hover:scale-105 transition-transform`}
                    >
                      <Icon className={`h-5 w-5 ${sheet.color}`} />
                    </div>
                    <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-orange-500 dark:text-orange-400 group-hover:translate-x-1 transition-all mt-1" />
                  </div>
                  <h3 className="text-sm font-bold text-foreground group-hover:text-orange-600 dark:text-orange-400 transition-colors mb-1.5">
                    {sheet.name}
                  </h3>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    {sheet.desc}
                  </p>
                </Link>
              );
            })}
          </div>
        </section>

        {/* CTA */}
        <section className="rounded-xl border border-yellow-200 dark:border-yellow-500/20 bg-gradient-to-r from-yellow-50 dark:from-yellow-950/40  p-8 text-center mb-12  ">
          <h2 className="text-2xl font-black text-foreground mb-3">
            Cheatsheets Are Part of Your Complete Prep
          </h2>
          <p className="text-sm text-muted-foreground mb-6 max-w-xl mx-auto">
            Select your domain and get cheatsheets mapped to your tech stack,
            along with Q&A, system design, DSA, behavioral, roadmap, and
            progress tracking.
          </p>
          <Link
            href="/domains"
            className="inline-flex items-center gap-2 px-8 py-3 bg-surface border border-default text-foreground font-bold rounded-xl hover:shadow-lg hover:scale-105 transition-all"
          >
            Start Your Prep Path
            <ArrowRight className="h-4 w-4" />
          </Link>
        </section>
      </div>
    </div>
  );
}
