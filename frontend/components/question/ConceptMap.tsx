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
    border: "border-amber-200",
    bg: "bg-amber-50/30",
    headerBg: "bg-amber-50",
    headerBorder: "border-amber-200",
    headerText: "text-amber-800",
    dot: "bg-amber-400",
    number: "bg-amber-100 text-amber-700",
  },
  blue: {
    border: "border-blue-200",
    bg: "bg-blue-50/30",
    headerBg: "bg-blue-50",
    headerBorder: "border-blue-200",
    headerText: "text-blue-800",
    dot: "bg-blue-400",
    number: "bg-blue-100 text-blue-700",
  },
  emerald: {
    border: "border-emerald-200",
    bg: "bg-emerald-50/30",
    headerBg: "bg-emerald-50",
    headerBorder: "border-emerald-200",
    headerText: "text-emerald-800",
    dot: "bg-emerald-400",
    number: "bg-emerald-100 text-emerald-700",
  },
  violet: {
    border: "border-violet-200",
    bg: "bg-violet-50/30",
    headerBg: "bg-violet-50",
    headerBorder: "border-violet-200",
    headerText: "text-violet-800",
    dot: "bg-violet-400",
    number: "bg-violet-100 text-violet-700",
  },
  indigo: {
    border: "border-indigo-200",
    bg: "bg-indigo-50/30",
    headerBg: "bg-indigo-50",
    headerBorder: "border-indigo-200",
    headerText: "text-indigo-800",
    dot: "bg-indigo-400",
    number: "bg-indigo-100 text-indigo-700",
  },
  rose: {
    border: "border-rose-200",
    bg: "bg-rose-50/30",
    headerBg: "bg-rose-50",
    headerBorder: "border-rose-200",
    headerText: "text-rose-800",
    dot: "bg-rose-400",
    number: "bg-rose-100 text-rose-700",
  },
  slate: {
    border: "border-slate-200",
    bg: "bg-slate-50/30",
    headerBg: "bg-slate-50",
    headerBorder: "border-slate-200",
    headerText: "text-slate-700",
    dot: "bg-slate-400",
    number: "bg-slate-100 text-slate-600",
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
          <span className="text-[11px] font-bold uppercase tracking-widest text-slate-400">
            {title}
          </span>
          <div className="flex-1 h-px bg-slate-100" />
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
                    <span className="text-[13px] leading-[1.6] text-slate-700 font-medium">
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
