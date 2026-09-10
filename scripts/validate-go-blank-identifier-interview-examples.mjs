#!/usr/bin/env node

import { spawnSync } from "node:child_process";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const contentPath = path.join(
  repoRoot,
  "content/go-fresher/go-syntax-basics/blank-identifier/complete-qa.json",
);
const document = JSON.parse(fs.readFileSync(contentPath, "utf8"));

const expectedSlugs = new Set([
  "go-syntax-basics-blank-identifier-interview-basics",
  "go-syntax-basics-blank-identifier-when-to-use",
  "go-syntax-basics-blank-identifier-common-mistake",
  "go-syntax-basics-blank-identifier-compare",
  "go-syntax-basics-blank-identifier-scenario",
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

if (document.questions.length !== expectedSlugs.size) {
  throw new Error(
    "Expected " + expectedSlugs.size + " questions, found " + document.questions.length,
  );
}

for (const question of document.questions) {
  if (!expectedSlugs.delete(question.slug)) {
    throw new Error("Unexpected or duplicate question: " + question.slug);
  }

  const speaking = question.answer?.sections?.find(
    (section) => section.type === "speakable_answer",
  );
  if (!speaking || !Array.isArray(speaking.beats)) {
    throw new Error("Missing guided Interview Answer for " + question.slug);
  }
  if (speaking.beats.length < 3 || speaking.beats.length > 5) {
    throw new Error(
      question.slug + " has " + speaking.beats.length + " beats; expected 3-5",
    );
  }

  const generatedContent = speaking.beats
    .map((beat) => beat.spokenText.trim())
    .join("\n\n");
  if (speaking.content !== generatedContent) {
    throw new Error("Interview Answer content drift for " + question.slug);
  }

  const stages = speaking.beats.map((beat) => beat.stage);
  if (new Set(stages).size !== stages.length) {
    throw new Error("Repeated stage in " + question.slug);
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
    throw new Error(question.slug + " has more than two supports");
  }
  const codeSupports = supports.filter((support) => support.type === "code");
  if (codeSupports.length !== 1) {
    throw new Error(
      question.slug + " must have exactly one focused runnable code support",
    );
  }

  const code = codeSupports[0].code;
  if (!/^package\s+\w+/m.test(code)) {
    throw new Error("Go example lacks a package declaration: " + question.slug);
  }

  const tempRoot = fs.mkdtempSync(path.join(os.tmpdir(), "ie-go-blank-id-"));
  try {
    fs.writeFileSync(
      path.join(tempRoot, "go.mod"),
      "module example.com/blankidentifiercheck\n\ngo 1.22\n",
    );
    const isTest = /\bfunc\s+Test\w+\s*\(/.test(code);
    const filename = isTest ? "lesson_test.go" : "main.go";
    const examplePath = path.join(tempRoot, filename);
    fs.writeFileSync(examplePath, code.trim() + "\n");

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
    const safePrefix = path.join(os.tmpdir(), "ie-go-blank-id-");
    if (!tempRoot.startsWith(safePrefix)) {
      throw new Error("Refusing to clean unexpected path: " + tempRoot);
    }
    fs.rmSync(tempRoot, { recursive: true, force: true });
  }
}

if (expectedSlugs.size > 0) {
  throw new Error("Missing questions: " + [...expectedSlugs].join(", "));
}

console.log("Validated all blank identifier Interview Answer examples and structure.");
