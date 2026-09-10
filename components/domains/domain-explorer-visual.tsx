import { BarChart3, Braces, Cloud, Code2 } from "lucide-react";
import { cn } from "@/lib/utils";

export interface DomainVisualGroup {
  label: string;
  count: number;
  accent: "blue" | "teal" | "violet" | "orange";
}

const GROUP_STYLES = {
  blue: "border-[#cddff8] bg-[#f4f8ff] text-[#3279C9]",
  teal: "border-[#cbe3dd] bg-[#f2faf8] text-[#126B63]",
  violet: "border-[#ddd4f2] bg-[#f8f5ff] text-[#7857D8]",
  orange: "border-[#f3d8c5] bg-[#fff7f1] text-[#D9603B]",
} as const;

const GROUP_ICONS = [Code2, BarChart3, Cloud, Braces] as const;
const GROUP_POSITIONS = [
  "left-3 top-5 sm:left-6 sm:top-8",
  "right-3 top-10 sm:right-6 sm:top-12",
  "bottom-8 left-4 sm:bottom-10 sm:left-10",
  "bottom-5 right-3 sm:bottom-8 sm:right-8",
] as const;

export function DomainExplorerVisual({ groups }: { groups: DomainVisualGroup[] }) {
  return (
    <div className="relative min-h-[330px] overflow-hidden rounded-2xl border border-[#ded7ec] bg-[linear-gradient(145deg,#fff9f3_0%,#f5f4ff_48%,#eef8f6_100%)] shadow-[0_22px_60px_rgba(55,45,82,0.10)] sm:min-h-[390px]">
      <svg className="absolute inset-0 h-full w-full" viewBox="0 0 640 420" fill="none" aria-hidden="true">
        <ellipse cx="320" cy="210" rx="238" ry="150" stroke="#7857D8" strokeOpacity="0.14" />
        <ellipse cx="320" cy="210" rx="170" ry="106" stroke="#3279C9" strokeOpacity="0.16" strokeDasharray="5 8" />
        <ellipse cx="320" cy="210" rx="102" ry="64" stroke="#126B63" strokeOpacity="0.18" />
        <path d="M139 113L262 178M498 126L378 179M165 318L269 246M489 313L376 246" stroke="#8E7EB8" strokeOpacity="0.22" strokeDasharray="4 7" />
        {[
          [92, 214], [185, 69], [450, 65], [551, 220], [431, 352], [207, 350],
        ].map(([cx, cy]) => <circle key={`${cx}-${cy}`} cx={cx} cy={cy} r="3" fill="#E87500" fillOpacity="0.5" />)}
      </svg>

      <div className="absolute left-1/2 top-1/2 z-10 grid h-24 w-24 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-2xl border border-[#a996dc] bg-white/95 shadow-[0_18px_40px_rgba(120,87,216,0.20)] sm:h-28 sm:w-28">
        <span className="font-display text-3xl font-semibold tracking-[-0.04em] text-[#7857D8] sm:text-4xl">IE</span>
        <span className="absolute -bottom-7 whitespace-nowrap text-[10px] font-medium text-muted-foreground">Your preparation map</span>
      </div>

      {groups.slice(0, 4).map((group, index) => {
        const Icon = GROUP_ICONS[index];
        return (
          <div key={group.label} className={cn("absolute z-20 flex max-w-[150px] items-center gap-2 rounded-xl border bg-white/92 px-3 py-2.5 shadow-md backdrop-blur", GROUP_POSITIONS[index])}>
            <span className={cn("grid h-9 w-9 shrink-0 place-items-center rounded-lg border", GROUP_STYLES[group.accent])}>
              <Icon className="h-4 w-4" aria-hidden="true" />
            </span>
            <span className="min-w-0">
              <strong className="block truncate text-[11px] font-semibold text-foreground">{group.label}</strong>
              <span className="text-[9px] text-muted-foreground">{group.count} {group.count === 1 ? "path" : "paths"}</span>
            </span>
          </div>
        );
      })}
    </div>
  );
}
