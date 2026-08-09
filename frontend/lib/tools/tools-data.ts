/**
 * Phase 12 — Tools: canonical data layer.
 *
 * Hoists the TOOL_CATEGORIES map, the to-display-name lookup, and the
 * per-tool question rollup out of `app/tools/**`. The /tools hub and
 * the /tools/[tool] page now read from here.
 */
import {
  listSharedTools,
  listSharedFrontendLibs,
  getQuestionsForTool,
} from "@/lib/contentV2"
import type { Level, V2QuestionEntry } from "@/lib/contentV2-types"
import type {
  ToolCardData,
  ToolCategoryGroup,
  ToolHubPageData,
  ToolLevelSection,
} from "./tools-types"

/** Known display-name overrides for tool slugs (acronyms, brand spellings). */
const KNOWN_NAMES: Record<string, string> = {
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
}

export function toolDisplayName(slug: string): string {
  return (
    KNOWN_NAMES[slug] ??
    slug
      .split("-")
      .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
      .join(" ")
  )
}

/** The TOOL_CATEGORIES map (key → category metadata + slug list). */
export const TOOL_CATEGORIES: Record<
  string,
  { label: string; iconKey: string; color: string; bg: string; slugs: string[] }
> = {
  databases: {
    label: "Databases & Storage",
    iconKey: "database",
    color: "text-emerald-600 dark:text-emerald-400",
    bg: "bg-emerald-100 dark:bg-emerald-950/20",
    slugs: ["postgresql", "mysql", "mongodb", "redis", "elasticsearch", "sql", "dynamodb", "cassandra"],
  },
  messaging: {
    label: "Message Queues & Streaming",
    iconKey: "radio",
    color: "text-amber-600 dark:text-amber-400",
    bg: "bg-amber-100 dark:bg-amber-950/20",
    slugs: ["kafka", "rabbitmq", "sqs", "sns", "pulsar"],
  },
  cloud: {
    label: "Cloud & Infrastructure",
    iconKey: "cloud",
    color: "text-primary dark:text-primary",
    bg: "bg-blue-100 dark:bg-blue-950/20",
    slugs: ["aws", "gcp", "azure", "terraform", "ansible"],
  },
  containers: {
    label: "Containers & Orchestration",
    iconKey: "container",
    color: "text-primary",
    bg: "bg-blue-100 dark:bg-blue-950/20",
    slugs: ["docker", "kubernetes"],
  },
  apis: {
    label: "APIs & Protocols",
    iconKey: "globe",
    color: "text-primary",
    bg: "bg-cyan-100 dark:bg-cyan-950/20",
    slugs: ["graphql", "grpc", "rest", "websockets"],
  },
  devtools: {
    label: "Dev Tools & Build",
    iconKey: "terminal",
    color: "text-muted-foreground",
    bg: "bg-surface",
    slugs: ["git", "jenkins", "maven", "gradle", "github-actions", "linux"],
  },
  web: {
    label: "Web Servers & Proxies",
    iconKey: "server",
    color: "text-rose-600 dark:text-rose-400",
    bg: "bg-rose-100 dark:bg-rose-950/20",
    slugs: ["nginx", "apache", "haproxy"],
  },
  monitoring: {
    label: "Monitoring & Observability",
    iconKey: "gauge",
    color: "text-orange-600 dark:text-orange-400",
    bg: "bg-orange-100 dark:bg-orange-950/20",
    slugs: ["prometheus", "grafana", "datadog", "elk", "opentelemetry"],
  },
  frontend: {
    label: "Frontend Frameworks",
    iconKey: "code-2",
    color: "text-blue-600 dark:text-blue-400",
    bg: "bg-blue-100 dark:bg-blue-950/20",
    slugs: ["react", "angular", "vue", "nextjs", "svelte", "tailwind"],
  },
  security: {
    label: "Security Tools",
    iconKey: "shield",
    color: "text-red-600 dark:text-red-400",
    bg: "bg-red-100 dark:bg-red-950/20",
    slugs: ["oauth", "jwt", "vault", "keycloak"],
  },
}

/** Build the list of all tool slugs (shared tools + frontend libs, deduped + sorted). */
export function allToolSlugs(): string[] {
  const tools = listSharedTools()
  const frontendLibs = listSharedFrontendLibs()
  return [...new Set([...tools, ...frontendLibs])].sort()
}

/** Build a ToolCardData for every known tool slug with rolled-up counts. */
export function buildToolCards(): ToolCardData[] {
  return allToolSlugs().map((slug) => {
    const levels = getQuestionsForTool(slug)
    const totalQ = levels.reduce((s, l) => s + l.questions.length, 0)
    return {
      slug,
      name: toolDisplayName(slug),
      questionCount: totalQ,
      levelCount: levels.length,
    }
  })
}

/** Group the tool cards into categorized sections (with an "uncategorized" tail). */
export function buildToolCategoryGroups(): ToolCategoryGroup[] {
  const toolData = buildToolCards()
  const categorized = Object.entries(TOOL_CATEGORIES)
    .map(([key, cat]) => {
      const matchedTools = cat.slugs
        .map((slug) => toolData.find((t) => t.slug === slug))
        .filter(Boolean) as ToolCardData[]
      return {
        key,
        label: cat.label,
        iconKey: cat.iconKey,
        color: cat.color,
        bg: cat.bg,
        tools: matchedTools,
      }
    })
    .filter((cat) => cat.tools.length > 0)

  const categorizedSlugs = new Set(
    categorized.flatMap((c) => c.tools.map((t) => t.slug)),
  )
  const uncategorized: ToolCategoryGroup = {
    key: "other",
    label: "Other Tools",
    iconKey: "wrench",
    color: "text-muted-foreground",
    bg: "bg-surface",
    tools: toolData.filter((t) => !categorizedSlugs.has(t.slug)),
  }

  return categorized.some((c) => c.key === "other")
    ? categorized
    : [...categorized, uncategorized]
}

/** Total questions across all tools. */
export function totalToolQuestions(): number {
  return buildToolCards().reduce((s, t) => s + t.questionCount, 0)
}

/** Resolve the /tools/[tool] page payload. Returns null when the tool has no questions. */
export function loadToolHub(slug: string): ToolHubPageData | null {
  const levels = getQuestionsForTool(slug)
  if (levels.length === 0) return null
  const sections: ToolLevelSection[] = levels.map(({ level, questions }) => ({
    level,
    questions: questions as V2QuestionEntry[],
  }))
  const totalQuestions = sections.reduce((s, l) => s + l.questions.length, 0)
  return {
    slug,
    name: toolDisplayName(slug),
    levels: sections,
    totalQuestions,
  }
}

/** Level display metadata for the /tools/[tool] page. */
export const TOOL_LEVEL_META: Record<
  Level,
  { label: string; colorClass: string; range: string; icon: string }
> = {
  beginner: {
    label: "Beginner",
    colorClass:
      "bg-emerald-100 dark:bg-emerald-950/20 text-emerald-700 dark:text-emerald-400 border-default dark:border-default/20",
    range: "0–2 yrs",
    icon: "🌱",
  },
  intermediate: {
    label: "Intermediate",
    colorClass:
      "bg-amber-100 dark:bg-amber-950/20 text-amber-700 dark:text-amber-400 border-default dark:border-default/20",
    range: "2–5 yrs",
    icon: "⚡",
  },
  advanced: {
    label: "Advanced",
    colorClass:
      "bg-red-100 dark:bg-red-950/20 text-red-700 dark:text-red-400 border-default dark:border-default/20",
    range: "5+ yrs",
    icon: "🚀",
  },
}
