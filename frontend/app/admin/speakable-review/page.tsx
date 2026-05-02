/**
 * Admin Speakable Review — Phase 1.8.
 *
 * Where humans approve `pending_review` v2 to flip them to `approved`.
 * Lists every question in the queue (grouped by pillar P01-P12), and
 * on click renders a side-by-side: legacy on the left, v2 forced on
 * the right. Above the side-by-side we show the lint score (live, via
 * the lint API) and a TTS preview button.
 *
 * Auth: query-param `?key=<SPEAKABLE_ADMIN_KEY>`. **NOT production
 * grade** — see HUMAN-REVIEW-QUEUE.md AUTH-1.
 *
 * The list is empty in current state — no questions carry
 * `pending_review` yet. The page renders an "All clear" empty state
 * when that's the case, so it's verifiable end-to-end without seed data.
 */

"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { ReadAloudButton, Speakable } from "@/components/speakable";
import type { SpeakableV2 } from "@/lib/speakable/schema";

interface QueueItem {
  slug: string;
  title: string;
  pillar: string | null;
  archetype: string | null;
  status: string | null;
  filePath: string;
  questionId: string | number | null;
}

interface ListResponse {
  status: string;
  total: number;
  items: QueueItem[];
  counts: Record<string, number>;
}

interface DetailResponse {
  file: string;
  slug: string;
  title: string;
  questionId: string | number;
  legacy: { type: "speakable_answer"; content: string };
  v2: SpeakableV2 | null;
}

interface LintResponse {
  file: string;
  questionSlug: string;
  exitCode: number | null;
  result: {
    status?: string;
    score?: number;
    archetype?: string;
    pillar?: string;
    violations?: Array<{ rule: string; severity: string; message: string }>;
  } | null;
  raw?: unknown;
}

const PILLARS = ["P01", "P02", "P03", "P04", "P05", "P06", "P07", "P08", "P09", "P10", "P11", "P12"];

export default function SpeakableReviewPage() {
  const params = useSearchParams();
  const key = params?.get("key") ?? "";
  const [list, setList] = useState<ListResponse | null>(null);
  const [listError, setListError] = useState<string | null>(null);
  const [activeSlug, setActiveSlug] = useState<string | null>(null);
  const [detail, setDetail] = useState<DetailResponse | null>(null);
  const [detailError, setDetailError] = useState<string | null>(null);
  const [lint, setLint] = useState<LintResponse | null>(null);
  const [busy, setBusy] = useState(false);
  const [actionMsg, setActionMsg] = useState<string | null>(null);
  const [notes, setNotes] = useState("");

  const refreshList = useCallback(async () => {
    setListError(null);
    try {
      const res = await fetch(`/api/admin/speakable-review/list?key=${encodeURIComponent(key)}`);
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body?.error ?? `HTTP ${res.status}`);
      }
      setList((await res.json()) as ListResponse);
    } catch (err) {
      setListError(err instanceof Error ? err.message : String(err));
    }
  }, [key]);

  useEffect(() => {
    if (key) void refreshList();
  }, [key, refreshList]);

  const grouped = useMemo(() => {
    const map = new Map<string, QueueItem[]>();
    for (const p of PILLARS) map.set(p, []);
    map.set("(other)", []);
    for (const item of list?.items ?? []) {
      const k = item.pillar ?? "(other)";
      const bucket = map.get(k) ?? map.get("(other)")!;
      bucket.push(item);
    }
    return map;
  }, [list]);

  const openDetail = useCallback(
    async (slug: string) => {
      setActiveSlug(slug);
      setDetail(null);
      setLint(null);
      setActionMsg(null);
      setNotes("");
      setDetailError(null);
      try {
        const [d, l] = await Promise.all([
          fetch(
            `/api/admin/speakable-review/detail?key=${encodeURIComponent(key)}&question_slug=${encodeURIComponent(slug)}`,
          ),
          fetch(
            `/api/admin/speakable-review/lint?key=${encodeURIComponent(key)}&question_slug=${encodeURIComponent(slug)}`,
          ),
        ]);
        if (!d.ok) {
          const body = await d.json().catch(() => ({}));
          throw new Error(body?.error ?? `detail HTTP ${d.status}`);
        }
        setDetail((await d.json()) as DetailResponse);
        if (l.ok) setLint((await l.json()) as LintResponse);
      } catch (err) {
        setDetailError(err instanceof Error ? err.message : String(err));
      }
    },
    [key],
  );

  const submitDecision = useCallback(
    async (decision: "approve" | "reject" | "send_back") => {
      if (!activeSlug) return;
      if (decision !== "approve" && !notes.trim()) {
        setActionMsg("Notes are required for reject and send_back.");
        return;
      }
      setBusy(true);
      setActionMsg(null);
      try {
        const res = await fetch(
          `/api/admin/speakable-review/approve?key=${encodeURIComponent(key)}`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              question_slug: activeSlug,
              decision,
              notes: notes.trim() || undefined,
            }),
          },
        );
        const body = (await res.json().catch(() => ({}))) as { error?: string; new_status?: string };
        if (!res.ok) throw new Error(body?.error ?? `HTTP ${res.status}`);
        setActionMsg(`Done — new status: ${body.new_status}`);
        await refreshList();
      } catch (err) {
        setActionMsg(err instanceof Error ? err.message : String(err));
      } finally {
        setBusy(false);
      }
    },
    [activeSlug, key, notes, refreshList],
  );

  if (!key) {
    return (
      <main className="min-h-screen bg-slate-50 p-10">
        <div className="max-w-xl mx-auto bg-white rounded-xl border border-slate-200 p-8 shadow">
          <p className="text-[11px] uppercase tracking-[0.18em] text-slate-500 mb-2">
            /admin/speakable-review
          </p>
          <h1 className="text-2xl font-bold mb-3">Admin key required</h1>
          <p className="text-slate-600 text-sm leading-relaxed">
            Append <code className="bg-slate-100 px-1 rounded">?key=YOUR_KEY</code> to the URL where{" "}
            <code className="bg-slate-100 px-1 rounded">YOUR_KEY</code> matches the
            server-side env var <code className="bg-slate-100 px-1 rounded">SPEAKABLE_ADMIN_KEY</code>.
          </p>
          <p className="mt-4 text-[12px] text-amber-700 bg-amber-50 border border-amber-200 rounded px-3 py-2">
            <strong>Dev-only:</strong> this gate is not production-grade. See HUMAN-REVIEW-QUEUE.md AUTH-1.
          </p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-50 px-4 sm:px-8 py-8">
      <header className="max-w-7xl mx-auto mb-8">
        <p className="text-[11px] uppercase tracking-[0.18em] text-slate-500 mb-2">
          /admin/speakable-review
        </p>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight mb-2">
          Speakable v2 — review queue
        </h1>
        <p className="text-slate-600 text-sm">
          Approve <code className="bg-slate-100 px-1 rounded">pending_review</code> to flip{" "}
          <code className="bg-slate-100 px-1 rounded">speakable_status</code> to{" "}
          <code className="bg-slate-100 px-1 rounded">approved</code>. Mutations write to{" "}
          <code className="bg-slate-100 px-1 rounded">complete-qa.json</code> on disk.
        </p>
        {listError && (
          <p className="mt-3 text-[12px] text-red-700 bg-red-50 border border-red-200 rounded px-3 py-2">
            Failed to load queue: {listError}
          </p>
        )}
        {list && (
          <div className="mt-4 flex flex-wrap gap-2 text-[12px]">
            {Object.entries(list.counts).map(([k, v]) => (
              <span
                key={k}
                className={
                  "px-2.5 py-1 rounded-full border font-semibold " +
                  (k === "pending_review"
                    ? "border-amber-300 bg-amber-50 text-amber-800"
                    : k === "approved"
                      ? "border-emerald-300 bg-emerald-50 text-emerald-800"
                      : "border-slate-200 bg-white text-slate-700")
                }
              >
                {k}: {v}
              </span>
            ))}
          </div>
        )}
      </header>

      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-[320px_minmax(0,1fr)] gap-6">
        <aside className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm h-fit">
          <h2 className="text-sm font-bold text-slate-900 mb-3">
            Queue ({list?.total ?? 0})
          </h2>
          {list && list.total === 0 ? (
            <div className="text-[13px] text-slate-500 italic">
              All clear — no <code>pending_review</code> items.
            </div>
          ) : (
            <ul className="space-y-3">
              {[...grouped.entries()]
                .filter(([, items]) => items.length > 0)
                .map(([pillar, items]) => (
                  <li key={pillar}>
                    <p className="text-[10px] uppercase tracking-[0.15em] text-slate-500 font-semibold mb-1.5">
                      {pillar} — {items.length}
                    </p>
                    <ul className="space-y-1">
                      {items.map((q) => (
                        <li key={q.slug}>
                          <button
                            type="button"
                            onClick={() => openDetail(q.slug)}
                            className={
                              "w-full text-left px-2 py-1.5 rounded text-[13px] " +
                              (activeSlug === q.slug
                                ? "bg-slate-900 text-white"
                                : "hover:bg-slate-100 text-slate-800")
                            }
                          >
                            <span className="block truncate">{q.title}</span>
                            <span
                              className={
                                "block text-[10.5px] " +
                                (activeSlug === q.slug ? "text-slate-300" : "text-slate-500")
                              }
                            >
                              {q.archetype ?? "?"} · {q.slug}
                            </span>
                          </button>
                        </li>
                      ))}
                    </ul>
                  </li>
                ))}
            </ul>
          )}
        </aside>

        <section className="min-h-[400px]">
          {!activeSlug && (
            <div className="bg-white rounded-xl border border-slate-200 p-8 shadow-sm text-slate-500 italic text-sm">
              Pick a question from the queue to review it side-by-side.
            </div>
          )}
          {activeSlug && detailError && (
            <div className="bg-white rounded-xl border border-red-200 p-6 shadow-sm">
              <p className="text-red-700 text-sm">Failed to load detail: {detailError}</p>
            </div>
          )}
          {activeSlug && detail && (
            <div className="space-y-4">
              <header className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm">
                <p className="text-[11px] uppercase tracking-[0.15em] text-slate-500 mb-1">
                  {detail.file}
                </p>
                <h2 className="text-xl font-bold text-slate-900 mb-2">{detail.title}</h2>
                <div className="flex flex-wrap items-center gap-3 text-[12px] text-slate-600 mb-3">
                  <span className="px-2 py-0.5 rounded bg-slate-100 font-mono">{detail.slug}</span>
                  {lint?.result && (
                    <span
                      className={
                        "px-2 py-0.5 rounded font-semibold " +
                        (lint.result.status === "fail"
                          ? "bg-red-100 text-red-800"
                          : lint.result.status === "warn"
                            ? "bg-amber-100 text-amber-800"
                            : "bg-emerald-100 text-emerald-800")
                      }
                    >
                      lint: {lint.result.status} · {lint.result.score}/100
                    </span>
                  )}
                  {detail.v2 && (
                    <ReadAloudButton
                      source={{ kind: "v2", v2: { ...detail.v2, speakable_status: "approved" } as SpeakableV2 }}
                      label="Preview TTS"
                      stopLabel="Stop"
                    />
                  )}
                </div>
                {lint?.result?.violations && lint.result.violations.length > 0 && (
                  <details className="text-[12px] mt-2">
                    <summary className="cursor-pointer text-slate-700 font-semibold">
                      {lint.result.violations.length} lint violation
                      {lint.result.violations.length === 1 ? "" : "s"}
                    </summary>
                    <ul className="mt-2 space-y-1 pl-4 list-disc">
                      {lint.result.violations.map((v, i) => (
                        <li key={i}>
                          <span
                            className={
                              "font-mono mr-2 text-[10.5px] " +
                              (v.severity === "fail" ? "text-red-700" : "text-amber-700")
                            }
                          >
                            {v.rule}
                          </span>
                          {v.message}
                        </li>
                      ))}
                    </ul>
                  </details>
                )}
              </header>

              <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
                <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm">
                  <p className="text-[11px] uppercase tracking-[0.15em] text-slate-500 mb-3 font-semibold">
                    Legacy
                  </p>
                  <Speakable
                    source={{ kind: "legacy", legacy: detail.legacy }}
                    legacyVariant="preview"
                  />
                </div>
                <div className="bg-white rounded-xl border border-emerald-200 p-5 shadow-sm">
                  <p className="text-[11px] uppercase tracking-[0.15em] text-emerald-700 mb-3 font-semibold">
                    v2 (forced render)
                  </p>
                  {detail.v2 ? (
                    <Speakable
                      source={{ kind: "v2", v2: detail.v2 }}
                      forceV2
                    />
                  ) : (
                    <p className="text-[13px] text-slate-500 italic">
                      No speakable_v2 on this question.
                    </p>
                  )}
                </div>
              </div>

              <footer className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm">
                <label className="block text-[12px] font-semibold text-slate-700 mb-2">
                  Notes (required for reject + send back)
                </label>
                <textarea
                  rows={3}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full text-[13px] border border-slate-300 rounded px-3 py-2 mb-3"
                  placeholder="What needs to change?"
                />
                <div className="flex flex-wrap gap-2">
                  <button
                    type="button"
                    disabled={busy}
                    onClick={() => submitDecision("approve")}
                    className="px-4 py-2 rounded-md bg-emerald-600 text-white font-semibold text-[13px] hover:bg-emerald-700 disabled:opacity-50"
                  >
                    Approve
                  </button>
                  <button
                    type="button"
                    disabled={busy}
                    onClick={() => submitDecision("reject")}
                    className="px-4 py-2 rounded-md bg-red-600 text-white font-semibold text-[13px] hover:bg-red-700 disabled:opacity-50"
                  >
                    Reject
                  </button>
                  <button
                    type="button"
                    disabled={busy}
                    onClick={() => submitDecision("send_back")}
                    className="px-4 py-2 rounded-md bg-slate-700 text-white font-semibold text-[13px] hover:bg-slate-800 disabled:opacity-50"
                  >
                    Send back to agent
                  </button>
                </div>
                {actionMsg && (
                  <p
                    className={
                      "mt-3 text-[12px] " +
                      (actionMsg.startsWith("Done") ? "text-emerald-700" : "text-red-700")
                    }
                  >
                    {actionMsg}
                  </p>
                )}
              </footer>
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
