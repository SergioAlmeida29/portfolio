#!/usr/bin/env bash
# Volta a uma release anterior e confirma que o site continua a servir.
#   infra/rollback.sh prod              -> a release anterior à actual
#   infra/rollback.sh prod <release>    -> a release indicada
#
# O deploy.sh guarda as 5 últimas releases; isto é só o botão que faltava.
set -euo pipefail

AQUI="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
. "$AQUI/lib.sh"

AMB="${1:-prod}"
BASE="$(base_de "$AMB")" || { echo "uso: rollback.sh [prod|staging] [release]" >&2; exit 2; }
ALVO="${2:-}"

[ -d "$BASE/releases" ] || { echo "sem releases em $BASE" >&2; exit 1; }
actual="$(basename "$(readlink -f "$BASE/current")")"

if [ -z "$ALVO" ]; then
  # a mais recente que não seja a que está no ar
  # o || true é preciso: sem ele o grep sem correspondência mata o script com
  # set -e e a mensagem abaixo nunca chega a aparecer
  ALVO="$(cd "$BASE/releases" && ls -1dt */ | sed 's:/$::' | grep -vFx "$actual" | head -1 || true)"
  [ -n "$ALVO" ] || { echo "nao ha release anterior para onde voltar" >&2; exit 1; }
fi

[ -d "$BASE/releases/$ALVO" ] || { echo "release inexistente: $ALVO" >&2; exit 1; }
[ "$ALVO" = "$actual" ] && { echo "ja esta em $ALVO, nada a fazer"; exit 0; }

apontar "$BASE" "$BASE/releases/$ALVO"
echo "-> $AMB voltou de $actual para $ALVO"

bash "$AQUI/smoke.sh" "$AMB"
