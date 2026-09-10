#!/usr/bin/env node

import { execFileSync, spawnSync } from "node:child_process";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const domainRoot = path.join(repoRoot, "content/go-fresher");
const moduleRoot = path.join(domainRoot, "http-server-basics-go");

const topicOrder = [
  "http-handlefunc",
  "http-listenandserve",
  "request-parsing",
  "writing-json-responses",
  "middleware-basics",
  "http-router-basics",
  "introduction-to-gin",
  "comparisons",
];

const topicTitles = {
  "http-handlefunc": "Handlers and HandleFunc",
  "http-listenandserve": "Server Lifecycle and Shutdown",
  "request-parsing": "Reading and Validating Requests",
  "writing-json-responses": "Writing JSON Responses",
  "middleware-basics": "HTTP Middleware",
  "http-router-basics": "ServeMux Routing",
  "introduction-to-gin": "Gin Fundamentals",
  comparisons: "Choosing and Testing HTTP Tools",
};

const paragraphs = (...values) => values.join("\n\n");
const source = (language, ...lines) => ({ language, text: `${lines.join("\n")}\n` });
const go = (...lines) => source("go", ...lines);
const mod = (...lines) => source("text", ...lines);

function formatSource(file) {
  if (file.language !== "go") return file.text;
  return execFileSync("gofmt", [], { input: file.text, encoding: "utf8" });
}

function renderFiles(files, commands) {
  const blocks = Object.entries(files).map(([name, file]) => {
    const formatted = formatSource(file).trimEnd();
    return `**${name}**\n\n\`\`\`${file.language}\n${formatted}\n\`\`\``;
  });
  if (commands.length > 0) {
    blocks.push(`**Run it**\n\n\`\`\`bash\n${commands.join("\n")}\n\`\`\``);
  }
  return blocks.join("\n\n");
}

const moduleFile = (pathName = "example.test/http") =>
  mod(`module ${pathName}`, "", "go 1.23.0");
const ginModuleFile = () =>
  mod(
    "module example.test/ginlesson",
    "",
    "go 1.25.0",
    "",
    "require github.com/gin-gonic/gin v1.12.0"
  );
const lessons = [];
const add = (lesson) => lessons.push(lesson);

add({
  topicSlug: "http-handlefunc",
  question: "How does `http.HandleFunc` connect a URL pattern to a Go handler function?",
  title: "Connecting routes to handler functions",
  direct: "`HandleFunc` registers a function with the signature `func(http.ResponseWriter, *http.Request)` for a routing pattern. When `ServeMux` selects that pattern, it calls the function with a writer for the outgoing response and the incoming request. The package-level `http.HandleFunc` uses `http.DefaultServeMux`; a mux method registers on that explicit mux.",
  quick: [
    "A handler function receives `http.ResponseWriter` and `*http.Request`.",
    "`ServeMux.HandleFunc` registers the function on one explicit router.",
    "Package-level `http.HandleFunc` registers on `http.DefaultServeMux`.",
    "The mux chooses a matching pattern before invoking the function.",
    "The request is read from `r`; status, headers, and body are written through `w`.",
  ],
  speaking: paragraphs(
    "- `http.HandleFunc` is a registration helper that connects a routing pattern to an ordinary Go function. The function must accept `http.ResponseWriter` and `*http.Request`. The request contains the method, URL, headers, body, context, and connection-related metadata. The writer is the response channel used to set headers, choose a status, and write bytes back to the client.",
    "- There are two forms with different ownership. An explicit mux keeps registration local to the application:\n\n```go\nmux := http.NewServeMux()\nmux.HandleFunc(\"GET /hello/{name}\", hello)\nserver := &http.Server{Handler: mux}\n```\n\nThe package-level `http.HandleFunc` instead registers on `http.DefaultServeMux`. The server calls the chosen handler's `ServeHTTP` method for each request.",
    "- For example, a mux can register `GET /hello/{name}`. A request for `/hello/Ada` matches the route, `r.PathValue(\"name\")` returns `Ada`, and the handler writes `Hello, Ada`. Passing the request through the mux matters because the mux is what matches the wildcard and stores its value on the request.",
    "- Handler code should return after writing an error so it does not also write a success response. It must also assume concurrent calls: the request and local variables belong to one call, but package variables or shared struct fields need safe coordination. A handler function is not automatically a serial callback.",
    "- I normally create an explicit mux, register focused handlers, and pass that mux to an `http.Server` or a test. This makes route ownership visible and avoids hidden process-global registrations. `HandleFunc` is therefore small glue: routing decides when the function runs, while the function owns one request-to-response operation."
  ),
  overviewTitle: "A route selects one request-to-response function",
  overview: "Registration builds the routing table before traffic arrives. At request time, the mux matches method and path, fills wildcard values, and invokes the selected function with one request and one response writer.",
  deepTitle: "Handler registration and request dispatch",
  deep: paragraphs(
    "**Registration.** Calling `HandleFunc` does not start a server and does not call the function immediately. It adds a pattern and function to a mux. Invalid or conflicting patterns can panic during registration, which is useful because routing mistakes surface at startup rather than under traffic.",
    "**Dispatch.** A server treats the mux as an `http.Handler` and calls `ServeHTTP`. The mux compares the request with its registered patterns, selects the most specific match, and calls the associated handler. With Go 1.22-style patterns, the method can be part of the pattern and wildcard values become available through `Request.PathValue`.",
    "**Request side.** `*http.Request` describes what arrived. URL query values, path values, headers, and the body remain different input channels and should be parsed according to the endpoint contract. The request context carries cancellation when the client disconnects or the server ends the request.",
    "**Response side.** `ResponseWriter.Header` prepares response headers. `WriteHeader` commits a status, and the first `Write` implicitly commits 200 if no status was chosen. Once committed, later attempts cannot replace the status or already-sent headers.",
    "**Testing boundary.** Test through the mux when route matching is part of the behavior. Calling the function directly is useful for isolated handler logic, but it does not prove that the pattern matches or that path wildcards are populated."
  ),
  visualType: "flow_diagram",
  visualTitle: "From registration to response",
  visual: "```mermaid\nflowchart LR\n  A[mux.HandleFunc registers pattern] --> B[HTTP server receives request]\n  B --> C[ServeMux matches method and path]\n  C --> D[Wildcard values stored on Request]\n  D --> E[Handler reads r and writes w]\n  E --> F[Status, headers, body returned]\n```",
  codeTitle: "Wildcard route registration example",
  files: {
    "go.mod": moduleFile(),
    "hello.go": go(
      "package lesson",
      "",
      "import (",
      "\t\"fmt\"",
      "\t\"net/http\"",
      ")",
      "",
      "func NewHandler() http.Handler {",
      "\tmux := http.NewServeMux()",
      "\tmux.HandleFunc(\"GET /hello/{name}\", func(w http.ResponseWriter, r *http.Request) {",
      "\t\tfmt.Fprintf(w, \"Hello, %s\", r.PathValue(\"name\"))",
      "\t})",
      "\treturn mux",
      "}"
    ),
    "hello_test.go": go(
      "package lesson",
      "",
      "import (",
      "\t\"net/http\"",
      "\t\"net/http/httptest\"",
      "\t\"testing\"",
      ")",
      "",
      "func TestHelloRoute(t *testing.T) {",
      "\trequest := httptest.NewRequest(http.MethodGet, \"/hello/Ada\", nil)",
      "\trecorder := httptest.NewRecorder()",
      "\tNewHandler().ServeHTTP(recorder, request)",
      "\tresponse := recorder.Result()",
      "\tdefer response.Body.Close()",
      "\tif response.StatusCode != http.StatusOK || recorder.Body.String() != \"Hello, Ada\" {",
      "\t\tt.Fatalf(\"status=%d body=%q\", response.StatusCode, recorder.Body.String())",
      "\t}",
      "}"
    ),
  },
  commands: ["go test -race ./...", "go vet ./..."],
  codeNote: "The test calls the mux rather than the function directly, so it validates both route matching and `PathValue` population.",
  followups: [
    "What does passing `nil` as an `http.Server` handler select?",
    "Why should a handler return after writing an error?",
    "When is calling a handler function directly insufficient for a route test?",
  ],
});

add({
  topicSlug: "http-listenandserve",
  question: "What does `http.ListenAndServe` do, and what does it return?",
  title: "Starting a Go HTTP server with ListenAndServe",
  direct: "`http.ListenAndServe` listens on a TCP address and serves requests with the supplied handler. It blocks while the server is running and always returns a non-nil error when serving stops. Passing a nil handler selects `http.DefaultServeMux`; production code usually creates an explicit `http.Server` so lifecycle and timeout settings are visible.",
  quick: [
    "`ListenAndServe` opens the address and serves HTTP requests.",
    "The call blocks until startup fails or the server stops.",
    "Its returned error is always non-nil.",
    "A nil handler means `http.DefaultServeMux`.",
    "`http.ErrServerClosed` is the expected result after `Server.Close` or `Server.Shutdown`.",
  ],
  speaking: paragraphs(
    "- `http.ListenAndServe` is the smallest way to start a Go HTTP server. It takes an address such as `:8080` and an `http.Handler`, opens a TCP listener, and serves requests by calling that handler. The call blocks, so code written after it does not run until the server fails to start or serving ends.",
    "- Passing `nil` as the handler selects `http.DefaultServeMux`. That is convenient for a tiny experiment, but an explicit mux makes route ownership easier to see and test. The package function also gives no place to configure server timeouts, which is why long-running services generally construct an `http.Server` and call its `ListenAndServe` method.",
    "- A normal start keeps serving and does not return `nil`:\n\n```go\nserver := &http.Server{Addr: \"127.0.0.1:8080\", Handler: mux}\nif err := server.ListenAndServe(); err != nil && !errors.Is(err, http.ErrServerClosed) {\n    log.Fatal(err)\n}\n```\n\nAn unavailable port returns a bind error immediately. A later `Shutdown` makes the serving method return `http.ErrServerClosed`.",
    "- That sentinel error is expected during an intentional stop and is normally separated from unexpected failures with `errors.Is`. Ignoring every error would hide a bad address or lost listener, while treating `ErrServerClosed` as a crash would report a normal deployment shutdown as a failure.",
    "- I use the package function only when its defaults genuinely fit. For an application, I keep the server value, start it in a goroutine when shutdown coordination is required, and handle its result explicitly. The core idea is simple: listening and request dispatch happen inside the blocking call, and the returned error explains why that loop ended."
  ),
  overviewTitle: "A blocking serve loop with an explicit ending",
  overview: "Starting the server transfers control to a loop that accepts connections and dispatches requests. The caller regains control only when setup fails or serving ends, so the return value belongs to lifecycle handling rather than ordinary success data.",
  deepTitle: "Server start, running, and stop states",
  deep: paragraphs(
    "**Handler graph.** Route registration, dependency construction, and configuration validation should finish before the service accepts traffic. With an explicit mux, tests can exercise the same routing graph without opening a real port.",
    "**Listener setup.** `ListenAndServe` creates a TCP listener for the server address and then calls the serving loop. An empty address uses `:http`, while a value without a host such as `:8080` binds on available interfaces. The right bind address depends on the deployment, so examples should not be copied blindly into production.",
    "**Request serving.** Accepted connections are handled concurrently. The supplied handler may itself be a mux that selects a final endpoint. A nil handler uses the process-global default mux; it does not mean that every path is accepted.",
    "**Serve result.** The method returns a non-nil error. Startup problems include malformed addresses and unavailable ports. An intentional `Close` or `Shutdown` makes the serve method return `ErrServerClosed`, allowing the main goroutine to distinguish a planned stop from an operational failure.",
    "**Ownership.** The convenience function hides the server value, so the caller cannot directly invoke graceful shutdown or set timeout fields. Creating `&http.Server{Addr: ..., Handler: ...}` exposes those controls and is the usual next step once the process has a real lifecycle."
  ),
  visualType: "flow_diagram",
  visualTitle: "The lifetime of ListenAndServe",
  visual: "```mermaid\nflowchart LR\n  A[Build handler] --> B[ListenAndServe]\n  B --> C{Listener opened?}\n  C -->|No| D[Return startup error]\n  C -->|Yes| E[Accept and serve concurrently]\n  E --> F{Server stopped}\n  F --> G[Return non-nil error]\n  G --> H{errors.Is ErrServerClosed?}\n  H -->|Yes| I[Expected shutdown]\n  H -->|No| J[Operational failure]\n```",
  codeTitle: "Explicit server result handling",
  files: {
    "go.mod": moduleFile(),
    "main.go": go(
      "package main",
      "",
      "import (",
      "\t\"errors\"",
      "\t\"fmt\"",
      "\t\"net/http\"",
      ")",
      "",
      "func main() {",
      "\tmux := http.NewServeMux()",
      "\tmux.HandleFunc(\"GET /health\", func(w http.ResponseWriter, r *http.Request) {",
      "\t\tw.WriteHeader(http.StatusNoContent)",
      "\t})",
      "\tserver := &http.Server{Addr: \"127.0.0.1:8080\", Handler: mux}",
      "\tfmt.Println(\"listening on\", server.Addr)",
      "\tif err := server.ListenAndServe(); err != nil && !errors.Is(err, http.ErrServerClosed) {",
      "\t\tpanic(err)",
      "\t}",
      "}"
    ),
    "main_test.go": go(
      "package main",
      "",
      "import (",
      "\t\"net/http\"",
      "\t\"net/http/httptest\"",
      "\t\"testing\"",
      ")",
      "",
      "func TestHealthContract(t *testing.T) {",
      "\tmux := http.NewServeMux()",
      "\tmux.HandleFunc(\"GET /health\", func(w http.ResponseWriter, r *http.Request) { w.WriteHeader(http.StatusNoContent) })",
      "\trecorder := httptest.NewRecorder()",
      "\tmux.ServeHTTP(recorder, httptest.NewRequest(http.MethodGet, \"/health\", nil))",
      "\tif recorder.Code != http.StatusNoContent { t.Fatalf(\"status=%d\", recorder.Code) }",
      "}"
    ),
  },
  commands: ["go test -race ./...", "go vet ./...", "go run .  # stop with Ctrl+C"],
  checks: [["go", "test", "-race", "./..."], ["go", "vet", "./..."]],
  codeNote: "The automated check tests the handler without occupying a port. The executable demonstrates the blocking call and should be stopped manually.",
  followups: [
    "What handler is used when `ListenAndServe` receives nil?",
    "Why is `ErrServerClosed` not necessarily a service failure?",
    "Why does an application often keep an explicit `http.Server` value?",
  ],
});

add({
  topicSlug: "http-listenandserve",
  question: "Why should a Go HTTP service configure an `http.Server` and its timeouts?",
  title: "Making server limits explicit",
  direct: "An explicit `http.Server` owns the address, handler, lifecycle, and connection timeouts. `ReadHeaderTimeout` limits header reading, `ReadTimeout` can limit the entire request read, `WriteTimeout` limits response writing, and `IdleTimeout` limits idle keep-alive waits. Values must fit the workload because a limit that is too short can break valid slow or streaming requests.",
  quick: [
    "Use `http.Server` to make handler, timeouts, and shutdown controllable.",
    "`ReadHeaderTimeout` limits the time spent reading request headers.",
    "`ReadTimeout` covers reading the whole request, including the body.",
    "`WriteTimeout` limits response writes; streaming endpoints need special care.",
    "`IdleTimeout` limits waiting for the next keep-alive request.",
    "Body-size limits are separate and belong near request parsing.",
  ],
  speaking: paragraphs(
    "- An `http.Server` is the configuration and lifecycle owner for a Go HTTP service. Instead of calling the package-level helper with hidden defaults, the application creates a server with an address, a handler, and limits that match its traffic. The same value can later be shut down, closed, or served on a listener supplied by the program.",
    "- The timeout fields protect different phases. `ReadHeaderTimeout` bounds how long request headers may take. `ReadTimeout` bounds reading the entire request, including its body. `WriteTimeout` bounds response writing, with behavior tied to when headers finish. `IdleTimeout` controls how long an idle keep-alive connection waits for another request, defaulting to `ReadTimeout` when zero.",
    "- For example, a small JSON API can make each phase visible:\n\n```go\nserver := &http.Server{\n    Handler: mux, ReadHeaderTimeout: 3 * time.Second,\n    ReadTimeout: 10 * time.Second, WriteTimeout: 15 * time.Second,\n    IdleTimeout: 60 * time.Second,\n}\n```\n\nA separate `http.MaxBytesReader` limits body bytes; a time limit alone does not stop a client from sending an enormous body quickly.",
    "- These values are not universal security constants. A long upload may need a different read policy, and server-sent events or another streaming response can conflict with a short `WriteTimeout`. TLS handshakes and slow networks also affect the observed phases. Limits need production measurements, endpoint contracts, proxy behavior, and load tests.",
    "- I start with an explicit server even when the initial values are simple, then document why each limit exists. This makes resource ownership visible and avoids an accidental no-timeout public server. The conclusion is not “make every timeout tiny”; it is “bound each phase deliberately, then prove valid clients still fit inside those bounds.”"
  ),
  overviewTitle: "Different limits protect different resources",
  overview: "A request moves through header read, optional body read, handler work, response write, and possibly an idle keep-alive period. One number cannot represent all of those contracts, and byte limits remain separate from time limits.",
  deepTitle: "HTTP timeout phases and trade-offs",
  deep: paragraphs(
    "**Server timeout policy.** An explicit `http.Server` gives the application separate limits for connection and request phases. Each limit protects a different resource, so one copied duration cannot describe every endpoint safely.",
    "**Header read.** Headers are usually small and should arrive promptly. `ReadHeaderTimeout` creates a focused bound without deciding how long a legitimate request body may take. It is often the easiest starting protection for an internet-facing server.",
    "**Body read.** `ReadTimeout` is measured from connection acceptance through reading the full request body. That broad scope may work for a small JSON API, but it can reject expected slow uploads. Handlers can use body-size limits and, in newer designs, response-controller deadlines for more specific needs.",
    "**Response write.** `WriteTimeout` limits the response-writing period. Streaming designs need careful testing because a fixed whole-response deadline may end a healthy long stream. A reverse proxy can add its own limits, so both layers must agree.",
    "**Idle connection.** Keep-alive avoids repeated connection setup, but an idle connection still consumes resources. `IdleTimeout` bounds the pause between requests without forcing the active request to finish within that same duration.",
    "**Handler time.** Server fields are not a substitute for downstream timeouts. Database queries, HTTP clients, and application work should observe `r.Context()` and have their own service-level budgets. Configuration should be tested with normal, maximum, slow, and cancelled requests rather than accepted because it resembles another project."
  ),
  visualType: "comparison_table",
  visualTitle: "Where each server limit applies",
  visual: "| Limit | Protects | Important boundary |\n|---|---|---|\n| `ReadHeaderTimeout` | Header-reading phase | Does not bound body size |\n| `ReadTimeout` | Entire request read | Can reject slow valid uploads |\n| `WriteTimeout` | Response writing | Needs care for streaming |\n| `IdleTimeout` | Keep-alive idle wait | Not active handler time |\n| `MaxBytesReader` | Request-body byte count | Handler-level, not a duration |",
  codeTitle: "HTTP server timeout policy example",
  files: {
    "go.mod": moduleFile(),
    "server.go": go(
      "package lesson",
      "",
      "import (",
      "\t\"net/http\"",
      "\t\"time\"",
      ")",
      "",
      "func NewServer(address string, handler http.Handler) *http.Server {",
      "\treturn &http.Server{",
      "\t\tAddr: address, Handler: handler,",
      "\t\tReadHeaderTimeout: 3 * time.Second,",
      "\t\tReadTimeout: 10 * time.Second,",
      "\t\tWriteTimeout: 15 * time.Second,",
      "\t\tIdleTimeout: 60 * time.Second,",
      "\t}",
      "}"
    ),
    "server_test.go": go(
      "package lesson",
      "",
      "import (",
      "\t\"net/http\"",
      "\t\"testing\"",
      "\t\"time\"",
      ")",
      "",
      "func TestServerPolicy(t *testing.T) {",
      "\tserver := NewServer(\"127.0.0.1:0\", http.NewServeMux())",
      "\tif server.ReadHeaderTimeout != 3*time.Second || server.IdleTimeout != 60*time.Second {",
      "\t\tt.Fatalf(\"unexpected policy: %+v\", server)",
      "\t}",
      "}"
    ),
  },
  commands: ["go test -race ./...", "go vet ./..."],
  checks: [["go", "test", "-race", "./..."], ["go", "vet", "./..."]],
  codeNote: "The values are an example policy for a small API, not universal defaults. Production measurements must justify them.",
  followups: [
    "Why does `ReadHeaderTimeout` not solve oversized request bodies?",
    "Which timeout needs particular care for a streaming response?",
    "Where should a database-call deadline come from?",
  ],
});

add({
  topicSlug: "http-listenandserve",
  question: "How do you gracefully shut down a Go HTTP server?",
  title: "Stopping HTTP traffic without dropping active requests",
  direct: "Run the server while the main flow waits for a termination signal, then call `Server.Shutdown` with a bounded context. Shutdown closes listeners and idle connections and waits for active connections to become idle. The serving method returns `http.ErrServerClosed`; hijacked connections such as WebSockets need separate tracking and shutdown.",
  quick: [
    "Keep the `*http.Server` value and run serving alongside signal waiting.",
    "Use `signal.NotifyContext` or equivalent signal handling.",
    "Call `Shutdown` with a deadline, not an unbounded context.",
    "Treat the serve loop's `http.ErrServerClosed` as expected.",
    "`Shutdown` waits for ordinary active requests, not hijacked connections such as WebSockets.",
  ],
  speaking: paragraphs(
    "- Graceful shutdown means stopping new HTTP work while giving ordinary in-flight requests a bounded chance to finish. The application must own an `*http.Server`; the package-level convenience function does not return one. Serving usually runs in a goroutine while the main flow waits for an operating-system signal or another application cancellation event.",
    "- When cancellation arrives, the program calls `server.Shutdown(ctx)`. Shutdown closes open listeners, closes idle connections, and waits indefinitely for active connections to become idle unless the supplied context expires. A timeout context therefore creates the deployment's maximum drain period. The serving method returns `http.ErrServerClosed` as soon as the listeners close, so that result is normal.",
    "- The shutdown call needs a deadline, and the process must wait for it:\n\n```go\ndrain, cancel := context.WithTimeout(context.Background(), 5*time.Second)\ndefer cancel()\nif err := server.Shutdown(drain); err != nil {\n    log.Printf(\"shutdown: %v\", err)\n}\n```\n\nThe full executable also waits for `SIGINT` or `SIGTERM` and handles the serve goroutine's result.",
    "- Shutdown does not close or wait for hijacked connections, including many WebSocket implementations. Those need application-specific registration and cleanup, possibly through `Server.RegisterOnShutdown`. Background workers also need their own stop-and-wait protocol. If the drain deadline expires, the caller must decide whether to log and exit or force closure according to operational policy.",
    "- The sequence matters: start serving, detect a stop request, stop acceptance, drain, and wait for the serve goroutine's result. Returning from `main` too early terminates the process and defeats the drain. A graceful server is therefore a small lifecycle state machine, not merely a deferred `Close` call."
  ),
  overviewTitle: "Listener closure and bounded request draining",
  overview: "Shutdown separates new traffic from active traffic. Closing the listener makes the serve loop return, while the shutdown call waits for active ordinary connections; the process must remain alive until both sides are accounted for.",
  deepTitle: "Serve loop and shutdown coordination",
  deep: paragraphs(
    "**Serve loop.** `ListenAndServe` or `Serve` runs until the listener fails or is closed. Its result must reach the controlling goroutine, commonly through a buffered channel so a fast failure cannot leave a sender blocked.",
    "**Termination signal.** `signal.NotifyContext` turns selected signals into context cancellation and returns a stop function. Calling that stop function releases signal resources and restores later signal behavior. Tests can model the same lifecycle with a regular cancellable context rather than sending real process signals.",
    "**Active-request drain.** `Shutdown` immediately closes listeners and idle connections, then waits for active connections to return to idle. The deadline is a business and deployment decision: long enough for expected requests, finite enough for replacement or termination schedules.",
    "**Hijacked connections and background work.** Hijacked connections are no longer managed by the HTTP server's normal connection state. Background queues, telemetry flushes, and database resources also need explicit ownership. Shutdown callbacks can initiate protocol-specific cleanup, but the application must still know when that cleanup has finished.",
    "**Lifecycle failures.** A bind error may arrive before any signal. A shutdown timeout may arrive after traffic stops. Keep these errors distinct in logs and exit decisions. Most importantly, do not let `main` return while the drain goroutine is still working, because process exit does not wait for goroutines."
  ),
  visualType: "sequence_diagram",
  visualTitle: "Graceful shutdown sequence",
  visual: "```mermaid\nsequenceDiagram\n  participant Main\n  participant Server\n  participant Active as Active request\n  Main->>Server: ListenAndServe (goroutine)\n  Main->>Main: wait for SIGINT/SIGTERM\n  Main->>Server: Shutdown(deadline context)\n  Server-->>Main: serve returns ErrServerClosed\n  Server->>Server: close listeners and idle connections\n  Active-->>Server: request finishes / becomes idle\n  Server-->>Main: Shutdown returns\n  Main->>Main: exit after both results handled\n```",
  codeTitle: "Bounded graceful shutdown example",
  files: {
    "go.mod": moduleFile(),
    "main.go": go(
      "package main",
      "",
      "import (",
      "\t\"context\"",
      "\t\"errors\"",
      "\t\"log\"",
      "\t\"net/http\"",
      "\t\"os\"",
      "\t\"os/signal\"",
      "\t\"syscall\"",
      "\t\"time\"",
      ")",
      "",
      "func main() {",
      "\tmux := http.NewServeMux()",
      "\tmux.HandleFunc(\"GET /health\", func(w http.ResponseWriter, r *http.Request) { w.WriteHeader(http.StatusNoContent) })",
      "\tserver := &http.Server{Addr: \"127.0.0.1:8080\", Handler: mux, ReadHeaderTimeout: 3 * time.Second}",
      "\tserveErr := make(chan error, 1)",
      "\tgo func() { serveErr <- server.ListenAndServe() }()",
      "",
      "\tctx, stop := signal.NotifyContext(context.Background(), os.Interrupt, syscall.SIGTERM)",
      "\tdefer stop()",
      "\tselect {",
      "\tcase err := <-serveErr:",
      "\t\tif !errors.Is(err, http.ErrServerClosed) { log.Fatal(err) }",
      "\t\treturn",
      "\tcase <-ctx.Done():",
      "\t}",
      "\tdrain, cancel := context.WithTimeout(context.Background(), 5*time.Second)",
      "\tdefer cancel()",
      "\tif err := server.Shutdown(drain); err != nil { log.Printf(\"shutdown: %v\", err) }",
      "\tif err := <-serveErr; !errors.Is(err, http.ErrServerClosed) { log.Fatal(err) }",
      "}"
    ),
    "main_test.go": go(
      "package main",
      "",
      "import (",
      "\t\"context\"",
      "\t\"net/http\"",
      "\t\"testing\"",
      ")",
      "",
      "func TestUnusedServerCanShutDown(t *testing.T) {",
      "\tserver := &http.Server{Handler: http.NewServeMux()}",
      "\tif err := server.Shutdown(context.Background()); err != nil { t.Fatal(err) }",
      "}"
    ),
  },
  commands: ["go test -race ./...", "go vet ./...", "go run .  # stop with Ctrl+C"],
  checks: [["go", "test", "-race", "./..."], ["go", "vet", "./..."]],
  codeNote: "The automated check avoids opening a port. The executable demonstrates the production control flow and requires a manual signal.",
  followups: [
    "What changes make the serve method return during shutdown?",
    "Why should the shutdown context have a deadline?",
    "Which connections are not automatically waited for by `Shutdown`?",
  ],
});

add({
  topicSlug: "http-handlefunc",
  question: "What is the difference between `http.Handler` and `http.HandlerFunc`?",
  title: "The Handler interface and HandlerFunc adapter",
  direct: "`http.Handler` is the interface containing `ServeHTTP(http.ResponseWriter, *http.Request)`. `http.HandlerFunc` is a defined function type with a `ServeHTTP` method, so converting a matching function to `http.HandlerFunc` makes it satisfy `http.Handler`. Use a struct handler when behavior needs explicit dependencies or state and a function handler for small focused behavior.",
  quick: [
    "`http.Handler` requires one method: `ServeHTTP(w, r)`.",
    "`http.HandlerFunc` is a function type that implements that interface.",
    "A matching function can be converted with `http.HandlerFunc(fn)`.",
    "`HandleFunc` performs the function adaptation during registration.",
    "A struct implementing `ServeHTTP` can hold explicit dependencies.",
  ],
  speaking: paragraphs(
    "- `http.Handler` is the central server-side interface in Go HTTP. It contains one method: `ServeHTTP(http.ResponseWriter, *http.Request)`. Servers, routers, and middleware all speak this interface, so any type with that method can receive requests. The small interface is what allows a mux, middleware wrapper, or application object to be plugged into the same server.",
    "- `http.HandlerFunc` is an adapter. It is a defined function type whose signature matches a handler function. The conversion is explicit when an interface value is needed:\n\n```go\nfunc hello(w http.ResponseWriter, r *http.Request) {}\nvar handler http.Handler = http.HandlerFunc(hello)\n```\n\nIts `ServeHTTP` method calls the underlying function. `ServeMux.HandleFunc` hides that adaptation during registration.",
    "- For example, `Greeter` can be a struct with a `Prefix` field and a `ServeHTTP` method. It satisfies `http.Handler` and carries its dependency explicitly. A small health endpoint can remain a plain function converted to `HandlerFunc`. Both can be wrapped by the same middleware because the wrapper accepts and returns the interface.",
    "- The choice is about design, not performance folklore. A function is clear when behavior is local and dependencies can be closed over safely. A struct is useful when several methods share immutable services or carefully synchronized state. Capturing a mutable variable in a closure has the same concurrency risks as placing it on a struct.",
    "- I keep the interface at composition boundaries and choose the simplest implementation that makes dependencies visible. This preserves easy testing: create the handler value, send an `httptest` request, and observe its response. The adapter is the bridge that lets ordinary Go functions participate in the interface-based HTTP pipeline."
  ),
  overviewTitle: "One interface, two convenient implementation forms",
  overview: "The server only needs `ServeHTTP`. A method-bearing application type supplies it directly, while `HandlerFunc` supplies it for a function, letting routing and middleware treat both identically.",
  deepTitle: "The Handler interface and HandlerFunc adapter",
  deep: paragraphs(
    "**The interface.** `Handler` represents behavior, not a route. Its `ServeHTTP` method may be implemented by a router that dispatches again, a middleware value that performs work and calls another handler, or a final endpoint that writes the response.",
    "**The adapter.** A raw function value does not have methods, so it does not satisfy `Handler` on its own. The conversion to `http.HandlerFunc` gives the value the standard library's `ServeHTTP` method. That method simply calls the original function with the writer and request.",
    "**The registration helpers.** `mux.Handle` accepts an `http.Handler`; `mux.HandleFunc` accepts a matching function. They provide the same routing capability. Choose according to the value already available rather than wrapping and unwrapping unnecessarily.",
    "**Dependency ownership.** A struct handler can store a database interface, logger, configuration, or service. Those fields should normally be established during construction. A closure can capture the same dependencies compactly, but captured state must still have a clear lifetime and concurrency policy.",
    "**Composition.** Middleware normally has the shape `func(http.Handler) http.Handler`. Because both structs and HandlerFunc values implement the interface, middleware remains independent from how the final endpoint was written. This is the practical value of the adapter: small functions and larger application objects share one pipeline."
  ),
  visualType: "flow_diagram",
  visualTitle: "Two values satisfy the same server contract",
  visual: "```mermaid\nflowchart LR\n  F[func w, r] -->|convert| HF[http.HandlerFunc]\n  S[Greeter struct] -->|ServeHTTP method| H[http.Handler]\n  HF --> H\n  H --> M[Middleware / ServeMux / Server]\n```",
  codeTitle: "Struct handler and function adapter",
  files: {
    "go.mod": moduleFile(),
    "handler.go": go(
      "package lesson",
      "",
      "import (",
      "\t\"fmt\"",
      "\t\"net/http\"",
      ")",
      "",
      "type Greeter struct { Prefix string }",
      "",
      "func (g Greeter) ServeHTTP(w http.ResponseWriter, r *http.Request) {",
      "\tfmt.Fprint(w, g.Prefix+\" world\")",
      "}",
      "",
      "func health(w http.ResponseWriter, r *http.Request) {",
      "\tw.WriteHeader(http.StatusNoContent)",
      "}"
    ),
    "handler_test.go": go(
      "package lesson",
      "",
      "import (",
      "\t\"net/http\"",
      "\t\"net/http/httptest\"",
      "\t\"testing\"",
      ")",
      "",
      "func TestHandlerForms(t *testing.T) {",
      "\trequest := httptest.NewRequest(http.MethodGet, \"/\", nil)",
      "\tgreeterResponse := httptest.NewRecorder()",
      "\tvar greeter http.Handler = Greeter{Prefix: \"hello\"}",
      "\tgreeter.ServeHTTP(greeterResponse, request)",
      "\tif greeterResponse.Body.String() != \"hello world\" {",
      "\t\tt.Fatal(greeterResponse.Body.String())",
      "\t}",
      "\thealthResponse := httptest.NewRecorder()",
      "\thttp.HandlerFunc(health).ServeHTTP(healthResponse, request)",
      "\tif healthResponse.Code != http.StatusNoContent {",
      "\t\tt.Fatal(healthResponse.Code)",
      "\t}",
      "}"
    ),
  },
  commands: ["go test -race ./...", "go vet ./..."],
  codeNote: "The compiler accepts both values as `http.Handler`, so the caller uses the same `ServeHTTP` operation for either implementation.",
  followups: [
    "Why does a raw function need conversion before satisfying `http.Handler`?",
    "When is a struct handler clearer than a closure?",
    "Which ServeMux method accepts an already constructed handler?",
  ],
});

add({
  topicSlug: "http-handlefunc",
  question: "Are Go HTTP handlers called concurrently, and how should they protect shared state?",
  title: "Writing handlers that are safe under concurrent requests",
  direct: "HTTP handlers must assume that multiple calls can run concurrently. Request-local variables need no shared lock, but mutable package variables, maps, caches, counters, or handler fields shared across requests require synchronization or single-owner coordination. Prefer immutable dependencies; use a mutex, atomic operation, channel-owned state, or concurrency-safe service for real shared mutation.",
  quick: [
    "Treat every handler as callable concurrently.",
    "Local variables and one request's values are request-scoped.",
    "Ordinary maps and unsynchronised shared fields are not safe for concurrent writes.",
    "Use immutability, a mutex, atomics, or an owning service for shared state.",
    "Run representative tests with `go test -race`, but do not treat one clean run as proof.",
  ],
  speaking: paragraphs(
    "- A Go HTTP handler is not called through one global serial loop. A running server can execute handlers for different connections and requests at the same time, so handler code must be safe for overlapping calls. Values created inside one call, including local variables and data reachable only from that request, are naturally isolated unless they are deliberately shared.",
    "- Shared mutable state is the boundary. A package-level map, a counter captured by a closure, or a field on one handler value can be accessed by many requests. Concurrent reads and writes to an ordinary map can race and may panic. A plain `count++` is also a read-modify-write sequence, not an atomic request counter.",
    "- For example, a handler can keep a small independent counter in an atomic value:\n\n```go\ntype counter struct{ total atomic.Int64 }\nfunc (h *counter) ServeHTTP(w http.ResponseWriter, r *http.Request) {\n    fmt.Fprint(w, h.total.Add(1))\n}\n```\n\nA concurrent test can verify the total and run with `go test -race` to inspect the exercised memory accesses.",
    "- Atomics fit small independent counters. A mutex is clearer for a group of fields or a map invariant. Databases and caches often provide their own concurrency contracts. Another design is to send updates to one owner goroutine, but that adds lifecycle and back-pressure decisions. Locks should protect state, not surround slow network calls without a reason.",
    "- I prefer immutable configuration and explicit services, then synchronize only the state that truly must be shared. The race detector observes executed paths, so a clean run is not a mathematical proof. Code review must still identify all shared ownership and confirm that every access follows the same policy."
  ),
  overviewTitle: "Request-local by default, shared only by explicit ownership",
  overview: "Concurrency becomes manageable when each value has an owner. One request owns its parsed input and response construction; the application owns shared counters, caches, and services and must define how overlapping calls use them.",
  deepTitle: "Request-local and shared-state ownership",
  deep: paragraphs(
    "**Concurrent handler calls.** A server can run several handler calls at the same time. Variables created inside one call are normally isolated, but they can still point to shared objects. The ownership of the referenced object matters more than where the pointer variable was declared.",
    "**Read-only state.** Configuration built before the server starts and never mutated can be shared freely. Immutable dependency structs and interfaces are often the simplest handler design because concurrency safety follows from the dependency's contract rather than locks scattered through endpoints.",
    "**Simple mutation.** Atomic types work for independent numbers or flags. They do not preserve a multi-field invariant. A mutex can protect a map or several related values, but every read and write to that state must use the same lock discipline.",
    "**External services.** A database connection pool is designed for concurrent calls; a transaction is usually request-scoped. Check each client's documentation instead of adding a lock around an already safe pool or sharing a request-specific object across calls.",
    "**Verification.** Concurrent tests should generate real overlap and assert a deterministic final state. `go test -race` reports races it observes in that execution. Repeatable stress and design review complement it, while merely adding sleeps can make a test slower without guaranteeing the important interleaving."
  ),
  visualType: "comparison_table",
  visualTitle: "State ownership and coordination",
  visual: "| State | Typical scope | Coordination |\n|---|---|---|\n| Parsed request value | One handler call | None when not shared |\n| Immutable configuration | Application-wide | Construct once, read only |\n| Counter or flag | Application-wide | Atomic operation |\n| Map or multi-field invariant | Application-wide | Mutex or single owner |\n| Database transaction | Usually one request | Do not share across requests |",
  codeTitle: "Atomic request counter",
  files: {
    "go.mod": moduleFile(),
    "counter.go": go(
      "package lesson",
      "",
      "import (",
      "\t\"fmt\"",
      "\t\"net/http\"",
      "\t\"sync/atomic\"",
      ")",
      "",
      "type CounterHandler struct { total atomic.Int64 }",
      "",
      "func (h *CounterHandler) ServeHTTP(w http.ResponseWriter, r *http.Request) {",
      "\tfmt.Fprint(w, h.total.Add(1))",
      "}",
      "",
      "func (h *CounterHandler) Total() int64 { return h.total.Load() }"
    ),
    "counter_test.go": go(
      "package lesson",
      "",
      "import (",
      "\t\"net/http\"",
      "\t\"net/http/httptest\"",
      "\t\"sync\"",
      "\t\"testing\"",
      ")",
      "",
      "func TestConcurrentRequests(t *testing.T) {",
      "\thandler := &CounterHandler{}",
      "\tconst requests = 40",
      "\tvar group sync.WaitGroup",
      "\tfor range requests {",
      "\t\tgroup.Add(1)",
      "\t\tgo func() {",
      "\t\t\tdefer group.Done()",
      "\t\t\thandler.ServeHTTP(httptest.NewRecorder(), httptest.NewRequest(http.MethodGet, \"/\", nil))",
      "\t\t}()",
      "\t}",
      "\tgroup.Wait()",
      "\tif handler.Total() != requests {",
      "\t\tt.Fatalf(\"total=%d; want %d\", handler.Total(), requests)",
      "\t}",
      "}"
    ),
  },
  commands: ["go test -race ./...", "go vet ./..."],
  codeNote: "The shared counter has one explicit atomic policy. Each recorder and request remains local to one goroutine.",
  followups: [
    "Why is a closure-captured map still shared state?",
    "When is a mutex more suitable than an atomic counter?",
    "What can a clean race-detector run not prove?",
  ],
});

add({
  topicSlug: "request-parsing",
  question: "How do you read path, query, and header values from a Go HTTP request?",
  title: "Reading values from the right request channel",
  direct: "Read a Go request according to the endpoint contract: `r.PathValue` for a wildcard matched by `ServeMux`, `r.URL.Query()` for query parameters, and `r.Header.Get` for headers. These APIs return strings, so parse and validate required values explicitly. Do not treat path, query, and headers as interchangeable merely because each can carry text.",
  quick: [
    "Use `r.PathValue(\"name\")` for a matched ServeMux wildcard.",
    "Use `r.URL.Query().Get(\"name\")` for one query value.",
    "Use `r.Header.Get(\"Name\")` for a header value.",
    "Parse strings into the required type and check conversion errors.",
    "Validate required, optional, allowed-range, and repeated-value rules explicitly.",
  ],
  speaking: paragraphs(
    "- An HTTP request has several input channels, and their meaning comes from the API contract. A path value normally identifies the resource being addressed, a query value modifies filtering or presentation, and a header carries request metadata such as a media type or request identifier. Keeping those roles distinct makes routes predictable and documentation easier to follow.",
    "- With a Go 1.22-style `ServeMux` pattern such as `GET /users/{id}`, the mux stores the matched wildcard on the request and the handler reads it with `r.PathValue(\"id\")`. Query values come from `r.URL.Query()`, whose map can represent repeated keys. Headers use `r.Header`; `Header.Get` returns the first value for a case-insensitive header name.",
    "- The three values come from separate APIs:\n\n```go\nidText := r.PathValue(\"id\")\nverboseText := r.URL.Query().Get(\"verbose\")\nrequestID := r.Header.Get(\"X-Request-ID\")\n```\n\nFor `/users/42?verbose=true`, the handler parses the first two strings into a positive integer and a boolean. The request ID remains tracing metadata.",
    "- These accessors do not perform business validation. `Query().Get` cannot distinguish a missing key from a present empty first value without checking the map. `PathValue` is populated by mux matching, so a direct handler call may not contain it unless the test uses `SetPathValue`. Untrusted headers should not be accepted as identity unless a trusted proxy or authentication layer establishes that contract.",
    "- I parse at the boundary into a small typed input and return a specific 400 response when conversion or validation fails. The endpoint then works with `int`, `bool`, and domain values rather than repeatedly reading raw strings. The important answer is not only which method to call, but why each value belongs in that part of the request."
  ),
  overviewTitle: "Location expresses meaning before parsing begins",
  overview: "The same text can appear in a route, query, or header, but each location describes a different contract. First select the correct channel, then convert its string representation into a typed application value.",
  deepTitle: "Path, query, and header parsing",
  deep: paragraphs(
    "**Path values.** A wildcard such as `{id}` is part of route matching. `PathValue` returns the matched text after the request travels through the mux. It is appropriate for a required resource identity, but the handler must still reject values that do not meet its numeric, format, or domain rules.",
    "**Query values.** `URL.Query` returns `url.Values`, a map from keys to slices. `Get` is convenient when one value is allowed. Inspect the slice directly when repetition matters, and check map membership when empty and absent have different meanings. Define defaults rather than letting zero values silently choose policy.",
    "**Headers.** Headers describe the request or representation. Go canonicalises common header names, and `Header.Get` performs case-insensitive lookup. Some headers may legally appear more than once; authentication and proxy-derived headers require an explicit trust boundary.",
    "**Conversion.** HTTP delivers text, but application code should not. Use `strconv` or a dedicated parser, check every error, then apply range and allowed-value rules. Parsing `-3` as an integer succeeds even when negative identifiers are invalid, so conversion and validation are separate steps.",
    "**Testing.** Exercise the registered mux for path behavior and include missing, malformed, repeated, and boundary values. The successful test should also show that each channel remains independent; this catches accidental reads from a similarly named query key instead of the route wildcard."
  ),
  visualType: "comparison_table",
  visualTitle: "Request inputs and Go APIs",
  visual: "| Input | Typical meaning | Go API | Extra work |\n|---|---|---|---|\n| Path wildcard | Resource identity | `r.PathValue` | Parse and validate |\n| Query parameter | Filter or option | `r.URL.Query()` | Handle defaults/repetition |\n| Header | Request metadata | `r.Header` | Establish trust and format |",
  codeTitle: "Typed path, query, and header example",
  files: {
    "go.mod": moduleFile(),
    "request.go": go(
      "package lesson",
      "",
      "import (",
      "\t\"fmt\"",
      "\t\"net/http\"",
      "\t\"strconv\"",
      ")",
      "",
      "func NewHandler() http.Handler {",
      "\tmux := http.NewServeMux()",
      "\tmux.HandleFunc(\"GET /users/{id}\", func(w http.ResponseWriter, r *http.Request) {",
      "\t\tid, err := strconv.Atoi(r.PathValue(\"id\"))",
      "\t\tif err != nil || id < 1 { http.Error(w, \"invalid user id\", http.StatusBadRequest); return }",
      "\t\tverbose := false",
      "\t\tif text := r.URL.Query().Get(\"verbose\"); text != \"\" {",
      "\t\t\tparsed, err := strconv.ParseBool(text)",
      "\t\t\tif err != nil { http.Error(w, \"invalid verbose value\", http.StatusBadRequest); return }",
      "\t\t\tverbose = parsed",
      "\t\t}",
      "\t\tfmt.Fprintf(w, \"id=%d verbose=%t request=%s\", id, verbose, r.Header.Get(\"X-Request-ID\"))",
      "\t})",
      "\treturn mux",
      "}"
    ),
    "request_test.go": go(
      "package lesson",
      "",
      "import (",
      "\t\"net/http\"",
      "\t\"net/http/httptest\"",
      "\t\"testing\"",
      ")",
      "",
      "func TestRequestInputs(t *testing.T) {",
      "\trequest := httptest.NewRequest(http.MethodGet, \"/users/42?verbose=true\", nil)",
      "\trequest.Header.Set(\"X-Request-ID\", \"abc\")",
      "\trecorder := httptest.NewRecorder()",
      "\tNewHandler().ServeHTTP(recorder, request)",
      "\tif got := recorder.Body.String(); got != \"id=42 verbose=true request=abc\" { t.Fatal(got) }",
      "}"
    ),
  },
  commands: ["go test -race ./...", "go vet ./..."],
  checks: [["go", "test", "-race", "./..."], ["go", "vet", "./..."]],
  codeNote: "The test enters through the mux, so `{id}` is matched and populated before the handler reads it.",
  followups: [
    "How do you distinguish a missing query key from a present empty value?",
    "Why can `Atoi` success still require domain validation?",
    "When would a request header be an unsafe source of identity?",
  ],
});

add({
  topicSlug: "writing-json-responses",
  question: "In what order should a Go handler set JSON headers, status, and body?",
  title: "Writing JSON headers, status, and body in the right order",
  direct: "Set `Content-Type: application/json` before committing the response, choose the status with `WriteHeader`, and encode the JSON body once. If `WriteHeader` is omitted, the first `Write` or encoder write commits status 200. For responses whose value might fail to encode, marshal before commitment so the handler can still return a deliberate error.",
  quick: [
    "Set JSON content type before `WriteHeader` or the first body write.",
    "Call `WriteHeader` once when the status is not 200.",
    "The first body write implicitly commits 200 when no status was set.",
    "`json.Encoder.Encode` writes JSON directly and adds a newline.",
    "Marshal before committing when encoding can fail and status must remain controllable.",
  ],
  speaking: paragraphs(
    "- A JSON response has three ordered parts: headers, status, and body. The handler first sets `Content-Type` to `application/json`, then calls `WriteHeader` if the result is not 200, and finally writes exactly one encoded representation. Once the response is committed, later header changes or status calls cannot rewrite what the client already received.",
    "- `json.NewEncoder(w).Encode(value)` is convenient because it writes directly to the response and appends a newline. If the handler never calls `WriteHeader`, the encoder's first write commits status 200. For a create operation, the handler must therefore call `WriteHeader(http.StatusCreated)` before encoding if it wants 201.",
    "- The ordering is small but important:\n\n```go\nw.Header().Set(\"Content-Type\", \"application/json\")\nw.WriteHeader(http.StatusCreated)\nif err := json.NewEncoder(w).Encode(result); err != nil {\n    log.Printf(\"write response: %v\", err)\n}\n```\n\nTests should check status, media type, and decoded body rather than depend on the encoder's trailing newline.",
    "- Direct encoding has an error boundary: an unsupported value, such as a channel or function, can fail after headers or part of a response are committed. For a small API object that could fail, `json.Marshal` into bytes first, handle its error, then commit and write. For known encodable structs, a direct encoder is usually clear and avoids an extra full output buffer.",
    "- I centralise the ordering in a small helper, keep response structs narrow, and return after invoking it. The helper still needs an error policy because `ResponseWriter.Write` can fail when a client disconnects. Correct JSON is not only valid bytes; it is a consistent media type, status, schema, and single commitment."
  ),
  overviewTitle: "Response metadata and commitment boundary",
  overview: "Headers remain editable until the first status or body write. Preparing the media type and intended status first prevents a valid JSON body from being paired with the wrong status or default content type.",
  deepTitle: "JSON response commitment",
  deep: paragraphs(
    "**Headers.** `w.Header()` returns the map that will be sent with the response. Set content type and any cache or location metadata before commitment. Changing the map later may affect trailers in specific cases, but it does not replace ordinary headers already sent.",
    "**Status.** `WriteHeader(code)` commits the headers and status. It is needed only for a non-200 status because the first `Write` supplies an implicit `StatusOK`. Multiple calls do not create several responses; the first committed status wins.",
    "**Body.** Encoder writes are streaming writes and include a final newline. Marshal returns a complete byte slice without that newline. Clients should parse the JSON representation rather than rely on whitespace produced by one server implementation.",
    "**Encoding errors.** Ordinary structs of supported fields are predictable, but custom marshalers and unsupported values can fail. Marshal-first allows a clean 500 before any bytes leave. Direct encoding can use less buffering, which matters for larger values, but the handler must accept that a late error cannot change an already committed response.",
    "**Verification.** Decode the recorded body into the promised response shape and assert the status and media type separately. This validates the HTTP contract while avoiding brittle key-order or whitespace tests. A production helper should return or log write failures without attempting a second JSON error on the same response."
  ),
  visualType: "flow_diagram",
  visualTitle: "The JSON response commit boundary",
  visual: "```mermaid\nflowchart LR\n  A[Build response value] --> B[Set Content-Type]\n  B --> C{Need non-200 status?}\n  C -->|Yes| D[WriteHeader once]\n  C -->|No| E[First Encode/Write commits 200]\n  D --> F[Encode one JSON body]\n  E --> G[Response committed]\n  F --> G\n  G --> H[Headers/status cannot be replaced]\n```",
  codeTitle: "Typed JSON response example",
  files: {
    "go.mod": moduleFile(),
    "response.go": go(
      "package lesson",
      "",
      "import (",
      "\t\"encoding/json\"",
      "\t\"log\"",
      "\t\"net/http\"",
      ")",
      "",
      "type userResponse struct { ID int `json:\"id\"`; Name string `json:\"name\"` }",
      "",
      "func User(w http.ResponseWriter, r *http.Request) {",
      "\tw.Header().Set(\"Content-Type\", \"application/json\")",
      "\tw.WriteHeader(http.StatusOK)",
      "\tif err := json.NewEncoder(w).Encode(userResponse{ID: 7, Name: \"Ada\"}); err != nil {",
      "\t\tlog.Printf(\"write user response: %v\", err)",
      "\t}",
      "}"
    ),
    "response_test.go": go(
      "package lesson",
      "",
      "import (",
      "\t\"encoding/json\"",
      "\t\"net/http\"",
      "\t\"net/http/httptest\"",
      "\t\"testing\"",
      ")",
      "",
      "func TestUserResponse(t *testing.T) {",
      "\trecorder := httptest.NewRecorder()",
      "\tUser(recorder, httptest.NewRequest(http.MethodGet, \"/users/7\", nil))",
      "\tresponse := recorder.Result()",
      "\tdefer response.Body.Close()",
      "\tif response.StatusCode != 200 || response.Header.Get(\"Content-Type\") != \"application/json\" { t.Fatalf(\"status=%d headers=%v\", response.StatusCode, response.Header) }",
      "\tvar body userResponse",
      "\tif err := json.NewDecoder(response.Body).Decode(&body); err != nil || body.ID != 7 { t.Fatalf(\"body=%+v err=%v\", body, err) }",
      "}"
    ),
  },
  commands: ["go test -race ./...", "go vet ./..."],
  checks: [["go", "test", "-race", "./..."], ["go", "vet", "./..."]],
  codeNote: "The test decodes JSON rather than depending on whitespace, while checking the media type and status as separate parts of the contract.",
  followups: [
    "What status is committed when `Encode` writes before `WriteHeader`?",
    "Why might a handler marshal a small response before writing headers?",
    "What formatting difference does `Encoder.Encode` add?",
  ],
});

add({
  topicSlug: "middleware-basics",
  question: "What is HTTP middleware in Go, and how do you write it?",
  title: "Wrapping handlers with Go HTTP middleware",
  direct: "HTTP middleware wraps an `http.Handler` and returns another handler. The wrapper can run common work before the next handler, call `next.ServeHTTP`, and optionally run work afterward. Use it for cross-cutting request behavior such as logging, authentication, recovery, or headers—not for endpoint-specific business rules.",
  quick: [
    "The common shape is `func(next http.Handler) http.Handler`.",
    "The wrapper is itself an `http.Handler`.",
    "Code before `next.ServeHTTP` runs on the way in.",
    "Code after it returns runs on the way out.",
    "A middleware may stop the chain by writing a response and returning.",
  ],
  speaking: paragraphs(
    "- Middleware is a handler wrapper for behavior shared by many routes. It accepts the next `http.Handler` and returns a new handler. Because the result still satisfies the same interface, several wrappers can be composed and the server does not need to know which layers exist.",
    "- Work placed before `next.ServeHTTP(w, r)` runs before the selected endpoint. Work after that call runs after the endpoint returns. A request logger can record the start time, call next, then record elapsed time. An authentication middleware can reject a request, write 401, and return without calling next.",
    "- A minimal wrapper looks like this:\n\n```go\nfunc addHeader(next http.Handler) http.Handler {\n    return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {\n        w.Header().Set(\"X-App\", \"catalog\")\n        next.ServeHTTP(w, r)\n    })\n}\n```\n\nThe header is set before the endpoint can commit the response.",
    "- Middleware is best for request-wide concerns: authentication, request IDs, tracing, panic recovery, compression, and logging. A rule such as “an order may be cancelled only before shipment” belongs in the application use case, even when many endpoints call that use case. Mixing domain policy into transport wrappers makes non-HTTP callers behave differently.",
    "- I keep wrappers small, state whether they may stop the chain, and test both accepted and rejected paths. If a middleware wraps `ResponseWriter` to observe status or bytes, it must preserve optional interfaces needed by streaming or connection upgrades. The simple contract is powerful because each layer remains an ordinary handler with one visible responsibility. It also lets the same endpoint run with or without that layer in a focused test."
  ),
  overviewTitle: "One handler surrounds another handler",
  overview: "Middleware works because routers, endpoints, and wrappers all use `http.Handler`. A layer may enrich the request, prepare response headers, stop a rejected request, or delegate to the next layer.",
  deepTitle: "The middleware contract",
  deep: paragraphs(
    "**Wrapper shape.** A middleware function usually receives one handler and returns `http.HandlerFunc`. The returned closure captures `next`. Construction happens while the application builds its handler graph; the closure runs later for every matching request.",
    "**Request-side middleware.** Authentication checks, request-context enrichment, and response-header setup happen before delegation. If a check fails, the middleware writes one response and returns. Calling next after rejection would allow protected work and could append another body.",
    "**Handler delegation.** `next.ServeHTTP(w, r)` is an ordinary synchronous call. The next handler may be another middleware, a mux, or the final endpoint. It normally receives the same writer and either the same request or a copy created with a new context.",
    "**Response-side middleware.** Duration logging and cleanup can run when next returns. At this point the response is often committed, so after-work cannot safely change its status. A deferred function is useful for cleanup or panic observation when its behavior is understood.",
    "**Boundaries.** Wrapping `ResponseWriter` is more advanced than wrapping a handler. The concrete writer may also implement `http.Flusher`, `http.Hijacker`, or other optional interfaces. A wrapper that hides them can break streaming or upgrades, so observation code should preserve the capabilities it promises."
  ),
  visualType: "flow_diagram",
  visualTitle: "Before, next, and after",
  visual: "```mermaid\nflowchart LR\n  A[Request] --> B[Middleware: before work]\n  B --> C{Continue?}\n  C -->|No| D[Write rejection and return]\n  C -->|Yes| E[next.ServeHTTP]\n  E --> F[Endpoint response]\n  F --> G[Middleware: after work]\n  G --> H[Client]\n```",
  codeTitle: "Response header middleware example",
  files: {
    "go.mod": moduleFile(),
    "middleware.go": go(
      "package lesson",
      "",
      "import \"net/http\"",
      "",
      "func AddHeader(next http.Handler) http.Handler {",
      "\treturn http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {",
      "\t\tw.Header().Set(\"X-App\", \"catalog\")",
      "\t\tnext.ServeHTTP(w, r)",
      "\t})",
      "}"
    ),
    "middleware_test.go": go(
      "package lesson",
      "",
      "import (",
      "\t\"net/http\"",
      "\t\"net/http/httptest\"",
      "\t\"testing\"",
      ")",
      "",
      "func TestAddHeader(t *testing.T) {",
      "\tendpoint := http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) { w.WriteHeader(http.StatusNoContent) })",
      "\trecorder := httptest.NewRecorder()",
      "\tAddHeader(endpoint).ServeHTTP(recorder, httptest.NewRequest(http.MethodGet, \"/\", nil))",
      "\tif recorder.Code != 204 || recorder.Header().Get(\"X-App\") != \"catalog\" { t.Fatalf(\"status=%d headers=%v\", recorder.Code, recorder.Header()) }",
      "}"
    ),
  },
  commands: ["go test -race ./...", "go vet ./..."],
  checks: [["go", "test", "-race", "./..."], ["go", "vet", "./..."]],
  codeNote: "The wrapper sets the header before delegation; the endpoint can then commit the response normally.",
  followups: [
    "What happens when middleware writes an error but still calls next?",
    "Why does code after `next.ServeHTTP` run in reverse wrapper order?",
    "Which optional ResponseWriter capabilities can a custom wrapper hide?",
  ],
});

add({
  topicSlug: "http-router-basics",
  question: "How do method and wildcard patterns work in Go 1.22+ `http.ServeMux`?",
  title: "Routing by HTTP method and path wildcard",
  direct: "A modern `ServeMux` pattern can include an optional method and path wildcards, such as `GET /posts/{id}`. `{id}` matches one path segment and its value is read with `r.PathValue(\"id\")`; `{rest...}` matches the remaining suffix. A `GET` pattern also matches `HEAD`, while a method mismatch can produce 405 with an `Allow` header.",
  quick: [
    "Use patterns such as `GET /posts/{id}` for method and path matching.",
    "`{name}` matches one segment; `{name...}` matches a remaining suffix.",
    "Read the matched text with `r.PathValue(\"name\")`.",
    "A `GET` pattern also matches `HEAD` requests.",
    "A known path with the wrong method can produce 405 and `Allow`.",
    "`{$}` matches only the end of the URL path.",
  ],
  speaking: paragraphs(
    "- Since Go 1.22, `http.ServeMux` patterns can describe both an HTTP method and a path. `GET /posts/{id}` means a GET request whose path has one segment after `/posts/`. The mux performs the match before the handler runs and stores the wildcard text so the handler can call `r.PathValue(\"id\")`.",
    "- Registration and reading look like this:\n\n```go\nmux.HandleFunc(\"GET /posts/{id}\", func(w http.ResponseWriter, r *http.Request) {\n    fmt.Fprint(w, r.PathValue(\"id\"))\n})\n```\n\n`{id}` matches one non-empty segment. A wildcard ending in `...`, such as `{rest...}`, matches the remaining path. A pattern ending in `{$}` matches the exact path ending instead of a whole subtree.",
    "- For example, `/posts/42` matches the first pattern and produces `42`. `/posts/42/comments` does not match because `{id}` covers only one segment. A GET pattern also matches HEAD, with the server suppressing the response body as required. A POST to a path known only for GET can receive 405 and an `Allow` header.",
    "- A pattern without a method matches every method, so it can accidentally make a more specific method policy less clear. Wildcard text is still untrusted input and needs parsing and validation. Encoded paths and trailing slashes also deserve route tests rather than assumptions based on browser display.",
    "- I use method-qualified patterns for endpoint contracts, short meaningful wildcard names, and route-level tests through the mux. The router decides whether the request belongs to the endpoint; the handler then decides whether the matched value is valid for the application."
  ),
  overviewTitle: "The mux matches structure before the handler validates meaning",
  overview: "Method, literal segments, wildcard shape, and path ending form the route contract. The handler receives only a matched request, then parses wildcard text into the required domain value.",
  deepTitle: "ServeMux pattern parts",
  deep: paragraphs(
    "**Method.** A pattern may begin with a method followed by a space. Method names are case-sensitive. `GET` has the special behavior of matching both GET and HEAD, while other method patterns match only that exact method.",
    "**Single wildcard.** `{id}` matches one non-empty path segment. Wildcard names must be valid identifiers and cannot repeat in one pattern. The handler retrieves the decoded matched value by name with `PathValue`.",
    "**Remainder wildcard.** `{rest...}` may appear only at the end and matches the remaining path. A path ending with `/` acts like an anonymous remainder wildcard. Use `{$}` when only the exact ending path should match.",
    "**Method mismatch.** When the path matches registered method-specific routes but the request method does not, the mux can return 405 Method Not Allowed and list permitted methods. When no route matches the path, the result is 404.",
    "**Version boundary.** Older Go versions do not have these enhanced pattern semantics. A module that depends on them must declare and build with a suitable Go version. Tests should go through `ServeMux`, because direct handler calls skip matching, automatic method handling, redirects, and wildcard population."
  ),
  visualType: "comparison_table",
  visualTitle: "Common ServeMux path forms",
  visual: "| Pattern | Matches | Does not match |\n|---|---|---|\n| `GET /posts/{id}` | `GET /posts/42`, `HEAD /posts/42` | `GET /posts/42/comments` |\n| `/assets/{rest...}` | `/assets/css/app.css` | `/other/app.css` |\n| `/health/{$}` | `/health/` exactly | `/health/live` |",
  codeTitle: "Method and path route test",
  files: {
    "go.mod": moduleFile(),
    "routes.go": go(
      "package lesson",
      "",
      "import (",
      "\t\"fmt\"",
      "\t\"net/http\"",
      ")",
      "",
      "func Routes() http.Handler {",
      "\tmux := http.NewServeMux()",
      "\tmux.HandleFunc(\"GET /posts/{id}\", func(w http.ResponseWriter, r *http.Request) { fmt.Fprint(w, r.PathValue(\"id\")) })",
      "\treturn mux",
      "}"
    ),
    "routes_test.go": go(
      "package lesson",
      "",
      "import (",
      "\t\"net/http/httptest\"",
      "\t\"testing\"",
      ")",
      "",
      "func TestRouteContract(t *testing.T) {",
      "\tfor _, test := range []struct{ method, path string; status int }{{\"GET\", \"/posts/42\", 200}, {\"POST\", \"/posts/42\", 405}, {\"GET\", \"/posts/42/comments\", 404}} {",
      "\t\trecorder := httptest.NewRecorder()",
      "\t\tRoutes().ServeHTTP(recorder, httptest.NewRequest(test.method, test.path, nil))",
      "\t\tif recorder.Code != test.status { t.Fatalf(\"%s %s: %d\", test.method, test.path, recorder.Code) }",
      "\t}",
      "}"
    ),
  },
  commands: ["go test -race ./...", "go vet ./..."],
  checks: [["go", "test", "-race", "./..."], ["go", "vet", "./..."]],
  codeNote: "The table test proves 200, 405, and 404 as routing outcomes rather than calling the endpoint function directly.",
  followups: [
    "How is `{name...}` different from `{name}`?",
    "Why does a GET pattern also match HEAD?",
    "When does ServeMux return 405 instead of 404?",
  ],
});

add({
  topicSlug: "introduction-to-gin",
  question: "How do you create a JSON route with Gin, and how do `gin.New` and `gin.Default` differ?",
  title: "Creating a small Gin JSON route",
  direct: "Create a Gin engine, register a method route such as `router.GET`, and write JSON with `c.JSON(status, value)`. `gin.New()` creates an engine without middleware, while `gin.Default()` adds Gin's Logger and Recovery middleware. The engine implements `http.Handler`, so it works with `httptest` and `http.Server` like other Go handlers.",
  quick: [
    "A Gin engine is an HTTP handler and router.",
    "Register routes with method helpers such as `GET` and `POST`.",
    "Use `c.Param`, `c.Query`, and `c.JSON` for common endpoint work.",
    "`gin.New()` starts without middleware.",
    "`gin.Default()` includes Logger and Recovery middleware.",
    "Use `httptest` against the engine for route tests.",
  ],
  speaking: paragraphs(
    "- Gin is an HTTP web framework built around a router, middleware chain, and request context. A `*gin.Engine` implements `http.Handler`, so the standard library can serve it and `httptest` can test it. Gin adds concise routing, binding, validation integration, and response helpers; it does not replace HTTP status, header, or lifecycle rules.",
    "- A small route looks like this:\n\n```go\nr := gin.New()\nr.GET(\"/users/:id\", func(c *gin.Context) {\n    c.JSON(http.StatusOK, gin.H{\"id\": c.Param(\"id\")})\n})\n```\n\nThe `:id` segment becomes a path parameter, and `c.JSON` sets a JSON content type, status, and encoded body.",
    "- `gin.New()` creates a blank engine. The application chooses every middleware explicitly. `gin.Default()` creates an engine with Gin's Logger and Recovery middleware already attached. Default is convenient for a quick service, while New is clearer when an application has its own structured logger, recovery policy, or exact middleware order.",
    "- For example, a test sends `GET /users/42` to the engine and decodes the body. It proves both routing and parameter extraction without opening a port. Production code can place the same engine in an explicit `http.Server` to configure timeouts and graceful shutdown rather than relying only on `Run` convenience methods.",
    "- I choose Gin for its developer experience when the team benefits from its routing and middleware ecosystem, not because a simple standard-library handler is impossible. The boundary stays familiar: the engine is a handler, the request is still HTTP, and status codes and response contracts should be tested independently of framework syntax."
  ),
  overviewTitle: "Gin adds endpoint helpers around the standard handler boundary",
  overview: "The engine owns route matching and Gin middleware, then presents one `ServeHTTP` method to the standard server. This allows standard lifecycle configuration and standard recorder-based tests.",
  deepTitle: "Gin engine, route, context, and server boundary",
  deep: paragraphs(
    "**Engine.** A Gin engine is both a router and an `http.Handler`. `gin.New` returns an engine with no attached middleware. `gin.Default` calls New and adds Logger and Recovery. Selecting one changes the starting middleware policy, not whether route registration works.",
    "**Route.** Method helpers register a path pattern and one or more handlers. `:id` captures one segment, while Gin also supports catch-all parameters. Static and parameter routes should be tested for the same ambiguity and trailing-slash expectations as any public API.",
    "**Context.** `*gin.Context` wraps the request, response writer, parameters, middleware state, and helpers. It is request-scoped. Read `c.Request.Context()` when a database or outgoing call needs cancellation from the underlying HTTP request.",
    "**Response.** `c.JSON` serialises a value and writes the status. It does not make every value safe to expose. Named response structs give a more stable schema than returning internal models or large maps.",
    "**Server.** The engine implements `http.Handler`, so it can be assigned to `http.Server.Handler`. This keeps timeouts, TLS, graceful shutdown, and process lifecycle under the standard library even when endpoint code uses Gin."
  ),
  visualType: "flow_diagram",
  visualTitle: "Gin inside the standard HTTP server",
  visual: "```mermaid\nflowchart LR\n  A[http.Server] --> B[gin.Engine: http.Handler]\n  B --> C[Gin middleware]\n  C --> D[Method + path route]\n  D --> E[gin.Context handler]\n  E --> F[c.JSON response]\n```",
  codeTitle: "Gin JSON route test",
  files: {
    "go.mod": ginModuleFile(),
    "router.go": go(
      "package lesson",
      "",
      "import (",
      "\t\"net/http\"",
      "",
      "\t\"github.com/gin-gonic/gin\"",
      ")",
      "",
      "func Router() http.Handler {",
      "\tgin.SetMode(gin.TestMode)",
      "\trouter := gin.New()",
      "\trouter.GET(\"/users/:id\", func(c *gin.Context) { c.JSON(http.StatusOK, gin.H{\"id\": c.Param(\"id\")}) })",
      "\treturn router",
      "}"
    ),
    "router_test.go": go(
      "package lesson",
      "",
      "import (",
      "\t\"encoding/json\"",
      "\t\"net/http\"",
      "\t\"net/http/httptest\"",
      "\t\"testing\"",
      ")",
      "",
      "func TestUserRoute(t *testing.T) {",
      "\trecorder := httptest.NewRecorder()",
      "\tRouter().ServeHTTP(recorder, httptest.NewRequest(http.MethodGet, \"/users/42\", nil))",
      "\tvar body map[string]string",
      "\tif err := json.Unmarshal(recorder.Body.Bytes(), &body); err != nil { t.Fatal(err) }",
      "\tif recorder.Code != 200 || body[\"id\"] != \"42\" { t.Fatalf(\"status=%d body=%v\", recorder.Code, body) }",
      "}"
    ),
  },
  commands: ["go test -race ./...", "go vet ./..."],
  checks: [["go", "test", "-race", "./..."], ["go", "vet", "./..."]],
  codeNote: "Gin's engine is tested through the same `ServeHTTP` boundary as a standard-library mux.",
  followups: [
    "Which middleware does `gin.Default` attach?",
    "Why might a service prefer `gin.New`?",
    "How can a Gin handler pass cancellation to a database call?",
  ],
});

add({
  topicSlug: "comparisons",
  question: "When should a Go service use `net/http` `ServeMux` instead of Gin, or Gin instead of `ServeMux`?",
  title: "Choosing between ServeMux and Gin",
  direct: "Choose `ServeMux` when standard-library routing and small explicit helpers meet the service's needs. Choose Gin when its context, binding, middleware conventions, and ecosystem remove meaningful repeated work for the team. Both implement `http.Handler`; compare maintainability, contracts, dependencies, and team familiarity rather than assuming one is always faster or more professional.",
  quick: [
    "Modern `ServeMux` supports method patterns and path wildcards.",
    "Gin adds a framework context, binding, validation integration, and middleware conventions.",
    "Both work behind `http.Server` because both implement `http.Handler`.",
    "Standard library means fewer framework APIs and dependencies.",
    "Framework convenience helps only when the application actually uses it.",
    "Decide with a representative endpoint and team maintenance needs.",
  ],
  speaking: paragraphs(
    "- `net/http` and Gin sit at different levels. `net/http` supplies the server, request and response types, middleware interface, tests, and a modern `ServeMux` with method and wildcard routing. Gin builds a framework experience on that foundation with its own context, router syntax, binding helpers, validation integration, and middleware ecosystem.",
    "- Both can expose the same handler boundary:\n\n```go\nvar standard http.Handler = standardRoutes()\nvar framework http.Handler = ginRoutes()\n```\n\nEither value can be assigned to `http.Server.Handler`, wrapped by compatible outer handlers, and called by `httptest`.",
    "- For example, a small internal service with a dozen JSON endpoints may need only ServeMux, one decode helper, and a few standard middleware wrappers. A team building many request shapes may prefer Gin's binding, route groups, and existing middleware because those conventions reduce repeated glue and are already understood by the team.",
    "- The trade-off is broader than dependency count. A framework adds APIs, upgrade work, and conventions that developers must know, while standard-library code may grow its own inconsistent mini-framework if the team repeatedly rebuilds binding and errors. Performance should be measured with representative handlers; database calls and response design often matter more than router microbenchmarks.",
    "- I write down the required features, build one real endpoint, and compare readability, tests, observability, and long-term ownership. The decision is not permanent at every layer because both remain HTTP handlers, but endpoint code does use different context and routing APIs. Pick the smaller set of concepts that keeps the service consistent."
  ),
  overviewTitle: "Same server contract, different application-level convenience",
  overview: "ServeMux keeps routing close to the standard library. Gin supplies a larger set of endpoint conventions. The useful comparison is how much repeated application code each choice leaves for this team and service.",
  deepTitle: "Library and framework decision boundaries",
  deep: paragraphs(
    "**Routing.** Go 1.22+ ServeMux covers method matching, single and remainder wildcards, precedence, and automatic 404/405 behavior. Gin offers its own parameter syntax, route groups, middleware attachment, and framework context.",
    "**Request handling.** Standard code chooses JSON decoding and validation libraries explicitly. Gin combines binding selection and validator integration behind helpers. That saves code when the defaults fit, but teams must understand must-bind versus should-bind response behavior.",
    "**Dependencies.** ServeMux is tied to the Go toolchain and introduces no external module. Gin and its transitive dependencies need version, security, and upgrade review. External does not mean unsafe; it means the application owns another compatibility decision.",
    "**Consistency.** A framework can give many developers one route and middleware style. A small standard-library service can be even easier to read. Problems arise when either choice is mixed with several competing local patterns.",
    "**Evidence.** Compare a normal endpoint, an error path, middleware, validation, and a route test. Include build size or throughput only when they are real constraints and measure the deployed shape. A familiar API and clear ownership usually matter more than an abstract winner."
  ),
  visualType: "comparison_table",
  visualTitle: "Decision factors for a small HTTP service",
  visual: "| Factor | `net/http` ServeMux | Gin |\n|---|---|---|\n| Routing | Standard method/wildcard patterns | Framework patterns and groups |\n| Binding | Compose decoder and validator | Built-in binding + validator integration |\n| Context | `*http.Request` context | Gin context plus request context |\n| Dependencies | Standard library | External framework and transitive modules |\n| Best fit | Explicit small service | Team benefits from framework conventions |",
  codeTitle: "Equivalent ServeMux and Gin routes",
  files: {
    "go.mod": ginModuleFile(),
    "routers.go": go(
      "package lesson",
      "",
      "import (",
      "\t\"fmt\"",
      "\t\"net/http\"",
      "",
      "\t\"github.com/gin-gonic/gin\"",
      ")",
      "",
      "func Standard() http.Handler { mux := http.NewServeMux(); mux.HandleFunc(\"GET /hello/{name}\", func(w http.ResponseWriter, r *http.Request) { fmt.Fprint(w, r.PathValue(\"name\")) }); return mux }",
      "func Gin() http.Handler { gin.SetMode(gin.TestMode); router := gin.New(); router.GET(\"/hello/:name\", func(c *gin.Context) { c.String(200, c.Param(\"name\")) }); return router }"
    ),
    "routers_test.go": go(
      "package lesson",
      "",
      "import (",
      "\t\"net/http\"",
      "\t\"net/http/httptest\"",
      "\t\"testing\"",
      ")",
      "",
      "func TestEquivalentPublicContract(t *testing.T) {",
      "\tfor name, handler := range map[string]http.Handler{\"standard\": Standard(), \"gin\": Gin()} {",
      "\t\trecorder := httptest.NewRecorder()",
      "\t\thandler.ServeHTTP(recorder, httptest.NewRequest(http.MethodGet, \"/hello/Ada\", nil))",
      "\t\tif recorder.Code != 200 || recorder.Body.String() != \"Ada\" { t.Fatalf(\"%s: status=%d body=%q\", name, recorder.Code, recorder.Body.String()) }",
      "\t}",
      "}"
    ),
  },
  commands: ["go test -race ./...", "go vet ./..."],
  checks: [["go", "test", "-race", "./..."], ["go", "vet", "./..."]],
  codeNote: "The test compares one public contract, not every framework feature. Both routers remain normal `http.Handler` values.",
  followups: [
    "Which Go release added method and wildcard ServeMux patterns?",
    "What maintenance cost can a home-grown standard-library mini-framework create?",
    "Which measurements would make router performance relevant to this service?",
  ],
});

add({
  topicSlug: "comparisons",
  question: "When should a Go handler use `json.Encoder` instead of `json.Marshal`?",
  title: "Choosing direct JSON encoding or marshal-first writing",
  direct: "Use `json.Encoder` to write a value directly to a stream, especially when the extra full byte buffer is unnecessary; `Encode` adds a newline. Use `json.Marshal` when the complete bytes are needed or when encoding must succeed before the HTTP response is committed. Neither approach automatically handles status, media type, schema design, or write failures.",
  quick: [
    "`Encoder.Encode` writes JSON directly to an `io.Writer` and adds a newline.",
    "`json.Marshal` returns a complete byte slice and an error.",
    "Marshal-first lets a handler catch encoding failure before committing status.",
    "Direct encoding avoids holding an additional complete output byte slice.",
    "Set status and `Content-Type` separately for either approach.",
    "Test decoded JSON, not harmless whitespace differences.",
  ],
  speaking: paragraphs(
    "- `json.Marshal` and `json.Encoder` use the same JSON rules but deliver output differently. Marshal builds and returns a complete `[]byte`. An encoder writes a value to an `io.Writer`, such as `http.ResponseWriter`, and `Encode` adds a newline after the JSON value.",
    "- The two HTTP shapes are:\n\n```go\nbody, err := json.Marshal(value) // error before commit\n// set header, status, then w.Write(body)\n\nerr = json.NewEncoder(w).Encode(value) // writes directly\n```\n\nNeither line sets the intended status automatically; the first write still commits 200 if no status was chosen.",
    "- For example, a small response with a custom `MarshalJSON` method can fail. Marshal-first lets the handler detect that failure while the response is uncommitted and choose a clean 500. Direct Encode may already have committed headers or bytes when an error appears, so a second error response cannot replace the partial one.",
    "- Direct encoding is convenient for known encodable response structs and can avoid a second full output buffer. Marshal is useful for signing, caching, measuring, logging safe metadata, or writing the same bytes somewhere else. Neither option turns one huge in-memory slice field into true incremental item streaming; large-response design needs its own contract.",
    "- I choose based on the error and buffering boundary, then keep the public behavior the same: explicit media type, intended status, one JSON document, and handled write errors. Clients should parse JSON rather than depend on the newline. The choice is an implementation detail unless the API deliberately defines a streaming format."
  ),
  overviewTitle: "The key difference is when bytes exist and where errors appear",
  overview: "Marshal prepares a complete representation before the writer is touched. Encoder connects serialization directly to the writer. That changes buffering and the handler's ability to choose a different status after an encoding error.",
  deepTitle: "JSON preparation and commitment boundaries",
  deep: paragraphs(
    "**Marshal result.** `json.Marshal` returns bytes only when the value has been encoded successfully. The caller owns those bytes and can inspect their length, cache them, sign them, or write them to several destinations. The extra slice remains in memory until released.",
    "**Encoder result.** `Encoder.Encode` targets an `io.Writer` and terminates each encoded value with a newline. It also supports options such as `SetEscapeHTML` and `SetIndent`. Repeated Encode calls form a sequence of JSON values, not one JSON array unless the protocol defines that sequence.",
    "**HTTP status.** Writing either byte slice or encoder output commits status 200 when no status was set. Set headers first. For non-200 success, call `WriteHeader` before the body. Marshal errors happen before that commitment when the code is ordered correctly.",
    "**Failure after commit.** A writer can fail because the client leaves. An encoder or Write then returns an error, but the server cannot send replacement bytes to the same response. Record the failure safely and stop writing.",
    "**Contract.** Named response types, field tags, and omission rules matter more to clients than the chosen function. Tests should decode output and check headers and status. Exact-byte assertions belong only where canonical bytes are truly part of the contract."
  ),
  visualType: "comparison_table",
  visualTitle: "JSON output choices",
  visual: "| Concern | `json.Marshal` | `json.Encoder.Encode` |\n|---|---|---|\n| Destination | Returns `[]byte` | Writes to `io.Writer` |\n| Complete extra buffer | Yes | Not required by caller |\n| Trailing newline | No | Yes |\n| Encode error before HTTP write | Yes, when marshal happens first | Not guaranteed |\n| Reuse exact bytes | Easy | Not directly |",
  codeTitle: "Marshal and Encoder output test",
  files: {
    "go.mod": moduleFile(),
    "json_test.go": go(
      "package lesson",
      "",
      "import (",
      "\t\"bytes\"",
      "\t\"encoding/json\"",
      "\t\"reflect\"",
      "\t\"testing\"",
      ")",
      "",
      "func TestMarshalAndEncoder(t *testing.T) {",
      "\tvalue := map[string]int{\"count\": 2}",
      "\tmarshaled, err := json.Marshal(value)",
      "\tif err != nil { t.Fatal(err) }",
      "\tvar buffer bytes.Buffer",
      "\tif err := json.NewEncoder(&buffer).Encode(value); err != nil { t.Fatal(err) }",
      "\tvar first, second map[string]int",
      "\tif err := json.Unmarshal(marshaled, &first); err != nil { t.Fatal(err) }",
      "\tif err := json.Unmarshal(buffer.Bytes(), &second); err != nil { t.Fatal(err) }",
      "\tif !reflect.DeepEqual(first, second) || buffer.Bytes()[buffer.Len()-1] != '\\n' { t.Fatalf(\"marshal=%q encode=%q\", marshaled, buffer.Bytes()) }",
      "}"
    ),
  },
  commands: ["go test -race ./...", "go vet ./..."],
  checks: [["go", "test", "-race", "./..."], ["go", "vet", "./..."]],
  codeNote: "The test proves semantic equality while also showing Encoder's newline, which exact string comparisons often mistake for a contract change.",
  followups: [
    "Why can marshal-first preserve a clean 500 response?",
    "Does Encoder automatically set an HTTP content type?",
    "When would exact JSON bytes, rather than decoded value, matter?",
  ],
});

add({
  topicSlug: "comparisons",
  question: "What is the difference between `httptest.NewRecorder` and `httptest.NewServer`?",
  title: "Choosing an in-process recorder or a real loopback test server",
  direct: "`httptest.NewRecorder` captures a handler call directly without opening a network listener. `httptest.NewServer` starts an HTTP server on a loopback address and provides a URL and configured client path. Use a recorder for handler and routing contracts; use a test server when client behavior, redirects, cookies, TLS, connections, or the HTTP transport must participate.",
  quick: [
    "A recorder calls `ServeHTTP` directly and captures the response.",
    "A test server opens a loopback listener and supplies a URL.",
    "Recorder tests are fast and precise for handler and mux behavior.",
    "Server tests include an actual `http.Client` and transport path.",
    "Use `NewTLSServer` for trusted test TLS through its provided client.",
    "Always close a test server and response bodies.",
  ],
  speaking: paragraphs(
    "- `httptest.NewRecorder` and `httptest.NewServer` create different test boundaries. A recorder implements `http.ResponseWriter`; the test constructs a request and calls `handler.ServeHTTP` directly. No listener, client transport, DNS, or socket is involved. This makes handler, middleware, and routing failures easy to locate.",
    "- A recorder test looks like this:\n\n```go\nrec := httptest.NewRecorder()\nhandler.ServeHTTP(rec, httptest.NewRequest(\"GET\", \"/health\", nil))\nres := rec.Result()\n```\n\nA server test calls `httptest.NewServer(handler)`, defers `server.Close()`, then uses `http.Get(server.URL + \"/health\")` or a configured client.",
    "- For example, route status and JSON shape belong in a recorder test. Redirect following belongs in a server test because the client decides whether to follow a `Location`. Cookie jars, connection reuse, TLS, and outgoing client middleware also need the client-and-transport boundary. `NewTLSServer` supplies a client that trusts its generated test certificate.",
    "- A test server is still local and controlled; it is not a full deployment with proxies, load balancers, real certificates, or production timeouts. It is slower and broader than a direct call, so using it for every field-validation case makes failures less focused without adding evidence.",
    "- I choose the narrowest boundary that includes the behavior under test. Most endpoint cases use a recorder through the real mux. A smaller number use a test server for client-visible transport behavior. In both forms, response bodies are closed and assertions cover status, headers, and parsed content rather than only a successful call."
  ),
  overviewTitle: "Direct handler evidence versus client-and-transport evidence",
  overview: "The recorder proves what a handler writes for a request. The test server proves what an HTTP client observes after the request travels through a real loopback server and transport.",
  deepTitle: "HTTP test boundary choices",
  deep: paragraphs(
    "**Recorder.** `httptest.NewRecorder` creates an in-memory `ResponseWriter`. It stores header, status, body, and flush information. It is ideal for table-driven route and validation tests. Calling the real mux still includes routing even though no network is opened.",
    "**Result.** `recorder.Result()` builds an `*http.Response` from the captured state. It should be used after the handler finishes. The response body must be closed by code that consumes it, matching normal response ownership.",
    "**Test server.** `NewServer` begins serving immediately on a system-selected loopback port. The URL can be passed to ordinary client code, which includes redirect policy, cookies, connection pooling, and transport behavior. Closing the server releases its listener and connections.",
    "**TLS server.** `NewTLSServer` uses a test certificate. Its `Client()` method is configured to trust that certificate. Using the default client against the TLS URL should not be “fixed” by globally disabling certificate verification.",
    "**Limits.** Neither form reproduces external proxies or production capacity. Use integration or deployment tests for those layers. Within unit and component tests, match the tool to the claim so a failure identifies either handler logic or client/transport interaction clearly."
  ),
  visualType: "comparison_table",
  visualTitle: "Which layers participate?",
  visual: "| Layer | Recorder | Test server |\n|---|---:|---:|\n| Handler and middleware | Yes | Yes |\n| ServeMux routing | Yes, when mux is called | Yes |\n| HTTP client redirect/cookie policy | No | Yes |\n| Loopback listener and transport | No | Yes |\n| Production proxy/load balancer | No | No |",
  codeTitle: "Recorder and loopback server test",
  files: {
    "go.mod": moduleFile(),
    "health_test.go": go(
      "package lesson",
      "",
      "import (",
      "\t\"io\"",
      "\t\"net/http\"",
      "\t\"net/http/httptest\"",
      "\t\"testing\"",
      ")",
      "",
      "func TestRecorderAndServer(t *testing.T) {",
      "\thandler := http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) { w.WriteHeader(http.StatusNoContent) })",
      "\trecorder := httptest.NewRecorder()",
      "\thandler.ServeHTTP(recorder, httptest.NewRequest(http.MethodGet, \"/health\", nil))",
      "\tif recorder.Code != 204 { t.Fatal(recorder.Code) }",
      "",
      "\tserver := httptest.NewServer(handler)",
      "\tdefer server.Close()",
      "\tresponse, err := server.Client().Get(server.URL + \"/health\")",
      "\tif err != nil { t.Fatal(err) }",
      "\tdefer response.Body.Close()",
      "\t_, _ = io.Copy(io.Discard, response.Body)",
      "\tif response.StatusCode != 204 { t.Fatal(response.StatusCode) }",
      "}"
    ),
  },
  commands: ["go test -race ./...", "go vet ./..."],
  checks: [["go", "test", "-race", "./..."], ["go", "vet", "./..."]],
  codeNote: "Both assertions observe 204, but the second also exercises an HTTP client, loopback listener, and transport.",
  followups: [
    "Why is a test server needed to observe redirect-following policy?",
    "Which client should be used with `NewTLSServer`?",
    "What production layers remain outside both test styles?",
  ],
});

add({
  topicSlug: "introduction-to-gin",
  question: "How do you bind and validate a JSON request in Gin?",
  title: "Binding JSON with controlled validation errors",
  direct: "Define a request struct with JSON and binding tags, then use `ShouldBindJSON` when the handler needs to control its error response. Gin binds JSON and runs its validator integration, including rules such as `required`. The `Bind` family writes a 400 response and aborts on error, so later attempts to choose another status are too late.",
  quick: [
    "Use a request-specific struct with `json` and `binding` tags.",
    "`ShouldBindJSON` returns an error and leaves response choice to the handler.",
    "`BindJSON` belongs to the must-bind family and writes 400 on failure.",
    "Binding checks representation; tags add declared validation rules.",
    "Business rules still run after binding succeeds.",
    "Return after writing any binding or validation error.",
  ],
  speaking: paragraphs(
    "- Gin binding converts request data into a Go struct and can run validation declared with `binding` tags. The struct should model only the endpoint input. JSON tags name public fields, while a rule such as `binding:\"required,min=1\"` describes basic constraints checked during binding.",
    "- A controlled JSON endpoint usually uses:\n\n```go\nvar input createUser\nif err := c.ShouldBindJSON(&input); err != nil {\n    c.JSON(http.StatusBadRequest, gin.H{\"code\": \"invalid_user\"})\n    return\n}\n```\n\n`ShouldBindJSON` returns the error without automatically committing a response, so the handler owns the status and error envelope.",
    "- The must-bind methods, including `BindJSON`, behave differently. On a binding error they abort the request with status 400 and a plain-text content type. If the handler then tries to write 422, Gin warns that headers were already written. This makes should-bind methods easier when an API has a consistent JSON error format.",
    "- For example, a request can require a non-empty name and an age from 1 through 130. Those field rules catch missing or out-of-range values. A rule such as “the username is available” needs a service or repository after binding; it should not be hidden in a tag that performs network work.",
    "- I separate three outcomes: JSON could not bind, declared field validation failed, or a later business rule rejected the command. Public messages stay simple, while detailed validator errors can be mapped to safe field messages or logged. Binding saves repetitive transport code, but the endpoint still owns size limits, authorization, domain behavior, and one final response."
  ),
  overviewTitle: "Binding creates a typed request; business validation remains separate",
  overview: "Gin can decode and check declared field rules in one operation. The handler still chooses the response contract and performs rules that depend on application state or relationships beyond one field tag.",
  deepTitle: "Should-bind and must-bind behavior",
  deep: paragraphs(
    "**Request type.** Keep an input struct separate from database and response models. Tags make accepted JSON names and simple constraints visible. Pointer fields can distinguish a missing value from an explicit zero when that difference belongs to the contract.",
    "**Should-bind family.** `ShouldBindJSON` chooses the JSON binder directly and returns an error. No automatic response is required, so the handler can map syntax and validation failures to its API's stable JSON envelope and then return.",
    "**Must-bind family.** `BindJSON` uses must-bind behavior. A binding error calls `AbortWithError(400, err)` and sets a text response. It is concise for default behavior but unsuitable when later code expects to replace that response with a custom status.",
    "**Validation.** Gin uses go-playground validator for struct validation. `required` and range tags cover local field rules. Cross-field or domain-state rules may require custom validation or ordinary application code; whichever approach is used should remain testable and free of surprising external work.",
    "**HTTP limits.** Binding does not remove the need for an appropriate body-size policy, content-type contract, authentication, or cancellation. Tests should cover malformed JSON, missing required fields, boundary values, valid input, and the exact stable error shape."
  ),
  visualType: "comparison_table",
  visualTitle: "Who controls the error response?",
  visual: "| Method family | On binding error | Best fit |\n|---|---|---|\n| `ShouldBindJSON` | Returns error; handler decides response | Custom API status and JSON envelope |\n| `BindJSON` | Aborts and writes 400 text response | Gin's default error behavior is acceptable |",
  codeTitle: "Gin binding and validation example",
  files: {
    "go.mod": ginModuleFile(),
    "users.go": go(
      "package lesson",
      "",
      "import (",
      "\t\"net/http\"",
      "",
      "\t\"github.com/gin-gonic/gin\"",
      ")",
      "",
      "type createUser struct { Name string `json:\"name\" binding:\"required\"`; Age int `json:\"age\" binding:\"required,min=1,max=130\"` }",
      "",
      "func Router() http.Handler {",
      "\tgin.SetMode(gin.TestMode)",
      "\trouter := gin.New()",
      "\trouter.POST(\"/users\", func(c *gin.Context) {",
      "\t\tvar input createUser",
      "\t\tif err := c.ShouldBindJSON(&input); err != nil { c.JSON(400, gin.H{\"code\": \"invalid_user\"}); return }",
      "\t\tc.JSON(http.StatusCreated, gin.H{\"name\": input.Name})",
      "\t})",
      "\treturn router",
      "}"
    ),
    "users_test.go": go(
      "package lesson",
      "",
      "import (",
      "\t\"net/http\"",
      "\t\"net/http/httptest\"",
      "\t\"strings\"",
      "\t\"testing\"",
      ")",
      "",
      "func TestBinding(t *testing.T) {",
      "\tfor _, test := range []struct{ body string; want int }{{`{\"name\":\"Ada\",\"age\":36}`, 201}, {`{\"name\":\"\",\"age\":36}`, 400}, {`{\"name\":\"Ada\"`, 400}} {",
      "\t\trecorder := httptest.NewRecorder()",
      "\t\trequest := httptest.NewRequest(http.MethodPost, \"/users\", strings.NewReader(test.body))",
      "\t\trequest.Header.Set(\"Content-Type\", \"application/json\")",
      "\t\tRouter().ServeHTTP(recorder, request)",
      "\t\tif recorder.Code != test.want { t.Fatalf(\"body=%s status=%d\", test.body, recorder.Code) }",
      "\t}",
      "}"
    ),
  },
  commands: ["go test -race ./...", "go vet ./..."],
  checks: [["go", "test", "-race", "./..."], ["go", "vet", "./..."]],
  codeNote: "Every test sets the JSON media type because Gin chooses binders using request information; malformed and invalid bodies keep one JSON response path.",
  followups: [
    "Why can `BindJSON` make a later 422 response ineffective?",
    "When would a pointer field improve an input struct?",
    "Which validation rules should remain in application code?",
  ],
});

add({
  topicSlug: "introduction-to-gin",
  question: "How does Gin middleware use `Next`, `Abort`, and request-scoped context values?",
  title: "Controlling Gin's handler chain and context values",
  direct: "Gin middleware is a `gin.HandlerFunc`. It can set request-scoped values with `c.Set`, call `c.Next()` to run remaining handlers and then continue afterward, or call an abort method to prevent pending handlers from running. Abort does not stop the current function, so the middleware must still return. Copy the Gin context before using it from a goroutine.",
  quick: [
    "Gin middleware has the same `gin.HandlerFunc` type as endpoints.",
    "Use `c.Set` and `c.Get` for request-scoped Gin values.",
    "`c.Next()` runs pending handlers, then returns for after-work.",
    "`c.Abort()` stops pending handlers but not the current function.",
    "Write the rejection, abort, and return from the middleware.",
    "Use `c.Copy()` before reading a Gin context in a goroutine.",
  ],
  speaking: paragraphs(
    "- Gin represents both middleware and endpoints as `gin.HandlerFunc`. For each request, the context holds the writer, request, path parameters, a handler chain, and request-scoped key-value storage. Middleware can inspect or enrich the context before deciding whether the remaining handlers should run.",
    "- An authentication layer can be written as:\n\n```go\nfunc auth(c *gin.Context) {\n    if c.GetHeader(\"Authorization\") != \"Bearer demo\" {\n        c.AbortWithStatusJSON(401, gin.H{\"code\": \"unauthorized\"})\n        return\n    }\n    c.Set(\"userID\", \"u-7\")\n    c.Next()\n}\n```\n\nThe endpoint retrieves the verified value with `c.Get` or a typed helper.",
    "- `c.Next()` executes the remaining handlers in the current chain. When they finish, execution continues after Next, which supports duration logs or cleanup. `c.Abort()` changes the chain index so pending handlers do not run. It does not return from the middleware function, so code after Abort still executes unless the function explicitly returns.",
    "- Gin context values are request-scoped but loosely typed, so small helper functions reduce repeated assertions and key spelling errors. The underlying `c.Request.Context()` remains the right value for database and outgoing HTTP cancellation. They are related mechanisms, but `c.Set` does not automatically become a standard context value.",
    "- A `*gin.Context` is reused and must not be accessed asynchronously as if it were an immutable request snapshot. Gin documents using `c.Copy()` when a goroutine needs context data. Even then, capture only safe values and give the goroutine an explicit lifetime. I use middleware for shared HTTP policy, abort and return on rejection, and test that the protected endpoint was not called."
  ),
  overviewTitle: "The Gin context carries both chain position and request state",
  overview: "Next and Abort control which Gin handlers run. Set and Get carry values inside that one request. The standard request context separately carries cancellation into context-aware services.",
  deepTitle: "Gin handler-chain control",
  deep: paragraphs(
    "**Handler chain.** Global, group, and route middleware are combined with the endpoint into an ordered slice. Each request gets a context that tracks the current position in that chain.",
    "**Next.** Calling `Next` advances through pending handlers before returning. Code before Next is request-side work; code after Next is response-side work. A middleware can also simply finish and allow Gin's normal chain progression, but explicit Next makes after-work easy to see.",
    "**Abort.** Abort marks the remaining chain as skipped. It does not write a response unless an `AbortWithStatus...` helper is used, and it does not stop statements in the current function. A return after rejection prevents accidental work or writes.",
    "**Values.** `Set` lazily creates a map protected for access, and `Get` returns `any` plus a boolean. Package helpers can offer a typed user lookup. Do not use arbitrary keys to hide normal service dependencies.",
    "**Goroutines.** Gin may reuse its context after the request. `Copy` creates a context intended for safe read use outside the request scope, but it does not design cancellation or completion for background work. Copy the specific immutable data when possible and keep background ownership explicit."
  ),
  visualType: "sequence_diagram",
  visualTitle: "Accepted and rejected Gin request paths",
  visual: "```mermaid\nsequenceDiagram\n  participant C as gin.Context\n  participant A as Auth middleware\n  participant H as Endpoint\n  C->>A: request\n  alt valid token\n    A->>C: Set userID\n    A->>H: Next\n    H-->>A: response\n    A-->>C: after-work\n  else invalid token\n    A->>C: AbortWithStatusJSON(401)\n    A-->>C: return; endpoint skipped\n  end\n```",
  codeTitle: "Gin authentication middleware example",
  files: {
    "go.mod": ginModuleFile(),
    "auth.go": go(
      "package lesson",
      "",
      "import (",
      "\t\"net/http\"",
      "",
      "\t\"github.com/gin-gonic/gin\"",
      ")",
      "",
      "func Router(called *bool) http.Handler {",
      "\tgin.SetMode(gin.TestMode)",
      "\trouter := gin.New()",
      "\trouter.Use(func(c *gin.Context) {",
      "\t\tif c.GetHeader(\"Authorization\") != \"Bearer demo\" { c.AbortWithStatusJSON(401, gin.H{\"code\": \"unauthorized\"}); return }",
      "\t\tc.Set(\"userID\", \"u-7\")",
      "\t\tc.Next()",
      "\t})",
      "\trouter.GET(\"/profile\", func(c *gin.Context) { *called = true; userID, _ := c.Get(\"userID\"); c.JSON(200, gin.H{\"id\": userID}) })",
      "\treturn router",
      "}"
    ),
    "auth_test.go": go(
      "package lesson",
      "",
      "import (",
      "\t\"net/http\"",
      "\t\"net/http/httptest\"",
      "\t\"testing\"",
      ")",
      "",
      "func TestRejectedRequestSkipsEndpoint(t *testing.T) {",
      "\tcalled := false",
      "\trecorder := httptest.NewRecorder()",
      "\tRouter(&called).ServeHTTP(recorder, httptest.NewRequest(http.MethodGet, \"/profile\", nil))",
      "\tif recorder.Code != 401 || called { t.Fatalf(\"status=%d called=%t\", recorder.Code, called) }",
      "}"
    ),
  },
  commands: ["go test -race ./...", "go vet ./..."],
  checks: [["go", "test", "-race", "./..."], ["go", "vet", "./..."]],
  codeNote: "The boolean proves that aborting and returning prevents the protected endpoint from running.",
  followups: [
    "Why must middleware still return after calling `Abort`?",
    "How are `c.Set` values different from `c.Request.Context()` values?",
    "When must a Gin context be copied?",
  ],
});

add({
  topicSlug: "http-router-basics",
  question: "How does `ServeMux` choose between overlapping patterns, and when does registration panic?",
  title: "ServeMux precedence, conflicts, and trailing slashes",
  direct: "`ServeMux` selects the most specific matching pattern: one that matches a strict subset of another pattern's requests. Literal paths are more specific than wildcard paths when that subset rule holds. If two patterns overlap but neither is more specific, registration panics. Trailing-slash subtree patterns can also redirect a missing slash unless the non-slash path is registered separately.",
  quick: [
    "The most specific matching pattern wins.",
    "Specific means matching a strict subset of another pattern's requests.",
    "A literal segment is usually narrower than a wildcard segment.",
    "Overlapping incomparable patterns conflict and registration panics.",
    "A subtree path ending in `/` can redirect its slashless form.",
    "Register routes at startup so conflicts fail before traffic arrives.",
  ],
  speaking: paragraphs(
    "- `ServeMux` does not choose a route by registration order. It compares the sets of requests described by matching patterns and selects the most specific one. Pattern A is more specific than B when A matches a strict subset of the requests B matches. This makes routing stable even when registrations are rearranged.",
    "- A common pair is:\n\n```go\nmux.HandleFunc(\"GET /posts/latest\", latest)\nmux.HandleFunc(\"GET /posts/{id}\", byID)\n```\n\nThe literal `latest` route is more specific because every request it matches also fits `{id}`, but not every ID request is `latest`. A request for `/posts/latest` therefore reaches `latest`.",
    "- A conflict occurs when two patterns overlap and neither request set contains the other. For example, `/b/{bucket}/o/{object...}` and `/b/{bucket}/{verb}/{noun}` can both match some paths while each also matches paths the other does not. `ServeMux` panics when the conflicting pattern is registered, making the ambiguous contract visible during startup.",
    "- Host-specific patterns have a compatibility exception over otherwise conflicting hostless patterns. Trailing slashes also matter: a registered subtree like `/images/` may redirect `/images` to add the slash, unless `/images` is registered separately. Redirect behavior should be tested when clients or signed URLs care about the exact path.",
    "- I prefer literal routes where the API has a fixed word, keep catch-all patterns narrow, and construct the mux during startup. The question to ask is not “which line came first?” but “does one pattern describe a strict subset?” If not, the routing design needs a clearer boundary."
  ),
  overviewTitle: "Specificity is a set relationship",
  overview: "Think of each pattern as a set of method-and-path requests. A smaller matching set wins over a larger one; intersecting sets with no subset relationship are ambiguous and rejected.",
  deepTitle: "Pattern precedence and conflict boundaries",
  deep: paragraphs(
    "**Strict subset.** `GET /posts/latest` matches fewer requests than `GET /posts/{id}`. The literal route wins for `latest`, and the wildcard continues to handle other one-segment identifiers. Registration order cannot change that result.",
    "**Method scope.** A method-qualified pattern is normally more specific than the same host and path without a method because it matches fewer requests. Remember that GET also includes HEAD for this comparison.",
    "**Conflict.** Two patterns conflict when their request sets overlap but neither is a strict subset. The panic includes information about the patterns. Treat it as a startup configuration failure; recovering and choosing one arbitrarily would make API behavior depend on hidden order.",
    "**Trailing slash.** A path ending in slash represents a subtree. When its slashless form has no separate registration, ServeMux can send a redirect to the slash form. Registering both makes them separate explicit routes and suppresses that redirect.",
    "**Route-boundary tests.** Write representative requests at the literal, wildcard, subtree, wrong-method, and missing-slash boundaries. Conflict cases can be tested by asserting registration panics. Clear routes should be explainable as non-overlapping sets or a deliberate narrow-to-broad subset chain."
  ),
  visualType: "diagram",
  visualTitle: "Narrow patterns sit inside broad patterns",
  visual: "```text\nAll requests\n└── GET /posts/{id}          broad one-segment set\n    └── GET /posts/latest    strict subset, so it wins\n\nConflict: A overlaps B, but A is not inside B and B is not inside A.\nResult: registration panic, not first-registration wins.\n```",
  codeTitle: "Literal route precedence and conflict test",
  files: {
    "go.mod": moduleFile(),
    "precedence_test.go": go(
      "package lesson",
      "",
      "import (",
      "\t\"fmt\"",
      "\t\"net/http\"",
      "\t\"net/http/httptest\"",
      "\t\"testing\"",
      ")",
      "",
      "func TestLiteralWins(t *testing.T) {",
      "\tmux := http.NewServeMux()",
      "\tmux.HandleFunc(\"GET /posts/{id}\", func(w http.ResponseWriter, r *http.Request) { fmt.Fprint(w, \"id\") })",
      "\tmux.HandleFunc(\"GET /posts/latest\", func(w http.ResponseWriter, r *http.Request) { fmt.Fprint(w, \"latest\") })",
      "\trecorder := httptest.NewRecorder()",
      "\tmux.ServeHTTP(recorder, httptest.NewRequest(http.MethodGet, \"/posts/latest\", nil))",
      "\tif recorder.Body.String() != \"latest\" { t.Fatal(recorder.Body.String()) }",
      "}",
      "",
      "func TestConflictPanics(t *testing.T) {",
      "\tdefer func() { if recover() == nil { t.Fatal(\"expected registration panic\") } }()",
      "\tmux := http.NewServeMux()",
      "\tmux.HandleFunc(\"/b/{bucket}/o/{object...}\", func(http.ResponseWriter, *http.Request) {})",
      "\tmux.HandleFunc(\"/b/{bucket}/{verb}/{noun}\", func(http.ResponseWriter, *http.Request) {})",
      "}"
    ),
  },
  commands: ["go test -race ./...", "go vet ./..."],
  checks: [["go", "test", "-race", "./..."], ["go", "vet", "./..."]],
  codeNote: "The first test reverses the intuitive registration order and still gets the literal handler; the second makes ambiguity fail in a controlled test.",
  followups: [
    "Why is a literal path usually more specific than a wildcard path?",
    "What does ServeMux do when overlapping patterns are incomparable?",
    "How can registering a slashless path change redirect behavior?",
  ],
});

add({
  topicSlug: "http-router-basics",
  question: "How do you test Go HTTP routes and path parameters with `httptest`?",
  title: "Testing routing behavior through ServeMux",
  direct: "Create a request with `httptest.NewRequest`, a recorder with `httptest.NewRecorder`, and call the real mux's `ServeHTTP`. Testing through the mux proves method selection, wildcard extraction, redirects, and 404/405 behavior. Call `recorder.Result()` when response-level behavior matters, and close its body like a normal response.",
  quick: [
    "Send the test request through the real mux, not only the endpoint function.",
    "Use `httptest.NewRequest` and `httptest.NewRecorder` for in-process tests.",
    "Assert status, headers, and decoded body separately.",
    "Include correct route, wrong method, missing path, and parameter boundary cases.",
    "Use `Request.SetPathValue` only for a deliberate isolated handler test.",
  ],
  speaking: paragraphs(
    "- A route test should exercise the routing layer it claims to test. `httptest.NewRequest` creates a server-style request, and `httptest.NewRecorder` captures what a handler writes. Calling the application's `ServeMux` with both values stays in process but still runs method matching, wildcard population, redirect logic, and the mux's 404 or 405 response.",
    "- The core test is short:\n\n```go\nreq := httptest.NewRequest(http.MethodGet, \"/users/42\", nil)\nrec := httptest.NewRecorder()\nroutes().ServeHTTP(rec, req)\nres := rec.Result()\ndefer res.Body.Close()\n```\n\nThe test then checks status, content type, and decoded response data.",
    "- For example, a table can cover `GET /users/42` as success, `POST /users/42` as 405, and `GET /missing` as 404. The success assertion confirms the body contains ID 42, proving that the mux matched `{id}` and the handler read it. Calling the handler function directly would not prove either fact.",
    "- `Request.SetPathValue` is useful when a unit test intentionally isolates handler parsing, but it should not replace route tests. `ResponseRecorder.Code` can remain zero when a handler writes nothing; `Result()` produces the implicit response view. A real `httptest.Server` is better when client behavior, redirects, cookies, TLS, or the network stack is part of the test.",
    "- I keep a small table around each route boundary and decode structured bodies instead of matching JSON whitespace. This gives fast tests with precise failures. The goal is not maximum mocking; it is using the narrowest test that still includes the behavior named by the question. A failed case then points clearly to route setup, parameter handling, or response logic."
  ),
  overviewTitle: "Route tests include the mux; handler tests isolate endpoint logic",
  overview: "Both test styles are useful, but they prove different contracts. The mux must participate whenever the claim includes pattern matching, method behavior, redirects, or path-value population.",
  deepTitle: "The `httptest` routing test boundary",
  deep: paragraphs(
    "**Request.** `httptest.NewRequest` accepts a method, target, and optional body. Set headers after construction. The returned request is suitable for an incoming server call and has a non-nil body where needed.",
    "**Recorder.** `NewRecorder` implements `ResponseWriter` and records headers, status, and body. `Result` returns an `*http.Response` snapshot. Read and close that body just as client code would, especially when a helper function owns the response.",
    "**Mux path.** Calling the mux fills `PathValue` and applies built-in routing outcomes. It also catches a route registered under the wrong pattern. A direct endpoint test can be useful for many validation cases, but it is not evidence that a public URL reaches that endpoint.",
    "**Boundary cases.** Include method mismatch, extra path segments, trailing slash, invalid path values, and any literal route that overlaps a wildcard. Assert `Allow` for 405 when that header is part of the contract.",
    "**Real server boundary.** `httptest.NewServer` opens a loopback listener and supplies a client-facing URL. Choose it for client redirects, cookie jars, connection behavior, or middleware relying on server integration. Most route selection tests remain faster and clearer with a recorder."
  ),
  visualType: "comparison_table",
  visualTitle: "HTTP route test boundaries",
  visual: "| Test style | Includes | Best for |\n|---|---|---|\n| Direct handler + `SetPathValue` | Endpoint logic only | Many parsing/validation cases |\n| Mux + recorder | Routing and endpoint | Patterns, parameters, 404/405 |\n| `httptest.Server` + client | Loopback HTTP stack | Redirects, cookies, TLS, client behavior |",
  codeTitle: "Public route table test",
  files: {
    "go.mod": moduleFile(),
    "users.go": go(
      "package lesson",
      "",
      "import (",
      "\t\"encoding/json\"",
      "\t\"log\"",
      "\t\"net/http\"",
      ")",
      "",
      "func Routes() http.Handler {",
      "\tmux := http.NewServeMux()",
      "\tmux.HandleFunc(\"GET /users/{id}\", func(w http.ResponseWriter, r *http.Request) {",
      "\t\tw.Header().Set(\"Content-Type\", \"application/json\")",
      "\t\tif err := json.NewEncoder(w).Encode(map[string]string{\"id\": r.PathValue(\"id\")}); err != nil {",
      "\t\t\tlog.Printf(\"write user response: %v\", err)",
      "\t\t}",
      "\t})",
      "\treturn mux",
      "}"
    ),
    "users_test.go": go(
      "package lesson",
      "",
      "import (",
      "\t\"net/http/httptest\"",
      "\t\"testing\"",
      ")",
      "",
      "func TestRoutes(t *testing.T) {",
      "\tfor _, test := range []struct{ method, path string; want int }{{\"GET\", \"/users/42\", 200}, {\"POST\", \"/users/42\", 405}, {\"GET\", \"/missing\", 404}} {",
      "\t\trecorder := httptest.NewRecorder()",
      "\t\tRoutes().ServeHTTP(recorder, httptest.NewRequest(test.method, test.path, nil))",
      "\t\tif recorder.Code != test.want { t.Errorf(\"%s %s: got %d want %d\", test.method, test.path, recorder.Code, test.want) }",
      "\t}",
      "}"
    ),
  },
  commands: ["go test -race ./...", "go vet ./..."],
  checks: [["go", "test", "-race", "./..."], ["go", "vet", "./..."]],
  codeNote: "Every case constructs the actual route graph, so method and path outcomes come from ServeMux rather than hand-built test state.",
  followups: [
    "When is `SetPathValue` appropriate in a test?",
    "What additional behavior does `httptest.NewServer` include?",
    "Why should JSON assertions avoid exact whitespace matching?",
  ],
});

add({
  topicSlug: "middleware-basics",
  question: "In what order does nested Go HTTP middleware run?",
  title: "Understanding middleware's onion order",
  direct: "For `A(B(handler))`, request-side code runs A then B then the handler. When the handler returns, response-side code runs B then A. The outer middleware sees the request first and finishes last. Order is part of behavior: recovery must surround code it catches, authentication must run before protected work, and logging placement changes what it observes.",
  quick: [
    "`A(B(handler))` enters A, then B, then the handler.",
    "After the handler, control returns through B, then A.",
    "The first wrapper applied is not always the first wrapper entered.",
    "Recovery must be outside the code whose panic it handles.",
    "Authentication must run before the protected endpoint.",
    "Write an order test instead of guessing from helper names.",
  ],
  speaking: paragraphs(
    "- Nested middleware follows ordinary Go function calls. If the final value is `A(B(handler))`, A receives the request first. A calls B, B calls the handler, and the call stack then unwinds: B's after-work runs before A's after-work. This is often called onion order because the request moves inward and the response moves outward.",
    "- The code is just composition:\n\n```go\nwrapped := requestID(logging(endpoint))\n```\n\nHere `requestID` is outermost and runs first. `logging` can read the ID if the outer layer stores it before calling next. After the endpoint returns, logging finishes before requestID's after-work.",
    "- For example, put recovery outside the handlers and middleware whose panics it must catch. Put authentication before the protected endpoint. If logging should record rejected authentication attempts, logging must wrap authentication; if it should record only accepted application work, its placement can be inside. Neither order is universally correct because they answer different observation questions.",
    "- Helper functions can obscure construction order. A loop over a middleware slice may need to apply entries from right to left so the written list matches request order. Response headers also have timing constraints: an outer layer can prepare a header before next, but changing it after next may be too late because the inner handler may have committed the response.",
    "- I document the intended request order beside the composition and keep a tiny test that appends enter and exit labels. The expected trace makes the full contract visible. Middleware order is not styling; it affects access control, panic handling, context availability, metrics, and the final response."
  ),
  overviewTitle: "Request order and return order are mirror images",
  overview: "Every call to next adds a frame to the call stack. Enter work follows the wrappers toward the endpoint; exit work follows the same stack back toward the client.",
  deepTitle: "Middleware composition order",
  deep: paragraphs(
    "**Construction order.** `A(B(H))` is evaluated into handler values before any request arrives. B wraps H, then A wraps that result. A is therefore the object given to the server and becomes the first entry point.",
    "**Request path.** A runs its before-work and calls B. B runs its before-work and calls H. Any layer can return early, so inner layers do not run when an outer authentication or limit check rejects the request.",
    "**Response path.** When H returns, execution continues immediately after B's call to next, then after A's call. Cleanup and timing use this reverse order. The HTTP bytes may already be committed even though Go control is still unwinding.",
    "**Order choices.** Recovery must wrap possible panic sources. A request ID must be added before a logger that reads it. Compression usually wraps the response written by inner code. Access logs can be outside authentication when rejected requests should be counted.",
    "**Composition helpers.** If a configuration lists middleware in desired request order, a helper usually wraps from the end of the slice to the beginning. Name that contract and test it. A four-line trace test is clearer than relying on whether “use” or “chain” inserts at the front or back."
  ),
  visualType: "sequence_diagram",
  visualTitle: "A(B(handler)) request and return order",
  visual: "```mermaid\nsequenceDiagram\n  participant Client\n  participant A as Middleware A\n  participant B as Middleware B\n  participant H as Handler\n  Client->>A: request\n  A->>B: next\n  B->>H: next\n  H-->>B: return\n  B-->>A: after B\n  A-->>Client: after A / response\n```",
  codeTitle: "Middleware entry and exit trace",
  files: {
    "go.mod": moduleFile(),
    "order.go": go(
      "package lesson",
      "",
      "import \"net/http\"",
      "",
      "func Mark(name string, trace *[]string, next http.Handler) http.Handler {",
      "\treturn http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {",
      "\t\t*trace = append(*trace, \"enter \"+name)",
      "\t\tnext.ServeHTTP(w, r)",
      "\t\t*trace = append(*trace, \"exit \"+name)",
      "\t})",
      "}"
    ),
    "order_test.go": go(
      "package lesson",
      "",
      "import (",
      "\t\"net/http\"",
      "\t\"net/http/httptest\"",
      "\t\"reflect\"",
      "\t\"testing\"",
      ")",
      "",
      "func TestOnionOrder(t *testing.T) {",
      "\tvar trace []string",
      "\tendpoint := http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) { trace = append(trace, \"handler\") })",
      "\thandler := Mark(\"A\", &trace, Mark(\"B\", &trace, endpoint))",
      "\thandler.ServeHTTP(httptest.NewRecorder(), httptest.NewRequest(http.MethodGet, \"/\", nil))",
      "\twant := []string{\"enter A\", \"enter B\", \"handler\", \"exit B\", \"exit A\"}",
      "\tif !reflect.DeepEqual(trace, want) { t.Fatalf(\"trace=%v\", trace) }",
      "}"
    ),
  },
  commands: ["go test ./...", "go vet ./..."],
  checks: [["go", "test", "./..."], ["go", "vet", "./..."]],
  codeNote: "The shared trace is safe because this test sends one request. A production logger would not mutate an unsynchronised shared slice.",
  followups: [
    "Where should recovery sit in a middleware chain?",
    "How does early return change which layers run?",
    "Why can after-work be too late to change a response header?",
  ],
});

add({
  topicSlug: "middleware-basics",
  question: "How should middleware pass request-scoped values and handle cancellation?",
  title: "Using request context without turning it into a data bag",
  direct: "Create request-scoped context values with an unexported typed key, attach the new context using `r.WithContext`, and let downstream code read the value through a small helper. Context is for request-scoped metadata, deadlines, and cancellation—not optional function parameters or mutable global state. Downstream work should stop when `r.Context().Done()` is closed.",
  quick: [
    "Use `context.WithValue` only for request-scoped cross-boundary data.",
    "Use a private key type to avoid key collisions.",
    "Pass the copied request from `r.WithContext(ctx)` to next.",
    "Read cancellation and deadlines from `r.Context()`.",
    "Do not store optional service parameters or large mutable objects in context.",
  ],
  speaking: paragraphs(
    "- Every server request carries a context. It is cancelled when the client connection closes, the request is cancelled under HTTP/2, or the handler returns. Middleware can derive a context with request-scoped metadata, such as an authenticated user ID or trace ID, and pass a request containing that derived context to the next handler.",
    "- A private key type prevents unrelated packages from accidentally using an equal key. The pattern is small:\n\n```go\ntype userKey struct{}\nctx := context.WithValue(r.Context(), userKey{}, userID)\nnext.ServeHTTP(w, r.WithContext(ctx))\n```\n\nA helper performs the type assertion so endpoints do not repeat unsafe casts.",
    "- For example, authentication middleware checks a token, stores the verified user ID, and calls next with the copied request. The endpoint reads that ID and starts a database query with `r.Context()`. If the client leaves or the request deadline expires, a context-aware driver can stop the query and release resources sooner.",
    "- Context values are not a replacement for explicit dependencies. A repository, logger configuration, or feature option normally belongs on a handler or function argument. Stored values should be small, request-scoped, and safe for concurrent reads. Do not place credentials in logs merely because they are available through context.",
    "- Cancellation is cooperative: closing `Done` does not forcibly stop arbitrary code. Loops and blocking calls must select on the context or call APIs that accept it. I preserve the incoming context, derive only what is needed, pass it downstream, and test both value availability and cancellation."
  ),
  overviewTitle: "Context carries request lifetime and narrow metadata",
  overview: "Middleware derives rather than replaces the incoming context. The new request carries both the original cancellation chain and the additional typed value to downstream handlers and services.",
  deepTitle: "Context values and cancellation boundaries",
  deep: paragraphs(
    "**Request context lifetime.** The server creates a context that carries the request's cancellation and deadline. Code should not keep it after the request as a long-lived container. A background job that must outlive the response needs its own explicit lifecycle and copied safe data.",
    "**Typed keys.** String keys can collide across packages. An unexported zero-sized key type, or an unexported value of a private type, gives ownership to one package. Getter helpers can return `(value, ok)` and keep assertions in one place.",
    "**Derived request.** `WithContext` returns a shallow copy of the request with the new context. The original request is not mutated. Passing the original to next would silently discard the added value even though the derived context was created correctly.",
    "**Cancellation.** Database calls, outgoing HTTP requests, and loops should accept or observe the request context. Cancellation is a signal, not a goroutine kill. Code that blocks in an API with no context support may continue until that API returns.",
    "**API design.** Required business inputs belong in typed function arguments. Context values fit information that crosses process or API boundaries along the request, such as authentication identity and trace metadata. This rule keeps functions readable and prevents hidden behavior from accumulating in a loosely typed bag."
  ),
  visualType: "flow_diagram",
  visualTitle: "Metadata and cancellation share one request chain",
  visual: "```mermaid\nflowchart LR\n  A[Server request context] --> B[Auth middleware verifies token]\n  B --> C[WithValue: typed user ID]\n  C --> D[r.WithContext]\n  D --> E[Handler reads user ID]\n  E --> F[Database call uses same context]\n  A -. cancellation .-> D\n  D -. cancellation .-> F\n```",
  codeTitle: "Typed request context example",
  files: {
    "go.mod": moduleFile(),
    "context.go": go(
      "package lesson",
      "",
      "import (",
      "\t\"context\"",
      "\t\"fmt\"",
      "\t\"net/http\"",
      ")",
      "",
      "type userIDKey struct{}",
      "",
      "func WithUser(userID string, next http.Handler) http.Handler {",
      "\treturn http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {",
      "\t\tctx := context.WithValue(r.Context(), userIDKey{}, userID)",
      "\t\tnext.ServeHTTP(w, r.WithContext(ctx))",
      "\t})",
      "}",
      "",
      "func UserID(ctx context.Context) (string, bool) { value, ok := ctx.Value(userIDKey{}).(string); return value, ok }",
      "func Profile(w http.ResponseWriter, r *http.Request) { userID, ok := UserID(r.Context()); if !ok { http.Error(w, \"missing user\", 401); return }; fmt.Fprint(w, userID) }"
    ),
    "context_test.go": go(
      "package lesson",
      "",
      "import (",
      "\t\"net/http\"",
      "\t\"net/http/httptest\"",
      "\t\"testing\"",
      ")",
      "",
      "func TestUserContext(t *testing.T) {",
      "\trecorder := httptest.NewRecorder()",
      "\tWithUser(\"u-7\", http.HandlerFunc(Profile)).ServeHTTP(recorder, httptest.NewRequest(http.MethodGet, \"/profile\", nil))",
      "\tif recorder.Code != 200 || recorder.Body.String() != \"u-7\" { t.Fatalf(\"status=%d body=%q\", recorder.Code, recorder.Body.String()) }",
      "}"
    ),
  },
  commands: ["go test -race ./...", "go vet ./..."],
  checks: [["go", "test", "-race", "./..."], ["go", "vet", "./..."]],
  codeNote: "The key type and getter stay private to the package contract; the endpoint receives the derived request rather than the original one.",
  followups: [
    "Why is a plain string a weak context key?",
    "Does context cancellation forcibly stop a goroutine?",
    "Which dependencies should remain explicit instead of living in context?",
  ],
});

add({
  topicSlug: "writing-json-responses",
  question: "What happens when `WriteHeader` or `Write` is called more than once?",
  title: "Understanding the one-way response commitment",
  direct: "The first `WriteHeader` commits the status and ordinary headers; later `WriteHeader` calls cannot replace it. If body bytes are written first, `net/http` implicitly commits status 200 and may detect a content type. Later body writes can append bytes, which can accidentally concatenate success and error output. Structure handlers so exactly one branch owns the final response.",
  quick: [
    "The first `WriteHeader` commits status and ordinary headers.",
    "A first `Write` without `WriteHeader` commits 200 automatically.",
    "Later `WriteHeader` calls do not change the committed status.",
    "Later `Write` calls append body bytes rather than replacing earlier output.",
    "Return immediately after an error response to prevent mixed bodies.",
  ],
  speaking: paragraphs(
    "- `http.ResponseWriter` has a one-way commitment point. Before commitment, the handler can set ordinary headers and choose a status. The first call to `WriteHeader` sends that choice. If the handler writes body bytes first, `net/http` automatically calls `WriteHeader(http.StatusOK)` and may infer a content type from the initial bytes.",
    "- Calling `WriteHeader` again does not revise the response. The server can log a superfluous call, but the client keeps the first status. Calling `Write` again is different: it can append more bytes to the body. That makes a missing `return` dangerous because an error JSON object can be followed by success JSON, producing an invalid or misleading response under the original status.",
    "- The safe branch returns as soon as it owns the response:\n\n```go\nif err != nil {\n    http.Error(w, \"invalid id\", http.StatusBadRequest)\n    return\n}\njson.NewEncoder(w).Encode(user)\n```\n\nWithout the return, `http.Error` has already committed its status and body, and the success JSON is appended rather than replacing it.",
    "- Informational 1xx responses have special rules, and declared trailers can be written later, but ordinary final headers and status remain committed. Interfaces wrapped by middleware add another concern: a wrapper that records status must mirror the first-write behavior accurately rather than accepting later codes as if they won.",
    "- I treat response writing as the final stage after parsing and application work whenever possible. One helper or one branch commits the final result, and every error branch returns. This keeps the handler easy to reason about and prevents attempts to recover from an encoding or write failure by sending a second HTTP response that the protocol cannot provide."
  ),
  overviewTitle: "A response can grow, but its first final status cannot be revised",
  overview: "Commitment freezes final status and ordinary headers. Additional writes may still extend the body, which is why accidental fall-through can be more confusing than a simple ignored status call.",
  deepTitle: "ResponseWriter commitment states",
  deep: paragraphs(
    "**Uncommitted state.** Header mutations are being prepared locally. The handler may still choose a final status and can abandon a response value that failed to marshal without having sent it to the client.",
    "**Explicit commitment.** `WriteHeader` sends the status and current headers. Only one final 2xx–5xx header is meaningful. Calling it early removes the ability to select a different final status after later work fails.",
    "**Implicit commitment.** `Write` must send a response, so it commits 200 when no status was chosen. For small initial writes, the server may use content detection if no content type was set. Relying on that for JSON is less clear than declaring the media type.",
    "**Body state.** More writes add more bytes. Two separately valid JSON objects written without an agreed streaming format do not become one valid JSON document. A status recorder or logging middleware should capture the first status and count all body bytes.",
    "**Response ownership consequence.** Complete fallible application work before commitment when practical. Use early returns for errors, or have inner functions return typed results to a thin HTTP adapter. Once writing begins, handle the write error for logging or cancellation, but do not try to erase bytes or send a replacement status."
  ),
  visualType: "flow_diagram",
  visualTitle: "ResponseWriter state changes",
  visual: "```mermaid\nstateDiagram-v2\n  [*] --> Uncommitted\n  Uncommitted --> Committed200: first Write\n  Uncommitted --> CommittedStatus: first WriteHeader(code)\n  Committed200 --> Committed200: later Write appends\n  CommittedStatus --> CommittedStatus: later Write appends\n  Committed200 --> Committed200: later WriteHeader ignored\n  CommittedStatus --> CommittedStatus: later WriteHeader ignored\n```",
  codeTitle: "Response commitment behavior",
  files: {
    "go.mod": moduleFile(),
    "commit.go": go(
      "package lesson",
      "",
      "import (",
      "\t\"fmt\"",
      "\t\"net/http\"",
      ")",
      "",
      "func ExampleHandler(w http.ResponseWriter, r *http.Request) {",
      "\tw.Header().Set(\"Content-Type\", \"text/plain\")",
      "\tw.WriteHeader(http.StatusAccepted)",
      "\t_, _ = fmt.Fprint(w, \"first\")",
      "\tw.WriteHeader(http.StatusInternalServerError)",
      "\t_, _ = fmt.Fprint(w, \"+second\")",
      "}"
    ),
    "commit_test.go": go(
      "package lesson",
      "",
      "import (",
      "\t\"net/http\"",
      "\t\"net/http/httptest\"",
      "\t\"testing\"",
      ")",
      "",
      "func TestFirstStatusWinsAndBodiesAppend(t *testing.T) {",
      "\trecorder := httptest.NewRecorder()",
      "\tExampleHandler(recorder, httptest.NewRequest(http.MethodGet, \"/\", nil))",
      "\tif recorder.Code != http.StatusAccepted || recorder.Body.String() != \"first+second\" {",
      "\t\tt.Fatalf(\"status=%d body=%q\", recorder.Code, recorder.Body.String())",
      "\t}",
      "}"
    ),
  },
  commands: ["go test -race ./...", "go vet ./..."],
  checks: [["go", "test", "-race", "./..."], ["go", "vet", "./..."]],
  codeNote: "The intentionally poor handler demonstrates protocol behavior. Real handlers should choose one response branch and return.",
  followups: [
    "What status is used when the first operation is `Write`?",
    "Why can a missing return create invalid JSON even though the status stays fixed?",
    "How should status-recording middleware handle repeated `WriteHeader` calls?",
  ],
});

add({
  topicSlug: "writing-json-responses",
  question: "How do you build a reusable JSON response and error helper without double writes?",
  title: "Centralising a stable JSON response contract",
  direct: "Use a helper that sets the JSON media type, commits one status, and writes one prepared response value. Keep the error envelope stable and make callers return immediately after invoking the helper. If marshaling can fail, marshal before `WriteHeader`; report the server-side cause internally and send a safe fallback only while the response is still uncommitted.",
  quick: [
    "Give success and error responses explicit Go structs.",
    "Set content type and commit status in one helper.",
    "Marshal before commitment when response encoding can fail.",
    "Return immediately after the helper writes an error.",
    "Log internal causes separately from stable public error codes.",
    "Do not attempt a second response after a write failure.",
  ],
  speaking: paragraphs(
    "- A reusable JSON helper is valuable when it owns a small, stable protocol rule rather than hiding all handler behavior. It should set `Content-Type`, choose one status, and write one JSON representation. Error responses should use an explicit envelope such as `code` and `message`, so clients do not have to parse changing Go error strings.",
    "- The safest small-value helper marshals before calling `WriteHeader`. If marshaling fails, no final response has been committed, so the handler can send a controlled 500 fallback. After marshaling succeeds, the helper sets the media type, commits the requested status, and writes the bytes. A write failure is then mainly an operational signal because the client may have disconnected and another response cannot replace the first.",
    "- A handler calls one helper and returns:\n\n```go\nerr := writeJSON(w, http.StatusNotFound, APIError{\n    Code: \"user_not_found\", Message: \"user was not found\",\n})\nif err != nil { log.Printf(\"write response: %v\", err) }\nreturn\n```\n\nThe server log can retain the internal cause separately; the client receives a stable safe shape.",
    "- A universal helper has limits. Streaming, file downloads, 204 responses, and endpoints with custom caching or content negotiation may need different writers. JSON encoding can also fail for custom marshalers, so a helper returning an error makes that boundary testable. Middleware cannot reliably send a neat JSON error after downstream code has already committed bytes.",
    "- I keep the helper narrow, return its error for logging, and enforce one ownership rule: the code that invokes it does not write again. This removes repeated header ordering and keeps public error vocabulary consistent without turning every endpoint into the same response. Reuse is useful because the HTTP contract is repeated, not because all application outcomes are identical."
  ),
  overviewTitle: "Shared JSON protocol and endpoint decisions",
  overview: "The helper should standardise media type, one status commitment, and a response envelope. The endpoint still decides which outcome occurred and must stop after handing ownership of the response to the helper.",
  deepTitle: "Response preparation, commitment, and reporting",
  deep: paragraphs(
    "**Typed envelopes.** Named response structs make JSON field names and omission rules reviewable. A public error code should remain stable enough for clients; a human message can be clearer but should not expose secrets or low-level causes.",
    "**Preparation.** `json.Marshal` completes encoding before touching the writer. This uses memory proportional to the payload, which is reasonable for small API objects and less suitable for huge or streaming responses. Known simple structs can also be encoded directly under a documented error policy.",
    "**Commitment.** After bytes are ready, set the media type, call `WriteHeader` once, and write. A 204 response should not carry a JSON body, so callers need either a separate path or a helper that explicitly understands bodyless statuses.",
    "**Reporting.** Marshal failure is an internal server problem. A write failure may mean the connection disappeared after partial output. Log these causes with safe context, but do not call the same helper recursively after the final status may already have left the process.",
    "**Caller discipline.** Every call is followed by `return` unless it is the final statement. Tests should verify one status, one valid document, and the public fields. A custom recording writer can additionally prove that a helper does not make multiple final `WriteHeader` calls."
  ),
  visualType: "flow_diagram",
  visualTitle: "One helper owns the final response",
  visual: "```mermaid\nflowchart LR\n  A[Handler chooses outcome] --> B[Build typed response]\n  B --> C{Marshal succeeds?}\n  C -->|No, still uncommitted| D[Safe 500 fallback]\n  C -->|Yes| E[Set JSON header]\n  E --> F[Commit one status]\n  F --> G[Write bytes once]\n  G --> H[Caller returns]\n```",
  codeTitle: "Marshal-first JSON helper",
  files: {
    "go.mod": moduleFile(),
    "json.go": go(
      "package lesson",
      "",
      "import (",
      "\t\"encoding/json\"",
      "\t\"log\"",
      "\t\"net/http\"",
      ")",
      "",
      "type APIError struct { Code string `json:\"code\"`; Message string `json:\"message\"` }",
      "",
      "func writeJSON(w http.ResponseWriter, status int, value any) error {",
      "\tbody, err := json.Marshal(value)",
      "\tif err != nil { return err }",
      "\tw.Header().Set(\"Content-Type\", \"application/json\")",
      "\tw.WriteHeader(status)",
      "\t_, err = w.Write(append(body, '\\n'))",
      "\treturn err",
      "}",
      "",
      "func MissingUser(w http.ResponseWriter, r *http.Request) {",
      "\tif err := writeJSON(w, http.StatusNotFound, APIError{Code: \"user_not_found\", Message: \"user was not found\"}); err != nil {",
      "\t\tlog.Printf(\"write API error: %v\", err)",
      "\t}",
      "}"
    ),
    "json_test.go": go(
      "package lesson",
      "",
      "import (",
      "\t\"encoding/json\"",
      "\t\"net/http\"",
      "\t\"net/http/httptest\"",
      "\t\"testing\"",
      ")",
      "",
      "func TestMissingUser(t *testing.T) {",
      "\trecorder := httptest.NewRecorder()",
      "\tMissingUser(recorder, httptest.NewRequest(http.MethodGet, \"/users/9\", nil))",
      "\tvar body APIError",
      "\tif err := json.Unmarshal(recorder.Body.Bytes(), &body); err != nil { t.Fatal(err) }",
      "\tif recorder.Code != 404 || body.Code != \"user_not_found\" { t.Fatalf(\"status=%d body=%+v\", recorder.Code, body) }",
      "}"
    ),
  },
  commands: ["go test -race ./...", "go vet ./..."],
  checks: [["go", "test", "-race", "./..."], ["go", "vet", "./..."]],
  codeNote: "The helper returns write or marshal errors so production callers can log them; it never attempts a second response after commitment.",
  followups: [
    "Why is marshaling first helpful for a small response with a custom marshaler?",
    "Why should a public error code differ from an internal error string?",
    "Which response types should not be forced through this JSON helper?",
  ],
});

add({
  topicSlug: "request-parsing",
  question: "How do you safely decode a JSON request body in a Go HTTP handler?",
  title: "Decoding a bounded JSON request body",
  direct: "Limit the body with `http.MaxBytesReader`, decode into a purpose-built struct, optionally reject unknown fields, and check that no second JSON value follows. Classify an oversized body separately from malformed JSON, validate decoded fields, and return immediately after errors. A decoder accepts a stream, so one successful `Decode` alone does not prove the body contains exactly one value.",
  quick: [
    "Limit request bytes before decoding with `http.MaxBytesReader`.",
    "Decode into a narrow request struct, not a general domain object.",
    "Use `DisallowUnknownFields` when the endpoint promises strict fields.",
    "Decode again and require `io.EOF` to reject a second JSON value.",
    "Separate syntax/type errors, size errors, and business validation.",
    "Return after writing any error response.",
  ],
  speaking: paragraphs(
    "- Safe JSON handling begins with a boundary, not with `Decode`. The request body is controlled by the client, so the handler should cap the number of bytes it is willing to read. `http.MaxBytesReader` wraps the body and reports a `*http.MaxBytesError` after the limit, allowing the endpoint to return 413 instead of consuming an arbitrary payload.",
    "- Next, decode into a request-specific struct. `json.Decoder` reads one JSON value from a stream. Calling `DisallowUnknownFields` can catch misspelled fields when the contract is strict. After the first successful decode, a second decode should return `io.EOF`; otherwise the body contained another value such as `{...}{...}` that a single decode would leave unread.",
    "- The safe sequence is visible in a few lines:\n\n```go\nr.Body = http.MaxBytesReader(w, r.Body, 1024)\ndec := json.NewDecoder(r.Body)\ndec.DisallowUnknownFields()\nif err := dec.Decode(&input); err != nil { /* classify and return */ }\nif err := dec.Decode(&struct{}{}); !errors.Is(err, io.EOF) { /* reject */ }\n```\n\nThe endpoint then validates decoded fields before doing business work.",
    "- Strict unknown-field rejection is a compatibility choice. It helps detect client mistakes but can make additive request changes harder for older servers or forwarding components. Error details from the decoder may expose implementation wording, so a public API often logs the detailed error with a request identifier and sends a simpler response.",
    "- I keep parsing and domain validation visibly separate and never continue after writing an error. The server handles closing an inbound request body, although code that creates client requests owns those response bodies differently. The result is one bounded, single-value, typed input before business work begins."
  ),
  overviewTitle: "Bounded single-value JSON input",
  overview: "Each step answers a different question: can the request consume too much memory, is the JSON structurally valid, is there exactly one value, and do the decoded values satisfy the endpoint's rules?",
  deepTitle: "The JSON decoding pipeline",
  deep: paragraphs(
    "**Byte boundary.** Place `MaxBytesReader` around `r.Body` before constructing the decoder. The wrapper needs the response writer so the server can help close the connection when appropriate. A size cap should be based on the endpoint's real maximum rather than one number copied across uploads and small commands.",
    "**Shape boundary.** A dedicated struct documents accepted fields and types. Missing JSON fields receive Go zero values unless pointers, custom types, or later validation distinguish absence. `DisallowUnknownFields` rejects unknown object keys, but it reports the first one rather than acting as a full schema validator.",
    "**Stream boundary.** JSON values can be adjacent in a stream. The first `Decode` returning nil means one value decoded, not that the body ended. A second decode must return `io.EOF` for a one-document endpoint. Whitespace after the value is fine.",
    "**Meaning boundary.** The decoder can place `-1` into an integer field and an empty string into a name. Domain rules still decide whether those values are allowed. Keep the messages stable while retaining the underlying error for logs or tests.",
    "**Operational boundary.** Error paths must return before calling storage or writing success. Avoid echoing arbitrary decoder errors to clients, and never log the entire body when it can contain credentials or personal data. Parsing is successful only when all four boundaries pass."
  ),
  visualType: "flow_diagram",
  visualTitle: "One safe JSON decoding pipeline",
  visual: "```mermaid\nflowchart LR\n  A[Limit bytes] --> B[Decode into request struct]\n  B --> C{Decode error?}\n  C -->|MaxBytesError| D[413 Too Large]\n  C -->|Other error| E[400 Bad Request]\n  C -->|No| F[Decode again]\n  F --> G{io.EOF?}\n  G -->|No| E\n  G -->|Yes| H[Validate field meaning]\n  H --> I[Run business logic]\n```",
  codeTitle: "Bounded JSON body decoder",
  files: {
    "go.mod": moduleFile(),
    "decode.go": go(
      "package lesson",
      "",
      "import (",
      "\t\"encoding/json\"",
      "\t\"errors\"",
      "\t\"io\"",
      "\t\"net/http\"",
      ")",
      "",
      "type createUser struct { Name string `json:\"name\"`; Age int `json:\"age\"` }",
      "",
      "func CreateUser(w http.ResponseWriter, r *http.Request) {",
      "\tr.Body = http.MaxBytesReader(w, r.Body, 1024)",
      "\tdecoder := json.NewDecoder(r.Body)",
      "\tdecoder.DisallowUnknownFields()",
      "\tvar input createUser",
      "\tif err := decoder.Decode(&input); err != nil {",
      "\t\tvar tooLarge *http.MaxBytesError",
      "\t\tif errors.As(err, &tooLarge) { http.Error(w, \"body too large\", http.StatusRequestEntityTooLarge); return }",
      "\t\thttp.Error(w, \"invalid JSON\", http.StatusBadRequest); return",
      "\t}",
      "\tif err := decoder.Decode(&struct{}{}); !errors.Is(err, io.EOF) { http.Error(w, \"one JSON value required\", http.StatusBadRequest); return }",
      "\tif input.Name == \"\" || input.Age < 0 { http.Error(w, \"invalid user\", http.StatusBadRequest); return }",
      "\tw.WriteHeader(http.StatusCreated)",
      "}"
    ),
    "decode_test.go": go(
      "package lesson",
      "",
      "import (",
      "\t\"net/http\"",
      "\t\"net/http/httptest\"",
      "\t\"strings\"",
      "\t\"testing\"",
      ")",
      "",
      "func TestCreateUser(t *testing.T) {",
      "\tfor _, test := range []struct{ body string; want int }{",
      "\t\t{`{\"name\":\"Ada\",\"age\":36}`, http.StatusCreated},",
      "\t\t{`{\"name\":\"Ada\"}{\"name\":\"Lin\"}`, http.StatusBadRequest},",
      "\t\t{`{\"name\":\"\",\"age\":1}`, http.StatusBadRequest},",
      "\t\t{`{\"name\":\"` + strings.Repeat(\"a\", 1100) + `\",\"age\":1}`, http.StatusRequestEntityTooLarge},",
      "\t} {",
      "\t\trecorder := httptest.NewRecorder()",
      "\t\tCreateUser(recorder, httptest.NewRequest(http.MethodPost, \"/users\", strings.NewReader(test.body)))",
      "\t\tif recorder.Code != test.want { t.Fatalf(\"body=%s status=%d\", test.body, recorder.Code) }",
      "\t}",
      "}"
    ),
  },
  commands: ["go test -race ./...", "go vet ./..."],
  checks: [["go", "test", "-race", "./..."], ["go", "vet", "./..."]],
  codeNote: "The second decode is intentional: only `io.EOF` proves that whitespace, rather than another JSON document, follows the accepted value.",
  followups: [
    "Why is one successful `Decode` not enough for a one-object endpoint?",
    "What trade-off comes with `DisallowUnknownFields`?",
    "How would you distinguish an absent integer field from an explicit zero?",
  ],
});

add({
  topicSlug: "request-parsing",
  question: "How should a Go handler distinguish malformed input from invalid business data?",
  title: "Separating parsing errors from validation errors",
  direct: "Parsing asks whether transport text has the required syntax and type; validation asks whether the resulting value is allowed by the application. Return a client error for both, but keep stable, field-specific codes or messages so callers know what to fix. Reserve 500 responses for server failures, and never run business work after either input stage fails.",
  quick: [
    "Parsing converts HTTP text or JSON into typed Go values.",
    "Validation checks required fields, ranges, relationships, and domain rules.",
    "Malformed syntax and invalid meaning should have distinct stable error codes.",
    "Use 4xx for client input errors and 5xx for server failures.",
    "Do not expose internal decoder, database, or stack details to clients.",
  ],
  speaking: paragraphs(
    "- Parsing and validation are separate boundaries. Parsing answers whether the transport representation can become the expected Go type: is the path value an integer, is the body valid JSON, and do JSON field types match? Validation starts only after parsing and asks whether those typed values are acceptable for the use case.",
    "- A clear handler converts input into a request-specific struct, records parsing failures with a stable client-facing code, then runs validation rules such as required names, positive quantities, or a start date preceding an end date. Business conflicts, such as an already-used username, may need another status such as 409 because the representation is valid but current resource state prevents the operation.",
    "- The stage boundary should also be clear in code:\n\n```go\nif err := decoder.Decode(&input); err != nil {\n    writeError(w, 400, \"invalid_json\"); return\n}\nif input.Quantity < 1 {\n    writeError(w, 422, \"invalid_quantity\"); return\n}\n```\n\nA database outage after these checks is a server failure and should not be blamed on the client.",
    "- Status choices should be consistent across the API. Some teams use 400 for both syntax and semantic input errors; others use 422 for well-formed but invalid content. Either can be workable when documented. More important is a stable response shape, no leaking of internal errors, and a request identifier that connects the safe response to detailed server logs.",
    "- I make the stages visible in code and tests: decode, validate, execute, respond. Each failed stage returns immediately. This prevents a common double-response bug and gives learners a durable mental model: transport errors describe what could not be read, domain errors describe what was read but cannot be accepted."
  ),
  overviewTitle: "Syntax, meaning, and execution fail for different reasons",
  overview: "A client can send bytes that cannot be decoded, typed values that violate a rule, or a valid command that the server fails to execute. Keeping those classes separate improves status selection, logs, tests, and correction guidance.",
  deepTitle: "The input error contract",
  deep: paragraphs(
    "**Parse failures.** Examples include malformed JSON, a string where a number is required, an invalid UUID, or an unknown enum spelling. The handler cannot construct the requested typed input. A 400 response is a common choice, with a short public code rather than raw library text.",
    "**Validation failures.** The representation decoded, but a rule is false: a required string is blank, a quantity is outside its range, or two fields conflict. Field-level details can help a form, provided they use stable names and do not expose sensitive policy.",
    "**State conflicts.** A valid command may conflict with current state. Duplicate resource creation, stale versions, and unavailable transitions are not JSON failures. Depending on the contract, 409 or another specific 4xx status can explain the boundary more accurately.",
    "**Server failures.** Timeouts to storage, bugs, and unavailable dependencies belong to the server side. Log their underlying causes securely and return a general 5xx response. Turning every error into 400 hides incidents and makes client retries or corrections ineffective.",
    "**Consistency.** Define one JSON error envelope, status policy, and test table for the service. The exact 400-versus-422 choice matters less than using it predictably. Every branch should return after the response, and successful business work should be unreachable until parsing and validation both complete."
  ),
  visualType: "flow_diagram",
  visualTitle: "Failure stages and response classes",
  visual: "```mermaid\nflowchart LR\n  A[HTTP bytes] --> B{Parse into types}\n  B -->|Fails| C[400 malformed input]\n  B -->|Succeeds| D{Validate meaning}\n  D -->|Fails| E[400 or 422 validation error]\n  D -->|Succeeds| F{Execute use case}\n  F -->|State conflict| G[409 contract conflict]\n  F -->|Server failure| H[5xx safe response + internal log]\n  F -->|Succeeds| I[Success response]\n```",
  codeTitle: "Input error stage example",
  files: {
    "go.mod": moduleFile(),
    "order.go": go(
      "package lesson",
      "",
      "import (",
      "\t\"encoding/json\"",
      "\t\"log\"",
      "\t\"net/http\"",
      ")",
      "",
      "type orderInput struct { Quantity int `json:\"quantity\"` }",
      "type apiError struct { Code string `json:\"code\"`; Message string `json:\"message\"` }",
      "",
      "func writeError(w http.ResponseWriter, status int, code, message string) {",
      "\tw.Header().Set(\"Content-Type\", \"application/json\")",
      "\tw.WriteHeader(status)",
      "\tif err := json.NewEncoder(w).Encode(apiError{Code: code, Message: message}); err != nil {",
      "\t\tlog.Printf(\"write API error: %v\", err)",
      "\t}",
      "}",
      "",
      "func CreateOrder(w http.ResponseWriter, r *http.Request) {",
      "\tvar input orderInput",
      "\tif err := json.NewDecoder(r.Body).Decode(&input); err != nil { writeError(w, 400, \"invalid_json\", \"body must contain a numeric quantity\"); return }",
      "\tif input.Quantity < 1 { writeError(w, 422, \"invalid_quantity\", \"quantity must be positive\"); return }",
      "\tw.WriteHeader(http.StatusCreated)",
      "}"
    ),
    "order_test.go": go(
      "package lesson",
      "",
      "import (",
      "\t\"net/http\"",
      "\t\"net/http/httptest\"",
      "\t\"strings\"",
      "\t\"testing\"",
      ")",
      "",
      "func TestErrorStages(t *testing.T) {",
      "\tfor _, test := range []struct{ body string; want int }{{`{\"quantity\":\"many\"}`, 400}, {`{\"quantity\":0}`, 422}, {`{\"quantity\":2}`, 201}} {",
      "\t\trecorder := httptest.NewRecorder()",
      "\t\tCreateOrder(recorder, httptest.NewRequest(http.MethodPost, \"/orders\", strings.NewReader(test.body)))",
      "\t\tif recorder.Code != test.want { t.Fatalf(\"body=%s status=%d\", test.body, recorder.Code) }",
      "\t}",
      "}"
    ),
  },
  commands: ["go test -race ./...", "go vet ./..."],
  checks: [["go", "test", "-race", "./..."], ["go", "vet", "./..."]],
  codeNote: "The compact sample focuses on stage classification. A production helper should also handle or log an unexpected response-encoding error.",
  followups: [
    "When might 409 be clearer than 422?",
    "Why should raw decoder errors not become a public API contract?",
    "What bug can occur if an error branch writes a response but does not return?",
  ],
});

function plainWords(value) {
  return String(value)
    .replace(/```[\s\S]*?```/g, " ")
    .replace(/[`*_#>|~-]/g, " ")
    .split(/\s+/)
    .filter(Boolean).length;
}

function metaDescription(value) {
  const plain = value.replace(/[`*_#]/g, "").replace(/\s+/g, " ").trim();
  return plain.length <= 210 ? plain : `${plain.slice(0, 207).trimEnd()}...`;
}

function metaTitle(value) {
  const suffix = " | Go interview";
  const limit = 80 - suffix.length;
  return `${value.length <= limit ? value : value.slice(0, limit).trimEnd()}${suffix}`;
}

function writeExampleFiles(root, files) {
  for (const [relative, file] of Object.entries(files)) {
    const target = path.join(root, relative);
    fs.mkdirSync(path.dirname(target), { recursive: true });
    fs.writeFileSync(target, formatSource(file));
  }
}

function validateExamples() {
  const validationRoot = fs.mkdtempSync(path.join(os.tmpdir(), "go-http-server-gold-"));
  const buildCache = process.env.GOCACHE || path.join(os.tmpdir(), "go-http-server-gold-build-cache");
  const moduleCache = process.env.GOMODCACHE || path.join(os.tmpdir(), "go-http-server-gold-module-cache");
  fs.mkdirSync(buildCache, { recursive: true });
  fs.mkdirSync(moduleCache, { recursive: true });
  try {
    lessons.forEach((lesson, index) => {
      const root = path.join(validationRoot, `${String(index + 1).padStart(2, "0")}-${lesson.topicSlug}`);
      fs.mkdirSync(root, { recursive: true });
      writeExampleFiles(root, lesson.files);
      const checks = [
        ...(lesson.files["go.mod"]?.text.includes("github.com/gin-gonic/gin")
          ? [["go", "mod", "tidy"]]
          : []),
        ...(lesson.checks ?? [["go", "test", "-race", "./..."], ["go", "vet", "./..."]]),
      ];
      for (const [command, ...args] of checks) {
        const result = spawnSync(command, args, {
          cwd: root,
          env: { ...process.env, GOWORK: "off", GOCACHE: buildCache, GOMODCACHE: moduleCache },
          encoding: "utf8",
          timeout: 120_000,
        });
        if (result.error || result.status !== 0) {
          throw new Error(
            `${lesson.question}: ${[command, ...args].join(" ")} failed.\n${result.error?.message ?? ""}\n${result.stdout}${result.stderr}`
          );
        }
      }
    });
  } finally {
    fs.rmSync(validationRoot, { recursive: true, force: true });
  }
  console.log("Validated all 24 Go HTTP examples with their declared test, race, and vet checks.");
}

function curateTopic(topicSlug, specs) {
  if (specs.length !== 3) throw new Error(`${topicSlug} must contain exactly three lessons.`);
  const file = path.join(moduleRoot, topicSlug, "complete-qa.json");
  const document = JSON.parse(fs.readFileSync(file, "utf8"));
  const retained = document.questions.slice(0, 3);
  if (retained.length !== 3) throw new Error(`${topicSlug} is missing q001-q003.`);

  document.topic = topicTitles[topicSlug];
  document.questions = specs.map((spec, index) => {
    const previous = retained[index];
    const suffix = `q00${index + 1}`;
    if (!previous.id.endsWith(suffix)) {
      throw new Error(`${topicSlug} expected ${suffix}; found ${previous.id}.`);
    }
    if (spec.quick.length < 4 || spec.quick.length > 6) {
      throw new Error(`${previous.id} has ${spec.quick.length} quick-revision points.`);
    }
    const interviewBlocks = spec.speaking.split(/\n\s*\n/).filter(Boolean);
    const deepBlocks = spec.deep.split(/\n\s*\n/).filter(Boolean);
    if (interviewBlocks.length < 3 || deepBlocks.length < 3) {
      throw new Error(`${previous.id} is missing an independently structured teaching phase.`);
    }
    if (!spec.speaking.includes("```go")) {
      throw new Error(`${previous.id} is missing the useful Interview Answer code example.`);
    }
    if (!spec.files || Object.keys(spec.files).length === 0) {
      throw new Error(`${previous.id} has no runnable example.`);
    }

    const codeExample = `${renderFiles(spec.files, spec.commands)}\n\n${spec.codeNote}`;
    const sections = [
      { type: "key_points", title: "Quick revision", items: spec.quick },
      {
        type: "speakable_answer",
        title: "Interview answer",
        answerSize: "standard",
        content: spec.speaking,
      },
      { type: "overview", title: spec.overviewTitle, content: spec.overview },
      { type: "deep_explanation", title: spec.deepTitle, content: spec.deep },
      { type: spec.visualType, title: spec.visualTitle, content: spec.visual },
      { type: "code_example", title: spec.codeTitle, content: codeExample },
    ];
    const totalWords = [spec.direct, spec.speaking, spec.overview, spec.deep, spec.visual, codeExample]
      .map(plainWords)
      .reduce((sum, count) => sum + count, 0);
    const { interviewer_intent: _intent, speakable_v2: _oldSpeaking, ...stable } = previous;
    return {
      ...stable,
      question: spec.question,
      title: spec.title,
      direct_answer: spec.direct,
      layout_type: "concept-explanation",
      difficulty: "easy",
      importance: "high",
      reading_time_minutes: Math.max(5, Math.ceil(totalWords / 200)),
      last_updated: "2026-09-07",
      answer: { sections },
      followup_questions: spec.followups,
      order: index + 1,
      seo: {
        ...previous.seo,
        metaTitle: metaTitle(spec.title),
        metaDescription: metaDescription(spec.direct),
      },
    };
  });
  fs.writeFileSync(file, `${JSON.stringify(document, null, 2)}\n`);
}

function replaceIndexedModule(indexSource, moduleSlug, transform) {
  const marker = `"moduleSlug": "${moduleSlug}"`;
  const markerIndex = indexSource.indexOf(marker);
  if (markerIndex < 0) throw new Error(`${moduleSlug} is missing from _index.json.`);
  const objectStart = indexSource.lastIndexOf("\n    {", markerIndex) + 1;
  if (objectStart <= 0) throw new Error(`Could not locate ${moduleSlug} object start.`);
  let depth = 0;
  let inString = false;
  let escaped = false;
  let objectEnd = -1;
  for (let index = objectStart; index < indexSource.length; index += 1) {
    const character = indexSource[index];
    if (inString) {
      if (escaped) escaped = false;
      else if (character === "\\") escaped = true;
      else if (character === '"') inString = false;
      continue;
    }
    if (character === '"') inString = true;
    else if (character === "{") depth += 1;
    else if (character === "}") {
      depth -= 1;
      if (depth === 0) {
        objectEnd = index + 1;
        break;
      }
    }
  }
  if (objectEnd < 0) throw new Error(`Could not locate ${moduleSlug} object end.`);
  const current = JSON.parse(indexSource.slice(objectStart, objectEnd));
  const rendered = JSON.stringify(transform(current), null, 2)
    .split("\n")
    .map((line) => `    ${line}`)
    .join("\n")
    .replace(/[^\x00-\x7f]/g, (character) =>
      `\\u${character.charCodeAt(0).toString(16).padStart(4, "0")}`
    );
  return `${indexSource.slice(0, objectStart)}${rendered}${indexSource.slice(objectEnd)}`;
}

function curateModuleDocuments() {
  const intro = "Learn Go HTTP by following a request from route registration to a safe response. The module covers handlers, server lifecycle and graceful shutdown, bounded input parsing, JSON commitment rules, middleware order and context, Go 1.22+ ServeMux patterns, Gin's core boundaries, and the test or framework choice that fits the behavior. Every retained question has a direct revision answer, a natural interview explanation, an independent guided lesson, and a runnable example.";
  const configPath = path.join(moduleRoot, "_config.json");
  const config = JSON.parse(fs.readFileSync(configPath, "utf8"));
  Object.assign(config, {
    title: "Go HTTP Servers, Routing, and Middleware",
    topics: topicOrder,
    intro,
    questionCount: 24,
    status: "gold-standard",
    lastUpdated: "2026-09-07",
  });
  fs.writeFileSync(configPath, `${JSON.stringify(config, null, 2)}\n`);

  const revision = {
    title: "Go HTTP Servers, Routing, and Middleware — Revision",
    estimatedMinutes: 16,
    questionCount: 24,
    status: "gold-standard",
    lastUpdated: "2026-09-07",
    sections: [
      {
        id: "handler-and-server",
        title: "Handlers and server lifecycle",
        body: "- `http.Handler` is the common boundary; `HandlerFunc` adapts a matching function. Handlers must assume concurrent calls and protect shared mutable state.\n- An explicit `http.Server` makes the handler, timeout policy, and shutdown ownership visible. Serving blocks and returns a non-nil error; `ErrServerClosed` is expected after a planned stop.\n- Graceful shutdown closes listeners and idle connections, then waits for ordinary active requests under a deadline. Hijacked connections and application workers need separate lifecycle handling.",
      },
      {
        id: "request-and-response",
        title: "Request and response boundaries",
        body: "- Path values identify matched route segments, query values carry options, and headers carry request metadata. Convert transport strings into a typed input before business work.\n- Limit JSON body bytes, decode one value into a narrow struct, and separate malformed representation from invalid business meaning.\n- Response headers and status become fixed at the first `WriteHeader` or body write. Set JSON content type first, commit once, write one document, and return after every error response.",
      },
      {
        id: "middleware-and-routing",
        title: "Middleware and ServeMux routing",
        body: "- Middleware wraps `http.Handler`. For `A(B(handler))`, request work runs A, B, handler; return work runs B, A. Early rejection writes once and returns.\n- Request context carries cancellation and narrow request-scoped values. Private key types avoid collisions; normal service dependencies remain explicit.\n- Go 1.22+ ServeMux patterns can include methods and wildcards. Most-specific request sets win, incomparable overlaps panic during registration, and route tests should pass through the mux.",
      },
      {
        id: "gin-and-tests",
        title: "Gin and HTTP test boundaries",
        body: "- `gin.New` starts without middleware; `gin.Default` adds Logger and Recovery. Should-bind methods leave response control with the handler, while must-bind methods commit a 400 on failure.\n- `c.Next` runs pending Gin handlers; abort prevents pending handlers but does not return from the current function. Copy Gin context before asynchronous read use.\n- Use a recorder for handler and route contracts. Use a loopback test server when client redirects, cookies, TLS, or transport behavior must participate. Choose Gin or ServeMux from team needs and real endpoint evidence.",
      },
    ],
  };
  fs.writeFileSync(path.join(moduleRoot, "_revision.json"), `${JSON.stringify(revision, null, 2)}\n`);

  const indexPath = path.join(domainRoot, "_index.json");
  const indexSource = fs.readFileSync(indexPath, "utf8");
  const updatedIndex = replaceIndexedModule(indexSource, "http-server-basics-go", (module) => ({
    ...module,
    title: config.title,
    topics: topicOrder,
    intro,
    questionCount: 24,
    status: "gold-standard",
    lastUpdated: "2026-09-07",
  }));
  JSON.parse(updatedIndex);
  fs.writeFileSync(indexPath, updatedIndex);
}

function auditWrittenModule() {
  const ids = new Set();
  const slugs = new Set();
  const questions = new Set();
  const forbidden = /interviewer_expectation|interviewer_intent|speakable_v2|what the interviewer wants|to stand out/i;
  const editorialHeading = /^(start|begin|follow|see|know|remember|trace)\b/i;
  for (const topicSlug of topicOrder) {
    const document = JSON.parse(fs.readFileSync(path.join(moduleRoot, topicSlug, "complete-qa.json"), "utf8"));
    if (document.questions.length !== 3) throw new Error(`${topicSlug} wrote ${document.questions.length} questions.`);
    document.questions.forEach((question, index) => {
      if (!question.id.endsWith(`q00${index + 1}`)) throw new Error(`${question.id} did not preserve its route position.`);
      for (const [label, value, set] of [
        ["id", question.id, ids],
        ["slug", question.slug, slugs],
        ["question", question.question.toLowerCase(), questions],
      ]) {
        if (set.has(value)) throw new Error(`Duplicate ${label}: ${value}`);
        set.add(value);
      }
      if (forbidden.test(JSON.stringify(question))) throw new Error(`${question.id} retained coaching or generated-shell content.`);
      const sections = question.answer?.sections ?? [];
      if (sections.length !== 6) throw new Error(`${question.id} does not have six teaching components.`);
      const quick = sections.find((section) => section.type === "key_points");
      const interview = sections.find((section) => section.type === "speakable_answer");
      const deep = sections.find((section) => section.type === "deep_explanation");
      const code = sections.find((section) => section.type === "code_example");
      if (!quick || quick.items.length < 4 || quick.items.length > 6) throw new Error(`${question.id} has invalid revision points.`);
      if (!interview?.content || !deep?.content || !code?.content.includes("```go")) throw new Error(`${question.id} has an incomplete teaching phase.`);
      if (editorialHeading.test(deep.title) || sections.some((section) => editorialHeading.test(section.title))) {
        throw new Error(`${question.id} uses an editorial section heading.`);
      }
      if ((question.followup_questions ?? []).length !== 3) throw new Error(`${question.id} needs three specific follow-ups.`);
    });
  }
  const config = JSON.parse(fs.readFileSync(path.join(moduleRoot, "_config.json"), "utf8"));
  const revision = JSON.parse(fs.readFileSync(path.join(moduleRoot, "_revision.json"), "utf8"));
  if (config.questionCount !== 24 || revision.questionCount !== 24) throw new Error("Module documents must report 24 questions.");
  const index = JSON.parse(fs.readFileSync(path.join(domainRoot, "_index.json"), "utf8"));
  const indexed = index.modules.find((module) => module.moduleSlug === "http-server-basics-go");
  if (!indexed || indexed.questionCount !== 24 || indexed.status !== "gold-standard") {
    throw new Error("Canonical index does not contain the curated M14 metadata.");
  }
}

const byTopic = new Map(topicOrder.map((topic) => [topic, []]));
for (const lesson of lessons) {
  const entries = byTopic.get(lesson.topicSlug);
  if (!entries) throw new Error(`Unexpected topic ${lesson.topicSlug}.`);
  entries.push(lesson);
}
if (lessons.length !== 24) throw new Error(`Expected 24 lessons; found ${lessons.length}.`);

for (const topic of topicOrder) curateTopic(topic, byTopic.get(topic));
curateModuleDocuments();
auditWrittenModule();

if (process.argv.includes("--validate-examples")) validateExamples();

console.log("Curated Go M14 http-server-basics-go: 24 gold lessons; retained q001-q003 and removed q004-q005 from eight topics.");
