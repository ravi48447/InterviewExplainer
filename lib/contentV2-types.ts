/**
 * contentV2-types.ts
 *
 * TypeScript types for the 3-layer content architecture:
 *   Layer 1: content/shared/   (tools, frontend, architecture, data, behavioral)
 *   Layer 2: content/interview/{lang}/{track}/{level}/{stack}
 *   Layer 3: content/dsa/
 *
 * These types mirror the JSON schema in the content files.
 * The existing api.ts types (QuestionPagePayload, etc.) remain untouched —
 * contentV2 maps *into* those types so pages render without changes.
 */

// ─── Experience Levels ───────────────────────────────────────────────────────

import type { SpeakableV2 } from './speakable/schema';

export type Level = 'beginner' | 'intermediate' | 'advanced';
export type Difficulty = 'easy' | 'medium' | 'hard';

// ─── Interviewer Intent (new schema field) ───────────────────────────────────

export interface InterviewerIntent {
  testing: string;
  common_mistake: string;
  to_stand_out: string;
}

// ─── Answer Sections ─────────────────────────────────────────────────────────

export type V2SectionType =
  | 'speakable_answer'
  | 'deep_explanation'
  | 'code_example'
  | 'important_points'
  | 'practice_prompt'
  | 'interviewer_expectation'
  | 'core_concepts'
  | 'short_summary'
  | 'detailed_explanation'
  | 'best_practices'
  | 'common_mistakes'
  | 'real_world_example'
  | 'scenario_based'
  | 'followup_questions'
  | string;

export interface V2AnswerSection {
  type: V2SectionType;
  title?: string;
  content: string | string[];
  language?: string;
  replaceSection?: boolean;
}

export interface V2Answer {
  sections: V2AnswerSection[];
}

// ─── SEO metadata ────────────────────────────────────────────────────────────

export interface V2QuestionSEO {
  metaTitle: string;
  metaDescription: string;
  canonicalUrl?: string;
}

// ─── Layout Types ─────────────────────────────────────────────────────────────

export type LayoutType =
  | 'concept-explainer'
  | 'comparison-arena'
  | 'internals-deep-dive'
  | 'code-workshop'
  | 'architecture-map'
  | 'lifecycle-timeline'
  | 'recipe-builder'
  | 'problem-detective'
  | 'reference-cards'
  | 'sql-playground'
  | 'flow-diagram'
  | 'design-whiteboard'
  | 'algorithm-workshop';

// ─── Single Question Entry (in complete-qa.json) ─────────────────────────────

export interface V2QuestionEntry {
  id: string;
  slug: string;
  question: string;
  title?: string;
  direct_answer: string;
  interviewer_intent: InterviewerIntent;
  company_tags: string[];
  reading_time_minutes: number;
  last_updated: string;
  difficulty: Difficulty;
  answer: V2Answer;
  followup_questions?: string[];
  seo: V2QuestionSEO;
  layout_type?: LayoutType;
  /** Structured Speakable v2 (Phase 2 renderer). Present on JBF/JBI questions. */
  speakable_v2?: SpeakableV2;
}

// ─── complete-qa.json file (shared or unique) ────────────────────────────────

export interface V2ContentMeta {
  stack: string;
  level: Level | 'all';
  lang?: string;
  track?: string;
  seoPrefix?: string;
  last_updated: string;
  description: string;
}

export interface V2CompleteQA {
  meta: V2ContentMeta;
  questions: V2QuestionEntry[];
}

// ─── $ref pointer file (interview/{lang}/{track}/{level}/{stack}) ─────────

export interface V2RefOverrides {
  seo?: Partial<V2QuestionSEO>;
  answer?: {
    sections?: V2AnswerSection[];
  };
}

export interface V2RefQuestion {
  $ref: string;
  overrides?: V2RefOverrides;
}

export interface V2RefFile {
  $source: string;
  overrides?: {
    meta?: Partial<V2ContentMeta>;
  };
  questions: V2RefQuestion[];
}

export type V2ContentFile = V2CompleteQA | V2RefFile;

export function isRefFile(data: V2ContentFile): data is V2RefFile {
  return '$source' in data;
}

// ─── DSA Types ───────────────────────────────────────────────────────────────

export interface DSAProblemIndex {
  slug: string;
  title: string;
  difficulty: Difficulty;
  category: string;
  /**
   * Back-reference to the DSA curriculum module this problem belongs to.
   * Matches DSAModule.moduleSlug. Optional for forward compatibility with
   * problems authored before the curriculum overlay existed.
   */
  moduleSlug?: string;
  patterns: string[];
  level_tags: Level[];
  track_tags: string[];
  lang_tags: string[];
  company_tags: string[];
}

/**
 * A DSA curriculum module — a pillar-level grouping of problems and theory
 * that has its own SEO landing page. Defined as a sibling of `problems[]`
 * in content/dsa/_index.json.
 */
export interface DSAModule {
  /** Sequential marker, e.g. "M01". Used for UI ordering hints only. */
  moduleNumber: string;
  /** Kebab-case identifier used as the internal key and URL segment. */
  moduleSlug: string;
  /** Display title on the module landing page. */
  title: string;
  /**
   * Root-level canonical SEO slug for the module landing page, e.g.
   * "arrays-and-hashing-interview-questions". Registered in SEO_MODULES.
   */
  seoSlug: string;
  /** Single-line hook used in cards and meta descriptions. */
  tagline: string;
  /** 1–2 sentence description used on cards and in JSON-LD. */
  shortDescription: string;
  /** Pedagogical level hint. */
  level: 'beginner' | 'intermediate' | 'advanced';
  /** Whether the module is theory-heavy, practice-heavy, or mixed. */
  focus: 'theory' | 'practice' | 'mixed';
  /** Module slugs that the learner should ideally finish first. */
  prerequisites?: string[];
}

export interface DSAIndex {
  /**
   * Optional curriculum sequence. Ordered by intended learning progression.
   * Older index files without `modules` continue to work (treat as []).
   */
  modules?: DSAModule[];
  problems: DSAProblemIndex[];
}

// ─── DSA Learn Page (theory content for a module) ────────────────────────────

export interface DSALearnCodeExample {
  language: 'java' | 'python' | 'pseudocode';
  /** Optional label shown above the code block (e.g. "One-pass template"). */
  label?: string;
  code: string;
}

export interface DSALearnCallout {
  type: 'tip' | 'warning' | 'note';
  text: string;
}

export interface DSALearnSection {
  /** Stable anchor slug within the page. */
  id: string;
  heading: string;
  /** Paragraphs separated by `\n\n`. Kept as plain text — no HTML. */
  body: string;
  /**
   * Code examples that appear below the body, in order. Multiple languages
   * for the same concept stack vertically with a language badge.
   */
  codeExamples?: DSALearnCodeExample[];
  callouts?: DSALearnCallout[];
}

/**
 * Theory content for a DSA curriculum module. Lives at
 * content/dsa/learn/<moduleSlug>/index.json. A module can render its landing
 * page without a learn file (the page shows a "Theory coming soon" banner and
 * the practice list); presence of a learn file promotes the module to a full
 * learning unit.
 */
export interface DSALearnPage {
  /** Must match DSAModule.moduleSlug exactly. */
  moduleSlug: string;
  /** Usually matches module title; override if SEO benefits from variation. */
  title: string;
  /** 1-line hook. Shown in hero. */
  tagline: string;
  /** 1–3 paragraph conceptual intro (separated by `\n\n`). */
  intro: string;
  /** "What you'll learn" bullets. 4–8 items recommended. */
  objectives: string[];
  /** Pattern-recognition cues: when you *should* reach for this technique. */
  whenToUse: {
    signals: string[];
    antiSignals: string[];
  };
  /** Deep-dive sections, rendered in order. */
  sections: DSALearnSection[];
  /** 1-paragraph "how to talk about this pattern in an interview". */
  interviewTalking?: string;
  /** Common mistakes / traps. 3–6 items. */
  commonMistakes?: string[];
  /** Short complexity summary — "O(n) time, O(n) space for most problems". */
  complexityNotes?: string;
  /**
   * Intended practice order for this module, by problem slug. Falls back to
   * the order problems appear in _index.json.problems[].
   */
  problemOrder?: string[];
  seo?: {
    title?: string;
    description?: string;
    altSlugs?: string[];
  };
}

/**
 * DSASheet — curated problem list (Blind 75, NeetCode 150, Grind 75, …).
 *
 * Served from content/dsa/sheets/<sheetSlug>/index.json and rendered at
 * /dsa/sheet/<sheetSlug>. Problems are referenced by slug into the
 * _index.json problems[] array, so we never duplicate problem metadata.
 */
export interface DSASheetGroup {
  /** Stable id for the group (kebab-case). */
  groupSlug: string;
  /** Human-readable group title — "Week 1: Arrays & Hashing". */
  title: string;
  /** Optional short blurb for the group header. */
  blurb?: string;
  /** Problem slugs in intended practice order, matching DSAProblemIndex.slug. */
  problemSlugs: string[];
}

export interface DSASheet {
  sheetSlug: string;
  title: string;
  /** One-line positioning statement. */
  tagline: string;
  /** 2–3 paragraph intro explaining what the sheet is and who it's for. */
  description: string;
  /** E.g. "8 weeks, ~1–2 hours per day". */
  estimatedDuration?: string;
  /** Canonical author credit — "Originally curated by Yangshun". */
  credit?: string;
  /** URL of the original source for attribution. */
  sourceUrl?: string;
  /** Total number of problems in the sheet (derived, but stored for SEO). */
  totalProblems: number;
  /**
   * Fallback flat ordering when groups aren't used. If groups[] is present
   * it takes precedence — this is optional.
   */
  problemOrder?: string[];
  /** Grouping (by topic, week, or difficulty). Preferred layout. */
  groups?: DSASheetGroup[];
  /** Study plan — bullet points shown on the sheet landing page. */
  howToUse?: string[];
  /** 3–6 bullets — "Why we publish this sheet". */
  whyThisSheet?: string[];
  seo?: {
    title?: string;
    description?: string;
    altSlugs?: string[];
  };
}

/**
 * Languages a DSA problem may publish solutions in. The hub promises
 * Java + Python; `javascript` is allowed in the schema for legacy content
 * but the rendered problem page filters it out so the UI stays consistent
 * with the headline ("Java AND Python solutions"). Add a new language only
 * after also updating the hub copy and the line-by-line authoring guide.
 */
export type DSACodeLang = "java" | "python" | "javascript";

export type DSAFrequency = "very-high" | "high" | "medium" | "low";

export interface DSALineAnnotation {
  /** A single source line, exactly as it appears in `code[lang]`. */
  line: string;
  /**
   * Plain-text explanation rendered alongside the code line in the
   * two-column walkthrough. Keep to one or two sentences.
   */
  explanation: string;
}

/**
 * Edge-case trace for a specific approach. `input` is shown verbatim
 * (use the same notation as `examples[].input`); `behavior` is one or two
 * sentences describing what the approach DOES on that input — both the
 * mechanics and the correctness reasoning.
 */
export interface DSAApproachEdgeCase {
  input: string;
  behavior: string;
}

/**
 * Discriminated union of supported teaching diagrams.
 *
 * - `mermaid`: free-form mermaid.js source (flowchart, sequence, etc.).
 *   Use for control-flow, decision trees, and anything that doesn't fit
 *   a typed primitive. Loaded lazily on the client to keep first-paint
 *   bundles small.
 * - `hashmap-state`: typed visual showing how a key→value map evolves
 *   over a sequence of steps. Pair with a `dryRun` to make the trace
 *   visual instead of just tabular.
 * - `array-state`: typed visual showing an array with optional pointer
 *   markers (i, j, left, right) and per-cell highlights. Useful for
 *   two-pointer, sliding-window, and in-place modification problems.
 *
 * Authors should prefer typed primitives (hashmap-state / array-state)
 * over mermaid when the shape fits — they look better and stay
 * consistent across problems.
 */
export type DSADiagram =
  | DSAMermaidDiagram
  | DSAHashmapStateDiagram
  | DSAArrayStateDiagram;

export interface DSAMermaidDiagram {
  type: "mermaid";
  /** Caption shown above the rendered diagram. */
  title: string;
  /** Optional 1-2 sentence intro shown between the title and the diagram. */
  caption?: string;
  /**
   * Raw mermaid source. Common types: `flowchart TD`, `flowchart LR`,
   * `sequenceDiagram`, `stateDiagram-v2`. Keep nodes short — mermaid
   * doesn't wrap text well.
   */
  source: string;
}

export interface DSAHashmapStateDiagram {
  type: "hashmap-state";
  title: string;
  caption?: string;
  /** Label for the input being traced (e.g. "nums = [3, 2, 4], target = 6"). */
  input?: string;
  /** Each frame is a snapshot of the map after one step. */
  frames: {
    /** Step label — usually matches the dryRun step (e.g. "i=1, num=2"). */
    step: string;
    /** Short description of what changed in this frame. */
    action: string;
    /**
     * Map contents as ordered key→value pairs. Render as a row of cells.
     * Use string values so authors can write whatever literal makes sense
     * (numbers, "null", booleans, etc.).
     */
    entries: { key: string; value: string }[];
    /** Key (if any) that was just inserted/updated this frame — highlighted. */
    highlightKey?: string;
    /** Key (if any) currently being looked up — outlined. */
    lookupKey?: string;
    /** Whether the lookup found a match this frame. */
    found?: boolean;
  }[];
}

export interface DSAArrayStateDiagram {
  type: "array-state";
  title: string;
  caption?: string;
  input?: string;
  frames: {
    step: string;
    action: string;
    /** Array values as strings. Length should be constant across frames. */
    values: string[];
    /**
     * Pointer markers — each one renders as a small label above the
     * indicated cell. Common names: `i`, `j`, `left`, `right`, `slow`,
     * `fast`. Multiple pointers can sit on the same index.
     */
    pointers?: { name: string; index: number }[];
    /** Cell indices to highlight as "active" this frame. */
    highlight?: number[];
    /** Cell indices to fade out (e.g. "already processed"). */
    dim?: number[];
  }[];
}

/**
 * One row in a hand-traced dry run. Models the candidate-on-whiteboard
 * step: "at iteration 2, num=7, complement=2, map={2:0}, found → return [0,2]".
 * Renders as a row in a state table — every column is short prose or a
 * monospace literal.
 */
export interface DSADryRunStep {
  /**
   * Iteration label. Free-form so the author can use "i=0", "step 1",
   * "left=0, right=3", etc., depending on the algorithm shape.
   */
  step: string;
  /** What the algorithm DOES at this step (the verb). */
  action: string;
  /**
   * Snapshot of relevant state AFTER the step. Keep to one line so the
   * table stays scannable. Use literals like `map={2:0}` or `i=1, j=2`.
   */
  state: string;
  /**
   * Optional callout when this step is the "aha" moment of the trace
   * (the iteration that finds the answer, the pointer crossing, etc.).
   * Renders with a highlighted background.
   */
  note?: string;
}

/**
 * A complete hand-traced example. Pairs an input with the step-by-step
 * walk and a final result line, so the reader can follow the algorithm
 * exactly the way the candidate would on a whiteboard.
 */
export interface DSADryRun {
  /** Input expression. Use the same notation as `examples[].input`. */
  input: string;
  /**
   * Optional 1-2 sentence intro before the table. Useful to call out
   * what the reader should pay attention to in the trace.
   */
  intro?: string;
  /** Ordered list of steps. Render as a table. */
  steps: DSADryRunStep[];
  /** Final return value or terminal state. */
  result: string;
}

export interface DSAApproach {
  name: string;
  /**
   * @deprecated Approaches are now sorted by their position in the
   * `approaches[]` array. The optimal one MUST be last so the page can
   * surface it as "optimal" without extra metadata. Field retained for
   * backwards compatibility only.
   */
  order?: number;
  whenToMention: string;
  complexity: { time: string; space: string };
  /**
   * Progressive hints — 1 to 3 short nudges that reveal the approach
   * incrementally, like LeetCode / HackerRank hint panels. Renders
   * BEFORE the plan/insight inside a collapsed "Stuck? Tap for a hint"
   * strip so readers can self-challenge without reading the full
   * solution. Keep each hint a single sentence. Order from gentle
   * nudge to near-giveaway.
   */
  hints?: string[];
  /**
   * The "plan" — 2-3 sentences describing what we're going to do, in the
   * voice the candidate would use BEFORE writing any code ("I'll walk
   * through the array once, keep a hash map of value→index, and for each
   * element check whether the complement is already in the map"). Field
   * is named `explanation` for backwards compatibility but new content
   * should write it as a verbal plan, not a code comment.
   */
  explanation: string;
  /**
   * The "aha" paragraph — *why* this approach works, the mental model
   * the candidate should have. 1-2 paragraphs of narrative, not a code
   * comment. Renders right after the plan, before any code or trace.
   */
  insight?: string;
  /**
   * Structured hand-trace. Renders as a state table (step / action /
   * state). Strongly recommended — this is the "dry run on the
   * whiteboard" moment that comes BEFORE the code in a real interview.
   * Single trace per approach is enough; pick a non-trivial input that
   * exercises the interesting branch.
   */
  dryRun?: DSADryRun;
  /**
   * 1-2 sentence justification of the time/space numbers in the
   * `complexity` object. The numbers tell you WHAT, this tells you WHY
   * ("we visit each element at most once and do O(1) work per visit").
   */
  complexityReasoning?: string;
  /**
   * @deprecated Pre-dryRun field, kept so old content keeps rendering.
   * Use `dryRun` (structured) for new authoring.
   */
  walkthrough?: string;
  /**
   * Approach-specific traps. Different from the problem-level
   * `commonMistakes` (which are generic). E.g. for the brute-force pair
   * scan: "starting j at 0 instead of i+1". Keep to 2-4 items.
   */
  pitfalls?: string[];
  /**
   * Edge cases that test this approach's boundaries. Each entry pairs an
   * input with a sentence on what the approach does on that input. Used
   * to build candidate confidence and to satisfy interviewer probes like
   * "what about duplicates?" or "what if the array is empty?".
   */
  edgeCases?: DSAApproachEdgeCase[];
  /**
   * Approach-specific diagrams — typically a hashmap-state or
   * array-state visual that mirrors `dryRun` so the trace becomes
   * pictorial as well as tabular. Renders between the insight and the
   * dry-run table on the page.
   */
  diagrams?: DSADiagram[];
  /**
   * Full source per language. Java and Python are required for any
   * authored content; `javascript` is optional and ignored on the public
   * problem page (filtered by `CodeLanguageTabs` when a DSA provider is
   * mounted).
   */
  code: { java: string; python: string; javascript?: string };
  /**
   * Line-by-line annotations. Same key set as `code`. Strongly recommended
   * for new content — this is the headline differentiator on the hub page.
   */
  lineByLine?: Partial<Record<DSACodeLang, DSALineAnnotation[]>>;
}

/**
 * Study-revision block — "things to remember" / "concepts to memorize"
 * for a problem. Replaces the earlier `speakableAnswer` zone: the goal
 * is to teach the reader what to *internalize* about this problem so
 * that when a variant shows up in an interview they can pattern-match
 * immediately, rather than handing them a script to rehearse.
 *
 * Each field is intentionally small and bulleted — this block is read
 * as flash cards, not prose. Renders high on the page, right after the
 * direct answer and before the full problem-solving section.
 */
export interface DSARevision {
  /**
   * Pattern name + one-sentence classifier. This is the *label* the
   * reader should attach to the problem in their head — "Complement
   * lookup via hash map", not "Two Sum".
   */
  pattern: string;
  /**
   * Optional one-line "algorithm formula" — the pseudocode skeleton the
   * reader should be able to write from memory. Rendered as a mono
   * block. E.g. `for x in nums: if (target-x) in seen: return; seen[x]=i`.
   */
  formula?: string;
  /**
   * 3–5 short imperatives — the rules to internalize. Written as
   * commands ("Check complement BEFORE inserting", not "one must
   * check…"). Rendered as a numbered / highlighted list.
   */
  rules: string[];
  /**
   * Pattern-recognition cues that tell the reader to reach for this
   * technique. Written as short noun phrases ("unsorted array + pair
   * sum", "need indices not values").
   */
  whenToUse?: string[];
  /**
   * Anti-signals — shapes that *look* like this pattern but call for a
   * different technique. Keeps the pattern from being over-applied.
   */
  antiSignals?: string[];
  /**
   * Optional short free-form note — the conceptual "aha" the reader
   * should walk away with. 1–2 sentences, prose allowed (italic-ish
   * style). Think of it as the wisdom line at the bottom of a flash
   * card.
   */
  takeaway?: string;
}

/**
 * The JBI track has `interviewer_intent: { testing, common_mistake,
 * to_stand_out }`. We mirror it for DSA so the problem page can render
 * the same "what the interviewer is signalling" triad. Field naming uses
 * camelCase to match the rest of the DSA schema (snake_case is JBI-only).
 */
export interface DSAInterviewerIntent {
  /** What the interviewer is actually probing. */
  testing: string;
  /** The 1-2 things that separate weak from strong candidates. */
  commonMistake: string;
  /** What an above-bar candidate adds that the rubric doesn't ask for. */
  toStandOut: string;
}

/**
 * Mistake explainer with optional bad → good code snippets. Replaces
 * the bare-string `commonMistakes` for problems where a code diff is
 * more illustrative than prose. Both shapes are supported on the same
 * problem (`commonMistakes` for one-liners, `commonMistakesDetailed`
 * for the full bad/good treatment).
 */
export interface DSAMistakeDetailed {
  title: string;
  /** 1-2 sentences on why the mistake is wrong / what it costs. */
  why: string;
  /** Optional broken snippet. Pair with `good` for a diff-style render. */
  bad?: string;
  /** Optional fixed snippet. Pair with `bad`. */
  good?: string;
  /** Hint to the syntax highlighter. Defaults to `java`. */
  lang?: "java" | "python";
}

export interface DSAProblem {
  id: string;
  slug: string;
  title: string;
  leetcodeNumber?: number;
  /**
   * LeetCode URL slug. Defaults to the problem's own `slug` when omitted,
   * which is correct for every problem where our naming matches LC
   * (Two Sum → two-sum, Valid Anagram → valid-anagram, etc.). Override
   * here when our slug diverges from LC's.
   */
  leetcodeSlug?: string;
  difficulty: Difficulty;
  category: string;
  patterns: string[];
  /**
   * Company tags for the per-problem JSON. Must mirror the `company_tags`
   * field on the matching `DSAProblemIndex` entry — both names exist for
   * historical reasons. Keep them in sync via the content build.
   */
  companies: string[];
  /** How often this problem shows up in real interviews. */
  frequency?: DSAFrequency;
  /**
   * 2-3 sentence punchline. Mirrors JBI's `direct_answer`. This is what
   * the candidate would say in the first 30 seconds; renders in a top-of-
   * page card above the problem statement so the reader gets the answer
   * immediately. Optional for backwards compatibility but strongly
   * recommended for any new problem.
   */
  directAnswer?: string;
  /**
   * 3-5 single-sentence takeaways that live right under the direct answer
   * in the "Key points" card (Zone 1 in the JBI-style 3-zone page).
   * Think of them as the bulletised TL;DR — things a reader should
   * remember even if they skim everything else. Keep each under ~120
   * chars so the list stays scannable.
   */
  keyPoints?: string[];
  /**
   * @deprecated The "Interview Answer" speakable narrative zone was
   * removed because it duplicated the per-approach plans and felt like
   * a script. The revision block (`remember`) replaced it on the page.
   * Field kept as optional so legacy problems keep parsing; new content
   * should leave it unset.
   */
  speakableAnswer?: string;
  /**
   * "Things to remember" — the study-revision block that sits between
   * the 30-second answer and the detailed problem-solving section.
   * Teaches the pattern the reader should internalize rather than
   * handing them a script. Highly recommended for every problem.
   */
  remember?: DSARevision;
  /**
   * What the interviewer is testing, what trips most candidates, and what
   * separates the top tier. Renders as a 3-cell card under the hero.
   */
  interviewerIntent?: DSAInterviewerIntent;
  /**
   * 250-400 word teaching framing block. Answers: who asks this, why, what
   * pattern it teaches, and which other problems it unlocks. Renders in a
   * collapsible card between the hero and the problem statement.
   */
  whyThisProblem?: string;
  /**
   * Plain-English restatement of the problem ("In your own words, what is
   * the interviewer asking?"). This is the FIRST thing a strong candidate
   * does in a DSA round before writing any code. Distinct from
   * `problemStatement`, which is the literal LeetCode-style spec.
   */
  understanding?: string;
  /**
   * Questions a candidate would (and should) ask the interviewer before
   * coding — and the answers they would typically get. Renders as a
   * Q&A list. 3-6 items is the sweet spot.
   */
  clarifyingQuestions?: { question: string; answer: string }[];
  /**
   * 1-paragraph "brainstorm" moment — name every approach you'd
   * consider, with a one-line "why/why-not", BEFORE diving into the
   * detailed approaches[] blocks. Mirrors the verbal moment in the
   * interview where the candidate enumerates options out loud. If
   * omitted, the page falls back to `howToThink`.
   */
  approachesOverview?: string;
  /**
   * Problem-level diagrams. Use for things that span all approaches:
   * decision trees ("if sorted → two pointers, else → hash map"),
   * pattern-recognition flowcharts, or input-shape visualisations.
   * Renders on the page right after the brainstorm section.
   */
  diagrams?: DSADiagram[];
  /** JBI-parity freshness signal — minutes the page should take to read. */
  readingTimeMinutes?: number;
  /** ISO date (YYYY-MM-DD) the content was last meaningfully edited. */
  lastUpdated?: string;
  problemStatement: string;
  constraints: string[];
  examples: { input: string; output: string; explanation: string }[];
  /**
   * Legacy "How to brainstorm" paragraph. The current problem page no
   * longer renders this section (the comparison table covers the same
   * ground more compactly), but older problems still ship it. Optional
   * so new content can omit it without padding.
   */
  howToThink?: string;
  approaches: DSAApproach[];
  /**
   * Legacy "interview script" paragraph. Removed from the rendered page
   * (it duplicated the per-approach plans). Optional for backwards
   * compatibility with older content; new problems should omit it.
   */
  interviewVoice?: string;
  /**
   * Generic, problem-level mistakes. Use one-liners. For mistakes where
   * a bad → good code snippet teaches better than prose, use
   * `commonMistakesDetailed` instead (or in addition).
   */
  commonMistakes: string[];
  /**
   * Detailed mistake explainers with optional bad/good code diffs. Renders
   * as expandable cards under the same "Common mistakes" section.
   */
  commonMistakesDetailed?: DSAMistakeDetailed[];
  followupVariations: {
    leetcodeNumber?: number;
    title: string;
    slug: string;
    hint: string;
  }[];
  /**
   * One-sentence note on which interview pattern this problem belongs to.
   * Rendered as a small footer on the "How to think" card — folded in to
   * keep the long page from sprawling into a sixth coloured section.
   */
  patternNote: string;
  seo: V2QuestionSEO;
}

/**
 * Basic 100 — a fresher-focused track of 100 very-easy DSA coding problems
 * (reverse a string, find the max, FizzBuzz, …). Unlike `DSASheet`, the
 * Basic 100 catalog is self-contained: it does NOT reference the main
 * `_index.json` problems[]. Its problem JSON files live in
 * `content/dsa/basics/<slug>.json` and render on the standard
 * `/dsa/problem/<slug>` page via a resolver fallback. The catalog itself
 * lives at `content/dsa/basic-100/index.json` and drives the `/dsa/basic-100`
 * hub.
 */
export interface Basic100Problem {
  /** Kebab-case slug; file lives at content/dsa/basics/<slug>.json. */
  slug: string;
  /** Display title shown in the hub list. */
  title: string;
  /** One-line description of what the problem asks. */
  oneLiner: string;
  /** Signature pattern/topic tag shown as a chip. */
  pattern?: string;
}

export interface Basic100Group {
  /** Kebab-case id for the group (used as an anchor). */
  groupSlug: string;
  /** Human-readable group title — "Numbers & Math". */
  title: string;
  /** Short blurb describing the group. */
  blurb?: string;
  /** Problems in intended practice order. */
  problems: Basic100Problem[];
}

export interface Basic100Catalog {
  /** Headline title for the hub. */
  title: string;
  /** One-line positioning statement. */
  tagline: string;
  /** 1–3 paragraph intro (paragraphs separated by \n\n). */
  description: string;
  /** Total problems — derived, stored for SEO/headers. */
  totalProblems: number;
  /** Ordered topic groups. */
  groups: Basic100Group[];
  /** Optional study-plan bullets shown on the hub. */
  howToUse?: string[];
  seo?: {
    title?: string;
    description?: string;
  };
}

// ─── Compare / Topics / Companies ────────────────────────────────────────────

export interface CompareEntry {
  slug: string;
  title: string;
  items: [string, string];
  content: string;
  seo: V2QuestionSEO;
}

export interface TopicEntry {
  slug: string;
  title: string;
  description: string;
  relatedStacks: string[];
  seo: V2QuestionSEO;
}

// ─── Resolved types (after $ref resolution) ──────────────────────────────────

export interface ResolvedQuestion extends V2QuestionEntry {
  /** Source path for debugging/cache keying */
  _sourceFile?: string;
  /** Whether this was resolved from a $ref */
  _fromRef?: boolean;
}

export interface ResolvedStackContent {
  meta: V2ContentMeta;
  questions: ResolvedQuestion[];
}
