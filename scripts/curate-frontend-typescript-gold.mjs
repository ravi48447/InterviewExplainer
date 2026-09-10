#!/usr/bin/env node

import fs from "node:fs";
import path from "node:path";

const root = "content/frontend-fresher/typescript-basics";
const ticks = String.fromCharCode(96);
const md = (value) => value.replaceAll("§", ticks);
const fence = (language, lines) =>
  ticks.repeat(3) + language + "\n" + lines.join("\n") + "\n" + ticks.repeat(3);

const lessons = {};
const topicTitles = {
  "why-typescript": "Why TypeScript",
  "types-and-interfaces-basics": "Types and Interfaces",
  "functions-with-types": "Functions with Types",
  "generics-basics": "Generics",
  "typescript-with-react-basics": "TypeScript with React",
  "scenario-based": "Practical TypeScript Scenarios",
};
const intents = {
  "TypeScript vs JavaScript": {
    testing: "Whether static checking is separated from JavaScript runtime behaviour.",
    mistake: "Assuming TypeScript validates API data or changes JavaScript semantics.",
    standout: "Types are erased; untrusted runtime values still need validation.",
  },
  "Annotations and type inference": {
    testing: "Whether explicit and inferred types are used at the right boundaries.",
    mistake: "Annotating every obvious local value or trusting an overly narrow initializer.",
    standout: "Contextual typing and satisfies preserve safety with less repetition.",
  },
  "Compilation and type erasure": {
    testing: "Whether checking, transformation, emitted JavaScript, and declarations are distinct.",
    mistake: "Expecting an interface or generic argument to exist at runtime.",
    standout: "The build may check with no emit while another tool transforms source.",
  },
  "Strict type checking": {
    testing: "Whether strict null and initialization rules are handled with real proof.",
    mistake: "Silencing strict diagnostics with assertions instead of resolving uncertainty.",
    standout: "Strict is an evolving family of checks that can be adopted in stages.",
  },
  "Interface vs type alias": {
    testing: "Whether their shared object-shape role and distinct capabilities are clear.",
    mistake: "Claiming one form is always safer or faster than the other.",
    standout: "Interface merging is open; aliases can name unions and computed types.",
  },
  "Any, unknown, and never": {
    testing: "Whether unsafe freedom, safe uncertainty, and impossibility are distinguished.",
    mistake: "Using any for untrusted data and allowing lost type information to spread.",
    standout: "Unknown requires evidence; never can prove exhaustive handling.",
  },
  "Union types and narrowing": {
    testing: "Whether runtime guards safely select members of a union.",
    mistake: "Reading member-specific fields before narrowing or modeling every field as optional.",
    standout: "A literal discriminant can prevent impossible states and enforce exhaustiveness.",
  },
  "Optional and readonly properties": {
    testing: "Whether absence and assignment protection are understood separately.",
    mistake: "Treating readonly as a deep runtime freeze.",
    standout: "Exact optional properties distinguish a missing key from present undefined.",
  },
  "Typing functions and callbacks": {
    testing: "Whether signatures protect callers, implementations, and callback data flow.",
    mistake: "Using broad Function or any types that erase parameter and return contracts.",
    standout: "Contextual typing can infer inline callbacks while public boundaries stay explicit.",
  },
  "Optional, default, and rest parameters": {
    testing: "Whether each parameter form maps to its real calling behaviour.",
    mistake: "Using many unclear optional positions instead of a named options object.",
    standout: "Defaults replace missing or undefined arguments, but not null.",
  },
  "Function overloads vs union parameters": {
    testing: "Whether overloads are reserved for real input-output relationships.",
    mistake: "Adding overloads when one union signature already describes uniform behaviour.",
    standout: "Only overload signatures are callable; one JavaScript implementation remains.",
  },
  "Async function and Promise types": {
    testing: "Whether fulfilled values, promise returns, and rejection paths are distinct.",
    mistake: "Annotating an async function with T instead of Promise<T> or ignoring rejection.",
    standout: "Promise types describe fulfilment; expected failures may need a result union.",
  },
  "Generic types and reusable relationships": {
    testing: "Whether a type parameter preserves information across a reusable contract.",
    mistake: "Using a decorative type parameter that connects no meaningful positions.",
    standout: "Generics are erased but keep each call site's input-output relationship precise.",
  },
  "Generic constraints and keyof": {
    testing: "Whether minimum capability and key-dependent result types are understood.",
    mistake: "Using a broad object constraint or assertion that does not prove required members.",
    standout: "K extends keyof T with T[K] preserves the chosen property's exact type.",
  },
  "Generics vs unions and any": {
    testing: "Whether open relationships, fixed alternatives, and unsafe escapes are separated.",
    mistake: "Choosing a generic only because several types are accepted.",
    standout: "A generic should connect positions; a union should expose cases for narrowing.",
  },
  "Common utility types": {
    testing: "Whether derived compile-time views are used without confusing them with runtime mapping.",
    mistake: "Exposing internal or sensitive fields because a utility type follows model changes.",
    standout: "Partial, Pick, Omit, and Record are shallow and create no runtime object changes.",
  },
  "Typing React props and children": {
    testing: "Whether JSX callers and component bodies share one precise prop contract.",
    mistake: "Adding children automatically or accepting a much larger object than the component needs.",
    standout: "ReactNode covers broad renderable content while ReactElement is narrower.",
  },
  "Typing useState": {
    testing: "Whether the state type represents every real lifecycle value.",
    mistake: "Casting null to a populated model instead of declaring an honest union.",
    standout: "Functional updates receive typed previous state and avoid stale captured values.",
  },
  "Typing React events and refs": {
    testing: "Whether JSX event context and ref lifecycle nullability are handled accurately.",
    mistake: "Casting events or forcing a ref non-null before React has attached the element.",
    standout: "CurrentTarget retains the handler element type; target may be a nested node.",
  },
  "Discriminated unions for React props": {
    testing: "Whether dependent props are encoded as valid component modes.",
    mistake: "Making every mode-specific prop optional and admitting impossible combinations.",
    standout: "One runtime discriminant narrows the entire prop shape and rendered branch.",
  },
  "Validating API data at the boundary": {
    testing: "Whether external JSON becomes trusted only after executable checks.",
    mistake: "Casting response JSON to a domain interface without inspecting it.",
    standout: "A parser creates one boundary between unknown wire data and typed application code.",
  },
  "Migrating JavaScript to TypeScript": {
    testing: "Whether migration can increase safety without stopping delivery.",
    mistake: "Measuring progress by renamed files while broad any and assertions remain.",
    standout: "Mixed files, typed boundaries, and staged strictness keep changes reviewable.",
  },
  "Handling possibly undefined values": {
    testing: "Whether absence is handled according to its domain meaning.",
    mistake: "Applying a non-null assertion that preserves the possible runtime failure.",
    standout: "A stable local guard narrows once and keeps the proof through later code.",
  },
  "Typing form data from the DOM": {
    testing: "Whether string-based browser values are converted and validated before domain use.",
    mistake: "Casting numeric text to number without performing runtime conversion.",
    standout: "Conversion handles representation; validation separately enforces domain rules.",
  },
};

function metaDescription(value) {
  const plain = md(value);
  if (plain.length <= 157) return plain;
  return plain.slice(0, 154).replace(/\s+\S*$/, "") + "…";
}

lessons["why-typescript"] = [
  {
    question: "What is TypeScript, and how is it different from JavaScript?",
    title: "TypeScript vs JavaScript",
    direct:
      "TypeScript is a programming language built on JavaScript. It adds a static type system and developer tools that find many mistakes before code runs. TypeScript source is converted to JavaScript for browsers or Node.js, and its types are removed during that conversion. It improves development-time safety, but it does not replace runtime validation for API, form, or stored data.",
    quick: [
      "TypeScript accepts JavaScript syntax and adds type syntax on top.",
      "Its checker reports type mismatches before deployment or execution.",
      "Browsers and Node.js normally execute emitted JavaScript, not TypeScript types.",
      "Type annotations are erased and do not validate outside data at runtime.",
      "Adoption can be gradual because JavaScript files can coexist during migration.",
    ],
    interview: [
      "- TypeScript is a language built on JavaScript that adds static type checking. JavaScript discovers most type mistakes only when a path runs; TypeScript analyses the source earlier and reports when values are used in ways that do not match their declared or inferred types.",
      "- The normal flow is TypeScript source, type checking, and JavaScript output. For example, if a function accepts a §User§ with a numeric §id§, passing an object whose §id§ is a string is rejected during development. After compilation, the browser receives ordinary JavaScript and the §User§ type no longer exists.",
      "- This gives editors reliable autocomplete, safer refactoring, and clearer contracts between modules. It becomes especially valuable as a codebase and team grow because a changed function signature produces errors at affected call sites instead of leaving every path to manual discovery.",
      "- The boundary is runtime data. A server response can still claim one shape and send another because type annotations do not inspect network values. Those values must be parsed or validated before the application treats them as trusted types.",
      "- TypeScript therefore complements JavaScript rather than replacing its runtime. The shipped program follows JavaScript behaviour, while the TypeScript checker provides an earlier feedback layer for code the team controls.",
    ],
    overviewTitle: "One program has a development form and a runtime form",
    overview:
      "Developers author JavaScript behaviour plus TypeScript type information. The checker uses both to analyse the program; the emitted artifact keeps the behaviour and omits type-only syntax.",
    deepTitle: "Static information follows possible values through the program",
    deep:
      "The checker assigns every expression a type, either from an annotation or from inference. It compares those types when values cross assignments, calls, returns, and property accesses. Because this analysis does not need to execute every branch, it can reveal incompatible paths before a user reaches them.\n\nTypeScript remains compatible with the JavaScript ecosystem. Existing libraries can be described with declaration files, and projects can enable stricter checks over time. A successful type check says that the modeled types agree; it cannot prove business rules or the honesty of untyped inputs.",
    visualType: "flow_diagram",
    visualTitle: "From typed source to a running JavaScript program",
    visual:
      "flowchart LR\n  A[TypeScript source: values and type information] --> C[Type checker]\n  C -->|mismatch| E[development error]\n  C -->|accepted| T[transformation and emit]\n  T --> J[JavaScript: type syntax erased]\n  J --> R[browser or Node.js runtime]\n  X[API, form, storage] -->|still needs validation| R",
    codeTitle: "The contract is checked before the JavaScript runs",
    code: [
      "type User = { id: number; name: string };",
      "",
      "function label(user: User): string {",
      "  return user.id + \": \" + user.name;",
      "}",
      "",
      "console.log(label({ id: 7, name: \"Mira\" }));",
      "// label({ id: \"7\", name: \"Mira\" }); // type error",
    ],
    followups: [
      "What does type erasure mean in TypeScript?",
      "Why must an API response still be validated at runtime?",
      "Can TypeScript be introduced gradually into a JavaScript project?",
    ],
  },
  {
    question: "What are type annotations and type inference in TypeScript?",
    title: "Annotations and type inference",
    direct:
      "A type annotation explicitly states the type expected at a declaration or boundary, such as §price: number§. Type inference lets TypeScript derive a type from an initializer, return expression, or surrounding context, so §const price = 10§ is already numeric. Good TypeScript uses inference for obvious local details and annotations where they clarify a public contract, prevent unintended widening, or document an important return type.",
    quick: [
      "An annotation states a type explicitly; inference derives it from code.",
      "Local constants and simple return values usually need no repeated annotation.",
      "Function parameters normally need types unless a surrounding context supplies them.",
      "Contextual typing can infer callback parameters from the receiving API.",
      "Annotate important boundaries when the intended contract is not obvious.",
    ],
    interview: [
      "- A type annotation is type information written by the developer, while type inference is type information calculated by the compiler. Both feed the same checker; the difference is where the information comes from.",
      "- For example, §const count = 3§ already carries numeric information. In §names.map(name => name.length)§, the array's element type makes §name§ a string and the callback result a number. Repeating those obvious types would add noise without adding safety.",
      "- Annotations matter at boundaries. Function parameters need a declared contract when no contextual type exists, exported APIs may deserve explicit return types, and an annotation can stop an empty collection or broad initial value from being inferred in an unintended way.",
      "- Inference is local evidence, not a guess about future requirements. A mutable variable can widen from a literal to a broader type. When the result does not express the intended set of values, a precise annotation or a §satisfies§ check can supply that intent.",
      "- The practical balance is to let the compiler remove repetition while writing types at stable contracts and ambiguous points. That keeps code readable without making its important inputs and outputs implicit.",
    ],
    overviewTitle: "Types flow from declarations and from context",
    overview:
      "Inference starts at known values and propagates through expressions. An annotation creates an explicit checkpoint: code on one side must produce the stated shape, and code on the other side can rely on that shape.",
    deepTitle: "Widening and contextual typing explain surprising inferences",
    deep:
      "A §const§ binding cannot be reassigned, so the compiler can often retain narrow literal information; a §let§ binding usually widens because later assignments are expected. Object properties may also widen because the object can be mutated. §as const§ asks for readonly literal inference when that is truly the desired value model.\n\nContext can flow inward as well. A callback passed to an array method receives parameter types from the array's element type. An object checked with §satisfies§ is verified against a target contract while preserving useful information from the original expression. A broad annotation deliberately presents only the target contract.",
    visualType: "comparison_table",
    visualTitle: "Where each style is most useful",
    visual:
      "| Situation | Type source | Typical choice |\n|---|---|---|\n| §const total = 4§ | Initial value | Let inference work |\n| Function parameter | Public input contract | Add an annotation |\n| Inline callback | Receiving function | Use contextual typing |\n| Exported function result | Body or explicit API | Annotate when stability matters |\n| Configuration object | Literal plus target shape | Consider §satisfies§ |",
    codeTitle: "Combine inference, annotations, and satisfies",
    code: [
      "const prices = [10, 15, 20];",
      "const doubled = prices.map((price) => price * 2);",
      "",
      "type Config = { mode: \"development\" | \"production\"; port: number };",
      "const config = {",
      "  mode: \"development\",",
      "  port: 3000,",
      "} satisfies Config;",
      "",
      "function address(value: Config): string {",
      "  return value.mode + \":\" + value.port;",
      "}",
      "console.log(address(config), doubled);",
    ],
    followups: [
      "What is contextual typing?",
      "Why can a literal type widen after assignment to a mutable variable?",
      "How is §satisfies§ different from a type assertion?",
    ],
  },
  {
    question:
      "Does TypeScript run in the browser, and what does the compiler produce?",
    title: "Compilation and type erasure",
    direct:
      "Browsers normally run JavaScript, so TypeScript source is transformed into JavaScript before delivery. During a type-checking build, the compiler analyses types and can emit JavaScript plus optional source maps and declaration files. Interfaces, type aliases, generic arguments, and annotations are erased because they describe development-time contracts. Features with runtime meaning, such as ordinary classes, become JavaScript according to the compiler settings.",
    quick: [
      "TypeScript source is normally converted to JavaScript before browser execution.",
      "Type checking and JavaScript emission are related but configurable build steps.",
      "Interfaces, aliases, annotations, and generic arguments disappear at runtime.",
      "The §target§ option controls which JavaScript syntax is emitted.",
      "Declaration files describe types for consumers but contain no implementation.",
    ],
    interview: [
      "- TypeScript is primarily a source language and static checker; a normal browser receives JavaScript. A compiler or build tool removes TypeScript-only syntax and produces JavaScript compatible with the chosen runtime target.",
      "- The checker and emitter have separate jobs. The checker verifies assignments, calls, and control flow, while the emitter translates syntax. A project can run §tsc --noEmit§ when another tool handles transformation, or emit JavaScript, source maps, and declaration files when TypeScript owns the build.",
      "- For example, an §interface User§ can check §greet(user)§ in the editor, but the interface generates no runtime object. The resulting JavaScript contains only the function and property access. Code cannot use §instanceof User§ because there is no §User§ value after erasure.",
      "- Not every TypeScript construct is erased. A class is also a JavaScript value, and traditional enums can generate runtime code. The exact output depends on compiler options and the build pipeline.",
      "- This separation explains the central limit: compilation proves consistency against declared types, not the shape of live network data. Runtime checks remain necessary wherever values enter from outside the typed program.",
    ],
    overviewTitle: "Checking, transforming, and executing are different stages",
    overview:
      "A build may use §tsc§ for both checking and emission, or use §tsc --noEmit§ beside a faster transformer. In both arrangements, the deployed browser artifact contains JavaScript behaviour rather than the erased type model.",
    deepTitle: "Compiler options define the contract with the runtime",
    deep:
      "§target§ selects the JavaScript language level used for emitted syntax. §module§ describes the module format or preservation strategy. §lib§ tells the checker which standard environments are available; it does not install a polyfill. Source maps relate generated locations back to TypeScript for debugging.\n\nA declaration file has the opposite role of emitted JavaScript: it describes a module's public types without supplying its implementation. Library packages commonly publish both artifacts. Application builds may emit neither when a bundler owns output and TypeScript is used only as a checker.",
    visualType: "flow_diagram",
    visualTitle: "One source can create different build artifacts",
    visual:
      "flowchart LR\n  TS[app.ts] --> CHECK[type analysis]\n  CHECK --> DIAG[diagnostics]\n  TS --> EMIT[transform and emit]\n  EMIT --> JS[app.js: runtime behaviour]\n  EMIT --> MAP[app.js.map: debugging locations]\n  EMIT --> DTS[app.d.ts: public type description]\n  JS --> B[browser or Node.js]",
    codeTitle: "Type-only declarations are absent from runtime behaviour",
    code: [
      "interface User {",
      "  name: string;",
      "}",
      "",
      "function greet(user: User): string {",
      "  return \"Hello, \" + user.name;",
      "}",
      "",
      "console.log(greet({ name: \"Asha\" }));",
      "// The interface and annotations are erased from JavaScript output.",
    ],
    followups: [
      "What is the difference between transforming and type checking?",
      "What information belongs in a declaration file?",
      "Why does adding a value to §lib§ not add a runtime polyfill?",
    ],
  },
  {
    question:
      "What does TypeScript's strict option do, and why should a project enable it?",
    title: "Strict type checking",
    direct:
      "The §strict§ compiler option enables a family of stronger type-checking rules, including strict null checking and safer function and property analysis. It turns hidden assumptions—such as treating §null§ as an object or leaving a class field uninitialized—into visible errors. Strict mode catches more bugs and produces more reliable narrowing, although enabling it in an older project often requires a staged migration and accurate library types.",
    quick: [
      "§strict§ switches on a group of stronger checker options.",
      "§strictNullChecks§ keeps §null§ and §undefined§ out of unrelated types.",
      "Strict rules make unproved assumptions visible at the line that uses them.",
      "Individual strict options can support a gradual migration.",
      "A non-null assertion silences evidence; it does not add a runtime guard.",
    ],
    interview: [
      "- §strict§ is the umbrella setting for TypeScript's stronger correctness checks. It enables a collection of options that ask the program to prove more before values are assigned, called, or dereferenced.",
      "- The most noticeable rule is §strictNullChecks§. With it enabled, a value typed §User§ cannot silently also be §null§ or §undefined§; a lookup that may miss must be checked before its properties are read. Other strict checks improve function parameter safety, class-property initialization, and implicit §any§ detection.",
      "- For example, §users.find(...)§ returns §User | undefined§. Strict mode rejects §result.name§ until control flow proves that §result§ exists. An early return for the missing case protects runtime behaviour and narrows the value in the remaining block.",
      "- The cost appears mainly during adoption. A mature loose project can reveal many assumptions at once, and inaccurate third-party declarations can create friction. Teams can enable checks in stages, fix boundaries first, and track temporary exceptions rather than covering errors with assertions.",
      "- New projects benefit from enabling strictness at the start. It gives every later type the stronger meaning the team expects and makes compiler feedback a dependable part of change review.",
    ],
    overviewTitle: "Strictness asks for proof before unsafe operations",
    overview:
      "Without strict null checking, the type system treats absence as if it fits many ordinary types. Strict analysis preserves that possibility until a guard, default, or explicit design decision removes it.",
    deepTitle: "The umbrella can evolve, so build settings are part of the project",
    deep:
      "The §strict§ flag represents a family rather than one diagnostic. TypeScript can add stronger checks under that family in later releases, which may surface new errors after a compiler upgrade. Pinning the compiler version and reviewing release notes keeps those changes deliberate.\n\nAssertions such as §value!§ and §value as User§ change what the checker believes; they do not inspect the value or alter its runtime representation. A guard, parser, default, or corrected model is stronger because it connects proof to actual control flow.",
    visualType: "flow_diagram",
    visualTitle: "Strict mode keeps uncertainty until code handles it",
    visual:
      "flowchart LR\n  F[find returns User or undefined] --> G{result exists?}\n  G -->|no| N[handle absence]\n  G -->|yes| U[result narrows to User]\n  U --> P[read result.name safely]\n  F -. assertion only changes checker belief .-> P",
    codeTitle: "Narrow an optional result instead of hiding it",
    code: [
      "type User = { id: number; name: string };",
      "const users: User[] = [{ id: 1, name: \"Ari\" }];",
      "",
      "function nameFor(id: number): string {",
      "  const user = users.find((item) => item.id === id);",
      "  if (!user) return \"Unknown user\";",
      "  return user.name;",
      "}",
      "",
      "console.log(nameFor(2));",
    ],
    followups: [
      "Which checks are included under the §strict§ flag?",
      "What is the difference between a guard and a non-null assertion?",
      "How would you migrate an existing project toward strict mode?",
    ],
  },
];

lessons["types-and-interfaces-basics"] = [
  {
    question:
      "What is the difference between an interface and a type alias in TypeScript?",
    title: "Interface vs type alias",
    direct:
      "Both interfaces and type aliases can name object shapes, and TypeScript checks them structurally. Interfaces are designed around object contracts: they support §extends§ and can merge when the same interface name is declared again. A type alias can name any type expression, including unions, tuples, primitives, intersections, mapped types, and conditional types. For ordinary object models either often works; use the distinct capability when it matters.",
    quick: [
      "Both can describe an object shape and participate in structural typing.",
      "Interfaces extend with §extends§; object aliases combine with intersections.",
      "Interfaces can declaration-merge; aliases cannot be reopened.",
      "Aliases can directly name unions, tuples, primitives, and computed types.",
      "Neither choice creates a runtime object or performs validation.",
    ],
    interview: [
      "- An interface and a type alias can both give a reusable name to an object shape. TypeScript is structurally typed, so a value satisfies either contract when it has the required compatible members, even if it never explicitly declared that relationship.",
      "- Interfaces are centred on object-like contracts. They support §extends§, and declarations with the same name in the same scope can merge. That openness is useful for library augmentation but can be surprising in application code if a name is unintentionally reused.",
      "- Type aliases can represent more kinds of types. For example, §type Result = Success | Failure§ names a union, and aliases also cover tuples, primitive unions, mapped types, and conditional types. An object alias can be combined with another type using an intersection.",
      "- For a simple §User§ object, neither form is inherently safer or faster because both disappear during compilation. A team can prefer interfaces for public extendable object contracts and aliases for compositions, while avoiding artificial conversions when the existing form is clear.",
      "- The useful decision is based on the shape's role: choose the construct whose capability expresses the model, then stay consistent. Runtime data still requires validation regardless of whether its compile-time name is an interface or an alias.",
    ],
    overviewTitle: "The overlap is large, but the extension models differ",
    overview:
      "An object value can satisfy either declaration through its members. The main choice is whether the name should be an open object contract or a closed alias for a possibly richer type expression.",
    deepTitle: "Declaration merging is a capability, not a general advantage",
    deep:
      "When two compatible interface declarations share a name, the compiler combines their members. This supports patterns such as adding fields to a library's declared request object. A type alias is bound once, so extension is expressed by creating a new alias.\n\nObject intersections and interface extension are similar for many cases but not identical in every conflict or error message. Interfaces generally report incompatible inherited properties when declared, while an intersection may retain an impossible property type that fails when a value is created. Clear contracts avoid conflicting composition in either form.",
    visualType: "comparison_table",
    visualTitle: "Capabilities that guide the choice",
    visual:
      "| Capability | §interface§ | §type§ alias |\n|---|---:|---:|\n| Describe object members | Yes | Yes |\n| Extend another object contract | §extends§ | Intersection §&§ |\n| Declaration merging | Yes | No |\n| Name a union or tuple directly | No | Yes |\n| Exist at runtime | No | No |",
    codeTitle: "Use each form for the shape it expresses clearly",
    code: [
      "interface Identified { id: number }",
      "interface User extends Identified { name: string }",
      "",
      "type Loading = { status: \"loading\" };",
      "type Loaded = { status: \"loaded\"; user: User };",
      "type State = Loading | Loaded;",
      "",
      "function display(state: State): string {",
      "  return state.status === \"loaded\" ? state.user.name : \"Loading\";",
      "}",
    ],
    followups: [
      "What is declaration merging?",
      "How does structural typing affect interfaces and aliases?",
      "When is a union clearer than an optional-property interface?",
    ],
  },
  {
    question: "What is the difference between any, unknown, and never?",
    title: "Any, unknown, and never",
    direct:
      "§any§ largely opts a value out of type checking and lets unsafe operations flow through the program. §unknown§ can hold any value but requires narrowing before use, so it is safer for untrusted inputs. §never§ represents a value that cannot occur, such as the result of a function that always throws or a remaining union branch after exhaustive checking. They describe three different relationships with uncertainty, not interchangeable placeholders.",
    quick: [
      "§any§ permits almost every operation and can spread lost safety.",
      "§unknown§ accepts every value but permits use only after a proof.",
      "§never§ represents no possible value.",
      "Use §unknown§ at untrusted boundaries, then narrow or parse it.",
      "Use §never§ to make impossible or unhandled states visible.",
    ],
    interview: [
      "- §any§, §unknown§, and §never§ sit at different points in TypeScript's type relationships. §any§ disables most useful checking for a value, §unknown§ preserves uncertainty safely, and §never§ means no value can reach that point.",
      "- A value of type §any§ can be called, indexed, and assigned broadly, so one weak boundary can hide errors elsewhere. An §unknown§ value can receive a string, object, or number, but code must use a check such as §typeof§, §Array.isArray§, or a schema parser before accessing it.",
      "- For example, a parsed JSON payload can begin as §unknown§. A guard can prove it contains a string §name§, after which the program can use that property. Casting the payload to §User§ or making it §any§ would only silence the checker and would not inspect the response.",
      "- §never§ has the opposite meaning. A function that always throws can return §never§, and after a discriminated union has handled every member, the remaining value narrows to §never§. Assigning that remainder to a §never§ variable makes a new unhandled member produce a compile error.",
      "- In normal application code, §unknown§ is the right default for data whose shape has not been established. §any§ should be a narrow, documented escape hatch, while §never§ is a tool for proving that a branch is unreachable.",
    ],
    overviewTitle: "Think of permission, proof, and impossibility",
    overview:
      "§any§ grants operations without proof. §unknown§ stores a value until evidence narrows it. §never§ is what remains when the type system proves there are no valid possibilities.",
    deepTitle: "Unsafe information can travel farther than its original boundary",
    deep:
      "Because §any§ is broadly assignable, it can contaminate otherwise precise expressions. A misspelled method called on an §any§ value often produces no diagnostic, and its result is also §any§. Restricting the escape hatch to a small adapter makes later code safe again.\n\n§unknown§ forces that adapter to establish facts. Narrowing can be local control flow, a reusable type predicate, or a parser that returns a validated domain object. §never§ helps at the other end: it checks that every known case was removed before a supposedly unreachable branch.",
    visualType: "comparison_table",
    visualTitle: "How the checker treats each special type",
    visual:
      "| Type | What can be assigned to it? | What can code do before narrowing? | Typical use |\n|---|---|---|---|\n| §any§ | Almost anything | Almost anything | Temporary compatibility escape |\n| §unknown§ | Anything | Only universally safe operations | Untrusted input boundary |\n| §never§ | No reachable value | Nothing | Exhaustiveness or non-returning path |",
    codeTitle: "Prove exhaustive handling with never",
    code: [
      "type Result =",
      "  | { kind: \"ok\"; value: number }",
      "  | { kind: \"error\"; message: string };",
      "",
      "function text(result: Result): string {",
      "  switch (result.kind) {",
      "    case \"ok\": return String(result.value);",
      "    case \"error\": return result.message;",
      "    default: {",
      "      const unreachable: never = result;",
      "      return unreachable;",
      "    }",
      "  }",
      "}",
    ],
    followups: [
      "Why is §unknown§ safer than §any§ for parsed JSON?",
      "When does a function naturally return §never§?",
      "How does §never§ support exhaustive switches?",
    ],
  },
  {
    question: "How do union types and type narrowing work in TypeScript?",
    title: "Union types and narrowing",
    direct:
      "A union type says that a value may be one of several types, such as §string | number§. Before using members that belong to only one option, code narrows the union with runtime evidence such as §typeof§, equality, §in§, §instanceof§, or a discriminant property. TypeScript follows control flow and treats the value as the matching member inside each guarded path. Discriminated unions make related states explicit and support exhaustive handling.",
    quick: [
      "A union uses §|§ to list the valid alternatives for one value.",
      "Only operations shared by every member are safe before narrowing.",
      "Runtime checks give the compiler evidence for a narrower branch.",
      "A shared literal field creates a clear discriminated union.",
      "A §never§ check can make a switch exhaustive.",
    ],
    interview: [
      "- A union type models a value with a known set of alternatives. If an identifier is §string | number§, TypeScript allows only operations valid for both until the code proves which alternative is present.",
      "- Narrowing is that proof process. Checks such as §typeof value === 'string'§, §value instanceof Date§, §'id' in value§, and equality tests influence the control-flow graph. Inside a matching branch the checker exposes the members of the narrower type.",
      "- For example, a request state can be a union of loading, success with user data, and error with a message. Testing §state.status§ connects each UI branch with exactly the fields that exist in that state.",
      "- This is safer than one object with several unrelated optional properties because impossible combinations cannot be constructed. The model requires consumers to handle new variants, which is useful with an exhaustive §never§ check but can produce several intentional compile errors during change.",
      "- Unions describe alternatives, and guards convert runtime facts into safe static knowledge. A good discriminant keeps those guards simple and keeps the data needed by each case beside that case.",
    ],
    overviewTitle: "A guard removes alternatives along one control-flow path",
    overview:
      "The declared type remains the full union, but each branch carries more specific evidence. When execution leaves the guarded path, the checker widens the value back to whatever possibilities remain valid there.",
    deepTitle: "Discriminated unions tie valid data to valid states",
    deep:
      "A discriminant is a shared property whose value is a different literal in each member. One equality check can identify the complete object shape. This works well for network results, events, reducers, commands, and UI state machines.\n\nAn intersection uses §&§ for a different purpose: the value must satisfy all combined requirements at once. Intersecting unrelated alternatives can create impossible combinations, while a union intentionally presents choices. Optional chaining is convenient for absence but does not model mutually exclusive states with different meanings.",
    visualType: "flow_diagram",
    visualTitle: "The discriminant selects the valid fields",
    visual:
      "flowchart TD\n  S[State union] --> D{state.status}\n  D -->|loading| L[show spinner; no data field]\n  D -->|success| U[read data safely]\n  D -->|error| E[read message safely]\n  D -->|unhandled member| N[never check fails]",
    codeTitle: "Read only fields guaranteed by the selected state",
    code: [
      "type State =",
      "  | { status: \"loading\" }",
      "  | { status: \"success\"; names: string[] }",
      "  | { status: \"error\"; message: string };",
      "",
      "function summary(state: State): string {",
      "  if (state.status === \"success\") return state.names.join(\", \");",
      "  if (state.status === \"error\") return state.message;",
      "  return \"Loading\";",
      "}",
    ],
    followups: [
      "Which JavaScript checks can narrow a TypeScript union?",
      "What makes a union discriminated?",
      "How is an intersection different from a union?",
    ],
  },
  {
    question: "How do optional and readonly properties work in TypeScript?",
    title: "Optional and readonly properties",
    direct:
      "An optional property such as §nickname?: string§ may be absent, so reading it produces a value that may be §undefined§. A §readonly§ property can be assigned during object creation but cannot be reassigned through that TypeScript reference afterward. Both rules are compile-time constraints: optional does not mean every form of §undefined§ under all settings, and §readonly§ does not freeze the runtime object or deeply protect nested values.",
    quick: [
      "§?§ means a property may be absent from the object.",
      "Reading an optional property requires handling possible §undefined§.",
      "§readonly§ prevents assignment through the checked TypeScript reference.",
      "§readonly§ is shallow and does not call §Object.freeze§ at runtime.",
      "Fresh object literals receive excess-property checks for likely mistakes.",
    ],
    interview: [
      "- Optional and §readonly§ properties express two separate object contracts. An optional member may be missing, while a readonly member is visible but cannot be assigned through that typed reference after initialization.",
      "- For example, §interface User { readonly id: number; nickname?: string }§ requires an §id§ when the user is created and permits omission of §nickname§. Code reading §nickname§ receives §string | undefined§, so it needs a default, optional chain, or guard before string-only methods.",
      "- §readonly§ protects an assignment path in the type system; it does not freeze the JavaScript object. If a readonly property points to a mutable array, that array can still change unless the nested type is also readonly. Another mutable alias can also change the same runtime object.",
      "- TypeScript performs excess-property checks on a fresh object literal assigned directly to a target shape. That catches likely spelling mistakes, but it is not a general exact-object rule; structural assignment through a variable may include additional properties.",
      "- These modifiers are useful when they reflect the real model. Runtime immutability or input validation needs runtime techniques, and optional should describe genuine absence rather than making every field optional for convenience.",
    ],
    overviewTitle: "Presence and assignability are independent dimensions",
    overview:
      "A property can be required or optional, and independently mutable or readonly. The combination tells callers what must exist and what may be changed through the public contract.",
    deepTitle: "Compiler settings can make absence more precise",
    deep:
      "With §exactOptionalPropertyTypes§, an optional property means the key may be missing; explicitly assigning §undefined§ is allowed only if §undefined§ also appears in its declared type. This matters when an absent field means leave unchanged but a present undefined value has another meaning.\n\nReadonly arrays and tuples prevent mutating operations through that reference. Mapped types such as §Readonly<T>§ apply readonly to immediate properties, not recursively to every nested object. Deep immutability needs a deeper model plus runtime discipline or freezing where mutation cannot be trusted.",
    visualType: "comparison_table",
    visualTitle: "What each property form guarantees",
    visual:
      "| Declaration | May be absent? | May assign through this reference? | Runtime freeze? |\n|---|---:|---:|---:|\n| §name: string§ | No | Yes | No |\n| §name?: string§ | Yes | Yes when present | No |\n| §readonly name: string§ | No | No after creation | No |\n| §readonly name?: string§ | Yes | No after creation | No |",
    codeTitle: "Handle absence while protecting stable identity",
    code: [
      "interface User {",
      "  readonly id: number;",
      "  nickname?: string;",
      "  readonly tags: readonly string[];",
      "}",
      "",
      "const user: User = { id: 1, tags: [\"new\"] };",
      "const label = user.nickname?.toUpperCase() ?? \"USER-\" + user.id;",
      "console.log(label);",
    ],
    followups: [
      "Does §readonly§ make an object immutable at runtime?",
      "What changes when §exactOptionalPropertyTypes§ is enabled?",
      "Why do excess-property checks behave differently for a variable?",
    ],
  },
];

lessons["functions-with-types"] = [
  {
    question: "How do you type function parameters, return values, and callbacks?",
    title: "Typing functions and callbacks",
    direct:
      "TypeScript places annotations after parameters and can annotate or infer a function's return type. A callback is described with a function type such as §(value: string) => number§, which states both what the caller supplies and what the callback returns. Explicit parameter types define the calling contract; an explicit return type is most valuable on public APIs or when it should prevent an implementation from drifting to a different result.",
    quick: [
      "Parameter annotations define which arguments a caller may provide.",
      "Return types can be inferred, but public contracts may deserve annotations.",
      "A callback type describes its parameters and result with an arrow.",
      "§void§ means a callback result is intentionally ignored by the caller.",
      "Use a named function type when the same callback contract is reused.",
    ],
    interview: [
      "- TypeScript describes a function through its input parameter types and output type. A declaration such as §function total(prices: number[]): number§ tells callers what they must provide and what they receive, while the body is checked against that same contract.",
      "- Callback parameters are part of the receiving API. For example, a sorter can accept §(left: Item, right: Item) => number§. An inline callback then receives contextual types, so its parameters often need no repeated annotations.",
      "- A return annotation is optional when inference is clear, but it can protect an exported contract. If a refactor accidentally returns §undefined§ along one path, an explicit §: string§ reports the mistake at the function rather than allowing a wider inferred return type to spread to every caller.",
      "- §void§ deserves care. In a callback target, it means the caller will ignore the produced value, so a value-returning function can often be used where a void callback is expected. It does not mean the runtime function is incapable of returning a value.",
      "- Strong function types make data flow visible without annotating every expression. Inputs should be explicit at boundaries, outputs should be stable where consumers depend on them, and reusable callbacks should have one named contract rather than repeated loose signatures.",
    ],
    overviewTitle: "The signature is the boundary; the body must honour it",
    overview:
      "Call sites are checked against parameter positions, and each reachable return expression is checked against the declared result. Context can also flow from a callback parameter into an inline function expression.",
    deepTitle: "Function values can be passed, stored, and compared like other values",
    deep:
      "A function type expression describes only calling behaviour. Parameter names inside that expression document positions but do not require callers to use the same names. Object types can carry call signatures when a callable value also has properties, and interfaces or aliases can name either form.\n\nAssignability protects the receiving code's expectations. Under strict function checking, parameter compatibility catches callbacks that demand a narrower input than the caller promises to send. Return compatibility works in the other direction: a provided function must produce enough information for the consumer.",
    visualType: "flow_diagram",
    visualTitle: "Types guard both sides of a callback call",
    visual:
      "flowchart LR\n  A[array of Product] --> M[map calls formatter with Product]\n  M --> C[formatter reads Product fields]\n  C --> S[formatter returns string]\n  S --> R[map produces string array]\n  X[wrong callback input or result] -->|compile error| M",
    codeTitle: "Give the reusable callback a precise signature",
    code: [
      "type Product = { name: string; price: number };",
      "type Formatter = (product: Product) => string;",
      "",
      "const format: Formatter = (product) =>",
      "  product.name + \": $\" + product.price.toFixed(2);",
      "",
      "function labels(items: Product[], formatter: Formatter): string[] {",
      "  return items.map(formatter);",
      "}",
      "",
      "console.log(labels([{ name: \"Pen\", price: 2 }], format));",
    ],
    followups: [
      "When should a function have an explicit return annotation?",
      "What does §void§ mean in a callback type?",
      "How does contextual typing work for an inline callback?",
    ],
  },
  {
    question:
      "What is the difference between optional, default, and rest parameters?",
    title: "Optional, default, and rest parameters",
    direct:
      "An optional parameter uses §?§ and may be omitted, so its body sees the declared type plus §undefined§. A default parameter supplies a value when the argument is omitted or explicitly §undefined§, allowing the body to use the initialized type. A rest parameter gathers any remaining arguments into an array and must be last. These forms express different calling patterns; they should not replace a clear options object when many independent choices exist.",
    quick: [
      "§value?: T§ may be omitted and is read as §T | undefined§.",
      "A default runs when the argument is missing or exactly §undefined§.",
      "A rest parameter is last and collects remaining arguments into an array.",
      "Required parameters cannot normally follow optional parameters.",
      "Prefer an options object when several optional positions become unclear.",
    ],
    interview: [
      "- Optional, default, and rest parameters describe different call shapes. An optional parameter may be absent, a default parameter supplies an implementation value for absence, and a rest parameter captures a variable number of remaining arguments.",
      "- For example, §greet(name: string, title?: string)§ makes §title§ a §string | undefined§ inside the function. §greet(name, title = 'Friend')§ instead initializes a string whenever the caller omits that argument or passes §undefined§.",
      "- A rest signature such as §sum(...values: number[])§ accepts zero or more numeric arguments and exposes them as an array. It must be the last parameter because it consumes the remaining positions. A tuple rest type can describe a fixed sequence of different remaining arguments when that API is justified.",
      "- Positional flexibility has a readability limit. A call such as §connect(true, undefined, 3)§ hides meaning and becomes fragile when options grow. A named object with optional properties makes independent choices clearer and lets new options be added without shifting call positions.",
      "- The appropriate form follows the real calling contract: optional for genuine absence, a default for a safe fallback, rest for repeated homogeneous values, and an options object for a growing set of named choices.",
    ],
    overviewTitle: "Each syntax changes which calls are valid",
    overview:
      "The declaration defines the accepted argument list, while the function body receives either a possibly absent value, an initialized fallback, or an array of remaining values.",
    deepTitle: "Default evaluation happens at call time",
    deep:
      "A default initializer runs when the corresponding argument is missing or is explicitly §undefined§; §null§ is an ordinary supplied value and is not replaced. Defaults can refer to earlier parameters because those positions have already been initialized.\n\nAn optional callback parameter is often a warning sign. Declaring a callback's second parameter optional means the function invoking that callback may omit it, not that consumers are free to ignore it. APIs should describe what they actually call. Rest parameters and spread arguments are complementary: one gathers values inside a function, while the other expands an iterable or tuple at the call site.",
    visualType: "comparison_table",
    visualTitle: "How the body receives each parameter form",
    visual:
      "| Declaration | Caller may omit? | Value inside body | Best fit |\n|---|---:|---|---|\n| §title?: string§ | Yes | §string | undefined§ | Truly optional input |\n| §title = 'Friend'§ | Yes | Initialized string | Safe fallback |\n| §...scores: number[]§ | Any count | §number[]§ | Repeated inputs |\n| §options: Options§ | Object required | Named fields | Several independent choices |",
    codeTitle: "Use each form for a distinct call contract",
    code: [
      "function greet(name: string, title = \"Friend\"): string {",
      "  return \"Hello \" + title + \" \" + name;",
      "}",
      "",
      "function total(label: string, ...values: number[]): string {",
      "  const sum = values.reduce((left, right) => left + right, 0);",
      "  return label + \": \" + sum;",
      "}",
      "",
      "console.log(greet(\"Noah\"), total(\"Score\", 2, 3, 5));",
    ],
    followups: [
      "Does a default replace §null§?",
      "Why must a rest parameter be last?",
      "When is an options object clearer than optional positions?",
    ],
  },
  {
    question:
      "When should you use function overloads instead of a union parameter?",
    title: "Function overloads vs union parameters",
    direct:
      "Use a union parameter when every accepted input follows one implementation path and produces the same general return type. Use overloads when distinct call signatures have a meaningful relationship between a particular input shape and its return type, or when argument counts differ in ways a union cannot express clearly. Overload signatures are visible to callers; the implementation signature must cover them all but cannot be called directly.",
    quick: [
      "A union is usually simpler when the return type is the same for every input.",
      "Overloads describe multiple caller-visible signatures for one implementation.",
      "The implementation signature must be compatible with every overload.",
      "Callers cannot use the hidden implementation signature as an extra overload.",
      "Too many overloads often signal that the API should be redesigned.",
    ],
    interview: [
      "- A union parameter gives one call signature whose input may be several alternatives. Function overloads give one function several caller-visible signatures followed by a single implementation that handles all of them.",
      "- If §format(value: string | number): string§ returns a string for either case, the union is clearer and lets a caller pass an existing §string | number§ variable. Overloads add no useful information there and can make such union-valued calls harder to type.",
      "- Overloads earn their place when the output depends on the input. For example, a parser might return §Date§ for a numeric timestamp and a structured result for a token array. Separate signatures preserve that input-output relationship for each caller while one broad implementation narrows the runtime value.",
      "- The implementation signature is not part of the public overload set. It must be general enough to implement every declared signature, and callers must match one visible overload. The implementation still needs runtime checks because all overloads become one JavaScript function.",
      "- The simplest accurate public contract wins. Prefer a union when behaviour is uniform, use a small overload set for real signature relationships, and redesign with separate functions or a discriminated request object when combinations multiply.",
    ],
    overviewTitle: "Overloads correlate calls; unions collect alternatives",
    overview:
      "A union says one parameter may have several forms. An overload set says several complete calls are valid and can give each call its own return information.",
    deepTitle: "The JavaScript runtime still receives one function",
    deep:
      "Overload declarations disappear during emission. Only the implementation body remains, so it must inspect argument count or value shape exactly as ordinary JavaScript would. The types improve caller precision but do not dispatch to separate bodies.\n\nA union-typed caller may not match separate overloads even when every union member appears in the overload list, because no single overload promises to accept the combined input. One union signature avoids that problem when the result is uniform. Generic conditional returns are possible but often less readable than a small, honest overload set.",
    visualType: "comparison_table",
    visualTitle: "Choose based on the relationship being modeled",
    visual:
      "| API shape | Better starting point | Reason |\n|---|---|---|\n| Same result for string or number | Union parameter | One uniform contract |\n| Return type changes with input | Small overload set | Preserves correlation |\n| Many independent argument combinations | Request object | Names each option |\n| Different operations with different meanings | Separate functions | Clearer behaviour |",
    codeTitle: "Use overloads when the return follows the input",
    code: [
      "function first(value: string): string;",
      "function first(value: number[]): number;",
      "function first(value: string | number[]): string | number {",
      "  return typeof value === \"string\" ? value.charAt(0) : value[0] ?? 0;",
      "}",
      "",
      "const letter = first(\"TypeScript\");",
      "const number = first([8, 13]);",
      "console.log(letter, number);",
    ],
    followups: [
      "Why is the implementation signature hidden from callers?",
      "When does a union-valued argument fail against separate overloads?",
      "What API designs can replace a large overload list?",
    ],
  },
  {
    question: "How do you type asynchronous functions in TypeScript?",
    title: "Async function and Promise types",
    direct:
      "An §async§ function always returns a §Promise§ at runtime, so its TypeScript return annotation is usually §Promise<T>§, where §T§ is the value produced after awaiting. Returning a plain §T§ from the body automatically fulfils the promise with that value, and throwing rejects it. §await§ unwraps the fulfilled value for type checking, but it does not convert a rejected promise into a typed error value; errors still need an explicit handling strategy.",
    quick: [
      "Every §async§ function returns a Promise.",
      "Annotate an async result as §Promise<T>§, not just §T§.",
      "Returning §T§ fulfils the promise; throwing rejects it.",
      "§await§ gives the fulfilled value but can still throw on rejection.",
      "Model expected failures as data when callers must handle them explicitly.",
    ],
    interview: [
      "- An §async§ function has a promise-based runtime contract. Even if its body returns a plain value, JavaScript wraps that value in a fulfilled promise, so TypeScript represents the result as §Promise<T>§.",
      "- For example, §async function loadUser(id: number): Promise<User>§ may await §fetch§ and then return a §User§. A caller can await it to receive §User§, or use promise methods. If the body throws or an awaited promise rejects, the returned promise rejects.",
      "- The return annotation is useful at service boundaries because it checks every successful path against the intended model. It also stops an accidental missing return from quietly widening the inferred result to include §undefined§.",
      "- TypeScript does not encode a promise's rejection type. A §catch§ value is unsafe to assume and should be narrowed, commonly from §unknown§. When a failure is expected business data, a discriminated result union can make callers handle it instead of relying on an undocumented exception.",
      "- Async typing describes the fulfilled value accurately, while runtime parsing and failure handling remain separate responsibilities. A reliable function validates external payloads and clearly chooses whether failure rejects or returns a typed result.",
    ],
    overviewTitle: "The body produces a value; the call produces a promise",
    overview:
      "Inside an async body, §return value§ determines the fulfilled value. Outside, invoking the function immediately returns a Promise that later fulfils or rejects.",
    deepTitle: "Await changes control flow, not the underlying failure model",
    deep:
      "§await§ pauses the surrounding async function until its operand settles. A fulfilled promise contributes its value; a rejection is thrown at the await point and continues through normal §try/catch§ rules. The outer async function always returns immediately with its own promise.\n\n§Promise<void>§ signals completion without a useful fulfilled value. It differs from a callback typed to return §void§: ignoring a promise can hide rejection. Event systems that do not await callbacks need deliberate error capture rather than assuming an async handler's rejection will be observed.",
    visualType: "sequence_diagram",
    visualTitle: "An async call separates immediate and later results",
    visual:
      "sequenceDiagram\n  participant C as Caller\n  participant F as async loadUser\n  participant A as API\n  C->>F: call loadUser(7)\n  F-->>C: Promise<User> immediately\n  F->>A: await request\n  A-->>F: response or rejection\n  F-->>C: fulfil User or reject",
    codeTitle: "Expose the fulfilled type and validate the payload",
    code: [
      "type User = { id: number; name: string };",
      "",
      "async function loadUser(id: number): Promise<User> {",
      "  const response = await fetch(\"/api/users/\" + id);",
      "  if (!response.ok) throw new Error(\"Request failed\");",
      "  const value: unknown = await response.json();",
      "  if (!isUser(value)) throw new Error(\"Invalid user payload\");",
      "  return value;",
      "}",
      "",
      "function isUser(value: unknown): value is User {",
      "  if (typeof value !== \"object\" || value === null) return false;",
      "  const record = value as Record<string, unknown>;",
      "  return typeof record.id === \"number\" && typeof record.name === \"string\";",
      "}",
    ],
    followups: [
      "Why does an async function return §Promise<T>§ even when it returns §T§?",
      "How should a catch value be narrowed?",
      "When should expected failures be a result union instead of rejection?",
    ],
  },
];

lessons["generics-basics"] = [
  {
    question: "What are generics in TypeScript, and why are they useful?",
    title: "Generic types and reusable relationships",
    direct:
      "Generics let a function, type, interface, or class work with a type supplied by its caller while preserving relationships involving that type. A generic identity function §identity<T>(value: T): T§ returns the same specific type it receives, unlike §any§, which loses the connection. Generics are useful when one algorithm or data structure is valid for many types; they are unnecessary when the implementation works with only one fixed type or never relates multiple positions.",
    quick: [
      "A type parameter is a placeholder filled for a particular use.",
      "Generics preserve a relationship between inputs, outputs, and stored values.",
      "Inference often discovers the type argument from a function argument.",
      "§any§ accepts variety by discarding information; a generic can retain it.",
      "A type parameter should appear where a real relationship exists.",
    ],
    interview: [
      "- A generic introduces a type parameter so one definition can work for several concrete types without losing their identity. The caller supplies the type argument explicitly or the compiler infers it from values.",
      "- For example, §first<T>(items: T[]): T | undefined§ returns an element of the same type stored in its input array. Calling it with strings produces §string | undefined§, while numbers produce §number | undefined§. One implementation keeps both call sites precise.",
      "- Replacing §T§ with §any§ would make the function permissive but would disconnect the result from the input. Returning §unknown§ would be safe but would force every caller to narrow information that was already known. The generic records that relationship once.",
      "- Generics do not create runtime specializations in ordinary TypeScript. Their arguments are erased, so the implementation must use operations valid for the unconstrained parameter or add a constraint that promises required members.",
      "- They are best for containers, transformations, callbacks, and APIs where types move together. If the parameter appears only once or every case has different behaviour, a concrete type, union, or separate functions may communicate the contract better.",
    ],
    overviewTitle: "One placeholder connects several positions",
    overview:
      "The useful part of §T§ is not that it means any type. It means the same inferred or supplied type wherever §T§ appears in that particular call or instance.",
    deepTitle: "Inference chooses candidates from the call",
    deep:
      "For a generic function, TypeScript gathers information from arguments and contextual return expectations, then chooses a type argument that satisfies the signature. Explicit type arguments are available when inference lacks enough evidence, but unnecessary type arguments make calls noisier.\n\nGeneric interfaces and classes move the choice to the instance or implementing value. A §Box<string>§ can expose only string contents through its typed API. That separation produces reusable code without treating unlike values as interchangeable at the use site.",
    visualType: "flow_diagram",
    visualTitle: "The call fills one type parameter consistently",
    visual:
      "flowchart LR\n  S[string array] --> F[first with T inferred as string]\n  F --> SO[string or undefined]\n  N[number array] --> G[first with T inferred as number]\n  G --> NO[number or undefined]",
    codeTitle: "Preserve the element type through a reusable function",
    code: [
      "function first<T>(items: readonly T[]): T | undefined {",
      "  return items[0];",
      "}",
      "",
      "const firstName = first([\"Ada\", \"Lin\"]);",
      "const firstScore = first([8, 13]);",
      "",
      "console.log(firstName?.toUpperCase(), firstScore?.toFixed(1));",
    ],
    followups: [
      "How is a generic different from §any§?",
      "When can TypeScript infer a type argument?",
      "Why are generic type arguments unavailable at runtime?",
    ],
  },
  {
    question: "What are generic constraints, and how does keyof help?",
    title: "Generic constraints and keyof",
    direct:
      "A generic constraint limits which types may fill a type parameter while keeping the accepted type specific. §T extends { length: number }§ allows the implementation to read §length§ from any compatible input. §keyof T§ produces a union of the known property keys of §T§, so a second parameter constrained as §K extends keyof T§ can select only real keys and return the corresponding §T[K]§ value type.",
    quick: [
      "§extends§ on a type parameter states the minimum required structure.",
      "A constraint allows safe member access without fixing one concrete type.",
      "§keyof T§ is the union of property keys known for §T§.",
      "§T[K]§ is the property value type at key §K§.",
      "Constraints restrict calls; they do not validate runtime objects.",
    ],
    interview: [
      "- A generic constraint describes the minimum capability a type argument must have. Without one, a generic value could be a number, string, function, or object, so the implementation cannot assume a property such as §length§ exists.",
      "- §function size<T extends { length: number }>(value: T)§ accepts strings, arrays, and custom objects with numeric length while retaining each input's specific type. The constraint enables the operation but does not replace §T§ with the constraint inside the public relationship.",
      "- §keyof§ is useful when one generic depends on another. In §get<T, K extends keyof T>(object: T, key: K): T[K]§, the key must be present on the object type, and the result matches that exact property's type. Reading §name§ from a user returns a string, while reading §id§ returns a number.",
      "- A broad constraint such as §T extends object§ says little about usable members, and a forced assertion can hide a bad relationship. The narrowest capability needed by the implementation gives callers flexibility without weakening the proof.",
      "- Constraints operate only during checking. When keys or objects come from a network or user input, runtime membership and shape still need to be established before the generic helper can safely receive typed values.",
    ],
    overviewTitle: "A constraint supplies capability while preserving identity",
    overview:
      "The implementation sees the members promised by the constraint. Callers still receive results connected to the concrete type argument rather than only to that minimum shape.",
    deepTitle: "Indexed access carries a selected key into the result",
    deep:
      "§keyof§ applied to an object type forms a union of its known keys. A key parameter can narrow that union for one call. Indexed access §T[K]§ then looks up the value type associated with the selected key, retaining correlations that §object[key: string]§ would lose.\n\nConstraints can depend on earlier parameters and can also use unions, constructors, or other generic types. More complex constraints are not automatically better: if callers need assertions just to satisfy the helper, the API may be modeling implementation detail rather than a useful shared contract.",
    visualType: "flow_diagram",
    visualTitle: "The selected key determines the returned value type",
    visual:
      "flowchart LR\n  U[User: id number, name string] --> K{K extends keyof User}\n  K -->|id| N[result User[id] is number]\n  K -->|name| S[result User[name] is string]\n  K -->|missing| E[compile error]",
    codeTitle: "Connect an object key to its property value",
    code: [
      "function getProperty<T, K extends keyof T>(object: T, key: K): T[K] {",
      "  return object[key];",
      "}",
      "",
      "const user = { id: 7, name: \"Mina\", active: true };",
      "const id = getProperty(user, \"id\");",
      "const selectedName = getProperty(user, \"name\");",
      "",
      "console.log(id.toFixed(0), selectedName.toUpperCase());",
    ],
    followups: [
      "What can an unconstrained type parameter safely do?",
      "What type does §keyof§ produce for an object?",
      "How does §T[K]§ preserve the selected property's type?",
    ],
  },
  {
    question: "When should you use a generic instead of a union or any?",
    title: "Generics vs unions and any",
    direct:
      "Use a generic when the caller's concrete type must be preserved across two or more positions, such as input-to-output or item-to-container. Use a union when a value belongs to a fixed set of alternatives and the implementation handles those alternatives. Use §any§ only as a narrow compatibility escape because it removes checking rather than modeling variability. A generic whose type parameter appears only once often adds no useful relationship.",
    quick: [
      "Generic: preserve a caller-specific type relationship.",
      "Union: model a fixed list of alternatives.",
      "§any§: bypass checking at a narrow compatibility boundary.",
      "A type parameter used once may be unnecessary.",
      "Choose the smallest contract that matches the implementation's behaviour.",
    ],
    interview: [
      "- Generics and unions both support more than one type, but they communicate different facts. A generic preserves whichever type a caller uses; a union says the value is one member of a known finite set.",
      "- For example, §wrap<T>(value: T): { value: T }§ should be generic because a string input must create a string container and a date input must create a date container. That relationship would be lost if the result used §any§ or a broad union.",
      "- A formatter that explicitly accepts §string | number§ and returns a string does not need a type parameter. Its body narrows two known cases, and all callers receive the same result. A generic there would suggest precision that the behaviour never uses.",
      "- §any§ is different from both: it lets operations pass without proof and can spread through results. It may be needed when adapting an untyped library, but a small wrapper should convert it into §unknown§ or a validated domain type before the value reaches normal application code.",
      "- A type parameter should connect meaningful positions or enable a reusable container. If it appears only in one input and nothing depends on it, use the actual required shape. Honest contracts are easier to call and easier to maintain than decorative generic syntax.",
    ],
    overviewTitle: "Ask whether the alternatives are open or fixed",
    overview:
      "A generic leaves the concrete type open to each caller and carries it through the signature. A union closes the domain to listed members so implementation branches can handle them.",
    deepTitle: "Relationships, not flexibility alone, justify a type parameter",
    deep:
      "§function log<T>(value: T): void§ does not give its caller a more precise result and cannot use any member of §T§. §function log(value: unknown): void§ may express the actual capability more directly. By contrast, a generic callback such as §map<T, U>(items: T[], fn: (item: T) => U): U[]§ links four positions and retains valuable information.\n\nUnions can be generic members, and generics can be constrained to unions, so these tools are not exclusive. The design question is what callers need to know: a fixed variant, a preserved identity, or a deliberate unsafe boundary.",
    visualType: "comparison_table",
    visualTitle: "Match the tool to the information callers need",
    visual:
      "| Need | Best starting point | Information preserved |\n|---|---|---|\n| Same input type appears in output | Generic | Caller-specific relationship |\n| One of several named cases | Union | Fixed alternatives for narrowing |\n| Value not yet inspected | §unknown§ | Safety until proof |\n| Temporary untyped integration | Narrow §any§ | Almost none |",
    codeTitle: "Compare a real generic relationship with a fixed union",
    code: [
      "function wrap<T>(value: T): { value: T } {",
      "  return { value };",
      "}",
      "",
      "function format(value: string | number): string {",
      "  return typeof value === \"number\" ? value.toFixed(2) : value.trim();",
      "}",
      "",
      "const wrapped = wrap(new Date(0));",
      "console.log(wrapped.value.getUTCFullYear(), format(12));",
    ],
    followups: [
      "What does it mean when a type parameter appears only once?",
      "Can a generic be constrained to a union?",
      "Why can §any§ spread unsafety through a return type?",
    ],
  },
  {
    question: "What are Partial, Pick, Omit, and Record in TypeScript?",
    title: "Common utility types",
    direct:
      "TypeScript utility types transform existing types instead of duplicating them. §Partial<T>§ makes top-level properties optional, §Pick<T, K>§ selects listed keys, §Omit<T, K>§ removes listed keys, and §Record<K, V>§ describes an object whose keys §K§ map to values §V§. They are compile-time, usually shallow transformations. Use them when the new contract truly derives from the old one, not to hide a poorly defined domain model.",
    quick: [
      "§Partial<T>§ makes every immediate property optional.",
      "§Pick<T, K>§ keeps only keys §K§ from §T§.",
      "§Omit<T, K>§ keeps all properties except keys §K§.",
      "§Record<K, V>§ maps a key union to one value type.",
      "Utility types transform compile-time shapes and are usually shallow.",
    ],
    interview: [
      "- Utility types are reusable type transformations included with TypeScript. They derive one compile-time shape from another, reducing repeated property declarations while keeping the relationship visible.",
      "- For example, §Partial<User>§ makes each immediate User property optional, which can model a patch object when any field may be omitted. §Pick<User, 'id' | 'name'>§ selects a public summary, while §Omit<User, 'passwordHash'>§ removes a field from the visible shape.",
      "- §Record<Role, Permission[]>§ describes an object that has every key in the §Role§ union and an array of permissions at each key. If another role is added to the union, the checker points to the incomplete record.",
      "- These transformations are not runtime mappers and they are shallow. Creating an §Omit§ type does not delete a property from an object, and §Partial§ does not recursively make nested fields optional. Broad use can also couple API contracts too closely to a persistence model.",
      "- A utility type is strongest when the derived relationship is intentional and stable. Separate named request or response types are clearer when validation rules, security, or lifecycle meaning differs from the source model.",
    ],
    overviewTitle: "Mapped types derive a new view of known properties",
    overview:
      "The compiler iterates over property keys and changes their presence or selection rules. No JavaScript conversion is emitted, so runtime objects must still be created or filtered by real code.",
    deepTitle: "Convenient derivation can also create unwanted coupling",
    deep:
      "§Pick§ and §Omit§ calculate keys at compile time. If the source type changes, the derived type changes as well. That is helpful for genuinely linked views but risky when a public API should remain stable despite internal model changes.\n\n§Record§ is precise when the key set is a finite literal union. With an unrestricted §string§ key, it describes the assumed value for arbitrary keys even though a normal object lookup may be absent. Options such as §noUncheckedIndexedAccess§ can expose that uncertainty, or a partial record can model sparse keys explicitly.",
    visualType: "comparison_table",
    visualTitle: "What each utility changes",
    visual:
      "| Source or key set | Utility | Derived contract |\n|---|---|---|\n| §User§ | §Partial<User>§ | Same keys, all optional |\n| §User§ plus selected keys | §Pick<User, K>§ | Only selected properties |\n| §User§ plus removed keys | §Omit<User, K>§ | Everything except removed properties |\n| Key union plus value type | §Record<K, V>§ | Every key maps to §V§ |",
    codeTitle: "Derive stable views without repeating fields",
    code: [
      "type User = { id: number; name: string; passwordHash: string };",
      "type UserSummary = Pick<User, \"id\" | \"name\">;",
      "type UserPatch = Partial<Pick<User, \"name\">>;",
      "type PublicUser = Omit<User, \"passwordHash\">;",
      "type Role = \"reader\" | \"editor\";",
      "",
      "const permissions: Record<Role, string[]> = {",
      "  reader: [\"read\"],",
      "  editor: [\"read\", \"write\"],",
      "};",
      "",
      "const summary: UserSummary = { id: 1, name: \"Ava\" };",
      "const patch: UserPatch = { name: \"Mira\" };",
      "const publicUser: PublicUser = summary;",
      "console.log(permissions.editor, patch, publicUser);",
    ],
    followups: [
      "Are §Partial§ and §Readonly§ recursive?",
      "When can §Omit§ accidentally couple an API to an internal model?",
      "How does a finite-key §Record§ improve exhaustiveness?",
    ],
  },
];

lessons["typescript-with-react-basics"] = [
  {
    question: "How do you type React component props and children?",
    title: "Typing React props and children",
    language: "tsx",
    direct:
      "A React component's parameter is typed with the exact props object it accepts. Required, optional, callback, and union properties then become checked JSX attributes. Add §children§ explicitly when the component renders nested content; §ReactNode§ represents the broad set of values React can render, while §ReactElement§ is narrower and represents a React element. The type improves calls and editors but does not validate props arriving from an untyped runtime source.",
    quick: [
      "Describe component props with an interface, alias, or inline object type.",
      "Required and optional fields become checked JSX attributes.",
      "Declare §children§ only when the component supports nested content.",
      "§ReactNode§ is broader than §ReactElement§.",
      "Use a precise callback signature for events emitted by the component.",
    ],
    interview: [
      "- React props form a component's public input contract, so the function parameter should describe every accepted JSX attribute. An interface or type alias is useful once the shape has more than a small inline field.",
      "- For example, a §Panel§ can require a string §title§, accept an optional §onClose§ callback, and declare §children: ReactNode§ because it renders nested content. JSX then reports a missing title or a callback with the wrong signature at the call site.",
      "- §ReactNode§ represents common renderable values such as elements, strings, numbers, fragments, null, and undefined. §ReactElement§ is narrower and fits an API that specifically needs one constructed element. TypeScript cannot generally enforce that children are only a particular component kind because JSX elements are represented broadly.",
      "- Props are usually readonly inputs in practice. A component should request the smallest contract it needs instead of accepting an entire domain object for convenience, and optional props should have a clear default or absent state.",
      "- Prop types make composition and refactoring safer, but they vanish at runtime. Data decoded from an API or embedded page must be validated before it becomes trusted props; parent-to-child TypeScript checking alone cannot prove outside data.",
    ],
    overviewTitle: "Props connect the JSX call site to the component body",
    overview:
      "The same contract checks both sides: JSX must provide compatible attributes, and the component body can safely use the declared fields. Children are simply another input and should appear only when supported.",
    deepTitle: "Component contracts should model valid combinations, not broad bags",
    deep:
      "A callback prop should describe its domain event rather than leak an unnecessary browser event when the parent only needs a value. For example, §onSelect(id: string)§ keeps the component boundary stable even if the internal control changes.\n\nOptional fields are convenient but can create invalid combinations when several depend on each other. A union of prop shapes can tie required fields to a mode. This moves mistakes from conditional rendering at runtime to clear JSX diagnostics during development.",
    visualType: "flow_diagram",
    visualTitle: "One prop contract checks the parent and child",
    visual:
      "flowchart LR\n  P[Parent JSX attributes and children] -->|checked against PanelProps| C[Panel component]\n  C --> T[typed title]\n  C --> B[renderable children]\n  C --> E[onClose callback contract]\n  X[missing or incompatible prop] -->|compile error| P",
    codeTitle: "Type the component's actual public inputs",
    code: [
      "import type { ReactNode } from \"react\";",
      "",
      "type PanelProps = {",
      "  title: string;",
      "  children: ReactNode;",
      "  onClose?: () => void;",
      "};",
      "",
      "export function Panel({ title, children, onClose }: PanelProps) {",
      "  return (",
      "    <section>",
      "      <h2>{title}</h2>",
      "      <div>{children}</div>",
      "      {onClose && <button onClick={onClose}>Close</button>}",
      "    </section>",
      "  );",
      "}",
    ],
    followups: [
      "How is §ReactNode§ different from §ReactElement§?",
      "Should every component automatically include children?",
      "Why can a domain callback prop be better than exposing a DOM event?",
    ],
  },
  {
    question: "How does TypeScript infer and check React useState values?",
    title: "Typing useState",
    language: "tsx",
    direct:
      "§useState§ normally infers its state type from the initial value. A boolean initial value gives boolean state, while state that begins empty and later holds data should use an explicit union such as §User | null§. The setter accepts either the next state or a function from previous state to next state. Avoid relying on an empty array or §null§ alone when that initial value cannot express the complete future state.",
    quick: [
      "The initial state usually supplies the inferred state type.",
      "Use an explicit union when the initial value is only one lifecycle state.",
      "A functional update receives the correctly typed previous state.",
      "Do not widen state to §any§ merely to allow later values.",
      "Model related loading and error fields together when combinations matter.",
    ],
    interview: [
      "- React's §useState§ is generic, and TypeScript usually infers its type argument from the initial value. §useState(false)§ produces a boolean value and a setter that accepts a boolean or an updater returning boolean.",
      "- Initial values can be too narrow to describe the lifecycle. For example, a selected user begins as §null§ but later stores a §User§, so §useState<User | null>(null)§ states both valid states. The render must then guard the null case before reading user fields.",
      "- Functional updates preserve the same contract. §setCount(previous => previous + 1)§ receives a number when count is numeric, and it avoids using a stale captured value when several updates are queued.",
      "- A cast such as §null as User§ only makes the checker believe a user exists; it does not create one and can cause an immediate property-access failure. An honest union, a safe initial object, or a reducer state is better.",
      "- One state variable works for one coherent value. If loading, data, and error fields have dependent combinations, a discriminated union or reducer can prevent impossible states rather than adding unrelated booleans and optional fields.",
    ],
    overviewTitle: "The initial value seeds a generic state contract",
    overview:
      "The hook returns a pair: the current §T§ and a dispatcher accepting §T§ or a function from the previous §T§ to the next §T§. Every update is checked against that one choice.",
    deepTitle: "Inference cannot know future states that the initializer does not show",
    deep:
      "§null§ by itself contains no evidence about the object that may arrive later. An explicit type argument adds that missing lifecycle information. Empty collections have a similar issue: the desired element type should come from context or an explicit argument before values are added.\n\nLazy initialization accepts a function that creates the initial state once for mounting. This differs from a functional update even though both use functions: the initializer has no previous state, while the setter callback receives one. Precise hook types make the difference visible.",
    visualType: "mermaid",
    visualTitle: "The state type contains every permitted transition",
    visual:
      "stateDiagram-v2\n  [*] --> Empty: initial null\n  Empty --> Selected: setUser(User)\n  Selected --> Empty: setUser(null)\n  Selected --> Selected: setUser(other User)\n  Empty --> Invalid: reading user.name\n  Invalid: blocked by the User or null type",
    codeTitle: "Represent absence instead of asserting it away",
    code: [
      "import { useState } from \"react\";",
      "",
      "type User = { id: number; name: string };",
      "",
      "export function Selection() {",
      "  const [user, setUser] = useState<User | null>(null);",
      "",
      "  return (",
      "    <div>",
      "      <button onClick={() => setUser({ id: 1, name: \"Kai\" })}>Select</button>",
      "      <p>{user ? user.name : \"No user selected\"}</p>",
      "    </div>",
      "  );",
      "}",
    ],
    followups: [
      "When does §useState§ need an explicit type argument?",
      "Why is §null as User§ unsafe?",
      "What is the difference between lazy initialization and a functional update?",
    ],
  },
  {
    question: "How do you type React DOM events and refs?",
    title: "Typing React events and refs",
    language: "tsx",
    direct:
      "React event handlers use React's event types parameterized by the element, such as §ChangeEvent<HTMLInputElement>§. Inline handlers are usually inferred; extracted handlers often need an explicit type. Use §currentTarget§ when reading the element whose handler is running. A DOM ref commonly starts as §useRef<HTMLInputElement>(null)§, so code must handle §null§ because the element is absent before mounting and after unmounting.",
    quick: [
      "Inline event handlers are usually inferred from the JSX prop.",
      "Extracted handlers can use types such as §ChangeEvent<HTMLInputElement>§.",
      "§currentTarget§ is typed as the element owning the handler.",
      "A DOM ref includes §null§ across mount and unmount boundaries.",
      "Choose the exact element type to access the right DOM properties.",
    ],
    interview: [
      "- React's type definitions connect each JSX event prop to an event and element type. An inline §onChange§ callback receives contextual typing automatically, while a separately named handler can state §ChangeEvent<HTMLInputElement>§.",
      "- The element parameter matters because controls expose different properties. For example, an input change handler can read §event.currentTarget.value§ as a string, while a form submit handler uses §FormEvent<HTMLFormElement>§ and can prevent the default submission.",
      "- §currentTarget§ means the element on which the handler is registered and retains that element type. §target§ is the original event target and may be a nested element, so it is often less precise for reading the owning control.",
      "- A DOM ref is also generic. §useRef<HTMLInputElement>(null)§ says that §current§ is either the input or null. Optional chaining or a guard is required because React sets the ref after commit and clears it on unmount.",
      "- The goal is to use the JSX contract for inference and annotate only extracted boundaries. Broad casts to §any§ or forced non-null assertions hide genuine event and lifecycle differences that the React types already describe.",
    ],
    overviewTitle: "JSX supplies context for handlers; lifecycle supplies null for refs",
    overview:
      "The event prop tells TypeScript which element invokes a handler. A ref spans time, so its type includes the period before an element exists as well as the period in which DOM methods are available.",
    deepTitle: "React events and browser events share data but not every type name",
    deep:
      "React handler types describe its cross-browser event wrapper and associate it with a current-target element. Looking at the type expected by the JSX prop is often the most reliable way to choose an extracted handler type instead of memorizing names.\n\nA ref does not cause rendering when §current§ changes. It suits imperative operations such as focusing, measuring, or integrating a DOM library, not visible state that should update the UI. The element type should match the actual rendered node so the available methods remain truthful.",
    visualType: "sequence_diagram",
    visualTitle: "The handler and ref receive types from different relationships",
    visual:
      "sequenceDiagram\n  participant JSX as input JSX\n  participant H as change handler\n  participant R as input ref\n  JSX->>H: ChangeEvent with HTMLInputElement currentTarget\n  H->>H: read currentTarget.value\n  JSX->>R: commit sets HTMLInputElement\n  JSX->>R: unmount resets null",
    codeTitle: "Infer the JSX link and guard the ref lifecycle",
    code: [
      "import { useRef, useState } from \"react\";",
      "import type { ChangeEvent } from \"react\";",
      "",
      "export function SearchBox() {",
      "  const [query, setQuery] = useState(\"\");",
      "  const inputRef = useRef<HTMLInputElement>(null);",
      "  const change = (event: ChangeEvent<HTMLInputElement>) => {",
      "    setQuery(event.currentTarget.value);",
      "  };",
      "",
      "  return (",
      "    <div>",
      "      <input ref={inputRef} value={query} onChange={change} />",
      "      <button onClick={() => inputRef.current?.focus()}>Focus</button>",
      "    </div>",
      "  );",
      "}",
    ],
    followups: [
      "Why is §currentTarget§ often safer than §target§?",
      "When can an event handler type be inferred?",
      "Why does a DOM ref include §null§?",
    ],
  },
  {
    question:
      "How can discriminated unions make React component props safer?",
    title: "Discriminated unions for React props",
    language: "tsx",
    direct:
      "A discriminated union models several valid prop shapes with one literal field that selects the shape. For example, a button can be either a link with §href§ or an action with §onClick§, rather than one interface where both fields are optional. Checking the discriminant narrows props inside the component, and JSX callers must provide the matching fields. This prevents invalid combinations but should be used only when modes truly differ.",
    quick: [
      "Give every prop variant one shared literal discriminant.",
      "Place fields required by a mode inside that mode's union member.",
      "A discriminant check narrows the complete props object.",
      "JSX rejects missing and incompatible prop combinations.",
      "Use a simple interface when there is only one independent shape.",
    ],
    interview: [
      "- A discriminated union turns component modes into separate valid prop contracts. Each member has the same literal property, such as §kind§, and carries only the fields that belong to that mode.",
      "- For example, a call-to-action can be §{ kind: 'link'; href: string; label: string }§ or §{ kind: 'button'; onClick: () => void; label: string }§. A link cannot forget §href§, and a button cannot accidentally receive an unused §href§.",
      "- Inside the component, checking §props.kind === 'link'§ narrows the full object. The link branch can read §href§, while the other branch receives the callback. No non-null assertion is needed because the relationship is part of the type.",
      "- One broad interface with both fields optional admits states where neither or both are present, leaving runtime code to guess. The union removes those combinations, but too many tiny modes can make a component API difficult to read and may signal that separate components would be simpler.",
      "- This pattern is strongest when the UI behaviour and required data change together. It lets TypeScript validate that relationship at every JSX call site and keeps each render branch aligned with one real state.",
    ],
    overviewTitle: "One field selects one complete prop contract",
    overview:
      "The discriminant carries no hidden magic; it is a runtime value that React code already branches on. TypeScript uses the same branch to expose only the fields guaranteed in that variant.",
    deepTitle: "A union prevents impossible combinations before rendering",
    deep:
      "Optional properties model independent absence. They cannot express that §href§ is required exactly when a component renders an anchor. Separate union members encode that dependency and make changes exhaustive: adding another mode exposes every switch or conditional that needs to support it.\n\nFor mutually exclusive props without an explicit mode, a property can be typed as optional §never§ in the opposite member, but an explicit discriminant is usually easier to understand and narrows more clearly. Runtime inputs must still be validated before becoming these props.",
    visualType: "flow_diagram",
    visualTitle: "The mode controls required props and rendered output",
    visual:
      "flowchart TD\n  P[ActionProps] --> K{kind}\n  K -->|link| L[href required; onClick invalid]\n  L --> A[render anchor]\n  K -->|button| B[onClick required; href invalid]\n  B --> BTN[render button]",
    codeTitle: "Encode valid prop combinations directly",
    code: [
      "type ActionProps =",
      "  | { kind: \"link\"; label: string; href: string }",
      "  | { kind: \"button\"; label: string; onClick: () => void };",
      "",
      "export function Action(props: ActionProps) {",
      "  if (props.kind === \"link\") {",
      "    return <a href={props.href}>{props.label}</a>;",
      "  }",
      "  return <button onClick={props.onClick}>{props.label}</button>;",
      "}",
      "",
      "const example = <Action kind=\"link\" label=\"Docs\" href=\"/docs\" />;",
      "void example;",
    ],
    followups: [
      "Why are several optional props weaker than a discriminated union here?",
      "When should modes become separate components?",
      "How can an exhaustive check help when a new prop variant is added?",
    ],
  },
];

lessons["scenario-based"] = [
  {
    question: "How should TypeScript safely handle data returned by an API?",
    title: "Validating API data at the boundary",
    direct:
      "Treat an API payload as §unknown§ until runtime code has checked its shape. TypeScript types disappear at runtime, and a type assertion only changes the compiler's belief, so §response.json() as User§ cannot prove that the server sent a valid user. A focused guard or schema parser should check required fields, report a controlled error, and return a trusted domain type that the rest of the application can use normally.",
    quick: [
      "Network data is untrusted even when the client declares an expected type.",
      "Receive the payload as §unknown§ at the boundary.",
      "A type assertion does not inspect or convert a runtime value.",
      "Validate required fields before returning a domain object.",
      "Keep parsing in one adapter so internal code stays strongly typed.",
    ],
    interview: [
      "- An API response crosses from an untyped runtime system into the typed application, so its first honest type is §unknown§. A client-side §User§ interface describes what the application needs but cannot force the server, cache, proxy, or stored response to provide it.",
      "- For example, after parsing JSON, a guard can verify that the value is a non-null object with numeric §id§ and string §name§. Only the successful branch returns §User§; the failure path produces a controlled validation error instead of allowing a later property access to crash.",
      "- Writing §const user = payload as User§ skips that evidence. It does not add fields, convert a string id to a number, or throw when data is wrong. The first consumer then trusts a claim that no runtime code established.",
      "- Large applications often use a schema library for nested objects, arrays, reusable error messages, and transformations. A handwritten guard remains reasonable for a small shape, but it must inspect every field the returned type promises.",
      "- Once validation succeeds, normal services and components should receive the trusted domain type rather than repeatedly checking unknown values. This creates one visible boundary between external uncertainty and internal type safety.",
    ],
    overviewTitle: "A parser turns outside uncertainty into inside trust",
    overview:
      "The type changes only after executable checks have established the contract. Failed payloads stop at the adapter; successful values cross into the domain with a precise type.",
    deepTitle: "Parsing is stronger than asserting because it changes control flow",
    deep:
      "A type predicate tells TypeScript what a boolean result proves. Its implementation must be reviewed carefully because the compiler trusts the predicate signature. A parser can go further by returning a result object with structured failures or by normalizing acceptable wire formats into one internal model.\n\nValidation depth should match use. Checking only that §user§ is an object is insufficient if later code assumes nested address fields. Conversely, parsing at every component duplicates work. Validate once at the I/O boundary, keep raw and domain types separate when their shapes differ, and test both valid and malformed payloads.",
    visualType: "flow_diagram",
    visualTitle: "Trust is granted only after a runtime check",
    visual:
      "flowchart LR\n  A[API JSON] --> U[unknown]\n  U --> V{runtime parser}\n  V -->|invalid| E[controlled error with field details]\n  V -->|valid| D[trusted User domain value]\n  D --> S[services and UI use typed fields]\n  U -. assertion skips evidence .-> S",
    codeTitle: "Validate before exposing the User contract",
    code: [
      "type User = { id: number; name: string };",
      "",
      "function isUser(value: unknown): value is User {",
      "  if (typeof value !== \"object\" || value === null) return false;",
      "  const item = value as Record<string, unknown>;",
      "  return typeof item.id === \"number\" && typeof item.name === \"string\";",
      "}",
      "",
      "function parseUser(value: unknown): User {",
      "  if (!isUser(value)) throw new Error(\"Invalid user response\");",
      "  return value;",
      "}",
      "",
      "console.log(parseUser({ id: 4, name: \"Lea\" }).name);",
    ],
    followups: [
      "Why is §response.json() as User§ unsafe?",
      "When is a schema parser better than a handwritten guard?",
      "Should the API wire type and domain type always be identical?",
    ],
  },
  {
    question: "How can an existing JavaScript project migrate to TypeScript safely?",
    title: "Migrating JavaScript to TypeScript",
    direct:
      "A safe migration keeps the application runnable while TypeScript expands in controlled steps. Add a TypeScript configuration, allow JavaScript files during transition, type-check the build without changing runtime output first, and convert high-value boundaries one module at a time. Begin with shared data shapes and adapters, enable stricter checks gradually, and replace temporary §any§ values with §unknown§ plus validation. A full rewrite creates more risk and delays useful feedback.",
    quick: [
      "Keep JavaScript and TypeScript files together during a staged migration.",
      "Introduce checking before changing the runtime build pipeline unnecessarily.",
      "Convert shared contracts and risky boundaries before leaf utilities.",
      "Use narrow adapters around untyped code instead of spreading §any§.",
      "Raise strictness in measured steps with tracked temporary exceptions.",
    ],
    interview: [
      "- A JavaScript-to-TypeScript migration is safest as a sequence of small checked changes, not a rewrite. The current application should keep building and shipping while typed coverage grows.",
      "- The project can introduce a §tsconfig§ with JavaScript allowed, add TypeScript to the existing toolchain, and initially run the checker without emitting when a bundler already creates JavaScript. JavaScript checking or JSDoc can improve untouched files before they are renamed.",
      "- The first conversions should establish useful boundaries: API adapters, shared request and response models, widely used utilities, and modules with frequent defects. For example, an untyped legacy lookup can remain behind a TypeScript wrapper that accepts a numeric id, validates its unknown result, and returns §User§.",
      "- Enabling every strict option on a large codebase may produce an unreviewable error list. Teams can enable checks in stages, prohibit new unchecked escapes, and record temporary exceptions with owners. Broad assertions and global §any§ merely make the error count fall without increasing safety.",
      "- Progress is measured by trustworthy contracts and fewer unsafe boundaries, not by file-extension count alone. Small commits, unchanged behavioural tests, and a continuously passing build make the migration reversible and easier to review.",
    ],
    overviewTitle: "Typed islands expand while adapters contain untyped code",
    overview:
      "Each converted boundary takes uncertain legacy values in one side and exposes a checked contract on the other. Callers gain safety immediately even before the entire implementation is converted.",
    deepTitle: "Compiler adoption and source conversion are separate decisions",
    deep:
      "§allowJs§ lets JavaScript participate in a TypeScript project, while §checkJs§ asks the checker to report errors in JavaScript files too. JSDoc can express contracts where renaming is not yet practical. §noEmit§ allows TypeScript to be only the checking layer when another build tool handles transformation.\n\nDependency declarations and global assumptions should be audited early because they affect many files. The migration should also pin its compiler version: increasing strictness and upgrading TypeScript simultaneously can mix two different sources of diagnostics and make fixes harder to evaluate.",
    visualType: "flow_diagram",
    visualTitle: "Move one boundary at a time without stopping delivery",
    visual:
      "flowchart LR\n  J[working JavaScript app] --> C[add checker and mixed-file config]\n  C --> B[type shared boundaries]\n  B --> A[wrap untyped modules with adapters]\n  A --> M[convert modules incrementally]\n  M --> S[enable stronger strict checks]\n  S --> T[mostly strict TypeScript]\n  J -->|tests stay green at every step| T",
    codeTitle: "Contain a legacy result behind one checked adapter",
    code: [
      "type User = { id: number; name: string };",
      "declare function legacyLookup(id: number): unknown;",
      "",
      "function lookupUser(id: number): User {",
      "  const value = legacyLookup(id);",
      "  if (typeof value !== \"object\" || value === null) {",
      "    throw new Error(\"Legacy lookup returned no object\");",
      "  }",
      "  const item = value as Record<string, unknown>;",
      "  if (typeof item.id !== \"number\" || typeof item.name !== \"string\") {",
      "    throw new Error(\"Legacy lookup returned an invalid user\");",
      "  }",
      "  return { id: item.id, name: item.name };",
      "}",
    ],
    followups: [
      "What is the difference between §allowJs§ and §checkJs§?",
      "Which modules provide the most value when converted first?",
      "How can a team prevent temporary §any§ values from becoming permanent?",
    ],
  },
  {
    question:
      "How should you fix an Object is possibly undefined TypeScript error?",
    title: "Handling possibly undefined values",
    direct:
      "First identify why the value may be absent, then make that case part of the program's control flow. Array lookup methods, map access, optional properties, and DOM queries can legitimately return §undefined§ or §null§. Use a guard, early return, default, optional chain, or a function that throws a clear domain error when absence is invalid. A non-null assertion removes the diagnostic but adds no runtime check, so it belongs only behind an invariant established elsewhere.",
    quick: [
      "Read the source type to learn why absence is possible.",
      "Handle expected absence with a branch, default, or optional chain.",
      "Throw a clear boundary error when absence violates the domain contract.",
      "Narrow once, then use the proven value in the remaining scope.",
      "§!§ silences the checker and can preserve the runtime crash.",
    ],
    interview: [
      "- The diagnostic means the current control-flow path has not proved that a value exists. The first step is to inspect the API producing it: §Array.find§, §Map.get§, optional properties, and DOM queries all have genuine missing-result cases.",
      "- If absence is expected, the function should represent it. For example, a search helper can return §User | undefined§ and its caller can render a not-found state. An early return narrows the value to §User§ for all code below it.",
      "- If absence means corrupted state or a violated precondition, a small §requireUser§ function can check once and throw a meaningful error. That converts an optional lookup into a definite domain contract instead of repeating assertions at every use.",
      "- Optional chaining is right when skipping the operation is acceptable, and nullish coalescing is right when a real default exists. They should not hide required work; §order.customer?.charge()§ may silently skip a payment rather than handle an invalid order.",
      "- A non-null assertion changes only the static type and leaves §undefined.name§ to fail at runtime. It is reasonable only when a framework or preceding invariant guarantees existence but TypeScript cannot observe that proof, and the assumption should remain narrow and documented.",
    ],
    overviewTitle: "Absence has business meaning before it has syntax",
    overview:
      "Choose handling based on whether missing data is normal, recoverable with a default, or a broken invariant. The type should preserve that meaning until code resolves it.",
    deepTitle: "Control-flow analysis follows stable evidence",
    deep:
      "A direct guard narrows a local variable in dominated code paths. Re-reading a mutable property or calling the lookup again may lose that proof because the value could differ, so store the result and check it once. Callback boundaries can also require a more stable local binding.\n\nCompiler options such as §noUncheckedIndexedAccess§ expose additional cases where an index may not exist, even when the collection's element type is known. That can add useful accuracy for dictionaries and arrays, but fixed-length tuples remain a better model when positions are guaranteed.",
    visualType: "decision_tree",
    visualTitle: "Choose handling from the meaning of absence",
    visual:
      "flowchart TD\n  V[Value may be undefined] --> Q{Can absence happen normally?}\n  Q -->|yes| H[branch, optional chain, or optional return]\n  Q -->|no| I{Can a real default preserve meaning?}\n  I -->|yes| D[use nullish default]\n  I -->|no| E[guard and throw a clear invariant error]\n  V -. non-null assertion adds no runtime proof .-> U[unsafe direct use]",
    codeTitle: "Narrow a lookup once and keep the proof",
    code: [
      "type User = { id: number; name: string };",
      "",
      "function findName(users: User[], id: number): string | undefined {",
      "  const user = users.find((item) => item.id === id);",
      "  if (!user) return undefined;",
      "  return user.name;",
      "}",
      "",
      "const foundName = findName([{ id: 1, name: \"Jo\" }], 2);",
      "console.log(foundName ?? \"Not found\");",
    ],
    followups: [
      "When is optional chaining the wrong fix?",
      "Why can re-reading a property lose earlier narrowing?",
      "What does §noUncheckedIndexedAccess§ change?",
    ],
  },
  {
    question:
      "How do you convert browser form values into a type-safe domain object?",
    title: "Typing form data from the DOM",
    direct:
      "HTML form values are runtime input and usually begin as strings, files, or missing entries, even when the domain needs numbers or enums. Read them through the form boundary, check presence and kind, parse rather than cast, validate domain rules, and return either a typed object or structured errors. Writing §as number§ changes no runtime value; §Number§ conversion plus range checks is required before a field can safely become numeric.",
    quick: [
      "DOM and §FormData§ values do not automatically match domain types.",
      "Check for missing entries and distinguish strings from files.",
      "Convert numeric text with runtime parsing, not a type assertion.",
      "Validate domain limits after basic conversion.",
      "Return a typed success or structured error before calling business code.",
    ],
    interview: [
      "- A browser form is an external input boundary. Even when an input has §type='number'§, form submission data is text, and a §FormData§ lookup can also be a §File§ or §null§. The domain type should not be assigned until runtime conversion succeeds.",
      "- For example, an age field can be read, checked as a string, trimmed, and converted with §Number§. The parser must then reject an empty value, §NaN§, non-integers, and values outside the accepted range before returning §age: number§.",
      "- A TypeScript assertion such as §rawAge as unknown as number§ changes no JavaScript value. The runtime still holds a string, so later arithmetic may concatenate or produce an invalid result. Actual parsing is both the runtime operation and the evidence for the type.",
      "- A useful form adapter returns either a valid command object or field-specific errors. UI code can display those errors, while the service layer receives only a complete §Registration§ and does not repeat DOM concerns.",
      "- Types should be introduced after validation at the boundary and preserved afterward. This separates browser representation, validation rules, and domain behaviour instead of pretending they are the same shape.",
    ],
    overviewTitle: "Representation changes as data crosses the form boundary",
    overview:
      "The DOM supplies raw values. Parsing handles representation, validation applies the domain rules, and only the successful branch constructs the object accepted by application services.",
    deepTitle: "Conversion and validation answer different questions",
    deep:
      "Conversion asks whether text can become the required primitive. Validation asks whether that primitive is allowed for this operation. §Number('')§ produces zero, which is a valid number conversion but often an invalid interpretation of an empty required field, so presence should be checked before conversion.\n\nHTML constraints improve interaction but do not establish server trust and can be bypassed. The same domain constraints need an authoritative server-side implementation. Client parsing exists for immediate feedback and for keeping the client model honest, not as the only security boundary.",
    visualType: "flow_diagram",
    visualTitle: "Raw form representation becomes a domain command",
    visual:
      "flowchart LR\n  I[HTML inputs] --> F[FormData: string, File, or null]\n  F --> P[check presence and parse primitives]\n  P --> V{domain rules pass?}\n  V -->|no| E[field-specific errors]\n  V -->|yes| R[Registration with numeric age]\n  R --> S[application service]",
    codeTitle: "Parse text before constructing the typed result",
    code: [
      "type Registration = { name: string; age: number };",
      "",
      "function parseRegistration(data: FormData): Registration {",
      "  const name = data.get(\"name\");",
      "  const rawAge = data.get(\"age\");",
      "  if (typeof name !== \"string\" || !name.trim()) {",
      "    throw new Error(\"Name is required\");",
      "  }",
      "  if (typeof rawAge !== \"string\" || !rawAge.trim()) {",
      "    throw new Error(\"Age is required\");",
      "  }",
      "  const age = Number(rawAge);",
      "  if (!Number.isInteger(age) || age < 18) throw new Error(\"Age must be 18+\");",
      "  return { name: name.trim(), age };",
      "}",
    ],
    followups: [
      "Why does an input with §type='number'§ still need numeric parsing?",
      "What is the difference between conversion and domain validation?",
      "Why must the server validate the same rules again?",
    ],
  },
];

function updateQuestion(base, lesson, order) {
  const visual = md(lesson.visual);
  const renderedVisual = lesson.visualType.includes("diagram")
    ? fence("mermaid", visual.split("\n"))
    : visual;
  const intent = intents[lesson.title];
  if (!intent) throw new Error("Missing interviewer intent for " + lesson.title);
  return {
    ...base,
    question: lesson.question,
    title: lesson.title,
    direct_answer: md(lesson.direct),
    layout_type: "concept-explanation",
    difficulty: lesson.difficulty ?? "easy",
    importance: lesson.importance ?? "high",
    reading_time_minutes: lesson.readingTime ?? 7,
    interviewer_intent: {
      testing: intent.testing,
      common_mistake: intent.mistake,
      to_stand_out: intent.standout,
    },
    answer: {
      sections: [
        {
          type: "key_points",
          title: "Quick revision",
          items: lesson.quick.map(md),
        },
        {
          type: "speakable_answer",
          title: "Interview answer",
          answerSize: lesson.answerSize ?? "compact",
          content: lesson.interview.map(md).join("\n\n"),
        },
        {
          type: "overview",
          title: lesson.overviewTitle,
          content: md(lesson.overview),
        },
        {
          type: "deep_explanation",
          title: lesson.deepTitle,
          content: md(lesson.deep),
        },
        {
          type: lesson.visualType,
          title: lesson.visualTitle,
          content: renderedVisual,
        },
        {
          type: "code_example",
          title: lesson.codeTitle,
          content: fence(lesson.language ?? "typescript", lesson.code),
        },
      ],
    },
    followup_questions: lesson.followups.map(md),
    order,
    seo: {
      metaTitle:
        lesson.title + " | TypeScript interview | InterviewExplainer",
      metaDescription: metaDescription(lesson.direct),
    },
  };
}

for (const [topicSlug, topicLessons] of Object.entries(lessons)) {
  const file = path.join(root, topicSlug, "complete-qa.json");
  const document = JSON.parse(fs.readFileSync(file, "utf8"));
  if (document.questions.length < topicLessons.length) {
    throw new Error(
      file + ": requires " + topicLessons.length + " stable question records",
    );
  }
  document.topic = topicTitles[topicSlug];
  document.topicSlug = topicSlug;
  document.questions = topicLessons.map((lesson, index) =>
    updateQuestion(document.questions[index], lesson, index + 1),
  );
  fs.writeFileSync(file, JSON.stringify(document, null, 2) + "\n");
}

console.log(
  "Curated " +
    Object.values(lessons).flat().length +
    " TypeScript questions.",
);
