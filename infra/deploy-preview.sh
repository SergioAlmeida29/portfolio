#!/usr/bin/env bash
# Deploy de PR preview no Acer.
#   infra/deploy-preview.sh <pr_number>
#
# Publica o dist/ em /var/www/staging.sergioalmeida.dev/pr/<N>/
# Sincroniza o snippet nginx de PR previews se necessário.
# Mantém no máximo 10 previews.
set -euo pipefail

PR="${1:?uso: deploy-preview.sh <pr_number>}"
BASE="/var/www/staging.sergioalmeida.dev/pr/$PR"
REPO_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/." && pwd)"
REPO_DIR="$(cd "$REPO_DIR/.." && pwd)"

if [ ! -d "$REPO_DIR/dist" ]; then
  echo "dist/ não encontrado — corre npm run build:staging primeiro" >&2
  exit 1
fi

# --- garantir snippet nginx instalado ---
SNIPPET_SRC="$REPO_DIR/infra/nginx/snippets/pr-previews.conf"
SNIPPET_DST="/etc/nginx/snippets/pr-previews.conf"
VHOST_SRC="$REPO_DIR/infra/nginx/staging.sergioalmeida.dev.conf"
VHOST_DST="/etc/nginx/sites-available/staging.sergioalmeida.dev.conf"

nginx_changed=0
if ! diff -q "$SNIPPET_SRC" "$SNIPPET_DST" &>/dev/null 2>&1; then
  sudo cp "$SNIPPET_SRC" "$SNIPPET_DST"
  nginx_changed=1
fi
if ! diff -q "$VHOST_SRC" "$VHOST_DST" &>/dev/null; then
  sudo cp "$VHOST_SRC" "$VHOST_DST"
  nginx_changed=1
fi
if [ "$nginx_changed" = "1" ]; then
  sudo nginx -t
  sudo systemctl reload nginx
  echo "-> nginx recarregado"
fi

# --- publicar preview ---
mkdir -p "$BASE"
rsync -rlt --delete "$REPO_DIR/dist/" "$BASE/"
chmod -R a=rX,u+w "$BASE"
echo "-> preview do PR #$PR em /pr/$PR/"

# limpar previews antigas (manter as 10 mais recentes)
PR_ROOT="/var/www/staging.sergioalmeida.dev/pr"
if [ -d "$PR_ROOT" ]; then
  ls -1dt "$PR_ROOT"/*/ 2>/dev/null | tail -n +11 | xargs -r rm -rf
fi
