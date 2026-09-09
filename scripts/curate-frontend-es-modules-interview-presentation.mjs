#!/usr/bin/env node

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const questionFile = path.join(
  repoRoot,
  "content/frontend-fresher/javascript-async-basics/modules-import-export/complete-qa.json",
);

const presentations = [
  {
    slug: "javascript-async-basics-modules-import-export-interview-basics",
    question: "What are JavaScript ES modules, and how are they loaded and evaluated?",
    beats: [
      {
        cue: "Define module scope dependencies and public bindings",
        stage: "Modules own their scope",
        spokenText: "An ES module is a JavaScript file with its own scope and an explicit public interface. `export` makes selected bindings available, while `import` declares which bindings another module needs. Other declarations remain inside the module instead of becoming properties on the global object. Module code also runs in strict mode automatically.",
      },
      {
        cue: "Explain resolution linking and evaluation in order",
        stage: "Link before evaluation",
        spokenText: "Static import declarations let the runtime prepare a dependency graph before normal statements run. It resolves each module specifier, links imported names to real exported bindings, prepares dependencies, and then evaluates module bodies. This early linking is why a missing named export can be reported before application logic reaches the importing statement.",
        support: {
          type: "trace",
          title: "From entry file to evaluated graph",
          items: [
            {
              label: "Resolve",
              value: "find module identities",
              detail: "Turn each specifier into the URL or file the runtime will load.",
              tone: "blue",
            },
            {
              label: "Link",
              value: "connect bindings",
              detail: "Match imported names to exports across the graph.",
              tone: "neutral",
            },
            {
              label: "Evaluate",
              value: "run module bodies",
              detail: "Dependencies are prepared before the importer completes evaluation.",
              tone: "green",
            },
            {
              label: "Reuse",
              value: "share the instance",
              detail: "Later imports of the same identity observe the evaluated module.",
              tone: "orange",
            },
          ],
        },
      },
      {
        cue: "Demonstrate one-time evaluation by resolved identity",
        stage: "One identity evaluates once",
        spokenText: "A module is normally evaluated once for one resolved module identity. Several importers of the same URL share its namespace and top-level state instead of rerunning initialization for each importer. This avoids repeating the same setup for every consumer. The example imports one data-URL module twice: both imports return the same namespace object, and the top-level counter increases only once.",
        support: {
          type: "code",
          title: "The same module instance is reused",
          language: "javascript",
          code: "const source = [\n  \"globalThis.moduleRuns = (globalThis.moduleRuns || 0) + 1;\",\n  \"export const value = 7;\",\n].join(\"\\n\");\nconst url = \"data:text/javascript,\" + encodeURIComponent(source);\n\nconst first = await import(url);\nconst second = await import(url);\nconsole.log(first.value, first === second, globalThis.moduleRuns);",
          caption: "The output is 7 true 1 because both imports resolve to the same module identity.",
        },
      },
      {
        cue: "State browser loading and dynamic import boundaries",
        stage: "Browsers load modules by URL",
        spokenText: "A browser entry script uses `type=\"module\"`; module scripts are deferred by default, and their specifiers are resolved as URLs under CORS rules. Serving modules over HTTP avoids common `file://` restrictions. Static imports suit required dependencies. Dynamic `import(specifier)` is an expression that returns a Promise and suits conditional or lazy loading, while using the same module identity rules.",
        recallRule: "ES modules resolve and link an explicit dependency graph before evaluation, then reuse each resolved module instance.",
      },
    ],
  },
  {
    slug: "javascript-async-basics-modules-import-export-when-to-use",
    question: "What is the difference between named exports, default exports, namespace imports, and import aliases?",
    beats: [
      {
        cue: "Explain named exports and matching import syntax",
        stage: "Named exports keep their names",
        spokenText: "Named exports give public bindings explicit exported names, and one module may have many of them. `export const version = 2` is imported with braces as `import { version } from \"./tools.js\"`. The imported name stays connected to that export; the braces select a name and do not create an object destructuring copy.",
      },
      {
        cue: "Explain the single default export and local naming",
        stage: "Default is one special export",
        spokenText: "A module may have at most one default export because `default` is a special export name. It is imported without braces, as in `import parse from \"./tools.js\"`. The importing file chooses the local name, so another file may call the same default export `read`; that choice does not rename anything in the source module.",
        support: {
          type: "comparison",
          title: "Match each export to its import form",
          items: [
            {
              label: "Named",
              value: "import { version }",
              detail: "Select an exported name with braces; use as when the local name must differ.",
              tone: "blue",
            },
            {
              label: "Default",
              value: "import parse",
              detail: "Select the one default export without braces and choose a local name.",
              tone: "green",
            },
            {
              label: "Namespace",
              value: "import * as tools",
              detail: "Read exported bindings through names such as tools.version.",
              tone: "neutral",
            },
          ],
        },
      },
      {
        cue: "Describe namespace imports as binding collections",
        stage: "Namespace gathers exports",
        spokenText: "`import * as tools from \"./tools.js\"` creates a module namespace object whose properties expose the module's exports, such as `tools.double`. It is useful when several names form a clear group. The namespace is not an ordinary mutable record, so assigning to an exported property is not an alternative way to change module state.",
      },
      {
        cue: "Show default named namespace and alias syntax together",
        stage: "Aliases change local names",
        spokenText: "An alias changes only the consumer's local label: `import { version as apiVersion }` still reads the source export named `version`. Default and named exports can coexist, and another import may use the namespace form. The two-file example places each syntax beside the declaration it refers to, making the source name and local name visible.",
        support: {
          type: "code",
          title: "One module, several import forms",
          language: "javascript",
          code: "// tools.js\nexport const version = 2;\nexport const double = value => value * 2;\nexport default function parse(value) { return Number(value); }\n\n// app.js\nimport parse, { double, version as apiVersion } from \"./tools.js\";\nimport * as tools from \"./tools.js\";\n\nconsole.log(parse(\"4\"), double(4), apiVersion, tools.version);",
          caption: "The output is 4 8 2 2; aliases alter local access, while all imports still refer to tools.js exports.",
        },
        recallRule: "Braces select named exports, no braces selects default, star creates a namespace, and as changes only a local name.",
      },
    ],
  },
  {
    slug: "javascript-async-basics-modules-import-export-common-mistake",
    question: "What are live bindings in ES modules, and how do they affect imports, cycles, and dynamic loading?",
    beats: [
      {
        cue: "Replace the snapshot model with a live binding model",
        stage: "Imports read a live binding",
        spokenText: "An ES module import is a live, read-only view of a binding owned by the exporting module; it is not a value copied once at import time. If the exporter changes an exported `let`, a later read in every importer sees the new value. Importers receive current access to that binding, not ownership of it.",
      },
      {
        cue: "Demonstrate exporter-owned mutation and importer observation",
        stage: "The exporter owns updates",
        spokenText: "The importing module cannot assign to the imported name or use a namespace property to overwrite it. The exporter may expose a function that performs an allowed update. In the example, `increment()` changes the exporter's `count`, and the imported namespace reports `1` on the next read without being imported again.",
        support: {
          type: "code",
          title: "The importer sees the current value",
          language: "javascript",
          code: "const source = [\n  \"export let count = 0;\",\n  \"export function increment() { count += 1; }\",\n].join(\"\\n\");\nconst url = \"data:text/javascript,\" + encodeURIComponent(source);\nconst counter = await import(url);\n\nconsole.log(counter.count);\ncounter.increment();\nconsole.log(counter.count);",
          caption: "The output is 0 then 1: the exporter updates its binding and the importer reads the new value.",
        },
      },
      {
        cue: "Explain why linkage does not make every cycle safe",
        stage: "Cycles fail on early reads",
        spokenText: "Live bindings allow cyclic module graphs to be linked, so a cycle is not automatically an error. The danger is evaluation timing. If module A reads module B's lexical export before B has initialized it, the read can throw `ReferenceError`. Delaying the read may work, but removing the cycle usually produces clearer ownership and initialization order.",
      },
      {
        cue: "Connect dynamic loading to the same bindings and cache",
        stage: "Dynamic import changes timing",
        spokenText: "Static imports declare required dependencies at module top level so tools and the runtime can analyze them early. `import(specifier)` runs as an expression and returns a Promise for a module namespace, which fits optional or lazy features. For the same resolved identity it reuses the module instance and exposes the same live bindings rather than creating a fresh copy each time.",
        support: {
          type: "comparison",
          title: "Static and dynamic import",
          items: [
            {
              label: "Static import",
              value: "required dependency",
              detail: "Declared at module top level and linked before evaluation.",
              tone: "blue",
            },
            {
              label: "Dynamic import()",
              value: "conditional dependency",
              detail: "Called at runtime and returns a Promise for the module namespace.",
              tone: "green",
            },
          ],
        },
        recallRule: "Imports are live read-only views; the exporter owns updates, cycles depend on initialization timing, and dynamic import returns the same kind of namespace later.",
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
console.log(`Curated ${presentations.length} ES module Interview Answer presentations`);
