# Gluming 브랜드 가이드

> 이 파일은 디자인·톤의 단일 출처(single source of truth)다. 색·폰트·문구를 여기서 정하고
> 컴포넌트는 이 토큰을 참조한다. **보호 경로**이므로 변경 전 승인 필요.

## 1. 한 줄 정의

글루밍(Gluming): CGM 데이터를 행동(식사·운동)으로 연결하는 **혈당 관리 습관 보조** 서비스.
핵심 thesis — 사후 분석이 아니라 **행동 전 시뮬레이션**.

## 2. 보이스 & 톤

- 다정하고 친근하게, 자기주도성을 북돋움. 차분한 신뢰감은 유지하되 따뜻함 한 스푼
- 기본 어미는 해요체(`~해요`, `~드릴게요`, `~어떠세요?`). 격식체(`~합니다`)는 법적 문서에만
- 온기는 의성·의태어(차곡차곡·폴짝폴짝·톡·찰칵·살며시)와 부드러운 물음형으로 낸다
- 이모지·이모티콘·`♡`·유아어는 쓰지 않는다. professional-cute, not childish
- 의료/단정 표현 금지 (→ `wellness-content` 스킬, `domain-glossary.md`)
- 공포 마케팅 금지, 과장 금지
- 톤 기준선: `src/pages/characters.astro` 의 글루밍즈 소개글이 현재 최상위 레퍼런스

### 톤을 바꾸지 않는 곳
법적 페이지(`privacy`/`terms`/`medical`/`shipping`), 의료 비대체 고지, 사업자 정보,
alt 텍스트(스크린리더 품질 우선), skip-link. 영문 eyebrow(`01 — Why Gluming` 등)는
에디토리얼 격자를 잡는 장치라 한글화·귀여움 적용 대상이 아니다.

## 3. 컬러 (CSS 변수)

실제 정의는 `src/styles/global.css` `:root`. 아래는 그 요약 — 값이 갈리면 global.css가 우선.

```css
/* 배경 — warm paper */
--bg: #f7f5f0;  --surface: #ffffff;  --card-soft: #efebe3;  --warm: #eee9df;

/* 브랜드 */
--primary: #7bb76c;        /* CTA·인터랙션. 로고 타일 색과 동일 */
--primary-dark: #4f8a49;   --primary-light: #a7d768;   /* 워드마크 연두 */
--primary-bg: #e7efe1;     --primary-tint: #d7e6cd;
--sage: #5c8a57;  --sage-dark: #46703f;  --pine: #2f3d33;  --sand: #c8b89a;

/* 마스코트 팔레트 — 로고에서 직접 샘플링. 캐릭터/로고 조형에만 쓴다 */
--sprout: #99c958;   /* 새싹 잎·줄기 */
--cream:  #fcf5ee;   /* 마스코트 몸 */
--blush:  #fdcec5;   /* 마스코트 볼 */
--ink-warm: #4d2a16; /* 마스코트 눈·입 */

/* 텍스트 — 마스코트 잉크와 같은 계열의 따뜻한 뉴트럴 */
--text: #2e2a24;  --text-2: #6d6659;  --text-3: #9b958a;  --on-dark: #f4f2ec;
```

액센트(coral/gold/dusk/peach/cheek/berry/lavender)와 반경·그림자·타이포·간격 토큰은
global.css 참조. **하드코딩 금지 — 반드시 변수로.**

### 대비 규칙 (중요)
마스코트 몸 `--cream`은 `--bg` 대비가 1.03:1 이라 밝은 배경에 그냥 얹으면 보이지 않는다.
- 밝은 배경 → 마스코트를 `--primary` 라운드 타일 위에 올린다 (`Sprout` 의 `tile` 기본값)
- 어두운 면(`--pine`) → 타일 없이 그대로 (`tile={false}`)
- 워드마크도 원본 연두(#a7d768, 1.48:1) 대신 `--primary`(2.15:1)로 리컬러해 두었다

## 4. 타이포그래피

- 본문: **Pretendard Variable** — self-host (`src/assets/fonts/PretendardVariable.woff2`)
- 라틴 세리프 악센트(영문 eyebrow·숫자): **Fraunces** (`Fraunces-latin.woff2`)
- 외부 CDN 폰트 금지
- 크기는 `--fs-display / --fs-h1 ~ --fs-h4 / --fs-lead / --fs-body / --fs-sm / --fs-xs`
  사다리를 그대로 쓴다. 페이지에서 `clamp()`를 새로 만들지 않는다

## 5. 로고 / 캐릭터 자산

### 로고 (새싹 마스코트 세트) — `src/assets/logo/`
| 파일 | 용도 |
|---|---|
| `full_logo.png` | 가로 락업(초록 타일 아이콘 + 워드마크). 네비·푸터 기본 |
| `full_vertical_logo.png` | 세로 락업(투명) |
| `icon_logo.png` | 마스코트 단독(투명) — 밝은 배경에선 초록 면 위에 |
| `text_logo.png` | 워드마크 전용(투명) |

- 중앙 모듈 `src/lib/assets.ts` 의 `logos` 를 통해서만 import
- 최소 표시 높이 26px (그 아래로는 마스코트 디테일이 뭉갠다)
- 벡터가 필요한 자리(파비콘·장식)는 PNG 대신 `src/components/Sprout.astro` (인라인 SVG).
  `public/favicon.svg` 와 같은 도형이므로 한쪽을 고치면 다른 쪽도 맞춘다
- 파비콘 세트: `public/favicon.svg` · `favicon.png` · `apple-touch-icon.png` · `og.png`

### 캐릭터 (글루밍즈) — `src/assets/character/`
| 디렉터리 키 | 표시명 | 액센트 |
|---|---|---|
| `dodami` | 도디 | `--primary` |
| `lumo` | 루모 | `--dusk` |
| `ppomi` | 보미 | `--peach` |
| `ribuni` | 루코 | `--berry` |

- 표정 상태 6종: `default` `optimal` `lazy` `danger` `happy` `sleep`
- 루코만 코스튬 변형 6종 (`ribuni-costume/`)
- ⚠️ 디렉터리 키와 표시명이 일치하지 않는다 (`ribuni` = 루코, `ppomi` = 보미). 정의는 `assets.ts`

## 6. 사용 규칙

- 모든 색/폰트/간격은 이 문서 기준. 임의값 흩뿌리지 않기
- 이미지·아이콘은 자가완결(인라인/번들), 외부 URL 금지
