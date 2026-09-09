#!/usr/bin/env node

import fs from "node:fs";
import path from "node:path";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const questionFile = path.join(
  repoRoot,
  "content/python-backend-fresher/api-consumption-basics/error-handling-http/complete-qa.json",
);
const document = JSON.parse(fs.readFileSync(questionFile, "utf8"));

const dependencyStub = String.raw`
import sys, types

requests_module = types.ModuleType("requests")
requests_adapters = types.ModuleType("requests.adapters")
urllib3_module = types.ModuleType("urllib3")
urllib3_util = types.ModuleType("urllib3.util")

class RequestException(Exception):
    pass
class Timeout(RequestException):
    pass
class ConnectionError(RequestException):
    pass
class HTTPError(RequestException):
    pass
class JSONDecodeError(RequestException):
    pass

class Retry:
    def __init__(self, total=0, backoff_factor=0, status_forcelist=(), allowed_methods=frozenset(), respect_retry_after_header=False):
        self.total = total
        self.backoff_factor = backoff_factor
        self.status_forcelist = status_forcelist
        self.allowed_methods = allowed_methods
        self.respect_retry_after_header = respect_retry_after_header

class HTTPAdapter:
    def __init__(self, max_retries=None):
        self.max_retries = max_retries

class Session:
    def __init__(self):
        self.adapters = {}
    def mount(self, prefix, adapter):
        self.adapters[prefix] = adapter
    def get_adapter(self, prefix):
        return self.adapters[prefix]
    def __enter__(self):
        return self
    def __exit__(self, exc_type, exc, traceback):
        return False

requests_module.Session = Session
requests_module.exceptions = types.SimpleNamespace(
    RequestException=RequestException,
    Timeout=Timeout,
    ConnectionError=ConnectionError,
    HTTPError=HTTPError,
    JSONDecodeError=JSONDecodeError,
)
requests_adapters.HTTPAdapter = HTTPAdapter
urllib3_util.Retry = Retry
sys.modules["requests"] = requests_module
sys.modules["requests.adapters"] = requests_adapters
sys.modules["urllib3"] = urllib3_module
sys.modules["urllib3.util"] = urllib3_util
`;

function runPython(code, label, execute) {
  const args = execute
    ? ["-c", `${dependencyStub}\n${code}`]
    : ["-c", "import sys; compile(sys.stdin.read(), '<inline-support>', 'exec')"];
  const result = spawnSync("python3", args, {
    cwd: repoRoot,
    encoding: "utf8",
    input: execute ? undefined : code,
  });
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

console.log(`Validated ${document.questions.length} Python HTTP error-handling examples`);
