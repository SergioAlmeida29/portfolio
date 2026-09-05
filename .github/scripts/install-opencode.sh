#!/usr/bin/env bash
set -euo pipefail

log="$(mktemp)"
trap 'rm -f "$log"' EXIT

for tentativa in 1 2 3; do
  if { curl -fsSL --connect-timeout 10 --max-time 120 https://opencode.ai/install | bash; } >"$log" 2>&1; then
    exit 0
  fi
  sleep 5
done

echo "::error::Nao foi possivel instalar o OpenCode."
exit 1
