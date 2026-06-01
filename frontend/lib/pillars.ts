/**
 * pillars.ts — canonical registry of the 12 pillars.
 * Pillar IDs are shared across Java and Python; names diverge.
 */

export type PillarId =
  | 'P01' | 'P02' | 'P03' | 'P04' | 'P05' | 'P06'
  | 'P07' | 'P08' | 'P09' | 'P10' | 'P11' | 'P12'
  | 'P13' | 'P14' | 'P15' | 'P16' | 'P17' | 'P18';

export interface PillarMeta {
  id:      PillarId;
  name:    string;
  seoSlug: string;
  blurb:   string;
}

export const JAVA_PILLARS: Partial<Record<PillarId, PillarMeta>> = {
  P01: { id: 'P01', name: 'Java Language & Core',               seoSlug: 'java-interview-questions',               blurb: 'Core Java fundamentals interviewers anchor every backend round on.' },
  P02: { id: 'P02', name: 'Spring Ecosystem',                   seoSlug: 'spring-interview-questions',             blurb: 'Spring, Spring Boot, Data JPA, Security, WebFlux, Batch — the JVM backend default.' },
  P03: { id: 'P03', name: 'Data & Persistence',                 seoSlug: 'sql-interview-questions',                blurb: 'SQL, indexing, transactions, NoSQL choices, and caching strategies.' },
  P04: { id: 'P04', name: 'APIs & Web',                         seoSlug: 'rest-api-interview-questions',           blurb: 'REST, GraphQL, gRPC — the contract surface every backend service exposes.' },
  P05: { id: 'P05', name: 'Messaging & Microservices',          seoSlug: 'microservices-interview-questions',      blurb: 'Kafka, RabbitMQ, event-driven patterns, service decomposition, sagas.' },
  P06: { id: 'P06', name: 'System Design & LLD',                seoSlug: 'system-design-interview-questions',      blurb: 'Architecture cases, low-level design, GoF patterns, and clean architecture.' },
  P07: { id: 'P07', name: 'Application Security',               seoSlug: 'application-security-interview-questions', blurb: 'OWASP, AuthN/Z, secrets, supply chain — what an interviewer probes after the happy path.' },
  P08: { id: 'P08', name: 'Testing & Quality',                  seoSlug: 'unit-testing-interview-questions',       blurb: 'JUnit, Mockito, Testcontainers, the test pyramid, and contract tests.' },
  P09: { id: 'P09', name: 'DevOps & Build',                     seoSlug: 'devops-interview-questions',             blurb: 'Docker, Kubernetes, CI/CD, build tools — getting code to prod.' },
  P10: { id: 'P10', name: 'Cloud Platforms',                    seoSlug: 'cloud-interview-questions',              blurb: 'AWS, GCP, Azure — the deployment substrates senior interviewers expect you to name.' },
  P11: { id: 'P11', name: 'Observability & Production',         seoSlug: 'observability-interview-questions',      blurb: 'Logs, metrics, traces, SLOs, incident response.' },
  P12: { id: 'P12', name: 'Engineering Practices & Behavioral', seoSlug: 'behavioral-interview-questions',         blurb: 'How you work, decide, and grow — the round you cannot brute-force.' },
};

export const PYTHON_PILLARS: Partial<Record<PillarId, PillarMeta>> = {
  P01: { id: 'P01', name: 'Python Language & Core',             seoSlug: 'python-interview-questions',             blurb: 'Core Python idioms interviewers anchor every backend round on.' },
  P02: { id: 'P02', name: 'Web Frameworks',                     seoSlug: 'django-interview-questions',             blurb: 'Django, FastAPI, Flask — choose-when, ship-fast, and the trade-offs interviewers test.' },
  P03: { id: 'P03', name: 'Data & Persistence',                 seoSlug: 'python-sql-interview-questions',         blurb: 'SQLAlchemy, Django ORM, PostgreSQL, MongoDB, Redis.' },
  P04: { id: 'P04', name: 'APIs & Realtime',                    seoSlug: 'python-rest-api-interview-questions',    blurb: 'REST in DRF/FastAPI, WebSockets, SSE.' },
  P05: { id: 'P05', name: 'Async, Messaging, Workers',          seoSlug: 'celery-interview-questions',             blurb: 'Celery, Kafka, RabbitMQ, asyncio at scale.' },
  P06: { id: 'P06', name: 'System Design & LLD',                seoSlug: 'python-system-design-interview-questions', blurb: 'Pythonic architecture, design patterns, clean architecture.' },
  P07: { id: 'P07', name: 'Application Security',               seoSlug: 'python-security-interview-questions',    blurb: 'OWASP in Python context, JWT pitfalls, supply-chain risk.' },
  P08: { id: 'P08', name: 'Testing & Quality',                  seoSlug: 'pytest-interview-questions',             blurb: 'pytest, fixtures, mocking, coverage.' },
  P09: { id: 'P09', name: 'DevOps & Build',                     seoSlug: 'python-docker-interview-questions',      blurb: 'Docker for Python, CI/CD, packaging.' },
  P10: { id: 'P10', name: 'Cloud Platforms',                    seoSlug: 'boto3-aws-python-interview-questions',   blurb: 'AWS via boto3, GCP, Azure for Python services.' },
  P11: { id: 'P11', name: 'Observability & Production',         seoSlug: 'python-observability-interview-questions', blurb: 'OpenTelemetry Python, structured logging, SRE practices.' },
  P12: { id: 'P12', name: 'Engineering Practices & Behavioral', seoSlug: 'python-behavioral-interview-questions',  blurb: 'STAR-method answers grounded in real Python projects.' },
};

export const JAVA_FULLSTACK_PILLARS: Partial<Record<PillarId, PillarMeta>> = {
  P01: { id: 'P01', name: 'Java Language & Core',               seoSlug: 'java-interview-questions',                      blurb: 'Core Java fundamentals every fullstack Java interview anchors on — OOP, collections, streams, concurrency, JVM.' },
  P02: { id: 'P02', name: 'Spring Ecosystem',                   seoSlug: 'spring-interview-questions',                    blurb: 'Spring Core, Boot, Data JPA, Security, and WebFlux — the backend foundation of every Java fullstack app.' },
  P03: { id: 'P03', name: 'Data & Persistence',                 seoSlug: 'sql-interview-questions',                       blurb: 'SQL, MongoDB, Redis, and caching — the data layer every fullstack engineer is expected to own end-to-end.' },
  P04: { id: 'P04', name: 'APIs & Microservices',               seoSlug: 'rest-api-interview-questions',                  blurb: 'REST, GraphQL, gRPC, Kafka, and microservices — the contract surface between your frontend and backend.' },
  P05: { id: 'P05', name: 'Web Foundations',                    seoSlug: 'html-interview-questions',                      blurb: 'HTML5, CSS, Browser internals, and Web Performance — the layer under every React and Angular app.' },
  P06: { id: 'P06', name: 'JavaScript & TypeScript',            seoSlug: 'javascript-interview-questions',                blurb: 'ES6+, async patterns, advanced JS, and TypeScript — the language every frontend interview starts with.' },
  P07: { id: 'P07', name: 'React Ecosystem',                    seoSlug: 'react-interview-questions',                     blurb: 'React hooks, state management, routing, performance, and testing — the dominant frontend framework for Java fullstack roles.' },
  P08: { id: 'P08', name: 'Angular Ecosystem',                  seoSlug: 'angular-interview-questions',                   blurb: 'Angular DI, RxJS, forms, routing, NgRx, and testing — the enterprise frontend framework that pairs with Spring.' },
  P09: { id: 'P09', name: 'Fullstack Integration',              seoSlug: 'fullstack-integration-interview-questions',     blurb: 'API wiring, OAuth flows, WebSockets, file handling — the glue between your React/Angular frontend and Spring backend.' },
  P10: { id: 'P10', name: 'Architecture & Design',              seoSlug: 'design-patterns-interview-questions',           blurb: 'GoF patterns, SOLID, clean architecture, CQRS — the design depth interviewers probe at mid-level and above.' },
  P11: { id: 'P11', name: 'System Design',                      seoSlug: 'system-design-interview-questions',             blurb: 'Scalability, LLD case studies, system design walkthroughs — the round that separates mid from senior.' },
  P12: { id: 'P12', name: 'Application Security',               seoSlug: 'application-security-interview-questions',      blurb: 'OWASP Top 10, XSS, CSRF, JWT pitfalls, secrets management — security in both the frontend and backend layers.' },
  P13: { id: 'P13', name: 'Testing & Quality',                  seoSlug: 'java-testing-interview-questions',              blurb: 'JUnit, Mockito, RTL, Jest, Testcontainers, contract tests — the full test pyramid for fullstack engineers.' },
  P14: { id: 'P14', name: 'DevOps & Build Delivery',            seoSlug: 'devops-interview-questions',                    blurb: 'Git, CI/CD, Docker, K8s, frontend build tools, SSR/CDN delivery — shipping both the frontend and backend.' },
  P15: { id: 'P15', name: 'Cloud & Production',                 seoSlug: 'aws-interview-questions',                       blurb: 'AWS, observability, SRE practices — running a fullstack application in production at scale.' },
  P16: { id: 'P16', name: 'Interview Readiness',                seoSlug: 'behavioral-interview-questions-software-engineer', blurb: 'Engineering practices, leadership, and behavioral depth — the round you cannot brute-force with LeetCode.' },
};

export const JAVA_FULLSTACK_FRESHER_PILLARS: Partial<Record<PillarId, PillarMeta>> = {
  P01: { id: 'P01', name: 'Java Language & Core',           seoSlug: 'java-interview-questions',               blurb: 'Core Java, OOP, collections, and Java 8 — the gatekeeper of every Java fresher interview.' },
  P02: { id: 'P02', name: 'Data Structures & Algorithms',   seoSlug: 'java-dsa-interview-questions',            blurb: 'Arrays, linked lists, trees, graphs, sorting, and DP — the coding round every fresher must crack.' },
  P03: { id: 'P03', name: 'Spring Ecosystem',               seoSlug: 'spring-boot-interview-questions',         blurb: 'Spring Boot, MVC, Data JPA, and Security basics — the backend framework freshers need to know.' },
  P04: { id: 'P04', name: 'Database & SQL',                 seoSlug: 'sql-interview-questions',                 blurb: 'SQL queries, database design basics, and JDBC/JPA — persistence for every Java fresher.' },
  P05: { id: 'P05', name: 'Frontend Foundations',           seoSlug: 'html-css-interview-questions',            blurb: 'HTML, CSS, and JavaScript core — the frontend layer every fullstack fresher is asked about.' },
  P06: { id: 'P06', name: 'React & Frontend Frameworks',    seoSlug: 'react-interview-questions',               blurb: 'React fundamentals and ecosystem — the dominant frontend framework for fullstack Java roles.' },
  P07: { id: 'P07', name: 'Fullstack Integration',          seoSlug: 'fullstack-integration-interview-questions', blurb: 'REST API wiring, authentication, and fullstack data flow — connecting the backend to the frontend.' },
  P08: { id: 'P08', name: 'Design & Architecture Basics',   seoSlug: 'design-patterns-interview-questions',     blurb: 'Design patterns intro and system design fundamentals — what freshers are asked to explain.' },
  P09: { id: 'P09', name: 'DevOps & Developer Tools',       seoSlug: 'git-interview-questions',                 blurb: 'Git, Maven, Docker basics, and testing — the day-one toolchain every fresher must know.' },
  P10: { id: 'P10', name: 'Interview Readiness',            seoSlug: 'behavioral-interview-questions',          blurb: 'Behavioral, HR, and scenario questions — the round freshers are least prepared for.' },
};

export const GO_PILLARS: Partial<Record<PillarId, PillarMeta>> = {
  P01: { id: 'P01', name: 'Go Language & Core',               seoSlug: 'golang-interview-questions',                    blurb: 'Core Go types, interfaces, embedding, generics, error handling, and the runtime — the foundation every Go interview builds on.' },
  P02: { id: 'P02', name: 'Concurrency & Async',              seoSlug: 'golang-goroutines-interview-questions',          blurb: 'Goroutines, channels, select, context, sync, and advanced concurrency patterns — the reason Go exists.' },
  P03: { id: 'P03', name: 'Web Frameworks',                   seoSlug: 'golang-net-http-interview-questions',            blurb: 'net/http stdlib, Gin, Echo, Chi, Fiber — the HTTP layer every Go backend service is built on.' },
  P04: { id: 'P04', name: 'Data & Persistence',               seoSlug: 'golang-database-sql-interview-questions',        blurb: 'database/sql, sqlx, GORM, pgx, Redis — storing and querying data from Go services.' },
  P05: { id: 'P05', name: 'APIs & Messaging',                 seoSlug: 'golang-rest-api-interview-questions',            blurb: 'REST, gRPC, Kafka, NATS, GraphQL — the contract surface every Go microservice exposes.' },
  P06: { id: 'P06', name: 'Architecture & Design',            seoSlug: 'golang-design-patterns-interview-questions',     blurb: 'Go design patterns, functional options, clean architecture, hexagonal — idiomatic Go at scale.' },
  P07: { id: 'P07', name: 'System Design',                    seoSlug: 'golang-system-design-interview-questions',       blurb: 'Capacity estimation, caching, microservices, system design cases — architecture anchored to Go.' },
  P08: { id: 'P08', name: 'Application Security',             seoSlug: 'golang-security-interview-questions',            blurb: 'OWASP in Go, JWT, OAuth2, TLS configuration, secrets management.' },
  P09: { id: 'P09', name: 'Testing & Quality',                seoSlug: 'golang-testing-interview-questions',             blurb: 'testing package, table-driven tests, gomock, testcontainers, race detector.' },
  P10: { id: 'P10', name: 'DevOps & Build',                   seoSlug: 'docker-golang-interview-questions',              blurb: 'Docker multi-stage builds, CI/CD, golangci-lint, Go modules — shipping Go to production.' },
  P11: { id: 'P11', name: 'Cloud & Production',               seoSlug: 'golang-aws-interview-questions',                 blurb: 'AWS sdk-go-v2, OpenTelemetry, pprof, SLOs, graceful shutdown — Go services in production.' },
  P12: { id: 'P12', name: 'Engineering Practices & Behavioral', seoSlug: 'golang-behavioral-interview-questions',        blurb: 'STAR answers grounded in real Go projects and production incidents.' },
};

export const GO_FRESHER_PILLARS: Partial<Record<PillarId, PillarMeta>> = {
  P01: { id: 'P01', name: 'Go Language Basics',               seoSlug: 'golang-interview-questions-for-freshers',        blurb: 'Go syntax, types, structs, methods, and interfaces — the entry point for every Go fresher interview.' },
  P02: { id: 'P02', name: 'Slices, Maps & Collections',       seoSlug: 'golang-slices-interview-questions',              blurb: 'Slices, maps, arrays, and their internals — the data structures every Go fresher must know.' },
  P03: { id: 'P03', name: 'Error Handling',                   seoSlug: 'golang-error-handling-interview-questions-basics', blurb: 'Errors as values, the error interface, and idiomatic Go error patterns for freshers.' },
  P04: { id: 'P04', name: 'Concurrency Basics',               seoSlug: 'golang-goroutines-channels-interview-questions',  blurb: 'Goroutines, channels, and basic sync — Go concurrency explained from first principles.' },
  P05: { id: 'P05', name: 'I/O & Standard Library',           seoSlug: 'golang-file-io-interview-questions',             blurb: 'File I/O, JSON encoding, and the Go standard library essentials every fresher uses.' },
  P06: { id: 'P06', name: 'Data Structures & Algorithms',     seoSlug: 'golang-data-structures-interview-questions',      blurb: 'DSA in Go — sorting, binary search, maps for frequency counting, Big-O with Go built-ins.' },
  P07: { id: 'P07', name: 'Testing Basics',                   seoSlug: 'golang-testing-basics-interview-questions',       blurb: 'The testing package, table-driven tests, and go test — how Go tests are written.' },
  P08: { id: 'P08', name: 'Build & Dependencies',             seoSlug: 'golang-modules-basics-interview-questions',       blurb: 'go.mod, go.sum, go get, packages — Go module basics every fresher must understand.' },
  P09: { id: 'P09', name: 'Web Basics',                       seoSlug: 'golang-http-server-interview-questions',          blurb: 'net/http basics and simple HTTP servers — building a REST endpoint in Go.' },
  P10: { id: 'P10', name: 'DevOps Basics',                    seoSlug: 'docker-golang-basics-interview-questions',        blurb: 'Docker multi-stage builds for Go — why Go is perfect for small production containers.' },
  P11: { id: 'P11', name: 'Cloud Fundamentals',               seoSlug: 'golang-cloud-deployment-interview-questions',     blurb: 'Twelve-factor app, health checks, Kubernetes basics — deploying Go services to the cloud.' },
  P12: { id: 'P12', name: 'Interview Readiness',              seoSlug: 'golang-fresher-interview-scenarios',              blurb: 'Scenario questions, coding patterns, and the Go-specific traps every fresher interview sets.' },
};

export const RUBY_PILLARS: Partial<Record<PillarId, PillarMeta>> = {
  P01: { id: 'P01', name: 'Core Language',            seoSlug: 'ruby-interview-questions',                   blurb: 'Ruby syntax, OOP, blocks, modules, metaprogramming, concurrency.' },
  P02: { id: 'P02', name: 'Web Frameworks',            seoSlug: 'rails-interview-questions',                  blurb: 'Rails MVC, Action Controller, routing, views, Hotwire, Turbo, Sinatra.' },
  P03: { id: 'P03', name: 'Data and ORM',              seoSlug: 'active-record-interview-questions',          blurb: 'Active Record, associations, query interface, migrations, Sequel.' },
  P04: { id: 'P04', name: 'APIs and Messaging',        seoSlug: 'rails-api-interview-questions',              blurb: 'Rails API mode, GraphQL, auth, Sidekiq, Action Cable.' },
  P05: { id: 'P05', name: 'Async and Background Jobs', seoSlug: 'sidekiq-interview-questions',                blurb: 'Sidekiq deep, Active Job, Action Mailer, pub-sub patterns.' },
  P06: { id: 'P06', name: 'Design Patterns',           seoSlug: 'ruby-design-patterns-interview-questions',   blurb: 'SOLID, service objects, design patterns, clean architecture.' },
  P07: { id: 'P07', name: 'System Design',             seoSlug: 'ruby-system-design-interview-questions',     blurb: 'Scaling Rails, caching, background jobs, multi-tenancy.' },
  P08: { id: 'P08', name: 'Security',                  seoSlug: 'rails-security-interview-questions',         blurb: 'Rails security, OWASP, secrets management, Devise, strong params.' },
  P09: { id: 'P09', name: 'Testing',                   seoSlug: 'rspec-interview-questions',                  blurb: 'RSpec, Capybara, FactoryBot, VCR, contract testing.' },
  P10: { id: 'P10', name: 'DevOps and Cloud',          seoSlug: 'ruby-devops-interview-questions',            blurb: 'Docker Rails, Heroku vs AWS, deployment, CI/CD.' },
  P11: { id: 'P11', name: 'Observability',             seoSlug: 'ruby-observability-interview-questions',     blurb: 'Logging, metrics, distributed tracing, production debugging.' },
  P12: { id: 'P12', name: 'Behavioral',                seoSlug: 'ruby-behavioral-interview-questions',        blurb: 'System design communication, behavioral, engineering practices.' },
};

export const FRONTEND_FRESHER_PILLARS: Partial<Record<PillarId, PillarMeta>> = {
  P01: { id: 'P01', name: 'Web Foundations',        seoSlug: 'html-css-interview-questions',                  blurb: 'HTML5, CSS layouts, and responsive design — the base every frontend fresher is tested on.' },
  P02: { id: 'P02', name: 'JavaScript Core',        seoSlug: 'javascript-interview-questions-for-freshers',   blurb: 'Variables, closures, DOM, events, and async basics — the JS fundamentals every fresher must know.' },
  P03: { id: 'P03', name: 'Browser & DOM',          seoSlug: 'dom-interview-questions',                       blurb: 'How browsers work, DOM manipulation, event bubbling, and Web Storage.' },
  P04: { id: 'P04', name: 'React Fundamentals',     seoSlug: 'react-interview-questions-for-freshers',        blurb: 'Components, hooks, state, and forms — the React core every frontend fresher is quizzed on.' },
  P05: { id: 'P05', name: 'TypeScript Basics',      seoSlug: 'typescript-interview-questions-for-freshers',   blurb: 'Types, interfaces, and generics — why TypeScript matters and how to use it from day one.' },
  P06: { id: 'P06', name: 'Angular Basics',         seoSlug: 'angular-interview-questions-for-freshers',      blurb: 'Components, directives, services, and DI basics — Angular fundamentals for freshers.' },
  P07: { id: 'P07', name: 'Tooling & Git',              seoSlug: 'git-interview-questions-frontend',              blurb: 'Git, npm, Vite/Webpack basics, and DevTools — the day-one toolchain every fresher must know.' },
  P08: { id: 'P08', name: 'Interview Readiness',        seoSlug: 'frontend-interview-questions-fresher',          blurb: 'Common patterns, HR questions, and how to explain your projects — the round freshers are least prepared for.' },
  P09: { id: 'P09', name: 'DSA Basics',                 seoSlug: 'javascript-dsa-interview-questions-freshers',   blurb: 'Arrays, strings, hashmaps, and sorting in JavaScript — the coding round every frontend fresher faces.' },
  P10: { id: 'P10', name: 'Modern Frontend Frameworks', seoSlug: 'nextjs-interview-questions-freshers',           blurb: 'Next.js, SSR vs SSG, App Router, and deployment — the modern stack interviewers expect freshers to know.' },
};

export const FRONTEND_INTERMEDIATE_PILLARS: Partial<Record<PillarId, PillarMeta>> = {
  P01: { id: 'P01', name: 'JavaScript & TypeScript',     seoSlug: 'javascript-typescript-interview-questions',    blurb: 'Advanced JS patterns, closures, async, TypeScript generics — the language depth interviewers probe.' },
  P02: { id: 'P02', name: 'Web Foundations',             seoSlug: 'html-css-interview-questions-intermediate',    blurb: 'HTML5, CSS layouts, browser internals, and accessibility — the platform every frontend app runs on.' },
  P03: { id: 'P03', name: 'React Ecosystem',             seoSlug: 'react-interview-questions',                    blurb: 'Hooks, state management, performance patterns, routing, forms, and testing — the dominant frontend framework.' },
  P04: { id: 'P04', name: 'Angular Ecosystem',           seoSlug: 'angular-interview-questions',                  blurb: 'DI, RxJS operators, NgRx, forms, routing, and testing — the enterprise-grade framework.' },
  P05: { id: 'P05', name: 'Testing & Quality',           seoSlug: 'frontend-testing-interview-questions',         blurb: 'RTL, Jest, Cypress, Playwright, contract tests — the test pyramid for frontend engineers.' },
  P06: { id: 'P06', name: 'Web Performance',             seoSlug: 'web-performance-interview-questions',          blurb: 'Core Web Vitals, rendering pipeline, code splitting, image optimization — what separates mid from senior.' },
  P07: { id: 'P07', name: 'Build Tools & DevOps',        seoSlug: 'webpack-vite-interview-questions',             blurb: 'Webpack, Vite, module federation, SSR/SSG, Docker, CI/CD — shipping frontend to production.' },
  P08: { id: 'P08', name: 'APIs & Realtime',             seoSlug: 'frontend-api-interview-questions',             blurb: 'Fetch, Axios, interceptors, WebSockets, SSE, auth flows — the contract between frontend and backend.' },
  P09: { id: 'P09', name: 'Architecture & Patterns',     seoSlug: 'frontend-architecture-interview-questions',    blurb: 'Component design patterns, micro-frontends, state architecture, clean code.' },
  P10: { id: 'P10', name: 'Application Security',        seoSlug: 'frontend-security-interview-questions',        blurb: 'XSS, CSRF, CSP, JWT pitfalls, OAuth flows — security in the browser layer.' },
  P11: { id: 'P11', name: 'System Design',               seoSlug: 'frontend-system-design-interview-questions',   blurb: 'Design a feed, infinite scroll, design systems, real-time dashboards — senior frontend scope.' },
  P12: { id: 'P12', name: 'Engineering Practices',       seoSlug: 'frontend-behavioral-interview-questions',      blurb: 'How you work, communicate trade-offs, and grow as a frontend engineer.' },
};

export function pillarsFor(domainSlug: string): Partial<Record<PillarId, PillarMeta>> {
  if (domainSlug === 'frontend-fresher') return FRONTEND_FRESHER_PILLARS;
  if (domainSlug.startsWith('frontend-')) return FRONTEND_INTERMEDIATE_PILLARS;
  if (domainSlug.startsWith('python-')) return PYTHON_PILLARS;
  if (domainSlug === 'java-fullstack-fresher') return JAVA_FULLSTACK_FRESHER_PILLARS;
  if (domainSlug.startsWith('java-fullstack-')) return JAVA_FULLSTACK_PILLARS;
  if (domainSlug === 'go-fresher') return GO_FRESHER_PILLARS;
  if (domainSlug.startsWith('go-')) return GO_PILLARS;
  if (domainSlug.startsWith('ruby-')) return RUBY_PILLARS;
  return JAVA_PILLARS;
}

export const PILLAR_ORDER: readonly PillarId[] = [
  'P01', 'P02', 'P03', 'P04', 'P05', 'P06',
  'P07', 'P08', 'P09', 'P10', 'P11', 'P12',
  'P13', 'P14', 'P15', 'P16', 'P17', 'P18',
];
