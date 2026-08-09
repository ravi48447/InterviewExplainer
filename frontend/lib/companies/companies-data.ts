/**
 * Phase 12 — Companies: canonical data layer.
 *
 * All company catalog data + per-company guide metadata that previously
 * lived inline in `app/companies/**` is hoisted here so the route files
 * become thin server shells.
 */
import type {
  CompanyCardData,
  CompanyGuideMeta,
  CompanyGuidePageData,
  CompanyTier,
  CompanyTypeMeta,
  CompanyTypePageData,
} from "./companies-types"

// ── Hub catalog (FAANG / Unicorns / India / Finance) ─────────────────────────

const FAANG: CompanyCardData[] = [
  {
    slug: "amazon",
    name: "Amazon",
    desc: "14 Leadership Principles drive every decision. Bar raiser model ensures consistent high bar. Behavioral is 50% of the evaluation — more than any other FAANG.",
    rounds: "OA → Phone → 4-5 Onsite Loops",
    dsaFocus: "Medium-Hard",
    sdFocus: "High",
    behavioralFocus: "Very High",
    topPatterns: ["Hash Maps", "Trees", "Graphs", "DP"],
    timeline: "4-8 weeks",
    gradient: "from-orange-50 dark:from-orange-950/40 ",
  },
  {
    slug: "google",
    name: "Google",
    desc: "Highest DSA bar in the industry. Emphasis on clean code, handling all edge cases, and optimal solutions. System design for L4+ (3+ years). Googliness assessment for culture fit.",
    rounds: "Phone → 4-5 Onsite (Coding + SD + Behavioral)",
    dsaFocus: "Very Hard",
    sdFocus: "High (L4+)",
    behavioralFocus: "Medium",
    topPatterns: ["Graphs", "DP", "Binary Search", "Two Pointers"],
    timeline: "6-12 weeks",
    gradient: "from-blue-500 to-blue-600",
  },
  {
    slug: "microsoft",
    name: "Microsoft",
    desc: "Growth mindset culture. Pragmatic and collaborative interviews. Strong system design focus. Azure knowledge helpful for cloud roles. Very structured interview process.",
    rounds: "Phone → 4 Onsite (Coding + SD + Design + Hire/No-hire)",
    dsaFocus: "Medium",
    sdFocus: "High",
    behavioralFocus: "Medium",
    topPatterns: ["Arrays", "Trees", "Strings", "DP"],
    timeline: "3-6 weeks",
    gradient: " to-teal-600",
  },
  {
    slug: "meta",
    name: "Meta",
    desc: "Move fast culture. Heavy DSA emphasis (45 minutes, 2 problems expected). React/frontend expertise valued. System design at scale. Impact-focused behavioral questions.",
    rounds: "Phone → 3-4 Onsite (2 Coding + SD + Behavioral)",
    dsaFocus: "Hard",
    sdFocus: "High",
    behavioralFocus: "Medium-High",
    topPatterns: ["Arrays", "Graphs", "Strings", "BFS/DFS"],
    timeline: "4-8 weeks",
    gradient: " to-blue-600",
  },
  {
    slug: "apple",
    name: "Apple",
    desc: "Culture fit is paramount. Deep expertise in your specific domain required. Hardware-software integration knowledge valued. Secretive about projects even in interviews.",
    rounds: "Phone → Team Match → 5-6 Onsite Loops",
    dsaFocus: "Medium-Hard",
    sdFocus: "Medium-High",
    behavioralFocus: "High",
    topPatterns: ["Arrays", "Linked Lists", "Trees", "Concurrency"],
    timeline: "6-10 weeks",
    gradient: "from-slate-600 to-slate-800",
  },
  {
    slug: "netflix",
    name: "Netflix",
    desc: "Freedom & Responsibility culture. Hire senior-only. System design heavy. Java/Python backend focus. Compensation is top-of-market, all cash, no equity vesting games.",
    rounds: "Phone → 4-5 Onsite (Technical + Culture)",
    dsaFocus: "Medium",
    sdFocus: "Very High",
    behavioralFocus: "High",
    topPatterns: ["System Design", "Architecture", "API Design", "Scaling"],
    timeline: "4-8 weeks",
    gradient: " to-rose-700",
  },
]

const UNICORNS: CompanyCardData[] = [
  {
    slug: "uber",
    name: "Uber",
    desc: "Distributed systems at scale. Real-time systems, geo-spatial algorithms, micro-trips. Strong backend focus with Go and Java.",
    rounds: "Phone → 4 Onsite",
    dsaFocus: "Hard",
    sdFocus: "Very High",
    topPatterns: ["Graphs", "Geo-spatial", "DP", "System Design"],
    gradient: "from-blue-50 dark:from-blue-950/40 ",
  },
  {
    slug: "airbnb",
    name: "Airbnb",
    desc: "Strong culture fit emphasis. Unique 'cross-functional' interview. Frontend and full-stack focus. Booking system design commonly asked.",
    rounds: "Phone → 5 Onsite (incl. Cross-functional)",
    dsaFocus: "Medium-Hard",
    sdFocus: "High",
    topPatterns: ["Strings", "DP", "Search", "Booking Systems"],
    gradient: "from-blue-50 dark:from-blue-950/40 ",
  },
  {
    slug: "stripe",
    name: "Stripe",
    desc: "API design excellence. Payment systems, distributed transactions. Strong emphasis on code quality and debugging. Unique 'bug squash' interview round.",
    rounds: "Phone → 4 Onsite (incl. Bug Squash)",
    dsaFocus: "Medium",
    sdFocus: "High",
    topPatterns: ["APIs", "Payments", "Debugging", "Distributed Txn"],
    gradient: "from-blue-50 dark:from-blue-950/40 ",
  },
  {
    slug: "databricks",
    name: "Databricks",
    desc: "Spark expertise valued. Distributed computing, data pipelines. Strong on system design for data platforms. Growing rapidly.",
    rounds: "Phone → 4-5 Onsite",
    dsaFocus: "Medium-Hard",
    sdFocus: "High",
    topPatterns: ["DP", "Distributed Systems", "Data Pipelines", "SQL"],
    gradient: "from-blue-50 dark:from-blue-950/40 ",
  },
]

const INDIA_TIER1: CompanyCardData[] = [
  {
    slug: "flipkart",
    name: "Flipkart",
    desc: "E-commerce at scale. Machine coding round is unique. Strong DSA + System Design. Java-heavy backend.",
    rounds: "Machine Coding → Phone → 3-4 Onsite",
    dsaFocus: "Hard",
    sdFocus: "High",
    topPatterns: ["DP", "Trees", "Machine Coding", "LLD"],
    gradient: " to-teal-600",
  },
  {
    slug: "razorpay",
    name: "Razorpay",
    desc: "Payments at scale. Fintech domain expertise. Strong backend focus with Go/Java. Growing engineering team.",
    rounds: "Phone → 3-4 Onsite",
    dsaFocus: "Medium-Hard",
    sdFocus: "High",
    topPatterns: ["APIs", "System Design", "Payments", "Concurrency"],
    gradient: " to-teal-600",
  },
  {
    slug: "swiggy",
    name: "Swiggy",
    desc: "Hyperlocal logistics. Real-time systems, geo-spatial. Machine coding emphasis. Java/Kotlin backend.",
    rounds: "Machine Coding → 3-4 Onsite",
    dsaFocus: "Medium",
    sdFocus: "High",
    topPatterns: ["Machine Coding", "Geo-spatial", "LLD", "System Design"],
    gradient: " to-teal-600",
  },
]

const FINANCE: CompanyCardData[] = [
  {
    slug: "goldman-sachs",
    name: "Goldman Sachs",
    desc: "Quantitative reasoning, Java/Python, financial systems. Technical deep-dives. Multiple coding rounds. Strong on data structures.",
    rounds: "HackerRank → Phone → 4-5 Onsite",
    dsaFocus: "Hard",
    sdFocus: "Medium-High",
    topPatterns: ["DP", "Math", "Arrays", "Trees"],
    gradient: "from-blue-500 to-blue-600",
  },
  {
    slug: "jpmorgan",
    name: "JPMorgan Chase",
    desc: "Enterprise Java, Spring ecosystem. CodeVue assessment. Cloud migration and modernization projects. Structured interview process.",
    rounds: "CodeVue → Phone → 3-4 Onsite",
    dsaFocus: "Medium",
    sdFocus: "Medium",
    topPatterns: ["Java", "Spring Boot", "SQL", "OOP"],
    gradient: "from-blue-500 to-blue-600",
  },
]

/** Tiers rendered on the /companies hub, in display order. */
export const COMPANY_TIERS: CompanyTier[] = [
  {
    key: "faang",
    label: "FAANG / Big Tech",
    iconKey: "star",
    color: "text-orange-600 dark:text-orange-400",
    blurb:
      "The most sought-after companies with the most structured (and demanding) interview processes.",
    companies: FAANG,
  },
  {
    key: "unicorns",
    label: "Top Unicorns & Growth Companies",
    iconKey: "trending-up",
    color: "text-blue-600 dark:text-blue-400",
    blurb:
      "High-growth companies with competitive comp and interesting technical challenges.",
    companies: UNICORNS,
  },
  {
    key: "india",
    label: "India Tier-1 Tech",
    iconKey: "users",
    color: "text-emerald-600 dark:text-emerald-400",
    blurb:
      "Top Indian tech companies known for machine coding rounds and strong system design focus.",
    companies: INDIA_TIER1,
  },
  {
    key: "finance",
    label: "Finance & Banking",
    iconKey: "dollar-sign",
    color: "text-primary dark:text-primary",
    blurb:
      "Top financial institutions with strong enterprise engineering and quantitative focus.",
    companies: FINANCE,
  },
]

export function totalCompanyCount(): number {
  return COMPANY_TIERS.reduce((n, t) => n + t.companies.length, 0)
}

// ── Per-company guide metadata (COMPANY_META) ──────────────────────────────

const COMPANY_GUIDE_META: Record<string, CompanyGuideMeta> = {
  amazon: {
    name: "Amazon",
    desc: "FAANG-level preparation. Amazon is famous for the Leadership Principles (14 LPs) in behavioral rounds, and heavy DSA in coding rounds. System design is core for SDE2+.",
    dsaPatterns: ["hash-map", "tree-bfs", "tree-dfs", "dynamic-programming", "two-pointers"],
    keyTopics: ["system-design", "distributed-systems", "databases", "microservices"],
    langFocus: ["java", "python"],
    rounds: [
      { name: "OA (Online Assessment)", desc: "2 DSA problems, LeetCode medium/hard. Time-boxed. Focus on correctness over elegance." },
      { name: "Technical Phone Screen", desc: "1–2 coding problems + intro. Same DSA level. Sometimes system design lite." },
      { name: "Virtual Onsite (4–5 loops)", desc: "1 system design round + 3–4 coding rounds. Each round also has Leadership Principle questions." },
      { name: "Bar Raiser", desc: "Cross-functional calibration. Any round can be the bar raiser. Focus on your most impressive projects." },
    ],
  },
  google: {
    name: "Google",
    desc: "The hardest DSA bar in industry. Googlers write clean code, handle edge cases, analyze complexity. System design for L4+. Googliness + leadership for behavioral.",
    dsaPatterns: ["graph-bfs-dfs", "dynamic-programming", "binary-search", "backtracking", "heap-top-k"],
    keyTopics: ["system-design", "distributed-systems", "observability"],
    langFocus: ["python", "java", "go"],
    rounds: [
      { name: "Phone Screen (2x)", desc: "45 min each. 1–2 DSA problems on Google Docs (no IDE). Think aloud, edge cases, complexity." },
      { name: "Onsite (4–5 rounds)", desc: "Coding (3x) + System Design (1x) + Googliness/Leadership (1x). Expect hard-level DSA." },
    ],
  },
  microsoft: {
    name: "Microsoft",
    desc: "Rigorous but more pragmatic than Google/Amazon. Strong on system design and coding. Azure knowledge helpful for cloud roles. Collaborative culture emphasized.",
    dsaPatterns: ["tree-bfs", "tree-dfs", "hash-map", "two-pointers", "sliding-window"],
    keyTopics: ["system-design", "databases", "api-design", "security"],
    langFocus: ["csharp", "java", "python"],
    rounds: [
      { name: "Recruiter Screen", desc: "Background + motivation check. 30 min. Very lightweight." },
      { name: "Technical Screen", desc: "1 coding problem + behavioral. LeetCode medium." },
      { name: "Onsite (4 rounds)", desc: "Coding (2x) + Design (1x) + Behavioral (1x). Sometimes a 'As Appropriate' round with senior engineer." },
    ],
  },
  meta: {
    name: "Meta",
    desc: "Fast-paced culture (move fast). Heavy focus on DSA, React/frontend knowledge, and system design at scale. Data structures and algorithms are rigorously tested.",
    dsaPatterns: ["two-pointers", "sliding-window", "hash-map", "graph-bfs-dfs", "dynamic-programming"],
    keyTopics: ["system-design", "distributed-systems", "api-design"],
    langFocus: ["javascript", "python", "java"],
    rounds: [
      { name: "Initial Screen", desc: "LeetCode-style coding, 45 min. 1–2 problems. Python/JS preferred." },
      { name: "Onsite (5 rounds)", desc: "Coding (2x) + System Design (1x) + Behavioral (1x) + Leadership (1x). Move fast mentality in behavioral." },
    ],
  },
}

export function loadCompanyGuide(slug: string): CompanyGuidePageData {
  const meta = COMPANY_GUIDE_META[slug] ?? null
  const name = meta?.name ?? toTitle(slug)
  return { slug, name, meta }
}

export function listCompanyGuideParams(): { company: string }[] {
  return Object.keys(COMPANY_GUIDE_META).map((company) => ({ company }))
}

// ── Company × type sub-pages (/companies/:company/:type) ───────────────────

/** TYPE_META map for the [type] route (label/iconKey/desc per type slug). */
export const COMPANY_TYPE_META: Record<string, CompanyTypeMeta> = {
  overview: { label: "Interview Overview", iconKey: "book-open", desc: "Process breakdown, what to expect, timeline" },
  dsa: { label: "DSA Preparation", iconKey: "code-2", desc: "Patterns tested, problem list, approach guide" },
  "system-design": { label: "System Design", iconKey: "target", desc: "Real SD questions asked, how to approach" },
  behavioral: { label: "Behavioral Questions", iconKey: "users", desc: "Culture-fit, leadership, past experience" },
  "java-backend": { label: "Java Backend", iconKey: "code-2", desc: "Java-specific questions this company asks" },
  "python-backend": { label: "Python Backend", iconKey: "code-2", desc: "Python-specific questions this company asks" },
  "react-specific": { label: "React / Frontend", iconKey: "brain", desc: "React, TypeScript, browser questions" },
  "azure-specific": { label: "Azure / Cloud", iconKey: "target", desc: "Azure-specific questions and scenarios" },
  "coding-rounds": { label: "Coding Rounds", iconKey: "code-2", desc: "What each coding round looks like" },
  "seed-stage": { label: "Seed Stage Startups", iconKey: "users", desc: "Early-stage interview expectations" },
  "series-a": { label: "Series A Startups", iconKey: "users", desc: "Series A interview expectations" },
  "series-b-plus": { label: "Series B+ Startups", iconKey: "users", desc: "Growth-stage interview expectations" },
}

/** Per-company list of available type slugs (the sibling nav). */
export const COMPANY_TYPES: Record<string, string[]> = {
  amazon: ["overview", "dsa", "system-design", "behavioral", "java-backend"],
  google: ["overview", "dsa", "system-design", "coding-rounds"],
  microsoft: ["overview", "dsa", "system-design", "azure-specific"],
  meta: ["overview", "dsa", "system-design", "react-specific"],
  startups: ["seed-stage", "series-a", "series-b-plus"],
}

const COMPANY_NAMES: Record<string, string> = {
  amazon: "Amazon", google: "Google", microsoft: "Microsoft",
  meta: "Meta", netflix: "Netflix", apple: "Apple", startups: "Startups",
}

const TYPE_FILE_MAP: Record<string, string> = {
  overview: "overview.json",
  dsa: "dsa-patterns.json",
  "system-design": "system-design.json",
  behavioral: "behavioral.json",
}

/** Resolve a company × type payload (returns content + metadata, no fs here). */
export function resolveCompanyType(
  company: string,
  type: string,
  content: Record<string, unknown> | null,
): CompanyTypePageData {
  const companyName = COMPANY_NAMES[company] ?? toTitle(company)
  const typeMeta = COMPANY_TYPE_META[type]
  const label = typeMeta?.label ?? toTitle(type)
  const siblingTypes = COMPANY_TYPES[company] ?? COMPANY_TYPES.default ?? [
    "overview",
    "dsa",
    "system-design",
    "behavioral",
  ]
  return {
    company,
    companyName,
    type,
    label,
    desc: typeMeta?.desc ?? null,
    iconKey: typeMeta?.iconKey ?? "book-open",
    siblingTypes,
    typeLabel: (slug: string) => COMPANY_TYPE_META[slug]?.label ?? toTitle(slug),
    content,
  }
}

export function companyTypeFileFor(type: string): string | undefined {
  return TYPE_FILE_MAP[type]
}

// ── helpers ────────────────────────────────────────────────────────────────

export function toTitle(s: string): string {
  return s.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase())
}

/** Default sibling-types list (used when a company isn't in COMPANY_TYPES). */
export const DEFAULT_COMPANY_TYPES = ["overview", "dsa", "system-design", "behavioral"] as const
