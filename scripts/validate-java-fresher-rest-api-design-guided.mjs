#!/usr/bin/env node

import crypto from "node:crypto";
import fs from "node:fs";
import path from "node:path";
import { execFileSync } from "node:child_process";
import { fileURLToPath } from "node:url";

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const relativeFile =
  "content/java-backend-fresher/rest-api-basics/api-design-basics/complete-qa.json";
const targetFile = path.join(repoRoot, relativeFile);
const curator = path.join(
  repoRoot,
  "scripts/curate-java-fresher-rest-remaining-gold.mjs",
);

const contracts = {
  "rest-uri-design-principles": {
    questionHash: "c3c25e548008a1d55109bbd2403e905446310013d989c4cb1f9a2f4ff3e49cc9",
    directHash: "ab03e16726e6a38ae082bdb7f2c4b6d70c627933ba77998722cc314b2e1230c7",
    quickHash: "47d6b9ff5d7504b50ac521425b8dd5ddfd0c25b281e50049b2f189407790e288",
    deepHash: "3fb709456e39a89592e4f1f8c89c20850af2aa9096685cfc562e9f741d631b40",
    stages: [
      "Name resources, not actions",
      "Collections and members",
      "Keep relationships shallow",
      "Filtered and ordered views",
      "Stable public identifiers",
    ],
    supports: ["comparison"],
    evidence: [
      "GET /orders/42",
      "POST /orders",
      "/orders/42/items",
      "status=paid",
      "/tbl_orders",
      "not rules imposed by REST",
    ],
    visualType: "concept_map",
    httpStarts: [
      "GET /orders?status=paid&limit=20 HTTP/1.1",
      "POST /orders/42/items HTTP/1.1",
    ],
    jsonBodies: 1,
  },
  "rest-api-versioning-strategies": {
    questionHash: "a103ba82a1d0b25dfe870004451d322b0886e8a972500b5f1ae653636778be81",
    directHash: "cac8b20d193e2df393888e93c5a6ad84936302da7b6f02fed64a45566b153b00",
    quickHash: "e5324a3bcecfa0eb454c5ee4338b55d93bdff41eb5ac5c319a187e418bb7a7be",
    deepHash: "67002f138381525217a9f2a9e1c6d636f529e9926ccce44aa313660a7f72d4fc",
    stages: [
      "Protect existing clients",
      "Version only real breaks",
      "Choose one version signal",
      "Overlap, migrate, retire",
      "Every live version has a cost",
    ],
    supports: ["trace"],
    evidence: [
      "incompatible change",
      "fullName",
      "?api-version=2",
      "versioned `Accept`",
      "v1 + v2",
      "contract tests",
    ],
    visualType: "comparison_table",
    httpStarts: ["GET /orders/42 HTTP/1.1", "HTTP/1.1 200 OK"],
    jsonBodies: 1,
  },
  "rest-api-pagination-design": {
    questionHash: "3d1b51aef61ba6bd7d95ccad0f8ae4c031015afd14c81da14bb4e76f452f3f80",
    directHash: "25578bf9d20cd12d21fa105d683b15894bd3c558f8b76498ca07df9277f06992",
    quickHash: "466a3b35b4dccdf4151e98f0962d9020699dfc0e2e5b4ffa561ffad93b367ca0",
    deepHash: "a86b3992e033a08f0db1d434064e9e5cf45726a5110eeca0a50ccfee64ac2105",
    stages: [
      "A page needs an order",
      "Offset counts from the front",
      "Cursor continues after a row",
      "Return enough to continue",
      "Choose for the collection",
    ],
    supports: ["trace"],
    evidence: [
      "ORDER BY created_at DESC, id DESC",
      "offset=40&limit=20",
      "106 arrives",
      "after id 104",
      "opaque cursor",
      "frozen snapshot",
    ],
    visualType: "comparison_table",
    httpStarts: [
      "GET /orders?status=paid&limit=2&after=pg_7Qm2vK9x HTTP/1.1",
      "HTTP/1.1 200 OK",
    ],
    jsonBodies: 1,
  },
};

const unrelatedHash =
  "4e3d5b75954a1d149ba16ea7d0f24a6e6d7f2a253142c023cda6f315cbf62871";

function hash(value) {
  return crypto.createHash("sha256").update(JSON.stringify(value)).digest("hex");
}

function words(value) {
  return String(value).trim().split(/\s+/).filter(Boolean).length;
}

function normalized(value) {
  return String(value)
    .toLowerCase()
    .replace(/[`*_#>|~\[\](){},.:;!?"']/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function extractJsonBodies(source) {
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
  if (depth !== 0 || inString) throw new Error("HTTP example contains incomplete JSON");
  return bodies;
}

function validateHttpExample(section, contract, slug) {
  const match = String(section?.content ?? "").match(/```http\n([\s\S]*?)\n```/);
  if (!match) throw new Error(`${slug}: missing HTTP example fence`);
  const source = match[1];
  const starts = source
    .split("\n")
    .map((line) => line.trim())
    .filter((line) =>
      /^(?:GET|POST|PUT|PATCH|DELETE|HEAD|OPTIONS) \S+ HTTP\/1\.1$|^HTTP\/1\.1 [1-5][0-9]{2} [A-Za-z][A-Za-z -]+$/.test(
        line,
      ),
    );
  if (JSON.stringify(starts) !== JSON.stringify(contract.httpStarts)) {
    throw new Error(`${slug}: unexpected HTTP start lines: ${starts.join(" | ")}`);
  }
  const bodies = extractJsonBodies(source);
  if (bodies.length !== contract.jsonBodies) {
    throw new Error(`${slug}: expected ${contract.jsonBodies} JSON body, found ${bodies.length}`);
  }
  if (slug === "rest-api-versioning-strategies") {
    if (!source.includes("Vary: Accept") || !source.includes("Content-Type: application/vnd.example.order+json;v=2")) {
      throw new Error(`${slug}: media-type version example is missing matching response metadata`);
    }
  }
  if (slug === "rest-api-pagination-design") {
    if (/after=eyJ|nextCursor\":\"eyJ/.test(source)) {
      throw new Error(`${slug}: readable Base64 JSON is incorrectly presented as an opaque cursor`);
    }
    if (!/after=pg_[A-Za-z0-9]+/.test(source) || !/"nextCursor":"pg_[A-Za-z0-9]+"/.test(source)) {
      throw new Error(`${slug}: missing opaque continuation handles`);
    }
  }
}

function loadDocument() {
  const document = JSON.parse(fs.readFileSync(targetFile, "utf8"));
  if (!Array.isArray(document) || document.length !== 4) {
    throw new Error("API design source must contain its four original questions");
  }
  return document;
}

const document = loadDocument();
for (const [slug, contract] of Object.entries(contracts)) {
  const matches = document.filter((question) => question.slug === slug);
  if (matches.length !== 1) throw new Error(`${slug}: expected exactly one question`);
  const question = matches[0];
  const sections = question.answer?.sections ?? [];
  const quick = sections.find((section) => section.type === "key_points");
  const interview = sections.find((section) => section.type === "speakable_answer");
  const deep = sections.find((section) => section.type === "deep_explanation");
  const visual = sections.find((section) => section.type === contract.visualType);
  const code = sections.find((section) => section.type === "code_example");
  if (!quick || !interview || !deep || !visual || !code) {
    throw new Error(`${slug}: a required learning zone or semantic support is missing`);
  }

  if (hash(question) !== contract.questionHash) throw new Error(`${slug}: curated question drifted`);
  if (hash(question.direct_answer) !== contract.directHash) throw new Error(`${slug}: Direct Answer drifted`);
  if (hash(quick) !== contract.quickHash) throw new Error(`${slug}: Quick Revision drifted`);
  if (hash(deep) !== contract.deepHash) throw new Error(`${slug}: Deep Dive drifted`);
  if (question.last_updated !== "2026-09-08") throw new Error(`${slug}: stale last_updated`);

  const beats = interview.beats ?? [];
  if (interview.answerSize !== "standard" || beats.length !== contract.stages.length) {
    throw new Error(`${slug}: Interview Answer is not the expected guided article`);
  }
  const stages = beats.map((beat) => beat.stage);
  if (JSON.stringify(stages) !== JSON.stringify(contract.stages)) {
    throw new Error(`${slug}: stage sequence drifted: ${stages.join(" | ")}`);
  }
  if (new Set(stages).size !== stages.length) throw new Error(`${slug}: duplicate stage heading`);
  if (beats.some((beat) => words(beat.spokenText) > 90)) {
    throw new Error(`${slug}: an Interview beat became an essay paragraph`);
  }
  const fallback = beats.map((beat) => beat.spokenText.trim()).join("\n\n");
  if (fallback !== interview.content) throw new Error(`${slug}: fallback content drifted from beats`);

  const supports = beats.map((beat) => beat.support?.type).filter(Boolean);
  if (JSON.stringify(supports) !== JSON.stringify(contract.supports) || supports.length > 2) {
    throw new Error(`${slug}: unexpected Interview supports: ${supports.join(", ")}`);
  }
  const evidence = beats
    .flatMap((beat) => [
      beat.spokenText,
      beat.support?.title,
      ...(beat.support?.items ?? []).flatMap((item) => [item.label, item.value, item.detail]),
    ])
    .filter(Boolean)
    .join("\n");
  for (const token of contract.evidence) {
    if (!evidence.includes(token)) throw new Error(`${slug}: missing evidence ${JSON.stringify(token)}`);
  }
  if (/tell the interviewer|to stand out|a good answer should|I would begin by/i.test(evidence)) {
    throw new Error(`${slug}: generic interview coaching entered learner content`);
  }

  const deepParagraphs = deep.content.split(/\n\s*\n/).map(normalized);
  for (const beat of beats) {
    if (deepParagraphs.includes(normalized(beat.spokenText))) {
      throw new Error(`${slug}: Deep Dive repeats an Interview beat verbatim`);
    }
  }
  validateHttpExample(code, contract, slug);
}

const unrelated = document.find((question) => question.slug === "api-error-response-design");
if (!unrelated || hash(unrelated) !== unrelatedHash) {
  throw new Error("Unrelated API error-response question drifted");
}

// Re-run each narrowly scoped owner and require a byte-identical file. This
// verifies both deterministic output and preservation of the unrelated entry.
const beforeBytes = fs.readFileSync(targetFile, "utf8");
for (const slug of Object.keys(contracts)) {
  execFileSync(process.execPath, [curator, slug], { cwd: repoRoot, stdio: "pipe" });
}
const afterBytes = fs.readFileSync(targetFile, "utf8");
if (afterBytes !== beforeBytes) throw new Error("Targeted curator output is not deterministic");
const afterDocument = loadDocument();
const afterUnrelated = afterDocument.find((question) => question.slug === "api-error-response-design");
if (!afterUnrelated || hash(afterUnrelated) !== unrelatedHash) {
  throw new Error("Targeted curator changed the unrelated API error-response question");
}

console.log(
  "Validated 3/3 guided Java REST API-design lessons across Direct, Quick, Interview, Deep, semantic supports, HTTP/JSON examples, determinism, and unrelated-question preservation.",
);
