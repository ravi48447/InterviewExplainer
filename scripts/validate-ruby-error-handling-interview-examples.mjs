#!/usr/bin/env node

import { spawnSync } from "node:child_process";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

const lessons = [
  {
    file: "content/ruby-backend-fresher/error-handling-basics/begin-rescue-ensure/complete-qa.json",
    slug: "ruby-begin-rescue-ensure-basics",
    output: "finished \"2\"\n5\nfinished \"zero\"\n:invalid_number\nfinished \"0\"\n:cannot_divide_by_zero",
  },
  {
    file: "content/ruby-backend-fresher/error-handling-basics/begin-rescue-ensure/complete-qa.json",
    slug: "ruby-exception-hierarchy-basics",
    output: "{\"theme\"=>\"dark\"}\n{\"error\"=>\"invalid JSON\"}\ntrue\nfalse",
  },
  {
    file: "content/ruby-backend-fresher/error-handling-basics/custom-exceptions/complete-qa.json",
    slug: "ruby-custom-exceptions-basics",
    output: "requested 75, available 50\navailable=50 requested=75\nbalance=50",
  },
  {
    file: "content/ruby-backend-fresher/error-handling-basics/custom-exceptions/complete-qa.json",
    slug: "ruby-raise-and-custom-exceptions-basics",
    output: "quantity must be positive\nsame object: true\n[]",
  },
  {
    file: "content/ruby-backend-fresher/error-handling-basics/retry-pattern/complete-qa.json",
    slug: "ruby-retry-pattern-basics",
    output: "profile loaded\n3\n[0.25, 0.5]",
  },
];

const documents = new Map();
for (const lesson of lessons) {
  if (!documents.has(lesson.file)) {
    const absolutePath = path.join(repoRoot, lesson.file);
    documents.set(lesson.file, JSON.parse(fs.readFileSync(absolutePath, "utf8")));
  }

  const document = documents.get(lesson.file);
  const questions = Array.isArray(document) ? document : document.questions;
  const matches = questions.filter((question) => question.slug === lesson.slug);
  if (matches.length !== 1 || !matches[0].direct_answer?.trim()) {
    throw new Error(`Missing direct answer or unexpected slug: ${lesson.slug}`);
  }

  const sections = matches[0].answer?.sections;
  const quick = sections?.find((section) => section.type === "key_points");
  const speaking = sections?.find((section) => section.type === "speakable_answer");
  const deep = sections?.find((section) => section.type === "deep_explanation");
  const quickItemCount = Array.isArray(quick?.items)
    ? quick.items.length
    : (quick?.content?.match(/^\s*-\s+/gm) ?? []).length;
  if (quickItemCount < 4) throw new Error(`${lesson.slug} needs a useful Quick Revision`);
  if (!deep?.content?.trim()) throw new Error(`${lesson.slug} needs a specific Deep Dive`);
  if (!Array.isArray(speaking?.beats) || speaking.beats.length < 3 || speaking.beats.length > 5) {
    throw new Error(`${lesson.slug} needs three to five Interview Answer beats`);
  }

  const supports = speaking.beats.flatMap((beat) => (beat.support ? [beat.support] : []));
  if (supports.length > 2) {
    throw new Error(`${lesson.slug} has ${supports.length} supports; maximum is two`);
  }
  const codeSupports = supports.filter((support) => support.type === "code");
  if (codeSupports.length !== 1 || codeSupports[0].language !== "ruby") {
    throw new Error(`${lesson.slug} needs exactly one complete Ruby code support`);
  }

  const tempRoot = fs.mkdtempSync(path.join(os.tmpdir(), "ie-ruby-errors-"));
  try {
    const sourcePath = path.join(tempRoot, "lesson.rb");
    fs.writeFileSync(sourcePath, codeSupports[0].code.trim() + "\n");

    const syntax = spawnSync("ruby", ["-c", sourcePath], {
      cwd: tempRoot,
      encoding: "utf8",
    });
    if (syntax.status !== 0) {
      throw new Error(
        `${lesson.slug} syntax failed:\n${syntax.stderr || syntax.stdout || "unknown Ruby error"}`,
      );
    }

    const result = spawnSync("ruby", [sourcePath], {
      cwd: tempRoot,
      encoding: "utf8",
    });
    if (result.status !== 0) {
      throw new Error(
        `${lesson.slug} execution failed:\n${result.stderr || result.stdout || "unknown Ruby error"}`,
      );
    }

    const output = result.stdout.trim();
    if (output !== lesson.output) {
      throw new Error(
        `${lesson.slug} output mismatch:\nexpected:\n${lesson.output}\nactual:\n${output}`,
      );
    }
    console.log(`${lesson.slug}: PASS — ${output.replaceAll("\n", " | ")}`);
  } finally {
    const safePrefix = path.join(os.tmpdir(), "ie-ruby-errors-");
    if (!tempRoot.startsWith(safePrefix)) {
      throw new Error(`Refusing to clean unexpected path: ${tempRoot}`);
    }
    fs.rmSync(tempRoot, { recursive: true, force: true });
  }
}

const totalQuestions = [...documents.values()].reduce((total, document) => {
  const questions = Array.isArray(document) ? document : document.questions;
  return total + questions.length;
}, 0);
if (totalQuestions !== lessons.length) {
  throw new Error(`Expected ${lessons.length} total questions, found ${totalQuestions}`);
}
