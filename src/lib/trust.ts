// 신뢰 정보 단일 출처 — 등록·수상·함께한 곳·프로그램 성과.
// /program · /business 가 같은 값을 쓴다. 사실 확인된 것만 넣는다.

/** 등록·수상 이력 — Credentials.astro 가 상패처럼 그린다 */
export const credentials: {
  emblem: 'laurel' | 'shield';
  /** 엠블럼 가운데 글자 */
  mark: string;
  org: string;
  date?: string;
  title: string;
  sub: string;
}[] = [
  {
    emblem: 'laurel',
    mark: '대상',
    org: '대전광역시',
    date: '2026.10',
    title: '장대 웰니스 메이커스 프로그램 대상',
    sub: '대전광역시장상 수상',
  },
  {
    emblem: 'shield',
    mark: '등록',
    org: '국민건강보험공단',
    title: '당뇨병 관리기기 준요양기관',
    sub: '등록업소',
  },
];

/**
 * 글루밍과 함께한 곳. 관계(role)를 반드시 함께 표시한다 —
 * 모든 곳을 "도입 고객"으로 읽히게 묶지 않기 위해서다.
 * 지금은 /business 에 노출하지 않는다(초기엔 빼고 진행). 다시 노출할 땐 섹션만 되살린다.
 * 로고는 각 기관의 사용 허락을 받은 뒤 src/assets 에 넣어 교체한다.
 */
export const partners = [
  { name: '대전광역시', role: '웰니스 프로그램 운영' },
  { name: '(주)프리너', role: '대표·임직원 사용' },
  { name: '(주)아이센스', role: '개발 파트너십' },
  { name: '중소벤처기업진흥공단', role: '청년창업사관학교 선정' },
  { name: '(주)넥시클', role: 'MOU 체결' },
];

/**
 * 장대 웰니스 메이커스 혈당관리 프로그램 성과.
 * ⚠️ 측정·집계가 확인되기 전까지 verified: false 로 둔다.
 *    false 이면 /business 성과 섹션은 개발 서버(npm run dev)에서만 보이고 배포 빌드에는 나오지 않는다.
 *    실제 값과 대상·기간·측정 방법(note)을 채운 뒤 true 로 바꾼다.
 */
export const outcomes: {
  verified: boolean;
  program: string;
  note: string;
  items: { label: string; before: number; after: number; unit: string }[];
} = {
  verified: false,
  program: '장대 웰니스 메이커스 프로그램',
  note: 'TODO: 참여 인원 · 기간 · 측정 방법',
  // TODO: 실제 측정값으로 교체 (아래는 레이아웃 확인용 임시값)
  items: [
    { label: '평균 혈당', before: 112, after: 104, unit: 'mg/dL' },
    { label: '허리둘레', before: 84.9, after: 81.6, unit: 'cm' },
    { label: '체지방률', before: 31.2, after: 29.8, unit: '%' },
  ],
};

/** 공개 페이지에 성과를 렌더해도 되는지 — 검증 전에는 개발 서버에서만 */
export const showOutcomes = outcomes.verified || import.meta.env.DEV;
