/**
 * Phase 14 — Curriculum V2 canonical data.
 *
 * Data layer for the interview hierarchy. The hub/level/stack loaders read
 * from the existing contentV2 content readers (single source of truth for
 * the question corpus) and reshape them into the V2 page payloads. The
 * standalone "coming soon" role pages (ruby, business-analyst,
 * data-analyst) carry their own static topic catalogs here.
 */

import {
  listLanguages,
  listTracks,
  listLevels,
  listStacksForPath,
  resolveStackContent,
  getV2QuestionsForStack,
} from "@/lib/contentV2";
import { getVisibleStackSlugs } from "@/lib/content-reader";
import { EXPERIENCE_LEVELS, type ExperienceLevelKey } from "@/lib/levels";
import type { Level } from "@/lib/contentV2-types";
import type {
  InterviewHubLangData,
  LangHubData,
  LangTrackRef,
  LevelHubData,
  LevelMeta,
  RolePageData,
  StackHubData,
  StackPreviewData,
  StackPreviewQuestion,
  TrackHubData,
} from "./curriculum-types";

/** Level display metadata (hoisted from the inline LEVEL_META constants). */
export const LEVEL_META: Record<Level, LevelMeta> = {
  beginner: {
    label: "Beginner",
    range: "0–2 years",
    color: "hsl(var(--difficulty-easy))",
    colorClass:
      "bg-success/10 dark:bg-success/20 text-success dark:text-success border-default dark:border-default/20",
  },
  intermediate: {
    label: "Intermediate",
    range: "2–5 years",
    color: "hsl(var(--difficulty-medium))",
    colorClass:
      "bg-warning/10 dark:bg-warning/20 text-warning dark:text-warning border-default dark:border-default/20",
  },
  advanced: {
    label: "Advanced",
    range: "5+ years",
    color: "hsl(var(--difficulty-hard))",
    colorClass:
      "bg-destructive/10 dark:bg-destructive/20 text-destructive dark:text-destructive border-default dark:border-default/20",
  },
};

/** Title-case a slug. */
export function curriculumToTitle(s: string): string {
  return s
    .split("-")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
}

/** Difficulty → CSS color var. */
export function difficultyColor(d: string): string {
  return d === "easy"
    ? "hsl(var(--difficulty-easy))"
    : d === "medium"
      ? "hsl(var(--difficulty-medium))"
      : "hsl(var(--difficulty-hard))";
}

/** Difficulty → label. */
export function difficultyLabel(d: string): string {
  return d === "easy" ? "Easy" : d === "medium" ? "Medium" : "Hard";
}

/** Load the /interview all-languages hub data. */
export function loadInterviewHub(): InterviewHubLangData[] {
  const languages = listLanguages();
  return languages.map((lang) => {
    const tracks = listTracks(lang);
    const trackData = tracks.map((track) => {
      const levels = listLevels(lang, track);
      const levelData = levels.map((level) => {
        const stacks = listStacksForPath(lang, track, level);
        let totalQ = 0;
        for (const stack of stacks) {
          const content = resolveStackContent(lang, track, level, stack);
          totalQ += content?.questions.length ?? 0;
        }
        return { level, stackCount: stacks.length, questionCount: totalQ };
      });
      const totalStacks = levelData.reduce((s, l) => s + l.stackCount, 0);
      const totalQs = levelData.reduce((s, l) => s + l.questionCount, 0);
      return { track, levels: levelData, totalStacks, totalQs };
    });
    const totalStacks = trackData.reduce((s, t) => s + t.totalStacks, 0);
    const totalQs = trackData.reduce((s, t) => s + t.totalQs, 0);
    return { lang, tracks: trackData, totalStacks, totalQs };
  });
}

/** LANG_META hoisted from app/interview/[lang]/page.tsx. */
const LANG_META: Record<string, { name: string; tracks: LangTrackRef[] }> = {
  java: {
    name: "Java",
    tracks: [
      { slug: "backend", name: "Java Backend", iconKey: "server", desc: "Spring Boot, Kafka, Redis, PostgreSQL, AWS, Microservices, JVM", stacks: "32 stacks · 500+ questions" },
      { slug: "fullstack", name: "Java Full Stack", iconKey: "globe", desc: "Java BE + React/Angular FE, REST APIs, Docker", stacks: "18 stacks · 200+ questions" },
    ],
  },
  python: {
    name: "Python",
    tracks: [
      { slug: "backend", name: "Python Backend", iconKey: "server", desc: "Django, FastAPI, Flask, SQLAlchemy, Celery, Redis", stacks: "28 stacks · 400+ questions" },
      { slug: "fullstack", name: "Python Full Stack", iconKey: "globe", desc: "Django/FastAPI + React, REST, WebSockets", stacks: "16 stacks · 180+ questions" },
      { slug: "data-engineering", name: "Data Engineering", iconKey: "database", desc: "Airflow, Spark, Kafka, dbt, data pipelines, warehouses", stacks: "12 stacks · 150+ questions" },
      { slug: "ml-ai", name: "ML / AI Engineering", iconKey: "brain", desc: "MLOps, LLMs, model deployment, feature engineering, vector DBs", stacks: "10 stacks · 120+ questions" },
    ],
  },
  javascript: {
    name: "JavaScript",
    tracks: [
      { slug: "frontend", name: "JS Frontend", iconKey: "globe", desc: "React, Next.js, TypeScript, Vue, Angular, performance", stacks: "20 stacks · Coming soon" },
      { slug: "backend", name: "Node.js Backend", iconKey: "server", desc: "Express, NestJS, GraphQL, REST, tRPC", stacks: "14 stacks · Coming soon" },
      { slug: "fullstack", name: "JS Full Stack", iconKey: "globe", desc: "React + Node, Next.js, Prisma, Vercel", stacks: "10 stacks · Coming soon" },
    ],
  },
};

/** Load /interview/:lang hub data. Returns null for unknown langs. */
export function loadLangHub(lang: string): LangHubData | null {
  const meta = LANG_META[lang];
  if (!meta) return null;
  return { lang, name: meta.name, tracks: meta.tracks };
}

/** Load /interview/:lang/:track hub data. */
export function loadTrackHub(lang: string, track: string): TrackHubData {
  const langTitle = curriculumToTitle(lang);
  const trackTitle = curriculumToTitle(track);
  const levels = (
    Object.entries(EXPERIENCE_LEVELS) as [ExperienceLevelKey, (typeof EXPERIENCE_LEVELS)[ExperienceLevelKey]][]
  ).map(([key, meta]) => {
    const domainSlug = `${lang}-${track}-${key}`;
    const stacks = getVisibleStackSlugs(domainSlug);
    return { key, meta: LEVEL_META[key] ?? LEVEL_META.intermediate, stacks, domainSlug };
  });
  return { lang, track, langTitle, trackTitle, levels };
}

/** Load /interview/:lang/:track/:level hub data. Returns null for invalid level / no stacks. */
export function loadLevelHub(lang: string, track: string, level: Level): LevelHubData | null {
  const meta = LEVEL_META[level];
  if (!meta) return null;
  const stacks = listStacksForPath(lang, track, level);
  if (stacks.length === 0) return null;
  const stackData: StackPreviewData[] = stacks
    .map((stackSlug) => {
      const content = resolveStackContent(lang, track, level, stackSlug);
      const questions = getV2QuestionsForStack(lang, track, level, stackSlug);
      return {
        slug: stackSlug,
        name: content?.meta.stack ? curriculumToTitle(content.meta.stack) : curriculumToTitle(stackSlug),
        description: content?.meta.description ?? null,
        questionCount: questions.length,
        questions: questions.slice(0, 5).map((q) => ({
          slug: q.slug,
          title: q.title,
          difficulty: q.difficulty,
          estimatedReadTime: q.estimatedReadTime ?? 5,
        })),
      };
    })
    .sort((a, b) => b.questionCount - a.questionCount);
  const totalQuestions = stackData.reduce((s, st) => s + st.questionCount, 0);
  const availableLevels = listLevels(lang, track);
  return { lang, track, level, meta, stacks: stackData, totalQuestions, availableLevels };
}

/** Load /interview/:lang/:track/:level/:stack hub data. Returns null if no content. */
export function loadStackHub(lang: string, track: string, level: Level, stack: string): StackHubData | null {
  const content = resolveStackContent(lang, track, level, stack);
  if (!content || content.questions.length === 0) return null;
  const questions = getV2QuestionsForStack(lang, track, level, stack);
  const stackName = content.meta?.stack ? curriculumToTitle(content.meta.stack) : curriculumToTitle(stack);
  return {
    lang,
    track,
    level,
    stack,
    stackName,
    description: content.meta?.description ?? null,
    questions: questions.map((q) => ({
      slug: q.slug,
      title: q.title,
      difficulty: q.difficulty,
      estimatedReadTime: q.estimatedReadTime ?? 5,
    })),
    lvlMeta: LEVEL_META[level] ?? LEVEL_META.intermediate,
  };
}

/** Standalone role pages (ruby / business-analyst / data-analyst). */
const ROLE_PAGES: Record<string, RolePageData> = {
  ruby: {
    slug: "ruby",
    title: "Ruby Interview Questions",
    eyebrow: "Ruby Interview Prep",
    description:
      "Ruby on Rails, Sidekiq, ActiveRecord, RSpec, REST APIs — all interview questions for Ruby engineers. Content launching soon.",
    accent: "rose",
    topics: [
      { emoji: "💎", name: "Ruby Backend", desc: "Ruby on Rails, Sinatra, ActiveRecord, Sidekiq, REST API, RSpec, Devise" },
      { emoji: "⚡", name: "Ruby Fullstack", desc: "Rails + Hotwire, Turbo, React front-end with Rails API" },
    ],
  },
  "business-analyst": {
    slug: "business-analyst",
    title: "Business Analyst Interview Questions",
    eyebrow: "Business Analyst Interview Prep",
    description:
      "Requirements gathering, stakeholder management, Agile, SQL basics, process mapping, and STAR behavioral questions — the complete BA prep guide. Coming soon.",
    accent: "amber",
    topics: [
      { emoji: "📝", name: "Requirements Gathering", desc: "User stories, acceptance criteria, BRDs, stakeholder interviews, scope definition" },
      { emoji: "🤝", name: "Stakeholder Management", desc: "Managing conflicting priorities, communication plans, executive presentations" },
      { emoji: "🔄", name: "Process Mapping", desc: "As-is vs to-be, swimlane diagrams, BPMN, process improvement, Lean/Six Sigma basics" },
      { emoji: "🗄️", name: "SQL for BAs", desc: "Basic queries, JOINs, aggregations, report generation — enough to talk to engineers and pull data" },
      { emoji: "⚡", name: "Agile & JIRA", desc: "Sprint ceremonies, backlog grooming, user story writing, velocity tracking, Kanban vs Scrum" },
      { emoji: "💬", name: "Case Studies & Behavioral", desc: "STAR method, 'Tell me about a time you prioritized competing requirements', product sense questions" },
    ],
  },
  "data-analyst": {
    slug: "data-analyst",
    title: "Data Analyst Interview Questions",
    eyebrow: "Data Analyst Interview Prep",
    description:
      "The complete prep resource nobody else provides for DA roles — SQL coding rounds, Python data analysis, A/B testing, business metric case studies, and behavioral questions. Coming soon.",
    accent: "teal",
    topics: [
      { emoji: "🗄️", name: "SQL Analytics", desc: "Window functions, CTEs, subqueries, query optimization, GROUP BY patterns" },
      { emoji: "🐍", name: "Python for Data", desc: "Pandas, NumPy, data cleaning, aggregations, exploratory analysis" },
      { emoji: "📊", name: "Statistics & A/B Testing", desc: "Hypothesis testing, p-values, confidence intervals, experiment design" },
      { emoji: "📈", name: "Data Visualization", desc: "Tableau, Power BI, chart choice, storytelling with data" },
      { emoji: "📋", name: "Business Metrics", desc: "KPIs, north star metrics, cohort analysis, funnel analysis, churn" },
      { emoji: "💡", name: "Case Studies", desc: "Open-ended: 'How would you measure X?' or 'Why is metric Y dropping?'" },
    ],
  },
};

/** Load a standalone role page. Returns null for unknown roles. */
export function loadRolePage(slug: string): RolePageData | null {
  return ROLE_PAGES[slug] ?? null;
}

/** All role-page slugs (for generateStaticParams if needed). */
export function rolePageSlugs(): string[] {
  return Object.keys(ROLE_PAGES);
}
