import { Metadata } from "next";
import Link from "next/link";
import {
  listSharedTools,
  listSharedFrontendLibs,
  getQuestionsForTool,
} from "@/lib/contentV2";
import {
  Home,
  ChevronRight,
  ArrowRight,
  Wrench,
  BookOpen,
  Layers,
  Database,
  Radio,
  Cloud,
  Container,
  GitBranch,
  Terminal,
  Globe,
  Server,
  Shield,
  Code2,
  Gauge,
  Target,
} from "lucide-react";

export const revalidate = 3600;

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://interviewexplainer.com";

function toDisplayName(slug: string): string {
  const KNOWN: Record<string, string> = {
    aws: "AWS",
    gcp: "GCP",
    postgresql: "PostgreSQL",
    mysql: "MySQL",
    mongodb: "MongoDB",
    redis: "Redis",
    elasticsearch: "Elasticsearch",
    kafka: "Kafka",
    rabbitmq: "RabbitMQ",
    docker: "Docker",
    kubernetes: "Kubernetes",
    git: "Git",
    jenkins: "Jenkins",
    maven: "Maven",
    gradle: "Gradle",
    react: "React",
    angular: "Angular",
    vue: "Vue",
    nextjs: "Next.js",
    nginx: "Nginx",
    terraform: "Terraform",
    ansible: "Ansible",
    graphql: "GraphQL",
    grpc: "gRPC",
    sql: "SQL",
    linux: "Linux",
    prometheus: "Prometheus",
    grafana: "Grafana",
  };
  return (
    KNOWN[slug] ??
    slug
      .split("-")
      .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
      .join(" ")
  );
}

const TOOL_CATEGORIES: Record<
  string,
  { label: string; icon: typeof Database; color: string; bg: string; slugs: string[] }
> = {
  databases: {
    label: "Databases & Storage",
    icon: Database,
    color: "text-emerald-600",
    bg: "bg-emerald-100",
    slugs: ["postgresql", "mysql", "mongodb", "redis", "elasticsearch", "sql", "dynamodb", "cassandra"],
  },
  messaging: {
    label: "Message Queues & Streaming",
    icon: Radio,
    color: "text-amber-600",
    bg: "bg-amber-100",
    slugs: ["kafka", "rabbitmq", "sqs", "sns", "pulsar"],
  },
  cloud: {
    label: "Cloud & Infrastructure",
    icon: Cloud,
    color: "text-blue-600",
    bg: "bg-blue-100",
    slugs: ["aws", "gcp", "azure", "terraform", "ansible"],
  },
  containers: {
    label: "Containers & Orchestration",
    icon: Container,
    color: "text-indigo-600",
    bg: "bg-indigo-100",
    slugs: ["docker", "kubernetes"],
  },
  apis: {
    label: "APIs & Protocols",
    icon: Globe,
    color: "text-cyan-600",
    bg: "bg-cyan-100",
    slugs: ["graphql", "grpc", "rest", "websockets"],
  },
  devtools: {
    label: "Dev Tools & Build",
    icon: Terminal,
    color: "text-slate-600",
    bg: "bg-slate-100",
    slugs: ["git", "jenkins", "maven", "gradle", "github-actions", "linux"],
  },
  web: {
    label: "Web Servers & Proxies",
    icon: Server,
    color: "text-rose-600",
    bg: "bg-rose-100",
    slugs: ["nginx", "apache", "haproxy"],
  },
  monitoring: {
    label: "Monitoring & Observability",
    icon: Gauge,
    color: "text-orange-600",
    bg: "bg-orange-100",
    slugs: ["prometheus", "grafana", "datadog", "elk", "opentelemetry"],
  },
  frontend: {
    label: "Frontend Frameworks",
    icon: Code2,
    color: "text-violet-600",
    bg: "bg-violet-100",
    slugs: ["react", "angular", "vue", "nextjs", "svelte", "tailwind"],
  },
  security: {
    label: "Security Tools",
    icon: Shield,
    color: "text-red-600",
    bg: "bg-red-100",
    slugs: ["oauth", "jwt", "vault", "keycloak"],
  },
};

export const metadata: Metadata = {
  title:
    "Tools & Technologies Interview Questions — Docker, Kafka, Redis, AWS & More",
  description:
    "Interview questions organized by tool and technology. Docker, Kafka, Redis, AWS, Kubernetes, PostgreSQL, and more. Universal content shared across Java, Python, Go, and every track.",
  alternates: { canonical: `${SITE_URL}/tools` },
};

export default function ToolsIndexPage() {
  const tools = listSharedTools();
  const frontendLibs = listSharedFrontendLibs();
  const allSlugs = [...new Set([...tools, ...frontendLibs])].sort();

  const toolData = allSlugs.map((slug) => {
    const levels = getQuestionsForTool(slug);
    const totalQ = levels.reduce((s, l) => s + l.questions.length, 0);
    return {
      slug,
      name: toDisplayName(slug),
      questionCount: totalQ,
      levelCount: levels.length,
    };
  });

  const totalQs = toolData.reduce((s, t) => s + t.questionCount, 0);

  const categorized = Object.entries(TOOL_CATEGORIES)
    .map(([key, cat]) => {
      const matchedTools = cat.slugs
        .map((slug) => toolData.find((t) => t.slug === slug))
        .filter(Boolean) as typeof toolData;
      return { key, ...cat, tools: matchedTools };
    })
    .filter((cat) => cat.tools.length > 0);

  const categorizedSlugs = new Set(
    categorized.flatMap((c) => c.tools.map((t) => t.slug)),
  );
  const uncategorized = toolData.filter(
    (t) => !categorizedSlugs.has(t.slug),
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-teal-50/20 to-cyan-50/20 font-sans text-slate-800 selection:bg-teal-200">
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
          <span className="text-slate-600 font-medium">
            Tools & Technologies
          </span>
        </nav>

        {/* Hero */}
        <header className="mb-12 rounded-xl border border-slate-200 bg-white/90 backdrop-blur-sm shadow-lg overflow-hidden">
          <div className="relative px-8 py-8 bg-gradient-to-br from-teal-50 via-cyan-50 to-blue-50">
            <div className="flex items-center gap-2 mb-3">
              <Wrench className="h-5 w-5 text-teal-600" />
              <span className="text-[10px] font-bold uppercase tracking-widest text-teal-600">
                Universal Content
              </span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-slate-900 mb-3">
              Tools & Technologies
            </h1>
            <p className="text-sm sm:text-base text-slate-600 leading-relaxed max-w-3xl">
              Interview questions organized by tool. These are universal —
              shared across Java, Python, Go, and every track that uses them.
              &quot;Explain how Kafka guarantees ordering&quot; is the same
              question whether you&apos;re a Java or Python backend engineer.
              Learn the tool, ace the question in any domain.
            </p>
          </div>
          <div className="px-8 py-4 bg-gradient-to-r from-slate-50 to-white border-t border-slate-200">
            <div className="flex items-center gap-6 flex-wrap">
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 rounded-lg bg-teal-100 flex items-center justify-center">
                  <Layers className="h-5 w-5 text-teal-600" />
                </div>
                <div>
                  <div className="text-xs text-slate-500 font-medium">
                    Tools
                  </div>
                  <div className="text-lg font-bold text-slate-900">
                    {toolData.length}
                  </div>
                </div>
              </div>
              <div className="h-10 w-px bg-slate-200" />
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
                  <BookOpen className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <div className="text-xs text-slate-500 font-medium">
                    Total Questions
                  </div>
                  <div className="text-lg font-bold text-slate-900">
                    {totalQs}
                  </div>
                </div>
              </div>
              <div className="h-10 w-px bg-slate-200" />
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 rounded-lg bg-cyan-100 flex items-center justify-center">
                  <Target className="h-5 w-5 text-cyan-600" />
                </div>
                <div>
                  <div className="text-xs text-slate-500 font-medium">
                    Categories
                  </div>
                  <div className="text-lg font-bold text-slate-900">
                    {categorized.length}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Categorized Sections */}
        {categorized.map((category) => (
          <section key={category.key} className="mb-10">
            <div className="flex items-center gap-2 mb-1.5">
              <div
                className={`w-7 h-7 rounded-lg ${category.bg} flex items-center justify-center`}
              >
                <category.icon
                  className={`h-4 w-4 ${category.color}`}
                />
              </div>
              <h2 className="text-lg font-black text-slate-900">
                {category.label}
              </h2>
              <span className="text-xs font-medium text-slate-400 ml-1">
                ({category.tools.length})
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 mt-4">
              {category.tools.map((tool) => (
                <Link
                  key={tool.slug}
                  href={`/tools/${tool.slug}`}
                  className="group rounded-xl border border-slate-200 bg-white shadow-sm hover:shadow-md hover:border-teal-300 transition-all p-5"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div
                      className={`w-10 h-10 rounded-lg ${category.bg} flex items-center justify-center group-hover:scale-105 transition-transform`}
                    >
                      <category.icon
                        className={`h-5 w-5 ${category.color}`}
                      />
                    </div>
                    <ArrowRight className="h-4 w-4 text-slate-300 group-hover:text-teal-500 group-hover:translate-x-1 transition-all mt-1" />
                  </div>
                  <h3 className="text-[15px] font-bold text-slate-900 group-hover:text-teal-600 transition-colors mb-1.5">
                    {tool.name}
                  </h3>
                  <div className="flex items-center gap-3 pt-3 border-t border-slate-100">
                    <span className="text-xs font-semibold text-slate-600">
                      {tool.questionCount} Questions
                    </span>
                    <span className="text-xs text-slate-400">
                      {tool.levelCount} level
                      {tool.levelCount > 1 ? "s" : ""}
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        ))}

        {/* Uncategorized */}
        {uncategorized.length > 0 && (
          <section className="mb-10">
            <div className="flex items-center gap-2 mb-1.5">
              <Wrench className="h-5 w-5 text-slate-600" />
              <h2 className="text-lg font-black text-slate-900">
                Other Tools
              </h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 mt-4">
              {uncategorized.map((tool) => (
                <Link
                  key={tool.slug}
                  href={`/tools/${tool.slug}`}
                  className="group rounded-xl border border-slate-200 bg-white shadow-sm hover:shadow-md hover:border-teal-300 transition-all p-5"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="w-10 h-10 rounded-lg bg-slate-100 flex items-center justify-center group-hover:scale-105 transition-transform">
                      <Wrench className="h-5 w-5 text-slate-600" />
                    </div>
                    <ArrowRight className="h-4 w-4 text-slate-300 group-hover:text-teal-500 group-hover:translate-x-1 transition-all mt-1" />
                  </div>
                  <h3 className="text-[15px] font-bold text-slate-900 group-hover:text-teal-600 transition-colors mb-1.5">
                    {tool.name}
                  </h3>
                  <div className="flex items-center gap-3 pt-3 border-t border-slate-100">
                    <span className="text-xs font-semibold text-slate-600">
                      {tool.questionCount} Questions
                    </span>
                    <span className="text-xs text-slate-400">
                      {tool.levelCount} level
                      {tool.levelCount > 1 ? "s" : ""}
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}

        {toolData.length === 0 && (
          <div className="text-center py-16 text-slate-500 bg-white rounded-xl border border-slate-200 shadow-sm">
            <Wrench className="h-10 w-10 text-slate-300 mx-auto mb-3" />
            <p className="text-sm font-medium">
              No tools available yet. Check back soon.
            </p>
          </div>
        )}

        {/* CTA */}
        <section className="rounded-xl border border-teal-200 bg-gradient-to-r from-teal-50 to-cyan-50 p-8 text-center mb-12">
          <h2 className="text-2xl font-black text-slate-900 mb-3">
            Tools in Your Domain Prep
          </h2>
          <p className="text-sm text-slate-600 mb-6 max-w-xl mx-auto">
            Select your domain and get tool-specific questions mapped to your
            tech stack. A Java Backend engineer sees Docker, Kafka, and AWS.
            A Python ML engineer sees MLflow, DVC, and Kubernetes.
          </p>
          <Link
            href="/domains"
            className="inline-flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-teal-600 to-cyan-600 text-white font-bold rounded-xl hover:shadow-lg hover:scale-105 transition-all"
          >
            Select Your Domain
            <ArrowRight className="h-4 w-4" />
          </Link>
        </section>
      </div>
    </div>
  );
}
