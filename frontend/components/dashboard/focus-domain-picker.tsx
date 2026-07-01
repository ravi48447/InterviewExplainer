'use client';

import React, { useEffect, useMemo, useState } from 'react';
import type { ContentDomain } from '@/lib/types/content-domain';
import { cn } from '@/lib/utils';
import { Check, Loader2 } from 'lucide-react';

const LEVEL_ORDER = ['beginner', 'intermediate', 'advanced'];

interface FocusDomainPickerProps {
  /** Currently selected content slug (so the picker can pre-fill lang/track). */
  valueSlug?: string | null;
  /** Called when the user picks a concrete domain (language + track + level). */
  onSelect: (domain: ContentDomain) => void;
  /**
   * Optional pre-fetched domain list. When omitted the picker fetches
   * `/api/content/all-domains` itself. Pass it in to avoid a duplicate fetch
   * when the parent already has the list.
   */
  domains?: ContentDomain[];
  className?: string;
  /** When true the level options render in their own row of larger cards. */
  emphasizeLevels?: boolean;
}

/**
 * A real, content-backed domain picker: Language → Track → Experience Level.
 *
 * Every option is derived from `/api/content/all-domains`, so the user can only
 * choose combinations that actually have content. The selected option is a real
 * `ContentDomain` whose `slug` (e.g. "java-backend-intermediate") maps directly
 * to the filesystem content tree the rest of the site serves.
 */
export function FocusDomainPicker({
  valueSlug,
  onSelect,
  domains: domainsProp,
  className,
  emphasizeLevels = false,
}: FocusDomainPickerProps) {
  const [fetched, setFetched] = useState<ContentDomain[] | null>(domainsProp ?? null);
  const [loading, setLoading] = useState(!domainsProp);
  const [lang, setLang] = useState<string | null>(null);
  const [track, setTrack] = useState<string | null>(null);

  useEffect(() => {
    if (domainsProp) {
      setFetched(domainsProp);
      setLoading(false);
      return;
    }
    let alive = true;
    setLoading(true);
    fetch('/api/content/all-domains')
      .then(r => r.json())
      .then((all: ContentDomain[]) => {
        if (alive) setFetched(Array.isArray(all) ? all : []);
      })
      .catch(() => { if (alive) setFetched([]); })
      .finally(() => { if (alive) setLoading(false); });
    return () => { alive = false; };
  }, [domainsProp]);

  // Only domains that actually have content (real questions, or locked
  // curriculum modules) are selectable.
  const enabled = useMemo(
    () => (fetched ?? []).filter(d => d.hasContent || d.stackCount > 0),
    [fetched],
  );

  // Pre-fill language/track from the current selection (or first available).
  useEffect(() => {
    if (enabled.length === 0) return;
    const current = valueSlug ? enabled.find(d => d.slug === valueSlug) : undefined;
    setLang(prev => prev ?? current?.languageSlug ?? enabled[0].languageSlug);
    setTrack(prev => prev ?? current?.trackSlug ?? null);
  }, [enabled, valueSlug]);

  const languages = useMemo(() => {
    const m = new Map<string, string>();
    for (const d of enabled) if (!m.has(d.languageSlug)) m.set(d.languageSlug, d.language);
    return [...m.entries()].map(([slug, name]) => ({ slug, name }))
      .sort((a, b) => a.name.localeCompare(b.name));
  }, [enabled]);

  const tracks = useMemo(() => {
    if (!lang) return [];
    const m = new Map<string, string>();
    for (const d of enabled) {
      if (d.languageSlug === lang && !m.has(d.trackSlug)) m.set(d.trackSlug, d.track);
    }
    return [...m.entries()].map(([slug, name]) => ({ slug, name }))
      .sort((a, b) => a.name.localeCompare(b.name));
  }, [enabled, lang]);

  const levels = useMemo(() => {
    if (!lang || !track) return [];
    return enabled
      .filter(d => d.languageSlug === lang && d.trackSlug === track)
      .sort((a, b) => LEVEL_ORDER.indexOf(a.level) - LEVEL_ORDER.indexOf(b.level));
  }, [enabled, lang, track]);

  if (loading) {
    return (
      <div className={cn('flex items-center justify-center gap-2 py-6 text-sm text-muted-foreground', className)}>
        <Loader2 className="h-4 w-4 animate-spin" /> Loading domains…
      </div>
    );
  }

  if (enabled.length === 0) {
    return (
      <p className={cn('py-4 text-sm text-muted-foreground', className)}>
        No domains available right now.
      </p>
    );
  }

  return (
    <div className={cn('space-y-3.5', className)}>
      {/* Step 1 — Language */}
      <div>
        <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground mb-1.5">1 · Language / Role</p>
        <div className="flex flex-wrap gap-1.5">
          {languages.map(l => (
            <button
              key={l.slug}
              type="button"
              onClick={() => { setLang(l.slug); setTrack(null); }}
              className={cn(
                'px-2.5 py-1 rounded-lg text-xs font-semibold border transition-colors',
                lang === l.slug
                  ? 'bg-indigo-600 text-white border-indigo-600 dark:border-indigo-700'
                  : 'bg-background text-foreground border-border hover:border-indigo-300 dark:border-indigo-700 hover:bg-indigo-50 dark:bg-indigo-500/10',
              )}
            >
              {l.name}
            </button>
          ))}
        </div>
      </div>

      {/* Step 2 — Track */}
      {lang && tracks.length > 0 && (
        <div>
          <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground mb-1.5">2 · Track</p>
          <div className="flex flex-wrap gap-1.5">
            {tracks.map(t => (
              <button
                key={t.slug}
                type="button"
                onClick={() => setTrack(t.slug)}
                className={cn(
                  'px-2.5 py-1 rounded-lg text-xs font-semibold border transition-colors',
                  track === t.slug
                    ? 'bg-indigo-600 text-white border-indigo-600 dark:border-indigo-700'
                    : 'bg-background text-foreground border-border hover:border-indigo-300 dark:border-indigo-700 hover:bg-indigo-50 dark:bg-indigo-500/10',
                )}
              >
                {t.name}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Step 3 — Level (commits the selection) */}
      {lang && track && levels.length > 0 && (
        <div>
          <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground mb-1.5">3 · Experience Level</p>
          <div className={cn('grid gap-1.5', emphasizeLevels ? 'grid-cols-3' : 'grid-cols-1')}>
            {levels.map(d => {
              const selected = d.slug === valueSlug;
              return (
                <button
                  key={d.slug}
                  type="button"
                  onClick={() => onSelect(d)}
                  className={cn(
                    'group flex items-center justify-between gap-2 rounded-xl border p-2.5 text-left transition-all',
                    selected
                      ? 'border-indigo-400 dark:border-indigo-700 bg-indigo-50 dark:bg-indigo-500/10 ring-1 ring-indigo-300'
                      : 'border-border bg-background hover:border-indigo-300 dark:border-indigo-700 hover:bg-indigo-50 dark:bg-indigo-500/10 dark:bg-indigo-950/20/60',
                    emphasizeLevels && 'flex-col items-start',
                  )}
                >
                  <div className="min-w-0">
                    <p className="text-sm font-bold text-foreground">{d.levelLabel}</p>
                    <p className="text-[11px] text-muted-foreground">
                      {d.levelRange} · {d.stackCount} module{d.stackCount === 1 ? '' : 's'}
                      {d.questionCount > 0 ? ` · ${d.questionCount} Q` : ''}
                    </p>
                  </div>
                  {selected
                    ? <Check className="h-4 w-4 text-indigo-600 dark:text-indigo-400 shrink-0" aria-hidden="true" />
                    : <span className="text-[10px] font-bold text-indigo-500 dark:text-indigo-400 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">Select →</span>}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
