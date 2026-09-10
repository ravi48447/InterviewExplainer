# Launching InterviewExplainer (dev)

The frontend (Next.js 16 + Turbopack) reads content directly from `content/`
via server-only API routes, so you do **not** need the Spring Boot backend
running for local development.

## Prereqs
- Node 20+
- npm 10+

## First-time setup
```bash
npm run install:all    # installs frontend deps
```

## Start the dev server
```bash
npm run dev            # shortcut for: cd frontend && npm run dev
```
The app will be at http://localhost:3000.

## Other useful scripts
```bash
npm run build          # production build
npm run start          # start production server
npm run coverage:jbi   # scan content/java-backend-intermediate and print
                       # which topics / questions still need answers
                       # (detailed report written to scripts/output/jbi-coverage.json)
```

## Env
`.env` (root) holds the Anthropic key used only by the content generators
under `scripts/`. It is **not** required to run the app.

## Performance notes (dev mode)
- `frontend/next.config.mjs` pins Turbopack's workspace root to `/frontend` so
  the large `content/` tree is not re-walked on every HMR cycle.
- `experimental.optimizePackageImports` tree-shakes lucide-react, date-fns,
  recharts, framer-motion, and every radix-ui package we use.
- `experimental.staleTimes` keeps the client router cache warm for 60s on
  dynamic pages — prev/next navigation between questions reuses the rendered
  shell instead of re-fetching from the dev server.
- `components/MermaidDiagram.tsx` lazy-imports the `mermaid` library inside
  the client effect. Pages without a ```mermaid code fence never download
  the ~1 MB diagram runtime.
