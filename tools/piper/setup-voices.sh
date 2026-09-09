#!/usr/bin/env bash
# tools/piper/setup-voices.sh — download the neural voice models (one-time, ~190MB).
# The models are MIT-licensed Piper voices from HuggingFace; they exceed GitHub's
# blob API limit so they're fetched at install time instead of committed.
set -euo pipefail
cd "$(dirname "$0")"
mkdir -p voices
VOICES="https://huggingface.co/rhasspy/piper-voices/resolve/v1.0.0/en/en_US"
fetch () { # name
  local f="voices/en_US-$1-medium.onnx"
  [ -s "$f" ] && { echo "$1: present"; return; }
  echo "$1: downloading..."
  curl -sL -o "$f" "$VOICES/$1/medium/en_US-$1-medium.onnx"
  curl -sL -o "$f.json" "$VOICES/$1/medium/en_US-$1-medium.onnx.json"
}
fetch amy    # female — mentor, rapid, detail personas
fetch ryan   # male   — skeptic, architect personas
fetch lessac # female — silent, panelist personas
echo "voices ready: $(ls voices/*.onnx | wc -l) models"
