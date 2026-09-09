#!/usr/bin/env node

import { spawnSync } from "node:child_process";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

const lessons = [
  {
    file: "content/ruby-backend-fresher/rails-forms-and-views/erb-basics/complete-qa.json",
    slug: "rails-erb-basics",
    harness: `
require "erb"

Product = Struct.new(:name)
products = [Product.new("Mug"), Product.new("Book")]
rendered = ERB.new(File.read(ARGV.fetch(0)), trim_mode: "-").result(binding)

raise "heading missing" unless rendered.include?("<h1>Products</h1>")
raise "first item missing" unless rendered.include?("<li>Mug</li>")
raise "second item missing" unless rendered.include?("<li>Book</li>")
raise "ERB comment leaked" if rendered.include?("This comment")

puts "Mug,Book"
puts "comment-removed"
`,
    output: "Mug,Book\ncomment-removed",
  },
  {
    file: "content/ruby-backend-fresher/rails-forms-and-views/form-with/complete-qa.json",
    slug: "rails-form-with-basics",
    transform(source) {
      const opening = "<%= form_with model: article do |form| %>";
      if (!source.includes(opening)) throw new Error("form_with example opening changed");
      // Rails' output buffer captures this helper block. Standard-library ERB does
      // not implement that capture rule, so the harness changes only the outer tag.
      return source.replace(opening, "<% form_with(model: article) do |form| %>");
    },
    harness: `
require "erb"

Article = Struct.new(:title)

class FormBuilder
  def initialize(model)
    @model = model
  end

  def label(attribute)
    %(<label for="article_#{attribute}">Title</label>)
  end

  def text_field(attribute)
    %(<input name="article[#{attribute}]" value="#{@model.public_send(attribute)}">)
  end

  def submit
    %(<button type="submit">Save</button>)
  end
end

article = Article.new("Guide")

def form_with(model:)
  yield FormBuilder.new(model)
  nil
end

rendered = ERB.new(File.read(ARGV.fetch(0)), trim_mode: "-").result(binding)
raise "label missing" unless rendered.include?(%(<label for="article_title">Title</label>))
raise "scoped input missing" unless rendered.include?(%(name="article[title]"))
raise "model value missing" unless rendered.include?(%(value="Guide"))
raise "submit missing" unless rendered.include?(%(<button type="submit">Save</button>))

puts "article[title]"
puts "Guide"
puts "Save"
`,
    output: "article[title]\nGuide\nSave",
  },
  {
    file: "content/ruby-backend-fresher/rails-forms-and-views/partials-layouts/complete-qa.json",
    slug: "rails-partials-and-layouts-basics",
    harness: `
require "erb"

Product = Struct.new(:id, :name)
product = Product.new(7, "Desk")

def dom_id(record)
  "product_#{record.id}"
end

rendered = ERB.new(File.read(ARGV.fetch(0)), trim_mode: "-").result(binding)
raise "DOM id missing" unless rendered.include?(%(id="product_7"))
raise "product local missing" unless rendered.include?("<h2>Desk</h2>")

puts "product_7"
puts "Desk"
`,
    output: "product_7\nDesk",
  },
];

function words(value = "") {
  return String(value).trim().split(/\s+/).filter(Boolean).length;
}

for (const lesson of lessons) {
  const absolutePath = path.join(repoRoot, lesson.file);
  const document = JSON.parse(fs.readFileSync(absolutePath, "utf8"));
  const questions = Array.isArray(document) ? document : document.questions;
  if (!Array.isArray(questions) || questions.length !== 1) {
    throw new Error(`Expected one question in ${lesson.file}`);
  }

  const question = questions[0];
  if (question.slug !== lesson.slug || !question.direct_answer?.trim()) {
    throw new Error(`Missing direct answer or unexpected slug: ${lesson.slug}`);
  }

  const sections = question.answer?.sections;
  const quick = sections?.find((section) => section.type === "key_points");
  const speaking = sections?.find((section) => section.type === "speakable_answer");
  const deep = sections?.find((section) => section.type === "deep_explanation");
  const quickItemCount = Array.isArray(quick?.items)
    ? quick.items.length
    : (quick?.content?.match(/^\s*-\s+/gm) ?? []).length;
  if (quickItemCount < 5) {
    throw new Error(`${lesson.slug} needs a useful Quick Revision`);
  }
  if (words(deep?.content) < 150) {
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
  if (supports.length !== 2) {
    throw new Error(`${lesson.slug} needs exactly two purposeful supports`);
  }
  const codeSupports = supports.filter((support) => support.type === "code");
  if (codeSupports.length !== 1 || codeSupports[0].language !== "erb") {
    throw new Error(`${lesson.slug} needs exactly one executable ERB code support`);
  }
  const visualSupports = supports.filter((support) => ["comparison", "trace"].includes(support.type));
  if (visualSupports.length !== 1 || visualSupports[0].items?.length < 3) {
    throw new Error(`${lesson.slug} needs one useful comparison or trace`);
  }

  const source = codeSupports[0].code.trim();
  const openingTags = source.match(/<%/g)?.length ?? 0;
  const closingTags = source.match(/%>/g)?.length ?? 0;
  if (openingTags === 0 || openingTags !== closingTags) {
    throw new Error(`${lesson.slug} has unbalanced ERB delimiters`);
  }

  const executableSource = lesson.transform ? lesson.transform(source) : source;
  const tempRoot = fs.mkdtempSync(path.join(os.tmpdir(), "ie-ruby-rails-forms-"));
  try {
    const templatePath = path.join(tempRoot, "example.erb");
    const harnessPath = path.join(tempRoot, "run.rb");
    fs.writeFileSync(templatePath, `${executableSource}\n`);
    fs.writeFileSync(harnessPath, `${lesson.harness.trim()}\n`);

    const syntax = spawnSync("ruby", ["-c", harnessPath], {
      cwd: tempRoot,
      encoding: "utf8",
    });
    if (syntax.status !== 0) {
      throw new Error(
        `${lesson.slug} harness syntax failed:\n${syntax.stderr || syntax.stdout || "unknown Ruby error"}`,
      );
    }

    const result = spawnSync("ruby", [harnessPath, templatePath], {
      cwd: tempRoot,
      encoding: "utf8",
    });
    if (result.status !== 0) {
      throw new Error(
        `${lesson.slug} execution failed:\n${result.stderr || result.stdout || "unknown Ruby error"}`,
      );
    }

    const output = result.stdout.trim();
    if (output !== lesson.output) {
      throw new Error(
        `${lesson.slug} output mismatch:\nexpected:\n${lesson.output}\nactual:\n${output}`,
      );
    }
    console.log(`${lesson.slug}: PASS — ${output.replaceAll("\n", " | ")}`);
  } finally {
    const safePrefix = path.join(os.tmpdir(), "ie-ruby-rails-forms-");
    if (!tempRoot.startsWith(safePrefix)) {
      throw new Error(`Refusing to clean unexpected path: ${tempRoot}`);
    }
    fs.rmSync(tempRoot, { recursive: true, force: true });
  }
}
