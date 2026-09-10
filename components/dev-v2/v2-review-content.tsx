'use client'

import * as React from 'react'
import { Search, Heart, Settings, Bell, ChevronRight } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Tag } from '@/components/ui/tag'
import { Spinner } from '@/components/ui/spinner'
import { Skeleton, TextSkeleton, CardSkeleton, ListSkeleton } from '@/components/ui/skeleton'
import { EmptyState } from '@/components/ui/empty-state'
import { ErrorState } from '@/components/ui/error-state'
import { InlineError } from '@/components/ui/inline-error'
import { SuccessFeedback } from '@/components/ui/success-feedback'
import { SearchInput } from '@/components/ui/search-input'
import { FormField } from '@/components/ui/form-field'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Checkbox } from '@/components/ui/checkbox'
import { Callout } from '@/components/ui/callout'
import { CodeBlock, CodeInline } from '@/components/ui/code-block'
import { TableWrapper } from '@/components/ui/table-wrapper'
import { Figure } from '@/components/ui/figure'
import { Prose } from '@/components/ui/prose'
import { NavLink } from '@/components/ui/nav-link'
import { PrevNextNav } from '@/components/ui/prev-next-nav'

/**
 * V2 Design System review surface (P01-T291..T299).
 *
 * Dev-only route exercising the Phase 01 component set against the token
 * system. NOT linked from public navigation. Purpose: visual QA, contrast
 * checks, and regression spotting across light/dark themes.
 */
function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="space-y-3 border-b border-border pb-8">
      <h2 className="text-lg font-semibold text-foreground">{title}</h2>
      {children}
    </section>
  )
}

export function V2ReviewContent() {
  return (
    <div className="page-container py-10">
      <div className="mb-10 space-y-2">
        <Badge variant="primary">Phase 01</Badge>
        <h1 className="text-2xl font-bold text-foreground">V2 Design System — Review Surface</h1>
        <p className="text-sm text-muted-foreground">
          Dev-only visual QA. Toggle light/dark to verify token coverage.
        </p>
      </div>

      <div className="stack-lg">
        <Section title="Buttons">
          <div className="cluster gap-3">
            <Button variant="primary">Primary</Button>
            <Button variant="secondary">Secondary</Button>
            <Button variant="ghost">Ghost</Button>
            <Button variant="outline">Outline</Button>
            <Button variant="destructive">Destructive</Button>
            <Button variant="link">Link</Button>
            <Button variant="icon" aria-label="Settings"><Settings className="h-4 w-4" /></Button>
            <Button variant="primary" loading>Loading</Button>
            <Button variant="primary" disabled>Disabled</Button>
          </div>
        </Section>

        <Section title="Cards">
          <div className="grid-auto grid-gap-4" style={{ ['--grid-min' as string]: '18rem' }}>
            <Card>
              <CardHeader><CardTitle>Default</CardTitle><CardDescription>Static surface</CardDescription></CardHeader>
              <CardContent><p className="text-sm text-muted-foreground">No hover affordance.</p></CardContent>
            </Card>
            <Card variant="interactive">
              <CardHeader><CardTitle>Interactive</CardTitle><CardDescription>Hoverable</CardDescription></CardHeader>
              <CardContent><p className="text-sm text-muted-foreground">Elevates on hover.</p></CardContent>
            </Card>
            <Card variant="minimal">
              <CardHeader><CardTitle>Minimal</CardTitle><CardDescription>Borderless</CardDescription></CardHeader>
              <CardContent><p className="text-sm text-muted-foreground">For tight lists.</p></CardContent>
            </Card>
          </div>
        </Section>

        <Section title="Badges & Tags">
          <div className="cluster gap-2">
            <Badge>Default</Badge>
            <Badge variant="primary">Primary</Badge>
            <Badge variant="success">Success</Badge>
            <Badge variant="warning">Warning</Badge>
            <Badge variant="destructive">Destructive</Badge>
            <Badge variant="info">Info</Badge>
            <Badge variant="difficulty-easy">Easy</Badge>
            <Badge variant="difficulty-medium">Medium</Badge>
            <Badge variant="difficulty-hard">Hard</Badge>
            <Badge variant="outline">Outline</Badge>
            <Tag>java</Tag>
            <Tag variant="outline">react</Tag>
          </div>
        </Section>

        <Section title="Form fields">
          <div className="grid-2 grid-gap-4" style={{ ['--grid-gap' as string]: '1rem' }}>
            <FormField label="Email" description="We never share your email." htmlFor="rev-email" required>
              <Input id="rev-email" type="email" placeholder="you@example.com" />
            </FormField>
            <FormField label="Bio" description="Short introduction." htmlFor="rev-bio">
              <Textarea id="rev-bio" placeholder="Tell us about yourself" />
            </FormField>
            <FormField label="Preferences">
              <div className="stack-sm">
                <div className="cluster gap-2"><Checkbox id="rev-c1" /> <label htmlFor="rev-c1" className="text-sm">Product news</label></div>
                <div className="cluster gap-2"><Checkbox id="rev-c2" defaultChecked /> <label htmlFor="rev-c2" className="text-sm">Security alerts</label></div>
              </div>
            </FormField>
            <FormField label="Search" htmlFor="rev-search">
              <SearchInput placeholder="Search topics…" shortcut="⌘K" />
            </FormField>
          </div>
        </Section>

        <Section title="Loading states">
          <div className="grid-3 grid-gap-4">
            <div className="space-y-2"><Spinner /> <Spinner size="lg" /></div>
            <TextSkeleton lines={3} />
            <CardSkeleton />
            <ListSkeleton rows={3} />
            <EmptyState
              icon={<Search className="h-6 w-6" />}
              title="No results"
              description="Try a different search term."
            />
            <ErrorState
              title="Failed to load"
              description="Check your connection."
              retryLabel="Retry"
              onRetry={() => {}}
            />
          </div>
        </Section>

        <Section title="Feedback">
          <div className="cluster gap-3">
            <InlineError>Invalid email address</InlineError>
            <SuccessFeedback message="Saved" />
          </div>
        </Section>

        <Section title="Callouts">
          <div className="space-y-3">
            <Callout variant="note" title="Note">Standard informational note.</Callout>
            <Callout variant="tip" title="Tip">Helpful suggestion.</Callout>
            <Callout variant="warning" title="Warning">Caution ahead.</Callout>
            <Callout variant="example" title="Example">Worked example.</Callout>
            <Callout variant="takeaway" title="Takeaway">Key insight.</Callout>
          </div>
        </Section>

        <Section title="Code & prose">
          <CodeBlock language="tsx" filename="example.tsx">{`const x = 42\nconst y = 'hello'`}</CodeBlock>
          <Prose>
            <p>Inline code: <CodeInline>useEffect()</CodeInline> runs after render.</p>
          </Prose>
        </Section>

        <Section title="Table">
          <TableWrapper caption="Token scale">
            <thead>
              <tr><th>Token</th><th>Value</th><th>Use</th></tr>
            </thead>
            <tbody>
              <tr><td>--radius</td><td>0.5rem</td><td>default surface</td></tr>
              <tr><td>--space-4</td><td>1rem</td><td>stack gap</td></tr>
            </tbody>
          </TableWrapper>
        </Section>

        <Section title="Figure">
          <Figure caption="Token coverage diagram">
            <div className="flex h-32 items-center justify-center bg-muted text-sm text-muted-foreground">media</div>
          </Figure>
        </Section>

        <Section title="Navigation">
          <div className="cluster gap-2">
            <NavLink href="/dev/v2">Self</NavLink>
            <NavLink href="/dev" variant="compact">Dev root</NavLink>
          </div>
          <PrevNextNav
            prev={{ href: '/dev/speakable-primitives', title: 'Speakable Primitives' }}
            next={{ href: '/dev', title: 'Dev home' }}
          />
        </Section>
      </div>
    </div>
  )
}
