import { Metadata } from "next";
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
} from "lucide-react";

export const revalidate = 3600;

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://interviewexplainer.com";

export const metadata: Metadata = {
  title:
    "Interview Cheatsheets — Java, Python, SQL, System Design & More",
  description:
    "Quick reference cheatsheets for tech interviews. Java collections, Python data structures, SQL joins, system design patterns, Big-O complexity, Git commands, Docker, Kubernetes, and more. Print-friendly, interview-focused.",
  alternates: { canonical: `${SITE_URL}/cheatsheets` },
};

const LANGUAGE_CHEATSHEETS = [
  {
    slug: "java",
    name: "Java",
    desc: "Collections framework, Stream API, concurrency, design patterns, JVM internals, Spring Boot annotations",
    items: 8,
    color: "text-orange-600 dark:text-orange-400",
    bg: "bg-orange-100 dark:bg-orange-950/20",
    icon: Code2,
  },
  {
    slug: "python",
    name: "Python",
    desc: "Data structures, list comprehensions, decorators, generators, async/await, Django/FastAPI shortcuts",
    items: 7,
    color: "text-blue-600 dark:text-blue-400",
    bg: "bg-blue-100 dark:bg-blue-950/20",
    icon: Code2,
  },
  {
    slug: "javascript",
    name: "JavaScript / TypeScript",
    desc: "Closures, prototypes, promises, async patterns, React hooks, TypeScript utility types, Node.js essentials",
    items: 6,
    color: "text-yellow-600",
    bg: "bg-yellow-100 dark:bg-yellow-950/20",
    icon: Code2,
  },
  {
    slug: "go",
    name: "Go",
    desc: "Goroutines, channels, interfaces, error handling, context package, testing patterns, module system",
    items: 5,
    color: "text-cyan-600",
    bg: "bg-cyan-100 dark:bg-cyan-950/20",
    icon: Code2,
  },
  {
    slug: "sql",
    name: "SQL",
    desc: "JOIN types, window functions, CTEs, indexing strategies, query optimization, transaction isolation levels",
    items: 6,
    color: "text-emerald-600 dark:text-emerald-400",
    bg: "bg-emerald-100 dark:bg-emerald-950/20",
    icon: Database,
  },
];

const CONCEPT_CHEATSHEETS = [
  {
    slug: "system-design",
    name: "System Design Patterns",
    desc: "CAP theorem, consistency models, partitioning strategies, caching patterns, database selection flowchart",
    icon: Network,
    color: "text-emerald-600 dark:text-emerald-400",
    bg: "bg-emerald-100 dark:bg-emerald-950/20",
  },
  {
    slug: "big-o",
    name: "Big-O Complexity",
    desc: "Time and space complexity for all data structures and algorithms. Sorting comparisons, amortized analysis",
    icon: Cpu,
    color: "text-violet-600 dark:text-violet-400",
    bg: "bg-violet-100 dark:bg-violet-950/20",
  },
  {
    slug: "data-structures",
    name: "Data Structures",
    desc: "Arrays, linked lists, trees, graphs, heaps, tries, hash maps — operations, complexities, when to use what",
    icon: Layers,
    color: "text-blue-600 dark:text-blue-400",
    bg: "bg-blue-100 dark:bg-blue-950/20",
  },
  {
    slug: "design-patterns",
    name: "Design Patterns",
    desc: "Singleton, Factory, Observer, Strategy, Builder, Decorator — when to use each with real-world examples",
    icon: Workflow,
    color: "text-indigo-600",
    bg: "bg-indigo-100 dark:bg-indigo-950/20",
  },
  {
    slug: "api-design",
    name: "API Design",
    desc: "REST conventions, HTTP status codes, pagination, versioning, error responses, rate limiting headers",
    icon: Globe,
    color: "text-rose-600 dark:text-rose-400",
    bg: "bg-rose-100 dark:bg-rose-950/20",
  },
  {
    slug: "http-status-codes",
    name: "HTTP Status Codes",
    desc: "Complete reference: 2xx success, 3xx redirect, 4xx client error, 5xx server error with when-to-use guide",
    icon: Server,
    color: "text-amber-600 dark:text-amber-400",
    bg: "bg-amber-100 dark:bg-amber-950/20",
  },
];

const TOOL_CHEATSHEETS = [
  {
    slug: "git",
    name: "Git Commands",
    desc: "Branch, merge, rebase, cherry-pick, stash, bisect, reflog — the commands you need in interviews and daily work",
    icon: GitBranch,
    color: "text-orange-600 dark:text-orange-400",
    bg: "bg-orange-100 dark:bg-orange-950/20",
  },
  {
    slug: "docker",
    name: "Docker",
    desc: "Dockerfile best practices, multi-stage builds, docker-compose, networking, volume mounts, common commands",
    icon: Container,
    color: "text-blue-600 dark:text-blue-400",
    bg: "bg-blue-100 dark:bg-blue-950/20",
  },
  {
    slug: "kubernetes",
    name: "Kubernetes",
    desc: "Pods, services, deployments, configmaps, secrets, ingress, kubectl commands, YAML templates",
    icon: Cloud,
    color: "text-indigo-600",
    bg: "bg-indigo-100 dark:bg-indigo-950/20",
  },
  {
    slug: "linux",
    name: "Linux / Shell",
    desc: "File operations, process management, networking commands, permissions, piping, grep, awk, sed essentials",
    icon: Terminal,
    color: "text-muted-foreground",
    bg: "bg-surface",
  },
  {
    slug: "aws",
    name: "AWS Services",
    desc: "EC2, S3, Lambda, RDS, DynamoDB, SQS, SNS, CloudFront — when to use what, pricing traps, interview favorites",
    icon: Cloud,
    color: "text-amber-600 dark:text-amber-400",
    bg: "bg-amber-100 dark:bg-amber-950/20",
  },
  {
    slug: "security",
    name: "Security Essentials",
    desc: "OAuth 2.0 flows, JWT structure, HTTPS/TLS, CORS, XSS/CSRF prevention, encryption basics",
    icon: Shield,
    color: "text-red-600 dark:text-red-400",
    bg: "bg-red-100 dark:bg-red-950/20",
  },
];

const totalSheets =
  LANGUAGE_CHEATSHEETS.length +
  CONCEPT_CHEATSHEETS.length +
  TOOL_CHEATSHEETS.length;

export default function CheatsheetsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-yellow-50/20 to-amber-50/20 font-sans text-foreground selection:bg-yellow-200">
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
          <div className="relative px-8 py-8 bg-gradient-to-br from-yellow-50 via-amber-50 to-orange-50">
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
          <div className="px-8 py-4 bg-gradient-to-r from-slate-50 to-white dark:from-slate-900/40 dark:to-background border-t border-border">
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
                    {totalSheets}
                  </div>
                </div>
              </div>
              <div className="h-10 w-px bg-slate-200 dark:bg-slate-800" />
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
              <div className="h-10 w-px bg-slate-200 dark:bg-slate-800" />
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
            {LANGUAGE_CHEATSHEETS.map((sheet) => (
              <Link
                key={sheet.slug}
                href={`/cheatsheets/${sheet.slug}`}
                className="group rounded-xl border border-border bg-background shadow-sm hover:shadow-md hover:border-yellow-300 dark:border-yellow-700 transition-all p-5"
              >
                <div className="flex items-start justify-between mb-3">
                  <div
                    className={`w-10 h-10 rounded-lg ${sheet.bg} flex items-center justify-center group-hover:scale-105 transition-transform`}
                  >
                    <sheet.icon className={`h-5 w-5 ${sheet.color}`} />
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
            ))}
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
            {CONCEPT_CHEATSHEETS.map((sheet) => (
              <Link
                key={sheet.slug}
                href={`/cheatsheets/${sheet.slug}`}
                className="group rounded-xl border border-border bg-background shadow-sm hover:shadow-md hover:border-amber-300 dark:border-amber-500/30 transition-all p-5"
              >
                <div className="flex items-start justify-between mb-3">
                  <div
                    className={`w-10 h-10 rounded-lg ${sheet.bg} flex items-center justify-center group-hover:scale-105 transition-transform`}
                  >
                    <sheet.icon className={`h-5 w-5 ${sheet.color}`} />
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
            ))}
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
            {TOOL_CHEATSHEETS.map((sheet) => (
              <Link
                key={sheet.slug}
                href={`/cheatsheets/${sheet.slug}`}
                className="group rounded-xl border border-border bg-background shadow-sm hover:shadow-md hover:border-orange-300 dark:border-orange-700 transition-all p-5"
              >
                <div className="flex items-start justify-between mb-3">
                  <div
                    className={`w-10 h-10 rounded-lg ${sheet.bg} flex items-center justify-center group-hover:scale-105 transition-transform`}
                  >
                    <sheet.icon className={`h-5 w-5 ${sheet.color}`} />
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
            ))}
          </div>
        </section>

        {/* CTA */}
        <section className="rounded-xl border border-yellow-200 dark:border-yellow-500/20 bg-gradient-to-r from-yellow-50 to-amber-50 p-8 text-center mb-12">
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
            className="inline-flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-yellow-600 to-amber-600 text-white font-bold rounded-xl hover:shadow-lg hover:scale-105 transition-all"
          >
            Start Your Prep Path
            <ArrowRight className="h-4 w-4" />
          </Link>
        </section>
      </div>
    </div>
  );
}
