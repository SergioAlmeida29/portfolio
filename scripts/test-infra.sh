#!/usr/bin/env bash
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
TMP="$(mktemp -d)"
trap 'rm -rf "$TMP"' EXIT

mkdir -p "$TMP/bin" "$TMP/dist/assets" "$TMP/www/sergioalmeida.dev/releases/good" "$TMP/private"
printf '<div id="root"></div>\n' > "$TMP/dist/index.html"
printf 'asset\n' > "$TMP/dist/assets/test.js"
ln -s "$TMP/www/sergioalmeida.dev/releases/good" "$TMP/www/sergioalmeida.dev/current"

for command in sudo diff; do
  cat > "$TMP/bin/$command" <<'EOF'
#!/usr/bin/env bash
exit 99
EOF
  chmod +x "$TMP/bin/$command"
done

PATH="$TMP/bin:$PATH" WEB_ROOT="$TMP/www" DIST_DIR="$TMP/dist" \
  bash "$ROOT/infra/deploy-preview.sh" 123 >/dev/null
cmp "$TMP/dist/index.html" "$TMP/www/staging.sergioalmeida.dev/pr/123/index.html"
cmp "$TMP/dist/assets/test.js" "$TMP/www/staging.sergioalmeida.dev/pr/123/assets/test.js"

if WEB_ROOT="$TMP/www" bash "$ROOT/infra/rollback.sh" prod ../../private >/dev/null 2>&1; then
  echo 'rollback aceitou um caminho fora de releases' >&2
  exit 1
fi
[ "$(readlink -f "$TMP/www/sergioalmeida.dev/current")" = "$TMP/www/sergioalmeida.dev/releases/good" ]
ln -s "$TMP/private" "$TMP/www/sergioalmeida.dev/releases/escape"
if WEB_ROOT="$TMP/www" bash "$ROOT/infra/rollback.sh" prod escape >/dev/null 2>&1; then
  echo 'rollback aceitou uma release symlink' >&2
  exit 1
fi
[ "$(readlink -f "$TMP/www/sergioalmeida.dev/current")" = "$TMP/www/sergioalmeida.dev/releases/good" ]
WEB_ROOT="$TMP/www" bash "$ROOT/infra/rollback.sh" prod good >/dev/null

echo 'infra: preview isolada e rollback validado'
