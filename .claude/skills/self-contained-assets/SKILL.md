---
name: self-contained-assets
description: 이미지·폰트·아이콘을 외부 서버 의존 없이 처리할 때 사용. base64 data URI 인라인 vs src/assets 번들 판단 기준, 변환 방법, Astro에서의 import 패턴, 자가완결 위반을 피하는 법을 다룬다. 이미지/폰트/정적 자산을 추가·수정할 때 참고.
---

# 자가완결 자산 (Self-contained Assets)

목표: 빌드 결과(`dist/`)만으로 사이트가 완전히 동작해, 외부 CDN·이미지 서버가 꺼져도 깨지지 않게 한다.

## 판단 기준 (이미지)

| 상황 | 방법 |
|---|---|
| 작은 아이콘·로고·UI 글리프 (~8KB 이하) | base64 인라인 |
| 첫 화면(LCP) 핵심 이미지인데 작음 | base64 인라인 (네트워크 왕복 제거) |
| 큰 사진·일러스트·앱 화면 | `src/assets/` 번들 (`<Image>`/import) |
| favicon, robots.txt, og.png, CNAME | `public/` |

base64는 원본보다 약 33% 커지고 따로 캐싱되지 않으므로 큰 파일에는 쓰지 않는다. 번들한 파일도 dist에 포함되어 GitHub Pages가 함께 서빙하므로 외부 의존 0은 똑같이 지켜진다.

## base64 인라인

생성:
```bash
python3 - <<'PY'
import base64, mimetypes
p = "src/assets/logo.svg"
mime = mimetypes.guess_type(p)[0] or "application/octet-stream"
print(f"data:{mime};base64," + base64.b64encode(open(p,'rb').read()).decode())
PY
```

Astro에서 사용:
```astro
---
const logo = "data:image/svg+xml;base64,PHN2Zy4uLg==";
---
<img src={logo} alt="Gluming" width="120" height="32" />
```

CSS 인라인 (`global.css`의 `--grain`이 이 방식):
```css
.hero { background-image: url("data:image/webp;base64,...."); }
```

## src/assets 번들 (큰 이미지)

```astro
---
import { Image } from 'astro:assets';
import { logos } from '../lib/assets';
---
<Image src={logos.horizontal} alt="글루밍" />
```

- 로고·캐릭터·앱 화면 이미지는 `src/lib/assets.ts`에서 한곳에 import해 내보낸다. 새 이미지도 이 모듈에 추가해 쓴다.
- Astro가 해시 파일명으로 dist에 출력하고 base 경로와 포맷 최적화를 처리한다.

## 폰트 self-host

폰트 파일은 `src/assets/fonts/`에 두고 `src/styles/global.css`의 `@font-face`에서 상대경로로 참조한다 (현재 Pretendard Variable, Fraunces).

```css
@font-face {
  font-family: "Pretendard Variable";
  src: url("../assets/fonts/PretendardVariable.woff2") format("woff2");
  font-display: swap;
}
```

## 허용되는 외부 절대 URL

렌더링 의존이 아닌 메타데이터·링크는 허용된다:
- `<meta property="og:image" content="https://gluming.app/og.png">`
- `<link rel="canonical" href="https://gluming.app/...">`
- JSON-LD(`application/ld+json`) 내 URL
- 사용자가 클릭해 이동하는 `<a href>` (스토어 링크, `medical` 페이지 출처 등)

## hook 동작

`external-asset-guard` hook이 외부 이미지 `src`/`href`, CSS `url(https://...)`, 외부 CDN·폰트 `<link>`, 외부 `<script src>`를 편집 시점에 차단하고 대안을 안내한다. 막히면 위 방법으로 바꾼다.
