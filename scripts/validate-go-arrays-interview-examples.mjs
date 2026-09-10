#!/usr/bin/env node

import { spawnSync } from "node:child_process";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const contentPath = path.join(
  repoRoot,
  "content/go-fresher/go-syntax-basics/arrays-basics/complete-qa.json",
);

const expectedOutput = new Map([
  [
    "go-syntax-basics-arrays-basics-interview-basics",
    "inside [99 20 30]\noriginal [10 20 30]\ncopy [10 80 30]",
  ],
  [
    "go-syntax-basics-arrays-basics-when-to-use",
    "[30 40 50]\n[20 30 40]",
  ],
  [
    "go-syntax-basics-arrays-basics-common-mistake",
    "[10 20 30]\n[99 20 30]",
  ],
  [
    "go-syntax-basics-arrays-basics-compare",
    "array 1 9\nslice 9 9",
  ],
  ["go-syntax-basics-arrays-basics-scenario", null],
]);

const document = JSON.parse(fs.readFileSync(contentPath, "utf8"));
const questions = Array.isArray(document) ? document : document.questions;
if (!Array.isArray(questions) || questions.length !== expectedOutput.size) {
  throw new Error(`Expected ${expectedOutput.size} array questions`);
}

for (const question of questions) {
  if (!expectedOutput.has(question.slug)) {
    throw new Error(`Unexpected array question: ${question.slug}`);
  }

  const speaking = question.answer?.sections?.find(
    (section) => section.type === "speakable_answer",
  );
  if (!Array.isArray(speaking?.beats) || speaking.beats.length < 3 || speaking.beats.length > 5) {
    throw new Error(`${question.slug} needs three to five Interview Answer beats`);
  }

  const supports = speaking.beats.flatMap((beat) => (beat.support ? [beat.support] : []));
  if (supports.length > 2) {
    throw new Error(`${question.slug} has ${supports.length} supports; maximum is two`);
  }

  const codeSupports = supports.filter((support) => support.type === "code");
  if (codeSupports.length !== 1 || codeSupports[0].language !== "go") {
    throw new Error(`${question.slug} needs exactly one Go code support`);
  }

  const code = codeSupports[0].code.trim() + "\n";
  const tempRoot = fs.mkdtempSync(path.join(os.tmpdir(), "ie-go-arrays-"));
  try {
    fs.writeFileSync(
      path.join(tempRoot, "go.mod"),
      "module example.com/arrayscheck\n\ngo 1.22\n",
    );

    const isTest = /\bfunc\s+Test\w+\s*\(/.test(code);
    const filename = isTest ? "arrays_test.go" : "main.go";
    const sourcePath = path.join(tempRoot, filename);
    fs.writeFileSync(sourcePath, code);

    const format = spawnSync("gofmt", ["-d", sourcePath], {
      cwd: tempRoot,
      encoding: "utf8",
    });
    if (format.status !== 0 || format.stdout) {
      throw new Error(
        `${question.slug} is not gofmt-clean:\n${format.stderr || format.stdout}`,
      );
    }

    const command = isTest ? ["test", "."] : ["run", "."];
    const result = spawnSync("go", command, {
      cwd: tempRoot,
      encoding: "utf8",
      env: { ...process.env, GOWORK: "off" },
    });
    if (result.status !== 0) {
      throw new Error(
        `${question.slug} failed:\n${result.stderr || result.stdout || "unknown Go error"}`,
      );
    }

    const output = result.stdout.trim();
    const expected = expectedOutput.get(question.slug);
    if (expected !== null && output !== expected) {
      throw new Error(
        `${question.slug} output mismatch:\nexpected:\n${expected}\nactual:\n${output}`,
      );
    }

    console.log(
      `${question.slug}: PASS${output ? ` — ${output.replaceAll("\n", " | ")}` : ""}`,
    );
  } finally {
    const safePrefix = path.join(os.tmpdir(), "ie-go-arrays-");
    if (!tempRoot.startsWith(safePrefix)) {
      throw new Error(`Refusing to clean unexpected path: ${tempRoot}`);
    }
    fs.rmSync(tempRoot, { recursive: true, force: true });
  }
}
