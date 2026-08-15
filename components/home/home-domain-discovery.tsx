"use client";

import Link from "next/link";
import { useState } from "react";
import { ArrowRight, BarChart3, Braces, Cloud, Network, PanelsTopLeft, Server } from "lucide-react";
import { cn } from "@/lib/utils";
import type { ReferenceHomeDomain, ReferenceHomeIcon } from "@/lib/home/home-data";

const ICONS: Record<ReferenceHomeIcon, typeof Server> = {
  server: Server,
  panels: PanelsTopLeft,
  braces: Braces,
  network: Network,
  cloud: Cloud,
  chart: BarChart3,
  flag: Server,
  sprout: Server,
  puzzle: Server,
  target: Server,
  trophy: Server,
};

const ACCENTS = {
  blue: "text-primary bg-primary/10",
  green: "text-success bg-success/10",
  orange: "text-accent bg-accent/10",
  violet: "text-[#7857D8] bg-[#7857D8]/10",
  teal: "text-[#126B63] bg-[#126B63]/10",
} as const;

const ACTIVE_ACCENTS = {
  blue: "border-primary ring-primary/15",
  green: "border-success ring-success/15",
  orange: "border-accent ring-accent/15",
  violet: "border-[#7857D8] ring-[#7857D8]/15",
  teal: "border-[#126B63] ring-[#126B63]/15",
} as const;

const ACTIVE_BARS = {
  blue: "bg-primary",
  green: "bg-success",
  orange: "bg-accent",
  violet: "bg-[#7857D8]",
  teal: "bg-[#126B63]",
} as const;

export function HomeDomainDiscovery({ domains }: { domains: ReferenceHomeDomain[] }) {
  const [selectedId, setSelectedId] = useState(domains[0]?.id ?? "");
  const selected = domains.find((domain) => domain.id === selectedId) ?? domains[0];

  return (
    <div>
      <div className="flex snap-x snap-mandatory gap-3 overflow-x-auto pb-3 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden lg:grid lg:grid-cols-6 lg:overflow-visible lg:pb-0">
        {domains.map((domain) => {
          const Icon = ICONS[domain.icon];
          const active = domain.id === selected?.id;
          return (
            <button
              key={domain.id}
              type="button"
              aria-pressed={active}
              onClick={() => setSelectedId(domain.id)}
              className={cn(
                "group relative min-h-[152px] min-w-[184px] snap-start rounded-xl border bg-card p-5 text-left shadow-xs transition-[transform,border-color,box-shadow] duration-150 ease-out hover:-translate-y-0.5 hover:shadow-md lg:min-w-0",
                active ? cn("shadow-md ring-1", ACTIVE_ACCENTS[domain.accent]) : "border-border hover:border-foreground/20",
              )}
            >
              <span className={cn("grid h-11 w-11 place-items-center rounded-xl", ACCENTS[domain.accent])}>
                <Icon className="h-5 w-5" aria-hidden="true" />
              </span>
              <span className="mt-5 block text-sm font-semibold leading-5 text-foreground">{domain.title}</span>
              <span className="mt-1 block text-[11px] leading-4 text-muted-foreground">{domain.summary}</span>
              <span className={cn("absolute inset-x-5 bottom-0 h-0.5 rounded-full transition-colors duration-150", active ? ACTIVE_BARS[domain.accent] : "bg-transparent")} />
            </button>
          );
        })}
      </div>

      {selected && (
        <div className="mt-5 flex flex-col gap-3 rounded-xl border border-[#e5deed] bg-[#faf8fc] px-4 py-3 dark:border-border dark:bg-surface-subtle/50 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-[13px] text-muted-foreground">
            Start with <span className="font-semibold text-foreground">{selected.title}</span> — {selected.summary.toLowerCase()}.
          </p>
          <Link href={selected.href} className="inline-flex items-center gap-1.5 text-[13px] font-semibold text-[#6846C7] transition-colors hover:text-[#5235a6] dark:text-[#bcaaff]">
            Explore this domain <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </Link>
        </div>
      )}
    </div>
  );
}
