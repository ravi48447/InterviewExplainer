#!/usr/bin/env node

import { spawnSync } from "node:child_process";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

const lessons = [
  {
    file: "content/ruby-backend-fresher/blocks-and-iterators/block-syntax-yield/complete-qa.json",
    slug: "ruby-block-syntax-yield-basics",
    output: "Result: 20\nResult: 4",
  },
  {
    file: "content/ruby-backend-fresher/blocks-and-iterators/chaining/complete-qa.json",
    slug: "ruby-method-chaining-basics",
    output: "YBUR\n1\nnil\nnil",
  },
  {
    file: "content/ruby-backend-fresher/blocks-and-iterators/enumerable-methods/complete-qa.json",
    slug: "ruby-enumerable-methods-basics",
    output: "[\"interview\"]\n[\"INTRO\", \"INTERVIEW\", \"REVIEW\"]\n\"review\"\n[1, 9, 25]",
  },
  {
    file: "content/ruby-backend-fresher/blocks-and-iterators/symbol-to-proc/complete-qa.json",
    slug: "ruby-symbol-to-proc-basics",
    output: "[\"ADA\", \"LINUS\"]\n[\"ADA\", \"LINUS\"]\n\"1f\"\n[2.35, 8.92]\n[2, 4, 6]",
  },
];

for (const lesson of lessons) {
  const absolutePath = path.join(repoRoot, lesson.file);
  const document = JSON.parse(fs.readFileSync(absolutePath, "utf8"));
  const questions = Array.isArray(document) ? document : document.questions;
  if (!Array.isArray(questions) || questions.length !== 1) {
    throw new Error(`Expected one question in ${lesson.file}`);
  }

  const question = questions[0];
  if (question.slug !== lesson.slug || !question.direct_answer?.trim()) {
    throw new Error(`Missing direct answer or unexpected slug in ${lesson.file}`);
  }

  const sections = question.answer?.sections;
  const quick = sections?.find((section) => section.type === "key_points");
  const speaking = sections?.find((section) => section.type === "speakable_answer");
  const deep = sections?.find((section) => section.type === "deep_explanation");
  const quickItemCount = Array.isArray(quick?.items)
    ? quick.items.length
    : (quick?.content?.match(/^\s*-\s+/gm) ?? []).length;
  if (quickItemCount < 4) {
    throw new Error(`${lesson.slug} needs a useful Quick Revision`);
  }
  if (!deep?.content?.trim()) {
    throw new Error(`${lesson.slug} needs a question-specific Deep Dive`);
  }
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

  const tempRoot = fs.mkdtempSync(path.join(os.tmpdir(), "ie-ruby-iterators-"));
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
    const safePrefix = path.join(os.tmpdir(), "ie-ruby-iterators-");
    if (!tempRoot.startsWith(safePrefix)) {
      throw new Error(`Refusing to clean unexpected path: ${tempRoot}`);
    }
    fs.rmSync(tempRoot, { recursive: true, force: true });
  }
}
