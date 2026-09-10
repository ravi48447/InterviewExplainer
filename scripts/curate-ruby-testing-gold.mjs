#!/usr/bin/env node

import fs from "node:fs";
import path from "node:path";

const domainRoot = "content/ruby-backend-fresher";
const moduleRoot = path.join(domainRoot, "rails-testing-basics");
const legacyRoot = path.join(domainRoot, "testing-basics");
const fence = (language, lines) => `\`\`\`${language}\n${lines.join("\n")}\n\`\`\``;

const migrations = [
  { source: "rspec-basics", target: "rspec-minitest-basics", slug: "ruby-rspec-basics" },
  { source: "minitest-basics", target: "rspec-minitest-basics", slug: "ruby-minitest-basics" },
  { source: "unit-vs-integration", target: "model-controller-tests", slug: "ruby-unit-vs-integration" },
  { source: "factories-intro", target: "model-controller-tests", slug: "ruby-factories-intro" },
];

for (const migration of migrations) {
  const sourceFile = path.join(legacyRoot, migration.source, "complete-qa.json");
  const targetFile = path.join(moduleRoot, migration.target, "complete-qa.json");
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
  "rails-rspec-vs-minitest-basics": {
    question: "What is the difference between RSpec and Minitest in Rails?",
    title: "RSpec vs Minitest in Rails",
    answerSize: "standard",
    direct: "Minitest is the testing framework Rails configures by default, while RSpec is an alternative installed through the `rspec-rails` gem. Minitest commonly uses test methods and assertions such as `assert_equal`; RSpec uses example groups and expectations such as `describe`, `it`, and `expect`. Both can test the same Rails behaviour, use Rails test helpers, and isolate database changes. The important choice is a clear, consistent suite—not a claim that one framework can find bugs the other cannot.",
    quick: [
      "Rails configures Minitest by default; RSpec is added with `rspec-rails`.",
      "Minitest usually reads as test methods plus assertions.",
      "RSpec usually reads as example groups plus expectations and matchers.",
      "Both can cover models, requests, jobs, mailers, and system behaviour.",
      "Choose for team clarity and tooling, then keep one consistent style.",
    ],
    interview: [
      "- Minitest and RSpec are two ways to write automated tests for a Rails application. A newly generated Rails application uses Minitest unless another framework is selected. RSpec is installed separately through `rspec-rails`, which connects RSpec's example and expectation APIs to Rails test helpers.",
      "- The most visible difference is expression. A Minitest model test is usually a class derived from `ActiveSupport::TestCase`, with a named `test` block and assertions such as `assert_equal expected, actual`. An RSpec model spec uses `RSpec.describe`, `it`, and an expectation such as `expect(actual).to eq(expected)`.",
      "- They can test the same outcomes. Either suite can verify validations, business methods, HTTP responses, background jobs, mail, and browser flows. RSpec does not run on Minitest assertions; the frameworks have separate assertion or matcher implementations, while `rspec-rails` reuses Rails integration facilities where appropriate.",
      "- Minitest has less additional setup and stays close to Rails defaults. RSpec offers a rich DSL, metadata, shared examples, and a large matcher ecosystem. Those features can improve readability in a disciplined suite, but deeply nested contexts and hidden setup can also make the cause of a failure harder to see.",
      "- I would choose the framework already used by the project or the one the team can read and maintain consistently. Test quality depends more on observable behaviour, clear setup, and useful failure messages than on whether the assertion begins with `assert` or `expect`.",
    ],
    deepTitle: "Compare the testing model, not only the syntax",
    deep: [
      "Both frameworks organise executable examples and report failures, but they name the pieces differently. Minitest exposes test case classes and assertion methods. RSpec builds example groups from `describe` and individual examples from `it`. In both cases, each example should establish a small starting state, perform one behaviour, and check an observable result.",
      "Rails supplies the application-facing layer: a test environment, database maintenance, fixtures, request helpers, job helpers, mail helpers, and browser-backed system tests. Minitest receives those features through Rails test base classes. `rspec-rails` wraps or integrates the same Rails facilities and selects helpers through spec type metadata or conventional directories.",
      "The real trade-off appears as a suite grows. RSpec's contexts, hooks, memoised helpers, and custom matchers can create a clear domain vocabulary, but they can also hide where data came from. Minitest's direct style can make execution easier to trace, though a large suite may build its own helper conventions. Neither style automatically produces isolated or meaningful tests.",
      "A migration between them rarely improves coverage by itself. Before changing frameworks, inspect slow setup, flaky boundaries, missing assertions, and tests coupled to implementation. A consistent framework with specific behavioural examples is more valuable than a mixed suite chosen one file at a time.",
    ],
    visualType: "comparison_table",
    visualTitle: "The same test intent in two styles",
    visual: "| Concern | Minitest in Rails | RSpec in Rails |\n|---|---|---|\n| Setup | generated by Rails | add and install `rspec-rails` |\n| Main structure | test case + `test` method | example group + `it` example |\n| Check | `assert_equal expected, actual` | `expect(actual).to eq(expected)` |\n| Normal folders | `test/models`, `test/integration` | `spec/models`, `spec/requests` |\n| Main risk | home-grown helper conventions | overly nested or hidden setup |",
    codeTitle: "One behaviour expressed in both frameworks",
    code: [
      "# Minitest style",
      "class PriceTest < ActiveSupport::TestCase",
      "  test 'adds tax to a subtotal' do",
      "    assert_equal 118, Price.total(100, tax_rate: 0.18)",
      "  end",
      "end",
      "",
      "# RSpec style",
      "RSpec.describe Price do",
      "  it 'adds tax to a subtotal' do",
      "    expect(Price.total(100, tax_rate: 0.18)).to eq(118)",
      "  end",
      "end",
      "",
      "# The behaviour and expected result are identical; the test API differs.",
    ],
    followups: [
      "Does RSpec use Minitest assertions internally?",
      "What makes a test readable regardless of the framework?",
      "When would changing an existing project's test framework be worthwhile?",
    ],
  },
  "ruby-rspec-basics": {
    question: "How do you write a basic RSpec example in Rails?",
    title: "Writing a Basic RSpec Example",
    answerSize: "compact",
    direct: "A basic RSpec example names the subject with `RSpec.describe`, states one behaviour in an `it` block, prepares only the data that behaviour needs, performs the action, and checks the observable result with `expect(...).to matcher`. In Rails, use the matching spec type or conventional folder, such as `spec/models` for a model and `spec/requests` for an HTTP endpoint. Each example should be independent and its description should still make sense in the test report.",
    quick: [
      "Use `RSpec.describe` to group examples around one subject.",
      "Write one observable behaviour in each clearly named `it` block.",
      "Arrange data, perform the action, then use `expect` with a matcher.",
      "Place Rails specs in the folder matching their type.",
      "Keep shared setup small so the example remains understandable alone.",
    ],
    interview: [
      "- RSpec expresses tests as examples of behaviour. `RSpec.describe` creates a group for the class, endpoint, or feature being tested, and each `it` block states one result that should be true. A useful description completes the sentence in the report, such as “Invoice#total applies the tax rate.”",
      "- Inside the example, I keep the flow visible: prepare the input, call the behaviour, and check the result. An expectation has an actual value and a matcher, for example `expect(invoice.total).to eq(118)`. A precise matcher gives a more useful failure than a broad truthy check.",
      "- In a Rails project, the spec type controls available helpers. A model spec normally lives in `spec/models`; a request spec in `spec/requests` can issue `get`, `post`, or other HTTP calls and inspect the response. Explicit `type: :model` or `type: :request` metadata can state the same intent.",
      "- `let` and `before` can remove repeated setup, but hiding every input in hooks makes an example difficult to read. I keep values important to the behaviour close to the expectation and use shared setup only when it truly applies to every example in the group.",
      "- A good RSpec example is independent, deterministic, and checks public behaviour rather than private method calls. It should fail for one clear reason and explain that reason through its group, description, and matcher output.",
    ],
    deepTitle: "Build an example around one observable contract",
    deep: [
      "RSpec's hierarchy becomes part of the failure message. The outer group identifies the subject, an optional `context` describes a meaningful condition, and `it` names the expected behaviour. Nesting is helpful only when each level changes the meaning; folders of one-line contexts make a reader reconstruct a sentence across the whole file.",
      "Setup is evaluated before an expectation can teach anything. Values defined with `let` are lazy and memoised within an example, while `before` runs setup at the chosen scope. Use them to remove noise, not to conceal the decisive input. A local variable is often clearest when only one example needs it.",
      "Matchers should express the contract at the correct boundary. Check a return value for a calculation, persisted state for a command, and an HTTP status or response body for a request. Stubbing the method under test or asserting every internal call can let implementation changes break tests even when user-visible behaviour remains correct.",
      "Examples must not depend on execution order or state left by another test. Rails database isolation helps, but files, queues, time, random values, and external services still need deliberate control. Independence makes a single focused run mean the same thing as the full suite.",
    ],
    visualType: "flow_diagram",
    visualTitle: "The readable shape of one RSpec example",
    visual: fence("mermaid", [
      "flowchart LR",
      "  S[subject and condition] --> A[arrange the decisive input]",
      "  A --> C[call public behaviour]",
      "  C --> O[observe result or effect]",
      "  O --> M[match the exact contract]",
    ]),
    codeTitle: "A focused model example",
    code: [
      "RSpec.describe Invoice, type: :model do",
      "  describe '#total' do",
      "    it 'applies the supplied tax rate' do",
      "      invoice = Invoice.new(subtotal: 100, tax_rate: 0.18)",
      "",
      "      total = invoice.total",
      "",
      "      expect(total).to eq(118)",
      "    end",
      "  end",
      "end",
    ],
    followups: [
      "What is the difference between `describe`, `context`, and `it`?",
      "When should setup stay inside an example instead of a `before` hook?",
      "Why should a test prefer public behaviour over private method calls?",
    ],
  },
  "ruby-minitest-basics": {
    question: "How do you write a basic Minitest test in Rails?",
    title: "Writing a Basic Minitest Test",
    answerSize: "compact",
    direct: "A Rails Minitest test inherits from the appropriate Rails test class, defines a clearly named `test` block, prepares the input, calls the public behaviour, and checks the result with a specific assertion. Model tests commonly inherit from `ActiveSupport::TestCase`; integration tests use `ActionDispatch::IntegrationTest`. Assertions normally put the expected value first, as in `assert_equal 118, invoice.total`, and each test must be independent.",
    quick: [
      "Choose the Rails test base class that matches the boundary.",
      "Name one observable behaviour in a `test` block.",
      "Arrange the required input, perform the action, then assert the outcome.",
      "Pass expected value before actual value to `assert_equal`.",
      "Use `setup` sparingly and keep every test independent.",
    ],
    interview: [
      "- Minitest is the framework Rails sets up by default. A model test normally inherits from `ActiveSupport::TestCase`, while a request-level workflow can inherit from `ActionDispatch::IntegrationTest`. That base class supplies Rails helpers and connects the test to the isolated test environment.",
      "- Each `test` block should describe one behaviour in plain language. Inside it, I arrange the smallest useful input, call the public method, and assert the observable result. For value comparisons, Minitest uses expected value first: `assert_equal 118, invoice.total`.",
      "- Different assertions communicate different contracts. `assert predicate` checks a truthy condition, `refute predicate` checks the opposite, `assert_nil` distinguishes nil from other falsey results, and `assert_raises(ErrorClass)` verifies an expected failure. For example, a withdrawal test can use `assert_raises(InsufficientFunds)` to name the promised failure. The most specific assertion usually produces the clearest diagnostic.",
      "- The `setup` method can create state needed by every test in the class, but large shared fixtures hide which input matters. Important boundary values should stay near the assertion so a reader can understand the test without jumping around the file.",
      "- I run a focused file or test while developing and the full suite before merging. A useful Minitest test remains deterministic, leaves no shared state behind, and proves behaviour rather than repeating how the method is implemented.",
    ],
    deepTitle: "Let the assertion state the contract precisely",
    deep: [
      "Rails selects test helpers through inheritance. `ActiveSupport::TestCase` is suitable for models and plain application objects that need Rails support. `ActionDispatch::IntegrationTest` adds HTTP request methods and response access. System tests add a browser driver. Choosing the smallest boundary keeps setup and failure output focused.",
      "Assertions are executable claims. `assert_equal` compares values, `assert_includes` checks membership, and `assert_changes` can verify a Rails state transition around a block. A generic `assert result` may pass for the wrong truthy value, so use an assertion that names the real promise whenever one exists.",
      "Rails maintains a separate test database and normally isolates database changes between tests. That does not automatically isolate global variables, files, network services, clocks, or jobs. Those boundaries still need controlled data, fakes, or cleanup suited to the behaviour.",
      "Test code is production support code: duplication can be extracted, but clarity comes first. A small local setup that exposes the scenario is often better than an abstract helper with several flags. When a failure occurs, the test name, input, assertion, and message should reveal what contract was broken.",
    ],
    visualType: "comparison_table",
    visualTitle: "Pick the assertion that names the result",
    visual: "| Contract | Minitest assertion | Example |\n|---|---|---|\n| exact value | `assert_equal` | `assert_equal 118, total` |\n| false condition | `refute` | `refute user.admin?` |\n| absent value | `assert_nil` | `assert_nil order.shipped_at` |\n| expected error | `assert_raises` | `assert_raises(InsufficientFunds)` |\n| state transition | `assert_changes` | observe a value around a block |",
    codeTitle: "A runnable Minitest example",
    code: [
      "require 'minitest/autorun'",
      "",
      "class Price",
      "  def self.total(subtotal, tax_rate:)",
      "    subtotal + (subtotal * tax_rate)",
      "  end",
      "end",
      "",
      "class PriceTest < Minitest::Test",
      "  def test_total_applies_the_tax_rate",
      "    assert_equal 118, Price.total(100, tax_rate: 0.18)",
      "  end",
      "end",
    ],
    followups: [
      "When should a Rails test inherit from `ActionDispatch::IntegrationTest`?",
      "Why is `assert_equal expected, actual` better than a broad truthy assertion?",
      "What state can still leak even when database tests use transactions?",
    ],
  },
  "rails-model-controller-tests-basics": {
    question: "What should model and request tests verify in Rails?",
    title: "Model Tests and Request Tests",
    answerSize: "standard",
    direct: "Model tests should verify business rules owned by a model or domain object, such as calculations, validations, and state changes. Request tests should exercise the HTTP boundary through routing and the Rails stack, then verify status, headers, response body, redirects, authentication, and persisted effects. Keep controller actions thin enough that request tests cover coordination while focused model or service tests cover decision logic. Test observable results, not private methods or framework internals.",
    quick: [
      "Model tests cover business rules, validations, calculations, and state changes.",
      "Request tests cover routing, HTTP input, authentication, responses, and persistence.",
      "A request test crosses more layers and is slower but gives broader confidence.",
      "Keep detailed decision cases near the object that owns the rule.",
      "Assert public outcomes instead of controller internals or private methods.",
    ],
    interview: [
      "- Model and request tests cover different boundaries. A model test asks whether a business object enforces its own rules—for example, whether an order calculates a total correctly, accepts valid state changes, and rejects invalid data. It calls the model directly, so a failure stays close to the rule.",
      "- A request test sends an HTTP request through Rails routing and the application stack. It verifies the contract a client sees: status code, headers, JSON or HTML body, redirect location, authentication behaviour, and any database change caused by the request.",
      "- Suppose `POST /orders` creates an order. Focused model tests can cover price boundaries and invalid transitions. A request test sends permitted parameters, checks `201 Created`, verifies the response shape, and confirms the saved order belongs to the authenticated user. Another request covers invalid input and expects the application's chosen error status and body.",
      "- Rails also supports controller tests, and RSpec has controller specs, but request-level tests usually provide stronger confidence in the route-to-response flow. I do not repeat every model edge case through HTTP because that makes the suite slower and makes failures harder to locate.",
      "- The split follows ownership: many fast examples around the object that makes a decision, and fewer end-to-end request examples around important API or web contracts. Together they show both that the rule works and that Rails exposes it correctly.",
    ],
    deepTitle: "Place each assertion at the boundary that owns the risk",
    deep: [
      "A validation can be observed at two levels. A model test can construct an invalid record and inspect its errors, which isolates the business rule. A request test can submit invalid input and inspect the HTTP response, which proves the rule is translated into the public API. The two tests answer different questions, so limited overlap can be valuable.",
      "Request tests include routing, parameter parsing, controller filters, authentication, rendering, and persistence. That wider path catches integration mistakes a direct controller method call can miss. It also introduces more possible causes of failure, so request examples should focus on representative success, invalid input, permission, and not-found paths instead of every arithmetic boundary.",
      "A thin controller coordinates the boundary: accept input, call application behaviour, and render or redirect. If a controller contains branching business policy, tests become tied to the transport layer. Moving the policy to a named object lets it receive focused tests while the request test checks only the mapping to HTTP.",
      "Assertions should match what a consumer can rely on. For JSON, check the selected schema fields and status rather than a fragile full string. For redirects, check the destination and durable state. Avoid asserting assignments or exact template internals unless those are genuinely part of the product contract.",
    ],
    visualType: "flow_diagram",
    visualTitle: "Two test boundaries around one feature",
    visual: fence("mermaid", [
      "flowchart LR",
      "  MT[model test] --> BR[business rule]",
      "  Client[HTTP client] --> Route[routing and params]",
      "  Route --> Action[controller coordination]",
      "  Action --> BR",
      "  BR --> DB[(database)]",
      "  Action --> Response[status, headers, body]",
      "  RT[request test] -. observes .-> Response",
      "  RT -. verifies effect .-> DB",
    ]),
    codeTitle: "Test the rule directly and the HTTP contract once",
    code: [
      "# Model test: focused business rule",
      "class OrderTest < ActiveSupport::TestCase",
      "  test 'cannot ship before payment' do",
      "    order = Order.new(status: :pending)",
      "    assert_raises(Order::InvalidTransition) { order.ship! }",
      "  end",
      "end",
      "",
      "# Request test: public endpoint contract",
      "class OrdersFlowTest < ActionDispatch::IntegrationTest",
      "  test 'invalid order returns an error response' do",
      "    post orders_path, params: { order: { quantity: 0 } }, as: :json",
      "    assert_response :unprocessable_entity",
      "    assert_includes response.parsed_body['errors'], 'Quantity must be greater than 0'",
      "  end",
      "end",
    ],
    followups: [
      "Why not repeat every model edge case through a request test?",
      "What should an API request test assert besides the status code?",
      "When can a small amount of overlap between model and request tests be useful?",
    ],
  },
  "ruby-unit-vs-integration": {
    question: "What is the difference between unit and integration tests in Rails?",
    title: "Unit Tests vs Integration Tests",
    answerSize: "compact",
    direct: "A unit test checks one small unit of behaviour with most external boundaries controlled; an integration test checks that multiple real parts work together. In Rails, a focused test of a pricing object is unit-like, while an `ActionDispatch::IntegrationTest` or RSpec request spec can exercise routing, controller behaviour, rendering, and persistence together. Unit tests are fast and precise; integration tests give broader confidence. A healthy suite uses both according to the risk being tested.",
    quick: [
      "Unit tests isolate one decision and localise failures quickly.",
      "Integration tests prove several real components cooperate correctly.",
      "Isolation is about boundaries, not simply whether a model class is tested.",
      "Use focused tests for rule combinations and integration tests for key flows.",
      "Mock external boundaries deliberately; do not mock the behaviour under test.",
    ],
    interview: [
      "- A unit test exercises one small piece of behaviour and controls collaborators that are outside its responsibility. For example, a `ShippingFee` object can be tested with destination and weight values without booting an HTTP request or contacting a courier service. When it fails, the pricing rule is the likely cause.",
      "- An integration test exercises a path through several components. A Rails integration or request test may pass through the router, controller filters, parameter handling, application code, database, and renderer, then check the response and saved state. It proves the connections as well as the individual rules.",
      "- The categories are a spectrum, not folder names. A model test that writes associated records and runs callbacks uses real integrations; a request test with every collaborator stubbed may prove less integration than its name suggests.",
      "- Unit tests are normally faster and allow many boundary cases, but a mocked collaborator can differ from reality. Integration tests catch wiring, configuration, serialization, and transaction problems, but a failure has more possible causes and each scenario costs more to set up.",
      "- I use many focused tests around important decisions and a smaller set of integration tests around valuable user or API flows. The question is which failure the test must detect, then the smallest boundary that can detect it honestly.",
    ],
    deepTitle: "Choose a boundary that matches the failure you need to catch",
    deep: [
      "Test scope describes how much real collaboration occurs. A calculation with plain values has a narrow boundary. Adding Active Record, the database, a job adapter, or an HTTP client widens it. The useful distinction is not whether the production subject is a class, but which dependencies the test lets participate.",
      "A controlled dependency can make a focused test deterministic. A fake exchange-rate client lets pricing tests cover timeout or invalid-rate behaviour without a network. That test must still respect the real client's local contract, and a separate integration or contract test should confirm the adapter speaks to its actual boundary correctly.",
      "Broad tests are best spent on paths whose connections matter: authentication plus authorization, parameter parsing plus validation errors, a successful transaction, or an external adapter's serialization. Repeating every small rule at that level creates slow setup without adding a new relationship to verify.",
      "When a test fails, its scope determines the search area. Narrow tests give precise feedback; broad tests show the product path is broken. Keeping both layers allows a broad failure to reveal impact and a focused failure to reveal the responsible rule.",
    ],
    visualType: "comparison_table",
    visualTitle: "Trade precision for breadth deliberately",
    visual: "| Property | Focused unit test | Integration or request test |\n|---|---|---|\n| Real parts involved | one unit plus controlled collaborators | several application layers |\n| Best at finding | rule and boundary-case errors | wiring and contract errors |\n| Failure location | usually narrow | may cross several layers |\n| Typical volume | many cases | selected important flows |\n| Main blind spot | fake differs from reality | fewer detailed edge cases |",
    codeTitle: "A focused rule beside a request flow",
    code: [
      "# Focused unit-like test",
      "RSpec.describe ShippingFee do",
      "  it 'waives shipping at the free-delivery threshold' do",
      "    expect(described_class.for(order_total: 50)).to eq(0)",
      "  end",
      "end",
      "",
      "# Integration boundary",
      "RSpec.describe 'Checkout', type: :request do",
      "  it 'returns the calculated delivery charge' do",
      "    post '/checkout', params: { order_total: 40 }, as: :json",
      "    expect(response).to have_http_status(:ok)",
      "    expect(response.parsed_body['shipping_fee']).to eq(5)",
      "  end",
      "end",
    ],
    followups: [
      "Can a model test be an integration test?",
      "What problem appears when a fake does not match the real collaborator?",
      "Which application flows deserve broader integration coverage?",
    ],
  },
  "ruby-factories-intro": {
    question: "What are FactoryBot factories, and when should you use them?",
    title: "FactoryBot Factories in Rails Tests",
    answerSize: "compact",
    direct: "A FactoryBot factory is a reusable recipe for constructing test objects with sensible defaults. `build(:user)` creates an unsaved object, `create(:user)` persists it, `attributes_for(:user)` returns attributes, and traits name meaningful variations such as `:admin`. Factories are useful when tests need valid records with small overrides, but they should not hide large object graphs or replace explicit scenario setup. Use the cheapest build strategy that satisfies the behaviour under test.",
    quick: [
      "A factory is a named recipe for valid, reusable test data.",
      "Use `build` for an unsaved object and `create` only when persistence matters.",
      "Use traits for meaningful states rather than many nearly identical factories.",
      "Override decisive values in the test so the scenario stays visible.",
      "Avoid callbacks and hidden associations that make every factory expensive.",
    ],
    interview: [
      "- FactoryBot provides recipes for building test objects. A factory declares sensible default attributes once, while each test can override the values that create its scenario. This avoids repeating all fields required merely to make a valid record.",
      "- The build strategy matters. `build(:user)` returns an unsaved model and is suitable for many validations or plain-method tests. `create(:user)` writes the record and its configured associations to the test database. `attributes_for(:user)` returns an attribute hash, which is useful for request parameters.",
      "- Traits describe important variations without duplicating the base recipe. For example, a `:suspended` trait can set status and suspension time, so `create(:user, :suspended)` tells the story more clearly than a generic factory plus several unrelated overrides.",
      "- Factories can become a source of hidden work. A small `create(:order)` may trigger callbacks and create a customer, address, products, and invoices that the test never uses. That slows the suite and makes failures depend on distant factory definitions.",
      "- I keep base factories valid and minimal, show behaviour-driving overrides in the example, and use `build` unless the database relationship is part of the test. Factories prepare data; assertions still need to prove the product behaviour.",
    ],
    deepTitle: "Treat a factory as test vocabulary, not an invisible scenario",
    deep: [
      "A useful factory owns boring validity defaults: a unique email format, a required name, or a normal state. The test owns the values that explain why the behaviour changes. If a discount test depends on `account_tier: :gold`, that override should be visible near the action and expectation.",
      "Build strategies change both speed and semantics. `build` instantiates without saving, `create` persists through the model lifecycle, `attributes_for` supplies a plain hash, and `build_stubbed` presents a persisted-like object without a database write. The last option cannot reproduce every Active Record interaction, so it should not be used when queries or persistence callbacks are part of the contract.",
      "Traits are named states that can be composed. They work well for `:admin`, `:expired`, or `:with_items` when those words match the domain. Too many callback-heavy traits can generate surprising combinations; explicit helper code is clearer when several records must form a precise relationship.",
      "Factories and fixtures are alternatives for preparing data, not competitors in assertion quality. Fixtures provide stable named rows and are built into Rails. Factories construct data through recipes and local overrides. A team can choose one or combine them deliberately, provided the scenario remains clear and the setup cost stays controlled.",
    ],
    visualType: "comparison_table",
    visualTitle: "Choose the least expensive strategy that is truthful",
    visual: "| FactoryBot call | Result | Use when |\n|---|---|---|\n| `build(:user)` | unsaved model | persistence is irrelevant |\n| `create(:user)` | saved model | database behaviour or relations matter |\n| `attributes_for(:user)` | attribute hash | request params or constructor input |\n| `build_stubbed(:user)` | persisted-like stub | simple read behaviour without database access |\n| `create(:user, :admin)` | saved trait variation | the named state is central to the scenario |",
    codeTitle: "Keep the factory small and expose the decisive state",
    code: [
      "FactoryBot.define do",
      "  factory :user do",
      "    sequence(:email) { |number| \"user#{number}@example.com\" }",
      "    status { :active }",
      "",
      "    trait :suspended do",
      "      status { :suspended }",
      "      suspended_at { Time.current }",
      "    end",
      "  end",
      "end",
      "",
      "user = build(:user, :suspended)",
      "expect(user).to be_suspended",
      "# Use create only when the example needs a stored record.",
    ],
    followups: [
      "What is the difference between `build`, `create`, and `attributes_for`?",
      "How can factories make a Rails test suite slow or confusing?",
      "When might a fixture be clearer than a factory?",
    ],
  },
};

const desiredOrder = {
  "rails-rspec-vs-minitest-basics": 1,
  "ruby-rspec-basics": 2,
  "ruby-minitest-basics": 3,
  "rails-model-controller-tests-basics": 1,
  "ruby-unit-vs-integration": 2,
  "ruby-factories-intro": 3,
};

const topicDirectories = ["rspec-minitest-basics", "model-controller-tests"];
let curated = 0;
for (const topicDirectory of topicDirectories) {
  const file = path.join(moduleRoot, topicDirectory, "complete-qa.json");
  const document = JSON.parse(fs.readFileSync(file, "utf8"));
  document.questions.sort((left, right) => desiredOrder[left.slug] - desiredOrder[right.slug]);
  for (const [index, question] of document.questions.entries()) {
    const lesson = lessons[question.slug];
    if (!lesson) throw new Error(`${file}: no lesson for ${question.slug}`);
    question.question = lesson.question;
    question.title = lesson.title;
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
      metaTitle: `${lesson.title} | Ruby Testing Interview Guide`,
      metaDescription: `Learn ${lesson.question} with a direct answer, tested example, practical boundary, and focused follow-up questions.`,
    };
    curated += 1;
  }
  fs.writeFileSync(file, `${JSON.stringify(document, null, 2)}\n`);
}

if (curated !== Object.keys(lessons).length) {
  throw new Error(`curated ${curated}/${Object.keys(lessons).length} Ruby testing lessons`);
}

console.log(`Curated ${curated} canonical Ruby testing questions.`);
