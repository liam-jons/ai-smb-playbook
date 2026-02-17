#!/usr/bin/env bash
# Build per-skill ZIP files for download from the playbook.
# Run from the repo root: ./scripts/build-skill-zips.sh
# Produces ZIPs in app/public/starter-kit/zips/

set -euo pipefail

REPO_ROOT="$(cd "$(dirname "$0")/.." && pwd)"
SKILLS_DIR="$REPO_ROOT/starter-kit/skills"
OUT_DIR="$REPO_ROOT/app/public/starter-kit/zips"

rm -rf "$OUT_DIR"
mkdir -p "$OUT_DIR"

for skill_dir in "$SKILLS_DIR"/*/; do
  skill_name="$(basename "$skill_dir")"
  zip -rjq "$OUT_DIR/${skill_name}.zip" "$skill_dir"
  echo "  zipped: ${skill_name}.zip"
done

echo "Done — $(ls "$OUT_DIR"/*.zip 2>/dev/null | wc -l | tr -d ' ') skill ZIPs in $OUT_DIR"
