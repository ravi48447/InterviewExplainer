#!/usr/bin/env node

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const questionFile = path.join(
  repoRoot,
  "content/frontend-fresher/javascript-async-basics/template-literals/complete-qa.json",
);

const presentations = [
  {
    slug: "javascript-es6-async-template-literals-interview-basics",
    question: "How do JavaScript template literals handle interpolation and multiline text?",
    beats: [
      {
        cue: "Define backticks interpolation and the resulting string",
        stage: "Backticks create the literal",
        spokenText: "A template literal is written between backticks. In an ordinary untagged template, JavaScript keeps each fixed text segment, evaluates every `${expression}` placeholder, converts that result to text, and joins the pieces in source order. The final value is still a normal string; the syntax only provides a clearer way to compose it.",
        support: {
          type: "trace",
          title: "How interpolation builds one string",
          items: [
            {
              label: "Keep",
              value: "literal text",
              detail: "Text before, between, and after placeholders stays in source order.",
              tone: "blue",
            },
            {
              label: "Evaluate",
              value: "${expression}",
              detail: "JavaScript runs the expression when the template is evaluated.",
              tone: "neutral",
            },
            {
              label: "Convert",
              value: "result to text",
              detail: "The untagged form performs normal string conversion.",
              tone: "green",
            },
            {
              label: "Join",
              value: "one string",
              detail: "The converted values are inserted between fixed segments.",
              tone: "orange",
            },
          ],
        },
      },
      {
        cue: "Show that a placeholder accepts a real expression",
        stage: "Placeholders run expressions",
        spokenText: "A placeholder is not limited to a variable name. It may read a property, call a small formatter, or calculate a value, such as `Total: ${price * quantity}`. JavaScript evaluates placeholders once, from left to right, when execution reaches the template. Complex business rules are usually clearer when calculated before the template, but each placeholder is still a normal runtime expression.",
      },
      {
        cue: "Explain exact preservation of source whitespace",
        stage: "Whitespace stays in the result",
        spokenText: "Line breaks and spaces written between the backticks become part of the string. This makes multiline messages and generated snippets readable, but indentation used only to align source code can also appear in the output. Calling `trim()` removes whitespace at the outer boundaries; it does not automatically remove indentation from every line.",
        support: {
          type: "code",
          title: "Expressions and line breaks together",
          language: "javascript",
          code: "const learner = { name: \"Asha\", completed: 7 };\nconst summary = `Learner: ${learner.name}\nCompleted: ${learner.completed + 1}`;\n\nconsole.log(JSON.stringify(summary));\nconsole.log(`Show \\${learner.name}`);",
          caption: "The first output contains a real newline; the escaped placeholder marker remains visible as text in the second.",
        },
      },
      {
        cue: "State escaping conversion and trust boundaries",
        stage: "Escaping is not sanitising",
        spokenText: "Escape a literal backtick as `\\`` and escape the placeholder marker as `\\${name}` when it should appear as text. Ordinary interpolation converts objects, `null`, and `undefined` using normal string conversion, which may not be the format you want. It also does not escape untrusted data for HTML, URLs, or SQL; those destinations need their own safe APIs.",
        recallRule: "A template literal evaluates expressions and preserves its written whitespace, but formatting text does not make that text safe for a destination.",
      },
    ],
  },
  {
    slug: "javascript-es6-async-template-literals-when-to-use",
    question: "What is a tagged template literal, and what does the tag function receive?",
    beats: [
      {
        cue: "Define the tag call before ordinary interpolation occurs",
        stage: "The tag receives parts",
        spokenText: "A tagged template places a callable expression directly before a template literal, as in `format\`Hello ${name}\``. JavaScript calls the tag instead of first producing the ordinary interpolated string. The fixed literal pieces and evaluated substitution values arrive separately, giving the function both the template structure and its runtime data.",
        support: {
          type: "trace",
          title: "What reaches a tag function",
          items: [
            {
              label: "Literal site",
              value: "tag`text ${value}`",
              detail: "JavaScript recognises a tagged template expression.",
              tone: "blue",
            },
            {
              label: "Fixed text",
              value: "strings + strings.raw",
              detail: "Cooked and raw views describe text around substitutions.",
              tone: "neutral",
            },
            {
              label: "Runtime data",
              value: "separate values",
              detail: "Each evaluated substitution keeps its original type.",
              tone: "green",
            },
            {
              label: "Tag result",
              value: "any value",
              detail: "The function may return text, an object, or another value.",
              tone: "orange",
            },
          ],
        },
      },
      {
        cue: "Explain cooked raw and segment count rules",
        stage: "Strings describe fixed text",
        spokenText: "The first argument is a frozen array of cooked string segments, where valid escape sequences have their interpreted values. `strings.raw` exposes the matching source text before escape processing. With two placeholders there are three string segments: before the first value, between the values, and after the second, so `strings.length` is `values.length + 1`.",
      },
      {
        cue: "Preserve substitution types in a runnable inspection",
        stage: "Values keep their types",
        spokenText: "Every substitution follows as its own argument and keeps its original type. A number reaches the tag as a number, and an object remains that object instead of becoming `[object Object]`. The inspection example returns an object so the cooked segments, raw segments, and values can all be checked directly.",
        support: {
          type: "code",
          title: "Inspect the tag arguments",
          language: "javascript",
          code: "function inspect(strings, ...values) {\n  return { cooked: [...strings], raw: [...strings.raw], values };\n}\n\nconst name = \"Mina\";\nconst result = inspect`line one\\n${name}: ${2 + 3}`;\nconsole.log(JSON.stringify(result));",
          caption: "The cooked first segment contains a newline, the raw segment keeps \\n, and the substitutions remain Mina and numeric 5.",
        },
      },
      {
        cue: "State return caching and security boundaries",
        stage: "A tag controls the result",
        spokenText: "A tag may validate values, apply formatting, build structured data, or return any other value; it is not required to return a string. The same frozen strings array is reused when the same tagged-template site runs again, which can support caching. A tag is safe only when its implementation enforces a specific context; adding a function does not automatically sanitise HTML or parameterise SQL.",
        recallRule: "A tag receives cooked and raw fixed segments plus each original substitution value, then decides what value the whole expression returns.",
      },
    ],
  },
  {
    slug: "javascript-es6-async-template-literals-common-mistake",
    question: "Why does template-literal interpolation not prevent HTML or SQL injection?",
    beats: [
      {
        cue: "Separate string composition from destination safety",
        stage: "Interpolation only builds text",
        spokenText: "Ordinary `${value}` interpolation converts a value to text and concatenates it with surrounding text. It does not know whether the result will be parsed as HTML, a URL, JavaScript, CSS, or SQL. Because each destination has different syntax, backticks cannot decide which characters are data and which characters may change that syntax.",
      },
      {
        cue: "Map each destination to its own protection",
        stage: "Safety depends on destination",
        spokenText: "For untrusted DOM text, assign `element.textContent` instead of constructing `innerHTML`. For URL query data, use `URL` and `URLSearchParams`. For database values, use the parameter API provided by the driver rather than quoting an interpolated value. Intentionally allowed HTML needs a maintained, context-aware sanitiser.",
        support: {
          type: "comparison",
          title: "Match protection to the parser",
          items: [
            {
              label: "DOM text",
              value: "textContent",
              detail: "Keep untrusted content as text instead of asking the browser to parse markup.",
              tone: "green",
            },
            {
              label: "URL component",
              value: "URLSearchParams",
              detail: "Encode query data according to URL rules.",
              tone: "blue",
            },
            {
              label: "SQL value",
              value: "driver parameter",
              detail: "Send command structure and data through separate channels.",
              tone: "orange",
            },
            {
              label: "Allowed HTML",
              value: "reviewed sanitiser",
              detail: "Apply a maintained policy for the exact markup context.",
              tone: "neutral",
            },
          ],
        },
      },
      {
        cue: "Demonstrate structure and data remaining separate",
        stage: "Keep structure and data apart",
        spokenText: "The URL example gives the input to `searchParams.set`, which encodes spaces and `&` as query data. The query description keeps fixed SQL in `text` and the untrusted value in `values`; a real database driver binds that value using its own placeholder rules. Neither protection comes from the surrounding template syntax.",
        support: {
          type: "code",
          title: "Use APIs that preserve the data boundary",
          language: "javascript",
          code: "const untrusted = \"tea & cake\";\nconst url = new URL(\"https://example.test/search\");\nurl.searchParams.set(\"q\", untrusted);\n\nconst query = {\n  text: \"SELECT id FROM users WHERE display_name = ?\",\n  values: [untrusted],\n};\n\nconsole.log(url.href);\nconsole.log(query.text.includes(untrusted), query.values);",
          caption: "The URL is encoded, and the SQL description keeps untrusted data outside the command text for driver binding.",
        },
      },
      {
        cue: "Limit tagged templates and generic escaping claims",
        stage: "Tags need a security contract",
        spokenText: "A tagged template can support safety when a well-designed library owns one destination and keeps substitutions separate or escapes them correctly for that context. A home-made generic escape function is not universal: HTML text, attributes, URLs, CSS, JavaScript, and SQL follow different grammars. Encoding for HTML does not make the same value safe inside a URL or script. Keep data separate until the final destination API and test hostile characters at that boundary.",
        recallRule: "Interpolation is composition only; choose a context-aware API that keeps untrusted data from becoming destination syntax.",
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
console.log(`Curated ${presentations.length} template-literal Interview Answer presentations`);
