# Gluming 웹 — Claude Code 하네스

글루밍 마케팅 랜딩 사이트(Astro · GitHub Pages)를 Claude Code로 개발하기 위한 하네스.
**대화하며 계속 수정하는 것을 전제로 설계됨.**

## 무엇이 들어있나

`Gluming/` 모노레포의 `docs/`(= Astro 프로젝트 = Claude Code 작업 루트)에 들어간다.
워크플로우만 리포 루트 `.github/`에 위치.

```
Gluming/
├── .github/workflows/deploy.yml    # Actions: docs/ 빌드 → Pages 배포 (리포 루트)
├── app/  server/                   # (이 하네스 범위 아님)
└── docs/                           # ★ 작업 루트
    ├── CLAUDE.md                   # 메인 가이드: 원칙·스택·워크플로우
    ├── .claude/
    │   ├── settings.json           # 권한(plan) + hooks 등록
    │   ├── skills/
    │   │   ├── astro-github-pages/  # Astro · GitHub Pages · base 함정 · monorepo 배포
    │   │   ├── self-contained-assets/  # base64 인라인 vs 번들 · 폰트 self-host
    │   │   ├── wellness-content/    # 혈당/당뇨 카피 규칙 · 금지/권장
    │   │   └── landing-page/        # 랜딩 섹션 · 전환 · 접근성/성능
    │   └── hooks/
    │       ├── _util.py             # 공용 JSON 파싱 (표준 라이브러리, jq 불필요)
    │       ├── session-start.py     # 세션마다 가드레일 주입
    │       ├── protect-paths.py     # 보호 경로 차단 (PreToolUse)
    │       ├── external-asset-guard.py  # 외부 자산 차단 = 자가완결 강제 (PreToolUse)
    │       ├── block-dangerous-bash.py  # 위험 bash 차단 (PreToolUse)
    │       └── post-edit-check.py   # 도메인 금지어 경고 (PostToolUse)
    ├── _guide/
    │   ├── brand.md                # 브랜드/톤 (보호 경로) — [채우기]
    │   ├── domain-glossary.md       # 용어·금지어 (보호 경로)
    │   └── deploy.md               # 배포 확정값 + 마이그레이션 절차
    └── (Astro: astro.config.mjs, package.json, src/, public/ — 직접 생성)
```

## 적용 방법

1. zip을 `Gluming/` 리포 루트에 풀기 → `Gluming/docs/`(하네스)와 `Gluming/.github/workflows/deploy.yml`이 배치됨
2. `cd docs && npm create astro@latest .` 로 Astro 설치 (빈 템플릿). `package.json`·`astro.config.mjs`·`src/` 생성
3. `_guide/deploy.md`의 마이그레이션 절차대로 기존 `index.html` 정리 + Pages Source를 **Actions**로 전환
4. `docs/`에서 Claude Code 실행 → SessionStart hook이 가드레일 주입, plan 모드로 시작 (python3 필요, 외부 패키지 없음)

## 동작하는 안전장치 (요약)

| 시점 | hook | 동작 |
|---|---|---|
| 세션 시작 | session-start | 핵심 원칙 3가지 컨텍스트 주입 |
| 파일 편집 전 | protect-paths | 보호 경로면 차단(승인 유도) |
| 파일 편집 전 | external-asset-guard | 외부 이미지/폰트/스크립트 URL이면 차단 |
| bash 실행 전 | block-dangerous-bash | rm -rf·force push·dist 편집 등 차단 |
| 파일 편집 후 | post-edit-check | 의료/금지 표현 감지 시 경고 |

차단(`exit 2`) 시 이유가 Claude에게 전달되어 스스로 고친다.

## 어떻게 수정하나 (대화로)

- **가드레일 너무 빡빡/느슨** → "external-asset-guard에서 X는 예외로 빼줘" / "보호 경로에 Y 추가"
- **금지어 추가** → `_guide/domain-glossary.md` + `post-edit-check.py`의 `BANNED` 함께 갱신 (대화로 요청)
- **새 스킬** → "지금 한 작업을 스킬로 만들어줘"
- **새 hook** → "커밋 전에 빌드 통과 검사하는 hook 추가" 등
- **plan 모드 해제** → `.claude/settings.json`의 `defaultMode` 조정 (보호 경로라 승인 후)

## 직접 테스트

```bash
export CLAUDE_PROJECT_DIR="$(pwd)"
echo '{"tool_input":{"file_path":"src/x.astro","content":"<img src=\"https://cdn/a.png\">"}}' \
  | python3 .claude/hooks/external-asset-guard.py; echo "exit=$?"   # → 2 (차단)
```

## 사업자 진위확인 배지 (빌드 시 새김)

푸터의 "국세청 확인" 배지는 **빌드 시점에** 국세청 공식 API(공공데이터포털 odcloud
`/nts-businessman/v1/status`)로 사업자 상태를 조회해 결과를 HTML에 새긴다.
→ 런타임 외부 의존 0(자가완결), 키는 빌드에서만 쓰여 클라이언트에 노출 안 됨. 결과는 **배포 시점 스냅샷**.

키가 없으면 배지는 그냥 표시되지 않고 빌드는 정상 통과한다(폴백).

**키 발급 & 설정**
1. [공공데이터포털](https://www.data.go.kr/tcs/dss/selectApiDataDetailView.do?publicDataPk=15081808)에서
   "국세청_사업자등록정보 진위확인 및 상태조회 서비스" 활용신청 → 일반 인증키(Decoding) 발급
2. **로컬**: `docs/.env`에 `NTS_API_KEY=발급키` (이미 `.gitignore`로 커밋 제외됨)
3. **배포(CI)**: GitHub 리포 Settings → Secrets → Actions에 `NTS_API_KEY` 추가 +
   `.github/workflows/deploy.yml`의 build 스텝에 `env: NTS_API_KEY: ${{ secrets.NTS_API_KEY }}` 주입
   (워크플로우는 보호 경로 — 변경 시 승인 필요)

구현: `src/lib/business.ts`(조회·캐시·폴백), `src/components/Footer.astro`(배지 렌더)

## 핵심 원칙 (3줄)

1. 자가완결 — 외부 런타임 의존 0, base64/번들만
2. 웰니스 — 의료/진단/치료 표현 0, 1형 비대상
3. plan 먼저 — 변경 전 계획·승인, 보호 경로 엄격
