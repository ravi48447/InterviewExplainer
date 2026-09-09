#!/usr/bin/env node

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const domainRoot = path.join(repoRoot, "content/python-backend-fresher");
const moduleRoot = path.join(domainRoot, "dsa-basics-python");
const indexPath = path.join(domainRoot, "_index.json");
const today = "2026-09-07";
const interviewProse = (value) => String(value)
  .split(/\n\s*\n/)
  .map((paragraph) => paragraph.replace(/^\s*[-*+]\s+/, ""))
  .join("\n\n");

const topicOrder = [
  "big-o-basics",
  "arrays-and-lists",
  "linked-list-concept",
  "stacks-and-queues",
  "basic-recursion",
  "hash-table-concept",
];

const topicTitles = {
  "big-o-basics": "Big-O Basics",
  "arrays-and-lists": "Arrays and Python Lists",
  "linked-list-concept": "Linked List Concepts",
  "stacks-and-queues": "Stacks and Queues",
  "basic-recursion": "Basic Recursion",
  "hash-table-concept": "Hash Table Concepts",
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
    topic: "big-o-basics",
    slug: "python-big-o-growth-rates",
    question: "What does Big-O notation describe, and how do common growth rates compare?",
    title: "Big-O Notation and Common Growth Rates",
    direct: "Big-O notation describes how an algorithm's time or memory requirement grows as the input size grows. O(1) stays bounded, O(log n) grows slowly, O(n) grows with the input, O(n log n) commonly appears in efficient comparison sorting, and O(n²) often comes from comparing many pairs.",
    quick: [
      "Big-O compares growth as input size `n` becomes large; it is not a stopwatch measurement.",
      "O(1) does bounded work, O(log n) repeatedly shrinks the remaining problem, and O(n) visits items proportionally to `n`.",
      "O(n log n) is common for efficient comparison sorts; O(n²) often comes from nested work over the same input.",
      "Drop constant factors and lower-order terms only after identifying what `n` represents.",
      "Complexity is one decision input; real runtime, memory, data size, and clarity still matter.",
    ],
    intent: {
      testing: "Whether growth-rate notation is understood as a model and can be connected to real code shapes.",
      common_mistake: "Treating Big-O as exact seconds or assuming every pair of nested loops is automatically O(n²).",
      to_stand_out: "Define the input variable first and explain why the amount of work changes when that variable doubles.",
    },
    speaking: prose(
      "Big-O notation describes the upper growth pattern of an algorithm's resource use as its input becomes large. The resource may be running time or memory, and `n` must be defined for the problem—for a list search, `n` is usually the number of elements. Big-O does not say that an operation takes a particular number of milliseconds.",
      "O(1) means the amount of work stays bounded as `n` grows, such as reading `values[0]`. O(log n) appears when every step removes a fixed fraction of the remaining search space, as binary search does on sorted data. O(n) usually means one proportional pass. O(n log n) is the typical scale of efficient comparison sorting, while O(n²) often appears when every item is compared with many other items.",
      "For example, searching 1,000 unsorted names may require up to 1,000 comparisons. The inclusive-index binary search shown below uses at most 11 comparisons over 1,024 sorted names, but only after the data is sorted and supports indexed access. Those preconditions are part of the algorithm, not a small detail.",
      "Big-O ignores constant multipliers and lower-order terms: `3n + 20` is O(n). That is useful for comparing scalability, but an O(n) solution can still beat an O(log n) solution for a tiny input because implementation costs differ. The conclusion is to use Big-O to predict growth, then check the actual constraints and workload before choosing an implementation."
    ),
    deepTitle: "Read complexity as a curve, not a speed label",
    deep: prose(
      "Complexity starts with one question: what quantity is allowed to grow? A graph algorithm may use `V` vertices and `E` edges rather than one vague `n`. After naming the input, count how often the main work can occur. Sequential loops add their costs; genuinely nested loops multiply them; a loop that halves its range contributes a logarithm.",
      "The table shows approximate operation counts, not elapsed time. It makes the separation between growth classes visible when `n` becomes large.",
      table(
        "| Growth | Typical code shape | Work near `n = 1,024` |",
        "|---|---|---:|",
        "| O(1) | direct access | 1 |",
        "| O(log n) | halve the search space | about 10–11 |",
        "| O(n) | one full pass | 1,024 |",
        "| O(n log n) | divide, then process levels | about 10,240 |",
        "| O(n²) | examine most ordered pairs | 1,048,576 |"
      ),
      mermaid(
        "flowchart LR",
        "  N[double input size] --> C1[O(1): bounded work]",
        "  N --> CL[O(log n): about one extra halving step]",
        "  N --> CN[O(n): about twice the work]",
        "  N --> C2[O(n²): about four times the work]"
      ),
      "The following executable example counts decisions rather than timing the machine. The linear search grows with the position of the target; binary search grows with the number of halvings. Binary search also demonstrates its boundary: the input must already be sorted.",
      python(
        "def linear_steps(values, target):",
        "    for step, value in enumerate(values, start=1):",
        "        if value == target:",
        "            return step",
        "    return len(values)",
        "",
        "def binary_steps(values, target):",
        "    low, high, steps = 0, len(values) - 1, 0",
        "    while low <= high:",
        "        steps += 1",
        "        middle = (low + high) // 2",
        "        if values[middle] == target:",
        "            return steps",
        "        if values[middle] < target:",
        "            low = middle + 1",
        "        else:",
        "            high = middle - 1",
        "    return steps",
        "",
        "numbers = list(range(1024))",
        "assert linear_steps(numbers, 1023) == 1024",
        "assert binary_steps(numbers, 1023) == 11"
      )
    ),
    followups: [
      "Why can an O(n) algorithm be faster than an O(log n) algorithm for a small input?",
      "What input precondition does binary search require?",
      "How would you describe an algorithm that processes every vertex and every edge of a graph?",
    ],
  },
  {
    topic: "big-o-basics",
    slug: "python-code-time-space-complexity",
    question: "How do you calculate time and auxiliary-space complexity from Python code?",
    title: "Calculating Time and Space Complexity from Python Code",
    direct: "Calculate complexity by defining the growing input, counting the dominant repeated operations, combining sequential work by addition and nested dependent work by multiplication, and then keeping the dominant term. For auxiliary space, count memory created by the algorithm itself, including collections and call-stack frames, separately from the input.",
    quick: [
      "Define every growing input quantity before counting operations.",
      "Sequential blocks add; nested work multiplies only when the inner work repeats for each outer step.",
      "Keep the dominant term and drop fixed multipliers: O(n + n²) becomes O(n²).",
      "Auxiliary space excludes the input but includes new containers and recursion frames.",
      "Python operations have their own costs: slicing and membership scans are not always O(1).",
    ],
    intent: {
      testing: "Whether code can be analysed using operation costs rather than guessed from indentation alone.",
      common_mistake: "Counting source lines while overlooking a linear operation such as a slice, `x in a_list`, or front insertion.",
      to_stand_out: "State both time and auxiliary space and call out implementation-sensitive built-in operations.",
    },
    speaking: prose(
      "I calculate complexity from the operations that can grow, not from the number of source lines. First I define the input variables. For one list, `n` is its length; for two independent lists I may need `n` and `m`. Then I identify how often each important operation runs and include the cost of that operation itself.",
      "Sequential blocks add. A pass over `n` items followed by another pass is O(n + n), which simplifies to O(n). If an inner loop of `n` iterations runs for every outer iteration, the costs multiply to O(n²). That multiplication is not automatic: two loops one after another remain linear, and a triangular loop still has about n²/2 iterations, so it is O(n²).",
      "For example, checking `item in seen_list` inside a loop over all input items can be O(n²), because list membership may scan linearly each time. Replacing the list with a set changes the average membership cost to O(1), making the whole pass average O(n). The Python expression looks small, but its collection operation controls the result.",
      "For space, I distinguish total input storage from auxiliary space created by the algorithm. A new result list of `n` items is O(n) auxiliary space. A few counters are O(1). Recursion uses one frame per active call, so a recursion depth of `n` adds O(n) stack space even without a visible container. Finally I simplify to the dominant terms and state important assumptions, such as average hash-table lookup or CPython list behavior."
    ),
    deepTitle: "Trace the cost of each operation through its enclosing loops",
    deep: prose(
      "A reliable analysis labels each block with two facts: its frequency and its per-use cost. Multiplying those values prevents hidden Python operations from disappearing. After calculating blocks, add independent paths and keep the worst relevant branch for a worst-case analysis.",
      table(
        "| Code action | Frequency | Cost each | Contribution |",
        "|---|---:|---:|---:|",
        "| create an empty set | 1 | O(1) | O(1) |",
        "| loop over `n` values | n | — | n iterations |",
        "| set membership | n | average O(1) | average O(n) |",
        "| add unseen value | at most n | average O(1) | average O(n) |",
        "| store distinct values | at most n | O(1) each | O(n) space |"
      ),
      mermaid(
        "flowchart LR",
        "  O[operation cost] --> M[multiply by execution frequency]",
        "  M --> A[add sequential block costs]",
        "  A --> D[keep dominant growing term]",
        "  D --> S[count created collections and call frames separately]"
      ),
      "The example returns both duplicates and an operation counter. It makes the one-pass structure explicit. Its average time is O(n), its auxiliary space is O(n) in the all-distinct case, and its output may also contain up to O(n) values. Output space can be reported separately when the caller requires those results.",
      python(
        "def find_duplicates(values):",
        "    seen = set()",
        "    duplicates = []",
        "    checks = 0",
        "    for value in values:",
        "        checks += 1",
        "        if value in seen:",
        "            duplicates.append(value)",
        "        else:",
        "            seen.add(value)",
        "    return duplicates, checks",
        "",
        "duplicates, checks = find_duplicates([4, 1, 4, 2, 1])",
        "assert duplicates == [4, 1]",
        "assert checks == 5"
      ),
      "Do not turn every built-in into implementation trivia. Use documented or conventional operation costs relevant to the decision, state when an average-case assumption is involved, and measure only after the growth model has identified the likely bottleneck."
    ),
    followups: [
      "Why are two consecutive O(n) loops not O(n²)?",
      "How can a one-line list slice affect both time and space complexity?",
      "What is the difference between auxiliary space and space used by the returned output?",
    ],
  },
  {
    topic: "big-o-basics",
    slug: "python-worst-average-amortized-complexity",
    question: "What is the difference between worst-case, average-case, and amortized complexity?",
    title: "Worst-Case, Average-Case, and Amortized Complexity",
    direct: "Worst-case complexity bounds the most expensive valid input of a size, average-case complexity describes expected cost under a stated input distribution, and amortized complexity spreads occasional expensive operations across a sequence to bound the average cost per operation without assuming random inputs.",
    quick: [
      "Worst case asks for the maximum cost among valid inputs of size `n`.",
      "Average case needs a stated probability or workload model; it is not the same as typical by intuition.",
      "Amortized analysis studies a whole operation sequence, not a probability distribution.",
      "A CPython list append is amortized O(1), although an append that triggers resizing can be O(n).",
      "Dictionary and set lookup are described as average O(1); pathological collision behavior can be worse.",
    ],
    intent: {
      testing: "Whether different complexity guarantees are named accurately instead of all being called average time.",
      common_mistake: "Saying amortized means average input or claiming each list append is guaranteed O(1).",
      to_stand_out: "Connect amortized analysis to a sequence of resizes and distinguish it from hash-table average-case lookup.",
    },
    speaking: prose(
      "Worst-case complexity looks at the most work an algorithm can require for any valid input of size `n`. A linear search has worst-case O(n) time because the target may be last or absent. This guarantee is useful when a slow request cannot be tolerated, although it may describe an uncommon input.",
      "Average-case complexity takes an expectation over a stated distribution of inputs or internal choices. A hash-table lookup is normally described as average O(1) because well-distributed hashes keep candidate searches small. That statement is not a guarantee that every lookup costs the same, and an honest analysis names assumptions about hashing and workload.",
      "Amortized complexity is different from probability. It examines a sequence of operations and spreads rare expensive events over the cheap ones. In CPython, most list appends place an item into spare allocated capacity. Occasionally the list must allocate a larger backing area and copy references, making that append O(n), but enough cheap appends occur between resizes that a long sequence costs O(1) per append on an amortized basis.",
      "For example, 1,000 appends do not resize and copy all existing elements 1,000 times. Capacity grows in chunks, so total copying across the sequence remains proportional to the number of appended items. The useful conclusion is to name the guarantee precisely: worst case for hard bounds, average case when a distribution or hashing assumption is valid, and amortized cost when occasional maintenance is paid for across a sequence."
    ),
    deepTitle: "Amortized analysis follows an account across many operations",
    deep: prose(
      "Imagine charging each append a small number of abstract coins. A cheap append uses one coin. Unused coins are saved to pay for a later resize and copy. If the capacity grows geometrically, the saved budget covers all moves over a long series, so the total work for `n` appends is O(n) even though one selected append can be linear.",
      mermaid(
        "flowchart LR",
        "  A[Several cheap appends] --> S[Spare capacity decreases]",
        "  S --> R{Capacity full?}",
        "  R -- No --> A",
        "  R -- Yes --> C[Allocate larger storage and copy references]",
        "  C --> A"
      ),
      "This executable model deliberately doubles a small capacity so the resize events are visible. It is not CPython's exact growth formula; it teaches the sequence argument. For 16 insertions, copies occur only when capacity changes, and their total remains below twice the final number of items.",
      python(
        "def simulated_append_cost(count):",
        "    size, capacity, copied = 0, 1, 0",
        "    resize_points = []",
        "    for _ in range(count):",
        "        if size == capacity:",
        "            copied += size",
        "            capacity *= 2",
        "            resize_points.append(size)",
        "        size += 1",
        "    return copied, resize_points",
        "",
        "copied, resize_points = simulated_append_cost(16)",
        "assert resize_points == [1, 2, 4, 8]",
        "assert copied == 15"
      ),
      "A single worst-case event and an amortized per-operation result can both be true. Keep that distinction when an API must meet latency bounds: amortized O(1) describes throughput across the sequence, not the maximum pause of an individual resize."
    ),
    followups: [
      "Why is amortized complexity not the same as average-case complexity?",
      "What can make one Python list append take O(n) time?",
      "When would a worst-case guarantee matter more than good amortized throughput?",
    ],
  },
  {
    topic: "arrays-and-lists",
    slug: "python-list-operation-time-complexity",
    question: "How does a Python list work as a dynamic array, and what are its common operation costs?",
    title: "Python List Dynamic-Array Behavior and Complexity",
    direct: "In CPython, a list stores an ordered resizable array of object references. Index access and end removal are O(1), append is amortized O(1), searching is O(n), and inserting or deleting near the front is O(n) because later references must shift; slices also copy references into a new list.",
    quick: [
      "CPython lists store references in contiguous, resizable pointer storage, not linked nodes.",
      "Index read or assignment is O(1); membership search and `index` are O(n).",
      "`append` is amortized O(1), while an occasional resize copies references and costs O(n).",
      "`insert(0, value)` and `pop(0)` are O(n) because remaining references shift.",
      "A slice of `k` elements takes O(k) time and creates O(k) reference storage.",
    ],
    intent: {
      testing: "Whether Python list operations are chosen using their real sequence and dynamic-array behavior.",
      common_mistake: "Calling every list operation O(1) or using `pop(0)` repeatedly as an efficient queue.",
      to_stand_out: "Qualify the representation as CPython behavior and relate cost to shifting, scanning, or copying references.",
    },
    speaking: prose(
      "A Python list is the language's mutable ordered sequence. In CPython, it is implemented as a resizable array of references to Python objects. That representation makes indexed access efficient: once Python has an index, it can locate the corresponding reference in O(1) time. It also gives good cache behavior when traversing the reference array.",
      "The cost changes when positions move. `append` normally writes into spare capacity, so it is amortized O(1); an occasional growth operation allocates more storage and copies existing references. `pop()` at the end is O(1), but `insert(0, value)` or `pop(0)` is O(n) because every following reference must shift. Searching by value with `in` or `index` is also O(n) because the list has no hash index for arbitrary values.",
      "For example, processing a queue with repeated `jobs.pop(0)` shifts the remaining jobs after every removal and can make the full drain O(n²). A `collections.deque` provides approximately O(1) removal from the left and better expresses FIFO behavior. By contrast, a stack using `append` and end `pop` fits list strengths.",
      "Slicing has another boundary: `values[a:b]` creates a new list containing references for the selected `k` positions, so it costs O(k) time and space and is shallow. These costs describe CPython's normal implementation and are suitable for Python interviews, but another Python implementation can choose different internals. I choose a list when ordering and indexed access matter, and change structures when frequent front operations or keyed membership dominate."
    ),
    deepTitle: "List cost comes from scanning, shifting, or resizing references",
    deep: prose(
      "A dynamic array keeps logical length separate from allocated capacity. Spare capacity lets many appends avoid allocation. Indexing uses an offset into this storage, whereas a front insertion opens a gap by moving every existing reference one place to the right.",
      table(
        "| Operation on a list of length `n` | Typical cost | Physical reason |",
        "|---|---:|---|",
        "| `values[i]` | O(1) | calculate one position |",
        "| `values.append(x)` | amortized O(1) | use spare capacity; resize sometimes |",
        "| `values.pop()` | O(1) | remove final reference |",
        "| `x in values` | O(n) | compare candidates in order |",
        "| `values.insert(0, x)` | O(n) | shift existing references |",
        "| `values[a:b]` | O(k) | copy `k` references into a new list |"
      ),
      mermaid(
        "flowchart LR",
        "  Q{Which list action?} -->|index| P[calculate one position]",
        "  Q -->|search| S[scan candidate values]",
        "  Q -->|front change| M[shift later references]",
        "  Q -->|slice| C[copy selected references]"
      ),
      "The code below checks semantic behavior rather than unstable timings. It shows that a slice is a separate outer list, while both outer lists still point to the same nested dictionary. That is why the slice cost copies references rather than recursively copying every object.",
      python(
        "records = [{\"id\": 1}, {\"id\": 2}, {\"id\": 3}]",
        "window = records[1:]",
        "",
        "assert window is not records",
        "assert window[0] is records[1]",
        "window[0][\"active\"] = True",
        "assert records[1][\"active\"] is True",
        "",
        "stack = []",
        "stack.append(\"first\")",
        "stack.append(\"second\")",
        "assert stack.pop() == \"second\""
      ),
      "Complexity alone does not forbid a front insertion in a five-item list. It tells you what will scale poorly when that operation is central and repeated, which is the point at which a deque or a different data model becomes clearer."
    ),
    followups: [
      "Why is list append amortized O(1) instead of guaranteed O(1)?",
      "Why does repeated `pop(0)` make a poor queue implementation?",
      "What exactly is copied when a Python list is sliced?",
    ],
  },
  {
    topic: "arrays-and-lists",
    slug: "python-list-aliasing-shallow-copy-slicing",
    question: "What is the difference between list aliasing, shallow copying, and slicing in Python?",
    title: "List Aliasing, Shallow Copies, and Slices",
    direct: "Aliasing gives two names to the same list, so either name sees structural mutations. `copy()` and a full slice create a new outer list but reuse references to the same elements, making them shallow copies; nested mutable elements therefore remain shared unless they are copied at the required ownership boundary.",
    quick: [
      "`alias = original` copies a reference, not the list object.",
      "`original.copy()`, `original[:]`, and `list(original)` create a separate outer list.",
      "All three normal copy forms are shallow: nested objects are still shared.",
      "Outer operations such as `append` are isolated after a shallow copy; inner mutation may not be.",
      "Use `copy.deepcopy` only when recursive independence matches the data's ownership rules.",
    ],
    intent: {
      testing: "Whether Python's reference model and the boundary of a shallow copy are understood.",
      common_mistake: "Assuming assignment copies a list or assuming a shallow copy duplicates nested dictionaries and lists.",
      to_stand_out: "Describe copying as an ownership decision and demonstrate identity at both outer and inner levels.",
    },
    speaking: prose(
      "List variables hold references to objects. With `alias = original`, Python binds another name to the same list; it does not create a second container. An `append`, deletion, or item assignment through either name changes that one object, so the other name observes the same structure.",
      "A shallow copy creates a new outer list. `original.copy()`, `original[:]`, and `list(original)` all provide this common behavior. Appending to the copied outer list no longer changes the original list's length, but the element references are copied unchanged. If an element is a mutable dictionary or list, both outer containers still reach that same nested object.",
      "For example, suppose `original = [{\"skills\": [\"Python\"]}]` and `copy = original.copy()`. Running `copy.append(...)` affects only `copy`. Running `copy[0][\"skills\"].append(\"SQL\")` changes the shared inner skills list, so the new value is visible through `original` as well.",
      "`copy.deepcopy` recursively copies supported nested objects and handles repeated references and cycles, but using it automatically can be expensive or semantically wrong. Some objects represent shared services, open resources, or identities that should not be duplicated. The useful conclusion is to copy at the ownership boundary: assignment when state should be shared, a shallow copy when only the outer sequence needs isolation, and an explicit deeper copy or reconstruction when nested state must be independent. Identity checks with `is` make that chosen boundary easy to verify in a focused test."
    ),
    deepTitle: "Draw the object graph to see what a copy owns",
    deep: prose(
      "The word copy is incomplete unless its depth is named. An outer list stores references; copying that list duplicates the row of references, not the objects at the ends of those references. Identity checks expose the boundary without relying on printed values, which can look identical for shared and independent objects.",
      mermaid(
        "flowchart LR",
        "  O[original outer list] --> N[nested profile dictionary]",
        "  A[alias] --> O",
        "  C[shallow-copy outer list] --> N",
        "  D[deep-copy outer list] --> N2[independent nested dictionary]"
      ),
      "This executable trace changes one level at a time. The outer append proves the copied container is independent. The nested update proves its child is still shared. A deep copy then creates a separate nested child for this plain data structure.",
      python(
        "from copy import deepcopy",
        "",
        "original = [{\"skills\": [\"Python\"]}]",
        "alias = original",
        "shallow = original.copy()",
        "deep = deepcopy(original)",
        "",
        "shallow.append({\"skills\": [\"Go\"]})",
        "assert len(original) == 1",
        "shallow[0][\"skills\"].append(\"SQL\")",
        "assert original[0][\"skills\"] == [\"Python\", \"SQL\"]",
        "deep[0][\"skills\"].append(\"Rust\")",
        "assert \"Rust\" not in original[0][\"skills\"]",
        "assert alias is original"
      ),
      "A focused reconstruction is often clearer than deep-copying a large domain object. For example, copying each record dictionary with a comprehension documents exactly which layer the caller intends to own."
    ),
    followups: [
      "Why can two lists print the same values but have different identities?",
      "Which mutations are isolated by a shallow copy, and which can still leak through?",
      "When can `deepcopy` be a poor fit for application objects?",
    ],
  },
  {
    topic: "arrays-and-lists",
    slug: "python-build-filter-list-without-mutation",
    question: "Why is mutating a list while iterating over it risky, and how should you filter or transform it?",
    title: "Safe List Filtering and Transformation",
    direct: "A list iterator advances through positions while mutation can shift or remove those positions, so deleting or inserting during the same forward traversal may skip values or process the wrong ones. Build a new list with a comprehension or loop for filtering, or iterate over a copy when in-place mutation is an explicit requirement.",
    quick: [
      "Changing list length during its own forward iteration can shift the next unread item.",
      "Use a list comprehension to produce a filtered or transformed list in one clear pass.",
      "Use an explicit result loop when the rule needs several steps, logging, or error handling.",
      "Assign with `items[:] = filtered` when callers must keep the original list object's identity.",
      "Iterating over `items.copy()` permits deliberate removal, but repeated `remove` can still be O(n²).",
    ],
    intent: {
      testing: "Whether iteration state, mutation, result ownership, and algorithmic cost are considered together.",
      common_mistake: "Calling `remove` inside `for item in items` and assuming every matching item will be visited.",
      to_stand_out: "Choose between a new result and slice assignment based on whether external aliases must observe the update.",
    },
    speaking: prose(
      "Mutating a list's length while iterating over that same list is risky because the iterator and the mutation both act on positions. When an item is removed, later items shift left, but the iterator moves to its next index. A value that shifted into the current position can therefore be skipped. Inserting can produce repeated or unexpectedly visited values.",
      "For filtering, the clearest solution is usually to build a new list: `kept = [value for value in values if condition(value)]`. It reads every source item once, leaves the source unchanged, and makes the rule visible. A normal loop with `append` is better when the transformation needs multiple named steps, exception handling, or additional outputs.",
      "For example, removing even numbers from `[2, 4, 5]` with `for value in values: values.remove(value)` can leave `4`, because it moves to index zero after `2` is removed while iteration proceeds to index one. `[value for value in values if value % 2]` reliably produces `[5]`.",
      "Sometimes the list object's identity must remain stable because other code holds aliases to it. In that case, compute the result first and assign it back with `values[:] = filtered`; aliases then see the same list object with new contents. Iterating over a shallow copy is another deliberate option, but repeated value removal includes linear searches and shifts. The main rule is to separate traversal from structural change unless the index movement is explicitly controlled."
    ),
    deepTitle: "A removal changes the map between indexes and unread values",
    deep: prose(
      "A Python list iterator maintains progress through the sequence. Deleting index zero shifts the old index one into index zero. The iterator's next position is index one, so the shifted value is never considered. The problem is not that mutation always raises an error; it can quietly produce a plausible but incomplete result.",
      table(
        "| Moment | List contents | Iterator's next index | Consequence |",
        "|---|---|---:|---|",
        "| before first removal | `[2, 4, 5]` | 0 | reads `2` |",
        "| after removing `2` | `[4, 5]` | 1 | `4` moved behind progress |",
        "| next iteration | `[4, 5]` | 1 | reads `5`; `4` was skipped |"
      ),
      "The code demonstrates three ownership choices: produce a new list, replace the contents of the existing object, or use a controlled index loop. The first two are usually easiest to review.",
      python(
        "values = [2, 4, 5]",
        "broken = values.copy()",
        "for value in broken:",
        "    if value % 2 == 0:",
        "        broken.remove(value)",
        "assert broken == [4, 5]  # 4 was skipped",
        "",
        "filtered = [value for value in values if value % 2 != 0]",
        "assert filtered == [5]",
        "assert values == [2, 4, 5]",
        "",
        "alias = values",
        "values[:] = filtered",
        "assert alias is values and alias == [5]"
      ),
      "Transformation has the same principle. A comprehension should stay short enough that its source, filter, and output remain clear; complex state changes belong in a named loop rather than being compressed into one expression."
    ),
    followups: [
      "Why can removal during forward iteration skip an adjacent matching value?",
      "How does slice assignment differ from rebinding the variable to a new list?",
      "When is an explicit loop clearer than a list comprehension?",
    ],
  },
  {
    topic: "linked-list-concept",
    slug: "python-singly-linked-list-vs-list",
    question: "How does a singly linked list work, and how does it differ from a Python list?",
    title: "Singly Linked Lists vs Python Lists",
    direct: "A singly linked list stores each value in a node that points to the next node, and a head reference starts the chain. Unlike a CPython list's resizable array of references, it has no O(1) positional indexing, but it can insert or remove at the head in O(1) without shifting later elements.",
    quick: [
      "A node contains a value and a reference to the next node; the final node points to `None`.",
      "The head is the entry point, and reaching index `i` requires walking through `i` links: O(n) in general.",
      "Head insertion and head removal are O(1) because only the head reference changes.",
      "A CPython list supports O(1) indexing but front insertion is O(n) because references shift.",
      "Linked nodes add per-node reference overhead and usually have poorer locality than an array-backed list.",
    ],
    intent: {
      testing: "Whether the candidate can connect representation to indexing, update cost, memory, and real use cases.",
      common_mistake: "Claiming every linked-list insertion is O(1) without counting the search needed to find the position.",
      to_stand_out: "Separate the cost of locating a node from the cost of changing links once the node is known.",
    },
    speaking: prose(
      "A singly linked list is a chain of nodes. Each node stores a value and one reference named something like `next`; the head reference identifies the first node, and the final node's next reference is `None`. The nodes do not need to occupy consecutive positions in memory, because the links define their order.",
      "That representation changes operation costs. Reading the item at index 500 requires starting at the head and following 500 links, so positional access is O(n). Inserting at the head is O(1): the new node points to the old head, then the head points to the new node. Removing the head is also O(1). Inserting after an already-known node only changes links, but finding that node may still take O(n).",
      "For example, adding `10` before the chain `20 → 30` creates a node for `10`, sets its next link to the node holding `20`, and moves the head to `10`. No existing value shifts. Doing the equivalent front insertion in a CPython list moves all existing references to open index zero.",
      "The trade-off is not that a linked list is universally faster. A Python list gives O(1) indexing, compact reference storage, and convenient built-in operations. Linked nodes use extra memory for links and tend to have weaker cache locality. In normal Python application code, `list` or `deque` is often preferable. A linked list is valuable when the problem naturally manipulates known nodes or when an interview tests pointer reasoning, but its costs must include traversal."
    ),
    deepTitle: "The link, not an index, defines the next position",
    deep: prose(
      "An array-backed sequence computes an address from an index. A linked list knows only the head and each node's next reference, so navigation is local: the current node reveals exactly one following node. That is why there is no shortcut to the middle without an additional index.",
      mermaid(
        "flowchart LR",
        "  H[head] --> N1[10]",
        "  N1 --> N2[20]",
        "  N2 --> N3[30]",
        "  N3 --> X[None]",
        "  New[new node: 5] -. set next .-> N1",
        "  H -. then move head .-> New"
      ),
      "The small implementation below preserves one important invariant: starting at `head` and following `next` eventually visits every stored value exactly once, then reaches `None`. Prepending never edits the old chain; it only places a new entry point before it.",
      python(
        "from dataclasses import dataclass",
        "",
        "@dataclass",
        "class Node:",
        "    value: int",
        "    next: \"Node | None\" = None",
        "",
        "def prepend(head, value):",
        "    return Node(value, head)",
        "",
        "def to_list(head):",
        "    values = []",
        "    current = head",
        "    while current is not None:",
        "        values.append(current.value)",
        "        current = current.next",
        "    return values",
        "",
        "head = Node(20, Node(30))",
        "head = prepend(head, 10)",
        "assert to_list(head) == [10, 20, 30]"
      ),
      "Real linked structures may add a tail pointer, a previous link, a sentinel node, or a length field. Each addition improves particular operations but introduces another invariant that every update must preserve."
    ),
    followups: [
      "Why is inserting after a known linked-list node O(1), but inserting by index O(n)?",
      "What extra relationship does a doubly linked list store?",
      "Why is a built-in Python list often faster for ordinary sequential data?",
    ],
  },
  {
    topic: "linked-list-concept",
    slug: "python-linked-list-insert-delete-traverse",
    question: "How do insertion, deletion, and traversal work in a singly linked list?",
    title: "Singly Linked List Insertion, Deletion, and Traversal",
    direct: "Traversal follows `next` from the head until `None`. Insertion redirects the predecessor or head to a new node whose `next` keeps the rest of the chain, while deletion redirects the predecessor or head past the removed node; link changes are O(1) once the required nodes are known, but locating them is O(n).",
    quick: [
      "Traversal keeps a `current` node and advances with `current = current.next` until `None`.",
      "To insert after a node, point the new node to the old successor before redirecting the node to the new one.",
      "To delete a successor, redirect the predecessor to `predecessor.next.next`.",
      "Head insertion and deletion are special because there is no predecessor; update `head` directly.",
      "Searching by value or index is O(n); the final link rewrite is O(1).",
    ],
    intent: {
      testing: "Whether node rewiring can be explained without losing the remainder of the list or hiding traversal cost.",
      common_mistake: "Overwriting a node's next reference before saving the old successor, which can detach the rest of the chain.",
      to_stand_out: "State the link invariant before and after each operation and handle an empty list or head match explicitly.",
    },
    speaking: prose(
      "Traversal begins at the head and repeatedly follows `next` until the current reference becomes `None`. That is the basic operation behind search, length calculation, printing, and finding an insertion point. Because each step exposes only one successor, visiting or searching the whole list is O(n).",
      "Insertion preserves the existing chain by ordering its assignments carefully. To insert a new node after `current`, first set `new.next` to `current.next`, then set `current.next` to `new`. The new node now sits between the current node and its old successor. If the insertion is at the head, set the new node's next to the old head and return the new node as the head.",
      "Deletion bypasses a node. If a predecessor is known, set `previous.next` to `target.next`. Deleting the head instead moves the head to `head.next`. For example, removing `20` from `10 → 20 → 30` changes the link from `10` so that it points directly to `30`; the values do not shift and the `30` node is unchanged.",
      "The rewiring itself is O(1), but a method such as `delete_value(20)` must first search from the head and is therefore O(n). Empty input, deleting the head, a missing target, and deleting the final node are important boundaries. A good implementation defines whether a missing target returns the unchanged head, returns a status, or raises. The conclusion is to keep the head under explicit ownership and never quote O(1) deletion without saying how the predecessor or target was obtained."
    ),
    deepTitle: "Every update must preserve reachability of the remaining chain",
    deep: prose(
      "The key invariant is reachability: after an operation, following links from the returned head must still reach every retained node in the intended order. Saving the successor before changing a link prevents accidental loss of the suffix.",
      table(
        "| Operation | Link before | Link change | Link after |",
        "|---|---|---|---|",
        "| insert 20 after 10 | `10 → 30` | `20.next = 30`; `10.next = 20` | `10 → 20 → 30` |",
        "| delete 20 | `10 → 20 → 30` | `10.next = 20.next` | `10 → 30` |",
        "| delete head 10 | `head → 10 → 30` | `head = head.next` | `head → 30` |"
      ),
      mermaid(
        "flowchart LR",
        "  P[predecessor: 10] --> T[target: 20]",
        "  T --> S[successor: 30]",
        "  P -. redirect next .-> S",
        "  T -. becomes unreachable from head .-> X[removed]"
      ),
      "This version returns a possibly changed head from every structural operation. That return value keeps the head case visible to the caller rather than hiding it in global state.",
      python(
        "from dataclasses import dataclass",
        "",
        "@dataclass",
        "class Node:",
        "    value: int",
        "    next: \"Node | None\" = None",
        "",
        "def delete_first(head, target):",
        "    if head is None:",
        "        return None",
        "    if head.value == target:",
        "        return head.next",
        "    current = head",
        "    while current.next is not None:",
        "        if current.next.value == target:",
        "            current.next = current.next.next",
        "            return head",
        "        current = current.next",
        "    return head",
        "",
        "head = Node(10, Node(20, Node(30)))",
        "head = delete_first(head, 20)",
        "assert head.value == 10",
        "assert head.next.value == 30",
        "assert head.next.next is None"
      ),
      "In production code, ownership and concurrency also matter: changing shared links while another traversal runs can expose an inconsistent view. This basic implementation assumes one controlled mutation at a time."
    ),
    followups: [
      "Why must insertion save the old successor before redirecting the current node?",
      "How should a delete function report that the requested value was absent?",
      "Which cases require changing the head reference?",
    ],
  },
  {
    topic: "linked-list-concept",
    slug: "python-fast-slow-pointer-middle-cycle",
    question: "How does the slow-and-fast pointer technique find a linked-list middle or detect a cycle?",
    title: "Slow and Fast Pointers for Middles and Cycles",
    direct: "The technique advances one pointer by one node and another by two nodes. When the fast pointer reaches the end, the slow pointer is at the middle; if the list contains a cycle, the two pointers must eventually meet inside it, so cycle detection takes O(n) time and O(1) auxiliary space.",
    quick: [
      "Move `slow` one link and `fast` two links on each iteration.",
      "For a finite acyclic list, `fast` reaches `None` while `slow` reaches the middle.",
      "Inside a cycle, the faster pointer gains one node per step relative to the slower pointer and must meet it.",
      "Cycle detection is O(n) time and O(1) auxiliary space; a visited-node set uses O(n) space.",
      "Use identity (`is`) for node meetings, not equality of stored values.",
    ],
    intent: {
      testing: "Whether a pointer invariant can be reasoned about and translated into safe loop conditions.",
      common_mistake: "Comparing node values instead of node identity or dereferencing `fast.next` before checking that `fast` exists.",
      to_stand_out: "Explain the relative-speed argument and state which middle is returned for an even-length list.",
    },
    speaking: prose(
      "Slow and fast pointers are two references that traverse the same linked list at different speeds. In each round, `slow` moves one link and `fast` moves two. The technique extracts information from their relative movement without storing every visited node.",
      "To find a middle, continue while `fast` and `fast.next` exist. When the faster pointer reaches the end, the slower pointer has covered about half as many links and is at the middle. With the common loop condition, an even-length list such as `10 → 20 → 30 → 40` returns `30`, the second of the two central nodes. A different initialization can deliberately choose the first middle.",
      "For cycle detection, an acyclic list lets `fast` reach `None`. If a cycle exists, both pointers eventually enter it. Once inside, `fast` gains one position on `slow` per iteration around a finite ring, so they must occupy the same node. The check uses `slow is fast`; two different nodes may store equal values and do not prove a cycle.",
      "For example, if `40.next` points back to the node holding `20`, a traversal that only waits for `None` never finishes. Floyd's tortoise-and-hare test detects the repeated path in O(n) time and O(1) auxiliary space. A `set` of visited node identities is easier to invent and can locate repetition too, but uses O(n) memory. The two-pointer method is appropriate for a single-successor chain; arbitrary graphs need different visited-state reasoning."
    ),
    deepTitle: "Relative speed turns an unseen loop into a meeting",
    deep: prose(
      "Once both pointers are inside a cycle of length `c`, measure the fast pointer's lead modulo `c`. Every round changes that lead by one because fast moves two steps and slow moves one. Within at most `c` rounds the lead becomes zero, which is exactly a meeting at the same node.",
      mermaid(
        "flowchart LR",
        "  A[10] --> B[20]",
        "  B --> C[30]",
        "  C --> D[40]",
        "  D --> B",
        "  S[slow: +1 each round] -. follows .-> B",
        "  F[fast: +2 each round] -. gains one .-> C"
      ),
      "The function guards both references before taking two fast steps. The example also marks the dataclass with `eq=False`, making node identity explicit and avoiding recursive structural equality on a cyclic object.",
      python(
        "from dataclasses import dataclass",
        "",
        "@dataclass(eq=False)",
        "class Node:",
        "    value: int",
        "    next: \"Node | None\" = None",
        "",
        "def has_cycle(head):",
        "    slow = fast = head",
        "    while fast is not None and fast.next is not None:",
        "        slow = slow.next",
        "        fast = fast.next.next",
        "        if slow is fast:",
        "            return True",
        "    return False",
        "",
        "first = Node(10)",
        "second = Node(20)",
        "third = Node(30)",
        "first.next, second.next, third.next = second, third, second",
        "assert has_cycle(first) is True",
        "assert has_cycle(Node(1, Node(2))) is False"
      ),
      "Finding the cycle's entry requires a second phase after a meeting: move one pointer to the head, advance both one step at a time, and their next meeting is the entry. That extension relies on a separate distance proof and should not be confused with the basic existence test."
    ),
    followups: [
      "Why must cycle detection compare node identity rather than node values?",
      "Which middle does the usual loop return for an even number of nodes?",
      "How can Floyd's algorithm be extended to find the entry of the cycle?",
    ],
  },
  {
    topic: "stacks-and-queues",
    slug: "python-stack-lifo-list",
    question: "What is a stack, and how do you implement one with a Python list?",
    title: "Stacks and LIFO Behavior with Python Lists",
    direct: "A stack is a last-in, first-out collection: `push` adds to the top, `pop` removes the most recent item, and `peek` reads it without removal. A Python list implements this efficiently at its right end with `append`, `pop`, and `stack[-1]`, each O(1) amortized or O(1) under normal list behavior.",
    quick: [
      "A stack follows LIFO: the latest pushed item is the first one popped.",
      "Use list `append` for push and no-argument `pop` for removal from the top.",
      "Use `stack[-1]` to peek, after checking that the stack is not empty.",
      "Push is amortized O(1); pop and peek at the right end are O(1).",
      "Stacks model nested work, undo history, DFS frontiers, and active function calls.",
    ],
    intent: {
      testing: "Whether LIFO semantics, operations, empty-state policy, and Python's efficient end operations are clear.",
      common_mistake: "Using index zero as the stack top and paying O(n) shifts for every push or pop.",
      to_stand_out: "State the invariant that the list's final element is the top and define underflow behavior.",
    },
    speaking: prose(
      "A stack is a collection with last-in, first-out order. The most recently added item is called the top and is the next item removed. Its core operations are push, pop, and peek. Push adds a value, pop removes and returns the top, and peek reads the top without changing the stack.",
      "A Python list is a natural stack when its right end is the top. `stack.append(value)` pushes, `stack.pop()` pops, and `stack[-1]` peeks. Appending is amortized O(1), while end pop and indexing the last item are O(1). Using the left end would be inefficient because inserting or removing there shifts the remaining references and costs O(n).",
      "For example, an editor can push each completed action onto an undo stack. If the actions are `type A`, `type B`, and `delete B`, the first undo must reverse `delete B`, the latest action. A second stack can support redo by receiving actions removed during undo. Performing a new action normally clears the redo stack because the old forward history is no longer valid.",
      "Empty behavior is part of the interface. Python's `pop()` and `stack[-1]` raise `IndexError` on an empty list, so a wrapper may check first and return a sentinel or raise a clearer domain error. A stack is appropriate when only the newest pending item should be processed. If the oldest item must leave first, that is FIFO queue behavior and a deque is a better model."
    ),
    deepTitle: "One chosen end is both the entry and exit",
    deep: prose(
      "The useful invariant is simple: after every operation, `stack[-1]` is the newest unremoved value. Push extends the right side. Pop shortens the same side. No middle position needs to move, which is why the representation matches the abstraction.",
      table(
        "| Operation | Stack before | Stack after | Returned value |",
        "|---|---|---|---|",
        "| push A | `[]` | `[A]` | — |",
        "| push B | `[A]` | `[A, B]` | — |",
        "| peek | `[A, B]` | `[A, B]` | B |",
        "| pop | `[A, B]` | `[A]` | B |"
      ),
      mermaid(
        "flowchart LR",
        "  P[push at right end] --> S[bottom A · B top]",
        "  S --> O[pop from same right end]",
        "  O --> B[B leaves before A]"
      ),
      "This small undo model makes the LIFO rule and the empty boundary executable. It stores simple strings so the structure remains the focus; a real application would store commands capable of applying and reversing themselves.",
      python(
        "class UndoHistory:",
        "    def __init__(self):",
        "        self._actions = []",
        "",
        "    def record(self, action):",
        "        self._actions.append(action)",
        "",
        "    def undo(self):",
        "        if not self._actions:",
        "            return None",
        "        return self._actions.pop()",
        "",
        "history = UndoHistory()",
        "history.record(\"type A\")",
        "history.record(\"type B\")",
        "assert history.undo() == \"type B\"",
        "assert history.undo() == \"type A\"",
        "assert history.undo() is None"
      ),
      "The call stack is a related runtime structure, but it holds active execution frames rather than a normal Python list controlled by application code. The LIFO relationship is the common idea."
    ),
    followups: [
      "Why should a list-based stack use the right end rather than index zero?",
      "How would two stacks support both undo and redo?",
      "What policy should a stack expose when pop is requested on an empty collection?",
    ],
  },
  {
    topic: "stacks-and-queues",
    slug: "python-queue-deque-vs-list",
    question: "What is a queue, and why should Python code usually use `collections.deque` instead of a list?",
    title: "Queues with collections.deque vs Lists",
    direct: "A queue is first-in, first-out: new items join one end and the oldest leaves the other. `collections.deque` is designed for approximately O(1) appends and pops at both ends, while removing index zero from a list is O(n) because all remaining references must shift.",
    quick: [
      "A queue follows FIFO: the earliest enqueued item is the first dequeued.",
      "Use `deque.append` to enqueue and `deque.popleft` to dequeue.",
      "Deque operations at either end are approximately O(1).",
      "List `pop(0)` and `insert(0, value)` are O(n) because they move remaining references.",
      "A bounded deque with `maxlen` automatically discards items from the opposite end when full.",
    ],
    intent: {
      testing: "Whether FIFO semantics are connected to Python's standard queue-oriented data structure and operation costs.",
      common_mistake: "Using repeated `list.pop(0)` because it looks concise while ignoring its cumulative shifting cost.",
      to_stand_out: "Distinguish an in-memory deque from synchronized or asynchronous queue classes used between workers.",
    },
    speaking: prose(
      "A queue is a first-in, first-out collection. Items are enqueued at the back, and the item that has waited longest is dequeued from the front. This ordering fits task scheduling, breadth-first search, request buffering, and any process where arrival order matters.",
      "Python's `collections.deque` is designed for efficient work at both ends. A common queue uses `queue.append(item)` for enqueue and `queue.popleft()` for dequeue, with approximately O(1) performance for both. A list can append efficiently, but `list.pop(0)` is O(n) because removing the first reference shifts every later reference one position left. Draining a large list from the front can therefore become O(n²) overall.",
      "For example, breadth-first search enqueues a start node, repeatedly dequeues the oldest node, and enqueues its unvisited neighbors. FIFO order ensures all nodes one edge away are processed before nodes two edges away. Replacing `popleft` with end `pop` changes the frontier into a stack and the traversal into depth-first behavior.",
      "A deque is not the answer to every communication problem. It is a general in-process container. Code coordinating producer and consumer threads may need `queue.Queue`, and async tasks may need `asyncio.Queue`, because those classes provide waiting and coordination semantics. A deque can also have `maxlen`, which intentionally discards from the opposite end when full. For a simple algorithmic FIFO, however, `append` plus `popleft` communicates the rule and avoids list shifting."
    ),
    deepTitle: "FIFO order makes the frontier expand one layer at a time",
    deep: prose(
      "A queue has two roles for its ends: arrivals join the right, departures leave the left. Existing items retain their relative order. The container operation and the algorithmic guarantee are linked—changing the departure end changes which pending item is processed next.",
      mermaid(
        "flowchart LR",
        "  E[new item] -->|append right| Q[oldest · ... · newest]",
        "  Q -->|popleft| D[oldest item processed]",
        "  D --> N[enqueue unseen neighbors]",
        "  N --> Q"
      ),
      "The executable breadth-first search below returns shortest edge distance in an unweighted graph. Marking a node seen when it is enqueued prevents duplicate queue entries. The algorithm is O(V + E) for adjacency lists because each vertex and edge is processed a bounded number of times.",
      python(
        "from collections import deque",
        "",
        "def shortest_edges(graph, start):",
        "    distances = {start: 0}",
        "    queue = deque([start])",
        "    while queue:",
        "        node = queue.popleft()",
        "        for neighbor in graph.get(node, []):",
        "            if neighbor not in distances:",
        "                distances[neighbor] = distances[node] + 1",
        "                queue.append(neighbor)",
        "    return distances",
        "",
        "graph = {\"A\": [\"B\", \"C\"], \"B\": [\"D\"], \"C\": [\"D\"], \"D\": []}",
        "assert shortest_edges(graph, \"A\") == {\"A\": 0, \"B\": 1, \"C\": 1, \"D\": 2}"
      ),
      "Random indexing into the middle of a deque is not its strength; access slows toward the middle. Choose it for endpoint behavior rather than as a drop-in replacement for every list use."
    ),
    followups: [
      "How does changing `popleft()` to `pop()` alter graph traversal order?",
      "Why can draining a list with `pop(0)` become O(n²)?",
      "When would `queue.Queue` or `asyncio.Queue` be more appropriate than a deque?",
    ],
  },
  {
    topic: "stacks-and-queues",
    slug: "python-balanced-brackets-stack",
    question: "How does a stack solve the balanced-brackets problem?",
    title: "Balanced Brackets with a Stack",
    direct: "Scan left to right, push each opening bracket, and for each closing bracket require the stack top to hold its matching opener before popping it. The string is balanced only if no mismatch or underflow occurs and the stack is empty at the end, giving O(n) time and O(n) worst-case space.",
    quick: [
      "Push `(`, `[`, or `{` when it opens a nested region.",
      "A closing bracket must match the most recent unmatched opener at the stack top.",
      "A closer with an empty stack is invalid immediately.",
      "A non-empty stack after the scan means one or more openers never closed.",
      "The algorithm is O(n) time and O(n) space in the all-opening worst case.",
    ],
    intent: {
      testing: "Whether a nesting rule can be expressed as a stack invariant with complete failure conditions.",
      common_mistake: "Counting opener and closer totals but ignoring order, or forgetting to check the leftover stack at the end.",
      to_stand_out: "State that the top stores the only opener the next closer is allowed to match.",
    },
    speaking: prose(
      "Balanced brackets require more than equal counts. They require correct nesting: the next closing bracket must match the most recent opening bracket that has not yet been closed. That last-opened, first-closed rule is exactly LIFO stack behavior.",
      "I scan the text from left to right. When I see an opening bracket, I push it. When I see a closing bracket, I first check that the stack is not empty, then compare the stack top with the opener required by that closer. A mismatch makes the text invalid; a match pops the opener because that pair is complete. Non-bracket characters can be ignored or rejected depending on the input contract.",
      "For example, in `{[()]}`, the stack grows through `{`, `[`, and `(`. The `)` pops `(`, then `]` pops `[`, and `}` pops `{`, leaving an empty stack. In `([)]`, the `)` expects `(` but finds `[` on top, so the nesting is invalid even though the counts match. In `(()`, scanning finishes with an unmatched `(`, which is also invalid.",
      "Each character is processed once, and every bracket is pushed and popped at most once, so time is O(n). The stack can contain all `n` characters for an input of only openers, giving O(n) auxiliary space. The full correctness condition has three parts: never close an empty stack, every closer matches the current top, and the stack is empty after the final character."
    ),
    deepTitle: "The stack top is the only legal partner for the next closer",
    deep: prose(
      "The invariant after each scanned prefix is: the stack contains exactly the unmatched opening brackets, ordered from oldest at the bottom to newest at the top. A closer cannot match an older opener while a newer one remains open, because that would cross nesting boundaries.",
      table(
        "| Input char from `{[()]}` | Action | Stack after action |",
        "|---|---|---|",
        "| `{` | push | `{` |",
        "| `[` | push | `{ [` |",
        "| `(` | push | `{ [ (` |",
        "| `)` | match and pop `(` | `{ [` |",
        "| `]` | match and pop `[` | `{` |",
        "| `}` | match and pop `{` | empty |"
      ),
      mermaid(
        "flowchart LR",
        "  C[read next character] --> Q{opening or closing?}",
        "  Q -->|opening| P[push it]",
        "  Q -->|closing| M{matches stack top?}",
        "  M -->|yes| O[pop top and continue]",
        "  M -->|no or empty| I[invalid]"
      ),
      "Mapping each closer to its expected opener keeps the comparison data separate from traversal logic. The implementation below ignores other characters; a parser with a stricter grammar could reject them instead.",
      python(
        "def brackets_are_balanced(text):",
        "    expected_opener = {\")\": \"(\", \"]\": \"[\", \"}\": \"{\"}",
        "    opening = set(expected_opener.values())",
        "    stack = []",
        "    for character in text:",
        "        if character in opening:",
        "            stack.append(character)",
        "        elif character in expected_opener:",
        "            if not stack or stack[-1] != expected_opener[character]:",
        "                return False",
        "            stack.pop()",
        "    return not stack",
        "",
        "assert brackets_are_balanced(\"function({value: [1, 2]})\")",
        "assert not brackets_are_balanced(\"([)]\")",
        "assert not brackets_are_balanced(\"(()\")"
      ),
      "The same pattern appears in expression parsing, XML-like nesting, and depth-first traversal: save unfinished contexts and resolve the most recent one first. The details of valid tokens change, but the LIFO invariant remains."
    ),
    followups: [
      "Why are equal counts insufficient to prove that brackets are balanced?",
      "What does the stack contain after processing any valid prefix?",
      "How would the behavior change if every non-bracket character had to be rejected?",
    ],
  },
  {
    topic: "basic-recursion",
    slug: "python-recursion-base-case-call-stack",
    question: "How do the base case, recursive case, and call stack work in Python recursion?",
    title: "Python Recursion, Base Cases, and the Call Stack",
    direct: "A recursive function solves a problem by calling itself on a smaller state. The base case returns without another self-call, the recursive case makes measurable progress toward it, and each active call keeps its own local state on the interpreter stack until deeper calls return and the results unwind.",
    quick: [
      "The base case returns directly and stops further recursive calls.",
      "The recursive case must reduce or otherwise move the state toward the base case.",
      "Every active call has its own arguments, local variables, and return point.",
      "Results return in reverse call order as the stack unwinds.",
      "Missing progress or an unreachable base case eventually raises `RecursionError` in normal Python execution.",
    ],
    intent: {
      testing: "Whether recursion is understood as state reduction plus real stack frames rather than as unexplained self-reference.",
      common_mistake: "Writing a base case that exists syntactically but is never reached by the recursive state change.",
      to_stand_out: "State a decreasing measure, trace calls and returns separately, and include stack space in complexity.",
    },
    speaking: prose(
      "Recursion means a function solves a problem by calling itself with a smaller or simpler state. A correct recursive definition has a base case that returns without another self-call and a recursive case that makes measurable progress toward that base case. Merely writing an `if` is not enough; the changing argument must eventually satisfy it.",
      "Each call creates an active execution frame containing its arguments, local variables, and the location where execution should resume. When one call invokes the next, the earlier frame waits. Once a base case returns, results travel back through those waiting frames in reverse order, which is called unwinding.",
      "For example, `factorial(4)` cannot finish until it receives `factorial(3)`, which waits for `factorial(2)`, which waits for `factorial(1)`. The base case returns 1. Then the calls produce 2, 6, and finally 24 while unwinding. The decreasing measure is `n`; every recursive call uses `n - 1`.",
      "The time is O(n) because there are `n` calls for a positive input, and the auxiliary call-stack space is also O(n) because those frames are simultaneously active before the base case. Python protects the interpreter with a recursion limit, so very deep or non-terminating recursion raises `RecursionError` rather than being a safe infinite process. I use recursion when the problem itself is recursive, such as a tree, and only after defining the base case, progress rule, and depth bound."
    ),
    deepTitle: "Calls move downward; results unwind upward",
    deep: prose(
      "A recursion trace has two directions that are easy to mix up. During descent, each frame records unfinished work and creates the next smaller call. At the base, no new frame is created. During ascent, each waiting frame combines its saved state with the returned result.",
      mermaid(
        "sequenceDiagram",
        "  participant F4 as factorial(4)",
        "  participant F3 as factorial(3)",
        "  participant F2 as factorial(2)",
        "  participant F1 as factorial(1)",
        "  F4->>F3: need 4 × factorial(3)",
        "  F3->>F2: need 3 × factorial(2)",
        "  F2->>F1: need 2 × factorial(1)",
        "  F1-->>F2: return 1",
        "  F2-->>F3: return 2",
        "  F3-->>F4: return 6"
      ),
      "The implementation rejects negative input because this particular recurrence does not progress toward its base case for negative integers. The optional trace records both descent and unwinding, making frame order visible without inspecting interpreter internals.",
      python(
        "def factorial(number, events):",
        "    if number < 0:",
        "        raise ValueError(\"factorial requires a non-negative integer\")",
        "    events.append((\"call\", number))",
        "    if number in (0, 1):",
        "        result = 1",
        "    else:",
        "        result = number * factorial(number - 1, events)",
        "    events.append((\"return\", number, result))",
        "    return result",
        "",
        "events = []",
        "assert factorial(4, events) == 24",
        "assert events[:4] == [(\"call\", 4), (\"call\", 3), (\"call\", 2), (\"call\", 1)]",
        "assert events[-1] == (\"return\", 4, 24)"
      ),
      "For recursive data such as a tree, the decreasing measure may be remaining depth or the number of unvisited nodes rather than a numeric argument. It still needs to be explicit enough to support a termination argument."
    ),
    followups: [
      "Why does a recursive factorial function use O(n) auxiliary space?",
      "What does it mean for a recursive call to make progress?",
      "How would the base case change for an empty recursive data structure?",
    ],
  },
  {
    topic: "basic-recursion",
    slug: "python-recursion-vs-iteration-limit",
    question: "When should you use recursion instead of iteration in Python?",
    title: "Recursion vs Iteration in Python",
    direct: "Use recursion when the data or problem is naturally recursive and the maximum depth is safely bounded, because it can mirror the definition clearly. Prefer iteration with an explicit loop or stack for long linear chains or untrusted depth, since Python consumes one interpreter frame per call, enforces a recursion limit, and does not eliminate tail calls.",
    quick: [
      "Recursion often reads naturally for trees, divide-and-conquer algorithms, and backtracking.",
      "Iteration avoids one Python call frame per step and is safer for deep linear input.",
      "Python has a recursion limit to protect the interpreter stack; exceeding it raises `RecursionError`.",
      "Python does not perform automatic tail-call elimination, so tail recursion still consumes frames.",
      "An explicit stack can preserve depth-first order while moving depth state into controlled heap storage.",
    ],
    intent: {
      testing: "Whether the choice is based on problem shape, depth, space, and Python runtime behavior rather than style preference.",
      common_mistake: "Assuming a tail-recursive Python function runs in constant stack space.",
      to_stand_out: "Distinguish branching recursion that matches a tree from linear recursion that a loop expresses more safely.",
    },
    speaking: prose(
      "Recursion and iteration can express many of the same algorithms, but they store unfinished work differently. Recursion lets Python keep that work in function frames. Iteration keeps control in one frame and, when necessary, stores pending states in an explicit list or deque.",
      "Recursion is often clearest when the input has recursive structure. A tree node contains child subtrees, so a recursive depth-first traversal directly says: process the node, then traverse each child. Divide-and-conquer and backtracking can have the same match between the problem definition and the code. The benefit is clarity, not automatically better complexity.",
      "Python's boundary is depth. Every recursive call consumes interpreter-stack capacity, and `sys.getrecursionlimit()` reports the protective limit. A deeply skewed tree or a linked list built from untrusted input can exceed it and raise `RecursionError`. Python also does not automatically eliminate tail calls, so rewriting the last action as a self-call does not make stack usage O(1). Increasing the limit is platform-sensitive and can risk a crash; it is not a general algorithmic fix.",
      "For example, summing ten values recursively is safe but adds ten frames without improving the model. A loop expresses the linear process with O(1) auxiliary state. For a tree of modest known depth, recursive DFS may remain simpler. If depth can be large, I use an explicit stack: it keeps the same traversal order, supports O(n) pending state when required, and is not constrained by the interpreter's call-depth limit."
    ),
    deepTitle: "Choose where unfinished work should live",
    deep: prose(
      "Both forms need to remember what remains. Recursive DFS stores a return point and locals in each frame. Iterative DFS stores nodes explicitly. The asymptotic pending-state space may be similar, but the explicit structure is visible, inspectable, and not tied to Python's recursion depth.",
      table(
        "| Concern | Recursive traversal | Iterative traversal |",
        "|---|---|---|",
        "| unfinished work | interpreter frames | explicit container |",
        "| naturally recursive tree | often concise | slightly more bookkeeping |",
        "| very deep chain | may raise `RecursionError` | handles depth subject to memory |",
        "| tail call | still adds a Python frame | loop stays in one frame |",
        "| custom pause/debug state | implicit in frames | directly inspectable |"
      ),
      "These two functions produce the same preorder for a small tree. Reversing children before pushing them preserves left-to-right processing because the explicit stack removes from the right.",
      python(
        "tree = (\"A\", [(\"B\", []), (\"C\", [(\"D\", [])])])",
        "",
        "def recursive_preorder(node):",
        "    value, children = node",
        "    result = [value]",
        "    for child in children:",
        "        result.extend(recursive_preorder(child))",
        "    return result",
        "",
        "def iterative_preorder(root):",
        "    result = []",
        "    stack = [root]",
        "    while stack:",
        "        value, children = stack.pop()",
        "        result.append(value)",
        "        stack.extend(reversed(children))",
        "    return result",
        "",
        "assert recursive_preorder(tree) == [\"A\", \"B\", \"C\", \"D\"]",
        "assert iterative_preorder(tree) == recursive_preorder(tree)"
      ),
      "Recursion can also revisit overlapping states and become slow; that is a separate issue from call depth. Memoization may fix repeated computation while leaving depth unchanged, so both time and stack safety need their own analysis."
    ),
    followups: [
      "Why does tail recursion still consume stack frames in Python?",
      "How can an explicit stack preserve the order of recursive depth-first traversal?",
      "Does memoization solve the recursion-depth problem?",
    ],
  },
  {
    topic: "basic-recursion",
    slug: "python-fibonacci-memoization-complexity",
    question: "Why is naive recursive Fibonacci slow, and how does memoization improve it?",
    title: "Recursive Fibonacci and Memoization",
    direct: "Naive recursive Fibonacci recomputes the same subproblems through two branches at most calls, producing exponential time and O(n) call depth. Memoization stores each `fib(k)` result once, reducing the work to O(n) time with O(n) cache space while the recursive version still uses O(n) stack depth.",
    quick: [
      "Naive `fib(n)` calls both `fib(n - 1)` and `fib(n - 2)`, causing overlapping subproblems.",
      "The naive call tree grows exponentially even though there are only `n + 1` distinct arguments.",
      "Memoization returns a stored result when the same argument appears again.",
      "A memoized recursive solution uses O(n) time, O(n) cache space, and O(n) call-stack depth.",
      "An iterative two-variable solution also uses O(n) time and reduces auxiliary space to O(1).",
    ],
    intent: {
      testing: "Whether overlapping subproblems, call-tree growth, caching, and the remaining stack cost are understood.",
      common_mistake: "Saying memoization makes the recursive version O(1) or removes its recursion depth.",
      to_stand_out: "Compare naive recursion, memoized recursion, and bottom-up iteration as three separate cost profiles.",
    },
    speaking: prose(
      "The Fibonacci recurrence defines `fib(n)` as `fib(n - 1) + fib(n - 2)`, with base values for zero and one. A direct recursive translation is mathematically clear, but it builds two branches for most calls. Those branches overlap: calculating `fib(5)` calculates `fib(3)` once through `fib(4)` and then calculates `fib(3)` again directly.",
      "As `n` grows, the naive call tree contains exponentially many calls, commonly bounded as O(2ⁿ), even though there are only `n + 1` distinct input values from zero through `n`. Its maximum depth is O(n), so its call-stack space is O(n).",
      "Memoization records the result for an argument after it is computed. Later calls for the same argument return from the cache instead of expanding another subtree. Python's `functools.cache` provides an unbounded memoizing wrapper backed by argument lookup. With caching, each distinct Fibonacci state is evaluated once, so time becomes O(n). The cache stores O(n) results and recursive calls can still reach depth O(n).",
      "For example, both branches requesting `fib(3)` share the cached value after the first computation. If only the final number is needed, a bottom-up loop can keep the previous two values and achieve O(n) time with O(1) auxiliary space. Memoization is most valuable when a natural recursive problem has overlapping subproblems and the cached states will be reused; it is not useful for recursion where every state is unique, and an unbounded cache needs a memory policy for long-lived, varied inputs."
    ),
    deepTitle: "Cache the small state graph instead of expanding the repeated call tree",
    deep: prose(
      "The naive execution is a tree of calls, but the underlying problem is a much smaller directed graph of distinct states. Both `fib(5)` and `fib(4)` may lead to `fib(3)`. Memoization collapses all requests for the same state into one computed node plus cheap lookups.",
      mermaid(
        "flowchart TD",
        "  F5[fib 5] --> F4[fib 4]",
        "  F5 --> F3[fib 3]",
        "  F4 --> F3",
        "  F4 --> F2[fib 2]",
        "  F3 --> F2",
        "  F3 --> F1[fib 1]",
        "  F2 --> F1",
        "  F2 --> F0[fib 0]"
      ),
      "The example counts actual function-body evaluations beneath `@cache`. Every argument from zero through ten is evaluated once, so there are eleven misses. Repeated calls to `fib(10)` then return from the wrapper's cache without incrementing the counter.",
      python(
        "from functools import cache",
        "",
        "evaluations = 0",
        "",
        "@cache",
        "def fib(number):",
        "    global evaluations",
        "    evaluations += 1",
        "    if number < 2:",
        "        return number",
        "    return fib(number - 1) + fib(number - 2)",
        "",
        "assert fib(10) == 55",
        "assert evaluations == 11",
        "assert fib(10) == 55",
        "assert evaluations == 11",
        "assert fib.cache_info().misses == 11"
      ),
      "Cache keys are function arguments, so they must be hashable. Cached results can also retain referenced objects. For a bounded, repeated state space that is ideal; for unlimited request-specific arguments, a bounded `lru_cache` or explicit lifecycle may be safer."
    ),
    followups: [
      "Why are there only O(n) distinct Fibonacci subproblems but exponentially many naive calls?",
      "Which costs remain O(n) after adding memoization to the recursive solution?",
      "When is an iterative Fibonacci implementation preferable to a cached recursive one?",
    ],
  },
  {
    topic: "hash-table-concept",
    slug: "python-dict-set-hash-table-lookup",
    question: "How do Python dictionaries and sets use hashing for fast lookup?",
    title: "Hash-Table Lookup in Python Dictionaries and Sets",
    direct: "A dictionary hashes a key and a set hashes an element to narrow lookup to a small candidate area, then uses equality to confirm a match. This provides average O(1) lookup, insertion, and deletion with extra table memory, while collisions, resizing, and adversarial cases mean O(1) is not a per-operation worst-case guarantee.",
    quick: [
      "A dictionary hashes keys; a set hashes its elements.",
      "The hash narrows the search, and equality confirms whether a candidate is the requested object.",
      "Lookup, insertion, and deletion are average O(1), not guaranteed O(1) for every possible case.",
      "Hash tables use extra memory and occasionally resize to preserve efficient lookup.",
      "Use a dictionary for key-to-value relationships and a set for unique membership only.",
    ],
    intent: {
      testing: "Whether average constant-time lookup is explained through both hashing and equality with honest boundaries.",
      common_mistake: "Saying a hash uniquely identifies the key or that collisions cannot occur.",
      to_stand_out: "Explain why hash and equality are both required and separate dictionary values from set membership.",
    },
    speaking: prose(
      "A dictionary and a set are hash-based collections. A dictionary stores unique keys with associated values, while a set stores only distinct elements. For lookup, Python computes the hash of the requested key or element to narrow the search to a small part of an internal table. It then compares candidate objects for equality before declaring a match.",
      "Equality is essential because different objects can have the same hash, which is called a collision. The table has a collision-resolution strategy, so a collision does not mean data is overwritten. With suitable hashes and normal table occupancy, lookup, insertion, and deletion are average O(1). The structure uses extra memory and may occasionally resize, and deliberately poor or adversarial collisions can make an operation slower, so average is the accurate guarantee.",
      "For example, a list of one million users normally needs a linear scan to find ID 42. Building `users_by_id = {user.id: user for user in users}` costs O(n) once, then repeated ID lookups are average O(1). A set is enough when the only question is whether an ID is blocked; a dictionary is needed when the lookup must return the user record.",
      "Modern Python dictionaries also preserve insertion order, but that is an iteration guarantee rather than the reason lookup is fast. Keys and set elements must be hashable so their hash remains stable while stored. I choose a hash table when repeated keyed access or membership justifies its memory and construction cost, and keep a list when position, duplicates, or a one-time small scan is the actual requirement."
    ),
    deepTitle: "A hash proposes a location; equality proves the key",
    deep: prose(
      "A hash value is not a unique ID. It compresses a very large key space into a finite integer range, so collisions are unavoidable in principle. The table uses the hash to decide where to begin looking and stores enough key information to run equality on candidates.",
      mermaid(
        "flowchart LR",
        "  K[requested key] --> H[compute hash]",
        "  H --> C[choose candidate position]",
        "  C --> E{candidate key equals request?}",
        "  E -- yes --> V[return value or membership]",
        "  E -- collision --> P[probe another candidate]",
        "  P --> E"
      ),
      "The custom key class below forces every instance to return the same hash. The dictionary still keeps two unequal keys and retrieves both correctly, proving that collision handling includes equality. It is intentionally a bad hash function for teaching, not a pattern to copy.",
      python(
        "class CollidingKey:",
        "    def __init__(self, label):",
        "        self.label = label",
        "",
        "    def __hash__(self):",
        "        return 7",
        "",
        "    def __eq__(self, other):",
        "        return isinstance(other, CollidingKey) and self.label == other.label",
        "",
        "first = CollidingKey(\"first\")",
        "second = CollidingKey(\"second\")",
        "mapping = {first: 10, second: 20}",
        "assert len(mapping) == 2",
        "assert mapping[CollidingKey(\"first\")] == 10",
        "assert mapping[CollidingKey(\"second\")] == 20"
      ),
      "A table resize changes internal placement but not the collection's logical contents. Application code should depend on mapping and membership behavior, not bucket counts or positions, which are implementation details."
    ),
    followups: [
      "Why does Python still check equality after computing a hash?",
      "When does the O(n) cost of building a set or dictionary pay off?",
      "What information does a dictionary store that a set does not?",
    ],
  },
  {
    topic: "hash-table-concept",
    slug: "python-hashable-keys-equality-collisions",
    question: "What makes an object hashable, and how do equality and mutation affect dictionary keys?",
    title: "Hashable Keys, Equality, and Mutation",
    direct: "An object is hashable when its hash value remains stable during its lifetime and it supports equality, with the rule that objects that compare equal must have the same hash. Hashability allows dictionary-key and set membership use; mutable containers such as lists and dictionaries are unhashable because value mutation would break stable lookup.",
    quick: [
      "A hashable object's hash must not change during its lifetime.",
      "Objects that compare equal must produce the same hash value.",
      "Strings, numbers, and tuples containing only hashable elements are common hashable values.",
      "Lists, dictionaries, and sets are mutable containers and cannot be dictionary keys or set elements.",
      "For custom value objects, `__eq__` and `__hash__` must describe the same stable identity fields.",
    ],
    intent: {
      testing: "Whether key validity is connected to the hash/equality contract and stable object state.",
      common_mistake: "Equating immutable with automatically hashable or defining equality for a custom class without a compatible hash policy.",
      to_stand_out: "Explain why a tuple is hashable only when all of its elements are hashable and why key fields must not mutate.",
    },
    speaking: prose(
      "Python calls an object hashable when it has a hash value that remains stable during its lifetime and can be compared for equality. There is also a consistency rule: if two objects compare equal, they must return the same hash. Dictionaries and sets rely on that contract to find an object again after storing it.",
      "Common immutable built-ins such as strings and integers are hashable. A tuple is hashable only if every element inside it is hashable; `(\"IN\", 560001)` can be a key, while `([1, 2], 3)` cannot because it contains a list. Mutable containers such as lists, dictionaries, and sets are unhashable. If their value determined their hash and then changed, lookup could begin in a different table location from the one where they were stored.",
      "For example, coordinates can be stored as tuple keys: `temperatures[(12.9, 77.6)] = 24`. An equal tuple later computes a compatible hash and finds the value. A list coordinate is rejected with `TypeError` rather than allowing an unstable key into the mapping.",
      "Custom classes need the same care. A frozen dataclass can derive equality and hashing from fields that cannot be reassigned, making it suitable as a value key when those fields are themselves hashable. A mutable domain object is often better keyed by a stable ID than by all of its changing attributes. Hash equality does not mean object identity, and a collision between unequal objects is allowed. The conclusion is that keys should represent stable value identity, with equality and hashing defined from the same fields."
    ),
    deepTitle: "Stable lookup requires one contract across storage and retrieval",
    deep: prose(
      "A dictionary first stores a key according to its hash and later repeats the same process during lookup. If an identity field changed the hash in between, the lookup could search a different path even though the original object is still present. Python prevents this for built-in mutable containers by making them unhashable.",
      table(
        "| Candidate key | Hashable? | Reason |",
        "|---|---|---|",
        "| `\"user-42\"` | yes | immutable string value |",
        "| `(\"IN\", 560001)` | yes | tuple elements are hashable |",
        "| `(\"tags\", [1, 2])` | no | nested list is unhashable |",
        "| `frozenset({\"a\", \"b\"})` | yes | immutable set of hashable elements |",
        "| `{\"id\": 42}` | no | mutable dictionary |"
      ),
      mermaid(
        "flowchart LR",
        "  K[key value] --> H[compute stable hash]",
        "  H --> T[store along table path]",
        "  K --> E[equality contract]",
        "  E --> R[equal keys must share that hash path]",
        "  T --> R"
      ),
      "This frozen value object has a stable equality/hash contract generated from its fields. Two separate instances with equal fields address one dictionary entry. The example also proves that a tuple does not become hashable merely because the outer tuple is immutable.",
      python(
        "from dataclasses import dataclass",
        "",
        "@dataclass(frozen=True)",
        "class Coordinate:",
        "    latitude: int",
        "    longitude: int",
        "",
        "first = Coordinate(12, 77)",
        "same_value = Coordinate(12, 77)",
        "temperatures = {first: 24}",
        "assert first is not same_value",
        "assert first == same_value",
        "assert hash(first) == hash(same_value)",
        "assert temperatures[same_value] == 24",
        "",
        "try:",
        "    hash((\"tags\", [1, 2]))",
        "except TypeError:",
        "    pass",
        "else:",
        "    raise AssertionError(\"a tuple containing a list must be unhashable\")"
      ),
      "Even a frozen wrapper can contain a field whose type is unhashable, so value design still matters. Hashability is a property of the complete object and its equality contract, not just an `immutable` label."
    ),
    followups: [
      "Why is a tuple containing a list not hashable?",
      "What rule must hold when two custom objects compare equal?",
      "Why is a stable ID often safer than mutable business fields as a dictionary key?",
    ],
  },
  {
    topic: "hash-table-concept",
    slug: "python-frequency-map-two-sum-linear-time",
    question: "How do frequency maps and seen maps turn repeated searches into linear-time algorithms?",
    title: "Frequency Maps, Seen Maps, and Linear-Time Lookup Patterns",
    direct: "A frequency map records how many times each value appears, while a seen map or set records values already processed, optionally with metadata such as an index. Building the index in one pass and using average O(1) hash lookup replaces repeated O(n) scans, often reducing an O(n²) nested-search solution to average O(n) time with O(n) space.",
    quick: [
      "Use a frequency dictionary when occurrence counts affect the answer.",
      "Use a set for seen membership and a dictionary when the matched value needs metadata such as an index.",
      "For each item, query the needed key before or after insertion according to whether self-matching is allowed.",
      "A one-pass hash pattern is average O(n) time and O(n) auxiliary space.",
      "Duplicates, complement order, and the required output determine what the map must store.",
    ],
    intent: {
      testing: "Whether hash lookup can be turned into a concrete invariant rather than cited as a vague optimization.",
      common_mistake: "Storing the current two-sum value before checking its complement and accidentally reusing one element when the target is twice that value.",
      to_stand_out: "State exactly what the map represents after each iteration and retain only metadata required by the output.",
    },
    speaking: prose(
      "A frequency map and a seen map are two hash-table patterns for avoiding repeated scans. A frequency map stores `value → count`, which answers questions about duplicates, anagrams, or matching quantities. A seen set stores only membership. A seen dictionary stores metadata such as the first index where a value appeared.",
      "The optimization comes from reusing an index. A brute-force two-sum solution checks each pair and takes O(n²) time. In a one-pass solution, when the current value is `x`, calculate `target - x` and ask whether that complement is already in a dictionary. Dictionary lookup is average O(1), so processing all `n` values is average O(n), with up to O(n) auxiliary space.",
      "For example, with `[2, 7, 11, 15]` and target `9`, the map is empty at index zero, so it stores `2 → 0`. At index one, the complement of 7 is 2, which is already stored, and the answer is indexes `(0, 1)`. Checking before insertion prevents one value from matching itself unless an earlier duplicate exists. For `[3, 3]` and target `6`, the second 3 correctly finds the first.",
      "The map's value should match the required output. A boolean membership question needs a set; returning indexes needs a dictionary; comparing multiplicities needs counts. Average O(1) hashing and extra memory are the stated trade-offs. The reusable reasoning is to identify the repeated lookup question, build exactly that lookup state during one pass, and maintain a clear invariant about what earlier input the table contains."
    ),
    deepTitle: "Turn the inner search into one maintained lookup invariant",
    deep: prose(
      "The brute-force inner loop asks the same kind of question repeatedly: has a matching value appeared elsewhere? A map stores the answers discovered so far. For one-pass two-sum, the invariant before index `i` is: the dictionary maps every earlier value that has been retained to an earlier index.",
      table(
        "| Index | Current | Needed complement | Seen before check | Result/action |",
        "|---:|---:|---:|---|---|",
        "| 0 | 2 | 7 | `{}` | store `2: 0` |",
        "| 1 | 7 | 2 | `{2: 0}` | return `(0, 1)` |"
      ),
      mermaid(
        "flowchart LR",
        "  V[read current value] --> C[calculate needed complement]",
        "  C --> Q{complement already seen?}",
        "  Q -->|yes| R[return earlier and current indexes]",
        "  Q -->|no| S[store current value and index]",
        "  S --> V"
      ),
      "This implementation preserves the first index of a value by using `setdefault`. Keeping the first is not required for finding any pair, but it gives deterministic earliest metadata. The function returns `None` when no pair exists and never uses the same position twice.",
      python(
        "def two_sum(values, target):",
        "    first_index = {}",
        "    for index, value in enumerate(values):",
        "        complement = target - value",
        "        if complement in first_index:",
        "            return first_index[complement], index",
        "        first_index.setdefault(value, index)",
        "    return None",
        "",
        "assert two_sum([2, 7, 11, 15], 9) == (0, 1)",
        "assert two_sum([3, 3], 6) == (0, 1)",
        "assert two_sum([1, 2, 3], 99) is None"
      ),
      "A precomputed frequency map uses a related but different invariant: it represents the entire input, so consuming matches may require decrementing counts. Choose one-pass seen state or whole-input counts according to whether order and multiplicity affect the result."
    ),
    followups: [
      "Why should a one-pass two-sum solution check the complement before storing the current value?",
      "When is a set sufficient, and when must the map keep counts or indexes?",
      "What space-time trade-off does the lookup table introduce?",
    ],
  },
];

// Remaining topics are appended below in this file so the curriculum is kept in
// the same order as the canonical module index.

function countWords(value) {
  return String(value)
    .replace(/```[\s\S]*?```/g, " ")
    .replace(/[`*_#>|~-]/g, " ")
    .split(/\s+/)
    .filter(Boolean).length;
}

function makeQuestion(definition, order) {
  return {
    id: `dsa-basics-python-${definition.topic}-q${String(order).padStart(3, "0")}`,
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
        {
          type: "key_points",
          title: "Quick revision",
          items: definition.quick,
        },
        {
          type: "speakable_answer",
          title: "Interview answer",
          answerSize: "standard",
          content: interviewProse(definition.speaking),
        },
        {
          type: "deep_explanation",
          title: definition.deepTitle,
          content: definition.deep,
        },
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
  if (definitions.length !== 18) problems.push(`Expected 18 questions; found ${definitions.length}`);
  for (const topic of topicOrder) {
    const count = definitions.filter((definition) => definition.topic === topic).length;
    if (count !== 3) problems.push(`${topic} must contain exactly 3 questions; found ${count}`);
  }

  const slugs = new Set();
  for (const definition of definitions) {
    if (slugs.has(definition.slug)) problems.push(`Duplicate slug: ${definition.slug}`);
    slugs.add(definition.slug);
    if (definition.direct.length < 80) problems.push(`Direct answer too short: ${definition.slug}`);
    if (definition.quick.length < 3 || definition.quick.length > 6) {
      problems.push(`Quick revision count invalid: ${definition.slug}`);
    }
    const speakingWords = countWords(definition.speaking);
    if (speakingWords < 220 || speakingWords > 420) {
      problems.push(`Interview answer word count ${speakingWords}: ${definition.slug}`);
    }
    if (!definition.deep.includes("```python")) problems.push(`Missing Python example: ${definition.slug}`);
    if (!definition.deep.includes("```mermaid") && !definition.deep.includes("|---")) {
      problems.push(`Missing process or relationship visual: ${definition.slug}`);
    }
    if (definition.followups.length < 2) problems.push(`Missing follow-ups: ${definition.slug}`);
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
  const parsedIndex = JSON.parse(rawIndex);
  const previous = parsedIndex.modules.find((entry) => entry.moduleSlug === "dsa-basics-python");
  if (!previous) throw new Error("Missing canonical dsa-basics-python index entry");
  const intro = "Learn the data-structure and algorithm foundations expected in Python fresher interviews through 18 focused lessons. The module connects growth rates to real Python operations, explains list and linked-list trade-offs, applies stacks and queues to concrete problems, traces recursion and memoization, and uses dictionaries and sets for linear-time lookup patterns. Every lesson separates a short revision, a complete interview-ready explanation, and an independent visual Deep Dive with executable Python.";
  const moduleEntry = { ...previous, intro, questionCount: 18 };
  fs.writeFileSync(indexPath, replaceIndexedModule(rawIndex, moduleEntry));
  fs.writeFileSync(path.join(moduleRoot, "_config.json"), `${JSON.stringify({ ...moduleEntry, visible: true }, null, 2)}\n`);

  const revision = {
    title: "Data Structures & Algorithm Basics — Revision",
    estimatedMinutes: 30,
    lastUpdated: today,
    status: "gold-standard",
    questionCount: 18,
    sections: [
      {
        id: "choose-by-operation",
        title: "Choose a structure by the operation you need",
        body: "A list gives order and indexed access. A linked list makes node-to-node relationships explicit. A stack keeps the newest item first, a queue keeps the oldest item first, and a hash table trades memory for fast average key or membership lookup.",
      },
      {
        id: "complexity-model",
        title: "Explain where the work comes from",
        body: "Name the growing input, then connect cost to a scan, shift, resize, recursive call, or hash lookup. State whether a result is worst-case, average-case, or amortized, and count auxiliary collections and call frames.",
      },
      {
        id: "python-boundaries",
        title: "Keep Python-specific boundaries accurate",
        body: "CPython lists behave as resizable arrays; deque is designed for fast operations at both ends; dictionary and set lookup is average O(1); recursion consumes interpreter-stack depth; and mutable containers are not hashable keys.",
      },
      {
        id: "verify-the-algorithm",
        title: "Verify with a trace and an invariant",
        body: "Trace a tiny input that exposes the rule, state what remains true after every step, and test empty, single-item, duplicate, missing-target, and boundary inputs where they apply.",
      },
    ],
    notes: "Canonical M06 curriculum: three distinct gold-standard questions for every declared topic; generated shell variants are intentionally excluded.",
  };
  fs.writeFileSync(path.join(moduleRoot, "_revision.json"), `${JSON.stringify(revision, null, 2)}\n`);

  console.log(`Wrote ${definitions.length} gold-standard questions across ${topicOrder.length} topics.`);
}

writeModule();
