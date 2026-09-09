#!/usr/bin/env node

import crypto from "node:crypto";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const targetFile =
  "content/java-backend-fresher/java-strings/string-immutability/complete-qa.json";
const ownerFile = "scripts/curate-java-string-immutability-gold.mjs";

// Fact contract: Java SE 25 String/StringBuilder API documentation plus JLS
// 3.10.5 and 15.18.1. Compact Strings remain an implementation detail.
const contracts = {
  "java-strings-overview": {
    stages: [
      "A stable text value",
      "Operations return values",
      "Content and identity",
      "UTF-16 positions",
      "Share versus build",
    ],
    support: "comparison",
    evidence: [
      "final, immutable class",
      "left.equals(right)",
      "left == right",
      "surrogate pair",
      "codePointCount()",
      "StringBuilder",
      "private storage",
    ],
    output: ["Java", "JAVA", "true", "false", "3", "2", "Java strings"],
  },
  "why-is-string-immutable-in-java": {
    stages: [
      "The value stays fixed",
      "No mutation path",
      "Why stability matters",
      "Important boundaries",
      "Thread-safety boundary",
    ],
    support: "trace",
    evidence: [
      "existing String object's text",
      "String upper = name.toUpperCase()",
      "HashMap",
      "may return the same String",
      "private final char array",
      "volatile",
    ],
    output: ["java", "Java", "hello", "HELLO"],
  },
  "why-is-string-concatenation-in-a-loop-slow-in-java": {
    stages: [
      "A new combined value",
      "The prefix is copied again",
      "Reuse mutable capacity",
      "Small expressions are fine",
      "Optimize the real pattern",
    ],
    support: "trace",
    evidence: [
      "result += piece",
      "O(n²)",
      "StringBuilder builder = new StringBuilder()",
      "builder.append(piece)",
      "first + \" \" + last",
      "compiler and JVM machinery",
      "proper benchmark",
    ],
    output: ["Java strings"],
  },
};

const expectedIdentity = [
  ["3", "java-strings-overview", "What is the Java String abstraction and why does it exist?"],
  ["jbf-strings-immutability-001", "why-is-string-immutable-in-java", "Why is String immutable in Java?"],
  [
    "jbf-strings-immutability-002",
    "why-is-string-concatenation-in-a-loop-slow-in-java",
    "If String is immutable, why is String concatenation in a loop slow in Java?",
  ],
];

const unrelatedHashes = {
  "content/java-backend-fresher/java-strings/string-pool/complete-qa.json":
    "be764d6aacf0eeae99438de0e6a8c2b592f0a828180bf8663fa6ff0c6af19bc7",
  "content/java-backend-fresher/java-strings/string-methods/complete-qa.json":
    "7cafb8df050d79c6e545ba6cf2e62dea9fbf530e3c5f77c97cd82be2bae6103b",
  "content/java-backend-fresher/java-strings/string-comparisons/complete-qa.json":
    "2e01f361d514a041dc765346aae28496eee8f848e25c330b84b14edf002aaeed",
  "content/java-backend-fresher/java-strings/stringbuilder-vs-stringbuffer/complete-qa.json":
    "a40237ae0217343f6f7f3d4f3e52b5b4f245190012491d43e31bf519ef193e2c",
};

const sha256 = (value) => crypto.createHash("sha256").update(value).digest("hex");

function normalized(value = "") {
  return String(value)
    .toLowerCase()
    .replace(/```[\s\S]*?```/g, " ")
    .replace(/[`*_#>|~\[\](){},.:;!?"']/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function wordCount(value = "") {
  const text = normalized(value);
  return text ? text.split(" ").length : 0;
}

function shingleContainment(left, right, size = 5) {
  const words = (value) => normalized(value).split(" ").filter(Boolean);
  const shingles = (values) => new Set(
    Array.from(
      { length: Math.max(0, values.length - size + 1) },
      (_, index) => values.slice(index, index + size).join(" "),
    ),
  );
  const leftSet = shingles(words(left));
  const rightSet = shingles(words(right));
  if (!leftSet.size || !rightSet.size) return 0;
  let overlap = 0;
  for (const item of leftSet) if (rightSet.has(item)) overlap += 1;
  return overlap / Math.min(leftSet.size, rightSet.size);
}

function extractJava(section, slug) {
  const match = String(section?.content ?? "").match(/```java\n([\s\S]*?)\n```/);
  if (!match) throw new Error(`${slug}: missing complete Java example`);
  if ((String(section.content).match(/```java/g) ?? []).length !== 1) {
    throw new Error(`${slug}: expected exactly one Java fence`);
  }
  return match[1];
}

function compileAndRun(source, expectedOutput, slug) {
  const className = source.match(/\bclass\s+([A-Za-z_$][\w$]*)/)?.[1];
  if (!className || !/public\s+static\s+void\s+main\s*\(/.test(source)) {
    throw new Error(`${slug}: Java example needs a runnable class`);
  }
  const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), "java-string-lesson-"));
  try {
    const sourcePath = path.join(tempDir, `${className}.java`);
    fs.writeFileSync(sourcePath, `${source}\n`);
    const compile = spawnSync("javac", ["--release", "17", sourcePath], {
      encoding: "utf8",
      timeout: 30000,
    });
    if (compile.error || compile.status !== 0) {
      throw new Error(
        `${slug}: javac failed\n${compile.stdout}${compile.stderr}${compile.error ?? ""}`,
      );
    }
    const run = spawnSync("java", ["-cp", tempDir, className], {
      encoding: "utf8",
      timeout: 30000,
    });
    if (run.error || run.status !== 0) {
      throw new Error(`${slug}: Java example failed\n${run.stdout}${run.stderr}${run.error ?? ""}`);
    }
    const actual = run.stdout.trimEnd().split("\n");
    if (JSON.stringify(actual) !== JSON.stringify(expectedOutput)) {
      throw new Error(`${slug}: unexpected Java output ${JSON.stringify(actual)}`);
    }
  } finally {
    fs.rmSync(tempDir, { recursive: true, force: true });
  }
}

function assertUnrelatedHashes() {
  for (const [file, expected] of Object.entries(unrelatedHashes)) {
    const actual = sha256(fs.readFileSync(path.join(repoRoot, file)));
    if (actual !== expected) throw new Error(`${file}: unrelated file hash drifted`);
  }
}

const targetPath = path.join(repoRoot, targetFile);
const document = JSON.parse(fs.readFileSync(targetPath, "utf8"));
const actualIdentity = document.questions?.map(({ id, slug, question }) => [id, slug, question]);
if (document.topicSlug !== "string-immutability"
    || JSON.stringify(actualIdentity) !== JSON.stringify(expectedIdentity)) {
  throw new Error("String immutability topic identity drifted");
}

for (const question of document.questions) {
  const contract = contracts[question.slug];
  if (!contract) throw new Error(`${question.slug}: unexpected question`);
  if (question.last_updated !== "2026-09-09" || question.importance !== "high") {
    throw new Error(`${question.slug}: review metadata drifted`);
  }
  if (wordCount(question.direct_answer) < 20 || wordCount(question.direct_answer) > 90) {
    throw new Error(`${question.slug}: Direct Answer is not concise and complete`);
  }

  const sections = question.answer?.sections ?? [];
  const expectedTypes = ["key_points", "speakable_answer", "deep_explanation", "code_example"];
  if (JSON.stringify(sections.map((section) => section.type)) !== JSON.stringify(expectedTypes)) {
    throw new Error(`${question.slug}: the three-zone section order drifted`);
  }
  const [quick, interview, deep, example] = sections;
  if (!Array.isArray(quick.items) || quick.items.length !== 5
      || new Set(quick.items.map(normalized)).size !== 5) {
    throw new Error(`${question.slug}: Quick Revision is not five distinct exact points`);
  }

  const beats = interview.beats ?? [];
  if (interview.answerSize !== "standard"
      || JSON.stringify(beats.map((beat) => beat.stage)) !== JSON.stringify(contract.stages)) {
    throw new Error(`${question.slug}: guided Interview Answer sequence drifted`);
  }
  if (beats.some((beat) => wordCount(beat.spokenText) > 90 || beat.stage.length > 30)) {
    throw new Error(`${question.slug}: Interview Answer contains an essay-sized beat`);
  }
  const fallback = beats.map((beat) => beat.spokenText.trim()).join("\n\n");
  if (fallback !== interview.content) {
    throw new Error(`${question.slug}: Interview Answer fallback drifted from beats`);
  }
  if (/\b(?:tell|say|mention) (?:the|your|an) interviewer\b|\bto stand out\b|\bI would begin\b/i.test(fallback)) {
    throw new Error(`${question.slug}: coaching language entered the model answer`);
  }

  const supports = beats.map((beat) => beat.support).filter(Boolean);
  if (supports.length !== 1 || supports[0].type !== contract.support
      || !Array.isArray(supports[0].items) || supports[0].items.length < 2) {
    throw new Error(`${question.slug}: expected one purposeful ${contract.support} support`);
  }
  const evidence = beats.flatMap((beat) => [
    beat.spokenText,
    beat.support?.title,
    ...(beat.support?.items ?? []).flatMap((item) => [item.label, item.value, item.detail]),
  ]).filter(Boolean).join("\n");
  for (const token of contract.evidence) {
    if (!evidence.includes(token)) {
      throw new Error(`${question.slug}: missing teaching evidence ${JSON.stringify(token)}`);
    }
  }

  if (wordCount(deep.content) < 180 || (String(deep.content).match(/^\*\*.+\*\*$/gm) ?? []).length < 3) {
    throw new Error(`${question.slug}: Deep Dive is not an independent readable mini-article`);
  }
  if (shingleContainment(interview.content, deep.content) >= 0.45) {
    throw new Error(`${question.slug}: Interview Answer substantially repeats Deep Dive`);
  }

  compileAndRun(extractJava(example, question.slug), contract.output, question.slug);
}

assertUnrelatedHashes();
const targetBefore = fs.readFileSync(targetPath, "utf8");
const unrelatedBefore = new Map(
  Object.keys(unrelatedHashes).map((file) => [file, fs.readFileSync(path.join(repoRoot, file), "utf8")]),
);
for (const slug of Object.keys(contracts)) {
  const result = spawnSync(process.execPath, [path.join(repoRoot, ownerFile), slug], {
    cwd: repoRoot,
    encoding: "utf8",
    timeout: 30000,
  });
  if (result.error || result.status !== 0) {
    throw new Error(`${slug}: deterministic owner failed\n${result.stdout}${result.stderr}${result.error ?? ""}`);
  }
}
if (fs.readFileSync(targetPath, "utf8") !== targetBefore) {
  throw new Error(`${targetFile}: targeted curator is not byte deterministic`);
}
for (const [file, original] of unrelatedBefore) {
  if (fs.readFileSync(path.join(repoRoot, file), "utf8") !== original) {
    throw new Error(`${file}: targeted curator changed an unrelated file`);
  }
}
assertUnrelatedHashes();

console.log(
  "Validated 3/3 String immutability lessons, guided supports, independent Deep Dives, three javac/run examples, deterministic ownership, and four unrelated file hashes.",
);
