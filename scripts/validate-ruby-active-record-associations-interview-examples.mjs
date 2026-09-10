#!/usr/bin/env node

import { spawnSync } from "node:child_process";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const file = "content/ruby-backend-fresher/active-record-basics/associations-basics/complete-qa.json";

const associationHarness = `
class AssociationCollection
  def initialize(owner, record_class)
    @owner = owner
    @record_class = record_class
  end

  def build(attributes = {})
    record = @record_class.new(attributes)
    record.public_send("#{@owner.class.name.downcase}=", @owner)
    record
  end
end

class ApplicationRecord
  def self.associations
    @associations ||= {}
  end

  def self.has_many(name, dependent: nil)
    associations[name] = { kind: :has_many, dependent: dependent }
    define_method(name) do
      class_name = name.to_s.sub(/s\\z/, "").capitalize
      AssociationCollection.new(self, Object.const_get(class_name))
    end
  end

  def self.belongs_to(name)
    associations[name] = { kind: :belongs_to }
    attr_accessor name
  end

  def initialize(attributes = {})
    attributes.each { |name, value| instance_variable_set("@#{name}", value) }
  end
end

module ActiveRecord
  class Migration
    @@references = []

    def self.[](_version)
      self
    end

    def self.references
      @@references
    end

    def add_reference(table, name, **options)
      @@references << [table, name, options]
    end
  end
end
`;

const queryHarness = `
AuthorRow = Struct.new(:name)
PostRow = Struct.new(:title, :author)
QUERY_PLAN = []

class PostRelation
  include Enumerable

  def initialize
    @rows = [
      PostRow.new("First", AuthorRow.new("Ada")),
      PostRow.new("Second", AuthorRow.new("Grace"))
    ]
    @limit = @rows.length
  end

  def includes(name)
    QUERY_PLAN << [:includes, name]
    self
  end

  def order(values)
    QUERY_PLAN << [:order, values]
    self
  end

  def limit(value)
    QUERY_PLAN << [:limit, value]
    @limit = value
    self
  end

  def each(&block)
    @rows.first(@limit).each(&block)
  end
end

class Post
  def self.includes(name)
    PostRelation.new.includes(name)
  end
end
`;

const lessons = [
  {
    slug: "rails-activerecord-associations-basics",
    visualType: "trace",
    guidedHarness: associationHarness,
    guidedAfter: `
puts "#{Post.associations[:comments][:kind]} comments #{Post.associations[:comments][:dependent]}"
puts "#{Comment.associations[:post][:kind]} post"
`,
    guidedOutput: "has_many comments destroy\nbelongs_to post",
    deepHarness: associationHarness,
    deepAfter: `
AddPostToComments.new.change
table, name, options = ActiveRecord::Migration.references.last
puts "#{table}.#{name}|null=#{options[:null]}|index=#{options[:index]}|foreign_key=#{options[:foreign_key]}"
`,
    deepOutput: "true\ncomments.post|null=false|index=true|foreign_key=true",
  },
  {
    slug: "rails-activerecord-n-plus-1-intro",
    visualType: "trace",
    guidedHarness: queryHarness,
    guidedAfter: `
includes = QUERY_PLAN.find { |entry| entry[0] == :includes }[1]
limit = QUERY_PLAN.find { |entry| entry[0] == :limit }[1]
puts "plan includes=#{includes} limit=#{limit}"
`,
    guidedOutput: "First — Ada\nSecond — Grace\nplan includes=author limit=20",
    deepHarness: queryHarness,
    deepAfter: `
includes = QUERY_PLAN.find { |entry| entry[0] == :includes }[1]
limit = QUERY_PLAN.find { |entry| entry[0] == :limit }[1]
puts "plan includes=#{includes} limit=#{limit}"
`,
    deepOutput: "First — Ada\nSecond — Grace\nplan includes=author limit=2",
  },
];

function words(value = "") {
  return String(value).trim().split(/\s+/).filter(Boolean).length;
}

function rubyFence(value = "") {
  const match = String(value).match(/```ruby\s*\n([\s\S]*?)```/i);
  if (!match) throw new Error("Deep Dive code example needs one Ruby fence");
  return match[1].trim();
}

function executeRuby(slug, label, before, code, after, expectedOutput) {
  const tempRoot = fs.mkdtempSync(path.join(os.tmpdir(), "ie-ruby-active-record-associations-"));
  try {
    const examplePath = path.join(tempRoot, "example.rb");
    fs.writeFileSync(examplePath, `${before.trim()}\n${code.trim()}\n${after.trim()}\n`);

    const syntax = spawnSync("ruby", ["-c", examplePath], {
      cwd: tempRoot,
      encoding: "utf8",
    });
    if (syntax.status !== 0) {
      throw new Error(`${slug} ${label} syntax failed:\n${syntax.stderr || syntax.stdout}`);
    }

    const result = spawnSync("ruby", [examplePath], {
      cwd: tempRoot,
      encoding: "utf8",
    });
    if (result.status !== 0) {
      throw new Error(`${slug} ${label} execution failed:\n${result.stderr || result.stdout}`);
    }

    const output = result.stdout.trim();
    if (output !== expectedOutput) {
      throw new Error(
        `${slug} ${label} output mismatch:\nexpected:\n${expectedOutput}\nactual:\n${output}`,
      );
    }
    console.log(`${slug} ${label}: PASS — ${output.replaceAll("\n", " | ")}`);
  } finally {
    const safePrefix = path.join(os.tmpdir(), "ie-ruby-active-record-associations-");
    if (!tempRoot.startsWith(safePrefix)) {
      throw new Error(`Refusing to clean unexpected path: ${tempRoot}`);
    }
    fs.rmSync(tempRoot, { recursive: true, force: true });
  }
}

const absolutePath = path.join(repoRoot, file);
const document = JSON.parse(fs.readFileSync(absolutePath, "utf8"));
const questions = Array.isArray(document) ? document : document.questions;
if (!Array.isArray(questions) || questions.length !== lessons.length) {
  throw new Error(`Expected exactly ${lessons.length} questions in ${file}`);
}

for (const lesson of lessons) {
  const question = questions.find((candidate) => candidate.slug === lesson.slug);
  if (!question || words(question.direct_answer) < 55) {
    throw new Error(`Missing useful direct answer or unexpected slug: ${lesson.slug}`);
  }

  const sections = question.answer?.sections;
  const quick = sections?.find((section) => section.type === "key_points");
  const speaking = sections?.find((section) => section.type === "speakable_answer");
  const deep = sections?.find((section) => section.type === "deep_explanation");
  const fullCode = sections?.find((section) => section.type === "code_example");
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
  if (inlineCodeCount < 3) {
    throw new Error(`${lesson.slug} needs short Rails code at its exact explanation points`);
  }

  const supports = speaking.beats.flatMap((beat) => (beat.support ? [beat.support] : []));
  if (supports.length !== 2) throw new Error(`${lesson.slug} needs exactly two purposeful supports`);
  const codeSupports = supports.filter((support) => support.type === "code");
  if (codeSupports.length !== 1 || codeSupports[0].language !== "ruby") {
    throw new Error(`${lesson.slug} needs exactly one Ruby code support`);
  }
  const relationVisuals = supports.filter((support) => support.type === lesson.visualType);
  if (relationVisuals.length !== 1 || relationVisuals[0].items?.length < 4) {
    throw new Error(`${lesson.slug} needs exactly one useful relation/process visual`);
  }
  const extraVisualSections = sections.filter((section) =>
    ["concept_map", "comparison_table", "diagram", "flow_diagram", "sequence_diagram"].includes(
      section.type,
    ),
  );
  if (extraVisualSections.length !== 0) {
    throw new Error(`${lesson.slug} duplicates its guided relation/process visual`);
  }

  const deepCode = rubyFence(fullCode?.content);
  executeRuby(
    lesson.slug,
    "guided example",
    lesson.guidedHarness,
    codeSupports[0].code,
    lesson.guidedAfter,
    lesson.guidedOutput,
  );
  executeRuby(
    lesson.slug,
    "Deep Dive example",
    lesson.deepHarness,
    deepCode,
    lesson.deepAfter,
    lesson.deepOutput,
  );
}
