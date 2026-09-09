#!/usr/bin/env node

import crypto from "node:crypto";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const contracts = {
  "idempotency-in-http-methods": {
    file: "content/java-backend-fresher/rest-api-basics/http-methods/complete-qa.json",
    stages: [
      "Same intended effect",
      "Methods define retry defaults",
      "Retries expose the value",
      "POST can add a retry contract",
      "Deduplication must be atomic",
    ],
    supports: ["comparison"],
    evidence: ["intended effect", "DELETE /orders/42", "idempotency key", "atomically", "If-Match"],
    quickHash: "1b52a3faea81afda7209fb19d5ac6b887f6c2676b97c80b4b2afa577062ade46",
    deepHash: "af6d7213210a7698120847f41fffa1f31eddaf81108975d6f8b50e3febf126e1",
    visualType: "sequence_diagram",
    httpStarts: ["POST /payments HTTP/1.1"],
    jsonBodies: 1,
  },
  "200-vs-201-vs-204-status-codes": {
    file: "content/java-backend-fresher/rest-api-basics/http-status-codes/complete-qa.json",
    stages: [
      "Status describes this result",
      "200 returns useful content",
      "201 identifies new resources",
      "204 stops after headers",
      "One method, three outcomes",
    ],
    supports: ["trace"],
    evidence: ["GET /orders/42", "Location: /orders/42", "ETag", "202 Accepted"],
    quickHash: "9cd39e7fd89c47f542921673564d95f467a4dd8307aacc0a91eba999b57558c0",
    deepHash: "906804aa59faa3fb60d567f7d439dbceb6222285373d9ecda4521d335c269338",
    visualType: "comparison_table",
    httpStarts: ["HTTP/1.1 201 Created", "HTTP/1.1 204 No Content"],
    jsonBodies: 1,
  },
  "4xx-status-code-distinctions": {
    file: "content/java-backend-fresher/rest-api-basics/http-status-codes/complete-qa.json",
    stages: [
      "Find where processing stops",
      "400 rejects the request form",
      "404 has no disclosed target",
      "409 conflicts with state",
      "422 rejects the instructions",
      "Validation policy stays stable",
    ],
    supports: ["comparison"],
    evidence: ["415 Unsupported Media Type", "GET /orders/999", "412 Precondition Failed", "quantity: 0"],
    quickHash: "64364bbc9ea37c8ee24e528ee381911b40d7a1955164984f676d1a2d509cb1e7",
    deepHash: "b8143be97bda8420827656ddc4337e3f37f2865cdcd96fca17602c4dd3176e83",
    visualType: "flow_diagram",
    httpStarts: ["HTTP/1.1 422 Unprocessable Content"],
    jsonBodies: 1,
  },
};

function hash(value) {
  return crypto.createHash("sha256").update(JSON.stringify(value)).digest("hex");
}

function jsonBodies(source) {
  const bodies = [];
  let inString = false;
  let escaped = false;
  let depth = 0;
  let start = -1;
  for (let index = 0; index < source.length; index += 1) {
    const char = source[index];
    if (inString) {
      if (escaped) escaped = false;
      else if (char === "\\") escaped = true;
      else if (char === '"') inString = false;
      continue;
    }
    if (char === '"') {
      inString = true;
      continue;
    }
    if (char === "{") {
      if (depth === 0) start = index;
      depth += 1;
    } else if (char === "}") {
      depth -= 1;
      if (depth < 0) throw new Error("HTTP example has an unmatched closing brace");
      if (depth === 0 && start >= 0) {
        bodies.push(JSON.parse(source.slice(start, index + 1)));
        start = -1;
      }
    }
  }
  if (depth !== 0 || inString) throw new Error("HTTP example has incomplete JSON content");
  return bodies;
}

function validateHttpExample(section, contract, slug) {
  const match = String(section?.content ?? "").match(/```http\n([\s\S]*?)\n```/);
  if (!match) throw new Error(`${slug}: missing one well-formed HTTP code fence`);
  const source = match[1];
  const starts = source
    .split("\n")
    .map((line) => line.trim())
    .filter((line) => /^(?:GET|POST|PUT|PATCH|DELETE|HEAD|OPTIONS) \S+ HTTP\/1\.1$|^HTTP\/1\.1 [1-5][0-9]{2} [A-Za-z][A-Za-z -]+$/.test(line));
  if (JSON.stringify(starts) !== JSON.stringify(contract.httpStarts)) {
    throw new Error(`${slug}: unexpected HTTP start lines: ${starts.join(" | ")}`);
  }
  const parsedBodies = jsonBodies(source);
  if (parsedBodies.length !== contract.jsonBodies) {
    throw new Error(`${slug}: expected ${contract.jsonBodies} JSON bodies, found ${parsedBodies.length}`);
  }
  if (source.includes("HTTP/1.1 204 No Content")) {
    const tail = source.slice(source.indexOf("HTTP/1.1 204 No Content"));
    if (tail.includes("{")) throw new Error(`${slug}: 204 example incorrectly contains response content`);
  }
}

const loaded = new Map();
for (const [slug, contract] of Object.entries(contracts)) {
  const absoluteFile = path.join(repoRoot, contract.file);
  if (!loaded.has(absoluteFile)) loaded.set(absoluteFile, JSON.parse(fs.readFileSync(absoluteFile, "utf8")));
  const matches = loaded.get(absoluteFile).filter((question) => question.slug === slug);
  if (matches.length !== 1) throw new Error(`${slug}: expected exactly one question, found ${matches.length}`);

  const question = matches[0];
  const sections = question.answer?.sections ?? [];
  const quick = sections.find((section) => section.type === "key_points");
  const interview = sections.find((section) => section.type === "speakable_answer");
  const deep = sections.find((section) => section.type === "deep_explanation");
  const visual = sections.find((section) => section.type === contract.visualType);
  const code = sections.find((section) => section.type === "code_example");
  if (!quick || !interview || !deep || !visual || !code) {
    throw new Error(`${slug}: one of the expected teaching sections is missing`);
  }

  if (hash(quick) !== contract.quickHash) throw new Error(`${slug}: Quick Revision drifted`);
  if (hash(deep) !== contract.deepHash) throw new Error(`${slug}: Deep Dive drifted`);
  if (question.last_updated !== "2026-09-08") throw new Error(`${slug}: stale last_updated value`);
  if (interview.answerSize !== "standard" || !Array.isArray(interview.beats)) {
    throw new Error(`${slug}: Interview Answer is not the expected guided standard article`);
  }

  const stages = interview.beats.map((beat) => beat.stage);
  if (JSON.stringify(stages) !== JSON.stringify(contract.stages)) {
    throw new Error(`${slug}: unexpected stages: ${stages.join(" | ")}`);
  }
  const fallback = interview.beats.map((beat) => beat.spokenText.trim()).join("\n\n");
  if (fallback !== interview.content) throw new Error(`${slug}: fallback content drifted from beats`);

  const supports = interview.beats.map((beat) => beat.support?.type).filter(Boolean);
  if (JSON.stringify(supports) !== JSON.stringify(contract.supports) || supports.length > 2) {
    throw new Error(`${slug}: expected supports ${contract.supports}, found ${supports}`);
  }
  const evidence = interview.beats.flatMap((beat) => [
    beat.spokenText,
    beat.support?.title,
    ...(beat.support?.items ?? []).flatMap((item) => [item.label, item.value, item.detail]),
  ]).filter(Boolean).join("\n");
  for (const token of contract.evidence) {
    if (!evidence.includes(token)) throw new Error(`${slug}: missing authored evidence ${JSON.stringify(token)}`);
  }

  validateHttpExample(code, contract, slug);
}

console.log("Validated 3/3 guided HTTP method/status lessons, preserved Quick and Deep zones, and parsed all HTTP examples.");
