import type { ReferenceHomeIcon } from "@/lib/home/home-data";

const common = { fill: "none", stroke: "currentColor", strokeWidth: 1.8, strokeLinecap: "round" as const, strokeLinejoin: "round" as const };

export function HomeVisualIcon({ kind, className = "h-7 w-7" }: { kind: ReferenceHomeIcon; className?: string }) {
  const art: Record<ReferenceHomeIcon, React.ReactNode> = {
    server: <><rect x="5" y="4" width="14" height="5" rx="1.5" {...common}/><rect x="5" y="15" width="14" height="5" rx="1.5" {...common}/><path d="M8 6.5h.01M8 17.5h.01M12 9v6" {...common}/></>,
    panels: <><rect x="3.5" y="4" width="17" height="13" rx="2" {...common}/><path d="M3.5 8h17M8 17v3m8-3v3M6 20h12" {...common}/><path d="m9.5 11 2 2-2 2m5-4h2" {...common}/></>,
    braces: <><path d="M9 4H7.8C6.8 4 6 4.8 6 5.8v3.5c0 1-.7 1.8-1.7 2 1 .2 1.7 1 1.7 2v4.9c0 1 .8 1.8 1.8 1.8H9M15 4h1.2c1 0 1.8.8 1.8 1.8v3.5c0 1 .7 1.8 1.7 2-1 .2-1.7 1-1.7 2v4.9c0 1-.8 1.8-1.8 1.8H15" {...common}/><circle cx="12" cy="8" r="1" fill="currentColor"/><circle cx="12" cy="12" r="1" fill="currentColor"/><circle cx="12" cy="16" r="1" fill="currentColor"/></>,
    network: <><rect x="9" y="3" width="6" height="5" rx="1.2" {...common}/><rect x="3" y="16" width="6" height="5" rx="1.2" {...common}/><rect x="15" y="16" width="6" height="5" rx="1.2" {...common}/><path d="M12 8v4M6 16v-2h12v2" {...common}/><circle cx="12" cy="12" r="1.4" fill="currentColor"/></>,
    cloud: <><path d="M6 6.5h6a2.5 2.5 0 0 1 2.5 2.5v2.5H9A2.5 2.5 0 0 1 6.5 9V6.5H6Z" {...common}/><path d="M18 17.5h-6a2.5 2.5 0 0 1-2.5-2.5v-2.5H15A2.5 2.5 0 0 1 17.5 15v2.5H18Z" {...common}/><circle cx="9" cy="9" r=".8" fill="currentColor"/><circle cx="15" cy="15" r=".8" fill="currentColor"/></>,
    chart: <><path d="M4 20V5m0 15h16" {...common}/><path d="m7 16 3-4 3 2 5-7" {...common}/><circle cx="7" cy="16" r="1" fill="currentColor"/><circle cx="10" cy="12" r="1" fill="currentColor"/><circle cx="13" cy="14" r="1" fill="currentColor"/><circle cx="18" cy="7" r="1" fill="currentColor"/></>,
    flag: <><path d="M6 21V4m0 1h10l-2 3 2 3H6" {...common}/><path d="M3 21h7" {...common}/></>,
    sprout: <><path d="M12 21v-9" {...common}/><path d="M12 13c-4 0-7-2-7-6 4 0 7 2 7 6Zm0 3c4 0 7-2 7-6-4 0-7 2-7 6Z" {...common}/><path d="M7 21h10" {...common}/></>,
    puzzle: <><path d="M4 7h5a2.5 2.5 0 1 1 5 0h6v5a2.5 2.5 0 1 0 0 5v3h-5a2.5 2.5 0 1 0-5 0H4v-5a2.5 2.5 0 1 0 0-5V7Z" {...common}/></>,
    target: <><circle cx="12" cy="12" r="8" {...common}/><circle cx="12" cy="12" r="4" {...common}/><circle cx="12" cy="12" r="1.3" fill="currentColor"/><path d="m15 9 5-5m-3 0h3v3" {...common}/></>,
    trophy: <><path d="M8 4h8v5a4 4 0 0 1-8 0V4Zm4 9v4m-4 3h8m-6-3h4" {...common}/><path d="M8 6H4v2a4 4 0 0 0 4 4m8-6h4v2a4 4 0 0 1-4 4" {...common}/></>,
  };
  return <svg viewBox="0 0 24 24" className={className} aria-hidden="true">{art[kind]}</svg>;
}
