/**
 * Visual story page — Phase 1.7.
 *
 * Dev-only page (no nav entry, no public link) that exercises every
 * Phase 1.2 primitive with hardcoded sample data. The page is the
 * Phase 1 visual exit gate for docs/speakable/visual-style-guide.md.
 *
 * Sections:
 *   1. Theme + breakpoint controls (light / dark, desktop / mobile)
 *   2. Each primitive in isolation with sample data covering its typical use
 *   3. (Extended in Phase 1.3) — archetype layouts composed from the primitives
 *
 * Accessible only at /dev/speakable-primitives. Not linked from the
 * public site. Local development only.
 */

"use client";

import { useState, type ReactNode } from "react";
import "@/components/speakable/speakable.css";
import {
  BeatBullets,
  BeatCallout,
  BeatGroupedParagraphs,
  BeatMiniTable,
  BeatOrderedList,
  BeatParagraph,
  BeatParagraphs,
} from "@/components/speakable/primitives";
import {
  Behavioral,
  Comparison,
  Conceptual,
  Design,
  Internals,
  Scenario,
  SystemDesign,
} from "@/components/speakable/layouts";
import type {
  SpeakableA,
  SpeakableB,
  SpeakableC,
  SpeakableD,
  SpeakableE,
  SpeakableF,
  SpeakableG,
} from "@/lib/speakable/schema";

type Theme = "light" | "dark";

function ThemeShell({
  theme,
  mobile,
  children,
}: {
  theme: Theme;
  mobile: boolean;
  children: ReactNode;
}) {
  const wrapperWidth = mobile ? "max-w-[360px]" : "max-w-[720px]";
  const surfaceBg = theme === "dark" ? "#101113" : "#ffffff";
  return (
    <section
      className="speakable-prose mx-auto px-6 py-8 rounded-lg shadow-sm"
      data-theme={theme}
      style={{
        background: surfaceBg,
        width: "100%",
      }}
    >
      <div className={`mx-auto ${wrapperWidth}`}>{children}</div>
    </section>
  );
}

function Story({
  title,
  description,
  children,
}: {
  title: string;
  description: string;
  children: ReactNode;
}) {
  return (
    <article className="mb-10">
      <h2 className="text-[18px] font-semibold tracking-tight text-slate-900 dark:text-slate-100 mb-1">
        {title}
      </h2>
      <p className="text-[13.5px] text-slate-500 dark:text-slate-400 mb-4 max-w-prose">
        {description}
      </p>
      <div className="border border-slate-200/70 dark:border-slate-800 rounded-lg overflow-hidden">
        {children}
      </div>
    </article>
  );
}

const sampleParagraph = {
  layout: "paragraph" as const,
  text: "An object is data plus the methods that work on that data. The class is the blueprint; the object is one real example of it.",
};

const sampleParagraphs = {
  layout: "paragraphs" as const,
  paragraphs: [
    "Threads share memory with their parent process — that's why they're cheap to start but expensive to coordinate.",
    "The lifecycle is New → Runnable → Running → Blocked / Waiting → Terminated. Anything you do to a thread eventually maps onto a transition between two of these states.",
  ],
  label: "Mental model",
};

const sampleGrouped = {
  layout: "grouped_paragraphs" as const,
  label: "The four pillars",
  groups: [
    {
      heading: "Encapsulation",
      text: "The class controls its own state. Fields stay private; callers change them through methods like withdraw(), not setBalance().",
    },
    {
      heading: "Inheritance",
      text: "The IS-A relationship. Dog extends Animal. Java only allows one parent because of the diamond problem; for multiple, use interfaces.",
    },
    {
      heading: "Polymorphism",
      text: "Same call, different behaviour by object. Shape s = new Circle(); s.area() runs Circle's version because the JVM looks at the actual object at runtime.",
    },
    {
      heading: "Abstraction",
      text: "Depend on the contract, not the implementation. List l = new ArrayList<>() lets you swap to LinkedList tomorrow without changing any caller.",
    },
  ],
};

const sampleBullets = {
  layout: "bullets" as const,
  items: [
    "Don't confuse abstraction (a design idea) with the abstract keyword (a Java mechanism).",
    "A private field plus setBalance() is not encapsulation — it's a public field wearing a coat.",
    "Deep hierarchies are a smell — prefer flat plus composition.",
  ],
};

const sampleOrdered = {
  layout: "ordered_list" as const,
  steps: [
    "Pull a thread dump with jstack and look for BLOCKED states.",
    "If the dump is clean, switch to async-profiler for a CPU flame graph.",
    "Cross-reference the latency histogram from Micrometer — averages will hide the tail.",
    "If GC dominates the flame graph, check the GC log for pause-time outliers.",
  ],
};

const sampleMiniTable = {
  layout: "mini_table" as const,
  columns: ["ArrayList", "LinkedList"],
  rows: [
    {
      axis: "Memory layout",
      values: [
        "Single contiguous array under the hood.",
        "Doubly-linked nodes scattered across the heap.",
      ],
    },
    {
      axis: "Random access",
      values: ["O(1) by index.", "O(n) — must walk from head or tail."],
    },
    {
      axis: "Insert middle",
      values: ["O(n) — shift elements.", "O(1) once you have the node."],
    },
    {
      axis: "Cache locality",
      values: ["Excellent — prefetcher loves arrays.", "Poor — pointer chase per node."],
    },
  ],
};

const sampleCallout = {
  layout: "callout" as const,
  label: "Where this breaks under load",
  text: "Two threads resizing concurrently in pre-Java-8 HashMap caused infinite loops in production — the same trap the Cliff Click Atomic HashMap was designed to avoid.",
};

export default function SpeakablePrimitivesPage() {
  const [theme, setTheme] = useState<Theme>("light");
  const [mobile, setMobile] = useState(false);

  return (
    <main className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 px-4 sm:px-8 py-8">
      <header className="max-w-4xl mx-auto mb-10">
        <p className="text-[11px] uppercase tracking-[0.18em] text-slate-500 mb-2">
          /dev/speakable-primitives
        </p>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight mb-2">
          Speakable visual story page
        </h1>
        <p className="text-[14px] text-slate-600 dark:text-slate-400 max-w-prose">
          Phase 1 visual exit gate for the 7 layout primitives. Toggle theme +
          mobile breakpoint to verify each primitive in all rendering modes per
          docs/speakable/visual-style-guide.md §6 + §7. Phase 1.3 will extend
          this page with archetype-layout sections.
        </p>
        <div className="mt-4 flex items-center gap-3 text-[13px]">
          <button
            type="button"
            onClick={() => setTheme((t) => (t === "light" ? "dark" : "light"))}
            className="px-3 py-1.5 rounded-md border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            Theme: <strong>{theme}</strong>
          </button>
          <button
            type="button"
            onClick={() => setMobile((m) => !m)}
            className="px-3 py-1.5 rounded-md border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            Width: <strong>{mobile ? "mobile (~360px)" : "desktop (~720px)"}</strong>
          </button>
        </div>
      </header>

      <div className="max-w-4xl mx-auto">
        <h2 className="text-[20px] font-semibold tracking-tight mb-4">
          Primitives in isolation
        </h2>
        <Story
          title="BeatParagraph"
          description="Single short body paragraph. Default choice for any beat that fits in one paragraph (≤ 60 words)."
        >
          <ThemeShell theme={theme} mobile={mobile}>
            <BeatParagraph data={sampleParagraph} />
          </ThemeShell>
        </Story>

        <Story
          title="BeatParagraphs"
          description="2–4 paragraphs in a comfortable rhythm. Used when one beat genuinely contains a few connected thoughts."
        >
          <ThemeShell theme={theme} mobile={mobile}>
            <BeatParagraphs data={sampleParagraphs} />
          </ThemeShell>
        </Story>

        <Story
          title="BeatGroupedParagraphs"
          description="Sub-headings + paragraphs. Used by archetype A's parts_or_states beat with the four pillars."
        >
          <ThemeShell theme={theme} mobile={mobile}>
            <BeatGroupedParagraphs data={sampleGrouped} />
          </ThemeShell>
        </Story>

        <Story
          title="BeatBullets"
          description="Clean bulleted list (3+ short, parallel items). Used for archetype A's pitfalls and archetype D's tools."
        >
          <ThemeShell theme={theme} mobile={mobile}>
            <BeatBullets data={sampleBullets} />
          </ThemeShell>
        </Story>

        <Story
          title="BeatOrderedList"
          description="Numbered list. Mandatory for archetype D's step_by_step. The faint left rail (withRail) is added only for archetype D."
        >
          <ThemeShell theme={theme} mobile={mobile}>
            <BeatOrderedList data={sampleOrdered} withRail />
          </ThemeShell>
        </Story>

        <Story
          title="BeatMiniTable"
          description="Compact 2- or 3-column comparison. Mandatory for archetype B's differences with 3+ axes. Mobile (< 640 px) collapses to stacked cards — toggle width to verify."
        >
          <ThemeShell theme={theme} mobile={mobile}>
            <BeatMiniTable data={sampleMiniTable} />
          </ThemeShell>
        </Story>

        <Story
          title="BeatCallout"
          description="Distinct background + 3px left rail. Reserved for the depth-marker beat (lint 7.5.8 — at most one per Speakable)."
        >
          <ThemeShell theme={theme} mobile={mobile}>
            <BeatCallout data={sampleCallout} />
          </ThemeShell>
        </Story>

        <h2 className="text-[20px] font-semibold tracking-tight mt-12 mb-4">
          Archetype layouts
        </h2>
        <p className="text-[13.5px] text-slate-500 dark:text-slate-400 mb-6 max-w-prose">
          Each layout composes the primitives with the per-archetype tweaks
          described in Phase 1 prompt §11.3 (D's left rail, E's options grid,
          F's phase blocks, G's STAR ribbons).
        </p>

        <Story
          title="A — Conceptual (OOP four pillars)"
          description="Standard composition: hook → definition → why_exists → parts_or_states (grouped) → how_to_use → example → pitfalls (bullets) → cap."
        >
          <ThemeShell theme={theme} mobile={mobile}>
            <Conceptual data={archetypeAFixture} />
          </ThemeShell>
        </Story>

        <Story
          title="B — Comparison (ArrayList vs LinkedList)"
          description="Differences renders as mini_table per lint 7.5.3. Mobile collapses table to stacked cards."
        >
          <ThemeShell theme={theme} mobile={mobile}>
            <Comparison data={archetypeBFixture} />
          </ThemeShell>
        </Story>

        <Story
          title="C — Internals (HashMap)"
          description="Failure-mode beat uses callout for depth-marker emphasis (lint 7.5.8 caps at one per Speakable)."
        >
          <ThemeShell theme={theme} mobile={mobile}>
            <Internals data={archetypeCFixture} />
          </ThemeShell>
        </Story>

        <Story
          title="D — Scenario (latency spike triage)"
          description="step_by_step gets the faint left rail (Phase 1.3 D-tweak). Tools beat enumerates concrete diagnostics."
        >
          <ThemeShell theme={theme} mobile={mobile}>
            <Scenario data={archetypeDFixture} />
          </ThemeShell>
        </Story>

        <Story
          title="E — Design (interface vs abstract class)"
          description="options renders side-by-side as cards on desktop, stacks on mobile. rethink_if uses callout."
        >
          <ThemeShell theme={theme} mobile={mobile}>
            <Design data={archetypeEFixture} />
          </ThemeShell>
        </Story>

        <Story
          title="F — System Design (URL shortener)"
          description="Phases render with clear section breaks; each labeled (Requirements / Capacity / API / ...). Capacity beat carries the depth-marker numeric."
        >
          <ThemeShell theme={theme} mobile={mobile}>
            <SystemDesign data={archetypeFFixture} />
          </ThemeShell>
        </Story>

        <Story
          title="G — Behavioural (late project STAR)"
          description="STAR ribbons (S/T/A/R) above each beat; Reflection gets a distinct outlined ribbon."
        >
          <ThemeShell theme={theme} mobile={mobile}>
            <Behavioral data={archetypeGFixture} />
          </ThemeShell>
        </Story>
      </div>
    </main>
  );
}

const archetypeAFixture: SpeakableA = {
  archetype: "A",
  pillar: "P01",
  audience_assumption: "beginner",
  voice: "friendly",
  familiarity_anchors: ["data plus the methods", "blueprint vs instance"],
  standard_example: "Dog extends Animal",
  hook: "OOP is just a way of writing code around objects.",
  cap: "OOP isn't four rules to memorise — they reinforce each other.",
  followup_handoff: [
    "What's the difference between compile-time and runtime polymorphism?",
    "When would you use composition over inheritance?",
  ],
  speakable_status: "approved",
  beats: [
    { kind: "definition", ...sampleParagraph },
    {
      kind: "why_exists",
      layout: "paragraph",
      text: "Without it, data sits in one place and the code touching that data scatters everywhere.",
    },
    { kind: "parts_or_states", ...sampleGrouped },
    {
      kind: "how_to_use",
      layout: "paragraph",
      text: "Reach for OOP when the system has nouns that own behaviour. If everything is just functions over data, a procedural style is often cleaner.",
    },
    {
      kind: "example",
      layout: "paragraph",
      text: "List<String> names = new ArrayList<>() uses all four at once. List is the abstraction.",
    },
    { kind: "pitfalls", ...sampleBullets },
  ],
};

const archetypeBFixture: SpeakableB = {
  archetype: "B",
  pillar: "P01",
  audience_assumption: "beginner",
  voice: "friendly",
  familiarity_anchors: ["array under the hood", "doubly-linked nodes", "cache locality"],
  standard_example: "List<Integer> = new ArrayList<>() vs new LinkedList<>()",
  hook: "ArrayList is a contiguous array; LinkedList is a chain of nodes.",
  cap: "On real hardware, ArrayList wins almost everything — the cache hides Big-O.",
  followup_handoff: [
    "When does LinkedList actually win in practice?",
    "What does Vector add over ArrayList?",
  ],
  speakable_status: "approved",
  beats: [
    {
      kind: "what_each_is",
      layout: "paragraph",
      text: "ArrayList is backed by a single array that grows by reallocation. LinkedList is a doubly-linked chain of node objects.",
    },
    { kind: "differences", ...sampleMiniTable },
    {
      kind: "when_to_pick",
      layout: "paragraph",
      text: "Pick ArrayList by default. Pick LinkedList only when middle inserts dominate and you already hold the node — almost never in real code.",
    },
    {
      kind: "tiny_example",
      layout: "paragraph",
      text: "List<Integer> hot = new ArrayList<>(); — write this everywhere unless you have a measured reason to differ.",
    },
  ],
};

const archetypeCFixture: SpeakableC = {
  archetype: "C",
  pillar: "P01",
  audience_assumption: "familiar",
  voice: "technical",
  familiarity_anchors: ["bucket", "collision", "tree at threshold 8"],
  standard_example: 'map.put("key", value)',
  hook: "A HashMap is an array of buckets with a hash-and-mod indexing scheme.",
  cap: "Most HashMap pathologies trace back to a hash that distributes badly.",
  followup_handoff: [
    "What changed in Java 8's HashMap?",
    "How does ConcurrentHashMap differ?",
  ],
  speakable_status: "approved",
  beats: [
    {
      kind: "mental_model",
      layout: "paragraph",
      text: "Think of buckets, not slots. Each bucket can hold many entries; the bucket index is hash mod table-length.",
    },
    {
      kind: "mechanism",
      layout: "ordered_list",
      steps: [
        "Hash the key, then mod by table length to find the bucket.",
        "Walk the bucket's chain comparing keys with equals().",
        "If found, replace the value; otherwise append a new entry.",
        "Past chain length 8 and table size 64, the chain converts to a balanced tree.",
      ],
    },
    {
      kind: "edge_cases",
      layout: "bullets",
      items: [
        "Mutating a key after insert silently breaks lookups.",
        "Null keys are allowed but live in bucket 0 only.",
        "Iteration order is unspecified — use LinkedHashMap if you need it.",
      ],
    },
    { kind: "failure_mode", ...sampleCallout },
  ],
};

const archetypeDFixture: SpeakableD = {
  archetype: "D",
  pillar: "P11",
  audience_assumption: "familiar",
  voice: "neutral",
  familiarity_anchors: ["jstack", "async-profiler", "histogram"],
  standard_example: "p99 latency spike at 14:30",
  hook: "I'd start by separating CPU-bound from blocking — that decides the toolchain.",
  cap: "The fix usually shows up the moment the right diagnostic confirms the hypothesis.",
  followup_handoff: [
    "What if jstack is clean but the histogram still spikes?",
    "How would you debug the same in a containerised JVM?",
  ],
  speakable_status: "approved",
  beats: [
    {
      kind: "clarify",
      layout: "paragraph",
      text: "Confirm the symptom — p50 or p99, persistent or bursty, single-host or fleet-wide?",
    },
    {
      kind: "hypothesis",
      layout: "paragraph",
      text: "If it's p99-only and bursty, it's almost always GC pauses or coordinated lock contention — both blocking, neither CPU.",
    },
    { kind: "step_by_step", ...sampleOrdered },
    {
      kind: "tools",
      layout: "bullets",
      items: [
        "jstack for thread dumps to spot BLOCKED states.",
        "async-profiler for CPU and allocation flame graphs.",
        "Micrometer histograms for the tail, never the average.",
        "GC logs filtered for pause-time outliers.",
      ],
    },
    {
      kind: "tradeoff",
      layout: "paragraph",
      text: "async-profiler costs ~1% CPU when running and won't show pure I/O. For deep blocking, you still need the thread dump.",
    },
  ],
};

const archetypeEFixture: SpeakableE = {
  archetype: "E",
  pillar: "P05",
  audience_assumption: "familiar",
  voice: "technical",
  familiarity_anchors: ["interface", "abstract class", "default method"],
  standard_example: "Shape (abstract draw()) vs Drawable (interface)",
  hook: "I default to interfaces — they keep the door open for multiple inheritance.",
  cap: "If two siblings ever need to mix in behaviour from elsewhere, the abstract class blocks you.",
  followup_handoff: [
    "What changed once Java 8 added default methods?",
    "Is sealed an alternative to abstract here?",
  ],
  speakable_status: "approved",
  beats: [
    {
      kind: "optimising_for",
      layout: "paragraph",
      text: "I'm optimising for future flexibility — adding a sibling without touching the parent.",
    },
    {
      kind: "options",
      layout: "grouped_paragraphs",
      groups: [
        {
          heading: "Abstract class",
          text: "Single base, can hold state and concrete methods. Costs you the inheritance slot — only one parent allowed.",
        },
        {
          heading: "Interface (with default methods)",
          text: "Multiple-inherit-able contract, can carry default behaviour since Java 8, can't hold instance state.",
        },
      ],
    },
    {
      kind: "tradeoffs",
      layout: "paragraph",
      text: "Abstract class wins when shared state forces it; interface wins when the contract matters most.",
    },
    {
      kind: "decision",
      layout: "paragraph",
      text: "Default to interface. Reach for abstract class only when shared state forces it.",
    },
    {
      kind: "rethink_if",
      ...sampleCallout,
    },
  ],
};

const archetypeFFixture: SpeakableF = {
  archetype: "F",
  pillar: "P06",
  audience_assumption: "familiar",
  voice: "technical",
  familiarity_anchors: ["base62", "rate limit"],
  standard_example: "URL shortener at 10M/day",
  hook: "Treat it as a write-light, read-heavy key-value store with a lifetime gate.",
  cap: "The whole shape is one wide cache in front of one durable map — the rest is operational.",
  followup_handoff: [
    "How do you guarantee uniqueness without a central counter?",
    "What changes if you need analytics per click?",
  ],
  speakable_status: "approved",
  beats: [
    {
      kind: "requirements_fr_nfr",
      layout: "grouped_paragraphs",
      groups: [
        { heading: "Functional", text: "Shorten a URL, redirect by short code, expire on TTL." },
        {
          heading: "Non-functional",
          text: "p99 redirect under 50 ms, 10M shortens / day, 500M redirects / day, 99.95% availability.",
        },
      ],
    },
    {
      kind: "capacity",
      layout: "paragraph",
      text: "10M URLs/day means ~115 writes/sec average, ~5x peak so ~600 writes/sec; ~50 reads per write so ~30K reads/sec. ~1.8 GB/day raw.",
    },
    {
      kind: "api",
      layout: "bullets",
      items: [
        "POST /shorten — body { long_url, ttl_days } → { short_code }",
        "GET /:code — 302 redirect to long_url",
        "DELETE /:code — owner only",
      ],
    },
    {
      kind: "data_model",
      layout: "paragraph",
      text: "links table: short_code (PK, base62 of monotonic ID), long_url, owner_id, expires_at. Hot reads served from a Redis hash.",
    },
    {
      kind: "high_level",
      layout: "ordered_list",
      steps: [
        "Edge accepts the redirect, hits Redis on the short_code key.",
        "Cache hit → 302 in < 5 ms.",
        "Cache miss → Postgres lookup, populate Redis with the row's TTL.",
        "Write path goes Postgres-first, then async-evicts Redis.",
      ],
    },
    {
      kind: "bottleneck_deep_dive",
      layout: "callout",
      label: "Redis hot keys at peak",
      text: "Top 1% of short codes carry ~40% of traffic. Above 30K rps a single hot key becomes the bottleneck — partition by hashring on the code prefix and add a 100 ms in-process LRU on the edge.",
    },
    {
      kind: "tradeoffs",
      layout: "paragraph",
      text: "Going eventually-consistent on write→read saves a round-trip but means a freshly-shortened URL might 404 for ~100 ms. Acceptable for the consumer flow, not for the dashboard.",
    },
  ],
};

const archetypeGFixture: SpeakableG = {
  archetype: "G",
  pillar: "P12",
  audience_assumption: "beginner",
  voice: "friendly",
  familiarity_anchors: ["escalation", "rollback plan", "P0"],
  standard_example: "Late-running migration project",
  hook: "We were two weeks into a one-week migration when the trend made itself obvious.",
  cap: "Now I escalate the moment I see the trend, not when the trend is unrecoverable.",
  followup_handoff: [
    "What signal gave you the trend?",
    "How did the team take the late escalation?",
  ],
  speakable_status: "approved",
  beats: [
    {
      kind: "situation",
      layout: "paragraph",
      text: "Mid-2024, a payments team was rewriting the settlement worker from a single cron into a queue-driven service before the holiday freeze.",
    },
    {
      kind: "task",
      layout: "paragraph",
      text: "I was tech lead. The deadline was hard — the freeze meant the rewrite had to land or wait three months.",
    },
    {
      kind: "action",
      layout: "paragraph",
      text: "I held the schedule for two days hoping a bottleneck would unblock. When it didn't, I escalated to the director, cut scope to settlement-only, moved reconciliation to phase two.",
    },
    {
      kind: "result",
      layout: "paragraph",
      text: "We shipped settlement before freeze with a one-week slip. Reconciliation followed in February with a calmer review cycle.",
    },
    { kind: "reflection", ...sampleCallout },
  ],
};
