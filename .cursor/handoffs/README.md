# `.cursor/handoffs/` — Tab-to-Tab Context Snapshots

This folder is the storage for the **handoff** skill (`.cursor/skills/handoff/SKILL.md`).

When one Cursor chat tab is about to end (stuck, looping, context-window pressure, or you want to start fresh), the agent writes a structured snapshot here so the **next tab can resume without re-discovering the work**.

## Files

| File                                  | Role                                                                                              |
| ------------------------------------- | ------------------------------------------------------------------------------------------------- |
| `LATEST.md`                           | Auto-refreshed copy of the newest snapshot. A fresh tab should read this first.                  |
| `<ISO-timestamp>-<slug>.md`           | One snapshot per handoff. Filename example: `2026-05-28T1641-expansion-plan-wave-b.md`.          |

## How to use

### Saving a handoff (current tab)

In the current tab, say:

> handoff

The agent will run `bash .cursor/skills/handoff/scripts/new_handoff.sh <slug>` and fill in the snapshot. When it finishes, it will tell you to open a new tab.

### Resuming in a fresh tab

Open a new tab and paste:

> Resume from `.cursor/handoffs/LATEST.md`

The agent will read the snapshot, verify the working tree still matches, restore the todo list, and continue from where the previous tab stopped — no re-exploration, no re-summarizing.

## Frontmatter contract

Every snapshot starts with YAML frontmatter:

```yaml
---
created: 2026-05-28T16:41:00+05:30
status: active            # active | resumed-in:<date-or-tab-id> | abandoned
task: <one-line task summary>
parent_plan: <relative path to .cursor/plans/*.plan.md if any, else None>
slug: <kebab-case slug>
---
```

When a fresh tab picks up a handoff, it must update the previous snapshot's `status:` from `active` to `resumed-in:<date>` so the chain is auditable.

## Manual editing

These files are plain markdown and are intentionally human-editable. Tweaking the snapshot before opening the new tab (adding context, correcting a wrong claim) is encouraged.

## Cleanup

Old snapshots can be deleted any time. Keep the last few for audit trail. `LATEST.md` should always exist (it is overwritten by the scaffold script on every save).
