import { Metadata } from "next";
import Link from "next/link";
import {
  getDSAIndex,
  getDSACategories,
  getDSAModules,
  getDSAModuleProblemCounts,
  getDSAModulesWithLearnPages,
  getDSASheet,
} from "@/lib/contentV2";
import {
  Home,
  ChevronRight,
  ArrowRight,
  BookOpen,
  CheckCircle2,
  List,
  Type,
  Link2,
  GitBranch,
  Share2,
  Layers,
  Search,
  BarChart2,
  AlignJustify,
  Binary,
  RotateCcw,
  Calendar,
  GitMerge,
  Cpu,
  Calculator,
  ScanSearch,
  Trophy,
  Clock,
  Target,
  Zap,
  Brain,
  TrendingUp,
  Play,
  GraduationCap,
  Compass,
  Flame,
  Star,
  Code2,
  MessageSquare,
  Award,
  Sparkles,
  Filter,
} from "lucide-react";
import React from "react";
import { DSAProblemExplorer, type ProblemRow } from "@/components/dsa/DSAProblemExplorer";
import { DSAHubNav, type HubNavItem } from "@/components/dsa/DSAHubNav";
import { problemHasAuthoredContent } from "@/components/dsa/DSAProblemRow";

export const revalidate = 3600;

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://interviewexplainer.com";

function toDisplayName(slug: string) {
  return slug.split("-").map((w) => w.charAt(0).toUpperCase() + w.slice(1)).join(" ");
}

export const metadata: Metadata = {
  title: "DSA Interview Questions — Java & Python Walkthroughs | InterviewExplainer",
  description: "18-module curriculum ordered by how interviewers actually test. Every problem: brute-force → optimal in Java and Python, line-by-line walkthroughs, interview coaching.",
  alternates: { canonical: `${SITE_URL}/dsa` },
  openGraph: {
    title: "DSA Interview Questions — Java & Python Line-by-Line Solutions",
    description: "18 modules, brute-force → optimal in Java and Python, line-by-line walkthroughs, interview talking points.",
    url: `${SITE_URL}/dsa`,
    type: "website",
  },
};

const BG_HERO_GRID: React.CSSProperties = {
  backgroundImage: [
    "linear-gradient(to right, rgba(255,255,255,0.04) 1px, transparent 1px)",
    "linear-gradient(to bottom, rgba(255,255,255,0.04) 1px, transparent 1px)",
  ].join(", "),
  backgroundSize: "32px 32px",
};

// ─── Topic metadata ───────────────────────────────────────────────────────────
const TOPIC_META: Record<string, { icon: React.ElementType; accent: string; bg: string }> = {
  arrays:                { icon: List,         accent: "text-blue-600 dark:text-blue-400",    bg: "bg-blue-50 dark:bg-blue-500/10 border-blue-200 dark:border-blue-500/20" },
  strings:               { icon: Type,         accent: "text-violet-600 dark:text-violet-400",  bg: "bg-violet-50 dark:bg-violet-500/10 border-violet-200 dark:border-violet-500/20" },
  "linked-lists":        { icon: Link2,        accent: "text-cyan-600 dark:text-cyan-400",    bg: "bg-cyan-50 dark:bg-cyan-500/10 border-cyan-200 dark:border-cyan-500/20" },
  trees:                 { icon: GitBranch,    accent: "text-emerald-600 dark:text-emerald-400", bg: "bg-emerald-50 dark:bg-emerald-500/10 border-emerald-200 dark:border-emerald-500/20" },
  graphs:                { icon: Share2,       accent: "text-indigo-600 dark:text-indigo-400",  bg: "bg-indigo-50 dark:bg-indigo-500/10 border-indigo-200 dark:border-indigo-500/20" },
  "dynamic-programming": { icon: Layers,       accent: "text-amber-600 dark:text-amber-400",   bg: "bg-amber-50 dark:bg-amber-500/10 border-amber-200 dark:border-amber-500/20" },
  "binary-search":       { icon: Search,       accent: "text-teal-600 dark:text-teal-400",    bg: "bg-teal-50 dark:bg-teal-500/10 border-teal-200 dark:border-teal-500/20" },
  heaps:                 { icon: BarChart2,    accent: "text-orange-600 dark:text-orange-400",  bg: "bg-orange-50 dark:bg-orange-500/10 border-orange-200 dark:border-orange-500/20" },
  "stack-queue":         { icon: AlignJustify, accent: "text-pink-600 dark:text-pink-400",    bg: "bg-pink-50 dark:bg-pink-500/10 border-pink-200 dark:border-pink-500/20" },
  backtracking:          { icon: RotateCcw,    accent: "text-rose-600 dark:text-rose-400",    bg: "bg-rose-50 dark:bg-rose-500/10 border-rose-200 dark:border-rose-500/20" },
  intervals:             { icon: Calendar,     accent: "text-lime-600 dark:text-lime-400",    bg: "bg-lime-50 dark:bg-lime-500/10 border-lime-200 dark:border-lime-500/20" },
  tries:                 { icon: GitMerge,     accent: "text-fuchsia-600 dark:text-fuchsia-400", bg: "bg-fuchsia-50 dark:bg-fuchsia-500/10 border-fuchsia-200 dark:border-fuchsia-500/20" },
  "bit-manipulation":    { icon: Binary,       accent: "text-muted-foreground",   bg: "bg-surface border-border" },
  math:                  { icon: Calculator,   accent: "text-yellow-600 dark:text-yellow-400",  bg: "bg-yellow-50 dark:bg-yellow-500/10 border-yellow-200 dark:border-yellow-500/20" },
  "two-pointers":        { icon: ScanSearch,   accent: "text-sky-600 dark:text-sky-400",     bg: "bg-sky-50 dark:bg-sky-500/10 border-sky-200 dark:border-sky-500/20" },
  greedy:                { icon: Cpu,          accent: "text-green-600 dark:text-green-400",   bg: "bg-green-50 dark:bg-green-500/10 border-green-200 dark:border-green-500/20" },
};
const FALLBACK_TOPIC = { icon: List, accent: "text-muted-foreground", bg: "bg-surface border-border" };

// ─── Difficulty ───────────────────────────────────────────────────────────────
const DIFF: Record<string, { badge: string }> = {
  easy:   { badge: "bg-emerald-50 dark:bg-emerald-500/10 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-500/20 dark:border-emerald-900/40" },
  medium: { badge: "bg-amber-50 dark:bg-amber-500/10 dark:bg-amber-950/40 text-amber-700 dark:text-amber-400 border border-amber-200 dark:border-amber-500/20 dark:border-amber-900/40" },
  hard:   { badge: "bg-red-50 dark:bg-red-500/10 dark:bg-red-950/40 text-red-700 dark:text-red-400 border border-red-200 dark:border-red-500/20 dark:border-red-900/40" },
};

// ─── Curated sheets ───────────────────────────────────────────────────────────
const SHEETS = [
  {
    slug: "blind-75",
    name: "Blind 75",
    count: 75,
    note: "The OG FAANG list — minimum viable problem set",
    weeks: "6–8 wks",
    color: "from-amber-50 dark:from-amber-950/400 to-orange-50 dark:to-orange-950/400",
    iconBg: "bg-amber-50 dark:bg-amber-500/10 border-amber-200 dark:border-amber-500/20",
    iconColor: "text-amber-500 dark:text-amber-400",
  },
  {
    slug: "neetcode-150",
    name: "NeetCode 150",
    count: 150,
    note: "Blind 75 + 75 follow-ups — comprehensive coverage",
    weeks: "10–14 wks",
    color: "from-violet-50 dark:from-violet-950/400 to-purple-50 dark:to-purple-950/400",
    iconBg: "bg-violet-50 dark:bg-violet-500/10 border-violet-200 dark:border-violet-500/20",
    iconColor: "text-violet-500 dark:text-violet-400",
  },
  {
    slug: "grind-75",
    name: "Grind 75",
    count: 75,
    note: "Time-aware weekly schedule by Yangshun",
    weeks: "8 wks",
    color: "from-emerald-50 dark:from-emerald-950/400 to-teal-50 dark:to-teal-950/400",
    iconBg: "bg-emerald-50 dark:bg-emerald-500/10 border-emerald-200 dark:border-emerald-500/20",
    iconColor: "text-emerald-500 dark:text-emerald-400",
  },
  {
    slug: "leetcode-150",
    name: "LeetCode 150",
    count: 150,
    note: "LeetCode's official Top Interview 150 study plan",
    weeks: "8–12 wks",
    color: "from-orange-50 dark:from-orange-950/400 to-amber-50 dark:to-amber-950/400",
    iconBg: "bg-orange-50 dark:bg-orange-500/10 border-orange-200 dark:border-orange-500/20",
    iconColor: "text-orange-500 dark:text-orange-400",
  },
  {
    slug: "hackerrank-150",
    name: "HackerRank 150",
    count: 150,
    note: "Interview Prep Kit + top OA problems",
    weeks: "8–10 wks",
    color: "from-green-50 dark:from-green-950/400 to-emerald-50 dark:to-emerald-950/400",
    iconBg: "bg-green-50 dark:bg-green-950/20 border-green-200 dark:border-green-500/20",
    iconColor: "text-green-600 dark:text-green-400",
  },
  {
    slug: "hackerearth-150",
    name: "HackerEarth 150",
    count: 150,
    note: "Campus & competitive classics — MST, segment trees, DP",
    weeks: "10–14 wks",
    color: "from-sky-50 dark:from-sky-950/400 to-blue-50 dark:to-blue-950/400",
    iconBg: "bg-sky-50 dark:bg-sky-500/10 border-sky-200 dark:border-sky-500/20",
    iconColor: "text-sky-500 dark:text-sky-400",
  },
  {
    slug: "best-problems",
    name: "Best Problems",
    count: 50,
    note: "Curated best-of — 100% authored, zero gaps",
    weeks: "3–4 wks",
    color: "from-fuchsia-50 dark:from-fuchsia-950/400 to-pink-50 dark:to-pink-950/400",
    iconBg: "bg-fuchsia-50 dark:bg-fuchsia-950/20 border-fuchsia-200 dark:border-fuchsia-500/20",
    iconColor: "text-fuchsia-500 dark:text-fuchsia-400",
  },
];

// ─── Must-know questions ──────────────────────────────────────────────────────
const TOP_QUESTIONS: Array<{
  title: string; slug: string; difficulty: "easy" | "medium" | "hard";
  module: string; moduleTitle: string; pattern: string; companies?: string;
}> = [
  { title: "Two Sum",                        slug: "two-sum",                          difficulty: "easy",   module: "arrays-and-hashing",     moduleTitle: "Arrays & Hashing",    pattern: "Hash Map",        companies: "FAANG" },
  { title: "Valid Parentheses",              slug: "valid-parentheses",                difficulty: "easy",   module: "stack-and-queue",        moduleTitle: "Stack & Queue",       pattern: "Stack",           companies: "Google, Meta" },
  { title: "Binary Search",                 slug: "binary-search",                    difficulty: "easy",   module: "binary-search",          moduleTitle: "Binary Search",       pattern: "Binary Search" },
  { title: "Climbing Stairs",               slug: "climbing-stairs",                  difficulty: "easy",   module: "dynamic-programming",    moduleTitle: "Dynamic Programming", pattern: "1-D DP",          companies: "Amazon" },
  { title: "Reverse Linked List",           slug: "reverse-linked-list",              difficulty: "easy",   module: "linked-list",            moduleTitle: "Linked List",         pattern: "Pointer" },
  { title: "Invert Binary Tree",            slug: "invert-binary-tree",               difficulty: "easy",   module: "trees-and-bst",          moduleTitle: "Trees & BST",         pattern: "DFS",             companies: "Amazon" },
  { title: "Contains Duplicate",            slug: "contains-duplicate",               difficulty: "easy",   module: "arrays-and-hashing",     moduleTitle: "Arrays & Hashing",    pattern: "Hash Set" },
  { title: "Best Time to Buy Stock",        slug: "best-time-to-buy-stock",           difficulty: "easy",   module: "sliding-window",         moduleTitle: "Sliding Window",      pattern: "Sliding Window",  companies: "FAANG" },
  { title: "3Sum",                          slug: "3sum",                             difficulty: "medium", module: "two-pointers",           moduleTitle: "Two Pointers",        pattern: "Two Pointers",    companies: "Google, Meta" },
  { title: "Longest Substring No Repeat",   slug: "longest-substring-without-repeat", difficulty: "medium", module: "sliding-window",         moduleTitle: "Sliding Window",      pattern: "Sliding Window",  companies: "Amazon" },
  { title: "Group Anagrams",               slug: "group-anagrams",                   difficulty: "medium", module: "arrays-and-hashing",     moduleTitle: "Arrays & Hashing",    pattern: "Hash Map" },
  { title: "Search in Rotated Array",       slug: "search-in-rotated-sorted-array",   difficulty: "medium", module: "binary-search",          moduleTitle: "Binary Search",       pattern: "Binary Search",   companies: "Microsoft" },
  { title: "Top K Frequent Elements",       slug: "top-k-frequent-elements",          difficulty: "medium", module: "heap-and-priority-queue", moduleTitle: "Heap",               pattern: "Heap",            companies: "Meta, Amazon" },
  { title: "Number of Islands",             slug: "number-of-islands",                difficulty: "medium", module: "graphs",                 moduleTitle: "Graphs",              pattern: "BFS / DFS",       companies: "FAANG" },
  { title: "Course Schedule",               slug: "course-schedule",                  difficulty: "medium", module: "graphs",                 moduleTitle: "Graphs",              pattern: "Topo Sort",       companies: "Google" },
  { title: "Coin Change",                   slug: "coin-change",                      difficulty: "medium", module: "dynamic-programming",    moduleTitle: "Dynamic Programming", pattern: "Bottom-up DP",    companies: "FAANG" },
  { title: "Merge Intervals",               slug: "merge-intervals",                  difficulty: "medium", module: "intervals",              moduleTitle: "Intervals",           pattern: "Sort + Sweep",    companies: "Google" },
  { title: "Trapping Rain Water",           slug: "trapping-rain-water",              difficulty: "hard",   module: "two-pointers",           moduleTitle: "Two Pointers",        pattern: "Two Pointers",    companies: "FAANG" },
];

// ─── Phases ───────────────────────────────────────────────────────────────────
type Phase = "foundations" | "core" | "advanced" | "specialised";

const PHASE_META: Record<Phase, {
  label: string; description: string; icon: React.ElementType;
  nodeBg: string; nodeText: string;
  lineBg: string;
  cardAccent: string; cardNumBg: string; cardNumText: string;
  hoverBorder: string;
  headerBg: string; cardBorder: string;
}> = {
  foundations: {
    label: "Foundations",
    description: "Big-O analysis & recursion — mental models every pattern builds on",
    icon: GraduationCap,
    nodeBg: "bg-blue-600", nodeText: "text-white",
    lineBg: "bg-blue-200",
    cardAccent: "bg-blue-500", cardNumBg: "bg-blue-50 dark:bg-blue-500/10 dark:bg-blue-950/40", cardNumText: "text-white dark:text-blue-400",
    hoverBorder: "hover:border-blue-300 dark:hover:border-blue-700/50",
    headerBg: "bg-gradient-to-br from-blue-50 to-blue-50/30 dark:from-blue-950/40 dark:to-blue-950/10", cardBorder: "border-blue-100 dark:border-blue-500/20 dark:border-blue-900/40",
  },
  core: {
    label: "Core Patterns",
    description: "6 patterns that unlock ~60% of all interview problems — start here",
    icon: Target,
    nodeBg: "bg-violet-600", nodeText: "text-white",
    lineBg: "bg-violet-200",
    cardAccent: "bg-violet-500", cardNumBg: "bg-violet-50 dark:bg-violet-500/10 dark:bg-violet-950/40", cardNumText: "text-white dark:text-violet-400",
    hoverBorder: "hover:border-violet-300 dark:border-violet-500/30 dark:hover:border-violet-700/50",
    headerBg: "bg-gradient-to-br from-violet-50 to-violet-50/30 dark:from-violet-950/40 dark:to-violet-950/10", cardBorder: "border-violet-100 dark:border-violet-500/20 dark:border-violet-900/40",
  },
  advanced: {
    label: "Advanced",
    description: "Trees, Graphs, DP, Backtracking — hard-medium tier that separates candidates",
    icon: Flame,
    nodeBg: "bg-orange-50 dark:bg-orange-950/200", nodeText: "text-white",
    lineBg: "bg-orange-200",
    cardAccent: "bg-orange-500", cardNumBg: "bg-orange-50 dark:bg-orange-500/10 dark:bg-orange-950/40", cardNumText: "text-white dark:text-orange-400",
    hoverBorder: "hover:border-orange-300 dark:hover:border-orange-700/50",
    headerBg: "bg-gradient-to-br from-orange-50 to-orange-50/30 dark:from-orange-950/40 dark:to-orange-950/10", cardBorder: "border-orange-100 dark:border-orange-500/20 dark:border-orange-900/40",
  },
  specialised: {
    label: "Specialised",
    description: "Intervals, Bit tricks, Math, Tries — round out coverage before the loop",
    icon: Star,
    nodeBg: "bg-slate-600", nodeText: "text-white",
    lineBg: "bg-slate-300",
    cardAccent: "bg-slate-500", cardNumBg: "bg-surface dark:bg-slate-900/40", cardNumText: "text-muted-foreground dark:text-white",
    hoverBorder: "hover:border-border dark:hover:border-slate-700/50",
    headerBg: "bg-gradient-to-br from-slate-100 to-slate-50 dark:from-slate-900/40 dark:to-slate-900/20/40 dark:from-slate-900/40 dark:to-slate-900/10", cardBorder: "border-border dark:border-slate-800/40",
  },
};

const MODULE_HOURS: Record<string, number> = {
  "complexity-big-o": 3, "recursion-fundamentals": 4, "arrays-and-hashing": 6,
  "two-pointers": 4, "sliding-window": 5, "binary-search": 4,
  "stack-and-queue": 5, "linked-list": 5, "trees-and-bst": 8,
  "heap-and-priority-queue": 5, "graphs": 10, "backtracking": 7,
  "dynamic-programming": 12, "greedy": 5, "intervals": 4,
  "bit-manipulation": 3, "math-and-number-theory": 3, "tries": 4,
};

function phaseFor(moduleNumber: string): Phase {
  const n = parseInt(moduleNumber.replace(/^M/, ""), 10);
  if (n <= 2)  return "foundations";
  if (n <= 8)  return "core";
  if (n <= 14) return "advanced";
  return "specialised";
}

const FAQS: Array<{ q: string; a: string }> = [
  { q: "How is this different from LeetCode or NeetCode?", a: "Every problem ships with Java AND Python solutions (toggleable), a line-by-line walkthrough of each approach, a \"what to say in the interview\" card, and common-mistakes callouts. LeetCode gives you the problem; NeetCode gives you a video. This format sits in between — structured, searchable, language-switchable without leaving the page." },
  { q: "Where should I start if I'm new to DSA?", a: "Work the curriculum top to bottom. It's ordered by how interviewers actually test: Big-O and recursion first (M01–M02), then the six core patterns (M03–M08). After those six topics you'll recognise roughly 60% of easy and medium interview problems." },
  { q: "Why both Java and Python?", a: "Interviewers at most top companies let you pick your language, and the two most common picks are Java (backend/systems) and Python (ML/data/newer engineers). Writing the same solution in both surfaces language-idiom differences that interviewers sometimes probe." },
  { q: "How long does the full DSA prep take?", a: "1–2 hours/day consistent practice: 8–12 weeks to work through the curriculum with real comprehension. 3+ hours/day if interview-hunting: 4–6 weeks. Later problems take half the time of earlier ones because the patterns start compounding." },
  { q: "Can I use just one language?", a: "Yes. Flip the Java/Python toggle at the top of any problem and the code, walkthroughs, and interview-voice answers all stay in your chosen language. The toggle persists across pages." },
];

export default function DSAIndexPage() {
  const index = getDSAIndex();
  const problems = index?.problems ?? [];
  const modules = getDSAModules();
  const moduleCounts = getDSAModuleProblemCounts();
  const categories = getDSACategories();
  const modulesWithTheory = getDSAModulesWithLearnPages();

  const authoredByModule: Record<string, number> = {};
  for (const p of problems) {
    if (p.moduleSlug && problemHasAuthoredContent(p)) {
      authoredByModule[p.moduleSlug] = (authoredByModule[p.moduleSlug] ?? 0) + 1;
    }
  }

  const phaseOrder: Phase[] = ["foundations", "core", "advanced", "specialised"];
  const modulesByPhase: Record<Phase, typeof modules> = { foundations: [], core: [], advanced: [], specialised: [] };
  for (const m of modules) modulesByPhase[phaseFor(m.moduleNumber)].push(m);

  const firstAuthored = problems.find((p) => problemHasAuthoredContent(p));
  const primaryCtaHref = firstAuthored ? `/dsa/problem/${firstAuthored.slug}` : "#roadmap";

  const phaseHours = (phase: Phase) =>
    modulesByPhase[phase].reduce((s, m) => s + (MODULE_HOURS[m.moduleSlug] ?? 4), 0);
  const totalHours = phaseOrder.reduce((s, p) => s + phaseHours(p), 0);

  // Build module map for the client explorer
  const moduleMap = modules.map((m) => ({ slug: m.moduleSlug, title: m.title }));
  const moduleTitleMap = Object.fromEntries(modules.map((m) => [m.moduleSlug, m.title]));

  // Build serialisable problem rows for the explorer
  const problemRows: ProblemRow[] = problems.map((p) => ({
    slug: p.slug,
    title: p.title,
    difficulty: p.difficulty as "easy" | "medium" | "hard",
    category: p.category,
    patterns: p.patterns ?? [],
    companies: p.company_tags ?? [],
    moduleSlug: p.moduleSlug ?? "",
    moduleTitle: moduleTitleMap[p.moduleSlug ?? ""] ?? "",
    authored: problemHasAuthoredContent(p),
  }));

  const categoryChips = categories
    .map((cat) => ({ slug: cat, name: toDisplayName(cat), count: problems.filter((p) => p.category === cat).length }))
    .filter((c) => c.count > 0)
    .sort((a, b) => b.count - a.count);

  const diffCounts = {
    easy:   problems.filter((p) => p.difficulty === "easy").length,
    medium: problems.filter((p) => p.difficulty === "medium").length,
    hard:   problems.filter((p) => p.difficulty === "hard").length,
  };

  // Enrich the curated-sheet cards with their real authored metadata so the
  // counts/durations/taglines on the hub match the live sheet pages instead of
  // the hand-written fallbacks.
  const sheets = SHEETS.map((s) => {
    const data = getDSASheet(s.slug);
    return {
      ...s,
      authored: Boolean(data),
      count: data?.totalProblems ?? s.count,
      duration: data?.estimatedDuration ?? s.weeks,
      tagline: data?.tagline ?? s.note,
    };
  });
  // Featured plan = the first *authored* sheet (falls back to the first card).
  const featuredSheet = sheets.find((s) => s.authored) ?? sheets[0];
  const featuredHref = featuredSheet.authored
    ? `/dsa/sheet/${featuredSheet.slug}`
    : "#plans";
  const authoredSheetCount = sheets.filter((s) => s.authored).length;

  const topQuestions = TOP_QUESTIONS.slice(0, 8);

  const navItems: HubNavItem[] = [
    { id: "plans", label: "Study Plans" },
    { id: "roadmap", label: "Roadmap" },
    { id: "problems", label: "Problems" },
    { id: "topics", label: "Topics" },
    { id: "faq", label: "FAQ" },
  ];

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      { "@type": "BreadcrumbList", itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL },
        { "@type": "ListItem", position: 2, name: "DSA",  item: `${SITE_URL}/dsa` },
      ]},
      { "@type": "CollectionPage", name: "DSA Interview Questions — Java & Python", url: `${SITE_URL}/dsa`, inLanguage: "en" },
      { "@type": "FAQPage", mainEntity: FAQS.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })) },
    ],
  };

  return (
    <div className="relative min-h-screen bg-gradient-to-b from-[#eef0f4]  to-[#f4f5f7] dark:to-surface  dark:to-background">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      {/* ══════════════════════════════════════════════
          HERO — study-plan forward
      ══════════════════════════════════════════════ */}
      <header className="relative overflow-hidden bg-[#0f1014] text-white">
        <div className="pointer-events-none absolute inset-0" style={BG_HERO_GRID} aria-hidden />
        <div
          className="pointer-events-none absolute inset-0"
          style={{ background: "radial-gradient(ellipse 55% 65% at 25% -5%, rgba(139,92,246,0.18) 0%, transparent 60%)" }}
          aria-hidden
        />

        <div className="relative mx-auto max-w-screen-2xl px-5 sm:px-8 lg:px-12">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-1.5 text-xs text-zinc-500 dark:text-zinc-400 pt-4 pb-2">
            <Link href="/" className="hover:text-muted-foreground transition-colors flex items-center gap-1">
              <Home className="h-3 w-3" /> Home
            </Link>
            <ChevronRight className="h-3 w-3" />
            <span className="text-muted-foreground font-medium">DSA</span>
          </nav>

          {/* Two-column hero */}
          <div className="grid lg:grid-cols-[1fr_400px] xl:grid-cols-[1fr_440px] gap-8 xl:gap-12 items-center pb-10 pt-2">

            {/* ── LEFT: headline + CTAs ── */}
            <div>
              <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-violet-500 dark:border-violet-500/50 dark:border-violet-700/25 bg-violet-500 dark:bg-violet-800/10 px-3.5 py-1.5">
                <Sparkles className="h-3 w-3 text-violet-400 dark:text-violet-300" />
                <span className="text-xs font-bold uppercase tracking-widest text-violet-300 dark:text-violet-300">DSA Interview Prep</span>
              </div>

              <h1 className="text-3xl sm:text-[2.75rem] font-black tracking-tight text-white leading-[1.05] mb-4">
                Crack the coding round with a{" "}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 via-purple-300 to-indigo-400">
                  proven study plan
                </span>
              </h1>

              <p className="text-sm sm:text-base text-muted-foreground leading-relaxed max-w-[560px] mb-6">
                Pick a battle-tested problem set — Blind 75, NeetCode 150, Grind 75 — and we
                walk you through every problem brute-force → optimal in{" "}
                <span className="text-muted-foreground font-semibold">Java and Python</span>, with
                line-by-line explanations and interview coaching.
              </p>

              {/* CTAs */}
              <div className="flex flex-wrap gap-2.5 mb-6">
                <a
                  href="#plans"
                  className="inline-flex items-center gap-2 px-5 py-2.5 bg-violet-600 dark:bg-violet-800 hover:bg-violet-500 dark:bg-violet-800 text-white font-bold rounded-xl transition-colors text-sm shadow-lg shadow-violet-900/40"
                >
                  <Trophy className="h-4 w-4" /> Choose a study plan
                </a>
                <Link
                  href={primaryCtaHref}
                  className="inline-flex items-center gap-2 px-5 py-2.5 bg-background/[0.06] hover:bg-background/[0.12] border border-white/[0.12] text-muted-foreground hover:text-white font-medium rounded-xl transition-colors text-sm"
                >
                  <Play className="h-4 w-4" /> Start learning
                </Link>
                <a
                  href="#problems"
                  className="inline-flex items-center gap-2 px-5 py-2.5 bg-background/[0.06] hover:bg-background/[0.12] border border-white/[0.12] text-muted-foreground hover:text-white font-medium rounded-xl transition-colors text-sm"
                >
                  Browse {problems.length}+ problems <ChevronRight className="h-4 w-4" />
                </a>
              </div>

              {/* Inline stat strip */}
              <div className="flex flex-wrap items-center gap-x-6 gap-y-2">
                {[
                  { value: String(modules.length),        label: "Modules",     icon: BookOpen },
                  { value: String(problems.length) + "+", label: "Problems",    icon: Target },
                  { value: authoredSheetCount + " ready", label: "Study plans", icon: Trophy },
                  { value: "~" + totalHours + "h",         label: "Of content", icon: Clock },
                ].map((s) => (
                  <div key={s.label} className="flex items-center gap-2">
                    <s.icon className="h-4 w-4 text-violet-400 dark:text-violet-300 shrink-0" />
                    <span className="text-sm font-black text-white leading-none">{s.value}</span>
                    <span className="text-[11px] text-zinc-500 dark:text-zinc-400">{s.label}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* ── RIGHT: featured plan card ── */}
            <div className="hidden lg:block">
              <FeaturedPlanCard sheet={featuredSheet} href={featuredHref} />
            </div>
          </div>
        </div>

        {/* Feature strip */}
        <div className="border-t border-white/[0.06]">
          <div className="mx-auto max-w-screen-2xl px-5 sm:px-8 lg:px-12 py-3 flex flex-wrap gap-x-7 gap-y-1.5">
            {[
              { icon: Brain,         text: "Pattern-first curriculum" },
              { icon: TrendingUp,    text: "Brute force → optimal" },
              { icon: Zap,           text: "Java & Python toggle" },
              { icon: MessageSquare, text: "Interview coaching" },
              { icon: Compass,       text: "Time & space complexity" },
            ].map((f) => (
              <div key={f.text} className="flex items-center gap-1.5">
                <f.icon className="h-3 w-3 text-violet-400 dark:text-violet-300 shrink-0" />
                <span className="text-xs text-zinc-500 dark:text-zinc-400">{f.text}</span>
              </div>
            ))}
          </div>
        </div>
      </header>

      {/* ══════════════════════════════════════════════
          STICKY SECTION NAV
      ══════════════════════════════════════════════ */}
      <DSAHubNav items={navItems} />

      {/* ══════════════════════════════════════════════
          PAGE BODY
      ══════════════════════════════════════════════ */}
      <div className="relative">
        {/* Soft violet wash that ties the body back to the dark hero. */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 top-0 h-[460px] bg-gradient-to-b from-violet-200/45 via-violet-100/20 to-transparent"
        />
        <div className="relative mx-auto max-w-screen-2xl px-5 sm:px-8 lg:px-12 py-8 space-y-12">

        {/* ── 0 · CHOOSE YOUR PATH (orientation) ─────── */}
        <section aria-label="How to use this hub">
          <div className="mb-5">
            <p className="text-xs font-bold uppercase tracking-widest text-violet-600 dark:text-violet-400 mb-1 flex items-center gap-1.5">
              <Compass className="h-3.5 w-3.5" /> New here? Start in 10 seconds
            </p>
            <h2 className="text-2xl font-black text-foreground tracking-tight">
              Three ways to prep — pick the one that fits you
            </h2>
            <p className="text-sm text-muted-foreground mt-1 max-w-3xl leading-relaxed">
              Everything below is the same content, organised three ways. Choose how you want to
              work and jump straight to the right section — you can always switch later.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              {
                href: "#plans",
                step: "Path 1",
                icon: Trophy,
                title: "Follow a proven plan",
                bestIf: "You have interviews coming up",
                body: "Pick a battle-tested checklist (Blind 75, NeetCode 150…) and work it end-to-end. The fastest route if you're short on time.",
                cta: "Go to Study Plans",
                ring: "hover:border-amber-300 dark:border-amber-500/30 hover:shadow-amber-100/60",
                chip: "bg-amber-50 dark:bg-amber-500/10 border-amber-200 dark:border-amber-500/20 text-amber-600 dark:text-amber-400",
                accent: "text-amber-600 dark:text-amber-400",
                glow: "shadow-[0_2px_20px_-10px_rgba(245,158,11,0.3)]",
              },
              {
                href: "#roadmap",
                step: "Path 2",
                icon: GraduationCap,
                title: "Learn the patterns in order",
                bestIf: "You're building DSA from scratch",
                body: "Follow the 18-module roadmap, phase by phase. Each module starts with theory, then problems — ordered by how interviewers actually test.",
                cta: "Go to the Roadmap",
                ring: "hover:border-violet-300 dark:border-violet-500/30 hover:shadow-violet-100/60",
                chip: "bg-violet-50 dark:bg-violet-500/10 border-violet-200 dark:border-violet-500/20 text-violet-600 dark:text-violet-400",
                accent: "text-violet-600 dark:text-violet-400",
                glow: "shadow-[0_2px_20px_-10px_rgba(124,58,237,0.3)]",
              },
              {
                href: "#problems",
                step: "Path 3",
                icon: Target,
                title: "Drill specific problems",
                bestIf: "You're targeting a weak spot",
                body: "Jump into the full problem library or browse by topic. Filter by difficulty, module, or company to attack exactly what you need.",
                cta: "Go to Problems",
                ring: "hover:border-indigo-300 hover:shadow-indigo-100/60",
                chip: "bg-indigo-50 dark:bg-indigo-500/10 border-indigo-200 dark:border-indigo-500/20 text-indigo-600 dark:text-indigo-400",
                accent: "text-indigo-600 dark:text-indigo-400",
                glow: "shadow-[0_2px_20px_-10px_rgba(79,70,229,0.3)]",
              },
            ].map((p) => (
              <a
                key={p.href}
                href={p.href}
                className={`group relative flex flex-col rounded-2xl border border-border bg-gradient-to-b from-white to-slate-50/60 dark:to-slate-950/40 ring-1 ring-white/70 dark:from-zinc-900/60 dark:to-zinc-950/60 dark:ring-white/10 dark:border-white/10 ${p.glow} p-5 transition-all hover:-translate-y-0.5 hover:shadow-lg ${p.ring}`}
              >
                <div className="flex items-center justify-between mb-3">
                  <div className={`w-11 h-11 rounded-xl border flex items-center justify-center ${p.chip}`}>
                    <p.icon className={`h-5 w-5 ${p.accent}`} />
                  </div>
                  <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">
                    {p.step}
                  </span>
                </div>
                <h3 className="text-base font-bold text-foreground mb-1.5">{p.title}</h3>
                <div className={`inline-flex items-center gap-1.5 text-[11px] font-bold mb-2.5 ${p.accent}`}>
                  <CheckCircle2 className="h-3.5 w-3.5" /> Best if: {p.bestIf}
                </div>
                <p className="text-[13px] text-muted-foreground leading-relaxed flex-1">{p.body}</p>
                <span className={`mt-4 inline-flex items-center gap-1.5 text-xs font-bold ${p.accent}`}>
                  {p.cta}
                  <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-0.5 transition-transform" />
                </span>
              </a>
            ))}
          </div>
        </section>

        {/* ── 0.5 · BASIC 100 (fresher on-ramp) ──────── */}
        <section aria-label="Basic 100 for freshers">
          <Link
            href="/dsa/basic-100"
            className="group relative block overflow-hidden rounded-2xl bg-[#0f1014] text-white shadow-lg transition-all hover:-translate-y-0.5"
          >
            <div
              aria-hidden
              className="pointer-events-none absolute inset-0"
              style={{ background: "radial-gradient(ellipse 60% 90% at 0% 0%, rgba(16,185,129,0.28) 0%, transparent 60%), radial-gradient(ellipse 50% 90% at 100% 100%, rgba(139,92,246,0.22) 0%, transparent 60%)" }}
            />
            <div className="relative flex flex-col gap-4 p-6 sm:flex-row sm:items-center sm:justify-between sm:p-7">
              <div className="flex items-start gap-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-emerald-400 dark:border-emerald-700/30 bg-emerald-500 dark:bg-emerald-800/15">
                  <GraduationCap className="h-6 w-6 text-emerald-300 dark:text-emerald-300" />
                </div>
                <div className="min-w-0">
                  <div className="mb-1 inline-flex items-center gap-1.5 rounded-full border border-emerald-400 dark:border-emerald-700/25 bg-emerald-500 dark:bg-emerald-800/10 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-widest text-white dark:text-emerald-300">
                    <Sparkles className="h-3 w-3" /> Brand new to DSA? Start here
                  </div>
                  <h2 className="text-xl font-black tracking-tight sm:text-2xl">
                    Basic 100 — beginner problems for freshers
                  </h2>
                  <p className="mt-1 max-w-xl text-sm text-muted-foreground leading-relaxed">
                    100 of the simplest, most-asked coding problems — reverse a string, find the max,
                    FizzBuzz, check a prime — each explained step by step in Java and Python before you
                    tackle Easy, Medium, and Hard.
                  </p>
                </div>
              </div>
              <span className="inline-flex shrink-0 items-center gap-2 self-start rounded-xl bg-emerald-600 dark:bg-emerald-800 px-5 py-2.5 text-sm font-bold text-white shadow-lg shadow-emerald-900/40 transition-colors group-hover:bg-emerald-500 dark:bg-emerald-800 sm:self-center">
                <Play className="h-4 w-4" /> Start the Basic 100
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
              </span>
            </div>
          </Link>
        </section>

        {/* ── 1 · STUDY PLANS (primary funnel) ──────── */}
        <section id="plans" className="scroll-mt-32">
          <SectionHeading
            kicker="Start here"
            kickerColor="text-amber-600 dark:text-amber-400"
            title="Pick a study plan"
            subtitle="Industry-standard problem sets, time-boxed for interview prep. Each one links straight into our line-by-line walkthroughs."
            purpose="For: a ready-made checklist"
          />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {sheets.map((s) => {
              const inner = (
                <div className="p-5 flex flex-col flex-1">
                  <div className="flex items-start justify-between gap-2 mb-3">
                    <div className={`w-11 h-11 rounded-xl border flex items-center justify-center shrink-0 ${s.iconBg}`}>
                      <Trophy className={`h-5 w-5 ${s.iconColor}`} />
                    </div>
                    {s.authored
                      ? <span className="text-xs font-bold text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/20 px-2 py-0.5 rounded-md">Available</span>
                      : <span className="text-xs font-bold text-muted-foreground bg-surface border border-border px-2 py-0.5 rounded-md">Soon</span>
                    }
                  </div>
                  <div className="text-base font-bold text-foreground mb-1">{s.name}</div>
                  <div className="text-sm text-muted-foreground mb-3 leading-snug line-clamp-2">{s.tagline}</div>
                  <div className="flex items-center gap-3 text-xs text-muted-foreground mt-auto">
                    <span className="font-semibold text-muted-foreground">{s.count} problems</span>
                    <span>·</span>
                    <span>{s.duration}</span>
                  </div>
                </div>
              );
              return s.authored ? (
                <Link
                  key={s.slug}
                  href={`/dsa/sheet/${s.slug}`}
                  className="group rounded-2xl border border-border bg-background hover:border-violet-300 dark:border-violet-500/30 hover:shadow-lg hover:shadow-violet-100/60 hover:-translate-y-0.5 transition-all flex flex-col overflow-hidden"
                >
                  <div className={`h-1.5 bg-gradient-to-r ${s.color}`} />
                  {inner}
                  <div className="px-5 pb-4 pt-3 border-t border-slate-100 dark:border-slate-800/60 flex items-center gap-1.5 text-xs font-semibold text-violet-600 dark:text-violet-400 group-hover:text-violet-700 dark:text-violet-400">
                    Open this plan <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-0.5 transition-transform" />
                  </div>
                </Link>
              ) : (
                <div key={s.slug} className="rounded-2xl border border-border bg-background opacity-60 cursor-not-allowed flex flex-col overflow-hidden">
                  <div className={`h-1.5 bg-gradient-to-r ${s.color} opacity-50`} />
                  {inner}
                </div>
              );
            })}
          </div>
        </section>

        {/* ── 2 · LEARNING ROADMAP (condensed phases) ── */}
        <section id="roadmap" className="scroll-mt-32">
          <SectionHeading
            kicker="Structured preparation"
            kickerColor="text-violet-600 dark:text-violet-400"
            title="Or follow the full roadmap"
            subtitle={`${modules.length} modules across 4 phases · ~${totalHours}h · ordered by how interviewers actually test.`}
            purpose="For: learning topic-by-topic"
          />

          {/* How to use — compact 3-step strip */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-6">
            {[
              { n: "1", title: "Start at your level", body: "New? Begin at M01 (Big-O). Experienced? Jump to Core Patterns (M03)." },
              { n: "2", title: "Read theory, then solve", body: "Each module opens with a Learn page: patterns, templates, when-to-use signals." },
              { n: "3", title: "Work the phases in order", body: "Foundations → Core (≈60% of interviews) → Advanced → Specialised." },
            ].map((step) => (
              <div key={step.n} className="flex items-start gap-3 rounded-xl border border-border bg-background p-4">
                <span className="shrink-0 w-7 h-7 rounded-lg bg-violet-100 dark:bg-violet-950/20 text-violet-700 dark:text-violet-400 flex items-center justify-center text-sm font-black">
                  {step.n}
                </span>
                <div>
                  <div className="text-sm font-bold text-foreground mb-0.5">{step.title}</div>
                  <div className="text-xs text-muted-foreground leading-relaxed">{step.body}</div>
                </div>
              </div>
            ))}
          </div>

          {/* Phase cards — 2-col grid; each card lists its modules compactly */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {phaseOrder.map((phase, phaseIdx) => {
              const phaseMods = modulesByPhase[phase];
              if (phaseMods.length === 0) return null;
              const meta = PHASE_META[phase];
              const PhaseIcon = meta.icon;
              const hours = phaseHours(phase);

              return (
                <div
                  key={phase}
                  className={`rounded-2xl border bg-background overflow-hidden flex flex-col shadow-sm ${meta.cardBorder}`}
                >
                  {/* Phase header */}
                  <div className={`flex items-start gap-3 px-5 pt-5 pb-4 border-b ${meta.cardBorder} ${meta.headerBg}`}>
                    <div className={`shrink-0 w-11 h-11 rounded-xl flex items-center justify-center shadow-sm ${meta.nodeBg}`}>
                      <PhaseIcon className={`h-5 w-5 ${meta.nodeText}`} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                          Phase {phaseIdx + 1}
                        </span>
                        <span className="text-[11px] text-muted-foreground flex items-center gap-1">
                          {phaseMods.length} modules · <Clock className="h-3 w-3" /> ~{hours}h
                        </span>
                      </div>
                      <h3 className="text-base font-bold text-foreground leading-tight mt-0.5">{meta.label}</h3>
                      <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">{meta.description}</p>
                    </div>
                  </div>

                  {/* Module rows */}
                  <div className="p-3 space-y-1.5 flex-1">
                    {phaseMods.map((m) => {
                      const indexed = moduleCounts[m.moduleSlug] ?? 0;
                      const hasTheory = modulesWithTheory.has(m.moduleSlug);
                      const moduleNum = parseInt(m.moduleNumber.replace(/^M0?/, ""), 10);

                      return (
                        <Link
                          key={m.moduleSlug}
                          href={`/dsa/module/${m.moduleSlug}`}
                          className={`group flex items-center gap-3 rounded-xl border border-slate-100 dark:border-slate-800/60 bg-surface/60 dark:bg-surface/40 px-3 py-2.5 hover:bg-background dark:hover:bg-slate-900/50 hover:shadow-sm transition-all ${meta.hoverBorder}`}
                        >
                          <div className={`shrink-0 w-7 h-7 rounded-lg flex items-center justify-center text-xs font-black ${meta.cardNumBg} ${meta.cardNumText}`}>
                            {moduleNum}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2">
                              <span className="text-sm font-semibold text-foreground group-hover:text-violet-700 dark:text-violet-400 transition-colors truncate">
                                {m.title}
                              </span>
                              {hasTheory && (
                                <span className="hidden sm:inline-flex items-center gap-1 text-[10px] font-bold px-1.5 py-0.5 bg-blue-50 dark:bg-blue-500/10 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-800/50 rounded-md shrink-0">
                                  <BookOpen className="h-2.5 w-2.5" /> Learn
                                </span>
                              )}
                            </div>
                          </div>
                          {indexed > 0 && (
                            <span className="hidden sm:inline text-[11px] text-muted-foreground shrink-0">{indexed}</span>
                          )}
                          <ArrowRight className="h-3.5 w-3.5 text-muted-foreground group-hover:text-violet-500 dark:text-violet-400 transition-colors shrink-0" />
                        </Link>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* ── 3 · PROBLEMS (most-asked + explorer) ───── */}
        <section id="problems" className="scroll-mt-32">
          <SectionHeading
            kicker="All problems"
            kickerColor="text-indigo-600 dark:text-indigo-400"
            title="Browse the problem library"
            subtitle={`${problems.length} problems · ${diffCounts.easy} easy · ${diffCounts.medium} medium · ${diffCounts.hard} hard · filter by difficulty, module, or search.`}
            purpose="For: drilling specific problems"
          />

          {/* Most-asked quick strip */}
          <div className="mb-6">
            <div className="flex items-center gap-2 mb-3">
              <Flame className="h-4 w-4 text-amber-500 dark:text-amber-400" />
              <h3 className="text-sm font-bold text-foreground">Most-asked in FAANG interviews</h3>
              <span className="text-xs text-muted-foreground">— start with these</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
              {topQuestions.map((q, i) => {
                const d = DIFF[q.difficulty];
                return (
                  <Link
                    key={q.slug}
                    href={`/dsa/problem/${q.slug}`}
                    className="group flex items-center gap-2.5 px-3 py-2.5 rounded-xl border border-border bg-background hover:border-violet-300 dark:border-violet-500/30 hover:shadow-sm transition-all"
                  >
                    <span className="shrink-0 w-6 h-6 rounded-full bg-surface border border-border group-hover:border-violet-200 dark:border-violet-500/20 flex items-center justify-center text-[11px] font-bold text-muted-foreground group-hover:text-violet-500 dark:text-violet-400 transition-colors">
                      {i + 1}
                    </span>
                    <div className="flex-1 min-w-0">
                      <div className="text-[13px] font-semibold text-foreground group-hover:text-violet-700 dark:text-violet-400 transition-colors truncate">
                        {q.title}
                      </div>
                      <div className="flex items-center gap-1.5 mt-0.5">
                        <span className={`text-[9px] font-bold px-1 py-0.5 rounded ${d.badge}`}>
                          {q.difficulty.charAt(0).toUpperCase() + q.difficulty.slice(1)}
                        </span>
                        <span className="text-[10px] text-muted-foreground truncate">{q.pattern}</span>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>

          {/* Full explorer */}
          <div className="rounded-2xl border border-border bg-background shadow-sm p-5 sm:p-6">
            <div className="flex items-center gap-2 mb-4 text-xs text-muted-foreground">
              <Filter className="h-3.5 w-3.5" />
              <span className="font-semibold text-muted-foreground">Full problem explorer</span>
            </div>
            <DSAProblemExplorer problems={problemRows} moduleMap={moduleMap} />
          </div>
        </section>

        {/* ── 4 · BROWSE BY TOPIC ────────────────────── */}
        <section id="topics" className="scroll-mt-32">
          <SectionHeading
            kicker="What's covered"
            kickerColor="text-blue-600 dark:text-blue-400"
            title="Browse by topic"
            subtitle={`${categoryChips.length} topics — each links to a theory page plus problems and solutions.`}
            purpose="For: targeting one topic"
          />
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-2.5">
            {categoryChips.map((cat) => {
              const meta = TOPIC_META[cat.slug] ?? FALLBACK_TOPIC;
              const Icon = meta.icon;
              return (
                <Link
                  key={cat.slug}
                  href={`/dsa/${cat.slug}`}
                  className="group flex items-center gap-3 rounded-xl border border-border bg-background hover:border-violet-300 dark:border-violet-500/30 hover:shadow-sm px-3.5 py-3 transition-all"
                >
                  <div className={`shrink-0 w-9 h-9 rounded-lg border flex items-center justify-center ${meta.bg}`}>
                    <Icon className={`h-4 w-4 ${meta.accent}`} />
                  </div>
                  <div className="min-w-0">
                    <div className="text-sm font-semibold text-foreground group-hover:text-violet-700 dark:text-violet-400 truncate transition-colors">{cat.name}</div>
                    <div className="text-xs text-muted-foreground mt-0.5">{cat.count} problems</div>
                  </div>
                </Link>
              );
            })}
          </div>
        </section>

        {/* ── 5 · PAIRS WELL WITH (slim band) ─────────── */}
        <section className="rounded-2xl border border-border bg-background shadow-sm p-5 sm:p-6">
          <div className="flex items-center gap-2 mb-4">
            <Award className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
            <h2 className="text-base font-bold text-foreground">Pairs well with</h2>
            <span className="text-xs text-muted-foreground">— complete your prep</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {[
              { href: "/java-backend-intermediate",   title: "Java Backend — Intermediate",  desc: "Spring Boot · JPA · Microservices · System Design" },
              { href: "/java-fullstack-intermediate",  title: "Java Fullstack — Intermediate", desc: "Spring Boot + React · TypeScript · Web fundamentals" },
              { href: "/go-intermediate",              title: "Go — Intermediate",             desc: "Goroutines · gRPC · Gin · System Design · Cloud" },
            ].map((item) => (
              <Link key={item.href} href={item.href} className="group flex items-start gap-3 rounded-xl border border-border bg-surface/60 hover:bg-background hover:border-emerald-300 dark:border-emerald-500/30 hover:shadow-sm p-4 transition-all">
                <div className="w-2 h-2 rounded-full bg-emerald-400 dark:bg-emerald-800 shrink-0 mt-1.5" />
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-semibold text-foreground group-hover:text-emerald-700 dark:text-emerald-400 transition-colors">{item.title}</div>
                  <div className="text-xs text-muted-foreground mt-0.5">{item.desc}</div>
                </div>
                <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-emerald-500 dark:text-emerald-400 shrink-0 transition-colors mt-0.5" />
              </Link>
            ))}
          </div>
        </section>

        {/* ── 6 · FAQ ────────────────────────────────── */}
        <section id="faq" className="scroll-mt-32">
          <SectionHeading
            kicker="Common questions"
            kickerColor="text-indigo-600 dark:text-indigo-400"
            title="Frequently asked"
          />
          <div className="space-y-2">
            {FAQS.map((f, i) => (
              <details key={i} className="group rounded-xl border border-border bg-background hover:border-violet-200 dark:border-violet-500/20 transition-colors">
                <summary className="flex items-center justify-between gap-4 px-5 py-3.5 cursor-pointer list-none">
                  <span className="text-sm font-semibold text-foreground group-hover:text-violet-700 dark:text-violet-400 transition-colors leading-snug">
                    {f.q}
                  </span>
                  <ChevronRight className="h-4 w-4 text-muted-foreground shrink-0 group-open:rotate-90 transition-transform" />
                </summary>
                <div className="px-5 pb-4 text-sm text-muted-foreground leading-relaxed border-t border-slate-100 dark:border-slate-800/60 pt-3">
                  {f.a}
                </div>
              </details>
            ))}
          </div>
        </section>

        </div>
      </div>
    </div>
  );
}

// ─── Presentational helpers ─────────────────────────────────────────────────

/** Consistent section header used across the hub body. */
function SectionHeading({
  kicker,
  kickerColor,
  title,
  subtitle,
  purpose,
}: {
  kicker: string;
  kickerColor: string;
  title: string;
  subtitle?: string;
  /** Short "what this section is for" pill, right-aligned on desktop. */
  purpose?: string;
}) {
  return (
    <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
      <div>
        <p className={`text-xs font-bold uppercase tracking-widest mb-1 ${kickerColor}`}>{kicker}</p>
        <h2 className="text-2xl font-black text-foreground tracking-tight">{title}</h2>
        {subtitle && <p className="text-sm text-muted-foreground mt-1 max-w-3xl leading-relaxed">{subtitle}</p>}
      </div>
      {purpose && (
        <span className="shrink-0 inline-flex items-center gap-1.5 self-start rounded-full border border-border bg-background px-3 py-1.5 text-[11px] font-bold text-muted-foreground shadow-sm">
          <Compass className="h-3.5 w-3.5 text-violet-500 dark:text-violet-400" />
          {purpose}
        </span>
      )}
    </div>
  );
}

/**
 * The recommended study plan, shown in the hero's right column to reinforce
 * the "pick a plan" funnel. Falls back gracefully to a "coming soon" state if
 * no sheet is authored yet.
 */
function FeaturedPlanCard({
  sheet,
  href,
}: {
  sheet: {
    name: string;
    tagline: string;
    count: number;
    duration: string;
    authored: boolean;
    iconBg: string;
    iconColor: string;
  };
  href: string;
}) {
  const card = (
    <div className="rounded-2xl border border-white/[0.1] bg-background/[0.04] p-5 backdrop-blur-sm transition-colors group-hover:border-violet-500 dark:border-violet-500/50 dark:border-violet-700/40 group-hover:bg-background/[0.07]">
      <div className="flex items-center justify-between mb-4">
        <span className="inline-flex items-center gap-1.5 rounded-full border border-amber-500 dark:border-amber-700/25 bg-amber-500 dark:bg-amber-800/10 px-2.5 py-1 text-[11px] font-bold uppercase tracking-widest text-amber-950 dark:text-amber-300">
          <Star className="h-3 w-3" /> Recommended start
        </span>
        {sheet.authored && (
          <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-400 dark:text-emerald-300">
            <CheckCircle2 className="h-3 w-3" /> Ready
          </span>
        )}
      </div>

      <div className={`w-12 h-12 rounded-xl border flex items-center justify-center mb-3 ${sheet.iconBg}`}>
        <Trophy className={`h-6 w-6 ${sheet.iconColor}`} />
      </div>

      <div className="text-xl font-black text-white mb-1">{sheet.name}</div>
      <p className="text-sm text-muted-foreground leading-relaxed mb-4">{sheet.tagline}</p>

      <div className="flex items-center gap-4 text-xs text-zinc-500 dark:text-zinc-400 mb-4 pb-4 border-b border-white/[0.08]">
        <span className="flex items-center gap-1.5 text-muted-foreground font-semibold">
          <Target className="h-3.5 w-3.5 text-violet-400 dark:text-violet-300" /> {sheet.count} problems
        </span>
        <span className="flex items-center gap-1.5">
          <Clock className="h-3.5 w-3.5 text-violet-400 dark:text-violet-300" /> {sheet.duration}
        </span>
      </div>

      <span className="inline-flex items-center gap-2 text-sm font-bold text-violet-300 dark:text-violet-300 group-hover:text-violet-200 dark:text-violet-300">
        {sheet.authored ? "Open this plan" : "See all plans"}
        <ArrowRight className="h-4 w-4 group-hover:translate-x-0.5 transition-transform" />
      </span>
    </div>
  );

  return href.startsWith("#") ? (
    <a href={href} className="group block">{card}</a>
  ) : (
    <Link href={href} className="group block">{card}</Link>
  );
}
