#!/usr/bin/env node

import { spawnSync } from "node:child_process";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

const recordHarness = `
class ModelErrors
  attr_reader :full_messages

  def initialize
    @full_messages = []
  end

  def add(message)
    @full_messages << message
  end
end

class ApplicationRecord
  def self.validations
    @validations ||= []
  end

  def self.validates(attribute, options)
    validations << [attribute, options]
  end

  def self.records
    @records ||= {}
  end

  def self.find(id)
    records.fetch(id)
  end

  attr_reader :id, :errors

  def initialize(attributes = {})
    @attributes = attributes.dup
    @errors = ModelErrors.new
    @destroyed = false
  end

  def save
    @errors = ModelErrors.new
    self.class.validations.each do |attribute, options|
      value = @attributes[attribute]
      if options[:presence] && (value.nil? || value.to_s.empty?)
        errors.add("#{attribute.to_s.capitalize} can't be blank")
      end
    end
    return false unless errors.full_messages.empty?

    @id ||= self.class.records.length + 1
    self.class.records[@id] = self
    true
  end

  def update!(attributes)
    @attributes.merge!(attributes)
    raise "record invalid" unless save
    true
  end

  def destroy
    self.class.records.delete(@id)
    @destroyed = true
    true
  end

  def destroyed?
    @destroyed
  end

  def method_missing(name, *arguments)
    text = name.to_s
    if text.end_with?("=")
      @attributes[text.delete_suffix("=").to_sym] = arguments.first
    elsif text.end_with?("?")
      @attributes[text.delete_suffix("?").to_sym]
    elsif @attributes.key?(name)
      @attributes[name]
    else
      super
    end
  end

  def respond_to_missing?(_name, _include_private = false)
    true
  end
end
`;

const queryHarness = `
ArticleRow = Struct.new(:title)

class Duration
  def initialize(days)
    @days = days
  end

  def ago
    "#{@days}-days-ago"
  end
end

class Numeric
  def days
    Duration.new(self)
  end
end

class ArticleRelation
  include Enumerable

  def initialize
    @rows = [ArticleRow.new("Intro"), ArticleRow.new("Relations")]
    @where_count = 0
    @order = nil
    @limit = @rows.length
  end

  def where(*_arguments)
    @where_count += 1
    self
  end

  def order(value)
    @order = value
    self
  end

  def limit(value)
    @limit = value
    self
  end

  def each(&block)
    @rows.first(@limit).each(&block)
  end

  def to_sql
    direction = @order.map { |name, value| "#{name}:#{value}" }.join(",")
    "where=#{@where_count} order=#{direction} limit=#{@limit}"
  end
end

class Article
  def self.where(*arguments)
    ArticleRelation.new.where(*arguments)
  end
end

author_id = 4
since = "30-days-ago"
`;

const migrationHarness = `
SCHEMA = { tables: {}, indexes: [] }

class TableDefinition
  attr_reader :columns

  def initialize
    @columns = []
  end

  def string(name, **options)
    @columns << [:string, name, options]
  end

  def references(name, **options)
    @columns << [:references, name, options]
  end

  def integer(name, **options)
    @columns << [:integer, name, options]
  end

  def timestamps
    @columns << [:timestamps, :timestamps, {}]
  end
end

def create_table(name)
  table = TableDefinition.new
  yield table
  SCHEMA[:tables][name] = table
end

def add_index(table, column, **options)
  SCHEMA[:indexes] << [table, column, options]
end

module ActiveRecord
  class Migration
    def self.[](_version)
      self
    end
  end
end

def print_schema
  table = SCHEMA[:tables].fetch(:invoices)
  columns = table.columns.map { |_type, name, _options| name }.join(",")
  _table_name, column, options = SCHEMA[:indexes].last
  puts "table=invoices columns=#{columns} index=#{column}:#{options[:unique]}"
end
`;

const validationHarness = `
${recordHarness}

INDEXES = []

def add_index(table, column, **options)
  INDEXES << [table, column, options]
end

module ActiveRecord
  class Migration
    def self.[](_version)
      self
    end
  end

  class RecordInvalid < StandardError
  end
end
`;

const lessons = [
  {
    file: "content/ruby-backend-fresher/active-record-basics/crud-basics/complete-qa.json",
    slug: "rails-activerecord-crud-basics",
    visualType: "comparison",
    guidedBefore: `${recordHarness}\nclass Article < ApplicationRecord\n  validates :title, presence: true\nend`,
    guidedAfter: "",
    guidedOutput: "created 1",
    deepBefore: recordHarness,
    deepAfter: "",
    deepOutput: "created 1\ntrue\ntrue",
  },
  {
    file: "content/ruby-backend-fresher/active-record-basics/crud-basics/complete-qa.json",
    slug: "rails-activerecord-basic-querying",
    visualType: "trace",
    guidedBefore: queryHarness,
    guidedAfter: "puts recent.to_sql",
    guidedOutput: "where=2 order=created_at:desc limit=5",
    deepBefore: queryHarness,
    deepAfter: "",
    deepOutput: "where=2 order=created_at:desc limit=5\nIntro\nRelations",
  },
  {
    file: "content/ruby-backend-fresher/active-record-basics/migrations-basics/complete-qa.json",
    slug: "rails-activerecord-migrations-basics",
    visualType: "trace",
    guidedBefore: migrationHarness,
    guidedAfter: "print_schema",
    guidedOutput: "table=invoices columns=number,account,total_cents,timestamps index=number:true",
    deepBefore: migrationHarness,
    deepAfter: "CreateInvoices.new.change\nprint_schema",
    deepOutput: "table=invoices columns=number,account,total_cents,timestamps index=number:true",
  },
  {
    file: "content/ruby-backend-fresher/active-record-basics/validations-basics/complete-qa.json",
    slug: "rails-activerecord-validations-basics",
    visualType: "trace",
    guidedBefore: validationHarness,
    guidedAfter: "",
    guidedOutput: "Email can't be blank",
    deepBefore: validationHarness,
    deepAfter: `
AddUniqueIndexToAccounts.new.change
table, column, options = INDEXES.last
puts "#{table}.#{column} unique=#{options[:unique]}"
`,
    deepOutput: "Email can't be blank\naccounts.email unique=true",
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

function executeRuby(lesson, label, before, code, after, expectedOutput) {
  const tempRoot = fs.mkdtempSync(path.join(os.tmpdir(), "ie-ruby-active-record-fundamentals-"));
  try {
    const examplePath = path.join(tempRoot, "example.rb");
    fs.writeFileSync(examplePath, `${before.trim()}\n${code.trim()}\n${after.trim()}\n`);

    const syntax = spawnSync("ruby", ["-c", examplePath], {
      cwd: tempRoot,
      encoding: "utf8",
    });
    if (syntax.status !== 0) {
      throw new Error(`${lesson.slug} ${label} syntax failed:\n${syntax.stderr || syntax.stdout}`);
    }

    const result = spawnSync("ruby", [examplePath], {
      cwd: tempRoot,
      encoding: "utf8",
    });
    if (result.status !== 0) {
      throw new Error(`${lesson.slug} ${label} execution failed:\n${result.stderr || result.stdout}`);
    }

    const output = result.stdout.trim();
    if (output !== expectedOutput) {
      throw new Error(
        `${lesson.slug} ${label} output mismatch:\nexpected:\n${expectedOutput}\nactual:\n${output}`,
      );
    }
    console.log(`${lesson.slug} ${label}: PASS — ${output.replaceAll("\n", " | ")}`);
  } finally {
    const safePrefix = path.join(os.tmpdir(), "ie-ruby-active-record-fundamentals-");
    if (!tempRoot.startsWith(safePrefix)) {
      throw new Error(`Refusing to clean unexpected path: ${tempRoot}`);
    }
    fs.rmSync(tempRoot, { recursive: true, force: true });
  }
}

const documents = new Map();
for (const lesson of lessons) {
  if (!documents.has(lesson.file)) {
    const absolutePath = path.join(repoRoot, lesson.file);
    documents.set(lesson.file, JSON.parse(fs.readFileSync(absolutePath, "utf8")));
  }
  const document = documents.get(lesson.file);
  const questions = Array.isArray(document) ? document : document.questions;
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
  const conceptVisuals = supports.filter((support) => support.type === lesson.visualType);
  if (conceptVisuals.length !== 1 || conceptVisuals[0].items?.length < 4) {
    throw new Error(`${lesson.slug} needs one useful ${lesson.visualType}`);
  }
  const extraVisualSections = sections.filter((section) =>
    ["concept_map", "comparison_table", "diagram", "flow_diagram", "sequence_diagram"].includes(
      section.type,
    ),
  );
  if (extraVisualSections.length !== 0) {
    throw new Error(`${lesson.slug} duplicates its guided concept visual`);
  }

  const deepCode = rubyFence(fullCode?.content);
  executeRuby(
    lesson,
    "guided example",
    lesson.guidedBefore,
    codeSupports[0].code,
    lesson.guidedAfter,
    lesson.guidedOutput,
  );
  executeRuby(
    lesson,
    "Deep Dive example",
    lesson.deepBefore,
    deepCode,
    lesson.deepAfter,
    lesson.deepOutput,
  );
}

for (const [file, document] of documents) {
  const questions = Array.isArray(document) ? document : document.questions;
  const expected = lessons.filter((lesson) => lesson.file === file).length;
  if (questions.length !== expected) {
    throw new Error(`Expected exactly ${expected} curated questions in ${file}`);
  }
}
