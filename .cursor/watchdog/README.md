# Auto-Handoff Watchdog

This is the **automatic** half of the handoff system. While the manual `handoff` skill (in `.cursor/skills/handoff/`) requires a human to ask for a snapshot, the watchdog detects when an IDE chat tab has gone silent during active work and **automatically launches a headless `cursor-agent` to continue the work** from the latest snapshot.

## What it actually does

1. **Hooks** in `.cursor/hooks.json` fire on every agent action (`postToolUse`, `afterFileEdit`, `afterAgentResponse`, `sessionStart`, `stop`). They run `.cursor/hooks/heartbeat.sh`, which:
   - Touches `.cursor/handoffs/.heartbeat` with the current timestamp.
   - Appends a one-line JSON record to `.cursor/handoffs/.activity.jsonl`.
   - Regenerates `.cursor/handoffs/AUTO-LATEST.md` so a continuation agent always has a fresh, factual snapshot — even if the human never typed `handoff`.

2. The **watchdog daemon** (`.cursor/watchdog/watchdog.sh`) polls `.heartbeat` every 30 seconds. If the heartbeat is between **4 and 20 minutes stale** AND the last write was not a `clean-stop` AND no failover is currently in flight, it triggers `failover.sh`.

3. `failover.sh`:
   - Picks the freshest of `LATEST.md` (manual handoff) or `AUTO-LATEST.md` (auto-rolled).
   - Sends a macOS notification.
   - Runs the **failover mode** you chose (default `both`, see next section).
   - Tees output to `.cursor/handoffs/.failover-<timestamp>.log`.
   - Sends a second notification on completion.

## Failover modes

Set `FAILOVER_MODE` (env var consumed by `start.sh`) to control how the failover acts:

| Mode | What it does | When to pick it |
|---|---|---|
| `both` (**default**) | First runs `open_visible_chat.sh` — AppleScript activates Cursor for this workspace, opens a new chat tab, pastes the resume prompt, and submits. Waits up to 90s for the heartbeat to advance. If the visible chat does not start producing activity within that window, falls back to headless `cursor-agent`. | You want the work to continue **and** to have a visible chat tab waiting when you return. Best chance of success either way. |
| `visible` | Only the AppleScript path. No headless fallback. | You don't want unsupervised headless edits ever. If Accessibility is not granted or AppleScript fails, no continuation happens. |
| `headless` | Only `cursor-agent -p` runs. No UI automation, no focus changes. (This was the v1 behavior before the visible mode existed.) | You're frequently AFK with another app focused and don't want Cursor to steal the desktop. |

Override before starting the watchdog:

```bash
FAILOVER_MODE=visible bash .cursor/watchdog/start.sh
FAILOVER_MODE=headless bash .cursor/watchdog/start.sh
FAILOVER_MODE=both VISIBLE_FALLBACK_GRACE_SEC=120 bash .cursor/watchdog/start.sh
```

### Accessibility permission (one-time, required for `visible` and `both`)

`open_visible_chat.sh` uses AppleScript `keystroke` events. macOS gates that behind **Accessibility** permission for the process that sends them. The first time the failover fires, macOS will pop a dialog: *"Terminal would like to control Cursor. Open System Settings to enable."*

To pre-grant:

1. Open **System Settings → Privacy & Security → Accessibility**.
2. Click the `+` button.
3. Add the parent process the watchdog runs from (typically `Terminal.app` or `iTerm.app` if you start the watchdog manually; if you install the launchd plist, add `bash` from `/bin/bash`).
4. Toggle it on.

If the permission is missing, `visible` mode silently no-ops on the keystroke step and the chat tab opens but stays empty. In `both` mode this triggers the headless fallback after 90s, so work still continues.

### Customizing keybindings

The defaults assume Cursor 3.x:

- `Cmd+L` opens / focuses the chat panel
- `Cmd+N` (with chat focused) creates a new chat tab

Override if your version or keymap differs:

```bash
CURSOR_CHAT_KEYBIND=l CURSOR_NEWCHAT_KEYBIND=n bash .cursor/watchdog/start.sh
```

### Testing the visible path safely

Before relying on it, do a dry-run that prints the AppleScript without executing:

```bash
# Build a test prompt file.
echo "TEST: hello from open_visible_chat dry run" > /tmp/test-prompt.txt

# Print AppleScript only.
VISIBLE_CHAT_DRY_RUN=1 bash .cursor/watchdog/open_visible_chat.sh \
  /tmp/test-prompt.txt "$(pwd)"
```

When you're ready for a real test (this WILL focus Cursor and submit a chat):

```bash
echo "Say hello and stop." > /tmp/test-prompt.txt
bash .cursor/watchdog/open_visible_chat.sh /tmp/test-prompt.txt "$(pwd)"
```

## Why a 4–20 minute window, not just ">4 min"

| Heartbeat age | Watchdog action | Reason |
|---|---|---|
| < 4 min | Nothing | Tab is healthy. |
| 4–20 min | **Failover** | Tab was active and went silent during work. This is the "reconnecting hang" case. |
| > 20 min | Nothing | You walked away. If it had been a real hang, we would have failed over earlier. |
| Last write tagged `clean-stop` | Nothing | Hook on `stop` event marked this as a clean finish. |

## Install (one-time)

```bash
# 1. Make the scripts executable.
chmod +x .cursor/hooks/*.sh .cursor/watchdog/*.sh

# 2. Start the watchdog daemon (detached, persists across IDE restarts).
bash .cursor/watchdog/start.sh
```

The hooks load automatically because Cursor reads `.cursor/hooks.json` on save. If they don't appear in the IDE Hooks panel, restart Cursor once.

## Daily use

```bash
bash .cursor/watchdog/status.sh   # is the daemon alive? heartbeat fresh? failover running?
bash .cursor/watchdog/stop.sh     # turn off auto-failover (e.g. before pulling main)
bash .cursor/watchdog/start.sh    # turn it back on
```

There is nothing to type during a normal IDE session — the hooks and the watchdog do everything in the background.

## Tunables

Override before starting the watchdog:

```bash
POLL_INTERVAL_SEC=15 \
STALE_MIN_SEC=180  \
STALE_MAX_SEC=900  \
bash .cursor/watchdog/start.sh
```

| Env var | Default | What it controls |
|---|---|---|
| `POLL_INTERVAL_SEC` | `30` | How often the watchdog checks the heartbeat. |
| `STALE_MIN_SEC` | `240` (4 min) | Minimum staleness before a failover fires. **This is the "4 minutes" the user asked for.** |
| `STALE_MAX_SEC` | `1200` (20 min) | Above this, assume idle (not stuck). No failover. |

## What gets created during a real failover

Inside `.cursor/handoffs/`:

| File | Created by | Purpose |
|---|---|---|
| `.heartbeat` | every hook | Timestamp the watchdog reads. |
| `.activity.jsonl` | every hook | Rolling tool-call log (last 200 events). |
| `AUTO-LATEST.md` | every hook | Auto-rolled snapshot built from the activity log. |
| `LATEST.md` | manual `handoff` command | Human-curated snapshot (preferred over AUTO when newer). |
| `.failover-active` | watchdog | Lock file; prevents duplicate failovers. |
| `.failover-<ts>.log` | failover | The headless cursor-agent's full output for that run. |
| `.failover-<ts>.prompt.txt` | failover | The exact prompt sent to the headless agent (for audit). |
| `.watchdog.log` | watchdog + failover | Append-only audit log of all watchdog activity. |
| `.watchdog.pid` | start.sh | Daemon PID for stop.sh. |

## Concurrency caveat — read this once

If you come back to your machine and the IDE tab has reconnected and is working again, **and** the headless failover agent is also still running, both will be editing the same files. To avoid this:

- The watchdog logs every failover invocation. Run `bash .cursor/watchdog/status.sh` whenever you sit back down.
- If a failover is in progress (`Failover: IN PROGRESS`), either wait for it to finish or run `bash .cursor/watchdog/stop.sh` and kill the headless agent process listed in `.cursor/handoffs/.failover-<ts>.log`.
- Better: when the IDE tab recovers, the agent's first hook run will detect the failover lock and (per the rule in `.cursor/rules/handoff-protocol.md`) the agent will warn you before it makes any further edits.

## What the watchdog will NOT do

- It cannot open a new IDE chat tab via any documented Cursor API. The `visible` mode uses macOS AppleScript keystrokes instead — that's why it requires Accessibility permission and is sensitive to your keymap.
- It will not detect "Cursor app crashed" — only "agent activity stopped". If Cursor itself died, the `visible` mode's `open -a Cursor "$repo"` will relaunch it; if you have `headless` mode, no relaunch happens, only the background `cursor-agent` runs.
- It will not run if `cursor-agent` is not on your `$PATH` (for `headless` and `both` fallback). Verify with `which cursor-agent`.
- It will not survive a machine reboot. To make it persist across reboots, install the optional `launchd` plist (not included by default; ask the agent and it will write one).
- It will not run while the laptop is asleep or the screen is locked with no logged-in session. macOS suspends background processes in those states.

## Disable temporarily

Just stop the daemon: `bash .cursor/watchdog/stop.sh`. The hooks keep writing the heartbeat (cheap, harmless), but no failover fires.

## Disable permanently

```bash
bash .cursor/watchdog/stop.sh
rm .cursor/hooks.json   # optional: also stops heartbeat hook
```
