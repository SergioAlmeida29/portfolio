#!/usr/bin/env bash
# Deploy atómico no Acer.
#   infra/deploy.sh prod         -> /var/www/sergioalmeida.dev
#   infra/deploy.sh staging      -> /var/www/staging.sergioalmeida.dev
#   infra/deploy.sh preview:12   -> /var/www/previews/12, servido em /pr/12/
#
# Coloca o build numa pasta releases/<sha> e faz flip do symlink "current".
# Se algo falha antes do flip, o site atual fica intacto.
set -euo pipefail

. "$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)/lib.sh"

ENV="${1:-prod}"
BASE="$(base_de "$ENV")" || { echo "uso: deploy.sh [prod|staging|preview:N]" >&2; exit 2; }

REPO_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
# RELEASE_ID permite republicar o mesmo commit numa release nova. O refresh do
# now.generated corre sem commit novo, e escrever por cima da release viva —
# que é o que o rsync --delete faria com o mesmo SHA — não seria atómico.
RELEASE="${RELEASE_ID:-${GITHUB_SHA:-$(git -C "$REPO_DIR" rev-parse HEAD)}}"
KEEP=5

[ -d "$REPO_DIR/dist" ] || { echo "sem dist/ para publicar — falta correr o build" >&2; exit 1; }

REL="$BASE/releases/$RELEASE"
mkdir -p "$REL" 2>/dev/null || {
  echo "nao consigo criar $REL." >&2
  echo "a pasta base existe e e do github-runner? ver docs/04-ci-cd.md" >&2
  exit 1
}
rsync -rlt --delete "$REPO_DIR/dist/" "$REL/"
# garantir que o nginx (www-data) consegue ler tudo
chmod -R a=rX,u+w "$REL"

apontar "$BASE" "$REL"

# o nginx serve os previews a partir de uma raiz só, por isso cada um entra lá
# como um link para o seu próprio "current"
case "$ENV" in
  preview:*)
    pr="$(raiz_web)/previews_root/pr"
    mkdir -p "$pr"
    ln -sfn "$BASE/current" "$pr/${ENV#preview:}"
    ;;
esac

echo "-> $ENV agora em releases/$RELEASE"

# limpar releases antigas (manter as KEEP mais recentes)
cd "$BASE/releases"
ls -1dt */ 2>/dev/null | tail -n +$((KEEP + 1)) | xargs -r rm -rf
ls -1dt */ | head -n "$KEEP"
