---
name: handoff
description: Save or resume a context handoff between Cursor chat tabs, or operate as the headless continuation agent launched by the auto-handoff watchdog. Use when the user says "handoff", "/handoff", "transfer context to next tab", "resume from previous tab", "continue from last tab", "/resume", when the current agent self-detects it is stuck, looping on the same edit, hitting context-window pressure, or making no progress for several turns, or when invoked headlessly with a prompt that points at `.cursor/handoffs/LATEST.md` or `.cursor/handoffs/AUTO-LATEST.md`. The skill writes a rich, structured snapshot to `.cursor/handoffs/` so a fresh tab (or a headless cursor-agent invoked by the watchdog) can pick up exactly where the previous tab stopped.
---

# Handoff: Tab-to-Tab Context Transfer

This skill solves a real Cursor limitation: when one chat tab gets stuck, hangs, or fills its context window, there is no automatic way to move work to a fresh tab. This skill provides a manual-but-reliable handoff protocol, plus an auto-failover layer (the watchdog at `.cursor/watchdog/`) that catches the case where the IDE tab goes silent during active work.

There are **three modes**:

- `SAVE` — current tab writes a snapshot before ending.
- `RESUME` — fresh tab (human-driven) reads a snapshot and continues.
- `AUTO-CONTINUE` — headless `cursor-agent` invoked by the watchdog reads a snapshot and continues without a human in the loop.

---

## Mode A: SAVE handoff (current tab is ending)

### When to trigger SAVE

Trigger SAVE in any of these situations:

1. **User explicitly asks** — phrases like:
   - "handoff", "/handoff", "save handoff", "save context"
   - "transfer context to next tab", "prepare for new tab"
   - "this tab is stuck, move to a fresh one"

2. **Self-detected stuck signals** (agent should proactively offer SAVE):
   - Same file edited 3+ times with the same lint/test failure
   - 5+ consecutive turns without a successful edit or new finding
   - Tool calls repeatedly timing out or hanging
   - Context-window pressure: long transcript + many large file reads
   - User says "you're going in circles" / "you're not getting it" / "stop, this is wrong" twice in a row

When self-detected, **ask the user first**: "I think I'm not making progress. Should I save a handoff so a fresh tab can continue?" Do not silently abandon the task.

### SAVE workflow

Follow these steps in order:

1. **Pick a slug** for the handoff — short kebab-case, derived from the active task. Examples: `expansion-plan-wave-b`, `python-lock-domain-fix`, `dsa-hub-schema`.

2. **Run the scaffold script** to create a timestamped file:

   ```bash
   bash .cursor/skills/handoff/scripts/new_handoff.sh <slug>
   ```

   This prints the path of a new file like `.cursor/handoffs/2026-05-28T1641-expansion-plan-wave-b.md` and also updates `.cursor/handoffs/LATEST.md` to point at it.

3. **Fill in every section** of the template using the [HANDOFF_TEMPLATE.md](HANDOFF_TEMPLATE.md). Do not leave sections empty. If a section truly has nothing, write `None.` — never delete the heading. The template covers:
   - Mission (the goal in 2–3 sentences)
   - Why this handoff is happening
   - What is DONE (with file paths, line ranges, commit refs if any)
   - What is IN PROGRESS (the half-done edit, exact file + lines)
   - What is NEXT (ordered todo list — the next 3–10 concrete steps)
   - Blockers / open questions for the next tab
   - Files touched this session (with role: edited / read / created)
   - Key code locations (path + line range + why it matters)
   - Decisions made (and rejected alternatives, so next tab does not redo)
   - Conventions / project rules learned this session
   - Commands and scripts to know
   - Last error or last failing thing (verbatim message + reproduction)
   - **How to resume in 60 seconds** — a tight bullet list a fresh agent reads first

4. **Be specific, not summary-flavored.** A good handoff lets the next agent skip re-discovery. Bad: "We worked on the Python track." Good: "Edited `frontend/lib/content-reader.ts` lines 42–58 to add `python-backend-intermediate` to `LOCKED_DOMAINS`. Build still failing because `LOCKED_DOMAIN_LABELS` map (same file, line 71) is missing the matching entry — that's the next edit."

5. **Cite real file paths and line numbers** for every claim. Use the existing-code reference format with line numbers.

6. **Tell the user exactly what to do next**: "Open a fresh tab and paste: `Resume from .cursor/handoffs/LATEST.md`."

---

## Mode B: RESUME from handoff (fresh tab is starting)

### When to trigger RESUME

Trigger RESUME in any of these situations:

- User says "resume", "/resume", "continue from previous tab", "pick up from last tab"
- User pastes a path that matches `.cursor/handoffs/*.md`
- User says "read LATEST" or "resume from LATEST"
- First message in a fresh tab references a prior tab being stuck

### RESUME workflow

1. **Read the handoff file** the user named. If they did not name one, read `.cursor/handoffs/LATEST.md`. If multiple recent handoffs exist, list them with timestamps and ask which one.

2. **Read the entire file end-to-end first** before doing anything else. Do not start editing.

3. **Verify the snapshot is still valid** by sampling reality:
   - Re-read 2–3 of the "Files touched this session" entries to confirm their state matches the handoff's "What is DONE" claims.
   - If the working tree changed since the handoff (git status, mtimes), say so to the user before continuing.

4. **Restore the todo list** in this fresh tab using the handoff's "What is NEXT" section as the in-progress + pending items, and "What is DONE" as completed items.

5. **Acknowledge the handoff to the user** in 4–6 lines:
   - One-line mission restatement
   - The exact next action you will take
   - Any blocker you noticed during verification
   - A note that you are resuming, not restarting

6. **Begin the next action** — do not re-explore, do not re-summarize the codebase. Trust the handoff's "Key code locations" and jump straight to the work.

7. **Update the previous handoff** by editing its frontmatter `status:` from `active` to `resumed-in:<new-tab-id-or-date>` so it is clear which snapshot has been picked up.

---

---

## Mode C: AUTO-CONTINUE (launched by the watchdog)

### When this fires

You were launched by `.cursor/watchdog/failover.sh` because the IDE tab in this repo went silent for >4 minutes during active work. There are two sub-cases — your behavior must adapt:

- **Visible-tab launch** (FAILOVER_MODE=visible or the visible half of `both`): you are running inside a freshly-opened Cursor IDE chat tab. The launching prompt was pasted in by AppleScript and submitted. The user may or may not be at the keyboard. Treat this like Mode B (RESUME) — you have a visible chat the user can intervene in — but obey all the safety caps from Mode C below.
- **Headless launch** (FAILOVER_MODE=headless or the headless fallback of `both`): you are a `cursor-agent -p` process. There is no human in the loop. Output goes to `.cursor/handoffs/.failover-<ts>.log`.

### AUTO-CONTINUE workflow

This is **stricter** than human RESUME because mistakes are unsupervised.

1. **Read the named snapshot end to end.** Then read `.cursor/handoffs/.activity.jsonl` (last 30 lines) for additional ground truth that the snapshot may have missed.

2. **Verify the working tree before any edit.** Run:

   ```bash
   git status
   git diff --stat
   ```

   If the tree is dirty in a way the snapshot did not predict, **stop**. Write a manual handoff via `.cursor/skills/handoff/scripts/new_handoff.sh post-failover-stopped` describing the unexpected state, and exit. Do not attempt to "clean up" automatically.

3. **Make changes one logical step at a time.** After each step, run the build / lint / test command from the snapshot's "Commands and scripts to know" section. If a step fails, **stop**. Do not retry more than once. Write a fresh manual handoff at `.cursor/handoffs/` describing the failure and exit.

4. **Hard caps for the headless run**:
   - At most **20 file edits** total (errs on caution; the watchdog launches a follow-up if needed).
   - At most **3 distinct tasks** from the snapshot's "What is NEXT" list.
   - Refuse irreversible actions: no `git push --force`, no `rm -rf` on tracked files, no `npm publish`, no production deploys, no edits outside the repo root.

5. **Always end with a fresh manual handoff.** Whether you finished cleanly or stopped at a blocker, the very last action is:

   ```bash
   bash .cursor/skills/handoff/scripts/new_handoff.sh post-failover-<short-description>
   ```

   Fill it in completely. This is what the human reads when they sit back down.

6. **Do not start exploratory work.** If the snapshot's "What is NEXT" is empty or unclear, write a manual handoff saying so and exit. Headless mode is for continuation, not for new initiatives.

---

## Storage layout

```
.cursor/handoffs/
├── README.md                                      # explains format
├── LATEST.md                                      # newest manual handoff (mode A output)
├── AUTO-LATEST.md                                 # rolling auto-snapshot (rewritten on every hook)
├── .heartbeat                                     # watchdog signal (mtime = "tab is alive")
├── .activity.jsonl                                # rolling tool-call log (last 200 events)
├── .watchdog.log                                  # watchdog + failover audit log
├── .failover-active                               # lock file; present while a failover is in flight
├── .failover-<ts>.log                             # one log per failover invocation
├── 2026-05-28T1641-expansion-plan-wave-b.md       # one snapshot per manual handoff
└── 2026-05-29T0902-python-lock-domain-fix.md
```

Each manual snapshot is plain markdown with YAML frontmatter (`created`, `status`, `task`, `parent_plan`, `slug`). They are intentionally human-editable — the user can hand-tweak before opening the new tab. `AUTO-LATEST.md` is generated by `.cursor/hooks/heartbeat.sh` and overwritten on every agent action; never edit it by hand.

---

## Quality bar (the difference between a useful handoff and a useless one)

A good handoff is **boring to read but loaded with paths, line numbers, and verbatim errors**. It is not a story. It is a debrief.

| Useless                                 | Useful                                                                                        |
| --------------------------------------- | --------------------------------------------------------------------------------------------- |
| "Worked on the Python migration."       | "Added `python-backend-intermediate` to `LOCKED_DOMAINS` in content-reader.ts:42-58. Verified compile-clean." |
| "There's a bug somewhere in the build." | "`pnpm build` fails with `TS2304: Cannot find name 'LOCKED_DOMAIN_LABELS_PYTHON'` at content-reader.ts:71." |
| "Need to write more tests."             | "Next: add Jest test in frontend/__tests__/content-reader.test.ts for the new LOCKED_DOMAINS entry — see existing JBI test at line 24 as the pattern." |

If a section in the snapshot reads like a journal entry, rewrite it as a directive a fresh agent could execute.

---

## Additional resources

- Full snapshot template with every required section: [HANDOFF_TEMPLATE.md](HANDOFF_TEMPLATE.md)
- Scaffold script (creates file + updates LATEST.md): `scripts/new_handoff.sh`
- Auto-failover watchdog (Mode C): `.cursor/watchdog/README.md`
- Hooks that maintain the heartbeat + AUTO-LATEST.md: `.cursor/hooks/heartbeat.sh`, `.cursor/hooks/finalize_handoff.sh`, `.cursor/hooks.json`
