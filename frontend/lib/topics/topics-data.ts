/**
 * Phase 13 — Topics V2 canonical data.
 *
 * The cross-language technical-concepts catalog, hoisted verbatim from
 * app/topics/page.tsx (hub) and app/topics/[concept]/page.tsx (concept
 * detail). Icon components are represented as TopicIconKey tokens so this
 * module stays a pure data layer; the component maps tokens → lucide icons.
 */

import type {
  TopicCategory,
  TopicConceptMeta,
  TopicConceptPageData,
  TopicTrackRef,
} from "./topics-types";

/** Topic categories shown on the /topics hub. */
export const TOPIC_CATEGORIES: TopicCategory[] = [
  {
    title: "Architecture & Design",
    desc: "How systems are structured, decomposed, and designed for scale",
    topics: [
      {
        slug: "system-design",
        name: "System Design",
        iconKey: "network",
        color: "text-emerald-600 dark:text-emerald-400",
        bg: "bg-emerald-100 dark:bg-emerald-950/30",
        desc: "Scalability, availability, consistency, load balancing, databases at scale",
        subtopics: ["Horizontal scaling", "CAP trade-offs", "Database sharding", "Caching layers"],
        frequency: "Very High",
      },
      {
        slug: "microservices",
        name: "Microservices",
        iconKey: "layers",
        color: "text-blue-600 dark:text-blue-400",
        bg: "bg-blue-100 dark:bg-blue-950/30",
        desc: "Service decomposition, communication patterns, sagas, service mesh",
        subtopics: ["Service discovery", "API gateway", "Saga pattern", "Circuit breaker"],
        frequency: "High",
      },
      {
        slug: "distributed-systems",
        name: "Distributed Systems",
        iconKey: "git-branch",
        color: "text-primary dark:text-primary",
        bg: "bg-blue-100 dark:bg-blue-950/30",
        desc: "CAP theorem, consensus, replication, fault tolerance, CRDTs",
        subtopics: ["Raft consensus", "Leader election", "Replication strategies", "Partition handling"],
        frequency: "High",
      },
      {
        slug: "event-driven-architecture",
        name: "Event-Driven Architecture",
        iconKey: "radio",
        color: "text-amber-600 dark:text-amber-400",
        bg: "bg-amber-100 dark:bg-amber-950/30",
        desc: "Events, commands, CQRS, event sourcing, outbox pattern",
        subtopics: ["Event sourcing", "CQRS", "Outbox pattern", "Idempotency"],
        frequency: "Medium",
      },
      {
        slug: "clean-architecture",
        name: "Clean Architecture",
        iconKey: "puzzle",
        color: "text-primary",
        bg: "bg-blue-100 dark:bg-blue-950/30",
        desc: "Hexagonal, onion, dependency rule, ports and adapters",
        subtopics: ["Dependency inversion", "Ports & adapters", "Domain layer", "Use cases"],
        frequency: "Medium",
      },
      {
        slug: "domain-driven-design",
        name: "Domain-Driven Design",
        iconKey: "target",
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
        iconKey: "database",
        color: "text-emerald-600 dark:text-emerald-400",
        bg: "bg-emerald-100 dark:bg-emerald-950/30",
        desc: "ACID, indexes, query optimization, sharding, replication",
        subtopics: ["B-tree indexes", "Query planning", "Normalization", "Transactions"],
        frequency: "Very High",
      },
      {
        slug: "caching",
        name: "Caching",
        iconKey: "cpu",
        color: "text-amber-600 dark:text-amber-400",
        bg: "bg-amber-100 dark:bg-amber-950/30",
        desc: "Cache strategies, eviction policies, invalidation, distributed caching",
        subtopics: ["Write-through", "Cache-aside", "TTL strategies", "Cache stampede"],
        frequency: "Very High",
      },
      {
        slug: "cap-theorem",
        name: "CAP Theorem",
        iconKey: "git-branch",
        color: "text-blue-600 dark:text-blue-400",
        bg: "bg-blue-100 dark:bg-blue-950/30",
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
        iconKey: "globe",
        color: "text-primary",
        bg: "bg-cyan-100 dark:bg-cyan-950/30",
        desc: "REST, GraphQL, gRPC, versioning, rate limiting, documentation",
        subtopics: ["REST maturity model", "GraphQL vs REST", "API versioning", "OpenAPI/Swagger"],
        frequency: "Very High",
      },
      {
        slug: "concurrency",
        name: "Concurrency",
        iconKey: "workflow",
        color: "text-primary dark:text-primary",
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
        iconKey: "shield",
        color: "text-red-600",
        bg: "bg-red-100 dark:bg-red-950/30",
        desc: "Authentication, authorization, OAuth2, JWT, HTTPS, secrets management",
        subtopics: ["OAuth2 flows", "JWT vs sessions", "CORS", "SQL injection prevention"],
        frequency: "High",
      },
      {
        slug: "observability",
        name: "Observability",
        iconKey: "eye",
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
        iconKey: "terminal",
        color: "text-muted-foreground",
        bg: "bg-slate-200 dark:bg-slate-800",
        desc: "CI/CD, infrastructure as code, monitoring, SRE, on-call practices",
        subtopics: ["CI/CD pipelines", "GitOps", "Blue-green deploys", "Canary releases"],
        frequency: "High",
      },
      {
        slug: "testing",
        name: "Testing",
        iconKey: "check-circle",
        color: "text-teal-600",
        bg: "bg-teal-100 dark:bg-teal-950/20",
        desc: "Unit, integration, contract, e2e, TDD, test pyramids",
        subtopics: ["Test pyramid", "Mocking strategies", "Contract testing", "TDD workflow"],
        frequency: "High",
      },
      {
        slug: "performance",
        name: "Performance",
        iconKey: "gauge",
        color: "text-orange-600 dark:text-orange-400",
        bg: "bg-orange-100 dark:bg-orange-950/20",
        desc: "Profiling, bottlenecks, JVM tuning, async patterns, batching",
        subtopics: ["Flame graphs", "Connection pooling", "N+1 queries", "Lazy loading"],
        frequency: "Medium",
      },
    ],
  },
];

/** Frequency → tailwind badge classes (matches the original hub). */
export const FREQUENCY_COLORS: Record<string, string> = {
  "Very High": "bg-red-100 dark:bg-red-950/20 text-red-700 dark:text-red-400",
  High: "bg-amber-100 dark:bg-amber-950/20 text-amber-700 dark:text-amber-400",
  Medium: "bg-blue-100 dark:bg-blue-950/20 text-primary dark:text-primary",
};

/** Per-concept detail metadata (hoisted from app/topics/[concept]/page.tsx). */
export const TOPIC_CONCEPT_META: Record<
  string,
  TopicConceptMeta
> = {
  "system-design": {
    name: "System Design",
    desc: "Architecture interviews: scalability, availability, consistency, databases, caching, messaging, APIs. The senior engineer's domain.",
    tracks: [
      { lang: "java", track: "backend", level: "intermediate", stack: "system-design", label: "Java Backend System Design" },
      { lang: "java", track: "backend", level: "advanced", stack: "system-design", label: "Java Backend System Design (Advanced)" },
    ],
    tools: ["kafka", "redis", "postgresql", "docker", "kubernetes"],
    comparisons: ["microservices-vs-monolith", "sql-vs-nosql", "rest-vs-graphql"],
  },
  microservices: {
    name: "Microservices",
    desc: "Service decomposition, inter-service communication, service discovery, distributed tracing, saga patterns, and when NOT to use microservices.",
    tracks: [
      { lang: "java", track: "backend", level: "intermediate", stack: "microservices", label: "Java Microservices — Intermediate" },
      { lang: "java", track: "backend", level: "advanced", stack: "microservices", label: "Java Microservices — Advanced" },
    ],
    comparisons: ["microservices-vs-monolith"],
  },
  "event-driven-architecture": {
    name: "Event-Driven Architecture",
    desc: "Events, commands, publishers, consumers, event sourcing, CQRS, outbox pattern, eventual consistency.",
    tracks: [
      { lang: "java", track: "backend", level: "intermediate", stack: "kafka", label: "Java Kafka (Event-Driven)" },
    ],
    tools: ["kafka", "rabbitmq"],
    comparisons: ["kafka-vs-rabbitmq"],
  },
  caching: {
    name: "Caching",
    desc: "Cache strategies (write-through, write-behind, read-through), eviction policies, cache invalidation, distributed caching, Redis patterns.",
    tracks: [
      { lang: "java", track: "backend", level: "intermediate", stack: "redis", label: "Java Redis Caching" },
    ],
    tools: ["redis"],
    comparisons: ["redis-vs-memcached"],
  },
};

/** Title-case a slug, e.g. "system-design" → "System Design". */
export function topicToTitle(s: string): string {
  return s
    .replace(/-/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

/** Total number of topics across all categories. */
export function totalTopicCount(): number {
  return TOPIC_CATEGORIES.reduce((sum, cat) => sum + cat.topics.length, 0);
}

/** All topic slugs (for generateStaticParams if ever needed). */
export function allTopicSlugs(): string[] {
  return TOPIC_CATEGORIES.flatMap((c) => c.topics.map((t) => t.slug));
}

/** Load the per-concept page payload. */
export function loadTopicConcept(concept: string): TopicConceptPageData {
  const meta = TOPIC_CONCEPT_META[concept] ?? null;
  const name = meta?.name ?? topicToTitle(concept);
  return { concept, name, meta };
}

/** Resolve a track ref to its /interview/<lang>/<track>/<level>/<stack> href. */
export function trackHref(t: TopicTrackRef): string {
  return `/interview/${t.lang}/${t.track}/${t.level}/${t.stack}`;
}
