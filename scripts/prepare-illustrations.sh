#!/usr/bin/env bash
set -euo pipefail

# Developer-only asset preparation. The static game needs no ImageMagick.
illustration_root="$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")/.." && pwd)"
command -v magick >/dev/null || { echo 'ImageMagick 7 (magick) szükséges.' >&2; exit 1; }
mkdir -p "$illustration_root/assets/illustrations"

for illustration_name in hero-four-paths wallet-scene-opening wallet-scene-voices wallet-ending-return-full wallet-ending-keep-money wallet-ending-return-documents wallet-ending-walk-away; do
  illustration_source="$illustration_root/design/illustrations/sources/$illustration_name.png"
  if [[ "$illustration_name" == wallet-scene-opening ]]; then
    illustration_source="$illustration_root/design/illustrations/wallet-opening-sample.png"
  fi
  illustration_target="$illustration_root/assets/illustrations/$illustration_name"
  # Only size/aspect and delivery format change; originals remain untouched.
  magick "$illustration_source" -auto-orient -resize '1280x720^' -gravity center -extent 1280x720 -depth 8 -strip -define png:compression-level=9 "$illustration_target.png"
  magick "$illustration_target.png" -quality 85 -define webp:method=6 "$illustration_target.webp"
done
