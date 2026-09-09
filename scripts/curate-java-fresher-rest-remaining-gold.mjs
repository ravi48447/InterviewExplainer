#!/usr/bin/env node

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const moduleRoot = path.join(
  repoRoot,
  "content/java-backend-fresher/rest-api-basics",
);
const requestedSlug = process.argv[2] ?? null;

const joinParagraphs = (paragraphs) => paragraphs.join("\n\n");
const joinLines = (lines) => lines.join("\n");
const fenced = (language, lines) => `\`\`\`${language}\n${joinLines(lines)}\n\`\`\``;

const topics = {
  "api-design-basics": {
    "rest-uri-design-principles": {
      id: "api-design-basics-001",
      question: "What are the principles of good REST API URI design?",
      direct: "Good REST URI design gives resources stable, readable identifiers and lets HTTP methods express the operation. Use nouns for collections and individual resources, model genuine relationships with shallow nesting, keep naming consistent, and treat the URI as an identifier rather than a database or controller implementation detail.",
      minutes: 9,
      quick: [
        "Use resource nouns such as `/orders` and `/orders/42`; let the HTTP method describe the action.",
        "Use plural collection names and one consistent casing convention across the API.",
        "Nest only when the parent relationship is important, for example `/orders/42/items`.",
        "Put filtering, sorting, and pagination controls in the query string, not in new resource names.",
        "Keep identifiers stable; do not expose table names, controller methods, or file extensions.",
      ],
      interview: [
        "A URI is the address of a resource. The path should name the thing, such as `/orders` or `/orders/42`, while the HTTP method says what to do. That is why `GET /orders/42` is clearer than `/getOrder/42` and `DELETE /orders/42` does not need the word delete in the path.",
        "Collections and individual resources should follow one predictable pattern. `GET /orders` reads the collection, `POST /orders` adds a new order, and `GET /orders/42` reads one order. Plural nouns, lowercase paths, and consistent separators are conventions rather than REST rules, but they make an API much easier to learn.",
        "Nesting is useful when the parent gives real meaning. `/orders/42/items` clearly means the items in order 42. If item 9 can be used on its own, `/items/9` is the better direct address. Filters, sorting, and pagination normally belong in the query string, for example `/orders?status=paid&sort=-createdAt`.",
        "Public URIs should stay stable when controller names or database tables change. Avoid paths such as `/tbl_orders`, Java method names, and file extensions that expose implementation details. Good URI design starts with a clear resource model, then documents the methods, responses, and errors supported at each address.",
      ],
      deepTitle: "Build the resource model before writing controller paths",
      deep: [
        "A route becomes simple when the underlying resource model is clear. Begin with the things that have identity: customers, orders, products, and payments. A collection URI identifies a set, while a member URI identifies one resource within that set. The same URI can support different method semantics; the path does not need a verb for each operation.",
        "Containment and association are different. `/orders/42/items` is useful when the client is asking for the item collection in the context of one order. An item that can be addressed, updated, or referenced independently should also have a stable member URI. Deep nesting makes authorization rules, route changes, and client code harder without adding meaning.",
        "The query component changes how a resource is selected or represented. Filters such as `status=paid`, sorting such as `sort=-createdAt`, field selection, and pagination are common query controls. They should have documented defaults and allowed values. A query URI is still a resource identifier and can be linked or cached according to normal HTTP rules.",
        "There is no REST specification that requires plural nouns or lowercase paths. Those are design conventions. The architectural requirement is a uniform interface in which resources are identified and messages are self-descriptive. Consistency matters because clients learn a vocabulary; blindly following a naming rule cannot repair a confused resource model.",
      ],
      visual: {
        type: "concept_map",
        title: "One resource model, predictable routes",
        content: fenced("mermaid", [
          "flowchart LR",
          "  C[Order collection<br/>/orders] -->|member 42| O[Order<br/>/orders/42]",
          "  O -->|owned collection| I[Order items<br/>/orders/42/items]",
          "  I -->|independent member| M[Item<br/>/items/9]",
          "  C -->|filter + sort| Q[/orders?status=paid&sort=-createdAt]",
        ]),
      },
      example: {
        title: "Read the contract from method, path, and query",
        language: "http",
        lines: [
          "GET /orders?status=paid&limit=20 HTTP/1.1",
          "Host: api.example.com",
          "Accept: application/json",
          "",
          "POST /orders/42/items HTTP/1.1",
          "Host: api.example.com",
          "Content-Type: application/json",
          "",
          "{\"productId\": \"P-9\", \"quantity\": 2}",
        ],
        note: "The first request selects a filtered collection representation. The second submits a new member to the item collection owned by order 42; neither route repeats the action as a path verb.",
      },
      followups: [
        "When is nested URI design useful, and when is it too deep?",
        "Should filtering and sorting appear in the path or query string?",
        "Why should a public URI not expose database table names?",
      ],
    },
    "rest-api-versioning-strategies": {
      id: "api-design-basics-002",
      question: "How do you version a REST API and what are the tradeoffs?",
      direct: "API versioning is a compatibility policy for changes that existing clients cannot safely consume. Common signals are a path segment, a request header, or a versioned media type. The important work is defining what counts as breaking, supporting overlapping versions, publishing migration guidance, and retiring versions deliberately.",
      minutes: 10,
      quick: [
        "Prefer backward-compatible evolution; introduce a version only for a genuinely breaking contract change.",
        "A path such as `/v2/orders` is visible and easy to route, but version identity spreads into every URI.",
        "A custom header or media-type parameter keeps resource URIs stable, but is less obvious in links and browser testing.",
        "Run old and new contracts in parallel long enough for clients to migrate, with clear deprecation dates.",
        "Version the public representation and behavior, not every internal code or database change.",
      ],
      interview: [
        "API versioning protects existing clients when a public contract must change in a breaking way. Adding an optional field is usually safe, but renaming a field, changing its meaning, removing a supported value, or changing important status behavior can require a new version. A version should not be created for every internal code change.",
        "The simplest visible style is a path such as `/v1/orders/42`. It is easy to route, log, document, and test, but the version becomes part of every URI. A header or versioned media type can keep `/orders/42` unchanged, although the selected version is less obvious and caches must separate the response variants correctly.",
        "Suppose version 1 returns `fullName` and version 2 replaces it with `givenName` and `familyName`. Both versions can run for a migration period while clients receive examples, a change guide, and a retirement date. Traffic measurements help find clients that still use the old contract.",
        "The strategy matters less than using it consistently and managing the full lifecycle. Keep compatible changes in the current version, test every supported contract, give clients enough time to move, and remove an old version only after its published support period ends.",
      ],
      deepTitle: "API versions track breaking public changes, not deployments",
      deep: [
        "A deployed service can change many times without changing its public version. Bug fixes, indexes, caching, and internal refactoring are implementation changes. A public version changes when the observable contract cannot remain compatible: accepted inputs, response meaning, status codes, authentication expectations, or important timing and ordering guarantees.",
        "Path versioning creates distinct URI spaces and is easy for infrastructure to route. Header and media-type approaches negotiate a representation at a stable URI. When a response varies on request headers, cache behavior must account for that selection; a server can use `Vary` to name the request fields that influenced the representation.",
        "Supporting two versions does not require duplicating the whole application. A shared domain service can sit behind separate request/response adapters. That keeps version-specific translation at the boundary while business rules remain common. Contract tests should prove the old adapter continues to behave as published.",
        "Retirement is part of design. Documentation should state supported versions, migration differences, and a date or policy for removal. Traffic metrics reveal active consumers, but silent traffic does not replace direct communication for important clients. Long-lived versions cost engineering effort, so a team should balance migration safety against indefinite maintenance.",
      ],
      visual: {
        type: "comparison_table",
        title: "Where a client declares the requested version",
        content: joinLines([
          "| Strategy | Example | Strength | Cost |",
          "|---|---|---|---|",
          "| URI path | `/v2/orders/42` | Visible and easy to route | Versions every URI |",
          "| Custom header | `X-API-Version: 2` | Stable resource path | Less visible and non-standard |",
          "| Media type | `Accept: application/vnd.example.order+json;v=2` | Ties version to representation | More complex tooling and caching |",
        ]),
      },
      example: {
        title: "Negotiate a versioned representation",
        language: "http",
        lines: [
          "GET /orders/42 HTTP/1.1",
          "Host: api.example.com",
          "Accept: application/vnd.example.order+json;v=2",
          "",
          "HTTP/1.1 200 OK",
          "Content-Type: application/vnd.example.order+json;v=2",
          "Vary: Accept",
          "",
          "{\"id\": 42, \"givenName\": \"Ada\", \"familyName\": \"Lovelace\"}",
        ],
        note: "`Vary: Accept` tells a cache that the selected response can differ by the request's `Accept` field. It does not by itself define the team's compatibility or retirement policy.",
      },
      followups: [
        "Which API changes normally require a new version?",
        "What trade-off does header versioning create for caches and tooling?",
        "How can two API versions share the same business logic?",
      ],
    },
    "rest-api-pagination-design": {
      id: "api-design-basics-003",
      question: "How do you design REST API pagination?",
      direct: "Pagination divides a large collection into bounded responses and supplies enough navigation state to continue. Offset pagination is simple and supports page jumps; cursor pagination is more stable for frequently changing ordered data. Either design needs deterministic ordering, limits, navigation links or cursors, and a documented consistency policy.",
      minutes: 10,
      quick: [
        "Always define a stable order with a unique tie-breaker before paginating.",
        "Offset pagination is simple and jump-friendly, but inserts and deletes can shift later pages.",
        "Cursor pagination continues after an ordered position and is usually steadier for changing feeds.",
        "Cap page size, validate cursor ownership and filters, and avoid exposing raw database state unnecessarily.",
        "Return navigation information such as `next` links or an opaque next cursor; totals are optional and may be expensive.",
      ],
      interview: [
        "Pagination breaks a large collection into smaller responses. Before choosing page numbers or cursors, the API needs a stable order. Sorting only by `created_at` is not enough when records can share a timestamp, so a unique tie-breaker such as `id` should be added.",
        "Offset pagination uses values such as `?offset=40&limit=20` or `?page=3`. It is easy to understand and allows page jumps, which suits small or fairly stable lists. On a large or frequently changing collection, later offsets can become slow and inserts or deletes can make a client see a duplicate or miss a row.",
        "Cursor pagination continues after the last ordered value returned. A cursor can represent a position such as `(createdAt, id)`, so the database can continue from that point even while newer rows arrive. It works well for feeds, but it does not naturally jump to page 37 and the cursor must stay tied to the same filters and sort order.",
        "A response should provide the items, the applied limit, and either a next link or an opaque next cursor. Page size needs a safe maximum. Total counts are optional because they may be expensive and can change during paging. Offset is often enough for an admin table; cursor pagination is usually better for a high-write feed.",
      ],
      deepTitle: "A page is a window over an ordered collection",
      deep: [
        "Without deterministic ordering, page boundaries have no reliable meaning. A database is free to return equal-ranked rows in different orders. A unique final sort key creates a total order and lets the next request resume from an exact position.",
        "Offset expresses distance from the beginning. If a new row is inserted before that distance after page one is read, a row from page one can appear again on page two. If a row is removed, another row can be skipped. A transaction-level snapshot can avoid movement but is rarely kept across independent web requests.",
        "A cursor expresses position rather than distance. It can encode the last sort values, direction, relevant filters, and an expiry marker, then be signed or otherwise protected against tampering. Opaque does not mean secret; sensitive database values should not be placed in an easily decoded token.",
        "Pagination metadata should help the client continue without rebuilding server rules. A next link is especially useful because it packages the route and controls. Exact totals, last-page numbers, and random jumps are product choices rather than mandatory REST fields, and they can conflict with efficient cursor designs.",
      ],
      visual: {
        type: "comparison_table",
        title: "Offset and cursor page boundaries",
        content: joinLines([
          "| Concern | Offset | Cursor |",
          "|---|---|---|",
          "| Client sends | Distance + limit | Last ordered position + limit |",
          "| Page jump | Natural | Usually unavailable |",
          "| Changing data | Boundaries may shift | Continues from a known position |",
          "| Large scan | Can become costly | Can use an ordered index seek |",
          "| Required contract | Stable ordering | Stable ordering plus cursor format/lifetime |",
        ]),
      },
      example: {
        title: "Return an opaque continuation token",
        language: "http",
        lines: [
          "GET /orders?status=paid&limit=2&after=eyJjcmVhdGVkQXQiOiIyMDI2LTA5LTA3VDEwOjAwOjAwWiIsImlkIjo0Mn0 HTTP/1.1",
          "Host: api.example.com",
          "Accept: application/json",
          "",
          "HTTP/1.1 200 OK",
          "Content-Type: application/json",
          "",
          "{\"items\":[{\"id\":41},{\"id\":39}],\"limit\":2,\"nextCursor\":\"bmV4dC1zaWduZWQtY3Vyc29y\"}",
        ],
        note: "The server must decode and validate the cursor against the same filter and ordering. The example token is illustrative; production cursors should be integrity-protected when tampering matters.",
      },
      followups: [
        "Why does pagination need a unique tie-breaker in its sort order?",
        "How can inserts cause duplicates with offset pagination?",
        "What information should an opaque cursor bind to?",
      ],
    },
    "api-error-response-design": {
      id: "api-design-basics-005",
      question: "How do you design API error responses for good developer experience?",
      direct: "A useful API error combines the correct HTTP status with a stable machine-readable problem type, a short human title, request-specific detail, and a traceable instance or correlation identifier. Validation details may extend that shape, while logs keep sensitive diagnostics and stack traces away from clients.",
      minutes: 10,
      quick: [
        "Choose the HTTP status from the protocol outcome; do not return `200 OK` for a failed request.",
        "Use one documented problem shape, such as RFC 9457 `application/problem+json`.",
        "Give clients a stable problem `type` or application code; human wording can change or be localized.",
        "Include actionable field errors for validation, but never expose stack traces, SQL, secrets, or internal topology.",
        "Attach a request or correlation identifier so support can connect the response to server logs.",
      ],
      interview: [
        "An API error should tell the client what kind of failure happened and what it can do next. Start with the correct HTTP status: `400` for malformed input, `404` when the target cannot be found, `409` for a state conflict, or `412` when a required precondition fails.",
        "Use one response shape throughout the API. RFC 9457 Problem Details provides fields such as `type`, `title`, `status`, `detail`, and `instance`. The stable problem type or application code is for program logic; the detail is a human-readable explanation of this particular failure.",
        "For example, an invalid order can return `422 Unprocessable Content` with a problem type such as `/problems/invalid-order` and an `errors` list containing the field `quantity` and code `positive`. A form can highlight that field without trying to understand an English sentence.",
        "Keep stack traces, SQL messages, secrets, and internal host names in protected server logs. Add a request or correlation ID so support can find those logs safely. Central error handling and contract tests help every controller return the same public format without leaking implementation details.",
      ],
      deepTitle: "Error responses are part of the public API",
      deep: [
        "The HTTP status describes the broad outcome and remains useful to generic clients and gateways. The body adds application meaning. A unique application code without a meaningful status loses protocol semantics; a status without a stable problem identity often forces clients to inspect prose.",
        "RFC 9457 does not prescribe every business error. It supplies a reusable container. A problem `type` URI should identify documentation or at least be a stable identifier. `title` is a short summary for that type, `detail` is specific to the occurrence, and `instance` identifies the occurrence rather than the error class. Extension fields should have documented types and meaning.",
        "Validation errors are naturally a collection because several fields can fail at once. Field paths, stable rule codes, and safe messages help forms show useful feedback. Avoid assuming that every domain failure is input validation: a syntactically valid request can conflict with current state or fail an authorization rule.",
        "Central handling in Spring can use `ProblemDetail`, `ErrorResponse`, and `@ControllerAdvice`. The handler maps known exceptions intentionally and uses a conservative fallback for unknown failures. Server logs can store the exception and correlation ID; the public response stays stable even when the implementation changes.",
      ],
      visual: {
        type: "concept_map",
        title: "Each error field has one job",
        content: fenced("mermaid", [
          "flowchart LR",
          "  E[Failed request] --> S[HTTP status<br/>broad protocol outcome]",
          "  E --> T[Problem type/code<br/>stable machine decision]",
          "  E --> D[Detail + field errors<br/>safe corrective context]",
          "  E --> I[Instance/correlation ID<br/>trace one occurrence]",
          "  E -. protected only .-> L[Logs<br/>exception + internals]",
        ]),
      },
      example: {
        title: "A validation problem clients can process",
        language: "http",
        lines: [
          "HTTP/1.1 422 Unprocessable Content",
          "Content-Type: application/problem+json",
          "",
          "{",
          "  \"type\": \"https://api.example.com/problems/invalid-order\",",
          "  \"title\": \"Order validation failed\",",
          "  \"status\": 422,",
          "  \"detail\": \"One field needs attention.\",",
          "  \"instance\": \"/orders/attempts/01J7\",",
          "  \"errors\": [{\"field\": \"quantity\", \"code\": \"positive\"}],",
          "  \"correlationId\": \"req-83f9\"",
          "}",
        ],
        note: "The extension members are application-defined. Clients can use the problem type and field code while the human detail remains free to improve or be localized.",
      },
      followups: [
        "What is the difference between a problem `type` and an occurrence `instance`?",
        "Why should clients avoid parsing an error's human-readable detail?",
        "Which diagnostic information should stay only in server logs?",
      ],
    },
  },
  idempotency: {
    "idempotency-in-rest-apis": {
      id: "idempotency-001",
      question: "What is idempotency in REST APIs and why does it matter?",
      direct: "Idempotency means that making the same request more than once has the same intended effect on server state as making it once. It matters when a response is lost or a client retries: a correctly designed idempotent operation avoids repeating the business change even though status codes, headers, or logs may differ.",
      minutes: 9,
      quick: [
        "Idempotency compares the intended server effect after one identical request with the effect after several.",
        "It does not require every response body, status, timestamp, or log entry to be identical.",
        "HTTP defines safe methods, plus `PUT` and `DELETE`, as idempotent by method semantics.",
        "`POST` and `PATCH` have no general idempotency guarantee, though a particular operation can add one.",
        "Idempotency makes ambiguous network retries safer; it does not replace authentication or concurrency control.",
      ],
      interview: [
        "Idempotency means that repeating the same request has the same intended effect on server state as making it once. The responses do not have to be identical. A second response can have a new date or request ID, and a repeated delete may return a different status while the resource still remains deleted.",
        "HTTP defines safe methods, `PUT`, and `DELETE` as idempotent. Sending the same `PUT /profiles/42` representation again should leave the same profile state. `POST` and `PATCH` have no general guarantee: setting a status can be repeatable, but adding ten points changes the result every time.",
        "Imagine that a payment succeeds but the response is lost. The client cannot tell whether it is safe to send the POST again. An idempotency key gives that payment attempt one stable identity, so the server can return the saved result instead of creating a second charge.",
        "A real implementation needs atomic key storage, a fingerprint of the request, and rules for in-progress, failed, conflicting, and expired entries. Idempotency protects retries of one logical operation. It does not replace authentication, transactions, or optimistic locking for competing updates.",
      ],
      deepTitle: "A lost response creates an ambiguous outcome",
      deep: [
        "A timeout cannot tell a client whether the request failed before reaching the server or succeeded and only the response was lost. Retrying is the only practical recovery in many distributed systems. Idempotent semantics make that retry safe with respect to the operation's intended effect.",
        "Method-level idempotency is a protocol promise. A server that implements `PUT /counter` as “add one” violates PUT semantics even if its controller is named correctly. Application-level idempotency can strengthen a POST endpoint by assigning one identity to one business operation. The server must bind that identity to the caller and request content, not merely remember a header string globally.",
        "Incidental side effects do not automatically break idempotency. Each request can produce a new access log, metric, or response date. What must not repeat is the effect the client requested. This distinction also explains why a repeated DELETE may return a different response: absence remains the requested final state.",
        "Idempotency does not solve every race. Two different requests can update the same old resource version, and one can overwrite the other. Validators or optimistic locking handle that version conflict. Authentication identifies the caller. Transactions protect atomic state changes. These mechanisms work together, but each answers a different question.",
      ],
      visual: {
        type: "sequence_diagram",
        title: "Retry after the first response disappears",
        content: fenced("mermaid", [
          "sequenceDiagram",
          "  participant C as Client",
          "  participant A as API",
          "  participant D as Durable store",
          "  C->>A: operation K with request R",
          "  A->>D: apply effect once and store outcome for K",
          "  A--xC: response lost",
          "  C->>A: retry K with the same R",
          "  A->>D: find completed K",
          "  A-->>C: return stored outcome; do not repeat effect",
        ]),
      },
      example: {
        title: "The same DELETE can produce different responses",
        language: "http",
        lines: [
          "DELETE /subscriptions/42 HTTP/1.1",
          "Host: api.example.com",
          "",
          "HTTP/1.1 204 No Content",
          "",
          "DELETE /subscriptions/42 HTTP/1.1",
          "Host: api.example.com",
          "",
          "HTTP/1.1 404 Not Found",
        ],
        note: "The wire responses differ, but after either sequence subscription 42 is not available at that target URI. Idempotency is about the intended effect, not response equality.",
      },
      followups: [
        "Can an idempotent request return a different status on a retry?",
        "Why is a PATCH operation sometimes idempotent even though PATCH is not guaranteed to be?",
        "What problem does optimistic locking solve that idempotency does not?",
      ],
    },
    "idempotency-vs-safety": {
      id: "idempotency-003",
      question: "What is the difference between idempotency and safety in HTTP?",
      direct: "Safety asks whether the client requested a state change; idempotency asks whether repeating the same request changes the intended effect after the first application. `GET` is both safe and idempotent, while `PUT` and `DELETE` are idempotent but unsafe because they intentionally change server state.",
      minutes: 8,
      quick: [
        "A safe method has essentially read-only intended semantics for the target resource.",
        "An idempotent method may change state, but repeats have the same intended effect as one request.",
        "`GET`, `HEAD`, `OPTIONS`, and `TRACE` are safe and therefore idempotent.",
        "`PUT` and `DELETE` are idempotent but not safe; `POST` and `PATCH` have neither general guarantee.",
        "Logging and metrics can occur during a safe request because they are not the state change the client requested.",
      ],
      interview: [
        "Safety asks whether the client requested a state change. Idempotency asks whether repeating the same request changes the intended result after the first successful application. A method can be idempotent without being safe.",
        "`GET`, `HEAD`, `OPTIONS`, and `TRACE` are safe and therefore idempotent. A GET may still create an access log or fill a cache, because those are side effects of handling the request rather than the business change the client asked for. `PUT` and `DELETE` are idempotent but unsafe because they deliberately change state.",
        "For example, `DELETE /files/42` removes a file association. Repeating it keeps the file absent, so the request is idempotent, but it is not safe. By contrast, `POST /transfers` may create another transfer on every retry unless that endpoint adds its own idempotency-key rule.",
        "The distinction protects real systems. Browsers, crawlers, and prefetchers may issue safe requests automatically, so destructive work must not hide behind GET. Retry tools can treat an idempotent request more confidently after a connection failure, while still following the documented rules of that endpoint.",
      ],
      deepTitle: "Safety and idempotency ask different questions",
      deep: [
        "First ask, “Did the client request an application-state change?” If no, the semantics are safe. The server can still perform maintenance work that the client neither selected nor controls. A route such as `GET /orders/42?cancel=true` is unsafe in behavior and violates GET's shared meaning, regardless of its name.",
        "Then ask, “After the first successful application, does an identical request ask for another intended change?” Replacing a resource with the same representation does not; appending another event does. An idempotent request can be expensive, fail authorization on a later attempt, or return different metadata. None of those differences alone disproves idempotency.",
        "The classification belongs to standardized method semantics, but an implementation must honor it. An unsafe action behind GET is dangerous because browsers, caches, previews, and crawlers may issue GET automatically. Non-idempotent work retried blindly is dangerous because a client cannot distinguish a lost response from lost work.",
        "Endpoint guarantees can be stronger than the method's minimum. A POST can use a stable operation key, and a particular PATCH can only set a value. Documentation must state those extra guarantees precisely rather than claiming every POST or PATCH behaves that way.",
      ],
      visual: {
        type: "comparison_table",
        title: "Safety and idempotency are separate axes",
        content: joinLines([
          "| Method group | Safe? | Idempotent by standard semantics? | Client intent |",
          "|---|---:|---:|---|",
          "| `GET`, `HEAD`, `OPTIONS`, `TRACE` | Yes | Yes | Observe or inspect |",
          "| `PUT`, `DELETE` | No | Yes | Change state to a repeatable outcome |",
          "| `POST`, `PATCH` | No | No general guarantee | Process content or apply changes |",
        ]),
      },
      example: {
        title: "A destructive GET breaks the safety contract",
        language: "http",
        lines: [
          "GET /orders/42?cancel=true HTTP/1.1",
          "Host: api.example.com",
          "",
          "POST /orders/42/cancellation HTTP/1.1",
          "Host: api.example.com",
          "Content-Type: application/json",
          "Idempotency-Key: cancel-order-42-v1",
          "",
          "{\"reason\": \"customer_request\"}",
        ],
        note: "The POST remains unsafe because it requests cancellation. The application key can give that particular operation retry protection; it does not make POST safe.",
      },
      followups: [
        "Why is DELETE idempotent but not safe?",
        "Can a safe request write to an access log?",
        "Why is a destructive action behind GET risky?",
      ],
    },
    "post-idempotency-in-spring-boot": {
      id: "idempotency-002",
      question: "How do you implement idempotency for POST requests in Spring Boot?",
      direct: "A Spring Boot POST can be made retry-safe by accepting an idempotency key, atomically reserving it with the authenticated caller and a request fingerprint, executing the business transaction once, and storing the final status, headers, and response. Retries replay that outcome; mismatched requests and in-progress keys follow explicit rules.",
      minutes: 11,
      quick: [
        "Treat the idempotency key as the identity of one logical operation, scoped to the caller or account.",
        "Store a canonical request fingerprint so the same key cannot silently mean different input.",
        "Reserve the key atomically with a unique database constraint before executing the side effect.",
        "Persist processing state and the replayable result; define behavior for in-progress, failed, and expired entries.",
        "Use a durable shared store and transaction design; an in-memory map fails across restarts and instances.",
      ],
      interview: [
        "A retry-safe POST starts with an idempotency key sent by the client. The key represents one logical operation and should be scoped to the authenticated account or tenant. The service also stores a fingerprint of the important request fields, so the same key cannot be reused for different work.",
        "Before creating the resource, the service reserves `(account, key)` in one atomic database operation. A unique constraint or equivalent lock makes only one request the owner. The record can move through states such as `PROCESSING` and `COMPLETED` and finally store the status, selected headers, and response data needed for a replay.",
        "Suppose two `POST /orders` requests arrive together with key `K7`. One reservation succeeds and creates order 42. The other request sees the existing entry. If it is complete, the API returns the saved order; if it is still running, the API follows its documented wait-or-retry response. A different fingerprint is rejected as key misuse.",
        "Spring MVC can read the header, but the guarantee belongs in a transactional service and durable shared repository. An in-memory map fails across restarts and multiple instances. The design also needs expiry, crash recovery, and a clear rule for which failures are stored or retried, especially when an external service is involved.",
      ],
      deepTitle: "The key must be reserved before the work starts",
      deep: [
        "A naïve implementation performs “find key, then create order, then save key.” Two threads can both observe no key before either saves, causing duplicate work. The reservation must be atomic. A unique index on the scoped key, an insert with conflict handling, or a database lock makes exactly one request the owner.",
        "The request fingerprint prevents accidental key reuse. It should cover the normalized fields that define the operation, not unstable transport details such as header order. Store only a hash if retaining the full request would expose sensitive data. Constant-time comparison is useful when a fingerprint becomes security-sensitive, although its main role here is integrity.",
        "Crash behavior must be designed. If business data commits but the replay record does not, a retry may duplicate the effect. Keeping both in one local transaction works when they share a database. Across external payment providers, use their operation key, an outbox, or a reconciled state machine; a single annotation cannot create a distributed transaction.",
        "A completed entry can replay the original outcome. An in-progress entry may return `409`, `425`, or another documented response, or briefly wait. Failures need a rule: deterministic validation failures can often be replayed, while transient failures might release or retain the key. Expiry must be longer than the promised retry window.",
      ],
      visual: {
        type: "flow_diagram",
        title: "One atomic gate before the side effect",
        content: fenced("mermaid", [
          "flowchart TD",
          "  R[POST + caller + key + request] --> F[Create canonical fingerprint]",
          "  F --> A{Atomically reserve scoped key}",
          "  A -->|new owner| B[Run business transaction once]",
          "  B --> C[Store completed replay result]",
          "  A -->|same fingerprint, complete| P[Replay saved result]",
          "  A -->|same fingerprint, processing| W[Apply documented in-progress policy]",
          "  A -->|different fingerprint| X[Reject key reuse]",
        ]),
      },
      example: {
        title: "Keep the guarantee in a transactional service",
        language: "java",
        lines: [
          "import org.springframework.stereotype.Service;",
          "import org.springframework.transaction.annotation.Transactional;",
          "",
          "@Service",
          "final class OrderCommandService {",
          "    private final IdempotencyRepository keys;",
          "    private final OrderRepository orders;",
          "    private final RequestFingerprinter fingerprints;",
          "",
          "    OrderCommandService(IdempotencyRepository keys, OrderRepository orders,",
          "            RequestFingerprinter fingerprints) {",
          "        this.keys = keys;",
          "        this.orders = orders;",
          "        this.fingerprints = fingerprints;",
          "    }",
          "",
          "    @Transactional",
          "    OrderReply create(String accountId, String key, CreateOrder request) {",
          "        String fingerprint = fingerprints.sha256(request);",
          "        Reservation r = keys.reserve(accountId, key, fingerprint); // unique constraint",
          "        if (r.fingerprintMismatch()) throw new KeyReuseConflict();",
          "        if (r.completed()) return r.savedReply();",
          "        if (!r.ownedByThisCall()) throw new OperationInProgress();",
          "",
          "        OrderReply reply = orders.create(request);",
          "        keys.complete(accountId, key, fingerprint, reply);",
          "        return reply;",
          "    }",
          "}",
          "",
          "interface IdempotencyRepository {",
          "    Reservation reserve(String accountId, String key, String fingerprint);",
          "    void complete(String accountId, String key, String fingerprint, OrderReply reply);",
          "}",
          "interface OrderRepository { OrderReply create(CreateOrder request); }",
          "interface RequestFingerprinter { String sha256(CreateOrder request); }",
          "record CreateOrder(String productId, int quantity) {}",
          "record OrderReply(long id) {}",
          "record Reservation(boolean fingerprintMismatch, boolean completed,",
          "        boolean ownedByThisCall, OrderReply savedReply) {}",
          "final class KeyReuseConflict extends RuntimeException {}",
          "final class OperationInProgress extends RuntimeException {}",
        ],
        note: "`reserve` must be implemented with a database-level atomic operation; a check followed by an ordinary insert is still racy. Real code must also define rollback and recovery when external systems participate.",
      },
      followups: [
        "Why must idempotency-key reservation be atomic?",
        "What should happen when the same key arrives with different request content?",
        "How do external side effects change the transaction design?",
      ],
    },
    "optimistic-locking-and-idempotency": {
      id: "idempotency-004",
      question: "How does optimistic locking relate to idempotency in Spring Boot?",
      direct: "Optimistic locking and idempotency solve related but different retry problems. A JPA `@Version` field or HTTP `If-Match` validator rejects an update based on stale state, preventing lost updates. Idempotency prevents the same logical operation from executing twice. Robust APIs often use both: one operation key and one expected resource version.",
      minutes: 10,
      quick: [
        "Optimistic locking detects that another writer changed a resource after it was read.",
        "JPA uses a `@Version` value in the update check and fails when no row matches the old version.",
        "HTTP can expose a representation validator as an ETag and require it through `If-Match`.",
        "A failed `If-Match` produces `412 Precondition Failed`; a framework locking exception needs deliberate API mapping.",
        "Version checks prevent lost updates, while idempotency keys prevent duplicate logical operations.",
      ],
      interview: [
        "Optimistic locking stops one update from silently overwriting a newer update. A JPA entity has a `@Version` field, and the generated SQL checks the version that was originally read. If another transaction has already changed the row, the check fails and the application can report a conflict.",
        "The HTTP form of the same idea uses validators. A client reads an order with `ETag: \"order-v7\"` and sends `If-Match: \"order-v7\"` with its update. If the order is now version 8, the server returns `412 Precondition Failed` instead of replacing the newer state.",
        "Idempotency solves a different problem. An idempotency key asks whether this logical command has already run, while a version check asks whether the resource is still the version the client edited. An order confirmation can use key `confirm-42-K` to stop duplicate execution and version 7 to stop a stale confirmation after the order changed.",
        "After an optimistic-lock failure, the normal response is to read fresh state and decide again; blindly repeating the old update can repeat the same conflict. Optimistic locking protects concurrent changes, but it does not make a non-idempotent operation safe to retry by itself.",
      ],
      deepTitle: "Operation identity and resource version solve different problems",
      deep: [
        "Imagine two editors read customer version 4. Both submit different addresses. Without a condition, the later write can silently erase the earlier one. Optimistic locking places version 4 in the update predicate. One transaction advances to version 5; the other finds that version 4 no longer exists and fails instead of losing data.",
        "JPA's `@Version` is a persistence mechanism. An ETag is an HTTP validator for a representation. They can be related, but they are not automatically interchangeable: an ETag might hash several fields, and exposing a database counter can couple the API to storage. The server must define how the public validator is generated and checked.",
        "Idempotency storage tracks a logical command and its result. The same command may touch several resources or an external system, so one entity version cannot identify it. Conversely, two different legitimate commands need different idempotency keys even if both start from the same resource version.",
        "When an `If-Match` precondition is false, HTTP defines `412 Precondition Failed`. A JPA exception discovered without an HTTP precondition is often exposed as a conflict response, but the API should choose and document the mapping rather than claiming the framework mandates one status. Both failure paths should return enough safe information for the client to refetch and decide.",
      ],
      visual: {
        type: "comparison_table",
        title: "Two guards, two identities",
        content: joinLines([
          "| Guard | Identity being checked | Prevents | Retry response |",
          "|---|---|---|---|",
          "| Idempotency key | One logical command | Duplicate business effect | Replay prior result or apply key policy |",
          "| Version / `If-Match` | One expected resource version | Lost update from stale state | Refetch, reconsider, then update |",
        ]),
      },
      example: {
        title: "Make the expected representation version explicit",
        language: "http",
        lines: [
          "GET /orders/42 HTTP/1.1",
          "Host: api.example.com",
          "",
          "HTTP/1.1 200 OK",
          "ETag: \"order-v7\"",
          "Content-Type: application/json",
          "",
          "{\"id\":42,\"status\":\"draft\"}",
          "",
          "PATCH /orders/42 HTTP/1.1",
          "If-Match: \"order-v7\"",
          "Content-Type: application/merge-patch+json",
          "",
          "{\"status\":\"confirmed\"}",
        ],
        note: "If version 7 is no longer current, the server returns `412 Precondition Failed`. This protects the version assumption; an operation key is still needed if confirming has a separately repeatable side effect.",
      },
      followups: [
        "What does JPA check when updating an entity with `@Version`?",
        "When should an API return `412 Precondition Failed`?",
        "Why does optimistic locking not replace an idempotency key?",
      ],
    },
    "idempotent-payment-api-design": {
      id: "idempotency-005",
      question: "How would you design an idempotent payment API endpoint?",
      direct: "An idempotent payment endpoint gives each payment attempt a client-generated operation key, binds it to the merchant and a canonical request fingerprint, reserves it atomically, and persists a payment state machine plus replayable response. Retries return the same payment outcome, while mismatched keys, concurrent calls, failures, and provider reconciliation follow documented rules.",
      minutes: 12,
      quick: [
        "Use one unique key for one logical payment attempt and scope it to the merchant or account.",
        "Bind the key to amount, currency, order, payee, and other operation-defining input through a fingerprint.",
        "Atomically create a payment record before calling the provider; never use check-then-charge logic.",
        "Pass a stable operation reference to the payment provider when it supports idempotency.",
        "Persist state and outcome for replay, with explicit in-progress, failure, expiry, refund, and reconciliation policies.",
      ],
      interview: [
        "An idempotent payment endpoint treats a payment attempt as a resource with its own ID and state. The client sends one idempotency key for one intended payment, and the server scopes it to the merchant or account. A fingerprint includes fields such as amount, currency, order, and payee so changed payment details cannot reuse the old key.",
        "The service atomically reserves the key and creates a payment in a state such as `PENDING`. Only one request can own that key. When the provider supports an idempotency key or merchant reference, the same stable value is used there as well. Provider IDs and every local state change are stored durably.",
        "For example, payment P-83 charges INR 1,999 for order O-42, but the client never receives the response. A retry with the same key finds P-83 and returns its known status. If the provider outcome is uncertain, the service checks or reconciles P-83 instead of creating a second payment.",
        "The API must explain how long keys remain valid, what an in-progress retry returns, which failures are final, and how status can be checked. Refunds need their own operation identity. Idempotency reduces duplicate charges, but authorization, fraud checks, reconciliation, and ledger correctness still need separate controls.",
      ],
      deepTitle: "A payment needs durable state and a recovery path",
      deep: [
        "A payment crosses at least two reliability boundaries: the client-to-API network and usually an API-to-provider network. Either response can disappear after work completed. A local `PENDING` payment record created before the provider call gives the service something stable to recover and reconcile.",
        "The idempotency key should identify the attempt, not the shopping cart forever. If a failed payment is intentionally retried with a different card as a new attempt, it needs a new key. The fingerprint prevents one key from being reused for another amount or order. Monetary values should use a fixed unit such as minor currency units, not binary floating point.",
        "Atomic reservation protects concurrent client retries. Provider idempotency protects repeated downstream submissions. These are separate scopes, so both references should be stored. If the provider times out, marking the payment definitively failed can be dangerous; a reconciliation job should query by the stable provider reference before another charge is allowed.",
        "The replay record should return the same payment resource and semantically equivalent outcome, while volatile headers such as date or trace ID may change. Expiry must exceed the promised client retry period. Audit trails, ledger entries, and refunds should be append-only business records rather than mutations hidden inside the original key.",
      ],
      visual: {
        type: "sequence_diagram",
        title: "Local and provider idempotency work together",
        content: fenced("mermaid", [
          "sequenceDiagram",
          "  participant C as Client",
          "  participant A as Payment API",
          "  participant D as Payment store",
          "  participant P as Provider",
          "  C->>A: POST payment, key K, fingerprint F",
          "  A->>D: atomically create P-83 / K / F / PENDING",
          "  A->>P: charge with stable reference P-83",
          "  P-->>A: provider result",
          "  A->>D: persist final or uncertain state",
          "  A--xC: response may be lost",
          "  C->>A: retry K + same F",
          "  A-->>C: return P-83; never create another payment",
        ]),
      },
      example: {
        title: "One key identifies one payment attempt",
        language: "http",
        lines: [
          "POST /payments HTTP/1.1",
          "Host: api.example.com",
          "Authorization: Bearer <merchant-credential>",
          "Idempotency-Key: 01J7QJWX4M8B8M2R3D7G9X1N5A",
          "Content-Type: application/json",
          "",
          "{\"orderId\":\"O-42\",\"amountMinor\":1999,\"currency\":\"INR\"}",
          "",
          "HTTP/1.1 201 Created",
          "Location: /payments/P-83",
          "Content-Type: application/json",
          "",
          "{\"id\":\"P-83\",\"status\":\"pending\"}",
        ],
        note: "A retry uses the same key only for the same operation-defining body. A later refund or a genuinely new payment attempt receives its own key and resource identity.",
      },
      followups: [
        "Why should the payment request use minor currency units?",
        "What should happen after a timeout from the payment provider?",
        "Why does a refund need a different idempotency identity?",
      ],
    },
  },
  "json-basics": {
    "json-in-rest-apis": {
      id: "json-basics-001",
      question: "What is JSON and why is it the dominant data format for REST APIs?",
      direct: "JSON is a text format for structured values: objects, arrays, strings, numbers, booleans, and null. It became the common default for web APIs because it is compact, language-independent, natural for browser clients, and supported by mature tools. It is a representation format, not a requirement of REST or HTTP.",
      minutes: 8,
      quick: [
        "JSON represents objects, arrays, strings, numbers, booleans, and `null` as text.",
        "Use the media type `application/json`; JSON exchanged across open systems is encoded as UTF-8.",
        "Its small syntax and broad browser, server, and tooling support make it a practical API default.",
        "JSON has no built-in date, decimal, binary, comment, or reference type; an API must define conventions.",
        "REST does not require JSON: the same resource can have JSON, XML, HTML, or another representation.",
      ],
      interview: [
        "JSON stands for JavaScript Object Notation. It is a text format for structured data and supports objects, arrays, strings, numbers, `true`, `false`, and `null`. The syntax came from JavaScript, but JSON is language-independent and is supported by almost every common programming language.",
        "JSON is widely used in HTTP APIs because it is compact, readable, easy for browsers to handle, and simple to map to normal program values. A Spring Boot service can turn a Java DTO into JSON, while a JavaScript client can read the same response without a special document model.",
        "For example, an order response can contain an ID, a nested customer, and an array of line items. `Content-Type: application/json` tells the client what the body contains, and `Accept: application/json` can request that representation. The API documentation still needs to say which fields are required and what they mean.",
        "JSON has no built-in date, exact-decimal, or binary type. APIs therefore need clear rules, such as ISO 8601 strings for dates and integer minor units for money. JSON also does not make an API RESTful by itself; it is only one possible representation format carried by HTTP.",
      ],
      deepTitle: "JSON syntax is simple, but the API defines what values mean",
      deep: [
        "A JSON parser can tell whether braces, strings, commas, and values follow the grammar. It cannot tell whether `amount` may be negative, whether `createdAt` is a timestamp, or whether `status` accepts `paid`. Those rules belong to the API schema and domain contract. Valid JSON can still be an invalid request.",
        "Object member names should be unique for interoperable behavior. Different parsers have historically handled duplicate names differently, often keeping only the last value. An API should reject or prevent duplicates rather than depend on one parser's choice. Member order should not carry business meaning; array order can.",
        "Numbers deserve special attention across languages. JSON's grammar does not set one machine representation, but JavaScript numbers cannot exactly represent every large integer. IDs are often strings when their range or formatting matters. Money should use a documented exact representation instead of a binary floating-point assumption.",
        "The media type tells a recipient how to interpret the bytes. `application/json` plus UTF-8 is the interoperable default for open exchange. Content negotiation allows another representation where it genuinely helps, such as a file download or a compact binary protocol. JSON's popularity is a practical ecosystem advantage, not an architectural mandate.",
      ],
      visual: {
        type: "concept_map",
        title: "JSON syntax and API meaning are different layers",
        content: fenced("mermaid", [
          "flowchart LR",
          "  J[JSON text] --> P[Parser checks syntax]",
          "  P --> V{Value kind}",
          "  V --> O[object / array]",
          "  V --> S[string / number]",
          "  V --> L[true / false / null]",
          "  O --> C[API contract adds required fields + meaning]",
          "  S --> C",
          "  L --> C",
          "  C --> D[Domain rules decide whether request is valid]",
        ]),
      },
      example: {
        title: "A valid JSON order representation",
        language: "json",
        lines: [
          "{",
          "  \"id\": \"O-42\",",
          "  \"createdAt\": \"2026-09-07T10:15:30Z\",",
          "  \"totalMinor\": 1999,",
          "  \"currency\": \"INR\",",
          "  \"items\": [",
          "    {\"productId\": \"P-9\", \"quantity\": 2}",
          "  ]",
          "}",
        ],
        note: "JSON validates the structure only. The API contract explains that `createdAt` is an instant, `totalMinor` uses the currency's minor unit, and quantity must be positive.",
      },
      followups: [
        "Which value types exist in JSON?",
        "Why might an API represent an identifier as a JSON string?",
        "Does a REST API have to use JSON?",
      ],
    },
    "jackson-json-serialization-in-spring-boot": {
      id: "json-basics-002",
      question: "How does Spring Boot serialize and deserialize JSON with Jackson?",
      direct: "Spring MVC selects an HTTP message converter from the request or response media type. With Jackson configured, the converter uses an `ObjectMapper` to deserialize JSON request content into a controller parameter and serialize a returned DTO into JSON. DTO shape, Jackson configuration, annotations, validation, and error handling define the actual contract.",
      minutes: 10,
      quick: [
        "`@RequestBody` asks Spring MVC to read request content through an `HttpMessageConverter`.",
        "A Jackson-backed converter uses an `ObjectMapper` to map JSON to a target Java type and back.",
        "`Content-Type` describes request data; `Accept` helps select the response representation.",
        "Use DTOs and focused annotations such as `@JsonProperty`; configure shared conventions centrally.",
        "Treat unknown fields, nulls, dates, numbers, and polymorphic input as explicit contract decisions.",
      ],
      interview: [
        "Spring Boot normally uses Jackson to convert between JSON and Java objects. When a controller parameter has `@RequestBody`, Spring MVC selects an HTTP message converter. For a JSON request, that converter uses Jackson's `ObjectMapper` to build the declared request type.",
        "The reverse happens for a value returned by `@RestController`. Spring gives the response object to the Jackson converter, Jackson reads the DTO fields and configuration, and the result is written as JSON with a media type such as `application/json`.",
        "For example, `@JsonProperty(\"display_name\")` can map the JSON field `display_name` to a Java component named `displayName`. The controller receives a `CreateUserRequest`, calls the service, and returns a separate `UserResponse`. If the request parameter also has `@Valid`, Bean Validation runs after JSON has been mapped successfully.",
        "Spring Boot supplies a shared `ObjectMapper` when Jackson is available, and applications can customize naming, dates, modules, and strictness. Malformed JSON fails before the business method. A valid Java object can still fail validation or domain rules, so Jackson handles conversion while the application remains responsible for the public data shape and safe error handling.",
      ],
      deepTitle: "How JSON moves into and out of a controller",
      deep: [
        "Handler mapping selects a controller method from the path, method, and media conditions. Argument resolution sees `@RequestBody` and delegates to a converter that can read the request's `Content-Type` into the declared target type. Jackson parses tokens, constructs the object, converts property values, and applies configured annotations and modules.",
        "The reverse path begins with the controller's return value. The chosen converter serializes it based on the negotiated media type. Request and response DTOs define the public shape. Global naming or time conventions can be configured centrally, while one-off exceptions can use focused annotations or a custom serializer. Over-customization makes behavior hard to predict.",
        "Malformed JSON fails during message conversion before controller logic receives a DTO. Valid JSON can still violate Bean Validation or domain rules afterward. Serialization can also fail, for example when a custom serializer throws. These stages should map to safe, consistent error responses rather than expose mapping internals.",
        "Deserialization is a trust boundary. Unknown-member handling, polymorphic type support, numeric coercion, and accepted date formats should be intentional. In particular, an API should not rely on a remembered library default when strict input compatibility matters; configure and test the ObjectMapper behavior used by that application.",
      ],
      visual: {
        type: "flow_diagram",
        title: "Jackson sits inside Spring's message-conversion path",
        content: fenced("mermaid", [
          "flowchart LR",
          "  A[JSON request + Content-Type] --> B[HttpMessageConverter]",
          "  B --> C[Jackson ObjectMapper]",
          "  C --> D[Request DTO]",
          "  D --> E[Controller + service]",
          "  E --> F[Response DTO]",
          "  F --> C",
          "  C --> G[JSON response + Content-Type]",
        ]),
      },
      example: {
        title: "Use DTO annotations only where the contract needs them",
        language: "java",
        lines: [
          "import com.fasterxml.jackson.annotation.JsonProperty;",
          "import org.springframework.web.bind.annotation.*;",
          "",
          "record CreateUserRequest(",
          "        @JsonProperty(\"display_name\") String displayName,",
          "        String email) {}",
          "",
          "record UserResponse(long id, String displayName) {}",
          "",
          "@RestController",
          "@RequestMapping(\"/users\")",
          "final class UserController {",
          "    @PostMapping",
          "    UserResponse create(@RequestBody CreateUserRequest request) {",
          "        return new UserResponse(42, request.displayName());",
          "    }",
          "}",
        ],
        note: "With Jackson and Spring MVC configured, the request member `display_name` maps to the Java component `displayName`, and the returned record is serialized as a JSON response.",
      },
      followups: [
        "What role does an `HttpMessageConverter` play in Spring MVC?",
        "When should Jackson configuration be global rather than annotation-based?",
        "At what stage does malformed JSON fail?",
      ],
    },
    "json-serialization-vs-deserialization": {
      id: "json-basics-003",
      question: "What is the difference between JSON serialization and deserialization?",
      direct: "Serialization converts an in-memory object into JSON text for storage or transport; deserialization parses JSON text and constructs an in-memory value. The directions share a contract but have different risks: serialization controls what leaves the service, while deserialization handles untrusted input, missing members, unknown members, and invalid values.",
      minutes: 8,
      quick: [
        "Serialization is Java object to JSON; deserialization is JSON to Java object.",
        "Jackson writes properties through an `ObjectMapper` and reads JSON into a requested target type.",
        "The public JSON shape should be deliberate rather than an automatic copy of a persistence entity.",
        "Serialization must avoid secrets, lazy-loading surprises, and cyclic object graphs.",
        "Deserialization must define required fields, unknown fields, coercion, null handling, and validation.",
      ],
      interview: [
        "Serialization turns a Java object into JSON. Deserialization does the opposite: it reads JSON and creates a Java object of the requested type. In Spring Boot, Jackson and the HTTP message converters usually perform both operations automatically.",
        "During serialization, Jackson chooses fields using the DTO, visibility rules, configuration, and annotations. The important question is what the API is allowed to expose. A response should not accidentally include a password hash, an internal flag, or a large lazy-loaded entity graph.",
        "During deserialization, the target Java type guides the conversion. JSON such as `\"quantity\": 2` can fill an integer component, but malformed JSON or an incompatible type fails during mapping. Successful deserialization only proves that a Java value could be built; validation and business rules still have to check whether it is acceptable.",
        "For example, `CreateOrderRequest` can receive `customerId` and `items` from JSON. The service checks stock and pricing, then maps the result to `OrderResponse` containing only the public ID, status, and totals. Both directions need contract tests, and custom serializers or deserializers should be used only when normal DTO mapping cannot express the required wire format.",
      ],
      deepTitle: "Request JSON and response JSON have different jobs",
      deep: [
        "Serialization begins with a Java object graph, but the API should publish a deliberate representation rather than every reachable object. Bidirectional entity relationships can recurse, lazy associations can trigger unexpected queries, and broad visibility can expose data. A response DTO makes the outgoing shape finite and reviewable.",
        "Deserialization begins with untrusted bytes. A parser checks JSON syntax, the mapper applies target-type rules, Bean Validation checks structural constraints, and the service enforces domain rules. These are separate stages. A syntactically valid request can still have an unknown product, insufficient stock, or an invalid state transition.",
        "Round-tripping is not always lossless. A write-only request field may not appear in a response. Server-generated IDs and timestamps appear only after processing. Numbers or dates may use representations chosen for cross-language safety. The contract should describe each direction instead of promising that any serialized object can be deserialized into an equivalent entity.",
        "Mapping tests catch accidental contract drift. Test representative output fields, missing and null input, unknown members according to policy, boundary numbers, and time-zone behavior. Tests should assert the public JSON rather than Jackson's incidental property discovery on a persistence model.",
      ],
      visual: {
        type: "comparison_table",
        title: "The same boundary, opposite directions",
        content: joinLines([
          "| Concern | Serialization | Deserialization |",
          "|---|---|---|",
          "| Direction | Java value → JSON | JSON → target Java type |",
          "| Main control | Which fields and formats leave | Which shapes and values enter |",
          "| Typical risk | Secret exposure, cycles, lazy loading | Invalid input, coercion, unknown fields |",
          "| Next step | HTTP response | Validation and domain processing |",
        ]),
      },
      example: {
        title: "One request DTO in both directions",
        language: "java",
        lines: [
          "import com.fasterxml.jackson.databind.ObjectMapper;",
          "",
          "final class JsonRoundTripExample {",
          "    record CreateOrderRequest(String productId, int quantity) {}",
          "",
          "    static String roundTrip(String input) throws Exception {",
          "        ObjectMapper mapper = new ObjectMapper();",
          "        CreateOrderRequest request = mapper.readValue(",
          "                input, CreateOrderRequest.class); // deserialization",
          "        return mapper.writeValueAsString(request); // serialization",
          "    }",
          "}",
        ],
        note: "This is valid Jackson usage when `jackson-databind` is on the classpath. A real API still validates `quantity` and usually maps to a separate response type.",
      },
      followups: [
        "Why can serialization of JPA entities trigger unexpected database queries?",
        "Does valid JSON guarantee a valid domain command?",
        "When is a custom Jackson serializer appropriate?",
      ],
    },
    "request-body-validation-in-spring-boot": {
      id: "json-basics-004",
      question: "How do you validate JSON request bodies in Spring Boot?",
      direct: "In Spring Boot, define request DTO constraints with Jakarta Bean Validation and place `@Valid` on the `@RequestBody` parameter. JSON is first deserialized, then object constraints run; nested objects need cascading validation. A service still enforces cross-record and state-dependent business rules, and a central handler returns consistent safe problem details.",
      minutes: 10,
      quick: [
        "Put input constraints such as `@NotBlank`, `@Email`, `@Positive`, and `@Size` on a request DTO.",
        "Use `@Valid @RequestBody` so Spring applies Bean Validation after JSON conversion.",
        "Use `@Valid` on nested DTO fields or elements when their constraints must cascade.",
        "Keep state-dependent and cross-resource business rules in the service layer, not only annotations.",
        "Translate validation failures into one stable error format without exposing internal exception details.",
      ],
      interview: [
        "Spring validates a JSON request in stages. First, an HTTP message converter turns the body into the declared Java type. Malformed JSON or an incompatible value fails at this step. After conversion, `@Valid` on the `@RequestBody` parameter asks Jakarta Bean Validation to check the constraints on the DTO.",
        "A request can use `@NotBlank` for a name, `@Email` for an email address, `@Positive` for quantity, and collection constraints such as `@NotEmpty`. Nested objects or collection elements need `@Valid` so their own constraints are checked as well.",
        "For example, `POST /orders` can require at least one item, a nonblank product ID, and a positive quantity. Spring rejects a structurally invalid request before the controller calls the order service. The service still checks rules that depend on current data, such as whether the product exists, stock is available, or the customer may use a coupon.",
        "Bean Validation does not replace domain rules or database constraints. A central `@ControllerAdvice` can turn conversion and validation exceptions into one safe, consistent error format. Tests should cover malformed JSON, missing fields, invalid nested items, and valid input that later fails a business rule.",
      ],
      deepTitle: "Validation happens in clear stages",
      deep: [
        "Four different failures can look like “bad input.” The JSON may be malformed, mapping may fail because a value cannot become the declared Java type, Bean Validation may reject the constructed DTO, or domain logic may reject a structurally valid command. Keeping these stages separate produces clearer code and more accurate errors.",
        "Bean Validation is strongest for local, deterministic constraints: nullability, string form, numeric ranges, collection size, and relationships among fields in one object through a custom class-level constraint. Cascading is explicit. `@Valid` by itself is not a constraint; it tells the validator to inspect nested constrained objects.",
        "Rules that query changing state do not fit a simple field annotation. A uniqueness check in validation can pass and still race with another insert, so the database also needs a unique constraint. The service catches that conflict and maps it to the API outcome. Authorization likewise should not be disguised as validation.",
        "Error responses should let clients attach a failure to a field without parsing prose. A stable problem type plus an extension array of field path and rule code works well. The human message can be localized. Reject unexpected data according to the service's compatibility policy and cap body and collection sizes before expensive processing.",
      ],
      visual: {
        type: "flow_diagram",
        title: "Each validation layer proves something different",
        content: fenced("mermaid", [
          "flowchart LR",
          "  A[Request bytes] --> B{Valid JSON + target types?}",
          "  B -->|no| X[Message-conversion error]",
          "  B -->|yes| C{DTO constraints pass?}",
          "  C -->|no| Y[Field validation problem]",
          "  C -->|yes| D{Domain + authorization rules pass?}",
          "  D -->|no| Z[Domain-specific problem]",
          "  D -->|yes| E[Persist with database constraints]",
        ]),
      },
      example: {
        title: "Validate the request shape before service work",
        language: "java",
        lines: [
          "import jakarta.validation.Valid;",
          "import jakarta.validation.constraints.*;",
          "import java.util.List;",
          "import org.springframework.http.ResponseEntity;",
          "import org.springframework.web.bind.annotation.*;",
          "",
          "record CreateOrderRequest(",
          "        @NotEmpty List<@Valid OrderItemRequest> items) {}",
          "",
          "record OrderItemRequest(",
          "        @NotBlank String productId,",
          "        @Positive int quantity) {}",
          "",
          "@RestController",
          "@RequestMapping(\"/orders\")",
          "final class OrderController {",
          "    private final OrderService orderService;",
          "",
          "    OrderController(OrderService orderService) { this.orderService = orderService; }",
          "",
          "    @PostMapping",
          "    ResponseEntity<OrderResponse> create(",
          "            @Valid @RequestBody CreateOrderRequest request) {",
          "        return ResponseEntity.status(201).body(orderService.create(request));",
          "    }",
          "}",
          "",
          "interface OrderService { OrderResponse create(CreateOrderRequest request); }",
          "record OrderResponse(long id) {}",
        ],
        note: "`@Valid` on each collection element cascades to the item record. Product existence and stock availability still belong in `orderService`, backed by database integrity rules.",
      },
      followups: [
        "What is the difference between JSON conversion failure and Bean Validation failure?",
        "Why is `@Valid` needed on nested request objects?",
        "Why should a uniqueness rule also exist in the database?",
      ],
    },
    "dto-vs-entity-in-rest-apis": {
      id: "json-basics-005",
      question: "What is the difference between a DTO and an entity in Spring Boot JSON handling?",
      direct: "An entity models persistent identity, relationships, and lifecycle for the data layer; a DTO models the request or response contract at the API boundary. Keeping them separate prevents accidental field exposure and over-posting, avoids persistence-proxy and relationship problems in JSON, and lets the database and public API evolve independently.",
      minutes: 9,
      quick: [
        "A JPA entity is a persistence model with identity, lifecycle, and mapped relationships.",
        "A DTO is a boundary-specific data shape for one request, response, or use case.",
        "Request and response DTOs prevent clients from setting internal fields or seeing sensitive ones.",
        "Direct entity serialization can trigger lazy loads, recursion, proxy details, and unstable JSON contracts.",
        "Explicit mapping costs code but separates public compatibility from database design.",
      ],
      interview: [
        "A JPA entity represents data managed by persistence. It has database identity, mapping information, relationships, and a lifecycle inside the persistence context. A DTO, or Data Transfer Object, represents the input or output of one API use case. The fields may look similar, but the two classes serve different jobs.",
        "Using an entity directly in a controller creates unwanted coupling. A request might bind fields such as `id`, `role`, or internal status that a client should not control. Returning the entity can expose sensitive values, follow bidirectional relationships forever, or trigger lazy database queries during JSON serialization.",
        "For example, `CreateUserRequest` may accept only `displayName` and `email`. The entity can also contain a password hash, audit fields, and organization relationships. `UserResponse` returns the public ID, display name, and a safe organization summary. A mapper copies only the intended fields in each direction.",
        "DTOs let the API contract change separately from the database model, but they add mapping code and more classes. Mapping libraries can reduce repetition, though their output still needs review and tests. For a maintained or public API, separate request and response DTOs are normally safer than exposing entities directly.",
      ],
      deepTitle: "Entities and DTOs change for different reasons",
      deep: [
        "An entity is designed around consistency and persistence operations. It may have lazy relationships, optimistic-lock versions, surrogate keys, and fields needed only for auditing. An API representation is designed around a client's task and compatibility. Publishing the entity turns every persistence refactor into a potential API change.",
        "Request DTOs create an allow-list. A create request can omit server-owned fields entirely, while an update request can model exactly which changes are permitted. This is stronger than accepting an entity and hoping annotations hide enough fields. Validation messages also attach naturally to the request vocabulary the client sent.",
        "Response DTOs bound the object graph. Instead of serializing `Order -> Customer -> Orders -> Customer`, a response can include a customer link or compact summary. The service loads the data the use case needs, maps it inside the correct transaction, and avoids accidental N+1 queries caused by a serializer touching lazy properties.",
        "Mapping can be manual, generated, or projection-based. Manual mapping is clearest for small contracts. Generated mapping helps many similar fields but should fail visibly when fields change. Regardless of tool, contract tests should assert JSON field names, null behavior, and sensitive-field absence.",
      ],
      visual: {
        type: "comparison_table",
        title: "One use case crosses three models",
        content: joinLines([
          "| Model | Designed for | Example fields | Main boundary |",
          "|---|---|---|---|",
          "| Request DTO | Accepted client command | `displayName`, `email` | Validation + allow-list |",
          "| Entity | Persistent identity and rules | ID, hash, version, relationships | Persistence context |",
          "| Response DTO | Published client view | ID, display name, safe links | Stable JSON contract |",
        ]),
      },
      example: {
        title: "Map only fields each boundary owns",
        language: "java",
        lines: [
          "final class UserMappingExample {",
          "    record CreateUserRequest(String displayName, String email) {}",
          "    record UserResponse(long id, String displayName) {}",
          "",
          "    static final class UserEntity {",
          "        long id;",
          "        String displayName;",
          "        String email;",
          "        String passwordHash;",
          "        long version;",
          "    }",
          "",
          "    static UserResponse toResponse(UserEntity user) {",
          "        return new UserResponse(user.id, user.displayName);",
          "    }",
          "}",
        ],
        note: "The response has no path to `passwordHash` or the persistence version. A separate create mapper can apply server-owned defaults rather than binding them from client JSON.",
      },
      followups: [
        "How can direct entity binding cause an over-posting vulnerability?",
        "Why can entity serialization trigger an N+1 query problem?",
        "What trade-off does explicit DTO mapping introduce?",
      ],
    },
  },
  "rest-constraints": {
    "the-six-rest-constraints": {
      id: "rest-constraints-001",
      question: "What are the six constraints of REST architecture?",
      direct: "REST combines client-server separation, stateless communication, cacheability, a uniform interface, a layered system, and optional code-on-demand. These constraints work together to improve visibility, independent evolution, scalability, and intermediary support. Code-on-demand is the only optional constraint; using HTTP and JSON alone does not prove an API follows REST.",
      minutes: 11,
      quick: [
        "Client-server separates user-interface concerns from data and service concerns.",
        "Stateless means each request carries the context needed to understand it; the server keeps no client session context between requests.",
        "Cacheable responses state whether and how an earlier response may be reused.",
        "Uniform interface standardizes resource identification, representation-based manipulation, self-descriptive messages, and hypermedia controls.",
        "Layered system hides whether the client reaches the origin or an intermediary; code-on-demand is optional.",
      ],
      interview: [
        "REST is an architectural style built from six constraints. They are client-server, stateless, cacheable, uniform interface, layered system, and code-on-demand. Code-on-demand is the only optional one. Using HTTP and returning JSON does not by itself prove that an API follows REST.",
        "Client-server keeps the user interface separate from resource and service work. Stateless means each request carries the context needed to understand it. The server can still store orders, users, permissions, logs, and caches; it simply does not depend on hidden client-session context from an earlier request.",
        "Cacheability lets a response explain whether it may be reused, while layered system allows gateways, proxies, caches, and load balancers to sit between the client and the service. These constraints can reduce repeated work and let the backend scale without changing the public API.",
        "Uniform interface gives every participant a shared way to interact: resources have identifiers, representations carry state, messages explain themselves, and hypermedia can show available next actions. Code-on-demand lets a server send executable behavior such as browser JavaScript. The constraints are most useful when they work together, not when their names are only memorized.",
      ],
      deepTitle: "How the six REST constraints work together",
      deep: [
        "Fielding derives REST as a constrained architectural style. Each constraint creates benefits and costs. Client-server separation improves portability and independent evolution. Stateless interaction improves visibility and makes requests easier to route, but repeats contextual information and moves application-state responsibility to the client.",
        "Caching adds efficiency by reusing a prior response when its rules allow. It can reduce consistency if freshness is chosen poorly, so responses label their reuse semantics. A layered system allows intermediaries to add security, translation, load distribution, or caching without changing the client interface, while adding latency and making end-to-end behavior less obvious.",
        "Uniform interface trades some application-specific efficiency for a shared way of interacting. A representation describes current resource state; metadata explains how to interpret it; controls identify possible next transitions. This is why a collection of RPC-style JSON endpoints does not become REST merely because it uses HTTP verbs.",
        "Code-on-demand is optional because downloading executable behavior can improve client extensibility but reduces visibility. Browser JavaScript is the familiar example. An API can omit it and still conform to the other constraints. REST is therefore assessed by architectural behavior, not by a checklist of route naming conventions alone.",
      ],
      visual: {
        type: "concept_map",
        title: "The six constraints and their main contribution",
        content: fenced("mermaid", [
          "flowchart TD",
          "  R[REST architectural style] --> CS[Client-server<br/>separate concerns]",
          "  R --> ST[Stateless<br/>request contains context]",
          "  R --> CA[Cacheable<br/>controlled reuse]",
          "  R --> UI[Uniform interface<br/>shared interaction model]",
          "  R --> LS[Layered system<br/>transparent intermediaries]",
          "  R --> CD[Code-on-demand<br/>optional executable behavior]",
        ]),
      },
      example: {
        title: "Several constraints appear in one ordinary response",
        language: "http",
        lines: [
          "GET /orders/42 HTTP/1.1",
          "Host: api.example.com",
          "Authorization: Bearer <credential>",
          "Accept: application/json",
          "",
          "HTTP/1.1 200 OK",
          "Content-Type: application/json",
          "Cache-Control: private, max-age=30",
          "ETag: \"order-42-v7\"",
          "",
          "{\"id\":42,\"status\":\"draft\",\"links\":[{\"rel\":\"confirm\",\"href\":\"/orders/42/confirmation\"}]}",
        ],
        note: "The request carries its credential, the representation is self-descriptive through metadata, caching is explicit, and the response includes a control for an available transition. A gateway could carry the exchange without changing that contract.",
      },
      followups: [
        "Which REST constraint is optional?",
        "What are the four parts of the uniform-interface constraint?",
        "Why does using JSON over HTTP not automatically make an API RESTful?",
      ],
    },
    "statelessness-and-scalability": {
      id: "rest-constraints-002",
      question: "Why is statelessness the most important REST constraint for scalability?",
      direct: "Statelessness is especially valuable for horizontal scaling because any capable server can understand a request without retrieving conversational session context from the previous server. It improves visibility, failover, and routing, but it is not objectively the only important REST constraint and it does not require JWT; each request only needs sufficient context for that interaction.",
      minutes: 10,
      quick: [
        "Each request must contain the information needed to understand and authorize that interaction.",
        "The server keeps resource state, but not client application-session context between requests.",
        "Any healthy instance can handle the next request, reducing affinity and failover complexity.",
        "Statelessness does not require JWT; credentials can use another scheme if the request remains independently understandable.",
        "Repeated context can increase request size, and multi-step workflows must model progress as resources or client state.",
      ],
      interview: [
        "In REST, statelessness means the server does not rely on client-session context remembered from earlier requests. Each request carries the information needed to understand and authorize that interaction. The server still stores normal resource state such as users, orders, permissions, idempotency records, and logs.",
        "This helps horizontal scaling because the next request can go to any healthy instance. A load balancer does not have to send the user back to the same server just because that server remembers the conversation. Replacing an instance is also easier because no private session memory is lost with it.",
        "For example, a request for `/orders/42` carries its credential and request details. Instance A can handle the read and instance B can handle a later update because neither depends on a hidden `currentOrder` value left by the earlier request.",
        "Statelessness does not require JWT. An opaque token, HTTP credentials, or a signed cookie can also provide enough context. The cost is that some information is repeated, and a multi-step workflow must keep progress on the client or expose it as a server resource. It is a major scaling benefit, but caching, layers, and the uniform interface matter too.",
      ],
      deepTitle: "Stateless requests can still use stored business data",
      deep: [
        "Fielding distinguishes resource state from application state. The origin stores resources such as an order and its current status. The client drives application progress by choosing links and submitting representations. The server does not remember a hidden conversational step that a later request requires but does not contain.",
        "Removing per-instance session context changes failure behavior. If an instance disappears after a response, another instance can process the next complete request. Shared databases and authorization services can still be consulted; the key is that understanding does not depend on undocumented conversation memory attached to one server process.",
        "Authentication technology does not determine RESTfulness. A self-contained signed token can reduce lookups but creates revocation and freshness trade-offs. An opaque token can be resolved centrally and still support independently understandable requests. Neither choice excuses an API from authorization checks or credential protection.",
        "Long-running work can remain stateless at the interaction layer by becoming a resource. A client posts an export request, receives `/exports/E7`, and later reads its status. The workflow state is explicit, addressable resource state rather than an invisible session variable. This makes retries, monitoring, and recovery clearer as well as scalable.",
      ],
      visual: {
        type: "comparison_table",
        title: "What the server may store under stateless interaction",
        content: joinLines([
          "| State | Allowed? | Example |",
          "|---|---:|---|",
          "| Resource state | Yes | Order 42 is `PAID` |",
          "| Operational state | Yes | Cache entry, log, rate-limit counter |",
          "| Credential and policy data | Yes | Account roles in an authorization store |",
          "| Hidden client session context required by next request | No | “This user is on checkout step 3” only in instance memory |",
        ]),
      },
      example: {
        title: "Model a multi-step job as a resource",
        language: "http",
        lines: [
          "POST /exports HTTP/1.1",
          "Authorization: Bearer <credential>",
          "Content-Type: application/json",
          "",
          "{\"report\":\"monthly-sales\"}",
          "",
          "HTTP/1.1 202 Accepted",
          "Location: /exports/E7",
          "",
          "GET /exports/E7 HTTP/1.1",
          "Authorization: Bearer <credential>",
        ],
        note: "The export's progress is server-side resource state. Either API instance can understand the later GET from its URI and credential without remembering which instance accepted the POST.",
      },
      followups: [
        "What is the difference between resource state and client session context?",
        "Does REST statelessness require JWT authentication?",
        "How can a long-running workflow remain stateless at the request level?",
      ],
    },
    "layered-system-constraint": {
      id: "rest-constraints-004",
      question: "What is the Layered System constraint in REST?",
      direct: "In REST, a layered system means the client only talks to the next layer and does not need to know what is behind it. A request may pass through a cache, API gateway, or load balancer before it reaches the service. This keeps the client simple and lets the backend change or scale, although extra layers can add delay and make debugging harder.",
      minutes: 7,
      quick: [
        "The client uses one public API and does not need to know the internal request path.",
        "A request may pass through a cache, proxy, API gateway, or load balancer.",
        "Layers add useful jobs such as caching, security, routing, and traffic distribution.",
        "More layers can add delay and make errors harder to trace.",
      ],
      interview: [
        "Layered System is one of the REST constraints. It means a client only knows the component it is directly talking to. The client does not need to know whether that component is the real service, an API gateway, a proxy, or a cache.",
        "For example, a mobile app sends `GET /orders/42` to `api.example.com`. The request may go through a CDN, an API gateway, and a load balancer before the Order Service handles it. The app still sees one API address and one HTTP response.",
        "This is useful because each layer can have a clear job. A CDN can cache responses, a gateway can check authentication and route requests, and a load balancer can choose a healthy server. The company can add or change these layers without releasing a new version of the mobile app.",
        "The trade-off is that every extra hop can add delay and another place where a request can fail. It can also make debugging harder, so logs and trace IDs are useful. This REST constraint is about network layers; it is different from controller, service, and repository layers inside a Java application.",
      ],
      deepTitle: "How a request moves through the layers",
      deep: [
        "Think of the public API as the front door of the system. The client knows the front-door address, such as `api.example.com`, but it does not need the address of every service behind it.",
        "When a request arrives, each layer does one job and passes the request forward. A cache may return a saved response. An API gateway may check the token and choose the correct service. A load balancer may select one healthy instance of that service. The business service then reads or updates the real resource.",
        "The important rule is that the public API contract stays stable. A team can add another service instance or replace a proxy without changing the mobile or web client. At the same time, a layer should not silently change the meaning of the request or response.",
        "Because a request can cross several components, the system should pass a request ID or trace ID through the layers. This helps developers find where a failure or delay happened.",
      ],
      visual: {
        type: "architecture_diagram",
        title: "One public API, several internal layers",
        content: fenced("mermaid", [
          "flowchart LR",
          "  C[Web or mobile client] -->|api.example.com| P[CDN or proxy]",
          "  P --> G[API gateway]",
          "  G --> L[Load balancer]",
          "  L --> S[Order service]",
          "  S --> D[(Order data)]",
          "  C -. only knows the public API .-> G",
        ]),
      },
      example: {
        type: "comparison_table",
        title: "What each layer can do",
        content: joinLines([
          "| Layer | Simple job |",
          "|---|---|",
          "| CDN or cache | Return a saved response closer to the user |",
          "| API gateway | Check common rules and route the request |",
          "| Load balancer | Send traffic to a healthy service instance |",
          "| Business service | Run the application logic and access data |",
        ]),
      },
      followups: [
        "How is REST's Layered System constraint different from controller-service-repository layers?",
        "What jobs can an API gateway handle?",
        "What problems can too many network layers create?",
      ],
    },
    "rest-cacheability-and-cache-control-headers": {
      id: "rest-constraints-005",
      question: "What is cacheability in REST and how do you control it with HTTP headers?",
      direct: "Cacheability lets a client or intermediary reuse a stored response when HTTP rules permit. `Cache-Control` sets storage and freshness policy, `Vary` separates negotiated variants, and validators such as ETag or Last-Modified support conditional revalidation. `no-cache` means revalidate before reuse; `no-store` means do not store the response.",
      minutes: 11,
      quick: [
        "`max-age` gives a freshness lifetime; a fresh stored response can usually be reused without contacting the origin.",
        "`no-cache` allows storage but requires successful validation before reuse; `no-store` forbids storage.",
        "`private` limits storage to a private cache, while `public` explicitly permits shared-cache storage in relevant cases.",
        "ETag with `If-None-Match` and Last-Modified with `If-Modified-Since` support revalidation and possible `304` responses.",
        "Use `Vary` when a selected representation depends on request fields such as `Accept-Encoding`; protect personalized responses deliberately.",
      ],
      interview: [
        "Cacheability means that a client or intermediary may store a response and reuse it when HTTP rules allow. Reuse can reduce response time, bandwidth, and work on the original service. It is broader than an in-memory cache inside the Spring Boot application.",
        "`Cache-Control` gives the main rules. `max-age=60` says the response is fresh for 60 seconds. `private` limits storage to a private cache, while `no-store` says not to store the response. `no-cache` still allows storage, but the cache must validate the response before using it again.",
        "A validator makes that check inexpensive. The server can return `ETag: \"product-42-v7\"`, and a later GET sends `If-None-Match` with the same value. If the representation has not changed, the server returns `304 Not Modified` and the client reuses its stored body.",
        "A public product page may use `public, max-age=60` with an ETag. A personalized account response normally needs `private` or `no-store` according to its sensitivity. `Vary` is also important when headers such as `Accept-Encoding` change the selected response. Cache rules should match how stale and how widely shared the data may safely be.",
      ],
      deepTitle: "Storage, freshness, and validation are separate decisions",
      deep: [
        "A response can be storable yet not reusable immediately. Storage rules decide whether a cache may retain it. Freshness decides whether it can be reused without contacting the origin. A stale response might become reusable after validation, and some rules allow controlled stale use. Keeping these concepts separate prevents the common `no-cache` versus `no-store` mistake.",
        "An ETag is an opaque validator selected by the origin. A strong validator identifies byte-equivalent representations for operations that require strong comparison; a weak ETag can support semantic cache validation but is not suitable for every range or precondition use. Last-Modified is easier but has time-resolution limits and may be unavailable.",
        "`Vary` changes the cache key by naming request fields that selected the response. Omitting it can serve the wrong language, encoding, or media type. Using `Vary: *` prevents normal reuse and broad `Vary` values reduce hit rate, so it should reflect actual selection inputs.",
        "Caching authenticated and personalized data needs deliberate policy. Shared caches normally cannot reuse a response to an authorized request unless response directives permit it. Private caches and shared caches have different audiences. Test behavior with real headers, mutations, and revalidation instead of assuming a framework annotation creates a correct cache contract.",
      ],
      visual: {
        type: "flow_diagram",
        title: "A cache chooses reuse, validation, or origin fetch",
        content: fenced("mermaid", [
          "flowchart TD",
          "  R[Request] --> S{Matching stored response?}",
          "  S -->|no| O[Fetch from origin]",
          "  S -->|yes| F{Fresh and reusable?}",
          "  F -->|yes| U[Reuse stored response]",
          "  F -->|no| V[Send conditional request with validator]",
          "  V -->|304| U",
          "  V -->|new representation| N[Store allowed response and return it]",
        ]),
      },
      example: {
        title: "Revalidate a stale product representation",
        language: "http",
        lines: [
          "HTTP/1.1 200 OK",
          "Content-Type: application/json",
          "Cache-Control: public, max-age=60, must-revalidate",
          "ETag: \"product-42-v7\"",
          "Vary: Accept-Encoding",
          "",
          "{\"id\":42,\"priceMinor\":1999}",
          "",
          "GET /products/42 HTTP/1.1",
          "If-None-Match: \"product-42-v7\"",
          "",
          "HTTP/1.1 304 Not Modified",
        ],
        note: "After freshness expires, the validator can avoid retransmitting the representation. `must-revalidate` limits stale reuse; it does not mean the response must be checked while still fresh.",
      },
      followups: [
        "What is the difference between `no-cache` and `no-store`?",
        "How does an ETag reduce data transfer during revalidation?",
        "Why can a missing `Vary` header serve the wrong representation?",
      ],
    },
    "uniform-interface-sub-constraints": {
      id: "rest-constraints-003",
      question: "What is the Uniform Interface constraint and what are its four sub-constraints?",
      direct: "Uniform interface is REST's shared interaction model. It requires identification of resources, manipulation through representations, self-descriptive messages, and hypermedia as the engine of application state. Together they decouple clients from server implementation, although the generic interface can be less efficient than a purpose-built remote procedure call.",
      minutes: 11,
      quick: [
        "Resource identification gives each resource an identifier independent of any one representation.",
        "Manipulation through representations lets a client propose changes by sending a representation with understood metadata.",
        "Self-descriptive messages carry enough method, media type, status, and control metadata to be interpreted.",
        "HATEOAS means representations provide hypermedia controls for currently available state transitions.",
        "The uniform interface improves visibility and independent evolution but sacrifices some application-specific efficiency.",
      ],
      interview: [
        "Uniform interface means that REST components use one shared interaction model instead of inventing a different protocol for every service. It has four parts: resource identification, manipulation through representations, self-descriptive messages, and hypermedia as the engine of application state.",
        "Resource identification means a URI such as `/orders/42` identifies the order independently of whether it is represented as JSON or XML. Manipulation through representations means the client can send a complete representation or a defined patch to request a state change without knowing the server's database model.",
        "Self-descriptive messages use the method, target, status, headers, and media type to explain how to read the exchange. For example, `PATCH` with `Content-Type: application/merge-patch+json` tells the server that the body contains a JSON Merge Patch rather than a full replacement.",
        "HATEOAS means a response can include links or controls for actions that are currently available. A draft order may link to confirmation, while a cancelled order does not. This reduces hard-coded route knowledge in clients, but it requires well-designed media types and relation names. The shared interface improves consistency, although a custom RPC can sometimes be more direct for one operation.",
      ],
      deepTitle: "How the four uniform-interface parts work together",
      deep: [
        "Resource identity remains stable across representations. `/orders/42` can return JSON to an application and HTML to a browser without becoming two resources. Content negotiation and metadata identify the chosen representation. This separation lets the resource outlive one serialization format.",
        "Manipulation through representations does not mean the server exposes its database row. The representation is a contract. PUT can convey intended target state, PATCH conveys changes under a patch media type, and POST submits content for resource-specific processing. Authorization and domain rules still decide whether a requested transition is allowed.",
        "Self-description makes messages visible to generic components. Caches understand freshness fields, clients understand statuses, and converters understand media types. Application semantics still need registered or documented relation types and media contracts; a JSON object with undocumented magic fields is not self-explanatory merely because humans can read it.",
        "Hypermedia moves state-transition knowledge into representations. A client knows what relation it wants, such as `confirm`, but obtains the current target from the server. This reduces coupling to route templates and lets available actions reflect resource state and permissions. The cost is richer media design and clients that understand relation semantics.",
      ],
      visual: {
        type: "concept_map",
        title: "Four parts form one interface",
        content: fenced("mermaid", [
          "flowchart TD",
          "  U[Uniform interface] --> I[Identify resources<br/>stable URI]",
          "  U --> R[Manipulate through representations<br/>state + change documents]",
          "  U --> S[Self-descriptive messages<br/>method + metadata + media type]",
          "  U --> H[Hypermedia controls<br/>available next transitions]",
          "  I --> D[Client decoupled from implementation]",
          "  R --> D",
          "  S --> D",
          "  H --> D",
        ]),
      },
      example: {
        title: "A representation includes current transition controls",
        language: "http",
        lines: [
          "HTTP/1.1 200 OK",
          "Content-Type: application/hal+json",
          "",
          "{",
          "  \"id\": 42,",
          "  \"status\": \"draft\",",
          "  \"_links\": {",
          "    \"self\": {\"href\": \"/orders/42\"},",
          "    \"confirm\": {\"href\": \"/orders/42/confirmation\"},",
          "    \"customer\": {\"href\": \"/customers/7\"}",
          "  }",
          "}",
        ],
        note: "The media type and relation names give the link structure meaning. A client selects the `confirm` relation when available rather than assuming every order has a hard-coded confirmation URI.",
      },
      followups: [
        "Why is HATEOAS part of uniform interface rather than a separate optional constraint?",
        "How can one resource have several representations?",
        "What information makes an HTTP message self-descriptive?",
      ],
    },
  },
  "rest-vs-soap": {
    "rest-vs-soap": {
      id: "rest-vs-soap-001",
      question: "What is the difference between REST and SOAP?",
      direct: "REST is an architectural style for networked systems built around constraints such as stateless interaction, cacheability, layered components, and a uniform resource interface. SOAP is an XML-based messaging framework with an Envelope, optional Header, Body, processing model, and transport bindings. Neither choice automatically provides security, transactions, performance, or reliability.",
      minutes: 10,
      quick: [
        "REST is an architectural style; SOAP is a standardized XML messaging framework.",
        "REST interactions center on resources, representations, and a uniform interface; SOAP messages use an Envelope, optional Header, and Body.",
        "REST can use JSON, XML, or other media types; SOAP's message format is XML.",
        "SOAP can use HTTP and other defined bindings; it is not simply an HTTP-only alternative to REST.",
        "WSDL and WS-* specifications can add contracts and capabilities, but SOAP alone does not guarantee ACID transactions, security, or reliability.",
      ],
      interview: [
        "REST and SOAP are different kinds of API style. REST is an architectural style based on resources and constraints such as statelessness, cacheability, and a uniform interface. SOAP is an XML messaging framework with a defined envelope and rules for processing messages.",
        "A REST API commonly uses HTTP methods, status codes, headers, and resource addresses. JSON is popular, but REST can also use XML, HTML, or another representation. A SOAP message always uses XML and contains an `Envelope`, an optional `Header`, and a `Body`. WSDL is often used to describe SOAP operations and message shapes.",
        "For example, a REST client may call `GET /customers/42` and receive a JSON customer representation. A SOAP client may send a `GetCustomer` operation inside an XML envelope and receive a SOAP response. REST centres the interface on resources; SOAP centres it on structured messages and service operations.",
        "SOAP environments can add standards such as WS-Security or reliable messaging when both sides support them. SOAP alone does not automatically provide security, transactions, or reliability, and REST does not automatically provide speed or simplicity. The better choice depends on the required contract, client ecosystem, tooling, and operational needs.",
      ],
      deepTitle: "REST and SOAP differ by more than JSON and XML",
      deep: [
        "The shallow comparison says REST uses JSON and SOAP uses XML. Only the SOAP half is inherent. REST constrains component behavior and leaves representation formats open. A JSON RPC endpoint can violate REST's uniform-interface or hypermedia constraints, while an XML representation can participate in a REST architecture.",
        "SOAP defines how an envelope is processed, how header blocks target roles, how faults are represented, and how bindings connect the message to a transport. WSDL can describe operations, messages, and endpoints for tooling and generated clients. Additional WS-* specifications are separate layers with their own interoperability and configuration costs.",
        "HTTP semantics remain valuable when REST uses HTTP directly: methods communicate safety and idempotency, validators support conditional requests, and caches can reuse responses under explicit rules. A SOAP-over-HTTP service can use HTTP as a transport binding while expressing operation outcome primarily through the SOAP message model.",
        "The trade-off depends on the environment. A resource-oriented public API may benefit from HTTP tooling and evolvable representations. An established integration environment may value a formal SOAP/WSDL toolchain or particular WS-* agreement. In either case, authentication, authorization, reliability, and transaction boundaries must be designed rather than inferred from the label.",
      ],
      visual: {
        type: "comparison_table",
        title: "REST style and SOAP messaging answer different design questions",
        content: joinLines([
          "| Dimension | REST | SOAP |",
          "|---|---|---|",
          "| Kind | Architectural style | XML messaging framework |",
          "| Interaction center | Resources and representations | Messages and service operations |",
          "| Wire format | Any suitable media type | SOAP XML Envelope |",
          "| Common contract tools | HTTP/media-type/API descriptions | WSDL plus schema tooling |",
          "| Extra capabilities | Designed through HTTP and application contracts | May use separate WS-* specifications |",
        ]),
      },
      example: {
        title: "A minimal SOAP 1.2 request envelope",
        language: "xml",
        lines: [
          "<?xml version=\"1.0\" encoding=\"UTF-8\"?>",
          "<env:Envelope xmlns:env=\"http://www.w3.org/2003/05/soap-envelope\"",
          "              xmlns:c=\"https://example.com/customer\">",
          "  <env:Body>",
          "    <c:GetCustomer>",
          "      <c:id>42</c:id>",
          "    </c:GetCustomer>",
          "  </env:Body>",
          "</env:Envelope>",
        ],
        note: "The envelope and body are SOAP structures; the application namespace defines `GetCustomer`. Security, reliable delivery, and transaction behavior require additional contracts and implementation, not merely this envelope.",
      },
      followups: [
        "Can a REST API use XML instead of JSON?",
        "What are the main parts of a SOAP message?",
        "Does SOAP alone guarantee transactions or reliable delivery?",
      ],
    },
    "graphql-vs-rest": {
      id: "rest-vs-soap-002",
      question: "What is GraphQL and how does it compare to REST?",
      direct: "GraphQL is a typed query language and execution model in which a client selects fields from a schema and receives a response shaped like that selection. REST organizes interaction around resources and uniform representations. GraphQL offers flexible graph traversal; REST aligns naturally with HTTP identifiers, statuses, caching, and intermediaries. Neither is universally better.",
      minutes: 10,
      quick: [
        "GraphQL exposes a typed schema and validates operations before executing selected fields.",
        "A GraphQL response mirrors the client's field selection and can combine related data in one operation.",
        "REST exposes resource representations at identifiers and uses uniform HTTP semantics across them.",
        "GraphQL needs field-level cost, authorization, batching, and cache design; client flexibility is not free.",
        "REST may require several requests or tailored representations, but generic HTTP caching and observability are straightforward.",
      ],
      interview: [
        "GraphQL is a query language and server execution model built around a typed schema. A client asks for named fields and related objects, and the response follows the shape of that selection. REST instead exposes resources and representations through a uniform interface, usually using standard HTTP methods, statuses, headers, and cache rules.",
        "Suppose a product screen needs the product name, seller name, and three reviews. A GraphQL query can request exactly that connected view in one operation. A REST API may return an order-shaped representation with embedded summaries, provide links to related resources, or use several requests. Either style can be designed well.",
        "GraphQL gives clients flexibility, but the server must control query depth or cost, avoid N+1 resolver queries, and authorize nested fields. Caching often needs client or application support rather than relying only on a resource URI. A response may also contain both partial `data` and `errors`, so monitoring must look beyond the HTTP status code.",
        "GraphQL fits well when several clients need different views over connected data. REST fits well when stable resource contracts, straightforward HTTP caching, and broad tooling are more important. Some systems use both at different boundaries; the right choice depends on data shape, clients, security, and real workload.",
      ],
      deepTitle: "GraphQL gives clients flexibility and gives servers more work",
      deep: [
        "A GraphQL schema defines object types, fields, arguments, and operation entry points. The type system allows an operation to be validated before execution and gives tools a basis for discovery and code generation. The response's `data` shape follows the query, while an `errors` collection can describe partial execution problems.",
        "REST constrains interaction rather than prescribing one schema language. Resources have identifiers, representations can link to related resources, and HTTP gives common semantics to methods and metadata. A server can create coarse-grained REST representations for a screen; REST does not require a client to request every database object separately.",
        "Graph traversal can hide expensive execution. Fetching orders, then items, then products per item can cause repeated database calls unless resolvers batch and cache within the request. Servers should limit depth, aliases, list sizes, or calculated cost and enforce authorization even when a field appears deep inside a query.",
        "Caching differs rather than disappears. REST representations can use URI-based shared caches, freshness, and validators. GraphQL clients often normalize objects by identity, while persisted operations, GET for suitable queries, or gateway-specific caching can add other strategies. Teams should choose based on data shape and operational behavior, then test real workloads.",
      ],
      visual: {
        type: "comparison_table",
        title: "Where selection and contract decisions live",
        content: joinLines([
          "| Concern | GraphQL | REST |",
          "|---|---|---|",
          "| Public model | Typed graph schema | Resources + representation contracts |",
          "| Response fields | Selected by each operation | Chosen by representation design |",
          "| Related data | Nested selection | Links, embedding, or more requests |",
          "| Common risk | Expensive queries and resolver N+1 | Too many endpoints or over/under-shaped resources |",
          "| Caching | Often client/application-aware | Natural fit for HTTP cache metadata |",
        ]),
      },
      example: {
        title: "Select one connected view from a typed schema",
        language: "graphql",
        lines: [
          "query ProductCard($id: ID!) {",
          "  product(id: $id) {",
          "    id",
          "    name",
          "    seller { name }",
          "    reviews(first: 3) {",
          "      rating",
          "      summary",
          "    }",
          "  }",
          "}",
        ],
        note: "The schema must define these fields and arguments, and the server must authorize and execute each selected part efficiently. The query's convenience does not guarantee one database query.",
      },
      followups: [
        "How can GraphQL resolvers create an N+1 query problem?",
        "Can REST return an embedded or client-specific representation?",
        "Why can a GraphQL response contain both `data` and `errors`?",
      ],
    },
    "choosing-the-right-api-technology": {
      id: "rest-vs-soap-005",
      question: "How do you choose between REST, GraphQL, gRPC, and WebSocket for your API?",
      direct: "Choose from the communication shape and client constraints: REST for resource-oriented request/response with strong HTTP interoperability; GraphQL for client-selected views over connected data; gRPC for typed unary or streaming RPC between controlled clients and services; WebSocket for a long-lived two-way message channel. Measure real workloads and allow complementary technologies where boundaries differ.",
      minutes: 12,
      quick: [
        "Begin with interaction shape: resource request/response, graph query, typed RPC/stream, or ongoing two-way messages.",
        "REST fits broad HTTP clients, stable resources, cacheable reads, and intermediary-friendly APIs.",
        "GraphQL fits diverse clients that need different connected views, with query-cost and resolver controls.",
        "gRPC fits controlled service-to-service or native clients needing generated typed contracts and unary or streaming calls.",
        "WebSocket fits persistent bidirectional messaging; SSE, long polling, webhooks, or streaming HTTP may fit one-way or simpler updates.",
      ],
      interview: [
        "Choose an API technology from the way the systems need to communicate. REST works well for resource-based request and response APIs that benefit from normal HTTP methods, status codes, links, conditional requests, caches, and broad client support.",
        "GraphQL fits clients that need different views over connected data. Its schema and field selection can reduce screen-specific endpoints, but the server must limit expensive queries, batch data loading, authorize nested fields, and plan its caching and monitoring.",
        "gRPC defines typed service methods and supports normal calls plus client, server, and two-way streams. It often fits controlled service-to-service or native clients where generated code and coordinated contracts are acceptable. Browser, proxy, debugging, and public compatibility needs must be checked in the real environment.",
        "WebSocket keeps a two-way message channel open, which can suit chat, collaborative editing, or multiplayer updates. It is not required for every live feature. Server-sent events work for a server-to-browser stream, webhooks notify another server, and simple polling may be enough for infrequent updates.",
        "An e-commerce product might use REST for partners, GraphQL for changing mobile screens, gRPC between inventory services, and WebSocket only for live support chat. Each boundary still needs authentication, versioning, timeouts, error handling, backpressure, and observability. A small combination can be better than forcing one technology everywhere.",
      ],
      deepTitle: "A practical API technology decision",
      deep: [
        "Direction asks who can initiate data. Ordinary REST and GraphQL operations are request/response. gRPC also supports streams governed by a typed method contract. WebSocket provides a general two-way channel, so the application must define message envelopes, correlation, ordering, error behavior, and resumption above it.",
        "Duration asks whether interaction is short-lived or ongoing. A cacheable product read should not require a permanent socket. A rapid collaborative session should not issue a fresh request for every tiny update if a managed stream better fits. Server-sent events are a useful middle ground when only the server needs to push to a browser.",
        "Ownership asks how much the producer controls clients and infrastructure. Generated gRPC clients fit coordinated services better than unknown browser and partner ecosystems. REST's HTTP vocabulary and representations are widely accessible. GraphQL gives clients query flexibility but makes the server responsible for defending a larger execution surface.",
        "Operational fit is decisive. Evaluate gateway and load-balancer support, connection limits, timeouts, observability, schema compatibility, caching, retries, and team skill. Then benchmark representative payloads and concurrency. Protocol overhead is only one part of end-to-end latency; resolver design, database access, and network placement often dominate.",
      ],
      visual: {
        type: "comparison_table",
        title: "Match the technology to the dominant interaction",
        content: joinLines([
          "| Dominant need | Strong candidate | Check before choosing |",
          "|---|---|---|",
          "| Resource-oriented public request/response | REST | Representation design, caching, compatibility |",
          "| Client-selected connected data | GraphQL | Query cost, batching, field authorization |",
          "| Typed controlled RPC and streams | gRPC | Client/proxy support, contract rollout, observability |",
          "| Persistent two-way messages | WebSocket | Connection lifecycle, backpressure, reconnect/resume |",
          "| Server-to-browser event stream only | SSE may be simpler | Delivery semantics and proxy timeouts |",
        ]),
      },
      example: {
        title: "One product can use different boundaries deliberately",
        language: "text",
        lines: [
          "Public partner catalog     -> REST resources with ETags",
          "Mobile home-screen data    -> GraphQL selected view",
          "Inventory service command  -> gRPC unary RPC",
          "Inventory update stream    -> gRPC server stream",
          "Live support conversation  -> WebSocket messages",
          "Order-status browser feed  -> Server-Sent Events",
        ],
        note: "This is not a required architecture. It shows how interaction shape can justify different boundaries without claiming one protocol is universally faster or the only way to deliver live updates.",
      },
      followups: [
        "When is server-sent events simpler than WebSocket?",
        "What operational risks come with flexible GraphQL queries?",
        "Why should gRPC performance be measured instead of quoted as a fixed multiplier?",
      ],
    },
  },
};

// URI design is taught from the resource model outward. The compact method and
// route support makes the noun/method relationship visible without repeating
// the larger resource map that already belongs to Deep Dive.
Object.assign(topics["api-design-basics"]["rest-uri-design-principles"], {
  answerSize: "standard",
  lastUpdated: "2026-09-08",
  interviewBeats: [
    {
      cue: "Separate the resource address from the requested operation",
      stage: "Name resources, not actions",
      spokenText:
        "A good REST URI identifies a resource, while the HTTP method states the requested action. `/orders` identifies the order collection and `/orders/42` identifies one order. The client then uses `GET`, `POST`, or `DELETE` with that address. This is why `GET /orders/42` is clearer than `GET /getOrder/42`: the method already carries the verb.",
    },
    {
      cue: "Apply one predictable collection and member pattern",
      stage: "Collections and members",
      spokenText:
        "Use one consistent pattern for collections and individual resources. `GET /orders` reads the collection, `POST /orders` submits a new order to it, `GET /orders/42` reads one member, and `DELETE /orders/42` requests removal of that member's URI association. The same resource names remain useful across operations, so clients do not have to learn a new action-shaped path for each controller method.",
      support: {
        type: "comparison",
        title: "Read each route as method plus resource",
        items: [
          {
            label: "GET",
            value: "/orders",
            detail: "Retrieve the order collection.",
            tone: "blue",
          },
          {
            label: "POST",
            value: "/orders",
            detail: "Submit content to the collection, commonly to create a member.",
            tone: "green",
          },
          {
            label: "GET",
            value: "/orders/42",
            detail: "Retrieve the order identified by 42.",
            tone: "neutral",
          },
          {
            label: "DELETE",
            value: "/orders/42",
            detail: "Request removal of that URI's current association.",
            tone: "orange",
          },
        ],
      },
    },
    {
      cue: "Use nesting only when the parent changes the meaning",
      stage: "Keep relationships shallow",
      spokenText:
        "Nesting is useful when the parent supplies real context. `/orders/42/items` clearly means the item collection belonging to order 42. If item 9 also has an independent life, give it a direct address such as `/items/9`. Paths such as `/customers/7/orders/42/items/9/notes` repeat relationships, couple clients to the current model, and make route changes harder.",
    },
    {
      cue: "Keep collection controls in a documented query contract",
      stage: "Filtered and ordered views",
      spokenText:
        "Collection controls usually fit the query component: `/orders?status=paid&sort=-createdAt&limit=20` identifies a paid, newest-first view of orders. The query string is still part of the target URI; it is not merely optional decoration. Document allowed filters, sort fields, defaults, and limits so two clients interpret the same URI in the same way.",
    },
    {
      cue: "Close with the stability and convention boundary",
      stage: "Stable public identifiers",
      spokenText:
        "Public URIs should remain stable when Java class names, controller methods, or database tables change. Avoid exposing names such as `/tbl_orders` or file extensions that turn implementation details into a client contract. Plural nouns, lowercase paths, and hyphens are helpful conventions, not rules imposed by REST. The real goal is a clear resource model and one naming style that stays predictable across the API.",
      recallRule:
        "Name the resource, let the method express the operation, nest only for meaningful context, and keep public identifiers independent of implementation details.",
    },
  ],
});

// Versioning is a compatibility lifecycle, not just a choice of URL syntax.
// The Interview trace shows that lifecycle; the Deep Dive retains the more
// detailed representation, adapter, caching, and retirement discussion.
Object.assign(topics["api-design-basics"]["rest-api-versioning-strategies"], {
  direct:
    "API versioning is a compatibility policy for changes that existing clients cannot safely consume. Common version signals are a path segment, query parameter, request header, or versioned media type. The important work is defining what counts as breaking, supporting overlapping versions, publishing migration guidance, and retiring versions deliberately.",
  quick: [
    "Prefer backward-compatible evolution; introduce a version only for a genuinely breaking contract change.",
    "A path such as `/v2/orders` is visible and easy to route, but version identity spreads into every URI.",
    "A query parameter, custom header, or media-type parameter can keep the base path stable, but the selected version is easier to omit or overlook.",
    "Run old and new contracts in parallel long enough for clients to migrate, with clear deprecation dates.",
    "Version the public representation and behavior, not every internal code or database change.",
  ],
  answerSize: "standard",
  lastUpdated: "2026-09-08",
  interviewBeats: [
    {
      cue: "Define versioning as protection for an existing public contract",
      stage: "Protect existing clients",
      spokenText:
        "API versioning gives existing clients a stable contract when the API must make an incompatible change. It is not a label for every deployment. Internal refactoring, an index, or a bug fix normally stays in the same version. Renaming or removing a response field, changing its meaning or type, or changing an accepted input can require a new version because deployed clients may still depend on the old behavior.",
    },
    {
      cue: "Distinguish compatible growth from a breaking contract change",
      stage: "Version only real breaks",
      spokenText:
        "A compatible change can remain in the current version. For example, a new optional response field is usually safe when the published contract allows clients to ignore unknown fields. Replacing `fullName` with required `givenName` and `familyName` is different: old clients look for the removed field and new clients expect fields the old response never supplied. That change needs a compatibility plan, often a new version.",
    },
    {
      cue: "Compare the places where a client can select a version",
      stage: "Choose one version signal",
      spokenText:
        "Path versioning, such as `/v2/orders/42`, is visible in links, logs, and routing, but creates a separate URI space. A query such as `/orders/42?api-version=2` keeps the base path familiar but is easy to omit. A custom header or versioned `Accept` media type keeps the target path stable, although browser testing and documentation become less obvious, and caches must distinguish header-selected representations correctly.",
    },
    {
      cue: "Show how clients move without a flag-day release",
      stage: "Overlap, migrate, retire",
      spokenText:
        "Version 1 and version 2 should normally run together for a published migration period. The team releases examples and a change guide, measures which clients still use version 1, announces deprecation and retirement dates, and helps important consumers move. Only after that support window should version 1 be removed. This avoids forcing every mobile app or external integration to upgrade on the server's deployment day.",
      support: {
        type: "trace",
        title: "A version has a managed lifecycle",
        items: [
          {
            label: "Stable v1",
            value: "existing contract",
            detail: "Compatible additions continue without a new version.",
            tone: "blue",
          },
          {
            label: "Release v2",
            value: "breaking contract",
            detail: "Publish the exact differences and migration examples.",
            tone: "green",
          },
          {
            label: "Overlap",
            value: "v1 + v2",
            detail: "Measure use and give consumers time to migrate.",
            tone: "neutral",
          },
          {
            label: "Retire v1",
            value: "after notice",
            detail: "Remove it only after the promised support period.",
            tone: "orange",
          },
        ],
      },
    },
    {
      cue: "Balance migration safety against long-term maintenance",
      stage: "Every live version has a cost",
      spokenText:
        "The syntax is less important than consistency and lifecycle ownership. Each supported version needs documentation, security fixes, contract tests, monitoring, and sometimes a separate boundary adapter. Too many versions slow delivery, while retiring one too quickly breaks consumers. I would keep business logic shared where possible, isolate version-specific request and response mapping, and create a new version only when compatibility cannot be preserved clearly.",
      recallRule:
        "Version breaking public behavior, choose one clear signal, overlap old and new contracts, and retire the old version through a published migration plan.",
    },
  ],
  deep: [
    "A deployed service can change many times without changing its public version. Bug fixes, indexes, caching, and internal refactoring are implementation changes. A public version changes when the observable contract cannot remain compatible: accepted inputs, response meaning, status codes, authentication expectations, or important timing and ordering guarantees.",
    "Path versioning creates distinct URI spaces and is easy for infrastructure to route. A query parameter selects a version within a familiar path. Custom headers and media-type parameters select behavior or a representation at a stable path. When a response varies on request headers, cache behavior must account for that selection; a server can use `Vary` to name the request fields that influenced the representation.",
    "Supporting two versions does not require duplicating the whole application. A shared domain service can sit behind separate request and response adapters. That keeps version-specific translation at the boundary while business rules remain common. Contract tests should prove the old adapter continues to behave as published.",
    "Retirement is part of design. Documentation should state supported versions, migration differences, and a date or policy for removal. Traffic metrics reveal active consumers, but silent traffic does not replace direct communication for important clients. Long-lived versions cost engineering effort, so a team should balance migration safety against indefinite maintenance.",
  ],
  visual: {
    type: "comparison_table",
    title: "Where a client declares the requested version",
    content: joinLines([
      "| Strategy | Example | Strength | Cost |",
      "|---|---|---|---|",
      "| URI path | `/v2/orders/42` | Visible and easy to route | Versions every URI |",
      "| Query parameter | `/orders/42?api-version=2` | Easy to call with ordinary tools | Version is easy to omit |",
      "| Custom header | `X-API-Version: 2` | Stable resource path | Less visible and non-standard |",
      "| Media type | `Accept: application/vnd.example.order+json;v=2` | Ties version to representation | More complex tooling and caching |",
    ]),
  },
});

// Pagination is explained as an ordered window rather than a collection of
// parameter names. One short trace makes the offset-shift problem concrete;
// the Deep Dive keeps the full comparison and HTTP continuation example.
Object.assign(topics["api-design-basics"]["rest-api-pagination-design"], {
  quick: [
    "Always define a stable order with a unique tie-breaker before paginating.",
    "Offset pagination is simple and jump-friendly, but inserts and deletes can shift later pages.",
    "Cursor pagination continues after an ordered position and is usually steadier for changing feeds.",
    "Cap page size, and bind a cursor to the same route, filters, ordering, and caller scope; a cursor is not authorization.",
    "Return navigation information such as a `next` link or opaque server-issued cursor; exact totals are optional and may be expensive.",
  ],
  answerSize: "standard",
  lastUpdated: "2026-09-08",
  interviewBeats: [
    {
      cue: "Define pagination as a bounded view of one ordered collection",
      stage: "A page needs an order",
      spokenText:
        "Pagination divides a large collection into bounded responses and tells the client how to continue. The first design decision is the order, not whether the parameter is named `page` or `cursor`. Without a stable order, page boundaries have no reliable meaning. If several orders share `createdAt`, add a unique tie-breaker such as `id`, for example `ORDER BY created_at DESC, id DESC`.",
    },
    {
      cue: "Explain the simple distance-based option and its boundary",
      stage: "Offset counts from the front",
      spokenText:
        "Offset pagination uses a distance such as `/orders?offset=40&limit=20` or a page number translated to that distance. It is easy to understand and supports a direct jump to a later page, so it works well for smaller or mostly stable admin lists. Large offsets may be expensive, and inserts or deletes before the current position can shift the boundary between two requests.",
      support: {
        type: "trace",
        title: "An insert can move an offset boundary",
        items: [
          {
            label: "First page",
            value: "105, 104",
            detail: "Read two rows using `ORDER BY id DESC`.",
            tone: "blue",
          },
          {
            label: "New row",
            value: "106 arrives",
            detail: "The front of the collection moves before page two is requested.",
            tone: "orange",
          },
          {
            label: "OFFSET 2",
            value: "104, 103",
            detail: "Row 104 appears again because the boundary shifted.",
            tone: "neutral",
          },
          {
            label: "after id 104",
            value: "103, 102",
            detail: "A cursor continues after the last position already returned.",
            tone: "green",
          },
        ],
      },
    },
    {
      cue: "Explain how a cursor represents a continuation position",
      stage: "Cursor continues after a row",
      spokenText:
        "Cursor pagination returns a server-issued token for the next position. With newest-first ordering, the token can represent the last `(createdAt, id)` pair, allowing the next query to continue after it rather than recounting from the front. This is usually steadier for a high-write feed. It does not naturally jump to page 37, and changes to a row's sort values can still affect what a client sees.",
    },
    {
      cue: "Define the response and validation contract around continuation",
      stage: "Return enough to continue",
      spokenText:
        "A page response should contain the items, the applied limit, and a `next` link or opaque cursor when more results may exist. The cursor must be used with the same collection, filters, and ordering that created it; the server should reject a mismatch. Page size needs a documented default and maximum. The server may return fewer items than requested, so item count alone should not be the end-of-list signal.",
    },
    {
      cue: "Close with the consistency and product trade-offs",
      stage: "Choose for the collection",
      spokenText:
        "Offset is a good fit when page numbers and random jumps matter more than changes between requests. Cursor pagination is usually a better fit for a large, frequently updated stream. Neither design creates a frozen snapshot automatically, and an exact total can be slow or become stale while the client pages. The API should document ordering, continuation, expiry, total-count behavior, and what concurrent changes can do.",
      recallRule:
        "Choose a deterministic order first; use offset for simple page jumps and a cursor for stable continuation through changing data.",
    },
  ],
  deep: [
    "Without deterministic ordering, page boundaries have no reliable meaning. A database is free to return equal-ranked rows in different orders. A unique final sort key creates a total order and lets the next request resume from an exact position.",
    "Offset expresses distance from the beginning. If a new row is inserted before that distance after page one is read, a row from page one can appear again on page two. If a row is removed, another row can be skipped. A transaction-level snapshot can avoid movement but is rarely kept across independent web requests.",
    "A cursor expresses position rather than distance. It can bind the last sort values, direction, relevant filters, caller scope, and an expiry marker. Expose it as an opaque server-issued handle or an integrity-protected token rather than readable database state. A cursor helps continuation; it never replaces authorization checks for the underlying resources.",
    "Pagination metadata should help the client continue without rebuilding server rules. A next link is especially useful because it packages the route and controls. Exact totals, last-page numbers, and random jumps are product choices rather than mandatory REST fields, and they can conflict with efficient cursor designs.",
  ],
  example: {
    title: "Return an opaque continuation token",
    language: "http",
    lines: [
      "GET /orders?status=paid&limit=2&after=pg_7Qm2vK9x HTTP/1.1",
      "Host: api.example.com",
      "Accept: application/json",
      "",
      "HTTP/1.1 200 OK",
      "Content-Type: application/json",
      "",
      "{\"items\":[{\"id\":41},{\"id\":39}],\"limit\":2,\"nextCursor\":\"pg_K4p8sT2n\"}",
    ],
    note: "The opaque cursor is a server-issued continuation handle. The server validates it against the same collection, filter, order, and caller context, then performs normal authorization for every returned resource.",
  },
});

// Error responses have a public contract and a private diagnostic boundary.
// The Interview support makes that boundary visible while Deep Dive keeps the
// complete Problem Details field map and HTTP response.
Object.assign(topics["api-design-basics"]["api-error-response-design"], {
  answerSize: "standard",
  lastUpdated: "2026-09-08",
  interviewBeats: [
    {
      cue: "Give generic HTTP software and API clients different levels of detail",
      stage: "Status gives broad meaning",
      spokenText:
        "A useful API error has two levels. The HTTP status gives the broad protocol result, such as `400 Bad Request`, `404 Not Found`, or `409 Conflict`, so clients and gateways can react without knowing the application. The response body then explains the application-specific problem. Returning `200 OK` with an error flag hides the real outcome from generic HTTP software and makes every client invent special handling.",
    },
    {
      cue: "Explain the stable and occurrence-specific parts of Problem Details",
      stage: "Problem details add meaning",
      spokenText:
        "RFC 9457 defines `application/problem+json` for machine-readable error details. Its `type` URI identifies the problem class and should remain stable. `title` is a short summary of that class, `detail` explains this occurrence in human language, and `instance` identifies this particular occurrence. If the JSON also carries `status`, it must match the actual HTTP status; clients should still trust the HTTP response status for protocol handling.",
    },
    {
      cue: "Show how a client can locate and understand invalid input",
      stage: "Validation points to fields",
      spokenText:
        "Validation often needs a documented extension because several fields can fail together. A `422 Unprocessable Content` response might use type `/problems/invalid-order` and add `errors: [{\"field\": \"quantity\", \"code\": \"positive\"}]`. The stable code lets a form find the field and choose a message without parsing the English `detail`. Field paths and codes are part of the API contract, so their meaning and shape must be documented.",
    },
    {
      cue: "Separate safe client guidance from sensitive implementation evidence",
      stage: "Keep internals in logs",
      spokenText:
        "The public response should contain only information the caller can safely use. Stack traces, SQL text, secrets, internal host names, and framework exception classes belong in protected server logs. Return an occurrence or correlation identifier such as `req-83f9` so support can connect the safe response to the detailed log record without exposing the record itself.",
      support: {
        type: "comparison",
        title: "Expose guidance, retain diagnostics",
        items: [
          {
            label: "API response",
            value: "status + stable type + safe detail",
            detail: "Helps the client recognize the failure and correct the request.",
            tone: "blue",
          },
          {
            label: "Protected log",
            value: "exception + internal context",
            detail: "Helps operators diagnose the occurrence through its correlation ID.",
            tone: "orange",
          },
        ],
      },
    },
    {
      cue: "Close with one consistent mapping and evolution policy",
      stage: "One contract across handlers",
      spokenText:
        "Every endpoint should use the same documented error shape and map known failures deliberately. In Spring, `@RestControllerAdvice` can centralize that mapping and `ProblemDetail` can represent the public body, but the framework cannot choose the correct status or safe detail for the business rule. Contract tests should verify the status, media type, stable problem type, extension fields, and absence of sensitive data. That consistency is what creates good developer experience.",
      recallRule:
        "Use the HTTP status for the broad result, a stable problem type for machine logic, safe occurrence details for people, and protected logs for internals.",
    },
  ],
});

// Core idempotency is taught as an effect guarantee rather than response
// equality. The small method comparison complements Deep Dive's lost-response
// sequence and avoids duplicating its full retry flow.
Object.assign(topics.idempotency["idempotency-in-rest-apis"], {
  answerSize: "standard",
  lastUpdated: "2026-09-08",
  interviewBeats: [
    {
      cue: "Define the guarantee in terms of the requested server effect",
      stage: "Same intended effect",
      spokenText:
        "Idempotency means that several identical requests have the same intended effect on the server as one request. The word intended matters: it refers to the state change the client asked for, not every internal action taken while processing the request. Repeating `PUT /profiles/42` with the same representation should leave profile 42 in the same requested state rather than applying another change each time.",
    },
    {
      cue: "Connect the standard method guarantee to concrete operations",
      stage: "Methods set retry defaults",
      spokenText:
        "HTTP defines safe methods, `PUT`, and `DELETE` as idempotent. `PUT /profiles/42` requests replacement at a known target, and repeating `DELETE /subscriptions/42` continues to leave that URI association removed. `POST` and `PATCH` have no general idempotency guarantee. A particular endpoint may offer a stronger rule, but clients should not assume one unless its contract says so.",
      support: {
        type: "comparison",
        title: "Method semantics provide the default",
        items: [
          {
            label: "GET or HEAD",
            value: "safe and idempotent",
            detail: "The client asks to observe, not to change application state.",
            tone: "blue",
          },
          {
            label: "PUT or DELETE",
            value: "unsafe and idempotent",
            detail: "The client requests a change with a repeatable intended effect.",
            tone: "green",
          },
          {
            label: "POST or PATCH",
            value: "no general guarantee",
            detail: "The endpoint must explicitly define any stronger retry behavior.",
            tone: "orange",
          },
        ],
      },
    },
    {
      cue: "Separate the final effect from a byte-for-byte response replay",
      stage: "Responses may still differ",
      spokenText:
        "Idempotency does not require identical responses. The first delete can return `204 No Content`, while a later identical delete returns `404 Not Found`; after both, the target remains absent. A new `Date`, request ID, access log, or metric also does not break the guarantee because the client did not request those side effects. What must not repeat is the requested business effect.",
    },
    {
      cue: "Use a lost response to show why the property matters",
      stage: "Lost replies make retries hard",
      spokenText:
        "Suppose a payment is accepted but the connection closes before the client reads the response. The client knows only that the result is uncertain. Repeating a non-idempotent `POST /payments` might create a second charge, while an idempotent operation can be retried without asking for a second intended effect. This is why idempotency matters most at network and process-failure boundaries.",
    },
    {
      cue: "Explain what an application-level operation key must and must not do",
      stage: "A key identifies one operation",
      spokenText:
        "A POST can add idempotency by accepting one operation key, binding it to the authenticated caller and request fingerprint, reserving it atomically, and storing the completed outcome for replay. The design also needs rules for a key that is in progress, reused with different input, failed, or expired. This protects one logical retry; it does not replace authentication, transactions, authorization, or optimistic locking for competing updates.",
      recallRule:
        "Idempotency compares requested effects, not response bytes: one logical operation may be repeated without creating another intended business change.",
    },
  ],
});

// Safety and idempotency are two independent questions. The compact support
// supplies that mental model while the Deep Dive keeps the full method matrix
// and destructive-GET example.
Object.assign(topics.idempotency["idempotency-vs-safety"], {
  answerSize: "standard",
  lastUpdated: "2026-09-08",
  interviewBeats: [
    {
      cue: "Define the two properties with the separate questions they answer",
      stage: "Two separate questions",
      spokenText:
        "Safety and idempotency describe different parts of an HTTP method's contract. Safety asks whether the client requested a change to application state. Idempotency asks whether repeating the identical request changes the intended effect after its first application. A method can therefore be idempotent without being safe: it can deliberately change state once and still have a repeatable final effect.",
      support: {
        type: "comparison",
        title: "Do not merge the two tests",
        items: [
          {
            label: "Safety",
            value: "Did the client request a change?",
            detail: "Safe semantics are essentially read-only from the caller's point of view.",
            tone: "blue",
          },
          {
            label: "Idempotency",
            value: "Does repeating it add another intended effect?",
            detail: "An idempotent request can change state, but repeats do not ask for more of that change.",
            tone: "green",
          },
        ],
      },
    },
    {
      cue: "Explain safe intent without pretending the server performs no writes",
      stage: "Safe means read-only intent",
      spokenText:
        "`GET`, `HEAD`, `OPTIONS`, and `TRACE` are safe because their defined semantics are essentially read-only. A server may still append an access log, record a metric, or fill a cache while handling a GET. Those incidental effects do not make the method unsafe because the client did not request them. A route such as `GET /orders/42?cancel=true` is different: cancellation is the requested effect and violates GET's safety contract.",
    },
    {
      cue: "Explain repeatability with state-changing method examples",
      stage: "Idempotent means repeatable",
      spokenText:
        "`PUT` and `DELETE` are idempotent but not safe. Repeating the same `PUT /profiles/42` representation asks for the same replacement state. Repeating `DELETE /files/42` keeps the target association absent. Both operations intentionally change server state, so neither is safe, but the second identical request does not ask for another distinct final effect.",
    },
    {
      cue: "Classify method defaults without turning them into implementation magic",
      stage: "Method groups differ",
      spokenText:
        "Every safe method is also idempotent. `PUT` and `DELETE` add the idempotent-but-unsafe group. `POST` and `PATCH` have neither guarantee in their general method semantics, although a particular POST can use an idempotency key and a particular PATCH operation can be repeatable. The method supplies a shared default, and the endpoint implementation still has to honor that contract.",
    },
    {
      cue: "Connect each property to the automated behavior it enables",
      stage: "Automation uses the promise",
      spokenText:
        "Safety lets browsers, crawlers, link checkers, and prefetchers follow links without triggering a business action. Idempotency lets a client retry more confidently when a connection fails before the response arrives. Neither property bypasses authorization or guarantees that a retry will succeed, return the same status, or avoid concurrent-update conflicts. They describe request intent and repeatability, not every operational result.",
      recallRule:
        "Safe means the client asks only to observe; idempotent means repeating the request does not add another intended effect.",
    },
  ],
});

// Spring POST idempotency has one atomic decision point. The Interview support
// focuses on the three key outcomes, while Deep Dive and the complete service
// example retain crash, transaction, and repository details.
Object.assign(topics.idempotency["post-idempotency-in-spring-boot"], {
  answerSize: "standard",
  lastUpdated: "2026-09-08",
  interviewBeats: [
    {
      cue: "Define the idempotency key as the identity of one client operation",
      stage: "One key, one operation",
      spokenText:
        "A retry-safe POST gives one logical operation a stable idempotency key. The client creates the key and sends it again only when retrying the same work. The server scopes it to the authenticated account or tenant, so two customers can use the same text without sharing an operation. The key is not authentication and must never let a caller access another account's result.",
    },
    {
      cue: "Bind the operation identity to the request that first used it",
      stage: "Fingerprint the request",
      spokenText:
        "The service creates a canonical fingerprint from the request fields that define the operation. For `POST /orders`, that may include product, quantity, price agreement, and destination, but not unstable details such as JSON property order. Saving the fingerprint prevents key `K7` from first meaning one order and later meaning different input. A mismatch is a client conflict, not a new operation.",
    },
    {
      cue: "Make key ownership a single atomic database decision",
      stage: "Reserve before the work",
      spokenText:
        "Before creating the order, the service calls something like `reserve(accountId, key, fingerprint)` in one atomic database operation. A unique constraint, insert-on-conflict, or suitable lock allows only one owner. A separate `find` followed by `insert` is unsafe because two requests can both see no row. Spring's `@Transactional` helps define a local transaction, but the repository still must implement this atomic gate.",
      support: {
        type: "comparison",
        title: "One reservation, three meaningful outcomes",
        items: [
          {
            label: "New key",
            value: "own the operation",
            detail: "Reserve it atomically, then perform the business transaction once.",
            tone: "green",
          },
          {
            label: "Same key + same input",
            value: "wait or replay",
            detail: "Apply the documented in-progress rule or return the saved result.",
            tone: "blue",
          },
          {
            label: "Same key + new input",
            value: "reject the conflict",
            detail: "Do not silently turn one operation identity into different work.",
            tone: "orange",
          },
        ],
      },
    },
    {
      cue: "Walk through two concurrent requests that carry the same key",
      stage: "Concurrent calls share a gate",
      spokenText:
        "If two `POST /orders` calls arrive together with key `K7`, one wins the reservation and creates order 42. The other reads the same operation record instead of creating order 43. If order 42 is complete, it receives the stored status, selected headers, and response data. If processing continues, the API follows its documented wait-or-conflict response. Both calls still pass normal authentication and authorization.",
    },
    {
      cue: "Close with local transaction and external side-effect boundaries",
      stage: "Transactions have a boundary",
      spokenText:
        "The operation record and business data should commit consistently when they share one database. An in-memory map is not enough because it disappears on restart and differs across application instances. An external payment or message broker sits outside that local transaction, so the design needs its stable operation reference, an outbox, or reconciliation after an uncertain result. Expiry, failed results, and abandoned `PROCESSING` entries also need explicit recovery rules.",
      recallRule:
        "Scope one key to one caller and fingerprint, reserve it atomically before the work, persist the replay result, and design recovery across every external boundary.",
    },
  ],
  deep: [
    "A naïve implementation performs “find key, then create order, then save key.” Two threads can both observe no key before either saves, causing duplicate work. The reservation must be atomic. A unique index on the scoped key, an insert with conflict handling, or a database lock makes exactly one request the owner.",
    "The request fingerprint prevents accidental key reuse. It should cover the normalized fields that define the operation, not unstable transport details such as header order. Store only a hash if retaining the full request would expose sensitive data. Constant-time comparison is useful when a fingerprint becomes security-sensitive, although its main role here is integrity.",
    "Crash behavior must be designed. If business data commits but the replay record does not, a retry may duplicate the effect. Keeping both in one local transaction works when they share a database. Across external payment providers, use their operation key, an outbox, or a reconciled state machine; a single annotation cannot create a distributed transaction.",
    "A completed entry can replay the original outcome. An in-progress entry may return `409 Conflict`, briefly wait, or use another clearly documented policy. Failures need a rule: deterministic validation failures can often be replayed, while transient failures might release or retain the key. Expiry must be longer than the promised retry window.",
  ],
});

// Optimistic locking is taught as a revision check first, then contrasted with
// operation identity. The trace illustrates the lost-update mechanism while
// Deep Dive retains the persistence/ETag boundary and full HTTP exchange.
Object.assign(topics.idempotency["optimistic-locking-and-idempotency"], {
  answerSize: "standard",
  lastUpdated: "2026-09-08",
  interviewBeats: [
    {
      cue: "Name the two different failures these protections address",
      stage: "Two protections, two risks",
      spokenText:
        "Optimistic locking prevents a stale update from silently overwriting a newer one. Idempotency prevents the same logical command from executing twice. They are related because both matter during retries, but they compare different identities: optimistic locking checks the resource revision the client read, while idempotency checks the operation the client intended to run.",
    },
    {
      cue: "Explain how a JPA version detects an intervening write",
      stage: "JPA checks the version",
      spokenText:
        "A JPA entity can declare a field such as `@Version long version`. The persistence provider reads that revision with the entity and verifies it when updating or deleting. If two editors read version 4, the first update can advance the entity to version 5. The second editor still holds version 4, so verification fails and JPA raises `OptimisticLockException` instead of losing the first update.",
      support: {
        type: "trace",
        title: "The second writer carries a stale revision",
        items: [
          {
            label: "Editor A",
            value: "reads version 4",
            detail: "Prepares one change from the current entity revision.",
            tone: "blue",
          },
          {
            label: "Editor B",
            value: "also reads version 4",
            detail: "Prepares a different change before A commits.",
            tone: "neutral",
          },
          {
            label: "A commits",
            value: "version becomes 5",
            detail: "The first change succeeds and advances the revision.",
            tone: "green",
          },
          {
            label: "B commits",
            value: "version 4 is stale",
            detail: "Verification fails rather than overwriting A's change.",
            tone: "orange",
          },
        ],
      },
    },
    {
      cue: "Show the equivalent public HTTP precondition",
      stage: "HTTP exposes a validator",
      spokenText:
        "At the HTTP boundary, the server can return `ETag: \"order-v7\"` with an order. The client sends that value in `If-Match: \"order-v7\"` when changing it. If the current representation no longer matches, the precondition is false and the server returns `412 Precondition Failed` without applying the method. An ETag may come from entity version data, but it is a public representation validator, not automatically the database counter.",
    },
    {
      cue: "Contrast revision identity with operation identity",
      stage: "Idempotency tracks a command",
      spokenText:
        "An idempotency key asks, “Has command `confirm-42-K` already run?” A version validator asks, “Is order 42 still the revision I edited?” The same command can touch several records or an external system, so one entity version cannot identify it. Two different commands also need different operation keys even when they start from the same order revision.",
    },
    {
      cue: "Combine the guards and explain how to recover from failure",
      stage: "Use both when both apply",
      spokenText:
        "A confirmation endpoint can require both key `confirm-42-K` and `If-Match: \"order-v7\"`. The key stops duplicate execution, while the validator stops confirmation based on stale order state. After an optimistic-lock failure, read the fresh resource and decide again; blindly retrying the old update repeats the same bad assumption. A JPA exception also needs deliberate API mapping because JPA itself does not choose the HTTP status.",
      recallRule:
        "Use a version or If-Match to protect the resource revision, and an idempotency key to protect the identity of the logical command.",
    },
  ],
});

// Payment idempotency crosses a local database and a provider boundary. The
// state trace teaches recovery states without copying Deep Dive's full network
// sequence or the complete HTTP request/response example.
Object.assign(topics.idempotency["idempotent-payment-api-design"], {
  answerSize: "standard",
  lastUpdated: "2026-09-08",
  interviewBeats: [
    {
      cue: "Model each intended payment attempt with its own identity and state",
      stage: "Payment attempt as a resource",
      spokenText:
        "An idempotent payment API treats a payment attempt as a resource with its own ID and lifecycle. The client creates one operation key for one intended charge. The server scopes that key to the merchant or account, so a retry finds the same payment resource instead of creating another charge. A refund or a genuinely new payment attempt gets a new key because it is different work.",
    },
    {
      cue: "Prevent one key from being reused for different money movement",
      stage: "Bind the key to the request",
      spokenText:
        "The server stores a canonical fingerprint of operation-defining input such as order, amount, currency, payee, and selected payment method reference. Money should use a fixed minor unit such as `amountMinor: 1999`, not binary floating point. If the same key later arrives with INR 2,999 instead of INR 1,999, the API rejects it rather than replaying or silently changing the original payment.",
    },
    {
      cue: "Create durable local recovery state before contacting the provider",
      stage: "Create local state first",
      spokenText:
        "The service atomically reserves the key and creates payment `P-83` in a durable state such as `PENDING` before sending a charge. This closes the local check-then-charge race and gives recovery code a stable record if the process stops. Only the reservation owner contacts the provider; concurrent retries inspect `P-83` and follow its known state.",
      support: {
        type: "trace",
        title: "A payment state tells a retry what is safe",
        items: [
          {
            label: "PENDING",
            value: "reserved, not final",
            detail: "One owner may submit; retries do not create another payment.",
            tone: "blue",
          },
          {
            label: "SUCCEEDED",
            value: "replay success",
            detail: "Return the same payment identity and known successful outcome.",
            tone: "green",
          },
          {
            label: "DECLINED",
            value: "replay known result",
            detail: "Apply the documented final-failure policy for this attempt.",
            tone: "orange",
          },
          {
            label: "UNKNOWN",
            value: "reconcile first",
            detail: "Query by the stable provider reference before allowing another charge.",
            tone: "neutral",
          },
        ],
      },
    },
    {
      cue: "Carry the same operation identity across the provider boundary",
      stage: "Reuse downstream identity",
      spokenText:
        "When the payment provider supports idempotency or a merchant operation reference, send a stable reference derived for `P-83` and store the provider ID. Suppose the provider charges successfully but its response times out. The API leaves a recoverable uncertain state and checks the provider by that reference. It must not mark the attempt as safely failed and start a new charge merely because one network response disappeared.",
    },
    {
      cue: "Close with replay, expiry, and controls idempotency cannot replace",
      stage: "Define the safety boundary",
      spokenText:
        "A retry with the same key and fingerprint returns payment `P-83` and its known outcome; it never creates `P-84`. The contract must define in-progress responses, key lifetime, final and retryable failures, status lookup, and reconciliation. Authorization, fraud checks, ledger correctness, audit history, and refund identity remain separate controls. Idempotency reduces duplicate payment effects, but it cannot prove that a payment was permitted or that every external system is consistent.",
      recallRule:
        "Create one durable payment attempt, bind its key to exact money movement, reuse a stable provider reference, and reconcile uncertain outcomes before charging again.",
    },
  ],
});

// JSON is explained first as a small data grammar, then as an HTTP
// representation whose business meaning comes from the API contract. The
// compact comparison avoids repeating the full Deep Dive concept map.
Object.assign(topics["json-basics"]["json-in-rest-apis"], {
  answerSize: "standard",
  lastUpdated: "2026-09-08",
  interviewBeats: [
    {
      cue: "Define JSON and name the complete set of value kinds",
      stage: "JSON is structured text",
      spokenText:
        "JSON stands for JavaScript Object Notation. It is a text format for structured data, not a JavaScript-only object. A JSON value can be an object, array, string, number, `true`, `false`, or `null`. Objects contain named members, while arrays contain an ordered list of values. Almost every common language has a parser for this small grammar.",
    },
    {
      cue: "Explain the practical ecosystem reasons for API adoption",
      stage: "Why web APIs use JSON",
      spokenText:
        "JSON became the common web API default because its syntax is compact, browser clients handle it naturally, and mature libraries map it to ordinary values in Java, JavaScript, Python, Go, and other languages. A Java service can return an order DTO and a browser can read the same representation without an XML document model or a platform-specific binary decoder.",
    },
    {
      cue: "Connect the representation to its HTTP media type",
      stage: "HTTP identifies the format",
      spokenText:
        "HTTP identifies the body format separately from the resource. `Content-Type: application/json` says that the content being sent is JSON. A client can send `Accept: application/json` to ask for a JSON response when the resource has more than one representation. JSON exchanged between systems uses UTF-8, and the API still has to document the fields, allowed values, and response status.",
    },
    {
      cue: "Separate valid JSON syntax from a valid application value",
      stage: "The API supplies meaning",
      spokenText:
        "The parser can accept `{\"totalMinor\":1999,\"currency\":\"INR\"}`, but JSON alone does not say that 1999 means ₹19.99, that the currency is supported, or that the amount must be positive. Those rules belong to the API schema and domain. A request can therefore be valid JSON and still be rejected as invalid input.",
      support: {
        type: "comparison",
        title: "JSON syntax and API rules solve different problems",
        items: [
          {
            label: "JSON format",
            value: "structure and value kinds",
            detail: "Checks objects, arrays, strings, numbers, booleans, null, and valid syntax.",
            tone: "blue",
          },
          {
            label: "API contract",
            value: "field meaning and rules",
            detail: "Defines required members, dates, money, identifiers, allowed values, and domain validation.",
            tone: "green",
          },
        ],
      },
    },
    {
      cue: "Close with JSON limits and the REST representation boundary",
      stage: "Common does not mean required",
      spokenText:
        "JSON has no built-in date, exact-decimal, binary, comment, or reference type, so an API chooses conventions such as an ISO 8601 string for an instant and integer minor units for money. Large numeric identifiers are often strings to avoid cross-language precision loss. REST and HTTP do not require JSON; the same resource can also have HTML, XML, a file, or another negotiated representation.",
      recallRule:
        "JSON carries a small, portable value structure; HTTP names that representation, and the API contract gives every field its real meaning.",
    },
  ],
});

// Jackson is taught through the two conversion directions and the exact
// points where mapping, validation, and business rules run. The support is a
// direction comparison rather than a duplicate of the full pipeline diagram.
Object.assign(topics["json-basics"]["jackson-json-serialization-in-spring-boot"], {
  direct:
    "Spring MVC reads and writes HTTP bodies through an `HttpMessageConverter`. When a Jackson converter is selected, the configured Jackson mapper deserializes JSON into an `@RequestBody` DTO and serializes a value returned by a `@RestController` into JSON. DTO design, mapper settings, validation, and error handling complete the contract.",
  quick: [
    "`@RequestBody` asks Spring MVC to read request content through an `HttpMessageConverter`.",
    "A Jackson-backed converter uses the configured mapper to turn JSON into a Java type and a Java value back into JSON.",
    "`Content-Type` describes request data; `Accept` helps select the response representation.",
    "Use DTOs and focused annotations such as `@JsonProperty`; configure shared conventions centrally.",
    "Treat unknown fields, nulls, dates, numbers, and polymorphic input as explicit contract decisions.",
  ],
  answerSize: "standard",
  lastUpdated: "2026-09-08",
  interviewBeats: [
    {
      cue: "Place Jackson inside Spring MVC message conversion",
      stage: "Spring selects a converter",
      spokenText:
        "Spring MVC does not ask a controller to parse JSON by hand. A parameter such as `@RequestBody CreateUserRequest request` tells Spring to read the HTTP body through an `HttpMessageConverter`. When the request has `Content-Type: application/json` and a Jackson converter is configured, that converter uses the application's Jackson mapper to build the declared Java type.",
    },
    {
      cue: "Show one field mapping during deserialization",
      stage: "JSON becomes a request DTO",
      spokenText:
        "During deserialization, Jackson reads JSON members and fills the request DTO according to its names, types, configuration, and annotations. For example, `@JsonProperty(\"display_name\") String displayName` maps the JSON member `display_name` to the Java component `displayName`. If the controller parameter also has `@Valid`, Bean Validation runs after successful JSON conversion.",
      support: {
        type: "comparison",
        title: "The mapper works in both directions",
        items: [
          {
            label: "Deserialization",
            value: "JSON → request DTO",
            detail: "Reads request content using the declared Java target type and mapping rules.",
            tone: "blue",
          },
          {
            label: "Serialization",
            value: "response DTO → JSON",
            detail: "Writes the public Java response shape using the selected media type and mapping rules.",
            tone: "green",
          },
        ],
      },
    },
    {
      cue: "Follow a controller return value back to the HTTP response",
      stage: "A response DTO becomes JSON",
      spokenText:
        "The reverse path starts when a `@RestController` returns a value such as `new UserResponse(42, \"Ada\")`. Spring selects a converter for the response media type, and Jackson serializes the DTO into JSON. `Accept` and a mapping's `produces` condition can take part in response selection; the response `Content-Type` tells the client which format was actually sent.",
    },
    {
      cue: "Separate shared mapper policy from one-field exceptions",
      stage: "Configure the public contract",
      spokenText:
        "Shared rules such as property naming, time formats, modules, and unknown-member policy should be configured centrally so every endpoint behaves the same. A focused annotation such as `@JsonProperty` is useful for one contract name. Request and response DTOs keep the public shape deliberate; directly serializing persistence entities can expose internal fields, cycles, or lazy-loaded relationships.",
    },
    {
      cue: "Distinguish conversion failures from later validation and domain failures",
      stage: "Failures happen in stages",
      spokenText:
        "Malformed JSON or an incompatible value fails during message conversion, before the controller receives a DTO. Successful deserialization does not prove the request is acceptable: Bean Validation and service rules still run afterward. Serialization can fail later if a custom mapper rule is broken. Each stage needs a safe, consistent error response, and strict compatibility rules should be tested against the mapper actually configured by the application.",
      recallRule:
        "Spring chooses the converter, Jackson maps the wire format, validation checks the DTO, and the service decides whether the request is valid for the business.",
    },
  ],
  deep: [
    "Handler mapping first selects a controller method from its path, HTTP method, and media conditions. Argument resolution sees `@RequestBody` and delegates to a converter that can read the request's `Content-Type` into the declared target type. The Jackson converter parses tokens, constructs the object, converts property values, and applies the configured mapping rules.",
    "The reverse path begins with the controller's return value. Spring chooses a converter for the negotiated response media type, and Jackson serializes the response DTO. Request and response DTOs define a deliberate public shape. Global naming or time conventions can be configured centrally, while one-off contract names can use focused annotations or a custom serializer when normal mapping is not enough.",
    "Malformed JSON fails during message conversion before controller logic receives a DTO. Valid JSON can still violate Bean Validation or domain rules afterward. Serialization can also fail, for example when a custom serializer throws. These stages should map to safe, consistent error responses rather than expose parser or mapping internals.",
    "Deserialization is a trust boundary. Unknown-member handling, polymorphic input, numeric coercion, null behavior, and accepted date formats should be intentional. Mapper types and defaults can differ between Spring Boot and Jackson generations, so a compatibility-sensitive API should configure and test the actual mapper used by that application instead of relying on a remembered default.",
  ],
  visual: {
    type: "flow_diagram",
    title: "Jackson sits inside Spring's message-conversion path",
    content: fenced("mermaid", [
      "flowchart LR",
      "  A[JSON request + Content-Type] --> B[HttpMessageConverter]",
      "  B --> C[Jackson mapper]",
      "  C --> D[Request DTO]",
      "  D --> E[Bean Validation]",
      "  E --> F[Controller + service]",
      "  F --> G[Response DTO]",
      "  G --> C",
      "  C --> H[JSON response + Content-Type]",
    ]),
  },
});

// Serialization and deserialization are opposite boundary operations, not a
// guaranteed round trip. The guided answer keeps the two directions visible
// and leaves the full Jackson program and broader contract risks in Deep Dive.
Object.assign(topics["json-basics"]["json-serialization-vs-deserialization"], {
  direct:
    "Serialization turns a Java value into JSON text or bytes. Deserialization reads JSON and builds a value of a declared Java type. In a REST API, serialization controls the response that leaves the service, while deserialization handles request data entering it; successful mapping still does not replace validation.",
  quick: [
    "Serialization is Java value → JSON; deserialization is JSON → declared Java type.",
    "A configured Jackson mapper can write with `writeValueAsString` and read with `readValue`.",
    "Request and response DTOs make the accepted and published JSON fields deliberate.",
    "Deserialization can fail on malformed JSON or incompatible values; mapped data still needs validation.",
    "A round trip is not guaranteed because input-only fields, generated values, and format rules may differ.",
  ],
  answerSize: "standard",
  lastUpdated: "2026-09-08",
  interviewBeats: [
    {
      cue: "Define both operations from the API boundary",
      stage: "Two opposite directions",
      spokenText:
        "Serialization converts an in-memory Java value into JSON text or bytes. Deserialization moves in the opposite direction: it reads JSON and builds a value of the Java type the application requested. A REST response normally uses serialization, while a JSON request body normally uses deserialization. The same mapping library can perform both jobs, but each direction has different checks and risks.",
      support: {
        type: "comparison",
        title: "The boundary works in two directions",
        items: [
          {
            label: "Serialization",
            value: "Java value → JSON",
            detail: "Publishes the selected response fields and formats.",
            tone: "green",
          },
          {
            label: "Deserialization",
            value: "JSON → Java type",
            detail: "Reads untrusted input using a declared target type and mapping rules.",
            tone: "blue",
          },
        ],
      },
    },
    {
      cue: "Show how a Java response becomes JSON",
      stage: "Serialization controls output",
      spokenText:
        "For output, a call such as `mapper.writeValueAsString(orderResponse)` writes the properties visible on the response object. The response DTO should contain only the public fields the client needs. Serializing a persistence entity directly can expose an internal field, follow a cyclic relationship, or trigger a lazy database load, so the outgoing shape should be chosen rather than discovered by accident.",
    },
    {
      cue: "Show how JSON becomes a typed request",
      stage: "Deserialization accepts input",
      spokenText:
        "For input, `mapper.readValue(json, CreateOrderRequest.class)` asks Jackson to parse the JSON and build that target type. Invalid JSON or a value that cannot fit the declared type can fail during this step. A successful result only means mapping worked; `@Valid` constraints and service rules must still decide whether the request is allowed.",
    },
    {
      cue: "Connect both directions through one endpoint",
      stage: "One request, two DTOs",
      spokenText:
        "Consider `POST /orders`. The request JSON is deserialized into `CreateOrderRequest`, which may contain `productId` and `quantity`. After validation and service work, an `OrderResponse` is serialized with the new order ID, status, and total. The input and output do not need the same fields because they represent different moments and different permissions in the use case.",
    },
    {
      cue: "Explain why writing then reading need not restore the same object",
      stage: "Round trips are not mirrors",
      spokenText:
        "A JSON round trip is not always lossless. A password may be accepted but never returned, an ID may be generated by the server, and dates or numbers may use a public wire format different from the Java representation. Contract tests should therefore check request and response mapping separately, including missing values, unknown fields, boundaries, and sensitive-field absence.",
      recallRule:
        "Serialization chooses what leaves as JSON; deserialization interprets what enters, and validation decides whether the mapped request is acceptable.",
    },
  ],
});

// Request validation is taught as a sequence with clear ownership. The one
// comparison separates stable DTO constraints from changing service rules and
// final database integrity without duplicating Deep Dive's full flow diagram.
Object.assign(topics["json-basics"]["request-body-validation-in-spring-boot"], {
  direct:
    "Put Jakarta Bean Validation constraints on a request DTO and use `@Valid @RequestBody` on the controller parameter. Spring first converts JSON into that DTO and then checks its constraints. Use cascading `@Valid` for nested values, keep rules that depend on current data in the service, and keep final integrity rules in the database.",
  quick: [
    "Put constraints such as `@NotBlank`, `@Email`, `@Positive`, and `@Size` on the request DTO.",
    "Use `@Valid @RequestBody` so Spring validates the DTO after JSON conversion.",
    "Mark nested objects or collection elements with `@Valid` when their constraints must run.",
    "Keep stock, authorization, uniqueness, and other changing business rules outside simple field annotations.",
    "Return one stable field-error format and test conversion, nested validation, and domain failures separately.",
  ],
  answerSize: "standard",
  lastUpdated: "2026-09-08",
  interviewBeats: [
    {
      cue: "Separate JSON conversion from validation",
      stage: "Conversion comes first",
      spokenText:
        "Spring first has to turn the request body into the controller's Java type. `@RequestBody CreateOrderRequest request` is read through an HTTP message converter. If the JSON is malformed or `quantity` cannot become the declared number type, conversion fails before the normal controller body receives a DTO. Bean Validation starts only after a Java object has been created.",
    },
    {
      cue: "Apply constraints to the request DTO",
      stage: "Constraints check the DTO",
      spokenText:
        "The controller can declare `@Valid @RequestBody CreateOrderRequest request`. The DTO then carries local rules such as `@NotBlank String productId`, `@Positive int quantity`, or `@NotEmpty List<...> items`. In the normal Spring MVC flow, a failed request-body validation becomes a bad-request response unless the application handles the validation result in another supported way.",
    },
    {
      cue: "Explain validation of nested request values",
      stage: "Nested values need a cascade",
      spokenText:
        "Putting constraints on a child DTO is not enough; validation must be told to enter that child. For a list of order items, `List<@Valid OrderItemRequest> items` tells Bean Validation to inspect each element, where rules such as `@NotBlank` and `@Positive` live. `@Valid` is a cascade marker; it is not itself a rule such as non-null or positive.",
    },
    {
      cue: "Give each kind of rule to the layer that can prove it",
      stage: "Business rules come later",
      spokenText:
        "A valid DTO can still describe an order the system must reject. Product existence, available stock, coupon eligibility, and authorization depend on current application state, so the service checks them. A database uniqueness or foreign-key constraint remains the final protection against races and invalid stored data. An annotation alone cannot safely replace those checks.",
      support: {
        type: "comparison",
        title: "Each layer answers a different question",
        items: [
          {
            label: "DTO constraints",
            value: "Is this request shape valid?",
            detail: "Checks local values such as blank text, ranges, and collection size.",
            tone: "blue",
          },
          {
            label: "Service rules",
            value: "Is this action allowed now?",
            detail: "Uses current stock, permissions, and related records.",
            tone: "green",
          },
          {
            label: "Database constraints",
            value: "Can this state be stored safely?",
            detail: "Protects final uniqueness and relationship integrity during races.",
            tone: "orange",
          },
        ],
      },
    },
    {
      cue: "Close the loop with useful errors and focused tests",
      stage: "Return useful field errors",
      spokenText:
        "A central `@ControllerAdvice` can turn conversion and validation exceptions into one stable error format with a field path, rule code, and readable message. It should not expose parser internals or stack traces. Tests should cover malformed JSON, a missing required value, an invalid nested item, one valid request, and a structurally valid request that the service rejects.",
      recallRule:
        "Convert the JSON, validate the DTO and its nested values, then let the service and database enforce rules that depend on real system state.",
    },
  ],
});

// DTOs and entities are separated through one create-user path. The compact
// trace shows ownership at each boundary while Deep Dive retains persistence,
// lazy-loading, compatibility, and mapping-tool details.
Object.assign(topics["json-basics"]["dto-vs-entity-in-rest-apis"], {
  direct:
    "A JPA entity represents persistent data with identity, mapped fields, relationships, and a persistence lifecycle. A DTO represents the data accepted or returned by one API use case. Separate DTOs stop clients from setting internal fields or seeing sensitive ones and let the API contract change without exposing every persistence-model change.",
  quick: [
    "A JPA entity belongs to persistence and has identity, mapped state, relationships, and lifecycle.",
    "A DTO is a request- or response-specific data shape at the API boundary.",
    "A request DTO accepts only fields the client is allowed to send.",
    "A response DTO returns only public fields and avoids entity cycles or accidental lazy loading.",
    "Explicit mapping adds code but separates API compatibility from database design.",
  ],
  answerSize: "standard",
  lastUpdated: "2026-09-08",
  interviewBeats: [
    {
      cue: "Define the two models by the job each performs",
      stage: "Two models, two jobs",
      spokenText:
        "A JPA entity represents data managed by persistence. It has an identity, mapped state, relationships, and a lifecycle in a persistence context. A DTO, or Data Transfer Object, represents the data for one request or response. The classes may share fields, but an entity answers database needs while a DTO answers one public API use case.",
    },
    {
      cue: "Use a request DTO as an explicit input allow-list",
      stage: "Request DTO limits input",
      spokenText:
        "A create endpoint can accept `record CreateUserRequest(String displayName, String email) {}`. Because `id`, `role`, `passwordHash`, and `version` are absent, JSON binding cannot set them through this request type. The DTO can also use names and validation rules that match the client contract instead of exposing persistence details.",
      support: {
        type: "trace",
        title: "One create request crosses controlled boundaries",
        items: [
          {
            label: "Request JSON",
            value: "CreateUserRequest",
            detail: "Contains only client-owned input such as display name and email.",
            tone: "blue",
          },
          {
            label: "Service mapping",
            value: "UserEntity",
            detail: "Adds server-owned identity, defaults, private data, and persistence state.",
            tone: "neutral",
          },
          {
            label: "Response mapping",
            value: "UserResponse",
            detail: "Publishes only the ID and fields promised by the API contract.",
            tone: "green",
          },
        ],
      },
    },
    {
      cue: "Keep persistence behavior inside the data boundary",
      stage: "Entity owns persistence",
      spokenText:
        "The entity may contain a generated ID, password hash, audit timestamps, an optimistic-lock version, and mapped organization relationships. Those fields exist for storage and domain work, not automatically for JSON. Binding a request directly to the entity can allow over-posting, while returning it can expose private data or make serialization touch lazy relationships.",
    },
    {
      cue: "Build a public response instead of serializing the entity graph",
      stage: "Response DTO controls output",
      spokenText:
        "After the service finishes, mapping can return `new UserResponse(user.id, user.displayName)`. That response has no path to the password hash or persistence version. It also gives related data a deliberate shape, such as a small organization summary or link, instead of walking a bidirectional entity graph and possibly causing recursion or extra database queries.",
    },
    {
      cue: "Acknowledge mapping cost and state why the boundary is useful",
      stage: "Mapping buys independence",
      spokenText:
        "Separate DTOs add classes and mapping code. Manual mapping is often clearest for a small contract, while a generated mapper can help when many fields repeat, provided its output is reviewed and tested. The benefit is independent change: a table relationship can be refactored without silently changing JSON, and a new API field does not have to become persistent state.",
      recallRule:
        "Use request DTOs to control what enters, entities for persistence, and response DTOs to control what leaves.",
    },
  ],
});

// This answer focuses on why stateless interaction changes the scalability of
// the request-handling tier. It contrasts server affinity with interchangeable
// instances without repeating the Deep Dive's workflow code.
Object.assign(topics["rest-constraints"]["statelessness-and-scalability"], {
  answerSize: "standard",
  interviewBeats: [
    {
      cue: "Define what statelessness removes from an API instance",
      stage: "Remove server affinity",
      spokenText:
        "Statelessness means an API instance does not keep hidden client-session context that a later request must recover. Each request supplies the resource identifier, credentials, any representation, and other context needed for that interaction. Orders, users, permissions, idempotency records, and logs can still remain on the server. The constraint removes per-client conversation memory from the request-handling instance, not business data from the system.",
    },
    {
      cue: "Show how interchangeable instances enable horizontal scaling",
      stage: "Add or replace instances",
      spokenText:
        "A load balancer can send `GET /orders/42` to Instance A and the next complete request to Instance B. Since neither instance needs a private `currentOrder` or checkout-step variable, the tier does not need sticky sessions just to preserve conversation context. New instances can join, old ones can leave, and a failed instance can be replaced without losing required client-session memory.",
      support: {
        type: "comparison",
        title: "Routing with and without server affinity",
        items: [
          {
            label: "Server-held session",
            value: "Return to Instance A",
            detail: "The next request depends on private conversation context stored by that process.",
            tone: "orange",
          },
          {
            label: "Stateless interaction",
            value: "Route to A or B",
            detail: "The complete request identifies context and shared resources can be loaded by either instance.",
            tone: "green",
          },
        ],
      },
    },
    {
      cue: "Explain where durable workflow and business state still belongs",
      stage: "State still has a home",
      spokenText:
        "Durable progress becomes resource state in shared storage. For example, `POST /exports` can create an export and return `Location: /exports/E7`; any instance can later handle `GET /exports/E7` by loading that resource. This scales the API tier, but it does not make the whole system limitless. A database, authorization service, or shared cache can still become a bottleneck or failure point and must be designed separately.",
    },
    {
      cue: "Balance the scaling benefit against protocol and failure costs",
      stage: "The benefit has limits",
      spokenText:
        "Self-contained requests may repeat credentials and context, perform repeated lookups, and use more bandwidth. They do not require JWT; an opaque token can work if the request remains independently understandable. If an instance dies during a request, that request may still fail, and retry safety depends on idempotency and business rules. Statelessness is especially important for horizontal scaling, but cacheability, layering, and the uniform interface also contribute to a scalable REST system.",
      recallRule:
        "Statelessness makes API instances interchangeable; shared dependencies and retry rules still determine whether the whole system scales safely.",
    },
  ],
});

// Cacheability has three separate decisions: storage, fresh reuse, and stale
// revalidation. The directive comparison answers common header confusion while
// the full cache decision flow remains in Deep Dive.
Object.assign(topics["rest-constraints"]["rest-cacheability-and-cache-control-headers"], {
  answerSize: "standard",
  interviewBeats: [
    {
      cue: "Define cacheability as controlled HTTP response reuse",
      stage: "Reuse an HTTP response",
      spokenText:
        "Cacheability in REST means a client cache or intermediary can store a response and reuse it when HTTP rules allow. Reusing a response can reduce latency, bandwidth, and work at the origin service. It is different from an internal Spring or database cache because HTTP metadata tells components outside the application whether the transferred response is safe to retain and reuse.",
    },
    {
      cue: "Separate permission to store from permission to reuse while fresh",
      stage: "Storage and freshness",
      spokenText:
        "`Cache-Control` carries the main policy. `max-age=60` normally makes a stored response fresh for 60 seconds. `no-cache` permits storage but requires validation before reuse, while `no-store` tells caches not to store the response. `private` limits storage to a private cache such as a browser; `public` explicitly permits shared-cache storage in cases where that policy is appropriate.",
      support: {
        type: "comparison",
        title: "Common Cache-Control directives",
        items: [
          {
            label: "max-age=60",
            value: "fresh for 60 seconds",
            detail: "A reusable stored response normally needs no origin check during that period.",
            tone: "green",
          },
          {
            label: "no-cache",
            value: "store, then validate",
            detail: "The response may be retained but must be checked before reuse.",
            tone: "blue",
          },
          {
            label: "no-store",
            value: "do not store",
            detail: "Use when retaining the response is not acceptable.",
            tone: "orange",
          },
          {
            label: "private",
            value: "private cache only",
            detail: "A shared cache must not store the response for multiple users.",
            tone: "neutral",
          },
        ],
      },
    },
    {
      cue: "Show how an HTTP validator avoids sending an unchanged body",
      stage: "Revalidate with validators",
      spokenText:
        "The origin can return an opaque validator such as `ETag: \"product-42-v7\"`. After the response becomes stale, the client sends `If-None-Match: \"product-42-v7\"`. If the selected representation is unchanged, the origin returns `304 Not Modified` without another response body, and the cache reuses its stored copy. `Last-Modified` with `If-Modified-Since` provides a time-based alternative with lower precision.",
    },
    {
      cue: "Match cache keys and storage scope to the response audience",
      stage: "Audience and variants",
      spokenText:
        "A public product catalogue may use shared caching, while an account response usually needs `private` or `no-store` according to its sensitivity. `Vary` names request headers that selected the representation. For example, `Vary: Accept-Encoding` keeps compressed and uncompressed responses in separate cache entries. Missing `Vary` can serve the wrong variant; naming too many fields can reduce the cache hit rate.",
    },
    {
      cue: "Close with the correctness boundary for practical cache policy",
      stage: "Correctness before hit rate",
      spokenText:
        "A cache rule must reflect how stale the data may be, who may receive it, and which request selected it. Statelessness alone does not make a response cacheable, and a framework cache annotation does not create a correct HTTP contract. Test the actual method, status, headers, mutation path, and revalidation response. Fast reuse is useful only when the cache cannot leak personalized data or return an unacceptable old representation.",
      recallRule:
        "Decide whether a response may be stored, how long it stays fresh, how it is revalidated, and which request variants share a cache entry.",
    },
  ],
});

// Uniform interface is presented as four distinct guarantees applied to one
// order exchange. This relationship card complements, rather than repeats, the
// broader Deep Dive concept map and HAL response.
Object.assign(topics["rest-constraints"]["uniform-interface-sub-constraints"], {
  answerSize: "standard",
  interviewBeats: [
    {
      cue: "Define the shared interaction model and name its four parts",
      stage: "One shared interface",
      spokenText:
        "Uniform interface is REST's shared interaction model for clients, servers, and intermediaries. Its four sub-constraints are identification of resources, manipulation through representations, self-descriptive messages, and hypermedia as the engine of application state, usually shortened to HATEOAS. The shared model reduces coupling to server implementation, although it can be less specialized than a purpose-built RPC contract.",
      support: {
        type: "comparison",
        title: "One order exchange uses all four parts",
        items: [
          {
            label: "Identify",
            value: "/orders/42",
            detail: "A stable URI identifies the order independently of its representation.",
            tone: "blue",
          },
          {
            label: "Represent",
            value: "JSON state or patch",
            detail: "The client receives state or sends a defined representation of a change.",
            tone: "green",
          },
          {
            label: "Describe",
            value: "method + metadata",
            detail: "Status, headers, and media type explain how to interpret the message.",
            tone: "orange",
          },
          {
            label: "Navigate",
            value: "rel=confirm",
            detail: "A link advertises a transition currently available for the order.",
            tone: "neutral",
          },
        ],
      },
    },
    {
      cue: "Keep resource identity separate from its transferred formats",
      stage: "Identify the resource",
      spokenText:
        "Resource identification means a URI such as `/orders/42` identifies the order, not one JSON document, Java object, or database row. The same resource can have JSON, XML, or HTML representations selected through the request and response metadata. Stable identity lets the server change storage and lets clients request a suitable representation without creating a different resource for every format.",
    },
    {
      cue: "Explain how representations request a resource state change",
      stage: "Change through representation",
      spokenText:
        "Manipulation through representations means the client sends a defined representation or change document instead of calling the server's internal object directly. A `PUT` representation can describe intended replacement state, while `PATCH` with `Content-Type: application/merge-patch+json` describes a merge patch. The representation is a public contract; authorization and domain rules still decide whether the requested transition is allowed.",
    },
    {
      cue: "Show the metadata that makes a message understandable",
      stage: "Describe every message",
      spokenText:
        "A self-descriptive message contains enough standard and media-type information to interpret the exchange. The method and target express request intent, the status describes the outcome, headers carry metadata, and `Content-Type` defines the body format and semantics. This lets clients, caches, and gateways understand their part of the message without knowing the server's controller method or database model.",
    },
    {
      cue: "Connect hypermedia controls to current application state",
      stage: "Let responses show next steps",
      spokenText:
        "HATEOAS means a representation supplies links or controls for transitions available in the current state. A draft order may include a `confirm` relation, while a cancelled order omits it. The client understands the relation's meaning but obtains the current target from the response instead of hard-coding every URI template. HATEOAS is part of uniform interface, not the optional code-on-demand constraint, and it requires agreed media types and relation semantics.",
      recallRule:
        "Identify the resource, exchange representations, describe each message, and let hypermedia expose valid next transitions.",
    },
  ],
});

// The six-constraint answer is a guided map rather than a second diagram. Each
// beat explains a related part of the style, while the existing Deep Dive keeps
// the complete concept map and self-descriptive HTTP response.
Object.assign(topics["rest-constraints"]["the-six-rest-constraints"], {
  answerSize: "standard",
  interviewBeats: [
    {
      cue: "Name the full constraint set and identify the optional member",
      stage: "Six constraints, one style",
      spokenText:
        "REST combines six constraints: client-server, stateless, cacheable, uniform interface, layered system, and code-on-demand. Code-on-demand is the only optional constraint; the other five form the base REST style. Using HTTP, returning JSON, or exposing CRUD endpoints does not by itself show that these constraints are present.",
    },
    {
      cue: "Connect separation and self-contained requests to independent change",
      stage: "Separation and statelessness",
      spokenText:
        "Client-server separates user-interface concerns from data and service concerns so each side can evolve independently. Statelessness requires every request to carry the context needed to understand it. The server may still store resource state such as orders and users; it must not depend on hidden client-session context from an earlier request. This lets the next request reach any suitable server instance.",
    },
    {
      cue: "Explain safe reuse and transparent intermediaries",
      stage: "Caching and layers",
      spokenText:
        "Cacheable means a response defines whether and how it may be reused. Layered system means a component sees only its immediate neighbour, so caches, proxies, gateways, and load balancers can sit between client and origin. A `GET /orders/42` may be answered by an allowed cache or forwarded through a gateway without changing the client contract. Poor freshness rules risk stale data, and extra layers add latency and failure points.",
    },
    {
      cue: "Describe all four parts of the central REST constraint",
      stage: "The uniform interface",
      spokenText:
        "Uniform interface gives every component the same interaction model. Its four parts are resource identification, manipulation through representations, self-descriptive messages, and hypermedia as the engine of application state. For example, `/orders/42` identifies a resource, while the method, status, headers, media type, body, and links explain the exchange and possible next actions. Method names alone do not satisfy this constraint.",
    },
    {
      cue: "Close with optional executable code and the overall boundary",
      stage: "Code-on-demand is optional",
      spokenText:
        "Code-on-demand allows the server to extend a client by transferring executable code, with browser JavaScript as the familiar example. It is optional because it can reduce visibility into client behaviour, and most JSON APIs do not need it. Together the constraints support independent change, visibility, caching, intermediaries, and scale, but they do not automatically provide security, correctness, or good performance; those still depend on the implementation.",
      recallRule:
        "Separate client and server, make requests stateless, label cacheability, use a uniform interface, allow layers, and treat code-on-demand as optional.",
    },
  ],
});

// This user-reported text wall is reviewed as its own REST concept. The
// Interview Answer teaches the immediate-neighbour rule and one concrete
// request path; the existing Deep Dive keeps the broader reference material.
Object.assign(topics["rest-constraints"]["layered-system-constraint"], {
  answerSize: "standard",
  interviewBeats: [
    {
      cue: "State the immediate-neighbour rule",
      stage: "What the constraint means",
      spokenText:
        "The layered-system constraint means a REST component can see only the component with which it is directly interacting. A client uses one public API and does not need to know whether the next component is the origin service, a cache, a proxy, or an API gateway. Each layer can be replaced or rearranged while the public interface stays stable.",
    },
    {
      cue: "Follow one request through concrete network layers",
      stage: "One request, several layers",
      spokenText:
        "For example, a mobile app sends `GET /orders/42` to `api.example.com`. An edge cache can return a reusable response immediately; otherwise it forwards the request to an API gateway. The gateway can apply common policy and route it to the Order Service, which reads the resource. The client still receives one HTTP response and never needs the service's internal address.",
      support: {
        type: "trace",
        title: "The client sees one API boundary",
        items: [
          {
            label: "Client",
            value: "GET /orders/42",
            detail: "Uses the public host and knows nothing about internal service locations.",
            tone: "blue",
          },
          {
            label: "Edge or cache",
            value: "reuse or forward",
            detail: "Returns a permitted cached response or sends the request onward.",
            tone: "green",
          },
          {
            label: "API gateway",
            value: "policy + route",
            detail: "Applies shared concerns and selects the internal destination.",
            tone: "orange",
          },
          {
            label: "Order Service",
            value: "resource work",
            detail: "Handles the order request and produces the origin response.",
            tone: "neutral",
          },
        ],
      },
    },
    {
      cue: "Explain what must remain consistent across layers",
      stage: "The contract crosses layers",
      spokenText:
        "A layer may perform its assigned job, but it must preserve the meaning of the exchange unless the contract explicitly allows a transformation. A cache follows the method and cache headers. A gateway forwards the relevant path, credentials, and `X-Request-Id`. Status codes, `Content-Type`, and representation semantics must still mean what the client expects. This is what lets infrastructure change without teaching every client about it.",
    },
    {
      cue: "Balance flexibility against operational cost",
      stage: "Every layer has a cost",
      spokenText:
        "Layers enable caching, shared security, routing, load distribution, and independent service scaling. They also add network hops, latency, timeouts, and new failure points. Debugging becomes harder when ownership is unclear, so each layer needs one defined responsibility, bounded timeouts, and end-to-end tracing. This REST constraint describes network visibility; it is not the same as controller, service, and repository classes inside one Java application.",
      recallRule:
        "The client knows the public interface, each component knows its immediate neighbour, and every added layer must justify its latency and failure cost.",
    },
  ],
});

// REST and SOAP are first separated by what each one actually defines. The
// compact comparison follows one customer lookup; the full SOAP envelope and
// standards-level distinctions remain in the independent Deep Dive.
Object.assign(topics["rest-vs-soap"]["rest-vs-soap"], {
  direct:
    "REST is an architectural style built around constraints such as stateless communication, cacheability, layers, and a uniform resource interface. SOAP is a messaging framework with an XML Envelope, optional Header, required Body, processing rules, and transport bindings. REST and SOAP solve different design problems, and neither automatically provides security, reliability, or good performance.",
  quick: [
    "REST is an architectural style; SOAP is a standardized messaging framework.",
    "REST works with resources and representations through a uniform interface; SOAP works with structured messages and service operations.",
    "REST can transfer JSON, XML, HTML, or another representation; a SOAP message has an XML-based Envelope structure.",
    "A SOAP Envelope contains an optional Header and a required Body, and SOAP can use bindings such as HTTP.",
    "WSDL and WS-* standards may add formal contracts or capabilities, but those features are not automatic benefits of SOAP itself.",
  ],
  answerSize: "standard",
  lastUpdated: "2026-09-09",
  interviewBeats: [
    {
      cue: "Separate an architectural style from a message framework",
      stage: "Different kinds of design",
      spokenText:
        "REST and SOAP are not simply two data formats. REST is an architectural style for distributed systems, defined by constraints such as stateless communication, cacheability, layers, and a uniform interface. SOAP is a messaging framework that defines an XML-based message structure and processing rules. A service can therefore use XML and still be RESTful, or use HTTP without becoming RESTful.",
    },
    {
      cue: "Explain the resource and representation model",
      stage: "REST centers on resources",
      spokenText:
        "A REST interaction identifies a resource and transfers a representation of it. For example, `GET /customers/42` asks for the current customer representation. HTTP methods, status codes, headers, media types, and cache rules make the exchange understandable to clients and intermediaries. JSON is common, but REST does not require JSON and is not limited to one wire format.",
      support: {
        type: "comparison",
        title: "The same customer lookup has a different centre",
        items: [
          {
            label: "REST",
            value: "GET /customers/42",
            detail: "The resource identifier and uniform HTTP semantics describe the interaction.",
            tone: "blue",
          },
          {
            label: "SOAP",
            value: "GetCustomer message",
            detail: "A service operation and its XML message contract describe the interaction.",
            tone: "green",
          },
        ],
      },
    },
    {
      cue: "Name the SOAP message parts and operation model",
      stage: "SOAP centers on messages",
      spokenText:
        "A SOAP message has an `Envelope`, may have a `Header`, and must have a `Body`. The body can carry an application operation such as `GetCustomer`, while headers can carry information meant for SOAP processing roles. SOAP also defines faults and binding rules. WSDL is commonly used with SOAP to describe operations, message shapes, and endpoints for tooling and generated clients.",
    },
    {
      cue: "Keep optional enterprise specifications separate from SOAP itself",
      stage: "Extensions are separate",
      spokenText:
        "SOAP environments can use separate standards such as WS-Security or reliable messaging when both sides agree on them. That can suit organizations with an established WSDL and WS-* toolchain, but it also adds contract and interoperability work. A plain SOAP envelope does not guarantee authentication, authorization, ACID transactions, or reliable delivery, just as the REST label does not guarantee simplicity or speed.",
    },
    {
      cue: "Choose from the contract and operating environment",
      stage: "Choose by the environment",
      spokenText:
        "REST is often a natural fit for resource-oriented web APIs that benefit from standard HTTP behavior, broad clients, caching, and evolvable representations. SOAP may fit an existing operation-based integration environment that depends on formal XML schemas, generated clients, or specific WS-* agreements. The final choice should follow the required contract, client ecosystem, infrastructure, and failure model rather than a JSON-versus-XML slogan.",
      recallRule:
        "REST constrains resource interactions; SOAP standardizes an XML message framework, and optional security or reliability features must still be designed explicitly.",
    },
  ],
});

// GraphQL and REST are compared through one product view without pretending
// REST always needs many calls or GraphQL always needs one database query. The
// complete query and deeper execution concerns stay in their own sections.
Object.assign(topics["rest-vs-soap"]["graphql-vs-rest"], {
  direct:
    "GraphQL is a typed query language and execution model in which clients select fields from a schema and receive a response shaped like that selection. REST organizes interactions around identified resources and uniform representations. GraphQL suits flexible connected views; REST fits resource contracts and standard HTTP behavior. Neither is always the better choice.",
  quick: [
    "GraphQL defines a typed schema and validates an operation against that schema before execution.",
    "The client selects fields, and the response `data` follows the requested shape.",
    "REST identifies resources and uses uniform methods, statuses, headers, representations, and cache rules.",
    "GraphQL servers need query-cost limits, nested authorization, batching, and protection from resolver N+1 work.",
    "REST may embed a tailored view or use related requests; one GraphQL operation also does not guarantee one database query.",
  ],
  answerSize: "standard",
  lastUpdated: "2026-09-09",
  interviewBeats: [
    {
      cue: "Define GraphQL through its schema and execution model",
      stage: "GraphQL starts with schema",
      spokenText:
        "GraphQL is a typed query language and a server execution model. The server publishes a schema containing types, fields, arguments, and entry points such as `Query` and `Mutation`. A client operation is checked against that schema before it runs. If it is valid, the server resolves the selected fields and returns a result shaped like the selection.",
    },
    {
      cue: "Show how a client chooses one connected view",
      stage: "Clients select fields",
      spokenText:
        "A product screen may need only a product name, seller name, and three review summaries. A GraphQL selection such as `product { name seller { name } }` asks for that connected view without requesting every available field. This is one GraphQL operation, but it is not automatically one database query; resolver and data-loading design determine the actual work.",
      support: {
        type: "comparison",
        title: "Two valid ways to shape a product screen",
        items: [
          {
            label: "GraphQL",
            value: "Client selects connected fields",
            detail: "One operation names the product, seller, and review fields needed now.",
            tone: "blue",
          },
          {
            label: "REST",
            value: "Server designs representations",
            detail: "A product representation may embed summaries, link related resources, or use related requests.",
            tone: "green",
          },
        ],
      },
    },
    {
      cue: "Explain the resource-oriented alternative accurately",
      stage: "REST shapes resources",
      spokenText:
        "REST starts from resources and a uniform interaction model. `GET /products/42` retrieves a representation chosen by the server's media-type contract. That representation can be coarse-grained, include a seller summary, or link to related resources; REST does not require a separate request for every database table. HTTP metadata also supports conditional requests, shared caches, and intermediary visibility.",
    },
    {
      cue: "Describe the server work created by flexible queries",
      stage: "Flexibility has a cost",
      spokenText:
        "GraphQL moves response-shape choice toward the client, so the server must defend a larger execution surface. It should limit depth or calculated cost, cap list sizes, avoid the N+1 query pattern by batching repeated loads, and authorize every selected field in context. Execution can return both partial `data` and an `errors` list, so monitoring only the HTTP status can miss application-level failures.",
    },
    {
      cue: "Match each style to its strongest use case and boundary",
      stage: "Choose by data and clients",
      spokenText:
        "GraphQL is useful when several clients need changing views over connected data and the team can operate its query engine safely. REST is useful when stable resource contracts, standard HTTP caching, broad clients, and visible intermediary behavior matter most. A system can use both at different boundaries. The decision should follow client needs, data shape, authorization, caching, and measured workload.",
      recallRule:
        "GraphQL lets each operation select a typed view; REST publishes resource representations through a uniform interface, and both require deliberate performance and security design.",
    },
  ],
});

// The technology-choice answer starts with the conversation shape, then gives
// each option one clear home and one boundary. The existing Deep Dive and text
// example retain the longer operational checklist and mixed-product scenario.
Object.assign(topics["rest-vs-soap"]["choosing-the-right-api-technology"], {
  direct:
    "There is no universal winner. Choose from the communication pattern and client environment: REST for resource-based HTTP APIs, GraphQL for client-selected connected views, gRPC for typed calls and streams between controlled systems, and WebSocket for a long-lived two-way channel. Measure the real workload and use different technologies at different boundaries when that is simpler.",
  quick: [
    "Start with the interaction: resource request/response, selected graph view, typed RPC or stream, or ongoing two-way messages.",
    "REST fits broad HTTP clients, resource contracts, cacheable reads, and intermediary-friendly public APIs.",
    "GraphQL fits clients that need different connected views, provided the server controls query cost and nested access.",
    "gRPC fits controlled services or native clients that can share generated contracts for unary or streaming calls.",
    "WebSocket fits persistent two-way messaging; SSE, webhooks, streaming HTTP, or polling may be simpler for one-way or occasional updates.",
  ],
  answerSize: "standard",
  lastUpdated: "2026-09-09",
  interviewBeats: [
    {
      cue: "Begin with message direction, duration, and client ownership",
      stage: "Start with the conversation",
      spokenText:
        "Choose the technology from the conversation the systems need, not from a popularity ranking. Ask whether the interaction is a short request and response or a long stream, whether one side or both sides send events, whether clients are public or controlled, and whether normal HTTP caches and intermediaries need to understand the exchange. Those facts narrow the choice quickly.",
      support: {
        type: "comparison",
        title: "Match the dominant conversation before comparing tools",
        items: [
          {
            label: "REST",
            value: "resource request and response",
            detail: "Broad HTTP clients, representations, cache rules, and intermediary visibility.",
            tone: "blue",
          },
          {
            label: "GraphQL",
            value: "client-selected graph view",
            detail: "Different clients choose fields over connected data through one typed schema.",
            tone: "green",
          },
          {
            label: "gRPC",
            value: "typed RPC and streams",
            detail: "Controlled clients share generated service and message contracts.",
            tone: "orange",
          },
          {
            label: "WebSocket",
            value: "persistent two-way messages",
            detail: "Both peers can send application messages over a long-lived connection.",
            tone: "neutral",
          },
        ],
      },
    },
    {
      cue: "Place REST where HTTP resource semantics add value",
      stage: "REST for resource APIs",
      spokenText:
        "REST fits resource-oriented APIs used by browsers, partners, mobile apps, and other broad clients. An interaction such as `GET /orders/42` can use status codes, `ETag`, cache metadata, links, and content negotiation that gateways and clients already understand. It is a strong default for public request/response APIs, but it still needs careful resource and representation design.",
    },
    {
      cue: "Place GraphQL where clients need different connected views",
      stage: "GraphQL for selected views",
      spokenText:
        "GraphQL fits several clients that need different slices of connected data, such as web and mobile home screens changing at different speeds. One typed schema lets each operation select its fields. The trade-off is server work: query-cost limits, resolver batching, nested authorization, caching, and monitoring must be designed instead of assuming flexible queries are free.",
    },
    {
      cue: "Place gRPC where both sides can share a typed service contract",
      stage: "gRPC for controlled RPC",
      spokenText:
        "gRPC fits controlled service-to-service or native-client communication where both sides can use a shared service definition and generated code. A method can be unary, client-streaming, server-streaming, or bidirectional-streaming. That is useful for internal commands and data streams, but browser support, proxy compatibility, contract rollout, debugging, deadlines, and observability must match the real environment.",
    },
    {
      cue: "Reserve WebSocket for a real two-way live channel",
      stage: "WebSocket for two-way live",
      spokenText:
        "WebSocket creates a long-lived channel over which either peer can send messages, which can fit chat, collaborative editing, or multiplayer state. The application still defines message types, authorization, ordering, backpressure, reconnect, and recovery. If only the server pushes browser updates, Server-Sent Events may be simpler; webhooks suit server-to-server notifications, and polling can suit infrequent changes.",
    },
    {
      cue: "Use a small combination when system boundaries differ",
      stage: "Mix boundaries deliberately",
      spokenText:
        "One product may use REST for partner orders, GraphQL for changing mobile screens, gRPC between inventory services, and WebSocket only for live support. This is useful only when each boundary earns its extra tooling. Test representative payloads, concurrency, connection behavior, failure recovery, and team operations. No protocol is universally fastest, and using one technology everywhere is not automatically simpler.",
      recallRule:
        "Match the protocol to direction, duration, client ownership, contract needs, and operations; then measure the workload and keep the mix as small as practical.",
    },
  ],
});

function buildSections(lesson) {
  return [
    { type: "key_points", title: "Quick revision", items: lesson.quick },
    {
      type: "speakable_answer",
      title: "Interview answer",
      answerSize: lesson.answerSize ?? "compact",
      content: lesson.interviewBeats
        ? joinParagraphs(lesson.interviewBeats.map((beat) => beat.spokenText))
        : joinParagraphs(lesson.interview),
      ...(lesson.interviewBeats ? { beats: lesson.interviewBeats } : {}),
    },
    {
      type: "deep_explanation",
      title: lesson.deepTitle,
      content: joinParagraphs(lesson.deep),
    },
    { type: lesson.visual.type, title: lesson.visual.title, content: lesson.visual.content },
    lesson.example.type
      ? { type: lesson.example.type, title: lesson.example.title, content: lesson.example.content }
      : {
          type: "code_example",
          title: lesson.example.title,
          content: `${fenced(lesson.example.language, lesson.example.lines)}\n\n${lesson.example.note}`,
        },
  ];
}

let curated = 0;
let requestedFound = !requestedSlug;
for (const [topic, lessonMap] of Object.entries(topics)) {
  if (requestedSlug && !Object.hasOwn(lessonMap, requestedSlug)) continue;
  const target = path.join(moduleRoot, topic, "complete-qa.json");
  const document = JSON.parse(fs.readFileSync(target, "utf8"));
  if (!Array.isArray(document)) throw new Error(`${topic}: expected a top-level array`);

  const expectedSlugs = Object.keys(lessonMap);
  const actualSlugs = document.map((entry) => entry.slug);
  if (JSON.stringify(actualSlugs) !== JSON.stringify(expectedSlugs)) {
    throw new Error(`${topic}: route set or order changed; expected ${expectedSlugs.join(", ")}`);
  }

  for (const entry of document) {
    if (requestedSlug && entry.slug !== requestedSlug) continue;
    const lesson = lessonMap[entry.slug];
    if (entry.id !== lesson.id || entry.question !== lesson.question) {
      throw new Error(`${topic}/${entry.slug}: ID or question changed unexpectedly`);
    }
    entry.direct_answer = lesson.direct;
    entry.layout_type = "concept-and-protocol-semantics";
    entry.difficulty = entry.difficulty === "basic" ? "easy" : entry.difficulty;
    entry.importance = "high";
    entry.reading_time_minutes = lesson.minutes;
    if (lesson.lastUpdated) entry.last_updated = lesson.lastUpdated;
    delete entry.interviewer_intent;
    delete entry.speakable_v2;
    entry.answer = { sections: buildSections(lesson) };
    entry.followup_questions = lesson.followups;
    entry.seo = {
      metaTitle: `${entry.title} | InterviewExplainer`,
      metaDescription: lesson.direct.replace(/`/g, "").slice(0, 155),
    };
    curated += 1;
    requestedFound = true;
  }

  fs.writeFileSync(target, `${JSON.stringify(document, null, 2)}\n`);
}

if (!requestedFound) {
  throw new Error(`Unknown requested slug: ${requestedSlug}`);
}
console.log(`Curated ${curated} Java REST lessons across ${Object.keys(topics).length} topics; preserved IDs, slugs, questions, routes, and order.`);
