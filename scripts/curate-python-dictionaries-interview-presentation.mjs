#!/usr/bin/env node

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const questionFile = path.join(
  repoRoot,
  "content/python-backend-fresher/python-data-structures-basics/dictionaries/complete-qa.json",
);

const presentations = {
  "python-dictionary-basics-hashable-keys": {
    answerSize: "standard",
    beats: [
      {
        cue: "Define the dictionary as a mutable mapping",
        stage: "A dictionary is a keyed map",
        spokenText: "A Python dictionary is a mutable mapping from unique keys to values. A key such as a user ID identifies one entry, while the value may be any Python object, including a list or another dictionary. Assigning an existing key changes that entry's value instead of creating a duplicate key.",
      },
      {
        cue: "Connect key eligibility to stable hash behavior",
        stage: "Keys must be hashable",
        spokenText: "Dictionary keys must be hashable. Their hash must remain stable during the key's lifetime, and keys that compare equal must have equal hashes. Immutable built-in values such as strings, numbers, and fully hashable tuples are common keys. Lists and dictionaries are rejected because their changing contents cannot provide that stable lookup identity.",
      },
      {
        cue: "Trace hash lookup before equality confirmation",
        stage: "Hash narrows the lookup",
        spokenText: "For `users_by_id[42]`, Python first computes the key's hash and uses it to find a small candidate region in the dictionary's table. Different keys can have the same hash, so a collision may require checking more than one candidate. This avoids scanning every entry from the beginning as a list search normally would.",
        support: {
          type: "trace",
          title: "A key reaches its stored value in two checks",
          items: [
            {
              label: "Key 42",
              value: "hash",
              detail: "Compute the stable hash for the requested key.",
              tone: "blue",
            },
            {
              label: "Table position",
              value: "candidate",
              detail: "Use the hash to narrow where Python searches.",
              tone: "blue",
            },
            {
              label: "Stored key == 42",
              value: "confirm",
              detail: "Equality distinguishes the requested key from a collision.",
              tone: "green",
            },
            {
              label: "User record",
              value: "return",
              detail: "Return the value associated with the confirmed key.",
              tone: "green",
            },
          ],
        },
      },
      {
        cue: "State average complexity and the equality boundary",
        stage: "Equality confirms the key",
        spokenText: "Hashing followed by equality gives lookup, insertion, and deletion average `O(1)` behavior, not a guarantee that every operation takes identical time. Collisions and table resizing add work. A subtle result is that `1`, `1.0`, and `True` compare equal and have compatible hashes, so they address one dictionary entry rather than three.",
      },
      {
        cue: "Separate insertion order from lookup purpose",
        stage: "Order follows insertion",
        spokenText: "Modern dictionaries iterate in insertion order. Updating an existing value keeps its key's position; deleting and reinserting that key puts it at the end. Order is useful, but choose a dictionary mainly when a meaningful stable key identifies data. Use a list for positional sequence and a set for membership without associated values.",
        support: {
          type: "code",
          title: "Build, update, and inspect a keyed index",
          language: "python",
          code: "users_by_id = {\n    7: {\"name\": \"Mina\"},\n    42: {\"name\": \"Omar\"},\n}\n\nprint(users_by_id[42][\"name\"])\nusers_by_id[42] = {\"name\": \"Omar Khan\"}\nprint(list(users_by_id))\n\nnumeric_keys = {1: \"integer\", True: \"boolean\"}\nprint(numeric_keys, len(numeric_keys))",
          caption: "Updating key `42` keeps one entry, and the equal numeric keys collapse into one mapping entry.",
        },
        recallRule: "A dictionary uses a stable key hash to narrow lookup and equality to confirm the matching entry.",
      },
    ],
  },
  "python-dict-brackets-get-setdefault": {
    answerSize: "standard",
    beats: [
      {
        cue: "Treat each access form as a missing-key policy",
        stage: "Brackets require the key",
        spokenText: "`mapping[key]` is strict lookup. It returns the stored value when the key exists and raises `KeyError` when it does not. Use brackets when absence means the program's assumptions or input are invalid and should not be silently converted into a normal default.",
        support: {
          type: "comparison",
          title: "Three meanings for an absent key",
          items: [
            {
              label: "mapping[key]",
              value: "required",
              detail: "Return the value or raise `KeyError`; do not hide absence.",
              tone: "orange",
            },
            {
              label: "mapping.get(key, default)",
              value: "optional read",
              detail: "Return a fallback without changing the dictionary.",
              tone: "blue",
            },
            {
              label: "mapping.setdefault(key, default)",
              value: "initialize",
              detail: "Insert and return the default only when the key is missing.",
              tone: "green",
            },
          ],
        },
      },
      {
        cue: "Use get for an optional read without mutation",
        stage: "get reads without inserting",
        spokenText: "`mapping.get(key, fallback)` returns the stored value or the fallback and never inserts that fallback. `request.get(\"page\", 1)` is suitable when page is optional. Calling `get` without a fallback returns `None`, which cannot distinguish an absent key from a key deliberately storing `None`; use membership or a unique sentinel when that difference matters.",
      },
      {
        cue: "Use setdefault for stored initial state",
        stage: "setdefault stores a default",
        spokenText: "`setdefault(key, default)` returns the existing value when present. When the key is missing, it inserts and returns the supplied default. In `groups.setdefault(letter, []).append(word)`, the first word for a letter creates and stores one list, and later words retrieve that same list before appending.",
      },
      {
        cue: "Explain eager argument evaluation and lazy factories",
        stage: "Default expressions run first",
        spokenText: "Python evaluates the argument passed to `setdefault` before the method call, even when the key already exists. An expensive constructor or function with side effects can therefore run unnecessarily. `collections.defaultdict` uses a factory only after a missing-key access and is often clearer when many operations repeatedly initialize the same kind of group.",
      },
      {
        cue: "Choose whether absence is error fallback or state",
        stage: "Choose an absence policy",
        spokenText: "Use brackets for required data, `get` for a read-only fallback, and `setdefault` for simple state that should be initialized and retained. The example keeps a stored `None` distinct from a missing timezone, then groups words by first letter. The access form should reveal what absence means instead of treating every missing key alike.",
        support: {
          type: "code",
          title: "Read required and optional values, then initialize groups",
          language: "python",
          code: "profile = {\"name\": \"Mina\", \"nickname\": None}\n\nprint(profile[\"name\"])\nprint(profile.get(\"timezone\", \"UTC\"))\nprint(\"timezone\" in profile)\nprint(\"nickname\" in profile, profile.get(\"nickname\"))\n\ngroups = {}\nfor word in [\"ant\", \"apple\", \"bear\"]:\n    groups.setdefault(word[0], []).append(word)\nprint(groups)",
          caption: "`get` does not insert timezone, membership preserves the `None` distinction, and `setdefault` stores each group list.",
        },
        recallRule: "Brackets require a key, `get` reads a fallback without insertion, and `setdefault` stores missing initial state.",
      },
    ],
  },
  "python-dictionary-iteration-views-and-merge": {
    answerSize: "standard",
    beats: [
      {
        cue: "Define the values produced by dictionary iteration",
        stage: "Plain iteration yields keys",
        spokenText: "Iterating directly over a dictionary yields its keys in insertion order. Use `mapping.items()` when a loop needs each key and value together, `mapping.keys()` for keys, and `mapping.values()` for values. These methods return view objects rather than frozen lists of the current entries.",
      },
      {
        cue: "Connect a view to subsequent dictionary changes",
        stage: "Views follow live changes",
        spokenText: "A dictionary view remains connected to its dictionary. If `keys = settings.keys()` and the program later adds `\"theme\"`, membership and iteration through `keys` see that new key without creating another view. The view is a window onto current state, which avoids an automatic copy but does not provide a stable snapshot.",
      },
      {
        cue: "Create a snapshot before changing dictionary size",
        stage: "Snapshots isolate iteration",
        spokenText: "Adding or deleting keys while iterating the same dictionary view may raise `RuntimeError` or prevent every intended entry from being visited. Convert to `list(mapping.items())` when the algorithm needs a fixed snapshot while it changes dictionary size. Updating a value for an existing key does not change the number of entries, but its effect should still be deliberate.",
      },
      {
        cue: "Compare mutating and non-mutating merge operations",
        stage: "Right side sets precedence",
        spokenText: "`left.update(right)` and `left |= right` mutate the left dictionary. `combined = left | right` creates a new dictionary and leaves both inputs unchanged. In every form, the right-hand value wins when both dictionaries contain the same key, so operand order expresses a real precedence policy.",
        support: {
          type: "comparison",
          title: "Choose a merge by ownership of the left mapping",
          items: [
            {
              label: "left | right",
              value: "new dictionary",
              detail: "Keep both inputs and place right-hand values over overlaps.",
              tone: "green",
            },
            {
              label: "left |= right",
              value: "mutate left",
              detail: "Update the left object's state using right-hand precedence.",
              tone: "orange",
            },
            {
              label: "left.update(right)",
              value: "mutate left",
              detail: "Method form of the same ownership choice and precedence direction.",
              tone: "blue",
            },
          ],
        },
      },
      {
        cue: "Separate insertion history from sorted presentation",
        stage: "Order follows key history",
        spokenText: "Replacing an existing value keeps the key in its current insertion position, while deleting and reinserting the key places it at the end. If output must be ordered by key or value rather than by history, sort explicitly. The example shows a live key view and uses `|` so effective settings do not overwrite the defaults object.",
        support: {
          type: "code",
          title: "Observe a live view and a non-mutating merge",
          language: "python",
          code: "defaults = {\"timeout\": 5, \"theme\": \"light\"}\nkeys = defaults.keys()\ndefaults[\"retries\"] = 2\nprint(list(keys))\n\noverrides = {\"timeout\": 10}\ncombined = defaults | overrides\nprint(combined)\nprint(defaults[\"timeout\"])\n\nfor key, value in combined.items():\n    print(key, value)",
          caption: "The view sees `retries`, while the merge gives `combined` timeout 10 and leaves the default timeout at 5.",
        },
        recallRule: "Views show current dictionary state; merge operators differ by whether they mutate the left mapping, and the right value wins.",
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
console.log(`Curated Interview Answer presentations for ${curated} dictionary questions`);
