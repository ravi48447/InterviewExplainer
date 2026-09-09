#!/usr/bin/env node

import { spawnSync } from "node:child_process";
import crypto from "node:crypto";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const contentPath = path.join(
  repoRoot,
  "content/go-fresher/go-slices-maps/slice-tricks/complete-qa.json",
);
const document = JSON.parse(fs.readFileSync(contentPath, "utf8"));

const expected = new Map([
  [
    "go-slices-maps-slice-tricks-interview-basics",
    {
      visual: "flow_diagram",
      output: [
        "result: [A C D]",
        "old view: [\"A\" \"C\" \"D\" \"\"]",
        "tail cleared: true",
      ].join("\n"),
    },
  ],
  [
    "go-slices-maps-slice-tricks-when-to-use",
    {
      visual: "flow_diagram",
      output: [
        "result: [A D C]",
        "old view: [\"A\" \"D\" \"C\" \"\"]",
        "tail cleared: true",
      ].join("\n"),
    },
  ],
  [
    "go-slices-maps-slice-tricks-common-mistake",
    {
      visual: "comparison_table",
      output: [
        "after shallow change: [[9 2] [3]] [[9 2] [3]]",
        "after inner clone: [[9 2] [3]] [[7 2] [3]]",
        "nil preserved: true",
      ].join("\n"),
    },
  ],
  [
    "go-slices-maps-slice-tricks-compare",
    {
      visual: "flow_diagram",
      output: [
        "result: [Go Ruby]",
        "old view: [\"Go\" \"Ruby\" \"\" \"\"]",
        "tail cleared: true true",
      ].join("\n"),
    },
  ],
]);
const genericStages = new Set([
  "Meaning",
  "Definition",
  "Mechanism",
  "Example",
  "Use",
  "Trade-off",
  "Decision",
  "Core idea",
  "Detail",
  "Prevention",
  "Reproduce",
  "Trace",
  "Verify",
]);
const visualTypes = new Set(["flow_diagram", "comparison_table", "trace"]);
const fence = String.fromCharCode(96).repeat(3);
const quickHashes = new Set();
const codeHashes = new Set();

if (document.questions.length !== expected.size) {
  throw new Error("Expected four slice-trick questions, found " + document.questions.length);
}

for (const question of document.questions) {
  const contract = expected.get(question.slug);
  if (!contract) {
    throw new Error("Unexpected or duplicate question: " + question.slug);
  }
  expected.delete(question.slug);

  const sections = question.answer?.sections ?? [];
  const quick = sections.find((section) => section.type === "key_points");
  const speaking = sections.find((section) => section.type === "speakable_answer");
  const overview = sections.find((section) => section.type === "overview");
  const visual = sections.find((section) => section.type === contract.visual);
  const example = sections.find((section) => section.type === "code_example");
  if (!quick || !speaking || !overview || !visual || !example) {
    throw new Error("Missing a required learning section for " + question.slug);
  }

  const directWords = question.direct_answer?.trim().split(/\s+/).length ?? 0;
  if (directWords < 45 || directWords > 90) {
    throw new Error("Direct answer length is outside 45-90 words for " + question.slug);
  }
  if (!Array.isArray(quick.items) || quick.items.length !== 5) {
    throw new Error("Quick Revision must contain five points for " + question.slug);
  }
  quickHashes.add(
    crypto.createHash("sha256").update(JSON.stringify(quick.items)).digest("hex"),
  );

  if (!Array.isArray(speaking.beats) || speaking.beats.length < 3 || speaking.beats.length > 5) {
    throw new Error("Interview Answer must contain 3-5 beats for " + question.slug);
  }
  const generated = speaking.beats.map((beat) => beat.spokenText.trim()).join("\n\n");
  if (speaking.content !== generated) {
    throw new Error("Interview Answer content drift for " + question.slug);
  }
  const stages = speaking.beats.map((beat) => beat.stage);
  if (new Set(stages).size !== stages.length) {
    throw new Error("Repeated Interview Answer stage for " + question.slug);
  }
  for (const stage of stages) {
    if (genericStages.has(stage)) {
      throw new Error("Generic stage " + stage + " remains in " + question.slug);
    }
  }
  if (!speaking.beats.some((beat) => beat.spokenText.includes(fence[0]))) {
    throw new Error("Interview Answer lacks inline Go for " + question.slug);
  }

  const beatVisuals = speaking.beats.filter((beat) => beat.support).length;
  const sectionVisuals = sections.filter((section) => visualTypes.has(section.type)).length;
  if (beatVisuals + sectionVisuals !== 1) {
    throw new Error("Expected exactly one purposeful visual for " + question.slug);
  }
  const deepWords = overview.content.trim().split(/\s+/).length;
  if (deepWords < 150) {
    throw new Error("Deep Dive is too shallow for " + question.slug + ": " + deepWords);
  }
  if (!overview.title || /^(Concept|Deep dive|Overview|Explanation)$/i.test(overview.title)) {
    throw new Error("Deep Dive title is not concept-specific for " + question.slug);
  }

  const prefix = fence + "go\n";
  const suffix = "\n" + fence;
  if (!example.content.startsWith(prefix) || !example.content.endsWith(suffix)) {
    throw new Error("Expected one complete fenced Go example for " + question.slug);
  }
  const code = example.content.slice(prefix.length, -suffix.length).trim() + "\n";
  if (!/^package\s+main$/m.test(code) || !/\bfunc\s+main\s*\(\s*\)/.test(code)) {
    throw new Error("Go example is not runnable for " + question.slug);
  }
  codeHashes.add(crypto.createHash("sha256").update(code).digest("hex"));

  // VALIDATOR
}
