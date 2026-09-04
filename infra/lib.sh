#!/usr/bin/env bash
# Fonte de verdade dos caminhos de cada ambiente e do flip do symlink.
# Carregado por deploy.sh, smoke.sh e rollback.sh.

# A raiz do disco. WEB_ROOT existe para estes scripts poderem ser exercitados
# fora do Acer.
raiz_web() { echo "${WEB_ROOT:-/var/www}"; }

# host_de <prod|staging|preview:N> -> o server_name do nginx.
# Os previews são servidos pelo servidor de staging, logo herdam o Cloudflare
# Access e o noindex que já lá estão.
host_de() {
  case "$1" in
    prod)                echo sergioalmeida.dev ;;
    staging | preview:*) echo staging.sergioalmeida.dev ;;
    *)                   return 2 ;;
  esac
}

# caminho_de <ambiente> -> o prefixo de URL onde o site fica montado
caminho_de() {
  case "$1" in
    preview:*) echo "/pr/${1#preview:}/" ;;
    *)         echo / ;;
  esac
}

# base_de <ambiente> -> a pasta de releases desse ambiente
base_de() {
  local host
  case "$1" in
    preview:*) echo "$(raiz_web)/previews/${1#preview:}" ;;
    *)
      host="$(host_de "$1")" || return 2
      echo "$(raiz_web)/$host"
      ;;
  esac
}

# apontar <base> <release> — flip atómico: o mv de um symlink sobre outro é
# uma operação só, logo nunca há um instante sem "current".
apontar() {
  ln -sfn "$2" "$1/current.tmp"
  mv -T "$1/current.tmp" "$1/current"
}
