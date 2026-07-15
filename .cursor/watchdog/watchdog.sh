#!/usr/bin/env bash
# Auto-handoff watchdog daemon.
#
# Polls .cursor/handoffs/.heartbeat every POLL_INTERVAL_SEC seconds. If the
# heartbeat is stale within the [STALE_MIN_SEC, STALE_MAX_SEC] window AND
# the last heartbeat was NOT a clean-stop AND no failover is currently in
# flight, it triggers .cursor/watchdog/failover.sh.
#
# Why a window and not just "older than 4 min":
#   - heartbeat <  4 min: tab is healthy, no action.
#   - heartbeat >  4 min and < 20 min: tab was active and went silent during
#     work. This is the "reconnect hang" case the user wants caught.
#   - heartbeat > 20 min: user is just away from Cursor. Don't auto-launch
#     anything; if it had been a real hang we would have failed over earlier.
#
# Run via:    bash .cursor/watchdog/start.sh
# Stop via:   bash .cursor/watchdog/stop.sh
# Status via: bash .cursor/watchdog/status.sh

set -uo pipefail

# --- Config (overridable via env) ---------------------------------------------
POLL_INTERVAL_SEC="${POLL_INTERVAL_SEC:-30}"
STALE_MIN_SEC="${STALE_MIN_SEC:-240}"        # 4 minutes
STALE_MAX_SEC="${STALE_MAX_SEC:-1200}"       # 20 minutes
FAILOVER_LOCK_TTL_SEC="${FAILOVER_LOCK_TTL_SEC:-1800}" # 30 min

# --- Resolve paths ------------------------------------------------------------
script_dir="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
repo_root="$(cd "$script_dir/../.." && pwd)"
handoffs_dir="$repo_root/.cursor/handoffs"
heartbeat_file="$handoffs_dir/.heartbeat"
failover_lock="$handoffs_dir/.failover-active"
watchdog_log="$handoffs_dir/.watchdog.log"
failover_script="$script_dir/failover.sh"

mkdir -p "$handoffs_dir"

log() {
  printf '[%s] [watchdog] %s\n' "$(date +%Y-%m-%dT%H:%M:%S%z)" "$*" >> "$watchdog_log"
}

now_epoch() { date +%s; }

file_mtime_epoch() {
  # macOS stat uses -f, GNU stat uses -c. Try both.
  stat -f %m "$1" 2>/dev/null || stat -c %Y "$1" 2>/dev/null || echo 0
}

log "started (interval=${POLL_INTERVAL_SEC}s, stale-window=[${STALE_MIN_SEC}s, ${STALE_MAX_SEC}s])"

# Trap to log shutdown.
trap 'log "stopped (signal received)"; exit 0' INT TERM

while true; do
  if [ ! -f "$heartbeat_file" ]; then
    # No heartbeat at all -> Cursor has not run a hook yet in this repo.
    sleep "$POLL_INTERVAL_SEC"
    continue
  fi

  # Read the heartbeat content. Format:
  #   "<iso-timestamp>"             -> normal heartbeat
  #   "<iso-timestamp> clean-stop"  -> finalize_handoff.sh wrote this
  hb_content="$(head -n 1 "$heartbeat_file" 2>/dev/null || echo "")"
  is_clean_stop=0
  case "$hb_content" in
    *clean-stop*) is_clean_stop=1 ;;
  esac

  hb_mtime="$(file_mtime_epoch "$heartbeat_file")"
  now="$(now_epoch)"
  age=$(( now - hb_mtime ))

  if [ "$is_clean_stop" -eq 1 ]; then
    # The tab stopped on purpose. Do nothing.
    sleep "$POLL_INTERVAL_SEC"
    continue
  fi

  # Failover lock check: if a failover is in flight, do not start another.
  if [ -f "$failover_lock" ]; then
    lock_mtime="$(file_mtime_epoch "$failover_lock")"
    lock_age=$(( now - lock_mtime ))
    if [ "$lock_age" -lt "$FAILOVER_LOCK_TTL_SEC" ]; then
      sleep "$POLL_INTERVAL_SEC"
      continue
    fi
    log "stale failover lock (${lock_age}s old) — clearing"
    rm -f "$failover_lock"
  fi

  # The trigger condition.
  if [ "$age" -ge "$STALE_MIN_SEC" ] && [ "$age" -le "$STALE_MAX_SEC" ]; then
    log "heartbeat stale ${age}s (window ${STALE_MIN_SEC}-${STALE_MAX_SEC}) — invoking failover"
    # Mark lock BEFORE invoking failover, so duplicate detection cannot race.
    date +%Y-%m-%dT%H:%M:%S%z > "$failover_lock"
    # Run failover. We do not background-and-forget; we want the watchdog to
    # know when it finishes (so it can clear the lock).
    if bash "$failover_script" >> "$watchdog_log" 2>&1; then
      log "failover completed"
    else
      log "failover exited non-zero"
    fi
    rm -f "$failover_lock"
    # After a failover, give the system extra breathing room before re-evaluating.
    sleep "$(( POLL_INTERVAL_SEC * 4 ))"
    continue
  fi

  sleep "$POLL_INTERVAL_SEC"
done
