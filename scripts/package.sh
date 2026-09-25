#!/usr/bin/env bash
# Build the release zip: dist/scalemax-official-v<version>.zip
#
# The zip contains exactly what Chrome needs to "Load unpacked", inside a
# top-level scalemax-official/ folder, plus the README and license files.
set -euo pipefail
cd "$(dirname "$0")/.."

version="$(node -p "require('./manifest.json').version")"
name="scalemax-official"
out="dist/${name}-v${version}.zip"

# Everything in the repo except development-only files.
files=()
while IFS= read -r f; do
  case "$f" in
    .github/*|scripts/*|.gitignore|icon/icon.svg) continue ;;
  esac
  files+=("$f")
done < <(git ls-files)

stage="$(mktemp -d)"
trap 'rm -rf "$stage"' EXIT
mkdir -p "$stage/$name"
for f in "${files[@]}"; do
  mkdir -p "$stage/$name/$(dirname "$f")"
  cp "$f" "$stage/$name/$f"
done

mkdir -p dist
rm -f "$out"
(cd "$stage" && zip -qrX9 "$OLDPWD/$out" "$name")

echo "Created $out ($(du -h "$out" | cut -f1), ${#files[@]} files)"
if [ -n "${GITHUB_OUTPUT:-}" ]; then
  {
    echo "zip=$out"
    echo "version=$version"
  } >> "$GITHUB_OUTPUT"
fi
