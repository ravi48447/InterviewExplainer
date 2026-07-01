"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTheme } from "next-themes";
import { useState, useEffect, forwardRef } from "react";
import {
  Sun,
  Moon,
  Menu,
  X,
  LayoutDashboard,
  Compass,
  Mic,
  Code2,
  Wrench,
  Building2,
  ArrowLeftRight,
  Brain,
  Map,
  Zap,
  Briefcase,
  Target,
  Network,
  BookOpen,
  Layers,
  Search,
  Crown,
} from "lucide-react";
import { PageContainer } from "@/components/page-container";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useAuth } from "@/context/auth-context";
import { isHubEnabled, type HubKey } from "@/lib/launch-config";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { LogOut, Settings } from "lucide-react";
import { GlobalSearch } from "@/modules/search/components/GlobalSearch";

interface NavLinkProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  href: string;
  title: string;
  description: string;
  icon: React.ReactNode;
}

const NavLink = forwardRef<HTMLAnchorElement, NavLinkProps>(
  ({ href, title, description, icon, className, ...props }, ref) => (
    <li>
      <NavigationMenuLink asChild>
        <Link
          ref={ref}
          href={href}
          className={cn(
            "group flex items-start gap-3 rounded-lg p-3 hover:bg-muted transition-colors select-none outline-none",
            className,
          )}
          {...props}
        >
          <div className="mt-0.5 shrink-0">{icon}</div>
          <div>
            <div className="text-sm font-semibold text-foreground group-hover:text-primary transition-colors leading-none mb-1">
              {title}
            </div>
            <p className="text-xs text-muted-foreground leading-snug">
              {description}
            </p>
          </div>
        </Link>
      </NavigationMenuLink>
    </li>
  ),
);
NavLink.displayName = "NavLink";

// ── Launch-gated navigation catalogue ────────────────────────────────────────
//
// Each desktop "Learn" dropdown entry and mobile drawer section is tagged with
// the hub flag that controls its visibility. Flip a flag in launch-config.ts
// to expose that entry — never copy-paste it in by hand.
// `null` = always visible (applies to /search which we still want discoverable
// once enabled via its own flag).
//
// This mirrors ROADMAP.md and stays the single source of truth for nav.

type LearnEntry = {
  hub: HubKey;
  href: string;
  title: string;
  description: string;
  icon: React.ReactNode;
};

const LEARN_SKILLS: LearnEntry[] = [
  { hub: "prepCategories",  href: "/prep",          title: "Prep by Topic",    description: "Every category & module SEO hub",   icon: <Compass className="h-4 w-4 text-indigo-500"  /> },
  { hub: "systemDesign",    href: "/system-design", title: "System Design",    description: "25+ real problems & architecture",  icon: <Network className="h-4 w-4 text-emerald-500" /> },
  { hub: "dsa",             href: "/dsa",           title: "DSA Problems",     description: "450+ problems by pattern",          icon: <Code2   className="h-4 w-4 text-violet-500"  /> },
  { hub: "behavioral",      href: "/behavioral",    title: "Behavioral",       description: "STAR method & company-specific",    icon: <Brain   className="h-4 w-4 text-amber-500"   /> },
  { hub: "topics",          href: "/topics",        title: "Topics & Concepts",description: "Microservices, caching, security",   icon: <Layers  className="h-4 w-4 text-blue-500"    /> },
];

const LEARN_TOOLS: LearnEntry[] = [
  { hub: "tools",           href: "/tools",    title: "Tools & Technologies", description: "Docker, Kafka, Redis, AWS",      icon: <Wrench         className="h-4 w-4 text-teal-500"   /> },
  { hub: "compare",         href: "/compare",  title: "Compare X vs Y",       description: "Kafka vs RabbitMQ & 20+ more",    icon: <ArrowLeftRight className="h-4 w-4 text-blue-500"   /> },
  { hub: "companies",       href: "/companies",title: "Company Prep",         description: "FAANG process & patterns",        icon: <Building2      className="h-4 w-4 text-orange-500" /> },
  { hub: "interviewByLang", href: "/interview",title: "Browse by Language",   description: "Java, Python, Go & more",         icon: <Target         className="h-4 w-4 text-rose-500"   /> },
];

const LEARN_RESOURCES: LearnEntry[] = [
  { hub: "roadmaps",    href: "/roadmaps",    title: "Study Roadmaps", description: "4/8/12-week prep schedules",   icon: <Map       className="h-4 w-4 text-green-500"  /> },
  { hub: "cheatsheets", href: "/cheatsheets", title: "Cheatsheets",    description: "Quick reference for interviews", icon: <Zap      className="h-4 w-4 text-yellow-500" /> },
  { hub: "career",      href: "/career",      title: "Career Guide",   description: "Resume, negotiation, process",   icon: <Briefcase className="h-4 w-4 text-rose-500"   /> },
];

const visibleSkills    = LEARN_SKILLS.filter(e => isHubEnabled(e.hub));
const visibleTools     = LEARN_TOOLS.filter(e => isHubEnabled(e.hub));
const visibleResources = LEARN_RESOURCES.filter(e => isHubEnabled(e.hub));
const totalLearnEntries = visibleSkills.length + visibleTools.length + visibleResources.length;
const showLearnMenu = totalLearnEntries > 0;
const activeColumns = (visibleSkills.length > 0 ? 1 : 0) + (visibleTools.length > 0 ? 1 : 0) + (visibleResources.length > 0 ? 1 : 0);

// Mobile drawer sections — same launch gating.
const MOBILE_NAV: Array<{ title: string; items: Array<{ href: string; label: string; icon: typeof Code2; hub?: HubKey }> }> = [
  {
    title: "Quick Access",
    items: [
      { href: "/dashboard",       label: "Dashboard",        icon: LayoutDashboard, hub: "dashboard"      },
      { href: "/mock-interviews", label: "Mock Interview",   icon: Mic,             hub: "mockInterviews" },
      { href: "/search",          label: "Search Questions", icon: Search,          hub: "search"         },
      { href: "/pricing",         label: "Pricing",          icon: Crown                                  },
    ],
  },
  {
    title: "Interview Content",
    items: [
      { href: "/prep",      label: "Prep by Topic",          icon: Compass,   hub: "prepCategories"  },
      { href: "/domains",   label: "All Interview Paths",    icon: Compass,   hub: "interviewQA"     },
      { href: "/interview", label: "Browse by Language",     icon: BookOpen,  hub: "interviewByLang" },
      { href: "/companies", label: "Company-Specific Prep",  icon: Building2, hub: "companies"       },
    ],
  },
  {
    title: "Deep Dive",
    items: [
      { href: "/system-design", label: "System Design",       icon: Network,       hub: "systemDesign" },
      { href: "/dsa",           label: "DSA Problems",        icon: Code2,         hub: "dsa"          },
      { href: "/behavioral",    label: "Behavioral Interview",icon: Brain,         hub: "behavioral"   },
      { href: "/topics",        label: "Topics & Concepts",   icon: Layers,        hub: "topics"       },
      { href: "/tools",         label: "Tools & Technologies",icon: Wrench,        hub: "tools"        },
      { href: "/compare",       label: "Compare X vs Y",      icon: ArrowLeftRight,hub: "compare"      },
    ],
  },
  {
    title: "Resources",
    items: [
      { href: "/roadmaps",    label: "Study Roadmaps", icon: Map,       hub: "roadmaps"    },
      { href: "/cheatsheets", label: "Cheatsheets",    icon: Zap,       hub: "cheatsheets" },
      { href: "/career",      label: "Career Guide",   icon: Briefcase, hub: "career"      },
    ],
  },
];

export function SiteHeader() {
  const pathname = usePathname();
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const { user, logout } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const isActive = (href: string) => {
    if (href === "/") return pathname === href;
    if (pathname === href || pathname.startsWith(href + "/")) return true;
    if (href === "/domains") {
      return /^\/[a-z]+-[a-z]+-/.test(pathname);
    }
    return false;
  };

  const initials = (name: string) => {
    const clean = name?.trim();
    if (!clean) return "?";
    return clean.charAt(0).toUpperCase();
  };

  const triggerCls =
    "bg-transparent text-sm font-semibold text-muted-foreground hover:text-foreground data-[state=open]:text-primary data-[state=open]:bg-primary/10 hover:bg-muted rounded-lg h-9 px-2 gap-1.5";

  const directLinkCls = (href: string) =>
    cn(
      "inline-flex items-center gap-1.5 px-2 xl:px-3 h-9 text-sm font-medium transition-colors relative",
      isActive(href)
        ? "text-foreground"
        : "text-muted-foreground hover:text-foreground",
    );

  return (
    <header className="sticky top-0 z-50 border-b border-border/40 bg-background/70 backdrop-blur-2xl">
      <PageContainer className="flex h-16 items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-3 shrink-0 group">
          <div className="relative flex h-10 w-10 items-center justify-center">
            <div className="absolute inset-0 bg-primary rounded-xl blur-md opacity-60 group-hover:opacity-80 transition-opacity" />
            <div className="relative w-10 h-10 group-hover:scale-105 transition-transform duration-200">
              <svg viewBox="0 0 100 100" className="w-full h-full">
                <defs>
                  <linearGradient id="logoGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#3B82F6" />
                    <stop offset="50%" stopColor="#6366F1" />
                    <stop offset="100%" stopColor="#8B5CF6" />
                  </linearGradient>
                </defs>
                <polygon points="50,10 85,30 85,70 50,90 15,70 15,30" fill="url(#logoGradient)" stroke="white" strokeWidth="2" />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <svg viewBox="0 0 24 24" className="w-5 h-5 text-white">
                  <path d="M8 4L2 12L8 20M16 4L22 12L16 20M14 2L10 22" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
                </svg>
              </div>
            </div>
          </div>
          <span className="text-xl font-black tracking-tight text-foreground hidden sm:inline-block">
            InterviewExplainer
          </span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden lg:flex items-center gap-0 ml-4">
          <Link href="/" className={directLinkCls("/")}>
            <Compass className="h-4 w-4" />
            Home
          </Link>

          {isHubEnabled("dashboard") && (
            <Link href="/dashboard" className={directLinkCls("/dashboard")}>
              <LayoutDashboard className="h-4 w-4" />
              Dashboard
            </Link>
          )}

          {isHubEnabled("interviewQA") && (
            <Link href="/domains" className={directLinkCls("/domains")}>
              <Compass className="h-4 w-4" />
              Interview Q&A
            </Link>
          )}

          {showLearnMenu && (
            <NavigationMenu>
              <NavigationMenuList>
                <NavigationMenuItem>
                  <NavigationMenuTrigger className={triggerCls}>
                    <BookOpen className="h-4 w-4" />
                    Learn
                  </NavigationMenuTrigger>
                  <NavigationMenuContent>
                    <div className={cn("p-5", activeColumns === 1 ? "w-[240px]" : activeColumns === 2 ? "w-[460px]" : "w-[640px]")}>
                      <div className={cn("grid gap-5", activeColumns === 1 ? "grid-cols-1" : activeColumns === 2 ? "grid-cols-2" : "grid-cols-3")}>
                        {visibleSkills.length > 0 && (
                          <div>
                            <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-3 px-1">
                              Interview Skills
                            </p>
                            <ul className="space-y-0.5">
                              {visibleSkills.map(e => (
                                <NavLink key={e.href} {...e} />
                              ))}
                            </ul>
                          </div>
                        )}

                        {visibleTools.length > 0 && (
                          <div>
                            <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-3 px-1">
                              Tools & Comparisons
                            </p>
                            <ul className="space-y-0.5">
                              {visibleTools.map(e => (
                                <NavLink key={e.href} {...e} />
                              ))}
                            </ul>
                          </div>
                        )}

                        {visibleResources.length > 0 && (
                          <div>
                            <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-3 px-1">
                              Resources
                            </p>
                            <ul className="space-y-0.5">
                              {visibleResources.map(e => (
                                <NavLink key={e.href} {...e} />
                              ))}
                            </ul>

                            {isHubEnabled("search") && (
                              <div className="mt-4 pt-3 border-t border-border">
                                <NavigationMenuLink asChild>
                                  <Link
                                    href="/search"
                                    className="group flex items-center gap-2 p-2.5 rounded-lg bg-muted/60 hover:bg-muted transition-colors"
                                  >
                                    <Search className="h-4 w-4 text-muted-foreground group-hover:text-primary" />
                                    <span className="text-xs font-semibold text-muted-foreground group-hover:text-primary transition-colors">
                                      Search all questions...
                                    </span>
                                  </Link>
                                </NavigationMenuLink>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  </NavigationMenuContent>
                </NavigationMenuItem>
              </NavigationMenuList>
            </NavigationMenu>
          )}

          {isHubEnabled("mockInterviews") && (
            <Link
              href="/mock-interviews"
              className={cn(
                "inline-flex items-center gap-1.5 rounded-lg px-3 h-9 text-sm font-semibold transition-colors whitespace-nowrap",
                isActive("/mock-interviews")
                  ? "text-primary bg-primary/10"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted",
              )}
            >
              <Mic className="h-4 w-4" />
              <span>Mock Interview</span>
              <span className="text-[9px] font-extrabold uppercase tracking-wide px-1.5 py-0.5 rounded-full bg-primary/10 text-primary border border-primary/20 whitespace-nowrap">Soon</span>
            </Link>
          )}

          <Link href="/pricing" className={directLinkCls("/pricing")}>
            <Crown className="h-4 w-4" />
            Pricing
          </Link>
        </nav>

        {/* Global Search Bar (Desktop) */}
        <div className="hidden md:flex flex-1 justify-center px-2 max-w-[220px] xl:max-w-md mx-auto">
          <GlobalSearch />
        </div>

        {/* Controls */}
        <div className="flex items-center gap-2 ml-auto">
          {/* Global Search Button (Mobile/Tablet) */}
          <div className="md:hidden">
            <GlobalSearch />
          </div>

          {mounted && (
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              className="h-9 w-9 text-muted-foreground hover:text-foreground hover:bg-muted"
            >
              {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
              <span className="sr-only">Toggle theme</span>
            </Button>
          )}

          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-9 w-9 rounded-full">
                  <Avatar className="h-9 w-9 overflow-hidden border-2 border-primary/20">
                    <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user.email}`} />
                    <AvatarFallback className="bg-primary/10 text-primary font-bold">
                      {initials(user.name)}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" forceMount>
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-bold leading-none">{user.name}</p>
                    <p className="text-xs leading-none text-muted-foreground">{user.email}</p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                {isHubEnabled("dashboard") && (
                  <DropdownMenuItem asChild>
                    <Link href="/dashboard" className="cursor-pointer flex items-center">
                      <LayoutDashboard className="mr-2 h-4 w-4" />
                      <span>Dashboard</span>
                    </Link>
                  </DropdownMenuItem>
                )}
                <DropdownMenuItem asChild>
                  <Link href="/account" className="cursor-pointer flex items-center">
                    <Crown className="mr-2 h-4 w-4" />
                    <span>Account & Plan</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/profile" className="cursor-pointer flex items-center">
                    <Settings className="mr-2 h-4 w-4" />
                    <span>Profile Settings</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  className="text-destructive focus:text-destructive cursor-pointer flex items-center"
                  onClick={() => logout()}
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Log out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <div className="hidden sm:flex items-center gap-1.5 ml-2">
              <Button variant="ghost" size="sm" asChild className="font-medium text-muted-foreground hover:text-foreground hover:bg-transparent px-4">
                <Link href="/login">Log in</Link>
              </Button>
              <Button variant="premium" size="sm" asChild className="font-medium rounded-full px-5 transition-all hover:-translate-y-0.5 border border-white/10">
                <Link href="/signup">Sign up</Link>
              </Button>
            </div>
          )}

          <Button
            variant="ghost"
            size="icon"
            className="h-9 w-9 lg:hidden text-muted-foreground"
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            <span className="sr-only">Menu</span>
          </Button>
        </div>
      </PageContainer>

      {/* Mobile Navigation */}
      {mobileOpen && (
        <div className="border-t border-border lg:hidden bg-background animate-fade-in-up" style={{ animationDuration: '0.2s' }}>
          <nav className="flex flex-col gap-0.5 p-3 max-h-[75vh] overflow-y-auto">
            {MOBILE_NAV.map((section) => {
              const items = section.items.filter(i => !i.hub || isHubEnabled(i.hub));
              if (items.length === 0) return null;
              return (
                <div key={section.title} className="mb-2">
                  <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground px-3 py-1.5">
                    {section.title}
                  </p>
                  {items.map((item) => {
                    const active = isActive(item.href);
                    return (
                      <Link
                        key={item.href}
                        href={item.href}
                        onClick={() => setMobileOpen(false)}
                        className={cn(
                          "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-semibold transition-colors",
                          active
                            ? "bg-primary/10 text-primary"
                            : "text-muted-foreground hover:text-foreground hover:bg-muted",
                        )}
                      >
                        <item.icon className="h-4 w-4" />
                        <span className="flex-1">{item.label}</span>
                        {item.href === "/mock-interviews" && (
                          <span className="text-[9px] font-extrabold uppercase tracking-wide px-1.5 py-0.5 rounded-full bg-primary/10 text-primary border border-primary/20 whitespace-nowrap">Soon</span>
                        )}
                      </Link>
                    );
                  })}
                </div>
              );
            })}
            {!user && (
              <div className="flex flex-col gap-2 mt-2 px-2 pt-2 border-t border-border">
                <Button variant="outline" size="sm" asChild className="font-semibold">
                  <Link href="/login">Log in</Link>
                </Button>
                <Button size="sm" asChild className="font-bold bg-primary text-white">
                  <Link href="/signup">Sign up free</Link>
                </Button>
              </div>
            )}
          </nav>
        </div>
      )}
    </header>
  );
}
