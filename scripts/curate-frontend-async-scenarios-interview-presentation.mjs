#!/usr/bin/env node

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const questionFile = path.join(
  repoRoot,
  "content/frontend-fresher/javascript-async-basics/scenario-based/complete-qa.json",
);

const presentations = [
  {
    slug: "javascript-async-basics-scenario-based-interview-basics",
    question: "How would you prevent an older search request from overwriting newer results?",
    beats: [
      {
        cue: "Name the race between user intent and response order",
        stage: "Two requests can race",
        spokenText: "A live search starts asynchronous work for each query, but requests do not have to finish in the order they started. The request for `c` can finish after the newer request for `cat`. If every completion writes to the same results state, the older response replaces the result the user actually asked for. The screen must therefore follow the newest user intent, not network completion order.",
        support: {
          type: "trace",
          title: "Why the older result must be ignored",
          items: [
            {
              label: "Request 1",
              value: "c starts slowly",
              detail: "It owns the screen only until another query begins.",
              tone: "neutral",
            },
            {
              label: "Request 2",
              value: "cat starts later",
              detail: "A new request ID records the latest user intent.",
              tone: "blue",
            },
            {
              label: "Request 2",
              value: "cat finishes first",
              detail: "Its ID is current, so CAT may be committed.",
              tone: "green",
            },
            {
              label: "Request 1",
              value: "c finishes last",
              detail: "Its ID is stale, so its result is discarded.",
              tone: "orange",
            },
          ],
        },
      },
      {
        cue: "Cancel work that the current query no longer needs",
        stage: "Abort superseded work",
        spokenText: "Keep an `AbortController` with the active search. Before the next `fetch`, call `activeController.abort()`, create a new controller, and pass its `signal` to the request. Fetch rejects cancelled work with an abort-related error, which is expected for a superseded search rather than an error to show the user. Cancellation saves work, but cannot be the only guard: it may arrive after a response settles or the data source may not support it.",
      },
      {
        cue: "Allow only the latest operation to change shared state",
        stage: "Guard every state write",
        spokenText: "Increment a request sequence when each search begins and capture that value locally. After every `await`, update results only when `requestId === latestRequest`. Apply the same ownership check before changing shared error or loading state; otherwise an old request may leave the result alone but still replace the current status. The runnable example combines cancellation with the sequence guard, so only `cat` can become visible.",
        support: {
          type: "code",
          title: "Cancel the old request and guard the commit",
          language: "javascript",
          code: "function delayedResult(ms, value, signal) {\n  return new Promise((resolve, reject) => {\n    let timer;\n    const onAbort = () => {\n      clearTimeout(timer);\n      const error = new Error(\"Superseded\");\n      error.name = \"AbortError\";\n      reject(error);\n    };\n    if (signal.aborted) return onAbort();\n    signal.addEventListener(\"abort\", onAbort, { once: true });\n    timer = setTimeout(() => resolve(value), ms);\n  });\n}\n\nlet latestRequest = 0;\nlet activeController;\nlet shown = null;\n\nasync function search(query, ms) {\n  const requestId = ++latestRequest;\n  activeController?.abort();\n  const controller = new AbortController();\n  activeController = controller;\n\n  try {\n    const result = await delayedResult(ms, query.toUpperCase(), controller.signal);\n    if (requestId === latestRequest) shown = result;\n  } catch (error) {\n    if (error.name !== \"AbortError\" && requestId === latestRequest) throw error;\n  }\n}\n\nconst oldSearch = search(\"c\", 30);\nconst newSearch = search(\"cat\", 5);\nawait Promise.all([oldSearch, newSearch]);\nconsole.log(shown);",
          caption: "The old operation is aborted, and the request ID independently proves that only the newest search may commit CAT.",
        },
      },
      {
        cue: "Separate traffic reduction from ordering correctness",
        stage: "Debounce only reduces traffic",
        spokenText: "Debouncing waits for typing to pause and reduces the number of requests, but it does not guarantee that every earlier request has finished. Use it as an input policy alongside cancellation and a last-writer guard. Also remember that aborting a client request does not undo a write the server has already accepted; mutations need server-side protection such as idempotency keys or version checks.",
        recallRule: "Cancel work that is no longer useful, but let an explicit request ID decide which operation still owns every shared UI update.",
      },
    ],
  },
  {
    slug: "javascript-async-basics-scenario-based-when-to-use",
    question: "How would you find and fix independent API requests that run one after another unnecessarily?",
    beats: [
      {
        cue: "Use timing evidence to distinguish latency from serialization",
        stage: "Read the request waterfall",
        spokenText: "Start with the browser network waterfall or performance marks placed immediately before each request call and when it settles. If request B starts only after request A finishes, the code is serialising them. A long total time by itself is not enough evidence because server and network latency can also be slow. The start timestamps reveal whether the waiting periods overlap.",
        support: {
          type: "comparison",
          title: "Dependency decides the schedule",
          items: [
            {
              label: "B needs A",
              value: "await A, then call B",
              detail: "Sequential order is required because B cannot start with the available inputs.",
              tone: "neutral",
            },
            {
              label: "A and B are independent",
              value: "start both, then join",
              detail: "Their waiting time can overlap without changing the data dependency.",
              tone: "green",
            },
            {
              label: "Many independent calls",
              value: "use a bounded pool",
              detail: "Concurrency remains controlled instead of becoming unlimited fan-out.",
              tone: "orange",
            },
          ],
        },
      },
      {
        cue: "Check whether later work truly needs an earlier result",
        stage: "Separate dependency from habit",
        spokenText: "For each pair, ask whether B needs a value produced by A or whether both use inputs already available. `await loadProfile(); await loadNotifications();` calls the second function only after the first Promise settles. If the calls are independent, that order is accidental. An async operation normally starts when its function is called, so create both Promises before waiting for their combined result.",
      },
      {
        cue: "Start independent calls together and join their outcomes",
        stage: "Start work before joining",
        spokenText: "Use `Promise.all` when every result is required. Both functions are called while building the input array, and the join returns values in array order even when completion order differs. In the example, notifications finish first, but the final array is still `[profile, notifications]`. The total wait is close to the slower task rather than the sum of both waits.",
        support: {
          type: "code",
          title: "Overlap two independent loads",
          language: "javascript",
          code: "const task = (name, ms) => new Promise((resolve) => {\n  console.log(\"start\", name);\n  setTimeout(() => {\n    console.log(\"finish\", name);\n    resolve(name);\n  }, ms);\n});\n\nasync function loadDashboard() {\n  const profilePromise = task(\"profile\", 20);\n  const noticesPromise = task(\"notifications\", 5);\n  return Promise.all([profilePromise, noticesPromise]);\n}\n\nconsole.log(await loadDashboard());",
          caption: "Both start messages appear before either finish message, while Promise.all preserves profile-first result order.",
        },
      },
      {
        cue: "Preserve failure behavior and resource limits while improving overlap",
        stage: "Match failure and load policy",
        spokenText: "`Promise.all` rejects when one input rejects, but it does not cancel the other requests. That fail-fast result suits a view that requires every response. Independent optional panels may use separate error handling or `Promise.allSettled` so one failure does not hide successful data. For hundreds of items, add a concurrency limit to respect browser connections, server capacity, and rate limits, then remeasure the waterfall to confirm the intended overlap.",
        recallRule: "Measure start times, preserve real dependencies, start independent work together, and choose failure and concurrency policies explicitly.",
      },
    ],
  },
  {
    slug: "javascript-async-basics-scenario-based-common-mistake",
    question: "How would you debug a loading indicator that never stops after an async failure?",
    beats: [
      {
        cue: "Trace loading through both fulfillment and rejection",
        stage: "Find the missing transition",
        spokenText: "Treat the indicator as state owned by one operation: idle becomes loading when work starts, then must return to idle after either success or failure. If `loading = false` appears only after an `await`, a rejection skips that statement and jumps to the nearest rejection handler. Logging start, fulfill or reject, catch, and cleanup with an operation ID shows exactly which transition is missing.",
        support: {
          type: "trace",
          title: "Both outcomes must reach cleanup",
          items: [
            {
              label: "Start",
              value: "loading = true",
              detail: "The operation becomes the current loading owner.",
              tone: "blue",
            },
            {
              label: "Fulfill",
              value: "use the result",
              detail: "Successful work continues through the try block.",
              tone: "green",
            },
            {
              label: "Reject",
              value: "handle or rethrow",
              detail: "Failure skips later statements in the try block.",
              tone: "orange",
            },
            {
              label: "Finally",
              value: "loading = false",
              detail: "Outcome-independent cleanup runs on both paths.",
              tone: "neutral",
            },
          ],
        },
      },
      {
        cue: "Put outcome-independent cleanup around the awaited operation",
        stage: "Cleanup belongs in finally",
        spokenText: "Set loading before the `try`, await the owned operation inside it, handle or rethrow its error in `catch`, and reset loading in `finally`. A fetch call also needs an explicit `response.ok` check when HTTP error statuses should enter the failure path, because a returned 500 Response does not reject fetch by itself. The example proves that cleanup runs while the original failure remains observable.",
        support: {
          type: "code",
          title: "Reset loading without hiding the failure",
          language: "javascript",
          code: "let loading = false;\nlet errorMessage = null;\n\nasync function submit(save) {\n  loading = true;\n  errorMessage = null;\n  try {\n    return await save();\n  } catch (error) {\n    errorMessage = error.message;\n    throw error;\n  } finally {\n    loading = false;\n  }\n}\n\nawait submit(() => Promise.reject(new Error(\"offline\"))).catch(() => {});\nconsole.log(loading, errorMessage);",
          caption: "The output is false offline: finally clears the indicator, while catch records and rethrows the failure.",
        },
      },
      {
        cue: "Make the caller await or return the Promise that owns loading",
        stage: "Keep one Promise owner",
        spokenText: "Verify that the event handler awaits or returns the Promise whose completion controls the indicator. A detached Promise can reject outside the surrounding `try` and `finally`, and a branch that returns early may bypass separately placed cleanup. Put one operation boundary around all success and failure branches, and distinguish an intentional abort from a failure that should be displayed.",
      },
      {
        cue: "Stop an older completion from clearing a newer operation",
        stage: "Protect overlapping operations",
        spokenText: "Rapid repeat actions add a second bug: request 1 can finish while request 2 is still pending and clear their shared indicator too early. For latest-only work, let a request ID decide whether a completion still owns the state. When every parallel operation matters, maintain a pending counter and show loading while it is above zero. Test success, rejection, abort, and two overlapping starts rather than checking only the happy path.",
        recallRule: "Use finally for one operation's guaranteed cleanup, then add an owner ID or pending count when several operations can overlap.",
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
console.log(`Curated ${presentations.length} async-scenario Interview Answer presentations`);
