# 배포 가이드 (GitHub Pages)

상세 설정은 `.claude/skills/astro-github-pages` 스킬 참고. 여기는 이 프로젝트의 확정값만 기록.

## 이 프로젝트 설정값

- 구조: 모노레포 `Gluming/`의 `docs/`가 Astro 프로젝트. 워크플로우는 리포 루트 `.github/workflows/`.
- 호스팅: GitHub Pages — **Source: GitHub Actions** (기존 "branch /docs"에서 전환)
- 도메인: [채우기 — `<user>.github.io/<repo>` 또는 커스텀 `gluming.com`]
- `docs/astro.config.mjs`:
  - `site`: [채우기]
  - `base`: [채우기 — 프로젝트 페이지면 `/<repo>`, 커스텀 도메인/루트면 `/`]
- 커스텀 도메인이면 `docs/public/CNAME`에 도메인 한 줄

## 기존 docs/index.html 마이그레이션 (1회)

1. (선택) 백업: `mkdir -p ../legacy && git mv docs/index.html ../legacy/` (없애도 git 히스토리에 남음)
2. `docs/`에 Astro 설치: `cd docs && npm create astro@latest .` (빈 템플릿)
3. 리포 루트에 `.github/workflows/deploy.yml` 배치 (제공됨)
4. 리포 Settings → Pages → Source = **GitHub Actions**로 변경
5. `main` push → Actions가 `docs/dist` 배포

## 배포 흐름

1. `main` 브랜치에 push (docs/ 변경 시)
2. `.github/workflows/deploy.yml`가 `working-directory: docs`에서 `npm ci && npm run build`
3. `docs/dist`를 Pages artifact로 업로드 → 배포

## 배포 전 체크

```bash
npm run build && npm run preview   # base 경로에서 링크/자산 안 깨지는지 확인
```

- [ ] 내부 링크가 `base` 경로에서 정상
- [ ] 외부 자산 의존 0 (자가완결)
- [ ] 도메인 금지어 없음
- [ ] Lighthouse 90+

## 무중단 관점

정적 사이트 + 자가완결 자산이라 동적 서버가 없다 → GitHub Pages CDN이 죽지 않는 한 항상 떠 있고,
빌드 산출물 자체가 외부 의존이 없으므로 "백엔드 서버가 꺼져도" 사이트는 영향받지 않는다.
(향후 게시글 API를 붙일 때도, API 실패 시 정적 폴백을 두어 이 성질을 유지할 것.)
