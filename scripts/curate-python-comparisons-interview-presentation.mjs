#!/usr/bin/env node

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const questionFile = path.join(
  repoRoot,
  "content/python-backend-fresher/python-syntax-essentials/comparisons/complete-qa.json",
);

const presentations = {
  "python-truthy-falsy-explicit-none-checks": {
    answerSize: "standard",
    beats: [
      {
        cue: "Define truthiness as Python's Boolean interpretation",
        stage: "Truthiness is a Boolean view",
        spokenText: "Truthiness is how Python turns an object into a Boolean result when it appears in \u0060if\u0060, \u0060while\u0060, \u0060and\u0060, \u0060or\u0060, or \u0060not\u0060. Calling \u0060bool(value)\u0060 shows the same result directly. Truthiness does not change the original value; it only decides which branch a Boolean context takes.",
      },
      {
        cue: "Name the built-in values that share the falsy result",
        stage: "Several values are falsy",
        spokenText: "The common falsy values are \u0060False\u0060, \u0060None\u0060, numeric zero, and empty values such as \u0060''\u0060, \u0060[]\u0060, \u0060{}\u0060, \u0060set()\u0060, and \u0060()\u0060. Most other objects are truthy, including non-zero numbers and non-empty containers. This lets \u0060if items:\u0060 express the simple question, “does this collection contain anything?”",
        support: {
          type: "comparison",
          title: "Choose the check that matches the data question",
          items: [
            {
              label: "if items:",
              value: "has content",
              detail: "Use when every empty state should follow the same branch.",
              tone: "green",
            },
            {
              label: "value is None",
              value: "was omitted",
              detail: "Keeps zero, False, and an empty value distinct from missing.",
              tone: "blue",
            },
            {
              label: "count == 0",
              value: "exactly zero",
              detail: "Names the numeric state instead of grouping all falsy values.",
              tone: "orange",
            },
            {
              label: "left == right",
              value: "equal values",
              detail: "Asks about value equality rather than Boolean interpretation.",
              tone: "neutral",
            },
          ],
        },
      },
      {
        cue: "Explain why a concise truth test can erase meaning",
        stage: "A short check groups states",
        spokenText: "A truth test deliberately groups all falsy states. That is useful for \u0060if not errors:\u0060 when an empty error collection is the only state that matters. It is wrong when the states have different meanings. For a timeout, \u0060None\u0060 may mean “use the default” while \u00600\u0060 means “return immediately”; \u0060if not timeout:\u0060 would incorrectly treat both alike.",
      },
      {
        cue: "Separate identity equality and explicit domain checks",
        stage: "Explicit checks keep meaning",
        spokenText: "Use \u0060value is None\u0060 for the \u0060None\u0060 singleton, \u0060count == 0\u0060 for an exact numeric check, and \u0060left == right\u0060 for value equality. Identity asks whether two references point to the same object, so ordinary values should not be compared with \u0060is\u0060. The condition should name the distinction the program needs to preserve.",
        support: {
          type: "code",
          title: "Keep an omitted timeout separate from zero",
          language: "python",
          code: "def resolve_timeout(value):\n    if value is None:\n        return 30\n    if value < 0:\n        raise ValueError(\"timeout cannot be negative\")\n    return value\n\nfor supplied in (None, 0, 5):\n    print(supplied, \"->\", resolve_timeout(supplied))",
          caption: "The explicit None check applies the default only when the caller omitted the timeout; zero remains a valid value.",
        },
      },
      {
        cue: "Close with the custom truth protocol and design boundary",
        stage: "Objects can define truth",
        spokenText: "A class can define \u0060__bool__\u0060; otherwise Python may use whether \u0060__len__\u0060 returns zero. An object with neither behavior is truthy by default. Custom truth rules should stay unsurprising, because hiding several important states behind one Boolean result makes conditions difficult to read and easy to misuse.",
        recallRule: "Use a truth test only when every falsy value is meant to follow the same path; otherwise test the exact state explicitly.",
      },
    ],
  },
  "python-in-not-in-membership": {
    answerSize: "standard",
    beats: [
      {
        cue: "Define membership through the right-hand container",
        stage: "The container defines in",
        spokenText: "The expression \u0060needle in container\u0060 asks the right-hand object whether it contains the value, and \u0060needle not in container\u0060 negates that same result. The operator is shared syntax, but containment means something different for a sequence, string, mapping, or set.",
      },
      {
        cue: "Explain equality-based sequence membership",
        stage: "Sequences inspect elements",
        spokenText: "For a list or tuple, membership compares elements from left to right until one is equal to the needle or the sequence ends. A successful search can stop early, but the general cost grows with the number of elements. This is the right model when order or duplicate elements are still meaningful data.",
        support: {
          type: "comparison",
          title: "What each container treats as a member",
          items: [
            {
              label: "list / tuple",
              value: "equal element",
              detail: "Scans sequence elements until an equal value is found.",
              tone: "neutral",
            },
            {
              label: "str",
              value: "substring",
              detail: "Matches contiguous text and remains case-sensitive.",
              tone: "blue",
            },
            {
              label: "dict",
              value: "key",
              detail: "Normal membership checks keys, not stored values.",
              tone: "orange",
            },
            {
              label: "set",
              value: "hashable element",
              detail: "Provides average constant-time lookup for unique values.",
              tone: "green",
            },
          ],
        },
      },
      {
        cue: "Clarify substring behavior and its text boundary",
        stage: "Strings search substrings",
        spokenText: "For strings, membership checks a contiguous substring rather than a whole word. Therefore \u0060'read' in 'reader'\u0060 is true, while case differences still matter. If the requirement is case-insensitive text, normalized Unicode, or whole-word matching, prepare or parse the text first instead of expecting \u0060in\u0060 to understand that linguistic rule.",
      },
      {
        cue: "Show the key value and pair surfaces of a dictionary",
        stage: "Mappings test keys by default",
        spokenText: "For a dictionary, \u0060'A17' in users\u0060 checks whether \u0060'A17'\u0060 is a key; writing \u0060.keys()\u0060 is unnecessary. Searching \u0060users.values()\u0060 is an explicit value scan, while \u0060('A17', 'Ada') in users.items()\u0060 asks whether that key-value pair exists. The chosen view should match the unit being searched.",
        support: {
          type: "code",
          title: "Search the intended dictionary surface",
          language: "python",
          code: "users = {\"A17\": \"Ada\", \"B04\": \"Bo\"}\n\nprint(\"A17\" in users)\nprint(\"Ada\" in users)\nprint(\"Ada\" in users.values())\nprint((\"A17\", \"Ada\") in users.items())\n\nprint(\"read\" in \"reader\")",
          caption: "The same operator checks dictionary keys, values, pairs, or a text substring according to the right-hand object.",
        },
      },
      {
        cue: "Set the performance and data-model boundary",
        stage: "Sets suit repeated lookup",
        spokenText: "Sets and dictionary keys normally use hashing for average \u0060O(1)\u0060 membership, so they are useful for many repeated lookups. Their searched values must be hashable, and collision behavior means constant time is an average rather than an absolute guarantee. Converting a list to a set costs work and removes duplicates, so it is worthwhile only when those semantics and future lookups justify the conversion.",
        recallRule: "Read \u0060in\u0060 as containment defined by the right-hand object: elements for sequences and sets, substrings for strings, and keys for dictionaries.",
      },
    ],
  },
  "python-sequence-lexicographic-comparison": {
    answerSize: "standard",
    beats: [
      {
        cue: "Define lexicographic comparison as a left-to-right process",
        stage: "Comparison starts at the left",
        spokenText: "Python orders comparable strings, lists, and tuples lexicographically: it compares corresponding elements from left to right. This is a sequence rule rather than a total ordering over every Python object, so the element pair Python reaches must support the requested comparison.",
        support: {
          type: "trace",
          title: "How one sequence comparison reaches a result",
          items: [
            {
              label: "Position 0",
              value: "compare",
              detail: "If the two elements are equal, continue to the next position.",
              tone: "blue",
            },
            {
              label: "First difference",
              value: "decide",
              detail: "The ordering of that element pair decides the whole sequence.",
              tone: "green",
            },
            {
              label: "Shared prefix",
              value: "continue",
              detail: "Later elements matter only while all earlier pairs remain equal.",
              tone: "neutral",
            },
            {
              label: "One side ends",
              value: "shorter first",
              detail: "An exact prefix sorts before the longer sequence.",
              tone: "orange",
            },
          ],
        },
      },
      {
        cue: "Show how the first unequal pair decides the whole result",
        stage: "First difference decides",
        spokenText: "For \u0060(2026, 8, 31) < (2026, 9, 1)\u0060, the equal years lead to \u00608 < 9\u0060, which makes the expression true; the day values are never inspected. The same early decision means \u0060[1, 'x'] < [2, object()]\u0060 succeeds through \u00601 < 2\u0060 without touching the incompatible later values.",
      },
      {
        cue: "Explain exact-prefix ordering",
        stage: "A shorter prefix comes first",
        spokenText: "When every compared element is equal and one sequence ends, the shorter sequence sorts first. That is why \u0060[1, 2] < [1, 2, 0]\u0060 is true. If both sequences end together after equal elements, they compare equal rather than one being smaller.",
      },
      {
        cue: "State how strings and incompatible element pairs differ",
        stage: "Strings use code-point order",
        spokenText: "Strings compare their characters using Unicode code-point order. It is deterministic and case-sensitive, but it is not automatically dictionary order for a language or locale. Python 3 also refuses arbitrary ordering such as \u00603 < '4'\u0060; a list or tuple comparison raises \u0060TypeError\u0060 if it reaches an element pair that cannot be ordered.",
      },
      {
        cue: "Connect tuple sort keys to practical multi-field ordering",
        stage: "Sort keys define priorities",
        spokenText: "A tuple key turns lexicographic behavior into an explicit priority list. With \u0060key=lambda user: (user['name'].casefold(), user['id'])\u0060, the normalized name is primary and the ID breaks ties. \u0060casefold()\u0060 helps with case-insensitive matching, while proper human-language collation may still require locale-aware tooling.",
        support: {
          type: "code",
          title: "Order records by name and then ID",
          language: "python",
          code: "users = [\n    {\"id\": 3, \"name\": \"Singh\"},\n    {\"id\": 2, \"name\": \"ada\"},\n    {\"id\": 1, \"name\": \"Ada\"},\n]\n\nordered = sorted(\n    users,\n    key=lambda user: (user[\"name\"].casefold(), user[\"id\"]),\n)\n\nprint([(user[\"name\"], user[\"id\"]) for user in ordered])\nprint([1, 2] < [1, 2, 0])",
          caption: "Lexicographic tuple keys apply each field in order, so the ID resolves equal normalized names.",
        },
        recallRule: "Compare from left to right: the first unequal pair decides, and an exact shorter prefix comes first.",
      },
    ],
  },
};

const document = JSON.parse(fs.readFileSync(questionFile, "utf8"));
let curated = 0;

for (const [targetSlug, presentation] of Object.entries(presentations)) {
  const matches = document.questions.filter((question) => question.slug === targetSlug);
  if (matches.length !== 1) {
    throw new Error("Expected exactly one " + targetSlug + " question, found " + matches.length);
  }

  const speakable = matches[0].answer?.sections?.find(
    (section) => section.type === "speakable_answer",
  );
  if (!speakable) {
    throw new Error("Missing speakable_answer section for " + targetSlug);
  }

  speakable.answerSize = presentation.answerSize;
  speakable.beats = presentation.beats;
  speakable.content = presentation.beats
    .map((beat) => beat.spokenText.trim())
    .join("\n\n");
  curated += 1;
}

if (curated !== document.questions.length) {
  throw new Error("Curated " + curated + " of " + document.questions.length + " questions");
}

fs.writeFileSync(questionFile, JSON.stringify(document, null, 2) + "\n");
console.log("Curated Interview Answer presentations for " + curated + " comparison questions");
