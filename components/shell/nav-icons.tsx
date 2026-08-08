/**
 * components/shell/nav-icons.tsx — Icon resolver for shell navigation (P03-T068)
 *
 * The nav data layer stores icon *names* (strings) so it can stay pure data.
 * This module maps those names to Lucide components. Importing one named
 * map keeps tree-shaking honest and avoids pulling all of lucide-react into
 * the shell.
 */
import {
  Compass,
  LayoutDashboard,
  Network,
  Code2,
  Brain,
  Layers,
  Wrench,
  ArrowLeftRight,
  Building2,
  Target,
  BookOpen,
  Map,
  Zap,
  Briefcase,
  Mic,
  Search,
  Crown,
  type LucideIcon,
} from 'lucide-react'

const ICONS: Record<string, LucideIcon> = {
  Compass,
  LayoutDashboard,
  Network,
  Code2,
  Brain,
  Layers,
  Wrench,
  ArrowLeftRight,
  Building2,
  Target,
  BookOpen,
  Map,
  Zap,
  Briefcase,
  Mic,
  Search,
  Crown,
}

export function getNavIcon(name?: string): LucideIcon | null {
  if (!name) return null
  return ICONS[name] ?? null
}
