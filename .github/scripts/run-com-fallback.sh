#!/usr/bin/env bash
# Corre o prompt em $PROMPT no primeiro modelo de modelos.txt que responder e
# escreve a resposta no stdout.
#
# Argumento opcional: comando de verificação. Um modelo pode responder sem ter
# feito o trabalho pedido (por exemplo, sem aplicar etiquetas); se a verificação
# falhar, passa-se ao modelo seguinte.
set -euo pipefail

verificador="${1:-}"
raiz="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

# fd 3 para o opencode não consumir a lista de modelos pelo stdin
while read -r modelo <&3; do
  case "$modelo" in '' | \#*) continue ;; esac

  if ! resposta="$(bash "$raiz/run-opencode-model.sh" "$modelo")"; then
    echo "::warning::$modelo nao respondeu" >&2
    continue
  fi

  if [ -n "$verificador" ] && ! eval "$verificador" >/dev/null; then
    echo "::warning::$modelo respondeu mas nao cumpriu a verificacao" >&2
    continue
  fi

  echo "Modelo usado: $modelo" >&2
  printf '%s\n' "$resposta"
  exit 0
done 3< "$raiz/modelos.txt"

echo "::error::Nenhum modelo gratuito conseguiu concluir o pedido."
exit 1
