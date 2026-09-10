/**
 * Phase 15 — Learning surfaces V2 canonical data layer.
 *
 * Hoists the inline catalog arrays that previously lived inside
 *   app/roadmaps/page.tsx
 *   app/cheatsheets/page.tsx
 *   app/behavioral/page.tsx
 *   app/career/page.tsx
 *
 * Icon *components* are replaced by `iconKey` strings here; the rendering layer
 * (components/learning-v2/*) maps them back to Lucide components via ICON_MAP.
 * This keeps the data layer free of JSX imports.
 *
 * The prep hub is dynamic (built from PILLAR_HUBS + SEO_MODULES + live question
 * counts); its loader lives in learning-loaders.ts so the page stays a thin
 * server shell.
 */

import type {
  BehavioralCategory,
  CareerSection,
  CheatsheetEntry,
  CompanySpecific,
  DsaPlan,
  DomainRoadmap,
  QuickGuide,
  StarStep,
  TimelinePlan,
} from "./learning-types";

/* ── Roadmaps ── */

export const DOMAIN_ROADMAPS: readonly DomainRoadmap[] = [
  {
    slug: "java-backend",
    name: "Java Backend Engineer",
    levels: ["Beginner", "Intermediate", "Advanced"],
    stacks: "Spring Boot, Microservices, PostgreSQL, Kafka, Docker, AWS",
    gradient: "from-orange-50 dark:from-orange-950/40 ",
    weeks: "8-week plan per level",
  },
  {
    slug: "python-backend",
    name: "Python Backend Developer",
    levels: ["Beginner", "Intermediate", "Advanced"],
    stacks: "Django, FastAPI, PostgreSQL, Redis, Celery, AWS",
    gradient: "from-blue-500 to-blue-600",
    weeks: "8-week plan per level",
  },
  {
    slug: "javascript-frontend",
    name: "JavaScript Frontend Engineer",
    levels: ["Beginner", "Intermediate", "Advanced"],
    stacks: "React, TypeScript, Next.js, Testing, Performance",
    gradient: "from-yellow-400 to-orange-50 dark:to-orange-950/40",
    weeks: "8-week plan per level",
  },
  {
    slug: "python-data-engineering",
    name: "Python Data Engineer",
    levels: ["Beginner", "Intermediate", "Advanced"],
    stacks: "Spark, Airflow, Kafka, SQL, Data Modeling, dbt",
    gradient: " to-teal-600",
    weeks: "8-week plan per level",
  },
  {
    slug: "python-ml-ai",
    name: "Python ML/AI Engineer",
    levels: ["Beginner", "Intermediate", "Advanced"],
    stacks: "PyTorch, TensorFlow, MLOps, NLP, Computer Vision",
    gradient: "from-blue-50 dark:from-blue-950/40 ",
    weeks: "8-week plan per level",
  },
  {
    slug: "go-backend",
    name: "Go Backend Engineer",
    levels: ["Beginner", "Intermediate", "Advanced"],
    stacks: "Go, gRPC, Kubernetes, Docker, PostgreSQL",
    gradient: "from-blue-500 to-blue-600",
    weeks: "8-week plan per level",
  },
  {
    slug: "devops",
    name: "DevOps / SRE Engineer",
    levels: ["Beginner", "Intermediate", "Advanced"],
    stacks: "Kubernetes, Terraform, CI/CD, AWS, Monitoring, Linux",
    gradient: "from-slate-50 dark:from-slate-950/40 to-slate-700",
    weeks: "8-week plan per level",
  },
  {
    slug: "fullstack",
    name: "Full-Stack Engineer",
    levels: ["Beginner", "Intermediate", "Advanced"],
    stacks: "React, Node.js/Spring Boot, PostgreSQL, DevOps",
    gradient: "from-rose-50 dark:from-rose-950/40 ",
    weeks: "10-week plan per level",
  },
];

export const DSA_PLANS: readonly DsaPlan[] = [
  {
    slug: "blind-75",
    name: "Blind 75",
    count: 75,
    duration: "4-6 weeks",
    desc: "The original curated list covering all essential patterns. Best for time-constrained prep targeting top tech companies.",
    tag: "Most Popular",
    tagColor: "bg-amber-100 dark:bg-amber-950/20 text-amber-700 dark:text-amber-400",
  },
  {
    slug: "neetcode-150",
    name: "NeetCode 150",
    count: 150,
    duration: "8-10 weeks",
    desc: "Expanded Blind 75 with better coverage of edge cases and advanced patterns. Includes video explanations for every problem.",
    tag: "Comprehensive",
    tagColor: "bg-blue-100 dark:bg-blue-950/20 text-primary dark:text-primary",
  },
  {
    slug: "grind-75",
    name: "Grind 75",
    count: 75,
    duration: "4-8 weeks",
    desc: "Updated Blind 75 with customizable schedule. Sorted by estimated time and difficulty. Built by the Blind 75 creator.",
    tag: "Flexible",
    tagColor: "bg-green-100 dark:bg-green-950/20 text-green-700 dark:text-green-400",
  },
  {
    slug: "top-100-liked",
    name: "LeetCode Top 100 Liked",
    count: 100,
    duration: "6-8 weeks",
    desc: "Community-voted top problems. Good breadth across all major patterns with emphasis on frequently asked questions.",
    tag: "Community Pick",
    tagColor: "bg-blue-100 dark:bg-blue-950/20 text-primary dark:text-primary",
  },
  {
    slug: "dsa-foundations",
    name: "DSA Foundations (Beginner)",
    count: 50,
    duration: "4 weeks",
    desc: "Start here if you are new to DSA. Covers arrays, strings, hash maps, two pointers, and basic recursion with guided explanations.",
    tag: "Beginner",
    tagColor: "bg-emerald-100 dark:bg-emerald-950/20 text-emerald-700 dark:text-emerald-400",
  },
];

export const TIMELINE_PLANS: readonly TimelinePlan[] = [
  {
    duration: "2-Week Sprint",
    iconKey: "rocket",
    desc: "Last-minute FAANG prep. Focus on Blind 75 top 30, 5 system design problems, behavioral STAR stories. High-intensity daily plan.",
    ideal: "Interview in 2 weeks, need focused prep",
    color: "text-red-600",
    bg: "bg-red-100 dark:bg-red-950/20",
  },
  {
    duration: "4-Week Plan",
    iconKey: "trending-up",
    desc: "Balanced prep covering DSA patterns, system design fundamentals, behavioral prep, and 1 mock interview per week.",
    ideal: "Interview in 1 month, some prior prep",
    color: "text-amber-600 dark:text-amber-400",
    bg: "bg-amber-100 dark:bg-amber-950/20",
  },
  {
    duration: "8-Week Deep Dive",
    iconKey: "book-open",
    desc: "Comprehensive prep with deep mastery of all areas. DSA pattern-by-pattern, full system design course, behavioral bank complete.",
    ideal: "Planning ahead, want thorough preparation",
    color: "text-primary dark:text-primary",
    bg: "bg-blue-100 dark:bg-blue-950/20",
  },
  {
    duration: "12-Week Mastery",
    iconKey: "graduation-cap",
    desc: "Complete career transformation. Covers everything plus portfolio projects, resume optimization, networking, and negotiation prep.",
    ideal: "Career switch, targeting top companies",
    color: "text-emerald-600 dark:text-emerald-400",
    bg: "bg-emerald-100 dark:bg-emerald-950/20",
  },
];

/* ── Cheatsheets ── */

export const LANGUAGE_CHEATSHEETS: readonly CheatsheetEntry[] = [
  {
    slug: "java",
    name: "Java",
    desc: "Collections framework, Stream API, concurrency, design patterns, JVM internals, Spring Boot annotations",
    items: 8,
    iconKey: "code2",
    color: "text-orange-600 dark:text-orange-400",
    bg: "bg-orange-100 dark:bg-orange-950/20",
  },
  {
    slug: "python",
    name: "Python",
    desc: "Data structures, list comprehensions, decorators, generators, async/await, Django/FastAPI shortcuts",
    items: 7,
    iconKey: "code2",
    color: "text-primary dark:text-primary",
    bg: "bg-blue-100 dark:bg-blue-950/20",
  },
  {
    slug: "javascript",
    name: "JavaScript / TypeScript",
    desc: "Closures, prototypes, promises, async patterns, React hooks, TypeScript utility types, Node.js essentials",
    items: 6,
    iconKey: "code2",
    color: "text-yellow-600",
    bg: "bg-yellow-100 dark:bg-yellow-950/20",
  },
  {
    slug: "go",
    name: "Go",
    desc: "Goroutines, channels, interfaces, error handling, context package, testing patterns, module system",
    items: 5,
    iconKey: "code2",
    color: "text-primary",
    bg: "bg-cyan-100 dark:bg-cyan-950/20",
  },
  {
    slug: "sql",
    name: "SQL",
    desc: "JOIN types, window functions, CTEs, indexing strategies, query optimization, transaction isolation levels",
    items: 6,
    iconKey: "database",
    color: "text-emerald-600 dark:text-emerald-400",
    bg: "bg-emerald-100 dark:bg-emerald-950/20",
  },
];

export const CONCEPT_CHEATSHEETS: readonly CheatsheetEntry[] = [
  {
    slug: "system-design",
    name: "System Design Patterns",
    desc: "CAP theorem, consistency models, partitioning strategies, caching patterns, database selection flowchart",
    iconKey: "network",
    color: "text-emerald-600 dark:text-emerald-400",
    bg: "bg-emerald-100 dark:bg-emerald-950/20",
  },
  {
    slug: "big-o",
    name: "Big-O Complexity",
    desc: "Time and space complexity for all data structures and algorithms. Sorting comparisons, amortized analysis",
    iconKey: "cpu",
    color: "text-blue-600 dark:text-blue-400",
    bg: "bg-blue-100 dark:bg-blue-950/20",
  },
  {
    slug: "data-structures",
    name: "Data Structures",
    desc: "Arrays, linked lists, trees, graphs, heaps, tries, hash maps — operations, complexities, when to use what",
    iconKey: "layers",
    color: "text-primary dark:text-primary",
    bg: "bg-blue-100 dark:bg-blue-950/20",
  },
  {
    slug: "design-patterns",
    name: "Design Patterns",
    desc: "Singleton, Factory, Observer, Strategy, Builder, Decorator — when to use each with real-world examples",
    iconKey: "workflow",
    color: "text-primary",
    bg: "bg-blue-100 dark:bg-blue-950/20",
  },
  {
    slug: "api-design",
    name: "API Design",
    desc: "REST conventions, HTTP status codes, pagination, versioning, error responses, rate limiting headers",
    iconKey: "globe",
    color: "text-rose-600 dark:text-rose-400",
    bg: "bg-rose-100 dark:bg-rose-950/20",
  },
  {
    slug: "http-status-codes",
    name: "HTTP Status Codes",
    desc: "Complete reference: 2xx success, 3xx redirect, 4xx client error, 5xx server error with when-to-use guide",
    iconKey: "server",
    color: "text-amber-600 dark:text-amber-400",
    bg: "bg-amber-100 dark:bg-amber-950/20",
  },
];

export const TOOL_CHEATSHEETS: readonly CheatsheetEntry[] = [
  {
    slug: "git",
    name: "Git Commands",
    desc: "Branch, merge, rebase, cherry-pick, stash, bisect, reflog — the commands you need in interviews and daily work",
    iconKey: "git-branch",
    color: "text-orange-600 dark:text-orange-400",
    bg: "bg-orange-100 dark:bg-orange-950/20",
  },
  {
    slug: "docker",
    name: "Docker",
    desc: "Dockerfile best practices, multi-stage builds, docker-compose, networking, volume mounts, common commands",
    iconKey: "container",
    color: "text-primary dark:text-primary",
    bg: "bg-blue-100 dark:bg-blue-950/20",
  },
  {
    slug: "kubernetes",
    name: "Kubernetes",
    desc: "Pods, services, deployments, configmaps, secrets, ingress, kubectl commands, YAML templates",
    iconKey: "cloud",
    color: "text-primary",
    bg: "bg-blue-100 dark:bg-blue-950/20",
  },
  {
    slug: "linux",
    name: "Linux / Shell",
    desc: "File operations, process management, networking commands, permissions, piping, grep, awk, sed essentials",
    iconKey: "terminal",
    color: "text-muted-foreground",
    bg: "bg-surface",
  },
  {
    slug: "aws",
    name: "AWS Services",
    desc: "EC2, S3, Lambda, RDS, DynamoDB, SQS, SNS, CloudFront — when to use what, pricing traps, interview favorites",
    iconKey: "cloud",
    color: "text-amber-600 dark:text-amber-400",
    bg: "bg-amber-100 dark:bg-amber-950/20",
  },
  {
    slug: "security",
    name: "Security Essentials",
    desc: "OAuth 2.0 flows, JWT structure, HTTPS/TLS, CORS, XSS/CSRF prevention, encryption basics",
    iconKey: "shield",
    color: "text-red-600 dark:text-red-400",
    bg: "bg-red-100 dark:bg-red-950/20",
  },
];

export const TOTAL_CHEATSHEETS =
  LANGUAGE_CHEATSHEETS.length +
  CONCEPT_CHEATSHEETS.length +
  TOOL_CHEATSHEETS.length;

/* ── Behavioral ── */

export const BEHAVIORAL_CATEGORIES: readonly BehavioralCategory[] = [
  {
    slug: "leadership",
    name: "Leadership & Initiative",
    count: 12,
    desc: "Taking ownership, driving projects, influencing without authority, leading under pressure",
    iconKey: "star",
    color: "text-amber-600 dark:text-amber-400",
    bg: "bg-amber-100 dark:bg-amber-950/20",
  },
  {
    slug: "teamwork",
    name: "Teamwork & Collaboration",
    count: 10,
    desc: "Cross-functional work, resolving disagreements, building consensus, supporting teammates",
    iconKey: "users",
    color: "text-primary dark:text-primary",
    bg: "bg-blue-100 dark:bg-blue-950/20",
  },
  {
    slug: "conflict-resolution",
    name: "Conflict Resolution",
    count: 8,
    desc: "Handling disagreements, managing stakeholders, navigating difficult conversations",
    iconKey: "shield",
    color: "text-rose-600 dark:text-rose-400",
    bg: "bg-rose-100 dark:bg-rose-950/20",
  },
  {
    slug: "failure-learning",
    name: "Failure & Learning",
    count: 6,
    desc: "Discussing mistakes constructively, showing growth mindset, post-mortem culture",
    iconKey: "alert-triangle",
    color: "text-orange-600 dark:text-orange-400",
    bg: "bg-orange-100 dark:bg-orange-950/20",
  },
  {
    slug: "problem-solving",
    name: "Problem Solving",
    count: 8,
    desc: "Ambiguous situations, creative solutions, data-driven decisions, debugging production",
    iconKey: "lightbulb",
    color: "text-blue-600 dark:text-blue-400",
    bg: "bg-blue-100 dark:bg-blue-950/20",
  },
  {
    slug: "communication",
    name: "Communication",
    count: 6,
    desc: "Explaining technical concepts, presenting to executives, writing technical docs",
    iconKey: "message-square",
    color: "text-primary",
    bg: "bg-cyan-100 dark:bg-cyan-950/20",
  },
  {
    slug: "growth-adaptability",
    name: "Growth & Adaptability",
    count: 6,
    desc: "Learning new technologies, adapting to change, handling ambiguity, continuous improvement",
    iconKey: "trending-up",
    color: "text-green-600",
    bg: "bg-green-100 dark:bg-green-950/20",
  },
  {
    slug: "customer-focus",
    name: "Customer Focus",
    count: 5,
    desc: "User empathy, prioritizing customer impact, measuring outcomes, product thinking",
    iconKey: "heart",
    color: "text-primary",
    bg: "bg-pink-100 dark:bg-pink-950/20",
  },
  {
    slug: "time-management",
    name: "Prioritization & Time Management",
    count: 5,
    desc: "Managing competing priorities, estimating work, saying no, deadline management",
    iconKey: "target",
    color: "text-primary",
    bg: "bg-blue-100 dark:bg-blue-950/20",
  },
  {
    slug: "mentoring",
    name: "Mentoring & Development",
    count: 4,
    desc: "Coaching junior engineers, code reviews as teaching, fostering team growth",
    iconKey: "award",
    color: "text-teal-600",
    bg: "bg-teal-100 dark:bg-teal-950/20",
  },
];

export const COMPANY_SPECIFIC: readonly CompanySpecific[] = [
  {
    slug: "amazon-lp",
    name: "Amazon Leadership Principles",
    count: 16,
    desc: "All 16 LPs with behavioral question mapping. Customer Obsession, Ownership, Dive Deep, and more. The most behavioral-heavy interview in tech.",
    tag: "FAANG",
    tagColor: "bg-orange-100 dark:bg-orange-950/20 text-orange-700 dark:text-orange-400",
  },
  {
    slug: "google-behavioral",
    name: "Google — Googleyness & Leadership",
    count: 8,
    desc: "Google's unique behavioral dimensions: cognitive ability, role-related knowledge, Googleyness, and leadership signals they look for.",
    tag: "FAANG",
    tagColor: "bg-blue-100 dark:bg-blue-950/20 text-primary dark:text-primary",
  },
  {
    slug: "meta-behavioral",
    name: "Meta — Move Fast Culture",
    count: 8,
    desc: "Meta values impact and velocity. Questions focus on autonomy, driving impact, working at scale, and cross-functional collaboration.",
    tag: "FAANG",
    tagColor: "bg-blue-100 dark:bg-blue-950/20 text-primary dark:text-primary",
  },
  {
    slug: "microsoft-behavioral",
    name: "Microsoft — Growth Mindset",
    count: 6,
    desc: "Microsoft's culture emphasizes growth mindset, empathy, and customer obsession. Unique focus on inclusive leadership and accessibility.",
    tag: "FAANG",
    tagColor: "bg-emerald-100 dark:bg-emerald-950/20 text-emerald-700 dark:text-emerald-400",
  },
  {
    slug: "startup-behavioral",
    name: "Startups — Ownership & Scrappiness",
    count: 6,
    desc: "Startup interviews value resourcefulness, wearing multiple hats, handling ambiguity, and delivering with limited resources.",
    tag: "Startups",
    tagColor: "bg-blue-100 dark:bg-blue-950/20 text-primary dark:text-primary",
  },
];

export const STAR_STEPS: readonly StarStep[] = [
  {
    letter: "S",
    title: "Situation",
    desc: "Set the context. When and where did this happen? What was your role? Keep it concise — 2-3 sentences max.",
    color: "from-blue-400 to-blue-500",
  },
  {
    letter: "T",
    title: "Task",
    desc: "What was your specific responsibility? What challenge or goal were you facing? What were the stakes?",
    color: "from-blue-500 to-blue-600",
  },
  {
    letter: "A",
    title: "Action",
    desc: "What did YOU do? Be specific about your individual contribution. This should be 60% of your answer. Use 'I', not 'we'.",
    color: "from-blue-600 to-blue-700",
  },
  {
    letter: "R",
    title: "Result",
    desc: "What was the outcome? Quantify when possible (reduced latency by 40%, saved $50K/month). Include learnings.",
    color: "from-blue-700 to-blue-800",
  },
];

export const TOTAL_BEHAVIORAL_QUESTIONS = BEHAVIORAL_CATEGORIES.reduce(
  (sum, c) => sum + c.count,
  0,
);

/* ── Career ── */

export const CAREER_SECTIONS: readonly CareerSection[] = [
  {
    slug: "resume",
    name: "Resume & Portfolio",
    desc: "ATS-optimized resume templates, action verb lists, project descriptions that impress, GitHub portfolio strategy, LinkedIn optimization",
    iconKey: "file-text",
    color: "text-primary dark:text-primary",
    bg: "bg-blue-100 dark:bg-blue-950/20",
    articles: 8,
    highlight: "Includes downloadable templates",
  },
  {
    slug: "interview-process",
    name: "Interview Process Deep-Dive",
    desc: "Step-by-step breakdown of tech interview processes at 20+ companies. What to expect in each round, how to prepare, timeline management",
    iconKey: "search",
    color: "text-blue-600 dark:text-blue-400",
    bg: "bg-blue-100 dark:bg-blue-950/20",
    articles: 12,
    highlight: "FAANG + unicorn processes covered",
  },
  {
    slug: "negotiation",
    name: "Salary Negotiation Playbook",
    desc: "Evidence-based negotiation strategies. How to evaluate offers, negotiate base + equity + signing bonus, handle competing offers, know your leverage",
    iconKey: "dollar-sign",
    color: "text-emerald-600 dark:text-emerald-400",
    bg: "bg-emerald-100 dark:bg-emerald-950/20",
    articles: 6,
    highlight: "Scripts and email templates included",
  },
  {
    slug: "company-tiers",
    name: "Company Tier Rankings",
    desc: "How companies are tiered in the industry. FAANG vs Tier-2 vs startups. Compensation benchmarks, work-life balance, growth trajectories",
    iconKey: "building-2",
    color: "text-amber-600 dark:text-amber-400",
    bg: "bg-amber-100 dark:bg-amber-950/20",
    articles: 5,
    highlight: "2025 compensation data",
  },
  {
    slug: "career-transitions",
    name: "Career Transitions",
    desc: "Switching roles: frontend to backend, IC to management, big tech to startup, non-tech to tech. Framework for evaluating transitions",
    iconKey: "trending-up",
    color: "text-rose-600 dark:text-rose-400",
    bg: "bg-rose-100 dark:bg-rose-950/20",
    articles: 7,
    highlight: "Real transition stories",
  },
  {
    slug: "networking",
    name: "Networking & Referrals",
    desc: "How to get referrals without being spammy. Cold outreach templates, conference networking, building your professional brand",
    iconKey: "users",
    color: "text-primary dark:text-primary",
    bg: "bg-cyan-100 dark:bg-cyan-950/20",
    articles: 4,
    highlight: "Cold message templates",
  },
];

export const QUICK_GUIDES: readonly QuickGuide[] = [
  {
    title: "How to Write a One-Page Resume That Gets Callbacks",
    category: "Resume",
    readTime: "8 min read",
    slug: "one-page-resume",
    iconKey: "file-text",
  },
  {
    title: "The Counter-Offer Email Template That Works",
    category: "Negotiation",
    readTime: "5 min read",
    slug: "counter-offer-template",
    iconKey: "dollar-sign",
  },
  {
    title: "Amazon Interview: Complete Process Breakdown",
    category: "Process",
    readTime: "12 min read",
    slug: "amazon-process",
    iconKey: "search",
  },
  {
    title: "Should You Join a Startup or Big Tech?",
    category: "Transitions",
    readTime: "10 min read",
    slug: "startup-vs-big-tech",
    iconKey: "lightbulb",
  },
  {
    title: "How to Negotiate When You Have No Other Offers",
    category: "Negotiation",
    readTime: "7 min read",
    slug: "negotiate-single-offer",
    iconKey: "shield",
  },
  {
    title: "Building a GitHub Portfolio That Stands Out",
    category: "Resume",
    readTime: "6 min read",
    slug: "github-portfolio",
    iconKey: "star",
  },
  {
    title: "From Junior to Senior: 3-Year Acceleration Plan",
    category: "Growth",
    readTime: "15 min read",
    slug: "junior-to-senior",
    iconKey: "graduation-cap",
  },
  {
    title: "FAANG vs Non-FAANG: Total Comp Analysis 2025",
    category: "Compensation",
    readTime: "10 min read",
    slug: "faang-comp-analysis",
    iconKey: "award",
  },
];

export const CATEGORY_COLORS: Record<string, string> = {
  Resume: "bg-blue-100 dark:bg-blue-950/20 text-primary dark:text-primary",
  Negotiation:
    "bg-emerald-100 dark:bg-emerald-950/20 text-emerald-700 dark:text-emerald-400",
  Process: "bg-blue-100 dark:bg-blue-950/20 text-blue-700 dark:text-blue-400",
  Transitions: "bg-rose-100 dark:bg-rose-950/20 text-rose-700 dark:text-rose-400",
  Growth: "bg-amber-100 dark:bg-amber-950/20 text-amber-700 dark:text-amber-400",
  Compensation: "bg-cyan-100 dark:bg-cyan-950/20 text-primary dark:text-primary",
};

export const TOTAL_CAREER_ARTICLES = CAREER_SECTIONS.reduce(
  (s, sec) => s + sec.articles,
  0,
);
