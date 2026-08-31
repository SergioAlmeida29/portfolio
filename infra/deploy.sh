#!/usr/bin/env bash
# Deploy manual no Acer: copia o site para o web root do Nginx.
# Fase 2: sem build, publica o index.html do repo.
# Fase 5+: passa a publicar dist/ (depois do "npm run build").
set -euo pipefail

REPO_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
WEB_ROOT="/var/www/sergioalmeida.dev/html"

if [ -d "$REPO_DIR/dist" ]; then
  echo "-> a publicar build (dist/)"
  rsync -a --delete "$REPO_DIR/dist/" "$WEB_ROOT/"
else
  echo "-> a publicar index.html do repo (sem build)"
  find "$WEB_ROOT" -mindepth 1 -delete
  cp "$REPO_DIR/index.html" "$WEB_ROOT/"
fi

echo "-> publicado em $WEB_ROOT"
ls -la "$WEB_ROOT"
