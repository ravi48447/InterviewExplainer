#!/usr/bin/env node

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const domainRoot = path.join(repoRoot, "content/python-backend-fresher");
const moduleRoot = path.join(domainRoot, "sorting-searching-python");
const indexPath = path.join(domainRoot, "_index.json");
const today = "2026-09-07";
const interviewProse = (value) => String(value)
  .split(/\n\s*\n/)
  .map((paragraph) => paragraph.replace(/^\s*[-*+]\s+/, ""))
  .join("\n\n");

const topicOrder = [
  "bubble-sort",
  "selection-insertion-sort",
  "python-sort-and-sorted",
  "linear-search",
  "binary-search",
  "two-pointers-basics",
  "string-manipulation-patterns",
];

const topicTitles = {
  "bubble-sort": "Bubble Sort",
  "selection-insertion-sort": "Selection Sort and Insertion Sort",
  "python-sort-and-sorted": "Python sort() and sorted()",
  "linear-search": "Linear Search",
  "binary-search": "Binary Search",
  "two-pointers-basics": "Two-Pointer Basics",
  "string-manipulation-patterns": "String Manipulation Patterns",
};

const prose = (...parts) => parts.join("\n\n");
const table = (...rows) => rows.join("\n");
const python = (...lines) => ["```python", ...lines, "```"].join("\n");
const mermaid = (...lines) => {
  const safeLines = lines.map((line) => line
    .replace(/\b([A-Za-z][A-Za-z0-9_]*)\[([^\]"]+)\]/g, '$1["$2"]')
    .replace(/\b([A-Za-z][A-Za-z0-9_]*)\{([^}"]+)\}/g, '$1{"$2"}'));
  return ["```mermaid", ...safeLines, "```"].join("\n");
};

const definitions = [
  {
    topic: "bubble-sort",
    slug: "python-bubble-sort-algorithm-complexity",
    question: "How does bubble sort work, and what is its time and space complexity?",
    title: "Bubble Sort Algorithm and Complexity",
    direct: "Bubble sort repeatedly compares adjacent values and swaps an out-of-order pair. After each complete left-to-right pass, the largest remaining value has moved to the pass's right boundary. Its usual and worst-case time is O(n²), while an in-place implementation uses O(1) auxiliary space.",
    quick: [
      "Compare adjacent values and swap only when the left value is greater than the right value.",
      "After one full pass, the largest unsorted value is fixed at the right boundary.",
      "Shorten the next pass because the sorted suffix no longer needs comparison.",
      "Average and worst-case time are O(n²); an in-place version uses O(1) auxiliary space.",
      "With a swap flag, already sorted input can finish in O(n) time.",
    ],
    intent: {
      testing: "Whether the pass invariant, loop bounds, complexity, and in-place behavior can be connected to code.",
      common_mistake: "Running the inner loop to the final index and then reading `items[index + 1]`, or forgetting that the sorted suffix can be skipped.",
      to_stand_out: "State exactly what becomes sorted after each pass and distinguish the basic worst case from the early-exit best case.",
    },
    speaking: prose(
      "Bubble sort orders a sequence by repeatedly comparing neighboring values. If the left value is greater than the right value, the algorithm swaps them. A large value can move several positions during one pass, so after a complete left-to-right pass the largest value in the unsorted region is at that region's right edge.",
      "The outer loop moves that right boundary left after each pass. For `n` values, the first pass makes at most `n - 1` comparisons, the next makes `n - 2`, and so on. The total is roughly `n(n - 1) / 2`, which is O(n²). Swapping tuple assignments inside the same list gives O(1) auxiliary space, although the input list is mutated.",
      "For example, `[5, 1, 4, 2]` becomes `[1, 4, 2, 5]` after its first pass. The value 5 has reached its final position, but the prefix is not fully sorted. The next pass only needs to inspect that prefix. Repeating this invariant eventually leaves no unsorted positions.",
      "An optimized version records whether a pass made any swap. If not, the current order is already sorted and the algorithm can stop, giving O(n) best-case time for sorted input. That optimization does not change the O(n²) average or worst case. Bubble sort is useful for learning invariants and adjacent swaps, but Python's stable built-in sort is the practical choice for real collections because it scales far better."
    ),
    deepTitle: "Each pass grows a sorted suffix by one position",
    deep: prose(
      "The correctness invariant is not that the whole list looks better after every comparison. It is that after pass `p`, the `p` largest values occupy their final positions at the right. Adjacent swaps move an oversized value right without losing any element.",
      table(
        "| Pass over `[5, 1, 4, 2]` | Comparisons and swaps | State after pass |",
        "|---|---|---|",
        "| 1 | `5↔1`, `5↔4`, `5↔2` | `[1, 4, 2, 5]` |",
        "| 2 | keep `1,4`; then `4↔2` | `[1, 2, 4, 5]` |",
        "| 3 | no swap | sorted |"
      ),
      mermaid(
        "flowchart LR",
        "  P[scan adjacent pairs in unsorted prefix] --> S{left greater than right?}",
        "  S -- yes --> W[swap neighbors]",
        "  S -- no --> K[keep order]",
        "  W --> E[largest remaining value reaches right boundary]",
        "  K --> E"
      ),
      python(
        "def bubble_sort(values):",
        "    items = values.copy()",
        "    for end in range(len(items) - 1, 0, -1):",
        "        for index in range(end):",
        "            if items[index] > items[index + 1]:",
        "                items[index], items[index + 1] = items[index + 1], items[index]",
        "    return items",
        "",
        "source = [5, 1, 4, 2]",
        "assert bubble_sort(source) == [1, 2, 4, 5]",
        "assert source == [5, 1, 4, 2]"
      ),
      "The copy in this teaching function protects the caller, so the function itself uses O(n) result storage. Removing that copy and sorting the supplied list would expose the classic O(1)-auxiliary in-place form."
    ),
    followups: [
      "Why can the inner-loop boundary shrink after every pass?",
      "What changes the best-case time from O(n²) to O(n)?",
      "Does returning a copied result still count as an in-place implementation?",
    ],
  },
  {
    topic: "bubble-sort",
    slug: "python-bubble-sort-early-exit",
    question: "How does early exit improve bubble sort on sorted or nearly sorted input?",
    title: "Bubble Sort Early-Exit Optimization",
    direct: "Early-exit bubble sort resets a `swapped` flag before each pass and stops when a full pass makes no swaps. A no-swap pass proves every adjacent pair in the remaining region is ordered, so the entire list is sorted; this makes the best case O(n) without changing the O(n²) worst case.",
    quick: [
      "Set `swapped = False` at the beginning of every outer pass.",
      "Set it to `True` whenever an adjacent exchange occurs.",
      "If a complete pass makes no exchange, stop because the list is already ordered.",
      "Sorted input needs one pass: O(n) best-case time.",
      "Reverse-sorted input still performs quadratic comparisons and swaps.",
    ],
    intent: {
      testing: "Whether an optimization is justified by an invariant rather than added as an unexplained flag.",
      common_mistake: "Failing to reset the flag for each pass or stopping after one comparison that required no swap.",
      to_stand_out: "Explain why only a complete no-swap pass proves global sorted order.",
    },
    speaking: prose(
      "The basic bubble-sort loops run a fixed number of passes even if the input becomes sorted early. The early-exit version observes whether a full pass changed anything. It sets `swapped` to false before the pass, changes it to true on every exchange, and returns immediately if the flag remains false after the entire unsorted region has been checked.",
      "That stop is correct because a list is sorted exactly when every adjacent pair is in nondecreasing order. One isolated comparison without a swap proves only that pair is ordered. A complete pass without a swap proves the condition for every neighboring pair in the active region; the suffix from earlier passes is already fixed, so the whole list is sorted.",
      "For example, `[1, 2, 3, 4]` needs three adjacent comparisons in its first pass and makes no swaps. It stops instead of running two more passes, so work is O(n). The nearly sorted list `[1, 2, 4, 3, 5]` swaps 4 and 3 during the first pass, then a second pass finds no disorder and stops. Reverse-sorted data keeps swapping and still takes O(n²) time.",
      "The optimization improves adaptive behavior but does not turn bubble sort into a generally efficient sorting algorithm. It adds one boolean and keeps O(1) auxiliary space for an in-place implementation. I would include the flag when asked to implement bubble sort well, while still choosing Python's built-in stable sort for production code. The important point is that the early return follows a proven no-inversion condition, not a guess that the data looks sorted."
    ),
    deepTitle: "No swaps across a complete pass means no adjacent inversion remains",
    deep: prose(
      "An inversion is a pair whose order conflicts with the requested sort. Bubble sort directly tests adjacent inversions. If no adjacent inversion exists anywhere, a later smaller value cannot hide behind a larger one; the sequence is nondecreasing from left to right.",
      mermaid(
        "flowchart TD",
        "  B[begin pass with swapped false] --> C[compare every active adjacent pair]",
        "  C --> Q{did any pair swap?}",
        "  Q -- yes --> N[shrink boundary and start another pass]",
        "  Q -- no --> D[all adjacent pairs ordered; finish]",
        "  N --> B"
      ),
      "The function returns the sorted copy and the number of completed passes so the adaptive behavior is testable without timing noise.",
      python(
        "def adaptive_bubble_sort(values):",
        "    items = values.copy()",
        "    passes = 0",
        "    for end in range(len(items) - 1, 0, -1):",
        "        swapped = False",
        "        for index in range(end):",
        "            if items[index] > items[index + 1]:",
        "                items[index], items[index + 1] = items[index + 1], items[index]",
        "                swapped = True",
        "        passes += 1",
        "        if not swapped:",
        "            break",
        "    return items, passes",
        "",
        "assert adaptive_bubble_sort([1, 2, 3, 4]) == ([1, 2, 3, 4], 1)",
        "assert adaptive_bubble_sort([1, 2, 4, 3, 5]) == ([1, 2, 3, 4, 5], 2)"
      ),
      "For zero or one item the outer loop runs zero passes. The list is already sorted, so returning zero as the observed pass count is a valid boundary result."
    ),
    followups: [
      "Why must the algorithm finish a whole pass before using the no-swap conclusion?",
      "What input still forces the early-exit version into O(n²) work?",
      "How would you test the empty and one-element boundaries?",
    ],
  },
  {
    topic: "bubble-sort",
    slug: "python-bubble-sort-stability-in-place",
    question: "Is bubble sort stable and in place, and which code choices preserve those properties?",
    title: "Bubble Sort Stability and In-Place Behavior",
    direct: "Bubble sort is stable when it swaps adjacent records only if the left key is strictly greater than the right key, because equal-key records never cross. It is in place when it rearranges the caller's list with only constant extra state; copying the input or decorating every record changes the space claim.",
    quick: [
      "Stable sorting preserves the original relative order of records with equal sort keys.",
      "Swap on `left_key > right_key`, not `>=`, to keep equal-key neighbors in order.",
      "Adjacent swaps cannot make equal records cross if equal records are never exchanged.",
      "An in-place implementation mutates the supplied list and uses O(1) auxiliary state.",
      "Returning a full copied list is non-mutating for the caller but needs O(n) additional references.",
    ],
    intent: {
      testing: "Whether stability and in-place sorting are treated as separate properties controlled by concrete implementation choices.",
      common_mistake: "Calling bubble sort automatically stable while using `>=`, which can reverse equal-key records.",
      to_stand_out: "Prove stability through adjacent crossing and state whether the function copies or mutates its input.",
    },
    speaking: prose(
      "Stability means that records with equal sort keys keep their original relative order. Bubble sort can guarantee that property because it works through adjacent exchanges. If it swaps only when the left key is strictly greater than the right key, two equal-key records are never exchanged and therefore cannot cross each other.",
      "The comparison operator matters. Suppose the input is `[(2, 'first'), (2, 'second'), (1, 'low')]` and sorting uses the numeric field. A strict `>` comparison eventually places the record with key 1 first while keeping `first` before `second`. If the code swaps on `>=`, equal records can exchange even though their key order was already valid, and stability is lost.",
      "In-place is a different property. A classic bubble-sort function receives a mutable list, swaps elements inside it, and stores only loop indexes, a flag, and temporary references, so auxiliary space is O(1). A function that begins with `items = values.copy()` protects the caller but allocates O(n) references; its internal swap algorithm is the same, yet the complete function is not in-place from the caller's perspective.",
      "Stability is useful when an earlier ordering carries meaning, such as arrival order among equal priorities. In-place behavior saves a second list but exposes mutation and aliasing to callers. These properties do not rescue bubble sort's O(n²) scalability. They are best used to explain algorithm guarantees precisely; in real Python code, built-in sorting is already stable and normally gives better performance."
    ),
    deepTitle: "Equal records stay stable only when they never cross",
    deep: prose(
      "Track identities as well as keys. Two records can compare equal for sorting while still being distinct objects. Stability is about their identity order, not whether the final key sequence is sorted.",
      mermaid(
        "flowchart LR",
        "  A[key 2: first] --> B[key 2: second]",
        "  B --> C[key 1: low]",
        "  C -. swaps left past larger keys .-> A",
        "  A -. equal keys are not swapped .-> B",
        "  C --> R[key 1: low · key 2: first · key 2: second]"
      ),
      "This implementation mutates the passed list and uses a separate `key` callback. The identity assertion proves the equal-key records remain in their input order.",
      python(
        "def stable_bubble_sort(items, key):",
        "    for end in range(len(items) - 1, 0, -1):",
        "        for index in range(end):",
        "            if key(items[index]) > key(items[index + 1]):",
        "                items[index], items[index + 1] = items[index + 1], items[index]",
        "    return None",
        "",
        "first = {\"score\": 2, \"name\": \"first\"}",
        "second = {\"score\": 2, \"name\": \"second\"}",
        "low = {\"score\": 1, \"name\": \"low\"}",
        "records = [first, second, low]",
        "result = stable_bubble_sort(records, key=lambda record: record[\"score\"])",
        "assert result is None",
        "assert records == [low, first, second]"
      ),
      "Returning `None` follows the same convention as `list.sort`: the function makes mutation explicit rather than letting a caller accidentally treat the return value as another list."
    ),
    followups: [
      "How can changing `>` to `>=` break bubble-sort stability?",
      "Why are stability and in-place behavior independent properties?",
      "How does copying the input change the auxiliary-space analysis?",
    ],
  },
  {
    topic: "selection-insertion-sort",
    slug: "python-selection-sort-algorithm",
    question: "How does selection sort work, and why does it use relatively few swaps?",
    title: "Selection Sort Algorithm and Swap Count",
    direct: "Selection sort scans the unsorted suffix to find its smallest value, then swaps that value into the next output position. It always performs O(n²) comparisons, uses O(1) auxiliary space in place, and makes at most n − 1 swaps, but the usual swap-based version is not stable.",
    quick: [
      "Treat the prefix as sorted and the suffix as unsorted.",
      "Find the minimum position in the entire unsorted suffix.",
      "Swap that minimum into the suffix's first position.",
      "Comparisons are O(n²) even for already sorted input; swaps are at most O(n).",
      "The standard in-place swap can move an equal-key record past another, so it is usually unstable.",
    ],
    intent: {
      testing: "Whether selection, placement, comparison count, swap count, and stability are distinguished.",
      common_mistake: "Saying selection sort becomes O(n) on sorted input or assuming few swaps means few comparisons.",
      to_stand_out: "Explain why it can suit expensive writes while still being a poor large-input comparison sort.",
    },
    speaking: prose(
      "Selection sort grows a sorted prefix from left to right. At position `start`, it scans every position from `start` to the end, remembers the index of the smallest value, and swaps that value into `start`. The prefix through `start` is then final, so the next pass begins one position later.",
      "The scan length decreases from `n` to one, but the total comparisons are still about `n(n - 1) / 2`, giving O(n²) time in the best, average, and worst cases. The algorithm cannot detect sorted input merely by finding the current minimum, because it still scans the full suffix to prove no smaller value exists. An in-place version stores only a minimum index and temporary swap references, so auxiliary space is O(1).",
      "For example, from `[29, 10, 14, 37]`, the first scan selects 10 and swaps it with 29, producing `[10, 29, 14, 37]`. The second scan selects 14 and places it at index one. Each pass performs at most one swap, so the whole sort makes no more than `n - 1` swaps even though it makes quadratic comparisons.",
      "That low write count can matter when writes are expensive, but the common swap-based algorithm is not stable: moving a later minimum to the front can move the displaced record past another equal-key record. Selection sort is valuable for understanding selection invariants and cost categories. For normal Python applications, built-in sorting is stable and much more scalable, so few swaps alone rarely justify implementing selection sort."
    ),
    deepTitle: "The next prefix position is chosen by a complete suffix scan",
    deep: prose(
      "The invariant after position `start` is completed: the prefix contains the globally smallest `start + 1` values in sorted order. A complete suffix scan is what makes that claim possible, even when the input already looks ordered.",
      mermaid(
        "flowchart LR",
        "  P[sorted prefix] --> U[scan every value in unsorted suffix]",
        "  U --> M[remember smallest suffix index]",
        "  M --> S[swap minimum into next prefix position]",
        "  S --> G[grow final prefix by one]"
      ),
      python(
        "def selection_sort(values):",
        "    items = values.copy()",
        "    swaps = 0",
        "    for start in range(len(items) - 1):",
        "        minimum = start",
        "        for index in range(start + 1, len(items)):",
        "            if items[index] < items[minimum]:",
        "                minimum = index",
        "        if minimum != start:",
        "            items[start], items[minimum] = items[minimum], items[start]",
        "            swaps += 1",
        "    return items, swaps",
        "",
        "ordered, swaps = selection_sort([29, 10, 14, 37])",
        "assert ordered == [10, 14, 29, 37]",
        "assert swaps == 2"
      ),
      "A stable selection variant can remove the minimum and shift the intervening block instead of swapping. That preserves order but increases data movement, showing that implementation properties involve trade-offs."
    ),
    followups: [
      "Why does selection sort still make O(n²) comparisons on sorted input?",
      "How many swaps can the standard algorithm make at most?",
      "Why can its direct swap break stability?",
    ],
  },
  {
    topic: "selection-insertion-sort",
    slug: "python-insertion-sort-nearly-sorted",
    question: "How does insertion sort work, and why is it effective on nearly sorted input?",
    title: "Insertion Sort and Nearly Sorted Data",
    direct: "Insertion sort grows a sorted prefix by taking the next value, shifting larger prefix values right, and placing the value into the gap. It is stable and in place with strict comparisons, takes O(n²) average and worst-case time, and approaches O(n) when few values are out of order.",
    quick: [
      "Maintain a sorted prefix ending just before the current value.",
      "Save the current value, shift larger prefix values right, then insert into the open position.",
      "Worst and average time are O(n²); best-case sorted input is O(n).",
      "Strict `>` shifting preserves equal-key order, so the usual version is stable.",
      "In-place insertion sort uses O(1) auxiliary state and adapts to few inversions.",
    ],
    intent: {
      testing: "Whether insertion, shifting, adaptiveness, stability, and bounds can be explained from one prefix invariant.",
      common_mistake: "Overwriting the current value while shifting because it was not saved before opening the gap.",
      to_stand_out: "Connect work to the number of inversions and explain why strict comparison retains stability.",
    },
    speaking: prose(
      "Insertion sort treats the left part of a list as a sorted prefix. Starting with the second value, it saves the current value, shifts every larger prefix value one place right, and writes the saved value into the gap. This resembles inserting a playing card into the correct position in a sorted hand.",
      "For example, with `[1, 4, 2, 3]`, the prefix `[1, 4]` is sorted when 2 becomes current. The algorithm saves 2, shifts 4 right, and writes 2 between 1 and 4. When 3 is processed, it shifts only 4. The prefix invariant remains true after every insertion.",
      "Reverse-sorted input makes each new value cross the full prefix, producing roughly n²/2 comparisons and shifts, so worst-case time is O(n²). Already sorted input performs one failed comparison per new value and no shifts, giving O(n). Nearly sorted data has relatively few inversions—pairs in the wrong order—so it also needs little movement. The algorithm uses O(1) auxiliary space when it mutates the list.",
      "Using `>` rather than `>=` in the shift condition keeps an incoming equal-key record after earlier equal records, which makes the common implementation stable. Insertion sort is practical for small or nearly sorted runs and appears as a building block inside more advanced sorting strategies. It is not a good general choice for large random input, where Python's built-in adaptive stable sort provides much better worst-case scaling."
    ),
    deepTitle: "Save one value, open one gap, and restore the prefix invariant",
    deep: prose(
      "Shifting is safer than repeated swapping because the current value is held separately while a gap moves left. At every step, the values to the left of the gap remain sorted and are no greater than the values already shifted to its right.",
      mermaid(
        "flowchart LR",
        "  C[save current value] --> Q{prefix value greater than current?}",
        "  Q -- yes --> R[shift prefix value one place right]",
        "  R --> Q",
        "  Q -- no --> I[write current value into the gap]",
        "  I --> P[sorted prefix grows by one]"
      ),
      python(
        "def insertion_sort(values):",
        "    items = values.copy()",
        "    for index in range(1, len(items)):",
        "        current = items[index]",
        "        position = index - 1",
        "        while position >= 0 and items[position] > current:",
        "            items[position + 1] = items[position]",
        "            position -= 1",
        "        items[position + 1] = current",
        "    return items",
        "",
        "assert insertion_sort([1, 4, 2, 3]) == [1, 2, 3, 4]",
        "assert insertion_sort([]) == []",
        "assert insertion_sort([7]) == [7]"
      ),
      "Binary search can locate the insertion position with fewer comparisons, but moving a block still costs O(n). It does not change insertion sort's quadratic movement in the worst case."
    ),
    followups: [
      "Why must the current value be saved before shifting begins?",
      "How does the number of inversions affect insertion-sort work?",
      "Would binary search make worst-case insertion sort O(n log n)?",
    ],
  },
  {
    topic: "selection-insertion-sort",
    slug: "python-selection-sort-vs-insertion-sort",
    question: "How do selection sort and insertion sort differ, and when is insertion sort the better choice?",
    title: "Selection Sort vs Insertion Sort",
    direct: "Selection sort repeatedly selects a suffix minimum and always makes O(n²) comparisons but at most O(n) swaps. Insertion sort shifts a value into a sorted prefix, is stable and adaptive, and can run near O(n) on nearly sorted data, so it is usually better when existing order or stability matters.",
    quick: [
      "Selection sort finds a minimum; insertion sort places the next item into a sorted prefix.",
      "Selection sort always compares quadratically, while insertion sort adapts to existing order.",
      "Selection sort uses at most n − 1 swaps; insertion sort may perform O(n²) shifts.",
      "The usual selection sort is unstable; the usual strict-comparison insertion sort is stable.",
      "Both can be in place with O(1) auxiliary space and both have O(n²) worst-case time.",
    ],
    intent: {
      testing: "Whether algorithms are compared by mechanism, data movement, adaptiveness, stability, and workload rather than one complexity label.",
      common_mistake: "Saying both are simply O(n²) and therefore equivalent for every input.",
      to_stand_out: "Choose insertion sort for small nearly sorted runs and selection sort only when minimizing writes is unusually important.",
    },
    speaking: prose(
      "Selection sort and insertion sort both grow a sorted prefix and both have O(n²) worst-case time, but they do different work. Selection sort scans the whole unsorted suffix to choose its minimum, then performs at most one swap for that output position. Insertion sort takes the next value and shifts larger prefix values until it reaches the correct gap.",
      "Selection sort makes roughly the same number of comparisons regardless of input order. Its advantage is a low number of swaps—at most `n - 1`—which can matter if writes are much more expensive than reads. The standard direct-swap form is not stable because a selected value can move ahead of an equal-key record.",
      "Insertion sort is adaptive. For example, on `[1, 2, 4, 3, 5]`, it performs a small shift to insert 3 and otherwise advances with almost no movement. Sorted input takes O(n), while reverse order takes O(n²) shifts. With a strict greater-than comparison, equal-key records keep their relative order, so it is stable.",
      "Both algorithms can mutate one list with O(1) auxiliary state, but that does not make their behavior identical. For a small nearly sorted collection, streaming values arriving close to their correct positions, or a workload needing stability, insertion sort is usually the better educational choice. Selection sort fits the narrower case where reducing swaps matters more than comparisons or stability. For large general data, neither should replace Python's built-in stable sort, which has O(n log n) worst-case complexity and exploits existing order."
    ),
    deepTitle: "Comparison count and movement count tell different stories",
    deep: prose(
      table(
        "| Property | Selection sort | Insertion sort |",
        "|---|---|---|",
        "| main action | select suffix minimum | insert next value into prefix |",
        "| already sorted | O(n²) comparisons | O(n) comparisons |",
        "| reverse sorted | O(n²) | O(n²) |",
        "| data movement | at most O(n) swaps | up to O(n²) shifts |",
        "| usual stability | no | yes |",
        "| auxiliary space | O(1) in place | O(1) in place |"
      ),
      mermaid(
        "flowchart TD",
        "  D{What matters about this small input?} -->|nearly sorted or stable order| I[insertion sort]",
        "  D -->|writes unusually expensive| S[selection sort]",
        "  D -->|large general collection| B[Python built-in stable sort]"
      ),
      "The instrumented example counts the characteristic work on the same nearly sorted input. Selection still scans every suffix pair, while insertion moves only the single inversion.",
      python(
        "def work_counts(values):",
        "    selection_comparisons = sum(range(len(values)))",
        "    insertion_shifts = 0",
        "    items = values.copy()",
        "    for index in range(1, len(items)):",
        "        current = items[index]",
        "        position = index - 1",
        "        while position >= 0 and items[position] > current:",
        "            items[position + 1] = items[position]",
        "            position -= 1",
        "            insertion_shifts += 1",
        "        items[position + 1] = current",
        "    return selection_comparisons, insertion_shifts, items",
        "",
        "comparisons, shifts, ordered = work_counts([1, 2, 4, 3, 5])",
        "assert (comparisons, shifts, ordered) == (10, 1, [1, 2, 3, 4, 5])"
      )
    ),
    followups: [
      "Why can selection sort use fewer writes but still take O(n²) time?",
      "Which algorithm benefits from an already sorted prefix, and how?",
      "What implementation detail makes ordinary insertion sort stable?",
    ],
  },
  {
    topic: "python-sort-and-sorted",
    slug: "python-list-sort-vs-sorted",
    question: "What is the difference between `list.sort()` and `sorted()` in Python?",
    title: "list.sort() vs sorted() in Python",
    direct: "`list.sort()` rearranges one list in place and returns `None`, while `sorted(iterable)` consumes any iterable and returns a new list without rearranging the source object. Both support `key` and `reverse`, both are stable, and their normal worst-case sorting time in CPython is O(n log n).",
    quick: [
      "`items.sort()` mutates that list and deliberately returns `None`.",
      "`sorted(source)` returns a new list and accepts any iterable, not only lists.",
      "Both accept `key=` and `reverse=` and both preserve the order of equal-key records.",
      "Use `sort` when the list intentionally owns the new order; use `sorted` when the source must remain unchanged.",
      "Sorting takes O(n log n) worst-case time in CPython and still needs implementation-managed working memory.",
    ],
    intent: {
      testing: "Whether mutation, return value, accepted input, stability, and ownership are all distinguished.",
      common_mistake: "Writing `ordered = items.sort()` and receiving `None`, or assuming `sorted()` returns the original iterable type.",
      to_stand_out: "Frame the choice as an ownership decision and mention that `sorted()` always produces a list.",
    },
    speaking: prose(
      "`list.sort()` and `sorted()` use Python's sorting machinery but expose different ownership contracts. The list method rearranges the same list object and returns `None`. Returning `None` makes mutation hard to overlook and prevents code from treating the result as a separate collection. Only list objects provide this method.",
      "The built-in `sorted()` function accepts any iterable, reads its elements, and returns a new list in sorted order. A tuple, generator, set, dictionary view, or list can be passed, but the result is always a list. The source object is not rearranged, although producing the result necessarily stores references in a new list.",
      "For example, if `scores = [8, 3, 5]`, `scores.sort()` changes it to `[3, 5, 8]` and returns `None`. With `scores = [8, 3, 5]`, `ordered = sorted(scores)` makes `ordered` equal `[3, 5, 8]` while `scores` remains unchanged. Both forms accept the same `key` and `reverse` controls and both are guaranteed stable.",
      "In CPython's documented complexity, list sorting has O(n log n) worst-case time and adapts to order already present in the input. The method can be slightly more efficient when the original list is no longer needed, while `sorted` is clearer when callers still own the old order or the source is not a list. The right choice is therefore not about different comparison results; it is whether mutation is part of the function's contract."
    ),
    deepTitle: "The same ordering operation can have two different ownership outcomes",
    deep: prose(
      mermaid(
        "flowchart TD",
        "  S[source iterable] --> Q{May this list object be rearranged?}",
        "  Q -- yes and source is a list --> M[list.sort mutates and returns None]",
        "  Q -- no or source is another iterable --> N[sorted builds a new list]",
        "  M --> O[stable ordered list in original object]",
        "  N --> C[stable ordered copy; source unchanged]"
      ),
      "The identity checks below make the contract visible. The tuple demonstrates that `sorted` does not try to preserve the iterable's type.",
      python(
        "values = [8, 3, 5]",
        "same_object = values",
        "result = values.sort()",
        "assert result is None",
        "assert values is same_object",
        "assert values == [3, 5, 8]",
        "",
        "source = (8, 3, 5)",
        "ordered = sorted(source)",
        "assert ordered == [3, 5, 8]",
        "assert isinstance(ordered, list)",
        "assert source == (8, 3, 5)"
      ),
      "A shallow ordering operation rearranges references; it does not recursively copy the objects being sorted. Mutating a record after sorting can therefore be visible through both source and result when they share that record."
    ),
    followups: [
      "Why does `list.sort()` return `None`?",
      "What type does `sorted()` return when its input is a tuple or generator?",
      "How should aliasing affect the decision to sort a list in place?",
    ],
  },
  {
    topic: "python-sort-and-sorted",
    slug: "python-sort-key-stability-reverse",
    question: "How do `key`, sort stability, and `reverse` work in Python sorting?",
    title: "Python Sort Keys, Stability, and Reverse Order",
    direct: "A sort `key` function converts each record to the value used for comparisons and is evaluated once per input record during the sort. Python sorting is stable, so equal-key records retain their input order, and `reverse=True` reverses key order while still preserving that stability.",
    quick: [
      "A key function accepts one record and returns its comparison value.",
      "Python evaluates the key once for each input record during one sort.",
      "Tuple keys express multi-field priority from left to right.",
      "Stable sorting keeps equal-key records in their original relative order.",
      "`reverse=True` requests descending key order and still preserves stability.",
    ],
    intent: {
      testing: "Whether records are ordered through extracted keys and stability is used intentionally for ties and multi-level sorting.",
      common_mistake: "Writing a two-argument comparator as `key`, negating values blindly for descending order, or assuming reverse mode breaks tie stability.",
      to_stand_out: "Use a tuple key for mixed priorities or stable passes from secondary key to primary key.",
    },
    speaking: prose(
      "The `key` parameter tells Python what value should control each record's position. It receives one record and returns a comparable key. Python computes that key exactly once per input record for one sort, then compares the extracted keys instead of repeatedly calling the function during every comparison.",
      "For example, `sorted(users, key=lambda user: user['age'])` orders dictionaries by age even though dictionaries themselves do not have a natural ordering. A tuple key such as `(user['team'], -user['score'])` applies fields from left to right: team ascending, then score descending within a team. The key values themselves must support the required comparisons.",
      "Python's sort is stable. If two records have equal keys, their relative input order is retained. That makes ties predictable and also supports multi-pass sorting: sort by the secondary field first, then stably sort by the primary field. Records tied on the primary field retain the earlier secondary order. `reverse=True` changes the direction of key ordering but still preserves relative order among equal-key records.",
      "Stability does not create a missing tie-break rule. If a business requirement says equal scores must be ordered by name, that field should appear in the key rather than relying on arrival order accidentally. Similarly, mixed types such as `None` and integers may not be comparable, so a key can normalize them into a consistent shape. I use key functions to express the ordering rule explicitly, then rely on stability only where retaining prior order is the intended tie policy."
    ),
    deepTitle: "Decorate each record once, order the keys, preserve ties",
    deep: prose(
      mermaid(
        "flowchart LR",
        "  R[each input record] --> K[compute one comparison key]",
        "  K --> O[order records by key]",
        "  O --> T{two keys equal?}",
        "  T -- yes --> P[preserve their input order]",
        "  T -- no --> C[use requested ascending or reverse key order]"
      ),
      "The example orders teams ascending and scores descending, then proves the two equal-key blue records remain in their original order.",
      python(
        "records = [",
        "    {\"team\": \"blue\", \"score\": 8, \"name\": \"Mina\"},",
        "    {\"team\": \"red\", \"score\": 9, \"name\": \"Omar\"},",
        "    {\"team\": \"blue\", \"score\": 8, \"name\": \"Asha\"},",
        "    {\"team\": \"blue\", \"score\": 10, \"name\": \"Lee\"},",
        "]",
        "ordered = sorted(records, key=lambda record: (record[\"team\"], -record[\"score\"]))",
        "assert [record[\"name\"] for record in ordered] == [\"Lee\", \"Mina\", \"Asha\", \"Omar\"]",
        "",
        "reverse_ties = sorted(records[:3], key=lambda record: record[\"score\"], reverse=True)",
        "assert [record[\"name\"] for record in reverse_ties] == [\"Omar\", \"Mina\", \"Asha\"]"
      ),
      "For locale-sensitive text or Unicode equivalence, a plain key such as `str.lower` may not represent the product's actual collation rule. Key extraction is where that domain policy belongs."
    ),
    followups: [
      "Why is a key function different from a two-argument comparison function?",
      "How can stability implement a multi-pass sort?",
      "What should you do when equal keys need an explicit business tie-breaker?",
    ],
  },
  {
    topic: "python-sort-and-sorted",
    slug: "python-partial-sort-min-max-heapq",
    question: "When should you use `min`, `max`, `heapq.nsmallest`, or a full sort?",
    title: "Partial Selection vs Full Sorting in Python",
    direct: "Use `min` or `max` when only one extreme is needed, `heapq.nsmallest` or `nlargest` when a small number of extremes is needed from a much larger iterable, and `sorted` when the whole order or a large portion is required. The choice avoids paying for relationships the result never uses.",
    quick: [
      "`min` and `max` make one pass and keep almost no auxiliary state.",
      "`nsmallest(k, data)` and `nlargest(k, data)` keep only `k` selected elements while scanning.",
      "Heap-based selection is most useful when `k` is small relative to the input size.",
      "For a large `k`, a full `sorted()` result is usually more efficient and simpler.",
      "A Python min-heap keeps its smallest element at index zero; it is not a fully sorted list.",
    ],
    intent: {
      testing: "Whether the result contract is used to avoid an unnecessary full sort and heap behavior is described accurately.",
      common_mistake: "Sorting an entire dataset to read one maximum, or treating a heap's internal list as globally sorted.",
      to_stand_out: "Connect the chosen tool to one extreme, a small top-k, repeated priority operations, or complete ordering.",
    },
    speaking: prose(
      "A full sort computes the relative order of every element, so it is more work than necessary when the result asks for only a few extremes. Python provides tools with narrower contracts. `min()` and `max()` make a single pass and retain almost no auxiliary state, which is ideal for one smallest or largest record.",
      "For a small top `k`, `heapq.nsmallest(k, iterable)` or `heapq.nlargest(k, iterable)` scans the data while keeping only `k` selected elements in memory. Python's documentation recommends these functions when `k` is small relative to the input and recommends `sorted()` for larger `k`. When `k` is one, `min` or `max` is more efficient and clearer.",
      "For example, finding the three cheapest products from a stream of one million products does not require storing a million-item sorted result. `heapq.nsmallest(3, products, key=lambda p: p['price'])` returns the three selected records. If the UI must paginate every product in price order, a full sort or an external database order is the correct contract instead.",
      "A heap is partially ordered, not completely sorted. In a min-heap, every parent is no greater than its children and index zero is the minimum, but sibling and distant positions do not form sorted order. Repeated priority-queue operations may justify maintaining an actual heap. I choose the smallest operation that produces the required result: one-pass extreme, bounded top-k, persistent priority queue, or complete stable ordering."
    ),
    deepTitle: "The requested amount of order determines the right tool",
    deep: prose(
      mermaid(
        "flowchart TD",
        "  Q{How much ordered output is required?} -->|one extreme| E[min or max]",
        "  Q -->|small top k| H[heapq nsmallest or nlargest]",
        "  Q -->|most or all values| S[sorted or list.sort]",
        "  Q -->|repeated priority updates| P[maintained heap]"
      ),
      "The code makes the contracts concrete. It also checks only the heap invariant, not a false claim that the heap list is sorted.",
      python(
        "import heapq",
        "",
        "products = [",
        "    {\"name\": \"A\", \"price\": 90},",
        "    {\"name\": \"B\", \"price\": 20},",
        "    {\"name\": \"C\", \"price\": 50},",
        "    {\"name\": \"D\", \"price\": 10},",
        "]",
        "cheapest = heapq.nsmallest(2, products, key=lambda product: product[\"price\"])",
        "assert [product[\"name\"] for product in cheapest] == [\"D\", \"B\"]",
        "assert min(products, key=lambda product: product[\"price\"])[\"name\"] == \"D\"",
        "",
        "heap = [7, 2, 5, 1]",
        "heapq.heapify(heap)",
        "assert heap[0] == 1",
        "assert all(heap[(index - 1) // 2] <= heap[index] for index in range(1, len(heap)))"
      ),
      "Top-k functions return their selected results in sorted order. An internal heap used while selecting is an implementation detail and should not be exposed as a completed sorted result."
    ),
    followups: [
      "Why is sorting the entire input wasteful when only one minimum is required?",
      "What ordering guarantee does a min-heap provide at index zero?",
      "When does Python's documentation recommend a full sort instead of `nsmallest`?",
    ],
  },
  {
    topic: "linear-search",
    slug: "python-linear-search-algorithm",
    question: "How does linear search work, and when is it the right choice?",
    title: "Linear Search Algorithm and Use Cases",
    direct: "Linear search checks candidates one by one until it finds a match or reaches the end. It needs no sorted input, takes O(1) best-case and O(n) worst-case time, uses O(1) auxiliary space in an iterative form, and is often the clearest choice for small, unsorted, or one-time searches.",
    quick: [
      "Start at the first candidate and compare each value with the target.",
      "Return immediately when the required match is found if the contract asks for the first match.",
      "Best case is O(1); missing or last-position targets require O(n) comparisons.",
      "No sorting or index construction is required.",
      "Linear search fits small data, one-time scans, unsorted input, and arbitrary predicates.",
    ],
    intent: {
      testing: "Whether a simple scan is analysed honestly and chosen from workload and preconditions rather than dismissed automatically.",
      common_mistake: "Calling linear search always O(n) without noting its best case, or sorting first for a single lookup and ignoring that cost.",
      to_stand_out: "Include preprocessing cost when comparing it with binary search or hash lookup.",
    },
    speaking: prose(
      "Linear search examines candidates in sequence. It compares the first item with the target, then the next, and stops when it finds the requested match or proves that no candidates remain. It does not require sorted data or a separate lookup structure.",
      "The best case is O(1) when the first item matches. The worst case is O(n) when the target is last or absent, and average work is proportional to the number of candidates under ordinary position assumptions. An iterative implementation needs only an index and current reference, so auxiliary space is O(1).",
      "For example, searching `['draft', 'review', 'done']` for `'review'` checks two values and can return index one immediately. Searching for `'archived'` checks all three and returns a clear missing result. The function can also accept a predicate, such as finding the first user whose email is unverified, which binary search cannot do unless the data is ordered by a compatible monotonic key.",
      "Linear search can be the right engineering choice. For one lookup in ten unsorted records, sorting first costs O(n log n) and changes or copies order; building a set costs O(n) time and space. Those preprocessing choices pay off only when many later queries reuse them. I use a scan for small or one-off input, retained order, and flexible conditions. I choose binary search for repeated range queries over sorted data and a dictionary or set for repeated exact keyed lookup."
    ),
    deepTitle: "The searched prefix grows until it contains the answer or the whole input",
    deep: prose(
      "After checking positions before `index`, the invariant is that none of those positions contains the target. A match can return immediately because the contract requests the first occurrence; reaching the end proves absence.",
      mermaid(
        "flowchart LR",
        "  C[read next candidate] --> Q{candidate equals target?}",
        "  Q -- yes --> R[return current index]",
        "  Q -- no and items remain --> C",
        "  Q -- no and end reached --> N[return not found]"
      ),
      python(
        "def linear_search(values, target):",
        "    for index, value in enumerate(values):",
        "        if value == target:",
        "            return index",
        "    return None",
        "",
        "statuses = [\"draft\", \"review\", \"done\"]",
        "assert linear_search(statuses, \"review\") == 1",
        "assert linear_search(statuses, \"draft\") == 0",
        "assert linear_search(statuses, \"archived\") is None",
        "assert linear_search([], \"anything\") is None"
      ),
      "Returning `None` avoids confusing absence with index zero or with Python's valid negative index `-1`. A public API may choose another explicit result type, but its missing contract should be unambiguous."
    ),
    followups: [
      "Why can sorting before one search cost more than simply scanning?",
      "What result should distinguish a match at index zero from no match?",
      "When does building a dictionary improve the total workload?",
    ],
  },
  {
    topic: "linear-search",
    slug: "python-linear-search-first-last-all-matches",
    question: "How do you find the first, last, or all matching positions with linear search?",
    title: "First, Last, and All Matches with Linear Search",
    direct: "A first-match search returns as soon as it finds the target; a last-match search scans the entire input while replacing the remembered index; and an all-match search appends every matching index. All have O(n) worst-case time, but their early-exit and output-space behavior follows the requested result contract.",
    quick: [
      "Return immediately for the first match because later positions cannot improve that answer.",
      "For the last match, scan to the end and update one saved index whenever a match appears.",
      "For all matches, collect every matching index in encounter order.",
      "All variants are O(n) in the worst case; first-match can finish earlier.",
      "All-match output may require O(n) space, while first and last need O(1) auxiliary state.",
    ],
    intent: {
      testing: "Whether algorithm control flow and space are derived from the exact requested output around duplicates.",
      common_mistake: "Returning on the first match when the caller requested the last or every occurrence.",
      to_stand_out: "State output-space separately and use one scan instead of reversing or rescanning unnecessarily.",
    },
    speaking: prose(
      "Linear search is not one fixed return shape. Its control flow should match whether the caller needs the first occurrence, the last occurrence, or every occurrence. Duplicate values make that contract important even though each solution still scans in order.",
      "For the first match, compare from the beginning and return the index immediately. That gives O(1) best-case time and O(n) worst-case time. For the last match, keep a variable such as `last = None`; update it on every match and finish the scan, because a later match can always replace the current answer. This uses O(1) auxiliary state.",
      "For all matches, append every matching index to a result list. For example, searching `[4, 2, 4, 4]` for 4 gives first index 0, last index 3, and all indexes `[0, 2, 3]`. The all-match algorithm has O(n) worst-case time and O(k) output space for `k` matches, which becomes O(n) when every element matches.",
      "Scanning backward with `range(len(values) - 1, -1, -1)` is another valid way to find the last occurrence and may return early. However, a forward scan with a saved index works for any iterable if it uses `enumerate`, not only indexable sequences. The right implementation follows the input and result contracts. I name the function and missing value clearly so that a caller never mistakes first-match behavior for complete duplicate handling."
    ),
    deepTitle: "The requested answer decides whether a match is final",
    deep: prose(
      mermaid(
        "flowchart TD",
        "  M[encounter a matching position] --> Q{Which result is required?}",
        "  Q -- first --> R[return immediately]",
        "  Q -- last --> U[replace saved last index and continue]",
        "  Q -- all --> A[append index and continue]",
        "  U --> E[finish input before returning]",
        "  A --> E"
      ),
      python(
        "def match_positions(values, target):",
        "    first = None",
        "    last = None",
        "    all_indexes = []",
        "    for index, value in enumerate(values):",
        "        if value == target:",
        "            if first is None:",
        "                first = index",
        "            last = index",
        "            all_indexes.append(index)",
        "    return first, last, all_indexes",
        "",
        "assert match_positions([4, 2, 4, 4], 4) == (0, 3, [0, 2, 3])",
        "assert match_positions([1, 2], 9) == (None, None, [])"
      ),
      "This combined teaching function calculates all three answers in one pass. A production API should return only what its callers need so it does not allocate an unused list of matches."
    ),
    followups: [
      "Why can first-match search stop but last-match search usually cannot?",
      "What is the output-space complexity when every item matches?",
      "How can a backward scan find the last match early, and what input ability does it require?",
    ],
  },
  {
    topic: "linear-search",
    slug: "python-linear-search-record-predicate",
    question: "How do you search records by a condition and represent 'not found' safely in Python?",
    title: "Predicate-Based Record Search and Safe Missing Results",
    direct: "Scan records with `enumerate` and apply a predicate to each record, returning the matching record, index, or both only when the condition succeeds. Use an explicit missing result such as `None` or a deliberate exception; avoid truth tests that confuse valid falsey records and avoid `-1` when it could be used as a real Python index.",
    quick: [
      "A predicate search tests a condition such as active status, range, or multiple fields.",
      "Use `enumerate` when both record and position belong in the result.",
      "Return `None` for ordinary absence or raise a named exception when absence violates a requirement.",
      "Check `result is None`, because valid records or indexes can be falsey.",
      "`next((...), None)` is concise for simple first-match searches; a loop is clearer for richer logic.",
    ],
    intent: {
      testing: "Whether search can model arbitrary conditions and absence without relying on ambiguous sentinel behavior.",
      common_mistake: "Using `if result` so a valid result such as index zero or an empty record is mistaken for absence.",
      to_stand_out: "Choose a result shape and missing policy that make the caller's next decision explicit.",
    },
    speaking: prose(
      "A predicate-based linear search looks for the first record that satisfies a condition rather than equals one target value. The predicate may combine fields, such as an account being active and having a balance over a threshold. Because arbitrary predicates do not normally create sorted or hashable lookup keys, checking records in order is often the correct algorithm.",
      "An explicit loop with `enumerate` can return both the position and record. For each pair, evaluate the predicate; on success, return `(index, record)`. If the scan ends, return `None` when absence is an expected outcome. If the function's contract requires a match, raising a specific exception can be clearer than letting `None` travel into unrelated code.",
      "For example, searching users for the first active administrator may return index zero. A caller must check `result is None`, not `if result`, because zero, an empty mapping, or another falsey value can still be a valid result depending on the chosen shape. Returning `-1` is familiar from some APIs, but Python treats `-1` as the last sequence index, so accidental indexing can hide the missing case.",
      "A generator expression with `next((record for record in records if predicate(record)), None)` is concise for one simple first-record result. A normal loop is easier when the result includes an index, predicate evaluation needs error handling, or evidence must be collected. I decide whether absence is normal, define one unambiguous representation, and keep the scan in input order when 'first' has business meaning."
    ),
    deepTitle: "Search result design is part of algorithm correctness",
    deep: prose(
      mermaid(
        "flowchart LR",
        "  R[read record and index] --> P{predicate true?}",
        "  P -- yes --> M[return explicit match object]",
        "  P -- no and records remain --> R",
        "  P -- no and end reached --> Q{Is absence expected?}",
        "  Q -- yes --> N[return None]",
        "  Q -- no --> E[raise a specific exception]"
      ),
      python(
        "def find_first(records, predicate):",
        "    for index, record in enumerate(records):",
        "        if predicate(record):",
        "            return index, record",
        "    return None",
        "",
        "users = [",
        "    {\"name\": \"Mina\", \"active\": True, \"role\": \"admin\"},",
        "    {\"name\": \"Omar\", \"active\": False, \"role\": \"admin\"},",
        "]",
        "result = find_first(users, lambda user: user[\"active\"] and user[\"role\"] == \"admin\")",
        "assert result == (0, users[0])",
        "assert result is not None",
        "assert find_first(users, lambda user: user[\"name\"] == \"Asha\") is None"
      ),
      "If `None` can itself be a legitimate stored record, return a small tagged result or use a private sentinel object so found and missing states remain distinguishable."
    ),
    followups: [
      "Why can `if result` mishandle a valid search result?",
      "When should absence return `None`, and when should it raise?",
      "What does a generator expression lose compared with an explicit indexed loop?",
    ],
  },
  {
    topic: "binary-search",
    slug: "python-iterative-binary-search",
    question: "How does iterative binary search find a target in a sorted list?",
    title: "Iterative Binary Search in Python",
    direct: "Binary search keeps a sorted candidate interval, compares its middle value with the target, and discards the half that cannot contain the target. The interval halves on every step, giving O(log n) time and O(1) auxiliary space for an iterative implementation, but correctness requires ordering compatible with the comparison.",
    quick: [
      "Binary search requires data sorted by the same key and direction used in the comparisons.",
      "Keep `low` and `high` as the inclusive candidate interval.",
      "If the middle is too small, set `low = middle + 1`; if too large, set `high = middle - 1`.",
      "Each step removes about half the remaining candidates: O(log n) time.",
      "The basic exact-match version may return any equal occurrence when duplicates exist.",
    ],
    intent: {
      testing: "Whether sortedness, the candidate invariant, safe boundary updates, termination, and duplicate behavior are understood.",
      common_mistake: "Updating a boundary to `middle` instead of moving past it, which can leave the interval unchanged and loop forever.",
      to_stand_out: "State the invariant and distinguish exact search from first or last duplicate-boundary search.",
    },
    speaking: prose(
      "Binary search finds a value in data sorted by a comparison key. It keeps a candidate interval from `low` through `high`, chooses the middle index, and compares the middle value with the target. If they match, it returns. If the middle is smaller, sorted order proves that the middle and everything to its left can be discarded. If it is larger, the right half can be discarded.",
      "The important invariant is that, if the target exists, it remains inside the current candidate interval. The updates use `middle + 1` and `middle - 1` because the middle was already checked. With inclusive bounds, the loop continues while `low <= high`; when `low > high`, the interval is empty and the target is absent.",
      "For example, searching `[2, 5, 8, 12, 16, 23]` for 16 first checks 8, discards indexes through 2, then checks 16 and succeeds. Searching for 10 eventually produces an empty interval. Every step roughly halves the candidates, so time is O(log n), and the iterative form uses O(1) auxiliary space.",
      "The precondition is stronger than 'looks sorted': the list must be ordered by the same key and direction used by the search. Mutating that key without reordering invalidates the result. With duplicates, basic binary search promises only some matching index, not necessarily the first. For first, last, or insertion positions, I use a boundary variant such as `bisect_left` or `bisect_right`."
    ),
    deepTitle: "Every comparison proves that one whole half is impossible",
    deep: prose(
      mermaid(
        "flowchart TD",
        "  I[sorted candidate interval] --> M[compare target with middle value]",
        "  M --> Q{comparison result}",
        "  Q -- equal --> R[return middle index]",
        "  Q -- target larger --> L[discard middle and left half]",
        "  Q -- target smaller --> H[discard middle and right half]",
        "  L --> I",
        "  H --> I"
      ),
      python(
        "def binary_search(values, target):",
        "    low, high = 0, len(values) - 1",
        "    while low <= high:",
        "        middle = low + (high - low) // 2",
        "        if values[middle] == target:",
        "            return middle",
        "        if values[middle] < target:",
        "            low = middle + 1",
        "        else:",
        "            high = middle - 1",
        "    return None",
        "",
        "numbers = [2, 5, 8, 12, 16, 23]",
        "assert binary_search(numbers, 16) == 4",
        "assert binary_search(numbers, 10) is None",
        "assert binary_search([], 10) is None"
      ),
      "Computing the middle as `low + (high - low) // 2` avoids overflow in fixed-width integer languages. Python integers do not overflow this way, but the form still makes the middle belong clearly to the current interval."
    ),
    followups: [
      "Why must each boundary update move past the middle index?",
      "What happens if the list is sorted descending but the comparisons assume ascending order?",
      "Why does exact binary search not necessarily return the first duplicate?",
    ],
  },
  {
    topic: "binary-search",
    slug: "python-bisect-left-right-duplicate-boundaries",
    question: "How do `bisect_left` and `bisect_right` find duplicate boundaries and insertion positions?",
    title: "bisect_left, bisect_right, and Duplicate Boundaries",
    direct: "On a sorted sequence, `bisect_left` returns the first insertion position before equal values and `bisect_right` returns the position after all equal values. Their difference counts occurrences, and either search is O(log n), but inserting into a Python list remains O(n) because later references must shift.",
    quick: [
      "`bisect_left(values, x)` partitions values into `< x` on the left and `>= x` on the right.",
      "`bisect_right(values, x)` partitions into `<= x` on the left and `> x` on the right.",
      "The slice `values[left:right]` contains every occurrence of `x`.",
      "Boundary search is O(log n); `insort` is O(n) overall because list insertion shifts references.",
      "With `key=`, `bisect` applies the key to sequence elements but not to the search value `x`.",
    ],
    intent: {
      testing: "Whether lower and upper bounds, half-open ranges, duplicates, insertion cost, and Python's key boundary are precise.",
      common_mistake: "Treating an insertion point as proof of a match or claiming `insort` is O(log n).",
      to_stand_out: "Verify `left < len(values)` and equality before exact access, and explain `right - left` as a count.",
    },
    speaking: prose(
      "The `bisect` module searches insertion boundaries in an already sorted sequence. `bisect_left(values, x)` returns the first position where `x` could be inserted before existing equal values. Everything before that position is less than `x`, and everything from that position onward is greater than or equal to `x`.",
      "`bisect_right(values, x)` returns the position after existing equal values. Everything before it is less than or equal to `x`, and everything from it onward is greater than `x`. For example, in `[1, 2, 2, 2, 5]`, the left boundary of 2 is 1 and the right boundary is 4. The half-open slice `[1:4]` contains all three occurrences, so `right - left` gives the count.",
      "An insertion point does not prove the value exists. Searching for 3 returns position 4 even though index 4 contains 5. Exact lookup must check that the left boundary is within the list and that `values[left] == x`. Each boundary search is O(log n).",
      "`insort_left` and `insort_right` first find a boundary, then insert into a Python list. The search is logarithmic, but shifting later references makes the full insertion O(n). There is also a subtle `key` rule: `bisect_left` and `bisect_right` apply `key` to sequence elements, not to the search value `x`, so `x` should already be the comparison key. I use these functions for range boundaries and maintained small sorted lists, not as a replacement for a dictionary's repeated exact-key lookup."
    ),
    deepTitle: "Two boundaries turn duplicates into one half-open range",
    deep: prose(
      mermaid(
        "flowchart LR",
        "  L[bisect_left for 2 returns 1] --> R[bisect_right for 2 returns 4]",
        "  L --> S[values before 1 are less than 2]",
        "  R --> G[values from 4 are greater than 2]",
        "  S --> E[range 1 through 4 contains all equal values]",
        "  G --> E"
      ),
      python(
        "from bisect import bisect_left, bisect_right, insort",
        "",
        "values = [1, 2, 2, 2, 5]",
        "left = bisect_left(values, 2)",
        "right = bisect_right(values, 2)",
        "assert (left, right) == (1, 4)",
        "assert values[left:right] == [2, 2, 2]",
        "assert right - left == 3",
        "",
        "missing = bisect_left(values, 3)",
        "assert missing == 4 and values[missing] != 3",
        "insort(values, 3)",
        "assert values == [1, 2, 2, 2, 3, 5]"
      ),
      "The returned indexes describe partitions even for an empty list or missing value. That makes boundary search reusable for ranges such as all timestamps from a start value up to an end value."
    ),
    followups: [
      "How do you verify that a `bisect_left` insertion point is an exact match?",
      "Why is `insort` O(n) even though its search step is O(log n)?",
      "What must the search value represent when `bisect_left` receives a `key` function?",
    ],
  },
  {
    topic: "binary-search",
    slug: "python-binary-search-first-true",
    question: "How do you use binary search to find the first value that satisfies a monotonic condition?",
    title: "Binary Search for the First True Boundary",
    direct: "If a predicate changes only once from false to true across an ordered range, binary search can retain a boundary interval and find the first true value. When the middle is true, keep it and search left; when false, discard it and search right, producing O(log range) predicate evaluations.",
    quick: [
      "The predicate must be monotonic over the search range: false values followed by true values.",
      "Keep a range known to contain at least one true boundary candidate.",
      "When the middle is true, keep `middle` by moving the high boundary to it.",
      "When the middle is false, move low to `middle + 1`.",
      "When low equals high, that value is the first true position under the stated preconditions.",
    ],
    intent: {
      testing: "Whether binary search is understood as boundary finding over monotonic state, not only exact array lookup.",
      common_mistake: "Applying the pattern to a predicate that can switch back and forth, or discarding a true middle that might be the first true value.",
      to_stand_out: "State how the initial bounds prove a solution exists and define what happens when no value is true.",
    },
    speaking: prose(
      "Binary search can find a boundary even when there is no stored target value. The requirement is a monotonic predicate: across the ordered search space, results have the form false, false, then true, true, with at most one transition. The goal is to find the first true position.",
      "Keep `low` and `high` such that the answer lies in that inclusive interval and the predicate is known to be true at `high`. Choose the middle. If the predicate is true there, the middle could be the first true value, so retain it by setting `high = middle`. If it is false, the boundary must be to the right, so set `low = middle + 1`. When the bounds meet, they identify the boundary.",
      "For example, among non-negative integers, the condition `value * value >= 30` is false through 5 and true from 6 onward. Starting with bounds 0 and 30, the algorithm halves the numerical range until it returns 6. It performs O(log R) predicate checks for a range width `R`, without constructing every number.",
      "The monotonic condition and initial bounds are real preconditions. If the predicate becomes true and then false again, discarding half the range is not justified. If no true value is guaranteed, the API must first test or expand a high bound and define a no-solution result. This pattern appears in minimum feasible capacity, earliest acceptable time, and threshold problems; the implementation should always explain what false and true mean in that domain."
    ),
    deepTitle: "Keep a true middle because it may be the boundary itself",
    deep: prose(
      mermaid(
        "flowchart TD",
        "  I[interval contains first true value] --> M[evaluate predicate at middle]",
        "  M --> Q{middle is true?}",
        "  Q -- yes --> H[keep middle; high becomes middle]",
        "  Q -- no --> L[discard middle; low becomes middle plus one]",
        "  H --> E{low equals high?}",
        "  L --> E",
        "  E -- no --> I",
        "  E -- yes --> R[return first true value]"
      ),
      python(
        "def first_true(low, high, predicate):",
        "    if low > high or not predicate(high):",
        "        return None",
        "    while low < high:",
        "        middle = low + (high - low) // 2",
        "        if predicate(middle):",
        "            high = middle",
        "        else:",
        "            low = middle + 1",
        "    return low",
        "",
        "answer = first_true(0, 30, lambda value: value * value >= 30)",
        "assert answer == 6",
        "assert first_true(0, 4, lambda value: value >= 5) is None"
      ),
      "This version validates only that `high` is true; it trusts the caller's monotonicity claim. General-purpose code cannot cheaply prove monotonicity without inspecting the full range, which would remove the benefit."
    ),
    followups: [
      "Why does a true middle move `high` to `middle` rather than `middle - 1`?",
      "How should the function behave when no value satisfies the predicate?",
      "What breaks if the predicate changes from false to true and back to false?",
    ],
  },
  {
    topic: "two-pointers-basics",
    slug: "python-two-pointers-pair-sum-sorted",
    question: "How do two pointers find a target-sum pair in a sorted list?",
    title: "Two Pointers for Pair Sum in a Sorted List",
    direct: "Place one pointer at each end of an ascending list. If their sum is too small, move the left pointer right; if too large, move the right pointer left; if equal, return the pair. Sorted order proves each discarded endpoint cannot participate in a solution inside the remaining interval, giving O(n) time and O(1) space.",
    quick: [
      "The input must be sorted ascending for the movement proof to hold.",
      "Start `left` at zero and `right` at the final index.",
      "Move left rightward when the sum is too small; move right leftward when it is too large.",
      "Each pointer moves at most `n` positions: O(n) time and O(1) auxiliary space.",
      "Return distinct indexes and define whether one pair, all pairs, or only existence is required.",
    ],
    intent: {
      testing: "Whether sorted order is used to justify pointer movement and the output/duplicate contract is explicit.",
      common_mistake: "Using the movement rule on unsorted data or allowing one index to pair with itself.",
      to_stand_out: "Explain why moving the selected endpoint removes only impossible pairs.",
    },
    speaking: prose(
      "The opposite-end two-pointer pattern solves pair sum when values are sorted ascending. Put `left` at the smallest value and `right` at the largest. Compare their sum with the target. If it matches, return the indexes or values required by the contract.",
      "If the sum is too small, pairing the current left value with any value inside the interval cannot make a larger sum than pairing it with the current right value. Therefore the left value cannot be part of a target pair and `left` can move right. If the sum is too large, pairing the current right value with any remaining value cannot make a smaller sum than using the current left value, so move `right` left.",
      "For example, with `[1, 2, 4, 7, 11]` and target 9, the first sum is 12, so right moves from 11 to 7. The next sum is 8, so left moves from 1 to 2. The sum 2 + 7 is 9, returning indexes `(1, 3)`. Each step moves one pointer inward, so time is O(n) and auxiliary space is O(1).",
      "The proof fails for unsorted input because moving a pointer no longer predicts how the sum changes. Sorting first costs O(n log n) and can lose original indexes unless records carry them. A one-pass hash-map solution handles unsorted input in average O(n) time with O(n) space. I choose two pointers when sorted order already exists or ordering is allowed and constant auxiliary space matters."
    ),
    deepTitle: "Sorted order makes one endpoint provably useless after each miss",
    deep: prose(
      mermaid(
        "flowchart TD",
        "  S[sum values at left and right] --> Q{compare sum with target}",
        "  Q -- equal --> R[return the two distinct indexes]",
        "  Q -- too small --> L[discard current left endpoint]",
        "  Q -- too large --> H[discard current right endpoint]",
        "  L --> S",
        "  H --> S"
      ),
      python(
        "def pair_sum_sorted(values, target):",
        "    left, right = 0, len(values) - 1",
        "    while left < right:",
        "        total = values[left] + values[right]",
        "        if total == target:",
        "            return left, right",
        "        if total < target:",
        "            left += 1",
        "        else:",
        "            right -= 1",
        "    return None",
        "",
        "numbers = [1, 2, 4, 7, 11]",
        "assert pair_sum_sorted(numbers, 9) == (1, 3)",
        "assert pair_sum_sorted(numbers, 100) is None",
        "assert pair_sum_sorted([3, 3], 6) == (0, 1)"
      ),
      "When all unique value pairs are required, duplicate runs need deliberate skipping after a match. Returning the first pair avoids that additional contract."
    ),
    followups: [
      "Why is it safe to discard the left value when the current sum is too small?",
      "How can you retain original indexes if sorting is required first?",
      "What changes when the problem asks for every unique pair rather than one pair?",
    ],
  },
  {
    topic: "two-pointers-basics",
    slug: "python-two-pointers-remove-sorted-duplicates",
    question: "How do slow and fast pointers remove duplicates from a sorted list in place?",
    title: "Slow and Fast Pointers for Sorted Deduplication",
    direct: "A fast pointer scans every value while a slow write boundary marks the end of the unique prefix. Because duplicates are adjacent in sorted input, write a value only when it differs from the last unique value, then truncate the unused suffix. The scan is O(n) time and uses O(1) auxiliary space.",
    quick: [
      "Sorted order places equal values next to one another.",
      "Keep a unique prefix and compare each scanned value with its final value.",
      "Advance the write pointer only when a new value is found.",
      "Return the new logical length or delete the leftover suffix deliberately.",
      "The method is O(n) time and O(1) auxiliary space but mutates the list.",
    ],
    intent: {
      testing: "Whether read and write positions, the unique-prefix invariant, sortedness, and mutation contract are understood.",
      common_mistake: "Incrementing the write position for duplicates or leaving stale suffix values without explaining the logical length.",
      to_stand_out: "State that output order is preserved and handle an empty input before reading the first element.",
    },
    speaking: prose(
      "The slow-and-fast pointer pattern can compact a sorted list without allocating another list of unique values. The fast pointer reads every input position. The slow pointer represents the last position of the unique prefix already written. Sorted order is essential because all duplicates of one value are adjacent.",
      "For a non-empty list, start `slow` at zero and scan `fast` from one. If `values[fast]` equals `values[slow]`, the scanned value is a duplicate and fast simply continues. If it differs, increment slow and copy the new value into `values[slow]`. After the scan, positions zero through slow contain every distinct value in original order.",
      "For example, `[1, 1, 2, 2, 3]` begins with unique prefix `[1]`. The second 1 is skipped. Reading 2 advances slow to one and writes 2 there; the next 2 is skipped; reading 3 writes at position two. The logical unique length is three, and deleting `values[3:]` produces `[1, 2, 3]`.",
      "The algorithm is O(n) time because fast visits each item once, and O(1) auxiliary space because it reuses the input storage. It mutates the list, so callers sharing that object observe the compacted content. Without sorted input, equal values are not necessarily adjacent and this comparison finds only consecutive duplicates; a set-based pass would need extra memory. I use this pattern when stable in-place compaction is part of the contract and handle the empty list before initializing the first unique position."
    ),
    deepTitle: "The write pointer marks a prefix that is already final",
    deep: prose(
      mermaid(
        "flowchart LR",
        "  F[fast reads next sorted value] --> Q{same as last unique value?}",
        "  Q -- yes --> K[skip duplicate; move fast]",
        "  Q -- no --> W[advance slow and write new value]",
        "  K --> F",
        "  W --> F",
        "  W --> P[prefix through slow is unique and final]"
      ),
      python(
        "def deduplicate_sorted(values):",
        "    if not values:",
        "        return 0",
        "    slow = 0",
        "    for fast in range(1, len(values)):",
        "        if values[fast] != values[slow]:",
        "            slow += 1",
        "            values[slow] = values[fast]",
        "    unique_length = slow + 1",
        "    del values[unique_length:]",
        "    return unique_length",
        "",
        "numbers = [1, 1, 2, 2, 3]",
        "assert deduplicate_sorted(numbers) == 3",
        "assert numbers == [1, 2, 3]",
        "empty = []",
        "assert deduplicate_sorted(empty) == 0 and empty == []"
      ),
      "Some interview APIs ask only for the new length and permit stale values after that boundary. This version truncates the list because Python's dynamic list makes the final logical content easy to expose; name the chosen contract either way."
    ),
    followups: [
      "Why does comparing only with the last unique value work on sorted input?",
      "What remains in the list if the API returns only a logical length without truncating?",
      "How would the solution change for unsorted input?",
    ],
  },
  {
    topic: "two-pointers-basics",
    slug: "python-fixed-sliding-window-maximum-sum",
    question: "How does a fixed-size sliding window find the maximum sum of `k` consecutive values?",
    title: "Fixed-Size Sliding Window for Maximum Sum",
    direct: "Compute the first `k`-value sum once, then move both window boundaries one step at a time by adding the entering value and subtracting the leaving value. Every element enters and leaves at most once, reducing repeated O(k) subarray sums to O(n) time with O(1) auxiliary space.",
    quick: [
      "A fixed window represents one contiguous range of exactly `k` values.",
      "Calculate the first window sum before sliding.",
      "On each slide, add the new right value and subtract the old left value.",
      "Track the best sum and its starting position if the subarray is required.",
      "Validate `1 <= k <= len(values)`; time is O(n) and auxiliary space is O(1).",
    ],
    intent: {
      testing: "Whether overlapping subarray work is reused through a clear window invariant and invalid sizes are handled.",
      common_mistake: "Recomputing every window with `sum(values[start:start+k])`, which performs O(k) work and allocates slices repeatedly.",
      to_stand_out: "State that the running sum equals exactly the current half-open window after every update.",
    },
    speaking: prose(
      "A fixed-size sliding window is a same-direction two-boundary pattern for contiguous data. Instead of calculating every length-`k` subarray from scratch, it keeps the sum of the current window and updates only the values that change when the window moves one position.",
      "First validate that `k` is positive and no larger than the input. Compute the sum of positions zero through `k - 1` and store it as both the current and best sum. For each next right boundary, add the entering value and subtract the value that is now `k` positions behind. The invariant is that the running sum equals exactly the current window's `k` elements.",
      "For example, for `[2, 1, 5, 1, 3, 2]` and `k = 3`, the first sum is 8. Sliding once removes 2 and adds 1, producing 7. Sliding again removes 1 and adds 3, producing 9, which is the maximum for window `[5, 1, 3]`. Another slide produces 6.",
      "There are `n - k + 1` windows, and each slide does constant work, so time is O(n) and auxiliary space is O(1). Repeated slicing and `sum` can take O(nk) time and allocate temporary lists. This technique requires contiguous windows and a fixed size. When the window length changes according to a condition, a variable-window pattern needs a different invariant for when the left boundary should advance."
    ),
    deepTitle: "Adjacent windows share all but one leaving and one entering value",
    deep: prose(
      mermaid(
        "flowchart LR",
        "  W[current sum covers k consecutive values] --> A[add value entering on right]",
        "  A --> S[subtract value leaving on left]",
        "  S --> B[compare updated sum with best]",
        "  B --> W"
      ),
      python(
        "def maximum_window(values, size):",
        "    if size < 1 or size > len(values):",
        "        raise ValueError(\"window size must fit the input\")",
        "    current = sum(values[:size])",
        "    best_sum = current",
        "    best_start = 0",
        "    for right in range(size, len(values)):",
        "        current += values[right] - values[right - size]",
        "        start = right - size + 1",
        "        if current > best_sum:",
        "            best_sum, best_start = current, start",
        "    return best_sum, values[best_start:best_start + size]",
        "",
        "assert maximum_window([2, 1, 5, 1, 3, 2], 3) == (9, [5, 1, 3])",
        "assert maximum_window([-5, -2], 1) == (-2, [-2])"
      ),
      "The returned slice costs O(k) output space. If only the maximum sum is required, returning `best_sum` alone keeps auxiliary and output space constant."
    ),
    followups: [
      "Why does subtracting `values[right - k]` remove exactly the leaving value?",
      "How does returning the winning subarray change output space?",
      "What extra rule does a variable-size window need?",
    ],
  },
  {
    topic: "string-manipulation-patterns",
    slug: "python-normalized-palindrome-check",
    question: "How do you check whether a string is a palindrome while ignoring case and punctuation?",
    title: "Normalized Palindrome Checking in Python",
    direct: "First define and apply a normalization policy, such as keeping alphanumeric characters and applying `casefold()`, then compare the normalized text with its reverse or scan it from both ends. This takes O(n) time; building the normalized text and reverse uses O(n) additional space.",
    quick: [
      "Define what should be ignored before coding; punctuation, whitespace, accents, and case are separate policies.",
      "`str.isalnum()` can retain letters and digits while dropping punctuation and spaces.",
      "`casefold()` is intended for caseless matching and is generally stronger than `lower()`.",
      "Compare `normalized` with `normalized[::-1]` for a clear Python solution.",
      "Normalization and reversing are O(n) time and use O(n) additional string storage.",
    ],
    intent: {
      testing: "Whether ambiguous text rules are turned into an explicit normalization step with honest Unicode and space boundaries.",
      common_mistake: "Removing only ASCII spaces, using an unspecified case policy, or claiming slicing reverses a string in O(1) space.",
      to_stand_out: "Separate normalization correctness from palindrome comparison and state what Unicode equivalence the requirement needs.",
    },
    speaking: prose(
      "A palindrome reads the same forward and backward, but the phrase 'ignore case and punctuation' first needs a normalization contract. One common policy keeps only characters for which `isalnum()` is true and applies `casefold()` for caseless comparison. That policy handles spaces and punctuation consistently instead of listing individual characters to remove.",
      "After normalization, Python can compare the string with `normalized[::-1]`. Slicing creates a reversed string, so the comparison is simple and explicit. A two-pointer scan over the normalized text is also valid and can stop at the first mismatch, but the normalized string itself still uses O(n) space in this design.",
      "For example, `A man, a plan, a canal: Panama!` normalizes to `amanaplanacanalpanama`, which equals its reverse. `Python, not Jython` normalizes to different forward and backward sequences and returns false. The algorithm visits a number of characters proportional to the input, so time is O(n), and the normalized and reversed strings require O(n) additional storage.",
      "Text behavior has boundaries. `casefold` is designed for Unicode caseless matching, but visually equivalent Unicode text can still use different code-point sequences, which may require `unicodedata.normalize` under a product-specific rule. `isalnum` also keeps digits and letters from many scripts; that may or may not match an ASCII-only interview requirement. I state the policy, implement it as one transformation, then test empty text, punctuation-only text, and mixed-case examples."
    ),
    deepTitle: "Normalize domain noise before testing the mirror relationship",
    deep: prose(
      mermaid(
        "flowchart LR",
        "  T[raw text] --> F[keep characters allowed by the policy]",
        "  F --> C[apply casefold for caseless matching]",
        "  C --> R[reverse normalized text]",
        "  R --> Q{forward equals reverse?}",
        "  Q -- yes --> P[palindrome]",
        "  Q -- no --> N[not a palindrome]"
      ),
      python(
        "def is_normalized_palindrome(text):",
        "    normalized = \"\".join(character.casefold() for character in text if character.isalnum())",
        "    return normalized == normalized[::-1]",
        "",
        "assert is_normalized_palindrome(\"A man, a plan, a canal: Panama!\")",
        "assert is_normalized_palindrome(\"...\")  # empty normalized text mirrors itself",
        "assert not is_normalized_palindrome(\"Python, not Jython\")"
      ),
      "If punctuation-only input should be rejected rather than treated as an empty palindrome, validate `normalized` before comparing. That is a product rule, not an algorithmic certainty."
    ),
    followups: [
      "Why should normalization rules be defined before the palindrome algorithm?",
      "How does `casefold()` differ in purpose from a simple lowercase conversion?",
      "What result should punctuation-only input produce under your chosen contract?",
    ],
  },
  {
    topic: "string-manipulation-patterns",
    slug: "python-anagram-frequency-count",
    question: "How do you check whether two strings are anagrams with a frequency map?",
    title: "Anagram Checking with Character Frequencies",
    direct: "Normalize both strings under the same rule, count each resulting character, and compare the frequency mappings. Equal counts mean one string can be rearranged into the other. The method takes O(n + m) time and O(k) space for `k` distinct normalized characters.",
    quick: [
      "Anagrams require the same characters with exactly the same multiplicities.",
      "Apply the same case, whitespace, and punctuation policy to both inputs.",
      "A `Counter` or dictionary stores `character → occurrence count`.",
      "Equal sets are insufficient because sets discard repeated counts.",
      "Time is O(n + m); auxiliary space is O(k) for distinct characters.",
    ],
    intent: {
      testing: "Whether multiplicity, normalization, frequency maps, and complexity are connected to the actual anagram definition.",
      common_mistake: "Comparing character sets and incorrectly accepting inputs such as `aab` and `abb`.",
      to_stand_out: "Name the normalization policy and compare count-based and sorting-based solutions with their costs.",
    },
    speaking: prose(
      "Two strings are anagrams when they contain the same characters with the same number of occurrences, possibly in a different order. Before counting, I define whether case, spaces, and punctuation matter. Both inputs must pass through exactly the same normalization function so the comparison represents one rule.",
      "A frequency map records each normalized character and its count. Python's `collections.Counter` implements this directly, or a normal dictionary can increment counts. The strings are anagrams when the two count mappings are equal. Comparing only sets is wrong because a set retains membership but loses multiplicity: `aab` and `abb` have the same character set but different counts.",
      "For example, under a rule that keeps alphanumeric characters and ignores case, `Dormitory` and `Dirty room!!` both produce the same counts. `listen` and `silent` also match, while `aab` and `abb` do not. Reading both inputs is O(n + m); the maps use O(k) auxiliary space where `k` is the number of distinct normalized characters.",
      "Sorting the normalized characters is another valid solution with O(n log n + m log m) time and storage for normalized sequences. Counting usually expresses multiplicity more directly and can finish early if normalized lengths differ, though full normalization has already visited the input. Unicode equivalence and locale rules remain product decisions; `casefold` alone does not define every linguistic equivalence. I keep normalization separate, compare counts, and test repeats because repeated characters are where weak solutions fail."
    ),
    deepTitle: "Frequency equality preserves information that membership alone loses",
    deep: prose(
      mermaid(
        "flowchart TD",
        "  A[first raw string] --> NA[apply shared normalization policy]",
        "  B[second raw string] --> NB[apply shared normalization policy]",
        "  NA --> CA[count every normalized character]",
        "  NB --> CB[count every normalized character]",
        "  CA --> Q{frequency maps equal?}",
        "  CB --> Q",
        "  Q -- yes --> Y[anagrams]",
        "  Q -- no --> N[not anagrams]"
      ),
      python(
        "from collections import Counter",
        "",
        "def normalized_characters(text):",
        "    return \"\".join(character for character in text.casefold() if character.isalnum())",
        "",
        "def are_anagrams(left, right):",
        "    return Counter(normalized_characters(left)) == Counter(normalized_characters(right))",
        "",
        "assert are_anagrams(\"Dormitory\", \"Dirty room!!\")",
        "assert are_anagrams(\"listen\", \"silent\")",
        "assert not are_anagrams(\"aab\", \"abb\")"
      ),
      "A one-map variant can increment from the first string and decrement from the second, then require every count to be zero. Two counters are often clearer for a fresher answer, while the asymptotic space remains based on distinct characters."
    ),
    followups: [
      "Why does comparing sets fail for strings with repeated characters?",
      "How does the sorting-based anagram solution differ in complexity?",
      "Which normalization choices could change whether two phrases count as anagrams?",
    ],
  },
  {
    topic: "string-manipulation-patterns",
    slug: "python-efficient-string-building-join",
    question: "Why is `str.join()` preferred for building a string from many pieces?",
    title: "Efficient String Building with str.join()",
    direct: "Python strings are immutable, so repeated concatenation can create and copy a growing sequence again and again, producing quadratic total work in the general case. Collect pieces in a list and call `separator.join(pieces)` once, or use `io.StringIO` for stream-like writes, to build the final string in linear total content size.",
    quick: [
      "Strings are immutable; concatenation creates a new string value.",
      "Repeatedly growing one string can copy earlier content many times and become quadratic.",
      "Append pieces to a list, then call `separator.join(pieces)` once.",
      "Use `io.StringIO` when code naturally writes many fragments through a file-like interface.",
      "Use f-strings for a fixed small number of known fields, not as a replacement for a many-piece accumulator.",
    ],
    intent: {
      testing: "Whether string immutability is connected to construction cost and an idiomatic linear-building pattern.",
      common_mistake: "Writing `result += piece` inside a large loop and assuming every addition changes one string in place.",
      to_stand_out: "Choose list-plus-join, StringIO, or a direct format according to how pieces are produced.",
    },
    speaking: prose(
      "Python strings are immutable, so their character content cannot be extended in place. A concatenation such as `result + piece` produces a new string value containing both parts. Repeating that operation while `result` grows can copy the already-built prefix again on every iteration.",
      "In the general sequence model documented by Python, repeated concatenation can therefore take quadratic time in the total output length. The standard pattern is to collect each fragment in a list using amortized O(1) append, then call `separator.join(pieces)` once. Join knows all pieces and constructs the final content in a single coordinated operation, giving linear work in the total number of characters.",
      "For example, to produce a CSV row from validated fields, append each escaped field to `pieces` and return `','.join(pieces)`. The separator belongs to `join`, which makes the placement rule explicit and avoids removing an unwanted final comma. When fragments arrive through many write calls, `io.StringIO` offers a file-like buffer and returns the built string with `getvalue()`.",
      "This does not mean the `+` operator is forbidden. Concatenating two or three known pieces, or using an f-string for a fixed template, is clear and appropriate. The concern is an accumulator whose prefix grows over many loop iterations. Join also requires string pieces; non-string values should be converted deliberately. I choose direct formatting for fixed structure and list-plus-join or StringIO for a variable number of fragments."
    ),
    deepTitle: "Accumulate references first, copy character content once",
    deep: prose(
      mermaid(
        "flowchart TD",
        "  P[produce next text piece] --> L[append piece reference to list]",
        "  L --> Q{more pieces?}",
        "  Q -- yes --> P",
        "  Q -- no --> J[join all pieces with one separator rule]",
        "  J --> R[final immutable string]"
      ),
      python(
        "def render_tags(tags):",
        "    pieces = []",
        "    for tag in tags:",
        "        cleaned = tag.strip().casefold()",
        "        if cleaned:",
        "            pieces.append(f\"#{cleaned}\")",
        "    return \" \".join(pieces)",
        "",
        "assert render_tags([\" Python \", \"DSA\", \"  \"]) == \"#python #dsa\"",
        "assert render_tags([]) == \"\"",
        "",
        "from io import StringIO",
        "buffer = StringIO()",
        "buffer.write(\"hello\")",
        "buffer.write(\" world\")",
        "assert buffer.getvalue() == \"hello world\""
      ),
      "The list holds references to fragment strings, so it uses O(p) reference space for `p` pieces in addition to the final output. StringIO hides that buffering policy behind a writer interface rather than removing the need to store output."
    ),
    followups: [
      "Why can repeated concatenation copy the same prefix many times?",
      "When is an f-string clearer than collecting pieces for `join`?",
      "What interface does `StringIO` provide that a list does not?",
    ],
  },
];

function countWords(value) {
  return String(value)
    .replace(/```[\s\S]*?```/g, " ")
    .replace(/[`*_#>|~-]/g, " ")
    .split(/\s+/)
    .filter(Boolean).length;
}

function makeQuestion(definition, order) {
  return {
    id: `sorting-searching-python-${definition.topic}-q${String(order).padStart(3, "0")}`,
    slug: definition.slug,
    question: definition.question,
    title: definition.title,
    direct_answer: definition.direct,
    layout_type: definition.deep.includes("|---") ? "comparison" : "concept-explanation",
    difficulty: "medium",
    importance: "high",
    reading_time_minutes: 9,
    last_updated: today,
    interviewer_intent: definition.intent,
    company_tags: [],
    answer: {
      sections: [
        { type: "key_points", title: "Quick revision", items: definition.quick },
        { type: "speakable_answer", title: "Interview answer", answerSize: "standard", content: interviewProse(definition.speaking) },
        { type: "deep_explanation", title: definition.deepTitle, content: definition.deep },
      ],
    },
    followup_questions: definition.followups,
    seo: {
      metaTitle: `${definition.title} | Python Interview Guide`,
      metaDescription: definition.direct.replaceAll("`", "").slice(0, 158),
    },
    order,
  };
}

function replaceIndexedModule(rawIndex, moduleEntry) {
  const marker = `\"moduleSlug\": \"${moduleEntry.moduleSlug}\"`;
  const markerIndex = rawIndex.indexOf(marker);
  if (markerIndex < 0) throw new Error(`Cannot find ${moduleEntry.moduleSlug} in _index.json`);
  let start = markerIndex;
  while (start >= 0 && rawIndex[start] !== "{") start -= 1;
  if (start < 0) throw new Error("Cannot find indexed module start");
  let depth = 0;
  let inString = false;
  let escaped = false;
  let end = -1;
  for (let index = start; index < rawIndex.length; index += 1) {
    const character = rawIndex[index];
    if (inString) {
      if (escaped) escaped = false;
      else if (character === "\\") escaped = true;
      else if (character === '"') inString = false;
      continue;
    }
    if (character === '"') inString = true;
    else if (character === "{") depth += 1;
    else if (character === "}") {
      depth -= 1;
      if (depth === 0) {
        end = index + 1;
        break;
      }
    }
  }
  if (end < 0) throw new Error("Cannot find indexed module end");
  const replacement = JSON.stringify(moduleEntry, null, 2)
    .split("\n")
    .map((line) => `    ${line}`)
    .join("\n")
    .trimStart();
  return `${rawIndex.slice(0, start)}${replacement}${rawIndex.slice(end)}`;
}

function validateDefinitions() {
  const problems = [];
  if (definitions.length !== 21) problems.push(`Expected 21 questions; found ${definitions.length}`);
  for (const topic of topicOrder) {
    const count = definitions.filter((definition) => definition.topic === topic).length;
    if (count !== 3) problems.push(`${topic} must contain exactly 3 questions; found ${count}`);
  }
  const slugs = new Set();
  for (const definition of definitions) {
    if (slugs.has(definition.slug)) problems.push(`Duplicate slug: ${definition.slug}`);
    slugs.add(definition.slug);
    if (definition.direct.length < 80) problems.push(`Direct answer too short: ${definition.slug}`);
    if (definition.quick.length < 3 || definition.quick.length > 6) problems.push(`Quick revision count invalid: ${definition.slug}`);
    const speakingWords = countWords(definition.speaking);
    if (speakingWords < 220 || speakingWords > 420) problems.push(`Interview answer word count ${speakingWords}: ${definition.slug}`);
    if (!definition.deep.includes("```python")) problems.push(`Missing Python example: ${definition.slug}`);
    if (!definition.deep.includes("```mermaid") && !definition.deep.includes("|---")) problems.push(`Missing semantic visual: ${definition.slug}`);
    if (definition.followups.length < 3) problems.push(`Missing follow-ups: ${definition.slug}`);
  }
  if (problems.length > 0) throw new Error(problems.join("\n"));
}

function writeModule() {
  validateDefinitions();
  for (const topic of topicOrder) {
    const selected = definitions.filter((definition) => definition.topic === topic);
    const topicDir = path.join(moduleRoot, topic);
    fs.mkdirSync(topicDir, { recursive: true });
    const document = {
      topic: topicTitles[topic],
      topicSlug: topic,
      questions: selected.map((definition, index) => makeQuestion(definition, index + 1)),
    };
    fs.writeFileSync(path.join(topicDir, "complete-qa.json"), `${JSON.stringify(document, null, 2)}\n`);
  }

  const rawIndex = fs.readFileSync(indexPath, "utf8");
  const index = JSON.parse(rawIndex);
  const previous = index.modules.find((entry) => entry.moduleSlug === "sorting-searching-python");
  if (!previous) throw new Error("Missing canonical sorting-searching-python index entry");
  const intro = "Build the sorting and searching foundations expected in Python fresher interviews through 21 focused lessons. Trace bubble, selection, and insertion sort from their invariants; use Python's stable built-in sorting correctly; search with linear and binary boundaries; and apply opposite-end, same-direction, sliding-window, palindrome, anagram, and efficient string-building patterns. Every lesson includes precise revision points, a complete interview answer, and an independent visual Deep Dive with executable Python.";
  const moduleEntry = { ...previous, intro, questionCount: 21 };
  fs.writeFileSync(indexPath, replaceIndexedModule(rawIndex, moduleEntry));
  fs.writeFileSync(path.join(moduleRoot, "_config.json"), `${JSON.stringify({ ...moduleEntry, visible: true }, null, 2)}\n`);

  const revision = {
    title: "Sorting, Searching & Common Patterns — Revision",
    estimatedMinutes: 35,
    lastUpdated: today,
    status: "gold-standard",
    questionCount: 21,
    sections: [
      {
        id: "sort-invariants",
        title: "Explain what each sort fixes after one step",
        body: "Bubble sort grows a sorted suffix, selection sort grows a final prefix by choosing minima, and insertion sort maintains a sorted prefix by opening a gap. Use the invariant to justify bounds, stability, and termination.",
      },
      {
        id: "python-sorting",
        title: "Use Python's sorting contract precisely",
        body: "`list.sort()` mutates and returns `None`; `sorted()` accepts any iterable and returns a list. Both are stable, accept `key` and `reverse`, and Python evaluates the key once per input record during a sort.",
      },
      {
        id: "search-boundaries",
        title: "State the search space and boundary contract",
        body: "Linear search needs no order and scans candidates. Binary search requires a monotonic order or predicate and keeps a precisely defined candidate interval. `bisect_left` and `bisect_right` turn duplicate boundaries into a half-open result slice rather than merely reporting found or missing.",
      },
      {
        id: "pattern-choice",
        title: "Choose the smallest useful pattern",
        body: "Use opposite pointers for sorted pairs, read/write pointers for in-place compaction, a sliding window for contiguous ranges, frequency maps for counts, and buffered pieces plus `join` for repeated string construction.",
      },
    ],
    notes: "Canonical M07 curriculum: three distinct gold-standard questions for every declared topic; generated shell variants are intentionally excluded.",
  };
  fs.writeFileSync(path.join(moduleRoot, "_revision.json"), `${JSON.stringify(revision, null, 2)}\n`);
  console.log(`Wrote ${definitions.length} gold-standard questions across ${topicOrder.length} topics.`);
}

writeModule();
