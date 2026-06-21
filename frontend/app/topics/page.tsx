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
        color: "text-emerald-600",
        bg: "bg-emerald-100",
        desc: "Scalability, availability, consistency, load balancing, databases at scale",
        subtopics: ["Horizontal scaling", "CAP trade-offs", "Database sharding", "Caching layers"],
        frequency: "Very High",
      },
      {
        slug: "microservices",
        name: "Microservices",
        icon: Layers,
        color: "text-violet-600",
        bg: "bg-violet-100",
        desc: "Service decomposition, communication patterns, sagas, service mesh",
        subtopics: ["Service discovery", "API gateway", "Saga pattern", "Circuit breaker"],
        frequency: "High",
      },
      {
        slug: "distributed-systems",
        name: "Distributed Systems",
        icon: GitBranch,
        color: "text-blue-600",
        bg: "bg-blue-100",
        desc: "CAP theorem, consensus, replication, fault tolerance, CRDTs",
        subtopics: ["Raft consensus", "Leader election", "Replication strategies", "Partition handling"],
        frequency: "High",
      },
      {
        slug: "event-driven-architecture",
        name: "Event-Driven Architecture",
        icon: Radio,
        color: "text-amber-600",
        bg: "bg-amber-100",
        desc: "Events, commands, CQRS, event sourcing, outbox pattern",
        subtopics: ["Event sourcing", "CQRS", "Outbox pattern", "Idempotency"],
        frequency: "Medium",
      },
      {
        slug: "clean-architecture",
        name: "Clean Architecture",
        icon: Puzzle,
        color: "text-indigo-600",
        bg: "bg-indigo-100",
        desc: "Hexagonal, onion, dependency rule, ports and adapters",
        subtopics: ["Dependency inversion", "Ports & adapters", "Domain layer", "Use cases"],
        frequency: "Medium",
      },
      {
        slug: "domain-driven-design",
        name: "Domain-Driven Design",
        icon: Target,
        color: "text-rose-600",
        bg: "bg-rose-100",
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
        color: "text-emerald-600",
        bg: "bg-emerald-100",
        desc: "ACID, indexes, query optimization, sharding, replication",
        subtopics: ["B-tree indexes", "Query planning", "Normalization", "Transactions"],
        frequency: "Very High",
      },
      {
        slug: "caching",
        name: "Caching",
        icon: Cpu,
        color: "text-amber-600",
        bg: "bg-amber-100",
        desc: "Cache strategies, eviction policies, invalidation, distributed caching",
        subtopics: ["Write-through", "Cache-aside", "TTL strategies", "Cache stampede"],
        frequency: "Very High",
      },
      {
        slug: "cap-theorem",
        name: "CAP Theorem",
        icon: GitBranch,
        color: "text-violet-600",
        bg: "bg-violet-100",
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
        bg: "bg-cyan-100",
        desc: "REST, GraphQL, gRPC, versioning, rate limiting, documentation",
        subtopics: ["REST maturity model", "GraphQL vs REST", "API versioning", "OpenAPI/Swagger"],
        frequency: "Very High",
      },
      {
        slug: "concurrency",
        name: "Concurrency",
        icon: Workflow,
        color: "text-blue-600",
        bg: "bg-blue-100",
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
        bg: "bg-red-100",
        desc: "Authentication, authorization, OAuth2, JWT, HTTPS, secrets management",
        subtopics: ["OAuth2 flows", "JWT vs sessions", "CORS", "SQL injection prevention"],
        frequency: "High",
      },
      {
        slug: "observability",
        name: "Observability",
        icon: Eye,
        color: "text-slate-600",
        bg: "bg-slate-100",
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
        color: "text-slate-600",
        bg: "bg-slate-200",
        desc: "CI/CD, infrastructure as code, monitoring, SRE, on-call practices",
        subtopics: ["CI/CD pipelines", "GitOps", "Blue-green deploys", "Canary releases"],
        frequency: "High",
      },
      {
        slug: "testing",
        name: "Testing",
        icon: CheckCircle2,
        color: "text-teal-600",
        bg: "bg-teal-100",
        desc: "Unit, integration, contract, e2e, TDD, test pyramids",
        subtopics: ["Test pyramid", "Mocking strategies", "Contract testing", "TDD workflow"],
        frequency: "High",
      },
      {
        slug: "performance",
        name: "Performance",
        icon: Gauge,
        color: "text-orange-600",
        bg: "bg-orange-100",
        desc: "Profiling, bottlenecks, JVM tuning, async patterns, batching",
        subtopics: ["Flame graphs", "Connection pooling", "N+1 queries", "Lazy loading"],
        frequency: "Medium",
      },
    ],
  },
];

const FREQUENCY_COLORS: Record<string, string> = {
  "Very High": "bg-red-100 text-red-700",
  High: "bg-amber-100 text-amber-700",
  Medium: "bg-blue-100 text-blue-700",
};

const totalTopics = CATEGORIES.reduce(
  (sum, cat) => sum + cat.topics.length,
  0,
);

export default function TopicsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-violet-50/20 to-indigo-50/20 font-sans text-slate-800 selection:bg-violet-200">
      <div className="w-full min-w-0 px-6 py-8">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-1.5 text-xs text-slate-400 mb-8">
          <Link
            href="/"
            className="hover:text-slate-600 flex items-center gap-1"
          >
            <Home className="h-3 w-3" /> Home
          </Link>
          <ChevronRight className="h-3 w-3" />
          <span className="text-slate-600 font-medium">Topics & Concepts</span>
        </nav>

        {/* Hero */}
        <header className="mb-12 rounded-xl border border-slate-200 bg-white/90 backdrop-blur-sm shadow-lg overflow-hidden">
          <div className="relative px-8 py-8 bg-gradient-to-br from-violet-50 via-purple-50 to-indigo-50">
            <div className="flex items-center gap-2 mb-3">
              <BookOpen className="h-5 w-5 text-violet-600" />
              <span className="text-[10px] font-bold uppercase tracking-widest text-violet-600">
                Cross-Language Concepts
              </span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-slate-900 mb-3">
              Topics & Technical Concepts
            </h1>
            <p className="text-sm sm:text-base text-slate-600 leading-relaxed max-w-3xl">
              Core technical concepts that come up in every interview, across
              all languages and tracks. Each topic aggregates questions from
              every relevant domain — so whether you&apos;re a Java backend
              engineer or a Python ML developer, you get concept-level mastery
              that transfers everywhere.
            </p>
          </div>
          <div className="px-8 py-4 bg-gradient-to-r from-slate-50 to-white border-t border-slate-200">
            <div className="flex items-center gap-6 flex-wrap">
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 rounded-lg bg-violet-100 flex items-center justify-center">
                  <Layers className="h-5 w-5 text-violet-600" />
                </div>
                <div>
                  <div className="text-xs text-slate-500 font-medium">
                    Topics
                  </div>
                  <div className="text-lg font-bold text-slate-900">
                    {totalTopics}
                  </div>
                </div>
              </div>
              <div className="h-10 w-px bg-slate-200" />
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 rounded-lg bg-purple-100 flex items-center justify-center">
                  <BookOpen className="h-5 w-5 text-purple-600" />
                </div>
                <div>
                  <div className="text-xs text-slate-500 font-medium">
                    Categories
                  </div>
                  <div className="text-lg font-bold text-slate-900">
                    {CATEGORIES.length}
                  </div>
                </div>
              </div>
              <div className="h-10 w-px bg-slate-200" />
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 rounded-lg bg-indigo-100 flex items-center justify-center">
                  <Globe className="h-5 w-5 text-indigo-600" />
                </div>
                <div>
                  <div className="text-xs text-slate-500 font-medium">
                    Language-Agnostic
                  </div>
                  <div className="text-lg font-bold text-slate-900">Yes</div>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Topic Sections */}
        {CATEGORIES.map((category) => (
          <section key={category.title} className="mb-10">
            <div className="flex items-center gap-2 mb-1.5">
              <h2 className="text-xl font-black text-slate-900">
                {category.title}
              </h2>
            </div>
            <p className="text-sm text-slate-500 mb-5">{category.desc}</p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {category.topics.map((topic) => (
                <Link
                  key={topic.slug}
                  href={`/topics/${topic.slug}`}
                  className="group rounded-xl border border-slate-200 bg-white shadow-sm hover:shadow-md hover:border-violet-300 transition-all p-5"
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
                      <ArrowRight className="h-4 w-4 text-slate-300 group-hover:text-violet-500 group-hover:translate-x-1 transition-all" />
                    </div>
                  </div>

                  <h3 className="text-[15px] font-bold text-slate-900 group-hover:text-violet-600 transition-colors mb-1.5">
                    {topic.name}
                  </h3>
                  <p className="text-xs text-slate-500 leading-relaxed mb-3">
                    {topic.desc}
                  </p>

                  <div className="flex flex-wrap gap-1.5 pt-3 border-t border-slate-100">
                    {topic.subtopics.map((sub) => (
                      <span
                        key={sub}
                        className="text-[10px] font-medium text-slate-500 bg-slate-50 px-2 py-0.5 rounded-md"
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
        <section className="rounded-xl border border-violet-200 bg-gradient-to-r from-violet-50 to-purple-50 p-8 text-center mb-12">
          <h2 className="text-2xl font-black text-slate-900 mb-3">
            Learn Concepts in Context
          </h2>
          <p className="text-sm text-slate-600 mb-6 max-w-xl mx-auto">
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
              className="inline-flex items-center gap-2 px-8 py-3 bg-white border border-slate-200 text-slate-700 font-bold rounded-xl hover:shadow-md hover:border-violet-300 transition-all"
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
