#!/usr/bin/env bash
set -euo pipefail

modelo="${1:?E preciso indicar o modelo}"
eventos="$(mktemp)"
erros="$(mktemp)"
trap 'rm -f "$eventos" "$erros"' EXIT

# O comando github publica cada erro como comentário; run permite controlar a publicação.
env_opencode=(env)
if [ "${OPENCODE_ALLOW_GITHUB_TOKEN:-false}" != "true" ]; then
  env_opencode+=( -u GITHUB_TOKEN -u GH_TOKEN )
fi

timeout --kill-after=10s 120s \
  "${env_opencode[@]}" opencode run --format json --model "$modelo" "${PROMPT:?E preciso indicar o prompt}" \
  >"$eventos" 2>"$erros"

resposta="$(jq -s -r '[.[] | select(.type == "text") | .part.text // empty] | last // empty' "$eventos" 2>/dev/null)" || exit 1
[ -n "$resposta" ] || exit 1
printf '%s\n' "$resposta"
