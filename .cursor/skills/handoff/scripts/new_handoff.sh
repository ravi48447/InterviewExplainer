#!/usr/bin/env bash
# Scaffold a new handoff snapshot file in .cursor/handoffs/
#
# Usage:
#   bash .cursor/skills/handoff/scripts/new_handoff.sh <slug>
#
# <slug> is a short kebab-case identifier for the active task,
# e.g. "expansion-plan-wave-b" or "python-lock-domain-fix".
#
# The script:
#   1. Creates .cursor/handoffs/ if missing.
#   2. Writes a new file .cursor/handoffs/<ISO timestamp>-<slug>.md
#      pre-populated with the empty handoff template.
#   3. Updates .cursor/handoffs/LATEST.md to be a copy of the new file
#      (so a fresh tab can always read LATEST.md without knowing the name).
#   4. Prints the absolute path of the new snapshot so the agent
#      can immediately open and fill it in.

set -euo pipefail

if [ "$#" -lt 1 ]; then
  echo "ERROR: missing slug argument" >&2
  echo "Usage: bash .cursor/skills/handoff/scripts/new_handoff.sh <slug>" >&2
  exit 2
fi

slug="$1"

# Validate slug: kebab-case only.
if ! [[ "$slug" =~ ^[a-z0-9]+(-[a-z0-9]+)*$ ]]; then
  echo "ERROR: slug must be lowercase kebab-case (e.g. python-lock-domain-fix)" >&2
  exit 2
fi

# Resolve repo root from the script location: skills/handoff/scripts/ -> ../../..
script_dir="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
repo_root="$(cd "$script_dir/../../../.." && pwd)"
handoffs_dir="$repo_root/.cursor/handoffs"

mkdir -p "$handoffs_dir"

timestamp_file="$(date +%Y-%m-%dT%H%M)"
timestamp_iso="$(date +%Y-%m-%dT%H:%M:%S%z)"
out_file="$handoffs_dir/${timestamp_file}-${slug}.md"

if [ -e "$out_file" ]; then
  echo "ERROR: file already exists: $out_file" >&2
  exit 1
fi

cat > "$out_file" <<EOF
---
created: ${timestamp_iso}
status: active
task: <one-line task summary>
parent_plan: None
slug: ${slug}
---

# Handoff: <Task Title>

## 0. How to resume in 60 seconds

- <bullet 1>
- <bullet 2>
- <bullet 3>

## 1. Mission

<2-3 sentences>

## 2. Why this handoff is happening

- [ ] User explicitly requested a handoff
- [ ] Agent self-detected looping on the same edit/error
- [ ] Context window pressure
- [ ] Tool calls hanging
- [ ] Other: <describe>

<2-3 lines of detail>

## 3. What is DONE

- ✅ <description> — \`path/to/file:line-range\`

## 4. What is IN PROGRESS

- File: \`path/to/file\`
- Lines: \`<start>-<end>\`
- Intent: <one sentence>
- State: <half-done state>

## 5. What is NEXT

1. <step>
2. <step>
3. <step>

## 6. Blockers and open questions

- @user: <question>
- <technical blocker>

## 7. Files touched this session

### Edited
- \`path/to/file\` — <role>

### Created
- \`path/to/new-file\` — <purpose>

### Read
- \`path/to/reference\` — <why>

## 8. Key code locations to know

- \`path/to/file:lines\` — <why it matters>

## 9. Decisions made (and alternatives rejected)

- Decided: <decision>. Rejected: <alt>, because <reason>.

## 10. Conventions and project rules learned

- <rule>

## 11. Commands and scripts to know

- Build: \`<command>\`
- Test: \`<command>\`
- Lint: \`<command>\`
- Reproduce: \`<command>\`

## 12. Last error / last failing thing

\`\`\`
None.
\`\`\`

## 13. Notes for the next agent

<free-form notes>
EOF

# Refresh LATEST.md so a fresh tab can always read it without knowing the name.
cp "$out_file" "$handoffs_dir/LATEST.md"

echo "$out_file"
