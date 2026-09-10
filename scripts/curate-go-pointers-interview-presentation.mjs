#!/usr/bin/env node

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const questionFile = path.join(
  repoRoot,
  "content/go-fresher/go-syntax-basics/pointers-basics/complete-qa.json",
);
const fence = String.fromCharCode(96).repeat(3);

const lessons = {
  "go-syntax-basics-pointers-basics-interview-basics": {
    directAnswer: "A pointer is a Go value that holds the address of another value. For \u0060x\u0060, \u0060&x\u0060 produces a pointer and \u0060*p\u0060 reads or changes the value reached through pointer \u0060p\u0060. Go still passes a pointer by value, but copied pointers can refer to the same target, so mutation through either alias is visible. A pointer's zero value is \u0060nil\u0060 and cannot be dereferenced safely. Go has no ordinary pointer arithmetic; escape analysis decides where an addressed value must live.",
    quick: [
      "A pointer type \u0060*T\u0060 holds the address of a value of type \u0060T\u0060.",
      "\u0060&x\u0060 obtains an address; \u0060*p\u0060 reads or updates the pointed-to value.",
      "Copying a pointer copies the address, so both pointer values can alias one target.",
      "The zero pointer is \u0060nil\u0060; dereferencing it causes a run-time panic.",
      "Go has no ordinary pointer arithmetic, and escape analysis keeps addressed values alive when needed.",
    ],
    beats: [
      {
        cue: "Define the pointer as a value that contains an address",
        stage: "A pointer holds an address",
        spokenText: "A pointer is a Go value whose content is the address of another value. If \u0060count\u0060 is an \u0060int\u0060, then \u0060&count\u0060 has type \u0060*int\u0060. The type says that the pointer may refer to an integer; it is not the integer itself.",
      },
      {
        cue: "Connect address creation and dereferencing",
        stage: "Address and value are distinct",
        spokenText: "The address operator \u0060&\u0060 creates a pointer to an addressable value, and the dereference operator \u0060*\u0060 follows a non-nil pointer. Reading \u0060*p\u0060 gets the target value, while \u0060*p = 3\u0060 changes that target. Go also allows selector shorthand such as \u0060p.Name\u0060 for a pointer to a struct.",
        support: {
          type: "trace",
          title: "Follow one value through its address",
          items: [
            {
              label: "count",
              value: "2",
              detail: "An ordinary integer occupies a storage location.",
              tone: "blue",
            },
            {
              label: "&count",
              value: "*int",
              detail: "The address expression creates a pointer to that location.",
              tone: "green",
            },
            {
              label: "p := &count",
              value: "address copied",
              detail: "The pointer variable holds a copy of the address.",
              tone: "neutral",
            },
            {
              label: "*p = 3",
              value: "count becomes 3",
              detail: "Dereferencing updates the original storage location.",
              tone: "orange",
            },
          ],
        },
      },
      {
        cue: "Explain that the pointer argument is also passed by value",
        stage: "Pointer arguments are copied",
        spokenText: "Go always passes arguments by value, including pointer arguments. Calling \u0060increment(&count)\u0060 copies the address into the parameter; it does not pass the parameter itself by reference. The copied pointer still reaches \u0060count\u0060, so changing \u0060*p\u0060 is visible to the caller. Reassigning the local parameter \u0060p = nil\u0060 would not replace the caller's pointer variable.",
      },
      {
        cue: "Explain nil and aliasing as the main safety boundary",
        stage: "Nil has no target",
        spokenText: "A pointer's zero value is \u0060nil\u0060, meaning that it has no target. Comparing a pointer with \u0060nil\u0060 is safe, but dereferencing it or selecting a field through it can panic. Two non-nil pointer values may alias the same target, so shared mutation must be intentional and synchronized when goroutines are involved.",
      },
      {
        cue: "Close with Go's memory lifetime and arithmetic rules",
        stage: "Go manages pointer lifetime",
        spokenText: "Go does not allow ordinary pointer arithmetic such as moving \u0060p\u0060 to the next integer in memory. Returning \u0060&local\u0060 is safe: escape analysis lets the compiler place the value where it remains alive. A pointer is therefore a controlled way to share one value, not a manual memory-management handle.",
        recallRule: "A Go pointer is a copied address value; dereferencing reaches shared storage, while nil reaches no storage.",
      },
    ],
    deep: {
      title: "Addresses, dereferencing, and aliasing",
      content: "A pointer has its own type and value. If \u0060count\u0060 is an \u0060int\u0060, \u0060&count\u0060 produces a \u0060*int\u0060. Assigning that pointer to another variable copies the address. The two pointer variables are separate values, but both can reach the same integer. This shared target is called aliasing.\n\nDereferencing makes the distinction visible. Reading \u0060*p\u0060 reads the target, and assigning through \u0060*p\u0060 updates it. A function that receives \u0060*int\u0060 still receives its parameter by value: Go copies the address into the call frame. The callee can mutate the target, but reassigning its local pointer parameter does not reassign a pointer variable held by the caller.\n\nThe zero value of every pointer type is \u0060nil\u0060. It represents no target, so code must establish a non-nil value before dereferencing. Go intentionally leaves out ordinary pointer arithmetic, which prevents code from walking across unrelated memory as it might in lower-level languages.\n\nTaking the address of a local value is safe even when that address is returned. The compiler performs escape analysis and moves storage to the heap when its lifetime must extend beyond the current function. That decision is automatic and may change after compiler optimization; it is not a reason by itself to prefer or avoid pointers.",
    },
    example: {
      title: "Copy an address and update one shared integer",
      code: "package main\n\nimport \"fmt\"\n\nfunc increment(n *int) {\n\t*n += 1\n}\n\nfunc clearLocal(n *int) {\n\tn = nil\n\tfmt.Println(\"local pointer is nil:\", n == nil)\n}\n\nfunc main() {\n\tcount := 2\n\tfirst := &count\n\tsecond := first\n\n\tincrement(first)\n\tfmt.Println(count, *second, first == second)\n\n\tclearLocal(first)\n\tfmt.Println(\"caller pointer still works:\", *first)\n}",
    },
  },
  "go-syntax-basics-pointers-basics-when-to-use": {
    directAnswer: "Use a pointer when the program needs shared identity, caller-visible mutation, or a meaningful \u0060nil\u0060 state. A pointer receiver also fits a method that mutates its receiver or should not copy it. Prefer values for small, independent data. Pointers are not automatically faster: they can add escape, garbage-collector work, and indirection, so measure performance-sensitive cases.",
    quick: [
      "Use a pointer when a function or method must mutate the caller's value.",
      "Pointers express shared identity; copied pointers still refer to one target.",
      "Use \u0060nil\u0060 only when absence is a deliberate state that callers handle.",
      "Pointer receivers affect whether \u0060T\u0060 or \u0060*T\u0060 satisfies an interface.",
      "Pointers are not automatically faster; compare copy cost, escape, indirection, and clarity.",
    ],
    beats: [
      {
        cue: "Begin with value semantics as the simple default",
        stage: "Values keep ownership local",
        spokenText: "Use a value when the function needs an independent input and should not change the caller's top-level fields. Go copies that value into the parameter. For a small struct such as \u0060Point{X, Y int}\u0060, the copy is usually clear, safe, and inexpensive.",
      },
      {
        cue: "Name the semantic reasons that justify sharing an address",
        stage: "Pointers express shared state",
        spokenText: "Choose a pointer when mutation must be visible to the caller, when several parts of the program intentionally share one object's identity, or when \u0060nil\u0060 usefully means “not supplied.” In \u0060func reset(c *Counter)\u0060, changing \u0060c.value\u0060 changes the caller's counter.",
        support: {
          type: "comparison",
          title: "Choose semantics before thinking about speed",
          items: [
            {
              label: "Value",
              value: "independent top level",
              detail: "Use when caller-visible mutation is not part of the contract.",
              tone: "blue",
            },
            {
              label: "Pointer",
              value: "shared target",
              detail: "Use for intentional identity, mutation, or meaningful nil.",
              tone: "green",
            },
            {
              label: "Performance",
              value: "measure",
              detail: "Copy size, escape, allocation, and indirection all matter.",
              tone: "orange",
            },
          ],
        },
      },
      {
        cue: "Explain the receiver rule and its interface boundary",
        stage: "Receiver type changes methods",
        spokenText: "A method that must update the receiver's direct value needs a pointer receiver such as \u0060func (c *Counter) Add(n int)\u0060. Method sets also matter: methods on \u0060T\u0060 belong to the method sets of both \u0060T\u0060 and \u0060*T\u0060, while methods declared on \u0060*T\u0060 belong only to the pointer's method set for interface satisfaction.",
      },
      {
        cue: "Keep nil as a deliberate part of the API",
        stage: "Nil adds a caller branch",
        spokenText: "Use a pointer for optional data only when \u0060nil\u0060 clearly represents absence and every caller handles it. A value plus \u0060bool\u0060 or \u0060error\u0060 may describe the same boundary more clearly. Do not introduce a nullable state merely to avoid copying a few fields.",
      },
      {
        cue: "Reject the claim that pointers are always faster",
        stage: "Performance must be measured",
        spokenText: "A pointer copies one machine address, but it may also create aliasing, heap escape, garbage-collector work, and another memory lookup. Small value copies often remain local and optimize well. Choose the semantics that make the API correct, then benchmark the real workload if copying a large struct appears costly.",
        recallRule: "Use a pointer for shared identity, mutation, or deliberate absence; use a value for simple independent data and measure speed rather than guessing.",
      },
    ],
    deep: {
      title: "Choosing pointer or value semantics",
      content: "Begin with the behavior the API should promise. A value parameter gives the function its own shallow copy. That is a good default for small data when changing top-level fields must not change the caller's value. A pointer parameter copies an address, so caller and callee can reach the same target. Use that shared target when mutation or object identity is part of the requirement.\n\nA meaningful \u0060nil\u0060 state can also justify a pointer, but it adds a branch every caller must understand. Sometimes a value plus \u0060bool\u0060 or \u0060error\u0060 describes absence more clearly. Do not introduce nil merely to avoid copying a few fields.\n\nReceiver choice follows the same rule. A method that changes the receiver needs a pointer receiver. Methods declared on \u0060T\u0060 belong to the method sets of both \u0060T\u0060 and \u0060*T\u0060, while methods declared on \u0060*T\u0060 belong only to the pointer method set. Go may take an address automatically for an addressable method call, but that convenience does not change interface satisfaction.\n\nPerformance is a measurement question. A pointer may add indirection, aliasing, heap escape, and garbage-collector work. A small value copy may stay local and optimize well. Choose clear semantics first, then benchmark a real hot path if copy cost is a concern.",
    },
    example: {
      title: "Use receiver types to express observation and mutation",
      code: "package main\n\nimport \"fmt\"\n\ntype Counter struct {\n\tvalue int\n}\n\nfunc (c Counter) Value() int {\n\treturn c.value\n}\n\nfunc (c *Counter) Add(delta int) {\n\tc.value += delta\n}\n\nfunc main() {\n\tcounter := Counter{value: 2}\n\tcounter.Add(3)\n\tfmt.Println(counter.Value())\n}",
    },
  },
  "go-syntax-basics-pointers-basics-common-mistake": {
    directAnswer: "Common pointer mistakes include dereferencing \u0060nil\u0060, assuming an interface that contains a typed nil pointer is itself nil, and forgetting that copied pointers alias the same mutable value. A value copy can also share slice, map, or pointer-backed data because struct copies are shallow. Keep nil and ownership rules explicit, synchronize shared mutation, and choose receiver types with method sets in mind. Pointers are not automatically faster, and ordinary pointer arithmetic is not supported in safe Go.",
    quick: [
      "Check a pointer before dereferencing when \u0060nil\u0060 is allowed by the API.",
      "An interface holding a typed nil pointer is not equal to a nil interface.",
      "Copied pointers alias one target, so unsynchronized goroutine mutation can race.",
      "Copying a struct is shallow; slice, map, and pointer fields may still share storage.",
      "Do not assume a pointer is faster or mix receiver styles without considering method sets.",
    ],
    beats: [
      {
        cue: "Start with the direct nil dereference",
        stage: "Nil has no value behind it",
        spokenText: "A nil pointer has no target. Comparing \u0060user == nil\u0060 is safe, but \u0060user.Name\u0060 or \u0060*user\u0060 needs a real target and can panic. Check optional results where they enter the program instead of letting nil travel to a distant dereference.",
      },
      {
        cue: "Explain why a typed nil can pass an interface nil check",
        stage: "An interface carries two parts",
        spokenText: "An interface includes both a dynamic type and a dynamic value. If \u0060var user *User = nil\u0060 and then \u0060var value any = user\u0060, \u0060value != nil\u0060 because the interface still contains the type \u0060*User\u0060. A type assertion can reveal that its dynamic pointer value is nil.",
        support: {
          type: "trace",
          title: "Why a typed nil interface is not a nil interface",
          items: [
            {
              label: "user",
              value: "(*User)(nil)",
              detail: "The pointer has a type but no target.",
              tone: "blue",
            },
            {
              label: "value := any(user)",
              value: "type + nil pointer",
              detail: "The interface receives dynamic type *User and a nil dynamic value.",
              tone: "orange",
            },
            {
              label: "value == nil",
              value: "false",
              detail: "A nil interface requires both interface parts to be absent.",
              tone: "neutral",
            },
          ],
        },
      },
      {
        cue: "Connect copied pointers to aliasing and concurrency",
        stage: "Aliases share one target",
        spokenText: "Assigning \u0060second := first\u0060 copies a pointer, not its target. Both aliases can update the same object. This is useful when sharing is deliberate, but hidden aliases make ownership harder to follow and unsynchronized writes from goroutines create data races.",
      },
      {
        cue: "Correct the belief that a value copy is always deep",
        stage: "Value copies can share data",
        spokenText: "Copying a struct copies its fields, but that copy is shallow. A slice field copies its header, a map field copies a reference to the same map data, and a pointer field copies the address. Top-level fields may be independent while mutations through those fields still reach shared storage.",
      },
      {
        cue: "Close with receiver and performance mistakes",
        stage: "Receiver styles need care",
        spokenText: "Do not choose pointer receivers only from habit or assume they are faster. Pointer receiver methods affect interface method sets, and mixing receiver styles without a reason makes a type harder to understand. Choose from mutation and identity first, handle nil explicitly, and benchmark performance-sensitive code.",
        recallRule: "Check the target, the interface's dynamic value, and every alias before treating a pointer as safe and independent.",
      },
    ],
    deep: {
      title: "Nil, typed nil, and shared mutation",
      content: "The obvious failure is a direct nil dereference. A missing lookup, optional field, or unsuccessful constructor may produce a nil pointer, and reading through it panics. Handle that boundary when the pointer is produced, preferably together with an error or Boolean that explains the absence.\n\nInterfaces add a less obvious case. An interface is nil only when it has neither a dynamic type nor a dynamic value. Storing \u0060(*User)(nil)\u0060 in an \u0060any\u0060 value gives the interface a dynamic type, so an ordinary \u0060value == nil\u0060 test is false. Avoid returning typed nil pointers as interface values; at an uncertain boundary, use a type assertion and inspect the pointer itself.\n\nAliasing causes a different class of bug. Copying a pointer creates another route to the same target. A mutation through one name appears through the other, and concurrent writes need synchronization. Even copying a struct by value is shallow: slice headers, maps, and pointer fields can still refer to shared data.\n\nReceiver choices should also match the type's contract. A pointer receiver is needed when a method must replace or update the receiver's direct value, and it affects interface satisfaction. Finally, a pointer is not an automatic optimization. Escape, allocation, garbage collection, and cache behavior can cost more than copying a small value, so clarity comes first and benchmarks settle performance claims.",
    },
    example: {
      title: "Recognize a typed nil pointer inside an interface",
      code: "package main\n\nimport \"fmt\"\n\ntype User struct {\n\tName string\n}\n\nfunc inspect(value any) {\n\tfmt.Println(\"interface is nil:\", value == nil)\n\tuser, ok := value.(*User)\n\tfmt.Println(\"contains nil *User:\", ok && user == nil)\n}\n\nfunc main() {\n\tvar user *User\n\tvar value any = user\n\n\tfmt.Println(\"pointer is nil:\", user == nil)\n\tinspect(value)\n\n\tif user != nil {\n\t\tfmt.Println(user.Name)\n\t}\n}",
    },
  },
  "go-syntax-basics-pointers-basics-compare": {
    directAnswer: "Go passes both values and pointers by value. Passing a struct copies its fields, while passing a pointer copies an address that can reach the caller's struct. The struct copy is shallow, so slice, map, and pointer fields may still share underlying data. Value parameters make top-level mutation local and avoid nil; pointer parameters provide shared identity and visible mutation. Receiver choice also changes method sets and interface satisfaction. Neither form is always faster, so choose the required semantics and benchmark only when performance matters.",
    quick: [
      "Every Go argument is passed by value; a pointer argument is a copied address.",
      "A struct value copy separates top-level fields but is shallow for slices, maps, and pointers.",
      "A pointer copy aliases one target, so mutation through it is visible to the caller.",
      "Methods on \u0060T\u0060 and \u0060*T\u0060 produce different interface method sets.",
      "Choose value or pointer semantics for behavior first; neither is automatically faster.",
    ],
    beats: [
      {
        cue: "Remove the pass-by-reference misconception",
        stage: "Both arguments are copied",
        spokenText: "Go passes every argument by value. Passing \u0060profile Profile\u0060 copies the struct value into the parameter. Passing \u0060profile *Profile\u0060 also makes a copy, but that copied value is an address, so the callee can use it to reach the caller's struct.",
      },
      {
        cue: "Explain top-level independence and shallow copied fields",
        stage: "Value copies are shallow",
        spokenText: "Changing a direct field on a value parameter, such as \u0060profile.Name = \"Bo\"\u0060, changes only the local copy. The copy is shallow: a slice field copies its header, a map field still refers to the same map data, and a pointer field copies its address. Mutating data reached through those fields may still affect the caller.",
        support: {
          type: "comparison",
          title: "Compare what each copied argument can change",
          items: [
            {
              label: "Struct value",
              value: "fields copied",
              detail: "Direct field assignment stays local, but reference-like fields may share data.",
              tone: "blue",
            },
            {
              label: "Struct pointer",
              value: "address copied",
              detail: "Field assignment through the pointer reaches the caller's target.",
              tone: "green",
            },
            {
              label: "Nil boundary",
              value: "pointer only",
              detail: "A pointer can express absence and must be checked before dereference.",
              tone: "orange",
            },
          ],
        },
      },
      {
        cue: "Explain aliasing through a copied address",
        stage: "Pointer copies share a target",
        spokenText: "A pointer parameter makes caller-visible mutation direct: \u0060func rename(p *Profile) { p.Name = \"Bo\" }\u0060 updates the original profile. That same aliasing makes ownership less local. If several functions or goroutines retain the pointer, each can observe or change one target.",
      },
      {
        cue: "Connect receiver choice to method sets",
        stage: "Method sets affect interfaces",
        spokenText: "A value receiver method belongs to the method sets of both \u0060T\u0060 and \u0060*T\u0060. A pointer receiver method belongs only to the method set of \u0060*T\u0060. Go can automatically take an address for an addressable call such as \u0060value.Mutate()\u0060, but a non-pointer \u0060T\u0060 still does not satisfy an interface that requires that pointer receiver method.",
      },
      {
        cue: "Choose semantics before making a performance claim",
        stage: "Performance has no default win",
        spokenText: "Values avoid nil and make top-level ownership clearer; pointers enable identity and visible mutation. A pointer may avoid a large copy, but can add escape, allocation, garbage collection, and indirection. Neither is automatically faster, so select the required behavior and benchmark only where cost is measurable.",
        recallRule: "Go copies both forms: a value copy separates direct fields, while a copied pointer intentionally aliases one target.",
      },
    ],
    deep: {
      title: "Value copies, pointer copies, and method sets",
      content: "The phrase “Go passes by value” applies to every parameter. With a struct parameter, the function receives a new struct value whose fields were copied. With a pointer parameter, the function receives a new pointer value whose address was copied. Go does not switch to a separate pass-by-reference mechanism.\n\nThe effects differ because the copied pointer can reach the caller's storage. Direct field assignment through it is visible outside the function. A value parameter keeps direct field assignment local, but its copy is shallow. Slice headers, maps, channels, functions, interfaces, and pointer fields can still connect the copy to shared data. Value semantics therefore do not automatically mean a deep, isolated object graph.\n\nMethods add a type-system boundary. Methods declared on \u0060T\u0060 are available in the method sets of both \u0060T\u0060 and \u0060*T\u0060. Methods declared on \u0060*T\u0060 are in the method set of \u0060*T\u0060 only. Automatic address-taking makes many concrete method calls convenient, but it does not make \u0060T\u0060 satisfy an interface that requires a pointer receiver method.\n\nChoose a value for small independent data and a pointer for shared identity, mutation, or deliberate absence. Then measure performance if necessary. Pointer indirection and escape can cost more than a small copy, while copying a very large struct can be expensive. The type's meaning should decide first.",
    },
    example: {
      title: "See where a shallow value copy still shares data",
      code: "package main\n\nimport \"fmt\"\n\ntype Profile struct {\n\tName string\n\tTags []string\n}\n\nfunc changeValue(profile Profile) {\n\tprofile.Name = \"value copy\"\n\tprofile.Tags[0] = \"shared backing array\"\n}\n\nfunc changePointer(profile *Profile) {\n\tprofile.Name = \"pointer update\"\n}\n\nfunc main() {\n\tprofile := Profile{Name: \"Ada\", Tags: []string{\"go\"}}\n\n\tchangeValue(profile)\n\tfmt.Println(profile.Name, profile.Tags[0])\n\n\tchangePointer(&profile)\n\tfmt.Println(profile.Name, profile.Tags[0])\n}",
    },
  },
  "go-syntax-basics-pointers-basics-scenario": {
    directAnswer: "A nil-pointer panic occurs when code dereferences a pointer that has no target. Start with the first application frame in the panic stack, identify the pointer used there, and trace it backward to the lookup, return, optional field, or shared write that produced nil. Also inspect interfaces that may contain typed nil pointers, because such interfaces do not compare equal to nil. Fix the missing-state contract at that boundary and test valid, missing, explicit nil, and typed-nil cases.",
    quick: [
      "A nil pointer can be compared, but dereferencing it or reading a field through it can panic.",
      "Use the first relevant stack frame to locate the exact dereference, not a later symptom.",
      "Trace the pointer to a return, map lookup, optional field, or shared write that produced nil.",
      "An interface containing a typed nil pointer is non-nil because it has a dynamic type.",
      "Fix the producer contract and test valid, missing, explicit nil, and typed-nil inputs.",
    ],
    beats: [
      {
        cue: "Define the operation that actually panics",
        stage: "The dereference is the crash",
        spokenText: "A nil pointer has no target. The comparison \u0060user == nil\u0060 is safe, but \u0060*user\u0060 and a field selection such as \u0060user.Name\u0060 need a target. When that pointer is nil, the run time panics at the dereference rather than at the earlier operation that produced nil.",
      },
      {
        cue: "Use the stack trace to find the first useful frame",
        stage: "Start at the panic frame",
        spokenText: "Read the panic stack from the first frame in application code and identify the exact pointer used on that line. Record the failing input and reproduce the smallest case. This gives a concrete pointer to trace instead of changing several possible producers at once.",
        support: {
          type: "trace",
          title: "Trace the pointer backward from panic to source",
          items: [
            {
              label: "Panic frame",
              value: "user.Name",
              detail: "Identify the exact dereference and pointer expression.",
              tone: "orange",
            },
            {
              label: "Last assignment",
              value: "lookupUser(id)",
              detail: "Follow that pointer to the call or lookup that supplied it.",
              tone: "blue",
            },
            {
              label: "Producer result",
              value: "nil, nil",
              detail: "Find the missing-state contract that allowed nil to travel.",
              tone: "neutral",
            },
            {
              label: "Boundary fix",
              value: "value or error",
              detail: "Make absence explicit before any dereference.",
              tone: "green",
            },
          ],
        },
      },
      {
        cue: "List the common producers without losing the trace",
        stage: "Find where nil entered",
        spokenText: "Typical sources are a constructor or lookup returning nil, a missing map entry whose value type is a pointer, an optional decoded field, or shared state changed by another goroutine. Stop at the first assignment where the pointer differs from the expected non-nil value.",
      },
      {
        cue: "Include the typed nil interface case in the boundary review",
        stage: "Interfaces can hide typed nil",
        spokenText: "If a function returns an interface, inspect both its dynamic type and value. A \u0060*User\u0060 whose value is nil makes \u0060any(user)\u0060 non-nil because the interface still carries \u0060*User\u0060 as its dynamic type. Avoid returning a typed nil as a successful interface result.",
      },
      {
        cue: "Fix the producer contract and protect it with focused tests",
        stage: "Test every absence path",
        spokenText: "Make the producer return a non-nil value or a clear error, then check that error before using the pointer. Test a valid object, a missing lookup, an explicit nil pointer, and any interface boundary that can carry typed nil. Run race-aware tests when shared mutation may be involved.",
        recallRule: "Locate the dereference, trace the pointer to its producer, make absence explicit there, and test every path that can return nil.",
      },
    ],
    deep: {
      title: "Tracing a nil pointer to its source",
      content: "A nil-pointer panic is reported where Go tries to use the missing target. Start at the first stack frame that belongs to the application and inspect the dereference on that line. The pointer may have become nil much earlier, so the crash site is a starting point rather than automatically the root cause.\n\nTrace the same pointer backward through assignments and calls. Common producers include a lookup that returns \u0060nil, nil\u0060 for missing data, a map with pointer values, an optional decoded field, a zero-value struct field, or shared state changed concurrently. Reproduce the smallest failing input and stop at the first place where the actual pointer becomes nil unexpectedly.\n\nAn interface boundary needs a separate check. An interface stores a dynamic type and a dynamic value. If its dynamic type is \u0060*User\u0060 and its dynamic value is a nil pointer, the interface itself is not nil. Returning typed nil pointers as interface values can therefore bypass a simple \u0060result == nil\u0060 check and fail later.\n\nFix the contract where absence begins. Return a useful error, a Boolean, or another explicit result and require the caller to check it before dereferencing. Add tests for a valid result, a missing record, an explicit nil pointer, and a typed nil interface. If another goroutine can replace or clear the pointer, run the race detector and protect shared access instead of adding only a local nil check.",
    },
    example: {
      title: "Test missing users and typed nil interfaces",
      code: "package pointerlesson\n\nimport (\n\t\"errors\"\n\t\"testing\"\n)\n\ntype User struct {\n\tName string\n}\n\nfunc displayName(user *User) (string, error) {\n\tif user == nil {\n\t\treturn \"\", errors.New(\"user is missing\")\n\t}\n\treturn user.Name, nil\n}\n\nfunc containsNilUser(value any) bool {\n\tuser, ok := value.(*User)\n\treturn ok && user == nil\n}\n\nfunc TestNilBoundaries(t *testing.T) {\n\tname, err := displayName(&User{Name: \"Ada\"})\n\tif err != nil || name != \"Ada\" {\n\t\tt.Fatalf(\"valid user: name=%q err=%v\", name, err)\n\t}\n\n\tif _, err := displayName(nil); err == nil {\n\t\tt.Fatal(\"nil user should return an error\")\n\t}\n\n\tvar user *User\n\tvar value any = user\n\tif value == nil || !containsNilUser(value) {\n\t\tt.Fatal(\"expected a non-nil interface containing a nil *User\")\n\t}\n}",
    },
    extra: {
      type: "tradeoffs",
      title: "Fix the missing-state contract",
      content: "A nil check at the crash line prevents one panic but may leave the real contract unclear. Prefer fixing the producer so it returns either a usable pointer or a meaningful error, then test both outcomes. Use recovery only at a true process or request boundary where containment is required; it does not make an unexpected nil pointer correct.",
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
  const sections = question.answer?.sections;
  const quick = sections?.find((section) => section.type === "key_points");
  const speakable = sections?.find((section) => section.type === "speakable_answer");
  const deep = sections?.find((section) => section.type === "deep_explanation");
  const example = sections?.find((section) => section.type === "code_example");
  if (!quick || !speakable || !deep || !example) {
    throw new Error("Missing required answer section for " + targetSlug);
  }

  question.direct_answer = lesson.directAnswer;
  quick.items = lesson.quick;
  speakable.answerSize = "standard";
  speakable.beats = lesson.beats;
  speakable.content = lesson.beats
    .map((beat) => beat.spokenText.trim())
    .join("\n\n");
  deep.title = lesson.deep.title;
  deep.content = lesson.deep.content;
  example.title = lesson.example.title;
  example.content = fence + "go\n" + lesson.example.code.trim() + "\n" + fence;
  if (lesson.extra) {
    const extra = sections.find((section) => section.type === lesson.extra.type);
    if (!extra) {
      throw new Error("Missing " + lesson.extra.type + " section for " + targetSlug);
    }
    extra.title = lesson.extra.title;
    extra.content = lesson.extra.content;
  }
  curated += 1;
}

if (curated !== document.questions.length) {
  throw new Error("Curated " + curated + " of " + document.questions.length + " questions");
}

fs.writeFileSync(questionFile, JSON.stringify(document, null, 2) + "\n");
console.log("Curated all three learning zones for " + curated + " pointer questions");
