/**
 * seo-pillars.ts
 *
 * Pillar-level SEO landing pages ("prep categories") for Java backend prep.
 * Each entry below renders as a data-driven hub at `/{pillarSlug}` (rewritten
 * internally to `/prep/{pillarSlug}`). The module list, topics, and Q&A
 * counts are derived live from content/java-backend-intermediate/_index.json
 * and the per-topic complete-qa.json files — so adding or renaming anything
 * in the content layer shows up on every hub automatically.
 *
 * Why a curated registry (instead of auto-grouping by pillarName)?
 *   - URL slugs need to be memorable / keyword-rich (e.g. /cloud rather than
 *     /cloud-and-infrastructure). These are hand-picked for SEO.
 *   - A pillar hub can gather modules across multiple _index.json pillars
 *     (e.g. Security hub pulls P07 application-security *and* P02
 *     spring-security so users searching for "security interview questions"
 *     find both).
 *   - Each hub has a short, hand-authored `heroBlurb` — the one place we
 *     write custom copy. Everything else is derived.
 *
 * The "complete Java backend track" is surfaced on every hub via
 * COMPLETE_TRACK_CTA so users always see the upsell to the full suite.
 */

import {
  SEO_MODULES,
  type SeoModuleEntry,
} from "./seo-slugs";

// ─── Public types ────────────────────────────────────────────────────────────

export interface PillarHubEntry {
  /** Root URL slug, e.g. "cloud" (renders at /cloud). */
  pillarSlug: string;
  /** SEO page title (used in <title> and hero H1). */
  title: string;
  /** One-sentence tagline shown under the hero title. */
  tagline: string;
  /** Hand-authored hero paragraph (2-3 sentences, ~40-60 words). */
  heroBlurb: string;
  /**
   * Module slugs (App URL side, matches _index.json.modules[].moduleSlug)
   * that belong in this hub, in display order. Modules not present in
   * SEO_MODULES are silently skipped at render time.
   */
  moduleSlugs: string[];
  /** SEO meta description (≤ 160 chars). */
  metaDescription: string;
  /** Slugs of related pillar hubs — rendered as cross-links. */
  relatedPillars: string[];
}

/**
 * Soft cross-link rendered in the *footer* of every standalone pillar hub
 * and SEO module page — points users who want a structured roadmap to the
 * full Java backend track. Kept in the footer (not the hero) so each hub
 * reads as an independent topic, not an upsell page.
 */
export const COMPLETE_TRACK_CTA = {
  title: "Looking for a structured roadmap?",
  tagline:
    "Every module on this page is also part of the full Java backend interview track.",
  href: "/java-backend-intermediate",
  ctaLabel: "Open the full roadmap",
  secondaryHref: "/prep",
  secondaryLabel: "Browse all prep categories",
} as const;

/**
 * Pillar hubs where the topic is not Java-specific; CTAs and sidebar links
 * should not read as if the only “full track” were a Java curriculum.
 */
export const LANGUAGE_AGNOSTIC_PILLAR_SLUGS: ReadonlySet<string> = new Set([
  "system-design",
  "architecture-design",
  "low-level-design",
  "distributed-systems",
  "microservices-architecture",
]);

/** Neutral wording; still points at the flagship track for users who want order. */
export const COMPLETE_TRACK_CTA_LANGUAGE_AGNOSTIC = {
  title: "Want a guided curriculum order?",
  tagline:
    "These modules are also sequenced in our flagship backend interview track — open it when you prefer an ordered path instead of browsing by topic.",
  href: "/java-backend-intermediate",
  ctaLabel: "Open the guided track",
  secondaryHref: "/prep",
  secondaryLabel: "Browse all prep categories",
} as const;

export type CompleteTrackCta = typeof COMPLETE_TRACK_CTA | typeof COMPLETE_TRACK_CTA_LANGUAGE_AGNOSTIC;

export function completeTrackCtaForPillar(
  pillarSlug: string | null | undefined,
): CompleteTrackCta {
  if (pillarSlug && LANGUAGE_AGNOSTIC_PILLAR_SLUGS.has(pillarSlug)) {
    return COMPLETE_TRACK_CTA_LANGUAGE_AGNOSTIC;
  }
  return COMPLETE_TRACK_CTA;
}

export function isLanguageAgnosticPillarHub(pillarSlug: string): boolean {
  return LANGUAGE_AGNOSTIC_PILLAR_SLUGS.has(pillarSlug);
}

// ─── Registry ────────────────────────────────────────────────────────────────

export const PILLAR_HUBS: readonly PillarHubEntry[] = [
  {
    pillarSlug: "java",
    title: "Java Language & Core Interview Prep",
    tagline: "Core Java, Collections, Streams, Concurrency, JVM internals",
    heroBlurb:
      "Java Language & Core is the single most-asked topic in any Java backend interview. This hub brings together core OOP and generics, the collections and streams APIs, concurrency primitives and common pitfalls (deadlocks, race conditions, memory model), and JVM internals — memory layout, garbage collection tuning, and class loading — with interview-ready answers for every level.",
    moduleSlugs: [
      "core-java",
      "java-oop",
      "java-collections",
      "java-streams",
      "java-concurrency",
      "jvm-internals",
    ],
    metaDescription:
      "Java interview questions covering core Java, collections, streams, concurrency, and JVM internals. OOP, generics, deadlocks, GC, and memory model with structured answers.",
    relatedPillars: [
      "spring",
      "concurrency-multithreading",
      "java-testing",
    ],
  },
  {
    pillarSlug: "system-design",
    title: "System Design Interview Prep",
    tagline: "Fundamentals, building blocks, and real case studies",
    heroBlurb:
      "Master system design interviews end-to-end: scalability, CAP theorem, capacity planning, caching, load balancers, and 25+ real-world case studies (URL shortener, rate limiter, chat, payments). Every topic comes with interview-ready answers covering trade-offs, pitfalls, and follow-ups.",
    moduleSlugs: ["system-design", "system-design-cases"],
    metaDescription:
      "System design interview questions covering scalability, CAP, caching, load balancing, and 25+ case studies. Free, structured answers updated for 2026.",
    relatedPillars: [
      "distributed-systems",
      "low-level-design",
      "microservices-architecture",
    ],
  },
  {
    pillarSlug: "low-level-design",
    title: "Low-Level Design (LLD) Interview Prep",
    tagline: "Object-oriented design + machine coding rounds",
    heroBlurb:
      "LLD interviews test your ability to translate requirements into clean, extensible object models under time pressure. Work through parking lot, elevator, vending machine, and Splitwise with class-level diagrams, SOLID-driven structure, and the trade-offs interviewers probe — patterns apply in any OO language.",
    moduleSlugs: ["low-level-design", "design-patterns"],
    metaDescription:
      "Low-level design interview questions: parking lot, elevator, vending machine, Splitwise, and more. Full OOP design with SOLID principles and machine-coding templates.",
    relatedPillars: [
      "architecture-design",
      "system-design",
      "java",
    ],
  },
  {
    pillarSlug: "architecture-design",
    title: "Software Architecture & Design Patterns Interview Prep",
    tagline: "SOLID, clean architecture, DDD, and design patterns",
    heroBlurb:
      "Staff and senior engineer interviews lean heavily on architectural judgement. Cover SOLID, creational/structural/behavioral patterns, clean and hexagonal architecture, DDD, CQRS, and event sourcing — with concrete before/after examples and refactoring case studies you can map to any mainstream stack.",
    moduleSlugs: ["design-patterns", "architecture-patterns"],
    metaDescription:
      "Software architecture and design patterns interview questions. SOLID, clean architecture, DDD, CQRS, event sourcing — practical examples and trade-offs.",
    relatedPillars: [
      "system-design",
      "low-level-design",
      "microservices-architecture",
    ],
  },
  {
    pillarSlug: "spring",
    title: "Spring Ecosystem Interview Prep",
    tagline: "Spring Core, Boot, Data JPA, Security, WebFlux & Batch",
    heroBlurb:
      "The Spring ecosystem is the single biggest topic in Java backend interviews. Drill IoC and bean lifecycle, Boot auto-configuration, JPA and the N+1 problem, OAuth2 and JWT, reactive WebFlux, and batch processing — every sub-module with curated Q&A.",
    moduleSlugs: [
      "spring-core",
      "spring-boot",
      "spring-data-jpa",
      "spring-security",
      "spring-webflux",
      "spring-batch",
    ],
    metaDescription:
      "Spring interview questions covering Core, Boot, Data JPA, Hibernate, Security, WebFlux, and Batch. Structured answers with scenarios and pitfalls.",
    relatedPillars: [
      "java",
      "data-persistence",
      "microservices-architecture",
    ],
  },
  {
    pillarSlug: "microservices-architecture",
    title: "Microservices & APIs Interview Prep",
    tagline: "REST, GraphQL, gRPC, Spring Cloud, Kafka, RabbitMQ, sagas",
    heroBlurb:
      "Microservices interviews span three API styles (REST, GraphQL, gRPC), two messaging systems (Kafka for streaming, RabbitMQ for routing), and the architectural patterns that tie them together — discovery, circuit breakers, sagas, idempotency, outbox. Each surface has its own focused page so you can drill exactly what the interviewer asks about.",
    moduleSlugs: ["rest-api", "graphql", "grpc", "microservices", "messaging-events", "rabbitmq"],
    metaDescription:
      "Microservices interview questions: REST APIs, resilience patterns, circuit breakers, sagas, Kafka, event-driven architecture. Deep scenarios and comparisons.",
    relatedPillars: [
      "distributed-systems",
      "spring",
      "system-design",
    ],
  },
  {
    pillarSlug: "data-persistence",
    title: "Databases & Caching Interview Prep",
    tagline: "SQL, MongoDB, Redis, and caching patterns",
    heroBlurb:
      "Data-layer interviews test both breadth (SQL indexes, ACID, sharding; NoSQL document models; Redis structures) and depth (N+1, cache invalidation, partitioning). This hub covers all three modules with scenario-based questions drawn from real production incidents.",
    moduleSlugs: ["sql-databases", "postgresql", "nosql-mongodb", "redis-caching"],
    metaDescription:
      "Database interview questions covering SQL, PostgreSQL, MongoDB, and Redis. Indexes, ACID, sharding, document modeling, and caching patterns with structured answers.",
    relatedPillars: [
      "hibernate-jpa",
      "spring",
      "system-design",
    ],
  },
  {
    pillarSlug: "devops",
    title: "DevOps Interview Prep",
    tagline: "Git, Maven/Gradle, Jenkins, CI/CD, Terraform, Docker & Kubernetes",
    heroBlurb:
      "DevOps fluency is now table-stakes for any senior engineering role. This hub covers the full pipeline: Git workflows, Java build tools (Maven, Gradle), CI/CD platforms, Jenkins declarative pipelines, Terraform and Infrastructure-as-Code, Docker images, and Kubernetes workloads — plus the scenario questions interviewers actually ask (rollback, blue-green, pipeline failures, Terraform state drift).",
    moduleSlugs: ["git-build-tools", "java-build-tools", "cicd", "jenkins", "terraform", "docker", "kubernetes"],
    metaDescription:
      "DevOps interview questions covering Git, Maven, Gradle, Jenkins, GitHub Actions, Docker, and Kubernetes. Pipelines, deployment strategies, and scenarios.",
    relatedPillars: [
      "containers",
      "sre",
      "cloud",
    ],
  },
  {
    pillarSlug: "java-testing",
    title: "Java Testing Interview Prep",
    tagline: "JUnit 5, Mockito, Spring Boot tests, Testcontainers, contract testing",
    heroBlurb:
      "Automated testing shows up in every senior Java backend interview. Drill JUnit 5 (parameterized, nested, dynamic tests), Mockito patterns, @SpringBootTest slices, Testcontainers for real-database tests, contract testing, and advanced techniques (mutation, property-based, performance) — with the scenario and trade-off questions interviewers actually ask.",
    moduleSlugs: ["unit-testing"],
    metaDescription:
      "Java testing interview questions: JUnit 5, Mockito, Spring Boot tests, Testcontainers, contract, mutation, and property-based testing. Scenarios and trade-offs.",
    relatedPillars: [
      "java",
      "spring",
      "devops",
    ],
  },
  {
    pillarSlug: "cloud",
    title: "Cloud Interview Prep (AWS, GCP, Azure)",
    tagline: "AWS, GCP, Azure & cloud-native architecture patterns",
    heroBlurb:
      "Cloud questions split into two layers: platform-specific service intuition (AWS vs GCP vs Azure — when an interviewer wants to know if you have hands-on with their stack) and vendor-agnostic architecture (12-factor, multi-region, cost optimization, deployment strategies, disaster recovery). This hub gives each platform its own focused page plus a dedicated cloud-native page for the architecture-level questions that apply to all three.",
    moduleSlugs: ["aws-cloud", "gcp", "azure", "cloud-native"],
    metaDescription:
      "Cloud interview questions: AWS, GCP, Azure, serverless, Terraform, 12-factor, multi-region, disaster recovery. Structured answers with trade-offs.",
    relatedPillars: [
      "containers",
      "devops",
      "sre",
    ],
  },
  {
    pillarSlug: "sre",
    title: "SRE & Production Engineering Interview Prep",
    tagline: "Observability, incident response, troubleshooting, on-call, chaos engineering",
    heroBlurb:
      "Senior engineering interviews increasingly lean on production judgement — the ability to debug a live incident, read thread and heap dumps, design alerting that doesn't page at 3am, and run a postmortem that actually prevents recurrence. This hub unifies Observability (structured logging, Micrometer, Prometheus, Grafana, distributed tracing) with Production Operations & SRE (incident response, RCA, chaos engineering, capacity planning, on-call), with scenario-based answers drawn from real production outages.",
    moduleSlugs: ["observability", "production-sre"],
    metaDescription:
      "SRE and production engineering interview questions: observability, Prometheus, Grafana, distributed tracing, incident response, postmortems, chaos engineering, on-call.",
    relatedPillars: [
      "distributed-systems",
      "devops",
      "containers",
    ],
  },
  {
    pillarSlug: "behavioral",
    title: "Behavioral & Engineering Excellence Interview Prep",
    tagline: "STAR method, leadership, code review, mentoring, technical decisions",
    heroBlurb:
      "Every senior Java backend loop ends in two non-coding rounds: a behavioral round (STAR-structured questions about conflict, ownership, failure, leadership, agile delivery) and an engineering-practices round (code review philosophy, Architecture Decision Records, technical-debt trade-offs, mentoring, knowledge sharing, technical leadership). This hub splits them into two focused pages so you can drill each one with the right framing — narratives for behavioral, judgement calls for engineering excellence.",
    moduleSlugs: ["behavioral", "engineering-practices"],
    metaDescription:
      "Behavioral interview questions for software engineers and engineering excellence: STAR, leadership, conflict, code review, architecture decisions, mentoring.",
    relatedPillars: [
      "system-design",
      "low-level-design",
      "java",
    ],
  },
  {
    pillarSlug: "security",
    title: "Application Security Interview Prep",
    tagline: "OWASP, authentication, authorization, OAuth2 & JWT",
    heroBlurb:
      "Security questions span both app-level (OWASP top 10, encryption, secure coding) and Spring-specific (authentication, authorization, OAuth2, JWT, CORS/CSRF). This hub cross-lists both modules so no matter how the interviewer frames the topic, you're covered.",
    moduleSlugs: ["application-security", "spring-security"],
    metaDescription:
      "Application security interview questions: OWASP top 10, Spring Security, OAuth2, JWT, SAML, encryption, secure coding. Scenario-based answers.",
    relatedPillars: [
      "spring",
      "microservices-architecture",
      "cloud",
    ],
  },
  {
    pillarSlug: "distributed-systems",
    title: "Distributed Systems Interview Prep",
    tagline: "Scale, consistency, messaging, sagas, consensus",
    heroBlurb:
      "Distributed systems questions test how you reason about failure, latency, consistency, and coordination at scale. This hub bundles system-design fundamentals, microservices patterns, and event-driven messaging so you can cover the whole surface — CAP and quorum, sagas and idempotency, Kafka and message ordering, circuit breakers and back-pressure — with interview-ready answers and real scenarios.",
    moduleSlugs: ["system-design", "microservices", "messaging-events"],
    metaDescription:
      "Distributed systems interview questions: CAP, quorum, consistency models, sagas, idempotency, Kafka, circuit breakers, back-pressure. Scenario-based answers.",
    relatedPillars: [
      "system-design",
      "microservices-architecture",
      "sre",
    ],
  },
  {
    pillarSlug: "concurrency-multithreading",
    title: "Concurrency & Multithreading Interview Prep",
    tagline: "Threads, memory model, locks, executors, GC, JVM internals",
    heroBlurb:
      "Concurrency is the single hardest topic in senior interviews — and the one where most candidates stumble on the scenario questions. Drill thread safety and the Java memory model, executors and the ForkJoinPool, synchronizers, lock-free structures, and the JVM-level internals (garbage collection, heap/stack, class loading) that make a concurrent program fast or painful.",
    moduleSlugs: ["java-concurrency", "jvm-internals"],
    metaDescription:
      "Concurrency and multithreading interview questions: Java memory model, synchronized, locks, executors, deadlocks, GC, JVM tuning. Structured answers with pitfalls.",
    relatedPillars: [
      "java",
      "system-design",
      "sre",
    ],
  },
  {
    pillarSlug: "containers",
    title: "Docker & Kubernetes Interview Prep",
    tagline: "Images, networking, Compose, pods, services, operators",
    heroBlurb:
      "Containers and orchestration are two of the most-asked DevOps topics in senior interviews. Drill Docker image layers, multi-stage builds, networking and volumes; Kubernetes pods, services, ingress, stateful sets, rolling updates, HPA; and the scenario questions interviewers actually ask — image size, secret handling, zero-downtime deploys, probe tuning.",
    moduleSlugs: ["docker", "kubernetes"],
    metaDescription:
      "Docker and Kubernetes interview questions: image layers, multi-stage builds, pods, services, ingress, HPA, stateful sets, rolling deploys. Scenarios and trade-offs.",
    relatedPillars: [
      "devops",
      "cloud",
      "sre",
    ],
  },
  {
    pillarSlug: "hibernate-jpa",
    title: "Hibernate, JPA & Database Interview Prep",
    tagline: "JPA, Hibernate, transactions, N+1, SQL tuning, indexes",
    heroBlurb:
      "The data layer is where careers are made and lost in a Java interview. This hub pairs Spring Data JPA and Hibernate (entity mapping, fetch strategies, the N+1 problem, transactions and isolation levels) with the underlying SQL and relational fundamentals (indexes, query plans, joins, ACID) so you can answer any data-access question — ORM-side or SQL-side — with confidence.",
    moduleSlugs: ["spring-data-jpa", "sql-databases"],
    metaDescription:
      "Hibernate, JPA, and SQL interview questions: fetch strategies, N+1, transactions, isolation levels, indexes, query plans, ACID. All with structured answers.",
    relatedPillars: [
      "data-persistence",
      "spring",
      "java",
    ],
  },
];

// ─── Lookup helpers ──────────────────────────────────────────────────────────

const PILLAR_BY_SLUG: Map<string, PillarHubEntry> = new Map(
  PILLAR_HUBS.map((p) => [p.pillarSlug, p]),
);

const SEO_MODULE_BY_APP_SLUG: Map<string, SeoModuleEntry> = new Map(
  SEO_MODULES.map((m) => [m.moduleSlug, m]),
);

/** Returns the pillar hub entry for a URL slug, or null. */
export function getPillarBySlug(slug: string): PillarHubEntry | null {
  return PILLAR_BY_SLUG.get(slug) ?? null;
}

/** Returns true iff `slug` is one of the registered pillar-hub slugs. */
export function isPillarSlug(slug: string): boolean {
  return PILLAR_BY_SLUG.has(slug);
}

/** All pillar-hub URL slugs (for proxy.ts and sitemap generation). */
export const PILLAR_HUB_SLUGS: readonly string[] = PILLAR_HUBS.map(
  (p) => p.pillarSlug,
);

/**
 * Resolves a pillar's moduleSlugs to full SeoModuleEntry records, preserving
 * declaration order. Modules not yet in SEO_MODULES are skipped.
 */
export function getModulesForPillar(pillar: PillarHubEntry): SeoModuleEntry[] {
  const out: SeoModuleEntry[] = [];
  for (const moduleSlug of pillar.moduleSlugs) {
    const m = SEO_MODULE_BY_APP_SLUG.get(moduleSlug);
    if (m) out.push(m);
  }
  return out;
}

/**
 * Every pillar hub that lists `moduleSlug` (App URL form, e.g. "spring-boot").
 * A module can belong to more than one hub — e.g. spring-security is in both
 * `spring` and `security` — so callers that need a single canonical pillar
 * (sidebar, breadcrumb) should use `getPrimaryPillarForModule()` instead.
 */
export function getPillarsForModule(moduleSlug: string): PillarHubEntry[] {
  return PILLAR_HUBS.filter((p) => p.moduleSlugs.includes(moduleSlug));
}

/** Use on SEO module / question pages when the module sits in any agnostic hub. */
export function completeTrackCtaForModule(moduleSlug: string): typeof COMPLETE_TRACK_CTA | typeof COMPLETE_TRACK_CTA_LANGUAGE_AGNOSTIC {
  const pillars = getPillarsForModule(moduleSlug);
  if (pillars.some((p) => LANGUAGE_AGNOSTIC_PILLAR_SLUGS.has(p.pillarSlug))) {
    return COMPLETE_TRACK_CTA_LANGUAGE_AGNOSTIC;
  }
  return COMPLETE_TRACK_CTA;
}

/**
 * Best single pillar context for a module. Used as the navigation anchor
 * when a user lands directly on an SEO URL (e.g. via Google) and we need
 * to render a left tree scoped to *one* pillar rather than the whole
 * Java backend curriculum.
 *
 * Resolution order:
 *   1. The pillar whose `moduleSlugs[0]` is this module — i.e. the one
 *      that treats it as its lead module.
 *   2. The pillar with the *fewest* total modules — most topical fit.
 *   3. Declaration order in PILLAR_HUBS (stable fallback).
 */
export function getPrimaryPillarForModule(
  moduleSlug: string,
): PillarHubEntry | null {
  const matches = getPillarsForModule(moduleSlug);
  if (matches.length === 0) return null;
  if (matches.length === 1) return matches[0];

  const lead = matches.find((p) => p.moduleSlugs[0] === moduleSlug);
  if (lead) return lead;

  return [...matches].sort(
    (a, b) => a.moduleSlugs.length - b.moduleSlugs.length,
  )[0];
}

/**
 * Resolves the seoSlug for the given moduleSlug, or null if the module
 * has no public SEO URL (e.g. it's reused via contentSource on JFI).
 */
export function getSeoSlugForModuleSlug(moduleSlug: string): string | null {
  return SEO_MODULE_BY_APP_SLUG.get(moduleSlug)?.seoSlug ?? null;
}

// ─── Smart per-module cross-links ────────────────────────────────────────────
//
// Hand-picked "continue your prep" list per module. Each module gets 3-4
// modules an interviewer/visitor is most likely to want next. This is the
// authored signal for the "Related modules" block on every SEO landing — far
// sharper than auto-grouping by pillar (which tends to list everything in
// the same hub, most of which isn't directly adjacent).
//
// Rules:
//   1. Pick 3-4 modules that share the same interview round as the source
//      (e.g. `hibernate` → `sql-databases`, `spring-data-jpa` for the
//      data-layer round; not the whole DevOps hub).
//   2. Always include at least one *cross-pillar* pick so we build a graph,
//      not a tree (e.g. `spring-boot` → `spring-data-jpa` [same pillar] +
//      `unit-testing` [cross-pillar, but often the follow-up round]).
//   3. Order matters — first pick is rendered largest.

export const MODULE_RELATED: Record<string, readonly string[]> = {
  "core-java":              ["java-oop", "java-collections", "java-concurrency", "jvm-internals"],
  "java-oop":               ["core-java", "design-patterns", "low-level-design", "architecture-patterns"],
  "java-collections":       ["core-java", "java-streams", "java-concurrency", "system-design"],
  "java-streams":           ["core-java", "java-collections", "java-concurrency", "spring-boot"],
  "java-concurrency":       ["jvm-internals", "java-collections", "production-sre", "system-design"],
  "jvm-internals":          ["java-concurrency", "core-java", "production-sre", "observability"],

  "spring-core":            ["spring-boot", "spring-data-jpa", "spring-security", "design-patterns"],
  "spring-boot":            ["spring-core", "spring-data-jpa", "spring-security", "unit-testing"],
  "spring-data-jpa":        ["sql-databases", "spring-boot", "postgresql", "redis-caching"],
  "spring-security":        ["application-security", "spring-boot", "rest-api", "microservices"],
  "spring-webflux":         ["spring-boot", "rest-api", "java-concurrency", "microservices"],
  "spring-batch":           ["spring-boot", "spring-data-jpa", "messaging-events", "production-sre"],

  "sql-databases":          ["postgresql", "spring-data-jpa", "nosql-mongodb", "redis-caching"],
  "postgresql":             ["sql-databases", "spring-data-jpa", "redis-caching", "system-design"],
  "nosql-mongodb":          ["sql-databases", "redis-caching", "system-design", "microservices"],
  "redis-caching":          ["sql-databases", "system-design", "spring-boot", "microservices"],

  "rest-api":               ["spring-boot", "graphql", "grpc", "microservices"],
  "graphql":                ["rest-api", "spring-boot", "microservices", "grpc"],
  "grpc":                   ["rest-api", "microservices", "messaging-events", "kubernetes"],
  "microservices":          ["rest-api", "messaging-events", "kubernetes", "system-design"],
  "messaging-events":       ["microservices", "rabbitmq", "system-design", "kafka-interview-questions"],
  "rabbitmq":               ["messaging-events", "microservices", "spring-boot", "system-design"],

  "design-patterns":        ["java-oop", "architecture-patterns", "low-level-design", "system-design"],
  "architecture-patterns":  ["system-design", "design-patterns", "microservices", "low-level-design"],
  "system-design":          ["system-design-cases", "microservices", "architecture-patterns", "aws-cloud"],
  "system-design-cases":    ["system-design", "microservices", "messaging-events", "redis-caching"],
  "low-level-design":       ["design-patterns", "java-oop", "architecture-patterns", "system-design"],

  "application-security":   ["spring-security", "rest-api", "spring-boot", "cicd"],
  "unit-testing":           ["spring-boot", "spring-data-jpa", "java-oop", "cicd"],

  "git-build-tools":        ["java-build-tools", "cicd", "jenkins", "unit-testing"],
  "java-build-tools":       ["git-build-tools", "cicd", "jenkins", "docker"],
  "cicd":                   ["jenkins", "terraform", "docker", "kubernetes"],
  "terraform":              ["cicd", "kubernetes", "aws-cloud", "cloud-native"],
  "jenkins":                ["cicd", "git-build-tools", "docker", "terraform"],
  "docker":                 ["kubernetes", "cicd", "cloud-native", "microservices"],
  "kubernetes":             ["docker", "cloud-native", "microservices", "production-sre"],

  "aws-cloud":              ["cloud-native", "kubernetes", "terraform", "system-design"],
  "cloud-native":           ["aws-cloud", "kubernetes", "microservices", "terraform"],
  "gcp":                    ["aws-cloud", "cloud-native", "kubernetes", "terraform"],
  "azure":                  ["aws-cloud", "cloud-native", "kubernetes", "spring-boot"],

  "observability":          ["production-sre", "spring-boot", "kubernetes", "microservices"],
  "production-sre":         ["observability", "kubernetes", "system-design", "java-concurrency"],

  "behavioral":             ["engineering-practices", "system-design", "architecture-patterns", "production-sre"],
  "engineering-practices":  ["behavioral", "architecture-patterns", "unit-testing", "system-design"],
};

/**
 * Resolves the `MODULE_RELATED` list for a module into full SeoModuleEntry
 * records, preserving authored order. Invalid/missing moduleSlugs are
 * silently skipped (so editing the registry can't 404 the page).
 */
export function getRelatedModulesFor(moduleSlug: string): SeoModuleEntry[] {
  const related = MODULE_RELATED[moduleSlug] ?? [];
  const out: SeoModuleEntry[] = [];
  for (const slug of related) {
    const m = SEO_MODULE_BY_APP_SLUG.get(slug);
    if (m) out.push(m);
  }
  return out;
}

// ─── Home page 3-column priority grid ────────────────────────────────────────
//
// "Top Interview Topics — Ranked by Priority" on the homepage. Three columns,
// each representing a layer of the Java backend interview stack, ordered
// top-to-bottom by what interviewers actually ask most.
//
// Rationale for this structure (not auto-derived from pillars):
//   - A Google visitor landing on the homepage needs a *ranked* list of
//     where to start, not a flat 9-pillar grid.
//   - Columns map to interview-round vocabulary: "language round",
//     "framework/data round", "system-design+cloud round".
//   - Priority *within* each column matters as much as column order —
//     Spring Boot ahead of Spring Core, Hibernate ahead of SQL, etc.

export interface HomePriorityColumn {
  /** Short heading shown at the top of the column. */
  title: string;
  /** Kicker text (10-12 words) describing this interview round. */
  tagline: string;
  /** Icon key used by the client component. */
  icon: "code" | "layers" | "compass";
  /** Color accent token used by the client component. */
  tone: "blue" | "indigo" | "purple";
  /** Ordered module slugs (highest priority first). 5-6 modules per column. */
  moduleSlugs: string[];
}

export const HOME_PRIORITY_COLUMNS: readonly HomePriorityColumn[] = [
  {
    title: "Java Language & Core",
    tagline: "Every interview opens here. Get these rock-solid first.",
    icon: "code",
    tone: "blue",
    moduleSlugs: [
      "core-java",
      "java-oop",
      "java-collections",
      "java-concurrency",
      "java-streams",
      "jvm-internals",
    ],
  },
  {
    title: "Spring, Data & APIs",
    tagline: "The resume-match round — whatever's on your JD, drill it here.",
    icon: "layers",
    tone: "indigo",
    moduleSlugs: [
      "spring-boot",
      "spring-data-jpa",
      "spring-core",
      "sql-databases",
      "rest-api",
      "redis-caching",
    ],
  },
  {
    title: "System-Level & Cloud",
    tagline:
      "Design, scale, and how things run in production — ideas that transfer across stacks.",
    icon: "compass",
    tone: "purple",
    moduleSlugs: [
      "system-design",
      "microservices",
      "messaging-events",
      "aws-cloud",
      "kubernetes",
      "production-sre",
    ],
  },
];

/**
 * Resolves the home priority grid into ready-to-render column data with
 * full SeoModuleEntry records per module. Called once, server-side, from
 * the homepage.
 */
export function getHomePriorityColumns(): Array<
  HomePriorityColumn & { modules: SeoModuleEntry[] }
> {
  return HOME_PRIORITY_COLUMNS.map((col) => ({
    ...col,
    modules: col.moduleSlugs
      .map((slug) => SEO_MODULE_BY_APP_SLUG.get(slug))
      .filter((m): m is SeoModuleEntry => Boolean(m)),
  }));
}

// ─── Featured-prep-section grouping (home page pillar tree) ──────────────────
//
// Groups the 9+ pillar hubs into three tiers so the homepage renders them as
// a clear *tree* rather than a flat 2-column grid. Each tier has a heading
// and a one-liner describing what the pillars in it share.

export interface PillarTier {
  title: string;
  tagline: string;
  /** Pillar slugs in this tier, in display order. */
  pillarSlugs: string[];
}

export const PILLAR_TIERS: readonly PillarTier[] = [
  {
    title: "Foundation layer",
    tagline: "Language + framework depth. Every interview round pulls from here.",
    pillarSlugs: ["java", "spring", "hibernate-jpa", "data-persistence", "java-testing"],
  },
  {
    title: "Architecture & APIs",
    tagline: "How your services fit together — design, messaging, integration.",
    pillarSlugs: [
      "microservices-architecture",
      "system-design",
      "low-level-design",
      "architecture-design",
      "distributed-systems",
      "concurrency-multithreading",
    ],
  },
  {
    title: "Platform & operations",
    tagline: "Ship it, run it, debug it. Senior + SRE interviews live here.",
    pillarSlugs: [
      "cloud",
      "devops",
      "containers",
      "sre",
      "security",
      "behavioral",
    ],
  },
];
