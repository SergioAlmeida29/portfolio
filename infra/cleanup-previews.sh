#!/usr/bin/env bash
set -euo pipefail

. "$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)/lib.sh"

ROOT="$(base_de staging)/pr"
[ -d "$ROOT" ] || exit 0

for dir in "$ROOT"/*/; do
  [ -d "$dir" ] || continue
  [ ! -L "${dir%/}" ] || continue
  PR="$(basename "$dir")"
  [[ "$PR" =~ ^[0-9]+$ ]] || continue
  [ -n "$(find "$dir" -maxdepth 0 -mmin +30 -print -quit)" ] || continue

  STATE="$(gh api "repos/$GITHUB_REPOSITORY/pulls/$PR" --jq '.state')"
  if [ "$STATE" = closed ]; then
    rm -rf -- "${dir%/}"
    echo "-> preview /pr/$PR/ apagada"
  fi
done
