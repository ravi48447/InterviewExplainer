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

        <h2 className="text-[20px] font-semibold tracking-tight mt-12 mb-4">
          Phase 2 — golden references
        </h2>
        <p className="text-[13.5px] text-slate-500 dark:text-slate-400 mb-6 max-w-prose">
          The 7 hand-crafted Speakable v2s that Phase 3 agents imitate.
          Each scores 100/100 on the lint and is the only{" "}
          <code>speakable_status: approved</code> content in the corpus
          until Phase 3 review. Source files live next to the legacy{" "}
          <code>speakable_answer</code> in each question&apos;s{" "}
          <code>complete-qa.json</code>.
        </p>

        <Story
          title="G1 — A Conceptual / java-thread-lifecycle-states"
          description="Anchors the lifecycle (NEW → RUNNABLE → BLOCKED/WAITING/TIMED_WAITING → TERMINATED) and resolves the runtime/spec gap. PASS 100/100."
        >
          <ThemeShell theme={theme} mobile={mobile}>
            <Conceptual data={goldenG1} />
          </ThemeShell>
        </Story>

        <Story
          title="G2 — B Comparison / difference-between-equals-and-double-equals-java"
          description="Mini-table with 4 axes; tiny_example carries the String pool gotcha. PASS 100/100."
        >
          <ThemeShell theme={theme} mobile={mobile}>
            <Comparison data={goldenG2} />
          </ThemeShell>
        </Story>

        <Story
          title="G3 — C Internals / hashmap-collision-handling"
          description="Mental_model → mechanism (5 ordered steps for put/get/resize/treeify/untreeify) → edge_cases → failure_mode callout (the resize storm). PASS 100/100."
        >
          <ThemeShell theme={theme} mobile={mobile}>
            <Internals data={goldenG3} />
          </ThemeShell>
        </Story>

        <Story
          title="G4 — D Scenario / cpu-spikes-java-applications-debugging"
          description="step_by_step gets the rail; tools beat names jstack + async-profiler + jstat + Micrometer (5+ codex tool hits). PASS 100/100."
        >
          <ThemeShell theme={theme} mobile={mobile}>
            <Scenario data={goldenG4} />
          </ThemeShell>
        </Story>

        <Story
          title="G5 — E Design / abstract-class-vs-interface-java-when-to-use"
          description="optimising_for opens with the codex anchor; rethink_if callout carries the multiple-inheritance trigger. PASS 100/100."
        >
          <ThemeShell theme={theme} mobile={mobile}>
            <Design data={goldenG5} />
          </ThemeShell>
        </Story>

        <Story
          title="G6 — F System Design / design-url-shortener"
          description="Capacity (10 M URLs/day → 30 K reads/sec → 1.8 GB/day → 650 GB/year) and bottleneck callout (95% cache hit, 1500 reads/sec residual) carry the depth-marker numbers. PASS 100/100."
        >
          <ThemeShell theme={theme} mobile={mobile}>
            <SystemDesign data={goldenG6} />
          </ThemeShell>
        </Story>

        <Story
          title="G7 — G Behavioural / handle-technical-disagreements"
          description="STAR with the reflection callout carrying 'Looking back, I'd have…' — the depth marker for G. PASS 100/100."
        >
          <ThemeShell theme={theme} mobile={mobile}>
            <Behavioral data={goldenG7} />
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

// ---------------------------------------------------------------------
// Phase 2 — golden references (the 7 hand-crafted v2s, lint 100/100).
// Source of truth is each question's complete-qa.json; these constants
// are kept in lockstep with the JSON so the dev story page renders
// exactly what production will render once status is `approved`.
// ---------------------------------------------------------------------

const goldenG1: SpeakableA = {
  archetype: "A",
  pillar: "P01",
  audience_assumption: "beginner",
  voice: "friendly",
  speakable_status: "approved",
  familiarity_anchors: [
    "thread lifecycle is a state machine",
    "JVM states vs OS states",
    "blocked vs waiting vs timed_waiting",
  ],
  standard_example: "Thread.State enum walked NEW → RUNNABLE → TERMINATED",
  hook: "A Java thread is always in exactly one of six lifecycle states, and the state tells you why it isn't running.",
  cap: "Six states, one thread, one reason it isn't moving.",
  followup_handoff: [
    "What's the difference between BLOCKED and WAITING in practice?",
    "How does the JVM's RUNNABLE state map to actually-on-CPU?",
    "What enters TIMED_WAITING that wouldn't enter WAITING?",
    "How do you read these states from a thread dump?",
  ],
  beats: [
    {
      kind: "definition",
      layout: "paragraph",
      text: "The thread lifecycle is a state machine the JVM tracks for every Thread. The six states live on Thread.State — NEW, RUNNABLE, BLOCKED, WAITING, TIMED_WAITING, TERMINATED. They describe what the JVM thinks the thread is doing, not what the OS scheduler is doing right now.",
    },
    {
      kind: "why_exists",
      layout: "paragraph",
      text: "Without these labels, debugging a hung application means guessing. With them, a thread dump tells you whether a thread is waiting on a lock, a notification, a timer, or has finished.",
    },
    {
      kind: "parts_or_states",
      layout: "grouped_paragraphs",
      label: "The six states",
      groups: [
        {
          heading: "NEW",
          text: "Constructed but start() has not been called yet. The thread object exists; the OS thread does not.",
        },
        {
          heading: "RUNNABLE",
          text: "Eligible to run. Either on a CPU or in the OS run queue waiting for one — the JVM does not split those apart.",
        },
        {
          heading: "BLOCKED",
          text: "Trying to enter a synchronized block whose monitor another thread holds. Pure mutual-exclusion contention.",
        },
        {
          heading: "WAITING",
          text: "Parked indefinitely on Object.wait, Thread.join, or LockSupport.park with no timeout. Another thread must signal it.",
        },
        {
          heading: "TIMED_WAITING",
          text: "Same as WAITING but with a deadline — Thread.sleep, the timed forms of wait/join, or parkNanos.",
        },
        {
          heading: "TERMINATED",
          text: "run() returned or threw. The Thread object lingers; the OS thread is gone.",
        },
      ],
    },
    {
      kind: "example",
      layout: "paragraph",
      text: "A worker pulled from the executor enters RUNNABLE. It calls a synchronized method another thread holds and flips to BLOCKED. The holder finishes, the worker re-acquires and goes back to RUNNABLE. It calls queue.poll(timeout) and enters TIMED_WAITING. Another thread offers, the worker wakes back to RUNNABLE, finishes its task, and enters TERMINATED.",
    },
    {
      kind: "pitfalls",
      layout: "bullets",
      items: [
        "RUNNABLE doesn't mean on-CPU. The JVM lumps 'on a core' and 'in the OS run queue waiting for one' into the same label, so a 100% CPU machine still shows mostly RUNNABLE.",
        "BLOCKED is reserved for the synchronized monitor — a thread parked on a ReentrantLock shows up as WAITING, not BLOCKED, even though the intent is the same.",
        "A thread doing a blocking I/O read sits in RUNNABLE because the JVM can't tell it's stuck in a syscall.",
      ],
    },
  ],
};

const goldenG2: SpeakableB = {
  archetype: "B",
  pillar: "P01",
  audience_assumption: "beginner",
  voice: "friendly",
  speakable_status: "approved",
  familiarity_anchors: [
    "double-equals compares references, equals compares contents",
    "two String literals share a pool reference",
    "String pool",
  ],
  standard_example:
    '"hello" == "hello" returns true (pool); new String("hello") == "hello" returns false',
  hook: "Both look like equality, but they're answering different questions about the variable.",
  cap: "Default to equals for objects, double-equals for primitives and enums, and Objects.equals when there's any chance of null.",
  followup_handoff: [
    "What is the String pool and how does intern() change the picture?",
    "Why must you override hashCode whenever you override equals?",
    "When is double-equals actually the safer choice for object references?",
    "How does Objects.equals stay null-safe under the hood?",
  ],
  beats: [
    {
      kind: "what_each_is",
      layout: "paragraph",
      text: "Double-equals compares references, equals compares contents. The reference is the bit pattern in the variable — for an object that's a memory address. The contents are whatever the class's equals method says counts as the same.",
    },
    {
      kind: "differences",
      layout: "mini_table",
      columns: ["Double-equals", "Equals method"],
      rows: [
        {
          axis: "What it compares",
          values: ["Bits in the variable.", "Contents the class defines."],
        },
        {
          axis: "Works on primitives",
          values: ["Yes — that's the right tool.", "No — primitives have no methods."],
        },
        {
          axis: "Default for objects",
          values: [
            "Always reference identity.",
            "Reference identity unless the class overrides it.",
          ],
        },
        {
          axis: "Null-safe",
          values: [
            "Yes — null == null is true.",
            "No — a.equals(null) throws NullPointerException.",
          ],
        },
      ],
    },
    {
      kind: "when_to_pick",
      layout: "bullets",
      items: [
        "Reach for double-equals on primitives — int, long, boolean — and on enum constants, because each constant is a JVM-guaranteed singleton.",
        "Reach for equals on objects whose contents matter — strings, value objects, anything that's overridden equals to mean something.",
        "Reach for Objects.equals when either side might be null — it'll handle both-null and one-null without an NPE.",
      ],
    },
    {
      kind: "tiny_example",
      layout: "paragraph",
      text: 'The classic gotcha is the String pool. "hello" == "hello" returns true — the JVM interns identical literals into one pooled object. But new String("hello") == "hello" returns false. Same characters, but they\'re not the same object.',
    },
  ],
};

const goldenG3: SpeakableC = {
  archetype: "C",
  pillar: "P01",
  audience_assumption: "familiar",
  voice: "neutral",
  speakable_status: "approved",
  familiarity_anchors: [
    "array of buckets",
    "hashcode picks the bucket",
    "collision resolution via chaining",
    "treeify at bucket size 8 in Java 8+",
  ],
  standard_example: 'map.put("key", value) — collision in a bucket',
  hook: "HashMap handles collisions with chaining — and Java 8 added a tree fallback when one bucket's too crowded.",
  cap: "Hashing is fast and forgiving — until the hashcode is bad or threads share the map. Use ConcurrentHashMap when they do.",
  followup_handoff: [
    "How does ConcurrentHashMap differ from HashMap internally?",
    "Why is the treeify threshold 8 and the untreeify threshold 6, not the same number?",
    "What changes when MIN_TREEIFY_CAPACITY isn't met — why resize instead?",
    "How does the spread function in hash() defend against weak hashCode implementations?",
  ],
  beats: [
    {
      kind: "mental_model",
      layout: "paragraph",
      text: "Picture an array of buckets. Each key's hashcode picks the bucket. When two keys land in the same bucket, they queue up. The first one's the head of a chain. Reads walk the chain comparing equals until they find the right entry.",
    },
    {
      kind: "mechanism",
      layout: "ordered_list",
      steps: [
        "On put, compute the hash, find the bucket, walk the chain — replace if equals matches, append otherwise.",
        "On get, compute the same hash, find the bucket, walk the chain, return the value whose key passes equals.",
        "Past load factor 0.75, double the array and rehash every entry.",
        "When a bucket exceeds 8 (TREEIFY_THRESHOLD), convert it to a red-black tree for O(log n) lookup. This only fires if the table has 64 or more buckets.",
        "When a bucket shrinks below 6, the tree reverts to a list — the 8-to-6 gap stops it from flipping back and forth.",
      ],
    },
    {
      kind: "edge_cases",
      layout: "bullets",
      items: [
        "Mutating a key after insert breaks the contract — the new hashcode points to the wrong bucket, and get() silently returns null.",
        "Two equal objects must hash to the same bucket. Break that and put() lands in one slot while get() looks in another.",
        "Records auto-generate equals and hashcode from all components, so they're the safest HashMap keys.",
      ],
    },
    {
      kind: "failure_mode",
      layout: "callout",
      text: "The classic failure's the resize storm. Pre-Java-8, two threads resizing the same HashMap concurrently could splice a circular link into a bucket. The next get() on that bucket spun an infinite loop and pinned a CPU until the JVM died. Java 8 fixed it, but the lesson held — when threads share a map, that's ConcurrentHashMap territory.",
    },
  ],
};

const goldenG4: SpeakableD = {
  archetype: "D",
  pillar: "P11",
  audience_assumption: "familiar",
  voice: "neutral",
  speakable_status: "approved",
  familiarity_anchors: ["thread dump", "flame graph", "tail latency"],
  standard_example: "jstack + async-profiler",
  hook: "Capture data before restarting — a restart clears the stack and you're left guessing for a week.",
  cap: "The shape of the flame graph picks the tool — and the rest of the toolkit confirms the call.",
  followup_handoff: [
    "How would the playbook change if the pod had a Kubernetes CPU limit?",
    "How do you tell a GC-induced spike apart from an application spike on the same flame graph?",
    "What changes when async-profiler isn't allowed in production — what's the next-best signal?",
    "How would you verify the fix once you ship it?",
  ],
  beats: [
    {
      kind: "clarify",
      layout: "paragraph",
      text: "Two questions before I touch anything. Is the spike on one pod or every pod, and is it tied to traffic shape or to a recent deploy?",
    },
    {
      kind: "hypothesis",
      layout: "paragraph",
      text: "If GC threads dominate the CPU, it's heap pressure or a leak. If one application thread runs hot, it's a tight loop or a runaway regex. If many threads pile on the same lock, that's contention. If the spike fires at startup, the JIT's still compiling hot paths.",
    },
    {
      kind: "step_by_step",
      layout: "ordered_list",
      steps: [
        "Pull the per-thread CPU view with top -H -p PID and note the thread IDs in hex.",
        "Capture a thread dump with jstack and find the matching threads — RUNNABLE on a tight loop, BLOCKED on a monitor.",
        "Run async-profiler for 30 seconds in CPU mode (-e cpu) and generate the flame graph.",
        "Cross-check with jstat -gcutil PID 1000: if Old Gen climbs toward 100%, the spike's a full GC pause, not application code.",
        "If the flame graph fingers a request path, switch async-profiler to wall-clock mode. The wall-clock sampler catches I/O-induced spikes the CPU sampler misses.",
        "Correlate the timeline with the deploy log and the dashboards before you touch the pod.",
      ],
    },
    {
      kind: "tools",
      layout: "bullets",
      items: [
        "Use jstack for the thread dump that shows who's stuck on what.",
        "Use async-profiler for CPU and wall-clock flame graphs without bytecode instrumentation.",
        "Use jstat -gcutil for live GC pause and heap usage.",
        "Use Micrometer or your APM histogram for percentile-aware latency, never the average.",
      ],
    },
    {
      kind: "tradeoff",
      layout: "paragraph",
      text: "I take the latency hit of running async-profiler in production over guessing — a 30-second profile costs less than another night of incident pages.",
    },
  ],
};

const goldenG5: SpeakableE = {
  archetype: "E",
  pillar: "P01",
  audience_assumption: "familiar",
  voice: "friendly",
  speakable_status: "approved",
  familiarity_anchors: [
    "interface is pure contract, abstract class can mix in state",
    "single inheritance for classes, multiple for interfaces",
    "default methods since Java 8",
  ],
  standard_example: "Shape with abstract draw() vs Drawable interface",
  hook: "I default to the interface and only switch to an abstract class when shared state forces my hand.",
  cap: "Default to interface; promote to abstract class only when shared state forces my hand.",
  followup_handoff: [
    "What changed for this decision after Java 8 default methods?",
    "When would you reach for composition instead of either?",
    "How do sealed interfaces in Java 17 narrow the design space?",
    "When does an abstract class with a protected constructor beat a static factory?",
  ],
  beats: [
    {
      kind: "optimising_for",
      layout: "paragraph",
      text: "I'm optimising for room to evolve. Interface is pure contract, abstract class can mix in state — and committing to a parent closes other doors.",
    },
    {
      kind: "options",
      layout: "grouped_paragraphs",
      groups: [
        {
          heading: "Interface",
          text: "Pure contract, multiple inheritance allowed. Default methods since Java 8 let me ship behaviour without breaking implementers.",
        },
        {
          heading: "Abstract class",
          text: "Lets me share state and partial implementation. Cleaner when several siblings genuinely share a chunk of code that doesn't belong on every implementer.",
        },
      ],
    },
    {
      kind: "tradeoffs",
      layout: "bullets",
      items: [
        "Interface gives flexibility but costs me shared state and constructor-time setup.",
        "Abstract class gives shared state but costs me single-inheritance — and a future sibling can't mix in behaviour from elsewhere.",
      ],
    },
    {
      kind: "decision",
      layout: "paragraph",
      text: "I'd start with an interface. If two implementers begin duplicating five lines, I'd pull them into an abstract class — but only then.",
    },
    {
      kind: "rethink_if",
      layout: "callout",
      text: "I'd rethink the abstract class the moment a second sibling needs to mix in behaviour from elsewhere — multiple inheritance closes that door, interfaces leave it open.",
    },
  ],
};

const goldenG6: SpeakableF = {
  archetype: "F",
  pillar: "P06",
  audience_assumption: "familiar",
  voice: "neutral",
  speakable_status: "approved",
  familiarity_anchors: [
    "base-62 short keys",
    "Redis or in-memory cache fronting the store",
    "30 to 50 to 1 read-to-write ratio is typical",
  ],
  standard_example: "POST /shorten with a base-62 7-char key, GET /{key} returns 301",
  hook: "I'd anchor on numbers first — capacity decides almost every design choice that follows.",
  cap: "Numbers picked the design — caches, sharding, and a key strategy that holds at the year-mark.",
  followup_handoff: [
    "How would you handle a viral link that breaks the cache shard?",
    "What changes if links expire after 24 hours instead of a year?",
    "Where would you decouple analytics so they don't add latency to the redirect path?",
    "How do you size the cache memory footprint for the working set?",
  ],
  beats: [
    {
      kind: "requirements_fr_nfr",
      layout: "grouped_paragraphs",
      groups: [
        {
          heading: "Functional",
          text: "Shorten long URLs to 7-character base-62 short keys. Redirect on GET. Custom alias and click analytics are optional.",
        },
        {
          heading: "Non-functional",
          text: "Sub-50 ms p99 redirect. Three nines availability. Links live at least one year. Each link is unguessable from another.",
        },
      ],
    },
    {
      kind: "capacity",
      layout: "paragraph",
      text: "10 million new URLs per day means about 115 writes per second average and around 600 at peak. Reads are 50 to 1, so 30 K reads per second. Each row is roughly 500 bytes, so 1.8 GB per day raw and around 650 GB over a year.",
    },
    {
      kind: "api",
      layout: "bullets",
      items: [
        "POST /shorten — body carries the long URL and optional alias. Returns the short key.",
        "GET /{key} — 301 redirect to the long URL.",
        "GET /{key}/stats — click count and per-day breakdown.",
      ],
    },
    {
      kind: "data_model",
      layout: "paragraph",
      text: "One main table keyed by short key — long URL plus owner. Audit columns hold created-at and expires-at. A separate counter table or Redis HINCRBY for click counts avoids contention on the main row.",
    },
    {
      kind: "high_level",
      layout: "paragraph",
      text: "Edge load balancer fronts a stateless redirect service. The redirect service reads from a Redis cache. On miss, it falls back to the primary store. Writes go through a separate write API that checks alias availability and persists.",
    },
    {
      kind: "bottleneck_deep_dive",
      layout: "callout",
      text: "The bottleneck is the read path under hot keys. With 30 K reads per second, a 95% cache hit ratio still leaves 1500 reads per second hitting the database. I'd shard the cache by key prefix and keep the store partitioned the same way so a hot prefix doesn't burn one node.",
    },
    {
      kind: "tradeoffs",
      layout: "paragraph",
      text: "Sequential keys reuse a counter and save a round-trip but make every link guessable from the last. Base-62 random keys cost an extra uniqueness check but stay unguessable. I'd take the random keys.",
    },
  ],
};

const goldenG7: SpeakableG = {
  archetype: "G",
  pillar: "P12",
  audience_assumption: "familiar",
  voice: "friendly",
  speakable_status: "approved",
  familiarity_anchors: ["STAR", "what I'd do differently"],
  standard_example: "disagreement on async messaging vs synchronous calls for a payment flow",
  hook: "I'll take the time my staff engineer and I disagreed on async messaging vs synchronous calls for a payment flow.",
  cap: "Slow the disagreement down enough to find the axis you're actually arguing on, and the better path usually shows up on its own.",
  followup_handoff: [
    "Tell me about a time the disagreement didn't end well — what would you do differently?",
    "How do you decide when to escalate a technical disagreement to a manager?",
    "How do you push back on a senior engineer when you think they're wrong?",
    "Tell me about a time you changed your mind mid-debate.",
  ],
  beats: [
    {
      kind: "situation",
      layout: "paragraph",
      text: "We were building the order-confirmation pipeline. I argued for synchronous calls because the payment provider had clear failure modes and our SLA was tight. Our staff engineer pushed for async messaging through Kafka, citing future fan-out to inventory and analytics. We had three days before the design review.",
    },
    {
      kind: "task",
      layout: "paragraph",
      text: "My job was to land a recommendation the team could ship without breaking the launch date. I owned the design doc and the call.",
    },
    {
      kind: "action",
      layout: "paragraph",
      text: "I asked the staff engineer to walk me through his async path before pushing back. Halfway through I realised he was solving for the next quarter, not the launch. I proposed v1 stay synchronous with a clean seam, ready to swap to Kafka. He drafted the seam, I owned v1, and we set a one-month checkpoint.",
    },
    {
      kind: "result",
      layout: "paragraph",
      text: "We shipped on time. The seam paid off in week six when inventory wanted in — we threw an event publisher behind the existing call without rewriting the path.",
    },
    {
      kind: "reflection",
      layout: "callout",
      text: "Looking back, I'd have asked him to walk through his roadmap on day one — that would've saved two days of arguing the wrong axis.",
    },
  ],
};
