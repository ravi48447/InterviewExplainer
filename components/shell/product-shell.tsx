'use client';
/**
 * ProductShell — the application shell for product surfaces
 * (mock interviews, company preparation, Offer Ready).
 *
 * The Linear/Notion pattern: a persistent left rail with the product's
 * sections, a slim topbar for context + status, and a contained content
 * column with a STRICT grid. No marketing chrome. Everything uses the
 * design tokens (bg-background/surface, border-border, text hierarchy,
 * type-* scale) — no ad-hoc hex colors.
 */

import { usePathname } from 'next/navigation';
import { useState } from 'react';
import Link from 'next/link';
import {
  Mic, Building2, Sparkles, History, LayoutDashboard, ChevronLeft,
  Headphones, BookOpen, GraduationCap,
} from 'lucide-react';

const NAV = [
  {
    section: 'Practice',
    items: [
      { href: '/mock-interviews', label: 'Interview Room', icon: Mic, desc: 'Adaptive voice mock' },
      { href: '/mock-interviews/history', label: 'History', icon: History, desc: 'Past sessions + reports' },
      { href: '/mock-interviews/company', label: 'Companies', icon: Building2, desc: 'Vetted loop rehearsals' },
    ],
  },
  {
    section: 'Prepare',
    items: [
      { href: '/offer-ready', label: 'Offer Ready', icon: Sparkles, desc: '30-day campaign' },
      { href: '/dashboard', label: 'Mission Control', icon: LayoutDashboard, desc: 'Readiness + gaps' },
    ],
  },
  {
    section: 'Learn',
    items: [
      { href: '/dsa', label: 'DSA Problems', icon: BookOpen, desc: '450+ by pattern' },
      { href: '/topics', label: 'Concepts', icon: GraduationCap, desc: 'Topic library' },
    ],
  },
];

export function ProductShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname() ?? '/';
  const [collapsed, setCollapsed] = useState(false);

  const isActive = (href: string) =>
    pathname === href || (href !== '/mock-interviews' && pathname.startsWith(href + '/'));

  return (
    <div className="flex min-h-screen bg-background">
      {/* ============ left rail ============ */}
      <aside
        className={`fixed inset-y-0 left-0 z-40 flex flex-col border-r border-border bg-surface transition-all duration-200 ${
          collapsed ? 'w-14' : 'w-56'
        }`}
      >
        {/* brand */}
        <div className="flex h-14 items-center gap-2 border-b border-border px-3">
          <Link href="/" className="flex items-center gap-2 min-w-0" aria-label="InterviewExplainer home">
            <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-primary text-primary-foreground text-xs font-bold">
              IE
            </span>
            {!collapsed && (
              <span className="truncate text-sm font-semibold tracking-tight text-foreground">
                InterviewExplainer
              </span>
            )}
          </Link>
          <button
            onClick={() => setCollapsed((c) => !c)}
            className="ml-auto hidden sm:flex h-6 w-6 items-center justify-center rounded-md text-muted-foreground hover:bg-muted hover:text-foreground"
            aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            <ChevronLeft className={`h-3.5 w-3.5 transition-transform ${collapsed ? 'rotate-180' : ''}`} />
          </button>
        </div>

        {/* nav sections */}
        <nav className="flex-1 overflow-y-auto px-2 py-3" aria-label="Product">
          {NAV.map((group) => (
            <div key={group.section} className="mb-4">
              {!collapsed && (
                <div className="mb-1 px-2 text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
                  {group.section}
                </div>
              )}
              <div className="space-y-0.5">
                {group.items.map((item) => {
                  const active = isActive(item.href);
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      title={collapsed ? item.label : undefined}
                      aria-current={active ? 'page' : undefined}
                      className={`group flex items-center gap-2.5 rounded-lg px-2 py-1.5 text-sm transition-colors ${
                        active
                          ? 'bg-primary/10 text-primary font-medium'
                          : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                      }`}
                    >
                      <item.icon className={`h-4 w-4 shrink-0 ${active ? 'text-primary' : 'text-muted-foreground group-hover:text-foreground'}`} />
                      {!collapsed && <span className="truncate">{item.label}</span>}
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>

        {/* footer: voice status hint */}
        {!collapsed && (
          <div className="border-t border-border p-3">
            <div className="flex items-center gap-2 rounded-lg bg-muted/50 px-2.5 py-2 text-[11px] text-muted-foreground">
              <Headphones className="h-3.5 w-3.5 shrink-0" />
              <span className="leading-tight">
                Voice sessions work best in Chrome/Edge with mic access
              </span>
            </div>
          </div>
        )}
      </aside>

      {/* ============ main column ============ */}
      <div className={`flex min-h-screen flex-col transition-all duration-200 ${collapsed ? 'ml-14' : 'ml-56'}`}>
        {children}
      </div>
    </div>
  );
}

export default ProductShell;
