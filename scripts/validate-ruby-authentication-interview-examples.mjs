#!/usr/bin/env node

import { spawnSync } from "node:child_process";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

const railsBase = `
module Rails
  class Environment
    def production?
      true
    end
  end

  def self.env
    @env ||= Environment.new
  end
end
`;

const lessons = [
  {
    file: "content/ruby-backend-fresher/authentication-basics/devise-basics/complete-qa.json",
    slug: "rails-devise-auth-basics",
    harnessBefore:
      railsBase +
      `
module Rails
  class Routes
    attr_reader :mapped_scope

    def draw(&block)
      instance_eval(&block)
    end

    def devise_for(scope)
      @mapped_scope = scope
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

class ApplicationRecord
  def self.devise(*modules)
    @devise_modules = modules
  end

  def self.devise_modules
    @devise_modules
  end
end

class ApplicationController
  def self.before_action(name)
    @before_action_name = name
  end

  def self.before_action_name
    @before_action_name
  end

  def current_user
    Struct.new(:name).new('Mina')
  end
end
`,
    harnessAfter: `
controller = DashboardController.new
controller.show
puts Rails.application.routes.mapped_scope
puts User.devise_modules.join(',')
puts DashboardController.before_action_name
puts controller.instance_variable_get(:@account_name)
`,
    output: "users\ndatabase_authenticatable,recoverable,validatable\nauthenticate_user!\nMina",
  },
  {
    file: "content/ruby-backend-fresher/authentication-basics/sessions-and-cookies/complete-qa.json",
    slug: "rails-sessions-and-cookies-basics",
    harnessBefore:
      railsBase +
      `
UserRecord = Struct.new(:id)

class User
  def self.authenticate_by(email:, password:)
    return unless email == 'mina@example.test' && password == 'secret'

    UserRecord.new(7)
  end
end

class ApplicationController
  attr_reader :redirected_to

  def params
    { email: 'mina@example.test', password: 'secret' }
  end

  def reset_session
    @session = {}
  end

  def session
    @session ||= {}
  end

  def cookies
    @cookies ||= {}
  end

  def head(status)
    @status = status
  end

  def redirect_to(path)
    @redirected_to = path
  end

  def dashboard_path
    '/dashboard'
  end

  def root_path
    '/'
  end
end
`,
    harnessAfter: `
controller = SessionsController.new
controller.create
puts controller.session[:user_id]
p controller.cookies[:theme]
puts controller.redirected_to
controller.destroy
p controller.session[:user_id]
puts controller.redirected_to
`,
    output: "7\n{:value=>\"dark\", :same_site=>:lax, :secure=>true}\n/dashboard\nnil\n/",
  },
  {
    file: "content/ruby-backend-fresher/authentication-basics/token-auth-intro/complete-qa.json",
    slug: "rails-token-auth-intro",
    harnessBefore: "",
    harnessAfter: "",
    output: "{:user_id=>42, :scope=>\"profile:read\"}\nnil",
  },
];

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
  if (quickItemCount < 4) throw new Error(`${lesson.slug} needs a useful Quick Revision`);
  if (!deep?.content?.trim()) throw new Error(`${lesson.slug} needs a specific Deep Dive`);
  if (!Array.isArray(speaking?.beats) || speaking.beats.length < 3 || speaking.beats.length > 5) {
    throw new Error(`${lesson.slug} needs three to five Interview Answer beats`);
  }

  const supports = speaking.beats.flatMap((beat) => (beat.support ? [beat.support] : []));
  if (supports.length > 2) {
    throw new Error(`${lesson.slug} has ${supports.length} supports; maximum is two`);
  }
  const codeSupports = supports.filter((support) => support.type === "code");
  if (codeSupports.length !== 1 || codeSupports[0].language !== "ruby") {
    throw new Error(`${lesson.slug} needs exactly one Ruby code support`);
  }

  const tempRoot = fs.mkdtempSync(path.join(os.tmpdir(), "ie-ruby-auth-"));
  try {
    const examplePath = path.join(tempRoot, "example.rb");
    fs.writeFileSync(examplePath, codeSupports[0].code.trim() + "\n");
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
    const safePrefix = path.join(os.tmpdir(), "ie-ruby-auth-");
    if (!tempRoot.startsWith(safePrefix)) {
      throw new Error(`Refusing to clean unexpected path: ${tempRoot}`);
    }
    fs.rmSync(tempRoot, { recursive: true, force: true });
  }
}
