/**
 * Phase 13 — Topics V2 hub component.
 *
 * Server component rendering the /topics catalog. Hoisted from
 * app/topics/page.tsx — pure presentational composition over the canonical
 * lib/topics data layer. Lucide icon components are mapped from the
 * TopicIconKey tokens stored in the data layer.
 */

import Link from "next/link";
import {
  Home,
  ChevronRight,
  ArrowRight,
  BookOpen,
  Layers,
  Globe,
  Network,
  GitBranch,
  Radio,
  Puzzle,
  Target,
  Database,
  Cpu,
  Workflow,
  Shield,
  Eye,
  Terminal,
  CheckCircle2,
  Gauge,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import {
  TOPIC_CATEGORIES,
  FREQUENCY_COLORS,
  totalTopicCount,
  type TopicCardData,
  type TopicIconKey,
} from "@/lib/topics";

// TopicIconKey → lucide component. Keeps the data layer icon-agnostic while
// preserving the original per-topic visuals on the hub.
const ICON_MAP: Record<TopicIconKey, LucideIcon> = {
  network: Network,
  layers: Layers,
  "git-branch": GitBranch,
  radio: Radio,
  puzzle: Puzzle,
  target: Target,
  database: Database,
  cpu: Cpu,
  globe: Globe,
  workflow: Workflow,
  shield: Shield,
  eye: Eye,
  terminal: Terminal,
  "check-circle": CheckCircle2,
  gauge: Gauge,
  "book-open": BookOpen,
};

function iconFor(key: TopicIconKey): LucideIcon {
  return ICON_MAP[key] ?? BookOpen;
}

function TopicCard({ topic }: { topic: TopicCardData }) {
  const Icon = iconFor(topic.iconKey);
  return (
    <Link
      key={topic.slug}
      href={`/topics/${topic.slug}`}
      className="group rounded-xl border border-border bg-background shadow-sm hover:shadow-md hover:border-blue-300 dark:border-blue-500/30 transition-all p-5"
    >
      <div className="flex items-start justify-between mb-3">
        <div
          className={`w-10 h-10 rounded-lg ${topic.bg} flex items-center justify-center group-hover:scale-105 transition-transform`}
        >
          <Icon className={`h-5 w-5 ${topic.color}`} />
        </div>
        <div className="flex items-center gap-2">
          <span
            className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${FREQUENCY_COLORS[topic.frequency]}`}
          >
            {topic.frequency}
          </span>
          <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-blue-500 dark:text-blue-400 group-hover:translate-x-1 transition-all" />
        </div>
      </div>

      <h3 className="text-[15px] font-bold text-foreground group-hover:text-blue-600 dark:text-blue-400 transition-colors mb-1.5">
        {topic.name}
      </h3>
      <p className="text-xs text-muted-foreground leading-relaxed mb-3">
        {topic.desc}
      </p>

      <div className="flex flex-wrap gap-1.5 pt-3 border-t border-slate-100 dark:border-slate-800/60">
        {topic.subtopics.map((sub) => (
          <span
            key={sub}
            className="text-[10px] font-medium text-muted-foreground bg-surface px-2 py-0.5 rounded-md"
          >
            {sub}
          </span>
        ))}
      </div>
    </Link>
  );
}

export function TopicsHub() {
  const totalTopics = totalTopicCount();
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 dark:from-slate-950/40 via-blue-50/20 dark:via-blue-950/40  font-sans text-foreground selection:bg-blue-200  ">
      <div className="w-full min-w-0 px-6 py-8">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-1.5 text-xs text-muted-foreground mb-8">
          <Link href="/" className="hover:text-muted-foreground flex items-center gap-1">
            <Home className="h-3 w-3" /> Home
          </Link>
          <ChevronRight className="h-3 w-3" />
          <span className="text-muted-foreground font-medium">Topics & Concepts</span>
        </nav>

        {/* Hero */}
        <header className="mb-12 rounded-xl border border-border bg-background/90 backdrop-blur-sm shadow-lg overflow-hidden">
          <div className="relative px-8 py-8 bg-gradient-to-br from-blue-50 dark:from-blue-950/40  ">
            <div className="flex items-center gap-2 mb-3">
              <BookOpen className="h-5 w-5 text-blue-600 dark:text-blue-400" />
              <span className="text-[10px] font-bold uppercase tracking-widest text-blue-600 dark:text-blue-400">
                Cross-Language Concepts
              </span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-foreground mb-3">
              Topics & Technical Concepts
            </h1>
            <p className="text-sm sm:text-base text-muted-foreground leading-relaxed max-w-3xl">
              Core technical concepts that come up in every interview, across
              all languages and tracks. Each topic aggregates questions from
              every relevant domain — so whether you&apos;re a Java backend
              engineer or a Python ML developer, you get concept-level mastery
              that transfers everywhere.
            </p>
          </div>
          <div className="px-8 py-4 bg-gradient-to-r from-slate-50 to-white dark:from-slate-900/40 dark:to-background border-t border-border">
            <div className="flex items-center gap-6 flex-wrap">
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 rounded-lg bg-blue-100 dark:bg-blue-950/20 flex items-center justify-center">
                  <Layers className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <div className="text-xs text-muted-foreground font-medium">Topics</div>
                  <div className="text-lg font-bold text-foreground">{totalTopics}</div>
                </div>
              </div>
              <div className="h-10 w-px bg-slate-200 dark:bg-slate-800" />
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 rounded-lg bg-blue-100 dark:bg-blue-950/20 flex items-center justify-center">
                  <BookOpen className="h-5 w-5 text-primary dark:text-primary" />
                </div>
                <div>
                  <div className="text-xs text-muted-foreground font-medium">Categories</div>
                  <div className="text-lg font-bold text-foreground">{TOPIC_CATEGORIES.length}</div>
                </div>
              </div>
              <div className="h-10 w-px bg-slate-200 dark:bg-slate-800" />
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 rounded-lg bg-blue-100 dark:bg-blue-950/20 flex items-center justify-center">
                  <Globe className="h-5 w-5 text-primary dark:text-primary" />
                </div>
                <div>
                  <div className="text-xs text-muted-foreground font-medium">Language-Agnostic</div>
                  <div className="text-lg font-bold text-foreground">Yes</div>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Topic Sections */}
        {TOPIC_CATEGORIES.map((category) => (
          <section key={category.title} className="mb-10">
            <div className="flex items-center gap-2 mb-1.5">
              <h2 className="text-xl font-black text-foreground">{category.title}</h2>
            </div>
            <p className="text-sm text-muted-foreground mb-5">{category.desc}</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {category.topics.map((topic) => (
                <TopicCard key={topic.slug} topic={topic} />
              ))}
            </div>
          </section>
        ))}

        {/* Cross-reference CTA */}
        <section className="rounded-xl border border-blue-200 dark:border-blue-500/20 bg-gradient-to-r from-blue-50 dark:from-blue-950/40  p-8 text-center mb-12  ">
          <h2 className="text-2xl font-black text-foreground mb-3">
            Learn Concepts in Context
          </h2>
          <p className="text-sm text-muted-foreground mb-6 max-w-xl mx-auto">
            Every topic appears in your domain prep dashboard. Select your tech
            stack and get these concepts mapped to your interview path — with
            progress tracking and related Q&amp;A.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link
              href="/domains"
              className="inline-flex items-center gap-2 px-8 py-3 bg-surface border border-default text-foreground font-bold rounded-xl hover:shadow-lg hover:scale-105 transition-all"
            >
              Select Your Domain
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href="/system-design"
              className="inline-flex items-center gap-2 px-8 py-3 bg-background border border-border text-foreground font-bold rounded-xl hover:shadow-md hover:border-blue-300 dark:border-blue-500/30 transition-all"
            >
              System Design Problems
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
}
