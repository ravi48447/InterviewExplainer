'use client';
/**
 * ProductShell — compact application chrome for interview-practice surfaces.
 *
 * Desktop uses a persistent icon rail so the product canvas stays wide. Mobile
 * uses a small context bar and an accessible Sheet rather than forcing the
 * desktop rail into the viewport.
 */

import type { ComponentType } from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import {
  BookOpen,
  Building2,
  FileText,
  GraduationCap,
  LayoutDashboard,
  Menu,
  Mic,
  Sparkles,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

type NavItem = {
  href: string;
  label: string;
  description: string;
  icon: ComponentType<{ className?: string; 'aria-hidden'?: boolean }>;
};

const NAV: Array<{ section: string; items: NavItem[] }> = [
  {
    section: 'Practice',
    items: [
      {
        href: '/mock-interviews',
        label: 'Interview Room',
        description: 'Adaptive voice and typed mocks',
        icon: Mic,
      },
      {
        href: '/mock-interviews/company',
        label: 'Companies',
        description: 'Practice company interview loops',
        icon: Building2,
      },
    ],
  },
  {
    section: 'Prepare',
    items: [
      {
        href: '/dashboard',
        label: 'Mission Control',
        description: 'Readiness, activity, and gaps',
        icon: LayoutDashboard,
      },
      {
        href: '/dashboard/resume',
        label: 'Resume',
        description: 'Resume analysis and evidence',
        icon: FileText,
      },
      {
        href: '/offer-ready',
        label: 'Offer Ready',
        description: 'Your 30-day interview campaign',
        icon: Sparkles,
      },
    ],
  },
  {
    section: 'Learn',
    items: [
      {
        href: '/dsa',
        label: 'DSA Problems',
        description: 'Practice problems by pattern',
        icon: BookOpen,
      },
      {
        href: '/topics',
        label: 'Concepts',
        description: 'Browse the concept library',
        icon: GraduationCap,
      },
    ],
  },
];

const INTERVIEW_ROOM_PATHS = [
  '/mock-interviews/audio',
  '/mock-interviews/results',
  '/mock-interviews/select-domain',
  '/mock-interviews/start',
];

function isActivePath(pathname: string, href: string) {
  if (href === '/mock-interviews') {
    return (
      pathname === href ||
      INTERVIEW_ROOM_PATHS.some(
        (path) => pathname === path || pathname.startsWith(`${path}/`),
      )
    );
  }

  // Keep the dashboard overview and its Resume destination mutually exclusive.
  if (href === '/dashboard') return pathname === href;

  return pathname === href || pathname.startsWith(`${href}/`);
}

function BrandMark() {
  return (
    <span
      className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-border bg-surface-elevated text-xs font-semibold tracking-tight text-foreground shadow-sm"
      aria-hidden="true"
    >
      IE
    </span>
  );
}

function DesktopRail({ pathname }: { pathname: string }) {
  return (
    <aside className="fixed inset-y-0 left-0 z-[var(--z-fixed)] hidden w-16 flex-col border-r border-border bg-surface/95 backdrop-blur-xl md:flex">
      <div className="flex h-14 items-center justify-center border-b border-border">
        <Tooltip>
          <TooltipTrigger asChild>
            <Link
              href="/"
              className="flex h-10 w-10 items-center justify-center rounded-lg focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              aria-label="InterviewExplainer home"
            >
              <BrandMark />
            </Link>
          </TooltipTrigger>
          <TooltipContent side="right">InterviewExplainer home</TooltipContent>
        </Tooltip>
      </div>

      <nav className="flex-1 px-2 py-3" aria-label="Product navigation">
        {NAV.map((group, groupIndex) => (
          <div
            key={group.section}
            className={cn(groupIndex > 0 && 'mt-3 border-t border-border pt-3')}
            role="group"
            aria-label={group.section}
          >
            <ul className="space-y-1">
              {group.items.map((item) => {
                const active = isActivePath(pathname, item.href);
                return (
                  <li key={item.href}>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Link
                          href={item.href}
                          aria-label={item.label}
                          aria-current={active ? 'page' : undefined}
                          className={cn(
                            'relative flex min-h-10 w-full items-center justify-center rounded-lg text-muted-foreground transition-colors duration-fast hover:bg-muted hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
                            active && 'bg-primary/10 text-primary hover:bg-primary/10 hover:text-primary',
                          )}
                        >
                          {active && (
                            <span
                              className="absolute -left-2 h-5 w-0.5 rounded-r-full bg-primary"
                              aria-hidden="true"
                            />
                          )}
                          <item.icon className="h-[18px] w-[18px]" aria-hidden={true} />
                        </Link>
                      </TooltipTrigger>
                      <TooltipContent side="right" sideOffset={10}>
                        <span className="font-medium">{item.label}</span>
                      </TooltipContent>
                    </Tooltip>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </nav>
    </aside>
  );
}

function MobileNavigation({ pathname }: { pathname: string }) {
  return (
    <nav className="mt-2 space-y-5 px-4 pb-6" aria-label="Product navigation">
      {NAV.map((group) => {
        const sectionId = `mobile-nav-${group.section.toLowerCase()}`;
        return (
          <section key={group.section} aria-labelledby={sectionId}>
            <h3
              id={sectionId}
              className="mb-2 px-2 text-xs font-medium uppercase tracking-wider text-muted-foreground"
            >
              {group.section}
            </h3>
            <ul className="space-y-1">
              {group.items.map((item) => {
                const active = isActivePath(pathname, item.href);
                return (
                  <li key={item.href}>
                    <SheetClose asChild>
                      <Link
                        href={item.href}
                        aria-current={active ? 'page' : undefined}
                        className={cn(
                          'flex min-h-11 items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
                          active && 'bg-primary/10 text-primary hover:bg-primary/10 hover:text-primary',
                        )}
                      >
                        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md border border-border bg-background">
                          <item.icon className="h-[18px] w-[18px]" aria-hidden={true} />
                        </span>
                        <span className="min-w-0">
                          <span className="block text-sm font-medium text-foreground">{item.label}</span>
                          <span className="block truncate text-xs text-muted-foreground">
                            {item.description}
                          </span>
                        </span>
                      </Link>
                    </SheetClose>
                  </li>
                );
              })}
            </ul>
          </section>
        );
      })}
    </nav>
  );
}

function MobileTopBar({ pathname }: { pathname: string }) {
  const activeItem = NAV.flatMap((group) => group.items).find((item) =>
    isActivePath(pathname, item.href),
  );

  return (
    <header className="sticky top-0 z-[var(--z-sticky)] flex h-14 items-center gap-3 border-b border-border bg-background/90 px-3 backdrop-blur-xl md:hidden">
      <Link
        href="/"
        className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
        aria-label="InterviewExplainer home"
      >
        <BrandMark />
      </Link>

      <div className="min-w-0 flex-1">
        <p className="truncate text-xs text-muted-foreground">Mock interview studio</p>
        <p className="truncate text-sm font-semibold text-foreground">
          {activeItem?.label ?? 'InterviewExplainer'}
        </p>
      </div>

      <Sheet>
        <SheetTrigger asChild>
          <button
            type="button"
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-border bg-surface text-foreground shadow-sm transition-colors hover:bg-muted focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            aria-label="Open product navigation"
          >
            <Menu className="h-5 w-5" aria-hidden="true" />
          </button>
        </SheetTrigger>
        <SheetContent
          side="left"
          className="w-[min(21rem,88vw)] overflow-y-auto p-0 [&>button]:flex [&>button]:h-10 [&>button]:w-10 [&>button]:items-center [&>button]:justify-center"
        >
          <SheetHeader className="border-b border-border px-6 py-5 pr-16 text-left">
            <SheetTitle>InterviewExplainer</SheetTitle>
            <SheetDescription>Choose a workspace or preparation tool.</SheetDescription>
          </SheetHeader>
          <MobileNavigation pathname={pathname} />
        </SheetContent>
      </Sheet>
    </header>
  );
}

export function ProductShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname() ?? '/';

  return (
    <TooltipProvider delayDuration={150} skipDelayDuration={300}>
      <div className="flex min-h-screen bg-background">
        <DesktopRail pathname={pathname} />
        <div className="flex min-h-screen min-w-0 flex-1 flex-col md:ml-16">
          <MobileTopBar pathname={pathname} />
          {children}
        </div>
      </div>
    </TooltipProvider>
  );
}

export default ProductShell;
