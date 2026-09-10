#!/usr/bin/env node

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const target = path.join(
  repoRoot,
  "content/java-backend-fresher/rest-api-basics/what-is-rest/complete-qa.json",
);
const document = JSON.parse(fs.readFileSync(target, "utf8"));
const requestedSlug = process.argv[2] ?? null;
const reviewedOn = "2026-09-08";

const lessons = {
  "what-is-rest-restful-api-fundamentals-for-java-developers": {
    direct: "REST is an architectural style for networked systems. A system is RESTful when it follows REST's constraints—client-server separation, stateless requests, cacheability, a uniform interface, layered components, and optional code-on-demand—rather than merely returning JSON over HTTP.",
    minutes: 10,
    answerSize: "compact",
    quick: [
      "REST is an architectural style, not a protocol, payload format, or Spring annotation.",
      "Its required constraints are client-server, stateless, cache, uniform interface, and layered system.",
      "Code-on-demand is the only optional REST constraint.",
      "Resources are identified and exchanged through representations; JSON is common but not required.",
      "An HTTP API can use REST-like conventions without satisfying the full REST style, especially hypermedia.",
    ],
    interview: "REST stands for Representational State Transfer. It is a way of designing network applications and APIs. REST is an architectural style, not a library, protocol, or JSON format. Returning JSON from a Spring controller alone does not make an API RESTful.\n\nREST uses a set of rules called constraints. The client and server have separate responsibilities, each request carries the context needed to handle it, responses say whether they can be cached, and layers such as gateways can sit between the client and server. REST also uses a uniform interface so resources, methods, status codes, headers, and representations have shared meaning. Code-on-demand is the only optional constraint.\n\nFor example, `/orders/42` can identify order 42. `GET /orders/42` asks for its current representation, which may be JSON. The response can include `Content-Type`, cache information, and links to valid next actions. The server can change its Java classes or database tables without changing this public resource address.\n\nThese constraints help clients and servers change independently, make requests easier to route, and allow safe caching. They also require careful API design, and a fully RESTful API uses hypermedia to guide the client. Many real APIs use REST ideas without following every constraint, so it is more accurate to judge an API by the constraints it follows than by JSON, CRUD, or `@RestController` alone.",
    deepTitle: "Constraints create system properties",
    deep: "**REST is a set of constraints, not a library**\n\nREST describes how components in a distributed hypermedia system interact. It does not require Spring Boot, JSON, CRUD controllers, or a particular URL naming rule. A system becomes more RESTful by applying constraints such as client–server separation, stateless requests, cacheable responses, a uniform interface, a layered system, and optional downloaded code.\n\nEach constraint gives up some freedom to produce a useful property. Statelessness makes a request easier to route and observe because it does not rely on a hidden conversation. Cache metadata lets a client or intermediary reuse a response safely. Layering allows a gateway, proxy, or cache to sit between client and origin without changing the basic interaction contract.\n\n**Follow one familiar resource**\n\nTake the resource identified by `/orders/42`. The resource is the order concept and its current state, not the Java object or database row. A `GET` can return a JSON representation today and an XML representation to another client. A `PUT`, `PATCH`, or domain action can change state while the stable identity remains `/orders/42`.\n\nThe uniform interface supplies shared meaning: methods describe request intent, status codes describe the outcome, headers carry metadata, and representations transfer state. A response can include links or controls that tell the client which transitions are available next.\n\n**Know the practical boundary**\n\nAn HTTP JSON API with noun paths is not automatically REST. If every next action depends on private out-of-band rules, responses have no useful cache semantics, or the server keeps an invisible per-client conversation, important REST constraints are missing. Conversely, an API can use RPC for a valid reason; “not REST” does not mean “bad.” The design should name the interaction style honestly and use its semantics consistently.",
    visualType: "concept_map",
    visualTitle: "REST constraints and the properties they support",
    visual: "```mermaid\nflowchart TD\n  R[REST architectural style] --> CS[Client-server separation]\n  R --> S[Stateless requests]\n  R --> C[Cacheable responses]\n  R --> U[Uniform interface]\n  R --> L[Layered system]\n  R --> D[Code-on-demand: optional]\n  S --> SC[Visibility + horizontal scalability]\n  C --> EF[Fewer repeated interactions]\n  U --> IN[Interoperability + evolvability]\n  L --> GW[Gateways, proxies, shared caches]\n```",
    codeTitle: "A self-descriptive resource response",
    code: "```http\nHTTP/1.1 200 OK\nContent-Type: application/json\nCache-Control: private, max-age=60\nETag: \"order-v7\"\n\n{\n  \"id\": 42,\n  \"status\": \"pending\",\n  \"total\": 1999,\n  \"links\": [\n    {\"rel\": \"self\", \"href\": \"/orders/42\"},\n    {\"rel\": \"cancel\", \"href\": \"/orders/42/cancellation\"}\n  ]\n}\n```\n\nThe message identifies its representation, cache rules, version, and possible next navigation rather than exposing a Java entity.",
    practiceTitle: "Test the definition",
    practice: "A controller that returns JSON has a representation format. Ask separately whether requests are stateless, messages are self-descriptive, responses define caching, intermediaries are supported, and clients discover valid transitions.",
    followups: [
      "Which REST constraint is optional?",
      "Why does JSON alone not make an API RESTful?",
      "What are the four parts of the uniform-interface constraint?",
    ],
  },
  "rest-resources-and-uri-design-java-backend-interview": {
    direct: "A REST resource is an abstract piece of information or domain concept with a stable identity, such as an order or report. Its URI identifies it, while representations such as JSON describe its current or intended state; the resource does not have to equal one database row.",
    minutes: 10,
    answerSize: "compact",
    quick: [
      "A resource is the identified domain concept; a representation is the transferred JSON, XML, or other form.",
      "Use stable URIs that survive Java class, service, and database changes.",
      "Collections and members commonly use paths such as `/orders` and `/orders/42`.",
      "Use nesting when the parent is meaningful; avoid copying the whole object graph into the path.",
      "Use query parameters for filtering, sorting, search, and pagination of a collection view.",
    ],
    interview: "A REST resource is something an API can identify, such as a customer, an order, an invoice, or a collection of orders. The resource is the public concept, not the Java object, database row, or JSON body. JSON is only one possible representation of that resource.\n\nA URI gives the resource a stable address. `/orders` normally identifies the order collection, while `/orders/42` identifies one order. The HTTP method tells the server what the client wants to do, so `GET /orders/42` reads the order and `DELETE /orders/42` asks to remove it.\n\nPaths can show useful relationships. `/customers/7/orders` means the orders that belong to customer 7, but `/orders/42` is a simpler address when the order already has its own identity. Query parameters are better for changing a collection view, such as `/orders?status=pending&sort=-createdAt&limit=20` for filtering, sorting, and page size.\n\nGood URIs use clear domain names and remain stable when controllers or database tables change. After creating an order, the server can return `201 Created` with `Location: /orders/42`. Avoid paths such as `/OrderController/findById/42` and very deep paths that copy the whole object graph, because they expose implementation details and are harder to maintain.",
    deepTitle: "Identity must outlive implementation details",
    deep: "**Begin with the domain noun**\n\nA resource is anything the API can identify and talk about: one order, the orders collection, a generated invoice, today's exchange rate, or a long-running export job. It does not need a one-to-one database table. “Open orders” can remain the same resource even while its members change.\n\nA URI gives that concept an address. `/orders` naturally identifies the collection and `/orders/42` one order. The representation is the transferred description—perhaps JSON containing status, total, and links. Changing the JSON shape does not create a new resource unless the API deliberately changes identity.\n\n**Choose paths by identity, not implementation**\n\nUse a nested path when the parent relationship is necessary or makes the collection clearer: `/customers/7/orders`. If order 42 is globally addressable, `/orders/42` is a simpler canonical member URI. Filtering and pagination usually shape a collection view, so `/orders?status=pending&page=2` is clearer than inventing a path for every query.\n\nPaths such as `/OrderController/findById/42` leak Java implementation details. Paths such as `/order_table/42` leak storage. Both become misleading when code or persistence changes. A stable domain vocabulary allows the server to refactor without breaking clients.\n\n**Work through one creation flow**\n\nA client posts an order representation to `/orders`. A successful server may return `201 Created`, a representation of the new order, and `Location: /orders/43`. Later reads and updates use that stable member URI. The client should use documented contracts or links rather than reverse-engineer a table relationship from the string.\n\nGood URI design is therefore less about forcing every path to contain nouns and more about stable identity, predictable collections, useful relationships, and freedom from internal names.",
    visualType: "flow_diagram",
    visualTitle: "Resource identity and representation",
    visual: "```mermaid\nflowchart LR\n  U[URI /orders/42] --> R[Order resource identity]\n  R --> J[JSON representation]\n  R --> X[XML representation]\n  R --> H[HTML representation]\n  DB[(Tables / events / services)] --> R\n  C[Java controllers and DTOs] --> R\n```\n\nThe resource is the public concept between the URI and its representations; the backing code and storage can change.",
    codeTitle: "Collection, member, relationship, and view",
    code: "```http\nGET /orders HTTP/1.1\nGET /orders/42 HTTP/1.1\nGET /customers/7/orders?status=pending&limit=20 HTTP/1.1\n\nPOST /orders HTTP/1.1\nContent-Type: application/json\n\n{\"customerId\": 7, \"items\": [{\"sku\": \"KB-1\", \"quantity\": 1}]}\n\nHTTP/1.1 201 Created\nLocation: /orders/43\n```",
    practiceTitle: "Remove internal names from the contract",
    practice: "If a path contains `OrderController`, `order_table`, or `findOrderById`, replace the implementation word with the domain resource. Then check whether the same URI could survive a service or database refactor.",
    followups: [
      "What is the difference between a resource and a representation?",
      "When is a nested URI helpful?",
      "Are noun-only paths a formal REST constraint?",
    ],
  },
  "statelessness-in-rest-apis-java-backend-interview": {
    direct: "REST statelessness means each request contains the information needed to understand and process it; the server does not depend on stored conversational context from earlier requests. The server can still keep resource data, credentials, caches, and other application state.",
    minutes: 9,
    answerSize: "compact",
    quick: [
      "Each request must be understandable without relying on a previous request in the conversation.",
      "Resource state belongs on the server; statelessness concerns client session context between requests.",
      "Credentials may be self-contained or looked up server-side—the request still presents what identifies and authorizes it.",
      "Any healthy instance can handle the next request when no in-memory conversational session is required.",
      "Statelessness improves visibility and scaling but may repeat context and increase per-request work.",
    ],
    interview: "Statelessness in REST means that every request contains enough information for the server to handle it. The server should not need a hidden memory of the client's previous request to understand the next one. Each request must make sense on its own.\n\nFor example, `GET /orders/42` identifies the order and can include an `Authorization` credential. Any healthy server instance can read order 42 and check the user's permission. The request may use a JWT or an opaque token; REST does not require one particular token type.\n\nStatelessness does not mean that the server has no state. Orders, users, permissions, caches, and transactions can still be stored on the server. The important difference is that business data is saved as resource or application state instead of keeping a private conversation only in one server's memory. This makes requests easier to route, inspect, recover, and scale across multiple servers.\n\nThe trade-off is that credentials and other request details may need to be sent again, and the server may repeat some lookups. A multi-step process should store its progress in an explicit resource, such as `/checkouts/CH-21`, rather than rely on one server remembering the previous step. A useful summary is: stateless requests can still work with stateful resources.",
    deepTitle: "Session state and resource state are different",
    deep: "**Meaning of statelessness**\n\nEvery request should contain enough information for the server to handle it. The server should not need to remember a hidden step from the client's previous request. This rule does not stop the server from using a database, cache, user account, or saved order.\n\n**Checkout example**\n\nA shopper starts checkout and receives `/checkouts/CH-21`. The next payment request sends that checkout ID, the payment details, and the user's login token. Any healthy server can read checkout CH-21 from shared storage and continue the work.\n\nA different design stores “this user is paying for cart C-9” only in the memory of server A. If the next request reaches server B, server B does not know what to do. The system then needs sticky sessions or session copying. REST statelessness avoids this hidden dependency.\n\n**Resource state and session state**\n\n- **Resource state** is saved business data, such as an order being `PENDING` or `PAID`. It can stay on the server.\n- **Session state** is temporary information about where one user is in a conversation. The request should send it or point to a saved resource that contains it.\n- **Login information** can still be checked on the server. The request only needs to send a valid token or other credential; it does not have to use JWT.\n\n**Main benefit and cost**\n\nStateless requests are easier to send to any server, inspect in logs, retry, and recover after a server restarts. The cost is that some data, such as a login token or request options, may be sent again with every request. A simple check is: if the previous server disappears, can another server understand the next request?",
    visualType: "comparison_table",
    visualTitle: "State that remains and context that must travel",
    visual: "| Information | Where it can live | Stateless request requirement |\n|---|---|---|\n| Order, user, inventory | Server database/resource state | Request identifies what it needs |\n| Permission records | Server security store | Request presents usable credentials |\n| Current checkout step | Explicit checkout resource or client | Do not hide it only in one server session |\n| Cache and metrics | Server infrastructure | Must not be required conversational context |",
    codeTitle: "Make workflow progress an explicit resource",
    code: "```http\nPOST /checkouts HTTP/1.1\nAuthorization: Bearer opaque-access-token\nContent-Type: application/json\n\n{\"cartId\": \"C-9\"}\n\nHTTP/1.1 201 Created\nLocation: /checkouts/CH-21\n\nGET /checkouts/CH-21 HTTP/1.1\nAuthorization: Bearer opaque-access-token\n```\n\nThe second request names the workflow resource and carries its credential. It does not depend on reaching the process that handled the first request.",
    practiceTitle: "Find the hidden conversation",
    practice: "If a request cannot be understood after the original server process restarts, identify the missing context. Put durable business progress in a resource and send required request context explicitly.",
    followups: [
      "Why does statelessness not mean no database?",
      "Does a stateless API require JWT?",
      "How can a multi-step workflow remain stateless at the request layer?",
    ],
  },
  "implementing-rest-api-in-spring-boot-java-fresher-guide": {
    direct: "Spring Boot implements a REST API through Spring Web. Spring MVC maps an HTTP request to a controller method, and Jackson converts JSON to Java objects and Java objects back to JSON.",
    minutes: 11,
    quick: [
      "`@RestController` marks a class as an API controller, so returned Java objects are written to the HTTP response body.",
      "`@GetMapping`, `@PostMapping`, `@PutMapping`, and `@DeleteMapping` connect an HTTP method and URL to a Java method.",
      "`@PathVariable`, `@RequestParam`, and `@RequestBody` read path values, query parameters, and JSON. For example, in `GET /products/10`, `@PathVariable` receives `10`.",
      "The controller handles HTTP, the service contains business rules, and the repository reads or saves data when persistent storage is needed.",
      "`@Valid` checks request data, `ResponseEntity` sets the status and headers, and `@RestControllerAdvice` keeps error responses consistent.",
    ],
    interview: "Spring Boot builds REST APIs mainly with **Spring Web** and **Spring MVC**. Spring receives the HTTP request, finds the matching controller method, runs the application code, and converts the returned Java object into JSON.\n\nHere is a small product endpoint:\n\n```java\n@RestController\n@RequestMapping(\"/products\")\nclass ProductController {\n    private final ProductService productService;\n\n    ProductController(ProductService productService) {\n        this.productService = productService;\n    }\n\n    @GetMapping(\"/{id}\")\n    ResponseEntity<ProductResponse> getProduct(\n            @PathVariable long id) {\n        ProductResponse product = productService.findById(id);\n        return ResponseEntity.ok(product);\n    }\n}\n```\n\n`@RestController` tells Spring that this class handles API requests and returns response data. `@RequestMapping(\"/products\")` gives every method the common `/products` URL. `@GetMapping(\"/{id}\")` connects this method to a request such as `GET /products/10`, and `@PathVariable` puts `10` into the `id` parameter.\n\nThe controller calls `ProductService` instead of reading the database or writing business rules itself. If the service returns a `ProductResponse`, `ResponseEntity.ok` sends status `200 OK`. Jackson converts the response object into JSON:\n\n```json\n{\n  \"id\": 10,\n  \"name\": \"Keyboard\",\n  \"price\": 1499\n}\n```\n\nFor a create request, `@PostMapping` and `@RequestBody` can read incoming JSON. `@Valid` can reject missing or invalid fields. A successful create normally returns `201 Created`, while a missing product should return `404 Not Found`. `@RestControllerAdvice` can give all controllers the same error format.\n\nThe complete flow is **request → controller → service → repository → response object → JSON**. The annotations connect HTTP to Java; the service and repository perform the actual application work.",
    interviewExtra: "\n\nFor a concrete create request, the client sends `POST /products` with JSON such as `{\"name\":\"Keyboard\",\"price\":1499}`. Spring creates and validates the request object before the service runs. A successful result can return `201 Created`, `Location: /products/21`, and `{\"id\":21,\"name\":\"Keyboard\",\"price\":1499}`. This shows the complete HTTP input and output, not only the controller annotation.",
    interviewBeats: [
      {
        cue: "Separate Spring Boot setup from Spring MVC request handling",
        stage: "Spring Boot's role",
        spokenText: "Spring Boot makes a REST API easier to start, but Spring MVC handles the web request. When `spring-boot-starter-web` is added, Boot configures an embedded server, Spring MVC's `DispatcherServlet`, request mapping, and Jackson-based JSON support. The developer still writes the controller, request and response DTOs, business service, and any persistence code.",
        support: {
          type: "comparison",
          title: "What the framework provides",
          items: [
            { label: "Spring Boot", detail: "Starts and auto-configures the application and embedded server.", tone: "blue" },
            { label: "Spring MVC", detail: "Routes the request, binds method arguments, and calls the controller.", tone: "green" },
            { label: "Jackson", detail: "Reads request JSON and writes response JSON.", tone: "orange" },
          ],
        },
      },
      {
        cue: "Build a small but complete controller boundary",
        stage: "Minimal implementation",
        spokenText: "A small API needs DTOs that define its JSON contract and a controller that connects HTTP to the application. `@RestController` writes return values to the response body, mapping annotations choose the Java method, `@RequestBody` and `@PathVariable` read request data, and constructor injection supplies the service. The controller delegates the real work instead of containing business or database rules.",
        support: {
          type: "code",
          title: "Product DTOs and controller",
          language: "java",
          code: "record CreateProductRequest(\n        @NotBlank String name,\n        @Positive BigDecimal price) {}\n\nrecord ProductResponse(\n        long id, String name, BigDecimal price) {}\n\n@RestController\n@RequestMapping(\"/products\")\nclass ProductController {\n    private final ProductService service;\n\n    ProductController(ProductService service) {\n        this.service = service;\n    }\n\n    @GetMapping(\"/{id}\")\n    ProductResponse find(@PathVariable long id) {\n        return service.findById(id);\n    }\n\n    @PostMapping\n    ResponseEntity<ProductResponse> create(\n            @Valid @RequestBody CreateProductRequest request) {\n        ProductResponse product = service.create(request);\n        URI location = URI.create(\"/products/\" + product.id());\n        return ResponseEntity.created(location).body(product);\n    }\n}",
          caption: "`ProductService` owns the use case. Its implementation may use a repository, another service, or an in-memory store without changing the HTTP contract.",
        },
      },
      {
        cue: "Follow one request through the framework and application",
        stage: "Request lifecycle",
        spokenText: "For `POST /products`, the embedded server gives the request to Spring MVC's `DispatcherServlet`. Handler mapping selects the controller method. Jackson converts the JSON body into `CreateProductRequest`, and Bean Validation checks its constraints before the method runs. The controller calls the service, the service performs the use case and may call a repository, then `ResponseEntity` supplies the status, headers, and response object. Jackson finally writes that object as JSON.",
        support: {
          type: "trace",
          title: "One request from HTTP to JSON",
          items: [
            { label: "Route and bind", value: "MVC", detail: "Select the method, convert JSON, and validate the request DTO.", tone: "blue" },
            { label: "Run the use case", value: "Java", detail: "The controller delegates to the service and optional storage layer.", tone: "green" },
            { label: "Write the response", value: "HTTP", detail: "Apply the status and headers, then convert the response DTO to JSON.", tone: "orange" },
          ],
        },
      },
      {
        cue: "Show the HTTP contract produced by the Java code",
        stage: "HTTP request and response",
        spokenText: "The HTTP result matters as much as the annotations. A create request sends JSON with `Content-Type: application/json`. When creation succeeds, the API returns `201 Created`, a `Location` header pointing to the new resource, and a response body containing the generated ID. This makes the endpoint clear to any client, even if that client knows nothing about Java or Spring.",
        support: {
          type: "code",
          title: "POST /products contract",
          language: "http",
          code: "POST /products HTTP/1.1\nContent-Type: application/json\n\n{\"name\":\"Keyboard\",\"price\":1499}\n\nHTTP/1.1 201 Created\nLocation: /products/21\nContent-Type: application/json\n\n{\"id\":21,\"name\":\"Keyboard\",\"price\":1499}",
          caption: "The `Location` header tells the client where the newly created product can be read.",
        },
      },
      {
        cue: "Explain validation, errors, and layer boundaries",
        stage: "Validation and boundaries",
        spokenText: "With the validation starter and constraints on the DTO, `@Valid` lets Spring MVC reject invalid request data with `400 Bad Request`. A missing product becomes `404 Not Found` only when the application maps that condition, for example through `@RestControllerAdvice` and `@ExceptionHandler`. The controller should stay focused on HTTP, the service should own business rules, and a repository should be used only when persistent storage is required.",
        recallRule: "Spring Boot configures the web foundation; Spring MVC connects HTTP to Java; your controller, service, DTOs, and storage code implement the application.",
        support: {
          type: "comparison",
          title: "Keep each responsibility clear",
          items: [
            { label: "Controller", detail: "URLs, request data, status codes, and response data.", tone: "blue" },
            { label: "Service", detail: "Business rules and the use case being performed.", tone: "green" },
            { label: "Repository or store", detail: "Reads and saves data only when the use case needs storage.", tone: "orange" },
          ],
        },
      },
    ],
    deepSections: [
      {
        type: "deep_explanation",
        title: "The request path through Spring",
        content: "A Spring Boot REST API connects an HTTP client to Java application code. For example, a client sends `POST /products` with JSON, the application creates a product, and the client receives an HTTP response with a status, headers, and JSON. REST does not require JSON, but JSON is the common default in a Spring Web application.\n\nThe request does not jump directly into a service. It passes through the embedded server and Spring MVC before the controller runs. This path is the mental model for the rest of the implementation.\n\n```mermaid\nsequenceDiagram\n  participant C as Client\n  participant M as Spring MVC\n  participant P as ProductController\n  participant S as ProductService\n  participant R as Repository or store\n  C->>M: POST /products + JSON\n  M->>M: Route, convert JSON, validate DTO\n  M->>P: create(request)\n  P->>S: create(request)\n  S->>R: save product\n  R-->>S: saved product\n  S-->>P: ProductResponse\n  P-->>M: 201 + Location + response DTO\n  M-->>C: JSON response\n```\n\nSpring MVC performs routing, argument binding, validation, and response writing. The controller and service contain the code that belongs to this product API.",
      },
      {
        type: "deep_explanation",
        title: "Set up Spring Web",
        content: "Add `spring-boot-starter-web` to use Spring MVC. Spring Boot then starts an embedded Tomcat server by default and configures the `DispatcherServlet`, request mapping, and Jackson-based JSON support. Add the validation starter when request DTOs use Bean Validation constraints such as `@NotBlank` or `@Positive`.\n\n```xml\n<dependency>\n  <groupId>org.springframework.boot</groupId>\n  <artifactId>spring-boot-starter-web</artifactId>\n</dependency>\n<dependency>\n  <groupId>org.springframework.boot</groupId>\n  <artifactId>spring-boot-starter-validation</artifactId>\n</dependency>\n```\n\nThe class annotated with `@SpringBootApplication` starts the application. By default, component scanning begins in that class's package and its child packages, so controllers and services should normally live below it in the package structure.",
      },
      {
        type: "deep_explanation",
        title: "Define the API contract",
        content: "Request and response DTOs make the JSON contract clear. The create request does not contain an ID because the server generates it; the response includes that generated ID. Keeping these DTOs separate from database entities also prevents an internal schema change from silently changing the public API.\n\n```java\nimport jakarta.validation.constraints.NotBlank;\nimport jakarta.validation.constraints.Positive;\nimport java.math.BigDecimal;\n\nrecord CreateProductRequest(\n        @NotBlank String name,\n        @Positive BigDecimal price) {}\n\nrecord ProductResponse(\n        long id,\n        String name,\n        BigDecimal price) {}\n```\n\n`@NotBlank` rejects a missing, empty, or whitespace-only name. `@Positive` requires a value greater than zero. The constraints run before the controller method when the validation dependency is present and the parameter uses `@Valid`.\n\n#### Where request data comes from\n\n| Annotation | Reads from | Example |\n|---|---|---|\n| `@PathVariable` | URL path | `/products/10` gives `id = 10` |\n| `@RequestParam` | Query string | `/products?category=books` |\n| `@RequestBody` | Request body | JSON used to create a product |\n| `@RequestHeader` | HTTP header | `X-Request-Id: abc-123` |",
      },
      {
        type: "deep_explanation",
        title: "Build the controller and service",
        content: "The controller translates HTTP into a service call. It owns URLs, request binding, validation entry points, status codes, headers, and response DTOs. It should not contain pricing rules, stock checks, or database queries.\n\n```java\nimport jakarta.validation.Valid;\nimport java.net.URI;\nimport org.springframework.http.ResponseEntity;\nimport org.springframework.web.bind.annotation.*;\n\n@RestController\n@RequestMapping(\"/products\")\nclass ProductController {\n    private final ProductService productService;\n\n    ProductController(ProductService productService) {\n        this.productService = productService;\n    }\n\n    @GetMapping(\"/{id}\")\n    ProductResponse findById(@PathVariable long id) {\n        return productService.findById(id);\n    }\n\n    @PostMapping\n    ResponseEntity<ProductResponse> create(\n            @Valid @RequestBody CreateProductRequest request) {\n        ProductResponse product = productService.create(request);\n        URI location = URI.create(\"/products/\" + product.id());\n        return ResponseEntity.created(location).body(product);\n    }\n}\n```\n\n`@RestController` makes returned objects part of the response body. The mapping annotations connect an HTTP method and path to each Java method, while `@PathVariable` and `@RequestBody` supply its arguments. The only constructor is used for injection, so `@Autowired` is unnecessary.\n\nFor creation, the controller delegates to `ProductService`. `ResponseEntity.created(...)` then produces `201 Created`, the `Location` header, and the response DTO. The service remains responsible for the actual use case.",
      },
      {
        type: "code_example",
        title: "Product service",
        content: "```java\nimport java.util.Map;\nimport java.util.concurrent.ConcurrentHashMap;\nimport java.util.concurrent.atomic.AtomicLong;\nimport org.springframework.stereotype.Service;\n\n@Service\nclass ProductService {\n    private final Map<Long, ProductResponse> products =\n            new ConcurrentHashMap<>();\n    private final AtomicLong nextId = new AtomicLong();\n\n    ProductResponse create(CreateProductRequest request) {\n        long id = nextId.incrementAndGet();\n        ProductResponse product = new ProductResponse(\n                id, request.name(), request.price());\n        products.put(id, product);\n        return product;\n    }\n\n    ProductResponse findById(long id) {\n        ProductResponse product = products.get(id);\n        if (product == null) {\n            throw new ProductNotFoundException(id);\n        }\n        return product;\n    }\n}\n```\n\nThis in-memory map is only a teaching substitute for storage; it is not a repository implementation. A real service can call `ProductRepository` without changing the controller's HTTP contract.",
      },
      {
        type: "deep_explanation",
        title: "Handle errors and verify the API",
        content: "A client needs a useful HTTP status and a consistent error body. With validation configured, invalid DTO fields are normally handled as `400 Bad Request`. A missing product becomes `404 Not Found` only when the application maps that condition to 404; throwing any exception does not make it automatic.\n\n```java\nclass ProductNotFoundException extends RuntimeException {\n    ProductNotFoundException(long id) {\n        super(\"Product \" + id + \" was not found\");\n    }\n}\n\nrecord ApiError(String message) {}\n\n@RestControllerAdvice\nclass ApiExceptionHandler {\n    @ExceptionHandler(ProductNotFoundException.class)\n    ResponseEntity<ApiError> handleNotFound(\n            ProductNotFoundException exception) {\n        return ResponseEntity.status(404)\n                .body(new ApiError(exception.getMessage()));\n    }\n}\n```\n\n`@RestControllerAdvice` applies the handler across controllers. `@ExceptionHandler` selects the method for `ProductNotFoundException`, and that method converts the Java failure into an HTTP response the client can understand.\n\n#### Status codes used by this API\n\n| Situation | Status | Meaning |\n|---|---:|---|\n| Product returned successfully | `200 OK` | The read succeeded |\n| Product created | `201 Created` | A new resource was created |\n| Request fields are invalid | `400 Bad Request` | The client must correct the input |\n| Product ID does not exist | `404 Not Found` | The requested resource is missing |\n| Wrong request media type | `415 Unsupported Media Type` | The body is not in a supported format |\n| Unexpected server failure | `500 Internal Server Error` | The server failed to complete the request |\n\nThe status code is part of the API contract, so the API should not return `200 OK` for every outcome.",
      },
      {
        type: "code_example",
        title: "Verify the HTTP contract",
        content: "Send one complete request with curl or Postman and inspect the full response:\n\n```http\nPOST /products HTTP/1.1\nHost: localhost:8080\nContent-Type: application/json\n\n{\"name\":\"Keyboard\",\"price\":1499}\n\nHTTP/1.1 201 Created\nLocation: /products/1\nContent-Type: application/json\n\n{\"id\":1,\"name\":\"Keyboard\",\"price\":1499}\n```\n\nThen verify `GET /products/1` returns `200 OK` and the same product. Tests should also cover an empty name or negative price (`400`), an unknown ID (`404`), and the wrong `Content-Type` (`415`). These HTTP-level checks catch incorrect request binding, validation, status codes, headers, and JSON—not just errors inside one Java method.",
      },
      {
        type: "practice_prompt",
        title: "Try it yourself",
        content: "Add `PUT /products/{id}` to update a product. Read the ID with `@PathVariable`, validate a request body, keep the update rule in `ProductService`, and return `200 OK` for an updated product or `404 Not Found` for an unknown ID. Test both results with curl, Postman, or MockMvc.",
      },
    ],
    followups: [
      "What does `@RestController` add to a controller?",
      "Why should an API accept DTOs instead of JPA entities?",
      "What belongs in a controller integration test?",
    ],
  },
  "rest-api-vs-web-service-java-backend-interview": {
    direct: "A web service is a software interface that lets programs communicate through web technologies such as HTTP. A REST API is a more specific kind of interface: it follows the REST architectural constraints, usually through HTTP resources and representations. In broad everyday usage, a REST API can be called a web service, but not every web service is a REST API.",
    minutes: 9,
    answerSize: "compact",
    quick: [
      "A web service is the broad idea: one program exposes functionality or data for another program through web technologies such as HTTP.",
      "A REST API is one way to build that interface by following REST constraints such as stateless requests, cacheable responses, and a uniform interface.",
      "Most REST APIs use HTTP, but JSON is only a representation format; REST can also return XML, HTML, or another media type.",
      "A SOAP service is a common example of a web service that is not REST: it exchanges SOAP XML messages and is often described by WSDL.",
      "The term “web service” is sometimes used narrowly to mean SOAP/WSDL, so clarify the intended meaning before comparing technologies.",
    ],
    interview: "A web service is a software interface that lets one application communicate with another over a network. A REST API is more specific: it is an API designed using the REST architectural style. In the broad everyday meaning, a REST API is one kind of web service, but not every web service is RESTful.\n\nA REST API follows constraints such as client-server separation, stateless requests, cacheable responses, a uniform interface, and layered components. It commonly uses HTTP resources, methods, status codes, headers, and representations. JSON is popular, but REST can also use XML, HTML, images, or other media types.\n\nFor example, a REST-style service can identify an order as `/orders/42`, and `GET /orders/42` asks for its current representation. A SOAP web service can provide a `GetOrder` operation and send it inside a SOAP XML message, often using a WSDL description. Both can return the same order data, but their public contracts are different.\n\nSome older enterprise teams use “web service” as another name for SOAP and WSDL. In that context, the comparison is really REST versus SOAP. Neither style automatically provides security, speed, or reliability; those depend on the design and implementation. The simplest accurate conclusion is that REST API describes one architectural style, while web service is usually the broader term.",
    interviewBeats: [
      {
        cue: "Establish the category and the specific style",
        stage: "The relationship",
        spokenText: "A web service is a software interface that allows one application to communicate with another over a network. A REST API is more specific: it is an API designed according to the REST architectural style. In the broad industry meaning of web service, a REST API is one type of web service, but not every web service follows REST.",
        support: {
          type: "comparison",
          title: "Broad term and specific style",
          items: [
            { label: "Web service", detail: "The broad category of program-to-program services exposed over a network.", tone: "blue" },
            { label: "REST API", detail: "An API whose interactions follow REST constraints.", tone: "green" },
            { label: "SOAP service", detail: "A web service based on SOAP XML messages; it is not a REST API.", tone: "orange" },
          ],
        },
      },
      {
        cue: "Name what actually makes the interface RESTful",
        stage: "What REST adds",
        spokenText: "REST describes constraints on the interaction. The important ones are client-server separation, stateless requests, cacheable responses, a uniform interface, and layered components. REST APIs commonly use HTTP so resource identifiers, methods, status codes, headers, and media types have shared meaning. JSON is common, but it is only one representation format and is not the definition of REST.",
      },
      {
        cue: "Use one capability to compare the two interface models",
        stage: "Order example",
        spokenText: "A REST-style order service can identify an order as `/orders/42`, and `GET /orders/42` retrieves its current representation. A SOAP web service can expose a `GetOrder` operation in a WSDL contract and carry that operation inside a SOAP XML envelope. Both services can return the same order data, but REST models a resource through a uniform interface while SOAP models a structured message and operation.",
        support: {
          type: "code",
          title: "Two ways to request order 42",
          language: "http",
          code: "REST-style HTTP\nGET /orders/42 HTTP/1.1\nAccept: application/json\n\nSOAP 1.2 over HTTP\nPOST /OrderService HTTP/1.1\nContent-Type: application/soap+xml\n\n<env:Envelope xmlns:env=\"http://www.w3.org/2003/05/soap-envelope\">\n  <env:Body>\n    <GetOrder xmlns=\"https://example.com/orders\">\n      <id>42</id>\n    </GetOrder>\n  </env:Body>\n</env:Envelope>",
          caption: "The business capability is the same; the public interaction contract is different.",
        },
      },
      {
        cue: "Handle the older enterprise meaning of web service",
        stage: "Why the wording changes",
        spokenText: "The term web service is not always used consistently. Older enterprise documentation often uses it narrowly for SOAP, WSDL, and related WS-* standards. When that is the intended meaning, the practical comparison becomes REST versus SOAP. The safest answer states the broad relationship first and then explains this narrower usage.",
      },
      {
        cue: "Finish with the accurate boundary",
        stage: "Final distinction",
        spokenText: "Neither web service nor REST API guarantees security, speed, reliability, or transactions. Those depend on the protocol features and the system design. The accurate conclusion is that a REST API can be a web service, but a web service does not have to be RESTful.",
        recallRule: "Web service is the broad category; REST API is the constrained architectural style.",
      },
    ],
    deepSections: [
      {
        type: "deep_explanation",
        title: "A REST API is a specific kind of network interface",
        content: "**REST API and web service**\n\nIn everyday development, a **web service** means a software interface that one program can call over a network. The name tells us that applications communicate, but it does not tell us one fixed message format or architecture. The W3C Web Services Architecture uses a narrower historical definition based on machine-processable service descriptions and message exchange. That definition is closely associated with WSDL and SOAP. This is why two developers may use the same term differently.\n\nA **REST API** is defined by its architectural style. REST was described by Roy Fielding as a set of constraints for distributed hypermedia systems. The constraints include client-server separation, stateless communication, cacheable responses, a uniform interface, layered components, and optional code-on-demand. A real REST interface also identifies resources, transfers representations, uses self-descriptive messages, and lets hypermedia guide application state.\n\nMost REST APIs use HTTP because HTTP already provides resource identifiers, standard method semantics, status codes, headers, media types, caching, and conditional requests. REST does not require JSON. JSON, XML, HTML, an image, or another suitable media type can represent a resource.\n\n**The category relationship**\n\nUsing the broad industry meaning, a REST API is a kind of web service because it lets applications communicate through web technologies. The reverse is not true. A SOAP service is also commonly called a web service, but SOAP defines an XML messaging framework rather than the REST uniform interface. An operation-oriented HTTP or RPC service may also expose a useful API without following all REST constraints.\n\nThis is a category relationship, not a contest between equal terms: **web service describes the broad purpose; REST describes one architectural style used to fulfil that purpose**. If someone uses “web service” to mean SOAP/WSDL specifically, say so and compare REST with SOAP instead of pretending the term has only one meaning.\n\n**Limits of the labels**\n\nA REST API is not automatically simple, secure, or fast. A SOAP service is not automatically reliable or transactional. Both still need an explicit security model, validation, error handling, timeouts, retries, observability, versioning, and business consistency. The interface style shapes the contract, but the implementation and surrounding standards provide the operational properties.\n\n**Standards behind this explanation**\n\n- [Fielding, REST architectural style](https://ics.uci.edu/~fielding/pubs/dissertation/rest_arch_style.htm) defines REST through architectural constraints and the uniform interface.\n- [W3C Web Services Architecture](https://www.w3.org/TR/ws-arch/) explains the formal web-service model, service descriptions, and message exchange.\n- [W3C SOAP 1.2](https://www.w3.org/TR/soap12-part1/) defines the SOAP messaging framework and envelope processing model.",
      },
      {
        type: "flow_diagram",
        title: "How the terms relate",
        content: "```mermaid\nflowchart TD\n  W[Web service<br/>program-to-program interface] --> R[REST-style API]\n  W --> S[SOAP service]\n  W --> O[Other HTTP or message API]\n  R --> RC[REST constraints<br/>resources + uniform interface]\n  S --> SC[SOAP XML messages<br/>often WSDL-described]\n```\n\nThe diagram uses the broad industry meaning of web service. In some enterprise contexts, “web service” is used narrowly for the SOAP branch only.",
      },
      {
        type: "comparison_table",
        title: "Compare scope, not only payload format",
        content: "| Question | Web service | REST API |\n|---|---|---|\n| What does the term describe? | A service used by another program over a network; older standards may use a narrower SOAP/WSDL meaning | An API following the REST architectural style |\n| Is one data format required? | No single format in broad usage; SOAP web services use SOAP XML | No; representations can be JSON, XML, HTML, images, or other media types |\n| What defines the interaction? | Depends on the chosen service style or protocol | REST constraints and a uniform interface; HTTP commonly supplies the concrete semantics |\n| Common example | A SOAP operation described by WSDL | A resource identified as `/orders/42` and represented over HTTP |\n| Relationship | Broad category | One possible kind of web service |",
      },
      {
        type: "code_example",
        title: "The same order lookup with two different contracts",
        content: "A REST-style request identifies the order resource:\n\n```http\nGET /orders/42 HTTP/1.1\nHost: api.example.com\nAccept: application/json\n\nHTTP/1.1 200 OK\nContent-Type: application/json\nCache-Control: private, max-age=60\n\n{\"id\":42,\"status\":\"PAID\",\"total\":1499}\n```\n\nA SOAP 1.2 service can model the same capability as an operation inside an XML envelope:\n\n```xml\n<?xml version=\"1.0\" encoding=\"UTF-8\"?>\n<env:Envelope xmlns:env=\"http://www.w3.org/2003/05/soap-envelope\">\n  <env:Body>\n    <GetOrder xmlns=\"https://example.com/orders\">\n      <id>42</id>\n    </GetOrder>\n  </env:Body>\n</env:Envelope>\n```\n\nBoth interfaces can return order 42. The first uses a resource identifier and HTTP's uniform semantics. The second uses a SOAP message whose application operation and XML types may be described by WSDL. The difference is the public contract, not the business data being requested.",
      },
    ],
    followups: [
      "Why can a REST API be called a web service?",
      "Why does returning JSON not make an API RESTful?",
      "How would the answer change if web service means SOAP/WSDL in that organization?",
    ],
  },
};

// The foundation definition separates REST from the technologies commonly used
// to implement it. The detailed constraint map remains in Deep Dive; the small
// comparison here removes the HTTP/JSON misconception at the point it appears.
Object.assign(
  lessons["what-is-rest-restful-api-fundamentals-for-java-developers"],
  {
    interviewFromBeats: true,
    answerSize: "standard",
    interviewBeats: [
      {
        cue: "Define REST and separate it from implementation choices",
        stage: "REST is a design style",
        spokenText:
          "REST, or Representational State Transfer, is an architectural style for distributed hypermedia systems. It places constraints on how clients, servers, and intermediaries exchange representations of resources. REST is not a Java library, a Spring annotation, an HTTP method set, or a JSON format. HTTP is commonly used because its methods, status codes, headers, and caching rules fit the style, while JSON is only one possible representation format.",
        support: {
          type: "comparison",
          title: "REST, HTTP, and JSON do different jobs",
          items: [
            {
              label: "REST",
              value: "architectural style",
              detail: "Constrains how components interact around resources and representations.",
              tone: "blue",
            },
            {
              label: "HTTP",
              value: "application protocol",
              detail: "Commonly supplies methods, status codes, headers, and cache semantics.",
              tone: "green",
            },
            {
              label: "JSON",
              value: "representation format",
              detail: "Carries data but does not make an interface RESTful by itself.",
              tone: "orange",
            },
          ],
        },
      },
      {
        cue: "Connect a stable resource identity to a transferred representation",
        stage: "Resources carry state",
        spokenText:
          "A REST API exposes resources such as an order, customer, or report. `/orders/42` can identify order 42, and `GET /orders/42` asks for a representation of its current state. That representation may be JSON, XML, HTML, or another media type. The public resource identity can remain stable even when the server changes its Java classes, service layout, or database tables.",
      },
      {
        cue: "Name the constraints and the job each one performs",
        stage: "Constraints shape the API",
        spokenText:
          "An API becomes RESTful by applying REST's constraints. Client-server separates interface concerns from data and service concerns. Statelessness makes each request self-contained. Cacheability controls response reuse. A layered system permits intermediaries. The uniform interface gives messages and resources shared meaning. Code-on-demand, the only optional constraint, lets the server send executable code to extend a client.",
      },
      {
        cue: "Explain how to judge whether an HTTP API is actually RESTful",
        stage: "Judge behavior, not JSON",
        spokenText:
          "The uniform interface includes resource identification, manipulation through representations, self-descriptive messages, and hypermedia controls for possible next actions. Returning JSON from `@RestController`, using noun paths, or mapping CRUD to HTTP can follow useful conventions without satisfying the full style. Many production APIs intentionally use only part of REST, so the accurate test is which constraints the interaction follows, not which framework or payload format it uses.",
        recallRule:
          "REST is the constrained interaction style; HTTP is the usual protocol; JSON is only one representation.",
      },
    ],
  },
);

// This URI answer teaches three concepts that are often collapsed into one:
// the resource, its identifier, and a transferred representation. Full HTTP
// creation examples remain in Deep Dive instead of being repeated here.
Object.assign(
  lessons["rest-resources-and-uri-design-java-backend-interview"],
  {
    interviewFromBeats: true,
    answerSize: "standard",
    interviewBeats: [
      {
        cue: "Define a resource independently of storage and Java classes",
        stage: "Resource is public identity",
        spokenText:
          "A REST resource is an identifiable concept that the API exposes, such as one order, the orders collection, a generated report, or a checkout in progress. It is not required to match one database row or Java object. A resource keeps its public identity while its state changes and while the server changes how that state is computed or stored.",
        support: {
          type: "comparison",
          title: "Resource, URI, and representation",
          items: [
            {
              label: "Resource",
              value: "order 42",
              detail: "The public domain concept whose state can change over time.",
              tone: "blue",
            },
            {
              label: "URI",
              value: "/orders/42",
              detail: "The stable identifier used to address that resource.",
              tone: "green",
            },
            {
              label: "Representation",
              value: "JSON or XML",
              detail: "The transferred description of the resource at that moment.",
              tone: "orange",
            },
          ],
        },
      },
      {
        cue: "Use collection and member identifiers with HTTP method semantics",
        stage: "Collections and members",
        spokenText:
          "A URI identifies the resource, while the HTTP method states the request intent. `/orders` commonly identifies the collection and `/orders/42` one member. `GET /orders/42` retrieves a representation, while `DELETE /orders/42` requests removal of that resource. Keeping the action in the method avoids operation paths such as `/orders/getById/42` when standard HTTP semantics already express it.",
      },
      {
        cue: "Separate real relationships from collection views",
        stage: "Relationships and views",
        spokenText:
          "A nested path is useful when the parent gives essential context: `/customers/7/orders` identifies customer 7's order collection. If order 42 already has its own identity, `/orders/42` is the simpler canonical address. Query parameters shape a collection view, so `/orders?status=pending&sort=-createdAt&limit=20` naturally expresses filtering, ordering, and page size without creating a new path for every combination.",
      },
      {
        cue: "Keep the public identifier independent of implementation details",
        stage: "Keep internals out",
        spokenText:
          "Good identifiers use stable domain language and avoid names such as `/OrderController/findById/42` or `/order_table/42`, which expose code or storage. After `POST /orders`, the server can return `201 Created` and `Location: /orders/43` for the new member. Noun-oriented paths are a useful convention, not a REST constraint by themselves; the deeper requirement is stable resource identification and consistent message semantics.",
        recallRule:
          "The resource is the concept, the URI is its public identifier, and the representation is the state transferred across the network.",
      },
    ],
  },
);

// This statelessness answer keeps resource state separate from hidden client
// conversation state, then proves the distinction with two requests that may
// reach different server instances. The detailed workflow table remains in the
// Deep Dive, so the Interview Answer needs only one compact trace.
Object.assign(
  lessons["statelessness-in-rest-apis-java-backend-interview"],
  {
    interviewFromBeats: true,
    answerSize: "standard",
    interviewBeats: [
      {
        cue: "Define statelessness at the request boundary",
        stage: "Each request stands alone",
        spokenText:
          "In REST, statelessness means the server handles each request from the information in that request and the resources it identifies. It must not depend on a private memory of earlier steps kept only for that client on one server. For example, `GET /orders/42` identifies the order and carries any credential and request headers needed to process the read. Statelessness is about the client-server conversation; it does not mean the application has no stored data.",
      },
      {
        cue: "Show two requests reaching different healthy instances",
        stage: "Two requests, two servers",
        spokenText:
          "Suppose the first request is `POST /checkouts` with a cart ID and an `Authorization` credential. Instance A creates checkout `CH-21` in shared storage and returns `Location: /checkouts/CH-21`. Later, `GET /checkouts/CH-21` may reach Instance B. Because that request names the checkout and again carries the credential, B can load the resource and respond. It does not need an in-memory note from Instance A saying which checkout belongs to this conversation.",
        support: {
          type: "trace",
          title: "Two requests do not need the same server",
          items: [
            {
              label: "First request",
              value: "POST /checkouts",
              detail: "Send the cart ID and authorization information needed to create the checkout.",
              tone: "blue",
            },
            {
              label: "Instance A",
              value: "201 + Location",
              detail: "Save checkout CH-21 in shared storage and return its resource URI.",
              tone: "green",
            },
            {
              label: "Second request",
              value: "GET /checkouts/CH-21",
              detail: "Name the saved resource and present authorization again.",
              tone: "orange",
            },
            {
              label: "Instance B",
              value: "200 + checkout",
              detail: "Load the resource without depending on Instance A's memory.",
              tone: "neutral",
            },
          ],
        },
      },
      {
        cue: "Separate durable resources from conversation context",
        stage: "Resource state remains",
        spokenText:
          "Orders, checkouts, users, permission records, and inventory are resource or application state, so they can remain in databases and shared caches. Client session state is the context of the conversation, such as which workflow step comes next. The client carries that context or identifies an explicitly saved resource. A credential can be a JWT or an opaque token, and the server may still look up permissions. The problem is storing required progress only in one instance's private session memory.",
      },
      {
        cue: "Connect the constraint to scaling and its limits",
        stage: "Scale without sticky sessions",
        spokenText:
          "Without a required in-memory session, a load balancer can send each request to any healthy instance. This simplifies horizontal scaling and lets the next request continue after one instance restarts. Statelessness does not make a response cacheable; the HTTP method and cache headers decide that. The cost can be repeated credentials, lookups, and larger requests. An interrupted request can still fail, and retry safety depends on idempotency and the business rule.",
        recallRule:
          "Resource state may stay on the server; the context needed to understand each client request must not be hidden in one server's private session.",
      },
    ],
  },
);

// This implementation question has an individually reviewed Interview Answer.
// Its Deep Dive keeps validation, exception mapping, testing, and persistence
// detail; this presentation stays focused on the core HTTP-to-Java flow.
Object.assign(
  lessons["implementing-rest-api-in-spring-boot-java-fresher-guide"],
  {
    interviewFromBeats: true,
    answerSize: "standard",
    interviewBeats: [
      {
        cue: "Separate Boot configuration from application code",
        stage: "What Boot configures",
        spokenText:
          "With `spring-boot-starter-web`, Spring Boot starts an embedded web server and auto-configures Spring MVC. The `DispatcherServlet` receives incoming requests, handler mappings choose a controller method, and Jackson is available to translate between JSON and Java objects. Boot provides this web foundation; the developer still defines the endpoints, request and response types, business rules, and storage.",
      },
      {
        cue: "Define the controller as the HTTP boundary",
        stage: "The controller boundary",
        spokenText:
          "At the HTTP boundary, `@RestController` marks the class as an API controller, `@RequestMapping` supplies a base path, and `@PostMapping` selects a method for `POST`. `@RequestBody` asks Jackson to create the request object from JSON. The controller receives its `ProductService` through constructor injection and uses `ResponseEntity` when it needs to set the status, headers, and response body.",
        support: {
          type: "code",
          title: "A focused product controller",
          language: "java",
          code: "import java.math.BigDecimal;\nimport java.net.URI;\nimport org.springframework.http.ResponseEntity;\nimport org.springframework.web.bind.annotation.*;\n\nrecord CreateProductRequest(String name, BigDecimal price) {}\nrecord ProductResponse(long id, String name, BigDecimal price) {}\n\ninterface ProductService {\n    ProductResponse create(CreateProductRequest request);\n}\n\n@RestController\n@RequestMapping(\"/products\")\nclass ProductController {\n    private final ProductService service;\n\n    ProductController(ProductService service) {\n        this.service = service;\n    }\n\n    @PostMapping\n    ResponseEntity<ProductResponse> create(\n            @RequestBody CreateProductRequest request) {\n        ProductResponse product = service.create(request);\n        URI location = URI.create(\"/products/\" + product.id());\n        return ResponseEntity.created(location).body(product);\n    }\n}",
          caption: "The controller is complete at the HTTP boundary; a separate ProductService implementation owns the create-product use case.",
        },
      },
      {
        cue: "Trace one creation request through every layer",
        stage: "One POST from start to finish",
        spokenText:
          "For `POST /products`, Spring MVC matches the route and Jackson converts the JSON body into `CreateProductRequest`. The controller passes that object to the service, which performs the create-product use case and returns `ProductResponse`. The controller builds `201 Created` with a `Location` header, and Jackson writes the response object as JSON. A repository is involved only if this service needs persistent storage.",
        support: {
          type: "trace",
          title: "One request from HTTP to JSON",
          items: [
            {
              label: "Request",
              value: "POST /products",
              detail: "The client sends a product representation as JSON.",
              tone: "blue",
            },
            {
              label: "Route and bind",
              value: "Spring MVC",
              detail: "Choose the controller method and convert JSON into the request record.",
              tone: "green",
            },
            {
              label: "Run the use case",
              value: "service.create",
              detail: "Application code creates the product and returns the response record.",
              tone: "orange",
            },
            {
              label: "Respond",
              value: "201 Created",
              detail: "Send Location and let Jackson write the response record as JSON.",
              tone: "neutral",
            },
          ],
        },
      },
      {
        cue: "Close with the HTTP contract and layer boundary",
        stage: "The HTTP result matters",
        spokenText:
          "The result is an HTTP contract, not merely a Java method call: a successful create returns `201 Created`, `Location: /products/21`, and a JSON body for the new product. A read endpoint follows the same pattern with `@GetMapping(\"/{id}\")` and `@PathVariable`. The controller owns HTTP details, while the service owns business decisions. Validation and consistent error mapping extend this boundary and belong in the deeper implementation.",
        recallRule:
          "Spring Boot configures the web foundation; Spring MVC connects HTTP to the controller; the service performs the use case; Jackson reads and writes JSON.",
      },
    ],
  },
);
delete lessons["implementing-rest-api-in-spring-boot-java-fresher-guide"].interviewExtra;

for (const lesson of Object.values(lessons)) {
  if (lesson.deep) {
    lesson.deep = lesson.deep
      .replace("**Follow one familiar resource**", "**Order resource example**")
      .replace("**Begin with the domain noun**", "**Resources and domain names**")
      .replace("**Separate the broad term from one style**", "**Web service and REST API**")
      .replace("**Know the practical boundary**", "**REST boundaries**")
      .replace("**Choose paths by identity, not implementation**", "**Stable paths and internal code**");
  }
}

for (const entry of document) {
  if (requestedSlug && entry.slug !== requestedSlug) continue;
  const lesson = lessons[entry.slug];
  if (!lesson) continue;
  entry.direct_answer = lesson.direct;
  entry.layout_type = "concept-and-architecture";
  entry.difficulty = entry.difficulty === "basic" ? "easy" : (entry.difficulty ?? "medium");
  entry.importance = "high";
  entry.reading_time_minutes = lesson.minutes;
  entry.last_updated = reviewedOn;
  delete entry.interviewer_intent;
  delete entry.speakable_v2;
  const interviewSection = {
    type: "speakable_answer",
    title: "Interview answer",
    answerSize: lesson.answerSize ?? "standard",
    content: lesson.interviewBeats
      ? lesson.interviewBeats.map((beat) => beat.spokenText).join("\n\n")
      : `${lesson.interview}${lesson.interviewExtra ?? ""}`,
    ...(lesson.interviewBeats ? { beats: lesson.interviewBeats } : {}),
  };
  const deepSections = lesson.deepSections ?? [
    { type: "deep_explanation", title: lesson.deepTitle, content: lesson.deep },
    { type: lesson.visualType, title: lesson.visualTitle, content: lesson.visual },
    { type: "code_example", title: lesson.codeTitle, content: lesson.code },
    { type: "practice_prompt", title: lesson.practiceTitle, content: lesson.practice },
  ];
  entry.answer = {
    sections: [
      { type: "key_points", title: "Quick revision", items: lesson.quick },
      interviewSection,
      ...deepSections,
    ],
  };
  entry.followup_questions = lesson.followups;
  entry.seo = {
    metaTitle: `${entry.title} | InterviewExplainer`,
    metaDescription: lesson.direct.replace(/`/g, "").slice(0, 155),
  };
}

const selectedLessonSlugs = requestedSlug ? [requestedSlug] : Object.keys(lessons);
const missing = selectedLessonSlugs.filter(
  (slug) => !document.some((entry) => entry.slug === slug),
);
if (missing.length) throw new Error(`Missing target questions: ${missing.join(", ")}`);

fs.writeFileSync(target, `${JSON.stringify(document, null, 2)}\n`);
console.log(`Curated ${selectedLessonSlugs.length} REST foundation lesson${selectedLessonSlugs.length === 1 ? "" : "s"}; preserved IDs, slugs, questions, and order.`);
