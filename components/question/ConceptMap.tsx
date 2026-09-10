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
    border: "border-default dark:border-default/20",
    bg: "bg-warning/5 dark:bg-warning/10",
    headerBg: "bg-warning/10 dark:bg-warning/10",
    headerBorder: "border-default dark:border-default/20",
    headerText: "text-warning",
    dot: "bg-warning",
    number: "bg-warning/20 text-warning",
  },
  blue: {
    border: "border-default dark:border-default/20",
    bg: "bg-primary/5 dark:bg-primary/10",
    headerBg: "bg-primary/10 dark:bg-primary/10",
    headerBorder: "border-default dark:border-default/20",
    headerText: "text-primary dark:text-primary",
    dot: "bg-primary",
    number: "bg-primary/20 text-primary dark:text-primary",
  },
  emerald: {
    border: "border-default dark:border-default/20",
    bg: "bg-success/5 dark:bg-success/10",
    headerBg: "bg-success/10 dark:bg-success/10",
    headerBorder: "border-default dark:border-default/20",
    headerText: "text-success",
    dot: "bg-success",
    number: "bg-success/20 text-success",
  },
  violet: {
    border: "border-primary/20",
    bg: "bg-primary/5 dark:bg-primary/10",
    headerBg: "bg-primary/10 dark:bg-primary/10",
    headerBorder: "border-primary/20",
    headerText: "text-primary dark:text-primary",
    dot: "bg-primary",
    number: "bg-primary/20 text-primary dark:text-primary",
  },
  indigo: {
    border: "border-default dark:border-default/20",
    bg: "bg-primary/5 dark:bg-primary/10",
    headerBg: "bg-primary/10 dark:bg-primary/10",
    headerBorder: "border-default dark:border-default/20",
    headerText: "text-primary dark:text-primary",
    dot: "bg-primary",
    number: "bg-primary/20 text-primary dark:text-primary",
  },
  rose: {
    border: "border-destructive/20",
    bg: "bg-destructive/5 dark:bg-destructive/10",
    headerBg: "bg-destructive/10 dark:bg-destructive/10",
    headerBorder: "border-destructive/20",
    headerText: "text-destructive",
    dot: "bg-destructive",
    number: "bg-destructive/20 text-destructive",
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
    <div className="my-6 not-prose" aria-live="polite">
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
                <div className={`text-[12px] font-extrabold uppercase tracking-widest ${c.headerText}`}>
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
