#!/usr/bin/env node

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const file = "content/ruby-backend-fresher/rails-basics/rails-conventions/complete-qa.json";

const presentations = [
  {
    slug: "rails-conventions-basics",
    question: "What conventions does Rails use?",
    beats: [
      {
        cue: "Define convention over configuration by the setup it removes",
        stage: "Defaults remove repeated setup",
        spokenText: "Rails follows convention over configuration: it assumes common names, locations, and request patterns, so an application configures mainly the exceptions. These shared defaults let developers and framework tools find a model, controller, route, view, or test without learning a private map for every project.",
      },
      {
        cue: "Connect one resource name across Ruby files database and routes",
        stage: "Names connect the layers",
        spokenText: "For a product resource, the singular `Product` class belongs in `app/models/product.rb` and normally maps to the plural `products` table. `ProductsController` belongs in `app/controllers/products_controller.rb`, while `resources :products` creates familiar routes and action names such as `index`, `show`, `create`, and `update`.",
        support: {
          type: "trace",
          title: "Follow one resource name through Rails conventions",
          items: [
            {
              label: "Ruby model",
              value: "Product",
              detail: "A singular CamelCase constant represents one record.",
              tone: "blue",
            },
            {
              label: "Model file and table",
              value: "product.rb → products",
              detail: "The file is singular snake_case; the inferred table is plural.",
              tone: "green",
            },
            {
              label: "Controller",
              value: "ProductsController",
              detail: "The plural resource name maps to the expected controller file.",
              tone: "orange",
            },
            {
              label: "Resource route",
              value: "resources :products",
              detail: "Rails supplies conventional paths, helpers, and CRUD actions.",
              tone: "neutral",
            },
          ],
        },
      },
      {
        cue: "Show that the conventions provide real framework wiring",
        stage: "Convention supplies wiring",
        spokenText: "The example contains no table-name or controller-path configuration. Active Record infers `products`, the route DSL registers the product resource, and the controller calls the model through its public query API. Following the naming contract is what makes that small amount of code sufficient.",
        support: {
          type: "code",
          title: "A product resource using the shared Rails defaults",
          language: "ruby",
          code: "class Product < ApplicationRecord\nend\n\nclass ProductsController < ApplicationController\n  def index\n    @products = Product.all\n  end\nend\n\nRails.application.routes.draw do\n  resources :products\nend",
          caption: "The model name, controller name, and resource route agree, so Rails can infer the remaining connections.",
        },
      },
      {
        cue: "Explain the autoloading contract and when an override is justified",
        stage: "Exceptions stay explicit",
        spokenText: "Zeitwerk also expects a constant path to match its file path, so `Billing::Invoice` belongs in `billing/invoice.rb` under an autoload root. Conventions are defaults, not laws: a legacy table can use `self.table_name`, but every override adds project knowledge. DRY means one clear source of truth, not forcing unrelated cases into one abstraction.",
        recallRule: "Let one conventional name connect Rails layers, and configure only the real exceptions visibly.",
      },
    ],
  },
  {
    slug: "rails-directory-structure-basics",
    question: "What's in a Rails app's directory structure?",
    beats: [
      {
        cue: "Start with the directory where product behaviour is normally written",
        stage: "app holds product behaviour",
        spokenText: "Most application behaviour lives under `app/`: models and domain objects, controllers, views, jobs, mailers, helpers, and framework components. Putting a class under the matching responsibility and namespace lets Rails loading conventions and teammates find it predictably.",
      },
      {
        cue: "Separate application code configuration and database history",
        stage: "Other roots own other changes",
        spokenText: "`config/` holds routes, environment settings, initializers, and database configuration. `db/` holds migrations plus the current schema representation. Tests live under Rails' `test/` tree or the project's chosen `spec/` tree. Those roots change for different reasons and should not become a miscellaneous storage area.",
        support: {
          type: "comparison",
          title: "Choose a directory from what the file is responsible for",
          items: [
            {
              label: "app/",
              value: "application behaviour and views",
              detail: "Models, controllers, jobs, mailers, helpers, and templates live here.",
              tone: "blue",
            },
            {
              label: "config/",
              value: "boot and operational choices",
              detail: "Routes, environments, initializers, and service configuration belong here.",
              tone: "green",
            },
            {
              label: "db/",
              value: "database evolution and shape",
              detail: "Migrations record changes; schema.rb or structure.sql records the current shape.",
              tone: "orange",
            },
            {
              label: "test/ or spec/",
              value: "automated verification",
              detail: "The chosen test tree keeps checks near the behaviour they describe.",
              tone: "neutral",
            },
          ],
        },
      },
      {
        cue: "Map one product feature across the paths a beginner will use",
        stage: "One feature spans clear paths",
        spokenText: "A product feature may use `app/models/product.rb`, `app/controllers/products_controller.rb`, `app/views/products/show.html.erb`, and a matching test file. The runnable map keeps those responsibilities visible together without pretending that a view template is a Ruby constant.",
        support: {
          type: "code",
          title: "Print the conventional paths for one product feature",
          language: "ruby",
          code: "feature_files = {\n  model: \"app/models/product.rb\",\n  controller: \"app/controllers/products_controller.rb\",\n  view: \"app/views/products/show.html.erb\",\n  controller_test: \"test/controllers/products_controller_test.rb\"\n}.freeze\n\nfeature_files.each do |responsibility, file|\n  puts \"#{responsibility}: #{file}\"\nend",
          caption: "Each path names both the layer and the Product responsibility, making the feature easy to navigate.",
        },
      },
      {
        cue: "Close by distinguishing versioned source from generated runtime data",
        stage: "Runtime data is not source",
        spokenText: "`bin/` contains application-aware command wrappers and `lib/` commonly holds tasks or supporting code. `log/`, `storage/`, and `tmp/` hold generated runtime files that may be replaced between environments. Migrations are history, so change a shared database with a new migration rather than silently editing an old applied one.",
        recallRule: "Place a file by the responsibility and lifecycle it owns: product code, configuration, database history, tests, or replaceable runtime data.",
      },
    ],
  },
  {
    slug: "rails-environments-basics",
    question: "What are Rails environments and how do they differ?",
    beats: [
      {
        cue: "Define an environment as configuration for one shared application",
        stage: "One app has named contexts",
        spokenText: "A Rails environment is a named runtime configuration for the same application code. Rails provides `development`, `test`, and `production` by default. The active name normally selects matching settings and database configuration, but it should not create three different versions of the product's business rules.",
      },
      {
        cue: "Explain where shared settings and named overrides are applied",
        stage: "Configuration builds in layers",
        spokenText: "Shared settings live in `config/application.rb`; files under `config/environments/` override them for one named context. Initializers, credentials, and process-provided values add more specific configuration. Code can inspect `Rails.env`, and a command can select a context with `RAILS_ENV=test`, so the effective value may come from several layers.",
        support: {
          type: "trace",
          title: "Follow a setting from framework default to running process",
          items: [
            {
              label: "Framework default",
              value: "Rails supplies a baseline",
              detail: "The current Rails version defines the starting behaviour.",
              tone: "neutral",
            },
            {
              label: "Application config",
              value: "config/application.rb",
              detail: "Shared choices apply across named environments.",
              tone: "blue",
            },
            {
              label: "Environment override",
              value: "config/environments/*.rb",
              detail: "Development, test, or production changes an operational setting.",
              tone: "green",
            },
            {
              label: "Deployment input",
              value: "credentials or process values",
              detail: "Secrets and service endpoints can be supplied without committing them.",
              tone: "orange",
            },
          ],
        },
      },
      {
        cue: "Show a small production configuration and the effects it chooses",
        stage: "Each context serves a goal",
        spokenText: "Development usually favours reloading and useful local errors, test favours deterministic isolation, and production favours stable serving, caching, and controlled error output. Generated defaults can change by Rails version, so the application's checked-in environment files are authoritative. This production example chooses eager loading and hides detailed exception pages.",
        support: {
          type: "code",
          title: "Set production-serving behaviour at the Rails boundary",
          language: "ruby",
          code: "Rails.application.configure do\n  config.eager_load = true\n  config.consider_all_requests_local = false\nend\n\nputs Rails.application.config.eager_load\nputs Rails.application.config.consider_all_requests_local",
          caption: "The example changes operational behaviour in configuration; it does not place a production-only branch inside a domain rule.",
        },
      },
      {
        cue: "Draw the boundary between operational variation and product meaning",
        stage: "Business rules stay shared",
        spokenText: "Storage services, log level, mail delivery, caching, and external endpoints may differ by environment. Tax calculation, authorization, and other domain meaning should not depend on `Rails.env.production?`, because production would then run behaviour the test environment never proved. Prefer injected configuration or adapters and keep secrets outside committed source.",
        recallRule: "Environments change how one application operates, not what its business rules mean.",
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
  speakable.answerSize = "compact";
  speakable.beats = presentation.beats;
  speakable.content = presentation.beats.map((beat) => beat.spokenText).join("\n\n");
  console.log(`Curated ${presentation.slug}`);
}

fs.writeFileSync(absolutePath, `${JSON.stringify(document, null, 2)}\n`);
