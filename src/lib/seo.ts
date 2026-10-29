// SEO 단일 출처 — 검색엔진 소유 확인 코드 + JSON-LD(구조화 데이터) 빌더.
//
// 자가완결: 모든 값은 빌드 시 HTML에 인라인된다. 외부 스크립트/요청 없음.
// 소유 확인 코드는 공개 HTML에 박히는 값이라 시크릿이 아니다 → 상수로 둔다.
// 값이 빈 문자열이면 Layout이 해당 <meta>를 아예 렌더하지 않는다.

import { companySite, contactEmail, kakaoChannel, storeLinks } from './links';

export const SITE_URL = 'https://gluming.app';
export const SITE_NAME = '글루밍';
export const SITE_NAME_EN = 'Gluming';

/** Google Search Console → URL 접두어 속성 → HTML 태그 방식의 content 값 */
export const GOOGLE_SITE_VERIFICATION = '';
/** 네이버 서치어드바이저 → 사이트 소유확인 → HTML 태그 방식의 content 값 */
export const NAVER_SITE_VERIFICATION = 'f2ffe034ed60d0dba5e9feee879bd5b86592b6a4';

/** 브레드크럼 표시명 — 경로(트레일링 슬래시 제거) → 이름. Nav/Footer 라벨과 동일하게 유지. */
export const pageNames: Record<string, string> = {
  '/program': '프로그램',
  '/business': '기업 도입',
  '/characters': '글루밍즈',
  '/about': '소개',
  '/privacy': '개인정보처리방침',
  '/terms': '서비스 이용약관',
  '/medical': '의료 정보 기준·출처',
  '/shipping': '배송·환불 규정',
  '/blog': '혈당 노트',
};

type JsonLd = Record<string, unknown>;

const ORG_ID = `${SITE_URL}/#organization`;
const SITE_ID = `${SITE_URL}/#website`;
// 회사 사이트(glumate.co.kr)의 Organization 노드와 같은 @id — 검색엔진이 두 사이트를 한 회사로 묶는다.
const COMPANY_ID = `${companySite}#organization`;

/** 운영사 글루메이트. 글루밍 브랜드의 상위 조직이자 앱 배포 주체. */
function companyRef(): JsonLd {
  return {
    '@type': 'Organization',
    '@id': COMPANY_ID,
    name: '글루메이트',
    alternateName: 'GLUMATE',
    url: companySite,
  };
}

/** 운영 주체. 모든 페이지에 포함. */
export function organizationSchema(): JsonLd {
  return {
    '@type': 'Organization',
    '@id': ORG_ID,
    name: SITE_NAME,
    alternateName: SITE_NAME_EN,
    url: SITE_URL,
    logo: `${SITE_URL}/apple-touch-icon.png`,
    email: contactEmail,
    sameAs: [storeLinks.appStore, storeLinks.playStore, kakaoChannel],
    parentOrganization: companyRef(),
  };
}

/** 사이트 자체. 모든 페이지에 포함. */
export function webSiteSchema(): JsonLd {
  return {
    '@type': 'WebSite',
    '@id': SITE_ID,
    name: `${SITE_NAME} ${SITE_NAME_EN}`,
    url: SITE_URL,
    inLanguage: 'ko-KR',
    publisher: { '@id': ORG_ID },
  };
}

/** 개별 페이지. canonical URL·제목·설명을 받아 WebPage 노드 생성. */
export function webPageSchema(url: string, title: string, description: string): JsonLd {
  return {
    '@type': 'WebPage',
    '@id': `${url}#webpage`,
    url,
    name: title,
    description,
    inLanguage: 'ko-KR',
    isPartOf: { '@id': SITE_ID },
    about: { '@id': ORG_ID },
  };
}

/** 홈 > 현재 페이지. 서브페이지에서만 호출. */
export function breadcrumbSchema(url: string, name: string): JsonLd {
  return {
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: '홈', item: `${SITE_URL}/` },
      { '@type': 'ListItem', position: 2, name, item: url },
    ],
  };
}

/**
 * 앱 정보. 홈/기능 페이지에서 `jsonLd` prop으로 전달.
 * ※ aggregateRating·리뷰 수 등 검증되지 않은 수치는 넣지 않는다.
 */
export function mobileAppSchema(): JsonLd {
  return {
    '@type': 'MobileApplication',
    name: SITE_NAME,
    alternateName: SITE_NAME_EN,
    url: SITE_URL,
    operatingSystem: 'iOS, Android',
    applicationCategory: 'HealthApplication',
    inLanguage: 'ko-KR',
    description:
      'CGM(연속혈당측정) 센서 값을 식사·운동 같은 하루 행동과 이어, 행동하기 전에 혈당 흐름을 미리 그려보도록 돕는 혈당 관리 습관 앱.',
    installUrl: [storeLinks.appStore, storeLinks.playStore],
    offers: { '@type': 'Offer', price: '0', priceCurrency: 'KRW' },
    author: { '@id': ORG_ID },
    publisher: companyRef(),
  };
}

/** 홈 > 혈당 노트 > 글. 게시글 페이지에서 `jsonLd` prop으로 전달. */
export function postBreadcrumbSchema(url: string, title: string): JsonLd {
  return {
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: '홈', item: `${SITE_URL}/` },
      { '@type': 'ListItem', position: 2, name: pageNames['/blog'], item: `${SITE_URL}/blog/` },
      { '@type': 'ListItem', position: 3, name: title, item: url },
    ],
  };
}

/** 게시글. 출처는 citation 으로 노출해 건강 정보의 근거를 기계 판독 가능하게 남긴다. */
export function blogPostingSchema(post: {
  url: string;
  title: string;
  description: string;
  published: string;
  modified: string;
  section: string;
  author: string;
  sources: { title: string; url: string }[];
  /** 대표 이미지 절대 URL — 없으면 사이트 기본 og.png */
  image?: string;
}): JsonLd {
  return {
    '@type': 'BlogPosting',
    '@id': `${post.url}#article`,
    mainEntityOfPage: { '@id': `${post.url}#webpage` },
    headline: post.title,
    description: post.description,
    datePublished: post.published,
    dateModified: post.modified,
    articleSection: post.section,
    inLanguage: 'ko-KR',
    image: post.image ?? `${SITE_URL}/og.png`,
    author: { '@type': 'Organization', name: post.author, url: SITE_URL },
    publisher: { '@id': ORG_ID },
    isPartOf: { '@id': SITE_ID },
    citation: post.sources.map((s) => ({ '@type': 'CreativeWork', name: s.title, url: s.url })),
  };
}

/** 여러 노드를 하나의 @graph 문서로 묶어 직렬화. `</script>` 방지용 이스케이프 포함. */
export function serializeJsonLd(nodes: JsonLd[]): string {
  const doc = { '@context': 'https://schema.org', '@graph': nodes };
  return JSON.stringify(doc).replace(/</g, '\\u003c');
}
