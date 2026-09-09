#!/usr/bin/env node

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const questionFile = path.join(
  repoRoot,
  "content/go-fresher/go-slices-maps/map-iteration-and-nil/complete-qa.json",
);
const fence = String.fromCharCode(96).repeat(3);

const lessons = {
  "go-slices-maps-map-iteration-and-nil-interview-basics": {
    directAnswer: "A nil map is safe for read-only operations. Lookup returns the value type's zero value with \u0060ok == false\u0060, \u0060len\u0060 returns zero, \u0060range\u0060 has no iterations, and \u0060delete\u0060 or \u0060clear\u0060 does nothing. Passing or returning the nil map is also safe. Entry assignment is the exception: \u0060m[key] = value\u0060 panics because no writable map has been initialized. Use \u0060make\u0060 or a literal before the first write. Nil and initialized-empty maps both look empty, but only the latter accepts entries.",
    quick: [
      "The zero value of every map type is \u0060nil\u0060.",
      "Nil-map lookup returns V's zero value and \u0060ok == false\u0060.",
      "\u0060len\u0060, \u0060range\u0060, \u0060delete\u0060, and \u0060clear\u0060 are safe on nil maps.",
      "Assigning a key to a nil map causes a run-time panic.",
      "Initialize with \u0060make\u0060 or a literal before any path writes an entry.",
    ],
    beats: [
      {
        cue: "Name the zero state clearly",
        stage: "Nil is the map zero value",
        spokenText: "A map declared without initialization has the zero value \u0060nil\u0060. For example, \u0060var counts map[string]int\u0060 contains no entries and has no initialized map structure for storing new ones. It can still be passed to functions and compared with nil.",
      },
      {
        cue: "Explain lookup without special cases",
        stage: "Lookup treats nil as empty",
        spokenText: "Every key is absent from a nil map. Therefore \u0060value, ok := counts[\"Go\"]\u0060 returns 0 and false for an int-valued map. A one-result lookup simply returns 0. The behavior matches an initialized empty map during reads.",
      },
      {
        cue: "Cover the remaining safe operations",
        stage: "Range and removal are safe",
        spokenText: "\u0060len(counts)\u0060 is zero, and a range loop executes zero times. \u0060delete(counts, key)\u0060 and \u0060clear(counts)\u0060 are safe no-ops because there are no entries to remove. Read-only code does not need a nil guard for these operations.",
      },
      {
        cue: "Draw the line at entry assignment",
        stage: "Entry assignment panics",
        spokenText: "Writing needs initialized map storage. An assignment such as \u0060counts[\"Go\"] = 1\u0060 panics when counts is nil. The same is true for \u0060counts[\"Go\"]++\u0060 because increment reads the missing zero and then tries to write the result.",
      },
      {
        cue: "Close with initialization and API meaning",
        stage: "Initialize before writing",
        spokenText: "Before the first write, use \u0060counts = make(map[string]int)\u0060 or a map literal. Nil and initialized-empty maps both have length zero, but they can mean different things at JSON or API boundaries. Preserve that distinction only when the contract needs it.",
        recallRule: "Nil maps behave as empty for reads and removals, but they must be initialized before assignment.",
      },
    ],
    overview: {
      title: "The nil map boundary appears only when writing",
      content: "Go gives every map type a useful zero value. A nil map has no entries, but most operations do not need storage to answer correctly. Lookup treats every key as missing, so it returns the value type's zero value and a false comma-ok flag. Length is zero, and range has no work to perform. Delete and clear safely do nothing.\n\nAssignment is different because it must create or replace an entry. A nil map does not refer to an initialized map structure, so \u0060m[key] = value\u0060 panics. An increment such as \u0060m[key]++\u0060 also writes and therefore has the same requirement. This makes a forgotten initialization fail at the first mutation instead of silently losing data.\n\nUse \u0060make(map[K]V)\u0060 when entries will be collected later, or a literal when starting entries are known. A read-only function may accept nil naturally, which is useful for optional configuration and zero-valued structs. A function that may initialize a map variable must return the new map or update an owning field, because rebinding its local parameter does not replace the caller's variable.\n\nNil and initialized-empty maps both have length zero but are not identical states. An initialized empty map accepts writes, and serializers may represent the two states differently—for example, a contract may distinguish no collection from an explicitly empty collection. Choose whether to preserve that distinction at the boundary, while keeping ordinary read logic simple.",
    },
    visual: {
      type: "comparison_table",
      title: "Operations on a nil map",
      content: "| Operation | Result on nil map |\n|---|---|\n| \u0060len(m)\u0060 | 0 |\n| \u0060value, ok := m[key]\u0060 | V's zero value, false |\n| \u0060for range m\u0060 | Zero iterations |\n| \u0060delete(m, key)\u0060 or \u0060clear(m)\u0060 | No effect |\n| \u0060m[key] = value\u0060 | Run-time panic |",
    },
    example: {
      title: "Read a nil map, then initialize it for writing",
      code: "package main\n\nimport \"fmt\"\n\nfunc main() {\n\tvar counts map[string]int\n\tvalue, ok := counts[\"Go\"]\n\tfmt.Println(value, ok, len(counts))\n\n\tdelete(counts, \"Go\")\n\tclear(counts)\n\tfor range counts {\n\t\tfmt.Println(\"unreachable\")\n\t}\n\n\tcounts = make(map[string]int)\n\tcounts[\"Go\"] = 1\n\tfmt.Println(counts[\"Go\"])\n}",
    },
  },
  "go-slices-maps-map-iteration-and-nil-when-to-use": {
    directAnswer: "No. Go does not specify the order produced by ranging over a map, and a later range over the same map is not guaranteed to use the same order. It is not insertion order and must not carry business meaning. For deterministic output, collect the keys into a slice, sort them with the required rule, and read values in that key order. If insertion or domain order must be preserved, store that sequence separately—often in a slice—while using the map only for lookup.",
    quick: [
      "Map iteration order is unspecified, not insertion ordered.",
      "Two range loops over the same map are not guaranteed to match.",
      "Collect and sort keys before producing stable output or test snapshots.",
      "Use a separate slice when insertion or domain order must be preserved.",
      "A map models key-value association; the caller supplies any sequence.",
    ],
    beats: [
      {
        cue: "State the language guarantee without calling it random",
        stage: "Map range is unordered",
        spokenText: "A \u0060for key, value := range m\u0060 loop visits map entries in an unspecified order. Go does not promise insertion order, sorted order, or the same order on the next loop. Unspecified is the important word: no observed order is safe to depend on.",
      },
      {
        cue: "Connect unstable order to visible failures",
        stage: "Insertion order is not saved",
        spokenText: "A map stores associations rather than a sequence. Building text, hashes, snapshots, or table rows directly from range can therefore produce unstable results. Tests that pass only because one local run happened to use a familiar order are fragile.",
      },
      {
        cue: "Show the deterministic traversal pattern",
        stage: "Sort a key snapshot",
        spokenText: "For stable output, first collect keys with \u0060keys = append(keys, key)\u0060, then call \u0060sort.Strings(keys)\u0060 or another required ordering function. Finally loop over keys and read \u0060m[key]\u0060. The slice supplies order; the map supplies lookup.",
      },
      {
        cue: "Handle insertion order as part of the data model",
        stage: "Store sequence separately",
        spokenText: "Sorting is wrong when the domain needs original insertion order. In that case, keep a slice of keys or records alongside the map and update both through one owner. The map provides fast lookup while the slice records the sequence explicitly.",
      },
      {
        cue: "Close with ownership of the ordering rule",
        stage: "Ordering belongs to the caller",
        spokenText: "Choose alphabetical, numeric, priority, or insertion order from the requirement, not from map behavior. Avoid adding or deleting entries merely to influence range order; modifications during a range have separate visibility rules and still provide no sequence guarantee.",
        recallRule: "Maps provide association, while a sorted or stored key slice provides order.",
      },
    ],
    overview: {
      title: "Stable traversal needs a separate ordering rule",
      content: "A Go map answers which value belongs to a key. It does not record a portable sequence for visiting those associations. A range loop will visit entries, but the language deliberately leaves their order unspecified and does not guarantee that two loops over the same map will match. Insertion order is not part of the map's contract.\n\nThis matters whenever order becomes observable. Configuration text, signatures, API output, snapshots, and tests can change when they are built directly from map range. Calling the behavior random is also misleading because random would suggest a distribution or controllable seed. The correct rule is simply that application code must not depend on it.\n\nDeterministic presentation usually takes a snapshot of the keys, sorts that slice using the required rule, and then reads each value by key. String keys may use \u0060sort.Strings\u0060; numeric or domain records can use an appropriate comparison. The extra work belongs at the boundary where stable order is required, not inside every map operation.\n\nSome domains need insertion or priority order rather than sorted keys. Store that sequence explicitly, perhaps with a slice for order and a map for lookup, and update both through one abstraction. Adding or deleting entries during a range does not create a usable order: an entry deleted before it is reached will not appear, while a newly added entry may or may not appear. Snapshot stable data before producing deterministic output.",
    },
    visual: {
      type: "flow_diagram",
      title: "Turn unordered entries into stable output",
      content: "\u0060\u0060\u0060mermaid\nflowchart LR\n  A[Map entries] --> B[Collect keys into a slice]\n  B --> C[Sort by the required rule]\n  C --> D[Read each map value by key]\n  D --> E[Deterministic output]\n\u0060\u0060\u0060\nThe ordering comes from the sorted key slice, never from map range itself.",
    },
    example: {
      title: "Print map entries in sorted-key order",
      code: "package main\n\nimport (\n\t\"fmt\"\n\t\"sort\"\n)\n\nfunc main() {\n\tports := map[string]int{\"https\": 443, \"http\": 80, \"ssh\": 22}\n\tkeys := make([]string, 0, len(ports))\n\tfor key := range ports {\n\t\tkeys = append(keys, key)\n\t}\n\n\tsort.Strings(keys)\n\tfor _, key := range keys {\n\t\tfmt.Println(key, ports[key])\n\t}\n}",
    },
  },
  "go-slices-maps-map-iteration-and-nil-common-mistake": {
    directAnswer: "Ordinary Go maps do not synchronize access. Multiple goroutines may read the same map only while no goroutine is writing it. Any read or write that can overlap a write must be coordinated. Protect the map and the complete logical operation with a mutex, keep it owned by one goroutine and communicate through channels, or use another suitable concurrent design. A check-then-insert or \u0060counts[key]++\u0060 needs one boundary around every step. \u0060sync.Map\u0060 is specialized, not a universal replacement for typed maps.",
    quick: [
      "Concurrent reads are safe only while no goroutine writes the map.",
      "A read racing with a write or two overlapping writes is unsafe.",
      "Lock the whole check-update or read-modify-write operation, not one statement.",
      "A mutex wrapper or one owning goroutine gives the map a clear boundary.",
      "\u0060sync.Map\u0060 fits specialized workloads and is not the default for every map.",
    ],
    beats: [
      {
        cue: "Start with the lack of built-in coordination",
        stage: "Maps do not synchronize",
        spokenText: "An ordinary Go map has no internal synchronization for application goroutines. Several goroutines may read it when the map is not changing. Once any write can overlap another read or write, every participating access needs a coordination rule.",
      },
      {
        cue: "Define which operations count as writes",
        stage: "Reads need a stable map",
        spokenText: "Assignments, \u0060delete\u0060, \u0060clear\u0060, and updates such as \u0060counts[path]++\u0060 mutate the map. An unsynchronized overlap is a data race and may also cause a fatal run-time error. A successful local run does not make that access safe.",
      },
      {
        cue: "Explain why locking one statement can be insufficient",
        stage: "Updates are multi-step",
        spokenText: "An increment reads the old value, computes a new value, and writes it back. A check-then-insert has the same multi-step shape. If different goroutines can interleave those steps, updates can be lost even if one individual lookup or assignment was protected separately.",
      },
      {
        cue: "Put synchronization around the invariant",
        stage: "Lock the whole operation",
        spokenText: "A typed map behind \u0060sync.Mutex\u0060 or \u0060sync.RWMutex\u0060 is often clear. Keep the map private, lock inside methods, and hold the lock across the complete logical operation. Another valid model gives one goroutine sole ownership and sends it requests through channels.",
      },
      {
        cue: "Place sync.Map and the race detector correctly",
        stage: "Sync Map is specialized",
        spokenText: "\u0060sync.Map\u0060 can suit patterns such as entries written once and read many times or goroutines working mostly on disjoint keys. It trades ordinary typed operations for a specialized API. Use \u0060go test -race\u0060 to find races, but keep the ownership or locking design as the actual guarantee.",
        recallRule: "Concurrent reads need no writer; any possible writer requires one synchronization plan for the whole operation.",
      },
    ],
    overview: {
      title: "Map safety comes from one ownership boundary",
      content: "Ordinary maps are designed as efficient data structures, not as synchronization primitives. Several goroutines can read a map concurrently after it has stopped changing. If an assignment, deletion, clear, or other mutation may overlap a read or write, the program has a data race and its behavior is not safe. The runtime may detect some overlaps and stop the program, but detection is not the safety model.\n\nProtect the logical invariant rather than one syntax operation. \u0060counts[key]++\u0060 is a read-modify-write sequence. A load followed by “insert if missing” is also multiple steps. Locking the read and write separately still allows another goroutine to change the state between them. One critical section must cover the decision and the update.\n\nA common design keeps a typed map private inside a struct and exposes methods that lock a \u0060sync.Mutex\u0060 or \u0060sync.RWMutex\u0060. This makes the boundary visible and prevents callers from bypassing it. Another design assigns the map to one goroutine and sends operations through channels, which can be useful when ownership naturally follows an event loop.\n\n\u0060sync.Map\u0060 is useful for particular access patterns, including write-once/read-many entries or largely disjoint key sets, but its API and trade-offs differ from a normal typed map. It is not a repair for unclear ownership. The race detector is valuable evidence during tests, yet a race-free run cannot prove all schedules; the mutex or ownership rule must make overlapping access impossible by design.",
    },
    visual: {
      type: "flow_diagram",
      title: "Protect the full counter update",
      content: "\u0060\u0060\u0060mermaid\nflowchart LR\n  A[Several goroutines call Add] --> B[Lock counter owner]\n  B --> C[Read current count]\n  C --> D[Compute and write next count]\n  D --> E[Unlock]\n\u0060\u0060\u0060\nThe lock covers the complete read-modify-write sequence so updates cannot interleave.",
    },
    example: {
      title: "Count from several goroutines behind a mutex",
      code: "package main\n\nimport (\n\t\"fmt\"\n\t\"sync\"\n)\n\ntype Counter struct {\n\tmu sync.RWMutex\n\tm  map[string]int\n}\n\nfunc NewCounter() *Counter {\n\treturn &Counter{m: make(map[string]int)}\n}\n\nfunc (c *Counter) Add(key string) {\n\tc.mu.Lock()\n\tdefer c.mu.Unlock()\n\tc.m[key]++\n}\n\nfunc (c *Counter) Value(key string) int {\n\tc.mu.RLock()\n\tdefer c.mu.RUnlock()\n\treturn c.m[key]\n}\n\nfunc main() {\n\tcounter := NewCounter()\n\tvar workers sync.WaitGroup\n\tfor i := 0; i < 4; i++ {\n\t\tworkers.Add(1)\n\t\tgo func() {\n\t\t\tdefer workers.Done()\n\t\t\tfor j := 0; j < 1000; j++ {\n\t\t\t\tcounter.Add(\"/health\")\n\t\t\t}\n\t\t}()\n\t}\n\tworkers.Wait()\n\tfmt.Println(counter.Value(\"/health\"))\n}",
    },
  },
  "go-slices-maps-map-iteration-and-nil-compare": {
    directAnswer: "\u0060delete(m, key)\u0060 removes one entry when the key exists and otherwise does nothing. \u0060clear(m)\u0060 removes every entry. Both are safe on a nil map and return no value. Clearing an initialized map leaves it non-nil and ready for later writes; it also removes entries seen through aliases of the same map. Neither operation promises immediate release of internal storage. Assigning \u0060nil\u0060 or a new map to one variable changes that variable, but other aliases can still refer to the old map.",
    quick: [
      "\u0060delete(m, key)\u0060 removes one entry and returns no value.",
      "Deleting a missing key or deleting from a nil map is a safe no-op.",
      "\u0060clear(m)\u0060 removes every entry and is also safe on nil maps.",
      "Clear keeps an initialized map non-nil, writable, and shared with its aliases.",
      "Rebinding one variable to nil or a new map does not clear existing aliases.",
    ],
    beats: [
      {
        cue: "Define single-key removal",
        stage: "Delete removes one key",
        spokenText: "The built-in \u0060delete(m, key)\u0060 removes the entry for one key. It has no return value. If the key is missing, the call does nothing, so code does not need a comma-ok lookup just to make deletion safe.",
      },
      {
        cue: "Include the nil behavior",
        stage: "Missing delete is safe",
        spokenText: "Delete is also a no-op when m is nil. That matches nil-map read behavior: there is no entry to process. If application logic needs to know whether removal actually happened, check presence separately because delete itself does not report it.",
      },
      {
        cue: "Define whole-map removal",
        stage: "Clear removes all entries",
        spokenText: "The built-in \u0060clear(m)\u0060 removes every map entry. After clearing an initialized map, \u0060len(m)\u0060 is zero. Clearing nil is safe as well. Clear is useful when the same logical map should be emptied and then reused.",
      },
      {
        cue: "Explain identity and alias effects",
        stage: "Clear keeps map writable",
        spokenText: "Clear does not turn an initialized map into nil. A later \u0060m[key] = value\u0060 still works. Map assignment shares the same map data, so an alias also sees the entries disappear and observes entries added afterward through either variable.",
      },
      {
        cue: "Separate logical clearing from releasing references",
        stage: "Dropping a reference differs",
        spokenText: "Delete and clear define visible entries, not immediate storage release. Setting one owner to \u0060nil\u0060 or a newly made map may let old storage become collectible only when no aliases remain. Shared access still needs synchronization because removal operations are writes.",
        recallRule: "Delete removes one entry, clear removes all entries, and rebinding changes only one map variable.",
      },
    ],
    overview: {
      title: "Entry removal and reference lifetime are separate",
      content: "Delete expresses a single-key change. \u0060delete(m, key)\u0060 removes the entry if it exists and is otherwise a no-op. It returns nothing because both present and missing inputs are valid. When business logic must report whether something was removed, perform a comma-ok lookup as part of the surrounding operation rather than expecting delete to answer that question.\n\nClear expresses a whole-map change. \u0060clear(m)\u0060 removes every entry, leaves length zero, and is safe on nil. An initialized map stays initialized and accepts later assignments. Because copying a map value creates another reference to the same map data, aliases see the clear and continue to share later writes.\n\nRebinding is different from clearing. After \u0060m = nil\u0060, only that variable is nil; another variable that referred to the old map still reaches its entries. Assigning \u0060m = make(map[K]V)\u0060 similarly gives one variable a new empty map without changing old aliases. This distinction matters when the goal is to notify all users of a shared map versus replace one owner's collection.\n\nNeither delete nor clear provides a promise about when internal storage is released. If memory retention is important, remove references according to the ownership design and measure the actual workload. Also treat both operations as writes: a delete or clear that can overlap another goroutine's map access requires the same synchronization as assignment.",
    },
    visual: {
      type: "comparison_table",
      title: "Removal and rebinding have different reach",
      content: "| Goal | Operation | Owner afterward | Existing aliases |\n|---|---|---|---|\n| Remove one entry | \u0060delete(m, key)\u0060 | Same map without key | See the deletion |\n| Remove all entries | \u0060clear(m)\u0060 | Same non-nil empty map | See the clear |\n| Drop one reference | \u0060m = nil\u0060 | Nil | Still reach old map |\n| Replace one reference | \u0060m = make(map[K]V)\u0060 | New empty map | Still reach old map |",
    },
    example: {
      title: "Observe delete, clear, and rebinding through an alias",
      code: "package main\n\nimport \"fmt\"\n\nfunc main() {\n\titems := map[string]int{\"alpha\": 1, \"beta\": 2}\n\talias := items\n\n\tdelete(items, \"beta\")\n\tfmt.Println(\"after delete:\", alias)\n\n\tclear(items)\n\tfmt.Println(\"after clear:\", len(items), len(alias), items == nil)\n\n\titems[\"gamma\"] = 3\n\titems = nil\n\tfmt.Println(\"after rebind:\", items == nil, alias[\"gamma\"])\n}",
    },
  },
  // LESSONS
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
    throw new Error("Missing an existing map iteration section for " + targetSlug);
  }

  question.direct_answer = lesson.directAnswer;
  quick.items = lesson.quick;
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
console.log("Curated " + curated + " Go map iteration and nil lessons");
