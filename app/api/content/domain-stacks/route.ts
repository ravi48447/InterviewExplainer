import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { domainSlugToContentPath } from '@/lib/content-reader';
import { parseDomainSlug } from '@/lib/domain-display';
import { resolveStackContent } from '@/lib/contentV2';
import type { Level } from '@/lib/contentV2-types';

// Cache this route's HTTP response. Next.js will serve the cached body for up
// to `revalidate` seconds without re-running the handler (or the fs walk).
export const revalidate = 3600;

// Process-wide cache shared across HMR reloads in dev.
// A module-local Map gets wiped whenever Next.js invalidates this file's
// module, which forces an 8 s rescan on every navigation. Storing the cache
// on globalThis keeps it alive for the lifetime of the dev server.
const RESPONSE_CACHE_TTL_MS = 5 * 60 * 1000; // 5 minutes
const RESPONSE_CACHE_VERSION = 'locked-v2';
const g = globalThis as typeof globalThis & {
  _ie_domainStacksCache?: Map<string, { at: number; body: unknown }>;
};
g._ie_domainStacksCache ??= new Map();
const responseCache = g._ie_domainStacksCache;

// Browser cache — prevents the sidebar from refetching between
// question→question navigations inside the same domain.
const BROWSER_CACHE_CONTROL =
  'private, max-age=60, stale-while-revalidate=300';

function isStackVisible(stackDir: string): boolean {
  const cfg = path.join(stackDir, '_config.json');
  if (!fs.existsSync(cfg)) return true;
  try {
    const parsed = JSON.parse(fs.readFileSync(cfg, 'utf-8')) as { visible?: boolean };
    return parsed.visible !== false;
  } catch {
    return true;
  }
}

interface V2Meta {
  stack?: string;
  description?: string;
  level?: string;
  language?: string;
  track?: string;
  seoPrefix?: string;
  last_updated?: string;
}

/**
 * Read V2 meta from a complete-qa.json in the stack dir (flat) or first subdir.
 */
function readV2Meta(stackDir: string): V2Meta | null {
  // Flat: complete-qa.json directly in stack dir
  const directQA = path.join(stackDir, 'complete-qa.json');
  if (fs.existsSync(directQA)) {
    try {
      const data = JSON.parse(fs.readFileSync(directQA, 'utf-8'));
      if (data.meta) return data.meta as V2Meta;
    } catch {}
  }

  // Subcategory dirs: check first one that has complete-qa.json with meta
  try {
    for (const sub of fs.readdirSync(stackDir, { withFileTypes: true })) {
      if (!sub.isDirectory()) continue;
      const subQA = path.join(stackDir, sub.name, 'complete-qa.json');
      if (!fs.existsSync(subQA)) continue;
      try {
        const data = JSON.parse(fs.readFileSync(subQA, 'utf-8'));
        if (data.meta) return data.meta as V2Meta;
      } catch {}
    }
  } catch {}

  return null;
}

/**
 * Count questions in a stack directory.
 * Handles both V1 (subcategory dirs with questions.json/complete-qa.json)
 * and V2 (complete-qa.json directly in stack dir).
 */
function countVisibleQuestionsForStack(stackDir: string): number {
  if (!fs.existsSync(stackDir)) return 0;
  let total = 0;

  const directQA = path.join(stackDir, 'complete-qa.json');
  if (fs.existsSync(directQA)) {
    try {
      const data = JSON.parse(fs.readFileSync(directQA, 'utf-8'));
      if (Array.isArray(data)) {
        total += data.length;
      } else if (data.questions && Array.isArray(data.questions)) {
        total += data.questions.length;
      }
    } catch {}
  }

  try {
    for (const subcat of fs.readdirSync(stackDir, { withFileTypes: true })) {
      if (!subcat.isDirectory()) continue;
      const subcatDir = path.join(stackDir, subcat.name);
      const subcatCfg = path.join(subcatDir, '_config.json');
      if (fs.existsSync(subcatCfg)) {
        try {
          const cfg = JSON.parse(fs.readFileSync(subcatCfg, 'utf-8')) as { visible?: boolean };
          if (cfg.visible === false) continue;
        } catch {}
      }

      const subcatQA = path.join(subcatDir, 'complete-qa.json');
      if (fs.existsSync(subcatQA)) {
        try {
          const data = JSON.parse(fs.readFileSync(subcatQA, 'utf-8'));
          if (Array.isArray(data)) {
            total += data.length;
            continue;
          } else if (data.questions && Array.isArray(data.questions)) {
            total += data.questions.length;
            continue;
          }
        } catch {}
      }

      const qfile = path.join(subcatDir, 'questions.json');
      if (!fs.existsSync(qfile)) continue;
      try {
        const raw = JSON.parse(fs.readFileSync(qfile, 'utf-8'));
        const arr: Array<{ visible?: boolean }> = Array.isArray(raw) ? raw : (raw.questions ?? []);
        total += arr.filter((q) => q.visible !== false).length;
      } catch {}
    }
  } catch {}
  return total;
}

// The upstream repository runs Next.js from frontend/, while this worktree is
// flattened and runs from the repository root. Resolve both layouts so the
// main-branch curriculum road always reads the real content tree.
const REPOSITORY_ROOT = fs.existsSync(path.join(process.cwd(), 'content'))
  ? process.cwd()
  : path.resolve(process.cwd(), '..');
const CONTENT_ROOT = path.join(REPOSITORY_ROOT, 'content', 'domains');
const CONTENT_INTERVIEW_ROOT = path.join(REPOSITORY_ROOT, 'content', 'interview');

// ─── Locked-domain registry (mirrors lib/content-reader.ts) ──────────────────
// Each locked domain has a flat tree content/<domainSlug>/<moduleSlug>/<topic>
// and a _index.json that declares the curriculum + optional content-reuse
// across locked domains (e.g. JFI's reused modules point back to JBI).
const CONTENT_JBI_ROOT = path.join(REPOSITORY_ROOT, 'content', 'java-backend-intermediate');
const CONTENT_JFI_ROOT = path.join(REPOSITORY_ROOT, 'content', 'java-fullstack-intermediate');
const CONTENT_JBF_ROOT = path.join(REPOSITORY_ROOT, 'content', 'java-backend-fresher');
const CONTENT_RBI_ROOT = path.join(REPOSITORY_ROOT, 'content', 'ruby-backend-intermediate');
const CONTENT_RBF_ROOT = path.join(REPOSITORY_ROOT, 'content', 'ruby-backend-fresher');
const CONTENT_GOI_ROOT = path.join(REPOSITORY_ROOT, 'content', 'go-intermediate');
const CONTENT_GOF_ROOT = path.join(REPOSITORY_ROOT, 'content', 'go-fresher');
const CONTENT_JFF_ROOT = path.join(REPOSITORY_ROOT, 'content', 'java-fullstack-fresher');
const CONTENT_FEI_ROOT = path.join(REPOSITORY_ROOT, 'content', 'frontend-intermediate');
const CONTENT_FEF_ROOT = path.join(REPOSITORY_ROOT, 'content', 'frontend-fresher');
const CONTENT_PBI_ROOT = path.join(REPOSITORY_ROOT, 'content', 'python-backend-intermediate');
const CONTENT_PBF_ROOT = path.join(REPOSITORY_ROOT, 'content', 'python-backend-fresher');

const LOCKED_DOMAIN_ROOTS: Record<string, string> = {
  'java-backend-intermediate':   CONTENT_JBI_ROOT,
  'java-fullstack-intermediate': CONTENT_JFI_ROOT,
  'java-backend-fresher':        CONTENT_JBF_ROOT,
  'ruby-backend-intermediate':   CONTENT_RBI_ROOT,
  'ruby-backend-fresher':        CONTENT_RBF_ROOT,
  'go-intermediate':             CONTENT_GOI_ROOT,
  'go-fresher':                  CONTENT_GOF_ROOT,
  'java-fullstack-fresher':      CONTENT_JFF_ROOT,
  'frontend-intermediate':       CONTENT_FEI_ROOT,
  'frontend-fresher':            CONTENT_FEF_ROOT,
  'python-backend-intermediate': CONTENT_PBI_ROOT,
  'python-backend-fresher':      CONTENT_PBF_ROOT,
};

const DISPLAY_NAME_OVERRIDES: Record<string, string> = {
  // ── Pillar 1: Java Language & Core (Modules 01-05) ──────────────────────
  'java-fundamentals': 'Core Java',
  'collections-data-structures': 'Java Collections & Algorithms',
  'java-streams-modern': 'Java Streams, Lambdas & Modern Java (8-21)',
  'concurrency-multithreading': 'Java Concurrency & Multithreading',
  'jvm-internals-performance': 'JVM Internals & Performance',

  // ── Pillar 2: Spring Ecosystem (Modules 06-09) ───────────────────────────
  'spring-core': 'Spring Core & IoC',
  'spring-boot': 'Spring Boot',
  'data-persistence-jpa-hibernate': 'Spring Data, JPA & Hibernate',
  'spring-security': 'Spring Security & Identity',
  'spring-batch': 'Spring Batch',

  // ── Pillar 3: Data & Persistence (Modules 10-12) ─────────────────────────
  'database-design': 'SQL & Database Design',
  'mysql': 'MySQL',
  'postgresql': 'PostgreSQL',
  'mongodb': 'NoSQL & MongoDB',
  'elasticsearch': 'Elasticsearch & Search',
  'redis': 'Redis & Caching',

  // ── Pillar 4: APIs & Messaging (Modules 13-15) ───────────────────────────
  'rest-apis-spring-mvc': 'REST API Design & Spring MVC',
  'graphql': 'GraphQL',
  'grpc': 'gRPC',
  'microservices': 'Microservices Architecture',
  'spring-cloud': 'Spring Cloud & Service Discovery',
  'event-driven-architecture': 'Event-Driven Architecture',
  'spring-kafka': 'Apache Kafka & Spring Kafka',
  'rabbitmq': 'RabbitMQ & Spring AMQP',
  'websockets': 'WebSockets & Real-Time',

  // ── Pillar 5: Architecture & Design (Modules 16-17) ──────────────────────
  'design-patterns': 'Design Patterns & SOLID',
  'clean-architecture': 'Clean & Hexagonal Architecture',
  'domain-driven-design': 'Domain-Driven Design (DDD)',
  'architecture-patterns': 'Architecture Patterns & Principles',

  // ── Pillar 6: System Design (Modules 18-19) ──────────────────────────────
  'fundamentals-building-blocks': 'System Design Fundamentals',
  'hld-design-problems': 'System Design Case Studies',
  'lld-component-design': 'Low-Level Component Design',

  // ── Pillar 7: Security (Module 20) ───────────────────────────────────────
  'application-security': 'Application Security & OWASP',

  // ── Pillar 8: Testing & Quality (Modules 21-22) ──────────────────────────
  'testing': 'Testing Foundations (JUnit, Mockito, Spring Test)',
  'advanced-testing': 'Advanced Testing Strategies',

  // ── Pillar 9: DevOps (Modules 23-26) ─────────────────────────────────────
  'git': 'Git & Version Control',
  'build-tools': 'Build Tools (Maven & Gradle)',
  'ci-cd-pipelines': 'CI/CD Pipelines',
  'terraform': 'Infrastructure as Code (Terraform)',
  'docker': 'Containers & Docker',
  'kubernetes': 'Kubernetes & Orchestration',

  // ── Pillar 10: Cloud (Modules 27-28) ─────────────────────────────────────
  'aws': 'AWS & Cloud Platforms',
  'azure': 'Azure',
  'gcp': 'Google Cloud Platform',

  // ── Pillar 11: Production (Modules 29-30) ────────────────────────────────
  'observability-monitoring': 'Observability & Monitoring',
  'production-operations': 'Production Operations & SRE',
  'performance-tuning': 'Performance Tuning',

  // ── Pillar 12: Professional (Modules 31-32) ──────────────────────────────
  'engineering-practices': 'Engineering Practices',
  'behavioral': 'Behavioral & Leadership',

  // ── New locked JBI module slugs (per content/ARCHITECTURE.md) ────────────
  'java-collections':      'Java Collections & Data Structures',
  'java-streams':          'Java Streams, Lambdas & Modern Java',
  'java-concurrency':      'Java Concurrency & Multithreading',
  'jvm-internals':         'JVM Internals & Performance',
  'spring-data-jpa':       'Spring Data, JPA & Hibernate',
  'rest-api':              'REST API Design & Spring MVC',
  'messaging-events':      'Messaging & Event-Driven Architecture',
  'redis-caching':         'Redis & Caching',
  'cicd':                  'CI/CD Pipelines',
  'aws-cloud':             'AWS & Cloud Platforms',
  'production-sre':        'Production Operations & SRE',
  'git-build-tools':       'Git, Maven & Gradle',
  'cloud-native':          'Cloud Deployment & Cloud-Native',
  'unit-testing':          'Unit & Integration Testing',
  'system-design-basics':  'System Design Fundamentals',
  'system-design-cases':   'System Design Case Studies',
  'low-level-design':      'Low-Level Design (LLD)',

  // ── Legacy / shared slugs ─────────────────────────────────────────────────
  'core-java': 'Core Java',
  'advanced-java': 'Advanced Java',
  'spring-data': 'Spring Data JPA',
  'spring-mvc-rest': 'Spring MVC & REST APIs',
  'spring-data-hibernate': 'Spring Data & Hibernate',
  'rest-api-web': 'REST API & Web',
  'sql': 'SQL & Databases',
  'sql-databases': 'SQL & Databases',
  'database': 'Database',
  'database-sql': 'Database & SQL',
  'jvm-performance': 'JVM & Performance',
  'kafka': 'Apache Kafka',
  'devops-cicd': 'DevOps & CI/CD',
  'caching-performance': 'Caching & Performance',
  'collections': 'Java Collections',
  'jvm': 'JVM Internals',
  'react': 'React',
  'nextjs': 'Next.js',
  'typescript': 'TypeScript',
  'javascript': 'JavaScript',
  'python': 'Python',
  'django': 'Django',
  'fastapi': 'FastAPI',
  'flask': 'Flask',
  'goroutines': 'Go Concurrency',
  'go-basics': 'Go Fundamentals',
  'csharp-fundamentals': 'C# Fundamentals',
  'aspnet-basics': 'ASP.NET Core',
  'ba-fundamentals': 'BA Fundamentals',
  'requirements-basics': 'Requirements Engineering',
  'requirements-gathering': 'Requirements Gathering',
  'stakeholder-management': 'Stakeholder Management',
  'agile-jira': 'Agile & JIRA',
  'agile-scrum': 'Agile & Scrum',
  'process-mapping': 'Process Mapping',
  'sql-basics': 'SQL Basics',
  'sql-analytics': 'SQL Analytics',
  'sql-advanced': 'SQL Advanced',
  'case-studies': 'Case Studies',
  'maven-gradle': 'Maven & Gradle',
  'event-driven': 'Event-Driven Architecture',
  'system-design': 'System Design',
  'microservices-advanced': 'Advanced Microservices',
};

function toDisplayName(slug: string): string {
  if (DISPLAY_NAME_OVERRIDES[slug]) return DISPLAY_NAME_OVERRIDES[slug];
  const stripped = stripNumericPrefix(slug);
  if (DISPLAY_NAME_OVERRIDES[stripped]) return DISPLAY_NAME_OVERRIDES[stripped];
  return stripped
    .replace(/-/g, ' ')
    .replace(/\b\w/g, c => c.toUpperCase());
}

function categoriseStack(slug: string): string {
  if (/^spring/.test(slug)) return 'Spring Ecosystem';
  if (/^core-java|^collections|^jvm|^advanced-java|^concurrency/.test(slug)) return 'Java Core';
  if (/^sql|^postgresql|^mysql|^mongodb|^database|^spring-data|^hibernate|^elasticsearch/.test(slug)) return 'Data & Persistence';
  if (/^micro|^system-design|^architecture|^design-pattern|^clean-arch|^domain-driven|^ddd/.test(slug)) return 'Architecture';
  if (/^testing|^junit|^pytest|^jest/.test(slug)) return 'Testing';
  if (/^security/.test(slug)) return 'Security';
  if (/^aws|^gcp|^azure|^docker|^git|^maven|^gradle|^devops|^cloud|^kubernetes|^ci-cd|^jenkins|^github-actions|^terraform|^ansible|^helm|^nginx|^linux|^prometheus/.test(slug)) return 'DevOps & Cloud';
  if (/^kafka|^rabbitmq|^rest|^graphql|^grpc|^websocket|^event|^messaging/.test(slug)) return 'APIs & Messaging';
  if (/^redis|^caching|^observ|^production|^logging|^performance/.test(slug)) return 'Performance & Ops';
  if (/^react|^angular|^vue|^nextjs|^svelte|^typescript-frontend|^html|^css|^web-|^accessibility|^state-management/.test(slug)) return 'Frontend';
  if (/^python-fund|^python-oop|^python-async|^python-data|^python-typing|^pydantic/.test(slug)) return 'Python Core';
  if (/^django|^fastapi|^flask|^celery|^sqlalchemy/.test(slug)) return 'Python Frameworks';
  if (/^goroutines|^go-|^channels|^interfaces/.test(slug)) return 'Go Core';
  if (/^kotlin-/.test(slug)) return 'Kotlin Core';
  if (/^csharp|^aspnet|^dotnet/.test(slug)) return 'C# / .NET';
  if (/^ruby|^rails|^sinatra|^sidekiq|^rspec/.test(slug)) return 'Ruby Ecosystem';
  if (/^airflow|^spark|^dbt|^pandas|^data-pipeline|^warehouse/.test(slug)) return 'Data Engineering';
  if (/^mlops|^model-|^llm|^feature-|^vector-|^ai-/.test(slug)) return 'ML & AI';
  if (/^ba-|^requirements|^stakeholder|^process-|^agile|^jira|^case-/.test(slug)) return 'Business Analysis';
  if (/^sql-analytics|^python-analysis|^visualization|^tableau|^power-bi/.test(slug)) return 'Data Analytics';
  if (/^behavioral/.test(slug)) return 'Soft Skills';
  if (/^typescript$|^javascript$|^python$/.test(slug)) return 'Language Core';
  return 'Other';
}

interface CurriculumModule {
  dir: string;
  title: string;
  topic_count: number;
  question_count: number;
}

interface CurriculumData {
  modules: CurriculumModule[];
  total_modules?: number;
  total_topics?: number;
  total_questions?: number;
}

interface ModuleConfig {
  module?: string;
  title?: string;
  description?: string;
  sequence?: number;
  topics?: Array<{ dir: string; title: string; question_count?: number; focus?: string[] }> | string[];
}

/**
 * _config.json (and _index.json entry) shape used by the locked trees
 * (per content/ARCHITECTURE.md). Topics is a plain string[].
 *
 * `contentSource` lets a module delegate to another locked domain — e.g.
 * java-fullstack-intermediate's `spring-boot` entry sets
 * `contentSource: { domain: "java-backend-intermediate", moduleSlug: "spring-boot" }`
 * so no content files are duplicated.
 */
interface LockedModuleConfig {
  moduleNumber: string;   // e.g. "M07"
  pillar: string;         // e.g. "P02"
  pillarName: string;     // e.g. "Spring Ecosystem"
  moduleSlug: string;
  title: string;
  appUrl: string;
  seoSlug: string;
  seoUrl: string;
  altSlugs: string[];
  altUrls: string[];
  topics: string[];
  contentSource?: { domain: string; moduleSlug: string };
}

interface LockedIndexFile {
  appRoot?: string;
  totalModules?: number;
  reusedFrom?: string;
  modules: LockedModuleConfig[];
}

function stripNumericPrefix(slug: string): string {
  return slug.replace(/^\d+-/, '');
}

function readModuleConfig(moduleDir: string): ModuleConfig | null {
  const cfg = path.join(moduleDir, '_config.json');
  if (!fs.existsSync(cfg)) return null;
  try {
    return JSON.parse(fs.readFileSync(cfg, 'utf-8')) as ModuleConfig;
  } catch {
    return null;
  }
}

/**
 * Build categories from _curriculum.json: modules → categories, topics → stacks.
 */
function buildCurriculumCategories(
  interviewDir: string,
  parsed: ReturnType<typeof parseDomainSlug>,
): { stacks: ReturnType<typeof buildStack>[]; categories: Array<{ id: number; name: string; slug: string; stacks: ReturnType<typeof buildStack>[] }> } | null {
  const curriculumPath = path.join(interviewDir, '_curriculum.json');
  if (!fs.existsSync(curriculumPath)) return null;

  let curriculum: CurriculumData;
  try {
    curriculum = JSON.parse(fs.readFileSync(curriculumPath, 'utf-8')) as CurriculumData;
  } catch {
    return null;
  }

  if (!curriculum.modules || curriculum.modules.length === 0) return null;

  const allStacks: ReturnType<typeof buildStack>[] = [];
  const categories: Array<{ id: number; name: string; slug: string; stacks: ReturnType<typeof buildStack>[] }> = [];

  let stackId = 1;
  for (let mi = 0; mi < curriculum.modules.length; mi++) {
    const mod = curriculum.modules[mi];
    const moduleDir = path.join(interviewDir, mod.dir);
    if (!fs.existsSync(moduleDir)) continue;

    const modConfig = readModuleConfig(moduleDir);
    const categoryName = modConfig?.title ?? toDisplayName(mod.dir);
    const categorySlug = stripNumericPrefix(mod.dir);
    const catStacks: ReturnType<typeof buildStack>[] = [];

    // Scan topic directories within the module
    const topicDirs = fs.readdirSync(moduleDir, { withFileTypes: true })
      .filter(e => e.isDirectory() && !e.name.startsWith('_'))
      .sort((a, b) => a.name.localeCompare(b.name));

    for (const topicEntry of topicDirs) {
      const topicDir = path.join(moduleDir, topicEntry.name);
      const qCount = countVisibleQuestionsForStack(topicDir);
      if (qCount === 0) continue;

      const topicMeta = readV2Meta(topicDir);
      const topicsList = modConfig?.topics;
      const topicConfig = Array.isArray(topicsList) && typeof topicsList[0] === 'object'
        ? (topicsList as Array<{ dir: string; title: string; question_count?: number; focus?: string[] }>)
            .find(t => t.dir === topicEntry.name)
        : undefined;
      const topicDisplayName = topicConfig?.title
        ?? DISPLAY_NAME_OVERRIDES[stripNumericPrefix(topicEntry.name)]
        ?? toDisplayName(topicEntry.name);

      const stack = buildStack(
        stackId++,
        topicEntry.name,
        topicDisplayName,
        topicMeta?.description ?? topicConfig?.focus?.join(', ') ?? null,
        qCount,
        categoryName,
      );

      catStacks.push(stack);
      allStacks.push(stack);
    }

    if (catStacks.length > 0) {
      categories.push({
        id: mi + 1,
        name: categoryName,
        slug: categorySlug,
        stacks: catStacks,
      });
    }
  }

  return { stacks: allStacks, categories };
}

function buildStack(
  id: number,
  slug: string,
  name: string,
  description: string | null,
  questionCount: number,
  category: string,
) {
  return {
    id,
    slug,
    name,
    description,
    iconUrl: null as string | null,
    questionCount,
    category,
  };
}

/**
 * Resolve the absolute on-disk directory for a locked module, following
 * `contentSource` fallbacks (used for reused modules like
 * JFI's `spring-boot` → JBI's `spring-boot`). Returns null when nothing
 * resolves to a real folder.
 */
function resolveLockedModuleDir(domainSlug: string, moduleSlug: string): string | null {
  const rootDir = LOCKED_DOMAIN_ROOTS[domainSlug];
  if (!rootDir) return null;

  const indexPath = path.join(rootDir, '_index.json');
  if (fs.existsSync(indexPath)) {
    try {
      const index = JSON.parse(fs.readFileSync(indexPath, 'utf-8')) as LockedIndexFile;
      const entry = index.modules.find(m => m.moduleSlug === moduleSlug);
      if (entry?.contentSource && entry.contentSource.domain !== domainSlug) {
        return resolveLockedModuleDir(entry.contentSource.domain, entry.contentSource.moduleSlug);
      }
    } catch {}
  }

  const localDir = path.join(rootDir, moduleSlug);
  return fs.existsSync(localDir) ? localDir : null;
}

/**
 * Scan a locked tree (JBI, JFI, …) and return pillar-grouped categories.
 * Each module (spring-boot, core-java, …) becomes a "stack"; its pillar
 * (P01…P18) becomes the category.
 *
 * Strategy:
 *  - When _index.json exists, iterate it (authoritative curriculum order,
 *    supports `contentSource` for reused modules with no local folder).
 *  - Otherwise fall back to an on-disk directory scan for backward compat.
 *
 * Empty modules (question_count === 0) are hidden from the listing but left
 * on disk so they can be populated later without schema churn.
 */
function buildLockedDomainCategories(domainSlug: string): {
  stacks: ReturnType<typeof buildStack>[];
  categories: Array<{ id: number; name: string; slug: string; stacks: ReturnType<typeof buildStack>[] }>;
} | null {
  const rootDir = LOCKED_DOMAIN_ROOTS[domainSlug];
  if (!rootDir || !fs.existsSync(rootDir)) return null;

  // `order` preserves the position of the module within _index.json so
  // modules *inside* a pillar stay in the authored curriculum order.
  // Pillar *sections* on the track landing page are sorted by pillar
  // code (P01…P18) so frontend pillars (P13–P18) always read in a stable
  // stack order even when JS/TS modules appear before Web Foundations in
  // the flat curriculum list.
  type Row = {
    order: number;
    /** P01…P18 from _index.json — drives stable pillar section order on the track UI. */
    pillar: string;
    pillarName: string;
    moduleNumber: string;
    stack: ReturnType<typeof buildStack>;
  };
  const rows: Row[] = [];
  let stackId = 1;

  const indexPath = path.join(rootDir, '_index.json');
  let index: LockedIndexFile | null = null;
  if (fs.existsSync(indexPath)) {
    try { index = JSON.parse(fs.readFileSync(indexPath, 'utf-8')) as LockedIndexFile; } catch {}
  }

  if (index) {
    // ── Authoritative path: drive the listing from _index.json ──
    //
    // IMPORTANT: In a locked domain (JBI / JFI) the _index.json is the
    // curriculum contract. Modules declared there always appear on the
    // track landing page — even when they have no on-disk folder or no
    // questions yet. This keeps the full pillar/module map visible
    // (e.g. JFI's React, Angular, JavaScript, Web Foundations, Frontend
    // Build modules that are scaffolded but not yet authored). The
    // per-module landing page renders its own "Content in progress"
    // banner for truly empty modules.
    for (let i = 0; i < index.modules.length; i++) {
      const entry = index.modules[i];
      const moduleDir = resolveLockedModuleDir(domainSlug, entry.moduleSlug);

      // Only honour explicit `visible: false` overrides when the module
      // actually has a folder to read a _config.json from. Missing
      // folders are treated as "scaffolded, empty", not hidden.
      if (moduleDir && !isStackVisible(moduleDir)) continue;

      const qCount = moduleDir ? countVisibleQuestionsForStack(moduleDir) : 0;

      const name = entry.title ?? DISPLAY_NAME_OVERRIDES[entry.moduleSlug] ?? toDisplayName(entry.moduleSlug);
      rows.push({
        order: i,
        pillar: entry.pillar ?? 'P99',
        pillarName: entry.pillarName ?? 'Other',
        moduleNumber: entry.moduleNumber ?? 'M99',
        stack: buildStack(stackId++, entry.moduleSlug, name, null, qCount, entry.pillarName ?? 'Other'),
      });
    }
  } else {
    // ── Fallback: on-disk module scan (legacy JBI behavior) ──
    //
    // Without an _index.json we have no authored priority, so we fall
    // back to pillar-code order. We derive a synthetic `order` from
    // (pillar, moduleNumber) so the final sort key stays consistent.
    type LegacyRow = Row;
    const legacyRows: LegacyRow[] = [];
    for (const entry of fs.readdirSync(rootDir, { withFileTypes: true })) {
      if (!entry.isDirectory()) continue;
      if (entry.name.startsWith('_') || entry.name.startsWith('.')) continue;

      // Obscure path construction to avoid Next.js over-bundling warnings.
      const moduleDir = [rootDir, entry.name].join('/');
      if (!isStackVisible(moduleDir)) continue;

      const cfgPath = path.join(moduleDir, '_config.json');
      let cfg: LockedModuleConfig | null = null;
      if (fs.existsSync(cfgPath)) {
        try { cfg = JSON.parse(fs.readFileSync(cfgPath, 'utf-8')) as LockedModuleConfig; } catch {}
      }

      const qCount = countVisibleQuestionsForStack(moduleDir);
      if (qCount === 0) continue;

      const name = cfg?.title ?? DISPLAY_NAME_OVERRIDES[entry.name] ?? toDisplayName(entry.name);
      legacyRows.push({
        order: 0, // replaced below
        pillar: cfg?.pillar ?? 'P99',
        pillarName: cfg?.pillarName ?? 'Other',
        moduleNumber: cfg?.moduleNumber ?? 'M99',
        stack: buildStack(stackId++, entry.name, name, null, qCount, cfg?.pillarName ?? 'Other'),
      });
    }
    legacyRows.sort((a, b) => {
      if (a.pillar !== b.pillar) return a.pillar.localeCompare(b.pillar);
      return a.moduleNumber.localeCompare(b.moduleNumber);
    });
    legacyRows.forEach((r, idx) => { r.order = idx; rows.push(r); });
  }

  if (rows.length === 0) return null;

  // Authored order (see Row.order comment above) is the single source of
  // truth for sequencing. This makes _index.json's module array the
  // authoritative priority ladder.
  rows.sort((a, b) => a.order - b.order);

  const byPillar = new Map<string, Row[]>();
  for (const r of rows) {
    if (!byPillar.has(r.pillarName)) byPillar.set(r.pillarName, []);
    byPillar.get(r.pillarName)!.push(r);
  }

  const pillarSortKey = new Map<string, string>();
  for (const r of rows) {
    const prev = pillarSortKey.get(r.pillarName);
    const p = r.pillar;
    if (prev === undefined || p.localeCompare(prev) < 0) {
      pillarSortKey.set(r.pillarName, p);
    }
  }

  const sortedPillarGroups = [...byPillar.entries()]
    .map(([pillarName, pillarRows]) => ({
      pillarName,
      pillarRows,
      sortKey: pillarSortKey.get(pillarName) ?? 'P99',
    }))
    .sort((a, b) => a.sortKey.localeCompare(b.sortKey));

  const categories: Array<{ id: number; name: string; slug: string; stacks: ReturnType<typeof buildStack>[] }> =
    sortedPillarGroups.map((g, i) => ({
      id: i + 1,
      name: g.pillarName,
      slug: g.pillarName.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      stacks: g.pillarRows.map((r) => r.stack),
    }));

  return { stacks: rows.map(r => r.stack), categories };
}

/**
 * GET /api/content/domain-stacks?domainSlug=java-backend-intermediate
 *
 * If a _curriculum.json exists, uses it for module-aware categories and ordering.
 * Otherwise falls back to scanning + regex categorization.
 */
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const domainSlug = searchParams.get('domainSlug');

  if (!domainSlug) {
    return NextResponse.json({ error: 'Missing domainSlug' }, { status: 400 });
  }

  const jsonInit = {
    headers: { 'Cache-Control': BROWSER_CACHE_CONTROL },
  };
  const responseCacheKey = `${domainSlug}::${RESPONSE_CACHE_VERSION}`;

  // In-process cache hit — skip the entire fs walk.
  const cached = responseCache.get(responseCacheKey);
  if (cached && Date.now() - cached.at < RESPONSE_CACHE_TTL_MS) {
    return NextResponse.json(cached.body, jsonInit);
  }

  // ── Locked domain trees take precedence (JBI, JFI, …) ───────────────────
  if (domainSlug in LOCKED_DOMAIN_ROOTS) {
    const locked = buildLockedDomainCategories(domainSlug);
    if (locked) {
      responseCache.set(responseCacheKey, { at: Date.now(), body: locked });
      return NextResponse.json(locked, jsonInit);
    }
    // If the locked tree has no populated modules yet, fall through to legacy
    // so the UI is never empty during the transition.
  }

  const contentPath = domainSlugToContentPath(domainSlug);
  if (!contentPath) {
    return NextResponse.json({ error: 'Cannot resolve content path' }, { status: 400 });
  }

  const parsed = parseDomainSlug(domainSlug);

  // Try curriculum-aware path first
  const interviewDir = path.join(CONTENT_INTERVIEW_ROOT, contentPath);
  if (fs.existsSync(interviewDir)) {
    const curriculumResult = buildCurriculumCategories(interviewDir, parsed);
    if (curriculumResult) {
      responseCache.set(responseCacheKey, { at: Date.now(), body: curriculumResult });
      return NextResponse.json(curriculumResult, jsonInit);
    }
  }

  // ─── Fallback: legacy scanning + regex categorization ────────────────────
  const stackSlugs = new Set<string>();
  const stackDirMap = new Map<string, string>();
  const stackMetaMap = new Map<string, V2Meta>();

  const domainDir = path.join(CONTENT_ROOT, contentPath);
  if (fs.existsSync(domainDir)) {
    for (const e of fs.readdirSync(domainDir, { withFileTypes: true })) {
      if (e.isDirectory() && isStackVisible(path.join(domainDir, e.name))) {
        stackSlugs.add(e.name);
        stackDirMap.set(e.name, path.join(domainDir, e.name));
      }
    }
  }

  if (fs.existsSync(interviewDir)) {
    for (const e of fs.readdirSync(interviewDir, { withFileTypes: true })) {
      if (!e.isDirectory() || !isStackVisible(path.join(interviewDir, e.name))) continue;
      const v2Dir = path.join(interviewDir, e.name);

      let hasContent = countVisibleQuestionsForStack(v2Dir) > 0;

      if (!hasContent && parsed) {
        const v2Content = resolveStackContent(
          parsed.langSlug, parsed.trackSlug, parsed.levelKey as Level, e.name
        );
        hasContent = !!v2Content && v2Content.questions.length > 0;
      }

      if (hasContent) {
        stackSlugs.add(e.name);
        stackDirMap.set(e.name, v2Dir);
      }
    }
  }

  for (const [slug, dir] of stackDirMap) {
    const meta = readV2Meta(dir);
    if (meta) stackMetaMap.set(slug, meta);
  }

  const sortedSlugs = [...stackSlugs].sort();

  const stacks = sortedSlugs
    .map((slug, idx) => {
      const meta = stackMetaMap.get(slug);
      const displayName = toDisplayName(slug);
      const v2Name = meta?.stack && meta.stack !== slug && !DISPLAY_NAME_OVERRIDES[slug] ? meta.stack : null;

      let qCount = countVisibleQuestionsForStack(stackDirMap.get(slug)!);
      if (parsed) {
        const v2Content = resolveStackContent(
          parsed.langSlug, parsed.trackSlug, parsed.levelKey as Level, slug
        );
        if (v2Content && v2Content.questions.length > qCount) {
          qCount = v2Content.questions.length;
        }
      }

      return {
        id: idx + 1,
        slug,
        name: v2Name ?? displayName,
        description: meta?.description ?? null,
        iconUrl: null as string | null,
        questionCount: qCount,
        category: categoriseStack(slug),
      };
    })
    .filter(s => s.questionCount > 0);

  const categoryMap = new Map<string, typeof stacks>();
  for (const stack of stacks) {
    if (!categoryMap.has(stack.category)) categoryMap.set(stack.category, []);
    categoryMap.get(stack.category)!.push(stack);
  }

  const ORDER = [
    'Language Core',
    'Spring Ecosystem',
    'Java Core',
    'Python Core',
    'Python Frameworks',
    'Go Core',
    'Kotlin Core',
    'C# / .NET',
    'Ruby Ecosystem',
    'Frontend',
    'Data & Persistence',
    'Architecture',
    'APIs & Messaging',
    'Testing',
    'Security',
    'DevOps & Cloud',
    'Performance & Ops',
    'Data Engineering',
    'ML & AI',
    'Data Analytics',
    'Business Analysis',
    'Soft Skills',
    'Other',
  ];

  const categories = ORDER.filter(name => categoryMap.has(name)).map((name, idx) => ({
    id: idx + 1,
    name,
    slug: name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
    stacks: categoryMap.get(name)!,
  }));

  const body = { stacks, categories };
  responseCache.set(responseCacheKey, { at: Date.now(), body });
  return NextResponse.json(body, jsonInit);
}
