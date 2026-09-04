#!/usr/bin/env bash
# Deploy atómico no Acer.
#   infra/deploy.sh prod      -> /var/www/sergioalmeida.dev
#   infra/deploy.sh staging   -> /var/www/staging.sergioalmeida.dev
#
# Coloca o build numa pasta releases/<sha> e faz flip do symlink "current".
# Se algo falha antes do flip, o site atual fica intacto.
set -euo pipefail

. "$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)/lib.sh"

ENV="${1:-prod}"
BASE="$(base_de "$ENV")" || { echo "uso: deploy.sh [prod|staging]" >&2; exit 2; }

REPO_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
SHA="${GITHUB_SHA:-$(git -C "$REPO_DIR" rev-parse HEAD)}"
KEEP=5

[ -d "$REPO_DIR/dist" ] || { echo "sem dist/ para publicar — falta correr o build" >&2; exit 1; }

REL="$BASE/releases/$SHA"
mkdir -p "$REL"
rsync -rlt --delete "$REPO_DIR/dist/" "$REL/"
# garantir que o nginx (www-data) consegue ler tudo
chmod -R a=rX,u+w "$REL"

apontar "$BASE" "$REL"
echo "-> $ENV agora em releases/$SHA"

# limpar releases antigas (manter as KEEP mais recentes)
cd "$BASE/releases"
ls -1dt */ 2>/dev/null | tail -n +$((KEEP + 1)) | xargs -r rm -rf
ls -1dt */ | head -n "$KEEP"
