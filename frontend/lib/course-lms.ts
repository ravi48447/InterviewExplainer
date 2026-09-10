/**
 * Flagship “course” surfaces — Udemy-style layout + hierarchy instead of
 * long nested accordions. Add slugs here to opt a domain into the LMS shell.
 */

export const PREMIUM_COURSE_SLUGS = new Set<string>([
  "java-backend-intermediate",
  "java-backend-fresher",
  "java-fullstack-intermediate",
  "java-fullstack-fresher",
  "python-backend-intermediate",
  "python-backend-fresher",
  "ruby-backend-intermediate",
  "ruby-backend-fresher",
  "go-intermediate",
  "go-fresher",
  "frontend-intermediate",
  "frontend-fresher",
]);

export function isPremiumCourseLms(domainSlug: string): boolean {
  return PREMIUM_COURSE_SLUGS.has(domainSlug);
}

export interface CourseLmsCopy {
  kicker: string;
  /** Replaces auto “Lang Track” hero title when set */
  heroTitle?: string;
  heroSub: string;
  /** Interview-focused outcomes (What you’ll learn) */
  outcomes: string[];
}

const DEFAULT_OUTCOMES = [
  "Answer loop-style questions with clear structure and trade-offs",
  "Navigate Spring, data, and distributed topics in interview order",
  "Practice with difficulty-tagged questions matched to your level",
];

export const COURSE_LMS_COPY: Record<string, CourseLmsCopy> = {
  "java-backend-intermediate": {
    kicker: "Complete interview curriculum",
    heroTitle: "Java Backend Interview Mastery",
    heroSub:
      "A single guided path from language deep-dives through Spring, persistence, messaging, Kubernetes, and design — structured the way hiring loops actually run, not a flat list of topics.",
    outcomes: [
      "Speak fluently on JVM, concurrency, and modern Java (records, virtual threads)",
      "Defend Spring Boot, REST, JPA, transactions, and security decisions under follow-ups",
      "Handle microservices, events, resilience, and K8s ops questions without memorizing buzzwords",
      "Tackle LLD and system design rounds with reusable frameworks",
    ],
  },
  "java-backend-fresher": {
    kicker: "Fresher interview curriculum",
    heroTitle: "Java Backend Interview Prep for Freshers",
    heroSub:
      "Core Java, OOP, collections, Spring Boot, SQL, REST APIs, DSA, and behavioral — everything a 0–2 YOE Java developer needs to crack their first backend interview.",
    outcomes: [
      "Speak confidently on Java syntax, OOP, collections, and exception handling",
      "Explain Spring Boot, REST APIs, JDBC, and JPA the way interviewers actually ask freshers",
      "Solve DSA problems and design simple LLD systems with a repeatable approach",
      "Nail behavioral and HR rounds with structured answers for project discussions and 'tell me about yourself'",
    ],
  },
  "java-fullstack-intermediate": {
    kicker: "End-to-end interview curriculum",
    heroTitle: "Java Fullstack Interview Mastery",
    heroSub:
      "Backend depth plus React, TypeScript, and JavaScript — one roadmap so fullstack loops don’t catch you leaning only on server-side answers.",
    outcomes: [
      "Balance JVM + Spring depth with credible frontend fundamentals",
      "Ship coherent answers across REST, auth, state, and performance",
      "Prep for loops that deliberately cross the API boundary",
    ],
  },
  "java-fullstack-fresher": {
    kicker: "Fresher fullstack curriculum",
    heroTitle: "Java Fullstack Interview Prep for Freshers",
    heroSub:
      "Core Java, DSA, Spring Boot, SQL, HTML/CSS, JavaScript, React, and behavioral — everything a 0–1 YOE fullstack developer needs to crack their first Java fullstack interview.",
    outcomes: [
      "Speak confidently on Core Java, OOP, collections, and Java 8 features the way interviewers probe freshers",
      "Crack DSA coding rounds with arrays, linked lists, trees, graphs, sorting, and dynamic programming",
      "Explain Spring Boot, REST APIs, JPA, and SQL with the clarity freshers need to stand out",
      "Answer React, JavaScript, and frontend questions that fullstack roles ask even for fresher positions",
      "Nail behavioral, system design intro, and HR rounds with structured answers built for 0–1 YOE candidates",
    ],
  },
  "python-backend-intermediate": {
    kicker: "Complete interview curriculum",
    heroTitle: "Python Backend Interview Mastery",
    heroSub:
      "Django, FastAPI, SQLAlchemy, Celery, Redis, and system design — structured the way Python backend hiring loops actually run, from language depth through cloud and production.",
    outcomes: [
      "Speak fluently on Python internals, async, and modern patterns (dataclasses, type hints, protocols)",
      "Defend Django, FastAPI, ORM decisions, and REST design under follow-up questions",
      "Handle messaging, Celery workers, Redis, and PostgreSQL questions without memorizing buzzwords",
      "Tackle system design and LLD rounds grounded in Python idioms",
    ],
  },
  "python-backend-fresher": {
    kicker: "Fresher interview curriculum",
    heroTitle: "Python Backend Interview Prep for Freshers",
    heroSub:
      "Core Python, OOP, Django/FastAPI basics, SQL, REST APIs, and behavioral — everything a 0–2 YOE Python developer needs to crack their first backend interview.",
    outcomes: [
      "Speak confidently on Python syntax, OOP, collections, and built-in functions",
      "Explain Django/FastAPI basics, REST APIs, and SQL the way interviewers quiz freshers",
      "Understand virtual environments, testing basics, and day-one Python toolchain",
      "Nail behavioral rounds with structured answers for project discussions",
    ],
  },
  "ruby-backend-intermediate": {
    kicker: "Complete interview curriculum",
    heroTitle: "Ruby Backend Interview Mastery",
    heroSub:
      "Rails MVC, Active Record, Sidekiq, RSpec, API design, and system design — one guided path covering what Ruby backend loops actually test at the intermediate level.",
    outcomes: [
      "Defend Rails conventions, Active Record queries, and N+1 solutions under follow-ups",
      "Explain Sidekiq, Action Cable, and background job patterns with production context",
      "Handle system design, caching, and multi-tenancy questions confidently",
      "Write testable Ruby and explain RSpec, Capybara, and FactoryBot patterns",
    ],
  },
  "ruby-backend-fresher": {
    kicker: "Fresher interview curriculum",
    heroTitle: "Ruby Backend Interview Prep for Freshers",
    heroSub:
      "Core Ruby, OOP, Rails basics, Active Record, SQL, REST APIs, and behavioral — everything a 0–2 YOE Ruby developer needs to crack their first backend interview.",
    outcomes: [
      "Speak confidently on Ruby syntax, blocks, iterators, and OOP fundamentals",
      "Explain Rails MVC, routing, migrations, and basic Active Record the way interviewers quiz freshers",
      "Understand Git, Bundler, and the Ruby development toolchain from day one",
      "Nail behavioral rounds with structured answers grounded in real project experience",
    ],
  },
  "go-intermediate": {
    kicker: "Complete interview curriculum",
    heroTitle: "Go Backend Interview Mastery",
    heroSub:
      "Goroutines, channels, gRPC, GORM, system design, and cloud — one structured path from Go's concurrency model through production operations, the way Go backend interviews actually run.",
    outcomes: [
      "Explain goroutines, channels, select, and context cancellation under follow-up pressure",
      "Defend interface design, error handling, and idiomatic Go patterns at the architecture level",
      "Handle gRPC, Kafka, REST, and database questions with production-grounded answers",
      "Tackle system design rounds anchored in Go's concurrency and deployment strengths",
    ],
  },
  "go-fresher": {
    kicker: "Fresher interview curriculum",
    heroTitle: "Go Backend Interview Prep for Freshers",
    heroSub:
      "Go syntax, slices, goroutines, error handling, HTTP, and testing — everything a 0–2 YOE Go developer needs to crack their first backend interview.",
    outcomes: [
      "Explain Go syntax, types, structs, and interfaces the way fresher interviews test them",
      "Walk through goroutines, channels, and basic concurrency from first principles",
      "Build and explain a simple HTTP server with net/http and basic JSON handling",
      "Understand go modules, go test, and the Go development workflow from day one",
    ],
  },
  "frontend-intermediate": {
    kicker: "Complete interview curriculum",
    heroTitle: "Frontend Interview Mastery",
    heroSub:
      "JavaScript internals, TypeScript, React, Angular, web performance, build tools, and system design — one structured roadmap for frontend loops that probe real depth, not just framework recall.",
    outcomes: [
      "Speak fluently on closures, event loop, prototypes, and advanced TypeScript patterns",
      "Defend React hooks, state management, and performance optimizations under follow-ups",
      "Handle Angular DI, RxJS operators, and NgRx architecture questions with precision",
      "Tackle frontend system design — infinite scroll, design systems, real-time feeds",
    ],
  },
  "frontend-fresher": {
    kicker: "Fresher interview curriculum",
    heroTitle: "Frontend Interview Prep for Freshers",
    heroSub:
      "HTML, CSS, JavaScript fundamentals, React basics, TypeScript, and Git — everything a 0–2 YOE frontend developer needs to crack their first frontend interview.",
    outcomes: [
      "Explain HTML semantics, CSS layouts, and responsive design the way interviewers quiz freshers",
      "Walk through JavaScript closures, DOM manipulation, and async basics from first principles",
      "Build and explain React components, hooks, and basic routing with confidence",
      "Understand npm, Vite, Git, and the frontend development workflow from day one",
    ],
  },
};

export function getCourseLmsCopy(domainSlug: string): CourseLmsCopy {
  return (
    COURSE_LMS_COPY[domainSlug] ?? {
      kicker: "Interview-ready curriculum",
      heroSub:
        "Structured modules and questions for this track — open any section and learn in order, or jump to weak spots.",
      outcomes: DEFAULT_OUTCOMES,
    }
  );
}
