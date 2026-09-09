#!/usr/bin/env node

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const questionFile = path.join(
  repoRoot,
  "content/frontend-fresher/javascript-async-basics/async-await-basics/complete-qa.json",
);
const targetSlug = "javascript-async-basics-async-await-basics-interview-basics";
const expectedQuestion = "How do `async` functions and `await` work in JavaScript?";

const beats = [
  {
    cue: "Define the contract created by async",
    stage: "Every call returns a Promise",
    spokenText: "An `async` function is a function that always returns a new Promise. If its body says `return 42`, the returned Promise fulfills with `42`. If the body throws an error that is not caught, the returned Promise rejects with that error. Returning another Promise makes the outer Promise follow that result.",
  },
  {
    cue: "Explain suspension without global blocking",
    stage: "await pauses one function",
    spokenText: "`await` reads the result of a value or Promise. A fulfilled Promise gives its value to the expression, as in `const user = await loadUser()`. A pending Promise suspends only the current async function. The caller and other JavaScript work can continue, and the function resumes later after the awaited result settles.",
    support: {
      type: "trace",
      title: "What happens at an await",
      items: [
        {
          label: "Call",
          value: "load() starts",
          detail: "The function runs synchronously until it reaches an await.",
          tone: "blue",
        },
        {
          label: "Return",
          value: "caller gets a Promise",
          detail: "The async function exposes its eventual result immediately.",
          tone: "neutral",
        },
        {
          label: "Continue",
          value: "other work runs",
          detail: "Only this function is suspended; JavaScript is not globally blocked.",
          tone: "green",
        },
        {
          label: "Resume",
          value: "settled value returns",
          detail: "A Promise job continues the function with a value or thrown reason.",
          tone: "orange",
        },
      ],
    },
  },
  {
    cue: "Connect timing and error behavior to code",
    stage: "The caller keeps running",
    spokenText: "The short example shows the order clearly. `load()` prints before its first `await`, then returns a Promise. The caller prints next. After the awaited Promise is ready, `load()` resumes and fulfills its outer Promise. If that awaited Promise rejected instead, the `await` expression would throw inside `load()`, where normal `try` and `catch` could handle it.",
    support: {
      type: "code",
      title: "A complete timing example",
      language: "javascript",
      code: "const pause = () => Promise.resolve(\"ready\");\n\nasync function load() {\n  console.log(\"A: before await\");\n  const value = await pause();\n  console.log(\"C:\", value);\n  return 42;\n}\n\nconst result = load();\nconsole.log(\"B: caller continues\");\nresult.then(value => console.log(\"D:\", value));",
      caption: "The output is A, B, C, D: caller code runs before the suspended function resumes.",
    },
  },
  {
    cue: "Close with the important execution boundary",
    stage: "async does not add a thread",
    spokenText: "`async` and `await` make Promise-based code easier to read, but they do not move work to another thread or make operations parallel. Code before the first `await` still runs synchronously, so a long calculation there blocks the event loop. Use them to express asynchronous dependencies and error flow, and use a worker when CPU-heavy work must run away from the main thread.",
    recallRule: "An async call returns a Promise; await suspends that function, then resumes it with a value or an error.",
  },
];

const presentations = [
  {
    slug: targetSlug,
    question: expectedQuestion,
    answerSize: "standard",
    beats,
  },
  {
    slug: "javascript-async-basics-async-await-basics-when-to-use",
    question: "When should asynchronous work run sequentially, concurrently with `Promise.all`, or with `Promise.allSettled`?",
    answerSize: "standard",
    beats: [
      {
        cue: "Make data dependency the first decision",
        stage: "Dependencies set the order",
        spokenText: "Run operations sequentially when a later step needs an earlier result. In `const posts = await loadPosts(user.id)`, the posts request cannot start until the user request has produced `user.id`. Authentication before an account request is another real dependency because the second call needs the token returned by the first. Writing two awaits in order is correct here because the dependency, not the syntax, requires that order.",
      },
      {
        cue: "Show how independent operations overlap",
        stage: "Start independent work early",
        spokenText: "Independent operations should be started before waiting for them. `Promise.all([loadUser(), loadNotices()])` invokes both functions while the array is created, then waits for both results. The result array keeps the original input order even if the notices finish first. One rejection rejects the combined Promise, but it does not cancel the other operation.",
        support: {
          type: "code",
          title: "Two independent requests share the wait",
          language: "javascript",
          code: "const wait = (ms, value) => new Promise(resolve => {\n  setTimeout(() => resolve(value), ms);\n});\n\nasync function loadDashboard() {\n  const [user, notices] = await Promise.all([\n    wait(30, \"user\"),\n    wait(10, \"notices\"),\n  ]);\n  console.log(user, notices);\n}\n\nloadDashboard();",
          caption: "Notices finish first, but Promise.all returns values in the input order: user, notices.",
        },
      },
      {
        cue: "Choose the join from the required failure result",
        stage: "Failure decides the join",
        spokenText: "Use `Promise.all` when every result is required and one failure should fail the combined operation. Use `Promise.allSettled` when every outcome matters, such as a batch upload that must report both successful and failed files. It waits for all inputs and returns one `fulfilled` or `rejected` record for each input.",
        support: {
          type: "comparison",
          title: "Choose by dependency and failure policy",
          items: [
            {
              label: "Sequential awaits",
              value: "B depends on A",
              detail: "Start B only after A has produced the value B needs.",
              tone: "blue",
            },
            {
              label: "Promise.all",
              value: "all results required",
              detail: "Start independent work together and reject the join if one input rejects.",
              tone: "green",
            },
            {
              label: "Promise.allSettled",
              value: "all outcomes required",
              detail: "Wait for every operation and inspect each status record.",
              tone: "orange",
            },
          ],
        },
      },
      {
        cue: "State the practical limit of unbounded concurrency",
        stage: "Large batches need a limit",
        spokenText: "Concurrency overlaps waiting time; it does not guarantee parallel CPU execution. Starting thousands of independent requests at once can still overload the browser, network, or server. For a large batch, use a concurrency limit. The choice is therefore: follow real dependencies, select the required failure policy, and then control how much work may run at once.",
        recallRule: "Sequence dependent work, join required independent results with Promise.all, and use Promise.allSettled when every outcome must be reported.",
      },
    ],
  },
  {
    slug: "javascript-async-basics-async-await-basics-common-mistake",
    question: "How should errors be handled in an async function, and what happens when `await` is omitted?",
    answerSize: "standard",
    beats: [
      {
        cue: "Explain where an awaited rejection appears",
        stage: "await makes rejection a throw",
        spokenText: "When an awaited Promise rejects, `await` throws that reason at the same point inside the async function. A surrounding `try` and `catch` can therefore recover, translate the error, or add useful context. If the error is not caught there, the async function finishes by returning a rejected Promise to its caller.",
        support: {
          type: "code",
          title: "An awaited failure reaches catch",
          language: "javascript",
          code: "const failLater = () => Promise.reject(new Error(\"save failed\"));\n\nasync function saveSafely() {\n  try {\n    await failLater();\n    return { ok: true };\n  } catch (error) {\n    return { ok: false, message: error.message };\n  }\n}\n\nsaveSafely().then(console.log);",
          caption: "The awaited rejection becomes a throw, so this catch returns a clear failure result.",
        },
      },
      {
        cue: "Place recovery at a meaningful ownership boundary",
        stage: "Catch where recovery happens",
        spokenText: "A function should catch an error only when it can make a real decision, such as showing a fallback, translating a low-level error, or resetting local state. For example, a screen can turn a network failure into a visible retry message, while a lower-level helper may not know how the application should recover. Otherwise, returning `saveUser()` lets the caller await and handle that Promise. Logging an error and then returning nothing can accidentally turn a rejection into successful `undefined`.",
      },
      {
        cue: "Contrast awaited returned and detached work",
        stage: "Every Promise needs an owner",
        spokenText: "If `saveUser()` is called inside a `try` without `await`, that block can finish before the Promise rejects, so its `catch` cannot receive the later rejection. The work must be awaited here, returned to a caller, or deliberately detached with its own `.catch(...)`. Losing all three paths creates an unhandled-rejection risk.",
        support: {
          type: "comparison",
          title: "Three explicit owners for async work",
          items: [
            {
              label: "await",
              value: "handle here",
              detail: "Settlement stays inside this function's try, catch, and finally boundary.",
              tone: "blue",
            },
            {
              label: "return",
              value: "caller handles",
              detail: "The caller owns completion and any rejection of the returned Promise.",
              tone: "green",
            },
            {
              label: "detach explicitly",
              value: "task handles itself",
              detail: "Background work attaches its own rejection reporting because nobody awaits it.",
              tone: "orange",
            },
          ],
        },
      },
      {
        cue: "Explain the narrow reason to return await",
        stage: "return await reaches catch",
        spokenText: "Simple forwarding can use `return saveUser()`. Use `return await saveUser()` when a surrounding local `try`, `catch`, or `finally` must observe how that Promise settles before the function leaves the block. `finally` is the right place for outcome-independent cleanup, but it should not silently hide an error that the current layer cannot handle.",
        recallRule: "Await a Promise to handle it here, return it for the caller to handle, or give intentional background work its own rejection handler.",
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
  speakable.answerSize = presentation.answerSize;
  speakable.beats = presentation.beats;
  speakable.content = presentation.beats.map((beat) => beat.spokenText).join("\n\n");
}

fs.writeFileSync(questionFile, `${JSON.stringify(document, null, 2)}\n`);
console.log(`Curated ${presentations.length} async/await Interview Answer presentations`);
