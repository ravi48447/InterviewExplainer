#!/usr/bin/env node

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const file = "content/python-backend-fresher/api-consumption-basics/query-params-and-auth/complete-qa.json";

const presentations = [
  {
    slug: "python-requests-query-params-and-auth",
    question: "How do you send query parameters and authentication with Python Requests?",
    beats: [
      {
        cue: "Separate ordinary request inputs from proof of identity",
        stage: "Query and auth differ",
        spokenText: "Query parameters describe which result the caller wants, such as a page number, limit, or filter. Authentication proves who the caller is. In Requests, those values should stay separate: ordinary URL inputs go through `params=`, while credentials use `auth=` or the authentication header required by the API.",
      },
      {
        cue: "Let Requests encode the query instead of joining URL text",
        stage: "params builds the query",
        spokenText: "A call such as `requests.get(url, params={\"page\": 2, \"status\": \"open\"})` percent-encodes the names and values and appends them to the URL. This avoids mistakes with spaces, ampersands, Unicode, repeated values, or a URL that already contains a query string.",
        support: {
          type: "trace",
          title: "Place each input in the HTTP request it belongs to",
          items: [
            {
              label: "Application filter",
              value: "page=2, status=open",
              detail: "These values change which orders are selected.",
              tone: "blue",
            },
            {
              label: "params=",
              value: "encoded query string",
              detail: "Requests builds the URL safely from Python values.",
              tone: "green",
            },
            {
              label: "Authorization",
              value: "Bearer token",
              detail: "The credential travels in the documented header, not with filters.",
              tone: "orange",
            },
            {
              label: "PreparedRequest",
              value: "URL and headers",
              detail: "The complete outbound message is ready to send.",
              tone: "neutral",
            },
          ],
        },
      },
      {
        cue: "Match the authentication argument to the server scheme",
        stage: "Auth follows the API scheme",
        spokenText: "For HTTP Basic authentication, `auth=(username, password)` is the clear shorthand. A bearer-token API normally expects `headers={\"Authorization\": f\"Bearer {token}\"}`. These forms are not interchangeable: the server contract defines the scheme and wire format. Query-string credentials should be used only when that contract leaves no safer option.",
      },
      {
        cue: "Prepare a complete request while keeping the example offline",
        stage: "Prepare before sending",
        spokenText: "The example loads its token at runtime, prepares an order request, and prints only the URL and authentication scheme. `prepare()` performs Requests' URL and header construction but sends no network traffic. A real call should also set a timeout and handle status, decoding, and response validation after dispatch.",
        support: {
          type: "code",
          title: "Prepare a filtered bearer request without sending it",
          language: "python",
          code: "import os\nimport requests\n\ndef build_orders_request(base_url: str, page: int):\n    token = os.environ[\"ORDERS_API_TOKEN\"]\n    request = requests.Request(\n        \"GET\",\n        f\"{base_url}/orders\",\n        params={\"page\": page, \"status\": \"open\"},\n        headers={\"Authorization\": f\"Bearer {token}\"},\n    )\n    return request.prepare()\n\nprepared = build_orders_request(\"https://api.example.com\", 2)\nprint(prepared.url)\nprint(prepared.headers[\"Authorization\"].split()[0])",
          caption: "Preparing exposes the encoded URL and header shape for testing without contacting an API.",
        },
        recallRule: "Put filters in params, credentials in the documented auth mechanism, and secrets outside source code.",
      },
    ],
  },
  {
    slug: "api-consumption-basics-query-params-and-auth-when-to-use",
    question: "When should credentials use auth=, the Authorization header, or a query parameter?",
    beats: [
      {
        cue: "Make the remote API contract the source of truth",
        stage: "The API contract decides",
        spokenText: "Credential placement is part of the authentication protocol, not a Python style choice. Read the API documentation and reproduce its scheme. Moving the same text between `auth=`, an `Authorization` header, and `params=` changes the HTTP message and usually makes authentication fail.",
      },
      {
        cue: "Use a Requests authentication handler for supported schemes",
        stage: "auth selects a handler",
        spokenText: "Use `auth=(user, password)` when the server documents HTTP Basic authentication. Requests turns that tuple into a Basic authorization value during request preparation. Other schemes may use an auth object, such as `HTTPDigestAuth`, because an authentication handler can calculate or modify the outgoing request rather than merely store a string.",
      },
      {
        cue: "Contrast handler-based authentication with explicit bearer headers",
        stage: "Bearer uses a header",
        spokenText: "For an OAuth-style bearer access token, the usual form is `Authorization: Bearer <token>`, supplied through `headers=` or a client library that manages token refresh. Passing that token as the username in `auth=` would create Basic authentication instead. A signed or custom scheme should use its documented client or `AuthBase` handler.",
        support: {
          type: "comparison",
          title: "Match the credential location to the documented scheme",
          items: [
            {
              label: "HTTP Basic",
              value: "auth=(user, password)",
              detail: "Requests builds the Basic Authorization value.",
              tone: "blue",
            },
            {
              label: "HTTP Digest",
              value: "HTTPDigestAuth(...)",
              detail: "A handler performs the scheme-specific exchange.",
              tone: "green",
            },
            {
              label: "Bearer token",
              value: "Authorization header",
              detail: "Send the Bearer scheme exactly as the API specifies.",
              tone: "orange",
            },
            {
              label: "Query API key",
              value: "params= only if required",
              detail: "URLs have a wider logging and history exposure surface.",
              tone: "neutral",
            },
          ],
        },
      },
      {
        cue: "Explain why a query credential is the last choice",
        stage: "Query keys are a fallback",
        spokenText: "Use a query parameter only when the API requires it. URLs commonly pass through gateway logs, monitoring tools, support traces, and browser history. HTTPS protects traffic in transit but does not stop endpoints recording the URL. Redact the field and rotate the key when the old contract cannot be changed.",
      },
      {
        cue: "Prepare two schemes to make their different wire formats visible",
        stage: "The wire format differs",
        spokenText: "The offline example prepares one Basic request and one bearer request. Both end with an `Authorization` header, but the schemes are different. This is why the decision begins with the server contract; a secret value alone does not tell Requests which authentication protocol to apply.",
        support: {
          type: "code",
          title: "Compare prepared Basic and bearer requests",
          language: "python",
          code: "import requests\n\nbasic = requests.Request(\n    \"GET\", \"https://api.example.com/private\", auth=(\"ada\", \"secret\")\n).prepare()\n\nbearer = requests.Request(\n    \"GET\",\n    \"https://api.example.com/private\",\n    headers={\"Authorization\": \"Bearer example-token\"},\n).prepare()\n\nprint(basic.headers[\"Authorization\"].split()[0])\nprint(bearer.headers[\"Authorization\"].split()[0])",
          caption: "Preparation shows the scheme names without sending either credential across a network.",
        },
        recallRule: "Follow the API scheme first; then protect storage, transport, logging, expiry, and rotation.",
      },
    ],
  },
  {
    slug: "api-consumption-basics-query-params-and-auth-common-mistake",
    question: "Why should API keys not be hard-coded or logged, and how should Python load them?",
    beats: [
      {
        cue: "Explain how a copied secret spreads beyond one visible line",
        stage: "A key spreads when copied",
        spokenText: "An API key is a credential, not application source. A hard-coded key can remain in Git history, old branches, build artifacts, container layers, backups, and developer machines after the visible line is deleted. Logging creates another copy in systems that often have broad readership and long retention.",
        support: {
          type: "trace",
          title: "Keep one controlled path from secret storage to the request",
          items: [
            {
              label: "Secret store",
              value: "protected value",
              detail: "Access policy and auditing begin at the source.",
              tone: "blue",
            },
            {
              label: "Deployment",
              value: "runtime injection",
              detail: "The process receives the value without a source-code change.",
              tone: "green",
            },
            {
              label: "Python process",
              value: "read and validate once",
              detail: "Missing or blank configuration fails clearly.",
              tone: "orange",
            },
            {
              label: "Request and logs",
              value: "attach, then redact",
              detail: "The credential is sent only where required and never printed.",
              tone: "neutral",
            },
          ],
        },
      },
      {
        cue: "Load a required runtime value and reject empty configuration",
        stage: "Load it at runtime",
        spokenText: "A deployment can inject `ORDERS_API_TOKEN`, and Python can read it with `os.getenv()`. Treat the environment as a delivery interface, not as proof that storage is secure: the platform still needs access control and rotation. Reject a missing or blank value before the application starts sending requests.",
      },
      {
        cue: "Attach the value without copying it into observability systems",
        stage: "Keep logs useful and safe",
        spokenText: "Attach the token only to the header or parameter required by the API. Logs can record the method, safe path, status, elapsed time, and server request ID without recording `Authorization`, cookies, sensitive query values, or full prepared headers. Redaction must happen before data enters the logging pipeline.",
      },
      {
        cue: "Make loading and safe inspection concrete in one offline example",
        stage: "Build without exposing",
        spokenText: "The example validates the environment value, prepares a bearer request, and prints only safe request details. It sends no traffic and never prints the token. Local development may use an ignored secret file, but a real key must not be committed inside a sample `.env` file.",
        support: {
          type: "code",
          title: "Load, validate, attach, and redact an API token",
          language: "python",
          code: "import os\nimport requests\n\ndef required_secret(name: str) -> str:\n    value = os.getenv(name, \"\").strip()\n    if not value:\n        raise RuntimeError(f\"required secret {name} is not configured\")\n    return value\n\ntoken = required_secret(\"ORDERS_API_TOKEN\")\nprepared = requests.Request(\n    \"GET\",\n    \"https://api.example.com/orders\",\n    params={\"status\": \"open\"},\n    headers={\"Authorization\": f\"Bearer {token}\"},\n).prepare()\n\nprint(prepared.method, prepared.url)\nprint(\"Authorization: [redacted]\")",
          caption: "The secret reaches the prepared header, while the program's output contains only safe metadata.",
        },
      },
      {
        cue: "Describe the first action after a credential is exposed",
        stage: "Rotate after exposure",
        spokenText: "If a key is exposed, revoke or rotate it first; deleting a line or hiding a log view does not invalidate existing copies. Then remove retained copies where practical, review access, and add a guard against recurrence. Least privilege and short lifetimes reduce the damage if prevention fails.",
        recallRule: "Inject secrets at runtime, expose them only to the request, redact them before logging, and rotate any leaked value.",
      },
    ],
  },
];

const absolutePath = path.join(repoRoot, file);
const document = JSON.parse(fs.readFileSync(absolutePath, "utf8"));
const questions = Array.isArray(document) ? document : document.questions;
if (!Array.isArray(questions) || questions.length !== presentations.length) {
  throw new Error(`Expected exactly ${presentations.length} questions in ${file}`);
}

for (const presentation of presentations) {
  const question = questions.find((candidate) => candidate.slug === presentation.slug);
  if (!question || question.question !== presentation.question) {
    throw new Error(`Question identity changed for ${presentation.slug}`);
  }

  const sections = question.answer?.sections;
  if (!Array.isArray(sections)) throw new Error(`${presentation.slug} is missing answer sections`);
  for (const requiredType of ["key_points", "speakable_answer", "deep_explanation"]) {
    if (sections.filter((section) => section.type === requiredType).length !== 1) {
      throw new Error(`${presentation.slug} needs one ${requiredType} section`);
    }
  }

  const speakable = sections.find((section) => section.type === "speakable_answer");
  speakable.answerSize = "compact";
  speakable.beats = presentation.beats;
  speakable.content = presentation.beats.map((beat) => beat.spokenText).join("\n\n");
  console.log(`Curated ${presentation.slug}`);
}

fs.writeFileSync(absolutePath, `${JSON.stringify(document, null, 2)}\n`);
