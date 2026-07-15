#!/usr/bin/env bash
# Open a visible Cursor IDE chat tab with the resume prompt pre-filled and
# auto-submitted. This is the "visible" half of the FAILOVER_MODE switch.
#
# Usage:
#   bash open_visible_chat.sh <prompt-file> <repo-root>
#
# Env vars (override defaults if your Cursor version differs):
#   CURSOR_CHAT_KEYBIND          default "l"   - key for "open/focus chat panel" (with Cmd)
#   CURSOR_NEWCHAT_KEYBIND       default "n"   - key for "new chat" once chat panel is focused (with Cmd)
#   VISIBLE_CHAT_DRY_RUN         default 0     - if 1, only print the AppleScript, do not execute
#   ACTIVATE_TIMEOUT_SEC         default 10    - how long to wait for Cursor to come to front
#
# Requirements:
#   - macOS (uses osascript, pbcopy, pbpaste, open).
#   - Accessibility permission granted to whichever process runs this script
#     (Terminal, iTerm, Cursor, or whoever the watchdog daemon's parent is).
#     macOS will prompt the FIRST time keystrokes are sent; until granted,
#     the keystroke step silently no-ops.
#   - Cursor.app installed at /Applications/Cursor.app (typical brew install).
#
# Exit codes:
#   0 - submitted the prompt to a Cursor chat tab successfully (or DRY_RUN)
#   2 - Cursor failed to come to front in time
#   3 - missing prerequisites (osascript, pbcopy)
#   4 - prompt file missing or empty

set -uo pipefail

if [ "$#" -lt 2 ]; then
  echo "Usage: open_visible_chat.sh <prompt-file> <repo-root>" >&2
  exit 64
fi

prompt_file="$1"
repo_root="$2"

CURSOR_CHAT_KEYBIND="${CURSOR_CHAT_KEYBIND:-l}"
CURSOR_NEWCHAT_KEYBIND="${CURSOR_NEWCHAT_KEYBIND:-n}"
VISIBLE_CHAT_DRY_RUN="${VISIBLE_CHAT_DRY_RUN:-0}"
ACTIVATE_TIMEOUT_SEC="${ACTIVATE_TIMEOUT_SEC:-10}"

# --- Prerequisite checks --------------------------------------------------
if ! command -v osascript >/dev/null 2>&1; then
  echo "ERROR: osascript not on PATH (this script is macOS-only)" >&2
  exit 3
fi
if ! command -v pbcopy >/dev/null 2>&1; then
  echo "ERROR: pbcopy not on PATH (this script is macOS-only)" >&2
  exit 3
fi
if [ ! -s "$prompt_file" ]; then
  echo "ERROR: prompt file missing or empty: $prompt_file" >&2
  exit 4
fi

# --- Save user's clipboard so we restore it afterward ---------------------
# pbpaste fails silently if clipboard is empty; that's fine.
prior_clipboard="$(pbpaste 2>/dev/null || true)"

# --- Copy the prompt to clipboard -----------------------------------------
# We use the clipboard rather than osascript "keystroke <long-string>"
# because long string keystrokes are slow and can drop characters.
pbcopy < "$prompt_file"

# --- Build the AppleScript ------------------------------------------------
# Activates Cursor (launching it for this workspace if not running),
# waits for it to be frontmost, opens chat panel, creates a new chat,
# pastes the prompt from clipboard, and presses Return to submit.
applescript=$(cat <<APPLESCRIPT
on run
  -- Activate (or launch) Cursor for the workspace.
  do shell script "open -a 'Cursor' " & quoted form of "$repo_root"

  -- Wait up to ${ACTIVATE_TIMEOUT_SEC}s for Cursor to be the frontmost app.
  set waited to 0
  repeat while waited < $ACTIVATE_TIMEOUT_SEC
    tell application "System Events"
      set frontApp to name of first process whose frontmost is true
    end tell
    if frontApp is "Cursor" then exit repeat
    delay 1
    set waited to waited + 1
  end repeat

  if frontApp is not "Cursor" then
    return "ERROR: Cursor did not become frontmost (front=" & frontApp & ")"
  end if

  -- Small settle delay so the workspace finishes loading before we keystroke.
  delay 0.6

  tell application "System Events"
    tell process "Cursor"
      -- Open / focus the chat panel.
      keystroke "$CURSOR_CHAT_KEYBIND" using {command down}
      delay 0.5
      -- Create a new chat tab inside the chat panel.
      keystroke "$CURSOR_NEWCHAT_KEYBIND" using {command down}
      delay 0.6
      -- Paste the resume prompt.
      keystroke "v" using {command down}
      delay 0.6
      -- Submit (Return key is key code 36).
      key code 36
    end tell
  end tell

  return "OK"
end run
APPLESCRIPT
)

# --- DRY_RUN: print and exit ----------------------------------------------
if [ "$VISIBLE_CHAT_DRY_RUN" = "1" ]; then
  echo "[VISIBLE_CHAT_DRY_RUN=1] AppleScript that would be executed:"
  echo "----------------------------------------"
  echo "$applescript"
  echo "----------------------------------------"
  # Restore clipboard since we touched it for the dry run.
  printf '%s' "$prior_clipboard" | pbcopy 2>/dev/null || true
  exit 0
fi

# --- Execute --------------------------------------------------------------
result="$(printf '%s' "$applescript" | osascript 2>&1)"
osa_exit=$?

# --- Restore clipboard (best effort) --------------------------------------
# Wait briefly so the paste-keystroke had time to consume the clipboard
# before we overwrite it.
sleep 0.8
printf '%s' "$prior_clipboard" | pbcopy 2>/dev/null || true

if [ "$osa_exit" -ne 0 ]; then
  echo "ERROR: osascript exited $osa_exit: $result" >&2
  exit "$osa_exit"
fi

case "$result" in
  OK*) exit 0 ;;
  ERROR*)
    echo "$result" >&2
    exit 2
    ;;
  *)
    # Unexpected output; treat as failure but log what we got.
    echo "WARN: unexpected osascript output: $result" >&2
    exit 2
    ;;
esac
