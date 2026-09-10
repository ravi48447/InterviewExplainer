#!/usr/bin/env node

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const questionFile = path.join(
  repoRoot,
  "content/frontend-fresher/javascript-async-basics/spread-and-rest/complete-qa.json",
);

const presentations = [
  {
    slug: "javascript-es6-async-spread-and-rest-interview-basics",
    question: "What is the difference between spread syntax and rest syntax in JavaScript?",
    beats: [
      {
        cue: "Define direction from the grammatical position",
        stage: "Three dots change direction",
        spokenText: "Spread and rest both use `...`, but their position gives the syntax opposite meanings. Spread takes one source and expands it into a place that expects several values or properties. Rest appears in a binding pattern and collects values that earlier parts of that pattern did not match. Read the surrounding syntax, not only the three dots.",
        support: {
          type: "comparison",
          title: "Expansion versus collection",
          items: [
            {
              label: "Spread",
              value: "one source → many positions",
              detail: "Use it in an array, object, or function call value position.",
              tone: "blue",
            },
            {
              label: "Rest",
              value: "many values → one binding",
              detail: "Use it in parameters or an array/object destructuring pattern.",
              tone: "green",
            },
          ],
        },
      },
      {
        cue: "Separate iterable spread from object property spread",
        stage: "Spread expands a source",
        spokenText: "Array spread such as `[...items]` and call spread such as `fn(...items)` read values from an iterable, including an array or string. Object spread such as `{ ...record }` is different: it copies the source's own enumerable properties. A plain object can therefore be object-spread but normally fails in `[...record]` because it is not iterable. When property names repeat, a later property or spread provides the final value.",
      },
      {
        cue: "Explain parameter array and destructuring leftovers",
        stage: "Rest collects unmatched values",
        spokenText: "A rest parameter collects call arguments left after named parameters into a real array, as in `function total(label, ...numbers)`. Array destructuring can collect remaining iterable values with `[first, ...remaining]`. Object destructuring can collect remaining own enumerable properties with `{ id, ...details }`. The rest element must be last in its pattern.",
      },
      {
        cue: "Demonstrate both directions and state copy depth",
        stage: "Both forms are shallow",
        spokenText: "The example uses spread to pass separate score arguments and to build an updated object, then uses rest to collect unmatched function arguments and object properties. These operations create new outer arrays or objects but do not recursively clone nested values. A nested object can therefore remain shared after either operation.",
        support: {
          type: "code",
          title: "Expand values, then collect leftovers",
          language: "javascript",
          code: "const scores = [7, 9, 8];\nconst user = { id: 4, name: \"Mina\" };\nconst activeUser = { ...user, active: true };\n\nfunction total(label, ...numbers) {\n  return `${label}:${numbers.reduce((sum, value) => sum + value, 0)}`;\n}\n\nconst { id, ...profile } = activeUser;\nconsole.log(Math.max(...scores));\nconsole.log(total(\"points\", 2, 3, 4));\nconsole.log(id, profile);",
          caption: "The output shows spread producing 9, rest parameters producing points:9, and object rest collecting the profile.",
        },
        recallRule: "Spread expands at a value position; rest collects leftovers at a binding position, and neither performs a deep clone.",
      },
    ],
  },
  {
    slug: "javascript-es6-async-spread-and-rest-when-to-use",
    question: "Why do spread syntax and `Object.assign` create only shallow copies?",
    beats: [
      {
        cue: "Define a shallow copy as a new outer container",
        stage: "The outer container is new",
        spokenText: "Object or array spread creates a new outer container, then places each source member value into it. This makes `copy !== original` true. Primitive values such as numbers and strings are copied directly, so changing a copied top-level primitive does not change the corresponding value stored in the source.",
      },
      {
        cue: "Show why nested reference identity remains shared",
        stage: "Nested references stay shared",
        spokenText: "A nested object or array is represented by a reference, and spread copies that reference as the member value. After `const copy = { ...original }`, both `copy.address` and `original.address` can point to the same object. Mutating `copy.address.city` is then visible through the original as well. Array spread follows the same rule: the outer array is new, but any object elements remain shared.",
        support: {
          type: "comparison",
          title: "Check identity at each depth",
          items: [
            {
              label: "Outer object",
              value: "new identity",
              detail: "copy !== original because spread creates a new container.",
              tone: "green",
            },
            {
              label: "Nested object",
              value: "shared identity",
              detail: "copy.address === original.address until that path is copied too.",
              tone: "orange",
            },
            {
              label: "Copied nested path",
              value: "new nested identity",
              detail: "A deliberate nested spread separates the branch being updated.",
              tone: "blue",
            },
          ],
        },
      },
      {
        cue: "Place Object assign at the same copy-depth boundary",
        stage: "Object.assign is also shallow",
        spokenText: "`Object.assign({}, original)` has the same shallow boundary for ordinary data: it copies enumerable own properties into a target without walking the object graph. Object spread creates properties on a new object literal, while `Object.assign` writes to its target and can trigger target setters. Those details differ, but neither operation is a general deep clone.",
      },
      {
        cue: "Demonstrate copying only the branch that changes",
        stage: "Copy the path that changes",
        spokenText: "When one nested branch must be independent, copy that known path as well, for example `{ ...user, skills: [...user.skills] }`. The identity checks in the example prove where sharing stops. `structuredClone` can copy many supported structured values more deeply, but it is a separate algorithm and does not support every JavaScript value, including functions.",
        support: {
          type: "code",
          title: "Outer copy versus nested copy",
          language: "javascript",
          code: "const original = { name: \"Mina\", skills: [\"JavaScript\"] };\nconst shallow = { ...original };\n\nshallow.skills.push(\"CSS\");\nconsole.log(shallow !== original);\nconsole.log(shallow.skills === original.skills);\n\nconst independent = { ...original, skills: [...original.skills] };\nindependent.skills.push(\"HTML\");\nconsole.log(original.skills);\nconsole.log(independent.skills);",
          caption: "The outer objects differ, the first nested array is shared, and the deliberately copied skills array becomes independent.",
        },
        recallRule: "Spread and Object.assign copy outer slots; nested references remain shared until the required nested path is copied deliberately.",
      },
    ],
  },
  {
    slug: "javascript-es6-async-spread-and-rest-common-mistake",
    question: "How do rest parameters differ from `arguments` and from rest destructuring?",
    beats: [
      {
        cue: "Define the unmatched call arguments collected by rest",
        stage: "Rest parameters make an array",
        spokenText: "A rest parameter belongs to a function parameter list. In `function log(level, ...messages)`, `level` receives the first argument and `messages` receives only the remaining arguments. This names the separate role of the prefix argument without manually slicing `arguments`. The result is a real array, so methods such as `map`, `filter`, and `reduce` work directly without conversion.",
      },
      {
        cue: "Contrast the older all-arguments array-like object",
        stage: "arguments sees the full call",
        spokenText: "The older `arguments` object exists inside ordinary functions and contains every supplied argument, including values matched by named parameters. It is array-like rather than a real array. Arrow functions do not create their own `arguments`; that name is taken from an outer scope when one exists, so it does not describe the arrow's call.",
        support: {
          type: "comparison",
          title: "Three ways values are collected",
          items: [
            {
              label: "Rest parameter",
              value: "unmatched call arguments",
              detail: "A real array named explicitly in the function signature.",
              tone: "green",
            },
            {
              label: "arguments",
              value: "all call arguments",
              detail: "An array-like object available as an own binding only in ordinary functions.",
              tone: "orange",
            },
            {
              label: "Rest destructuring",
              value: "unmatched source values",
              detail: "Collects leftovers from an existing array or object, not from the call itself.",
              tone: "blue",
            },
          ],
        },
      },
      {
        cue: "Move rest destructuring from calls to existing values",
        stage: "Rest reads an existing value",
        spokenText: "Rest destructuring operates on an existing value. `const [head, ...tail] = queue` creates a new array from remaining iterable values. `const { password, ...publicUser } = user` creates a shallow object from remaining own enumerable properties. Neither form knows anything about a function call or its arguments.",
      },
      {
        cue: "Demonstrate value shape and final-position rules",
        stage: "Rest must finish the pattern",
        spokenText: "A function may have one rest parameter, it must be last, it cannot have a default, and no trailing comma follows it. With no unmatched arguments, that parameter is already an empty array. Destructuring rest also finishes its pattern. The example shows that `remaining` excludes the named first parameter while `arguments` still contains the complete call; array rest then collects values from a separate source.",
        support: {
          type: "code",
          title: "Call rest and value rest side by side",
          language: "javascript",
          code: "function inspect(first, ...remaining) {\n  return {\n    remaining,\n    allArguments: Array.from(arguments),\n    remainingIsArray: Array.isArray(remaining),\n  };\n}\n\nconsole.log(inspect(\"a\", \"b\", \"c\"));\nconst [first, ...tail] = [10, 20, 30];\nconsole.log(first, tail);",
          caption: "Rest parameters return [b, c], arguments contains [a, b, c], and destructuring rest independently returns [20, 30].",
        },
        recallRule: "Rest parameters collect unmatched call arguments into an array; arguments sees the full ordinary-function call; destructuring rest collects from a value.",
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
console.log(`Curated ${presentations.length} spread and rest Interview Answer presentations`);
