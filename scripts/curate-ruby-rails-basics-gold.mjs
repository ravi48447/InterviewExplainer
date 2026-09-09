#!/usr/bin/env node

import fs from "node:fs";
import path from "node:path";

const root = "content/ruby-backend-fresher";
const moduleRoot = path.join(root, "rails-basics");
const legacyRoot = path.join(root, "rails-mvc-intro");
const fence = (language, lines) => `\`\`\`${language}\n${lines.join("\n")}\n\`\`\``;

const migrations = [
  {
    source: "routes-basics",
    target: "mvc-and-routing",
    slug: "rails-routes-basics",
  },
  {
    source: "rails-directory-structure",
    target: "rails-conventions",
    slug: "rails-directory-structure-basics",
  },
];

for (const migration of migrations) {
  const sourceFile = path.join(legacyRoot, migration.source, "complete-qa.json");
  const targetFile = path.join(moduleRoot, migration.target, "complete-qa.json");
  if (!fs.existsSync(sourceFile)) continue;
  const source = JSON.parse(fs.readFileSync(sourceFile, "utf8"));
  const target = JSON.parse(fs.readFileSync(targetFile, "utf8"));
  const question = source.questions?.find((entry) => entry.slug === migration.slug);
  if (!question) throw new Error(`${sourceFile}: missing ${migration.slug}`);
  if (!target.questions.some((entry) => entry.slug === migration.slug)) {
    target.questions.push(question);
    fs.writeFileSync(targetFile, `${JSON.stringify(target, null, 2)}\n`);
  }
}

const environmentsSourceFile = path.join(root, "git-and-build-basics", "rails-environments", "complete-qa.json");
const environmentsTargetFile = path.join(moduleRoot, "rails-conventions", "complete-qa.json");
if (fs.existsSync(environmentsSourceFile)) {
  const source = JSON.parse(fs.readFileSync(environmentsSourceFile, "utf8"));
  const target = JSON.parse(fs.readFileSync(environmentsTargetFile, "utf8"));
  const question = source.questions?.find((entry) => entry.slug === "rails-environments-basics");
  if (!question) throw new Error(`${environmentsSourceFile}: missing rails-environments-basics`);
  if (!target.questions.some((entry) => entry.slug === question.slug)) {
    target.questions.push(question);
    fs.writeFileSync(environmentsTargetFile, `${JSON.stringify(target, null, 2)}\n`);
  }
}

const lessons = {
  "rails-mvc-and-routing-basics": {
    answerSize: "standard",
    direct: "Rails uses MVC to divide a web request into responsibilities: the router selects a controller action from the HTTP verb and URL; the controller coordinates the use case; models handle data and domain rules; and a view or serializer builds the response representation. Routing is the entry map into MVC—it does not contain the business operation itself. This separation keeps request handling, domain behaviour, and presentation independently understandable and testable.",
    quick: [
      "The router maps an HTTP verb and path to one controller action.",
      "The controller reads request data and coordinates the use case.",
      "Models own persistence and domain behaviour, not HTTP presentation.",
      "Views or serializers turn prepared data into HTML, JSON, or another format.",
      "The response returns through the same request; each layer keeps one clear role.",
    ],
    interview: [
      "- Rails applies Model-View-Controller to separate the parts of request handling. The model represents data and domain behaviour, the view produces a representation such as HTML or JSON, and the controller connects an incoming request to the required work.",
      "- Routing sits before the controller. Rails compares the request's HTTP verb and path with `config/routes.rb`, selects a target such as `ProductsController#show`, and extracts path values like `:id` into `params`. A route identifies the action; it should not implement the action's business rules.",
      "- For example, `GET /products/42` can match `products#show`. The controller loads `Product.find(params[:id])`, then Rails renders the show template or a JSON representation. The model knows how a Product is stored and validated, while the view decides how that product is presented.",
      "- Controllers should remain request-oriented: authentication, permitted input, calling domain operations, and choosing a response. Large calculations and reusable business rules belong in models or dedicated objects; SQL and HTML mixed directly into the action make the boundaries difficult to test.",
      "- The complete path is request, route, controller, domain work, representation, and response. MVC is valuable because changing the HTML usually does not change the model rule, and changing persistence should not require rewriting URL dispatch. It also gives route, request, model, and view tests a natural responsibility to verify directly.",
    ],
    deepTitle: "Trace one request through Rails",
    deep: [
      "Before MVC code runs, the Rack server and Rails middleware build an HTTP request environment. The router then considers routes in declaration order. A match supplies a controller name, action name, and any dynamic segments. If no route matches, the request never reaches an application controller action.",
      "The controller is the HTTP boundary. It can read headers, session data, query or body parameters, and the values captured by the route. It asks models or service objects to perform work and prepares only the state the representation needs. An instance variable such as `@product` is one common bridge to an HTML view.",
      "A model does not mean 'every line that is not a controller'. Active Record models map records and can protect data invariants, while a separate domain or service object may coordinate operations across several records or external systems. The useful boundary is that these objects should not depend on whether the caller eventually renders HTML or JSON.",
      "Rendering creates the response body; Rails also selects a status and headers. The same controller action can negotiate different formats, but each format still represents the same result. This journey gives failures a location: routing mismatch, request validation, domain rule, persistence, or presentation.",
    ],
    visualType: "sequence_diagram",
    visualTitle: "A GET request moving through MVC",
    visual: fence("mermaid", [
      "sequenceDiagram",
      "  participant B as Browser",
      "  participant R as Router",
      "  participant C as ProductsController",
      "  participant M as Product model",
      "  participant V as View / serializer",
      "  B->>R: GET /products/42",
      "  R->>C: show with params[:id] = 42",
      "  C->>M: find(42)",
      "  M-->>C: product",
      "  C->>V: render product",
      "  V-->>B: HTTP response",
    ]),
    codeTitle: "One route, one action, one prepared view",
    code: [
      "# config/routes.rb",
      "Rails.application.routes.draw do",
      "  resources :products, only: [:show]",
      "end",
      "",
      "# app/controllers/products_controller.rb",
      "class ProductsController < ApplicationController",
      "  def show",
      "    @product = Product.find(params[:id])",
      "  end",
      "end",
      "",
      "# app/views/products/show.html.erb",
      "# <h1><%= @product.name %></h1>",
    ],
    followups: [
      "What happens before a controller action runs?",
      "Which responsibilities make a Rails controller too large?",
      "How can the same action return HTML and JSON representations?",
    ],
  },
  "rails-routes-basics": {
    answerSize: "standard",
    direct: "A Rails route matches an HTTP verb and URL pattern to a controller action. Routes live in `config/routes.rb`; for example, `get \"/health\", to: \"health#show\"` sends `GET /health` to `HealthController#show`. `resources :articles` generates the seven conventional REST routes for index, show, new, create, edit, update, and destroy, along with named URL helpers. Rails uses the first matching route, so declaration order matters.",
    quick: [
      "A route matches both the HTTP verb and the path pattern.",
      "Its target is written as `controller#action`.",
      "Dynamic segments such as `:id` become values in `params`.",
      "`resources :articles` creates seven conventional RESTful routes.",
      "Routes are checked top to bottom; use `bin/rails routes` to inspect them.",
    ],
    interview: [
      "- Rails routing is the dispatch table between HTTP and controller actions. Each route describes a verb, a path pattern, and a destination such as `articles#show`. A request must match the verb as well as the URL; `GET /articles/7` and `DELETE /articles/7` can intentionally reach different actions.",
      "- Dynamic segments are captured as parameters. With `get 'articles/:id', to: 'articles#show'`, the URL `/articles/7` produces `params[:id] == '7'`. Named route helpers build URLs from the same declaration, avoiding hard-coded paths throughout the application.",
      "- For example, `resources :articles` creates collection routes for listing and creating articles, member routes for reading, editing, updating, and deleting one article, and form routes for `new` and `edit`. It also creates helpers such as `articles_path` and `article_path(article)`.",
      "- The router tests declarations from top to bottom. A broad dynamic route placed too early can capture a path intended for a specific route. Routes should identify resources and HTTP semantics; authentication and domain work usually belong after routing, in controllers or other application layers.",
      "- `bin/rails routes` shows the helper, verb, path, and target and is the first tool for diagnosing a routing mismatch. A clear resource route keeps URL design, controller naming, and request intent aligned. Recognition and URL generation then share one authoritative declaration instead of separate hard-coded strings reliably.",
    ],
    deepTitle: "A resource expands into a predictable HTTP contract",
    deep: [
      "The router recognises requests and generates URLs from the same definitions. Recognition converts a verb and path into controller parameters. Generation uses a named helper and values to build a path. Using helpers means a later path change is reflected without searching for string literals across views and controllers.",
      "RESTful resources distinguish collection operations from member operations. `index` and `create` address the article collection; `show`, `update`, and `destroy` address one member identified by `:id`. `new` and `edit` serve HTML forms and do not themselves change stored data.",
      "The update convention accepts both PUT and PATCH, although PATCH better communicates a partial modification. Rails route declarations can be limited with `only` or `except`, nested for parent-child resources, or extended with explicit member and collection routes. Those tools should describe a real resource relationship rather than mirror arbitrary method names.",
      "A route existing does not guarantee a successful request. The target controller and public action must exist, constraints must accept the values, and downstream authorization may still deny access. Keeping dispatch separate from permission checks prevents the routes file from becoming hidden application logic.",
    ],
    visualType: "comparison_table",
    visualTitle: "The seven routes generated by resources",
    visual: "| Verb | Path | Action | Purpose |\n|---|---|---|---|\n| GET | `/articles` | `index` | list articles |\n| GET | `/articles/new` | `new` | show the creation form |\n| POST | `/articles` | `create` | create an article |\n| GET | `/articles/:id` | `show` | show one article |\n| GET | `/articles/:id/edit` | `edit` | show the edit form |\n| PATCH/PUT | `/articles/:id` | `update` | update one article |\n| DELETE | `/articles/:id` | `destroy` | delete one article |",
    codeTitle: "Declare resources, a member route, and a simple endpoint",
    code: [
      "# config/routes.rb",
      "Rails.application.routes.draw do",
      "  get '/health', to: 'health#show'",
      "",
      "  resources :articles, only: [:index, :show, :create] do",
      "    member do",
      "      post :publish",
      "    end",
      "  end",
      "end",
      "",
      "# GET /articles/7 -> ArticlesController#show",
      "# params[:id] == '7'",
      "# article_path(7) == '/articles/7'",
    ],
    followups: [
      "Which seven actions does `resources` generate?",
      "Why can route declaration order change which action receives a request?",
      "What is the difference between a member route and a collection route?",
    ],
  },
  "rails-controllers-basics": {
    answerSize: "compact",
    direct: "A Rails controller is the HTTP-facing coordinator for a request. The router selects a public action; the controller reads request context and permitted parameters, invokes models or application services, and chooses a response by rendering, redirecting, or returning a status. It should not become the permanent home for domain rules, complex queries, or presentation markup. A focused controller makes the request contract clear while delegating reusable work.",
    quick: [
      "The router invokes one public controller action for a matched request.",
      "Controllers read `params`, headers, session, and authenticated-user context.",
      "Strong parameters define which client-supplied attributes are permitted.",
      "The action coordinates domain work and selects one HTTP response.",
      "Reusable business rules belong outside the controller boundary.",
    ],
    interview: [
      "- A Rails controller receives the request after routing and coordinates its application use case. An action is a public method such as `create` or `show`; it can read `params`, session or authentication context, call domain code, and select the HTTP response.",
      "- For example, `ProductsController#create` can build a Product from permitted attributes, call `save`, redirect to the product after success, and render the form with validation errors after failure. The controller owns that HTTP decision, while the Product owns its validation rules.",
      "- Strong parameters are part of this boundary. `params.expect(product: [:name, :price])` in current Rails, or `require(...).permit(...)` in many existing applications, prevents arbitrary request keys from being mass-assigned. Authentication and shared setup may run through carefully scoped action callbacks.",
      "- An action should produce one response. It should not contain long SQL chains, pricing algorithms, email templates, or unrelated orchestration. Those details become easier to reuse and test when delegated to a model, query object, or service with a clear contract.",
      "- A good controller therefore translates HTTP input into an application call and translates the result back into HTTP without becoming the application itself.",
    ],
    deepTitle: "The controller is an adapter at the HTTP boundary",
    deep: [
      "Rails constructs a controller instance for the request and runs the selected action through the controller callback chain. Filters may establish authentication or load shared resources, but their order and scope affect every matching action and should remain visible enough to reason about.",
      "Parameters combine values from routing, query strings, and request bodies. Treating that hash as trusted would let a client set fields it should not control. A permitted-attribute boundary creates an explicit input shape before data reaches mass assignment, while deeper domain validation still decides whether values are acceptable.",
      "The result must become one HTTP response: body, status, and headers. Rendering a failed form normally keeps the same request and uses a failure status such as 422. Redirecting after a successful write asks the client to make a clean GET, preventing a refresh from resubmitting the mutation.",
      "Thin does not mean empty. Request-specific branching, content negotiation, and status selection belong here. The design smell is logic whose meaning and tests do not depend on HTTP; moving that logic behind a named method leaves the controller as a readable map of the endpoint.",
    ],
    visualType: "flow_diagram",
    visualTitle: "Controller responsibilities and delegation",
    visual: fence("mermaid", [
      "flowchart LR",
      "  R[route selects action] --> I[read and permit request input]",
      "  I --> D[call model or application service]",
      "  D --> O{result}",
      "  O -->|success| S[render or redirect with success status]",
      "  O -->|known failure| F[render error representation and status]",
      "  D -. domain rules stay here .-> M[model / service]",
    ]),
    codeTitle: "Coordinate create without moving validation into the action",
    code: [
      "class ProductsController < ApplicationController",
      "  def create",
      "    @product = Product.new(product_params)",
      "",
      "    if @product.save",
      "      redirect_to @product, status: :see_other",
      "    else",
      "      render :new, status: :unprocessable_entity",
      "    end",
      "  end",
      "",
      "  private",
      "",
      "  def product_params",
      "    params.require(:product).permit(:name, :price)",
      "  end",
      "end",
    ],
    followups: [
      "Why are strong parameters separate from model validations?",
      "What kinds of logic should move out of a controller?",
      "When is a `before_action` helpful, and when can it hide control flow?",
    ],
  },
  "rails-render-vs-redirect-basics": {
    answerSize: "compact",
    direct: "`render` builds a response in the current request, using a template or supplied body; it does not run another controller action or change the browser URL. `redirect_to` returns a 3xx response with a `Location` header, telling the client to make a new request, so the URL and request state change. Render is typical for showing validation errors; redirect is typical after a successful write. Neither call automatically stops the Ruby method.",
    quick: [
      "`render` completes the current request with a chosen response body.",
      "Rendering a template does not execute that template's matching action.",
      "`redirect_to` sends a 3xx response and `Location` header.",
      "The client makes a new request after a redirect, so the browser URL changes.",
      "Neither helper halts the action; use `return` when later code must not run.",
    ],
    interview: [
      "- `render` and `redirect_to` choose different HTTP flows. Rendering creates the response body during the current controller request. Redirecting sends a response that instructs the client to visit another URL in a separate request.",
      "- For example, when `@article.save` fails validation, `render :new, status: :unprocessable_entity` shows the form again with the same in-memory Article and its errors. Rails uses the `new` template but does not call the `new` action, and the browser remains on the submitted URL.",
      "- After a successful create, `redirect_to @article, status: :see_other` gives the browser the article URL. The follow-up GET loads the saved resource cleanly and refreshing that page does not repeat the original POST. Flash values can cross that redirect; ordinary instance variables cannot because the next request gets a new controller instance.",
      "- Neither render nor redirect automatically returns from the Ruby method. If code later attempts another response, Rails raises a double-render error, so an early branch may need `return` or a mutually exclusive control structure.",
      "- The decision is therefore based on request lifecycle: render when the current request already has the state needed for its response, redirect when the client should begin a new request at a canonical URL.",
    ],
    deepTitle: "The difference is visible at the HTTP boundary",
    deep: [
      "A rendered response contains its final status, headers, and body immediately. Template selection is only one way to form that body; a controller can also render JSON, plain text, or no body. Selecting another action's template changes presentation, not which action's setup code has run.",
      "A redirect response normally contains a 3xx status and `Location`. The current server-side work ends with that response, then the browser or API client decides whether to follow it. The follow-up request passes through routing, authentication, controller construction, and data loading again.",
      "This explains state behaviour. Validation errors live on the unsaved model object and remain available to a rendered form in the same request. They disappear across a redirect unless deliberately stored, while a flash message is designed to survive into the next request.",
      "The post-redirect-get pattern makes successful form submissions easier to refresh and bookmark. For invalid input, redirecting usually loses the rejected values and errors, so rendering with an appropriate non-success status is the clearer contract.",
    ],
    visualType: "comparison_table",
    visualTitle: "Same request versus new request",
    visual: "| Question | `render` | `redirect_to` |\n|---|---|---|\n| Requests involved | One | Current 3xx plus a new request |\n| Browser URL | Usually unchanged | Changes after client follows `Location` |\n| Instance variables | Available to the template | Not carried into the next request |\n| Common form use | Show validation errors | Continue after a successful write |\n| Runs another action directly | No | No; the new request is routed normally |",
    codeTitle: "Render invalid state, redirect after persistence",
    code: [
      "def create",
      "  @article = Article.new(article_params)",
      "",
      "  if @article.save",
      "    redirect_to @article, status: :see_other",
      "  else",
      "    render :new, status: :unprocessable_entity",
      "  end",
      "end",
      "",
      "def leave_early",
      "  redirect_to root_path",
      "  return                       # later response code must not run",
      "end",
    ],
    followups: [
      "Does `render :show` execute the `show` action?",
      "Why is render usually better than redirect after validation failure?",
      "Why can code after `redirect_to` cause a double-render error?",
    ],
  },
  "rails-conventions-basics": {
    answerSize: "compact",
    direct: "Rails uses conventions as shared defaults so common application structure needs little configuration. A singular `Product` model maps to a plural `products` table; `ProductsController` lives in `app/controllers/products_controller.rb`; conventional resource actions have known names; and autoloadable constant names match file paths. Rails also encourages DRY, but conventions are defaults rather than laws—override them deliberately when an external schema or clearer domain model requires it.",
    quick: [
      "Convention over configuration supplies predictable defaults instead of repeated setup.",
      "Model classes are singular while their database tables are normally plural.",
      "Snake-case file paths correspond to CamelCase constants for autoloading.",
      "REST resources use familiar controller action and route names.",
      "Override a convention explicitly when the real domain or external system demands it.",
    ],
    interview: [
      "- Rails is convention-oriented: it assumes common names and locations so developers configure only the exceptions. The payoff is that a new team member can often find a model, controller, route, test, or migration without a project-specific map.",
      "- For example, the singular class `Product` normally lives in `app/models/product.rb` and maps to the plural `products` table. `ProductsController` lives in `app/controllers/products_controller.rb`, and a resource route uses standard actions such as `index`, `show`, `create`, and `update`.",
      "- File and constant naming also supports autoloading. `Admin::UsersController` corresponds to a nested snake-case path under `app/controllers`. Following the convention lets Rails load and reload application constants without hand-written `require` calls.",
      "- DRY complements convention over configuration by keeping one authoritative representation of knowledge. It does not mean forcing unrelated cases through one abstraction; premature sharing can be harder to maintain than a small amount of obvious duplication.",
      "- Rails conventions are defaults, not restrictions. Legacy database names and external APIs can be configured explicitly. The best use is to follow the shared path when it fits and make deviations visible and justified when it does not.",
    ],
    deepTitle: "Defaults connect names across the framework",
    deep: [
      "A Rails convention is valuable because several components agree on it. Given `Product`, Active Record can infer `products`, routing can expose product resources, controllers and views can follow predictable paths, and generators can create matching tests and migrations. One name drives a connected set of defaults.",
      "Zeitwerk-based autoloading relies on file paths matching constant paths in autoload directories. A file named `app/models/billing/invoice.rb` should define `Billing::Invoice`. A mismatch is not cosmetic—it means the loader cannot reliably connect the file to the constant.",
      "REST conventions similarly connect HTTP intent to actions and helpers. Teams recognise what `articles_path`, `ArticlesController#create`, and `app/views/articles/new.html.erb` are for without inventing new vocabulary for every resource.",
      "Configuration remains available for real exceptions, such as `self.table_name` for a legacy table. The cost is that each exception becomes knowledge the team must document and remember, so convention should be the baseline and overrides should solve a concrete incompatibility.",
    ],
    visualType: "comparison_table",
    visualTitle: "One concept across Rails naming conventions",
    visual: "| Role | Product example | Convention |\n|---|---|---|\n| Model constant | `Product` | Singular CamelCase |\n| Model file | `app/models/product.rb` | Singular snake_case |\n| Database table | `products` | Plural snake_case |\n| Controller | `ProductsController` | Plural resource name |\n| Controller file | `app/controllers/products_controller.rb` | Constant path in snake_case |\n| Resource helper | `products_path` | Resource-based route name |",
    codeTitle: "Convention supplies the wiring",
    code: [
      "# app/models/product.rb",
      "class Product < ApplicationRecord",
      "end",
      "",
      "# app/controllers/products_controller.rb",
      "class ProductsController < ApplicationController",
      "  def index",
      "    @products = Product.all",
      "  end",
      "end",
      "",
      "# config/routes.rb",
      "# resources :products",
      "",
      "# Product maps to the products table by convention.",
    ],
    followups: [
      "How does a Rails model name map to its table name?",
      "Why must autoloaded file paths match constant names?",
      "When is overriding a Rails convention justified?",
    ],
  },
  "rails-directory-structure-basics": {
    answerSize: "compact",
    direct: "A Rails application's directories separate code by responsibility. Most application code lives under `app/`; routes and environment settings live under `config/`; migrations and schema information live under `db/`; tests live under `test/` or a project-selected `spec/`; reusable tasks often live under `lib/`; and generated runtime files use folders such as `log/`, `storage/`, and `tmp/`. The structure supports Rails naming and autoloading conventions, so files should be placed by what they do rather than by convenience.",
    quick: [
      "`app/` holds models, controllers, views, jobs, mailers, and other application code.",
      "`config/` holds routes, environments, initializers, and application settings.",
      "`db/` contains migrations and the recorded database schema.",
      "`test/` or the chosen `spec/` tree mirrors behaviour that needs verification.",
      "`bin/`, `lib/`, `log/`, `storage/`, and `tmp/` serve tooling or runtime concerns.",
    ],
    interview: [
      "- Rails generates a conventional project structure so each responsibility has an expected home. The most frequently edited directory is `app`, which contains application classes such as models, controllers, views, jobs, mailers, helpers, and framework-specific components.",
      "- `config` contains the application and environment configuration, initializers, database settings, and `routes.rb`. `db` records database changes in migrations and holds the current schema representation. The test suite usually lives in `test`, or in `spec` when the project adopts RSpec.",
      "- For example, a `ProductsController` belongs in `app/controllers/products_controller.rb`, its `Product` model in `app/models/product.rb`, and an HTML show template in `app/views/products/show.html.erb`. That placement lets conventions and autoloading connect the files.",
      "- Supporting locations have different lifecycles: `bin` contains application-aware command wrappers, `lib` can hold custom tasks or supporting code, `public` serves static files, while `log`, `storage`, and `tmp` contain generated runtime data that is not application source.",
      "- The structure is a navigation and loading contract, not merely tidiness. Keeping responsibilities in their conventional directories makes generators, reloaders, teammates, and deployment tooling behave predictably.",
    ],
    deepTitle: "Source, configuration, database history, and runtime data",
    deep: [
      "The top-level tree separates files by how they change. Application behaviour evolves in `app`; deployment and environment choices live in `config`; database evolution is recorded in `db/migrate`; dependency versions are locked through the Gemfile files; and automated checks evolve alongside behaviour in the test tree.",
      "Within `app`, paths normally mirror constant namespaces. `app/jobs/billing/reconcile_job.rb` is expected to define `Billing::ReconcileJob`. Views are grouped by controller or component rather than becoming Ruby constants, but their placement still drives conventional lookup.",
      "Migrations are history, while `db/schema.rb` or `db/structure.sql` describes the current database shape for setup and inspection. Editing an old migration that has already run in shared environments can make installations disagree; a new migration records the next change.",
      "Runtime directories should not become hidden source locations. Logs, cached files, process IDs, uploaded development files, and temporary artifacts can be replaced between environments. Code required to understand the application belongs in versioned source or explicit configuration instead.",
    ],
    visualType: "comparison_table",
    visualTitle: "Where common Rails work belongs",
    visual: "| Directory or file | Owns | Example |\n|---|---|---|\n| `app/` | Application behaviour and presentation | models, controllers, views, jobs |\n| `config/` | Boot, routes, environments, initializers | `config/routes.rb` |\n| `db/` | Database change history and current shape | migrations, `schema.rb` |\n| `test/` or `spec/` | Automated verification | model and request tests |\n| `bin/` and `lib/` | Commands, tasks, supporting code | `bin/rails`, `lib/tasks` |\n| `log/`, `storage/`, `tmp/` | Generated runtime data | logs, local files, cache |",
    codeTitle: "A feature follows predictable paths",
    code: [
      "# app/models/product.rb",
      "class Product < ApplicationRecord",
      "end",
      "",
      "# app/controllers/products_controller.rb",
      "class ProductsController < ApplicationController",
      "  def show",
      "    @product = Product.find(params[:id])",
      "  end",
      "end",
      "",
      "# app/views/products/show.html.erb",
      "# <h1><%= @product.name %></h1>",
      "",
      "# test/controllers/products_controller_test.rb",
      "# verifies the HTTP behaviour of ProductsController",
    ],
    followups: [
      "What is the difference between a migration and the current schema file?",
      "How does a namespaced constant map to a path under `app/`?",
      "Which Rails directories contain source, and which contain runtime data?",
    ],
  },
  "rails-environments-basics": {
    answerSize: "compact",
    direct: "A Rails environment is a named configuration context for running the same application under different conditions. Rails provides development, test, and production environments by default. Shared settings live in `config/application.rb`, while `config/environments/development.rb`, `test.rb`, and `production.rb` override behaviour such as code reloading, error reporting, caching, logging, and asset handling. `Rails.env` exposes the current name, and `RAILS_ENV` can select it. Environment-specific configuration should change operations, not business rules.",
    quick: [
      "Development, test, and production are Rails' default environment names.",
      "Shared configuration lives in `config/application.rb`; named overrides live under `config/environments/`.",
      "Development favours fast feedback, test isolation, and production stable performance and safe errors.",
      "`Rails.env` reads the active environment; `RAILS_ENV` can select one for a command.",
      "Keep secrets outside source and keep business behaviour consistent across environments.",
    ],
    interview: [
      "- A Rails environment is a named set of runtime configuration for the same application code. Rails creates development, test, and production environments by default. The name chooses settings and usually selects the corresponding database configuration; it should not create three different versions of the product's business rules.",
      "- Shared application settings live in `config/application.rb`. Files such as `config/environments/development.rb` and `production.rb` override operational behaviour including class reloading, detailed error pages, caching, logging, mail delivery, and asset handling. The generated defaults vary by Rails version, so the project's files are the authoritative configuration.",
      "- For example, development normally favours quick feedback with code reloading and useful local errors. The test environment aims for deterministic, isolated automated runs. Production normally caches and eager-loads more work, avoids exposing detailed exceptions to users, and sends logs and assets through deployment-appropriate services.",
      "- Code can inspect `Rails.env`, with predicates such as `Rails.env.production?`, and commands can select an environment with `RAILS_ENV=production`. Secrets should come from Rails credentials or environment variables rather than committed conditional values. Gem groups may control which tools are installed or loaded, but Bundler still resolves one compatible graph.",
      "- I use environment branches only for infrastructure differences. If tax calculation or authorization changes because `Rails.env` changed, production is no longer exercising the behaviour the tests proved. Keeping product rules shared makes local, test, staging, and production evidence comparable.",
    ],
    deepTitle: "Change operational policy without forking application meaning",
    deep: [
      "Rails builds configuration in layers. Framework defaults are followed by application-wide settings, environment-specific files, initializers, credentials, and process-provided values. Later, more specific configuration can override earlier choices. Reading the final environment file is therefore only one part of tracing a setting.",
      "The database is normally configured by environment in `config/database.yml` or a database URL. Separate test storage prevents automated examples from changing development or production records. A production command selected accidentally can be destructive, so deployment scripts should set the environment explicitly and protect dangerous tasks.",
      "Operational differences are expected. Development reloads code to shorten the edit cycle; production can eager load for predictable serving; test adapters may capture jobs or mail instead of contacting external services. Those substitutes still need the same local contract, plus selected integration checks against real infrastructure.",
      "Environment checks spread easily. Central configuration objects or adapters are clearer than `Rails.env.production?` throughout domain code. They expose what varies—storage service, log level, endpoint, or delivery mode—while the business operation continues to mean the same thing everywhere.",
    ],
    visualType: "comparison_table",
    visualTitle: "One application, three default operating contexts",
    visual: "| Environment | Main goal | Typical operational choices | Must remain true |\n|---|---|---|---|\n| development | fast local feedback | reload code, detailed local errors | real business behaviour |\n| test | deterministic verification | isolated data, captured external effects | same rules and contracts |\n| production | safe, stable service | eager loading, caching, controlled error output | behaviour already verified |\n| every environment | run one codebase | settings and adapters may differ | authorization and domain meaning do not fork |",
    codeTitle: "Select configuration at the application boundary",
    code: [
      "# config/environments/production.rb",
      "Rails.application.configure do",
      "  config.eager_load = true",
      "  config.consider_all_requests_local = false",
      "end",
      "",
      "# Application code can read the active name when truly necessary:",
      "Rails.env.production?",
      "",
      "# Run a command in an explicitly selected environment:",
      "# RAILS_ENV=production bin/rails db:migrate",
      "",
      "# Prefer injected configuration over Rails.env branches in domain rules.",
    ],
    followups: [
      "Where do shared and environment-specific Rails settings live?",
      "Why should domain rules not branch on `Rails.env`?",
      "How does the test environment protect development and production data?",
    ],
  },
};

const directories = ["mvc-and-routing", "controllers-basics", "render-vs-redirect", "rails-conventions"];
let curated = 0;
for (const directory of directories) {
  const file = path.join(moduleRoot, directory, "complete-qa.json");
  const document = JSON.parse(fs.readFileSync(file, "utf8"));
  if (!Array.isArray(document.questions)) throw new Error(`${file}: missing questions`);

  for (const [index, question] of document.questions.entries()) {
    const lesson = lessons[question.slug];
    if (!lesson) throw new Error(`${file}: no lesson for ${question.slug}`);
    question.direct_answer = lesson.direct;
    question.last_updated = "2026-09-07";
    question.reading_time_minutes = lesson.answerSize === "standard" ? 8 : 6;
    question.order = index + 1;
    question.answer = {
      ...(question.answer ?? {}),
      sections: [
        {
          type: "key_points",
          title: "Quick Revision",
          content: lesson.quick.map((point) => `- ${point}`).join("\n"),
        },
        {
          type: "speakable_answer",
          title: "Interview Answer",
          answerSize: lesson.answerSize,
          content: lesson.interview.map((paragraph) => paragraph.replace(/^[-*+]\s+/, "")).join("\n\n"),
        },
        {
          type: "deep_explanation",
          title: lesson.deepTitle,
          content: lesson.deep.join("\n\n"),
        },
        {
          type: lesson.visualType,
          title: lesson.visualTitle,
          content: lesson.visual,
        },
        {
          type: "code_example",
          title: lesson.codeTitle,
          content: fence("ruby", lesson.code),
        },
      ],
    };
    question.followup_questions = lesson.followups;
    curated += 1;
  }

  fs.writeFileSync(file, `${JSON.stringify(document, null, 2)}\n`);
}

if (curated !== Object.keys(lessons).length) {
  throw new Error(`curated ${curated}/${Object.keys(lessons).length} Rails basics lessons`);
}

console.log(`Curated ${curated} canonical Rails basics questions.`);
