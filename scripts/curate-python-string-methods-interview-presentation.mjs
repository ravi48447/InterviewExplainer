#!/usr/bin/env node

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const questionFile = path.join(
  repoRoot,
  "content/python-backend-fresher/python-syntax-essentials/string-methods/complete-qa.json",
);

const presentations = {
  "python-split-and-join-strings": {
    answerSize: "standard",
    beats: [
      {
        cue: "Define the two opposite text transformations",
        stage: "split creates new pieces",
        spokenText: "`text.split(separator)` turns one string into a list of substrings. `separator.join(strings)` performs the opposite shape of operation: it combines an iterable of strings into one new string and places the separator between adjacent items. Both return new objects because Python strings are immutable; neither changes the source string in place.",
      },
      {
        cue: "Separate whitespace splitting from exact-space splitting",
        stage: "Whitespace mode is special",
        spokenText: "Calling `text.split()` without an argument uses whitespace mode. Runs of whitespace count as one boundary, and leading or trailing whitespace does not create empty fields. This is not the same as `text.split(\" \")`, which looks for each exact space and can return empty strings between repeated spaces.",
        support: {
          type: "comparison",
          title: "The separator changes the splitting rule",
          items: [
            {
              label: "'  red   blue '.split()",
              value: "['red', 'blue']",
              detail: "Whitespace runs are grouped and edge whitespace is ignored.",
              tone: "green",
            },
            {
              label: "'red  blue'.split(' ')",
              value: "['red', '', 'blue']",
              detail: "Each exact space is a delimiter, so the repeated space leaves an empty field.",
              tone: "orange",
            },
          ],
        },
      },
      {
        cue: "Explain exact separators, empty fields, and maxsplit",
        stage: "Exact separators keep empties",
        spokenText: "With an explicit separator such as `\",\"`, Python looks for that exact text. Adjacent separators preserve an empty field, so `\"red,,blue\".split(\",\")` produces `['red', '', 'blue']`. The optional `maxsplit` limits how many boundaries are used; `line.split(\":\", 1)` is useful when only the first colon separates a key from a value.",
      },
      {
        cue: "Put the separator in charge of joining",
        stage: "join inserts between items",
        spokenText: "`join` belongs to the separator because that string defines the combining rule: `\", \".join(names)`. Every item must already be a string, so numbers need an explicit conversion such as `\"|\".join(str(value) for value in values)`. Collecting many pieces and joining once also avoids repeatedly creating intermediate strings in a large concatenation loop.",
        support: {
          type: "code",
          title: "Split one boundary, then join clean pieces",
          language: "python",
          code: "line = \"callback:https://example.com:8443/done\"\nkey, value = line.split(\":\", 1)\nprint(key)\nprint(value)\n\nraw_tags = \"  python   api  testing \"\ntags = raw_tags.split()\nprint(\", \".join(tags))\n\nvalues = [10, 20, 30]\nprint(\"|\".join(str(value) for value in values))",
          caption: "`maxsplit=1` preserves later colons, whitespace mode cleans the tags, and explicit conversion makes numbers joinable.",
        },
      },
      {
        cue: "Set the boundary with structured text formats",
        stage: "Formats need their own parser",
        spokenText: "Simple splitting is not a complete parser for formats with quoting or escaping rules. Use the `csv` module for real CSV and dedicated libraries for paths, URLs, and shell arguments. Choose `split` and `join` only when the separator rule truly describes the data rather than trying to reproduce a format's grammar by hand.",
        recallRule: "`split` creates pieces, `join` combines strings, and the supplied separator determines the exact boundary rule.",
      },
    ],
  },
  "python-strip-removeprefix-replace": {
    answerSize: "standard",
    beats: [
      {
        cue: "Define strip as repeated character removal at edges",
        stage: "strip trims edge characters",
        spokenText: "`strip()` removes leading and trailing whitespace. With an argument, `strip(chars)` repeatedly removes any character found in that set from both ends. It does not look for the whole argument as one substring. This makes it useful for edge punctuation or whitespace and dangerous when the code intends to remove one exact label.",
        support: {
          type: "comparison",
          title: "Match location and matching rule",
          items: [
            {
              label: "strip(chars)",
              value: "edge character set",
              detail: "Removes any listed character repeatedly from both ends.",
              tone: "orange",
            },
            {
              label: "removeprefix(text)",
              value: "exact start",
              detail: "Removes one complete leading substring when present.",
              tone: "green",
            },
            {
              label: "replace(old, new)",
              value: "all matches",
              detail: "Substitutes non-overlapping substrings throughout the value.",
              tone: "blue",
            },
          ],
        },
      },
      {
        cue: "Use an exact edge operation for an exact token",
        stage: "removeprefix matches one token",
        spokenText: "`removeprefix(prefix)` removes one exact leading substring and otherwise returns the original value unchanged. `removesuffix(suffix)` does the same at the end. These methods state the intent more safely than `strip` and more clearly than slicing after a manual `startswith` or `endswith` check.",
      },
      {
        cue: "Explain replacement across non-overlapping matches",
        stage: "replace scans all matches",
        spokenText: "`replace(old, new)` substitutes non-overlapping matches throughout the string. Its optional `count` limits how many replacements happen from the left, as in `phone.replace(\"-\", \"\", 1)`. It matches literal substrings; it does not understand words, tokens, or case-insensitive rules unless the caller handles those requirements separately.",
      },
      {
        cue: "Connect every method to string immutability",
        stage: "Strings return new values",
        spokenText: "All three methods return new strings because a Python string cannot be modified in place. Calling `name.strip()` without assigning or returning the result leaves `name` unchanged. The same rule applies to `removeprefix` and `replace`: the transformed value exists, but the original name still refers to its earlier string until it is rebound.",
        support: {
          type: "code",
          title: "Use exact edges, character edges, and substitution",
          language: "python",
          code: "header = \"Bearer abc123\"\ntoken = header.removeprefix(\"Bearer \")\nprint(token)\n\nvalue = \"...ready...\"\nprint(value.strip(\".\"))\n\nphone = \"555-010-2020\"\nprint(phone.replace(\"-\", \"\", 1))\n\nname = \"  Ada  \"\nname.strip()\nprint(repr(name))\nname = name.strip()\nprint(repr(name))",
          caption: "The final two outputs show that a string method returns a value but does not mutate the original name.",
        },
      },
      {
        cue: "Choose from matching rule before writing the call",
        stage: "Choose the matching rule",
        spokenText: "Use `strip` for a set of removable edge characters, `removeprefix` or `removesuffix` for one known edge token, and `replace` for matching substrings throughout the text. None of these methods validates structured or security-sensitive input. Parsing, normalization, and output escaping still need rules for the actual format and context.",
        recallRule: "Character set at the edges means `strip`; exact edge token means `removeprefix`; substitutions throughout mean `replace`.",
      },
    ],
  },
  "python-f-strings-format-percent-formatting": {
    answerSize: "standard",
    beats: [
      {
        cue: "Explain expression evaluation inside an f-string",
        stage: "F-strings read current values",
        spokenText: "An f-string starts with `f` and evaluates expressions inside braces when execution reaches that string. `f\"{name} owes {amount:.2f}\"` keeps a code-owned template beside the values it uses, so it is normally the clearest choice for ordinary application output. Keep expressions inside braces short and name complex calculations before formatting them.",
      },
      {
        cue: "Separate a reusable template from its values",
        stage: "format separates the template",
        spokenText: "`str.format` stores replacement fields in a string and supplies values afterward: `\"{user} owes {total:.2f}\".format(user=name, total=amount)`. Named fields suit a template that is reused independently of the immediate local expressions. The template selects supplied arguments; it does not directly evaluate arbitrary Python source expressions from the caller's scope.",
        support: {
          type: "comparison",
          title: "Choose from who owns the template",
          items: [
            {
              label: "F-string",
              value: "local code",
              detail: "Reads current expressions directly and keeps the template beside them.",
              tone: "green",
            },
            {
              label: "str.format",
              value: "reusable template",
              detail: "Fills positional or named fields with supplied arguments.",
              tone: "blue",
            },
            {
              label: "Percent style",
              value: "legacy or logging",
              detail: "Common in older code and parameterized logging APIs.",
              tone: "orange",
            },
          ],
        },
      },
      {
        cue: "Keep percent formatting in its actual use cases",
        stage: "Percent style remains useful",
        spokenText: "Percent formatting is the older form: `\"%s owes %.2f\" % (name, amount)`. It remains important when maintaining existing code. Logging commonly uses percent-style placeholders with arguments passed separately, as in `logger.info(\"loaded %d rows\", count)`, allowing the logging API to defer interpolation until the message is needed.",
      },
      {
        cue: "Apply the shared formatting mini-language",
        stage: "Format specs control display",
        spokenText: "The part after `:` controls presentation. `.2f` selects two decimal places, `>12` right-aligns within twelve characters, `,` adds grouping separators, and date objects can use directives such as `%Y-%m-%d`. F-strings and `str.format` share this formatting mini-language, while each object participates through its own formatting behavior.",
        support: {
          type: "code",
          title: "Format the same invoice values three ways",
          language: "python",
          code: "from datetime import date\n\ncustomer = \"Ada\"\ntotal = 12345.5\ntoday = date(2026, 9, 7)\n\nprint(f\"{customer:<10} {total:>12,.2f} {today:%Y-%m-%d}\")\ntemplate = \"{customer:<10} {total:>12,.2f}\"\nprint(template.format(customer=customer, total=total))\nprint(\"%-10s %12.2f\" % (customer, total))",
          caption: "All three create display text; the first two share Python's richer format specification syntax.",
        },
      },
      {
        cue: "Separate presentation formatting from safe encoding",
        stage: "Formatting is not escaping",
        spokenText: "String formatting does not escape values for SQL, HTML, URLs, or shell commands. Use database parameters and context-aware libraries for those jobs. A formatting mechanism is also not a sandbox for user-controlled templates. Prefer f-strings for nearby application values, `str.format` for reusable named templates, and percent-style arguments where an API such as logging specifically expects them.",
        recallRule: "Choose formatting by template ownership, but use dedicated parameterization or encoding whenever text crosses a structured boundary.",
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

  const speakable = matches[0].answer?.sections?.find(
    (section) => section.type === "speakable_answer",
  );
  if (!speakable) {
    throw new Error(`Missing speakable_answer section for ${targetSlug}`);
  }

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
console.log(`Curated Interview Answer presentations for ${curated} string questions`);
