#!/usr/bin/env node

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const file = "content/python-backend-fresher/api-consumption-basics/sessions-and-timeouts/complete-qa.json";

const presentations = [
  {
    slug: "python-requests-sessions-and-timeouts",
    question: "Why use a requests.Session and explicit timeouts, and how do you configure them?",
    beats: [
      {
        cue: "Give Session and timeout separate responsibilities",
        stage: "Reuse and waiting differ",
        spokenText: "A `requests.Session` groups related HTTP calls. It can persist cookies and shared settings such as headers or authentication, and it owns a connection pool that may reuse a connection to the same host. A timeout solves a different problem: it limits how long a network stage may wait.",
      },
      {
        cue: "Show what happens across the first and later requests",
        stage: "A Session owns the pool",
        spokenText: "The first request may need DNS lookup, a TCP connection, and TLS setup. After the response body releases that connection, a later call to the same host can reuse it. Session defaults are merged with each call, so a request can add or override a header without changing every future request.",
        support: {
          type: "trace",
          title: "Follow two related calls through one Session",
          items: [
            {
              label: "First call",
              value: "open a connection",
              detail: "The pool creates transport state for the destination.",
              tone: "blue",
            },
            {
              label: "Response consumed",
              value: "release to pool",
              detail: "The connection becomes available for reuse.",
              tone: "green",
            },
            {
              label: "Second call",
              value: "reuse when possible",
              detail: "The same host can avoid repeated connection setup.",
              tone: "orange",
            },
            {
              label: "Session closes",
              value: "adapters close",
              detail: "The owner ends the pool and cookie lifecycle.",
              tone: "neutral",
            },
          ],
        },
      },
      {
        cue: "Explain the explicit timeout tuple and its practical boundary",
        stage: "Every call needs a timeout",
        spokenText: "Requests does not set a timeout automatically, and Session has no general default-timeout property. Pass one on every network call. `timeout=(3.05, 10)` gives separate connect and read values; a single number applies to both. The read value measures socket inactivity, not the total download time.",
      },
      {
        cue: "Join shared policy and per-call limits in one owned client",
        stage: "One client, bounded calls",
        spokenText: "The example owns one Session with a context manager, sets headers once, and makes two page requests with the same explicit timeout. The function still checks every response before using its JSON. In tests, a stub Session can verify the URLs, parameters, and timeout without opening a socket.",
        support: {
          type: "code",
          title: "Fetch two pages through one bounded Session",
          language: "python",
          code: "import requests\n\ndef fetch_two_pages(base_url: str, token: str) -> list[dict]:\n    with requests.Session() as session:\n        session.headers.update({\n            \"Accept\": \"application/json\",\n            \"Authorization\": f\"Bearer {token}\",\n        })\n        orders = []\n        for page in (1, 2):\n            response = session.get(\n                f\"{base_url}/orders\",\n                params={\"page\": page},\n                timeout=(3.05, 10),\n            )\n            response.raise_for_status()\n            orders.extend(response.json())\n        return orders",
          caption: "The Session owns reusable state; each individual call still owns an explicit waiting limit.",
        },
        recallRule: "Use Session for related state and connection reuse, and set a timeout on every actual request.",
      },
    ],
  },
  {
    slug: "api-consumption-basics-sessions-and-timeouts-when-to-use",
    question: "When should a Python API client use a requests.Session instead of one-off requests?",
    beats: [
      {
        cue: "Choose from the number and relationship of the calls",
        stage: "Related calls favour Session",
        spokenText: "Use `requests.Session()` when several calls belong to one API client or workflow and benefit from shared headers, authentication, cookies, or connection reuse. For one isolated public request, `requests.get(...)` is often simpler. The remote HTTP behavior is the same; the difference is client state and lifetime.",
      },
      {
        cue: "Compare the two forms by the responsibility they introduce",
        stage: "The lifetime is the trade-off",
        spokenText: "A one-off call creates little visible state but repeats configuration when calls multiply. A Session keeps that policy together and can reuse pooled connections, but it becomes a mutable object that needs an owner. Creating a new Session for every call loses most of the reuse benefit.",
        support: {
          type: "comparison",
          title: "Match the client form to the call pattern",
          items: [
            {
              label: "One independent GET",
              value: "one-off call",
              detail: "There is no useful state to carry forward.",
              tone: "blue",
            },
            {
              label: "Several calls to one API",
              value: "owned Session",
              detail: "Defaults and pooled connections can be reused.",
              tone: "green",
            },
            {
              label: "Login and cookie flow",
              value: "owned Session",
              detail: "Cookies persist across the related requests.",
              tone: "orange",
            },
            {
              label: "Different user identities",
              value: "separate ownership",
              detail: "Do not leak cookies or credentials across callers.",
              tone: "neutral",
            },
          ],
        },
      },
      {
        cue: "Set a safe boundary around mutable headers cookies and credentials",
        stage: "State must not cross users",
        spokenText: "Keep the Session inside a clear service-client, job, or user boundary. A global Session that is mutated for different users can leak cookies or authorization headers. Per-request values may override defaults, but distant code should not casually change shared state. A `with requests.Session()` block closes it when that owner finishes.",
      },
      {
        cue: "Demonstrate a repeated call without hiding response responsibilities",
        stage: "Reuse policy, not mistakes",
        spokenText: "The example accepts an owned Session, uses it for two related pages, and keeps timeout, status checking, and JSON decoding visible on each call. A Session does not automatically add retries, a timeout, or response validation. Those rules remain explicit even when connection and header setup are shared.",
        support: {
          type: "code",
          title: "Use one owned Session for a paged API operation",
          language: "python",
          code: "import requests\n\ndef fetch_item_pages(client: requests.Session, base_url: str) -> list[dict]:\n    items = []\n    for page in (1, 2):\n        response = client.get(\n            f\"{base_url}/items\",\n            params={\"page\": page},\n            timeout=5,\n        )\n        response.raise_for_status()\n        items.extend(response.json())\n    return items\n\nwith requests.Session() as client:\n    client.headers[\"Accept\"] = \"application/json\"\n    items = fetch_item_pages(client, \"https://api.example.com\")",
          caption: "The context manager gives the shared connection and header state a visible end to its lifetime.",
        },
        recallRule: "Use a Session when related calls need reusable state; keep its ownership as narrow as that state.",
      },
    ],
  },
  {
    slug: "api-consumption-basics-sessions-and-timeouts-common-mistake",
    question: "What is the difference between connect and read timeouts in Requests?",
    beats: [
      {
        cue: "Name the two waits in the order they happen",
        stage: "Two stages can stop moving",
        spokenText: "The connect timeout limits waiting to establish a connection to a remote address. After the connection is ready and the request is sent, the read timeout limits how long Requests waits without receiving response bytes. They protect different stages, so their values often need to differ.",
        support: {
          type: "trace",
          title: "See where each timeout starts and stops",
          items: [
            {
              label: "Connect begins",
              value: "open remote connection",
              detail: "The client has not received an HTTP response yet.",
              tone: "blue",
            },
            {
              label: "Connect succeeds",
              value: "request can be sent",
              detail: "The connection wait has finished.",
              tone: "green",
            },
            {
              label: "Read begins",
              value: "wait for response bytes",
              detail: "The timer concerns gaps in data arriving from the server.",
              tone: "orange",
            },
            {
              label: "Next byte arrives",
              value: "read progress",
              detail: "Continued progress can make the full download last longer.",
              tone: "neutral",
            },
          ],
        },
      },
      {
        cue: "Show the tuple form and the exception family it can raise",
        stage: "The tuple sets both waits",
        spokenText: "With `timeout=(3.05, 10)`, the first value is the connect timeout and the second is the read timeout. An unreachable destination can raise `ConnectTimeout`; a connected server that stops delivering bytes can raise `ReadTimeout`. Both belong to the broader `Timeout` exception family.",
      },
      {
        cue: "Prevent learners from treating the values as one wall-clock deadline",
        stage: "Neither is a total deadline",
        spokenText: "A read timeout is an inactivity limit, not a maximum duration for the complete response. A long stream can continue while bytes keep arriving inside each interval. Connect time is also applied per address attempt, so a hostname with multiple addresses can take longer overall than one connect value suggests.",
      },
      {
        cue: "Keep diagnosis precise while preserving timeout ambiguity for writes",
        stage: "Handle the stage that failed",
        spokenText: "The function translates connect and read failures into different messages and leaves the original exception as the cause. Tests can inject a client that raises each exception without waiting on a network. A timed-out write is still ambiguous: the server may have completed it, so timeout handling alone does not make a retry safe.",
        support: {
          type: "code",
          title: "Report whether connection or response reading stalled",
          language: "python",
          code: "import requests\n\ndef download_report(client, url: str) -> bytes:\n    try:\n        response = client.get(url, timeout=(3.05, 10))\n        response.raise_for_status()\n        return response.content\n    except requests.exceptions.ConnectTimeout as exc:\n        raise RuntimeError(\"connection could not be established in time\") from exc\n    except requests.exceptions.ReadTimeout as exc:\n        raise RuntimeError(\"server stopped delivering response bytes in time\") from exc",
          caption: "An injected client makes both timeout paths fast and deterministic to test.",
        },
        recallRule: "Connect bounds connection attempts; read bounds gaps between response bytes; neither is a total request deadline.",
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
