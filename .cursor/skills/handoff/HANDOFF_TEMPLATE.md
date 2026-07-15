# Handoff Snapshot Template

This is the **full** template every handoff snapshot must follow. The scaffold script `scripts/new_handoff.sh` creates a new file pre-populated with this structure. Fill in every section. Use `None.` for genuinely empty sections — never delete a heading.

---

```markdown
---
created: <ISO 8601 timestamp, e.g. 2026-05-28T16:41:00+05:30>
status: active            # active | resumed-in:<date-or-tab-id> | abandoned
task: <one-line task summary, max 100 chars>
parent_plan: <relative path to .cursor/plans/*.plan.md if any, else None>
slug: <kebab-case slug, matches filename>
---

# Handoff: <Task Title>

## 0. How to resume in 60 seconds

A 4–8 bullet checklist a fresh agent reads first. Each bullet is a concrete action, not narration.

- Open <file:line-range> — that's where the previous tab stopped.
- Run `<exact command>` to reproduce the current failing state.
- The next edit is: <one sentence describing the very next change>.
- Do NOT re-explore <area X> — already mapped in section 8.

## 1. Mission

2–3 sentences. The goal of the overall task and where this session fits inside it. Mention the parent plan if any.

## 2. Why this handoff is happening

Pick one or more:
- [ ] User explicitly requested a handoff
- [ ] Agent self-detected looping on the same edit/error
- [ ] Context window pressure (long transcript)
- [ ] Tool calls hanging or timing out
- [ ] Scope grew, fresh tab needed for clarity

Add 2–3 lines of detail so the next tab does not repeat the same trap.

## 3. What is DONE

Concrete, verifiable bullets. Each bullet must include a path and (where applicable) line range or commit ref.

- ✅ <description> — `path/to/file.ts:42-58`
- ✅ <description> — committed in `<sha or branch>`

## 4. What is IN PROGRESS

The single half-done thing, with the exact file, the exact lines, and what was about to be typed.

- File: `path/to/file.ts`
- Lines: `<start>-<end>`
- Intent: <one sentence>
- State: <e.g. "compiles but test fails", "edit applied but unsaved in VSCode", "script written but not yet run">

## 5. What is NEXT

Ordered todo list. The next 3–10 concrete steps. Each step is something a fresh agent can execute without asking questions.

1. <step> — file/command
2. <step> — file/command
3. <step> — file/command

## 6. Blockers and open questions

Things the next tab needs answered or unblocked. If a question needs the user, mark it `@user`.

- @user: <question requiring human decision>
- <technical blocker the next agent can investigate>

## 7. Files touched this session

Group by role. Path + one-line role.

### Edited
- `path/to/file.ts` — added X / removed Y

### Created
- `path/to/new-file.ts` — purpose

### Read (load-bearing for context only, not edited)
- `path/to/reference.ts` — used as the pattern for X

## 8. Key code locations to know

The 3–10 most important locations a fresh agent must understand. Each entry: path + line range + why it matters. Use code references with line numbers when quoting.

- `path/to/file.ts:42-58` — defines `LOCKED_DOMAINS`; new entries go here
- `path/to/other.ts:10-20` — registry pattern reused across modules

## 9. Decisions made (and alternatives rejected)

So the next tab does not relitigate.

- Decided: <decision>. Rejected: <alt>, because <reason>.

## 10. Conventions and project rules learned

Anything specific to this codebase that the next tab must respect.

- File X is generated; never edit directly. Edit Y instead.
- Tests run with `<command>`, not `npm test`.

## 11. Commands and scripts to know

Verbatim commands the next tab will likely need.

- Build: `<command>`
- Test: `<command>`
- Lint: `<command>`
- Reproduce current failure: `<command>`

## 12. Last error / last failing thing

Verbatim error message, exit code, and minimal reproduction. If no failure, write `None.`

```
<paste the actual error output here>
```

## 13. Notes for the next agent

Free-form. Tone, gotchas, things you tried that did not work, hypotheses worth testing.
```

---

## Filling-in tips

1. **Paths and line numbers are non-negotiable.** A handoff without paths is a story, not a snapshot.
2. **Verbatim errors only.** Do not paraphrase compiler output. Copy/paste it.
3. **Section 0 is the most important section.** Write it last, after the rest is filled in, so it summarizes correctly.
4. **Section 5 is the second most important.** If sections 5 and 0 are perfect, the handoff is already useful even if the others are thin.
5. **Mark assumptions explicitly.** If you are guessing about state, say so — do not state guesses as facts.
