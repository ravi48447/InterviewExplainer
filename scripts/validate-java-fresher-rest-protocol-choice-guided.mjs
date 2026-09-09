#!/usr/bin/env node

import crypto from "node:crypto";
import fs from "node:fs";
import path from "node:path";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const targetFile = "content/java-backend-fresher/rest-api-basics/rest-vs-soap/complete-qa.json";
const owner = "scripts/curate-java-fresher-rest-remaining-gold.mjs";

const contracts = {
  "rest-vs-soap": {
    stages: [
      "Different kinds of design",
      "REST centers on resources",
      "SOAP centers on messages",
      "Extensions are separate",
      "Choose by the environment",
    ],
    supports: ["comparison"],
    evidence: [
      "architectural style",
      "GET /customers/42",
      "Envelope",
      "GetCustomer",
      "WS-Security",
      "WSDL",
    ],
    language: "xml",
    hashes: {
      question: "913c177898471b88d7dd38938fd9a965a6069f3d59a97af789cc32688f664395",
      direct: "5751fab6437dc94c0135b41cd9781191b14c15d9add348560127b7a735efe145",
      quick: "3c1a42d9b64a910163b8a3b36b384e66365ba56a0d7cbb6e99f6b5e79e735061",
      deep: "9eb1feb06d02187439fba0b27f5a45c0bbc71628b51ee664969a23f8f6272619",
      visual: "db7a94384030808ec97338a0a20abea3644c83a7dcd0f2ee2efe195d9cbfe44e",
      example: "ffb491c0e55c3f6ac9f29f479dab2618c69c45cf182c71e5286f45fdba10befc",
    },
  },
  "graphql-vs-rest": {
    stages: [
      "GraphQL starts with schema",
      "Clients select fields",
      "REST shapes resources",
      "Flexibility has a cost",
      "Choose by data and clients",
    ],
    supports: ["comparison"],
    evidence: [
      "typed query language",
      "product { name seller { name } }",
      "GET /products/42",
      "N+1",
      "partial `data`",
      "`errors` list",
    ],
    language: "graphql",
    hashes: {
      question: "f66bf3a7537daeabbc78d21e325141bbbc778671df074466c374f71ed247217c",
      direct: "bc7fef61033d4a7413036a0d11b77cfd403465276fef22a804e438db4f6eedf3",
      quick: "c27c7e2162dce0e44d324b880a275fe04542f243db2968cbadb00bd478644503",
      deep: "a692efa9bd715fd81f2753d902c4f6d9c70eceb9e56f1221bf3bc13ed60f2b91",
      visual: "1761dc3918389a06ee4332272ad570fa0b5407de066fe43380a97135e837fd3a",
      example: "12b877fd4d93fc3c1ffcba0fba7a1e1f9486439a4eae9f15da10ba76a7069212",
    },
  },
  "choosing-the-right-api-technology": {
    stages: [
      "Start with the conversation",
      "REST for resource APIs",
      "GraphQL for selected views",
      "gRPC for controlled RPC",
      "WebSocket for two-way live",
      "Mix boundaries deliberately",
    ],
    supports: ["comparison"],
    evidence: [
      "GET /orders/42",
      "ETag",
      "unary",
      "client-streaming",
      "server-streaming",
      "bidirectional-streaming",
      "Server-Sent Events",
    ],
    language: "text",
    hashes: {
      question: "58cd7ffc434ebc4854fde9a4f7f75bf7791fd34e4e7c0a1ce4211458c114698f",
      direct: "23d795584857abd4d39e40398aa516d509a31403da4ed072c7f1a8f4618ff218",
      quick: "82ff1717d42a30f104e0906f045252aa411b1e9fa6f84d24bb886d9dd0f37924",
      deep: "997cffd9150bf2c99219e68906d7398c39a732a2c7afb37d6a7585a511c0e9de",
      visual: "33eaa39c63c2388c77b26693acdfa38006f597ff53f9b35e2311323ebdb72bbe",
      example: "5871f9871b84c70fac11844b3f39d7d53bfe9f4c75c3251ac27a36e14da7b1e9",
    },
  },
};

const unrelated = {
  "content/java-backend-fresher/rest-api-basics/json-basics/complete-qa.json": {
    "json-in-rest-apis": "5837f8be21f005256e0b32764b8a8f441a918198d503814517b8ab9dc8834609",
    "dto-vs-entity-in-rest-apis": "7e05cb9da41352c69fa06688efe00e90dba27c675b7d79c72e110df439209bbe",
  },
  "content/java-backend-fresher/rest-api-basics/rest-constraints/complete-qa.json": {
    "layered-system-constraint": "7d3cf99c9d25bba715cb0dd450d1116e3a22ce1124168d0e4592fadbfa37cf07",
  },
  "content/java-backend-fresher/rest-api-basics/what-is-rest/complete-qa.json": {
    "rest-api-vs-web-service-java-backend-interview": "9220d615b935edb5b0789ff5312489aa675d7f96a2e6ee22693837ae5ef70554",
  },
};

const hash = (value) => crypto.createHash("sha256").update(JSON.stringify(value)).digest("hex");

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

function extractFence(section, language) {
  const match = String(section?.content ?? "").match(new RegExp("```" + language + "\\n([\\s\\S]*?)\\n```"));
  if (!match) throw new Error(`${section?.title ?? "example"}: missing ${language} fence`);
  return match[1];
}

function balanced(source, pairs) {
  const stack = [];
  let quote = "";
  let escaped = false;
  for (const char of source) {
    if (quote) {
      if (escaped) escaped = false;
      else if (char === "\\") escaped = true;
      else if (char === quote) quote = "";
      continue;
    }
    if (char === '"' || char === "'") {
      quote = char;
      continue;
    }
    if (pairs[char]) stack.push(pairs[char]);
    else if (Object.values(pairs).includes(char) && stack.pop() !== char) return false;
  }
  return !quote && stack.length === 0;
}

function validateExample(language, source, slug) {
  if (language === "xml") {
    const result = spawnSync(
      "python3",
      ["-c", "import sys, xml.etree.ElementTree as ET; ET.fromstring(sys.stdin.read())"],
      { input: source, encoding: "utf8", timeout: 30000 },
    );
    if (result.error || result.status !== 0) {
      throw new Error(`${slug}: XML parse failed\n${result.stderr}${result.error ?? ""}`);
    }
    return;
  }
  if (language === "graphql") {
    if (!/^query\s+[A-Za-z_]/.test(source) || !balanced(source, { "{": "}", "(": ")" })) {
      throw new Error(`${slug}: GraphQL operation has invalid root syntax or delimiters`);
    }
    if (!/\$id:\s*ID!/.test(source) || !/reviews\(first:\s*3\)/.test(source)) {
      throw new Error(`${slug}: GraphQL example lost its variable or bounded review selection`);
    }
    return;
  }
  if (language === "text") {
    const lines = source.split("\n").map((line) => line.trim()).filter(Boolean);
    if (lines.length !== 6 || lines.some((line) => !line.includes("->"))) {
      throw new Error(`${slug}: technology-boundary example is incomplete`);
    }
    return;
  }
  throw new Error(`${slug}: unsupported example language ${language}`);
}

function validateComparison(section, slug) {
  const lines = String(section?.content ?? "").split("\n");
  if (section?.type !== "comparison_table" || lines.length < 4 || !/^\|(?:---|:?-+)/.test(lines[1])) {
    throw new Error(`${slug}: comparison table is malformed`);
  }
}

const absoluteTarget = path.join(root, targetFile);
const document = JSON.parse(fs.readFileSync(absoluteTarget, "utf8"));
if (document.length !== 3 || document.some((question) => !contracts[question.slug])) {
  throw new Error("rest-vs-soap topic no longer contains the expected three questions");
}

for (const [slug, contract] of Object.entries(contracts)) {
  const question = document.find((entry) => entry.slug === slug);
  if (!question) throw new Error(`${slug}: target question is missing`);
  const sections = question.answer?.sections ?? [];
  const quick = sections.find((section) => section.type === "key_points");
  const interview = sections.find((section) => section.type === "speakable_answer");
  const deep = sections.find((section) => section.type === "deep_explanation");
  const visual = sections.find((section) => section.type === "comparison_table");
  const example = sections.find((section) => section.type === "code_example");
  if (!quick || !interview || !deep || !visual || !example) {
    throw new Error(`${slug}: a learning zone is missing`);
  }

  const actualHashes = {
    question: hash(question),
    direct: hash(question.direct_answer),
    quick: hash(quick),
    deep: hash(deep),
    visual: hash(visual),
    example: hash(example),
  };
  for (const [zone, expected] of Object.entries(contract.hashes)) {
    if (actualHashes[zone] !== expected) throw new Error(`${slug}: ${zone} drifted`);
  }
  if (question.last_updated !== "2026-09-09") throw new Error(`${slug}: stale last_updated`);
  if (!Array.isArray(quick.items) || quick.items.length !== 5) {
    throw new Error(`${slug}: Quick Revision is not five exact points`);
  }

  const beats = interview.beats ?? [];
  if (interview.answerSize !== "standard" || beats.length !== contract.stages.length) {
    throw new Error(`${slug}: Interview Answer is not the expected guided article`);
  }
  if (JSON.stringify(beats.map((beat) => beat.stage)) !== JSON.stringify(contract.stages)) {
    throw new Error(`${slug}: stage sequence drifted`);
  }
  if (beats.some((beat) => beat.stage.length > 30 || wordCount(beat.spokenText) > 90)) {
    throw new Error(`${slug}: a heading or beat is too long for guided reading`);
  }
  const fallback = beats.map((beat) => beat.spokenText.trim()).join("\n\n");
  if (fallback !== interview.content) throw new Error(`${slug}: fallback content drifted from beats`);
  if (/\b(?:I would|you should say|mention this|in an interview)\b/i.test(interview.content)) {
    throw new Error(`${slug}: generic coaching language entered the answer`);
  }

  const supports = beats.map((beat) => beat.support?.type).filter(Boolean);
  if (supports.length > 2 || JSON.stringify(supports) !== JSON.stringify(contract.supports)) {
    throw new Error(`${slug}: expected supports ${contract.supports}, found ${supports}`);
  }
  for (const beat of beats) {
    if (beat.support && (!Array.isArray(beat.support.items) || beat.support.items.length < 2)) {
      throw new Error(`${slug}: incomplete ${beat.support.type} support`);
    }
  }
  const evidence = beats.flatMap((beat) => [
    beat.spokenText,
    beat.support?.title,
    ...(beat.support?.items ?? []).flatMap((item) => [item.label, item.value, item.detail]),
  ]).filter(Boolean).join("\n");
  for (const token of contract.evidence) {
    if (!evidence.includes(token)) throw new Error(`${slug}: missing teaching evidence ${JSON.stringify(token)}`);
  }

  const deepParagraphs = new Set(String(deep.content).split(/\n\s*\n/).map(normalized));
  if (beats.some((beat) => deepParagraphs.has(normalized(beat.spokenText)))) {
    throw new Error(`${slug}: Interview Answer copied a Deep Dive paragraph`);
  }
  validateComparison(visual, slug);
  validateExample(contract.language, extractFence(example, contract.language), slug);
}

const unrelatedFiles = new Map();
for (const [file, expectedQuestions] of Object.entries(unrelated)) {
  const absolute = path.join(root, file);
  unrelatedFiles.set(file, fs.readFileSync(absolute, "utf8"));
  const questions = JSON.parse(unrelatedFiles.get(file));
  for (const [slug, expectedHash] of Object.entries(expectedQuestions)) {
    const question = questions.find((entry) => entry.slug === slug);
    if (!question || hash(question) !== expectedHash) throw new Error(`${slug}: unrelated question drifted`);
  }
}

const before = fs.readFileSync(absoluteTarget, "utf8");
for (const slug of Object.keys(contracts)) {
  const result = spawnSync(process.execPath, [path.join(root, owner), slug], {
    cwd: root,
    encoding: "utf8",
    timeout: 30000,
  });
  if (result.error || result.status !== 0) {
    throw new Error(`${slug}: deterministic owner failed\n${result.stdout}${result.stderr}${result.error ?? ""}`);
  }
}
if (fs.readFileSync(absoluteTarget, "utf8") !== before) {
  throw new Error(`${targetFile}: targeted curator is not byte deterministic`);
}
for (const [file, original] of unrelatedFiles) {
  if (fs.readFileSync(path.join(root, file), "utf8") !== original) {
    throw new Error(`${file}: deterministic target run changed an unrelated file`);
  }
}

console.log("Validated 3/3 REST protocol-choice guided lessons, XML/GraphQL/text examples, independent Deep Dives, determinism, and four unrelated-question hashes.");
