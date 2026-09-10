#!/usr/bin/env node

import fs from "node:fs";
import path from "node:path";

const root = "content/ruby-backend-fresher/error-handling-basics";
const fence = (language, lines) => `\`\`\`${language}\n${lines.join("\n")}\n\`\`\``;

const migrations = [
  {
    source: "exception-hierarchy-basics",
    target: "begin-rescue-ensure",
    slug: "ruby-exception-hierarchy-basics",
  },
  {
    source: "raise-and-custom-exceptions",
    target: "custom-exceptions",
    slug: "ruby-raise-and-custom-exceptions-basics",
  },
];

for (const migration of migrations) {
  const sourceFile = path.join(root, migration.source, "complete-qa.json");
  const targetFile = path.join(root, migration.target, "complete-qa.json");
  if (!fs.existsSync(sourceFile)) continue;

  const source = JSON.parse(fs.readFileSync(sourceFile, "utf8"));
  const target = JSON.parse(fs.readFileSync(targetFile, "utf8"));
  const sourceQuestion = source.questions?.find((question) => question.slug === migration.slug);
  if (!sourceQuestion) throw new Error(`${sourceFile}: missing ${migration.slug}`);

  if (!target.questions.some((question) => question.slug === migration.slug)) {
    target.questions.push(sourceQuestion);
    fs.writeFileSync(targetFile, `${JSON.stringify(target, null, 2)}\n`);
  }
}

const lessons = {
  "ruby-begin-rescue-ensure-basics": {
    answerSize: "compact",
    direct: "Ruby uses `begin` to mark code that may fail, `rescue` to handle named exception classes, and `ensure` for cleanup that must run whether the work succeeds or raises. Ruby checks matching `rescue` clauses from top to bottom; if none matches, the exception continues to the caller. A rescue with no class handles `StandardError` descendants, so production code should usually name the narrow errors it can actually recover from.",
    quick: [
      "`begin` contains the operation that may raise an exception.",
      "`rescue SomeError => error` handles that class and its subclasses.",
      "Ruby tests rescue clauses from top to bottom, so specific handlers come first.",
      "`ensure` runs on success and failure, which makes it suitable for cleanup.",
      "Do not rescue `Exception`; let shutdown, interrupt, and fatal errors propagate.",
    ],
    interview: [
      "- `begin`, `rescue`, and `ensure` describe Ruby's exception path. The code inside `begin` runs normally. If it raises, Ruby skips the remaining statements in that block and looks for the first `rescue` whose class matches the exception.",
      "- A rescue clause can capture the object, such as `rescue JSON::ParserError => error`, so the handler can log useful context or return a deliberate fallback. Several rescue clauses can handle different failures, and the more specific classes should appear before broader parents.",
      "- For example, a configuration loader may return default settings when the file is missing but re-raise malformed JSON because silently accepting damaged configuration would be unsafe. That makes recovery depend on what the failure means, not merely on the fact that an error occurred.",
      "- `ensure` runs after either the successful path or the rescued or unrescued failure path. It is appropriate for releasing a resource acquired before the error, although block-based APIs such as `File.open { ... }` are usually simpler when Ruby already provides them.",
      "- A rescue without a class means `StandardError`, not every Ruby exception. The safe conclusion is to rescue only errors this layer can resolve, preserve useful context, and allow unexpected failures to travel upward.",
    ],
    deepTitle: "What Ruby does after an exception is raised",
    deep: [
      "An exception changes control flow immediately. Ruby stops the current expression, unwinds method calls, and searches outward for a matching handler. Statements after the failing line do not run. A handler in the same `begin` block gets the first opportunity; otherwise the caller's handler may receive the exception.",
      "Matching is based on the exception class hierarchy. `rescue Errno::ENOENT` also handles subclasses of that class. With several clauses, Ruby selects the first match, which is why a broad `rescue StandardError` placed first would make later specific clauses unreachable in practice.",
      "An optional `else` clause runs only when the protected body finishes without an exception. It can keep success-only work out of `begin`, reducing the chance that the rescue accidentally catches an error raised by that later work. `ensure` is different: it runs for both outcomes and then Ruby continues with the chosen return value or propagating exception.",
      "Handling an exception means taking responsibility for the resulting state. A handler may translate a low-level failure, return a documented fallback, or record context and re-raise. Logging and continuing without a valid result often creates a second, harder-to-diagnose failure later.",
    ],
    visualType: "flow_diagram",
    visualTitle: "Success, handled failure, and cleanup",
    visual: fence("mermaid", [
      "flowchart TD",
      "  B[run begin body] --> D{did an exception occur?}",
      "  D -->|no| S[optional else / success result]",
      "  D -->|yes| M{first rescue class that matches?}",
      "  M -->|yes| H[run that handler]",
      "  M -->|no| P[keep exception for caller]",
      "  S --> E[run ensure]",
      "  H --> E",
      "  P --> E",
      "  E --> O[return result or propagate exception]",
    ]),
    codeTitle: "Recover only from the failure you understand",
    code: [
      "def load_port(path)",
      "  file = nil",
      "",
      "  begin",
      "    file = File.open(path)",
      "    Integer(file.read.strip)",
      "  rescue Errno::ENOENT",
      "    3000                         # documented fallback",
      "  rescue ArgumentError => error",
      "    warn \"invalid port in #{path}: #{error.message}\"",
      "    raise                        # preserve the original failure",
      "  ensure",
      "    file&.close                  # runs on every path",
      "  end",
      "end",
    ],
    followups: [
      "What does a bare `rescue` catch in Ruby?",
      "When is `ensure` useful, and when is a block-based resource API simpler?",
      "How does Ruby choose between multiple rescue clauses?",
    ],
  },
  "ruby-exception-hierarchy-basics": {
    answerSize: "compact",
    direct: "Ruby exceptions form a class hierarchy rooted at `Exception`. Most application failures inherit from `StandardError`, including `RuntimeError`, `ArgumentError`, and `NoMethodError`; a rescue with no class catches this branch. Process-control and serious runtime conditions such as `SystemExit`, `Interrupt`, and `NoMemoryError` sit outside `StandardError`, so normal application code should not catch the `Exception` root.",
    quick: [
      "`Exception` is the root of Ruby's exception hierarchy.",
      "`StandardError` is the parent branch for ordinary application errors.",
      "A bare `rescue` is equivalent to rescuing `StandardError`.",
      "Rescue clauses match the named class and its descendants.",
      "Catch the narrowest recoverable class; do not normally rescue `Exception`.",
    ],
    interview: [
      "- Ruby represents each failure as an object whose class belongs to the exception hierarchy. `Exception` is the root, while `StandardError` is the branch intended for the ordinary problems application code may handle.",
      "- Familiar classes beneath `StandardError` include `ArgumentError`, `RuntimeError`, `NameError`, `NoMethodError`, and many library-specific errors. Writing `rescue` without a class is shorthand for `rescue StandardError`, so it does not catch every possible exception.",
      "- For example, a parser can rescue `JSON::ParserError` and turn invalid input into a validation response. Because matching includes subclasses, a handler for a parent error also receives its more specific child errors; that is useful at a boundary but too broad inside focused business logic.",
      "- `SystemExit`, `Interrupt`, `ScriptError`, and `NoMemoryError` are outside the `StandardError` branch. Rescuing the root `Exception` can therefore stop a process from shutting down or hide a condition the application cannot safely repair.",
      "- The hierarchy supports precise recovery: handle the smallest class whose meaning is understood, order specific rescue clauses before general ones, and let unknown or fatal failures propagate.",
    ],
    deepTitle: "The hierarchy defines which handler is eligible",
    deep: [
      "A rescue clause uses the same ancestry idea as `is_a?`. If an exception object is an instance of the listed class or one of its descendants, the clause can handle it. This allows a library to publish a parent error for broad boundary handling while still offering subclasses for precise cases.",
      "`StandardError` is a deliberate safety boundary. Most mistakes in normal input, method calls, files, networks, and application rules live below it. Ruby's default rescue stays on this branch so common error handling does not accidentally consume signals or exit requests.",
      "The order of clauses narrows behaviour. A `JSON::ParserError` handler can produce an invalid-document response, while a later `StandardError` handler at a top-level job boundary can record an unexpected job failure. Reversing those clauses would make the specialised response impossible because the parent matches first.",
      "Hierarchy alone does not decide what should be caught. The current layer must be able to restore a valid state, translate the failure for its caller, or add context before re-raising. A class being catchable is not evidence that continuing is safe.",
    ],
    visualType: "concept_map",
    visualTitle: "The safe rescue boundary",
    visual: fence("mermaid", [
      "flowchart TD",
      "  E[Exception] --> S[StandardError]",
      "  E --> X[SystemExit]",
      "  E --> G[SignalException]",
      "  G --> I[Interrupt]",
      "  E --> N[NoMemoryError]",
      "  S --> R[RuntimeError]",
      "  S --> A[ArgumentError]",
      "  S --> M[NameError]",
      "  M --> NM[NoMethodError]",
      "  S -. bare rescue catches this branch .-> R",
    ]),
    codeTitle: "Put the narrow handler before its parent",
    code: [
      "require 'json'",
      "",
      "def parse_preferences(text)",
      "  JSON.parse(text)",
      "rescue JSON::ParserError => error",
      "  { 'error' => \"invalid JSON: #{error.message}\" }",
      "rescue StandardError => error",
      "  warn \"unexpected parser failure: #{error.class}\"",
      "  raise",
      "end",
      "",
      "parse_preferences('{bad json}')",
      "# => {\"error\"=>\"invalid JSON: ...\"}",
    ],
    followups: [
      "Why does a bare rescue catch `StandardError` but not `Exception`?",
      "Why must a specific rescue clause appear before its parent class?",
      "When is a boundary-level `StandardError` rescue reasonable?",
    ],
  },
  "ruby-custom-exceptions-basics": {
    answerSize: "compact",
    direct: "A custom Ruby exception is a class that normally inherits from `StandardError` and gives a domain failure a stable, meaningful type. Define it like any class, optionally store structured context, and raise an instance where the rule is violated. Callers can then rescue that precise error without accidentally swallowing unrelated programming or infrastructure failures.",
    quick: [
      "Custom application errors normally inherit from `StandardError`.",
      "The class name should describe the failed domain rule or operation.",
      "Call `super(message)` when a custom initializer accepts its own fields.",
      "Raise the custom error at the layer that detects the rule violation.",
      "Rescue it only where the program can translate, recover, or add context.",
    ],
    interview: [
      "- A custom exception turns a meaningful application failure into its own Ruby type. It normally subclasses `StandardError`, which keeps it inside the branch caught by ordinary application rescue clauses.",
      "- For example, an account can raise `InsufficientFundsError` when a withdrawal would make the balance negative. A controller or job can rescue exactly that class and return a business-friendly response, while database and programming errors continue upward instead of being mistaken for a balance problem.",
      "- The class may be empty when its name carries enough meaning. If the handler needs structured context, its initializer can store fields such as `available` and `requested`, then call `super` with a readable message so standard logging still works.",
      "- The boundary is granularity. A separate class is valuable when callers react differently, the failure crosses layers, or the domain meaning deserves a stable contract. Creating a new exception for every tiny branch adds names without improving recovery.",
      "- A useful custom exception therefore identifies a specific recoverable condition, preserves relevant data, and lets handlers stay narrow rather than relying on message-string comparisons.",
    ],
    deepTitle: "An error class is a contract between layers",
    deep: [
      "A message explains a failure to a human; a class lets code identify it reliably. Testing whether `error.message` contains a phrase is fragile because wording changes and translations break the condition. Rescuing `InsufficientFundsError` expresses the intended contract directly.",
      "The raising layer should own the meaning. A repository may raise a storage-specific error, while a payment service can translate it into a domain error only when that translation is truthful. The receiving layer then decides whether to show validation feedback, retry, cancel work, or let the error propagate.",
      "Structured attributes keep machine-relevant facts separate from prose. A handler can read `error.available` and `error.requested` without parsing the display message. Calling `super(message)` still initializes the standard exception message and preserves normal `message`, logging, and backtrace behaviour.",
      "Inheritance can group related conditions: several payment errors may inherit from `PaymentError`, allowing a boundary to catch the family while inner code catches one subtype. Keep the tree shallow and based on handling behaviour, not an attempt to model every noun in the application.",
    ],
    visualType: "flow_diagram",
    visualTitle: "From violated rule to precise recovery",
    visual: fence("mermaid", [
      "flowchart LR",
      "  R[Account detects invalid withdrawal] --> E[raise InsufficientFundsError]",
      "  E --> S[service does not hide it]",
      "  S --> C[controller rescues that exact type]",
      "  C --> V[return a clear validation response]",
      "  O[other exceptions] --> P[propagate to error boundary]",
    ]),
    codeTitle: "Carry useful facts without parsing the message",
    code: [
      "class InsufficientFundsError < StandardError",
      "  attr_reader :available, :requested",
      "",
      "  def initialize(available:, requested:)",
      "    @available = available",
      "    @requested = requested",
      "    super(\"requested #{requested}, available #{available}\")",
      "  end",
      "end",
      "",
      "class Account",
      "  def initialize(balance)",
      "    @balance = balance",
      "  end",
      "",
      "  def withdraw(amount)",
      "    if amount > @balance",
      "      raise InsufficientFundsError.new(",
      "        available: @balance, requested: amount",
      "      )",
      "    end",
      "",
      "    @balance -= amount",
      "  end",
      "end",
    ],
    followups: [
      "Why should application exceptions usually inherit from `StandardError`?",
      "When should a custom exception contain structured attributes?",
      "Where should a low-level exception be translated into a domain exception?",
    ],
  },
  "ruby-raise-and-custom-exceptions-basics": {
    answerSize: "compact",
    direct: "Ruby's `raise` stops normal execution and sends an exception up the call stack. `raise \"message\"` creates a `RuntimeError`; `raise SomeError, \"message\"` creates the named error; and `raise error_object` sends an existing instance. Inside a rescue clause, bare `raise` re-raises the current exception with its original backtrace, which is the right choice when the handler cannot fully recover.",
    quick: [
      "`raise " + '"message"' + "` raises a `RuntimeError` with that message.",
      "`raise ErrorClass, " + '"message"' + "` raises a chosen exception type.",
      "`raise error_instance` preserves data stored on that object.",
      "Bare `raise` inside `rescue` re-raises the current exception.",
      "Raise for exceptional failure, not for an ordinary branch or loop exit.",
    ],
    interview: [
      "- `raise` reports that the current operation cannot complete normally. Ruby creates or accepts an exception object, stops the remaining statements in the current path, and searches up the call stack for a matching rescue clause.",
      "- The short form `raise 'invalid quantity'` produces a `RuntimeError`. When callers need to distinguish the condition, use a specific class such as `raise ArgumentError, 'quantity must be positive'` or raise an already constructed exception instance that carries extra fields.",
      "- For example, an order method can raise `ArgumentError` before changing state when the quantity is zero. The API boundary may translate that known input error into a 422 response, while an unrelated database failure is left for the application's general error handling.",
      "- Inside a rescue block, bare `raise` sends the currently handled exception onward and keeps its original backtrace. This is useful after adding context or metrics; creating a brand-new exception carelessly can hide the location where the real failure began.",
      "- Exceptions should describe exceptional inability to fulfil a contract. Expected alternatives such as 'item not found' in a search may be clearer as `nil` or a result object unless the surrounding API defines absence as an error.",
    ],
    deepTitle: "Raising transfers control, not just a message",
    deep: [
      "The important effect of `raise` is control transfer. Ruby does not return a special error value and it does not run the next line. It starts unwinding frames until a compatible rescue is found, while `ensure` clauses encountered along the way still run.",
      "The chosen class communicates category; the message supplies instance detail. `ArgumentError` says a caller broke an argument contract. A domain class can say a business rule failed. Using `RuntimeError` for every condition forces handlers to inspect prose and makes unrelated failures look identical.",
      "Re-raising is different from wrapping. Bare `raise` in a handler preserves the same object and backtrace. Raising a new higher-level exception may be appropriate at an abstraction boundary, but the original error should remain available through logging or an explicit cause so diagnosis does not lose its starting point.",
      "An exception is costly mainly in clarity when used as routine branching. Methods should document whether absence, validation failure, and external failure arrive as values or exceptions. Consistent contracts let callers handle each outcome without broad rescue blocks.",
    ],
    visualType: "comparison_table",
    visualTitle: "Choose the form that preserves meaning",
    visual: "| Form | Exception object | Use |\n|---|---|---|\n| `raise \"bad value\"` | New `RuntimeError` | Simple internal failure with no useful category |\n| `raise ArgumentError, \"bad value\"` | New named error | A recognised error category |\n| `raise error` | Existing object | Preserve structured fields on an instance |\n| bare `raise` in `rescue` | Current exception | Propagate the original object and backtrace |",
    codeTitle: "Validate before state changes, then re-raise unknown failures",
    code: [
      "class Order",
      "  attr_reader :items",
      "",
      "  def initialize",
      "    @items = []",
      "  end",
      "",
      "  def add(product, quantity)",
      "    @items << [product, quantity]",
      "  end",
      "end",
      "",
      "def add_item(order, product, quantity)",
      "  raise ArgumentError, 'quantity must be positive' unless quantity.positive?",
      "",
      "  order.add(product, quantity)",
      "rescue ArgumentError",
      "  raise                          # same object and backtrace",
      "end",
      "",
      "# A caller can rescue the known contract failure:",
      "order = Order.new",
      "begin",
      "  add_item(order, 'book', 0)",
      "rescue ArgumentError => error",
      "  puts error.message             # => quantity must be positive",
      "end",
    ],
    followups: [
      "What is the difference between `raise`, `raise ErrorClass`, and `raise error`?",
      "What does bare `raise` do inside a rescue block?",
      "When is returning `nil` clearer than raising an exception?",
    ],
  },
  "ruby-retry-pattern-basics": {
    answerSize: "standard",
    direct: "Ruby's `retry` can be used inside a `rescue` clause to run the associated `begin` body again from its start. A safe retry must be limited, target only transient failures, delay between attempts, and re-raise once the limit is reached. Because the whole operation repeats, it should also be idempotent—or protected by an idempotency key—so a partial first attempt cannot duplicate a payment, message, or write.",
    quick: [
      "`retry` inside `rescue` restarts the entire associated `begin` body.",
      "Retry transient failures such as timeouts, not invalid input or code bugs.",
      "Always cap attempts and re-raise after the final failure.",
      "Use backoff, often with jitter, rather than retrying immediately.",
      "Make repeated work idempotent or guard it with an idempotency key.",
    ],
    interview: [
      "- Ruby's `retry` is valid in a rescue clause and sends execution back to the start of the related `begin` block. It repeats every statement in that protected body, not only the line that raised, so state changed before the failure must be considered.",
      "- A retry is suitable when the same request may succeed later without changing its inputs: a short network timeout, a temporary connection reset, or a rate limit with a known wait. Invalid credentials, malformed data, and programming errors are permanent for that request and should fail immediately.",
      "- For example, a client may attempt a read up to three times for `Timeout::Error`. The rescue increments or checks the attempt count, waits longer before each new try, calls `retry` while attempts remain, and uses bare `raise` to return the final timeout to its caller.",
      "- The operation must also be safe to repeat. A read normally is; charging a card may not be. A timeout after the server accepted a charge leaves the client unsure of the outcome, so an idempotency key or server-side status check is required before sending the write again.",
      "- Production retries need a strict maximum, backoff, observable attempt data, and one narrow list of transient exceptions. They should not turn a real outage into an endless loop or multiply load on a failing dependency.",
    ],
    deepTitle: "A retry is a policy, not a rescue reflex",
    deep: [
      "A failure must be classified before it is retried. Transient means the environment may change between attempts even though the request stays valid. Permanent means the same request will predictably fail again. This classification is more important than the syntax because retrying a permanent error only adds delay and noise.",
      "Backoff gives the dependency time to recover and prevents every client from issuing another request at once. Exponential backoff increases the delay after consecutive failures; random jitter spreads clients that otherwise share the same schedule. The total attempts and elapsed time should still fit the caller's timeout budget.",
      "Repeating the whole `begin` block creates a transaction boundary. Any mutation before the failed step may happen twice. Reads and naturally idempotent updates are usually safe; payments, emails, inventory decrements, and job publication need a unique request key, a deduplication record, or a status check.",
      "The final failure remains meaningful. After the attempt limit, bare `raise` preserves the last exception and its backtrace for the caller. Metrics should record attempts and final outcome without logging the same stack trace at every layer.",
    ],
    visualType: "flow_diagram",
    visualTitle: "Bounded retry decision",
    visual: fence("mermaid", [
      "flowchart TD",
      "  A[attempt operation] --> R{success?}",
      "  R -->|yes| S[return result]",
      "  R -->|no| T{known transient error?}",
      "  T -->|no| F[raise immediately]",
      "  T -->|yes| L{attempts remain?}",
      "  L -->|no| F",
      "  L -->|yes| I{safe to repeat?}",
      "  I -->|no| F",
      "  I -->|yes| W[wait with backoff and jitter]",
      "  W --> A",
    ]),
    codeTitle: "Retry only a bounded transient failure",
    code: [
      "require 'timeout'",
      "",
      "def fetch_with_retry(client, max_attempts: 3)",
      "  attempts = 0",
      "",
      "  begin",
      "    attempts += 1",
      "    client.fetch",
      "  rescue Timeout::Error, Errno::ECONNRESET => error",
      "    raise if attempts >= max_attempts",
      "",
      "    delay = 0.25 * (2 ** (attempts - 1))",
      "    warn \"#{error.class}; retrying in #{delay}s\"",
      "    sleep(delay)",
      "    retry",
      "  end",
      "end",
    ],
    followups: [
      "What part of the code does Ruby run again after `retry`?",
      "Which failures are transient, and which should fail immediately?",
      "Why does retrying a write require idempotency protection?",
    ],
  },
};

const canonicalDirectories = ["begin-rescue-ensure", "custom-exceptions", "retry-pattern"];
let curated = 0;

for (const directory of canonicalDirectories) {
  const file = path.join(root, directory, "complete-qa.json");
  const document = JSON.parse(fs.readFileSync(file, "utf8"));
  if (!Array.isArray(document.questions)) throw new Error(`${file}: missing questions`);

  for (const [index, question] of document.questions.entries()) {
    const lesson = lessons[question.slug];
    if (!lesson) throw new Error(`${file}: no lesson for ${question.slug}`);

    question.direct_answer = lesson.direct;
    question.last_updated = "2026-09-07";
    question.reading_time_minutes = lesson.answerSize === "standard" ? 7 : 6;
    question.order = index + 1;
    question.answer = {
      ...(question.answer ?? {}),
      sections: [
        {
          type: "key_points",
          title: "Quick Revision",
          content: lesson.quick.map((point) => `- ${point}`).join("\n"),
        },
        {
          type: "speakable_answer",
          title: "Interview Answer",
          answerSize: lesson.answerSize,
          content: lesson.interview.map((paragraph) => paragraph.replace(/^[-*+]\s+/, "")).join("\n\n"),
        },
        {
          type: "deep_explanation",
          title: lesson.deepTitle,
          content: lesson.deep.join("\n\n"),
        },
        {
          type: lesson.visualType,
          title: lesson.visualTitle,
          content: lesson.visual,
        },
        {
          type: "code_example",
          title: lesson.codeTitle,
          content: fence("ruby", lesson.code),
        },
      ],
    };
    question.followup_questions = lesson.followups;
    curated += 1;
  }

  fs.writeFileSync(file, `${JSON.stringify(document, null, 2)}\n`);
}

if (curated !== Object.keys(lessons).length) {
  throw new Error(`curated ${curated}/${Object.keys(lessons).length} lessons`);
}

console.log(`Curated ${curated} canonical Ruby error-handling questions.`);
