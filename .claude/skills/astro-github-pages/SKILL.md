---
name: astro-github-pages
description: Astro 정적 사이트를 GitHub Pages에 배포할 때 사용. astro.config의 site/base 설정, output static, GitHub Actions 워크플로우, base 경로로 인한 링크/자산 깨짐 디버깅을 다룬다. 빌드·배포 관련 작업이면 항상 참고.
---

# Astro + GitHub Pages

## 핵심 설정 (astro.config.mjs)

```js
import { defineConfig } from 'astro/config';

export default defineConfig({
  site: 'https://<user>.github.io',   // 또는 커스텀 도메인 https://gluming.com
  base: '/<repo-name>',                // 프로젝트 페이지면 필수. user.github.io 루트나 커스텀 도메인이면 '/'
  output: 'static',                    // 정적 빌드 (서버 의존 0)
  build: { assets: '_assets' },
});
```

## base 경로 함정 (가장 흔한 버그)

프로젝트 페이지(`user.github.io/repo/`)는 `base`가 `/repo`다. 절대경로 링크/자산이 깨진다.

- ❌ `<a href="/about">` → `/about`로 가서 404
- ✅ `<a href={`${import.meta.env.BASE_URL}about`}>` 또는 Astro의 상대경로 사용
- 이미지 import(`src/assets/`)는 Astro가 base를 자동 처리하므로 안전 → **자가완결 원칙과 일치**
- 커스텀 도메인(`gluming.com`) 쓰면 `base: '/'`로 두고 `public/CNAME`에 도메인 기입

## 배포 워크플로우 (.github/workflows/deploy.yml) — 모노레포

워크플로우는 **리포 루트** `Gluming/.github/workflows/`에 둔다. Astro 프로젝트는 `docs/`이므로
`working-directory: docs`로 빌드하고 `docs/dist`를 업로드한다.

```yaml
name: Deploy to GitHub Pages
on:
  push: { branches: [main], paths: ["docs/**", ".github/workflows/deploy.yml"] }
  workflow_dispatch:
permissions: { contents: read, pages: write, id-token: write }
concurrency: { group: pages, cancel-in-progress: true }
defaults:
  run: { working-directory: docs }
jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with: { node-version: 20, cache: npm, cache-dependency-path: docs/package-lock.json }
      - run: npm ci
      - run: npm run build
      - uses: actions/upload-pages-artifact@v3
        with: { path: docs/dist }     # path는 리포 루트 기준
  deploy:
    needs: build
    runs-on: ubuntu-latest
    environment: { name: github-pages, url: "${{ steps.deployment.outputs.page_url }}" }
    steps:
      - id: deployment
        uses: actions/deploy-pages@v4
```

리포 Settings → Pages → Source를 **GitHub Actions**로 설정. (기존 "Deploy from a branch /docs"에서 전환)
Actions 방식은 `dist/`만 배포하므로 `.nojekyll` 불필요하고, `.claude/`·`_guide/`·`src/`는 공개되지 않는다.

## 체크리스트

- [ ] `output: 'static'` 확인 (SSR 어댑터 없음)
- [ ] `site`/`base` 환경에 맞게 설정
- [ ] 내부 링크/자산이 base 경로에서 안 깨지는지 `npm run build && npm run preview`로 확인
- [ ] dist에 외부 URL 의존이 없는지 (자가완결 hook이 1차로 막지만 빌드 후에도 점검)
- [ ] 커스텀 도메인이면 `public/CNAME` 존재

## 주의

- `astro.config.mjs`, `.github/workflows/`는 **보호 경로**. 변경 전 계획·승인 필요(CLAUDE.md §4).
