/**
 * Phase 12 — Compare: canonical data layer.
 *
 * The COMPARISONS catalog (rendered on /compare) and the compare-detail
 * JSON loader (content/compare/<slug>.json) are hoisted here from the
 * route files. The hub-page data lives in-module as a constant; the
 * detail page reads JSON from disk (the route is still the place that
 * does fs reads, but the typed shape + helper now live here).
 */
import fs from "fs"
import path from "path"
import type {
  ComparisonCardData,
  ComparisonData,
  ComparePageData,
} from "./compare-types"

/** The full comparison catalog rendered on /compare. */
export const COMPARISONS: ComparisonCardData[] = [
  {
    slug: "kafka-vs-rabbitmq",
    title: "Kafka vs RabbitMQ",
    tag: "Messaging",
    search: "130k/mo",
    verdict: "Kafka for high-throughput streaming & event replay. RabbitMQ for traditional task queues with routing.",
    left: "Kafka",
    right: "RabbitMQ",
  },
  {
    slug: "sql-vs-nosql",
    title: "SQL vs NoSQL",
    tag: "Databases",
    search: "150k/mo",
    verdict: "SQL for structured data with complex joins. NoSQL for flexible schemas and horizontal scaling.",
    left: "SQL",
    right: "NoSQL",
  },
  {
    slug: "mysql-vs-postgresql",
    title: "MySQL vs PostgreSQL",
    tag: "Databases",
    search: "110k/mo",
    verdict: "PostgreSQL for advanced features (JSON, CTE, window functions). MySQL for simplicity and read-heavy workloads.",
    left: "MySQL",
    right: "PostgreSQL",
  },
  {
    slug: "docker-vs-kubernetes",
    title: "Docker vs Kubernetes",
    tag: "Infrastructure",
    search: "95k/mo",
    verdict: "Docker packages apps into containers. Kubernetes orchestrates containers at scale. They complement each other.",
    left: "Docker",
    right: "Kubernetes",
  },
  {
    slug: "redis-vs-memcached",
    title: "Redis vs Memcached",
    tag: "Caching",
    search: "90k/mo",
    verdict: "Redis for data structures, persistence, pub/sub. Memcached for pure key-value caching at maximum simplicity.",
    left: "Redis",
    right: "Memcached",
  },
  {
    slug: "rest-vs-graphql",
    title: "REST vs GraphQL",
    tag: "APIs",
    search: "70k/mo",
    verdict: "REST for simple, cacheable APIs. GraphQL for complex UIs needing flexible data fetching from multiple resources.",
    left: "REST",
    right: "GraphQL",
  },
  {
    slug: "microservices-vs-monolith",
    title: "Microservices vs Monolith",
    tag: "Architecture",
    search: "60k/mo",
    verdict: "Start with monolith, decompose when needed. Microservices add complexity that's only worth it at scale.",
    left: "Micro",
    right: "Mono",
  },
  {
    slug: "aws-vs-gcp-vs-azure",
    title: "AWS vs GCP vs Azure",
    tag: "Cloud",
    search: "80k/mo",
    verdict: "AWS for breadth, GCP for data/ML, Azure for enterprise/Microsoft stack. All viable for most workloads.",
    left: "AWS",
    right: "GCP/Azure",
  },
  {
    slug: "spring-boot-vs-quarkus",
    title: "Spring Boot vs Quarkus",
    tag: "Java",
    search: "25k/mo",
    verdict: "Spring Boot for ecosystem maturity. Quarkus for cloud-native, fast startup, and GraalVM native compilation.",
    left: "Spring",
    right: "Quarkus",
  },
  {
    slug: "django-vs-fastapi",
    title: "Django vs FastAPI",
    tag: "Python",
    search: "40k/mo",
    verdict: "Django for full-featured web apps with ORM. FastAPI for high-performance async APIs with auto-docs.",
    left: "Django",
    right: "FastAPI",
  },
  {
    slug: "maven-vs-gradle",
    title: "Maven vs Gradle",
    tag: "Build Tools",
    search: "20k/mo",
    verdict: "Maven for convention-over-configuration simplicity. Gradle for flexibility, speed, and multi-project builds.",
    left: "Maven",
    right: "Gradle",
  },
  {
    slug: "grpc-vs-rest",
    title: "gRPC vs REST",
    tag: "APIs",
    search: "35k/mo",
    verdict: "gRPC for internal service-to-service communication. REST for public-facing APIs and browser clients.",
    left: "gRPC",
    right: "REST",
  },
  {
    slug: "mongodb-vs-postgresql",
    title: "MongoDB vs PostgreSQL",
    tag: "Databases",
    search: "55k/mo",
    verdict: "PostgreSQL for relational data with ACID. MongoDB for document-oriented data with schema flexibility.",
    left: "MongoDB",
    right: "PostgreSQL",
  },
  {
    slug: "react-vs-vue-vs-angular",
    title: "React vs Vue vs Angular",
    tag: "Frontend",
    search: "120k/mo",
    verdict: "React for ecosystem/jobs. Vue for simplicity. Angular for opinionated enterprise apps with TypeScript.",
    left: "React",
    right: "Vue/Angular",
  },
  {
    slug: "jwt-vs-session",
    title: "JWT vs Session Auth",
    tag: "Security",
    search: "45k/mo",
    verdict: "JWTs for stateless microservices. Server sessions for traditional apps needing easy revocation.",
    left: "JWT",
    right: "Sessions",
  },
  {
    slug: "sync-vs-async",
    title: "Sync vs Async Programming",
    tag: "Concurrency",
    search: "30k/mo",
    verdict: "Sync for CPU-bound sequential logic. Async for I/O-bound concurrent operations (network, disk).",
    left: "Sync",
    right: "Async",
  },
  {
    slug: "kubernetes-vs-docker-swarm",
    title: "Kubernetes vs Docker Swarm",
    tag: "Infrastructure",
    search: "25k/mo",
    verdict: "Kubernetes for production-scale orchestration. Docker Swarm for simple, small-scale deployments.",
    left: "K8s",
    right: "Swarm",
  },
  {
    slug: "terraform-vs-ansible",
    title: "Terraform vs Ansible",
    tag: "IaC",
    search: "30k/mo",
    verdict: "Terraform for infrastructure provisioning (declarative). Ansible for configuration management (procedural).",
    left: "Terraform",
    right: "Ansible",
  },
  {
    slug: "nextjs-vs-nuxtjs",
    title: "Next.js vs Nuxt.js",
    tag: "Frontend",
    search: "20k/mo",
    verdict: "Next.js for React ecosystem with SSR/SSG. Nuxt.js for Vue ecosystem with similar capabilities.",
    left: "Next.js",
    right: "Nuxt.js",
  },
  {
    slug: "junit-vs-testng",
    title: "JUnit vs TestNG",
    tag: "Testing",
    search: "15k/mo",
    verdict: "JUnit 5 for modern Java testing (Spring default). TestNG for data-driven tests and parallel execution.",
    left: "JUnit",
    right: "TestNG",
  },
]

/** Tag → Tailwind classes map used by the hub badges. */
export const COMPARE_TAG_COLORS: Record<string, string> = {
  Messaging: "bg-amber-100 dark:bg-amber-950/20 text-amber-700 dark:text-amber-400",
  Databases: "bg-emerald-100 dark:bg-emerald-950/20 text-emerald-700 dark:text-emerald-400",
  Infrastructure: "bg-blue-100 dark:bg-blue-950/20 text-primary dark:text-primary",
  Caching: "bg-red-100 dark:bg-red-950/20 text-red-700 dark:text-red-400",
  APIs: "bg-cyan-100 dark:bg-cyan-950/20 text-primary dark:text-primary",
  Architecture: "bg-blue-100 dark:bg-blue-950/20 text-primary dark:text-primary",
  Cloud: "bg-orange-100 dark:bg-orange-950/20 text-orange-700 dark:text-orange-400",
  Java: "bg-rose-100 dark:bg-rose-950/20 text-rose-700 dark:text-rose-400",
  Python: "bg-blue-100 dark:bg-blue-950/20 text-primary dark:text-primary",
  "Build Tools": "bg-surface text-foreground",
  Frontend: "bg-pink-100 dark:bg-pink-950/20 text-primary dark:text-primary",
  Security: "bg-yellow-100 dark:bg-yellow-950/20 text-yellow-700 dark:text-yellow-400",
  Concurrency: "bg-teal-100 dark:bg-teal-950/20 text-teal-700 dark:text-teal-400",
  IaC: "bg-lime-100 dark:bg-lime-950/20 text-lime-700 dark:text-lime-400",
  Testing: "bg-blue-100 dark:bg-blue-950/20 text-blue-700 dark:text-blue-400",
}

export function compareTagColor(tag: string): string {
  return COMPARE_TAG_COLORS[tag] ?? "bg-surface text-muted-foreground"
}

export function compareAllTags(): string[] {
  return [...new Set(COMPARISONS.map((c) => c.tag))]
}

export function compareCountByTag(tag: string): number {
  return COMPARISONS.filter((c) => c.tag === tag).length
}

/** "Most searched" = search volume ≥ 70k/mo. */
export function comparePopular(): ComparisonCardData[] {
  return COMPARISONS.filter((c) => parseInt(c.search, 10) >= 70)
}

const COMPARE_ROOT = path.join(process.cwd(), "..", "content", "compare")

/** Load a comparison detail JSON (content/compare/<slug>.json). */
export function loadComparison(slug: string): ComparisonData | null {
  const fpath = path.join(COMPARE_ROOT, `${slug}.json`)
  if (!fs.existsSync(fpath)) return null
  try {
    return JSON.parse(fs.readFileSync(fpath, "utf-8")) as ComparisonData
  } catch {
    return null
  }
}

/** Resolve a compare detail page payload. */
export function loadComparePage(slug: string): ComparePageData {
  return { slug, data: loadComparison(slug) }
}

/** Static-params for /compare/[slug] — driven by the catalog. */
export function listCompareParams(): { slug: string }[] {
  return COMPARISONS.map((c) => ({ slug: c.slug }))
}

export function formatCompareSlug(slug: string): string {
  return slug
    .replace(/-vs-/g, " vs ")
    .replace(/-/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase())
}
