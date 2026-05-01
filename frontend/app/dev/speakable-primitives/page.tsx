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
      </div>
    </main>
  );
}
