#!/usr/bin/env python3
"""PreToolUse (Bash): 파괴적/위험 명령 차단(exit 2). 정적 사이트용 최소 가드."""
import re
import sys
import os

sys.path.insert(0, os.path.dirname(__file__))
from _util import read_event, tool_input, block, ok  # noqa: E402

event = read_event()
cmd = (tool_input(event).get("command") or "").strip()
if not cmd:
    ok()

RULES = [
    (r"rm\s+-[a-zA-Z]*[rf][a-zA-Z]*\s+(/|~|\$HOME)(\s|$)", "루트/홈 강제 삭제"),
    (r"rm\s+-[a-zA-Z]*[rf][a-zA-Z]*\s+\.(\s|$)", "현재 디렉토리 통째 삭제"),
    (r"git\s+push\s+.*(--force|-f)(\s|$)", "git force push"),
    (r"git\s+reset\s+--hard", "git reset --hard (커밋 안 한 변경 소실 위험)"),
    (r"git\s+clean\s+-[a-zA-Z]*f", "git clean -f (미추적 파일 삭제)"),
    (r"(^|\s)(vim?|nano|code|sed\s+-i)\s+[^&|;]*dist/", "dist/ 직접 편집 (빌드 산출물은 소스에서 생성)"),
    (r"cat\s+[^&|;]*\.env", ".env 출력 (시크릿 노출)"),
]

for pattern, reason in RULES:
    if re.search(pattern, cmd):
        block([f"🛑 위험 명령 차단: {reason}", f"명령: {cmd}"])
ok()
