#!/usr/bin/env bash
# Failover action: when the watchdog declares the IDE tab stuck, this script
# fires up a continuation. It supports three modes (FAILOVER_MODE env var):
#
#   visible  - opens a real Cursor IDE chat tab via AppleScript with the
#              resume prompt pre-filled and submitted. User sees the chat
#              when they come back. Requires Accessibility permission for
#              the parent process (Terminal/iTerm/launchd/etc).
#
#   headless - runs `cursor-agent -p` in the background. No visible chat
#              tab; output goes to .cursor/handoffs/.failover-<ts>.log.
#              Original behavior, no UI automation.
#
#   both     - DEFAULT. Tries `visible` first. If no fresh agent activity is
#              detected within 90s (heartbeat unchanged from before failover
#              fired), falls back to `headless`. Best chance of work
#              continuing whether or not Accessibility is granted.
#
# Steps regardless of mode:
#   1. Pick the freshest available snapshot (LATEST.md beats AUTO-LATEST.md
#      when newer).
#   2. Mark the snapshot as failover-launched in its frontmatter.
#   3. Send a macOS notification.
#   4. Run the chosen mode.
#   5. Send a second notification on completion.
#   6. Append a structured record to .cursor/handoffs/.watchdog.log.
#
# Manual invocations:
#   bash .cursor/watchdog/failover.sh                         # use FAILOVER_MODE
#   FAILOVER_MODE=visible  bash .cursor/watchdog/failover.sh
#   FAILOVER_MODE=headless bash .cursor/watchdog/failover.sh
#   DRY_RUN=1              bash .cursor/watchdog/failover.sh  # plan only

set -uo pipefail

DRY_RUN="${DRY_RUN:-0}"
FAILOVER_MODE="${FAILOVER_MODE:-both}"
VISIBLE_FALLBACK_GRACE_SEC="${VISIBLE_FALLBACK_GRACE_SEC:-90}"

script_dir="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
repo_root="$(cd "$script_dir/../.." && pwd)"
handoffs_dir="$repo_root/.cursor/handoffs"
log_file="$handoffs_dir/.watchdog.log"

ts="$(date +%Y-%m-%dT%H%M%S)"
run_log="$handoffs_dir/.failover-${ts}.log"

log() {
  printf '[%s] [failover] %s\n' "$(date +%Y-%m-%dT%H:%M:%S%z)" "$*" >> "$log_file"
}

notify() {
  local title="$1"
  local body="$2"
  if command -v osascript >/dev/null 2>&1; then
    osascript -e "display notification \"$body\" with title \"$title\"" >/dev/null 2>&1 || true
  fi
}

file_mtime_epoch() {
  stat -f %m "$1" 2>/dev/null || stat -c %Y "$1" 2>/dev/null || echo 0
}

# --- 1. Pick the freshest snapshot ----------------------------------------
manual="$handoffs_dir/LATEST.md"
auto="$handoffs_dir/AUTO-LATEST.md"

snapshot=""
if [ -f "$manual" ] && [ -f "$auto" ]; then
  m_mtime="$(file_mtime_epoch "$manual")"
  a_mtime="$(file_mtime_epoch "$auto")"
  if [ "$m_mtime" -ge "$a_mtime" ]; then
    snapshot="$manual"
  else
    snapshot="$auto"
  fi
elif [ -f "$manual" ]; then
  snapshot="$manual"
elif [ -f "$auto" ]; then
  snapshot="$auto"
fi

if [ -z "$snapshot" ]; then
  log "no snapshot available (neither LATEST.md nor AUTO-LATEST.md exists) - aborting failover"
  notify "Cursor handoff" "Failover skipped: no snapshot to resume from."
  exit 1
fi

snapshot_rel="${snapshot#$repo_root/}"
log "mode=$FAILOVER_MODE selected snapshot: $snapshot_rel"

# --- 2. Mark snapshot frontmatter (manual snapshots only) -----------------
if [ "$snapshot" = "$manual" ] && command -v python3 >/dev/null 2>&1; then
  python3 - "$snapshot" "$ts" <<'PY' 2>>"$log_file" || true
import re, sys, pathlib
path, ts = sys.argv[1], sys.argv[2]
p = pathlib.Path(path)
text = p.read_text(encoding="utf-8")
new = re.sub(r"^status:\s*.*$", f"status: failover-launched-{ts}", text, count=1, flags=re.MULTILINE)
if new != text:
    p.write_text(new, encoding="utf-8")
PY
fi

# --- 3. Build the resume prompt -------------------------------------------
prompt_file="$handoffs_dir/.failover-${ts}.prompt.txt"
cat > "$prompt_file" <<EOF
You are the continuation agent. The previous Cursor IDE tab in this repo
went silent for more than four minutes during active work and has been
declared stuck by the auto-handoff watchdog.

Your job: read the snapshot at \`${snapshot_rel}\` and continue the work
from where it stopped, using the Skill at \`.cursor/skills/handoff/SKILL.md\`
(Mode B: RESUME if you are running interactively, Mode C: AUTO-CONTINUE
if you are running headlessly).

Hard constraints:
1. Read the snapshot end to end before doing anything else.
2. Verify the working tree by running \`git status\` and \`git diff --stat\`
   and sampling the files claimed under "What is DONE" in the snapshot.
3. Do not re-explore the codebase. Trust the "Key code locations" section.
4. Make changes one logical step at a time. After each step, run the
   project's build/lint/test commands listed in the snapshot's
   "Commands and scripts to know" section. If a step fails, stop and
   write the failure into a new manual handoff at .cursor/handoffs/
   instead of trying to brute-force through it.
5. When you have either finished the work or hit a blocker, run
   \`bash .cursor/skills/handoff/scripts/new_handoff.sh post-failover-${ts}\`
   and write a clean snapshot describing the final state. This makes the
   human's next session resumable.

Snapshot path: ${snapshot_rel}
Repo root:     ${repo_root}
Failover ts:   ${ts}
EOF

log "prompt written to ${prompt_file#$repo_root/}"

# --- 4. Notify ------------------------------------------------------------
notify "Cursor handoff" "Tab silent >4 min. Failover mode=$FAILOVER_MODE from $(basename "$snapshot")."

# --- 5. DRY RUN exit ------------------------------------------------------
if [ "$DRY_RUN" = "1" ]; then
  log "DRY_RUN=1 - skipping execution"
  printf '[DRY RUN] mode=%s snapshot=%s prompt=%s\n' "$FAILOVER_MODE" "$snapshot_rel" "${prompt_file#$repo_root/}" >> "$log_file"
  exit 0
fi

# --- 6. Helper to detect "visible mode succeeded" -------------------------
# We capture the heartbeat mtime BEFORE running visible mode; if the
# heartbeat has advanced afterwards (within the grace window), the visible
# IDE chat tab is generating activity and we can skip the headless fallback.
heartbeat_file="$handoffs_dir/.heartbeat"
hb_before=0
if [ -f "$heartbeat_file" ]; then
  hb_before="$(file_mtime_epoch "$heartbeat_file")"
fi

visible_succeeded=0
visible_attempted=0

run_visible() {
  visible_attempted=1
  log "running visible-mode (open_visible_chat.sh)"
  if bash "$script_dir/open_visible_chat.sh" "$prompt_file" "$repo_root" >> "$run_log" 2>&1; then
    log "visible-mode AppleScript completed (script exit 0); waiting up to ${VISIBLE_FALLBACK_GRACE_SEC}s for heartbeat to advance"
    # Poll heartbeat for up to VISIBLE_FALLBACK_GRACE_SEC seconds.
    local waited=0
    local interval=5
    while [ "$waited" -lt "$VISIBLE_FALLBACK_GRACE_SEC" ]; do
      if [ -f "$heartbeat_file" ]; then
        hb_now="$(file_mtime_epoch "$heartbeat_file")"
        if [ "$hb_now" -gt "$hb_before" ]; then
          visible_succeeded=1
          log "visible-mode SUCCESS: heartbeat advanced from $hb_before to $hb_now after ${waited}s"
          break
        fi
      fi
      sleep "$interval"
      waited=$(( waited + interval ))
    done
    if [ "$visible_succeeded" -eq 0 ]; then
      log "visible-mode TIMEOUT: heartbeat did not advance within ${VISIBLE_FALLBACK_GRACE_SEC}s"
    fi
    return 0
  else
    log "visible-mode AppleScript FAILED (see ${run_log#$repo_root/})"
    return 1
  fi
}

run_headless() {
  if ! command -v cursor-agent >/dev/null 2>&1; then
    log "cursor-agent not on PATH - cannot run headless continuation"
    notify "Cursor handoff" "FAILED: cursor-agent CLI not found on PATH."
    return 2
  fi

  local prompt_text
  prompt_text="$(cat "$prompt_file")"
  log "running headless cursor-agent (logging to ${run_log#$repo_root/})"

  set +e
  cursor-agent \
    -p \
    --output-format text \
    --workspace "$repo_root" \
    --trust \
    --force \
    "$prompt_text" \
    >> "$run_log" 2>&1
  local agent_exit=$?
  set -e

  if [ "$agent_exit" -eq 0 ]; then
    log "cursor-agent exited 0"
    notify "Cursor handoff" "Headless continuation finished. Log: $(basename "$run_log")"
  else
    log "cursor-agent exited ${agent_exit}"
    notify "Cursor handoff" "Headless continuation FAILED (exit ${agent_exit}). Log: $(basename "$run_log")"
  fi
  return "$agent_exit"
}

# --- 7. Dispatch on FAILOVER_MODE -----------------------------------------
case "$FAILOVER_MODE" in
  visible)
    if run_visible; then
      if [ "$visible_succeeded" -eq 1 ]; then
        notify "Cursor handoff" "Visible chat tab is running. Check Cursor."
        exit 0
      else
        notify "Cursor handoff" "Visible mode opened a chat tab but no activity detected within ${VISIBLE_FALLBACK_GRACE_SEC}s. Check Cursor manually."
        exit 0
      fi
    else
      notify "Cursor handoff" "Visible mode FAILED. Grant Accessibility permission and retry."
      exit 2
    fi
    ;;

  headless)
    run_headless
    exit $?
    ;;

  both)
    run_visible || true
    if [ "$visible_succeeded" -eq 1 ]; then
      notify "Cursor handoff" "Visible chat tab took over. Skipping headless fallback."
      exit 0
    fi
    log "falling back to headless mode (visible attempted=$visible_attempted, succeeded=$visible_succeeded)"
    notify "Cursor handoff" "Visible chat did not start work. Falling back to headless cursor-agent."
    run_headless
    exit $?
    ;;

  *)
    log "unknown FAILOVER_MODE='$FAILOVER_MODE' - defaulting to headless"
    run_headless
    exit $?
    ;;
esac
