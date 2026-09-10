#!/usr/bin/env node

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const questionFile = path.join(
  repoRoot,
  "content/frontend-fresher/javascript-async-basics/fetch-api-basics/complete-qa.json",
);

const presentations = [
  {
    slug: "javascript-async-basics-fetch-api-basics-interview-basics",
    question: "How does the Fetch API send a request and read a response?",
    beats: [
      {
        cue: "Separate the HTTP envelope from its body",
        stage: "fetch returns a Response",
        spokenText: "`fetch(url, options)` starts an HTTP request and returns a Promise for a `Response`; it does not return parsed JSON. The Promise can fulfill as soon as status and headers are available, while body bytes may still be arriving. The Response therefore represents the HTTP envelope and gives code fields such as `status`, `ok`, and `headers`. The caller must still decide what that response means.",
      },
      {
        cue: "Explain how the request is described",
        stage: "Options describe the request",
        spokenText: "The options object contains the request method, headers, optional body, credentials policy, and abort signal. A JSON POST commonly uses `method: \"POST\"`, `body: JSON.stringify(data)`, and a matching `Content-Type: application/json` header. Those choices must follow the server's contract; fetch does not serialize an ordinary object body automatically.",
        support: {
          type: "trace",
          title: "Request to usable data",
          items: [
            {
              label: "Describe",
              value: "URL + options",
              detail: "Choose method, headers, body, credentials, and signal.",
              tone: "blue",
            },
            {
              label: "Receive",
              value: "Response",
              detail: "Status and headers arrive before the body is necessarily complete.",
              tone: "neutral",
            },
            {
              label: "Read",
              value: "json(), text(), blob()",
              detail: "A body reader consumes the stream asynchronously.",
              tone: "green",
            },
            {
              label: "Use",
              value: "validated data",
              detail: "Check the decoded value before the application depends on it.",
              tone: "orange",
            },
          ],
        },
      },
      {
        cue: "Demonstrate the separate body-reading step",
        stage: "The body is a second step",
        spokenText: "Choose one body reader from the response format: `response.json()` for JSON, `text()` for text, or `blob()` for binary browser data. Each returns another Promise because reading and decoding the stream takes time. JSON parsing can fail even after a successful HTTP response when the body is empty or malformed.",
        support: {
          type: "code",
          title: "Fetch, check, then decode",
          language: "javascript",
          code: "async function loadUser() {\n  const data = encodeURIComponent(JSON.stringify({ id: 7, name: \"Mina\" }));\n  const response = await fetch(\"data:application/json,\" + data);\n\n  if (!response.ok) throw new Error(`HTTP ${response.status}`);\n  const user = await response.json();\n  console.log(user.name, response.bodyUsed);\n}\n\nloadUser();",
          caption: "The Response is checked first; json() then consumes the body and produces the user object.",
        },
      },
      {
        cue: "Close with consumption and browser security boundaries",
        stage: "A body is normally read once",
        spokenText: "A response body is normally consumed once, so a second call to `response.json()` or `response.text()` fails after the first reader finishes. Use `response.clone()` before either read only when two consumers genuinely need the body; cloning is not a default for large streams. Browser fetch also follows CORS rules, so client code cannot repair missing permission headers from the server.",
        recallRule: "Fetch returns a Response first; check its HTTP fields, then read and validate the body with one matching asynchronous reader.",
      },
    ],
  },
  {
    slug: "javascript-async-basics-fetch-api-basics-when-to-use",
    question: "Why does `fetch` not reject for HTTP errors such as 404 or 500, and how should they be handled?",
    beats: [
      {
        cue: "Define why an HTTP error still fulfills fetch",
        stage: "HTTP errors still return",
        spokenText: "A 404 or 500 means the server returned a valid HTTP response whose application result is unsuccessful. Because a usable `Response` arrived, the Promise from `fetch` normally fulfills. The response carries the status, and `response.ok` is `false`; `ok` is true only for status codes from 200 through 299. This preserves headers and an error body that may explain the server's decision.",
      },
      {
        cue: "Contrast HTTP status with transport rejection",
        stage: "Rejection means no Response",
        spokenText: "Fetch rejects when it cannot produce a usable Response, for example because of a network failure, an unsupported URL scheme, cancellation, or some request-construction failures. A `try` and `catch` handles that rejection, but it does not automatically handle a fulfilled 500 Response. HTTP status needs its own explicit policy.",
        support: {
          type: "comparison",
          title: "Four separate failure layers",
          items: [
            {
              label: "Transport",
              value: "fetch rejects",
              detail: "Network, abort, or request setup prevents a usable Response.",
              tone: "orange",
            },
            {
              label: "HTTP status",
              value: "Response with ok false",
              detail: "The server responds, but the requested operation is unsuccessful.",
              tone: "blue",
            },
            {
              label: "Body decoding",
              value: "reader rejects",
              detail: "The body is empty, malformed, or decoded with the wrong reader.",
              tone: "neutral",
            },
            {
              label: "Application data",
              value: "shape is invalid",
              detail: "Decoded data still needs validation before use.",
              tone: "green",
            },
          ],
        },
      },
      {
        cue: "Show status handling without losing response context",
        stage: "Decode after status policy",
        spokenText: "A helper should inspect `response.ok` or `response.status`, read an error body only in the format promised by the API, and preserve the status in the resulting error. The focused example reads text once, reports a 404 clearly, and returns `null` for an empty successful body instead of blindly calling `json()`.",
        support: {
          type: "code",
          title: "Keep the HTTP status in the error",
          language: "javascript",
          code: "async function readJson(response) {\n  const text = await response.text();\n  if (!response.ok) {\n    throw new Error(`HTTP ${response.status}: ${text}`);\n  }\n  return text ? JSON.parse(text) : null;\n}\n\nconst response = new Response(\"missing user\", { status: 404 });\nreadJson(response).catch(error => console.log(error.message));",
          caption: "The output is HTTP 404: missing user; the valid HTTP response never becomes false success data.",
        },
      },
      {
        cue: "Connect each failure layer to a useful outcome",
        stage: "Keep failure layers separate",
        spokenText: "A UI may turn a known 404 into “User not found,” show an offline message for a network rejection, and quietly ignore an intentional abort. A malformed success body is a decoding or contract problem, not another 404. Keeping transport, status, decoding, and validation separate gives accurate logs and lets each caller choose the right recovery.",
        recallRule: "Fetch rejection means no usable Response; HTTP errors arrive as Responses and must be detected with ok or status before decoding success data.",
      },
    ],
  },
  {
    slug: "javascript-async-basics-fetch-api-basics-common-mistake",
    question: "How do `AbortController`, request cancellation, and timeouts work with `fetch`?",
    beats: [
      {
        cue: "Separate the controller action from signal notification",
        stage: "Controller owns cancellation",
        spokenText: "`AbortController` owns the cancellation action, while its `signal` carries that notification to fetch. Code creates a controller, passes `controller.signal` in the fetch options, and later calls `controller.abort()`. One signal may be shared deliberately by several operations that should be cancelled as a group. Otherwise, each independently owned request should normally have its own controller.",
        support: {
          type: "trace",
          title: "How cancellation reaches fetch",
          items: [
            {
              label: "Create",
              value: "AbortController",
              detail: "The caller owns the decision to cancel.",
              tone: "blue",
            },
            {
              label: "Pass",
              value: "controller.signal",
              detail: "Fetch and other abort-aware work listen to the signal.",
              tone: "neutral",
            },
            {
              label: "Abort",
              value: "controller.abort()",
              detail: "Navigation, UI cleanup, or timeout triggers cancellation.",
              tone: "orange",
            },
            {
              label: "Handle",
              value: "Promise rejects",
              detail: "The caller distinguishes cancellation from a genuine failure.",
              tone: "green",
            },
          ],
        },
      },
      {
        cue: "Explain rejection and the response-body boundary",
        stage: "Abort rejects the operation",
        spokenText: "When fetch observes an abort, its Promise rejects with an abort-related reason instead of returning an HTTP status. If status and headers already produced a Response but the body has not finished, aborting can also make `response.json()` or another body reader reject. Intentional navigation cancellation should usually be handled differently from an offline error.",
      },
      {
        cue: "Implement a timeout as caller-owned policy",
        stage: "Timeout is an abort policy",
        spokenText: "A timeout is not an HTTP status built into fetch; it is a policy that aborts waiting after a chosen duration. A wrapper can schedule `controller.abort()`, pass the signal to fetch, and clear the timer in `finally`. The caller can then translate that known abort into a timeout message when appropriate.",
        support: {
          type: "code",
          title: "A focused fetch timeout wrapper",
          language: "javascript",
          code: "async function fetchWithTimeout(url, ms) {\n  const controller = new AbortController();\n  const timer = setTimeout(() => controller.abort(), ms);\n\n  try {\n    return await fetch(url, { signal: controller.signal });\n  } finally {\n    clearTimeout(timer);\n  }\n}",
          caption: "The wrapper owns both the abort timer and its cleanup; the caller still decides how to present the rejection.",
        },
      },
      {
        cue: "State what browser-side cancellation cannot promise",
        stage: "Client abort cannot undo work",
        spokenText: "Cancellation is useful when a component unmounts, a search term changes, or a response is no longer needed. It stops the client from waiting and can save resources, but it cannot guarantee that a server undoes work already accepted, especially a write. Server-side idempotency and transaction rules protect that operation; AbortController only manages the client-side lifetime.",
        recallRule: "Pass a signal to fetch, abort it from the owning policy, handle the rejection distinctly, and never treat client cancellation as server rollback.",
      },
    ],
  },
];

const document = JSON.parse(fs.readFileSync(questionFile, "utf8"));
const questions = Array.isArray(document) ? document : document.questions;
if (!Array.isArray(questions)) throw new Error("Expected a question array");

for (const presentation of presentations) {
  const matches = questions.filter((question) => question.slug === presentation.slug);
  if (matches.length !== 1) {
    throw new Error(`Expected one ${presentation.slug} question, found ${matches.length}`);
  }

  const question = matches[0];
  if (question.question !== presentation.question) {
    throw new Error(`Question text changed for ${presentation.slug}`);
  }

  const sections = question.answer?.sections;
  if (!Array.isArray(sections)) throw new Error(`${presentation.slug} is missing answer sections`);
  const speakableMatches = sections.filter((section) => section.type === "speakable_answer");
  if (speakableMatches.length !== 1) {
    throw new Error(`Expected one speakable answer, found ${speakableMatches.length}`);
  }

  const speakable = speakableMatches[0];
  speakable.answerSize = "standard";
  speakable.beats = presentation.beats;
  speakable.content = presentation.beats.map((beat) => beat.spokenText).join("\n\n");
}

fs.writeFileSync(questionFile, `${JSON.stringify(document, null, 2)}\n`);
console.log(`Curated ${presentations.length} Fetch API Interview Answer presentations`);
