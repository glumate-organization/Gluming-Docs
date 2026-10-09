---
name: astro-github-pages
description: Astro 정적 사이트를 GitHub Pages에 배포할 때 사용. astro.config의 site/base 설정, output static, GitHub Actions 워크플로우, base 경로로 인한 링크/자산 깨짐 디버깅을 다룬다. 빌드·배포 설정이나 배포 실패를 다룰 때 참고.
---

# Astro + GitHub Pages

## 현재 설정 (astro.config.mjs)

```js
export default defineConfig({
  site: 'https://gluming.app',
  base: '/',
  output: 'static',
});
```

- 커스텀 도메인이라 `base: '/'`이고, `public/CNAME`에 `gluming.app`이 들어 있다.
- `output: 'static'`이며 SSR 어댑터는 없다.

## base 경로 주의

지금은 `base: '/'`라 `/about` 같은 절대경로 링크가 그대로 동작한다.
커스텀 도메인을 빼고 프로젝트 페이지(`user.github.io/repo/`)로 바꾸면 `base`가 `/repo`가 되어 절대경로 링크가 404가 난다. 그때는 `import.meta.env.BASE_URL`을 붙여야 한다.
`src/assets/`에서 import한 이미지는 Astro가 base를 자동 처리하므로 어느 쪽이든 안전하다.

## 배포 워크플로우 (.github/workflows/deploy.yml)

`docs/`가 곧 리포 루트라 워크플로우도 `docs/.github/workflows/deploy.yml`에 있다.

- 트리거: `main` push, 수동 실행(`workflow_dispatch`)
- 빌드: Node 22 → `npm ci` → `npm run build` (env로 `NTS_API_KEY` 시크릿 주입)
- 업로드: `./dist`를 Pages artifact로 올리고 `actions/deploy-pages`로 배포

리포 Settings → Pages → Source는 GitHub Actions다. `dist/`만 배포되므로 `.claude/`·`_guide/`·`src/`는 공개되지 않고 `.nojekyll`도 필요 없다.

`NTS_API_KEY`는 빌드 시점에 국세청 사업자 상태조회(`src/lib/business.ts`)에 쓰인다. 키가 없거나 호출이 실패해도 배지만 빠지고 빌드는 통과한다. `PUBLIC_` 접두사를 붙이면 클라이언트 번들에 노출되므로 붙이지 않는다.

## 체크리스트

- [ ] `npm run build && npm run preview`로 내부 링크·자산이 깨지지 않는지 확인
- [ ] dist에 외부 URL 의존이 없는지 (hook이 편집 시점에 1차로 막지만 빌드 후에도 점검)
- [ ] `public/CNAME` 유지

`astro.config.mjs`, `package.json`, `.github/workflows/`는 보호 경로라 변경 전에 계획을 제시하고 승인을 받는다.
