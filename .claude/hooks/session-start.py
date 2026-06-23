#!/usr/bin/env python3
"""SessionStart: 세션마다 핵심 가드레일을 컨텍스트로 주입."""
import json
import subprocess
import sys


def branch():
    try:
        return subprocess.check_output(
            ["git", "branch", "--show-current"],
            stderr=subprocess.DEVNULL, text=True,
        ).strip() or "(detached)"
    except Exception:
        return "(no-git)"


ctx = f"""[Gluming 웹 가드레일] 브랜치: {branch()}
항상 지킬 원칙 3가지:
1) 자가완결 — 외부 이미지/폰트/스크립트 런타임 의존 금지. base64 인라인 또는 src/assets 번들만.
2) 웰니스 — 의료/진단/치료/완치/효능 보장 표현 금지. 1형 당뇨 비대상.
3) plan 먼저 — 변경 전 대상·요지·이유 제시. 보호 경로는 승인 필수.
세부: CLAUDE.md, _guide/domain-glossary.md, .claude/skills/*"""

print(json.dumps({
    "hookSpecificOutput": {
        "hookEventName": "SessionStart",
        "additionalContext": ctx,
    }
}, ensure_ascii=False))
sys.exit(0)
