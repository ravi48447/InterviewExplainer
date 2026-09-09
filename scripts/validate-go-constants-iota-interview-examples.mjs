#!/usr/bin/env node

import { spawnSync } from "node:child_process";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const contentPath = path.join(
  repoRoot,
  "content/go-fresher/go-syntax-basics/constants-and-iota/complete-qa.json",
);
const document = JSON.parse(fs.readFileSync(contentPath, "utf8"));

for (const question of document.questions) {
  const speaking = question.answer?.sections?.find(
    (section) => section.type === "speakable_answer",
  );
  const code = speaking?.beats
    ?.map((beat) => beat.support)
    .find((support) => support?.type === "code")?.code;

  if (!code) {
    throw new Error("No Interview Answer code support found for " + question.slug);
  }

  const tempRoot = fs.mkdtempSync(path.join(os.tmpdir(), "ie-go-iota-"));
  try {
    fs.writeFileSync(
      path.join(tempRoot, "go.mod"),
      "module example.com/iotacheck\n\ngo 1.22\n",
    );
    const isTest = /\bfunc\s+Test\w+\s*\(/.test(code);
    const filename = isTest ? "lesson_test.go" : "main.go";
    fs.writeFileSync(path.join(tempRoot, filename), code.trim() + "\n");

    const command = isTest ? ["test", "."] : ["run", "."];
    const result = spawnSync("go", command, {
      cwd: tempRoot,
      encoding: "utf8",
      env: { ...process.env, GOWORK: "off" },
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
    const safePrefix = path.join(os.tmpdir(), "ie-go-iota-");
    if (!tempRoot.startsWith(safePrefix)) {
      throw new Error("Refusing to clean unexpected path: " + tempRoot);
    }
    fs.rmSync(tempRoot, { recursive: true, force: true });
  }
}
