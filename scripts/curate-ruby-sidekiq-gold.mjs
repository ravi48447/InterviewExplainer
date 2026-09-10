#!/usr/bin/env node

import fs from "node:fs";
import path from "node:path";

const domainRoot = "content/ruby-backend-fresher";
const root = path.join(domainRoot, "sidekiq-intro");
const fence = (language, lines) => `\`\`\`${language}\n${lines.join("\n")}\n\`\`\``;

const lessons = {
  "ruby-why-background-jobs-basics": {
    answerSize: "standard",
    direct: "A background job moves work out of the request-response path so the server can acknowledge the request without waiting for slow or independently retryable processing. Good candidates include email delivery, report generation, media processing, webhooks, and batch maintenance. Enqueuing is not completion: the application must define job status, retry and failure behaviour, idempotency, and the consistency boundary between the database change and queue publication. Work whose result is required for the current response should normally remain synchronous.",
    quick: [
      "Background jobs shorten requests by deferring independent work to a queue.",
      "The web process enqueues; a separate worker later performs the job.",
      "A successful enqueue means accepted for processing, not completed.",
      "Jobs need idempotency, retry limits, monitoring, and visible failure handling.",
      "Keep validation or results required by the current response synchronous.",
    ],
    interview: [
      "- A background job is work recorded for a separate worker process to perform outside the current web request. It is useful when the response does not need the finished result and the work is slow, bursty, scheduled, or worth retrying independently.",
      "- The request validates the operation, commits the important application state, and places a small job payload on a queue. A worker later reserves that payload, runs the job, and records success or raises a failure. Queue delay therefore becomes part of the feature, not an invisible implementation detail.",
      "- For example, account creation can commit the user and enqueue a welcome-email job. The HTTP response returns after durable account creation rather than waiting for the mail provider. If delivery is delayed, the account still exists and the email operation can retry without repeating registration.",
      "- Deferral creates boundaries. Enqueuing before a database transaction commits can let a worker look for data that is not visible yet; committing without reliably publishing can leave required work missing. The design may use after-commit enqueueing, an outbox, or reconciliation according to the consequence of loss.",
      "- A job may run more than once, so effects need idempotency or a unique business key. Expected business outcomes should become explicit states, while unexpected exceptions can enter retry and alerting policy. I would not enqueue password validation or a calculation the current response must return, because asynchronous work cannot satisfy that immediate contract.",
    ],
    deepTitle: "Deferral splits one user action into two observable lifecycles",
    deep: [
      "The request lifecycle ends when the server responds; the job lifecycle can still be queued, scheduled, running, retried, failed, or complete. A product that tells a user “report created” immediately after enqueueing confuses those states. “Report accepted” plus a status endpoint or notification reflects the real contract.",
      "A queue absorbs a burst only by turning load into waiting time. Workers still need enough capacity to drain it. Queue depth, oldest-job age, runtime, success rate, and retry volume reveal whether asynchronous processing is healthy; request latency alone cannot show a blocked worker fleet.",
      "Delivery guarantees are built from several components and failure windows. A request can commit but fail to enqueue, a process can stop during execution, and an external service can accept a call before the worker records success. Idempotency keys, database constraints, durable publication patterns, and reconciliation close different gaps.",
      "The best job boundary names one recoverable business operation and carries references rather than a snapshot of the whole object. The worker reloads current state, decides whether work is still needed, and makes its effect safe to repeat. This keeps a delayed job meaningful after the application has changed around it.",
    ],
    visualType: "sequence_diagram",
    visualTitle: "A request ends before the background operation does",
    visual: fence("mermaid", [
      "sequenceDiagram",
      "  participant U as Client",
      "  participant W as Rails web process",
      "  participant D as Database",
      "  participant Q as Queue",
      "  participant J as Worker",
      "  U->>W: create account",
      "  W->>D: commit account",
      "  W->>Q: enqueue welcome email",
      "  W-->>U: account created",
      "  Q-->>J: reserve job later",
      "  J->>D: reload account",
      "  J->>J: deliver idempotently",
    ]),
    codeTitle: "Commit the record, then defer independent delivery",
    code: [
      "class RegistrationsController < ApplicationController",
      "  def create",
      "    user = User.create!(user_params)",
      "    WelcomeEmailJob.perform_later(user.id)",
      "",
      "    render json: { id: user.id, email_status: 'queued' }, status: :created",
      "  end",
      "end",
      "",
      "class WelcomeEmailJob < ApplicationJob",
      "  def perform(user_id)",
      "    user = User.find(user_id)",
      "    UserMailer.welcome(user).deliver_now unless user.welcome_email_sent?",
      "  end",
      "end",
    ],
    followups: [
      "What does a successful enqueue guarantee compared with completed work?",
      "Which failure window exists between a database commit and queue publication?",
      "Why must a background side effect be safe when the job runs again?",
    ],
  },
  "ruby-sidekiq-setup-basics": {
    answerSize: "compact",
    direct: "To run Sidekiq with Rails, add the `sidekiq` gem, provide a supported Redis-compatible server and URL, configure the queues and worker concurrency, and start a Sidekiq server process separately from the Rails web process. Native jobs include `Sidekiq::Job`; Active Job applications set `config.active_job.queue_adapter = :sidekiq`. The producer and worker must share compatible code, queue names, and serialization expectations. Production setup also needs authentication for the Web UI, graceful shutdown, error reporting, and queue health monitoring.",
    quick: [
      "Add Sidekiq and configure a supported queue data store and connection.",
      "Run the Rails web process and Sidekiq worker as separate processes.",
      "List every queue the worker should consume and choose measured concurrency.",
      "Use native `Sidekiq::Job` or configure the Active Job adapter deliberately.",
      "Protect the Web UI and monitor queue age, failures, retries, and worker health.",
    ],
    interview: [
      "- Sidekiq has a client side and a server side. Rails code serializes a job and pushes it to a queue in a supported Redis-compatible data store. A separate Sidekiq process fetches jobs and runs several Ruby threads, so both the data-store connection and the application dependencies used by jobs must be available there.",
      "- Setup begins by adding the Sidekiq gem and configuring the connection URL through deployment configuration. Native job classes include `Sidekiq::Job`. If the application uses Rails Active Job, it instead selects `:sidekiq` as the queue adapter and enqueues through `perform_later`.",
      "- For example, `config/sidekiq.yml` can list `critical`, `default`, and `mailers`, while the deployed worker starts with that configuration. A job sent to a queue no running process consumes will remain queued even though enqueueing succeeded.",
      "- Concurrency must match available database connections, external-service limits, and CPU or memory behaviour. Increasing threads without increasing the Active Record pool can make workers wait for connections; increasing both without checking the database can move the bottleneck downstream.",
      "- A production-ready setup includes graceful shutdown so workers can stop safely, structured error reporting, retries and dead-job visibility, queue depth and latency monitoring, and authenticated access to any mounted Sidekiq Web interface. A local successful job proves code wiring, not operational reliability.",
    ],
    deepTitle: "The worker is a separate deployment that shares application contracts",
    deep: [
      "The web process only needs client configuration to enqueue, while the Sidekiq server boots the Rails application to execute job code. A deployment can therefore have healthy web instances and no functioning workers. Process supervision and health checks must treat them as separate services.",
      "Queue configuration is routing. The payload names a queue, and a worker process declares which queues it polls. Strict priority can starve low-priority work when high-priority traffic never clears; weighted or specialised processes trade strict ordering for capacity isolation. Fewer purposeful queues are easier to operate than one per feature.",
      "Sidekiq concurrency is threaded within each process. Every blocking job may hold a database connection or network socket. Pool sizes, client timeouts, thread safety, and downstream quotas must be coordinated with total concurrency across all worker processes, not tuned from a single machine in isolation.",
      "The Web interface exposes operational state and can retry or delete work, so mounting it without authentication creates an administrative vulnerability. Logs and metrics should identify job class, queue, runtime, retry count, and a safe business correlation key without placing secrets in job arguments.",
    ],
    visualType: "architecture_diagram",
    visualTitle: "The components required for Sidekiq to make progress",
    visual: fence("mermaid", [
      "flowchart LR",
      "  Web[Rails web process / Sidekiq client] --> Store[(queue data store)]",
      "  Store --> Worker[Sidekiq server threads]",
      "  Worker --> DB[(application database)]",
      "  Worker --> API[mail or external API]",
      "  Worker --> Metrics[logs, errors, queue metrics]",
      "  Admin[authenticated Sidekiq Web] --> Store",
    ]),
    codeTitle: "Configure the adapter and worker queues explicitly",
    code: [
      "# config/application.rb",
      "class Application < Rails::Application",
      "  config.active_job.queue_adapter = :sidekiq",
      "end",
      "",
      "# config/sidekiq.yml",
      "# :concurrency: 5",
      "# :queues:",
      "#   - critical",
      "#   - default",
      "#   - mailers",
      "",
      "# Start separately from the Rails web server:",
      "# bundle exec sidekiq -C config/sidekiq.yml",
    ],
    followups: [
      "Why can jobs stay queued while the Rails website remains healthy?",
      "How does Sidekiq concurrency relate to the Active Record connection pool?",
      "Why must access to Sidekiq Web be authenticated?",
    ],
  },
  "ruby-writing-a-worker-basics": {
    answerSize: "standard",
    direct: "A native Sidekiq job includes `Sidekiq::Job`, defines `perform` with small JSON-compatible arguments, and is enqueued with `perform_async`. Pass stable identifiers rather than live Active Record objects, reload current data inside the job, and make the external or database effect safe to repeat. Let unexpected failures raise so Sidekiq can record and retry them; turn expected business outcomes into explicit state instead of exceptions. The job payload is a durable interface, so argument changes must remain compatible with already queued work.",
    quick: [
      "Include `Sidekiq::Job` and put the operation in `perform`.",
      "Enqueue native work with `perform_async` using JSON-compatible values.",
      "Pass IDs or simple snapshots, then reload authoritative data during execution.",
      "Make effects idempotent because the same logical job can run again.",
      "Keep payload changes compatible with jobs already waiting in the queue.",
    ],
    interview: [
      "- A native Sidekiq job is a Ruby class that includes `Sidekiq::Job` and implements `perform`. Calling `perform_async` serializes the class, queue options, and arguments into a payload; a Sidekiq server later deserializes it and invokes `perform`.",
      "- Arguments should be simple JSON-compatible values such as strings, numbers, booleans, arrays, hashes with string keys, and nil. I normally pass an Active Record ID rather than an object, because native Sidekiq does not preserve a live model and the stored snapshot could be stale when the worker runs.",
      "- For example, `ReceiptJob.perform_async(order.id)` lets the worker reload the order, stop if a receipt was already delivered, generate a business idempotency key, send the message, and record completion. A retry after a timeout can then detect the completed effect instead of sending an uncontrolled duplicate.",
      "- Expected outcomes need deliberate handling. A cancelled order may simply return because no receipt is required. A temporary mail-provider timeout should raise so retry policy applies. Rescuing every exception and returning makes Sidekiq record false success and removes the job from normal failure visibility.",
      "- Job arguments form a versioned contract with work already in Redis. Adding a required positional argument can break payloads enqueued by the old deployment. Small payloads, keyword-like option hashes with string keys, tolerant readers, and staged deployments make job evolution safer.",
    ],
    deepTitle: "Design the payload and the side effect as durable contracts",
    deep: [
      "A queued payload can outlive the request, the process, and the deployment that created it. It should contain enough stable information to locate the work without serializing incidental application state. Reloading an ID sees current truth; storing a deliberate immutable value is appropriate only when the historical snapshot itself is the contract.",
      "Idempotency is about the business effect, not whether Ruby executes twice. A database uniqueness constraint can protect one receipt record, and an external API idempotency key can protect one provider action. A boolean checked before sending can still race unless its read and write share a safe boundary.",
      "Exceptions communicate unexpected failure to Sidekiq. Broad rescue inside `perform` should either translate to a more meaningful exception or complete an explicit compensating state; silent logging loses retry and alerting. Timeouts should be bounded so one worker thread does not remain occupied indefinitely.",
      "Testing separates the enqueue contract from execution. One test can assert that the correct job and simple arguments are enqueued after the business event. Another can run `perform` directly with controlled records and prove success, duplicate execution, missing data, and external failure behaviour.",
    ],
    visualType: "flow_diagram",
    visualTitle: "A retry-safe worker checks the business effect",
    visual: fence("mermaid", [
      "flowchart TD",
      "  P[receive order ID] --> R[reload order]",
      "  R --> N{receipt still required?}",
      "  N -->|no| Done[finish without side effect]",
      "  N -->|yes| K[claim durable idempotency key]",
      "  K --> S[send receipt with same key]",
      "  S --> M[record completion]",
      "  S -->|unexpected exception| Retry[raise for retry and alerting]",
    ]),
    codeTitle: "A native Sidekiq job with a repeat-safe boundary",
    code: [
      "class ReceiptJob",
      "  include Sidekiq::Job",
      "  sidekiq_options queue: 'mailers'",
      "",
      "  def perform(order_id)",
      "    order = Order.find(order_id)",
      "    return if order.receipt_sent?",
      "",
      "    ReceiptDelivery.call(",
      "      order: order,",
      "      idempotency_key: \"order-receipt-#{order.id}\"",
      "    )",
      "    order.update!(receipt_sent_at: Time.current)",
      "  end",
      "end",
      "",
      "ReceiptJob.perform_async(order.id)",
    ],
    followups: [
      "Why should a native Sidekiq job normally receive an ID instead of a model object?",
      "How can a worker still duplicate an effect after checking a boolean flag?",
      "Why can changing job arguments break work already in the queue?",
    ],
  },
  "ruby-job-retry-and-failure-basics": {
    answerSize: "standard",
    direct: "When a Sidekiq job raises an unexpected exception, Sidekiq records the failure and normally schedules retries with increasing delay. Retry count and final handling are configurable; under current defaults, exhausted jobs move to the Dead set for later inspection before eventual removal. Retrying creates at-least-once execution possibilities, so jobs must be idempotent. Expected business failures should be modelled explicitly rather than retried, and persistent failures need error reporting, queue metrics, ownership, and a safe manual recovery path.",
    quick: [
      "Raise unexpected failures so Sidekiq can record and apply retry policy.",
      "Retries use delayed attempts and may eventually enter the Dead set.",
      "A retry can repeat work that partly succeeded, so effects must be idempotent.",
      "Do not retry permanent validation or business-rule outcomes indefinitely.",
      "Alert on repeated failure and provide an inspected, authorised recovery path.",
    ],
    interview: [
      "- Sidekiq treats a raised exception as a failed execution. It records error details and, when retry is enabled, places the job in the retry schedule with increasing delay. This gives transient failures such as a provider outage time to recover without blocking a web request.",
      "- Current Sidekiq defaults retry a job a finite number of times over an extended period, then move exhausted work into the Dead set where operators can inspect or retry it before retention expires. Those numbers and retention can change by version or configuration, so operational policy should be read from the deployed setup rather than memorised as a universal guarantee.",
      "- For example, a charge request may reach the payment provider, then time out before the worker records success. Retrying the same payload without a provider idempotency key can charge twice. Reusing one business key lets the provider return the original result for the repeated logical operation.",
      "- Retries suit unexpected, potentially temporary failures. An invalid address, cancelled order, or rejected business rule will not become valid through blind repetition; the job should record a permanent outcome, discard according to policy, or move the workflow to human review. Broad rescue that only logs an error creates false success.",
      "- Reliable operation combines idempotent effects, bounded timeouts, error-service reporting, retry and dead counts, oldest-job age, and a named owner for recovery. Retrying is one control within that system, not proof that work cannot be lost or duplicated.",
    ],
    deepTitle: "Retry the operation only after defining what partial success means",
    deep: [
      "A failure can occur before an effect, during it, or after the external system completed it but before the worker recorded completion. The last window is why exception type alone cannot make retry safe. The job needs a durable key or state transition that survives process loss and distinguishes a repeated attempt from a new business request.",
      "Backoff protects a struggling dependency and gives transient conditions time to clear. Immediate tight retries amplify an outage. Randomness and increasing delay reduce synchronised retry spikes, but long delays also mean the product must expose pending or failed state rather than silently promising instant completion.",
      "Permanent and expected outcomes belong outside automatic exception retry. A payment decline is a business result; invalid serialized data may require dead-letter inspection; a missing record may be harmless or a data-loss signal depending on the operation. Classifying each path prevents wasted attempts and hidden abandonment.",
      "Manual retry is another execution and needs authorization, audit, and current-state checks. After deploying a fix, an operator should know which payloads are safe to replay, which external effects already occurred, and how success will be verified. Deleting failed work without reconciliation changes queue cleanliness, not business correctness.",
    ],
    visualType: "flow_diagram",
    visualTitle: "A failed job moves through delayed and operational states",
    visual: fence("mermaid", [
      "stateDiagram-v2",
      "  [*] --> Queued",
      "  Queued --> Running",
      "  Running --> Complete: effect recorded",
      "  Running --> RetryScheduled: unexpected exception",
      "  RetryScheduled --> Queued: delay expires",
      "  RetryScheduled --> Dead: attempts exhausted",
      "  Dead --> Queued: inspected manual retry",
      "  Dead --> Reconciled: discard or compensate by policy",
    ]),
    codeTitle: "Let transient failure raise and protect the external effect",
    code: [
      "class CapturePaymentJob",
      "  include Sidekiq::Job",
      "  sidekiq_options retry: 10",
      "",
      "  def perform(payment_id)",
      "    payment = Payment.find(payment_id)",
      "    return if payment.captured?",
      "",
      "    result = Gateway.capture(",
      "      payment.amount_cents,",
      "      idempotency_key: \"payment-#{payment.id}\"",
      "    )",
      "    payment.update!(provider_reference: result.id, captured_at: Time.current)",
      "  end",
      "end",
      "",
      "# A timeout raises; the next attempt reuses the same provider key.",
    ],
    followups: [
      "Which failure window can cause an external effect to succeed before a retry?",
      "Why should a payment decline usually not use automatic exception retries?",
      "What evidence is needed before manually retrying a dead job?",
    ],
  },
  "ruby-active-job-adapter-basics": {
    answerSize: "standard",
    direct: "Active Job is Rails' common API for declaring and enqueueing jobs; a queue adapter chooses the backend that stores and executes them. With `config.active_job.queue_adapter = :sidekiq`, `perform_later` serializes an Active Job payload and Sidekiq runs it through its adapter wrapper. Active Job supports typed arguments and GlobalID for persisted records, while native Sidekiq expects JSON-compatible values. The abstraction enables common Rails helpers and easier backend changes, but retry semantics, performance, priorities, and advanced features still depend on the chosen adapter.",
    quick: [
      "Active Job defines the Rails job API; Sidekiq supplies one execution backend.",
      "Set the `:sidekiq` adapter, run Sidekiq workers, and call `perform_later`.",
      "Active Job can serialize supported values and persisted records through GlobalID.",
      "A deleted GlobalID record can fail before `perform` with a deserialization error.",
      "Adapter changes do not erase backend differences in retries, priority, and features.",
    ],
    interview: [
      "- Active Job is the Rails framework for defining background jobs with a common interface. A job inherits from `ApplicationJob`, declares a queue with `queue_as`, implements `perform`, and is enqueued with `perform_later`. The configured adapter decides where that serialized work goes.",
      "- When the adapter is `:sidekiq`, Rails serializes the Active Job payload and Sidekiq stores and executes a wrapper that hands it back to Active Job. The Rails web process still needs a running Sidekiq backend and worker; selecting an adapter does not execute jobs by itself.",
      "- For example, `WelcomeEmailJob.perform_later(user)` can serialize the persisted user through GlobalID. At execution Active Job locates that record before calling `perform`. If the user was deleted in the meantime, deserialization can raise before the first line of the job body, so that failure needs an explicit policy.",
      "- Native Sidekiq jobs use `perform_async` and JSON-compatible arguments directly. They expose Sidekiq's API with less wrapper overhead. Active Job gives Rails-standard callbacks, testing helpers, mailer integration, and a more portable surface, but not every backend feature or semantic maps identically.",
      "- Retry behaviour needs particular care because Active Job's `retry_on` and Sidekiq's own retry system can form layers. I choose one documented policy for each exception class, verify queue names and execution in the deployed adapter, and treat changing backends as a tested migration rather than a configuration-only promise.",
    ],
    deepTitle: "The adapter standardises enqueueing, not every delivery guarantee",
    deep: [
      "Active Job owns the application-facing envelope: job class, queue, arguments, locale, execution metadata, callbacks, and error declarations. The adapter translates that envelope into the backend's payload and scheduling API. Sidekiq later invokes an adapter wrapper, which reconstructs the Active Job and calls its execution pipeline.",
      "GlobalID serializes a locator for a persisted model rather than the object's full current state. This is convenient and allows the worker to load fresh data, but the locator may no longer resolve. A raw ID handled inside `perform` gives the job control over not-found behaviour; a GlobalID failure can occur during argument deserialization.",
      "Portability exists at the common API layer. Throughput, transaction integration, priority mapping, scheduling precision, retry storage, uniqueness, batches, and administrative tools remain backend-specific. Application code coupled to those features needs an explicit adapter boundary or accepts that switching requires redesign.",
      "Tests should prove both levels. Active Job helpers can assert enqueueing and perform the job in a controlled adapter. At least one deployed-environment check must prove the Sidekiq process consumes the configured queue and that retry, serialization, and database visibility behave as expected.",
    ],
    visualType: "architecture_diagram",
    visualTitle: "Active Job wraps an application job for Sidekiq execution",
    visual: fence("mermaid", [
      "flowchart LR",
      "  App[ApplicationJob.perform_later] --> AJ[Active Job serialization]",
      "  AJ --> Adapter[Sidekiq adapter]",
      "  Adapter --> Queue[(Sidekiq queue store)]",
      "  Queue --> Wrapper[Sidekiq Active Job wrapper]",
      "  Wrapper --> Deserialize[Active Job argument deserialization]",
      "  Deserialize --> Perform[job perform method]",
    ]),
    codeTitle: "Run one Rails job through the Sidekiq adapter",
    code: [
      "# config/application.rb",
      "class Application < Rails::Application",
      "  config.active_job.queue_adapter = :sidekiq",
      "end",
      "",
      "class WelcomeEmailJob < ApplicationJob",
      "  queue_as :mailers",
      "  discard_on ActiveJob::DeserializationError",
      "",
      "  def perform(user)",
      "    UserMailer.welcome(user).deliver_now",
      "  end",
      "end",
      "",
      "WelcomeEmailJob.perform_later(user) # persisted model uses GlobalID",
    ],
    followups: [
      "What happens between `perform_later` and a Sidekiq worker calling `perform`?",
      "How does passing a GlobalID differ from passing a raw record ID?",
      "Why can `retry_on` and Sidekiq retries create two retry layers?",
    ],
  },
};

let curated = 0;
for (const topicDirectory of fs.readdirSync(root)) {
  const file = path.join(root, topicDirectory, "complete-qa.json");
  if (!fs.existsSync(file)) continue;
  const document = JSON.parse(fs.readFileSync(file, "utf8"));
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
        { type: "key_points", title: "Quick Revision", content: lesson.quick.map((point) => `- ${point}`).join("\n") },
        { type: "speakable_answer", title: "Interview Answer", answerSize: lesson.answerSize, content: lesson.interview.map((paragraph) => paragraph.replace(/^[-*+]\s+/, "")).join("\n\n") },
        { type: "deep_explanation", title: lesson.deepTitle, content: lesson.deep.join("\n\n") },
        { type: lesson.visualType, title: lesson.visualTitle, content: lesson.visual },
        { type: "code_example", title: lesson.codeTitle, content: fence("ruby", lesson.code) },
      ],
    };
    question.followup_questions = lesson.followups;
    question.seo = {
      ...(question.seo ?? {}),
      metaDescription: `Learn ${question.question} with a direct answer, lifecycle model, retry boundary, and focused follow-up questions.`,
    };
    curated += 1;
  }
  fs.writeFileSync(file, `${JSON.stringify(document, null, 2)}\n`);
}

const indexFile = path.join(domainRoot, "_index.json");
const index = JSON.parse(fs.readFileSync(indexFile, "utf8"));
const module = index.modules.find((entry) => entry.moduleSlug === "sidekiq-intro");
if (!module) throw new Error(`${indexFile}: missing sidekiq-intro`);
module.intro = "Sidekiq and background-job questions test whether a Rails developer understands the complete asynchronous lifecycle, not only `perform_async`. This module covers when work belongs outside a request, how web and worker processes share a queue store, native Sidekiq payloads and idempotency, retry and dead-job handling, and the Active Job adapter boundary. Each lesson distinguishes successful enqueueing from completed business work and treats failure, duplicate execution, monitoring, and deployment compatibility as part of the feature.";
fs.writeFileSync(indexFile, `${JSON.stringify(index, null, 2)}\n`);

if (curated !== Object.keys(lessons).length) {
  throw new Error(`curated ${curated}/${Object.keys(lessons).length} Sidekiq lessons`);
}

console.log(`Curated ${curated} canonical Sidekiq questions and corrected the module intro.`);
