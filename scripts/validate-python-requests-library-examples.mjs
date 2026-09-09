#!/usr/bin/env node

import fs from "node:fs";
import path from "node:path";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const questionFile = path.join(
  repoRoot,
  "content/python-backend-fresher/api-consumption-basics/requests-library-basics/complete-qa.json",
);
const document = JSON.parse(fs.readFileSync(questionFile, "utf8"));

const requestsStub = String.raw`
import sys, types
from urllib.parse import urlencode

requests_module = types.ModuleType("requests")

class JSONDecodeError(Exception):
    pass

class PreparedRequest:
    def __init__(self, url):
        self.url = url

class Request:
    def __init__(self, method, url, params=None, **kwargs):
        self.method = method
        self.url = url
        self.params = params
    def prepare(self):
        suffix = urlencode(self.params) if self.params else ""
        return PreparedRequest(self.url + (("?" + suffix) if suffix else ""))

requests_module.Request = Request
requests_module.exceptions = types.SimpleNamespace(JSONDecodeError=JSONDecodeError)
sys.modules["requests"] = requests_module
`;

function runPython(code, label, execute) {
  const result = spawnSync(
    "python3",
    execute
      ? ["-c", `${requestsStub}\n${code}`]
      : ["-c", "import sys; compile(sys.stdin.read(), '<inline-support>', 'exec')"],
    {
      cwd: repoRoot,
      encoding: "utf8",
      input: execute ? undefined : code,
    },
  );
  if (result.status !== 0) {
    throw new Error(`${label} failed:\n${result.stderr || result.stdout}`);
  }
}

for (const question of document.questions) {
  const speakable = question.answer.sections.find(
    (section) => section.type === "speakable_answer",
  );
  for (const [index, beat] of speakable.beats.entries()) {
    if (beat.support?.type === "code") {
      runPython(beat.support.code, `${question.slug} inline support ${index + 1}`, false);
    }
  }

  const example = question.answer.sections.find(
    (section) => section.type === "code_example",
  );
  const match = String(example?.content || "").match(/```python\n([\s\S]*?)\n```/);
  if (!match) throw new Error(`${question.slug} is missing a Python code example`);
  runPython(match[1], `${question.slug} complete example`, true);
  console.log(`PASS ${question.slug}`);
}

console.log(`Validated ${document.questions.length} Python Requests examples`);
