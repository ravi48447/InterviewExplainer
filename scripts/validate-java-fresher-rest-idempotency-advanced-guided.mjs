#!/usr/bin/env node

import crypto from "node:crypto";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { execFileSync, spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const relativeFile =
  "content/java-backend-fresher/rest-api-basics/idempotency/complete-qa.json";
const targetFile = path.join(repoRoot, relativeFile);
const curator = path.join(
  repoRoot,
  "scripts/curate-java-fresher-rest-remaining-gold.mjs",
);

const contracts = {
  "post-idempotency-in-spring-boot": {
    questionHash: "58df8e8d71974e51f327b7ef349ec1c1943cb0ed3b4cf5fab632cd7532b3f51d",
    directHash: "859109892191a4c726e5f764713f41a948cd76abb6e7575e584b25a034d2a6f8",
    quickHash: "ad3e1634d4cc4f3f0359ec2797dbbc5ff3924a8a54a00c07e886de54af55b839",
    deepHash: "0a61ce4d12df7723aa8c2c2448084a38a948f9f4bfbe0a83f14fba05e3bff170",
    exampleHash: "99e95a870928becf4184f85a26a9d3ea3ddd52c7b1e82a141978ff7d0ff23b44",
    stages: [
      "One key, one operation",
      "Fingerprint the request",
      "Reserve before the work",
      "Concurrent calls share a gate",
      "Transactions have a boundary",
    ],
    support: "comparison",
    visualType: "flow_diagram",
    language: "java",
    evidence: [
      "authenticated account",
      "canonical fingerprint",
      "reserve(accountId, key, fingerprint)",
      "find` followed by `insert",
      "Same key + new input",
      "external payment or message broker",
    ],
  },
  "optimistic-locking-and-idempotency": {
    questionHash: "63868a46b25e472c39b5fa4a244416a093784f1075aac241cde2fa6e85bd0772",
    directHash: "b09e9e1ad4dc1043134e21afbb065b90ed745c637d48a1f73f8d3f806e2e5996",
    quickHash: "77d05328aebc2874ca19293adf4f1b23a23adb76d558c56ae227c440b834dfe6",
    deepHash: "dfa2eb617e5fa64e3cf1a1f9d7277bae7dac2a9105761a98fb92d65fcf717939",
    exampleHash: "d20aa8a3c63171c046b3a3ffedad2e5216499e2fbfc687828be83c5263ea9b74",
    stages: [
      "Two protections, two risks",
      "JPA checks the version",
      "HTTP exposes a validator",
      "Idempotency tracks a command",
      "Use both when both apply",
    ],
    support: "trace",
    visualType: "comparison_table",
    language: "http",
    evidence: [
      "@Version long version",
      "OptimisticLockException",
      "version becomes 5",
      "If-Match: \"order-v7\"",
      "412 Precondition Failed",
      "confirm-42-K",
    ],
    httpStarts: [
      "GET /orders/42 HTTP/1.1",
      "HTTP/1.1 200 OK",
      "PATCH /orders/42 HTTP/1.1",
    ],
    jsonBodies: 2,
  },
  "idempotent-payment-api-design": {
    questionHash: "d1ac714d1bd8cc6e2375a5b9c31b212facfc0a2f021d2d4c6df51a96aeba0b73",
    directHash: "0679c3b064a1d5735cfdb9931ef8cdaf6bdb267b8fc2c6f5fcbc71d4f4644cf5",
    quickHash: "ed4a14b16b65b7bef84ff110097524b8f723f59de1340ce004ab9da086f7b14b",
    deepHash: "de0f86db4fd9dca95b95bffb1b5ee61727c7d4e66d17631cdc463a58741116b0",
    exampleHash: "f5ed6490870258cf36f2e86cd18afd60cad2c229e4bfba25d5de885a1026ccbc",
    stages: [
      "Payment attempt as a resource",
      "Bind the key to the request",
      "Create local state first",
      "Reuse downstream identity",
      "Define the safety boundary",
    ],
    support: "trace",
    visualType: "sequence_diagram",
    language: "http",
    evidence: [
      "amountMinor: 1999",
      "INR 2,999",
      "payment `P-83`",
      "UNKNOWN",
      "stable provider reference",
      "never creates `P-84`",
    ],
    httpStarts: ["POST /payments HTTP/1.1", "HTTP/1.1 201 Created"],
    jsonBodies: 2,
  },
};

const unrelatedHashes = {
  "idempotency-in-rest-apis":
    "04196ed04c77bf03b99f1a4bee3d59a32f352970180c4ce938e73de7776af221",
  "idempotency-vs-safety":
    "6c0c6c903114737e55d7e35257657b3abad54322a119be62f8fecf8612981ac5",
};

function hash(value) {
  return crypto.createHash("sha256").update(JSON.stringify(value)).digest("hex");
}

function normalize(value) {
  return String(value)
    .toLowerCase()
    .replace(/[`*_#>|~\[\](){},.:;!?"']/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function words(value) {
  return String(value).trim().split(/\s+/).filter(Boolean).length;
}

function extractFence(section, expectedLanguage, slug) {
  const match = String(section?.content ?? "").match(
    /^```([a-z]+)\n([\s\S]*?)\n```(?:\n\n[\s\S]+)?$/,
  );
  if (!match || match[1] !== expectedLanguage) {
    throw new Error(`${slug}: expected one ${expectedLanguage} example fence`);
  }
  return match[2];
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

function validateHttp(source, contract, slug) {
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
  if (slug === "idempotent-payment-api-design") {
    if (
      !source.includes("Idempotency-Key:") ||
      !source.includes("Location: /payments/P-83") ||
      bodies[0].amountMinor !== 1999 ||
      bodies[1].id !== "P-83"
    ) {
      throw new Error(`${slug}: payment request/replay identity example drifted`);
    }
  }
}

function latestJar(groupPath, artifact) {
  const root = path.join(os.homedir(), ".m2/repository", groupPath, artifact);
  if (!fs.existsSync(root)) return null;
  const versions = fs
    .readdirSync(root)
    .sort((left, right) => left.localeCompare(right, undefined, { numeric: true }))
    .reverse();
  for (const version of versions) {
    const jar = path.join(root, version, `${artifact}-${version}.jar`);
    if (fs.existsSync(jar)) return jar;
  }
  return null;
}

function compileSpringExample(source) {
  const artifacts = [
    ["org/springframework", "spring-aop"],
    ["org/springframework", "spring-beans"],
    ["org/springframework", "spring-context"],
    ["org/springframework", "spring-core"],
    ["org/springframework", "spring-expression"],
    ["org/springframework", "spring-jcl"],
    ["org/springframework", "spring-tx"],
  ];
  const jars = artifacts.map(([group, artifact]) => latestJar(group, artifact));
  const missing = artifacts.filter((_, index) => !jars[index]);
  if (missing.length) {
    throw new Error(`local Maven cache misses ${missing.map(([, artifact]) => artifact).join(", ")}`);
  }
  const temp = fs.mkdtempSync(path.join(os.tmpdir(), "rest-idempotency-example-"));
  try {
    const javaFile = path.join(temp, "Example.java");
    fs.writeFileSync(javaFile, `${source}\n`);
    const result = spawnSync(
      "javac",
      ["--release", "17", "-Xlint:all", "-proc:none", "-cp", jars.join(path.delimiter), javaFile],
      { encoding: "utf8", timeout: 30000 },
    );
    if (result.error || result.status !== 0) {
      throw new Error(`Spring idempotency example failed javac\n${result.stdout}${result.stderr}${result.error ?? ""}`);
    }
  } finally {
    fs.rmSync(temp, { recursive: true, force: true });
  }
}

const document = JSON.parse(fs.readFileSync(targetFile, "utf8"));
if (!Array.isArray(document) || document.length !== 5) {
  throw new Error("Idempotency source must retain its five original questions");
}

for (const [slug, contract] of Object.entries(contracts)) {
  const question = document.find((entry) => entry.slug === slug);
  if (!question) throw new Error(`${slug}: question is missing`);
  const sections = question.answer?.sections ?? [];
  const quick = sections.find((section) => section.type === "key_points");
  const interview = sections.find((section) => section.type === "speakable_answer");
  const deep = sections.find((section) => section.type === "deep_explanation");
  const visual = sections.find((section) => section.type === contract.visualType);
  const example = sections.find((section) => section.type === "code_example");
  if (!quick || !interview || !deep || !visual || !example) {
    throw new Error(`${slug}: one of the required learning zones is missing`);
  }

  if (hash(question) !== contract.questionHash) throw new Error(`${slug}: question drifted`);
  if (hash(question.direct_answer) !== contract.directHash) throw new Error(`${slug}: Direct Answer drifted`);
  if (hash(quick) !== contract.quickHash) throw new Error(`${slug}: Quick Revision drifted`);
  if (hash(deep) !== contract.deepHash) throw new Error(`${slug}: Deep Dive drifted`);
  if (hash(example) !== contract.exampleHash) throw new Error(`${slug}: complete example drifted`);
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
  if (beats.some((beat) => words(beat.spokenText) > 90)) {
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
  const deepParagraphs = deep.content.split(/\n\s*\n/).map(normalize);
  if (beats.some((beat) => deepParagraphs.includes(normalize(beat.spokenText)))) {
    throw new Error(`${slug}: Deep Dive repeats an Interview beat verbatim`);
  }

  const source = extractFence(example, contract.language, slug);
  if (contract.language === "java") compileSpringExample(source);
  else validateHttp(source, contract, slug);
}

for (const [slug, expectedHash] of Object.entries(unrelatedHashes)) {
  const question = document.find((entry) => entry.slug === slug);
  if (!question || hash(question) !== expectedHash) throw new Error(`${slug}: unrelated question drifted`);
}

const before = fs.readFileSync(targetFile, "utf8");
for (const slug of Object.keys(contracts)) {
  execFileSync(process.execPath, [curator, slug], { cwd: repoRoot, stdio: "pipe" });
}
const after = fs.readFileSync(targetFile, "utf8");
if (after !== before) throw new Error("Targeted idempotency curator is not byte-deterministic");

console.log(
  "Validated 3/3 advanced idempotency lessons across all learning zones, supports, two HTTP examples, one javac 17 Spring example, determinism, and unrelated-question preservation.",
);
