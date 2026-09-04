#!/usr/bin/env bash
# Tamanhos gzip do build publicado e diferença face à release anterior, em
# markdown para o resumo do job.
#   infra/tamanhos.sh <prod|staging>
#
# Corre depois do deploy: a release mais recente é a que acabou de entrar e a
# anterior é a que serve de referência. Reporta, não bloqueia — não há orçamento
# de bundle, há a obrigação de se ver o que cresceu.
set -euo pipefail

. "$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)/lib.sh"

AMB="${1:-prod}"
BASE="$(base_de "$AMB")" || { echo "uso: tamanhos.sh [prod|staging]" >&2; exit 2; }

# chave<TAB>bytes para cada asset, com o hash do nome removido para as releases
# poderem ser comparadas entre si
medir() {
  [ -d "$1/assets" ] || return 0
  find "$1/assets" \( -name '*.js' -o -name '*.css' \) -print0 \
    | while IFS= read -r -d '' f; do
        chave="$(basename "$f" | sed -E 's/-[A-Za-z0-9_-]{8}\.(js|css)$/.\1/')"
        printf '%s\t%s\n' "$chave" "$(gzip -c "$f" | wc -c)"
      done
}

kb() { awk -v b="$1" 'BEGIN { printf "%.1f kB", b / 1024 }'; }

delta() {
  local agora="$1" antes="$2"
  [ -z "$antes" ] && { echo 'novo'; return; }
  awk -v a="$agora" -v b="$antes" 'BEGIN {
    d = (a - b) / 1024
    if (d > 0.05)  printf "+%.1f kB", d
    else if (d < -0.05) printf "%.1f kB", d
    else print "="
  }'
}

cd "$BASE/releases"
actual="$(basename "$(readlink -f "$BASE/current")")"
anterior="$(ls -1dt */ | sed 's:/$::' | grep -vFx "$actual" | head -1 || true)"

declare -A ANTES
if [ -n "$anterior" ]; then
  while IFS=$'\t' read -r k v; do ANTES["$k"]="$v"; done < <(medir "$BASE/releases/$anterior")
fi

echo "| asset | gzip | vs. anterior |"
echo "|---|---:|---:|"

total=0
total_antes=0
while IFS=$'\t' read -r k v; do
  total=$((total + v))
  total_antes=$((total_antes + ${ANTES[$k]:-0}))
  echo "| \`$k\` | $(kb "$v") | $(delta "$v" "${ANTES[$k]:-}") |"
done < <(medir "$BASE/releases/$actual" | sort)

echo "| **total** | **$(kb "$total")** | **$(delta "$total" "$([ -n "$anterior" ] && echo "$total_antes")")** |"

[ -n "$anterior" ] || echo $'\n_Sem release anterior para comparar._'
