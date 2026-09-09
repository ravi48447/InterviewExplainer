import { curateModule } from "./.work-curate-go-shells-lib.mjs";

curateModule("cloud-deployment-go", {
  "go-binary-deployment": {
    label: "deploying a Go binary",
    alt: "shipping source code and compiling on the server",
    definition: "A Go deployment usually promotes a compiled executable built from a known source revision and module graph. The release also defines its target operating system and architecture, runtime configuration, service identity, network address, files, and shutdown behaviour.",
    mechanism: "`go build` translates packages and linked dependencies into an executable for the selected `GOOS` and `GOARCH`. CGO, build tags, embedded files, version metadata, and compiler version can all affect what the artifact needs at runtime.",
    use: "Build once in CI and promote the same tested artifact through environments when reproducibility matters. Run it under a service manager, container runtime, or orchestrator that supplies configuration, restarts, logs, health checks, and resource controls.",
    example: "CI can build `CGO_ENABLED=0 GOOS=linux GOARCH=amd64 go build -trimpath -o api ./cmd/api`, calculate a checksum, and publish that immutable artifact. Production verifies the checksum and provides environment-specific settings.",
    mistake: "Failures often come from compiling for the wrong platform, relying on unavailable dynamic libraries, forgetting certificates or migrations, binding only to localhost, embedding secrets, or replacing the binary without a safe restart and rollback plan.",
    contrast: "A prebuilt artifact is fast to start and proves that every environment runs the same bits. Building on each server can adapt to that host, but it requires compilers and source there and makes releases harder to reproduce and audit.",
    boundary: "A single executable does not contain the host kernel, external configuration, database schema, certificates, or every dynamically linked library. Static linking also does not remove the need for patching, provenance, access control, and observability.",
    repair: "Record the source revision and toolchain, test on the target platform, inspect linkage, include required runtime files, run as a restricted user, expose build information, and rehearse health-checked rollout, graceful shutdown, and rollback.",
    scenario: "When a binary works in CI but not on the server, compare architecture, operating system, CGO linkage, user permissions, environment, current directory, ports, certificates, and files. The exact startup error usually identifies the first broken runtime assumption.",
    quick: ["The executable is the main release artifact", "Target OS and architecture are build inputs", "CGO can add native runtime dependencies", "Configuration belongs outside the artifact", "Deployment includes startup, health, shutdown, and rollback"],
    deep: "Compilation makes Go deployment compact, but the binary is only one part of the process contract. CI should produce the artifact from locked module requirements, run tests, record provenance, and publish a checksum or signed package. Cross-compilation is straightforward for pure-Go code but native dependencies can require a matching C toolchain and libraries. At runtime, the service needs a dedicated identity, a working directory only if the program assumes one, network and filesystem permissions, trusted certificates, configuration, and limits. The process manager should start the binary directly, collect standard output and error, and send termination signals. The application should stop accepting new requests, finish in-flight work within a deadline, and exit with a meaningful status. A rollout observes readiness before sending traffic and keeps the previous artifact available. These details turn “copy one binary” into a repeatable, reversible release instead of a manual server change.",
    code: String.raw`~~~sh
CGO_ENABLED=0 GOOS=linux GOARCH=amd64 \
  go build -trimpath -ldflags "-X main.version=$VERSION" \
  -o dist/catalog-api ./cmd/catalog-api
sha256sum dist/catalog-api
~~~`,
    flow: "```mermaid\nflowchart LR\n  A[Source + go.mod] --> B[Test and build in CI]\n  B --> C[Versioned binary + checksum]\n  C --> D[Deploy unchanged artifact]\n  D --> E[Health check]\n  E --> F[Traffic or rollback]\n```",
    table: "| Layer | Examples | Deployment check |\n|---|---|---|\n| Artifact | Binary, embedded assets | Checksum and target platform |\n| Runtime | User, files, certificates, port | Least privilege and startup test |\n| Lifecycle | Health, signals, rollback | Rehearsed under real process manager |",
  },
  "environment-config-go": {
    label: "environment-based configuration in Go",
    alt: "hard-coded deployment settings",
    definition: "Environment-based configuration lets a Go process receive values that vary by deployment without changing the executable. Startup code reads text values, applies documented defaults, validates required settings, and converts them into one typed configuration.",
    mechanism: "`os.LookupEnv` distinguishes an absent variable from an explicitly empty one. Parsing functions convert strings to durations, integers, URLs, or enums; validation then checks ranges and relationships before any server or worker starts.",
    use: "Use environment values for small deployment settings such as listen addresses, service URLs, feature options, and references to secret files. Keep stable business rules in code and consider files or a configuration service for large structured data.",
    example: "`REQUEST_TIMEOUT=750ms` can be parsed with `time.ParseDuration`, rejected when non-positive, and stored as `time.Duration`. Every request then receives the same already-validated value instead of re-reading the environment.",
    mistake: "A common failure is silently accepting missing or malformed values, especially when `Getenv` returns an empty string. Reading environment variables throughout the code also hides dependencies and makes tests depend on global process state.",
    contrast: "External settings allow one binary to run in development, staging, and production. Hard-coded values require a rebuild, while large configuration blobs in environment variables can become difficult to review, validate, and rotate.",
    boundary: "Environment variables are not inherently secret and may be visible through deployment tooling or process inspection. Configuration refresh is not automatic; many programs intentionally read once and require a controlled restart for changes.",
    repair: "Define a configuration schema, parse once, return all validation errors clearly, redact sensitive fields, inject the typed value into components, and test absent, empty, invalid, boundary, and valid inputs.",
    scenario: "For an environment-only failure, compare the effective variable names and values, startup validation output, precedence between deployment sources, and whether the running process was replaced. Avoid printing credentials while gathering evidence.",
    quick: ["Environment input starts as text", "Missing and empty may mean different things", "Parse and validate before serving traffic", "Pass typed configuration into components", "Do not log or bake secrets into artifacts"],
    deep: "Configuration is an input contract just like an HTTP request, except errors should normally stop startup rather than appear later under traffic. A small loader can own variable names, defaults, parsing, and validation and then return an immutable-looking typed struct. This makes dependencies visible to constructors and keeps business code independent of global process state. Defaults are useful only when a value is genuinely optional and the default is safe in every target environment; a missing database URL should not quietly point at a developer database. Related settings need cross-validation—for instance, a TLS certificate and key should be supplied together. Deployment platforms add their own precedence rules, so the application should avoid layering another surprising order on top. A safe startup summary can show which optional features are enabled and which addresses are selected while redacting credentials. When live reload is required, treat it as a separate concurrency and consistency feature rather than repeatedly calling `os.Getenv`.",
    code: String.raw`~~~go
type Config struct {
    Addr    string
    Timeout time.Duration
}

func Load() (Config, error) {
    addr := os.Getenv("HTTP_ADDR")
    if addr == "" { addr = ":8080" }
    raw, ok := os.LookupEnv("REQUEST_TIMEOUT")
    if !ok { return Config{}, errors.New("REQUEST_TIMEOUT is required") }
    timeout, err := time.ParseDuration(raw)
    if err != nil || timeout <= 0 { return Config{}, errors.New("invalid REQUEST_TIMEOUT") }
    return Config{Addr: addr, Timeout: timeout}, nil
}
~~~`,
    table: "| State | Meaning | Suitable handling |\n|---|---|---|\n| Variable absent | Deployment supplied nothing | Safe default or clear startup error |\n| Present but empty | Explicit empty string | Accept only if empty has meaning |\n| Present but malformed | Parsing fails | Startup error naming the setting |\n| Valid | Typed value available | Pass through configuration struct |",
  },
  "health-check-endpoint": {
    label: "health-check endpoints for a Go service",
    alt: "using one endpoint for every health decision",
    definition: "Health endpoints expose small machine-readable signals about a service process. Liveness answers whether restart may help, readiness answers whether the instance should receive traffic, and startup protects slow initialization from premature liveness checks.",
    mechanism: "A platform calls the endpoint on an interval and applies its own thresholds. A failing readiness check removes an instance from traffic; a failing liveness check may restart it. Those consequences make the check's dependencies and timeout important.",
    use: "Provide separate checks when process life and traffic readiness have different conditions. Liveness should be cheap and conservative; readiness may include only dependencies that make the instance unable to serve its promised requests.",
    example: "`/live` can return 200 while the event loop and process are responsive. `/ready` can return 503 during startup or when a required local state is unavailable, allowing the load balancer to stop new traffic without restarting the process.",
    mistake: "The classic mistake is making liveness depend on a shared database or remote API. A temporary dependency outage can then restart every healthy instance, increasing load and turning one outage into a cascade.",
    contrast: "One shallow endpoint is simple but cannot express whether an instance is alive yet temporarily unable to serve. Separate endpoints let the platform choose different actions—restart, wait, or remove traffic—based on different facts.",
    boundary: "A successful health response does not prove every user flow works, and readiness should not become a slow full-system test. Authentication, network exposure, caching, probe timeout, and failure thresholds still need explicit decisions.",
    repair: "Map each check to its operational action, give dependencies tight timeouts, return minimal responses, record failure reasons in internal telemetry rather than leaking detail, and test startup, shutdown, dependency failure, and recovery.",
    scenario: "When pods restart together, inspect which probe failed, its dependency calls, response time, timeout and threshold. If the process was responsive but a database was unavailable, move that condition out of liveness and review readiness behaviour.",
    quick: ["Liveness may trigger restart", "Readiness controls traffic", "Startup delays other probes during initialization", "Remote dependency failures rarely belong in liveness", "Checks must be cheap, bounded, and tied to an action"],
    deep: "A health check is part of a feedback loop, not merely an HTTP page. The returned status causes an operator or platform to act, so the endpoint must measure a condition that the action can improve. Restarting can repair a stuck process; it cannot repair a shared database and may make the outage worse. Removing an instance from traffic can help when it is warming state, overloaded, or missing a required connection. Startup checks handle applications whose initialization legitimately takes longer than the normal liveness window. In Go, handlers should avoid unbounded locks or network calls and should not expose internal credentials or stack traces. Readiness during graceful shutdown should turn false before the process exits so new traffic drains away. Metrics and logs can contain richer diagnostic reasons, while the public probe body stays small. Probe periods and failure thresholds balance detection speed against transient errors; they must be tested with realistic latency and deployment behaviour.",
    code: String.raw`~~~go
mux.HandleFunc("/live", func(w http.ResponseWriter, _ *http.Request) {
    w.WriteHeader(http.StatusOK)
})
mux.HandleFunc("/ready", func(w http.ResponseWriter, _ *http.Request) {
    if !readiness.Load() {
        http.Error(w, "not ready", http.StatusServiceUnavailable)
        return
    }
    w.WriteHeader(http.StatusOK)
})
~~~`,
    flow: "```mermaid\nflowchart TD\n  A[Probe result] --> B{Which question?}\n  B -- Process cannot recover itself --> C[Liveness fails: restart]\n  B -- Instance should not receive traffic --> D[Readiness fails: remove traffic]\n  B -- Initialization incomplete --> E[Startup not yet successful]\n```",
    table: "| Probe | Question | Typical platform action |\n|---|---|---|\n| Startup | Has initialization completed? | Delay liveness/readiness decisions |\n| Liveness | Is restart likely to help? | Restart after threshold |\n| Readiness | Can this instance accept traffic? | Remove or add service endpoint |",
  },
  "logging-basics": {
    label: "production logging in Go",
    alt: "unstructured print statements",
    definition: "Application logs are timestamped event records used to understand behaviour after or during execution. Production Go services usually write structured entries with a level, message, stable field names, and request or trace identifiers.",
    mechanism: "A logger serializes an event to standard output or error, where the runtime collects it. Structured logging such as `log/slog` keeps fields separate from the message so log systems can filter and aggregate them reliably.",
    use: "Log meaningful boundaries and outcomes: startup configuration without secrets, request completion, dependency failure, state changes, and shutdown. Choose levels consistently and pair logs with metrics and traces rather than making logs carry every signal.",
    example: "an HTTP completion event can record `method`, `path_template`, `status`, `duration_ms`, and `request_id`. It should avoid raw authorization headers, passwords, tokens, and uncontrolled request bodies.",
    mistake: "Weak logging either records too little context or floods every loop with text. Other failures include logging the same error at many layers, using free-form field names, exposing personal or secret data, and creating unbounded high-cardinality values.",
    contrast: "Structured fields are machine-queryable and keep values separate from prose. Plain prints can be fine for a tiny command, but production services need levels, context, stable schema, redaction, and an agreed ownership point for errors.",
    boundary: "Logs are not metrics, distributed traces, an audit ledger, or secure storage. They may be delayed or dropped, and sensitive data can spread widely once collected, so retention and access require deliberate controls.",
    repair: "Define a small event schema, attach correlation IDs through context, log an error once where it gains operational meaning, redact sensitive fields, sample noisy events, and test that failures remain diagnosable without leaking data.",
    scenario: "For an unexplained production error, follow the request or trace ID across boundary events, compare timestamps and status fields, then inspect the first failing dependency call. Missing correlation or inconsistent field names are logging design defects to correct.",
    quick: ["Logs describe discrete events", "Structured fields support reliable search", "Correlation IDs connect one request's events", "Sensitive values must be redacted or omitted", "Metrics and traces answer different questions"],
    deep: "Useful logging begins with the questions operators need to answer: what failed, for which request, at which dependency, how long it took, and whether the failure is isolated or widespread. A structured event gives each answer a stable field. The human message can remain short because searchable data is not hidden inside it. Levels express expected response: debug for development detail, info for normal lifecycle events, warn for degraded but handled conditions, and error for a failed operation that needs attention. The exact policy matters more than the names. Context can carry a request or trace ID, but values should be added at boundaries instead of passing a global logger with mutable fields. Error logging needs ownership; if a repository returns an error, a service wraps it, and an HTTP handler logs the final failed request, three identical stack traces add noise. Security rules should reject credentials, session tokens, and unnecessary personal data before they reach the logger.",
    code: String.raw`~~~go
logger.InfoContext(ctx, "request completed",
    "method", r.Method,
    "route", "/users/{id}",
    "status", status,
    "duration_ms", time.Since(start).Milliseconds(),
    "request_id", requestID,
)
~~~`,
    table: "| Signal | Best question | Example |\n|---|---|---|\n| Log | What happened in this event? | Dependency call failed for request X |\n| Metric | How often or how much? | Error rate and p95 latency |\n| Trace | Where did time and failure travel? | Request spans across services |\n| Audit record | Who performed a controlled action? | User changed a permission |",
  },
  "twelve-factor-app-go": {
    label: "twelve-factor practices for a Go service",
    alt: "server-specific application setup",
    definition: "The twelve-factor method is a set of practices for deployable services: one codebase, declared dependencies, external configuration, attached backing services, separated build and run stages, stateless processes, port binding, disposable instances, environment parity, event-stream logs, and one-off admin tasks.",
    mechanism: "The practices move environment-specific state out of the executable and make each running process replaceable. A release combines an immutable build with configuration; durable data lives in backing services rather than a process's local memory or filesystem.",
    use: "Apply the practices as design questions for services that are deployed often or scaled across instances. Adopt the factors that reduce delivery and operating risk; they are guidance, not a certification that overrides product or platform requirements.",
    example: "a Go API binds its own HTTP port, reads database and feature settings at startup, logs to stdout, stores sessions in an external service, and runs a migration as a versioned one-off command from the same codebase.",
    mistake: "A common misuse is treating twelve-factor as a checklist that guarantees reliability. Stateless processes can still depend on a stateful database, environment variables can leak secrets, and stdout logs still need secure collection and retention.",
    contrast: "Server-specific setup stores important knowledge in manually configured machines and encourages in-place changes. Twelve-factor-style releases make build, configuration, process, and backing-service boundaries explicit so instances can be recreated consistently.",
    boundary: "Not every workload should be stateless, and the method does not fully specify security, testing, observability, data migrations, distributed consistency, or modern orchestration. Those need additional engineering decisions.",
    repair: "Identify hidden machine state, configuration in source, local durable files, manual release steps, and logs tied to a server path. Move each only when the replacement has clear ownership, security, backup, and failure behaviour.",
    scenario: "When one instance behaves differently, compare artifact, configuration, backing-service bindings, local files, and release process. A twelve-factor violation often appears as important state or setup that exists on one machine but is absent from another.",
    quick: ["Build, release, and run are separate concerns", "Configuration varies outside the code", "Processes should be disposable where practical", "Durable state belongs in managed backing services", "The method is guidance, not a complete reliability standard"],
    deep: "The method aims to reduce accidental differences between environments and make horizontal process replacement ordinary. Go supports this well because a service can compile to one artifact and bind an HTTP port directly. The deeper value is not the binary; it is the separation of concerns. Source records behaviour, dependencies are declared, CI creates a release artifact, deployment combines it with configuration, and runtime processes can come and go without owning durable data. A database, queue, or object store is treated as a replaceable attached resource through a URL or credentials, though replacing it safely still requires migrations and compatibility. Logs become an event stream for the platform to collect rather than private files inside one instance. Administrative commands should use the same code and release as the application so schema or repair logic matches. These practices improve portability, but teams must still design security, capacity, failure recovery, observability, and data integrity.",
    code: String.raw`~~~text
code revision + declared modules -> build artifact
build artifact + environment configuration -> release
release -> one or more disposable processes
processes -> external database, queue, cache, object storage
~~~`,
    table: "| Boundary | Twelve-factor direction | Go service example |\n|---|---|---|\n| Dependencies | Declare explicitly | `go.mod` and `go.sum` |\n| Configuration | External to code | Validated startup config |\n| Process | Disposable and stateless where possible | Graceful HTTP server instance |\n| Logs | Event stream | Structured stdout |\n| Admin work | One-off process from same release | Migration command |",
  },
  "kubernetes-basics-for-go": {
    label: "running a Go service on Kubernetes",
    alt: "running one container directly on a host",
    definition: "Kubernetes schedules containers in Pods and uses controllers such as Deployments to keep the requested replicas running and roll out new versions. A Service gives a stable network endpoint for a changing set of ready Pods.",
    mechanism: "The scheduler assigns a Pod to a node, the kubelet starts its containers, readiness controls whether endpoints receive traffic, and a Deployment gradually replaces old Pods according to its strategy. Configuration and secrets can be injected separately from the image.",
    use: "Kubernetes fits systems that need a shared multi-node platform, declarative rollouts, service discovery, scaling, and automated replacement. A small application may be simpler and cheaper on one managed service, VM, or container host.",
    example: "a Deployment can request three replicas of one immutable image, a Service selects their labels, and readiness checks `/ready`. During rollout, only ready new Pods join the Service before old Pods are removed.",
    mistake: "Common failures include matching the wrong labels, confusing container and Service ports, using liveness for dependency outages, omitting resource requests, relying on local Pod storage, and ending the process before termination traffic drains.",
    contrast: "Direct container execution manages one process on one host. Kubernetes adds desired-state controllers, scheduling, service discovery, rollouts, and cluster-wide policy, but also adds manifests, platform operation, and more failure layers.",
    boundary: "Kubernetes does not repair incorrect application state, make databases stateless, choose safe resource values, or guarantee zero-downtime rollout. The Go service still needs timeouts, health semantics, graceful shutdown, observability, and compatibility.",
    repair: "Inspect desired and actual state: Deployment conditions, Pod events, container status and logs, labels and endpoints, probes, ports, resources, configuration, and termination timing. Fix the first divergence rather than repeatedly restarting Pods.",
    scenario: "If a healthy Pod receives no traffic, check readiness, Service selectors, EndpointSlices, target port, and network policy. If it restarts, inspect container exit status and liveness history instead of treating readiness as the cause.",
    quick: ["Pods run one or more containers", "Deployments manage replicas and rollouts", "Services route to matching ready Pods", "Readiness and liveness cause different actions", "Pods are replaceable, so local writable state is temporary"],
    deep: "Kubernetes is a control system built around desired state. A Deployment says which Pod template and replica count should exist; controllers compare that declaration with reality and create or remove Pods. Pod labels connect several independent objects, so a small selector mismatch can leave a Service with no endpoints even while containers are healthy. Readiness is the bridge between application state and traffic routing. Liveness has a harsher consequence—restart—and should represent conditions where restart is likely to help. Resource requests influence scheduling and limits constrain usage, so unrealistic values can cause pending Pods, throttling, or termination. Deployment termination sends a signal and allows a grace period, but the application must mark itself unready, stop taking work, and finish safely. Configuration updates, schema compatibility, and mixed old/new versions make rollouts application concerns too. Kubernetes automates mechanics; it does not define the service's invariants.",
    code: String.raw`~~~yaml
apiVersion: apps/v1
kind: Deployment
metadata: {name: catalog}
spec:
  replicas: 3
  selector: {matchLabels: {app: catalog}}
  template:
    metadata: {labels: {app: catalog}}
    spec:
      containers:
        - name: api
          image: registry.example/catalog@sha256:abc123
          ports: [{containerPort: 8080}]
          readinessProbe:
            httpGet: {path: /ready, port: 8080}
~~~`,
    flow: "```mermaid\nflowchart LR\n  D[Deployment desired state] --> P1[Pod]\n  D --> P2[Pod]\n  D --> P3[Pod]\n  S[Service] --> E{Ready endpoints}\n  E --> P1\n  E --> P2\n  E --> P3\n```",
    table: "| Object | Responsibility | Not its job |\n|---|---|---|\n| Pod | Container execution unit | Stable long-term identity |\n| Deployment | Replicas and rollout | Network endpoint |\n| Service | Stable discovery and routing | Building images |\n| ConfigMap/Secret | Supply configuration data | Validate application meaning |",
  },
  "comparisons": {
    label: "a deployment model for a Go service",
    alt: "a different mix of VM, container, managed platform, or serverless runtime",
    definition: "A deployment model decides who manages the operating system, process lifecycle, network, scaling, and runtime platform. Go binaries can run directly on VMs, in containers, on managed application platforms, or in function-style services.",
    mechanism: "More managed platforms take responsibility for patching, scheduling, and scaling but impose stronger runtime conventions. Less managed hosts provide more control and portability while leaving teams responsible for more operating work.",
    use: "Select a model from workload shape, startup and latency needs, traffic variability, network and compliance constraints, team skills, observability, cost, and recovery targets. Begin with the simplest model that meets those known requirements.",
    example: "a steady internal API may run cheaply as one supervised binary or managed container. A bursty event handler may benefit from scale-to-zero functions, while many independently deployed services may justify a container platform.",
    mistake: "The main mistake is choosing from popularity or theoretical scale while ignoring operational skill and workload evidence. Teams can spend more effort managing a platform than improving the service it was meant to run.",
    contrast: "VMs maximize host control, containers standardize artifacts, managed container services reduce orchestration work, and serverless platforms manage instances around request or event execution. Every option shifts cost and constraints rather than removing them.",
    boundary: "No deployment model guarantees availability, security, low cost, or good scaling. Stateful dependencies, cold starts, egress, quotas, vendor limits, rollout compatibility, and incident response remain part of the design.",
    repair: "Write measurable requirements, model steady and peak cost, build a small representative deployment, test rollout and failure recovery, and record why the chosen platform is simpler than the rejected options for this workload.",
    scenario: "For slow or costly production behaviour, separate application time from platform queueing, startup, network, resource throttling, and downstream calls. Compare the same workload with the configured concurrency and scaling limits before changing models.",
    questions: ["Which deployment options work well for Go services?", "How should a team select a deployment model for a Go service?", "What causes a Go deployment platform choice to fail?", "How do VMs, containers, managed platforms, and serverless runtimes differ for Go?", "How do you diagnose whether a Go production issue comes from the app or its platform?"],
    quick: ["Deployment models move responsibility between team and provider", "Go binaries fit several platform types", "Workload and team constraints matter more than popularity", "Managed does not mean responsibility-free", "Test rollout, failure, and cost with representative traffic"],
    deep: "Go's fast startup and compact executable make many deployment choices possible, which means platform selection should be driven by operations rather than language fashion. A VM exposes the most familiar host controls but needs patching and process management. A container records a runtime filesystem and works well with registries and schedulers. Managed container products keep that artifact while taking over parts of cluster operation. Function-style services can match event-driven, intermittent work but introduce invocation, duration, networking, and portability constraints. Cost depends on utilization, idle capacity, data transfer, managed-service pricing, and human operation—not only a per-request number. Reliability depends on rollout control, health semantics, multiple failure domains, dependency behaviour, and tested recovery. The most future-proof choice is often the one the team can understand, observe, secure, and replace while meeting current growth requirements, with a documented path to change if measurements cross a real threshold.",
    code: String.raw`~~~text
More control                                    More provider management
VM / host process -> container host -> managed containers -> functions
More OS/platform work                           More runtime constraints
~~~`,
    table: "| Model | Team commonly manages | Strong fit | Typical constraint |\n|---|---|---|---|\n| VM/direct binary | OS, service manager, rollout | Few steady services | Host maintenance |\n| Container platform | Images plus platform or cluster | Many standardized services | Platform complexity |\n| Managed container | Image and service settings | Teams avoiding cluster operation | Provider conventions/cost |\n| Serverless function | Handler and event settings | Bursty event work | Invocation and runtime limits |",
  },
});
