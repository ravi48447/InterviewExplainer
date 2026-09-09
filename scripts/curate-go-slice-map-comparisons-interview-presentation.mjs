#!/usr/bin/env node

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const questionFile = path.join(
  repoRoot,
  "content/go-fresher/go-slices-maps/comparisons/complete-qa.json",
);
const fence = String.fromCharCode(96).repeat(3);

const lessons = {
  "go-slices-maps-comparisons-interview-basics": {
    directAnswer: "Two slices cannot be compared with `==`; a slice may only be compared directly with `nil`. For ordered content equality, use `slices.Equal` when elements use normal `==`, or `slices.EqualFunc` when they need a custom rule. These helpers require equal lengths and compare corresponding positions, so order matters. They treat a nil slice and a non-nil empty slice as equal content. Check nilness separately when that state has meaning.",
    quick: [
      "`left == right` is invalid for slices; `left == nil` is allowed.",
      "Slice content equality normally means equal lengths and equal values at every index.",
      "Use `slices.Equal` when the element type supports normal equality.",
      "Use `slices.EqualFunc` for case folding, nested slices, or another custom rule.",
      "The helpers treat nil and empty slices as equal sequences; test nilness separately.",
    ],
    beats: [
      {
        cue: "Start with the language restriction",
        stage: "Direct equality is unavailable",
        spokenText: "A slice value cannot be compared with another slice by writing `left == right`. The compiler rejects it because a slice is a descriptor for mutable storage. Direct comparison is allowed only against `nil` to ask whether the descriptor is in its zero state.",
      },
      {
        cue: "Define ordinary sequence equality",
        stage: "Sequence equality keeps order",
        spokenText: "For content, two slices are usually equal when their lengths match and `left[i]` equals `right[i]` at every index. The positions matter: `[]int{1, 2}` and `[]int{2, 1}` contain the same values but are different sequences.",
      },
      {
        cue: "Use the typed standard helper",
        stage: "Equal follows element equality",
        spokenText: "`slices.Equal(left, right)` implements that length-and-position rule when the element type is comparable. It uses the element's normal `==`, so details such as floating-point `NaN` still follow normal Go equality.",
      },
      {
        cue: "Introduce custom equality only when needed",
        stage: "EqualFunc supplies the rule",
        spokenText: "`slices.EqualFunc` receives a function for each pair of elements. `strings.EqualFold` can make string comparison case-insensitive, and a small function can compare struct fields or nested values according to the domain instead of reflection's rules.",
      },
      {
        cue: "Separate contents from initialization state",
        stage: "Nilness is another question",
        spokenText: "`slices.Equal` considers a nil slice and an empty non-nil slice equal because both are empty sequences. If nil means something separate, such as “not loaded,” first test `slice == nil`, then compare contents with the chosen helper.",
        recallRule: "Compare slice contents by length and matching indexes; test nilness as separate state.",
      },
    ],
    overview: {
      title: "Slice equality is ordered content equality",
      content: "A slice is not a comparable Go type, so two slice values cannot appear on opposite sides of `==`. The allowed direct check is `items == nil`, which asks whether the slice descriptor is nil. It says nothing about the contents of another slice.\n\nContent equality needs a definition. For a normal sequence, lengths must match and the values at each corresponding index must be equal. Order is part of that definition. The `slices.Equal` helper expresses this rule for comparable elements and avoids a handwritten loop. It still follows the element type's equality behavior, including details such as `NaN` not being equal to itself.\n\nUse `slices.EqualFunc` when ordinary element equality is unavailable or does not match the application. The supplied function can compare case-insensitive strings, selected struct fields, or nested slices. Keeping that rule beside the call makes the intended meaning visible. `reflect.DeepEqual` has broader recursive rules, but it also distinguishes nil and empty slices and may encode more behavior than the question needs.\n\nThe standard slice helpers treat nil and non-nil empty slices as equal sequences because each has length zero. An API may still give nil a separate meaning or serialize the states differently. In that case, check nilness before comparing contents. Equal contents also do not imply shared storage: two independent slices can be equal, while two aliased slices can later become unequal after mutation.",
    },
    visual: {
      type: "comparison_table",
      title: "Choose the slice comparison that matches the question",
      content: "| Question | Go expression | Important rule |\n|---|---|---|\n| Is the slice nil? | `s == nil` | Tests descriptor state only |\n| Are ordered comparable elements equal? | `slices.Equal(a, b)` | Length and every index must match |\n| Do elements need a custom rule? | `slices.EqualFunc(a, b, equal)` | Caller defines pair equality |\n| Must nil differ from empty? | Check nilness, then contents | `slices.Equal` alone treats both as empty |",
    },
    example: {
      title: "Compare exact, case-folded, and empty contents",
      code: "package main\n\nimport (\n\t\"fmt\"\n\t\"slices\"\n\t\"strings\"\n)\n\nfunc main() {\n\tleft := []string{\"Go\", \"Ruby\"}\n\tright := []string{\"go\", \"ruby\"}\n\tfmt.Println(\"exact:\", slices.Equal(left, right))\n\tfmt.Println(\"folded:\", slices.EqualFunc(left, right, strings.EqualFold))\n\n\tvar nilNames []string\n\temptyNames := []string{}\n\tfmt.Println(\"same contents:\", slices.Equal(nilNames, emptyNames))\n\tfmt.Println(\"nil states:\", nilNames == nil, emptyNames == nil)\n}",
    },
  },
  "go-slices-maps-comparisons-when-to-use": {
    directAnswer: "Two maps cannot be compared with `==`; a map may only be compared directly with `nil`. Map content equality means both maps have the same keys and each key has an equal value. Range order does not matter. Use `maps.Equal` when values support normal `==`, or `maps.EqualFunc` when values need a custom rule. Map keys still use their normal equality. Both helpers treat nil and empty maps as equal contents, so check nilness separately when it represents state.",
    quick: [
      "`left == right` is invalid for maps; `left == nil` is allowed.",
      "Equal map contents require the same keys and equal values for every key.",
      "Map range order is unspecified and has no role in content equality.",
      "Use `maps.Equal` for comparable values and `maps.EqualFunc` for a custom value rule.",
      "Nil and empty maps have equal contents to these helpers; test state separately.",
    ],
    beats: [
      {
        cue: "Define equality through map membership",
        stage: "Keys define matching entries",
        spokenText: "Maps cannot be compared to each other with `==`. Content equality instead asks whether both maps have the same number of entries and whether every `key` from one map exists in the other with an equal value.",
      },
      {
        cue: "Remove iteration order from the definition",
        stage: "Range order is irrelevant",
        spokenText: "Map range order is unspecified, so entries must never be paired by visit position. `map[int]string{1: \"Go\", 2: \"Ruby\"}` has the same contents as a literal that lists key 2 first and key 1 second.",
      },
      {
        cue: "Use normal value equality when it fits",
        stage: "Equal checks keys and values",
        spokenText: "`maps.Equal(left, right)` performs this order-independent check when values are comparable. Keys already have to be comparable to be used in a map, and the helper uses normal `==` for corresponding values.",
      },
      {
        cue: "Add a domain rule for values only",
        stage: "EqualFunc customizes values",
        spokenText: "`maps.EqualFunc` accepts a function for comparing the values found under the same key. `strings.EqualFold` can ignore string case, while `bytes.Equal` can compare byte-slice values. The function does not change how keys match.",
      },
      {
        cue: "Keep content and state separate",
        stage: "Nilness stays separate",
        spokenText: "`maps.Equal` considers a nil map and an initialized empty map equal because neither contains an entry. If nil means “not loaded” and empty means “loaded with no results,” test `m == nil` before comparing the entries.",
        recallRule: "Map equality matches keys to values, never one range position to another.",
      },
    ],
    overview: {
      title: "Map equality matches entries by key",
      content: "A map is not directly comparable with another map. The expression `left == right` does not compile, although either map may be checked against nil. To compare contents, begin with map meaning: each key identifies its own entry, and traversal position has no meaning.\n\nTwo maps have equal contents when they contain the same number of entries and every key in one map exists in the other with an equal value. The standard `maps.Equal` helper implements this rule when the value type is comparable. Different insertion histories and different range orders do not affect the result. Keys use their ordinary Go equality because a map key type must already support comparison.\n\n`maps.EqualFunc` keeps the same membership rule but lets the caller define value equality. A map of strings may use `strings.EqualFold`; a map of byte slices may use `bytes.Equal`; a domain object may compare only stable identifying fields. This is safer than sorting printed map entries or comparing formatted text, which can hide type information and introduce accidental rules.\n\nA nil map and a non-nil empty map both contain zero entries, so the maps helpers consider their contents equal. The language still treats their state differently: only the nil map satisfies `m == nil`, and a nil map cannot accept an assignment. If that distinction belongs to the API contract, compare nilness separately. Content equality should answer an entry question, while state checks answer an initialization question.",
    },
    visual: {
      type: "flow_diagram",
      title: "Order-independent map comparison",
      content: "```mermaid\nflowchart TD\n  A[Compare entry counts] --> B{Counts match?}\n  B -- No --> F[Not equal]\n  B -- Yes --> C[Take each key from the first map]\n  C --> D{Other map has key with equal value?}\n  D -- No --> F\n  D -- Yes --> E{More keys?}\n  E -- Yes --> C\n  E -- No --> G[Equal contents]\n```\nKeys pair the entries; range position is never used.",
    },
    example: {
      title: "Compare exact and case-insensitive map values",
      code: "package main\n\nimport (\n\t\"fmt\"\n\t\"maps\"\n\t\"strings\"\n)\n\nfunc main() {\n\tleft := map[int]string{1: \"Go\", 2: \"Ruby\"}\n\tright := map[int]string{2: \"ruby\", 1: \"go\"}\n\tfmt.Println(\"exact:\", maps.Equal(left, right))\n\tfmt.Println(\"folded:\", maps.EqualFunc(left, right, strings.EqualFold))\n\n\tvar nilScores map[string]int\n\temptyScores := map[string]int{}\n\tfmt.Println(\"same contents:\", maps.Equal(nilScores, emptyScores))\n\tfmt.Println(\"nil states:\", nilScores == nil, emptyScores == nil)\n}",
    },
  },
  "go-slices-maps-comparisons-common-mistake": {
    directAnswer: "A nil slice or map is its type's zero value; an empty non-nil collection has been initialized but contains no elements. Both states have length zero and produce no range iterations, but only the nil value satisfies `collection == nil`. Nil and empty slices both support `append`. A nil map supports reads, range, and `delete`, but assigning an entry panics; initialize it with `make` or a literal first. Encoders and APIs may expose nil and empty differently, so follow the boundary contract.",
    quick: [
      "Nil and empty slices or maps can all have `len` equal to zero.",
      "Only the nil form satisfies `slice == nil` or `mapValue == nil`.",
      "Both nil and empty slices can grow with `append`.",
      "Nil-map reads and deletion are safe, but assigning an entry panics.",
      "Default JSON output distinguishes `null` from `[]` or `{}`.",
    ],
    beats: [
      {
        cue: "Define the two states without confusing them with length",
        stage: "Both states can be empty",
        spokenText: "`var items []int` is a nil slice, while `items := []int{}` creates a non-nil empty slice. Both have `len(items) == 0`. Maps follow the same zero-length pattern, so length alone cannot reveal initialization state.",
      },
      {
        cue: "Explain why slice use is similar",
        stage: "Slices grow from either state",
        spokenText: "Both slice states can be ranged over and passed to `append`. Appending to a nil slice allocates storage as needed, so ordinary collection-building code usually does not need a special nil branch.",
      },
      {
        cue: "State the important map boundary",
        stage: "Nil maps reject assignments",
        spokenText: "A nil map safely returns zero values from lookup, has no range entries, and accepts `delete`. It does not have writable map storage, so `m[key] = value` panics. Create storage first with `make(map[K]V)` or a map literal.",
      },
      {
        cue: "Separate content comparison from state comparison",
        stage: "Helpers compare contents",
        spokenText: "`slices.Equal` and `maps.Equal` treat nil and empty collections as equal contents because both contain zero elements. To preserve an initialization distinction, check `collection == nil` before using the content helper.",
      },
      {
        cue: "Explain where users can observe the distinction",
        stage: "Boundaries may preserve state",
        spokenText: "With normal `encoding/json` behavior and no `omitempty`, nil slices and maps encode as `null`; initialized empty values encode as `[]` and `{}`. Decide which representation the API promises and normalize the value at that boundary when needed.",
        recallRule: "Nil and empty can have the same contents but different initialization and representation behavior.",
      },
    ],
    overview: {
      title: "Empty content does not describe initialization",
      content: "Nil is the zero value for a slice or map. An empty non-nil value has been initialized but currently contains no elements. Both states report length zero and a range loop performs no iterations, so algorithms that only read contents can often treat them alike. Only the nil form compares equal to nil.\n\nSlices are forgiving across this boundary. Lookup by index is impossible when either length is zero, but `append` works on both. A nil slice needs no manual initialization before values are appended. The returned slice records any allocated storage, new length, and capacity.\n\nMaps have a stronger difference. Reading a missing key from either state returns the value type's zero value, and `delete` is safe. Assignment requires initialized map storage. Writing `m[key] = value` to a nil map panics, while the same write to `make(map[K]V)` or a non-nil literal succeeds. A function that promises to populate a supplied map must either require a non-nil map or create and return one.\n\nContent helpers normally ignore the state difference: `slices.Equal` and `maps.Equal` consider nil and empty values equal when neither has entries. Representation boundaries may not. Default `encoding/json` output uses `null` for nil, `[]` for an empty slice, and `{}` for an empty map. The correct choice comes from the contract. Normalize to an empty value when clients require an array or object, and keep nil when “not present” is a documented state.",
    },
    visual: {
      type: "comparison_table",
      title: "Nil and empty collection behavior",
      content: "| Operation | Nil slice | Empty slice | Nil map | Empty map |\n|---|---|---|---|---|\n| `len` | `0` | `0` | `0` | `0` |\n| Compare with nil | True | False | True | False |\n| Range | No iterations | No iterations | No iterations | No iterations |\n| `append` | Works | Works | Not a map operation | Not a map operation |\n| Assign map entry | Not a slice operation | Not a slice operation | Panics | Works |\n| Default JSON | `null` | `[]` | `null` | `{}` |",
    },
    example: {
      title: "Observe empty behavior and JSON representation",
      code: "package main\n\nimport (\n\t\"encoding/json\"\n\t\"fmt\"\n)\n\nfunc mustJSON(value any) string {\n\tdata, err := json.Marshal(value)\n\tif err != nil {\n\t\tpanic(err)\n\t}\n\treturn string(data)\n}\n\nfunc main() {\n\tvar nilSlice []int\n\temptySlice := []int{}\n\tfmt.Println(\"slices:\", len(nilSlice), nilSlice == nil, len(emptySlice), emptySlice == nil)\n\tnilSlice = append(nilSlice, 1)\n\tfmt.Println(\"appended:\", nilSlice)\n\n\tvar nilMap map[string]int\n\temptyMap := map[string]int{}\n\tfmt.Println(\"maps:\", len(nilMap), nilMap == nil, len(emptyMap), emptyMap == nil)\n\tfmt.Println(\"read:\", nilMap[\"x\"])\n\tdelete(nilMap, \"x\")\n\temptyMap[\"x\"] = 1\n\tfmt.Println(\"written:\", emptyMap)\n\n\tfmt.Println(\"json:\", mustJSON([]int(nil)), mustJSON([]int{}), mustJSON(map[string]int(nil)), mustJSON(map[string]int{}))\n}",
    },
  },
  "go-slices-maps-comparisons-compare": {
    directAnswer: "A type is comparable when values of that type can use `==` and `!=`; comparable types may also be map keys. Booleans, numbers, strings, pointers, and channels are comparable. Arrays are comparable when their element type is comparable, and structs are comparable when every field type is comparable. Slices, maps, and functions are not comparable except with `nil`, so any array or struct containing one is also non-comparable. Interface values can be compared, but comparison panics if their matching dynamic type is not comparable.",
    quick: [
      "Comparable values support `==` and `!=` and may be used as map keys.",
      "Booleans, numbers, strings, pointers, and channels are comparable.",
      "An array is comparable only when its element type is comparable.",
      "A struct is comparable only when every field type is comparable.",
      "Slices, maps, and functions compare only with nil; interfaces need comparable dynamic values.",
    ],
    beats: [
      {
        cue: "Define what the language property enables",
        stage: "Comparability is a type rule",
        spokenText: "A comparable type supports `left == right` and `left != right`. Values of a comparable type may also be map keys. Basic examples include booleans, numeric types, strings, pointers, and channels.",
      },
      {
        cue: "Apply the rule recursively to arrays",
        stage: "Array equality follows T",
        spokenText: "An array such as `[2]int` is comparable because `int` is comparable. Go compares corresponding elements. An array such as `[2][]int` is not comparable because each element is a slice.",
      },
      {
        cue: "Apply the same recursion to structs",
        stage: "Structs inherit field equality",
        spokenText: "A struct is comparable when all its field types are comparable. `struct{ X, Y int }` supports `==` and can be a map key. Adding a field such as `Tags []string` makes the whole struct non-comparable.",
      },
      {
        cue: "Name the common non-comparable kinds and the alternative",
        stage: "Three kinds stop equality",
        spokenText: "Slices, maps, and functions cannot be compared to another value of the same type; they may only be compared with `nil`. Compare their contents with helpers such as `slices.Equal`, `maps.Equal`, or a domain-specific function.",
      },
      {
        cue: "State the interface run-time boundary",
        stage: "Interfaces inspect values",
        spokenText: "Interface values can be operands of `==`, but their matching dynamic values must also be comparable. Comparing two interfaces that both contain a slice panics at run time. Avoid unchecked interface keys when they may hold non-comparable data.",
        recallRule: "Arrays and structs are comparable only when comparability reaches every contained value.",
      },
    ],
    overview: {
      title: "Comparability flows through composite types",
      content: "Comparability is a language property. Values of a comparable type can be tested with `==` and `!=`, and they can serve as map keys. Booleans, integers, floating-point values, complex numbers, strings, pointers, and channels are comparable. Equality still follows each type's rules, so comparable does not promise ordinary arithmetic behavior; for example, a floating-point `NaN` is not equal to itself.\n\nArrays inherit the property from their element type. `[4]byte` is comparable, so two values can be checked directly and the type can be a map key. `[4][]byte` is not comparable because slices are not comparable. Go compares comparable arrays element by element.\n\nStructs use the same recursive rule. Every field type must be comparable. A coordinate containing integers supports equality. Adding a slice, map, or function field makes the complete struct non-comparable, even if code only cares about the other fields. Write a named comparison function when selected fields define domain equality.\n\nSlices, maps, and functions may be compared only with nil. Their contents need an explicit algorithm such as `slices.Equal`, `maps.Equal`, or application-specific logic. Interfaces add a run-time boundary: interface values can be compared, but if both contain matching non-comparable dynamic values, the comparison panics. An interface used as a map key has the same risk when its dynamic value is not comparable. Concrete key types and explicit content helpers keep this rule visible.",
    },
    visual: {
      type: "comparison_table",
      title: "How composite types gain or lose comparability",
      content: "| Type shape | Comparable? | Rule |\n|---|---|---|\n| Boolean, number, string, pointer, channel | Yes | Uses the type's normal equality |\n| Array `[N]T` | Sometimes | Only when `T` is comparable |\n| Struct | Sometimes | Only when every field type is comparable |\n| Slice, map, function | No | May be compared only with `nil` |\n| Interface | At the interface level | Matching dynamic values must be comparable or comparison panics |",
    },
    example: {
      title: "Use comparable values directly and compare slices explicitly",
      code: "package main\n\nimport (\n\t\"fmt\"\n\t\"slices\"\n)\n\ntype Point struct {\n\tX int\n\tY int\n}\n\ntype Record struct {\n\tName string\n\tTags []string\n}\n\nfunc equalRecord(left, right Record) bool {\n\treturn left.Name == right.Name && slices.Equal(left.Tags, right.Tags)\n}\n\nfunc main() {\n\tfirst := Point{X: 2, Y: 3}\n\tsecond := Point{X: 2, Y: 3}\n\tlabels := map[Point]string{{X: 0, Y: 0}: \"origin\"}\n\tfmt.Println(\"point:\", first == second, labels[Point{}])\n\n\tleft := Record{Name: \"guide\", Tags: []string{\"go\", \"types\"}}\n\tright := Record{Name: \"guide\", Tags: []string{\"go\", \"types\"}}\n\tfmt.Println(\"record contents:\", equalRecord(left, right))\n}",
    },
  },
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
    throw new Error("Missing an existing comparison section for " + targetSlug);
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
console.log("Curated " + curated + " Go comparison lessons");
