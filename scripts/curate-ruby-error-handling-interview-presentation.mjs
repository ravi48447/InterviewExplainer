#!/usr/bin/env node

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

const presentations = [
  {
    file: "content/ruby-backend-fresher/error-handling-basics/begin-rescue-ensure/complete-qa.json",
    slug: "ruby-begin-rescue-ensure-basics",
    question: "How do you handle exceptions with begin/rescue/ensure in Ruby?",
    beats: [
      {
        cue: "Explain the protected path before any exception occurs",
        stage: "begin protects the operation",
        spokenText: "Ruby runs the statements inside `begin` in normal order. If one raises, Ruby stops that path immediately, skips the remaining statements in the protected body, and searches for a matching `rescue`. If no local clause matches, the exception continues up the call stack, while any `ensure` clauses encountered during that exit still run.",
      },
      {
        cue: "Match the narrow recoverable class before broader parents",
        stage: "rescue matches by class",
        spokenText: "A clause such as `rescue JSON::ParserError => error` handles that class and its subclasses and exposes the exception object for context. Ruby checks rescue clauses from top to bottom, so specific errors come before a broader parent. A rescue with no class handles `StandardError`, not every exception; use it only at a boundary that can take responsibility for an ordinary application failure.",
        support: {
          type: "trace",
          title: "Ruby chooses one path, then cleanup",
          items: [
            {
              label: "Begin",
              value: "run protected work",
              detail: "Normal execution continues until work returns or raises.",
              tone: "blue",
            },
            {
              label: "Failure",
              value: "find first class match",
              detail: "Ruby skips later begin statements and tests rescue clauses in order.",
              tone: "orange",
            },
            {
              label: "Rescue",
              value: "recover or re-raise",
              detail: "Only a matching handler takes responsibility for the exception.",
              tone: "green",
            },
            {
              label: "Ensure",
              value: "always clean up",
              detail: "Cleanup runs before a value returns or an exception propagates.",
              tone: "neutral",
            },
          ],
        },
      },
      {
        cue: "Demonstrate success two handled failures and guaranteed cleanup",
        stage: "ensure always runs",
        spokenText: "`ensure` runs whether the protected work succeeds, a rescue returns a fallback, or an unhandled exception continues outward. It belongs to cleanup such as closing a resource acquired before the failure. Ruby block APIs like `File.open { ... }` are often simpler because they already own that cleanup, but the same control-flow rule applies.",
        support: {
          type: "code",
          title: "Run success and two rescue paths",
          language: "ruby",
          code: "def reciprocal(text)\n  begin\n    number = Integer(text)\n    10 / number\n  rescue ArgumentError\n    :invalid_number\n  rescue ZeroDivisionError\n    :cannot_divide_by_zero\n  ensure\n    puts \"finished #{text.inspect}\"\n  end\nend\n\np reciprocal('2')\np reciprocal('zero')\np reciprocal('0')",
          caption: "Each call prints its ensure message. The returned values are 5, :invalid_number, and :cannot_divide_by_zero.",
        },
      },
      {
        cue: "Separate valid recovery from hiding an unexpected failure",
        stage: "Recover only where safe",
        spokenText: "A handler should return a documented fallback, translate the error for its caller, or add context and re-raise. Logging and continuing without valid state only delays the failure. An optional `else` can hold success-only work so the rescue does not accidentally catch errors from that later step. Avoid `rescue Exception`, which can swallow interrupts, exits, and serious runtime conditions.",
        recallRule: "Protect the risky operation, rescue only understood classes, and use ensure for cleanup that must happen on every exit path.",
      },
    ],
  },
  {
    file: "content/ruby-backend-fresher/error-handling-basics/begin-rescue-ensure/complete-qa.json",
    slug: "ruby-exception-hierarchy-basics",
    question: "What is Ruby's exception hierarchy?",
    beats: [
      {
        cue: "Start from the root and identify the application-error branch",
        stage: "Exception is the root",
        spokenText: "Ruby exception objects belong to a class hierarchy rooted at `Exception`. The important branch for ordinary application failures is `StandardError`. Familiar classes below it include `ArgumentError`, `RuntimeError`, `NameError`, `NoMethodError`, and many library-specific errors. The hierarchy lets one rescue clause match either a precise class or a planned family of related failures.",
        support: {
          type: "comparison",
          title: "The default rescue boundary",
          items: [
            {
              label: "Exception",
              value: "hierarchy root",
              detail: "Includes application failures, process-control signals, and serious runtime conditions.",
              tone: "neutral",
            },
            {
              label: "StandardError",
              value: "ordinary app failures",
              detail: "A bare rescue catches this branch and its descendants.",
              tone: "green",
            },
            {
              label: "Specific subclass",
              value: "precise recovery",
              detail: "ArgumentError or JSON::ParserError communicates what the handler understands.",
              tone: "blue",
            },
            {
              label: "Outside StandardError",
              value: "exit, interrupt, fatal",
              detail: "Normal application handling should let these continue.",
              tone: "orange",
            },
          ],
        },
      },
      {
        cue: "Explain why a rescue without a class is intentionally limited",
        stage: "StandardError is the default",
        spokenText: "Writing `rescue` without a class is equivalent to `rescue StandardError`. It catches ordinary errors while leaving classes such as `SystemExit`, `Interrupt`, `ScriptError`, and `NoMemoryError` outside the handler. Rescuing the root `Exception` removes that safety boundary and can stop shutdown or conceal a condition the program cannot repair.",
      },
      {
        cue: "Connect class ancestry and clause order to the selected handler",
        stage: "Order picks the first match",
        spokenText: "A rescue for a class also matches its descendants, following the same ancestry idea as `is_a?`. Ruby uses the first matching clause, so `rescue JSON::ParserError` must appear before `rescue StandardError` when invalid JSON needs a special response. A broad parent first would consume the same exception and make the later specific handler unreachable in practice.",
        support: {
          type: "code",
          title: "Check the safe branch and a specific handler",
          language: "ruby",
          code: "require 'json'\n\ndef parse_preferences(text)\n  JSON.parse(text)\nrescue JSON::ParserError\n  { 'error' => 'invalid JSON' }\nrescue StandardError\n  { 'error' => 'application failure' }\nend\n\np parse_preferences('{\"theme\":\"dark\"}')\np parse_preferences('{bad json}')\np ArgumentError.ancestors.include?(StandardError)\np Interrupt.ancestors.include?(StandardError)",
          caption: "The parser uses its precise rescue. The ancestry checks print true for ArgumentError and false for Interrupt.",
        },
      },
      {
        cue: "Make recoverability rather than catchability the final rule",
        stage: "Fatal control signals stay out",
        spokenText: "A class being catchable does not mean the current layer should continue. Rescue the narrowest class whose meaning this layer can translate or recover from, or add context and re-raise it. A top-level job boundary may catch StandardError to record a failed job, while focused business code should normally use smaller domain or library classes.",
        recallRule: "Bare rescue stops at StandardError; catch a narrower descendant when its meaning supports a specific recovery, and leave Exception-level control failures alone.",
      },
    ],
  },
  {
    file: "content/ruby-backend-fresher/error-handling-basics/custom-exceptions/complete-qa.json",
    slug: "ruby-custom-exceptions-basics",
    question: "How do you define and use custom exceptions in Ruby?",
    beats: [
      {
        cue: "Define a stable domain failure type under StandardError",
        stage: "Custom classes name failures",
        spokenText: "A custom exception is a Ruby class that gives one meaningful application failure a stable type. It normally inherits from `StandardError`, for example `class InsufficientFundsError < StandardError; end`. Callers can then rescue that precise condition instead of inspecting message text or accidentally treating database and programming failures as the same business problem.",
      },
      {
        cue: "Keep machine-readable facts separate from the human message",
        stage: "Attributes carry useful facts",
        spokenText: "The class may be empty when its name is enough. When a handler needs details, add readers such as `available` and `requested`, set them in `initialize`, and call `super(message)` so normal exception logging and `error.message` still work. Structured attributes remain reliable when display wording changes and avoid parsing values back out of prose.",
        support: {
          type: "trace",
          title: "A domain error crosses layers without losing meaning",
          items: [
            {
              label: "Account",
              value: "detects the rule violation",
              detail: "This layer knows a withdrawal exceeds the available balance.",
              tone: "blue",
            },
            {
              label: "Exception",
              value: "type + structured facts",
              detail: "The error carries available and requested values with a readable message.",
              tone: "orange",
            },
            {
              label: "Service",
              value: "lets the meaning travel",
              detail: "Unrelated failures are not relabelled as insufficient funds.",
              tone: "neutral",
            },
            {
              label: "Boundary",
              value: "rescues exact type",
              detail: "A controller or job can produce the response intended for this condition.",
              tone: "green",
            },
          ],
        },
      },
      {
        cue: "Raise the custom type where the domain rule is actually known",
        stage: "Raise where the rule is known",
        spokenText: "Raise the exception at the layer that can truthfully name the violated rule. An Account knows whether a withdrawal exceeds its balance, while a controller usually does not own that calculation. The runnable example leaves the balance unchanged, raises one structured object, and lets the caller read its type, message, and fields without swallowing another category of failure.",
        support: {
          type: "code",
          title: "Raise and rescue one structured domain error",
          language: "ruby",
          code: "class InsufficientFundsError < StandardError\n  attr_reader :available, :requested\n\n  def initialize(available:, requested:)\n    @available = available\n    @requested = requested\n    super(\"requested #{requested}, available #{available}\")\n  end\nend\n\nclass Account\n  attr_reader :balance\n\n  def initialize(balance)\n    @balance = balance\n  end\n\n  def withdraw(amount)\n    if amount > @balance\n      raise InsufficientFundsError.new(\n        available: @balance, requested: amount\n      )\n    end\n\n    @balance -= amount\n  end\nend\n\naccount = Account.new(50)\nbegin\n  account.withdraw(75)\nrescue InsufficientFundsError => error\n  puts error.message\n  puts \"available=#{error.available} requested=#{error.requested}\"\nend\nputs \"balance=#{account.balance}\"",
          caption: "The exact handler receives structured values, and the failed withdrawal leaves the balance at 50.",
        },
      },
      {
        cue: "Create only error types that change handling across a boundary",
        stage: "Rescue at a useful boundary",
        spokenText: "A separate class is valuable when callers react differently, the failure crosses layers, or a group of related errors needs a shared parent such as `PaymentError`. Keep that hierarchy shallow and based on handling behavior. Rescue the error only where the program can translate, recover, or add context; otherwise let it propagate with its original meaning.",
        recallRule: "Name the domain failure with a StandardError subclass, attach facts as attributes, raise it where the rule is known, and rescue it where recovery is possible.",
      },
    ],
  },
  {
    file: "content/ruby-backend-fresher/error-handling-basics/custom-exceptions/complete-qa.json",
    slug: "ruby-raise-and-custom-exceptions-basics",
    question: "How do you raise exceptions in Ruby?",
    beats: [
      {
        cue: "Explain the control transfer caused by raise",
        stage: "raise transfers control",
        spokenText: "`raise` reports that the current operation cannot complete normally. Ruby stops the remaining statements on that path and unwinds method calls until it finds a matching `rescue`; `ensure` clauses still run during the unwind. An exception is therefore not just a message or special return value—the next normal line does not execute.",
      },
      {
        cue: "Choose the raise form that keeps the failure category visible",
        stage: "The form carries meaning",
        spokenText: "`raise 'bad value'` creates a `RuntimeError`. `raise ArgumentError, 'quantity must be positive'` creates a named category, and `raise error_object` sends an existing instance with its structured fields. The class should communicate what failed, while the message explains this occurrence. Callers can rescue the class without relying on fragile message matching.",
        support: {
          type: "comparison",
          title: "Four raise forms and what they preserve",
          items: [
            {
              label: "Message only",
              value: "raise 'bad value'",
              detail: "Creates a RuntimeError with no narrower category.",
              tone: "neutral",
            },
            {
              label: "Named class",
              value: "raise ArgumentError, message",
              detail: "Communicates a recognized failure category.",
              tone: "blue",
            },
            {
              label: "Existing object",
              value: "raise error",
              detail: "Preserves attributes already stored on that instance.",
              tone: "green",
            },
            {
              label: "Current failure",
              value: "bare raise in rescue",
              detail: "Re-raises the same exception with its original backtrace.",
              tone: "orange",
            },
          ],
        },
      },
      {
        cue: "Validate before changing state and show the caller-owned handler",
        stage: "Validate before state changes",
        spokenText: "Raise before a state change when an argument breaks the method contract. In the example, zero quantity raises `ArgumentError` before anything enters the order. The inner rescue records the same object and uses bare `raise`; the outer boundary confirms that the re-raised exception is identical and chooses the visible response.",
        support: {
          type: "code",
          title: "Reject invalid input and preserve the same exception",
          language: "ruby",
          code: "class Order\n  attr_reader :items\n\n  def initialize\n    @items = []\n  end\n\n  def add(product, quantity)\n    raise ArgumentError, 'quantity must be positive' unless quantity.positive?\n\n    @items << [product, quantity]\n  end\nend\n\norder = Order.new\noriginal_error = nil\n\nbegin\n  begin\n    order.add('book', 0)\n  rescue ArgumentError => error\n    original_error = error\n    raise\n  end\nrescue ArgumentError => error\n  puts error.message\n  puts \"same object: #{error.equal?(original_error)}\"\nend\n\np order.items",
          caption: "The failure remains the same object, and the empty items array proves validation happened before mutation.",
        },
      },
      {
        cue: "Reserve exceptions for contracts that cannot complete normally",
        stage: "Bare raise preserves failure",
        spokenText: "Inside a rescue, bare `raise` is the safest way to propagate the current exception after adding context or metrics because it preserves the object and original backtrace. Wrapping in a higher-level error can be useful at a real abstraction boundary, but preserve the original cause. Expected alternatives such as an optional search miss may be clearer as `nil` or a result object when the API does not define absence as exceptional.",
        recallRule: "Raise a meaningful class when a contract cannot complete, change state only after validation, and use bare raise when the same failure must continue upward.",
      },
    ],
  },
  {
    file: "content/ruby-backend-fresher/error-handling-basics/retry-pattern/complete-qa.json",
    slug: "ruby-retry-pattern-basics",
    question: "How do you retry a failed operation in Ruby?",
    beats: [
      {
        cue: "Define exactly where retry sends execution",
        stage: "retry restarts begin",
        spokenText: "Ruby allows `retry` inside a `rescue` clause. It sends execution back to the start of the associated `begin` body, so every statement in that protected operation runs again—not only the line that raised. Attempt counters and any state changed before the failure therefore need to be placed and designed deliberately.",
      },
      {
        cue: "Classify whether the same valid request may succeed later",
        stage: "Only transient failures retry",
        spokenText: "Retry a narrow transient condition such as a short timeout or connection reset, where the environment may recover while the request stays valid. Invalid credentials, malformed input, and programming errors will fail again with the same inputs and should return immediately. Rescue only the explicit transient classes that the operation's contract knows how to repeat.",
        support: {
          type: "trace",
          title: "A bounded retry decision",
          items: [
            {
              label: "Failure class",
              value: "transient?",
              detail: "Permanent input or code failures leave immediately.",
              tone: "blue",
            },
            {
              label: "Attempt budget",
              value: "attempts remain?",
              detail: "The final permitted failure is re-raised to the caller.",
              tone: "orange",
            },
            {
              label: "Repeat safety",
              value: "idempotent?",
              detail: "Writes need a key or status check before another attempt.",
              tone: "neutral",
            },
            {
              label: "Delay",
              value: "backoff then retry",
              detail: "Waiting gives the dependency time to recover and reduces synchronized load.",
              tone: "green",
            },
          ],
        },
      },
      {
        cue: "Show a strict attempt limit and increasing delays",
        stage: "Bound and delay attempts",
        spokenText: "Count attempts, re-raise when the maximum is reached, and wait before another try. Exponential backoff increases the delay after consecutive failures; jitter is often added in production so many clients do not retry together. The runnable client fails twice, succeeds on the third call, and records `0.25` and `0.5` second policies without making the lesson actually sleep.",
        support: {
          type: "code",
          title: "Retry two timeouts and succeed within the limit",
          language: "ruby",
          code: "require 'timeout'\n\nclass FlakyClient\n  attr_reader :calls\n\n  def initialize(failures:)\n    @failures = failures\n    @calls = 0\n  end\n\n  def fetch\n    @calls += 1\n    raise Timeout::Error, 'temporary timeout' if @calls <= @failures\n\n    'profile loaded'\n  end\nend\n\ndef fetch_with_retry(client, max_attempts: 3, sleeper: ->(_delay) {})\n  attempts = 0\n\n  begin\n    attempts += 1\n    client.fetch\n  rescue Timeout::Error\n    raise if attempts >= max_attempts\n\n    delay = 0.25 * (2**(attempts - 1))\n    sleeper.call(delay)\n    retry\n  end\nend\n\ndelays = []\nclient = FlakyClient.new(failures: 2)\nresult = fetch_with_retry(client, sleeper: ->(delay) { delays << delay })\n\nputs result\np client.calls\np delays",
          caption: "The operation succeeds on call three after recording two bounded backoff delays.",
        },
      },
      {
        cue: "Protect side effects and preserve the final failure",
        stage: "Repeat only safe operations",
        spokenText: "A read is often safe to repeat, while a payment, email, inventory decrement, or published job may already have succeeded before the client saw a timeout. Protect those operations with an idempotency key, deduplication record, or status check. After the final attempt, bare `raise` preserves the last exception and backtrace; metrics should record attempts without multiplying the same stack trace at every layer.",
        recallRule: "Retry only a named transient failure, within a strict delayed budget, when the whole repeated operation is safe or idempotently protected.",
      },
    ],
  },
];

const files = [...new Set(presentations.map((presentation) => presentation.file))];
const documents = new Map(
  files.map((file) => {
    const absolutePath = path.join(repoRoot, file);
    return [file, JSON.parse(fs.readFileSync(absolutePath, "utf8"))];
  }),
);

for (const presentation of presentations) {
  const document = documents.get(presentation.file);
  const questions = Array.isArray(document) ? document : document.questions;
  if (!Array.isArray(questions)) throw new Error(`Expected questions in ${presentation.file}`);

  const matches = questions.filter((question) => question.slug === presentation.slug);
  if (matches.length !== 1 || matches[0].question !== presentation.question) {
    throw new Error(`Question identity changed for ${presentation.slug}`);
  }

  const sections = matches[0].answer?.sections;
  if (!Array.isArray(sections)) throw new Error(`${presentation.slug} is missing answer sections`);
  for (const requiredType of ["key_points", "speakable_answer", "deep_explanation"]) {
    if (sections.filter((section) => section.type === requiredType).length !== 1) {
      throw new Error(`${presentation.slug} needs one ${requiredType} section`);
    }
  }

  const speakable = sections.find((section) => section.type === "speakable_answer");
  speakable.answerSize = "standard";
  speakable.beats = presentation.beats;
  speakable.content = presentation.beats.map((beat) => beat.spokenText).join("\n\n");
}

const actualQuestionCount = [...documents.values()].reduce((total, document) => {
  const questions = Array.isArray(document) ? document : document.questions;
  return total + questions.length;
}, 0);
if (actualQuestionCount !== presentations.length) {
  throw new Error(`Expected ${presentations.length} total questions, found ${actualQuestionCount}`);
}

for (const file of files) {
  const absolutePath = path.join(repoRoot, file);
  fs.writeFileSync(absolutePath, `${JSON.stringify(documents.get(file), null, 2)}\n`);
}

console.log(`Curated ${presentations.length} Ruby error-handling Interview Answer presentations`);
