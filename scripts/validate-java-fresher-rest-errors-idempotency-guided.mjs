#!/usr/bin/env node

import crypto from "node:crypto";
import fs from "node:fs";
import path from "node:path";
import { execFileSync } from "node:child_process";
import { fileURLToPath } from "node:url";

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const curator = path.join(
  repoRoot,
  "scripts/curate-java-fresher-rest-remaining-gold.mjs",
);
const files = {
  apiDesign:
    "content/java-backend-fresher/rest-api-basics/api-design-basics/complete-qa.json",
  idempotency:
    "content/java-backend-fresher/rest-api-basics/idempotency/complete-qa.json",
};

const contracts = {
  "api-error-response-design": {
    file: files.apiDesign,
    questionHash: "4e3d5b75954a1d149ba16ea7d0f24a6e6d7f2a253142c023cda6f315cbf62871",
    directHash: "00b31c816634f5c97bf903a4fd608096584b744f13d199a894953725a97ce49e",
    quickHash: "ea0c64da3960ef4ac0981fddf9d9bdcc501efc3e5d22eb96e513aa77b75af314",
    deepHash: "93220625fdc374c46ff6c1099aba0220e1c08313db4ab08e63f8039aa43c4ef6",
    stages: [
      "Status gives broad meaning",
      "Problem details add meaning",
      "Validation points to fields",
      "Keep internals in logs",
      "One contract across handlers",
    ],
    support: "comparison",
    visualType: "concept_map",
    evidence: [
      "200 OK",
      "application/problem+json",
      "must match the actual HTTP status",
      "errors: [{\"field\": \"quantity\"",
      "req-83f9",
      "@RestControllerAdvice",
    ],
    httpStarts: ["HTTP/1.1 422 Unprocessable Content"],
    jsonBodies: 1,
  },
  "idempotency-in-rest-apis": {
    file: files.idempotency,
    questionHash: "04196ed04c77bf03b99f1a4bee3d59a32f352970180c4ce938e73de7776af221",
    directHash: "0d323c675ae89bd9e016b787b89ed776da98d39e427034b661eb7b32c83beaad",
    quickHash: "0158c0f79eb1749596d51a42e9f84ccdc15a8b273e83624fb8c82c4c01b22fc1",
    deepHash: "bd862d43e457f8a200258a072a8aeaa03bf5fd20072eddddc65b3f2d8dd3e73f",
    stages: [
      "Same intended effect",
      "Methods set retry defaults",
      "Responses may still differ",
      "Lost replies make retries hard",
      "A key identifies one operation",
    ],
    support: "comparison",
    visualType: "sequence_diagram",
    evidence: [
      "intended effect",
      "PUT /profiles/42",
      "204 No Content",
      "POST /payments",
      "request fingerprint",
      "optimistic locking",
    ],
    httpStarts: [
      "DELETE /subscriptions/42 HTTP/1.1",
      "HTTP/1.1 204 No Content",
      "DELETE /subscriptions/42 HTTP/1.1",
      "HTTP/1.1 404 Not Found",
    ],
    jsonBodies: 0,
  },
  "idempotency-vs-safety": {
    file: files.idempotency,
    questionHash: "6c0c6c903114737e55d7e35257657b3abad54322a119be62f8fecf8612981ac5",
    directHash: "99e277906d89a81046e8ff443fa25081f205f90dccc5f94e9fe8762814cb69c2",
    quickHash: "ac4984296c65d661ba14ccf9cb7ebfd8959c2132e0ddfab04dcd4157f560b10b",
    deepHash: "51c96660e79f0b789100297213ab826a9e819081db9b29af01cb286ccfda8d6c",
    stages: [
      "Two separate questions",
      "Safe means read-only intent",
      "Idempotent means repeatable",
      "Method groups differ",
      "Automation uses the promise",
    ],
    support: "comparison",
    visualType: "comparison_table",
    evidence: [
      "Did the client request a change?",
      "GET /orders/42?cancel=true",
      "DELETE /files/42",
      "Every safe method is also idempotent",
      "browsers, crawlers",
      "concurrent-update conflicts",
    ],
    httpStarts: [
      "GET /orders/42?cancel=true HTTP/1.1",
      "POST /orders/42/cancellation HTTP/1.1",
    ],
    jsonBodies: 1,
  },
};

const unrelatedHashes = {
  [files.apiDesign]: {
    "rest-uri-design-principles":
      "c3c25e548008a1d55109bbd2403e905446310013d989c4cb1f9a2f4ff3e49cc9",
    "rest-api-versioning-strategies":
      "a103ba82a1d0b25dfe870004451d322b0886e8a972500b5f1ae653636778be81",
    "rest-api-pagination-design":
      "3d1b51aef61ba6bd7d95ccad0f8ae4c031015afd14c81da14bb4e76f452f3f80",
  },
  [files.idempotency]: {
    "post-idempotency-in-spring-boot":
      "58df8e8d71974e51f327b7ef349ec1c1943cb0ed3b4cf5fab632cd7532b3f51d",
    "optimistic-locking-and-idempotency":
      "63868a46b25e472c39b5fa4a244416a093784f1075aac241cde2fa6e85bd0772",
    "idempotent-payment-api-design":
      "d1ac714d1bd8cc6e2375a5b9c31b212facfc0a2f021d2d4c6df51a96aeba0b73",
  },
};

function hash(value) {
  return crypto.createHash("sha256").update(JSON.stringify(value)).digest("hex");
}

function normalized(value) {
  return String(value)
    .toLowerCase()
    .replace(/[`*_#>|~\[\](){},.:;!?"']/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function wordCount(value) {
  return String(value).trim().split(/\s+/).filter(Boolean).length;
}

function load(relativeFile) {
  const document = JSON.parse(fs.readFileSync(path.join(repoRoot, relativeFile), "utf8"));
  if (!Array.isArray(document)) throw new Error(`${relativeFile}: expected a top-level array`);
  return document;
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

function validateHttp(section, contract, slug) {
  const match = String(section?.content ?? "").match(/```http\n([\s\S]*?)\n```/);
  if (!match) throw new Error(`${slug}: missing HTTP example`);
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
    throw new Error(`${slug}: expected ${contract.jsonBodies} JSON bodies, found ${bodies.length}`);
  }
  if (slug === "api-error-response-design") {
    const problem = bodies[0];
    if (
      problem.status !== 422 ||
      !String(problem.type).startsWith("https://api.example.com/problems/") ||
      !Array.isArray(problem.errors) ||
      !problem.correlationId
    ) {
      throw new Error(`${slug}: complete Problem Details example lost required teaching fields`);
    }
  }
}

const loaded = new Map(Object.values(files).map((file) => [file, load(file)]));
for (const [slug, contract] of Object.entries(contracts)) {
  const document = loaded.get(contract.file);
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
    throw new Error(`${slug}: one of the expected learning zones is missing`);
  }

  if (hash(question) !== contract.questionHash) throw new Error(`${slug}: question drifted`);
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
    throw new Error(`${slug}: unexpected stages: ${stages.join(" | ")}`);
  }
  if (new Set(stages).size !== stages.length || stages.some((stage) => stage.length > 30)) {
    throw new Error(`${slug}: stage headings are duplicated or exceed the UI contract`);
  }
  if (beats.some((beat) => wordCount(beat.spokenText) > 90)) {
    throw new Error(`${slug}: an Interview beat became an essay paragraph`);
  }
  const fallback = beats.map((beat) => beat.spokenText.trim()).join("\n\n");
  if (fallback !== interview.content) throw new Error(`${slug}: fallback drifted from beats`);

  const supports = beats.map((beat) => beat.support?.type).filter(Boolean);
  if (supports.length !== 1 || supports[0] !== contract.support) {
    throw new Error(`${slug}: expected one ${contract.support} support, found ${supports.join(", ")}`);
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
    throw new Error(`${slug}: generic coaching entered learner content`);
  }
  const deepParagraphs = deep.content.split(/\n\s*\n/).map(normalized);
  if (beats.some((beat) => deepParagraphs.includes(normalized(beat.spokenText)))) {
    throw new Error(`${slug}: Deep Dive repeats an Interview beat verbatim`);
  }
  validateHttp(code, contract, slug);
}

for (const [file, expected] of Object.entries(unrelatedHashes)) {
  const document = loaded.get(file);
  for (const [slug, expectedHash] of Object.entries(expected)) {
    const question = document.find((entry) => entry.slug === slug);
    if (!question || hash(question) !== expectedHash) {
      throw new Error(`${slug}: unrelated question drifted`);
    }
  }
}

const before = new Map(
  Object.values(files).map((file) => [file, fs.readFileSync(path.join(repoRoot, file), "utf8")]),
);
for (const slug of Object.keys(contracts)) {
  execFileSync(process.execPath, [curator, slug], { cwd: repoRoot, stdio: "pipe" });
}
for (const file of Object.values(files)) {
  const after = fs.readFileSync(path.join(repoRoot, file), "utf8");
  if (after !== before.get(file)) throw new Error(`${file}: targeted curator is not deterministic`);
}

console.log(
  "Validated 3/3 guided REST error/idempotency lessons across Direct, Quick, Interview, Deep, semantic supports, HTTP/JSON examples, determinism, and unrelated-question preservation.",
);
