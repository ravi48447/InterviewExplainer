#!/usr/bin/env node

import fs from "node:fs";
import path from "node:path";

const domainRoot = "content/ruby-backend-fresher";
const root = path.join(domainRoot, "ruby-debugging-tools");
const fence = (language, lines) => `\`\`\`${language}\n${lines.join("\n")}\n\`\`\``;

const lessons = {
  "ruby-byebug-and-pry-basics": {
    question: "How do you debug a Ruby program with Byebug or Pry?",
    title: "Debugging Ruby with Byebug and Pry",
    answerSize: "standard",
    direct: "Byebug pauses a running Ruby program and lets you inspect the current stack frame, set breakpoints, step into or over calls, and continue execution. Pry is an interactive Ruby console that can open at a specific binding, so `binding.pry` exposes the local variables and methods available at that line. The `pry-byebug` extension adds stepping and stack navigation to Pry. Put a breakpoint just before the value becomes wrong, reproduce the smallest failing case, inspect inputs before changing them, and remove temporary breakpoints before committing. On modern Rails, also know that the bundled `debug` gem is the current default debugger.",
    quick: [
      "Byebug controls execution; Pry explores Ruby objects and evaluates expressions in a binding.",
      "Place the breakpoint before the suspected state change, then reproduce the failure.",
      "Use `next` to stay in the frame, `step` to enter a call, and `continue` to resume.",
      "`pry-byebug` combines Pry's console with stepping and stack navigation.",
      "Do not leave breakpoints in shared or production code; modern Rails defaults to the `debug` gem.",
    ],
    interview: [
      "- Byebug is a source-level debugger for CRuby, while Pry is an interactive developer console. A Byebug stop gives execution controls and the current call stack. `binding.pry` opens a Ruby REPL at that exact binding, so local variables, instance variables, methods, and trial expressions can be inspected without adding many print statements.",
      "- I start from a reproducible symptom and put the stop immediately before the first suspicious transformation. At the prompt, I read the inputs rather than modifying them first. `next` executes the next line in the current frame, `step` enters a called method or block, `finish` runs until the current frame returns, and `continue` resumes until another breakpoint or program exit.",
      "- For example, if an invoice total becomes zero, I can stop before `discount.apply(subtotal)`, inspect `subtotal` and `discount`, step into `apply`, and compare the returned value with the method's contract. That tells me whether the bad value arrived from the caller or was created inside the discount code.",
      "- Pry is strongest for exploration: `ls` shows available state and `show-source` can display a method's implementation. The `pry-byebug` extension supplies stepping and frame commands inside that console. Plain Byebug is enough when execution control matters more than a rich REPL.",
      "- Debugging sessions can change in-memory state and hold a web request open, so I use them in development or controlled tests, never as a production repair technique. I remove temporary stops after the cause is understood and add a focused regression test. In current Rails applications I would also consider the bundled `debug` gem, whose `debugger` or `binding.break` entry points serve the same modern workflow.",
    ],
    deepTitle: "A useful breakpoint separates where a bad value arrived from where it changed",
    deep: [
      "Interactive debugging is most effective after the problem has a stable reproduction. A breakpoint placed at a random controller line exposes a great deal of state but no clear question. Instead, identify the last value known to be correct and stop just before the next operation. The session then tests a concrete hypothesis: whether the caller supplied bad input, the callee transformed it incorrectly, or a side effect changed shared state.",
      "At a stop, the debugger selects one stack frame. Expressions typed at the prompt are evaluated in that frame's context, so they can read locals and instance variables visible there. `next` advances without descending into ordinary calls; `step` follows a call into its implementation; `finish` returns to the caller; stack commands reveal how execution reached the point. Changing a variable can be useful for an experiment, but the observation should be repeated from a clean run before treating it as evidence.",
      "Pry focuses on understanding the runtime object model. `binding.pry` pauses within a particular lexical and object context, `ls` lists reachable methods and variables, and `show-source` finds Ruby method source when available. Adding `pry-byebug` supplies breakpoints, frame movement, and execution controls. Command names and aliases can differ by tool version, so `help` is safer than relying on a remembered single-letter alias.",
      "A Rails request paused in a terminal has not completed. The browser may appear to hang, database locks may remain open, and another request can observe partial conditions depending on transaction boundaries. That is acceptable in a local environment and dangerous in a shared one. Remote production debugging also exposes application data and execution control, so logs, traces, metrics, safe console procedures, or a reproduced test are the normal production tools.",
      "Current Rails-generated CRuby applications include the `debug` gem in development and test. It uses entry points such as `debugger` and `binding.break` and supports modern debugging features. Byebug and Pry remain common in existing projects, which is why a developer should understand their roles, but the project's Gemfile and runtime decide the actual tool rather than a tutorial's age.",
      "The outcome of a session should be durable knowledge. Once the first incorrect state transition is found, explain why the previous tests allowed it, implement the smallest repair, and add an example that fails without the fix. Delete the breakpoint and any secret-bearing scratch output. A debugger shortens investigation; it does not replace a specification or regression test.",
    ],
    visualType: "flow_diagram",
    visualTitle: "Move the breakpoint toward the first incorrect state",
    visual: fence("mermaid", [
      "flowchart LR",
      "  R[reproduce one failure] --> K[last known correct value]",
      "  K --> B[stop before next transformation]",
      "  B --> I[inspect inputs without changing them]",
      "  I --> Q{bad on entry?}",
      "  Q -->|yes| U[move up to caller frame]",
      "  Q -->|no| S[step through transformation]",
      "  U --> B",
      "  S --> C[first line that breaks the contract]",
      "  C --> T[fix and add regression test]",
    ]),
    codeTitle: "Stop before the calculation whose contract is in doubt",
    code: [
      "class Invoice",
      "  def initialize(subtotal, discount)",
      "    @subtotal = subtotal",
      "    @discount = discount",
      "  end",
      "",
      "  def total",
      "    # binding.pry # inspect @subtotal, then step into apply",
      "    @discount.apply(@subtotal)",
      "  end",
      "end",
      "",
      "# Byebug alternative in a configured project:",
      "# byebug",
      "# subtotal_after_discount = @discount.apply(@subtotal)",
    ],
    followups: [
      "What is the practical difference between `next`, `step`, and `finish`?",
      "Why should a breakpoint be placed before the suspected state change?",
      "Why is an interactive debugger unsafe as an ordinary production technique?",
    ],
  },
  "ruby-common-runtime-errors-basics": {
    question: "What common Ruby runtime errors should a beginner recognize?",
    title: "Common Ruby Runtime Errors",
    answerSize: "standard",
    direct: "Common Ruby runtime errors name the violated operation: `NoMethodError` means the receiver does not provide the called method, `NameError` means Ruby could not resolve a local variable or constant, `ArgumentError` usually means the arguments do not match the method contract, `TypeError` means an operation received an incompatible kind of object, and `KeyError` reports a required missing hash key. `ZeroDivisionError` covers integer division by zero, while application code often raises a specific `StandardError` subclass for domain failures. Read the exception class, message, and first relevant application frame together; do not hide the cause with a broad rescue or automatic safe navigation.",
    quick: [
      "`NoMethodError`: the receiver does not understand the method, often because it is `nil`.",
      "`NameError`: a local variable or constant could not be resolved in the current scope.",
      "`ArgumentError`: argument count, keyword, or value contract is invalid for the call.",
      "`TypeError`: the operation received an incompatible object type or conversion.",
      "`KeyError`: code requested a required hash key that is absent.",
      "Use the message and application frame to find the broken assumption before choosing a fix.",
    ],
    interview: [
      "- Ruby exceptions identify both a category and a concrete failure. `NoMethodError` means a method lookup failed for the receiver; the message shows the method and often inspects the receiver. `NameError` covers an unresolved variable or constant. Those two commonly point to a wrong object, missing value, typo, or load/scope problem.",
      "- `ArgumentError` indicates that a call does not meet its argument contract, such as a wrong count, an unknown keyword, or a rejected value raised deliberately by a method. `TypeError` appears when an operation cannot use the supplied kind of object, for example adding an Integer directly to a String. `KeyError` is useful when `hash.fetch(:token)` cannot find a required key.",
      "- Suppose `order.customer.email` raises `NoMethodError` for `nil`. The final method name is not necessarily the cause; either `order.customer` is legitimately optional or the association was expected and missing. I inspect the receiver at the failing frame and trace where that `nil` entered the path before adding any guard.",
      "- Safe navigation, defaults, conversions, and rescue clauses express different contracts. `customer&.email` is correct only when absence is valid. `fetch` is better when a key is required because it fails near the boundary. Converting every value with `to_s` can hide invalid data rather than repair it.",
      "- I normally rescue a specific recoverable exception at the layer that can make a meaningful decision. Programming mistakes should remain visible, with the original backtrace preserved. A custom subclass of `StandardError` gives an application failure a clear name and lets callers handle it without swallowing unrelated defects.",
    ],
    deepTitle: "The exception class narrows the search; the failed receiver reveals the assumption",
    deep: [
      "Ruby raises an exception when execution cannot continue under the operation's contract. The class groups similar failures, the message supplies instance-specific details, and the backtrace records the active call chain. Diagnosing only from the class is too broad: two `NoMethodError` instances can come from a nil association, a typo, a private method call, or an object of an unexpected class.",
      "Method and name failures are related but distinct. `NoMethodError` is raised after Ruby has a receiver but cannot complete the method call in that context. `NameError` is raised when a name such as a constant cannot be found through its lookup rules. A missing Rails constant may be a naming or autoload-path problem, while an undefined local can simply be a branch that never assigned it.",
      "Argument errors describe the call boundary. Ruby checks positional and keyword requirements before entering many methods, producing details about given and expected arguments. A method can also raise `ArgumentError` for a value whose form is unacceptable. `TypeError` is reserved for incompatible object types or conversions; application validation should not depend on forcing every bad user input into that built-in category.",
      "Collection access communicates optionality. `hash[:role]` returns nil when the key is missing, which is suitable for optional data but can defer the failure. `hash.fetch(:role)` raises `KeyError` at the missing requirement. An array's ordinary index access returns nil outside its range, while `array.fetch(index)` raises `IndexError`. Choosing the strict form can move a bug closer to the boundary that violated the expectation.",
      "The repair should match the domain rule. If a customer may be absent, model and display that state. If every paid order must have a customer, validate or constrain it when the order enters that state. Adding `&.` everywhere turns both situations into nil and makes corrupted required data harder to notice. Broad `rescue StandardError` has a similar masking effect unless the layer records and re-raises or converts a known failure deliberately.",
      "Custom exceptions make recovery boundaries readable. A payment adapter might translate one provider timeout into `PaymentUnavailable`, preserving the original cause, because the caller can schedule a retry. It should not translate a `NoMethodError` from its own bug into the same recoverable outcome. Specific categories, helpful messages without secrets, and intact backtraces give tests and operators evidence rather than generic failure text.",
    ],
    visualType: "comparison_table",
    visualTitle: "Read each error as a failed contract",
    visual: [
      "| Exception | Contract that failed | First thing to inspect |",
      "|---|---|---|",
      "| `NoMethodError` | receiver cannot use the method | receiver value and class |",
      "| `NameError` | name lookup found no variable or constant | spelling, scope, load path |",
      "| `ArgumentError` | call arguments are not accepted | signature and call site |",
      "| `TypeError` | object cannot participate in the operation | input type and conversion boundary |",
      "| `KeyError` / `IndexError` | required collection entry is absent | key/index and input shape |",
      "| `ZeroDivisionError` | integer divisor is zero | validation and mathematical case |",
    ].join("\n"),
    codeTitle: "Use strict access when the input contract requires a key",
    code: [
      "def recipient_email(payload)",
      "  customer = payload.fetch(:customer) # KeyError if required data is absent",
      "  email = customer.fetch(:email)",
      "  raise ArgumentError, 'email must be a String' unless email.is_a?(String)",
      "",
      "  email",
      "end",
      "",
      "puts recipient_email(customer: { email: 'ada@example.com' })",
      "",
      "# Safe navigation is different: use it only when absence is valid.",
      "optional_email = { customer: nil }[:customer]&.fetch(:email)",
      "p optional_email # nil",
    ],
    followups: [
      "When is safe navigation a correct fix for `NoMethodError` on nil?",
      "Why can `fetch` reveal a data-contract bug earlier than `[]`?",
      "Why should a recoverable custom error inherit from `StandardError`?",
    ],
  },
  "rails-console-tricks-basics": {
    question: "How can the Rails console help you inspect and test an application?",
    title: "Using the Rails Console Safely",
    answerSize: "standard",
    direct: "`bin/rails console` boots the Rails application in an interactive Ruby session, giving access to models, configuration, route helpers, and application code. Use it to reproduce a query, inspect a record, call a method with known inputs, view a relation's SQL or query plan, and make local application requests through `app`. `helper` exposes view helpers and `reload!` reloads application code. Console commands can change real data in the selected environment; `--sandbox` rolls database work back on exit but is not a universal safety shield for external calls or every database behaviour. Confirm the environment and prefer read-only inspection before mutation.",
    quick: [
      "`bin/rails console` loads the chosen Rails environment into an interactive session.",
      "Inspect models and relations; use `to_sql` or `explain` to understand a query.",
      "Use `app` for route helpers and local requests, and `helper` for view helpers.",
      "`reload!` reloads application code, but existing object instances may still represent old classes.",
      "`--sandbox` rolls back database changes on exit; it does not undo emails, APIs, files, or jobs.",
      "Verify the environment and record IDs before any write, especially in production.",
    ],
    interview: [
      "- The Rails console is an interactive Ruby shell with the application environment loaded. Models, services, routes, configuration, and database connections behave much like they do in the running application, so it is useful for answering a focused question without building a temporary controller or page.",
      "- I use it to inspect one record, reproduce a scope, call a pure method with controlled data, and examine lazy Active Record relations. `to_sql` shows generated SQL without running the relation. `explain` asks the database for a query plan, although some eager-loading cases may execute prerequisite queries, so it is not automatically harmless.",
      "- For example, I can run `relation = Order.where(status: :pending).where('created_at < ?', 2.days.ago)`, inspect `relation.to_sql`, call `relation.limit(5).pluck(:id)`, and then review `relation.explain`. That separates a query-shape problem from rendering or request code.",
      "- The built-in `app` object exposes named routes and can make application requests, while `helper` exposes view helpers. `reload!` loads changed application code, but objects created before reloading may still be instances of an older class definition, so I recreate them before comparing behaviour.",
      "- Safety depends on the selected environment and side effects. `bin/rails console --sandbox` wraps database work in a transaction that rolls back when the session exits, but it cannot recall an email, external API call, file write, or enqueued job. In production I begin read-only, double-check the target, keep an audit trail, and prefer a reviewed script for repeated or high-impact changes.",
    ],
    deepTitle: "A console session is application code with immediate feedback and real authority",
    deep: [
      "Starting `bin/rails console` boots a complete Rails environment and opens an IRB-style prompt. The environment flag selects development, test, staging, or production configuration, including that environment's database and credentials. This power makes the console a direct observation tool and also means a casual `update!` can change real application state.",
      "Active Record relations are especially useful to explore because they are lazy. Building `User.where(active: true)` does not necessarily fetch rows immediately. `to_sql` displays the query string, `limit` constrains accidental result size, and `pluck` selects specific columns. `explain` obtains a database-specific plan; options and output differ across adapters, and eager loading can require executing preliminary queries before all plans are available.",
      "Rails adds two convenient objects. `app` exposes route helpers and the integration-session request interface, allowing a local `get` followed by inspection of `app.response`. `helper` makes view helpers available without rendering a template. These calls still exercise application behaviour, so authentication state, host configuration, database writes, and callbacks should be considered rather than treating them as mock requests.",
      "`reload!` is useful after editing application files. It refreshes reloadable constants, but an object instantiated before the reload belongs to the earlier class object. Calling methods on that stale instance can produce confusing results. Re-query or reconstruct the object after reload, and restart the console for changes that the reloader does not manage, such as some initializers or dependency configuration.",
      "Sandbox mode opens a database transaction and rolls it back on exit. It is helpful for local experiments with model persistence, but the transaction may hold locks and it cannot reverse work outside that database connection. A callback that sends a network request or writes to object storage has already crossed the rollback boundary. Background work may also run in another process and connection.",
      "Production console access needs a written operational habit: identify the incident or change, confirm environment and tenant, start with queries, constrain row counts, capture intended IDs, and use a transaction or idempotent reviewed script for modification. Verify the result through an independent query and record what ran. The console is excellent for discovery; a repeatable repair belongs in code with tests and review.",
    ],
    visualType: "flow_diagram",
    visualTitle: "Increase console authority only after narrowing the target",
    visual: fence("mermaid", [
      "flowchart LR",
      "  E[confirm environment] --> Q[read-only constrained query]",
      "  Q --> S[inspect SQL, plan, or method result]",
      "  S --> W{write required?}",
      "  W -->|no| D[document finding and exit]",
      "  W -->|yes| X[identify exact records and side effects]",
      "  X --> R[prefer reviewed transaction or script]",
      "  R --> V[verify with independent query]",
      "  X --> O[external effects cannot be sandbox-rolled back]",
    ]),
    codeTitle: "Inspect a slow relation before loading a bounded sample",
    code: [
      "# Inside bin/rails console",
      "relation = Order.where(status: :pending)",
      "                .where('created_at < ?', 2.days.ago)",
      "",
      "puts relation.to_sql",
      "puts relation.explain",
      "p relation.limit(5).pluck(:id, :created_at)",
      "",
      "app.get app.orders_path, headers: { 'Host' => 'localhost' }",
      "p app.response.status",
      "",
      "helper.number_to_currency(1250) # view-helper output",
      "reload! # recreate records after reloading class definitions",
    ],
    followups: [
      "Which side effects can escape a Rails console sandbox rollback?",
      "Why should an old model instance be recreated after `reload!`?",
      "What is the difference between inspecting `to_sql` and running `explain`?",
    ],
  },
  "ruby-reading-stack-traces-basics": {
    question: "How do you read a Ruby exception message and backtrace?",
    title: "Reading Ruby Exceptions and Backtraces",
    answerSize: "standard",
    direct: "Read a Ruby failure as three linked clues: the exception class says what contract failed, the message supplies the concrete receiver or input, and the backtrace shows the active calls. In `Exception#backtrace`, the first entry is normally the location where the exception was raised, followed by its callers. Start with that first frame and message, then find the earliest relevant frame in your application code—not simply the first line containing `app/`. Read outward until you see where the wrong value entered the call chain. Framework and gem frames are useful when they define the violated API; preserve the original backtrace when translating or re-raising an error.",
    quick: [
      "Read the exception class and full message before scanning frames.",
      "Ruby's backtrace array normally starts at the raise location, then lists callers.",
      "Open the first relevant application `file:line:in method` and inspect its inputs.",
      "Follow caller frames outward to learn where the bad state entered the path.",
      "Do not discard framework frames blindly or replace the original backtrace with a new error.",
    ],
    interview: [
      "- A Ruby exception report combines a class, a message, and a backtrace. The class narrows the category, the message describes this failure, and every frame identifies a file, line, and method in the active call chain. `Exception#backtrace` normally puts the raise location first and the callers after it.",
      "- I first read the message literally. In `undefined method 'email' for nil`, the attempted method is `email` and the receiver is nil. I then open the first frame that can explain that receiver, inspect the source at the recorded revision, and look at arguments and local state for that call.",
      "- For example, if `invoice.rb:18 in total` is followed by `checkout.rb:42 in complete`, the first line shows where calculation failed; the checkout frame shows who supplied the invoice. If the invoice's tax object is nil, moving outward may reveal that one checkout branch skipped the constructor validation.",
      "- I filter noise carefully. Framework and gem frames can be skipped while locating owned code, but they matter when an application passes an unsupported argument or calls an API incorrectly. Async jobs, callbacks, metaprogramming, and wrapped exceptions may require reading more than the first application-looking line.",
      "- After forming a hypothesis, I reproduce it with the same inputs and add targeted state or a breakpoint. When translating a low-level exception into a domain error, I preserve the original cause and backtrace. The goal is the first broken assumption, not merely the final line where Ruby could no longer continue.",
    ],
    deepTitle: "A backtrace is ordered evidence about one unfinished call chain",
    deep: [
      "When an exception is raised, Ruby records the methods that have been called and not yet returned. `backtrace` exposes those locations as strings; `backtrace_locations` provides structured location objects. Unless application code replaces it, the first element identifies the raise point and later elements walk toward older callers. Some log formatters can display a trace differently, so labels and ordering should be checked rather than relying only on screen position.",
      "The exception message often names the closest failed operation. A `NoMethodError` can show the receiver, an `ArgumentError` can compare given and expected arguments, and a database exception can include adapter detail. Messages may contain user data or SQL, so they are evidence to handle securely. The class and message together are more useful than searching for a familiar phrase alone.",
      "The top relevant frame is not always the root cause. A formatter may raise because it received nil, while the invalid nil was produced five calls earlier. Read outward through callers until a boundary should have validated or transformed that value. Constructor calls, request parsing, deserialization, job arguments, and callback entry points are common places where an assumption becomes application state.",
      "Library frames describe contracts. If Active Record raises from deep inside persistence after receiving an unsupported type, the application frame that passed the value is actionable, but the library frame explains the check. Hiding every path outside `app/` can remove this context. Conversely, reading hundreds of internal frames before checking the failing application input wastes time; move between owned and library frames according to the hypothesis.",
      "Deployed source must match the trace. A line number from an older release may point at different code in the current checkout. Use commit or build metadata, source maps where relevant, job version, and request correlation to reconstruct the executed version. Wrapped exceptions should retain `cause`, because the outer domain error explains the operation while the inner exception explains the mechanism.",
      "A trace is a starting point for verification. Recreate the smallest input, inspect the value immediately before the failing call, and prove which earlier branch supplied it. Then fix the contract at the right boundary and write a regression example. Rescuing near the final frame only to continue with incomplete state converts a visible error into a harder downstream problem.",
    ],
    visualType: "flow_diagram",
    visualTitle: "Read from the raise point toward the missing guarantee",
    visual: fence("mermaid", [
      "flowchart TD",
      "  M[exception class and message] --> F0[frame 0: location raised]",
      "  F0 --> F1[caller: supplied immediate input]",
      "  F1 --> F2[older caller: created or accepted state]",
      "  F2 --> B{which boundary promised validity?}",
      "  B --> H[hypothesis about broken assumption]",
      "  H --> R[reproduce with same input]",
      "  R --> T[repair boundary and add regression test]",
    ]),
    codeTitle: "Capture the message and ordered frames without replacing them",
    code: [
      "def recipient(payload)",
      "  payload.fetch(:customer).fetch(:email)",
      "end",
      "",
      "begin",
      "  recipient(customer: {})",
      "rescue KeyError => error",
      "  puts \"#{error.class}: #{error.message}\"",
      "  puts \"raised at: #{error.backtrace.first}\"",
      "  puts \"caller: #{error.backtrace[1]}\"",
      "  raise # keeps the same exception and its original backtrace",
      "end",
    ],
    followups: [
      "Why can the first application frame still be only the symptom location?",
      "When should framework or gem frames remain part of the investigation?",
      "How can re-raising incorrectly destroy useful backtrace evidence?",
    ],
  },
  "ruby-rubocop-basics": {
    question: "What does RuboCop check, and how should a team use it?",
    title: "Using RuboCop as a Team",
    answerSize: "standard",
    direct: "RuboCop statically inspects Ruby source with configurable rules called cops. Departments such as Lint, Layout, Style, Naming, and Metrics report possible bugs, formatting differences, naming issues, and complexity signals with a file, line, and cop name. Project settings live in `.rubocop.yml`, and the target Ruby version must match the oldest syntax the code supports. Run `bundle exec rubocop` locally and in CI; `-a` applies corrections marked safe, while `-A` also enables corrections RuboCop marks unsafe. Review every generated diff, adopt new cops deliberately, and use narrow documented exceptions instead of disabling a rule across the whole project without reason.",
    quick: [
      "RuboCop runs configurable static-analysis rules called cops against Ruby source.",
      "An offense includes the location, explanation, and cop name needed for configuration.",
      "Keep `.rubocop.yml` and `TargetRubyVersion` aligned with the project contract.",
      "`-a` applies safe corrections; `-A` includes corrections marked unsafe.",
      "Review autocorrect diffs and run tests before accepting them.",
      "Use CI and focused exclusions to keep the team consistent without hiding real issues.",
    ],
    interview: [
      "- RuboCop is a static analyzer and formatter for Ruby. It parses source code and runs rules called cops. Layout and Style rules make code consistent, Lint rules identify suspicious constructs, Naming checks identifiers, and Metrics can flag methods or classes that exceed configured complexity or size limits.",
      "- A normal team command is `bundle exec rubocop`, which uses the locked gem version and project configuration. Each offense gives a file and line plus a cop name such as `Lint/UselessAssignment`. That name links the finding to its documentation and lets the team configure only the rule actually under discussion.",
      "- For example, a project may set `TargetRubyVersion: 3.2`, exclude generated schema files from one metric, and require a consistent string style. A developer runs RuboCop before review; CI runs the same command so personal editor settings cannot silently define a different standard.",
      "- Autocorrection needs review. `-a` enables corrections RuboCop marks safe, whereas `-A` also runs corrections marked unsafe because they may change behaviour. Even a safe classification cannot understand every domain assumption, so I inspect the diff and run tests rather than committing a mass rewrite blindly.",
      "- I treat RuboCop as an executable team agreement, not an unquestionable design judge. If a rule harms clarity in one legitimate case, a narrow inline or path exclusion with a reason is better than globally disabling it. New cops and extension upgrades should be introduced deliberately to avoid unrelated churn in feature changes.",
    ],
    deepTitle: "Stable linting comes from one versioned rule set and a reviewed feedback loop",
    deep: [
      "RuboCop does not execute application behaviour. It parses files, builds a syntax representation, and asks enabled cops to inspect relevant nodes or source ranges. This can catch defects such as unreachable or useless code and enforce patterns that are easier to review consistently, but it cannot prove that a payment amount or authorization rule is correct. Tests and runtime observation cover different risks.",
      "Configuration is layered. RuboCop starts from defaults, then loads project and inherited settings. A cop can be enabled, disabled, given parameters, or limited with include and exclude patterns. The project should record its supported Ruby version because syntax-aware cops and parser selection depend on that contract. Current RuboCop versions can also infer the target from common version files when it is not set explicitly.",
      "Reproducibility matters more than a developer's global installation. `bundle exec rubocop` selects the version in the application's bundle, including extensions such as `rubocop-rails` when configured. CI should run the same locked command. Editors can display results sooner, but their language server or extension must load the project settings rather than an unrelated personal configuration.",
      "Correction levels express risk metadata. Safe autocorrection is intended not to change semantics; unsafe autocorrection may do so. Both can produce a large diff, interact with generated files, or expose a mistake in configuration. Apply corrections to a clean, scoped change, read the diff, run the relevant tests, and separate mechanical cleanup from feature work when review would otherwise become difficult.",
      "Metrics offenses are prompts for judgment. A long method may be doing several jobs, or the threshold may be too strict for a declarative table. Silencing the entire Metrics department loses signals everywhere. Refactor when the code gains a clearer boundary; otherwise document a focused exemption near the exceptional code or in a narrow path configuration.",
      "Upgrades need a rollout policy because new releases can add cops or change defaults. Teams can enable pending rules in a planned cleanup, use a temporary generated baseline for existing debt, and prevent that baseline from expanding. The long-term aim is a small understandable configuration, few justified exceptions, and feedback early enough that lint fixes remain part of ordinary development rather than a periodic rewrite.",
    ],
    visualType: "flow_diagram",
    visualTitle: "RuboCop is useful when correction returns through review and tests",
    visual: fence("mermaid", [
      "flowchart LR",
      "  C[versioned .rubocop.yml] --> R[bundle exec rubocop]",
      "  S[Ruby source] --> R",
      "  R --> O[offense: file, line, cop]",
      "  O --> D{change code or justify exception?}",
      "  D --> F[scoped fix or configuration]",
      "  F --> A[optional reviewed autocorrect]",
      "  A --> T[tests and diff review]",
      "  T --> CI[same command in CI]",
    ]),
    codeTitle: "Keep the target version and exclusions explicit",
    codeLanguage: "yaml",
    code: [
      "# .rubocop.yml",
      "AllCops:",
      "  TargetRubyVersion: 3.2",
      "  NewCops: enable",
      "  Exclude:",
      "    - 'db/schema.rb'",
      "    - 'vendor/**/*'",
      "",
      "Metrics/MethodLength:",
      "  Max: 15",
      "",
      "# Commands:",
      "# bundle exec rubocop       # inspect",
      "# bundle exec rubocop -a    # safe corrections",
      "# bundle exec rubocop -A    # includes unsafe corrections; review carefully",
    ],
    followups: [
      "Why should CI use `bundle exec rubocop` instead of an arbitrary global version?",
      "What is the difference between `-a` and `-A`?",
      "When is a narrow RuboCop exclusion better than changing application code?",
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
    question.question = lesson.question;
    question.title = lesson.title;
    question.direct_answer = lesson.direct;
    question.last_updated = "2026-09-07";
    question.reading_time_minutes = 8;
    question.order = index + 1;
    question.answer = {
      ...(question.answer ?? {}),
      sections: [
        { type: "key_points", title: "Quick Revision", content: lesson.quick.map((point) => `- ${point}`).join("\n") },
        { type: "speakable_answer", title: "Interview Answer", answerSize: lesson.answerSize, content: lesson.interview.map((paragraph) => paragraph.replace(/^[-*+]\s+/, "")).join("\n\n") },
        { type: "deep_explanation", title: lesson.deepTitle, content: lesson.deep.join("\n\n") },
        { type: lesson.visualType, title: lesson.visualTitle, content: lesson.visual },
        { type: "code_example", title: lesson.codeTitle, content: fence(lesson.codeLanguage ?? "ruby", lesson.code) },
      ],
    };
    question.followup_questions = lesson.followups;
    question.seo = {
      ...(question.seo ?? {}),
      metaDescription: `Learn ${lesson.question} with a direct answer, concrete workflow, practical boundary, and focused follow-up questions.`,
    };
    curated += 1;
  }
  fs.writeFileSync(file, `${JSON.stringify(document, null, 2)}\n`);
}

const indexFile = path.join(domainRoot, "_index.json");
const index = JSON.parse(fs.readFileSync(indexFile, "utf8"));
const module = index.modules.find((entry) => entry.moduleSlug === "ruby-debugging-tools");
if (!module) throw new Error(`${indexFile}: missing ruby-debugging-tools`);
module.intro = "Ruby debugging questions test whether a developer can turn a failure into evidence and a durable fix. This module covers execution control with Byebug and Pry, the current Rails debugger context, common runtime exception contracts, safe Rails console investigation, ordered backtrace reading, and team use of RuboCop. Every lesson begins with the failed assumption, uses a concrete example, distinguishes observation from mutation, and ends with a reproducible test or review boundary rather than a temporary debugging trick.";
fs.writeFileSync(indexFile, `${JSON.stringify(index, null, 2)}\n`);

if (curated !== Object.keys(lessons).length) {
  throw new Error(`curated ${curated}/${Object.keys(lessons).length} Ruby debugging lessons`);
}

console.log(`Curated ${curated} canonical Ruby debugging questions.`);
