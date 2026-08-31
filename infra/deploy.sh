#!/usr/bin/env bash
# Deploy atómico no Acer.
#   infra/deploy.sh prod      -> /var/www/sergioalmeida.dev
#   infra/deploy.sh staging   -> /var/www/staging.sergioalmeida.dev
#
# Coloca o build numa pasta releases/<sha> e faz flip do symlink "current".
# Se algo falha antes do flip, o site atual fica intacto.
set -euo pipefail

ENV="${1:-prod}"
case "$ENV" in
  prod)    BASE="/var/www/sergioalmeida.dev" ;;
  staging) BASE="/var/www/staging.sergioalmeida.dev" ;;
  *) echo "uso: deploy.sh [prod|staging]" >&2; exit 2 ;;
esac

REPO_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
SHA="${GITHUB_SHA:-$(git -C "$REPO_DIR" rev-parse HEAD)}"
KEEP=5

# origem: dist/ se houver build, senão o index.html do repo (fase pré-scaffold)
if [ -d "$REPO_DIR/dist" ]; then
  SRC="$REPO_DIR/dist"
else
  SRC="$(mktemp -d)"
  cp "$REPO_DIR/index.html" "$SRC/"
fi

REL="$BASE/releases/$SHA"
mkdir -p "$REL"
rsync -a --delete "$SRC/" "$REL/"

# flip atómico do symlink
ln -sfn "$REL" "$BASE/current.tmp"
mv -T "$BASE/current.tmp" "$BASE/current"
echo "-> $ENV agora em releases/$SHA"

# limpar releases antigas (manter as KEEP mais recentes)
cd "$BASE/releases"
ls -1dt */ 2>/dev/null | tail -n +$((KEEP + 1)) | xargs -r rm -rf
ls -1dt */ | head -n "$KEEP"
