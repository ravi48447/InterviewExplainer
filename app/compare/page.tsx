import { Metadata } from "next";
import Link from "next/link";
import {
  Home,
  ChevronRight,
  ArrowRight,
  ArrowLeftRight,
  BookOpen,
  Layers,
  TrendingUp,
  Zap,
} from "lucide-react";

export const revalidate = 3600;

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://interviewexplainer.com";

export const metadata: Metadata = {
  title:
    "X vs Y — Tech Comparison Interview Answers | InterviewExplainer",
  description:
    "Kafka vs RabbitMQ, SQL vs NoSQL, Docker vs Kubernetes, React vs Vue — all the classic comparison questions with interview-framed answers and trade-off analysis.",
  alternates: { canonical: `${SITE_URL}/compare` },
};

const COMPARISONS = [
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
];

const TAG_COLORS: Record<string, string> = {
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
};

const allTags = [...new Set(COMPARISONS.map((c) => c.tag))];

export default function ComparePage() {
  return (
    <div className="min-h-screen bg-surface border border-default dark:from-slate-950 font-sans text-foreground selection:bg-blue-200">
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
            Compare (X vs Y)
          </span>
        </nav>

        {/* Hero */}
        <header className="mb-12 rounded-xl border border-border bg-background/90 backdrop-blur-sm shadow-lg overflow-hidden">
          <div className="relative px-8 py-8 bg-surface border border-default dark:">
            <div className="flex items-center gap-2 mb-3">
              <ArrowLeftRight className="h-5 w-5 text-primary dark:text-primary" />
              <span className="text-[10px] font-bold uppercase tracking-widest text-primary dark:text-primary">
                Head-to-Head Analysis
              </span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-foreground mb-3">
              X vs Y — Interview-Ready Comparisons
            </h1>
            <p className="text-sm sm:text-base text-muted-foreground leading-relaxed max-w-3xl">
              &quot;When would you use Kafka over RabbitMQ?&quot; — Every
              interviewer loves comparison questions. These aren&apos;t generic
              articles. Each comparison is framed for the interview: key
              differences, trade-offs, when to pick which, and exactly what to
              say. Includes real-world use cases and architecture implications.
            </p>
          </div>
          <div className="px-8 py-4 bg-gradient-to-r from-slate-50 to-white dark:from-slate-900/40 dark:to-background border-t border-border">
            <div className="flex items-center gap-6 flex-wrap">
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 rounded-lg bg-blue-100 dark:bg-blue-950/20 flex items-center justify-center">
                  <ArrowLeftRight className="h-5 w-5 text-primary dark:text-primary" />
                </div>
                <div>
                  <div className="text-xs text-muted-foreground font-medium">
                    Comparisons
                  </div>
                  <div className="text-lg font-bold text-foreground">
                    {COMPARISONS.length}
                  </div>
                </div>
              </div>
              <div className="h-10 w-px bg-slate-200 dark:bg-slate-800" />
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 rounded-lg bg-blue-100 dark:bg-blue-950/20 flex items-center justify-center">
                  <Layers className="h-5 w-5 text-primary dark:text-primary" />
                </div>
                <div>
                  <div className="text-xs text-muted-foreground font-medium">
                    Categories
                  </div>
                  <div className="text-lg font-bold text-foreground">
                    {allTags.length}
                  </div>
                </div>
              </div>
              <div className="h-10 w-px bg-slate-200 dark:bg-slate-800" />
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 rounded-lg bg-blue-100 dark:bg-blue-950/20 flex items-center justify-center">
                  <TrendingUp className="h-5 w-5 text-primary dark:text-primary" />
                </div>
                <div>
                  <div className="text-xs text-muted-foreground font-medium">
                    Total Monthly Searches
                  </div>
                  <div className="text-lg font-bold text-foreground">
                    1.2M+
                  </div>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Category Tags */}
        <div className="flex flex-wrap gap-2 mb-8">
          {allTags.map((tag) => (
            <span
              key={tag}
              className={`text-xs font-bold px-3 py-1.5 rounded-full ${TAG_COLORS[tag] ?? "bg-surface text-muted-foreground"}`}
            >
              {tag} ({COMPARISONS.filter((c) => c.tag === tag).length})
            </span>
          ))}
        </div>

        {/* Most Popular */}
        <section className="mb-10">
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp className="h-5 w-5 text-primary dark:text-primary" />
            <h2 className="text-xl font-black text-foreground">
              Most Searched Comparisons
            </h2>
          </div>
          <p className="text-sm text-muted-foreground mb-5">
            The comparison questions with highest search volume — every
            interviewer asks at least one of these.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {COMPARISONS.filter((c) =>
              parseInt(c.search) >= 70,
            ).map((c) => (
              <Link
                key={c.slug}
                href={`/compare/${c.slug}`}
                className="group rounded-xl border border-border bg-background shadow-sm hover:shadow-md hover:border-default dark:border-default transition-all p-5"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${TAG_COLORS[c.tag] ?? "bg-surface text-muted-foreground"}`}
                    >
                      {c.tag}
                    </span>
                    <span className="text-[10px] font-medium text-muted-foreground flex items-center gap-1">
                      <TrendingUp className="h-3 w-3" />
                      {c.search}
                    </span>
                  </div>
                  <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-primary dark:group-hover:text-primary group-hover:translate-x-1 transition-all" />
                </div>

                <h3 className="text-[15px] font-bold text-foreground group-hover:text-primary dark:group-hover:text-primary transition-colors mb-2">
                  {c.title}
                </h3>

                <div className="flex items-center gap-2 mb-3">
                  <span className="text-xs font-bold text-primary dark:text-primary bg-blue-50 dark:bg-blue-500/10 px-2 py-0.5 rounded">
                    {c.left}
                  </span>
                  <ArrowLeftRight className="h-3 w-3 text-muted-foreground" />
                  <span className="text-xs font-bold text-primary dark:text-primary bg-blue-50 dark:bg-blue-500/10 px-2 py-0.5 rounded">
                    {c.right}
                  </span>
                </div>

                <p className="text-xs text-muted-foreground leading-relaxed pt-3 border-t border-slate-100 dark:border-slate-800/60">
                  <span className="font-semibold text-foreground">
                    Quick verdict:
                  </span>{" "}
                  {c.verdict}
                </p>
              </Link>
            ))}
          </div>
        </section>

        {/* All Comparisons */}
        <section className="mb-10">
          <div className="flex items-center gap-2 mb-2">
            <BookOpen className="h-5 w-5 text-primary dark:text-primary" />
            <h2 className="text-xl font-black text-foreground">
              All Comparisons
            </h2>
          </div>
          <p className="text-sm text-muted-foreground mb-5">
            Complete list across all categories. Each comparison includes
            trade-off tables, when-to-use flowcharts, and interview phrasing.
          </p>

          <div className="space-y-2">
            {COMPARISONS.map((c) => (
              <Link
                key={c.slug}
                href={`/compare/${c.slug}`}
                className="group flex items-center gap-4 rounded-xl border border-border bg-background shadow-sm hover:shadow-md hover:border-default dark:border-default transition-all p-4"
              >
                <div className="w-10 h-10 rounded-lg bg-surface flex items-center justify-center shrink-0">
                  <ArrowLeftRight className="h-5 w-5 text-primary dark:text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap mb-0.5">
                    <h3 className="text-sm font-bold text-foreground group-hover:text-primary dark:group-hover:text-primary transition-colors">
                      {c.title}
                    </h3>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${TAG_COLORS[c.tag] ?? "bg-surface text-muted-foreground"}`}
                    >
                      {c.tag}
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground leading-snug line-clamp-1">
                    {c.verdict}
                  </p>
                </div>
                <span className="text-[10px] font-medium text-muted-foreground shrink-0">
                  {c.search}
                </span>
                <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-primary dark:group-hover:text-primary group-hover:translate-x-1 transition-all shrink-0" />
              </Link>
            ))}
          </div>
        </section>

        {/* CTA */}
        <section className="rounded-xl border border-default dark:border-default/20 bg-surface p-8 text-center mb-12  ">
          <h2 className="text-2xl font-black text-foreground mb-3">
            Comparisons in Your Interview Prep
          </h2>
          <p className="text-sm text-muted-foreground mb-6 max-w-xl mx-auto">
            These comparisons appear as interview questions in your domain
            prep. Select your path and get them mapped alongside Q&A, system
            design, DSA, and behavioral.
          </p>
          <Link
            href="/domains"
            className="inline-flex items-center gap-2 px-8 py-3 bg-surface border border-default text-foreground font-bold rounded-xl hover:shadow-lg hover:scale-105 transition-all"
          >
            Select Your Domain
            <ArrowRight className="h-4 w-4" />
          </Link>
        </section>
      </div>
    </div>
  );
}
