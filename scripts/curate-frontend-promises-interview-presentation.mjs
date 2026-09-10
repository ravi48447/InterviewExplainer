#!/usr/bin/env node

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const questionFile = path.join(
  repoRoot,
  "content/frontend-fresher/javascript-async-basics/promises-basics/complete-qa.json",
);

const presentations = [
  {
    slug: "javascript-async-basics-promises-basics-interview-basics",
    question: "What is a JavaScript Promise, and what do pending, fulfilled, rejected, and settled mean?",
    beats: [
      {
        cue: "Define the value represented by a Promise",
        stage: "A Promise represents a result",
        spokenText: "A JavaScript Promise is an object that represents the eventual result of an operation. It lets the caller receive a Promise now and observe a value or an error later. A network request is a common example: the request function returns immediately, while `then`, `catch`, or `await` observes how that operation eventually finishes. Several consumers can attach handlers to the same Promise and observe the same settlement.",
      },
      {
        cue: "Name each state and the one-way transition",
        stage: "Pending has two final outcomes",
        spokenText: "A Promise starts `pending`. It can become `fulfilled` with a value or `rejected` with a reason, usually an `Error`. Fulfilled and rejected are both `settled` states. Settlement happens only once, so a later call to `resolve` or `reject` cannot replace the chosen outcome.",
        support: {
          type: "comparison",
          title: "The three Promise states",
          items: [
            {
              label: "Pending",
              value: "waiting",
              detail: "The operation has not produced its final outcome yet.",
              tone: "blue",
            },
            {
              label: "Fulfilled",
              value: "settled with a value",
              detail: "Fulfillment handlers receive the value.",
              tone: "green",
            },
            {
              label: "Rejected",
              value: "settled with a reason",
              detail: "Rejection handlers receive the error or other reason.",
              tone: "orange",
            },
          ],
        },
      },
      {
        cue: "Separate synchronous creation from later handlers",
        stage: "Handlers wait for the stack",
        spokenText: "The function passed to `new Promise(...)` runs immediately during construction. Promise handlers run later, after the current synchronous stack has finished, even when the Promise is already settled. That is why the example prints `start`, `executor`, and `end` before its `then` handler prints the fulfilled value.",
        support: {
          type: "code",
          title: "Executor now, handler later",
          language: "javascript",
          code: "console.log(\"start\");\n\nconst result = new Promise(resolve => {\n  console.log(\"executor\");\n  resolve(42);\n  resolve(99); // ignored\n});\n\nresult.then(value => console.log(\"fulfilled\", value));\nconsole.log(\"end\");",
          caption: "The output is start, executor, end, fulfilled 42; settlement is one-time and handler delivery is asynchronous.",
        },
      },
      {
        cue: "Clarify resolution threading and cancellation boundaries",
        stage: "Promises do not create threads",
        spokenText: "A Promise coordinates an eventual result; it does not create a thread or make a long calculation asynchronous. The browser, Node API, or worker performs the underlying work. Also, `resolved` is slightly broader than `fulfilled`: a Promise may be resolved to follow another still-pending Promise. Cancelling work needs an API such as `AbortSignal`; rejecting a wrapper does not stop the work by itself.",
        recallRule: "A Promise moves from pending to one settled outcome, while its handlers run after the current synchronous stack.",
      },
    ],
  },
  {
    slug: "javascript-async-basics-promises-basics-when-to-use",
    question: "How does Promise chaining work, and why must a `then` callback return its result?",
    beats: [
      {
        cue: "Define the new Promise created by every link",
        stage: "then creates the next Promise",
        spokenText: "Every call to `then` returns a new Promise; it does not change the original one. Calling `then` twice on the same original Promise creates two branches, not one mutated pipeline. The callback's result decides what happens to each new Promise. This lets a chain transform a value, wait for another asynchronous operation, and pass either the next value or an error to the following link.",
      },
      {
        cue: "Explain the single resolution rule for handlers",
        stage: "Returns set the next state",
        spokenText: "Returning a plain value fulfills the next Promise with that value. Returning a Promise makes the chain adopt and wait for its outcome. Throwing inside the callback rejects the next Promise. If the callback has no return, its result is `undefined`, so the next fulfillment handler receives `undefined`.",
        support: {
          type: "comparison",
          title: "What a then callback produces",
          items: [
            {
              label: "return value",
              value: "fulfill",
              detail: "The next handler receives that plain value.",
              tone: "green",
            },
            {
              label: "return Promise",
              value: "adopt",
              detail: "The chain waits for the returned Promise's outcome.",
              tone: "blue",
            },
            {
              label: "throw error",
              value: "reject",
              detail: "A later catch can handle the new rejection.",
              tone: "orange",
            },
            {
              label: "no return",
              value: "fulfill undefined",
              detail: "Inner work is not connected unless it was returned.",
              tone: "neutral",
            },
          ],
        },
      },
      {
        cue: "Show how return keeps asynchronous work connected",
        stage: "Return keeps work attached",
        spokenText: "If a handler starts asynchronous work, returning that Promise keeps it inside the chain. In the example, `return doubleLater(number)` makes the next `then` wait for `6`. That handler returns `7`, so the final handler receives `7`. The whole sequence remains one Promise that a caller can await or catch.",
        support: {
          type: "code",
          title: "One connected Promise chain",
          language: "javascript",
          code: "const doubleLater = number => new Promise(resolve => {\n  setTimeout(() => resolve(number * 2), 5);\n});\n\nPromise.resolve(3)\n  .then(number => doubleLater(number))\n  .then(number => {\n    console.log(number); // 6\n    return number + 1;\n  })\n  .then(number => console.log(number)); // 7",
          caption: "Returning each result keeps timing, values, and errors connected to one observable chain.",
        },
      },
      {
        cue: "Name the two common ways a chain is disconnected",
        stage: "Missing return detaches work",
        spokenText: "Calling `fetchProfile(user.id)` without returning it lets the current handler finish with `undefined`; the next link can run before the profile arrives, and a rejection may be unhandled. Another mistake is `then(doWork())`, which calls the function immediately and passes its result as the handler. Use `then(() => doWork())` to delay that call and return its Promise.",
        recallRule: "Each then creates a Promise, and the callback's returned value, Promise, throw, or missing return decides its outcome.",
      },
    ],
  },
  {
    slug: "javascript-async-basics-promises-basics-common-mistake",
    question: "How do errors propagate through a Promise chain, and what do `catch` and `finally` do?",
    beats: [
      {
        cue: "Trace a rejection until a handler accepts it",
        stage: "Rejection skips to catch",
        spokenText: "A rejected Promise, or an error thrown inside a `then` callback, rejects the next Promise in the chain. Fulfillment-only handlers are skipped until a rejection handler is found. `catch(handler)` is shorthand for attaching an `onRejected` handler to the Promise produced by the preceding chain.",
        support: {
          type: "trace",
          title: "How failure moves through a chain",
          items: [
            {
              label: "Reject",
              value: "operation fails",
              detail: "A rejection or thrown handler error starts the failure route.",
              tone: "orange",
            },
            {
              label: "Skip",
              value: "then success handlers",
              detail: "Handlers without an error branch do not run for that rejection.",
              tone: "neutral",
            },
            {
              label: "Handle",
              value: "catch decides",
              detail: "Its return or throw determines the chain's next outcome.",
              tone: "blue",
            },
            {
              label: "Clean up",
              value: "finally runs",
              detail: "Cleanup runs after either fulfillment or rejection.",
              tone: "green",
            },
          ],
        },
      },
      {
        cue: "Distinguish recovery from continued failure",
        stage: "catch decides the next state",
        spokenText: "A `catch` recovers when it returns a normal value, so later fulfillment handlers receive that fallback. It keeps the chain rejected when it throws again or returns a rejected Promise. For example, a missing product may become an empty result, while an authentication or network failure should usually continue to an application error boundary. A catch that only logs and returns nothing also counts as recovery, but it fulfills with `undefined`, which can hide a real failure.",
      },
      {
        cue: "Explain finally pass-through and replacement",
        stage: "finally preserves the outcome",
        spokenText: "`finally` is for cleanup that must happen after success or failure, such as clearing a loading state. Cleanup should not decide whether the original operation succeeded. It receives no result argument and a normal return from it does not replace the earlier value or error. If the callback throws or returns a rejected Promise, that new failure replaces the previous outcome.",
      },
      {
        cue: "Demonstrate deliberate recovery followed by cleanup",
        stage: "Recovery and cleanup together",
        spokenText: "In the example, `catch` turns the expected offline failure into the fallback value `cached data`. The following `finally` clears `loading` without replacing that value. Authentication or corrupted-data errors might instead be rethrown, because the current layer cannot safely treat every failure as a successful fallback.",
        support: {
          type: "code",
          title: "Recover first, clean up second",
          language: "javascript",
          code: "let loading = true;\n\nPromise.reject(new Error(\"offline\"))\n  .catch(error => {\n    console.log(error.message);\n    return \"cached data\";\n  })\n  .finally(() => {\n    loading = false;\n  })\n  .then(value => console.log(value, loading));",
          caption: "The output is offline, then cached data false; catch recovers and finally preserves the recovered value.",
        },
        recallRule: "Catch chooses recovery or continued rejection; finally performs cleanup and normally preserves that chosen outcome.",
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
console.log(`Curated ${presentations.length} Promise Interview Answer presentations`);
