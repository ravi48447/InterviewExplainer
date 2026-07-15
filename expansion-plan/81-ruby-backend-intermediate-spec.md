# 81 — New Domain: `ruby-backend-intermediate` (FULL SPEC)

> **Executor:** AI coding agent.
> **Working directory:** `/Users/ravi.r_flx/IEProject/InterviewExplainer/`.
> **Type:** new locked-domain blueprint. Source of truth for RBI scaffold and content.
> Playbooks that implement this spec should read it in full before touching any file.

## TL;DR

- **Goal:** RBI is Ruby's JBI — the flagship Ruby backend domain. Rails-first, but not Rails-only.
- **Audience:** 3–7 YOE Ruby backend (Rails / Sinatra / Hanami / Sidekiq / PostgreSQL / Redis / Docker).
- **Pillars used:** all 12 (P01–P12), Ruby/Rails-flavoured.
- **Target total Q at launch:** 1400–1600.

## Why this matters (2 sentences)

Rails interview demand is stable at early-stage startups and scale-ups in NA/EU/AU; it owns a reliable mid-traffic SEO segment that remains underserved by quality content. RBI is the anchor for the entire Ruby rollout — every later Ruby domain reuses RBI modules and sets the quality ceiling for the Ruby keyword cluster ("ruby on rails interview questions", "rails interview questions for experienced").

## Domain metadata

```json
{
  "domainSlug": "ruby-backend-intermediate",
  "language": "ruby",
  "level": "intermediate",
  "seoSlug": "ruby-on-rails-interview-questions",
  "altSlugs": [
    "ruby-interview-questions",
    "ruby-interview-questions-for-experienced",
    "rails-interview-questions",
    "ruby-on-rails-developer-interview-questions",
    "sidekiq-interview-questions",
    "activerecord-interview-questions"
  ],
  "label": "Ruby Backend (Intermediate)",
  "blurb": "Ruby backend interview prep for 3–7 YOE engineers: language internals, Rails MVC + Active Record, Sidekiq, APIs, RSpec, Docker/Kamal, security, observability. Covers Rails 7/8 and Ruby 3.3.",
  "audience": "3-7 YOE Ruby backend engineers",
  "versionPin": "Ruby 3.3 / Rails 7.2"
}
```

---

## Module specification (32 modules)

| #  | Module slug                              | Pillar | Min Q | Notes                                                                    |
|----|------------------------------------------|--------|-------|--------------------------------------------------------------------------|
| 1  | `ruby-language-core`                     | P01    | 80    | Object model, types, mutability, freeze, Symbol vs String, truthiness    |
| 2  | `ruby-oop-advanced`                      | P01    | 60    | Class hierarchy, BasicObject, method lookup, open classes, duck typing   |
| 3  | `blocks-procs-lambdas`                   | P01    | 70    | Block vs Proc vs lambda, closures, yield, &block, curry                  |
| 4  | `modules-and-mixins`                     | P01    | 60    | include vs extend vs prepend, Comparable, Enumerable, module hooks       |
| 5  | `metaprogramming`                        | P01    | 50    | method_missing, define_method, send, class_eval, DSL building            |
| 6  | `ruby-concurrency`                       | P01    | 50    | Thread, Mutex, Fiber, Ractor, GVL/GIL, async-gem basics                 |
| 7  | `rails-mvc-core`                         | P02    | 70    | MVC architecture, request lifecycle, middleware stack, Rack protocol     |
| 8  | `action-controller`                      | P02    | 60    | Callbacks, strong params, sessions/cookies, filters, concerns            |
| 9  | `rails-routing`                          | P02    | 40    | RESTful routes, nested routes, constraints, route helpers                |
| 10 | `action-view-and-helpers`                | P02    | 40    | Layouts, partials, helpers, content_for, view components                 |
| 11 | `active-support-and-railtie`             | P02    | 30    | Active Support utilities, time zones, concern module, initializers       |
| 12 | `hotwire-turbo-stimulus`                 | P02    | 40    | Turbo Drive/Frames/Streams, Stimulus controllers, SPA alternatives       |
| 13 | `active-record-core`                     | P03    | 80    | ORM fundamentals, CRUD, scopes, callbacks, validations, dirty tracking   |
| 14 | `active-record-associations`             | P03    | 60    | belongs_to, has_many, has_one, HABTM, has_many through, polymorphic      |
| 15 | `active-record-query`                    | P03    | 60    | N+1 (includes/preload/eager_load), complex queries, Arel, raw SQL        |
| 16 | `active-record-migrations`               | P03    | 40    | Change vs up/down, reversible, schema.rb vs structure.sql, index types   |
| 17 | `sequel-and-raw-sql`                     | P03    | 30    | Sequel gem basics, raw SQL via execute, Active Record vs Sequel trade-offs|
| 18 | `rails-api-mode`                         | P04    | 50    | API-only mode, serialization choices (Jbuilder/AMS/JSONAPI), versioning  |
| 19 | `graphql-ruby`                           | P04    | 40    | graphql-ruby gem, types/resolvers, N+1 with dataloader, mutations        |
| 20 | `authentication-and-authorization`       | P04    | 50    | Devise, Doorkeeper, JWT auth, Pundit/CanCanCan, OAuth 2.0 via OmniAuth  |
| 21 | `sidekiq-deep`                           | P05    | 60    | Worker definition, queues, retries, idempotency, middleware, Sidekiq Web  |
| 22 | `active-job-and-action-mailer`           | P05    | 40    | ActiveJob adapters, mailer jobs, delivery methods, mailbox              |
| 23 | `action-cable-and-pub-sub`              | P05    | 40    | ActionCable channels, Redis pub/sub, WebSocket vs polling, broadcasting  |
| 24 | `design-patterns-ruby`                   | P06    | 50    | SOLID in Ruby, service objects, form objects, query objects, decorators  |
| 25 | `clean-architecture-ruby`                | P06    | 30    | Hexagonal architecture, dry-rb ecosystem, DDD in Ruby, value objects     |
| 26 | `system-design-fundamentals`             | P07    | 40    | CAP, caching, load balancing, sharding, rate limiting, queue patterns    |
| 27 | `system-design-cases`                    | P07    | 40    | URL shortener, news feed, chat, rate limiter — Rails-specific design     |
| 28 | `rails-security`                         | P08    | 40    | Rails security defaults, CSRF, XSS, SQLi, mass assignment, OWASP Top 10 |
| 29 | `auth-secrets-and-scanning`              | P08    | 30    | Secrets management, bundler-audit, Brakeman, JWT algorithm confusion     |
| 30 | `rspec-advanced`                         | P09    | 60    | let/let!, shared examples, custom matchers, FactoryBot, Capybara         |
| 31 | `docker-rails-and-deployment`            | P10    | 50    | Multi-stage Dockerfile, Kamal, Heroku, zero-downtime deploy, asset precomp|
| 32 | `observability-and-production`           | P11    | 50    | Lograge, Skylight/Datadog, rack-mini-profiler, Sentry, SLO/SLI, postmortem|
| +  | `behavioral-and-stories`                 | P12    | 70    | STAR with Rails projects, conflict, failure, ADR, code review culture    |

**Total minimum: ~1420 Q.**

---

## Difficulty distribution (per module, default)

30% easy / 50% medium / 20% hard.

Exceptions:
- `blocks-procs-lambdas`, `metaprogramming`, `ruby-concurrency`: 20/50/30 (harder)
- `rails-routing`, `active-record-migrations`: 40/50/10 (easier)

---

## Archetype distribution (per module, default)

A = 35%, B = 30%, C = 15%, D = 10%, E = 5%, F = 0%, G = 5%.

- `system-design-cases`: F = 90%.
- `behavioral-and-stories`: G = 95%.
- `blocks-procs-lambdas`, `metaprogramming`: C = 30% (internals-heavy).

---

## Search-phrase keyword map (top 40)

| Search phrase                                              | Owner module                          |
|------------------------------------------------------------|---------------------------------------|
| `ruby on rails interview questions`                        | (domain landing)                      |
| `ruby interview questions for experienced`                 | (domain landing)                      |
| `ruby interview questions`                                 | ruby-language-core                    |
| `blocks procs lambdas ruby interview`                      | blocks-procs-lambdas                  |
| `yield in ruby interview questions`                        | blocks-procs-lambdas                  |
| `ruby metaprogramming interview questions`                 | metaprogramming                       |
| `method_missing ruby interview`                           | metaprogramming                       |
| `ruby modules mixins interview questions`                  | modules-and-mixins                    |
| `include vs extend vs prepend ruby`                        | modules-and-mixins                    |
| `ruby oop interview questions`                             | ruby-oop-advanced                     |
| `ruby concurrency interview questions`                     | ruby-concurrency                      |
| `fiber vs thread ruby`                                     | ruby-concurrency                      |
| `GIL GVL ruby interview`                                   | ruby-concurrency                      |
| `rails interview questions`                                | rails-mvc-core                        |
| `rails request lifecycle`                                  | rails-mvc-core                        |
| `rails middleware rack`                                    | rails-mvc-core                        |
| `strong parameters rails`                                  | action-controller                     |
| `before_action vs around_action rails`                     | action-controller                     |
| `active record interview questions`                        | active-record-core                    |
| `n+1 query problem rails`                                  | active-record-query                   |
| `includes vs eager_load vs preload rails`                  | active-record-query                   |
| `rails associations interview questions`                   | active-record-associations            |
| `polymorphic associations rails`                           | active-record-associations            |
| `rails migrations interview questions`                     | active-record-migrations              |
| `sidekiq interview questions`                              | sidekiq-deep                          |
| `sidekiq retries idempotency`                              | sidekiq-deep                          |
| `rails api interview questions`                            | rails-api-mode                        |
| `devise interview questions`                               | authentication-and-authorization      |
| `pundit vs cancancan rails`                                | authentication-and-authorization      |
| `graphql ruby interview questions`                         | graphql-ruby                          |
| `action cable rails interview`                             | action-cable-and-pub-sub              |
| `hotwire turbo rails interview`                            | hotwire-turbo-stimulus                |
| `rails security interview questions`                       | rails-security                        |
| `brakeman rails security`                                  | auth-secrets-and-scanning             |
| `rspec interview questions`                                | rspec-advanced                        |
| `factory_bot rspec interview`                              | rspec-advanced                        |
| `docker rails interview questions`                         | docker-rails-and-deployment           |
| `kamal deploy rails`                                       | docker-rails-and-deployment           |
| `rails performance interview questions`                    | observability-and-production          |
| `ruby behavioral interview questions`                      | behavioral-and-stories                |

---

## Money comparison questions (canonical list — write EXACTLY)

1. `Block vs Proc vs Lambda in Ruby` (blocks-procs-lambdas)
2. `Proc vs Lambda: return behavior and arity` (blocks-procs-lambdas)
3. `include vs extend vs prepend in Ruby` (modules-and-mixins)
4. `Symbol vs String in Ruby` (ruby-language-core)
5. `freeze vs frozen? vs dup in Ruby` (ruby-language-core)
6. `== vs equal? vs eql? vs <=> in Ruby` (ruby-language-core)
7. `Thread vs Fiber vs Ractor in Ruby` (ruby-concurrency)
8. `method_missing vs define_method vs respond_to_missing?` (metaprogramming)
9. `Rails MVC vs hexagonal architecture` (rails-mvc-core)
10. `before_action vs around_action vs after_action` (action-controller)
11. `Rails session vs cookies vs flash` (action-controller)
12. `Concerns vs inheritance vs service objects` (design-patterns-ruby)
13. `has_many :through vs has_and_belongs_to_many` (active-record-associations)
14. `includes vs preload vs eager_load` (active-record-query)
15. `scope vs class method in Active Record` (active-record-core)
16. `Active Record callbacks vs model observers` (active-record-core)
17. `schema.rb vs structure.sql` (active-record-migrations)
18. `change vs up/down in migrations` (active-record-migrations)
19. `Active Record vs Sequel vs raw SQL` (sequel-and-raw-sql)
20. `Jbuilder vs Active Model Serializer vs JSONAPI Serializer` (rails-api-mode)
21. `Devise vs JWT auth for Rails API` (authentication-and-authorization)
22. `Pundit vs CanCanCan` (authentication-and-authorization)
23. `Sidekiq vs Resque vs GoodJob vs Delayed::Job` (sidekiq-deep)
24. `ActiveJob vs native Sidekiq worker` (active-job-and-action-mailer)
25. `ActionCable vs SSE vs WebSocket polling` (action-cable-and-pub-sub)
26. `Turbo vs React for Rails frontend` (hotwire-turbo-stimulus)
27. `Rails security: CSRF vs XSS vs SQLi prevention defaults` (rails-security)
28. `bundler-audit vs Brakeman` (auth-secrets-and-scanning)
29. `let vs let! in RSpec` (rspec-advanced)
30. `Kamal vs Heroku vs Capistrano` (docker-rails-and-deployment)
31. `Lograge vs Semantic Logger for Rails` (observability-and-production)
32. `rack-mini-profiler vs Skylight vs Datadog APM` (observability-and-production)

---

## Landing intro template

```text
Ruby on Rails Interview Questions for 3–7 YOE Backend Engineers

This page covers what real Ruby backend interviews actually test in 2026 —
the Ruby object model and language internals (blocks/procs/lambdas, mixins,
metaprogramming, the GVL/GIL, Fibers, Ractor), the Rails framework as it
ships today (Rails 7/8 with Hotwire, Turbo, Stimulus, and API mode),
Active Record in depth (associations, N+1 detection with includes/eager_load,
scopes, callbacks, migrations), the background job ecosystem (Sidekiq,
ActiveJob, ActionCable), security (Rails' built-in protections, Devise, Pundit,
Brakeman), testing with RSpec and FactoryBot, and the production realities
(Lograge structured logging, APM, Docker/Kamal deploys, SLOs). Every answer
targets Ruby 3.3 and Rails 7.2 with idiomatic Ruby — no verbose Java-flavored
return statements, no curly-brace class bodies. For fresher Ruby developers
we have a separate Ruby Beginner page. This page is for the Ruby engineer
who is already shipping Rails services and now needs to interview at the next tier.
```

---

## URL strategy

- App URL: `/interview/ruby-backend-intermediate`
- Canonical SEO URL: `/ruby-on-rails-interview-questions`
- 301 from:
  - `/ruby-interview-questions`
  - `/ruby-interview-questions-for-experienced`
  - `/rails-interview-questions`
  - `/ruby-on-rails-developer-interview-questions`
  - `/sidekiq-interview-questions`
  - `/activerecord-interview-questions`

---

## Ruby-specific anti-pattern checklist (enforce in content generation)

Content generation MUST reject or regenerate if any of these appear in Ruby/Rails code examples:

| Anti-pattern | Wrong | Right |
|---|---|---|
| Curly-brace class body | `class Foo { }` | `class Foo ... end` |
| Explicit return everywhere | `return name` at line end | implicit last expression |
| Java Optional | `Optional<String>` | `nil` guard or `&.` safe navigation |
| `final` keyword | `final int x = 5` | `CONSTANT = 5` (frozen by convention) |
| Type annotations in mainstream code | `def greet(name: String)` | `def greet(name)` (Sorbet/RBS only in typing topics) |
| Verbose null check | `if name != nil` | `if name` or `name&.upcase` |
| Missing `?` on predicate methods | `def active` | `def active?` |
| Missing `!` on mutating methods | `def save` when mutating | `def save!` for bang variant |

---

## Quality gates (spec)

| Gate                                                         | Threshold |
|--------------------------------------------------------------|-----------|
| Domain metadata block approved                               | yes       |
| 32 modules listed with pillar + Q targets                    | yes       |
| Difficulty + archetype distribution reviewed                 | yes       |
| Money comparison list reviewed (≥ 30 comparisons)           | yes       |
| Ruby anti-pattern checklist reviewed                         | yes       |
| URL strategy reviewed                                        | yes       |

---

## Definition of Done

- [ ] Spec is the canonical reference for RBI scaffold and content playbooks.
- [ ] `00-INDEX.md` row for `81` flipped to `DONE`.

---

## Pillar → Module → Topics (Full Register)

> This section is the authoritative topic-coverage spec for each pillar.
> It drives content generation prompts, QA review, and depth-marker checks.

---

### P01 — Ruby Language & Core

- **Modules:** `ruby-language-core`, `ruby-oop-advanced`, `blocks-procs-lambdas`, `modules-and-mixins`, `metaprogramming`, `ruby-concurrency`
- **Topic must-includes:**
  - **ruby-language-core:** everything-is-an-object; BasicObject → Object hierarchy; nil vs false vs falsy; truthiness rules; Symbol interning and immutability; Symbol vs String (when to use each); freeze / frozen? / dup / clone; frozen_string_literal pragma; mutable vs immutable types; `==` vs `equal?` vs `eql?` vs `<=>` and Comparable; object_id and identity; integer literals and numeric tower (Integer, Float, Rational, Complex); string interpolation and encoding; ranges and case equality (`===`); regular expressions; assignment and multiple assignment; method visibility (public/protected/private); `self` in different contexts; everything is an expression (last-value return); nil handling and safe navigation operator (`&.`).
  - **ruby-oop-advanced:** class vs module; BasicObject → Object → Module → Class hierarchy; class methods vs instance methods; `self` in class body; inheritance with `<`; method lookup order (MRO) without mixins; `super` and `super()` difference; open classes and monkey-patching; duck typing and `respond_to?`; `is_a?` vs `kind_of?` vs `instance_of?`; class-level instance variables vs class variables (`@@`); `attr_accessor` / `attr_reader` / `attr_writer` and what they generate; `initialize` and `new`; object cloning and the copy pattern; method objects (`method(:foo)`); `Comparable` mixin and `<=>` contract.
  - **blocks-procs-lambdas:** block syntax (do/end vs curly brace precedence); `yield` and `block_given?`; explicit `&block` parameter; converting method to proc with `&method(:foo)`; `Proc.new` vs `proc {}` vs `lambda {}` vs `->` stabby lambda; four key differences (return behavior, arity enforcement, `===`, `lambda?`); closures and captured variables; `Proc#call`, `.()`, `[]` syntaxes; `Proc#curry` and partial application; tap, then/yield_self, itself; Enumerator::Lazy and lazy evaluation; chaining with `<<` and `>>` (proc composition).
  - **modules-and-mixins:** `include` vs `extend` vs `prepend` (MRO impact of each); `included`, `extended`, `prepended` hooks; `Enumerable` — what you get for implementing `each`; `Comparable` — what you get for implementing `<=>`; `Forwardable` module; module functions (`module_function`); namespacing with modules; `Module#ancestors` chain; `ActiveSupport::Concern` and how it removes the `base.included` boilerplate; abstract interface pattern in Ruby without ABCs.
  - **metaprogramming:** `method_missing` and why `respond_to_missing?` must accompany it; `define_method` and dynamic method generation; `class_eval` / `module_eval` and instance_eval; `send` / `public_send` (security difference); `const_get` and `const_set`; `instance_variable_get/set`; hooks (`inherited`, `included`, `extended`, `method_added`, `method_removed`); DSL design patterns (class macro pattern like Rails associations); `define_singleton_method`; `Object#tap` and introspection helpers; dangers of metaprogramming (debugging difficulty, performance, security with `send`).
  - **ruby-concurrency:** MRI GVL (Global VM Lock) — what it allows and prevents; Thread lifecycle and `Thread.new`; Mutex and `synchronize`; thread-safety of common patterns; `Queue` and `SizedQueue`; `Fiber` — cooperative vs preemptive; Fiber vs Thread trade-offs; `Ractor` (Ruby 3) — share-nothing model, message passing, current limitations; `async` gem basics (event loop over Fibers); `concurrent-ruby` gem; IO-bound vs CPU-bound concurrency in Ruby; Puma vs Unicorn (multi-thread vs multi-process concurrency model).
- **Voice tweaks:** beginner-friendly; every answer must drop **one tiny idiomatic Ruby shape** — a block, a symbol method, a one-liner, an enumerable chain — so the listener can anchor visually. "Everything is an object" is the constant philosophical anchor for P01. Never explain Ruby features in Java terms as the primary explanation; Java comparisons may appear as a one-sentence aside only.
- **Pillar-specific standard examples:**
  - `[1, 2, 3].map { |n| n * 2 }.select(&:odd?)` (blocks + enumerable chain)
  - `User.new.tap { |u| u.name = 'Alice' }` (tap pattern)
  - `greet = ->(name) { "Hello, #{name}" }; greet.("Alice")` (lambda)
  - `module Greetable; def greet = "Hi, I'm #{name}"; end; class Person; include Greetable; end` (mixin)
  - `def method_missing(name, *args); super unless name.to_s.start_with?('find_by_'); end` (method_missing)
- **Common archetypes:** A (every "what is" concept), B (every comparison — Symbol vs String, Proc vs Lambda, include vs extend), C (`blocks-procs-lambdas` closure internals, `ruby-concurrency` GVL internals), D (scenario — frozen object error in production, thread-safety bug in shared state).

---

### P02 — Rails Framework

- **Modules:** `rails-mvc-core`, `action-controller`, `rails-routing`, `action-view-and-helpers`, `active-support-and-railtie`, `hotwire-turbo-stimulus`
- **Topic must-includes:**
  - **rails-mvc-core:** Rails MVC and why the V is thin in modern Rails; Rack protocol — what a Rack app is, how middleware chains work; Rails request lifecycle (router → middleware → controller → model → view/serializer → response); `config.ru` and the Rack entry point; Rails engine vs mountable engine; the Zeitwerk autoloader and constant loading; `config/initializers` execution order; `bin/rails` commands; Rails conventions (CoC) and when to break them; `ActiveSupport::Notifications` and instrumentation; Railtie as the entry point for gems to hook into Rails.
  - **action-controller:** Controller inheritance from `ActionController::Base` vs `ActionController::API`; `before_action`, `after_action`, `around_action` — execution order and skip methods; strong parameters (`params.require.permit`) and why they exist (mass assignment protection); `respond_to` and `format` negotiation; `render` vs `redirect_to`; flash messages; sessions (cookie-based vs server-side) and cookies; `ActionController::Live` for SSE; authentication patterns in controllers; error handling with `rescue_from`; concerns for shared controller logic; `ActionController::Parameters` security.
  - **rails-routing:** RESTful route helpers (`resources`, `resource`); nested routes and depth limits; `member` vs `collection` routes; `namespace` vs `scope` vs `module`; route constraints (regex, custom); named routes and path/url helpers; `draw` for splitting routes files; `root` route; `redirect` in routes; `mount` for Rack apps and engines; inspecting routes with `rails routes`; route caching in production.
  - **action-view-and-helpers:** Layout inheritance and `content_for`/`yield`; partials and the `locals` option; helpers vs decorators vs view components; `form_with` and CSRF token generation; `link_to`, `image_tag`, `javascript_include_tag`; asset pipeline vs importmap vs jsbundling-rails; ERB vs Slim vs Haml trade-offs; `html_safe` and XSS risk; `ActionView::Component` (ViewComponent gem) pattern; rendering JSON from controllers without views.
  - **active-support-and-railtie:** `ActiveSupport::Concern` pattern; time zones (`.in_time_zone`, `Time.current` vs `Time.now`); `HashWithIndifferentAccess`; `ActiveSupport::Callbacks`; `try` vs `&.` safe navigation; `blank?` / `present?` / `presence`; `deep_merge`, `to_query`, `titleize`, `camelize`; `ActiveSupport::Notifications`; memoization with `||=`; `delegate` macro; `class_attribute` vs `cattr_accessor`.
  - **hotwire-turbo-stimulus:** Turbo Drive vs full-page reload; Turbo Frames for partial page replacement; Turbo Streams for real-time server-push (over WebSocket or SSE); Stimulus controller lifecycle (`connect`, `disconnect`, `targets`, `values`); broadcasting with `turbo_stream_from`; Hotwire vs React/Vue trade-offs; when Hotwire is enough and when a SPA is warranted; importmap + Turbo + Stimulus as the Rails 7 default frontend stack.
- **Voice tweaks:** beginner-friendly; every answer must **trace the order of events** at least once — "router resolves → middleware runs → controller action → model queries → render". Rails' value is convention; every answer must name the default behaviour **and** the override mechanism. When comparing Rails to other frameworks, lead with "Rails convention is X; here's where that breaks down."
- **Pillar-specific standard examples:**
  - `before_action :authenticate_user!, only: [:create, :update, :destroy]` (controller callback)
  - `params.require(:user).permit(:name, :email, addresses: [:street, :city])` (strong params)
  - `resources :orders do; member { post :cancel }; collection { get :pending }; end` (routes)
  - `<%= turbo_stream.append "messages", partial: "message", locals: { message: @message } %>` (Turbo Stream)
  - `class OrdersController < ApplicationController; rescue_from Order::NotFound, with: :not_found; end` (rescue_from)
- **Common archetypes:** A (every "what is X in Rails"), C (Rack middleware chain internals, Zeitwerk loading), D (scenario — CSRF token mismatch, N+1 in controller, missing `respond_to` format), E (Turbo vs React for this use case).

---

### P03 — Data & Active Record

- **Modules:** `active-record-core`, `active-record-associations`, `active-record-query`, `active-record-migrations`, `sequel-and-raw-sql`
- **Topic must-includes:**
  - **active-record-core:** Active Record pattern vs Data Mapper pattern; `ApplicationRecord` and model concerns; CRUD methods (`create`, `save`, `update`, `destroy` vs bang versions); validations (presence, uniqueness, format, custom validator objects); validation contexts; dirty tracking (`changed?`, `previous_changes`, `will_save_change_to?`); `ActiveRecord::Callbacks` full list and execution order; callback pitfalls (side effects, skipping with `update_column`); `before_save` vs `before_create`; scopes (`default_scope` danger, named scopes, merging scopes); class methods vs named scopes; single table inheritance (STI) and trade-offs; counter cache; touch option; optimistic locking (`:lock_version`); `with_lock` for pessimistic locking; `ActiveRecord::Base.transaction`; `after_commit` vs `after_save` (why after_commit is safer for side effects).
  - **active-record-associations:** `belongs_to` (required by default in Rails 5+); `has_one`; `has_many`; `has_many :through` vs `has_and_belongs_to_many` (use through — it's always extensible); polymorphic associations (`as:`, `source_type:`); self-referential associations; `dependent: :destroy` vs `:nullify` vs `:restrict_with_error`; `inverse_of` and why it matters for memory and validation; `counter_cache`; `foreign_key` and `primary_key` overrides; `through:` + `source:` for indirect associations; touch propagation; association callbacks (`before_add`, `after_add`); strict loading and `strict_loading!` for N+1 detection in dev.
  - **active-record-query:** QueryInterface: `where`, `select`, `joins`, `left_outer_joins`, `group`, `having`, `order`, `limit`, `offset`; N+1 problem — diagnosis with Bullet gem; `includes` (chooses preload or eager_load); `preload` (separate SELECT IN query); `eager_load` (LEFT OUTER JOIN — needed when WHERE references association); `joins` vs `includes` vs `eager_load` decision tree; Arel for programmatic queries; `find_by` vs `find` vs `where.first`; batch processing (`find_each`, `find_in_batches`, `in_batches`); `exists?` vs `any?` vs `count`; `pluck` vs `select`; `update_all` vs `update_each` performance; SQL injection prevention via parameterized queries; `explain` and `EXPLAIN ANALYZE` via `to_sql`.
  - **active-record-migrations:** `rails generate migration`; change method (reversible helpers); `up`/`down` for non-reversible; `reversible do`; adding/removing columns, indexes, foreign keys; `add_index` with partial indexes, expression indexes; `schema.rb` vs `structure.sql` (use structure.sql if you use DB-specific features); `db:migrate`, `db:rollback`, `db:migrate:status`; zero-downtime migration patterns (add-only, backfill asynchronously, remove after deploy); `strong_migrations` gem; running migrations in CI/CD; column default strategies.
  - **sequel-and-raw-sql:** Sequel gem — Model vs Dataset API; Sequel plugins (associations, timestamps, validation_helpers); `DB.execute` vs AR `connection.execute`; when raw SQL is justified; `find_by_sql`; `sanitize_sql_array`; Sequel vs Active Record trade-offs (composability, explicit vs magic, multi-database support).
- **Voice tweaks:** beginner-friendly; every answer must **surface a trade-off explicitly** — `has_and_belongs_to_many` vs `has_many :through` (extensibility), `includes` vs `eager_load` (SQL shape), `after_save` vs `after_commit` (transaction scope). The N+1 question is the single most asked production question in this pillar; every module has at least one N+1 scenario.
- **Pillar-specific standard examples:**
  - `User.includes(posts: :comments).where(active: true)` (includes + nested)
  - `Order.where(status: :pending).joins(:customer).where(customers: { tier: 'gold' })` (joins + where on association)
  - `Post.find_each(batch_size: 500) { |p| p.update(cached_score: compute(p)) }` (batch processing)
  - `class AgeValidator < ActiveModel::Validator; def validate(r); r.errors.add(:age, "too young") if r.age < 18; end; end` (custom validator)
  - `after_commit :send_welcome_email, on: :create` (post-commit callback)
- **Common archetypes:** A (CRUD, validations, associations fundamentals), B (includes vs preload vs eager_load, scope vs class method, STI vs polymorphic), C (Active Record query execution pipeline, N+1 tracing), D (slow query in production — trace via EXPLAIN ANALYZE, fix with index + eager load).

---

### P04 — APIs & Serialization

- **Modules:** `rails-api-mode`, `graphql-ruby`, `authentication-and-authorization`
- **Topic must-includes:**
  - **rails-api-mode:** `ActionController::API` vs `ActionController::Base` — what's stripped; enabling CORS (`rack-cors` gem); content negotiation; JSON serialization options — Jbuilder (view template), Active Model Serializers (AMS), `jsonapi-serializer` (fastest), `Alba`; API versioning strategies (URL segment vs header vs query param); pagination (Kaminari, Pagy, cursor-based); rate limiting (Rack::Attack); hypermedia vs plain JSON; OpenAPI documentation with Rswag; error response format (RFC 7807 problem+JSON); request/response logging.
  - **graphql-ruby:** Object types, query type, mutation type; resolver methods; N+1 with `graphql-batch` / `dataloader`; argument validation; custom scalars; connections and pagination (Relay spec); subscriptions over ActionCable; authentication in GraphQL context; versioning (schema evolution vs versioning); persisted queries; introspection security.
  - **authentication-and-authorization:** Devise — generators, model concerns, Warden hooks, OmniAuth integration, token auth with `devise-jwt`; Doorkeeper for OAuth 2.0 authorization server; JWT structure (header.payload.signature); JWT validation (algorithm confusion — always specify algorithm explicitly); refresh tokens; Pundit — policy objects, `policy_scope`, `authorize`; CanCanCan — `Ability` class, `can?` / `cannot?`; role-based vs attribute-based access control; row-level security patterns; API key auth (hashed in DB); session vs token trade-offs for Rails API.
- **Voice tweaks:** beginner-friendly; every answer must **name the contract and the failure mode** — the JSON schema, the auth header, what happens when the token expires. "API answers without a named failure mode are warning-flagged."
- **Pillar-specific standard examples:**
  - `class UserSerializer; include Alba::Resource; attributes :id, :name, :email; end` (Alba serializer)
  - `Rack::Attack.throttle('api/ip', limit: 100, period: 1.minute) { |req| req.ip }` (rate limiting)
  - `class PostPolicy < ApplicationPolicy; def update?; record.user_id == user.id; end; end` (Pundit policy)
  - GraphQL dataloader batch: `def user; dataloader.with(Sources::UserSource).load(object.user_id); end`
- **Common archetypes:** A (JWT, Devise basics, API mode setup), B (Jbuilder vs AMS vs JSONAPI Serializer, Pundit vs CanCanCan, session vs JWT), C (JWT internals, GraphQL N+1 DataLoader), D (403 on a Pundit check — debug, JWT expired in API client — debug).

---

### P05 — Background Jobs & Async

- **Modules:** `sidekiq-deep`, `active-job-and-action-mailer`, `action-cable-and-pub-sub`
- **Topic must-includes:**
  - **sidekiq-deep:** Sidekiq architecture (Redis list as queue, Sidekiq server polling); worker definition (`include Sidekiq::Worker`, `perform` method); `perform_async` vs `perform_in` vs `perform_at`; queue naming and priority; `sidekiq_options` — `queue:`, `retry:`, `backtrace:`; retry mechanism — exponential backoff, retry count, dead set; idempotency and why it's mandatory (retries are guaranteed); job uniqueness (`sidekiq-unique-jobs`); Sidekiq middleware (client-side and server-side); `Sidekiq::Web` UI; Sidekiq cron with `sidekiq-cron`; Sidekiq Pro features (reliable fetch, batch jobs); Sidekiq vs Resque vs GoodJob vs Delayed::Job trade-offs; Redis connection pooling for Sidekiq.
  - **active-job-and-action-mailer:** `ApplicationJob` and `perform` method; `perform_later` vs `perform_now`; queue adapters (Sidekiq, GoodJob, Resque, inline for test); job callbacks (`before_perform`, `after_perform`, `around_perform`); `ActionMailer::Base` vs `ActionMailer::Parameterized`; delivery methods (smtp, sendgrid, ses); `deliver_later` vs `deliver_now`; mail previews; ActionMailbox for inbound mail; testing mailers (enqueued vs delivered).
  - **action-cable-and-pub-sub:** ActionCable channel lifecycle (`subscribed`, `unsubscribed`, `receive`); WebSocket connection in Rails (hijacks HTTP connection); Redis adapter for multi-process pub/sub; broadcasting (`ActionCable.server.broadcast`); `turbo_stream_from` tag and server-sent events mode; stream naming and channel security; `Turbo::StreamsChannel`; SSE vs WebSocket vs long-polling trade-offs; scaling ActionCable (sticky sessions or Redis pub/sub).
- **Voice tweaks:** beginner-friendly; every answer must name the **three components**: queue backend (Redis), worker process (Sidekiq server), and job result (or side effect). The failure mode question is always "what happens to the job when the worker crashes mid-`perform`?" — this is the depth marker for every queuing question.
- **Pillar-specific standard examples:**
  - `class SendEmailWorker; include Sidekiq::Worker; sidekiq_options retry: 3, queue: :critical; def perform(user_id); User.find(user_id).deliver_welcome!; end; end`
  - `class NotificationJob < ApplicationJob; queue_as :default; def perform(user_id, message); ActionCable.server.broadcast("user_#{user_id}", { message: }); end; end`
  - Idempotency pattern: `def perform(order_id); order = Order.find(order_id); return if order.invoiced?; order.invoice!; end`
- **Common archetypes:** A (Sidekiq basics, ActiveJob fundamentals), B (Sidekiq vs GoodJob, perform_async vs perform_in, deliver_later vs deliver_now), C (Sidekiq Redis polling internals, retry backoff formula), D (silent job failure in Sidekiq — debug dead set, ActionCable not broadcasting — debug Redis adapter).

---

### P06 — Architecture & Design

- **Modules:** `design-patterns-ruby`, `clean-architecture-ruby`
- **Topic must-includes:**
  - **design-patterns-ruby:** SOLID in Ruby — SRP (service objects for business logic out of models), OCP (modules/Comparable as extension without modification), LSP (duck typing and respond_to? contracts), ISP (small focused modules over god modules), DIP (repository pattern with dependency injection); creational patterns (factory via class methods, singleton via module instance); structural (decorator with `SimpleDelegator` or `Draper`, facade for API clients, adapter for third-party services); behavioral (strategy via Proc/lambda, observer via `ActiveSupport::Notifications`, command object for CQRS); service objects — when, how, naming (verb + noun: `CreateOrder`, `ChargePayment`); form objects for multi-model forms; query objects for complex AR queries; policy objects (precursor to Pundit); presenter/view model objects; value objects (Money, EmailAddress); interactor pattern (dry-transaction, Interactor gem).
  - **clean-architecture-ruby:** Hexagonal architecture in Rails (domain layer → ports → adapters); `dry-rb` ecosystem (`dry-validation`, `dry-types`, `dry-monads`, `dry-transaction`); domain entities vs AR models (rich domain model vs anemic); DDD aggregates and value objects in Ruby; event-driven domain events; `Trailblazer` / `Hanami` as framework-agnostic alternatives; when to introduce architecture layers (rule: pain before abstraction); Rails concerns vs service objects vs plain Ruby objects; testing architecture at the domain layer without loading Rails.
- **Voice tweaks:** **familiar** audience — opens with the decision being made. "I'd reach for a service object here because the model already has six responsibilities and adding a seventh would make it untestable." In Ruby, many GoF patterns collapse into first-class Procs; say so explicitly: "In Ruby, Strategy is just passing a Proc."
- **Pillar-specific standard examples:**
  - Service object: `class CreateOrder; def initialize(params, mailer: OrderMailer); ...; end; def call; ...; end; end`
  - Decorator with `SimpleDelegator`: `class PremiumUser < SimpleDelegator; def discount; 0.2; end; end`
  - Strategy via proc: `def process_payment(amount, strategy: method(:stripe_charge)); strategy.call(amount); end`
  - Value object: `Money = Struct.new(:amount, :currency) { def +(other) = Money.new(amount + other.amount, currency) }`
- **Common archetypes:** E (decision-first by mandate), B (service object vs concern vs model method, dry-monads vs plain Ruby, Hanami vs Rails), A (SOLID definitions in Ruby context).

---

### P07 — System Design

- **Modules:** `system-design-fundamentals`, `system-design-cases`
- **Topic must-includes:**
  - **system-design-fundamentals:** CAP theorem and why Rails apps almost always choose CP or AP pragmatically; functional vs non-functional requirements; capacity estimation (req/s, DB row size, storage GB); caching strategies in Rails (fragment caching, Russian doll caching, HTTP caching with ETags, Redis cache store); load balancing and session affinity; horizontal vs vertical scaling of Puma/Unicorn; read replicas with `ActiveRecord::Base.connected_to`; database sharding in Rails (Octopus gem, Rails 6 multiple databases); background job scaling on queue depth; CDN and asset delivery; rate limiting patterns (Rack::Attack + Redis); feature flags (Flipper gem).
  - **system-design-cases:** URL shortener at 10M URLs/day (Rails + PostgreSQL + Redis for short-code lookup); rate limiter at 1M req/s (Redis sliding window + Rack::Attack); news feed (fan-out-on-write with Redis sorted sets vs fan-out-on-read, Sidekiq for fan-out); chat system with ActionCable + Redis pub/sub; notification service (Sidekiq + multi-channel delivery); multi-tenancy approaches (row-level with `default_scope`, schema-per-tenant with Apartment gem, database-per-tenant); file upload and processing pipeline (ActiveStorage + S3 + background variant generation); full-text search (pg_search with trigrams, Elasticsearch with `searchkick`).
- **Voice tweaks:** **familiar** audience; concrete capacity numbers mandatory — req/s, GB, ms. Ruby context: when the question is "design a notification service for 5M users," the answer should mention "Sidekiq workers on ECS with Redis as broker, fan-out via Sidekiq batches, APNs/FCM delivered by separate low-priority workers."
- **Pillar-specific standard examples:**
  - Russian doll caching: `cache [product, product.reviews] do ... end` (outer + inner expiry)
  - Multi-DB: `ActiveRecord::Base.connected_to(role: :reading) { User.where(...) }`
  - Rate limiter: `Rack::Attack.throttle('req/ip', limit: 60, period: 1.minute) { |req| req.ip }`
- **Common archetypes:** F (almost exclusively — every case study), A (fundamentals page), E (architecture decisions — multi-tenancy approach, caching tier).

---

### P08 — Security

- **Modules:** `rails-security`, `auth-secrets-and-scanning`
- **Topic must-includes:**
  - **rails-security:** Rails security defaults — CSRF via `protect_from_forgery`, XSS via `html_escape` in ERB (and `html_safe` danger), SQL injection prevention via parameterized queries (never string interpolation in `where`), mass assignment protection via strong parameters, clickjacking via `X-Frame-Options`; OWASP Top 10 mapped to Rails (SQL injection, broken auth, XSS, IDOR, security misconfiguration); `config.force_ssl`; `Secure` and `HttpOnly` cookie flags; `SameSite` cookie policy; session fixation and `reset_session`; stored vs reflected vs DOM XSS in Rails context; `Content-Security-Policy` header; `ActionDispatch::SSL` middleware.
  - **auth-secrets-and-scanning:** Secrets management — `Rails.application.credentials`, `ENV` vars, Rails encrypted credentials vs environment variables in prod; `bundler-audit` for CVE scanning of gems; Brakeman for static analysis of Rails code; JWT algorithm confusion attack (`alg: none`, `HS256` vs `RS256`); bcrypt via `has_secure_password`; `devise-two-factor`; avoiding timing attacks (`ActiveSupport::SecurityUtils.secure_compare`); dependency pinning and Dependabot; SAST in CI pipeline.
- **Voice tweaks:** beginner-friendly; every answer must implicitly carry the **threat-model framing** — attacker, asset, vulnerability, mitigation. Always name the Rails built-in protection and the scenario where it would be bypassed. "Rails protects you by default — these are the ways engineers accidentally turn that protection off."
- **Pillar-specific standard examples:**
  - `protect_from_forgery with: :exception` (default CSRF)
  - `<%= raw @user_content %>` — XSS via raw (the wrong way); `<%= @user_content %>` — auto-escaped (right way)
  - `User.where("email = '#{params[:email]}'")` — SQLi (wrong); `User.where(email: params[:email])` (right)
  - Brakeman output: "Possible SQL injection near line 42"
  - `ActiveSupport::SecurityUtils.secure_compare(token_from_db, token_from_request)` (timing-safe comparison)
- **Common archetypes:** A (what is X security concept in Rails), C (JWT internals, CSRF token mechanism), D (Brakeman flagged a potential SQLi — debug, XSS reported in bug bounty — reproduce and patch).

---

### P09 — Testing

- **Modules:** `rspec-advanced`, `factory-bot-capybara`, `test-doubles-contract`
- **Topic must-includes:**
  - **rspec-advanced:** RSpec structure (`describe`, `context`, `it`, `specify`); `let` (lazy) vs `let!` (eager) — execution timing; `subject` and `described_class`; shared examples (`shared_examples_for`, `it_behaves_like`) for DRY contract testing; shared contexts (`shared_context`, `include_context`); custom matchers (`RSpec::Matchers.define`); `aggregate_failures` for multiple expect without early exit; `around` hook use cases; metadata-based filtering; `--format documentation` for readable output; RSpec and Rails integration (`spec/rails_helper.rb` vs `spec_helper.rb`); `ActiveJob::TestHelper` for job assertions; `ActionMailer::TestHelper`; testing concerns in isolation (dummy class pattern).
  - **factory-bot-capybara:** FactoryBot — `factory`, `trait`, `sequence`, `association`; lazy attributes with blocks; `build_stubbed` for fast unit tests (no DB); `create` vs `build` vs `build_stubbed` cost hierarchy; factory inheritance; `after(:create)` hooks; FactoryBot linting; Capybara for system tests — `visit`, `fill_in`, `click_button`, `have_text`; `js: true` and headless Chrome; `have_current_path`; Capybara matchers vs Shoulda Matchers; DatabaseCleaner strategies (transaction for unit, truncation for system tests with JS); `driven_by` and Selenium config.
  - **test-doubles-contract:** `double` vs `instance_double` vs `class_double` (verifying doubles); `allow` vs `expect` on doubles; `stub_const`; WebMock for HTTP stubs (`stub_request`); VCR cassettes for external API recording; spy pattern; `as_null_object`; test isolation vs integration testing pyramid; Pact contract testing for Rails microservices; `RSpec::Fire` (deprecated but pattern still used); testing private methods (smell — test through public API); mutation testing with `mutant` gem.
- **Voice tweaks:** beginner-friendly; every answer must carry the **pyramid + risk thinking** — which level of test catches this bug, what's the cost. The Ruby-specific depth marker: "use `build_stubbed` for unit tests — it gives you an AR-like object without hitting the database, which makes your suite 10x faster."
- **Pillar-specific standard examples:**
  - `let(:user) { build_stubbed(:user, :premium) }` (fast stubbed factory with trait)
  - `shared_examples 'a paginated endpoint' do; it { expect(response).to include_pagination_headers }; end` (shared examples)
  - `stub_request(:post, 'https://api.stripe.com/v1/charges').to_return(body: stripe_fixture)` (WebMock)
  - `expect(OrderMailer).to have_enqueued_mail(:welcome_email).with(order)` (mailer job assertion)
  - `instance_double(UserRepository, find: user)` (verifying double)
- **Common archetypes:** A (RSpec syntax concepts, FactoryBot basics), B (let vs let!, build vs create vs build_stubbed, mock vs stub vs spy), D (flaky test in CI — diagnose DatabaseCleaner strategy, slow test suite — profile and switch to build_stubbed).

---

### P10 — DevOps & Cloud

- **Modules:** `docker-rails-and-deployment`
- **Topic must-includes:** Rails-specific Dockerfile (copy Gemfile + Gemfile.lock before source for layer caching; `bundle install --without development test`; asset precompilation in build stage; non-root user; `RAILS_ENV=production`; multi-stage build to drop build tools); Kamal deployment (deploy.yml, traefik reverse proxy, rolling deploys, secrets via env); Heroku (Procfile with `web: bundle exec puma`, `worker: bundle exec sidekiq`, dyno types, `heroku run rails db:migrate`); zero-downtime deploy patterns (add column before code, remove after; feature flags during migration); GitHub Actions for Rails (install Ruby, bundle, rspec, rubocop, docker build/push); Dependabot for gem updates; `DATABASE_URL` env var pattern; health checks for Rails containers.
- **Voice tweaks:** beginner-friendly; sequence + blast radius. Rails-specific: the layer-caching order is a depth marker — "copy Gemfile before the source code so a code change doesn't invalidate the bundle install layer. Asset precompile goes in the build stage so the production image doesn't need Node."
- **Pillar-specific standard examples:**
  - Multi-stage Dockerfile: `FROM ruby:3.3-slim AS builder\nCOPY Gemfile* .\nRUN bundle install\nFROM ruby:3.3-slim\nCOPY --from=builder /usr/local/bundle ...`
  - `web: bundle exec puma -C config/puma.rb` (Procfile)
  - GitHub Actions: `- uses: ruby/setup-ruby@v1\n  with:\n    ruby-version: '3.3'\n    bundler-cache: true`
- **Common archetypes:** A (Dockerfile concepts, Kamal basics), D (container fails to start — Rails master key missing, assets 404 in production — precompile in build stage), B (Kamal vs Heroku, Puma vs Unicorn in container).

---

### P11 — Production & Observability

- **Modules:** `observability-and-production`
- **Topic must-includes:** Structured logging with Lograge (replaces Rails' verbose log format with single-line JSON); `Semantic Logger`; correlation IDs propagated via `Thread.current` or Rack middleware; `rack-mini-profiler` for SQL + rendering time in development; Skylight / Scout APM / Datadog APM for production traces; `derailed_benchmarks` for memory profiling; `memory_profiler` gem; `stackprof` for CPU profiling; `rbspy` for production profiling without restart; Sentry / Bugsnag for error tracking (`Sentry.capture_exception`, release tracking); N+1 detection in production (Bullet in dev, `strict_loading!`, SQL log analysis); SLI/SLO/SLA for Rails apps; the four golden signals (latency p99, traffic req/s, error rate %, saturation — DB pool, Sidekiq queue depth); blameless post-mortem; `rails stats` and code health metrics; `Rack::Timeout` and `rack-request-timeout`.
- **Voice tweaks:** **familiar** audience; war-room voice — calm, evidence-driven, named tools. Ruby-specific: "I ran `rbspy record --pid $(pgrep -f puma) --duration 30` and saw 60% of samples in the ORM query builder" is the depth marker for production profiling. Always name the Ruby tool, not a generic "profiler."
- **Pillar-specific standard examples:**
  - Lograge: `config.lograge.enabled = true; config.lograge.formatter = Lograge::Formatters::Json.new` + correlation_id in `custom_options`
  - SLO: 99.9% availability, 30-day rolling, ~43 min error budget; p99 < 200ms for all `GET /api/**` endpoints
  - Sentry: `Sentry.init { |c| c.dsn = ENV['SENTRY_DSN']; c.traces_sample_rate = 0.05; c.release = ENV['GIT_SHA'] }`
  - Four golden signals dashboard: p99 latency, req/s (traffic), 5xx rate (errors), DB pool wait time (saturation)
  - Blameless post-mortem: timeline → contributing factors → action items with owners
- **Common archetypes:** D (every debugging + incident response scenario), C (Lograge internals, APM tracing), A (SLI/SLO/SLA fundamentals).

---

### P12 — Interview Readiness

- **Modules:** `behavioral`, `engineering-practices`
- **Topic must-includes:** STAR method; self-introduction for a Rails developer; conflict resolution stories; failure/mistake stories; weakness question (frame as an area of active growth); delivering under pressure (Rails upgrade deadline, production incident); career growth narratives; code review culture (anchor on intent first, style last); ADRs for architectural decisions; technical debt strategy in a Rails app; mentoring stories; technical leadership; system design communication practice.
  - **Ruby-specific story hooks:** the N+1 you found in production and how you instrumented it; the Rails upgrade (4→5, 5→6, 6→7) that broke something unexpected; the time you added a Sidekiq job and learned about idempotency the hard way; the service object refactor that made the model actually testable; the time you used metaprogramming and then had to undo it.
- **Voice tweaks:** first-person warmth; STAR is mandatory for every story prompt; the reflection beat ("looking back, I'd have…") separates a rehearsed answer from a self-aware one. Stories should feel like they happened at a real Rails shop, not a generic "backend company." If the conflict was about "Rails monolith vs microservices," say so — it's the most common Rails architecture debate and interviewers recognise it immediately.
- **Common archetypes:** G (almost exclusively). `engineering-practices` has a thin A layer for ADR and code-review concepts.
