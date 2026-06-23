#!/usr/bin/env python3
"""PreToolUse (Edit|Write|MultiEdit): 자가완결(self-contained) 강제.

코드에 '외부 이미지/폰트/스크립트 런타임 의존'을 넣으면 차단(exit 2).
빌드 산출물(dist/)만으로 동작해야 외부 서버가 꺼져도 사이트가 깨지지 않는다.

허용(예외): og:image / twitter:image / canonical / ld+json 등 메타데이터 절대 URL
            (자기 도메인을 가리키는 것이라 렌더링 의존이 아님)
"""
import re
import sys
import os

sys.path.insert(0, os.path.dirname(__file__))
from _util import read_event, target_path, edited_text, block, ok  # noqa: E402

RENDER_EXT = (
    ".astro", ".html", ".htm", ".css", ".scss",
    ".jsx", ".tsx", ".js", ".ts", ".md", ".mdx", ".svg",
)

# 줄 단위 예외 (메타데이터/공유용 절대 URL)
EXCEPT = re.compile(
    r"og:image|twitter:image|rel=[\"']?canonical|application/ld\+json"
    r"|<link[^>]+rel=[\"']?(alternate|sitemap|manifest)",
    re.I,
)

IMG_SRC = re.compile(
    r"(?:src|href)\s*=\s*[\"']https?://[^\"' ]+\.(?:png|jpe?g|gif|webp|avif|svg|ico|bmp)",
    re.I,
)
CSS_URL = re.compile(
    r"url\(\s*[\"']?https?://[^)\"' ]+\.(?:png|jpe?g|gif|webp|avif|svg|woff2?|ttf|otf|eot)",
    re.I,
)
CDN_LINK = re.compile(
    r"<link[^>]+href=[\"']https?://(?:fonts\.googleapis|fonts\.gstatic|cdn\.|[^\"']*cloudflare|unpkg|jsdelivr|cdnjs)",
    re.I,
)
EXT_SCRIPT = re.compile(r"<script[^>]+src=[\"']https?://", re.I)

event = read_event()
path = target_path(event)
if not path or not path.endswith(RENDER_EXT):
    ok()

text = edited_text(event)
if not text:
    ok()

violations = []
for raw in text.splitlines():
    line = raw.strip()
    if EXCEPT.search(line):
        continue
    if IMG_SRC.search(line):
        violations.append(f"  - 외부 이미지 URL(src/href): {line}")
    if CSS_URL.search(line):
        violations.append(f"  - 외부 자산 url(): {line}")
    if CDN_LINK.search(line):
        violations.append(f"  - 외부 CDN/폰트 <link>: {line}")
    if EXT_SCRIPT.search(line):
        violations.append(f"  - 외부 <script src>: {line}")

if violations:
    block([
        f"🚫 자가완결 위반 (외부 런타임 의존): {os.path.basename(path)}",
        *violations,
        "",
        "대안:",
        "  • 이미지 → base64 data URI 인라인(작은 것) 또는 src/assets/에 두고 import(큰 것)",
        "  • 폰트   → self-host(src/assets/fonts/) 후 @font-face 로컬 참조",
        "  • 스크립트 → npm 의존성으로 설치해 번들",
        "  • og:image 등 메타 URL이면 정상 — 예외 패턴(EXCEPT)에 해당하는지 확인",
        "(변환법: .claude/skills/self-contained-assets/)",
    ])
ok()
