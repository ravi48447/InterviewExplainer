#!/usr/bin/env node

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const moduleRoot = path.join(
  repoRoot,
  "content/python-backend-fresher/python-data-structures-basics",
);
const interviewProse = (value) => String(value)
  .split(/\n\s*\n/)
  .map((paragraph) => paragraph.replace(/^\s*[-*+]\s+/, ""))
  .join("\n\n");

const topicOrder = [
  "lists",
  "tuples",
  "dictionaries",
  "sets",
  "list-comprehensions",
  "dict-comprehensions",
  "nested-structures",
  "comparisons",
];

const supplementalDefinitions = [
  {
    topic: "dictionaries",
    slug: "python-dictionary-basics-hashable-keys",
    question: "What is a dictionary in Python, and how does key lookup work?",
    title: "Python Dictionary Basics and Key Lookup",
    direct: "A Python dictionary is a mutable mapping from unique, hashable keys to arbitrary values. It preserves insertion order, and lookup uses a key's hash to locate a small candidate area before equality confirms the matching key, giving average O(1) access rather than a full sequential scan.",
    quick: [
      "A dictionary maps each unique key to one value and preserves key insertion order.",
      "Keys must be hashable; values may be any Python objects.",
      "Lookup, insertion, and deletion are average O(1), not guaranteed O(1) in every case.",
      "Assigning an existing key replaces its value without adding another key.",
      "Equal numeric keys such as `1`, `1.0`, and `True` refer to the same entry.",
    ],
    answerSize: "standard",
    speaking: "- A dictionary is Python's built-in mutable mapping. It stores an association from each unique key to a value, such as a user ID to a user record. Keys must be hashable, while values can be any objects, including lists or other dictionaries.\n\n- Lookup is hash based. Python obtains the key's hash to narrow the search to a candidate location and then uses equality to confirm the match. That design gives lookup, insertion, and deletion average O(1) behavior, although collisions and resizing mean it is not a promise that every operation takes identical time.\n\n- For example, `users_by_id[42]` expresses direct lookup by ID. With a list of users, the program would normally scan records until it found ID 42, which is O(n). Assigning `users_by_id[42] = updated_user` replaces that key's value; it does not create a duplicate key.\n\n- Dictionaries preserve insertion order in modern Python. Updating an existing key keeps its position, while deleting and reinserting it places it at the end. Order is useful, but the main reason to choose a dictionary remains its key-to-value relationship.\n\n- A subtle boundary is equality between keys. Values such as `1`, `1.0`, and `True` compare equal and have compatible hashes, so they address one dictionary entry rather than three. Mutable containers such as lists cannot be keys because their changing value would break stable hash lookup.\n\n- I use a dictionary when a meaningful, stable key identifies data. If I only need a sequence or unique membership without associated values, a list or set communicates the model more clearly.",
    teachingTitle: "Hash narrows the search; equality confirms it",
    teaching: "A dictionary is not a list of pairs searched from the beginning. Its table uses a hash value to choose where a key should be sought. Different keys can collide, so Python still compares candidate keys for equality. Correct custom keys must therefore keep their hash stable and ensure equal objects have equal hashes.\n\nAs entries are added, Python may resize the table to preserve efficient lookup. That internal work is why average complexity is the honest description. Application code should treat order as an iteration guarantee, not as a substitute for sorting by business fields.",
    visualType: "flow_diagram",
    visualTitle: "A dictionary lookup in two checks",
    visual: `\`\`\`mermaid
flowchart LR\n  K[\"key: 42\"] --> H[Compute stable hash]\n  H --> C[Find candidate table slot]\n  C --> E{Stored key equals 42?}\n  E -- Yes --> V[Return user value]\n  E -- Collision --> C2[Check another candidate]\n\`\`\``,
    codeTitle: "Build and update a keyed index",
    code: `\`\`\`python
users_by_id = {
    7: {\"name\": \"Mina\"},
    42: {\"name\": \"Omar\"},
}

print(users_by_id[42][\"name\"])  # Omar
users_by_id[42] = {\"name\": \"Omar Khan\"}
print(list(users_by_id))           # [7, 42]

numeric_keys = {1: \"integer\", True: \"boolean\"}
print(numeric_keys, len(numeric_keys))  # {1: 'boolean'} 1
\`\`\``,
    followups: [
      "Why must dictionary keys be hashable?",
      "Is dictionary lookup guaranteed to be O(1) for every operation?",
      "What happens to insertion order when a key is deleted and reinserted?",
    ],
  },
  {
    topic: "dictionaries",
    slug: "python-dict-brackets-get-setdefault",
    question: "What is the difference between dictionary brackets, `get`, and `setdefault`?",
    title: "Dictionary Brackets vs get vs setdefault",
    direct: "`mapping[key]` requires a key and raises `KeyError` when it is missing, while `mapping.get(key, default)` returns a fallback without modifying the dictionary. `mapping.setdefault(key, default)` returns the existing value or inserts and returns the supplied default when the key is absent.",
    quick: [
      "Use `mapping[key]` when absence is an error that should not be hidden.",
      "Use `get` for an optional read; it never inserts the fallback.",
      "`get(key)` returns `None` by default, which can be ambiguous when `None` is stored.",
      "`setdefault` inserts its default only for a missing key and returns the resulting value.",
      "The argument passed to `setdefault` is evaluated before the method call, even if the key exists.",
    ],
    answerSize: "standard",
    speaking: "- Bracket lookup, `get`, and `setdefault` describe three different missing-key policies. `mapping[key]` is strict: it returns the value when the key exists and raises `KeyError` otherwise. That is useful when missing data means the program's assumptions are wrong.\n\n- `mapping.get(key, fallback)` is an optional read. It returns the stored value or the fallback and leaves the dictionary unchanged. For example, `request.get(\"page\", 1)` can supply a normal default. Calling `get` without a fallback returns `None`, so it cannot distinguish a missing key from a key explicitly mapped to `None`.\n\n- `setdefault` combines a read with conditional insertion. `groups.setdefault(letter, []).append(word)` creates and stores an empty list the first time a letter appears, then reuses the stored list. If the key already exists, its value is returned and the dictionary is not overwritten.\n\n- A boundary is evaluation timing: Python evaluates the default expression before calling `setdefault`, even when the key exists. An expensive factory or object with side effects should not be placed there casually. `collections.defaultdict` calls its factory only after a missing-key access and is often clearer for repeated grouping.\n\n- I use brackets for required fields, `get` for optional reads, and `setdefault` for simple accumulate-by-key code. The choice should make absence visible as an error, a read fallback, or stored initial state rather than treating all three cases alike.",
    teachingTitle: "Missing data has three distinct meanings",
    teaching: "A missing key can signal invalid state, an optional field, or the first occurrence of a group. Brackets preserve the first meaning by raising. `get` models the second without changing state. `setdefault` models the third by making the initial value part of the mapping.\n\nBe careful with `None`: `mapping.get(key)` produces `None` both when the key is absent and when its stored value is `None`. Use `key in mapping`, a private sentinel, or strict brackets when that distinction affects correctness.",
    visualType: "flow_diagram",
    visualTitle: "Choose a missing-key policy",
    visual: `\`\`\`mermaid
flowchart TD\n  M[Key may be absent] --> Q{What should absence mean?}\n  Q -- Invalid state --> B[\"mapping[key] → KeyError\"]\n  Q -- Optional read --> G[\"get → fallback, no insertion\"]\n  Q -- Initialize group --> S[\"setdefault → insert and return default\"]\n\`\`\``,
    codeTitle: "Compare the three outcomes",
    code: `\`\`\`python
profile = {\"name\": \"Mina\", \"nickname\": None}

print(profile[\"name\"])             # Mina
print(profile.get(\"timezone\", \"UTC\"))  # UTC
print(\"timezone\" in profile)       # False

groups = {}
for word in [\"ant\", \"apple\", \"bear\"]:
    groups.setdefault(word[0], []).append(word)
print(groups)  # {'a': ['ant', 'apple'], 'b': ['bear']}
\`\`\``,
    followups: [
      "How can you distinguish a missing key from a stored `None` value?",
      "When is `defaultdict` clearer than repeated `setdefault` calls?",
      "Why can an expensive `setdefault` argument still do unnecessary work?",
    ],
  },
  {
    topic: "dictionaries",
    slug: "python-dictionary-iteration-views-and-merge",
    question: "How do dictionary iteration, view objects, and merging work in Python?",
    title: "Dictionary Iteration, Views, and Merging",
    direct: "Iterating over a dictionary yields keys in insertion order; `keys()`, `values()`, and `items()` return dynamic views backed by the dictionary. `update` and `|=` mutate the left dictionary, while `left | right` creates a new dictionary, and right-hand values win for duplicate keys.",
    quick: [
      "Plain dictionary iteration yields keys in insertion order.",
      "Use `items()` when a loop needs each key and value together.",
      "Dictionary views are dynamic, so later dictionary changes are visible through them.",
      "Do not add or delete keys while iterating the same dictionary view.",
      "`left | right` returns a new dictionary; `update` and `|=` change the left dictionary.",
      "During a merge, the right-hand value replaces a left-hand value for the same key.",
    ],
    answerSize: "standard",
    speaking: "- Iterating directly over a dictionary produces its keys in insertion order. `for key, value in mapping.items()` is the normal form when both parts are needed, while `keys()` and `values()` expose just one side. These methods return view objects rather than frozen lists.\n\n- A view remains connected to its dictionary. For example, if `keys = settings.keys()` and the program later adds `\"theme\"`, that key becomes visible through `keys` without creating another view. This saves copying and represents current state, but adding or deleting entries while iterating can raise `RuntimeError` or skip work. A list conversion provides a stable snapshot when one is required.\n\n- Dictionaries can be merged destructively or non-destructively. `settings.update(overrides)` and `settings |= overrides` mutate `settings`. `combined = settings | overrides` creates a new dictionary and leaves both inputs alone. In every form, a duplicate key receives the right-hand value.\n\n- Insertion order has a precise boundary. Replacing an existing value does not move its key. Deleting the key and inserting it again places it at the end. If output must be ordered by key or value rather than history, I sort explicitly.\n\n- For example, an application can merge defaults with environment-specific overrides using `defaults | overrides`, then iterate `combined.items()` to render the effective settings. I choose `|` when retaining the inputs matters and `update` when the left object intentionally owns the new state.",
    teachingTitle: "Views expose live dictionary state",
    teaching: "A view behaves more like a window than a snapshot. It references the dictionary's current entries, so membership and iteration see subsequent changes. Convert it with `list(...)` when the algorithm needs a fixed snapshot or must safely change dictionary size during the loop.\n\nMerge order encodes precedence. Starting with defaults and placing user values on the right means user values win. Reversing the operands reverses that policy, so the expression should read in the same direction as the configuration rule.",
    visualType: "flow_diagram",
    visualTitle: "Merge direction defines precedence",
    visual: `\`\`\`mermaid
flowchart LR\n  D[\"defaults: timeout=5, theme=light\"] --> M[\"defaults | overrides\"]\n  O[\"overrides: timeout=10\"] --> M\n  M --> R[\"new dict: timeout=10, theme=light\"]\n\`\`\`\n\nThe right dictionary wins only where a key overlaps; other entries remain.`,
    codeTitle: "Inspect a live view and a non-mutating merge",
    code: `\`\`\`python
defaults = {\"timeout\": 5, \"theme\": \"light\"}
keys = defaults.keys()
defaults[\"retries\"] = 2
print(list(keys))  # ['timeout', 'theme', 'retries']

overrides = {\"timeout\": 10}
combined = defaults | overrides
print(combined)          # timeout is 10
print(defaults[\"timeout\"])  # original remains 5

for key, value in combined.items():
    print(key, value)
\`\`\``,
    followups: [
      "Why are dictionary views called dynamic?",
      "What is the mutation difference between `|` and `|=`?",
      "Which value wins when merged dictionaries contain the same key?",
    ],
  },
  {
    topic: "sets",
    slug: "python-set-basics-membership-and-deduplication",
    question: "What is a set in Python, and when is it useful?",
    title: "Python Set Basics",
    direct: "A Python set is a mutable, unordered collection of distinct hashable elements. It is useful when uniqueness, average O(1) membership checks, or mathematical set operations matter, but it discards duplicate counts and should not be used when positional or insertion-order output is required.",
    quick: [
      "A set stores each distinct hashable value at most once.",
      "Membership checks are average O(1), compared with O(n) scanning for a list.",
      "Use `set()` for an empty set because `{}` creates an empty dictionary.",
      "Sets are ideal for deduplication, seen-value tracking, and set relationships.",
      "Do not rely on set iteration order, and remember that conversion loses duplicate counts.",
    ],
    answerSize: "compact",
    speaking: "- A set is Python's mutable collection for distinct hashable values. Adding a value already present does not create a duplicate, and membership tests use hash lookup with average O(1) behavior. Sets do not provide indexes or a sequence-order contract.\n\n- For example, a duplicate-email check can keep a `seen` set. For each email, the program first tests `email in seen`; a match means it appeared earlier, otherwise the program adds it. That turns repeated list scans into one pass with average constant-time membership checks.\n\n- Set conversion is also a concise deduplication tool, but it changes the information model. `set([\"a\", \"b\", \"a\"])` retains only `\"a\"` and `\"b\"`; it does not remember that `\"a\"` appeared twice, and code should not depend on its iteration order.\n\n- Elements must be hashable, so strings and tuples of hashable values work, while lists and dictionaries do not. I choose a set when the question is “have I seen this?” or “which values are shared?” and keep a list or dictionary when position, duplicates, or associated data matters.",
    teachingTitle: "A set changes the question from position to membership",
    teaching: "A sequence answers “what is at position i?” A set answers “is this value present?” Its table uses hashes similarly to dictionary keys, which is why mutable containers cannot be elements. The data structure removes duplicate identity from the model instead of merely hiding duplicates in the display.\n\nThis makes a set powerful for validation and joins between small in-memory groups. It can also be the wrong choice: if the number of occurrences is important, use `Counter`; if first-seen order must be retained, combine a set for membership with a list for output or use `dict.fromkeys` for hashable values.",
    visualType: "flow_diagram",
    visualTitle: "One-pass duplicate detection",
    visual: `\`\`\`mermaid
flowchart LR\n  V[Read next value] --> Q{Value in seen?}\n  Q -- Yes --> D[Report duplicate]\n  Q -- No --> A[Add to seen]\n  A --> V\n\`\`\``,
    codeTitle: "Find duplicates while preserving discovery order",
    code: `\`\`\`python
values = [\"a\", \"b\", \"a\", \"c\", \"b\"]
seen = set()
duplicates = []

for value in values:
    if value in seen and value not in duplicates:
        duplicates.append(value)
    seen.add(value)

print(seen)        # {'a', 'b', 'c'} in an unspecified display order
print(duplicates)  # ['a', 'b']
\`\`\``,
    followups: [
      "Why can a list not be stored inside a set?",
      "How would you count duplicates rather than only detect them?",
      "How can you remove duplicates while preserving first-seen order?",
    ],
  },
  {
    topic: "sets",
    slug: "python-set-union-intersection-difference",
    question: "How do union, intersection, difference, and symmetric difference work on Python sets?",
    title: "Python Set Operations",
    direct: "Union keeps values from either set, intersection keeps values common to both, difference keeps values in the left set but not the right, and symmetric difference keeps values in exactly one set. Python writes these as `|`, `&`, `-`, and `^` respectively.",
    quick: [
      "`a | b` is the union: values present in `a`, `b`, or both.",
      "`a & b` is the intersection: values present in both sets.",
      "`a - b` is the directional difference: values in `a` but not `b`.",
      "`a ^ b` is the symmetric difference: values present in exactly one set.",
      "`a <= b` checks whether `a` is a subset of `b`; `a.isdisjoint(b)` checks for no overlap.",
    ],
    answerSize: "compact",
    speaking: "- Set operations describe relationships between groups without manual nested loops. Union, written `a | b`, contains every value found in either input. Intersection, `a & b`, contains only values shared by both.\n\n- Difference is directional. `a - b` keeps values that belong to `a` and removes any also present in `b`; swapping the operands can produce a different result. Symmetric difference, `a ^ b`, keeps values that belong to exactly one input and removes their overlap.\n\n- For example, if `required = {\"python\", \"sql\"}` and `known = {\"python\", \"git\"}`, then `required - known` is `{\"sql\"}`, the missing skill. `required & known` is `{\"python\"}`, while `required | known` is the complete combined skill set.\n\n- Relationship methods can be even clearer for boolean questions: `required <= known` asks whether every required value is known, and `a.isdisjoint(b)` asks whether there is no shared value. I use these operations when the domain is about membership; if repeated counts or ordering affect the result, a plain set has already thrown away needed information.",
    teachingTitle: "Set algebra turns loops into named relationships",
    teaching: "Each operation selects regions of two conceptual circles. Intersection selects the overlap. The two differences select opposite non-overlapping sides. Symmetric difference selects both sides but excludes the centre, while union selects every region.\n\nOperators require set-like operands, whereas method forms such as `intersection(iterable)` can accept general iterables. Both create new sets unless an updating method such as `intersection_update` is used. Choosing a non-mutating form is safer when later code still needs the originals.",
    visualType: "comparison_table",
    visualTitle: "Which region does each operation keep?",
    visual: "| Expression | Kept region | Question it answers |\n|---|---|---|\n| `a | b` | both sets | What appears anywhere? |\n| `a & b` | overlap | What do they share? |\n| `a - b` | left-only | What is missing from `b`? |\n| `a ^ b` | either side, not overlap | What differs between them? |\n| `a <= b` | boolean relationship | Is all of `a` contained in `b`? |",
    codeTitle: "Compare required and known skills",
    code: `\`\`\`python
required = {\"python\", \"sql\"}
known = {\"python\", \"git\"}

print(required | known)   # {'python', 'sql', 'git'}
print(required & known)   # {'python'}
print(required - known)   # {'sql'}
print(required ^ known)   # {'sql', 'git'}
print(required <= known)  # False
\`\`\``,
    followups: [
      "Why does reversing a set difference change the answer?",
      "What is the difference between symmetric difference and union?",
      "Which set methods mutate the original set?",
    ],
  },
  {
    topic: "sets",
    slug: "python-set-vs-frozenset",
    question: "What is the difference between `set` and `frozenset` in Python?",
    title: "Set vs Frozenset in Python",
    direct: "Both `set` and `frozenset` hold distinct hashable elements and support non-mutating set operations. A `set` can add or remove elements and is unhashable; a `frozenset` cannot change after creation and is hashable when its elements are hashable, so it can itself be a dictionary key or set element.",
    quick: [
      "`set` is mutable; `frozenset` is immutable.",
      "Both types store unique hashable elements and support membership and set algebra.",
      "A normal set cannot be a dictionary key or another set's element.",
      "A frozenset is hashable and can represent an unordered composite key.",
      "Use frozenset only when the group itself needs stable, value-based identity.",
    ],
    answerSize: "compact",
    speaking: "- A `set` and a `frozenset` represent the same core relationship: an unordered collection of distinct hashable elements. Both support membership tests, union, intersection, difference, and comparisons such as subset checks.\n\n- The difference is whether the container can change. A set has methods such as `add`, `remove`, and `update`, so it is mutable and cannot be hashed. A frozenset has no mutating operations, and its stable value makes the frozenset itself hashable.\n\n- For example, a normal set is useful while collecting permissions. A frozenset is useful when the complete permission group becomes a cache key: `cache[frozenset({\"read\", \"write\"})]`. Reversing construction order produces an equal key because set identity is based on membership, not position.\n\n- A frozenset is not simply a faster set, and it does not make mutable elements acceptable; its elements must still be hashable. I use it when an unordered group must remain fixed or participate inside another hash-based collection. Otherwise, an ordinary set is more direct for evolving membership.",
    teachingTitle: "Container mutability determines whether the group has a stable hash",
    teaching: "A set's membership can change, so a value-based hash could change as elements are added or removed. Storing that set as a key would make its table location unreliable. Frozenset closes the mutation operations, allowing Python to derive a stable hash from its members.\n\nTuple and frozenset encode different composite meanings. A tuple key preserves position and order; a frozenset key deliberately treats `{A, B}` and `{B, A}` as the same group. The domain's equality rule should choose between them.",
    visualType: "comparison_table",
    visualTitle: "Same membership model, different container contract",
    visual: "| Property | `set` | `frozenset` |\n|---|---:|---:|\n| Unique elements | Yes | Yes |\n| Add or remove after creation | Yes | No |\n| Hashable container | No | Yes |\n| Can be a dictionary key | No | Yes |\n| Best fit | Evolving membership | Fixed unordered value |",
    codeTitle: "Use an unordered group as a cache key",
    code: `\`\`\`python
permissions = {\"read\"}
permissions.add(\"write\")

group = frozenset(permissions)
cache = {group: \"read-write policy\"}

same_group = frozenset([\"write\", \"read\"])
print(cache[same_group])  # read-write policy
print(group == same_group)  # True
\`\`\``,
    followups: [
      "Why is a normal set unhashable?",
      "When would a tuple be a better key than a frozenset?",
      "Can a frozenset contain a list?",
    ],
  },
  {
    topic: "list-comprehensions",
    slug: "python-list-comprehension-syntax-filter-transform",
    question: "How does a list comprehension work in Python?",
    title: "Python List Comprehension Syntax",
    direct: "A list comprehension creates a new list by iterating over an iterable, optionally filtering items, and evaluating one result expression for each accepted item. The usual form is `[expression for item in iterable if condition]`, and its clauses execute in the same order as the equivalent nested loops.",
    quick: [
      "The expression at the front becomes each output element.",
      "The `for` clause supplies source values from left to right.",
      "A trailing `if` filters source values before the result expression is collected.",
      "The comprehension builds a new list and does not modify the source by itself.",
      "Prefer a regular loop when the transformation needs side effects or several hard-to-read steps.",
    ],
    answerSize: "compact",
    speaking: "- A list comprehension is compact syntax for building a new list from an iterable. In `[expression for item in source if condition]`, Python visits each source item, tests the optional condition, evaluates the expression for accepted items, and appends each result to a new list.\n\n- For example, `[price * 1.18 for price in prices if price > 0]` filters out non-positive prices and transforms the remaining values by adding tax. It expresses one mapping and one filter without manually creating a list and calling `append`.\n\n- The output expression comes first in the syntax, but the mental execution order begins at the `for`: get an item, apply the filter, then calculate the output. Multiple `for` clauses behave like nested loops in the same left-to-right order.\n\n- A comprehension is an expression and should mainly describe value production. I use it for a short, readable transformation or filter. If the body needs logging, mutation, exception handling, or several named intermediate decisions, a normal loop is clearer and easier to debug.",
    teachingTitle: "Read the syntax in execution order",
    teaching: "The displayed order and runtime order differ slightly. Begin reading at the first `for`, follow later `for` and `if` clauses in sequence, then return to the leading expression to produce one output. This translation makes nested comprehensions less mysterious.\n\nThe loop variable has its own comprehension scope in Python 3, so it does not overwrite a same-named variable outside. The comprehension still eagerly constructs the full result list; that memory behavior differs from a generator expression.",
    visualType: "flow_diagram",
    visualTitle: "One comprehension iteration",
    visual: `\`\`\`mermaid
flowchart LR\n  S[Take next source item] --> F{Condition true?}\n  F -- No --> S\n  F -- Yes --> E[Evaluate output expression]\n  E --> A[Append result to new list]\n  A --> S\n\`\`\``,
    codeTitle: "Translate a comprehension into a loop",
    code: `\`\`\`python
prices = [10, -2, 25]
with_tax = [round(price * 1.18, 2) for price in prices if price > 0]

equivalent = []
for price in prices:
    if price > 0:
        equivalent.append(round(price * 1.18, 2))

print(with_tax)             # [11.8, 29.5]
print(with_tax == equivalent)  # True
\`\`\``,
    followups: [
      "In what order are a comprehension's filter and result expression evaluated?",
      "Does a list comprehension modify its source iterable?",
      "When is a regular `for` loop clearer than a comprehension?",
    ],
  },
  {
    topic: "list-comprehensions",
    slug: "python-list-comprehension-multiple-for-if-clauses",
    question: "How are multiple `for` and `if` clauses evaluated in a Python list comprehension?",
    title: "Multiple Clauses in a List Comprehension",
    direct: "Multiple comprehension clauses run from left to right in the same order as equivalent nested loops. Each `for` introduces a value for the clauses to its right, and each `if` filters at its exact position before execution continues toward the leading result expression.",
    quick: [
      "Read multiple clauses from left to right after identifying the leading result expression.",
      "Two `for` clauses behave like nested loops in the same order.",
      "An `if` can use names introduced by `for` clauses to its left, not its right.",
      "The result expression runs only after every filter on that path succeeds.",
      "Comprehension loop variables do not leak into the surrounding scope in Python 3.",
    ],
    answerSize: "compact",
    speaking: "- With several clauses, a list comprehension follows the same control flow as nested `for` statements and `if` statements written in that order. The leading expression describes the output, but execution begins at the first `for` and moves through the remaining clauses from left to right.\n\n- For example, `[(x, y) for x in [1, 2] for y in [10, 11] if (x + y) % 2 == 0]` first chooses one `x`, then tries every `y` for that `x`, then keeps only pairs with an even sum. The tuple expression runs only for pairs that pass the filter.\n\n- A filter may use any name introduced to its left. Moving `if x > 0` before the inner `for` can avoid running that inner loop for rejected `x` values, while a condition involving `y` must appear after `y` is introduced.\n\n- In Python 3, the comprehension's loop variables have their own scope, so an outside `x` is not overwritten. I keep one or two clauses when the result remains easy to read; if the logic needs several filters, side effects, or explanations, explicit nested loops make the same execution order clearer.",
    teachingTitle: "Translate clauses directly into indented control flow",
    teaching: "Place the first `for` at the outer indentation level. Every later `for` becomes a nested loop, and an `if` becomes a guard at its position. The leading expression becomes the final append after all guards pass. This mechanical translation preserves both ordering and the number of times each expression runs.\n\nClause placement can affect work even when it produces the same values. A filter that depends only on an outer variable can reject that branch before an expensive inner iterable is traversed. A filter cannot refer to a later loop variable because that name has not been bound on that path.",
    visualType: "flow_diagram",
    visualTitle: "Two loops and one filter",
    visual: `\`\`\`mermaid
flowchart LR
  X[Choose next x] --> Y[Choose next y for x]
  Y --> Q{Pair passes filter?}
  Q -- Yes --> A[Append result expression]
  Q -- No --> Y
  A --> Y
\`\`\``,
    codeTitle: "Expand two clauses into nested loops",
    code: `\`\`\`python
xs = [1, 2]
ys = [10, 11]
pairs = [(x, y) for x in xs for y in ys if (x + y) % 2 == 0]

equivalent = []
for x in xs:
    for y in ys:
        if (x + y) % 2 == 0:
            equivalent.append((x, y))

print(pairs)                # [(1, 11), (2, 10)]
print(pairs == equivalent)  # True
\`\`\``,
    followups: [
      "How do two comprehension `for` clauses translate into normal loops?",
      "Why can a filter use only names introduced to its left?",
      "When should nested comprehension logic become an explicit loop?",
    ],
  },
  {
    topic: "dict-comprehensions",
    slug: "python-dictionary-comprehension-syntax",
    question: "How does a dictionary comprehension work in Python?",
    title: "Python Dictionary Comprehension Syntax",
    direct: "A dictionary comprehension creates a new dictionary by evaluating a key expression and a value expression for each accepted source item. Its form is `{key_expression: value_expression for item in iterable if condition}`, and later results overwrite earlier values when they produce equal keys.",
    quick: [
      "A dictionary comprehension needs both a key expression and a value expression.",
      "The `for` clause supplies source items, and an optional trailing `if` filters them.",
      "Each accepted item assigns one key-value pair into a new dictionary.",
      "If two generated keys are equal, the later value replaces the earlier value.",
      "Use a loop when duplicate handling, validation, or several steps need to be explicit.",
    ],
    answerSize: "compact",
    speaking: "- A dictionary comprehension builds a new mapping from an iterable. The syntax is `{key_expression: value_expression for item in source if condition}`. For each accepted item, Python evaluates the key and value and assigns that pair into the result dictionary.\n\n- For example, `{user[\"id\"]: user[\"name\"] for user in users if user[\"active\"]}` creates a direct ID-to-name index for active users. The key expression defines how data will later be found, and the value expression defines what the lookup returns.\n\n- Generated keys must be hashable. If several source items produce equal keys, normal dictionary assignment rules apply: the later value replaces the earlier one, while that key keeps its first insertion position. This can be useful for intentional precedence but dangerous when duplicates represent invalid data.\n\n- I use a dictionary comprehension for a short transformation with a clear uniqueness assumption. If I must report duplicates, group several values under one key, or calculate through multiple steps, I use a regular loop so the collision policy and intermediate names remain visible.",
    teachingTitle: "A comprehension repeatedly performs dictionary assignment",
    teaching: "The easiest translation is to imagine an empty result followed by a loop. Each iteration calculates a key and a value, then executes `result[key] = value`. This explains both the hashability requirement and last-value-wins behavior.\n\nThe output is a new dictionary, but the objects used as values are not automatically copied. If the comprehension stores an existing list from each source record, both structures can still refer to that same list.",
    visualType: "flow_diagram",
    visualTitle: "From source record to indexed entry",
    visual: `\`\`\`mermaid
flowchart LR\n  R[Read user record] --> F{active?}\n  F -- No --> R\n  F -- Yes --> K[Evaluate user id key]\n  K --> V[Evaluate user name value]\n  V --> A[Assign result[id] = name]\n\`\`\``,
    codeTitle: "Index active users by ID",
    code: `\`\`\`python
users = [
    {\"id\": 7, \"name\": \"Mina\", \"active\": True},
    {\"id\": 9, \"name\": \"Omar\", \"active\": False},
    {\"id\": 12, \"name\": \"Lee\", \"active\": True},
]

active_names = {
    user[\"id\"]: user[\"name\"]
    for user in users
    if user[\"active\"]
}
print(active_names)  # {7: 'Mina', 12: 'Lee'}
\`\`\``,
    followups: [
      "What happens when two items generate the same dictionary key?",
      "Does a dictionary comprehension deep-copy its values?",
      "When is a loop clearer than a dictionary comprehension?",
    ],
  },
  {
    topic: "dict-comprehensions",
    slug: "python-invert-dictionary-duplicate-values",
    question: "How can you invert a dictionary, and what happens when values are duplicated?",
    title: "Inverting a Python Dictionary Safely",
    direct: "For unique, hashable values, `{value: key for key, value in original.items()}` reverses a dictionary. When several keys share one value, that comprehension loses earlier keys because the generated key repeats; preserve all relationships by grouping original keys in a list or set for each value.",
    quick: [
      "Simple inversion works only when original values are hashable and unique for the required result.",
      "A repeated original value becomes a repeated output key, so the last source key wins.",
      "Use a dictionary of lists when one value may belong to several original keys.",
      "Validate uniqueness before inversion when duplicates should be treated as invalid input.",
      "Choose list or set groups depending on whether order and repeated source relationships matter.",
    ],
    answerSize: "standard",
    speaking: "- Inverting a dictionary means turning each original value into a key and each original key into its value. When every original value is unique and hashable, `{value: key for key, value in original.items()}` is a concise solution.\n\n- The important boundary is that dictionaries require unique keys. If `{'a': 1, 'b': 1}` is inverted with a comprehension, both source pairs generate the key `1`, and the later assignment replaces the earlier one. The result keeps only `{1: 'b'}`, so information has been lost.\n\n- The correct result depends on the data relationship. If repeated values are valid, I build a reverse index such as `{1: ['a', 'b']}` by grouping keys under each value. If values are supposed to be unique, I validate that rule and raise an error instead of silently accepting last-value-wins behavior.\n\n- For example, a country-by-code dictionary can be inverted when each code is unique. A department-by-employee mapping usually cannot become one employee-to-department value without checking its business rules, while a colour-to-product reverse index naturally needs multiple products per colour.\n\n- Original values must also be hashable to become keys; a list value cannot be used directly. I treat inversion as a relationship change rather than a syntax trick, then choose one-to-one validation or one-to-many grouping so the output preserves the facts the application needs.",
    teachingTitle: "Inversion can change a one-to-one mapping into one-to-many",
    teaching: "The forward dictionary guarantees only that each original key appears once. It says nothing about whether values repeat. After swapping the sides, repeated values collide because the new dictionary demands unique keys.\n\nA grouped reverse index preserves the missing dimension. Each incoming pair appends its old key to a collection stored under the old value. This is a different data model from a simple inversion, and its type makes multiplicity visible to later code.",
    visualType: "flow_diagram",
    visualTitle: "Why duplicate values collide",
    visual: `\`\`\`mermaid
flowchart LR\n  A[\"'a' → 1\"] --> K[\"new key 1\"]\n  B[\"'b' → 1\"] --> K\n  K --> L[\"simple inversion: last value only\"]\n  K --> G[\"grouped inversion: ['a', 'b']\"]\n\`\`\``,
    codeTitle: "Preserve every reverse relationship",
    code: `\`\`\`python
from collections import defaultdict

original = {\"a\": 1, \"b\": 1, \"c\": 2}
simple = {value: key for key, value in original.items()}

grouped = defaultdict(list)
for key, value in original.items():
    grouped[value].append(key)

print(simple)         # {1: 'b', 2: 'c'}
print(dict(grouped))  # {1: ['a', 'b'], 2: ['c']}
\`\`\``,
    followups: [
      "Why does a simple inversion keep only the last key for a repeated value?",
      "How would you reject duplicate values instead of grouping them?",
      "What must be true about original values before they become dictionary keys?",
    ],
  },
  {
    topic: "nested-structures",
    slug: "python-nested-dictionaries-lists-json-data",
    question: "How do you read and update nested dictionaries and lists in Python?",
    title: "Working with Nested Python Data",
    direct: "Read a nested structure one level at a time using dictionary keys and list indexes, and validate optional boundaries before continuing deeper. Direct chained access is suitable for required, trusted shapes; external JSON needs explicit checks, defaults, or normalization so a missing key, wrong type, or short list produces a clear result.",
    quick: [
      "Read the data shape first: dictionary levels use keys and list levels use integer indexes.",
      "Chained brackets are concise but fail at the first missing key, wrong type, or invalid index.",
      "Use `get` only for genuinely optional dictionary fields and choose an unambiguous fallback.",
      "Validate external JSON at its boundary instead of scattering defensive access everywhere.",
      "Assigning through a nested path mutates the existing nested object unless you copied it first.",
    ],
    answerSize: "standard",
    speaking: "- Nested Python data combines containers, commonly dictionaries for named fields and lists for repeated records. To reach a value, I follow the shape one step at a time. In `payload[\"users\"][0][\"email\"]`, the first lookup returns a list, index `0` returns a dictionary, and the final key returns the email.\n\n- Chained brackets are appropriate when the schema guarantees every step. A missing dictionary key raises `KeyError`, an unavailable position raises `IndexError`, and using a string key on a list or an integer index on a dictionary raises `TypeError` or a key failure. These errors often show that the assumed shape differs from the real input.\n\n- External JSON needs a deliberate boundary. For example, an API parser can require `users` to be a list, check that it is non-empty, and require each selected record to contain a string email. Once that validation succeeds, the rest of the application can use a normalized object instead of repeating long chains of `get`.\n\n- Optional fields should remain visibly optional. `profile.get(\"nickname\")` is suitable if absence is normal, but a required ID should use strict access or schema validation so corruption is not converted into a vague `None`.\n\n- Updating `payload[\"users\"][0][\"active\"] = True` changes the nested dictionary held by that payload. If another name or shallow copy shares it, the update is visible there too. I separate shape validation from business changes and copy only at the ownership boundary that needs isolation.",
    teachingTitle: "Each access step has its own expected container type",
    teaching: "A path through nested data is a sequence of contracts. A string key expects a mapping, an integer position expects a sequence, and each successful lookup determines the type expected by the next step. Splitting a long chain into named variables makes the failing contract easier to identify.\n\nNormalization reduces complexity after the boundary. Instead of letting every function understand an unpredictable API shape, one parser can reject malformed input and return a small internal record with stable fields. This is usually clearer than deeply nested default expressions that hide missing required data.",
    visualType: "flow_diagram",
    visualTitle: "Trace the container at each path segment",
    visual: `\`\`\`mermaid
flowchart LR\n  P[payload dict] -->|\"users\"| L[users list]\n  L -->|index 0| U[user dict]\n  U -->|\"email\"| E[email string]\n\`\`\`\n\nEach arrow changes the current object, so the next key or index must match that object's type.`,
    codeTitle: "Validate a small JSON-shaped boundary",
    code: `\`\`\`python
def first_email(payload):
    users = payload.get(\"users\")
    if not isinstance(users, list) or not users:
        raise ValueError(\"users must be a non-empty list\")

    email = users[0].get(\"email\")
    if not isinstance(email, str) or not email:
        raise ValueError(\"first user needs an email\")
    return email

data = {\"users\": [{\"email\": \"mina@example.com\"}]}
print(first_email(data))  # mina@example.com
\`\`\``,
    followups: [
      "Which exceptions can a chained nested lookup raise?",
      "Why should required and optional fields use different access policies?",
      "How does boundary normalization simplify later application code?",
    ],
  },
  {
    topic: "nested-structures",
    slug: "python-flatten-nested-list-one-level-recursive",
    question: "How do you flatten nested lists in Python, and when should flattening stop?",
    title: "Flattening Nested Lists Safely",
    direct: "For a known two-level list, flatten one level with a nested loop or comprehension. Recursive flattening needs an explicit definition of which objects count as nested containers and a base case; otherwise strings may split into characters, dictionaries may become keys, and meaningful grouping may be destroyed.",
    quick: [
      "Use `[item for group in groups for item in group]` for a known two-level structure.",
      "Read multiple comprehension `for` clauses in the same order as nested loops.",
      "Recursive flattening needs a base case and a precise container rule.",
      "Do not treat every iterable as a nested group; strings and dictionaries need a policy.",
      "Flatten only when the original grouping carries no information needed later.",
    ],
    answerSize: "standard",
    speaking: "- Flattening converts nested groups into a single sequence, but the algorithm depends on the promised depth. For a two-level list such as `[[1, 2], [3], [4, 5]]`, a nested loop or `[item for group in groups for item in group]` gives `[1, 2, 3, 4, 5]`.\n\n- The two `for` clauses follow the same order as their loop version: take a group first, then take each item from that group. This is appropriate only when every outer element is known to be an iterable group at that level.\n\n- Arbitrarily deep nesting requires recursion or an explicit stack. The function needs a base case for ordinary values and a clear definition of what can be expanded. For example, it may recurse only into lists and tuples, treating strings, dictionaries, and sets as leaf values rather than blindly iterating them.\n\n- That boundary matters because “iterable” is too broad. Flattening a string would produce characters, iterating a dictionary would produce keys, and iterating a set would lose predictable order. Cyclic containers can also make naive recursion run forever, so fully general object graphs need cycle detection.\n\n- Most importantly, flattening is a data-model decision. A list of orders containing line items may need its order boundaries for totals and display. I flatten when the consumer truly needs one stream and preserve nesting when group identity carries meaning.",
    teachingTitle: "Depth and leaf rules define the operation",
    teaching: "One-level flattening removes exactly one container boundary, so its output is easy to predict. Recursive flattening repeatedly asks whether the current value is a branch or a leaf. Changing that test changes the meaning of the function.\n\nA safe domain function often supports fewer types rather than every iterable. Accepting lists and tuples can be enough for structured numeric input. This keeps text whole and avoids surprising traversal of mappings. If cycles are possible, record visited container identities or reject cyclic input explicitly.",
    visualType: "flow_diagram",
    visualTitle: "Recursive branch-or-leaf decision",
    visual: `\`\`\`mermaid
flowchart TD\n  V[Read value] --> Q{Supported nested list or tuple?}\n  Q -- No --> A[Append leaf unchanged]\n  Q -- Yes --> C[Visit each child]\n  C --> V\n\`\`\``,
    codeTitle: "Flatten only lists and tuples",
    code: `\`\`\`python
def flatten(values):
    result = []

    def visit(value):
        if isinstance(value, (list, tuple)):
            for child in value:
                visit(child)
        else:
            result.append(value)

    visit(values)
    return result

print(flatten([1, [2, (3, 4)], \"go\"]))  # [1, 2, 3, 4, 'go']
\`\`\``,
    followups: [
      "Why should strings usually be treated as leaves during flattening?",
      "How would cyclic nesting affect a naive recursive solution?",
      "When does preserving nested group boundaries matter?",
    ],
  },
  {
    topic: "comparisons",
    slug: "python-list-vs-set-membership-performance",
    question: "Why is membership testing usually faster in a set or dictionary than in a list?",
    title: "List vs Set and Dictionary Membership",
    direct: "A list normally tests membership by comparing elements in sequence, so the work grows linearly with its length. A set or dictionary uses a stable hash to narrow the search to a small candidate area, giving average O(1) membership at the cost of extra memory, hashable keys, and no positional access.",
    quick: [
      "List membership is O(n) because Python may scan every element.",
      "Set membership and dictionary-key membership are average O(1) through hash lookup.",
      "Dictionary membership tests keys, not values, unless you explicitly use `values()`.",
      "Hash-based collections require hashable lookup values and use more memory than a plain list.",
      "For one tiny lookup, building a set may cost more than scanning; reuse changes the trade-off.",
    ],
    answerSize: "standard",
    speaking: "- Membership in a list and membership in a set or dictionary use different search models. A list has positions but no hash index, so `target in values` compares entries from the beginning until it finds an equal value or reaches the end. That is O(n) in the worst case.\n\n- A set stores its elements in a hash table, and a dictionary does the same for its keys. Python hashes the lookup value to find a small candidate region and confirms equality there, so membership is average O(1). Dictionary membership such as `user_id in users` checks keys; searching `users.values()` is a separate linear operation.\n\n- For example, validating one million incoming IDs against a reused set of blocked IDs avoids scanning the blocked list for every request. Building the set has an O(n) cost once, but repeated queries can then use average constant-time membership.\n\n- The faster average lookup has boundaries. Hash tables consume additional memory, elements or keys must be hashable, worst-case behavior is not a strict O(1) guarantee, and sets do not offer positional indexing. A list can be cheaper and clearer for a tiny ordered collection or a single scan.\n\n- I choose from the whole workload. A list fits ordered traversal and retained duplicates. A set fits unique repeated membership, while a dictionary fits membership plus an associated value. Converting to a set is valuable when the index will be reused enough to repay its construction and memory cost.",
    teachingTitle: "Index construction trades memory for repeated search speed",
    teaching: "Without an index, the only general way to find an equal list element is to inspect candidates. A hash table allocates extra structure that maps stable hash results toward likely entries. The initial build performs work for every value, but later lookups reuse that structure.\n\nThis means complexity should be measured across the operation sequence. One search in a short list may not justify conversion. Thousands of searches against unchanged data often do. If sorted order already exists and memory is tight, binary search can offer another trade-off with O(log n) lookup.",
    visualType: "comparison_table",
    visualTitle: "Compare the complete membership trade-off",
    visual: "| Requirement | `list` | `set` | `dict` |\n|---|---:|---:|---:|\n| Average membership | O(n) | O(1) | O(1) for keys |\n| Keeps duplicates | Yes | No | Keys are unique |\n| Positional access | Yes | No | No |\n| Associated value | No | No | Yes |\n| Extra hash index memory | No | Yes | Yes |",
    codeTitle: "Build one reusable membership index",
    code: `\`\`\`python
blocked_list = [101, 205, 309, 412]
blocked_set = set(blocked_list)  # one-time O(n) build

incoming_ids = [100, 101, 412, 900]
allowed = [user_id for user_id in incoming_ids if user_id not in blocked_set]

users = {101: \"Mina\", 205: \"Omar\"}
print(allowed)          # [100, 900]
print(101 in users)     # True: checks keys
print(\"Mina\" in users)  # False
\`\`\``,
    followups: [
      "When might converting a list to a set make performance worse overall?",
      "What does the `in` operator test on a dictionary?",
      "Which information is lost when a list becomes a set?",
    ],
  },
  {
    topic: "comparisons",
    slug: "python-collection-conversions-information-loss",
    question: "What changes when you convert between a list, tuple, set, and dictionary?",
    title: "Python Collection Conversions and Data Loss",
    direct: "Collection conversion changes guarantees, not just syntax: list and tuple conversion keep iteration order and duplicates, set conversion keeps only distinct hashable elements without a sequence-order promise, and dictionary construction expects key-value pairs or a mapping and collapses repeated equal keys by keeping the later value.",
    quick: [
      "`list(iterable)` and `tuple(iterable)` preserve the iterable's produced order and repeated values.",
      "`set(iterable)` removes duplicates and requires every produced element to be hashable.",
      "`dict(pairs)` expects two-item iterables and keeps the later value for repeated keys.",
      "`list(mapping)` returns its keys; use `mapping.items()` to keep key-value pairs.",
      "Before converting, identify whether order, duplicate counts, mutability, or key-value links must survive.",
    ],
    answerSize: "standard",
    speaking: "- Converting a collection adopts the target type's rules, so it may preserve, reshape, or discard information. `list(source)` and `tuple(source)` collect values in the order the source iterator produces them and retain repeated values. The main change between those two is whether the resulting container can be structurally modified.\n\n- `set(source)` keeps distinct hashable values. For example, converting `['red', 'blue', 'red']` produces a set with two elements; the second occurrence and its position are gone. Converting the set back to a list cannot reconstruct either fact, and code should not rely on the resulting order.\n\n- Dictionary construction has a shape requirement. `dict([('a', 1), ('b', 2)])` consumes key-value pairs, while repeated equal keys keep the later value. Calling `list(mapping)` returns keys because iterating a dictionary yields keys; `list(mapping.items())` is required to preserve pairs.\n\n- Conversion also has type boundaries. Set elements and dictionary keys must be hashable, so a source containing lists cannot become a set. A dictionary cannot be constructed from arbitrary three-item rows because each element must supply exactly a key and value.\n\n- I treat conversion as a model change. Before converting, I identify whether duplicates are counts, whether source order matters, whether values belong to keys, and whether the result must mutate. If any required relationship disappears, I choose a richer target such as `Counter`, a dictionary of lists, or an ordered list plus a membership set.",
    teachingTitle: "Target invariants decide what survives",
    teaching: "A constructor consumes an iterable according to the target's invariant. Sequences keep every produced item. Sets enforce uniqueness. Dictionaries interpret each produced item as a key-value association and enforce key uniqueness. Once an invariant discards information, another constructor cannot infer it later.\n\nThis is why `list(set(values))` is not a neutral cleanup step. It combines deduplication with loss of original sequence order. `list(dict.fromkeys(values))` preserves first-seen order for hashable values because dictionary insertion order and key uniqueness encode both required rules.",
    visualType: "flow_diagram",
    visualTitle: "Conversion changes the stored guarantees",
    visual: `\`\`\`mermaid
flowchart LR\n  L[\"list: order + duplicates\"] -->|set(...)| S[\"set: unique membership\"]\n  S -->|list(...)| L2[\"list: current iteration order, no recovered duplicates\"]\n  P[\"pair iterable\"] -->|dict(...)| D[\"dict: unique keys + latest value\"]\n\`\`\``,
    codeTitle: "Observe what each conversion retains",
    code: `\`\`\`python
colors = [\"red\", \"blue\", \"red\"]
as_tuple = tuple(colors)
unique = set(colors)
first_seen_unique = list(dict.fromkeys(colors))

pairs = [(\"a\", 1), (\"a\", 9), (\"b\", 2)]
mapping = dict(pairs)

print(as_tuple)           # ('red', 'blue', 'red')
print(len(unique))        # 2
print(first_seen_unique)  # ['red', 'blue']
print(mapping)            # {'a': 9, 'b': 2}
print(list(mapping))      # ['a', 'b']
\`\`\``,
    followups: [
      "Why can `list(set(values))` not recover first-seen order?",
      "What does `list(a_dictionary)` contain?",
      "How can you remove duplicates while preserving their first occurrence?",
    ],
  },
];

function makeQuestion(definition, order) {
  const id = `python-data-structures-basics-${definition.topic}-q${String(order).padStart(3, "0")}`;
  const interviewerIntent = interviewerIntents[definition.slug];
  if (!interviewerIntent) throw new Error(`Missing interviewer intent for ${definition.slug}`);
  return {
    id,
    slug: definition.slug,
    question: definition.question,
    title: definition.title,
    direct_answer: definition.direct,
    layout_type: definition.visualType === "comparison_table" ? "comparison" : "concept-explanation",
    difficulty: definition.answerSize === "standard" ? "medium" : "easy",
    importance: "high",
    reading_time_minutes: definition.answerSize === "standard" ? 8 : 6,
    interviewer_intent: interviewerIntent,
    answer: {
      sections: [
        {
          type: "interviewer_expectation",
          title: "Learning goal",
          content: definition.direct,
        },
        {
          type: "key_points",
          title: "Quick revision",
          items: definition.quick,
        },
        {
          type: "speakable_answer",
          title: "Interview answer",
          answerSize: definition.answerSize,
          content: interviewProse(definition.speaking),
        },
        {
          type: "deep_explanation",
          title: definition.teachingTitle,
          content: definition.teaching,
        },
        {
          type: definition.visualType,
          title: definition.visualTitle,
          content: definition.visual,
        },
        {
          type: "code_example",
          title: definition.codeTitle,
          content: definition.code,
        },
      ],
    },
    followup_questions: definition.followups,
    order,
    seo: {
      metaTitle: `${definition.title} | InterviewExplainer`,
      metaDescription: definition.direct.replace(/`/g, "").slice(0, 158),
    },
  };
}

function writeModule() {
for (const topic of topicOrder) {
  const topicDefinitions = definitions.filter((definition) => definition.topic === topic);
  if (topicDefinitions.length === 0) {
    throw new Error(`No questions defined for declared topic: ${topic}`);
  }

  const topicDir = path.join(moduleRoot, topic);
  fs.mkdirSync(topicDir, { recursive: true });
  const questions = topicDefinitions.map((definition, index) => makeQuestion(definition, index + 1));
  const document = {
    topic: topicTitles[topic],
    topicSlug: topic,
    questions,
  };
  fs.writeFileSync(
    path.join(topicDir, "complete-qa.json"),
    `${JSON.stringify(document, null, 2)}\n`,
  );
}

const revisionPath = path.join(moduleRoot, "_revision.json");
const revision = JSON.parse(fs.readFileSync(revisionPath, "utf8"));
revision.lastUpdated = "2026-09-07";
revision.status = "gold-standard";
revision.questionCount = definitions.length;
revision.notes = "Canonical fresher coverage across every declared built-in data-structure topic; generated shell variants are intentionally excluded.";
fs.writeFileSync(revisionPath, `${JSON.stringify(revision, null, 2)}\n`);

console.log(`Wrote ${definitions.length} gold-standard questions across ${topicOrder.length} topics.`);
}

const topicTitles = {
  lists: "Lists",
  tuples: "Tuples",
  dictionaries: "Dictionaries",
  sets: "Sets",
  "list-comprehensions": "List Comprehensions",
  "dict-comprehensions": "Dictionary Comprehensions",
  "nested-structures": "Nested Structures",
  comparisons: "Collection Comparisons",
};

const definitions = [
  ...supplementalDefinitions,
  {
    topic: "lists",
    slug: "python-list-basics-mutable-ordered-sequence",
    question: "What is a list in Python, and how does list mutability work?",
    title: "Python List Basics and Mutability",
    direct: "A Python list is an ordered, mutable sequence that can hold values of different types and keep duplicates. Mutability means operations such as item assignment, `append`, and `remove` can change the same list object, so every name that refers to that object can observe the change.",
    quick: [
      "A list is ordered: each item has a position and iteration follows that order.",
      "A list is mutable: its contents can change without creating a new list object.",
      "Lists allow duplicate values and may contain values of different types.",
      "Assignment can create an alias; use `copy()` or slicing when a separate outer list is needed.",
      "Methods that only mutate a list, such as `append()` and `sort()`, return `None`.",
    ],
    answerSize: "compact",
    speaking: "- A list is Python's general-purpose mutable sequence. It keeps items in order, allows repeated values, supports zero-based indexing, and can grow or shrink. Mixed types are legal, although a list of related values is usually easier to understand.\n\n- Mutability means Python can update the existing list object. For example, `tasks.append(\"test\")` adds an item and `tasks[0] = \"design\"` replaces one position. These operations are different from building another list with an expression such as `tasks + [\"deploy\"]`.\n\n- The shared-object boundary matters. If `backup = tasks`, both names refer to one list; appending through either name changes what the other name sees. `backup = tasks.copy()` creates a separate outer list, though nested mutable items are still shared.\n\n- I use a list when position, iteration order, duplicates, or later updates are meaningful. I avoid it when the real requirement is unique membership or lookup by a stable key, because a set or dictionary expresses those relationships more directly.",
    teachingTitle: "A list is an object with positions",
    teaching: "A list stores references in a numbered sequence. The first position is index `0`, and the last can be reached with index `-1`. Changing an element replaces the reference held at one position; appending adds another position. The list object itself can keep the same identity through both operations.\n\nThat reference model explains aliasing. Two variables can lead to the same list, and Python does not silently copy it during assignment or when it is passed to a function. Copy only when the ownership rule says that later structural changes must be isolated.",
    visualType: "flow_diagram",
    visualTitle: "One mutation, two aliases",
    visual: `\`\`\`mermaid
flowchart LR\n  A[name: tasks] --> L[\"one list: ['plan']\"]\n  B[name: alias] --> L\n  M[\"alias.append('test')\"] --> U[\"same list: ['plan', 'test']\"]\n  L --> U\n\`\`\`\n\nBoth names lead to the same object, so the append is visible from either name.`,
    codeTitle: "Observe identity and an independent copy",
    code: `\`\`\`python
tasks = [\"plan\"]\nalias = tasks\nseparate = tasks.copy()\n\nalias.append(\"test\")\nseparate.append(\"review\")\n\nprint(tasks)            # ['plan', 'test']\nprint(alias is tasks)   # True\nprint(separate)         # ['plan', 'review']\nprint(separate is tasks)  # False\n\`\`\``,
    followups: [
      "Why does `list.sort()` return `None`?",
      "What is the difference between a list alias and a shallow copy?",
      "When would a set communicate the requirement better than a list?",
    ],
  },
  {
    topic: "lists",
    slug: "python-list-indexing-and-slicing",
    question: "How do indexing and slicing work in Python lists?",
    title: "Python List Indexing and Slicing",
    direct: "Indexing selects one list item and raises `IndexError` when the position is outside the list. Slicing uses `[start:stop:step]`, includes `start`, excludes `stop`, accepts negative positions, and returns a new shallow list containing references to the selected items.",
    quick: [
      "Index `0` is the first item, while `-1` is the last item.",
      "A slice includes `start` but excludes `stop`: `items[1:4]` selects positions 1, 2, and 3.",
      "Omitted bounds mean the available beginning or end; the default step is `1`.",
      "A negative step walks backward, so `items[::-1]` returns a reversed shallow copy.",
      "A normal out-of-range index fails, but slice bounds are clipped to the sequence.",
    ],
    answerSize: "compact",
    speaking: "- Indexing asks for one position. Python lists use zero-based positions, and negative indexes count from the end, so `items[0]` is the first value and `items[-1]` is the last. Asking for an unavailable single index raises `IndexError`.\n\n- Slicing asks for a range using `items[start:stop:step]`. The start is included and the stop is excluded, which makes the length of a forward unit-step slice equal to `stop - start`. Leaving out a bound lets Python use the reachable beginning or end.\n\n- For example, with `letters = ['a', 'b', 'c', 'd', 'e']`, `letters[1:4]` returns `['b', 'c', 'd']`, `letters[:2]` returns the first two values, and `letters[::-1]` returns the values in reverse order. Slice bounds beyond the list are clipped rather than raising `IndexError`.\n\n- A list slice creates a new outer list, but it is shallow: nested objects remain shared. I use an index for exactly one required element and a slice when the operation naturally describes a subsequence.",
    teachingTitle: "Read a slice as a walk between boundaries",
    teaching: "The colon form describes a walk, not two included indexes. Python begins at `start`, repeatedly adds `step`, and stops before it would reach or pass `stop` in the direction of travel. That rule works for both positive and negative steps. A step of zero is invalid because the walk could never advance.\n\nSlicing is forgiving at the outer bounds, which is useful for chunking and pagination. It still allocates another list proportional to the number of selected references. A direct index is constant-time access and does not allocate a result list.",
    visualType: "flow_diagram",
    visualTitle: "The half-open slice `[1:4]`",
    visual: `\`\`\`mermaid
flowchart LR\n  I0[\"0 · a\"] --> I1[\"1 · b · start\"] --> I2[\"2 · c\"] --> I3[\"3 · d\"] --> I4[\"4 · e · stop\"]\n  I1 -. selected .-> I2\n  I2 -. selected .-> I3\n\`\`\`\n\nThe stop boundary marks where selection ends; the item at index \`4\` is not included.`,
    codeTitle: "Trace indexes, slices, and a shallow boundary",
    code: `\`\`\`python
letters = [\"a\", \"b\", \"c\", \"d\", \"e\"]\nprint(letters[0], letters[-1])  # a e\nprint(letters[1:4])             # ['b', 'c', 'd']\nprint(letters[::2])             # ['a', 'c', 'e']\nprint(letters[::-1])            # ['e', 'd', 'c', 'b', 'a']\n\nnested = [[1], [2]]\npart = nested[:]\npart[0].append(9)\nprint(nested)                    # [[1, 9], [2]]\n\`\`\``,
    followups: [
      "Why is the stop position excluded from a slice?",
      "What happens when a slice step is zero?",
      "Why can changing a nested item through a slice affect the original list?",
    ],
  },
  {
    topic: "lists",
    slug: "python-list-append-extend-insert-remove-pop",
    question: "What is the difference between `append`, `extend`, `insert`, `remove`, `pop`, and `del` on a Python list?",
    title: "Python List Methods Compared",
    direct: "`append` adds one object, `extend` adds every item from an iterable, and `insert` adds one object at a chosen position. `remove` deletes the first equal value, `pop` removes and returns an item, while `del` deletes by index or slice without returning the removed data.",
    quick: [
      "`append(x)` adds `x` as one final element, even when `x` is itself a list.",
      "`extend(iterable)` appends each item produced by the iterable.",
      "`insert(i, x)` places one value before position `i` and shifts later items.",
      "`remove(x)` deletes the first equal value and raises `ValueError` when it is absent.",
      "`pop(i)` removes and returns an item; `pop()` uses the final item by default.",
      "`del items[i:j]` removes positions or a slice and produces no return value.",
    ],
    answerSize: "standard",
    speaking: "- These operations differ first by whether they add or remove, then by whether they work with one object, many iterable items, a position, or a value. `append(x)` puts `x` at the end as one element. `extend(values)` iterates over `values` and adds each produced item.\n\n- For example, starting with `[1, 2]`, `append([3, 4])` produces `[1, 2, [3, 4]]`, while `extend([3, 4])` produces `[1, 2, 3, 4]`. `insert(1, 9)` adds one value before index `1`, shifting the existing tail to the right.\n\n- On removal, `remove(x)` searches by equality and deletes the first matching value; it raises `ValueError` if no match exists. `pop(i)` works by position and returns the removed item. With no argument, `pop()` removes the last element, while an empty list raises `IndexError`.\n\n- `del` is a statement rather than a method. It can delete one position, a whole slice, or even a variable binding, and it does not hand the deleted value back. `clear()` is the direct method for removing every item while retaining the list object.\n\n- Performance also affects the choice. Appending and popping at the end are amortized O(1), but inserting or deleting near the front is O(n) because later references shift. For frequent work at both ends, `collections.deque` is a better queue structure.\n\n- I choose the operation that matches the input relationship: one object, an iterable of objects, a known value, or a known position. That avoids the common bugs of accidentally nesting a list or discarding a value that the next step needs.",
    teachingTitle: "Addition and removal use different coordinates",
    teaching: "A list can be addressed by position or searched by value. `insert`, `pop`, and `del` use positions; `remove` performs an equality search to find a value. That is why `remove` can fail even when the index would be valid, and why duplicate values make it remove only the first match.\n\nAt the right edge, the internal array normally has room for efficient growth, so repeated appends are amortized constant time. Work at the left edge shifts existing references. A deque changes the storage model to make both ends efficient, but it gives up arbitrary slicing.",
    visualType: "comparison_table",
    visualTitle: "Match the method to the intent",
    visual: "| Operation | Selects by | Adds/removes | Returns removed value? | Typical cost |\n|---|---|---|---:|---|\n| `append(x)` | one object | add at end | No | amortized O(1) |\n| `extend(xs)` | iterable | add at end | No | O(len(xs)) |\n| `insert(i, x)` | position | add before `i` | No | O(n) |\n| `remove(x)` | value equality | first match | No | O(n) |\n| `pop()` | final position | remove | Yes | O(1) |\n| `del items[i:j]` | position/slice | remove | No | O(n) |",
    codeTitle: "See the operations produce different shapes",
    code: `\`\`\`python
values = [1, 2]\nvalues.append([3, 4])\nprint(values)  # [1, 2, [3, 4]]\n\nflat = [1, 2]\nflat.extend([3, 4])\nflat.insert(1, 9)\nprint(flat)    # [1, 9, 2, 3, 4]\n\nflat.remove(9)\nlast = flat.pop()\ndel flat[:1]\nprint(last)    # 4\nprint(flat)    # [2, 3]\n\`\`\``,
    followups: [
      "Why is `append` described as amortized O(1)?",
      "What exception does `remove` raise when the value is absent?",
      "Why is `deque.popleft()` preferable to `list.pop(0)` for a queue?",
    ],
  },
  {
    topic: "tuples",
    slug: "python-tuple-basics-and-immutability",
    question: "What is a tuple in Python, and what does tuple immutability guarantee?",
    title: "Python Tuples and Immutability",
    direct: "A tuple is an ordered sequence whose element references cannot be added, removed, or replaced after creation. It can still contain a mutable object, so tuple immutability fixes the tuple's structure but does not recursively freeze every object inside it.",
    quick: [
      "A tuple is ordered, indexed, allows duplicates, and has a fixed structure.",
      "Tuple items cannot be reassigned, appended, or deleted in place.",
      "A one-item tuple needs a trailing comma, as in `(value,)`.",
      "A tuple may contain a mutable object, and that nested object can still change.",
      "Tuples work well for fixed records, multiple return values, and hashable composite keys.",
    ],
    answerSize: "compact",
    speaking: "- A tuple is an ordered sequence with an immutable container structure. After creation, Python does not allow replacing an element, appending another element, or deleting a position. It still supports indexing, slicing, iteration, duplicate values, and mixed element types.\n\n- The comma creates a tuple more than the parentheses do. `(7,)` is a one-item tuple, while `(7)` is simply the integer `7`. Parentheses are often written because they make grouping clear.\n\n- Immutability is shallow. For example, `record = (\"A17\", [\"new\"])` cannot assign a different object to `record[1]`, but `record[1].append(\"paid\")` is valid because the nested list itself remains mutable.\n\n- I use tuples for a fixed-position result such as `(latitude, longitude)`, for unpacking multiple return values, or for a composite dictionary key when every element is hashable. A named class or dataclass is clearer when many positions need explanation, and a list is better when the sequence is meant to evolve.",
    teachingTitle: "Fixed references are not deep freezing",
    teaching: "Think of a tuple as a row of sealed slots. The slot count and the reference in each slot cannot change. If one slot points to a list, however, the list lives outside that structural rule and can update its own contents.\n\nOperations that appear to modify a tuple create another tuple. Concatenating `point + (3,)` leaves `point` untouched and returns a new sequence. This predictability helps tuples represent stable boundaries, but positional meaning becomes difficult to read when a record grows.",
    visualType: "flow_diagram",
    visualTitle: "Immutable slots, mutable nested object",
    visual: `\`\`\`mermaid
flowchart LR\n  T[\"tuple slots cannot be replaced\"] --> S1[\"slot 0 → 'A17'\"]\n  T --> S2[\"slot 1 → list object\"]\n  S2 --> L[\"['new'] can append 'paid'\"]\n\`\`\`\n\nThe tuple keeps the same reference in slot 1 while the referenced list changes internally.`,
    codeTitle: "Test the shallow immutability boundary",
    code: `\`\`\`python
record = (\"A17\", [\"new\"])
record[1].append(\"paid\")
print(record)  # ('A17', ['new', 'paid'])

single = (7,)
not_a_tuple = (7)
print(type(single).__name__)       # tuple
print(type(not_a_tuple).__name__)  # int
\`\`\``,
    followups: [
      "Why does a one-element tuple require a trailing comma?",
      "Can every tuple be used as a dictionary key?",
      "When would a dataclass be clearer than a tuple?",
    ],
  },
  {
    topic: "tuples",
    slug: "python-tuple-packing-and-unpacking",
    question: "How do tuple packing, unpacking, and starred unpacking work in Python?",
    title: "Tuple Packing and Unpacking",
    direct: "Packing groups values into one tuple, while unpacking assigns iterable items to multiple targets in one statement. The target counts must match unless one starred target collects the remaining items into a list; this also powers value swapping and multiple-return assignment.",
    quick: [
      "`point = 3, 4` packs two values into a tuple.",
      "`x, y = point` unpacks two iterable items into two names.",
      "The number of items and targets must match unless one target begins with `*`.",
      "A starred target receives its collected middle or edge values as a list.",
      "`left, right = right, left` swaps values using pack-and-unpack semantics.",
    ],
    answerSize: "compact",
    speaking: "- Packing puts several comma-separated values into one tuple. `point = 3, 4` creates `(3, 4)` even without visible parentheses. Unpacking performs the reverse binding: `x, y = point` reads two iterable items and assigns them to two targets.\n\n- Ordinary unpacking requires the counts to match. Too few or too many source items raise `ValueError`, which is useful because it catches an unexpected data shape rather than silently losing data. The source only needs to be iterable; it does not have to be a tuple.\n\n- One starred target can absorb the remainder. For example, `first, *middle, last = [10, 20, 30, 40]` binds `10`, `[20, 30]`, and `40`. The starred result is a list even when the source is a tuple.\n\n- Python also uses these rules for multiple return values and swapping. A function that writes `return name, age` returns one tuple, and the caller can unpack it. I keep unpacking short and obvious; when many positions have domain meaning, named fields are safer than a long positional contract.",
    teachingTitle: "Unpacking validates an iterable's shape",
    teaching: "The right side is evaluated first, producing values before any target is rebound. Python then distributes those values across the target pattern. This ordering makes `a, b = b, a` safe: the old values are collected before either name changes.\n\nA single star creates a flexible slot in the pattern. Targets before it take items from the beginning, targets after it take items from the end, and the star receives whatever remains. More than one starred assignment target would be ambiguous, so Python rejects it.",
    visualType: "flow_diagram",
    visualTitle: "Starred unpacking divides the sequence",
    visual: `\`\`\`mermaid
flowchart LR\n  S[\"[10, 20, 30, 40]\"] --> F[\"first = 10\"]\n  S --> M[\"middle = [20, 30]\"]\n  S --> L[\"last = 40\"]\n\`\`\`\n\nThe non-starred edge targets claim their items first; the starred target collects the remainder.`,
    codeTitle: "Pack, unpack, and swap",
    code: `\`\`\`python
def user_summary():
    return \"Mina\", 3

packed = 3, 4
x, y = packed
name, count = user_summary()
first, *middle, last = [10, 20, 30, 40]
x, y = y, x

print(packed, x, y)            # (3, 4) 4 3
print(name, count)             # Mina 3
print(first, middle, last)     # 10 [20, 30] 40
\`\`\``,
    followups: [
      "What exception is raised when ordinary unpacking counts do not match?",
      "What type does a starred assignment target receive?",
      "Why does tuple-style swapping not lose either old value?",
    ],
  },
  {
    topic: "tuples",
    slug: "python-tuple-hashable-dictionary-key",
    question: "When can a tuple be used as a dictionary key or set element?",
    title: "Tuple Hashability",
    direct: "A tuple can be a dictionary key or set element only when every object it contains is hashable. Strings, numbers, and tuples of hashable values usually qualify; a tuple containing a list, dictionary, or set does not because that nested value can change.",
    quick: [
      "Dictionary keys and set elements must be hashable.",
      "A hashable object's hash must remain stable, and equal objects must have equal hashes.",
      "Tuple immutability alone is not enough; all nested elements must also be hashable.",
      "`(51.5, -0.1)` can be a key, while `([51.5], -0.1)` cannot.",
      "Use `frozenset` when a set of values itself must become a key or set element.",
    ],
    answerSize: "compact",
    speaking: "- Dictionaries and sets use hash values to find entries, so their keys or elements must be hashable. Hashability requires a stable hash during the object's lifetime, and objects that compare equal must produce the same hash.\n\n- A tuple can meet that contract because its element references cannot be replaced, but Python must also be able to hash every element recursively. A coordinate such as `(51.5, -0.1)` is hashable because both floats are hashable. A tuple such as `([51.5], -0.1)` is not, because the list can change and has no hash.\n\n- This makes tuples useful for composite keys. For example, a cache can store a result under `(country_code, postal_code)` without building a string key that needs parsing later. The tuple preserves the two-part structure.\n\n- The boundary is not simply “immutable means hashable.” A tuple containing an unhashable value still fails, while a user-defined immutable-style object needs a compatible `__eq__` and `__hash__` contract. When order should not matter, a `frozenset` can represent a hashable group instead.",
    teachingTitle: "Why stable hashes protect lookup",
    teaching: "A hash table first converts a key into a hash value and uses that value to narrow the search to a storage region. If a key could mutate so its hash changed after insertion, a later lookup would search the new region while the entry remained in the old one. Python prevents this failure by rejecting ordinary mutable containers as keys.\n\nTuples combine their elements' hashes. The operation therefore reaches every nested member, and encountering a list causes `TypeError`. This check happens when hashing is requested, not when the tuple is created.",
    visualType: "flow_diagram",
    visualTitle: "Tuple-key eligibility",
    visual: `\`\`\`mermaid
flowchart TD\n  T[Tuple proposed as key] --> E{Every element hashable?}\n  E -- Yes --> K[Stable composite key]\n  E -- No --> X[TypeError: unhashable type]\n  K --> D[Dictionary or set lookup]\n\`\`\``,
    codeTitle: "Use a coordinate as a composite key",
    code: `\`\`\`python
weather = {(51.5, -0.1): \"cloudy\"}
print(weather[(51.5, -0.1)])  # cloudy

try:
    invalid = {([51.5], -0.1): \"cloudy\"}
except TypeError as error:
    print(type(error).__name__)  # TypeError

unordered_pair = frozenset({\"alice\", \"bob\"})
connections = {unordered_pair: \"connected\"}
print(connections[frozenset({\"bob\", \"alice\"})])
\`\`\``,
    followups: [
      "Why is a tuple containing a list still unhashable?",
      "What rule must `__eq__` and `__hash__` obey together?",
      "When is `frozenset` a better composite key than a tuple?",
    ],
  },
];

const interviewerIntents = {
  "python-list-basics-mutable-ordered-sequence": {
    testing: "Whether you understand list order, mutation, aliases, and the difference between changing an object and creating another list.",
    common_mistake: "Saying `alias = items` copies a list, or assigning the result of `items.append(x)` back to `items`.",
    to_stand_out: "Use object identity to explain why aliases observe the same append and why a shallow copy creates only a new outer list.",
  },
  "python-list-indexing-and-slicing": {
    testing: "Whether you can predict positive and negative indexes, half-open slice bounds, steps, and the allocation boundary of a slice.",
    common_mistake: "Treating the stop index as included, or assuming a slice recursively copies nested objects.",
    to_stand_out: "Translate `[start:stop:step]` into a directional walk and distinguish clipped slice bounds from failing single-index access.",
  },
  "python-list-append-extend-insert-remove-pop": {
    testing: "Whether you choose a list operation from one item versus an iterable, value versus position, and whether the removed item is needed.",
    common_mistake: "Using `append` when the iterable's elements should be added, or expecting `remove` to return the deleted value.",
    to_stand_out: "Include the shifting cost near the front and name `deque` for a real queue with frequent left-end operations.",
  },
  "python-tuple-basics-and-immutability": {
    testing: "Whether you know what part of a tuple is immutable and can reason about a mutable object stored in one of its fixed slots.",
    common_mistake: "Claiming tuple immutability recursively freezes nested lists, or forgetting the comma in a one-item tuple.",
    to_stand_out: "Describe a tuple as fixed element references and explain when named fields are clearer than a long positional record.",
  },
  "python-tuple-packing-and-unpacking": {
    testing: "Whether you understand packing, exact-length assignment, starred targets, swapping, and multiple-return values as one mechanism.",
    common_mistake: "Unpacking the wrong number of values or assuming a starred assignment target receives a tuple.",
    to_stand_out: "Explain that the right side is evaluated before targets are rebound, which makes Python's swap form safe.",
  },
  "python-tuple-hashable-dictionary-key": {
    testing: "Whether you can apply the full hashability rule to a tuple and explain why stable hashes are required by dictionaries and sets.",
    common_mistake: "Assuming every tuple is hashable even when it contains a list, dictionary, or set.",
    to_stand_out: "Contrast an ordered tuple key with an unordered frozenset key so the composite key matches domain equality.",
  },
  "python-dictionary-basics-hashable-keys": {
    testing: "Whether you understand mappings, unique hashable keys, average constant-time lookup, equality checks, and insertion order.",
    common_mistake: "Calling dictionary lookup unconditionally O(1), or using a mutable container as a key.",
    to_stand_out: "Explain the two-stage hash-and-equality lookup and the surprising equality of numeric keys such as `1` and `True`.",
  },
  "python-dict-brackets-get-setdefault": {
    testing: "Whether you model a missing key as an error, an optional read, or state that should be initialized and stored.",
    common_mistake: "Using `get` for required data or assuming `setdefault` evaluates its default only when the key is absent.",
    to_stand_out: "Distinguish a missing key from a stored `None` and mention `defaultdict` for repeated grouping with a lazy factory.",
  },
  "python-dictionary-iteration-views-and-merge": {
    testing: "Whether you know what dictionary iteration yields, how live views behave, and which merge forms mutate their left operand.",
    common_mistake: "Changing dictionary size while iterating its view, or reversing merge operands and silently changing precedence.",
    to_stand_out: "Separate a dynamic view from a list snapshot and state that right-hand values win on overlapping merge keys.",
  },
  "python-set-basics-membership-and-deduplication": {
    testing: "Whether you recognize uniqueness and repeated membership as set-shaped requirements without discarding needed order or counts.",
    common_mistake: "Writing `{}` for an empty set or converting to a set when duplicate frequency and first-seen order matter.",
    to_stand_out: "Use a `seen` set for one-pass duplicate detection and name `Counter` when occurrence counts are the real output.",
  },
  "python-set-union-intersection-difference": {
    testing: "Whether you can translate a business relationship into union, intersection, directional difference, or symmetric difference.",
    common_mistake: "Treating `a - b` as symmetric or confusing union with symmetric difference.",
    to_stand_out: "Express boolean relationships with subset and disjoint checks instead of building an unnecessary result set.",
  },
  "python-set-vs-frozenset": {
    testing: "Whether you connect container immutability to hashability and select ordered or unordered composite keys correctly.",
    common_mistake: "Describing frozenset as merely a faster set or assuming it can contain unhashable elements.",
    to_stand_out: "Show why two frozensets with opposite construction order represent the same dictionary key.",
  },
  "python-list-comprehension-syntax-filter-transform": {
    testing: "Whether you can separate source iteration, filtering, and output transformation in a list comprehension.",
    common_mistake: "Reading the leading expression as the first runtime step or using a comprehension only for side effects.",
    to_stand_out: "Translate the comprehension into its equivalent loop and identify when explicit intermediate names improve clarity.",
  },
  "python-list-comprehension-multiple-for-if-clauses": {
    testing: "Whether you can predict execution order and scope when a comprehension contains nested loops and several filters.",
    common_mistake: "Reading later `for` clauses as outer loops or referring to a loop variable before its clause introduces it.",
    to_stand_out: "Place a filter as early as its required names allow and explain how that can skip unnecessary inner-loop work.",
  },
  "python-dictionary-comprehension-syntax": {
    testing: "Whether you can build a keyed index with separate key and value expressions and predict collisions between generated keys.",
    common_mistake: "Assuming duplicate generated keys create multiple entries instead of replacing the earlier value.",
    to_stand_out: "State the uniqueness assumption and switch to explicit grouping when one key must retain several source values.",
  },
  "python-invert-dictionary-duplicate-values": {
    testing: "Whether you notice that unique forward keys do not imply unique values and choose one-to-one validation or one-to-many grouping.",
    common_mistake: "Using a swap comprehension on duplicate values and silently losing every original key except the last one.",
    to_stand_out: "Describe inversion as a relationship change and ensure original values are hashable before making them keys.",
  },
  "python-nested-dictionaries-lists-json-data": {
    testing: "Whether you can trace container types along a nested path and distinguish required schema fields from optional data.",
    common_mistake: "Chaining `get` calls with vague defaults until malformed external data is hidden as `None`.",
    to_stand_out: "Validate and normalize an external JSON boundary once, then let internal code use a stable, explicit shape.",
  },
  "python-flatten-nested-list-one-level-recursive": {
    testing: "Whether you define nesting depth and leaf types before choosing a one-level loop or recursive traversal.",
    common_mistake: "Recursing into every iterable and accidentally splitting strings, traversing dictionary keys, or looping through a cycle.",
    to_stand_out: "Explain that flattening can destroy meaningful group boundaries, so its stopping rule belongs to the data model.",
  },
  "python-list-vs-set-membership-performance": {
    testing: "Whether you compare the total workload: index construction, repeated lookup, memory, ordering, duplicates, and hashability.",
    common_mistake: "Converting a tiny list for one lookup or saying dictionary membership searches its values.",
    to_stand_out: "Amortize the one-time set build across repeated queries and keep the average-versus-worst-case distinction accurate.",
  },
  "python-collection-conversions-information-loss": {
    testing: "Whether you track order, duplicates, key-value links, mutability, and hashability through collection conversions.",
    common_mistake: "Treating `list(set(values))` as lossless or expecting `list(mapping)` to return key-value pairs.",
    to_stand_out: "Name the target invariant that discards information and use `dict.fromkeys` when first-seen deduplication is required.",
  },
};

writeModule();
