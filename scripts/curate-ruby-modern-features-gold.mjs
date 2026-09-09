#!/usr/bin/env node

import fs from "node:fs";
import path from "node:path";

const domainRoot = "content/ruby-backend-fresher";
const root = path.join(domainRoot, "ruby-modern-features");
const fence = (language, lines) => `\`\`\`${language}\n${lines.join("\n")}\n\`\`\``;

const lessons = {
  "ruby-pattern-matching-ruby3-basics": {
    answerSize: "standard",
    direct: "Ruby pattern matching checks the shape of structured data and can bind matched parts to local variables. A `case` expression uses `in` branches, such as `in { type: \"paid\", order_id: }`, to both verify the keys and capture `order_id`. Array patterns can separate a first value from the rest, guards add a condition, and the pin operator `^` compares with an existing variable instead of replacing it. A `case/in` without a matching branch or `else` raises `NoMatchingPatternError`, so use a fallback when unknown input is valid.",
    quick: [
      "Pattern matching checks a value's structure and extracts the parts that match.",
      "Use `case/in` for alternatives and `value => pattern` for expected structure.",
      "Array patterns require the whole shape unless a rest pattern is present.",
      "Hash patterns accept extra symbol keys unless `**nil` forbids them.",
      "Use `^name` to compare with an existing variable; a bare name binds a new value.",
    ],
    interview: [
      "- Ruby pattern matching is a way to test structured data and name selected parts in the same operation. It is written with `case/in`, standalone rightward assignment using `=>`, or the boolean `in` expression. Unlike a chain of key lookups, the pattern describes the shape the program expects.",
      "- Each `in` branch is tried in order. Literal, class, range, array, and hash patterns can be nested. A variable in a pattern normally captures a value, so an existing variable must be pinned with `^` when it should act as a comparison value. An `if` guard can check an extra rule after the structural match succeeds.",
      "- For example, an event handler can match `{ type: \"paid\", order_id: Integer => id }`. That branch runs only when the event has the expected type and an integer order ID, and `id` is immediately available to the body. A second branch can handle `{ type: \"failed\", reason: }`, while `else` records an unsupported event.",
      "- Array and hash patterns have different boundaries. `[first, second]` does not match a three-item array unless a rest pattern is included. `{ name: }` can match a hash with additional symbol keys; `{ name:, **nil }` requires no extras. Ruby hash patterns work with symbol keys, which matters after parsing JSON with string keys.",
      "- I use pattern matching when shape is central to the decision, such as events, command results, or nested API data. Ordinary accessors or simple conditionals remain clearer for one field. If unknown shapes are possible, an `else` branch makes that boundary explicit instead of allowing `NoMatchingPatternError` to escape accidentally.",
    ],
    deepTitle: "Matching is a small contract for the shape of a value",
    deep: [
      "A pattern has two jobs: it rejects values with the wrong structure and exposes useful pieces from values that fit. Ruby first takes the expression after `case`, then tests the `in` branches from top to bottom. The first successful branch supplies its captured local variables to that branch body. `when` and `in` are different branch systems and cannot be mixed inside one `case` expression.",
      "Value patterns rely on `===`, so a class checks type, a range checks membership, and a literal checks its expected value. Variable names behave differently: `in code` assigns the matched value to `code`; it does not compare with a previous local variable of that name. Writing `in ^expected_code` changes the role to comparison. Guards such as `if amount.positive?` belong after the structural part and may use values just captured by the pattern.",
      "Collection rules prevent subtle assumptions. An array pattern describes all positions unless `*` or `*rest` absorbs remaining elements. A hash pattern normally asks only for listed symbol keys and ignores other keys. Adding `**nil` states that no unknown keys are allowed. JSON parsers commonly produce string-keyed hashes, so code must symbolize keys deliberately or match another representation before using a hash pattern.",
      "Standalone forms express two different intentions. `payload => { user: { id: } }` is an assertion plus unpacking operation and raises when the contract is broken. `payload in { cached: true }` produces `true` or `false` and is useful in a predicate. A multi-branch `case/in` is better when several valid shapes lead to different behaviour. Omitting both a successful branch and `else` makes the case exhaustive by raising `NoMatchingPatternError`.",
      "User-defined objects can participate without being converted manually. Array-style matching asks an object for `deconstruct`; hash-style matching asks for `deconstruct_keys`. That is useful for domain value objects, but the returned structure becomes part of the object's public matching contract. It should expose stable meaning rather than private storage details.",
      "Pattern matching improves code only when the visual shape helps the reader. Deep patterns repeated across handlers can become another form of coupling to external payloads. At an integration boundary, validate and normalize an incoming event once, then let the rest of the application work with a small domain object. This separates unreliable transport shape from dependable business behaviour.",
    ],
    visualType: "flow_diagram",
    visualTitle: "How Ruby chooses a `case/in` branch",
    visual: fence("mermaid", [
      "flowchart TD",
      "  V[structured value] --> P1{first pattern fits?}",
      "  P1 -->|yes| G1{guard passes?}",
      "  G1 -->|yes| B1[bind names and run branch]",
      "  G1 -->|no| P2{next pattern fits?}",
      "  P1 -->|no| P2",
      "  P2 -->|yes| B2[bind names and run branch]",
      "  P2 -->|no| E{else present?}",
      "  E -->|yes| F[run fallback]",
      "  E -->|no| X[raise NoMatchingPatternError]",
    ]),
    codeTitle: "Match two event shapes and keep an explicit fallback",
    code: [
      "event = { type: 'paid', order_id: 42, amount: 1_500 }",
      "",
      "message = case event",
      "in { type: 'paid', order_id: Integer => id, amount: 1.. => cents }",
      "  \"capture order #{id} for #{cents} cents\"",
      "in { type: 'failed', order_id:, reason: }",
      "  \"order #{order_id} failed: #{reason}\"",
      "else",
      "  'unsupported event'",
      "end",
      "",
      "puts message",
      "",
      "expected_id = 42",
      "matches_expected = event in { order_id: ^expected_id }",
      "puts matches_expected # true; pin compares",
    ],
    followups: [
      "Why does a bare variable bind while a pinned variable compares?",
      "How do array and hash patterns differ when the value contains extra items?",
      "When should an event handler include an `else` branch?",
    ],
  },
  "ruby-numbered-block-parameters-basics": {
    answerSize: "compact",
    direct: "Numbered block parameters are Ruby's shorthand for block arguments. When a block has no explicit parameter list, `_1` means its first argument, `_2` the second, through `_9`. For example, `prices.map { _1 * 1.18 }` is equivalent to `prices.map { |price| price * 1.18 }`. Ruby does not allow numbered parameters and an explicit `|...|` list in the same block. They are clearest in short, obvious expressions; named parameters are better when the block is longer or the roles of multiple values need explanation.",
    quick: [
      "`_1` through `_9` stand for arguments of a block with no named parameter list.",
      "`names.map { _1.upcase }` means the same as `names.map { |name| name.upcase }`.",
      "Two-argument blocks can use `_1` and `_2`, in the order yielded by the method.",
      "Do not combine `_1` with explicit parameters such as `|item|` in one block.",
      "Prefer meaningful names when the expression is not immediately obvious.",
    ],
    interview: [
      "- Numbered block parameters let a Ruby block refer to its yielded arguments as `_1`, `_2`, and so on without writing a `|parameter_list|`. They were added in Ruby 2.7 as concise syntax; they do not change how the block receives values or closes over its surrounding scope.",
      "- For example, `users.map { _1.email }` is the short form of `users.map { |user| user.email }`. With `each_with_index`, `_1` is the element and `_2` is its index because that is the order the method yields them. The method's yield contract still decides what every position means.",
      "- Ruby rejects a block that mixes numbered parameters with explicit block parameters. Assignment to `_1` is also invalid. Nested blocks are especially easy to misread because each block has its own argument context and an outer numbered parameter cannot simply be reused inside a nested numbered block.",
      "- This shorthand works well for a one-step transformation or predicate where the role is obvious. In a multi-line calculation, a domain name such as `invoice` or `running_total` carries useful meaning that `_1` and `_2` cannot provide.",
      "- My rule is based on clarity rather than line count alone: use a numbered parameter when the reader can identify the input at a glance, and switch to explicit names as soon as positions require explanation.",
    ],
    deepTitle: "The yielding method still defines what each position means",
    deep: [
      "A block receives values from the method that yields to it. Numbered parameters remove the declaration between vertical bars, but they do not invent or reorder those values. In `map`, `_1` is normally the current element. In `each_with_index`, the collection element is first and the numeric index is second. In a two-value iterator over a hash, the exact argument behaviour should be read from that method's contract rather than guessed from the variable names.",
      "Ruby activates implicit numbered parameters only when the block has no explicit parameter declaration. The highest referenced position determines the apparent arity of the block. Writing `{ |value| _1 }` tries to use two parameter styles in the same scope and is a syntax error. A numbered parameter is also reserved for input, so assigning to `_1` is not permitted.",
      "The concise form is helpful when the operation already names the role. `temperatures.select { _1.negative? }` reads naturally because `temperatures` and `negative?` provide the missing context. `records.reduce({}) { _1.merge(_2.key => transform(_2)) }` forces the reader to remember two roles while following other logic. Explicit `|result, record|` names make that version easier to verify and change.",
      "Nesting introduces another boundary. Each block can establish its own numbered-parameter scope, and Ruby prevents ambiguous access where an outer block already relies on implicit parameters. Even when code can be rearranged to compile, `_1` in two nearby scopes is visually fragile. Naming at least the outer value usually reveals the data flow and avoids accidental confusion during maintenance.",
      "Numbered parameters remain ordinary block inputs with respect to closure behaviour. The block can still read local variables created outside it, and methods such as `map`, `select`, or `reduce` still determine the return value. Performance does not improve merely because the bars and name disappeared; this is a syntax and readability choice.",
      "A useful review question is whether changing `_1` to a sensible name adds information. If `order` tells the reader something that the collection and method do not, keep the name. If it only repeats an obvious one-line operation, the shorthand can remove noise. Consistency inside a codebase also matters more than demonstrating every available syntax feature.",
    ],
    visualType: "comparison_table",
    visualTitle: "Choose shorthand only while the argument roles stay obvious",
    visual: [
      "| Block | What the reader must infer | Better choice |",
      "|---|---|---|",
      "| `names.map { _1.upcase }` | one obvious value | numbered parameter |",
      "| `rows.each_with_index { puts \"#{_2}: #{_1}\" }` | element and index | either form |",
      "| `orders.reduce(0) { _1 + _2.total }` | accumulator and order | named parameters |",
      "| nested or multi-line logic | several changing roles | named parameters |",
    ].join("\n"),
    codeTitle: "Compare the short form with names that explain two roles",
    code: [
      "prices = [10, 25, 40]",
      "with_tax = prices.map { _1 * 1.18 }",
      "",
      "names = %w[Ada Linus]",
      "names.each_with_index { puts \"#{_2 + 1}. #{_1}\" }",
      "",
      "orders = [{ total: 20 }, { total: 35 }]",
      "total = orders.reduce(0) do |running_total, order|",
      "  running_total + order[:total]",
      "end",
      "",
      "p with_tax",
      "p total",
    ],
    followups: [
      "Who decides whether `_2` is an index, value, or accumulator?",
      "Why are numbered parameters difficult to read in nested blocks?",
      "When does an explicit block parameter add useful domain meaning?",
    ],
  },
  "ruby-endless-methods-basics": {
    answerSize: "compact",
    direct: "An endless method is a single-expression Ruby method written with `=` instead of a body closed by `end`, for example `def active? = status == :active`. Ruby evaluates that expression when the method is called and returns its value just like a normal method. The form is useful for small predicates, calculated attributes, and simple delegation. It should not compress branching, multi-step work, or error handling into one dense expression, and assignment methods such as setters cannot use this shorthand.",
    quick: [
      "Write an endless method as `def name(arguments) = expression`.",
      "The expression is evaluated on every call and becomes the return value.",
      "Use it for a small predicate, calculation, or delegation.",
      "Use normal `def ... end` when the work needs several clear steps.",
      "Setter-style assignment methods cannot be defined with endless syntax.",
    ],
    interview: [
      "- An endless method is Ruby's compact syntax for a method whose body is one expression. `def total = subtotal + tax` defines the same public method shape as a normal `def total ... end`; the value of the expression is returned when the method runs.",
      "- The form is well suited to a small predicate, computed property, or delegation. For example, `def adult? = age >= 18` keeps a simple rule next to its name without an extra closing line, and `def display_name = profile.name` makes a thin delegation easy to scan.",
      "- “One expression” does not automatically mean “simple.” A long conditional, chained mutation, or rescue modifier can technically be squeezed into an expression while hiding important branches and side effects. Normal method syntax gives those steps room and is easier to debug.",
      "- Endless definitions have the usual method behaviour for arguments, visibility, and return values, but setter assignment methods are a syntax boundary. They also require a Ruby version that supports the feature, so a gem's supported-version range can rule them out.",
      "- I choose the shorthand only when the method name and its expression explain the whole operation immediately. If a comment is needed to decode the line, the regular form is the clearer design.",
    ],
    deepTitle: "The shorthand removes an `end`, not the method contract",
    deep: [
      "Ruby added endless definitions as an alternative spelling for a method with a single expression. The method is still installed on its class or module, receives arguments according to the normal method rules, respects public or private visibility, and runs only when called. The expression after `=` is the body; its result is the method result unless control flow inside that expression says otherwise.",
      "This makes the syntax a natural fit for tiny queries. A predicate such as `def empty? = size.zero?`, a calculation such as `def gross = net + tax`, or a delegation such as `def email = account.email` has one idea and no setup. Keeping the name and rule on one line can improve scanning when a value object has several similarly small operations.",
      "The main boundary is cognitive complexity rather than character count. Ruby expressions can contain ternaries, assignments, chained calls, and inline exception handling. Combining those merely to retain endless syntax makes failure paths harder to see and gives a debugger fewer meaningful lines. A standard method body can name intermediate values and put each decision where the reader expects it.",
      "Endless syntax also does not turn a value into a stored attribute. `def timestamp = Time.now` calls `Time.now` on every invocation; it is not evaluated once at class definition time. Likewise, a method that returns a mutable object still returns that mutable object. The spelling creates no memoization, purity, or immutability guarantee.",
      "Assignment methods are a special grammar case. A writer such as `def name=(value)` cannot use the shorthand, even though its implementation might appear to be one assignment. Use the normal form for setters. Operators and ordinary names have their own parsing details, so teams should favour straightforward examples over clever syntax puzzles.",
      "Version compatibility belongs to the decision as well. Endless methods arrived in Ruby 3.0, and early releases described the feature as experimental before it settled into normal use. Application code on a fixed modern runtime can adopt it deliberately. A library supporting older Ruby versions must continue using `def ... end`, because unsupported syntax prevents the file from loading at all.",
    ],
    visualType: "comparison_table",
    visualTitle: "The same method contract in two spellings",
    visual: [
      "| Concern | Endless definition | Regular definition |",
      "|---|---|---|",
      "| body | one expression after `=` | one or more expressions before `end` |",
      "| return | result of the expression | result of the final executed expression |",
      "| best fit | predicate, calculation, delegation | branches, setup, rescue, several steps |",
      "| setter method | not supported | supported |",
      "| runtime requirement | Ruby 3.0 or newer | all relevant Ruby versions |",
    ].join("\n"),
    codeTitle: "Keep obvious queries short and multi-step work open",
    code: [
      "class Invoice",
      "  def initialize(subtotal, tax)",
      "    @subtotal = subtotal",
      "    @tax = tax",
      "  end",
      "",
      "  def total = @subtotal + @tax",
      "  def free? = total.zero?",
      "",
      "  def summary",
      "    label = free? ? 'free' : 'payable'",
      "    \"#{label}: #{total}\"",
      "  end",
      "end",
      "",
      "puts Invoice.new(100, 18).summary",
    ],
    followups: [
      "Does an endless method evaluate its expression once or on every call?",
      "Which kinds of method become less readable when compressed to one expression?",
      "Why does a library's supported Ruby version affect this syntax choice?",
    ],
  },
  "ruby-data-define-basics": {
    answerSize: "standard",
    direct: "`Data.define` creates a class for a value made from a fixed set of members. `Point = Data.define(:x, :y)` gives instances readers, value-based equality, hashing, inspection, deconstruction, `to_h`, and `with`, but no generated writers. All members are required when constructing an instance. It is a strong choice for coordinates, money, or parsed commands whose identity is their contents. The immutability is shallow: a member can still refer to a mutable array or string, so nested values must be frozen or copied when the whole value needs to remain unchanged.",
    quick: [
      "`Data.define(:x, :y)` creates a class with a fixed set of required members.",
      "Instances have readers and value-based equality, but no generated writers.",
      "`with(x: new_x)` returns another instance with selected members changed.",
      "Data supports `to_h` and pattern matching through deconstruction methods.",
      "Its immutability is shallow; mutable objects stored inside can still change.",
    ],
    interview: [
      "- `Data.define` is a Ruby 3.2 feature for declaring a value-object class with named members. The generated class supplies construction, readers, inspection, equality, hashing, conversion to a hash, pattern-matching support, and a `with` method. It does not generate member writers.",
      "- Two instances of the same Data class compare by their member values, so the object represents information rather than a separately changing identity. Every declared member is required. Construction can use positions or keywords, although keyword form usually explains the data more clearly at the call site.",
      "- For example, `Money = Data.define(:cents, :currency)` can represent a price. `Money.new(cents: 500, currency: \"INR\")` compares equal to another instance with the same contents and can be used as a hash key. Calling `price.with(cents: 650)` produces a new Money value while leaving `price` unchanged.",
      "- The important boundary is shallow immutability. Data prevents replacing a member through a generated writer, but it does not recursively freeze an array or string stored in that member. If `tags` is a mutable array, `record.tags << \"sale\"` can still change it unless the program freezes or defensively copies that array.",
      "- I choose Data for small, complete values with stable fields and value equality. A Struct is useful when mutable record-style members are intended, while a normal class is better when construction rules, evolving state, hidden representation, or a richer lifecycle are central to the model.",
    ],
    deepTitle: "A Data instance is identified by its complete member set",
    deep: [
      "`Data.define` returns a new class whose members are declared once. Instances expose a reader for each member, but no automatic writer. The constructor expects values for every member and rejects missing or unknown ones. This creates a small explicit shape that is useful at boundaries between parsing, validation, and domain behaviour.",
      "Equality follows the value model. Two objects compare equal when they belong to the same generated Data class and their corresponding members compare equal. Compatible `eql?` and `hash` behaviour makes such values suitable as hash keys, provided the member values used for hashing do not change underneath them. Identity with `equal?` remains a separate concept: equal values may still be different objects.",
      "The `with` method supports change without a writer. It builds a shallow copy using the current members and replaces only the supplied keywords. This is convenient for transformations such as changing a coordinate or currency code while preserving the original value. `to_h` exposes the named members, and generated `deconstruct` and `deconstruct_keys` methods let the object work directly with Ruby pattern matching.",
      "No writer is not the same as deep freezing. If a Data member holds `['new']`, the instance cannot point its `tags` member at a different array through `tags=`, but callers can still append to the original array. A robust value object accepts already immutable values, freezes a defensive copy during construction, or documents that contained objects remain shared. The right choice depends on ownership and performance needs.",
      "A block passed to `Data.define` can add behaviour. That is useful for operations derived entirely from the members, such as adding two coordinates or formatting a currency value. It should not quietly introduce setters that defeat the model. Input validation may live in a custom `initialize`, a factory, or a boundary before construction, but the design should preserve the promise that a constructed value is complete.",
      "Data, Struct, and a hand-written class solve related but distinct problems. Struct offers concise record classes and can expose writable members. Data emphasizes fixed value state. A normal class can hide its representation, accept partial construction, enforce transitions, or use identity-based persistence. Selecting among them starts with the domain contract, not with which option saves the most lines.",
    ],
    visualType: "comparison_table",
    visualTitle: "Choose the object form from its state contract",
    visual: [
      "| Need | `Data.define` | `Struct.new` | Regular class |",
      "|---|---|---|---|",
      "| fixed required members | strong fit | configurable record | fully custom |",
      "| generated writers | no | usually yes | only when defined |",
      "| equality from members | yes | yes | define as needed |",
      "| copy with selected changes | `with` | custom approach | custom approach |",
      "| hidden state or lifecycle | limited fit | limited fit | strong fit |",
    ].join("\n"),
    codeTitle: "Model money as a value and create revisions with `with`",
    code: [
      "Money = Data.define(:cents, :currency) do",
      "  def format",
      "    \"#{currency} #{cents / 100.0}\"",
      "  end",
      "end",
      "",
      "price = Money.new(cents: 500, currency: 'INR')",
      "same_price = Money.new(500, 'INR')",
      "revised = price.with(cents: 650)",
      "",
      "puts(price == same_price) # true",
      "puts price.format          # INR 5.0",
      "puts revised.format        # INR 6.5",
      "p price.to_h               # { cents: 500, currency: 'INR' }",
    ],
    followups: [
      "Why can a Data instance still change indirectly through a mutable member?",
      "How does `with` differ from assigning through a setter?",
      "When is a regular class a better model than `Data.define`?",
    ],
  },
  "ruby-frozen-string-literals-basics": {
    answerSize: "standard",
    direct: "The magic comment `# frozen_string_literal: true` tells Ruby to allocate static string literals in that source file once at parse time and freeze them. A literal such as `\"ready\"` cannot then be changed with `<<`, `replace`, or another mutating method; Ruby raises `FrozenError`. The directive is per file and must appear in the first comment section, normally on the first line or after a shebang. It does not deeply freeze containers or every string made at runtime, and interpolated string literals are not frozen by this directive in Ruby 3.0 and later. Use `dup` or create a new string when mutation is intentional.",
    quick: [
      "The magic comment freezes static string literals in its own source file.",
      "Mutating a frozen literal raises `FrozenError`; non-mutating operations can return new strings.",
      "The directive belongs in the first comment section and does not affect other files.",
      "In Ruby 3.0+, interpolated string literals remain dynamic rather than frozen by it.",
      "Use `dup` or an explicitly created string when a writable buffer is required.",
    ],
    interview: [
      "- Ruby String objects are normally mutable. The file-level directive `# frozen_string_literal: true` changes how static string literals in that file are created: Ruby allocates them once at parse time and freezes them, allowing repeated occurrences to reuse an immutable object.",
      "- Mutation methods such as `<<`, `replace`, `upcase!`, or indexed assignment then raise `FrozenError` for those literals. Methods such as `upcase` or `+` can still return a different String. When code intentionally needs a buffer, `literal.dup` makes a mutable copy and documents that choice.",
      "- For example, with the directive enabled, `status = \"ready\"` is frozen and `status << \"!\"` fails. `message = status.dup; message << \"!\"` works because `message` is a separate object. This prevents a helper from unexpectedly changing a label shared elsewhere and can avoid repeated literal allocations.",
      "- The scope is precise. A magic comment affects only its file and must be in the first comment section, normally the first line or the line after a shebang. It is not a recursive freeze for arrays or hashes, and Ruby 3.0 or newer does not freeze dynamic interpolated literals through this directive.",
      "- I use the setting consistently and treat a mutation failure as a signal to decide ownership. If the text is a fixed value, avoid mutation; if the operation truly builds text, create a mutable string deliberately. That is clearer than scattering unconditional `dup` calls around every literal.",
    ],
    deepTitle: "The directive changes literal creation, not every String in memory",
    deep: [
      "A static string literal is text written directly in source code without runtime interpolation. With the directive enabled, Ruby creates that literal at parse time as a frozen object and can reuse it instead of allocating a fresh mutable object for each evaluation. Calling `frozen?` reveals the state. An attempt to change the same object fails because freezing is permanent for that object; it cannot later be unfrozen.",
      "Mutation and transformation must be distinguished. `label << '!'`, `label[0] = 'R'`, and `label.upcase!` try to alter `label` itself and therefore raise for a frozen literal. `label + '!'` and `label.upcase` normally return another String and leave the source alone. `dup` explicitly copies the object into a mutable String when an in-place API is genuinely useful.",
      "Placement and scope prevent surprising global behaviour. The magic directive is read from the first comment section of one file; a shebang may occupy the first line. Requiring that file from another source does not switch the caller's literal policy. Projects commonly enforce the comment consistently with a formatter or linter so developers do not need to guess the mode while reading each file.",
      "The word “literal” is an important boundary. A String returned from I/O, a network library, or `String.new` follows the creation API's own rules. Starting with Ruby 3.0, a dynamically interpolated literal such as `\"order-#{id}\"` is neither frozen nor reused merely because this directive is enabled. Code should inspect the specific object contract instead of assuming all strings are immutable.",
      "Freezing is also shallow. Freezing an array stops adding or replacing array entries, but does not automatically freeze String objects already inside it. Conversely, this string-literal directive freezes the literal strings but says nothing about a container built around them. Deeply immutable configuration requires deliberate construction of every nested object or a separate sharing policy.",
      "Memory savings are a possible outcome, not a reason to mutate blindly around the rule. Shared immutable literals avoid some duplicate allocations and make accidental modification visible. The design question remains ownership: constants and labels should usually stay unchanged, while builders and parsers may need writable buffers. Making that distinction explicit yields safer code even when the performance difference is small.",
    ],
    visualType: "flow_diagram",
    visualTitle: "Which strings the file directive changes",
    visual: fence("mermaid", [
      "flowchart TD",
      "  S[String object used in this file] --> L{static source literal?}",
      "  L -->|yes| M{magic comment enabled?}",
      "  M -->|yes| F[frozen and eligible for reuse]",
      "  M -->|no| U[mutable by default]",
      "  L -->|runtime or interpolated value| R[follow that creation path]",
      "  F --> C{need to modify text?}",
      "  C -->|no| Keep[reuse safely]",
      "  C -->|yes| D[make a deliberate mutable copy]",
    ]),
    codeTitle: "Keep the literal fixed and copy only the writable value",
    code: [
      "# frozen_string_literal: true",
      "",
      "status = 'ready'",
      "puts status.frozen? # true",
      "",
      "message = status.dup",
      "message << '!'",
      "puts message         # ready!",
      "puts status          # ready",
      "",
      "order_id = 42",
      "dynamic = \"order-#{order_id}\"",
      "puts dynamic.frozen? # false on Ruby 3.0+",
      "",
      "# status << '!' would raise FrozenError",
    ],
    followups: [
      "Why does `dup` allow mutation without changing the original literal?",
      "Which strings are outside the directive's scope?",
      "Why is freezing a container different from deep immutability?",
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
    if (!lesson) throw new Error(`${file}: no gold lesson for ${question.slug}`);
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
      metaDescription: `Learn ${question.question} with a direct answer, verified Ruby example, practical boundary, and focused follow-up questions.`,
    };
    curated += 1;
  }
  fs.writeFileSync(file, `${JSON.stringify(document, null, 2)}\n`);
}

const indexFile = path.join(domainRoot, "_index.json");
const index = JSON.parse(fs.readFileSync(indexFile, "utf8"));
const module = index.modules.find((entry) => entry.moduleSlug === "ruby-modern-features");
if (!module) throw new Error(`${indexFile}: missing ruby-modern-features`);
module.intro = "Modern Ruby interview questions should test whether a developer understands the contracts behind newer syntax, not whether they can list release notes. This module teaches structural pattern matching, concise block parameters, endless method definitions, Data value objects, and frozen string literals through small examples and explicit boundaries. Each lesson explains what the feature changes, what remains ordinary Ruby behaviour, where the shorthand improves clarity, and where a conventional class, method, block, or mutable string is safer.";
fs.writeFileSync(indexFile, `${JSON.stringify(index, null, 2)}\n`);

if (curated !== Object.keys(lessons).length) {
  throw new Error(`curated ${curated}/${Object.keys(lessons).length} modern Ruby lessons`);
}

console.log(`Curated ${curated} canonical modern Ruby questions.`);
