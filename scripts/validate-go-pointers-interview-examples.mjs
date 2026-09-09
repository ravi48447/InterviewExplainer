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
  "content/go-fresher/go-syntax-basics/pointers-basics/complete-qa.json",
);
const document = JSON.parse(fs.readFileSync(contentPath, "utf8"));
const expectedSlugs = new Set([
  "go-syntax-basics-pointers-basics-interview-basics",
  "go-syntax-basics-pointers-basics-when-to-use",
  "go-syntax-basics-pointers-basics-common-mistake",
  "go-syntax-basics-pointers-basics-compare",
  "go-syntax-basics-pointers-basics-scenario",
]);
const genericStages = new Set([
  "Meaning",
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
const quickHashes = new Set();
const exampleHashes = new Set();
const codeFence = String.fromCharCode(96).repeat(3);

if (document.questions.length !== expectedSlugs.size) {
  throw new Error("Expected five pointer questions, found " + document.questions.length);
}

for (const question of document.questions) {
  if (!expectedSlugs.delete(question.slug)) {
    throw new Error("Unexpected or duplicate question: " + question.slug);
  }

  const sections = question.answer?.sections ?? [];
  const quick = sections.find((section) => section.type === "key_points");
  const speaking = sections.find((section) => section.type === "speakable_answer");
  const deep = sections.find((section) => section.type === "deep_explanation");
  const example = sections.find((section) => section.type === "code_example");
  if (!quick || !speaking || !deep || !example) {
    throw new Error("Missing an existing learning zone for " + question.slug);
  }

  if (!question.direct_answer || question.direct_answer.split(/\s+/).length < 45) {
    throw new Error("Direct answer is too shallow for " + question.slug);
  }
  if (!Array.isArray(quick.items) || quick.items.length !== 5) {
    throw new Error("Quick Revision must have five points for " + question.slug);
  }
  quickHashes.add(
    crypto.createHash("sha256").update(JSON.stringify(quick.items)).digest("hex"),
  );

  if (!Array.isArray(speaking.beats) ||
      speaking.beats.length < 3 ||
      speaking.beats.length > 5) {
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
  const supports = speaking.beats
    .map((beat) => beat.support)
    .filter(Boolean);
  if (supports.length > 2) {
    throw new Error("More than two Interview Answer supports in " + question.slug);
  }
  if (!speaking.beats.some(
    (beat) => beat.spokenText.includes(String.fromCharCode(96)),
  )) {
    throw new Error("No relevant inline Go appears in " + question.slug);
  }

  const deepWords = deep.content.trim().split(/\s+/).length;
  if (deepWords < 150) {
    throw new Error("Deep Dive is too shallow for " + question.slug + ": " + deepWords);
  }
  if (!deep.title || /^(Build|Make|Understand|Reason)\b/.test(deep.title)) {
    throw new Error("Deep Dive heading is not concept-specific: " + deep.title);
  }

  const prefix = codeFence + "go\n";
  const suffix = "\n" + codeFence;
  if (!example.content.startsWith(prefix) || !example.content.endsWith(suffix)) {
    throw new Error("Expected one complete fenced Go example for " + question.slug);
  }
  const code = example.content
    .slice(prefix.length, -suffix.length)
    .trim() + "\n";
  if (!/^package\s+\w+/m.test(code)) {
    throw new Error("Go example lacks package declaration: " + question.slug);
  }
  exampleHashes.add(crypto.createHash("sha256").update(code).digest("hex"));

  const tempRoot = fs.mkdtempSync(path.join(os.tmpdir(), "ie-go-pointers-"));
  try {
    fs.writeFileSync(
      path.join(tempRoot, "go.mod"),
      "module example.com/pointercheck\n\ngo 1.22\n",
    );
    const isTest = /\bfunc\s+Test\w+\s*\(/.test(code);
    const filename = isTest ? "lesson_test.go" : "main.go";
    const examplePath = path.join(tempRoot, filename);
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
    const command = isTest ? ["test", "."] : ["run", "."];
    const result = spawnSync("go", command, {
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
    const safePrefix = path.join(os.tmpdir(), "ie-go-pointers-");
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
  throw new Error("Quick Revision content is duplicated between pointer questions");
}
if (exampleHashes.size !== document.questions.length) {
  throw new Error("Full Go examples are duplicated between pointer questions");
}

console.log("Validated all pointer learning zones and complete Go examples.");
