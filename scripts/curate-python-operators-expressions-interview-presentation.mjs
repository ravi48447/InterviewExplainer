#!/usr/bin/env node

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const questionFile = path.join(
  repoRoot,
  "content/python-backend-fresher/python-syntax-essentials/operators-and-expressions/complete-qa.json",
);

const presentations = {
  "python-is-vs-equals": {
    answerSize: "standard",
    beats: [
      {
        cue: "Define equality as a type-specific value relationship",
        stage: "Equality follows type rules",
        spokenText: "`==` compares values. It asks the objects' type whether the two values should count as equal: lists compare their elements, strings compare their text, and a user-defined class can implement `__eq__`. Equality can therefore describe domain meaning, such as two ticket objects having the same ticket code, even when they are separate objects.",
      },
      {
        cue: "Define identity as one exact runtime object",
        stage: "Identity means one object",
        spokenText: "`is` compares identity. It is true only when both expressions refer to the exact same object, and a class cannot redefine that relationship. After `alias = original`, `alias is original` is true because assignment creates another reference. Creating another object with equal contents does not give it the same identity.",
      },
      {
        cue: "Show equality and identity on the same values",
        stage: "Equal values can be separate",
        spokenText: "If `a = [1, 2]` and `b = [1, 2]`, then `a == b` is true because the list elements match, while `a is b` is false because two lists were created. If `c = a`, then `c is a` is true. These results answer three different questions rather than contradicting one another.",
        support: {
          type: "comparison",
          title: "Three expressions, two relationships",
          items: [
            {
              label: "a == b",
              value: "True",
              detail: "Two separate lists contain equal values.",
              tone: "green",
            },
            {
              label: "a is b",
              value: "False",
              detail: "The equal lists are still two objects.",
              tone: "orange",
            },
            {
              label: "a is c",
              value: "True",
              detail: "The name `c` was assigned the same list as `a`.",
              tone: "blue",
            },
          ],
        },
      },
      {
        cue: "Use identity for the None singleton",
        stage: "None is an identity check",
        spokenText: "Use `value is None` or `value is not None` because `None` is a singleton and the intended question is identity. This check also cannot be changed by a surprising custom `__eq__` method. For ordinary values such as names, IDs, amounts, strings, and lists, the intended relationship is normally equality, so use `==`.",
        support: {
          type: "code",
          title: "Custom equality does not change identity",
          language: "python",
          code: "class Ticket:\n    def __init__(self, code):\n        self.code = code\n\n    def __eq__(self, other):\n        return isinstance(other, Ticket) and self.code == other.code\n\nfirst = Ticket(\"A17\")\nsecond = Ticket(\"A17\")\nprint(first == second)\nprint(first is second)\n\nresult = None\nprint(result is None)",
          caption: "The tickets are equal by their code but remain different objects; `None` uses the identity relationship.",
        },
      },
      {
        cue: "Reject implementation reuse as application logic",
        stage: "Interning is not a contract",
        spokenText: "A Python implementation may reuse some string or integer objects, so `is` can appear to work for a value comparison in a small test. That interning is an implementation detail and can vary with the value, runtime, or how the expression was created. Use `==` for equal meaning, `is` for one exact object, and `is None` for absence represented by the `None` singleton.",
        recallRule: "Use `==` for equal values and `is` only when object identity is the relationship you actually mean.",
      },
    ],
  },
  "python-syntax-essentials-operators-and-expressions-when-to-use": {
    answerSize: "standard",
    beats: [
      {
        cue: "Explain the stopping rule for and",
        stage: "and stops at the first false",
        spokenText: "Python evaluates `x and y` from left to right. If `x` is false in a Boolean context, it returns `x` and never evaluates `y`. If `x` is true, it evaluates and returns `y`. In a longer chain, `and` returns the first false operand, or the final operand when all earlier values are true.",
      },
      {
        cue: "Explain the stopping rule for or",
        stage: "or stops at the first true",
        spokenText: "Python evaluates `x or y` in the opposite way. If `x` is true, it returns `x` and skips `y`; otherwise it evaluates and returns `y`. A fallback chain such as `configured_name or environment_name or \"guest\"` therefore returns the first true operand, or the final operand if none before it is true.",
        support: {
          type: "comparison",
          title: "What the left operand makes Python do",
          items: [
            {
              label: "x and y",
              value: "x is false",
              detail: "Return `x`; the expression `y` is skipped.",
              tone: "orange",
            },
            {
              label: "x and y",
              value: "x is true",
              detail: "Evaluate and return `y`.",
              tone: "green",
            },
            {
              label: "x or y",
              value: "x is true",
              detail: "Return `x`; the expression `y` is skipped.",
              tone: "green",
            },
            {
              label: "x or y",
              value: "x is false",
              detail: "Evaluate and return `y`.",
              tone: "orange",
            },
          ],
        },
      },
      {
        cue: "Make the operand result explicit",
        stage: "The result is an operand",
        spokenText: "These operators select an operand; they do not automatically produce `True` or `False`. `\"Ada\" or \"guest\"` returns the string `\"Ada\"`, and `0 and expensive()` returns the integer `0` without calling the function. Use `bool(expression)` only when the consumer specifically requires a Boolean value.",
      },
      {
        cue: "Use skipped evaluation as a safe guard",
        stage: "Short-circuiting makes guards",
        spokenText: "Short-circuiting can guard an operation that is unsafe or unnecessary. `user is not None and user.get(\"active\")` never reads from the dictionary when `user` is `None`. Keep visible side effects out of the skipped operand when their conditional execution would make the code harder to understand; an ordinary `if` is clearer in that case.",
      },
      {
        cue: "Separate absence from general falsiness",
        stage: "Falsy is not always missing",
        spokenText: "`None`, `False`, numeric zero, empty strings, and empty containers are all false in Boolean context. If zero is a valid timeout, `supplied or 30` incorrectly replaces it. Test `supplied is None` when only absence should use the default. The same distinction applies to empty cached results and explicit `False` settings.",
        support: {
          type: "code",
          title: "Preserve zero and guard optional data",
          language: "python",
          code: "def choose_timeout(supplied):\n    return 30 if supplied is None else supplied\n\ndef active_name(user):\n    return user is not None and user.get(\"active\") and user.get(\"name\")\n\nprint(choose_timeout(None))\nprint(choose_timeout(0))\nprint(active_name(None))\nprint(active_name({\"active\": True, \"name\": \"Ada\"}))",
          caption: "The explicit absence check keeps `0`, while the `and` chain avoids reading from `None`.",
        },
        recallRule: "`and` stops on false, `or` stops on true, and each returns the operand that decided the expression.",
      },
    ],
  },
  "python-syntax-essentials-operators-and-expressions-common-mistake": {
    answerSize: "standard",
    beats: [
      {
        cue: "Treat a comparison chain as adjacent pairs",
        stage: "Chains compare adjacent pairs",
        spokenText: "Python reads `low < value <= high` as two adjacent comparisons that must both hold: `low < value` and `value <= high`. It does not compare the first Boolean result with `high`. This notation is strongest when the pairs express one relationship, such as a range or an ordered sequence.",
      },
      {
        cue: "Preserve single evaluation and short-circuiting",
        stage: "The middle runs only once",
        spokenText: "The shared middle expression is evaluated once. In `a < create_value() < c`, Python keeps that returned value for both comparisons, and it skips the second comparison when the first one fails. Rewriting the chain as two comparisons with two calls can change its cost and even its result when the function has state or side effects.",
        support: {
          type: "trace",
          title: "Evaluation of low < value <= high",
          items: [
            {
              label: "Evaluate value",
              value: "once",
              detail: "Keep the result for both adjacent comparisons.",
              tone: "blue",
            },
            {
              label: "Check low < value",
              value: "first pair",
              detail: "A false result stops the whole chain.",
              tone: "orange",
            },
            {
              label: "Check value <= high",
              value: "second pair",
              detail: "This runs only when the first comparison is true.",
              tone: "green",
            },
          ],
        },
      },
      {
        cue: "Apply Python Boolean precedence",
        stage: "Precedence sets the groups",
        spokenText: "Comparisons bind more tightly than Boolean operators. Among the Boolean operators, the order is `not`, then `and`, then `or`. Therefore `ready or admin and active` means `ready or (admin and active)`. Precedence creates the expression tree first; short-circuiting then decides which parts of that tree actually run.",
        support: {
          type: "code",
          title: "One middle call and two Boolean groupings",
          language: "python",
          code: "calls = 0\n\ndef current_value():\n    global calls\n    calls += 1\n    return 7\n\nprint(1 < current_value() <= 10, calls)\n\nready = False\nadmin = True\nactive = False\nprint(ready or admin and active)\nprint(ready or (admin and not active))",
          caption: "The comparison chain calls `current_value()` once; the final expressions show how grouping changes the policy.",
        },
      },
      {
        cue: "Distinguish a chain from nested Boolean comparison",
        stage: "Equality chains stay pairwise",
        spokenText: "`a == b == c` means `a == b and b == c`, with `b` evaluated once. It is not `(a == b) == c`, and it does not test whether all three names have one identity. Each adjacent equality still uses the objects' normal `==` rules.",
      },
      {
        cue: "Use grouping that communicates the business rule",
        stage: "Parentheses reveal the policy",
        spokenText: "Parentheses are valuable even when Python's precedence already gives the intended result. `is_owner or (is_admin and is_active)` exposes the authorization rule and survives later editing better than a visually ambiguous expression. For larger validation rules, named Boolean values make each condition and its failure case easier to test without changing evaluation order.",
        recallRule: "Comparison chains share adjacent operands; Boolean grouping is `not`, then `and`, then `or`.",
      },
    ],
  },
  "python-syntax-essentials-operators-and-expressions-compare": {
    answerSize: "standard",
    beats: [
      {
        cue: "Define true division and its result",
        stage: "Slash keeps the real quotient",
        spokenText: "`/` performs true division. Even with two integer operands, it returns a floating-point quotient, so `7 / 3` is about `2.3333`. Use it when the fractional ratio matters, such as an average or a rate, and remember that a numeric zero divisor raises `ZeroDivisionError`.",
      },
      {
        cue: "Define floor division with the negative boundary",
        stage: "Floor division rounds downward",
        spokenText: "`//` performs floor division: it rounds the mathematical quotient down toward negative infinity. Positive inputs can make this look like truncation because `7 // 3` is `2`. The negative case reveals the rule: `-7 // 3` is `-3`, while `int(-7 / 3)` truncates toward zero and returns `-2`.",
      },
      {
        cue: "Connect modulo to the floor quotient",
        stage: "Modulo completes the identity",
        spokenText: "`%` returns the remainder paired with that floor quotient. For ordinary numeric values, `a == (a // b) * b + (a % b)`. Once `-7 // 3` is known to be `-3`, the remainder must be `2` because `-7 == (-3 * 3) + 2`. With nonzero integers, the remainder has the divisor's sign or is zero.",
        support: {
          type: "trace",
          title: "Derive the negative quotient and remainder",
          items: [
            {
              label: "True quotient",
              value: "-2.333...",
              detail: "Start with `-7 / 3`.",
              tone: "blue",
            },
            {
              label: "Floor downward",
              value: "-3",
              detail: "Choose the lower integer, not the one nearer zero.",
              tone: "orange",
            },
            {
              label: "Solve the remainder",
              value: "2",
              detail: "`-7 - (-3 * 3)` leaves `2`.",
              tone: "green",
            },
            {
              label: "Verify",
              value: "-7",
              detail: "`(-3 * 3) + 2` reconstructs the dividend.",
              tone: "green",
            },
          ],
        },
      },
      {
        cue: "Use quotient and remainder as one result",
        stage: "divmod keeps the pair together",
        spokenText: "Use `//` and `%` together when a total becomes complete groups plus a leftover. For `155` minutes, the quotient gives `2` complete hours and the remainder gives `35` minutes. `divmod(155, 60)` returns that same pair and makes it explicit that the two numbers come from one division.",
        support: {
          type: "code",
          title: "Split a duration and verify a negative case",
          language: "python",
          code: "def hours_and_minutes(total_minutes):\n    return divmod(total_minutes, 60)\n\nprint(hours_and_minutes(155))\n\na, b = -7, 3\nquotient, remainder = divmod(a, b)\nprint(quotient, remainder)\nprint(a == quotient * b + remainder)\nprint(int(a / b), a // b)",
          caption: "`divmod` returns the floor quotient and its matching remainder; `int` and `//` differ for the negative input.",
        },
      },
      {
        cue: "Choose the operator from the required model",
        stage: "Floor is not truncation",
        spokenText: "Choose `/` for a real quotient and choose `//` with `%` for a floor-based grouping model. Negative inputs deserve an explicit test whenever the domain permits them. Floating-point operands can add rounding edge cases, so quotient-remainder reasoning is clearest with integers and a nonzero divisor.",
        recallRule: "`/` keeps the ratio, `//` floors the quotient, and `%` supplies the remainder that reconstructs the dividend.",
      },
    ],
  },
  "python-syntax-essentials-operators-and-expressions-scenario": {
    answerSize: "standard",
    beats: [
      {
        cue: "List the different values that Boolean context collapses",
        stage: "Truthiness groups many values",
        spokenText: "Python Boolean context treats `None`, `False`, numeric zero, empty strings, and empty collections as false. A custom object can also be false through `__bool__` or a zero `__len__`. That grouping is useful only when the application genuinely considers all of those states equivalent.",
        support: {
          type: "comparison",
          title: "False values can carry different meanings",
          items: [
            {
              label: "None",
              value: "false",
              detail: "Often represents missing or unknown data.",
              tone: "blue",
            },
            {
              label: "0 or False",
              value: "false",
              detail: "May be a valid count, timeout, or explicit answer.",
              tone: "green",
            },
            {
              label: "Empty value",
              value: "false",
              detail: "May be valid supplied text or a collection with no items.",
              tone: "orange",
            },
            {
              label: "Missing key",
              value: "no value",
              detail: "This can differ from a key explicitly storing `None`.",
              tone: "neutral",
            },
          ],
        },
      },
      {
        cue: "Define the domain meaning of missing before changing code",
        stage: "Define what missing means",
        spokenText: "At the failing boundary, inspect both `repr(value)` and `type(value)`, then write down which state is supposed to mean missing. Replace a broad `if not value` only after that contract is clear. Use `value is None` when `None` alone represents absence, and use an explicit length or equality check when empty or zero has its own meaning.",
      },
      {
        cue: "Preserve a valid zero in a fallback expression",
        stage: "Zero may be valid data",
        spokenText: "An API timeout of `0` might deliberately mean do not wait. `payload.get(\"timeout\") or 30` silently turns that valid zero into `30` because zero is false. Read the value and apply the default only to the agreed missing state. The same problem appears when an empty cached result or an explicit `False` setting is valid data.",
      },
      {
        cue: "Distinguish omission when None is also valid",
        stage: "A sentinel marks one state",
        spokenText: "A mapping's `get` can make an omitted key and a key storing `None` look the same. Test `\"timeout\" in payload` when membership is the real question, or pass a unique sentinel object as the default. Because only that object is identical to itself, `value is MISSING` represents omission without taking meaning away from `None`, zero, or `False`.",
        support: {
          type: "code",
          title: "Keep omission, None, and zero separate",
          language: "python",
          code: "MISSING = object()\n\ndef timeout_from(payload):\n    value = payload.get(\"timeout\", MISSING)\n    if value is MISSING:\n        return 30\n    if value is None:\n        return None\n    return value\n\nfor sample in ({}, {\"timeout\": None}, {\"timeout\": 0}, {\"timeout\": 5}):\n    print(timeout_from(sample))",
          caption: "The four inputs remain four states: omitted, explicit `None`, valid zero, and a normal value.",
        },
      },
      {
        cue: "Prove every meaningful state with a table-driven test",
        stage: "Test every meaningful state",
        spokenText: "After choosing the precise condition, test every state the data contract distinguishes: omission, `None`, zero, `False`, empty, and a normal value where they apply. The fix is complete when each state reaches its intended branch, not merely when the first failing example passes. If the states need different outcomes, one truthiness check cannot represent the rule.",
        recallRule: "Define missing in the data contract, then test that exact state instead of collapsing every false value.",
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
console.log(`Curated Interview Answer presentations for ${curated} operator questions`);
