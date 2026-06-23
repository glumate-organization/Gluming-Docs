#!/usr/bin/env python3
"""PostToolUse (Edit|Write|MultiEdit): 편집은 이미 일어남(차단 불가).

stderr는 Claude에게 전달 → 의료/단정 표현이 들어갔으면 자가수정 유도.
_guide/domain-glossary.md의 금지어와 동기화 유지.
"""
import re
import sys
import os

sys.path.insert(0, os.path.dirname(__file__))
from _util import read_event, target_path, ok  # noqa: E402

TEXT_EXT = (".astro", ".html", ".htm", ".md", ".mdx", ".jsx", ".tsx", ".ts", ".js", ".json")

BANNED = re.compile(
    r"치료|완치|진단|처방|효능|특효|의약품|약을\s*끊|정상\s*수치를?\s*보장"
    r"|혈당을?\s*낮춰\s*드립|당뇨에서\s*벗어"
)

event = read_event()
path = target_path(event)
if not path or not path.endswith(TEXT_EXT) or not os.path.isfile(path):
    ok()

hits = []
try:
    with open(path, encoding="utf-8") as f:
        for i, line in enumerate(f, 1):
            if BANNED.search(line):
                hits.append(f"   L{i}: {line.strip()}")
except Exception:
    ok()

if hits:
    print(f"⚠️  웰니스 가드레일 경고: {os.path.basename(path)} 에 의료/단정 표현 감지", file=sys.stderr)
    for h in hits:
        print(h, file=sys.stderr)
    print("→ 글루밍은 의료/진단/치료 서비스가 아닙니다. 생활습관·자기관리 보조 관점으로 수정하세요.", file=sys.stderr)
    print("  (권장/금지 표현: _guide/domain-glossary.md)", file=sys.stderr)
ok()
