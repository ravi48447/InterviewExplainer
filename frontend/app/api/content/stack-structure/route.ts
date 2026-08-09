import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import {
  domainSlugToContentPath,
  getSubcategorySlugs,
  resolveStackDirectory,
} from '@/lib/content-reader';
import { parseDomainSlug } from '@/lib/domain-display';
import { resolveStackContent } from '@/lib/contentV2';
import type { Level } from '@/lib/contentV2-types';
import { readStaticAsset } from '@/lib/static-asset';

export const revalidate = 3600;

// Shared per-(domain,stack) cache so repeated clicks on the same module don't
// re-scan the filesystem. Survives HMR via globalThis.
const g = globalThis as typeof globalThis & {
  _ie_stackStructureCache?: Map<string, { at: number; body: unknown }>;
};
g._ie_stackStructureCache ??= new Map();
const STACK_STRUCT_TTL_MS = 10 * 60 * 1000;

export interface SubcategoryInfo {
  slug: string;
  name: string;
  questionCount: number;
}

export interface StackStructure {
  domainSlug: string;
  stackSlug: string;
  subcategories: SubcategoryInfo[];
}

function toDisplayName(slug: string): string {
  return slug
    .replace(/-/g, ' ')
    .replace(/\b\w/g, c => c.toUpperCase());
}

function countQuestionsInFile(filePath: string): number {
  try {
    const raw = fs.readFileSync(filePath, 'utf-8');
    const data = JSON.parse(raw);
    if (Array.isArray(data)) return data.length;
    if (data.questions && Array.isArray(data.questions)) return data.questions.length;
    return 0;
  } catch {
    return 0;
  }
}

const CONTENT_ROOT = path.join(process.cwd(), '..', 'content', 'domains');
const CONTENT_INTERVIEW_ROOT = path.join(process.cwd(), '..', 'content', 'interview');

// ─── Locked-domain registry (mirrors lib/content-reader.ts) ──────────────────
const CONTENT_JBI_ROOT = path.join(process.cwd(), '..', 'content', 'java-backend-intermediate');
const CONTENT_JFI_ROOT = path.join(process.cwd(), '..', 'content', 'java-fullstack-intermediate');
const CONTENT_JBF_ROOT = path.join(process.cwd(), '..', 'content', 'java-backend-fresher');
const CONTENT_RBI_ROOT = path.join(process.cwd(), '..', 'content', 'ruby-backend-intermediate');
const CONTENT_RBF_ROOT = path.join(process.cwd(), '..', 'content', 'ruby-backend-fresher');

/** Stack-slug aliases for the JBI migration (old URL slug → new module slug). */
const JBI_STACK_ALIAS: Record<string, string> = {
  'collections-data-structures': 'java-collections',
  'jvm-performance':              'jvm-internals',
  'spring-data-hibernate':        'spring-data-jpa',
  'rest-api-web':                 'rest-api',
  'security':                     'application-security',
  'devops-cicd':                  'cicd',
  'aws':                          'aws-cloud',
  'production-operations':        'production-sre',
  'advanced-java':                'java-streams',
  'testing':                      'unit-testing',
  'architecture-design-patterns': 'design-patterns',
  'database':                     'sql-databases',
  'postgresql':                   'sql-databases',
  'event-driven':                 'messaging-events',
  'event-driven-architecture':    'messaging-events',
  'kafka':                        'messaging-events',
  'caching-performance':          'redis-caching',
  'redis':                        'redis-caching',
  'cloud-deployment':             'cloud-native',
  'git':                          'git-build-tools',
  'maven-gradle':                 'git-build-tools',
};

interface LockedDomainConfig {
  rootDir: string;
  stackAliases: Record<string, string>;
}

const LOCKED_DOMAINS: Record<string, LockedDomainConfig> = {
  'java-backend-intermediate':  { rootDir: CONTENT_JBI_ROOT, stackAliases: JBI_STACK_ALIAS },
  'java-fullstack-intermediate': { rootDir: CONTENT_JFI_ROOT, stackAliases: {} },
  'java-backend-fresher':        { rootDir: CONTENT_JBF_ROOT, stackAliases: {} },
  'ruby-backend-intermediate':   { rootDir: CONTENT_RBI_ROOT, stackAliases: {} },
  'ruby-backend-fresher':        { rootDir: CONTENT_RBF_ROOT, stackAliases: {} },
};

interface LockedIndexEntry {
  moduleSlug: string;
  topics?: string[];
  contentSource?: { domain: string; moduleSlug: string };
}

interface LockedIndexFile { modules: LockedIndexEntry[] }

/**
 * Resolve the on-disk dir for a locked module, transparently following
 * `contentSource` (reused modules across locked domains).
 */
function resolveLockedModuleDir(domainSlug: string, stackSlug: string): string | null {
  const info = LOCKED_DOMAINS[domainSlug];
  if (!info) return null;
  const resolved = info.stackAliases[stackSlug] ?? stackSlug;

  const indexPath = path.join(info.rootDir, '_index.json');
  if (fs.existsSync(indexPath)) {
    try {
      const index = JSON.parse(fs.readFileSync(indexPath, 'utf-8')) as LockedIndexFile;
      const entry = index.modules.find(m => m.moduleSlug === resolved);
      if (entry?.contentSource && entry.contentSource.domain !== domainSlug) {
        return resolveLockedModuleDir(entry.contentSource.domain, entry.contentSource.moduleSlug);
      }
    } catch {}
  }

  const localDir = path.join(info.rootDir, resolved);
  return fs.existsSync(localDir) ? localDir : null;
}

/** Returns the canonical ordered topic list for a locked module (from entry or _config.json). */
function getLockedTopicOrder(domainSlug: string, stackSlug: string, moduleDir: string): string[] {
  // Prefer the module's own _config.json.
  const modCfg = path.join(moduleDir, '_config.json');
  if (fs.existsSync(modCfg)) {
    try {
      const cfg = JSON.parse(fs.readFileSync(modCfg, 'utf-8')) as { topics?: string[] };
      if (Array.isArray(cfg.topics)) return cfg.topics;
    } catch {}
  }
  // Fall back to the domain's _index.json entry — authoritative for modules
  // that reuse content from another domain and thus have no local _config.json.
  const info = LOCKED_DOMAINS[domainSlug];
  if (!info) return [];
  const resolved = info.stackAliases[stackSlug] ?? stackSlug;
  const indexPath = path.join(info.rootDir, '_index.json');
  if (fs.existsSync(indexPath)) {
    try {
      const index = JSON.parse(fs.readFileSync(indexPath, 'utf-8')) as LockedIndexFile;
      const entry = index.modules.find(m => m.moduleSlug === resolved);
      if (entry?.topics) return entry.topics;
    } catch {}
  }
  return [];
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const domainSlug = searchParams.get('domainSlug');
  const stackSlug = searchParams.get('stackSlug');

  if (!domainSlug || !stackSlug) {
    return NextResponse.json({ error: 'Missing domainSlug or stackSlug' }, { status: 400 });
  }

  const cacheKey = `${domainSlug}::${stackSlug}::structureV3`;

  // On Cloudflare Workers (and after pre-render on Node), serve the static
  // snapshot from the ASSETS binding — no filesystem walk at request time.
  const staticSnapshot = await readStaticAsset<StackStructure>(
    `/api/content/stack-structure/${domainSlug}/${stackSlug}.json`
  );
  if (staticSnapshot) return NextResponse.json(staticSnapshot);

  const cached = g._ie_stackStructureCache!.get(cacheKey);
  if (cached && Date.now() - cached.at < STACK_STRUCT_TTL_MS) {
    return NextResponse.json(cached.body);
  }
  const returnCached = (body: unknown) => {
    g._ie_stackStructureCache!.set(cacheKey, { at: Date.now(), body });
    return NextResponse.json(body);
  };

  // ── Locked-domain short-circuit (JBI, JFI, …) ────────────────────────────
  // Serves content/<domainSlug>/<module>/<topic>/{questions,complete-qa}.json.
  // For modules that reuse content from another locked domain (JFI's reused
  // backend modules), `resolveLockedModuleDir` transparently follows the
  // `contentSource` pointer in _index.json to the source domain's folder.
  //
  // Topic order follows the module's `_config.json.topics` when present (and
  // falls back to the domain's `_index.json` entry for reused modules that
  // have no local _config.json).
  if (domainSlug in LOCKED_DOMAINS) {
    const lockedRoot = resolveLockedModuleDir(domainSlug, stackSlug);
    if (lockedRoot) {
      const orderedTopics = getLockedTopicOrder(domainSlug, stackSlug, lockedRoot);

      const onDisk = fs.readdirSync(lockedRoot, { withFileTypes: true })
        .filter(e => e.isDirectory() && !e.name.startsWith('_') && !e.name.startsWith('.'))
        .map(e => e.name);
      const configSet = new Set(orderedTopics);
      const extras = onDisk.filter(n => !configSet.has(n)).sort((a, b) => a.localeCompare(b));
      const topicOrder = [...orderedTopics.filter(t => onDisk.includes(t)), ...extras];

      const subs: SubcategoryInfo[] = [];
      for (const name of topicOrder) {
        const subcatCfg = path.join(lockedRoot, name, '_config.json');
        if (fs.existsSync(subcatCfg)) {
          try { if (JSON.parse(fs.readFileSync(subcatCfg, 'utf-8')).visible === false) continue; } catch {}
        }
        const qaFile = path.join(lockedRoot, name, 'complete-qa.json');
        const questionsFile = path.join(lockedRoot, name, 'questions.json');
        const countFile = fs.existsSync(qaFile) ? qaFile : (fs.existsSync(questionsFile) ? questionsFile : null);
        const count = countFile ? countQuestionsInFile(countFile) : 0;
        if (count === 0) continue;
        subs.push({ slug: name, name: toDisplayName(name), questionCount: count });
      }
      if (subs.length > 0) {
        return returnCached({ domainSlug, stackSlug, subcategories: subs } satisfies StackStructure);
      }
    }
    // Fall through to legacy if the locked tree has nothing yet — never break.
  }

  const contentRelPath = domainSlugToContentPath(domainSlug);
  if (!contentRelPath) {
    return NextResponse.json({ error: 'Cannot resolve content path for domain' }, { status: 400 });
  }

  // Check V2 first, then legacy
  const v2Root = path.join(CONTENT_INTERVIEW_ROOT, contentRelPath, stackSlug);
  const legacyRoot = path.join(CONTENT_ROOT, contentRelPath, stackSlug);
  const contentRoot = fs.existsSync(v2Root) ? v2Root : (fs.existsSync(legacyRoot) ? legacyRoot : null);

  const subcategories: SubcategoryInfo[] = [];

  // Try V2 resolution chain first (handles $ref and shared content fallback)
  const domainParsed = parseDomainSlug(domainSlug);
  if (domainParsed) {
    const v2Content = resolveStackContent(
      domainParsed.langSlug, domainParsed.trackSlug,
      domainParsed.levelKey as Level, stackSlug
    );
    if (v2Content && v2Content.questions.length > 0) {
      subcategories.push({
        slug: '_root',
        name: toDisplayName(stackSlug),
        questionCount: v2Content.questions.length,
      });
      return returnCached({
        domainSlug,
        stackSlug,
        subcategories,
      } satisfies StackStructure);
    }
  }

  if (!contentRoot) {
    return returnCached({
      domainSlug,
      stackSlug,
      subcategories: [],
    } satisfies StackStructure);
  }

  // Same ordering as stack-questions (`getSubcategorySlugs`): curriculum topics
  // first, not alphabetical. Single pass — no duplicate `_root` + subdirectory rows.
  const baseDir = resolveStackDirectory(domainSlug, stackSlug) ?? contentRoot;
  const orderedSlugs = getSubcategorySlugs(domainSlug, stackSlug);

  for (const name of orderedSlugs) {
    if (name === '_root') {
      const directQA = path.join(baseDir, 'complete-qa.json');
      if (!fs.existsSync(directQA)) continue;
      const count = countQuestionsInFile(directQA);
      if (count > 0) {
        subcategories.push({
          slug: '_root',
          name: toDisplayName(stackSlug),
          questionCount: count,
        });
      }
      continue;
    }

    const subcatCfg = path.join(baseDir, name, '_config.json');
    if (fs.existsSync(subcatCfg)) {
      try {
        if (JSON.parse(fs.readFileSync(subcatCfg, 'utf-8')).visible === false) continue;
      } catch {}
    }

    const qaFile = path.join(baseDir, name, 'complete-qa.json');
    const questionsFile = path.join(baseDir, name, 'questions.json');
    const countFile = fs.existsSync(qaFile)
      ? qaFile
      : fs.existsSync(questionsFile)
        ? questionsFile
        : null;
    const count = countFile ? countQuestionsInFile(countFile) : 0;
    if (count === 0) continue;

    subcategories.push({
      slug: name,
      name: toDisplayName(name),
      questionCount: count,
    });
  }

  return returnCached({
    domainSlug,
    stackSlug,
    subcategories,
  } satisfies StackStructure);
}
