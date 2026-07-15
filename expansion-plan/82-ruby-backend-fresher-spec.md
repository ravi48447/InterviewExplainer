# 82 — New Domain: `ruby-backend-fresher` (FULL SPEC)

> **Executor:** AI coding agent.
> **Working directory:** `/Users/ravi.r_flx/IEProject/InterviewExplainer/`.
> **Type:** new locked-domain blueprint. Source of truth for RBF scaffold and content.
> Playbooks that implement this spec should read it in full before touching any file.

## TL;DR

- **Goal:** RBF is the fresher/entry-level Ruby domain — a 0–2 YOE lens that answers genuinely different questions at a different reading level than RBI.
- **Audience:** 0–2 YOE Ruby developers, fresh grads, bootcamp completers, career switchers targeting Rails-based companies (typically startups).
- **Pillars used:** 8 of 12 (P01, P02, P03, P04, P06, P08, P09, P12). Excludes P05 (advanced async/messaging), P07 (system design), P10 (cloud), P11 (production SRE) — those belong to RBI.
- **Target total Q at launch:** 380–420.

## Why a separate domain?

A "fresher" lens is NOT a watered-down RBI. It requires:

1. **Different difficulty mix:** 60% easy / 35% medium / 5% hard.
2. **Different vocabulary:** every Ruby and Rails term defined on first use; no assumed knowledge of middleware, Rack, or ActiveRecord internals.
3. **Different example shape:** every code block can be run as a standalone script or a minimal Rails app — no complex service-object chains.
4. **Different follow-ups:** "what will the interviewer probe next?" not "how would this scale at 10M req/s?".
5. **Different SEO targets:** `ruby interview questions for beginners`, `ruby on rails basics interview`, `ruby fresher interview questions`.

---

## Domain metadata

```json
{
  "domainSlug": "ruby-backend-fresher",
  "language": "ruby",
  "level": "fresher",
  "seoSlug": "ruby-interview-questions-for-freshers",
  "altSlugs": [
    "ruby-on-rails-interview-questions-for-freshers",
    "ruby-basic-interview-questions",
    "ruby-beginner-interview-questions",
    "ruby-developer-interview-questions-for-freshers",
    "ruby-on-rails-basics-interview-questions"
  ],
  "label": "Ruby Backend (Fresher)",
  "blurb": "Ruby backend interview prep for 0–2 YOE: Ruby language basics, OOP, blocks and iterators, Rails MVC, Active Record fundamentals, basic APIs, testing, git/bundler, and behavioral questions for junior roles.",
  "audience": "0-2 YOE Ruby developers, fresh grads, bootcamp graduates",
  "versionPin": "Ruby 3.3 / Rails 7.2"
}
```

---

## Module specification (13 modules)

| #  | Module slug                            | Pillar | Min Q | Difficulty (E/M/H) | Notes                                                                      |
|----|----------------------------------------|--------|-------|--------------------|----------------------------------------------------------------------------|
| 1  | `ruby-language-basics`                 | P01    | 45    | 65/30/5            | Data types, variables, conditionals, loops, methods, strings, symbols      |
| 2  | `ruby-oop-basics`                      | P01    | 35    | 60/35/5            | Classes, objects, inheritance, encapsulation, modules at surface level     |
| 3  | `blocks-and-iterators`                 | P01    | 30    | 60/35/5            | Block syntax, yield, each/map/select/reject — no proc/lambda depth yet     |
| 4  | `rails-basics`                         | P02    | 40    | 60/35/5            | MVC intro, routes, controllers, views, Rails hello world, convention       |
| 5  | `active-record-basics`                 | P03    | 35    | 60/35/5            | CRUD, validations, basic associations, migrations at concept level         |
| 6  | `rest-api-basics`                      | P04    | 25    | 65/30/5            | HTTP verbs, status codes, JSON, Postman, basic controller response         |
| 7  | `oop-and-design-basics`                | P06    | 25    | 55/40/5            | Object design thinking, simple Ruby OOP patterns, SOLID intro              |
| 8  | `error-handling-basics`                | P01    | 20    | 65/30/5            | begin/rescue/ensure, raise, custom exceptions at concept level             |
| 9  | `ruby-modules-basics`                  | P01    | 20    | 60/35/5            | include vs extend at surface, Comparable, Enumerable basics                |
| 10 | `rails-testing-basics`                 | P08(*) | 20    | 60/35/5            | Minitest / RSpec basics — first test, assertions, running tests            |
| 11 | `git-and-bundler-basics`               | P09    | 25    | 70/25/5            | git commands, Gemfile, bundle install, Gemfile.lock, semantic versioning   |
| 12 | `rails-forms-and-views`                | P02    | 20    | 65/30/5            | form_with, partials, layouts, simple view helpers for junior devs          |
| 13 | `behavioral-and-fresher-qa`            | P12    | 55    | 50/45/5            | Self-intro, college/bootcamp projects, "why Ruby/Rails", weakness, STAR    |

(*) `rails-testing-basics` uses P08 so it joins the Testing pillar but the content level stays fresher.

**Total minimum: 395 Q.**

---

## Difficulty distribution

Default: 60% easy / 35% medium / 5% hard.

`oop-and-design-basics` tilts medium-heavy: 50/45/5.

---

## Archetype distribution (per module, default)

A = 50%, B = 30%, C = 5%, D = 5%, E = 5%, G = 5%.

- `behavioral-and-fresher-qa`: G = 95%.
- `blocks-and-iterators`, `ruby-oop-basics`: B = 40% (comparison-heavy at basics level).

---

## Search-phrase keyword map (top 20)

| Search phrase                                              | Owner module                    |
|------------------------------------------------------------|---------------------------------|
| `ruby interview questions for freshers`                    | (domain landing)                |
| `ruby on rails interview questions for beginners`          | (domain landing)                |
| `ruby basic interview questions`                           | ruby-language-basics            |
| `ruby data types interview questions`                      | ruby-language-basics            |
| `ruby string methods interview questions`                  | ruby-language-basics            |
| `ruby oop interview questions for beginners`               | ruby-oop-basics                 |
| `ruby class and object interview questions`                | ruby-oop-basics                 |
| `ruby blocks interview questions`                          | blocks-and-iterators            |
| `ruby each vs map vs select`                               | blocks-and-iterators            |
| `rails interview questions for beginners`                  | rails-basics                    |
| `rails mvc interview questions`                            | rails-basics                    |
| `active record basics interview questions`                 | active-record-basics            |
| `rails migrations interview questions for freshers`        | active-record-basics            |
| `ruby on rails rest api basics`                            | rest-api-basics                 |
| `ruby error handling interview questions`                  | error-handling-basics           |
| `ruby modules mixins interview questions beginners`        | ruby-modules-basics             |
| `rspec minitest basics interview`                          | rails-testing-basics            |
| `bundler gemfile interview questions`                      | git-and-bundler-basics          |
| `ruby fresher behavioral interview questions`              | behavioral-and-fresher-qa       |
| `tell me about yourself ruby developer fresher`            | behavioral-and-fresher-qa       |

---

## Money comparison questions (fresher-level canonical list)

1. `nil vs false in Ruby` (ruby-language-basics)
2. `Symbol vs String in Ruby (basics)` (ruby-language-basics)
3. `Array vs Hash in Ruby` (ruby-language-basics)
4. `puts vs print vs p in Ruby` (ruby-language-basics)
5. `== vs .equal? in Ruby (basics)` (ruby-language-basics)
6. `each vs map vs select vs reject` (blocks-and-iterators)
7. `do/end block vs curly-brace block` (blocks-and-iterators)
8. `Class vs Module in Ruby` (ruby-oop-basics)
9. `Instance variable vs class variable` (ruby-oop-basics)
10. `attr_accessor vs attr_reader vs attr_writer` (ruby-oop-basics)
11. `include vs extend at basics level` (ruby-modules-basics)
12. `rescue vs ensure vs raise` (error-handling-basics)
13. `GET vs POST vs PUT vs DELETE` (rest-api-basics)
14. `render vs redirect_to in Rails` (rails-basics)
15. `save vs save! vs create vs create!` (active-record-basics)
16. `belongs_to vs has_many (basics)` (active-record-basics)
17. `validates_presence_of vs validates :name, presence: true` (active-record-basics)
18. `Gemfile vs Gemfile.lock` (git-and-bundler-basics)
19. `git merge vs git rebase (basics)` (git-and-bundler-basics)
20. `Minitest vs RSpec` (rails-testing-basics)

---

## Landing intro template

```text
Ruby Interview Questions for Freshers and Beginners

This page covers what real Ruby and Ruby on Rails interviews test for
0–2 YOE candidates in 2026 — the Ruby language fundamentals (data types,
symbols, blocks, iterators, OOP, modules), the Rails framework at a working
level (MVC, routes, controllers, Active Record CRUD), REST API basics
(HTTP verbs, status codes, JSON responses), error handling, testing with
RSpec or Minitest, Bundler, and the behavioral questions that come up in
junior-level interviews. Every answer uses plain language — no assumed
knowledge of internals or distributed systems. For engineers already
shipping Rails services in production, the Ruby Intermediate page covers
N+1 queries, Sidekiq, metaprogramming, system design, and observability.
This page is for the Ruby developer who is learning the ropes and wants
to be ready for their first or second interview.
```

---

## URL strategy

- App URL: `/interview/ruby-backend-fresher`
- Canonical SEO URL: `/ruby-interview-questions-for-freshers`
- 301 from:
  - `/ruby-on-rails-interview-questions-for-freshers`
  - `/ruby-basic-interview-questions`
  - `/ruby-beginner-interview-questions`
  - `/ruby-developer-interview-questions-for-freshers`

---

## Pillar → Module → Topics (Full Register)

> This section is the authoritative topic-coverage spec for each pillar.
> Content stays at "first-job" depth — define every term, use runnable examples.

---

### P01 — Ruby Language Basics (Fresher)

- **Modules:** `ruby-language-basics`, `ruby-oop-basics`, `blocks-and-iterators`, `error-handling-basics`, `ruby-modules-basics`

- **ruby-language-basics — Topic must-includes:**
  - What is Ruby? Interpreted, dynamically typed, everything is an object.
  - Data types: Integer, Float, String, Symbol, Boolean (TrueClass/FalseClass), NilClass, Array, Hash.
  - Variables: local (`name`), instance (`@name`), class (`@@count`), global (`$GLOBAL`), constants (`LIMIT`).
  - String interpolation `"Hello, #{name}"` and escape sequences.
  - Single-quoted vs double-quoted strings (interpolation only in double-quotes).
  - `nil` — Ruby's null; truthiness rules (only `nil` and `false` are falsy; `0` and `""` are truthy).
  - Symbol vs String — immutability, memory interning, when to use each (symbols for hash keys, identifiers).
  - Array basics — `[]`, `push`/`<<`, `pop`, `first`/`last`, `length`/`size`, `include?`, `flatten`, `compact`, `uniq`.
  - Hash basics — `{}`, key access, `fetch`, `each`, `keys`, `values`, `merge`, `any?`, `all?`, default value.
  - Conditionals — `if/elsif/else/end`, `unless`, ternary `? :`, `case/when`.
  - Loops — `while`, `until`, `loop do ... break if`, `for ... in` (rarely used in idiomatic Ruby), `times`, `upto`, `downto`.
  - Defining methods — `def`, default arguments, keyword arguments, splat `*args` basics.
  - Return value — last expression is returned; explicit `return` is for early exit only.
  - Comparison operators and `<=>` spaceship operator.
  - `puts` vs `print` vs `p` (p calls inspect, shows type info).
  - `freeze` — makes an object immutable; `frozen?` check.
  - `Integer#to_s`, `String#to_i`, `String#to_f` type conversions.

- **ruby-oop-basics — Topic must-includes:**
  - Class definition and instantiation (`class Dog ... end`, `Dog.new`).
  - `initialize` method and constructor arguments.
  - Instance variables (`@name`) and instance methods.
  - `attr_accessor`, `attr_reader`, `attr_writer` — what each generates.
  - Class methods (`def self.create`) vs instance methods.
  - Inheritance with `<`; `super` call to parent.
  - Encapsulation — `public`, `private`, `protected` method visibility.
  - Polymorphism via duck typing — if it responds to the method, it works.
  - Abstraction — hiding implementation behind a clean interface.
  - `self` inside an instance method vs inside a class method.
  - `to_s` override for readable object representation.
  - Class variables (`@@count`) and their shared-across-subclasses danger.
  - `Object#class`, `Object#is_a?`, `Object#respond_to?`.
  - `initialize_copy` and `.dup` / `.clone` basics.
  - Everything is an object in Ruby — even integers respond to methods (`5.times`, `42.class`).

- **blocks-and-iterators — Topic must-includes:**
  - Block syntax — `do ... end` vs `{ }` (same thing; curly preferred for one-liners, do/end for multi-line).
  - `yield` — calling the block from inside a method; `block_given?` guard.
  - `each` — iterate without transformation.
  - `map` / `collect` — transform each element, return new array.
  - `select` / `filter` — keep elements where block returns truthy.
  - `reject` — keep elements where block returns falsy.
  - `find` / `detect` — return first matching element.
  - `reduce` / `inject` — fold/accumulate (sum example).
  - `any?`, `all?`, `none?`, `count`.
  - `sort` and `sort_by`.
  - `each_with_index` and `each_with_object`.
  - Symbol-to-proc shorthand `&:upcase` — what it does and why it works.
  - Chaining — `[1,2,3].select(&:odd?).map { |n| n * 2 }`.
  - Difference between `each` (returns original array) and `map` (returns new array).

- **error-handling-basics — Topic must-includes:**
  - `begin / rescue / ensure / end` structure.
  - `raise` with a message string vs raising a specific exception class.
  - Standard exception hierarchy: `Exception → StandardError → RuntimeError` (rescue catches StandardError and below by default).
  - `rescue ExceptionClass => e` — capturing the exception object.
  - `ensure` — always runs (like `finally` in Java).
  - `retry` inside a rescue block — and why you need a counter to avoid infinite loops.
  - Defining custom exception classes (`class PaymentError < StandardError; end`).
  - `rescue` as a statement modifier (`do_thing rescue nil` — use sparingly).
  - `raise` vs `fail` (aliases; `raise` preferred by convention).
  - When NOT to rescue `Exception` (it catches signals like `Interrupt` and `SystemExit`).

- **ruby-modules-basics — Topic must-includes:**
  - Module as namespace — `module Animals; class Dog; end; end` → `Animals::Dog`.
  - Module as mixin — `include` brings instance methods into a class.
  - `extend` brings module methods as class-level methods.
  - `include` vs `extend` — instance methods vs class methods.
  - `Enumerable` — include `each`, get `map`/`select`/`sort`/`min`/`max` for free.
  - `Comparable` — include `<=>`, get `<`, `>`, `<=`, `>=`, `between?`, `clamp` for free.
  - `module_function` — makes methods usable as both module-level functions and instance methods.
  - `self` inside a module method.
  - Why Ruby uses modules for mixins instead of multiple inheritance.
  - `ancestors` chain — how Ruby looks up methods (class → included modules → parent class → ...).

- **Voice tweaks (P01 fresher):** define every term on first use; every code example must be runnable standalone (no Rails context needed); anchor each answer with "in Ruby, X means…"; avoid internals (no GVL, no object allocation details — that's RBI). The twin anchors for fresher P01: "everything is an object" and "the last expression is the return value."

- **Pillar-specific standard examples (fresher):**
  - `[1, 2, 3, 4].select(&:even?).map { |n| n * 10 }  # => [20, 40]`
  - `class Dog < Animal; def speak = "Woof!"; end` (inheritance, implicit return)
  - `begin; risky(); rescue NetworkError => e; retry if retries < 3; end`
  - `module Greetable; def greet = "Hi, I'm #{name}"; end; class Person; include Greetable; end`

---

### P02 — Rails Basics (Fresher)

- **Modules:** `rails-basics`, `rails-forms-and-views`

- **rails-basics — Topic must-includes:**
  - What is Rails? Convention over configuration, DRY, MVC framework.
  - MVC — Model (data + business logic), View (presentation), Controller (orchestration).
  - Creating a Rails app: `rails new`, directory structure (app/, config/, db/, test/).
  - Routes — `config/routes.rb`, `resources :posts` generates 7 RESTful routes.
  - `rails routes` output — method + path + controller#action.
  - Controller basics — inherits from `ApplicationController`; actions as public methods.
  - `params` hash — where request data lives.
  - `render` vs `redirect_to` — when to use each (render = same action + view, redirect = new request).
  - Instance variables in controllers (`@posts`) are available in views.
  - Rails naming conventions — `PostsController`, `posts_path`, `Post` model, `posts` table.
  - `before_action` at basics level — `before_action :set_post, only: [:show, :edit, :update, :destroy]`.
  - Flash messages for user feedback (`flash[:notice]`, `flash[:alert]`).
  - Rails console (`rails c`) and server (`rails s`).
  - `rails generate scaffold` / `controller` / `model` basics.
  - `rails db:migrate`, `rails db:rollback`.

- **rails-forms-and-views — Topic must-includes:**
  - ERB syntax — `<%= %>` (output), `<% %>` (execute), `<%# %>` (comment).
  - Layouts and `yield` — how application.html.erb wraps view content.
  - Partials — `render 'shared/header'`, passing locals.
  - `form_with model: @post` — generates the HTML form; `data-remote: true` vs full page submission.
  - `link_to`, `button_to`, `image_tag` helpers.
  - `content_for` and yielding named sections.
  - `flash` display in layout.
  - Rails asset helpers and the asset pipeline (at concept level — what it does, not how it works).
  - Simple table rendering with `.each` in ERB.
  - `humanize`, `titleize`, `pluralize` view helpers.

- **Voice tweaks (P02 fresher):** trace the request → view lifecycle for every Rails answer ("browser sends GET /posts → router calls PostsController#index → controller fetches @posts → ERB renders index.html.erb → HTML returned"). Keep it at "how Rails plumbs things" level — no Rack, no middleware internals. Every code example must be recognisable from a basic `rails new` scaffold.

- **Pillar-specific standard examples (fresher):**
  - `resources :posts` → 7 routes table (GET /posts, GET /posts/:id, POST /posts, etc.)
  - `@post = Post.find(params[:id])` then `render :show` (controller basics)
  - `<% @posts.each do |post| %><h2><%= post.title %></h2><% end %>` (ERB iteration)

---

### P03 — Active Record Basics (Fresher)

- **Modules:** `active-record-basics`

- **Topic must-includes:**
  - What is an ORM? Rails Active Record as the ORM layer.
  - Model naming convention — `Post` model → `posts` table; `user_id` foreign key.
  - Creating a model: `rails generate model Post title:string body:text`.
  - Migrations — `rails generate migration AddAgeToUsers age:integer`; `change` method; `rails db:migrate`.
  - `schema.rb` — what it is and why not to edit it manually.
  - CRUD — `Post.create(title: "Hello")`, `Post.find(1)`, `Post.find_by(title: "Hello")`, `Post.all`, `Post.where(active: true)`.
  - Updating: `post.update(title: "New")`, `post.save`.
  - Deleting: `post.destroy`, `Post.destroy_all`.
  - `save` vs `save!` (returns boolean vs raises exception) — same for `create` / `create!`.
  - Validations basics — `validates :title, presence: true`; `validates :email, uniqueness: true, format: { with: URI::MailTo::EMAIL_REGEXP }`.
  - `valid?`, `errors.full_messages`.
  - Associations basics — `belongs_to :user`, `has_many :posts` — what SQL they generate.
  - `has_many :through` at concept level (e.g., User → Enrollments → Courses).
  - `dependent: :destroy` — what it does and why you need it.
  - Scopes basics — `scope :published, -> { where(published: true) }`.
  - Callbacks basics — `before_save`, `after_create` at concept level.
  - `ActiveRecord::RecordNotFound` exception on `find` vs nil on `find_by`.

- **Voice tweaks (P03 fresher):** every Active Record answer must show the actual Ruby method call alongside what SQL it runs. "Never show an association without mentioning the foreign key it relies on." Code examples must be runnable in `rails console`.

- **Pillar-specific standard examples (fresher):**
  - `Post.where(published: true).order(created_at: :desc).limit(10)` (query chain)
  - `class Post < ApplicationRecord; validates :title, presence: true; belongs_to :user; has_many :comments, dependent: :destroy; end`
  - Migration: `add_column :users, :age, :integer, default: 0`

---

### P04 — REST API Basics (Fresher)

- **Modules:** `rest-api-basics`

- **Topic must-includes:**
  - What is a REST API? Resources, representations, statelessness.
  - HTTP verbs — GET (read), POST (create), PUT/PATCH (update), DELETE (delete).
  - HTTP status codes at basics level — 200, 201, 204, 400, 401, 403, 404, 422, 500.
  - JSON — what it is, parsing in Ruby (`JSON.parse`, `JSON.generate`), Rails `render json:`.
  - Rails `respond_to` format block at basics level.
  - `render json: @post, status: :created` — the two things a controller returns.
  - `ActionController::API` — what changes when you generate an API-only app.
  - Route namespacing for versioning — `namespace :api do; namespace :v1 do; resources :posts; end; end`.
  - Reading `params` from JSON body vs query string.
  - CSRF and why API-only apps turn it off.
  - Postman / curl basics — how to test a Rails API endpoint.
  - `before_action :authenticate_user!` pattern (concept level, not full JWT).

- **Voice tweaks (P04 fresher):** every API answer must show the HTTP method + URL + expected response status. Keep it practical: "here's what you'd see in Postman."

---

### P06 — OOP & Design Basics (Fresher)

- **Modules:** `oop-and-design-basics`

- **Topic must-includes:**
  - Four pillars of OOP — encapsulation, abstraction, inheritance, polymorphism — with Ruby examples.
  - Simple design thinking — what should go in the model vs controller vs service.
  - "Fat model, skinny controller" principle at concept level.
  - Don't Repeat Yourself (DRY) — recognising duplication and extracting a method.
  - Keep It Simple — resist the urge to over-engineer.
  - Simple class design exercise — `BankAccount` with `deposit`, `withdraw`, `balance`.
  - When to use a module vs a class.
  - Method naming conventions — predicate methods end in `?`, mutating methods in `!`.
  - Naming: `calculate_total`, `user_active?`, `save!` — Ruby naming idioms.
  - SOLID at concept level — single responsibility (one class, one job), open/closed (open to extension), a brief mention of Liskov, Interface segregation, Dependency inversion — fresher only needs the first two well.

- **Voice tweaks (P06 fresher):** stay at "design thinking" level, not "architecture" level. Anchor on naming, method extraction, and recognising code smells (long method, too many responsibilities). No service objects, no DDD — those are in RBI.

---

### P08 — Testing Basics (Fresher)

- **Modules:** `rails-testing-basics`

- **Topic must-includes:**
  - Why test? Regression safety, documentation, confidence to refactor.
  - Test pyramid at basics level — unit, integration, end-to-end.
  - Minitest basics — `assert_equal`, `assert_nil`, `assert_raises`, `refute`.
  - RSpec basics — `describe`, `it`, `expect(x).to eq(y)`, `expect { }.to raise_error`.
  - `rails test` vs `bundle exec rspec` — how to run tests.
  - Model tests — testing validations and basic methods.
  - Controller tests — testing responses (minitest: `assert_response :success`; rspec: `expect(response).to have_http_status(200)`).
  - Fixtures vs FactoryBot at concept level — what test data helpers do.
  - Test database — a separate DB that resets between test runs.
  - Red-Green-Refactor cycle at concept level (TDD basics).

- **Voice tweaks (P08 fresher):** keep testing examples extremely simple — one assertion per test, no complex setups. "A good test has a clear setup, one action, one assertion."

---

### P09 — Git & Bundler Basics (Fresher)

- **Modules:** `git-and-bundler-basics`

- **Topic must-includes:**
  - `git init`, `git clone`, `git status`, `git add`, `git commit`, `git push`, `git pull`.
  - Branches — `git checkout -b feature/add-login`, `git merge`, `git rebase` at concept level.
  - Pull requests — what they are and how code review works.
  - `.gitignore` — what to exclude (`.env`, `tmp/`, `log/`, `node_modules/`).
  - Git conflict basics — how to identify and resolve a merge conflict.
  - Bundler — `bundle install`, `bundle exec`, `bundle update`.
  - `Gemfile` — specifying gem names and version constraints (`~>`, `>=`, exact).
  - `Gemfile.lock` — locks exact versions; should be committed.
  - `gem install` vs bundler — why you always use bundler in a project.
  - Semantic versioning — MAJOR.MINOR.PATCH; what `~> 2.5` means (allows `2.5.x` but not `2.6`).
  - `bundle outdated` and `bundle update gemname`.
  - `.ruby-version` file for specifying Ruby version (RVM / rbenv / mise).

- **Voice tweaks (P09 fresher):** every git answer should reference the two-step mental model — "working directory → staging (index) → commit → remote." Every Bundler answer should anchor on "Bundler ensures every developer on the team runs the exact same gem versions."

---

### P12 — Behavioral & Fresher Q&A

- **Modules:** `behavioral-and-fresher-qa`

- **Topic must-includes:**
  - Self-introduction — 60-second "About Me" for a junior Rails developer.
  - "Why Ruby/Rails?" — authentic answer, not a rehearsed slogan.
  - Talking about college/bootcamp projects — STAR format at basics level.
  - "What's your favourite Ruby feature?" — blocks, everything-is-an-object, readable syntax.
  - "What's the hardest bug you've fixed?" — even a small debugging story.
  - "Describe a time you learned something new quickly" — onboarding, tutorial, open source.
  - Weakness question — frame as genuine area of active growth with steps taken.
  - "Where do you see yourself in 2 years?" — junior answer: deeper Rails expertise, first production feature.
  - "Why this company?" — how to research and personalise.
  - Questions to ask the interviewer — 3 safe, smart questions for a junior candidate.
  - Basic STAR method — Situation, Task, Action, Result; keep it under 2 minutes.
  - "How do you stay current with Ruby/Rails?" — Rails blog, RubyWeekly, open source reading.
  - Handling "I don't know" gracefully — show curiosity, describe what you'd do to find the answer.

- **Voice tweaks (P12 fresher):** first-person warmth; STAR is the structure but keep it conversational — a 22-year-old new grad talking to an engineering manager, not a candidate reciting bullet points. Ruby-specific story hooks: "the first time blocks clicked for me was…", "I was building a simple Rails CRUD app and noticed the N+1 in the server log…"

---

## Quality gates (spec)

| Gate                                                         | Threshold |
|--------------------------------------------------------------|-----------|
| Domain metadata block approved                               | yes       |
| 13 modules listed with pillar + Q targets                    | yes       |
| Difficulty + archetype distribution reviewed                 | yes       |
| Money comparison list (≥ 20) reviewed                       | yes       |
| URL strategy reviewed                                        | yes       |
| Ruby anti-pattern checklist reviewed (same as RBI)          | yes       |

---

## Ruby anti-pattern rules (same as RBI — enforce in generation)

| Anti-pattern | Wrong | Right |
|---|---|---|
| Curly-brace class body | `class Foo { }` | `class Foo ... end` |
| Explicit return everywhere | `return name` as last line | implicit last expression |
| Verbose null check | `if name != nil` | `if name` or `name&.upcase` |
| Missing `?` on predicate methods | `def active` returning bool | `def active?` |
| `puts` used as method return | `def greet; puts "hi"; end` | `def greet; "hi"; end` |

---

## Relationship to RBI

RBF is intentionally limited — when readers outgrow the fresher level, they should be directed to `ruby-backend-intermediate`. Cross-link strategy:

- Bottom of every RBF module page: "Ready for more? → Ruby Intermediate covers [module topic]"
- RBI landing page should reference: "If you're starting with Ruby, see the Ruby Fresher track first"

---

## Definition of Done

- [ ] Spec is the canonical reference for RBF scaffold and content playbooks.
- [ ] `00-INDEX.md` row for `82` flipped to `DONE`.
