#!/usr/bin/env python3
"""
seed_java_fullstack_intermediate.py

Phase-1 scaffolding generator for the `java-fullstack-intermediate` track.

What it produces
================
  content/java-fullstack-intermediate/
      _index.json                 <- single registry of all 54 modules
      <new-module-slug>/          <- physical folder per NEW fullstack module
          _config.json
          <topic-slug>/           <- empty topic folder (questions added later)
          ...

Reused modules (core-java, spring-boot, SQL, Docker, …) are declared in
_index.json but have NO physical folder on disk. The frontend content-reader
transparently serves their content from content/java-backend-intermediate/.
The same mechanism lets Python tracks reuse cross-cutting modules later.

Idempotent: safe to re-run. Existing topic folders / _config.json files are
left untouched (we never overwrite Phase-2 content).
"""

from __future__ import annotations

import json
import os
from pathlib import Path
from typing import Any

REPO_ROOT = Path(__file__).resolve().parent.parent
JFI_ROOT = REPO_ROOT / "content" / "java-fullstack-intermediate"
JBI_INDEX = REPO_ROOT / "content" / "java-backend-intermediate" / "_index.json"

DOMAIN_SLUG = "java-fullstack-intermediate"
APP_URL_PREFIX = f"/{DOMAIN_SLUG}"
SEO_SUFFIX = "fullstack-interview-questions"


# ─── Modules reused from JBI (no physical folder, resolved via fallback) ──────
# moduleSlug → keep everything from JBI's entry, only override:
#   appUrl, seoSlug (and altSlugs/altUrls cleared to avoid collision with JBI).
REUSED_MODULE_SLUGS = [
    # P01 Java Language & Core
    "core-java", "java-collections", "java-streams", "java-concurrency", "jvm-internals",
    # P02 Spring Ecosystem
    "spring-core", "spring-boot", "spring-data-jpa", "spring-security",
    "spring-webflux", "spring-batch",
    # P03 Data & Persistence
    "sql-databases", "nosql-mongodb", "redis-caching",
    # P04 APIs, Microservices & Messaging
    "rest-api", "microservices", "messaging-events",
    # P05 Architecture & Design
    "design-patterns", "architecture-patterns",
    # P06 System Design
    "system-design", "system-design-cases", "low-level-design",
    # P07 Security
    "application-security",
    # P08 Testing & Quality
    "unit-testing", "advanced-testing",
    # P09 DevOps
    "git-build-tools", "cicd", "docker", "kubernetes",
    # P10 Cloud
    "aws-cloud", "cloud-native",
    # P11 Production
    "observability", "production-sre",
    # P12 Interview Readiness
    "engineering-practices", "behavioral",
]


# ─── New fullstack-specific modules (physical folders created on disk) ────────
# Module numbers M36..M56 continue from JBI's M35.
NEW_MODULES: list[dict[str, Any]] = [
    # ─── P13 Web Foundations ────────────────────────────────────────────────
    {
        "moduleNumber": "M36", "pillar": "P13", "pillarName": "Web Foundations",
        "moduleSlug": "html-accessibility",
        "title": "HTML5 Semantics & Accessibility",
        "seoSlug": "html-interview-questions",
        "altSlugs": ["accessibility-interview-questions", "wcag-interview-questions"],
        "topics": [
            "html5-semantic-elements",
            "forms-and-inputs",
            "aria-roles-and-attributes",
            "wcag-and-accessibility",
            "keyboard-navigation",
            "screen-readers",
            "scenario-based",
        ],
    },
    {
        "moduleNumber": "M37", "pillar": "P13", "pillarName": "Web Foundations",
        "moduleSlug": "css-modern-layouts",
        "title": "Modern CSS & Responsive Design",
        "seoSlug": "css-interview-questions",
        "altSlugs": ["flexbox-interview-questions", "css-grid-interview-questions",
                     "responsive-design-interview-questions"],
        "topics": [
            "css-fundamentals-specificity",
            "flexbox",
            "css-grid",
            "responsive-design",
            "css-variables-and-custom-properties",
            "animations-and-transitions",
            "css-in-js-and-styled-components",
            "tailwind-and-utility-css",
            "scenario-based",
            "comparisons",
        ],
    },
    {
        "moduleNumber": "M38", "pillar": "P13", "pillarName": "Web Foundations",
        "moduleSlug": "browser-internals",
        "title": "Browser Internals & DOM",
        "seoSlug": "browser-interview-questions",
        "altSlugs": ["dom-interview-questions", "event-loop-interview-questions"],
        "topics": [
            "browser-rendering-pipeline",
            "dom-and-virtual-dom",
            "event-loop-and-microtasks",
            "storage-cookies-localstorage-indexeddb",
            "fetch-and-xhr",
            "service-workers-and-pwa",
            "web-workers",
            "cors-and-same-origin",
            "scenario-based",
        ],
    },
    {
        "moduleNumber": "M39", "pillar": "P13", "pillarName": "Web Foundations",
        "moduleSlug": "web-performance-seo",
        "title": "Web Performance & SEO",
        "seoSlug": "web-performance-interview-questions",
        "altSlugs": ["core-web-vitals-interview-questions", "frontend-seo-interview-questions"],
        "topics": [
            "core-web-vitals",
            "critical-rendering-path",
            "lazy-loading-and-code-splitting",
            "image-and-asset-optimization",
            "caching-and-http2-http3",
            "seo-fundamentals-frontend",
            "meta-tags-and-structured-data",
            "performance-budgets-and-profiling",
            "scenario-based",
        ],
    },

    # ─── P14 JavaScript & TypeScript ────────────────────────────────────────
    {
        "moduleNumber": "M40", "pillar": "P14", "pillarName": "JavaScript & TypeScript",
        "moduleSlug": "javascript-core",
        "title": "JavaScript Core (ES6+)",
        "seoSlug": "javascript-interview-questions",
        "altSlugs": ["es6-interview-questions", "javascript-fundamentals-interview-questions"],
        "topics": [
            "variables-scope-and-hoisting",
            "closures",
            "prototypes-and-inheritance",
            "this-and-binding",
            "promises-and-async-await",
            "event-loop-and-concurrency",
            "modules-esm-vs-commonjs",
            "iterators-generators",
            "error-handling",
            "scenario-based",
            "comparisons",
        ],
    },
    {
        "moduleNumber": "M41", "pillar": "P14", "pillarName": "JavaScript & TypeScript",
        "moduleSlug": "javascript-advanced",
        "title": "Advanced JavaScript Patterns",
        "seoSlug": "advanced-javascript-interview-questions",
        "altSlugs": ["javascript-design-patterns-interview-questions"],
        "topics": [
            "functional-programming",
            "currying-composition-partial-application",
            "memory-management-and-leaks",
            "design-patterns-in-javascript",
            "debouncing-throttling",
            "deep-clone-and-immutability",
            "proxy-and-reflect",
            "scenario-based",
        ],
    },
    {
        "moduleNumber": "M42", "pillar": "P14", "pillarName": "JavaScript & TypeScript",
        "moduleSlug": "typescript-essentials",
        "title": "TypeScript Essentials",
        "seoSlug": "typescript-interview-questions",
        "altSlugs": ["typescript-generics-interview-questions"],
        "topics": [
            "types-and-interfaces",
            "type-narrowing-and-guards",
            "generics",
            "utility-types",
            "advanced-types-conditional-and-mapped",
            "decorators",
            "tsconfig-and-project-setup",
            "typescript-with-react",
            "scenario-based",
            "comparisons",
        ],
    },

    # ─── P15 React Ecosystem ────────────────────────────────────────────────
    {
        "moduleNumber": "M43", "pillar": "P15", "pillarName": "React Ecosystem",
        "moduleSlug": "react-core",
        "title": "React Core & Hooks",
        "seoSlug": "react-interview-questions",
        "altSlugs": ["react-hooks-interview-questions", "reactjs-interview-questions"],
        "topics": [
            "components-and-jsx",
            "props-and-state",
            "hooks-use-state-use-effect",
            "hooks-use-ref-use-memo-use-callback",
            "hooks-use-context-use-reducer",
            "custom-hooks",
            "lifecycle-and-effects",
            "error-boundaries",
            "suspense-and-concurrent-features",
            "scenario-based",
            "comparisons",
        ],
    },
    {
        "moduleNumber": "M44", "pillar": "P15", "pillarName": "React Ecosystem",
        "moduleSlug": "react-state-data",
        "title": "React State Management & Data Fetching",
        "seoSlug": "react-redux-interview-questions",
        "altSlugs": ["redux-interview-questions", "react-query-interview-questions",
                     "zustand-interview-questions"],
        "topics": [
            "context-api-patterns",
            "redux-fundamentals",
            "redux-toolkit",
            "zustand-and-jotai",
            "react-query-tanstack",
            "swr",
            "server-components-and-data",
            "optimistic-updates-and-caching",
            "scenario-based",
            "comparisons",
        ],
    },
    {
        "moduleNumber": "M45", "pillar": "P15", "pillarName": "React Ecosystem",
        "moduleSlug": "react-routing-forms",
        "title": "React Router & Forms",
        "seoSlug": "react-router-interview-questions",
        "altSlugs": ["react-forms-interview-questions"],
        "topics": [
            "react-router-basics",
            "nested-routes-and-layouts",
            "route-guards-and-loaders",
            "forms-controlled-vs-uncontrolled",
            "react-hook-form",
            "formik-and-yup",
            "validation-with-zod",
            "file-upload-handling",
            "scenario-based",
        ],
    },
    {
        "moduleNumber": "M46", "pillar": "P15", "pillarName": "React Ecosystem",
        "moduleSlug": "react-performance-patterns",
        "title": "React Performance & Design Patterns",
        "seoSlug": "react-performance-interview-questions",
        "altSlugs": ["react-patterns-interview-questions"],
        "topics": [
            "reconciliation-and-keys",
            "memoization-memo-and-usememo",
            "code-splitting-and-lazy",
            "virtualization-and-windowing",
            "render-optimization",
            "higher-order-components",
            "render-props",
            "compound-components",
            "provider-and-container-patterns",
            "scenario-based",
            "comparisons",
        ],
    },
    {
        "moduleNumber": "M47", "pillar": "P15", "pillarName": "React Ecosystem",
        "moduleSlug": "react-testing",
        "title": "React Testing (RTL, Jest, E2E)",
        "seoSlug": "react-testing-interview-questions",
        "altSlugs": ["react-testing-library-interview-questions", "jest-interview-questions"],
        "topics": [
            "jest-fundamentals",
            "react-testing-library",
            "testing-hooks-and-context",
            "mocking-fetch-and-modules",
            "snapshot-testing",
            "e2e-with-playwright",
            "e2e-with-cypress",
            "scenario-based",
        ],
    },

    # ─── P16 Angular Ecosystem ──────────────────────────────────────────────
    {
        "moduleNumber": "M48", "pillar": "P16", "pillarName": "Angular Ecosystem",
        "moduleSlug": "angular-core",
        "title": "Angular Core & DI",
        "seoSlug": "angular-interview-questions",
        "altSlugs": ["angular-basics-interview-questions"],
        "topics": [
            "modules-and-components",
            "dependency-injection",
            "directives-structural-and-attribute",
            "pipes-builtin-and-custom",
            "lifecycle-hooks",
            "change-detection",
            "services-and-providers",
            "standalone-components-and-signals",
            "scenario-based",
            "comparisons",
        ],
    },
    {
        "moduleNumber": "M49", "pillar": "P16", "pillarName": "Angular Ecosystem",
        "moduleSlug": "angular-rxjs",
        "title": "Angular RxJS & Reactive Programming",
        "seoSlug": "rxjs-interview-questions",
        "altSlugs": ["angular-rxjs-interview-questions"],
        "topics": [
            "observables-vs-promises",
            "operators-map-switchmap-mergemap",
            "subjects-and-behaviorsubjects",
            "error-handling-in-rxjs",
            "multicasting-and-hot-cold",
            "schedulers",
            "rxjs-with-http-and-forms",
            "scenario-based",
        ],
    },
    {
        "moduleNumber": "M50", "pillar": "P16", "pillarName": "Angular Ecosystem",
        "moduleSlug": "angular-forms-router",
        "title": "Angular Forms & Router",
        "seoSlug": "angular-forms-interview-questions",
        "altSlugs": ["angular-router-interview-questions",
                     "angular-reactive-forms-interview-questions"],
        "topics": [
            "template-driven-forms",
            "reactive-forms",
            "custom-validators-and-async-validators",
            "router-basics-and-route-guards",
            "lazy-loading-modules",
            "resolvers-and-preloading",
            "scenario-based",
        ],
    },
    {
        "moduleNumber": "M51", "pillar": "P16", "pillarName": "Angular Ecosystem",
        "moduleSlug": "angular-state-testing",
        "title": "Angular State Management & Testing",
        "seoSlug": "ngrx-interview-questions",
        "altSlugs": ["angular-testing-interview-questions", "angular-ngrx-interview-questions"],
        "topics": [
            "ngrx-fundamentals",
            "ngrx-effects-and-selectors",
            "ngrx-component-store",
            "akita-and-alternatives",
            "testbed-and-unit-testing",
            "karma-and-jasmine",
            "component-testing",
            "e2e-with-cypress",
            "scenario-based",
            "comparisons",
        ],
    },

    # ─── P17 Fullstack Integration ──────────────────────────────────────────
    {
        "moduleNumber": "M52", "pillar": "P17", "pillarName": "Fullstack Integration",
        "moduleSlug": "api-integration",
        "title": "Frontend-Backend API Integration",
        "seoSlug": "api-integration-interview-questions",
        "altSlugs": ["axios-interview-questions", "fetch-api-interview-questions"],
        "topics": [
            "fetch-vs-axios",
            "interceptors-and-auth-headers",
            "request-cancellation-and-abortcontroller",
            "retries-and-backoff",
            "error-handling-patterns",
            "cors-and-preflight",
            "caching-strategies-frontend",
            "graphql-clients-apollo-urql",
            "scenario-based",
            "comparisons",
        ],
    },
    {
        "moduleNumber": "M53", "pillar": "P17", "pillarName": "Fullstack Integration",
        "moduleSlug": "auth-flows-frontend",
        "title": "Frontend Authentication & SSO Flows",
        "seoSlug": "frontend-authentication-interview-questions",
        "altSlugs": ["jwt-frontend-interview-questions", "oauth2-frontend-interview-questions"],
        "topics": [
            "jwt-storage-localstorage-vs-cookie",
            "oauth2-flows-pkce-and-code",
            "oidc-and-id-tokens",
            "sso-saml-flows",
            "refresh-tokens-and-silent-renew",
            "session-management-and-logout",
            "xss-csrf-frontend-defenses",
            "secure-cookie-flags",
            "scenario-based",
        ],
    },
    {
        "moduleNumber": "M54", "pillar": "P17", "pillarName": "Fullstack Integration",
        "moduleSlug": "realtime-uploads",
        "title": "Real-Time, WebSockets & File Handling",
        "seoSlug": "websockets-interview-questions",
        "altSlugs": ["server-sent-events-interview-questions",
                     "file-upload-interview-questions"],
        "topics": [
            "websockets-basics",
            "stomp-and-sockjs",
            "server-sent-events",
            "long-polling-and-fallbacks",
            "file-upload-multipart",
            "chunked-and-resumable-uploads",
            "file-download-and-streaming",
            "scenario-based",
        ],
    },

    # ─── P18 Frontend Build & Delivery ──────────────────────────────────────
    {
        "moduleNumber": "M55", "pillar": "P18", "pillarName": "Frontend Build & Delivery",
        "moduleSlug": "frontend-build-tools",
        "title": "Frontend Build Tools & Bundlers",
        "seoSlug": "webpack-interview-questions",
        "altSlugs": ["vite-interview-questions", "frontend-build-interview-questions",
                     "npm-interview-questions"],
        "topics": [
            "npm-yarn-and-pnpm",
            "package-json-and-lockfiles",
            "semver-and-dependency-management",
            "webpack-config-and-loaders",
            "vite-and-esbuild",
            "babel-and-swc",
            "tree-shaking-and-code-splitting",
            "module-federation",
            "monorepo-tools-nx-turborepo",
            "scenario-based",
            "comparisons",
        ],
    },
    {
        "moduleNumber": "M56", "pillar": "P18", "pillarName": "Frontend Build & Delivery",
        "moduleSlug": "frontend-devops-ssr",
        "title": "Frontend DevOps, SSR & Delivery",
        "seoSlug": "ssr-interview-questions",
        "altSlugs": ["nextjs-interview-questions", "frontend-deployment-interview-questions"],
        "topics": [
            "ssr-csr-ssg-and-isr",
            "nextjs-app-router-fundamentals",
            "angular-universal-ssr",
            "static-hosting-cdn-netlify-vercel",
            "nginx-for-spa",
            "docker-for-frontend",
            "preview-environments-and-feature-flags",
            "scenario-based",
            "comparisons",
        ],
    },
]


# ─── Helpers ─────────────────────────────────────────────────────────────────


def load_jbi_index() -> dict[str, Any]:
    with JBI_INDEX.open("r", encoding="utf-8") as f:
        return json.load(f)


def build_reused_entry(jbi_entry: dict[str, Any]) -> dict[str, Any]:
    """Take a JBI module entry and rewrite it for JFI (same content, new URLs)."""
    module_slug = jbi_entry["moduleSlug"]
    seo_slug = f"{module_slug}-{SEO_SUFFIX}"  # distinct from JBI's SEO slug

    return {
        "moduleNumber": jbi_entry["moduleNumber"],
        "pillar": jbi_entry["pillar"],
        "pillarName": jbi_entry["pillarName"],
        "moduleSlug": module_slug,
        "title": jbi_entry["title"],
        "appUrl": f"{APP_URL_PREFIX}/{module_slug}",
        "seoSlug": seo_slug,
        "seoUrl": f"/{seo_slug}",
        "altSlugs": [],   # keep clean — JBI owns the canonical short alts
        "altUrls": [],
        "topics": list(jbi_entry.get("topics", [])),
        # Resolution hint for the content-reader: load content from JBI.
        "contentSource": {
            "domain": "java-backend-intermediate",
            "moduleSlug": module_slug,
        },
    }


def build_new_entry(mod: dict[str, Any]) -> dict[str, Any]:
    """Build the _index.json entry for a NEW fullstack module."""
    module_slug = mod["moduleSlug"]
    seo_slug = mod["seoSlug"]
    return {
        "moduleNumber": mod["moduleNumber"],
        "pillar": mod["pillar"],
        "pillarName": mod["pillarName"],
        "moduleSlug": module_slug,
        "title": mod["title"],
        "appUrl": f"{APP_URL_PREFIX}/{module_slug}",
        "seoSlug": seo_slug,
        "seoUrl": f"/{seo_slug}",
        "altSlugs": list(mod.get("altSlugs", [])),
        "altUrls": [f"/{s}" for s in mod.get("altSlugs", [])],
        "topics": list(mod["topics"]),
    }


def write_if_absent(path: Path, payload: Any) -> bool:
    """Write JSON only when the file doesn't already exist. Returns True if wrote."""
    if path.exists():
        return False
    path.parent.mkdir(parents=True, exist_ok=True)
    with path.open("w", encoding="utf-8") as f:
        json.dump(payload, f, indent=2, ensure_ascii=False)
        f.write("\n")
    return True


def write_index(path: Path, payload: Any) -> None:
    """Always rewrite _index.json (it's a derived manifest)."""
    path.parent.mkdir(parents=True, exist_ok=True)
    with path.open("w", encoding="utf-8") as f:
        json.dump(payload, f, indent=2, ensure_ascii=False)
        f.write("\n")


# ─── Main ────────────────────────────────────────────────────────────────────


def main() -> None:
    jbi_index = load_jbi_index()
    jbi_by_slug = {m["moduleSlug"]: m for m in jbi_index["modules"]}

    # Validate every reused slug actually exists in JBI.
    missing = [s for s in REUSED_MODULE_SLUGS if s not in jbi_by_slug]
    if missing:
        raise SystemExit(f"[ERR] Reused modules not found in JBI _index.json: {missing}")

    reused_entries = [build_reused_entry(jbi_by_slug[s]) for s in REUSED_MODULE_SLUGS]
    new_entries = [build_new_entry(m) for m in NEW_MODULES]
    all_modules = reused_entries + new_entries

    # Sort entries by (pillar, moduleNumber) so _index.json reads in curriculum order.
    all_modules.sort(key=lambda m: (m["pillar"], m["moduleNumber"]))

    # ── 1. Write _index.json ─────────────────────────────────────────────
    index_payload = {
        "appRoot": APP_URL_PREFIX,
        "totalModules": len(all_modules),
        "reusedFrom": "java-backend-intermediate",
        "modules": all_modules,
    }
    index_path = JFI_ROOT / "_index.json"
    write_index(index_path, index_payload)
    print(f"[OK]  _index.json   ({len(all_modules)} modules: "
          f"{len(reused_entries)} reused + {len(new_entries)} new)")

    # ── 2. Create physical folders + _config.json for NEW modules only ────
    created_configs = 0
    created_topic_dirs = 0
    for mod in NEW_MODULES:
        module_slug = mod["moduleSlug"]
        module_dir = JFI_ROOT / module_slug
        module_dir.mkdir(parents=True, exist_ok=True)

        config_path = module_dir / "_config.json"
        entry = next(e for e in new_entries if e["moduleSlug"] == module_slug)
        if write_if_absent(config_path, entry):
            created_configs += 1

        for topic_slug in mod["topics"]:
            topic_dir = module_dir / topic_slug
            if not topic_dir.exists():
                topic_dir.mkdir(parents=True, exist_ok=True)
                created_topic_dirs += 1

    print(f"[OK]  new modules    {len(NEW_MODULES)} "
          f"(_config.json written: {created_configs}, topic dirs created: {created_topic_dirs})")
    print(f"[OK]  root           {JFI_ROOT}")


if __name__ == "__main__":
    main()
