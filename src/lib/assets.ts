// 자가완결 에셋 중앙 모듈.
// gluming/assets/ 에서 docs/src/assets/ 로 복사된 이미지를 import 하여 한곳에서 관리한다.
// Astro 가 빌드 시 webp 변환 + 해시 파일명으로 dist/ 에 출력 → GitHub Pages 가 함께 서빙(외부 의존 0).

import type { ImageMetadata } from 'astro';

// ── 로고 (신규 세트) ────────────────────────────────────
import logoHorizontal from '../assets/logo/full_logo.png'; // 가로 락업(아이콘+워드마크)
import logoVertical from '../assets/logo/full_vertical_logo.png'; // 세로 락업
import logoIcon from '../assets/logo/icon_logo.png'; // 심볼 전용
import logoWordmark from '../assets/logo/text_logo.png'; // 워드마크 전용

export const logos = {
  horizontal: logoHorizontal, // 네비/푸터 기본 로고
  vertical: logoVertical, // 히어로/세로 배치용
  icon: logoIcon, // 파비콘/작은 심볼
  wordmark: logoWordmark, // 텍스트 워드마크
};

// ── 캐릭터 (글루밍즈) ───────────────────────────────────
// 표정 상태 6종. 표시명/감정-혈당 매핑은 잠정 — 단정적 의료 표현 금지.
export type CharacterState =
  | 'default'
  | 'optimal'
  | 'lazy'
  | 'danger'
  | 'happy'
  | 'sleep';

import dodamiDefault from '../assets/character/dodami/default.png';
import dodamiOptimal from '../assets/character/dodami/optimal.png';
import dodamiLazy from '../assets/character/dodami/lazy.png';
import dodamiDanger from '../assets/character/dodami/danger.png';
import dodamiHappy from '../assets/character/dodami/happy.png';
import dodamiSleep from '../assets/character/dodami/sleep.png';

import lumoDefault from '../assets/character/lumo/default.png';
import lumoOptimal from '../assets/character/lumo/optimal.png';
import lumoLazy from '../assets/character/lumo/lazy.png';
import lumoDanger from '../assets/character/lumo/danger.png';
import lumoHappy from '../assets/character/lumo/happy.png';
import lumoSleep from '../assets/character/lumo/sleep.png';

import ppomiDefault from '../assets/character/ppomi/default.png';
import ppomiOptimal from '../assets/character/ppomi/optimal.png';
import ppomiLazy from '../assets/character/ppomi/lazy.png';
import ppomiDanger from '../assets/character/ppomi/danger.png';
import ppomiHappy from '../assets/character/ppomi/happy.png';
import ppomiSleep from '../assets/character/ppomi/sleep.png';

import ribuniDefault from '../assets/character/ribuni/default.png';
import ribuniOptimal from '../assets/character/ribuni/optimal.png';
import ribuniLazy from '../assets/character/ribuni/lazy.png';
import ribuniDanger from '../assets/character/ribuni/danger.png';
import ribuniHappy from '../assets/character/ribuni/happy.png';
import ribuniSleep from '../assets/character/ribuni/sleep.png';

export type CharacterKey = 'dodami' | 'lumo' | 'ppomi' | 'ribuni';

export interface CharacterInfo {
  key: CharacterKey;
  name: string; // 표시명 (한국어)
  tagline: string; // 한 줄 소개
  accent: string; // CSS 변수명 (var(--...))
  states: Record<CharacterState, ImageMetadata>;
}

export const characters: CharacterInfo[] = [
  {
    key: 'dodami',
    name: '도담이',
    tagline: '차곡차곡 기록을 도와주는 든든한 친구',
    accent: 'var(--primary)',
    states: {
      default: dodamiDefault,
      optimal: dodamiOptimal,
      lazy: dodamiLazy,
      danger: dodamiDanger,
      happy: dodamiHappy,
      sleep: dodamiSleep,
    },
  },
  {
    key: 'lumo',
    name: '루모',
    tagline: '오늘의 흐름을 환하게 비춰주는 친구',
    accent: 'var(--dusk)',
    states: {
      default: lumoDefault,
      optimal: lumoOptimal,
      lazy: lumoLazy,
      danger: lumoDanger,
      happy: lumoHappy,
      sleep: lumoSleep,
    },
  },
  {
    key: 'ppomi',
    name: '뽀미',
    tagline: '작은 움직임도 함께 응원하는 친구',
    accent: 'var(--peach)',
    states: {
      default: ppomiDefault,
      optimal: ppomiOptimal,
      lazy: ppomiLazy,
      danger: ppomiDanger,
      happy: ppomiHappy,
      sleep: ppomiSleep,
    },
  },
  {
    key: 'ribuni',
    name: '리번이',
    tagline: '옷을 갈아입으며 모으는 재미가 있는 친구',
    accent: 'var(--berry)',
    states: {
      default: ribuniDefault,
      optimal: ribuniOptimal,
      lazy: ribuniLazy,
      danger: ribuniDanger,
      happy: ribuniHappy,
      sleep: ribuniSleep,
    },
  },
];

export const charactersByKey: Record<CharacterKey, CharacterInfo> =
  Object.fromEntries(characters.map((c) => [c.key, c])) as Record<
    CharacterKey,
    CharacterInfo
  >;

// 컨디션 표정 라벨 + 파스텔 배경 (app_colors 상태 색상). 의료 단정 아님 — 표정 톤 설명용.
export const stateMeta: Record<
  CharacterState,
  { label: string; bg: string; fg: string }
> = {
  optimal: { label: '산뜻해요', bg: '#D6F2C2', fg: '#5D9A4F' },
  happy: { label: '신나요', bg: '#FFE27A', fg: '#9A6A00' },
  default: { label: '평온해요', bg: '#E3E7EB', fg: '#6F766D' },
  lazy: { label: '나른해요', bg: '#D8CDF0', fg: '#6E58A8' },
  sleep: { label: '쉬는 중', bg: '#C7D6FF', fg: '#536DCA' },
  danger: { label: '조심조심', bg: '#FFB8A8', fg: '#E07B5A' },
};

export const stateOrder: CharacterState[] = [
  'optimal',
  'happy',
  'default',
  'lazy',
  'sleep',
  'danger',
];

// ── 리번이 코스튬 (수집 요소) ──────────────────────────
import costumeApple from '../assets/character/ribuni-costume/apple.png';
import costumeStrawberry from '../assets/character/ribuni-costume/strawberry.png';
import costumeTulip from '../assets/character/ribuni-costume/tulip.png';
import costumeSunflower from '../assets/character/ribuni-costume/sunflower.png';
import costumeOrange from '../assets/character/ribuni-costume/orange.png';
import costumeCloud from '../assets/character/ribuni-costume/cloud.png';

export const ribuniCostumes: { label: string; img: ImageMetadata }[] = [
  { label: '사과', img: costumeApple },
  { label: '딸기', img: costumeStrawberry },
  { label: '튤립', img: costumeTulip },
  { label: '해바라기', img: costumeSunflower },
  { label: '오렌지', img: costumeOrange },
  { label: '구름', img: costumeCloud },
];

// ── 기능 일러스트 ───────────────────────────────────────
import featSimulation from '../assets/feature/simulation.png';
import featCandy from '../assets/feature/candy.png';
import featCamera from '../assets/feature/camera.png';
import featNotification from '../assets/feature/notification.png';
import featStar from '../assets/feature/star.png';

export const featureImages = {
  simulation: featSimulation,
  candy: featCandy,
  camera: featCamera,
  notification: featNotification,
  star: featStar,
};

// ── 건강 데이터 연동 ────────────────────────────────────
import appleHealth from '../assets/health/apple_health.png';
import healthConnect from '../assets/health/health_connect.png';

export const healthImages = {
  appleHealth,
  healthConnect,
};

// ── 간편 로그인 아이콘 ──────────────────────────────────
import oauthGoogle from '../assets/oauth/google.png';
import oauthApple from '../assets/oauth/apple.png';
import oauthKakao from '../assets/oauth/kakao.png';
import oauthNaver from '../assets/oauth/naver.png';

export const oauthImages = {
  google: oauthGoogle,
  apple: oauthApple,
  kakao: oauthKakao,
  naver: oauthNaver,
};
