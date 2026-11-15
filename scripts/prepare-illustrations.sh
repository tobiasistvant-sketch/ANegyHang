#!/usr/bin/env bash
set -euo pipefail

# Developer-only asset preparation. The static game needs no ImageMagick.
illustration_root="$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")/.." && pwd)"
command -v magick >/dev/null || { echo 'ImageMagick 7 (magick) szükséges.' >&2; exit 1; }
mkdir -p "$illustration_root/assets/illustrations"

illustration_names=(hero-four-paths wallet-scene-opening wallet-scene-voices wallet-ending-return-full wallet-ending-keep-money wallet-ending-return-documents wallet-ending-walk-away hero-teacher-paths teacher-scene-opening teacher-ending-private-talk teacher-ending-argument teacher-ending-silence teacher-ending-homeroom-help)
# Explicit IDs let a new story be prepared without touching approved old assets.
if (( $# )); then
  for illustration_name in "$@"; do
    illustration_known=false
    for illustration_allowed in "${illustration_names[@]}"; do
      if [[ "$illustration_name" == "$illustration_allowed" ]]; then illustration_known=true; break; fi
    done
    if [[ "$illustration_known" != true ]]; then
      echo "Ismeretlen illusztráció: $illustration_name" >&2
      exit 1
    fi
  done
  illustration_names=("$@")
fi

for illustration_name in "${illustration_names[@]}"; do
  illustration_source="$illustration_root/design/illustrations/sources/$illustration_name.png"
  # Current approved originals live together in sources/. The original style
  # sample stays separate and must not replace the corrected opening scene.
  illustration_target="$illustration_root/assets/illustrations/$illustration_name"
  if [[ "$illustration_name" == hero-teacher-paths || "$illustration_name" == teacher-* ]]; then
    # Fit the whole approved teacher scene; never crop hands, people or the 5.
    # The near-16:9 originals need only a 1–2 pixel-wide background margin.
    magick "$illustration_source" -auto-orient -resize 1280x720 -background '#FBF9F6' -gravity center -extent 1280x720 -depth 8 -strip -define png:compression-level=9 "$illustration_target.png"
  else
    # Preserve the original wallet preparation pipeline.
    magick "$illustration_source" -auto-orient -resize '1280x720^' -gravity center -extent 1280x720 -depth 8 -strip -define png:compression-level=9 "$illustration_target.png"
  fi
  magick "$illustration_target.png" -quality 85 -define webp:method=6 "$illustration_target.webp"
done
