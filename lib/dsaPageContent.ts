/**
 * Editorial content for the DSA "browse" surfaces (difficulty, category,
 * pattern, company). These pages used to be bare problem lists; this module
 * supplies the written content — an overview, a study playbook, common
 * pitfalls, and an FAQ — so every page reads as complete and authoritative.
 *
 * Server-safe: pure data + string builders, no `fs` / browser APIs. Import
 * freely into server components.
 */

export interface DSAStudyTip {
  title: string;
  body: string;
}

export interface DSAFaq {
  q: string;
  a: string;
}

export interface DSAPageContent {
  /** 2–3 intro paragraphs. */
  overview: string[];
  /** "How to study this" cards. */
  studyTips: DSAStudyTip[];
  /** Common mistakes / traps. */
  pitfalls: string[];
  /** Frequently asked questions (also emitted as FAQ JSON-LD). */
  faqs: DSAFaq[];
}

export interface DSACounts {
  total: number;
  easy: number;
  medium: number;
  hard: number;
}

function mix(c: DSACounts): string {
  return `${c.easy} easy, ${c.medium} medium, ${c.hard} hard`;
}

function frequencyWord(total: number): string {
  if (total >= 60) return "extremely frequently";
  if (total >= 30) return "very frequently";
  if (total >= 12) return "regularly";
  return "occasionally";
}

// ─── Difficulty pages (curated) ───────────────────────────────────────────────

export const DIFFICULTY_CONTENT: Record<
  "easy" | "medium" | "hard",
  Omit<DSAPageContent, "overview"> & { overview: (c: DSACounts) => string[] }
> = {
  easy: {
    overview: (c) => [
      `Easy problems are where every strong DSA preparation begins. Each one maps cleanly to a single pattern — a hash map, a single pass, a two-pointer sweep — so they are perfect for building the muscle memory you'll lean on under interview pressure. Do not skip them because they look trivial: interviewers open phone screens with "easy" questions and judge you on how cleanly and quickly you reach the optimal solution, not just whether you eventually get there.`,
      `We index ${c.total} easy problems, each solved brute-force → optimal in Java and Python with a line-by-line walkthrough and the talking points an interviewer wants to hear. Work through them grouped by module so related ideas reinforce each other.`,
      `The goal at this tier is fluency. You should be able to recognise the pattern in seconds, state the time and space complexity without thinking, and write a clean, bug-free solution on the first try.`,
    ],
    studyTips: [
      { title: "Aim for speed and cleanliness", body: "On an easy question the bar is a correct, optimal, readable solution in a few minutes. Practise writing it without a single off-by-one bug." },
      { title: "Verbalise the pattern", body: "Say \"this is a hash-map lookup\" or \"this is a single-pass two-pointer\" before you code. Interviewers score your pattern recognition, not just the final code." },
      { title: "Always give complexity", body: "End every easy answer with the time and space complexity and one sentence on why. It signals seniority even on simple problems." },
      { title: "Use them as warm-ups", body: "Before a mock or a real interview, solve two or three easy problems to get your hands and your vocabulary warm." },
    ],
    pitfalls: [
      "Treating easy questions as beneath you and getting sloppy — a missed edge case here costs the whole phone screen.",
      "Jumping straight to code without stating the approach and complexity out loud.",
      "Reaching for a brute force and forgetting to mention the optimal — interviewers expect the optimal even on easy problems.",
      "Ignoring edge cases like empty input, a single element, or duplicates.",
    ],
    faqs: [
      { q: "Are easy DSA problems actually asked in interviews?", a: "Yes — most phone screens and the opening question of an onsite are 'easy' difficulty. They're used to confirm fundamentals fast, so a clean, optimal answer matters more than you'd think." },
      { q: "How many easy problems should I solve?", a: "Enough that you recognise the underlying pattern instantly — typically 30–50 across the core modules. Once an easy problem feels mechanical, move up to medium." },
      { q: "Should I memorise easy solutions?", a: "Memorise the pattern and the template, not the specific problem. The point is to internalise reusable techniques (hashing, two pointers, single pass) you can apply to unfamiliar questions." },
    ],
  },
  medium: {
    overview: (c) => [
      `Medium is the difficulty that decides most interviews. The overwhelming majority of onsite coding questions at top companies sit here: they combine two or more ideas (a hash map plus a sliding window, a sort plus a two-pointer sweep, a BFS with state) and reward candidates who can decompose a problem into known patterns. If you can reliably solve mediums, you can pass most loops.`,
      `We index ${c.total} medium problems, each worked brute-force → optimal in Java and Python with line-by-line explanations and the "what to say in the interview" framing. They're grouped by module so you can drill one pattern at a time rather than jumping randomly.`,
      `The skill to develop here is composition — seeing that a problem is "sliding window plus a frequency map" and reaching for both. That comes from deliberate, pattern-by-pattern practice, not random grinding.`,
    ],
    studyTips: [
      { title: "Drill one pattern at a time", body: "Pick a module (e.g. sliding window), solve every medium in it back-to-back, and you'll start seeing the shared skeleton across problems." },
      { title: "Start from the brute force", body: "State the obvious O(n²) or O(2ⁿ) solution first, then explain what's wasteful and how to remove it. This is exactly how interviewers want you to think out loud." },
      { title: "Track the bottleneck", body: "Most medium optimisations come from one move: caching with a hash map, sorting first, or using two pointers. Learn to spot which one removes the bottleneck." },
      { title: "Re-derive, don't recall", body: "If you've seen a problem, re-solve it from the pattern instead of recalling the answer. Interviews give you variations, not the exact question." },
    ],
    pitfalls: [
      "Jumping to a clever optimal solution without first stating a correct brute force — you risk a buggy answer and lose the structured-thinking signal.",
      "Not noticing the problem is a composition of two patterns and trying to brute-force the whole thing.",
      "Mishandling edge cases that mediums love: empty input, all-equal elements, negative numbers, and integer overflow.",
      "Optimising time while quietly blowing up space (or vice versa) without acknowledging the trade-off.",
    ],
    faqs: [
      { q: "Why is medium the most important difficulty?", a: "Because most real onsite questions are medium. They test whether you can combine fundamental patterns under time pressure, which is exactly the signal interviewers care about." },
      { q: "How long should a medium take me?", a: "In an interview you typically have 20–35 minutes. With practice you want to land the optimal approach, code it cleanly, and discuss complexity comfortably within that window." },
      { q: "I can do easy but mediums stump me — what now?", a: "Study by pattern, not by random problem. Take one module, read its theory page, then solve its mediums in sequence. The composition skill builds fastest when problems share a pattern." },
    ],
  },
  hard: {
    overview: (c) => [
      `Hard problems are the tier that separates good candidates from great ones. They usually require a non-obvious insight — a clever invariant, an advanced data structure (segment tree, monotonic stack, union-find), or a DP formulation that isn't visible at first glance. You don't need to ace every hard to get an offer, but being comfortable with them is what earns senior levels and stand-out feedback.`,
      `We index ${c.total} hard problems, each broken down brute-force → optimal in Java and Python with the reasoning that gets you to the key insight, not just the final code. They're grouped by module so you can build the advanced toolkit deliberately.`,
      `The right mindset for hard problems is patience: explore small cases, look for an invariant, and connect the problem to a pattern you already know before reaching for something exotic.`,
    ],
    studyTips: [
      { title: "Work small examples by hand", body: "Hard problems almost always reveal their structure when you trace n=3 or n=4 on paper. The invariant or recurrence usually falls out of the trace." },
      { title: "Map to a known pattern first", body: "Before inventing something, ask: is this DP? A monotonic stack? A graph in disguise? Most hards are a familiar pattern wearing a costume." },
      { title: "Build the advanced toolkit", body: "Segment trees, tries, union-find, monotonic stacks/queues, and DP-on-intervals recur across hards. Learn each one once and you'll recognise it everywhere." },
      { title: "Practise narrating partial progress", body: "Even when you can't fully solve a hard, talking through a correct brute force and a promising direction scores far better than silence." },
    ],
    pitfalls: [
      "Freezing because no full solution is obvious — interviewers reward a correct brute force plus clear progress over a silent struggle.",
      "Reaching for an exotic data structure when a known pattern (DP, two pointers, heap) would do.",
      "Getting the insight but fumbling the implementation details — hards punish off-by-one and boundary bugs hardest.",
      "Forgetting to re-examine time/space once the clever idea lands; some 'optimal' insights still need a complexity check.",
    ],
    faqs: [
      { q: "Do I need to solve hard problems to pass interviews?", a: "For most roles, strong medium performance is enough. Hards matter for senior levels, for companies known to ask them, and for turning a 'hire' into a 'strong hire'." },
      { q: "How do I get unstuck on a hard problem?", a: "Trace tiny inputs by hand, look for an invariant, and try to reduce it to a pattern you know (DP, graph, monotonic stack). State a brute force first so you always have something correct on the board." },
      { q: "Which hard topics are most worth my time?", a: "Dynamic programming, graphs, and advanced uses of heaps/stacks give the best return — they appear most often and unlock the widest range of hard questions." },
    ],
  },
};

export function getDifficultyContent(
  difficulty: "easy" | "medium" | "hard",
  counts: DSACounts,
): DSAPageContent {
  const c = DIFFICULTY_CONTENT[difficulty];
  return {
    overview: c.overview(counts),
    studyTips: c.studyTips,
    pitfalls: c.pitfalls,
    faqs: c.faqs,
  };
}

// ─── Topic / category facts (compact, fed into the generator) ─────────────────

interface TopicFact {
  blurb: string;       // what the topic is
  whatTests: string;   // what interviewers probe
  patterns: string;    // signature patterns, comma-separated
  insight: string;     // the one key idea
  pitfall: string;     // a topic-specific trap
}

const TOPIC_FACTS: Record<string, TopicFact> = {
  arrays: {
    blurb: "the contiguous, index-addressable backbone of almost every coding problem",
    whatTests: "Interviewers use arrays to test whether you can avoid nested-loop brute force with hashing, prefix sums, or two pointers.",
    patterns: "two pointers, sliding window, prefix sums, hashing",
    insight: "Most array optimisations replace a quadratic scan with a single pass plus a hash map or running aggregate.",
    pitfall: "Off-by-one errors on window/boundary indices and forgetting to handle empty or single-element arrays.",
  },
  strings: {
    blurb: "arrays of characters with their own rich set of interview patterns",
    whatTests: "String questions probe two-pointer and sliding-window fluency, frequency counting, and careful index handling.",
    patterns: "sliding window, two pointers, frequency maps, hashing",
    insight: "A character-frequency array or map turns most 'substring' questions into a sliding-window scan.",
    pitfall: "Building new strings inside a loop (O(n²) in many languages) instead of using a buffer, and mishandling Unicode/case.",
  },
  "linked-lists": {
    blurb: "pointer-chained nodes that test your comfort with references and in-place manipulation",
    whatTests: "Linked-list questions check whether you can manipulate pointers cleanly — reversing, merging, and detecting cycles without losing nodes.",
    patterns: "fast & slow pointers, dummy head, in-place reversal",
    insight: "A dummy head node and the fast/slow pointer trick solve a surprising share of linked-list problems.",
    pitfall: "Losing the rest of the list by reassigning next before saving it, and not using a dummy head for edge cases at the front.",
  },
  trees: {
    blurb: "hierarchical structures that are the natural home of recursion and traversal",
    whatTests: "Tree questions test recursion, the three DFS orders, BFS by level, and reasoning about subtree state.",
    patterns: "DFS (pre/in/post-order), BFS, divide & conquer",
    insight: "Almost every tree problem is 'solve the subtrees, then combine' — define what each recursive call returns.",
    pitfall: "Forgetting the null/leaf base case, and confusing in-order with pre/post-order when order matters.",
  },
  graphs: {
    blurb: "nodes and edges that model the hardest and most general interview problems",
    whatTests: "Graph questions test BFS/DFS, cycle detection, topological sort, and shortest-path reasoning.",
    patterns: "BFS, DFS, topological sort, union-find",
    insight: "Many problems that don't mention graphs are graphs in disguise — model the states as nodes and transitions as edges.",
    pitfall: "Not tracking visited nodes (infinite loops), and confusing directed vs. undirected handling.",
  },
  "dynamic-programming": {
    blurb: "the art of trading memory for time by reusing overlapping subproblems",
    whatTests: "DP questions test whether you can define a state, write the recurrence, and decide between memoisation and tabulation.",
    patterns: "1-D DP, 2-D DP, knapsack, DP on subsequences/intervals",
    insight: "Define the state precisely (what does dp[i] mean?) and the transition writes itself.",
    pitfall: "Vague state definitions, wrong base cases, and iterating the table in an order that uses values before they're computed.",
  },
  "binary-search": {
    blurb: "the O(log n) workhorse for sorted data and 'search the answer' problems",
    whatTests: "Binary search tests precise boundary handling and the insight to binary-search over an answer space, not just an array.",
    patterns: "classic binary search, search on answer, lower/upper bound",
    insight: "If a predicate is monotonic ('is X feasible?'), you can binary-search the smallest/largest X — even when there's no array.",
    pitfall: "Infinite loops and off-by-one bugs from sloppy lo/hi/mid updates and inclusive vs. exclusive bounds.",
  },
  heaps: {
    blurb: "priority queues that give you the smallest or largest element in O(log n)",
    whatTests: "Heap questions test 'top-K', streaming medians, and merging sorted sources efficiently.",
    patterns: "top-K, two-heaps, k-way merge",
    insight: "Whenever a problem says 'k largest/smallest' or 'running median', a heap (or two) is almost certainly the tool.",
    pitfall: "Using a max-heap where a min-heap is needed (or vice versa), and rebuilding the heap instead of pushing/popping.",
  },
  "heap-and-priority-queue": {
    blurb: "priority queues that give you the smallest or largest element in O(log n)",
    whatTests: "Heap questions test 'top-K', streaming medians, and merging sorted sources efficiently.",
    patterns: "top-K, two-heaps, k-way merge",
    insight: "Whenever a problem says 'k largest/smallest' or 'running median', a heap (or two) is almost certainly the tool.",
    pitfall: "Using a max-heap where a min-heap is needed, and rebuilding the heap instead of pushing/popping.",
  },
  "stack-queue": {
    blurb: "LIFO and FIFO structures behind parsing, monotonic, and BFS patterns",
    whatTests: "Stack/queue questions test matching/parsing, monotonic-stack tricks, and level-order processing.",
    patterns: "monotonic stack, parsing with a stack, BFS queue",
    insight: "A monotonic stack answers 'next greater/smaller element' style questions in a single O(n) pass.",
    pitfall: "Popping in the wrong condition for monotonic stacks, and not handling an empty stack before peeking.",
  },
  "stack-and-queue": {
    blurb: "LIFO and FIFO structures behind parsing, monotonic, and BFS patterns",
    whatTests: "Stack/queue questions test matching/parsing, monotonic-stack tricks, and level-order processing.",
    patterns: "monotonic stack, parsing with a stack, BFS queue",
    insight: "A monotonic stack answers 'next greater/smaller element' style questions in a single O(n) pass.",
    pitfall: "Popping in the wrong condition for monotonic stacks, and not handling an empty stack before peeking.",
  },
  backtracking: {
    blurb: "systematic exploration of all candidates with pruning",
    whatTests: "Backtracking tests recursive enumeration of permutations, combinations, and subsets with correct pruning.",
    patterns: "permutations, combinations, subsets, constraint pruning",
    insight: "Backtracking is choose → explore → un-choose; the template barely changes between problems.",
    pitfall: "Forgetting to undo the choice (the 'un-choose' step) and missing pruning that prevents exponential blow-up.",
  },
  intervals: {
    blurb: "ranges on a line that test sorting and sweep-line reasoning",
    whatTests: "Interval questions test whether you sort by the right key and then sweep to merge, insert, or count overlaps.",
    patterns: "sort + sweep, merge intervals, sweep line",
    insight: "Sort by start (or end) first, then a single linear sweep handles merging and overlap detection.",
    pitfall: "Sorting by the wrong endpoint and getting overlap comparisons (>= vs >) subtly wrong.",
  },
  tries: {
    blurb: "prefix trees that make word and prefix lookups fast",
    whatTests: "Trie questions test building a prefix tree and walking it for insert/search/prefix queries.",
    patterns: "prefix tree, word search, autocomplete",
    insight: "When a problem involves many words and shared prefixes, a trie turns repeated string comparisons into one walk.",
    pitfall: "Forgetting the end-of-word marker and mishandling the children-map vs. fixed-array trade-off.",
  },
  "bit-manipulation": {
    blurb: "operating directly on the binary representation of numbers",
    whatTests: "Bit questions test XOR tricks, masking, and counting/​toggling bits efficiently.",
    patterns: "XOR tricks, bit masks, bit counting",
    insight: "XOR cancels duplicates and n & (n-1) clears the lowest set bit — two tricks behind many bit problems.",
    pitfall: "Operator-precedence bugs with & | ^ and forgetting signed-shift behaviour on negative numbers.",
  },
  math: {
    blurb: "number theory and arithmetic reasoning without heavy data structures",
    whatTests: "Math questions test GCD/primes, modular arithmetic, and spotting a closed-form instead of brute force.",
    patterns: "GCD/LCM, sieve, modular arithmetic",
    insight: "Look for a formula or a number-theory property before iterating — many 'math' problems collapse to O(1) or O(log n).",
    pitfall: "Integer overflow and off-by-one in ranges; forgetting to take the modulus at every step when asked.",
  },
  "math-and-number-theory": {
    blurb: "number theory and arithmetic reasoning without heavy data structures",
    whatTests: "Math questions test GCD/primes, modular arithmetic, and spotting a closed-form instead of brute force.",
    patterns: "GCD/LCM, sieve, modular arithmetic",
    insight: "Look for a formula or a number-theory property before iterating — many 'math' problems collapse to O(1) or O(log n).",
    pitfall: "Integer overflow and off-by-one in ranges; forgetting to take the modulus at every step when asked.",
  },
  "two-pointers": {
    blurb: "coordinating two indices to turn quadratic scans into linear ones",
    whatTests: "Two-pointer questions test whether you can converge or chase indices to avoid an O(n²) double loop.",
    patterns: "opposite ends, fast & slow, sliding window",
    insight: "On sorted data, moving the pointer that can't improve the answer turns an O(n²) search into O(n).",
    pitfall: "Moving the wrong pointer, and forgetting the array must usually be sorted for the converging variant.",
  },
  greedy: {
    blurb: "making the locally optimal choice and proving it stays globally optimal",
    whatTests: "Greedy questions test whether you can find the right ordering/choice and argue why it's safe.",
    patterns: "sort + pick, exchange argument, interval scheduling",
    insight: "Greedy works only when a local choice provably never blocks the global optimum — always sanity-check with a counterexample.",
    pitfall: "Assuming greedy works without proof when the problem actually needs DP.",
  },
  "sliding-window": {
    blurb: "a moving sub-range that answers 'best/longest/shortest contiguous' questions",
    whatTests: "Sliding-window questions test expanding and contracting a window while maintaining a running aggregate.",
    patterns: "fixed window, variable window, window + frequency map",
    insight: "Grow the window to include more, shrink it while a constraint is violated — the answer updates as the window moves.",
    pitfall: "Shrinking on the wrong condition and recomputing the window from scratch instead of updating incrementally.",
  },
};

const FALLBACK_FACT = (name: string): TopicFact => ({
  blurb: `a recurring theme in coding interviews`,
  whatTests: `${name} questions test whether you can recognise the underlying pattern and reach the optimal solution cleanly.`,
  patterns: "pattern recognition, clean implementation, complexity analysis",
  insight: `The fastest way to master ${name} is to study the shared pattern across its problems rather than memorising individual answers.`,
  pitfall: "Skipping the brute force, missing edge cases, and not stating the time/space complexity.",
});

export function buildCategoryContent(
  name: string,
  slug: string,
  counts: DSACounts,
): DSAPageContent {
  const f = TOPIC_FACTS[slug] ?? FALLBACK_FACT(name);
  const freq = frequencyWord(counts.total);

  return {
    overview: [
      `${name} is ${f.blurb}, and it shows up ${freq} in technical interviews. ${f.whatTests}`,
      `Our library indexes ${counts.total} ${name} problems (${mix(counts)}), each solved brute-force → optimal in Java and Python with a line-by-line walkthrough and interview talking points. They're grouped below by the curriculum module that teaches the underlying pattern, so related problems reinforce one another.`,
      `If you remember one thing about ${name}, make it this: ${f.insight} Once that clicks, the signature patterns — ${f.patterns} — start to feel like a checklist you run on every new problem.`,
    ],
    studyTips: [
      { title: "Learn the pattern, not the problem", body: `Focus on the recurring techniques behind ${name}: ${f.patterns}. Solving by pattern means you can handle a question you've never seen before.` },
      { title: "Start brute force, then optimise", body: `State the obvious solution and its complexity first, then explain the one change — usually hashing, sorting, or a pointer trick — that removes the bottleneck.` },
      { title: "Write a reusable template", body: `Distil ${name} into a skeleton you can write from memory. In the interview you adapt the template instead of inventing from scratch.` },
      { title: "Finish with complexity", body: `Always close by stating time and space complexity and why. It's an easy signal that separates prepared candidates.` },
    ],
    pitfalls: [
      f.pitfall,
      `Jumping straight to code on a ${name} problem without first stating the approach out loud.`,
      "Forgetting the small inputs — empty, single element, duplicates — that interviewers use to break naïve solutions.",
      "Optimising one of time or space while silently making the other worse.",
    ],
    faqs: [
      { q: `Are ${name} questions common in coding interviews?`, a: `Yes. ${name} appears ${freq} at top tech companies, which is why it has its own module in our curriculum. ${f.whatTests}` },
      { q: `How should I study ${name}?`, a: `Work the problems below grouped by module, starting from easy and moving up. Read the module's theory page first, then solve its problems in order so the shared pattern (${f.patterns}) becomes second nature.` },
      { q: `What's the key idea behind ${name}?`, a: `${f.insight}` },
      { q: `Do you provide solutions in Java and Python?`, a: `Every authored ${name} problem ships with both Java and Python solutions (toggleable), a line-by-line walkthrough of each approach, and a "what to say in the interview" summary.` },
    ],
  };
}

export function buildModuleContent(
  name: string,
  slug: string,
  counts: DSACounts,
  tagline?: string,
): DSAPageContent {
  const f = TOPIC_FACTS[slug] ?? FALLBACK_FACT(name);
  return {
    overview: [
      `${tagline ? tagline + " " : ""}${name} is ${f.blurb}. ${f.whatTests}`,
      `This module collects ${counts.total} practice problems (${mix(counts)}), each solved brute-force → optimal in Java and Python with a line-by-line walkthrough and interview talking points. Work them top to bottom — they're ordered so each one builds on the last.`,
      `The big idea to carry out of this module: ${f.insight} The signature techniques you'll practise here are ${f.patterns}.`,
    ],
    studyTips: [
      { title: "Read, then do", body: `Skim this overview and the signal patterns (${f.patterns}) before you start, then learn by solving the problems below in order.` },
      { title: "Build a template", body: `Reduce ${name} to a skeleton you can write from memory, then adapt it per problem instead of starting from a blank page.` },
      { title: "Brute force first", body: "State the naïve solution and its complexity, then show the one change that makes it optimal — exactly how interviewers want you to reason." },
      { title: "Say the complexity", body: "Close every problem with its time and space complexity and a one-line justification." },
    ],
    pitfalls: [
      f.pitfall,
      `Rushing past the fundamentals of ${name} and trying hard problems before the pattern is automatic.`,
      "Skipping edge cases — empty input, a single element, duplicates, and boundaries.",
      "Memorising specific solutions instead of the reusable pattern.",
    ],
    faqs: [
      { q: `What will I learn in the ${name} module?`, a: `You'll learn to recognise and apply the ${name} pattern — ${f.patterns} — and solve the ${counts.total} problems below cleanly in Java or Python.` },
      { q: `How long does this module take?`, a: `Most learners spend a few focused sessions here. Solve the problems in order; later ones go faster as the pattern becomes second nature.` },
      { q: `What's the key idea?`, a: `${f.insight}` },
    ],
  };
}

// ─── Pattern pages ────────────────────────────────────────────────────────────

export function buildPatternContent(
  name: string,
  counts: DSACounts,
): DSAPageContent {
  const freq = frequencyWord(counts.total);
  return {
    overview: [
      `The ${name} pattern is one of the reusable techniques that experienced candidates spot instantly. Rather than memorising individual problems, strong interviewees recognise that a new question "is just ${name}" and reach for the matching template. That recognition is exactly what this collection is designed to build.`,
      `We index ${counts.total} problems that use the ${name} pattern (${mix(counts)}), each worked brute-force → optimal in Java and Python with line-by-line explanations. Solving them back-to-back is the fastest way to internalise when and how to apply ${name}.`,
      `Pattern-first practice compounds: once ${name} is automatic, you'll see it inside problems that never mention it by name.`,
    ],
    studyTips: [
      { title: "Solve them in a single sitting", body: `Work several ${name} problems in a row. The shared skeleton becomes obvious when you see the same structure solve different-looking questions.` },
      { title: "Name the trigger", body: `Write down the signal that should make you reach for ${name} (e.g. 'contiguous sub-range', 'sorted + pair', 'k largest'). In the interview, that trigger is your cue.` },
      { title: "Keep one template", body: `Maintain a single mental template for ${name} that you can write from memory and adapt, instead of re-deriving it under pressure.` },
      { title: "Compare with neighbours", body: `Know how ${name} differs from adjacent patterns so you pick the right tool when a problem could go more than one way.` },
    ],
    pitfalls: [
      `Forcing ${name} onto a problem that doesn't fit because it's the pattern you just practised.`,
      "Recalling a specific solution instead of re-deriving from the pattern when given a variation.",
      "Skipping the brute force and the complexity discussion that frame your optimal answer.",
      "Missing the edge cases the pattern is notorious for (empty input, boundaries, duplicates).",
    ],
    faqs: [
      { q: `What is the ${name} pattern?`, a: `It's a reusable problem-solving technique that recurs across many interview questions. Learning it once lets you solve a whole family of problems instead of memorising each one.` },
      { q: `When should I use ${name}?`, a: `When a problem shows the pattern's trigger signal. The problems below all share that signal, so working through them trains you to recognise it quickly.` },
      { q: `How many ${name} problems should I do?`, a: `Enough that the template feels automatic — usually solving the indexed set here in sequence is sufficient to recognise ${name} on sight.` },
    ],
  };
}

// ─── Company pages ────────────────────────────────────────────────────────────

export function buildCompanyContent(
  name: string,
  counts: DSACounts,
): DSAPageContent {
  return {
    overview: [
      `${name} coding interviews lean heavily on data structures and algorithms. Rather than obscure trivia, ${name} interviewers favour well-known patterns applied cleanly under time pressure — which means focused, pattern-based practice on the right problems beats grinding hundreds at random.`,
      `Below are ${counts.total} problems associated with ${name}-style interviews (${mix(counts)}), each solved brute-force → optimal in Java and Python with line-by-line walkthroughs and the talking points interviewers reward. They're grouped by module so you can target the patterns ${name} asks about most.`,
      `Use this list to simulate the real loop: pick a problem, set a timer, talk through your approach out loud, and only then start coding.`,
    ],
    studyTips: [
      { title: "Prioritise patterns over volume", body: `${name} reuses a small set of core patterns. Mastering arrays/hashing, two pointers, trees, graphs, and DP covers the large majority of what you'll be asked.` },
      { title: "Simulate the format", body: `Practise out loud with a timer. ${name} interviewers score communication and structured thinking, not just whether the code compiles.` },
      { title: "Lead with the optimal trade-off", body: `State a brute force, then the optimal, and name the trade-off. Demonstrating you considered alternatives is part of the ${name} bar.` },
      { title: "Polish your fundamentals", body: `Clean code, correct edge cases, and a confident complexity analysis matter as much as the algorithm at ${name}.` },
    ],
    pitfalls: [
      `Memorising specific ${name} questions instead of the patterns — the loop gives you variations, not the exact problem.`,
      "Going silent while you think; interviewers can't score reasoning they can't hear.",
      "Skipping edge cases and complexity, which are explicit parts of most rubrics.",
      "Over-optimising prematurely instead of getting a correct solution down first.",
    ],
    faqs: [
      { q: `What DSA topics does ${name} focus on?`, a: `${name} interviews emphasise the core patterns — arrays & hashing, two pointers, sliding window, trees, graphs, and dynamic programming. The problems below are grouped by module so you can target each.` },
      { q: `How should I prepare for ${name} coding rounds?`, a: `Practise by pattern with a timer, talk through your approach out loud, and always cover a brute force, the optimal, and the complexity. Quality of communication matters as much as the final code.` },
      { q: `Are these the exact questions ${name} asks?`, a: `No one can guarantee exact questions, and you shouldn't rely on leaks. These are representative problems that train the patterns ${name} is known to test, which is what actually transfers on interview day.` },
    ],
  };
}
