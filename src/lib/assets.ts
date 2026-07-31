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
    name: '도디',
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
    name: '보미',
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
    name: '루코',
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

// ── 실제 앱 화면 스크린샷 ───────────────────────────────
// 실제 구동 화면을 그대로 번들한다(외부 의존 0). 개인 이름이 노출된 컷은
// 앱 기본 표기인 "글루밍님"으로 치환한 뒤 저장했다.
// 모두 세로 비율 약 9:19.5 (아이폰 전체 화면).
import screenHomeGreat from '../assets/screens/home-great.png';
import screenHomeGood from '../assets/screens/home-good.png';
import screenHomeHeavy from '../assets/screens/home-heavy.png';
import screenHomeAlert from '../assets/screens/home-alert.png';
import screenHomeSleep from '../assets/screens/home-sleep.png';
import screenSimExercise from '../assets/screens/sim-exercise.png';
import screenLogExercise from '../assets/screens/log-exercise.png';
import screenMealDetect from '../assets/screens/meal-detect.png';
import screenMission from '../assets/screens/mission.png';
import screenReportGlucose from '../assets/screens/report-glucose.png';
import screenReportMeal from '../assets/screens/report-meal.png';
import screenReportMealDetail from '../assets/screens/report-meal-detail.png';
import screenGlucoseDetail from '../assets/screens/glucose-detail.png';
import screenDailyLog from '../assets/screens/daily-log.png';
import screenSensorSetup from '../assets/screens/sensor-setup.png';
import screenOnboarding from '../assets/screens/onboarding.png';

export const screens = {
  homeGreat: screenHomeGreat, // 컨디션 아주 좋음 (노랑)
  homeGood: screenHomeGood, // 리듬이 좋음 (초록)
  homeHeavy: screenHomeHeavy, // 몸이 조금 무거움 (보라)
  homeAlert: screenHomeAlert, // 살펴봐 주세요 (분홍)
  homeSleep: screenHomeSleep, // 쉬는 중 (파랑)
  simExercise: screenSimExercise, // 운동별 예상 변화 비교
  logExercise: screenLogExercise, // 운동 기록 입력
  mealDetect: screenMealDetect, // 사진 음식 인식 + 예상 변화
  mission: screenMission, // 미션 · 포인트
  reportGlucose: screenReportGlucose, // 14일 혈당 리포트
  reportMeal: screenReportMeal, // 14일 식사 리포트
  reportMealDetail: screenReportMealDetail, // 끼니별 상승폭 상세
  glucoseDetail: screenGlucoseDetail, // 하루 혈당 곡선 상세
  dailyLog: screenDailyLog, // 하루 기록 (혈당 곡선 · 걸음 · 물 · 기록 내역)
  sensorSetup: screenSensorSetup, // 센서 연동 안내
  onboarding: screenOnboarding, // 온보딩
};

/** 홈 화면의 컨디션 표정 5종 (표시 순서) */
export const conditionScreens: {
  key: string;
  label: string;
  caption: string;
  img: ImageMetadata;
}[] = [
  {
    key: 'great',
    label: '아주 좋아요',
    caption: '오늘 컨디션 완전 좋아요!',
    img: screenHomeGreat,
  },
  {
    key: 'good',
    label: '좋아요',
    caption: '리듬이 아주 좋아요, 이대로 가요!',
    img: screenHomeGood,
  },
  {
    key: 'heavy',
    label: '조금 무거워요',
    caption: '으.. 몸이 조금 무거워요..',
    img: screenHomeHeavy,
  },
  {
    key: 'alert',
    label: '살펴봐 주세요',
    caption: '지금 좀 위험해요, 살펴봐 주세요..',
    img: screenHomeAlert,
  },
  {
    key: 'sleep',
    label: '쉬는 중',
    caption: '쿨쿨.. 푹 쉬고 있어요',
    img: screenHomeSleep,
  },
];
