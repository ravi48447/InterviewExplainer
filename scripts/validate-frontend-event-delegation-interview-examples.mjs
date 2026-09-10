#!/usr/bin/env node

import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";

const target = path.resolve(
  "content/frontend-fresher/browser-dom-basics/event-bubbling-delegation/complete-qa.json",
);
const document = JSON.parse(fs.readFileSync(target, "utf8"));

for (const question of document.questions ?? []) {
  const speaking = question.answer?.sections?.find(
    (section) => section.type === "speakable_answer",
  );
  assert.ok(speaking, `${question.slug}: missing Interview Answer`);
  assert.ok(speaking.beats?.length >= 4, `${question.slug}: fewer than four beats`);

  const codeSupports = speaking.beats
    .map((beat) => beat.support)
    .filter((support) => support?.type === "code");
  assert.equal(codeSupports.length, 1, `${question.slug}: expected one short code support`);
  for (const support of codeSupports) {
    assert.equal(support.language, "javascript");
    assert.doesNotThrow(
      () => new Function("event", "list", support.code),
      `${question.slug}: short code does not parse`,
    );
  }

  const fullExample = question.answer.sections.find(
    (section) => section.type === "code_example",
  );
  assert.ok(fullExample?.content.includes("```javascript"), `${question.slug}: missing full JavaScript example`);
  const code = fullExample.content.match(/```javascript\n([\s\S]*?)\n```/)?.[1];
  assert.ok(code, `${question.slug}: could not extract full example`);
  assert.doesNotThrow(
    () => new Function(code),
    `${question.slug}: full example does not parse`,
  );
}

assert.equal(document.questions?.length, 2, "Expected exactly two questions in the family");
console.log("Frontend event-delegation examples: 2/2 parsed successfully.");
