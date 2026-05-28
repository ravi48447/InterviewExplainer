/**
 * pillars.ts — canonical registry of the 12 pillars.
 * Pillar IDs are shared across Java and Python; names diverge.
 */

export type PillarId =
  | 'P01' | 'P02' | 'P03' | 'P04' | 'P05' | 'P06'
  | 'P07' | 'P08' | 'P09' | 'P10' | 'P11' | 'P12';

export interface PillarMeta {
  id:      PillarId;
  name:    string;
  seoSlug: string;
  blurb:   string;
}

export const JAVA_PILLARS: Record<PillarId, PillarMeta> = {
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

export const PYTHON_PILLARS: Record<PillarId, PillarMeta> = {
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

export function pillarsFor(domainSlug: string): Record<PillarId, PillarMeta> {
  if (domainSlug.startsWith('python-')) return PYTHON_PILLARS;
  return JAVA_PILLARS;
}

export const PILLAR_ORDER: readonly PillarId[] = [
  'P01', 'P02', 'P03', 'P04', 'P05', 'P06',
  'P07', 'P08', 'P09', 'P10', 'P11', 'P12',
];
