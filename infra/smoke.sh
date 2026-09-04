#!/usr/bin/env bash
# Verifica que o site responde mesmo, depois do flip do symlink.
#
# Bate no nginx local com o header Host correcto em vez de ir ao URL público:
# o staging está atrás do Cloudflare Access, que devolveria o ecrã de login e
# faria este teste validar a Cloudflare em vez do site.
set -euo pipefail

. "$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)/lib.sh"

AMB="${1:-prod}"
HOST="$(host_de "$AMB")" || { echo "uso: smoke.sh [prod|staging|preview:N]" >&2; exit 2; }
CAMINHO="$(caminho_de "$AMB")"

TENTATIVAS=10
INTERVALO=2
# PORTA existe para o smoke poder ser exercitado fora do Acer, onde a 80 é do root
URL_BASE="http://127.0.0.1:${PORTA:-80}"
TMP="$(mktemp -d)"
trap 'rm -rf "$TMP"' EXIT

pedir() { curl --silent --show-error --max-time 10 --header "Host: $HOST" "$@"; }

falhar() { echo "smoke $AMB: $1" >&2; exit 1; }

# 1. o index responde 200 — com retry, porque um deploy acabado de fazer pode
#    apanhar o nginx a meio de recarregar o cache de descritores
for tentativa in $(seq 1 "$TENTATIVAS"); do
  codigo="$(pedir --output "$TMP/index.html" --write-out '%{http_code}' "$URL_BASE$CAMINHO" || echo 000)"
  [ "$codigo" = 200 ] && break
  [ "$tentativa" = "$TENTATIVAS" ] && falhar "o index respondeu $codigo apos $TENTATIVAS tentativas"
  sleep "$INTERVALO"
done

# 2. é HTML, e é o nosso
tipo="$(pedir --output /dev/null --write-out '%{content_type}' "$URL_BASE$CAMINHO")"
case "$tipo" in text/html*) ;; *) falhar "o index veio como '$tipo', nao HTML" ;; esac
grep -q 'id="root"' "$TMP/index.html" || falhar 'o index nao tem <div id="root">'

# 3. o bundle referenciado existe — é isto que apanha um deploy sem assets,
#    em que o index responde 200 e a página fica em branco
js="$(grep -o 'src="[^"]*\.js"' "$TMP/index.html" | head -1 | cut -d'"' -f2)"
[ -n "$js" ] || falhar 'o index nao referencia nenhum bundle js'
codigo="$(pedir --output /dev/null --write-out '%{http_code}' "$URL_BASE$js")"
[ "$codigo" = 200 ] || falhar "o bundle $js respondeu $codigo"

# 4. o healthcheck que a Cloudflare consulta
[ "$(pedir "$URL_BASE/healthz")" = ok ] || falhar '/healthz nao devolveu ok'

echo "smoke $AMB: ok ($CAMINHO, $js, /healthz)"
