#!/usr/bin/env node

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const target = path.join(
  repoRoot,
  "content/java-backend-fresher/rest-api-basics/http-methods/complete-qa.json",
);
const document = JSON.parse(fs.readFileSync(target, "utf8"));
const requestedSlug = process.argv[2] ?? null;

const lessons = {
  "http-methods-overview": {
    direct: "HTTP methods describe the requested semantics for a target resource: `GET` retrieves, `HEAD` retrieves metadata without response content, `POST` submits data for resource-specific processing, `PUT` creates or replaces state at a known URI, `PATCH` applies a partial change, and `DELETE` requests removal of the URI's association.",
    minutes: 9,
    quick: [
      "`GET` and `HEAD` read a selected representation; `HEAD` returns the same metadata without response content.",
      "`POST` submits content for processing, which may create a resource but is not limited to creation.",
      "`PUT` creates or replaces the state of the resource at the target URI.",
      "`PATCH` applies changes described by a patch document; its exact semantics come from the patch media type.",
      "`DELETE` requests that the server remove the target URI's association; success does not promise immediate physical deletion.",
    ],
    interview: "An HTTP method tells the server what the client wants to do with a resource. `GET` reads data, `POST` submits data for processing, `PUT` creates or replaces state at a known URI, `PATCH` changes part of a resource, and `DELETE` asks the server to remove the target resource relationship.\n\nFor example, `GET /orders/42` reads order 42. `POST /orders` can create a new order. `PUT /orders/42` supplies the intended full state, `PATCH /orders/42` changes selected fields, and `DELETE /orders/42` removes access to that resource.\n\nThe method is more than a controller name. Browsers, caches, gateways, documentation, and retry logic use its standard meaning. `HEAD` is like GET for metadata but returns no response content. POST is not limited to creation; it can also start a job or process a command.\n\nChoose the method from the real operation, not only a CRUD chart. GET and HEAD are safe and idempotent. PUT and DELETE are idempotent but change state. POST and PATCH do not have a general idempotency guarantee.",
    deepTitle: "Methods are shared contracts, not controller names",
    deep: "HTTP intermediaries understand method properties even when they do not know the application's code. A cache can treat GET specially, a client can reason about retrying an idempotent request, and a crawler can follow safe links because the method carries common meaning.\n\nCRUD is a useful first mapping but not the definition. POST is intentionally broad, PUT addresses the target resource directly, and DELETE changes the URI relationship without specifying a storage engine operation. A method can also have conditional headers, authentication, and content negotiation around its core semantics.\n\nA server that maps every action to POST may still function, but it discards information the protocol could have communicated.",
    visualType: "comparison_table",
    visualTitle: "Method semantics at a glance",
    visual: "| Method | Core request | Safe? | Idempotent by method semantics? |\n|---|---|---:|---:|\n| `GET` | Retrieve representation | Yes | Yes |\n| `HEAD` | Retrieve metadata without response content | Yes | Yes |\n| `POST` | Process submitted content | No | No |\n| `PUT` | Create or replace target state | No | Yes |\n| `PATCH` | Apply a patch document | No | No guarantee |\n| `DELETE` | Remove target URI association | No | Yes |",
    codeTitle: "One order resource, different requests",
    code: "```http\nGET /orders/42 HTTP/1.1\nHost: api.example.com\n\nPATCH /orders/42 HTTP/1.1\nHost: api.example.com\nContent-Type: application/merge-patch+json\nIf-Match: \"v7\"\n\n{\"status\": \"shipped\"}\n```\n\nThe URI continues to identify order 42. The method and patch media type describe what should happen to it, while `If-Match` protects against overwriting a newer version.",
    practiceTitle: "Do not force every operation into CRUD",
    practice: "For `POST /reports`, decide whether the server creates a report resource immediately, accepts an asynchronous job, or simply returns a calculated representation. That decision determines status codes and links more accurately than the word POST alone.",
    followups: [
      "Why is POST not limited to resource creation?",
      "What does a successful DELETE guarantee about storage?",
      "How is HEAD related to GET?",
    ],
  },
  "put-vs-patch": {
    direct: "`PUT` supplies the intended state of the target resource and is idempotent by method semantics. `PATCH` supplies instructions for modifying part of a resource; PATCH is not inherently idempotent, although a particular patch operation can be designed to be idempotent.",
    minutes: 9,
    quick: [
      "`PUT` targets a known URI and creates or replaces that resource's state.",
      "Repeating the same `PUT` has the same intended effect, so PUT is idempotent.",
      "`PATCH` applies changes described by its media type rather than a full replacement representation.",
      "PATCH has no general idempotency guarantee; setting a value can be idempotent, while incrementing or appending is not.",
      "Use validators such as `If-Match` with an ETag to avoid lost updates in either form.",
    ],
    interview: "`PUT` and `PATCH` both update a resource, but their request bodies mean different things. A PUT body describes the intended state of the target resource. A PATCH body describes changes to apply to the current state.\n\nSuppose a user owns one preferences document. `PUT /users/42/preferences` can send the complete replacement. To change only the display name, `PATCH /users/42` can send a merge patch such as `{\"displayName\":\"Ada\"}`.\n\nPUT is idempotent: repeating the same request should leave the same intended state. PATCH has no automatic guarantee. Setting a field to one value may be idempotent, while incrementing a counter or appending an item is not.\n\nThe API must document what omitted and null fields mean and which patch format it accepts. Both methods can overwrite another user's newer edit, so an ETag with `If-Match` is useful when concurrent updates matter.",
    deepTitle: "Replacement, patch format, and concurrency are separate choices",
    deep: "PUT's idempotency comes from its semantics, not from a framework annotation. An implementation that treats the same PUT as “increment” violates that contract. PATCH deliberately leaves change semantics to the patch document, so clients must know both the endpoint and the media type.\n\nPartial payload and PATCH are not synonyms. A custom endpoint could define a partial PUT, but then its representation is no longer the normal replacement model and portability suffers. Likewise, JSON Merge Patch gives `null` a removal meaning that may make “set this field to JSON null” hard to express.\n\nConditional requests solve a different problem: they prevent a valid update from being applied to an unexpectedly newer resource.",
    visualType: "comparison_table",
    visualTitle: "Compare the update contracts",
    visual: "| Question | `PUT` | `PATCH` |\n|---|---|---|\n| What does the body mean? | Intended target state | Change instructions |\n| Idempotent by method definition? | Yes | No guarantee |\n| Common format | Resource representation | JSON Patch, Merge Patch, or custom |\n| Can it create at target URI? | Yes, if the server allows | Normally modifies an existing resource |\n| Needs concurrency protection? | Often | Often |",
    codeTitle: "Protect a partial update with an ETag",
    code: "```http\nPATCH /users/42 HTTP/1.1\nHost: api.example.com\nContent-Type: application/merge-patch+json\nIf-Match: \"profile-v12\"\n\n{\"displayName\": \"Ada L.\"}\n```\n\nThe patch changes one field only if version 12 is still current. A stale client receives `412 Precondition Failed` instead of silently overwriting a newer edit.",
    practiceTitle: "Test a retry twice",
    practice: "Apply a proposed patch twice to the same starting state. `replace /status with shipped` reaches the same state; `add an item to /tags/-` may append twice. Document whether automatic retry is safe.",
    followups: [
      "Why is PATCH not inherently idempotent?",
      "What is the role of a patch media type?",
      "How does `If-Match` prevent a lost update?",
    ],
  },
  "http-methods-in-spring-boot": {
    direct: "Spring MVC maps methods with `@GetMapping`, `@PostMapping`, `@PutMapping`, `@PatchMapping`, and `@DeleteMapping`. A controller still has to implement the matching HTTP semantics, validate input, call application logic, and return an appropriate status and representation.",
    minutes: 10,
    quick: [
      "Use `@RestController` for handlers whose return values are written to the response body.",
      "Use the specialized mapping annotation that matches the endpoint's HTTP contract.",
      "Read path identifiers with `@PathVariable`, query controls with `@RequestParam`, and request content with `@RequestBody`.",
      "Validate a request DTO with `@Valid`; do not bind persistence entities as the public API contract.",
      "Return `ResponseEntity` when status, headers, or an empty response must be controlled explicitly.",
    ],
    interview: "Spring MVC maps HTTP methods with `@GetMapping`, `@PostMapping`, `@PutMapping`, `@PatchMapping`, and `@DeleteMapping`. These annotations tell `DispatcherServlet` which controller method should handle a request.\n\nFor example, `@GetMapping(\"/{id}\")` can read `/orders/42` through `@PathVariable`. A create method can use `@PostMapping`, read JSON with `@RequestBody`, validate a DTO with `@Valid`, and return `201 Created` with a `Location` header.\n\n`@RequestParam` reads query values such as `?status=paid`. Jackson commonly converts JSON to and from DTOs. The controller should translate HTTP input, call the service, and build the HTTP response; business and database rules belong outside it.\n\nAn annotation does not make an endpoint semantically correct. A GET handler can still wrongly change state, and a PUT handler can still implement non-idempotent logic. Test the method, path, validation, status, headers, JSON, and error response together.",
    deepTitle: "HTTP method mapping through Spring MVC",
    deep: "Spring's dispatcher selects a handler from the path, method, media types, and other mapping conditions. Argument resolvers fill path and query parameters, while an `HttpMessageConverter` reads request content. Bean Validation can reject an invalid DTO before service logic runs.\n\nThe handler's return value travels back through response handling and message conversion. `ResponseEntity` carries status and headers directly; a plain DTO normally becomes response content with a successful status. Exceptions can cross to a central advice class that produces one error format.\n\nThis pipeline is why controllers should not contain persistence details: each layer has a clear boundary that can be tested independently.",
    visualType: "flow_diagram",
    visualTitle: "Spring MVC request path",
    visual: "```mermaid\nflowchart LR\n  A[HTTP request] --> B[DispatcherServlet]\n  B --> C[Handler mapping]\n  C --> D[Argument resolution + JSON conversion]\n  D --> E[Bean Validation]\n  E --> F[Controller]\n  F --> G[Service]\n  G --> H[Response DTO + status + headers]\n  H --> I[JSON response]\n  E -. invalid .-> J[Controller advice / problem response]\n```",
    codeTitle: "Create a resource with an explicit response",
    code: "```java\n@RestController\n@RequestMapping(\"/orders\")\nclass OrderController {\n    private final OrderService orders;\n\n    OrderController(OrderService orders) {\n        this.orders = orders;\n    }\n\n    @PostMapping\n    ResponseEntity<OrderResponse> create(\n            @Valid @RequestBody CreateOrderRequest request) {\n        OrderResponse created = orders.create(request);\n        URI location = URI.create(\"/orders/\" + created.id());\n        return ResponseEntity.created(location).body(created);\n    }\n\n    @GetMapping(\"/{id}\")\n    OrderResponse find(@PathVariable long id) {\n        return orders.find(id);\n    }\n}\n```",
    practiceTitle: "Review the contract, not only the annotation",
    practice: "For each handler, check method semantics, accepted `Content-Type`, validation, status, response media type, and error path. A route that compiles can still violate its HTTP contract.",
    followups: [
      "What is the difference between `@Controller` and `@RestController`?",
      "When should a handler return `ResponseEntity`?",
      "Why should request DTOs be separate from JPA entities?",
    ],
  },
  "idempotency-in-http-methods": {
    direct: "An idempotent HTTP method has the same intended effect on the server after one identical request or several. `GET`, `HEAD`, `OPTIONS`, `TRACE`, `PUT`, and `DELETE` are idempotent by method semantics; `POST` and `PATCH` have no general idempotency guarantee.",
    minutes: 9,
    quick: [
      "Idempotency concerns the intended server effect, not identical response bodies or status codes.",
      "Safe methods are idempotent, and `PUT` plus `DELETE` are idempotent but unsafe.",
      "`POST` and `PATCH` are not idempotent by method definition, although an operation can add its own guarantee.",
      "A second DELETE may return a different response while the requested resource state remains absent.",
      "Idempotency keys and conditional requests can make retries safer, but their storage and conflict rules must be defined.",
    ],
    interview: "Idempotency means that sending the same request several times has the same intended server effect as sending it once. The responses do not have to be identical; a later DELETE may return 404 even though the resource remains deleted.\n\nFor example, repeating the same `PUT /settings/42` should leave the same settings. GET, HEAD, OPTIONS, TRACE, PUT, and DELETE are idempotent by HTTP semantics. POST and PATCH have no general idempotency guarantee.\n\nThis matters when a client times out and cannot tell whether the server completed the first request. A payment API can make POST retry-safe with an idempotency key. It stores the key with the request identity and result, then returns the earlier result for a matching retry.\n\nThe server must define key expiry, concurrent requests, failures, and reuse with different content. Retry logic still needs timeouts and backoff. A method's label alone is not enough if the implementation breaks its promised effect.",
    deepTitle: "Retry safety needs an operation identity",
    deep: "A network can lose the response after the server commits the change. From the client, that looks the same as a request the server never received. Idempotent semantics let the request be repeated without repeating the intended effect.\n\nAn idempotency key gives a non-idempotent operation a stable identity. A robust server binds the key to a normalized request fingerprint, stores the processing state durably for a defined lifetime, and returns the original outcome. Merely checking then inserting without an atomic constraint still allows concurrent duplicates.\n\nConditional requests solve version conflicts rather than duplicate operation identity. `If-Match` prevents applying a change to an unexpected version; an idempotency key prevents executing the same logical operation twice.",
    visualType: "sequence_diagram",
    visualTitle: "A response is lost, then the client retries",
    visual: "```mermaid\nsequenceDiagram\n  participant C as Client\n  participant A as API\n  participant S as Idempotency store\n  C->>A: POST /payments (key K, request R)\n  A->>S: atomically reserve K for fingerprint(R)\n  A->>A: create payment P\n  A->>S: store completed response for K\n  A--xC: response lost\n  C->>A: retry same K and R\n  A->>S: load completed K\n  A-->>C: return original outcome; no second payment\n```",
    codeTitle: "The key represents one logical operation",
    code: "```http\nPOST /payments HTTP/1.1\nHost: api.example.com\nContent-Type: application/json\nIdempotency-Key: 82c35d3e-8d70-44f9-aaf3-24ad14d8e615\n\n{\"orderId\": \"O-42\", \"amount\": 1999, \"currency\": \"INR\"}\n```\n\nA retry uses the same key only for the same logical request. The API must define expiry, mismatch, in-progress, and failure behavior.",
    practiceTitle: "Classify the operation, not only the verb",
    practice: "`PATCH {\"status\": \"paid\"}` can reach the same state twice; `PATCH {\"creditsToAdd\": 10}` does not. The method remains non-idempotent by specification, while the first endpoint operation has idempotent behavior.",
    followups: [
      "Can an idempotent request return different responses?",
      "Why is PATCH not idempotent by specification?",
      "What race must an idempotency-key store prevent?",
    ],
  },
  "safe-http-methods": {
    direct: "Safe HTTP methods have read-only intended semantics: `GET`, `HEAD`, `OPTIONS`, and `TRACE`. They may cause incidental logging, billing, or cache updates, but the client did not request a state change and must not be blamed for one.",
    minutes: 8,
    quick: [
      "The standard safe methods are `GET`, `HEAD`, `OPTIONS`, and `TRACE`.",
      "Safe means the client did not request an application-state change; it does not mean zero server activity.",
      "Every safe method is idempotent, but an idempotent method such as `DELETE` is not safe.",
      "Automated agents, prefetchers, crawlers, and caches rely on safe-method semantics.",
      "Never hide a destructive action behind a GET link or query parameter.",
    ],
    interview: "A safe HTTP method asks only for information; the client does not request a change to application state. HTTP defines GET, HEAD, OPTIONS, and TRACE as safe.\n\nFor example, a browser may prefetch a GET link and a crawler may follow it. If `GET /orders/42?delete=true` deletes an order, those automatic reads can cause data loss. The delete operation must use an unsafe method and normal authorization or confirmation.\n\nA safe request can still cause internal work. The server may write logs, update metrics, fill a cache, or charge for processing. These are side effects of handling the read, not state changes requested by the client.\n\nSafe and idempotent are different. Every safe method is idempotent, but PUT and DELETE are idempotent without being safe because they request a change. Method choice helps clients, caches, security controls, and developers understand risk.",
    deepTitle: "Safety records who requested the effect",
    deep: "A server is allowed to maintain itself while serving a safe request. Rotating logs or incrementing an internal metric does not redefine GET as unsafe because those actions are not what the request asks for. Charging a customer's account or cancelling an order would be requested business effects and therefore cannot be hidden behind GET.\n\nWeb forms and links make the difference concrete. A link naturally issues GET and can be followed automatically. An unsafe operation needs an explicit submission or API call and may require replay protection.\n\nTRACE is standardized as safe but is commonly disabled for security and operational reasons. Safety describes semantics; it does not mean every server must enable the method.",
    visualType: "comparison_table",
    visualTitle: "Safety and idempotency are different axes",
    visual: "| Method group | Safe? | Idempotent? | Example |\n|---|---:|---:|---|\n| `GET`, `HEAD`, `OPTIONS`, `TRACE` | Yes | Yes | Read or inspect capabilities |\n| `PUT`, `DELETE` | No | Yes | Replace or remove target state |\n| `POST`, `PATCH` | No | No guarantee | Process content or apply a patch |",
    codeTitle: "Keep destructive behavior out of GET",
    code: "```http\n# Wrong: a crawler or prefetcher can follow this link\nGET /orders/42?cancel=true HTTP/1.1\n\n# Better: the unsafe operation is explicit\nPOST /orders/42/cancellation HTTP/1.1\nContent-Type: application/json\nIdempotency-Key: 91b67ce8-8144-43c4-8244-b50da62e5cbc\n\n{\"reason\": \"customer_request\"}\n```\n\nThe exact cancellation design can also use a state update, but it must not pretend to be a safe retrieval.",
    practiceTitle: "Separate incidental work from requested business change",
    practice: "Access logging during GET is compatible with safe semantics. Deducting inventory because GET was called is not. Ask what effect the client is intentionally requesting.",
    followups: [
      "Can a safe request write an access log?",
      "Why is DELETE idempotent but not safe?",
      "Why is a destructive GET dangerous even when authorization is checked?",
    ],
  },
};

// The overview groups methods by protocol meaning rather than repeating the
// Deep Dive table. Each beat explains how generic HTTP components interpret the
// method and where simple CRUD shorthand becomes inaccurate.
Object.assign(lessons["http-methods-overview"], {
  answerSize: "standard",
  interviewBeats: [
    {
      cue: "Define an HTTP method as shared request semantics",
      stage: "Method carries intent",
      spokenText:
        "An HTTP method is part of the request semantics: it tells the origin and intermediaries what kind of operation the client is asking for on the target URI. It is not just a name mapped to a controller method. Browsers, caches, gateways, crawlers, and retry code can act correctly only when the method keeps its standard meaning.",
    },
    {
      cue: "Explain the common retrieval and capability methods",
      stage: "GET, HEAD, and OPTIONS",
      spokenText:
        "`GET` retrieves a selected representation and should not request a business-state change. `HEAD` asks for the same kind of response metadata as GET, but the server sends no response content. `OPTIONS` asks which communication options are available for a target or server and is often seen in browser CORS exchanges. These methods have safe, read-oriented semantics.",
    },
    {
      cue: "Separate target-specific processing from target replacement",
      stage: "POST and PUT",
      spokenText:
        "`POST` submits content for processing according to the target resource's rules. `POST /orders` may create an order, but POST can also start a job or submit a command. `PUT` creates or replaces the state at a known target URI. Repeating the same `PUT /orders/42` representation has the same intended effect, which is why PUT is idempotent by method semantics.",
    },
    {
      cue: "Explain patch documents and the boundary of deletion",
      stage: "PATCH and DELETE",
      spokenText:
        "`PATCH` applies change instructions whose meaning comes from the patch media type, such as JSON Merge Patch; it is not automatically idempotent. `DELETE /orders/42` asks the server to remove the association between that URI and its current functionality. A successful DELETE does not promise immediate physical erasure from a database, audit log, or backup.",
    },
    {
      cue: "Connect safe and idempotent properties to client behaviour",
      stage: "Safety and retry semantics",
      spokenText:
        "Safe methods such as `GET`, `HEAD`, and `OPTIONS` do not ask for a business-state change. `GET`, `HEAD`, `OPTIONS`, `TRACE`, `PUT`, and `DELETE` are idempotent by standard semantics, so repeating them has the same intended effect. `POST` and `PATCH` have no general idempotency guarantee. These properties guide prefetching and retries, but the implementation must still honour the method contract.",
      recallRule:
        "Choose a method by the requested HTTP semantics, then verify its safety, idempotency, target, and representation contract.",
    },
  ],
});

// PUT and PATCH are compared by what their bodies mean, not by payload size.
// The focused two-column support leaves patch formats and concurrency details
// to the authored beats and the existing Deep Dive material.
Object.assign(lessons["put-vs-patch"], {
  answerSize: "standard",
  interviewBeats: [
    {
      cue: "Define the two update contracts before discussing payload size",
      stage: "Different body contracts",
      spokenText:
        "`PUT` and `PATCH` can both update a resource, but their request bodies have different meanings. A PUT representation describes the intended state of the target resource. A PATCH document describes changes to apply to its current state. The difference is replacement state versus change instructions, not simply a large body versus a small body.",
      support: {
        type: "comparison",
        title: "Replacement state versus change instructions",
        items: [
          {
            label: "PUT",
            value: "intended target state",
            detail: "Create or replace the state at the known target URI; idempotent by method semantics.",
            tone: "blue",
          },
          {
            label: "PATCH",
            value: "patch instructions",
            detail: "Apply changes defined by the patch media type; no general idempotency guarantee.",
            tone: "green",
          },
        ],
      },
    },
    {
      cue: "Apply PUT to a known resource and explain idempotency",
      stage: "PUT sets target state",
      spokenText:
        "With `PUT /users/42/preferences`, the body can describe the intended preferences resource. If that resource exists, the server replaces its state; if it does not exist, the server may create it when the contract allows creation at that URI. Sending the same PUT again should leave the same intended state. The later response status may differ, but the requested effect remains idempotent.",
    },
    {
      cue: "Show how a patch format defines the requested changes",
      stage: "PATCH applies instructions",
      spokenText:
        "With `PATCH /users/42`, a JSON Merge Patch such as `{\"displayName\":\"Ada\"}` sets one member while leaving unmentioned members alone. JSON Patch instead carries operations such as replace or add. Setting a field to one value can be idempotent, while incrementing a counter or appending an item may repeat the change. PATCH therefore has no method-wide idempotency guarantee.",
    },
    {
      cue: "Separate update meaning from lost-update protection",
      stage: "Protect concurrent edits",
      spokenText:
        "The API must document the accepted patch media type and what omitted or `null` members mean. Both PUT and PATCH can overwrite a newer edit, so a client can send `If-Match` with the current ETag; a mismatch produces `412 Precondition Failed`. A small partial JSON body is not automatically PATCH—the media type defines its meaning—and both methods still require authorization, validation, and clear response statuses.",
      recallRule:
        "PUT supplies intended target state; PATCH supplies typed change instructions; conditional headers protect either form from stale writes.",
    },
  ],
});

// Idempotency is explained through effect, protocol defaults, and one lost-
// response retry. The compact method grouping supports recall without
// duplicating the payment sequence already taught in the Deep Dive.
Object.assign(lessons["idempotency-in-http-methods"], {
  answerSize: "standard",
  lastUpdated: "2026-09-08",
  interviewBeats: [
    {
      cue: "Define idempotency by the intended server effect",
      stage: "Same intended effect",
      spokenText:
        "An HTTP method is idempotent when several identical requests have the same intended effect on the server as one request. It does not mean every response is identical, every request is free, or the server performs no internal work. Each attempt may create an access log entry; the important rule is that the requested resource effect is not applied again.",
    },
    {
      cue: "Group the standard methods by their protocol guarantee",
      stage: "Methods define retry defaults",
      spokenText:
        "HTTP defines the safe methods `GET`, `HEAD`, `OPTIONS`, and `TRACE` as idempotent. `PUT` and `DELETE` are also idempotent even though they request a state change. `POST` and `PATCH` have no general idempotency guarantee, but a particular endpoint can add one. For example, setting a status to `paid` can be repeatable, while adding ten credits repeats the change.",
      support: {
        type: "comparison",
        title: "Idempotency by standard method semantics",
        items: [
          {
            label: "GET, HEAD, OPTIONS, TRACE",
            value: "safe and idempotent",
            detail: "The client asks for information or communication options, not a business-state change.",
            tone: "blue",
          },
          {
            label: "PUT and DELETE",
            value: "idempotent, not safe",
            detail: "They change target state, but repeating the same request keeps the same intended effect.",
            tone: "green",
          },
          {
            label: "POST and PATCH",
            value: "no general guarantee",
            detail: "The endpoint can define retry-safe behavior, but the method name does not promise it.",
            tone: "orange",
          },
        ],
      },
    },
    {
      cue: "Use a lost response to distinguish effect from response",
      stage: "Retries expose the value",
      spokenText:
        "Suppose `DELETE /orders/42` succeeds but its response is lost. Repeating it can return `404 Not Found` because the order is already absent, while the intended final state is still the same. Likewise, repeating the same `PUT /settings/42` representation should leave the same settings. Different status codes do not by themselves make the operation non-idempotent.",
    },
    {
      cue: "Show how a POST operation can receive a stable identity",
      stage: "POST can add a retry contract",
      spokenText:
        "A payment create request cannot safely run twice, so an API can accept an idempotency key with `POST /payments`. The key represents one logical operation. A matching retry with the same request returns the stored outcome instead of creating a second payment; reuse of that key with different content should be rejected rather than silently treated as the first request.",
    },
    {
      cue: "Name the concurrency and lifetime boundary of a key",
      stage: "Deduplication must be atomic",
      spokenText:
        "The server must reserve the key atomically before executing the operation, record in-progress and completed states durably, and define what happens after failures or key expiry. A check followed by a separate insert can still let two concurrent requests through. Timeouts and backoff remain necessary, and `If-Match` solves a different problem: stale resource versions rather than duplicate operation identity.",
      recallRule:
        "Idempotency is sameness of intended effect; method semantics provide the default, while a non-idempotent operation needs a deliberate, atomic retry contract.",
    },
  ],
});

// The Spring answer follows one request from its HTTP contract into a
// controller method. The compact mapping support answers the annotation
// question directly; the existing Deep Dive owns the full MVC pipeline.
Object.assign(lessons["http-methods-in-spring-boot"], {
  answerSize: "standard",
  lastUpdated: "2026-09-08",
  interviewBeats: [
    {
      cue: "Connect an HTTP method and path to one Java handler",
      stage: "Mappings select the handler",
      spokenText:
        "In Spring MVC, a mapping annotation connects an HTTP method and path to one controller method. `@GetMapping`, `@PostMapping`, `@PutMapping`, `@PatchMapping`, and `@DeleteMapping` are method-specific shortcuts for `@RequestMapping`. A class-level `@RequestMapping(\"/orders\")` can hold the common path, while each method adds its own path and HTTP method.",
      support: {
        type: "comparison",
        title: "HTTP contract to Spring mapping",
        items: [
          {
            label: "GET /orders/{id}",
            value: "@GetMapping(\"/{id}\")",
            detail: "Read one order without requesting a business-state change.",
            tone: "blue",
          },
          {
            label: "POST /orders",
            value: "@PostMapping",
            detail: "Submit a new order representation for processing.",
            tone: "green",
          },
          {
            label: "PUT or PATCH /orders/{id}",
            value: "@PutMapping or @PatchMapping",
            detail: "Replace target state or apply documented change instructions.",
            tone: "orange",
          },
          {
            label: "DELETE /orders/{id}",
            value: "@DeleteMapping(\"/{id}\")",
            detail: "Request removal of the target resource association.",
            tone: "neutral",
          },
        ],
      },
    },
    {
      cue: "Show how request values become Java arguments",
      stage: "Bind each input by its source",
      spokenText:
        "The method parameters say where input comes from. `@PathVariable long id` reads the `42` in `/orders/42`. `@RequestParam String status` reads a query value such as `?status=paid`. `@RequestBody CreateOrderRequest request` asks an HTTP message converter, commonly backed by Jackson for JSON, to create the DTO. Adding `@Valid` runs Bean Validation before normal controller logic when validation is configured.",
    },
    {
      cue: "Explain how controller return values become HTTP responses",
      stage: "Return the HTTP outcome",
      spokenText:
        "Because `@RestController` includes response-body handling, returning an `OrderResponse` normally serializes that DTO into the response. Use `ResponseEntity` when the result needs an explicit status or headers. For a successful create, `return ResponseEntity.created(location).body(created);` sends `201 Created`, a `Location` header, and the created representation. A delete with nothing to return can use a 204 response instead.",
    },
    {
      cue: "Separate routing syntax from correct endpoint behaviour",
      stage: "Mappings need semantics",
      spokenText:
        "The annotation chooses the handler; it does not make the endpoint correct. A method marked `@GetMapping` must still avoid a requested state change, and a `@PutMapping` implementation must preserve PUT's idempotent replacement meaning. Keep HTTP translation in the controller, call a service for business work, and use request and response DTOs instead of exposing persistence entities as the public contract.",
      recallRule:
        "Map the method and path, bind input from the right place, return the real HTTP result, and keep the implementation faithful to the method semantics.",
    },
  ],
});

// Safety is presented through the client's requested effect and the concrete
// risk of automated GET requests. The existing Deep Dive keeps the broader
// safety/idempotency discussion and the complete HTTP example.
Object.assign(lessons["safe-http-methods"], {
  direct:
    "Safe HTTP methods have essentially read-only request semantics: `GET`, `HEAD`, `OPTIONS`, and `TRACE`. They can still trigger incidental server work such as access logging or cache maintenance; safety means the client did not ask for an application-state change.",
  answerSize: "standard",
  lastUpdated: "2026-09-08",
  interviewBeats: [
    {
      cue: "Define safety from the effect requested by the client",
      stage: "Safe means read-only intent",
      spokenText:
        "A safe HTTP method has essentially read-only request semantics: the client asks for information or communication options and does not ask the server to change application state. HTTP defines `GET`, `HEAD`, `OPTIONS`, and `TRACE` as safe. Safety describes the method contract, not whether the server performs absolutely no internal work.",
    },
    {
      cue: "Separate incidental server work from a requested business action",
      stage: "Internal work can still happen",
      spokenText:
        "A safe request may write an access log, update a metric, or fill a cache. Those effects happen while serving the read; they are not the business action requested by the client. Cancelling an order, charging the customer for an order, or reducing inventory is different because it changes application state on the client's behalf and must not be hidden inside GET.",
    },
    {
      cue: "Show why crawlers and prefetchers depend on the distinction",
      stage: "Automatic reads stay harmless",
      spokenText:
        "Browsers can prefetch links, crawlers can follow them, and caches can retrieve them automatically. If `GET /orders/42?cancel=true` cancels an order, an automated reader can cause data loss simply by following a URI. The cancellation needs an unsafe operation such as `POST /orders/42/cancellation` or a documented state update, together with the normal authorization and retry rules.",
      support: {
        type: "comparison",
        title: "Same resource, different requested effects",
        items: [
          {
            label: "GET /orders/42",
            value: "safe read",
            detail: "A crawler or prefetcher may retrieve it without asking to change the order.",
            tone: "blue",
          },
          {
            label: "GET /orders/42?cancel=true",
            value: "broken contract",
            detail: "A read-shaped request secretly performs a destructive business action.",
            tone: "orange",
          },
          {
            label: "POST /orders/42/cancellation",
            value: "explicit unsafe action",
            detail: "The method makes the requested state change visible to clients and controls.",
            tone: "green",
          },
        ],
      },
    },
    {
      cue: "Distinguish safety from idempotency and availability",
      stage: "Safety vs idempotency",
      spokenText:
        "Every safe method is also idempotent, but the reverse is not true. `PUT` and `DELETE` are idempotent by method semantics because repeating them has the same intended effect, yet they are not safe because they request a change. `TRACE` is standardized as safe but is often disabled; a method can be safe by semantics without every server choosing to support it.",
      recallRule:
        "Ask what effect the client requested: information is safe, while a requested business-state change is unsafe even when it can be repeated idempotently.",
    },
  ],
});

const difficulties = {
  "http-methods-overview": "easy",
  "put-vs-patch": "easy",
  "http-methods-in-spring-boot": "easy",
  "idempotency-in-http-methods": "medium",
  "safe-http-methods": "medium",
};

for (const entry of document) {
  if (requestedSlug && entry.slug !== requestedSlug) continue;
  const lesson = lessons[entry.slug];
  if (!lesson) continue;
  entry.direct_answer = lesson.direct;
  entry.layout_type = "concept-and-protocol-semantics";
  entry.difficulty = difficulties[entry.slug];
  entry.importance = "high";
  entry.reading_time_minutes = lesson.minutes;
  delete entry.interviewer_intent;
  delete entry.speakable_v2;
  entry.answer = {
    sections: [
      { type: "key_points", title: "Quick revision", items: lesson.quick },
      {
        type: "speakable_answer",
        title: "Interview answer",
        answerSize: lesson.answerSize ?? "compact",
        content: lesson.interviewBeats
          ? lesson.interviewBeats.map((beat) => beat.spokenText).join("\n\n")
          : lesson.interview,
        ...(lesson.interviewBeats ? { beats: lesson.interviewBeats } : {}),
      },
      { type: "deep_explanation", title: lesson.deepTitle, content: lesson.deep },
      { type: lesson.visualType, title: lesson.visualTitle, content: lesson.visual },
      { type: "code_example", title: lesson.codeTitle, content: lesson.code },
      { type: "practice_prompt", title: lesson.practiceTitle, content: lesson.practice },
    ],
  };
  entry.followup_questions = lesson.followups;
  entry.seo = {
    metaTitle: `${entry.title} | InterviewExplainer`,
    metaDescription: lesson.direct.replace(/`/g, "").slice(0, 155),
  };
  if (lesson.lastUpdated) entry.last_updated = lesson.lastUpdated;
}

const selectedLessonSlugs = requestedSlug ? [requestedSlug] : Object.keys(lessons);
const unknown = selectedLessonSlugs.filter((slug) => !Object.hasOwn(lessons, slug));
if (unknown.length) throw new Error(`Unknown lesson: ${unknown.join(", ")}`);

const missing = selectedLessonSlugs.filter(
  (slug) => !document.some((entry) => entry.slug === slug),
);
if (missing.length) throw new Error(`Missing target questions: ${missing.join(", ")}`);

fs.writeFileSync(target, `${JSON.stringify(document, null, 2)}\n`);
console.log(`Curated ${selectedLessonSlugs.length} HTTP method lesson${selectedLessonSlugs.length === 1 ? "" : "s"}; preserved IDs, slugs, questions, and order.`);
