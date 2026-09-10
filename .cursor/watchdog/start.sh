#!/usr/bin/env bash
# Start the auto-handoff watchdog as a detached background process.
#
# After running this once, the watchdog keeps running across IDE
# restarts (until the machine reboots or you run stop.sh).
#
# Usage:
#   bash .cursor/watchdog/start.sh
#
# Tunables (export before running):
#   POLL_INTERVAL_SEC   default 30
#   STALE_MIN_SEC       default 240   (4 min  - failover trigger threshold)
#   STALE_MAX_SEC       default 1200  (20 min - upper bound: above this, assume user is away)

set -euo pipefail

script_dir="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
repo_root="$(cd "$script_dir/../.." && pwd)"
handoffs_dir="$repo_root/.cursor/handoffs"
pid_file="$handoffs_dir/.watchdog.pid"
log_file="$handoffs_dir/.watchdog.log"

mkdir -p "$handoffs_dir"

# Already running?
if [ -f "$pid_file" ]; then
  existing_pid="$(cat "$pid_file")"
  if [ -n "$existing_pid" ] && kill -0 "$existing_pid" 2>/dev/null; then
    echo "Watchdog already running (pid $existing_pid). Use stop.sh first to restart."
    exit 0
  fi
  rm -f "$pid_file"
fi

# Start detached. nohup + & + setsid (if available) makes the process survive
# the parent shell exit. On macOS we have setsid via util-linux brew, fallback
# to plain nohup which is sufficient.
launcher="nohup"

# Pass through tunables to the daemon process via env. The watchdog will
# inherit FAILOVER_MODE and other failover-time vars when it spawns failover.sh.
"$launcher" \
  env POLL_INTERVAL_SEC="${POLL_INTERVAL_SEC:-30}" \
      STALE_MIN_SEC="${STALE_MIN_SEC:-240}" \
      STALE_MAX_SEC="${STALE_MAX_SEC:-1200}" \
      FAILOVER_MODE="${FAILOVER_MODE:-both}" \
      VISIBLE_FALLBACK_GRACE_SEC="${VISIBLE_FALLBACK_GRACE_SEC:-90}" \
      CURSOR_CHAT_KEYBIND="${CURSOR_CHAT_KEYBIND:-l}" \
      CURSOR_NEWCHAT_KEYBIND="${CURSOR_NEWCHAT_KEYBIND:-n}" \
      ACTIVATE_TIMEOUT_SEC="${ACTIVATE_TIMEOUT_SEC:-10}" \
  bash "$script_dir/watchdog.sh" \
  >> "$log_file" 2>&1 &

new_pid=$!
echo "$new_pid" > "$pid_file"

# Give it a moment to actually start, then verify.
sleep 1
if kill -0 "$new_pid" 2>/dev/null; then
  echo "Watchdog started (pid $new_pid)."
  echo "Log:    $log_file"
  echo "Stop:   bash .cursor/watchdog/stop.sh"
  echo "Status: bash .cursor/watchdog/status.sh"
else
  rm -f "$pid_file"
  echo "Watchdog failed to start. See log: $log_file" >&2
  exit 1
fi
