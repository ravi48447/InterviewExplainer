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
  "content/go-fresher/go-slices-maps/slice-internals-len-cap/complete-qa.json",
);
const document = JSON.parse(fs.readFileSync(contentPath, "utf8"));
const expectedSlugs = new Set([
  "go-slices-maps-slice-internals-len-cap-interview-basics",
  "go-slices-maps-slice-internals-len-cap-when-to-use",
  "go-slices-maps-slice-internals-len-cap-common-mistake",
  "go-slices-maps-slice-internals-len-cap-compare",
]);
const expectedVisuals = new Map([
  ["go-slices-maps-slice-internals-len-cap-interview-basics", "flow_diagram"],
  ["go-slices-maps-slice-internals-len-cap-when-to-use", "comparison_table"],
  ["go-slices-maps-slice-internals-len-cap-common-mistake", "flow_diagram"],
  ["go-slices-maps-slice-internals-len-cap-compare", "flow_diagram"],
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
const codeFence = String.fromCharCode(96).repeat(3);
const quickHashes = new Set();
const exampleHashes = new Set();

if (document.questions.length !== expectedSlugs.size) {
  throw new Error(
    "Expected four slice-internals questions, found " + document.questions.length,
  );
}

for (const question of document.questions) {
  if (!expectedSlugs.delete(question.slug)) {
    throw new Error("Unexpected or duplicate question: " + question.slug);
  }

  const sections = question.answer?.sections ?? [];
  const quick = sections.find((section) => section.type === "key_points");
  const speaking = sections.find((section) => section.type === "speakable_answer");
  const overview = sections.find((section) => section.type === "overview");
  const visualType = expectedVisuals.get(question.slug);
  const visual = sections.find((section) => section.type === visualType);
  const example = sections.find((section) => section.type === "code_example");
  if (!quick || !speaking || !overview || !visual || !example) {
    throw new Error("Missing an existing learning section for " + question.slug);
  }

  const directWords = question.direct_answer?.trim().split(/\s+/).length ?? 0;
  if (directWords < 45) {
    throw new Error("Direct answer is too shallow for " + question.slug);
  }
  if (!Array.isArray(quick.items) || quick.items.length !== 5) {
    throw new Error("Quick Revision must have five points for " + question.slug);
  }
  quickHashes.add(
    crypto.createHash("sha256").update(JSON.stringify(quick.items)).digest("hex"),
  );

  if (
    !Array.isArray(speaking.beats) ||
    speaking.beats.length < 3 ||
    speaking.beats.length > 5
  ) {
    throw new Error("Interview Answer must have 3-5 beats for " + question.slug);
  }
  const generated = speaking.beats
    .map((beat) => beat.spokenText.trim())
    .join("\n\n");
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
  const supports = speaking.beats.map((beat) => beat.support).filter(Boolean);
  const purposefulVisualCount = supports.length + (visual ? 1 : 0);
  if (purposefulVisualCount > 1) {
    throw new Error(
      "More than one purposeful visual appears across the answer for " + question.slug,
    );
  }
  if (!speaking.beats.some((beat) => beat.spokenText.includes(codeFence[0]))) {
    throw new Error("No relevant inline Go appears in " + question.slug);
  }

  const overviewWords = overview.content.trim().split(/\s+/).length;
  if (overviewWords < 150) {
    throw new Error(
      "Deep Dive overview is too shallow for " + question.slug + ": " + overviewWords,
    );
  }
  if (!overview.title || /^(Concept|Deep dive|Overview|Explanation)$/i.test(overview.title)) {
    throw new Error("Deep Dive heading is not concept-specific: " + overview.title);
  }
  if (!visual.title || !visual.content.trim()) {
    throw new Error("Purposeful Deep Dive visual is empty for " + question.slug);
  }

  const prefix = codeFence + "go\n";
  const suffix = "\n" + codeFence;
  if (!example.content.startsWith(prefix) || !example.content.endsWith(suffix)) {
    throw new Error("Expected one complete fenced Go example for " + question.slug);
  }
  const code = example.content.slice(prefix.length, -suffix.length).trim() + "\n";
  if (!/^package\s+main$/m.test(code) || !/\bfunc\s+main\s*\(\s*\)/.test(code)) {
    throw new Error("Go example is not a complete runnable program: " + question.slug);
  }
  exampleHashes.add(crypto.createHash("sha256").update(code).digest("hex"));

  const tempRoot = fs.mkdtempSync(path.join(os.tmpdir(), "ie-go-slice-internals-"));
  try {
    fs.writeFileSync(
      path.join(tempRoot, "go.mod"),
      "module example.com/sliceinternalscheck\n\ngo 1.22\n",
    );
    const examplePath = path.join(tempRoot, "main.go");
    fs.writeFileSync(examplePath, code);
    const format = spawnSync("gofmt", ["-d", examplePath], {
      cwd: tempRoot,
      encoding: "utf8",
    });
    if (format.status !== 0 || format.stdout) {
      throw new Error(
        question.slug + " is not gofmt-clean:\n" +
          (format.stderr || format.stdout || "unknown gofmt error"),
      );
    }
    const result = spawnSync("go", ["run", "."], {
      cwd: tempRoot,
      encoding: "utf8",
      env: {
        ...process.env,
        GOCACHE: path.join(tempRoot, ".gocache"),
        GOMODCACHE: path.join(tempRoot, ".gomodcache"),
        GOWORK: "off",
      },
    });
    if (result.status !== 0) {
      throw new Error(
        question.slug + " failed: " +
          (result.stderr || result.stdout || "unknown Go error"),
      );
    }
    const output = result.stdout.trim().replace(/\n/g, " | ");
    console.log(question.slug + ": PASS" + (output ? " — " + output : ""));
  } finally {
    const safePrefix = path.join(os.tmpdir(), "ie-go-slice-internals-");
    if (!tempRoot.startsWith(safePrefix)) {
      throw new Error("Refusing to clean unexpected path: " + tempRoot);
    }
    fs.rmSync(tempRoot, { recursive: true, force: true });
  }
}

if (expectedSlugs.size > 0) {
  throw new Error("Missing questions: " + [...expectedSlugs].join(", "));
}
if (quickHashes.size !== document.questions.length) {
  throw new Error("Quick Revision content is duplicated between slice questions");
}
if (exampleHashes.size !== document.questions.length) {
  throw new Error("Full Go examples are duplicated between slice questions");
}

console.log("Validated all slice-internals learning zones and complete Go examples.");
