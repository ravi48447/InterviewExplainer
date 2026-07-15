#!/usr/bin/env python3
"""
Generate the "Basic 100" fresher DSA track.

Outputs:
  - content/dsa/basic-100/index.json   (the catalog driving the /dsa/basic-100 hub)
  - content/dsa/basics/<slug>.json     (one rich DSAProblem file per authored problem)

The CATALOG below lists all 100 problems so the hub is always fully populated.
PROBLEM_DATA holds the authored content; the generator only writes a problem
file when its slug is present in PROBLEM_DATA. Problems listed in the catalog
but missing from PROBLEM_DATA render as "Queued" on the hub (same UX the main
DSA library already uses for un-authored problems).

Re-run after editing: python3 scripts/generate_basic_100.py
"""

import json
import os

ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
DSA_ROOT = os.path.join(ROOT, "content", "dsa")
BASICS_DIR = os.path.join(DSA_ROOT, "basics")
CATALOG_DIR = os.path.join(DSA_ROOT, "basic-100")

LAST_UPDATED = "2026-06-01"

# ─────────────────────────────────────────────────────────────────────────────
# CATALOG — all 100 problems, grouped. Source of truth for the hub.
# Each problem: (slug, title, one_liner, pattern)
# ─────────────────────────────────────────────────────────────────────────────

GROUPS = [
    {
        "groupSlug": "numbers-math",
        "title": "Numbers & Math",
        "blurb": "The arithmetic warm-ups every fresher is asked first: digits, factors, primes, and number tricks.",
        "problems": [
            ("sum-of-two-numbers", "Sum of Two Numbers", "Add two integers and return the result.", "math"),
            ("max-of-two-numbers", "Maximum of Two Numbers", "Return the larger of two integers.", "comparison"),
            ("max-of-three-numbers", "Maximum of Three Numbers", "Return the largest of three integers.", "comparison"),
            ("even-or-odd", "Even or Odd", "Decide whether a number is even or odd.", "modulo"),
            ("sign-of-a-number", "Sign of a Number", "Report whether a number is positive, negative, or zero.", "conditionals"),
            ("leap-year", "Leap Year", "Check whether a year is a leap year.", "modulo"),
            ("sum-1-to-n", "Sum from 1 to N", "Add up every integer from 1 to N.", "math"),
            ("factorial", "Factorial of a Number", "Compute n! = 1·2·…·n.", "math"),
            ("count-digits", "Count Digits", "Count how many digits a number has.", "digit-dp"),
            ("sum-of-digits", "Sum of Digits", "Add up all the digits of a number.", "digit-dp"),
            ("reverse-a-number", "Reverse a Number", "Reverse the digits of an integer.", "digit-dp"),
            ("palindrome-number", "Palindrome Number", "Check whether a number reads the same backwards.", "digit-dp"),
            ("prime-number", "Prime Number", "Check whether a number is prime.", "math"),
            ("nth-fibonacci", "Nth Fibonacci Number", "Return the Nth number in the Fibonacci sequence.", "iteration"),
            ("gcd-of-two-numbers", "GCD of Two Numbers", "Find the greatest common divisor of two integers.", "euclid"),
            ("lcm-of-two-numbers", "LCM of Two Numbers", "Find the least common multiple of two integers.", "euclid"),
            ("power-of-number", "Power of a Number", "Compute x raised to the power n.", "math"),
            ("armstrong-number", "Armstrong Number", "Check whether a number equals the sum of its digits cubed.", "digit-dp"),
        ],
    },
    {
        "groupSlug": "arrays",
        "title": "Arrays",
        "blurb": "Single-pass scans over a list: max, min, sum, search, reverse, and the classic counting tricks.",
        "problems": [
            ("array-maximum", "Maximum in an Array", "Find the largest element in an array.", "linear-scan"),
            ("array-minimum", "Minimum in an Array", "Find the smallest element in an array.", "linear-scan"),
            ("array-sum", "Sum of Array Elements", "Add up every element of an array.", "linear-scan"),
            ("array-average", "Average of an Array", "Compute the mean of the array elements.", "linear-scan"),
            ("count-even-odd-array", "Count Even and Odd", "Count even and odd numbers in an array.", "linear-scan"),
            ("linear-search", "Linear Search", "Find the index of a target value by scanning.", "linear-scan"),
            ("reverse-array", "Reverse an Array", "Reverse the order of elements in place.", "two-pointers"),
            ("second-largest", "Second Largest Element", "Find the second largest value in one pass.", "linear-scan"),
            ("count-occurrences", "Count Occurrences", "Count how many times a value appears.", "linear-scan"),
            ("is-array-sorted", "Check If Array Is Sorted", "Decide if the array is in non-decreasing order.", "linear-scan"),
            ("sum-even-numbers-array", "Sum of Even Numbers", "Add only the even elements of an array.", "linear-scan"),
            ("find-duplicate", "Find a Duplicate", "Find an element that appears more than once.", "hash-set"),
            ("move-zeros-end", "Move Zeros to End", "Push all zeros to the end, keep order.", "two-pointers"),
            ("left-rotate-by-one", "Left Rotate by One", "Shift every element one position left.", "array"),
            ("count-positive-negative", "Count Positive and Negative", "Count positives, negatives, and zeros.", "linear-scan"),
            ("missing-number", "Missing Number", "Find the missing number in 1..n.", "math"),
            ("merge-two-sorted-arrays", "Merge Two Sorted Arrays", "Merge two sorted arrays into one.", "two-pointers"),
            ("separate-odd-even", "Separate Odd and Even", "Put odds and evens into separate lists.", "linear-scan"),
            ("max-consecutive-ones", "Max Consecutive Ones", "Longest run of 1s in a binary array.", "running-count"),
            ("distinct-elements", "Count Distinct Elements", "Count how many unique values exist.", "hash-set"),
            ("sum-of-min-and-max", "Sum of Min and Max", "Add the smallest and largest elements.", "linear-scan"),
            ("frequency-of-elements", "Frequency of Elements", "Count how often each value appears.", "hash-map"),
        ],
    },
    {
        "groupSlug": "strings",
        "title": "Strings",
        "blurb": "Character-by-character processing: reverse, count, compare, and the fresher-favourite palindrome and anagram checks.",
        "problems": [
            ("reverse-string", "Reverse a String", "Reverse the characters of a string.", "two-pointers"),
            ("palindrome-string", "Palindrome String", "Check whether a string reads the same backwards.", "two-pointers"),
            ("count-vowels-consonants", "Count Vowels and Consonants", "Count vowels and consonants in a string.", "linear-scan"),
            ("string-length", "Length of a String", "Count the characters in a string without library help.", "linear-scan"),
            ("to-uppercase", "Convert to Uppercase", "Convert every lowercase letter to uppercase.", "ascii"),
            ("to-lowercase", "Convert to Lowercase", "Convert every uppercase letter to lowercase.", "ascii"),
            ("count-words", "Count Words", "Count the words in a sentence.", "linear-scan"),
            ("valid-anagram-basic", "Valid Anagram", "Check whether two strings are anagrams.", "frequency"),
            ("char-frequency", "Character Frequency", "Count how often each character appears.", "frequency"),
            ("remove-spaces", "Remove Spaces", "Build a copy of the string without spaces.", "linear-scan"),
            ("count-character-occurrences", "Count a Character", "Count occurrences of one character.", "linear-scan"),
            ("first-non-repeating-character", "First Non-Repeating Character", "Find the first character that appears once.", "frequency"),
            ("toggle-case", "Toggle Case", "Swap the case of every letter.", "ascii"),
            ("strings-equal", "Check Strings Equal", "Compare two strings character by character.", "linear-scan"),
            ("longest-word", "Longest Word", "Return the longest word in a sentence.", "linear-scan"),
            ("remove-duplicate-characters", "Remove Duplicate Characters", "Keep only the first occurrence of each char.", "hash-set"),
            ("capitalize-words", "Capitalize Each Word", "Uppercase the first letter of every word.", "ascii"),
            ("count-upper-lower", "Count Upper and Lower", "Count uppercase and lowercase letters.", "ascii"),
            ("replace-character", "Replace a Character", "Replace every occurrence of one char with another.", "linear-scan"),
            ("reverse-words", "Reverse Words in a Sentence", "Reverse the order of words.", "string"),
            ("check-substring", "Check Substring", "Decide whether one string contains another.", "string"),
            ("count-uppercase-letters", "Count Uppercase Letters", "Count the capital letters in a string.", "ascii"),
        ],
    },
    {
        "groupSlug": "loops-patterns",
        "title": "Loops & Patterns",
        "blurb": "Pure loop control: number series, the FizzBuzz classic, and the star/number patterns asked in campus rounds.",
        "problems": [
            ("print-1-to-n", "Print 1 to N", "Print every integer from 1 to N.", "loops"),
            ("print-even-up-to-n", "Print Even Numbers", "Print all even numbers up to N.", "loops"),
            ("multiplication-table", "Multiplication Table", "Print the multiplication table of a number.", "loops"),
            ("sum-of-squares", "Sum of Squares", "Add 1² + 2² + … + n².", "loops"),
            ("fizzbuzz", "FizzBuzz", "Print Fizz, Buzz, or FizzBuzz for 1..n.", "modulo"),
            ("right-triangle-star", "Right Triangle Star Pattern", "Print a right-angled triangle of stars.", "nested-loops"),
            ("square-star-pattern", "Square Star Pattern", "Print an n×n square of stars.", "nested-loops"),
            ("pyramid-pattern", "Pyramid Star Pattern", "Print a centred pyramid of stars.", "nested-loops"),
            ("number-triangle", "Number Triangle", "Print a triangle of increasing numbers.", "nested-loops"),
            ("fibonacci-series", "Fibonacci Series", "Print the first N Fibonacci numbers.", "iteration"),
            ("multiples-of-number", "Multiples of a Number", "Print the first N multiples of a number.", "loops"),
            ("primes-up-to-n", "Primes up to N", "Print all prime numbers up to N.", "math"),
        ],
    },
    {
        "groupSlug": "search-sort",
        "title": "Searching & Sorting",
        "blurb": "The textbook algorithms every interviewer expects a fresher to code from memory.",
        "problems": [
            ("binary-search", "Binary Search", "Find a target in a sorted array in O(log n).", "binary-search"),
            ("bubble-sort", "Bubble Sort", "Sort an array by repeatedly swapping neighbours.", "sorting"),
            ("selection-sort", "Selection Sort", "Sort by repeatedly selecting the minimum.", "sorting"),
            ("insertion-sort", "Insertion Sort", "Sort by inserting each element into place.", "sorting"),
            ("count-greater-than-x", "Count Greater Than X", "Count elements strictly greater than X.", "linear-scan"),
            ("sort-0s-and-1s", "Sort 0s and 1s", "Sort a binary array in one pass.", "two-pointers"),
            ("kth-smallest", "Kth Smallest Element", "Find the Kth smallest value.", "sorting"),
            ("first-last-occurrence", "First and Last Occurrence", "Find the first and last index of a value.", "linear-scan"),
        ],
    },
    {
        "groupSlug": "recursion",
        "title": "Recursion",
        "blurb": "The same warm-ups, re-derived recursively — base case, recursive case, and the call stack.",
        "problems": [
            ("factorial-recursion", "Factorial (Recursion)", "Compute n! recursively.", "recursion"),
            ("fibonacci-recursion", "Fibonacci (Recursion)", "Compute the Nth Fibonacci recursively.", "recursion"),
            ("sum-n-recursion", "Sum 1 to N (Recursion)", "Add 1..N recursively.", "recursion"),
            ("reverse-string-recursion", "Reverse String (Recursion)", "Reverse a string recursively.", "recursion"),
            ("power-recursion", "Power (Recursion)", "Compute xⁿ recursively.", "recursion"),
            ("sum-digits-recursion", "Sum of Digits (Recursion)", "Add the digits of a number recursively.", "recursion"),
            ("print-n-to-1-recursion", "Print N to 1 (Recursion)", "Print N down to 1 recursively.", "recursion"),
            ("gcd-recursion", "GCD (Recursion)", "Find the GCD recursively with Euclid.", "recursion"),
        ],
    },
    {
        "groupSlug": "bit-misc",
        "title": "Bit Tricks & Misc",
        "blurb": "A gentle first look at binary, XOR tricks, and a couple of must-know conversions.",
        "problems": [
            ("power-of-two", "Power of Two", "Check whether a number is a power of two.", "bit-manipulation"),
            ("count-set-bits", "Count Set Bits", "Count the 1-bits in a number's binary form.", "bit-manipulation"),
            ("is-bit-set", "Check If a Bit Is Set", "Test whether the k-th bit is 1.", "bit-manipulation"),
            ("swap-without-temp", "Swap Without a Temp", "Swap two numbers without a third variable.", "bit-manipulation"),
            ("odd-occurring-number", "Odd-Occurring Number", "Find the number that appears an odd number of times.", "xor"),
            ("decimal-to-binary", "Decimal to Binary", "Convert a decimal number to binary.", "bit-manipulation"),
            ("binary-to-decimal", "Binary to Decimal", "Convert a binary string to decimal.", "bit-manipulation"),
            ("even-using-bitwise", "Even Using Bitwise", "Check even/odd with the AND operator.", "bit-manipulation"),
            ("single-number-xor", "Single Number", "Find the element that appears once using XOR.", "xor"),
            ("celsius-to-fahrenheit", "Celsius to Fahrenheit", "Convert a temperature between scales.", "math"),
        ],
    },
]

# ─────────────────────────────────────────────────────────────────────────────
# PROBLEM_DATA — authored content keyed by slug. Add entries here; re-run.
# Required keys per entry:
#   statement, understanding, examples [(in,out,expl)], constraints [..],
#   direct_answer, approach (name, time, space, idea, java, python),
#   mistakes [..], remember {pattern, rules[], takeaway}
# Optional: insight, when_to_mention, complexity_reasoning, line_java [(l,e)],
#   line_python [(l,e)], frequency
# ─────────────────────────────────────────────────────────────────────────────

PROBLEM_DATA = {}


def D(slug, **kw):
    PROBLEM_DATA[slug] = kw


# ── Numbers & Math ───────────────────────────────────────────────────────────

D(
    "sum-of-two-numbers",
    statement="Given two integers `a` and `b`, return their sum `a + b`.",
    understanding="The simplest possible function: take two numbers and add them. The only thing to watch is that the sum of two large `int` values can overflow 32-bit range.",
    examples=[("a = 3, b = 5", "8", "3 + 5 = 8."), ("a = -4, b = 10", "6", "Negatives add normally."), ("a = 0, b = 0", "0", "Zero is fine.")],
    constraints=["-10^9 ≤ a, b ≤ 10^9"],
    direct_answer="Return `a + b`. If the inputs can be near the 32-bit limit, use a 64-bit type (`long` in Java) for the result so the addition doesn't overflow.",
    approach=dict(
        name="Add directly",
        time="O(1)", space="O(1)",
        idea="There is no algorithm here — you just apply the `+` operator. The interview signal is whether you think about **overflow**: two `int` values up to ~2.1 billion can sum past the `int` ceiling, so a defensive answer returns a `long`.",
        insight="Freshers are tested less on the math and more on awareness of data-type limits. Mentioning overflow on a 'trivial' question is exactly the kind of detail that stands out.",
        java="public long sum(int a, int b) {\n    return (long) a + b;\n}",
        python="def sum_two(a: int, b: int) -> int:\n    return a + b",
    ),
    line_java=[("return (long) a + b;", "Cast one operand to long so the addition happens in 64-bit and can't overflow.")],
    mistakes=["Adding two large ints into an int and silently overflowing.", "Over-thinking a one-line problem instead of just returning the sum."],
    remember=dict(pattern="Direct arithmetic + overflow awareness", rules=["Return `a + b`.", "Widen to `long` when operands can be large.", "Python ints are unbounded — no overflow there."], takeaway="Even the simplest question rewards mentioning integer overflow."),
    frequency="high",
)

D(
    "max-of-two-numbers",
    statement="Given two integers `a` and `b`, return the larger one.",
    understanding="Compare the two values and return whichever is bigger. If they're equal, either value is the 'maximum'.",
    examples=[("a = 3, b = 5", "5", "5 > 3."), ("a = 9, b = 2", "9", "9 > 2."), ("a = 4, b = 4", "4", "Equal — return either.")],
    constraints=["-10^9 ≤ a, b ≤ 10^9"],
    direct_answer="Return `a > b ? a : b`. A single comparison decides it; ties can return either value.",
    approach=dict(
        name="Single comparison",
        time="O(1)", space="O(1)",
        idea="One comparison is all you need: if `a` is greater, return `a`, otherwise return `b`. The `>=`/`>` choice only matters for which copy you return on a tie, and since the values are equal it doesn't change the result.",
        java="public int max(int a, int b) {\n    return a > b ? a : b;\n}",
        python="def max_two(a: int, b: int) -> int:\n    return a if a > b else b",
    ),
    mistakes=["Using `if/else if` but forgetting the equal case (still works, but shows fuzzy thinking).", "Calling a library `max` when the interviewer wants to see the comparison."],
    remember=dict(pattern="Ternary comparison", rules=["`a > b ? a : b`.", "Ties can return either operand.", "Generalises to N values by folding a running max."], takeaway="Master the ternary here; you'll reuse it inside every running-max loop."),
)

D(
    "max-of-three-numbers",
    statement="Given three integers `a`, `b`, and `c`, return the largest of the three.",
    understanding="Take the max of the first two, then the max of that result with the third — a running maximum over three values.",
    examples=[("a = 3, b = 7, c = 5", "7", "7 is largest."), ("a = 9, b = 2, c = 9", "9", "Tie at the top — return 9."), ("a = -1, b = -5, c = -2", "-1", "Largest of negatives.")],
    constraints=["-10^9 ≤ a, b, c ≤ 10^9"],
    direct_answer="Fold a running maximum: `max(a, max(b, c))`. Each comparison keeps the larger value; after two comparisons you have the overall maximum.",
    approach=dict(
        name="Nested max / running max",
        time="O(1)", space="O(1)",
        idea="The maximum of three numbers is the maximum of the first and the maximum of the other two. Computing `max(b, c)` first and then comparing with `a` is the same 'running maximum' idea you'll later apply across a whole array — just unrolled for three values.",
        insight="Show the interviewer you see this as the base case of the array-maximum loop, not a special trick.",
        java="public int max3(int a, int b, int c) {\n    int m = a > b ? a : b;\n    return m > c ? m : c;\n}",
        python="def max_three(a: int, b: int, c: int) -> int:\n    m = a if a > b else b\n    return m if m > c else c",
    ),
    line_java=[("int m = a > b ? a : b;", "Larger of the first two."), ("return m > c ? m : c;", "Compare the running max with the third value.")],
    mistakes=["Writing a long chain of nested ifs that's easy to get wrong.", "Forgetting that ties don't change the answer."],
    remember=dict(pattern="Running maximum (unrolled)", rules=["`max(a, max(b, c))`.", "Each step keeps the larger value.", "This is array-max with n = 3."], takeaway="A running max scales from 3 values to a million — same fold."),
)

D(
    "even-or-odd",
    statement="Given an integer `n`, return `\"Even\"` if it is even and `\"Odd\"` if it is odd.",
    understanding="A number is even when it leaves no remainder on division by 2. The remainder operator `%` answers this in one step.",
    examples=[("n = 4", "\"Even\"", "4 % 2 == 0."), ("n = 7", "\"Odd\"", "7 % 2 == 1."), ("n = -3", "\"Odd\"", "Sign doesn't matter for parity.")],
    constraints=["-10^9 ≤ n ≤ 10^9"],
    direct_answer="Check `n % 2`. If it's 0 the number is even, otherwise odd. For negatives prefer `n % 2 == 0` (true) rather than `== 1`, since `-3 % 2` is `-1` in Java/Python.",
    approach=dict(
        name="Modulo by 2",
        time="O(1)", space="O(1)",
        idea="Dividing by 2 leaves a remainder of 0 for even numbers and ±1 for odd ones. Always test `n % 2 == 0` for evenness — testing `n % 2 == 1` is a bug for negative numbers because the remainder can be `-1`.",
        insight="The bitwise alternative `(n & 1) == 0` avoids the negative-remainder pitfall entirely and is a nice thing to mention.",
        java="public String evenOrOdd(int n) {\n    return (n & 1) == 0 ? \"Even\" : \"Odd\";\n}",
        python="def even_or_odd(n: int) -> str:\n    return \"Even\" if n % 2 == 0 else \"Odd\"",
    ),
    mistakes=["Testing `n % 2 == 1` — fails for negative odd numbers.", "Confusing `=` (assignment) with `==` (comparison)."],
    remember=dict(pattern="Parity via modulo / AND", rules=["Even ⟺ `n % 2 == 0`.", "Never test `== 1` for odd.", "`n & 1` is the safe, fast parity check."], takeaway="Always phrase parity as 'remainder is zero', never 'remainder is one'."),
)

D(
    "sign-of-a-number",
    statement="Given an integer `n`, return `1` if it is positive, `-1` if negative, and `0` if it is zero.",
    understanding="Three-way branch on the value's relationship to zero.",
    examples=[("n = 8", "1", "Positive."), ("n = -5", "-1", "Negative."), ("n = 0", "0", "Zero.")],
    constraints=["-10^9 ≤ n ≤ 10^9"],
    direct_answer="Compare `n` with 0: greater → 1, less → -1, equal → 0. Order the checks so zero is handled correctly.",
    approach=dict(
        name="Three-way comparison",
        time="O(1)", space="O(1)",
        idea="There are exactly three cases. Check `n > 0`, then `n < 0`, and let the remaining case be zero. The order doesn't matter as long as every branch is mutually exclusive.",
        java="public int sign(int n) {\n    if (n > 0) return 1;\n    if (n < 0) return -1;\n    return 0;\n}",
        python="def sign(n: int) -> int:\n    if n > 0:\n        return 1\n    if n < 0:\n        return -1\n    return 0",
    ),
    mistakes=["Forgetting the zero case and returning a wrong default.", "Using `Integer.signum`/`math.copysign` when asked to show the logic."],
    remember=dict(pattern="Three-way branch", rules=["`>0 → 1`, `<0 → -1`, else 0.", "Cover zero explicitly.", "Branches must be mutually exclusive."], takeaway="Whenever a value splits into 3 outcomes, write 3 guarded returns."),
)

D(
    "leap-year",
    statement="Given a year `y`, return whether it is a leap year. A year is a leap year if it is divisible by 4, **except** century years (divisible by 100) which must also be divisible by 400.",
    understanding="Two rules interact: every 4th year is a leap year, but every 100th year is skipped, unless it is also a 400th year.",
    examples=[("y = 2024", "true", "Divisible by 4, not a century."), ("y = 1900", "false", "Century not divisible by 400."), ("y = 2000", "true", "Century divisible by 400.")],
    constraints=["1 ≤ y ≤ 10^6"],
    direct_answer="Return `(y % 4 == 0 && y % 100 != 0) || (y % 400 == 0)`. The 400-rule overrides the 100-exception.",
    approach=dict(
        name="Boolean rule",
        time="O(1)", space="O(1)",
        idea="Translate the English rules directly into one boolean expression. A year qualifies if it's divisible by 4 and not a century, OR if it's divisible by 400 (which covers the special century case).",
        insight="Getting the precedence right between the 100 and 400 rules is the whole test — 1900 vs 2000 is the classic gotcha.",
        java="public boolean isLeap(int y) {\n    return (y % 4 == 0 && y % 100 != 0) || (y % 400 == 0);\n}",
        python="def is_leap(y: int) -> bool:\n    return (y % 4 == 0 and y % 100 != 0) or (y % 400 == 0)",
    ),
    mistakes=["Returning `y % 4 == 0` only — wrongly marks 1900 as a leap year.", "Mixing up the 100 and 400 rules."],
    remember=dict(pattern="Compound divisibility rule", rules=["Div by 4 and not by 100 → leap.", "Div by 400 → always leap.", "1900 false, 2000 true."], takeaway="When rules have exceptions-to-exceptions, encode them as one OR of ANDs."),
)

D(
    "sum-1-to-n",
    statement="Given a positive integer `n`, return the sum `1 + 2 + … + n`.",
    understanding="You can loop and accumulate, but the closed-form `n(n+1)/2` gives the answer in O(1).",
    examples=[("n = 5", "15", "1+2+3+4+5 = 15."), ("n = 1", "1", "Just 1."), ("n = 100", "5050", "Gauss's sum.")],
    constraints=["1 ≤ n ≤ 10^9"],
    direct_answer="Use the formula `n * (n + 1) / 2`. It's O(1) and beats the O(n) loop. Use a 64-bit type because `n(n+1)` overflows int for large n.",
    approach=dict(
        name="Gauss formula",
        time="O(1)", space="O(1)",
        idea="Pairing the first and last terms (1+n, 2+(n−1), …) gives n/2 pairs each summing to n+1, so the total is n(n+1)/2. This is the textbook example of replacing a loop with a closed form.",
        insight="Mention the O(n) loop, then upgrade to the formula and flag the overflow — that progression is exactly what interviewers want to hear.",
        java="public long sumToN(int n) {\n    return (long) n * (n + 1) / 2;\n}",
        python="def sum_to_n(n: int) -> int:\n    return n * (n + 1) // 2",
    ),
    line_java=[("return (long) n * (n + 1) / 2;", "Cast to long first so n*(n+1) doesn't overflow int.")],
    mistakes=["Computing `n*(n+1)` in int and overflowing.", "Using integer division before multiplication and losing precision."],
    remember=dict(pattern="Closed-form sum", rules=["`n(n+1)/2`.", "Widen to long before multiplying.", "One of the two consecutive factors is always even, so /2 is exact."], takeaway="A known closed form turns an O(n) loop into O(1)."),
)

D(
    "factorial",
    statement="Given a non-negative integer `n`, return `n! = 1 · 2 · … · n`. By definition `0! = 1`.",
    understanding="Multiply every integer from 1 to n. Factorials grow extremely fast, so the result needs a 64-bit type even for small n.",
    examples=[("n = 5", "120", "1·2·3·4·5 = 120."), ("n = 0", "1", "0! is defined as 1."), ("n = 1", "1", "1! = 1.")],
    constraints=["0 ≤ n ≤ 20  (beyond 20, n! overflows 64-bit)"],
    direct_answer="Loop from 2 to n multiplying into an accumulator that starts at 1. Use `long`; 21! already overflows 64 bits.",
    approach=dict(
        name="Iterative product",
        time="O(n)", space="O(1)",
        idea="Start an accumulator at 1 (so n = 0 returns 1 for free) and multiply it by each integer up to n. Iteration is preferred over recursion here to avoid stack overhead for large n.",
        insight="Calling out the overflow limit (20! fits in long, 21! doesn't) shows you think about ranges, not just logic.",
        java="public long factorial(int n) {\n    long result = 1;\n    for (int i = 2; i <= n; i++) {\n        result *= i;\n    }\n    return result;\n}",
        python="def factorial(n: int) -> int:\n    result = 1\n    for i in range(2, n + 1):\n        result *= i\n    return result",
    ),
    line_java=[("long result = 1;", "Identity for multiplication; also the correct answer for n = 0 and n = 1."), ("result *= i;", "Fold each factor into the running product.")],
    mistakes=["Returning 0 for n = 0 instead of 1.", "Storing the result in int and overflowing past 12!."],
    remember=dict(pattern="Iterative accumulation", rules=["Init accumulator to 1.", "Loop 2..n multiplying in.", "Use long; 21! overflows."], takeaway="Seed a product with 1 so empty/zero cases fall out naturally."),
)

D(
    "count-digits",
    statement="Given an integer `n`, return how many digits it has. Treat the count of `0` as 1, and ignore the sign of negatives.",
    understanding="Repeatedly divide by 10, counting steps until the number becomes 0. Handle 0 and negatives explicitly.",
    examples=[("n = 12345", "5", "Five digits."), ("n = 0", "1", "Zero has one digit."), ("n = -42", "2", "Sign ignored.")],
    constraints=["-10^9 ≤ n ≤ 10^9"],
    direct_answer="Work with `abs(n)`. If it's 0 return 1. Otherwise divide by 10 until it hits 0, counting each division.",
    approach=dict(
        name="Divide by 10",
        time="O(d) where d = number of digits", space="O(1)",
        idea="Integer-dividing by 10 chops off the last digit. The number of times you can do that before reaching 0 equals the digit count. Zero is the one input that needs a special return of 1, since the loop would run zero times.",
        insight="A slick alternative is `(int) Math.log10(abs(n)) + 1`, but the divide loop is safer and avoids floating-point edge cases.",
        java="public int countDigits(int n) {\n    n = Math.abs(n);\n    if (n == 0) return 1;\n    int count = 0;\n    while (n > 0) {\n        n /= 10;\n        count++;\n    }\n    return count;\n}",
        python="def count_digits(n: int) -> int:\n    n = abs(n)\n    if n == 0:\n        return 1\n    count = 0\n    while n > 0:\n        n //= 10\n        count += 1\n    return count",
    ),
    line_java=[("if (n == 0) return 1;", "The loop can't count zero, so handle it directly."), ("n /= 10;", "Strip the last digit each iteration.")],
    mistakes=["Returning 0 for input 0.", "Forgetting to take the absolute value, so the loop misbehaves on negatives."],
    remember=dict(pattern="Strip digits with /10", rules=["Use abs(n).", "Special-case 0 → 1.", "Each /10 removes one digit."], takeaway="The divide-by-10 loop is the backbone of every digit problem."),
)

D(
    "sum-of-digits",
    statement="Given a non-negative integer `n`, return the sum of its digits.",
    understanding="Peel off the last digit with `% 10`, add it, then drop it with `/ 10`, until nothing is left.",
    examples=[("n = 1234", "10", "1+2+3+4 = 10."), ("n = 0", "0", "No digits to add beyond 0."), ("n = 99", "18", "9+9 = 18.")],
    constraints=["0 ≤ n ≤ 10^9"],
    direct_answer="Loop while `n > 0`: add `n % 10` to a running total, then do `n /= 10`. The `% 10`/`/ 10` pair is the digit-extraction idiom.",
    approach=dict(
        name="Modulo and divide",
        time="O(d)", space="O(1)",
        idea="`n % 10` gives the last digit and `n / 10` removes it. Accumulating the remainders until the number is exhausted sums every digit. Starting the total at 0 makes the n = 0 case correct automatically.",
        java="public int sumDigits(int n) {\n    int sum = 0;\n    while (n > 0) {\n        sum += n % 10;\n        n /= 10;\n    }\n    return sum;\n}",
        python="def sum_digits(n: int) -> int:\n    total = 0\n    while n > 0:\n        total += n % 10\n        n //= 10\n    return total",
    ),
    line_java=[("sum += n % 10;", "Add the current last digit."), ("n /= 10;", "Remove the digit we just used.")],
    mistakes=["Swapping the order so you divide before reading the digit.", "Looping with `>= 0` and never terminating."],
    remember=dict(pattern="Digit extraction (`%10`, `/10`)", rules=["`%10` reads last digit.", "`/10` drops it.", "Loop while n > 0."], takeaway="`% 10` then `/ 10` is the two-line idiom behind reverse, sum, and palindrome of digits."),
)

D(
    "reverse-a-number",
    statement="Given an integer `n`, return the number formed by reversing its digits. Keep the sign; assume the reversed value fits in a 32-bit integer.",
    understanding="Build the reversed number digit by digit: each step shifts the accumulator left by one decimal place and appends the next last digit.",
    examples=[("n = 1234", "4321", "Digits reversed."), ("n = -120", "-21", "Sign kept; leading zero of 021 drops."), ("n = 5", "5", "Single digit unchanged.")],
    constraints=["-2^31 ≤ n ≤ 2^31 − 1"],
    direct_answer="Track the sign, work with the absolute value, and repeatedly do `rev = rev * 10 + n % 10; n /= 10`. Reapply the sign at the end.",
    approach=dict(
        name="Build reversed via *10",
        time="O(d)", space="O(1)",
        idea="`rev * 10` makes room for a new units digit, and `n % 10` supplies it. Doing this for every digit reconstructs the number back-to-front. Trailing zeros in the input naturally vanish because leading zeros aren't stored.",
        insight="In production you'd also guard against overflow before `rev * 10 + digit`; mentioning that earns credit even if the prompt promises it fits.",
        java="public int reverse(int n) {\n    int sign = n < 0 ? -1 : 1;\n    n = Math.abs(n);\n    int rev = 0;\n    while (n > 0) {\n        rev = rev * 10 + n % 10;\n        n /= 10;\n    }\n    return sign * rev;\n}",
        python="def reverse_number(n: int) -> int:\n    sign = -1 if n < 0 else 1\n    n = abs(n)\n    rev = 0\n    while n > 0:\n        rev = rev * 10 + n % 10\n        n //= 10\n    return sign * rev",
    ),
    line_java=[("rev = rev * 10 + n % 10;", "Shift the accumulator and append the next digit."), ("return sign * rev;", "Reapply the original sign.")],
    mistakes=["Losing the sign on negative inputs.", "Ignoring overflow when the reversed value can exceed int range."],
    remember=dict(pattern="Digit build-up (`rev*10 + d`)", rules=["Save sign, use abs.", "`rev = rev*10 + n%10`.", "Trailing zeros disappear."], takeaway="`acc * 10 + digit` is how you build any number left-to-right."),
)

D(
    "palindrome-number",
    statement="Given an integer `n`, return whether it reads the same forwards and backwards. Negative numbers are never palindromes.",
    understanding="Reverse the number and compare with the original. Negatives fail immediately because of the leading minus sign.",
    examples=[("n = 121", "true", "121 reversed is 121."), ("n = -121", "false", "Negatives aren't palindromes."), ("n = 10", "false", "01 ≠ 10.")],
    constraints=["-2^31 ≤ n ≤ 2^31 − 1"],
    direct_answer="If `n < 0`, return false. Otherwise reverse the digits and check equality with the original.",
    approach=dict(
        name="Reverse and compare",
        time="O(d)", space="O(1)",
        idea="A number is a palindrome exactly when reversing its digits yields the same number. Reuse the reverse-a-number idiom and compare. Negatives are rejected up front since the `-` breaks symmetry.",
        insight="A space-savvy variant reverses only half the digits, but reverse-and-compare is perfectly acceptable for a fresher answer.",
        java="public boolean isPalindrome(int n) {\n    if (n < 0) return false;\n    int original = n, rev = 0;\n    while (n > 0) {\n        rev = rev * 10 + n % 10;\n        n /= 10;\n    }\n    return rev == original;\n}",
        python="def is_palindrome(n: int) -> bool:\n    if n < 0:\n        return False\n    original, rev = n, 0\n    while n > 0:\n        rev = rev * 10 + n % 10\n        n //= 10\n    return rev == original",
    ),
    mistakes=["Treating negative numbers as palindromes.", "Comparing against `n` after the loop has already reduced it to 0 (save the original first)."],
    remember=dict(pattern="Reverse-and-compare", rules=["Reject negatives.", "Save the original before reversing.", "Palindrome ⟺ rev == original."], takeaway="Save the original value before any loop mutates it."),
)

D(
    "prime-number",
    statement="Given an integer `n`, return whether it is prime. A prime is a whole number greater than 1 with no divisors other than 1 and itself.",
    understanding="Test for any factor between 2 and √n. If none divides n, it's prime. Numbers ≤ 1 are not prime.",
    examples=[("n = 7", "true", "No divisor up to √7."), ("n = 9", "false", "9 = 3×3."), ("n = 1", "false", "1 is not prime by definition.")],
    constraints=["1 ≤ n ≤ 10^9"],
    direct_answer="Return false for n ≤ 1. Then check divisors `i` from 2 while `i*i ≤ n`; if any divides n it's composite. Stopping at √n is the key optimisation.",
    approach=dict(
        name="Trial division to √n",
        time="O(√n)", space="O(1)",
        idea="If n has a divisor larger than √n, it must also have the matching co-divisor smaller than √n. So checking up to √n is enough to rule out all factors. Use `i * i <= n` instead of computing a square root to stay in integer math.",
        insight="The √n cutoff is the whole interview point — an O(n) divisor loop is the giveaway that you haven't seen the trick.",
        java="public boolean isPrime(int n) {\n    if (n <= 1) return false;\n    for (int i = 2; (long) i * i <= n; i++) {\n        if (n % i == 0) return false;\n    }\n    return true;\n}",
        python="def is_prime(n: int) -> bool:\n    if n <= 1:\n        return False\n    i = 2\n    while i * i <= n:\n        if n % i == 0:\n            return False\n        i += 1\n    return True",
    ),
    line_java=[("if (n <= 1) return false;", "0, 1, and negatives are not prime."), ("(long) i * i <= n", "Loop only to √n; cast guards against i*i overflowing int.")],
    mistakes=["Looping all the way to n (O(n)) instead of √n.", "Marking 1 (or 0) as prime.", "`i * i` overflowing int for large n."],
    remember=dict(pattern="Trial division to √n", rules=["n ≤ 1 → not prime.", "Check i from 2 while i·i ≤ n.", "Any divisor ⟹ composite."], takeaway="Factors come in pairs around √n — never scan past it."),
)

D(
    "nth-fibonacci",
    statement="Given `n` (0-indexed), return the Nth Fibonacci number, where `F(0) = 0`, `F(1) = 1`, and `F(k) = F(k-1) + F(k-2)`.",
    understanding="Carry just the last two values and roll them forward n times — no array or recursion needed.",
    examples=[("n = 0", "0", "F(0) = 0."), ("n = 6", "8", "0,1,1,2,3,5,8."), ("n = 10", "55", "Tenth Fibonacci.")],
    constraints=["0 ≤ n ≤ 90  (F(91) overflows 64-bit)"],
    direct_answer="Iterate with two variables `a = 0`, `b = 1`, updating `(a, b) → (b, a + b)` n times. O(n) time, O(1) space — far better than naive recursion's O(2ⁿ).",
    approach=dict(
        name="Iterative two-variable roll",
        time="O(n)", space="O(1)",
        idea="Each Fibonacci number depends only on the previous two, so you never need to store the whole series. Keep `a` and `b` as the last two values and slide the window forward. This avoids the exponential blow-up of plain recursion that recomputes the same subproblems.",
        insight="Naming the recursion's O(2ⁿ) cost and then giving the O(n) loop is the standout move on this classic.",
        java="public long fib(int n) {\n    long a = 0, b = 1;\n    for (int i = 0; i < n; i++) {\n        long next = a + b;\n        a = b;\n        b = next;\n    }\n    return a;\n}",
        python="def fib(n: int) -> int:\n    a, b = 0, 1\n    for _ in range(n):\n        a, b = b, a + b\n    return a",
    ),
    line_java=[("long a = 0, b = 1;", "The first two Fibonacci numbers."), ("a = b; b = next;", "Slide the two-value window forward.")],
    mistakes=["Using naive recursion (O(2ⁿ)) and timing out.", "Off-by-one in the loop bound or returning b instead of a."],
    remember=dict(pattern="Rolling two variables", rules=["Start a=0, b=1.", "Update (a,b)→(b,a+b) n times.", "Return a."], takeaway="When state depends on the last k values, keep k variables, not an array."),
)

D(
    "gcd-of-two-numbers",
    statement="Given two non-negative integers `a` and `b` (not both zero), return their greatest common divisor.",
    understanding="The Euclidean algorithm: gcd(a, b) = gcd(b, a mod b), shrinking the pair until one becomes 0.",
    examples=[("a = 12, b = 18", "6", "Common factors: 1,2,3,6 → 6."), ("a = 7, b = 13", "1", "Coprime."), ("a = 0, b = 5", "5", "gcd(0, x) = x.")],
    constraints=["0 ≤ a, b ≤ 10^9, not both zero"],
    direct_answer="Apply Euclid: while `b != 0`, set `(a, b) = (b, a % b)`. When `b` hits 0, `a` is the GCD. O(log(min(a,b))).",
    approach=dict(
        name="Euclidean algorithm",
        time="O(log(min(a,b)))", space="O(1)",
        idea="Any common divisor of `a` and `b` also divides `a % b`, so replacing `(a, b)` with `(b, a % b)` preserves the GCD while rapidly shrinking the numbers. The process ends when the remainder is 0, leaving the GCD in `a`.",
        insight="Euclid is dramatically faster than trying every divisor — mention the log complexity.",
        java="public int gcd(int a, int b) {\n    while (b != 0) {\n        int temp = b;\n        b = a % b;\n        a = temp;\n    }\n    return a;\n}",
        python="def gcd(a: int, b: int) -> int:\n    while b:\n        a, b = b, a % b\n    return a",
    ),
    line_java=[("b = a % b; a = temp;", "Replace the pair with (b, a mod b), preserving the GCD.")],
    mistakes=["Looping over all divisors (O(min(a,b))) instead of using Euclid.", "Mishandling the gcd(x, 0) = x base case."],
    remember=dict(pattern="Euclidean reduction", rules=["gcd(a,b) = gcd(b, a%b).", "Stop when b == 0.", "Answer is the final a."], takeaway="Euclid replaces a divisor search with a handful of mod steps."),
)

D(
    "lcm-of-two-numbers",
    statement="Given two positive integers `a` and `b`, return their least common multiple.",
    understanding="LCM relates to GCD: `lcm(a, b) = a / gcd(a, b) * b`. Compute the GCD first, then combine.",
    examples=[("a = 4, b = 6", "12", "Multiples of both: 12."), ("a = 3, b = 5", "15", "Coprime → product."), ("a = 6, b = 12", "12", "12 is a multiple of 6.")],
    constraints=["1 ≤ a, b ≤ 10^6"],
    direct_answer="Use `lcm = a / gcd(a, b) * b`. Divide before multiplying to reduce overflow risk, and use `long` for the result.",
    approach=dict(
        name="LCM via GCD",
        time="O(log(min(a,b)))", space="O(1)",
        idea="The identity a·b = gcd·lcm lets you derive the LCM from the GCD. Writing it as `a / gcd * b` (divide first) keeps intermediate values smaller and avoids overflowing on the `a * b` product.",
        insight="The divide-before-multiply ordering is the subtle correctness/overflow detail interviewers look for.",
        java="public long lcm(int a, int b) {\n    return (long) a / gcd(a, b) * b;\n}\n\nprivate int gcd(int a, int b) {\n    while (b != 0) { int t = b; b = a % b; a = t; }\n    return a;\n}",
        python="from math import gcd\n\ndef lcm(a: int, b: int) -> int:\n    return a // gcd(a, b) * b",
    ),
    line_java=[("(long) a / gcd(a, b) * b", "Divide by the GCD first, then multiply, to limit overflow.")],
    mistakes=["Computing `a * b` first and overflowing.", "Forgetting LCM needs the GCD."],
    remember=dict(pattern="LCM from GCD", rules=["lcm = a/gcd·b.", "Divide before multiply.", "Reuse Euclid for gcd."], takeaway="a·b = gcd·lcm — know this identity cold."),
)

D(
    "power-of-number",
    statement="Given a base `x` and a non-negative exponent `n`, compute `xⁿ` (assume the result fits in a 64-bit integer).",
    understanding="Fast exponentiation: square the base and halve the exponent, multiplying into the result on odd bits — O(log n) instead of O(n).",
    examples=[("x = 2, n = 10", "1024", "2¹⁰ = 1024."), ("x = 5, n = 0", "1", "Anything⁰ = 1."), ("x = 3, n = 3", "27", "3³ = 27.")],
    constraints=["0 ≤ n ≤ 62, result fits in long"],
    direct_answer="Use binary exponentiation: while `n > 0`, if `n` is odd multiply the answer by `x`, then square `x` and halve `n`. O(log n).",
    approach=dict(
        name="Fast (binary) exponentiation",
        time="O(log n)", space="O(1)",
        idea="Write the exponent in binary. Squaring the base gives x¹, x², x⁴, x⁸, …; you multiply those into the result exactly where the exponent has a 1-bit. This computes xⁿ in log n multiplications instead of n.",
        insight="A simple O(n) loop is acceptable, but showing the O(log n) trick is what distinguishes a strong answer.",
        java="public long power(long x, int n) {\n    long result = 1;\n    while (n > 0) {\n        if ((n & 1) == 1) result *= x;\n        x *= x;\n        n >>= 1;\n    }\n    return result;\n}",
        python="def power(x: int, n: int) -> int:\n    result = 1\n    while n > 0:\n        if n & 1:\n            result *= x\n        x *= x\n        n >>= 1\n    return result",
    ),
    line_java=[("if ((n & 1) == 1) result *= x;", "Multiply in the current power of x when this exponent bit is set."), ("x *= x; n >>= 1;", "Move to the next squared base and next exponent bit.")],
    mistakes=["Returning 0 for n = 0 instead of 1.", "Writing an O(n) loop when O(log n) is expected."],
    remember=dict(pattern="Binary exponentiation", rules=["result starts at 1.", "Odd bit → multiply; always square base, shift n.", "O(log n) multiplications."], takeaway="Square-and-multiply turns power, modpow, and matrix power into log time."),
)

D(
    "armstrong-number",
    statement="Given a 3-digit number `n`, return whether it is an Armstrong number — equal to the sum of the cubes of its digits.",
    understanding="Extract each digit, cube it, sum the cubes, and compare with the original number.",
    examples=[("n = 153", "true", "1³+5³+3³ = 1+125+27 = 153."), ("n = 123", "false", "1+8+27 = 36 ≠ 123."), ("n = 370", "true", "27+343+0 = 370.")],
    constraints=["100 ≤ n ≤ 999"],
    direct_answer="Sum the cube of each digit (via the `%10`/`/10` idiom) and check whether it equals the original number.",
    approach=dict(
        name="Digit cubes sum",
        time="O(d)", space="O(1)",
        idea="Pull out digits one at a time, cube each, and accumulate. The original value must be saved first because the extraction loop destroys it. Compare the cube-sum against that saved copy.",
        java="public boolean isArmstrong(int n) {\n    int original = n, sum = 0;\n    while (n > 0) {\n        int d = n % 10;\n        sum += d * d * d;\n        n /= 10;\n    }\n    return sum == original;\n}",
        python="def is_armstrong(n: int) -> bool:\n    original, total = n, 0\n    while n > 0:\n        d = n % 10\n        total += d ** 3\n        n //= 10\n    return total == original",
    ),
    mistakes=["Comparing against the mutated `n` (now 0) instead of the saved original.", "Squaring instead of cubing the digits."],
    remember=dict(pattern="Digit extraction + power sum", rules=["Save original first.", "Sum d³ over digits.", "Compare with original."], takeaway="Whenever a loop consumes the input, snapshot it before you start."),
)


# ── Arrays ───────────────────────────────────────────────────────────────────

D(
    "array-maximum",
    statement="Given a non-empty integer array `nums`, return the largest element.",
    understanding="Keep a running maximum: start it at the first element and update it whenever you find something bigger.",
    examples=[("nums = [3, 7, 2, 9, 4]", "9", "9 is the largest."), ("nums = [-5, -1, -8]", "-1", "Largest of negatives."), ("nums = [42]", "42", "Single element.")],
    constraints=["1 ≤ nums.length ≤ 10^5", "-10^9 ≤ nums[i] ≤ 10^9"],
    direct_answer="Initialise `max` to `nums[0]` (never to 0 — that breaks on all-negative arrays) and scan once, updating `max` whenever an element is larger.",
    approach=dict(
        name="Running maximum",
        time="O(n)", space="O(1)",
        idea="Seed the maximum with the first element so the answer is valid for all-negative arrays, then look at each remaining element and keep the larger of (current max, element). One pass is enough.",
        insight="Seeding with 0 instead of nums[0] is the classic bug — it returns 0 for an all-negative array.",
        java="public int maxOf(int[] nums) {\n    int max = nums[0];\n    for (int x : nums) {\n        if (x > max) max = x;\n    }\n    return max;\n}",
        python="def max_of(nums: list[int]) -> int:\n    best = nums[0]\n    for x in nums:\n        if x > best:\n            best = x\n    return best",
    ),
    line_java=[("int max = nums[0];", "Seed with the first element so negatives work."), ("if (x > max) max = x;", "Keep the larger value as we scan.")],
    mistakes=["Seeding max with 0 — wrong for all-negative arrays.", "Forgetting the array could be empty (here it's guaranteed non-empty)."],
    remember=dict(pattern="Running maximum", rules=["Seed with nums[0], not 0.", "Update on every larger element.", "Single O(n) pass."], takeaway="Seed running extremes with the first element, never a constant."),
    frequency="high",
)

D(
    "array-minimum",
    statement="Given a non-empty integer array `nums`, return the smallest element.",
    understanding="Mirror of array-maximum: keep a running minimum seeded with the first element.",
    examples=[("nums = [3, 7, 2, 9, 4]", "2", "2 is smallest."), ("nums = [5, 1, 8]", "1", "1 is smallest."), ("nums = [-2]", "-2", "Single element.")],
    constraints=["1 ≤ nums.length ≤ 10^5", "-10^9 ≤ nums[i] ≤ 10^9"],
    direct_answer="Initialise `min` to `nums[0]` and scan, keeping the smaller of (current min, element).",
    approach=dict(
        name="Running minimum",
        time="O(n)", space="O(1)",
        idea="Same fold as the maximum, flipped. Seed with the first element to avoid the all-positive analogue of the all-negative bug, then take the smaller value at each step.",
        java="public int minOf(int[] nums) {\n    int min = nums[0];\n    for (int x : nums) {\n        if (x < min) min = x;\n    }\n    return min;\n}",
        python="def min_of(nums: list[int]) -> int:\n    best = nums[0]\n    for x in nums:\n        if x < best:\n            best = x\n    return best",
    ),
    mistakes=["Seeding min with 0 — wrong for all-positive arrays.", "Reusing a max comparison by mistake."],
    remember=dict(pattern="Running minimum", rules=["Seed with nums[0].", "Keep the smaller value.", "O(n) one pass."], takeaway="Min and max are the same loop with the comparison flipped."),
)

D(
    "array-sum",
    statement="Given an integer array `nums`, return the sum of all its elements.",
    understanding="Accumulate every element into a total that starts at 0. Use a 64-bit accumulator since many ints can overflow.",
    examples=[("nums = [1, 2, 3, 4]", "10", "1+2+3+4."), ("nums = []", "0", "Empty sum is 0."), ("nums = [-1, 5, -4]", "0", "Sums to 0.")],
    constraints=["0 ≤ nums.length ≤ 10^5", "-10^9 ≤ nums[i] ≤ 10^9"],
    direct_answer="Fold with a `long` accumulator starting at 0; add each element. Empty arrays naturally yield 0.",
    approach=dict(
        name="Accumulate",
        time="O(n)", space="O(1)",
        idea="Start a sum at 0 (which is also the correct answer for an empty array) and add each element. Use `long` because up to 10^5 elements of magnitude 10^9 can exceed int range.",
        insight="Choosing `long` for the accumulator is the detail that separates a careful answer from a buggy one.",
        java="public long sum(int[] nums) {\n    long total = 0;\n    for (int x : nums) {\n        total += x;\n    }\n    return total;\n}",
        python="def array_sum(nums: list[int]) -> int:\n    total = 0\n    for x in nums:\n        total += x\n    return total",
    ),
    mistakes=["Using an int accumulator and overflowing.", "Initialising the total to nums[0] and double counting."],
    remember=dict(pattern="Accumulate fold", rules=["Start at 0.", "Add each element.", "Use long for the total."], takeaway="Sum folds start at the additive identity, 0."),
)

D(
    "array-average",
    statement="Given a non-empty integer array `nums`, return the average (mean) of its elements as a floating-point number.",
    understanding="Sum the elements, then divide by the count. Do the division in floating point to keep the fractional part.",
    examples=[("nums = [1, 2, 3, 4]", "2.5", "10 / 4."), ("nums = [5, 5, 5]", "5.0", "Mean is 5."), ("nums = [2, 3]", "2.5", "5 / 2.")],
    constraints=["1 ≤ nums.length ≤ 10^5", "-10^9 ≤ nums[i] ≤ 10^9"],
    direct_answer="Sum with a `long`, then divide by `nums.length` as a `double` so you don't lose the fraction.",
    approach=dict(
        name="Sum then divide",
        time="O(n)", space="O(1)",
        idea="The mean is total/count. The trap is integer division: cast the sum (or the length) to a floating type before dividing, otherwise 10/4 truncates to 2 instead of 2.5.",
        insight="`(double) total / n` is the fix — cast before the division, not after.",
        java="public double average(int[] nums) {\n    long total = 0;\n    for (int x : nums) total += x;\n    return (double) total / nums.length;\n}",
        python="def average(nums: list[int]) -> float:\n    return sum(nums) / len(nums)",
    ),
    line_java=[("return (double) total / nums.length;", "Cast to double BEFORE dividing so the fraction survives.")],
    mistakes=["Integer division truncating the result (10/4 → 2).", "Dividing by zero on an empty array (guaranteed non-empty here)."],
    remember=dict(pattern="Mean = sum / count", rules=["Sum in long.", "Cast to double before dividing.", "Guard against empty input."], takeaway="Cast before dividing, not after — order matters."),
)

D(
    "count-even-odd-array",
    statement="Given an integer array `nums`, return how many elements are even and how many are odd, as a pair `[evenCount, oddCount]`.",
    understanding="One pass: test each element's parity and bump the matching counter.",
    examples=[("nums = [1, 2, 3, 4, 5]", "[2, 3]", "Evens 2,4; odds 1,3,5."), ("nums = [2, 4, 6]", "[3, 0]", "All even."), ("nums = []", "[0, 0]", "Nothing to count.")],
    constraints=["0 ≤ nums.length ≤ 10^5"],
    direct_answer="Keep two counters. For each element, increment `even` when `x % 2 == 0`, otherwise `odd`.",
    approach=dict(
        name="Two counters",
        time="O(n)", space="O(1)",
        idea="Walk the array once and classify each value by parity using `x % 2 == 0` (safe for negatives). One counter is technically enough — odd = n − even — but two reads more clearly.",
        java="public int[] countEvenOdd(int[] nums) {\n    int even = 0, odd = 0;\n    for (int x : nums) {\n        if (x % 2 == 0) even++;\n        else odd++;\n    }\n    return new int[]{even, odd};\n}",
        python="def count_even_odd(nums: list[int]) -> list[int]:\n    even = odd = 0\n    for x in nums:\n        if x % 2 == 0:\n            even += 1\n        else:\n            odd += 1\n    return [even, odd]",
    ),
    mistakes=["Testing `x % 2 == 1` for odd — fails on negative odds.", "Returning the counts in the wrong order."],
    remember=dict(pattern="Classify-and-count", rules=["Parity via `% 2 == 0`.", "Bump the matching counter.", "odd = n − even if you want one counter."], takeaway="Counting categories is one pass with one counter per category."),
)

D(
    "linear-search",
    statement="Given an integer array `nums` and a `target`, return the index of the first occurrence of `target`, or `-1` if it is absent.",
    understanding="Scan left to right and return the index as soon as you hit the target.",
    examples=[("nums = [4, 2, 7, 1], target = 7", "2", "7 is at index 2."), ("nums = [4, 2, 7], target = 9", "-1", "Not present."), ("nums = [5], target = 5", "0", "Found at 0.")],
    constraints=["0 ≤ nums.length ≤ 10^5"],
    direct_answer="Loop by index; return `i` the first time `nums[i] == target`. If the loop finishes, return -1.",
    approach=dict(
        name="Sequential scan",
        time="O(n)", space="O(1)",
        idea="With no ordering assumptions, you must look at elements one by one. Return immediately on the first match to get the *first* index; falling out of the loop means the target isn't there.",
        insight="If the array were sorted you'd use binary search (O(log n)) — calling that out shows range awareness.",
        java="public int search(int[] nums, int target) {\n    for (int i = 0; i < nums.length; i++) {\n        if (nums[i] == target) return i;\n    }\n    return -1;\n}",
        python="def search(nums: list[int], target: int) -> int:\n    for i, x in enumerate(nums):\n        if x == target:\n            return i\n    return -1",
    ),
    mistakes=["Returning the element instead of its index.", "Forgetting the -1 'not found' case."],
    remember=dict(pattern="Sequential scan", rules=["Return index on first match.", "Return -1 if never found.", "Use binary search when sorted."], takeaway="Linear search is the fallback when data has no structure."),
)

D(
    "reverse-array",
    statement="Given an integer array `nums`, reverse it in place so the first element becomes the last.",
    understanding="Swap the two ends and walk both pointers inward until they meet.",
    examples=[("nums = [1, 2, 3, 4]", "[4, 3, 2, 1]", "Ends swapped inward."), ("nums = [1, 2, 3]", "[3, 2, 1]", "Middle stays put."), ("nums = [9]", "[9]", "Single element unchanged.")],
    constraints=["0 ≤ nums.length ≤ 10^5"],
    direct_answer="Two pointers — `left = 0`, `right = n-1`. Swap `nums[left]` and `nums[right]`, then move both toward the centre until they cross. O(1) extra space.",
    approach=dict(
        name="Two-pointer swap",
        time="O(n)", space="O(1)",
        idea="Pair the first element with the last, the second with the second-last, and so on — each pair is one swap. The pointers meet in the middle after n/2 swaps, so the whole reversal is in place with no extra array.",
        insight="The two-pointer swap is the reusable primitive behind reverse-string and the three-reversal rotation.",
        java="public void reverse(int[] nums) {\n    int left = 0, right = nums.length - 1;\n    while (left < right) {\n        int tmp = nums[left];\n        nums[left] = nums[right];\n        nums[right] = tmp;\n        left++;\n        right--;\n    }\n}",
        python="def reverse(nums: list[int]) -> None:\n    left, right = 0, len(nums) - 1\n    while left < right:\n        nums[left], nums[right] = nums[right], nums[left]\n        left += 1\n        right -= 1",
    ),
    line_java=[("while (left < right)", "Stop when the pointers meet — the middle element needs no swap."), ("int tmp = nums[left]; …", "Classic three-line swap of the two ends.")],
    mistakes=["Looping the full length and swapping twice (undoing the reversal).", "Off-by-one in the right pointer (`n` instead of `n-1`)."],
    remember=dict(pattern="Two-pointer inward swap", rules=["left=0, right=n-1.", "Swap, then move both in.", "Stop when left ≥ right."], takeaway="Reverse-in-place = swap the ends and converge."),
)

D(
    "second-largest",
    statement="Given an array `nums` with at least two distinct values, return the second largest element.",
    understanding="Track the largest and second largest in one pass, updating both as you go.",
    examples=[("nums = [3, 7, 2, 9, 4]", "7", "Largest 9, second 7."), ("nums = [10, 10, 5]", "5", "Distinct second largest is 5."), ("nums = [1, 2]", "1", "Second is 1.")],
    constraints=["2 ≤ nums.length ≤ 10^5", "At least two distinct values"],
    direct_answer="Keep `first` and `second` (both very small initially). For each x: if x > first, shift first into second and set first = x; else if x > second and x != first, update second.",
    approach=dict(
        name="Track top two",
        time="O(n)", space="O(1)",
        idea="You don't need to sort. Maintain the best and the runner-up: a new value either beats the best (so the old best becomes the runner-up), or it slots between them. Skipping values equal to the best keeps the 'second *distinct*' meaning.",
        insight="Sorting works (O(n log n)) but the one-pass top-two tracker is the O(n) answer interviewers want.",
        java="public int secondLargest(int[] nums) {\n    long first = Long.MIN_VALUE, second = Long.MIN_VALUE;\n    for (int x : nums) {\n        if (x > first) {\n            second = first;\n            first = x;\n        } else if (x > second && x != first) {\n            second = x;\n        }\n    }\n    return (int) second;\n}",
        python="def second_largest(nums: list[int]) -> int:\n    first = second = float('-inf')\n    for x in nums:\n        if x > first:\n            second = first\n            first = x\n        elif x > second and x != first:\n            second = x\n    return int(second)",
    ),
    mistakes=["Returning the largest when duplicates of the max exist.", "Initialising first/second to 0 instead of negative infinity."],
    remember=dict(pattern="Track top-two in one pass", rules=["Seed both to −∞.", "Beat first → demote first to second.", "Skip x == first for distinctness."], takeaway="Top-K of small K is a running tracker, not a sort."),
)

D(
    "count-occurrences",
    statement="Given an integer array `nums` and a `target`, return how many times `target` appears.",
    understanding="One pass with a counter incremented on each match.",
    examples=[("nums = [1, 2, 2, 3, 2], target = 2", "3", "Three 2s."), ("nums = [1, 2, 3], target = 5", "0", "Absent."), ("nums = [4, 4], target = 4", "2", "Two 4s.")],
    constraints=["0 ≤ nums.length ≤ 10^5"],
    direct_answer="Scan once, incrementing a counter whenever `nums[i] == target`.",
    approach=dict(
        name="Count matches",
        time="O(n)", space="O(1)",
        idea="A single counter started at 0, bumped on every equality. There's no shortcut without preprocessing, so the linear scan is optimal for a one-off query.",
        java="public int count(int[] nums, int target) {\n    int c = 0;\n    for (int x : nums) {\n        if (x == target) c++;\n    }\n    return c;\n}",
        python="def count(nums: list[int], target: int) -> int:\n    return sum(1 for x in nums if x == target)",
    ),
    mistakes=["Returning a boolean (found/not found) instead of a count.", "Stopping at the first match."],
    remember=dict(pattern="Count matches", rules=["Counter starts at 0.", "Bump on equality.", "Don't stop early."], takeaway="Counting means visiting every element — never break early."),
)

D(
    "is-array-sorted",
    statement="Given an integer array `nums`, return whether it is sorted in non-decreasing order.",
    understanding="Check every adjacent pair; if any earlier element is greater than the next, it's not sorted.",
    examples=[("nums = [1, 2, 2, 3]", "true", "Non-decreasing."), ("nums = [1, 3, 2]", "false", "3 > 2 breaks order."), ("nums = [5]", "true", "Single element is sorted.")],
    constraints=["0 ≤ nums.length ≤ 10^5"],
    direct_answer="Compare each `nums[i]` with `nums[i-1]`; return false on the first inversion. If none, return true. Empty and single-element arrays are sorted by definition.",
    approach=dict(
        name="Adjacent-pair check",
        time="O(n)", space="O(1)",
        idea="A sequence is sorted exactly when no neighbour decreases. Checking adjacent pairs is sufficient — local order across every pair implies global order. Use `>` (not `>=`) so equal neighbours stay valid for non-decreasing.",
        java="public boolean isSorted(int[] nums) {\n    for (int i = 1; i < nums.length; i++) {\n        if (nums[i - 1] > nums[i]) return false;\n    }\n    return true;\n}",
        python="def is_sorted(nums: list[int]) -> bool:\n    return all(nums[i - 1] <= nums[i] for i in range(1, len(nums)))",
    ),
    line_java=[("if (nums[i - 1] > nums[i]) return false;", "First out-of-order neighbour proves it isn't sorted.")],
    mistakes=["Using `>=` and rejecting valid arrays with duplicates.", "Starting the loop at i = 0 and reading nums[-1]."],
    remember=dict(pattern="Adjacent-pair invariant", rules=["Check neighbours only.", "Use `>` for non-decreasing.", "0/1 elements are sorted."], takeaway="Global order follows from every adjacent pair being ordered."),
)

D(
    "sum-even-numbers-array",
    statement="Given an integer array `nums`, return the sum of only its even elements.",
    understanding="Accumulate, but add an element only when it is even.",
    examples=[("nums = [1, 2, 3, 4]", "6", "2 + 4."), ("nums = [1, 3, 5]", "0", "No evens."), ("nums = [2, 4, 6]", "12", "All even.")],
    constraints=["0 ≤ nums.length ≤ 10^5"],
    direct_answer="Fold with a guard: add `x` to the total when `x % 2 == 0`. Empty or all-odd inputs give 0.",
    approach=dict(
        name="Filtered accumulate",
        time="O(n)", space="O(1)",
        idea="Same accumulate fold as array-sum, but with a parity filter inside the loop. Starting at 0 makes the all-odd and empty cases correct automatically.",
        java="public long sumEven(int[] nums) {\n    long total = 0;\n    for (int x : nums) {\n        if (x % 2 == 0) total += x;\n    }\n    return total;\n}",
        python="def sum_even(nums: list[int]) -> int:\n    return sum(x for x in nums if x % 2 == 0)",
    ),
    mistakes=["Testing oddness with `% 2 == 1` and mishandling negatives.", "Adding all elements and forgetting the filter."],
    remember=dict(pattern="Filtered fold", rules=["Accumulate from 0.", "Guard with `% 2 == 0`.", "Empty → 0."], takeaway="A fold plus an `if` filter handles 'sum of those that…' problems."),
)

D(
    "find-duplicate",
    statement="Given an integer array `nums` that contains at least one repeated value, return any value that appears more than once.",
    understanding="Remember what you've seen in a hash set; the first value already in the set is a duplicate.",
    examples=[("nums = [1, 3, 2, 3, 4]", "3", "3 repeats."), ("nums = [5, 5]", "5", "5 repeats."), ("nums = [1, 2, 2, 1]", "2 or 1", "Either repeated value is valid.")],
    constraints=["2 ≤ nums.length ≤ 10^5", "At least one duplicate exists"],
    direct_answer="Walk the array adding each value to a hash set; the first value that's already present is a duplicate. O(n) time, O(n) space.",
    approach=dict(
        name="Hash set seen",
        time="O(n)", space="O(n)",
        idea="A set answers 'have I seen this before?' in O(1). Adding elements one by one, the first failed insertion (value already present) is your duplicate. This beats the O(n²) brute force of comparing every pair.",
        insight="Mention the O(n²) nested-loop brute force first, then the O(n) set — the trade is time for O(n) space.",
        java="public int findDuplicate(int[] nums) {\n    java.util.Set<Integer> seen = new java.util.HashSet<>();\n    for (int x : nums) {\n        if (!seen.add(x)) return x;\n    }\n    return -1;\n}",
        python="def find_duplicate(nums: list[int]) -> int:\n    seen = set()\n    for x in nums:\n        if x in seen:\n            return x\n        seen.add(x)\n    return -1",
    ),
    line_java=[("if (!seen.add(x)) return x;", "Set.add returns false when the value was already present — that's the duplicate.")],
    mistakes=["Using nested loops (O(n²)) when a set gives O(n).", "Adding before checking and never detecting the repeat."],
    remember=dict(pattern="Hash set membership", rules=["Add as you go.", "Already-present ⟹ duplicate.", "O(n) time, O(n) space."], takeaway="'Seen before?' questions are a hash set in disguise."),
)

D(
    "move-zeros-end",
    statement="Given an integer array `nums`, move every `0` to the end while keeping the order of the non-zero elements. Do it in place.",
    understanding="Use a write pointer: copy each non-zero forward, then fill the rest with zeros.",
    examples=[("nums = [0, 1, 0, 3, 12]", "[1, 3, 12, 0, 0]", "Non-zeros keep order."), ("nums = [0, 0, 1]", "[1, 0, 0]", "One non-zero moves up."), ("nums = [1, 2, 3]", "[1, 2, 3]", "No zeros — unchanged.")],
    constraints=["1 ≤ nums.length ≤ 10^5"],
    direct_answer="A stable partition: keep an `insert` index, copy each non-zero element to `nums[insert++]`, then zero-fill from `insert` to the end. O(n) time, O(1) space.",
    approach=dict(
        name="Write-pointer partition",
        time="O(n)", space="O(1)",
        idea="Think of it as compacting the non-zeros to the front. A write index marks where the next non-zero goes; scanning left to right and copying non-zeros there preserves their order. Whatever is left after the write index must be zeros.",
        insight="This stable-partition pattern (compact, then fill) reappears in 'remove element' and 'remove duplicates from sorted array'.",
        java="public void moveZeros(int[] nums) {\n    int insert = 0;\n    for (int x : nums) {\n        if (x != 0) nums[insert++] = x;\n    }\n    while (insert < nums.length) {\n        nums[insert++] = 0;\n    }\n}",
        python="def move_zeros(nums: list[int]) -> None:\n    insert = 0\n    for x in nums:\n        if x != 0:\n            nums[insert] = x\n            insert += 1\n    for i in range(insert, len(nums)):\n        nums[i] = 0",
    ),
    line_java=[("if (x != 0) nums[insert++] = x;", "Compact non-zeros to the front, preserving order."), ("while (insert < n) nums[insert++] = 0;", "Fill the tail with zeros.")],
    mistakes=["Swapping in a way that reorders the non-zeros.", "Forgetting to zero-fill the remaining slots."],
    remember=dict(pattern="Stable write-pointer partition", rules=["Compact keepers to the front.", "Fill the rest with the removed value.", "Order preserved."], takeaway="A write index turns 'remove/move X' into one in-place pass."),
)

D(
    "left-rotate-by-one",
    statement="Given an integer array `nums`, rotate it left by one position: the first element moves to the end.",
    understanding="Save the first element, shift everything one slot left, then drop the saved value at the end.",
    examples=[("nums = [1, 2, 3, 4]", "[2, 3, 4, 1]", "First element wraps to the back."), ("nums = [5]", "[5]", "Single element unchanged."), ("nums = [7, 8]", "[8, 7]", "Two-element swap.")],
    constraints=["1 ≤ nums.length ≤ 10^5"],
    direct_answer="Stash `nums[0]`, shift `nums[i] = nums[i+1]` for all i, then put the stashed value in the last slot. O(n) time, O(1) space.",
    approach=dict(
        name="Shift with saved head",
        time="O(n)", space="O(1)",
        idea="A left rotation by one slides every element down one index. You must save the original first element before the shift overwrites it, then place it at the end to complete the wrap-around.",
        java="public void rotateLeft(int[] nums) {\n    if (nums.length <= 1) return;\n    int first = nums[0];\n    for (int i = 0; i < nums.length - 1; i++) {\n        nums[i] = nums[i + 1];\n    }\n    nums[nums.length - 1] = first;\n}",
        python="def rotate_left(nums: list[int]) -> None:\n    if len(nums) <= 1:\n        return\n    first = nums[0]\n    for i in range(len(nums) - 1):\n        nums[i] = nums[i + 1]\n    nums[-1] = first",
    ),
    line_java=[("int first = nums[0];", "Save the head before it gets overwritten."), ("nums[i] = nums[i + 1];", "Slide each element one slot left.")],
    mistakes=["Overwriting nums[0] before saving it.", "Looping to the last index and reading out of bounds (nums[n])."],
    remember=dict(pattern="Shift with saved head", rules=["Save nums[0] first.", "Shift left in order.", "Drop saved value at the end."], takeaway="Always snapshot the value an in-place shift will clobber."),
)

D(
    "count-positive-negative",
    statement="Given an integer array `nums`, return counts of positive, negative, and zero values as `[pos, neg, zero]`.",
    understanding="One pass; classify each value into one of three buckets.",
    examples=[("nums = [1, -2, 0, 3, -1]", "[2, 2, 1]", "pos {1,3}, neg {-2,-1}, zero {0}."), ("nums = [0, 0]", "[0, 0, 2]", "All zeros."), ("nums = [4]", "[1, 0, 0]", "One positive.")],
    constraints=["0 ≤ nums.length ≤ 10^5"],
    direct_answer="Three counters; for each value compare against 0 and bump the matching bucket.",
    approach=dict(
        name="Three buckets",
        time="O(n)", space="O(1)",
        idea="Reuse the sign-of-a-number three-way branch inside a loop, tallying each category. Zero is its own bucket, so handle the `== 0` case explicitly rather than lumping it with positives.",
        java="public int[] classify(int[] nums) {\n    int pos = 0, neg = 0, zero = 0;\n    for (int x : nums) {\n        if (x > 0) pos++;\n        else if (x < 0) neg++;\n        else zero++;\n    }\n    return new int[]{pos, neg, zero};\n}",
        python="def classify(nums: list[int]) -> list[int]:\n    pos = neg = zero = 0\n    for x in nums:\n        if x > 0:\n            pos += 1\n        elif x < 0:\n            neg += 1\n        else:\n            zero += 1\n    return [pos, neg, zero]",
    ),
    mistakes=["Counting zero as positive.", "Returning the buckets in the wrong order."],
    remember=dict(pattern="Three-bucket tally", rules=[">0, <0, else zero.", "One counter per bucket.", "Single pass."], takeaway="Mutually-exclusive categories → one counter each, one pass."),
)

D(
    "missing-number",
    statement="Given an array `nums` containing `n` distinct numbers from the range `0..n` (one value is missing), return the missing number.",
    understanding="The full range 0..n has a known sum; subtract the array's sum to reveal the gap.",
    examples=[("nums = [3, 0, 1]", "2", "0..3 missing 2."), ("nums = [0, 1]", "2", "0..2 missing 2."), ("nums = [1]", "0", "0..1 missing 0.")],
    constraints=["1 ≤ n ≤ 10^5", "All values distinct, in 0..n"],
    direct_answer="Compute the expected sum `n*(n+1)/2` and subtract the actual array sum. The difference is the missing number. O(n) time, O(1) space.",
    approach=dict(
        name="Gauss sum difference",
        time="O(n)", space="O(1)",
        idea="If no number were missing, the array would sum to 0+1+…+n = n(n+1)/2. The single absent value is exactly the difference between that expected total and the real sum. XOR works too and avoids overflow.",
        insight="Mention the XOR variant (`xor of 0..n and all elements`) as an overflow-proof alternative — it impresses.",
        java="public int missingNumber(int[] nums) {\n    int n = nums.length;\n    long expected = (long) n * (n + 1) / 2;\n    long actual = 0;\n    for (int x : nums) actual += x;\n    return (int) (expected - actual);\n}",
        python="def missing_number(nums: list[int]) -> int:\n    n = len(nums)\n    return n * (n + 1) // 2 - sum(nums)",
    ),
    line_java=[("long expected = (long) n * (n + 1) / 2;", "Sum of the complete 0..n range."), ("return (int)(expected - actual);", "The gap is the missing value.")],
    mistakes=["Off-by-one: the range is 0..n (n+1 slots), not 1..n.", "Overflow when computing the expected sum in int."],
    remember=dict(pattern="Sum difference (or XOR)", rules=["Expected = n(n+1)/2.", "Missing = expected − actual.", "XOR avoids overflow."], takeaway="A known total minus the observed total reveals what's missing."),
)

D(
    "merge-two-sorted-arrays",
    statement="Given two arrays `a` and `b`, each sorted in non-decreasing order, return a single sorted array containing all their elements.",
    understanding="Two pointers walk both arrays, always copying the smaller current element first.",
    examples=[("a = [1, 3, 5], b = [2, 4]", "[1, 2, 3, 4, 5]", "Interleaved in order."), ("a = [], b = [1, 2]", "[1, 2]", "One side empty."), ("a = [1, 1], b = [1]", "[1, 1, 1]", "Duplicates kept.")],
    constraints=["0 ≤ a.length, b.length ≤ 10^5", "Both inputs sorted"],
    direct_answer="Merge with two pointers: compare `a[i]` and `b[j]`, append the smaller, advance that pointer. When one runs out, append the rest of the other. O(n+m).",
    approach=dict(
        name="Two-pointer merge",
        time="O(n + m)", space="O(n + m)",
        idea="Because both inputs are already sorted, the next element of the merged output is always the smaller of the two current fronts. Advancing only the pointer you consumed keeps both arrays' order. This is the merge step of merge sort.",
        insight="Re-sorting the concatenation is O((n+m)log(n+m)); the linear merge exploits the existing sortedness.",
        java="public int[] merge(int[] a, int[] b) {\n    int[] out = new int[a.length + b.length];\n    int i = 0, j = 0, k = 0;\n    while (i < a.length && j < b.length) {\n        out[k++] = a[i] <= b[j] ? a[i++] : b[j++];\n    }\n    while (i < a.length) out[k++] = a[i++];\n    while (j < b.length) out[k++] = b[j++];\n    return out;\n}",
        python="def merge(a: list[int], b: list[int]) -> list[int]:\n    out, i, j = [], 0, 0\n    while i < len(a) and j < len(b):\n        if a[i] <= b[j]:\n            out.append(a[i]); i += 1\n        else:\n            out.append(b[j]); j += 1\n    out.extend(a[i:])\n    out.extend(b[j:])\n    return out",
    ),
    line_java=[("out[k++] = a[i] <= b[j] ? a[i++] : b[j++];", "Append the smaller front and advance only that pointer."), ("while (i < a.length) …", "Drain whichever array still has elements.")],
    mistakes=["Forgetting to copy the leftovers after one pointer is exhausted.", "Using `<` instead of `<=` and dropping/duplicating equal elements (stability)."],
    remember=dict(pattern="Two-pointer merge", rules=["Append the smaller front.", "Advance only the consumed pointer.", "Drain the remainder."], takeaway="Merging sorted inputs is linear — never re-sort."),
)

D(
    "separate-odd-even",
    statement="Given an integer array `nums`, return a pair of lists: all even numbers and all odd numbers, each in their original relative order.",
    understanding="One pass; route each element into the even or odd output list.",
    examples=[("nums = [1, 2, 3, 4]", "[[2, 4], [1, 3]]", "Evens then odds."), ("nums = [2, 4]", "[[2, 4], []]", "All even."), ("nums = [1]", "[[], [1]]", "All odd.")],
    constraints=["0 ≤ nums.length ≤ 10^5"],
    direct_answer="Create two lists; append each element to the even or odd list based on `x % 2 == 0`. Order is preserved by appending as you scan.",
    approach=dict(
        name="Route into two lists",
        time="O(n)", space="O(n)",
        idea="Appending in scan order to two separate buckets keeps each group's relative order for free. The parity test decides the destination. This is a stable partition into two output lists rather than in place.",
        java="public java.util.List<java.util.List<Integer>> separate(int[] nums) {\n    java.util.List<Integer> even = new java.util.ArrayList<>();\n    java.util.List<Integer> odd = new java.util.ArrayList<>();\n    for (int x : nums) {\n        if (x % 2 == 0) even.add(x);\n        else odd.add(x);\n    }\n    return java.util.List.of(even, odd);\n}",
        python="def separate(nums: list[int]) -> list[list[int]]:\n    even = [x for x in nums if x % 2 == 0]\n    odd = [x for x in nums if x % 2 != 0]\n    return [even, odd]",
    ),
    mistakes=["Reversing one group by inserting at the front.", "Parity bug on negative numbers."],
    remember=dict(pattern="Stable partition into buckets", rules=["Append in scan order.", "Parity picks the bucket.", "Order preserved per group."], takeaway="Appending while you scan preserves relative order automatically."),
)

D(
    "max-consecutive-ones",
    statement="Given a binary array `nums` (only 0s and 1s), return the length of the longest run of consecutive `1`s.",
    understanding="Track a current streak and the best streak seen; reset the streak whenever you hit a 0.",
    examples=[("nums = [1, 1, 0, 1, 1, 1]", "3", "The trailing three 1s."), ("nums = [0, 0]", "0", "No ones."), ("nums = [1, 1, 1]", "3", "All ones.")],
    constraints=["1 ≤ nums.length ≤ 10^5", "nums[i] ∈ {0, 1}"],
    direct_answer="Keep `current` and `best`. On a 1, increment `current` and update `best`; on a 0, reset `current` to 0. O(n) time, O(1) space.",
    approach=dict(
        name="Running streak",
        time="O(n)", space="O(1)",
        idea="A run of ones grows by one each time you see a 1 and breaks the moment you see a 0. Tracking the current run and the maximum run in a single pass captures the longest streak without storing anything else.",
        java="public int maxOnes(int[] nums) {\n    int best = 0, current = 0;\n    for (int x : nums) {\n        if (x == 1) {\n            current++;\n            best = Math.max(best, current);\n        } else {\n            current = 0;\n        }\n    }\n    return best;\n}",
        python="def max_ones(nums: list[int]) -> int:\n    best = current = 0\n    for x in nums:\n        if x == 1:\n            current += 1\n            best = max(best, current)\n        else:\n            current = 0\n    return best",
    ),
    line_java=[("current++; best = Math.max(best, current);", "Grow the current run and remember the longest."), ("else current = 0;", "A zero breaks the run.")],
    mistakes=["Forgetting to reset the streak on a 0.", "Updating best only at the end instead of inside the loop."],
    remember=dict(pattern="Running streak / reset", rules=["Grow on 1, reset on 0.", "Update best while growing.", "O(1) state."], takeaway="Longest-run problems need a current counter and a best counter."),
)

D(
    "distinct-elements",
    statement="Given an integer array `nums`, return how many distinct values it contains.",
    understanding="Insert everything into a set; the set's size is the number of distinct values.",
    examples=[("nums = [1, 2, 2, 3, 3, 3]", "3", "Distinct: 1,2,3."), ("nums = [5, 5, 5]", "1", "Only one distinct value."), ("nums = []", "0", "Nothing.")],
    constraints=["0 ≤ nums.length ≤ 10^5"],
    direct_answer="Add all elements to a hash set and return its size. Duplicates collapse automatically. O(n) time, O(n) space.",
    approach=dict(
        name="Hash set size",
        time="O(n)", space="O(n)",
        idea="A set stores each value at most once, so inserting the whole array and reading the size counts unique values directly. The alternative — sort then count adjacent changes — is O(n log n) but uses O(1) extra space.",
        java="public int distinct(int[] nums) {\n    java.util.Set<Integer> set = new java.util.HashSet<>();\n    for (int x : nums) set.add(x);\n    return set.size();\n}",
        python="def distinct(nums: list[int]) -> int:\n    return len(set(nums))",
    ),
    mistakes=["Counting the array length instead of the set size.", "Forgetting that an empty array has 0 distinct values."],
    remember=dict(pattern="Set for uniqueness", rules=["Insert all into a set.", "Size = distinct count.", "Sort+scan is the O(1)-space alternative."], takeaway="Uniqueness counting is a one-liner with a set."),
)

D(
    "sum-of-min-and-max",
    statement="Given a non-empty integer array `nums`, return the sum of its smallest and largest elements.",
    understanding="Track both the running minimum and maximum in a single pass, then add them.",
    examples=[("nums = [3, 7, 2, 9]", "11", "min 2 + max 9."), ("nums = [5]", "10", "5 + 5."), ("nums = [-4, -1]", "-5", "-4 + -1.")],
    constraints=["1 ≤ nums.length ≤ 10^5"],
    direct_answer="Seed both `min` and `max` to `nums[0]`, update both as you scan, and return `min + max`. One pass instead of two.",
    approach=dict(
        name="Track min and max together",
        time="O(n)", space="O(1)",
        idea="There's no need to scan twice. Maintain both extremes simultaneously — each element can only lower the min or raise the max — then sum them at the end. Use a wide type for the sum to be safe.",
        java="public long sumMinMax(int[] nums) {\n    int min = nums[0], max = nums[0];\n    for (int x : nums) {\n        if (x < min) min = x;\n        if (x > max) max = x;\n    }\n    return (long) min + max;\n}",
        python="def sum_min_max(nums: list[int]) -> int:\n    lo = hi = nums[0]\n    for x in nums:\n        if x < lo:\n            lo = x\n        if x > hi:\n            hi = x\n    return lo + hi",
    ),
    mistakes=["Seeding min/max with 0 instead of nums[0].", "Scanning twice when one pass suffices."],
    remember=dict(pattern="Dual running extremes", rules=["Seed both with nums[0].", "Two independent ifs per element.", "Return their sum."], takeaway="Min and max can share one pass — track both."),
)

D(
    "frequency-of-elements",
    statement="Given an integer array `nums`, return a map from each value to how many times it appears.",
    understanding="A hash map keyed by value, incrementing the count for each element.",
    examples=[("nums = [1, 2, 2, 3]", "{1:1, 2:2, 3:1}", "Counts per value."), ("nums = [5, 5, 5]", "{5:3}", "One key."), ("nums = []", "{}", "Empty map.")],
    constraints=["0 ≤ nums.length ≤ 10^5"],
    direct_answer="Iterate once, doing `count[x] = count.getOrDefault(x, 0) + 1`. The map is the frequency table. O(n) time, O(k) space.",
    approach=dict(
        name="Hash map counting",
        time="O(n)", space="O(k)",
        idea="A frequency table is the workhorse behind anagrams, top-K, and majority-element problems. Each element bumps its bucket; `getOrDefault`/`Counter` handles the first-time case cleanly.",
        insight="This single building block unlocks a huge family of harder problems — learn it cold.",
        java="public java.util.Map<Integer, Integer> frequency(int[] nums) {\n    java.util.Map<Integer, Integer> freq = new java.util.HashMap<>();\n    for (int x : nums) {\n        freq.put(x, freq.getOrDefault(x, 0) + 1);\n    }\n    return freq;\n}",
        python="from collections import Counter\n\ndef frequency(nums: list[int]) -> dict[int, int]:\n    return dict(Counter(nums))",
    ),
    line_java=[("freq.put(x, freq.getOrDefault(x, 0) + 1);", "Increment the bucket, defaulting to 0 for first sightings.")],
    mistakes=["Forgetting the default for a value's first appearance (NullPointerException).", "Using a list and scanning it (O(n²))."],
    remember=dict(pattern="Frequency map", rules=["Key = value, value = count.", "getOrDefault for first sighting.", "Foundation for anagram/top-K."], takeaway="The frequency map is the most reused fresher-to-advanced primitive."),
)


# ── Strings ──────────────────────────────────────────────────────────────────

D(
    "reverse-string",
    statement="Given a string `s`, return it with the characters in reverse order.",
    understanding="Either swap from both ends inward (in place on a char array) or build the result back-to-front.",
    examples=[("s = \"hello\"", "\"olleh\"", "Characters reversed."), ("s = \"a\"", "\"a\"", "Single char unchanged."), ("s = \"ab\"", "\"ba\"", "Two chars swapped.")],
    constraints=["0 ≤ s.length ≤ 10^4"],
    direct_answer="Convert to a char array and two-pointer swap the ends inward, or in Python use slicing `s[::-1]`. O(n) time.",
    approach=dict(
        name="Two-pointer swap",
        time="O(n)", space="O(1) extra (in place on char array)",
        idea="Reversing a string is the array-reverse pattern applied to characters: swap first with last, second with second-last, until the pointers meet. In Java strings are immutable so you work on a char array; Python's slice does it directly.",
        insight="Mentioning that Java strings are immutable (hence the char array) shows language awareness.",
        java="public String reverse(String s) {\n    char[] c = s.toCharArray();\n    int left = 0, right = c.length - 1;\n    while (left < right) {\n        char t = c[left];\n        c[left] = c[right];\n        c[right] = t;\n        left++;\n        right--;\n    }\n    return new String(c);\n}",
        python="def reverse(s: str) -> str:\n    return s[::-1]",
    ),
    line_java=[("char[] c = s.toCharArray();", "Java strings are immutable, so reverse a mutable char array."), ("while (left < right) { … }", "Swap the two ends and converge.")],
    mistakes=["Trying to mutate a Java String directly (it's immutable).", "Off-by-one on the right index."],
    remember=dict(pattern="Two-pointer swap (chars)", rules=["Work on a char array in Java.", "Swap ends, converge.", "Python: s[::-1]."], takeaway="String reverse is array reverse on characters."),
    frequency="high",
)

D(
    "palindrome-string",
    statement="Given a string `s`, return whether it reads the same forwards and backwards (case-sensitive, comparing all characters).",
    understanding="Compare characters from both ends moving inward; any mismatch means it's not a palindrome.",
    examples=[("s = \"madam\"", "true", "Same both ways."), ("s = \"hello\"", "false", "h ≠ o."), ("s = \"a\"", "true", "Single char.")],
    constraints=["0 ≤ s.length ≤ 10^4"],
    direct_answer="Two pointers from the ends: if `s[left] != s[right]` return false; otherwise converge. If they cross, it's a palindrome. O(n) time, O(1) space.",
    approach=dict(
        name="Two-pointer compare",
        time="O(n)", space="O(1)",
        idea="A palindrome is symmetric about its centre, so the i-th character from the front must equal the i-th from the back. Comparing inward and bailing on the first mismatch is the optimal O(1)-space check — better than building a reversed copy.",
        java="public boolean isPalindrome(String s) {\n    int left = 0, right = s.length() - 1;\n    while (left < right) {\n        if (s.charAt(left) != s.charAt(right)) return false;\n        left++;\n        right--;\n    }\n    return true;\n}",
        python="def is_palindrome(s: str) -> bool:\n    left, right = 0, len(s) - 1\n    while left < right:\n        if s[left] != s[right]:\n            return False\n        left += 1\n        right -= 1\n    return True",
    ),
    line_java=[("if (s.charAt(left) != s.charAt(right)) return false;", "First mismatched pair disproves the palindrome.")],
    mistakes=["Building a reversed string (O(n) space) when two pointers are O(1).", "Off-by-one letting the pointers overshoot."],
    remember=dict(pattern="Two-pointer symmetry check", rules=["Compare ends inward.", "Mismatch ⟹ false.", "O(1) space."], takeaway="Palindrome checks are symmetry — compare from both ends."),
)

D(
    "count-vowels-consonants",
    statement="Given a string `s` of English letters, return how many vowels and how many consonants it contains, as `[vowels, consonants]`.",
    understanding="Lower-case each letter and check membership in the vowel set; everything else that's a letter is a consonant.",
    examples=[("s = \"hello\"", "[2, 3]", "e,o vowels; h,l,l consonants."), ("s = \"xyz\"", "[0, 3]", "No vowels."), ("s = \"aeiou\"", "[5, 0]", "All vowels.")],
    constraints=["0 ≤ s.length ≤ 10^4", "Letters only"],
    direct_answer="For each letter, normalise case and test if it's one of a,e,i,o,u; increment vowels or consonants accordingly.",
    approach=dict(
        name="Vowel-set membership",
        time="O(n)", space="O(1)",
        idea="Checking membership in the fixed set {a,e,i,o,u} classifies each letter in constant time. Lower-casing first means you handle both 'A' and 'a' with one check. Non-vowel letters are consonants.",
        java="public int[] countVowelsConsonants(String s) {\n    int vowels = 0, consonants = 0;\n    String set = \"aeiou\";\n    for (char ch : s.toLowerCase().toCharArray()) {\n        if (Character.isLetter(ch)) {\n            if (set.indexOf(ch) >= 0) vowels++;\n            else consonants++;\n        }\n    }\n    return new int[]{vowels, consonants};\n}",
        python="def count_vowels_consonants(s: str) -> list[int]:\n    vowels = sum(1 for ch in s.lower() if ch in \"aeiou\")\n    consonants = sum(1 for ch in s.lower() if ch.isalpha() and ch not in \"aeiou\")\n    return [vowels, consonants]",
    ),
    mistakes=["Counting uppercase vowels as consonants (normalise case first).", "Counting spaces or digits as consonants."],
    remember=dict(pattern="Set membership classify", rules=["Lower-case first.", "Vowel ⟺ in {a,e,i,o,u}.", "Other letters → consonant."], takeaway="Fixed small alphabets are best tested with set membership."),
)

D(
    "string-length",
    statement="Given a string `s`, return the number of characters in it without calling the built-in length function.",
    understanding="Count characters by iterating until the end — the point is to show you understand what 'length' means.",
    examples=[("s = \"hello\"", "5", "Five characters."), ("s = \"\"", "0", "Empty string."), ("s = \"a b\"", "3", "Spaces count.")],
    constraints=["0 ≤ s.length ≤ 10^4"],
    direct_answer="Iterate over the characters and increment a counter. (In practice you'd just call `.length()`/`len()`, but the exercise is the manual count.)",
    approach=dict(
        name="Manual count",
        time="O(n)", space="O(1)",
        idea="Length is simply how many characters you can step through before running out. A counter incremented once per character gives it. This is a fundamentals check, not an algorithm.",
        java="public int length(String s) {\n    int count = 0;\n    for (int i = 0; i < s.length(); i++) {\n        count++;\n    }\n    return count;\n}",
        python="def length(s: str) -> int:\n    count = 0\n    for _ in s:\n        count += 1\n    return count",
    ),
    mistakes=["Counting bytes instead of characters for multi-byte text.", "Off-by-one when looping by index."],
    remember=dict(pattern="Count by iteration", rules=["One increment per character.", "Empty string → 0.", "Normally just use len()."], takeaway="Length is a character count — one tick per element."),
)

D(
    "to-uppercase",
    statement="Given a string `s`, return it with every lowercase letter converted to uppercase. Non-letters are unchanged.",
    understanding="Lowercase letters sit 32 positions above uppercase in ASCII; subtract 32 (or use a library call).",
    examples=[("s = \"hello\"", "\"HELLO\"", "All upper-cased."), ("s = \"aBc1\"", "\"ABC1\"", "Digit unchanged."), ("s = \"X\"", "\"X\"", "Already upper.")],
    constraints=["0 ≤ s.length ≤ 10^4"],
    direct_answer="For each char, if it's between 'a' and 'z', subtract 32 from its ASCII code; leave everything else alone. Or just call `toUpperCase()`.",
    approach=dict(
        name="ASCII shift",
        time="O(n)", space="O(n)",
        idea="In ASCII, 'a' is 97 and 'A' is 65 — a fixed gap of 32. Subtracting 32 from a lowercase letter yields its uppercase form. Guarding with an `a..z` range check leaves digits, spaces, and symbols untouched.",
        insight="Knowing the 32 offset between cases is a classic ASCII fundamentals question.",
        java="public String toUpper(String s) {\n    char[] c = s.toCharArray();\n    for (int i = 0; i < c.length; i++) {\n        if (c[i] >= 'a' && c[i] <= 'z') c[i] -= 32;\n    }\n    return new String(c);\n}",
        python="def to_upper(s: str) -> str:\n    out = []\n    for ch in s:\n        if 'a' <= ch <= 'z':\n            out.append(chr(ord(ch) - 32))\n        else:\n            out.append(ch)\n    return ''.join(out)",
    ),
    line_java=[("if (c[i] >= 'a' && c[i] <= 'z') c[i] -= 32;", "Shift lowercase letters up by the 32-char case gap.")],
    mistakes=["Shifting non-letters and corrupting digits/symbols.", "Adding 32 (that lowercases) instead of subtracting."],
    remember=dict(pattern="ASCII case shift", rules=["'a'-'A' = 32.", "Upper = lower − 32.", "Guard with a-z range."], takeaway="Case conversion is a ±32 ASCII shift behind the library call."),
)

D(
    "to-lowercase",
    statement="Given a string `s`, return it with every uppercase letter converted to lowercase. Non-letters are unchanged.",
    understanding="Mirror of to-uppercase: add 32 to uppercase letters.",
    examples=[("s = \"HELLO\"", "\"hello\"", "All lower-cased."), ("s = \"AbC1\"", "\"abc1\"", "Digit unchanged."), ("s = \"z\"", "\"z\"", "Already lower.")],
    constraints=["0 ≤ s.length ≤ 10^4"],
    direct_answer="For each char in 'A'..'Z', add 32 to its ASCII code; leave others unchanged. Or call `toLowerCase()`.",
    approach=dict(
        name="ASCII shift",
        time="O(n)", space="O(n)",
        idea="The same 32-character gap, applied the other way: adding 32 to an uppercase letter produces its lowercase form. Only letters in the A..Z range are touched.",
        java="public String toLower(String s) {\n    char[] c = s.toCharArray();\n    for (int i = 0; i < c.length; i++) {\n        if (c[i] >= 'A' && c[i] <= 'Z') c[i] += 32;\n    }\n    return new String(c);\n}",
        python="def to_lower(s: str) -> str:\n    out = []\n    for ch in s:\n        if 'A' <= ch <= 'Z':\n            out.append(chr(ord(ch) + 32))\n        else:\n            out.append(ch)\n    return ''.join(out)",
    ),
    mistakes=["Subtracting 32 (that uppercases) by mistake.", "Touching non-letters."],
    remember=dict(pattern="ASCII case shift", rules=["Lower = upper + 32.", "Guard with A-Z range.", "Leave others alone."], takeaway="Lowercasing is +32; uppercasing is −32."),
)

D(
    "count-words",
    statement="Given a sentence `s`, return the number of words. Words are sequences of non-space characters separated by one or more spaces.",
    understanding="Split on whitespace and count the non-empty pieces, or count transitions from space to non-space.",
    examples=[("s = \"the quick fox\"", "3", "Three words."), ("s = \"  hello   world  \"", "2", "Extra spaces ignored."), ("s = \"\"", "0", "No words.")],
    constraints=["0 ≤ s.length ≤ 10^4"],
    direct_answer="Trim and split on runs of whitespace, then count the pieces; or scan and count each position where a non-space follows a space (a word start).",
    approach=dict(
        name="Count word-starts",
        time="O(n)", space="O(1)",
        idea="Rather than relying on split (which can leave empty tokens), count word *beginnings*: a character starts a word when it is non-space and the character before it is a space or it's the first character. This handles leading, trailing, and repeated spaces cleanly.",
        java="public int countWords(String s) {\n    int count = 0;\n    boolean inWord = false;\n    for (int i = 0; i < s.length(); i++) {\n        if (s.charAt(i) != ' ') {\n            if (!inWord) { count++; inWord = true; }\n        } else {\n            inWord = false;\n        }\n    }\n    return count;\n}",
        python="def count_words(s: str) -> int:\n    return len(s.split())",
    ),
    line_java=[("if (!inWord) { count++; inWord = true; }", "Count each transition from space into a new word."), ("else inWord = false;", "A space ends the current word.")],
    mistakes=["Counting spaces + 1 (breaks on multiple/leading/trailing spaces).", "Counting empty tokens from a naive split on a single space."],
    remember=dict(pattern="Count word-starts", rules=["Word start = non-space after space.", "Track an inWord flag.", "split() handles runs of spaces."], takeaway="Count transitions, not separators, to survive messy spacing."),
)

D(
    "valid-anagram-basic",
    statement="Given two strings `s` and `t` of lowercase letters, return whether `t` is an anagram of `s` (same letters, same counts).",
    understanding="Two strings are anagrams iff they have identical character counts. A 26-slot count array compares them.",
    examples=[("s = \"listen\", t = \"silent\"", "true", "Same letters."), ("s = \"rat\", t = \"car\"", "false", "Different letters."), ("s = \"a\", t = \"ab\"", "false", "Different lengths.")],
    constraints=["0 ≤ s.length, t.length ≤ 10^4", "Lowercase letters"],
    direct_answer="If lengths differ, return false. Otherwise count each letter of s (++) and each of t (−−) in a 26-int array; they're anagrams iff every count ends at 0. O(n).",
    approach=dict(
        name="Frequency count (26 array)",
        time="O(n)", space="O(1)",
        idea="Anagrams are a permutation of the same multiset of letters. Incrementing for s and decrementing for t leaves all counts at zero exactly when the letter frequencies match. A length check short-circuits the obvious non-anagrams.",
        insight="Sorting both strings (O(n log n)) also works, but the count array is the O(n) answer.",
        java="public boolean isAnagram(String s, String t) {\n    if (s.length() != t.length()) return false;\n    int[] count = new int[26];\n    for (int i = 0; i < s.length(); i++) {\n        count[s.charAt(i) - 'a']++;\n        count[t.charAt(i) - 'a']--;\n    }\n    for (int c : count) if (c != 0) return false;\n    return true;\n}",
        python="def is_anagram(s: str, t: str) -> bool:\n    if len(s) != len(t):\n        return False\n    count = [0] * 26\n    for cs, ct in zip(s, t):\n        count[ord(cs) - 97] += 1\n        count[ord(ct) - 97] -= 1\n    return all(c == 0 for c in count)",
    ),
    line_java=[("count[s.charAt(i) - 'a']++;", "Tally s's letters."), ("count[t.charAt(i) - 'a']--;", "Untally t's letters; all-zero at the end means a match.")],
    mistakes=["Skipping the length check and mis-handling different-length inputs.", "Sorting when an O(n) count is expected."],
    remember=dict(pattern="Letter-frequency compare", rules=["Length must match.", "++ for s, −− for t.", "All zero ⟹ anagram."], takeaway="Anagram = equal letter frequencies; a 26-array compares them in O(n)."),
)

D(
    "char-frequency",
    statement="Given a string `s`, return a map from each character to how many times it appears.",
    understanding="A hash map keyed by character, incremented per occurrence.",
    examples=[("s = \"aab\"", "{a:2, b:1}", "Counts per char."), ("s = \"\"", "{}", "Empty."), ("s = \"xx\"", "{x:2}", "One key.")],
    constraints=["0 ≤ s.length ≤ 10^4"],
    direct_answer="Iterate the characters, doing `freq[ch] = freq.getOrDefault(ch, 0) + 1`. The map is the frequency table.",
    approach=dict(
        name="Hash map counting",
        time="O(n)", space="O(k)",
        idea="The string analogue of the array frequency map. Each character bumps its bucket. This table is the seed for anagram checks, first-unique-character, and many string problems.",
        java="public java.util.Map<Character, Integer> charFrequency(String s) {\n    java.util.Map<Character, Integer> freq = new java.util.HashMap<>();\n    for (char ch : s.toCharArray()) {\n        freq.put(ch, freq.getOrDefault(ch, 0) + 1);\n    }\n    return freq;\n}",
        python="from collections import Counter\n\ndef char_frequency(s: str) -> dict:\n    return dict(Counter(s))",
    ),
    mistakes=["No default for first occurrence (NullPointerException).", "Lower-casing when the prompt is case-sensitive (or vice versa)."],
    remember=dict(pattern="Frequency map (chars)", rules=["Key = char, value = count.", "getOrDefault for new keys.", "Foundation for anagram/unique-char."], takeaway="The character frequency map underlies most string-counting problems."),
)

D(
    "remove-spaces",
    statement="Given a string `s`, return a copy with all space characters removed.",
    understanding="Build a new string from only the non-space characters.",
    examples=[("s = \"a b c\"", "\"abc\"", "Spaces dropped."), ("s = \"  x  \"", "\"x\"", "All spaces gone."), ("s = \"abc\"", "\"abc\"", "No spaces.")],
    constraints=["0 ≤ s.length ≤ 10^4"],
    direct_answer="Append each non-space character to a builder and return it. Use a StringBuilder in Java to avoid O(n²) concatenation.",
    approach=dict(
        name="Filtered build",
        time="O(n)", space="O(n)",
        idea="Scan once, keeping only characters that aren't spaces. Using a StringBuilder (Java) or a list join (Python) keeps it O(n); repeated `+=` on a Java String would be O(n²).",
        insight="Calling out the StringBuilder-vs-`+=` performance trap is a nice senior touch.",
        java="public String removeSpaces(String s) {\n    StringBuilder sb = new StringBuilder();\n    for (char ch : s.toCharArray()) {\n        if (ch != ' ') sb.append(ch);\n    }\n    return sb.toString();\n}",
        python="def remove_spaces(s: str) -> str:\n    return ''.join(ch for ch in s if ch != ' ')",
    ),
    mistakes=["Using String += in a loop (O(n²)).", "Only removing leading/trailing spaces (that's trim, not remove-all)."],
    remember=dict(pattern="Filtered build", rules=["Keep non-spaces.", "Use StringBuilder/join.", "Avoid += in a loop."], takeaway="Build filtered strings with a builder, never repeated concatenation."),
)

D(
    "count-character-occurrences",
    statement="Given a string `s` and a character `ch`, return how many times `ch` appears in `s`.",
    understanding="One pass with a counter incremented on each match.",
    examples=[("s = \"banana\", ch = 'a'", "3", "Three a's."), ("s = \"hello\", ch = 'z'", "0", "Absent."), ("s = \"aaa\", ch = 'a'", "3", "All match.")],
    constraints=["0 ≤ s.length ≤ 10^4"],
    direct_answer="Scan the string, incrementing a counter whenever the current character equals `ch`.",
    approach=dict(
        name="Count matches",
        time="O(n)", space="O(1)",
        idea="Identical to count-occurrences for arrays, on characters. A single counter, no early exit, since we want the total count.",
        java="public int count(String s, char ch) {\n    int c = 0;\n    for (int i = 0; i < s.length(); i++) {\n        if (s.charAt(i) == ch) c++;\n    }\n    return c;\n}",
        python="def count(s: str, ch: str) -> int:\n    return s.count(ch)",
    ),
    mistakes=["Returning after the first match.", "Comparing strings with == in Java instead of char equality (here we use char, so fine)."],
    remember=dict(pattern="Count matches", rules=["Counter from 0.", "Bump on equality.", "Visit every char."], takeaway="Character counting is a one-pass tally."),
)

D(
    "first-non-repeating-character",
    statement="Given a string `s`, return the first character that appears exactly once, or a space `' '` if there is none.",
    understanding="Count every character, then scan again and return the first whose count is 1.",
    examples=[("s = \"leetcode\"", "'l'", "l appears once and is first."), ("s = \"aabb\"", "' '", "No unique char."), ("s = \"abca\"", "'b'", "b is the first unique.")],
    constraints=["0 ≤ s.length ≤ 10^4"],
    direct_answer="Two passes: first build a frequency map, then walk the string and return the first character with count 1. O(n) time.",
    approach=dict(
        name="Frequency then scan",
        time="O(n)", space="O(1)",
        idea="You can't know a character is unique until you've seen the whole string, so pass one counts everything. Pass two returns the earliest character whose count is exactly 1 — order matters, so re-scan the original string rather than the map.",
        insight="The 'count first, then re-scan in order' two-pass shape recurs in many string problems.",
        java="public char firstUnique(String s) {\n    int[] count = new int[256];\n    for (int i = 0; i < s.length(); i++) count[s.charAt(i)]++;\n    for (int i = 0; i < s.length(); i++) {\n        if (count[s.charAt(i)] == 1) return s.charAt(i);\n    }\n    return ' ';\n}",
        python="from collections import Counter\n\ndef first_unique(s: str) -> str:\n    count = Counter(s)\n    for ch in s:\n        if count[ch] == 1:\n            return ch\n    return ' '",
    ),
    line_java=[("for (...) count[s.charAt(i)]++;", "Pass 1: tally every character."), ("if (count[s.charAt(i)] == 1) return …;", "Pass 2: first count-1 char in original order.")],
    mistakes=["Scanning the map (unordered) instead of the string for the 'first' requirement.", "Returning an index instead of the character."],
    remember=dict(pattern="Count then re-scan in order", rules=["Pass 1: frequencies.", "Pass 2: first count == 1.", "Re-scan the string for order."], takeaway="When 'first' matters, re-scan the input, not the map."),
)

D(
    "toggle-case",
    statement="Given a string `s`, return it with the case of every letter swapped: uppercase becomes lowercase and vice versa.",
    understanding="For each letter, flip its case using the 32 ASCII gap; non-letters stay put.",
    examples=[("s = \"Hello\"", "\"hELLO\"", "Cases flipped."), ("s = \"aB1\"", "\"Ab1\"", "Digit unchanged."), ("s = \"XYZ\"", "\"xyz\"", "All to lower.")],
    constraints=["0 ≤ s.length ≤ 10^4"],
    direct_answer="For each char: if uppercase add 32, if lowercase subtract 32, else leave it. XOR with 32 does both at once for letters.",
    approach=dict(
        name="ASCII case flip",
        time="O(n)", space="O(n)",
        idea="Toggling case is the union of the upper- and lower-case shifts. Since the two cases differ only in the 32-bit (bit 5), XOR-ing a letter with 32 flips its case in one operation — a neat trick to mention.",
        insight="`ch ^ 32` flips case for ASCII letters because upper/lower differ only in bit 5.",
        java="public String toggle(String s) {\n    char[] c = s.toCharArray();\n    for (int i = 0; i < c.length; i++) {\n        if (c[i] >= 'a' && c[i] <= 'z') c[i] -= 32;\n        else if (c[i] >= 'A' && c[i] <= 'Z') c[i] += 32;\n    }\n    return new String(c);\n}",
        python="def toggle(s: str) -> str:\n    return s.swapcase()",
    ),
    mistakes=["Flipping non-letters.", "Handling only one of the two cases."],
    remember=dict(pattern="ASCII case flip / XOR 32", rules=["Upper +32, lower −32.", "`ch ^ 32` flips letters.", "Skip non-letters."], takeaway="Letters differ by bit 5 — XOR 32 toggles case."),
)

D(
    "strings-equal",
    statement="Given two strings `a` and `b`, return whether they are exactly equal (same length, same characters in order).",
    understanding="Different lengths → not equal. Otherwise compare character by character.",
    examples=[("a = \"abc\", b = \"abc\"", "true", "Identical."), ("a = \"abc\", b = \"abd\"", "false", "Last char differs."), ("a = \"ab\", b = \"abc\"", "false", "Different lengths.")],
    constraints=["0 ≤ a.length, b.length ≤ 10^4"],
    direct_answer="If lengths differ, return false. Else compare each index; the first mismatch returns false. In Java use `.equals`, never `==` (which compares references).",
    approach=dict(
        name="Character comparison",
        time="O(n)", space="O(1)",
        idea="Equality requires identical length and identical characters at every position. The length check short-circuits, then a single pass finds any mismatch. The Java gotcha is `==` comparing object identity, not contents.",
        insight="The `==` vs `.equals` distinction in Java is one of the most common fresher bugs — call it out.",
        java="public boolean equal(String a, String b) {\n    if (a.length() != b.length()) return false;\n    for (int i = 0; i < a.length(); i++) {\n        if (a.charAt(i) != b.charAt(i)) return false;\n    }\n    return true;\n}",
        python="def equal(a: str, b: str) -> bool:\n    return a == b",
    ),
    line_java=[("if (a.length() != b.length()) return false;", "Different lengths can't be equal."), ("if (a.charAt(i) != b.charAt(i)) return false;", "First differing character.")],
    mistakes=["Using `==` on Strings in Java (compares references, not contents).", "Skipping the length check."],
    remember=dict(pattern="Length + char comparison", rules=["Length must match.", "Compare chars in order.", "Java: use .equals, not ==."], takeaway="In Java, == on strings is a reference bug — use .equals."),
)

D(
    "longest-word",
    statement="Given a sentence `s`, return its longest word. If several tie, return the first.",
    understanding="Split into words, then track the longest seen, keeping the earliest on ties.",
    examples=[("s = \"the quick brown fox\"", "\"quick\"", "5 letters, first of the 5-letter words."), ("s = \"a bb ccc\"", "\"ccc\"", "Longest."), ("s = \"hi\"", "\"hi\"", "Only word.")],
    constraints=["1 ≤ s.length ≤ 10^4"],
    direct_answer="Split on spaces and fold a running longest, updating only when a word is strictly longer (so the first of a tie wins).",
    approach=dict(
        name="Running longest",
        time="O(n)", space="O(n)",
        idea="This is the running-maximum pattern over word lengths. Using strict `>` when comparing lengths means a later word of equal length never displaces the earlier one, satisfying the tie rule.",
        java="public String longestWord(String s) {\n    String best = \"\";\n    for (String w : s.split(\" \")) {\n        if (w.length() > best.length()) best = w;\n    }\n    return best;\n}",
        python="def longest_word(s: str) -> str:\n    best = ''\n    for w in s.split():\n        if len(w) > len(best):\n            best = w\n    return best",
    ),
    line_java=[("if (w.length() > best.length()) best = w;", "Strict > keeps the first word on a length tie.")],
    mistakes=["Using `>=` and returning the last tie instead of the first.", "Splitting incorrectly and getting empty tokens."],
    remember=dict(pattern="Running maximum (by length)", rules=["Split into words.", "Strict > for first-on-tie.", "Track the best."], takeaway="Use strict > in running-max when ties should keep the earlier item."),
)

D(
    "remove-duplicate-characters",
    statement="Given a string `s`, return a new string keeping only the first occurrence of each character, preserving order.",
    understanding="Track which characters you've already emitted in a set; append a character only the first time you see it.",
    examples=[("s = \"banana\"", "\"ban\"", "First b,a,n kept."), ("s = \"aabbcc\"", "\"abc\"", "One of each."), ("s = \"abc\"", "\"abc\"", "Already unique.")],
    constraints=["0 ≤ s.length ≤ 10^4"],
    direct_answer="Keep a 'seen' set; for each character, if it isn't in the set, append it and add it. O(n) time, O(k) space.",
    approach=dict(
        name="Seen set build",
        time="O(n)", space="O(k)",
        idea="A set remembers which characters have already been output. Appending only on the first sighting preserves input order and drops every later repeat. This combines the frequency-set and filtered-build patterns.",
        java="public String removeDuplicates(String s) {\n    StringBuilder sb = new StringBuilder();\n    java.util.Set<Character> seen = new java.util.HashSet<>();\n    for (char ch : s.toCharArray()) {\n        if (seen.add(ch)) sb.append(ch);\n    }\n    return sb.toString();\n}",
        python="def remove_duplicates(s: str) -> str:\n    seen = set()\n    out = []\n    for ch in s:\n        if ch not in seen:\n            seen.add(ch)\n            out.append(ch)\n    return ''.join(out)",
    ),
    line_java=[("if (seen.add(ch)) sb.append(ch);", "add returns true only the first time — append exactly once per char.")],
    mistakes=["Not preserving original order (e.g., sorting).", "Using String += in the loop."],
    remember=dict(pattern="Seen-set filtered build", rules=["Append on first sighting.", "Set tracks seen chars.", "Order preserved."], takeaway="First-occurrence-only = a seen set plus a builder."),
)

D(
    "capitalize-words",
    statement="Given a sentence `s`, return it with the first letter of every word capitalised and the rest unchanged.",
    understanding="Capitalise a letter when it is the first character or follows a space.",
    examples=[("s = \"hello world\"", "\"Hello World\"", "Each word's first letter upper."), ("s = \"a b c\"", "\"A B C\"", "Singles capitalised."), ("s = \"hi\"", "\"Hi\"", "First letter.")],
    constraints=["0 ≤ s.length ≤ 10^4"],
    direct_answer="Walk the string tracking whether the previous character was a space (or it's the start). At a word-start letter, upper-case it; otherwise copy as-is.",
    approach=dict(
        name="Word-start uppercase",
        time="O(n)", space="O(n)",
        idea="A letter begins a word when it is the first character or the prior character is a space. Upper-casing exactly those letters capitalises each word without disturbing the rest. Track a small boolean for 'at a word start'.",
        java="public String capitalize(String s) {\n    char[] c = s.toCharArray();\n    boolean start = true;\n    for (int i = 0; i < c.length; i++) {\n        if (c[i] == ' ') {\n            start = true;\n        } else {\n            if (start && c[i] >= 'a' && c[i] <= 'z') c[i] -= 32;\n            start = false;\n        }\n    }\n    return new String(c);\n}",
        python="def capitalize_words(s: str) -> str:\n    out = []\n    start = True\n    for ch in s:\n        if ch == ' ':\n            start = True\n            out.append(ch)\n        else:\n            out.append(ch.upper() if start else ch)\n            start = False\n    return ''.join(out)",
    ),
    line_java=[("if (start && c[i] >= 'a' && c[i] <= 'z') c[i] -= 32;", "Upper-case the first letter of each word.")],
    mistakes=["Capitalising every letter (that's to-uppercase).", "Forgetting the very first word when there's no leading space."],
    remember=dict(pattern="Word-start flag", rules=["Word start = first char or after space.", "Upper-case only those.", "Reset flag on spaces."], takeaway="A 'just saw a space' flag marks where words begin."),
)

D(
    "count-upper-lower",
    statement="Given a string `s`, return how many uppercase and lowercase letters it has, as `[upper, lower]`.",
    understanding="Classify each character by its ASCII range and bump the matching counter.",
    examples=[("s = \"Hello World\"", "[2, 8]", "H,W upper; rest letters lower."), ("s = \"ABC\"", "[3, 0]", "All upper."), ("s = \"abc123\"", "[0, 3]", "Digits ignored.")],
    constraints=["0 ≤ s.length ≤ 10^4"],
    direct_answer="Two counters; for each char test the 'A'..'Z' and 'a'..'z' ranges and increment accordingly. Non-letters are skipped.",
    approach=dict(
        name="Range classify",
        time="O(n)", space="O(1)",
        idea="ASCII ranges separate the two cases: 'A'..'Z' and 'a'..'z'. A single pass with two counters tallies them; anything outside both ranges (digits, spaces, punctuation) is ignored.",
        java="public int[] countCase(String s) {\n    int upper = 0, lower = 0;\n    for (char ch : s.toCharArray()) {\n        if (ch >= 'A' && ch <= 'Z') upper++;\n        else if (ch >= 'a' && ch <= 'z') lower++;\n    }\n    return new int[]{upper, lower};\n}",
        python="def count_case(s: str) -> list[int]:\n    upper = sum(1 for ch in s if ch.isupper())\n    lower = sum(1 for ch in s if ch.islower())\n    return [upper, lower]",
    ),
    mistakes=["Counting digits or spaces as letters.", "Returning counts in the wrong order."],
    remember=dict(pattern="ASCII-range classify", rules=["Upper: A-Z.", "Lower: a-z.", "Skip non-letters."], takeaway="Two ASCII ranges separate uppercase from lowercase."),
)

D(
    "replace-character",
    statement="Given a string `s` and two characters `oldCh` and `newCh`, return `s` with every `oldCh` replaced by `newCh`.",
    understanding="Copy the string, swapping any matching character for the replacement.",
    examples=[("s = \"banana\", old='a', new='o'", "\"bonono\"", "All a's → o."), ("s = \"abc\", old='x', new='y'", "\"abc\"", "No match."), ("s = \"aaa\", old='a', new='b'", "\"bbb\"", "All replaced.")],
    constraints=["0 ≤ s.length ≤ 10^4"],
    direct_answer="Build the result, appending `newCh` where the character equals `oldCh` and the original character otherwise.",
    approach=dict(
        name="Map-and-build",
        time="O(n)", space="O(n)",
        idea="A straightforward transform: each output character is either the replacement (on a match) or the original. One pass with a builder produces the new string; the original is untouched because strings are immutable.",
        java="public String replace(String s, char oldCh, char newCh) {\n    char[] c = s.toCharArray();\n    for (int i = 0; i < c.length; i++) {\n        if (c[i] == oldCh) c[i] = newCh;\n    }\n    return new String(c);\n}",
        python="def replace(s: str, old: str, new: str) -> str:\n    return s.replace(old, new)",
    ),
    mistakes=["Replacing the wrong direction (new with old).", "Using += in a loop instead of a char array/builder."],
    remember=dict(pattern="Map-and-build", rules=["Match → replacement.", "Else → original.", "One pass."], takeaway="Per-character transforms are a single map-and-build pass."),
)

D(
    "reverse-words",
    statement="Given a sentence `s`, return it with the order of the words reversed (single spaces between words, no leading/trailing spaces in the output).",
    understanding="Split into words, reverse the list, and join with single spaces.",
    examples=[("s = \"the quick fox\"", "\"fox quick the\"", "Word order reversed."), ("s = \"hello\"", "\"hello\"", "One word."), ("s = \"a b c\"", "\"c b a\"", "Reversed.")],
    constraints=["1 ≤ s.length ≤ 10^4"],
    direct_answer="Split on whitespace (dropping empties), reverse the array of words, and join with a single space.",
    approach=dict(
        name="Split, reverse, join",
        time="O(n)", space="O(n)",
        idea="Reversing word order — not characters — is cleanest by tokenising into words, reversing that list, and re-joining. Splitting on runs of whitespace naturally handles extra spaces; joining with one space normalises the output.",
        java="public String reverseWords(String s) {\n    String[] words = s.trim().split(\"\\\\s+\");\n    StringBuilder sb = new StringBuilder();\n    for (int i = words.length - 1; i >= 0; i--) {\n        sb.append(words[i]);\n        if (i > 0) sb.append(' ');\n    }\n    return sb.toString();\n}",
        python="def reverse_words(s: str) -> str:\n    return ' '.join(s.split()[::-1])",
    ),
    line_java=[("s.trim().split(\"\\\\s+\")", "Tokenise on runs of whitespace, ignoring extra spaces."), ("for (i = n-1; i >= 0; i--)", "Emit words in reverse order.")],
    mistakes=["Reversing characters instead of words.", "Leaving double spaces from a naive split."],
    remember=dict(pattern="Tokenise → reverse → join", rules=["Split on \\s+.", "Reverse the word list.", "Join with single spaces."], takeaway="Word-level operations start by tokenising into words."),
)

D(
    "check-substring",
    statement="Given two strings `s` and `sub`, return whether `sub` occurs somewhere inside `s` as a contiguous substring.",
    understanding="Slide a window of length |sub| across s and compare; or use the built-in contains/indexOf.",
    examples=[("s = \"hello world\", sub = \"o w\"", "true", "Found at index 4."), ("s = \"abc\", sub = \"d\"", "false", "Absent."), ("s = \"abc\", sub = \"\"", "true", "Empty is always a substring.")],
    constraints=["0 ≤ s.length ≤ 10^4", "0 ≤ sub.length ≤ s.length"],
    direct_answer="Use `s.contains(sub)` / `sub in s`. To show the algorithm, check each start index `i` in `0..n-m` and compare the m characters. O(n·m) naive.",
    approach=dict(
        name="Sliding window compare",
        time="O(n·m)", space="O(1)",
        idea="At each possible starting position in s, check whether the next |sub| characters match sub. The empty string matches everywhere (return true). This brute force is fine for fresher scope; KMP gets it to O(n+m) and is worth naming.",
        insight="Mention KMP/`indexOf` as the O(n+m) upgrade over the O(n·m) scan.",
        java="public boolean contains(String s, String sub) {\n    int n = s.length(), m = sub.length();\n    for (int i = 0; i + m <= n; i++) {\n        int j = 0;\n        while (j < m && s.charAt(i + j) == sub.charAt(j)) j++;\n        if (j == m) return true;\n    }\n    return m == 0;\n}",
        python="def contains(s: str, sub: str) -> bool:\n    return sub in s",
    ),
    line_java=[("for (int i = 0; i + m <= n; i++)", "Try every start where sub could still fit."), ("if (j == m) return true;", "All m characters matched — found it.")],
    mistakes=["Off-by-one on the start range (i + m <= n).", "Not returning true for an empty needle."],
    remember=dict(pattern="Sliding window match", rules=["Try each start 0..n-m.", "Compare m chars.", "Empty needle ⟹ true."], takeaway="Substring search is window matching; KMP makes it linear."),
)

D(
    "count-uppercase-letters",
    statement="Given a string `s`, return how many uppercase letters (`A`–`Z`) it contains.",
    understanding="One pass; bump a counter for each character in the 'A'..'Z' range.",
    examples=[("s = \"Hello World\"", "2", "H and W."), ("s = \"abc\"", "0", "None."), ("s = \"ABC\"", "3", "All upper.")],
    constraints=["0 ≤ s.length ≤ 10^4"],
    direct_answer="Scan and count characters where `ch >= 'A' && ch <= 'Z'`.",
    approach=dict(
        name="Range count",
        time="O(n)", space="O(1)",
        idea="A single counter incremented whenever a character falls in the uppercase ASCII range. Lowercase letters, digits, and symbols are ignored.",
        java="public int countUpper(String s) {\n    int c = 0;\n    for (char ch : s.toCharArray()) {\n        if (ch >= 'A' && ch <= 'Z') c++;\n    }\n    return c;\n}",
        python="def count_upper(s: str) -> int:\n    return sum(1 for ch in s if ch.isupper())",
    ),
    mistakes=["Including lowercase letters by mistake.", "Counting non-letters."],
    remember=dict(pattern="ASCII-range count", rules=["Uppercase: A-Z.", "One counter.", "Skip everything else."], takeaway="Range-membership counting is one comparison per character."),
)


# ── Loops & Patterns ─────────────────────────────────────────────────────────

D(
    "print-1-to-n",
    statement="Given a positive integer `n`, return the numbers from 1 to `n` as a space-separated string.",
    understanding="A single counting loop that appends each number.",
    examples=[("n = 5", "\"1 2 3 4 5\"", "Counts up to 5."), ("n = 1", "\"1\"", "Just one."), ("n = 3", "\"1 2 3\"", "Up to 3.")],
    constraints=["1 ≤ n ≤ 10^5"],
    direct_answer="Loop `i` from 1 to n, appending each `i` to a builder with spaces between.",
    approach=dict(
        name="Counting loop",
        time="O(n)", space="O(n)",
        idea="The most basic loop: run `i` from 1 through n and collect each value. Use a StringBuilder/list join to avoid quadratic string concatenation.",
        java="public String printToN(int n) {\n    StringBuilder sb = new StringBuilder();\n    for (int i = 1; i <= n; i++) {\n        if (i > 1) sb.append(' ');\n        sb.append(i);\n    }\n    return sb.toString();\n}",
        python="def print_to_n(n: int) -> str:\n    return ' '.join(str(i) for i in range(1, n + 1))",
    ),
    mistakes=["Off-by-one: looping to n-1 or starting at 0.", "Trailing or leading space in the output."],
    remember=dict(pattern="Counting loop", rules=["i from 1 to n inclusive.", "Append each value.", "Mind the separators."], takeaway="Inclusive bounds (1..n) are the most common loop off-by-one."),
)

D(
    "print-even-up-to-n",
    statement="Given a positive integer `n`, return all even numbers from 1 to `n` as a space-separated string.",
    understanding="Loop and keep only even values, or step by 2 starting at 2.",
    examples=[("n = 10", "\"2 4 6 8 10\"", "Evens up to 10."), ("n = 5", "\"2 4\"", "Evens up to 5."), ("n = 1", "\"\"", "No evens.")],
    constraints=["1 ≤ n ≤ 10^5"],
    direct_answer="Either filter with `i % 2 == 0`, or more efficiently start at 2 and step by 2.",
    approach=dict(
        name="Step by two",
        time="O(n)", space="O(n)",
        idea="Stepping the loop counter by 2 from 2 visits exactly the even numbers, skipping the odds entirely — slightly cleaner than filtering every value with a modulo test.",
        java="public String printEven(int n) {\n    StringBuilder sb = new StringBuilder();\n    for (int i = 2; i <= n; i += 2) {\n        if (sb.length() > 0) sb.append(' ');\n        sb.append(i);\n    }\n    return sb.toString();\n}",
        python="def print_even(n: int) -> str:\n    return ' '.join(str(i) for i in range(2, n + 1, 2))",
    ),
    mistakes=["Including odd numbers.", "Starting the step at 0 (0 is even but usually excluded here)."],
    remember=dict(pattern="Stepped loop", rules=["Start at 2, step by 2.", "Or filter i % 2 == 0.", "Handle n < 2 → empty."], takeaway="Stepping the counter beats filtering when the pattern is regular."),
)

D(
    "multiplication-table",
    statement="Given an integer `n`, return its multiplication table from 1 to 10 as lines `\"n x i = n*i\"`.",
    understanding="Loop i from 1 to 10 and format each product.",
    examples=[("n = 3", "\"3 x 1 = 3\\n…\\n3 x 10 = 30\"", "Ten lines."), ("n = 5", "\"5 x 1 = 5 …\"", "Table of 5."), ("n = 1", "\"1 x 1 = 1 …\"", "Table of 1.")],
    constraints=["-10^4 ≤ n ≤ 10^4"],
    direct_answer="Loop `i` from 1 to 10, building one line per multiplier with the product `n*i`.",
    approach=dict(
        name="Fixed-count loop",
        time="O(1) (always 10 iterations)", space="O(1)",
        idea="A fixed ten-iteration loop produces the standard table. The only content is formatting each line as `n x i = product`.",
        java="public String table(int n) {\n    StringBuilder sb = new StringBuilder();\n    for (int i = 1; i <= 10; i++) {\n        sb.append(n).append(\" x \").append(i).append(\" = \").append(n * i);\n        if (i < 10) sb.append('\\n');\n    }\n    return sb.toString();\n}",
        python="def table(n: int) -> str:\n    return '\\n'.join(f\"{n} x {i} = {n * i}\" for i in range(1, 11))",
    ),
    mistakes=["Looping to 9 or 11 instead of 10.", "Multiplying by the wrong operand."],
    remember=dict(pattern="Fixed-count loop", rules=["i from 1 to 10.", "Line = n x i = n*i.", "Mind newline placement."], takeaway="A multiplication table is a ten-step formatting loop."),
)

D(
    "sum-of-squares",
    statement="Given a positive integer `n`, return `1² + 2² + … + n²`.",
    understanding="Accumulate i*i across the loop, or use the closed form n(n+1)(2n+1)/6.",
    examples=[("n = 3", "14", "1+4+9."), ("n = 1", "1", "1²."), ("n = 5", "55", "1+4+9+16+25.")],
    constraints=["1 ≤ n ≤ 10^4"],
    direct_answer="Loop summing `i*i` into a `long`, or use the formula `n*(n+1)*(2n+1)/6` for O(1).",
    approach=dict(
        name="Accumulate squares",
        time="O(n)", space="O(1)",
        idea="Add the square of each integer up to n. Use a long accumulator since the sum grows fast. The closed form n(n+1)(2n+1)/6 turns it into O(1) — worth mentioning.",
        insight="The closed form is the standout: O(1) instead of O(n).",
        java="public long sumSquares(int n) {\n    long total = 0;\n    for (int i = 1; i <= n; i++) {\n        total += (long) i * i;\n    }\n    return total;\n}",
        python="def sum_squares(n: int) -> int:\n    return sum(i * i for i in range(1, n + 1))",
    ),
    mistakes=["Overflowing an int accumulator.", "Off-by-one in the loop bound."],
    remember=dict(pattern="Accumulate / closed form", rules=["Sum i*i in long.", "Formula: n(n+1)(2n+1)/6.", "Inclusive bound."], takeaway="Many sums have a closed form that beats the loop."),
)

D(
    "fizzbuzz",
    statement="Given `n`, return a list of strings for 1..n where multiples of 3 are `\"Fizz\"`, multiples of 5 are `\"Buzz\"`, multiples of both are `\"FizzBuzz\"`, and others are the number itself.",
    understanding="Check divisibility by 15 (both) first, then 3, then 5, else the number.",
    examples=[("n = 5", "[\"1\",\"2\",\"Fizz\",\"4\",\"Buzz\"]", "3→Fizz, 5→Buzz."), ("n = 15", "[…,\"FizzBuzz\"]", "15 → FizzBuzz."), ("n = 3", "[\"1\",\"2\",\"Fizz\"]", "First Fizz at 3.")],
    constraints=["1 ≤ n ≤ 10^4"],
    direct_answer="For each i: if divisible by 3 AND 5 → FizzBuzz, else by 3 → Fizz, else by 5 → Buzz, else the number. Check the both-case first.",
    approach=dict(
        name="Ordered divisibility checks",
        time="O(n)", space="O(n)",
        idea="The trap is order: a multiple of 15 is also a multiple of 3 and 5, so you must test the combined condition first (or append 'Fizz'/'Buzz' incrementally). FizzBuzz is the canonical screening question precisely because of this branch ordering.",
        insight="A clean variant builds the word by appending 'Fizz' then 'Buzz' and falls back to the number if empty — no 15 check needed.",
        java="public java.util.List<String> fizzBuzz(int n) {\n    java.util.List<String> out = new java.util.ArrayList<>();\n    for (int i = 1; i <= n; i++) {\n        if (i % 15 == 0) out.add(\"FizzBuzz\");\n        else if (i % 3 == 0) out.add(\"Fizz\");\n        else if (i % 5 == 0) out.add(\"Buzz\");\n        else out.add(String.valueOf(i));\n    }\n    return out;\n}",
        python="def fizzbuzz(n: int) -> list[str]:\n    out = []\n    for i in range(1, n + 1):\n        if i % 15 == 0:\n            out.append(\"FizzBuzz\")\n        elif i % 3 == 0:\n            out.append(\"Fizz\")\n        elif i % 5 == 0:\n            out.append(\"Buzz\")\n        else:\n            out.append(str(i))\n    return out",
    ),
    line_java=[("if (i % 15 == 0) out.add(\"FizzBuzz\");", "Check the combined case first, before 3 and 5.")],
    mistakes=["Checking %3 or %5 before %15, so 15 never prints FizzBuzz.", "Returning ints instead of strings."],
    remember=dict(pattern="Ordered branch (most-specific first)", rules=["Test %15 before %3/%5.", "Else number as string.", "Order is the whole trick."], takeaway="When conditions overlap, test the most specific one first."),
)

D(
    "right-triangle-star",
    statement="Given a positive integer `n`, return a right-angled triangle of `*` with `i` stars on row `i`, rows separated by newlines.",
    understanding="Nested loop: outer row 1..n, inner prints that many stars.",
    examples=[("n = 3", "\"*\\n**\\n***\"", "1, 2, 3 stars."), ("n = 1", "\"*\"", "One star."), ("n = 4", "\"*\\n**\\n***\\n****\"", "Four rows.")],
    constraints=["1 ≤ n ≤ 1000"],
    direct_answer="Outer loop over rows 1..n; inner loop appends `i` stars; add a newline between rows.",
    approach=dict(
        name="Nested loop",
        time="O(n²)", space="O(n²)",
        idea="Star patterns are the introduction to nested loops: the outer loop picks the row, the inner loop draws that row's characters. Here row i has i stars. Manage newlines between (not after) rows.",
        java="public String triangle(int n) {\n    StringBuilder sb = new StringBuilder();\n    for (int i = 1; i <= n; i++) {\n        for (int j = 0; j < i; j++) sb.append('*');\n        if (i < n) sb.append('\\n');\n    }\n    return sb.toString();\n}",
        python="def triangle(n: int) -> str:\n    return '\\n'.join('*' * i for i in range(1, n + 1))",
    ),
    line_java=[("for (int j = 0; j < i; j++) sb.append('*');", "Row i gets i stars.")],
    mistakes=["Inner loop bound wrong (i+1 or i-1 stars).", "Trailing newline after the last row."],
    remember=dict(pattern="Nested loop (rows × cols)", rules=["Outer = rows.", "Inner = count per row.", "Newlines between rows."], takeaway="Patterns = outer loop for rows, inner loop for columns."),
)

D(
    "square-star-pattern",
    statement="Given a positive integer `n`, return an `n × n` square of `*`, rows separated by newlines.",
    understanding="Nested loop where every row has exactly n stars.",
    examples=[("n = 2", "\"**\\n**\"", "2x2 block."), ("n = 3", "\"***\\n***\\n***\"", "3x3 block."), ("n = 1", "\"*\"", "Single star.")],
    constraints=["1 ≤ n ≤ 1000"],
    direct_answer="Outer loop n rows; inner loop appends n stars each; newline between rows.",
    approach=dict(
        name="Nested loop",
        time="O(n²)", space="O(n²)",
        idea="The simplest nested pattern: both dimensions are fixed at n. Each of the n rows contains n stars.",
        java="public String square(int n) {\n    StringBuilder sb = new StringBuilder();\n    for (int i = 0; i < n; i++) {\n        for (int j = 0; j < n; j++) sb.append('*');\n        if (i < n - 1) sb.append('\\n');\n    }\n    return sb.toString();\n}",
        python="def square(n: int) -> str:\n    return '\\n'.join('*' * n for _ in range(n))",
    ),
    mistakes=["Using a triangular inner bound by accident.", "Trailing newline."],
    remember=dict(pattern="Fixed nested loop", rules=["n rows × n cols.", "Constant inner bound.", "Newlines between rows."], takeaway="A square is the nested loop with both bounds equal to n."),
)

D(
    "pyramid-pattern",
    statement="Given `n`, return a centred pyramid of `*`: row `i` has `n-i` leading spaces and `2i-1` stars, rows separated by newlines.",
    understanding="Each row mixes spaces then stars; the counts depend on the row index and n.",
    examples=[("n = 3", "\"  *\\n ***\\n*****\"", "1,3,5 stars centred."), ("n = 1", "\"*\"", "Single."), ("n = 2", "\" *\\n***\"", "1 then 3.")],
    constraints=["1 ≤ n ≤ 1000"],
    direct_answer="For row i (1..n): append `n-i` spaces, then `2i-1` stars, then a newline between rows.",
    approach=dict(
        name="Spaces + stars per row",
        time="O(n²)", space="O(n²)",
        idea="A centred pyramid needs two inner loops per row: one for the leading spaces that push the row toward the centre, one for the odd number of stars. Deriving the counts (`n-i` spaces, `2i-1` stars) from the row index is the exercise.",
        insight="The arithmetic linking row index to space/star counts is what this pattern teaches.",
        java="public String pyramid(int n) {\n    StringBuilder sb = new StringBuilder();\n    for (int i = 1; i <= n; i++) {\n        for (int s = 0; s < n - i; s++) sb.append(' ');\n        for (int j = 0; j < 2 * i - 1; j++) sb.append('*');\n        if (i < n) sb.append('\\n');\n    }\n    return sb.toString();\n}",
        python="def pyramid(n: int) -> str:\n    rows = []\n    for i in range(1, n + 1):\n        rows.append(' ' * (n - i) + '*' * (2 * i - 1))\n    return '\\n'.join(rows)",
    ),
    line_java=[("for (s = 0; s < n - i; s++)", "Leading spaces to centre the row."), ("for (j = 0; j < 2*i - 1; j++)", "Odd number of stars per row.")],
    mistakes=["Wrong space/star formula (off-centre or wrong widths).", "Forgetting the spaces entirely."],
    remember=dict(pattern="Indexed spaces + stars", rules=["Spaces = n − i.", "Stars = 2i − 1.", "Two inner loops."], takeaway="Centred patterns derive counts from the row index."),
)

D(
    "number-triangle",
    statement="Given `n`, return a triangle where row `i` contains the numbers 1..i, e.g. row 3 is `123`. Rows separated by newlines.",
    understanding="Nested loop where the inner loop prints 1..i.",
    examples=[("n = 3", "\"1\\n12\\n123\"", "Increasing per row."), ("n = 1", "\"1\"", "Single."), ("n = 4", "\"1\\n12\\n123\\n1234\"", "Four rows.")],
    constraints=["1 ≤ n ≤ 9"],
    direct_answer="Outer row 1..n; inner loop appends j for j = 1..i; newline between rows.",
    approach=dict(
        name="Nested numeric loop",
        time="O(n²)", space="O(n²)",
        idea="Same nested structure as the star triangle, but the inner loop emits the running number j instead of a fixed star. Capping n at 9 keeps each digit single-character so the columns line up.",
        java="public String numberTriangle(int n) {\n    StringBuilder sb = new StringBuilder();\n    for (int i = 1; i <= n; i++) {\n        for (int j = 1; j <= i; j++) sb.append(j);\n        if (i < n) sb.append('\\n');\n    }\n    return sb.toString();\n}",
        python="def number_triangle(n: int) -> str:\n    return '\\n'.join(''.join(str(j) for j in range(1, i + 1)) for i in range(1, n + 1))",
    ),
    mistakes=["Printing i instead of the running j.", "Off-by-one in the inner bound."],
    remember=dict(pattern="Nested numeric loop", rules=["Outer = rows.", "Inner prints 1..i.", "Newlines between rows."], takeaway="Swap the star for the loop variable to print numbers."),
)

D(
    "fibonacci-series",
    statement="Given `n`, return the first `n` Fibonacci numbers (starting 0, 1) as a list.",
    understanding="Roll two variables forward, collecting each value, exactly n times.",
    examples=[("n = 5", "[0, 1, 1, 2, 3]", "First five."), ("n = 1", "[0]", "Just F(0)."), ("n = 2", "[0, 1]", "First two.")],
    constraints=["1 ≤ n ≤ 90"],
    direct_answer="Maintain `a = 0`, `b = 1`; n times, append `a` then advance `(a, b) → (b, a+b)`. O(n).",
    approach=dict(
        name="Two-variable roll + collect",
        time="O(n)", space="O(n)",
        idea="This is nth-Fibonacci but collecting every value rather than just the last. Append the current `a` before rolling the window forward so the list starts at 0.",
        java="public java.util.List<Long> fibSeries(int n) {\n    java.util.List<Long> out = new java.util.ArrayList<>();\n    long a = 0, b = 1;\n    for (int i = 0; i < n; i++) {\n        out.add(a);\n        long next = a + b;\n        a = b;\n        b = next;\n    }\n    return out;\n}",
        python="def fib_series(n: int) -> list[int]:\n    out = []\n    a, b = 0, 1\n    for _ in range(n):\n        out.append(a)\n        a, b = b, a + b\n    return out",
    ),
    mistakes=["Appending after rolling (skips F(0)).", "Producing n+1 or n-1 terms."],
    remember=dict(pattern="Roll + collect", rules=["Append a before rolling.", "(a,b)→(b,a+b).", "Exactly n appends."], takeaway="Collect-while-rolling turns the nth-value loop into a series."),
)

D(
    "multiples-of-number",
    statement="Given a number `k` and a count `n`, return the first `n` positive multiples of `k` as a list.",
    understanding="Multiply k by 1..n, or keep adding k.",
    examples=[("k = 3, n = 4", "[3, 6, 9, 12]", "3·1..3·4."), ("k = 5, n = 2", "[5, 10]", "First two."), ("k = 1, n = 3", "[1, 2, 3]", "Multiples of 1.")],
    constraints=["1 ≤ n ≤ 10^4", "-10^4 ≤ k ≤ 10^4"],
    direct_answer="Loop i from 1 to n, appending `k * i`.",
    approach=dict(
        name="Index times k",
        time="O(n)", space="O(n)",
        idea="The i-th multiple is simply k·i, so a single loop multiplying the index by k produces them in order. Adding k repeatedly works too and avoids multiplication.",
        java="public java.util.List<Long> multiples(int k, int n) {\n    java.util.List<Long> out = new java.util.ArrayList<>();\n    for (int i = 1; i <= n; i++) {\n        out.add((long) k * i);\n    }\n    return out;\n}",
        python="def multiples(k: int, n: int) -> list[int]:\n    return [k * i for i in range(1, n + 1)]",
    ),
    mistakes=["Starting at i = 0 (gives a 0 multiple).", "Producing the wrong count."],
    remember=dict(pattern="Index × k", rules=["i from 1 to n.", "Multiple = k·i.", "Or add k each step."], takeaway="The i-th multiple is k·i — index-driven generation."),
)

D(
    "primes-up-to-n",
    statement="Given `n`, return all prime numbers from 2 to `n` (inclusive) as a list.",
    understanding="Test each candidate with trial division to √candidate, or use the Sieve of Eratosthenes for many queries.",
    examples=[("n = 10", "[2, 3, 5, 7]", "Primes ≤ 10."), ("n = 2", "[2]", "Smallest prime."), ("n = 1", "[]", "None ≤ 1.")],
    constraints=["1 ≤ n ≤ 10^6"],
    direct_answer="Either trial-divide each i (O(n√n)) or run the Sieve of Eratosthenes (O(n log log n)) for larger n. Collect every i that stays prime.",
    approach=dict(
        name="Sieve of Eratosthenes",
        time="O(n log log n)", space="O(n)",
        idea="The sieve marks multiples of each found prime as composite, so what remains unmarked is prime. It is dramatically faster than testing each number individually when you need all primes up to n. Start crossing out from p·p since smaller multiples are already marked.",
        insight="Naming the sieve and its near-linear complexity is the strong answer; per-number trial division is the baseline.",
        java="public java.util.List<Integer> primes(int n) {\n    boolean[] composite = new boolean[n + 1];\n    java.util.List<Integer> out = new java.util.ArrayList<>();\n    for (int p = 2; p <= n; p++) {\n        if (!composite[p]) {\n            out.add(p);\n            for (long m = (long) p * p; m <= n; m += p) composite[(int) m] = true;\n        }\n    }\n    return out;\n}",
        python="def primes(n: int) -> list[int]:\n    if n < 2:\n        return []\n    composite = [False] * (n + 1)\n    out = []\n    for p in range(2, n + 1):\n        if not composite[p]:\n            out.append(p)\n            for m in range(p * p, n + 1, p):\n                composite[m] = True\n    return out",
    ),
    line_java=[("if (!composite[p]) { out.add(p); …", "An unmarked number is prime; record it."), ("for (m = p*p; m <= n; m += p)", "Cross out its multiples, starting at p².")],
    mistakes=["Starting the inner crossing-out at 2p instead of p² (slower but still correct).", "Returning primes for n < 2."],
    remember=dict(pattern="Sieve of Eratosthenes", rules=["Unmarked ⟹ prime.", "Cross multiples from p².", "O(n log log n)."], takeaway="Need all primes up to n? Sieve, don't trial-divide each."),
)

# ── Searching & Sorting ──────────────────────────────────────────────────────

D(
    "binary-search",
    statement="Given a sorted (ascending) array `nums` and a `target`, return its index, or `-1` if absent.",
    understanding="Repeatedly halve the search range by comparing the middle element with the target.",
    examples=[("nums = [1,3,5,7,9], target = 7", "3", "7 is at index 3."), ("nums = [1,3,5], target = 4", "-1", "Absent."), ("nums = [2], target = 2", "0", "Found.")],
    constraints=["0 ≤ nums.length ≤ 10^5", "Array sorted ascending"],
    direct_answer="Maintain `lo` and `hi`. Compute `mid = lo + (hi-lo)/2`; if `nums[mid] == target` return mid; if smaller search right, else search left. O(log n).",
    approach=dict(
        name="Iterative binary search",
        time="O(log n)", space="O(1)",
        idea="Sorted order lets you discard half the range each step: comparing the middle to the target tells you which half can possibly contain it. Use `lo + (hi-lo)/2` for the midpoint to avoid `lo+hi` overflow, and keep the bounds discipline consistent.",
        insight="The overflow-safe midpoint and the inclusive `lo <= hi` loop are the details interviewers probe.",
        java="public int binarySearch(int[] nums, int target) {\n    int lo = 0, hi = nums.length - 1;\n    while (lo <= hi) {\n        int mid = lo + (hi - lo) / 2;\n        if (nums[mid] == target) return mid;\n        if (nums[mid] < target) lo = mid + 1;\n        else hi = mid - 1;\n    }\n    return -1;\n}",
        python="def binary_search(nums: list[int], target: int) -> int:\n    lo, hi = 0, len(nums) - 1\n    while lo <= hi:\n        mid = lo + (hi - lo) // 2\n        if nums[mid] == target:\n            return mid\n        if nums[mid] < target:\n            lo = mid + 1\n        else:\n            hi = mid - 1\n    return -1",
    ),
    line_java=[("int mid = lo + (hi - lo) / 2;", "Overflow-safe midpoint."), ("if (nums[mid] < target) lo = mid + 1;", "Target is in the right half; discard the left.")],
    mistakes=["`(lo + hi) / 2` overflowing for large indices.", "Wrong loop condition (`lo < hi`) skipping a valid match.", "Forgetting to move past mid, causing an infinite loop."],
    remember=dict(pattern="Halve the search space", rules=["mid = lo + (hi-lo)/2.", "Loop while lo ≤ hi.", "Move lo/hi past mid."], takeaway="Binary search is the O(log n) reward for sorted data."),
    frequency="high",
)

D(
    "bubble-sort",
    statement="Given an integer array `nums`, sort it ascending using bubble sort (in place).",
    understanding="Repeatedly swap adjacent out-of-order pairs; each pass 'bubbles' the largest remaining element to the end.",
    examples=[("nums = [3, 1, 2]", "[1, 2, 3]", "Sorted."), ("nums = [1]", "[1]", "Already sorted."), ("nums = [2, 1]", "[1, 2]", "One swap.")],
    constraints=["0 ≤ nums.length ≤ 10^3"],
    direct_answer="Nested loops: on each pass compare adjacent pairs and swap if out of order. An early-exit flag stops once a pass makes no swaps. O(n²) worst case.",
    approach=dict(
        name="Adjacent-swap passes",
        time="O(n²)", space="O(1)",
        idea="Each pass walks the array swapping neighbours that are out of order, which floats the largest unsorted value to its final spot. Tracking whether any swap happened lets you stop early on an already-sorted array (best case O(n)).",
        java="public void bubbleSort(int[] nums) {\n    for (int i = 0; i < nums.length - 1; i++) {\n        boolean swapped = false;\n        for (int j = 0; j < nums.length - 1 - i; j++) {\n            if (nums[j] > nums[j + 1]) {\n                int t = nums[j];\n                nums[j] = nums[j + 1];\n                nums[j + 1] = t;\n                swapped = true;\n            }\n        }\n        if (!swapped) break;\n    }\n}",
        python="def bubble_sort(nums: list[int]) -> None:\n    n = len(nums)\n    for i in range(n - 1):\n        swapped = False\n        for j in range(n - 1 - i):\n            if nums[j] > nums[j + 1]:\n                nums[j], nums[j + 1] = nums[j + 1], nums[j]\n                swapped = True\n        if not swapped:\n            break",
    ),
    line_java=[("for (j = 0; j < n - 1 - i; j++)", "The last i elements are already in place — skip them."), ("if (!swapped) break;", "No swaps means the array is sorted; stop early.")],
    mistakes=["Skipping the early-exit and always running O(n²).", "Inner bound not shrinking (n-1-i), redoing settled elements."],
    remember=dict(pattern="Adjacent-swap passes", rules=["Swap out-of-order neighbours.", "Shrink inner bound by i.", "Early exit on a clean pass."], takeaway="Bubble sort: the largest bubbles to the end each pass."),
)

D(
    "selection-sort",
    statement="Given an integer array `nums`, sort it ascending using selection sort (in place).",
    understanding="Repeatedly find the minimum of the unsorted suffix and swap it to the front of that suffix.",
    examples=[("nums = [3, 1, 2]", "[1, 2, 3]", "Sorted."), ("nums = [5, 4]", "[4, 5]", "One selection."), ("nums = [1]", "[1]", "Trivial.")],
    constraints=["0 ≤ nums.length ≤ 10^3"],
    direct_answer="For each position i, scan i..n-1 for the minimum index, then swap it into position i. O(n²) comparisons, at most n swaps.",
    approach=dict(
        name="Select-min and swap",
        time="O(n²)", space="O(1)",
        idea="The array grows a sorted prefix one element at a time: find the smallest remaining value and place it next. It always does O(n²) comparisons but only O(n) swaps, which matters when writes are expensive.",
        java="public void selectionSort(int[] nums) {\n    for (int i = 0; i < nums.length - 1; i++) {\n        int min = i;\n        for (int j = i + 1; j < nums.length; j++) {\n            if (nums[j] < nums[min]) min = j;\n        }\n        int t = nums[i];\n        nums[i] = nums[min];\n        nums[min] = t;\n    }\n}",
        python="def selection_sort(nums: list[int]) -> None:\n    n = len(nums)\n    for i in range(n - 1):\n        m = i\n        for j in range(i + 1, n):\n            if nums[j] < nums[m]:\n                m = j\n        nums[i], nums[m] = nums[m], nums[i]",
    ),
    line_java=[("if (nums[j] < nums[min]) min = j;", "Track the index of the smallest remaining element."), ("swap nums[i], nums[min]", "Place the minimum at the front of the unsorted part.")],
    mistakes=["Swapping values instead of tracking the min index.", "Starting the inner scan at i instead of i+1 (harmless but wasteful)."],
    remember=dict(pattern="Select-min, swap", rules=["Find min of suffix.", "Swap to position i.", "≤ n swaps total."], takeaway="Selection sort minimises swaps at the cost of always O(n²) compares."),
)

D(
    "insertion-sort",
    statement="Given an integer array `nums`, sort it ascending using insertion sort (in place).",
    understanding="Grow a sorted prefix by inserting each next element into its correct spot, shifting larger elements right.",
    examples=[("nums = [3, 1, 2]", "[1, 2, 3]", "Sorted."), ("nums = [1, 2, 3]", "[1, 2, 3]", "Already sorted → O(n)."), ("nums = [2, 1]", "[1, 2]", "One insert.")],
    constraints=["0 ≤ nums.length ≤ 10^3"],
    direct_answer="For each element, shift the larger elements of the sorted prefix one step right and drop the element into the gap. O(n²) worst, O(n) on nearly-sorted input.",
    approach=dict(
        name="Shift-and-insert",
        time="O(n²)", space="O(1)",
        idea="Treat the left part as sorted. Take the next element (the 'key'), slide every larger sorted element one position right, and place the key in the opened slot. On nearly-sorted data few shifts happen, giving near-linear time — its real strength.",
        java="public void insertionSort(int[] nums) {\n    for (int i = 1; i < nums.length; i++) {\n        int key = nums[i];\n        int j = i - 1;\n        while (j >= 0 && nums[j] > key) {\n            nums[j + 1] = nums[j];\n            j--;\n        }\n        nums[j + 1] = key;\n    }\n}",
        python="def insertion_sort(nums: list[int]) -> None:\n    for i in range(1, len(nums)):\n        key = nums[i]\n        j = i - 1\n        while j >= 0 and nums[j] > key:\n            nums[j + 1] = nums[j]\n            j -= 1\n        nums[j + 1] = key",
    ),
    line_java=[("while (j >= 0 && nums[j] > key)", "Shift larger sorted elements right to open a slot."), ("nums[j + 1] = key;", "Drop the key into its correct position.")],
    mistakes=["Overwriting the key before shifting (save it first).", "Off-by-one when placing the key (j+1)."],
    remember=dict(pattern="Shift-and-insert", rules=["Sorted prefix grows.", "Shift larger elements right.", "Fast on nearly-sorted data."], takeaway="Insertion sort shines when the data is almost sorted."),
)

D(
    "count-greater-than-x",
    statement="Given an integer array `nums` and a value `x`, return how many elements are strictly greater than `x`.",
    understanding="One pass with a counter for elements exceeding x.",
    examples=[("nums = [1, 5, 2, 8], x = 3", "2", "5 and 8."), ("nums = [1, 2], x = 5", "0", "None."), ("nums = [9], x = 0", "1", "9 > 0.")],
    constraints=["0 ≤ nums.length ≤ 10^5"],
    direct_answer="Scan and increment a counter when `nums[i] > x`. O(n). (If sorted, binary search gives O(log n).)",
    approach=dict(
        name="Count with predicate",
        time="O(n)", space="O(1)",
        idea="A filtered count: bump the counter whenever the element passes the `> x` test. Strict `>` excludes elements equal to x.",
        insight="If the array were sorted, binary-searching the first element > x makes this O(log n).",
        java="public int countGreater(int[] nums, int x) {\n    int c = 0;\n    for (int v : nums) {\n        if (v > x) c++;\n    }\n    return c;\n}",
        python="def count_greater(nums: list[int], x: int) -> int:\n    return sum(1 for v in nums if v > x)",
    ),
    mistakes=["Using `>=` and counting elements equal to x.", "Scanning a sorted array linearly when binary search would do."],
    remember=dict(pattern="Predicate count", rules=["Bump on v > x.", "Strict > excludes equals.", "Binary search if sorted."], takeaway="Counting under a predicate is one guarded increment per element."),
)

D(
    "sort-0s-and-1s",
    statement="Given a binary array `nums` of 0s and 1s, sort it in place so all 0s come before all 1s.",
    understanding="Count the zeros and rewrite, or use two pointers to swap 0s to the front.",
    examples=[("nums = [1, 0, 1, 0]", "[0, 0, 1, 1]", "Zeros first."), ("nums = [0, 0]", "[0, 0]", "Already sorted."), ("nums = [1]", "[1]", "Single.")],
    constraints=["1 ≤ nums.length ≤ 10^5", "nums[i] ∈ {0, 1}"],
    direct_answer="Count the zeros, then fill that many 0s followed by 1s. O(n) time, O(1) space, single value-write pass.",
    approach=dict(
        name="Count and overwrite",
        time="O(n)", space="O(1)",
        idea="With only two values, sorting reduces to counting. Count the zeros in one pass, then write that many 0s and the rest 1s. This beats a comparison sort and is simpler than the two-pointer swap (which also works).",
        java="public void sortBinary(int[] nums) {\n    int zeros = 0;\n    for (int v : nums) if (v == 0) zeros++;\n    for (int i = 0; i < nums.length; i++) {\n        nums[i] = i < zeros ? 0 : 1;\n    }\n}",
        python="def sort_binary(nums: list[int]) -> None:\n    zeros = nums.count(0)\n    for i in range(len(nums)):\n        nums[i] = 0 if i < zeros else 1",
    ),
    line_java=[("for (int v : nums) if (v == 0) zeros++;", "Count the zeros."), ("nums[i] = i < zeros ? 0 : 1;", "First `zeros` slots are 0, the rest 1.")],
    mistakes=["Reaching for a full O(n log n) sort on binary data.", "Off-by-one on the zero-count boundary."],
    remember=dict(pattern="Counting sort (2 values)", rules=["Count the zeros.", "Write 0s then 1s.", "O(n), no comparisons."], takeaway="Few distinct values? Count and overwrite, don't comparison-sort."),
)

D(
    "kth-smallest",
    statement="Given an integer array `nums` and `k` (1-indexed), return the k-th smallest element.",
    understanding="Sorting and indexing at k-1 is the simple O(n log n) answer; a heap or quickselect can do better.",
    examples=[("nums = [3, 1, 2], k = 2", "2", "Sorted [1,2,3], 2nd is 2."), ("nums = [5], k = 1", "5", "Only element."), ("nums = [4, 4, 4], k = 2", "4", "Duplicates count.")],
    constraints=["1 ≤ k ≤ nums.length ≤ 10^4"],
    direct_answer="Sort ascending and return `nums[k-1]`. O(n log n). For large data, quickselect is O(n) average and a min-heap is O(n + k log n).",
    approach=dict(
        name="Sort and index",
        time="O(n log n)", space="O(1) – O(n)",
        idea="The k-th smallest sits at index k−1 once the array is sorted. Sorting is the clean, correct baseline. Mention quickselect (average O(n)) as the optimisation when only one order statistic is needed.",
        insight="Naming quickselect / a bounded heap shows you know sorting isn't always necessary for a single order statistic.",
        java="public int kthSmallest(int[] nums, int k) {\n    int[] copy = nums.clone();\n    java.util.Arrays.sort(copy);\n    return copy[k - 1];\n}",
        python="def kth_smallest(nums: list[int], k: int) -> int:\n    return sorted(nums)[k - 1]",
    ),
    line_java=[("java.util.Arrays.sort(copy);", "Order the elements ascending."), ("return copy[k - 1];", "1-indexed k maps to array index k-1.")],
    mistakes=["Off-by-one: returning nums[k] instead of nums[k-1].", "Mutating the caller's array when a copy is expected."],
    remember=dict(pattern="Sort then index (order statistic)", rules=["Sort ascending.", "k-th smallest = index k-1.", "Quickselect for O(n)."], takeaway="k-th smallest = sort and index; quickselect if you need speed."),
)

D(
    "first-last-occurrence",
    statement="Given an integer array `nums` and a `target`, return the first and last indices where `target` occurs, as `[first, last]`, or `[-1, -1]` if absent.",
    understanding="Scan once, recording the first match index and updating the last match index on every hit.",
    examples=[("nums = [1, 2, 2, 3, 2], target = 2", "[1, 4]", "First at 1, last at 4."), ("nums = [1, 2, 3], target = 5", "[-1, -1]", "Absent."), ("nums = [4], target = 4", "[0, 0]", "Single hit.")],
    constraints=["0 ≤ nums.length ≤ 10^5"],
    direct_answer="Track `first = -1` and `last = -1`. On each match, set `first` only if it's still -1, and always update `last`. O(n). (Sorted → two binary searches, O(log n).)",
    approach=dict(
        name="Single-pass first/last",
        time="O(n)", space="O(1)",
        idea="One scan suffices: the earliest match is recorded once (guarded by the -1 check), and the latest match is whatever the final hit was. If no match ever occurs, both stay -1.",
        insight="On a sorted array, two binary searches (leftmost and rightmost) give O(log n) — the classic follow-up.",
        java="public int[] firstLast(int[] nums, int target) {\n    int first = -1, last = -1;\n    for (int i = 0; i < nums.length; i++) {\n        if (nums[i] == target) {\n            if (first == -1) first = i;\n            last = i;\n        }\n    }\n    return new int[]{first, last};\n}",
        python="def first_last(nums: list[int], target: int) -> list[int]:\n    first = last = -1\n    for i, v in enumerate(nums):\n        if v == target:\n            if first == -1:\n                first = i\n            last = i\n    return [first, last]",
    ),
    line_java=[("if (first == -1) first = i;", "Record the first match only once."), ("last = i;", "Always overwrite with the most recent match.")],
    mistakes=["Overwriting `first` on every match (loses the earliest).", "Returning [0, 0] instead of [-1, -1] when absent."],
    remember=dict(pattern="Single-pass first/last", rules=["Guard first with -1.", "Always update last.", "Both -1 if absent."], takeaway="One scan can capture both the first and last occurrence."),
)


# ── Recursion ────────────────────────────────────────────────────────────────

D(
    "factorial-recursion",
    statement="Given a non-negative integer `n`, compute `n!` (n factorial) recursively.",
    understanding="Define factorial in terms of a smaller factorial: n! = n · (n-1)!, with 0! = 1 as the base case.",
    examples=[("n = 5", "120", "5·4·3·2·1."), ("n = 0", "1", "Base case."), ("n = 1", "1", "1! = 1.")],
    constraints=["0 ≤ n ≤ 20 (fits in a 64-bit long)"],
    direct_answer="Base case: `n <= 1` returns 1. Recursive case: return `n * factorial(n-1)`. Use `long` since factorials grow fast.",
    approach=dict(
        name="Linear recursion",
        time="O(n)", space="O(n) call stack",
        idea="The textbook first recursion: the answer for n is n times the answer for n−1, and the recursion bottoms out at 0! = 1. Every recursive solution needs this pairing — a base case that stops the descent and a recursive case that shrinks the problem.",
        insight="20! is the largest factorial fitting in a signed 64-bit long; beyond that you need BigInteger.",
        java="public long factorial(int n) {\n    if (n <= 1) return 1;\n    return (long) n * factorial(n - 1);\n}",
        python="def factorial(n: int) -> int:\n    if n <= 1:\n        return 1\n    return n * factorial(n - 1)",
    ),
    line_java=[("if (n <= 1) return 1;", "Base case stops the recursion."), ("return (long) n * factorial(n - 1);", "Recursive case shrinks n by one.")],
    mistakes=["Missing base case → infinite recursion / stack overflow.", "Using int and overflowing past 12!."],
    remember=dict(pattern="Base case + shrink", rules=["0!/1! = 1.", "n! = n·(n-1)!.", "Use long."], takeaway="Every recursion = a base case plus a smaller subproblem."),
    frequency="high",
)

D(
    "fibonacci-recursion",
    statement="Given `n` (0-indexed), compute the n-th Fibonacci number recursively. F(0)=0, F(1)=1.",
    understanding="F(n) = F(n-1) + F(n-2) with two base cases. The naive recursion is exponential — memoise to fix it.",
    examples=[("n = 6", "8", "0,1,1,2,3,5,8."), ("n = 0", "0", "Base case."), ("n = 1", "1", "Base case.")],
    constraints=["0 ≤ n ≤ 40 (naive); larger needs memoisation"],
    direct_answer="Base cases F(0)=0, F(1)=1; else `fib(n-1) + fib(n-2)`. Naive is O(2ⁿ); add a memo array/map for O(n).",
    approach=dict(
        name="Two-branch recursion (+ memo)",
        time="O(2ⁿ) naive, O(n) memoised", space="O(n)",
        idea="Fibonacci is the canonical example of recursion that re-computes overlapping subproblems: fib(n-2) is evaluated twice, blowing up exponentially. Caching each result (memoisation) collapses it to linear and is the expected upgrade.",
        insight="The interview point isn't the recurrence — it's recognising the exponential blow-up and fixing it with memoisation or iteration.",
        java="public long fib(int n) {\n    if (n < 2) return n;\n    return fib(n - 1) + fib(n - 2);\n}\n// Memoised: cache results in a long[] indexed by n.",
        python="def fib(n: int) -> int:\n    if n < 2:\n        return n\n    return fib(n - 1) + fib(n - 2)\n# Or: from functools import lru_cache and decorate.",
    ),
    line_java=[("if (n < 2) return n;", "Handles both F(0)=0 and F(1)=1."), ("return fib(n - 1) + fib(n - 2);", "Two recursive branches — the source of the blow-up.")],
    mistakes=["Leaving the naive O(2ⁿ) version for large n.", "Only one base case, mishandling n = 0 or 1."],
    remember=dict(pattern="Overlapping subproblems → memoise", rules=["F(0)=0, F(1)=1.", "Naive is exponential.", "Memoise → O(n)."], takeaway="Recursion with repeated subproblems begs for memoisation."),
    frequency="high",
)

D(
    "sum-n-recursion",
    statement="Given a non-negative integer `n`, compute `1 + 2 + … + n` recursively.",
    understanding="sum(n) = n + sum(n-1), bottoming out at sum(0) = 0.",
    examples=[("n = 5", "15", "1+2+3+4+5."), ("n = 0", "0", "Base case."), ("n = 1", "1", "Just 1.")],
    constraints=["0 ≤ n ≤ 10^5 (watch stack depth)"],
    direct_answer="Base case `n == 0` returns 0; else return `n + sum(n-1)`. Closed form n(n+1)/2 avoids recursion entirely.",
    approach=dict(
        name="Linear recursion",
        time="O(n)", space="O(n) stack",
        idea="A direct translation of the recurrence sum(n) = n + sum(n−1). Conceptually clean, but note that for large n the call stack is the limiting factor — the iterative loop or the closed form n(n+1)/2 is safer.",
        insight="Mentioning the O(1) closed form shows you know recursion isn't always the right tool.",
        java="public long sumTo(int n) {\n    if (n == 0) return 0;\n    return n + sumTo(n - 1);\n}",
        python="def sum_to(n: int) -> int:\n    if n == 0:\n        return 0\n    return n + sum_to(n - 1)",
    ),
    mistakes=["No base case → stack overflow.", "Deep recursion blowing the stack for large n."],
    remember=dict(pattern="Base case + shrink", rules=["sum(0)=0.", "sum(n)=n+sum(n-1).", "Closed form n(n+1)/2."], takeaway="Recursion mirrors the math, but a closed form may beat it."),
)

D(
    "reverse-string-recursion",
    statement="Given a string `s`, return it reversed, using recursion.",
    understanding="Reverse the rest of the string, then append the first character — or swap ends moving inward.",
    examples=[("s = \"abc\"", "\"cba\"", "Reversed."), ("s = \"\"", "\"\"", "Base case."), ("s = \"x\"", "\"x\"", "Single char.")],
    constraints=["0 ≤ s.length ≤ 10^4"],
    direct_answer="Base case: empty or single-char string returns itself. Recursive case: `reverse(s[1:]) + s[0]`.",
    approach=dict(
        name="Reverse-rest + prepend-first",
        time="O(n²) (string concat) / O(n) with chars", space="O(n) stack",
        idea="Peel off the first character, reverse everything after it, then put the first character at the end. The base case (length ≤ 1) returns the string unchanged. It demonstrates recursion on strings cleanly, though naive concatenation is quadratic — a char-array swap is the efficient form.",
        java="public String reverse(String s) {\n    if (s.length() <= 1) return s;\n    return reverse(s.substring(1)) + s.charAt(0);\n}",
        python="def reverse(s: str) -> str:\n    if len(s) <= 1:\n        return s\n    return reverse(s[1:]) + s[0]",
    ),
    line_java=[("if (s.length() <= 1) return s;", "Base case: nothing to reverse."), ("return reverse(s.substring(1)) + s.charAt(0);", "Reverse the tail, then append the head.")],
    mistakes=["Forgetting the base case.", "Appending the first char at the front instead of the end."],
    remember=dict(pattern="Reverse-rest + append-first", rules=["len ≤ 1 → return s.", "reverse(tail)+head.", "Char swap for O(n)."], takeaway="String recursion: solve the tail, then attach the head."),
)

D(
    "power-recursion",
    statement="Given a base `x` and non-negative integer exponent `n`, compute `xⁿ` recursively.",
    understanding="xⁿ = x · xⁿ⁻¹ (linear), or use fast exponentiation: xⁿ = (xⁿ/²)² for O(log n).",
    examples=[("x = 2, n = 10", "1024", "2¹⁰."), ("x = 5, n = 0", "1", "Anything⁰ = 1."), ("x = 3, n = 3", "27", "3³.")],
    constraints=["0 ≤ n ≤ 30", "results fit in 64-bit"],
    direct_answer="Base case `n == 0` returns 1. Linear: `x * power(x, n-1)`. Fast: square `power(x, n/2)` and multiply by x if n is odd → O(log n).",
    approach=dict(
        name="Fast exponentiation",
        time="O(log n) fast / O(n) linear", space="O(log n) stack",
        idea="Halving the exponent each step (exponentiation by squaring) turns O(n) multiplications into O(log n): compute the half-power once, square it, and multiply by an extra x when the exponent is odd. This is the standout technique behind modular exponentiation.",
        insight="Knowing the O(log n) squaring trick — not just the linear recurrence — is the differentiator here.",
        java="public long power(long x, int n) {\n    if (n == 0) return 1;\n    long half = power(x, n / 2);\n    long sq = half * half;\n    return (n % 2 == 0) ? sq : sq * x;\n}",
        python="def power(x: int, n: int) -> int:\n    if n == 0:\n        return 1\n    half = power(x, n // 2)\n    return half * half if n % 2 == 0 else half * half * x",
    ),
    line_java=[("long half = power(x, n / 2);", "Compute the half-power once."), ("return (n % 2 == 0) ? sq : sq * x;", "Square it; multiply by x for odd exponents.")],
    mistakes=["Calling power(x, n/2) twice (loses the O(log n) gain).", "Missing the odd-exponent correction."],
    remember=dict(pattern="Exponentiation by squaring", rules=["x⁰ = 1.", "Halve the exponent.", "Extra ×x when odd."], takeaway="Squaring the half-power gives O(log n) exponentiation."),
)

D(
    "sum-digits-recursion",
    statement="Given a non-negative integer `n`, compute the sum of its digits recursively.",
    understanding="The last digit is n%10; the rest is n/10. sum(n) = n%10 + sum(n/10), base case n == 0 → 0.",
    examples=[("n = 1234", "10", "1+2+3+4."), ("n = 0", "0", "Base case."), ("n = 9", "9", "Single digit.")],
    constraints=["0 ≤ n ≤ 10^9"],
    direct_answer="Base case `n == 0` returns 0; else return `n % 10 + sumDigits(n / 10)`.",
    approach=dict(
        name="Peel last digit",
        time="O(d) digits", space="O(d) stack",
        idea="`n % 10` extracts the last digit and `n / 10` drops it, so each recursive call shortens the number by one digit until nothing remains. The same peel-the-last-digit idea underlies digit-counting and reversal.",
        java="public int sumDigits(int n) {\n    if (n == 0) return 0;\n    return n % 10 + sumDigits(n / 10);\n}",
        python="def sum_digits(n: int) -> int:\n    if n == 0:\n        return 0\n    return n % 10 + sum_digits(n // 10)",
    ),
    line_java=[("return n % 10 + sumDigits(n / 10);", "Add the last digit, recurse on the rest.")],
    mistakes=["Negative inputs not handled (take abs first if allowed).", "Base case at n == 1 instead of n == 0."],
    remember=dict(pattern="Peel last digit", rules=["digit = n%10.", "rest = n/10.", "Base n==0 → 0."], takeaway="%10 and /10 peel digits one at a time."),
)

D(
    "print-n-to-1-recursion",
    statement="Given a positive integer `n`, return the numbers from `n` down to 1 as a space-separated string, using recursion.",
    understanding="Print n, then recurse on n-1. The order of work vs. recursive call controls ascending vs descending output.",
    examples=[("n = 3", "\"3 2 1\"", "Descending."), ("n = 1", "\"1\"", "Single."), ("n = 5", "\"5 4 3 2 1\"", "Down to 1.")],
    constraints=["1 ≤ n ≤ 10^4"],
    direct_answer="Append `n`, then recurse on `n-1`; stop when `n < 1`. Swapping the two lines would print 1..n ascending instead.",
    approach=dict(
        name="Pre-order recursion",
        time="O(n)", space="O(n) stack",
        idea="Doing the work (emitting n) before the recursive call yields a descending sequence; doing it after yields ascending. This contrast — pre-order vs post-order in the call stack — is the lesson of the problem.",
        insight="Where you place the 'visit' relative to the recursive call flips the output order — a classic recursion insight.",
        java="public String countDown(int n) {\n    StringBuilder sb = new StringBuilder();\n    helper(n, sb);\n    return sb.toString().trim();\n}\nprivate void helper(int n, StringBuilder sb) {\n    if (n < 1) return;\n    sb.append(n).append(' ');\n    helper(n - 1, sb);\n}",
        python="def count_down(n: int) -> str:\n    if n < 1:\n        return \"\"\n    rest = count_down(n - 1)\n    return f\"{n} {rest}\".strip()",
    ),
    line_java=[("sb.append(n).append(' ');", "Visit n before recursing → descending order."), ("helper(n - 1, sb);", "Recurse on the smaller value.")],
    mistakes=["Recursing before appending (prints ascending).", "Missing base case n < 1."],
    remember=dict(pattern="Pre-order vs post-order", rules=["Visit then recurse = descending.", "Recurse then visit = ascending.", "Base n<1."], takeaway="Work-before-recursion vs after flips the output order."),
)

D(
    "gcd-recursion",
    statement="Given two non-negative integers `a` and `b`, compute their greatest common divisor recursively (Euclid's algorithm).",
    understanding="gcd(a, b) = gcd(b, a mod b), bottoming out when b == 0 (then a is the answer).",
    examples=[("a = 12, b = 18", "6", "gcd is 6."), ("a = 7, b = 0", "7", "Base case."), ("a = 5, b = 1", "1", "Coprime.")],
    constraints=["0 ≤ a, b ≤ 10^9"],
    direct_answer="Base case `b == 0` returns `a`; else return `gcd(b, a % b)`. Euclid's algorithm — O(log min(a,b)).",
    approach=dict(
        name="Euclid's algorithm",
        time="O(log min(a,b))", space="O(log) stack",
        idea="The GCD of a and b equals the GCD of b and the remainder a mod b, because any common divisor of a and b also divides the remainder. Each step shrinks the numbers quickly, so it converges in logarithmic steps — far faster than testing divisors.",
        insight="LCM follows immediately: lcm(a,b) = a / gcd(a,b) * b.",
        java="public long gcd(long a, long b) {\n    if (b == 0) return a;\n    return gcd(b, a % b);\n}",
        python="def gcd(a: int, b: int) -> int:\n    if b == 0:\n        return a\n    return gcd(b, a % b)",
    ),
    line_java=[("if (b == 0) return a;", "When the remainder hits 0, a is the GCD."), ("return gcd(b, a % b);", "Replace (a,b) with (b, a mod b).")],
    mistakes=["Swapping the arguments wrongly (gcd(a % b, b) loops).", "Dividing by zero by mishandling b == 0."],
    remember=dict(pattern="Euclid's algorithm", rules=["gcd(a,0)=a.", "gcd(a,b)=gcd(b,a%b).", "O(log) steps."], takeaway="Euclid: replace the pair with (b, a mod b) until b is 0."),
    frequency="high",
)

# ── Bit Tricks & Misc ────────────────────────────────────────────────────────

D(
    "power-of-two",
    statement="Given an integer `n`, return true if it is a power of two (1, 2, 4, 8, …), else false.",
    understanding="A power of two has exactly one set bit. The trick `n & (n-1) == 0` clears the lowest set bit and tests if nothing remains.",
    examples=[("n = 16", "true", "2⁴."), ("n = 6", "false", "Two set bits."), ("n = 1", "true", "2⁰.")],
    constraints=["-2^31 ≤ n ≤ 2^31 - 1"],
    direct_answer="Return `n > 0 && (n & (n - 1)) == 0`. The positive check rules out 0 and negatives.",
    approach=dict(
        name="Clear-lowest-bit trick",
        time="O(1)", space="O(1)",
        idea="A power of two in binary is a single 1 followed by zeros (e.g. 1000). Subtracting 1 flips that bit to 0 and all lower bits to 1 (0111), so ANDing them gives 0. Any number with more than one set bit leaves a non-zero result. Guard with `n > 0` because 0 and negatives would falsely pass.",
        insight="`n & (n-1)` clearing the lowest set bit is one of the most reused bit tricks — also counts bits and detects powers of two.",
        java="public boolean isPowerOfTwo(int n) {\n    return n > 0 && (n & (n - 1)) == 0;\n}",
        python="def is_power_of_two(n: int) -> bool:\n    return n > 0 and (n & (n - 1)) == 0",
    ),
    line_java=[("return n > 0 && (n & (n - 1)) == 0;", "Positive AND only one set bit ⟹ power of two.")],
    mistakes=["Forgetting `n > 0`, so 0 wrongly returns true.", "Using a loop dividing by 2 (works but misses the bit insight)."],
    remember=dict(pattern="n & (n-1) clears lowest bit", rules=["Power of two = one set bit.", "n & (n-1) == 0.", "Require n > 0."], takeaway="n & (n-1) == 0 (and n>0) tests for a power of two."),
)

D(
    "count-set-bits",
    statement="Given a non-negative integer `n`, count the number of 1-bits in its binary representation (the Hamming weight).",
    understanding="Repeatedly clear the lowest set bit with `n & (n-1)`, counting how many times until n becomes 0.",
    examples=[("n = 7", "3", "111 has three 1s."), ("n = 8", "1", "1000."), ("n = 0", "0", "No set bits.")],
    constraints=["0 ≤ n ≤ 2^31 - 1"],
    direct_answer="Loop: while n != 0, do `n &= (n-1)` and increment a counter. Runs once per set bit — O(set bits).",
    approach=dict(
        name="Brian Kernighan's algorithm",
        time="O(number of set bits)", space="O(1)",
        idea="`n & (n-1)` removes exactly the lowest set bit, so the number of iterations until n hits 0 equals the number of 1-bits. This beats checking all 32 bits when the number is sparse.",
        insight="Built-ins exist (Integer.bitCount / bin(n).count('1')) but the Kernighan loop is the algorithm interviewers want to see.",
        java="public int countBits(int n) {\n    int count = 0;\n    while (n != 0) {\n        n &= (n - 1);\n        count++;\n    }\n    return count;\n}",
        python="def count_bits(n: int) -> int:\n    count = 0\n    while n:\n        n &= n - 1\n        count += 1\n    return count",
    ),
    line_java=[("n &= (n - 1);", "Clears the lowest set bit each iteration."), ("count++;", "One increment per set bit.")],
    mistakes=["Looping a fixed 32 times unnecessarily.", "Infinite loop if you forget to update n."],
    remember=dict(pattern="Kernighan bit-clear loop", rules=["n &= n-1 clears a bit.", "Count iterations.", "Stops at 0."], takeaway="Each n &= n-1 removes one set bit — count the steps."),
)

D(
    "is-bit-set",
    statement="Given an integer `n` and a position `k` (0-indexed from the least significant bit), return true if the k-th bit is 1.",
    understanding="Shift a mask `1 << k` and AND it with n, or shift n right by k and test the lowest bit.",
    examples=[("n = 5, k = 0", "true", "101 → bit 0 is 1."), ("n = 5, k = 1", "false", "bit 1 is 0."), ("n = 5, k = 2", "true", "bit 2 is 1.")],
    constraints=["0 ≤ k ≤ 30", "0 ≤ n ≤ 2^31 - 1"],
    direct_answer="Return `(n & (1 << k)) != 0`, or equivalently `((n >> k) & 1) == 1`.",
    approach=dict(
        name="Mask and test",
        time="O(1)", space="O(1)",
        idea="`1 << k` builds a mask with a single 1 at position k. ANDing with n isolates that bit: a non-zero result means the bit was set. This masking idiom underlies setting, clearing, and toggling bits too.",
        java="public boolean isBitSet(int n, int k) {\n    return (n & (1 << k)) != 0;\n}",
        python="def is_bit_set(n: int, k: int) -> bool:\n    return (n >> k) & 1 == 1",
    ),
    line_java=[("return (n & (1 << k)) != 0;", "Isolate bit k with a shifted mask.")],
    mistakes=["Comparing `(n & mask) == 1` instead of `!= 0` (fails for k > 0).", "Off-by-one in the bit position."],
    remember=dict(pattern="Shifted mask", rules=["mask = 1 << k.", "n & mask != 0.", "Or (n>>k)&1."], takeaway="1<<k builds a single-bit mask to test a position."),
)

D(
    "swap-without-temp",
    statement="Given two integers `a` and `b`, swap their values without using a third (temporary) variable. Return them swapped as `[a, b]`.",
    understanding="XOR swap or arithmetic swap exchanges values in place; in practice a tuple/parallel assignment is clearest.",
    examples=[("a = 3, b = 7", "[7, 3]", "Swapped."), ("a = 0, b = 5", "[5, 0]", "Swapped with zero."), ("a = 4, b = 4", "[4, 4]", "Equal stays equal.")],
    constraints=["-10^9 ≤ a, b ≤ 10^9"],
    direct_answer="XOR swap: `a ^= b; b ^= a; a ^= b;`. Or arithmetic `a = a+b; b = a-b; a = a-b;` (risks overflow). In real code prefer a temp or tuple swap.",
    approach=dict(
        name="XOR swap",
        time="O(1)", space="O(1)",
        idea="XOR is its own inverse, so three chained XORs exchange the two values without extra storage. The arithmetic version (add/subtract) does the same but can overflow. Both are puzzle answers — production code should just use a temp or `a, b = b, a`.",
        insight="The honest senior answer: clarity beats cleverness; a temp variable or tuple swap is preferred unless memory is truly constrained.",
        java="public int[] swap(int a, int b) {\n    a ^= b;\n    b ^= a;\n    a ^= b;\n    return new int[]{a, b};\n}",
        python="def swap(a: int, b: int) -> list[int]:\n    a, b = b, a\n    return [a, b]",
    ),
    line_java=[("a ^= b; b ^= a; a ^= b;", "Three XORs exchange the values in place.")],
    mistakes=["XOR-swapping a variable with itself (same memory) zeroes it.", "Arithmetic swap overflowing for large values."],
    remember=dict(pattern="XOR / arithmetic swap", rules=["XOR is self-inverse.", "Three XORs swap.", "Prefer a temp in real code."], takeaway="XOR swap is a neat trick, but a temp variable is clearer."),
)

D(
    "odd-occurring-number",
    statement="Given an array where every number appears an even number of times except one that appears an odd number of times, find that number.",
    understanding="XOR of all elements cancels the even-occurring ones (x ^ x = 0), leaving only the odd one.",
    examples=[("nums = [1, 2, 1, 2, 3]", "3", "3 appears once."), ("nums = [4, 4, 7]", "7", "7 is odd-count."), ("nums = [9]", "9", "Single element.")],
    constraints=["1 ≤ nums.length ≤ 10^5", "Exactly one element has odd count"],
    direct_answer="XOR every element together; pairs cancel to 0 and the result is the odd-occurring number. O(n) time, O(1) space.",
    approach=dict(
        name="XOR accumulation",
        time="O(n)", space="O(1)",
        idea="XOR has two key properties: x ^ x = 0 and x ^ 0 = x. Folding all elements with XOR cancels every value that appears an even number of times, so whatever survives is the lone odd-count element. No hash map or sorting needed.",
        insight="This O(1)-space XOR trick is the same one behind 'Single Number' — recognising it is the whole point.",
        java="public int oddOccurring(int[] nums) {\n    int x = 0;\n    for (int v : nums) x ^= v;\n    return x;\n}",
        python="def odd_occurring(nums: list[int]) -> int:\n    x = 0\n    for v in nums:\n        x ^= v\n    return x",
    ),
    line_java=[("for (int v : nums) x ^= v;", "Even occurrences cancel; the odd one remains.")],
    mistakes=["Using a hash map (O(n) space) when XOR is O(1).", "Initialising the accumulator to something other than 0."],
    remember=dict(pattern="XOR cancellation", rules=["x ^ x = 0.", "x ^ 0 = x.", "XOR all → odd one."], takeaway="XOR all elements to isolate the odd-count value in O(1) space."),
)

D(
    "decimal-to-binary",
    statement="Given a non-negative integer `n`, return its binary representation as a string (no leading zeros, `\"0\"` for zero).",
    understanding="Repeatedly take n%2 for the next bit and n/2 to shrink, building the string from least to most significant.",
    examples=[("n = 5", "\"101\"", "4+1."), ("n = 0", "\"0\"", "Special case."), ("n = 8", "\"1000\"", "2³.")],
    constraints=["0 ≤ n ≤ 2^31 - 1"],
    direct_answer="If n == 0 return \"0\". Else, while n > 0, prepend `n % 2` and set `n /= 2`. (Built-ins: Integer.toBinaryString / bin(n).)",
    approach=dict(
        name="Repeated division by 2",
        time="O(log n)", space="O(log n)",
        idea="Dividing by 2 and recording the remainder peels off bits from least to most significant — the standard base-conversion algorithm. Collect remainders and reverse, or prepend each one. Handle 0 explicitly so the loop doesn't return an empty string.",
        java="public String toBinary(int n) {\n    if (n == 0) return \"0\";\n    StringBuilder sb = new StringBuilder();\n    while (n > 0) {\n        sb.append(n % 2);\n        n /= 2;\n    }\n    return sb.reverse().toString();\n}",
        python="def to_binary(n: int) -> str:\n    if n == 0:\n        return \"0\"\n    bits = []\n    while n > 0:\n        bits.append(str(n % 2))\n        n //= 2\n    return ''.join(reversed(bits))",
    ),
    line_java=[("sb.append(n % 2); n /= 2;", "Peel the lowest bit, then shrink n."), ("return sb.reverse().toString();", "Bits were collected LSB-first, so reverse.")],
    mistakes=["Returning empty string for n == 0.", "Forgetting to reverse the collected bits."],
    remember=dict(pattern="Repeated mod/div base conversion", rules=["bit = n%2.", "n /= 2.", "Reverse at the end; handle 0."], takeaway="%2 and /2 convert decimal to binary, LSB first."),
)

D(
    "binary-to-decimal",
    statement="Given a binary string `s` (e.g. \"1011\"), return its decimal value as an integer.",
    understanding="Process digits left to right using Horner's method: result = result*2 + bit.",
    examples=[("s = \"101\"", "5", "4+1."), ("s = \"1000\"", "8", "2³."), ("s = \"0\"", "0", "Zero.")],
    constraints=["1 ≤ s.length ≤ 31", "s consists of '0' and '1'"],
    direct_answer="Start at 0; for each char, do `result = result * 2 + (c - '0')`. O(length).",
    approach=dict(
        name="Horner's method",
        time="O(length)", space="O(1)",
        idea="Reading left to right, each new bit means the running value doubles (shift left) and the new bit is added. This avoids computing explicit powers of two and is the same scheme as parsing a decimal number, just base 2.",
        java="public int toDecimal(String s) {\n    int result = 0;\n    for (int i = 0; i < s.length(); i++) {\n        result = result * 2 + (s.charAt(i) - '0');\n    }\n    return result;\n}",
        python="def to_decimal(s: str) -> int:\n    result = 0\n    for c in s:\n        result = result * 2 + (ord(c) - ord('0'))\n    return result",
    ),
    line_java=[("result = result * 2 + (s.charAt(i) - '0');", "Double the accumulator and add the new bit.")],
    mistakes=["Computing pow(2, i) per digit (slower, overflow-prone).", "Not converting the char '0'/'1' to its int value."],
    remember=dict(pattern="Horner's method", rules=["result = result*2 + bit.", "Left to right.", "char - '0' for the digit."], takeaway="Horner's rule turns digit parsing into one multiply-add per char."),
)

D(
    "even-using-bitwise",
    statement="Given an integer `n`, determine whether it is even using a bitwise operation (not the modulo operator).",
    understanding="The least significant bit is 0 for even numbers and 1 for odd, so `n & 1` reveals parity.",
    examples=[("n = 4", "true", "Even, bit 0 is 0."), ("n = 7", "false", "Odd, bit 0 is 1."), ("n = 0", "true", "Zero is even.")],
    constraints=["-2^31 ≤ n ≤ 2^31 - 1"],
    direct_answer="Return `(n & 1) == 0`. The lowest bit being 0 means the number is even — works for negatives in two's-complement too.",
    approach=dict(
        name="Lowest-bit parity test",
        time="O(1)", space="O(1)",
        idea="In binary, evenness is decided entirely by the last bit. ANDing with 1 keeps only that bit, so a result of 0 means even. It's equivalent to `n % 2 == 0` but uses a single fast bit operation and behaves correctly for negative numbers (unlike `%` which can return -1 in some languages).",
        java="public boolean isEven(int n) {\n    return (n & 1) == 0;\n}",
        python="def is_even(n: int) -> bool:\n    return (n & 1) == 0",
    ),
    line_java=[("return (n & 1) == 0;", "Lowest bit 0 ⟹ even.")],
    mistakes=["Using `n % 2 == 0` when the question asks for bitwise.", "Assuming negatives behave like `%` (they don't always)."],
    remember=dict(pattern="n & 1 parity", rules=["Lowest bit = parity.", "n & 1 == 0 → even.", "Safe for negatives."], takeaway="n & 1 reads parity from the last bit, no modulo needed."),
)

D(
    "single-number-xor",
    statement="Given a non-empty array where every element appears twice except one that appears once, find that single element.",
    understanding="XOR all elements; duplicates cancel (x ^ x = 0), leaving the unique value.",
    examples=[("nums = [2, 3, 2]", "3", "3 appears once."), ("nums = [1, 1, 4]", "4", "4 is unique."), ("nums = [9]", "9", "Single element.")],
    constraints=["1 ≤ nums.length ≤ 10^5", "Every element appears twice except one"],
    direct_answer="XOR all the numbers together; paired values cancel to 0, and the result is the single number. O(n) time, O(1) space.",
    approach=dict(
        name="XOR fold",
        time="O(n)", space="O(1)",
        idea="Because x ^ x = 0 and XOR is commutative, folding the whole array with XOR cancels every duplicated pair regardless of order, leaving only the element that appears once. This is the textbook O(1)-space solution that beats the hash-set approach.",
        insight="The interviewer is checking whether you know the XOR-cancellation property rather than reaching for a HashSet.",
        java="public int singleNumber(int[] nums) {\n    int x = 0;\n    for (int v : nums) x ^= v;\n    return x;\n}",
        python="def single_number(nums: list[int]) -> int:\n    x = 0\n    for v in nums:\n        x ^= v\n    return x",
    ),
    line_java=[("for (int v : nums) x ^= v;", "Pairs cancel; the unique value survives.")],
    mistakes=["Using O(n) extra space with a hash set.", "Sorting first (O(n log n)) when XOR is O(n)/O(1)."],
    remember=dict(pattern="XOR cancellation", rules=["x ^ x = 0.", "XOR all elements.", "Survivor = the single one."], takeaway="XOR the array to find the lone unpaired number in O(1) space."),
    frequency="high",
)

D(
    "celsius-to-fahrenheit",
    statement="Given a temperature in Celsius `c`, convert it to Fahrenheit using `F = c × 9/5 + 32`.",
    understanding="A direct formula application — the only trap is integer division truncating the 9/5 factor.",
    examples=[("c = 100", "212.0", "Boiling point."), ("c = 0", "32.0", "Freezing point."), ("c = 37", "98.6", "Body temperature.")],
    constraints=["-273.15 ≤ c ≤ 10^6"],
    direct_answer="Return `c * 9.0 / 5.0 + 32`. Use floating-point (or multiply before dividing) so 9/5 isn't truncated to 1.",
    approach=dict(
        name="Direct formula",
        time="O(1)", space="O(1)",
        idea="There's no algorithm — just the conversion formula. The interview signal is numeric care: writing `9/5` in integer arithmetic gives 1 and corrupts the result, so use doubles or reorder to `c * 9 / 5`.",
        insight="On a 'trivial' conversion, mentioning the integer-division pitfall is exactly what distinguishes a careful answer.",
        java="public double toFahrenheit(double c) {\n    return c * 9.0 / 5.0 + 32;\n}",
        python="def to_fahrenheit(c: float) -> float:\n    return c * 9 / 5 + 32",
    ),
    line_java=[("return c * 9.0 / 5.0 + 32;", "Floating-point 9/5 avoids integer truncation.")],
    mistakes=["Integer `9/5` evaluating to 1.", "Applying the formula in the wrong order."],
    remember=dict(pattern="Direct formula + type care", rules=["F = c·9/5 + 32.", "Use doubles for 9/5.", "Watch integer division."], takeaway="Even a formula question tests awareness of integer division."),
)


# ─────────────────────────────────────────────────────────────────────────────
# Builder
# ─────────────────────────────────────────────────────────────────────────────

def build_examples(examples):
    return [{"input": i, "output": o, "explanation": e} for (i, o, e) in examples]


def build_line_by_line(approach):
    out = {}
    if "line_java" in approach:
        out["java"] = [{"line": l, "explanation": e} for (l, e) in approach["line_java"]]
    if "line_python" in approach:
        out["python"] = [{"line": l, "explanation": e} for (l, e) in approach["line_python"]]
    return out


def build_dry_run(dr):
    """dr = dict(input, intro, steps=[(step, action, state), ...], result)."""
    return {
        "input": dr["input"],
        "intro": dr.get("intro", ""),
        "steps": [{"step": s, "action": a, "state": st} for (s, a, st) in dr["steps"]],
        "result": dr["result"],
    }


def build_problem(slug, title, group_label, pattern, data):
    ap = data["approach"]
    line_by_line = {}
    if "line_java" in data:
        line_by_line["java"] = [{"line": l, "explanation": e} for (l, e) in data["line_java"]]
    if "line_python" in data:
        line_by_line["python"] = [{"line": l, "explanation": e} for (l, e) in data["line_python"]]

    approach = {
        "name": ap["name"],
        "whenToMention": data.get("when_to_mention", "This is the standard, expected solution — lead with it."),
        "complexity": {"time": ap["time"], "space": ap["space"]},
        # Prefer a deep multi-paragraph explanation when authored; fall back to the one-line idea.
        "explanation": data.get("deep_explanation", ap["idea"]),
        "code": {"java": ap["java"], "python": ap["python"]},
    }
    if "hints" in data:
        approach["hints"] = data["hints"]
    if "insight" in ap:
        approach["insight"] = ap["insight"]
    if "complexity_reasoning" in data:
        approach["complexityReasoning"] = data["complexity_reasoning"]
    if line_by_line:
        approach["lineByLine"] = line_by_line
    if "dry_run" in data:
        approach["dryRun"] = build_dry_run(data["dry_run"])
    if "edge_cases" in data:
        approach["edgeCases"] = [{"input": i, "behavior": b} for (i, b) in data["edge_cases"]]
    if "pitfalls" in data:
        approach["pitfalls"] = data["pitfalls"]

    remember = data["remember"]
    remember_out = {
        "pattern": remember["pattern"],
        "rules": remember["rules"],
        "takeaway": remember.get("takeaway", ""),
    }
    if "formula" in remember:
        remember_out["formula"] = remember["formula"]
    if "when_to_use" in remember:
        remember_out["whenToUse"] = remember["when_to_use"]
    if "anti_signals" in remember:
        remember_out["antiSignals"] = remember["anti_signals"]

    # Reading time scales with how much depth the entry carries.
    reading_time = data.get("reading_time")
    if reading_time is None:
        reading_time = 6 if "deep_explanation" in data else 4

    problem = {
        "id": slug,
        "slug": slug,
        "title": title,
        "difficulty": "easy",
        "category": "basics",
        "patterns": [pattern] if pattern else [],
        "companies": [],
        "frequency": data.get("frequency", "medium"),
        "readingTimeMinutes": reading_time,
        "lastUpdated": LAST_UPDATED,
        "directAnswer": data["direct_answer"],
        "remember": remember_out,
        "problemStatement": data["statement"],
        "understanding": data["understanding"],
        "constraints": data["constraints"],
        "examples": build_examples(data["examples"]),
        "approaches": [approach],
        "commonMistakes": data["mistakes"],
        "followupVariations": [],
        "patternNote": data.get("pattern_note", f"A core fresher pattern: {remember['pattern']}. Master it on small inputs and it transfers to harder problems."),
        "seo": {
            "metaTitle": f"{title} — Solution in Java & Python | InterviewExplainer",
            "metaDescription": (data["direct_answer"][:150]),
            "canonicalUrl": f"/dsa/problem/{slug}",
        },
    }

    if "interviewer_intent" in data:
        ii = data["interviewer_intent"]
        problem["interviewerIntent"] = {
            "testing": ii["testing"],
            "commonMistake": ii["common_mistake"],
            "toStandOut": ii["to_stand_out"],
        }
    if "clarifying" in data:
        problem["clarifyingQuestions"] = [{"question": q, "answer": a} for (q, a) in data["clarifying"]]
    if "common_mistakes_detailed" in data:
        problem["commonMistakesDetailed"] = data["common_mistakes_detailed"]
    if "followups" in data:
        problem["followupVariations"] = data["followups"]

    return problem


def apply_enrichment():
    """Merge the in-depth ENRICH entries into PROBLEM_DATA.

    ENRICH lives in scripts/basic_100_enrich.py and adds the deeper teaching
    fields (multi-paragraph explanation, dry-run trace, edge cases, pitfalls,
    interviewer intent, clarifying questions, detailed mistakes, follow-ups)
    on top of the concise base entries. Top-level keys overwrite; the nested
    `remember` dict is shallow-merged via `remember_add`.
    """
    try:
        from basic_100_enrich import ENRICH
    except ImportError:
        import importlib.util
        spec = importlib.util.spec_from_file_location(
            "basic_100_enrich", os.path.join(os.path.dirname(__file__), "basic_100_enrich.py")
        )
        if spec is None or spec.loader is None:
            return
        mod = importlib.util.module_from_spec(spec)
        spec.loader.exec_module(mod)
        ENRICH = mod.ENRICH

    for slug, extra in ENRICH.items():
        if slug not in PROBLEM_DATA:
            raise SystemExit(f"ENRICH slug '{slug}' is not in PROBLEM_DATA.")
        extra = dict(extra)
        remember_add = extra.pop("remember_add", None)
        approach_add = extra.pop("approach_add", None)
        PROBLEM_DATA[slug].update(extra)
        if remember_add:
            PROBLEM_DATA[slug]["remember"].update(remember_add)
        if approach_add:
            PROBLEM_DATA[slug]["approach"].update(approach_add)


def main():
    os.makedirs(BASICS_DIR, exist_ok=True)
    os.makedirs(CATALOG_DIR, exist_ok=True)
    apply_enrichment()

    # Map slug -> (group_label, pattern, title) from the catalog.
    slug_meta = {}
    total = 0
    catalog_groups = []
    for g in GROUPS:
        problems_out = []
        for (slug, title, one_liner, pattern) in g["problems"]:
            slug_meta[slug] = (g["title"], pattern, title)
            problems_out.append({
                "slug": slug,
                "title": title,
                "oneLiner": one_liner,
                "pattern": pattern,
            })
            total += 1
        catalog_groups.append({
            "groupSlug": g["groupSlug"],
            "title": g["title"],
            "blurb": g["blurb"],
            "problems": problems_out,
        })

    catalog = {
        "title": "Basic 100 — DSA for Freshers",
        "tagline": "100 must-know beginner coding problems, each solved step by step in Java and Python.",
        "description": (
            "Brand new to coding interviews? Start here. The Basic 100 is a hand-picked set of the "
            "simplest, most-asked Data Structures & Algorithms problems for freshers — reverse a string, "
            "find the maximum, FizzBuzz, check a prime, and more.\n\n"
            "Every problem is solved the way an interviewer wants to hear it: a plain-English restatement, "
            "a worked example, the idea behind the solution, and clean Java and Python code with "
            "line-by-line comments. Work through the groups in order and you'll build the muscle memory "
            "that makes the Easy, Medium, and Hard tiers far less intimidating."
        ),
        "totalProblems": total,
        "groups": catalog_groups,
        "howToUse": [
            "Go top to bottom — the groups are ordered from gentlest to slightly tougher.",
            "Try each problem yourself first, then read the idea and the line-by-line code.",
            "Re-implement from memory in both Java and Python; freshers are often asked to switch languages.",
            "Once a whole group feels mechanical, move up to the Easy tier.",
        ],
        "seo": {
            "title": "Basic 100 — 100 Beginner DSA Problems for Freshers (Java & Python)",
            "description": "100 must-know basic DSA coding problems for freshers, each with a clear explanation and line-by-line Java and Python solutions. The perfect starting point before Easy/Medium/Hard.",
        },
    }

    with open(os.path.join(CATALOG_DIR, "index.json"), "w") as f:
        json.dump(catalog, f, indent=2, ensure_ascii=False)
        f.write("\n")

    written = 0
    for slug, data in PROBLEM_DATA.items():
        if slug not in slug_meta:
            raise SystemExit(f"PROBLEM_DATA slug '{slug}' is not in the catalog GROUPS.")
        group_label, pattern, title = slug_meta[slug]
        problem = build_problem(slug, title, group_label, pattern, data)
        with open(os.path.join(BASICS_DIR, f"{slug}.json"), "w") as f:
            json.dump(problem, f, indent=2, ensure_ascii=False)
            f.write("\n")
        written += 1

    print(f"Catalog: {total} problems across {len(GROUPS)} groups.")
    print(f"Authored problem files written: {written}")
    print(f"Queued (catalog-only): {total - written}")


if __name__ == "__main__":
    main()
