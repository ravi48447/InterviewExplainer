#!/usr/bin/env node

import crypto from "node:crypto";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const methodFile = "content/java-backend-fresher/rest-api-basics/http-methods/complete-qa.json";
const statusFile = "content/java-backend-fresher/rest-api-basics/http-status-codes/complete-qa.json";

const contracts = {
  "http-methods-in-spring-boot": {
    file: methodFile,
    owner: "scripts/curate-java-fresher-http-methods-gold.mjs",
    stages: [
      "Mappings select the handler",
      "Bind each input by its source",
      "Return the HTTP outcome",
      "Mappings need semantics",
    ],
    supports: ["comparison"],
    evidence: [
      "@GetMapping",
      "@PathVariable long id",
      "@RequestBody CreateOrderRequest request",
      "ResponseEntity.created(location).body(created)",
      "persistence entities",
    ],
    questionHash: "8cad74e494223e5413678f21b9e94340c56ffb19f639352c2b874366bdba6c1d",
    directHash: "901364bc345d2aa0606e3cb8e7eea90918af61c10a2546c4956ac0eb6011cf3f",
    quickHash: "ad1e2ed48ebcf8f53ff4868e0e2e4fd841235a516e3e6f74d105b2d1d66fcab0",
    deepHash: "7ed62ac51c8e012d3973ee035b977fcf709c1483fd43aa290da8f96da4223661",
    visualHash: "179e1cd7eae491861cd1c705da0dea0f4990196f2d15b93329b8aa7aa409f0f1",
    exampleHash: "c1304f992d75f0e554cdf0a8fb14497cc3fb4eb495528ac652eb39ccd27aab12",
    exampleLanguage: "java",
  },
  "safe-http-methods": {
    file: methodFile,
    owner: "scripts/curate-java-fresher-http-methods-gold.mjs",
    stages: [
      "Safe means read-only intent",
      "Internal work can still happen",
      "Automatic reads stay harmless",
      "Safety vs idempotency",
    ],
    supports: ["comparison"],
    evidence: [
      "GET`, `HEAD`, `OPTIONS`, and `TRACE",
      "access log",
      "GET /orders/42?cancel=true",
      "POST /orders/42/cancellation",
      "PUT` and `DELETE",
    ],
    questionHash: "2316af34b36077c36ea0f91f2d64352a3a57244bb824047ff35ea5a35a069ede",
    directHash: "bedac6d04034eefa90f6ef6145b5cbaa070c8a0b5e998a867369a45c73079a93",
    quickHash: "ada07ba7c37c2a8d3ce82da4aecff6cdce3245e4eb8358e0093f488cb952315a",
    deepHash: "5258ddfcfe0cd46f2d473aceaa42da6c1d8dbca4dae994ba00270e37bcb86c7d",
    visualHash: "bee0d614f301d1bbe21157a74a303c0da163147937382ba0244860e1afbc945f",
    exampleHash: "74fd6f9e666ddd0417f8733ca413da8f4a21ad52655188f970a415ea7d31955f",
    exampleLanguage: "http",
  },
  "http-status-code-ranges": {
    file: statusFile,
    owner: "scripts/curate-java-fresher-http-status-gold.mjs",
    stages: [
      "First digit gives the class",
      "1xx continues; 2xx succeeds",
      "3xx requires another step",
      "4xx and 5xx assign the failure",
      "Exact code guides the client",
    ],
    supports: ["trace"],
    evidence: [
      "100 through 599",
      "100 Continue",
      "304 Not Modified",
      "503` is temporary unavailability",
      "{\"success\": false}",
    ],
    questionHash: "896706e73e6b4be37ed8749d37577d5ece9579970dfddcddf36942bcb59dde66",
    directHash: "c06bb44e9ba18a4702647dfe2c3ea304335accf5aa897b2686a74316506cea56",
    quickHash: "062bff7ae68a6b3d7c6b589ac671f32e00d5e498d326a770a24401fbc7695553",
    deepHash: "a58a1acfffe4e475332e4bd7340bd843af574bcf0b156020718af3efa41b2986",
    visualHash: "cd00f1e7269a1d573acbbdbc7b6e7976708834e24e331e9409de22377a786809",
    exampleHash: "1a80a3ceb7100c98cf0504260409a1dbbf31d5925ce2ca784f510a67fe292cb1",
    exampleLanguage: "http",
  },
};

const unrelatedHashes = {
  [methodFile]: {
    "http-methods-overview": "b96dc2808c9e4a84f9070ba6fa7deb220e066de41c6eafe28947a0815518751d",
    "put-vs-patch": "176697f386e2257de9afcac02ca7cd875bb5cde9ab958c4b5b014cd02333440b",
    "idempotency-in-http-methods": "da141bbce989534efba30ee5a228837a141d4e1f5150aec1ca0465205c86b37a",
  },
  [statusFile]: {
    "401-vs-403-status-codes": "bdf301ed9c9d060bed8bf0c3b0894f4058d17ea5b77a5390abc0c4f532e6fd66",
    "200-vs-201-vs-204-status-codes": "3db058f3b635f5dde4721167f58fc8b2a2a3d6c45e87d6c656ac3c534ee9b6df",
    "4xx-status-code-distinctions": "98abd5231f7ba0d37434e326074a9575932f9d8f1c4e156dd6562be96d06c4de",
    "spring-boot-error-response-design": "c652ad355b51b36c3d5ea20fc06538448c9e312834ef7fd9c9fc548a3651a848",
  },
};

function hash(value) {
  return crypto.createHash("sha256").update(JSON.stringify(value)).digest("hex");
}

function normalize(value = "") {
  return String(value)
    .toLowerCase()
    .replace(/```[\s\S]*?```/g, " ")
    .replace(/[`*_#>|~[\](){},.:;!?"']/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function words(value = "") {
  const clean = normalize(value);
  return clean ? clean.split(" ").length : 0;
}

function fence(section, language) {
  const match = String(section?.content ?? "").match(
    new RegExp("```" + language + "\\n([\\s\\S]*?)\\n```"),
  );
  if (!match) throw new Error(`${section?.title ?? "example"}: missing ${language} fence`);
  return match[1];
}

function jsonBodies(source) {
  const found = [];
  let start = -1;
  let depth = 0;
  let string = false;
  let escaped = false;
  for (let index = 0; index < source.length; index += 1) {
    const char = source[index];
    if (string) {
      if (escaped) escaped = false;
      else if (char === "\\") escaped = true;
      else if (char === '"') string = false;
      continue;
    }
    if (char === '"') string = true;
    else if (char === "{") {
      if (depth === 0) start = index;
      depth += 1;
    } else if (char === "}") {
      depth -= 1;
      if (depth < 0) throw new Error("HTTP example has an unmatched closing brace");
      if (depth === 0 && start >= 0) {
        found.push(JSON.parse(source.slice(start, index + 1)));
        start = -1;
      }
    }
  }
  if (depth !== 0 || string) throw new Error("HTTP example has incomplete JSON");
  return found;
}

function validateHttp(source, slug) {
  const starts = source
    .split("\n")
    .map((line) => line.trim())
    .filter((line) => /^(?:GET|POST|PUT|PATCH|DELETE|HEAD|OPTIONS) \S+ HTTP\/1\.1$|^HTTP\/1\.1 [1-5][0-9]{2} [A-Za-z][A-Za-z -]+$/.test(line));
  if (starts.length === 0) throw new Error(`${slug}: HTTP example has no start line`);
  const bodies = jsonBodies(source);
  if (slug === "safe-http-methods") {
    if (!starts.includes("GET /orders/42?cancel=true HTTP/1.1") || !starts.includes("POST /orders/42/cancellation HTTP/1.1")) {
      throw new Error(`${slug}: safe/unsafe request example drifted`);
    }
    if (bodies.length !== 1 || bodies[0].reason !== "customer_request") {
      throw new Error(`${slug}: cancellation JSON is invalid`);
    }
  }
  if (slug === "http-status-code-ranges") {
    if (!starts.includes("HTTP/1.1 404 Not Found") || bodies.length !== 1 || bodies[0].status !== 404) {
      throw new Error(`${slug}: 404 Problem Details example drifted`);
    }
  }
}

function latestJar(group, artifact) {
  const root = path.join(os.homedir(), ".m2/repository", group, artifact);
  if (!fs.existsSync(root)) return null;
  for (const version of fs.readdirSync(root).sort((a, b) => b.localeCompare(a, undefined, { numeric: true }))) {
    const jar = path.join(root, version, `${artifact}-${version}.jar`);
    if (fs.existsSync(jar)) return jar;
  }
  return null;
}

function compileController(source) {
  const artifacts = [
    ["org/springframework", "spring-beans"],
    ["org/springframework", "spring-core"],
    ["org/springframework", "spring-jcl"],
    ["org/springframework", "spring-web"],
    ["org/springframework", "spring-webmvc"],
    ["jakarta/validation", "jakarta.validation-api"],
  ];
  const jars = artifacts.map(([group, artifact]) => latestJar(group, artifact));
  const missing = artifacts.filter((_, index) => !jars[index]);
  if (missing.length) throw new Error(`Maven cache misses ${missing.map(([, name]) => name).join(", ")}`);
  const wrapped = [
    "import java.net.URI;",
    "import jakarta.validation.Valid;",
    "import org.springframework.http.ResponseEntity;",
    "import org.springframework.web.bind.annotation.*;",
    source,
    "record CreateOrderRequest(String productId) {}",
    "record OrderResponse(long id) {}",
    "interface OrderService {",
    "  OrderResponse create(CreateOrderRequest request);",
    "  OrderResponse find(long id);",
    "}",
  ].join("\n");
  const temp = fs.mkdtempSync(path.join(os.tmpdir(), "spring-method-example-"));
  try {
    const javaFile = path.join(temp, "Example.java");
    fs.writeFileSync(javaFile, `${wrapped}\n`);
    const result = spawnSync(
      "javac",
      ["--release", "17", "-proc:none", "-cp", jars.join(path.delimiter), javaFile],
      { encoding: "utf8", timeout: 30000 },
    );
    if (result.error || result.status !== 0) {
      throw new Error(`Spring controller example failed javac\n${result.stdout}${result.stderr}${result.error ?? ""}`);
    }
  } finally {
    fs.rmSync(temp, { recursive: true, force: true });
  }
}

const documents = new Map();
for (const file of new Set(Object.values(contracts).map((contract) => contract.file))) {
  documents.set(file, JSON.parse(fs.readFileSync(path.join(repoRoot, file), "utf8")));
}

for (const [slug, contract] of Object.entries(contracts)) {
  const question = documents.get(contract.file).find((entry) => entry.slug === slug);
  if (!question) throw new Error(`${slug}: question is missing`);
  const sections = question.answer?.sections ?? [];
  const quick = sections.find((section) => section.type === "key_points");
  const interview = sections.find((section) => section.type === "speakable_answer");
  const deep = sections.find((section) => section.type === "deep_explanation");
  const visual = sections.find((section) => ["comparison_table", "flow_diagram", "sequence_diagram"].includes(section.type));
  const example = sections.find((section) => section.type === "code_example");
  if (!quick || !interview || !deep || !visual || !example) throw new Error(`${slug}: learning zone is missing`);

  if (hash(question) !== contract.questionHash) throw new Error(`${slug}: target question drifted`);
  if (hash(question.direct_answer) !== contract.directHash) throw new Error(`${slug}: Direct Answer drifted`);
  if (hash(quick) !== contract.quickHash) throw new Error(`${slug}: Quick Revision drifted`);
  if (hash(deep) !== contract.deepHash) throw new Error(`${slug}: Deep Dive drifted`);
  if (hash(visual) !== contract.visualHash) throw new Error(`${slug}: teaching visual drifted`);
  if (hash(example) !== contract.exampleHash) throw new Error(`${slug}: complete example drifted`);
  if (question.last_updated !== "2026-09-08") throw new Error(`${slug}: stale last_updated`);

  const beats = interview.beats ?? [];
  if (interview.answerSize !== "standard" || beats.length !== contract.stages.length) {
    throw new Error(`${slug}: Interview Answer is not the expected guided article`);
  }
  if (JSON.stringify(beats.map((beat) => beat.stage)) !== JSON.stringify(contract.stages)) {
    throw new Error(`${slug}: stage sequence drifted`);
  }
  if (beats.some((beat) => words(beat.spokenText) > 90)) throw new Error(`${slug}: essay-sized beat`);
  const fallback = beats.map((beat) => beat.spokenText.trim()).join("\n\n");
  if (fallback !== interview.content) throw new Error(`${slug}: fallback content drifted from beats`);
  if (/\b(?:I would|you should say|mention this|in an interview)\b/i.test(interview.content)) {
    throw new Error(`${slug}: coaching language leaked into the answer`);
  }
  const supports = beats.map((beat) => beat.support?.type).filter(Boolean);
  if (JSON.stringify(supports) !== JSON.stringify(contract.supports) || supports.length > 2) {
    throw new Error(`${slug}: expected supports ${contract.supports}, found ${supports}`);
  }
  const evidence = beats.flatMap((beat) => [
    beat.spokenText,
    beat.support?.title,
    ...(beat.support?.items ?? []).flatMap((item) => [item.label, item.value, item.detail]),
  ]).filter(Boolean).join("\n");
  for (const fragment of contract.evidence) {
    if (!evidence.includes(fragment)) throw new Error(`${slug}: missing ${JSON.stringify(fragment)}`);
  }
  const deepParagraphs = deep.content.split(/\n\s*\n/).map(normalize).filter((part) => part.length > 80);
  const copied = deepParagraphs.find((paragraph) => normalize(interview.content).includes(paragraph));
  if (copied) throw new Error(`${slug}: Interview Answer repeats a Deep Dive paragraph`);

  const source = fence(example, contract.exampleLanguage);
  if (contract.exampleLanguage === "java") compileController(source);
  else validateHttp(source, slug);
}

for (const [file, expected] of Object.entries(unrelatedHashes)) {
  const document = documents.get(file);
  for (const [slug, expectedHash] of Object.entries(expected)) {
    const question = document.find((entry) => entry.slug === slug);
    if (!question || hash(question) !== expectedHash) throw new Error(`${slug}: unrelated question changed`);
  }
}

const before = new Map([...documents.keys()].map((file) => [file, fs.readFileSync(path.join(repoRoot, file), "utf8")]));
for (const [slug, contract] of Object.entries(contracts)) {
  const result = spawnSync(process.execPath, [path.join(repoRoot, contract.owner), slug], {
    cwd: repoRoot,
    encoding: "utf8",
    timeout: 30000,
  });
  if (result.error || result.status !== 0) {
    throw new Error(`${slug}: deterministic curator failed\n${result.stdout}${result.stderr}${result.error ?? ""}`);
  }
}
for (const [file, source] of before) {
  const after = fs.readFileSync(path.join(repoRoot, file), "utf8");
  if (after !== source) throw new Error(`${file}: targeted curator is not byte-deterministic`);
}

console.log("Validated 3/3 guided Java REST method/range lessons, one javac 17 controller, two HTTP examples, independent Deep Dives, determinism, and unrelated-question preservation.");
