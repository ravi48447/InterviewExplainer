#!/usr/bin/env node

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const contentRoot = path.join(repoRoot, "content/go-fresher/go-functions-closures");

function go(source) {
  return `\`\`\`go\n${source.trim()}\n\`\`\``;
}

const topicSpecs = {
  "function-signatures": {
    title: "Function Signatures",
    questions: [
      {
        question: "What does a function signature contain in Go?",
        title: "What a Go function signature contains",
        direct: "A Go function signature describes its input and output contract: the number and types of parameters, the number and types of results, and whether the last parameter is variadic. Parameter and result names help readers, but they do not change the function type. Type parameters are also part of a generic function's declaration.",
        points: [
          "A signature fixes the order and types of parameters and results.",
          "Parameter and result names do not change function-type identity.",
          "A final `...T` parameter makes a function variadic.",
          "A function value has a concrete function type such as `func(string) (int, error)`.",
          "The zero value of any function type is `nil`.",
        ],
        answerSize: "compact",
        spoken: "- A function signature is the callable contract of a function. It states which arguments must be supplied, in which order, and which results come back. For example, `func Parse(text string) (int, error)` accepts one string and returns an integer plus an error. Code can call or store that function only where this complete contract is accepted.\n\n- Names such as `text`, `value`, and `err` improve documentation, but the function type is determined by the parameter and result types, not those names. Therefore, `func(string) (int, error)` describes the type of `Parse`. A final parameter written as `values ...int` is different from an ordinary `values []int` parameter because callers may pass separate integers to the variadic form.\n\n- Function signatures matter most at boundaries: callbacks, dependency injection, middleware, and APIs. If a sorter expects `func(a, b Item) bool`, a function returning an `int` is not interchangeable even if both functions compare items. Generic functions additionally declare type parameters and constraints, and they must be instantiated before being used as ordinary values.\n\n- The useful mental model is that the signature is a compile-time promise. Matching that promise lets the compiler connect callers and implementations before the program runs; mismatching any required type, order, count, or variadic form causes a compile-time error.",
        overviewTitle: "A signature is a boundary, not a function body",
        overview: "The body explains how work is performed; the signature explains how other code may use that work. Callers do not need to know the algorithm inside `Parse`, but they must supply a string and handle both returned values. This separation lets an implementation change without affecting callers as long as the signature and documented behaviour remain stable.\n\nThe names in a declaration belong to that declaration. Function types may omit them because names do not take part in type identity. A generic declaration adds type parameters before the ordinary parameters; after instantiation, the result is an ordinary callable function with concrete types.",
        visual: {
          type: "comparison_table",
          title: "Which parts affect the callable contract?",
          content: "| Declaration detail | Part of the function type? | Why it matters |\n|---|---:|---|\n| Parameter types and order | Yes | Determines valid arguments |\n| Result types and order | Yes | Determines returned values |\n| Parameter/result names | No | Documentation and local bindings only |\n| Final `...T` marker | Yes | Permits zero or more variadic arguments |\n| Function body | No | Implements the contract |",
        },
        exampleTitle: "Assign a function to its exact callback type",
        code: go(`package main

import (
    "fmt"
    "strconv"
)

func parse(text string) (int, error) {
    return strconv.Atoi(text)
}

func main() {
    var convert func(string) (int, error) = parse
    value, err := convert("42")
    fmt.Println(value, err)
}`),
        exampleNote: "The output is `42 <nil>`. Renaming `text` would not change the type, but changing the result from `(int, error)` to `int` would make the assignment fail.",
        testing: "Understanding which declaration details form a Go function's callable type.",
        commonMistake: "Treating parameter names as type information or overlooking a changed result or variadic marker.",
        depthSignal: "Connect the signature to a callback assignment and distinguish it from the implementation body.",
      },
      {
        question: "When can a Go function be used as a callback?",
        title: "Using Go functions as callbacks",
        direct: "A Go function can be passed as a callback when its function type is assignable to the parameter's expected type. The parameter types, result types, order, and variadic status must match; similar behaviour is not enough. A named callback type can make the purpose clearer and can attach methods, while an alias preserves the original type identity.",
        points: [
          "The callback's complete function type must be assignable to the expected type.",
          "Argument and result order must match exactly.",
          "`func(...int)` and `func([]int)` are different function types.",
          "A named function type documents a role and may have methods.",
          "Check a function value for `nil` before an optional callback is called.",
        ],
        answerSize: "compact",
        spoken: "- Functions are first-class values in Go, so they can be stored in variables, passed to other functions, and returned as results. A callback parameter still has one precise type. For example, a filter that accepts `func(int) bool` can receive `isEven`, but it cannot receive `func(int) error` or `func(int, int) bool`, even if the names sound related.\n\n- Compatibility comes from the type contract rather than the function name. Parameter names may differ, because they are not part of the function type, but parameter positions and result positions must agree. The variadic marker also matters: `func(...int)` lets a caller supply separate integers, while `func([]int)` requires one slice argument.\n\n- A declared type such as `type Predicate func(int) bool` is useful when the callback represents a domain role. It can improve API documentation and even have methods. An alias such as `type Predicate = func(int) bool` is only another spelling of the same type. Assignability rules for a distinct named type should be considered at the API boundary rather than assumed from similar-looking declarations.\n\n- Optional callbacks need one runtime boundary as well: the zero value is `nil`, and calling it panics. I either require a callback and validate it at construction, or document that `nil` means “no hook” and guard the call. The callback works cleanly when both its type and its absence policy are explicit.",
        overviewTitle: "Callbacks connect behaviour through a typed slot",
        overview: "A callback-owning function controls *when* something happens, while the supplied function controls *what* happens. The function type is the slot between them. A filtering loop does not care how a predicate decides; it only relies on one integer going in and one Boolean coming out.\n\nThis is stronger than accepting `any` and discovering the shape later. The compiler checks the connection at the call site. A named callback type is helpful when the role itself deserves vocabulary, but creating a new named type for every tiny callback can make ordinary assignments and APIs noisier.",
        visual: {
          type: "flow_diagram",
          title: "How a callback participates in the call",
          content: "```mermaid\nflowchart LR\n  A[filter owns iteration] --> B[passes one int]\n  B --> C[Predicate func(int) bool]\n  C --> D[returns keep or discard]\n  D --> A\n```",
        },
        exampleTitle: "Inject a predicate into a reusable filter",
        code: go(`package main

import "fmt"

type Predicate func(int) bool

func filter(values []int, keep Predicate) []int {
    var result []int
    for _, value := range values {
        if keep(value) {
            result = append(result, value)
        }
    }
    return result
}

func main() {
    isEven := func(n int) bool { return n%2 == 0 }
    fmt.Println(filter([]int{1, 2, 3, 4}, isEven))
}`),
        exampleNote: "The output is `[2 4]`. Changing `isEven` to return an `int` produces a compile-time mismatch instead of a delayed runtime failure.",
        testing: "Whether function values, callback types, and their runtime nil boundary are understood.",
        commonMistake: "Assuming two functions are compatible because their purpose is similar while their types differ.",
        depthSignal: "Explain one real callback flow and state how optional nil callbacks are handled.",
      },
      {
        question: "Why does a function argument fail to match a callback type in Go?",
        title: "Diagnosing callback signature mismatches",
        direct: "A function argument fails to match a callback when its function type is not assignable to the type requested by the receiving API. Compare parameters and results from left to right, including named domain types and the final variadic marker. Fix the adapter or API contract explicitly instead of hiding the mismatch with `any` or reflection.",
        points: [
          "Read both function types from left to right.",
          "Check parameter count, order, and exact types.",
          "Check result count, order, and exact types.",
          "Treat `...T` and `[]T` as different parameter forms.",
          "Use a small adapter when semantics match but signatures do not.",
        ],
        answerSize: "compact",
        spoken: "- A callback mismatch is a type-contract problem, so the compiler message should be reduced to two signatures. I write the expected type and the supplied type on adjacent lines, then compare every parameter and result in order. Parameter names are irrelevant, but `UserID` and `string` may still be distinct types even when `UserID` has string as its underlying type.\n\n- A frequent mismatch is shape rather than data. An API may expect `func(string) error`, while the available function is `func(context.Context, string) error`. Another common case is a variadic callback, `func(...string)`, being confused with `func([]string)`. Those functions can perform similar work, but callers invoke them differently, so their types are not identical.\n\n- If the behaviours genuinely belong together, I add an explicit adapter. For example, a closure can capture the current context and expose only the string parameter required by the API. The adapter is also the right place to translate a domain type or discard a result deliberately. It makes the missing information and policy visible.\n\n- I do not loosen the API to `any` just to make the error disappear. That moves a useful compile-time check into runtime assertions and can hide a semantic mismatch. The correct repair is to align the contracts or bridge them with a small, named conversion whose behaviour can be tested.",
        overviewTitle: "Separate a type mismatch from a behaviour mismatch",
        overview: "Two functions may perform the same broad task and still require different inputs. Conversely, two functions can share a type while having completely different behaviour. The compiler checks only the type side of this boundary; the programmer still checks whether the adapter preserves the intended meaning.\n\nAn adapter should be narrow. It can bind context, reorder data only when unambiguous, translate a domain value, or convert a richer result into the callback's expected result. If the adapter needs guesses or silently loses important errors, the underlying API contracts probably do not belong together.",
        visual: {
          type: "comparison_table",
          title: "Signature mismatch checklist",
          content: "| Check | Expected | Supplied | Resolution |\n|---|---|---|---|\n| Extra context | `func(string) error` | `func(context.Context, string) error` | Capture context in an adapter |\n| Domain type | `func(UserID)` | `func(string)` | Convert explicitly if valid |\n| Result | `func() error` | `func() (int, error)` | Handle or expose the extra value |\n| Variadic form | `func(...string)` | `func([]string)` | Wrap the slice call |",
        },
        exampleTitle: "Bind missing context with an adapter",
        code: go(`package main

import (
    "context"
    "fmt"
)

func save(ctx context.Context, name string) error {
    fmt.Println("saved", name, ctx.Err())
    return nil
}

func run(name string, callback func(string) error) error {
    return callback(name)
}

func main() {
    ctx := context.Background()
    callback := func(name string) error { return save(ctx, name) }
    _ = run("report", callback)
}`),
        exampleNote: "The adapter has the exact `func(string) error` shape and makes the captured context explicit. The output is `saved report <nil>`.",
        testing: "Ability to trace a compile-time callback mismatch to the exact parameter or result difference.",
        commonMistake: "Weakening the type to `any` instead of expressing the missing policy in an adapter.",
        depthSignal: "Distinguish signature compatibility from semantic compatibility.",
      },
      {
        question: "How do functions, methods, method values, and method expressions differ in Go?",
        title: "Functions, methods, and their callable forms",
        direct: "A function is declared without a receiver, while a method belongs to a receiver type. `value.Method` creates a method value with the receiver already bound; `Type.Method` or `(*Type).Method` creates a method expression whose first argument is the receiver. These forms therefore have different function signatures even though they execute the same method body.",
        points: [
          "A method declaration has one receiver before its name.",
          "A method value binds the receiver now.",
          "A method expression receives the receiver as its first argument.",
          "Pointer-receiver method values can mutate the bound object.",
          "Choose the form that matches whether the caller already owns a receiver.",
        ],
        answerSize: "standard",
        spoken: "- A method is a function associated with a receiver type. In `func (c *Counter) Add(delta int) int`, the receiver is `*Counter`, the ordinary parameter is `int`, and the result is `int`. A direct call such as `counter.Add(2)` uses selector syntax and lets Go supply the receiver.\n\n- A method value, `add := counter.Add`, captures that particular receiver and produces a function with type `func(int) int`. Calling `add(2)` later operates on the same bound counter. This is useful for callbacks that should target one object, but it also means the function value retains access to that receiver for as long as the method value remains reachable.\n\n- A method expression leaves the receiver open. `(*Counter).Add` has type `func(*Counter, int) int`, so the caller supplies the counter explicitly on every call. For example, the same expression can update two different counters. A value-receiver expression uses `Counter.Add`; receiver method-set rules determine which expressions and interface assignments are valid.\n\n- The distinction is about when the receiver is chosen. A normal function has no receiver, a method call selects one immediately for that call, a method value binds one for later calls, and a method expression turns the receiver into the first parameter. I choose a method value for object-specific behaviour and a method expression for a reusable operation across receivers, while watching pointer mutation and lifetime.",
        overviewTitle: "Move the receiver between the environment and the parameter list",
        overview: "All four forms eventually execute code with inputs, but they package the receiver differently. A bound method value behaves much like a closure: it carries a specific receiver in its environment. A method expression behaves like an ordinary function because the receiver is visible as the first argument.\n\nThis distinction matters when APIs accept callbacks. A callback expecting `func(int) int` can receive `counter.Add`; one expecting `func(*Counter, int) int` can receive `(*Counter).Add`. The method body is identical, yet the usable function types differ because the receiver is bound in one case and explicit in the other.",
        visual: {
          type: "comparison_table",
          title: "Where is the receiver supplied?",
          content: "| Form | Example | Resulting call shape |\n|---|---|---|\n| Function | `add(c, 2)` | Receiver-like value is an ordinary argument |\n| Method call | `c.Add(2)` | Selector supplies `c` for this call |\n| Method value | `f := c.Add; f(2)` | `c` is bound when `f` is created |\n| Method expression | `f := (*Counter).Add; f(c, 2)` | Caller supplies `c` each time |",
        },
        exampleTitle: "Observe bound and unbound receiver forms",
        code: go(`package main

import "fmt"

type Counter int

func (c *Counter) Add(delta int) int {
    *c += Counter(delta)
    return int(*c)
}

func main() {
    var first, second Counter
    bound := first.Add
    unbound := (*Counter).Add
    fmt.Println(bound(2))
    fmt.Println(unbound(&second, 5))
}`),
        exampleNote: "The output is `2` and then `5`. `bound` already contains `&first`; `unbound` needs `&second` as its first argument.",
        testing: "Understanding receiver binding and the signatures produced by method values and expressions.",
        commonMistake: "Assuming `counter.Add` and `(*Counter).Add` have the same function type.",
        depthSignal: "Trace where the receiver is stored and when it is chosen.",
      },
      {
        question: "How do you debug a Go 'cannot use func ... as func ...' error?",
        title: "Debugging Go function-type errors",
        direct: "Reduce the compiler error to the expected and actual function types, then compare parameters, results, and the variadic marker in order. Check for distinct named types and whether a method receiver is already bound. Once the first mismatch is found, either correct the declaration or add a small typed adapter that makes the conversion policy explicit.",
        points: [
          "Copy the expected and actual types onto separate lines.",
          "Find the first differing parameter or result.",
          "Check named domain types, variadic form, and receiver binding.",
          "Use `var _ Expected = candidate` for a focused compile-time check.",
          "Prefer a typed adapter over `any` or reflection.",
        ],
        answerSize: "standard",
        spoken: "- I treat `cannot use func ... as func ...` as a precise contract diff. The surrounding application often makes the message look complicated, so I isolate the callback in a tiny assignment such as `var _ Handler = candidate`. The compiler then shows the expected named type and the candidate's actual type without unrelated generic or call-site details.\n\n- I compare inputs first: count, order, concrete or named type, pointer versus value, and whether the last parameter is variadic. Next I compare results in the same way. For methods, I check whether I passed a bound method value such as `service.Handle`, or a method expression such as `(*Service).Handle`, because the latter includes the receiver as its first parameter.\n\n- For example, an HTTP-style hook may require `func(Request) error`, while the existing operation returns `(Response, error)`. Silently discarding the response inside the API would hide policy. A local adapter can call the operation, inspect or deliberately discard the response, and return the error. That adapter is easy to name and test.\n\n- If the signatures appear identical, I inspect package-qualified named types rather than only their printed underlying forms. I also confirm that a generic function has been instantiated where inference has insufficient context. The fix is complete when the small typed assignment compiles and a focused test proves the adapter preserves the intended values and errors.",
        overviewTitle: "Use the compiler error as a structural diff",
        overview: "Function-type errors are deterministic: at least one part of the callable contract differs or is not assignable. A focused variable assignment removes the distraction of the larger call. The first difference is usually enough to explain the whole error.\n\nThe decision after locating it is semantic. If the declaration is simply wrong, correct it. If two legitimate contracts meet at a boundary, write an adapter that states what happens to extra inputs, results, context, or errors. Reflection avoids the type error only by postponing it, which is rarely an improvement for ordinary callbacks.",
        visual: {
          type: "flow_diagram",
          title: "Function-type debugging sequence",
          content: "```mermaid\nflowchart TD\n  A[Isolate: var _ Expected = candidate] --> B{Parameters match?}\n  B -- No --> C[Check count, order, named types, pointer, variadic]\n  B -- Yes --> D{Results match?}\n  D -- No --> E[Handle missing or extra results explicitly]\n  D -- Yes --> F{Receiver bound or generic instantiated?}\n  F -- No --> G[Choose method value/expression or instantiate]\n  F -- Yes --> H[Review named-type assignability]\n```",
        },
        exampleTitle: "Make a richer operation fit a narrower hook",
        code: go(`package main

import "fmt"

type Hook func(string) error

func create(name string) (int, error) {
    return len(name), nil
}

func main() {
    var hook Hook = func(name string) error {
        id, err := create(name)
        fmt.Println("created id", id)
        return err
    }
    _ = hook("gopher")
}`),
        exampleNote: "The adapter explicitly handles the extra integer result. It prints `created id 6` and satisfies `Hook` at compile time.",
        testing: "A repeatable process for locating and correctly bridging function-type mismatches.",
        commonMistake: "Reading only function names or weakening the callback to an untyped value.",
        depthSignal: "Use a compile-time assertion and explain the adapter's information policy.",
      },
    ],
  },
  "closures-and-captured-variables": {
    title: "Closures and Captured Variables",
    questions: [
      {
        question: "What is a closure in Go, and how are variables captured?",
        title: "Closures and captured variables in Go",
        direct: "A closure is a function literal that refers to variables declared in an enclosing function. It captures the variables themselves, not frozen copies of their current values, so the closure can observe and update shared state after the enclosing call returns. Captured variables remain alive as long as they are reachable through the closure.",
        points: [
          "Every Go function literal may close over surrounding variables.",
          "The captured variable is shared, not copied automatically.",
          "A closure can read and update its captured state.",
          "Captured state survives while a reachable closure needs it.",
          "Separate factory calls create separate captured environments.",
        ],
        answerSize: "compact",
        spoken: "- A closure is an anonymous function together with access to variables from its surrounding lexical scope. In Go, function literals are closures. If a factory creates a local `count` and returns a function that increments it, the returned function still refers to that same `count` after the factory call has finished.\n\n- Capture is by shared variable, not by taking an automatic snapshot of the value. If the surrounding code changes the variable before the closure runs, the closure sees the changed value. The closure may also assign to it. That behaviour is useful for private state, but it means all closures capturing the same variable can affect one another.\n\n- For example, two calls to `newCounter()` create two different local `count` variables and therefore two independent counters. Calling the function returned by the first factory twice produces one and two; calling the second counter then produces one. The state is hidden because no other code receives the variable directly.\n\n- The lifetime of captured variables follows reachability rather than the visible block alone. The implementation may move a captured variable so it remains valid, but code should reason about ownership and sharing rather than stack versus heap guesses. A closure is a good fit when the captured state is small and its relationship to the behaviour is clear.",
        overviewTitle: "A closure packages behaviour with an environment",
        overview: "A plain function needs all changing inputs supplied through parameters or global state. A closure can carry a private environment from the place where it was created. This is why closures work naturally for callback factories, configuration binding, and small state machines.\n\nThe environment contains access to variables, not a serialized moment in time. When more than one closure captures the same variable, they share it. When a factory is invoked again, new local variables normally create a new independent environment. Reachability through returned function values keeps that environment available.",
        visual: {
          type: "flow_diagram",
          title: "One factory call creates one captured environment",
          content: "```mermaid\nflowchart LR\n  A[newCounter call] --> B[count variable]\n  B --> C[returned closure]\n  C -- call --> B\n  B -- incremented value --> C\n  D[second newCounter call] --> E[separate count variable]\n  E --> F[separate closure]\n```",
        },
        exampleTitle: "Create independent counters",
        code: go(`package main

import "fmt"

func newCounter() func() int {
    count := 0
    return func() int {
        count++
        return count
    }
}

func main() {
    first := newCounter()
    second := newCounter()
    fmt.Println(first(), first(), second())
}`),
        exampleNote: "The output is `1 2 1`. The first two calls share one captured `count`; the final call uses a different factory invocation and a different variable.",
        testing: "Understanding shared capture, independent closure environments, and captured-variable lifetime.",
        commonMistake: "Describing capture as an automatic copy of the variable's value.",
        depthSignal: "Trace two closures from the same factory and from separate factory calls.",
      },
      {
        question: "When are closures useful in a Go program?",
        title: "Practical uses for Go closures",
        direct: "Closures are useful when a small function needs stable context without adding that context to every call. Common uses include configured callbacks, middleware, factories, test helpers, and iterators with private state. Prefer an explicit struct when the state has several operations, complex lifecycle rules, concurrency requirements, or needs to be inspected independently.",
        points: [
          "Use closures to bind small, stable context to behaviour.",
          "Factories can return configured functions without global state.",
          "Middleware often captures the next handler and configuration.",
          "Closures make concise test fakes and predicates.",
          "Use a struct when state or lifecycle becomes substantial.",
        ],
        answerSize: "compact",
        spoken: "- A closure is useful when a function needs a small amount of context repeatedly and that context naturally belongs to the function. For example, a logger factory can capture a service name and return `func(string)`; every call receives only the changing message while the service name remains bound. This avoids a global variable and avoids passing the same configuration through every call.\n\n- Go code commonly uses closures for HTTP middleware, predicates, sorting functions, test fakes, and factory-created operations. Middleware captures configuration and the next handler, then returns a handler with the same public signature. Tests can capture a slice of received values so they can verify how a dependency was called.\n\n- The boundary is complexity and ownership. A closure with one or two private values is easy to understand. If the state has several named operations, must be reset or observed, owns resources, or is shared across goroutines, a struct with methods usually communicates the design better. Synchronization is not added automatically just because state is hidden in a closure.\n\n- I choose a closure when it makes the call site smaller while keeping the captured context obvious at construction. I choose parameters for values that change on every call, and a struct when the state deserves an explicit name, lifecycle, or API.",
        overviewTitle: "Bind stable context; pass changing input",
        overview: "A useful closure separates two categories of data. Stable context is supplied once when the closure is constructed; changing data is supplied every time it is called. The result remains an ordinary typed function that can satisfy callback APIs.\n\nThis pattern becomes harmful when construction hides too much. If a reader cannot tell which resources, mutable values, or locks the closure retains, an explicit type is easier to inspect. Closures are a packaging tool, not a replacement for clear ownership.",
        visual: {
          type: "comparison_table",
          title: "Choose the simplest state carrier",
          content: "| Need | Prefer | Reason |\n|---|---|---|\n| One-off calculation | Plain function | All inputs remain explicit |\n| Small stable context + behaviour | Closure | Context is bound once |\n| Several operations on named state | Struct with methods | API and ownership stay visible |\n| Package-wide shared state | Usually avoid globals | Tests and concurrency become harder |",
        },
        exampleTitle: "Build a prefixed logger without global state",
        code: go(`package main

import "fmt"

func logger(prefix string) func(string) {
    return func(message string) {
        fmt.Printf("[%s] %s\\n", prefix, message)
    }
}

func main() {
    apiLog := logger("api")
    apiLog("started")
    apiLog("ready")
}`),
        exampleNote: "The closure binds `api` once, while each call supplies only the new message. The two output lines start with `[api]`.",
        testing: "Whether a closure is chosen for a real ownership reason rather than merely for shorter syntax.",
        commonMistake: "Hiding large mutable state or resource lifecycles inside an anonymous closure.",
        depthSignal: "Explain the stable-context/changing-input split and the point where a struct becomes clearer.",
      },
      {
        question: "What mistakes occur when closures capture changing variables?",
        title: "Closure capture mistakes in Go",
        direct: "Closure bugs occur when code expects a captured value to be frozen but the closure actually shares a variable that later changes. Make the intended value an explicit parameter or create a new local variable at the boundary. For loops, remember that Go 1.22 changed variables declared by the loop itself, but variables declared outside the loop can still be shared.",
        points: [
          "Closures observe the captured variable's current value when they run.",
          "Copy a value explicitly when each closure needs a snapshot.",
          "Go 1.22 gives loop-declared variables per-iteration semantics.",
          "An outer variable reused by a loop is still one shared variable.",
          "Captured mutable state can also create data races.",
        ],
        answerSize: "standard",
        spoken: "- The classic closure mistake is expecting creation time to imply value capture. A closure refers to a variable, so changing that variable changes what the closure observes. If several closures capture one `name` that is reassigned before they run, they may all print the final name instead of the values intended for each function.\n\n- The safest repair is to make the snapshot visible. Pass the value as a parameter to a helper that returns the closure, or create a new local variable for that closure. This documents that each function owns a particular value instead of sharing a changing source. It also separates intentional shared state, such as a counter, from accidental sharing.\n\n- Loop examples need a version-aware explanation. Starting with Go 1.22, variables declared by a `for` loop have per-iteration semantics, which fixes many older capture examples in modules using that language version. However, if a variable is declared before the loop and merely assigned inside it, every closure still captures that one outer variable. The same risk exists outside loops whenever deferred or asynchronous work runs after a reassignment.\n\n- For example, assigning each item into an outer `current` variable and appending `func() string { return current }` creates closures that share `current`; all return the last item. Binding `item` through a helper creates independent values. If closures run concurrently and mutate shared state, value capture is no longer the only issue—a mutex, channel, or ownership redesign may be required.",
        overviewTitle: "Decide whether capture means sharing or snapshotting",
        overview: "Shared capture is sometimes the feature: a returned increment function must see and update the same counter. Problems begin when the code needs a historical value but leaves that requirement implicit. The correction is not “avoid closures”; it is to make the ownership decision visible.\n\nModern loop semantics remove one famous accidental-sharing case, but they do not turn all capture into copying. A variable declared outside a loop remains one variable. A closure scheduled for later can observe any reassignment that happens before it runs.",
        visual: {
          type: "comparison_table",
          title: "Shared variable versus explicit snapshot",
          content: "| Construction | What closures retain | Result |\n|---|---|---|\n| Capture one outer `current` | One shared variable | Every closure can see the final assignment |\n| Bind `value` in a helper call | A new parameter per call | Each closure keeps its intended value |\n| Go 1.22 loop variable declared by `:=` | Per-iteration variable | Closures see their iteration's value |\n| Concurrent mutation of captured state | Shared mutable variable | Requires synchronization or redesign |",
        },
        exampleTitle: "Compare accidental sharing with explicit binding",
        code: go(`package main

import "fmt"

func bind(value string) func() string {
    return func() string { return value }
}

func main() {
    items := []string{"red", "green", "blue"}
    var current string
    var shared, copied []func() string
    for _, item := range items {
        current = item
        shared = append(shared, func() string { return current })
        copied = append(copied, bind(item))
    }
    fmt.Println(shared[0](), copied[0]())
}`),
        exampleNote: "The output is `blue red`. `shared[0]` reads the reused outer variable, while `bind` creates a new parameter variable for the first value.",
        testing: "Understanding intentional sharing, explicit snapshots, and current loop-variable semantics.",
        commonMistake: "Repeating the pre-Go-1.22 loop warning without checking where the variable is declared.",
        depthSignal: "Explain both language-version behaviour and the still-valid outer-variable case.",
      },
      {
        question: "When should you use a closure instead of a struct with methods?",
        title: "Closures versus structs with methods",
        direct: "Use a closure when one focused operation needs a small amount of private context. Use a struct when state has multiple operations, meaningful fields, lifecycle management, synchronization, or independent tests and inspection. Both can preserve state; the decision is about making ownership and behaviour easiest to understand, not about which syntax uses fewer lines.",
        points: [
          "A closure naturally exposes one callable operation.",
          "A struct can expose several named methods over the same state.",
          "Struct fields make ownership and synchronization visible.",
          "Closures are concise for factories, adapters, and callbacks.",
          "Refactor when captured state stops being small and obvious.",
        ],
        answerSize: "standard",
        spoken: "- Closures and structs can both carry state across calls, but they communicate different APIs. A closure naturally returns one function, so it is ideal for one focused capability such as `next() int`, `allow(Request) bool`, or a configured logger. The captured values remain private unless another closure exposes them.\n\n- A struct is clearer when the state has several operations or a lifecycle. A rate limiter may need `Allow`, `Reset`, and `Stats`; a struct names the counters, lock, and clock that those methods share. It can satisfy interfaces, be constructed explicitly, and be inspected in tests without inventing extra closure-return values.\n\n- For example, a small sequence generator can be a closure over one integer. If requirements later add peeking, resetting, concurrent calls, and persistence, the hidden environment becomes difficult to reason about. Moving that state into a `Sequence` type makes synchronization and supported operations visible. The change is architectural, not a performance assumption.\n\n- I prefer the closure while the behaviour is singular and the captured context is obvious at its creation site. I prefer a struct when state needs a name, multiple consumers, explicit dependencies, or locking. Neither automatically solves concurrency: shared closure variables and struct fields both need an ownership rule when goroutines can access them. The chosen shape should make that ownership rule easy to find during review and testing.",
        overviewTitle: "The public shape should match the state model",
        overview: "Returning one function says, “this value has one operation.” Returning a struct or interface says, “this value has an identity and a set of operations.” That signal is more important than saving a few declaration lines.\n\nA useful refactoring trigger is the first awkward auxiliary closure. If a factory begins returning `next`, `reset`, and `stats` functions that all share hidden variables, a named type usually offers a simpler mental model. Conversely, a struct used only to hold one immutable prefix for one method may be unnecessary ceremony.",
        visual: {
          type: "flow_diagram",
          title: "Choose by the shape of the state",
          content: "```mermaid\nflowchart TD\n  A[State must survive a call] --> B{One focused operation?}\n  B -- Yes --> C{Small, obvious context?}\n  C -- Yes --> D[Closure]\n  C -- No --> E[Struct or explicit dependency]\n  B -- No --> E\n  E --> F[Name fields, methods, lifecycle, and locks]\n```",
        },
        exampleTitle: "The same counter expressed in two public shapes",
        code: go(`package main

import "fmt"

func counter() func() int {
    n := 0
    return func() int { n++; return n }
}

type Counter struct{ n int }
func (c *Counter) Next() int { c.n++; return c.n }
func (c *Counter) Reset()    { c.n = 0 }

func main() {
    next := counter()
    fmt.Println(next(), next())
    var c Counter
    fmt.Println(c.Next())
    c.Reset()
}`),
        exampleNote: "The closure is compact for `Next` alone. The struct becomes clearer as soon as `Reset` and other operations join the same state.",
        testing: "Whether the learner can choose a state carrier based on ownership and API shape.",
        commonMistake: "Choosing solely by line count or assuming private closure state is concurrency-safe.",
        depthSignal: "Identify the refactoring point from one operation to a named stateful API.",
      },
      {
        question: "How do you prevent data races on variables captured by Go closures?",
        title: "Captured variables and data races",
        direct: "A captured variable is ordinary shared memory, so concurrent reads and writes need the same synchronization as a struct field or global variable. Prevent races by giving one goroutine ownership, communicating through channels, or protecting the state with a mutex or atomic operation. Confirm the design with focused tests and `go test -race`.",
        points: [
          "Closure privacy does not make captured state thread-safe.",
          "Concurrent unsynchronized read/write or write/write access is a data race.",
          "Prefer single ownership when it fits the workflow.",
          "Use a mutex or atomic operation for genuinely shared state.",
          "Run race-enabled tests to detect observed unsafe access.",
        ],
        answerSize: "standard",
        spoken: "- A closure can hide a variable from callers, but it does not change the Go memory model. If two goroutines call a closure that increments the same captured integer, the read-modify-write operations can overlap. Updates may be lost, and the program has a data race even if a casual run appears to produce the expected count.\n\n- I first decide whether the state needs to be shared. One goroutine can own the variable and receive commands through a channel, which makes mutation sequential. If direct concurrent calls are part of the API, a mutex can guard the complete invariant. For a single numeric operation, an atomic type may fit, but it should not be stretched across multi-field rules that need one lock.\n\n- For example, a counter factory can capture both `count` and a `sync.Mutex`. Each returned call locks, increments, copies the result, and unlocks. The critical section must cover the whole logical operation, not only one read. A struct might become clearer if synchronization is an important part of the type's contract.\n\n- I verify the behaviour with tests that launch concurrent callers, wait for them to finish, and check the final value. Running `go test -race` adds dynamic race detection for executed paths. Passing it is evidence for those paths, not a proof that every possible path is safe, so the ownership rule still needs to be understandable from the code.",
        overviewTitle: "Captured state follows ordinary concurrency rules",
        overview: "The data race is on the variable, not on the syntax used to reach it. A closure, method, and package function can all race if they reach the same mutable memory without a happens-before relationship. Hiding the address from callers only limits direct access; concurrent closure calls still share it.\n\nThe cleanest remedy is often to reduce sharing. Where sharing is required, place synchronization beside the state and protect its full invariant. Race detection then exercises the implementation and can reveal unsafe paths during tests.",
        visual: {
          type: "flow_diagram",
          title: "Choose an ownership strategy before a primitive",
          content: "```mermaid\nflowchart TD\n  A[Several goroutines call closure] --> B{Captured state mutable?}\n  B -- No --> C[Concurrent reads are safe]\n  B -- Yes --> D{Can one goroutine own it?}\n  D -- Yes --> E[Send commands through a channel]\n  D -- No --> F{Single independent value?}\n  F -- Yes --> G[Atomic operation may fit]\n  F -- No --> H[Mutex protects the full invariant]\n```",
        },
        exampleTitle: "Protect a captured counter with a mutex",
        code: go(`package main

import (
    "fmt"
    "sync"
)

func counter() func() int {
    var mu sync.Mutex
    count := 0
    return func() int {
        mu.Lock()
        defer mu.Unlock()
        count++
        return count
    }
}

func main() {
    next := counter()
    var wg sync.WaitGroup
    for range 3 {
        wg.Add(1)
        go func() { defer wg.Done(); next() }()
    }
    wg.Wait()
    fmt.Println(next())
}`),
        exampleNote: "After three concurrent increments, the final call prints `4`. The mutex serializes the complete increment and read operation.",
        testing: "Recognition that closure capture and concurrency ownership are separate concerns.",
        commonMistake: "Assuming inaccessible state cannot race or locking only part of a multi-step invariant.",
        depthSignal: "State an ownership model, choose a matching synchronization tool, and use the race detector appropriately.",
      },
    ],
  },
  comparisons: {
    title: "Comparing Function Values",
    questions: [
      {
        question: "Can function values be compared in Go?",
        title: "Comparing function values in Go",
        direct: "Go function values cannot be compared with each other; they may only be compared with `nil`. The restriction applies even when two values refer to the same declared function. If a function value is stored inside an interface, comparing interfaces whose dynamic value is a function can panic, so function identity must be represented separately when an application needs it.",
        points: [
          "A function value is comparable only with `nil`.",
          "Two non-nil function values cannot be tested with `==` or `!=`.",
          "Calling a nil function value causes a runtime panic.",
          "Interface equality can panic when its dynamic value is a function.",
          "Represent callback identity with a stable ID or registration token.",
        ],
        answerSize: "compact",
        spoken: "- A variable of function type can be checked only against `nil`. Go does not define equality between two non-nil function values, even if both were assigned from the same declared function. The value may include code and a captured environment, and the language deliberately does not expose a general equality rule for that combination.\n\n- For example, `var first = strings.TrimSpace` and `var second = strings.TrimSpace` are both callable, but `first == second` is a compile-time error. `first == nil` is valid. That check is important for optional callbacks because invoking a nil function value causes a runtime panic.\n\n- Storing a function in `any` does not create safe equality. Interface values are comparable only when their dynamic values are comparable. Comparing two interface values that both contain functions of the same dynamic type can therefore panic at runtime rather than return true or false.\n\n- If an application needs to add and later remove a handler, I do not use function equality as the identity mechanism. Registration returns a stable token, numeric ID, or cancellation function, and the registry stores that key beside the callback. Function values remain behaviour; the separate key supplies identity. Tests should call the functions and verify observable results rather than try to prove that two closures are equal.",
        overviewTitle: "Behaviour is callable, not generally comparable",
        overview: "A function value may be a declared function, a closure with captured variables, or a bound method value. Those forms can carry different hidden environments even when their visible function types match. Go guarantees that each can be invoked according to its signature, but it does not promise a meaningful equality operation between them.\n\nThe one supported comparison answers a narrower question: whether a function value is absent. This is enough for optional-hook checks. Any stronger identity requirement belongs in the application's data model and should be represented explicitly.",
        visual: {
          type: "comparison_table",
          title: "Valid and invalid function checks",
          content: "| Expression | Valid? | Result or reason |\n|---|---:|---|\n| `callback == nil` | Yes | Checks whether the function value is absent |\n| `callback != nil` | Yes | Guards a later call |\n| `callbackA == callbackB` | No | Function values are not comparable to each other |\n| `any(callbackA) == any(callbackB)` | Compiles, may panic | Dynamic function values are not comparable |\n| `tokenA == tokenB` | Yes | Explicit comparable identity |",
        },
        exampleTitle: "Check absence, not function equality",
        code: go(`package main

import "fmt"

func run(value int, hook func(int)) {
    if hook != nil {
        hook(value)
    }
}

func main() {
    run(7, func(value int) { fmt.Println("value", value) })
    run(8, nil)
}`),
        exampleNote: "Only `value 7` is printed. The nil check expresses an optional hook without trying to compare one implementation with another.",
        testing: "Knowledge of function comparability, nil calls, and the interface equality trap.",
        commonMistake: "Moving function values into `any` and assuming interface comparison makes them comparable.",
        depthSignal: "Separate callable behaviour from explicit application-level identity.",
      },
      {
        question: "What is the difference between a nil function and a no-op function in Go?",
        title: "Nil functions versus no-op functions",
        direct: "A nil function value represents absence and panics if called, while a no-op is a non-nil function that can be called safely but intentionally does nothing. Use nil when absence is meaningful and callers are required to branch; use a no-op when unconditional invocation simplifies the invariant. Document the choice because they produce different failure and observability behaviour.",
        points: [
          "A nil function is an absent callable value.",
          "Calling nil panics; calling a no-op completes normally.",
          "Nil preserves the distinction between configured and unconfigured.",
          "A no-op lets downstream code call without a branch.",
          "Defaulting to a no-op can hide missing configuration if absence is an error.",
        ],
        answerSize: "compact",
        spoken: "- A nil function and a no-op share the same function type, but they express different states. The zero value of a function variable is nil. It can be compared with nil, but invoking it causes a runtime panic. A no-op such as `func(string) {}` is a real non-nil function whose body intentionally has no observable effect.\n\n- Nil is useful when the difference between “not configured” and “configured” matters. A component can reject nil during construction, or guard each optional call. For example, an optional progress callback may be nil, and the worker checks it before reporting. If a callback is mandatory, detecting nil early gives a clearer error than a panic deep in processing.\n\n- A no-op is useful when every later code path should call the dependency unconditionally. A logger field can default to a function that discards messages, keeping the main operation free of repeated nil checks. The boundary is that this default can hide accidental missing configuration, so it should not replace validation when the side effect is required.\n\n- I choose based on the invariant: nil means absence is a legitimate or invalid state that must remain visible; a no-op means “doing nothing” is an accepted implementation of the capability. The API should make that decision once rather than mix guarded and unguarded calls throughout the code.",
        overviewTitle: "Absence and harmless behaviour are different contracts",
        overview: "Nil asks the caller to decide what absence means. A no-op has already made that decision: invocation is valid and has no effect. Treating them as interchangeable creates either unexpected panics or silently skipped work.\n\nConstructor normalization is a common design. It may reject a missing required callback or replace an optional callback with a no-op. After construction, the rest of the component then operates under one stable invariant.",
        visual: {
          type: "comparison_table",
          title: "Choose the intended empty state",
          content: "| Property | Nil function | No-op function |\n|---|---|---|\n| Represents | Missing callable | Valid do-nothing implementation |\n| Safe to call | No | Yes |\n| Comparable to nil | Yes, equal | Yes, not equal |\n| Preserves missing configuration | Yes | No |\n| Removes repeated call-site branches | No | Yes |",
        },
        exampleTitle: "Normalize an optional logger to a no-op",
        code: go(`package main

import "fmt"

type LogFunc func(string)

func worker(log LogFunc) func() {
    if log == nil {
        log = func(string) {}
    }
    return func() { log("finished") }
}

func main() {
    worker(nil)()
    worker(func(message string) { fmt.Println(message) })()
}`),
        exampleNote: "The first worker completes silently and the second prints `finished`. Both call sites use the same non-nil invariant after construction.",
        testing: "Understanding the contract difference between absence and intentional no-op behaviour.",
        commonMistake: "Using a no-op where missing configuration should fail visibly.",
        depthSignal: "State where the nil/no-op choice is normalized and what invariant follows.",
      },
      {
        question: "How should a callback registry identify and remove handlers in Go?",
        title: "Stable identity for callback registration",
        direct: "Because Go functions cannot be compared with each other, a callback registry should assign a separate comparable identity when a handler is registered. Return a token, ID, or unsubscribe function and use that value for removal. This also makes duplicate registrations and ownership explicit, while avoiding unsafe reflection or assumptions about function addresses.",
        points: [
          "Do not search a registry by comparing function values.",
          "Create a stable comparable token at registration time.",
          "Return the token or an idempotent unsubscribe function.",
          "Define whether registering the same function twice creates two entries.",
          "Protect registry state when registration and dispatch are concurrent.",
        ],
        answerSize: "standard",
        spoken: "- A callback registry needs two different things: a callable value for dispatch and a comparable identity for management. Since function values cannot be compared with each other, the registry should generate the identity when a handler is added. A monotonically increasing integer, opaque token, or returned unsubscribe closure can provide that identity.\n\n- For example, `Subscribe` can store each handler in a map keyed by an integer and return a function that deletes that key. Calling the same callback through `Subscribe` twice then creates two subscriptions unless the API explicitly defines deduplication. That behaviour is predictable because identity belongs to registrations, not to guesses about the underlying function.\n\n- An unsubscribe function is convenient because it captures the key and keeps the registry's representation private. It should usually be safe to call more than once. If dispatch can run concurrently with subscription changes, the map needs a mutex or a single-owner goroutine. The implementation may copy handlers under a lock and invoke them after unlocking so user callbacks cannot block registry mutation or re-enter while the lock is held.\n\n- Reflection or code pointers are poor substitutes for identity. Closures created from the same source location can have different captured state, and method values can bind different receivers. Explicit registration tokens preserve the correct unit of identity and give the API a clear place to define lifetime, duplicate, and concurrency rules.",
        overviewTitle: "Give the registration an identity of its own",
        overview: "The handler answers “what should run?” The registration answers “which installed entry should be removed?” Combining those ideas is unnecessary and impossible through ordinary function equality. An opaque token also lets the registry change its internal storage without exposing handler details.\n\nConcurrency adds a second boundary. Registry bookkeeping should be protected, but callbacks are external code. Invoking them outside the internal lock prevents a slow callback or recursive unsubscribe from freezing the registry.",
        visual: {
          type: "flow_diagram",
          title: "Registration and removal use a token",
          content: "```mermaid\nsequenceDiagram\n  participant C as Caller\n  participant R as Registry\n  C->>R: Subscribe(handler)\n  R->>R: allocate token 17\n  R-->>C: unsubscribe closure for 17\n  R->>C: dispatch calls handler\n  C->>R: unsubscribe()\n  R->>R: delete token 17\n```",
        },
        exampleTitle: "Return an idempotent unsubscribe function",
        code: go(`package main

import "fmt"

type Registry struct {
    next int
    handlers map[int]func(string)
}

func (r *Registry) Subscribe(handler func(string)) func() {
    id := r.next
    r.next++
    r.handlers[id] = handler
    return func() { delete(r.handlers, id) }
}

func main() {
    r := Registry{handlers: map[int]func(string){}}
    off := r.Subscribe(func(s string) { fmt.Println(s) })
    r.handlers[0]("ready")
    off()
    off()
    fmt.Println(len(r.handlers))
}`),
        exampleNote: "The program prints `ready` and `0`. Deleting the same map key twice is safe, so this small unsubscribe operation is idempotent. A concurrent registry would also protect the map.",
        testing: "Ability to model registration identity separately from callback behaviour.",
        commonMistake: "Trying to deduplicate or remove callbacks by comparing function values or code pointers.",
        depthSignal: "Define duplicate, lifetime, idempotency, and concurrency behaviour for registrations.",
      },
      {
        question: "When should a Go API accept a function type instead of an interface?",
        title: "Function types versus interfaces in Go APIs",
        direct: "Accept a function type when the dependency is one focused operation, especially a callback or strategy. Accept an interface when the dependency has several related operations or a meaningful lifecycle. A named function type can still document the role and have methods, while an adapter method such as `HandlerFunc.Serve` can let ordinary functions satisfy a one-method interface.",
        points: [
          "Function parameters fit one focused operation.",
          "Interfaces group related behaviour behind named methods.",
          "Named function types can carry domain meaning and methods.",
          "Adapter function types bridge functions to one-method interfaces.",
          "Choose the smallest contract that matches the dependency's real shape.",
        ],
        answerSize: "standard",
        spoken: "- A function type is the smallest natural contract for one operation. If a retry helper only needs to execute `func() error`, accepting that function keeps the dependency direct and makes closures easy to pass. The function may capture configuration or test state without requiring a wrapper struct. A named function type can add vocabulary such as `type Operation func() error`.\n\n- An interface becomes useful when the dependency has multiple related capabilities or an identity with lifecycle. A storage dependency may need `Get`, `Put`, and `Close`; putting those into separate unrelated callbacks would make construction and invariants harder to follow. An interface groups the operations and lets one value own their shared state.\n\n- One-method interfaces sit between these cases. Go often defines an adapter function type with a method, as in the `http.HandlerFunc` pattern. An ordinary function is converted to the named function type, whose method simply calls the function, so it satisfies the interface without a custom struct. This keeps API interoperability while preserving a convenient function-based call site.\n\n- I do not choose an interface only because mocking is possible; functions are also easy to fake. I choose by conceptual shape: one stateless or configured action suggests a function, while a cohesive set of operations suggests an interface. The smaller accurate contract reduces coupling, but splitting one real object into many callbacks can lose clarity rather than improve it.",
        overviewTitle: "Model one action or a cohesive capability",
        overview: "Both forms support dependency injection and testing. The difference is what the API says about the dependency. A function says the caller needs one action. An interface says the caller collaborates with an object offering named behaviour.\n\nNamed function types are not limited to bare callbacks. Because methods may be declared on a defined function type, they can adapt one callable operation into an interface. This is powerful for one-method interfaces but becomes awkward when several methods must share hidden state.",
        visual: {
          type: "comparison_table",
          title: "Function parameter or interface?",
          content: "| Requirement | Function type | Interface |\n|---|---:|---:|\n| One operation | Strong fit | Possible, more ceremony |\n| Several related operations | Becomes fragmented | Strong fit |\n| Closure at call site | Direct | Needs adapter |\n| Named lifecycle such as `Close` | Awkward | Natural |\n| Test fake | Inline closure | Fake type or mock |",
        },
        exampleTitle: "Adapt a function to a one-method interface",
        code: go(`package main

import "fmt"

type Handler interface { Handle(string) }

type HandlerFunc func(string)

func (f HandlerFunc) Handle(value string) { f(value) }

func dispatch(h Handler, value string) { h.Handle(value) }

func main() {
    dispatch(HandlerFunc(func(value string) {
        fmt.Println("handled", value)
    }), "job-7")
}`),
        exampleNote: "The output is `handled job-7`. `HandlerFunc` keeps the concise closure while its `Handle` method satisfies the interface.",
        testing: "Whether API shape is chosen from the number and cohesion of required operations.",
        commonMistake: "Using a multi-method interface for one callback or splitting one cohesive object into unrelated function fields.",
        depthSignal: "Explain the one-method adapter pattern and its design boundary.",
      },
      {
        question: "How do you debug a nil callback or an attempted function comparison in Go?",
        title: "Debugging function-value failures",
        direct: "For a nil-callback panic, find where the function field or variable should have been initialized and decide whether absence is valid, rejected, or normalized to a no-op. For a comparison failure, remove function equality and introduce explicit identity or behaviour-based tests. Also inspect interfaces carefully, because a non-nil interface may contain a typed nil function.",
        points: [
          "Trace function initialization from declaration to call site.",
          "A non-nil interface can contain a typed nil function value.",
          "Validate required callbacks during construction.",
          "Guard optional callbacks or normalize them to no-op functions.",
          "Replace function equality with tokens or observable-behaviour tests.",
        ],
        answerSize: "standard",
        spoken: "- For a panic at a callback call, I start with the stack trace and inspect the exact function variable being invoked. Then I trace its initialization path. A struct field of function type begins as nil unless a constructor sets it, and a zero-valued struct may bypass that constructor. The API needs one clear rule: reject missing required callbacks, guard optional callbacks, or replace optional nil values with a no-op.\n\n- Interfaces require an extra check. If a typed nil function is assigned to `any`, the interface itself is not nil because it contains a dynamic type. A test such as `value != nil` succeeds, but asserting it back to the function type and calling it still panics. The value should be checked after type assertion, or the typed nil should not be placed into the interface in the first place.\n\n- For example, `var hook func(); var value any = hook` makes `value == nil` false. After `callback := value.(func())`, `callback == nil` is true. This two-part interface model—dynamic type and dynamic value—explains why the original guard failed.\n\n- If the issue is a compile error or panic from comparing callbacks, I identify the real requirement. Optionality uses a nil check, registration uses explicit tokens, and correctness uses calls with controlled inputs. Function equality is not the solution. A focused regression test should cover construction without the callback and the exact path that invokes it.",
        overviewTitle: "Follow the function value's state, including interfaces",
        overview: "Most nil callback bugs begin before the call: construction left a field unset, a setter accepted nil, or a zero value was assumed usable. Fixing only the panic site can scatter defensive checks without defining the object's invariant.\n\nAn interface adds a wrapper around the function value. Interface nilness means both dynamic type and dynamic value are absent. A typed nil function supplies a dynamic type, so the interface is non-nil even though the callable inside it remains nil.",
        visual: {
          type: "flow_diagram",
          title: "Trace a callback before invoking it",
          content: "```mermaid\nflowchart TD\n  A[Callback call panics] --> B{Stored directly?}\n  B -- Yes --> C[Check callback == nil]\n  B -- In interface --> D[Assert function type, then check typed value]\n  C --> E{Is absence valid?}\n  D --> E\n  E -- No --> F[Reject during construction]\n  E -- Yes --> G[Guard or normalize to no-op]\n```",
        },
        exampleTitle: "Expose a typed nil inside an interface",
        code: go(`package main

import "fmt"

func main() {
    var hook func()
    var value any = hook

    fmt.Println(value == nil)
    callback := value.(func())
    fmt.Println(callback == nil)
}`),
        exampleNote: "The output is `false` and then `true`. The interface has a dynamic function type, while the extracted function value is nil.",
        testing: "Ability to locate initialization errors and reason about typed nil functions in interfaces.",
        commonMistake: "Checking only the interface for nil before calling a typed function stored inside it.",
        depthSignal: "Connect the stack trace to construction invariants and the two-part interface representation.",
      },
    ],
  },
  "defer-basics": {
    title: "Defer",
    questions: [
      {
        question: "How does defer work in Go, and when are its arguments evaluated?",
        title: "How Go defer works",
        direct: "A `defer` statement evaluates the called function value and its arguments immediately, saves that call, and runs it when the surrounding function is about to return. Multiple deferred calls run in last-in, first-out order. A deferred closure can instead read captured variables when the closure actually executes, which may produce a later value.",
        points: [
          "The function value and call arguments are evaluated at the `defer` statement.",
          "The saved call runs when the surrounding function returns.",
          "Deferred calls run in last-in, first-out order.",
          "Defers also run while a panic unwinds the goroutine's stack.",
          "A deferred closure reads captured variables when its body runs.",
        ],
        answerSize: "standard",
        spoken: "- `defer` separates evaluation from invocation. When execution reaches `defer f(x)`, Go evaluates `f` and `x` immediately and records that specific call. The call itself runs just before the surrounding function returns, whether the function reaches its end, executes a return statement, or is unwinding because of a panic.\n\n- Deferred calls belong to the surrounding function, not to the nearest block. If several are registered, they execute in reverse registration order. This makes nested acquisition and cleanup line up naturally: acquire A, defer release A, acquire B, defer release B; B is released before A.\n\n- Argument timing is a common source of confusion. In `value := 1; defer fmt.Println(value); value = 2`, the deferred call prints one because the argument was saved at the defer statement. In `defer func() { fmt.Println(value) }()`, the closure captures `value` and reads it later, so it prints two. Both behaviours follow ordinary argument evaluation and closure capture rules.\n\n- For example, deferring prints inside a loop registers one call per executed defer, and those calls run only when the containing function returns. I use defer when function-scoped cleanup is the correct lifetime, and I choose between direct arguments and a closure deliberately based on whether I need an early snapshot or the final state. That timing choice should be visible wherever the captured value can change before return.",
        overviewTitle: "Record now, invoke at function exit",
        overview: "The easiest model has three moments: evaluate the function and arguments, push the call onto the current function's defer stack, and invoke saved calls in reverse order during return. A deferred closure still has its body delayed, so captured reads occur during the final step.\n\nReturn values are assigned before deferred calls run. This allows a deferred closure to inspect or modify named result parameters, although using that power indiscriminately can make results hard to trace.",
        visual: {
          type: "flow_diagram",
          title: "Lifetime of a deferred call",
          content: "```mermaid\nsequenceDiagram\n  participant F as Surrounding function\n  participant S as Saved defer stack\n  participant D as Deferred function\n  F->>F: evaluate function and arguments\n  F->>S: push saved call\n  F->>F: continue ordinary work\n  F->>S: begin return\n  S->>D: invoke calls in LIFO order\n  D-->>F: cleanup or result adjustment\n```",
        },
        exampleTitle: "Contrast saved arguments with a captured variable",
        code: go(`package main

import "fmt"

func show() {
    value := 1
    defer fmt.Println("argument", value)
    defer func() { fmt.Println("closure", value) }()
    value = 2
}

func main() { show() }`),
        exampleNote: "The closure runs first and prints `closure 2`; the saved call then prints `argument 1`. Reverse order and different evaluation times are both visible.",
        testing: "Understanding evaluation time, execution time, function scope, and LIFO order.",
        commonMistake: "Assuming all expressions inside a defer observe either only the early or only the final value.",
        depthSignal: "Trace a direct deferred call and a deferred closure through all three moments.",
      },
      {
        question: "Why is defer useful for resource cleanup in Go?",
        title: "Resource cleanup with defer",
        direct: "`defer` places cleanup beside successful resource acquisition while guaranteeing that it runs on every later return path from the function. It is well suited to closing files and response bodies, unlocking mutexes, and rolling back incomplete work. Register cleanup only after acquisition succeeds, and check cleanup errors explicitly when they affect correctness.",
        points: [
          "Place defer immediately after successful acquisition.",
          "The cleanup runs across early returns and panics.",
          "Function-scoped lifetime must match the resource's desired lifetime.",
          "Some close or flush errors must be returned instead of ignored.",
          "Nested acquisitions unwind naturally in reverse order.",
        ],
        answerSize: "standard",
        spoken: "- Defer is valuable for cleanup because it lets code state the lifetime rule next to the acquisition. After `os.Open` succeeds, `defer file.Close()` records that the file must be closed before the current function exits. Every later error return then shares the same cleanup path, so adding a new branch is less likely to leak the resource.\n\n- The defer must be registered only after acquisition succeeds. Deferring a method on an invalid or nil resource can replace the original error with a panic. The surrounding function is also the lifetime boundary: a defer inside a long-running function holds the resource until that whole function returns, not until the nearby block or loop iteration ends.\n\n- For example, a helper that opens and reads one file can defer close immediately. If the API can report an important close error—buffered writers and transactional cleanup are common examples—the function may need to call cleanup explicitly or use a named error result and combine the cleanup error carefully. Blindly ignoring every close result is not always correct.\n\n- LIFO ordering supports dependencies between resources. If code acquires an outer resource and then an inner resource, registering each cleanup immediately releases the inner one first. I use defer when the resource should live for the rest of the function; otherwise I create a smaller helper function or close explicitly at the earlier required point.",
        overviewTitle: "Attach the release rule to successful acquisition",
        overview: "Cleanup bugs appear when acquisition and release drift apart across several returns. Defer keeps the release decision local while centralizing execution at function exit. That is a correctness benefit rather than simply shorter syntax.\n\nThe important qualifier is scope. Defer guarantees *function-exit* cleanup. When processing many independent resources, a helper function creates one exit per item and lets each resource close promptly. Cleanup errors also remain part of the operation's contract when they can indicate lost data.",
        visual: {
          type: "flow_diagram",
          title: "Cleanup follows every return path",
          content: "```mermaid\nflowchart TD\n  A[Acquire resource] --> B{Acquisition succeeded?}\n  B -- No --> C[Return acquisition error]\n  B -- Yes --> D[Register defer cleanup]\n  D --> E{Work outcome}\n  E -- success --> F[Return]\n  E -- early error --> F\n  E -- panic --> G[Unwind]\n  F --> H[Run cleanup]\n  G --> H\n```",
        },
        exampleTitle: "Close an opened file on every path",
        code: go(`package main

import (
    "fmt"
    "os"
)

func size(name string) (int64, error) {
    file, err := os.Open(name)
    if err != nil { return 0, err }
    defer file.Close()

    info, err := file.Stat()
    if err != nil { return 0, err }
    return info.Size(), nil
}

func main() {
    n, err := size(os.Args[0])
    fmt.Println(n > 0, err)
}`),
        exampleNote: "The executable file is closed whether `Stat` succeeds or returns early with an error. The program prints `true <nil>` in a normal run.",
        testing: "Whether cleanup registration, lifetime, ordering, and cleanup errors are handled deliberately.",
        commonMistake: "Deferring cleanup before acquisition succeeds or assuming defer ends at the nearest block.",
        depthSignal: "Connect the resource lifetime to the surrounding function and discuss meaningful close errors.",
      },
      {
        question: "Why can defer inside a loop keep resources open too long?",
        title: "Defer inside loops",
        direct: "A defer inside a loop is attached to the surrounding function, so every iteration adds another pending call and none runs at the end of the iteration. In a large or long-running loop, files, locks, memory, or network bodies can accumulate. Move one iteration into a helper function or perform explicit cleanup when each resource must be released promptly.",
        points: [
          "Defer is function-scoped, not block- or iteration-scoped.",
          "Each executed defer adds one pending call.",
          "A long loop can retain many resources until function exit.",
          "A per-item helper gives every iteration its own defer boundary.",
          "Use explicit cleanup if release must happen before the helper returns.",
        ],
        answerSize: "compact",
        spoken: "- A defer statement inside a loop does not run when that iteration ends. It registers cleanup for the function containing the loop. If the loop opens one file per item and defers every close, all files remain open until the entire function returns. A sufficiently large input can exhaust file descriptors even though the source appears to close every file.\n\n- The same lifetime issue applies to response bodies, temporary buffers, and locks. It is not that defer is forbidden in loops; the question is whether retaining every acquired resource until function exit is acceptable. A small fixed loop may be harmless, while an unbounded worker loop may never return at all.\n\n- For example, I extract `processFile(name)` so it opens one file, defers its close, completes one unit of work, and returns. The outer loop calls that helper for each name. Each return creates the desired cleanup point without manually duplicating close calls across the helper's error paths.\n\n- Explicit cleanup is also valid when the correct release point is visible and early. I avoid adding an immediately invoked anonymous function solely by habit if a named helper describes the unit of work better. The essential rule is to align the function boundary—and therefore defer execution—with the intended resource lifetime.",
        overviewTitle: "The containing function owns every defer",
        overview: "Lexical indentation can make a defer look as if it belongs to the loop body, but runtime ownership belongs to the function invocation. Each executed statement pushes another saved call onto that invocation's defer stack. Nothing pops until return begins.\n\nCreating a helper changes the lifetime model cleanly. The loop owns iteration, while the helper owns one resource. This also makes the helper testable with one success and one failure path.",
        visual: {
          type: "comparison_table",
          title: "Loop shape and resource lifetime",
          content: "| Shape | When each close runs | Risk |\n|---|---|---|\n| `defer` directly in outer loop | End of outer function | Resources accumulate |\n| `processOne` helper with defer | End of each helper call | Prompt per-item release |\n| Explicit close in loop | At the close statement | Easy to miss on an early branch |\n| Defer in endless worker loop | Potentially never | Persistent leak |",
        },
        exampleTitle: "Give each file its own function boundary",
        code: go(`package main

import (
    "fmt"
    "os"
)

func inspect(name string) error {
    file, err := os.Open(name)
    if err != nil { return err }
    defer file.Close()
    _, err = file.Stat()
    return err
}

func main() {
    for _, name := range os.Args[:1] {
        fmt.Println(inspect(name))
    }
}`),
        exampleNote: "`inspect` returns once per file, so its deferred close runs before the next iteration. In this sample it prints `<nil>` for the executable path.",
        testing: "Recognition that defer lifetime is set by a function call rather than a block.",
        commonMistake: "Reading indentation as the cleanup boundary and missing accumulation in long loops.",
        depthSignal: "Refactor around one logical unit of resource ownership.",
      },
      {
        question: "What is the difference between deferred arguments and a deferred closure?",
        title: "Deferred calls versus deferred closures",
        direct: "A direct deferred call saves its evaluated arguments when the `defer` statement runs. A deferred closure runs later and reads captured variables at that later time unless values are passed into the closure as parameters. Use a direct call or closure parameters for an early snapshot; use capture only when the final value is intentionally required.",
        points: [
          "`defer f(value)` saves `value` immediately.",
          "`defer func(){ f(value) }()` reads captured `value` later.",
          "Closure parameters can snapshot values explicitly.",
          "A closure can perform conditional or multi-step cleanup.",
          "Choose timing deliberately so later reassignment is not surprising.",
        ],
        answerSize: "compact",
        spoken: "- The difference comes from ordinary evaluation rules. In `defer report(status)`, the function value and `status` argument are evaluated immediately, so the saved call keeps the current status. In `defer func() { report(status) }()`, only the closure call is deferred; the body reads the captured `status` when the surrounding function returns.\n\n- This lets code choose between a snapshot and final state. A trace statement often wants the starting value, so a direct deferred argument is suitable. A deferred closure may need the final error result, elapsed state, or whether a transaction was committed, so reading later is intentional. The timing should be obvious because both forms can look almost identical at a glance.\n\n- For example, a function sets `status := \"started\"`, registers one direct deferred print and one closure print, then changes the status to `\"finished\"`. LIFO makes the closure run first; it prints the final value. The direct call prints the saved starting value. Passing `status` as a parameter to the function literal would also snapshot it at registration.\n\n- I use a closure when cleanup requires conditions, several statements, recovery, or access to final named results. For a simple call whose current arguments should be retained, direct defer is clearer. The boundary is late capture: if the variable can change, the selected form becomes part of correctness rather than style.",
        overviewTitle: "Decide which moment supplies each value",
        overview: "A function literal is itself the argument-less call in a statement such as `defer func(){...}()`. Its body has not run at registration, so captured expressions inside that body have not been evaluated. By contrast, the arguments written on a direct deferred call are part of the statement's immediate evaluation.\n\nClosure parameters provide a third, explicit form: `defer func(v string){ report(v) }(status)`. The parameter argument is evaluated immediately, while the multi-statement body remains delayed.",
        visual: {
          type: "comparison_table",
          title: "When is `status` read?",
          content: "| Form | Read time | Typical use |\n|---|---|---|\n| `defer report(status)` | At registration | Preserve current value |\n| `defer func(){ report(status) }()` | At function exit | Observe final captured value |\n| `defer func(s string){ report(s) }(status)` | Argument now, body later | Snapshot plus multi-step body |",
        },
        exampleTitle: "Trace all three evaluation forms",
        code: go(`package main

import "fmt"

func demo() {
    status := "started"
    defer fmt.Println("direct:", status)
    defer func(saved string) { fmt.Println("parameter:", saved) }(status)
    defer func() { fmt.Println("captured:", status) }()
    status = "finished"
}

func main() { demo() }`),
        exampleNote: "The output order is `captured: finished`, `parameter: started`, then `direct: started`. Timing and LIFO order explain every line.",
        testing: "Whether argument evaluation and closure capture timing can be traced separately.",
        commonMistake: "Assuming a deferred closure snapshots every variable mentioned in its body.",
        depthSignal: "Choose and justify snapshot or final-state semantics.",
      },
      {
        question: "How do you trace the order of multiple defer calls in Go?",
        title: "Tracing multiple deferred calls",
        direct: "List deferred calls in the order execution registers them, then run that list backward when the function exits. Include only defers on paths that actually executed, and remember that return expressions are evaluated before deferred calls begin. During panic unwinding, each stack frame follows the same last-in, first-out rule before unwinding continues to its caller.",
        points: [
          "Registration happens only when execution reaches a defer statement.",
          "Each function invocation has its own deferred-call sequence.",
          "Calls execute in reverse registration order.",
          "Return values are set before defers execute.",
          "Panic unwinding runs a frame's defers before moving to its caller.",
        ],
        answerSize: "standard",
        spoken: "- I trace defer with a stack per function invocation. As ordinary control flow reaches each defer, I write down the already evaluated call. Branches that are not taken register nothing, and a defer inside a loop can register several calls. When that function begins returning, I pop the recorded calls from the end.\n\n- Return processing has an important order. Go evaluates the return expressions and assigns result parameters first. Then deferred calls run. After they finish, the completed results go back to the caller. That is why a deferred closure can observe and modify a named result parameter, while an unnamed result is not directly available by name.\n\n- For example, if a function registers `A`, enters a branch and registers `B`, then loops twice and registers `0` and `1`, its exit order is `1`, `0`, `B`, `A`. The source order alone is insufficient because registration follows the executed path. Writing a registration log removes the ambiguity.\n\n- A panic changes why the function exits but not its local defer order. The current frame runs its saved calls in reverse; then unwinding continues into the caller, which runs its own defers. A recover call may stop that sequence only under its specific deferred-function rules. This stack-by-stack model explains cleanup order without relying on guesswork.",
        overviewTitle: "Model one LIFO stack for each active call",
        overview: "Deferred calls are dynamic, not a static scan of the source file. A statement in a false branch contributes no entry, while one statement reached three times contributes three entries with separately evaluated arguments. Recursive invocations each own a different stack.\n\nNormal return and panic share the same per-frame cleanup mechanics. The surrounding reason for exit affects what happens after those calls, but not their last-in, first-out ordering within the frame.",
        visual: {
          type: "flow_diagram",
          title: "Push while running, pop while returning",
          content: "```mermaid\nflowchart LR\n  A[register A] --> B[stack: A]\n  B --> C[register B]\n  C --> D[stack: A, B]\n  D --> E[register C]\n  E --> F[stack: A, B, C]\n  F --> G[return begins]\n  G --> H[run C]\n  H --> I[run B]\n  I --> J[run A]\n```",
        },
        exampleTitle: "Trace conditional and repeated registration",
        code: go(`package main

import "fmt"

func trace(include bool) {
    defer fmt.Println("A")
    if include {
        defer fmt.Println("B")
    }
    for i := 0; i < 2; i++ {
        defer fmt.Println(i)
    }
    fmt.Println("body")
}

func main() { trace(true) }`),
        exampleNote: "The output is `body`, `1`, `0`, `B`, `A`. The loop registers two calls with argument snapshots, and the true branch contributes `B`.",
        testing: "Ability to derive defer order from executed control flow rather than textual order alone.",
        commonMistake: "Forgetting repeated registration or running defers before return values are assigned.",
        depthSignal: "Trace normal return and panic one stack frame at a time.",
      },
    ],
  },
  "multiple-return-values": {
    title: "Multiple Return Values",
    questions: [
      {
        question: "How do multiple return values work in Go?",
        title: "Multiple return values in Go",
        direct: "A Go function may declare and return several values in a fixed order, and callers normally receive them through a matching multi-assignment. The values are separate results, not an automatically created tuple object. This supports common contracts such as `(value, error)` and `(value, ok)`, while related data with long-term identity may be clearer as a named struct.",
        points: [
          "A function signature fixes the number, order, and types of results.",
          "Callers usually assign every result in one statement.",
          "Use `_` only when a returned value is intentionally irrelevant.",
          "`(value, error)` and `(value, ok)` make status explicit.",
          "Multiple results are not a tuple value that can be stored as one item.",
        ],
        answerSize: "compact",
        spoken: "- Go functions can declare more than one result, such as `func lookup(key string) (string, bool)`. A return statement supplies those values in the declared order, and the caller can receive them with `value, ok := lookup(\"theme\")`. Each left-hand variable gets one result; Go does not package the pair into a general tuple object.\n\n- This feature keeps common status information beside the useful value. Maps, type assertions, and channel receives use a value plus a Boolean in their comma-ok forms. Operations that can fail normally return a useful value plus `error`. The caller can see both parts of the contract directly in the signature and must decide what to do with each.\n\n- For example, a division helper can return `(quotient int, err error)`. On a zero divisor it returns the integer zero together with an error. The zero is not evidence of success, because zero can also be a valid quotient; the error is the authoritative status. The caller checks it before using the value.\n\n- Multiple results work best for a small, stable set of values that naturally belong to one operation. If many fields evolve together, need names at storage sites, or form a domain object, a struct may communicate better. I keep result order unambiguous and avoid discarding errors with `_` merely to shorten a call.",
        overviewTitle: "One call can return several independent results",
        overview: "A multi-valued call is a special expression that supplies one value for each declared result position. Multi-assignment gives each result a destination at the same time. This prevents a partially updated set of receiver variables and makes status-return patterns concise.\n\nThe positions remain part of the API. Two adjacent results with the same type can be easy to reverse, which is one reason names in declarations or a result struct may improve clarity. The caller still receives values, not the declaration's local result variables.",
        visual: {
          type: "flow_diagram",
          title: "A multi-valued call fans out by position",
          content: "```mermaid\nflowchart LR\n  A[divide 10, 2] --> B[return 5, nil]\n  B --> C[quotient receives 5]\n  B --> D[err receives nil]\n  D --> E{err != nil?}\n  E -- No --> F[use quotient]\n```",
        },
        exampleTitle: "Return a result and its error",
        code: go(`package main

import (
    "errors"
    "fmt"
)

func divide(a, b int) (int, error) {
    if b == 0 { return 0, errors.New("division by zero") }
    return a / b, nil
}

func main() {
    value, err := divide(10, 2)
    fmt.Println(value, err)
}`),
        exampleNote: "The output is `5 <nil>`. Calling `divide(10, 0)` would return `0` plus a non-nil error; the caller must use the error to interpret the value.",
        testing: "Understanding positional results, multi-assignment, and status-bearing return patterns.",
        commonMistake: "Treating the first value as successful before checking its accompanying status.",
        depthSignal: "Explain why the results are separate and when a struct becomes a clearer contract.",
      },
      {
        question: "Why do Go functions often return both a value and an error?",
        title: "The value-and-error return pattern",
        direct: "Go functions return `(value, error)` so expected failures are explicit data in the ordinary control flow. By convention, a nil error means the operation succeeded and a non-nil error explains why it failed; the accompanying value may be unusable, partially useful, or valid according to that API's documentation. Callers should check the error before assuming what the value means.",
        points: [
          "Errors are ordinary returned values, not hidden exceptions.",
          "A nil error conventionally signals success.",
          "A non-nil error may accompany zero, partial, or documented useful data.",
          "Check the error before treating the main value as valid.",
          "Wrap errors when adding context while preserving their cause.",
        ],
        answerSize: "standard",
        spoken: "- The `(value, error)` pattern separates an operation's useful result from its failure information without changing control flow invisibly. A function such as `strconv.Atoi` returns the parsed integer and an error. The caller checks `err`; nil means parsing succeeded, while a non-nil error carries the failure. This makes every fallible call visible in the code that owns the recovery decision.\n\n- The value beside an error must be interpreted according to the API. Many functions return the zero value when they fail, but some return partial progress. An `io.Reader`, for example, may return `n > 0` and a non-nil error in the same call, and the bytes counted by `n` must be processed before the error. Therefore, “ignore every value whenever error is non-nil” is not a universal language rule.\n\n- For example, a configuration loader can return a complete `Config` and nil on success, or the zero `Config` plus an error on invalid input. The caller handles the error before using the configuration. If it adds context, `fmt.Errorf(\"load config: %w\", err)` preserves the wrapped cause for `errors.Is` and `errors.As`.\n\n- Errors suit failures callers can reasonably handle or report. Panic is reserved for broken invariants or truly exceptional situations, not routine invalid input. A good value-and-error contract documents whether partial data is possible, and callers respect that contract rather than relying on the main value's zero-ness.",
        overviewTitle: "Failure remains part of the function's visible contract",
        overview: "Returning an error forces the possibility of failure into the signature. The function detects and describes the problem; its caller chooses whether to retry, use a fallback, add context, or return the failure upward. This keeps policy at the appropriate layer.\n\nThe pair does not impose one rule for partial data. Each API defines whether data returned with an error is meaningful. Readers commonly report progress and end-of-stream together, whereas parsers often return a zero value on failure.",
        visual: {
          type: "comparison_table",
          title: "Interpret both results using the API contract",
          content: "| Result shape | Meaning | Caller action |\n|---|---|---|\n| Useful value, `nil` | Success | Use the value |\n| Zero value, non-nil error | Failed with no usable result | Handle or return error |\n| Partial value, non-nil error | Progress plus terminal/problem state | Process documented partial data, then error |\n| Value ignored, error ignored | Contract discarded | Usually a bug |",
        },
        exampleTitle: "Add context without losing the original error",
        code: go(`package main

import (
    "errors"
    "fmt"
    "strconv"
)

var ErrPort = errors.New("invalid port")

func port(text string) (int, error) {
    value, err := strconv.Atoi(text)
    if err != nil { return 0, fmt.Errorf("%w: %q", ErrPort, text) }
    return value, nil
}

func main() {
    _, err := port("abc")
    fmt.Println(errors.Is(err, ErrPort))
}`),
        exampleNote: "The output is `true`. The function returns no usable port, adds the input as context, and preserves a stable error identity.",
        testing: "Understanding explicit failure flow and the documented possibility of partial results.",
        commonMistake: "Assuming the main value alone proves success or that non-nil errors always invalidate all returned data.",
        depthSignal: "Use an API with partial progress to show why both results matter.",
      },
      {
        question: "What is the comma-ok idiom in Go?",
        title: "The comma-ok idiom in Go",
        direct: "The comma-ok idiom receives a value and a Boolean that reports whether an operation succeeded in its special two-result form. It is used with map lookup, type assertion, and channel receive. The Boolean distinguishes a real zero value from absence or failure, and for channels it distinguishes a sent zero value from a closed-and-drained channel.",
        points: [
          "Map lookup: `value, ok := m[key]` reports key presence.",
          "Type assertion: `value, ok := x.(T)` avoids a failed-assertion panic.",
          "Channel receive: `value, ok := <-ch` reports whether a value was received before closure.",
          "The zero value alone cannot represent both present and absent.",
          "Use the single-result form only when the distinction is irrelevant or guaranteed.",
        ],
        answerSize: "standard",
        spoken: "- Comma-ok is Go's conventional name for special operations that can produce a useful value plus a Boolean status. With a map, `value, ok := settings[\"theme\"]` sets `ok` to true when the key exists. Without `ok`, a missing key returns the value type's zero value, which is indistinguishable from a stored zero value.\n\n- A type assertion has a similar two-result form. `text, ok := input.(string)` returns the asserted string and true when the interface holds a string. On mismatch it returns the string zero value and false instead of panicking. This is appropriate when multiple dynamic types are expected; a single-result assertion is suitable only when mismatch represents a programming error.\n\n- A channel receive uses `value, ok := <-ch`. The Boolean is false only when the channel is closed and no more sent values remain. A closed channel may still yield buffered values with true before eventually returning the element zero value with false. This status must not be confused with whether the value itself is zero.\n\n- For example, a map can intentionally store `0` attempts for a user. `attempts == 0` cannot tell whether the user is present; `ok` can. The shared idea across all three forms is that zero values remain valid data, so a separate Boolean carries presence or success. That separate status prevents legitimate zero data from being mistaken for a missing result.",
        overviewTitle: "Status preserves the meaning of a zero value",
        overview: "Go guarantees useful zero values, but that creates ambiguity when an operation can also report absence. The comma-ok forms add one bit of information without requiring an error object for a normal branch.\n\nAlthough the syntax looks similar, the status has operation-specific meaning: key presence for maps, assertion success for interfaces, and open-or-buffered receive status for channels. Reading `ok` as a generic “no error” can hide those differences.",
        visual: {
          type: "comparison_table",
          title: "The three common comma-ok forms",
          content: "| Operation | Example | `ok == false` means |\n|---|---|---|\n| Map lookup | `v, ok := m[k]` | Key is absent |\n| Type assertion | `v, ok := x.(T)` | Dynamic value is not compatible with `T` |\n| Channel receive | `v, ok := <-ch` | Channel is closed and drained |",
        },
        exampleTitle: "Distinguish an absent key from a stored zero",
        code: go(`package main

import "fmt"

func main() {
    attempts := map[string]int{"ana": 0}
    ana, anaOK := attempts["ana"]
    lee, leeOK := attempts["lee"]
    fmt.Println(ana, anaOK)
    fmt.Println(lee, leeOK)
}`),
        exampleNote: "The output is `0 true` and `0 false`. Both lookups return zero, while `ok` preserves the important presence distinction.",
        testing: "Understanding the distinct Boolean meaning for maps, type assertions, and channel receives.",
        commonMistake: "Using the returned zero value to guess whether the operation succeeded.",
        depthSignal: "Contrast all three operations and explain the closed buffered-channel boundary.",
      },
      {
        question: "When should a Go function return multiple values instead of a struct?",
        title: "Multiple results versus a result struct",
        direct: "Return multiple values for a small, stable, immediately consumed result—especially a primary value with `error` or `ok`. Return a struct when several fields form one domain concept, field names improve clarity, the result is stored or passed onward, or the shape is likely to evolve. The choice is about API meaning and compatibility, not runtime speed by default.",
        points: [
          "Multiple values fit small operation results consumed immediately.",
          "Status values such as `error` and `ok` naturally remain separate.",
          "A struct gives same-typed fields names at every use site.",
          "Struct results are easy to store, pass, and extend deliberately.",
          "Changing either public result shape can still affect callers.",
        ],
        answerSize: "standard",
        spoken: "- Multiple return values are clearest when an operation produces a small fixed set that callers use immediately. `(User, error)` is familiar because one value is the result and the other is its status. Two indexes such as `(start, end)` can also work when the names in the function declaration make their order obvious and the values are immediately assigned.\n\n- A struct is stronger when the values together represent one concept. Search output may contain `Items`, `NextCursor`, and `Total`; a `SearchResult` names those fields wherever the value travels. It can be stored in a variable, sent on a channel, returned from another function as one value, and extended with methods or documented fields.\n\n- For example, returning three strings for host, user, and database invites accidental reordering because all positions have the same type. A `ConnectionInfo` struct makes each meaning explicit at construction and access. In contrast, wrapping every `(value, error)` pair in a bespoke struct would fight Go conventions and make normal error flow more cumbersome.\n\n- The compatibility trade-off needs care. Adding a result to a function breaks assignments and callers. Adding a field can still break unkeyed composite literals and affects serialization or equality expectations, so a struct is not a magical versioning guarantee. I choose the representation that best names the data's relationship and expected use.",
        overviewTitle: "Use positions for a small operation; fields for a data concept",
        overview: "Positional results are concise but their meaning lives in the signature and receiving variable names. That works for status pairs and a few familiar operations. As values move farther from the call site, field names carry context more reliably.\n\nA struct also changes composition: it is one ordinary value. It can implement methods and be placed directly into collections or channels. Multiple results remain tied to call and assignment contexts rather than becoming a general tuple object.",
        visual: {
          type: "comparison_table",
          title: "Result-shape decision",
          content: "| Signal | Multiple values | Struct |\n|---|---:|---:|\n| Primary value + status | Strong fit | Usually unnecessary |\n| Several same-typed meanings | Easy to reverse | Named fields help |\n| Stored or forwarded as one value | Awkward | Natural |\n| Methods belong to result | Not possible as a group | Natural |\n| Tiny immediate destructuring | Concise | More ceremony |",
        },
        exampleTitle: "Name a multi-field domain result",
        code: go(`package main

import "fmt"

type SearchResult struct {
    Items []string
    NextCursor string
    Total int
}

func search() (SearchResult, error) {
    return SearchResult{Items: []string{"go"}, NextCursor: "page-2", Total: 9}, nil
}

func main() {
    result, err := search()
    fmt.Println(result.Items, result.NextCursor, result.Total, err)
}`),
        exampleNote: "The output names remain attached to the value: `[go] page-2 9 <nil>`. The error remains a separate status result by convention.",
        testing: "Whether result shape is chosen from meaning, use distance, and evolution rather than arbitrary count.",
        commonMistake: "Returning several same-typed values whose positions are easy to confuse.",
        depthSignal: "Discuss composition and compatibility boundaries for both forms.",
      },
      {
        question: "When can one Go function's multiple results be passed directly to another call?",
        title: "Passing multiple results directly to another function",
        direct: "Go permits `outer(inner(args))` when `inner` returns at least one value and those results match `outer`'s parameters in number, order, and assignability; the outer call cannot contain additional arguments. Remaining results may fill a final variadic parameter. This concise form is useful only when forwarding every result has the correct meaning, especially when one result is an error.",
        points: [
          "The inner call must return one or more values.",
          "Every result must align with the outer parameters in order.",
          "The outer call cannot mix other arguments with that multi-valued call.",
          "A final variadic parameter may receive remaining matching results.",
          "Do not forward `(value, error)` when the outer function does not truly handle that contract.",
        ],
        answerSize: "compact",
        spoken: "- Go has a special call rule for forwarding all results from one function into another. If `split` returns `(string, string)` and `join` accepts `(string, string)`, `join(split(value))` is valid. The results are assigned to the outer parameters in order, just as if each value had been written separately.\n\n- The shape must be exact enough for assignment. The inner call needs at least one result, and the outer call may not contain additional arguments beside that one multi-valued call. If the outer function ends in a compatible variadic parameter, remaining results can populate it. This is call composition, not creation of a tuple.\n\n- For example, `dimensions()` can return width and height, and `area(width, height)` can consume both directly. The compact call is readable because the two contracts align and neither result needs separate validation. If the inner function returns `(value, error)`, direct forwarding is safe only when the outer function genuinely accepts and interprets a value and an error in that order.\n\n- I expand the assignment when a result needs checking, naming, reordering, or transformation. Two extra lines are better than obscuring error handling. Direct multi-result forwarding is a precise language feature, but it should express natural composition rather than merely reduce local variables.",
        overviewTitle: "Composition works when the two signatures line up",
        overview: "The inner invocation supplies a sequence of values, and the outer invocation provides the destination parameters. Go checks each position for assignability. No intermediate aggregate exists, so the form is limited to call contexts that consume all results together.\n\nNatural mathematical or parsing operations can read clearly this way. Status-bearing operations often need a visible branch before their useful value should proceed, which makes explicit assignment the safer presentation.",
        visual: {
          type: "flow_diagram",
          title: "Results map directly onto parameters",
          content: "```mermaid\nflowchart LR\n  A[dimensions returns 4, 3] --> B[first result -> width]\n  A --> C[second result -> height]\n  B --> D[area width, height]\n  C --> D\n  D --> E[returns 12]\n```",
        },
        exampleTitle: "Compose compatible multi-result functions",
        code: go(`package main

import "fmt"

func dimensions() (int, int) { return 4, 3 }
func area(width, height int) int { return width * height }

func main() {
    fmt.Println(area(dimensions()))
}`),
        exampleNote: "The output is `12`. The two results of `dimensions` fill the two parameters of `area` in order.",
        testing: "Knowledge of the special multi-valued call rule and its readability boundary.",
        commonMistake: "Trying to add other arguments to the outer call or hiding required error handling inside composition.",
        depthSignal: "State every structural condition and explain when explicit assignment is clearer.",
      },
    ],
  },
  "named-return-values": {
    title: "Named Return Values",
    questions: [
      {
        question: "What are named return values in Go?",
        title: "Named return values in Go",
        direct: "Named return values are result parameters declared with identifiers in a Go function signature. They are initialized to their types' zero values when the function begins, are assignable variables inside the body, and are returned by a bare `return`. Their names can document same-typed results and allow deferred closures to inspect or modify the final values.",
        points: [
          "Named results are local variables created on function entry.",
          "They begin with their type's zero value.",
          "A bare return sends their current values to the caller.",
          "Deferred closures can access them before the caller receives them.",
          "Names do not change the function's type identity.",
        ],
        answerSize: "compact",
        spoken: "- Named return values are result parameters with identifiers, as in `func split(s string) (left, right string)`. Inside the function, `left` and `right` are ordinary local variables initialized to empty strings. The function may assign them and use a bare `return`, which returns their current values in declaration order.\n\n- The names can make a signature self-documenting when several results share a type. `value, nextPos int` conveys more than `(int, int)`. Callers do not receive those identifier names as fields, however; they still receive two positional integer values and may choose their own variable names. The names also do not affect the function type.\n\n- Named results are in scope for deferred closures. Because return expressions assign results before defers run, a defer can observe or modify the final named values. This supports careful error annotation or timing instrumentation, but hidden result changes can surprise readers and should remain small and deliberate.\n\n- For example, a range-normalization function can name `low` and `high`, swap them when necessary, and return them explicitly. Bare returns are optional; named results can still appear in `return low, high`. I use names when they clarify result meaning or a defer genuinely needs them, not simply to save typing at every return.",
        overviewTitle: "Result parameters are variables with a return role",
        overview: "Incoming parameters receive caller arguments; named result parameters begin as zero values and eventually supply values back to the caller. Both are local to the function invocation. This explains why named results can be assigned, captured, and inspected during deferred execution.\n\nA bare return is only shorthand for returning their current values. It does not calculate or validate them. Long functions with many paths can leave a named result at zero accidentally, so explicit return expressions may still be the clearer choice.",
        visual: {
          type: "flow_diagram",
          title: "Lifecycle of named result parameters",
          content: "```mermaid\nflowchart LR\n  A[Function entry] --> B[Create named results with zero values]\n  B --> C[Body assigns results]\n  C --> D[Return expressions set final values]\n  D --> E[Deferred calls may inspect or modify]\n  E --> F[Caller receives values]\n```",
        },
        exampleTitle: "Use names to clarify two same-typed results",
        code: go(`package main

import "fmt"

func ordered(a, b int) (low, high int) {
    low, high = a, b
    if low > high { low, high = high, low }
    return low, high
}

func main() {
    fmt.Println(ordered(9, 2))
}`),
        exampleNote: "The output is `2 9`. The names explain each integer's role inside the declaration and body, while the caller still receives positional results.",
        testing: "Understanding initialization, scope, bare returns, and defer access for named results.",
        commonMistake: "Treating result names as caller-visible fields or assuming bare return sets meaningful values automatically.",
        depthSignal: "Trace named results from zero initialization through deferred execution.",
      },
      {
        question: "When do named return values improve Go code?",
        title: "Good uses for named return values",
        direct: "Named returns improve Go code when result roles would otherwise be ambiguous, especially several values of the same type, or when a small deferred function must consistently inspect the final error. They are less useful for obvious single results and harmful when bare returns make a long function's output difficult to trace. Use names for meaning, not merely brevity.",
        points: [
          "Name results when their roles are not obvious from types alone.",
          "Names can document pairs such as `value` and `nextPos`.",
          "A defer can add context to one final named error consistently.",
          "Explicit return expressions remain valid with named results.",
          "Avoid names that only repeat types or encourage distant bare returns.",
        ],
        answerSize: "compact",
        spoken: "- Named return values are most helpful when the signature itself needs labels. A scanner returning two integers becomes easier to understand as `(value, nextPos int)` than `(int, int)`. Those names also improve documentation generated from the declaration and reduce the chance of reversing assignments inside the implementation.\n\n- Another focused use is a deferred function that works with the final result. A function may have several error exits and use one named `err` so a defer records success or failure consistently. It can also wrap an error with shared context, provided the transformation is straightforward and does not conceal which path produced it.\n\n- For example, a timing helper can defer a closure that reads named `err` and records whether an operation succeeded. The body still uses explicit `return value, err` statements, so readers can see what each branch returns. Naming results does not require bare returns; documentation and defer access are independent benefits.\n\n- I avoid named results when one obvious value is returned or when a long function would depend on assignments far above a bare return. In that shape, readers must simulate every branch to know the final values. Names should remove ambiguity at the boundary, not move it into hidden mutable state. Small functions and explicit returns keep the feature readable, local, auditable, and safe to change.",
        overviewTitle: "Use names where types do not carry enough meaning",
        overview: "A result list is positional. When positions share a type, identifiers add human meaning even though they do not change type identity. This is similar to useful parameter names: the compiler could work without them, but maintainers benefit from the roles.\n\nDeferred access is a separate reason. A named error provides one final variable after return expressions have run. Logging or error wrapping can be centralized there, yet business logic should not depend on surprising post-return mutation.",
        visual: {
          type: "comparison_table",
          title: "Where named results help or hurt",
          content: "| Situation | Named result effect | Recommendation |\n|---|---|---|\n| Two same-typed positions | Explains roles | Name them |\n| One obvious result | Repeats the type's meaning | Usually omit |\n| Defer observes final error | Gives one stable variable | Name `err` deliberately |\n| Long body with distant bare return | Hides final assignments | Use explicit returns or refactor |",
        },
        exampleTitle: "Let a defer observe one final error",
        code: go(`package main

import (
    "errors"
    "fmt"
)

func load(found bool) (value string, err error) {
    defer func() { fmt.Println("failed:", err != nil) }()
    if !found { return "", errors.New("not found") }
    return "ready", nil
}

func main() {
    value, err := load(false)
    fmt.Println(value, err)
}`),
        exampleNote: "The defer sees the error after the return expression assigns it. The program prints `failed: true` before the caller prints the empty value and `not found`.",
        testing: "Whether named results are used to clarify roles or a real defer requirement.",
        commonMistake: "Equating named results with mandatory bare returns or naming every obvious single result.",
        depthSignal: "Separate signature documentation from deferred access and preserve explicit return flow.",
      },
      {
        question: "Why can naked returns make Go functions hard to maintain?",
        title: "Risks of naked returns in Go",
        direct: "A naked return supplies the current named result variables without showing them at the return site. It can be readable in a tiny function where assignments are adjacent, but in a long or branching function it forces readers to trace mutable result state and can accidentally return zero or stale values. Prefer explicit return expressions or smaller functions when the result is not immediately obvious.",
        points: [
          "A naked return is a bare `return` in a function with named results.",
          "It returns the results' current values, including untouched zero values.",
          "Nearby assignments can make it concise in a tiny function.",
          "Branches and shadowing make distant naked returns difficult to audit.",
          "Explicit returns show the contract at each exit point.",
        ],
        answerSize: "compact",
        spoken: "- A naked return contains no expressions; it returns whatever the named result variables currently hold. In a three-line function where those variables are assigned immediately above, that can be clear. In a longer function with several branches, the return site no longer tells the reader which values leave the function.\n\n- The risk is ordinary mutable state. A path may forget to assign one result, leaving its zero value, or a short declaration may create a different inner variable while the named result remains unchanged. Later edits can add early returns whose correctness depends on assignments far away. The compiler verifies types and definite termination, not that the current result values match the programmer's intention.\n\n- For example, a parser with named `value` and `err` may set `value`, enter a branch that accidentally shadows `err`, and then use bare `return`. Even if a particular shadowing shape is rejected by the compiler near a naked return, similar stale-result logic can remain confusing. Writing `return value, err` makes the chosen variables visible and often exposes the mistake during review.\n\n- I reserve naked returns for short, linear functions where the result assignments and return are visually connected. Named results may still document a signature or support a defer while all ordinary paths use explicit returns. The two language features do not have to be used together.",
        overviewTitle: "The return site should reveal the outgoing values",
        overview: "A bare return delegates meaning to the history of named result variables. That history is easy to hold in mind only when the function is small and linear. Each branch, loop, and reassignment increases the amount of state a reader must reconstruct.\n\nExplicit expressions duplicate a few variable names but restore locality. They also make refactoring safer because moving a return does not silently change which earlier assignments it depends on.",
        visual: {
          type: "comparison_table",
          title: "Readability at an exit point",
          content: "| Return form | What is visible locally | Best fit |\n|---|---|---|\n| `return` | Only that named results exist | Tiny linear function |\n| `return value, err` | Exact outgoing variables | Branching or longer function |\n| `return \"\", err` | Exact value chosen for this error | Guard clause |",
        },
        exampleTitle: "Keep the result visible at each branch",
        code: go(`package main

import (
    "errors"
    "fmt"
)

func label(id int) (text string, err error) {
    if id <= 0 { return "", errors.New("id must be positive") }
    text = fmt.Sprintf("item-%d", id)
    return text, nil
}

func main() {
    fmt.Println(label(3))
}`),
        exampleNote: "The output is `item-3 <nil>`. Results are named for documentation, while both return sites still show the values they send.",
        testing: "Understanding that bare return readability depends on function size and visible state flow.",
        commonMistake: "Using named results as a reason to make every return naked.",
        depthSignal: "Explain how explicit returns localize reasoning without rejecting named results entirely.",
      },
      {
        question: "How do named and unnamed return values differ in Go?",
        title: "Named versus unnamed Go results",
        direct: "Named and unnamed result lists produce the same function type when their types and order match. Named results create zero-initialized local variables, permit bare returns, and can be accessed by deferred closures; unnamed results do not. Callers receive the same positional values either way, so the choice mainly affects implementation clarity and documentation.",
        points: [
          "Result names do not affect function-type identity.",
          "Named results exist as local variables; unnamed results do not.",
          "Only named results support a bare return.",
          "Deferred closures can refer to named results directly.",
          "Callers always receive positional values, not named fields.",
        ],
        answerSize: "compact",
        spoken: "- `func(string) (int, error)` and `func(string) (value int, err error)` have the same parameter and result types, so the result names do not create a different function type. A caller invokes either one in the same way and chooses its own receiving variable names. The difference exists inside the declaration and body.\n\n- With unnamed results, each return statement must provide expressions such as `return len(text), nil`. With named results, `value` and `err` are initialized when the function begins and can be assigned throughout the body. A bare return uses their current values. A deferred closure can also read or update those variables after return expressions set them but before control reaches the caller.\n\n- For example, two formatter implementations—one with named results and one without—can both be assigned to a variable of type `func(int) (string, error)`. Their external contracts match. Internally, the named version may use `text` in a defer, while the unnamed version keeps each exit completely expression-based.\n\n- I choose unnamed results as the simple default. I add names when positions need explanation or final-result access has a clear purpose. The caller should not care which implementation style was used, and changing only result names should not require changes at call sites.",
        overviewTitle: "Same external contract, different local tools",
        overview: "Function-type identity focuses on types and order. Result identifiers belong to the declaration in the same way parameter identifiers do: they aid implementation and documentation without becoming fields on a returned object.\n\nThe implementation trade-off is mutable result state. Named results enable concise patterns but add variables that exist for the whole body. Unnamed results keep outgoing values at each return expression, which is often easier to trace.",
        visual: {
          type: "comparison_table",
          title: "Named and unnamed results",
          content: "| Property | Named results | Unnamed results |\n|---|---:|---:|\n| Changes function type | No | No |\n| Local result variables | Yes | No |\n| Bare return available | Yes | No |\n| Direct defer access | Yes | No named variable to capture |\n| Caller receives fields | No | No |",
        },
        exampleTitle: "Assign both forms to the same function type",
        code: go(`package main

import "fmt"

func named(n int) (text string, err error) {
    return fmt.Sprint(n), nil
}

func unnamed(n int) (string, error) {
    return fmt.Sprint(n), nil
}

func main() {
    var format func(int) (string, error)
    format = named
    fmt.Println(format(7))
    format = unnamed
    fmt.Println(format(8))
}`),
        exampleNote: "The output is `7 <nil>` and `8 <nil>`. Both declarations satisfy the same external function type.",
        testing: "Understanding which named-result features are local and which affect callers.",
        commonMistake: "Assuming result names behave like fields on a tuple or alter callback compatibility.",
        depthSignal: "Separate function-type identity from body-level scope and defer behaviour.",
      },
      {
        question: "How can variable shadowing break a function with named returns?",
        title: "Named returns and variable shadowing",
        direct: "Shadowing occurs when `:=` creates a new inner variable with the same name as a named result. Work in that block may update the inner variable while the result parameter remains unchanged, leading to a stale or zero return value. Use assignment when updating existing results, keep short declarations narrow, and prefer explicit return expressions that reveal which variable leaves the function.",
        points: [
          "Named results are in the function body's scope.",
          "An inner `:=` can create a different variable with the same name.",
          "Updating the shadow does not update the result parameter.",
          "Use `=` when all intended variables already exist.",
          "Compiler and linter feedback plus focused tests expose shadow paths.",
        ],
        answerSize: "standard",
        spoken: "- A named result is a real variable, so normal scope rules apply. Inside a nested block, a short declaration can introduce another variable with the same identifier. Assignments in that block then affect the inner variable, while the outer result retains its earlier or zero value. This is especially confusing when `err` is the result name and a helper call uses `value, err := operation()`.\n\n- The exact short-declaration rule matters. If at least one non-blank name is new in the current block, `:=` declares the new names and may reuse names already declared in that same block. A result parameter belongs to the function body's scope; using `:=` inside an `if` body creates a new `err` for that inner block.\n\n- For example, a function can name its result `value`, then inside an `if` use `value := \"inner\"`. Printing inside the block shows `inner`, but after the block the named result still contains its previous value. An explicit `value = \"inner\"` would update the result instead. For calls that need one new variable and one existing result, declare the new variable separately and use `=`.\n\n- I reduce this risk by keeping variable scope small, avoiding result names reused casually in nested blocks, and writing explicit returns. `go vet` and dedicated shadow analyzers may help, but the core fix is readable ownership. Tests must execute the shadowing branch and assert the returned value, because happy-path tests can miss it.",
        overviewTitle: "Two identical names can refer to different storage",
        overview: "Lexical lookup chooses the nearest declaration. Once an inner block declares `value`, every unqualified use there refers to that inner variable. Leaving the block reveals the outer named result again, unchanged by inner assignments.\n\nThis is not unique to named returns, but bare returns amplify the surprise because the exit does not state which variable is returned. Explicit assignment and return expressions turn the hidden scope distinction into visible code.",
        visual: {
          type: "flow_diagram",
          title: "Shadowed and returned variables diverge",
          content: "```mermaid\nflowchart TD\n  A[Function result value = outer] --> B[Enter if block]\n  B --> C[:= declares inner value]\n  C --> D[Updates affect inner value]\n  D --> E[Leave block; inner disappears]\n  E --> F[Return still uses outer value]\n```",
        },
        exampleTitle: "See the inner value disappear at block exit",
        code: go(`package main

import "fmt"

func choose(useInner bool) (value string) {
    value = "outer"
    if useInner {
        value := "inner"
        fmt.Println("inside:", value)
    }
    return value
}

func main() {
    fmt.Println("returned:", choose(true))
}`),
        exampleNote: "The output is `inside: inner` followed by `returned: outer`. Replacing `:=` with `=` updates the named result instead of creating a shadow.",
        testing: "Ability to apply short-declaration scope rules to named result variables.",
        commonMistake: "Assuming the nearest same-spelled variable is automatically the result parameter.",
        depthSignal: "Trace storage across nested scopes and propose an explicit assignment repair.",
      },
    ],
  },
  "panic-and-recover-basics": {
    title: "Panic and Recover",
    questions: [
      {
        question: "What happens when a Go function panics?",
        title: "What happens during a Go panic",
        direct: "A panic stops ordinary execution in the current function and begins unwinding that goroutine's call stack. Deferred functions run in last-in, first-out order in each frame as the panic moves upward. If a suitable deferred function recovers, unwinding stops at that boundary; otherwise an unhandled panic reaches the top of the goroutine and the program terminates with diagnostic information.",
        points: [
          "Panic immediately stops the current function's normal control flow.",
          "Deferred calls still run while each stack frame unwinds.",
          "Unwinding proceeds through callers in the same goroutine.",
          "A valid recover can stop the panic at a deliberate boundary.",
          "An unhandled panic ultimately terminates the program.",
        ],
        answerSize: "standard",
        spoken: "- Calling `panic(value)` ends ordinary execution of the current function. Go does not jump directly out of the process. It first runs that function's deferred calls in reverse registration order, then unwinds into its caller and runs that caller's defers, continuing up the same goroutine's stack. This allows locks, files, and other resources to clean up during failure.\n\n- The panic value may be an error, string, or another value. Runtime faults such as an out-of-range index can also start panicking. If no deferred boundary recovers, the panic reaches the top of the goroutine and the program terminates with panic and stack information. Other goroutines cannot intercept that unwinding from outside.\n\n- For example, `inner` can defer a print and then panic, while `outer` also has a deferred print. The observed order is the inner cleanup first and outer cleanup second. A statement after the call to `inner` in `outer` does not run because normal execution never returns to that point.\n\n- A recover boundary may stop the unwinding, but the function in which that deferred recovery runs then returns; execution does not resume after the original panic statement. This is why panic is not a general branch or retry mechanism. I reserve it for broken invariants or exceptional internal control and let ordinary expected failures travel as errors. The distinction keeps routine recovery decisions visible to callers.",
        overviewTitle: "Panic unwinds one goroutine frame by frame",
        overview: "The stack contains active function calls. Panicking converts each active call into an exit, but preserves its deferred cleanup. Once one frame's defers finish, that frame is discarded and the next caller frame unwinds.\n\nRecovery changes the endpoint, not the history. Frames between the panic and recovery boundary have already been abandoned. The boundary function completes by returning to its caller after its remaining defers execute; the failed inner operation does not continue.",
        visual: {
          type: "sequence_diagram",
          title: "Stack unwinding order",
          content: "```mermaid\nsequenceDiagram\n  participant M as main\n  participant O as outer\n  participant I as inner\n  M->>O: call\n  O->>I: call\n  I->>I: panic\n  I-->>I: run inner defers\n  I-->>O: unwind\n  O-->>O: run outer defers\n  O-->>M: unwind or recover at boundary\n```",
        },
        exampleTitle: "Watch deferred cleanup during unwinding",
        code: go(`package main

import "fmt"

func inner() {
    defer fmt.Println("inner cleanup")
    panic("broken invariant")
}

func outer() {
    defer fmt.Println("outer cleanup")
    inner()
    fmt.Println("unreachable")
}

func main() { outer() }`),
        exampleNote: "Before the runtime reports the unhandled panic, the program prints `inner cleanup` and then `outer cleanup`. The `unreachable` line never executes.",
        testing: "Understanding same-goroutine stack unwinding, defer order, and where normal control stops.",
        commonMistake: "Describing panic as an exception that automatically resumes after a catch point.",
        depthSignal: "Trace multiple frames and explain what is discarded after recovery.",
      },
      {
        question: "How should a reusable Go API choose between returned errors and panic?",
        title: "Errors versus panic in Go",
        direct: "Return an error for failures that callers can reasonably encounter, report, retry, or recover from, such as invalid input, missing files, and network failures. Panic is for broken programmer invariants, impossible internal states, or unrecoverable initialization failures. Public package APIs should not expose panic for routine failure, and an internal panic used for control should be converted back to an error at the package boundary.",
        points: [
          "Expected operational failures belong in returned errors.",
          "Errors let the caller choose retry, fallback, context, or propagation.",
          "Panic fits violated invariants and programmer defects.",
          "Do not panic for normal invalid input in a reusable API.",
          "Translate any internal panic strategy before it crosses the public boundary.",
        ],
        answerSize: "standard",
        spoken: "- An error is part of a function's ordinary result contract. If opening a user-supplied path, parsing text, or contacting a server can fail during normal operation, the caller needs that error to decide whether to retry, use a fallback, add context, or report it. Returning an error keeps that decision visible at the correct layer.\n\n- Panic represents a different category: the program has reached a state its implementation considers impossible or cannot safely continue within the current operation. An out-of-bounds access panics because it violates memory-safety rules. Application code might panic during startup when a required invariant is missing and no useful service can run, but a library should usually return configuration errors to its caller.\n\n- For example, `ParsePort(\"abc\")` should return an error because invalid external input is expected. A private parser implementation may use panic to escape deeply nested recursive code, but its exported `Parse` function should recover only its own known panic type and return a normal error. Unexpected runtime panics must not be silently relabeled as user input failures.\n\n- The decision is based on recoverability and ownership, not severity alone. A serious database outage is still normally an error because the caller owns retry or shutdown policy. A tiny impossible index state can justify panic because it signals a code defect. Routine control flow, validation, and branching should remain explicit through returned values. That keeps recovery policy testable at the layer that owns it.",
        overviewTitle: "Errors describe expected failure; panic signals a broken execution contract",
        overview: "A returned error lets the current function finish normally and gives its caller data. A panic abandons normal execution and removes intermediate frames until recovery or termination. Those mechanics make panic much more disruptive and explain why it is not a substitute for repetitive error handling.\n\nPackage boundaries are a useful test. Callers should be able to learn expected failures from the API. If internal code uses panic to simplify a tightly controlled algorithm, the package can translate only its own sentinel type and allow unknown panics to continue.",
        visual: {
          type: "flow_diagram",
          title: "Classify the failure before choosing the mechanism",
          content: "```mermaid\nflowchart TD\n  A[Failure detected] --> B{Can a caller reasonably encounter and handle it?}\n  B -- Yes --> C[Return error with context]\n  B -- No --> D{Broken invariant or unsafe continuation?}\n  D -- Yes --> E[Panic may be appropriate]\n  D -- No --> F[Return a value/status or redesign branch]\n  E --> G[Recover only at a deliberate ownership boundary]\n```",
        },
        exampleTitle: "Return invalid external input as an error",
        code: go(`package main

import (
    "fmt"
    "strconv"
)

func parsePort(text string) (int, error) {
    port, err := strconv.Atoi(text)
    if err != nil { return 0, fmt.Errorf("invalid port %q: %w", text, err) }
    if port < 1 || port > 65535 { return 0, fmt.Errorf("port out of range: %d", port) }
    return port, nil
}

func main() {
    _, err := parsePort("abc")
    fmt.Println(err != nil)
}`),
        exampleNote: "The output is `true`. Invalid user input remains an expected, inspectable result instead of terminating the program.",
        testing: "Ability to classify expected operational failures separately from broken invariants.",
        commonMistake: "Using panic for a failure merely because it is inconvenient to thread an error upward.",
        depthSignal: "Use package ownership and caller recovery policy to justify the choice.",
      },
      {
        question: "How does recover work in Go?",
        title: "How Go recover works",
        direct: "`recover` stops an active panic only when it is called directly by a deferred function running during that panic in the same goroutine. It returns the panic value; outside that situation it returns nil. After recovery, the recovering boundary function completes and returns to its caller—execution does not continue at the statement after the original panic.",
        points: [
          "Recover is effective only during active panic unwinding.",
          "Call it directly inside a deferred function.",
          "It can recover only a panic in the same goroutine.",
          "The returned value is the value supplied to panic.",
          "After recovery, the boundary function returns; the failed code does not resume.",
        ],
        answerSize: "standard",
        spoken: "- `recover` is a built-in used at a deliberate deferred boundary. The usual pattern is `defer func() { if value := recover(); value != nil { ... } }()`. When that deferred function runs because the same goroutine is panicking, `recover` returns the panic value and stops further unwinding. If there is no active panic, it returns nil and changes nothing.\n\n- Placement is strict. Calling recover during normal code is ineffective, calling it in another goroutine cannot see the panic, and hiding it behind an ordinary helper call from the deferred function does not satisfy the direct-call rule. This keeps recovery tied to the frame that owns the boundary.\n\n- For example, a `safeDivide` wrapper can defer recovery, call code that panics on a zero divisor, and convert that one known panic value into an error. The wrapper needs a named error result or another explicit way to set what its caller receives. It must not turn unrelated runtime defects into misleading validation errors; unknown values can be panicked again.\n\n- Once recovered, execution does not jump back into the panicking function. Its frames have already unwound. The deferred boundary finishes, and its containing function returns normally to its caller. Recover is therefore suitable for isolation and translation at package, request, or task boundaries, not for resuming arbitrary code where it failed.",
        overviewTitle: "Recovery belongs to the deferred boundary that owns the work",
        overview: "Only deferred functions run while a panic is unwinding, so they are the place where recovery can intercept it. The direct-call condition prevents a distant utility function from unexpectedly swallowing any panic that happens to be active.\n\nA robust boundary classifies the recovered value. Known domain sentinels may be converted into errors. Unexpected values usually need logging with a stack and re-panicking or failing the isolated unit, depending on the boundary's contract.",
        visual: {
          type: "flow_diagram",
          title: "Conditions for an effective recover",
          content: "```mermaid\nflowchart TD\n  A[recover called] --> B{Current goroutine is panicking?}\n  B -- No --> C[returns nil]\n  B -- Yes --> D{Called directly by a deferred function?}\n  D -- No --> C\n  D -- Yes --> E[returns panic value and stops unwinding]\n  E --> F[boundary function finishes and returns]\n```",
        },
        exampleTitle: "Translate one known panic and preserve unknown failures",
        code: go(`package main

import (
    "errors"
    "fmt"
)

var zeroDivisor = errors.New("zero divisor")

func divide(a, b int) int {
    if b == 0 { panic(zeroDivisor) }
    return a / b
}

func safeDivide(a, b int) (value int, err error) {
    defer func() {
        if recovered := recover(); recovered != nil {
            if recovered == zeroDivisor { err = zeroDivisor; return }
            panic(recovered)
        }
    }()
    return divide(a, b), nil
}

func main() { fmt.Println(safeDivide(8, 0)) }`),
        exampleNote: "The output is `0 zero divisor`. Only the known sentinel is translated; an unexpected panic would continue unwinding.",
        testing: "Understanding every placement and control-flow condition required for effective recovery.",
        commonMistake: "Calling recover from normal flow or a helper and expecting execution to resume after panic.",
        depthSignal: "Describe classification of known versus unknown panic values.",
      },
      {
        question: "Can recover catch a panic from another goroutine?",
        title: "Panic recovery across goroutine boundaries",
        direct: "No. Panic unwinding and recovery are confined to the goroutine in which the panic occurs. A defer in the parent or launching goroutine cannot catch a child goroutine's panic. If an application must isolate task failures, each goroutine needs its own top-level deferred recovery boundary and must report the resulting error or status through a channel or other coordination mechanism.",
        points: [
          "Each goroutine has its own call stack and panic chain.",
          "A parent defer cannot recover a child goroutine's panic.",
          "Install recovery inside the goroutine that runs untrusted work.",
          "Report failure back through normal synchronization.",
          "Always let the goroutine complete cleanup and signal completion.",
        ],
        answerSize: "standard",
        spoken: "- Recover cannot cross a goroutine boundary because each goroutine owns a separate call stack. When a child goroutine panics, Go unwinds only that child's frames and runs only defers registered on that stack. A deferred recover in the function that launched the goroutine is on another stack and never participates in the child's unwinding.\n\n- If a worker system must isolate panics, the wrapper executed *inside* each worker goroutine installs the recovery defer before calling the task. That defer can record a stack, classify the panic, and send a failure result on a channel. The parent then receives ordinary data and can decide whether to retry, mark the job failed, or stop the service.\n\n- For example, `go safeRun(results, task)` starts a goroutine whose `safeRun` function immediately defers recovery. If `task` panics, the same goroutine reaches that defer and sends an error. A `defer recover()` placed around the `go` statement in the parent would not work because the parent returns from launching normally and is not panicking.\n\n- Recovery must also preserve completion signals. If a worker participates in a `WaitGroup`, `Done` should be deferred in that worker, and result sending must avoid deadlock. I add these boundaries only where isolation is an explicit product requirement; silently swallowing every panic can leave corrupted state and hide serious programming defects. The worker boundary must report a definite outcome.",
        overviewTitle: "Recovery follows stacks, not parent-child relationships",
        overview: "The code that starts a goroutine has no runtime exception parenthood over it. The `go` statement schedules a new independent call stack. Communication and cancellation between those stacks use channels, contexts, locks, and other normal synchronization—not shared panic handling.\n\nA task runner can still offer a safe abstraction by wrapping every task inside its new goroutine. The wrapper translates failure into a result the coordinator understands, while unexpected panics remain observable through logs and stack data.",
        visual: {
          type: "sequence_diagram",
          title: "Recovery must live on the worker stack",
          content: "```mermaid\nsequenceDiagram\n  participant P as Parent goroutine\n  participant W as Worker goroutine\n  participant R as Results channel\n  P->>W: go safeRun(task)\n  W->>W: register recovery defer\n  W->>W: task panics\n  W->>W: same-stack defer recovers\n  W->>R: send failure result\n  R-->>P: receive ordinary error data\n```",
        },
        exampleTitle: "Recover and report inside the worker goroutine",
        code: go(`package main

import "fmt"

func safeRun(result chan<- error, task func()) {
    defer func() {
        if value := recover(); value != nil {
            result <- fmt.Errorf("task panicked: %v", value)
        }
    }()
    task()
    result <- nil
}

func main() {
    result := make(chan error, 1)
    go safeRun(result, func() { panic("boom") })
    fmt.Println(<-result)
}`),
        exampleNote: "The worker's own defer converts the panic, and the parent prints `task panicked: boom`. A parent-only recover could not intercept it.",
        testing: "Understanding that panic visibility follows a goroutine's own stack.",
        commonMistake: "Wrapping the `go` statement with recover in the parent and expecting it to protect the child.",
        depthSignal: "Show how the worker reports failure and still completes its coordination contract.",
      },
      {
        question: "Why does recover sometimes return nil or fail to stop a panic?",
        title: "Debugging ineffective recover calls",
        direct: "`recover` returns nil when the goroutine is not currently panicking or when it is not called directly by a deferred function. It also cannot observe a panic on another goroutine. Inspect which function registered the defer, whether that exact goroutine is unwinding through it, and whether `recover` is called directly there; then ensure the boundary does not accidentally re-panic while handling the value.",
        points: [
          "Normal execution makes recover return nil.",
          "The effective call must be direct inside a deferred function.",
          "The panic must unwind through that defer on the same goroutine.",
          "A panic inside recovery logic starts or continues failure.",
          "Log stack context before translating an unexpected panic.",
        ],
        answerSize: "standard",
        spoken: "- When recover appears ineffective, I draw the active goroutine's call stack and mark the defer registration. The panic must unwind through that exact frame. If the defer belongs to a function that already returned, was never reached, or is running on another goroutine, it cannot see the panic. During ordinary non-panicking return, recover correctly returns nil.\n\n- I then inspect call placement. The effective pattern calls `recover()` directly in the body of the deferred function. A deferred closure that calls `helper()`, where `helper` calls recover, does not meet the direct-call requirement and receives nil. Moving the recover call into the deferred closure gives that boundary ownership of the panic value.\n\n- For example, `defer func() { handleRecover() }()` looks plausible, but `handleRecover` is one ordinary call deeper. Instead, use `defer func() { value := recover(); handle(value) }()`. The helper can classify or log the already recovered value; it should not be responsible for invoking recover itself.\n\n- Finally, I check the recovery code for a second panic: unsafe type assertions, nil dereferences, or deliberate re-panics of unknown values. A second failure may make it look as though the original recover did nothing. The boundary should capture stack context, handle only what it owns, and preserve unexpected failures rather than converting every defect into success. A regression test must execute the actual panicking path.",
        overviewTitle: "Prove reachability, goroutine identity, and direct placement",
        overview: "Recovery is not a global switch. Its effectiveness depends on a specific runtime moment and stack relationship. The deferred boundary must be registered, still active, and encountered while the same goroutine unwinds.\n\nSeparating capture from handling helps. The deferred function calls recover directly and obtains the value. Ordinary helper functions may then format, classify, or record that value without needing special panic semantics.",
        visual: {
          type: "flow_diagram",
          title: "Recover debugging checklist",
          content: "```mermaid\nflowchart TD\n  A[recover returned nil or panic escaped] --> B{Same goroutine?}\n  B -- No --> C[Move boundary into worker]\n  B -- Yes --> D{Panic unwinds through registered defer?}\n  D -- No --> E[Move defer around owned call]\n  D -- Yes --> F{recover called directly in deferred body?}\n  F -- No --> G[Capture there, then call helper]\n  F -- Yes --> H[Inspect recovery code for a second panic]\n```",
        },
        exampleTitle: "Capture directly, then delegate ordinary handling",
        code: go(`package main

import "fmt"

func handle(value any) { fmt.Println("recovered:", value) }

func safe() {
    defer func() {
        value := recover()
        if value != nil { handle(value) }
    }()
    panic("boom")
}

func main() { safe(); fmt.Println("continued") }`),
        exampleNote: "The output is `recovered: boom` and `continued`. The special call is direct in the deferred body; ordinary handling happens afterward.",
        testing: "A systematic diagnosis of recover placement, stack reachability, and secondary panics.",
        commonMistake: "Putting recover in a convenience helper or on a different goroutine's stack.",
        depthSignal: "Distinguish capturing the panic value from handling it after capture.",
      },
    ],
  },
  "variadic-functions": {
    title: "Variadic Functions",
    questions: [
      {
        question: "How do variadic functions work in Go?",
        title: "Variadic functions in Go",
        direct: "A variadic Go function declares its final parameter as `name ...T`, allowing callers to provide zero or more arguments assignable to `T`. Inside the function that parameter has type `[]T`. With no variadic arguments it is nil; with separate arguments Go supplies a new slice containing them. Only the final parameter may be variadic.",
        points: [
          "Write the final parameter as `values ...T`.",
          "Inside the function, `values` has type `[]T`.",
          "Callers may provide zero, one, or many values.",
          "No variadic arguments produce a nil slice.",
          "Only the last parameter in a signature can be variadic.",
        ],
        answerSize: "compact",
        spoken: "- A variadic parameter lets one function accept a varying number of trailing arguments of one element type. The declaration `func sum(values ...int) int` can be called as `sum()`, `sum(4)`, or `sum(4, 5, 6)`. Inside `sum`, `values` is an ordinary `[]int`, so the function can use `len`, `range`, indexing, and other slice operations.\n\n- The parameter must be last because earlier fixed parameters need unambiguous positions. A declaration such as `func log(prefix string, values ...any)` has one required string followed by zero or more values. The variadic marker is part of the function signature; `func(...int)` is not the same function type as `func([]int)`.\n\n- For example, `sum()` receives a nil slice and naturally returns zero when a range loop has no elements. `sum(2, 3)` receives a slice of length two and returns five. When separate arguments are used, Go creates a new slice containing those arguments for the call.\n\n- Variadic APIs work well when each trailing argument has the same role and zero-or-more values are natural, as with formatting or aggregation. They are less suitable for unrelated optional settings, where positional meaning becomes unclear. A configuration struct or functional options may express those choices more safely.",
        overviewTitle: "Caller flexibility becomes one slice inside the function",
        overview: "Variadic syntax changes how a call is written, then normalizes the trailing arguments into a slice parameter. The function body does not need separate logic for one value and many values. Zero arguments are represented by a nil slice, which still supports `len` and `range`.\n\nThe element type enforces one shared role for all trailing values. Using `...any` maximizes syntactic flexibility but gives up compile-time information and should be reserved for genuinely heterogeneous cases such as formatting.",
        visual: {
          type: "flow_diagram",
          title: "Separate arguments become one slice parameter",
          content: "```mermaid\nflowchart LR\n  A[sum 2, 3, 5] --> B[bind values as []int{2,3,5}]\n  B --> C[range over slice]\n  C --> D[return 10]\n  E[sum with no values] --> F[bind nil []int]\n  F --> G[empty range, return 0]\n```",
        },
        exampleTitle: "Aggregate zero or more integers",
        code: go(`package main

import "fmt"

func sum(values ...int) int {
    total := 0
    for _, value := range values { total += value }
    return total
}

func main() {
    fmt.Println(sum())
    fmt.Println(sum(2, 3, 5))
}`),
        exampleNote: "The output is `0` and `10`. Both calls reach the same slice-based loop inside `sum`.",
        testing: "Understanding the call syntax, internal slice type, nil empty case, and final-position rule.",
        commonMistake: "Thinking variadic arguments remain separate unnamed parameters inside the function.",
        depthSignal: "Trace both zero arguments and several arguments into their slice representation.",
      },
      {
        question: "How do you pass a slice to a variadic Go function?",
        title: "Expanding a slice into variadic arguments",
        direct: "Pass a `[]T` to a final `...T` parameter by writing `slice...` at the call site, such as `sum(values...)`. In this form the slice is passed unchanged as the variadic parameter and shares its backing array. Without `...`, the slice is one value and is not assignable to a single `T` argument unless `T` itself is a slice type.",
        points: [
          "Use `values...` to expand a `[]T` into a `...T` parameter.",
          "The expanded slice is passed unchanged for that parameter.",
          "The callee can therefore share the caller's backing array.",
          "`values` without dots is a slice, not one element of type `T`.",
          "You cannot mix individual variadic values with one expanded slice in the same call.",
        ],
        answerSize: "standard",
        spoken: "- When a variadic function expects `...T` and the caller already has a `[]T`, the caller writes the slice followed by three dots. For example, `sum(values...)` supplies every element of `values` to the variadic parameter. Inside the function, the parameter is the same slice value rather than a newly assembled slice of separate arguments.\n\n- That unchanged passing rule matters for mutation. If the function assigns `values[0] = 99`, and the slice is non-empty, the caller can observe that change because both slice headers refer to the same backing array. By contrast, calling `sum(1, 2, 3)` makes a new slice for those individual arguments. Well-designed read-only aggregation functions avoid surprising mutation either way.\n\n- For example, a `double(values ...int)` function can update every element. Calling it with `numbers...` changes the caller's `numbers`; calling it with separate integer expressions has no caller-owned slice to update. The `...` marker belongs only at the final slice argument in this call form.\n\n- Omitting the dots attempts to pass `[]int` as one `int` and fails to compile. Go also does not let a call provide individual variadic arguments and then append a slice expansion, such as `f(1, values...)`; build a combined slice first when that is needed. Slice expansion is concise, but its aliasing should be part of the function's mutation contract.",
        overviewTitle: "Expansion changes call syntax, not slice ownership",
        overview: "The dots at a call site tell Go to use the slice's elements as the variadic argument sequence. The specification preserves that slice rather than copying it for this form. This makes expansion efficient and predictable, but it also carries normal slice aliasing.\n\nA function that conceptually reads its variadic arguments should not mutate them. If mutation is part of the API, documentation and naming should make it obvious, or the function can copy before changing values.",
        visual: {
          type: "comparison_table",
          title: "Separate values versus slice expansion",
          content: "| Call | Callee receives | Backing array relationship |\n|---|---|---|\n| `f(1, 2, 3)` | New `[]int{1,2,3}` for the call | New call slice |\n| `f(values...)` | `values` passed unchanged | Shared with caller |\n| `f(values)` where `f(...int)` | Compile error | `[]int` is not one `int` |\n| `f(1, values...)` | Compile error | Cannot mix these variadic forms |",
        },
        exampleTitle: "Observe backing-array sharing with slice expansion",
        code: go(`package main

import "fmt"

func double(values ...int) {
    for index := range values { values[index] *= 2 }
}

func main() {
    numbers := []int{2, 3, 4}
    double(numbers...)
    fmt.Println(numbers)
}`),
        exampleNote: "The output is `[4 6 8]`. `numbers...` passes the slice unchanged, so the callee's element assignments reach the same backing array.",
        testing: "Understanding expansion syntax, unchanged slice passing, and its aliasing consequence.",
        commonMistake: "Assuming `slice...` always copies or trying to combine separate variadic values with an expanded slice.",
        depthSignal: "Explain both compile-time call rules and runtime backing-array sharing.",
      },
      {
        question: "What is the difference between no variadic arguments, an empty slice, and a nil slice?",
        title: "Nil and empty variadic arguments",
        direct: "Calling a variadic function with no trailing arguments gives its variadic parameter a nil slice. Passing a non-nil empty slice with `empty...` gives it that non-nil empty slice, while passing a nil slice with `nilSlice...` gives nil. All have length zero and range identically, but nil checks, reflection, and some encoding contracts can distinguish them.",
        points: [
          "No variadic arguments produce a nil parameter slice.",
          "A nil `[]T` expanded with `...` remains nil.",
          "A non-nil empty `[]T` expanded with `...` remains non-nil.",
          "All three cases have length zero and an empty range.",
          "Distinguish nil only when the API gives that distinction meaning.",
        ],
        answerSize: "compact",
        spoken: "- A variadic parameter is a slice, so zero trailing values still have a concrete slice state. If the caller writes `inspect()` with no variadic arguments, the parameter is nil. If it writes `empty := []int{}; inspect(empty...)`, the non-nil empty slice is passed unchanged. Expanding a nil slice preserves nil.\n\n- All three forms have length zero, capacity may be zero, and a range loop performs no iterations. Most aggregation functions should therefore treat them identically. A nil check is only useful when the API intentionally gives absence a different meaning from an explicitly supplied empty collection.\n\n- For example, an inspector can print both `len(values)` and `values == nil`. A no-argument call prints `0 true`; expanding `[]int{}` prints `0 false`; expanding `var values []int` prints `0 true`. This difference follows slice identity, not special branching inside the variadic function.\n\n- I avoid making a variadic API depend on nil versus empty unless that distinction is clearly documented, because callers using separate arguments cannot express “non-nil but empty” without constructing a slice. Serialization and reflection may preserve a distinction that ordinary iteration does not, so conversion to JSON or an external contract should be checked separately.",
        overviewTitle: "Length answers how many; nilness can express absence",
        overview: "Nil and non-nil empty slices share the same element behaviour: indexing is invalid, range is empty, and append works. They differ in representation and in APIs that intentionally observe nilness. Slice expansion preserves the caller's slice, so it preserves that state.\n\nA variadic function designed around zero-or-more values usually cares about length, not nilness. Treating nil as a hidden mode can make calls harder to understand and should be reserved for a real semantic need.",
        visual: {
          type: "comparison_table",
          title: "Zero-length variadic states",
          content: "| Call form | `len(values)` | `values == nil` |\n|---|---:|---:|\n| `inspect()` | 0 | true |\n| `inspect([]int{}...)` | 0 | false |\n| `var s []int; inspect(s...)` | 0 | true |\n| `inspect(1)` | 1 | false |",
        },
        exampleTitle: "Print length and nilness for each form",
        code: go(`package main

import "fmt"

func inspect(values ...int) {
    fmt.Println(len(values), values == nil)
}

func main() {
    inspect()
    inspect([]int{}...)
    var values []int
    inspect(values...)
}`),
        exampleNote: "The output is `0 true`, `0 false`, and `0 true`. Element processing is empty in all cases, while nilness preserves the caller's slice state.",
        testing: "Understanding the exact zero-argument and slice-expansion states without overstating their difference.",
        commonMistake: "Assuming every zero-length variadic parameter is either always nil or always non-nil.",
        depthSignal: "Explain when representation matters and when length-only semantics are preferable.",
      },
      {
        question: "When should a Go API use a variadic parameter instead of a slice parameter?",
        title: "Variadic parameters versus slice parameters",
        direct: "Use a variadic parameter when callers naturally provide zero or more independent values inline and the callee treats them as one homogeneous sequence. Use a slice parameter when a collection is the primary input, callers usually already have one, nil versus empty is part of the contract, or mutation and ownership need to be explicit. The body receives a slice in both cases, but call syntax and function types differ.",
        points: [
          "Variadic calls are convenient for inline independent values.",
          "Slice parameters make collection ownership more explicit.",
          "Both forms expose a `[]T` inside the function body.",
          "Their function types and ordinary call syntax are different.",
          "Avoid variadic parameters for unrelated positional options.",
        ],
        answerSize: "standard",
        spoken: "- A variadic parameter optimizes the call site for a natural list of independent values. Logging fields, formatting operands, and simple aggregation can read well as `sum(2, 4, 6)`. Callers with an existing slice can still use `values...`, so the API supports both inline and collected inputs. Inside the function, the parameter is a slice.\n\n- A slice parameter says the collection itself is the input. It is clearer when most callers already hold a slice, when the function may retain or mutate it under a documented ownership rule, or when nil and empty have distinct meaning. The call `process(values)` also makes the collection boundary visible; no expansion syntax is needed.\n\n- For example, a `max(values ...int)` helper is convenient in small calculations, but a batch processor accepting thousands of records from storage naturally takes `[]Record`. Variadic syntax does not eliminate allocation in every form: separate arguments produce a call slice, whereas an expanded slice is passed unchanged. Performance decisions still need measurement rather than syntax folklore.\n\n- The two signatures are not interchangeable callback types. `func(...int)` and `func([]int)` require different calls even though their bodies see `[]int`. I choose variadic only when zero-or-more trailing values have one clear role. If arguments represent different optional settings, a config struct or functional options with named meaning is safer than `...any`.",
        overviewTitle: "The key difference is the caller-facing contract",
        overview: "Implementation code can range over either parameter in the same way. The declaration primarily controls how callers express their data and what function type participates in callback assignments. Variadic form emphasizes individual trailing values; slice form emphasizes one collection.\n\nOwnership remains important in both forms. Slice expansion shares the caller's backing array, while separate variadic values use a newly supplied slice. An API that retains or mutates input should document and enforce that policy independently of its syntax.",
        visual: {
          type: "comparison_table",
          title: "Choose by the natural call site",
          content: "| Dimension | `values ...T` | `values []T` |\n|---|---|---|\n| Inline values | `f(a, b, c)` | Requires slice literal |\n| Existing slice | `f(values...)` | `f(values)` |\n| Body parameter | `[]T` | `[]T` |\n| Function type | Variadic | Non-variadic |\n| Collection as domain input | Less explicit | More explicit |",
        },
        exampleTitle: "Expose two different caller contracts",
        code: go(`package main

import "fmt"

func inline(values ...int) int { return len(values) }
func collected(values []int) int { return len(values) }

func main() {
    values := []int{2, 4, 6}
    fmt.Println(inline(2, 4, 6))
    fmt.Println(inline(values...))
    fmt.Println(collected(values))
}`),
        exampleNote: "All calls print `3`, but the first API accepts individual values while the second declares one collection as its input.",
        testing: "Whether call-site ergonomics, function type, and ownership shape drive the API choice.",
        commonMistake: "Using a variadic `...any` list to encode unrelated optional settings.",
        depthSignal: "Discuss call syntax, aliasing, and domain meaning rather than only body equivalence.",
      },
      {
        question: "What restrictions and common mistakes apply to variadic functions in Go?",
        title: "Variadic function rules and mistakes",
        direct: "A Go function may have only one variadic parameter, it must be last, and callers cannot combine individual variadic arguments with a final expanded slice in the same call. Common mistakes include forgetting `slice...`, mutating an expanded slice unexpectedly, using `...any` where types matter, and treating a variadic function type as identical to a slice-parameter function type.",
        points: [
          "Only the final parameter may use `...T`.",
          "Use `slice...`; a plain `slice` is not one element of type `T`.",
          "Build one combined slice before adding fixed variadic values to an expansion.",
          "Expanded slices may be mutated through the shared backing array.",
          "Keep a specific `T` instead of `any` when values share a real type.",
        ],
        answerSize: "compact",
        spoken: "- Variadic syntax has a deliberately narrow shape. A function may declare one `...T` parameter, and it must be the final parameter. This lets the caller's fixed arguments bind first and all remaining values bind to one slice. Multiple variadic groups would make argument ownership ambiguous and are not allowed.\n\n- At the call site, an existing `[]T` needs `slice...`. Without the dots, Go tries to use the slice itself as one `T` argument. A call also cannot mix individual variadic values and an expanded slice, such as `appendNames(\"fixed\", names...)` when all arguments belong to the same variadic parameter. The caller can create a combined slice and expand that once.\n\n- For example, start with `all := append([]string{\"fixed\"}, names...)` and call `printNames(all...)`. The new leading slice also avoids modifying `names` while assembling the input. The callee still receives the combined slice and should not mutate it unless its contract clearly permits that behaviour.\n\n- Type design creates another class of mistakes. `...any` accepts heterogeneous values but loses compile-time guarantees and may require assertions. A specific element type or a config structure is clearer when all inputs share meaning. Finally, callback compatibility includes the variadic marker, so a slice-taking helper needs an adapter before it can fill a `func(...T)` slot. These checks keep call sites predictable, readable, and type-safe.",
        overviewTitle: "One trailing sequence keeps calls unambiguous",
        overview: "Fixed parameters consume known positions; the final variadic parameter consumes the remainder. That grammar explains both the last-position rule and why there cannot be a second variadic parameter. Slice expansion supplies the entire remainder in one form.\n\nWhen a call needs fixed values plus an existing slice for that remainder, constructing one combined slice makes the data shape explicit. Copying into a fresh slice can also prevent accidental modification of the original during assembly.",
        visual: {
          type: "flow_diagram",
          title: "Build one valid trailing argument sequence",
          content: "```mermaid\nflowchart TD\n  A[Need fixed value plus existing slice] --> B[Create combined []T]\n  B --> C[Append fixed and existing values]\n  C --> D[Call variadic function once with combined...]\n  D --> E[Callee receives one []T parameter]\n```",
        },
        exampleTitle: "Combine values before one slice expansion",
        code: go(`package main

import "fmt"

func printNames(names ...string) { fmt.Println(names) }

func main() {
    names := []string{"ana", "lee"}
    all := append([]string{"owner"}, names...)
    printNames(all...)
}`),
        exampleNote: "The output is `[owner ana lee]`. The call uses one expanded slice instead of trying to mix `\"owner\"` and `names...` in the variadic positions.",
        testing: "Knowledge of declaration restrictions, expansion rules, aliasing, and type design.",
        commonMistake: "Treating variadic syntax as unrestricted argument spreading like some other languages.",
        depthSignal: "Derive the restrictions from one unambiguous trailing sequence and show the combined-slice repair.",
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
    reading_time_minutes: spec.readingTime ?? 5,
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
  if (document.questions.length !== topic.questions.length) {
    throw new Error(`${topicSlug}: expected ${document.questions.length} specs, received ${topic.questions.length}`);
  }

  document.topic = topic.title;
  document.questions = document.questions.map((question, index) =>
    makeQuestion(question, topic.questions[index], topic.questions),
  );
  fs.writeFileSync(file, `${JSON.stringify(document, null, 2)}\n`);
  console.log(`Curated ${document.questions.length} answers in ${topicSlug}`);
}
