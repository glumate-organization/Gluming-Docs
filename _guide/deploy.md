# 배포 가이드 (GitHub Pages)

워크플로우·설정의 상세는 `.claude/skills/astro-github-pages` 스킬. 여기는 이 프로젝트의 확정값만 기록한다.

## 설정값
- 리포: `docs/`가 곧 리포 루트(별도 git 리포). 워크플로우는 `.github/workflows/deploy.yml`.
- 호스팅: GitHub Pages, Source = GitHub Actions.
- 도메인: `gluming.app` (`public/CNAME`).
- `astro.config.mjs`: `site: 'https://gluming.app'`, `base: '/'`.

## 배포 흐름
1. `main`에 push (또는 수동 `workflow_dispatch`).
2. Node 22에서 `npm ci && npm run build`. 빌드 시 `NTS_API_KEY` 시크릿을 주입한다(사업자 정보 조회, 빌드 타임 전용).
3. `./dist`를 Pages artifact로 올려 배포.

## 배포 전 체크

```bash
npm run build && npm run preview
```

- [ ] 내부 링크·자산이 깨지지 않음
- [ ] 런타임 외부 자산 의존 0 (자가완결)
- [ ] 도메인 금지어 없음
- [ ] Lighthouse 90+

## 무중단 관점
정적 사이트 + 자가완결 자산이라 동적 서버가 없다. GitHub Pages CDN이 살아 있는 한 사이트는 떠 있고, 백엔드 서버가 꺼져도 영향받지 않는다.
나중에 게시글 API 등을 붙이더라도 API 실패 시 정적 폴백을 두어 이 성질을 유지한다.
