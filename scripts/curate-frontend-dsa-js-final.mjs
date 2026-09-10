#!/usr/bin/env node
/**
 * curate-frontend-dsa-js-final.mjs — apply the final pattern to dsa-javascript.
 */

import { applyTopic } from "./curate-frontend-final-pattern.mjs";

let total = 0;

total += applyTopic({
  moduleSlug: "dsa-javascript",
  topicSlug: "arrays-strings-js",
  topicTitle: "Arrays Strings Js",
  anchors: [
    {
      slug: "dsa-javascript-arrays-strings-js-array-string-toolbox",
      slugName: "arrays and strings in JavaScript interviews",
      question: "Which array and string operations do interviews actually test — and what are their costs?",
      title: "Arrays Strings Toolbox",
      direct:
        "The tested set: map/filter/reduce (O(n) passes, non-mutating), indexOf/includes/find (O(n) scan), slice/spread (O(n) copy), concat vs push (copy vs in-place), split/join (O(n) both ways), and the string traps — strings are IMMUTABLE (every 'modification' allocates a new string, so chained += in a loop is O(n²); build an array and join instead). Know which methods MUTATE (sort, splice, push/pop, reverse) versus copy (slice, spread, toSorted, toReversed) — the top mistake in whiteboard code.",
      summary:
        "Core array/string ops with their big-O costs, the immutable-string trap, and the mutate-vs-copy method split.",
      mistake:
        "Rebuilding a string with += inside a loop (O(n²)) and not knowing which methods mutate the source.",
      profile: "mechanism",
      stage: "practical",
      priority: "must-prepare",
      language: "js",
      speakable:
        "The toolbox with costs, verified:\n\n```js\n// SEARCH — O(n) scans\narr.includes(x);        arr.indexOf(x);   // boolean / index\narr.find(p);  arr.findIndex(p);         // first match by predicate\n\n// TRANSFORM — O(n), returns NEW arrays\narr.map(f);  arr.filter(p);  arr.reduce((acc, x) => acc + x, 0);\n\n// COPY — O(n)\nconst copy = [...arr];  arr.slice(1, 3);\n\n// MUTATE — in place (the trap list)\narr.sort((a,b) => a-b);  arr.splice(1, 2);  arr.push(x);  arr.reverse();\n// non-mutating moderns: toSorted, toReversed, with, toSpliced\n\n// STRINGS — immutable: every op returns a NEW string\ns.split('').reverse().join('');   // 3 allocations\ns.padStart(2, '0');  s.trim();  s.slice(-3);\n```\n\nThe O(n²) string trap (THE classic): building with += in a loop copies the whole prefix each time — 1+2+...+n = O(n²). The fix: push pieces into an array and join once — O(n). Same class: repeatedly `str = str + ch` inside recursion.\n\nThe mutate-vs-copy axis (the #1 whiteboard mistake): sort/splice/push/reverse MUTATE — calling them on props or state you still need corrupts the source (React bugs live here: state arrays must be copied first, [...arr].sort()). The copy family: spread, slice, toSorted/toReversed (ES2023). In an interview, SAY which family you're using — 'I'll copy first because the caller still needs the original.'",
      flow:
        "flowchart LR\n    subgraph scan[O(n) scans]\n        I[includes indexOf find]\n    end\n    subgraph transform[O(n) new arrays]\n        M[map filter reduce]\n    end\n    subgraph copy[O(n) copies]\n        S[spread slice toSorted]\n    end\n    subgraph mutate[in-place traps]\n        SO[sort splice push reverse]\n    end\n    STR[string += in loop] -->|n allocations| QUAD[O(n^2)]\n    ARR[array push + join] -->|one join| LIN[O(n)]",
      deep:
        "Why method identity matters for correctness, not just style: mutation aliasing bugs — two variables referencing one array, one sorts it, the other's view silently reorders; in React, the same reference after mutation means the re-render never fires (Object.is equal). The discipline: functions that mutate their ARGUMENTS should say so in the name (sortInPlace); everything else copies. sort's default comparator is a second trap — it compares as UTF-16 STRINGS: [10, 9, 1].sort() gives [1, 10, 9]; numbers need (a, b) => a - b.\n\nThe complexity map of the interview set: random access arr[i] O(1) (the array's superpower — the reason hashmaps are built on arrays); shift/unshift on arrays O(n) (everything moves — queues built on array.shift() in a loop are O(n²), the reason for head/tail indexes or a linked list); nested loops over the same array O(n²) — the brute force every 'can we do better' question starts from. Two-pointer and sliding-window exist to eliminate one of those nested loops.\n\nThe JS-specific extras that earn depth points: sparse arrays (map skips holes, forEach skips holes — a for loop doesn't; Array.from({length: n}, (_, i) => i) is the idiomatic range), the typed-array family for numeric work, and the fact that 'array' methods work on any array-LIKE with the ...spread or Function.call — the duck-typing root of arguments and NodeList conversions.",
    },
  ],
});

total += applyTopic({
  moduleSlug: "dsa-javascript",
  topicSlug: "hashmaps-objects-js",
  topicTitle: "Hashmaps Objects Js",
  anchors: [
    {
      slug: "dsa-javascript-hashmaps-objects-js-hashmap-pattern",
      slugName: "the hashmap pattern in JavaScript interviews",
      question: "How do you use objects and Maps as hashmaps — and when does the O(1) lookup pattern apply?",
      title: "Hashmap Pattern",
      direct:
        "A hashmap trades space for time: O(n) build, then O(1) average lookups — converting the nested-loop O(n²) 'have I seen X?' into a single pass. In JS, use a plain object (or Map) keyed by the value you need to match on. The Map-vs-object split: Map keeps ANY key type (including objects), preserves insertion order, has .size, and is safe from prototype-key collisions ('constructor', 'toString' — the object trap); objects are fine for string/number keys and win on literal convenience. The pattern family: seen-set (duplicates), index-map (two-sum), frequency-map (anagrams, top-K), group-by (reduce into an object of arrays).",
      summary:
        "The O(n) hashmap pass that replaces O(n²) nested lookups, with the Map-vs-object decision.",
      mistake:
        "Using a plain object with un-sanitized keys and hitting prototype collisions, or paying O(n) inside the loop (arr.includes in every iteration) which restores the O(n²).",
      profile: "mechanism",
      stage: "practical",
      priority: "must-prepare",
      language: "js",
      speakable:
        "The pattern, verified on the canonical problem:\n\n```js\n// TWO SUM — brute force is O(n^2): for each x, scan the rest for target-x\n// Hashmap: ONE pass, O(n)\nfunction twoSum(nums, target) {\n  const seen = new Map();               // value -> index\n  for (let i = 0; i < nums.length; i++) {\n    const need = target - nums[i];\n    if (seen.has(need)) return [seen.get(need), i];  // the match was already seen\n    seen.set(nums[i], i);               // record AFTER checking\n  }\n}\n\n// FREQUENCY MAP — anagram check: O(n) vs O(n log n) sort\nfunction isAnagram(a, b) {\n  if (a.length !== b.length) return false;\n  const count = {};\n  for (const ch of a) count[ch] = (count[ch] ?? 0) + 1;\n  for (const ch of b) {\n    if (!count[ch]) return false;      // missing or over-consumed\n    count[ch]--;\n  }\n  return true;\n}\n```\n\nThe pattern family (how interviews re-shape the same idea): seen-SET for duplicates (has vs add per element); index-map for pair-finding (two-sum and every variant); frequency-map for counting (anagrams, char counts, word tallies); group-by (reduce into an object of arrays — group words by length, by first letter). The mental move is always the same: BEFORE looping to find a match, ask 'can I have already recorded what I need in a previous iteration?'\n\nMap vs object (the follow-up question): Map takes any key type (objects as keys — identity, not stringified), preserves insertion order for iteration, gives O(1) .size, and never collides with inherited prototype properties. A plain object keyed by arbitrary strings can be poisoned by keys like 'constructor' — Object.create(null) or Map avoids it. Objects remain right for fixed-shape records; Map wins for dynamic key sets.",
      flow:
        "flowchart LR\n    P[problem: pair / duplicate / count] --> Q{match needs a lookup?}\n    Q -->|yes| H[build map as you scan]\n    H -->|check BEFORE insert| O[one pass, O(n)]\n    Q -->|nested scan instead| N2[O(n^2) — the brute force]\n    K[key type: object / dynamic] --> MAP[Map]\n    K2[key: string or number, fixed shape] --> OBJ[plain object]",
      deep:
        "Why 'O(1) average' and not guaranteed: hash collisions degrade buckets to O(n) worst case (many keys hashing to one bucket); engines mitigate with resizing and per-bucket trees (V8's dictionary-mode objects and Map use different internal tables), and adversarial key sets are the pathological case — for interview honesty, say 'amortized O(1), degraded by collisions.'\n\nThe space-time contract: every hashmap answer buys its speed with O(n) EXTRA space — the interviewer's follow-up is often 'can you do it in O(1) space?' and the answer is usually sort-then-two-pointers (O(n log n) time, O(1) space beyond the sort) — the trade-off worth naming unprompted.\n\nThe object-model specifics interviewers probe: property lookup on objects is ALSO hashmap-fast (hidden classes in V8 make it even better for monomorphic shapes — the JIT's structural optimization), which is why memo objects (fib[k] = fib[k-1] + fib[k-2]) are the standard DP-tabulation shape in JS. And WeakMap — the variant with weak references to keys (no leak, no iteration) — is the correct answer for associating metadata with objects whose lifetime you don't own (caching per-DOM-node or per-instance data without preventing garbage collection).",
    },
  ],
});

total += applyTopic({
  moduleSlug: "dsa-javascript",
  topicSlug: "recursion-basics-js",
  topicTitle: "Recursion Basics Js",
  anchors: [
    {
      slug: "dsa-javascript-recursion-basics-js-recursion-tradeoffs",
      slugName: "recursion in JavaScript interviews",
      question: "When is recursion the right tool — and what are its costs in JavaScript?",
      title: "Recursion Tradeoffs",
      direct:
        "Recursion fits problems defined self-similarly (trees, nested structures, divide-and-conquer): each call works on a smaller piece, the base case stops the stack. Costs in JS: the call stack is small (~10k frames typical), so linear recursion (recursing n times deep on an n-element list) overflows — STACK OVERFLOW at input scale; the fix is iteration or ACCUMULATOR tail-form (though V8 does not guarantee TCO). Memory: each frame holds its locals until it returns. Memoization turns the exponential naive recursion (fib: O(2^n), recomputing subtrees) into O(n) by caching computed answers in a map.",
      summary:
        "Recursion for self-similar structure, base cases, the JS stack limit, and memoization collapsing exponential trees.",
      mistake:
        "Missing or unreachable base cases (infinite recursion → stack overflow), and naive fib without memoization.",
      profile: "mechanism",
      stage: "practical",
      priority: "must-prepare",
      language: "js",
      speakable:
        "The three parts, verified:\n\n```js\n// 1. BASE CASE — the stopping condition; must be reachable\n// 2. RECURSIVE CASE — a STRICTLY SMALLER input\n// 3. COMBINE — how sub-answers form the answer\n\nfunction factorial(n) {\n  if (n <= 1) return 1;              // base\n  return n * factorial(n - 1);       // smaller + combine\n}\n\n// THE EXPONENTIAL TRAP — naive fib: O(2^n), same subtrees recomputed\nfunction fibSlow(n) {\n  if (n <= 1) return n;\n  return fibSlow(n - 1) + fibSlow(n - 2);  // fib(30) = ~1M calls\n}\n\n// MEMOIZED — O(n): the map remembers every computed answer\nfunction fibFast(n, memo = new Map()) {\n  if (n <= 1) return n;\n  if (memo.has(n)) return memo.get(n);\n  const val = fibFast(n - 1, memo) + fibFast(n - 2, memo);\n  memo.set(n, val);                   // cache BEFORE returning\n  return val;\n}\n```\n\nThe depth discipline (the JS-specific part): every recursive call adds a frame; the engine's stack is finite (~10k frames typical, engine-dependent). Linear recursion — recursing once per element of an n-list — overflows at real input sizes; recursion DEPTH should be O(log n) (balanced divide-and-conquer: binary recursion on halves is depth log n — mergesort, BST walks) or bounded by structure height (trees are usually safe; flat lists are not). When a recursion overflows, convert to iteration with an explicit stack (an array you push/pop) — the SAME algorithm, heap instead of call stack.\n\nThe interview frame: recursion is the natural language of trees and nested structures (JSON traversal, DOM walks, directory scans) — forcing iteration there is harder to read. For sequences, prefer iteration unless the recurrence is genuinely self-similar. Say aloud: 'depth is the cost driver; this recursion is O(log n) deep, so the stack is safe.'",
      flow:
        "flowchart TD\n    R[recursive call] --> F[new frame on call stack]\n    F -->|base case reached| U[unwind: frames return]\n    D[no base case / unbounded depth] --> SO[stack overflow at ~10k frames]\n    NF[naive fib] -->|recomputes subtrees| EXPO[O(2^n)]\n    MF[memo map caches answers] --> LIN[O(n)]\n    NR[nested structure: tree JSON DOM] --> GOOD[recursion fits]\n    FLAT[flat list] --> ITER[iterate instead]",
      deep:
        "Why memoization changes the exponent (the mechanism): naive fib's call TREE has two children per node and depth n — 2^n nodes, with the same subproblems (fib(n-2) computed inside both branches) recomputed exponentially many times. Memoization stores each computed answer keyed by input; each distinct subproblem is computed ONCE, the rest are O(1) map hits — the tree collapses to a chain of n distinct computations. This is top-down dynamic programming; bottom-up tabulation (an array filled in order) is the same insight without recursion — and without stack risk.\n\nThe tail-call nuance (JS honesty): a tail call is one where the recursive result is returned WITHOUT further work (return f(...) not n * f(...)); proper TCO would reuse the frame, making tail recursion as safe as iteration. ES2015 SPECIFIED it, but V8 (Chrome/Node) never shipped it — Safari's JavaScriptCore did. So in JS interviews, tail-form does NOT save you from overflow; say 'I'd convert to an explicit-stack iteration for unbounded depth.'\n\nThe structural-recursion payoff (where recursion shines and iteration can't compete cleanly): divide-and-conquer (mergesort's recursive halves, binary search's shrinking window) is depth O(log n) — 1M elements is 20 frames; tree/graph DFS is depth bounded by structure height — typically log n for balanced trees, n worst-case for degenerate ones. Trampolines (returning a thunk chain driven by a while loop) exist for unbounded recursion in functional style, but an explicit array-stack is the practical answer in interviews.",
    },
  ],
});

total += applyTopic({
  moduleSlug: "dsa-javascript",
  topicSlug: "sorting-js",
  topicTitle: "Sorting Js",
  anchors: [
    {
      slug: "dsa-javascript-sorting-js-sorting-comparators",
      slugName: "sorting in JavaScript interviews",
      question: "What does the sort() comparator actually control — and which sorting patterns do interviews test?",
      title: "Sorting Comparators",
      direct:
        "JS sort is O(n log n) (V8: TimSort for arrays >22, quicksort below) and UNSTABLE in old engines / STABLE since ES2019. The comparator (a, b) => a - b is the whole game: negative → a first, positive → b first, zero → original order (stability). The default comparator sorts as UTF-16 STRINGS — [10, 9, 1] → [1, 10, 9], the classic bug. Interview patterns: sort by derived key (sort items by a.length or a.date - b.date), multi-key comparators (tie-break chains: primary field, then secondary), and 'sort then scan' as the O(n log n) alternative to O(n²) nested loops (duplicates: adjacent after sort).",
      summary:
        "The comparator contract (negative/zero/positive), the string-default trap, and multi-key + sort-then-scan patterns.",
      mistake:
        "Calling sort() with no comparator on numbers, and comparators that return non-numbers or inconsistent values.",
      profile: "mechanism",
      stage: "practical",
      priority: "must-prepare",
      language: "js",
      speakable:
        "The comparator contract, verified:\n\n```js\n// NEGATIVE → a comes first; POSITIVE → b first; ZERO → keep order (stable)\n[10, 9, 1].sort();                  // [1, 10, 9] — STRINGS by default!\n[10, 9, 1].sort((a, b) => a - b);   // [1, 9, 10] — numeric\n\n// DESCENDING — flip the subtraction\nscores.sort((a, b) => b - a);        // [10, 9, 1]\n\n// SORT BY DERIVED KEY\nwords.sort((a, b) => a.length - b.length);      // by length\nusers.sort((a, b) => a.createdAt - b.createdAt); // by date (numeric ms)\n\n// MULTI-KEY — tie-break chains\nitems.sort((a, b) =>\n  b.priority - a.priority                    // primary: desc\n  || a.name.localeCompare(b.name)            // tie: name asc\n);\n```\n\nWhy the default lies: with no comparator, sort converts to strings and compares UTF-16 code units — numbers order lexicographically (10 < 9 because '1' < '9'), and locale differences (é, accents, case) sort wrong; localeCompare handles human-language ordering ('é' near 'e', case-insensitive per locale rules).\n\nThe interview patterns (when sorting is the ANSWER): (1) sort-then-scan for duplicates/gaps — after sorting, equal elements are ADJACENT and a gap is nums[i+1] - nums[i] > 1 — one pass O(n log n) instead of nested O(n²) includes; (2) sort-then-two-pointers — pair-sum and merge-interval families reduce to sorted order first; (3) the greedy exchanges — scheduling by deadline, meeting rooms by start time: sort is the setup step that makes a greedy single pass provably correct.\n\nMutability warning (the JS-specific gotcha): sort MUTATES the array — copy first ([...arr].sort() or toSorted) when the original order or React state is still needed.",
      flow:
        "flowchart LR\n    NO[no comparator] --> STR[string UTF-16 compare — the bug]\n    C[comparator a b] --> R[neg = a first, pos = b first, 0 = stable]\n    NUM[numeric: a - b] --> OK[correct order]\n    LOC[locale: localeCompare] --> HUMAN[human ordering]\n    SRT[sorted array] --> ADJ[equals adjacent — duplicates in one pass]\n    SRT --> TP[two pointers over sorted order]\n    M[sort mutates!] --> CP[copy first: spread / toSorted]",
      deep:
        "Stability, precisely (the property that unlocks multi-key sorting): a stable sort preserves the RELATIVE order of equal-comparing elements — ES2019 MANDATED stability for Array.prototype.sort, and V8's TimSort (adapted mergesort: run detection + merging) delivers it. Why it matters: sorting by name then by priority with a stable sort keeps name order intact WITHIN equal priorities — the chained-comparator pattern relies on it, and an unstable sort would need a single composite key instead.\n\nThe engine reality (points that signal depth): V8 uses TimSort for arrays above ~22 elements and insertion sort below — so the practical complexity is O(n log n) worst, O(n) best (already-sorted input — TimSort detects runs); mergesort's stability came at the cost of O(n) auxiliary memory, which TimSort mitigates by merging identified runs in place where possible. Interviews don't need the internals — they need 'O(n log n), stable, comparator-driven.'\n\nThe decision frame interviews actually test: is sorting NEEDED? Sorting to find a max (O(n log n)) loses to a linear scan (O(n)); sorting to check duplicates ties the hashmap (O(n) time but O(n) space) vs sort (O(n log n) time, O(1) extra space, destructive unless copied) — the trade-off conversation IS the question. And when the domain is small (counting chars, bounded ints), counting sort is O(n + k) — the linear-time answer that beats comparison sorts' n log n lower bound by NOT comparing.",
    },
  ],
});

total += applyTopic({
  moduleSlug: "dsa-javascript",
  topicSlug: "two-pointers-js",
  topicTitle: "Two Pointers Js",
  anchors: [
    {
      slug: "dsa-javascript-two-pointers-js-two-pointer-family",
      slugName: "the two-pointer pattern in JavaScript",
      question: "What problem shape does two pointers solve — and what are its three main forms?",
      title: "Two Pointer Family",
      direct:
        "Two pointers eliminates the O(n²) nested loop when the answer depends on a PAIR (or window) of elements and the array's ORDER lets you move pointers monotonically. Three forms: (1) opposite ends converging (sorted pair-sum: left/right move based on the comparison), (2) fast/slow on one array (in-place removal — write-index pattern: slow tracks the kept boundary), (3) sequence/linked-list traversal (cycle detection — Floyd's tortoise/hare). The precondition that makes form 1 valid: SORTED input — each comparison eliminates a whole row of candidates.",
      summary:
        "Three forms of two pointers: converging ends on sorted arrays, fast/slow writer for in-place edits, and tortoise/hare for cycles.",
      mistake:
        "Applying converging pointers to UNSORTED input (the elimination logic breaks), and off-by-one/overlap bugs in the loop condition.",
      profile: "mechanism",
      stage: "practical",
      priority: "must-prepare",
      language: "js",
      speakable:
        "Form 1 — converging ends (sorted pair-sum), verified:\n\n```js\n// O(n): each comparison eliminates an entire candidate row\nfunction pairWithSum(sorted, target) {\n  let lo = 0, hi = sorted.length - 1;\n  while (lo < hi) {                          // meet-strictly-in-the-middle\n    const sum = sorted[lo] + sorted[hi];\n    if (sum === target) return [lo, hi];\n    if (sum < target) lo++;                   // need bigger → move left up\n    else hi--;                               // need smaller → move right down\n  }\n}\n// Why elimination works: sum too small → EVERY pair using sorted[lo]\n// with a smaller hi is also too small — lo is dead, advance it.\n```\n\nForm 2 — fast/slow writer (in-place removal):\n```js\n// remove duplicates in place — slow marks the kept boundary\nfunction dedupeSorted(nums) {\n  let w = 0;\n  for (let r = 0; r < nums.length; r++) {\n    if (r === 0 || nums[r] !== nums[r - 1]) nums[w++] = nums[r];\n  }\n  nums.length = w;                           // trim the tail\n}\n// O(n) time, O(1) space — the alternative filter() allocates a new array\n```\n\nForm 3 — tortoise/hare (cycle detection): slow moves 1, fast moves 2; in a cycle they MUST meet (the gap closes by 1 each step); to find the cycle START, reset one pointer to the head and move both at 1 — they meet at the entry (Floyd's algorithm, the same math that finds the duplicate number in the n+1-ints-in-range-n problem).\n\nThe recognizer (what to say in the interview): 'the answer needs a PAIR (or a window) and each comparison can PERMANENTLY discard one candidate' — sorted pair-sum, in-place filtering, palindrome checks (ends converge comparing chars), container-with-most-water (greedy pointer moves). If discarding isn't provable, you need the hashmap instead.",
      flow:
        "flowchart LR\n    Q[answer needs pairs or a window] --> SORTED{input sorted or sortable?}\n    SORTED -->|yes| CONV[converging ends — O(n)]\n    SORTED -->|no| HM[hashmap pass instead]\n    INPLACE[in-place edit requirement] --> FS[fast reader slow writer]\n    CYCLE[linked structure, cycle possible] --> TH[tortoise and hare — meet proves cycle]\n    N2[nested loops] -->|each step kills a candidate row| ONE[one linear pass]",
      deep:
        "Why sorted input is the precondition (the proof worth saying): in pair-sum, if sorted[lo] + sorted[hi] < target, then EVERY pair (lo, j) with j < hi also fails — so lo can never be part of an answer and advancing it discards n-hi candidates at once. That elimination is only true in sorted order; on unsorted data a failed pair eliminates nothing, and the algorithm degrades to trying everything — which is why the first move in an unsorted pair-sum is either sort (O(n log n)) or hash (O(n) space).\n\nThe fast/slow family generalizes (the in-place idiom): the writer pattern is how every 'remove X in place with O(1) extra space' question works — the reader scans, the writer marks where the NEXT kept element goes, and the region before the writer is always the answer-so-far. Partition (quicksort's step), move-zeroes, and unique-path filtering are the same skeleton with different keep-predicates. The invariant: nums[0..w) is correct at every step — state it in the interview and the code writes itself.\n\nThe Floyd cycle math (the depth marker): if the list has a cycle, fast laps slow — the gap decreases by exactly 1 per iteration (2 vs 1 steps), so they meet INSIDE the cycle within n iterations. The entry-finding second phase: the distance from head to cycle-entry equals the distance from meet-point to entry (a modular-arithmetic identity from the two distances walked), which is why both-at-speed-1 meet exactly at the entry. Interviewers ask this proof for the 'find the duplicate number' reduction — array of n+1 values in [1, n] IS a hidden linked list where value i points to index i, and the duplicate is the cycle entry.",
    },
  ],
});

console.log(`Curated dsa-javascript: ${total} questions.`);
