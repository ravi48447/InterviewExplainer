#!/usr/bin/env node

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const questionFile = path.join(
  repoRoot,
  "content/go-fresher/go-slices-maps/maps-make-and-literal/complete-qa.json",
);
const fence = String.fromCharCode(96).repeat(3);

const lessons = {
  "go-slices-maps-maps-make-and-literal-interview-basics": {
    directAnswer: "A declaration such as \u0060var m map[string]int\u0060 gives a nil map, which is the map type's zero value. Lookup, \u0060len\u0060, \u0060range\u0060, \u0060delete\u0060, and \u0060clear\u0060 are safe on it, but assigning a key panics. \u0060make(map[string]int)\u0060 creates an empty, non-nil map that accepts writes. A map literal also creates an initialized map and may include starting entries, as in \u0060map[string]int{\"Go\": 1}\u0060. An optional size passed to make is only an initial allocation hint, not a fixed capacity.",
    quick: [
      "\u0060var m map[K]V\u0060 gives the nil zero value and has length zero.",
      "Nil-map reads are safe, but \u0060m[key] = value\u0060 panics.",
      "\u0060make(map[K]V)\u0060 creates an empty, writable map.",
      "\u0060map[K]V{...}\u0060 creates a writable map with optional starting entries.",
      "The size argument to \u0060make\u0060 is an initial-space hint, not a capacity limit.",
    ],
    beats: [
      {
        cue: "Define the zero value before comparing constructors",
        stage: "A nil map is the zero value",
        spokenText: "A map variable declared without initialization has the zero value \u0060nil\u0060. For example, \u0060var counts map[string]int\u0060 creates no writable map yet. Its length is zero, and comparing it with nil tells whether initialization has happened.",
      },
      {
        cue: "Separate safe nil-map operations from assignment",
        stage: "Reads are safe; writes panic",
        spokenText: "Lookup on a nil map returns the value type's zero value and \u0060ok == false\u0060. \u0060len\u0060 is zero, range has no iterations, and delete or clear does nothing. Key assignment such as \u0060counts[\"Go\"] = 1\u0060 panics because there is no initialized map to receive the entry.",
      },
      {
        cue: "Use make for a map built over time",
        stage: "Make creates an empty map",
        spokenText: "The expression \u0060make(map[string]int)\u0060 returns an initialized, empty map. It is the usual choice when a loop, decoder, or counting operation will add entries later. The map starts with length zero but accepts assignments immediately.",
      },
      {
        cue: "Use a literal when starting data is known",
        stage: "A literal can add entries",
        spokenText: "A literal such as \u0060ports := map[string]int{\"http\": 80, \"https\": 443}\u0060 creates an initialized map and inserts those entries. An empty literal, \u0060map[string]int{}\u0060, is also non-nil and writable. Literals make small fixed starting tables easy to read next to their declaration.",
      },
      {
        cue: "Clarify what the make size argument means",
        stage: "The size is only a hint",
        spokenText: "The form \u0060make(map[K]V, n)\u0060 asks for initial space for approximately n entries. It can reduce early growth when the size is predictable, but it does not create n entries, set a maximum, or expose map capacity. Maps still grow as keys are added.",
        recallRule: "Nil maps can be read but not written; make and literals both create writable maps.",
      },
    ],
    overview: {
      title: "Map initialization defines the write boundary",
      content: "Nil and initialized maps have the same Go type, so functions can accept either without a second API. Their read behavior is intentionally similar: a missing lookup returns the value type's zero value, the comma-ok flag is false, length is zero, and range produces no entries. Delete and clear are also safe no-ops on a nil map.\n\nThe important difference appears on assignment. A nil map has no initialized structure in which to store a key, so \u0060m[key] = value\u0060 panics. This makes the zero value useful for an optional empty, read-only state while still requiring a clear initialization step before collection begins.\n\nBoth \u0060make(map[K]V)\u0060 and \u0060map[K]V{}\u0060 create non-nil, writable maps. Make reads naturally when entries will be discovered in a loop or decoded from input. A literal reads naturally when the starting key-value pairs are known at the declaration site. An empty literal and make are equivalent for the basic write behavior.\n\nThe second argument to make is an implementation hint for roughly how many entries are expected initially. It does not change length, because no keys exist until they are assigned. It also does not create a fixed capacity or stop later growth. Use a reasonable hint when it avoids useful allocation work, but choose nil, make, or a literal primarily from whether writes and starting entries are required now.",
    },
    visual: {
      type: "comparison_table",
      title: "Three map starting states",
      content: "| Form | Initial state | Lookup | Key assignment | Best fit |\n|---|---|---|---|---|\n| \u0060var m map[K]V\u0060 | Nil, length 0 | Zero value and false | Panics | Optional empty, read-only state |\n| \u0060make(map[K]V)\u0060 | Non-nil, length 0 | Zero value and false | Works | Entries collected later |\n| \u0060map[K]V{...}\u0060 | Non-nil, optional entries | Stored or zero value | Works | Known starting entries |",
    },
    example: {
      title: "Compare nil, made, and literal maps",
      code: "package main\n\nimport \"fmt\"\n\nfunc main() {\n\tvar nilCounts map[string]int\n\tvalue, ok := nilCounts[\"Go\"]\n\tfmt.Println(nilCounts == nil, len(nilCounts), value, ok)\n\n\tcounts := make(map[string]int, 2)\n\tcounts[\"Go\"]++\n\n\tports := map[string]int{\"http\": 80, \"https\": 443}\n\tfmt.Println(counts[\"Go\"], ports[\"https\"])\n}",
    },
  },
  "go-slices-maps-maps-make-and-literal-when-to-use": {
    directAnswer: "A one-result lookup, \u0060value := m[key]\u0060, returns the stored value when the key exists and the value type's zero value when it does not. The comma-ok form, \u0060value, ok := m[key]\u0060, adds a boolean that is true only when the key is present. This distinguishes a missing key from a present key whose stored value is zero, false, empty, or nil. Use one result when absence deliberately means zero; use comma-ok when presence changes the program's decision.",
    quick: [
      "A missing key returns the value type's zero value.",
      "\u0060value, ok := m[key]\u0060 reports both the value and key presence.",
      "\u0060ok\u0060 is true for a present key even when its stored value is zero.",
      "One-result lookup is enough when missing and zero intentionally mean the same thing.",
      "Lookup on a nil map returns the zero value with \u0060ok == false\u0060.",
    ],
    beats: [
      {
        cue: "Define what every map lookup returns",
        stage: "Lookup always returns a value",
        spokenText: "A map lookup never needs a separate missing-value object. The expression \u0060value := m[key]\u0060 returns the stored value when the key exists. If the key is absent, it returns the zero value of V, such as 0 for int or an empty string for string.",
      },
      {
        cue: "Add the boolean when presence matters",
        stage: "Ok reports key presence",
        spokenText: "The two-result form is \u0060value, ok := m[key]\u0060. The boolean is true when the key exists and false when it does not. Value is still returned in both cases, so the two results answer separate questions: what value came back, and was it stored?",
      },
      {
        cue: "Use a zero-valued entry to show the difference",
        stage: "Zero can still be present",
        spokenText: "For \u0060settings := map[string]int{\"retries\": 0}\u0060, looking up retries gives \u00600, true\u0060. Looking up timeout gives \u00600, false\u0060. Comparing only with zero cannot tell those cases apart, but the ok flag can.",
      },
      {
        cue: "Choose one or two results from application meaning",
        stage: "Choose the form by meaning",
        spokenText: "One result is convenient when absence naturally behaves like zero, as in \u0060counts[word]++\u0060 on an initialized counter map. Use comma-ok for configuration, caches, validation, and membership tests where a stored zero, false, empty string, or nil pointer is different from no entry.",
      },
      {
        cue: "Include nil maps in the same lookup rule",
        stage: "Nil maps follow the same rule",
        spokenText: "A nil map behaves like an empty map during lookup, so comma-ok returns V's zero value and false. When only membership matters, discard the value with \u0060_, ok := m[key]\u0060. Test ok rather than trying to infer presence from the returned value.",
        recallRule: "The value answers what was found; ok answers whether the key existed.",
      },
    ],
    overview: {
      title: "Map values and key presence are separate facts",
      content: "Every map value type has a zero value. Go uses that value as the result of a missing lookup, which makes ordinary reads concise and avoids forcing optional wrappers into simple counting or grouping code. The trade-off is that the returned value alone may not reveal whether an entry existed.\n\nThis ambiguity is easy to see with numbers. A retry count of zero can be meaningful stored data, yet a missing retry key also reads as zero. The two-result expression \u0060value, ok := settings[key]\u0060 keeps those cases separate. The same issue occurs with false booleans, empty strings, zero-valued structs, and nil pointers stored as legitimate values.\n\nUse a one-result lookup when the zero-value default is exactly the desired behavior. Word counters rely on this property because reading a new word as zero makes the first increment produce one. Use comma-ok when absence should select a fallback, cause an error, avoid repeated cache work, or answer a membership question. If only membership matters, \u0060_, ok := set[key]\u0060 makes that intent direct.\n\nNil maps follow the same read rule as initialized empty maps: lookup returns the zero value and false. This keeps read-only functions simple, but it does not make nil maps writable. The comma-ok result should be read as presence information, never as a test for whether the returned value happens to look empty.",
    },
    visual: {
      type: "comparison_table",
      title: "The same value can describe two lookup results",
      content: "| Lookup | Value | \u0060ok\u0060 | Meaning |\n|---|---:|---|---|\n| Stored \u0060retries: 0\u0060 | 0 | true | Key exists with a zero value |\n| Missing \u0060timeout\u0060 | 0 | false | Key does not exist |\n| Any key in nil \u0060map[string]int\u0060 | 0 | false | Nil map reads as empty |",
    },
    example: {
      title: "Distinguish stored zero from a missing key",
      code: "package main\n\nimport \"fmt\"\n\nfunc main() {\n\tsettings := map[string]int{\"retries\": 0, \"timeout\": 30}\n\tfor _, key := range []string{\"retries\", \"timeout\", \"workers\"} {\n\t\tvalue, ok := settings[key]\n\t\tfmt.Printf(\"%s: value=%d present=%t\\n\", key, value, ok)\n\t}\n\n\tvar missing map[string]int\n\tvalue, ok := missing[\"retries\"]\n\tfmt.Println(\"nil map:\", value, ok)\n}",
    },
  },
  "go-slices-maps-maps-make-and-literal-common-mistake": {
    directAnswer: "A Go map key type must be comparable with \u0060==\u0060 and \u0060!=\u0060. Booleans, numbers, strings, pointers, channels, and interfaces can be key types. Arrays are valid when their element type is comparable, and structs are valid when every field is comparable. Slices, maps, and functions cannot be keys. An interface key needs extra care: its static type is allowed, but inserting a dynamic value such as a slice panics. A legal key should also have equality that matches the application's idea of identity.",
    quick: [
      "A map key type must support equality with \u0060==\u0060 and \u0060!=\u0060.",
      "Strings, integers, booleans, pointers, and channels are valid key types.",
      "Arrays and structs work only when all of their components are comparable.",
      "Slices, maps, and functions cannot be used as map keys.",
      "An interface key panics on insertion when its dynamic value is not comparable.",
    ],
    beats: [
      {
        cue: "State the language rule in terms of equality",
        stage: "Keys need stable equality",
        spokenText: "A map has to decide whether a lookup key matches an existing entry, so its key type must be comparable with \u0060==\u0060 and \u0060!=\u0060. The rule is about the key's whole value, not whether its text representation happens to look unique.",
      },
      {
        cue: "List ordinary comparable key types",
        stage: "Basic comparable keys work",
        spokenText: "Booleans, numeric types, strings, pointers, and channels are comparable and may be keys. A pointer key compares pointer identity, not the contents of the pointed object. Strings are often convenient when textual content itself defines identity.",
      },
      {
        cue: "Explain comparability for arrays and structs",
        stage: "Composite keys are recursive",
        spokenText: "An array is comparable when its element type is comparable. A struct is comparable when every field is comparable. That makes \u0060map[Cell]bool\u0060 valid for \u0060type Cell struct { Row, Col int }\u0060, because both fields are integers.",
      },
      {
        cue: "Show why variable container values fail the rule",
        stage: "Slices cannot be map keys",
        spokenText: "Slices, maps, and functions do not support general value equality, so declarations such as \u0060map[[]byte]string\u0060 are invalid. When byte content is the identity, use a string or a fixed array of comparable bytes; otherwise choose a stable ID that expresses the intended equality.",
      },
      {
        cue: "Cover the interface and awkward-key boundary",
        stage: "Interfaces need runtime care",
        spokenText: "An interface type can be a map key, but every dynamic value inserted through it must also be comparable. Putting a slice into \u0060map[any]string\u0060 panics. Legal does not always mean suitable either: floating-point NaN is not equal to itself, so it behaves badly as a retrievable key.",
        recallRule: "Use a comparable key whose equality is the same equality the application needs.",
      },
    ],
    overview: {
      title: "Comparability is the map key contract",
      content: "A map associates entries by key equality. Go therefore limits key types to values the language can compare with \u0060==\u0060 and \u0060!=\u0060. Common identifiers such as strings, integers, booleans, pointers, and channels meet that rule directly. Pointer equality means the same address, so two different pointers to equal-looking objects are still different keys.\n\nComparability is recursive for composite values. Two arrays can be compared when their element type is comparable, and two structs can be compared when every field is comparable. This makes a small value object such as \u0060Cell{Row, Col}\u0060 a useful key: its equality is clear, stable, and includes both coordinates. A fixed byte array can likewise represent a digest or fixed-size identifier.\n\nSlices, maps, and functions do not have general value equality and cannot be key types. If slice contents define identity, code can derive a comparable key, such as an immutable string for bytes or a digest. That conversion should reflect application meaning rather than merely force the compiler to accept the type.\n\nInterface key types move part of the check to run time. The interface type is permitted, but inserting a dynamic slice, map, or function panics. Even comparable values need sensible equality: mutable pointed-to contents do not change pointer identity, and floating-point NaN is not equal to itself. Choose a key that remains stable and makes repeated construction and lookup behave predictably.",
    },
    visual: {
      type: "comparison_table",
      title: "Common map key candidates",
      content: "| Candidate | Valid key? | Equality used |\n|---|---|---|\n| \u0060string\u0060 or \u0060int\u0060 | Yes | Value equality |\n| \u0060[16]byte\u0060 | Yes | Element-by-element array equality |\n| \u0060struct{ Row, Col int }\u0060 | Yes | Equality of every field |\n| \u0060[]byte\u0060 | No | Slices have no general value equality |\n| \u0060map[string]int\u0060 or function | No | These types are not comparable |\n| \u0060any\u0060 | Type allowed | Dynamic value must also be comparable |",
    },
    example: {
      title: "Use a comparable value object as a key",
      code: "package main\n\nimport \"fmt\"\n\ntype Cell struct {\n\tRow int\n\tCol int\n}\n\nfunc main() {\n\tvisits := map[Cell]int{}\n\tvisits[Cell{Row: 2, Col: 3}]++\n\tvisits[Cell{Row: 2, Col: 3}]++\n\n\tdigestNames := map[[4]byte]string{\n\t\t{0xCA, 0xFE, 0xBA, 0xBE}: \"header\",\n\t}\n\n\tfmt.Println(visits[Cell{Row: 2, Col: 3}])\n\tfmt.Println(digestNames[[4]byte{0xCA, 0xFE, 0xBA, 0xBE}])\n}",
    },
  },
  "go-slices-maps-maps-make-and-literal-compare": {
    directAnswer: "A map index expression is not addressable, so when \u0060users\u0060 has type \u0060map[int]User\u0060, \u0060users[id].Name = value\u0060 does not compile. Lookup returns a copy of the stored struct. Read that value, change the copy, and assign the whole struct back: \u0060u := users[id]; u.Name = value; users[id] = u\u0060. Alternatively, \u0060map[int]*User\u0060 stores pointers, so code can mutate the separate pointed-to object. Pointer entries require clear aliasing ownership plus missing-key and nil checks.",
    quick: [
      "A Go map element can be replaced, but its storage is not addressable.",
      "A struct lookup returns a value copy, so direct field assignment does not compile.",
      "For value entries, read the struct, modify it, and assign the whole value back.",
      "A pointer entry allows mutation of the separate object reached by that pointer.",
      "Pointer maps add aliasing and nil handling; value maps still need synchronization for shared writes.",
    ],
    beats: [
      {
        cue: "State the addressability rule directly",
        stage: "Map elements lack addresses",
        spokenText: "The language does not make an individual map element addressable. A map may reorganize its internal entry storage as it changes, so code cannot keep a dependable address for \u0060m[key]\u0060. The whole map element can be assigned, but a field inside a struct element cannot be targeted in place.",
      },
      {
        cue: "Apply the rule to a struct lookup",
        stage: "Struct lookup returns a copy",
        spokenText: "With \u0060users map[int]User\u0060, the expression \u0060users[7]\u0060 produces a User value. Therefore \u0060users[7].Active = true\u0060 does not compile: the field belongs to a temporary copy, not to an addressable variable inside the map.",
      },
      {
        cue: "Show the value-entry update pattern",
        stage: "Write the changed value back",
        spokenText: "Read, modify, and replace the entry: \u0060u, ok := users[id]\u0060; check ok when absence matters; set \u0060u.Active = true\u0060; then write \u0060users[id] = u\u0060. Assigning the whole value back is the step that changes the map entry.",
      },
      {
        cue: "Explain why a pointer-valued map behaves differently",
        stage: "Pointers keep objects outside",
        spokenText: "A \u0060map[int]*User\u0060 stores pointer values. Lookup copies a pointer, and dereferencing that pointer reaches a User object stored separately from the map's entry table. After checking that the key exists and the pointer is non-nil, \u0060users[id].Active = true\u0060 can mutate that object.",
      },
      {
        cue: "Choose semantics and state the concurrency boundary",
        stage: "Choose values or pointers",
        spokenText: "Use value entries for small records that should be replaced as values. Use pointers when several parts of the program intentionally share one mutable object. Pointer maps add nil and aliasing concerns, and neither design makes concurrent map access safe; shared reads and writes still need synchronization.",
        recallRule: "Map struct values are copied and replaced; map pointers lead to separately addressable objects.",
      },
    ],
    overview: {
      title: "Value replacement and pointer mutation are different models",
      content: "A Go map index is valid on the left side when assigning an entire value, as in \u0060users[id] = updated\u0060. It is not an addressable variable, so code cannot take \u0060&users[id]\u0060 or select a struct field and assign to it. This rule lets map implementations manage and move their entry storage without exposing unstable addresses.\n\nFor \u0060map[int]User\u0060, lookup copies the User value. The normal update is a read-modify-write sequence: retrieve the struct, confirm the key exists if necessary, change fields on the local variable, and assign the complete struct back under the same key. Without the final assignment, only the local copy changes. Without the presence check, a missing lookup starts from a zero-valued User and the write-back creates a new entry, which may or may not be intended.\n\nA \u0060map[int]*User\u0060 changes the model. The map still returns a copied value, but that value is a pointer to an object stored elsewhere. Code can mutate the pointed-to User after checking for a missing key and nil pointer. Every holder of that pointer can observe the mutation, so ownership and aliasing must be deliberate.\n\nValue entries are often simple for small immutable-style records, though any slice, map, or pointer fields inside them are still shallow copies. Pointer entries fit shared mutable identity but add allocation and nil cases. The value update sequence is not an atomic transaction, and ordinary Go maps do not support unsynchronized concurrent reads and writes; protect shared updates regardless of which value model is chosen.",
    },
    visual: {
      type: "flow_diagram",
      title: "Two ways to update a mapped user",
      content: "\u0060\u0060\u0060mermaid\nflowchart LR\n  A[map int User] --> B[Lookup copies User]\n  B --> C[Modify local copy]\n  C --> D[Assign whole User back]\n  E[map int pointer User] --> F[Lookup copies pointer]\n  F --> G[Check present and non-nil]\n  G --> H[Mutate separate User object]\n\u0060\u0060\u0060\nValue entries require replacement; pointer entries allow mutation through the returned pointer.",
    },
    example: {
      title: "Update both value and pointer map entries safely",
      code: "package main\n\nimport \"fmt\"\n\ntype User struct {\n\tName   string\n\tActive bool\n}\n\nfunc activateValue(users map[int]User, id int) bool {\n\tuser, ok := users[id]\n\tif !ok {\n\t\treturn false\n\t}\n\tuser.Active = true\n\tusers[id] = user\n\treturn true\n}\n\nfunc activatePointer(users map[int]*User, id int) bool {\n\tuser, ok := users[id]\n\tif !ok || user == nil {\n\t\treturn false\n\t}\n\tuser.Active = true\n\treturn true\n}\n\nfunc main() {\n\tvalues := map[int]User{7: {Name: \"Mina\"}}\n\tpointers := map[int]*User{8: {Name: \"Noah\"}}\n\n\tactivateValue(values, 7)\n\tactivatePointer(pointers, 8)\n\tfmt.Println(values[7], *pointers[8])\n}",
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
    throw new Error("Missing an existing map lesson section for " + targetSlug);
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
console.log("Curated " + curated + " Go map construction lessons");
