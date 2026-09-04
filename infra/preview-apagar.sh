#!/usr/bin/env bash
# Apaga o preview de um PR: as releases e o link que o nginx serve.
#   infra/preview-apagar.sh 12
set -euo pipefail

. "$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)/lib.sh"

N="${1:?e preciso o numero do PR}"
case "$N" in *[!0-9]*) echo "numero de PR invalido: $N" >&2; exit 2 ;; esac

rm -f "$(raiz_web)/previews_root/pr/$N"
rm -rf "$(base_de "preview:$N")"
echo "preview do PR #$N apagado"
