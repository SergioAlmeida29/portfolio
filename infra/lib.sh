#!/usr/bin/env bash
# Fonte de verdade dos caminhos de cada ambiente e do flip do symlink.
# Carregado por deploy.sh, smoke.sh e rollback.sh.

# host_de <prod|staging> -> o server_name do nginx
host_de() {
  case "$1" in
    prod)    echo sergioalmeida.dev ;;
    staging) echo staging.sergioalmeida.dev ;;
    *)       return 2 ;;
  esac
}

# base_de <prod|staging> -> a raiz no disco (o web root deriva do host).
# WEB_ROOT existe para estes scripts poderem ser exercitados fora do Acer.
base_de() {
  local host
  host="$(host_de "$1")" || return 2
  echo "${WEB_ROOT:-/var/www}/$host"
}

# apontar <base> <release> — flip atómico: o mv de um symlink sobre outro é
# uma operação só, logo nunca há um instante sem "current".
apontar() {
  ln -sfn "$2" "$1/current.tmp"
  mv -T "$1/current.tmp" "$1/current"
}
