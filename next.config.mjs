import path from 'node:path';
import { fileURLToPath } from 'node:url';
import fs from 'node:fs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// The repo ships TWO Next apps that share one `content/` tree at the repo
// root: a root app (`./package.json`) and a nested app (`./frontend/package.json`).
// Either may be the build target on a deploy platform. The `content/` directory
// therefore sits at different relative depths depending on which app is built:
//   - root app      -> content is at <repoRoot>/content  (== ./content from app)
//   - frontend app  -> content is at <repoRoot>/content  (== ../content from app)
// Resolve it robustly by probing candidate locations, so `import "@content/..."`
// works no matter which app the platform builds (fixes the
// "Module not found: Can't resolve '../../content/ruby-backend-intermediate/_index.json'"
// error that occurred when the root app was built and `../../content` escaped
// the checkout).
const contentCandidates = [
  path.join(__dirname, 'content'),        // app at repo root
  path.join(__dirname, '..', 'content'),  // app nested one level below repo root
];
const contentDir = contentCandidates.find((p) => fs.existsSync(p));
if (!contentDir) {
  throw new Error(
    `Could not locate the shared content/ directory. Looked in:\n  ${contentCandidates.join('\n  ')}\n`,
  );
}
// The repo root is the parent of the content dir.
const repoRoot = path.dirname(contentDir);

// Relative path from THIS app's dir to the shared content dir.
// - root app      -> "content"      (content is a child of the app/repo root)
// - frontend app  -> "../content"  (content is the app's sibling at repo root)
// Used as the Turbopack/webpack alias target so `@content/*` resolves to the
// shared content tree regardless of which app is built. Kept relative (never
// absolute) because Turbopack rejects absolute alias targets that resolve
// outside the build project root.
const contentRel = path.relative(__dirname, contentDir);

/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: false,
  },

  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=()',
          },
        ],
      },
    ];
  },

  // Let file-tracing walk into the shared `content/` directory — lib/seo-slugs.ts
  // imports `@content/java-backend-intermediate/_index.json` as the single
  // source of truth for SEO module names.
  outputFileTracingRoot: repoRoot,

  // Pin Turbopack's workspace root to the repo root so that sibling imports
  // from `@content/...` resolve cleanly while still keeping a predictable
  // root (previously there was a dup root package-lock.json creating ambiguity).
  turbopack: {
    root: repoRoot,
    // Alias `@content/*` to the shared content dir at the repo root, so imports
    // resolve identically whether the app is at the repo root or nested under
    // `frontend/`. Replaces the old relative `../../content/...` imports that
    // broke when the root app was the build target (the path escaped the repo).
    // Target is RELATIVE to this app dir (e.g. "../content/*" or "content/*")
    // because Turbopack rejects absolute alias targets outside the project.
    resolveAlias: {
      '@content/*': path.join(contentRel, '/*'),
    },
  },

  // Webpack fallback (used when building without Turbopack or for tooling that
  // reads webpack config). Same `@content/*` -> shared content dir mapping.
  webpack: (config) => {
    config.resolve ??= {};
    config.resolve.alias ??= {};
    config.resolve.alias['@content'] = contentDir;
    return config;
  },

  // Tree-shake huge barrel imports. Without this, every page that does
  // `import { Foo, Bar } from 'lucide-react'` pulls the entire ~1300 icon
  // module graph through SWC, which was the main contributor to the dev-mode
  // OOM and 30s+ first-paint times.
  experimental: {
    // Keep the client-side router cache longer so prev/next navigation between
    // questions reuses the already-rendered shell instead of round-tripping to
    // the server. `dynamic` applies to dynamic segments (our question pages).
    staleTimes: {
      dynamic: 60,
      static: 300,
    },
    optimizePackageImports: [
      'lucide-react',
      'date-fns',
      'recharts',
      'framer-motion',
      '@radix-ui/react-accordion',
      '@radix-ui/react-alert-dialog',
      '@radix-ui/react-avatar',
      '@radix-ui/react-checkbox',
      '@radix-ui/react-collapsible',
      '@radix-ui/react-dialog',
      '@radix-ui/react-dropdown-menu',
      '@radix-ui/react-hover-card',
      '@radix-ui/react-label',
      '@radix-ui/react-navigation-menu',
      '@radix-ui/react-popover',
      '@radix-ui/react-progress',
      '@radix-ui/react-radio-group',
      '@radix-ui/react-scroll-area',
      '@radix-ui/react-select',
      '@radix-ui/react-separator',
      '@radix-ui/react-slot',
      '@radix-ui/react-switch',
      '@radix-ui/react-tabs',
      '@radix-ui/react-toast',
      '@radix-ui/react-toggle',
      '@radix-ui/react-toggle-group',
      '@radix-ui/react-tooltip',
    ],
  },
};

export default nextConfig;
