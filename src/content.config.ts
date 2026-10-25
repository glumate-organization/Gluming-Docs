// 콘텐츠 컬렉션 — 빌드 시점에 Markdown 을 읽어 정적 페이지로 만든다 (런타임 의존 0).
//
// 혈당 노트(블로그): src/content/blog/<slug>.md 파일 하나가 글 하나다.
// 파일명이 URL 이 된다 → /blog/<slug>/ (영문 소문자·하이픈 권장, 공유 시 깨지지 않게)
// 작성 가이드: src/content/blog/_TEMPLATE.md (밑줄로 시작하는 파일은 글로 읽지 않는다)
// 이미지: 전부 리포 안 파일을 상대경로로 참조한다 (외부 URL 금지). Astro 가 빌드 시 최적화해 번들한다.
//   - 기존 사진·앱 화면: src/assets/{lifestyle,screens,character}/ → '../../assets/...'
//   - 글 전용(도식 SVG 등): src/content/blog/images/<slug>/ → './images/<slug>/...'
import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

const blog = defineCollection({
  loader: glob({ base: './src/content/blog', pattern: '**/[^_]*.md' }),
  schema: ({ image }) =>
    z
      .object({
        title: z.string().max(60),
        /** 검색결과·목록에 보이는 요약. 80–120자 권장 */
        description: z.string().max(160),
        /** 공개일. 이 날짜가 지나야 빌드에 포함된다 (미래 날짜 = 예약) */
        publishDate: z.coerce.date(),
        updatedDate: z.coerce.date().optional(),
        category: z.enum(['혈당 기초', '식사', '운동', '생활습관']),
        author: z.string().default('글루밍 팀'),
        /** 건강 정보는 근거가 있어야 한다 — 출처 1개 이상 필수 */
        sources: z.array(z.object({ title: z.string(), url: z.url() })).min(1),
        draft: z.boolean().default(false),
        /** 대표 이미지 — 글 상단·목록 썸네일·공유 미리보기(og:image). 가로형 권장 */
        cover: image().optional(),
        /** 대표 이미지 설명 (cover 가 있으면 필수) */
        coverAlt: z.string().optional(),
      })
      .refine((d) => !d.cover || !!d.coverAlt, {
        message: 'cover 를 넣으면 coverAlt 도 필요해요',
        path: ['coverAlt'],
      }),
});

export const collections = { blog };
