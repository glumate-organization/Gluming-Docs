# Gluming 웹사이트 — Claude Code 가이드

글루밍(Gluming) 마케팅 랜딩 사이트. **Astro** 정적 사이트로 빌드하고 **GitHub Pages**에 배포한다.

> 이 파일은 대화하며 계속 수정한다. 규칙이 현실과 안 맞으면 먼저 바꾸자고 제안할 것.

---

## 0. 가장 중요한 3가지 (모든 작업에서 항상 지킴)

1. **자가완결(self-contained)**: 런타임에 외부 서버/CDN/API에 의존하지 않는다. 빌드 결과(`dist/`)만으로 완전히 동작해야 한다. → 이미지·폰트·아이콘은 base64 인라인 또는 `src/assets/` 번들. 외부 이미지 URL 금지. (hook이 차단함)
2. **웰니스 포지셔닝**: 글루밍은 의료기기·진단·치료 서비스가 **아니다**. 의학적 단정, 진단/치료/완치 표현, 효능 보장 표현을 쓰지 않는다. (hook이 차단함)
3. **plan 먼저**: 기본 모드는 plan. 코드/설정을 바꾸기 전에 (1) 무엇을 (2) 어떤 파일에 (3) 왜 바꾸는지 먼저 제시하고 승인받는다. 보호 경로(아래)는 특히 엄격.

---

## 1. 스택 & 구조 (모노레포)

이 프로젝트는 `Gluming/` 모노레포의 **`docs/`** 안에 있다. Claude Code 작업 루트 = `Gluming/docs/`.

```
Gluming/
├── .github/workflows/deploy.yml   # Actions: docs/ 빌드 → GitHub Pages 배포
├── app/                           # (Flutter — 이 하네스 범위 아님)
├── server/                        # (백엔드 — 이 하네스 범위 아님)
└── docs/                          # ★ Astro 프로젝트 = 여기가 작업 루트
    ├── CLAUDE.md / .claude/ / _guide/
    ├── astro.config.mjs / package.json
    ├── src/{pages,components,layouts,assets,styles,content}
    ├── public/                    # 그대로 복사 (favicon 등). 큰 이미지는 지양
    └── dist/                      # 빌드 산출물 — 이것만 배포됨 (.claude 등은 노출 안 됨)
```

- **Astro** 정적 빌드 (`output: 'static'`). `docs/`에서 `npm run build` → `docs/dist/`.
- 배포: **GitHub Pages = Actions 방식** (branch /docs 직접 서빙 아님). `dist/`만 올라가므로 하네스 파일은 공개되지 않음.
- `app/`·`server/`는 건드리지 않는다. 작업은 `docs/` 안에서만.
- `site`/`base` 설정값은 `_guide/deploy.md` 참고.
- 향후: 혈당/당뇨 게시글은 Astro **Content Collections**(`src/content/`)로 추가. 서버 연동은 그 이후 — **지금은 정적 랜딩만**.

> 기존 `docs/index.html`(수작업 페이지)은 새 Astro 사이트로 **완전 대체**한다. 필요 시 `legacy/`로 백업(git 히스토리에도 남음).

## 2. 자가완결 자산 규칙 (핵심)

- **작은 이미지/아이콘/로고(약 8KB 이하), LCP에 중요한 첫 화면 이미지** → **base64 data URI 인라인**. 네트워크 왕복 제거 + 외부 의존 0.
- **큰 이미지** → `src/assets/`에 두고 Astro `<Image />`/import로 번들. dist에 해시 파일로 포함되어 GitHub Pages가 함께 서빙 → 외부 서버 불필요.
- **금지**: `<img src="https://...">`, CSS `url(https://...)`, 외부 CDN 폰트 `<link>` (폰트는 self-host).
- **예외(허용)**: `<meta property="og:image">`, `<link rel="canonical">` 등 메타데이터의 절대 URL은 자기 도메인을 가리키는 것이라 렌더링 의존이 아님 → 허용. (hook 예외 처리됨)
- 자세한 변환/판단 기준: `.claude/skills/self-contained-assets/`

## 3. 도메인 가드레일 (혈당 / 당뇨 / 헬스케어)

- 타깃: ① 임신성 당뇨 ② 39–59세 건강검진 트리거 2형/전당뇨 ③ 19–39세 혈당 기반 식단관리 여성. **1형 당뇨는 대상 아님.**
- 카피·콘텐츠는 **행동 변화/생활습관/자기관리 보조** 관점. **진단·치료·처방·완치** 관점 금지.
- 금지 표현 예: "당뇨를 치료/완치", "혈당을 정상화시켜 드립니다", "약 없이 낫는다", "진단", "처방", 특정 수치 보장.
- 권장 표현 예: "혈당 패턴을 미리 시뮬레이션", "식사·운동 전에 예측을 참고", "생활습관 관리를 돕는".
- 용어·금지어 전체 목록: `_guide/domain-glossary.md`
- 톤·브랜드: `_guide/brand.md`

## 4. 워크플로우 (변경 3단계)

코드/설정 변경 시 항상:
1. **계획 제시**: 대상 파일 + 변경 요지 + 이유. (plan 모드)
2. **승인 대기**: 보호 경로는 명시적 OK 없이는 편집 금지.
3. **변경 후 자가검증**: 외부 의존 추가 안 됐는지, 도메인 금지어 없는지, 빌드 깨지지 않는지 확인.

### 보호 경로 (수정 전 반드시 승인)
- `astro.config.mjs`, `package.json`, `package-lock.json`
- `.claude/**` (이 하네스 자체)
- `_guide/brand.md`, `_guide/domain-glossary.md`
- 리포 루트 `../.github/workflows/**` (배포 파이프라인) — `docs/` 밖이라 hook으로는 못 막으니 **특히 수동 주의**

## 5. 스킬 인덱스

- `astro-github-pages` — Astro 설정, 정적 빌드, GitHub Pages 배포(`base` 경로 함정 포함)
- `self-contained-assets` — 이미지 base64 인라인 vs 번들 판단, 변환 스니펫
- `wellness-content` — 혈당/당뇨/헬스케어 카피 작성 규칙, 금지/권장 표현
- `landing-page` — 랜딩 페이지 섹션 구성, 전환 설계, 접근성/성능

## 6. 절대 하지 않는 것

- 외부 이미지/폰트/스크립트 런타임 의존 추가
- 의료·진단·치료·완치·효능 보장 표현
- 승인 없이 보호 경로 편집
- `dist/`를 직접 수정 (빌드 산출물)
- 시크릿/키를 코드·커밋에 포함
- 검증 안 된 의학 통계·수치를 카피에 사용

## 7. 자주 쓰는 명령

```bash
npm run dev        # 로컬 개발 서버
npm run build      # 정적 빌드 → dist/
npm run preview    # 빌드 결과 미리보기
```
