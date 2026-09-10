#!/usr/bin/env node

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const target = path.join(
  repoRoot,
  "content/java-backend-fresher/rest-api-basics/http-status-codes/complete-qa.json",
);
const document = JSON.parse(fs.readFileSync(target, "utf8"));
const requestedSlug = process.argv[2] ?? null;

const lessons = {
  "http-status-code-ranges": {
    direct: "HTTP status codes are grouped by their first digit: 1xx gives interim information, 2xx reports success, 3xx redirects or reuses another representation, 4xx reports a problem attributed to the request, and 5xx reports that the server failed to fulfil a valid-looking request.",
    minutes: 9,
    quick: [
      "`1xx` — the request is still in progress or the protocol is switching; these are interim responses.",
      "`2xx` — the request succeeded; the exact code explains whether content is returned, created, or absent.",
      "`3xx` — another location, cached representation, or follow-up action is involved.",
      "`4xx` — the request cannot be fulfilled because of a client-side condition such as bad input, missing credentials, or a missing target.",
      "`5xx` — the server or an upstream dependency failed while handling a request that appeared valid.",
    ],
    interview: "An HTTP status code is a three-digit result sent by the server. The first digit gives the broad class, while the full code tells the client the specific outcome.\n\n`1xx` is informational. `2xx` means success, such as `200 OK`, `201 Created`, or `204 No Content`. `3xx` tells the client or cache to use another location or a stored representation; `304 Not Modified` is a cache result, not a normal page redirect.\n\n`4xx` means the request could not be completed because of something about the request. Malformed JSON may return 400, missing credentials 401, and an unknown resource 404.\n\n`5xx` means the server failed to complete an apparently valid request. A code bug may return 500, a bad upstream response 502, and temporary unavailability 503.\n\nUse the most specific standard code that matches what happened. The class gives quick direction, but the exact code and error body tell the client whether to fix input, authenticate, retry, redirect, or stop.",
    deepTitle: "The class is a summary; the code is the contract",
    deep: "Status classes let generic software react even when it does not recognize every code. A proxy can treat an unknown `2xx` as success-class and an unknown `5xx` as server-failure-class, while an application that understands the exact code can make a more precise decision.\n\nThe response body adds human or domain detail but does not replace the status. Returning `200` with `{\"success\": false}` hides failure from caches, monitoring, SDKs, and clients that rely on HTTP semantics. Conversely, a `404` can still include a useful problem representation.\n\nRetry decisions need more than the first digit. A `503` may be temporary, but retrying an unsafe operation can duplicate work unless the endpoint supplies an idempotency contract. A `409` may require the client to fetch current state before trying again.",
    visualType: "comparison_table",
    visualTitle: "Read a status from broad outcome to exact meaning",
    visual: "| Range | Meaning | Representative codes | Typical next step |\n|---|---|---|---|\n| `1xx` | Interim information | `100`, `101` | Continue protocol exchange |\n| `2xx` | Successful result | `200`, `201`, `204` | Consume result or continue |\n| `3xx` | Redirect or representation reuse | `301`, `304`, `307` | Follow rules for that exact code |\n| `4xx` | Request-side condition | `400`, `401`, `404`, `409` | Correct, authenticate, or stop |\n| `5xx` | Server-side failure | `500`, `502`, `503`, `504` | Fail safely; retry only when allowed |",
    codeTitle: "The status line and body carry different information",
    code: "```http\nHTTP/1.1 404 Not Found\nContent-Type: application/problem+json\n\n{\n  \"type\": \"https://api.example.com/problems/order-not-found\",\n  \"title\": \"Order not found\",\n  \"status\": 404,\n  \"detail\": \"No order exists with id 42.\",\n  \"instance\": \"/orders/42\"\n}\n```\n\nThe status lets generic HTTP software classify the result; the problem details explain this occurrence.",
    practiceTitle: "Classify before choosing the exact code",
    practice: "For each failure, first ask whether the request or the server prevented completion. Then choose the exact code: invalid JSON is `400`, an absent current resource can be `404`, a current-state conflict can be `409`, and temporary server overload can be `503`.",
    followups: [
      "Can a response body change the meaning of a 200 status?",
      "Why is 304 in the 3xx class even though it does not supply a new redirect location?",
      "Does every 5xx response mean the client can safely retry?",
    ],
  },
  "401-vs-403-status-codes": {
    direct: "Use 401 when a protected request lacks valid authentication credentials and include a `WWW-Authenticate` challenge. Use 403 when the server understood the request but refuses to fulfil it, commonly because authenticated credentials do not have sufficient permission.",
    minutes: 9,
    quick: [
      "`401 Unauthorized` means the request lacks valid authentication credentials for the target resource.",
      "A 401 response must include at least one applicable `WWW-Authenticate` challenge.",
      "`403 Forbidden` means the server understood the request but refuses to fulfil it.",
      "A common API split is 401 for missing, expired, or invalid credentials and 403 for valid identity with insufficient permission.",
      "A server may use 404 instead of 403 when revealing that the forbidden resource exists would leak information.",
    ],
    interview: "`401 Unauthorized` means the request does not have acceptable authentication credentials. Despite its name, it normally means “not authenticated.” The response must include a `WWW-Authenticate` challenge.\n\nFor example, `GET /account` with a missing or expired bearer token can return 401 with a Bearer challenge. The client may obtain a valid token and try again when retrying is safe.\n\n`403 Forbidden` means the server understood the request but refuses to perform it. A signed-in member asking for `/admin/audit-log` may get 403 because valid authentication does not give that account the required permission.\n\nThe server may return 404 instead when revealing the resource would expose sensitive information. The simple distinction is: 401 is an authentication problem that new credentials may solve; 403 is a permission or policy decision for the known request.",
    deepTitle: "Authentication and permission are separate gates",
    deep: "Authentication establishes or validates the security principal presented by a request. Authorization evaluates whether that principal and request context may perform the requested operation. Keeping the gates separate produces predictable client behavior and clearer audit logs.\n\nA gateway can reject unacceptable credentials with 401 before the request reaches the application. The application can later reject a valid principal with 403 after checking ownership, role, tenant, account state, or another policy.\n\nThe `WWW-Authenticate` challenge is part of 401 semantics, not an optional hint. A JSON error body may accompany it, but the body alone does not replace the header.",
    visualType: "flow_diagram",
    visualTitle: "Choose between 401, 403, and a concealed 404",
    visual: "```mermaid\nflowchart TD\n  R[Protected request] --> C{Valid credentials?}\n  C -- No --> U[401 + WWW-Authenticate]\n  C -- Yes --> P{Policy permits action?}\n  P -- Yes --> H[Handle request]\n  P -- No, disclose target --> F[403 Forbidden]\n  P -- No, conceal target --> N[404 Not Found]\n```",
    codeTitle: "Two different failures at one API",
    code: "```http\nGET /account HTTP/1.1\nHost: api.example.com\n\nHTTP/1.1 401 Unauthorized\nWWW-Authenticate: Bearer realm=\"account-api\"\n\nGET /admin/audit-log HTTP/1.1\nHost: api.example.com\nAuthorization: Bearer valid-member-token\n\nHTTP/1.1 403 Forbidden\n```",
    practiceTitle: "Check what a new credential would change",
    practice: "If supplying acceptable credentials can pass the first gate, use 401 with a challenge. If the request is understood but policy still refuses it for the established caller, use 403—or conceal the target with 404 when that is the security contract.",
    followups: [
      "Which response header is required on a 401 response?",
      "When can a server return 404 instead of 403?",
      "Does HTTP require JWT for authentication?",
    ],
  },
  "200-vs-201-vs-204-status-codes": {
    direct: "Return 200 when a successful request includes a response representation, 201 when the request created one or more resources, and 204 when the request succeeded and there is no response content. The method alone does not determine the choice.",
    minutes: 9,
    quick: [
      "`200 OK` is general success and commonly carries a representation in the response body.",
      "`201 Created` means the request completed and created one or more resources.",
      "When 201 includes `Location`, it identifies the primary created resource; otherwise the request target identifies it.",
      "`204 No Content` means success with no response content and therefore no message body.",
      "POST does not always mean 201, and a PUT that creates the target can legitimately return 201.",
    ],
    interview: "`200 OK`, `201 Created`, and `204 No Content` are successful responses, but they describe different results. Choose from what happened and whether the server returns content.\n\nUse 200 when the request succeeded and the response includes a useful representation. A GET normally returns 200 with the resource. An update can also return 200 with the updated resource.\n\nUse 201 when the request created one or more resources. For example, `POST /orders` can return 201, a `Location: /orders/42` header, and the created order. A PUT that creates its target for the first time may also return 201.\n\nUse 204 when the request succeeded and there is no response content. DELETE and update endpoints often use it. A 204 response cannot contain a body. POST does not always mean 201, so the actual outcome—not only the method—decides the status.",
    deepTitle: "The response describes the result, not only the verb",
    deep: "A method defines request semantics, while the status describes this response. That is why one PUT can return 201 when it creates the target, 200 when it returns an updated representation, or 204 when an existing target is updated without response content.\n\nLocation and Content-Location have different jobs. With 201, Location points to the primary created resource. Content-Location identifies the resource corresponding to the enclosed representation. They may be the same, but one is not a substitute name for the other.\n\nA client should not try to parse a body from 204. If the API needs to return validation warnings, a new version, or the changed representation in content, select a success response that permits content.",
    visualType: "comparison_table",
    visualTitle: "Choose by outcome and response content",
    visual: "| Status | What happened | Response content | Typical example |\n|---|---|---|---|\n| `200 OK` | Request succeeded | Usually a representation | GET result or updated resource |\n| `201 Created` | One or more resources were created | May describe the result | Create an order; Location can name it |\n| `204 No Content` | Request succeeded | No content/body | Delete or update with nothing to return |",
    codeTitle: "Creation with an address, then update without content",
    code: "```http\nHTTP/1.1 201 Created\nLocation: /orders/42\nContent-Type: application/json\n\n{\"id\": 42, \"status\": \"pending\"}\n\nHTTP/1.1 204 No Content\nETag: \"order-v2\"\n```",
    practiceTitle: "Ask two questions",
    practice: "First ask whether this request created a resource. If yes, consider 201. Otherwise ask whether a response representation is being sent: use 200 when it is, and 204 when success has no content. Then check method-specific requirements and the documented API contract.",
    followups: [
      "Can PUT return 201 Created?",
      "Is Location mandatory on every 201 response?",
      "Can a 204 response contain a JSON body?",
    ],
  },
  "4xx-status-code-distinctions": {
    direct: "Use 400 for a broadly invalid request, 404 when no current representation is found or the server will not reveal one, 409 when the request conflicts with current resource state, and 422 when the content type and syntax are understood but its instructions cannot be processed.",
    minutes: 10,
    quick: [
      "`400 Bad Request` covers a perceived client error such as malformed syntax, framing, or routing.",
      "`404 Not Found` means no current representation was found—or the server is unwilling to disclose one.",
      "`409 Conflict` means the request conflicts with the target resource's current state.",
      "`422 Unprocessable Content` means the media type and syntax are understood, but the contained instructions cannot be processed.",
      "For application validation, define and document a consistent 400-versus-422 policy instead of switching arbitrarily.",
    ],
    interview: "These codes point to different request problems. `400 Bad Request` is the broad choice when the request is malformed or otherwise invalid. Broken JSON is a common example.\n\n`404 Not Found` means the server cannot find a current representation of the target, or will not reveal that it exists. `GET /orders/999` can return 404.\n\n`409 Conflict` means the request clashes with the resource's current state. Moving an already shipped order back to draft may be a conflict. If an `If-Match` validator fails, `412 Precondition Failed` is more precise.\n\n`422 Unprocessable Content` means the content type and syntax are understood, but the instructions cannot be processed. A well-formed order with quantity zero can use 422 if that is the API's documented validation policy.\n\nSome APIs use 400 for all validation errors; others separate 422. Either can be consistent. Pick the clearest documented contract, use more specific codes such as 412 or 415 when they match, and return a stable machine-readable error body.",
    deepTitle: "Locate the layer where processing stops",
    deep: "Parsing, resource lookup, state transition, and domain validation are separate stages. Mapping those stages to stable problem types helps clients handle errors without matching human message strings.\n\nThe boundary between 400 and 422 is a design choice only after respecting their standard meanings. An API can use 400 as its broad validation status, or use 422 after successful media-type and syntax handling. Whichever policy is chosen should appear in the API contract and tests.\n\nNot every concurrency failure is 409. When the client sends `If-Match` and the validator does not match, HTTP already defines 412. Use the more specific precondition status instead of flattening every stale update into conflict.",
    visualType: "flow_diagram",
    visualTitle: "Find the first meaningful reason the request stops",
    visual: "```mermaid\nflowchart TD\n  R[Request arrives] --> S{Syntax/framing acceptable?}\n  S -- No --> B[400 Bad Request]\n  S -- Yes --> N{Current target found or disclosed?}\n  N -- No --> F[404 Not Found]\n  N -- Yes --> P{Explicit HTTP precondition failed?}\n  P -- Yes --> E[412 Precondition Failed]\n  P -- No --> C{Conflicts with current state?}\n  C -- Yes --> K[409 Conflict]\n  C -- No --> V{Valid syntax but instructions unprocessable?}\n  V -- Yes --> U[422 Unprocessable Content]\n  V -- No --> H[Handle request]\n```",
    codeTitle: "A machine-readable domain validation response",
    code: "```http\nHTTP/1.1 422 Unprocessable Content\nContent-Type: application/problem+json\n\n{\n  \"type\": \"https://api.example.com/problems/invalid-order\",\n  \"title\": \"Order cannot be processed\",\n  \"status\": 422,\n  \"detail\": \"One or more order fields violate business rules.\",\n  \"errors\": [{\"field\": \"quantity\", \"code\": \"must_be_positive\"}]\n}\n```",
    practiceTitle: "Do not choose from the message wording",
    practice: "Trace where processing stopped: parsing suggests 400, missing or concealed target suggests 404, current-state collision suggests 409, and understood but unprocessable instructions may use 422. Prefer a more specific standard code such as 412 or 415 when it exactly matches.",
    followups: [
      "When is 412 more precise than 409?",
      "Can 404 be used to conceal a forbidden resource?",
      "Why do APIs differ on 400 versus 422 for validation?",
    ],
  },
  "spring-boot-error-response-design": {
    direct: "Build consistent Spring Boot errors by translating exceptions at one HTTP boundary, mapping each known failure to a stable status and RFC 9457 `ProblemDetail`, including safe machine-readable fields, and testing the same contract across controllers.",
    minutes: 11,
    quick: [
      "Use `@RestControllerAdvice` with focused `@ExceptionHandler` methods for shared HTTP error translation.",
      "Use Spring's `ProblemDetail` to represent RFC 9457 fields such as type, title, status, detail, and instance.",
      "Map domain, validation, authentication, and infrastructure failures to deliberately chosen HTTP statuses.",
      "Add stable error codes or field errors as properties; keep stack traces and internal details out of responses.",
      "Verify status, media type, fields, headers, and sensitive-data handling with controller or integration tests.",
    ],
    interview: "A Spring Boot API should return the same error shape for the same kind of failure across every controller. `@RestControllerAdvice` and focused `@ExceptionHandler` methods provide one place to translate Java exceptions into HTTP responses.\n\nSpring's `ProblemDetail` represents standard problem fields: `type`, `title`, `status`, `detail`, and `instance`. The API can add a stable code, a correlation ID, or field validation details.\n\nFor example, `OrderNotFoundException` can become a 404 problem with type `/problems/order-not-found` and code `ORDER_NOT_FOUND`. Malformed input can become 400, a business-state conflict 409, and an unexpected failure a safe 500 response.\n\nThe mapping should follow the failure's meaning, not simply its Java class name. Validation policy must be documented, and Spring Security authentication or authorization failures should keep their security-specific handling.\n\nDo not send stack traces, SQL, secrets, or internal class names to clients. Log protected diagnostic details on the server and test status, media type, fields, and headers. Centralize the HTTP format while keeping business error decisions in the domain or service layer.",
    deepTitle: "Problem types and failure occurrences",
    deep: "RFC 9457's `type` is an identifier for a problem class. Clients can use it—or an agreed extension code—for stable behavior without parsing `detail`, which is human-readable and may change or be localized. The `instance` identifies the particular occurrence and can support tracing without exposing an internal stack trace.\n\nA broad catch-all handler is a final safety net, not the main mapping strategy. Focused handlers preserve distinctions between not found, conflict, validation, and infrastructure failure. Handler ordering also matters when multiple advice classes or framework resolvers can match.\n\nSpring can render ProblemDetail as `application/problem+json`. Extensions should be small, documented, and safe; copying every exception field into the response recreates the leakage that central handling is meant to prevent.",
    visualType: "flow_diagram",
    visualTitle: "One error contract across controller paths",
    visual: "```mermaid\nflowchart LR\n  C[Controllers] --> X[Domain / validation / framework exception]\n  X --> A[@RestControllerAdvice]\n  A --> M[Map meaning to HTTP status]\n  M --> P[RFC 9457 ProblemDetail]\n  P --> R[Consistent client response]\n  A --> L[Protected server logs + correlation]\n```",
    codeTitle: "A focused ProblemDetail handler",
    code: "```java\n@RestControllerAdvice\nclass ApiExceptionHandler {\n    @ExceptionHandler(OrderNotFoundException.class)\n    ProblemDetail handleNotFound(\n            OrderNotFoundException ex, HttpServletRequest request) {\n        ProblemDetail problem = ProblemDetail.forStatusAndDetail(\n                HttpStatus.NOT_FOUND, \"No order exists with id \" + ex.orderId());\n        problem.setType(URI.create(\"https://api.example.com/problems/order-not-found\"));\n        problem.setTitle(\"Order not found\");\n        problem.setInstance(URI.create(request.getRequestURI()));\n        problem.setProperty(\"code\", \"ORDER_NOT_FOUND\");\n        return problem;\n    }\n}\n```\n\nThe public detail is intentionally narrow; private diagnostic context belongs in protected logs.",
    practiceTitle: "Test the contract, not only the handler method",
    practice: "Call two different endpoints that can miss an order and assert the same 404 media type and problem fields. Also test malformed JSON, validation failure, conflict, and an unexpected exception, including that no stack trace or secret reaches the response.",
    followups: [
      "What is the difference between ProblemDetail type and instance?",
      "Why should a catch-all handler return a generic detail?",
      "When would an API deliberately map validation to 422 instead of Spring's common 400 response?",
    ],
  },
};

// This status-code comparison follows the authentication and authorization
// gates without repeating the Deep Dive decision diagram. The compact support
// shows the different client meaning of two otherwise similar failures.
Object.assign(lessons["401-vs-403-status-codes"], {
  answerSize: "standard",
  interviewBeats: [
    {
      cue: "Define 401 from the HTTP authentication requirement",
      stage: "401 challenges credentials",
      spokenText:
        "`401 Unauthorized` means the request was not applied because it lacks valid authentication credentials for the target resource. The historical name is confusing; in everyday API language, it usually means the caller is not authenticated with acceptable credentials. A 401 response must include at least one applicable `WWW-Authenticate` challenge so the client knows which authentication scheme is required.",
    },
    {
      cue: "Define 403 as refusal after the request is understood",
      stage: "403 refuses the action",
      spokenText:
        "`403 Forbidden` means the server understood the request but refuses to fulfil it. A common API case is a validly authenticated user who lacks the required role, ownership, tenant access, or account state. Authentication is not a universal precondition for every possible 403, but the practical 401-versus-403 split is invalid credentials versus a policy refusal for an understood request.",
    },
    {
      cue: "Apply both statuses to concrete protected resources",
      stage: "Two protected requests",
      spokenText:
        "If `GET /account` has no bearer token or an expired one, the API can return 401 with `WWW-Authenticate: Bearer realm=\"account-api\"`; obtaining an acceptable credential may solve the problem. If a signed-in member sends `GET /admin/audit-log` with a valid token, the API can return 403 because that identity lacks admin permission. Repeating the same request as the same member will not change the policy decision.",
      support: {
        type: "comparison",
        title: "Authentication failure versus policy refusal",
        items: [
          {
            label: "401 Unauthorized",
            value: "credential challenge",
            detail: "Credentials are missing, expired, invalid, or otherwise unacceptable; send WWW-Authenticate.",
            tone: "blue",
          },
          {
            label: "403 Forbidden",
            value: "request refused",
            detail: "The request is understood, but authorization or another policy does not permit it.",
            tone: "orange",
          },
        ],
      },
    },
    {
      cue: "Explain the information-disclosure boundary",
      stage: "Conceal sensitive targets",
      spokenText:
        "A server may return `404 Not Found` instead of 403 when revealing that a protected resource exists would leak information. That concealment is part of the security contract; it does not replace the access check. A JSON problem body can explain a safe public error, but it does not replace the `WWW-Authenticate` header required on 401. Avoid details that reveal accounts, roles, resource existence, or internal policy rules unnecessarily.",
      recallRule:
        "Use 401 when acceptable authentication is missing, 403 when the understood request is refused, and 404 when the contract deliberately conceals the target.",
    },
  ],
});

// These success statuses are selected from the outcome and response content,
// not from a memorized POST/PUT/DELETE mapping. The support is a three-step
// decision path rather than a duplicate of the Deep Dive comparison table.
Object.assign(lessons["200-vs-201-vs-204-status-codes"], {
  answerSize: "standard",
  lastUpdated: "2026-09-08",
  interviewBeats: [
    {
      cue: "Separate the request method from this response outcome",
      stage: "Status describes this result",
      spokenText:
        "`200 OK`, `201 Created`, and `204 No Content` all report success, but they describe different outcomes. The request method starts the analysis; it does not choose the status by itself. Ask whether this request created a resource and whether the response needs to carry a representation. Those two facts usually separate the three codes clearly.",
      support: {
        type: "trace",
        title: "Choose from the outcome, then the content",
        items: [
          {
            label: "Created a resource?",
            value: "201 Created",
            detail: "Name the primary created resource with Location or, when absent, the target URI.",
            tone: "green",
          },
          {
            label: "No creation; sending content?",
            value: "200 OK",
            detail: "Return the useful representation produced by the successful request.",
            tone: "blue",
          },
          {
            label: "No creation and no content?",
            value: "204 No Content",
            detail: "Finish after response headers; there is no response content to parse.",
            tone: "neutral",
          },
        ],
      },
    },
    {
      cue: "Explain the normal representation carried by 200",
      stage: "200 returns useful content",
      spokenText:
        "Use `200 OK` for a completed request when the response returns useful content. `GET /orders/42` normally returns the order representation with 200. An update can also return 200 with the updated order, a calculation can return its result, and a POST that performs an action without creating a new resource can return a result with 200.",
    },
    {
      cue: "Connect 201 to completed creation and resource identity",
      stage: "201 identifies new resources",
      spokenText:
        "Use `201 Created` when processing has completed and created one or more resources. `POST /orders` can return `Location: /orders/42` to identify the primary new order and may include its representation. Location is not mandatory in every 201; when it is absent, the request target identifies the primary resource. A PUT that creates its target for the first time can also return 201.",
    },
    {
      cue: "State the content boundary and useful headers of 204",
      stage: "204 stops after headers",
      spokenText:
        "Use `204 No Content` when the action succeeded and there is no response content to send. It is common after a DELETE or an update whose new representation is unnecessary. A 204 response can still carry metadata such as an `ETag`, but it cannot carry a JSON body. A client should finish at the headers instead of trying to deserialize content.",
    },
    {
      cue: "Apply all three outcomes to one PUT endpoint",
      stage: "One method, three outcomes",
      spokenText:
        "The same PUT contract shows why method-only rules fail. Creating `/profiles/42` can return 201. Replacing an existing profile and returning the new representation can return 200. Applying the replacement without response content can return 204. If work has only been accepted for later processing, `202 Accepted` is more accurate than pretending creation or completion has already happened.",
      recallRule:
        "Use 201 for completed creation, 200 when success returns a representation, and 204 when success has no response content.",
    },
  ],
});

// Each 4xx status is tied to the first meaningful boundary the request fails.
// The compact comparison support keeps the four meanings visible while the
// existing Deep Dive remains responsible for the complete decision diagram.
Object.assign(lessons["4xx-status-code-distinctions"], {
  answerSize: "standard",
  lastUpdated: "2026-09-08",
  interviewBeats: [
    {
      cue: "Frame the statuses as failures at different processing boundaries",
      stage: "Find where processing stops",
      spokenText:
        "These four codes are not interchangeable labels for a failed request. `400` points to a request the server cannot or will not process because of a perceived client error. `404` points to an unavailable or concealed target. `409` points to current resource state. `422` points to understood, syntactically correct content whose instructions cannot be processed.",
      support: {
        type: "comparison",
        title: "Match the first failed boundary to the response",
        items: [
          {
            label: "400 Bad Request",
            value: "request problem",
            detail: "Malformed syntax, invalid framing, or another broad client error prevents processing.",
            tone: "blue",
          },
          {
            label: "404 Not Found",
            value: "target problem",
            detail: "No current representation was found, or the server will not disclose one.",
            tone: "neutral",
          },
          {
            label: "409 Conflict",
            value: "state problem",
            detail: "The requested change conflicts with the target resource's current state.",
            tone: "orange",
          },
          {
            label: "422 Unprocessable Content",
            value: "instruction problem",
            detail: "The content type and syntax are understood, but the contained instructions cannot be processed.",
            tone: "green",
          },
        ],
      },
    },
    {
      cue: "Use 400 for a broad client-side request failure",
      stage: "400 rejects the request form",
      spokenText:
        "Use `400 Bad Request` when the server cannot or will not process the request because it sees a client error. Broken JSON, invalid message framing, or deceptive routing are standard examples. Many APIs also use 400 as their broad validation status. If the failure is specifically an unsupported `Content-Type`, `415 Unsupported Media Type` communicates the problem more precisely.",
    },
    {
      cue: "Tie 404 to the target rather than the request body",
      stage: "404 has no disclosed target",
      spokenText:
        "Use `404 Not Found` when the origin has no current representation for the target, as with `GET /orders/999`. A server may also use 404 instead of 403 when revealing that a protected resource exists would leak information. A 404 does not say whether the absence is temporary or permanent; `410 Gone` is the more specific choice for known permanent removal.",
    },
    {
      cue: "Connect 409 to a resolvable conflict with current state",
      stage: "409 conflicts with state",
      spokenText:
        "Use `409 Conflict` when the operation is understandable but clashes with the target's current state and the caller might resolve that conflict. Moving an already shipped order back to draft is one example. If the client sent `If-Match` and the validator is false, use `412 Precondition Failed`; HTTP already has that exact status for a failed request precondition.",
    },
    {
      cue: "Define 422 after media type and syntax have succeeded",
      stage: "422 rejects the instructions",
      spokenText:
        "Use `422 Unprocessable Content` when the server understands the content type and the syntax is correct, but it cannot process the contained instructions. A well-formed order with `quantity: 0` can fit this status when the API uses 422 for domain validation. `Unprocessable Entity` is the older familiar wording; current HTTP semantics names the status Unprocessable Content.",
    },
    {
      cue: "Keep the 400 and 422 validation policy predictable",
      stage: "Validation policy stays stable",
      spokenText:
        "The practical 400-versus-422 boundary must be documented and used consistently. An API can keep all client validation under 400, or reserve 422 for syntactically valid instructions that fail semantic rules. Clients should receive a stable machine-readable problem type and field details. Prefer a more specific standard code, such as 412 or 415, whenever its defined condition is the real failure.",
      recallRule:
        "Choose the status from the first meaningful failure: request, target, current state, or understood instructions—and use a more specific HTTP condition when one exists.",
    },
  ],
});

// Status ranges are taught from the broad class to the exact code and then
// the occurrence detail. This avoids duplicating the full range table and
// HTTP problem example that already live in the independent Deep Dive.
Object.assign(lessons["http-status-code-ranges"], {
  direct:
    "An HTTP status code is a three-digit response result. Its first digit gives the broad class: `1xx` informational, `2xx` successful, `3xx` redirection, `4xx` client error, and `5xx` server error. The exact code then describes the specific outcome.",
  answerSize: "standard",
  lastUpdated: "2026-09-08",
  interviewBeats: [
    {
      cue: "Explain what the class and exact code each contribute",
      stage: "First digit gives the class",
      spokenText:
        "An HTTP response status is a three-digit number from 100 through 599. The first digit gives a broad result class, while the complete code gives the specific meaning. A client that does not recognize an exact code can still understand its class. For example, an unknown `471` is handled as a 4xx client-error response rather than as success.",
    },
    {
      cue: "Describe interim responses and completed success separately",
      stage: "1xx continues; 2xx succeeds",
      spokenText:
        "`1xx` responses are informational and come before the final response. `100 Continue` tells a client it can continue sending request content, and `101 Switching Protocols` confirms a protocol switch. `2xx` means the request was successfully received, understood, and accepted. The exact result still matters: `200 OK`, `201 Created`, `202 Accepted`, and `204 No Content` do not promise the same outcome or content.",
    },
    {
      cue: "Show why 3xx cannot be reduced to a browser redirect",
      stage: "3xx requires another step",
      spokenText:
        "`3xx` means further action is needed to complete the request. A `301 Moved Permanently` can direct the client to another URI, while `307 Temporary Redirect` preserves the request method when following its Location. `304 Not Modified` is different: after a conditional GET or HEAD, it tells the client that its stored representation can still be used, so no new representation is transferred.",
    },
    {
      cue: "Separate a request-side condition from server failure",
      stage: "4xx and 5xx assign the failure",
      spokenText:
        "`4xx` means the request has a condition that prevents completion, such as malformed syntax with 400, unacceptable credentials with 401, or an unavailable target with 404. `5xx` means the server failed to fulfil an apparently valid request. `500` is a general server failure, `502` is a bad upstream response, `503` is temporary unavailability, and `504` is an upstream timeout.",
    },
    {
      cue: "Connect protocol classification to useful application detail",
      stage: "Exact code guides the client",
      spokenText:
        "Choose the most specific standard code that matches what happened. The class gives quick direction, the exact code tells a client whether it might authenticate, correct input, follow redirection rules, or handle server failure, and a safe error body can explain this occurrence. Returning `200 OK` with `{\"success\": false}` hides the failure from HTTP-aware clients, caches, monitoring, and gateways.",
      support: {
        type: "trace",
        title: "Read a response from broad to specific",
        items: [
          {
            label: "Class",
            value: "4xx client error",
            detail: "Something about the request prevents this operation from completing.",
            tone: "blue",
          },
          {
            label: "Exact code",
            value: "404 Not Found",
            detail: "No current representation is found for the target, or the server will not disclose one.",
            tone: "orange",
          },
          {
            label: "Problem detail",
            value: "order 42 was not found",
            detail: "A machine-readable body explains this occurrence without changing the 404 meaning.",
            tone: "green",
          },
        ],
      },
      recallRule:
        "Read class first, exact code second, and the response details third; never replace HTTP failure semantics with a success status and an error flag.",
    },
  ],
});

// Error handling is taught as a public HTTP contract, not as a list of
// annotations. The field comparison supports the interview explanation;
// the independent Deep Dive keeps the full Spring failure pipeline.
Object.assign(lessons["spring-boot-error-response-design"], {
  direct:
    "In Spring Boot, put shared exception-to-HTTP mapping in `@RestControllerAdvice`. Handle known failures with focused `@ExceptionHandler` methods, return the correct status and a safe `ProblemDetail`, keep private diagnostics in logs, and test the same error contract across controllers.",
  answerSize: "standard",
  lastUpdated: "2026-09-08",
  interviewBeats: [
    {
      cue: "Define one shared boundary for controller errors",
      stage: "One public error contract",
      spokenText:
        "A Spring Boot API should return the same error structure for the same failure wherever it occurs. `@RestControllerAdvice` gives controllers a shared exception boundary, and `@ExceptionHandler(OrderNotFoundException.class)` can handle one known failure. Controllers and services can throw meaningful exceptions without building a different JSON shape in every method.",
    },
    {
      cue: "Choose HTTP status from the failure meaning",
      stage: "Map meaning to status",
      spokenText:
        "The handler maps what happened, not just a Java class name. A missing order can become `404 Not Found`, a state conflict can become `409 Conflict`, and an unexpected server failure becomes a safe `500 Internal Server Error`. Malformed JSON and Bean Validation failures enter through Spring's web pipeline, while authentication and access failures normally remain in Spring Security's handling path.",
    },
    {
      cue: "Build a standard body with stable and occurrence-specific fields",
      stage: "ProblemDetail carries meaning",
      spokenText:
        "Spring's `ProblemDetail` represents RFC 9457 fields. A focused handler can start with `ProblemDetail.forStatusAndDetail(HttpStatus.NOT_FOUND, detail)`, where detail safely explains that order 42 was not found, then set a stable problem `type` and short `title`. A small extension such as `code: ORDER_NOT_FOUND` can help application clients, but every extension must be documented.",
      support: {
        type: "comparison",
        title: "Each problem field has one job",
        items: [
          {
            label: "type",
            value: "stable problem class",
            detail: "Identifies what kind of problem this is across occurrences.",
            tone: "blue",
          },
          {
            label: "title + status",
            value: "short HTTP summary",
            detail: "State the familiar problem name and matching response status.",
            tone: "green",
          },
          {
            label: "detail",
            value: "this failure",
            detail: "Gives a safe human-readable explanation of this occurrence.",
            tone: "orange",
          },
          {
            label: "instance or request ID",
            value: "trace one occurrence",
            detail: "Connects the public response to the specific request and protected logs.",
            tone: "neutral",
          },
        ],
      },
    },
    {
      cue: "Separate safe client detail from protected diagnostics",
      stage: "Keep internals on the server",
      spokenText:
        "Do not return stack traces, SQL messages, secrets, internal host names, or Java package names. The client needs a stable status, problem type, safe detail, and perhaps field errors. The server log can keep the exception and diagnostic context under the same request or correlation ID. A catch-all handler is only the final safety net and should return a generic public 500 detail.",
    },
    {
      cue: "Prove that all endpoints obey the same response contract",
      stage: "Test the full response",
      spokenText:
        "Controller or integration tests should assert the status, `application/problem+json` media type, stable fields, useful validation details, and required headers. Test the same not-found failure through more than one endpoint, plus malformed JSON, validation, conflict, and an unexpected exception. Also assert that private exception text never appears in the response.",
      recallRule:
        "Centralize exception translation, map the real failure to HTTP, return one safe problem shape, and keep diagnostic detail in protected logs.",
    },
  ],
  deepTitle: "Make errors a stable part of the API contract",
  deep:
    "An error response has two layers. The HTTP status gives generic software the broad result, while the problem body gives the application a stable problem identity and safe detail. Returning `200 OK` with an error flag breaks that separation because monitoring, gateways, caches, and clients see success.\n\n`@RestControllerAdvice` applies shared `@ExceptionHandler` methods across controllers. Focused handlers can translate domain failures such as not found or conflict. Spring's `ResponseEntityExceptionHandler` can also provide a base for built-in MVC exceptions. Local controller handlers and Spring Security may take part too, so the application should decide one clear owner for each failure path instead of catching every exception in one broad method.\n\nRFC 9457 `ProblemDetail` supplies `type`, `title`, `status`, `detail`, and `instance`. The type identifies a problem class; detail explains this occurrence; instance identifies the occurrence when that is useful. Spring can select `application/problem+json`, set the status from the object, and use the current request path as the instance when one was not supplied. Extension fields such as a stable code or field-error list should have documented shapes.\n\nKnown failures need deliberate mappings. Malformed request content commonly produces 400, an absent target 404, and a current-state conflict 409. Authentication and authorization errors must preserve their security headers and disclosure rules. Unknown failures should become a generic 500 response while the real exception, stack trace, and correlation data stay in protected logs.\n\nTests complete the contract. Verify status, media type, fields, headers, and validation details through the real web layer. Include a leakage assertion so SQL, secrets, and internal exception text cannot silently become public after a refactor.",
  code:
    "```java\nimport java.net.URI;\n\nimport org.springframework.http.HttpStatus;\nimport org.springframework.http.ProblemDetail;\nimport org.springframework.web.bind.annotation.ExceptionHandler;\nimport org.springframework.web.bind.annotation.RestControllerAdvice;\n\n@RestControllerAdvice\nclass ApiExceptionHandler {\n    @ExceptionHandler(OrderNotFoundException.class)\n    ProblemDetail handleNotFound(OrderNotFoundException ex) {\n        ProblemDetail problem = ProblemDetail.forStatusAndDetail(\n                HttpStatus.NOT_FOUND,\n                \"No order exists with id \" + ex.orderId());\n        problem.setType(URI.create(\n                \"https://api.example.com/problems/order-not-found\"));\n        problem.setTitle(\"Order not found\");\n        problem.setProperty(\"code\", \"ORDER_NOT_FOUND\");\n        return problem;\n    }\n}\n\nfinal class OrderNotFoundException extends RuntimeException {\n    private final long orderId;\n\n    OrderNotFoundException(long orderId) {\n        this.orderId = orderId;\n    }\n\n    long orderId() {\n        return orderId;\n    }\n}\n```\n\nThe handler owns only HTTP translation. Spring can supply the request path as `instance`; protected logging should record the exception and the same request identifier used for support.",
});

const difficulties = {
  "http-status-code-ranges": "easy",
  "401-vs-403-status-codes": "easy",
  "200-vs-201-vs-204-status-codes": "easy",
  "4xx-status-code-distinctions": "medium",
  "spring-boot-error-response-design": "medium",
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
console.log(`Curated ${selectedLessonSlugs.length} HTTP status lesson${selectedLessonSlugs.length === 1 ? "" : "s"}; preserved IDs, slugs, questions, and order.`);
