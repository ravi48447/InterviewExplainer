#!/usr/bin/env node

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const questionFile = path.join(
  repoRoot,
  "content/go-fresher/go-slices-maps/slice-internals-len-cap/complete-qa.json",
);
const fence = String.fromCharCode(96).repeat(3);

const lessons = {
  "go-slices-maps-slice-internals-len-cap-interview-basics": {
    directAnswer: "A Go slice is a view over part of an underlying array. Its length, returned by \u0060len(s)\u0060, is the number of elements currently accessible by index. Its capacity, returned by \u0060cap(s)\u0060, is the largest length the slice can reach by reslicing from its current starting position without changing storage. Capacity does not make an index legal; an index must be below length. An append that fits may reuse the backing array, while an append that exceeds capacity returns a slice using new storage.",
    quick: [
      "A slice describes a window over an underlying array rather than owning a fixed array value.",
      "\u0060len(s)\u0060 is the number of elements currently accessible through indexes \u00600\u0060 to \u0060len(s)-1\u0060.",
      "\u0060cap(s)\u0060 is the reslicing room from the slice's current start to its capacity limit.",
      "Capacity permits reslicing; it does not permit indexing beyond the current length.",
      "Append may reuse the array within capacity or return a slice backed by new storage.",
    ],
    beats: [
      {
        cue: "Define a slice as a view rather than a fixed array",
        stage: "A slice is an array window",
        spokenText: "A slice is a small Go value that describes a contiguous window over an underlying array. Its observable state includes where the window begins, how many elements are currently visible, and how far that window may extend. Assigning or subslicing normally copies this description, not the elements.",
      },
      {
        cue: "Explain why length controls every ordinary index",
        stage: "Length controls indexing",
        spokenText: "\u0060len(s)\u0060 is the number of elements in the visible window. Valid indexes run from \u00600\u0060 through \u0060len(s)-1\u0060. Even if extra backing-array storage exists, \u0060s[len(s)]\u0060 is out of range until the slice is extended or appended.",
      },
      {
        cue: "Define capacity from the current starting position",
        stage: "Capacity controls reslicing",
        spokenText: "\u0060cap(s)\u0060 is the largest length that this slice can reach by reslicing from its current start without crossing its capacity limit. With \u0060base := []int{10, 20, 30, 40, 50}\u0060 and \u0060s := base[1:3]\u0060, the slice has length two and capacity four.",
      },
      {
        cue: "Separate reslicing from indexing",
        stage: "Reslicing exposes capacity",
        spokenText: "The operation \u0060s = s[:4]\u0060 is valid in that example because four is within capacity. Afterward, length is four and all four elements are indexable. Capacity was permission to extend the view; it was not permission to read \u0060s[3]\u0060 before the reslice.",
      },
      {
        cue: "Connect capacity to append without promising an algorithm",
        stage: "Append may change storage",
        spokenText: "An append that fits within available capacity may reuse the same backing array, so aliases can observe its writes. When the result needs more capacity, \u0060append\u0060 obtains storage and returns an updated slice. Always keep the returned slice, and do not depend on a particular growth amount.",
        recallRule: "Length is what can be indexed now; capacity is how far the same window can reslice before it needs different storage.",
      },
    ],
    overview: {
      title: "The visible window and its remaining room",
      content: "A slice does not contain its elements inline in the way an array value does. It describes access to a range of an underlying array. The length records how much of that range is currently visible. The capacity records how far the visible range may be extended from the same starting position before crossing its limit.\n\nStarting position matters. If a five-element slice is cut with \u0060base[1:3]\u0060, the result begins at the second array element. Its length is two, but its capacity can extend only from that new start to the end available through the source. The element before the start is not part of its capacity.\n\nIndexing and reslicing ask different questions. Indexing requires an index below the current length. Reslicing may increase the length up to capacity and exposes values already present in the backing array. Those values are often zero after \u0060make\u0060, but capacity alone does not say they are meaningful application data.\n\nCapacity also influences append. An append may reuse spare room, which can make writes visible through another slice sharing the array. Once more room is required, append returns a slice using new storage. Go does not promise a fixed capacity-growth formula, so programs should reason about ownership and retain append's returned slice rather than predict its size.",
    },
    visual: {
      type: "flow_diagram",
      title: "One slice window over one backing array",
      content: "\u0060\u0060\u0060mermaid\nflowchart LR\n  A[Backing array - 10, 20, 30, 40, 50]\n  A --> B[Slice starts at backing index 1]\n  B --> C[len 2 - 20 and 30 visible]\n  C --> D[cap 4 - may reslice through 50]\n\u0060\u0060\u0060\nLength marks the visible window; capacity marks the remaining window from the same start.",
    },
    example: {
      title: "Observe length, capacity, and reslicing",
      code: "package main\n\nimport \"fmt\"\n\nfunc main() {\n\tbase := []int{10, 20, 30, 40, 50}\n\ts := base[1:3]\n\tfmt.Println(s, len(s), cap(s))\n\n\ts = s[:4]\n\tfmt.Println(s, len(s), cap(s))\n}",
    },
  },
  "go-slices-maps-slice-internals-len-cap-when-to-use": {
    directAnswer: "A two-index slice expression \u0060a[low:high]\u0060 uses a half-open range: \u0060low\u0060 is included and \u0060high\u0060 is excluded, so the result length is \u0060high-low\u0060. For a slice, explicit bounds may reslice up to capacity, but ordinary indexing is still limited by current length. The bounds must be ordered and within the allowed limit. A constant-invalid expression fails to compile; invalid bounds calculated at run time panic. Reslicing exposes existing backing-array elements—it does not prove that they contain meaningful application data.",
    quick: [
      "\u0060a[low:high]\u0060 includes \u0060low\u0060, excludes \u0060high\u0060, and has length \u0060high-low\u0060.",
      "Omitted \u0060low\u0060 defaults to zero; omitted \u0060high\u0060 defaults to the source length.",
      "An explicit slice bound may extend a slice up to capacity, while an element index must stay below length.",
      "Valid bounds satisfy an ordered non-negative range within the source's allowed limit.",
      "Constant-invalid bounds fail at compile time; invalid dynamic bounds panic at run time.",
    ],
    beats: [
      {
        cue: "Define the two-index expression as a half-open range",
        stage: "Low enters and high stops",
        spokenText: "In \u0060a[low:high]\u0060, \u0060low\u0060 is included and \u0060high\u0060 is excluded. The result has length \u0060high - low\u0060. This half-open form makes adjacent ranges meet cleanly: \u0060a[:i]\u0060 ends exactly where \u0060a[i:]\u0060 begins.",
      },
      {
        cue: "Explain the defaults for an omitted bound",
        stage: "Missing bounds have defaults",
        spokenText: "In a two-index expression, an omitted low bound defaults to zero and an omitted high bound defaults to the source's current length. Thus \u0060a[:3]\u0060 starts at zero, \u0060a[2:]\u0060 stops at the current length, and \u0060a[:]\u0060 keeps the current visible range.",
      },
      {
        cue: "Separate the indexing limit from the reslicing limit",
        stage: "Index uses len, slice uses cap",
        spokenText: "For a slice, an element access such as \u0060s[i]\u0060 requires \u0060i < len(s)\u0060. An explicit slicing bound can extend beyond current length up to capacity. With \u0060s := make([]int, 2, 5)\u0060, \u0060s[3]\u0060 panics, but \u0060s = s[:5]\u0060 is valid and makes index three accessible.",
      },
      {
        cue: "Explain what newly visible capacity actually contains",
        stage: "Reslicing exposes storage",
        spokenText: "Reslicing does not initialize a new collection. It reveals elements already in the backing array. With \u0060make([]int, 2, 5)\u0060, those spare elements begin as zero values, but in a subslice they may contain values written through another view. Capacity is a storage boundary, not proof of valid business data.",
      },
      {
        cue: "Distinguish compile-time and run-time bound failures",
        stage: "Invalid bounds fail clearly",
        spokenText: "Bounds known to be impossible as constants are rejected by the compiler. Bounds calculated while the program runs cause a run-time panic when they are negative, out of order, or beyond the permitted limit. Validate external indexes before building the slice expression.",
        recallRule: "Slicing uses a half-open range; indexes stop at length, while explicit reslicing may extend only to capacity.",
      },
    ],
    overview: {
      title: "Half-open ranges and the reslicing boundary",
      content: "Go uses half-open slice ranges: the lower position belongs to the result and the upper position does not. This makes the result length a simple subtraction and lets adjacent ranges divide data without a gap or overlap. An empty range is also natural because \u0060a[i:i]\u0060 has length zero.\n\nOmitted bounds use the current visible slice. The low bound becomes zero, while the high bound becomes current length. Explicit bounds are more powerful: when slicing a slice, the high bound may extend beyond current length up to capacity. That operation reveals backing-array positions already reserved for the slice.\n\nIndexing remains stricter. Capacity is not a second index range. Before \u0060s = s[:5]\u0060, a slice of length two cannot use \u0060s[3]\u0060 even when its capacity is five. After reslicing, the same position becomes part of the visible range. Its value comes from existing storage and may be a zero value or data previously written through an alias.\n\nCompile-time constants let the compiler reject impossible bounds early. Dynamic values are checked at run time and panic when the range is negative, reversed, or too large. Code receiving offsets from a request, file, or user should validate them before slicing so an invalid input becomes a normal error rather than a process panic.",
    },
    visual: {
      type: "comparison_table",
      title: "Indexing and slicing use different limits",
      content: "| Operation | Limit that matters | Result |\n|---|---|---|\n| \u0060s[i]\u0060 | \u0060i < len(s)\u0060 | Access one currently visible element |\n| \u0060s[low:high]\u0060 | Ordered bounds with explicit high no greater than \u0060cap(s)\u0060 | Create another slice view |\n| \u0060s[:high]\u0060 | Explicit high no greater than \u0060cap(s)\u0060 | Extend or shorten from index zero |\n| \u0060s[low:]\u0060 | Default high is current \u0060len(s)\u0060 | Continue only to the current visible end |",
    },
    example: {
      title: "Extend a reserved slice before indexing it",
      code: "package main\n\nimport \"fmt\"\n\nfunc main() {\n\ts := make([]int, 2, 5)\n\ts[0], s[1] = 7, 8\n\n\tfmt.Println(s, len(s), cap(s))\n\ts = s[:5]\n\ts[3] = 9\n\tfmt.Println(s, len(s), cap(s))\n}",
    },
  },
  "go-slices-maps-slice-internals-len-cap-common-mistake": {
    directAnswer: "Changing one slice can change another because both slice values may describe overlapping positions in the same underlying array. A subslice copies the descriptor, not the elements. A write changes the shared array element, so every alias reaching that position observes it. Use \u0060copy\u0060 or \u0060slices.Clone\u0060 when independent storage is required. Append may keep sharing within capacity or move the returned slice to new storage, so append is not a reliable cloning strategy.",
    quick: [
      "Assigning or subslicing a slice copies its descriptor, not its elements.",
      "Two slice views can overlap the same positions in one backing array.",
      "A write is visible through every alias whose range reaches that array position.",
      "Use \u0060copy\u0060 or \u0060slices.Clone\u0060 when the receiver needs independent element storage.",
      "Append may preserve or break sharing depending on capacity, so it does not define ownership.",
    ],
    beats: [
      {
        cue: "Explain that subslicing copies a view rather than elements",
        stage: "Slice views can share storage",
        spokenText: "A slice value describes a range of an underlying array. Creating \u0060middle := all[1:]\u0060 makes another slice descriptor; it does not copy the strings or create a new backing array. Both slices can therefore reach some of the same stored positions.",
      },
      {
        cue: "Map one relative index to one backing-array position",
        stage: "Overlapping indexes alias",
        spokenText: "With \u0060all := []string{\"red\", \"green\", \"blue\"}\u0060, \u0060middle[0]\u0060 and \u0060all[1]\u0060 refer to the same backing-array element. Assigning \u0060middle[0] = \"lime\"\u0060 changes that element, so reading \u0060all[1]\u0060 returns \u0060\"lime\"\u0060.",
      },
      {
        cue: "Choose deliberate copying when the contract is a snapshot",
        stage: "Cloning creates new storage",
        spokenText: "When the recipient must own a stable snapshot, allocate separate element storage. \u0060snapshot := slices.Clone(all)\u0060 is clear in modern Go, while \u0060dst := make([]T, len(src)); copy(dst, src)\u0060 expresses the same shallow element copy. Later element assignments no longer cross between those slices.",
      },
      {
        cue: "Explain why append changes the relationship conditionally",
        stage: "Append may change sharing",
        spokenText: "If an append fits within capacity, it can reuse the same backing array and may overwrite data visible through another slice. If it needs more room, append returns a slice using new storage. The growth strategy is not an ownership contract, so do not use append as an accidental clone.",
      },
      {
        cue: "Close with an explicit ownership rule",
        stage: "Ownership must be deliberate",
        spokenText: "Share a slice when in-place changes are part of the API. Clone it when callers need independent element storage, and remember that cloning a slice of pointers still copies only the pointer elements. Document whether returned slices may alias internal buffers.",
        recallRule: "Slice names may be different while their backing-array positions are the same; copy elements when the contract requires independence.",
      },
    ],
    overview: {
      title: "Aliasing follows backing-array positions",
      content: "A slice variable does not own a private element collection. It describes a range of an array, so assigning the slice or creating a subslice normally produces another descriptor for the same storage. To understand a write, translate each relative slice index back to its backing-array position.\n\nTwo views only share effects where they can reach the same position. If \u0060middle := all[1:]\u0060, then \u0060middle[0]\u0060 is the same stored element as \u0060all[1]\u0060. A write through either view is immediately visible through the other. Their variable names and different lengths do not create ownership boundaries.\n\nUse aliasing deliberately for in-place algorithms and buffer processing. Use \u0060slices.Clone\u0060 or \u0060make\u0060 plus \u0060copy\u0060 when another component needs its own element storage. That copy is still shallow: if each element is a pointer, both slices contain pointers to the same target objects unless those objects are copied too.\n\nAppend makes accidental assumptions dangerous. Within capacity it can reuse the shared array; beyond capacity it returns a slice backed by new storage. A small change in starting slice or capacity may therefore change whether an append is observed through an alias. APIs that require isolation should copy explicitly rather than rely on allocation as a side effect.",
    },
    visual: {
      type: "flow_diagram",
      title: "Two slice views reach one stored element",
      content: "\u0060\u0060\u0060mermaid\nflowchart TB\n  A[Backing array - red, green, blue]\n  S[all covers positions 0 to 2] --> A\n  M[middle covers positions 1 to 2] --> A\n  W[middle 0 = lime] --> P[backing position 1 changes]\n  P --> S\n  P --> M\n\u0060\u0060\u0060\nThe relative indexes differ, but both views reach backing-array position 1.",
    },
    example: {
      title: "Observe aliasing, then create a snapshot",
      code: "package main\n\nimport (\n\t\"fmt\"\n\t\"slices\"\n)\n\nfunc main() {\n\tall := []string{\"red\", \"green\", \"blue\"}\n\tmiddle := all[1:]\n\tmiddle[0] = \"lime\"\n\n\tsnapshot := slices.Clone(all)\n\tsnapshot[1] = \"gold\"\n\n\tfmt.Println(all)\n\tfmt.Println(middle)\n\tfmt.Println(snapshot)\n}",
    },
  },
  "go-slices-maps-slice-internals-len-cap-compare": {
    directAnswer: "A full slice expression \u0060a[low:high:max]\u0060 creates a slice with length \u0060high-low\u0060 and capacity \u0060max-low\u0060. The third index places a capacity fence on the new view. If code later appends beyond that limited capacity, append must use different storage instead of reusing adjacent elements in the source array. The full expression is not a copy: elements in its current range still alias the original array. Use a clone when all later element mutation must be independent.",
    quick: [
      "A full slice expression has the form \u0060a[low:high:max]\u0060, with \u00600 <= low <= high <= max <= cap(a)\u0060.",
      "The result length is \u0060high-low\u0060 and its capacity is \u0060max-low\u0060.",
      "The third index limits how far append can reuse the source backing array.",
      "Existing elements still alias the source because the expression does not copy them.",
      "Use a capacity fence for append isolation and a clone for complete element-storage isolation.",
    ],
    beats: [
      {
        cue: "Define the three indexes and both resulting sizes",
        stage: "The third index sets capacity",
        spokenText: "A full slice expression is written \u0060a[low:high:max]\u0060. Only low may be omitted, and valid bounds satisfy \u00600 <= low <= high <= max <= cap(a)\u0060. Its length is \u0060high - low\u0060, while its capacity is deliberately limited to \u0060max - low\u0060.",
      },
      {
        cue: "Explain the overwrite risk from inherited spare capacity",
        stage: "Spare capacity permits reuse",
        spokenText: "With an ordinary view such as \u0060head := values[:2]\u0060, \u0060head\u0060 may inherit capacity covering the rest of \u0060values\u0060. Appending to head can then reuse that array and write into a position that the original slice already exposes.",
      },
      {
        cue: "Show how a capacity fence changes the next append",
        stage: "A fence forces new storage",
        spokenText: "Using \u0060head := values[:2:2]\u0060 gives head length two and capacity two. The next non-empty append exceeds that capacity, so append returns a slice with different storage instead of writing over \u0060values[2]\u0060. The caller must still assign the returned slice.",
      },
      {
        cue: "Keep current-element aliasing separate from future append",
        stage: "The fence is not a copy",
        spokenText: "The three-index expression still points at the same existing elements. Before append, assigning \u0060head[0] = 99\u0060 also changes \u0060values[0]\u0060. The capacity fence isolates growth behavior; it does not isolate mutations inside the current shared range.",
      },
      {
        cue: "Choose a capacity fence or clone from the required ownership",
        stage: "Cloning gives full isolation",
        spokenText: "Use a full slice expression when a helper may append but should not overwrite the source's adjacent elements. Use \u0060slices.Clone\u0060 or \u0060copy\u0060 when the helper must not change existing source elements either. These solve related but different ownership problems.",
        recallRule: "The third index limits append reuse; only copying creates independent element storage from the start.",
      },
    ],
    overview: {
      title: "Capacity fences and append isolation",
      content: "A full slice expression is written \u0060a[low:high:max]\u0060. It gives the result length \u0060high-low\u0060 and capacity \u0060max-low\u0060. Only low may be omitted, and the ordered bounds cannot extend beyond the source capacity.\n\nAn ordinary two-index subslice inherits capacity from its source. That spare capacity allows append to place new elements into the same backing array. If another slice already exposes those positions, the append may appear to overwrite unrelated data even though it only followed the capacity available to its receiver.\n\nThe third index creates an explicit limit. For \u0060head := values[:2:2]\u0060, low is zero, high is two, and max is two, so both length and capacity are two. Any append that adds an element needs more capacity and returns a slice using different storage. This makes it useful before passing a prefix to code that may append.\n\nA capacity fence is not a snapshot. The elements already inside head still occupy the same array positions as the source, so changing \u0060head[0]\u0060 changes \u0060values[0]\u0060. The fence only controls whether growth may reuse positions after the visible range.\n\nChoose the operation from the ownership contract. Use a full slice expression when current elements may remain shared but future append must not consume adjacent source storage. Use \u0060slices.Clone\u0060 or an explicit \u0060copy\u0060 when even current-element writes must be independent. Keeping those guarantees separate prevents a three-index expression from being mistaken for a copy.",
    },
    visual: {
      type: "flow_diagram",
      title: "Append after a capacity fence",
      content: "\u0060\u0060\u0060mermaid\nflowchart LR\n  A[values - 10, 20, 30, 40]\n  A --> B[head = values 0:2:2]\n  B --> C[len 2 and cap 2]\n  C -->|append 99| D[new array - 10, 20, 99]\n  A --> E[values remains 10, 20, 30, 40]\n\u0060\u0060\u0060\nThe capacity fence makes the append allocate instead of reusing the source's third position.",
    },
    example: {
      title: "Fence a subslice before handing it to append",
      code: "package main\n\nimport \"fmt\"\n\nfunc main() {\n\tvalues := []int{10, 20, 30, 40}\n\thead := values[:2:2]\n\n\thead[0] = 11\n\tfmt.Println(\"shared current element:\", values)\n\n\thead = append(head, 99)\n\tfmt.Println(\"grown head:\", head)\n\tfmt.Println(\"original values:\", values)\n}",
    },
  },
  // LESSONS_END
};

const document = JSON.parse(fs.readFileSync(questionFile, "utf8"));
let curated = 0;

for (const [targetSlug, lesson] of Object.entries(lessons)) {
  const matches = document.questions.filter((question) => question.slug === targetSlug);
  if (matches.length !== 1) {
    throw new Error("Expected exactly one " + targetSlug + " question, found " + matches.length);
  }
  const question = matches[0];
  const sections = question.answer?.sections ?? [];
  const quick = sections.find((section) => section.type === "key_points");
  const speaking = sections.find((section) => section.type === "speakable_answer");
  const overview = sections.find((section) => section.type === "overview");
  const visual = sections.find((section) => section.type === lesson.visual.type);
  const example = sections.find((section) => section.type === "code_example");
  if (!quick || !speaking || !overview || !visual || !example) {
    throw new Error("Missing an existing slice lesson section for " + targetSlug);
  }

  question.direct_answer = lesson.directAnswer;
  quick.items = lesson.quick;
  // These focused syntax answers are complete in roughly 180-215 words; marking
  // them compact keeps the editorial range honest without padding the lesson.
  speaking.answerSize = "compact";
  speaking.beats = lesson.beats;
  speaking.content = lesson.beats.map((beat) => beat.spokenText.trim()).join("\n\n");
  overview.title = lesson.overview.title;
  overview.content = lesson.overview.content;
  visual.title = lesson.visual.title;
  visual.content = lesson.visual.content;
  example.title = lesson.example.title;
  example.content = fence + "go\n" + lesson.example.code.trim() + "\n" + fence;
  curated += 1;
}

if (curated !== document.questions.length) {
  throw new Error("Curated " + curated + " of " + document.questions.length + " questions");
}

fs.writeFileSync(questionFile, JSON.stringify(document, null, 2) + "\n");
console.log("Curated " + curated + " Go slice-internals lessons");
