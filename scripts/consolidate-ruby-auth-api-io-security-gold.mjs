#!/usr/bin/env node

import fs from "node:fs";
import path from "node:path";

const domainRoot = path.resolve("content/ruby-backend-fresher");
const archiveRoot = path.resolve("content/.archive/source-of-truth-2026-09-05/ruby-backend-fresher/ruby-collections-and-io-duplicates");
const paragraphs = (...values) => values.join("\n\n");
const fenced = (language, lines) => `\`\`\`${language}\n${lines.join("\n")}\n\`\`\``;

function writeQuestion(moduleSlug, topicSlug, spec) {
  const file = path.join(domainRoot, moduleSlug, topicSlug, "complete-qa.json");
  const existing = JSON.parse(fs.readFileSync(file, "utf8"));
  const previous = existing.questions[0];
  const question = {
    ...previous,
    question: spec.question,
    title: spec.title,
    direct_answer: spec.direct,
    layout_type: spec.layoutType ?? "concept-explanation",
    difficulty: spec.difficulty ?? "easy",
    importance: spec.importance ?? "high",
    reading_time_minutes: spec.readingTime ?? 8,
    interviewer_intent: spec.intent,
    answer: {
      sections: [
        { type: "key_points", title: "Quick revision", items: spec.quick },
        {
          type: "speakable_answer",
          title: "Interview answer",
          answerSize: spec.answerSize ?? "standard",
          content: spec.speaking,
        },
        { type: "overview", title: spec.overviewTitle, content: spec.overview },
        { type: "deep_explanation", title: spec.deepTitle, content: spec.deep },
        { type: spec.visualType ?? "flow_diagram", title: spec.visualTitle, content: spec.visual },
        { type: "code_example", title: spec.codeTitle, content: `${spec.code}\n${spec.codeNote}` },
      ],
    },
    followup_questions: spec.followups,
    seo: {
      metaTitle: `${spec.title} | Ruby interview`,
      metaDescription: spec.direct.length > 157 ? `${spec.direct.slice(0, 154)}...` : spec.direct,
    },
  };
  fs.writeFileSync(file, `${JSON.stringify({ topic: existing.topic, topicSlug, questions: [question] }, null, 2)}\n`);
}

const railsApiSource = path.join(domainRoot, "rails-api-basics");
const railsApiCanonical = path.join(domainRoot, "rest-api-basics");
if (fs.existsSync(railsApiSource)) {
  if (fs.existsSync(railsApiCanonical)) {
    throw new Error(`Cannot consolidate Rails API content: ${railsApiCanonical} already exists.`);
  }
  fs.renameSync(railsApiSource, railsApiCanonical);
}

for (const topicSlug of ["array-methods", "hash-methods"]) {
  const source = path.join(domainRoot, "ruby-collections-and-io", topicSlug);
  const target = path.join(archiveRoot, topicSlug);
  if (!fs.existsSync(source)) continue;
  if (fs.existsSync(target)) throw new Error(`Archive target already exists: ${target}`);
  fs.mkdirSync(archiveRoot, { recursive: true });
  fs.renameSync(source, target);
}

const lessons = [
  {
    moduleSlug: "authentication-basics",
    topicSlug: "devise-basics",
    question: "What is Devise, and how does it handle authentication in Rails?",
    title: "Devise authentication in Rails",
    direct: "Devise is a modular Rails authentication gem built on Warden. It supplies routes, controllers, model modules, password handling, session integration, and helpers such as current_user and authenticate_user!, while the application still owns authorization and product-specific policy.",
    intent: {
      testing: "Whether the learner understands what Devise supplies and what remains application responsibility.",
      common_mistake: "Calling Devise authorization or assuming generated defaults require no security review.",
      to_stand_out: "Explain the request path through routes, Warden, a Devise model, session, and controller helpers.",
    },
    quick: [
      "Devise is a modular Rails authentication solution built on Warden.",
      "devise_for creates authentication routes for a mapped model.",
      "Model modules enable features such as password login, recovery, and confirmation.",
      "authenticate_user! protects an action; current_user exposes the signed-in user.",
      "Authorization rules still belong to the application.",
    ],
    speaking: paragraphs(
      "- Devise is a Rails authentication solution built on the Rack-based Warden framework. Authentication answers who the user is. Devise handles common mechanics such as password verification, sign-in and sign-out, recovery tokens, remember-me behaviour, and optional account confirmation through separate model modules.",
      "- `devise_for :users` adds routes for the mapped User model. The model lists only the modules the application needs, such as `database_authenticatable`, `recoverable`, and `validatable`. During a request, Warden runs the configured strategy, and Devise connects the result to the Rails session.",
      "- For example, a dashboard controller can use `before_action :authenticate_user!`. An anonymous request is sent through the configured failure flow, while a signed-in request can read `current_user`. `user_signed_in?` provides the corresponding boolean helper in controllers and views.",
      "- Devise does not decide whether that user may edit a particular invoice. That is authorization and still needs application policy. Adding a profile field also requires deliberate parameter sanitization; the generated controller flow does not automatically permit every custom attribute.",
      "- I use Devise when conventional browser authentication fits the product and the team wants a maintained, reviewed foundation instead of custom password and recovery code. The defaults still need configuration for mail delivery, redirects, rate limiting, session policy, and the application's threat model. I also test both successful and failed sign-in, logout, recovery expiry, and access to protected actions."
    ),
    overviewTitle: "Devise composes authentication features",
    overview: "Devise is not one opaque login method. A model opts into modules, routes direct authentication requests to engine controllers, Warden executes strategies, and helpers expose the authenticated scope to the application. The application chooses and configures each layer.",
    deepTitle: "Follow a password sign-in from request to helper",
    deep: paragraphs(
      "A Devise mapping connects an authentication scope, usually `:user`, to a Rails model and route set. `devise_for :users` is important because Devise uses that mapping both to route requests and to generate scoped helpers. A second model such as Admin has a separate mapping, routes, session scope, and helpers; sharing a role column is often simpler when both groups use the same sign-in behaviour.",
      "With `database_authenticatable`, the submitted credentials reach a Warden strategy. The model stores a password digest in `encrypted_password`; it does not store the original password. If verification succeeds, Warden records the user in the appropriate session scope. Later requests deserialize that identity and `current_user` returns the mapped record. `authenticate_user!` asks Warden to require that result and invokes the failure application when it is absent.",
      "Other modules add separate contracts. `recoverable` issues time-limited reset tokens and delivers instructions through mail; `confirmable` tracks whether an address has been confirmed; `lockable` can restrict access after configured failures; `rememberable` extends browser recognition. Enabling a module normally needs its database columns and operational support. Confirmation is incomplete if email delivery is unreliable, and recovery is unsafe if token handling or host configuration is wrong.",
      "Devise protects authentication plumbing, not the whole account system. Controllers still need authorization checks, CSRF protection for cookie-backed browser flows, safe redirect handling, login throttling, secure production secrets, and careful logging. Custom registration attributes pass through Devise's parameter sanitizer rather than being opened broadly. Account deletion, audit events, multi-factor authentication, and organization membership are product decisions.",
      "A useful debugging path starts with `bin/rails routes`, then the model's enabled modules, the relevant Devise initializer, request parameters, and the Warden/Devise logs. This identifies whether failure occurred before routing, during credential validation, while writing the session, or during authorization after sign-in. The gem removes repetitive implementation, but understanding this path is what makes customization safe."
    ),
    visualTitle: "Password sign-in path",
    visual: "POST /users/sign_in → Devise route/controller → Warden strategy → User password digest\n        ├─ invalid → failure response\n        └─ valid   → scoped session → current_user / authenticate_user!\n                                      ↓\n                              application authorization",
    codeTitle: "Map a user scope and protect one controller",
    code: fenced("ruby", [
      "# config/routes.rb",
      "Rails.application.routes.draw do",
      "  devise_for :users",
      "end",
      "",
      "# app/models/user.rb",
      "class User < ApplicationRecord",
      "  devise :database_authenticatable, :recoverable, :rememberable, :validatable",
      "end",
      "",
      "# app/controllers/dashboard_controller.rb",
      "class DashboardController < ApplicationController",
      "  before_action :authenticate_user!",
      "",
      "  def show",
      "    @account_name = current_user.name",
      "  end",
      "end",
    ]),
    codeNote: "The route and model establish the user mapping; the before_action requires authentication but does not replace record-level authorization.",
    followups: [
      "What is the difference between authentication and authorization?",
      "Which Devise modules would you enable for a basic account system?",
      "How does a custom registration field pass through Devise strong parameters?",
    ],
  },
  {
    moduleSlug: "authentication-basics",
    topicSlug: "sessions-and-cookies",
    question: "How do sessions and cookies work in Rails?",
    title: "Rails sessions and cookie jars",
    direct: "A browser cookie is a small value sent with matching HTTP requests; Rails exposes plain, signed, and encrypted cookie jars. A Rails session is a server-side interface whose storage depends on the configured session store: CookieStore keeps the session payload in an encrypted cookie, while cache or database stores keep only an identifier in the cookie.",
    intent: {
      testing: "Whether the learner separates cookies, session abstraction, and session-store configuration.",
      common_mistake: "Claiming every Rails cookie is encrypted or that every Rails session is stored in the browser.",
      to_stand_out: "Explain integrity versus confidentiality, CookieStore size, and login session renewal.",
    },
    quick: [
      "Plain cookies are readable and changeable by the browser user.",
      "cookies.signed protects integrity; cookies.encrypted adds confidentiality.",
      "The session API stays the same while its configured store can change.",
      "CookieStore keeps the session payload client-side and has a small cookie-size limit.",
      "Reset the session when privilege changes, especially after sign-in.",
    ],
    speaking: paragraphs(
      "- A cookie is a name and value the browser stores and sends with requests whose domain, path, security, and SameSite rules match. Rails offers a normal cookie jar, `cookies.signed` for tamper detection, and `cookies.encrypted` for both confidentiality and integrity. Plain Rails cookies are not automatically encrypted.",
      "- The Rails `session` hash is an abstraction over a configured store. With the common CookieStore, the session payload is kept in an encrypted, signed browser cookie. With a cache or database-backed store, the cookie normally carries an identifier and the server retrieves the corresponding session data.",
      "- For example, after verifying a password, a controller can renew the session and store only `session[:user_id]`. On the next request it finds that user by ID. Logging out removes the identity and renews or resets the session so an old identifier cannot continue the authenticated state.",
      "- CookieStore is simple but constrained by browser cookie size and sends its payload on every matching request. Even encrypted client-side data can be replayed while valid, so rapidly changing authorization or sensitive business records belong in the database, not inside a cookie.",
      "- I set Secure, HttpOnly, SameSite, expiry, and domain options for the actual deployment and keep stored values small and simple. The key lesson is that cookie transport, cryptographic jar, session API, and session store are related but not interchangeable concepts."
    ),
    overviewTitle: "Four layers are easy to confuse",
    overview: "HTTP defines cookie transport. Rails cookie jars decide whether an individual cookie is plain, signed, or encrypted. The session hash provides per-browser state. The configured session store decides whether the payload lives in CookieStore or behind an identifier in cache or a database.",
    deepTitle: "Trace state across two requests",
    deep: paragraphs(
      "A server sends a `Set-Cookie` response header containing a value and attributes. The browser stores it, then includes it in later requests only when scope and policy permit. `Secure` limits transmission to HTTPS, `HttpOnly` prevents normal client-side JavaScript access, `SameSite` affects cross-site sending, and domain/path narrow where the cookie is attached. These flags reduce risk but do not turn arbitrary cookie content into a safe place for secrets.",
      "Rails' plain `cookies[:theme]` jar is useful for a non-sensitive preference. The value can be read and changed by the user. `cookies.signed[:account_id]` adds a verifier so Rails rejects tampered values, but the user can still read the payload. `cookies.encrypted[:draft]` encrypts and signs. The cryptographic keys derive from application secrets, so secret rotation needs a planned cookie rotation or existing values become unreadable.",
      "The `session` interface looks like a hash regardless of its store. CookieStore serializes the session payload into the protected session cookie, avoiding a server lookup but inheriting cookie size and replay limits. CacheStore or an Active Record-backed store keeps state server-side and uses the cookie to identify it. Those stores make central invalidation possible but add storage availability, cleanup, and lookup concerns.",
      "For login, store a stable identifier rather than an entire model object. A helper loads the current record and still checks present-day account status. Renew or reset the session when authentication changes to defend against session fixation. Remove session state on logout, use an expiry appropriate to the risk, and avoid logging cookie or authorization values.",
      "CSRF and XSS remain separate concerns. Cookie credentials are attached automatically by browsers, so state-changing requests need Rails' CSRF protections unless the architecture has a justified alternative. HttpOnly can reduce token theft through JavaScript, but an XSS payload can still act as the user. Sessions and cookies are mechanisms; safe authentication depends on the surrounding request and browser model."
    ),
    visualTitle: "Session store changes where the payload lives",
    visual: "CookieStore: browser [encrypted session payload] ⇄ Rails session hash\nCache/DB:    browser [opaque session id] → Rails → cache/database [session payload]\nPlain cookie: browser-readable value\nSigned cookie: readable + tamper-evident\nEncrypted cookie: confidential + tamper-evident",
    codeTitle: "Use a small identity session and a plain preference cookie",
    code: fenced("ruby", [
      "class SessionsController < ApplicationController",
      "  def create",
      "    user = User.authenticate_by(email: params[:email], password: params[:password])",
      "    return head :unauthorized unless user",
      "",
      "    reset_session",
      "    session[:user_id] = user.id",
      "    cookies[:theme] = { value: \"dark\", same_site: :lax, secure: Rails.env.production? }",
      "    redirect_to dashboard_path",
      "  end",
      "",
      "  def destroy",
      "    reset_session",
      "    redirect_to root_path",
      "  end",
      "end",
    ]),
    codeNote: "The session holds only the authenticated identity; the plain cookie stores a non-sensitive visual preference.",
    followups: [
      "What is the difference between signed and encrypted cookies?",
      "When would you choose a server-side session store?",
      "Why should an application reset the session after login?",
    ],
  },
  {
    moduleSlug: "authentication-basics",
    topicSlug: "token-auth-intro",
    question: "How does bearer-token authentication work, and is it always stateless?",
    title: "Bearer-token authentication and state",
    direct: "In bearer-token authentication, a client presents a secret token—normally in the Authorization header—and possession is enough to use it, so TLS and leak prevention are essential. The design is not inherently stateless: opaque tokens require server-side lookup, and JWT systems often keep refresh, revocation, or account state even when access-token signatures are verified locally.",
    intent: {
      testing: "Whether the learner understands bearer semantics, opaque versus self-contained tokens, and revocation trade-offs.",
      common_mistake: "Calling all token authentication stateless or treating a signed JWT as encrypted.",
      to_stand_out: "Cover transport, storage, expiry, scope, rotation, revocation, and the 401/403 boundary.",
    },
    quick: [
      "Send bearer tokens in the Authorization header over HTTPS, not in page URLs.",
      "An opaque token is looked up server-side and should be stored hashed at rest.",
      "A signed JWT can be verified locally but its claims are not automatically secret.",
      "Revocation, refresh tokens, and current account checks can reintroduce server state.",
      "401 means authentication failed; 403 means the known identity lacks permission.",
    ],
    speaking: paragraphs(
      "- A bearer token is a credential whose holder can present it to access a protected resource. The client normally sends `Authorization: Bearer <token>` over HTTPS. Because possession is sufficient, the system must prevent the value from leaking through logs, URLs, browser history, analytics, or insecure storage.",
      "- An opaque token is a random secret with no client-readable meaning. The server hashes it for storage and looks up the hash on each request, which is stateful but makes individual revocation straightforward. A JWT can carry signed claims and be verified without a token-row lookup, but a signature provides integrity, not confidentiality.",
      "- For example, a mobile client can receive a short-lived access token and a separately protected refresh token after login. The API checks the token's signature or database record, expiry, audience, and scope before loading current user or tenant state and authorizing the action.",
      "- Token authentication is therefore not automatically stateless. Refresh-token rotation, logout, stolen-token revocation, disabled accounts, changed roles, and signing-key rotation usually require some current server-side state or accept a delay until a short access token expires.",
      "- I choose the simplest model that fits the clients and revocation needs. Browser applications may be safer and simpler with secure HttpOnly cookie sessions; native or service clients often use header tokens. In either case, authentication establishes identity and a separate authorization check decides access."
    ),
    overviewTitle: "Token format does not determine the whole architecture",
    overview: "Bearer describes how a credential is used, opaque versus JWT describes its representation, and stateless describes whether request validation depends on mutable server-side session data. These are three different decisions that can be combined in more than one way.",
    deepTitle: "Compare opaque and self-contained access tokens",
    deep: paragraphs(
      "An opaque access token should be generated with enough randomness that guessing is infeasible. Store only a cryptographic hash, just as a password-reset system avoids storing the usable secret. On every request, hash the presented token and find an active record. The record can hold expiry, scopes, user, client, and revocation time. This adds a lookup but gives the server immediate control over one credential.",
      "A signed JWT contains claims such as issuer, audience, subject, and expiration. A resource server validates the allowed algorithm, signature, issuer, audience, time claims, and any required scope before trusting it. Base64url-encoded claims are readable; signing prevents undetected modification but does not encrypt them. Sensitive private data does not belong in ordinary signed claims.",
      "Local JWT validation can remove a central access-token lookup, yet the broader system often remains partly stateful. A user may be suspended after the token was issued, roles may change, refresh tokens need rotation and reuse detection, and emergency logout may require a deny list or token-version check. If the API skips all current checks, it consciously accepts access until the short-lived token expires.",
      "The client also changes the threat model. Page URLs are a poor token transport because URLs commonly enter history and logs. Browser local storage is readable by injected script; an HttpOnly cookie prevents normal JavaScript reads but is sent automatically and therefore needs CSRF-aware design. Native applications should use platform-protected credential storage. Every bearer flow requires HTTPS.",
      "On failure, an absent, expired, malformed, or unverifiable credential normally produces 401 with an appropriate authentication challenge. A valid identity that lacks permission produces 403. Logs may record a token identifier or request correlation value, never the bearer secret itself. Good token design combines short lifetime, narrow audience and scope, safe storage, rotation, revocation policy, and explicit authorization."
    ),
    visualType: "comparison_table",
    visualTitle: "Opaque token and signed JWT validation",
    visual: "| Step | Opaque token | Signed JWT |\n|---|---|---|\n| Client sends | Bearer secret | Bearer compact token |\n| Core validation | Hash + server lookup | Signature + claims |\n| Immediate individual revocation | Direct | Needs state or short expiry |\n| Claims visible to client | No useful payload | Yes unless separately encrypted |",
    codeTitle: "Verify a hashed opaque token",
    code: fenced("ruby", [
      "require \"digest\"",
      "",
      "class ApiController < ActionController::API",
      "  before_action :authenticate_token!",
      "",
      "  private",
      "",
      "  def authenticate_token!",
      "    scheme, secret = request.authorization.to_s.split(\" \", 2)",
      "    return head :unauthorized unless scheme&.casecmp?(\"Bearer\") && secret",
      "",
      "    digest = Digest::SHA256.hexdigest(secret)",
      "    token = AccessToken.active.find_by(token_digest: digest)",
      "    return head :unauthorized unless token",
      "",
      "    @current_user = token.user",
      "  end",
      "end",
    ]),
    codeNote: "This opaque-token design deliberately performs a database lookup, so it is revocable and stateful rather than inherently stateless.",
    followups: [
      "What is the difference between an opaque token and a JWT?",
      "Why should bearer tokens not appear in query strings?",
      "How would you revoke a short-lived JWT before it expires?",
    ],
  },
  {
    moduleSlug: "rest-api-basics",
    topicSlug: "api-vs-html-mode",
    question: "What is the difference between a full Rails application and an API-only application?",
    title: "Full Rails versus API-only Rails",
    direct: "A full Rails application includes the controller, view, browser-session, asset, and middleware features needed to render HTML. An API-only application starts with ActionController::API, a smaller default middleware set, and generators aimed at JSON services, while still allowing omitted Rails features to be added deliberately.",
    intent: {
      testing: "Whether the learner understands API-only mode as a different default stack rather than a different framework.",
      common_mistake: "Claiming --api makes every action return JSON automatically or makes cookies impossible.",
      to_stand_out: "Compare controller base classes, middleware, generators, rendering responsibility, and incremental opt-in.",
    },
    quick: [
      "Full Rails normally uses ActionController::Base and supports HTML views and browser features.",
      "API-only Rails normally uses ActionController::API and a reduced default stack.",
      "The --api option changes defaults and generators; it does not remove Active Record or routing.",
      "API actions still choose a representation explicitly, commonly with render json:.",
      "Omitted middleware or controller modules can be added when the contract requires them.",
    ],
    speaking: paragraphs(
      "- A full Rails application is configured for server-rendered web pages. `ApplicationController` normally inherits from `ActionController::Base`, controllers can render Action View templates and layouts, and the default stack includes browser-oriented middleware and helpers for sessions, cookies, forgery protection, and other HTML workflows.",
      "- An API-only application is created with `rails new service --api`. Its controller base is `ActionController::API`, which includes a smaller set of controller modules, its middleware stack is reduced, and generators skip browser-facing files that a JSON service usually does not need.",
      "- For example, a mobile backend may accept JSON, load an Active Record model, and call `render json: order, status: :ok`. A full Rails storefront can use the same model and route concepts but render an ERB template inside a layout. The difference is the delivery stack, not whether Rails can use models or RESTful routes.",
      "- API mode does not magically serialize every return value or guarantee good API design. The action must still choose JSON, status, headers, errors, authentication, and versioning. Cookies, sessions, or other omitted features can be added, but doing so should be intentional because it changes middleware and browser-security responsibilities.",
      "- I choose API-only mode when Rails is primarily serving non-browser or separately rendered clients. I choose full Rails when the server owns HTML, forms, and navigation. Starting from the closest default keeps the application clear while Rails still permits a hybrid when requirements genuinely overlap."
    ),
    overviewTitle: "The same Rails core with different defaults",
    overview: "Both modes use Rack, routing, controllers, Active Record when selected, jobs, configuration, and the Rails ecosystem. API-only mode removes default browser presentation and middleware assumptions; full mode supplies them. The application can opt features back in instead of treating the choice as permanent isolation.",
    deepTitle: "Inspect what the --api flag actually changes",
    deep: paragraphs(
      "The `--api` generator sets `config.api_only = true`. The generated `ApplicationController` inherits from `ActionController::API`, whose smaller module set focuses on request parameters, headers, rendering, redirects, status codes, and other API controller needs. Full applications inherit from `ActionController::Base`, which builds on the API controller foundation with browser-facing modules and Action View integration.",
      "The middleware stack also starts smaller. Browser sessions and cookies are not assumed in the same way, and generators avoid views, helpers, and assets for ordinary resources. This reduces unused surface area, but it does not create a non-Rails microframework. The router still dispatches requests, Active Record still maps models when included, Active Job still runs work, and `render json:` still uses Rails rendering support.",
      "Representation remains an action-level decision. Returning a Ruby object from a method does not by itself define an HTTP JSON response. The controller chooses a status, headers, and body, commonly with `render json:` or `head`. Validation errors need a stable error shape; created resources should use an appropriate success status and may include a Location header; a 204 response must not carry a body.",
      "Features can be restored deliberately. A browser-based API using cookie authentication may add cookie and session middleware plus the relevant controller modules, then handle CSRF according to its credential model. An endpoint that also serves an HTML administration view may be better in a full app or separated behind a clear controller boundary. The important point is to understand every added feature's request and security behaviour.",
      "The mode decision therefore follows clients and ownership. If Rails renders the document and handles form navigation, full mode offers coherent defaults. If independent clients own presentation and Rails supplies representations of resources, API-only mode avoids unused browser machinery. Teams should verify with `bin/rails middleware`, the controller ancestors, and generated files rather than relying on the label alone."
    ),
    visualType: "comparison_table",
    visualTitle: "Different defaults, shared Rails foundation",
    visual: "| Concern | Full Rails | API-only Rails |\n|---|---|---|\n| Controller base | ActionController::Base | ActionController::API |\n| Primary output | HTML or other formats | Usually JSON |\n| Views/assets generated | Yes | Usually skipped |\n| Browser middleware | Broader defaults | Reduced defaults |\n| Models/routes/jobs | Available | Available |",
    codeTitle: "Make the representation explicit",
    code: fenced("ruby", [
      "class ApplicationController < ActionController::API",
      "end",
      "",
      "class Api::OrdersController < ApplicationController",
      "  def show",
      "    order = Order.find(params[:id])",
      "    render json: { id: order.id, state: order.state }, status: :ok",
      "  end",
      "end",
    ]),
    codeNote: "ActionController::API provides a focused controller stack, while the action still chooses JSON and its status explicitly.",
    followups: [
      "Which middleware might an API-only app add for cookie sessions?",
      "Does API-only mode remove Active Record?",
      "When is a full Rails application simpler than a separate SPA and API?",
    ],
  },
  {
    moduleSlug: "rest-api-basics",
    topicSlug: "http-verbs-and-status",
    question: "How should a Rails API use HTTP methods and status codes?",
    title: "HTTP methods and status codes in Rails APIs",
    direct: "A Rails API should match HTTP methods to resource semantics—GET reads, POST creates or triggers processing, PUT/PATCH updates, and DELETE removes—and return a status that describes the outcome. Rails symbols such as :created, :no_content, :unprocessable_content, :unauthorized, and :forbidden map to standard HTTP codes.",
    intent: {
      testing: "Whether the learner can design a truthful HTTP contract rather than returning 200 for every result.",
      common_mistake: "Confusing authentication 401 with authorization 403 or returning a response body with 204.",
      to_stand_out: "Explain safety, idempotency, validation errors, and created-resource location.",
    },
    quick: [
      "GET reads and should be safe; PUT, DELETE, and other methods have defined idempotency expectations.",
      "POST commonly returns 201 Created for a new resource.",
      "204 No Content must not include a response body.",
      "401 means credentials are missing or invalid; 403 means access is refused for a known identity.",
      "Validation failure is a client error, commonly 422 with structured details.",
    ],
    speaking: paragraphs(
      "- HTTP methods describe the intended operation. `GET` retrieves a representation and should not change business state. `POST` commonly creates a resource or starts non-idempotent processing. `PUT` replaces a resource representation, `PATCH` applies a partial update, and `DELETE` requests removal.",
      "- Status codes describe what happened, not which controller action ran. A successful read is commonly 200, a newly created resource is 201, and a successful operation with no response representation can be 204. A missing resource is 404, while invalid submitted fields commonly produce 422 with machine-readable error details.",
      "- For example, `POST /articles` can return the created JSON with `status: :created` and a Location header pointing to `/articles/42`. If validation fails, the same action returns the model errors with `:unprocessable_content` instead of hiding failure behind 200.",
      "- Authentication and authorization have different failures. Missing, expired, or invalid credentials normally produce 401; an authenticated user who is not allowed to perform the operation gets 403. A malformed request may be 400, while an unexpected server failure belongs in the 5xx range and should be logged without leaking internals.",
      "- I keep the contract consistent across endpoints and test method, path, status, headers, and body together. Correct codes make clients simpler, improve monitoring, and let caches and intermediaries apply HTTP semantics instead of reverse-engineering a custom success field. The response body can add detail, but it should never contradict the status line."
    ),
    overviewTitle: "Method states intent; status reports outcome",
    overview: "The request method and resource URL tell the server what operation the client wants. The response status summarizes the result before the client parses a body. Headers add details such as the created resource's location, caching rules, or authentication challenge.",
    deepTitle: "Safety and idempotency shape retry behaviour",
    deep: paragraphs(
      "A safe method is intended only to retrieve or inspect state. GET and HEAD are safe, so links, crawlers, prefetching, and caches may issue them without expecting a mutation. An endpoint that deletes a record on GET violates that contract even if the controller code works, because infrastructure and user agents are allowed to treat GET as observation.",
      "Idempotent means repeating the same request has the same intended effect as making it once. PUT and DELETE are defined as idempotent, although each request may still create logs or update metrics. POST is not generally idempotent. Payment or job-start endpoints often add an idempotency key so a client can retry after a timeout without creating duplicate business work.",
      "For creation, 201 says a new resource exists. Rails can render the representation and set `location: article_url(article)`. A 202 response instead means processing was accepted but is not finished, which is appropriate when a background job owns completion. A 204 response means there is no content and Rails will drop a body supplied with a non-content status, so use 200 when the client needs an updated representation.",
      "Client errors should remain specific without exposing sensitive data. A malformed JSON document can be 400. Failed authentication is 401, often with a `WWW-Authenticate` challenge. Refused permission is 403. A route or visible resource that does not exist is 404. Semantic validation errors can use 422 and a stable structure such as `{ errors: [{ field, code, message }] }`.",
      "The final design must be documented and tested as a contract. Request specs should assert allowed methods, exact status, important headers, and body shape for success and failure. Monitoring should group meaningful status families, while exception handling converts expected domain failures without turning programming defects into misleading 4xx responses."
    ),
    visualType: "comparison_table",
    visualTitle: "A practical resource contract",
    visual: "| Request | Success | Common client failure |\n|---|---|---|\n| GET /articles/42 | 200 + article | 404 |\n| POST /articles | 201 + Location | 422 validation |\n| PATCH /articles/42 | 200 or 204 | 404 / 422 |\n| DELETE /articles/42 | 204 | 404 / 403 |",
    codeTitle: "Return distinct creation outcomes",
    code: fenced("ruby", [
      "class Api::ArticlesController < ActionController::API",
      "  def create",
      "    article = Article.new(article_params)",
      "",
      "    if article.save",
      "      render json: article, status: :created, location: api_article_url(article)",
      "    else",
      "      render json: { errors: article.errors.to_hash }, status: :unprocessable_content",
      "    end",
      "  end",
      "",
      "  private",
      "",
      "  def article_params",
      "    params.expect(article: [:title, :body])",
      "  end",
      "end",
    ]),
    codeNote: "The success response identifies the new resource; validation failure remains a distinct client-visible outcome.",
    followups: [
      "What is the difference between safe and idempotent HTTP methods?",
      "When should an endpoint return 202 Accepted?",
      "Why must a 204 response have no body?",
    ],
  },
  {
    moduleSlug: "rest-api-basics",
    topicSlug: "json-responses",
    question: "How do you return a clear and stable JSON response from a Rails controller?",
    title: "Rendering JSON from Rails controllers",
    direct: "Use render json: with an explicit representation and status, selecting only the fields the API contract exposes. Keep success and error shapes consistent, avoid leaking whole models or internal exceptions, and use head for a response that intentionally has no body.",
    intent: {
      testing: "Whether the learner treats JSON as a public representation rather than a dump of an Active Record object.",
      common_mistake: "Rendering every model column by default or calling render and then continuing into a second response.",
      to_stand_out: "Discuss status, field selection, associations, error shape, and serialization boundaries.",
    },
    quick: [
      "render json: serializes the supplied value and sets a JSON content type.",
      "Choose response fields as an API contract; do not expose every database column.",
      "Pair the body with an explicit status for non-default outcomes.",
      "Use head :no_content when success intentionally has no body.",
      "Return or branch after rendering so the action sends only one response.",
    ],
    speaking: paragraphs(
      "- In a Rails controller, `render json:` turns the supplied Ruby value into the response body and uses the JSON format. I pass an explicit representation—often a hash, serializer result, or carefully selected model fields—rather than assuming every database column belongs in a public API.",
      "- The response also needs an honest status. A normal read can use the default 200, creation can use `:created`, a validation failure can use 422, and an operation that intentionally returns no representation can use `head :no_content`. A 204 response should not include JSON.",
      "- For example, an article endpoint can return `{ id, title, author: { id, name } }` and omit internal moderation flags, password-related fields, and timestamps the contract does not promise. An error can return a stable list of field and code values instead of an exception message or HTML page.",
      "- `render` does not automatically stop Ruby method execution. The action should use an if/else branch, `return`, or another clear control flow so it does not later render or redirect again. Associations also need query planning; serializing comments one record at a time can create an N+1 query problem.",
      "- I keep serialization separate enough to test its shape, version changes deliberately, and use request tests for content type, status, and exact keys. JSON is a representation of a resource for clients, not a mirror of the current model schema."
    ),
    overviewTitle: "A response has status, headers, and representation",
    overview: "`render json:` addresses the representation and content type. The action still owns status and other headers. A good API chooses all three together and exposes stable product concepts instead of whichever columns happen to be present today.",
    deepTitle: "Design the representation before choosing a serializer",
    deep: paragraphs(
      "Start with the client-visible resource contract. Decide which identifiers, attributes, relationships, links, and error codes a caller needs. This prevents accidental exposure of columns such as password digests, internal notes, deletion flags, or operational counters. A serializer library can organize that contract, but installing one does not make the field choices automatically correct.",
      "Rails can serialize a hash, array, or object passed to `render json:`. For small endpoints, constructing a hash can be explicit and easy to review. For repeated or nested representations, a serializer object or view layer avoids duplication. Whichever tool is used, keep the shape deterministic: a collection should not switch between an array and an object, and an absent optional field should follow a documented null or omission rule.",
      "Errors deserve the same care. A model's human-readable full messages are useful for display, but clients often also need stable field and machine code values. Authentication errors should not reveal whether an email exists. Unexpected exceptions should be logged with a request correlation identifier and mapped to a generic server response rather than returning stack traces.",
      "Serialization can trigger database work. Rendering a hundred articles and asking each one for its author may issue a query per row. Load required relationships with an appropriate Active Record query and verify the SQL count. Avoid including huge nested graphs by default; pagination and links usually create a clearer boundary than recursively embedding every association.",
      "Finally, response control flow matters. Rails allows one response per request. `render` sets the response but does not halt the method, so a later render can raise a double-render error or later code can perform unwanted work. Branch once, return where clarity requires it, and cover successful, empty, invalid, unauthorized, and missing cases with request tests."
    ),
    visualTitle: "Build a response from the contract outward",
    visual: "resource + requested operation\n        ↓\nselect public fields and relationships\n        ↓\nload data without N+1 → serialize stable JSON\n        ↓\nstatus + headers + body → one HTTP response",
    codeTitle: "Render an explicit article representation",
    code: fenced("ruby", [
      "class Api::ArticlesController < ActionController::API",
      "  def show",
      "    article = Article.includes(:author).find(params[:id])",
      "    render json: {",
      "      id: article.id,",
      "      title: article.title,",
      "      author: { id: article.author.id, name: article.author.name }",
      "    }, status: :ok",
      "  end",
      "end",
    ]),
    codeNote: "The endpoint exposes a deliberate shape and preloads the one relationship it serializes.",
    followups: [
      "Why can serializing associations cause N+1 queries?",
      "When would you use head :no_content instead of render json:?",
      "How would you version a breaking JSON field change?",
    ],
  },
  {
    moduleSlug: "rest-api-basics",
    topicSlug: "request-response-cycle",
    question: "What happens during the Rails request-response cycle?",
    title: "The Rails request-response cycle",
    direct: "A Rack-compatible server passes an HTTP request through the Rails middleware stack, the router matches method and path to a controller action, callbacks and the action run application logic, and Rails builds a status, headers, and body that travels back through middleware to the server and client.",
    intent: {
      testing: "Whether the learner can locate routing, middleware, controller, model, rendering, and error handling in one flow.",
      common_mistake: "Saying the request goes directly to a model or that render sends a second browser request.",
      to_stand_out: "Trace both the inbound and outbound path and identify where cross-cutting work belongs.",
    },
    quick: [
      "The web server exposes the request through Rack's environment interface.",
      "Middleware can inspect or change the request and later the response.",
      "The router matches HTTP method and path to a controller action.",
      "The controller coordinates parameters, models or services, and rendering.",
      "The response returns as status, headers, and body through middleware.",
    ],
    speaking: paragraphs(
      "- A Rails request begins at a Rack-compatible application server. Rack represents the incoming HTTP request as an environment and expects the application to produce a three-part response: status, headers, and a body that can be enumerated.",
      "- The request passes through configured middleware. Middleware can handle concerns such as request IDs, logging, static files, cookies, sessions, security headers, or exception translation. Each layer can do work before calling the next application and again while the response returns.",
      "- The Rails router then matches the HTTP method and path to a controller action and extracts route parameters. The controller runs callbacks and the action, reads parameters and headers, performs authentication and authorization, coordinates models or services, and chooses a response.",
      "- For example, `GET /api/articles/42` can match `Api::ArticlesController#show`. The action loads Article 42, a serializer builds its representation, and `render json:` prepares a 200 response. A missing record may be translated into a consistent 404 by application exception handling.",
      "- The completed response travels outward through middleware to the server and client. Understanding both directions helps place bugs: a 404 may be routing or record lookup, a missing session may be middleware configuration, and an N+1 problem occurs during application data loading or serialization. I trace the request ID across logs and inspect the first layer whose observed output differs from the expected flow."
    ),
    overviewTitle: "Rails is one Rack application surrounded by middleware",
    overview: "Rack gives web servers and frameworks a common request and response contract. Rails composes middleware around its router and controller dispatcher. The inbound path narrows from HTTP to an action; the outbound path expands the action's result back into HTTP.",
    deepTitle: "Locate each responsibility along the path",
    deep: paragraphs(
      "The application server accepts a network request and passes a Rack environment hash to Rails. That environment contains request method, path, headers, input, server information, and shared objects added by earlier middleware. Rails wraps it with request helpers, but the underlying contract remains a callable application returning `[status, headers, body]`.",
      "Middleware forms a nested chain. A request ID layer may add an identifier before dispatch and copy it to response headers afterward. Session middleware can decode a session cookie before a controller reads `session`. Exception middleware can catch an error raised deeper in the stack and turn it into an environment-appropriate response. `bin/rails middleware` reveals the real configured order, which differs between full and API-only applications.",
      "Routing considers both method and path. `GET /articles/42` and `DELETE /articles/42` can reach different actions even though the path text is identical. Dynamic segments become parameters. The dispatcher instantiates the controller, runs applicable callbacks, and invokes the public action. Authentication and authorization should happen before protected business work, while parameter filtering protects mass assignment at the controller boundary.",
      "The action coordinates rather than doing every job itself. It may load Active Record relations, invoke domain or service code, enqueue a background job, then render JSON or return an empty response. Rendering constructs the body for the current request; redirecting instead sends a 3xx response whose Location invites the client to make a later request.",
      "On the outward path, middleware can compress the body, add headers, finalize logs, or handle exceptions. The server writes the HTTP response to the client. Observability should follow the same journey: correlate request ID, route, controller action, database queries, job enqueueing, status, and duration. This map turns a vague 'Rails is slow' report into a specific middleware, query, serialization, or network question."
    ),
    visualTitle: "Inbound request and outbound response",
    visual: "client → web server → Rack middleware → router → callbacks/controller → model/service → renderer\nclient ← web server ← Rack middleware ← status + headers + body ←───────────────┘",
    codeTitle: "Trace one request with a request identifier",
    code: fenced("ruby", [
      "class Api::ArticlesController < ActionController::API",
      "  before_action :authenticate_token!",
      "",
      "  def show",
      "    article = Article.find(params[:id])",
      "    response.set_header(\"X-Request-ID\", request.request_id)",
      "    render json: { id: article.id, title: article.title }",
      "  end",
      "",
      "  private",
      "",
      "  def authenticate_token!",
      "    head :unauthorized unless request.authorization.present?",
      "  end",
      "end",
    ]),
    codeNote: "The callback runs before the action, route parameters identify the record, and the renderer creates the current response.",
    followups: [
      "What contract does Rack use for a response?",
      "How is middleware different from a controller before_action?",
      "What is the difference between render and redirect_to?",
    ],
  },
  {
    moduleSlug: "rest-api-basics",
    topicSlug: "restful-routes",
    question: "How do RESTful resource routes work in Rails?",
    title: "RESTful resource routing in Rails",
    direct: "Rails resource routing maps HTTP method plus resource-shaped path to conventional controller actions and path helpers. resources :articles creates seven full-stack routes; an API usually limits that set to actions it exposes and omits the new and edit form routes.",
    intent: {
      testing: "Whether the learner can map method, collection/member path, action, and helper without memorizing URLs in isolation.",
      common_mistake: "Using verbs in resource paths or confusing new/edit form routes with create/update operations.",
      to_stand_out: "Explain member versus collection, only/except, nesting limits, and route inspection.",
    },
    quick: [
      "The router matches the combination of HTTP method and path.",
      "resources creates index, show, new, create, edit, update, and destroy routes.",
      "Collection routes have no member ID; member routes include :id.",
      "API routes commonly use only: to omit new and edit HTML form pages.",
      "Use bin/rails routes to inspect the actual mapping and helpers.",
    ],
    speaking: paragraphs(
      "- Rails resource routing treats a model-like concept as a resource and maps standard HTTP operations to conventional controller actions. The router uses method plus path, so `GET /articles/7` reaches `show` while `PATCH /articles/7` reaches `update`.",
      "- `resources :articles` creates seven routes in a full application: index, show, new, create, edit, update, and destroy. `new` and `edit` serve HTML forms; `create` and `update` receive the submitted changes. The same declaration also creates named path and URL helpers.",
      "- For example, a JSON API can declare `resources :articles, only: [:index, :show, :create, :update, :destroy]`. It keeps collection reads and writes plus member reads, updates, and deletes without publishing form-page routes that the API does not serve.",
      "- Extra operations should be classified carefully. A preview for one article is a member route; a search over all articles is a collection route. Deeply nested resources create long URLs and coupled controllers, so I usually nest only when the parent identity is truly required and limit nesting depth.",
      "- I verify the result with `bin/rails routes`, including verb, path, controller action, parameter names, and helper. Resourceful routing is valuable because it makes the HTTP contract predictable, not because every controller must expose all seven actions. I then cover the published routes with request specs so an accidental route change is caught before a client receives an unexpected 404 or reaches the wrong action."
    ),
    overviewTitle: "Two axes define a resource route",
    overview: "The path identifies either a collection or one member, and the HTTP method identifies the operation. Rails turns that pair into a controller action and generates a helper for outbound URL construction. This avoids embedding action verbs such as /createArticle in the path.",
    deepTitle: "Derive the seven routes instead of memorizing them",
    deep: paragraphs(
      "A collection path has no record identifier. `GET /articles` lists the collection through `index`, while `POST /articles` submits a new representation to `create`. A member path includes `:id`. `GET /articles/:id` reads one record through `show`, `PATCH` or `PUT` sends changes to `update`, and `DELETE` requests `destroy`.",
      "The remaining two routes exist to support server-rendered forms. `GET /articles/new` reaches `new` and displays a creation form. `GET /articles/:id/edit` reaches `edit` and displays an update form. They do not modify data. A JSON API with an independent client normally omits them using `only`, while a full Rails application can use all seven.",
      "Route order matters because Rails chooses the first matching route. A custom path such as `/articles/search` placed after a broad member route may be interpreted as an ID in some route shapes. Prefer resourceful member or collection declarations, meaningful constraints, and `bin/rails routes --expanded` when diagnosing an unexpected match.",
      "Nesting communicates ownership in the URL: `/magazines/3/ads/8` says the ad is addressed through magazine 3. It can also duplicate information and force every child action to load a parent. Shallow routes or top-level resources are often clearer after one level. Use member routes for one existing resource and collection routes for operations over the set.",
      "Routes are not authorization. A matching route only decides which code receives the request. The controller must still authenticate the caller, authorize the record or collection, validate parameters, and choose the response. Request specs should cover both routability and behaviour, especially when `only`, namespaces, version prefixes, or constraints define the public API surface. URL helpers should be preferred over hand-built strings because they follow the declared host, namespace, and parameter encoding rules."
    ),
    visualType: "comparison_table",
    visualTitle: "Resource route map",
    visual: "| Method and path | Scope | Action |\n|---|---|---|\n| GET /articles | Collection | index |\n| POST /articles | Collection | create |\n| GET /articles/:id | Member | show |\n| PATCH/PUT /articles/:id | Member | update |\n| DELETE /articles/:id | Member | destroy |",
    codeTitle: "Publish only the API actions that exist",
    code: fenced("ruby", [
      "Rails.application.routes.draw do",
      "  namespace :api do",
      "    namespace :v1 do",
      "      resources :articles, only: [:index, :show, :create, :update, :destroy] do",
      "        get :preview, on: :member",
      "        get :search, on: :collection",
      "      end",
      "    end",
      "  end",
      "end",
    ]),
    codeNote: "The API omits form routes, then labels preview as member work and search as collection work.",
    followups: [
      "Which seven routes does resources create by default?",
      "What is the difference between a member and collection route?",
      "Why should route nesting usually remain shallow?",
    ],
  },
  {
    moduleSlug: "ruby-collections-and-io",
    topicSlug: "file-io-basics",
    question: "How do you safely read and write files in Ruby?",
    title: "Reading and writing files in Ruby",
    direct: "Ruby offers convenience methods such as File.read, File.write, and File.foreach, plus File.open for controlled access modes and streaming. Use the block form of File.open so Ruby closes the handle even when an exception occurs, choose r, w, or a deliberately, and treat paths, encoding, size, and partial failure as input concerns.",
    intent: {
      testing: "Whether the learner can choose whole-file or streaming I/O and manage resources safely.",
      common_mistake: "Using w when append was intended, loading an unbounded file into memory, or leaving a handle open.",
      to_stand_out: "Discuss block cleanup, access modes, encoding, atomic replacement, and untrusted paths.",
    },
    quick: [
      "File.read and File.write are concise for bounded whole-file operations.",
      "File.foreach streams lines without loading the entire file.",
      "File.open with a block closes the handle on normal exit or exception.",
      "Mode r reads, w creates or truncates, and a writes at the end.",
      "Validate paths, expected size, encoding, and failure behaviour at the boundary.",
    ],
    speaking: paragraphs(
      "- Ruby's `File` class inherits from `IO` and provides both convenience and streaming operations. `File.read(path)` returns a whole file as a string, while `File.write(path, text)` writes a complete string. They are clear when the data is known to be small and bounded.",
      "- For larger input, `File.foreach(path)` yields one line at a time. When I need a handle, encoding, or several writes, I use `File.open(path, mode)` with a block. Ruby closes that handle when the block exits, including when an exception is raised.",
      "- The mode must be deliberate. `r` reads an existing file, `w` creates or truncates before writing, and `a` preserves existing content and appends at the end. For example, an audit log can open in append mode, while replacing a generated report should not append yesterday's report.",
      "- File operations can fail because a path is missing, permissions deny access, storage is full, bytes do not match the expected encoding, or input is larger than expected. I rescue only errors the application can handle and keep the original exception context for logging.",
      "- Paths from users need a controlled base directory and filename policy; simple string concatenation can enable path traversal. For important replacement files, I write a temporary file in the same filesystem, flush it as required, and rename it into place so readers do not observe half-written output. I test missing, malformed, and oversized input as separate failure cases."
    ),
    overviewTitle: "Choose whole-file convenience or bounded streaming",
    overview: "The API choice should follow data size and lifetime. Whole-file helpers make small configuration or fixture work concise. Iterators and block-opened handles keep memory bounded and make ownership explicit for logs, exports, and large imports.",
    deepTitle: "Treat a file as a resource with a lifecycle",
    deep: paragraphs(
      "Opening a file asks the operating system for a handle with specific permissions and an initial position. Read mode starts at the beginning and rejects writing. Write mode permits output but truncates an existing file as part of opening it. Append mode keeps existing bytes and places writes at the end. The plus variants allow both reading and writing, while binary mode prevents text transformations that matter on some platforms.",
      "`File.open` without a block returns a handle that the caller must close, usually with an ensure clause. The block form expresses ownership more safely: Ruby yields the handle, then closes it while leaving the block even if parsing or writing raises. `File.read` and `File.write` manage their short-lived handles internally. For line-oriented data, `File.foreach` avoids constructing one large string and naturally supports early filtering.",
      "Encoding is part of the input contract. A text file may declare or require UTF-8, contain a byte-order mark, or include invalid bytes. Pass an explicit encoding when the source is known and decide whether invalid input should be rejected or transcoded. Binary images and archives should use binary mode and should not be treated as encoded text.",
      "Failure can occur after only part of a write reaches storage. When a file must appear atomically, write the complete content to a temporary file in the destination directory, set permissions, flush or fsync when durability matters, and rename it over the target. Same-filesystem rename is commonly atomic, but application requirements still decide backup and recovery policy.",
      "Security starts before opening. Resolve requested paths against an approved base, reject traversal outside that root, avoid following unexpected symbolic links where the threat model requires it, limit file size, and do not trust an extension as a content check. Rescue narrow exceptions such as `Errno::ENOENT` only where the program has a meaningful fallback; otherwise let the caller receive a useful failure rather than silently returning incomplete data."
    ),
    visualType: "comparison_table",
    visualTitle: "Pick the operation by ownership and size",
    visual: "| Need | Ruby API | Memory / lifecycle |\n|---|---|---|\n| Small complete input | File.read | Whole file in one String |\n| Stream lines | File.foreach | One line at a time |\n| Controlled multi-step access | File.open block | Auto-close after block |\n| Replace complete small output | File.write | Opens, writes, closes |",
    codeTitle: "Stream input and close output automatically",
    code: fenced("ruby", [
      "require \"tmpdir\"",
      "",
      "Dir.mktmpdir do |directory|",
      "  source = File.join(directory, \"scores.txt\")",
      "  report = File.join(directory, \"passed.txt\")",
      "  File.write(source, \"Ada,91\\nLin,67\\nSam,84\\n\", mode: \"w:UTF-8\")",
      "",
      "  File.open(report, \"w:UTF-8\") do |output|",
      "    File.foreach(source, encoding: \"UTF-8\") do |line|",
      "      name, score = line.strip.split(\",\", 2)",
      "      output.puts(name) if Integer(score, 10) >= 80",
      "    end",
      "  end",
      "",
      "  raise \"unexpected report\" unless File.read(report) == \"Ada\\nSam\\n\"",
      "end",
    ]),
    codeNote: "The input is streamed line by line; the output handle closes automatically when its block ends.",
    followups: [
      "What is the difference between w and a file modes?",
      "When should you use File.foreach instead of File.read?",
      "How would you prevent path traversal in a download endpoint?",
    ],
  },
  {
    moduleSlug: "ruby-collections-and-io",
    topicSlug: "json-yaml-basics",
    question: "How do you work safely with JSON and YAML in Ruby?",
    title: "JSON and YAML parsing in Ruby",
    direct: "Use JSON.generate or JSON.dump and JSON.parse for interoperable data, remembering that object keys parse as strings unless symbolize_names is requested. Use YAML.safe_load for untrusted or externally editable YAML, permitting only required classes and aliases, because general YAML deserialization can construct Ruby-specific objects.",
    intent: {
      testing: "Whether the learner distinguishes data format, Ruby object mapping, parse errors, and safe YAML loading.",
      common_mistake: "Using YAML.load on untrusted text or assuming JSON round-trips symbols and custom Ruby objects.",
      to_stand_out: "Explain string keys, allowed YAML classes, schema validation, and format choice by boundary.",
    },
    quick: [
      "JSON.generate and JSON.parse handle standard interoperable JSON values.",
      "JSON object keys parse as strings unless symbolize_names: true is requested.",
      "YAML supports richer constructs, so use YAML.safe_load for untrusted text.",
      "safe_load permits a small basic class set and rejects other classes by default.",
      "Parsing proves syntax, not that the data matches the application's schema.",
    ],
    speaking: paragraphs(
      "- JSON and YAML are text formats that Ruby can parse into arrays, hashes, strings, numbers, booleans, and nil-like values. JSON is a narrow, widely interoperable format for APIs. YAML is more human-oriented and supports comments, aliases, and richer type conventions, so it is common in configuration.",
      "- With `require 'json'`, `JSON.generate(value)` creates JSON and `JSON.parse(text)` reads it. JSON object keys become Ruby strings by default. `symbolize_names: true` is convenient for trusted, bounded structures, but creating symbols from uncontrolled keys needs deliberate limits and consistency.",
      "- With `require 'yaml'`, I use `YAML.safe_load` for content that may be edited or supplied outside trusted source code. It accepts basic scalar and collection classes by default and rejects other Ruby classes and aliases unless the application explicitly permits them.",
      "- For example, an API response can be parsed as JSON, then checked for required `id` and `name` fields and expected types. A YAML deployment file can be safely loaded with string keys and validated against a known environment schema before any setting is applied.",
      "- Parsing handles syntax and representation, not trust or business correctness. I catch `JSON::ParserError` or `Psych::SyntaxError` at the boundary, limit input size and nesting where needed, validate the resulting shape, and avoid logging secrets from malformed configuration or payloads. Output generation follows the same rule: serialize an intentional public shape rather than an arbitrary Ruby object graph."
    ),
    overviewTitle: "Parsing has two separate questions",
    overview: "First, can the bytes form valid JSON or YAML? Second, does the resulting value have the fields, types, size, and meaning this application allows? A successful parser answers only the first question; schema or domain validation answers the second.",
    deepTitle: "Understand what crosses the text boundary",
    deep: paragraphs(
      "JSON has a deliberately small data model: objects with string member names, arrays, strings, numbers, booleans, and null. Ruby hashes can have symbol or object keys and can contain arbitrary objects, so a JSON round trip is not an identity operation. Symbol keys become JSON object names and parse back as strings by default; Time, Date, Decimal, and application objects need an explicit representation.",
      "`JSON.parse` can create symbol keys with `symbolize_names: true`, but one project should choose a consistent boundary convention. String keys match the JSON model and avoid converting arbitrary external field names into process-wide identifiers on older Ruby implementations. Parse errors should produce a controlled client or configuration failure rather than a generic nil that later crashes far from the boundary.",
      "YAML can express anchors, aliases, tagged values, and language-specific objects. That flexibility is useful for trusted internal files but dangerous for untrusted deserialization. `YAML.safe_load` allows basic classes and rejects unapproved classes. Permit a class such as Date only when the schema genuinely needs it, and enable aliases only when the expected format uses them and resource limits are considered.",
      "Safe deserialization does not make a configuration correct. After parsing, verify the top-level type, permitted keys, required values, enum choices, numeric ranges, URL schemes, and any relationship between fields. For an API, cap request size before parsing and avoid nesting that can exhaust memory or CPU. For configuration, include a filename in error reporting and fail startup with a clear message rather than running with guessed defaults.",
      "Choose the format by boundary. JSON is predictable for public web clients and has broad tooling. YAML is readable for controlled configuration but whitespace-sensitive and more complex. Do not use either as a secure object store or authorization mechanism. Convert domain objects to an intentional data shape on output, validate that shape on input, and keep secrets out of example files and parser error logs."
    ),
    visualType: "comparison_table",
    visualTitle: "Format and loader choice",
    visual: "| Concern | JSON | YAML |\n|---|---|---|\n| Typical boundary | APIs and interoperable data | Human-edited configuration |\n| Ruby entry point | JSON.parse | YAML.safe_load |\n| Default object keys | Strings | Usually strings for plain mappings |\n| Ruby-specific object tags | Not part of JSON | Possible; reject unless permitted |\n| Next step after parse | Validate schema | Validate schema |",
    codeTitle: "Round-trip basic values and safely load YAML",
    code: fenced("ruby", [
      "require \"json\"",
      "require \"yaml\"",
      "",
      "payload = { \"name\" => \"Ada\", \"skills\" => [\"Ruby\", \"SQL\"] }",
      "json = JSON.generate(payload)",
      "parsed_json = JSON.parse(json)",
      "raise \"missing name\" unless parsed_json.fetch(\"name\").is_a?(String)",
      "",
      "yaml = <<~YAML",
      "  environment: production",
      "  workers: 4",
      "YAML",
      "config = YAML.safe_load(yaml)",
      "raise \"bad workers\" unless config.fetch(\"workers\").is_a?(Integer)",
    ]),
    codeNote: "Both parsers return basic Ruby values; explicit checks then enforce the application's expected shape.",
    followups: [
      "Why does JSON.parse normally return string keys?",
      "What does YAML.safe_load reject by default?",
      "Why is schema validation still needed after safe parsing?",
    ],
  },
  {
    moduleSlug: "ruby-security-basics",
    topicSlug: "sql-injection-basics",
    question: "What is SQL injection, and how does Rails prevent it?",
    title: "Preventing SQL injection in Rails",
    direct: "SQL injection occurs when untrusted data is interpreted as SQL syntax because code builds a query by concatenation or interpolation. Use Active Record hash conditions or placeholder binds for values, allowlist any dynamic identifiers such as sort columns, and keep database permissions limited; input validation alone is not a substitute for parameterization.",
    intent: {
      testing: "Whether the learner knows exactly where Active Record parameterization helps and where it does not.",
      common_mistake: "Interpolating params into a where/order string or treating a validated string as safely quoted SQL.",
      to_stand_out: "Separate SQL structure from data, discuss dynamic identifiers, and include defense in depth.",
    },
    quick: [
      "Injection happens when untrusted input becomes SQL structure instead of a bound value.",
      "Hash conditions and placeholder conditions bind values safely.",
      "Never interpolate request data into SQL fragments.",
      "Column names and sort directions cannot be handled as ordinary values; map them through an allowlist.",
      "Least-privilege database credentials reduce damage but do not replace safe queries.",
    ],
    speaking: paragraphs(
      "- SQL injection is a boundary failure where attacker-controlled text becomes part of the SQL program. It commonly happens when code interpolates a request value into a string such as `where(\"email = '#{params[:email]}'\")`, allowing quotes or operators in the input to change the query's meaning.",
      "- Rails Active Record protects values when I use structured hash conditions or placeholders. `User.where(email: params[:email])` and `User.where('age >= ?', params[:age])` send the value separately from the SQL template, so database quoting treats an attack payload as data rather than executable syntax.",
      "- For example, a search endpoint can bind the entered title and limit. If the client also chooses a sort field, I map `created` or `title` to a fixed application-owned column expression instead of inserting the client's raw string into `order`.",
      "- Parameter binding applies to values, not arbitrary SQL identifiers, keywords, or complete fragments. Methods that accept SQL strings—custom select clauses, order fragments, joins, and raw queries—need special review. Type validation can improve errors, but rejecting a few suspicious characters is not a reliable injection defense.",
      "- I combine safe query construction with a database account that has only required privileges, code review around raw SQL, tests using hostile input, and logs that do not reveal sensitive parameters. The central rule is constant: application code defines SQL structure; external input can occupy only controlled data positions."
    ),
    overviewTitle: "Keep query grammar separate from request data",
    overview: "A parameterized query sends a fixed SQL statement shape plus bound values. The database parses the structure without treating characters inside a bound value as quotes, operators, or a second statement. This is stronger than trying to clean SQL syntax out of user input.",
    deepTitle: "Know where Active Record leaves the safe path",
    deep: paragraphs(
      "A query such as `User.where(email: value)` gives Active Record both the column and the Ruby value as separate inputs. A placeholder condition does the same with an explicit SQL template. The adapter quotes and binds the value according to its type. An input like `' OR 1=1 --` remains one string value and cannot close a quote that the application never assembled itself.",
      "Interpolation reverses that separation. When request text is inserted into an SQL string before the adapter sees it, the database receives one combined program. Escaping by hand is fragile because databases have different syntax, encodings, modes, and value types. Rails sanitization helpers exist for specialized framework code, but ordinary application queries should prefer structured Active Record APIs and binds.",
      "Not every dynamic query part is a value. A placeholder cannot stand for a column name, table name, `ASC` keyword, or arbitrary operator. For sorting, translate a small public choice through a hash such as `{ 'newest' => { created_at: :desc }, 'title' => { title: :asc } }`. Reject unknown choices. The same allowlist principle applies to selected fields and report expressions.",
      "Raw SQL may be justified for a database-specific feature or measured performance path. Keep the static statement close to reviewed code, bind every external value through the adapter's supported API, cover it with tests, and avoid granting the application database user schema-changing privileges. A compromised read query should not automatically be able to drop tables or create users.",
      "Testing should prove behaviour rather than search for one famous payload. Send quotes, comments, wildcards, Unicode, very long values, unexpected types, and invalid sort keys. Confirm the endpoint returns the correct empty or validation result and that the SQL shape in logs stays constant. Parameter filtering, log filtering, dependency updates, and database monitoring complete the defense, but none makes string interpolation safe."
    ),
    visualTitle: "Unsafe construction versus value binding",
    visual: "unsafe: SQL text + user text → one parsed SQL program → input can change grammar\nsafe:   fixed SQL template ─┐\n        bound user value ───┴→ database treats value as data",
    codeTitle: "Bind values and map a sort choice",
    code: fenced("ruby", [
      "SORTS = {",
      "  \"newest\" => { created_at: :desc },",
      "  \"title\" => { title: :asc }",
      "}.freeze",
      "",
      "scope = User.where(\"email LIKE ?\", \"%#{User.sanitize_sql_like(params[:email].to_s)}%\")",
      "order = SORTS.fetch(params.fetch(:sort, \"newest\"), SORTS.fetch(\"newest\"))",
      "users = scope.order(order).limit(50)",
    ]),
    codeNote: "The search value is escaped for LIKE wildcards and then bound; the sort identifier comes only from application-owned choices.",
    followups: [
      "Why can a placeholder bind a value but not a column name?",
      "Which Active Record methods deserve extra review because they accept SQL strings?",
      "How is LIKE wildcard escaping different from SQL parameterization?",
    ],
  },
  {
    moduleSlug: "ruby-security-basics",
    topicSlug: "strong-params",
    question: "What are Strong Parameters in Rails, and what do they not protect?",
    title: "Strong Parameters and mass assignment",
    direct: "Strong Parameters require controller input to be explicitly permitted before Active Model mass assignment. Use params.expect in current Rails or require(...).permit(...) in established code to select the allowed shape, but still validate values and authorize which fields this particular user may change.",
    intent: {
      testing: "Whether the learner understands permitted shape, mass assignment, nested input, and the authorization boundary.",
      common_mistake: "Saying unpermitted params are silently mass-assigned or believing permit(:admin) is safe for every caller.",
      to_stand_out: "Explain ForbiddenAttributesError, expect, nested arrays, and role-specific permitted fields.",
    },
    quick: [
      "Unpermitted ActionController::Parameters cannot be passed directly to model mass assignment.",
      "params.expect can require a shape and permit its listed fields in current Rails.",
      "require(...).permit(...) remains common in existing Rails applications.",
      "Empty-hash permission and permit! allow broad present and future input and need extreme care.",
      "Strong Parameters filter shape; validations and authorization enforce different rules.",
    ],
    speaking: paragraphs(
      "- Strong Parameters are the Rails controller boundary for mass assignment. Request parameters begin as an unpermitted `ActionController::Parameters` object, and Active Model rejects passing that object directly to `create` or `update`. The controller must explicitly describe the attributes it accepts.",
      "- In current Rails, `params.expect(user: [:name, :email])` both requires the expected user hash shape and permits those fields. Many established applications use `params.require(:user).permit(:name, :email)`, which expresses the same common root-and-field boundary through two calls.",
      "- For example, if a request sends name, email, and admin, a normal profile endpoint should pass only name and email to `current_user.update`. The admin field remains unpermitted even if the User model has that column. Nested arrays and hashes must be described explicitly as well.",
      "- Strong Parameters do not validate that an email is real, convert all values to model types safely, or decide whether the caller is allowed to change a permitted field. An administrator endpoint and a self-service profile endpoint may need different parameter methods even though they update the same model.",
      "- I avoid `permit!`, empty-hash permission, and converting raw parameters with `to_unsafe_h` unless a tightly controlled boundary truly requires arbitrary keys. Explicit shape, model validation, and record-level authorization work together; none replaces the other. I also test that a submitted sensitive key stays unchanged, because that proves the boundary instead of merely inspecting its code."
    ),
    overviewTitle: "Shape, validity, and permission are three checks",
    overview: "Strong Parameters answer which keys and nested structures may enter mass assignment. Model or form validation answers whether their values are acceptable. Authorization answers whether this identity may make this change to this resource. Secure updates need all three.",
    deepTitle: "Trace parameters from HTTP input to model assignment",
    deep: paragraphs(
      "Rails collects query, body, and route data into an `ActionController::Parameters` object. It is intentionally marked unpermitted. Passing a nested unpermitted parameters object to `Model.create` or `record.update` raises `ActiveModel::ForbiddenAttributesError`; modern Rails does not simply assign every submitted column. This fail-closed behaviour is the foundation of Strong Parameters.",
      "`expect` is the concise current API for requiring and permitting an expected shape. `params.expect(user: [:name, :email])` requires `user` to be a suitable nested parameters hash and returns permitted values for the listed fields. The familiar `require(:user).permit(:name, :email)` remains widespread. Missing or malformed required structure is handled as a bad request rather than becoming a mysterious nil later.",
      "Nested data needs an exact declaration. A scalar list uses an empty array marker, while nested objects list their own allowed keys. Permitting an empty hash accepts arbitrary keys and can automatically expose future model attributes, so it is not a shortcut for a schema that the application actually knows. `permit!` and `to_unsafe_h` similarly bypass the boundary and should be rare and reviewed.",
      "The permitted list is endpoint-specific, not model-wide. A self-service update might permit display name and time zone; an administrator action might also permit suspension state after a separate policy check. Putting `:admin` in a shared user_params method would make mass assignment technically allowed even when the current caller has no authority. Strong Parameters cannot infer that business rule.",
      "After filtering, model validations enforce type and domain constraints, database constraints protect persisted invariants, and authorization checks the actor and record. Request specs should submit an unexpected sensitive field and prove it remains unchanged, test missing and wrongly shaped roots, and cover each role's accepted fields. This makes the boundary observable and protects it when columns or nested forms are added later."
    ),
    visualTitle: "Three gates before persistence",
    visual: "HTTP params → expected/permitted shape → authorized fields for this actor → model/database validation → update\n               Strong Parameters              policy                         invariants",
    codeTitle: "Use different permitted shapes for different authority",
    code: fenced("ruby", [
      "class UsersController < ApplicationController",
      "  def update",
      "    current_user.update!(profile_params)",
      "    redirect_to profile_path",
      "  end",
      "",
      "  private",
      "",
      "  def profile_params",
      "    params.expect(user: [:name, :email, :time_zone])",
      "  end",
      "end",
      "",
      "# A separate admin controller may permit :suspended after authorization.",
    ]),
    codeNote: "The self-service endpoint has no mass-assignment path for admin or suspension fields.",
    followups: [
      "What happens when unpermitted Parameters reach update?",
      "How is params.expect different from require(...).permit(...)?",
      "Why are Strong Parameters not an authorization system?",
    ],
  },
  {
    moduleSlug: "ruby-security-basics",
    topicSlug: "xss-basics",
    question: "What is cross-site scripting, and how does Rails reduce XSS risk?",
    title: "Preventing XSS in Rails views",
    direct: "Cross-site scripting occurs when attacker-controlled data is interpreted as active browser markup or script in another user's origin. Rails escapes dynamic ERB output by default and provides allowlist sanitization for intentional rich HTML, but raw, html_safe, unsafe DOM sinks, URL contexts, and third-party scripts still require deliberate controls.",
    intent: {
      testing: "Whether the learner understands contextual output handling rather than treating Rails as automatically XSS-proof.",
      common_mistake: "Using raw or html_safe on user input, or assuming a JSON API removes XSS risk from the frontend.",
      to_stand_out: "Separate stored/reflected sources, HTML escaping, sanitization, safe DOM APIs, and CSP defense in depth.",
    },
    quick: [
      "XSS makes untrusted data execute in a trusted page origin.",
      "Normal <%= ... %> ERB output is HTML-escaped by default.",
      "raw, html_safe, and <%== bypass normal escaping and need trusted or sanitized HTML.",
      "Use allowlist sanitization only when the product intentionally accepts rich HTML.",
      "JSON can carry an attack string; the browser sink determines whether it becomes executable.",
    ],
    speaking: paragraphs(
      "- Cross-site scripting happens when data controlled by an attacker reaches a browser execution context as code or active markup under the application's origin. It may be stored in a comment and shown later, reflected from a request immediately, or created by client-side JavaScript using an unsafe DOM sink.",
      "- Rails ERB escapes ordinary `<%= value %>` output for an HTML context. Characters such as angle brackets become entities, so a submitted script tag is displayed as text instead of becoming an element. This safe default works only while the application keeps the value in an escaped output path.",
      "- For example, a plain-text comment should render with `<%= @comment.body %>`. If the product deliberately permits limited rich text, pass it through Rails' `sanitize` helper with an explicit allowed tag and attribute set rather than calling `raw` on the original input.",
      "- `raw`, `.html_safe`, and `<%==` mark content as safe for insertion and can reopen XSS. A JSON-only Rails endpoint is not automatically safe either: if a React or plain JavaScript client assigns a returned string to `innerHTML`, the vulnerable sink exists in the browser.",
      "- I keep plain data escaped, sanitize only intentional HTML, validate URLs and other non-HTML contexts separately, avoid string-built script, and use Content Security Policy as defense in depth. The durable rule is contextual handling at the output sink, not a one-time belief that input was cleaned."
    ),
    overviewTitle: "An attack needs source, path, and executable sink",
    overview: "Untrusted text may originate in forms, URLs, imported data, or APIs. It becomes XSS only when a rendering path places it into an HTML, attribute, URL, style, or script context without the protection that context requires. Finding the sink makes the fix concrete.",
    deepTitle: "Escaping and sanitization solve different content contracts",
    deep: paragraphs(
      "HTML escaping treats every character sequence as text. When ERB renders `<%= @comment.body %>`, Rails produces an HTML-safe output buffer and escapes unsafe string content for that context. A value containing `<img onerror=...>` appears literally rather than creating an image element. This is the right contract for names, titles, search terms, messages, and any field that is supposed to be plain text.",
      "Sanitization is for a different product requirement: accepting some HTML while removing disallowed elements and attributes. Rails' `sanitize` helper applies an allowlist-based sanitizer. The application should define which formatting it supports, keep the sanitizer dependency updated, and test dangerous URL schemes, malformed markup, event-handler attributes, SVG or MathML cases relevant to the chosen allowlist, and nested encodings.",
      "Marking a string with `html_safe`, passing it to `raw`, or using `<%==` skips ordinary escaping. Those APIs do not inspect whether a string is trustworthy. Concatenating one safe fragment with untrusted data can also produce a dangerous result. Prefer Rails tag and link helpers that escape values, and never make a complete user-controlled string safe merely to preserve formatting.",
      "Context matters beyond HTML text. A URL needs scheme and destination validation, JavaScript data should be serialized rather than interpolated into executable source, and CSS has its own grammar. On the client, `textContent` creates text while `innerHTML` parses markup. Framework escaping works when values remain in normal text bindings; escape hatches and direct DOM manipulation require review.",
      "Content Security Policy can restrict script sources and reduce the impact of some injection, but it is defense in depth rather than permission to use unsafe sinks. HttpOnly cookies can hide cookie values from normal script reads, yet an injected script may still send same-origin requests or alter the page. Tests should render realistic payloads, inspect the resulting DOM, and confirm the payload stays text or is reduced to the explicitly permitted markup."
    ),
    visualTitle: "Follow untrusted data to its rendering context",
    visual: "untrusted source → server/client data flow → output context\n                                      ├─ plain HTML text → escape\n                                      ├─ intentional rich HTML → allowlist sanitize\n                                      ├─ URL → validate scheme/destination\n                                      └─ JavaScript/DOM → serialize + safe API",
    codeTitle: "Escape plain comments and sanitize intentional rich text",
    code: fenced("erb", [
      "<%# Plain text: Rails escapes the value. %>",
      "<p><%= @comment.body %></p>",
      "",
      "<%# Rich text: allow only the product's supported markup. %>",
      "<div class=\"formatted-comment\">",
      "  <%= sanitize(@comment.formatted_body, tags: %w[p strong em a], attributes: %w[href]) %>",
      "</div>",
    ]),
    codeNote: "Neither output path marks the original user value with raw or html_safe.",
    followups: [
      "What is the difference between escaping and sanitizing HTML?",
      "Why can a JSON API still participate in an XSS vulnerability?",
      "What protection does Content Security Policy add?",
    ],
  },
];

const deepAddons = new Map([
  ["authentication-basics/devise-basics", "Test authentication at more than the happy path. Freeze time around recovery expiry, confirm a remembered browser cannot bypass account suspension, and verify each Devise scope independently. These checks expose configuration mistakes that a single successful sign-in system test cannot reveal."],
  ["authentication-basics/sessions-and-cookies", "When debugging, inspect the browser's cookie attributes and size, then confirm the configured Rails session store and key. Do not paste a production cookie into logs or tickets: even an opaque-looking or encrypted value remains an active credential while valid."],
  ["authentication-basics/token-auth-intro", "A threat model should name who issues the token, which service accepts it, how clock skew is handled, and what happens after theft. Those answers determine lifetime, audience, storage, and revocation; choosing JWT first and discovering these requirements later reverses the design process."],
  ["rest-api-basics/api-vs-html-mode", "Choose the application mode from the delivered clients and operational needs, not from the word API in a project name. A service that renders no pages may still need cookies or browser protections, while a full-stack application can expose a small, well-designed JSON namespace."],
  ["rest-api-basics/http-verbs-and-status", "Retries make these semantics practical. A client that loses a response needs to know whether repeating the operation is safe, idempotent, or protected by an idempotency key. Document that behaviour beside the status contract instead of leaving each client to guess."],
  ["rest-api-basics/json-responses", "A contract test can serialize a representative record and compare only public keys, types, and nesting. That catches accidental exposure when a model gains a column and catches silent breaking changes when a serializer renames or removes a field."],
  ["rest-api-basics/request-response-cycle", "A minimal diagnostic starts with the route table, then middleware order, controller logs, query trace, and final response. Checking in that sequence follows the same path as the request and prevents a database investigation when the router never dispatched the action."],
  ["rest-api-basics/restful-routes", "When a command does not fit CRUD cleanly, first ask whether it creates a new resource or changes an existing one's state. A cancellation may be a state update; a long-running export may create an export resource. This often produces clearer retries, statuses, and audit history than an arbitrary verb endpoint."],
  ["ruby-collections-and-io/file-io-basics", "Concurrency adds one more boundary: two writers can still overwrite or interleave data even when both close their handles correctly. Use file locking only with understood platform semantics, or move shared mutable records to storage designed for concurrent transactions."],
  ["ruby-collections-and-io/json-yaml-basics", "Round-trip tests are useful but limited: they prove the chosen values survive one encoder and decoder, not that another language interprets custom extensions identically. Interoperable boundaries should stay within the format's standard data model and publish examples clients can validate."],
  ["ruby-security-basics/sql-injection-basics", "Review query fragments at the point they become executable, not only where input first enters the controller. Data can travel through service objects, background jobs, or stored filters before reaching SQL, so the final query-building boundary must preserve parameterization."],
  ["ruby-security-basics/strong-params", "For APIs, distinguish an unknown field from a known field the caller cannot change. The response policy may reject unknown keys or ignore them for compatibility, but a sensitive attempted update should be observable without echoing secrets. Tests should document that decision consistently across endpoints."],
  ["ruby-security-basics/xss-basics", "Review third-party widgets and Markdown renderers as output paths too. Their configuration may enable raw HTML, permissive links, or script-capable embeds even when the surrounding ERB is escaped. Pin, update, and test the component that performs the final transformation."],
]);

for (const lesson of lessons) {
  const deepAddon = deepAddons.get(`${lesson.moduleSlug}/${lesson.topicSlug}`);
  if (!deepAddon) throw new Error(`Missing Deep Dive add-on for ${lesson.moduleSlug}/${lesson.topicSlug}`);
  writeQuestion(lesson.moduleSlug, lesson.topicSlug, {
    ...lesson,
    deep: paragraphs(lesson.deep, deepAddon),
  });
}

const moduleDocuments = {
  "authentication-basics": {
    config: {
      slug: "authentication-basics",
      title: "Rails Authentication Basics",
      description: "Devise, Rails cookie and session stores, and accurate bearer-token authentication foundations",
      order: 19,
      topics: [
        { slug: "devise-basics", title: "Devise Basics" },
        { slug: "sessions-and-cookies", title: "Sessions and Cookies" },
        { slug: "token-auth-intro", title: "Token Authentication Introduction" },
      ],
    },
    revision: {
      title: "Rails Authentication Basics",
      estimatedMinutes: 12,
      sections: [
        {
          id: "overview",
          title: "What This Module Covers",
          body: "Authentication establishes an identity across requests. This module follows a Devise password sign-in through routes, Warden, the mapped model, and the Rails session; separates plain, signed, and encrypted cookie jars from the session abstraction; and compares opaque bearer tokens with signed JWT access tokens.",
        },
        {
          id: "key-concepts",
          title: "Key Concepts at a Glance",
          body: "Devise supplies modular authentication mechanics but not application authorization. Plain cookies have neither integrity nor confidentiality; signed cookies add integrity, and encrypted cookies add both. CookieStore keeps the protected session payload in the browser, while server-side stores normally keep only an identifier there. Bearer authentication is not inherently stateless: opaque tokens require lookup, and JWT systems often retain refresh, revocation, or account state.",
        },
        {
          id: "interview-focus",
          title: "What Interviewers Test",
          body: "Be ready to distinguish authentication from authorization, trace authenticate_user! and current_user, explain session renewal after sign-in, compare cookie attributes and session stores, and choose an opaque or signed token design from client, expiry, scope, storage, and revocation requirements.",
        },
      ],
    },
  },
  "rest-api-basics": {
    config: {
      slug: "rest-api-basics",
      title: "Rails API Basics",
      description: "Rails API application modes, HTTP contracts, JSON representations, Rack request flow, and resource routes",
      order: 9,
      topics: [
        { slug: "api-vs-html-mode", title: "API Mode vs HTML Mode" },
        { slug: "http-verbs-and-status", title: "HTTP Methods and Status Codes" },
        { slug: "json-responses", title: "JSON Responses" },
        { slug: "request-response-cycle", title: "Request-Response Cycle" },
        { slug: "restful-routes", title: "RESTful Routes" },
      ],
    },
    revision: {
      title: "Rails API Basics",
      estimatedMinutes: 15,
      sections: [
        {
          id: "overview",
          title: "What This Module Covers",
          body: "A Rails API is still an HTTP application. This module compares ActionController::API with the fuller browser stack, maps methods and statuses to truthful outcomes, designs intentional JSON representations, traces a request through Rack middleware and routing, and derives the conventional resource routes.",
        },
        {
          id: "key-concepts",
          title: "Key Concepts at a Glance",
          body: "API-only mode starts with a smaller controller and middleware stack; it does not make every action return JSON automatically. GET is safe, PUT and DELETE are idempotent by definition, POST creation commonly returns 201 with a Location, and 204 has no body. A response contract includes status, headers, and a stable representation. The router matches method plus path before the controller coordinates application work.",
        },
        {
          id: "interview-focus",
          title: "What Interviewers Test",
          body: "Explain 401 versus 403, PUT versus PATCH, 200 versus 201 versus 202 versus 204, collection versus member routes, render versus redirect, and why serialization must select public fields and preloaded relationships rather than dump a model. Use bin/rails routes and request specs to verify the public contract.",
        },
      ],
    },
  },
  "ruby-collections-and-io": {
    config: {
      slug: "ruby-collections-and-io",
      title: "Ruby File I/O & Serialization",
      description: "Safe Ruby file handling plus interoperable JSON and safe YAML parsing",
      order: 20,
      topics: [
        { slug: "file-io-basics", title: "File I/O Basics" },
        { slug: "json-yaml-basics", title: "JSON and YAML Basics" },
      ],
    },
    revision: {
      title: "Ruby File I/O & Serialization",
      estimatedMinutes: 10,
      sections: [
        {
          id: "overview",
          title: "What This Module Covers",
          body: "This focused module covers real data boundaries: reading bounded files, streaming large input, closing handles with block-form File.open, choosing read, truncate, or append modes, and converting intentional data shapes through JSON or YAML.",
        },
        {
          id: "key-concepts",
          title: "Key Concepts at a Glance",
          body: "File.read loads the whole file, while File.foreach streams lines. A File.open block closes its handle even when work raises. JSON.parse returns string object keys by default. YAML supports richer Ruby-oriented constructs, so externally editable text should use YAML.safe_load with only the classes and aliases the schema requires. Successful parsing does not replace size, shape, and domain validation.",
        },
        {
          id: "interview-focus",
          title: "What Interviewers Test",
          body: "Choose whole-file or streaming I/O from input size, explain the effect of r, w, and a modes, handle path and encoding failures, compare JSON with YAML by boundary, and show why safe deserialization plus schema validation are separate checks.",
        },
      ],
    },
  },
  "ruby-security-basics": {
    config: {
      slug: "ruby-security-basics",
      title: "Ruby & Rails Security Basics",
      description: "SQL injection, Strong Parameters, and context-aware XSS prevention in Rails",
      order: 21,
      topics: [
        { slug: "sql-injection-basics", title: "SQL Injection Basics" },
        { slug: "strong-params", title: "Strong Parameters" },
        { slug: "xss-basics", title: "XSS Basics" },
      ],
    },
    revision: {
      title: "Ruby & Rails Security Basics",
      estimatedMinutes: 12,
      sections: [
        {
          id: "overview",
          title: "What This Module Covers",
          body: "Security boundaries fail when external data becomes executable SQL, permitted model input, or active browser content. This module teaches parameterized query values and identifier allowlists, exact mass-assignment shapes with Strong Parameters, and output handling that matches the browser context.",
        },
        {
          id: "key-concepts",
          title: "Key Concepts at a Glance",
          body: "Hash conditions and placeholders bind SQL values; dynamic columns and directions need application-owned allowlists. Unpermitted ActionController::Parameters raise when passed directly to mass assignment, but permitting a field does not authorize a user to change it. ERB escapes normal HTML output; raw and html_safe bypass that protection, while sanitize is for deliberately supported rich HTML.",
        },
        {
          id: "interview-focus",
          title: "What Interviewers Test",
          body: "Trace hostile input to the final interpreter or sink. Explain why validation does not replace SQL binding, why Strong Parameters, authorization, and model constraints are separate gates, and why a JSON API can still feed an unsafe browser DOM sink. Name least privilege and Content Security Policy as defense in depth, not substitutes for the primary control.",
        },
      ],
    },
  },
};

for (const [moduleSlug, documents] of Object.entries(moduleDocuments)) {
  for (const [name, value] of Object.entries(documents)) {
    fs.writeFileSync(path.join(domainRoot, moduleSlug, `_${name}.json`), `${JSON.stringify(value, null, 2)}\n`);
  }
}

const indexPath = path.join(domainRoot, "_index.json");
const index = JSON.parse(fs.readFileSync(indexPath, "utf8"));
const restApi = index.modules.find((module) => module.moduleSlug === "rest-api-basics");
if (!restApi) throw new Error("Canonical M09 rest-api-basics entry is missing.");
Object.assign(restApi, {
  pillar: "P04",
  pillarName: "Rails APIs & Authentication",
  title: "Rails API Basics",
  appUrl: "/ruby-backend-fresher/rest-api-basics",
  altSlugs: [...new Set([...(restApi.altSlugs ?? []), "rails-api-basics"])],
  altUrls: [...new Set([...(restApi.altUrls ?? []), "/rails-api-basics"])],
  topics: [
    "api-vs-html-mode",
    "http-verbs-and-status",
    "json-responses",
    "request-response-cycle",
    "restful-routes",
  ],
  intro: "Rails API interview questions for freshers should connect HTTP contracts to the Rails request stack. This module explains full versus API-only applications, truthful method and status-code choices, stable JSON representations, the complete Rack-to-controller request cycle, and resourceful Rails routes. Each lesson distinguishes framework convenience from protocol responsibility and uses a valid controller or routing example.",
});
delete restApi.contentSource;

const promotedModules = [
  {
    moduleNumber: "M19",
    pillar: "P04",
    pillarName: "Rails APIs & Authentication",
    moduleSlug: "authentication-basics",
    title: "Rails Authentication Basics",
    appUrl: "/ruby-backend-fresher/authentication-basics",
    seoSlug: "rails-authentication-interview-questions-freshers",
    seoUrl: "/rails-authentication-interview-questions-freshers",
    altSlugs: ["devise-interview-questions-beginners", "rails-session-token-auth-basics"],
    altUrls: ["/devise-interview-questions-beginners", "/rails-session-token-auth-basics"],
    topics: ["devise-basics", "sessions-and-cookies", "token-auth-intro"],
    intro: "Rails authentication questions test whether a junior developer can explain identity across requests without confusing the available mechanisms. This module traces Devise through Warden and Rails sessions, separates plain, signed, encrypted, and session cookies, and compares opaque and signed bearer tokens without claiming token authentication is automatically stateless. Security boundaries—authorization, CSRF, token storage, expiry, and revocation—remain explicit in every answer.",
  },
  {
    moduleNumber: "M20",
    pillar: "P01",
    pillarName: "Ruby Language Basics",
    moduleSlug: "ruby-collections-and-io",
    title: "Ruby File I/O & Serialization",
    appUrl: "/ruby-backend-fresher/ruby-collections-and-io",
    seoSlug: "ruby-file-io-json-yaml-interview-questions",
    seoUrl: "/ruby-file-io-json-yaml-interview-questions",
    altSlugs: ["ruby-file-handling-interview-questions"],
    altUrls: ["/ruby-file-handling-interview-questions"],
    topics: ["file-io-basics", "json-yaml-basics"],
    intro: "Ruby I/O and serialization questions test safe resource handling at real system boundaries. This focused module covers whole-file helpers versus streaming, File.open block cleanup, access modes and atomic replacement, plus interoperable JSON and safe YAML parsing. Array, Hash, and Enumerable material remains in the canonical language and iterator modules instead of being duplicated here.",
  },
  {
    moduleNumber: "M21",
    pillar: "P04",
    pillarName: "Rails APIs & Authentication",
    moduleSlug: "ruby-security-basics",
    title: "Ruby & Rails Security Basics",
    appUrl: "/ruby-backend-fresher/ruby-security-basics",
    seoSlug: "rails-security-interview-questions-freshers",
    seoUrl: "/rails-security-interview-questions-freshers",
    altSlugs: ["ruby-security-interview-questions-beginners"],
    altUrls: ["/ruby-security-interview-questions-beginners"],
    topics: ["sql-injection-basics", "strong-params", "xss-basics"],
    intro: "Rails security basics should teach where data crosses into a trusted interpreter or model boundary. This module covers SQL value binding and dynamic-identifier allowlists, Strong Parameters as mass-assignment shape filtering rather than authorization, and context-aware XSS prevention through escaping, sanitization, safe browser sinks, and defense in depth. Each lesson corrects a common oversimplification and includes a concrete Rails example.",
  },
];

for (const promoted of promotedModules) {
  const existing = index.modules.find((module) => module.moduleSlug === promoted.moduleSlug);
  if (existing) Object.assign(existing, promoted);
  else index.modules.push(promoted);
}

index.totalModules = index.modules.length;
fs.writeFileSync(indexPath, `${JSON.stringify(index, null, 2)}\n`);

console.log(`Curated ${lessons.length} retained Ruby authentication/API/I-O/security questions; promoted 3 modules and consolidated Rails API into M09.`);
