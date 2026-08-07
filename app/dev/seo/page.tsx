/**
 * app/dev/seo/page.tsx — SEO Audit Dashboard (P02-AD)
 *
 * Visual dashboard showing the output of the comprehensive SEO audit.
 * Only accessible in development (route-registry marks /dev/* as
 * development visibility → noindex).
 */

import {
  runFullValidation,
  auditIndexability,
  auditRendering,
  buildCrawlGraph,
  auditCrawlGraph,
  validateRobotsTxt,
  validateRedirectRegistry,
  auditRewrites,
  getCanonicalOrigin,
} from '@/lib/seo'
import { buildRobotsTxt } from '@/lib/seo/robots'

export const dynamic = 'force-static'

export default function SeoAuditPage() {
  const origin = getCanonicalOrigin()
  const validation = runFullValidation()
  const indexability = auditIndexability()
  const rendering = auditRendering()
  const graph = buildCrawlGraph()
  const crawlGraph = auditCrawlGraph(graph)
  const robots = validateRobotsTxt()
  const redirects = validateRedirectRegistry()
  const rewrites = auditRewrites()
  const robotsBody = buildRobotsTxt()

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-5xl mx-auto space-y-8">
        <header>
          <h1 className="text-3xl font-bold mb-2">SEO Audit Dashboard</h1>
          <p className="text-muted-foreground">
            Origin: <code className="text-foreground">{origin}</code>
          </p>
        </header>

        {/* Summary */}
        <section className="rounded-lg border p-6">
          <h2 className="text-xl font-semibold mb-4">Summary</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className={`text-2xl font-bold ${validation.passed ? 'text-green-600' : 'text-red-600'}`}>
                {validation.passed ? 'PASS' : 'FAIL'}
              </div>
              <div className="text-sm text-muted-foreground">Overall</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">{validation.checks.filter((c) => c.passed).length}</div>
              <div className="text-sm text-muted-foreground">Passed</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-red-600">{validation.checks.filter((c) => !c.passed).length}</div>
              <div className="text-sm text-muted-foreground">Failed</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold">{validation.checks.length}</div>
              <div className="text-sm text-muted-foreground">Total Checks</div>
            </div>
          </div>
        </section>

        {/* Validation Checks */}
        <section className="rounded-lg border p-6">
          <h2 className="text-xl font-semibold mb-4">Validation Checks</h2>
          <div className="space-y-2">
            {validation.checks.map((check) => (
              <div key={check.name} className="flex items-start gap-3">
                <span className={`mt-0.5 inline-block w-2 h-2 rounded-full ${check.passed ? 'bg-green-500' : 'bg-red-500'}`} />
                <div className="flex-1">
                  <div className="font-medium">{check.name}</div>
                  {check.issues && check.issues.length > 0 && (
                    <ul className="mt-1 ml-4 text-sm text-muted-foreground list-disc">
                      {check.issues.slice(0, 5).map((issue, i) => (
                        <li key={i}>{issue}</li>
                      ))}
                      {check.issues.length > 5 && <li>...and {check.issues.length - 5} more</li>}
                    </ul>
                  )}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Indexability */}
        <section className="rounded-lg border p-6">
          <h2 className="text-xl font-semibold mb-4">Indexability</h2>
          <div className="grid grid-cols-3 gap-4">
            <div><span className="text-2xl font-bold text-green-600">{indexability.indexable}</span> indexable</div>
            <div><span className="text-2xl font-bold text-yellow-600">{indexability.noindex}</span> noindex</div>
            <div><span className="text-2xl font-bold text-red-600">{indexability.noindexFollow}</span> noindex,nofollow</div>
          </div>
        </section>

        {/* Rendering */}
        <section className="rounded-lg border p-6">
          <h2 className="text-xl font-semibold mb-4">Rendering Strategy</h2>
          <div className="grid grid-cols-4 gap-4">
            <div><span className="text-2xl font-bold">{rendering.ssr}</span> SSR</div>
            <div><span className="text-2xl font-bold">{rendering.ssg}</span> SSG</div>
            <div><span className="text-2xl font-bold">{rendering.isr}</span> ISR</div>
            <div><span className="text-2xl font-bold">{rendering.csr}</span> CSR</div>
          </div>
        </section>

        {/* Crawl Graph */}
        <section className="rounded-lg border p-6">
          <h2 className="text-xl font-semibold mb-4">Crawl Graph</h2>
          <div className="space-y-2 text-sm">
            <div>Total nodes: <strong>{crawlGraph.totalNodes}</strong></div>
            <div>Max depth: <strong>{crawlGraph.maxDepth}</strong></div>
            <div>Average depth: <strong>{crawlGraph.avgDepth.toFixed(2)}</strong></div>
            <div>Orphan pages: <strong className={crawlGraph.orphanPages.length > 0 ? 'text-red-600' : ''}>{crawlGraph.orphanPages.length}</strong></div>
            <div>Deep pages (&gt;4 clicks): <strong className={crawlGraph.deepPages.length > 0 ? 'text-yellow-600' : ''}>{crawlGraph.deepPages.length}</strong></div>
          </div>
        </section>

        {/* Redirects */}
        <section className="rounded-lg border p-6">
          <h2 className="text-xl font-semibold mb-4">Redirect Registry</h2>
          <div className="text-sm">
            Valid: <strong className={redirects.valid ? 'text-green-600' : 'text-red-600'}>{redirects.valid ? 'Yes' : 'No'}</strong>
            {redirects.chains.length > 0 && <div className="text-red-600 mt-1">Chains: {redirects.chains.length}</div>}
            {redirects.loops.length > 0 && <div className="text-red-600 mt-1">Loops: {redirects.loops.length}</div>}
          </div>
        </section>

        {/* Rewrites */}
        <section className="rounded-lg border p-6">
          <h2 className="text-xl font-semibold mb-4">Rewrites</h2>
          <div className="text-sm">
            Valid: <strong className={rewrites.valid ? 'text-green-600' : 'text-yellow-600'}>{rewrites.valid ? 'Yes' : 'Issues'}</strong>
            {rewrites.shadowedRoutes.length > 0 && <div className="text-yellow-600 mt-1">Shadowed: {rewrites.shadowedRoutes.length}</div>}
          </div>
        </section>

        {/* robots.txt */}
        <section className="rounded-lg border p-6">
          <h2 className="text-xl font-semibold mb-4">robots.txt</h2>
          <div className="text-sm mb-3">
            Valid: <strong className={robots.valid ? 'text-green-600' : 'text-red-600'}>{robots.valid ? 'Yes' : 'No'}</strong>
          </div>
          <pre className="text-xs bg-muted p-4 rounded overflow-auto max-h-64">{robotsBody}</pre>
        </section>
      </div>
    </div>
  )
}
