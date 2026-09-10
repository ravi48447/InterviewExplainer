#!/usr/bin/env node

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const file = "content/ruby-backend-fresher/rails-testing-basics/model-controller-tests/complete-qa.json";

const presentations = [
  {
    slug: "rails-model-controller-tests-basics",
    question: "What should model and request tests verify in Rails?",
    beats: [
      {
        cue: "Place a rule test beside the object that owns the decision",
        stage: "Models own focused rules",
        spokenText: "A model test should verify behaviour owned by the model or domain object: calculations, validations, state changes, and rejected transitions. It calls that object directly, so cases such as `order.ship!` before payment fail close to the rule. It should not spend assertions proving that Active Record itself can save an ordinary row.",
      },
      {
        cue: "Define a request test from the public HTTP contract it crosses",
        stage: "Requests own HTTP contracts",
        spokenText: "A request test sends an HTTP request through routing and the Rails stack. It can verify status, headers, parsed JSON or rendered HTML, redirects, authentication, and persisted effects. For `POST /orders`, that means checking what a client receives and whether the correct user owns the new record—not a private controller method.",
        support: {
          type: "comparison",
          title: "Put each assertion at the boundary that owns the risk",
          items: [
            {
              label: "Model or domain test",
              value: "rule and state behaviour",
              detail: "Covers many calculations, validations, and transition boundaries directly.",
              tone: "blue",
            },
            {
              label: "Request test",
              value: "route-to-response contract",
              detail: "Covers input parsing, filters, authentication, rendering, and persistence together.",
              tone: "green",
            },
            {
              label: "Useful overlap",
              value: "invalid rule becomes HTTP error",
              detail: "One request example proves the application translates a domain failure correctly.",
              tone: "orange",
            },
            {
              label: "Avoid",
              value: "private and framework internals",
              detail: "Assert stable public outcomes rather than controller implementation details.",
              tone: "neutral",
            },
          ],
        },
      },
      {
        cue: "Use one feature to show the two tests working at different depths",
        stage: "One feature uses both layers",
        spokenText: "For an order flow, focused tests can cover every invalid state transition. A request test then submits one representative invalid order and expects `422 Unprocessable Entity` plus the public error body. The executable example keeps the business rule direct and crosses the HTTP-shaped boundary only once.",
        support: {
          type: "code",
          title: "Test the rule directly and its HTTP translation once",
          language: "ruby",
          code: "class OrderTest < ActiveSupport::TestCase\n  test \"cannot ship before payment\" do\n    order = Order.new(status: :pending)\n    assert_raises(Order::InvalidTransition) { order.ship! }\n  end\nend\n\nclass OrdersFlowTest < ActionDispatch::IntegrationTest\n  test \"invalid order returns a public error\" do\n    post \"/orders\", params: { order: { quantity: 0 } }, as: :json\n\n    assert_response :unprocessable_entity\n    assert_includes response.parsed_body.fetch(\"errors\"),\n                    \"Quantity must be greater than 0\"\n  end\nend",
          caption: "The first failure points to the transition rule; the second proves Rails exposes validation failure through the expected HTTP contract.",
        },
      },
      {
        cue: "Close with a practical distribution of cases across the suite",
        stage: "Test outcomes, not internals",
        spokenText: "I keep many fast cases around the object that makes a decision and fewer request tests around valuable success, invalid-input, permission, and not-found paths. Limited overlap is useful when it proves a rule becomes the correct HTTP result. Thin controllers make this split clearer: focused objects own decisions, while request tests verify coordination.",
        recallRule: "Test each rule where it is owned, then test selected route-to-response contracts where the layers connect.",
      },
    ],
  },
  {
    slug: "ruby-unit-vs-integration",
    question: "What is the difference between unit and integration tests in Rails?",
    beats: [
      {
        cue: "Define a unit test by its controlled boundary rather than its folder",
        stage: "Unit tests narrow the cause",
        spokenText: "A unit test exercises one small responsibility and controls collaborators outside that responsibility. A shipping-fee test can call `ShippingFee.for(total)` with plain values and avoid routing, a database, or a courier API. When it fails, the search area is small and many boundary cases remain cheap to run.",
      },
      {
        cue: "Define integration by the real connections allowed to participate",
        stage: "Integration verifies links",
        spokenText: "An integration test lets several real parts cooperate. In Rails, `ActionDispatch::IntegrationTest` or a request spec may cross the router, controller filters, application objects, database, and renderer. It catches broken wiring, serialization, transactions, and configuration that an isolated rule test cannot see.",
        support: {
          type: "comparison",
          title: "Trade a narrow diagnosis for broader confidence deliberately",
          items: [
            {
              label: "Focused unit test",
              value: "one responsibility",
              detail: "Fast, precise, and suitable for many rule combinations.",
              tone: "blue",
            },
            {
              label: "Integration test",
              value: "several real components",
              detail: "Finds connection and contract failures across a valuable path.",
              tone: "green",
            },
            {
              label: "Unit blind spot",
              value: "a fake may differ from reality",
              detail: "Verify important adapters separately instead of trusting every stub forever.",
              tone: "orange",
            },
            {
              label: "Integration cost",
              value: "more setup and failure causes",
              detail: "Reserve broad tests for relationships that add meaningful confidence.",
              tone: "neutral",
            },
          ],
        },
      },
      {
        cue: "Correct the idea that class names or directories determine scope",
        stage: "Real participants set scope",
        spokenText: "The labels describe a spectrum. A model test that writes associated records and runs callbacks already uses database integration. A request test with every collaborator stubbed may prove less integration than its filename suggests. Ask which dependencies are real and which failure the test must honestly detect.",
      },
      {
        cue: "Show a narrow rule and a broader collaboration using one domain",
        stage: "Use both around valuable flows",
        spokenText: "A healthy suite combines many focused decision tests with selected integration flows. The runnable example tests the shipping threshold alone, then lets `Checkout` use the real fee calculation so a second test verifies the objects cooperate. A Rails request test applies the same idea across the HTTP stack.",
        support: {
          type: "code",
          title: "A focused rule beside a small integration path",
          language: "ruby",
          code: "require \"minitest/autorun\"\n\nclass ShippingFee\n  def self.for(total)\n    total >= 50 ? 0 : 5\n  end\nend\n\nclass Checkout\n  def self.summary(subtotal:)\n    shipping = ShippingFee.for(subtotal)\n    { subtotal: subtotal, shipping: shipping, total: subtotal + shipping }\n  end\nend\n\nclass ShippingFeeTest < Minitest::Test\n  def test_free_shipping_threshold\n    assert_equal 0, ShippingFee.for(50)\n  end\nend\n\nclass CheckoutFlowTest < Minitest::Test\n  def test_checkout_uses_the_real_shipping_rule\n    assert_equal({ subtotal: 40, shipping: 5, total: 45 },\n                 Checkout.summary(subtotal: 40))\n  end\nend",
          caption: "The first test isolates one rule; the second keeps two production objects real and checks their combined result.",
        },
        recallRule: "Use the smallest honest boundary for each risk, then add broader tests where real connections matter.",
      },
    ],
  },
  {
    slug: "ruby-factories-intro",
    question: "What are FactoryBot factories, and when should you use them?",
    beats: [
      {
        cue: "Define a factory as reusable test setup rather than an assertion",
        stage: "A factory is a recipe",
        spokenText: "A FactoryBot factory is a named recipe for constructing a valid test object with sensible defaults. A test overrides only the values that create its scenario. The factory removes repetitive setup, but it does not prove behaviour; the test still needs an action and an assertion.",
      },
      {
        cue: "Choose the build strategy from the behaviour the test exercises",
        stage: "Strategy changes cost",
        spokenText: "Use `build(:user)` for an unsaved model, `create(:user)` when persistence or relationships matter, and `attributes_for(:user)` when a request needs an attribute hash. `build_stubbed(:user)` is useful for simple persisted-like reads, but it cannot reproduce real queries or persistence callbacks.",
        support: {
          type: "comparison",
          title: "Use the cheapest strategy that remains truthful",
          items: [
            {
              label: "build",
              value: "unsaved model",
              detail: "Good for validations and plain behaviour that does not need the database.",
              tone: "blue",
            },
            {
              label: "create",
              value: "persisted model",
              detail: "Use when database state, callbacks, or relations are part of the test.",
              tone: "green",
            },
            {
              label: "attributes_for",
              value: "plain attribute hash",
              detail: "Useful for controller or request parameters.",
              tone: "orange",
            },
            {
              label: "build_stubbed",
              value: "persisted-like object",
              detail: "Fast for simple reads, but deliberately not a database record.",
              tone: "neutral",
            },
          ],
        },
      },
      {
        cue: "Use a named trait to keep an important state readable",
        stage: "Traits name real states",
        spokenText: "Traits describe meaningful variations without copying the base factory. `build(:user, :suspended)` tells the reader why this user matters, while the factory supplies ordinary validity details. Keep the decisive state visible in the test and prefer domain words such as `suspended`, `admin`, or `expired`.",
        support: {
          type: "code",
          title: "Keep the base small and make the changed state explicit",
          language: "ruby",
          code: "FactoryBot.define do\n  factory :user do\n    sequence(:email) { |number| \"user#{number}@example.com\" }\n    status { :active }\n\n    trait :suspended do\n      status { :suspended }\n      suspended_at { Time.now.utc }\n    end\n  end\nend\n\nuser = FactoryBot.build(:user, :suspended)\nputs [user.email, user.status, !user.suspended_at.nil?].join(\" | \")",
          caption: "The recipe owns routine validity; the trait exposes the state that drives this test scenario.",
        },
      },
      {
        cue: "Close with the warning signs of an overgrown factory graph",
        stage: "Hidden setup creates noise",
        spokenText: "Factories become harmful when `create(:order)` silently builds customers, products, invoices, and callbacks the example never uses. Keep base recipes minimal, use explicit helpers for precise object graphs, and choose `build` unless persistence is part of the contract. Setup should explain the scenario rather than hide it.",
        recallRule: "Factories provide small valid defaults; the test shows the important state and pays for only the persistence it needs.",
      },
    ],
  },
];

const absolutePath = path.join(repoRoot, file);
const document = JSON.parse(fs.readFileSync(absolutePath, "utf8"));
const questions = Array.isArray(document) ? document : document.questions;
if (!Array.isArray(questions) || questions.length !== presentations.length) {
  throw new Error(`Expected exactly ${presentations.length} questions in ${file}`);
}

for (const presentation of presentations) {
  const question = questions.find((candidate) => candidate.slug === presentation.slug);
  if (!question || question.question !== presentation.question) {
    throw new Error(`Question identity changed for ${presentation.slug}`);
  }

  const sections = question.answer?.sections;
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
  console.log(`Curated ${presentation.slug}`);
}

fs.writeFileSync(absolutePath, `${JSON.stringify(document, null, 2)}\n`);
