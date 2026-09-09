#!/usr/bin/env bash
# Sai 0 se o alvo em $ALVO já tem uma etiqueta de prioridade.
# Um modelo pode responder «pronto» sem ter aplicado nada: isto confirma.
set -euo pipefail

n="$(gh api "repos/$GITHUB_REPOSITORY/issues/$ALVO/labels" \
  --jq '[.[].name | select(startswith("prioridade:"))] | length')"

[ "${n:-0}" -ge 1 ]
