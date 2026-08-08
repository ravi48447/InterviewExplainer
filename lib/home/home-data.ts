/**
 * home-data.ts — Canonical homepage discovery data layer (P04-T296..T304).
 *
 * Single source of truth for every static, server-rendered discovery entry
 * shown on the homepage. The homepage is an *orientation layer* (P04 §10-18):
 * it introduces the product and points visitors at the right starting point;
 * it does NOT enumerate every technology, question, company, or feature.
 *
 * Design rules encoded here (P04-T067..T170, T268..T278):
 *   - Every `href` is a canonical destination that resolves to a real page.
 *   - Pathways, technologies, and discovery entries are curated, not exhaustive.
 *   - No hard-coded statistics that duplicate canonical content sources
 *     (P04-T142/T143/T304); counts are derived from content-reader where used.
 *   - Data is pure (no fs/path calls) so it is safe to import from a server
 *     component and tree-shakes cleanly into the initial HTML (P04-T282).
 *
 * Consumers: app/page.tsx (server component) + the home section components in
 * components/home/. Interactive/personalized sections read user state on the
 * client and MUST NOT import from here for that state (P04-T298/T311/T315).
 */

import { ENABLED_LANGUAGES, LAUNCH_QUICK_PATHS, isHubEnabled, type HubKey } from "@/lib/launch-config";
import { PILLAR_HUBS } from "@/lib/seo-pillars";
import { getSubcategoriesWithQuestions } from "@/lib/content-reader";

// ─── Hero (P04-T031..T048) ──────────────────────────────────────────────────
/**
 * One primary H1 (P04-T021/T032/T259) + one concise supporting sentence
 * (P04-T022/T033) + one primary CTA + one secondary discovery action
 * (P04-T034/T035/T171/T172). No badge wall, no decorative stats, no gradient
 * text (P04-T037/T038/T039/T193).
 */
export interface HomeHero {
  /** The single primary H1 — states what Interview Explainer helps you do. */
  headline: string;
  /** One concise supporting sentence (no dense paragraph). */
  supporting: string;
  /** Primary CTA — the one action a first-time visitor should take. */
  primaryCta: { label: string; href: string; };
  /** Secondary discovery action — only present because browse-by-language is
   *  a genuinely distinct entry point (P04-T035 "only if genuinely necessary"). */
  secondaryCta: { label: string; href: string; };
}

export const HOME_HERO: HomeHero = {
  headline: "Interview prep that knows your stack",
  supporting:
    "Domain-specific questions, system design, and DSA — curated for your language, track, and experience level. No generic content.",
  primaryCta: { label: "Browse interview questions", href: "/domains" },
  secondaryCta: { label: "Choose a career path", href: "#preparation-paths" },
};

// ─── Preparation pathways (P04-T067..T078) ───────────────────────────────────
/**
 * Canonical homepage pathways. We surface a *curated subset* of
 * LAUNCH_QUICK_PATHS — the homepage must not render all twelve paths as equal
 * cards (P04-T068 "prioritize by user value", T072 "avoid unique colours for
 * every pathway", T088 "avoid rendering hundreds"). We keep the top six by
 * user value and let the rest live on /domains and /prep (T087 "explore all").
 */
export interface HomePathway {
  title: string;
  level: string;
  topics: string;
  href: string;
  icon: string;
}

const PATHWAY_ORDER: string[] = [
  "/java-backend-fresher",
  "/python-backend-fresher",
  "/go-fresher",
  "/java-backend-intermediate",
  "/python-backend-intermediate",
  "/dsa",
];

export function getHomePathways(): HomePathway[] {
  const byHref = new Map(LAUNCH_QUICK_PATHS.map((p) => [p.href, p]));
  const out: HomePathway[] = [];
  for (const href of PATHWAY_ORDER) {
    const p = byHref.get(href);
    if (p) out.push({ title: p.title, level: p.level, topics: p.topics, href: p.href, icon: p.icon });
  }
  return out;
}

// ─── Technology discovery (P04-T079..T090) ───────────────────────────────────
/**
 * High-value technology entry points only (P04-T080). Each links to the
 * canonical stack/domain hub — not a mini dashboard (P04-T083). Consistent
 * visual treatment, no logo wall (P04-T084/T088). Server-visible links
 * (P04-T089/T260).
 */
export interface HomeTechnology {
  name: string;
  icon: string;
  href: string;
  /** One-line description of what you'll find at the destination. */
  blurb: string;
}

export const HOME_TECHNOLOGIES: HomeTechnology[] = [
  { name: "Java", icon: "java", href: "/domains?language=Java", blurb: "Core Java, Spring Boot, concurrency, and JVM internals." },
  { name: "Python", icon: "python", href: "/domains?language=Python", blurb: "Django, FastAPI, data engineering, and ML/AI interview prep." },
  { name: "Go", icon: "go", href: "/domains?language=Go", blurb: "Goroutines, channels, gRPC, and idiomatic Go patterns." },
  { name: "Ruby", icon: "ruby", href: "/domains?language=Ruby", blurb: "Rails, Active Record, and Ruby backend interview questions." },
];

// ─── Featured prep hubs (P04-T067, T269..T271) ───────────────────────────────
/**
 * A small set of pillar hubs surfaced as discovery depth. We only surface hubs
 * whose underlying content is launch-ready (isHubEnabled) and that point at
 * real pages (P04-T076/T263). This provides crawl paths to major hubs
 * (P04-T264) without a link directory (P04-T415).
 */
export interface HomePrepHub {
  title: string;
  tagline: string;
  href: string;
}

export function getHomePrepHubs(): HomePrepHub[] {
  const out: HomePrepHub[] = [];
  // /dsa hub
  if (isHubEnabled("dsa")) {
    out.push({ title: "DSA problems", tagline: "Pattern-based coding practice — two pointers, sliding window, DP, graphs.", href: "/dsa" });
  }
  // /prep index (always enabled via prepCategories)
  if (isHubEnabled("prepCategories")) {
    out.push({ title: "Prep categories", tagline: "Browse every interview topic as a standalone hub.", href: "/prep" });
  }
  // Mock interviews
  if (isHubEnabled("mockInterviews")) {
    out.push({ title: "Mock interviews", tagline: "AI-powered and peer practice to simulate the real round.", href: "/mock-interviews" });
  }
  return out;
}

// ─── Featured questions (P04-T097..T109) ────────────────────────────────────
/**
 * Featured questions are derived from canonical content (P04-T098/T100/T300)
 * — never random (P04-T099), never fake "trending"/"popular" (P04-T374/T375).
 * We surface a small, stable set from the Java/Python/Go flagship tracks so
 * the homepage demonstrates real content depth (P04-T135) without rendering
 * full answers (P04-T102) or large lists (P04-T159). Titles remain the visual
 * focus (P04-T105); links are canonical (P04-T104/T261).
 */
export interface HomeFeaturedQuestion {
  title: string;
  href: string;
  /** Language/track context shown as muted metadata (P04-T103 — concise). */
  context: string;
}

interface QuestionSeed {
  domainSlug: string;
  moduleSlug: string;
  /** Canonical href template; the first question's slug is appended. */
  hrefPrefix: string;
  context: string;
}

const FEATURED_SEEDS: QuestionSeed[] = [
  { domainSlug: "java-backend-intermediate", moduleSlug: "core-java", hrefPrefix: "/core-java-interview-questions#all-questions", context: "Java" },
  { domainSlug: "java-backend-intermediate", moduleSlug: "java-oop", hrefPrefix: "/java-oop-interview-questions#all-questions", context: "Java" },
  { domainSlug: "java-backend-intermediate", moduleSlug: "spring-boot", hrefPrefix: "/spring-boot-interview-questions#all-questions", context: "Java" },
  { domainSlug: "python-backend-intermediate", moduleSlug: "core-python", hrefPrefix: "/core-python-interview-questions#all-questions", context: "Python" },
  { domainSlug: "go-intermediate", moduleSlug: "core-go", hrefPrefix: "/go-intermediate#pillar-P01", context: "Go" },
];

/**
 * Returns up to `limit` featured questions derived from canonical content.
 * Falls back to an empty array if content is unavailable (P04-T305/T306 — one
 * failed section never breaks the homepage). Results are memoized per-process
 * to avoid repeated fs reads (P04-T307).
 */
export function getHomeFeaturedQuestions(limit = 5): HomeFeaturedQuestion[] {
  const cacheKey = `_ie_homeFeaturedQ_${limit}`;
  const g = globalThis as typeof globalThis & { [k: string]: HomeFeaturedQuestion[] | undefined };
  if (g[cacheKey]) return g[cacheKey]!;

  const out: HomeFeaturedQuestion[] = [];
  try {
    for (const seed of FEATURED_SEEDS) {
      if (out.length >= limit) break;
      const subcats = getSubcategoriesWithQuestions(seed.domainSlug, seed.moduleSlug);
      for (const sc of subcats) {
        if (out.length >= limit) break;
        const q = sc.questions[0];
        if (q) {
          out.push({
            title: q.title ?? q.slug,
            href: seed.hrefPrefix,
            context: seed.context,
          });
        }
      }
    }
  } catch {
    // P04-T305: graceful failure — return whatever was collected.
  }
  g[cacheKey] = out;
  return out;
}

// ─── Content counts (P04-T139..T145, T142, T303) ────────────────────────────
/**
 * Generates a small set of content counts from canonical data (P04-T142).
 * Never hard-coded (P04-T143/T304), never animated counters (P04-T144), never
 * the primary homepage message (P04-T145). Used as a restrained trust signal
 * (P04-T135).
 */
export interface HomeContentStat {
  label: string;
  value: string;
}

export function getHomeContentStats(): HomeContentStat[] {
  const g = globalThis as typeof globalThis & { _ie_homeStats?: HomeContentStat[] };
  if (g._ie_homeStats) return g._ie_homeStats;

  const stats: HomeContentStat[] = [];
  try {
    const enabledLangs = (ENABLED_LANGUAGES as readonly string[])
      .map((s) => s.charAt(0).toUpperCase() + s.slice(1))
      .join(" & ");
    stats.push({ label: "Languages live today", value: enabledLangs });

    let totalQuestions = 0;
    const counted = new Set<string>();
    for (const seed of FEATURED_SEEDS) {
      const key = `${seed.domainSlug}::${seed.moduleSlug}`;
      if (counted.has(key)) continue;
      counted.add(key);
      try {
        const subcats = getSubcategoriesWithQuestions(seed.domainSlug, seed.moduleSlug);
        for (const sc of subcats) totalQuestions += sc.questions.length;
      } catch {
        // P04-T141: skip unverifiable counts silently.
      }
    }
    if (totalQuestions > 0) {
      stats.push({ label: "Curated interview questions", value: `${totalQuestions}+` });
    }
    stats.push({ label: "Cost to browse", value: "Free" });
  } catch {
    // P04-T305: graceful failure.
  }
  g._ie_homeStats = stats;
  return stats;
}

// ─── Capability section (P04-T120..T129) ────────────────────────────────────
/**
 * Capabilities are explained through *user outcomes* (P04-T125), not an
 * icon-grid feature wall (P04-T126/T127). We merge overlapping feature
 * sections (P04-T123) into three concise outcomes and link each to a real
 * product experience (P04-T129). No unverified superlative claims (T128).
 */
export interface HomeCapability {
  outcome: string;
  detail: string;
  href: string;
  linkLabel: string;
}

export function getHomeCapabilities(): HomeCapability[] {
  const out: HomeCapability[] = [
    {
      outcome: "Practice questions modeled on real interviews",
      detail: "Domain-specific Q&A tailored to your tech stack and experience level — not generic theory.",
      href: "/domains",
      linkLabel: "Browse questions",
    },
    {
      outcome: "Prepare for system design rounds",
      detail: "Scalability, capacity planning, caching, and case studies with interview-ready trade-off answers.",
      href: "/prep",
      linkLabel: "Open prep categories",
    },
  ];
  if (isHubEnabled("dsa")) {
    out.push({
      outcome: "Drill DSA by pattern",
      detail: "Two pointers, sliding window, DP, and graphs — organized the way interviews actually test them.",
      href: "/dsa",
      linkLabel: "Start DSA practice",
    });
  }
  if (isHubEnabled("mockInterviews")) {
    out.push({
      outcome: "Run a mock interview",
      detail: "AI-powered and peer practice sessions to rehearse the full round before the real one.",
      href: "/mock-interviews",
      linkLabel: "Try a mock interview",
    });
  }
  return out;
}

// ─── Footer discovery (P04-T268..T275) ──────────────────────────────────────
/**
 * Crawl-distribution links to major hubs (P04-T264/T268). A short, contextual
 * list — not a hidden link directory (P04-T275/T276). Anchor text is
 * contextual (P04-T277) and the links are server-rendered so they are
 * crawlable without interaction (P04-T278).
 */
export interface HomeFooterLink {
  label: string;
  href: string;
}

export function getHomeFooterLinks(): HomeFooterLink[] {
  const links: HomeFooterLink[] = [
    { label: "Interview Q&A", href: "/domains" },
    { label: "Prep categories", href: "/prep" },
  ];
  if (isHubEnabled("dsa")) links.push({ label: "DSA", href: "/dsa" });
  if (isHubEnabled("mockInterviews")) links.push({ label: "Mock interviews", href: "/mock-interviews" });
  if (isHubEnabled("dashboard")) links.push({ label: "Dashboard", href: "/dashboard" });
  // A few high-value pillar hubs (P04-T270 "link to high-value stack hubs").
  const pillarPicks = ["java", "system-design", "spring"] as const;
  for (const slug of pillarPicks) {
    const hub = PILLAR_HUBS.find((p) => p.pillarSlug === slug);
    if (hub) links.push({ label: hub.title.split(" Interview Prep")[0], href: `/${slug}` });
  }
  return links;
}

// ─── DSA discovery (P04-T067, T269..T271) ───────────────────────────────────
/**
 * A dedicated DSA discovery section. DSA was previously buried only inside
 * getHomeCapabilities() and the footer — visitors had no visible path into
 * the pattern-based practice hub from the homepage. This surfaces the core
 * interview patterns as whole-card entry points so a candidate can jump
 * straight into the technique they want to drill.
 *
 * The pattern set is a *curated* static list (not a runtime scan of the
 * content index) mirroring the canonical modules in dsaPageContent.ts —
 * the homepage is an orientation layer, not an exhaustive catalog. Each
 * href resolves to a real /dsa route. Surfaces only when isHubEnabled("dsa").
 */
export interface HomeDSAPattern {
  /** Human-readable pattern name. */
  name: string;
  /** One-line description of the technique. */
  blurb: string;
  /** Canonical destination (a /dsa route). */
  href: string;
  /** Module slug used to resolve the lucide icon in HomeDSA. */
  icon: string;
}

const DSA_PATTERNS: HomeDSAPattern[] = [
  { name: "Arrays & Hashing", blurb: "Frequency maps, two-sum, and in-place tricks — the foundation everything else builds on.", href: "/dsa/module/arrays-hashing", icon: "arrays-hashing" },
  { name: "Two Pointers", blurb: "Paired indices that shrink the search space — clean O(n) where brute force is O(n²).", href: "/dsa/module/two-pointers", icon: "two-pointers" },
  { name: "Sliding Window", blurb: "Fixed- and variable-width sub-ranges over a contiguous sequence.", href: "/dsa/module/sliding-window", icon: "sliding-window" },
  { name: "Trees & BSTs", blurb: "Traversals, recursion, and divide-and-conquer on hierarchical data.", href: "/dsa/module/trees", icon: "trees" },
  { name: "Graphs", blurb: "BFS, DFS, topological sort, and union-find on connected structures.", href: "/dsa/module/graphs", icon: "graphs" },
  { name: "Dynamic Programming", blurb: "1-D and 2-D recurrence patterns — the technique behind most hard problems.", href: "/dsa/module/dynamic-programming", icon: "dynamic-programming" },
];

export function getHomeDSAPatterns(): HomeDSAPattern[] {
  if (!isHubEnabled("dsa")) return [];
  return DSA_PATTERNS;
}

// ─── Section order (P04-T015) ───────────────────────────────────────────────
/**
 * The single intentional homepage narrative (P04-T015). Each section leads
 * somewhere meaningful (P04-T019) and there are no dead ends (P04-T020).
 * The order follows the target journey: LAND → UNDERSTAND → CHOOSE A PATH →
 * DISCOVER CONTENT → START → CONTINUE.
 */
export const HOME_SECTION_ORDER = [
  "hero",
  "preparation-paths",
  "technologies",
  "dsa",
  "featured-questions",
  "capabilities",
  "trust",
  "footer-discovery",
] as const;

export type HomeSectionId = (typeof HOME_SECTION_ORDER)[number];

// Re-export launch-config helpers used by section components.
export { isHubEnabled, type HubKey };
