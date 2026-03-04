#!/usr/bin/env sh
# Compress public/wighero.mp4 for faster loading. Keeps high quality (CRF 23).
# Requires: brew install ffmpeg (Mac) or install from https://ffmpeg.org
set -e
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
SRC="$ROOT/public/wighero.mp4"
if [ ! -f "$SRC" ]; then
  echo "Not found: $SRC"
  exit 1
fi
if ! command -v ffmpeg >/dev/null 2>&1; then
  echo "Install ffmpeg first: brew install ffmpeg"
  exit 1
fi
TMP="$ROOT/public/wighero.tmp.mp4"
ffmpeg -i "$SRC" -vcodec libx264 -crf 23 -preset slow \
  -vf "scale=min(1920\,iw):min(1080\,ih):force_original_aspect_ratio=decrease" \
  -movflags +faststart -an -y "$TMP"
mv "$TMP" "$SRC"
echo "Compressed: public/wighero.mp4"
