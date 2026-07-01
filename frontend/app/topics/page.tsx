import { Metadata } from "next";
import Link from "next/link";
import {
  Home,
  ChevronRight,
  ArrowRight,
  BookOpen,
  Layers,
  Network,
  Database,
  Globe,
  Shield,
  Cpu,
  Workflow,
  Radio,
  GitBranch,
  Terminal,
  CheckCircle2,
  Gauge,
  Eye,
  Puzzle,
  Target,
} from "lucide-react";

export const revalidate = 3600;

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://interviewexplainer.com";

export const metadata: Metadata = {
  title:
    "Technical Concepts — System Design, Microservices, Caching & More | InterviewExplainer",
  description:
    "Browse interview questions by core concept. System design, microservices, distributed systems, caching, API design, concurrency — across all languages and levels.",
  alternates: { canonical: `${SITE_URL}/topics` },
};

const CATEGORIES = [
  {
    title: "Architecture & Design",
    desc: "How systems are structured, decomposed, and designed for scale",
    topics: [
      {
        slug: "system-design",
        name: "System Design",
        icon: Network,
        color: "text-emerald-600 dark:text-emerald-400",
        bg: "bg-emerald-100 dark:bg-emerald-950/30",
        desc: "Scalability, availability, consistency, load balancing, databases at scale",
        subtopics: ["Horizontal scaling", "CAP trade-offs", "Database sharding", "Caching layers"],
        frequency: "Very High",
      },
      {
        slug: "microservices",
        name: "Microservices",
        icon: Layers,
        color: "text-violet-600 dark:text-violet-400",
        bg: "bg-violet-100 dark:bg-violet-950/30",
        desc: "Service decomposition, communication patterns, sagas, service mesh",
        subtopics: ["Service discovery", "API gateway", "Saga pattern", "Circuit breaker"],
        frequency: "High",
      },
      {
        slug: "distributed-systems",
        name: "Distributed Systems",
        icon: GitBranch,
        color: "text-blue-600 dark:text-blue-400",
        bg: "bg-blue-100 dark:bg-blue-950/30",
        desc: "CAP theorem, consensus, replication, fault tolerance, CRDTs",
        subtopics: ["Raft consensus", "Leader election", "Replication strategies", "Partition handling"],
        frequency: "High",
      },
      {
        slug: "event-driven-architecture",
        name: "Event-Driven Architecture",
        icon: Radio,
        color: "text-amber-600 dark:text-amber-400",
        bg: "bg-amber-100 dark:bg-amber-950/30",
        desc: "Events, commands, CQRS, event sourcing, outbox pattern",
        subtopics: ["Event sourcing", "CQRS", "Outbox pattern", "Idempotency"],
        frequency: "Medium",
      },
      {
        slug: "clean-architecture",
        name: "Clean Architecture",
        icon: Puzzle,
        color: "text-indigo-600",
        bg: "bg-indigo-100 dark:bg-indigo-950/30",
        desc: "Hexagonal, onion, dependency rule, ports and adapters",
        subtopics: ["Dependency inversion", "Ports & adapters", "Domain layer", "Use cases"],
        frequency: "Medium",
      },
      {
        slug: "domain-driven-design",
        name: "Domain-Driven Design",
        icon: Target,
        color: "text-rose-600 dark:text-rose-400",
        bg: "bg-rose-100 dark:bg-rose-950/30",
        desc: "Entities, value objects, aggregates, bounded contexts, ubiquitous language",
        subtopics: ["Aggregates", "Bounded contexts", "Domain events", "Anti-corruption layer"],
        frequency: "Medium",
      },
    ],
  },
  {
    title: "Data & Storage",
    desc: "Databases, caching, and data management patterns",
    topics: [
      {
        slug: "databases",
        name: "Databases",
        icon: Database,
        color: "text-emerald-600 dark:text-emerald-400",
        bg: "bg-emerald-100 dark:bg-emerald-950/30",
        desc: "ACID, indexes, query optimization, sharding, replication",
        subtopics: ["B-tree indexes", "Query planning", "Normalization", "Transactions"],
        frequency: "Very High",
      },
      {
        slug: "caching",
        name: "Caching",
        icon: Cpu,
        color: "text-amber-600 dark:text-amber-400",
        bg: "bg-amber-100 dark:bg-amber-950/30",
        desc: "Cache strategies, eviction policies, invalidation, distributed caching",
        subtopics: ["Write-through", "Cache-aside", "TTL strategies", "Cache stampede"],
        frequency: "Very High",
      },
      {
        slug: "cap-theorem",
        name: "CAP Theorem",
        icon: GitBranch,
        color: "text-violet-600 dark:text-violet-400",
        bg: "bg-violet-100 dark:bg-violet-950/30",
        desc: "Consistency, availability, partition tolerance — trade-offs explained with real systems",
        subtopics: ["CP systems", "AP systems", "PACELC", "Eventual consistency"],
        frequency: "High",
      },
    ],
  },
  {
    title: "APIs & Communication",
    desc: "How services communicate and expose functionality",
    topics: [
      {
        slug: "api-design",
        name: "API Design",
        icon: Globe,
        color: "text-cyan-600",
        bg: "bg-cyan-100 dark:bg-cyan-950/30",
        desc: "REST, GraphQL, gRPC, versioning, rate limiting, documentation",
        subtopics: ["REST maturity model", "GraphQL vs REST", "API versioning", "OpenAPI/Swagger"],
        frequency: "Very High",
      },
      {
        slug: "concurrency",
        name: "Concurrency",
        icon: Workflow,
        color: "text-blue-600 dark:text-blue-400",
        bg: "bg-blue-100 dark:bg-blue-950/30",
        desc: "Threads, async/await, locks, deadlocks, actors, reactive programming",
        subtopics: ["Thread pools", "Lock-free structures", "Deadlock detection", "Async patterns"],
        frequency: "High",
      },
    ],
  },
  {
    title: "Security & Reliability",
    desc: "Protecting systems and ensuring they stay up",
    topics: [
      {
        slug: "security",
        name: "Security",
        icon: Shield,
        color: "text-red-600",
        bg: "bg-red-100 dark:bg-red-950/30",
        desc: "Authentication, authorization, OAuth2, JWT, HTTPS, secrets management",
        subtopics: ["OAuth2 flows", "JWT vs sessions", "CORS", "SQL injection prevention"],
        frequency: "High",
      },
      {
        slug: "observability",
        name: "Observability",
        icon: Eye,
        color: "text-muted-foreground",
        bg: "bg-surface",
        desc: "Metrics, logs, traces, alerting, OpenTelemetry, dashboards",
        subtopics: ["Three pillars", "Distributed tracing", "SLI/SLO/SLA", "Alerting strategies"],
        frequency: "Medium",
      },
    ],
  },
  {
    title: "Engineering Practices",
    desc: "Development workflows, testing, and operational excellence",
    topics: [
      {
        slug: "devops",
        name: "DevOps",
        icon: Terminal,
        color: "text-muted-foreground",
        bg: "bg-slate-200 dark:bg-slate-800",
        desc: "CI/CD, infrastructure as code, monitoring, SRE, on-call practices",
        subtopics: ["CI/CD pipelines", "GitOps", "Blue-green deploys", "Canary releases"],
        frequency: "High",
      },
      {
        slug: "testing",
        name: "Testing",
        icon: CheckCircle2,
        color: "text-teal-600",
        bg: "bg-teal-100 dark:bg-teal-950/20",
        desc: "Unit, integration, contract, e2e, TDD, test pyramids",
        subtopics: ["Test pyramid", "Mocking strategies", "Contract testing", "TDD workflow"],
        frequency: "High",
      },
      {
        slug: "performance",
        name: "Performance",
        icon: Gauge,
        color: "text-orange-600 dark:text-orange-400",
        bg: "bg-orange-100 dark:bg-orange-950/20",
        desc: "Profiling, bottlenecks, JVM tuning, async patterns, batching",
        subtopics: ["Flame graphs", "Connection pooling", "N+1 queries", "Lazy loading"],
        frequency: "Medium",
      },
    ],
  },
];

const FREQUENCY_COLORS: Record<string, string> = {
  "Very High": "bg-red-100 dark:bg-red-950/20 text-red-700 dark:text-red-400",
  High: "bg-amber-100 dark:bg-amber-950/20 text-amber-700 dark:text-amber-400",
  Medium: "bg-blue-100 dark:bg-blue-950/20 text-blue-700 dark:text-blue-400",
};

const totalTopics = CATEGORIES.reduce(
  (sum, cat) => sum + cat.topics.length,
  0,
);

export default function TopicsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 dark:from-slate-950/40 via-violet-50/20 dark:via-violet-950/40 to-indigo-50/20 dark:to-indigo-950/40 font-sans text-foreground selection:bg-violet-200  ">
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
          <span className="text-muted-foreground font-medium">Topics & Concepts</span>
        </nav>

        {/* Hero */}
        <header className="mb-12 rounded-xl border border-border bg-background/90 backdrop-blur-sm shadow-lg overflow-hidden">
          <div className="relative px-8 py-8 bg-gradient-to-br from-violet-50 dark:from-violet-950/40 via-purple-50 dark:via-purple-950/40 to-indigo-50 dark:to-indigo-950/40  ">
            <div className="flex items-center gap-2 mb-3">
              <BookOpen className="h-5 w-5 text-violet-600 dark:text-violet-400" />
              <span className="text-[10px] font-bold uppercase tracking-widest text-violet-600 dark:text-violet-400">
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
                <div className="w-10 h-10 rounded-lg bg-violet-100 dark:bg-violet-950/20 flex items-center justify-center">
                  <Layers className="h-5 w-5 text-violet-600 dark:text-violet-400" />
                </div>
                <div>
                  <div className="text-xs text-muted-foreground font-medium">
                    Topics
                  </div>
                  <div className="text-lg font-bold text-foreground">
                    {totalTopics}
                  </div>
                </div>
              </div>
              <div className="h-10 w-px bg-slate-200 dark:bg-slate-800" />
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 rounded-lg bg-purple-100 dark:bg-purple-950/20 flex items-center justify-center">
                  <BookOpen className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                </div>
                <div>
                  <div className="text-xs text-muted-foreground font-medium">
                    Categories
                  </div>
                  <div className="text-lg font-bold text-foreground">
                    {CATEGORIES.length}
                  </div>
                </div>
              </div>
              <div className="h-10 w-px bg-slate-200 dark:bg-slate-800" />
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 rounded-lg bg-indigo-100 dark:bg-indigo-950/20 flex items-center justify-center">
                  <Globe className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
                </div>
                <div>
                  <div className="text-xs text-muted-foreground font-medium">
                    Language-Agnostic
                  </div>
                  <div className="text-lg font-bold text-foreground">Yes</div>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Topic Sections */}
        {CATEGORIES.map((category) => (
          <section key={category.title} className="mb-10">
            <div className="flex items-center gap-2 mb-1.5">
              <h2 className="text-xl font-black text-foreground">
                {category.title}
              </h2>
            </div>
            <p className="text-sm text-muted-foreground mb-5">{category.desc}</p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {category.topics.map((topic) => (
                <Link
                  key={topic.slug}
                  href={`/topics/${topic.slug}`}
                  className="group rounded-xl border border-border bg-background shadow-sm hover:shadow-md hover:border-violet-300 dark:border-violet-500/30 transition-all p-5"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div
                      className={`w-10 h-10 rounded-lg ${topic.bg} flex items-center justify-center group-hover:scale-105 transition-transform`}
                    >
                      <topic.icon className={`h-5 w-5 ${topic.color}`} />
                    </div>
                    <div className="flex items-center gap-2">
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${FREQUENCY_COLORS[topic.frequency]}`}
                      >
                        {topic.frequency}
                      </span>
                      <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-violet-500 dark:text-violet-400 group-hover:translate-x-1 transition-all" />
                    </div>
                  </div>

                  <h3 className="text-[15px] font-bold text-foreground group-hover:text-violet-600 dark:text-violet-400 transition-colors mb-1.5">
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
              ))}
            </div>
          </section>
        ))}

        {/* Cross-reference CTA */}
        <section className="rounded-xl border border-violet-200 dark:border-violet-500/20 bg-gradient-to-r from-violet-50 dark:from-violet-950/40 to-purple-50 dark:to-purple-950/40 p-8 text-center mb-12  ">
          <h2 className="text-2xl font-black text-foreground mb-3">
            Learn Concepts in Context
          </h2>
          <p className="text-sm text-muted-foreground mb-6 max-w-xl mx-auto">
            Every topic appears in your domain prep dashboard. Select your tech
            stack and get these concepts mapped to your interview path — with
            progress tracking and related Q&A.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link
              href="/domains"
              className="inline-flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-violet-600 to-purple-600 text-white font-bold rounded-xl hover:shadow-lg hover:scale-105 transition-all"
            >
              Select Your Domain
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href="/system-design"
              className="inline-flex items-center gap-2 px-8 py-3 bg-background border border-border text-foreground font-bold rounded-xl hover:shadow-md hover:border-violet-300 dark:border-violet-500/30 transition-all"
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
