import { Metadata } from "next";
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
} from "lucide-react";

export const revalidate = 3600;

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://interviewexplainer.com";

export const metadata: Metadata = {
  title:
    "Interview Roadmaps & Study Plans — FAANG Prep, DSA Plans, Career Paths",
  description:
    "Structured study plans for tech interviews. 4-week sprints, 8-week deep dives, and 12-week comprehensive plans for Java, Python, JavaScript, and every track. Includes DSA study sheets, company-specific prep timelines, and milestone tracking.",
  alternates: { canonical: `${SITE_URL}/roadmaps` },
};

const DOMAIN_ROADMAPS = [
  {
    slug: "java-backend",
    name: "Java Backend Engineer",
    levels: ["Beginner", "Intermediate", "Advanced"],
    stacks: "Spring Boot, Microservices, PostgreSQL, Kafka, Docker, AWS",
    gradient: "from-orange-50 dark:from-orange-950/400 to-red-600",
    weeks: "8-week plan per level",
  },
  {
    slug: "python-backend",
    name: "Python Backend Developer",
    levels: ["Beginner", "Intermediate", "Advanced"],
    stacks: "Django, FastAPI, PostgreSQL, Redis, Celery, AWS",
    gradient: "from-blue-50 dark:from-blue-950/400 to-cyan-600",
    weeks: "8-week plan per level",
  },
  {
    slug: "javascript-frontend",
    name: "JavaScript Frontend Engineer",
    levels: ["Beginner", "Intermediate", "Advanced"],
    stacks: "React, TypeScript, Next.js, Testing, Performance",
    gradient: "from-yellow-400 to-orange-50 dark:to-orange-950/400",
    weeks: "8-week plan per level",
  },
  {
    slug: "python-data-engineering",
    name: "Python Data Engineer",
    levels: ["Beginner", "Intermediate", "Advanced"],
    stacks: "Spark, Airflow, Kafka, SQL, Data Modeling, dbt",
    gradient: "from-emerald-50 dark:from-emerald-950/400 to-teal-600",
    weeks: "8-week plan per level",
  },
  {
    slug: "python-ml-ai",
    name: "Python ML/AI Engineer",
    levels: ["Beginner", "Intermediate", "Advanced"],
    stacks: "PyTorch, TensorFlow, MLOps, NLP, Computer Vision",
    gradient: "from-violet-50 dark:from-violet-950/400 to-purple-600",
    weeks: "8-week plan per level",
  },
  {
    slug: "go-backend",
    name: "Go Backend Engineer",
    levels: ["Beginner", "Intermediate", "Advanced"],
    stacks: "Go, gRPC, Kubernetes, Docker, PostgreSQL",
    gradient: "from-cyan-50 dark:from-cyan-950/400 to-blue-600",
    weeks: "8-week plan per level",
  },
  {
    slug: "devops",
    name: "DevOps / SRE Engineer",
    levels: ["Beginner", "Intermediate", "Advanced"],
    stacks: "Kubernetes, Terraform, CI/CD, AWS, Monitoring, Linux",
    gradient: "from-slate-50 dark:from-slate-950/400 to-slate-700",
    weeks: "8-week plan per level",
  },
  {
    slug: "fullstack",
    name: "Full-Stack Engineer",
    levels: ["Beginner", "Intermediate", "Advanced"],
    stacks: "React, Node.js/Spring Boot, PostgreSQL, DevOps",
    gradient: "from-rose-50 dark:from-rose-950/400 to-pink-600",
    weeks: "10-week plan per level",
  },
];

const DSA_PLANS = [
  {
    slug: "blind-75",
    name: "Blind 75",
    count: 75,
    duration: "4-6 weeks",
    desc: "The original curated list covering all essential patterns. Best for time-constrained prep targeting top tech companies.",
    tag: "Most Popular",
    tagColor: "bg-amber-100 dark:bg-amber-950/20 text-amber-700 dark:text-amber-400",
  },
  {
    slug: "neetcode-150",
    name: "NeetCode 150",
    count: 150,
    duration: "8-10 weeks",
    desc: "Expanded Blind 75 with better coverage of edge cases and advanced patterns. Includes video explanations for every problem.",
    tag: "Comprehensive",
    tagColor: "bg-blue-100 dark:bg-blue-950/20 text-blue-700 dark:text-blue-400",
  },
  {
    slug: "grind-75",
    name: "Grind 75",
    count: 75,
    duration: "4-8 weeks",
    desc: "Updated Blind 75 with customizable schedule. Sorted by estimated time and difficulty. Built by the Blind 75 creator.",
    tag: "Flexible",
    tagColor: "bg-green-100 dark:bg-green-950/20 text-green-700 dark:text-green-400",
  },
  {
    slug: "top-100-liked",
    name: "LeetCode Top 100 Liked",
    count: 100,
    duration: "6-8 weeks",
    desc: "Community-voted top problems. Good breadth across all major patterns with emphasis on frequently asked questions.",
    tag: "Community Pick",
    tagColor: "bg-purple-100 dark:bg-purple-950/20 text-purple-700 dark:text-purple-400",
  },
  {
    slug: "dsa-foundations",
    name: "DSA Foundations (Beginner)",
    count: 50,
    duration: "4 weeks",
    desc: "Start here if you are new to DSA. Covers arrays, strings, hash maps, two pointers, and basic recursion with guided explanations.",
    tag: "Beginner",
    tagColor: "bg-emerald-100 dark:bg-emerald-950/20 text-emerald-700 dark:text-emerald-400",
  },
];

const TIMELINE_PLANS = [
  {
    duration: "2-Week Sprint",
    icon: Rocket,
    desc: "Last-minute FAANG prep. Focus on Blind 75 top 30, 5 system design problems, behavioral STAR stories. High-intensity daily plan.",
    ideal: "Interview in 2 weeks, need focused prep",
    color: "text-red-600",
    bg: "bg-red-100 dark:bg-red-950/20",
  },
  {
    duration: "4-Week Plan",
    icon: TrendingUp,
    desc: "Balanced prep covering DSA patterns, system design fundamentals, behavioral prep, and 1 mock interview per week.",
    ideal: "Interview in 1 month, some prior prep",
    color: "text-amber-600 dark:text-amber-400",
    bg: "bg-amber-100 dark:bg-amber-950/20",
  },
  {
    duration: "8-Week Deep Dive",
    icon: BookOpen,
    desc: "Comprehensive prep with deep mastery of all areas. DSA pattern-by-pattern, full system design course, behavioral bank complete.",
    ideal: "Planning ahead, want thorough preparation",
    color: "text-blue-600 dark:text-blue-400",
    bg: "bg-blue-100 dark:bg-blue-950/20",
  },
  {
    duration: "12-Week Mastery",
    icon: GraduationCap,
    desc: "Complete career transformation. Covers everything plus portfolio projects, resume optimization, networking, and negotiation prep.",
    ideal: "Career switch, targeting top companies",
    color: "text-emerald-600 dark:text-emerald-400",
    bg: "bg-emerald-100 dark:bg-emerald-950/20",
  },
];

export default function RoadmapsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 dark:from-slate-950/40 via-green-50/20 dark:via-green-950/40 to-emerald-50/20 dark:to-emerald-950/40 font-sans text-foreground selection:bg-green-200  ">
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
          <div className="relative px-8 py-8 bg-gradient-to-br from-green-50 dark:from-green-950/40 via-emerald-50 dark:via-emerald-950/40 to-teal-50 dark:to-teal-950/40  ">
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
          <div className="px-8 py-4 bg-gradient-to-r from-slate-50 to-white dark:from-slate-900/40 dark:to-background border-t border-border">
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
              <div className="h-10 w-px bg-slate-200 dark:bg-slate-800" />
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
              <div className="h-10 w-px bg-slate-200 dark:bg-slate-800" />
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
            {TIMELINE_PLANS.map((plan) => (
              <div
                key={plan.duration}
                className="rounded-xl border border-border bg-background shadow-sm hover:shadow-md transition-all p-5"
              >
                <div
                  className={`w-10 h-10 rounded-lg ${plan.bg} flex items-center justify-center mb-3`}
                >
                  <plan.icon className={`h-5 w-5 ${plan.color}`} />
                </div>
                <h3 className="text-sm font-bold text-foreground mb-1.5">
                  {plan.duration}
                </h3>
                <p className="text-xs text-muted-foreground leading-relaxed mb-3">
                  {plan.desc}
                </p>
                <div className="pt-3 border-t border-slate-100 dark:border-slate-800/60">
                  <p className="text-[10px] font-bold uppercase text-muted-foreground mb-1">
                    Ideal for
                  </p>
                  <p className="text-xs text-muted-foreground font-medium">
                    {plan.ideal}
                  </p>
                </div>
              </div>
            ))}
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
                    <Layers className="h-6 w-6 text-white" />
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
            <Code2 className="h-5 w-5 text-violet-600 dark:text-violet-400" />
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
                className="group flex items-start gap-4 rounded-xl border border-border bg-background shadow-sm hover:shadow-md hover:border-violet-300 dark:border-violet-500/30 transition-all p-5"
              >
                <div className="w-10 h-10 rounded-lg bg-violet-100 dark:bg-violet-950/20 flex items-center justify-center shrink-0">
                  <Code2 className="h-5 w-5 text-violet-600 dark:text-violet-400" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="text-[15px] font-bold text-foreground group-hover:text-violet-600 dark:text-violet-400 transition-colors">
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
                <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-violet-500 dark:text-violet-400 group-hover:translate-x-1 transition-all mt-1 shrink-0" />
              </Link>
            ))}
          </div>
        </section>

        {/* CTA */}
        <section className="rounded-xl border border-green-200 dark:border-green-500/20 bg-gradient-to-r from-green-50 dark:from-green-950/40 to-emerald-50 dark:to-emerald-950/40 p-8 text-center mb-12  ">
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
            className="inline-flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white font-bold rounded-xl hover:shadow-lg hover:scale-105 transition-all"
          >
            Select Your Domain
            <ArrowRight className="h-4 w-4" />
          </Link>
        </section>
      </div>
    </div>
  );
}
