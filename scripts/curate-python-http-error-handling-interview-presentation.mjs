#!/usr/bin/env node

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const questionFile = path.join(
  repoRoot,
  "content/python-backend-fresher/api-consumption-basics/error-handling-http/complete-qa.json",
);

const presentations = {
  "python-requests-error-handling": {
    directAnswer: "Set a timeout, handle connection and timeout errors, check the HTTP status, decode the expected body, and validate the fields your code needs. Retry only temporary failures when the request is safe to repeat, and log useful details without logging tokens or sensitive data.",
    quickItems: [
      "Always set a connect and read timeout; do not let a request wait forever.",
      "A connection error or timeout can happen before a complete response exists.",
      "Check `4xx` and `5xx` statuses before trusting or decoding the response body.",
      "Valid JSON can still be unusable when a required field is missing or has the wrong type.",
      "Retry only temporary, safely repeatable failures, and never log credentials or secret bodies.",
    ],
    deep: {
      title: "Where an API request can fail",
      content: "An HTTP call is a short pipeline, and each step can fail differently. First, the client must connect and wait for data. A DNS problem, refused connection, TLS problem, or timeout may stop the call before a complete HTTP response exists. That is why the client cannot assume that every error has a status code.\n\nIf a response arrives, its status explains the HTTP result. A `404` says the requested resource was not found, while a `503` says the service is currently unavailable. The API's rules decide which statuses are normal results and which should become errors. Only after applying that rule should the client decode the expected body. An HTML gateway page or incomplete JSON can fail at this next step.\n\nDecoded JSON still needs a simple application check. For example, an inventory client that promises to return a non-negative integer should reject `{\"quantity\": \"many\"}` instead of allowing that value to fail later in unrelated code. These field checks protect the rest of the application from a broken or changed API response.\n\nRecovery should match the failure. A small retry may help a temporary connection problem or `503`, but it will not fix bad credentials, invalid input, or malformed data. Translate low-level exceptions into a few clear client errors, keep the original exception as the cause, and record safe details such as the method, host, status, attempt number, and server request ID. Never write access tokens or sensitive response bodies to logs.",
    },
    answerSize: "standard",
    beats: [
      {
        cue: "Separate failures by the point at which the call stopped",
        stage: "Four places a call can fail",
        spokenText: "A Python API client should not treat every failure as the same error. A call can fail before a response arrives, after the server returns an unsuccessful status, while the body is being decoded, or while the decoded data is being checked. Identifying that layer tells us what evidence exists and whether recovery is possible.",
        support: {
          type: "trace",
          title: "Follow the request from connection to usable data",
          items: [
            {
              label: "Transport",
              value: "connect or wait fails",
              detail: "There may be no HTTP response or status code.",
              tone: "blue",
            },
            {
              label: "HTTP",
              value: "4xx or 5xx response",
              detail: "A response exists, but its status reports a failure.",
              tone: "orange",
            },
            {
              label: "Representation",
              value: "body will not decode",
              detail: "Bytes arrived, but they are not the expected JSON or format.",
              tone: "orange",
            },
            {
              label: "Application",
              value: "required data is wrong",
              detail: "JSON decoded, but its fields do not satisfy the client contract.",
              tone: "green",
            },
          ],
        },
      },
      {
        cue: "Put a limit on both connection and response waiting",
        stage: "Always set an explicit timeout",
        spokenText: "Requests does not add a useful overall timeout automatically, so the client should set one. In `requests.get(url, timeout=(3.05, 8))`, the first number limits connection work and the second limits how long a socket may stay silent while reading. A timeout prevents one dependency from holding the caller forever; it does not by itself prove whether a write reached the server.",
      },
      {
        cue: "Interpret the HTTP result before trusting its body",
        stage: "Check status before the body",
        spokenText: "If a response arrives, `response.raise_for_status()` turns an unsuccessful HTTP status into `HTTPError`. That is different from a connection failure because the response can provide a status, headers, and a request ID. A `404` may be a normal not-found result for one endpoint, while a `503` usually means the service is temporarily unavailable, so the API contract still decides the final policy.",
      },
      {
        cue: "Treat valid JSON and valid business data as separate checks",
        stage: "Decode, then validate data",
        spokenText: "A successful status does not guarantee usable data. `response.json()` can fail when an HTML error page or broken JSON is returned. Even valid JSON can be wrong for the application. If stock data must contain a non-negative integer `quantity`, the client should check that field instead of passing an unexpected string or missing value deeper into the program.",
        support: {
          type: "code",
          title: "Keep the useful-data check close to decoding",
          language: "python",
          code: "data = response.json()\nquantity = data.get(\"quantity\") if isinstance(data, dict) else None\nif not isinstance(quantity, int) or quantity < 0:\n    raise InventoryClientError(\"inventory quantity is invalid\")",
          caption: "Decoding answers 'is this JSON?'; validation answers 'is this the stock value this client promised to return?'.",
        },
      },
      {
        cue: "Recover only when repeating the call is both useful and safe",
        stage: "Retry only by clear rules",
        spokenText: "Retries may help a connection failure, `429`, or selected `5xx` response, but they do not repair invalid credentials, a bad request, or malformed data. Limit the attempt count and use backoff with jitter. Retry a write only when its endpoint is idempotent or uses a deduplication rule such as an idempotency key; otherwise the original call may already have changed server state.",
        recallRule: "Classify the failure first: timeout, status, decoding, and data validation need different handling.",
      },
    ],
  },
  "api-consumption-basics-error-handling-http-when-to-use": {
    directAnswer: "Retry when the failure is probably temporary and sending the same request again cannot create a second unwanted result. Connection failures, some timeouts, `429`, and selected `5xx` responses may qualify. Bad input, invalid credentials, and unsafe writes should fail or be checked before another attempt.",
    quickItems: [
      "Retry only when the problem may clear and the request is safe to repeat.",
      "GET is normally repeatable; POST needs an API-specific safeguard such as an idempotency key.",
      "`429`, `502`, `503`, and `504` are common candidates, but the endpoint rules still matter.",
      "Do not immediately retry `400`, `401`, or `403` without changing the request or credentials.",
      "Limit attempts, use backoff with jitter, honor `Retry-After`, and stay inside the caller's deadline.",
    ],
    deep: {
      title: "A safe retry is useful and repeatable",
      content: "A retry is useful only when the failure may be temporary. A dropped connection, short service outage, rate limit, or gateway failure may clear on another attempt. Invalid JSON, a bad request, or a missing permission will not become correct simply because the same call is sent again.\n\nThe second question is whether repeating the operation is safe. Reading the same product with GET normally creates no extra effect. Repeating the same PUT replacement is intended to leave the resource in the same final state. A POST that creates a payment or order is different: the first call may have succeeded even when its response was lost. Sending it again can create a duplicate unless the API supports an idempotency key or another stored request identifier.\n\nEvery retry needs a limit. Exponential backoff increases the pause after each failure, and jitter adds a small random difference so many clients do not retry at exactly the same moment. A `Retry-After` header from `429` or `503` should be respected when it fits the caller's deadline. Each attempt still needs a timeout, and the complete operation should stop when further delay is no longer useful.\n\nStatus codes are a starting point, not the whole rule. One API may use `409` for a permanent duplicate, while another may allow a retry after refreshing a version number. Use the endpoint documentation, HTTP method, failure type, and business effect together. When a write result is uncertain and no safe retry contract exists, check its status by order ID or request key instead of guessing.",
    },
    answerSize: "standard",
    beats: [
      {
        cue: "Require both a temporary failure and a repeatable operation",
        stage: "A retry needs two yes answers",
        spokenText: "Retry only when the failure is likely to be temporary and repeating the request is safe. A short network interruption or overloaded server may recover. A request with invalid input will not. Even a temporary failure should not be retried when a second attempt might create a duplicate payment, order, or message.",
      },
      {
        cue: "Use HTTP method semantics as the first safety signal",
        stage: "Method decides retry safety",
        spokenText: "GET and HEAD are safe methods, and PUT and DELETE are defined as idempotent: repeating the same request has the same intended effect as sending it once. POST is not automatically idempotent. A POST can still be made retry-safe when the API accepts an idempotency key and stores the result for that key instead of performing the action twice.",
        support: {
          type: "comparison",
          title: "Typical retry starting point by request type",
          items: [
            {
              label: "GET /products/42",
              value: "normally repeatable",
              detail: "Reading the same resource should not create another effect.",
              tone: "green",
            },
            {
              label: "PUT /profiles/42",
              value: "idempotent intent",
              detail: "Repeating the same replacement should leave the same final state.",
              tone: "blue",
            },
            {
              label: "POST /payments",
              value: "unsafe unless protected",
              detail: "Use the endpoint's idempotency-key or reconciliation design.",
              tone: "orange",
            },
          ],
        },
      },
      {
        cue: "Map common statuses to retry or correction",
        stage: "Status guides the next step",
        spokenText: "A `429` rate-limit response and selected `502`, `503`, or `504` responses are common retry candidates. A `400` needs a corrected request, while `401` normally needs valid credentials and `403` needs different permission; immediately repeating them changes nothing. If the server supplies `Retry-After`, the client should respect it when the caller's deadline allows.",
      },
      {
        cue: "Prevent retries from extending an outage or arriving together",
        stage: "Bound and spread every retry",
        spokenText: "Use a small maximum attempt count, exponential backoff, and jitter. Backoff increases the delay after repeated failures, while jitter gives clients slightly different delays so they do not all retry together. Each attempt still needs its own timeout, and the complete operation must stop when the caller's useful time budget expires.",
        support: {
          type: "code",
          title: "A retry policy for read-only catalog calls",
          language: "python",
          code: "retry = Retry(\n    total=3,\n    backoff_factor=0.5,\n    status_forcelist=(429, 502, 503, 504),\n    allowed_methods={\"GET\", \"HEAD\", \"OPTIONS\"},\n    respect_retry_after_header=True,\n)",
          caption: "The policy is deliberately limited to read-only methods and selected temporary statuses.",
        },
      },
      {
        cue: "Handle a lost response without guessing whether a write happened",
        stage: "Uncertain writes need a check",
        spokenText: "The hardest case is losing the connection after a write was sent but before its response was read. The server may already have completed the action. If the endpoint has no safe retry contract, stop and check the operation by an order ID, payment key, or status endpoint rather than blindly sending another write.",
        recallRule: "Retry only when the problem is temporary and the repeated operation cannot create a second unwanted effect.",
      },
    ],
  },
  "api-consumption-basics-error-handling-http-common-mistake": {
    directAnswer: "They describe different stages. `ConnectionError` can occur before any response arrives. `Timeout` means a configured wait expired. `HTTPError` comes from an unsuccessful response after `raise_for_status()`. `JSONDecodeError` means a body arrived but was not valid JSON. Handle each with the evidence available at that stage.",
    quickItems: [
      "`ConnectionError` may have no response or status code at all.",
      "`Timeout` means a connect or read wait expired; it is not the HTTP `408` status.",
      "`HTTPError` follows a real unsuccessful response when `raise_for_status()` is called.",
      "`JSONDecodeError` means bytes arrived but could not be decoded as JSON, even with status `200`.",
      "Catch specific Requests exceptions before the general `RequestException` fallback.",
    ],
    deep: {
      title: "Requests exceptions by failure stage",
      content: "The simplest way to understand Requests exceptions is to follow an API call from left to right. The client first opens and uses a network connection. A DNS failure, refused connection, or broken socket can raise `ConnectionError` before an HTTP response exists, so there may be no status code to read.\n\nA `Timeout` means a configured connection or read wait expired. It is a client-side waiting result, not the same thing as receiving HTTP status `408`. A complete response may be missing. With a write request, a read timeout can also leave the business result uncertain because the server may have finished the work before the client stopped waiting.\n\nWhen a response does arrive, `response.raise_for_status()` can raise `HTTPError` for an unsuccessful status. In this case the response is useful evidence: it can contain the status, headers, request ID, and a safe error message. If the status policy accepts the response, `response.json()` performs the next step. It raises `requests.exceptions.JSONDecodeError` when the received body is not valid JSON.\n\nThe order of exception handling should keep those differences. Catch `Timeout`, `ConnectionError`, `HTTPError`, and `JSONDecodeError` where they need different messages or recovery. Use `RequestException` as the final Requests-specific fallback, not the first catch that hides everything else. A small client-specific error type can preserve the original exception while exposing a clear category to the rest of the application.",
    },
    answerSize: "standard",
    beats: [
      {
        cue: "Place each exception at the stage where it is raised",
        stage: "Failures happen at stages",
        spokenText: "A connection error, timeout, HTTP status error, and JSON error do not describe the same problem. A connection can fail before HTTP begins. A timeout says a configured wait expired. An HTTP error comes from a response status. A JSON error happens after response bytes arrive but cannot be decoded as JSON.",
      },
      {
        cue: "Explain why a connection failure may have no status code",
        stage: "ConnectionError has no status",
        spokenText: "`ConnectionError` covers transport problems such as DNS failure, a refused connection, or a broken connection. Because the client may never receive an HTTP response, there may be no `status_code` to inspect. Record safe host and operation context, keep the original exception as the cause, and only retry when the request itself is safe to repeat.",
      },
      {
        cue: "Keep timeout separate from a server status",
        stage: "Timeout is an expired wait",
        spokenText: "`Timeout` means a configured connection or read wait expired; it is not an HTTP `408` status. The client may have no complete response. For a write, a read timeout can also leave the result uncertain because the server might have completed the work before the client stopped waiting.",
      },
      {
        cue: "Require a response before raising an HTTP status error",
        stage: "HTTPError has a response",
        spokenText: "`HTTPError` is normally raised by `response.raise_for_status()` after a response with an unsuccessful status such as `404` or `500`. The response is valuable evidence: inspect the status, safe headers, and a bounded body sample according to the API contract. Retry only selected temporary responses rather than every `4xx` or `5xx` result.",
        support: {
          type: "comparison",
          title: "What evidence exists for each failure",
          items: [
            {
              label: "ConnectionError",
              value: "usually no response",
              detail: "The transport did not complete the HTTP exchange.",
              tone: "blue",
            },
            {
              label: "Timeout",
              value: "wait expired",
              detail: "A complete response may not be available, and a write outcome can be unknown.",
              tone: "orange",
            },
            {
              label: "HTTPError",
              value: "response available",
              detail: "Status and safe response context can guide the policy.",
              tone: "green",
            },
            {
              label: "JSONDecodeError",
              value: "body available",
              detail: "The received representation is not valid JSON.",
              tone: "orange",
            },
          ],
        },
      },
      {
        cue: "Decode only after status handling and catch narrow exceptions first",
        stage: "JSON errors come after bytes",
        spokenText: "`response.json()` raises `requests.exceptions.JSONDecodeError` when the body is not valid JSON. This can happen even with status `200`, and valid JSON can still fail a later field check. Catch the narrow exception types before the general `RequestException` boundary so each failure keeps an accurate message and recovery rule.",
        support: {
          type: "code",
          title: "Keep the handling order specific",
          language: "python",
          code: "try:\n    response = requests.get(url, timeout=5)\n    response.raise_for_status()\n    data = response.json()\nexcept requests.exceptions.Timeout:\n    handle_timeout()\nexcept requests.exceptions.HTTPError as error:\n    handle_status(error.response.status_code)\nexcept requests.exceptions.JSONDecodeError:\n    handle_invalid_json()",
          caption: "The response status is checked before the body is decoded, and each stage keeps its own error type.",
        },
        recallRule: "Ask whether a response exists, whether its status succeeded, and whether its body decoded before choosing a recovery path.",
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

  const question = matches[0];
  const speakable = question.answer?.sections?.find(
    (section) => section.type === "speakable_answer",
  );
  if (!speakable) throw new Error(`Missing speakable_answer section for ${targetSlug}`);

  const quick = question.answer.sections.find((section) => section.type === "key_points");
  const deep = question.answer.sections.find((section) => section.type === "deep_explanation");
  if (!quick || !deep) throw new Error(`Missing Quick Revision or Deep Dive for ${targetSlug}`);

  question.direct_answer = presentation.directAnswer;
  quick.items = presentation.quickItems;
  deep.title = presentation.deep.title;
  deep.content = presentation.deep.content;

  speakable.answerSize = presentation.answerSize;
  speakable.beats = presentation.beats;
  speakable.content = presentation.beats
    .map((beat) => beat.spokenText.trim())
    .join("\n\n");
  curated += 1;
}

if (curated !== document.questions.length) {
  throw new Error(`Curated ${curated} of ${document.questions.length} questions`);
}

fs.writeFileSync(questionFile, `${JSON.stringify(document, null, 2)}\n`);
console.log(`Curated Interview Answer presentations for ${curated} Python HTTP error questions`);
