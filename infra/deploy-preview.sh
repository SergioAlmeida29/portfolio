#!/usr/bin/env bash
# Deploy de PR preview no Acer.
#   infra/deploy-preview.sh <pr_number>
#
# Publica o dist/ em /var/www/staging.sergioalmeida.dev/pr/<N>/
# e mantém no máximo 10 previews antigas.
set -euo pipefail

PR="${1:?uso: deploy-preview.sh <pr_number>}"
BASE="/var/www/staging.sergioalmeida.dev/pr/$PR"
REPO_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"

if [ ! -d "$REPO_DIR/dist" ]; then
  echo "dist/ não encontrado — corre npm run build:staging primeiro" >&2
  exit 1
fi

mkdir -p "$BASE"
rsync -rlt --delete "$REPO_DIR/dist/" "$BASE/"
chmod -R a=rX,u+w "$BASE"
echo "-> preview do PR #$PR em /pr/$PR/"

# limpar previews antigas de PRs fechados (manter as 10 mais recentes)
PR_ROOT="/var/www/staging.sergioalmeida.dev/pr"
if [ -d "$PR_ROOT" ]; then
  ls -1dt "$PR_ROOT"/*/ 2>/dev/null | tail -n +11 | xargs -r rm -rf
fi
