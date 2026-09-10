#!/usr/bin/env node

import { spawnSync } from "node:child_process";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const questionFile = path.join(
  repoRoot,
  "content/go-fresher/go-syntax-basics/comparisons/complete-qa.json",
);
const expected = {
  "go-syntax-basics-comparisons-interview-basics": {
    stages: [
      "Equality follows the type",
      "Composite types inherit rules",
      "Ordering is narrower",
      "Interfaces add a runtime check",
    ],
    evidence: ["complex numbers", "struct", "ordered", "dynamic type"],
    supports: ["comparison"],
    deepOutput: "true\ntrue",
  },
  "go-syntax-basics-comparisons-when-to-use": {
    stages: [
      "Exact values suit ==",
      "Order needs real meaning",
      "Collections compare by content",
      "Business equality needs a rule",
    ],
    evidence: ["OrderKey", "tie-breaker", "maps.Equal", "sameCustomer"],
    supports: ["comparison"],
    deepOutput: "true\ntrue",
  },
  "go-syntax-basics-comparisons-common-mistake": {
    stages: [
      "Some pairs cannot use ==",
      "Interfaces may panic",
      "Valid syntax can be wrong",
      "Text order is lexical",
    ],
    evidence: ["compile-time error", "type switch", "NaN", "strings.EqualFold"],
    supports: ["trace"],
    deepOutput: "same contents",
  },
  "go-syntax-basics-comparisons-compare": {
    stages: [
      "== fits exact comparable data",
      "Helpers compare contents",
      "Custom rules express meaning",
      "Reflection is not the default",
    ],
    evidence: ["slices.EqualFunc", "maps.EqualFunc", "tolerance", "reflect.DeepEqual"],
    supports: ["comparison"],
    deepOutput: "true false true",
  },
  "go-syntax-basics-comparisons-scenario": {
    stages: [
      "Classify the failure",
      "Expose the concrete types",
      "Write the intended equality",
      "Repair the exact boundary",
      "Keep the failing case",
    ],
    evidence: ["compiler error", "%T", "same business ID", "regression"],
    supports: ["trace", "code"],
    deepOutput: "same contents",
  },
};

const document = JSON.parse(fs.readFileSync(questionFile, "utf8"));
const actualSlugs = document.questions.map((question) => question.slug).sort();
const expectedSlugs = Object.keys(expected).sort();
if (JSON.stringify(actualSlugs) !== JSON.stringify(expectedSlugs)) {
  throw new Error(`Question inventory mismatch: ${actualSlugs.join(", ")}`);
}

const genericStages = /^(meaning|example|use|detail|decision|trade-off|reproduce|trace|prevention)$/i;
let codeSupports = 0;
let deepExamples = 0;

function runGo(source, label, expectedOutput) {
  const tempRoot = fs.mkdtempSync(path.join(os.tmpdir(), "ie-go-comparisons-"));
  try {
    fs.writeFileSync(
      path.join(tempRoot, "go.mod"),
      "module example.com/comparisoncheck\n\ngo 1.22\n",
    );
    fs.writeFileSync(path.join(tempRoot, "main.go"), `${source.trim()}\n`);
    const result = spawnSync("go", ["run", "."], {
      cwd: tempRoot,
      encoding: "utf8",
      env: { ...process.env, GOWORK: "off" },
    });
    if (result.status !== 0) {
      throw new Error(`${label}: Go example failed\n${result.stdout}${result.stderr}`);
    }
    const output = result.stdout.trim();
    if (output !== expectedOutput) {
      throw new Error(`${label}: unexpected Go output ${JSON.stringify(output)}`);
    }
  } finally {
    fs.rmSync(tempRoot, { recursive: true, force: true });
  }
}

for (const question of document.questions) {
  const contract = expected[question.slug];
  const sections = question.answer?.sections ?? [];
  const quick = sections.find((section) => section.type === "key_points");
  const speakable = sections.find((section) => section.type === "speakable_answer");
  const deep = sections.find((section) => section.type === "deep_explanation");
  if (!quick || !speakable || !deep) throw new Error(`${question.slug}: missing one of the three learning zones`);
  if (!Array.isArray(quick.items) || quick.items.length !== 5) {
    throw new Error(`${question.slug}: Quick Revision must have five focused points`);
  }
  if (!Array.isArray(speakable.beats)) throw new Error(`${question.slug}: missing guided beats`);

  const stages = speakable.beats.map((beat) => beat.stage);
  if (JSON.stringify(stages) !== JSON.stringify(contract.stages)) {
    throw new Error(`${question.slug}: unexpected authored stages: ${stages.join(" | ")}`);
  }
  if (stages.some((stage) => genericStages.test(stage))) {
    throw new Error(`${question.slug}: generic stage survived`);
  }

  const canonical = speakable.beats.map((beat) => beat.spokenText.trim()).join("\n\n");
  if (speakable.content !== canonical) throw new Error(`${question.slug}: content/beat parity drift`);

  const supportTypes = speakable.beats
    .map((beat) => beat.support?.type)
    .filter(Boolean);
  if (JSON.stringify(supportTypes) !== JSON.stringify(contract.supports)) {
    throw new Error(`${question.slug}: expected supports ${contract.supports}, found ${supportTypes}`);
  }
  if (supportTypes.length > 2) throw new Error(`${question.slug}: too many support blocks`);

  const teachingEvidence = [
    question.direct_answer,
    ...quick.items,
    canonical,
    deep.content,
    ...speakable.beats.flatMap((beat) => [
      beat.support?.title,
      beat.support?.code,
      ...(beat.support?.items ?? []).flatMap((item) => [item.label, item.value, item.detail]),
    ]),
  ].filter(Boolean).join("\n");
  for (const token of contract.evidence) {
    if (!teachingEvidence.includes(token)) {
      throw new Error(`${question.slug}: missing question-specific evidence ${JSON.stringify(token)}`);
    }
  }

  for (const beat of speakable.beats) {
    if (beat.support?.type !== "code") continue;
    codeSupports += 1;
    runGo(
      beat.support.code,
      `${question.slug} Interview Answer support`,
      "types: []int and []int\nsame contents: true",
    );
  }

  const codeSection = sections.find((section) => section.type === "code_example");
  const match = String(codeSection?.content ?? "").match(/^```go\n([\s\S]+)\n```$/);
  if (!match) throw new Error(`${question.slug}: missing focused Go Deep Dive example`);
  const imports = match[1].includes("math.")
    ? 'import (\n    "fmt"\n    "math"\n    "slices"\n)'
    : 'import (\n    "fmt"\n    "slices"\n)';
  const runnable = `package main\n\n${imports}\n\nfunc main() {\n${match[1]}\n}`;
  runGo(runnable, `${question.slug} Deep Dive example`, contract.deepOutput);
  deepExamples += 1;
}

if (codeSupports !== 1) throw new Error(`Expected one focused runnable code support, found ${codeSupports}`);
if (deepExamples !== 5) throw new Error(`Expected five runnable Deep Dive examples, found ${deepExamples}`);
console.log("Validated 5/5 individually authored Go comparison lessons, 1 Interview support, and 5 Deep Dive examples with Go.");
