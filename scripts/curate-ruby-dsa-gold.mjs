#!/usr/bin/env node

import fs from "node:fs";
import path from "node:path";

const root = "content/ruby-backend-fresher/dsa-ruby-basics";
const fence = (language, lines) => `\`\`\`${language}\n${lines.join("\n")}\n\`\`\``;

const lessons = {
  "ruby-arrays-hashes-problems-basics": {
    answerSize: "standard",
    direct: "Use an Array when order, position, or repeated values are part of the problem; use a Hash when the next decision needs a fast lookup by key. A common interview transformation is to scan an array once while a hash remembers what has already been seen—for example, value to index, item to count, or prefix value to position. This often changes a repeated linear search from quadratic time to expected linear time at the cost of linear extra space.",
    quick: [
      "Arrays preserve sequence and give direct access by integer index.",
      "Hashes map unique keys to values for expected fast lookup.",
      "Store only the fact the next iteration needs: index, count, or last position.",
      "Check the required complement before storing the current item when indices must differ.",
      "A one-pass hash solution often trades O(n) extra space for expected O(n) time.",
    ],
    interview: [
      "- Arrays and hashes solve different access problems. An Array is the natural input when order and index matter. A Hash is useful when the algorithm repeatedly asks “have I seen this key?” or “what value belongs to this key?” without scanning all earlier elements again.",
      "- The pattern is to decide what fact must survive from one iteration to the next. For duplicate detection the hash can act as a set; for frequency problems it maps value to count; for two-sum it can map a seen value to its index. The stored value should have a clear purpose rather than copying the entire input.",
      "- For example, with numbers `[4, 7, 1, 9]` and target `10`, I scan from left to right. At `4`, the complement `6` is absent, so I remember `4 => 0`. At `7`, `3` is absent. At `1`, complement `9` has not appeared yet. At `9`, complement `1` maps to index 2, so the answer is `[2, 3]`.",
      "- Checking before insertion prevents one element from matching itself when the target is twice its value. If duplicates are allowed, the stored index also determines which valid pair is returned. A two-pass design can work, but it needs an explicit rule to avoid reusing the same index.",
      "- The nested-search version takes O(n²) time in the worst case. The hash scan uses expected O(n) time and O(n) additional space in normal Ruby implementations. I would state that trade-off, then test no solution, duplicates, negative values, and a pair whose members appear in either order.",
    ],
    deepTitle: "Turn repeated search into remembered state",
    deep: [
      "Start by writing the question asked inside the loop. If every current value triggers a scan of all previous values, that repeated search is the likely bottleneck. A lookup structure can replace it only when the earlier data can be represented by a stable key.",
      "In two-sum, the current number `x` needs to know whether `target - x` appeared earlier. The invariant after processing position `i` is that the hash contains exactly the values from positions before the next index, paired with enough information to build the answer. This invariant explains both correctness and the order of check then store.",
      "A Hash is not automatically the right choice. If sorted output, adjacent order, or every duplicate occurrence matters, an array may remain the primary structure and the hash only an index. Hash lookup is expected constant time for ordinary keys, but memory, hashing cost, and hostile collision behaviour still exist.",
      "Ruby details matter at the boundary. `hash[key]` returns the configured default for a missing key, often nil; `fetch(key)` distinguishes absence by raising or using an explicit fallback. When nil is a valid stored value, `key?` or `fetch` avoids confusing a present nil with a missing key.",
    ],
    visualType: "comparison_table",
    visualTitle: "One-pass two-sum state",
    visual: "| Index | Current | Needed | Seen before check | Decision |\n|---:|---:|---:|---|---|\n| 0 | 4 | 6 | `{}` | store `4 → 0` |\n| 1 | 7 | 3 | `{4}` | store `7 → 1` |\n| 2 | 1 | 9 | `{4, 7}` | store `1 → 2` |\n| 3 | 9 | 1 | `{4, 7, 1}` | return indices `2, 3` |",
    codeTitle: "Find two distinct indices in one pass",
    code: [
      "def two_sum_indices(numbers, target)",
      "  index_by_value = {}",
      "",
      "  numbers.each_with_index do |number, index|",
      "    needed = target - number",
      "    return [index_by_value.fetch(needed), index] if index_by_value.key?(needed)",
      "",
      "    index_by_value[number] = index",
      "  end",
      "",
      "  nil",
      "end",
      "",
      "raise unless two_sum_indices([4, 7, 1, 9], 10) == [2, 3]",
      "raise unless two_sum_indices([5, 5], 10) == [0, 1]",
      "raise unless two_sum_indices([1, 2], 9).nil?",
    ],
    followups: [
      "Why must the complement be checked before the current value is stored?",
      "When do `Hash#key?` and `Hash#fetch` avoid a missing-key bug?",
      "How would the solution change if every valid pair were required?",
    ],
  },
  "ruby-string-manipulation-basics": {
    answerSize: "compact",
    direct: "A Ruby String is a mutable, encoding-aware sequence of bytes that provides character-oriented and byte-oriented operations. Use non-bang methods such as `strip`, `downcase`, and `gsub` when a new value is clearer; use their bang counterparts only when in-place change is intentional. For interview problems, first define normalization and whether positions mean bytes, codepoints, or user-visible grapheme clusters, then choose iteration and comparison methods that match that definition.",
    quick: [
      "Ruby strings are mutable unless frozen and each string carries an encoding.",
      "Non-bang transformations return a new string; many bang forms modify the receiver.",
      "`bytesize`, `length`, `chars`, and `grapheme_clusters` answer different questions.",
      "Define case, whitespace, punctuation, and Unicode normalization before comparing text.",
      "Build repeated output with an Array plus `join` or deliberate mutation when scale matters.",
    ],
    interview: [
      "- Ruby's String represents text as bytes interpreted through an encoding, and the object is mutable unless it has been frozen. That means a string problem must define both the logical transformation and whether changing the original value is allowed.",
      "- Common methods form a pipeline: `strip` removes surrounding whitespace, `downcase` changes case, `gsub` replaces a pattern, `split` creates pieces, and `join` combines them. Non-bang versions normally return another string, while methods such as `gsub!` or `upcase!` can change the receiver and may return nil when no change was made.",
      "- For example, a phrase palindrome can be defined as case-insensitive and limited to letters and digits. I can normalize with `downcase.gsub(/[^a-z0-9]/, '')`, then compare that value with its reverse. The rule is explicit, so punctuation and spaces are not handled accidentally.",
      "- Unicode is the important boundary. A UTF-8 character can occupy several bytes, and a visible symbol can contain several codepoints. `bytesize` is therefore not always equal to `length`, and byte slicing can cut through a character. Requirements involving user-visible characters may need normalization or grapheme-cluster handling rather than an ASCII regular expression.",
      "- I keep normalization separate from the core comparison, avoid mutating caller-owned input without a clear contract, and test empty text, mixed case, punctuation, and non-ASCII examples that match the product's definition of a character.",
    ],
    deepTitle: "Define the text model before choosing a string method",
    deep: [
      "The word “character” is ambiguous in software. Ruby can expose raw bytes, encoded codepoints through character iteration, and grapheme clusters that better approximate what a user sees. ASCII interview inputs hide this difference, so state the assumed alphabet and revisit it when the requirement includes international text.",
      "Mutation creates aliasing risk. If two variables refer to the same String, a bang method through one reference changes what the other sees. Returning a normalized copy gives a simple functional boundary; deliberate in-place work can reduce allocations when ownership is clear and measurement shows it matters.",
      "Repeated concatenation deserves attention in larger transformations. Appending to one owned buffer is different from constructing a fresh intermediate value for every step. An array of fragments followed by `join` also makes the intended pieces visible and avoids accidental separator rules.",
      "Regular expressions are concise for patterns, but their character classes reflect the pattern written. `[a-z]` is an ASCII rule, not a definition of every letter. A production text feature should select case folding, normalization, locale, and allowed-character behaviour deliberately instead of inheriting them from a convenient one-line solution.",
    ],
    visualType: "comparison_table",
    visualTitle: "Choose the unit that matches the requirement",
    visual: "| Question | Ruby operation | Result for `€` in UTF-8 |\n|---|---|---|\n| How many stored bytes? | `bytesize` | `3` |\n| Which integer bytes? | `bytes` | `[226, 130, 172]` |\n| How many encoded characters? | `length` | `1` |\n| Which character strings? | `chars` | `[\"€\"]` |\n| What does the user see? | `grapheme_clusters` | one cluster here; complex symbols may differ |",
    codeTitle: "Make the palindrome rule explicit",
    code: [
      "def ascii_phrase_palindrome?(text)",
      "  normalized = text.downcase.gsub(/[^a-z0-9]/, '')",
      "  normalized == normalized.reverse",
      "end",
      "",
      "raise unless ascii_phrase_palindrome?('Never odd or even')",
      "raise unless ascii_phrase_palindrome?('A man, a plan, a canal: Panama!')",
      "raise if ascii_phrase_palindrome?('Ruby')",
      "",
      "euro = '€'",
      "raise unless euro.length == 1 && euro.bytesize == 3",
    ],
    followups: [
      "Why can `bytesize` differ from `length` in a Ruby String?",
      "What surprising return value can a bang string method have?",
      "How would a Unicode-aware palindrome definition differ from the ASCII example?",
    ],
  },
  "ruby-two-pointers-basics": {
    answerSize: "standard",
    direct: "Two pointers are two indices that move through one or two sequences while preserving an invariant, so the algorithm can discard impossible candidates without testing every pair. In a sorted two-sum problem, compare the values at the ends: a sum that is too small can only improve by moving the left pointer right, and a sum that is too large can only improve by moving the right pointer left. This gives O(n) scanning after any required sort.",
    quick: [
      "Two pointers work when movement can safely eliminate a range of candidates.",
      "Sorted pair-sum uses one pointer at each end of the array.",
      "Move left for a small sum, right for a large sum, and stop on equality.",
      "The invariant—not the number of loops—proves no answer was skipped.",
      "Sorting may add O(n log n) time and can lose original indices unless preserved.",
    ],
    interview: [
      "- The two-pointer technique keeps two positions in a sequence and moves one or both according to information gained from the current comparison. It is useful only when that movement rules out candidates safely; sorted order, opposite ends, or a maintained window often provides that property.",
      "- In sorted two-sum, the left pointer starts at the smallest value and the right pointer at the largest. If their sum equals the target, the pair is found. If the sum is too small, keeping the same left value with any smaller right value cannot help, so left moves right. If it is too large, right moves left by the symmetric argument.",
      "- For example, for `[1, 3, 4, 6, 8]` and target 10, `1 + 8` is 9, so left advances. `3 + 8` is 11, so right retreats. `3 + 6` is 9, so left advances again. `4 + 6` is 10, and the algorithm returns that pair.",
      "- Each pointer moves in only one direction and at most n positions, so the scan is O(n) time and O(1) extra space. If the input is not sorted, sorting first costs O(n log n), returns a changed order unless a copy is used, and requires carrying original indices when the result asks for them.",
      "- Two pointers are not a magic replacement for nested loops. Without a monotonic rule, moving one side may discard a valid pair. I would state the invariant, trace crossing and duplicate cases, and distinguish an expanding or shrinking window from pointers that simply move toward each other.",
    ],
    deepTitle: "Pointer movement is a proof that discarded pairs cannot work",
    deep: [
      "At any step, the active search space contains pairs whose left index is at least `left` and whose right index is at most `right`. Sorted order gives the current boundary values meaning. A too-small sum eliminates every pair using the current left value, because all alternative right values are no larger.",
      "This elimination proof is why the algorithm is linear. Although the code has a loop and evaluates pairs, it never moves a pointer backward. The total number of pointer moves is bounded by the array length rather than multiplied into all possible pairs.",
      "Other patterns need different invariants. Same-direction pointers can compact an array or remove duplicates while one marks the read position and one the write position. A sliding window adds and removes items while maintaining a condition over a contiguous range. Calling all of them two pointers is convenient, but their movement proofs are not interchangeable.",
      "Output requirements affect preparation. Sorting a copy is harmless when values alone are returned. Original indices require sorting value-index pairs or using a hash-based alternative. Inputs that arrive already sorted expose the strongest reason to prefer the constant-space pointer scan.",
    ],
    visualType: "comparison_table",
    visualTitle: "Trace the shrinking candidate range",
    visual: "| Step | Left value | Right value | Sum | Eliminated move |\n|---:|---:|---:|---:|---|\n| 1 | 1 | 8 | 9 | move left; no pair with `1` can reach 10 |\n| 2 | 3 | 8 | 11 | move right; no pair with `8` can fall to 10 using this left range |\n| 3 | 3 | 6 | 9 | move left |\n| 4 | 4 | 6 | 10 | pair found |",
    codeTitle: "Find a target pair in a sorted array",
    code: [
      "def pair_with_sum(sorted_numbers, target)",
      "  left = 0",
      "  right = sorted_numbers.length - 1",
      "",
      "  while left < right",
      "    sum = sorted_numbers[left] + sorted_numbers[right]",
      "    return [sorted_numbers[left], sorted_numbers[right]] if sum == target",
      "",
      "    sum < target ? left += 1 : right -= 1",
      "  end",
      "",
      "  nil",
      "end",
      "",
      "raise unless pair_with_sum([1, 3, 4, 6, 8], 10) == [4, 6]",
      "raise unless pair_with_sum([2, 2], 4) == [2, 2]",
      "raise unless pair_with_sum([1, 2, 3], 20).nil?",
    ],
    followups: [
      "What invariant justifies moving the left pointer after a small sum?",
      "How do you preserve original indices if sorting is required?",
      "How is a sliding window different from opposite-end two pointers?",
    ],
  },
  "ruby-basic-sorting-basics": {
    answerSize: "compact",
    direct: "`Array#sort` returns a sorted copy, while `sort!` changes the receiver. Both use the elements' `<=>` comparison by default or a block that returns a negative number, zero, or a positive number. `sort_by` computes one key per element and sorts by those keys, which is clearer and often more efficient when key calculation is non-trivial. For interview analysis, treat general comparison sorting as O(n log n), while noting Ruby's documentation does not promise one specific sorting algorithm or stability guarantee.",
    quick: [
      "`sort` returns a new array; `sort!` mutates the existing array.",
      "A `sort` block compares two elements and returns negative, zero, or positive.",
      "`sort_by` extracts one sortable key per element before ordering.",
      "Use compound keys such as `[score, name]` for deterministic tie-breaking.",
      "State O(n log n) for comparison sorting, but do not promise undocumented stability.",
    ],
    interview: [
      "- Ruby arrays provide `sort`, `sort!`, `sort_by`, and `sort_by!`. `sort` leaves the original array unchanged and returns an ordered array; `sort!` replaces the receiver's order. Without a block, elements are compared through `<=>` and must be mutually comparable.",
      "- A `sort` block receives two elements and returns a negative value, zero, or a positive value. It is useful for direct comparisons such as descending numeric order. `sort_by` is better when each object has a key, because the block computes that key once per element and Ruby sorts the decorated values.",
      "- For example, `users.sort_by { |user| [-user.score, user.name] }` orders higher scores first and uses name as a deterministic tie-breaker. The array key is compared lexicographically, so the rule is visible without a long comparator block.",
      "- General comparison sorting is described as O(n log n) in normal interview analysis, plus O(n) key extraction for `sort_by`. Expensive comparison or key work affects the real cost. Ruby documentation does not make sorting stability a portable contract, so equal keys need an explicit secondary key when order matters.",
      "- I choose mutation only when the method owns the array and callers expect its order to change. Otherwise `sort` or `sort_by` gives a safer boundary. I also test duplicate keys, nil or mixed values, and ascending versus descending direction instead of assuming `<=>` can compare every input.",
    ],
    deepTitle: "Separate ordering policy, key extraction, and mutation",
    deep: [
      "An ordering policy must define how any relevant pair relates. Ruby's spaceship operator expresses less than, equal in ordering, or greater than. A comparator that contradicts itself can produce meaningless results, and a nil comparison signals values that do not share a valid ordering.",
      "Key extraction simplifies that policy. A record can be mapped to `[priority, created_at, id]`, and Array comparison applies each field until a difference appears. Adding a stable unique field at the end makes ties deterministic without relying on the sort implementation to preserve input order.",
      "`sort_by` uses extra memory to associate elements with computed keys. That trade is valuable when extracting the key is expensive because a comparator may otherwise repeat the work many times. For a trivial numeric reverse order, a direct comparator or an extracted negative key can both be readable.",
      "Sorting changes the problem's information. It enables binary search and monotonic pointer movement, but it can remove original positions and costs more than a linear scan. Before sorting, ask whether the required output needs input order, original indices, or only the ordered values.",
    ],
    visualType: "comparison_table",
    visualTitle: "Choose a Ruby sorting form by contract",
    visual: "| Method | Receiver changes? | Block meaning | Best fit |\n|---|---|---|---|\n| `sort` | no | compare two elements | sorted copy with custom relation |\n| `sort!` | yes | compare two elements | owned array may change |\n| `sort_by` | no | extract one key | records or costly key calculation |\n| `sort_by!` | yes | extract one key | owned array plus key ordering |\n| compound key | follows method | ordered tuple of fields | explicit tie-breakers |",
    codeTitle: "Sort records with an explicit tie-breaker",
    code: [
      "User = Struct.new(:name, :score)",
      "users = [",
      "  User.new('Mina', 8),",
      "  User.new('Ari', 10),",
      "  User.new('Zoe', 10)",
      "]",
      "",
      "ranked = users.sort_by { |user| [-user.score, user.name] }",
      "raise unless ranked.map(&:name) == ['Ari', 'Zoe', 'Mina']",
      "raise unless users.map(&:name) == ['Mina', 'Ari', 'Zoe']",
      "",
      "numbers = [3, 1, 2]",
      "numbers.sort!",
      "raise unless numbers == [1, 2, 3]",
    ],
    followups: [
      "Why can `sort_by` avoid repeated expensive key calculation?",
      "How do compound keys create deterministic tie-breaking?",
      "Why should Ruby code not rely on sorting equal keys being stable?",
    ],
  },
  "ruby-time-complexity-basics": {
    answerSize: "standard",
    direct: "Time complexity describes how the number of operations grows as input size grows; space complexity describes additional memory growth. Big O keeps the dominant growth term, so `3n + 20` is O(n), but it does not mean constants and built-in work are irrelevant in real code. In Ruby, count the cost of methods inside loops: an Array membership scan is O(n), while ordinary Hash or Set membership is expected O(1), so replacing repeated array search can change O(n²) work into expected O(n) with O(n) extra space.",
    quick: [
      "Define the input size and the operation being counted before giving Big O.",
      "Keep the dominant growth term, but remember constants still affect runtime.",
      "Sequential passes add; independent nested ranges multiply.",
      "Include hidden work in Ruby methods such as `include?`, `sort`, and string copies.",
      "Report auxiliary space and distinguish expected hash cost from a hard guarantee.",
    ],
    interview: [
      "- Time complexity is a growth model: it asks how work changes when input size n grows. Space complexity asks how much additional memory the algorithm needs beyond its input and required output. Big O provides an upper growth class, so a fixed number of full passes is still O(n), while testing every pair is O(n²).",
      "- I first define n and the dominant operation. Two loops are not automatically quadratic: consecutive loops add to O(n + n), and two pointers that only move forward can share O(n) total work. Nested loops multiply only when the inner range is repeated independently for each outer iteration.",
      "- Ruby's expressive methods still perform work. For example, `seen_array.include?(item)` scans up to n elements. Calling it for every input can be O(n²). Using a Hash or Set for membership gives expected constant-time lookup in ordinary conditions, making the complete scan expected O(n) while storing up to n keys.",
      "- Other hidden costs include sorting at roughly O(n log n) for interview reasoning, allocating arrays with `map` or `select`, copying substrings, and building intermediate chains. A short Ruby expression can therefore use more time or memory than a longer single-pass loop.",
      "- Complexity does not replace measurement or correctness. Small inputs may favour simpler code, hash operations have memory and key-cost overhead, and implementation details can vary. I state worst or expected case explicitly, include auxiliary space, and then test performance with realistic data if the choice matters in production.",
    ],
    deepTitle: "Count movements and hidden collection work, not lines of code",
    deep: [
      "Choose a size variable that represents the growing input: number of array elements, vertices and edges, rows and columns, or characters and bytes. Multiple dimensions should remain separate when they can grow independently; scanning every item from two arrays is O(n + m), not automatically O(n).",
      "Amortised analysis handles occasional expensive operations. Appending to a dynamic array may sometimes grow its storage and copy elements, but a sequence of appends can still have constant amortised cost per append. Expected analysis describes hash behaviour under ordinary distribution; it should be labelled rather than presented as an unconditional worst-case guarantee.",
      "Space needs the same care. A result array required by the question is output space, while a frequency hash is auxiliary space. Recursive call stacks, copied slices, decorated sort keys, and enumerator pipelines can all contribute even when no variable is named `buffer`.",
      "A useful optimisation removes the repeated dimension. The brute-force duplicate check compares each item with later items. A hash summary carries previous membership forward, so the algorithm pays once per element instead of restarting a search. The gain follows from preserved state, not from Ruby syntax alone.",
    ],
    visualType: "comparison_table",
    visualTitle: "Common Ruby operations in interview analysis",
    visual: "| Operation | Typical growth | Boundary |\n|---|---:|---|\n| Array index access | O(1) | valid integer position |\n| Array `include?` | O(n) | may scan the whole array |\n| Hash or Set lookup | expected O(1) | hashing and collision assumptions |\n| Full `map` or `select` | O(n) | normally allocates a result array |\n| General comparison sort | O(n log n) | implementation contract is not one fixed algorithm |\n| All unordered pairs | O(n²) | about n(n − 1)/2 comparisons |",
    codeTitle: "Replace repeated membership scans with remembered keys",
    code: [
      "def first_duplicate(values)",
      "  seen = {}",
      "",
      "  values.each do |value|",
      "    return value if seen.key?(value)",
      "    seen[value] = true",
      "  end",
      "",
      "  nil",
      "end",
      "",
      "# Expected O(n) time and O(n) auxiliary space.",
      "raise unless first_duplicate([7, 2, 5, 2, 9]) == 2",
      "raise unless first_duplicate([1, 2, 3]).nil?",
    ],
    followups: [
      "Why are two loops not always O(n²)?",
      "What is the difference between expected and amortised complexity?",
      "Which Ruby collection methods can hide allocation or repeated scanning?",
    ],
  },
  "ruby-coding-round-basics": {
    answerSize: "compact",
    direct: "A sound coding-round approach makes the problem testable before making it clever: restate the required input and output, clarify constraints, work one small example, describe a correct simple solution, identify its bottleneck, improve only when the constraints require it, then code in short verifiable steps. Finish by tracing normal and edge cases and stating time and auxiliary space. In Ruby, choose clear core collections and do not hide an unexplained algorithm behind a convenient built-in.",
    quick: [
      "Clarify inputs, output, constraints, invalid cases, and duplicate rules.",
      "Trace one normal example before choosing a data structure.",
      "State a correct baseline and name the repeated work before optimising.",
      "Code the invariant in small steps using clear Ruby collections.",
      "Dry-run edges and report time plus auxiliary space before finishing.",
    ],
    interview: [
      "- I treat a coding problem as a contract first. I restate what must be returned, ask about input size, ordering, duplicates, mutation, invalid input, and whether one or every solution is required. Those details can change the correct data structure and even the meaning of an example.",
      "- I then trace a small normal case and an edge case. For a first-duplicate problem, `[7, 2, 5, 2]` should return `2`, while `[1, 2, 3]` has no result. A direct pairwise search is correct but repeats membership work and can take O(n²).",
      "- For example, a one-pass hash can preserve all values already visited. Before storing each value, I check whether its key exists; if it does, the current index and value identify the first duplicate encountered from left to right. The invariant is that the hash contains exactly the earlier values.",
      "- I code that version with descriptive names, avoid unrelated abstractions, and talk through each branch while writing. Then I run the examples by hand, including an empty array, a duplicate at the end, repeated nil if nil is permitted, and an input with no duplicate. I fix correctness before polishing syntax.",
      "- Finally, I state expected O(n) time and O(n) auxiliary space and explain that the hash trades memory for removed rescanning. If the constraints are tiny, the simpler quadratic version may still be acceptable, but the chosen solution and its boundary are explicit.",
    ],
    deepTitle: "Use the constraint to justify every change in the solution",
    deep: [
      "Clarification reduces ambiguity, not time. Whether input is sorted can unlock binary search or two pointers; whether the array may be modified determines if in-place sorting is legal; whether original indices are required changes what must be stored. Writing those facts beside the example prevents solving a nearby but different problem.",
      "A baseline gives a correctness reference. Its bottleneck should be named as an operation, such as rescanning earlier values, sorting only to find a minimum, or copying a growing substring. An optimisation is justified when a data structure or invariant removes that operation without changing the contract.",
      "A dry run should track state, not narrate source code. A small table of index, current value, remembered keys, and decision exposes ordering mistakes and off-by-one errors. Edge cases should come from boundaries in the contract rather than a memorised list attached to every problem.",
      "Ruby can make an answer concise, but built-ins need explanation. `tally`, `sort`, `group_by`, or `bsearch` may be valid when their behaviour and cost match the constraint. Reimplementing every library method wastes time; invoking one without understanding its output, mutation, or complexity hides the reasoning being assessed.",
    ],
    visualType: "flow_diagram",
    visualTitle: "A coding answer from contract to verified complexity",
    visual: fence("mermaid", [
      "flowchart LR",
      "  C[clarify contract and constraints] --> E[trace small examples]",
      "  E --> B[state correct baseline]",
      "  B --> R[name repeated work]",
      "  R --> I[choose invariant and structure]",
      "  I --> K[code in verifiable steps]",
      "  K --> T[dry-run boundaries]",
      "  T --> X[state time and space]",
    ]),
    codeTitle: "Let the invariant guide the implementation",
    code: [
      "def first_duplicate(values)",
      "  seen = {}",
      "",
      "  values.each_with_index do |value, index|",
      "    return [index, value] if seen.key?(value)",
      "    seen[value] = true",
      "  end",
      "",
      "  nil",
      "end",
      "",
      "raise unless first_duplicate([7, 2, 5, 2]) == [3, 2]",
      "raise unless first_duplicate([nil, 1, nil]) == [2, nil]",
      "raise unless first_duplicate([]).nil?",
    ],
    followups: [
      "Which contract question most often changes the data structure you choose?",
      "How does an invariant make a dry run more useful than reading code aloud?",
      "When is a Ruby built-in appropriate in a coding round?",
    ],
  },
};

let curated = 0;
for (const topicDirectory of fs.readdirSync(root)) {
  const file = path.join(root, topicDirectory, "complete-qa.json");
  if (!fs.existsSync(file)) continue;
  const document = JSON.parse(fs.readFileSync(file, "utf8"));
  for (const [index, question] of document.questions.entries()) {
    const lesson = lessons[question.slug];
    if (!lesson) throw new Error(`${file}: no lesson for ${question.slug}`);
    question.direct_answer = lesson.direct;
    question.last_updated = "2026-09-07";
    question.reading_time_minutes = lesson.answerSize === "standard" ? 8 : 6;
    question.order = index + 1;
    question.answer = {
      ...(question.answer ?? {}),
      sections: [
        { type: "key_points", title: "Quick Revision", content: lesson.quick.map((point) => `- ${point}`).join("\n") },
        { type: "speakable_answer", title: "Interview Answer", answerSize: lesson.answerSize, content: lesson.interview.map((paragraph) => paragraph.replace(/^[-*+]\s+/, "")).join("\n\n") },
        { type: "deep_explanation", title: lesson.deepTitle, content: lesson.deep.join("\n\n") },
        { type: lesson.visualType, title: lesson.visualTitle, content: lesson.visual },
        { type: "code_example", title: lesson.codeTitle, content: fence("ruby", lesson.code) },
      ],
    };
    question.followup_questions = lesson.followups;
    question.seo = {
      ...(question.seo ?? {}),
      metaDescription: `Learn ${question.question} with a direct pattern, traced example, complexity boundary, and focused follow-up questions.`,
    };
    curated += 1;
  }
  fs.writeFileSync(file, `${JSON.stringify(document, null, 2)}\n`);
}

if (curated !== Object.keys(lessons).length) {
  throw new Error(`curated ${curated}/${Object.keys(lessons).length} Ruby DSA lessons`);
}

console.log(`Curated ${curated} canonical Ruby DSA questions.`);
