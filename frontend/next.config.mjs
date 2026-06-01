import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.join(__dirname, '..');

/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },

  // Let file-tracing walk into the sibling `content/` directory — lib/seo-slugs.ts
  // imports `../../content/java-backend-intermediate/_index.json` as the single
  // source of truth for SEO module names.
  outputFileTracingRoot: repoRoot,

  // Pin Turbopack's workspace root to the repo root so that sibling imports
  // from `../../content/...` resolve cleanly while still keeping a predictable
  // root (previously there was a dup root package-lock.json creating ambiguity).
  turbopack: {
    root: repoRoot,
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
