#!/usr/bin/env bash
# Publica uma release, verifica-a e restaura a anterior se o smoke falhar.
set -euo pipefail

AQUI="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
AMB="${1:-prod}"

if bash "$AQUI/deploy.sh" "$AMB"; then
  :
else
  status=$?
  echo "::error::deploy falhou em $AMB; a release anterior ficou intacta"
  exit "$status"
fi

if bash "$AQUI/smoke.sh" "$AMB"; then
  exit 0
else
  status=$?
fi

echo "::error::smoke falhou em $AMB; a reverter para a release anterior"
if ! bash "$AQUI/rollback.sh" "$AMB"; then
  echo "::error::rollback também falhou"
fi
exit "$status"
