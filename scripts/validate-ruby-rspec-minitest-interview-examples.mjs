#!/usr/bin/env node

import { spawnSync } from "node:child_process";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const file = "content/ruby-backend-fresher/rails-testing-basics/rspec-minitest-basics/complete-qa.json";

const rspecHarness = `
module RSpec
  @examples = []

  class << self
    attr_reader :examples

    def describe(subject, **metadata, &block)
      Group.new(subject, metadata).instance_eval(&block)
    end
  end

  class Group
    def initialize(subject, metadata = {})
      @subject = subject
      @metadata = metadata
    end

    def describe(_label, &block)
      instance_eval(&block)
    end

    def it(label, &block)
      instance_exec(&block)
      RSpec.examples << label
    end

    def expect(actual)
      Expectation.new(actual)
    end

    def eq(expected)
      Equality.new(expected)
    end
  end

  class Expectation
    def initialize(actual)
      @actual = actual
    end

    def to(matcher)
      raise "expectation failed" unless matcher.matches?(@actual)
    end
  end

  class Equality
    def initialize(expected)
      @expected = expected
    end

    def matches?(actual)
      actual == @expected
    end
  end
end
`;

const lessons = [
  {
    slug: "rails-rspec-vs-minitest-basics",
    harnessBefore: `
class SimpleTestCase
  def self.test(name, &block)
    tests << [name, block]
  end

  def self.tests
    @tests ||= []
  end

  def self.run_all
    tests.each { |_name, block| new.instance_exec(&block) }
  end

  def assert_equal(expected, actual)
    raise "assertion failed" unless expected == actual
  end
end

module ActiveSupport
  class TestCase < SimpleTestCase
  end
end

class Price
  def self.total(subtotal, tax_rate:)
    subtotal + (subtotal * tax_rate)
  end
end

${rspecHarness}
`,
    harnessAfter: `
PriceMinitest.run_all
puts "Minitest:#{PriceMinitest.tests.length}"
puts "RSpec:#{RSpec.examples.length}"
`,
    output: "Minitest:1\nRSpec:1",
  },
  {
    slug: "ruby-rspec-basics",
    harnessBefore: rspecHarness,
    harnessAfter: `
puts "RSpec:#{RSpec.examples.length}"
puts RSpec.examples.first
`,
    output: "RSpec:1\napplies the supplied tax rate",
  },
  {
    slug: "ruby-minitest-basics",
    directRun: true,
    outputPattern: /1 runs, 1 assertions, 0 failures, 0 errors, 0 skips/,
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
  if (words(deep?.content) < 160) {
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
  const visualSupports = supports.filter((support) => ["comparison", "trace"].includes(support.type));
  if (visualSupports.length !== 1 || visualSupports[0].items?.length < 4) {
    throw new Error(`${lesson.slug} needs one useful comparison or trace`);
  }

  const tempRoot = fs.mkdtempSync(path.join(os.tmpdir(), "ie-ruby-test-frameworks-"));
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
    const safePrefix = path.join(os.tmpdir(), "ie-ruby-test-frameworks-");
    if (!tempRoot.startsWith(safePrefix)) {
      throw new Error(`Refusing to clean unexpected path: ${tempRoot}`);
    }
    fs.rmSync(tempRoot, { recursive: true, force: true });
  }
}
