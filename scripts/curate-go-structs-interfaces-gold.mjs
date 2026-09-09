#!/usr/bin/env node

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const contentRoot = path.join(repoRoot, "content/go-fresher/go-structs-interfaces-basics");

function go(source) {
  return `\`\`\`go\n${source.trim()}\n\`\`\``;
}

const topicSpecs = {
  "struct-definition": {
    title: "Struct Definition",
    questions: [
      {
        question: "What is a struct in Go, and how do you define one?",
        title: "Defining structs in Go",
        direct: "A struct is a value type that groups a fixed set of named fields into one record. Define a named struct with `type Name struct { ... }`, then create values of that type to represent related data such as a user, order, or coordinate. A struct holds data; methods are declared separately with a receiver, and every field receives its zero value when no value is supplied.",
        points: [
          "A struct groups named fields into one value type.",
          "Declare it with `type Name struct { ... }`.",
          "Fields may have different types and are selected with `value.Field`.",
          "Unspecified fields receive their type's zero value.",
          "Methods are declared outside the struct body with a receiver.",
        ],
        answerSize: "compact",
        spoken: "- A struct is Go's way to combine related data into one value with a known shape. A declaration such as `type User struct { Name string; Active bool }` creates a new named type with two fields. Each `User` value contains both fields, and code accesses them with selectors such as `user.Name`.\n\n- Structs are value types. Assigning one struct to another or passing it by value copies the struct value. The fields inside still follow their own rules, so copying a struct that contains a slice copies the slice descriptor, not the slice's backing array. That distinction matters when a record contains reference-like fields.\n\n- For example, `var user User` is already usable: `Name` is the empty string and `Active` is false. A composite literal such as `User{Name: \"Asha\", Active: true}` supplies selected values. Methods do not appear inside the declaration; `func (u User) Label() string` is written separately and associates behaviour with the named type.\n\n- A struct is a good fit when the program knows the fields and their meanings at compile time. It is less suitable for truly dynamic keys, where a map may be clearer. The main idea is that a struct gives related data a named, compiler-checked shape while remaining an ordinary Go value.",
        overviewTitle: "A record with a compile-time shape",
        overview: "A struct declaration describes a layout, not an object hierarchy. Every field has a name and a type, so the compiler can reject misspelled fields and invalid assignments. The declaration may contain fields or embedded fields, but it does not contain method bodies.\n\nA named struct can receive methods because it is a defined type. The data and behaviour are connected through the receiver in each method declaration. This keeps the record shape visible while allowing different APIs to work with the value, a pointer to it, or an interface that its methods satisfy.",
        visual: {
          type: "concept_map",
          title: "How data and behaviour meet",
          content: "```mermaid\nflowchart LR\n  A[type User struct] --> B[Name string]\n  A --> C[Active bool]\n  D[User value] --> B\n  D --> C\n  E[Method with User receiver] --> D\n```",
        },
        exampleTitle: "Define and use a zero-value-friendly record",
        code: go(`package main

import "fmt"

type User struct {
    Name   string
    Active bool
}

func (u User) Label() string {
    return fmt.Sprintf("%s active=%t", u.Name, u.Active)
}

func main() {
    var empty User
    named := User{Name: "Asha", Active: true}
    fmt.Println(empty.Label())
    fmt.Println(named.Label())
}`),
        exampleNote: "The first line uses the field zero values; the second uses a keyed struct literal. Both are complete `User` values.",
        testing: "Whether a struct is understood as a typed value with fields rather than as a class declaration.",
        commonMistake: "Assuming methods are written inside the struct or that an uninitialized struct has no usable value.",
        depthSignal: "Explain the value-copy rule and the separate receiver-based method declaration.",
      },
      {
        question: "What is the zero value of a Go struct?",
        title: "The zero value of a struct",
        direct: "The zero value of a struct is a struct value whose fields each hold the zero value of their own type. Numeric fields are zero, booleans are false, strings are empty, and pointer, slice, map, function, channel, and interface fields are nil. A well-designed type often makes this state safe and useful, but fields such as nil maps still have their normal operation limits.",
        points: [
          "A zero struct exists without calling a constructor.",
          "Every field independently receives its type's zero value.",
          "Nested structs are recursively zero-valued.",
          "Reading a nil map is safe, but writing to it panics.",
          "Constructors are still useful when invariants or resources must be established.",
        ],
        answerSize: "compact",
        spoken: "- A variable declared as `var x T` always has a value in Go. When `T` is a struct, that value is built by assigning the zero value to every field. A nested struct is zeroed recursively, while fields such as pointers, slices, maps, channels, functions, and interfaces begin as nil. There is no uninitialized-memory state visible to ordinary Go code.\n\n- This makes many simple types pleasant to use. For example, a `Counter` with an integer field can start counting immediately because zero is a sensible initial count. Types in the standard library such as `bytes.Buffer` and `sync.Mutex` are deliberately useful at their zero values, so callers do not need constructors just to establish valid state.\n\n- Zero-valued does not mean every operation is valid. A nil map field can be read, but assigning a key to it panics until code allocates the map. A nil pointer field cannot be dereferenced. The containing struct itself is valid; its methods must respect the state of those fields.\n\n- A constructor remains appropriate when a type needs mandatory data, validation, an allocated collection, or an external resource. The useful design test is whether accidental `var T` usage is safe. If the zero value cannot represent a valid state, the package should expose a constructor and make the invariant clear.",
        overviewTitle: "Zeroing happens field by field",
        overview: "The language does not run a hidden constructor. It applies the ordinary zero-value rule to the struct's fields. For a nested struct, the same rule continues through its fields. This creates a deterministic baseline that can be inspected, compared when the type is comparable, and passed to methods.\n\nWhether that baseline is useful is an API-design decision. A numeric accumulator naturally starts at zero. A client that requires a URL and authenticated transport probably needs construction. Safe methods can lazily initialize an internal map, but that policy should be deliberate rather than assumed.",
        visual: {
          type: "comparison_table",
          title: "Fields inside a zero-valued struct",
          content: "| Field type | Zero value | Important boundary |\n|---|---|---|\n| `int` | `0` | Ready for arithmetic |\n| `string` | `\"\"` | Valid empty text |\n| `bool` | `false` | May represent the default state |\n| `[]T` | `nil` | Range and append work |\n| `map[K]V` | `nil` | Reads work; writes panic |\n| `*T` | `nil` | Must be checked before dereference |",
        },
        exampleTitle: "Use one zero value and initialize only what needs storage",
        code: go(`package main

import "fmt"

type Stats struct {
    Requests int
    Labels   map[string]string
}

func (s *Stats) AddLabel(key, value string) {
    if s.Labels == nil {
        s.Labels = make(map[string]string)
    }
    s.Labels[key] = value
}

func main() {
    var stats Stats
    stats.Requests++
    stats.AddLabel("env", "test")
    fmt.Println(stats.Requests, stats.Labels["env"])
}`),
        exampleNote: "`Requests` needs no setup. The method allocates the map only before its first write, so the whole struct remains useful from its zero value.",
        testing: "Knowledge of recursive field zeroing and the difference between a valid zero struct and valid operations on every nil field.",
        commonMistake: "Calling the zero value unusable, or assuming a nil map can be written because a nil slice can be appended to.",
        depthSignal: "Separate the language rule from the API choice to make a type zero-value-friendly.",
      },
      {
        question: "When can Go struct values be compared with `==`?",
        title: "Struct comparability in Go",
        direct: "A struct type is comparable when every one of its fields is comparable. Two values of that type are equal when all corresponding non-blank fields are equal. Strings, booleans, numbers, pointers, channels, interfaces, arrays of comparable elements, and comparable structs may participate; a slice, map, or function field makes the entire struct non-comparable.",
        points: [
          "Every field must be comparable for the struct to be comparable.",
          "Equality checks corresponding fields using their normal equality rules.",
          "Slice, map, and function fields make a struct non-comparable.",
          "Comparable structs may be used as map keys.",
          "An interface comparison can still panic if its dynamic value is non-comparable.",
        ],
        answerSize: "compact",
        spoken: "- Go permits `==` and `!=` on a struct only when all of that struct's fields are comparable. Equality then compares corresponding fields. A `Point` containing two integers is comparable, and a `UserKey` containing strings and an integer is comparable, so either type can also be used as a map key.\n\n- Comparability is structural. Adding a slice, map, or function field changes the property of the whole struct because those types cannot be compared with `==` except against nil where allowed. For example, `type Report struct { Name string; Tags []string }` cannot be compared directly, even when both `Tags` slices happen to contain the same elements. Code must define the intended equality, such as comparing fields and using `slices.Equal` for the slice.\n\n- Blank fields are ignored when struct values are compared, but this is uncommon in application records. Interface fields require extra care: the interface type is comparable, yet comparing two interface values panics if their identical dynamic type is itself non-comparable, such as a slice.\n\n- I use direct struct equality for small value objects whose fields have clear value semantics. For records containing collections, functions, or resources, I write an explicit equality function that documents what identity means. That remains correct when representation and business equality are not the same thing.",
        overviewTitle: "Comparability flows inward from every field",
        overview: "The compiler decides struct comparability from the declared field types, not from the values present in one instance. A nil slice still has slice type, so placing it in a struct does not make that instance comparable. Arrays differ from slices: an array is comparable when its element type is comparable.\n\nDirect equality is exact field equality. It does not perform fuzzy floating-point comparison, normalize text, or compare collection contents. Domain rules may therefore need a named `Equal` function even when `==` is legal.",
        visual: {
          type: "flow_diagram",
          title: "Decide whether a struct is comparable",
          content: "```mermaid\nflowchart TD\n  A[Inspect every field type] --> B{Any slice, map, or function?}\n  B -- Yes --> C[Struct is not comparable]\n  B -- No --> D{Every nested array or struct comparable?}\n  D -- No --> C\n  D -- Yes --> E[Struct supports == and map keys]\n```",
        },
        exampleTitle: "Use a comparable struct as a map key",
        code: go(`package main

import "fmt"

type UserKey struct {
    Tenant string
    ID     int
}

func main() {
    first := UserKey{Tenant: "acme", ID: 7}
    second := UserKey{Tenant: "acme", ID: 7}
    owners := map[UserKey]string{first: "Mina"}
    fmt.Println(first == second, owners[second])
}`),
        exampleNote: "The output is `true Mina`. Both fields are comparable, so equality and map-key lookup use the complete struct value.",
        testing: "Whether struct equality is derived from field types and separated from domain-specific equality.",
        commonMistake: "Trying to compare a struct that contains a slice, or assuming direct equality compares slice contents.",
        depthSignal: "Mention the dynamic-value boundary when a comparable interface field contains a non-comparable value.",
      },
    ],
  },

  "struct-literal-and-fields": {
    title: "Struct Literals and Fields",
    questions: [
      {
        question: "What is the difference between keyed and positional struct literals in Go?",
        title: "Keyed versus positional struct literals",
        direct: "A keyed struct literal names each field, such as `User{Name: \"Asha\", Age: 24}`, while a positional literal supplies one value for every field in declaration order, such as `User{\"Asha\", 24}`. Keyed literals may omit fields and are safer when a struct evolves; positional literals are concise but couple the call site to field order and cannot refer to unexported fields from another package.",
        points: [
          "Keyed literals use `Field: value` and allow omitted fields.",
          "Positional literals require one value for every field in order.",
          "Do not mix keyed and positional elements in one literal.",
          "Keyed literals survive most field reordering and additions.",
          "Use keyed literals for structs owned by another package.",
        ],
        answerSize: "compact",
        spoken: "- A keyed literal pairs field names with values, while a positional literal relies on the struct's declaration order. Both create the same struct type, but they express different levels of coupling. `User{Name: \"Asha\", Age: 24}` documents the meaning at the call site; `User{\"Asha\", 24}` asks the reader to remember the declaration.\n\n- Keyed literals can initialize only the fields that matter. Every omitted field receives its zero value. A positional literal must provide an element for every field, in order, and one literal cannot mix keyed and unkeyed elements. This is enforced by the compiler.\n\n- For example, adding an `Active bool` field to `User` leaves most keyed literals valid because the new field becomes false when omitted. Existing positional literals stop compiling, which is safer than silently shifting values, but it means every coupled call site needs an edit. Reordering same-typed fields can be even more fragile within the package because positional code may still compile with changed meaning.\n\n- I prefer keyed literals for application records and all structs from another package. Positional form can be reasonable for tiny, stable local structs where order is unmistakable. The choice is not about runtime speed; it is about clarity, package boundaries, and resilience to a changing record shape.",
        overviewTitle: "Literal syntax exposes how tightly the caller knows the layout",
        overview: "A keyed literal depends on field names and types. A positional literal depends on the complete sequence of fields. That sequence includes fields the caller may not conceptually care about, so positional construction creates a stronger link between definition and use.\n\nPackage visibility adds a hard boundary. Code outside the defining package cannot use a struct literal to set unexported fields. Constructors are often the intended API for such types because they can validate inputs and establish private state.",
        visual: {
          type: "comparison_table",
          title: "Two construction contracts",
          content: "| Property | Keyed literal | Positional literal |\n|---|---|---|\n| Names fields | Yes | No |\n| May omit fields | Yes | No |\n| Depends on field order | No | Yes |\n| Clear at call site | Usually | Only for tiny familiar types |\n| Good across package evolution | Better | More tightly coupled |",
        },
        exampleTitle: "Construct the same value in both forms",
        code: go(`package main

import "fmt"

type Point struct {
    X int
    Y int
}

func main() {
    keyed := Point{Y: 4, X: 3}
    positional := Point{3, 4}
    fmt.Println(keyed, positional, keyed == positional)
}`),
        exampleNote: "The output ends in `true`. The keyed literal may list fields in either order; the positional literal follows `X`, then `Y`.",
        testing: "Understanding the syntax, omission rule, and maintenance coupling of the two literal forms.",
        commonMistake: "Using positional literals for evolving records or mixing keyed and positional elements.",
        depthSignal: "Connect the syntax choice to package visibility and future field changes.",
      },
      {
        question: "What happens when fields are omitted from a Go struct literal?",
        title: "Omitted fields in struct literals",
        direct: "In a keyed struct literal, every omitted field receives that field type's zero value. An empty literal `T{}` therefore produces the zero value of `T`. Omission is not available in a positional literal, which must provide every field. A zero value may be valid without being operational for every method, so constructors are still appropriate when fields are required or collections must be allocated.",
        points: [
          "Only keyed literals may omit selected fields.",
          "Every omitted field gets its normal zero value.",
          "`T{}` is the zero value of struct type `T`.",
          "Omission does not run defaults or a constructor.",
          "Validate required fields in a constructor or at the operation boundary.",
        ],
        answerSize: "compact",
        spoken: "- A keyed struct literal does not need to mention every field. Go fills each omitted position with the field type's zero value. For `Config{Port: 8080}`, a string field becomes empty, a Boolean becomes false, and a map or pointer becomes nil unless supplied. `Config{}` is simply the fully zero-valued struct.\n\n- The language does not interpret omission as an application default. If the desired host is `localhost` or the desired timeout is five seconds, code must assign those values explicitly, usually in a constructor or configuration-loading function. A zero number cannot tell whether the caller deliberately chose zero or forgot the field.\n\n- For example, `NewConfig()` can return `Config{Host: \"localhost\", Port: 8080}` while still allowing tests to write a small keyed literal when zero values are meaningful. If callers must never create an invalid value, unexported fields plus a constructor can enforce the boundary more strongly than documentation alone.\n\n- Omission is useful for optional state and for forward-compatible construction of records with sensible zeros. It is risky when zero conflicts with a mandatory domain invariant. The right question is not whether Go fills the field—it always does—but whether that filled value has a clear meaning in the type's API.",
        overviewTitle: "Language zeroing is different from domain defaulting",
        overview: "The compiler completes a keyed literal by applying type-level zero values. It does not call a function, read tags, or infer defaults from comments. This makes construction deterministic but intentionally minimal.\n\nDomain defaults belong in executable code. A constructor can choose them, validate combinations, allocate maps, or return an error. Public fields and literals trade that control for convenient transparent data construction, which is often exactly right for simple records.",
        visual: {
          type: "flow_diagram",
          title: "How a partial keyed literal becomes a full value",
          content: "```mermaid\nflowchart LR\n  A[Config with Port: 8080] --> B[Port = 8080]\n  A --> C[Host omitted -> empty string]\n  A --> D[Debug omitted -> false]\n  A --> E[Labels omitted -> nil map]\n```",
        },
        exampleTitle: "Separate zero values from chosen defaults",
        code: go(`package main

import "fmt"

type Config struct {
    Host  string
    Port  int
    Debug bool
}

func NewConfig() Config {
    return Config{Host: "localhost", Port: 8080}
}

func main() {
    partial := Config{Port: 3000}
    defaults := NewConfig()
    fmt.Printf("%q %d %t\\n", partial.Host, partial.Port, partial.Debug)
    fmt.Println(defaults)
}`),
        exampleNote: "The omitted `Host` is empty and `Debug` is false. Only `NewConfig` supplies application defaults.",
        testing: "Whether compiler-provided zero values are distinguished from business defaults and invariants.",
        commonMistake: "Assuming an omitted field receives a tag-based or constructor default.",
        depthSignal: "Explain when transparent literals are appropriate and when private fields plus construction are safer.",
      },
      {
        question: "How do `T{}`, `&T{}`, and `new(T)` differ for a struct?",
        title: "Struct values and pointers during construction",
        direct: "`T{}` creates a struct value, `&T{}` creates a pointer to a newly allocated struct value, and `new(T)` also returns a pointer to the zero value of `T`. For an empty literal, `&T{}` and `new(T)` have the same resulting type and zero-valued contents, but `&T{Field: value}` can initialize fields directly. Choose value or pointer semantics for the API rather than choosing by allocation folklore.",
        points: [
          "`T{}` has type `T`.",
          "`&T{}` has type `*T` and may initialize fields.",
          "`new(T)` has type `*T` pointing to the zero value.",
          "Go may place values on the stack or heap based on escape analysis.",
          "Use constructors for invariants, not merely to wrap `&T{}`.",
        ],
        answerSize: "compact",
        spoken: "- `T{}` evaluates to a value of struct type `T`. Taking its address, `&T{}`, yields `*T`, a pointer to that newly created value. The built-in `new(T)` also returns `*T`, but it always starts with the zero value and has no field-list syntax. Therefore, `new(User)` and `&User{}` are equivalent in type and initial contents.\n\n- The useful difference is expression and API shape. `&User{Name: \"Asha\"}` both initializes fields and returns a pointer. `User{Name: \"Asha\"}` returns a value, which can later be copied or addressed. If a function exposes a constructor, it can add validation or defaults rather than forcing callers to understand the representation.\n\n- For example, three variables can be declared as `value := Point{X: 2}`, `pointer := &Point{X: 2}`, and `zero := new(Point)`. Updating `pointer.X` changes the pointed-to object. Updating `value.X` changes that independent value. `zero.X` begins at zero.\n\n- These expressions do not guarantee stack versus heap placement. The compiler's escape analysis decides storage while preserving Go semantics. I choose `T` when a small value should be copied independently and `*T` when identity, shared mutation, a large value, or method-set requirements call for a pointer.",
        overviewTitle: "Construction syntax chooses a value shape, not a memory region",
        overview: "A pointer expression gives code an addressable shared identity. A value expression gives code the record itself. Either may ultimately live on the stack or heap; that implementation choice is not the semantic contract.\n\n`new` is a general built-in for allocating a zero value. Struct literals are more expressive because they can set fields. Constructors are ordinary functions and add value only when they express defaults, validation, dependencies, or a stable abstraction boundary.",
        visual: {
          type: "comparison_table",
          title: "Three construction forms",
          content: "| Expression | Static type | Initial contents | Can set fields inline? |\n|---|---|---|---:|\n| `T{}` | `T` | Supplied fields plus zeros | Yes |\n| `&T{}` | `*T` | Supplied fields plus zeros | Yes |\n| `new(T)` | `*T` | All fields zero-valued | No |",
        },
        exampleTitle: "Observe value and pointer construction",
        code: go(`package main

import "fmt"

type Point struct{ X, Y int }

func main() {
    value := Point{X: 2}
    pointer := &Point{X: 2}
    zero := new(Point)
    pointer.Y = 4
    fmt.Printf("%T %v\\n", value, value)
    fmt.Printf("%T %v\\n", pointer, *pointer)
    fmt.Printf("%T %v\\n", zero, *zero)
}`),
        exampleNote: "The types are `main.Point`, `*main.Point`, and `*main.Point`; the last pointed-to value contains only zeros.",
        testing: "Whether syntax, pointer semantics, constructors, and escape analysis are kept as separate concerns.",
        commonMistake: "Claiming `new(T)` is heap allocation while `T{}` is stack allocation.",
        depthSignal: "Choose between value and pointer by semantics, not by assuming a storage location.",
      },
    ],
  },

  "value-vs-pointer-receivers": {
    title: "Value versus Pointer Receivers",
    questions: [
      {
        question: "When should a Go method use a value receiver or a pointer receiver?",
        title: "Choosing a method receiver",
        direct: "Use a pointer receiver when a method must mutate the receiver, when copying it would be expensive or unsafe, or when receiver consistency and method-set requirements call for `*T`. A value receiver suits small immutable value-like types whose methods should operate on an independent copy. The choice affects mutation, copying, and interface satisfaction; it is not a way to force stack or heap allocation.",
        points: [
          "Mutation of receiver fields requires a pointer receiver.",
          "Avoid copying large structs or structs containing synchronization primitives.",
          "Value receivers fit small immutable value-like types.",
          "Keep the receiver style consistent across most methods of one type.",
          "Receiver choice changes the method sets of `T` and `*T`.",
        ],
        answerSize: "standard",
        spoken: "- A value receiver receives a copy of the receiver value, while a pointer receiver receives a pointer to the original value. If a method must assign to receiver fields or replace part of the struct, it needs `*T`; otherwise the assignments affect only the copy. That is the first and strongest decision rule.\n\n- Copy cost and copy safety come next. A large struct is usually better passed through a pointer, and a struct containing `sync.Mutex` or another no-copy value must not be copied after use. A small value object such as coordinates, a date-like value, or a scalar-defined type can use value receivers when each method naturally returns or observes an independent value.\n\n- For example, `func (a *Account) Deposit(n int)` must update the account balance, so it uses a pointer. A `Point.Distance()` method can read two small numeric fields using a value receiver. The receiver choice also affects interface satisfaction: methods declared on `T` belong to both `T` and `*T` method sets, while methods declared on `*T` belong only to `*T`.\n\n- I generally avoid mixing styles for one type unless there is a clear reason. Consistency makes APIs easier to predict and prevents an interface from accepting a value for some behaviour but unexpectedly requiring a pointer for another. The decision is about semantics, method sets, and copying—not a promise about where memory is allocated.",
        overviewTitle: "Ask about mutation, copying, and method sets",
        overview: "Receiver selection is the same kind of design decision as choosing a value or pointer parameter, with the additional effect on method sets. Mutation requires a pointer. Copying a lock is invalid and copying a large state can be wasteful. A small immutable value often benefits from value semantics.\n\nThe compiler may automatically take the address of an addressable value for a pointer-receiver method call, but that convenience does not add the method to `T`'s method set. Interface assignments still use the exact method-set rules.",
        visual: {
          type: "flow_diagram",
          title: "Receiver decision",
          content: "```mermaid\nflowchart TD\n  A[Choose receiver for T] --> B{Must mutate T?}\n  B -- Yes --> P[Use *T]\n  B -- No --> C{Large or unsafe to copy?}\n  C -- Yes --> P\n  C -- No --> D{Small value-like type?}\n  D -- Yes --> V[Value receiver can fit]\n  D -- No --> P\n  P --> E[Check consistency and interface method sets]\n  V --> E\n```",
        },
        exampleTitle: "Use receiver semantics that match the type",
        code: go(`package main

import "fmt"

type Point struct{ X, Y int }

func (p Point) Sum() int { return p.X + p.Y }

type Account struct{ Balance int }

func (a *Account) Deposit(amount int) { a.Balance += amount }

func main() {
    point := Point{X: 2, Y: 3}
    account := Account{Balance: 10}
    account.Deposit(5)
    fmt.Println(point.Sum(), account.Balance)
}`),
        exampleNote: "`Point.Sum` only observes a small value. `Account.Deposit` changes the original account and therefore uses `*Account`.",
        testing: "Whether the receiver choice follows mutation, copy safety, value semantics, and method sets.",
        commonMistake: "Choosing a value receiver for a mutating method or claiming pointer receivers always mean heap allocation.",
        depthSignal: "Mention synchronization fields and explain the interface-satisfaction effect.",
      },
      {
        question: "Why does a value-receiver method not change the original struct?",
        title: "Mutation through value receivers",
        direct: "A value-receiver method gets a copy of the receiver, so assigning to its fields changes only that copy. The original variable remains unchanged when the method returns. However, copying a struct is shallow: if a field contains a slice, map, pointer, or channel, both copies may still refer to shared underlying state, so a value receiver can indirectly mutate that shared data.",
        points: [
          "A value receiver is passed by value and receives a copy.",
          "Assigning a copied scalar field does not affect the caller's struct.",
          "The copy is shallow, not a recursive deep copy.",
          "Reference-like fields may still point to shared data.",
          "Use `*T` when the method promises to mutate the struct itself.",
        ],
        answerSize: "compact",
        spoken: "- Go passes every parameter by value, and a value receiver is receiver syntax for the same rule. When `func (p Point) Move(dx int)` runs, `p` is a copy. An assignment such as `p.X += dx` updates the copy, which disappears after the call, so the caller's `Point` is unchanged.\n\n- Changing the receiver variable itself and changing data reached through one of its fields are different operations. A struct copy is shallow. If it contains a slice, both copies initially hold slice descriptors pointing at the same backing array. A value-receiver method that writes `b.Values[0] = 9` can therefore change shared array data even though it cannot replace the caller's slice field. Maps and pointer fields have similar aliasing concerns.\n\n- For example, one method can attempt to set an integer field and another can update an element in a slice. After both calls, the integer on the original struct is unchanged but the slice element is different. That is normal copy semantics, not a receiver exception.\n\n- Methods that conceptually mutate the object should use a pointer receiver so the API communicates and performs that mutation consistently. Value receivers are safest when the entire value is treated as immutable or its reference-like fields are not changed. Understanding the shallow copy prevents surprising side effects hidden behind value-looking syntax.",
        overviewTitle: "Copy the fields, then follow any references they contain",
        overview: "Copying a struct duplicates its immediate fields. For an integer field, the copied integer is independent. For a slice field, the copied slice descriptor still names the same backing storage until an append causes one copy to move to another array.\n\nThe receiver keyword does not create deep immutability. API design must decide whether operations may mutate reachable data. A pointer receiver clearly permits changes to the struct's fields, but even a value receiver needs discipline when fields refer to shared state.",
        visual: {
          type: "diagram",
          title: "Shallow-copy effect",
          content: "```mermaid\nflowchart LR\n  A[Original Box] --> B[Count = 1]\n  A --> C[Slice descriptor]\n  D[Receiver copy] --> E[Copied Count = 1]\n  D --> F[Copied slice descriptor]\n  C --> G[Shared backing array]\n  F --> G\n```",
        },
        exampleTitle: "Contrast a copied field with shared slice data",
        code: go(`package main

import "fmt"

type Box struct {
    Count  int
    Values []int
}

func (b Box) SetCount(n int) { b.Count = n }
func (b Box) SetFirst(n int) { b.Values[0] = n }

func main() {
    box := Box{Count: 1, Values: []int{2, 3}}
    box.SetCount(9)
    box.SetFirst(8)
    fmt.Println(box.Count, box.Values)
}`),
        exampleNote: "The output is `1 [8 3]`: the scalar field was changed only on the receiver copy, while both slice descriptors reached the same array.",
        testing: "Whether value passing and shallow-copy aliasing are understood together.",
        commonMistake: "Assuming a value receiver either mutates everything or guarantees deep immutability.",
        depthSignal: "Trace the slice descriptor and its shared backing array rather than using the phrase 'copy' alone.",
      },
      {
        question: "What can go wrong when a value receiver copies a struct?",
        title: "Unsafe and surprising struct copies",
        direct: "A value receiver can be wrong when copying the receiver is expensive, breaks identity, duplicates synchronization state, or leaves reference-like fields sharing data in surprising ways. In particular, a struct containing `sync.Mutex` or a similar no-copy value must not be copied after first use. Pointer receivers avoid those copies, but the type's ownership and concurrency rules still need to be documented.",
        points: [
          "Large struct copies can add unnecessary work.",
          "Never copy an in-use `sync.Mutex` or another no-copy value.",
          "Slices, maps, pointers, and channels can retain shared state after copying.",
          "A copy may violate identity-based domain meaning.",
          "Use pointer receivers consistently when copying is unsafe.",
        ],
        answerSize: "compact",
        spoken: "- A value receiver copies all immediate fields before entering the method. That is cheap and clear for a small immutable value, but it can be the wrong contract for a large record or a type whose state represents one identity. The call looks like it operates on an object, yet changes to ordinary fields disappear with the copy.\n\n- Synchronization fields make the rule stricter. A `sync.Mutex` must not be copied after first use because the copy represents different lock state protecting data that may still be shared. Methods on a struct containing a mutex should therefore use pointer receivers, and assignments or returns that copy an active instance should also be avoided. `go vet` can report many lock-copy mistakes.\n\n- Reference-like fields create a different risk. Copying a cache struct copies its map header, so both receiver and original still reach the same map. A value method may mutate shared entries while an ordinary counter field changes only on the copy. Under concurrency, that mixture can produce races and misleading reasoning.\n\n- For example, a safe counter keeps a mutex and count in one instance and exposes pointer-receiver methods. The pointer does not by itself make the code thread-safe; the lock protocol does. The receiver choice simply avoids creating independent lock copies and preserves one clear identity for the protected state.",
        overviewTitle: "Some fields carry more than their visible bytes",
        overview: "A struct's representation may include handles to shared resources or values with usage rules. Copy syntax cannot infer those semantics. Mutexes, one-time guards, condition variables, open resource wrappers, and identity-bearing records often require a single stable instance.\n\nStatic analysis helps with known synchronization types, but design remains important. Keep the state private, use pointer methods, avoid exporting a copyable façade for a no-copy implementation, and document whether returned values share backing data.",
        visual: {
          type: "comparison_table",
          title: "Copy consequences by field kind",
          content: "| Field kind | What the struct copy produces | Main risk |\n|---|---|---|\n| Number or fixed array | Independent field value | Cost for large data |\n| Slice or map | New header, shared underlying data | Hidden aliasing or races |\n| Pointer | Another pointer to the same value | Shared mutation |\n| `sync.Mutex` | A separate lock state | Broken synchronization |",
        },
        exampleTitle: "Keep one mutex and one protected counter",
        code: go(`package main

import (
    "fmt"
    "sync"
)

type Counter struct {
    mu sync.Mutex
    n  int
}

func (c *Counter) Add() {
    c.mu.Lock()
    defer c.mu.Unlock()
    c.n++
}

func (c *Counter) Value() int {
    c.mu.Lock()
    defer c.mu.Unlock()
    return c.n
}

func main() {
    var counter Counter
    var workers sync.WaitGroup
    workers.Add(100)
    for i := 0; i < 100; i++ {
        go func() {
            defer workers.Done()
            counter.Add()
        }()
    }
    workers.Wait()
    fmt.Println(counter.Value())
}`),
        exampleNote: "The output is `100`. Both methods use `*Counter`, so all goroutines coordinate through the same mutex protecting the same `n` field.",
        testing: "Recognition of copy cost, identity, aliasing, and synchronization invariants.",
        commonMistake: "Copying a struct with a mutex or believing that value receivers make its referenced data independent.",
        depthSignal: "Connect pointer receivers to one lock identity, then state that locking—not the pointer—provides safety.",
      },
    ],
  },

  "method-sets": {
    title: "Method Sets",
    questions: [
      {
        question: "What are the method sets of `T` and `*T` in Go?",
        title: "Method sets of values and pointers",
        direct: "For a defined non-pointer, non-interface type `T`, the method set of `T` contains methods declared with receiver `T`. The method set of `*T` contains methods declared with receiver `T` or `*T`. These sets determine interface satisfaction and valid method expressions. Method-call shorthand on an addressable value can still call a pointer-receiver method, but it does not add that method to `T`'s method set.",
        points: [
          "`T` has methods declared with receiver `T`.",
          "`*T` has methods declared with receiver `T` and `*T`.",
          "Method sets determine whether a type satisfies an interface.",
          "An addressable `T` may call a pointer method through automatic addressing.",
          "Call shorthand does not change `T`'s method set.",
        ],
        answerSize: "standard",
        spoken: "- A method set is the collection of methods a type contributes for operations such as interface implementation. For a defined type `T`, its method set contains methods declared with a `T` receiver. For the pointer type `*T`, the method set contains both `T`-receiver and `*T`-receiver methods. This asymmetry preserves the fact that a pointer method may mutate the original value.\n\n- Suppose `Counter` has `Value()` on a value receiver and `Add()` on a pointer receiver. Both `Counter` and `*Counter` satisfy an interface that requires only `Value`. Only `*Counter` satisfies an interface that requires `Add`, because `Add` is absent from the method set of `Counter`. The compiler checks that relationship when assigning or passing values.\n\n- An addressable variable can make this look different at a call site. `counter.Add()` is allowed when `counter` is a variable because Go treats it as `(&counter).Add()`. That convenience applies to method calls; it does not make a non-pointer `Counter` satisfy `interface{ Add() }`. A temporary or an interface-held value may not have an address available for the same rewrite.\n\n- Method sets are therefore the reliable model for interface boundaries. I inspect the receiver on every required method, then choose whether the API should carry `T` or `*T`. Relying only on which calls happen to compile can hide the interface mismatch until a value is assigned elsewhere.",
        overviewTitle: "Method sets are capabilities attached to exact types",
        overview: "`T` and `*T` are different types. A value method can operate on a copied value whether the caller starts with a value or pointer, so it belongs to both usable pointer and value method sets. A pointer method requires pointer semantics, so it belongs only to `*T`.\n\nSelectors add ergonomic rewrites for addressable operands. Those rewrites explain why `v.PointerMethod()` can compile while `var x Interface = v` does not. Interface satisfaction is based on method sets, not on a hypothetical address the compiler could take later.",
        visual: {
          type: "diagram",
          title: "Receiver declarations and method sets",
          content: "```mermaid\nflowchart LR\n  V[Method receiver T] --> TS[method set of T]\n  V --> PS[method set of *T]\n  P[Method receiver *T] --> PS\n  TS --> I1[Interfaces requiring value methods]\n  PS --> I2[Interfaces requiring either receiver's methods]\n```",
        },
        exampleTitle: "Prove the two interface relationships",
        code: go(`package main

import "fmt"

type Counter int

func (c Counter) Value() int { return int(c) }
func (c *Counter) Add()      { *c++ }

type Reader interface{ Value() int }
type Incrementer interface{ Add() }

func main() {
    var counter Counter
    var reader Reader = counter
    var incrementer Incrementer = &counter
    incrementer.Add()
    fmt.Println(reader.Value(), counter.Value())
}`),
        exampleNote: "`Counter` satisfies `Reader`, while only `*Counter` satisfies `Incrementer`. The saved `reader` contains a value copy, so it still reports zero.",
        testing: "Exact knowledge of `T` and `*T` method sets and their interface consequence.",
        commonMistake: "Inferring interface satisfaction from an addressable variable's convenient method-call syntax.",
        depthSignal: "Explain why `counter.Add()` compiles while assigning `counter` to `Incrementer` does not.",
      },
      {
        question: "Why can a value call a pointer-receiver method but fail an interface assignment?",
        title: "Automatic addressing versus interface satisfaction",
        direct: "A value can call a pointer-receiver method only when the value is addressable, because Go rewrites `x.M()` to `(&x).M()` when needed. Interface assignment does not perform that rewrite: the exact dynamic type placed in the interface must already have the required method in its method set. Therefore `x.M()` may compile while `var i I = x` fails and `var i I = &x` succeeds.",
        points: [
          "Addressable variables can be automatically addressed for a method call.",
          "Interface conversion uses the exact source type's method set.",
          "A pointer-receiver method is not in `T`'s method set.",
          "Put `&value`, not `value`, into an interface requiring that method.",
          "Map elements and some temporary values are not addressable.",
        ],
        answerSize: "compact",
        spoken: "- Selector calls have a convenience rule: when `x` is addressable and `(&x).M()` is valid, Go permits `x.M()` for a pointer-receiver method. A local variable is addressable, so a mutating call can use clean syntax without writing an ampersand each time. The actual receiver remains `*T`.\n\n- Interface assignment is a different operation. If an interface requires `Reset()`, assigning a `Timer` value asks whether `Timer`'s method set contains `Reset`. A method declared on `*Timer` is not there, so the assignment fails. Assigning `&timer` asks about `*Timer`, whose method set does contain it. Go does not secretly change the dynamic type stored in the interface.\n\n- For example, `timer.Reset()` can set a local timer to zero, and `var resetter Resetter = &timer` compiles. A commented `var resetter Resetter = timer` demonstrates the rejected boundary. This also explains why a map element cannot always use pointer-method shorthand: map elements are not addressable because map operations may move storage.\n\n- The practical rule is to reason from the exact type crossing an interface boundary. Automatic addressing is syntax help for one call, not a change to the type system. When an interface needs mutating behaviour, pass a pointer explicitly and make pointer ownership visible.",
        overviewTitle: "One rule improves call syntax; the other protects type identity",
        overview: "Method calls begin with an operand that may be addressable. The compiler can form its address without changing the program's meaning, so it permits shorthand. An interface value, however, stores a concrete dynamic type and value. Converting `T` into `*T` would change both.\n\nNon-addressable operands reveal why the distinction exists. A map element can be replaced by map operations, so Go does not expose a stable address for it. Copy it out, modify the copy, and assign it back, or store pointers in the map when shared mutation is the intended model.",
        visual: {
          type: "comparison_table",
          title: "Same method, different language operation",
          content: "| Expression | Question Go answers | Result |\n|---|---|---|\n| `value.Reset()` | Can an addressable value be rewritten as `(&value).Reset()`? | Yes |\n| `var r Resetter = value` | Does `T`'s method set contain `Reset`? | No |\n| `var r Resetter = &value` | Does `*T`'s method set contain `Reset`? | Yes |",
        },
        exampleTitle: "Use a pointer at the interface boundary",
        code: go(`package main

import "fmt"

type Timer int

func (t *Timer) Reset() { *t = 0 }

type Resetter interface{ Reset() }

func main() {
    timer := Timer(5)
    timer.Reset()
    var resetter Resetter = &timer
    resetter.Reset()
    fmt.Println(timer)
    // var invalid Resetter = timer // Timer lacks Reset in its method set.
}`),
        exampleNote: "The value call works through automatic addressing. The interface must receive `&timer`, whose concrete type is `*Timer`.",
        testing: "Whether method-call adjustment is kept distinct from method-set-based interface implementation.",
        commonMistake: "Saying that a successful `value.PointerMethod()` call proves the value type implements the matching interface.",
        depthSignal: "Use addressability and the interface's stored dynamic type to explain both outcomes.",
      },
      {
        question: "Which Go types can have methods declared on them?",
        title: "Valid receiver base types",
        direct: "A method receiver's base type must be a defined non-pointer, non-interface type declared in the same package as the method. That defined type may have an underlying basic, struct, slice, map, function, or other permitted type, so methods are not limited to structs. You cannot add methods directly to built-in types or to a type declared by another package; define a local type or write a helper instead.",
        points: [
          "Methods are not limited to struct types.",
          "The receiver base type must be defined in the same package.",
          "The receiver base type cannot itself be a pointer or interface type.",
          "A local defined type may use a built-in type as its underlying type.",
          "Wrapping or defining a local type does not copy another type's methods automatically.",
        ],
        answerSize: "compact",
        spoken: "- Go lets a package declare methods on a defined type that it owns. The receiver base type must be declared in that same package and cannot itself be a pointer type or an interface. A receiver may be either that base type `T` or `*T`, which is why ordinary value and pointer methods are both possible.\n\n- Structs are common receivers, but they are not special. A package can write `type UserID string` and add a `Valid()` method, or define a slice-based type and add collection behaviour. The defined type is distinct from its underlying type, so a plain string does not gain `UserID` methods and assignments may require explicit conversion.\n\n- For example, `UserID(\"u-42\").Valid()` can check a domain format while keeping storage simple. Code cannot declare a new method on `string`, `time.Time`, or another package's `http.Client`, because that would let unrelated packages change those types' method sets. A local wrapper can expose new behaviour while delegating to the embedded or named field.\n\n- Defining `type Local time.Time` creates a new type with the same underlying representation but not `time.Time`'s methods. An alias is not a new receiver base type owned through aliasing. The ownership rule keeps method sets predictable: the package that defines a type controls its methods.",
        overviewTitle: "Method ownership follows type ownership",
        overview: "If any importing package could attach methods to someone else's type, interface satisfaction and method resolution would depend on which imports happened to be present. Go avoids that uncertainty by allowing methods only beside a locally defined receiver base type.\n\nA local defined type creates a new method namespace and domain identity. A wrapper struct is often better when existing methods should remain reachable through an explicit field or carefully chosen embedding. A free function remains simplest when no lasting type abstraction is needed.",
        visual: {
          type: "comparison_table",
          title: "Can this receiver own a new method here?",
          content: "| Candidate | Allowed? | Reason |\n|---|---:|---|\n| Local `type UserID string` | Yes | Defined in this package |\n| `*UserID` receiver | Yes | Pointer to the local base type |\n| Built-in `string` | No | Not a locally defined type |\n| Imported `time.Time` | No | Defined by another package |\n| `type Local = time.Time` alias | No | Alias does not define a new local type |",
        },
        exampleTitle: "Attach behaviour to a local string-based type",
        code: go(`package main

import (
    "fmt"
    "strings"
)

type UserID string

func (id UserID) Valid() bool {
    return strings.HasPrefix(string(id), "u-") && len(id) > 2
}

func main() {
    id := UserID("u-42")
    fmt.Println(id.Valid(), string(id))
}`),
        exampleNote: "`UserID` can have local methods even though its underlying type is `string`; ordinary strings do not gain those methods.",
        testing: "Understanding receiver ownership, defined types, aliases, and non-struct receiver types.",
        commonMistake: "Trying to add convenience methods directly to an imported type or assuming methods are available only on structs.",
        depthSignal: "Explain why a local defined type gets a new method set while a wrapper or helper may be the better API.",
      },
    ],
  },

  "interface-definition": {
    title: "Interface Definition",
    questions: [
      {
        question: "What is an interface in Go, and when should you use one?",
        title: "Interfaces describe required behaviour",
        direct: "A basic Go interface is a type that specifies a set of method signatures. Any non-interface type whose method set contains those methods implements the interface, so a function can depend on required behaviour instead of one concrete representation. Use an interface at a real boundary where multiple implementations, substitution, or focused testing are useful; do not create one automatically for every struct.",
        points: [
          "A basic interface describes behaviour through method signatures.",
          "A value assigned to it must implement every required method.",
          "Callers see only methods in the interface's static type.",
          "Use interfaces at substitution boundaries, often near the consumer.",
          "Keep an interface concrete until more than one useful behaviour is needed.",
        ],
        answerSize: "standard",
        spoken: "- A Go interface defines a behaviour contract as a set of method signatures. For example, `type Notifier interface { Notify(string) error }` means that code receiving a `Notifier` can request notification without knowing whether email, SMS, or a test recorder performs the work. A concrete type implements the contract by having that exact method in its method set.\n\n- An interface variable remains statically typed. At runtime it holds a concrete dynamic type and value that implement the contract, but callers can invoke only the methods exposed by the interface. This gives the consumer a narrow capability and lets the implementation keep unrelated methods private from that boundary.\n\n- For example, an `Alert` function can accept a `Notifier`. Production passes `EmailSender`; a focused test passes `Recorder`. No inheritance or registration connects them—the compiler checks their method sets when values are assigned or passed. This is useful because the two implementations express a real substitution needed by the consumer.\n\n- An interface is not automatically better than a concrete parameter. If a function genuinely needs `*bytes.Buffer`, accepting a made-up interface adds indirection without flexibility. Small consumer-owned interfaces usually age well because they describe only the operations the caller uses. I introduce one only when a real behavioural boundary exists, not merely to mirror every method of a concrete type.",
        overviewTitle: "The consumer asks for a capability",
        overview: "A concrete type describes both representation and all of its methods. An interface selects a behavioural view. The consumer controls that view by naming the smallest operations required for its task, while any suitable concrete value can supply them.\n\nThe compiler verifies the connection, so ordinary interface use remains statically checked. Runtime type assertions are needed only when code asks about behaviour or concrete types beyond the interface's declared method set. That extra inspection should not replace a clear initial contract.",
        visual: {
          type: "diagram",
          title: "One capability, several concrete providers",
          content: "```mermaid\nflowchart LR\n  A[Alert function] --> B[Notifier: Notify]\n  C[EmailSender] --> B\n  D[SMSClient] --> B\n  E[Test Recorder] --> B\n  B --> F[Compiler checks each method set]\n```",
        },
        exampleTitle: "Depend on one behaviour at the call site",
        code: go(`package main

import "fmt"

type Notifier interface {
    Notify(string) error
}

type Console struct{}

func (Console) Notify(message string) error {
    fmt.Println(message)
    return nil
}

func Alert(n Notifier, message string) error {
    return n.Notify(message)
}

func main() {
    _ = Alert(Console{}, "build complete")
}`),
        exampleNote: "`Alert` needs only `Notify`. `Console` satisfies that contract without declaring an `implements` relationship.",
        testing: "Whether an interface is understood as a static behavioural contract used at a genuine substitution boundary.",
        commonMistake: "Creating a large interface that mirrors a concrete type before any consumer needs substitution.",
        depthSignal: "Describe both the interface's static method view and its concrete dynamic value.",
      },
      {
        question: "Why are small, consumer-owned interfaces idiomatic in Go?",
        title: "Designing small interfaces where they are used",
        direct: "Small interfaces are easier for types to satisfy, easier for callers to understand, and less likely to change for unrelated reasons. Defining an interface in the consuming package lets that package state exactly which behaviour it needs, even when the implementing type comes from elsewhere. This is a guideline, not a command: shared domain contracts and stable standard-library-style abstractions can appropriately live with their owning API.",
        points: [
          "An interface should model the consumer's required capability.",
          "Fewer methods reduce coupling and simplify test substitutes.",
          "Implicit satisfaction lets consumers define interfaces after implementations exist.",
          "Return concrete types unless hiding implementations is an intentional contract.",
          "Do not split naturally atomic behaviour just to minimize method count.",
        ],
        answerSize: "standard",
        spoken: "- In Go, an interface is most useful when it describes what a particular consumer needs. If a report service only calls `Write([]byte)`, its dependency can be an `io.Writer`-shaped interface instead of a large storage service interface. The smaller contract exposes less coupling and allows many existing types to satisfy it.\n\n- Implicit implementation makes consumer ownership possible. A package can define `type Clock interface { Now() time.Time }` without editing the real clock type or adding a declaration beside it. A test clock with one matching method works as well. When the consumer later needs another operation, that requirement changes beside the code that actually uses it.\n\n- For example, a greeting function that depends on one `Lookup(id) (User, error)` method can be tested with a four-line fake. If it accepted a repository interface with create, update, delete, transaction, and search methods, the fake would implement irrelevant behaviour and every unrelated repository change could break the consumer.\n\n- Small does not mean blindly one method. Operations that must remain atomic may belong in one contract, and a widely shared domain interface may have an intentional owner. Constructors commonly return concrete types so downstream consumers can choose their own views; returning an interface is justified when hiding interchangeable implementations is part of the package promise. The goal is a stable capability boundary, not the lowest possible method count.",
        overviewTitle: "Place the abstraction at the point of need",
        overview: "Producer-defined interfaces often predict every future consumer and grow alongside the implementation. Consumer-defined interfaces reverse the dependency: each caller selects the capability it actually exercises. The implementing package remains unaware because satisfaction is structural.\n\nThis style also prevents interface churn from becoming global churn. Adding a concrete method does not affect any consumer interface. Adding a required method to one consumer affects only the values passed to that boundary. Shared contracts still make sense when the abstraction itself—not one implementation—belongs to the package's public model.",
        visual: {
          type: "comparison_table",
          title: "Consumer boundary versus mirrored interface",
          content: "| Design | Consumer-owned capability | Producer-mirroring interface |\n|---|---|---|\n| Methods | Only what this caller uses | Often every implementation method |\n| Test substitute | Small and focused | Must implement unrelated operations |\n| Change pressure | Local to the consumer need | Follows producer growth |\n| Best fit | Narrow dependency seam | Intentional shared abstraction only |",
        },
        exampleTitle: "Let the consumer define one required lookup",
        code: go(`package main

import "fmt"

type User struct{ Name string }

type UserFinder interface {
    Find(int) (User, error)
}

type MemoryUsers map[int]User

func (m MemoryUsers) Find(id int) (User, error) { return m[id], nil }

func Greeting(users UserFinder, id int) string {
    user, _ := users.Find(id)
    return "Hello, " + user.Name
}

func main() {
    fmt.Println(Greeting(MemoryUsers{7: {Name: "Mina"}}, 7))
}`),
        exampleNote: "`Greeting` owns the one-method view it needs. `MemoryUsers` can have other operations without widening that dependency.",
        testing: "Understanding why interface location and size are coupling decisions rather than style slogans.",
        commonMistake: "Publishing an interface that duplicates every method of one implementation before a consumer exists.",
        depthSignal: "State a legitimate boundary to the guideline, such as an intentional shared domain contract.",
      },
      {
        question: "What does `any` mean in Go, and how is it different from a specific interface?",
        title: "The `any` interface and specific capabilities",
        direct: "`any` is an alias for the empty interface `interface{}`, whose method set is empty, so every non-interface value satisfies it. It can hold a value of any concrete type but exposes no type-specific operations without a type assertion, type switch, or reflection. A specific interface such as `io.Writer` accepts fewer types but guarantees useful behaviour at compile time.",
        points: [
          "`any` is exactly an alias for `interface{}`.",
          "Every ordinary concrete value satisfies its empty method requirement.",
          "An `any` value still has one static interface type and a dynamic concrete type.",
          "Recover specific behaviour with a checked assertion or type switch.",
          "Prefer a specific type, interface, or generic constraint when the contract is known.",
        ],
        answerSize: "compact",
        spoken: "- `any` is the predeclared alias for `interface{}`. Its basic interface contract contains no methods, so every concrete value meets it. A variable of type `any` can therefore hold an integer now and a string later, but the variable itself still has the static type `any`. Code cannot perform integer addition or call string methods through that static view.\n\n- To use the dynamic value as a particular type, code performs a checked assertion such as `text, ok := value.(string)` or a type switch. The one-result assertion panics when the value has a different dynamic type, so the two-result form is safer when mismatch is possible. Reflection is for genuinely open-ended structural work, not a replacement for an ordinary known contract.\n\n- For example, a formatting boundary may accept `any` because formatting is intentionally defined for arbitrary values. A function that writes bytes should accept `io.Writer`, because that interface guarantees `Write`. A collection algorithm may use a type parameter when it needs one consistent but caller-chosen type.\n\n- `any` offers storage flexibility at the price of compile-time capability. It is appropriate at heterogeneous boundaries such as logging fields, decoded unknown data, or generic container internals. When code knows what it needs, a concrete type or specific interface communicates that requirement earlier and avoids runtime branching.",
        overviewTitle: "Broader acceptance means fewer guaranteed operations",
        overview: "An interface method set describes what every accepted dynamic type can do. With no required methods, `any` accepts the broadest set but promises the least. A one-method interface narrows the set and guarantees that one operation. This creates a direct trade-off between openness and compile-time knowledge.\n\nThe dynamic value retains its concrete type information, which is why assertions and type switches work. Those operations should be explicit at the boundary that owns heterogeneity, rather than spread through a codebase that could have used a stronger type from the start.",
        visual: {
          type: "diagram",
          title: "Acceptance versus guaranteed behaviour",
          content: "```mermaid\nflowchart LR\n  A[any: no required methods] --> B[Accepts int, string, User, Buffer, ...]\n  C[fmt.Stringer: String method] --> D[Accepts types with String]\n  E[io.Writer: Write method] --> F[Accepts types with Write]\n  B --> G[Needs runtime inspection for specifics]\n  D --> H[Can call String directly]\n  F --> I[Can call Write directly]\n```",
        },
        exampleTitle: "Inspect an open value with a type switch",
        code: go(`package main

import "fmt"

func describe(value any) string {
    switch value := value.(type) {
    case int:
        return fmt.Sprintf("integer %d", value)
    case string:
        return "text " + value
    default:
        return fmt.Sprintf("other %T", value)
    }
}

func main() {
    fmt.Println(describe(7))
    fmt.Println(describe("go"))
}`),
        exampleNote: "The type switch safely narrows the dynamic value. A more specific input type would be better if only integers or only strings were valid.",
        testing: "Whether `any` is understood as an empty capability contract rather than as dynamic typing.",
        commonMistake: "Using `any` to avoid designing a known input contract, then scattering unchecked assertions through the program.",
        depthSignal: "Compare `any` with both a behaviour interface and a generic type parameter.",
      },
    ],
  },

  "implicit-satisfaction": {
    title: "Implicit Interface Satisfaction",
    questions: [
      {
        question: "How does a type satisfy an interface implicitly in Go?",
        title: "Implicit interface implementation",
        direct: "A non-interface type satisfies a basic interface when its method set contains every method the interface requires with matching names and signatures. No `implements` declaration or registration is needed. The compiler checks assignability where a value crosses the interface boundary, and the same concrete type can satisfy interfaces declared later or in packages that the implementation does not import.",
        points: [
          "Method-set compatibility creates the implementation relationship.",
          "Every required name and complete signature must match.",
          "No `implements` keyword or registration is used.",
          "The compiler checks assignments, arguments, returns, and explicit assertions.",
          "One concrete type may satisfy many unrelated small interfaces.",
        ],
        answerSize: "standard",
        spoken: "- Go interface implementation is structural. If an interface requires `Read([]byte) (int, error)`, any type whose method set contains exactly that method satisfies the interface. The type does not name the interface, and the interface does not name the type. Their method contracts are enough to establish the relationship.\n\n- The complete signature matters. A method returning only `int`, taking `string`, using a different named parameter type, or existing only on the wrong receiver method set does not match. The compiler checks the relationship when code assigns a value to an interface variable, passes it to an interface parameter, or returns it as that interface.\n\n- For example, a `MemoryLog` with `Write([]byte) (int, error)` can be passed to a function accepting `io.Writer`, even if `MemoryLog` was written without importing `io`. The same type might also satisfy a local `Flusher` interface after another method is added. This decoupling allows consumers to define narrow contracts around existing implementations.\n\n- A common compile-time assertion is `var _ io.Writer = (*MemoryLog)(nil)`. It allocates no usable object; it simply asks the compiler to verify the intended method set. Such assertions are helpful near adapter types and public guarantees, but ordinary assignments already receive the same static check. Implicit satisfaction keeps dependencies flexible while exact signatures keep the boundary precise and statically safe.",
        overviewTitle: "Compatibility is discovered from method sets",
        overview: "The implementation and consumer do not need a shared declaration beyond matching method signatures. This removes a dependency edge: a concrete package does not import every consumer just to announce conformance. It also lets a consumer introduce an interface around a type it did not create.\n\nStructural matching is exact, not approximate duck typing. The compiler knows the method sets and rejects a mismatch before execution. Runtime assertions arise only when starting from an interface value whose dynamic type is not statically known to satisfy the target.",
        visual: {
          type: "flow_diagram",
          title: "Compile-time satisfaction check",
          content: "```mermaid\nflowchart TD\n  A[Interface lists required methods] --> C[Compare with exact method set of T or *T]\n  B[Concrete type declares methods] --> C\n  C --> D{Every name and signature present?}\n  D -- Yes --> E[Assignment is allowed]\n  D -- No --> F[Compile-time error]\n```",
        },
        exampleTitle: "Verify an implementation without coupling declarations",
        code: go(`package main

import (
    "fmt"
    "io"
)

type MemoryLog []byte

func (m *MemoryLog) Write(p []byte) (int, error) {
    *m = append(*m, p...)
    return len(p), nil
}

var _ io.Writer = (*MemoryLog)(nil)

func main() {
    var log MemoryLog
    _, _ = fmt.Fprint(&log, "ready")
    fmt.Println(string(log))
}`),
        exampleNote: "`*MemoryLog` satisfies `io.Writer` through its `Write` method. Neither declaration names the other as an implementation.",
        testing: "Whether structural method-set matching and compile-time boundary checks are understood precisely.",
        commonMistake: "Calling it runtime duck typing or overlooking a receiver or named-type difference in the signature.",
        depthSignal: "Explain how consumer-defined interfaces avoid an import dependency from implementation to consumer.",
      },
      {
        question: "Why can an interface containing a nil pointer be non-nil in Go?",
        title: "Nil interfaces and typed nil pointers",
        direct: "An interface value is nil only when it has neither a dynamic type nor a dynamic value. Assigning a typed nil pointer such as `(*User)(nil)` gives the interface a dynamic type of `*User` and a nil dynamic value, so the interface itself is not nil. A method call may then succeed if the method handles a nil receiver or panic if it dereferences the pointer.",
        points: [
          "A nil interface has no dynamic type and no dynamic value.",
          "A typed nil pointer supplies a dynamic type when stored in an interface.",
          "Therefore the resulting interface does not equal nil.",
          "Calling a method through it follows the concrete method's nil handling.",
          "Return an explicit nil interface when an operation succeeds without a value.",
        ],
        answerSize: "standard",
        spoken: "- An interface value carries a dynamic type together with a dynamic value. Its zero value has neither, so `var err error` compares equal to nil. If code assigns a variable of type `*MyError` whose pointer value is nil, the interface now carries the dynamic type `*MyError` and a nil pointer value. Because the type part is present, the interface is not nil.\n\n- This often appears in functions that return an interface. A function may build `var problem *Problem = nil` and then return `problem` as `error`. The caller sees a non-nil error even on the apparent success path. Returning a literal `nil` from that path produces a genuinely nil interface.\n\n- For example, a `Labeler` interface can contain a nil `*Item`. Printing `labeler == nil` gives false. Calling `Label` is legal because `*Item` is the dynamic type and has that method; whether the call survives depends on the method body. A nil-aware method can return a label, while dereferencing `item.Name` without a check would panic.\n\n- I avoid using a typed nil as an interface result to mean absence. Constructors and functions return the interface only when a concrete value exists, and return an explicit nil otherwise. The reliable mental model is a pair: only `(no type, no value)` is a nil interface; `(*T, nil)` is a populated interface holding a nil pointer.",
        overviewTitle: "Track both parts of the interface value",
        overview: "Interface nilness is not a recursive question about the contained value. Equality to nil asks whether the interface itself has been populated. A conversion from a typed value records its dynamic type even when that value happens to be a nil pointer, map, slice, function, or channel.\n\nThis matters most for interface-returning functions, especially `error`. Keep the success branch as `return nil`. If a caller must accept heterogeneous possibly nil values, it needs an explicit contract rather than assuming `interfaceValue == nil` detects every typed nil inside.",
        visual: {
          type: "comparison_table",
          title: "Two states that look similar in source",
          content: "| Source state | Dynamic type | Dynamic value | Interface equals nil? |\n|---|---|---|---:|\n| `var x Labeler` | none | none | Yes |\n| `var p *Item = nil; x = p` | `*Item` | nil pointer | No |\n| `x = &Item{Name: \"A\"}` | `*Item` | non-nil pointer | No |",
        },
        exampleTitle: "Observe a typed nil inside an interface",
        code: go(`package main

import "fmt"

type Labeler interface{ Label() string }

type Item struct{ Name string }

func (i *Item) Label() string {
    if i == nil {
        return "<missing>"
    }
    return i.Name
}

func main() {
    var item *Item
    var labeler Labeler = item
    fmt.Println(item == nil, labeler == nil, labeler.Label())
}`),
        exampleNote: "The output is `true false <missing>`. The interface has dynamic type `*Item`, and the method deliberately handles the nil pointer.",
        testing: "Whether both the dynamic type and dynamic value are tracked when reasoning about interface nilness.",
        commonMistake: "Returning a typed nil pointer as `error` and expecting callers to see `err == nil`.",
        depthSignal: "Explain why method dispatch can still occur and why the method itself owns nil-receiver safety.",
      },
      {
        question: "How do type assertions and type switches work on Go interfaces?",
        title: "Inspecting an interface's dynamic value",
        direct: "A type assertion `x.(T)` asks whether an interface value's dynamic type is `T`, or whether that dynamic type implements interface `T`. The two-result form `value, ok := x.(T)` reports failure safely; the one-result form panics on failure. A type switch checks several candidate types and binds a correctly narrowed value in the matching case.",
        points: [
          "Assertions operate on interface values and target a concrete or interface type.",
          "Use `value, ok := x.(T)` when failure is a normal possibility.",
          "The one-result assertion panics when it does not match.",
          "A type switch handles several dynamic types in one control flow.",
          "Prefer an interface method when behaviour, not representation, is what code needs.",
        ],
        answerSize: "standard",
        spoken: "- A type assertion inspects the dynamic type stored in an interface value. With a concrete target, `text, ok := value.(string)` succeeds only when the dynamic type is exactly string. With an interface target, it succeeds when the dynamic type implements that target interface. The result has the target's static type, so code can use its operations directly.\n\n- The two-result form is the normal choice when mismatch is part of valid input. It returns the target type's zero value and `false` instead of panicking. The one-result form is appropriate only when a failed assertion means the program's invariant is already broken. A type switch extends the same idea to several cases and can bind a case-specific variable.\n\n- For example, a formatter can switch on `int`, `string`, and `fmt.Stringer`, then use a default for everything else. Each branch receives the matching static type. Case order matters when several interface cases could match; the first matching case is selected, so broad cases can hide narrower ones if placed first.\n\n- Assertions are useful at intentionally heterogeneous boundaries. They are not a substitute for interface design. If all valid inputs must save data, accepting a `Saver` interface and calling `Save` is clearer than accepting `any` and asserting concrete implementations. I use runtime inspection only when the variation itself is part of the requirement.",
        overviewTitle: "Narrow an open interface at one owned boundary",
        overview: "The static interface tells code which methods are always safe. An assertion asks for additional knowledge about the dynamic value. On success, Go provides a new value with the requested static type; on failure, code either receives `ok == false` or a panic.\n\nA type switch centralizes a finite set of representations. This can be appropriate for serialization, formatting, or decoding. When branches keep growing because each type performs the same conceptual operation, that operation often belongs in a behaviour interface instead.",
        visual: {
          type: "flow_diagram",
          title: "Runtime narrowing flow",
          content: "```mermaid\nflowchart TD\n  A[Interface value: dynamic type + value] --> B{Assertion target matches?}\n  B -- Yes --> C[Return narrowed value and true]\n  B -- No, two-result --> D[Return zero value and false]\n  B -- No, one-result --> E[Panic]\n  A --> F[Type switch checks cases in source order]\n```",
        },
        exampleTitle: "Use a type switch for an intentionally mixed input",
        code: go(`package main

import "fmt"

func render(value any) string {
    switch value := value.(type) {
    case string:
        return "text=" + value
    case int:
        return fmt.Sprintf("number=%d", value)
    case fmt.Stringer:
        return "stringer=" + value.String()
    default:
        return fmt.Sprintf("unsupported=%T", value)
    }
}

func main() {
    fmt.Println(render("go"))
    fmt.Println(render(7))
}`),
        exampleNote: "Each case uses a value narrowed to that case's static type. Unsupported inputs reach the explicit default rather than panicking.",
        testing: "Understanding concrete and interface assertion targets, safe failure, and type-switch narrowing.",
        commonMistake: "Using a one-result assertion on untrusted input or replacing a clear behaviour interface with repeated concrete-type checks.",
        depthSignal: "Distinguish an exact concrete-type assertion from an assertion to another interface.",
      },
    ],
  },

  "embedding-basics": {
    title: "Embedding Basics",
    questions: [
      {
        question: "What is struct embedding in Go, and is it inheritance?",
        title: "Struct embedding and method promotion",
        direct: "Struct embedding declares a field using only its type name, such as `type Admin struct { User }`. The outer value contains a real `User` field, and eligible fields and methods may be promoted so selectors like `admin.Name` or `admin.Greet()` are shorthand for `admin.User.Name` and `admin.User.Greet()`. This is composition with selector promotion, not inheritance or a subtype relationship.",
        points: [
          "An embedded type is still a real field in the outer struct.",
          "Eligible fields and methods may be selected through the outer value.",
          "Promotion is shorthand; the inner value remains directly accessible.",
          "Embedding does not make the outer type a subtype of the inner type.",
          "Use a named field when the relationship should be explicit at every call.",
        ],
        answerSize: "standard",
        spoken: "- Struct embedding is a composition feature. Instead of declaring `User User`, an outer struct can declare an anonymous field `User`. The `Admin` value still physically contains a `User` value, but selectors for eligible fields and methods are promoted. Therefore `admin.Name` can mean `admin.User.Name`, and `admin.Greet()` can call `admin.User.Greet()`.\n\n- Promotion is convenience, not copying or inheritance. The embedded `User` does not know it belongs to `Admin`, there is no override chain or `super` call, and an `Admin` cannot be passed where a `User` value is required. Code can do so explicitly with `admin.User`. The outer type can define its own method with the same name, which takes precedence at the shallower depth.\n\n- For example, embed a `Logger` inside `Service`. The service can call `service.Log(...)` because `Logger.Log` is promoted, while still accessing `service.Logger` for clarity. This can be useful when the promoted capability genuinely belongs to the outer type's public API.\n\n- Embedding can also unintentionally expose too much of an implementation and can make ownership unclear. A named field such as `logger Logger` plus `service.logger.Log(...)` is often clearer when the component is merely used internally. I choose embedding when promotion expresses the outer type's intended capabilities, not as a way to imitate a class hierarchy. Exported promoted methods should be reviewed as part of that outer API.",
        overviewTitle: "Contain first; promote selected names second",
        overview: "The embedded value exists at a normal field path. Selector resolution searches the outer type and then embedded fields by depth. When one eligible name is found at the shallowest depth, Go permits the shorter selector. The explicit path continues to work and often makes examples easier to reason about.\n\nSubtype substitution does not follow from containment. If an API needs a `User`, pass the embedded `User`. If it needs behaviour that both `User` and `Admin` provide, describe that behaviour with an interface and let method sets determine satisfaction.",
        visual: {
          type: "diagram",
          title: "Containment plus selector promotion",
          content: "```mermaid\nflowchart LR\n  A[Admin value] --> B[embedded User field]\n  B --> C[Name field]\n  B --> D[Greet method]\n  A -. promoted selector .-> C\n  A -. promoted selector .-> D\n  A --> E[Role field]\n```",
        },
        exampleTitle: "Use both promoted and explicit selectors",
        code: go(`package main

import "fmt"

type User struct{ Name string }

func (u User) Greet() string { return "Hello, " + u.Name }

type Admin struct {
    User
    Role string
}

func main() {
    admin := Admin{User: User{Name: "Mina"}, Role: "owner"}
    fmt.Println(admin.Name, admin.Greet())
    fmt.Println(admin.User.Name, admin.Role)
}`),
        exampleNote: "The short selectors are promoted from the embedded field. `admin.User` remains the explicit contained value.",
        testing: "Whether embedding is understood as containment and selector promotion rather than subtype inheritance.",
        commonMistake: "Saying `Admin extends User` or assuming an `Admin` is assignable to a `User` parameter.",
        depthSignal: "Explain the exact explicit selector that each promoted selector abbreviates.",
      },
      {
        question: "How does Go resolve name conflicts with embedded fields and methods?",
        title: "Embedding conflicts, depth, and shadowing",
        direct: "Selector resolution chooses a field or method with the requested name at the shallowest embedding depth. A member declared directly on the outer type therefore shadows a promoted member. If two different embedded paths provide the same name at the same shallowest depth, the short selector is ambiguous and does not compile; use an explicit path such as `value.Left.Name` to choose one.",
        points: [
          "Direct outer members have depth zero and win over promoted members.",
          "Go selects one matching name at the shallowest depth.",
          "Equal-depth matches make the promoted selector ambiguous.",
          "Explicit field paths remain available to resolve intent.",
          "Adding methods to embedded types can create future selector conflicts.",
        ],
        answerSize: "compact",
        spoken: "- Promotion works only when selector resolution finds one member at the shallowest depth. A field or method declared directly on the outer struct has depth zero, so it shadows any same-named member reached through embedding. The embedded member still exists and can be selected through its full field path.\n\n- If two embedded fields each offer the same name at the same depth, neither wins. The short selector is ambiguous and the compiler rejects it. For example, a `Profile` embedding both `Contact` and `Company` cannot use `profile.Name` when each embedded type has a `Name` field. Code must write `profile.Contact.Name` or `profile.Company.Name`.\n\n- The same depth rule applies to promoted methods. An outer method can intentionally provide its own behaviour while calling an embedded method explicitly when needed. This is shadowing through selector depth, not runtime overriding: Go chooses the selector statically and does not walk a superclass chain.\n\n- Conflicts are one reason to embed carefully. Adding a method to an embedded dependency can make a formerly valid short selector ambiguous when another embedded type has the same method. Named fields keep the boundary explicit and reduce that surface. When embedding is useful, I use explicit paths in code where two roles could otherwise be confused.",
        overviewTitle: "Selector depth creates deterministic promotion",
        overview: "Depth counts how many embedded fields must be traversed to reach a member. A direct declaration is depth zero, a member of one embedded field is depth one, and so on. Only a unique member at the minimum depth can be promoted.\n\nAmbiguity does not remove or merge the members. It removes only the shorthand selector. Fully qualified field paths continue to name each one. This compile-time failure prevents Go from guessing between equally near meanings.",
        visual: {
          type: "diagram",
          title: "Why `profile.Name` is ambiguous",
          content: "```mermaid\nflowchart TD\n  A[Profile] --> B[Contact at depth 1]\n  A --> C[Company at depth 1]\n  B --> D[Name]\n  C --> E[Name]\n  D --> F{same name and same depth}\n  E --> F\n  F --> G[Use Contact.Name or Company.Name]\n```",
        },
        exampleTitle: "Resolve equal-depth fields explicitly",
        code: go(`package main

import "fmt"

type Contact struct{ Name string }
type Company struct{ Name string }

type Profile struct {
    Contact
    Company
}

func main() {
    profile := Profile{
        Contact: Contact{Name: "Mina"},
        Company: Company{Name: "Acme"},
    }
    fmt.Println(profile.Contact.Name, profile.Company.Name)
    // fmt.Println(profile.Name) // ambiguous selector
}`),
        exampleNote: "Both embedded fields remain accessible. The commented short selector fails because neither depth-one `Name` is preferred.",
        testing: "Understanding shallowest-depth selector lookup, shadowing, ambiguity, and explicit resolution.",
        commonMistake: "Expecting declaration order to choose between two same-depth promoted names.",
        depthSignal: "Separate static shadowing from object-oriented runtime method overriding.",
      },
      {
        question: "What is interface embedding in Go?",
        title: "Building interfaces by embedding capabilities",
        direct: "Interface embedding places one interface type inside another interface definition so the outer interface requires all methods of the embedded interface along with its own methods. For example, an interface embedding `io.Reader` and `io.Writer` requires both `Read` and `Write`. For basic method interfaces, this composes behavioural contracts; it does not store an interface field or reuse an implementation.",
        points: [
          "Embedded interfaces contribute their required methods.",
          "The outer contract is the intersection of all embedded requirements.",
          "A concrete type must satisfy the complete combined method set.",
          "Duplicate method names must have compatible identical signatures.",
          "Embedding contracts does not embed data or implementation code.",
        ],
        answerSize: "standard",
        spoken: "- Interface embedding combines capability requirements. An interface can list another interface by name instead of repeating its methods. If `ReadWriter` embeds `Reader` and `Writer`, a concrete type belongs to the resulting type set only when its method set provides both `Read` and `Write`. The outer interface can add more methods as well.\n\n- Nothing is stored by the interface declaration. Unlike struct embedding, there is no contained runtime field and no implementation to promote. The declaration builds one contract from other contracts. The standard library uses this pattern for types such as `io.ReadWriter`, `io.ReadCloser`, and `io.ReadWriteCloser`.\n\n- For example, define `Loader` with `Load() string` and `Saver` with `Save(string)`. A `Store` interface can embed both. An in-memory type with both methods satisfies `Store`; a read-only type satisfies `Loader` but not `Store`. A function should request `Loader` when it only reads instead of unnecessarily demanding the combined interface.\n\n- If embedded interfaces provide methods with the same name, those methods must have identical signatures for the combination to be valid. Interface embedding is helpful when the combined capability has a real name and consumers need the whole set. Otherwise, accepting the smallest existing interface keeps dependencies narrower and implementations easier to provide. The combined name should represent one coherent operation boundary with a clear reason to exist.",
        overviewTitle: "Combine requirements without combining implementations",
        overview: "A basic interface's meaning can be viewed as the set of types that implement its listed methods. Embedding another interface adds all of that interface's requirements, narrowing the set of acceptable concrete types. A type does not need to know which composed interface will later describe it.\n\nComposition should follow consumer operations. A read-only function gains nothing from a `ReadWriter` parameter and rejects valid reader-only values. Use a combined interface only where an operation genuinely needs every included capability.",
        visual: {
          type: "diagram",
          title: "A combined capability contract",
          content: "```mermaid\nflowchart LR\n  A[Loader: Load] --> C[Store interface]\n  B[Saver: Save] --> C\n  D[MemoryStore has Load + Save] --> C\n  E[ReadOnly has Load only] --> A\n  E -. does not satisfy .-> C\n```",
        },
        exampleTitle: "Compose read and write contracts",
        code: go(`package main

import "fmt"

type Loader interface{ Load() string }
type Saver interface{ Save(string) }

type Store interface {
    Loader
    Saver
}

type Memory struct{ value string }

func (m *Memory) Load() string       { return m.value }
func (m *Memory) Save(value string)  { m.value = value }

func replace(store Store, value string) string {
    store.Save(value)
    return store.Load()
}

func main() {
    memory := &Memory{}
    fmt.Println(replace(memory, "ready"))
}`),
        exampleNote: "`*Memory` satisfies the combined `Store` contract because its method set contains both embedded requirements.",
        testing: "Whether interface embedding is understood as contract composition rather than implementation reuse.",
        commonMistake: "Using a broad combined interface where a consumer needs only one embedded capability.",
        depthSignal: "Explain the narrowing effect on eligible concrete types and the identical-signature rule for repeated names.",
      },
    ],
  },

  "comparisons": {
    title: "Comparisons",
    questions: [
      {
        question: "How is a Go struct different from a class?",
        title: "Go structs versus classes",
        direct: "A Go struct is a composite value type containing fields; it is not a class and creates no inheritance hierarchy. Methods are declared separately on a named receiver type, access control is package-based through identifier capitalization, and constructors are ordinary functions rather than language-required lifecycle hooks. Go combines structs, methods, interfaces, and composition to model data and behaviour without classes.",
        points: [
          "A struct declaration contains fields, not method bodies.",
          "Methods attach separately to a locally defined receiver type.",
          "Assignment and value parameters copy struct values.",
          "Exported names begin with an uppercase letter; access is package-based.",
          "Interfaces and composition replace subtype inheritance in ordinary design.",
        ],
        answerSize: "standard",
        spoken: "- A Go struct defines a fixed group of fields and produces ordinary values. It does not define a class hierarchy, constructor, destructor, or virtual method table. Methods are separate declarations with a receiver, such as `func (u User) Name() string`, and they can also be attached to other locally defined non-interface base types, not only structs.\n\n- Encapsulation follows packages rather than class keywords. A field or method whose name begins with an uppercase letter is exported from its package; a lowercase name is package-private. A constructor such as `NewUser` is just a function and is used when validation, defaults, or private state require it. A zero-valued struct exists even when no constructor is called.\n\n- For example, an `Account` struct can keep `balance` unexported and expose `Deposit` and `Balance` methods. Client code cannot select the private field from another package. If multiple account-like types share behaviour, a consumer can depend on a small interface that each type satisfies implicitly.\n\n- Struct assignment uses value semantics, although fields such as slices or maps may still share underlying data after a shallow copy. Go design normally uses explicit pointers for shared mutation and embedding or named fields for composition. The result offers much of the useful data-plus-behaviour organization of classes without claiming that one concrete type inherits from another.",
        overviewTitle: "Rebuild the class mental model from four smaller tools",
        overview: "Structs name data shapes. Receiver methods associate behaviour. Packages control visibility. Interfaces describe substitutable capabilities. Composition connects implementations. Keeping these jobs separate avoids importing class assumptions such as automatic reference identity, constructors that always run, protected members, or subtype inheritance.\n\nThis does not mean Go is non-object-oriented under every definition; it means class terminology is an unreliable guide to the language rules. Reason directly about values, pointers, method sets, interfaces, and embedded or named fields.",
        visual: {
          type: "comparison_table",
          title: "Common class responsibilities in Go",
          content: "| Class-oriented responsibility | Go mechanism |\n|---|---|\n| Data shape | Struct or another defined type |\n| Instance behaviour | Receiver methods |\n| Visibility | Exported/unexported package identifiers |\n| Construction | Ordinary `New...` function when useful |\n| Substitution | Implicitly satisfied interface |\n| Reuse | Composition through named or embedded fields |",
        },
        exampleTitle: "Keep state private behind receiver methods",
        code: go(`package main

import "fmt"

type Account struct {
    owner   string
    balance int
}

func NewAccount(owner string) *Account {
    return &Account{owner: owner}
}

func (a *Account) Deposit(amount int) { a.balance += amount }
func (a Account) Balance() int        { return a.balance }

func main() {
    account := NewAccount("Mina")
    account.Deposit(25)
    fmt.Println(account.Balance())
}`),
        exampleNote: "The constructor is an ordinary function, state is held by a struct, and methods are separate receiver declarations.",
        testing: "Ability to explain Go's data, behaviour, visibility, construction, and substitution without importing false class rules.",
        commonMistake: "Calling a struct a class and then assuming inheritance, mandatory constructors, or reference semantics.",
        depthSignal: "Map each familiar class responsibility to the exact Go feature that handles it.",
      },
      {
        question: "How does composition in Go differ from inheritance?",
        title: "Composition versus inheritance",
        direct: "Composition builds a type by containing other values and delegating to them, while inheritance creates a subtype relationship that receives behaviour from a parent hierarchy. Go supports composition through named and embedded fields but has no class inheritance. Embedding may promote selectors, yet the outer type is not assignable to the embedded type and method selection is static rather than a virtual override chain.",
        points: [
          "Composition means one value contains or uses another.",
          "Embedding can promote selectors but does not create a subtype.",
          "The outer type can access the inner value through an explicit field path.",
          "Interfaces provide behavioural substitution independently of reuse.",
          "Prefer a named field when delegation should remain visible.",
        ],
        answerSize: "standard",
        spoken: "- Inheritance combines reuse with an `is-a` subtype relationship: a child is treated as a parent and may participate in an override chain. Go does not have that class mechanism. It builds larger behaviour by composition, where one struct contains another value and either delegates explicitly or embeds it to make eligible selectors shorter.\n\n- Suppose `Service` embeds `Logger`. `service.Log` may call the promoted `Logger.Log`, but `Service` is not a `Logger`; a function taking `Logger` still needs `service.Logger`. The embedded logger has no knowledge of the service and cannot call a virtual override on the outer type. If the service defines its own `Log`, that shallower method is selected statically.\n\n- Interfaces separate substitution from reuse. Both `Service` and `Logger` can satisfy a `LogSink` interface by providing the required method, regardless of whether one contains the other. This lets a consumer depend on behaviour without forcing implementation sharing or a parent type.\n\n- Composition keeps dependencies explicit and lets types combine several focused components without a fragile hierarchy. Embedding is best when promoted behaviour truly belongs to the outer API. A named field plus delegation is clearer when the component is an implementation detail or when several similar roles would make promoted names ambiguous. This keeps ownership and replacement choices visible in ordinary code and during future refactoring.",
        overviewTitle: "Reuse and substitution are separate decisions",
        overview: "Containment answers where an implementation comes from. Interface satisfaction answers which behaviours a value can provide at a boundary. Inheritance-based designs often join those questions, but Go lets them vary independently. A type can reuse a component without exposing its methods, and it can satisfy an interface without reusing any existing implementation.\n\nThis separation encourages shallow, focused relationships. Changing the contained component does not alter a language-level ancestry chain, although promoted methods still affect the outer method set and should be treated as public API when exported.",
        visual: {
          type: "diagram",
          title: "Reuse and substitution follow different paths",
          content: "```mermaid\nflowchart LR\n  A[Service] -->|contains| B[Logger]\n  A -->|implements by method set| C[LogSink interface]\n  B -->|implements by method set| C\n  A -. is not a subtype of .-> B\n```",
        },
        exampleTitle: "Compose a logger and satisfy behaviour independently",
        code: go(`package main

import "fmt"

type Logger struct{}

func (Logger) Log(message string) { fmt.Println("log:", message) }

type Service struct{ Logger }

type LogSink interface{ Log(string) }

func record(sink LogSink, message string) { sink.Log(message) }

func main() {
    service := Service{Logger: Logger{}}
    record(service, "started")
    record(service.Logger, "ready")
}`),
        exampleNote: "Both values satisfy `LogSink` through their method sets, but a `Service` value is not a `Logger` value.",
        testing: "Whether implementation reuse, selector promotion, and interface substitution are treated as separate mechanisms.",
        commonMistake: "Describing embedding as `extends` and expecting the outer value to be assignable to the embedded concrete type.",
        depthSignal: "Explain why both types can satisfy one interface without becoming parent and child.",
      },
      {
        question: "When should a Go function accept an interface instead of a concrete type?",
        title: "Interface parameters versus concrete parameters",
        direct: "Accept an interface when the function needs a stable behavioural capability that useful alternative implementations can provide. Accept a concrete type when the function depends on that representation, construction rules, or several concrete operations and no genuine substitution exists. The interface should normally contain only the methods the consumer uses; exported constructors often return a concrete type so later consumers can choose their own interfaces.",
        points: [
          "Choose an interface for required behaviour, not hypothetical flexibility.",
          "Keep the parameter contract as small as the operation permits.",
          "Use a concrete type when representation or concrete features are required.",
          "Interface calls remain statically checked at the boundary.",
          "Return concrete values unless hiding implementations is an intentional API promise.",
        ],
        answerSize: "standard",
        spoken: "- An interface parameter is appropriate when a function needs a capability rather than one implementation. `io.Copy` works with `io.Reader` and `io.Writer` because files, network connections, buffers, and many other types can perform those operations. The boundary has real alternatives, and the small interfaces describe exactly what the algorithm uses.\n\n- A concrete parameter is clearer when the function relies on concrete fields, representation, construction invariants, or a broad set of type-specific operations. Turning one existing struct into a same-sized interface merely to enable mocking usually exports more coupling rather than less. Tests can often exercise the concrete type directly, while consumers define narrow interfaces only where substitution matters.\n\n- For example, a `WriteReport(w io.Writer, report Report)` function accepts an interface for the destination because memory buffers and files are both useful. It accepts a concrete `Report` because the report data shape is part of its input contract. A test supplies `bytes.Buffer` and inspects the result without a special mock framework.\n\n- Interfaces also carry a nil and dynamic-type boundary that concrete values avoid, so abstraction is not free. I use the narrowest type that truthfully expresses valid inputs. Public constructors usually return a concrete pointer, leaving each caller free to select a small behavioural view; returning an interface makes sense when hiding or switching implementations is itself part of the package contract.",
        overviewTitle: "Choose the strongest truthful contract",
        overview: "A good parameter type accepts every value the operation can genuinely handle and rejects values that lack required behaviour. A concrete type can be the strongest truthful contract. A small interface can be stronger in another sense: it names the one capability while allowing multiple representations.\n\nTesting is evidence for a seam, not the sole reason to invent one. If a dependency crosses time, I/O, a process boundary, or an external service, substitution is usually real. If the function simply transforms one domain value, a concrete parameter may be more direct and more informative.",
        visual: {
          type: "flow_diagram",
          title: "Choose the parameter boundary",
          content: "```mermaid\nflowchart TD\n  A[What does the function actually use?] --> B{One stable behaviour with useful alternatives?}\n  B -- Yes --> C[Accept a small consumer interface]\n  B -- No --> D{Needs representation or concrete operations?}\n  D -- Yes --> E[Accept the concrete type]\n  D -- No --> F[Recheck whether abstraction is needed yet]\n```",
        },
        exampleTitle: "Abstract the destination, keep the data concrete",
        code: go(`package main

import (
    "bytes"
    "fmt"
    "io"
)

type Report struct{ Title string }

func WriteReport(w io.Writer, report Report) error {
    _, err := fmt.Fprintln(w, report.Title)
    return err
}

func main() {
    var output bytes.Buffer
    _ = WriteReport(&output, Report{Title: "Weekly"})
    fmt.Print(output.String())
}`),
        exampleNote: "The output destination varies behind `io.Writer`; the report remains a concrete, compiler-checked data value.",
        testing: "Whether interface use follows genuine behavioural substitution instead of reflexive abstraction.",
        commonMistake: "Creating a large interface that mirrors one concrete type only because a test wants a mock.",
        depthSignal: "Give one reason a concrete parameter is the better design and one reason an interface boundary is real.",
      },
    ],
  },
};

function metaDescription(directAnswer) {
  const plain = directAnswer.replace(/[`*_]/g, "");
  return plain.length <= 157 ? plain : `${plain.slice(0, 154).trimEnd()}...`;
}

function makeQuestion(original, spec, topicQuestions) {
  const sections = [
    {
      type: "key_points",
      title: "Quick revision",
      items: spec.points,
    },
    {
      type: "speakable_answer",
      title: "Interview answer",
      answerSize: spec.answerSize,
      content: spec.spoken,
    },
    {
      type: "overview",
      title: spec.overviewTitle,
      content: spec.overview,
    },
  ];

  if (spec.visual) sections.push(spec.visual);
  sections.push({
    type: "code_example",
    title: spec.exampleTitle,
    content: `${spec.code}\n${spec.exampleNote}`,
  });

  return {
    ...original,
    question: spec.question,
    title: spec.title,
    direct_answer: spec.direct,
    layout_type: spec.layout ?? (original.order === 1 ? "concept-explanation" : "interview-practice"),
    difficulty: spec.difficulty ?? "easy",
    importance: spec.importance ?? (original.order === 1 ? "high" : "medium"),
    reading_time_minutes: spec.readingTime ?? 6,
    interviewer_intent: {
      testing: spec.testing,
      common_mistake: spec.commonMistake,
      to_stand_out: spec.depthSignal,
    },
    answer: { sections },
    followup_questions: topicQuestions
      .filter((entry) => entry.question !== spec.question)
      .slice(0, 3)
      .map((entry) => entry.question),
    seo: {
      metaTitle: `${spec.title} | Go interview question | InterviewExplainer`,
      metaDescription: metaDescription(spec.direct),
    },
  };
}

for (const [topicSlug, topic] of Object.entries(topicSpecs)) {
  const file = path.join(contentRoot, topicSlug, "complete-qa.json");
  const document = JSON.parse(fs.readFileSync(file, "utf8"));
  if (document.questions.length < topic.questions.length) {
    throw new Error(`${topicSlug}: needs at least ${topic.questions.length} source IDs`);
  }

  const retained = document.questions.slice(0, topic.questions.length);
  document.topic = topic.title;
  document.questions = retained.map((question, index) =>
    makeQuestion(question, topic.questions[index], topic.questions),
  );
  fs.writeFileSync(file, `${JSON.stringify(document, null, 2)}\n`);
  console.log(`Curated ${document.questions.length} answers in ${topicSlug}`);
}
