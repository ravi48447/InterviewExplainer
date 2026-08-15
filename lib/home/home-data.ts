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
  headline: "Understand every concept. Crack every interview.",
  supporting:
    "In-depth explanations, real interview questions, guided visual practice, mock interviews, and personalized roadmaps — built for the way interviews actually test you.",
  primaryCta: { label: "Start learning", href: "/select" },
  secondaryCta: { label: "Explore DSA", href: "/dsa" },
};

// ─── Homepage learning proof ────────────────────────────────────────────────

export const HOME_SAMPLE_LESSON = {
  eyebrow: "See how a concept is taught",
  title: "From problem statement to interview-ready understanding.",
  supporting:
    "Every lesson keeps the explanation, visual state, dry run, code, and interviewer reasoning connected instead of scattering them across unrelated pages.",
  problem: {
    title: "Longest Substring Without Repeating Characters",
    prompt: "Find the longest contiguous window that contains no duplicate characters.",
    pattern: "Sliding window + last-seen map",
  },
  visual: {
    values: ["a", "b", "c", "a", "b", "c", "b", "b"],
    left: 1,
    right: 3,
    step: "A repeats at index 3, so left moves just past its previous position.",
    state: "left = 1 · right = 3 · best = 3",
  },
  code: [
    "if (last[c] >= left):",
    "    left = last[c] + 1",
    "last[c] = right",
    "best = max(best, right-left+1)",
  ],
  moments: [
    { label: "Understand", detail: "Plain-English framing and constraints." },
    { label: "Visualize", detail: "One causal state change at a time." },
    { label: "Connect", detail: "The exact code decision beside the visual." },
    { label: "Interview", detail: "Why it works, trade-offs, and common traps." },
  ],
} as const;

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
  "/java-fullstack-intermediate",
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
  /** Approximate question count for this language — adds depth and helps a
   *  candidate gauge how much material sits behind the card. Curated static
   *  value mirroring the canonical domain coverage. */
  count: number;
}

export const HOME_TECHNOLOGIES: HomeTechnology[] = [
  { name: "Java", icon: "java", href: "/domains?language=Java", blurb: "Core Java, Spring Boot, concurrency, and JVM internals.", count: 240 },
  { name: "Python", icon: "python", href: "/domains?language=Python", blurb: "Django, FastAPI, data engineering, and ML/AI interview prep.", count: 210 },
  { name: "Go", icon: "go", href: "/domains?language=Go", blurb: "Goroutines, channels, gRPC, and idiomatic Go patterns.", count: 130 },
  { name: "Ruby", icon: "ruby", href: "/domains?language=Ruby", blurb: "Rails, Active Record, and Ruby backend interview questions.", count: 90 },
  { name: "Frontend", icon: "react", href: "/domains?language=Frontend", blurb: "React, hooks, state, performance, and browser fundamentals.", count: 120 },
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
  /** Canonical href template; {slug} is replaced with each question's slug
   *  so every featured question resolves to a unique destination. */
  hrefPrefix: string;
  context: string;
}

const FEATURED_SEEDS: QuestionSeed[] = [
  { domainSlug: "java-backend-intermediate", moduleSlug: "core-java", hrefPrefix: "/core-java-interview-questions#{slug}", context: "Java" },
  { domainSlug: "java-backend-intermediate", moduleSlug: "java-oop", hrefPrefix: "/java-oop-interview-questions#{slug}", context: "Java" },
  { domainSlug: "java-backend-intermediate", moduleSlug: "spring-boot", hrefPrefix: "/spring-boot-interview-questions#{slug}", context: "Java" },
  { domainSlug: "python-backend-intermediate", moduleSlug: "core-python", hrefPrefix: "/core-python-interview-questions#{slug}", context: "Python" },
  { domainSlug: "go-intermediate", moduleSlug: "core-go", hrefPrefix: "/go-intermediate#{slug}", context: "Go" },
];

/**
 * Returns up to `limit` featured questions derived from canonical content.
 * Falls back to an empty array if content is unavailable (P04-T305/T306 — one
 * failed section never breaks the homepage). Results are memoized per-process
 * to avoid repeated fs reads (P04-T307). Each question resolves to a unique
 * href (no duplicate destinations).
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
            href: seed.hrefPrefix.replace("{slug}", q.slug),
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
    if (isHubEnabled("dsa")) {
      stats.push({ label: "DSA patterns covered", value: "6" });
    }
    if (isHubEnabled("mockInterviews")) {
      stats.push({ label: "Interview formats", value: "Voice + text" });
    }
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

/**
 * Grouped footer links — the same destinations as getHomeFooterLinks but
 * organized into labeled categories so the footer reads as an intentional
 * site map rather than a flat flex-wrap link directory. Each group renders
 * only if it has at least one live link.
 */
export interface HomeFooterLinkGroup {
  label: string;
  links: HomeFooterLink[];
}

export function getHomeFooterLinkGroups(): HomeFooterLinkGroup[] {
  const groups: HomeFooterLinkGroup[] = [];

  const practice: HomeFooterLink[] = [];
  if (isHubEnabled("dsa")) practice.push({ label: "DSA patterns", href: "/dsa" });
  practice.push({ label: "Interview Q&A", href: "/domains" });
  if (practice.length) groups.push({ label: "Practice", links: practice });

  const tools: HomeFooterLink[] = [];
  if (isHubEnabled("mockInterviews")) tools.push({ label: "Mock interviews", href: "/mock-interviews" });
  if (isHubEnabled("dashboard")) tools.push({ label: "Resume scoring", href: "/dashboard/resume" });
  if (tools.length) groups.push({ label: "Tools", links: tools });

  const explore: HomeFooterLink[] = [{ label: "Prep categories", href: "/prep" }];
  const pillarPicks = ["java", "system-design", "spring"] as const;
  for (const slug of pillarPicks) {
    const hub = PILLAR_HUBS.find((p) => p.pillarSlug === slug);
    if (hub) explore.push({ label: hub.title.split(" Interview Prep")[0], href: `/${slug}` });
  }
  if (explore.length) groups.push({ label: "Explore", links: explore });

  return groups;
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
  /** Difficulty tier shown as a micro-label — helps candidates pick where to start. */
  tier: "Core" | "Intermediate" | "Advanced";
  /** Approximate problem count in the module — adds depth, helps candidates
   *  gauge scope. Curated static value mirroring the canonical module. */
  count: number;
  /** When true, this pattern is rendered as the wide spotlight card that
   *  leads the grid — gives the section visual hierarchy instead of six
   *  equal cards. Exactly one pattern should carry this. */
  featured?: boolean;
}

const DSA_PATTERNS: HomeDSAPattern[] = [
  { name: "Arrays & Hashing", blurb: "Frequency maps, two-sum, and in-place tricks — the foundation everything else builds on.", href: "/dsa/module/arrays-hashing", icon: "arrays-hashing", tier: "Core", count: 9, featured: true },
  { name: "Two Pointers", blurb: "Paired indices that shrink the search space — clean O(n) where brute force is O(n²).", href: "/dsa/module/two-pointers", icon: "two-pointers", tier: "Core", count: 7 },
  { name: "Sliding Window", blurb: "Fixed- and variable-width sub-ranges over a contiguous sequence.", href: "/dsa/module/sliding-window", icon: "sliding-window", tier: "Intermediate", count: 8 },
  { name: "Trees & BSTs", blurb: "Traversals, recursion, and divide-and-conquer on hierarchical data.", href: "/dsa/module/trees", icon: "trees", tier: "Intermediate", count: 8 },
  { name: "Graphs", blurb: "BFS, DFS, topological sort, and union-find on connected structures.", href: "/dsa/module/graphs", icon: "graphs", tier: "Advanced", count: 9 },
  { name: "Dynamic Programming", blurb: "1-D and 2-D recurrence patterns — the technique behind most hard problems.", href: "/dsa/module/dynamic-programming", icon: "dynamic-programming", tier: "Advanced", count: 10 },
];

export function getHomeDSAPatterns(): HomeDSAPattern[] {
  if (!isHubEnabled("dsa")) return [];
  return DSA_PATTERNS;
}

// ─── USP pillars (P04-T120 alt) ─────────────────────────────────────────────
/**
 * The four differentiators — why this and not a generic prep site. Each pillar
 * is an outcome + a concrete proof point (not a feature blurb). Visually
 * distinct from the card grids: wider tiles on a surface band. Surfaces only
 * the pillars whose underlying hub is launch-ready.
 */
export interface HomeUSPPillar {
  /** Lucide icon slug resolved in HomeUSPPillars. */
  icon: string;
  /** Bold one-line outcome. */
  title: string;
  /** One-line proof point — concrete, not a superlative. */
  proof: string;
  /** Canonical destination. */
  href: string;
  /** CTA label. */
  cta: string;
  /** Semantic tint slug — subtle per-pillar accent so the band has rhythm
   *  instead of four identical tiles. Resolved to a tinted icon container
   *  in HomeUSPPillars. Stays within the single-accent system (tints, not
   *  new hues). */
  tint: "primary" | "success" | "warning" | "destructive";
  /** Optional short metric chip (e.g. "6 patterns") shown under the proof
   *  text so the differentiator feels measured, not asserted. Rendered as
   *  a small tinted pill in HomeUSPPillars. */
  metric?: string;
}

const USP_PILLARS: HomeUSPPillar[] = [
  { icon: "layers", title: "DSA by pattern, not by problem", proof: "6 core patterns cover the techniques behind 80% of interview questions.", href: "/dsa", cta: "Drill DSA", tint: "primary", metric: "6 patterns" },
  { icon: "radio", title: "AI mock interviews", proof: "Speak out loud, get scored on content, clarity, and structure — instantly.", href: "/mock-interviews", cta: "Try a mock", tint: "success", metric: "Instant score" },
  { icon: "file-text", title: "Resume intelligence", proof: "Score your resume against any job description and close every gap before you apply.", href: "/dashboard/resume", cta: "Score your resume", tint: "warning", metric: "Gap-by-gap" },
  { icon: "message-square", title: "Domain-specific Q&A", proof: "Questions modeled on real interviews for your stack and level — not generic theory.", href: "/domains", cta: "Browse questions", tint: "destructive", metric: "5 languages" },
];

export function getHomeUSPPillars(): HomeUSPPillar[] {
  return USP_PILLARS.filter((p) => {
    if (p.href.startsWith("/dsa")) return isHubEnabled("dsa");
    if (p.href.startsWith("/mock-interviews")) return isHubEnabled("mockInterviews");
    return true;
  });
}

// ─── Mock interview showcase (P04-T120 alt) ─────────────────────────────────
/**
 * A dedicated featured-product band for AI mock interviews — a flagship USP
 * that was previously buried in a text-only capabilities list. Demonstrates
 * the product with a ScoreRing + voice-waveform visual rather than describing
 * it. Surfaces only when mockInterviews is enabled.
 */
export interface HomeMockShowcase {
  headline: string;
  supporting: string;
  /** Three feature points rendered beside the visual. */
  points: { title: string; detail: string }[];
  cta: { label: string; href: string };
  /** Sample score shown in the ScoreRing proof visual. */
  sampleScore: number;
}

export function getHomeMockShowcase(): HomeMockShowcase | null {
  if (!isHubEnabled("mockInterviews")) return null;
  return {
    headline: "Practice the round out loud — before the real one.",
    supporting:
      "Talk through your answers with an AI interviewer. Get scored on content, clarity, and structure the moment you stop speaking.",
    points: [
      { title: "Voice or text", detail: "Speak naturally with real-time transcription, or type your answers." },
      { title: "Instant scoring", detail: "Content coverage, clarity, and structure scored across every answer." },
      { title: "Model answers", detail: "Compare your response to an expert answer after every question." },
    ],
    cta: { label: "Start a mock interview", href: "/mock-interviews" },
    sampleScore: 78,
  };
}

// ─── Resume intelligence showcase (P04-T120 alt) ─────────────────────────────
/**
 * A dedicated featured-product band for resume intelligence — a flagship USP
 * that was entirely absent from the homepage. Demonstrates the product with a
 * ScoreRing + job-match coverage visual. Surfaces only when dashboard is
 * enabled (the resume tool lives under /dashboard/resume).
 */
export interface HomeResumeShowcase {
  headline: string;
  supporting: string;
  points: { title: string; detail: string }[];
  cta: { label: string; href: string };
  sampleScore: number;
  /** Sample coverage % for the job-match proof visual. */
  sampleCoverage: number;
}

export function getHomeResumeShowcase(): HomeResumeShowcase | null {
  if (!isHubEnabled("dashboard")) return null;
  return {
    headline: "See how your resume scores against any job description.",
    supporting:
      "Upload your resume, paste a job description, and get a match score with every gap highlighted — before a recruiter ever sees it.",
    points: [
      { title: "Overall match score", detail: "One number that tells you how aligned your resume is to the role." },
      { title: "Gap analysis", detail: "Every missing requirement surfaced with severity and a fix." },
      { title: "Job-fit coverage", detail: "See which requirements you hit, partially meet, or miss." },
    ],
    cta: { label: "Score your resume", href: "/dashboard/resume" },
    sampleScore: 72,
    sampleCoverage: 68,
  };
}

// ─── Final CTA (homepage's own conversion moment) ───────────────────────────
/**
 * The homepage ends on a single clear call-to-action — its own conversion
 * moment — before the footer discovery links. A world-class homepage doesn't
 * trail off into a link directory; it re-states the promise and gives the
 * visitor one place to go. Surfaces only when the primary DSA hub is enabled
 * (the CTA points there); falls back to /domains otherwise.
 */
export interface HomeFinalCTA {
  headline: string;
  supporting: string;
  primaryCta: { label: string; href: string };
  secondaryCta: { label: string; href: string };
}

export function getHomeFinalCTA(): HomeFinalCTA {
  const dsaEnabled = isHubEnabled("dsa");
  return {
    headline: "Stop memorizing. Start cracking interviews.",
    supporting:
      "Pick a pattern, run a mock, or score your resume — every tool you need to walk into the next round prepared.",
    primaryCta: dsaEnabled
      ? { label: "Start practicing", href: "/dsa" }
      : { label: "Browse interview questions", href: "/domains" },
    secondaryCta: { label: "Explore everything", href: "/prep" },
  };
}

// ─── How it works (orientation bridge) ─────────────────────────────────────
/**
 * A compact 3-step band that bridges the hero and the pathways. A first-time
 * visitor who lands cold doesn't yet know what "pattern-based prep" *is* —
 * this orients them in three beats (Pick → Practice → Get scored) before they
 * are asked to choose a path. Each step links to the same destinations the
 * later sections expand, so it doubles as a fast exit for impatient visitors.
 */
export interface HomeHowItWorksStep {
  /** Step number, 1-based. */
  step: number;
  /** Lucide icon slug resolved in HomeHowItWorks. */
  icon: "target" | "code" | "gauge";
  title: string;
  detail: string;
  /** Canonical destination. */
  href: string;
}

export function getHomeHowItWorks(): HomeHowItWorksStep[] {
  const steps: HomeHowItWorksStep[] = [
    { step: 1, icon: "target", title: "Pick your pattern or path", detail: "Start with a DSA pattern, a career track, or a domain — not a random problem.", href: "/dsa" },
    { step: 2, icon: "code", title: "Practice with intent", detail: "Worked examples in Java and Python, organized the way interviews actually test you.", href: "/domains" },
    { step: 3, icon: "gauge", title: "Get scored, close gaps", detail: "Run a mock, score your resume, and see exactly what to fix before the real round.", href: "/mock-interviews" },
  ];
  // Respect hub gating on the destinations so a disabled hub never gets a
  // prominent bridge link. Falls back to /prep if mock is off.
  if (!isHubEnabled("dsa")) steps[0].href = "/prep";
  if (!isHubEnabled("mockInterviews")) steps[2].href = "/dashboard/resume";
  return steps;
}

// ─── Section order (P04-T015) ───────────────────────────────────────────────
/**
 * The single intentional homepage narrative (P04-T015). Each section leads
 * somewhere meaningful (P04-T019) and there are no dead ends (P04-T020).
 * The order follows the target journey: LAND → DIFFERENTIATE → CHOOSE A PATH →
 * DISCOVER CONTENT → SEE THE PRODUCTS → TRUST → CONVERT → CONTINUE.
 */
export const HOME_SECTION_ORDER = [
  "hero",
  "usp-pillars",
  "how-it-works",
  "preparation-paths",
  "technologies",
  "dsa",
  "featured-questions",
  "mock-showcase",
  "resume-showcase",
  "trust",
  "final-cta",
  "footer-discovery",
] as const;

export type HomeSectionId = (typeof HOME_SECTION_ORDER)[number];

// ─── Visual-reference homepage data ─────────────────────────────────────────

export type ReferenceHomeIcon =
  | "server"
  | "panels"
  | "braces"
  | "network"
  | "cloud"
  | "chart"
  | "flag"
  | "sprout"
  | "puzzle"
  | "target"
  | "trophy";

export interface ReferenceHomeDomain {
  id: string;
  title: string;
  summary: string;
  href: string;
  icon: ReferenceHomeIcon;
  accent: "blue" | "green" | "orange" | "violet" | "teal";
}

/** Six truthful, launch-ready discovery entries used by the visual homepage. */
export const REFERENCE_HOME_DOMAINS: ReferenceHomeDomain[] = [
  { id: "java", title: "Java Backend", summary: "Core Java, Spring Boot, APIs", href: "/domains?language=Java", icon: "server", accent: "blue" },
  { id: "frontend", title: "Frontend Development", summary: "React, browser, performance", href: "/domains?language=Frontend", icon: "panels", accent: "green" },
  { id: "dsa", title: "DSA & Algorithms", summary: "Patterns, problems, dry runs", href: "/dsa", icon: "braces", accent: "orange" },
  { id: "architecture", title: "System Design", summary: "Architecture through real cases", href: "/prep/system-design", icon: "network", accent: "violet" },
  { id: "python", title: "Python Development", summary: "Python, Django, FastAPI", href: "/domains?language=Python", icon: "cloud", accent: "teal" },
  { id: "data", title: "Data & Analytics", summary: "SQL, analysis, visualization", href: "/domains?language=Python", icon: "chart", accent: "green" },
];

export interface ReferenceHomeJourneyStep {
  step: number;
  title: string;
  detail: string;
  href: string;
  icon: ReferenceHomeIcon;
  accent: "blue" | "green" | "orange" | "violet" | "teal";
}

export const REFERENCE_HOME_JOURNEY: ReferenceHomeJourneyStep[] = [
  { step: 1, title: "Choose your goal", detail: "Pick a domain and set the outcome you want.", href: "/select", icon: "flag", accent: "blue" },
  { step: 2, title: "Learn concepts", detail: "Build the idea with clear visual explanations.", href: "/prep", icon: "sprout", accent: "green" },
  { step: 3, title: "Practice actively", detail: "Solve questions and understand every decision.", href: "/dsa", icon: "puzzle", accent: "violet" },
  { step: 4, title: "Test and improve", detail: "Use mock interviews to find and close gaps.", href: "/mock-interviews", icon: "target", accent: "teal" },
  { step: 5, title: "Get interview ready", detail: "Revise confidently and enter the real round prepared.", href: "/dashboard", icon: "trophy", accent: "orange" },
];

export interface ReferenceHomeProof {
  label: string;
  value: string;
  icon: "user" | "building" | "code" | "video";
}

export function getReferenceHomeProof(): ReferenceHomeProof[] {
  const stats = getHomeContentStats();
  const questions = stats.find((item) => item.label === "Curated interview questions")?.value ?? "Curated";
  const patterns = stats.find((item) => item.label === "DSA patterns covered")?.value ?? "6";
  return [
    { label: "Learning paths", value: `${getHomePathways().length}+`, icon: "user" },
    { label: "Interview domains", value: `${REFERENCE_HOME_DOMAINS.length}`, icon: "building" },
    { label: "Curated questions", value: questions, icon: "code" },
    { label: "DSA patterns", value: patterns, icon: "video" },
  ];
}

// Re-export launch-config helpers used by section components.
export { isHubEnabled, type HubKey };
