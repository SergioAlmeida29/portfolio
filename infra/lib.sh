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

# sync_nginx <prod|staging> [repo_dir]
# Sincroniza snippets e vhosts do nginx se houver alterações e faz reload.
sync_nginx() {
  local env="${1:-prod}"
  local repo_dir="${2:-$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)}"
  local host
  host="$(host_de "$env")" || return 2
  local conf="${host}.conf"
  local changed=0

  # snippet comum
  if ! diff -q "$repo_dir/infra/nginx/snippets/sergioalmeida-common.conf" \
       /etc/nginx/snippets/sergioalmeida-common.conf &>/dev/null; then
    sudo cp "$repo_dir/infra/nginx/snippets/sergioalmeida-common.conf" \
       /etc/nginx/snippets/sergioalmeida-common.conf
    changed=1
  fi

  # snippet de previews (apenas staging)
  if [ "$env" = "staging" ]; then
    if ! diff -q "$repo_dir/infra/nginx/snippets/pr-previews.conf" \
         /etc/nginx/snippets/pr-previews.conf &>/dev/null 2>&1; then
      sudo cp "$repo_dir/infra/nginx/snippets/pr-previews.conf" \
         /etc/nginx/snippets/pr-previews.conf
      changed=1
    fi
  fi

  # vhost em sites-available
  if ! diff -q "$repo_dir/infra/nginx/$conf" \
       "/etc/nginx/sites-available/$conf" &>/dev/null; then
    sudo cp "$repo_dir/infra/nginx/$conf" \
       "/etc/nginx/sites-available/$conf"
    changed=1
  fi

  # garantir symlink em sites-enabled
  local enabled="/etc/nginx/sites-enabled/$conf"
  if [ ! -L "$enabled" ] || [ "$(readlink -f "$enabled" 2>/dev/null)" != "/etc/nginx/sites-available/$conf" ]; then
    sudo ln -sf "/etc/nginx/sites-available/$conf" "$enabled"
    changed=1
  fi

  if [ "$changed" = "1" ]; then
    sudo nginx -t
    sudo systemctl reload nginx
    echo "-> nginx recarregado ($env)"
  fi
}
