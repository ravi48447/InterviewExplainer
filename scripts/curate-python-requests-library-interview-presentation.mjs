#!/usr/bin/env node

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const questionFile = path.join(
  repoRoot,
  "content/python-backend-fresher/api-consumption-basics/requests-library-basics/complete-qa.json",
);

const presentations = {
  "python-requests-library-get-post": {
    answerSize: "standard",
    beats: [
      {
        cue: "Define Requests and keep HTTP method meaning visible",
        stage: "Requests is an HTTP client",
        spokenText: "Requests is a third-party Python package that makes synchronous HTTP client code easier to read. A GET asks for a resource representation, while a POST submits data for the server to process, often to create a resource or start an action. Requests simplifies the call syntax but does not change those HTTP meanings.",
      },
      {
        cue: "Build query parameters without joining strings by hand",
        stage: "GET uses params for queries",
        spokenText: "Use `requests.get(url, params={...}, timeout=...)` for a GET with query parameters. Requests safely encodes the names and values and appends them to the URL. The returned `Response` is separate from the request and contains the status, headers, raw bytes, decoded text, and helpers for common body formats.",
        support: {
          type: "code",
          title: "Send a filtered GET with a visible timeout",
          language: "python",
          code: "response = requests.get(\n    f\"{base_url}/users\",\n    params={\"active\": \"true\"},\n    timeout=(3.05, 10),\n)",
          caption: "`params` handles query encoding; the tuple sets separate connect and read waits.",
        },
      },
      {
        cue: "Use the body argument that matches the server contract",
        stage: "POST sends JSON or form data",
        spokenText: "Use `json={\"name\": \"Ada\"}` when the endpoint expects a JSON body. Requests serializes the dictionary and supplies the JSON content type. Use `data=...` for form fields or a deliberately prepared raw body. The API documentation decides which form is correct; the arguments are not interchangeable just because each accepts Python values.",
      },
      {
        cue: "Explain why receiving a response is not the same as success",
        stage: "Check status before the body",
        spokenText: "A `404` or `500` is still an HTTP response, so Requests normally returns a `Response` for it. Call `raise_for_status()` when those statuses should stop the operation, or branch on an expected status deliberately. Only then decode the body with `json()`, `text`, or `content` and validate the value your application needs.",
        support: {
          type: "trace",
          title: "Turn an HTTP response into a safe Python value",
          items: [
            { label: "Response", value: "status + headers + bytes", detail: "Receiving it does not prove success.", tone: "blue" },
            { label: "Status rule", value: "accept or raise", detail: "Apply the endpoint's expected outcomes.", tone: "orange" },
            { label: "Decode", value: "JSON, text, or bytes", detail: "Choose the representation the endpoint promised.", tone: "blue" },
            { label: "Validate", value: "fields and types", detail: "Protect the rest of the application from bad data.", tone: "green" },
          ],
        },
      },
      {
        cue: "Keep timeout, retry, and validation responsibility in the client",
        stage: "Convenience is not correctness",
        spokenText: "Production code still needs explicit timeouts, transport-error handling, an endpoint-specific status policy, and data validation. POST should not be retried blindly because the first attempt may already have created an effect. Requests removes repetitive HTTP plumbing; the application still owns method choice, recovery, and the meaning of the returned data.",
        recallRule: "Build the request clearly, check the response status, decode the expected body, then validate its shape.",
      },
    ],
  },
  "api-consumption-basics-requests-library-basics-when-to-use": {
    answerSize: "standard",
    beats: [
      {
        cue: "Describe the real difference as convenience versus dependency cost",
        stage: "Both send normal HTTP",
        spokenText: "Requests and `urllib.request` can both make HTTP calls. Requests is an installed third-party package with a concise API for query parameters, JSON, sessions, cookies, authentication, and responses. `urllib.request` ships with Python and exposes lower-level standard-library building blocks. Neither one changes the remote API's behavior.",
      },
      {
        cue: "Choose Requests for a client with several common HTTP needs",
        stage: "Requests fits app clients",
        spokenText: "Use Requests when the project can add a dependency and the client makes several authenticated or JSON calls. A `requests.Session` can keep shared headers, cookies, and connection reuse in one place. Its `params`, `json`, and `Response` APIs usually make application code shorter and easier to review.",
        support: {
          type: "comparison",
          title: "Choose by project constraint, not by HTTP semantics",
          items: [
            { label: "Installation", value: "Requests: dependency", detail: "`urllib.request` is already in the standard library.", tone: "blue" },
            { label: "Common API work", value: "Requests: concise", detail: "JSON, sessions, cookies, and auth need less setup.", tone: "green" },
            { label: "Tiny locked-down script", value: "urllib.request", detail: "Useful when no extra package can be installed.", tone: "orange" },
            { label: "Async workload", value: "choose another client", detail: "Both choices here are synchronous.", tone: "blue" },
          ],
        },
      },
      {
        cue: "Choose the standard library when dependency limits matter more than convenience",
        stage: "urllib fits narrow scripts",
        spokenText: "Use `urllib.request` for a small script, reusable library, or restricted environment where adding a dependency is not worthwhile. A one-call health check may need only `urlopen()` and a timeout. As authentication, sessions, JSON bodies, or repeated calls grow, the extra manual code can become harder to maintain than the dependency it avoided.",
      },
      {
        cue: "Keep shared HTTP responsibilities in both choices",
        stage: "Both need a client policy",
        spokenText: "Both libraries need timeouts, TLS verification, status handling, safe retry rules, logging, and response validation. Requests is not automatically safer, and `urllib.request` is not automatically lighter once a project rebuilds sessions and helpers around it. Highly concurrent async code should compare an async HTTP client instead of forcing either synchronous API into that design.",
      },
      {
        cue: "Make the trade-off concrete without sending network traffic",
        stage: "Compare the prepared request",
        spokenText: "The complete example prepares the same encoded GET with both libraries and sends no traffic. Requests accepts the query dictionary directly, while the standard-library version uses `urlencode` and `Request`. The final URL is the same; the difference is how much client-side setup the project wants to own.",
        support: {
          type: "code",
          title: "Prepare the same query with both libraries",
          language: "python",
          code: "prepared = requests.Request(\n    \"GET\", url, params={\"q\": \"python http\"}\n).prepare()\nquery = urlencode({\"q\": \"python http\"})\nstandard = Request(f\"{url}?{query}\", method=\"GET\")",
          caption: "Both requests describe the same HTTP GET; Requests handles more of the common setup.",
        },
        recallRule: "Use Requests for convenient application clients and urllib.request for narrow standard-library-only needs.",
      },
    ],
  },
  "api-consumption-basics-requests-library-basics-common-mistake": {
    answerSize: "standard",
    beats: [
      {
        cue: "Separate response arrival from successful application data",
        stage: "A Response is not success",
        spokenText: "A Requests `Response` proves that an HTTP response arrived. It does not prove that the operation succeeded or that the body has the expected data. A `404` and `500` are responses too. Start with the endpoint's expected status rule instead of immediately reading fields from the body.",
      },
      {
        cue: "Apply the status policy before choosing a decoder",
        stage: "Status comes before decoding",
        spokenText: "Call `raise_for_status()` when every unsuccessful status should become `HTTPError`, or branch on an expected status such as `404` when it has normal meaning. A gateway may return `502` with an HTML error page; trying `response.json()` first hides the more useful HTTP failure behind a JSON error.",
      },
      {
        cue: "Decode only when the endpoint is expected to have a body",
        stage: "Some successes have no body",
        spokenText: "A successful `204 No Content` response normally has no body, so JSON decoding is the wrong next step. When a body is expected, use `content` for bytes, `text` for decoded text, and `json()` for JSON. Content type is useful evidence, but the endpoint contract still defines what should arrive.",
        support: {
          type: "trace",
          title: "Read a response in the right order",
          items: [
            { label: "Status", value: "expected?", detail: "Handle or raise before trusting the body.", tone: "orange" },
            { label: "Body", value: "expected?", detail: "A 204 can finish without decoding.", tone: "blue" },
            { label: "Representation", value: "bytes, text, JSON", detail: "Choose the correct decoder.", tone: "blue" },
            { label: "Contract", value: "right shape?", detail: "Validate required fields and types.", tone: "green" },
          ],
        },
      },
      {
        cue: "Keep JSON parsing separate from application validation",
        stage: "JSON may have the wrong shape",
        spokenText: "`response.json()` may return a dictionary, list, string, number, Boolean, or `None`. It checks JSON syntax, not required fields. If a profile function promises a dictionary with an integer `id`, check that exact shape before returning it instead of allowing later code to fail with an unrelated key or type error.",
        support: {
          type: "code",
          title: "Check the status, decode once, then validate",
          language: "python",
          code: "response.raise_for_status()\ndata = response.json()\nif not isinstance(data, dict) or not isinstance(data.get(\"id\"), int):\n    raise ValueError(\"profile JSON is missing an integer id\")",
          caption: "Each line answers a separate question: did HTTP succeed, is the body JSON, and does it match the profile contract?",
        },
      },
      {
        cue: "Preserve useful evidence without exposing the response",
        stage: "Log context, not whole bodies",
        spokenText: "For a failed response, record useful details such as method, safe URL context, status, attempt count, and server request ID. Keep body samples small and remove tokens, personal data, and secrets. The practical rule is status first, expected body second, decoder third, and field validation last.",
        recallRule: "A response must pass status, body, decoding, and application checks before its data is safe to use.",
      },
    ],
  },
};

const document = JSON.parse(fs.readFileSync(questionFile, "utf8"));
let curated = 0;

for (const [targetSlug, presentation] of Object.entries(presentations)) {
  const matches = document.questions.filter((question) => question.slug === targetSlug);
  if (matches.length !== 1) {
    throw new Error(`Expected exactly one ${targetSlug} question, found ${matches.length}`);
  }
  const speakable = matches[0].answer?.sections?.find(
    (section) => section.type === "speakable_answer",
  );
  if (!speakable) throw new Error(`Missing speakable_answer section for ${targetSlug}`);
  speakable.answerSize = presentation.answerSize;
  speakable.beats = presentation.beats;
  speakable.content = presentation.beats.map((beat) => beat.spokenText.trim()).join("\n\n");
  curated += 1;
}

if (curated !== document.questions.length) {
  throw new Error(`Curated ${curated} of ${document.questions.length} questions`);
}

fs.writeFileSync(questionFile, `${JSON.stringify(document, null, 2)}\n`);
console.log(`Curated Interview Answer presentations for ${curated} Python Requests questions`);
