#!/usr/bin/env bash
# Finalize-handoff hook for the auto-handoff watchdog.
#
# Registered in .cursor/hooks.json against the `stop` event (and sessionEnd
# when supported). Runs when the agent finishes a turn cleanly.
#
# Responsibilities:
#   1. Reuse heartbeat.sh to refresh AUTO-LATEST.md one last time so the
#      newest snapshot reflects the final state of the turn.
#   2. Clear .cursor/handoffs/.failover-active if it exists, so the next
#      session does not inherit a stale failover lock.
#   3. Touch the heartbeat with a special "stopped" marker timestamp so the
#      watchdog knows this was a clean stop, not a hang.
#
# Always exits 0 to never block a clean stop.

set -uo pipefail

script_dir="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
repo_root="$(cd "$script_dir/../.." && pwd)"
handoffs_dir="$repo_root/.cursor/handoffs"

mkdir -p "$handoffs_dir"

# 1. Run the heartbeat hook to do a final snapshot refresh.
input="$(cat 2>/dev/null || true)"
printf '%s' "$input" | bash "$script_dir/heartbeat.sh" >/dev/null 2>&1 || true

# 2. Clear failover lock so next session starts clean.
if [ -f "$handoffs_dir/.failover-active" ]; then
  rm -f "$handoffs_dir/.failover-active"
fi

# 3. Mark a clean-stop heartbeat. The watchdog reads this special suffix
#    and knows: do not failover, the tab stopped on purpose.
ts="$(date +%Y-%m-%dT%H:%M:%S%z)"
printf '%s clean-stop\n' "$ts" > "$handoffs_dir/.heartbeat" || true

exit 0
