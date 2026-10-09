#!/usr/bin/env bash
# Deploy de PR preview no Acer.
#   infra/deploy-preview.sh <pr_number>
#
# Publica o dist/ em /var/www/staging.sergioalmeida.dev/pr/<N>/
# Sincroniza os ficheiros e snippets do nginx se necessário.
# Mantém no máximo 10 previews.
set -euo pipefail

PR="${1:?uso: deploy-preview.sh <pr_number>}"
[[ "$PR" =~ ^[0-9]+$ ]] || { echo "numero de PR invalido: $PR" >&2; exit 2; }

REPO_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
. "$REPO_DIR/infra/lib.sh"

if [ ! -d "$REPO_DIR/dist" ]; then
  echo "dist/ não encontrado — corre npm run build primeiro" >&2
  exit 1
fi
[ -z "$(find "$REPO_DIR/dist" -type l -print -quit)" ] || {
  echo "dist/ contem symlink — publicação recusada" >&2
  exit 1
}

PR_ROOT="$(base_de staging)/pr"
BASE="$PR_ROOT/$PR"

sync_nginx staging "$REPO_DIR"

# --- publicar preview ---
mkdir -p "$BASE"
rsync -rlt --delete "$REPO_DIR/dist/" "$BASE/"
touch "$BASE"
chmod -R a=rX,u+w "$BASE"
echo "-> preview do PR #$PR em /pr/$PR/"

# limpar previews antigas (manter as 10 mais recentes)
if [ -d "$PR_ROOT" ]; then
  ls -1dt "$PR_ROOT"/*/ 2>/dev/null | tail -n +11 | xargs -r rm -rf
fi
