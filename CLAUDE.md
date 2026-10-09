# Gluming 웹사이트 — Claude Code 가이드

글루밍(Gluming) 마케팅 랜딩 사이트(https://gluming.app). Astro 정적 사이트로 빌드해 GitHub Pages에 배포한다.

> 상위 `../CLAUDE.md`는 Gluming 전체(이 사이트 + Flutter 앱 `../gluming` + 서버 `../server`) 공통 지침이다. 이 파일은 웹사이트 전용이다.
> 규칙이 현실과 맞지 않으면 고치기 전에 이 파일을 바꾸자고 먼저 제안한다.

## 핵심 원칙

1. **자가완결**: 런타임에 외부 서버·CDN·API에 의존하지 않는다. `dist/`만으로 사이트가 완전히 동작해야 외부 서비스가 꺼져도 깨지지 않기 때문이다. 이미지·폰트·아이콘은 base64 인라인 또는 `src/assets/` 번들로 둔다. 빌드 시점의 외부 호출(예: `src/lib/business.ts`의 사업자 상태조회)은 결과만 HTML에 박히므로 허용된다. (외부 자산 URL은 hook으로 차단됨)
2. **웰니스 포지셔닝**: 글루밍은 의료기기·진단·치료 서비스가 아니다. 의학적 단정, 진단·치료·완치 표현, 효능 보장 표현을 쓰지 않는다. (금지어는 편집 후 hook이 경고함)
3. **계획 후 변경**: 기본 모드는 plan이다. 코드·설정을 바꾸기 전에 무엇을, 어떤 파일에서, 왜 바꾸는지 제시하고 승인을 받는다.

## 구조

`Gluming/` 자체는 git 리포가 아니고, `docs/`가 독립 리포(`glumate-organization/Gluming-Docs`)다. 커밋·diff는 `docs/` 안에서 한다.

```
docs/                          # 리포 루트 = Astro 프로젝트 = 작업 루트
├── CLAUDE.md / AGENTS.md / .claude/ / _guide/
├── .github/workflows/deploy.yml   # main push → 빌드 → GitHub Pages
├── astro.config.mjs / package.json
├── src/{pages,components,layouts,lib,assets,styles}
├── public/                    # 그대로 복사 (favicon, og.png, CNAME, robots.txt)
├── scripts/gen-favicons.sh
└── dist/                      # 빌드 산출물. 이것만 배포된다
```

- `output: 'static'`, `site: 'https://gluming.app'`, `base: '/'`. 배포 상세는 `astro-github-pages` 스킬.
- 작업은 `docs/` 안에서만 한다. `../gluming`·`../server`는 이 지침의 범위가 아니다.
- 게시글(Content Collections)·서버 연동은 아직 없다. 지금은 정적 페이지만 다룬다.

## 자산 규칙 요약

- 작은 이미지·아이콘(약 8KB 이하)이나 첫 화면 핵심 이미지는 base64 인라인, 큰 이미지는 `src/assets/`에서 import해 번들한다.
- `<img src="https://...">`, CSS `url(https://...)`, 외부 CDN 폰트·스크립트는 쓰지 않는다. 폰트는 self-host한다.
- `og:image`·canonical·JSON-LD 같은 메타데이터 절대 URL은 렌더링 의존이 아니라 허용된다.
- 판단 기준·변환 방법은 `self-contained-assets` 스킬.

## 도메인 가드레일

- 타깃: ① 임신성 당뇨 ② 39–59세 건강검진 트리거 2형/전당뇨 ③ 19–39세 혈당 기반 식단관리 여성. 1형 당뇨는 대상이 아니다.
- 카피는 행동 변화·생활습관·자기관리 보조 관점으로 쓴다. 진단·치료·처방·완치 관점과 검증 안 된 의학 통계·수치는 쓰지 않는다.
- 금지/권장 표현 예시는 `wellness-content` 스킬, 전체 목록은 `_guide/domain-glossary.md`, 톤·색·폰트는 `_guide/brand.md`.

## 변경 워크플로우

1. 계획 제시: 대상 파일, 변경 요지, 이유.
2. 승인 후 편집.
3. 자가검증: 외부 의존이 늘지 않았는지, 도메인 금지어가 없는지, `npm run build`가 통과하는지 확인한다.

보호 경로는 명시적 승인 후에만 편집한다 (hook으로 차단됨):
- `astro.config.mjs`, `package.json`, `package-lock.json`
- `.claude/**` (이 하네스 자체), `.github/workflows/**` (배포 파이프라인)
- `_guide/brand.md`, `_guide/domain-glossary.md`

그 밖에 하지 않는 것:
- `dist/` 직접 수정 (빌드 산출물이라 소스에서 다시 생성된다)
- 시크릿·키를 코드나 커밋에 포함 (`.env`의 `NTS_API_KEY` 등)

## 스킬 인덱스

- `astro-github-pages` — Astro 설정, 정적 빌드, GitHub Pages 배포 워크플로우
- `self-contained-assets` — 이미지 인라인 vs 번들 판단, 폰트 self-host, 변환 스니펫
- `wellness-content` — 혈당·당뇨·헬스케어 카피 규칙, 금지/권장 표현
- `landing-page` — 랜딩 섹션 구성, CTA, 접근성·성능
- `landing-antipattern-review` — "AI가 만든 듯한 랜딩 문법" 20가지 점검 → 승인된 항목만 수정 → 보고

## 자주 쓰는 명령

```bash
npm run dev        # 로컬 개발 서버
npm run build      # 정적 빌드 → dist/
npm run preview    # 빌드 결과 미리보기
```
