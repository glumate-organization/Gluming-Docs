"""Gluming 웹 하네스 hook 공용 유틸.

표준 라이브러리만 사용 (외부 의존 없음). python3가 있으면 어디서든 동작.
Claude Code는 hook stdin으로 JSON을 넘긴다:
  PreToolUse/PostToolUse: { tool_name, tool_input{...}, cwd, session_id, ... }
"""
import json
import os
import sys


def read_event():
    """stdin의 JSON 이벤트를 dict로 반환 (실패 시 빈 dict)."""
    try:
        return json.load(sys.stdin)
    except Exception:
        return {}


def tool_input(event):
    return event.get("tool_input", {}) or {}


def target_path(event):
    ti = tool_input(event)
    return ti.get("file_path") or ti.get("path") or ""


def edited_text(event):
    """이번 편집으로 새로 들어가는 텍스트(Write content / Edit new_string / MultiEdit edits)."""
    ti = tool_input(event)
    parts = []
    if ti.get("content"):
        parts.append(ti["content"])
    if ti.get("new_string"):
        parts.append(ti["new_string"])
    for e in ti.get("edits", []) or []:
        if isinstance(e, dict) and e.get("new_string"):
            parts.append(e["new_string"])
    return "\n".join(parts)


def project_root():
    return os.environ.get("CLAUDE_PROJECT_DIR") or os.getcwd()


def rel_path(path):
    root = project_root().rstrip("/")
    if path.startswith(root + "/"):
        return path[len(root) + 1:]
    return path


def block(msg_lines):
    """exit 2 = 도구 호출 차단. stderr가 Claude에게 전달됨."""
    for line in msg_lines:
        print(line, file=sys.stderr)
    sys.exit(2)


def warn(msg_lines):
    """비차단 경고. stderr는 Claude에게 보이지만 동작은 진행."""
    for line in msg_lines:
        print(line, file=sys.stderr)
    sys.exit(0)


def ok():
    sys.exit(0)
