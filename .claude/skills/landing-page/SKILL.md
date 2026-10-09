---
name: landing-page
description: 마케팅 랜딩 페이지의 섹션 구성, 전환 흐름(CTA), 카피 위계, 접근성·성능을 설계·구현할 때 사용. 글루밍 랜딩의 히어로/문제정의/기능/타깃/CTA 구조와 정적 사이트 성능 기준을 다룬다. 새 페이지·섹션을 만들거나 레이아웃·CTA를 바꿀 때 참고.
---

# 랜딩 페이지 설계

## 현재 페이지

`src/pages/`: `index`(홈), `features`, `characters`, `about`, `medical`(근거·출처), `privacy`, `terms`, `shipping`, `404`, `sitemap.xml.ts`.
홈 섹션 순서: hero → trust → story → everyday → problem → habits → features → friends → CTA band (+ 공용 Footer).

## 섹션 흐름 원칙

1. 히어로 — 한 문장 가치제안 + 실제 앱 화면 + 핵심 CTA. "행동 전에 혈당을 미리 시뮬레이션"이라는 thesis가 바로 읽히게 한다.
2. 문제 정의 — CGM 데이터가 행동으로 이어지지 않는 페인포인트(사후 분석의 한계).
3. 해결/기능 — 식사·운동 전 시뮬레이션 등 실제 기능을 앱 화면(`ScreenCard`/`PhoneFrame`) 중심으로.
4. 타깃 적합성 — 세그먼트별 "이런 분께". 웰니스 톤 유지.
5. 신뢰 요소 — 실제로 있는 것만(근거 페이지 `medical`, 사업자 정보 등). 과장하지 않는다.
6. 최종 CTA — 히어로와 같은 액션 반복.
7. 푸터 — 회사 정보, 의료 비대체 고지, 개인정보·약관 링크 (`Footer.astro`에 이미 있음).

게시글(혈당/당뇨 콘텐츠)은 아직 범위가 아니다.

## 전환 설계

- 주요 액션은 앱 다운로드 하나로 통일한다. 버튼은 `StoreButtons.astro`(App Store·Google Play)를 쓰고, 스토어 주소는 `src/lib/links.ts`의 `storeLinks`에서만 가져온다.
- 히어로 CTA는 스크롤 없이 보이게 둔다.
- 버튼 카피는 행동 동사 + 가치.
- 폼 임베드·외부 스크립트는 자가완결 원칙과 충돌하므로 넣기 전에 먼저 상의한다.

## 카피 위계

- 페이지당 H1 1개, 섹션마다 H2, 그 안에 H3.
- 한 섹션 = 한 메시지. 스캔 가능하게 짧게.
- 표현 규칙은 `wellness-content` 스킬, 보이스는 `_guide/brand.md`.

## 접근성 & 성능

- 모든 `<img>`에 `alt`, 장식 이미지는 `alt=""`.
- 색 대비 WCAG AA, 키보드 포커스 가시.
- 이미지 크기를 지정해 CLS를 막는다 (`astro:assets`의 `<Image>`가 처리).
- 자가완결 자산이라 LCP에 유리하다. 이 장점을 첫 화면 이미지에 활용한다.
- JS는 최소로. 지금은 클라이언트 아일랜드(`client:*`)가 없다. 인터랙션이 꼭 필요한 곳에만 추가한다.
- Lighthouse 90+ 목표.

## 디자인 토큰

색·반경·그림자·간격·타이포는 `src/styles/global.css` `:root` 변수를 쓴다(요약과 사용 규칙은 `_guide/brand.md`). 새 하드코딩 값은 넣지 않는다.
