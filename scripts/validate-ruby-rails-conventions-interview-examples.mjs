#!/usr/bin/env node

import { spawnSync } from "node:child_process";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const file = "content/ruby-backend-fresher/rails-basics/rails-conventions/complete-qa.json";

const lessons = [
  {
    slug: "rails-conventions-basics",
    visualType: "trace",
    harnessBefore: `
class ApplicationRecord
  def self.inherited(child)
    child.define_singleton_method(:table_name) do
      name.gsub(/([a-z\\d])([A-Z])/, "\\1_\\2").downcase + "s"
    end
    child.define_singleton_method(:all) { ["Desk"] }
  end
end

class ApplicationController
end

module Rails
  class Routes
    attr_reader :resource

    def draw(&block)
      instance_eval(&block)
    end

    def resources(name)
      @resource = name
    end
  end

  class Application
    attr_reader :routes

    def initialize
      @routes = Routes.new
    end
  end

  def self.application
    @application ||= Application.new
  end
end
`,
    harnessAfter: `
controller = ProductsController.new
controller.index
puts Product.table_name
puts Rails.application.routes.resource
puts controller.instance_variable_get(:@products).first
`,
    output: "products\nproducts\nDesk",
  },
  {
    slug: "rails-directory-structure-basics",
    visualType: "comparison",
    output:
      "model: app/models/product.rb\ncontroller: app/controllers/products_controller.rb\nview: app/views/products/show.html.erb\ncontroller_test: test/controllers/products_controller_test.rb",
  },
  {
    slug: "rails-environments-basics",
    visualType: "trace",
    harnessBefore: `
module Rails
  class Config
    attr_accessor :eager_load, :consider_all_requests_local
  end

  class Application
    attr_reader :config

    def initialize
      @config = Config.new
    end

    def configure(&block)
      instance_eval(&block)
    end
  end

  def self.application
    @application ||= Application.new
  end
end
`,
    output: "true\nfalse",
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
  if (!question || words(question.direct_answer) < 45) {
    throw new Error(`Missing useful direct answer or unexpected slug: ${lesson.slug}`);
  }

  const sections = question.answer?.sections;
  const quick = sections?.find((section) => section.type === "key_points");
  const speaking = sections?.find((section) => section.type === "speakable_answer");
  const deep = sections?.find((section) => section.type === "deep_explanation");
  const quickItemCount = Array.isArray(quick?.items)
    ? quick.items.length
    : (quick?.content?.match(/^\s*-\s+/gm) ?? []).length;
  if (quickItemCount < 5) throw new Error(`${lesson.slug} needs a useful Quick Revision`);
  if (words(deep?.content) < 140) {
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
  const visualSupports = supports.filter((support) => support.type === lesson.visualType);
  if (visualSupports.length !== 1 || visualSupports[0].items?.length < 4) {
    throw new Error(`${lesson.slug} needs one useful ${lesson.visualType}`);
  }

  const tempRoot = fs.mkdtempSync(path.join(os.tmpdir(), "ie-ruby-rails-conventions-"));
  try {
    const examplePath = path.join(tempRoot, "example.rb");
    const runnable = `${lesson.harnessBefore ?? ""}\n${codeSupports[0].code}\n${lesson.harnessAfter ?? ""}`;
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

    const result = spawnSync("ruby", [examplePath], {
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
    const safePrefix = path.join(os.tmpdir(), "ie-ruby-rails-conventions-");
    if (!tempRoot.startsWith(safePrefix)) {
      throw new Error(`Refusing to clean unexpected path: ${tempRoot}`);
    }
    fs.rmSync(tempRoot, { recursive: true, force: true });
  }
}
