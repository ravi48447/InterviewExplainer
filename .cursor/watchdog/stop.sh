#!/usr/bin/env bash
# Stop the auto-handoff watchdog daemon.
#
# Usage:
#   bash .cursor/watchdog/stop.sh

set -uo pipefail

script_dir="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
repo_root="$(cd "$script_dir/../.." && pwd)"
handoffs_dir="$repo_root/.cursor/handoffs"
pid_file="$handoffs_dir/.watchdog.pid"

if [ ! -f "$pid_file" ]; then
  echo "Watchdog is not running (no pid file)."
  exit 0
fi

pid="$(cat "$pid_file" 2>/dev/null || echo "")"

if [ -z "$pid" ]; then
  echo "Watchdog pid file is empty. Removing."
  rm -f "$pid_file"
  exit 0
fi

if ! kill -0 "$pid" 2>/dev/null; then
  echo "Watchdog process (pid $pid) is not alive. Removing pid file."
  rm -f "$pid_file"
  exit 0
fi

echo "Stopping watchdog (pid $pid)..."
kill -TERM "$pid" 2>/dev/null || true

# Wait up to 5 seconds for graceful shutdown.
for _ in 1 2 3 4 5; do
  if ! kill -0 "$pid" 2>/dev/null; then
    rm -f "$pid_file"
    echo "Watchdog stopped."
    exit 0
  fi
  sleep 1
done

# Hard kill if it did not exit gracefully.
kill -KILL "$pid" 2>/dev/null || true
rm -f "$pid_file"
echo "Watchdog force-killed."
