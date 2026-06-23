#!/usr/bin/env python3
"""PreToolUse (Edit|Write|MultiEdit): 보호 경로 편집 차단.

승인 워크플로우(CLAUDE.md §4): 하네스/배포/도메인 핵심 설정은
변경 계획을 먼저 제시하고 명시적 승인을 받은 뒤에만 손댄다.
"""
import re
import sys
import os

sys.path.insert(0, os.path.dirname(__file__))
from _util import read_event, target_path, rel_path, block, ok  # noqa: E402

PROTECTED = re.compile(
    r"(^|/)(astro\.config\.(mjs|ts|js)|package(-lock)?\.json)$"
    r"|(^|/)\.claude/"
    r"|(^|/)\.github/workflows/"
    r"|(^|/)_guide/(brand|domain-glossary)\.md$"
)

event = read_event()
path = target_path(event)
if not path:
    ok()

rel = rel_path(path)
if PROTECTED.search(rel):
    block([
        f"🔒 보호 경로 편집 차단: {rel}",
        "이 파일은 하네스/배포/도메인 핵심 설정입니다.",
        "CLAUDE.md §4 승인 워크플로우에 따라 변경 계획(대상·요지·이유)을",
        "먼저 사용자에게 제시하고 명시적 승인을 받은 뒤 진행하세요.",
        "(보호 대상 조정이 필요하면 .claude/hooks/protect-paths.py의 PROTECTED 패턴을 함께 논의)",
    ])
ok()
