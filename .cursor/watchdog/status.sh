#!/usr/bin/env bash
# Show watchdog status: pid alive?, last heartbeat age, last failover, recent log.
#
# Usage:
#   bash .cursor/watchdog/status.sh

set -uo pipefail

script_dir="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
repo_root="$(cd "$script_dir/../.." && pwd)"
handoffs_dir="$repo_root/.cursor/handoffs"
pid_file="$handoffs_dir/.watchdog.pid"
heartbeat_file="$handoffs_dir/.heartbeat"
log_file="$handoffs_dir/.watchdog.log"
failover_lock="$handoffs_dir/.failover-active"

file_mtime_epoch() {
  stat -f %m "$1" 2>/dev/null || stat -c %Y "$1" 2>/dev/null || echo 0
}

now=$(date +%s)

printf '=== Cursor auto-handoff watchdog status ===\n'
printf 'Repo:           %s\n' "$repo_root"

# Daemon state.
if [ -f "$pid_file" ]; then
  pid="$(cat "$pid_file" 2>/dev/null || echo "")"
  if [ -n "$pid" ] && kill -0 "$pid" 2>/dev/null; then
    printf 'Daemon:         RUNNING (pid %s)\n' "$pid"
  else
    printf 'Daemon:         NOT RUNNING (stale pid file %s)\n' "$pid"
  fi
else
  printf 'Daemon:         NOT RUNNING (no pid file)\n'
fi

# Heartbeat state.
if [ -f "$heartbeat_file" ]; then
  hb_content="$(head -n 1 "$heartbeat_file" 2>/dev/null || echo "")"
  hb_mtime="$(file_mtime_epoch "$heartbeat_file")"
  age=$(( now - hb_mtime ))
  printf 'Heartbeat:      %s (%ss ago)\n' "$hb_content" "$age"
  case "$age" in
    *) ;;
  esac
  if [ "$age" -lt 240 ]; then
    printf 'Tab health:     healthy (heartbeat fresh)\n'
  elif [ "$age" -le 1200 ]; then
    printf 'Tab health:     STALE (in failover window 4-20 min)\n'
  else
    printf 'Tab health:     idle (>20 min, watchdog will not failover)\n'
  fi
else
  printf 'Heartbeat:      none yet (no agent activity in this repo)\n'
fi

# Failover lock.
if [ -f "$failover_lock" ]; then
  printf 'Failover:       IN PROGRESS (lock present)\n'
else
  printf 'Failover:       idle (no lock)\n'
fi

# Recent failover logs.
recent_failovers="$(ls -1t "$handoffs_dir"/.failover-*.log 2>/dev/null | head -3 || true)"
if [ -n "$recent_failovers" ]; then
  printf '\nRecent failover runs:\n'
  printf '%s\n' "$recent_failovers" | sed 's/^/  - /'
fi

# Tail of watchdog log.
if [ -f "$log_file" ]; then
  printf '\nLast 10 watchdog log lines:\n'
  tail -n 10 "$log_file" | sed 's/^/  /'
fi
