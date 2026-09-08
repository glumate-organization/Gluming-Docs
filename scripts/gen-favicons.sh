#!/usr/bin/env bash
# 공식 앱 아이콘(src/assets/logo/app_logo.png)에서 파비콘 세트를 생성한다.
#
#   ./scripts/gen-favicons.sh
#
# 원본 아트를 크롭 없이 그대로 축소한다 — 앱스토어 아이콘과 100% 동일하게 유지.
# macOS 기본 sips 만 쓴다 (ImageMagick 등 추가 의존성 없음).
# 16/32px 은 1920 → 512 → 목표 크기 2단계로 줄여야 앨리어싱이 덜하다.
set -euo pipefail

cd "$(dirname "$0")/.."

SRC="src/assets/logo/app_logo.png"
OUT="public"
TMP="$(mktemp -d)"
trap 'rm -rf "$TMP"' EXIT

[ -f "$SRC" ] || { echo "원본이 없다: $SRC" >&2; exit 1; }

# 중간 단계 (다운샘플 품질용)
sips -s format png --resampleHeightWidth 512 512 "$SRC" --out "$TMP/512.png" >/dev/null

gen() { # gen <크기> <출력경로> <소스>
  sips -s format png --resampleHeightWidth "$1" "$1" "$3" --out "$2" >/dev/null
}

gen 180 "$OUT/favicon.png"          "$SRC"
gen 180 "$OUT/apple-touch-icon.png" "$SRC"
gen  32 "$OUT/favicon-32.png"       "$TMP/512.png"
gen  16 "$OUT/favicon-16.png"       "$TMP/512.png"
gen  48 "$TMP/48.png"               "$TMP/512.png"

# favicon.ico — PNG 를 그대로 담는 멀티사이즈 ICO (모던 브라우저 전부 지원).
# ICONDIR(6B) + ICONDIRENTRY(16B) × n + PNG 원본 바이트.
python3 - "$OUT/favicon.ico" 16 "$OUT/favicon-16.png" 32 "$OUT/favicon-32.png" 48 "$TMP/48.png" <<'PY'
import struct, sys

out, rest = sys.argv[1], sys.argv[2:]
imgs = [(int(rest[i]), open(rest[i + 1], 'rb').read()) for i in range(0, len(rest), 2)]

header = struct.pack('<HHH', 0, 1, len(imgs))
offset = len(header) + 16 * len(imgs)
entries, blob = b'', b''
for size, data in imgs:
    entries += struct.pack('<BBBBHHII', size, size, 0, 0, 1, 32, len(data), offset)
    offset += len(data)
    blob += data

open(out, 'wb').write(header + entries + blob)
PY

echo "생성 완료:"
ls -la "$OUT"/favicon.ico "$OUT"/favicon-16.png "$OUT"/favicon-32.png \
       "$OUT"/favicon.png "$OUT"/apple-touch-icon.png
