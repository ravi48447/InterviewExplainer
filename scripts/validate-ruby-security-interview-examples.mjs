#!/usr/bin/env node

import { spawnSync } from "node:child_process";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

const lessons = [
  {
    file: "content/ruby-backend-fresher/ruby-security-basics/sql-injection-basics/complete-qa.json",
    slug: "ruby-sql-injection-basics",
    harnessBefore: `
module ActiveRecord
  class Base
    def self.sanitize_sql_like(value)
      value.gsub(/([\\\\%_])/) { |character| "\\\\" + character }
    end
  end
end

class Relation
  attr_reader :sql, :bound, :order_value, :limit_value

  def initialize(sql, bound)
    @sql = sql
    @bound = bound
  end

  def order(value)
    @order_value = value
    self
  end

  def limit(value)
    @limit_value = value
    self
  end
end

class User
  def self.where(sql, bound)
    Relation.new(sql, bound)
  end
end
`,
    harnessAfter: `
result = UserSearch.call(email: "a_b%", sort: "title")
raise "query shape changed" unless result.sql == "email LIKE ?"
raise "LIKE value was not escaped" unless result.bound == "%a\\\\_b\\\\%%"
raise "sort was not allowlisted" unless result.order_value == { title: :asc }
raise "limit changed" unless result.limit_value == 50

puts result.sql
puts result.bound
puts result.order_value
puts result.limit_value
`,
    output: String.raw`email LIKE ?
%a\_b\%%
{:title=>:asc}
50`,
  },
  {
    file: "content/ruby-backend-fresher/ruby-security-basics/strong-params/complete-qa.json",
    slug: "ruby-strong-params-basics",
    harnessBefore: `
class FakeParameters
  def expect(shape)
    expected = { user: [:name, :email, :time_zone] }
    raise "unexpected permitted shape" unless shape == expected

    { name: "Mina", email: "mina@example.test", time_zone: "UTC" }
  end
end

class UserRecord
  attr_reader :attributes

  def update!(attributes)
    @attributes = attributes
  end
end

class ApplicationController
  attr_reader :status

  def initialize
    @current_user = UserRecord.new
    @params = FakeParameters.new
  end

  def current_user
    @current_user
  end

  def params
    @params
  end

  def head(status)
    @status = status
  end
end
`,
    harnessAfter: `
controller = UsersController.new
controller.update
puts controller.current_user.attributes
puts controller.status
`,
    output: `{:name=>"Mina", :email=>"mina@example.test", :time_zone=>"UTC"}
no_content`,
  },
  {
    file: "content/ruby-backend-fresher/ruby-security-basics/xss-basics/complete-qa.json",
    slug: "ruby-xss-basics",
    harnessBefore: "",
    harnessAfter: "",
    output: "<p>&lt;img src=x onerror=&quot;alert(1)&quot;&gt;</p>",
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
  if (!Array.isArray(quick?.items) || quick.items.length < 5) {
    throw new Error(`${lesson.slug} needs a useful Quick Revision`);
  }
  if (words(deep?.content) < 250) {
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
  if (codeSupports.length !== 1 || codeSupports[0].language !== "ruby") {
    throw new Error(`${lesson.slug} needs exactly one executable Ruby code support`);
  }
  const visualSupports = supports.filter((support) => ["comparison", "trace"].includes(support.type));
  if (visualSupports.length !== 1 || visualSupports[0].items?.length < 3) {
    throw new Error(`${lesson.slug} needs one useful comparison or trace`);
  }

  const tempRoot = fs.mkdtempSync(path.join(os.tmpdir(), "ie-ruby-security-"));
  try {
    const examplePath = path.join(tempRoot, "example.rb");
    fs.writeFileSync(examplePath, `${codeSupports[0].code.trim()}\n`);
    const syntax = spawnSync("ruby", ["-c", examplePath], {
      cwd: tempRoot,
      encoding: "utf8",
    });
    if (syntax.status !== 0) {
      throw new Error(
        `${lesson.slug} syntax failed:\n${syntax.stderr || syntax.stdout || "unknown Ruby error"}`,
      );
    }

    const runnablePath = path.join(tempRoot, "run.rb");
    fs.writeFileSync(
      runnablePath,
      `${lesson.harnessBefore}\n${codeSupports[0].code}\n${lesson.harnessAfter}\n`,
    );
    const result = spawnSync("ruby", [runnablePath], {
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
    const safePrefix = path.join(os.tmpdir(), "ie-ruby-security-");
    if (!tempRoot.startsWith(safePrefix)) {
      throw new Error(`Refusing to clean unexpected path: ${tempRoot}`);
    }
    fs.rmSync(tempRoot, { recursive: true, force: true });
  }
}
