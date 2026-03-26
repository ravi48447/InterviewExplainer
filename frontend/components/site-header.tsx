"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTheme } from "next-themes";
import { useState, useEffect } from "react";
import {
  Search,
  Sun,
  Moon,
  User,
  Menu,
  X,
  BookOpen,
  LayoutDashboard,
  Compass,
  GraduationCap,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/context/auth-context";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { LogOut, Settings } from "lucide-react";

const navItems = [
  { href: "/", label: "Home", icon: BookOpen },
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/domains", label: "Domains", icon: Compass },
  { href: "/search", label: "Search", icon: Search },
];

export function SiteHeader() {
  const pathname = usePathname();
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const { user, logout } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <header className="sticky top-0 z-50 border-b border-border/60 bg-background/80 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 lg:px-6">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5 shrink-0 group">
          <div className="relative flex h-9 w-9 items-center justify-center rounded-xl bg-primary shadow-[0_10px_20px_rgba(var(--primary),0.2)] group-hover:scale-105 transition-transform">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 text-primary-foreground"
            >
              <path
                d="M12 2L4 5V11C4 16.19 7.41 21.05 12 22.5C16.59 21.05 20 16.19 20 11V5L12 2Z"
                fill="currentColor"
                fillOpacity="0.15"
              />
              <path
                d="M12 2L4 5V11C4 16.19 7.41 21.05 12 22.5C16.59 21.05 20 16.19 20 11V5L12 2Z"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M9 10L11 12L9 14"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M13 14H15"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <div className="absolute inset-0 rounded-xl bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity" />
          </div>
          <span className="text-xl font-black tracking-tight text-foreground hidden sm:inline-block">
            InterviewExplainer<span className="text-primary font-black">.</span>
          </span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-1 ml-8">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={`desktop-${item.href}`}
                href={item.href}
                className={cn(
                  "relative flex items-center gap-2 rounded-lg px-3.5 py-2 text-sm font-medium transition-colors",
                  isActive
                    ? "text-primary text-bold"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                <item.icon className="h-4 w-4" />
                {item.label}
                {isActive && (
                  <motion.div
                    layoutId="nav-indicator"
                    className="absolute inset-0 rounded-lg bg-accent"
                    style={{ zIndex: -1 }}
                    transition={{ type: "spring", bounce: 0.2, duration: 0.5 }}
                  />
                )}
              </Link>
            );
          })}
        </nav>

        {/* Search + Controls */}
        <div className="flex items-center gap-2 ml-auto">
          {/* Theme Toggle */}
          {mounted && (
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              className="h-9 w-9 text-muted-foreground"
            >
              {theme === "dark" ? (
                <Sun className="h-4 w-4" />
              ) : (
                <Moon className="h-4 w-4" />
              )}
              <span className="sr-only">Toggle theme</span>
            </Button>
          )}

          {/* Account/Auth Section */}
          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-9 w-9 rounded-full">
                  <Avatar className="h-9 w-9 overflow-hidden border-2 border-primary/20">
                    <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user.email}`} />
                    <AvatarFallback className="bg-primary/5 text-primary font-bold">
                      {user.name.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" forceMount>
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-black leading-none">{user.name}</p>
                    <p className="text-xs leading-none text-muted-foreground">
                      {user.email}
                    </p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link href="/dashboard" className="cursor-pointer flex items-center">
                    <LayoutDashboard className="mr-2 h-4 w-4" />
                    <span>Dashboard</span>
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
                  className="text-red-500 focus:text-red-500 cursor-pointer flex items-center"
                  onClick={() => logout()}
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Log out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <div className="hidden sm:flex items-center gap-2">
              <Button variant="ghost" size="sm" asChild className="font-bold">
                <Link href="/login">Log in</Link>
              </Button>
              <Button size="sm" asChild className="font-bold rounded-full px-5 dark:bg-white dark:text-black">
                <Link href="/signup">Sign up</Link>
              </Button>
            </div>
          )}

          {/* Mobile Menu */}
          <Button
            variant="ghost"
            size="icon"
            className="h-9 w-9 md:hidden text-muted-foreground"
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            {mobileOpen ? (
              <X className="h-4 w-4" />
            ) : (
              <Menu className="h-4 w-4" />
            )}
            <span className="sr-only">Menu</span>
          </Button>
        </div>
      </div>

      {/* Mobile Nav */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden border-t border-border/60 md:hidden"
          >
            <nav className="flex flex-col gap-1 p-3">
              {navItems.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={`mobile-${item.href}`}
                    href={item.href}
                    onClick={() => setMobileOpen(false)}
                    className={cn(
                      "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                      isActive
                        ? "bg-accent text-accent-foreground"
                        : "text-muted-foreground hover:text-foreground hover:bg-muted"
                    )}
                  >
                    <item.icon className="h-4 w-4" />
                    {item.label}
                  </Link>
                );
              })}
              {/* Mobile search */}
              <div className="relative mt-2">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Search topics, roles..."
                  className="h-10 w-full rounded-lg border border-border bg-muted/50 pl-9 pr-4 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none"
                />
              </div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
