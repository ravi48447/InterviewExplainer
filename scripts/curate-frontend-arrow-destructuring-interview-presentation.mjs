#!/usr/bin/env node

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const questionFile = path.join(
  repoRoot,
  "content/frontend-fresher/javascript-async-basics/arrow-functions-destructuring/complete-qa.json",
);

const presentations = [
  {
    slug: "javascript-async-basics-arrow-functions-destructuring-interview-basics",
    question: "How are arrow functions different from regular functions in JavaScript?",
    answerSize: "standard",
    beats: [
      {
        cue: "Lead with lexical context rather than short syntax",
        stage: "Arrows capture outer context",
        spokenText: "An arrow function is a compact function expression, but its important difference is lexical context. It does not create its own `this`, `arguments`, `super`, or `new.target`; it reads those names from the surrounding scope where the arrow was created. Shorter syntax is useful, but it is not the main semantic rule.",
      },
      {
        cue: "Contrast lexical this with a call-selected receiver",
        stage: "Regular this follows the call",
        spokenText: "A regular function receives `this` from the way it is called. `account.read()` can set the receiver to `account`, while calling an extracted `read()` loses that method call. `call`, `apply`, and `bind` can provide a receiver to a regular function, but they cannot replace the `this` already captured by an arrow.",
        support: {
          type: "comparison",
          title: "Arrow and regular function behavior",
          items: [
            {
              label: "Arrow function",
              value: "lexical context",
              detail: "Captures this and arguments; cannot be called with new.",
              tone: "blue",
            },
            {
              label: "Regular function",
              value: "call-site context",
              detail: "Receives this from the call, owns arguments, and may be constructable.",
              tone: "green",
            },
          ],
        },
      },
      {
        cue: "Show an arrow preserving a method receiver in a callback",
        stage: "Callbacks keep the receiver",
        spokenText: "An arrow is a good fit for a callback that should keep its surrounding receiver. In the example, the regular method receives the `counter` object as `this`, and the arrow used by `forEach` keeps that same value. A regular callback there would need an explicit receiver, a closure, or `bind`.",
        support: {
          type: "code",
          title: "The method owns this; the arrow keeps it",
          language: "javascript",
          code: "const counter = {\n  value: 0,\n  addAll(values) {\n    values.forEach(value => {\n      this.value += value;\n    });\n  },\n};\n\ncounter.addAll([1, 2, 3]);\nconsole.log(counter.value);",
          caption: "The output is 6 because the arrow callback reads the method's counter receiver.",
        },
      },
      {
        cue: "State construction arguments generator and return limits",
        stage: "Arrows have function limits",
        spokenText: "Arrow functions cannot be used with `new`, do not provide their own construction `prototype`, and cannot be generator functions. They also have no own `arguments`, so a rest parameter such as `(...values)` is clearer when all inputs are needed. For an implicit object return, wrap the literal as `value => ({ value })`; otherwise the braces are parsed as a block body.",
        recallRule: "Use arrows for lexical-context callbacks; use regular functions when the call must supply this, arguments, or construction behavior.",
      },
    ],
  },
  {
    slug: "javascript-async-basics-arrow-functions-destructuring-when-to-use",
    question: "How does destructuring work with arrays, objects, defaults, renaming, and rest values?",
    answerSize: "standard",
    beats: [
      {
        cue: "Define array positions and object property selection",
        stage: "Patterns mirror the source",
        spokenText: "Destructuring is binding syntax that selects values using a pattern. An array pattern reads iterable values by position, so `const [first, second] = values` takes the first two items. An object pattern reads properties by key, so `const { id } = user` selects the property named `id`. The source itself is not changed. The same patterns also work in function parameters and loop headers.",
      },
      {
        cue: "Place renaming defaults skipping and rest in one map",
        stage: "Each pattern has one job",
        spokenText: "Array patterns can skip a position, and either form can provide defaults or collect remaining values. Object syntax can also rename while reading: in `const { id: userId } = user`, `id` is the source key and `userId` is the local variable. A rest element must be last because it gathers what remains.",
        support: {
          type: "comparison",
          title: "Read the pattern from left to right",
          items: [
            {
              label: "[first, , third]",
              value: "position",
              detail: "Read iterable values by order and skip the empty slot.",
              tone: "blue",
            },
            {
              label: "{ id: userId }",
              value: "rename",
              detail: "Read source key id into local name userId.",
              tone: "green",
            },
            {
              label: "{ role = 'viewer' }",
              value: "default",
              detail: "Use the fallback only when role is undefined.",
              tone: "orange",
            },
            {
              label: "...rest",
              value: "collect remaining",
              detail: "Create a new outer array or object for unselected values.",
              tone: "neutral",
            },
          ],
        },
      },
      {
        cue: "Explain the exact undefined boundary for defaults",
        stage: "Defaults handle undefined only",
        spokenText: "A destructuring default is used when the matched value is missing or exactly `undefined`. It does not replace `null`, `false`, `0`, or an empty string. For example, `{ theme: null }` destructured with `{ theme = \"light\" }` keeps `null`, allowing an API to distinguish an omitted value from a value supplied deliberately.",
      },
      {
        cue: "Demonstrate rest collection and shallow ownership",
        stage: "Rest copies one level",
        spokenText: "Array rest creates a new array, while object rest copies the remaining enumerable own properties into a new object. Both operations are shallow. In the example, changing `rest.profile.city` also changes `user.profile.city` because both outer objects still refer to the same nested profile object. Deep ownership needs an intentional deeper copy.",
        support: {
          type: "code",
          title: "Positions, renaming, default and rest",
          language: "javascript",
          code: "const coordinates = [12, 30, 99];\nconst [x, y, ...extra] = coordinates;\n\nconst user = { id: 7, role: undefined, profile: { city: \"Pune\" } };\nconst { id: userId, role = \"viewer\", ...rest } = user;\n\nrest.profile.city = \"Goa\";\nconsole.log(x, y, extra);\nconsole.log(userId, role, user.profile.city);",
          caption: "The output is 12 30 [99], then 7 viewer Goa; object rest did not clone the nested profile.",
        },
        recallRule: "Arrays match positions, objects match keys, defaults handle undefined, aliases choose local names, and rest is shallow.",
      },
    ],
  },
  {
    slug: "javascript-async-basics-arrow-functions-destructuring-common-mistake",
    question: "Which arrow-function and destructuring mistakes commonly cause JavaScript bugs?",
    answerSize: "compact",
    beats: [
      {
        cue: "Connect unexpected this to receiver ownership",
        stage: "Wrong this, wrong receiver",
        spokenText: "An arrow used as an object method does not receive that object as `this`; it captures `this` from outside. When the method should use its call receiver, write `read() { return this.total; }`. Keep the arrow for an inner callback only when that callback should preserve the method's receiver.",
        support: {
          type: "comparison",
          title: "Symptom, rule, and repair",
          items: [
            {
              label: "Wrong this",
              value: "arrow captured outside",
              detail: "Use method syntax when the object call should set the receiver.",
              tone: "blue",
            },
            {
              label: "Undefined object return",
              value: "braces became a block",
              detail: "Wrap the returned object literal in parentheses.",
              tone: "orange",
            },
            {
              label: "Destructuring TypeError",
              value: "whole input is absent",
              detail: "Add an outer default only when omission is valid.",
              tone: "green",
            },
            {
              label: "Original nested value changes",
              value: "rest was shallow",
              detail: "Copy the nested ownership boundary that must be independent.",
              tone: "neutral",
            },
          ],
        },
      },
      {
        cue: "Explain why object-returning arrows need parentheses",
        stage: "Wrap an object return",
        spokenText: "The arrow `item => { id: item.id }` uses a block body and does not return the object. Write `item => ({ id: item.id })` for an implicit object expression, or use a block with an explicit `return`. The parentheses tell the parser that the braces begin an expression.",
      },
      {
        cue: "Separate outer parameter and property defaults",
        stage: "Optional input needs defaults",
        spokenText: "A property default cannot help when the entire argument is absent. `function label({ name })` throws if called with no argument. When omission is allowed, `function label({ name = \"Guest\" } = {})` first supplies an object, then supplies the property. An explicit `null` still needs validation because neither default replaces it.",
        support: {
          type: "code",
          title: "Safe omission and a clear object return",
          language: "javascript",
          code: "const makeLabel = ({ name = \"Guest\" } = {}) => ({ label: name });\n\nconst account = {\n  name: \"Mina\",\n  greeting() {\n    return makeLabel({ name: this.name });\n  },\n};\n\nconsole.log(makeLabel());\nconsole.log(account.greeting());",
          caption: "The function produces { label: 'Guest' } for omission and { label: 'Mina' } through a real method receiver.",
        },
      },
      {
        cue: "State the shallow-copy limit of rest syntax",
        stage: "Rest is not a deep clone",
        spokenText: "Rest creates a new outer container but keeps references to nested objects. Mutating a nested value through the rest object can therefore change the original source. Copy more deeply only where independent ownership is required. The useful diagnosis is the broken rule—receiver, return syntax, input presence, or copy depth—not a blanket ban on concise syntax.",
        recallRule: "Check receiver ownership, object-return parentheses, the whole destructured input, and nested copy depth before changing concise syntax.",
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
console.log(`Curated ${presentations.length} arrow and destructuring Interview Answer presentations`);
