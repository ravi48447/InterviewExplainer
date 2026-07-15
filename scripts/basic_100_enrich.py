# -*- coding: utf-8 -*-
"""
In-depth enrichment for the Basic 100 fresher track.

The base content lives in generate_basic_100.py (PROBLEM_DATA). This file adds
the deeper teaching layer so each fresher problem reads like the main DSA
library: a multi-paragraph "why", a worked dry-run trace, edge cases, pitfalls,
interviewer intent, clarifying questions, detailed mistakes, and follow-ups.

Each ENRICH entry is merged onto the matching PROBLEM_DATA[slug]. Supported keys:

  deep_explanation          str   -> approaches[0].explanation (multi-paragraph)
  hints                     [str] -> approaches[0].hints
  complexity_reasoning      str   -> approaches[0].complexityReasoning
  dry_run    dict(input, intro, steps=[(step,action,state)], result)
  edge_cases                [(input, behavior)]
  pitfalls                  [str]
  line_java / line_python   [(line, explanation)]
  interviewer_intent        dict(testing, common_mistake, to_stand_out)
  clarifying                [(question, answer)]
  common_mistakes_detailed  [dict(title, why, bad, good, lang)]
  followups                 [dict(title, slug, hint, leetcodeNumber?)]
  remember_add              dict(formula?, when_to_use?, anti_signals?)
  approach_add              dict(...)  -> shallow-merged into approaches[0] source
"""

ENRICH = {}


def E(slug, **kw):
    ENRICH[slug] = kw


# ─────────────────────────────────────────────────────────────────────────────
# Wave 1 — Numbers & Math (18)
# ─────────────────────────────────────────────────────────────────────────────

E(
    "sum-of-two-numbers",
    deep_explanation=(
        "There is no algorithm to discover here — the answer is the `+` operator. "
        "What an interviewer is actually probing on this 'warm-up' is whether you "
        "think about the **range of the result**, because that is the habit that "
        "prevents real bugs later.\n\n"
        "**Why overflow is the whole point.** A 32-bit signed `int` holds values up "
        "to about 2.1 billion (2³¹ − 1). If `a` and `b` are each near 10⁹, their sum "
        "is near 2×10⁹, which is still inside `int` range — but two values near the "
        "`int` ceiling sum to ~4.3 billion, which silently wraps around to a negative "
        "number. The fix is to perform the addition in 64-bit by widening one operand "
        "to `long` *before* the `+` happens.\n\n"
        "**Why cast one operand, not the result.** Writing `(long)(a + b)` is too "
        "late: `a + b` is already computed in `int` and may have overflowed before the "
        "cast runs. `(long) a + b` promotes `b` to `long` as well (Java's binary "
        "numeric promotion), so the whole addition is 64-bit.\n\n"
        "**Python note.** Python integers are arbitrary precision, so there is no "
        "overflow — `a + b` is always exact. The overflow discussion is a Java/C++/"
        "Go concern, and saying so out loud shows you understand *why* the languages "
        "differ."
    ),
    hints=[
        "The operation is just `a + b`. So what is the interviewer really checking?",
        "Think about the largest values `a` and `b` can take. Does the sum still fit in a 32-bit `int`?",
        "Promote one operand to a 64-bit type before adding so the addition itself can't overflow.",
    ],
    complexity_reasoning="a single addition is one machine instruction, independent of the input values, so the work is constant.",
    dry_run=dict(
        input="a = 2000000000, b = 2000000000",
        intro="Watch what the data type does, not the arithmetic.",
        steps=[
            ("int + int", "2000000000 + 2000000000 = 4000000000, but that exceeds 2³¹−1", "wraps to -294967296 (BUG)"),
            ("(long) a + b", "promotes to 64-bit: 2000000000 + 2000000000", "4000000000 (correct)"),
        ],
        result="4000000000",
    ),
    edge_cases=[
        ("a = 0, b = 0", "Returns 0 — the additive identity, no special handling needed."),
        ("a = -2000000000, b = -2000000000", "Sum -4000000000 underflows int but is exact in long."),
        ("a = 10^9, b = -10^9", "Returns 0; mixed signs cancel with no range concern."),
    ],
    pitfalls=[
        "Casting after the addition — `(long)(a + b)` — which overflows before the cast.",
        "Assuming the sum 'obviously' fits because each input fits; two near-max ints overflow when added.",
    ],
    interviewer_intent=dict(
        testing="Whether you reflexively consider the value range of an arithmetic result, not just the logic.",
        common_mistake="Adding two large ints into an int and returning a silently wrapped negative number.",
        to_stand_out="Volunteer the overflow case unprompted, explain `(long) a + b` vs `(long)(a + b)`, and note Python's unbounded ints make it a non-issue there.",
    ),
    clarifying=[
        ("How large can the inputs be?", "Up to ~10⁹ each. That tells me whether the 32-bit result can overflow and whether I should return `long`."),
        ("Should I handle non-integer input?", "No — the contract is two integers. I'll keep the signature integer-only."),
    ],
    common_mistakes_detailed=[
        dict(
            title="Casting too late",
            why="`(long)(a + b)` computes `a + b` in 32-bit first, so the overflow has already happened before the widening cast.",
            lang="java",
            bad="long sum = (long)(a + b);   // a + b overflowed in int already",
            good="long sum = (long) a + b;    // promotes b too, adds in 64-bit",
        ),
    ],
    followups=[
        dict(title="Add Two Numbers (linked lists)", slug="add-two-numbers", hint="Same addition but digit-by-digit with carry over two linked lists.", leetcodeNumber=2),
        dict(title="Sum of Array Elements", slug="array-sum", hint="Generalises one addition into a fold over n values."),
    ],
    remember_add=dict(
        formula="return (long) a + b;",
        when_to_use=["Combining two integers whose sum may approach the type limit", "Any place a 'trivial' add hides an overflow"],
        anti_signals=["Inputs guaranteed tiny — a plain int add is fine", "Working in Python, where ints are unbounded"],
    ),
)

E(
    "max-of-two-numbers",
    deep_explanation=(
        "The maximum of two values is decided by a **single comparison**: if `a` is "
        "larger, the answer is `a`; otherwise it is `b`. The ternary `a > b ? a : b` "
        "expresses exactly that in one expression.\n\n"
        "**Why ties don't matter.** When `a == b`, both branches return the same "
        "numeric value, so it is irrelevant whether you use `>` or `>=` — the result "
        "is identical. Don't waste a branch worrying about equality.\n\n"
        "**Why this matters beyond two numbers.** This one comparison is the *atom* "
        "of every 'running maximum' loop. Finding the max of an array is just this "
        "comparison applied repeatedly against an accumulator. Internalise the ternary "
        "here and the array version writes itself.\n\n"
        "**On using the library `Math.max`.** It's correct and you'd use it in real "
        "code, but if the interviewer is testing fundamentals they want to see the "
        "comparison. Mention both: 'In production I'd call `Math.max`; here's the "
        "comparison it's doing under the hood.'"
    ),
    hints=[
        "Only one fact decides the answer: is `a` bigger than `b`?",
        "A single comparison with a ternary returns the larger value directly.",
        "Don't add a separate branch for equality — both values are the same then.",
    ],
    complexity_reasoning="exactly one comparison and one selection regardless of the operand sizes.",
    dry_run=dict(
        input="a = 4, b = 9",
        intro="One comparison decides it.",
        steps=[
            ("compare", "is 4 > 9? No", "select b"),
            ("return", "b = 9", "answer 9"),
        ],
        result="9",
    ),
    edge_cases=[
        ("a = 4, b = 4", "Equal — returns 4; the `>` test is false so it returns b, which is the same value."),
        ("a = -5, b = -2", "Returns -2; comparisons work the same for negatives."),
    ],
    pitfalls=[
        "Over-engineering with if/else-if chains when one ternary suffices.",
        "Believing the `>` vs `>=` choice changes the result on a tie — it doesn't.",
    ],
    interviewer_intent=dict(
        testing="Whether you can express a selection cleanly and recognise it as the base case of a running max.",
        common_mistake="Writing verbose nested ifs, or reaching for the library when asked to show the logic.",
        to_stand_out="Point out this is exactly the comparison an array-maximum loop repeats n times.",
    ),
    clarifying=[
        ("What should I return on a tie?", "Either value — they're equal, so the result is the same number."),
    ],
    followups=[
        dict(title="Maximum of Three Numbers", slug="max-of-three-numbers", hint="Fold this comparison twice: max(a, max(b, c))."),
        dict(title="Maximum in an Array", slug="array-maximum", hint="Apply this comparison against a running best across n values."),
    ],
    remember_add=dict(
        formula="return a > b ? a : b;",
        when_to_use=["Choosing the larger of two values", "The base step inside any running-max loop"],
    ),
)

E(
    "max-of-three-numbers",
    deep_explanation=(
        "The maximum of three numbers is the maximum of the first and the maximum of "
        "the other two: `max(a, max(b, c))`. You compute one pairwise max, then feed "
        "that 'running best' into a second comparison.\n\n"
        "**Why a running maximum, not three-way ifs.** You *could* write a chain of "
        "if/else-if conditions, but those are error-prone (it's easy to get a boundary "
        "wrong). Folding — keep a best-so-far and compare the next value against it — "
        "is both shorter and the exact technique that scales to an array of a million "
        "numbers. Three values is just the fold unrolled twice.\n\n"
        "**Why ties are harmless.** If two or three values are equal, each comparison "
        "keeps an equal value, so the final answer is still correct. No special case "
        "needed.\n\n"
        "Showing the interviewer you see this as `array-maximum` with `n = 3` — rather "
        "than a one-off trick — signals that you think in patterns."
    ),
    hints=[
        "Can you reduce 'max of three' to repeated 'max of two'?",
        "Compute max(b, c) first, then compare that result with a.",
        "This is a running maximum unrolled — the same fold an array-max loop uses.",
    ],
    complexity_reasoning="two comparisons, fixed regardless of the values.",
    dry_run=dict(
        input="a = 3, b = 7, c = 5",
        intro="Fold a running max over the three values.",
        steps=[
            ("m = max(a, b)", "max(3, 7) = 7", "m = 7"),
            ("return max(m, c)", "max(7, 5) = 7", "answer 7"),
        ],
        result="7",
    ),
    edge_cases=[
        ("a = 9, b = 2, c = 9", "Tie at the top — returns 9; equal values survive each comparison."),
        ("a = -1, b = -5, c = -2", "Returns -1, the largest (least negative)."),
    ],
    pitfalls=[
        "Writing a long if/else-if chain that mishandles an equality boundary.",
        "Forgetting that the second comparison must use the result of the first, not the original a.",
    ],
    interviewer_intent=dict(
        testing="Whether you reduce a small problem to a reusable fold instead of a bespoke branch tangle.",
        common_mistake="Nested ifs with a subtle boundary bug, or comparing c against a instead of against max(a, b).",
        to_stand_out="State explicitly that this is array-maximum with n = 3 and the same comparison generalises.",
    ),
    clarifying=[
        ("Can the three numbers be equal?", "Yes; ties just return that shared value, no special handling."),
    ],
    followups=[
        dict(title="Maximum in an Array", slug="array-maximum", hint="The same fold over n values instead of 3."),
        dict(title="Sum of Min and Max", slug="sum-of-min-and-max", hint="Track a running max and a running min together."),
    ],
    remember_add=dict(
        formula="m = max(a, b); return max(m, c);",
        when_to_use=["Largest of a small fixed set", "Demonstrating the running-max fold before scaling to arrays"],
    ),
)

E(
    "even-or-odd",
    deep_explanation=(
        "A number is even when it leaves no remainder on division by 2. The modulo "
        "operator `%` answers this directly, so `n % 2 == 0` is the test for "
        "evenness.\n\n"
        "**Why you must test `== 0`, never `== 1`.** In Java, C, and C++ the `%` "
        "operator follows the sign of the *dividend*, so `-3 % 2` is `-1`, not `1`. "
        "Code that checks `n % 2 == 1` to detect odd numbers therefore returns the "
        "wrong answer for every negative odd value. Always phrase parity as 'the "
        "remainder is zero' for even, and treat everything else as odd.\n\n"
        "**The bitwise alternative.** The lowest bit of an integer is `1` exactly when "
        "the number is odd, so `(n & 1) == 0` tests evenness too. It sidesteps the "
        "negative-remainder pitfall entirely (the low bit of `-3` is `1`) and is a "
        "touch faster. Mentioning it is a nice signal.\n\n"
        "**Python note.** Python's `%` follows the sign of the *divisor*, so `-3 % 2` "
        "is `1` there — but the safe habit of testing `== 0` still works everywhere, "
        "which is exactly why you should default to it."
    ),
    hints=[
        "Even means 'divisible by 2'. What operator tells you the remainder?",
        "Test `n % 2 == 0` for even — and think about what `-3 % 2` returns in Java.",
        "The bitwise check `(n & 1) == 0` avoids the negative-remainder trap entirely.",
    ],
    complexity_reasoning="one modulo (or one bitwise AND) — constant work.",
    dry_run=dict(
        input="n = -3",
        intro="Why the test must be `== 0`, not `== 1`.",
        steps=[
            ("n % 2 in Java", "-3 % 2 = -1 (sign follows dividend)", "not 0 → Odd ✓"),
            ("n % 2 == 1?", "-1 == 1 is false", "would wrongly say Even ✗"),
            ("(n & 1)", "low bit of -3 is 1", "→ Odd ✓"),
        ],
        result="\"Odd\"",
    ),
    edge_cases=[
        ("n = 0", "0 % 2 == 0 → Even, the correct parity of zero."),
        ("n = -4", "Even; `% 2` is 0 for negatives too when you test against 0."),
        ("n = -7", "Odd; the bitwise check or the `!= 0` test handles it where `== 1` fails."),
    ],
    pitfalls=[
        "Testing `n % 2 == 1` for odd — wrong for negative odd numbers in Java/C++.",
        "Confusing `=` (assignment) with `==` (comparison) inside the condition.",
    ],
    interviewer_intent=dict(
        testing="Whether you know that `%` can be negative and choose a parity test that survives negatives.",
        common_mistake="Detecting odd with `n % 2 == 1`, which fails on negative inputs.",
        to_stand_out="Offer `(n & 1)` as the language-agnostic, faster check and explain the signed-modulo subtlety.",
    ),
    clarifying=[
        ("Can the input be negative?", "Yes — which is exactly why I test `% 2 == 0` rather than `== 1`."),
        ("Is zero even or odd?", "Even: 0 % 2 == 0."),
    ],
    common_mistakes_detailed=[
        dict(
            title="Detecting odd with `== 1`",
            why="In Java/C++ `%` follows the dividend's sign, so `-3 % 2` is `-1`; `-1 == 1` is false and the number is misclassified.",
            lang="java",
            bad="boolean odd = (n % 2 == 1);     // false for -3, -5, ...",
            good="boolean odd = (n % 2 != 0);     // or (n & 1) == 1",
        ),
    ],
    followups=[
        dict(title="Count Even and Odd", slug="count-even-odd-array", hint="Apply this parity test across an array and tally each bucket."),
        dict(title="Sign of a Number", slug="sign-of-a-number", hint="Another 'classify one integer' branch problem."),
    ],
    remember_add=dict(
        formula="even  <=>  (n % 2 == 0)  <=>  ((n & 1) == 0)",
        when_to_use=["Classifying integers by parity", "Toggling/alternating behaviour every other step"],
        anti_signals=["You wrote `% 2 == 1` to mean odd — fix it for negatives"],
    ),
)

E(
    "sign-of-a-number",
    deep_explanation=(
        "There are exactly three outcomes — positive, negative, zero — so the cleanest "
        "solution is three guarded returns: `if (n > 0) return 1; if (n < 0) return "
        "-1; return 0;`.\n\n"
        "**Why guarded returns beat one big if/else.** Each `return` exits "
        "immediately, so the branches are automatically mutually exclusive and you "
        "can't accidentally fall into two of them. The final `return 0` is reached "
        "only when both comparisons failed, which is precisely the `n == 0` case — so "
        "you never even write `== 0` explicitly.\n\n"
        "**Why order is flexible but coverage is not.** You may test `< 0` first or "
        "`> 0` first; what matters is that all three cases are covered and zero has a "
        "home. The classic bug is forgetting zero and returning a wrong default.\n\n"
        "**Library shortcut.** `Integer.signum(n)` (Java) or `(n > 0) - (n < 0)` (a "
        "branchless C-style trick) both do this; mention them but show the explicit "
        "logic when fundamentals are being tested."
    ),
    hints=[
        "How many distinct outcomes are there? Map each to a return value.",
        "Three guarded returns make the cases mutually exclusive for free.",
        "The fall-through `return 0` handles zero without an explicit `== 0` test.",
    ],
    complexity_reasoning="at most two comparisons — constant.",
    dry_run=dict(
        input="n = -5",
        intro="Guarded returns, checked top to bottom.",
        steps=[
            ("n > 0?", "-5 > 0 is false", "skip"),
            ("n < 0?", "-5 < 0 is true", "return -1"),
        ],
        result="-1",
    ),
    edge_cases=[
        ("n = 0", "Both comparisons fail, so the function falls through to `return 0`."),
        ("n = 2147483647", "Returns 1; no arithmetic is done so there's no overflow risk."),
    ],
    pitfalls=[
        "Forgetting the zero case and returning a stray default.",
        "Using overlapping conditions so a value could match two branches.",
    ],
    interviewer_intent=dict(
        testing="Whether you enumerate all cases of a small classification and handle the boundary (zero) cleanly.",
        common_mistake="Omitting the zero branch or writing conditions that aren't mutually exclusive.",
        to_stand_out="Mention `Integer.signum` and the branchless `(n>0)-(n<0)` idiom as alternatives.",
    ),
    clarifying=[
        ("What should zero map to?", "0 — it's neither positive nor negative."),
    ],
    followups=[
        dict(title="Even or Odd", slug="even-or-odd", hint="Another single-integer classification branch."),
    ],
    remember_add=dict(
        formula="if n>0 return 1; if n<0 return -1; return 0;",
        when_to_use=["Three-way classification of one value", "Comparator-style results (-1/0/1)"],
    ),
)

E(
    "leap-year",
    deep_explanation=(
        "The rule has an exception inside an exception: a year is a leap year if it is "
        "divisible by 4, **except** centuries (divisible by 100), **unless** the "
        "century is also divisible by 400. The cleanest encoding is one boolean "
        "expression: `(y % 4 == 0 && y % 100 != 0) || (y % 400 == 0)`.\n\n"
        "**Why this exact shape.** The first clause captures 'divisible by 4 but not a "
        "plain century'. The second clause, OR-ed in, re-admits the special centuries "
        "(2000, 2400) that are divisible by 400. Because the 400-rule is its own OR "
        "term, it cleanly overrides the 100-exception without nested conditionals.\n\n"
        "**The classic gotcha: 1900 vs 2000.** 1900 is divisible by 100 but not 400, "
        "so it is *not* a leap year — many naive solutions that only check `% 4` get "
        "this wrong. 2000 is divisible by 400, so it *is*. These two years are the "
        "test the interviewer is really running.\n\n"
        "Translating an English spec with nested exceptions into one OR-of-ANDs is the "
        "transferable skill here — it shows up again in date math, validation rules, "
        "and permission checks."
    ),
    hints=[
        "Start with the simple rule (divisible by 4), then layer the exceptions.",
        "Centuries (÷100) are skipped — unless they're also ÷400.",
        "Encode it as one OR of two ANDs; test it on 1900 and 2000.",
    ],
    complexity_reasoning="three modulo checks at most — constant.",
    dry_run=dict(
        input="y = 1900, then y = 2000",
        intro="The two years that separate correct from naive solutions.",
        steps=[
            ("1900 % 4", "0 → divisible by 4", "candidate"),
            ("1900 % 100", "0 → it's a century", "needs the 400 rule"),
            ("1900 % 400", "300 ≠ 0", "NOT a leap year"),
            ("2000 % 400", "0", "IS a leap year"),
        ],
        result="1900 → false, 2000 → true",
    ),
    edge_cases=[
        ("y = 2024", "Divisible by 4, not a century → leap year (true)."),
        ("y = 2100", "Century not divisible by 400 → false."),
        ("y = 2400", "Century divisible by 400 → true."),
    ],
    pitfalls=[
        "Checking only `y % 4 == 0`, which wrongly marks 1900 as a leap year.",
        "Getting the precedence of the 100 and 400 rules backwards.",
    ],
    interviewer_intent=dict(
        testing="Whether you can translate a spec with an exception-to-an-exception into correct boolean logic.",
        common_mistake="Only testing divisibility by 4 and mishandling century years.",
        to_stand_out="Call out 1900 (false) and 2000 (true) yourself as the boundary cases that validate the rule.",
    ),
    clarifying=[
        ("Should I assume the Gregorian calendar?", "Yes — the 4/100/400 rule is Gregorian; pre-1582 dates would differ."),
    ],
    common_mistakes_detailed=[
        dict(
            title="Only checking divisibility by 4",
            why="It marks every century (1700, 1800, 1900) as a leap year, which is wrong unless they're also divisible by 400.",
            lang="java",
            bad="return y % 4 == 0;                  // 1900 -> true (WRONG)",
            good="return (y % 4 == 0 && y % 100 != 0) || (y % 400 == 0);",
        ),
    ],
    followups=[
        dict(title="Day of the Week", slug="day-of-the-week", hint="Date math that depends on knowing leap years to count February days.", leetcodeNumber=1185),
    ],
    remember_add=dict(
        formula="(y%4==0 && y%100!=0) || (y%400==0)",
        when_to_use=["Rules with exceptions-to-exceptions", "Encoding a spec as one boolean expression"],
    ),
)

E(
    "sum-1-to-n",
    deep_explanation=(
        "You can add 1 + 2 + … + n with a loop in O(n), but the closed form "
        "`n(n+1)/2` gives the same answer in O(1). Recognising when a loop collapses "
        "into a formula is the lesson.\n\n"
        "**Why the formula works (Gauss's pairing).** Write the sum forwards and "
        "backwards and add term by term: (1+n) + (2+(n−1)) + … Each of the n pairs "
        "sums to n+1, and there are n of them, giving n(n+1) for *twice* the sum — so "
        "the sum itself is n(n+1)/2. The young Gauss reputedly used this to add "
        "1..100 = 5050 in seconds.\n\n"
        "**Why `/2` is always exact.** Among any two consecutive integers n and n+1, "
        "exactly one is even, so their product is always divisible by 2 — the integer "
        "division loses nothing.\n\n"
        "**The overflow detail.** For n near 10⁹, `n * (n + 1)` is near 10¹⁸, which "
        "overflows 32-bit `int` long before the divide. Widen to `long` *before* "
        "multiplying — `(long) n * (n + 1) / 2`. This 'compute big, then divide' "
        "ordering is a recurring interview trap."
    ),
    hints=[
        "A loop works, but can you find the answer without iterating?",
        "Pair the first and last terms: 1+n, 2+(n−1)… each pair sums to n+1.",
        "Use n(n+1)/2 — and widen to 64-bit before multiplying for large n.",
    ],
    complexity_reasoning="the closed form is a fixed handful of arithmetic operations regardless of n.",
    dry_run=dict(
        input="n = 5",
        intro="Pairing makes the formula obvious.",
        steps=[
            ("pair ends", "(1+5)+(2+4) and the middle 3", "three pairs of 6 = sum*2"),
            ("formula", "5 * 6 / 2", "30 / 2"),
        ],
        result="15",
    ),
    edge_cases=[
        ("n = 1", "1 * 2 / 2 = 1, the single term."),
        ("n = 1000000000", "≈5×10¹⁷ — fits in long, overflows int; the cast is essential."),
    ],
    pitfalls=[
        "Computing `n * (n + 1)` in int and overflowing before the divide.",
        "Dividing before multiplying and losing the factor of 2 (only safe because one factor is even — keep the /2 last).",
    ],
    interviewer_intent=dict(
        testing="Whether you replace an O(n) loop with a closed form and guard the multiplication against overflow.",
        common_mistake="Returning a wrapped negative for large n due to int overflow in n*(n+1).",
        to_stand_out="Derive the formula via Gauss pairing and explain why /2 is exact.",
    ),
    clarifying=[
        ("How large can n be?", "Up to ~10⁹, which is why the product needs a 64-bit type."),
        ("Is n always positive?", "Yes; the formula assumes n ≥ 1 (n = 0 would give 0)."),
    ],
    followups=[
        dict(title="Sum of Array Elements", slug="array-sum", hint="When there's no formula, fall back to the O(n) accumulate fold."),
        dict(title="Sum of Digits", slug="sum-of-digits", hint="A different 'sum' built by extracting digits."),
    ],
    remember_add=dict(
        formula="return (long) n * (n + 1) / 2;",
        when_to_use=["Summing a contiguous arithmetic range", "Replacing a counting loop with a closed form"],
        anti_signals=["The series isn't arithmetic — no closed form, just loop"],
    ),
)

E(
    "factorial",
    deep_explanation=(
        "n! is the product 1·2·…·n, with 0! defined as 1. Multiply an accumulator "
        "(seeded at 1) by each integer up to n.\n\n"
        "**Why seed the accumulator at 1.** 1 is the multiplicative identity, so "
        "multiplying by it changes nothing — and it doubles as the correct answer for "
        "n = 0 and n = 1, where the loop body never runs or runs once. Seeding a "
        "product at 1 (like seeding a sum at 0) makes the empty/base case fall out for "
        "free.\n\n"
        "**Why iteration over recursion here.** Factorial is the textbook recursion "
        "example, but an iterative loop avoids call-stack overhead and the risk of a "
        "deep-recursion stack overflow. For an interview, iteration is the safer "
        "default; mention recursion as the elegant-but-costlier alternative.\n\n"
        "**The hard limit: overflow.** Factorials explode — 13! already overflows "
        "32-bit int, and 21! overflows 64-bit long. So even with `long`, the usable "
        "range is n ≤ 20. Stating that boundary shows you reason about ranges, not "
        "just write loops."
    ),
    hints=[
        "Multiply every integer from 1 (or 2) up to n into a running product.",
        "Seed the product at 1 so n = 0 returns 1 automatically.",
        "Watch the type: factorials overflow fast — long only reaches 20!.",
    ],
    complexity_reasoning="one multiplication per integer from 2 to n, so n−1 operations, and only one accumulator variable.",
    dry_run=dict(
        input="n = 5",
        intro="Fold the product, seeded at 1.",
        steps=[
            ("i = 2", "1 × 2", "result = 2"),
            ("i = 3", "2 × 3", "result = 6"),
            ("i = 4", "6 × 4", "result = 24"),
            ("i = 5", "24 × 5", "result = 120"),
        ],
        result="120",
    ),
    edge_cases=[
        ("n = 0", "Loop runs zero times; the seed 1 is returned — correct, since 0! = 1."),
        ("n = 1", "Loop runs zero times (starts at 2); returns 1."),
        ("n = 21", "Overflows even long — the answer is outside the representable range."),
    ],
    pitfalls=[
        "Returning 0 for n = 0 instead of 1.",
        "Storing the product in int and silently overflowing past 12!.",
    ],
    interviewer_intent=dict(
        testing="Whether you seed an accumulator correctly and reason about the type's overflow boundary.",
        common_mistake="Mishandling 0! or overflowing an int accumulator.",
        to_stand_out="Quote the exact limits (12! overflows int, 20! is the last that fits in long) and prefer iteration to avoid stack risk.",
    ),
    clarifying=[
        ("What's the maximum n?", "Realistically 20 if returning long, since 21! overflows; beyond that you'd need BigInteger."),
        ("How should 0 be handled?", "0! = 1 by definition — the seed handles it."),
    ],
    followups=[
        dict(title="Factorial (recursion)", slug="factorial-recursive", hint="Same product expressed as n × (n−1)! with a base case of 1."),
        dict(title="Power of a Number", slug="power-of-number", hint="Another accumulate-a-product pattern, optimised with fast exponentiation."),
    ],
    remember_add=dict(
        formula="result = 1; for i in 2..n: result *= i",
        when_to_use=["Products over a range", "Any accumulate-with-identity fold"],
        anti_signals=["n large and exact result needed — switch to BigInteger"],
    ),
)

E(
    "count-digits",
    deep_explanation=(
        "The digit count of a number is how many times you can integer-divide it by 10 "
        "before it reaches 0. Each `/= 10` chops the last digit; count the chops.\n\n"
        "**Why `% 10` and `/ 10` are the digit toolkit.** `n % 10` reads the last "
        "digit; `n / 10` removes it. Every digit problem — count, sum, reverse, "
        "palindrome — is built from this pair. Here we only need the removal half, "
        "counting iterations.\n\n"
        "**Why zero needs a special return.** The loop condition `n > 0` is false "
        "immediately for n = 0, so it would count 0 digits — but '0' has one digit. "
        "Return 1 up front for that input.\n\n"
        "**Why take the absolute value.** A negative like -42 has 2 digits; the sign "
        "isn't a digit. Working with `abs(n)` makes the loop behave for negatives "
        "(and avoids `n > 0` terminating instantly on a negative).\n\n"
        "**The `log10` alternative.** `(int) Math.log10(abs(n)) + 1` is O(1), but it's "
        "vulnerable to floating-point rounding on exact powers of ten — the divide "
        "loop is the robust answer."
    ),
    hints=[
        "How many times can you divide the number by 10 before it becomes 0?",
        "Use `% 10`/`/ 10` — here you only need the `/ 10` to strip digits and count.",
        "Handle 0 (one digit) and negatives (take abs) explicitly.",
    ],
    complexity_reasoning="one division per digit, so it's proportional to the number of digits d ≈ log10(n).",
    dry_run=dict(
        input="n = 12345",
        intro="Strip a digit each step; count the strips.",
        steps=[
            ("12345 / 10", "= 1234", "count = 1"),
            ("1234 / 10", "= 123", "count = 2"),
            ("123 / 10", "= 12", "count = 3"),
            ("12 / 10", "= 1", "count = 4"),
            ("1 / 10", "= 0, loop ends", "count = 5"),
        ],
        result="5",
    ),
    edge_cases=[
        ("n = 0", "Loop never runs; the up-front `return 1` gives the right answer."),
        ("n = -42", "abs makes it 42 → 2 digits; sign ignored."),
        ("n = 9", "Single division to 0 → 1 digit."),
    ],
    pitfalls=[
        "Returning 0 for input 0 instead of 1.",
        "Forgetting `abs`, so the `n > 0` loop ends immediately on a negative.",
    ],
    interviewer_intent=dict(
        testing="Whether you know the divide-by-10 digit idiom and handle the 0 / negative boundaries.",
        common_mistake="Off-by-one on zero, or a loop that never runs for negatives.",
        to_stand_out="Mention the log10 O(1) trick and why the loop is safer (no float rounding).",
    ),
    clarifying=[
        ("Does the sign count?", "No — I take the absolute value; -42 has 2 digits."),
        ("How is 0 handled?", "As one digit, special-cased before the loop."),
    ],
    followups=[
        dict(title="Sum of Digits", slug="sum-of-digits", hint="Same loop, but accumulate `% 10` instead of counting."),
        dict(title="Reverse a Number", slug="reverse-a-number", hint="Same loop, but rebuild the number from the stripped digits."),
    ],
    remember_add=dict(
        formula="count = 0; while n>0: n//=10; count++   (handle 0 -> 1)",
        when_to_use=["Anything that processes a number digit by digit"],
    ),
)

E(
    "sum-of-digits",
    deep_explanation=(
        "Peel digits off the right with `% 10`, add each to a running total, then drop "
        "it with `/ 10`, until the number is exhausted. Seeding the total at 0 makes "
        "n = 0 correct for free.\n\n"
        "**Why the order matters.** You must *read* the digit (`n % 10`) before you "
        "*remove* it (`n /= 10`). Swap the two and you'd divide first, lose the digit, "
        "and sum the wrong values. The standard idiom is `total += n % 10; n /= 10;` "
        "in that order.\n\n"
        "**Why the loop terminates.** Integer division by 10 strictly shrinks any "
        "positive number toward 0, so `while (n > 0)` always ends. Using `>=` instead "
        "would loop forever once n hits 0 (0 / 10 stays 0).\n\n"
        "This `% 10` / `/ 10` pair is the single most reused idiom across digit "
        "problems — reverse, palindrome, Armstrong, and digital-root all lean on it."
    ),
    hints=[
        "How do you read just the last digit of a number? How do you remove it?",
        "`n % 10` is the last digit; `n / 10` drops it. Add then drop.",
        "Loop while `n > 0`, seeding the total at 0.",
    ],
    complexity_reasoning="one modulo and one division per digit — proportional to the digit count.",
    dry_run=dict(
        input="n = 1234",
        intro="Add the last digit, then strip it.",
        steps=[
            ("1234", "+ 4, then /10", "total = 4, n = 123"),
            ("123", "+ 3, then /10", "total = 7, n = 12"),
            ("12", "+ 2, then /10", "total = 9, n = 1"),
            ("1", "+ 1, then /10", "total = 10, n = 0"),
        ],
        result="10",
    ),
    edge_cases=[
        ("n = 0", "Loop body never runs; the seed 0 is returned."),
        ("n = 99", "9 + 9 = 18."),
        ("n = 1000000000", "Sums to 1; only one non-zero digit."),
    ],
    pitfalls=[
        "Dividing before reading the digit, so you sum the wrong values.",
        "Using `n >= 0` as the loop guard and never terminating.",
    ],
    interviewer_intent=dict(
        testing="Whether you apply the read-then-strip digit idiom in the correct order with a terminating loop.",
        common_mistake="Reversing the modulo/divide order, or an infinite loop from a `>= 0` guard.",
        to_stand_out="Note that repeatedly summing digits gives the digital root, a common follow-up.",
    ),
    clarifying=[
        ("Are negatives possible?", "If so I'd take abs first; the contract here is non-negative."),
    ],
    followups=[
        dict(title="Add Digits (digital root)", slug="add-digits", hint="Repeat digit-sum until one digit remains; or use the 1 + (n−1) % 9 formula.", leetcodeNumber=258),
        dict(title="Happy Number", slug="happy-number", hint="Sum of squared digits, looped with cycle detection.", leetcodeNumber=202),
    ],
    remember_add=dict(
        formula="total=0; while n>0: total += n%10; n//=10",
        when_to_use=["Aggregating something over a number's digits"],
    ),
)

E(
    "reverse-a-number",
    deep_explanation=(
        "Build the reversed number digit by digit: `rev = rev * 10 + n % 10` pulls the "
        "current last digit of n and appends it to rev, while `n /= 10` advances. "
        "Repeat until n is gone.\n\n"
        "**Why `rev * 10 + digit` builds a number.** Multiplying by 10 shifts every "
        "existing digit one place left (opening a units slot), and adding the new "
        "digit fills that slot. Feeding digits from the right of n appends them to the "
        "right of rev — which reverses the order. This 'accumulator × base + digit' is "
        "the universal way to construct a number left-to-right.\n\n"
        "**Why trailing zeros vanish.** For 120, the digits fed in are 0, 2, 1. The "
        "leading 0 contributes `0*10 + 0 = 0`, so it never becomes a stored leading "
        "zero — you get 21, which is the conventional answer.\n\n"
        "**Sign and overflow.** Save the sign, reverse the absolute value, reapply the "
        "sign. In production, reversing can overflow (reverse of 2,000,000,003 exceeds "
        "int), so a robust version checks `rev` against the limit before each "
        "`rev*10`. Mentioning that guard earns credit even when the prompt promises it "
        "fits."
    ),
    hints=[
        "Build the result one digit at a time from the input's last digit.",
        "`rev = rev * 10 + n % 10` appends a digit; `n /= 10` advances.",
        "Track the sign separately and think about whether the reversed value can overflow.",
    ],
    complexity_reasoning="one multiply/add per digit, with a single accumulator — proportional to the digit count.",
    dry_run=dict(
        input="n = 1234",
        intro="Each step shifts rev left and appends the next digit.",
        steps=[
            ("digit 4", "rev = 0*10 + 4", "rev = 4, n = 123"),
            ("digit 3", "rev = 4*10 + 3", "rev = 43, n = 12"),
            ("digit 2", "rev = 43*10 + 2", "rev = 432, n = 1"),
            ("digit 1", "rev = 432*10 + 1", "rev = 4321, n = 0"),
        ],
        result="4321",
    ),
    edge_cases=[
        ("n = -120", "Sign saved; reverse of 120 is 21; result -21 (trailing zero dropped)."),
        ("n = 5", "Single digit reverses to itself."),
        ("n = 1000", "Reverses to 1; leading zeros never stored."),
    ],
    pitfalls=[
        "Losing the sign on negative inputs.",
        "Ignoring overflow when the reversed value can exceed the type's range.",
    ],
    interviewer_intent=dict(
        testing="Whether you can construct a number with the ×10+digit idiom and reason about sign and overflow.",
        common_mistake="Dropping the sign, or overflowing on a reverse that exceeds int range.",
        to_stand_out="Add the pre-multiply overflow check (the LC7 detail) even if the prompt says it fits.",
    ),
    clarifying=[
        ("Should I preserve the sign?", "Yes — reverse the magnitude and reapply the sign."),
        ("What if the reversed number overflows?", "LC7 says return 0; I'd guard `rev` before each ×10."),
    ],
    followups=[
        dict(title="Reverse Integer (with overflow)", slug="reverse-integer", hint="Same idiom but return 0 on 32-bit overflow.", leetcodeNumber=7),
        dict(title="Palindrome Number", slug="palindrome-number", hint="Reverse and compare to the original."),
    ],
    remember_add=dict(
        formula="rev = rev*10 + n%10;  n /= 10",
        when_to_use=["Reversing digits", "Building any number left-to-right from a digit stream"],
    ),
)

E(
    "palindrome-number",
    deep_explanation=(
        "A number is a palindrome when reversing its digits yields the same number. "
        "Reuse the reverse-a-number idiom and compare the reversed value to the "
        "original.\n\n"
        "**Why save the original first.** The reversal loop destroys n (it divides it "
        "down to 0), so you must capture `original = n` *before* the loop, then compare "
        "`rev == original` afterward. Comparing against the post-loop n (which is 0) is "
        "a classic bug.\n\n"
        "**Why negatives are never palindromes.** -121 written out is `-121`; reversed "
        "it would read `121-`, which isn't a valid number — so by convention negatives "
        "return false. Reject them up front.\n\n"
        "**The half-reversal optimisation.** You can stop after reversing only half the "
        "digits and compare halves, which avoids any overflow concern. For a fresher "
        "answer, full reverse-and-compare is perfectly acceptable — but mentioning the "
        "half-reverse shows depth."
    ),
    hints=[
        "What does 'reads the same backwards' mean in terms of reversing the digits?",
        "Reverse the number, then compare to the original — but save the original first.",
        "Handle negatives up front: by convention they're not palindromes.",
    ],
    complexity_reasoning="one reversal pass over the digits plus an equality check — proportional to the digit count.",
    dry_run=dict(
        input="n = 121",
        intro="Reverse, then compare to the saved original.",
        steps=[
            ("save", "original = 121", "rev = 0"),
            ("reverse", "build 1, 12, 121", "rev = 121"),
            ("compare", "121 == 121", "true"),
        ],
        result="true",
    ),
    edge_cases=[
        ("n = -121", "Rejected up front — negatives aren't palindromes → false."),
        ("n = 10", "Reverses to 1; 1 ≠ 10 → false."),
        ("n = 0", "Reverses to 0 → true."),
    ],
    pitfalls=[
        "Comparing `rev` against the mutated n (now 0) instead of the saved original.",
        "Treating negative numbers as palindromes.",
    ],
    interviewer_intent=dict(
        testing="Whether you reuse a known idiom and correctly preserve state a loop mutates.",
        common_mistake="Forgetting to snapshot the original, or mishandling negatives.",
        to_stand_out="Offer the half-reversal variant that sidesteps overflow entirely.",
    ),
    clarifying=[
        ("Are negative numbers palindromes?", "No, by the standard convention (the minus sign breaks symmetry)."),
        ("Can I convert to a string?", "I can, but the math approach avoids extra space — I'll show that."),
    ],
    followups=[
        dict(title="Palindrome Number (half reverse)", slug="palindrome-number-half", hint="Reverse only half the digits and compare halves to avoid overflow.", leetcodeNumber=9),
        dict(title="Palindrome String", slug="palindrome-string", hint="Same idea on characters with two pointers."),
    ],
    remember_add=dict(
        formula="orig=n; reverse(n)->rev; return rev==orig  (reject n<0)",
        when_to_use=["Symmetry checks on digit/character sequences"],
    ),
)

E(
    "prime-number",
    deep_explanation=(
        "A prime is an integer greater than 1 whose only divisors are 1 and itself. "
        "Test candidate divisors from 2 upward; if none divides n, it's prime. The key "
        "optimisation is stopping at √n.\n\n"
        "**Why √n is enough.** Divisors come in pairs: if `d` divides n, so does "
        "`n/d`. One member of each pair is ≤ √n and the other is ≥ √n. So if n had any "
        "divisor, it would have one at or below √n — checking past √n only re-finds the "
        "larger partners. This turns an O(n) scan into O(√n).\n\n"
        "**Why `i * i <= n` instead of `i <= sqrt(n)`.** Squaring keeps you in integer "
        "arithmetic and avoids floating-point rounding errors near perfect squares. "
        "Cast to `long` for the square (`(long) i * i`) so it can't overflow int for "
        "large n.\n\n"
        "**The base cases.** n ≤ 1 (including 0, 1, and negatives) is not prime by "
        "definition — handle that before the loop. 2 and 3 fall through correctly "
        "because the loop body never finds a divisor."
    ),
    hints=[
        "Try dividing n by candidates starting at 2 — but how far do you really need to go?",
        "Divisors pair up around √n, so you only need to test up to √n.",
        "Use `i * i <= n` (integer-safe) and handle n ≤ 1 as 'not prime' first.",
    ],
    complexity_reasoning="the loop runs until i² exceeds n, i.e. about √n iterations, each doing one modulo.",
    dry_run=dict(
        input="n = 37",
        intro="Only test divisors up to √37 ≈ 6.08.",
        steps=[
            ("i = 2", "37 % 2 = 1", "no divisor"),
            ("i = 3", "37 % 3 = 1", "no divisor"),
            ("i = 4", "37 % 4 = 1", "no divisor"),
            ("i = 5", "37 % 5 = 2", "no divisor"),
            ("i = 6", "6*6 = 36 ≤ 37; 37 % 6 = 1", "no divisor"),
            ("i = 7", "7*7 = 49 > 37, stop", "prime"),
        ],
        result="true",
    ),
    edge_cases=[
        ("n = 1", "Not prime by definition — handled before the loop."),
        ("n = 2", "Loop's first square 4 > 2, so it exits immediately → prime."),
        ("n = 9", "i = 3 divides it (3×3) → not prime, caught at √9."),
    ],
    pitfalls=[
        "Looping all the way to n (O(n)) instead of √n.",
        "Marking 0 or 1 as prime.",
        "`i * i` overflowing int for large n — cast to long.",
    ],
    interviewer_intent=dict(
        testing="Whether you know the √n divisor bound and justify it, plus the base cases.",
        common_mistake="An O(n) loop, or mishandling 0/1, or i*i overflow.",
        to_stand_out="Explain the divisor-pairing argument for √n and mention the Sieve of Eratosthenes for many queries.",
    ),
    clarifying=[
        ("Do I need to handle 0, 1, negatives?", "Yes — all are 'not prime'; I guard n ≤ 1 first."),
        ("Will this be called many times?", "If so, a sieve precomputes all primes up to a bound more efficiently."),
    ],
    common_mistakes_detailed=[
        dict(
            title="Scanning every divisor up to n",
            why="Checking i from 2 to n−1 is O(n); on n near 10⁹ it times out. Divisors pair around √n, so √n suffices.",
            lang="java",
            bad="for (int i = 2; i < n; i++) if (n % i == 0) return false;",
            good="for (int i = 2; (long) i * i <= n; i++) if (n % i == 0) return false;",
        ),
    ],
    followups=[
        dict(title="Count Primes (sieve)", slug="count-primes", hint="Sieve of Eratosthenes counts all primes below n in O(n log log n).", leetcodeNumber=204),
    ],
    remember_add=dict(
        formula="for i=2 while i*i<=n: if n%i==0 -> composite",
        when_to_use=["Primality / divisor questions", "Anytime you can bound a search at √n"],
        anti_signals=["Many primality queries — precompute a sieve instead"],
    ),
)

E(
    "nth-fibonacci",
    deep_explanation=(
        "Each Fibonacci number is the sum of the previous two, so you only ever need "
        "to remember the last two values. Roll a pair `(a, b)` forward n times: "
        "`(a, b) → (b, a + b)`. O(n) time, O(1) space.\n\n"
        "**Why not plain recursion.** The naive `fib(n) = fib(n-1) + fib(n-2)` "
        "recomputes the same subproblems exponentially — fib(50) makes ~2.5 billion "
        "calls. The iterative roll computes each value once. Naming that O(2ⁿ) "
        "blow-up and replacing it with O(n) is the entire interview signal.\n\n"
        "**Why two variables suffice.** The recurrence has 'order 2' — the next value "
        "depends only on the two before it. Whenever state depends on the last k "
        "values, you keep k variables, not the whole history. This is the seed of "
        "space-optimised dynamic programming.\n\n"
        "**Overflow.** Fibonacci grows ~1.618ⁿ, so F(91) overflows 64-bit long. With "
        "`long`, n ≤ 90 is the safe range — beyond that you'd need BigInteger."
    ),
    hints=[
        "Each value needs only the previous two. Do you really need an array?",
        "Roll two variables forward: (a, b) becomes (b, a + b).",
        "Avoid naive recursion — it's exponential. Watch overflow past F(90).",
    ],
    complexity_reasoning="one addition per step for n steps, holding just two values.",
    dry_run=dict(
        input="n = 6",
        intro="Slide the two-value window forward n times.",
        steps=[
            ("start", "a=0, b=1", "F(0)=0"),
            ("step 1", "(1, 0+1)", "a=1, b=1"),
            ("step 2", "(1, 1+1)", "a=1, b=2"),
            ("step 3", "(2, 1+2)", "a=2, b=3"),
            ("step 4-6", "...3,5,8", "a=8 after 6 steps"),
        ],
        result="8",
    ),
    edge_cases=[
        ("n = 0", "Loop runs zero times; returns a = 0 = F(0)."),
        ("n = 1", "One step → a = 1 = F(1)."),
        ("n = 90", "Largest F that fits in long; F(91) overflows."),
    ],
    pitfalls=[
        "Using naive recursion and timing out at O(2ⁿ).",
        "Off-by-one in the loop bound or returning b instead of a.",
    ],
    interviewer_intent=dict(
        testing="Whether you avoid exponential recursion and recognise the O(1)-space rolling pattern.",
        common_mistake="Exponential recursion, or an off-by-one returning the wrong index.",
        to_stand_out="Mention memoised recursion, the O(1) roll, and even the O(log n) matrix-power method.",
    ),
    clarifying=[
        ("Is the sequence 0- or 1-indexed?", "I'll assume F(0)=0, F(1)=1 — confirm the indexing matters for the answer."),
        ("How large is n?", "Up to ~90 for long; bigger needs BigInteger."),
    ],
    common_mistakes_detailed=[
        dict(
            title="Naive exponential recursion",
            why="fib(n-1)+fib(n-2) recomputes overlapping subproblems, making ~2ⁿ calls; fib(50) is already billions.",
            lang="python",
            bad="def fib(n):\n    if n < 2: return n\n    return fib(n-1) + fib(n-2)   # O(2^n)",
            good="def fib(n):\n    a, b = 0, 1\n    for _ in range(n):\n        a, b = b, a + b\n    return a            # O(n), O(1)",
        ),
    ],
    followups=[
        dict(title="Climbing Stairs", slug="climbing-stairs", hint="Identical recurrence — ways(n) = ways(n-1) + ways(n-2).", leetcodeNumber=70),
        dict(title="Fibonacci in O(log n)", slug="fibonacci-matrix", hint="Matrix exponentiation of [[1,1],[1,0]]."),
    ],
    remember_add=dict(
        formula="a,b = 0,1;  repeat n times: a,b = b, a+b;  return a",
        when_to_use=["State depends on the last k values", "Space-optimising a 1-D DP"],
        anti_signals=["Need many arbitrary indices fast — consider matrix power / closed form"],
    ),
)

E(
    "gcd-of-two-numbers",
    deep_explanation=(
        "The Euclidean algorithm computes gcd(a, b) by repeatedly replacing the pair "
        "with `(b, a mod b)` until the second number is 0; the remaining first number "
        "is the GCD.\n\n"
        "**Why `gcd(a, b) = gcd(b, a mod b)`.** Any number that divides both a and b "
        "also divides `a − k·b = a mod b`, and vice versa — so the pair (a, b) and the "
        "pair (b, a mod b) share *exactly* the same set of common divisors, hence the "
        "same greatest one. Each step shrinks the numbers fast, so it terminates "
        "quickly.\n\n"
        "**Why it ends in O(log) steps.** The remainder at least halves every two "
        "steps, so the number of iterations is logarithmic in min(a, b) — vastly "
        "faster than testing every candidate divisor.\n\n"
        "**The base case.** When b becomes 0, a holds the answer, and `gcd(x, 0) = x` "
        "is exactly right (every number divides 0). That's why the loop condition is "
        "`while (b != 0)` and the result is the final a."
    ),
    hints=[
        "Common divisors of a and b are the same as common divisors of b and (a mod b).",
        "Repeatedly do (a, b) = (b, a % b) until b is 0.",
        "When b hits 0, a is the GCD — no divisor search needed.",
    ],
    complexity_reasoning="the remainder shrinks geometrically, so it terminates in O(log(min(a,b))) steps.",
    dry_run=dict(
        input="a = 48, b = 18",
        intro="Replace the pair with (b, a mod b) each step.",
        steps=[
            ("48, 18", "48 mod 18 = 12", "(18, 12)"),
            ("18, 12", "18 mod 12 = 6", "(12, 6)"),
            ("12, 6", "12 mod 6 = 0", "(6, 0)"),
            ("b = 0", "stop", "gcd = 6"),
        ],
        result="6",
    ),
    edge_cases=[
        ("a = 0, b = 5", "gcd(0, 5) = 5; the loop returns b's value via one swap."),
        ("a = 7, b = 13", "Coprime → gcd 1."),
        ("a = 12, b = 12", "Equal → gcd 12 after one step (12 mod 12 = 0)."),
    ],
    pitfalls=[
        "Searching every divisor (O(min(a,b))) instead of using Euclid.",
        "Mishandling the gcd(x, 0) = x base case.",
    ],
    interviewer_intent=dict(
        testing="Whether you know Euclid's algorithm and can justify why mod-reduction preserves the GCD.",
        common_mistake="A brute-force divisor scan, or breaking the (x, 0) base case.",
        to_stand_out="Explain the shared-divisor invariant and note that LCM builds on this.",
    ),
    clarifying=[
        ("Can either input be 0?", "Yes — gcd(x, 0) = x; the algorithm handles it naturally if not both are 0."),
        ("Do I need the extended version (coefficients)?", "Only if asked; the extended Euclid also returns x, y with ax + by = gcd."),
    ],
    followups=[
        dict(title="LCM of Two Numbers", slug="lcm-of-two-numbers", hint="lcm = a / gcd * b, reusing this."),
        dict(title="GCD of an Array", slug="gcd-of-array", hint="Fold gcd across all elements; gcd is associative."),
    ],
    remember_add=dict(
        formula="while b != 0: a, b = b, a % b;  return a",
        when_to_use=["GCD/LCM", "Reducing fractions", "Any 'largest common' over integers"],
    ),
)

E(
    "lcm-of-two-numbers",
    deep_explanation=(
        "The least common multiple comes straight from the GCD via the identity "
        "`a · b = gcd(a, b) · lcm(a, b)`. Rearranged: `lcm = a / gcd(a, b) * b`.\n\n"
        "**Why divide before you multiply.** Writing `a * b / gcd` first forms the "
        "full product `a * b`, which can overflow even when the LCM itself fits. "
        "Dividing a by the gcd *first* (which is exact, since gcd divides a) shrinks "
        "the operand before the multiply, keeping intermediates small. Same answer, no "
        "overflow.\n\n"
        "**Why the identity holds.** Every prime appears in a·b with the sum of its "
        "exponents in a and b; the gcd takes the min exponent and the lcm takes the "
        "max, and min + max = the sum — so multiplying gcd and lcm reconstructs a·b.\n\n"
        "**Reuse Euclid.** Compute the gcd with the Euclidean loop, then apply the "
        "formula. Use `long` for the result to be safe."
    ),
    hints=[
        "LCM and GCD are linked by a famous identity — what is a·b in terms of them?",
        "lcm = a / gcd(a, b) * b. Reuse the Euclidean gcd.",
        "Divide before multiplying to avoid overflowing on a*b.",
    ],
    complexity_reasoning="dominated by the gcd computation, O(log(min(a,b))); the formula itself is O(1).",
    dry_run=dict(
        input="a = 4, b = 6",
        intro="Compute gcd, then divide-before-multiply.",
        steps=[
            ("gcd(4, 6)", "Euclid → 2", "gcd = 2"),
            ("4 / 2", "= 2", "intermediate 2"),
            ("2 * 6", "= 12", "lcm = 12"),
        ],
        result="12",
    ),
    edge_cases=[
        ("a = 3, b = 5", "Coprime → lcm is the product 15."),
        ("a = 6, b = 12", "lcm = 12 (12 is already a multiple of 6)."),
        ("a = 1, b = 7", "lcm = 7."),
    ],
    pitfalls=[
        "Computing `a * b` first and overflowing.",
        "Forgetting that LCM is derived from the GCD.",
    ],
    interviewer_intent=dict(
        testing="Whether you connect LCM to GCD and order the arithmetic to avoid overflow.",
        common_mistake="The `a * b / gcd` ordering that overflows on large inputs.",
        to_stand_out="State the prime-exponent reason min+max=sum behind the identity.",
    ),
    clarifying=[
        ("Can inputs be 0?", "lcm(0, x) is typically defined as 0; I'd confirm the contract."),
        ("How large are a and b?", "It decides whether long is needed and why I divide first."),
    ],
    common_mistakes_detailed=[
        dict(
            title="Multiplying before dividing",
            why="`a * b` can overflow even when the LCM fits; dividing by gcd first (exact) keeps the operands small.",
            lang="java",
            bad="long lcm = (long) a * b / gcd(a, b);   // a*b may overflow",
            good="long lcm = (long) a / gcd(a, b) * b;   // divide first",
        ),
    ],
    followups=[
        dict(title="GCD of Two Numbers", slug="gcd-of-two-numbers", hint="The building block this reuses."),
    ],
    remember_add=dict(
        formula="lcm = a / gcd(a, b) * b",
        when_to_use=["Combining periods/cycles", "Common-denominator and scheduling problems"],
    ),
)

E(
    "power-of-number",
    deep_explanation=(
        "Binary (fast) exponentiation computes xⁿ in O(log n) multiplications instead "
        "of the O(n) of a naive loop, by exploiting the binary representation of the "
        "exponent.\n\n"
        "**The core idea.** Repeatedly squaring the base produces x¹, x², x⁴, x⁸, … — "
        "the powers of x at each bit position. Write n in binary; xⁿ is the product of "
        "exactly those squared powers where n has a 1-bit. So scan n bit by bit: if "
        "the current bit is 1, multiply it into the result; either way, square the base "
        "and shift n right.\n\n"
        "**Why this is log n.** Each step halves n (`n >>= 1`), so there are about "
        "log₂(n) iterations, each doing a constant number of multiplications. For "
        "n = 1,000,000 that's ~20 multiplies versus a million.\n\n"
        "**The base case.** x⁰ = 1, handled because the loop runs zero times and the "
        "result starts at 1. A simple O(n) loop is acceptable for small n, but showing "
        "the O(log n) trick is the distinguishing move."
    ),
    hints=[
        "A loop multiplying x n times is O(n). Can you use the binary form of n?",
        "Squaring gives x, x², x⁴, x⁸… — multiply in the ones matching n's 1-bits.",
        "If n is odd, fold x into the result; then square x and halve n.",
    ],
    complexity_reasoning="the exponent halves each iteration, so ~log₂(n) iterations with O(1) work each.",
    dry_run=dict(
        input="x = 3, n = 5  (binary 101)",
        intro="Square the base; multiply in on 1-bits.",
        steps=[
            ("n=5 (odd)", "result *= 3 → 3; x = 9; n = 2", "result 3"),
            ("n=2 (even)", "skip; x = 81; n = 1", "result 3"),
            ("n=1 (odd)", "result *= 81 → 243; x; n = 0", "result 243"),
        ],
        result="243",
    ),
    edge_cases=[
        ("x = 5, n = 0", "Loop never runs; result stays 1 (5⁰ = 1)."),
        ("x = 2, n = 10", "Five-ish steps give 1024 with far fewer multiplies than 10."),
        ("x = 1, n = 1000000", "Returns 1 quickly; squaring 1 stays 1."),
    ],
    pitfalls=[
        "Using an O(n) loop when O(log n) is expected.",
        "Forgetting x⁰ = 1, or not squaring x every iteration.",
    ],
    interviewer_intent=dict(
        testing="Whether you know binary exponentiation and can connect it to the exponent's bits.",
        common_mistake="A linear loop, or only squaring without the odd-bit multiply.",
        to_stand_out="Generalise to modular exponentiation (`% mod` each multiply) used in hashing/crypto.",
    ),
    clarifying=[
        ("Is the exponent non-negative?", "I'll assume n ≥ 0; negative n means 1/xⁿ (a double result)."),
        ("Do I need it modulo something?", "If so, take the modulus after each multiply — modular exponentiation."),
    ],
    followups=[
        dict(title="Pow(x, n) with negatives", slug="powx-n", hint="Handle negative exponents and double precision.", leetcodeNumber=50),
        dict(title="Modular Exponentiation", slug="modular-exponentiation", hint="Same loop, take `% mod` after each multiply."),
    ],
    remember_add=dict(
        formula="res=1; while n>0: if n&1: res*=x; x*=x; n>>=1",
        when_to_use=["x^n fast", "Modular exponentiation", "Matrix power / repeated squaring"],
        anti_signals=["n tiny — a plain loop is fine and clearer"],
    ),
)

E(
    "armstrong-number",
    deep_explanation=(
        "An Armstrong (narcissistic) number equals the sum of each of its digits "
        "raised to the power of the digit count. For 3-digit numbers that's the sum of "
        "the cubes; in general it's the d-th powers for a d-digit number.\n\n"
        "**The two-pass shape.** First find d, the number of digits (so you know which "
        "power to use). Then walk the digits again with the `% 10` / `/ 10` idiom, "
        "raising each to the d-th power and summing. Compare the sum to the original.\n\n"
        "**Why d matters.** 153 = 1³ + 5³ + 3³ = 153 is Armstrong *as a 3-digit "
        "number*. The exponent is the digit count, not a fixed 3 — 1634 = 1⁴ + 6⁴ + "
        "3⁴ + 4⁴ is a 4-digit Armstrong number. Hardcoding the cube only works for "
        "3-digit inputs.\n\n"
        "**Preserve the original.** As with palindrome, the digit-walk destroys the "
        "working copy, so capture the original first and compare the accumulated power "
        "sum to it."
    ),
    hints=[
        "Each digit is raised to a power — what power? Count the digits first.",
        "Pass 1: count digits d. Pass 2: sum each digit^d using `% 10`/`/ 10`.",
        "Compare the sum to the saved original; remember 153 = 1³+5³+3³.",
    ],
    complexity_reasoning="two passes over the d digits, each digit raised to the d-th power — O(d · log d) or effectively O(d) for small d.",
    dry_run=dict(
        input="n = 153",
        intro="3 digits, so cube each.",
        steps=[
            ("count digits", "153 has 3 digits", "d = 3"),
            ("digit 3", "3³ = 27", "sum = 27"),
            ("digit 5", "5³ = 125", "sum = 152"),
            ("digit 1", "1³ = 1", "sum = 153"),
            ("compare", "153 == 153", "true"),
        ],
        result="true",
    ),
    edge_cases=[
        ("n = 9", "Single digit: 9¹ = 9 = n → Armstrong (all 1-digit numbers are)."),
        ("n = 10", "1¹·? d=2 → 1² + 0² = 1 ≠ 10 → false."),
        ("n = 1634", "4 digits → 1⁴+6⁴+3⁴+4⁴ = 1634 → true."),
    ],
    pitfalls=[
        "Hardcoding the cube (power 3) instead of using the digit count.",
        "Comparing against the mutated copy instead of the saved original.",
    ],
    interviewer_intent=dict(
        testing="Whether you derive the exponent from the digit count and combine the digit idiom with a power.",
        common_mistake="Assuming power 3 for all inputs, or losing the original value.",
        to_stand_out="Note the general definition (d-th powers) beyond the popular 3-digit examples.",
    ),
    clarifying=[
        ("Is the power always 3?", "No — it's the number of digits; 1634 is a 4th-power Armstrong number."),
        ("Are single digits Armstrong?", "Yes: every 1-digit number equals itself to the first power."),
    ],
    followups=[
        dict(title="Sum of Digits", slug="sum-of-digits", hint="The simpler digit-walk this builds on."),
        dict(title="Happy Number", slug="happy-number", hint="Iterated sum of squared digits with cycle detection.", leetcodeNumber=202),
    ],
    remember_add=dict(
        formula="d = digits(n); sum of (each digit)^d == n ?",
        when_to_use=["Digit-property checks where the exponent depends on length"],
    ),
)


# ─────────────────────────────────────────────────────────────────────────────
# Wave 2 — Arrays (22)
# ─────────────────────────────────────────────────────────────────────────────

E(
    "array-maximum",
    deep_explanation=(
        "Finding the largest element is the canonical **running maximum** (a 'fold'): "
        "carry a best-so-far value and update it whenever you meet something bigger. "
        "One pass, constant extra space.\n\n"
        "**Why seed with `nums[0]`, never 0.** The accumulator must start at a value "
        "that is actually achievable. If you seed `max = 0` and the array is "
        "all-negative (e.g. [-5, -1, -8]), nothing ever beats 0, so you'd wrongly "
        "return 0 — a value that isn't even in the array. Seeding with the first "
        "element guarantees the answer is a real element.\n\n"
        "**Why one pass is optimal.** You cannot know the maximum without looking at "
        "every element at least once (any element you skip could be the largest), so "
        "O(n) is a hard lower bound — there's no cleverer algorithm.\n\n"
        "This fold is the atom of `max-of-three`, `second-largest`, Kadane's maximum "
        "subarray, and countless other scans. Master the seed-and-update shape here."
    ),
    hints=[
        "Carry a 'best so far' as you walk the array — what should it start as?",
        "Seed it with nums[0], not 0, so all-negative arrays still work.",
        "Update best whenever the current element is larger; one pass is enough.",
    ],
    complexity_reasoning="every element is visited once with O(1) work, and you can't find the max without seeing each element at least once.",
    dry_run=dict(
        input="nums = [3, 7, 2, 9, 4]",
        intro="Seed with the first element, keep the larger each step.",
        steps=[
            ("seed", "max = nums[0]", "max = 3"),
            ("7", "7 > 3", "max = 7"),
            ("2", "2 < 7", "max = 7"),
            ("9", "9 > 7", "max = 9"),
            ("4", "4 < 9", "max = 9"),
        ],
        result="9",
    ),
    edge_cases=[
        ("nums = [-5, -1, -8]", "Returns -1; seeding with nums[0] (not 0) is what makes this correct."),
        ("nums = [42]", "Single element is the max."),
        ("nums = [4, 4, 4]", "Ties don't matter; returns 4."),
    ],
    pitfalls=[
        "Seeding max with 0 — returns 0 for an all-negative array.",
        "Starting the scan at index 1 but seeding with 0 instead of nums[0].",
    ],
    interviewer_intent=dict(
        testing="Whether you write a correct running-max fold and seed the accumulator with a real element.",
        common_mistake="Seeding with 0 (or Integer.MIN handled wrong) so all-negative inputs break.",
        to_stand_out="Note this is the base fold reused by second-largest and Kadane's algorithm.",
    ),
    clarifying=[
        ("Can the array be empty?", "If so I'd return a sentinel or throw; here it's guaranteed non-empty so I seed with nums[0]."),
    ],
    common_mistakes_detailed=[
        dict(
            title="Seeding the max with 0",
            why="For an all-negative array nothing exceeds 0, so you return 0 — a value not in the array.",
            lang="java",
            bad="int max = 0;\nfor (int x : nums) if (x > max) max = x;   // [-5,-1] -> 0 (WRONG)",
            good="int max = nums[0];\nfor (int x : nums) if (x > max) max = x;",
        ),
    ],
    followups=[
        dict(title="Minimum in an Array", slug="array-minimum", hint="The same fold with the comparison flipped."),
        dict(title="Second Largest Element", slug="second-largest", hint="Track the top two in one pass."),
    ],
    remember_add=dict(
        formula="max = nums[0]; for x in nums: if x > max: max = x",
        when_to_use=["Largest/smallest in a sequence", "The base step of any running-extreme scan"],
        anti_signals=["Array is sorted — the max is just the last element"],
    ),
)

E(
    "array-minimum",
    deep_explanation=(
        "The minimum is the maximum's mirror image: carry a running smallest, seeded "
        "with `nums[0]`, and keep the lesser value at each step. Identical fold, flipped "
        "comparison.\n\n"
        "**Why seed with `nums[0]`.** The all-positive array is the dual trap: seed "
        "`min = 0` and run [5, 1, 8] and you'd return 0, which isn't present. Seeding "
        "with the first element keeps the answer a real element regardless of sign.\n\n"
        "**Why it's still one pass.** Same argument as the max — you must inspect every "
        "element, since any unseen one could be the smallest. O(n) is optimal.\n\n"
        "Recognising min and max as the *same* loop with `<` swapped for `>` is the "
        "transferable insight; later you'll track both at once (sum-of-min-and-max)."
    ),
    hints=[
        "This is array-maximum with one operator changed — which one?",
        "Seed the running min with nums[0], not 0.",
        "Keep the smaller value at each step in a single pass.",
    ],
    complexity_reasoning="one comparison per element, O(1) state, and every element must be seen.",
    dry_run=dict(
        input="nums = [5, 1, 8]",
        intro="Keep the smaller value each step.",
        steps=[
            ("seed", "min = nums[0]", "min = 5"),
            ("1", "1 < 5", "min = 1"),
            ("8", "8 > 1", "min = 1"),
        ],
        result="1",
    ),
    edge_cases=[
        ("nums = [5, 1, 8]", "Returns 1; seeding with 0 would wrongly return 0."),
        ("nums = [-2]", "Single element is the min."),
    ],
    pitfalls=[
        "Seeding min with 0 — wrong for all-positive arrays.",
        "Accidentally reusing a `>` (max) comparison.",
    ],
    interviewer_intent=dict(
        testing="Whether you see min/max as one fold and seed correctly.",
        common_mistake="Seeding with 0 so all-positive inputs return 0.",
        to_stand_out="State that min and max can be tracked together in a single pass.",
    ),
    clarifying=[
        ("Is the array guaranteed non-empty?", "Yes — that lets me seed with nums[0] without an empty-check."),
    ],
    followups=[
        dict(title="Maximum in an Array", slug="array-maximum", hint="Same fold, flipped comparison."),
        dict(title="Sum of Min and Max", slug="sum-of-min-and-max", hint="Track both extremes in one pass."),
    ],
    remember_add=dict(
        formula="min = nums[0]; for x in nums: if x < min: min = x",
        when_to_use=["Smallest in a sequence", "Pairs naturally with a running max"],
    ),
)

E(
    "array-sum",
    deep_explanation=(
        "Summing an array is the **accumulate fold**: start a total at 0 (the additive "
        "identity) and add each element. Seeding at 0 makes the empty array return 0 "
        "with no special case.\n\n"
        "**Why a `long` accumulator.** With up to 10⁵ elements each up to 10⁹ in "
        "magnitude, the true sum can reach 10¹⁴ — far beyond the 32-bit `int` ceiling "
        "of ~2.1×10⁹. Accumulating into an `int` silently overflows partway through and "
        "returns garbage. A 64-bit `long` holds the result safely.\n\n"
        "**Why seed at 0, not nums[0].** Seeding with the additive identity means the "
        "loop body is uniform (it adds *every* element) and the empty input falls out "
        "correctly. Seeding with nums[0] would double-count it unless you also skip "
        "index 0 — extra fiddliness for no gain.\n\n"
        "This is the template for every 'total / mean / weighted sum' problem; the "
        "filtered variant (sum of evens) just adds an `if` inside the loop."
    ),
    hints=[
        "Carry a running total — what value should it start at?",
        "Seed at 0 so an empty array returns 0 naturally.",
        "Think about the type: 10⁵ values near 10⁹ overflow a 32-bit int.",
    ],
    complexity_reasoning="one addition per element; a single accumulator means O(1) extra space.",
    dry_run=dict(
        input="nums = [1, 2, 3, 4]",
        intro="Fold from the additive identity 0.",
        steps=[
            ("start", "total = 0", "0"),
            ("+1", "0 + 1", "1"),
            ("+2", "1 + 2", "3"),
            ("+3", "3 + 3", "6"),
            ("+4", "6 + 4", "10"),
        ],
        result="10",
    ),
    edge_cases=[
        ("nums = []", "Empty sum is 0 — the seed handles it."),
        ("nums = [-1, 5, -4]", "Mixed signs sum to 0."),
        ("100000 elements of 10^9", "≈10^14 — fits in long, overflows int."),
    ],
    pitfalls=[
        "Using an int accumulator and overflowing on large arrays.",
        "Seeding the total with nums[0] and double-counting it.",
    ],
    interviewer_intent=dict(
        testing="Whether you fold from the identity and pick a type wide enough for the worst-case total.",
        common_mistake="Overflowing an int sum.",
        to_stand_out="Quote the worst-case magnitude (10⁵ × 10⁹ = 10¹⁴) to justify long.",
    ),
    clarifying=[
        ("How big can the array and values be?", "Up to 10⁵ elements of magnitude 10⁹, which is why I sum into a long."),
    ],
    followups=[
        dict(title="Average of an Array", slug="array-average", hint="Sum then divide as a double."),
        dict(title="Sum of Even Numbers", slug="sum-even-numbers-array", hint="Same fold with a parity filter."),
    ],
    remember_add=dict(
        formula="total = 0; for x in nums: total += x   (use long)",
        when_to_use=["Totals, means, weighted sums", "Any reduce-to-one-number scan"],
    ),
)

E(
    "array-average",
    deep_explanation=(
        "The mean is `sum / count`. The whole subtlety is **floating-point division**: "
        "you must divide in a real-number type or the fraction is lost.\n\n"
        "**Why cast before, not after.** In Java, `total / nums.length` with two "
        "integers does integer division first — 10 / 4 = 2 — and only then would a "
        "later cast widen 2 to 2.0. You must cast an operand *before* the division: "
        "`(double) total / nums.length` makes the whole division floating-point, "
        "yielding 2.5.\n\n"
        "**Why sum in `long`.** The numerator can overflow int just like array-sum, so "
        "accumulate in `long`, then cast to `double` for the divide.\n\n"
        "**Empty input.** Dividing by a zero length is undefined; guard it (return 0 or "
        "throw) if the contract allows empty arrays. Here it's guaranteed non-empty."
    ),
    hints=[
        "Mean is sum over count — what type must the division happen in?",
        "Integer division truncates: 10/4 becomes 2, not 2.5.",
        "Cast one operand to double BEFORE dividing; sum in long to avoid overflow.",
    ],
    complexity_reasoning="one pass to sum plus a single division — linear time, constant space.",
    dry_run=dict(
        input="nums = [1, 2, 3, 4]",
        intro="Sum, then divide in floating point.",
        steps=[
            ("sum", "1+2+3+4", "total = 10"),
            ("int / int", "10 / 4 truncates", "2 (WRONG)"),
            ("(double) total / n", "10.0 / 4", "2.5"),
        ],
        result="2.5",
    ),
    edge_cases=[
        ("nums = [5, 5, 5]", "Returns 5.0; whole-number mean still works."),
        ("nums = [2, 3]", "5 / 2 = 2.5 — the case that exposes integer division."),
        ("nums = []", "Division by zero — guard if empties are allowed."),
    ],
    pitfalls=[
        "Integer division truncating the fractional part.",
        "Dividing by zero on an empty array.",
    ],
    interviewer_intent=dict(
        testing="Whether you recognise integer-division truncation and cast at the right moment.",
        common_mistake="Computing `total / n` in ints and losing the fraction.",
        to_stand_out="Sum in long, cast to double before dividing, and mention the empty-array guard.",
    ),
    clarifying=[
        ("Should the result be a float or rounded?", "I'll return a double mean; rounding is a separate, easy step if needed."),
        ("Can the array be empty?", "If so I need an agreed return for division by zero."),
    ],
    common_mistakes_detailed=[
        dict(
            title="Integer division",
            why="`total / nums.length` with two ints truncates before any cast; 10/4 yields 2, not 2.5.",
            lang="java",
            bad="double avg = total / nums.length;        // truncates to 2",
            good="double avg = (double) total / nums.length;",
        ),
    ],
    followups=[
        dict(title="Sum of Array Elements", slug="array-sum", hint="The numerator; same overflow care."),
    ],
    remember_add=dict(
        formula="return (double) sum / n;",
        when_to_use=["Averages/ratios from integer counts", "Anywhere integer division would truncate"],
    ),
)

E(
    "count-even-odd-array",
    deep_explanation=(
        "Classify each element by parity and tally it: this is the **classify-and-"
        "count** pattern with one counter per category.\n\n"
        "**Why test `% 2 == 0`.** As in even-or-odd, `%` can be negative in Java/C++ "
        "(`-3 % 2 == -1`), so detecting odd via `== 1` misclassifies negative odds. "
        "Test evenness with `== 0` and treat the else branch as odd.\n\n"
        "**Why two counters (or one).** Two counters read clearly. You *can* keep just "
        "an even counter and compute `odd = n − even` at the end, since every element "
        "is exactly one or the other — a nice space micro-optimisation worth "
        "mentioning.\n\n"
        "**Order of the result.** Return `[even, odd]` in the agreed order; swapping "
        "them is a silent correctness bug the tests will catch."
    ),
    hints=[
        "One pass, classify each element, bump a counter.",
        "Use `% 2 == 0` for even so negatives are handled.",
        "You could track only evens and derive odds as n − even.",
    ],
    complexity_reasoning="one parity test and one increment per element.",
    dry_run=dict(
        input="nums = [1, 2, 3, 4, 5]",
        intro="Bump the matching counter per element.",
        steps=[
            ("1", "odd", "even=0, odd=1"),
            ("2", "even", "even=1, odd=1"),
            ("3", "odd", "even=1, odd=2"),
            ("4", "even", "even=2, odd=2"),
            ("5", "odd", "even=2, odd=3"),
        ],
        result="[2, 3]",
    ),
    edge_cases=[
        ("nums = [2, 4, 6]", "All even → [3, 0]."),
        ("nums = []", "Nothing to count → [0, 0]."),
        ("nums = [-3, -2]", "Parity via `% 2 == 0` correctly gives [1, 1]."),
    ],
    pitfalls=[
        "Detecting odd with `% 2 == 1` (wrong for negatives).",
        "Returning the counts in the wrong order.",
    ],
    interviewer_intent=dict(
        testing="Whether you apply a robust parity test inside a counting loop.",
        common_mistake="The `% 2 == 1` negative bug, or swapped output order.",
        to_stand_out="Offer the single-counter `odd = n − even` simplification.",
    ),
    clarifying=[
        ("Can values be negative?", "Yes — which is why I test `% 2 == 0` rather than `== 1`."),
    ],
    followups=[
        dict(title="Even or Odd", slug="even-or-odd", hint="The single-value version of this parity test."),
        dict(title="Count Positive and Negative", slug="count-positive-negative", hint="Same tally pattern with three buckets."),
    ],
    remember_add=dict(
        formula="for x: if x%2==0 even++ else odd++",
        when_to_use=["Bucketing elements into a few categories"],
    ),
)

E(
    "linear-search",
    deep_explanation=(
        "With no assumptions about order, the only way to find a value is to look at "
        "elements one at a time and return the index of the first match. Falling off "
        "the end means it's absent, so return -1.\n\n"
        "**Why return on first match.** The problem asks for the *first* occurrence, so "
        "returning immediately gives the smallest index. Continuing would either waste "
        "work or (if you overwrite) return the last index instead.\n\n"
        "**Why -1 for 'not found'.** A sentinel out of the valid index range (0..n−1) "
        "cleanly signals absence; the caller checks `result == -1`. Returning 0 or "
        "throwing would be ambiguous or heavy.\n\n"
        "**When you can do better.** Linear search is the fallback for *unstructured* "
        "data. If the array were sorted, binary search drops this to O(log n); if you "
        "query repeatedly, a hash set/map gives O(1) lookups after O(n) setup. Naming "
        "those alternatives shows you reach for structure when it exists."
    ),
    hints=[
        "No ordering is given — what's the only guaranteed way to find the value?",
        "Return the index on the first match to get the first occurrence.",
        "If the loop ends with no match, return -1.",
    ],
    complexity_reasoning="in the worst case (absent or last) you scan all n elements; best case is the first element.",
    dry_run=dict(
        input="nums = [4, 2, 7, 1], target = 7",
        intro="Scan left to right, return on first match.",
        steps=[
            ("i=0", "4 == 7? no", "continue"),
            ("i=1", "2 == 7? no", "continue"),
            ("i=2", "7 == 7? yes", "return 2"),
        ],
        result="2",
    ),
    edge_cases=[
        ("nums = [4, 2, 7], target = 9", "Absent → loop ends → -1."),
        ("nums = [5], target = 5", "Found at index 0."),
        ("nums = [], target = 1", "Empty → -1 immediately."),
    ],
    pitfalls=[
        "Returning the element value instead of its index.",
        "Forgetting the -1 'not found' return.",
    ],
    interviewer_intent=dict(
        testing="Whether you handle the not-found case and know when structure beats a linear scan.",
        common_mistake="Returning the value, or omitting the -1 case.",
        to_stand_out="Mention binary search (sorted) and hash lookup (repeated queries) as faster alternatives.",
    ),
    clarifying=[
        ("First or any occurrence?", "I return the first; I'd adjust if any index is acceptable."),
        ("Is the array sorted?", "If it is, I'd switch to binary search for O(log n)."),
    ],
    followups=[
        dict(title="Binary Search", slug="binary-search", hint="O(log n) when the array is sorted."),
        dict(title="Count Occurrences", slug="count-occurrences", hint="Don't stop early — tally all matches."),
    ],
    remember_add=dict(
        formula="for i,x in nums: if x==target return i; return -1",
        when_to_use=["Unsorted, one-off lookup"],
        anti_signals=["Sorted data → binary search", "Many lookups → hash set"],
    ),
)

E(
    "reverse-array",
    deep_explanation=(
        "Reverse in place with the **two-pointer swap**: `left` at the start, `right` "
        "at the end, swap them, and step both inward until they meet. O(n) time, O(1) "
        "extra space — no second array.\n\n"
        "**Why pointers converge in the middle.** Each swap places two elements in "
        "their final positions, so after n/2 swaps every element is reversed. The "
        "middle element of an odd-length array is already in place and needs no swap — "
        "which is exactly why the loop condition is `left < right` (strictly), not "
        "`<=`.\n\n"
        "**Why `<=` would be a bug.** With `left <= right`, the middle element would be "
        "swapped with itself (harmless), but more importantly on even lengths the "
        "pointers would cross and you'd swap the same pairs back, un-reversing the "
        "array. `left < right` stops cleanly when they meet or cross.\n\n"
        "This swap-and-converge primitive underlies reverse-string and the three-"
        "reversal array rotation trick."
    ),
    hints=[
        "Pair the first element with the last, second with second-last…",
        "Two pointers from both ends; swap and move inward.",
        "Stop when left meets right — use `<`, not `<=`.",
    ],
    complexity_reasoning="n/2 swaps, each O(1), with only a temp variable — linear time, constant space.",
    dry_run=dict(
        input="nums = [1, 2, 3, 4]",
        intro="Swap ends, converge.",
        steps=[
            ("l=0,r=3", "swap 1 and 4", "[4, 2, 3, 1]"),
            ("l=1,r=2", "swap 2 and 3", "[4, 3, 2, 1]"),
            ("l=2,r=1", "left ≥ right, stop", "done"),
        ],
        result="[4, 3, 2, 1]",
    ),
    edge_cases=[
        ("nums = [1, 2, 3]", "Middle 2 stays; result [3, 2, 1]."),
        ("nums = [9]", "Loop never runs; unchanged."),
        ("nums = []", "Nothing to do."),
    ],
    pitfalls=[
        "Looping the full length and swapping every pair twice (undoing the reversal).",
        "Off-by-one: right starting at length instead of length − 1.",
    ],
    interviewer_intent=dict(
        testing="Whether you reverse in place with two pointers and get the loop bound right.",
        common_mistake="Swapping across the whole array (double swap) or an out-of-bounds right pointer.",
        to_stand_out="Note the same primitive powers reverse-string and the rotation-by-three-reversals trick.",
    ),
    clarifying=[
        ("In place or return a new array?", "In place with two pointers for O(1) space; I can return a copy if required."),
    ],
    common_mistakes_detailed=[
        dict(
            title="Swapping the full length",
            why="Looping i from 0 to n−1 and swapping nums[i] with nums[n−1−i] swaps every pair twice, leaving the array unchanged.",
            lang="java",
            bad="for (int i = 0; i < n; i++) swap(nums, i, n-1-i);   // double swap",
            good="int l = 0, r = n-1; while (l < r) { swap(nums, l++, r--); }",
        ),
    ],
    followups=[
        dict(title="Reverse a String", slug="reverse-string", hint="Same swap on a char array."),
        dict(title="Left Rotate by One", slug="left-rotate-by-one", hint="Rotation can be built from three reversals."),
    ],
    remember_add=dict(
        formula="l=0; r=n-1; while l<r: swap(l,r); l++; r--",
        when_to_use=["In-place reversal", "Symmetric two-pointer passes"],
    ),
)

E(
    "second-largest",
    deep_explanation=(
        "Track the top two values in a single pass: a `first` (largest) and `second` "
        "(runner-up). For each element, either it beats `first` (so the old `first` "
        "demotes to `second` and the element becomes the new `first`), or it slots "
        "between them (updating `second`). O(n), no sort.\n\n"
        "**Why demote, not overwrite.** When a new value exceeds `first`, the previous "
        "`first` is now the second-largest, so you must shift it into `second` before "
        "overwriting `first`. Forgetting this loses the runner-up.\n\n"
        "**Handling duplicates of the max.** 'Second largest' usually means the second "
        "*distinct* value, so when an element equals `first` you skip it for `second` "
        "(the `x != first` guard). For [10, 10, 5] that yields 5, not 10.\n\n"
        "**Why seed with −∞.** Initialising both trackers to the smallest possible "
        "value (Long.MIN / −inf) ensures the first real elements populate them "
        "correctly, even for all-negative arrays. Sorting also works (O(n log n)) but "
        "the one-pass tracker is the O(n) answer."
    ),
    hints=[
        "Do you need to sort, or can you remember just the top two?",
        "On beating the best, demote the old best to the runner-up.",
        "Decide whether duplicates of the max count — skip them for 'second distinct'.",
    ],
    complexity_reasoning="one pass, at most two comparisons per element, O(1) state — beats the O(n log n) sort.",
    dry_run=dict(
        input="nums = [3, 7, 2, 9, 4]",
        intro="Maintain first and second.",
        steps=[
            ("3", "3 > −∞", "first=3, second=−∞"),
            ("7", "7 > 3", "first=7, second=3"),
            ("2", "2 < 7, < 3", "unchanged"),
            ("9", "9 > 7", "first=9, second=7"),
            ("4", "4 < 9, < 7", "unchanged"),
        ],
        result="7",
    ),
    edge_cases=[
        ("nums = [10, 10, 5]", "Distinct second largest is 5; the x != first guard skips the duplicate 10."),
        ("nums = [1, 2]", "Second is 1."),
        ("nums = [-3, -1, -2]", "Seeding with −∞ makes the all-negative case work; second is -2."),
    ],
    pitfalls=[
        "Overwriting first without demoting it into second.",
        "Initialising the trackers to 0 instead of −∞.",
        "Returning the max again when duplicates of the max exist.",
    ],
    interviewer_intent=dict(
        testing="Whether you track top-K in one pass and handle duplicates and negatives correctly.",
        common_mistake="Losing the runner-up by not demoting, or 0-seeding the trackers.",
        to_stand_out="Clarify the distinct-vs-duplicate definition before coding.",
    ),
    clarifying=[
        ("Does a duplicated max count as the second largest?", "Usually no — 'second distinct'; I'll guard x != first."),
        ("Are there at least two distinct values?", "Assumed yes; otherwise I'd define a fallback."),
    ],
    followups=[
        dict(title="Maximum in an Array", slug="array-maximum", hint="The single-tracker version."),
        dict(title="Kth Largest Element", slug="kth-largest-element", hint="Generalises to a heap or quickselect.", leetcodeNumber=215),
    ],
    remember_add=dict(
        formula="if x>first: second=first; first=x  elif x>second and x!=first: second=x",
        when_to_use=["Top-K for small K without sorting"],
        anti_signals=["Large K — use a heap or quickselect"],
    ),
)

E(
    "count-occurrences",
    deep_explanation=(
        "Count how many times a value appears by scanning once and bumping a counter on "
        "every match. The key discipline: **don't stop at the first match** — counting "
        "requires visiting every element.\n\n"
        "**Why no early exit.** Search returns on the first hit; counting must keep "
        "going to tally all of them. Breaking early is the classic copy-from-search "
        "bug.\n\n"
        "**Why linear is optimal here.** For a single one-off query on unsorted data, "
        "you must examine each element, so O(n) is the floor. If you had to answer many "
        "count queries, you'd preprocess a frequency map once (O(n)) and then answer "
        "each query in O(1).\n\n"
        "**On sorted data.** If the array were sorted, the matches form a contiguous "
        "block, so two binary searches (first and last position) count them in "
        "O(log n) — worth mentioning."
    ),
    hints=[
        "How is this different from search? (Hint: don't return early.)",
        "Increment a counter on every equality, scanning the whole array.",
        "Many queries? Build a frequency map once for O(1) lookups.",
    ],
    complexity_reasoning="every element is compared once; no early termination because all matches must be counted.",
    dry_run=dict(
        input="nums = [1, 2, 2, 3, 2], target = 2",
        intro="Tally every match, don't stop early.",
        steps=[
            ("1", "≠ 2", "count=0"),
            ("2", "= 2", "count=1"),
            ("2", "= 2", "count=2"),
            ("3", "≠ 2", "count=2"),
            ("2", "= 2", "count=3"),
        ],
        result="3",
    ),
    edge_cases=[
        ("nums = [1, 2, 3], target = 5", "Absent → 0."),
        ("nums = [4, 4], target = 4", "All match → 2."),
        ("nums = [], target = 1", "Empty → 0."),
    ],
    pitfalls=[
        "Returning a boolean (found/not) instead of a count.",
        "Stopping at the first match (search behaviour).",
    ],
    interviewer_intent=dict(
        testing="Whether you distinguish counting from searching (no early exit).",
        common_mistake="Breaking on the first match and returning 1.",
        to_stand_out="Mention the frequency-map preprocessing for repeated queries and binary-search bounds for sorted data.",
    ),
    clarifying=[
        ("Will there be many queries?", "If so, I'd precompute a frequency map once instead of scanning per query."),
    ],
    followups=[
        dict(title="Frequency of Elements", slug="frequency-of-elements", hint="Count all values at once with a map."),
        dict(title="Linear Search", slug="linear-search", hint="The early-exit sibling."),
    ],
    remember_add=dict(
        formula="c=0; for x: if x==target c++; return c",
        when_to_use=["Tallying matches"],
        anti_signals=["Sorted data — binary-search the first/last index instead"],
    ),
)

E(
    "is-array-sorted",
    deep_explanation=(
        "An array is sorted in non-decreasing order exactly when **no adjacent pair "
        "decreases**. Scan neighbours; return false on the first inversion, true if you "
        "reach the end.\n\n"
        "**Why checking neighbours is enough.** Order is transitive: if a[0] ≤ a[1] ≤ "
        "a[2] ≤ … then a[0] ≤ a[2] follows for free. So local order across every "
        "adjacent pair guarantees global order — you never need to compare non-adjacent "
        "elements.\n\n"
        "**Why `>` and not `>=`.** Non-decreasing allows equal neighbours (e.g. "
        "[1, 2, 2, 3]). Rejecting on `a[i-1] >= a[i]` would wrongly flag arrays with "
        "duplicates. Use strict `>` so equals pass.\n\n"
        "**Empty and single-element arrays.** They have no adjacent pairs, so the loop "
        "never finds an inversion and returns true — which matches the convention that "
        "they're trivially sorted. Start the loop at index 1 to avoid reading "
        "a[-1]/out of bounds."
    ),
    hints=[
        "Do you need to compare every pair, or just neighbours?",
        "Return false on the first place where a[i-1] > a[i].",
        "Use `>` (not `>=`) so equal neighbours stay valid for non-decreasing.",
    ],
    complexity_reasoning="one comparison per adjacent pair (n−1 of them); can early-exit on the first inversion.",
    dry_run=dict(
        input="nums = [1, 3, 2]",
        intro="Compare each element to its predecessor.",
        steps=[
            ("i=1", "1 ≤ 3? yes", "ok"),
            ("i=2", "3 ≤ 2? no", "inversion → false"),
        ],
        result="false",
    ),
    edge_cases=[
        ("nums = [1, 2, 2, 3]", "Equal neighbours allowed → true (uses `>`, not `>=`)."),
        ("nums = [5]", "No pairs → true."),
        ("nums = []", "Vacuously sorted → true."),
    ],
    pitfalls=[
        "Using `>=` and rejecting valid arrays with duplicates.",
        "Starting at i = 0 and reading nums[-1] / index −1.",
    ],
    interviewer_intent=dict(
        testing="Whether you exploit transitivity (adjacent checks) and pick the right strictness for duplicates.",
        common_mistake="The `>=` bug that fails on equal neighbours, or an out-of-bounds read.",
        to_stand_out="State why adjacent checks suffice (transitivity) and handle the 0/1-element conventions.",
    ),
    clarifying=[
        ("Non-decreasing or strictly increasing?", "Non-decreasing here, so equal neighbours are allowed — I use `>`."),
    ],
    common_mistakes_detailed=[
        dict(
            title="Using >= for non-decreasing",
            why="It rejects valid arrays with equal adjacent values like [1, 2, 2, 3].",
            lang="java",
            bad="if (nums[i-1] >= nums[i]) return false;   // fails on duplicates",
            good="if (nums[i-1] >  nums[i]) return false;",
        ),
    ],
    followups=[
        dict(title="Check If Array Is Sorted and Rotated", slug="check-sorted-rotated", hint="At most one 'wrap' inversion is allowed.", leetcodeNumber=1752),
    ],
    remember_add=dict(
        formula="for i in 1..n-1: if a[i-1] > a[i] return false; return true",
        when_to_use=["Verifying monotonicity", "Pre-checks before binary search"],
    ),
)

E(
    "sum-even-numbers-array",
    deep_explanation=(
        "This is the accumulate fold with a **filter**: add an element to the running "
        "total only when it passes a test (here, `x % 2 == 0`). Seeding at 0 makes "
        "empty and all-odd inputs return 0 for free.\n\n"
        "**Why the filter goes inside the loop.** You walk every element once, and the "
        "`if` decides whether it contributes. This 'fold + guard' shape generalises to "
        "'sum of elements greater than k', 'sum of positives', etc. — only the "
        "predicate changes.\n\n"
        "**Parity correctness.** Test `% 2 == 0`, not `% 2 == 1` for the complement, so "
        "negative evens (-2, -4) are summed correctly and negative odds are excluded.\n\n"
        "**Overflow.** As with any array sum, accumulate into a `long` since the "
        "filtered total can still be large."
    ),
    hints=[
        "Start from array-sum — what one line do you add to skip odds?",
        "Guard the accumulation with `x % 2 == 0`.",
        "Seed at 0 so all-odd/empty inputs return 0.",
    ],
    complexity_reasoning="one parity test and a conditional add per element.",
    dry_run=dict(
        input="nums = [1, 2, 3, 4]",
        intro="Add only when even.",
        steps=[
            ("1", "odd, skip", "total=0"),
            ("2", "even, +2", "total=2"),
            ("3", "odd, skip", "total=2"),
            ("4", "even, +4", "total=6"),
        ],
        result="6",
    ),
    edge_cases=[
        ("nums = [1, 3, 5]", "No evens → 0."),
        ("nums = [2, 4, 6]", "All even → 12."),
        ("nums = [-2, -4]", "Negative evens summed → -6."),
    ],
    pitfalls=[
        "Testing oddness with `% 2 == 1` and mishandling negatives.",
        "Forgetting the filter and summing everything.",
    ],
    interviewer_intent=dict(
        testing="Whether you compose a fold with a predicate and keep parity robust.",
        common_mistake="The negative-modulo parity bug, or dropping the filter.",
        to_stand_out="Frame it as the general 'sum where predicate holds' template.",
    ),
    clarifying=[
        ("Is zero even?", "Yes — 0 % 2 == 0, so zeros are included."),
    ],
    followups=[
        dict(title="Sum of Array Elements", slug="array-sum", hint="The unfiltered fold."),
        dict(title="Count Even and Odd", slug="count-even-odd-array", hint="Tally instead of sum."),
    ],
    remember_add=dict(
        formula="total=0; for x: if x%2==0: total+=x",
        when_to_use=["Sum/aggregate of elements matching a predicate"],
    ),
)

E(
    "find-duplicate",
    deep_explanation=(
        "Use a hash **set** as a memory of what you've already seen. Walk the array; the "
        "first element that is already in the set is a duplicate. O(n) time, O(n) "
        "space.\n\n"
        "**Why a set.** A set answers 'have I seen this value before?' in O(1) average "
        "time. That converts the O(n²) brute force (compare every pair) into a single "
        "linear pass — you trade O(n) memory for the speedup.\n\n"
        "**Check-then-add ordering.** You must test membership *before* inserting; "
        "insert first and the value is always 'present', so you'd never detect the "
        "repeat. In Java the idiom `if (!seen.add(x)) return x;` is neat because "
        "`add` returns false when the element already existed.\n\n"
        "**Constrained variants.** If values are guaranteed in 1..n, you can find a "
        "duplicate in O(1) space using index-sign marking or Floyd's cycle detection — "
        "good things to mention, since the set solution uses extra memory."
    ),
    hints=[
        "What data structure answers 'seen this before?' in O(1)?",
        "Add elements to a set; the first failed insert is your duplicate.",
        "Check membership before inserting, not after.",
    ],
    complexity_reasoning="each element does an O(1) set lookup/insert, so O(n) time; the set can hold up to n values, so O(n) space.",
    dry_run=dict(
        input="nums = [1, 3, 2, 3, 4]",
        intro="Track seen values; first repeat wins.",
        steps=[
            ("1", "not in set", "{1}"),
            ("3", "not in set", "{1,3}"),
            ("2", "not in set", "{1,2,3}"),
            ("3", "already in set", "return 3"),
        ],
        result="3",
    ),
    edge_cases=[
        ("nums = [5, 5]", "Immediate repeat → 5."),
        ("nums = [1, 2, 2, 1]", "Returns the first repeat encountered (2)."),
    ],
    pitfalls=[
        "Nested loops (O(n²)) when a set gives O(n).",
        "Inserting before checking, so the repeat is never detected.",
    ],
    interviewer_intent=dict(
        testing="Whether you reach for a hash set to trade space for time, with correct ordering.",
        common_mistake="O(n²) pair comparison, or add-before-check.",
        to_stand_out="Offer the O(1)-space variants when values are bounded to 1..n (sign marking / Floyd).",
    ),
    clarifying=[
        ("Are values bounded (e.g. 1..n)?", "If so I can do it in O(1) space; otherwise a set is the clean O(n) answer."),
        ("Return any duplicate or the first?", "I return the first repeat encountered."),
    ],
    common_mistakes_detailed=[
        dict(
            title="Add before checking",
            why="If you insert the value first, the membership test always succeeds and no duplicate is ever reported.",
            lang="python",
            bad="for x in nums:\n    seen.add(x)\n    if x in seen: return x   # always true",
            good="for x in nums:\n    if x in seen: return x\n    seen.add(x)",
        ),
    ],
    followups=[
        dict(title="Contains Duplicate", slug="contains-duplicate", hint="Return just true/false using the same set.", leetcodeNumber=217),
        dict(title="Find the Duplicate Number (O(1) space)", slug="find-the-duplicate-number", hint="Floyd's cycle detection when values are in 1..n.", leetcodeNumber=287),
    ],
    remember_add=dict(
        formula="seen=set(); for x: if x in seen: return x; seen.add(x)",
        when_to_use=["Detecting repeats", "'Have I seen this?' membership"],
        anti_signals=["Values bounded to 1..n and O(1) space required — use sign marking"],
    ),
)

E(
    "move-zeros-end",
    deep_explanation=(
        "Compact the non-zeros to the front with a **write pointer**, then fill the rest "
        "with zeros. This is a stable in-place partition: O(n) time, O(1) space, and "
        "the non-zeros keep their original order.\n\n"
        "**How the write pointer works.** `insert` marks where the next kept element "
        "goes. Scanning left to right, every time you see a non-zero you copy it to "
        "`nums[insert]` and advance `insert`. Because you read and write left to right "
        "and the write index never outpaces the read index, you never clobber an "
        "unread value — and the relative order of non-zeros is preserved.\n\n"
        "**Why the second loop.** After compaction, indices `insert..n−1` hold stale "
        "values; overwrite them with 0. The count of zeros equals n − insert, "
        "automatically.\n\n"
        "**The swap variant.** You can also swap a non-zero at the read pointer with the "
        "slot at the write pointer, avoiding the second pass — but the copy-then-fill "
        "version is the clearest to reason about. This compaction pattern reappears in "
        "'remove element' and 'remove duplicates from sorted array'."
    ),
    hints=[
        "Keep a write index for where the next non-zero should land.",
        "Copy non-zeros forward in order; what's left over must be zeros.",
        "Fill from the write index to the end with 0.",
    ],
    complexity_reasoning="two linear passes (compact, then fill) with only an index variable — O(n) time, O(1) space.",
    dry_run=dict(
        input="nums = [0, 1, 0, 3, 12]",
        intro="Compact non-zeros, then zero-fill.",
        steps=[
            ("0", "skip", "insert=0"),
            ("1", "write at 0", "[1,1,0,3,12] insert=1"),
            ("3", "write at 1", "[1,3,0,3,12] insert=2"),
            ("12", "write at 2", "[1,3,12,3,12] insert=3"),
            ("fill", "zeros from idx 3", "[1,3,12,0,0]"),
        ],
        result="[1, 3, 12, 0, 0]",
    ),
    edge_cases=[
        ("nums = [0, 0, 1]", "One non-zero compacts → [1, 0, 0]."),
        ("nums = [1, 2, 3]", "No zeros → unchanged."),
        ("nums = [0, 0, 0]", "All zeros → unchanged after fill."),
    ],
    pitfalls=[
        "Swapping in a way that reorders the non-zeros.",
        "Forgetting to zero-fill the remaining slots.",
    ],
    interviewer_intent=dict(
        testing="Whether you can do a stable in-place partition with a write pointer.",
        common_mistake="Reordering non-zeros, or leaving stale values in the tail.",
        to_stand_out="Mention the single-pass swap variant and the shared pattern with remove-element.",
    ),
    clarifying=[
        ("Must order of non-zeros be preserved?", "Yes — this is a stable partition; I preserve it."),
        ("In place?", "Yes, O(1) extra space with a write pointer."),
    ],
    followups=[
        dict(title="Remove Element", slug="remove-element", hint="Same write-pointer compaction for a target value.", leetcodeNumber=27),
        dict(title="Remove Duplicates from Sorted Array", slug="remove-duplicates-sorted", hint="Write-pointer keeps the first of each run.", leetcodeNumber=26),
    ],
    remember_add=dict(
        formula="insert=0; for x: if x!=0: a[insert++]=x; fill a[insert..] = 0",
        when_to_use=["In-place remove/move with order preserved"],
    ),
)

E(
    "left-rotate-by-one",
    deep_explanation=(
        "Rotating left by one slides every element down one index and wraps the head to "
        "the tail. Save the first element, shift, then drop it at the end.\n\n"
        "**Why save the head first.** The shift `nums[i] = nums[i+1]` overwrites "
        "`nums[0]` on the very first step, so you must capture the original head "
        "*before* the loop, then place it in the last slot afterward. Skipping the save "
        "loses it.\n\n"
        "**Why the loop stops at n−2.** The last write is `nums[n-2] = nums[n-1]`; "
        "going to `nums[n-1] = nums[n]` reads off the end. After the loop, `nums[n-1]` "
        "is set to the saved head.\n\n"
        "**Rotating by k.** A left rotation by k is best done with the **three-reversal "
        "trick**: reverse the first k, reverse the rest, reverse the whole — O(n) time, "
        "O(1) space, no big temp array. Mentioning that generalisation is the standout "
        "move."
    ),
    hints=[
        "Which element gets overwritten first, and how do you preserve it?",
        "Save nums[0], shift everything left by one, then place it at the end.",
        "Watch the upper bound so you don't read nums[n].",
    ],
    complexity_reasoning="one shift per element with a single saved value — linear time, constant space.",
    dry_run=dict(
        input="nums = [1, 2, 3, 4]",
        intro="Save head, slide left, restore at end.",
        steps=[
            ("save", "first = 1", "first=1"),
            ("shift", "2,3,4 move left", "[2,3,4,4]"),
            ("restore", "last = first", "[2,3,4,1]"),
        ],
        result="[2, 3, 4, 1]",
    ),
    edge_cases=[
        ("nums = [5]", "Single element — return unchanged."),
        ("nums = [7, 8]", "Becomes [8, 7]."),
    ],
    pitfalls=[
        "Overwriting nums[0] before saving it.",
        "Looping to the last index and reading nums[n] out of bounds.",
    ],
    interviewer_intent=dict(
        testing="Whether you preserve the clobbered value and avoid an out-of-bounds read.",
        common_mistake="Losing the head, or off-by-one at the upper bound.",
        to_stand_out="Generalise to rotate-by-k via three reversals in O(1) space.",
    ),
    clarifying=[
        ("Rotate by one, or a general k?", "By one here; for k I'd use the three-reversal method."),
        ("Left or right rotation?", "Left — first element moves to the end."),
    ],
    followups=[
        dict(title="Rotate Array by k", slug="rotate-array", hint="Three reversals: reverse[0..k), reverse[k..n), reverse all.", leetcodeNumber=189),
        dict(title="Reverse an Array", slug="reverse-array", hint="The primitive behind the rotation trick."),
    ],
    remember_add=dict(
        formula="t=a[0]; shift left; a[n-1]=t   (k: three reversals)",
        when_to_use=["Cyclic shifts", "Rotations"],
    ),
)

E(
    "count-positive-negative",
    deep_explanation=(
        "Classify each value as positive, negative, or zero and tally three counters — "
        "the three-bucket extension of the sign-of-a-number branch.\n\n"
        "**Why zero is its own bucket.** Zero is neither positive nor negative, so it "
        "needs an explicit `else` branch. Lumping it with positives (`>= 0`) is the "
        "classic miscount.\n\n"
        "**Why mutually-exclusive branches.** Use `if (x > 0) … else if (x < 0) … else "
        "…` so each element lands in exactly one bucket; overlapping conditions would "
        "double-count or miss.\n\n"
        "**Order of the result.** Return the counts in the agreed order ([pos, neg, "
        "zero] here). The pattern — one counter per category, one pass — scales to any "
        "fixed set of disjoint categories."
    ),
    hints=[
        "How many distinct categories are there? One counter each.",
        "Make zero its own branch — it's neither positive nor negative.",
        "Use mutually-exclusive if/else-if so each element is counted once.",
    ],
    complexity_reasoning="one three-way comparison and one increment per element.",
    dry_run=dict(
        input="nums = [1, -2, 0, 3, -1]",
        intro="Three disjoint buckets.",
        steps=[
            ("1", "pos", "[1,0,0]"),
            ("-2", "neg", "[1,1,0]"),
            ("0", "zero", "[1,1,1]"),
            ("3", "pos", "[2,1,1]"),
            ("-1", "neg", "[2,2,1]"),
        ],
        result="[2, 2, 1]",
    ),
    edge_cases=[
        ("nums = [0, 0]", "All zeros → [0, 0, 2]."),
        ("nums = [4]", "One positive → [1, 0, 0]."),
    ],
    pitfalls=[
        "Counting zero as positive (using `>= 0`).",
        "Returning the buckets in the wrong order.",
    ],
    interviewer_intent=dict(
        testing="Whether you enumerate disjoint categories with a clean three-way branch.",
        common_mistake="Mishandling zero or overlapping conditions.",
        to_stand_out="Note this is the sign() branch applied in a counting loop.",
    ),
    clarifying=[
        ("Is zero counted separately?", "Yes — it gets its own bucket."),
    ],
    followups=[
        dict(title="Sign of a Number", slug="sign-of-a-number", hint="The single-value three-way branch."),
        dict(title="Count Even and Odd", slug="count-even-odd-array", hint="Two-bucket tally."),
    ],
    remember_add=dict(
        formula="if x>0 pos++ elif x<0 neg++ else zero++",
        when_to_use=["Tallying a few disjoint categories"],
    ),
)

E(
    "missing-number",
    deep_explanation=(
        "The array holds the distinct numbers 0..n with exactly one absent. The "
        "complete range sums to a known value `n(n+1)/2`; subtract the actual array sum "
        "and the difference is precisely the missing number. O(n) time, O(1) space.\n\n"
        "**Why the difference works.** Every present number cancels between the expected "
        "total and the actual total; only the absent one is left uncancelled, so "
        "`expected − actual = missing`. It's a counting argument, not a search.\n\n"
        "**Watch the range.** The values run 0..n (that's n+1 slots) but the array has "
        "length n, so the expected sum uses `n = nums.length`. Off-by-one on the range "
        "(using 1..n) is the common bug.\n\n"
        "**The XOR variant.** XOR all indices 0..n with all elements; equal values "
        "cancel (a ^ a = 0), leaving the missing number. XOR avoids the overflow that "
        "the sum could hit, so it's the preferred 'no-overflow' answer to mention."
    ),
    hints=[
        "You know what the full set 0..n should sum to — how does that help?",
        "Missing = expected sum − actual sum.",
        "XOR of all indices and values cancels everything except the missing one (overflow-proof).",
    ],
    complexity_reasoning="one pass to sum (or XOR) the elements, with O(1) extra state.",
    dry_run=dict(
        input="nums = [3, 0, 1]  (range 0..3)",
        intro="Compare the expected and actual sums.",
        steps=[
            ("expected", "0+1+2+3 = 3*4/2", "6"),
            ("actual", "3+0+1", "4"),
            ("missing", "6 − 4", "2"),
        ],
        result="2",
    ),
    edge_cases=[
        ("nums = [0, 1]", "Range 0..2, missing 2."),
        ("nums = [1]", "Range 0..1, missing 0."),
        ("large n", "Expected sum ~10^10 overflows int — use long or XOR."),
    ],
    pitfalls=[
        "Off-by-one: the range is 0..n (n+1 numbers), not 1..n.",
        "Overflow when computing the expected sum in int.",
    ],
    interviewer_intent=dict(
        testing="Whether you use a counting/algebraic identity instead of searching, and guard overflow.",
        common_mistake="Wrong range bound, or int overflow on the expected sum.",
        to_stand_out="Offer the XOR solution as the overflow-proof O(1)-space alternative.",
    ),
    clarifying=[
        ("Is the range 0..n or 1..n?", "0..n here — that sets the expected-sum formula."),
        ("Exactly one missing?", "Yes; multiple missing would need a different approach."),
    ],
    common_mistakes_detailed=[
        dict(
            title="Int overflow on expected sum",
            why="For large n, n(n+1)/2 exceeds int range; compute it in long (or use XOR, which never overflows).",
            lang="java",
            bad="int expected = n * (n + 1) / 2;       // overflows for big n",
            good="long expected = (long) n * (n + 1) / 2;",
        ),
    ],
    followups=[
        dict(title="Find All Numbers Disappeared", slug="find-disappeared-numbers", hint="Multiple missing values via index marking.", leetcodeNumber=448),
        dict(title="Single Number", slug="single-number", hint="XOR cancels pairs — same idea."),
    ],
    remember_add=dict(
        formula="missing = n(n+1)/2 - sum(nums)   (or XOR of 0..n and nums)",
        when_to_use=["One element missing/extra in a known range", "Pairing/cancellation tricks"],
    ),
)

E(
    "merge-two-sorted-arrays",
    deep_explanation=(
        "Because both inputs are already sorted, you can merge them in linear time with "
        "**two pointers**: repeatedly take the smaller of the two current fronts and "
        "advance that pointer. This is the merge step of merge sort.\n\n"
        "**Why it's linear, not n log n.** Re-concatenating and sorting throws away the "
        "sortedness you already have and costs O((n+m)log(n+m)). The two-pointer merge "
        "exploits the existing order — each element is emitted exactly once, so it's "
        "O(n+m).\n\n"
        "**Why advance only the consumed pointer.** You output one element per step "
        "(the smaller front) and move only that array's pointer; the other front is "
        "still the smallest unprocessed value on its side, ready for the next "
        "comparison.\n\n"
        "**Stability and leftovers.** Use `a[i] <= b[j]` (not `<`) so equal elements "
        "keep a's-before-b's order and none are dropped. When one array empties, append "
        "the entire remainder of the other — that tail is already sorted."
    ),
    hints=[
        "Both arrays are sorted — what's the cheapest way to combine them?",
        "Compare the two front elements; take the smaller and advance that pointer.",
        "When one runs out, append the rest of the other.",
    ],
    complexity_reasoning="each of the n+m elements is emitted once with O(1) work; the output array is O(n+m) space.",
    dry_run=dict(
        input="a = [1, 3, 5], b = [2, 4]",
        intro="Always emit the smaller front.",
        steps=[
            ("1 vs 2", "1 smaller", "out=[1], i=1"),
            ("3 vs 2", "2 smaller", "out=[1,2], j=1"),
            ("3 vs 4", "3 smaller", "out=[1,2,3], i=2"),
            ("5 vs 4", "4 smaller", "out=[1,2,3,4], j=2"),
            ("drain", "b empty, copy 5", "out=[1,2,3,4,5]"),
        ],
        result="[1, 2, 3, 4, 5]",
    ),
    edge_cases=[
        ("a = [], b = [1, 2]", "One side empty — just copy the other."),
        ("a = [1, 1], b = [1]", "Duplicates kept → [1, 1, 1]."),
        ("a = [1,2,3], b = [4,5]", "No interleave needed; a then b."),
    ],
    pitfalls=[
        "Forgetting to copy the leftovers after one pointer is exhausted.",
        "Using `<` instead of `<=` and dropping or reordering equal elements.",
    ],
    interviewer_intent=dict(
        testing="Whether you exploit existing sortedness with a two-pointer merge instead of re-sorting.",
        common_mistake="Re-sorting the concatenation, or dropping the remainder.",
        to_stand_out="Identify it as merge sort's merge step and discuss in-place merging (LC88).",
    ),
    clarifying=[
        ("Are both inputs guaranteed sorted?", "Yes — that's what makes the linear merge valid."),
        ("Must duplicates be preserved?", "Yes; I use `<=` for stability."),
    ],
    followups=[
        dict(title="Merge Sorted Array (in place)", slug="merge-sorted-array", hint="Merge from the back to do it in O(1) extra space.", leetcodeNumber=88),
        dict(title="Merge Sort", slug="merge-sort", hint="This merge is the combine step of the full sort."),
    ],
    remember_add=dict(
        formula="while i<n and j<m: out += smaller(a[i],b[j]); advance; then drain",
        when_to_use=["Combining sorted sequences", "Merge step of merge sort / k-way merge"],
        anti_signals=["Inputs unsorted — sort first or use a different method"],
    ),
)

E(
    "separate-odd-even",
    deep_explanation=(
        "Route each element into an `even` or `odd` output list based on its parity. "
        "Appending in scan order makes the partition **stable** — each group keeps its "
        "original relative order — for free.\n\n"
        "**Why appending preserves order.** You read left to right and append to the "
        "back of the matching list, so within each bucket the elements appear in the "
        "same sequence they had in the input. No sorting or extra bookkeeping is "
        "needed.\n\n"
        "**Two output lists vs in place.** Producing two separate lists is O(n) extra "
        "space but simplest. An in-place stable partition is harder; an *unstable* "
        "in-place partition (two-pointer swap) is O(1) space but reorders within groups "
        "— mention the trade-off.\n\n"
        "**Parity robustness.** Test `% 2 == 0` so negative evens are bucketed "
        "correctly."
    ),
    hints=[
        "Two output buckets — what decides which one an element goes to?",
        "Appending as you scan preserves each group's order automatically.",
        "Use `% 2 == 0` for the even bucket.",
    ],
    complexity_reasoning="one parity test and one append per element; two lists hold n elements total, so O(n) space.",
    dry_run=dict(
        input="nums = [1, 2, 3, 4]",
        intro="Append to the matching bucket in scan order.",
        steps=[
            ("1", "odd", "even=[], odd=[1]"),
            ("2", "even", "even=[2], odd=[1]"),
            ("3", "odd", "even=[2], odd=[1,3]"),
            ("4", "even", "even=[2,4], odd=[1,3]"),
        ],
        result="[[2, 4], [1, 3]]",
    ),
    edge_cases=[
        ("nums = [2, 4]", "All even → [[2, 4], []]."),
        ("nums = [1]", "All odd → [[], [1]]."),
        ("nums = []", "→ [[], []]."),
    ],
    pitfalls=[
        "Inserting at the front and reversing a group's order.",
        "Parity bug on negative numbers.",
    ],
    interviewer_intent=dict(
        testing="Whether you produce a stable partition and understand the space/order trade-offs.",
        common_mistake="Reversing a group, or the negative-parity bug.",
        to_stand_out="Contrast stable two-list output with the unstable in-place two-pointer swap.",
    ),
    clarifying=[
        ("Must relative order be preserved?", "Yes — appending in scan order keeps it stable."),
        ("In place or two lists?", "Two lists for clarity; in-place is possible if unstable order is acceptable."),
    ],
    followups=[
        dict(title="Sort Array By Parity", slug="sort-array-by-parity", hint="Evens before odds in one array (order can be relaxed).", leetcodeNumber=905),
        dict(title="Move Zeros to End", slug="move-zeros-end", hint="A related stable partition by a predicate."),
    ],
    remember_add=dict(
        formula="even=[x for even]; odd=[x for odd]   (stable by append)",
        when_to_use=["Splitting into groups while preserving order"],
    ),
)

E(
    "max-consecutive-ones",
    deep_explanation=(
        "Track two counters in one pass: `current` (the length of the run you're in) "
        "and `best` (the longest run seen). On a 1, grow `current` and refresh `best`; "
        "on a 0, reset `current` to 0.\n\n"
        "**Why reset on 0.** A run of ones is broken the instant a 0 appears, so the "
        "current streak must restart from zero. Failing to reset is the classic bug — "
        "you'd count ones that aren't actually consecutive.\n\n"
        "**Why update `best` inside the loop.** The longest run might end in the middle "
        "of the array (not at the last element), so you must capture `best` every time "
        "`current` grows, not just once at the end.\n\n"
        "This **running-streak** pattern (a current counter that resets on a breaker, "
        "plus a best counter) generalises to longest run of any property and is a "
        "stepping stone to sliding-window problems like 'max ones after flipping k "
        "zeros'."
    ),
    hints=[
        "Keep the length of the current run and the best run so far.",
        "What happens to the current run when you hit a 0?",
        "Update best every time the current run grows, not just at the end.",
    ],
    complexity_reasoning="one increment-or-reset and at most one max-update per element.",
    dry_run=dict(
        input="nums = [1, 1, 0, 1, 1, 1]",
        intro="Grow on 1, reset on 0, track best.",
        steps=[
            ("1", "current=1", "best=1"),
            ("1", "current=2", "best=2"),
            ("0", "reset", "current=0, best=2"),
            ("1,1,1", "current grows to 3", "best=3"),
        ],
        result="3",
    ),
    edge_cases=[
        ("nums = [0, 0]", "No ones → 0."),
        ("nums = [1, 1, 1]", "All ones → 3."),
        ("nums = [1, 0, 1]", "Best run is 1."),
    ],
    pitfalls=[
        "Forgetting to reset the streak on a 0.",
        "Updating best only after the loop, missing a run that ends mid-array.",
    ],
    interviewer_intent=dict(
        testing="Whether you maintain current/best counters and reset correctly.",
        common_mistake="No reset on 0, or updating best too late.",
        to_stand_out="Connect it to the sliding-window 'max ones with k flips' generalisation.",
    ),
    clarifying=[
        ("Only 0s and 1s?", "Yes — binary array; a 0 breaks the run."),
    ],
    followups=[
        dict(title="Max Consecutive Ones III", slug="max-consecutive-ones-iii", hint="Sliding window allowing k zero-flips.", leetcodeNumber=1004),
    ],
    remember_add=dict(
        formula="cur=0,best=0; for x: cur = x==1 ? cur+1 : 0; best=max(best,cur)",
        when_to_use=["Longest run of a property", "Streak tracking"],
    ),
)

E(
    "distinct-elements",
    deep_explanation=(
        "Insert every element into a hash **set** and read its size — the set stores "
        "each value at most once, so its size is the count of distinct values. O(n) "
        "time, O(n) space.\n\n"
        "**Why a set collapses duplicates.** Re-inserting a value already present is a "
        "no-op, so after inserting the whole array the set contains exactly the unique "
        "values. The answer is just `set.size()` — no manual de-duplication.\n\n"
        "**The O(1)-space alternative.** Sort the array, then count positions where an "
        "element differs from its predecessor. That's O(n log n) time but O(1) extra "
        "space — the classic time-vs-space trade you should name.\n\n"
        "**Don't confuse size with length.** Returning `nums.length` counts every "
        "element including repeats; you want the *set's* size."
    ),
    hints=[
        "What structure automatically ignores duplicate insertions?",
        "The set's size is your answer — not the array length.",
        "No extra space allowed? Sort and count adjacent changes instead.",
    ],
    complexity_reasoning="each insert is O(1) average, so O(n) time; the set may hold all n values, so O(n) space.",
    dry_run=dict(
        input="nums = [1, 2, 2, 3, 3, 3]",
        intro="Duplicates collapse on insert.",
        steps=[
            ("1,2", "insert", "{1,2}"),
            ("2", "already present", "{1,2}"),
            ("3,3,3", "insert once", "{1,2,3}"),
            ("size", "len of set", "3"),
        ],
        result="3",
    ),
    edge_cases=[
        ("nums = [5, 5, 5]", "One distinct value → 1."),
        ("nums = []", "Empty → 0."),
    ],
    pitfalls=[
        "Returning the array length instead of the set size.",
        "Forgetting an empty array has 0 distinct values.",
    ],
    interviewer_intent=dict(
        testing="Whether you use a set for uniqueness and know the sort-based O(1)-space alternative.",
        common_mistake="Counting length, not distinct values.",
        to_stand_out="State the time/space trade between the set and the sort-then-scan approaches.",
    ),
    clarifying=[
        ("Is extra memory restricted?", "If so, I'd sort and count adjacent changes for O(1) space."),
    ],
    followups=[
        dict(title="Contains Duplicate", slug="contains-duplicate", hint="Distinct count < length means a duplicate exists.", leetcodeNumber=217),
        dict(title="Frequency of Elements", slug="frequency-of-elements", hint="A map gives counts as well as distinctness."),
    ],
    remember_add=dict(
        formula="return len(set(nums))",
        when_to_use=["Counting unique values", "Membership/uniqueness"],
        anti_signals=["O(1) space mandated — sort then count adjacent diffs"],
    ),
)

E(
    "sum-of-min-and-max",
    deep_explanation=(
        "Track the running minimum and maximum **together** in one pass, then add them. "
        "Two independent `if`s per element — one can lower the min, the other can raise "
        "the max — avoid a second scan.\n\n"
        "**Why one pass suffices.** Min and max are independent reductions over the same "
        "data, so they can share a single traversal. Scanning twice is correct but "
        "wasteful; combining them halves the passes.\n\n"
        "**Why seed both with `nums[0]`.** Same reasoning as array-max/min: seeding with "
        "a real element keeps both extremes valid for all-negative or all-positive "
        "arrays. Seeding with 0 breaks one side or the other.\n\n"
        "**Overflow.** min + max of values up to 10⁹ stays within int, but returning a "
        "`long` is a safe habit when you're unsure of the range."
    ),
    hints=[
        "Do you need two passes, or can min and max share one?",
        "Two separate ifs per element: maybe-lower-min, maybe-raise-max.",
        "Seed both extremes with nums[0], not 0.",
    ],
    complexity_reasoning="two comparisons per element in a single pass, O(1) state.",
    dry_run=dict(
        input="nums = [3, 7, 2, 9]",
        intro="Track both extremes at once.",
        steps=[
            ("seed", "min=max=3", "(3,3)"),
            ("7", "max→7", "(3,7)"),
            ("2", "min→2", "(2,7)"),
            ("9", "max→9", "(2,9)"),
            ("sum", "2 + 9", "11"),
        ],
        result="11",
    ),
    edge_cases=[
        ("nums = [5]", "min = max = 5 → 10."),
        ("nums = [-4, -1]", "min -4, max -1 → -5."),
    ],
    pitfalls=[
        "Seeding min/max with 0 instead of nums[0].",
        "Scanning twice when one pass works.",
    ],
    interviewer_intent=dict(
        testing="Whether you fuse two reductions into one pass and seed correctly.",
        common_mistake="0-seeding, or two separate scans.",
        to_stand_out="Note both extremes are independent reductions that can share a traversal.",
    ),
    clarifying=[
        ("Single-element array?", "min equals max, so the answer is twice that element."),
    ],
    followups=[
        dict(title="Maximum in an Array", slug="array-maximum", hint="One of the two reductions."),
        dict(title="Minimum in an Array", slug="array-minimum", hint="The other reduction."),
    ],
    remember_add=dict(
        formula="lo=hi=nums[0]; for x: lo=min(lo,x); hi=max(hi,x); return lo+hi",
        when_to_use=["Multiple reductions over one array", "Fusing passes"],
    ),
)

E(
    "frequency-of-elements",
    deep_explanation=(
        "Build a **frequency map**: a hash map from each value to its count, filled in a "
        "single pass with `count[x] = count.getOrDefault(x, 0) + 1`. This table is the "
        "single most reused primitive from fresher problems all the way to hard ones.\n\n"
        "**Why getOrDefault / Counter.** The first time you see a value it has no entry; "
        "`getOrDefault(x, 0)` (Java) or `collections.Counter` (Python) supplies the "
        "implicit 0 so you don't NullPointer or KeyError on first sight.\n\n"
        "**Why O(n) time, O(k) space.** One pass over n elements, each an O(1) map "
        "update; the map holds k distinct keys, so space is O(k) ≤ O(n).\n\n"
        "**Why it matters.** Anagram checks, top-K frequent, majority element, group-by, "
        "and first-unique-character all reduce to building this map first. Learn the "
        "increment idiom cold and a whole family of problems opens up."
    ),
    hints=[
        "What structure maps a value to a running count?",
        "Increment count[x], defaulting to 0 for first sightings.",
        "This same map powers anagrams, top-K, and majority element.",
    ],
    complexity_reasoning="one O(1) map update per element (O(n) total); the map stores k ≤ n distinct keys.",
    dry_run=dict(
        input="nums = [1, 2, 2, 3]",
        intro="Bump each value's bucket.",
        steps=[
            ("1", "new → 1", "{1:1}"),
            ("2", "new → 1", "{1:1, 2:1}"),
            ("2", "+1", "{1:1, 2:2}"),
            ("3", "new → 1", "{1:1, 2:2, 3:1}"),
        ],
        result="{1:1, 2:2, 3:1}",
    ),
    edge_cases=[
        ("nums = [5, 5, 5]", "Single key → {5:3}."),
        ("nums = []", "Empty map {}."),
    ],
    pitfalls=[
        "Forgetting the default for a first appearance (NullPointerException in Java).",
        "Scanning a list per value (O(n²)) instead of one map pass.",
    ],
    interviewer_intent=dict(
        testing="Whether you reach for a frequency map and handle the first-sighting default.",
        common_mistake="NPE on missing key, or an O(n²) count-per-value loop.",
        to_stand_out="Name the downstream problems (anagram, top-K, majority) this map unlocks.",
    ),
    clarifying=[
        ("Return a map or sorted counts?", "A value→count map; I can post-process for top-K or sorting."),
    ],
    common_mistakes_detailed=[
        dict(
            title="No default on first sight",
            why="`freq.get(x) + 1` throws when x is absent (null in Java). Use getOrDefault / Counter so first sightings start at 0.",
            lang="java",
            bad="freq.put(x, freq.get(x) + 1);            // NPE when x is new",
            good="freq.put(x, freq.getOrDefault(x, 0) + 1);",
        ),
    ],
    followups=[
        dict(title="Valid Anagram", slug="valid-anagram-basic", hint="Compare two frequency maps (or one with +/−)."),
        dict(title="Top K Frequent Elements", slug="top-k-frequent", hint="Build this map, then bucket/heap by count.", leetcodeNumber=347),
    ],
    remember_add=dict(
        formula="for x: freq[x] = freq.get(x,0) + 1",
        when_to_use=["Counting, anagrams, top-K, majority, group-by"],
    ),
)


# ─────────────────────────────────────────────────────────────────────────────
# Wave 3 — Strings (22)
# ─────────────────────────────────────────────────────────────────────────────

E(
    "reverse-string",
    deep_explanation=(
        "Reversing a string is the array two-pointer swap applied to characters: swap "
        "the first and last, second and second-last, converging in the middle. O(n) "
        "time, O(1) extra space.\n\n"
        "**Why a char array in Java.** Java `String`s are **immutable** — you can't "
        "assign `s[i] = …`. So you convert to a `char[]`, swap in place, and build a "
        "new String. Python strings are also immutable, but slicing `s[::-1]` builds "
        "the reversed copy in one expression.\n\n"
        "**Why two pointers, not a fresh buffer per char.** The in-place swap touches "
        "each character once with no per-character allocation. Building the result by "
        "repeatedly prepending characters would be O(n²) in many languages.\n\n"
        "**Loop bound.** Use `left < right` so the middle character of an odd-length "
        "string is left untouched and the pointers don't cross and undo the work."
    ),
    hints=[
        "Reuse the array-reverse idea — on characters this time.",
        "Java strings are immutable: work on a char array.",
        "Two pointers from both ends, swap, converge; Python can use s[::-1].",
    ],
    complexity_reasoning="n/2 swaps with O(1) extra state (the output buffer aside).",
    dry_run=dict(
        input="s = \"abcd\"",
        intro="Swap ends inward.",
        steps=[
            ("l=0,r=3", "swap a,d", "dbca"),
            ("l=1,r=2", "swap b,c", "dcba"),
            ("l=2,r=1", "stop", "done"),
        ],
        result="\"dcba\"",
    ),
    edge_cases=[
        ("s = \"a\"", "Single char unchanged."),
        ("s = \"\"", "Empty string unchanged."),
        ("s = \"ab\"", "Two chars swap to \"ba\"."),
    ],
    pitfalls=[
        "Trying to mutate a Java String directly (immutable).",
        "Off-by-one on the right index (length vs length − 1).",
    ],
    interviewer_intent=dict(
        testing="Whether you know strings are immutable and reverse in place on a char array.",
        common_mistake="Mutating the String, or O(n²) prepend-building.",
        to_stand_out="Mention Unicode/surrogate pairs as a caveat for true character reversal.",
    ),
    clarifying=[
        ("Reverse by code unit or grapheme?", "Standard problems reverse code units; emoji/combining marks need care."),
    ],
    followups=[
        dict(title="Reverse an Array", slug="reverse-array", hint="Same swap on integers."),
        dict(title="Reverse Words in a Sentence", slug="reverse-words", hint="Reverse word order, not characters."),
    ],
    remember_add=dict(
        formula="char[] c; l,r=0,n-1; while l<r: swap; l++; r--",
        when_to_use=["In-place reversal of a sequence"],
    ),
)

E(
    "palindrome-string",
    deep_explanation=(
        "A palindrome is symmetric about its centre, so the i-th character from the "
        "front must equal the i-th from the back. Compare inward with two pointers and "
        "bail on the first mismatch — O(n) time, O(1) space.\n\n"
        "**Why not build a reversed copy.** Reversing and comparing works but uses O(n) "
        "extra space and always scans the whole string. The two-pointer check is "
        "O(1) space and can exit early on the first mismatched pair.\n\n"
        "**Why the pointers meet, not cross.** With `left < right`, the middle character "
        "of an odd-length string is never compared against itself (it's trivially "
        "equal), and even-length strings compare every pair exactly once.\n\n"
        "**Common real-world variant.** 'Valid palindrome' often ignores case and "
        "non-alphanumeric characters — there you skip non-letters and lower-case before "
        "comparing. This basic version compares all characters as-is."
    ),
    hints=[
        "What relationship must the i-th front and i-th back characters have?",
        "Two pointers inward; mismatch ⇒ not a palindrome.",
        "Avoid building a reversed copy — two pointers are O(1) space.",
    ],
    complexity_reasoning="at most n/2 comparisons, with early exit on the first mismatch, and only two index variables.",
    dry_run=dict(
        input="s = \"madam\"",
        intro="Compare ends inward.",
        steps=[
            ("l=0,r=4", "m == m", "ok"),
            ("l=1,r=3", "a == a", "ok"),
            ("l=2,r=2", "stop (center)", "palindrome"),
        ],
        result="true",
    ),
    edge_cases=[
        ("s = \"a\"", "Single char → true."),
        ("s = \"\"", "Empty → true by convention."),
        ("s = \"ab\"", "a ≠ b → false."),
    ],
    pitfalls=[
        "Building a reversed string (O(n) space) instead of two pointers.",
        "Off-by-one letting the pointers overshoot.",
    ],
    interviewer_intent=dict(
        testing="Whether you use the O(1)-space two-pointer symmetry check.",
        common_mistake="Reverse-and-compare with extra space, or overshooting pointers.",
        to_stand_out="Mention the case/alphanumeric-insensitive variant (LC125).",
    ),
    clarifying=[
        ("Case-sensitive? Ignore punctuation?", "This version compares all chars literally; LC125 normalises first."),
    ],
    followups=[
        dict(title="Valid Palindrome", slug="valid-palindrome", hint="Ignore case and non-alphanumerics while two-pointer scanning.", leetcodeNumber=125),
        dict(title="Palindrome Number", slug="palindrome-number", hint="Same symmetry idea on digits."),
    ],
    remember_add=dict(
        formula="l,r=0,n-1; while l<r: if s[l]!=s[r] return false; l++; r--",
        when_to_use=["Symmetry checks", "Two-pointer string scans"],
    ),
)

E(
    "count-vowels-consonants",
    deep_explanation=(
        "Classify each letter by **set membership** in the fixed vowel set {a,e,i,o,u}: "
        "a vowel if it's in the set, otherwise (if it's a letter) a consonant.\n\n"
        "**Why normalise case first.** Lower-casing each character means one membership "
        "test handles both 'A' and 'a'. Without it you'd need to check ten characters "
        "instead of five.\n\n"
        "**Why guard with isLetter.** Spaces, digits, and punctuation are neither "
        "vowels nor consonants. Counting them as consonants (the default 'else') is the "
        "common bug — gate the consonant branch on 'is this actually a letter?'.\n\n"
        "**Why a set, not a chain of ORs.** Membership in a small fixed alphabet is "
        "clearest as a set lookup; it also generalises if the alphabet grows (e.g. "
        "treating 'y' as a vowel)."
    ),
    hints=[
        "How do you test if a character is one of a,e,i,o,u cleanly?",
        "Lower-case first so 'A' and 'a' share one check.",
        "Only count consonants for characters that are actually letters.",
    ],
    complexity_reasoning="one case-fold and one membership test per character.",
    dry_run=dict(
        input="s = \"Hi!\"",
        intro="Classify each letter; skip non-letters.",
        steps=[
            ("H", "letter, not vowel", "cons=1"),
            ("i", "vowel", "vow=1"),
            ("!", "not a letter", "skip"),
        ],
        result="[1, 1]",
    ),
    edge_cases=[
        ("s = \"xyz\"", "No vowels → [0, 3]."),
        ("s = \"aeiou\"", "All vowels → [5, 0]."),
        ("s = \"a1 b\"", "Digit and space skipped → vowels 1, consonants 1."),
    ],
    pitfalls=[
        "Counting uppercase vowels as consonants (normalise case).",
        "Counting spaces/digits as consonants.",
    ],
    interviewer_intent=dict(
        testing="Whether you use set membership and exclude non-letters.",
        common_mistake="Treating any non-vowel (including spaces/digits) as a consonant.",
        to_stand_out="Note the design lets you add 'y' or other alphabets trivially.",
    ),
    clarifying=[
        ("Is 'y' a vowel?", "Usually no for this problem; easy to include if specified."),
        ("Are there non-letters?", "If so I skip them rather than counting as consonants."),
    ],
    followups=[
        dict(title="Count Upper and Lower", slug="count-upper-lower", hint="Same classify-and-count with ASCII ranges."),
    ],
    remember_add=dict(
        formula="if ch in 'aeiou' vow++ elif isLetter(ch) cons++",
        when_to_use=["Classifying over a small fixed alphabet"],
    ),
)

E(
    "string-length",
    deep_explanation=(
        "Length is just a character count: step through the string and tick a counter "
        "once per character. The exercise is to show you understand what 'length' means "
        "rather than to reach for `.length()`.\n\n"
        "**Why it's a fundamentals check.** In real code you call `s.length()` / "
        "`len(s)` — O(1) in both Java and Python because they store the size. The "
        "manual count demonstrates you grasp the underlying iteration.\n\n"
        "**The Unicode caveat.** 'Number of characters' is subtle: `String.length()` in "
        "Java counts UTF-16 code units, so an emoji (a surrogate pair) counts as 2. "
        "Counting *user-perceived* characters requires iterating code points or "
        "grapheme clusters. Mentioning this distinction is a strong signal."
    ),
    hints=[
        "Tick a counter once per character as you iterate.",
        "Empty string is length 0.",
        "Think about what 'a character' means for multi-byte/emoji text.",
    ],
    complexity_reasoning="one increment per character; the built-in is O(1) since the size is stored.",
    dry_run=dict(
        input="s = \"hi\"",
        intro="Count each character.",
        steps=[
            ("h", "+1", "count=1"),
            ("i", "+1", "count=2"),
        ],
        result="2",
    ),
    edge_cases=[
        ("s = \"\"", "Empty → 0."),
        ("s = \"a b\"", "Spaces count → 3."),
    ],
    pitfalls=[
        "Counting bytes instead of characters for multi-byte text.",
        "Off-by-one when looping by index.",
    ],
    interviewer_intent=dict(
        testing="Whether you understand iteration and the code-unit vs character subtlety.",
        common_mistake="Assuming length equals byte count for Unicode.",
        to_stand_out="Distinguish UTF-16 code units from code points / graphemes.",
    ),
    clarifying=[
        ("Count code units or grapheme clusters?", "For ASCII they match; for emoji I'd iterate code points."),
    ],
    followups=[
        dict(title="Count a Character", slug="count-character-occurrences", hint="Count matches instead of all characters."),
    ],
    remember_add=dict(
        formula="count=0; for ch in s: count++",
        when_to_use=["Manual iteration fundamentals"],
    ),
)

E(
    "to-uppercase",
    deep_explanation=(
        "Convert lowercase to uppercase with an **ASCII shift**: lowercase letters sit "
        "exactly 32 code points above their uppercase forms ('a'=97, 'A'=65), so "
        "subtracting 32 from an a–z letter yields its uppercase version.\n\n"
        "**Why the range guard.** Only characters in 'a'..'z' should shift. Subtracting "
        "32 blindly would corrupt digits, spaces, and symbols. Guard with `'a' <= ch "
        "<= 'z'` and leave everything else untouched.\n\n"
        "**Direction matters.** Subtract 32 to go *up* to uppercase; adding 32 would "
        "lowercase instead — a common sign slip.\n\n"
        "**In practice.** You'd call `toUpperCase()`, which also handles locale and "
        "non-Latin scripts (e.g. Turkish 'i'). The manual shift is the ASCII-"
        "fundamentals demonstration; mention the locale nuance for credit."
    ),
    hints=[
        "What's the fixed ASCII gap between 'a' and 'A'?",
        "Subtract 32 from a–z letters; guard the range.",
        "Leave digits, spaces, and symbols unchanged.",
    ],
    complexity_reasoning="one range check and possible shift per character.",
    dry_run=dict(
        input="s = \"aB1\"",
        intro="Shift only lowercase letters.",
        steps=[
            ("a", "in a-z → −32", "A"),
            ("B", "not lowercase", "B"),
            ("1", "not a letter", "1"),
        ],
        result="\"AB1\"",
    ),
    edge_cases=[
        ("s = \"hello\"", "→ \"HELLO\"."),
        ("s = \"aBc1\"", "Digit unchanged → \"ABC1\"."),
        ("s = \"X\"", "Already upper → \"X\"."),
    ],
    pitfalls=[
        "Shifting non-letters and corrupting digits/symbols.",
        "Adding 32 (lowercases) instead of subtracting.",
    ],
    interviewer_intent=dict(
        testing="Whether you know the 32 ASCII offset and guard the letter range.",
        common_mistake="Wrong direction, or shifting non-letters.",
        to_stand_out="Mention locale-aware toUpperCase for non-ASCII correctness.",
    ),
    clarifying=[
        ("ASCII only or full Unicode?", "Manual shift is ASCII; I'd use the library for locale-correct casing."),
    ],
    followups=[
        dict(title="Convert to Lowercase", slug="to-lowercase", hint="Add 32 instead of subtracting."),
        dict(title="Toggle Case", slug="toggle-case", hint="XOR 32 flips either direction."),
    ],
    remember_add=dict(
        formula="if 'a'<=ch<='z': ch -= 32",
        when_to_use=["ASCII case manipulation"],
    ),
)

E(
    "to-lowercase",
    deep_explanation=(
        "The mirror of to-uppercase: add 32 to an uppercase letter to get its lowercase "
        "form, since 'A'=65 and 'a'=97 differ by exactly 32.\n\n"
        "**Why guard A–Z.** Only uppercase letters should change; the range check "
        "leaves digits, spaces, and symbols alone. Adding 32 to a non-letter would "
        "produce garbage.\n\n"
        "**Direction.** Add 32 to go *down* to lowercase; subtracting would uppercase. "
        "Keeping the two directions straight (−32 up, +32 down) is the whole trick.\n\n"
        "**Library note.** `toLowerCase()` handles locale and non-Latin scripts; the "
        "manual shift is the ASCII demonstration."
    ),
    hints=[
        "Same 32 gap — which direction lowercases?",
        "Add 32 to A–Z letters; guard the range.",
        "Leave non-letters untouched.",
    ],
    complexity_reasoning="one range check and possible shift per character.",
    dry_run=dict(
        input="s = \"Ab1\"",
        intro="Shift only uppercase letters.",
        steps=[
            ("A", "in A-Z → +32", "a"),
            ("b", "already lower", "b"),
            ("1", "not a letter", "1"),
        ],
        result="\"ab1\"",
    ),
    edge_cases=[
        ("s = \"HELLO\"", "→ \"hello\"."),
        ("s = \"AbC1\"", "Digit unchanged → \"abc1\"."),
        ("s = \"z\"", "Already lower → \"z\"."),
    ],
    pitfalls=[
        "Subtracting 32 (uppercases) by mistake.",
        "Touching non-letters.",
    ],
    interviewer_intent=dict(
        testing="Whether you apply the case shift in the correct direction with a guard.",
        common_mistake="Wrong sign, or shifting non-letters.",
        to_stand_out="Mention locale-aware lowercasing for non-ASCII.",
    ),
    clarifying=[
        ("ASCII only?", "Yes for the manual shift; the library covers Unicode/locale."),
    ],
    followups=[
        dict(title="Convert to Uppercase", slug="to-uppercase", hint="Subtract 32 instead."),
    ],
    remember_add=dict(
        formula="if 'A'<=ch<='Z': ch += 32",
        when_to_use=["ASCII case manipulation"],
    ),
)

E(
    "count-words",
    deep_explanation=(
        "Count **word beginnings**, not separators. A character starts a word when it "
        "is non-space and either it's the first character or the preceding character "
        "was a space. Track an `inWord` flag and increment on each transition into a "
        "word.\n\n"
        "**Why not 'spaces + 1'.** That formula breaks on leading/trailing spaces and "
        "on multiple spaces between words ('  a   b  '). Counting transitions handles "
        "all of those messy cases uniformly.\n\n"
        "**Why not a naive split on a single space.** Splitting `\"a  b\"` on `\" \"` "
        "yields empty tokens you'd have to filter. Splitting on runs of whitespace "
        "(`\\s+`) or counting transitions avoids that.\n\n"
        "**The flag mechanics.** Set `inWord = true` and count when you enter a word; "
        "set `inWord = false` on a space. That single boolean is all the state you "
        "need."
    ),
    hints=[
        "Count where words *start*, not the spaces between them.",
        "A word start = non-space whose previous char was a space (or the first char).",
        "Watch leading, trailing, and repeated spaces.",
    ],
    complexity_reasoning="one character visit and a flag update — linear time, constant space.",
    dry_run=dict(
        input="s = \"  hi  yo \"",
        intro="Count transitions into words.",
        steps=[
            ("spaces", "inWord stays false", "count=0"),
            ("h", "enter word", "count=1"),
            ("i, spaces", "exit word", "count=1"),
            ("y", "enter word", "count=2"),
        ],
        result="2",
    ),
    edge_cases=[
        ("s = \"the quick fox\"", "3 words."),
        ("s = \"  hello   world  \"", "Extra spaces ignored → 2."),
        ("s = \"\"", "0 words."),
    ],
    pitfalls=[
        "Counting spaces + 1 (breaks on multiple/leading/trailing spaces).",
        "Counting empty tokens from a naive single-space split.",
    ],
    interviewer_intent=dict(
        testing="Whether you handle messy whitespace via transition counting or a robust split.",
        common_mistake="The spaces+1 approach failing on edge spacing.",
        to_stand_out="Explain why counting word-starts is more robust than counting separators.",
    ),
    clarifying=[
        ("How are words delimited?", "Runs of whitespace; I ignore leading/trailing/multiple spaces."),
    ],
    followups=[
        dict(title="Reverse Words in a Sentence", slug="reverse-words", hint="Tokenise on whitespace, then reverse order."),
        dict(title="Longest Word", slug="longest-word", hint="Tokenise, then running-max by length."),
    ],
    remember_add=dict(
        formula="inWord=false; for ch: if ch!=' ' and !inWord: count++; inWord=(ch!=' ')",
        when_to_use=["Tokenising with messy delimiters"],
    ),
)

E(
    "valid-anagram-basic",
    deep_explanation=(
        "Two strings are anagrams iff they contain the **same letters with the same "
        "counts**. A 26-slot count array compares frequencies in O(n): increment for "
        "each letter of s, decrement for each of t; they match iff every count ends at "
        "0.\n\n"
        "**Why the length check first.** Different lengths can't be anagrams, and the "
        "check lets you walk both strings together with one index. It also short-"
        "circuits the obvious negatives instantly.\n\n"
        "**Why ++ for s and −− for t in one array.** Using a single array, s adds and t "
        "subtracts; equal frequencies cancel to all-zeros. This is neater (and one "
        "array) versus building two maps and comparing them.\n\n"
        "**Why O(1) space.** The count array is fixed at 26 regardless of input size "
        "(for lowercase a–z). For full Unicode you'd use a hash map instead. Sorting "
        "both strings also works but is O(n log n) — the count array is the O(n) "
        "answer."
    ),
    hints=[
        "What must be true of the two strings' letter counts?",
        "Length check first, then a 26-int frequency array.",
        "++ for s, −− for t; all zero at the end means anagram.",
    ],
    complexity_reasoning="one pass over both strings (O(n)) with a fixed 26-int array (O(1) space).",
    dry_run=dict(
        input="s = \"ab\", t = \"ba\"",
        intro="One array: + for s, − for t.",
        steps=[
            ("i=0", "+a, −b", "a:1, b:-1"),
            ("i=1", "+b, −a", "a:0, b:0"),
            ("scan", "all zero", "anagram"),
        ],
        result="true",
    ),
    edge_cases=[
        ("s = \"rat\", t = \"car\"", "Counts don't cancel → false."),
        ("s = \"a\", t = \"ab\"", "Length differs → false."),
        ("s = \"\", t = \"\"", "Both empty → true."),
    ],
    pitfalls=[
        "Skipping the length check and mishandling unequal lengths.",
        "Sorting when an O(n) count is expected.",
    ],
    interviewer_intent=dict(
        testing="Whether you compare frequencies in O(n) rather than sorting.",
        common_mistake="No length guard, or defaulting to an O(n log n) sort.",
        to_stand_out="Note the array works for a–z; for Unicode switch to a hash map.",
    ),
    clarifying=[
        ("Lowercase letters only?", "Yes — that justifies the 26-int array; Unicode needs a map."),
        ("Is case/space significant?", "Assumed letters only; I'd normalise if needed."),
    ],
    common_mistakes_detailed=[
        dict(
            title="No length check",
            why="Without it, 'abc' vs 'ab' may pass a partial comparison; differing lengths can never be anagrams.",
            lang="java",
            bad="// straight to counting, no guard\nint[] c = new int[26]; ...",
            good="if (s.length() != t.length()) return false;\nint[] c = new int[26]; ...",
        ),
    ],
    followups=[
        dict(title="Group Anagrams", slug="group-anagrams", hint="Key each word by its sorted form or count signature.", leetcodeNumber=49),
        dict(title="Character Frequency", slug="char-frequency", hint="The frequency map this compares."),
    ],
    remember_add=dict(
        formula="len equal? count[s]++ count[t]--; all zero?",
        when_to_use=["Permutation/anagram checks", "Comparing multisets of characters"],
    ),
)

E(
    "char-frequency",
    deep_explanation=(
        "Build a hash map from character to count in one pass — the string twin of the "
        "array frequency map, and the seed for anagrams, first-unique-character, and "
        "many string problems.\n\n"
        "**Why getOrDefault / Counter.** On a character's first appearance there's no "
        "entry yet; `getOrDefault(ch, 0)` (Java) or `collections.Counter` (Python) "
        "supplies the implicit 0 so you don't NullPointer / KeyError.\n\n"
        "**Case sensitivity.** Decide up front whether 'A' and 'a' are the same key. "
        "Lower-casing first merges them; keeping them distinct is also valid — just be "
        "explicit so it matches the spec.\n\n"
        "**Array alternative.** For a known small alphabet (a–z), an `int[26]` is faster "
        "and O(1) space versus a hash map — worth mentioning."
    ),
    hints=[
        "Map each character to a running count.",
        "Use a default of 0 for first sightings.",
        "Decide case sensitivity explicitly.",
    ],
    complexity_reasoning="one O(1) map update per character; the map holds k ≤ alphabet-size keys.",
    dry_run=dict(
        input="s = \"aab\"",
        intro="Bump each character's bucket.",
        steps=[
            ("a", "new → 1", "{a:1}"),
            ("a", "+1", "{a:2}"),
            ("b", "new → 1", "{a:2, b:1}"),
        ],
        result="{a:2, b:1}",
    ),
    edge_cases=[
        ("s = \"\"", "Empty map {}."),
        ("s = \"xx\"", "{x:2}."),
        ("s = \"Aa\"", "Two keys if case-sensitive, one if folded."),
    ],
    pitfalls=[
        "No default for a first occurrence (NullPointerException in Java).",
        "Mismatching the case-sensitivity the prompt expects.",
    ],
    interviewer_intent=dict(
        testing="Whether you build a frequency map and handle the first-sighting default.",
        common_mistake="NPE on a new key, or wrong case handling.",
        to_stand_out="Offer the int[26] array for a fixed lowercase alphabet.",
    ),
    clarifying=[
        ("Case-sensitive?", "I'll confirm; lower-casing merges 'A' and 'a'."),
    ],
    followups=[
        dict(title="First Non-Repeating Character", slug="first-non-repeating-character", hint="Count, then re-scan for the first count-1 char."),
        dict(title="Valid Anagram", slug="valid-anagram-basic", hint="Compare two such maps."),
    ],
    remember_add=dict(
        formula="for ch: freq[ch] = freq.get(ch,0)+1",
        when_to_use=["String counting, anagrams, unique-char"],
    ),
)

E(
    "remove-spaces",
    deep_explanation=(
        "Filter out spaces by appending only non-space characters to a builder. The key "
        "performance point: use a `StringBuilder` (Java) or `''.join` (Python), never "
        "repeated `+=` on a String.\n\n"
        "**Why `+=` in a loop is O(n²).** Java/Python strings are immutable, so each "
        "`s += ch` allocates a brand-new string and copies all previous characters. "
        "Over n appends that's 1+2+…+n = O(n²) copying. A StringBuilder appends into a "
        "growable buffer in amortised O(1), keeping the whole build O(n).\n\n"
        "**Remove-all vs trim.** This removes *every* space, not just leading/trailing "
        "(that's `trim`). Be sure which the prompt wants.\n\n"
        "**Generalises to any filter.** Swap the `ch != ' '` predicate for any rule and "
        "you have a generic 'keep characters matching X' transform."
    ),
    hints=[
        "Append only the characters you want to keep.",
        "Use a StringBuilder / join — why not `+=` in a loop?",
        "Remove-all is different from trim (leading/trailing only).",
    ],
    complexity_reasoning="one pass appending into a growable buffer — O(n) time with amortised O(1) appends.",
    dry_run=dict(
        input="s = \"a b c\"",
        intro="Keep non-spaces.",
        steps=[
            ("a", "keep", "a"),
            ("' '", "drop", "a"),
            ("b", "keep", "ab"),
            ("c (after space)", "keep", "abc"),
        ],
        result="\"abc\"",
    ),
    edge_cases=[
        ("s = \"  x  \"", "All spaces gone → \"x\"."),
        ("s = \"abc\"", "No spaces → unchanged."),
        ("s = \"   \"", "All spaces → empty string."),
    ],
    pitfalls=[
        "Using String += in a loop (O(n²)).",
        "Only trimming ends instead of removing all spaces.",
    ],
    interviewer_intent=dict(
        testing="Whether you avoid the O(n²) string-concatenation trap with a builder.",
        common_mistake="`+=` in a loop, or confusing remove-all with trim.",
        to_stand_out="Explain the amortised-O(1) append of StringBuilder.",
    ),
    clarifying=[
        ("Remove all whitespace or just spaces?", "I'll remove the space char; easy to extend to all \\s."),
    ],
    common_mistakes_detailed=[
        dict(
            title="String += in a loop",
            why="Immutable strings copy everything on each +=, making the build O(n²); a StringBuilder is O(n).",
            lang="java",
            bad="String r = \"\"; for (char ch : ...) if (ch!=' ') r += ch;   // O(n^2)",
            good="StringBuilder sb = new StringBuilder(); ... sb.append(ch);",
        ),
    ],
    followups=[
        dict(title="Replace a Character", slug="replace-character", hint="Same build, mapping instead of filtering."),
    ],
    remember_add=dict(
        formula="sb=builder; for ch: if ch!=' ': sb.append(ch)",
        when_to_use=["Filtering/transforming a string"],
        anti_signals=["Reaching for += in a loop — use a builder"],
    ),
)

E(
    "count-character-occurrences",
    deep_explanation=(
        "Count how many times a target character appears: one pass, a counter bumped on "
        "each match, no early exit. It's count-occurrences for arrays applied to "
        "characters.\n\n"
        "**Why no early exit.** You want the *total*, so unlike a search you must visit "
        "every character. Returning on the first match is the classic copy-from-search "
        "bug.\n\n"
        "**Comparing chars, not strings.** Compare with `==` on `char` values (a value "
        "comparison) — fine. The Java `==` reference trap only bites when comparing "
        "`String` objects, not primitive chars.\n\n"
        "**Repeated queries.** For many different target characters, a single frequency "
        "map answers each in O(1) after one O(n) build."
    ),
    hints=[
        "Tally every match — should you stop early?",
        "One counter, bump on equality, visit all characters.",
        "Many targets? Build a frequency map once.",
    ],
    complexity_reasoning="every character is compared once; no early termination since all matches count.",
    dry_run=dict(
        input="s = \"banana\", ch = 'a'",
        intro="Count all matches.",
        steps=[
            ("b,n", "no", "count=0"),
            ("a (x3)", "match each", "count=3"),
        ],
        result="3",
    ),
    edge_cases=[
        ("s = \"hello\", ch = 'z'", "Absent → 0."),
        ("s = \"aaa\", ch = 'a'", "All match → 3."),
        ("s = \"\", ch = 'a'", "Empty → 0."),
    ],
    pitfalls=[
        "Returning after the first match.",
        "Comparing String objects with == when you meant char equality.",
    ],
    interviewer_intent=dict(
        testing="Whether you tally all matches without early exit.",
        common_mistake="Stopping at the first occurrence.",
        to_stand_out="Mention the frequency-map preprocessing for many queries.",
    ),
    clarifying=[
        ("Case-sensitive match?", "I'll confirm; lower-casing both makes it case-insensitive."),
    ],
    followups=[
        dict(title="Character Frequency", slug="char-frequency", hint="Count all characters at once."),
    ],
    remember_add=dict(
        formula="c=0; for ch in s: if ch==target: c++",
        when_to_use=["Single-character tally"],
    ),
)

E(
    "first-non-repeating-character",
    deep_explanation=(
        "Two passes: first count every character's frequency, then re-scan the string "
        "in order and return the first character whose count is exactly 1. O(n) time.\n\n"
        "**Why two passes are necessary.** You cannot know a character is unique until "
        "you've seen the *entire* string, so the count must be complete before you "
        "judge any character. Pass one builds that knowledge; pass two applies it.\n\n"
        "**Why re-scan the string, not the map.** 'First' means first by position in "
        "the original string. A hash map has no positional order, so iterating the map "
        "could return the wrong character. Re-scanning the input preserves order. (A "
        "LinkedHashMap or storing first-index would also work.)\n\n"
        "**Return convention.** When no unique character exists, return the agreed "
        "sentinel (a space here, or -1 if returning an index)."
    ),
    hints=[
        "Can you decide uniqueness before seeing the whole string?",
        "Pass 1: count all characters. Pass 2: find the first with count 1.",
        "Re-scan the string (ordered), not the map, for 'first'.",
    ],
    complexity_reasoning="two linear passes (count, then scan) with a fixed-size count table.",
    dry_run=dict(
        input="s = \"abca\"",
        intro="Count, then scan in order.",
        steps=[
            ("count", "a:2, b:1, c:1", "table"),
            ("a", "count 2, skip", "—"),
            ("b", "count 1", "return 'b'"),
        ],
        result="'b'",
    ),
    edge_cases=[
        ("s = \"leetcode\"", "'l' is first with count 1."),
        ("s = \"aabb\"", "No unique char → ' '."),
        ("s = \"\"", "Empty → ' '."),
    ],
    pitfalls=[
        "Scanning the (unordered) map instead of the string for 'first'.",
        "Returning an index when a character is expected (or vice versa).",
    ],
    interviewer_intent=dict(
        testing="Whether you use a count-then-scan two-pass and preserve order for 'first'.",
        common_mistake="Iterating the map and losing positional order.",
        to_stand_out="Mention LinkedHashMap / storing first-index as one-structure alternatives.",
    ),
    clarifying=[
        ("Return the char or its index?", "I'll return the character; index is a trivial change."),
        ("What if none is unique?", "Return the agreed sentinel (space here)."),
    ],
    followups=[
        dict(title="First Unique Character in a String", slug="first-unique-character", hint="Return the index instead of the char.", leetcodeNumber=387),
        dict(title="Character Frequency", slug="char-frequency", hint="The count table this relies on."),
    ],
    remember_add=dict(
        formula="count all; then for ch in s: if count[ch]==1 return ch",
        when_to_use=["'First/earliest with property' over counts"],
    ),
)

E(
    "toggle-case",
    deep_explanation=(
        "Flip each letter's case: uppercase becomes lowercase and vice versa, leaving "
        "non-letters alone. The elegant trick is **XOR with 32**.\n\n"
        "**Why `ch ^ 32` flips case.** Upper- and lowercase ASCII letters differ in "
        "exactly one bit — bit 5 (value 32). 'A' is 0b1000001 and 'a' is 0b1100001. "
        "XOR-ing with 32 toggles that bit, switching 'A'↔'a' in a single operation, "
        "for any letter.\n\n"
        "**Why guard to letters.** XOR-ing 32 into a digit or symbol would corrupt it, "
        "so only apply the flip to characters in a–z or A–Z. The explicit +32/−32 "
        "branch version makes the intent clear; the XOR is the slick alternative to "
        "mention.\n\n"
        "Toggle is just the union of the upper-shift and lower-shift problems."
    ),
    hints=[
        "Toggle = uppercase-shift for lowercase letters and vice versa.",
        "Which single bit differs between 'A' and 'a'?",
        "`ch ^ 32` flips case for letters in one op — but guard non-letters.",
    ],
    complexity_reasoning="one branch (or XOR) per character.",
    dry_run=dict(
        input="s = \"aB1\"",
        intro="Flip letters, skip others.",
        steps=[
            ("a", "lower → upper", "A"),
            ("B", "upper → lower", "b"),
            ("1", "not a letter", "1"),
        ],
        result="\"Ab1\"",
    ),
    edge_cases=[
        ("s = \"Hello\"", "→ \"hELLO\"."),
        ("s = \"XYZ\"", "→ \"xyz\"."),
        ("s = \"123\"", "Unchanged."),
    ],
    pitfalls=[
        "Flipping non-letters.",
        "Handling only one of the two cases.",
    ],
    interviewer_intent=dict(
        testing="Whether you can flip case and know the XOR-32 bit trick.",
        common_mistake="Forgetting to guard non-letters, or only handling one direction.",
        to_stand_out="Explain why XOR 32 works (cases differ only in bit 5).",
    ),
    clarifying=[
        ("ASCII letters only?", "Yes for the bit trick; Unicode would need library swapcase."),
    ],
    followups=[
        dict(title="Convert to Uppercase", slug="to-uppercase", hint="One direction of the toggle."),
    ],
    remember_add=dict(
        formula="if isLetter(ch): ch ^= 32",
        when_to_use=["Case flipping", "Bit-level case tricks"],
    ),
)

E(
    "strings-equal",
    deep_explanation=(
        "Two strings are equal when they have the **same length and the same characters "
        "in order**. Check length first, then compare character by character, returning "
        "false on the first mismatch.\n\n"
        "**The Java `==` trap.** In Java, `==` on `String` objects compares *references* "
        "(are they the same object?), not contents — so `a == b` can be false for two "
        "equal strings. Always use `.equals()` for content equality. This is one of the "
        "most common fresher bugs.\n\n"
        "**Why length-check first.** Different lengths can't be equal, and the check "
        "lets the loop index both strings safely with one bound.\n\n"
        "**Python.** `a == b` *does* compare contents, so the language difference itself "
        "is worth calling out."
    ),
    hints=[
        "What two conditions make strings equal?",
        "Check length, then compare characters in order.",
        "In Java, why is `a == b` the wrong way to compare strings?",
    ],
    complexity_reasoning="length check is O(1), then up to n character comparisons with early exit.",
    dry_run=dict(
        input="a = \"abc\", b = \"abd\"",
        intro="Length matches; compare chars.",
        steps=[
            ("len", "3 == 3", "ok"),
            ("i=0,1", "a=a, b=b", "ok"),
            ("i=2", "c ≠ d", "false"),
        ],
        result="false",
    ),
    edge_cases=[
        ("a = \"abc\", b = \"abc\"", "Identical → true."),
        ("a = \"ab\", b = \"abc\"", "Length differs → false."),
        ("a = \"\", b = \"\"", "Both empty → true."),
    ],
    pitfalls=[
        "Using `==` on Strings in Java (compares references, not contents).",
        "Skipping the length check.",
    ],
    interviewer_intent=dict(
        testing="Whether you know Java's == vs .equals distinction and compare correctly.",
        common_mistake="Comparing String references with ==.",
        to_stand_out="Contrast Java (== is reference) with Python (== is value).",
    ),
    clarifying=[
        ("Case-sensitive?", "Assumed yes; equalsIgnoreCase for case-insensitive."),
    ],
    common_mistakes_detailed=[
        dict(
            title="Using == on Java Strings",
            why="== compares object identity; two distinct String objects with the same text are not ==. Use .equals for contents.",
            lang="java",
            bad="if (a == b) return true;     // reference comparison",
            good="return a.equals(b);          // content comparison",
        ),
    ],
    followups=[
        dict(title="Valid Anagram", slug="valid-anagram-basic", hint="Equality of letter multisets, not order."),
    ],
    remember_add=dict(
        formula="len equal AND every a[i]==b[i]   (Java: use .equals)",
        when_to_use=["Content comparison of strings"],
        anti_signals=["Java == on strings — a reference-comparison bug"],
    ),
)

E(
    "longest-word",
    deep_explanation=(
        "Tokenise the sentence into words, then apply the **running-maximum** pattern "
        "over word lengths, keeping the first word on a tie.\n\n"
        "**Why strict `>` for the tie rule.** Updating `best` only when a word is "
        "*strictly* longer means a later word of equal length never replaces the earlier "
        "one — so the first of several same-length words wins, as required. Using `>=` "
        "would keep the last instead.\n\n"
        "**Why tokenise robustly.** Split on runs of whitespace so extra spaces don't "
        "produce empty 'words' that could masquerade as length-0 entries.\n\n"
        "This is the same fold as array-maximum, just with the comparison key being "
        "`length(word)` instead of the value itself."
    ),
    hints=[
        "Split into words, then it's a running max over lengths.",
        "Which comparison keeps the FIRST word on a length tie?",
        "Use strict > so later equal-length words don't replace the earlier one.",
    ],
    complexity_reasoning="one pass over the words comparing lengths; tokenising is linear in the input.",
    dry_run=dict(
        input="s = \"the quick brown fox\"",
        intro="Running max by length, first on tie.",
        steps=[
            ("the", "len 3 > 0", "best=the"),
            ("quick", "5 > 3", "best=quick"),
            ("brown", "5 not > 5", "best=quick"),
            ("fox", "3 not > 5", "best=quick"),
        ],
        result="\"quick\"",
    ),
    edge_cases=[
        ("s = \"a bb ccc\"", "Longest is \"ccc\"."),
        ("s = \"hi\"", "Only word → \"hi\"."),
        ("s = \"to be or\"", "All len 2; first \"to\" wins."),
    ],
    pitfalls=[
        "Using `>=` and returning the last tie instead of the first.",
        "Splitting incorrectly and getting empty tokens.",
    ],
    interviewer_intent=dict(
        testing="Whether you map this to a running max and handle the tie rule with strictness.",
        common_mistake="`>=` returning the wrong tie, or empty tokens from a bad split.",
        to_stand_out="Identify it as array-maximum keyed by word length.",
    ),
    clarifying=[
        ("On a tie, first or last?", "First — so I use strict >."),
    ],
    followups=[
        dict(title="Maximum in an Array", slug="array-maximum", hint="The same fold on numbers."),
        dict(title="Count Words", slug="count-words", hint="The tokenising step."),
    ],
    remember_add=dict(
        formula="best=''; for w in words: if len(w)>len(best): best=w",
        when_to_use=["Max-by-key over tokens", "First-on-tie selection"],
    ),
)

E(
    "remove-duplicate-characters",
    deep_explanation=(
        "Keep only the first occurrence of each character: track a **seen set** and "
        "append a character to the output only the first time you encounter it. "
        "Combines the seen-set membership pattern with a filtered build.\n\n"
        "**Why a set preserves order.** You scan left to right and append on first "
        "sighting, so the kept characters appear in their original order — no sorting. "
        "Later repeats fail the membership test and are skipped.\n\n"
        "**The Java idiom `seen.add(ch)`.** `Set.add` returns true only when the element "
        "was newly added, so `if (seen.add(ch)) sb.append(ch);` both records and filters "
        "in one line.\n\n"
        "**Performance.** Use a StringBuilder, not `+=`, to keep the build O(n). The set "
        "gives O(1) membership, so the whole thing is O(n) time, O(k) space."
    ),
    hints=[
        "What structure tells you 'have I already kept this char?'",
        "Append only on first sighting to preserve order.",
        "Use a StringBuilder; `set.add` returns true only when newly added.",
    ],
    complexity_reasoning="O(1) set lookup and append per character; the set holds k ≤ alphabet-size keys.",
    dry_run=dict(
        input="s = \"banana\"",
        intro="Append first sightings only.",
        steps=[
            ("b", "new", "b"),
            ("a", "new", "ba"),
            ("n", "new", "ban"),
            ("a,n,a", "all seen", "ban"),
        ],
        result="\"ban\"",
    ),
    edge_cases=[
        ("s = \"aabbcc\"", "→ \"abc\"."),
        ("s = \"abc\"", "Already unique → \"abc\"."),
        ("s = \"\"", "Empty → \"\"."),
    ],
    pitfalls=[
        "Not preserving original order (e.g. sorting).",
        "Using String += in the loop.",
    ],
    interviewer_intent=dict(
        testing="Whether you combine a seen-set with an order-preserving build.",
        common_mistake="Reordering output, or O(n²) concatenation.",
        to_stand_out="Use the `set.add` boolean idiom to filter and record in one step.",
    ),
    clarifying=[
        ("Keep first or last occurrence?", "First, preserving order; last-occurrence is a small variant."),
    ],
    followups=[
        dict(title="Remove Spaces", slug="remove-spaces", hint="A simpler filtered build."),
        dict(title="Find a Duplicate", slug="find-duplicate", hint="Same seen-set membership idea."),
    ],
    remember_add=dict(
        formula="seen=set(); for ch: if ch not in seen: seen.add(ch); out+=ch",
        when_to_use=["First-occurrence dedup with order"],
    ),
)

E(
    "capitalize-words",
    deep_explanation=(
        "Capitalise the first letter of each word: a letter is a word-start when it is "
        "the first character or the previous character was a space. Upper-case exactly "
        "those letters and copy the rest unchanged.\n\n"
        "**Why a 'word-start' flag.** A single boolean — 'is the next letter the start "
        "of a word?' — set true initially and after each space, tells you which letters "
        "to capitalise. It cleanly handles the first word (no leading space) and runs of "
        "spaces.\n\n"
        "**Why not upper-case everything.** That's a different problem (to-uppercase). "
        "Here only the leading letter of each word changes; the rest of each word is "
        "left as-is.\n\n"
        "**Edge handling.** Reset the flag to true on every space; clear it once you've "
        "processed a non-space. Non-letter word-starts (e.g. a leading digit) simply "
        "aren't shifted."
    ),
    hints=[
        "When does a letter begin a word?",
        "Track a 'start of word' boolean, set after each space.",
        "Capitalise only word-start letters; leave the rest alone.",
    ],
    complexity_reasoning="one character visit and a flag update each step.",
    dry_run=dict(
        input="s = \"hi yo\"",
        intro="Capitalise letters at word starts.",
        steps=[
            ("h", "start → H", "H"),
            ("i", "not start", "Hi"),
            ("' '", "set start", "Hi "),
            ("y", "start → Y", "Hi Y"),
        ],
        result="\"Hi Yo\"",
    ),
    edge_cases=[
        ("s = \"hello world\"", "→ \"Hello World\"."),
        ("s = \"a b c\"", "→ \"A B C\"."),
        ("s = \"hi\"", "First word only → \"Hi\"."),
    ],
    pitfalls=[
        "Capitalising every letter (that's to-uppercase).",
        "Forgetting the very first word when there's no leading space.",
    ],
    interviewer_intent=dict(
        testing="Whether you track word boundaries with a flag and capitalise selectively.",
        common_mistake="Missing the first word, or upper-casing the whole string.",
        to_stand_out="Handle leading spaces and multiple spaces cleanly via the flag.",
    ),
    clarifying=[
        ("Lower-case the rest of each word too?", "This version leaves the rest unchanged; title-case would lower it."),
    ],
    followups=[
        dict(title="Convert to Uppercase", slug="to-uppercase", hint="Capitalises every letter, not just word starts."),
    ],
    remember_add=dict(
        formula="start=true; for ch: if ch==' ': start=true else: if start upper(ch); start=false",
        when_to_use=["Per-word boundary processing"],
    ),
)

E(
    "count-upper-lower",
    deep_explanation=(
        "Classify each character by ASCII range — 'A'..'Z' for uppercase, 'a'..'z' for "
        "lowercase — and tally two counters. Non-letters fall in neither range and are "
        "skipped.\n\n"
        "**Why ranges, not isUpper/isLower only.** The explicit range checks are O(1) "
        "and language-agnostic; `Character.isUpperCase` works too. Either way, the key "
        "is to *exclude* digits, spaces, and punctuation from both counts.\n\n"
        "**Why two counters.** Uppercase and lowercase are disjoint categories; one "
        "counter each, one pass. Return them in the agreed order ([upper, lower]).\n\n"
        "This is the same classify-and-count shape as vowels/consonants and "
        "positive/negative."
    ),
    hints=[
        "Two ASCII ranges separate the cases — which are they?",
        "One counter per case; skip non-letters.",
        "Return the counts in the agreed order.",
    ],
    complexity_reasoning="one or two range checks and an increment per character.",
    dry_run=dict(
        input="s = \"Hi!\"",
        intro="Range-classify each character.",
        steps=[
            ("H", "A-Z", "upper=1"),
            ("i", "a-z", "lower=1"),
            ("!", "neither", "skip"),
        ],
        result="[1, 1]",
    ),
    edge_cases=[
        ("s = \"ABC\"", "→ [3, 0]."),
        ("s = \"abc123\"", "Digits ignored → [0, 3]."),
        ("s = \"\"", "→ [0, 0]."),
    ],
    pitfalls=[
        "Counting digits or spaces as letters.",
        "Returning the counts in the wrong order.",
    ],
    interviewer_intent=dict(
        testing="Whether you classify by range and exclude non-letters.",
        common_mistake="Including non-letters in a count.",
        to_stand_out="Note the shared classify-and-count pattern across these problems.",
    ),
    clarifying=[
        ("Count only ASCII letters?", "Yes; Unicode letters would need isUpperCase/isLowerCase."),
    ],
    followups=[
        dict(title="Count Uppercase Letters", slug="count-uppercase-letters", hint="Just the uppercase half."),
        dict(title="Count Vowels and Consonants", slug="count-vowels-consonants", hint="Same pattern, vowel set."),
    ],
    remember_add=dict(
        formula="if A<=ch<=Z upper++ elif a<=ch<=z lower++",
        when_to_use=["Bucketing characters by case/category"],
    ),
)

E(
    "replace-character",
    deep_explanation=(
        "Transform each character: output the replacement where it matches `oldCh`, "
        "otherwise the original. One pass with a char array (Java) or `str.replace` "
        "(Python) — the original is untouched because strings are immutable.\n\n"
        "**Why a map-and-build.** Each output character is a pure function of the input "
        "character (replace-or-keep), so a single pass produces the result. This "
        "generalises to any per-character mapping.\n\n"
        "**Direction matters.** Replace `oldCh` *with* `newCh`; swapping the arguments "
        "is the common bug. Be clear which is the search target and which is the "
        "replacement.\n\n"
        "**Performance.** Use a char array or builder, not `+=` in a loop, to stay "
        "O(n)."
    ),
    hints=[
        "Each output char is either the replacement or the original.",
        "Be careful which argument is the target and which is the replacement.",
        "Use a char array / builder, not += in a loop.",
    ],
    complexity_reasoning="one comparison and write per character.",
    dry_run=dict(
        input="s = \"banana\", old='a', new='o'",
        intro="Map matches to the replacement.",
        steps=[
            ("b", "keep", "b"),
            ("a", "→ o", "bo"),
            ("n", "keep", "bon"),
            ("...", "a→o each", "bonono"),
        ],
        result="\"bonono\"",
    ),
    edge_cases=[
        ("s = \"abc\", old='x'", "No match → unchanged."),
        ("s = \"aaa\", old='a', new='b'", "→ \"bbb\"."),
        ("s = \"\"", "Empty → \"\"."),
    ],
    pitfalls=[
        "Replacing the wrong direction (new with old).",
        "Using += in a loop instead of a char array/builder.",
    ],
    interviewer_intent=dict(
        testing="Whether you do a clean per-character transform without the concatenation trap.",
        common_mistake="Swapping old/new, or O(n²) building.",
        to_stand_out="Frame it as a general map-over-characters transform.",
    ),
    clarifying=[
        ("Replace all occurrences?", "Yes — every match; first-only would be a variant."),
    ],
    followups=[
        dict(title="Remove Spaces", slug="remove-spaces", hint="A filter instead of a replace."),
    ],
    remember_add=dict(
        formula="for ch: out += (ch==old ? new : ch)",
        when_to_use=["Per-character mapping"],
    ),
)

E(
    "reverse-words",
    deep_explanation=(
        "Reverse the *order of words* (not characters): tokenise on whitespace, reverse "
        "the list of words, and join with single spaces.\n\n"
        "**Why tokenise → reverse → join.** Splitting on runs of whitespace turns the "
        "sentence into clean word tokens (dropping extra spaces); reversing the token "
        "list flips word order; joining with one space normalises the output spacing. "
        "Each step is simple and composes cleanly.\n\n"
        "**Why `trim()` + split on `\\s+`.** Leading/trailing spaces would otherwise "
        "create empty tokens; trimming and splitting on whitespace runs avoids them so "
        "the output has no stray spaces.\n\n"
        "**Don't reverse characters.** Reversing the characters of the whole string "
        "would also reverse each word's spelling — a different (wrong) result. The unit "
        "of reversal here is the word."
    ),
    hints=[
        "Reverse words, not characters — what's the unit you operate on?",
        "Split on whitespace, reverse the list, join with single spaces.",
        "Trim and split on \\s+ so extra spaces don't make empty tokens.",
    ],
    complexity_reasoning="tokenising, reversing, and joining are each linear in the input length.",
    dry_run=dict(
        input="s = \"the quick fox\"",
        intro="Split, reverse, join.",
        steps=[
            ("split", "[the, quick, fox]", "tokens"),
            ("reverse", "[fox, quick, the]", "reversed"),
            ("join", "single spaces", "fox quick the"),
        ],
        result="\"fox quick the\"",
    ),
    edge_cases=[
        ("s = \"hello\"", "One word → \"hello\"."),
        ("s = \"  a   b  \"", "Extra spaces normalised → \"b a\"."),
        ("s = \"a b c\"", "→ \"c b a\"."),
    ],
    pitfalls=[
        "Reversing characters instead of words.",
        "Leaving double spaces from a naive split.",
    ],
    interviewer_intent=dict(
        testing="Whether you operate at word granularity and normalise messy spacing.",
        common_mistake="Character reversal, or empty tokens from a bad split.",
        to_stand_out="Mention the in-place O(1)-space version: reverse whole, then reverse each word.",
    ),
    clarifying=[
        ("Collapse multiple spaces in output?", "Yes — I join with single spaces and trim."),
    ],
    followups=[
        dict(title="Reverse Words in a String", slug="reverse-words-in-string", hint="In-place: reverse all, then each word.", leetcodeNumber=151),
        dict(title="Reverse a String", slug="reverse-string", hint="Character-level reversal."),
    ],
    remember_add=dict(
        formula="' '.join(s.split()[::-1])",
        when_to_use=["Word-order manipulation"],
    ),
)

E(
    "check-substring",
    deep_explanation=(
        "Decide whether `sub` occurs inside `s`. The library way is `s.contains(sub)`; "
        "the algorithmic way is a sliding-window compare: at each start index in s, "
        "check whether the next |sub| characters match.\n\n"
        "**Why O(n·m) naive.** There are up to n−m+1 start positions, and each "
        "comparison can take up to m characters, so the brute force is O(n·m). It's "
        "fine for fresher scope, but name the upgrade.\n\n"
        "**The empty-needle convention.** An empty `sub` is a substring of every string "
        "(it 'occurs' at position 0), so return true for it. Mishandling this is a "
        "common edge-case slip.\n\n"
        "**The linear upgrade.** KMP precomputes a failure function so it never "
        "re-compares characters, achieving O(n+m); `indexOf`/`contains` are typically "
        "optimised similarly. Mentioning KMP shows you know the brute force isn't "
        "optimal."
    ),
    hints=[
        "Try each start position where sub could still fit in s.",
        "Compare |sub| characters at each start; what's the worst-case cost?",
        "Remember the empty-needle case, and name the O(n+m) KMP upgrade.",
    ],
    complexity_reasoning="up to n−m+1 starts, each up to m comparisons → O(n·m); O(1) extra space.",
    dry_run=dict(
        input="s = \"abcab\", sub = \"cab\"",
        intro="Compare at each start.",
        steps=[
            ("i=0", "abc vs cab", "no"),
            ("i=1", "bca vs cab", "no"),
            ("i=2", "cab vs cab", "match → true"),
        ],
        result="true",
    ),
    edge_cases=[
        ("s = \"abc\", sub = \"\"", "Empty needle → true."),
        ("s = \"abc\", sub = \"d\"", "Absent → false."),
        ("s = \"abc\", sub = \"abc\"", "Whole string matches → true."),
    ],
    pitfalls=[
        "Off-by-one on the start range (i + m <= n).",
        "Not returning true for an empty needle.",
    ],
    interviewer_intent=dict(
        testing="Whether you can write a correct windowed match and know its complexity / the KMP upgrade.",
        common_mistake="Start-range off-by-one, or mishandling the empty needle.",
        to_stand_out="Describe KMP's failure function for O(n+m) matching.",
    ),
    clarifying=[
        ("Can I use the library?", "I'd use contains in practice; I'll show the algorithm to demonstrate it."),
        ("Is an empty substring a match?", "Yes, by convention it occurs at index 0."),
    ],
    followups=[
        dict(title="Implement strStr / indexOf", slug="implement-strstr", hint="Return the index; KMP for O(n+m).", leetcodeNumber=28),
    ],
    remember_add=dict(
        formula="for i in 0..n-m: if s[i:i+m]==sub return true; (empty -> true)",
        when_to_use=["Substring search"],
        anti_signals=["Very large inputs — use KMP/Z-algorithm for O(n+m)"],
    ),
)

E(
    "count-uppercase-letters",
    deep_explanation=(
        "Count characters in the uppercase ASCII range 'A'..'Z' with a single counter — "
        "the simplest range-membership tally.\n\n"
        "**Why a range check.** `ch >= 'A' && ch <= 'Z'` is an O(1) test that includes "
        "only the 26 capital letters; lowercase letters, digits, spaces, and symbols "
        "all fail it and are ignored.\n\n"
        "**Why one pass, no early exit.** A total count requires visiting every "
        "character. There's no shortcut without preprocessing.\n\n"
        "It's the count-upper-lower problem reduced to just the uppercase bucket."
    ),
    hints=[
        "What ASCII range holds the capital letters?",
        "One counter, bump on a range match.",
        "Ignore lowercase, digits, and symbols.",
    ],
    complexity_reasoning="one range comparison per character.",
    dry_run=dict(
        input="s = \"Hi World\"",
        intro="Count A–Z characters.",
        steps=[
            ("H", "A-Z", "count=1"),
            ("i, ' '", "no", "count=1"),
            ("W", "A-Z", "count=2"),
        ],
        result="2",
    ),
    edge_cases=[
        ("s = \"abc\"", "None → 0."),
        ("s = \"ABC\"", "All upper → 3."),
        ("s = \"\"", "Empty → 0."),
    ],
    pitfalls=[
        "Including lowercase letters by mistake.",
        "Counting non-letters.",
    ],
    interviewer_intent=dict(
        testing="Whether you write a clean range-membership tally.",
        common_mistake="Range slip including lowercase or symbols.",
        to_stand_out="Note it generalises to count-upper-lower with a second counter.",
    ),
    clarifying=[
        ("ASCII letters only?", "Yes; Unicode uppercase would use isUpperCase."),
    ],
    followups=[
        dict(title="Count Upper and Lower", slug="count-upper-lower", hint="Add the lowercase counter."),
    ],
    remember_add=dict(
        formula="c=0; for ch: if 'A'<=ch<='Z': c++",
        when_to_use=["Range-membership counting"],
    ),
)


# ─────────────────────────────────────────────────────────────────────────────
# Wave 4a — Loops & Patterns (12)
# ─────────────────────────────────────────────────────────────────────────────

E(
    "print-1-to-n",
    deep_explanation=(
        "The most basic loop: run a counter `i` from 1 through n (inclusive) and collect "
        "each value. The whole lesson is **inclusive bounds** and building output "
        "without quadratic concatenation.\n\n"
        "**Why `i <= n`, not `i < n`.** You want 1..n *including* n, so the loop "
        "condition is `<=`. Using `<` would stop at n−1 — the single most common loop "
        "off-by-one.\n\n"
        "**Why a StringBuilder / join.** Appending into a growable buffer (Java "
        "StringBuilder) or joining a generator (Python) keeps the build O(n). Repeated "
        "`+=` on an immutable String is O(n²).\n\n"
        "**Separator discipline.** Add the space *between* numbers, not after each, so "
        "there's no trailing space — append the separator before all elements except "
        "the first."
    ),
    hints=[
        "Loop a counter from 1 to n — which comparison includes n?",
        "Use `<=` so n itself is printed.",
        "Build with a StringBuilder/join and mind the separators.",
    ],
    complexity_reasoning="n iterations, each appending one value to a growable buffer.",
    dry_run=dict(
        input="n = 3",
        intro="Inclusive count.",
        steps=[
            ("i=1", "append 1", "\"1\""),
            ("i=2", "append 2", "\"1 2\""),
            ("i=3", "append 3", "\"1 2 3\""),
        ],
        result="\"1 2 3\"",
    ),
    edge_cases=[
        ("n = 1", "Single value → \"1\"."),
        ("n = 5", "\"1 2 3 4 5\"."),
    ],
    pitfalls=[
        "Off-by-one: looping to n-1 or starting at 0.",
        "Trailing or leading space in the output.",
    ],
    interviewer_intent=dict(
        testing="Whether you get inclusive bounds and separator handling right.",
        common_mistake="`i < n` dropping the last value, or a trailing space.",
        to_stand_out="Use a builder/join, not += in a loop.",
    ),
    clarifying=[
        ("Inclusive of n?", "Yes — 1..n inclusive, so I use `<=`."),
    ],
    followups=[
        dict(title="Print Even Numbers up to N", slug="print-even-up-to-n", hint="Step by 2 instead of 1."),
        dict(title="Sum from 1 to N", slug="sum-1-to-n", hint="Accumulate instead of print, or use the formula."),
    ],
    remember_add=dict(
        formula="for i in 1..=n: append(i)",
        when_to_use=["Basic counting loops"],
        anti_signals=["`i < n` when you meant inclusive"],
    ),
)

E(
    "print-even-up-to-n",
    deep_explanation=(
        "Produce the even numbers up to n. Two equivalent approaches: **filter** every "
        "value with `i % 2 == 0`, or **step** the counter by 2 starting at 2.\n\n"
        "**Why stepping is cleaner.** Starting at 2 and doing `i += 2` visits only the "
        "evens — no per-value modulo test and half the iterations. It's the natural fit "
        "when the pattern is regular and known in advance.\n\n"
        "**Why start at 2, not 0.** 0 is technically even, but these problems usually "
        "want the positive evens 2, 4, …, so start at 2. Confirm the convention.\n\n"
        "**Edge: n < 2.** There are no evens to print, so the result is the empty "
        "string — the loop simply never runs."
    ),
    hints=[
        "You can filter with `% 2 == 0`, or avoid the test entirely — how?",
        "Start at 2 and step by 2 to hit only evens.",
        "What should happen when n < 2?",
    ],
    complexity_reasoning="about n/2 iterations, each appending one value.",
    dry_run=dict(
        input="n = 5",
        intro="Step by 2 from 2.",
        steps=[
            ("i=2", "append 2", "\"2\""),
            ("i=4", "append 4", "\"2 4\""),
            ("i=6", "6 > 5, stop", "done"),
        ],
        result="\"2 4\"",
    ),
    edge_cases=[
        ("n = 10", "\"2 4 6 8 10\"."),
        ("n = 1", "No evens → \"\"."),
    ],
    pitfalls=[
        "Including odd numbers.",
        "Starting the step at 0 (0 is even but usually excluded).",
    ],
    interviewer_intent=dict(
        testing="Whether you prefer stepping over filtering for a regular pattern.",
        common_mistake="Filtering every value, or an off-by-one on the bound.",
        to_stand_out="Note stepping halves the iterations versus filtering.",
    ),
    clarifying=[
        ("Include 0?", "Usually not — I start at 2 for positive evens."),
    ],
    followups=[
        dict(title="Print 1 to N", slug="print-1-to-n", hint="The unstepped version."),
        dict(title="Multiples of a Number", slug="multiples-of-number", hint="Generalises stepping to any k."),
    ],
    remember_add=dict(
        formula="for i in range(2, n+1, 2): append(i)",
        when_to_use=["Regular stepped sequences"],
    ),
)

E(
    "multiplication-table",
    deep_explanation=(
        "Print n's times-table from 1 to 10: a **fixed-count loop** of exactly ten "
        "iterations, formatting each line as `n x i = n*i`.\n\n"
        "**Why it's effectively O(1).** The loop always runs ten times regardless of n, "
        "so the work is constant — there's no input-size dependence. The 'algorithm' is "
        "really just string formatting.\n\n"
        "**Bound discipline.** Loop `i` from 1 to 10 inclusive; stopping at 9 or running "
        "to 11 is the obvious slip. Place the newline *between* lines so there's no "
        "trailing blank line.\n\n"
        "**Negative n.** The product `n*i` is fine for negative n; the format string "
        "handles the sign automatically."
    ),
    hints=[
        "How many iterations does a 1..10 table need?",
        "Format each line as 'n x i = product'.",
        "Mind the inclusive 1..10 bound and newline placement.",
    ],
    complexity_reasoning="exactly ten iterations regardless of n — constant work.",
    dry_run=dict(
        input="n = 3",
        intro="Ten formatted lines.",
        steps=[
            ("i=1", "3 x 1 = 3", "line 1"),
            ("i=2", "3 x 2 = 6", "line 2"),
            ("...", "through i=10", "3 x 10 = 30"),
        ],
        result="\"3 x 1 = 3\\n...\\n3 x 10 = 30\"",
    ),
    edge_cases=[
        ("n = 1", "1 x 1 = 1 … 1 x 10 = 10."),
        ("n = 0", "All products 0."),
        ("n = -2", "Products are negative; format handles the sign."),
    ],
    pitfalls=[
        "Looping to 9 or 11 instead of 10.",
        "Multiplying by the wrong operand.",
    ],
    interviewer_intent=dict(
        testing="Whether you handle fixed bounds and output formatting cleanly.",
        common_mistake="Off-by-one on the 10 bound, or trailing newline.",
        to_stand_out="Note the loop is O(1) since the count is fixed.",
    ),
    clarifying=[
        ("Up to 10 or 12?", "Standard is 1..10; trivial to change."),
    ],
    followups=[
        dict(title="Multiples of a Number", slug="multiples-of-number", hint="The values without the formatting."),
    ],
    remember_add=dict(
        formula="for i in 1..10: line = f'{n} x {i} = {n*i}'",
        when_to_use=["Fixed-count formatting loops"],
    ),
)

E(
    "sum-of-squares",
    deep_explanation=(
        "Sum 1² + 2² + … + n². The direct way accumulates `i*i` in a loop; the elegant "
        "way uses the **closed form** n(n+1)(2n+1)/6 for O(1).\n\n"
        "**Why a long accumulator.** Squares grow fast: for n = 10⁴ the sum is ~3.3×10¹¹, "
        "well past int range. Accumulate in `long` (and cast `i*i` to long) to avoid "
        "overflow.\n\n"
        "**The closed form.** Just as 1..n sums to n(n+1)/2, the sum of squares has the "
        "identity n(n+1)(2n+1)/6 — provable by induction. It turns the O(n) loop into a "
        "handful of multiplications. Knowing it (and that the /6 is always exact) is the "
        "standout.\n\n"
        "**Inclusive bound.** Loop `i` from 1 to n inclusive; the usual off-by-one "
        "applies."
    ),
    hints=[
        "Accumulate i*i — but is there a formula that skips the loop?",
        "Sum of squares = n(n+1)(2n+1)/6.",
        "Use a long accumulator; squares overflow int quickly.",
    ],
    complexity_reasoning="the loop is O(n); the closed form is O(1) — a fixed number of multiplications.",
    dry_run=dict(
        input="n = 3",
        intro="Accumulate squares (loop view).",
        steps=[
            ("i=1", "+1", "total=1"),
            ("i=2", "+4", "total=5"),
            ("i=3", "+9", "total=14"),
        ],
        result="14",
    ),
    edge_cases=[
        ("n = 1", "1² = 1."),
        ("n = 5", "55."),
        ("n = 10000", "~3.3×10¹¹ — needs long."),
    ],
    pitfalls=[
        "Overflowing an int accumulator.",
        "Off-by-one in the loop bound.",
    ],
    interviewer_intent=dict(
        testing="Whether you know the closed form and guard overflow.",
        common_mistake="Int overflow, or an O(n) loop when O(1) exists.",
        to_stand_out="State and (optionally) justify the n(n+1)(2n+1)/6 identity.",
    ),
    clarifying=[
        ("How large is n?", "Up to ~10⁴, so I sum in long or use the formula."),
    ],
    followups=[
        dict(title="Sum from 1 to N", slug="sum-1-to-n", hint="The linear sum with its own closed form."),
    ],
    remember_add=dict(
        formula="sum i*i  ==  n(n+1)(2n+1)/6",
        when_to_use=["Power sums", "Replacing loops with closed forms"],
    ),
)

E(
    "fizzbuzz",
    deep_explanation=(
        "The canonical screening problem. For each i in 1..n: multiples of both 3 and 5 "
        "→ \"FizzBuzz\", multiples of 3 → \"Fizz\", multiples of 5 → \"Buzz\", otherwise "
        "the number. The entire test is **branch ordering**.\n\n"
        "**Why test divisible-by-15 first.** Every multiple of 15 is also a multiple of "
        "3 and of 5. If you check `% 3` before `% 15`, then 15, 30, 45… match the Fizz "
        "branch and never produce \"FizzBuzz\". So the most specific condition (both) "
        "must come first. This is the trap the problem is famous for.\n\n"
        "**The append variant (no 15 check).** Build the word incrementally: append "
        "\"Fizz\" if divisible by 3, append \"Buzz\" if divisible by 5; if the word is "
        "still empty, use the number. This avoids the explicit 15 test and extends "
        "naturally to more divisors (e.g. add 7 → \"Bazz\").\n\n"
        "**Output type.** Return strings, not ints — the number case must be stringified "
        "too."
    ),
    hints=[
        "Which numbers satisfy more than one rule, and why does order matter?",
        "Test divisible-by-15 (both) before 3 and 5.",
        "Alternative: append 'Fizz'/'Buzz' and fall back to the number if empty.",
    ],
    complexity_reasoning="one constant set of divisibility checks per number across n numbers.",
    dry_run=dict(
        input="n = 5",
        intro="Most-specific branch first.",
        steps=[
            ("1,2", "no divisor", "\"1\",\"2\""),
            ("3", "÷3", "\"Fizz\""),
            ("4", "none", "\"4\""),
            ("5", "÷5", "\"Buzz\""),
        ],
        result="[\"1\",\"2\",\"Fizz\",\"4\",\"Buzz\"]",
    ),
    edge_cases=[
        ("n = 15", "Index 15 → \"FizzBuzz\"."),
        ("n = 3", "First Fizz at 3."),
        ("n = 1", "[\"1\"]."),
    ],
    pitfalls=[
        "Checking %3 or %5 before %15, so 15 never prints FizzBuzz.",
        "Returning ints instead of strings.",
    ],
    interviewer_intent=dict(
        testing="Whether you order overlapping conditions most-specific-first.",
        common_mistake="The classic 15-before-3/5 ordering bug.",
        to_stand_out="Offer the append-and-fallback variant that scales to more divisors.",
    ),
    clarifying=[
        ("Return strings or print?", "I'll return a list of strings, stringifying the number case."),
    ],
    common_mistakes_detailed=[
        dict(
            title="Wrong branch order",
            why="Testing %3 before %15 makes every multiple of 15 print 'Fizz', never 'FizzBuzz'.",
            lang="python",
            bad="if i%3==0: 'Fizz'\nelif i%5==0: 'Buzz'\nelif i%15==0: 'FizzBuzz'  # unreachable",
            good="if i%15==0: 'FizzBuzz'\nelif i%3==0: 'Fizz'\nelif i%5==0: 'Buzz'",
        ),
    ],
    followups=[
        dict(title="Fizz Buzz", slug="fizz-buzz", hint="The LeetCode version.", leetcodeNumber=412),
    ],
    remember_add=dict(
        formula="check %15, then %3, then %5, else number",
        when_to_use=["Overlapping conditional rules", "Divisibility classification"],
        anti_signals=["Checking general cases before the most specific one"],
    ),
)

E(
    "right-triangle-star",
    deep_explanation=(
        "The introduction to **nested loops**: the outer loop selects the row, the inner "
        "loop draws that row's characters. Here row i contains i stars.\n\n"
        "**Why nested loops.** A 2-D shape needs two indices — one for rows, one for "
        "columns. The inner loop's bound depends on the outer index (i stars on row i), "
        "which is what makes it a *triangle* rather than a rectangle.\n\n"
        "**Why O(n²).** Row i does i appends, so total work is 1+2+…+n = n(n+1)/2 = "
        "O(n²) — inherent to drawing the shape.\n\n"
        "**Newline discipline.** Put the newline *between* rows (e.g. `if (i < n)`), not "
        "after the last, to avoid a trailing blank line."
    ),
    hints=[
        "A 2-D shape needs two loops — what does each control?",
        "Row i should have how many stars?",
        "Place newlines between rows, not after the last.",
    ],
    complexity_reasoning="row i emits i characters, so total output is 1+2+…+n = O(n²).",
    dry_run=dict(
        input="n = 3",
        intro="Inner bound depends on the row.",
        steps=[
            ("row 1", "1 star", "*"),
            ("row 2", "2 stars", "*\\n**"),
            ("row 3", "3 stars", "*\\n**\\n***"),
        ],
        result="\"*\\n**\\n***\"",
    ),
    edge_cases=[
        ("n = 1", "\"*\"."),
        ("n = 4", "Four rows, 1..4 stars."),
    ],
    pitfalls=[
        "Inner loop bound wrong (i+1 or i-1 stars).",
        "Trailing newline after the last row.",
    ],
    interviewer_intent=dict(
        testing="Whether you can structure nested loops with an index-dependent inner bound.",
        common_mistake="Off-by-one star count, or trailing newline.",
        to_stand_out="State the row/column mental model for all pattern problems.",
    ),
    clarifying=[
        ("Left- or right-aligned?", "Left-aligned right triangle here; right-aligned adds leading spaces."),
    ],
    followups=[
        dict(title="Pyramid Pattern", slug="pyramid-pattern", hint="Add leading spaces to centre the rows."),
        dict(title="Number Triangle", slug="number-triangle", hint="Emit the index instead of a star."),
    ],
    remember_add=dict(
        formula="for i in 1..n: print('*' * i)",
        when_to_use=["Any row/column pattern"],
    ),
)

E(
    "square-star-pattern",
    deep_explanation=(
        "The simplest nested pattern: both dimensions are fixed at n, so every one of "
        "the n rows has exactly n stars.\n\n"
        "**Why a constant inner bound.** Unlike the triangle (inner bound = row index), "
        "a square's inner loop always runs n times. Getting this constant bound right — "
        "not accidentally making it triangular — is the whole exercise.\n\n"
        "**Why O(n²).** n rows × n columns = n² characters.\n\n"
        "**Newline discipline.** Separate rows with a newline placed between them, not "
        "trailing the last row."
    ),
    hints=[
        "How does the inner bound differ from the triangle's?",
        "Both loops run n times — a constant inner bound.",
        "Newlines between rows only.",
    ],
    complexity_reasoning="n rows each emitting n characters → n² total.",
    dry_run=dict(
        input="n = 2",
        intro="Constant inner bound n.",
        steps=[
            ("row 1", "2 stars", "**"),
            ("row 2", "2 stars", "**\\n**"),
        ],
        result="\"**\\n**\"",
    ),
    edge_cases=[
        ("n = 1", "\"*\"."),
        ("n = 3", "3×3 block."),
    ],
    pitfalls=[
        "Using a triangular inner bound by accident.",
        "Trailing newline.",
    ],
    interviewer_intent=dict(
        testing="Whether you keep the inner bound constant for a rectangle/square.",
        common_mistake="Accidentally indexing the inner bound by the row.",
        to_stand_out="Contrast with the triangle to show you understand the bound's role.",
    ),
    clarifying=[
        ("Filled or hollow square?", "Filled here; hollow would print stars only on the border."),
    ],
    followups=[
        dict(title="Right Triangle Star", slug="right-triangle-star", hint="Make the inner bound the row index."),
    ],
    remember_add=dict(
        formula="for i in 1..n: print('*' * n)",
        when_to_use=["Rectangular patterns"],
    ),
)

E(
    "pyramid-pattern",
    deep_explanation=(
        "A centred pyramid needs **two inner loops per row**: one for the leading spaces "
        "that push the row toward the centre, and one for the stars. The arithmetic "
        "linking the row index to the counts is the lesson.\n\n"
        "**Deriving the counts.** For row i (1..n): leading spaces = n − i (fewer as you "
        "go down), and stars = 2i − 1 (the odd sequence 1, 3, 5, …) so the pyramid is "
        "symmetric about the centre. Plugging i into these formulas is the whole "
        "exercise.\n\n"
        "**Why 2i − 1 stars.** An odd count guarantees a single centre column, giving "
        "the clean triangular silhouette; even counts wouldn't centre.\n\n"
        "**Newline discipline.** As with all patterns, newlines go between rows."
    ),
    hints=[
        "Each row has spaces THEN stars — how many of each?",
        "Spaces shrink as stars grow: derive both from the row index.",
        "Stars per row are odd (2i−1) to keep the pyramid centred.",
    ],
    complexity_reasoning="row i emits (n−i) spaces and (2i−1) stars; summed over rows it's O(n²).",
    dry_run=dict(
        input="n = 3",
        intro="spaces = n−i, stars = 2i−1.",
        steps=[
            ("i=1", "2 spaces, 1 star", "\"  *\""),
            ("i=2", "1 space, 3 stars", "\" ***\""),
            ("i=3", "0 spaces, 5 stars", "\"*****\""),
        ],
        result="\"  *\\n ***\\n*****\"",
    ),
    edge_cases=[
        ("n = 1", "\"*\"."),
        ("n = 2", "\" *\\n***\"."),
    ],
    pitfalls=[
        "Wrong space/star formula (off-centre or wrong widths).",
        "Forgetting the spaces entirely.",
    ],
    interviewer_intent=dict(
        testing="Whether you can derive per-row counts from the row index.",
        common_mistake="Wrong space/star arithmetic producing an off-centre shape.",
        to_stand_out="State the formulas (n−i spaces, 2i−1 stars) and why stars are odd.",
    ),
    clarifying=[
        ("Centred pyramid or right triangle?", "Centred — so each row has leading spaces."),
    ],
    followups=[
        dict(title="Right Triangle Star", slug="right-triangle-star", hint="Drop the spaces for a left-aligned triangle."),
    ],
    remember_add=dict(
        formula="row i: (n-i) spaces + (2i-1) stars",
        when_to_use=["Centred / index-derived patterns"],
    ),
)

E(
    "number-triangle",
    deep_explanation=(
        "Same nested structure as the star triangle, but the inner loop emits the "
        "running number `j` (1..i) instead of a fixed star — so row 3 is `123`.\n\n"
        "**The one change from the star version.** Replace the constant `'*'` with the "
        "inner loop variable `j`. Everything else — outer row loop, inner bound i, "
        "newlines between rows — is identical. Recognising that a pattern problem is "
        "'the same skeleton with a different cell value' is the transferable insight.\n\n"
        "**Why n ≤ 9.** Capping n at 9 keeps each printed number a single digit, so the "
        "columns line up; beyond 9 the multi-digit numbers would misalign.\n\n"
        "**Print j, not i.** Emitting the outer index i (a fixed value per row) instead "
        "of the inner j is the common slip."
    ),
    hints=[
        "Start from the star triangle — what single thing changes?",
        "Print the inner loop variable j, not a star.",
        "Why is n capped at 9?",
    ],
    complexity_reasoning="row i emits i digits; total is O(n²).",
    dry_run=dict(
        input="n = 3",
        intro="Inner loop prints 1..i.",
        steps=[
            ("row 1", "1", "\"1\""),
            ("row 2", "1,2", "\"1\\n12\""),
            ("row 3", "1,2,3", "\"1\\n12\\n123\""),
        ],
        result="\"1\\n12\\n123\"",
    ),
    edge_cases=[
        ("n = 1", "\"1\"."),
        ("n = 4", "\"1\\n12\\n123\\n1234\"."),
    ],
    pitfalls=[
        "Printing i instead of the running j.",
        "Off-by-one in the inner bound.",
    ],
    interviewer_intent=dict(
        testing="Whether you reuse the nested-loop skeleton with a different cell value.",
        common_mistake="Emitting the row index instead of the column index.",
        to_stand_out="Articulate that pattern problems share one skeleton.",
    ),
    clarifying=[
        ("Single-digit assumption?", "Yes, n ≤ 9 keeps columns aligned."),
    ],
    followups=[
        dict(title="Right Triangle Star", slug="right-triangle-star", hint="The star version of the same skeleton."),
    ],
    remember_add=dict(
        formula="for i in 1..n: for j in 1..i: print(j)",
        when_to_use=["Index-valued patterns"],
    ),
)

E(
    "fibonacci-series",
    deep_explanation=(
        "Generate the first n Fibonacci numbers by rolling two variables forward and "
        "**collecting** each value — nth-Fibonacci, but emitting the whole series.\n\n"
        "**Why append before rolling.** Append the current `a` *first*, then advance "
        "`(a, b) → (b, a+b)`. Appending after the roll would skip F(0) = 0 and start the "
        "series at 1. Order matters.\n\n"
        "**Why O(1) extra state (besides output).** Like nth-Fibonacci, each term needs "
        "only the previous two, so two variables suffice regardless of n. The output "
        "list is O(n), which is unavoidable since you return n values.\n\n"
        "**Exactly n terms.** Loop n times to produce n numbers; producing n−1 or n+1 is "
        "the common off-by-one. Overflow caps the usable range near n = 90 for long."
    ),
    hints=[
        "It's nth-Fibonacci, but collect every value, not just the last.",
        "Append the current value before or after rolling? (It changes F(0).)",
        "Loop exactly n times for n terms.",
    ],
    complexity_reasoning="n iterations of one addition; output list is O(n), state is O(1).",
    dry_run=dict(
        input="n = 5",
        intro="Append a, then roll.",
        steps=[
            ("append 0", "roll → (1,1)", "[0]"),
            ("append 1", "roll → (1,2)", "[0,1]"),
            ("append 1", "roll → (2,3)", "[0,1,1]"),
            ("append 2,3", "...", "[0,1,1,2,3]"),
        ],
        result="[0, 1, 1, 2, 3]",
    ),
    edge_cases=[
        ("n = 1", "[0] — F(0) only."),
        ("n = 2", "[0, 1]."),
    ],
    pitfalls=[
        "Appending after rolling (skips F(0)).",
        "Producing n+1 or n-1 terms.",
    ],
    interviewer_intent=dict(
        testing="Whether you collect-while-rolling with correct ordering and count.",
        common_mistake="Off-by-one on the count, or skipping F(0).",
        to_stand_out="Reuse the O(1)-state roll rather than recursion or an array of all prior terms.",
    ),
    clarifying=[
        ("Start at 0 or 1?", "0,1 here; confirm the indexing convention."),
    ],
    followups=[
        dict(title="Nth Fibonacci Number", slug="nth-fibonacci", hint="Return just the last term."),
    ],
    remember_add=dict(
        formula="a,b=0,1; repeat n: out.append(a); a,b=b,a+b",
        when_to_use=["Generating a recurrence series"],
    ),
)

E(
    "multiples-of-number",
    deep_explanation=(
        "Produce the first n positive multiples of k. The i-th multiple is simply "
        "**k·i**, so a single index-driven loop generates them in order.\n\n"
        "**Why index × k.** Multiples of k are k·1, k·2, …, k·n. Multiplying the loop "
        "index by k gives each directly; alternatively, keep a running sum and add k "
        "each step (no multiplication).\n\n"
        "**Why start i at 1.** The 'first' multiple is k·1 = k, not k·0 = 0. Starting at "
        "0 would emit a spurious 0.\n\n"
        "**Overflow.** For large k and i, k·i can exceed int range — accumulate or "
        "produce into a `long` when the values can be big."
    ),
    hints=[
        "What's the i-th multiple of k in terms of i?",
        "Multiply the index by k (or add k repeatedly).",
        "Start at i = 1 so you don't emit 0.",
    ],
    complexity_reasoning="n iterations, one multiply (or add) each.",
    dry_run=dict(
        input="k = 3, n = 4",
        intro="i-th multiple is k·i.",
        steps=[
            ("i=1", "3·1", "3"),
            ("i=2", "3·2", "6"),
            ("i=3,4", "9, 12", "[3,6,9,12]"),
        ],
        result="[3, 6, 9, 12]",
    ),
    edge_cases=[
        ("k = 5, n = 2", "[5, 10]."),
        ("k = 1, n = 3", "[1, 2, 3]."),
    ],
    pitfalls=[
        "Starting at i = 0 (gives a 0 multiple).",
        "Producing the wrong count.",
    ],
    interviewer_intent=dict(
        testing="Whether you generate by index-times-value correctly.",
        common_mistake="Off-by-one emitting 0 or n+1 terms.",
        to_stand_out="Mention the add-k variant to avoid multiplication.",
    ),
    clarifying=[
        ("First n multiples, starting at k?", "Yes — k·1 through k·n."),
    ],
    followups=[
        dict(title="Print Even Numbers up to N", slug="print-even-up-to-n", hint="Multiples of 2, bounded by n."),
    ],
    remember_add=dict(
        formula="for i in 1..n: out.append(k*i)",
        when_to_use=["Generating arithmetic sequences"],
    ),
)

E(
    "primes-up-to-n",
    deep_explanation=(
        "List all primes from 2 to n. The efficient method is the **Sieve of "
        "Eratosthenes**: mark the multiples of each prime as composite; whatever stays "
        "unmarked is prime.\n\n"
        "**Why the sieve beats per-number testing.** Trial-dividing every number is "
        "O(n√n). The sieve instead does the work once per prime, crossing out its "
        "multiples, giving O(n log log n) — near-linear. It's the right tool when you "
        "need *all* primes up to a bound.\n\n"
        "**Why start crossing out at p·p.** Any multiple of p smaller than p² (like "
        "2p, 3p, …) has a smaller prime factor and was already crossed out when that "
        "smaller prime was processed. Starting at p² avoids redundant work.\n\n"
        "**Edge: n < 2.** No primes exist, so return an empty list. The sieve needs a "
        "boolean array of size n+1, hence O(n) space."
    ),
    hints=[
        "Testing each number is O(n√n) — can you do all of them together?",
        "Mark multiples of each found prime; unmarked numbers are prime.",
        "Why can you start crossing out at p² instead of 2p?",
    ],
    complexity_reasoning="each prime p crosses out n/p numbers; summed over primes it's O(n log log n), with an O(n) boolean array.",
    dry_run=dict(
        input="n = 10",
        intro="Cross out multiples from p².",
        steps=[
            ("p=2", "cross 4,6,8,10", "primes so far: 2"),
            ("p=3", "cross 9", "+3"),
            ("5,7", "p² > 10, none to cross", "+5,7"),
        ],
        result="[2, 3, 5, 7]",
    ),
    edge_cases=[
        ("n = 2", "[2] — smallest prime."),
        ("n = 1", "[] — none ≤ 1."),
    ],
    pitfalls=[
        "Starting the inner crossing-out at 2p instead of p² (slower but still correct).",
        "Returning primes for n < 2.",
    ],
    interviewer_intent=dict(
        testing="Whether you know the sieve and the p² optimisation, not just trial division.",
        common_mistake="Per-number trial division, or crossing out from 2p.",
        to_stand_out="Quote the O(n log log n) bound and justify starting at p².",
    ),
    clarifying=[
        ("Need all primes, or test one number?", "All up to n — that's why the sieve fits."),
    ],
    followups=[
        dict(title="Prime Number", slug="prime-number", hint="Single-number primality via √n trial division."),
        dict(title="Count Primes", slug="count-primes", hint="Same sieve, return the count.", leetcodeNumber=204),
    ],
    remember_add=dict(
        formula="sieve: for p where !composite[p]: cross out p*p, p*p+p, ...",
        when_to_use=["All primes up to a bound", "Precomputing prime tables"],
        anti_signals=["Just one primality check — use √n trial division"],
    ),
)


# ─────────────────────────────────────────────────────────────────────────────
# Wave 4b — Searching & Sorting (8)
# ─────────────────────────────────────────────────────────────────────────────

E(
    "binary-search",
    deep_explanation=(
        "On a sorted array you can find a target in O(log n) by repeatedly **halving "
        "the search range**: compare the middle element to the target; the comparison "
        "tells you which half can possibly contain it, so you discard the other.\n\n"
        "**Why it's logarithmic.** Each step throws away half the remaining candidates, "
        "so n → n/2 → n/4 → … reaches 1 in about log₂(n) steps. For n = 10⁶ that's ~20 "
        "comparisons versus a million for a linear scan — the payoff for sortedness.\n\n"
        "**Why `mid = lo + (hi - lo) / 2`.** Computing `(lo + hi) / 2` can overflow when "
        "lo and hi are large ints. The `lo + (hi - lo)/2` form is mathematically equal "
        "but never overflows — a detail interviewers specifically look for.\n\n"
        "**Loop and bound discipline.** Use `lo <= hi` (inclusive) so a match at the "
        "boundary isn't skipped, and always move past mid (`lo = mid + 1` / `hi = mid - "
        "1`) so the range strictly shrinks — otherwise you loop forever."
    ),
    hints=[
        "The array is sorted — how much of it can you eliminate per comparison?",
        "Compare the middle to the target; recurse into the half that could contain it.",
        "Use an overflow-safe midpoint and make sure the range always shrinks.",
    ],
    complexity_reasoning="the range halves each iteration, so ~log₂(n) iterations with O(1) work and O(1) space.",
    dry_run=dict(
        input="nums = [1,3,5,7,9], target = 7",
        intro="Halve each step.",
        steps=[
            ("lo=0,hi=4", "mid=2, nums[2]=5 < 7", "lo=3"),
            ("lo=3,hi=4", "mid=3, nums[3]=7", "found"),
        ],
        result="3",
    ),
    edge_cases=[
        ("nums = [1,3,5], target = 4", "Absent → lo passes hi → -1."),
        ("nums = [2], target = 2", "Single element found at 0."),
        ("nums = [], target = 1", "Empty → -1 immediately."),
    ],
    pitfalls=[
        "`(lo + hi) / 2` overflowing for large indices.",
        "Wrong loop condition (`lo < hi`) skipping a valid match.",
        "Forgetting to move past mid, causing an infinite loop.",
    ],
    interviewer_intent=dict(
        testing="Whether you implement binary search with correct bounds and an overflow-safe midpoint.",
        common_mistake="Midpoint overflow, off-by-one bounds, or non-shrinking range.",
        to_stand_out="Mention lower_bound/upper_bound variants for first/last occurrence and binary-search-on-answer.",
    ),
    clarifying=[
        ("Is the array sorted and ascending?", "Yes — that's the precondition for binary search."),
        ("Any duplicates, and which index do I return?", "For duplicates I'd switch to a leftmost/rightmost variant."),
    ],
    common_mistakes_detailed=[
        dict(
            title="Midpoint overflow",
            why="(lo + hi) can exceed int max for large arrays; lo + (hi - lo)/2 is equivalent but safe.",
            lang="java",
            bad="int mid = (lo + hi) / 2;          // can overflow",
            good="int mid = lo + (hi - lo) / 2;",
        ),
    ],
    followups=[
        dict(title="First and Last Occurrence", slug="first-last-occurrence", hint="Two binary searches: leftmost and rightmost."),
        dict(title="Search in Rotated Sorted Array", slug="search-rotated-sorted", hint="Binary search with a rotation check.", leetcodeNumber=33),
    ],
    remember_add=dict(
        formula="lo,hi=0,n-1; while lo<=hi: mid=lo+(hi-lo)/2; ...",
        when_to_use=["Sorted lookup", "Monotonic predicate / binary-search-on-answer"],
        anti_signals=["Unsorted data — sort first or scan linearly"],
    ),
)

E(
    "bubble-sort",
    deep_explanation=(
        "Bubble sort makes repeated passes, swapping adjacent out-of-order pairs. Each "
        "pass 'bubbles' the largest remaining element to its final position at the end.\n\n"
        "**Why the inner bound shrinks (`n-1-i`).** After pass i, the last i elements "
        "are already the i largest, sorted and settled — so the next pass needn't touch "
        "them. Shrinking the inner bound avoids redundant comparisons.\n\n"
        "**Why the early-exit flag matters.** If a full pass makes zero swaps, the array "
        "is already sorted and you can stop — turning the best case (already-sorted "
        "input) into O(n). Without the flag it's always O(n²).\n\n"
        "**Stability and use.** Bubble sort is stable (equal elements keep order) and "
        "in place (O(1) space), but its O(n²) average makes it a teaching algorithm, not "
        "a production one. Know it to discuss sorting fundamentals."
    ),
    hints=[
        "Each pass moves the largest unsorted element where?",
        "Can you shrink the inner loop as elements settle?",
        "Add a flag to stop early when a pass makes no swaps.",
    ],
    complexity_reasoning="up to n passes of up to n comparisons → O(n²) worst/average; the swap flag makes a sorted input O(n).",
    dry_run=dict(
        input="nums = [3, 1, 2]",
        intro="Swap out-of-order neighbours.",
        steps=[
            ("pass1: 3,1", "3>1 swap", "[1,3,2]"),
            ("pass1: 3,2", "3>2 swap", "[1,2,3]"),
            ("pass2", "no swaps", "stop (sorted)"),
        ],
        result="[1, 2, 3]",
    ),
    edge_cases=[
        ("nums = [1, 2, 3]", "Already sorted → one pass, no swaps, O(n)."),
        ("nums = [1]", "Trivially sorted."),
        ("nums = [3, 2, 1]", "Worst case, full O(n²)."),
    ],
    pitfalls=[
        "Skipping the early-exit and always running O(n²).",
        "Inner bound not shrinking (n-1-i), redoing settled elements.",
    ],
    interviewer_intent=dict(
        testing="Whether you know bubble sort's mechanics, the shrinking bound, and the early-exit optimisation.",
        common_mistake="No swap flag, or a non-shrinking inner bound.",
        to_stand_out="Note it's stable and in place but O(n²); name a real-world sort for production.",
    ),
    clarifying=[
        ("Must I implement it, or can I call a library sort?", "I'll implement it since the algorithm is the point."),
    ],
    followups=[
        dict(title="Insertion Sort", slug="insertion-sort", hint="Also O(n²) but faster on nearly-sorted data."),
        dict(title="Merge Two Sorted Arrays", slug="merge-two-sorted-arrays", hint="The merge step toward O(n log n) sorts."),
    ],
    remember_add=dict(
        formula="for i: for j<n-1-i: if a[j]>a[j+1] swap; stop if no swaps",
        when_to_use=["Teaching/illustrating adjacent-swap sorting"],
        anti_signals=["Production sorting — use the library O(n log n)"],
    ),
)

E(
    "selection-sort",
    deep_explanation=(
        "Selection sort grows a sorted prefix by repeatedly **finding the minimum** of "
        "the unsorted suffix and swapping it to the front of that suffix.\n\n"
        "**Why track the min index, not swap eagerly.** Scan the suffix recording the "
        "index of the smallest element, then do a single swap into position i. Swapping "
        "every time you see a smaller value would do many extra writes.\n\n"
        "**Its signature property: few swaps.** It always does O(n²) *comparisons*, but "
        "only O(n) *swaps* (one per position). When writes are expensive (e.g. to flash "
        "memory), that minimal-write property is its advantage over bubble sort.\n\n"
        "**Not stable, in place.** It can reorder equal elements, and uses O(1) extra "
        "space. Like the other O(n²) sorts, it's a fundamentals algorithm."
    ),
    hints=[
        "Each step places which element into its final spot?",
        "Find the min index of the suffix, then swap once.",
        "Compare its swap count to bubble sort's.",
    ],
    complexity_reasoning="n positions each scanning the remaining suffix → O(n²) comparisons, but only O(n) swaps.",
    dry_run=dict(
        input="nums = [3, 1, 2]",
        intro="Select the min, swap to front.",
        steps=[
            ("i=0", "min is 1 at idx1", "[1,3,2]"),
            ("i=1", "min is 2 at idx2", "[1,2,3]"),
        ],
        result="[1, 2, 3]",
    ),
    edge_cases=[
        ("nums = [5, 4]", "One selection → [4, 5]."),
        ("nums = [1]", "Trivial."),
        ("nums = [1, 2, 3]", "Still O(n²) comparisons even when sorted."),
    ],
    pitfalls=[
        "Swapping values instead of tracking the min index.",
        "Starting the inner scan at i instead of i+1 (harmless but wasteful).",
    ],
    interviewer_intent=dict(
        testing="Whether you implement min-selection with a single swap per position.",
        common_mistake="Eager swapping (extra writes) or a wrong inner-scan start.",
        to_stand_out="Highlight the O(n) swap count as its distinguishing trait.",
    ),
    clarifying=[
        ("Stability required?", "Selection sort isn't stable; I'd pick insertion/merge sort if it is."),
    ],
    followups=[
        dict(title="Bubble Sort", slug="bubble-sort", hint="Adjacent swaps instead of min-selection."),
        dict(title="Kth Smallest Element", slug="kth-smallest", hint="A partial selection idea (k passes / quickselect)."),
    ],
    remember_add=dict(
        formula="for i: m=argmin(a[i..]); swap a[i], a[m]",
        when_to_use=["When swaps/writes are costly"],
    ),
)

E(
    "insertion-sort",
    deep_explanation=(
        "Insertion sort grows a sorted prefix by taking each next element (the 'key') "
        "and **shifting** the larger sorted elements one step right to open a slot, then "
        "dropping the key in.\n\n"
        "**Why it's great on nearly-sorted data.** If the key is already ≥ the prefix's "
        "last element, no shifting happens — so on an (almost) sorted array each "
        "insertion is O(1), giving near-linear O(n) total. This adaptivity is its real "
        "strength and why it's used as the base case inside fast sorts (e.g. Timsort).\n\n"
        "**Why save the key first.** The shifting overwrites positions, so you must "
        "capture `key = nums[i]` before sliding elements, then place it in the opened "
        "gap at `j+1`.\n\n"
        "**Stable, in place, O(n²) worst.** On reverse-sorted input every element shifts "
        "the whole prefix → O(n²); but it's stable and O(1) space."
    ),
    hints=[
        "Treat the left part as sorted — where does the next element belong?",
        "Shift larger sorted elements right to open a gap, then insert the key.",
        "What happens on already-sorted input?",
    ],
    complexity_reasoning="worst case shifts the whole prefix each time → O(n²); on nearly-sorted data few shifts → O(n).",
    dry_run=dict(
        input="nums = [3, 1, 2]",
        intro="Shift larger elements, insert key.",
        steps=[
            ("key=1", "shift 3 right, insert 1", "[1,3,2]"),
            ("key=2", "shift 3 right, insert 2", "[1,2,3]"),
        ],
        result="[1, 2, 3]",
    ),
    edge_cases=[
        ("nums = [1, 2, 3]", "Already sorted → O(n), no shifts."),
        ("nums = [2, 1]", "One insert → [1, 2]."),
        ("nums = [3, 2, 1]", "Reverse → worst-case O(n²)."),
    ],
    pitfalls=[
        "Overwriting the key before shifting (save it first).",
        "Off-by-one when placing the key (j+1).",
    ],
    interviewer_intent=dict(
        testing="Whether you implement shift-and-insert and know its adaptivity to sorted input.",
        common_mistake="Losing the key by not saving it, or an off-by-one placement.",
        to_stand_out="Note it's stable, adaptive (O(n) on sorted), and used inside Timsort.",
    ),
    clarifying=[
        ("Is the data likely nearly sorted?", "If so insertion sort is an excellent O(n)-ish choice."),
    ],
    followups=[
        dict(title="Bubble Sort", slug="bubble-sort", hint="Another O(n²) stable sort with early exit."),
    ],
    remember_add=dict(
        formula="for i: key=a[i]; shift a[j]>key right; a[j+1]=key",
        when_to_use=["Nearly-sorted data", "Base case of hybrid sorts"],
    ),
)

E(
    "count-greater-than-x",
    deep_explanation=(
        "Count elements strictly greater than x: a **filtered count** — bump a counter "
        "whenever `nums[i] > x`.\n\n"
        "**Why strict `>`.** 'Strictly greater' excludes elements equal to x; using "
        "`>=` would wrongly include them. Match the comparison to the wording.\n\n"
        "**Why O(n) for unsorted.** With no order you must examine every element. But if "
        "the array were **sorted**, binary-searching the first index greater than x "
        "gives the count as `n − firstIndex` in O(log n) — the key optimisation to "
        "name.\n\n"
        "This is the same predicate-count template as count-occurrences and sum-of-"
        "evens, with `> x` as the predicate."
    ),
    hints=[
        "Bump a counter on which condition?",
        "Strict > excludes elements equal to x.",
        "If the array were sorted, could you avoid scanning all of it?",
    ],
    complexity_reasoning="one comparison per element for unsorted data; O(log n) via binary search if sorted.",
    dry_run=dict(
        input="nums = [1, 5, 2, 8], x = 3",
        intro="Count elements > 3.",
        steps=[
            ("1", "no", "c=0"),
            ("5", "yes", "c=1"),
            ("2", "no", "c=1"),
            ("8", "yes", "c=2"),
        ],
        result="2",
    ),
    edge_cases=[
        ("nums = [1, 2], x = 5", "None → 0."),
        ("nums = [9], x = 0", "9 > 0 → 1."),
        ("nums = [3, 3], x = 3", "Strict > excludes equals → 0."),
    ],
    pitfalls=[
        "Using `>=` and counting elements equal to x.",
        "Scanning a sorted array linearly when binary search would do.",
    ],
    interviewer_intent=dict(
        testing="Whether you match strictness to the spec and spot the sorted-data optimisation.",
        common_mistake="`>=` off-by-one, or ignoring sortedness.",
        to_stand_out="Give the O(log n) binary-search count for sorted input.",
    ),
    clarifying=[
        ("Strictly greater, or ≥?", "Strictly greater — so I use `>`."),
        ("Is the array sorted?", "If so, binary search makes this O(log n)."),
    ],
    followups=[
        dict(title="Count Occurrences", slug="count-occurrences", hint="Equality predicate instead of >."),
        dict(title="Binary Search", slug="binary-search", hint="The tool for the sorted O(log n) variant."),
    ],
    remember_add=dict(
        formula="c=0; for v: if v>x: c++",
        when_to_use=["Predicate counts"],
        anti_signals=["Sorted data — binary-search the boundary"],
    ),
)

E(
    "sort-0s-and-1s",
    deep_explanation=(
        "With only two distinct values, sorting reduces to **counting**. Count the "
        "zeros, then overwrite the array with that many 0s followed by 1s. O(n) time, "
        "O(1) space, beating any comparison sort.\n\n"
        "**Why counting beats comparison sort.** Comparison sorts are bounded by "
        "O(n log n). But when the value set is tiny and known, you don't need "
        "comparisons — count occurrences and rewrite. This is counting sort specialised "
        "to two values.\n\n"
        "**The two-pointer alternative.** A left/right pointer pair can swap 0s to the "
        "front in a single pass without a separate count — useful when you can't "
        "overwrite freely. Both are O(n)/O(1).\n\n"
        "**Generalises to three (Dutch flag).** Sorting 0s/1s/2s in one pass is the "
        "Dutch National Flag problem — a natural follow-up worth naming."
    ),
    hints=[
        "Only two values — do you actually need to compare anything?",
        "Count the zeros, then write zeros-then-ones.",
        "How would you extend this to 0s, 1s, and 2s?",
    ],
    complexity_reasoning="one pass to count and one to overwrite → O(n), with O(1) extra space.",
    dry_run=dict(
        input="nums = [1, 0, 1, 0]",
        intro="Count zeros, then rewrite.",
        steps=[
            ("count", "two 0s", "zeros=2"),
            ("write", "idx<2 → 0 else 1", "[0,0,1,1]"),
        ],
        result="[0, 0, 1, 1]",
    ),
    edge_cases=[
        ("nums = [0, 0]", "Already sorted."),
        ("nums = [1]", "Single element."),
        ("nums = [1,1,1]", "Zero zeros → all 1s."),
    ],
    pitfalls=[
        "Reaching for a full O(n log n) sort on binary data.",
        "Off-by-one on the zero-count boundary.",
    ],
    interviewer_intent=dict(
        testing="Whether you recognise counting sort for a tiny value set.",
        common_mistake="Using a comparison sort, or a boundary off-by-one.",
        to_stand_out="Mention the two-pointer variant and the Dutch National Flag generalisation.",
    ),
    clarifying=[
        ("Can I overwrite in place?", "Yes — count then rewrite; otherwise I'd use two pointers."),
    ],
    followups=[
        dict(title="Sort Colors (0s,1s,2s)", slug="sort-colors", hint="Dutch National Flag — three-way one-pass partition.", leetcodeNumber=75),
    ],
    remember_add=dict(
        formula="zeros=count(0); a[i]= i<zeros ? 0 : 1",
        when_to_use=["Few distinct values", "Counting sort"],
        anti_signals=["Many distinct values — counting sort's range blows up"],
    ),
)

E(
    "kth-smallest",
    deep_explanation=(
        "The k-th smallest element sits at index k−1 once the array is sorted, so "
        "**sort and index** is the clean O(n log n) baseline. Faster methods exist for "
        "a single order statistic.\n\n"
        "**Why sort-and-index is correct.** Sorting ascending arranges elements by rank; "
        "the element at 0-based index k−1 is the k-th smallest (1-indexed k). Duplicates "
        "count toward the rank, which is the usual convention.\n\n"
        "**Why mention quickselect / a heap.** If you only need one order statistic, "
        "sorting everything is overkill. **Quickselect** partitions like quicksort but "
        "recurses into only one side, averaging O(n). A bounded **max-heap of size k** "
        "gives O(n log k). Naming these shows you know sorting isn't always necessary.\n\n"
        "**Don't mutate the caller's array** unless allowed — sort a copy."
    ),
    hints=[
        "Where does the k-th smallest sit in a sorted array?",
        "Sort and index k−1 is the baseline — what's the 1-vs-0 indexing?",
        "Do you need to sort everything for one order statistic?",
    ],
    complexity_reasoning="sorting is O(n log n); quickselect averages O(n); a size-k heap is O(n log k).",
    dry_run=dict(
        input="nums = [3, 1, 2], k = 2",
        intro="Sort, then index k−1.",
        steps=[
            ("sort", "[1, 2, 3]", "sorted"),
            ("index", "k-1 = 1", "value 2"),
        ],
        result="2",
    ),
    edge_cases=[
        ("nums = [5], k = 1", "Only element → 5."),
        ("nums = [4, 4, 4], k = 2", "Duplicates count → 4."),
    ],
    pitfalls=[
        "Off-by-one: returning nums[k] instead of nums[k-1].",
        "Mutating the caller's array when a copy is expected.",
    ],
    interviewer_intent=dict(
        testing="Whether you handle the 1/0 indexing and know faster order-statistic methods.",
        common_mistake="The k vs k-1 off-by-one, or sorting in place destructively.",
        to_stand_out="Describe quickselect's average O(n) and the size-k heap.",
    ),
    clarifying=[
        ("Is k 1-indexed?", "Assuming yes → sorted index k-1; confirm if 0-indexed."),
        ("k-th smallest or largest?", "Smallest here; largest is symmetric (n-k)."),
    ],
    followups=[
        dict(title="Kth Largest Element", slug="kth-largest-element", hint="Heap or quickselect; symmetric to smallest.", leetcodeNumber=215),
    ],
    remember_add=dict(
        formula="sorted(nums)[k-1]   (or quickselect for O(n) avg)",
        when_to_use=["Order statistics"],
        anti_signals=["Streaming / huge data — use a bounded heap or quickselect"],
    ),
)

E(
    "first-last-occurrence",
    deep_explanation=(
        "Return the first and last indices of a target. A single pass suffices: record "
        "`first` only the first time you match, and overwrite `last` on every match.\n\n"
        "**Why guard `first` but not `last`.** The earliest index should be set once and "
        "never changed (guard it with the `first == -1` check). The latest index is "
        "simply whatever the final match was, so you update it unconditionally on each "
        "hit.\n\n"
        "**Why both default to -1.** If the target never appears, both stay -1, which is "
        "the agreed 'absent' signal. Returning [0, 0] for an absent target is the "
        "classic bug.\n\n"
        "**The sorted upgrade.** On a sorted array, the matches form a contiguous block, "
        "so two binary searches (leftmost and rightmost index) find both ends in "
        "O(log n) — the standard follow-up (LeetCode 34)."
    ),
    hints=[
        "Can one pass capture both the earliest and latest match?",
        "Set first only once; always update last.",
        "What do you return when the target is absent?",
    ],
    complexity_reasoning="one linear pass with two index variables; O(log n) via two binary searches if sorted.",
    dry_run=dict(
        input="nums = [1, 2, 2, 3, 2], target = 2",
        intro="Guard first, always update last.",
        steps=[
            ("i=1", "match, first=-1→1", "first=1,last=1"),
            ("i=2", "match", "last=2"),
            ("i=4", "match", "last=4"),
        ],
        result="[1, 4]",
    ),
    edge_cases=[
        ("nums = [1, 2, 3], target = 5", "Absent → [-1, -1]."),
        ("nums = [4], target = 4", "Single hit → [0, 0]."),
    ],
    pitfalls=[
        "Overwriting `first` on every match (loses the earliest).",
        "Returning [0, 0] instead of [-1, -1] when absent.",
    ],
    interviewer_intent=dict(
        testing="Whether you capture first/last in one pass and handle the absent case.",
        common_mistake="Overwriting first, or wrong absent sentinel.",
        to_stand_out="Give the O(log n) two-binary-search solution for sorted input (LC34).",
    ),
    clarifying=[
        ("Is the array sorted?", "If so I'd use two binary searches for O(log n)."),
        ("Return value when absent?", "[-1, -1]."),
    ],
    followups=[
        dict(title="Find First and Last Position (sorted)", slug="find-first-last-position", hint="Two binary searches on a sorted array.", leetcodeNumber=34),
        dict(title="Count Occurrences", slug="count-occurrences", hint="last − first + 1 gives the count on sorted data."),
    ],
    remember_add=dict(
        formula="first=-1,last=-1; on match: if first<0 first=i; last=i",
        when_to_use=["Range of a value's positions"],
        anti_signals=["Sorted — binary-search both ends"],
    ),
)


# ─────────────────────────────────────────────────────────────────────────────
# Wave 5a — Recursion (8)
# ─────────────────────────────────────────────────────────────────────────────

E(
    "factorial-recursion",
    deep_explanation=(
        "The textbook first recursion: n! = n · (n−1)!, with 0! = 1 (and 1! = 1) as the "
        "base case that stops the descent. Every recursion needs exactly these two "
        "pieces — a **base case** and a **recursive case that shrinks the problem**.\n\n"
        "**Why the base case is non-negotiable.** Without `if (n <= 1) return 1`, the "
        "calls descend forever (n, n−1, …, into negatives), overflowing the call stack. "
        "The base case is what guarantees termination.\n\n"
        "**How the call stack unwinds.** factorial(5) waits for factorial(4), which waits "
        "for factorial(3), … down to factorial(1)=1; then the stack unwinds multiplying "
        "back up: 1→2→6→24→120. Each frame uses stack space, so this is O(n) stack — "
        "iteration avoids that.\n\n"
        "**Overflow.** Use `long`; 20! is the largest factorial that fits in signed "
        "64-bit, and 13! already overflows int."
    ),
    hints=[
        "Express n! in terms of a smaller factorial.",
        "What input stops the recursion?",
        "Each call adds a stack frame — what's the space cost?",
    ],
    complexity_reasoning="n nested calls, one multiply each, with an O(n)-deep call stack.",
    dry_run=dict(
        input="n = 4",
        intro="Descend to the base, then unwind.",
        steps=[
            ("call", "4·f(3)·…·f(1)", "stack builds"),
            ("base", "f(1)=1", "unwind starts"),
            ("unwind", "1→2→6→24", "multiply back up"),
        ],
        result="24",
    ),
    edge_cases=[
        ("n = 0", "Base case returns 1 (0! = 1)."),
        ("n = 1", "Base case returns 1."),
        ("n = 21", "Overflows even long."),
    ],
    pitfalls=[
        "Missing base case → infinite recursion / stack overflow.",
        "Using int and overflowing past 12!.",
    ],
    interviewer_intent=dict(
        testing="Whether you structure a recursion with a correct base case and shrinking step.",
        common_mistake="Omitting or mis-placing the base case; int overflow.",
        to_stand_out="Note iteration avoids the O(n) stack, and quote the long overflow limit (20!).",
    ),
    clarifying=[
        ("Recursion required, or is iteration fine?", "I'll show recursion as asked; iteration avoids stack depth."),
    ],
    common_mistakes_detailed=[
        dict(
            title="No base case",
            why="Without a stopping condition the function recurses past 0 into negatives until the stack overflows.",
            lang="java",
            bad="long f(int n){ return n * f(n-1); }       // never stops",
            good="long f(int n){ if (n <= 1) return 1; return n * f(n-1); }",
        ),
    ],
    followups=[
        dict(title="Factorial of a Number", slug="factorial", hint="The iterative version, no stack cost."),
        dict(title="Sum 1 to N (Recursion)", slug="sum-n-recursion", hint="Same base-plus-shrink shape."),
    ],
    remember_add=dict(
        formula="f(n) = n<=1 ? 1 : n * f(n-1)",
        when_to_use=["Teaching recursion", "Naturally self-similar products"],
        anti_signals=["Large n — recursion risks stack overflow; iterate"],
    ),
)

E(
    "fibonacci-recursion",
    deep_explanation=(
        "F(n) = F(n−1) + F(n−2), with two base cases F(0)=0, F(1)=1. The naive recursion "
        "is the canonical example of **overlapping subproblems** causing exponential "
        "blow-up — and memoisation is the expected fix.\n\n"
        "**Why it's O(2ⁿ).** The two recursive branches re-evaluate the same values "
        "repeatedly: computing F(5) recomputes F(3) twice, F(2) three times, and so on. "
        "The call tree roughly doubles each level, so the work is exponential. F(50) "
        "naively makes billions of calls.\n\n"
        "**The fix: memoisation.** Cache each F(k) the first time it's computed (an array "
        "or hash map, or `@lru_cache`). Subsequent calls hit the cache in O(1), "
        "collapsing the whole thing to O(n). Iteration (rolling two variables) is the "
        "O(1)-space alternative.\n\n"
        "**The real interview point** is recognising the exponential blow-up and "
        "removing it — not writing the recurrence."
    ),
    hints=[
        "Write the two-base-case recurrence first.",
        "Sketch the call tree — which subproblems repeat?",
        "Cache results (memoise) to collapse O(2ⁿ) to O(n).",
    ],
    complexity_reasoning="naive recursion's call tree doubles each level → O(2ⁿ); memoising computes each F(k) once → O(n).",
    dry_run=dict(
        input="n = 5 (naive call tree)",
        intro="See the repeated work.",
        steps=[
            ("F(5)", "F(4)+F(3)", "branches"),
            ("F(4),F(3)", "both expand F(2)", "F(2) recomputed"),
            ("...", "exponential repeats", "O(2^n)"),
        ],
        result="5",
    ),
    edge_cases=[
        ("n = 0", "Base case → 0."),
        ("n = 1", "Base case → 1."),
        ("n = 50", "Naive times out; memoised is instant."),
    ],
    pitfalls=[
        "Leaving the naive O(2ⁿ) version for large n.",
        "Only one base case, mishandling n = 0 or 1.",
    ],
    interviewer_intent=dict(
        testing="Whether you spot overlapping subproblems and apply memoisation.",
        common_mistake="Shipping the exponential recursion.",
        to_stand_out="Offer top-down memoisation and the O(1)-space iterative roll.",
    ),
    clarifying=[
        ("Is performance graded?", "If so I'll memoise or iterate rather than recurse naively."),
    ],
    common_mistakes_detailed=[
        dict(
            title="Naive recursion without memo",
            why="Recomputing F(n-1) and F(n-2) re-evaluates shared subproblems exponentially.",
            lang="python",
            bad="def fib(n):\n    if n<2: return n\n    return fib(n-1)+fib(n-2)   # O(2^n)",
            good="from functools import lru_cache\n@lru_cache(None)\ndef fib(n):\n    if n<2: return n\n    return fib(n-1)+fib(n-2)   # O(n)",
        ),
    ],
    followups=[
        dict(title="Nth Fibonacci Number", slug="nth-fibonacci", hint="Iterative O(n)/O(1) version."),
        dict(title="Climbing Stairs", slug="climbing-stairs", hint="Same recurrence as a DP.", leetcodeNumber=70),
    ],
    remember_add=dict(
        formula="F(n)=F(n-1)+F(n-2); MEMOISE",
        when_to_use=["Demonstrating memoisation", "Overlapping-subproblem recursions"],
        anti_signals=["Naive recursion on large n"],
    ),
)

E(
    "sum-n-recursion",
    deep_explanation=(
        "sum(n) = n + sum(n−1), bottoming out at sum(0) = 0 — the base-plus-shrink "
        "recursion applied to addition.\n\n"
        "**Why it mirrors the math.** The definition reads exactly like the recurrence: "
        "the sum up to n is n plus the sum up to n−1. Each call peels off one term until "
        "it reaches the empty sum, 0.\n\n"
        "**Why recursion is the *wrong* tool at scale.** Each call adds a stack frame, so "
        "this is O(n) stack depth; for n = 10⁵ that risks a stack overflow. The "
        "iterative loop is O(1) space, and the closed form n(n+1)/2 is O(1) time — both "
        "beat the recursion. Saying so shows judgement.\n\n"
        "**Tail-call note.** Some languages optimise tail recursion to O(1) stack; Java "
        "and CPython do not, so the depth concern is real there."
    ),
    hints=[
        "Express the sum to n in terms of the sum to n−1.",
        "What's the base case?",
        "Is recursion the best tool here, given large n?",
    ],
    complexity_reasoning="n nested calls, each O(1) work, with an O(n)-deep stack.",
    dry_run=dict(
        input="n = 3",
        intro="Peel one term per call.",
        steps=[
            ("sum(3)", "3 + sum(2)", "waits"),
            ("sum(2)", "2 + sum(1)", "waits"),
            ("base", "sum(0)=0", "unwind 0→1→3→6"),
        ],
        result="6",
    ),
    edge_cases=[
        ("n = 0", "Base case → 0."),
        ("n = 1", "1 + sum(0) = 1."),
        ("n = 100000", "Deep recursion risks stack overflow — prefer loop/formula."),
    ],
    pitfalls=[
        "No base case → stack overflow.",
        "Deep recursion blowing the stack for large n.",
    ],
    interviewer_intent=dict(
        testing="Whether you translate a recurrence and recognise recursion's stack cost.",
        common_mistake="Missing base case, or ignoring the stack-depth risk.",
        to_stand_out="Mention the O(1) closed form and iterative alternatives.",
    ),
    clarifying=[
        ("How large can n be?", "If large, I'd switch to the loop or n(n+1)/2 to avoid stack overflow."),
    ],
    followups=[
        dict(title="Sum from 1 to N", slug="sum-1-to-n", hint="Closed form / iterative, O(1) space."),
    ],
    remember_add=dict(
        formula="sum(n) = n==0 ? 0 : n + sum(n-1)",
        when_to_use=["Illustrating linear recursion"],
        anti_signals=["Large n — use the loop or formula"],
    ),
)

E(
    "reverse-string-recursion",
    deep_explanation=(
        "Reverse by recursion: reverse everything after the first character, then put "
        "the first character at the **end**. Base case is a string of length ≤ 1, which "
        "is its own reverse.\n\n"
        "**Why append the head at the end.** `reverse(s[1:]) + s[0]` reverses the tail "
        "and tacks the original first character on after it — which places it last, "
        "exactly where a reversal sends it. Prepending instead would not reverse "
        "anything.\n\n"
        "**Why this naive version is O(n²).** Each call builds a new string by "
        "concatenation, copying O(n) characters, across n calls → O(n²) time plus O(n) "
        "stack. The efficient form swaps characters in a char array with two indices "
        "moving inward (O(n) time, in place) — mention it as the upgrade.\n\n"
        "Recursion here is a teaching device; iteration (two-pointer swap) is what "
        "you'd ship."
    ),
    hints=[
        "Reverse the tail, then where does the first character go?",
        "Base case: a 0- or 1-length string.",
        "Why is the naive concatenation version O(n²)?",
    ],
    complexity_reasoning="n recursive calls each concatenating O(n) characters → O(n²); the char-swap form is O(n).",
    dry_run=dict(
        input="s = \"abc\"",
        intro="reverse(tail) + head.",
        steps=[
            ("\"abc\"", "reverse(\"bc\") + 'a'", "waits"),
            ("\"bc\"", "reverse(\"c\") + 'b'", "→ \"cb\""),
            ("combine", "\"cb\" + 'a'", "\"cba\""),
        ],
        result="\"cba\"",
    ),
    edge_cases=[
        ("s = \"\"", "Base case → \"\"."),
        ("s = \"x\"", "Single char → \"x\"."),
    ],
    pitfalls=[
        "Forgetting the base case.",
        "Appending the first char at the front instead of the end.",
    ],
    interviewer_intent=dict(
        testing="Whether you can reverse recursively and reason about its cost.",
        common_mistake="Wrong placement of the head, or missing base case.",
        to_stand_out="Note the O(n) in-place two-pointer swap as the efficient alternative.",
    ),
    clarifying=[
        ("Recursion required?", "Yes for this version; the swap is the efficient O(n) form."),
    ],
    followups=[
        dict(title="Reverse a String", slug="reverse-string", hint="Iterative two-pointer swap, O(n)."),
    ],
    remember_add=dict(
        formula="reverse(s) = len<=1 ? s : reverse(s[1:]) + s[0]",
        when_to_use=["Recursion practice on strings"],
        anti_signals=["Performance matters — swap in place"],
    ),
)

E(
    "power-recursion",
    deep_explanation=(
        "Compute xⁿ recursively. The naive form xⁿ = x · xⁿ⁻¹ is O(n); the smart form "
        "is **exponentiation by squaring**: xⁿ = (x^(n/2))², times an extra x when n is "
        "odd — O(log n).\n\n"
        "**Why squaring is O(log n).** Each call halves the exponent (`n/2`), so the "
        "recursion depth is log₂(n). For n = 10⁶ that's ~20 multiplications instead of a "
        "million.\n\n"
        "**Compute the half-power ONCE.** The critical detail: store `half = power(x, "
        "n/2)` in a variable and use `half*half`. Writing `power(x,n/2)*power(x,n/2)` "
        "makes two recursive calls and destroys the speedup, collapsing back to O(n).\n\n"
        "**The odd correction.** When n is odd, n/2 (integer) loses the half-step, so "
        "multiply the squared result by an extra x. Base case x⁰ = 1. This squaring "
        "trick is the engine behind modular exponentiation in crypto/hashing."
    ),
    hints=[
        "x^n = x · x^(n-1) is O(n) — can halving the exponent help?",
        "x^n = (x^(n/2))²; compute the half-power only ONCE.",
        "Add a ×x correction when n is odd; base case x⁰ = 1.",
    ],
    complexity_reasoning="halving the exponent each call gives log₂(n) depth with O(1) work per call.",
    dry_run=dict(
        input="x = 2, n = 10",
        intro="Square the half-power.",
        steps=[
            ("n=10", "half=power(2,5)", "even"),
            ("n=5", "half=power(2,2), odd ×2", "..."),
            ("combine", "square and correct", "1024"),
        ],
        result="1024",
    ),
    edge_cases=[
        ("x = 5, n = 0", "Base case → 1."),
        ("x = 3, n = 3", "Odd correction → 27."),
        ("x = 2, n = 10", "~4 calls, not 10."),
    ],
    pitfalls=[
        "Calling power(x, n/2) twice (loses the O(log n) gain).",
        "Missing the odd-exponent correction.",
    ],
    interviewer_intent=dict(
        testing="Whether you know exponentiation by squaring, not just the linear recurrence.",
        common_mistake="Double recursive call, or forgetting the odd ×x.",
        to_stand_out="Generalise to modular exponentiation (take % mod each multiply).",
    ),
    clarifying=[
        ("Non-negative exponent?", "Assuming n ≥ 0; negative n means 1/xⁿ as a double."),
    ],
    common_mistakes_detailed=[
        dict(
            title="Recomputing the half-power",
            why="power(x,n/2)*power(x,n/2) makes two recursive calls, doubling work each level back to O(n).",
            lang="java",
            bad="return power(x,n/2) * power(x,n/2);   // O(n)",
            good="long h = power(x,n/2); return h*h;    // O(log n)",
        ),
    ],
    followups=[
        dict(title="Power of a Number", slug="power-of-number", hint="The iterative binary-exponentiation version."),
        dict(title="Pow(x, n)", slug="powx-n", hint="Handle negative exponents and doubles.", leetcodeNumber=50),
    ],
    remember_add=dict(
        formula="h=power(x,n/2); res = h*h * (n odd ? x : 1)",
        when_to_use=["Fast exponentiation", "Modular power"],
    ),
)

E(
    "sum-digits-recursion",
    deep_explanation=(
        "sum(n) = n%10 + sum(n/10), base case sum(0) = 0 — the digit-peeling idiom "
        "expressed recursively.\n\n"
        "**Why %10 and /10.** `n % 10` is the last digit (added now); `n / 10` removes "
        "it (the smaller subproblem). Each call shortens the number by one digit until "
        "nothing is left, so the recursion depth equals the digit count.\n\n"
        "**Why base case n == 0, not n == 1.** When n reaches 0 there are no digits "
        "left to add, so it contributes 0. Stopping at 1 would mishandle numbers ending "
        "in 0 and the input 0 itself.\n\n"
        "**Negatives.** If negatives are allowed, take the absolute value first — the "
        "sign isn't a digit. Depth is small (≤ ~10 for ints), so stack isn't a "
        "concern here."
    ),
    hints=[
        "What's the last digit, and what's 'the rest'?",
        "sum(n) = n%10 + sum(n/10).",
        "Which n is the base case — 0 or 1?",
    ],
    complexity_reasoning="one call per digit (≈ log10 n), each O(1).",
    dry_run=dict(
        input="n = 1234",
        intro="Peel the last digit each call.",
        steps=[
            ("1234", "4 + sum(123)", "waits"),
            ("123", "3 + sum(12)", "..."),
            ("base", "sum(0)=0", "unwind 1+2+3+4"),
        ],
        result="10",
    ),
    edge_cases=[
        ("n = 0", "Base case → 0."),
        ("n = 9", "9 + sum(0) = 9."),
        ("n = 100", "1 + 0 + 0 = 1."),
    ],
    pitfalls=[
        "Negative inputs not handled (take abs first if allowed).",
        "Base case at n == 1 instead of n == 0.",
    ],
    interviewer_intent=dict(
        testing="Whether you apply the digit idiom recursively with the right base case.",
        common_mistake="Wrong base case, or mishandling trailing zeros/negatives.",
        to_stand_out="Mention the digital-root follow-up (repeat until one digit).",
    ),
    clarifying=[
        ("Can n be negative?", "I'd take abs first; the sign isn't a digit."),
    ],
    followups=[
        dict(title="Sum of Digits", slug="sum-of-digits", hint="The iterative loop version."),
        dict(title="Add Digits (digital root)", slug="add-digits", hint="Repeat the digit-sum to one digit.", leetcodeNumber=258),
    ],
    remember_add=dict(
        formula="sum(n) = n==0 ? 0 : n%10 + sum(n/10)",
        when_to_use=["Digit aggregation recursively"],
    ),
)

E(
    "print-n-to-1-recursion",
    deep_explanation=(
        "Print n down to 1 by emitting n **before** recursing on n−1. The order of the "
        "'visit' relative to the recursive call decides ascending vs descending — the "
        "core lesson.\n\n"
        "**Pre-order vs post-order.** Doing the work *before* the recursive call "
        "(pre-order) prints n first, then n−1, …, giving descending order. Doing it "
        "*after* (post-order) prints the deepest value first, giving ascending 1..n. "
        "Swapping two lines flips the entire output — a powerful demonstration of how "
        "the call stack sequences work.\n\n"
        "**Why this matters broadly.** The same pre/post-order distinction governs tree "
        "traversals (visit node before vs after children). Internalising it here pays "
        "off on trees later.\n\n"
        "**Base case** n < 1 stops the descent; depth is O(n)."
    ),
    hints=[
        "Emit n before or after the recursive call — which gives descending?",
        "Visit-then-recurse = descending; recurse-then-visit = ascending.",
        "Base case stops at n < 1.",
    ],
    complexity_reasoning="n calls, each emitting one value, with O(n) stack depth.",
    dry_run=dict(
        input="n = 3",
        intro="Visit n, then recurse (pre-order).",
        steps=[
            ("n=3", "emit 3, recurse(2)", "\"3\""),
            ("n=2", "emit 2, recurse(1)", "\"3 2\""),
            ("n=1", "emit 1, recurse(0)", "\"3 2 1\""),
        ],
        result="\"3 2 1\"",
    ),
    edge_cases=[
        ("n = 1", "\"1\"."),
        ("n = 5", "\"5 4 3 2 1\"."),
    ],
    pitfalls=[
        "Recursing before appending (prints ascending).",
        "Missing base case n < 1.",
    ],
    interviewer_intent=dict(
        testing="Whether you understand how pre- vs post-order placement controls output order.",
        common_mistake="Wrong visit/recurse order, or no base case.",
        to_stand_out="Connect pre/post-order here to tree traversal order.",
    ),
    clarifying=[
        ("Descending or ascending?", "Descending here — visit before recursing; swapping flips it."),
    ],
    followups=[
        dict(title="Print 1 to N", slug="print-1-to-n", hint="Ascending — the iterative version."),
    ],
    remember_add=dict(
        formula="visit(n); rec(n-1)  -> descending   (swap -> ascending)",
        when_to_use=["Understanding pre/post-order recursion"],
    ),
)

E(
    "gcd-recursion",
    deep_explanation=(
        "Euclid's algorithm expressed recursively: gcd(a, b) = gcd(b, a mod b), with "
        "base case gcd(a, 0) = a.\n\n"
        "**Why mod-reduction preserves the GCD.** Any common divisor of a and b also "
        "divides a mod b (= a − ⌊a/b⌋·b), and vice versa, so the pair (a, b) and (b, a "
        "mod b) share the same set of common divisors — hence the same greatest one. "
        "Each step shrinks the numbers fast.\n\n"
        "**Why the base case is b == 0.** Every integer divides 0, so gcd(a, 0) = a. "
        "When the remainder reaches 0, the previous divisor is the answer, which the "
        "recursion returns automatically.\n\n"
        "**Why O(log) depth.** The remainder at least halves every two steps, so the "
        "recursion bottoms out in logarithmic depth — far fewer calls than testing "
        "divisors. LCM follows immediately: lcm(a,b) = a/gcd·b."
    ),
    hints=[
        "Express gcd(a,b) using b and the remainder a mod b.",
        "What pair makes the recursion stop?",
        "Why does replacing a with a mod b keep the GCD the same?",
    ],
    complexity_reasoning="the remainder shrinks geometrically, so O(log min(a,b)) recursive calls.",
    dry_run=dict(
        input="a = 48, b = 18",
        intro="gcd(b, a mod b) each call.",
        steps=[
            ("gcd(48,18)", "→ gcd(18,12)", "12"),
            ("gcd(18,12)", "→ gcd(12,6)", "6"),
            ("gcd(12,6)", "→ gcd(6,0)", "b=0"),
        ],
        result="6",
    ),
    edge_cases=[
        ("a = 7, b = 0", "Base case → 7."),
        ("a = 5, b = 1", "Coprime → 1."),
        ("a = 0, b = 5", "First call swaps to gcd(5, 0) → 5."),
    ],
    pitfalls=[
        "Swapping the arguments wrongly (gcd(a % b, b) loops).",
        "Dividing by zero by mishandling b == 0.",
    ],
    interviewer_intent=dict(
        testing="Whether you know Euclid recursively and justify the mod-reduction invariant.",
        common_mistake="Wrong argument order, or a broken base case.",
        to_stand_out="Derive LCM from this and note the O(log) convergence.",
    ),
    clarifying=[
        ("Either argument can be 0?", "Yes — gcd(a, 0) = a is the base case (not both 0)."),
    ],
    followups=[
        dict(title="GCD of Two Numbers", slug="gcd-of-two-numbers", hint="The iterative loop version."),
        dict(title="LCM of Two Numbers", slug="lcm-of-two-numbers", hint="a / gcd * b, reusing this."),
    ],
    remember_add=dict(
        formula="gcd(a,b) = b==0 ? a : gcd(b, a%b)",
        when_to_use=["GCD/LCM", "Fraction reduction"],
    ),
)


# ─────────────────────────────────────────────────────────────────────────────
# Wave 5b — Bit Tricks & Misc (10)
# ─────────────────────────────────────────────────────────────────────────────

E(
    "power-of-two",
    deep_explanation=(
        "A power of two has **exactly one set bit** (1, 10, 100, 1000 in binary). The "
        "trick `n & (n - 1) == 0` (with `n > 0`) tests precisely that.\n\n"
        "**Why `n & (n-1)` clears the lowest set bit.** Subtracting 1 flips the lowest "
        "set bit to 0 and turns all bits below it to 1 (e.g. 1000 − 1 = 0111). ANDing "
        "the two leaves every bit unset *if and only if* there was a single set bit. So "
        "for a power of two the result is 0; for anything with ≥2 set bits it's "
        "non-zero.\n\n"
        "**Why the `n > 0` guard.** 0 has no set bits and would pass `n & (n-1) == 0` "
        "falsely; negative numbers (two's complement) have many set bits but also need "
        "excluding. The positivity check rules both out.\n\n"
        "**Why bits beat a divide loop.** Repeatedly dividing by 2 works but is O(log "
        "n) and misses the elegant single-operation insight that interviewers probe."
    ),
    hints=[
        "What's special about a power of two in binary?",
        "What does `n & (n - 1)` do to the lowest set bit?",
        "Which non-powers slip through without an `n > 0` guard?",
    ],
    complexity_reasoning="a single subtraction and AND — constant time.",
    dry_run=dict(
        input="n = 16, then n = 6",
        intro="Clear the lowest set bit.",
        steps=[
            ("16 = 10000", "16 & 15 = 10000 & 01111", "0 → power of two"),
            ("6 = 110", "6 & 5 = 110 & 101", "100 ≠ 0 → not"),
        ],
        result="16 → true, 6 → false",
    ),
    edge_cases=[
        ("n = 1", "2⁰ = 1, one set bit → true."),
        ("n = 0", "Guarded out by n > 0 → false."),
        ("n = -8", "Negative → false."),
    ],
    pitfalls=[
        "Forgetting `n > 0`, so 0 wrongly returns true.",
        "Using a loop dividing by 2 (works but misses the bit insight).",
    ],
    interviewer_intent=dict(
        testing="Whether you know the n & (n-1) bit trick and guard the edge cases.",
        common_mistake="Missing the n > 0 guard, letting 0 pass.",
        to_stand_out="Explain why n & (n-1) clears the lowest set bit; it also powers bit-counting.",
    ),
    clarifying=[
        ("Is 1 a power of two?", "Yes, 2⁰ = 1."),
        ("Can n be 0 or negative?", "Both are not powers of two — the n > 0 guard handles them."),
    ],
    common_mistakes_detailed=[
        dict(
            title="Missing the n > 0 guard",
            why="0 & (0-1) == 0 is true, so without the guard zero is wrongly reported as a power of two.",
            lang="java",
            bad="return (n & (n - 1)) == 0;          // 0 -> true (WRONG)",
            good="return n > 0 && (n & (n - 1)) == 0;",
        ),
    ],
    followups=[
        dict(title="Count Set Bits", slug="count-set-bits", hint="Same n & (n-1) trick, counting iterations."),
        dict(title="Power of Two", slug="power-of-two-lc", hint="LeetCode version.", leetcodeNumber=231),
    ],
    remember_add=dict(
        formula="n > 0 && (n & (n-1)) == 0",
        when_to_use=["Single-bit / power-of-two checks"],
        anti_signals=["Forgetting to exclude 0 and negatives"],
    ),
)

E(
    "count-set-bits",
    deep_explanation=(
        "Count the 1-bits (Hamming weight) with **Brian Kernighan's algorithm**: "
        "repeatedly do `n &= (n - 1)`, which clears the lowest set bit, and count how "
        "many times until n is 0.\n\n"
        "**Why the iteration count equals the bit count.** Each `n &= (n-1)` removes "
        "exactly one set bit (the lowest), so the loop runs once per 1-bit. For a sparse "
        "number this is far fewer iterations than checking all 32 bits.\n\n"
        "**Why it beats the naive 32-iteration scan.** A loop that tests each of the 32 "
        "bit positions always does 32 iterations; Kernighan's does only as many as there "
        "are set bits — e.g. 1 iteration for a power of two.\n\n"
        "**Built-ins exist** (`Integer.bitCount`, `bin(n).count('1')`), but the "
        "Kernighan loop is the algorithm interviewers want to see and explains the "
        "clear-lowest-bit idiom."
    ),
    hints=[
        "What does `n & (n-1)` remove each time?",
        "Count how many times you can clear a bit before n is 0.",
        "Why is this better than checking all 32 bit positions?",
    ],
    complexity_reasoning="one iteration per set bit (≤ 32), each O(1).",
    dry_run=dict(
        input="n = 7 (111)",
        intro="Clear lowest set bit each step.",
        steps=[
            ("111", "& 110 = 110", "count=1"),
            ("110", "& 101 = 100", "count=2"),
            ("100", "& 011 = 000", "count=3"),
        ],
        result="3",
    ),
    edge_cases=[
        ("n = 8 (1000)", "One set bit → 1."),
        ("n = 0", "No set bits → 0."),
        ("n = 2^31-1", "All low 31 bits set → 31."),
    ],
    pitfalls=[
        "Looping a fixed 32 times unnecessarily.",
        "Infinite loop if you forget to update n.",
    ],
    interviewer_intent=dict(
        testing="Whether you know Kernighan's clear-lowest-bit loop.",
        common_mistake="A fixed 32-iteration scan, or forgetting to update n.",
        to_stand_out="Explain why iterations equal set bits; mention Integer.bitCount as the library option.",
    ),
    clarifying=[
        ("Signed or unsigned / negative inputs?", "For negatives I'd use the unsigned/long form or a fixed-width loop."),
    ],
    followups=[
        dict(title="Number of 1 Bits", slug="number-of-1-bits", hint="The LeetCode Hamming-weight version.", leetcodeNumber=191),
        dict(title="Power of Two", slug="power-of-two", hint="Set-bit count of exactly 1."),
    ],
    remember_add=dict(
        formula="count=0; while n: n &= n-1; count++",
        when_to_use=["Hamming weight", "Bit-set counting"],
    ),
)

E(
    "is-bit-set",
    deep_explanation=(
        "Test whether bit k (0-indexed from the LSB) is 1 by building a single-bit "
        "**mask** `1 << k` and ANDing it with n: a non-zero result means the bit was "
        "set.\n\n"
        "**Why `1 << k`.** Shifting 1 left by k positions yields a number with a single "
        "1 at position k (e.g. `1 << 2` = 100). ANDing n with this mask zeroes every "
        "other bit, isolating bit k.\n\n"
        "**Why compare `!= 0`, not `== 1`.** For k > 0 the isolated bit's *value* is 2ᵏ, "
        "not 1 — so `(n & mask) == 1` is wrong for any k > 0. Test `!= 0`. The "
        "equivalent `(n >> k) & 1 == 1` shifts the bit down to position 0 first, where "
        "`== 1` is valid.\n\n"
        "This masking idiom is the foundation for setting (`n | mask`), clearing (`n & "
        "~mask`), and toggling (`n ^ mask`) bits."
    ),
    hints=[
        "How do you build a number with only bit k set?",
        "AND that mask with n to isolate bit k.",
        "Why is comparing to 1 wrong for k > 0?",
    ],
    complexity_reasoning="one shift and one AND — constant time.",
    dry_run=dict(
        input="n = 5 (101), k = 2",
        intro="Mask and test.",
        steps=[
            ("mask", "1 << 2 = 100", "mask=4"),
            ("AND", "101 & 100 = 100", "non-zero"),
            ("test", "!= 0", "true"),
        ],
        result="true",
    ),
    edge_cases=[
        ("n = 5, k = 0", "bit 0 of 101 is 1 → true."),
        ("n = 5, k = 1", "bit 1 is 0 → false."),
        ("n = 0, k = 3", "All bits 0 → false."),
    ],
    pitfalls=[
        "Comparing `(n & mask) == 1` instead of `!= 0` (fails for k > 0).",
        "Off-by-one in the bit position.",
    ],
    interviewer_intent=dict(
        testing="Whether you build a mask correctly and test it without the == 1 bug.",
        common_mistake="`(n & mask) == 1` failing for higher bits.",
        to_stand_out="Note set/clear/toggle all build on this mask idiom.",
    ),
    clarifying=[
        ("Is k 0-indexed from the LSB?", "Yes — bit 0 is the least significant."),
    ],
    common_mistakes_detailed=[
        dict(
            title="Comparing the masked value to 1",
            why="For k>0 the isolated bit equals 2^k, not 1, so == 1 is false even when the bit is set. Compare != 0.",
            lang="java",
            bad="return (n & (1 << k)) == 1;     // wrong for k>0",
            good="return (n & (1 << k)) != 0;",
        ),
    ],
    followups=[
        dict(title="Count Set Bits", slug="count-set-bits", hint="Counts all set bits."),
    ],
    remember_add=dict(
        formula="(n & (1<<k)) != 0   or   (n>>k)&1",
        when_to_use=["Reading a specific bit", "Bit flags / bitmasks"],
    ),
)

E(
    "swap-without-temp",
    deep_explanation=(
        "Swap two values without a third variable. The puzzle answers are the **XOR "
        "swap** (`a^=b; b^=a; a^=b`) and the arithmetic swap (add/subtract) — but the "
        "honest engineering answer is to just use a temp or tuple swap.\n\n"
        "**Why XOR swap works.** XOR is its own inverse (x ^ x = 0) and commutative. The "
        "three chained XORs algebraically exchange the values: after `a ^= b`, a holds "
        "a⊕b; then `b ^= a` makes b = b⊕(a⊕b) = a; then `a ^= b` makes a = (a⊕b)⊕a = "
        "b.\n\n"
        "**The fatal aliasing bug.** If the two operands are the *same* memory location "
        "(e.g. `swap(arr[i], arr[i])` with i == j), XOR-swap zeroes the value (x ^ x = "
        "0). A temp swap is immune. The arithmetic version can also overflow.\n\n"
        "**The senior signal.** State that in real code clarity wins: `a, b = b, a` (or "
        "a temp) is preferred unless you're in a genuinely memory-constrained context. "
        "Knowing the trick *and* when not to use it is the point."
    ),
    hints=[
        "XOR is its own inverse — can three XORs exchange two values?",
        "What breaks if both operands are the same memory cell?",
        "What would you actually ship in production?",
    ],
    complexity_reasoning="a fixed number of operations regardless of input — constant time.",
    dry_run=dict(
        input="a = 3, b = 7",
        intro="Three chained XORs.",
        steps=[
            ("a ^= b", "a = 3^7", "a=4(=011^111)"),
            ("b ^= a", "b = 7^(3^7)=3", "b=3"),
            ("a ^= b", "a = (3^7)^3=7", "a=7"),
        ],
        result="[7, 3]",
    ),
    edge_cases=[
        ("a = 0, b = 5", "Swaps to [5, 0]."),
        ("a = 4, b = 4", "Equal values stay [4, 4]."),
        ("same memory cell", "XOR-swap would zero it — use a temp."),
    ],
    pitfalls=[
        "XOR-swapping a variable with itself (same memory) zeroes it.",
        "Arithmetic swap overflowing for large values.",
    ],
    interviewer_intent=dict(
        testing="Whether you know the trick AND its pitfalls/when to avoid it.",
        common_mistake="Ignoring the same-location aliasing bug or overflow.",
        to_stand_out="Recommend a temp/tuple swap for clarity; reserve XOR for constrained contexts.",
    ),
    clarifying=[
        ("Is a temp truly disallowed?", "If so I'll XOR-swap and guard against same-location aliasing."),
    ],
    followups=[
        dict(title="Reverse an Array", slug="reverse-array", hint="Swapping pairs (use a temp) in place."),
    ],
    remember_add=dict(
        formula="a^=b; b^=a; a^=b   (prefer: a,b = b,a)",
        when_to_use=["In-place swap puzzles"],
        anti_signals=["Same memory location — XOR-swap zeroes it"],
    ),
)

E(
    "odd-occurring-number",
    deep_explanation=(
        "Every value appears an even number of times except one. **XOR all elements** "
        "together: even occurrences cancel to 0, leaving the odd-count value. O(n) time, "
        "O(1) space.\n\n"
        "**Why XOR cancels even occurrences.** XOR has two key properties: x ^ x = 0 "
        "(a value XOR'd with itself vanishes) and x ^ 0 = x. A value appearing an even "
        "number of times pairs up and cancels to 0; the value appearing an odd number "
        "of times has one un-cancelled copy left. XOR is also commutative/associative, "
        "so order doesn't matter.\n\n"
        "**Why XOR beats a hash map.** A frequency map also works but costs O(n) extra "
        "space. The XOR fold needs a single accumulator — O(1) space — which is the "
        "answer the interviewer is after.\n\n"
        "**Seed at 0.** Start the accumulator at 0 (the XOR identity) so the first "
        "element folds in cleanly."
    ),
    hints=[
        "What property of XOR makes pairs disappear?",
        "Fold all elements with XOR — what survives?",
        "Can you do it without a hash map (O(1) space)?",
    ],
    complexity_reasoning="one XOR per element with a single accumulator — O(n) time, O(1) space.",
    dry_run=dict(
        input="nums = [1, 2, 1, 2, 3]",
        intro="XOR everything; pairs cancel.",
        steps=[
            ("1^2^1^2", "the two 1s and 2s cancel", "0"),
            ("^3", "0 ^ 3", "3"),
        ],
        result="3",
    ),
    edge_cases=[
        ("nums = [4, 4, 7]", "4s cancel → 7."),
        ("nums = [9]", "Single element → 9."),
    ],
    pitfalls=[
        "Using a hash map (O(n) space) when XOR is O(1).",
        "Initialising the accumulator to something other than 0.",
    ],
    interviewer_intent=dict(
        testing="Whether you know the XOR-cancellation trick for O(1) space.",
        common_mistake="Reaching for a frequency map instead of XOR.",
        to_stand_out="State the x^x=0 / x^0=x properties that make it work.",
    ),
    clarifying=[
        ("Exactly one odd-count element?", "Yes; multiple would need a different XOR partition trick."),
    ],
    followups=[
        dict(title="Single Number", slug="single-number-xor", hint="The 'appears twice except one' twin."),
        dict(title="Single Number III", slug="single-number-iii", hint="Two odd-count values — partition by a differing bit.", leetcodeNumber=260),
    ],
    remember_add=dict(
        formula="x = 0; for v: x ^= v; return x",
        when_to_use=["Odd-count / unpaired element", "Pairing cancellation"],
    ),
)

E(
    "decimal-to-binary",
    deep_explanation=(
        "Convert a non-negative integer to its binary string by **repeated division by "
        "2**: each `n % 2` is the next bit (least significant first) and `n / 2` shrinks "
        "the number. Collect the bits and reverse.\n\n"
        "**Why bits come out LSB-first.** The first remainder is the units (2⁰) bit, the "
        "next is the 2¹ bit, etc. — so you generate the binary digits in reverse order. "
        "Reverse the collected bits (or prepend each) to get the conventional MSB-first "
        "string.\n\n"
        "**Why handle 0 explicitly.** For n = 0 the `while (n > 0)` loop never runs and "
        "would return an empty string; the convention is \"0\", so special-case it.\n\n"
        "**General base conversion.** The same mod-then-divide scheme converts to any "
        "base (use base b instead of 2). Built-ins exist (`Integer.toBinaryString`, "
        "`bin(n)`) but the algorithm is the point."
    ),
    hints=[
        "What does n % 2 give you, and in which order?",
        "Collect remainders, then reverse (or prepend).",
        "What must you return for n = 0?",
    ],
    complexity_reasoning="one division per bit (≈ log₂ n), producing a string of that length.",
    dry_run=dict(
        input="n = 5",
        intro="Remainders are bits, LSB first.",
        steps=[
            ("5 % 2", "1, n=2", "bits: 1"),
            ("2 % 2", "0, n=1", "bits: 10"),
            ("1 % 2", "1, n=0", "bits: 101 (reversed)"),
        ],
        result="\"101\"",
    ),
    edge_cases=[
        ("n = 0", "Special-cased → \"0\"."),
        ("n = 8", "→ \"1000\"."),
        ("n = 1", "→ \"1\"."),
    ],
    pitfalls=[
        "Returning empty string for n == 0.",
        "Forgetting to reverse the collected bits.",
    ],
    interviewer_intent=dict(
        testing="Whether you know the repeated-division base-conversion and handle 0/ordering.",
        common_mistake="Empty string for 0, or not reversing.",
        to_stand_out="Generalise the scheme to any base.",
    ),
    clarifying=[
        ("Fixed width or minimal?", "Minimal with no leading zeros; padding is a small change."),
    ],
    followups=[
        dict(title="Binary to Decimal", slug="binary-to-decimal", hint="The inverse via Horner's method."),
    ],
    remember_add=dict(
        formula="while n>0: bits.append(n%2); n//=2; reverse  (handle 0)",
        when_to_use=["Base conversion to base b"],
    ),
)

E(
    "binary-to-decimal",
    deep_explanation=(
        "Convert a binary string to its integer value with **Horner's method**: scan "
        "left to right, and for each bit do `result = result * 2 + bit`.\n\n"
        "**Why Horner's rule works.** Reading MSB-first, each new bit means the existing "
        "value shifts left one place (×2, like appending a binary digit) and the new "
        "bit is added in the units place. This evaluates the polynomial b₀·2ᵏ + … + bₖ "
        "without ever computing explicit powers of two — it's the same scheme as parsing "
        "a decimal number, just base 2.\n\n"
        "**Why not pow(2, i) per digit.** Computing a power for each position is slower "
        "and more overflow-prone; Horner's needs only one multiply-add per bit.\n\n"
        "**Char-to-int.** Convert each character with `c - '0'` to get 0 or 1; forgetting "
        "this and using the char's ASCII code is a common slip."
    ),
    hints=[
        "Process bits left to right — how does the running value change per bit?",
        "result = result * 2 + bit avoids explicit powers of two.",
        "Convert the char '0'/'1' to its int value.",
    ],
    complexity_reasoning="one multiply-add per character — linear in the string length.",
    dry_run=dict(
        input="s = \"101\"",
        intro="Double and add each bit.",
        steps=[
            ("'1'", "0*2 + 1", "result=1"),
            ("'0'", "1*2 + 0", "result=2"),
            ("'1'", "2*2 + 1", "result=5"),
        ],
        result="5",
    ),
    edge_cases=[
        ("s = \"1000\"", "→ 8."),
        ("s = \"0\"", "→ 0."),
        ("s = \"1111\"", "→ 15."),
    ],
    pitfalls=[
        "Computing pow(2, i) per digit (slower, overflow-prone).",
        "Not converting the char '0'/'1' to its int value.",
    ],
    interviewer_intent=dict(
        testing="Whether you use Horner's method instead of per-digit powers.",
        common_mistake="Power-per-digit, or using the raw char code.",
        to_stand_out="Note it's the same scheme as decimal parsing, generalising to any base.",
    ),
    clarifying=[
        ("Could the value overflow?", "For long strings I'd use long/BigInteger; here it fits in int."),
    ],
    followups=[
        dict(title="Decimal to Binary", slug="decimal-to-binary", hint="The inverse via repeated division."),
    ],
    remember_add=dict(
        formula="result = 0; for c: result = result*2 + (c-'0')",
        when_to_use=["Parsing numbers in any base"],
    ),
)

E(
    "even-using-bitwise",
    deep_explanation=(
        "Decide parity with the **lowest bit**: `n & 1` is 0 for even numbers and 1 for "
        "odd, so `(n & 1) == 0` tests evenness without the modulo operator.\n\n"
        "**Why the last bit decides parity.** In binary, every bit above position 0 "
        "contributes a multiple of 2 (always even). Only the 2⁰ bit can make a number "
        "odd. ANDing with 1 keeps just that bit, so the result *is* the parity.\n\n"
        "**Why it's safer than `%` for negatives.** In Java/C++ `n % 2` can be -1 for "
        "negative odd numbers, which trips up `== 1` checks. `n & 1` reads the actual "
        "low bit and is 1 for negative odds too (two's complement), so the parity test "
        "is robust.\n\n"
        "**Performance.** A single AND is as cheap as it gets — equivalent to `% 2` but "
        "the question specifically asks for the bitwise form."
    ),
    hints=[
        "Which single bit determines whether a number is even or odd?",
        "AND with 1 to isolate it.",
        "Why is this more robust than `% 2` for negatives?",
    ],
    complexity_reasoning="one bitwise AND — constant time.",
    dry_run=dict(
        input="n = 7, then n = 4",
        intro="Read the lowest bit.",
        steps=[
            ("7 & 1", "111 & 001 = 1", "odd"),
            ("4 & 1", "100 & 001 = 0", "even"),
        ],
        result="7 → false, 4 → true",
    ),
    edge_cases=[
        ("n = 0", "0 & 1 = 0 → even."),
        ("n = -3", "Low bit 1 → odd (robust for negatives)."),
        ("n = -4", "Low bit 0 → even."),
    ],
    pitfalls=[
        "Using `n % 2 == 0` when the question asks for bitwise.",
        "Assuming negatives behave like `%` (they don't always).",
    ],
    interviewer_intent=dict(
        testing="Whether you know parity lives in the low bit and why AND is robust.",
        common_mistake="Falling back to modulo, or the negative-modulo trap.",
        to_stand_out="Explain why only the 2⁰ bit affects parity.",
    ),
    clarifying=[
        ("Bitwise required?", "Yes — I use n & 1 rather than % 2."),
    ],
    followups=[
        dict(title="Even or Odd", slug="even-or-odd", hint="The modulo phrasing of the same test."),
        dict(title="Check If a Bit Is Set", slug="is-bit-set", hint="Generalises to any bit position."),
    ],
    remember_add=dict(
        formula="(n & 1) == 0  -> even",
        when_to_use=["Parity without modulo", "Bit-level checks"],
    ),
)

E(
    "single-number-xor",
    deep_explanation=(
        "Every element appears twice except one. **XOR the whole array**: paired values "
        "cancel (x ^ x = 0), leaving the unique element. O(n) time, O(1) space — the "
        "textbook solution.\n\n"
        "**Why XOR isolates the loner.** XOR is commutative and associative, so you can "
        "reorder the fold freely; each duplicated pair XORs to 0, and 0 ^ (unique) = "
        "unique. The order of elements is irrelevant.\n\n"
        "**Why it beats the hash-set approach.** A set/map that adds-and-removes seen "
        "values also finds the single number but uses O(n) extra space. The XOR fold "
        "uses one accumulator — O(1). Sorting then scanning pairs is O(n log n). XOR "
        "wins on both axes.\n\n"
        "The interviewer is specifically checking whether you reach for XOR-cancellation "
        "rather than a HashSet."
    ),
    hints=[
        "What happens when you XOR a value with itself?",
        "Fold the array with XOR — what's left?",
        "Can you avoid the O(n) space of a hash set?",
    ],
    complexity_reasoning="one XOR per element, single accumulator → O(n) time, O(1) space.",
    dry_run=dict(
        input="nums = [2, 3, 2]",
        intro="Pairs cancel under XOR.",
        steps=[
            ("0 ^ 2", "", "2"),
            ("^ 3", "", "1 (2^3)"),
            ("^ 2", "the 2s cancel", "3"),
        ],
        result="3",
    ),
    edge_cases=[
        ("nums = [1, 1, 4]", "1s cancel → 4."),
        ("nums = [9]", "Single element → 9."),
    ],
    pitfalls=[
        "Using O(n) extra space with a hash set.",
        "Sorting first (O(n log n)) when XOR is O(n)/O(1).",
    ],
    interviewer_intent=dict(
        testing="Whether you apply XOR cancellation for the O(1)-space solution.",
        common_mistake="Defaulting to a HashSet or sort.",
        to_stand_out="State the XOR properties and extend to Single Number II/III variants.",
    ),
    clarifying=[
        ("Exactly one single, rest in pairs?", "Yes; three-times or two-singles variants need a different approach."),
    ],
    followups=[
        dict(title="Single Number", slug="single-number", hint="LeetCode 136 — same XOR fold.", leetcodeNumber=136),
        dict(title="Odd-Occurring Number", slug="odd-occurring-number", hint="Generalises to odd counts."),
    ],
    remember_add=dict(
        formula="x = 0; for v: x ^= v; return x",
        when_to_use=["Unpaired element", "XOR cancellation"],
        anti_signals=["Element appears 3× — XOR alone won't isolate it"],
    ),
)

E(
    "celsius-to-fahrenheit",
    deep_explanation=(
        "Apply the formula F = c × 9/5 + 32. There's no algorithm — the interview signal "
        "is **numeric care**, specifically avoiding integer-division truncation.\n\n"
        "**Why `9/5` is the trap.** In integer arithmetic, `9 / 5` evaluates to 1 "
        "(truncated), which would turn the formula into c + 32 and corrupt every result. "
        "Use floating-point — `c * 9.0 / 5.0 + 32` — or reorder to `c * 9 / 5` so the "
        "multiplication happens before the division.\n\n"
        "**Why mention it on a 'trivial' question.** Volunteering the integer-division "
        "pitfall on an easy conversion is exactly the kind of detail that signals "
        "carefulness — the same instinct that prevents real bugs in money/units "
        "code.\n\n"
        "**Order of operations.** Multiply/divide before adding 32; the formula's "
        "structure must be preserved."
    ),
    hints=[
        "It's a direct formula — what numeric detail can still go wrong?",
        "What does `9/5` evaluate to in integer arithmetic?",
        "Use doubles or reorder so the fraction survives.",
    ],
    complexity_reasoning="a constant number of arithmetic operations.",
    dry_run=dict(
        input="c = 100",
        intro="Watch the 9/5 factor.",
        steps=[
            ("9/5 int", "= 1 (truncated)", "100+32=132 (WRONG)"),
            ("9.0/5.0", "= 1.8", "100*1.8+32"),
        ],
        result="212.0",
    ),
    edge_cases=[
        ("c = 0", "32.0 (freezing)."),
        ("c = 37", "98.6 (body temp)."),
        ("c = -40", "-40.0 (the scales meet)."),
    ],
    pitfalls=[
        "Integer `9/5` evaluating to 1.",
        "Applying the formula in the wrong order.",
    ],
    interviewer_intent=dict(
        testing="Whether you anticipate integer-division truncation in a formula.",
        common_mistake="Computing 9/5 in ints and getting 1.",
        to_stand_out="Volunteer the truncation pitfall and use floating-point.",
    ),
    clarifying=[
        ("Return a float or rounded value?", "I'll return a double; rounding is a trivial add-on."),
    ],
    followups=[
        dict(title="Average of an Array", slug="array-average", hint="Another integer-division-truncation trap."),
    ],
    remember_add=dict(
        formula="F = c * 9.0 / 5.0 + 32",
        when_to_use=["Formula evaluation with fractional factors"],
        anti_signals=["Integer 9/5 truncating to 1"],
    ),
)
