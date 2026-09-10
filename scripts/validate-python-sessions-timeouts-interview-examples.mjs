#!/usr/bin/env node

import { spawnSync } from "node:child_process";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const file = "content/python-backend-fresher/api-consumption-basics/sessions-and-timeouts/complete-qa.json";

const lessons = [
  {
    slug: "python-requests-sessions-and-timeouts",
    visualType: "trace",
    harness: `
orders = fetch_two_pages("https://api.example.com", "validator-token")
print(",".join(str(order["page"]) for order in orders))
print(requests.last_session.headers["Authorization"].split()[0])
print(requests.last_session.closed)
print("|".join(f"{call['timeout'][0]}/{call['timeout'][1]}" for call in requests.calls))
`,
    output: "1,2\nBearer\nTrue\n3.05/10|3.05/10",
  },
  {
    slug: "api-consumption-basics-sessions-and-timeouts-when-to-use",
    visualType: "comparison",
    harness: `
print(",".join(str(item["page"]) for item in items))
print(requests.last_session.closed)
print(",".join(str(call["timeout"]) for call in requests.calls))
`,
    output: "1,2\nTrue\n5,5",
  },
  {
    slug: "api-consumption-basics-sessions-and-timeouts-common-mistake",
    visualType: "trace",
    harness: `
class ConnectClient:
    def get(self, url, timeout):
        raise requests.exceptions.ConnectTimeout("offline connect timeout")

class ReadClient:
    def get(self, url, timeout):
        raise requests.exceptions.ReadTimeout("offline read timeout")

class SuccessClient:
    def __init__(self):
        self.timeout = None

    def get(self, url, timeout):
        self.timeout = timeout
        return requests.Response(content=b"report-data")

for client in (ConnectClient(), ReadClient()):
    try:
        download_report(client, "https://api.example.com/report")
    except RuntimeError as error:
        print(error)

success = SuccessClient()
print(download_report(success, "https://api.example.com/report").decode())
print(success.timeout)
`,
    output:
      "connection could not be established in time\nserver stopped delivering response bytes in time\nreport-data\n(3.05, 10)",
  },
];

const requestsStub = `
calls = []
last_session = None

class ConnectTimeout(Exception):
    pass

class ReadTimeout(Exception):
    pass

class _Exceptions:
    ConnectTimeout = ConnectTimeout
    ReadTimeout = ReadTimeout

exceptions = _Exceptions()

class Response:
    def __init__(self, data=None, content=b"report-data"):
        self._data = data if data is not None else []
        self.content = content

    def raise_for_status(self):
        return None

    def json(self):
        return self._data

class Session:
    def __init__(self):
        global last_session
        self.headers = {}
        self.closed = False
        last_session = self

    def __enter__(self):
        return self

    def __exit__(self, exc_type, exc, traceback):
        self.close()

    def close(self):
        self.closed = True

    def get(self, url, params=None, timeout=None):
        page = (params or {}).get("page")
        calls.append({"url": url, "params": params, "timeout": timeout})
        return Response(data=[{"page": page}])
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
  if (words(deep?.content) < 110) {
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
    throw new Error(`${lesson.slug} needs short Python fragments at the teaching point`);
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

  const tempRoot = fs.mkdtempSync(path.join(os.tmpdir(), "ie-python-sessions-timeouts-"));
  try {
    const stubPath = path.join(tempRoot, "requests.py");
    const examplePath = path.join(tempRoot, "example.py");
    fs.writeFileSync(stubPath, requestsStub.trimStart());
    fs.writeFileSync(examplePath, `${codeSupports[0].code.trim()}\n${lesson.harness.trim()}\n`);

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
    if (output.includes("validator-token")) {
      throw new Error(`${lesson.slug} exposed its validator credential in output`);
    }
    console.log(`${lesson.slug}: PASS — ${output.replaceAll("\n", " | ")}`);
  } finally {
    const safePrefix = path.join(os.tmpdir(), "ie-python-sessions-timeouts-");
    if (!tempRoot.startsWith(safePrefix)) {
      throw new Error(`Refusing to clean unexpected path: ${tempRoot}`);
    }
    fs.rmSync(tempRoot, { recursive: true, force: true });
  }
}
