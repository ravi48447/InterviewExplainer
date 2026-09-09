#!/usr/bin/env node

import { spawnSync } from "node:child_process";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const file = "content/python-backend-fresher/api-consumption-basics/query-params-and-auth/complete-qa.json";

const lessons = [
  {
    slug: "python-requests-query-params-and-auth",
    visualType: "trace",
    output: "https://api.example.com/orders?page=2&status=open\nBearer",
  },
  {
    slug: "api-consumption-basics-query-params-and-auth-when-to-use",
    visualType: "comparison",
    output: "Basic\nBearer",
  },
  {
    slug: "api-consumption-basics-query-params-and-auth-common-mistake",
    visualType: "trace",
    output: "GET https://api.example.com/orders?status=open\nAuthorization: [redacted]",
  },
];

const requestsStub = `
from base64 import b64encode
from urllib.parse import parse_qsl, urlencode, urlsplit, urlunsplit

class PreparedRequest:
    def __init__(self, method, url, headers):
        self.method = method
        self.url = url
        self.headers = headers

class Request:
    def __init__(self, method, url, params=None, headers=None, auth=None):
        self.method = method
        self.url = url
        self.params = params or {}
        self.headers = dict(headers or {})
        self.auth = auth

    def prepare(self):
        parts = urlsplit(self.url)
        query = parse_qsl(parts.query, keep_blank_values=True)
        if hasattr(self.params, "items"):
            query.extend(self.params.items())
        else:
            query.extend(self.params)
        url = urlunsplit((parts.scheme, parts.netloc, parts.path, urlencode(query, doseq=True), parts.fragment))
        headers = dict(self.headers)
        if self.auth is not None:
            user, password = self.auth
            value = b64encode(f"{user}:{password}".encode()).decode()
            headers["Authorization"] = f"Basic {value}"
        return PreparedRequest(self.method, url, headers)
`;

function words(value = "") {
  return String(value).trim().split(/\s+/).filter(Boolean).length;
}

const absolutePath = path.join(repoRoot, file);
const document = JSON.parse(fs.readFileSync(absolutePath, "utf8"));
const questions = Array.isArray(document) ? document : document.questions;
if (!Array.isArray(questions) || questions.length !== lessons.length) {
  throw new Error(`Expected exactly ${lessons.length} questions in ${file}`);
}

for (const lesson of lessons) {
  const question = questions.find((candidate) => candidate.slug === lesson.slug);
  if (!question || words(question.direct_answer) < 40) {
    throw new Error(`Missing useful direct answer or unexpected slug: ${lesson.slug}`);
  }

  const sections = question.answer?.sections;
  const quick = sections?.find((section) => section.type === "key_points");
  const speaking = sections?.find((section) => section.type === "speakable_answer");
  const deep = sections?.find((section) => section.type === "deep_explanation");
  const quickItemCount = Array.isArray(quick?.items)
    ? quick.items.length
    : (quick?.content?.match(/^\s*-\s+/gm) ?? []).length;
  if (quickItemCount < 5) throw new Error(`${lesson.slug} needs a useful Quick Revision`);
  if (words(deep?.content) < 100) {
    throw new Error(`${lesson.slug} needs an independent, substantive Deep Dive`);
  }
  if (deep.content.trim() === speaking?.content?.trim()) {
    throw new Error(`${lesson.slug} reuses the Interview Answer as its Deep Dive`);
  }
  if (!Array.isArray(speaking?.beats) || speaking.beats.length < 3 || speaking.beats.length > 5) {
    throw new Error(`${lesson.slug} needs three to five Interview Answer beats`);
  }

  const stages = speaking.beats.map((beat) => beat.stage?.trim());
  if (stages.some((stage) => !stage) || new Set(stages).size !== stages.length) {
    throw new Error(`${lesson.slug} needs unique concept headings`);
  }
  const inlineCodeCount = speaking.beats.reduce(
    (count, beat) => count + (beat.spokenText.match(/`[^`\n]+`/g) ?? []).length,
    0,
  );
  if (inlineCodeCount < 2) {
    throw new Error(`${lesson.slug} needs short Python or HTTP fragments at the teaching point`);
  }

  const supports = speaking.beats.flatMap((beat) => (beat.support ? [beat.support] : []));
  if (supports.length !== 2) throw new Error(`${lesson.slug} needs exactly two purposeful supports`);
  const codeSupports = supports.filter((support) => support.type === "code");
  if (codeSupports.length !== 1 || codeSupports[0].language !== "python") {
    throw new Error(`${lesson.slug} needs exactly one executable Python code support`);
  }
  const visualSupports = supports.filter((support) => support.type === lesson.visualType);
  if (visualSupports.length !== 1 || visualSupports[0].items?.length < 4) {
    throw new Error(`${lesson.slug} needs one useful ${lesson.visualType}`);
  }
  if (/requests\.(?:get|post|put|patch|delete)|\.send\s*\(/.test(codeSupports[0].code)) {
    throw new Error(`${lesson.slug} example must not send real network traffic`);
  }

  const tempRoot = fs.mkdtempSync(path.join(os.tmpdir(), "ie-python-query-auth-"));
  try {
    const stubPath = path.join(tempRoot, "requests.py");
    const examplePath = path.join(tempRoot, "example.py");
    fs.writeFileSync(stubPath, requestsStub.trimStart());
    fs.writeFileSync(examplePath, `${codeSupports[0].code.trim()}\n`);

    const syntax = spawnSync("python3", ["-m", "py_compile", examplePath, stubPath], {
      cwd: tempRoot,
      encoding: "utf8",
    });
    if (syntax.status !== 0) {
      throw new Error(
        `${lesson.slug} syntax failed:\n${syntax.stderr || syntax.stdout || "unknown Python error"}`,
      );
    }

    const result = spawnSync("python3", [examplePath], {
      cwd: tempRoot,
      encoding: "utf8",
      env: { ...process.env, ORDERS_API_TOKEN: "validator-secret" },
    });
    if (result.status !== 0) {
      throw new Error(
        `${lesson.slug} execution failed:\n${result.stderr || result.stdout || "unknown Python error"}`,
      );
    }

    const output = result.stdout.trim();
    if (output !== lesson.output) {
      throw new Error(
        `${lesson.slug} output mismatch:\nexpected:\n${lesson.output}\nactual:\n${output}`,
      );
    }
    if (output.includes("validator-secret")) {
      throw new Error(`${lesson.slug} exposed its validator credential in output`);
    }
    console.log(`${lesson.slug}: PASS — ${output.replaceAll("\n", " | ")}`);
  } finally {
    const safePrefix = path.join(os.tmpdir(), "ie-python-query-auth-");
    if (!tempRoot.startsWith(safePrefix)) {
      throw new Error(`Refusing to clean unexpected path: ${tempRoot}`);
    }
    fs.rmSync(tempRoot, { recursive: true, force: true });
  }
}
