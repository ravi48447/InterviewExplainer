type ConceptColor = "amber" | "blue" | "emerald" | "violet" | "indigo" | "rose" | "slate";

interface ConceptCard {
  color: ConceptColor;
  title: string;
  subtitle?: string;
  points: string[];
}

const colorMap: Record<
  ConceptColor,
  {
    border: string;
    bg: string;
    headerBg: string;
    headerBorder: string;
    headerText: string;
    dot: string;
    number: string;
  }
> = {
  amber: {
    border: "border-amber-200 dark:border-amber-500/20",
    bg: "bg-amber-50/30 dark:bg-amber-950/20",
    headerBg: "bg-amber-50 dark:bg-amber-500/10",
    headerBorder: "border-amber-200 dark:border-amber-500/20",
    headerText: "text-amber-800 dark:text-amber-400",
    dot: "bg-amber-400",
    number: "bg-amber-100 dark:bg-amber-950/30 text-amber-700 dark:text-amber-400",
  },
  blue: {
    border: "border-blue-200 dark:border-blue-500/20",
    bg: "bg-blue-50/30 dark:bg-blue-950/20",
    headerBg: "bg-blue-50 dark:bg-blue-500/10",
    headerBorder: "border-blue-200 dark:border-blue-500/20",
    headerText: "text-blue-800 dark:text-blue-400",
    dot: "bg-blue-400",
    number: "bg-blue-100 dark:bg-blue-950/30 text-blue-700 dark:text-blue-400",
  },
  emerald: {
    border: "border-emerald-200 dark:border-emerald-500/20",
    bg: "bg-emerald-50/30 dark:bg-emerald-950/20",
    headerBg: "bg-emerald-50 dark:bg-emerald-500/10",
    headerBorder: "border-emerald-200 dark:border-emerald-500/20",
    headerText: "text-emerald-800 dark:text-emerald-400",
    dot: "bg-emerald-400",
    number: "bg-emerald-100 dark:bg-emerald-950/30 text-emerald-700 dark:text-emerald-400",
  },
  violet: {
    border: "border-violet-200 dark:border-violet-500/20",
    bg: "bg-violet-50/30 dark:bg-violet-950/20",
    headerBg: "bg-violet-50 dark:bg-violet-500/10",
    headerBorder: "border-violet-200 dark:border-violet-500/20",
    headerText: "text-violet-800 dark:text-violet-400",
    dot: "bg-violet-400",
    number: "bg-violet-100 dark:bg-violet-950/30 text-violet-700 dark:text-violet-400",
  },
  indigo: {
    border: "border-indigo-200 dark:border-indigo-500/20",
    bg: "bg-indigo-50/30 dark:bg-indigo-950/20",
    headerBg: "bg-indigo-50 dark:bg-indigo-500/10",
    headerBorder: "border-indigo-200 dark:border-indigo-500/20",
    headerText: "text-indigo-800 dark:text-indigo-400",
    dot: "bg-indigo-400",
    number: "bg-indigo-100 dark:bg-indigo-950/30 text-indigo-700 dark:text-indigo-400",
  },
  rose: {
    border: "border-rose-200 dark:border-rose-500/20",
    bg: "bg-rose-50/30 dark:bg-rose-950/20",
    headerBg: "bg-rose-50 dark:bg-rose-500/10",
    headerBorder: "border-rose-200 dark:border-rose-500/20",
    headerText: "text-rose-800 dark:text-rose-400",
    dot: "bg-rose-400 dark:bg-rose-800",
    number: "bg-rose-100 dark:bg-rose-950/20 text-rose-700 dark:text-rose-400",
  },
  slate: {
    border: "border-border",
    bg: "bg-surface/30",
    headerBg: "bg-surface",
    headerBorder: "border-border",
    headerText: "text-foreground",
    dot: "bg-slate-400 dark:bg-slate-800",
    number: "bg-surface text-muted-foreground",
  },
};

/**
 * Content format — one card per line, pipe-delimited:
 *   color|Title|subtitle (optional, prefix with ~)|point1|point2|point3
 *
 * Example:
 *   amber|Encapsulation|~Bundle data + methods|private fields + public methods|expose behavior not state
 *   blue|Inheritance|~IS-A relationship|extends keyword|no multiple via classes
 */
function parseCards(content: string): ConceptCard[] {
  return content
    .trim()
    .split("\n")
    .filter(Boolean)
    .map((line) => {
      const parts = line.split("|").map((p) => p.trim());
      const color = (parts[0] || "slate") as ConceptColor;
      const title = parts[1] || "";
      const rest = parts.slice(2);
      let subtitle: string | undefined;
      const points: string[] = [];

      for (const part of rest) {
        if (part.startsWith("~")) {
          subtitle = part.slice(1);
        } else if (part) {
          points.push(part);
        }
      }

      return { color, title, subtitle, points };
    });
}

export function ConceptMap({
  title,
  content,
  cols,
}: {
  title?: string;
  content: string;
  cols?: 2 | 3 | 4;
}) {
  const cards = parseCards(content);
  const colClass =
    cols === 2
      ? "grid-cols-1 sm:grid-cols-2"
      : cols === 3
      ? "grid-cols-1 sm:grid-cols-3"
      : "grid-cols-2 lg:grid-cols-4";

  return (
    <div className="my-6 not-prose">
      {title && (
        <div className="flex items-center gap-2 mb-4">
          <span className="text-[11px] font-bold uppercase tracking-widest text-muted-foreground">
            {title}
          </span>
          <div className="flex-1 h-px bg-surface" />
        </div>
      )}
      <div className={`grid ${colClass} gap-3`}>
        {cards.map((card, i) => {
          const c = colorMap[card.color] ?? colorMap.slate;
          return (
            <div
              key={i}
              className={`rounded-xl border ${c.border} ${c.bg} overflow-hidden flex flex-col`}
            >
              {/* Header */}
              <div className={`px-4 py-3 ${c.headerBg} border-b ${c.headerBorder}`}>
                <div className={`text-[12px] font-black uppercase tracking-widest ${c.headerText}`}>
                  {card.title}
                </div>
                {card.subtitle && (
                  <div className={`text-[12px] mt-0.5 font-semibold ${c.headerText} opacity-70`}>
                    {card.subtitle}
                  </div>
                )}
              </div>

              {/* Points */}
              <ul className="px-4 py-3 space-y-2 flex-1">
                {card.points.map((point, j) => (
                  <li key={j} className="flex items-start gap-2">
                    <span
                      className={`mt-[6px] h-1.5 w-1.5 rounded-full ${c.dot} shrink-0`}
                    />
                    <span className="text-[13px] leading-[1.6] text-foreground font-medium">
                      {point}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          );
        })}
      </div>
    </div>
  );
}
