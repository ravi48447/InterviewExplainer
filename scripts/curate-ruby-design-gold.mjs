#!/usr/bin/env node

import fs from "node:fs";
import path from "node:path";

const domainRoot = "content/ruby-backend-fresher";
const root = path.join(domainRoot, "oop-and-design-basics");
const legacyRoot = path.join(domainRoot, "design-basics");
const fence = (language, lines) => `\`\`\`${language}\n${lines.join("\n")}\n\`\`\``;

const migrations = [
  { source: "dry-principle", target: "dry-and-solid-basics", slug: "ruby-dry-principle-basics" },
  { source: "solid-intro", target: "dry-and-solid-basics", slug: "ruby-solid-principles-basics" },
];

for (const migration of migrations) {
  const sourceFile = path.join(legacyRoot, migration.source, "complete-qa.json");
  const targetFile = path.join(root, migration.target, "complete-qa.json");
  if (!fs.existsSync(sourceFile)) continue;
  const source = JSON.parse(fs.readFileSync(sourceFile, "utf8"));
  const target = JSON.parse(fs.readFileSync(targetFile, "utf8"));
  const question = source.questions?.find((entry) => entry.slug === migration.slug);
  if (!question) throw new Error(`${sourceFile}: missing ${migration.slug}`);
  if (!target.questions.some((entry) => entry.slug === migration.slug)) {
    target.questions.push(question);
    fs.writeFileSync(targetFile, `${JSON.stringify(target, null, 2)}\n`);
  }
}

const lessons = {
  "ruby-oop-four-pillars-basics": {
    answerSize: "standard",
    direct: "The four commonly taught OOP pillars are encapsulation, abstraction, inheritance, and polymorphism. In Ruby, encapsulation protects an object's state behind public methods and visibility; abstraction exposes a small useful interface while hiding steps; inheritance lets a subclass specialise an ancestor's contract; and polymorphism lets different objects respond to the same message in their own way. They are design tools, not a requirement to build deep class hierarchies.",
    quick: [
      "Encapsulation protects state and invariants behind an object's methods.",
      "Abstraction exposes what a caller needs while hiding unnecessary steps.",
      "Inheritance specialises a genuine parent-child contract with `<` and `super`.",
      "Polymorphism lets different objects answer the same message appropriately.",
      "Ruby often gets polymorphism through duck typing, without shared inheritance.",
    ],
    interview: [
      "- The four OOP pillars describe ways to organise objects and their responsibilities. Encapsulation keeps state changes behind a controlled public boundary; in Ruby that often means instance variables plus public action methods and private helpers.",
      "- Abstraction gives callers a simpler operation than the steps required internally. `account.withdraw(50)` expresses the goal while the Account handles validation and balance changes. The caller does not manipulate `@balance` or repeat the account's rules.",
      "- Inheritance creates a subtype with `class Child < Parent`. A subclass receives behaviour through method lookup, can override it, and can call the next implementation with `super`. It is appropriate only when the child can safely be used wherever the parent is expected.",
      "- Polymorphism means one message works across different implementations. For example, EmailNotifier and SmsNotifier can both implement `deliver(message)`, and calling code depends on that behaviour rather than branching on class names. Ruby's duck typing makes a common base class optional.",
      "- These ideas work together but solve different problems: protect valid state, present a clear interface, reuse a true subtype contract, and vary behaviour behind the same message. A practical design starts with a small public contract, keeps its rules inside the responsible object, and introduces variation only where the application needs it. Composition is often simpler than inheritance when only one capability needs to be reused.",
    ],
    deepTitle: "Design the contract before choosing the relationship",
    deep: [
      "Encapsulation is about authority, not hiding every field. The object should be the one place allowed to move its state between valid conditions. A reader may expose balance safely, while a general balance writer would let every caller bypass withdrawal rules.",
      "Abstraction chooses the vocabulary of that boundary. A good public method names an outcome the caller understands and keeps storage, calculation order, and collaborators replaceable. An abstraction leaks when callers must know those internal steps to use it correctly.",
      "Inheritance affects identity and method lookup. The child inherits the parent's promises as well as its implementation. If the child rejects valid parent inputs or changes the meaning of results, reuse has broken substitutability even if the syntax is legal.",
      "Polymorphism removes conditionals from the caller by moving variation to receivers. A small message contract can be implemented by unrelated classes, test doubles, or adapters. Tests should verify the shared semantics, because matching method names alone do not guarantee matching behaviour.",
    ],
    visualType: "comparison_table",
    visualTitle: "Four pillars, four design questions",
    visual: "| Pillar | Design question | Ruby mechanism |\n|---|---|---|\n| Encapsulation | Who may change this state? | methods, visibility, instance variables |\n| Abstraction | What should the caller need to know? | small public interface |\n| Inheritance | Is this truly a substitutable subtype? | `<`, ancestor lookup, `super` |\n| Polymorphism | Can several objects fulfil one behaviour? | message dispatch and duck typing |",
    codeTitle: "Protect state and vary delivery through one message",
    code: [
      "class Account",
      "  attr_reader :balance",
      "",
      "  def initialize(balance)",
      "    @balance = balance",
      "  end",
      "",
      "  def withdraw(amount)",
      "    raise ArgumentError, 'invalid amount' unless amount.positive?",
      "    raise 'insufficient funds' if amount > @balance",
      "    @balance -= amount",
      "  end",
      "end",
      "",
      "class EmailNotifier",
      "  def deliver(message)",
      "    \"email: #{message}\"",
      "  end",
      "end",
      "",
      "class SmsNotifier",
      "  def deliver(message)",
      "    \"sms: #{message}\"",
      "  end",
      "end",
      "",
      "def notify(notifier, message)",
      "  notifier.deliver(message) # polymorphic message",
      "end",
    ],
    followups: [
      "How are encapsulation and abstraction different?",
      "When does inheritance violate substitutability?",
      "How does Ruby support polymorphism without a common superclass?",
    ],
  },
  "ruby-dry-principle-basics": {
    answerSize: "compact",
    direct: "DRY means every important piece of knowledge should have one authoritative representation. In Ruby, repeated business rules, mappings, or calculations should be given one clear method, object, or data source so a change cannot leave copies inconsistent. DRY is not a command to eliminate every similar line: two pieces of code that only look alike but change for different reasons may be safer left separate until their shared concept is proven.",
    quick: [
      "DRY removes duplicated knowledge, not merely repeated characters.",
      "Give one business rule or calculation one authoritative implementation.",
      "Extract only after the shared concept and change reason are understood.",
      "Tests, constants, partials, and methods can each remove different duplication.",
      "Do not couple unrelated cases just because their code currently looks similar.",
    ],
    interview: [
      "- DRY stands for Don't Repeat Yourself. Its useful meaning is that one business fact or decision should not be maintained in several places, because those copies can disagree after a change.",
      "- For example, if a discount rule appears in a controller, invoice model, and background job, changing the threshold requires three coordinated edits. Moving that rule to a named `DiscountPolicy` gives all callers one calculation and one testable source.",
      "- Duplication can be code, data, or knowledge. A partial can own repeated view markup, a constant can own a stable mapping, and a method can own one transformation. The extracted name should describe the shared idea rather than hide several unrelated cases behind flags.",
      "- Similar syntax is not always the same knowledge. Two formatters may look identical today but belong to different products and change independently. Combining them too early creates coupling and conditional complexity that is harder to remove than the small duplication was.",
      "- DRY works best after the common rule is clear: centralise changes that must remain consistent, keep accidental similarity separate, and prefer a simple duplication over a misleading abstraction.",
    ],
    deepTitle: "Find the duplicated decision, then choose its owner",
    deep: [
      "The risk in duplication is divergent change. If tax eligibility is written in three request handlers, one bug fix may update only two. The repeated lines are a symptom; the duplicated definition of eligibility is the actual problem.",
      "A useful extraction starts by naming the rule and locating the object responsible for it. A calculation about an order may belong to an Order or policy object; repeated display markup may belong to a partial; repeated test setup may belong to a factory or helper. One universal helper file is rarely the right owner.",
      "Timing matters. The first two examples provide evidence but may still differ in hidden ways. Waiting until the reasons for change are known can reveal the correct parameters—or reveal that no shared abstraction exists.",
      "An abstraction has a maintenance cost: name, API, dependencies, and tests. It has earned that cost when callers share one meaning and future rule changes should reach all of them together.",
    ],
    visualType: "flow_diagram",
    visualTitle: "Decide whether repetition is real shared knowledge",
    visual: fence("mermaid", [
      "flowchart TD",
      "  R[notice similar code] --> K{same business knowledge?}",
      "  K -->|no| S[keep cases separate]",
      "  K -->|yes| C{must copies change together?}",
      "  C -->|no| S",
      "  C -->|yes| O[choose one responsible owner]",
      "  O --> N[extract a small named rule and focused tests]",
    ]),
    codeTitle: "Give one discount rule one owner",
    code: [
      "class DiscountPolicy",
      "  THRESHOLD = 100",
      "  RATE = 0.10",
      "",
      "  def discount_for(total)",
      "    total >= THRESHOLD ? total * RATE : 0",
      "  end",
      "end",
      "",
      "policy = DiscountPolicy.new",
      "policy.discount_for(80)   # => 0",
      "policy.discount_for(120)  # => 12.0",
      "",
      "# Controllers, invoices, and jobs call the same rule",
      "# instead of copying the threshold and calculation.",
    ],
    followups: [
      "What is the difference between duplicated code and duplicated knowledge?",
      "When can a DRY refactor create the wrong abstraction?",
      "Where should a repeated business rule live in a Rails application?",
    ],
  },
  "ruby-solid-principles-basics": {
    answerSize: "standard",
    direct: "SOLID is a set of five design principles: Single Responsibility, Open/Closed, Liskov Substitution, Interface Segregation, and Dependency Inversion. In Ruby they guide classes toward one reason to change, extension through small interchangeable collaborators, honest subtype contracts, narrow message protocols, and dependence on behaviour rather than concrete infrastructure. They are heuristics for reducing change cost—not rules that require an interface class, one-method objects, or a framework around simple code.",
    quick: [
      "SRP: one class should have one coherent reason to change.",
      "OCP: add a new variation without rewriting stable calling code.",
      "LSP: a replacement must preserve the contract callers rely on.",
      "ISP: depend on a small role-specific message set, not a large unused API.",
      "DIP: high-level policy receives collaborators through behaviour, not construction details.",
    ],
    interview: [
      "- SOLID groups five principles for keeping changes local. Single Responsibility means a class owns one coherent responsibility or reason to change; it does not literally mean one method. An Invoice can calculate invoice totals, while PDF formatting and email delivery change for different reasons and can live elsewhere.",
      "- Open/Closed means stable code can accept a new variation through an extension point. A checkout that calls `gateway.charge` can work with a new gateway object without adding another provider branch. Ruby's modules and duck typing make the extension point a small message contract rather than a required interface declaration.",
      "- Liskov Substitution says any replacement must preserve what callers expect: accepted inputs, valid outputs, side effects, and errors. A subclass that rejects a normal parent operation is not a safe subtype even though inheritance compiles.",
      "- Interface Segregation says clients should depend only on the capabilities they use. In Ruby this appears as small protocols—for example, a report needs `write`, not an object with storage, networking, administration, and logging methods.",
      "- Dependency Inversion separates policy from details. An OrderProcessor receives a payment gateway instead of constructing Stripe inside its method, which makes another implementation and a focused test double possible. SOLID is useful when real, measurable variation and change pressure exist; applying every principle to a tiny script can add more structure than value.",
    ],
    deepTitle: "SOLID moves change behind small behavioural seams",
    deep: [
      "Start with reasons for change. Pricing rules, persistence, transport, and presentation may collaborate in one feature but come from different decisions. Separating them allows one decision to evolve without forcing every other concern through the same class and test setup.",
      "An extension seam is only useful when variation is real. Passing a gateway into checkout keeps provider-specific code outside the ordering policy. The high-level object defines the few messages it needs, and adapters translate each external SDK into that local protocol.",
      "Substitution and interface segregation protect that seam. Every gateway must give the same meaning to success, decline, and technical failure; merely responding to `charge` is not enough. Requiring only `charge` prevents checkout from becoming coupled to provider methods it never uses.",
      "Dependency direction is about source-code knowledge. The business policy may know a PaymentGateway role, while a Stripe adapter knows both Stripe and that local role. Object construction happens at the application boundary. Ruby can express this without abstract base classes, but documentation and shared contract tests become important.",
      "The principles are diagnostic lenses, not a scoring system. A design is improved when a likely change becomes safer and easier to understand. If an extra abstraction has no independent responsibility, variation, or boundary, simple direct code remains the better design.",
    ],
    visualType: "comparison_table",
    visualTitle: "The five principles as change boundaries",
    visual: "| Principle | Protects against | Ruby-sized response |\n|---|---|---|\n| SRP | unrelated changes in one class | split by reason to change |\n| OCP | editing conditionals for every variation | inject a small interchangeable collaborator |\n| LSP | replacements that surprise callers | preserve input, output, and failure semantics |\n| ISP | clients coupled to unused operations | depend on a narrow message protocol |\n| DIP | business policy constructing infrastructure | assemble concrete adapters at the boundary |",
    codeTitle: "High-level checkout depends on a small gateway role",
    code: [
      "class Checkout",
      "  def initialize(gateway)",
      "    @gateway = gateway",
      "  end",
      "",
      "  def complete(order)",
      "    @gateway.charge(order.total)",
      "    order.mark_paid",
      "  end",
      "end",
      "",
      "class FakeGateway",
      "  attr_reader :charged_amount",
      "",
      "  def charge(amount)",
      "    @charged_amount = amount",
      "  end",
      "end",
      "",
      "# StripeGateway or BankGateway can implement the same charge contract.",
      "# Checkout does not branch on or construct a provider.",
    ],
    followups: [
      "What does 'one reason to change' mean in the Single Responsibility Principle?",
      "How can duck typing support Open/Closed and Interface Segregation?",
      "What behaviour must a replacement preserve to satisfy Liskov Substitution?",
    ],
  },
  "ruby-dry-and-solid-basics": {
    question: "How are DRY and SOLID different, and how do they work together in Ruby?",
    title: "DRY and SOLID: Different Design Problems",
    answerSize: "compact",
    direct: "DRY prevents one piece of knowledge from being maintained in several places; SOLID shapes responsibilities and dependencies so software can change without widespread edits. DRY asks whether copies must stay consistent, while SOLID asks who owns a decision and how collaborators can vary safely. They work together when a shared rule gains one clear owner and callers depend on its small contract, but either can be over-applied through premature abstractions.",
    quick: [
      "DRY targets duplicated knowledge that must change consistently.",
      "SOLID targets responsibility, substitution, interfaces, extension, and dependency direction.",
      "One extraction can be DRY without improving a class's responsibilities.",
      "A SOLID design may keep small duplication when cases change independently.",
      "Use both to localise a real change, not to maximise abstractions.",
    ],
    interview: [
      "- DRY and SOLID both reduce change risk, but they diagnose different problems. DRY looks for the same knowledge maintained in multiple places. SOLID looks at how responsibilities, contracts, and dependencies are divided between objects.",
      "- For example, three classes copying the same tax formula violate DRY because one rule can drift. Giving the rule to `TaxPolicy` creates one source. Having Checkout construct a concrete tax API inside itself is a dependency problem; injecting a small calculator role applies Dependency Inversion.",
      "- DRY alone can produce a large shared helper that owns unrelated rules. That removes repeated lines while worsening Single Responsibility and Interface Segregation. SOLID alone can create many tiny abstractions before there is evidence of variation, which makes simple behaviour harder to follow.",
      "- The principles can also point in different directions. Two similar-looking calculations may belong to different domains and change independently; keeping them separate respects responsibility even though some syntax is repeated.",
      "- A balanced design identifies the actual decision, gives it one responsible owner, and exposes only the contract its callers need. The useful result is a smaller change surface, not a particular number of classes or perfectly unique lines.",
    ],
    deepTitle: "Evaluate knowledge ownership separately from object boundaries",
    deep: [
      "A DRY review traces a fact through the system: where is the discount threshold defined, and which copies must always agree? A SOLID review traces causes of change: which class changes when pricing, storage, delivery, or a vendor API changes? The two maps overlap but are not identical.",
      "Centralising a rule solves consistency only when the new owner is meaningful. A global `Utils` module can become a bucket of unrelated knowledge. A policy object, value object, or domain method gives the shared rule a name and responsibility that explain why the callers converge there.",
      "Dependencies determine how far a change travels. If the rule's public protocol is small, callers remain stable while its algorithm changes. If the abstraction leaks provider fields or requires unused methods, the centralisation has simply moved coupling to a new place.",
      "The safest sequence is evidence, ownership, contract, then extraction. This avoids abstracting coincidental similarity and keeps each added object tied to a concrete maintenance benefit.",
    ],
    visualType: "comparison_table",
    visualTitle: "DRY and SOLID inspect different dimensions",
    visual: "| Question | DRY lens | SOLID lens |\n|---|---|---|\n| Main concern | duplicated knowledge | responsibility and dependency structure |\n| Typical smell | same rule can drift | one change touches unrelated classes or branches |\n| Typical move | establish one source | create a focused owner or behavioural seam |\n| Main overuse | premature shared abstraction | unnecessary layers and tiny objects |\n| Combined result | one rule | one clear owner with a small stable contract |",
    codeTitle: "One rule and one injected contract",
    code: [
      "class TaxPolicy",
      "  def tax_for(subtotal)",
      "    subtotal * 0.18",
      "  end",
      "end",
      "",
      "class Checkout",
      "  def initialize(tax_policy)",
      "    @tax_policy = tax_policy",
      "  end",
      "",
      "  def total(subtotal)",
      "    subtotal + @tax_policy.tax_for(subtotal)",
      "  end",
      "end",
      "",
      "Checkout.new(TaxPolicy.new).total(100) # => 118.0",
      "# TaxPolicy is the one rule; Checkout depends on its small behaviour.",
    ],
    followups: [
      "Can a refactor be DRY but violate Single Responsibility?",
      "When should two similar pieces of code remain separate?",
      "How do knowledge ownership and dependency direction affect change cost?",
    ],
  },
  "ruby-naming-conventions-basics": {
    answerSize: "compact",
    direct: "Ruby convention uses `snake_case` for local variables, methods, and files; `CamelCase` for class and module constants; and `UPPER_SNAKE_CASE` for ordinary constants. A method ending in `?` reads as a predicate, `=` defines assignment-style syntax, and `!` normally marks a more dangerous counterpart—not a language guarantee that mutation occurs. Names should describe domain meaning and follow framework path conventions so readers and autoloaders can predict where behaviour lives.",
    quick: [
      "Use `snake_case` for methods, local variables, and Ruby filenames.",
      "Use `CamelCase` for classes and modules; use uppercase constants for fixed values.",
      "End predicate-style methods with `?` and assignment methods with `=`.",
      "Use `!` to signal a dangerous counterpart, not as a universal mutation marker.",
      "Prefer names that reveal domain meaning and match autoloading paths.",
    ],
    interview: [
      "- Ruby's naming conventions make code predictable even though many identifier forms are technically legal. Methods, local variables, and files normally use `snake_case`; classes and modules use `CamelCase`; constants commonly use `UPPER_SNAKE_CASE`.",
      "- Method punctuation communicates part of the contract. A name ending in `?`, such as `empty?`, reads as a question and should return a truthy or falsy result. A method ending in `=` supports assignment syntax, so `user.name = 'Ada'` calls `name=`.",
      "- A bang suffix conventionally marks a more dangerous version relative to a non-bang method. `String#upcase!` may modify its receiver while `upcase` returns a new string, but Ruby does not enforce this pattern and not every mutating method has `!`. The pair's documented behaviour is authoritative.",
      "- For example, `PaymentReport` belongs in `payment_report.rb`, and Rails may expect `Admin::PaymentReportsController` under `admin/payment_reports_controller.rb`. Matching constant and file names supports normal autoloading and quick navigation.",
      "- The goal is semantic clarity, not abbreviating everything. `eligible_for_refund?` reveals more than `check?`, and consistent names reduce the explanations future readers need.",
    ],
    deepTitle: "Names carry syntax, loading, and behavioural expectations",
    deep: [
      "Ruby's parser distinguishes constants by an initial uppercase letter and recognises method suffixes such as `?`, `!`, and `=`. Community conventions build readable promises on top of those legal forms, allowing a call site to suggest whether it asks a question, changes state, or assigns an attribute.",
      "The bang convention is comparative. It says 'pay attention to how this differs from the ordinary form', often because it mutates or raises. A lone method does not become well designed by adding `!`, and callers still need its actual return and failure contract.",
      "File naming becomes executable structure in autoloaded applications. A snake-case path maps to a constant path, so a rename may require changing both the file and constant. Case-insensitive development filesystems can hide a mismatch that later fails on Linux.",
      "Domain vocabulary matters more than mechanical style. A precise noun for an object and a verb for an operation help classes divide responsibilities and methods reveal effects. Consistency makes unfamiliar code navigable; specificity makes it understandable.",
    ],
    visualType: "comparison_table",
    visualTitle: "Ruby names and the expectations they set",
    visual: "| Kind | Convention | Example |\n|---|---|---|\n| Local variable or method | `snake_case` | `invoice_total`, `calculate_tax` |\n| Class or module | `CamelCase` | `PaymentReport` |\n| Constant | `UPPER_SNAKE_CASE` | `MAX_RETRIES` |\n| Predicate method | trailing `?` | `paid?` |\n| Assignment method | trailing `=` | `status=` |\n| Dangerous counterpart | trailing `!` | `save!` compared with `save` |\n| Ruby file | `snake_case.rb` | `payment_report.rb` |",
    codeTitle: "Let each name reveal its role",
    code: [
      "MAX_RETRIES = 3",
      "",
      "class PaymentReport",
      "  attr_writer :status",
      "",
      "  def initialize(total)",
      "    @total = total",
      "    @status = :draft",
      "  end",
      "",
      "  def ready?",
      "    @total.positive? && @status == :approved",
      "  end",
      "end",
      "",
      "report = PaymentReport.new(50)",
      "report.status = :approved  # calls status=",
      "report.ready?              # => true",
    ],
    followups: [
      "Does a bang method always mutate its receiver?",
      "What should a predicate method ending in `?` return?",
      "Why can Ruby file naming affect Rails autoloading?",
    ],
  },
};

const desiredOrder = {
  "ruby-dry-principle-basics": 1,
  "ruby-solid-principles-basics": 2,
  "ruby-dry-and-solid-basics": 3,
};

const directories = ["four-pillars", "dry-and-solid-basics", "naming-conventions"];
let curated = 0;
for (const directory of directories) {
  const file = path.join(root, directory, "complete-qa.json");
  const document = JSON.parse(fs.readFileSync(file, "utf8"));
  if (!Array.isArray(document.questions)) throw new Error(`${file}: missing questions`);
  if (directory === "dry-and-solid-basics") {
    document.questions.sort((left, right) => desiredOrder[left.slug] - desiredOrder[right.slug]);
  }
  for (const [index, question] of document.questions.entries()) {
    const lesson = lessons[question.slug];
    if (!lesson) throw new Error(`${file}: no lesson for ${question.slug}`);
    if (lesson.question) question.question = lesson.question;
    if (lesson.title) question.title = lesson.title;
    question.direct_answer = lesson.direct;
    question.last_updated = "2026-09-07";
    question.reading_time_minutes = lesson.answerSize === "deep" ? 9 : lesson.answerSize === "standard" ? 8 : 6;
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
      metaDescription: `Learn ${question.question} with a direct answer, worked Ruby example, design boundaries, and focused follow-up questions.`,
    };
    curated += 1;
  }
  fs.writeFileSync(file, `${JSON.stringify(document, null, 2)}\n`);
}

if (curated !== Object.keys(lessons).length) {
  throw new Error(`curated ${curated}/${Object.keys(lessons).length} Ruby design lessons`);
}

console.log(`Curated ${curated} canonical Ruby design questions.`);
