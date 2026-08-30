#!/usr/bin/env bash
# Deploy manual no Acer: copia o site para o web root do Nginx.
# Fase 2: sem build, publica o index.html do repo.
# Fase 5+: passa a publicar dist/ (depois do "npm run build").
set -euo pipefail

REPO_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
WEB_ROOT="/var/www/sergioalmeida.dev/html"

if [ -d "$REPO_DIR/dist" ]; then
  SRC="$REPO_DIR/dist/"
  echo "-> a publicar build (dist/)"
else
  SRC="$REPO_DIR/"
  echo "-> a publicar index.html do repo (sem build)"
fi

rsync -a --delete \
  --exclude '.git' --exclude 'node_modules' --exclude 'infra' \
  --exclude 'src' --exclude '*.md' --exclude 'package*.json' \
  --exclude 'vite.config.*' --exclude 'tsconfig*' --exclude '.github' \
  "$SRC" "$WEB_ROOT/"

echo "-> publicado em $WEB_ROOT"
ls -la "$WEB_ROOT"
