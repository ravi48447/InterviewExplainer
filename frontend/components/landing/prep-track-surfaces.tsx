import Link from "next/link";
import { ArrowRight, Network } from "lucide-react";
import { TechIcon } from "@/components/tech-icon";
import { STANDALONE_PREP_TRACKS } from "@/lib/prep-tracks";

function TrackIcon({ icon }: { icon: (typeof STANDALONE_PREP_TRACKS)[number]["icon"] }) {
  if (icon === "network") {
    return (
      <div className="shrink-0 w-11 h-11 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center shadow-sm">
        <Network className="h-5 w-5 text-white" aria-hidden />
      </div>
    );
  }
  return (
    <div className="shrink-0 w-11 h-11 rounded-xl bg-surface flex items-center justify-center border border-border">
      <TechIcon name={icon} className="h-7 w-7" />
    </div>
  );
}

interface PrepTrackSurfacesProps {
  /** `home` — compact band on landing. `prep` — top of /prep with in-page jump links. */
  variant: "home" | "prep";
}

/**
 * Equal-weight surfaces: system design, Java, Python, frontend — not nested
 * under a single "Java prep" narrative.
 */
export function PrepTrackSurfaces({ variant }: PrepTrackSurfacesProps) {
  const isPrep = variant === "prep";

  return (
    <section
      aria-labelledby={`prep-tracks-${variant}`}
      className={
        isPrep
          ? "mb-10 rounded-2xl border border-border bg-background p-5 sm:p-6 shadow-sm"
          : "py-12 sm:py-14 bg-background border-y border-slate-100 dark:border-slate-800/60"
      }
    >
      <div className={isPrep ? "" : "w-full px-6 sm:px-12 lg:px-20"}>
        <div className={isPrep ? "" : "w-full min-w-0"}>
          <div className={`text-center ${isPrep ? "mb-6" : "mb-8 sm:mb-10"}`}>
            <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">
              {isPrep ? "Start from a track" : "Choose a prep surface"}
            </p>
            <h2
              id={`prep-tracks-${variant}`}
              className={`font-bold text-foreground tracking-tight ${
                isPrep ? "text-xl sm:text-2xl" : "text-2xl sm:text-3xl"
              }`}
            >
              {isPrep
                ? "Independent prep surfaces"
                : "Independent tracks — not one Java-only funnel"}
            </h2>
            <p
              className={`mt-2 text-muted-foreground max-w-2xl mx-auto ${
                isPrep ? "text-sm" : "text-sm sm:text-base"
              }`}
            >
              System design and architecture are language-agnostic hubs. Java and Python use
              roadmaps and the domain browser. Frontend (React, JS, TS) lives on the fullstack
              track. Use any entry point — they are not the same as &quot;Java prep with extras.&quot;
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {STANDALONE_PREP_TRACKS.map((t) => (
              <div
                key={t.id}
                className="flex flex-col gap-2 rounded-xl border border-border bg-surface/60 p-4 sm:p-5 hover:border-indigo-200 dark:border-indigo-500/20 hover:bg-background transition-colors text-left"
              >
                <div className="flex gap-4">
                  <TrackIcon icon={t.icon} />
                  <div className="flex-1 min-w-0">
                    <h3 className="text-base font-bold text-foreground">{t.title}</h3>
                    <p className="mt-1 text-xs sm:text-sm text-muted-foreground leading-snug">
                      {t.description}
                    </p>
                  </div>
                </div>
                <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-slate-100 dark:border-slate-800/60 mt-1">
                  <Link
                    href={t.href}
                    className="inline-flex items-center gap-1.5 rounded-lg dark:bg-surface px-3 py-1.5 text-xs font-semibold text-white hover:dark:bg-surface transition-colors"
                  >
                    Open track
                    <ArrowRight className="h-3.5 w-3.5" />
                  </Link>
                  {isPrep && t.prepHash && (
                    <Link
                      href={`/prep${t.prepHash}`}
                      className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline"
                    >
                      Related section on this page ↓
                    </Link>
                  )}
                </div>
              </div>
            ))}
          </div>

          {!isPrep && (
            <p className="mt-6 text-center text-xs text-muted-foreground">
              Full topic index:{" "}
              <Link href="/prep" className="font-semibold text-foreground hover:underline">
                Interview prep hub
              </Link>
            </p>
          )}
        </div>
      </div>
    </section>
  );
}
