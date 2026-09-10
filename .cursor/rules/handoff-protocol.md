# Handoff Protocol — Always Read at Session Start

This project uses a tab-to-tab handoff system. Any agent working in this repo must know how to **save** a handoff when the current tab is ending, and how to **resume** from a handoff when a fresh tab is starting.

The full skill is at `.cursor/skills/handoff/SKILL.md`. Read it on demand. This rule is a short reminder of the trigger conditions and the two commands you need.

---

## Trigger SAVE handoff when

- User says any of: `handoff`, `/handoff`, `save handoff`, `save context`, `transfer context to next tab`, `prepare new tab`, `this tab is stuck`.
- You self-detect:
  - Same file edited 3+ times against the same lint/test failure.
  - 5+ consecutive turns with no new finding or successful edit.
  - Tool calls repeatedly hanging or timing out.
  - Long transcript + many large file reads (context pressure).
  - User said "you're going in circles" / "stop, this is wrong" twice in a row.

When self-detecting, **ask the user before writing a handoff**:

> "I do not seem to be making progress. Should I save a handoff so a fresh tab can pick this up?"

Then — only on confirmation — run:

```bash
bash .cursor/skills/handoff/scripts/new_handoff.sh <slug>
```

…and fill in every section of the resulting file using `.cursor/skills/handoff/HANDOFF_TEMPLATE.md`. Be specific: paths, line numbers, verbatim error output. Tell the user to open a new tab and paste `Resume from .cursor/handoffs/LATEST.md`.

---

## Trigger RESUME from handoff when

- User says any of: `resume`, `/resume`, `continue from previous tab`, `pick up from last tab`, `read LATEST`, or pastes a path under `.cursor/handoffs/`.
- The first message in this fresh tab references the previous tab being stuck.

On RESUME:

1. Read the named snapshot (or `.cursor/handoffs/LATEST.md`) end-to-end **before any other action**.
2. Verify the working tree still matches "What is DONE" by sampling 2–3 cited files.
3. Restore the todo list from the snapshot's "What is NEXT" section.
4. Acknowledge in 4–6 lines: mission, exact next action, any blocker found during verification, and that you are resuming (not restarting).
5. Update the previous snapshot's frontmatter `status:` from `active` to `resumed-in:<today>`.
6. Begin the next action immediately. Do not re-explore the codebase — trust the "Key code locations" section.

---

## Quality bar

A handoff is a debrief, not a story. Bullets must contain real paths and real line numbers. Compiler errors must be pasted verbatim. If a section is genuinely empty, write `None.` — do not delete the heading. The fresh tab must be able to take the next action **without re-asking the user any question that the snapshot already answers**.

---

## Auto-failover watchdog (background context every agent should know)

This repo runs a watchdog daemon (`.cursor/watchdog/`) that auto-launches a headless `cursor-agent` to continue work if the IDE tab goes silent for 4–20 minutes during active work. As an agent in this repo:

1. **A heartbeat hook fires on every one of your tool calls.** Do not be surprised by extra script execution in the Hooks panel — it is `.cursor/hooks/heartbeat.sh` writing `.cursor/handoffs/.heartbeat` and rolling `AUTO-LATEST.md`. It is cheap and never blocks you.

2. **Check for `.cursor/handoffs/.failover-active` at session start.** If it exists and is recent, a headless continuation is already running on the same repo. Your first message to the user must say so:

   > "There is an active failover continuation running (lock at `.cursor/handoffs/.failover-active`, started at `<time from file mtime>`). I will not edit files until you confirm — running both at once will conflict. Run `bash .cursor/watchdog/status.sh` to check, or `bash .cursor/watchdog/stop.sh` to halt the daemon."

3. **Headless mode (you are launched by the watchdog, not by a human).** The launching prompt names the snapshot path. Follow Mode C in `.cursor/skills/handoff/SKILL.md` strictly: hard cap of 20 edits, no irreversible actions, always end with a fresh manual handoff via `bash .cursor/skills/handoff/scripts/new_handoff.sh post-failover-<slug>`.

4. **`AUTO-LATEST.md` is machine-generated.** Never edit it. If it exists alongside a more recent `LATEST.md`, prefer `LATEST.md` for resume.
