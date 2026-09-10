#!/usr/bin/env node

import { spawnSync } from "node:child_process";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const file = "content/ruby-backend-fresher/rails-testing-basics/model-controller-tests/complete-qa.json";

const lessons = [
  {
    slug: "rails-model-controller-tests-basics",
    harnessBefore: `
class TestCase
  def self.test(name, &block)
    tests << [name, block]
  end

  def self.tests
    @tests ||= []
  end

  def self.run_all
    tests.each { |_name, block| new.instance_exec(&block) }
  end

  def assert_raises(error_class)
    begin
      yield
    rescue error_class
      return true
    end
    raise "expected #{error_class}"
  end

  def assert_includes(collection, value)
    raise "missing #{value}" unless collection.include?(value)
  end
end

module ActiveSupport
  class TestCase < ::TestCase
  end
end

module ActionDispatch
  class IntegrationTest < ::TestCase
    Response = Struct.new(:status, :parsed_body)
    attr_reader :response

    def post(path, params:, as:)
      raise "unexpected path" unless path == "/orders"
      raise "unexpected format" unless as == :json
      raise "unexpected quantity" unless params.dig(:order, :quantity) == 0

      @response = Response.new(
        :unprocessable_entity,
        { "errors" => ["Quantity must be greater than 0"] }
      )
    end

    def assert_response(status)
      raise "unexpected response" unless response.status == status
    end
  end
end

class Order
  class InvalidTransition < StandardError
  end

  def initialize(status:)
    @status = status
  end

  def ship!
    raise InvalidTransition unless @status == :paid
  end
end
`,
    harnessAfter: `
OrderTest.run_all
OrdersFlowTest.run_all
puts "OrderTest:#{OrderTest.tests.length}"
puts "OrdersFlowTest:#{OrdersFlowTest.tests.length}"
`,
    output: "OrderTest:1\nOrdersFlowTest:1",
  },
  {
    slug: "ruby-unit-vs-integration",
    directRun: true,
    outputPattern: /2 runs, 2 assertions, 0 failures, 0 errors, 0 skips/,
  },
  {
    slug: "ruby-factories-intro",
    harnessBefore: `
User = Struct.new(:email, :status, :suspended_at, keyword_init: true)

module FactoryBot
  @definitions = {}
  @sequences = Hash.new(0)

  class << self
    attr_reader :definitions, :sequences

    def define(&block)
      DefinitionSet.new.instance_eval(&block)
    end

    def build(name, *traits)
      definition = definitions.fetch(name)
      attributes = evaluate_all(definition.base)
      traits.each do |trait|
        attributes.merge!(evaluate_all(definition.traits.fetch(trait)))
      end
      Object.const_get(name.to_s.capitalize).new(**attributes)
    end

    def evaluate_all(specifications)
      specifications.each_with_object({}) do |(name, specification), values|
        kind, sequence_name, block = specification
        if kind == :sequence
          sequences[sequence_name] += 1
          values[name] = block.call(sequences[sequence_name])
        else
          values[name] = block.call
        end
      end
    end
  end

  class DefinitionSet
    def factory(name, &block)
      definition = Definition.new
      definition.instance_eval(&block)
      FactoryBot.definitions[name] = definition
    end
  end

  class Definition
    attr_reader :base, :traits

    def initialize
      @base = {}
      @traits = {}
      @target = @base
    end

    def sequence(name, &block)
      @target[name] = [:sequence, name, block]
    end

    def trait(name, &block)
      previous_target = @target
      @target = {}
      @traits[name] = @target
      instance_eval(&block)
      @target = previous_target
    end

    def method_missing(name, *arguments, &block)
      return super unless arguments.empty? && block

      @target[name] = [:value, nil, block]
    end

    def respond_to_missing?(_name, _include_private = false)
      true
    end
  end
end
`,
    harnessAfter: "",
    output: "user1@example.com | suspended | true",
  },
];

function words(value = "") {
  return String(value).trim().split(/\s+/).filter(Boolean).length;
}

const absolutePath = path.join(repoRoot, file);
const document = JSON.parse(fs.readFileSync(absolutePath, "utf8"));
const questions = Array.isArray(document) ? document : document.questions;
if (!Array.isArray(questions) || questions.length !== lessons.length) {
  throw new Error(`Expected exactly ${lessons.length} questions in ${file}`);
}

for (const lesson of lessons) {
  const question = questions.find((candidate) => candidate.slug === lesson.slug);
  if (!question || !question.direct_answer?.trim()) {
    throw new Error(`Missing direct answer or unexpected slug: ${lesson.slug}`);
  }

  const sections = question.answer?.sections;
  const quick = sections?.find((section) => section.type === "key_points");
  const speaking = sections?.find((section) => section.type === "speakable_answer");
  const deep = sections?.find((section) => section.type === "deep_explanation");
  const quickItemCount = Array.isArray(quick?.items)
    ? quick.items.length
    : (quick?.content?.match(/^\s*-\s+/gm) ?? []).length;
  if (quickItemCount < 5) throw new Error(`${lesson.slug} needs a useful Quick Revision`);
  if (words(deep?.content) < 180) {
    throw new Error(`${lesson.slug} needs an independent, substantive Deep Dive`);
  }
  if (deep.content.trim() === speaking?.content?.trim()) {
    throw new Error(`${lesson.slug} reuses the Interview Answer as its Deep Dive`);
  }
  if (!Array.isArray(speaking?.beats) || speaking.beats.length < 3 || speaking.beats.length > 5) {
    throw new Error(`${lesson.slug} needs three to five Interview Answer beats`);
  }

  const stages = speaking.beats.map((beat) => beat.stage?.trim());
  if (stages.some((stage) => !stage) || new Set(stages).size !== stages.length) {
    throw new Error(`${lesson.slug} needs unique concept headings`);
  }
  const inlineCodeCount = speaking.beats.reduce(
    (count, beat) => count + (beat.spokenText.match(/`[^`\n]+`/g) ?? []).length,
    0,
  );
  if (inlineCodeCount < 2) {
    throw new Error(`${lesson.slug} needs short code at its exact explanation points`);
  }

  const supports = speaking.beats.flatMap((beat) => (beat.support ? [beat.support] : []));
  if (supports.length !== 2) throw new Error(`${lesson.slug} needs exactly two purposeful supports`);
  const codeSupports = supports.filter((support) => support.type === "code");
  if (codeSupports.length !== 1 || codeSupports[0].language !== "ruby") {
    throw new Error(`${lesson.slug} needs exactly one executable Ruby code support`);
  }
  const comparisons = supports.filter((support) => support.type === "comparison");
  if (comparisons.length !== 1 || comparisons[0].items?.length < 4) {
    throw new Error(`${lesson.slug} needs one useful comparison`);
  }

  const tempRoot = fs.mkdtempSync(path.join(os.tmpdir(), "ie-ruby-rails-tests-"));
  try {
    const examplePath = path.join(tempRoot, "example.rb");
    const runnable = lesson.directRun
      ? codeSupports[0].code
      : `${lesson.harnessBefore}\n${codeSupports[0].code}\n${lesson.harnessAfter}`;
    fs.writeFileSync(examplePath, `${runnable.trim()}\n`);

    const syntax = spawnSync("ruby", ["-c", examplePath], {
      cwd: tempRoot,
      encoding: "utf8",
    });
    if (syntax.status !== 0) {
      throw new Error(
        `${lesson.slug} syntax failed:\n${syntax.stderr || syntax.stdout || "unknown Ruby error"}`,
      );
    }

    const result = spawnSync("ruby", [examplePath, "--seed", "1"], {
      cwd: tempRoot,
      encoding: "utf8",
    });
    if (result.status !== 0) {
      throw new Error(
        `${lesson.slug} execution failed:\n${result.stderr || result.stdout || "unknown Ruby error"}`,
      );
    }

    const output = result.stdout.trim();
    if (lesson.outputPattern ? !lesson.outputPattern.test(output) : output !== lesson.output) {
      throw new Error(
        `${lesson.slug} output mismatch:\nexpected:\n${lesson.output ?? lesson.outputPattern}\nactual:\n${output}`,
      );
    }
    const evidence = lesson.outputPattern ? output.split("\n").at(-1) : output.replaceAll("\n", " | ");
    console.log(`${lesson.slug}: PASS — ${evidence}`);
  } finally {
    const safePrefix = path.join(os.tmpdir(), "ie-ruby-rails-tests-");
    if (!tempRoot.startsWith(safePrefix)) {
      throw new Error(`Refusing to clean unexpected path: ${tempRoot}`);
    }
    fs.rmSync(tempRoot, { recursive: true, force: true });
  }
}
