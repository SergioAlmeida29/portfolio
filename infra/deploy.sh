#!/usr/bin/env bash
# Deploy atómico no Acer.
#   infra/deploy.sh prod      -> /var/www/sergioalmeida.dev
#   infra/deploy.sh staging   -> /var/www/staging.sergioalmeida.dev
#
# Coloca o build numa pasta releases/<sha> e faz flip do symlink "current".
# Sincroniza também os configs nginx a partir do repo — sem passos manuais.
# Se algo falha antes do flip, o site atual fica intacto.
set -euo pipefail

ENV="${1:-prod}"
case "$ENV" in
  prod)    BASE="/var/www/sergioalmeida.dev" ;;
  staging) BASE="/var/www/staging.sergioalmeida.dev" ;;
  *) echo "uso: deploy.sh [prod|staging]" >&2; exit 2 ;;
esac

REPO_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/." && pwd)"
REPO_DIR="$(cd "$REPO_DIR/.." && pwd)"
SHA="${GITHUB_SHA:-$(git -C "$REPO_DIR" rev-parse HEAD)}"
KEEP=5
NGINX_CONF="${ENV}.sergioalmeida.dev.conf"

# --- sincronizar configs nginx do repo ---
sync_nginx() {
  local changed=0

  # snippet comum a todos os ambientes
  if ! diff -q "$REPO_DIR/infra/nginx/snippets/sergioalmeida-common.conf" \
       /etc/nginx/snippets/sergioalmeida-common.conf &>/dev/null; then
    cp "$REPO_DIR/infra/nginx/snippets/sergioalmeida-common.conf" \
       /etc/nginx/snippets/sergioalmeida-common.conf
    changed=1
  fi

  # snippet de PR previews (apenas staging)
  if [ "$ENV" = "staging" ]; then
    if ! diff -q "$REPO_DIR/infra/nginx/snippets/pr-previews.conf" \
         /etc/nginx/snippets/pr-previews.conf &>/dev/null 2>&1; then
      cp "$REPO_DIR/infra/nginx/snippets/pr-previews.conf" \
         /etc/nginx/snippets/pr-previews.conf
      changed=1
    fi
  fi

  # vhost do ambiente
  if ! diff -q "$REPO_DIR/infra/nginx/$NGINX_CONF" \
       "/etc/nginx/sites-available/$NGINX_CONF" &>/dev/null; then
    cp "$REPO_DIR/infra/nginx/$NGINX_CONF" \
       "/etc/nginx/sites-available/$NGINX_CONF"
    changed=1
  fi

  if [ "$changed" = "1" ]; then
    nginx -t
    systemctl reload nginx
    echo "-> nginx recarregado"
  else
    echo "-> nginx sem alterações"
  fi
}

sync_nginx

# --- deploy do site ---
if [ -d "$REPO_DIR/dist" ]; then
  SRC="$REPO_DIR/dist"
else
  SRC="$(mktemp -d)"
  cp "$REPO_DIR/index.html" "$SRC/"
fi

REL="$BASE/releases/$SHA"
mkdir -p "$REL"
rsync -rlt --delete "$SRC/" "$REL/"
chmod -R a=rX,u+w "$REL"

# flip atómico do symlink
ln -sfn "$REL" "$BASE/current.tmp"
mv -T "$BASE/current.tmp" "$BASE/current"
echo "-> $ENV agora em releases/$SHA"

# limpar releases antigas (manter as KEEP mais recentes)
cd "$BASE/releases"
ls -1dt */ 2>/dev/null | tail -n +$((KEEP + 1)) | xargs -r rm -rf
ls -1dt */ | head -n "$KEEP"
