#!/usr/bin/env bash
# Sanity-check the extension before packaging: every JSON file parses, every
# JavaScript file is syntactically valid, and every file the manifest and HTML
# pages reference exists.
set -euo pipefail
cd "$(dirname "$0")/.."

fail=0
tmp="$(mktemp -d)"
trap 'rm -rf "$tmp"' EXIT

for f in $(git ls-files '*.json'); do
  node -e "JSON.parse(require('fs').readFileSync(process.argv[1], 'utf8'))" "$f" \
    || { echo "Invalid JSON: $f"; fail=1; }
done

for f in $(git ls-files '*.js' '*.mjs'); do
  case "$f" in
    scripts/*) continue ;;
  esac
  if ! node --check "$f" 2>/dev/null; then
    # ES modules (chunks, workers) need a .mjs extension for node --check.
    cp "$f" "$tmp/check.mjs"
    node --check "$tmp/check.mjs" 2>"$tmp/err" || { echo "Syntax error: $f"; head -5 "$tmp/err"; fail=1; }
  fi
done

node - <<'EOF' || fail=1
const fs = require('fs');
const path = require('path');
const m = JSON.parse(fs.readFileSync('manifest.json', 'utf8'));
const refs = new Set();
Object.values(m.icons || {}).forEach((p) => refs.add(p));
if (m.background && m.background.service_worker) refs.add(m.background.service_worker);
if (m.action && m.action.default_popup) refs.add(m.action.default_popup);
if (m.side_panel && m.side_panel.default_path) refs.add(m.side_panel.default_path);
if (m.options_ui && m.options_ui.page) refs.add(m.options_ui.page);
(m.content_scripts || []).forEach((c) => [...(c.js || []), ...(c.css || [])].forEach((p) => refs.add(p)));
for (const html of fs.readdirSync('.').filter((f) => f.endsWith('.html'))) {
  const src = fs.readFileSync(html, 'utf8');
  for (const [, ref] of src.matchAll(/(?:src|href)="\/?([^"#?:]+)"/g)) refs.add(ref);
}
let missing = 0;
for (const ref of refs) {
  if (!fs.existsSync(path.normalize(ref.replace(/^\//, '')))) {
    console.error(`Missing file referenced by the manifest or a page: ${ref}`);
    missing++;
  }
}
if (!/^\d+(\.\d+){0,3}$/.test(m.version)) {
  console.error(`manifest.json version "${m.version}" is not a valid Chrome version`);
  missing++;
}
process.exit(missing ? 1 : 0);
EOF

if [ "$fail" -ne 0 ]; then
  echo "Validation failed."
  exit 1
fi
echo "Validation passed."
