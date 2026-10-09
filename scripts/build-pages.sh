#!/usr/bin/env bash
# Builds the static site GitHub Pages serves at https://nearbycoder.github.io/Ocarina/
# into pages-dist/ (gitignored): index.html at the root, a .nojekyll marker,
# relative asset URLs, and no headers or server code needed.
#
#   scripts/build-pages.sh            # then publish pages-dist/ as gh-pages
#   node tools/check-pages.mjs <url>  # check a served copy
set -euo pipefail
cd "$(dirname "$0")/.."
OUT=pages-dist

[ -d node_modules ] || npm ci
npx tsc --noEmit
npx vite build --outDir "$OUT" --emptyOutDir
node scripts/check_assets.mjs
touch "$OUT/.nojekyll"

# GitHub refuses files over 100 MB; keep every file well under 50 MB.
big=$(find "$OUT" -type f -size +50M)
if [ -n "$big" ]; then
  echo "Files over 50 MB:" >&2
  echo "$big" >&2
  exit 1
fi
echo "Site: $OUT ($(du -sh "$OUT" | cut -f1), $(find "$OUT" -type f | wc -l) files)"
echo "Largest files:"
find "$OUT" -type f -printf '%s\t%P\n' | sort -rn | head -5 |
  awk -F'\t' '{ printf "  %7.2f MB  %s\n", $1 / 1048576, $2 }'
