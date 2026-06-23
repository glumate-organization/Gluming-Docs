---
name: self-contained-assets
description: 이미지·폰트·아이콘을 외부 서버 의존 없이 처리할 때 사용. base64 data URI 인라인 vs src/assets 번들 판단 기준, 변환 방법, Astro에서의 import 패턴, 자가완결 위반을 피하는 법을 다룬다. 이미지/폰트/정적 자산을 추가·수정할 때 항상 참고.
---

# 자가완결 자산 (Self-contained Assets)

목표: **빌드 결과(dist/)만으로 사이트가 완전히 동작.** 외부 CDN/이미지 서버가 꺼져도 깨지지 않음.

## 판단 기준 (이미지)

| 상황 | 방법 |
|---|---|
| 작은 아이콘·로고·UI 글리프 (~8KB 이하) | **base64 인라인** |
| 첫 화면(LCP) 핵심 이미지인데 작음 | base64 인라인 (네트워크 왕복 제거) |
| 큰 사진·일러스트 | **src/assets/ 번들** (`<Image>`/import) |
| favicon, robots.txt 등 | `public/` |

> base64는 원본보다 ~33% 커지고 캐싱이 안 되므로 큰 파일엔 쓰지 않는다. 큰 파일은 번들해도 dist에 포함되어 GitHub Pages가 함께 서빙 → 외부 의존 0은 동일하게 만족.

## base64 인라인

생성:
```bash
# data URI 한 줄 출력
python3 - <<'PY'
import base64, mimetypes, sys
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

CSS 인라인:
```css
.hero { background-image: url("data:image/webp;base64,...."); }
```

## src/assets 번들 (큰 이미지)

```astro
---
import { Image } from 'astro:assets';
import hero from '../assets/hero.webp';
---
<Image src={hero} alt="..." widths={[400, 800, 1200]} />
```
- Astro가 해시 파일명으로 dist에 출력, base 경로 자동 처리, 포맷 최적화.
- **`<img src="https://...">` 같은 외부 URL은 금지** (hook이 차단).

## 폰트 self-host

1. `.woff2` 파일을 `src/assets/fonts/`에 둠 (구글폰트 등에서 다운로드)
2. `@font-face`로 로컬 참조:
```css
@font-face {
  font-family: "Pretendard";
  src: url("/fonts/Pretendard.woff2") format("woff2");
  font-display: swap;
}
```
- 외부 `<link href="https://fonts.googleapis...">` 금지 (hook이 차단).

## 예외 (허용되는 외부 절대 URL)

렌더링 의존이 아닌 메타데이터는 허용:
- `<meta property="og:image" content="https://gluming.com/og.png">`
- `<link rel="canonical" href="https://gluming.com/...">`
- JSON-LD(`application/ld+json`) 내 URL

이들은 자기 도메인을 가리키는 식별자/공유용이라 사이트 렌더링이 외부 서버에 의존하지 않음.

## 위반 시

`external-asset-guard` hook이 `exit 2`로 차단하고 대안을 안내한다. 막히면 위 방법으로 전환.
