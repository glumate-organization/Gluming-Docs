// 혈당 노트(블로그) 공통 헬퍼 — 목록·글·사이트맵·RSS 가 모두 여기서 글을 가져온다.
import { getCollection, type CollectionEntry } from 'astro:content';

export type Post = CollectionEntry<'blog'>;

export const BLOG_TITLE = '혈당 노트';
export const BLOG_DESCRIPTION =
  '식사·운동·생활습관이 혈당 흐름과 어떻게 이어지는지, 근거와 함께 쉽게 풀어 쓴 글루밍의 혈당 노트예요.';

// 본문 금지어 — _guide/domain-glossary.md · .claude/hooks/post-edit-check.py 의 BANNED 와 동기화.
// hook 은 경고만 하지만, 게시글은 공개 전 마지막 관문이 빌드라서 여기서는 빌드를 실패시킨다.
// (비대체 고지는 푸터에 이미 있으므로 본문에는 부정 맥락으로도 쓰지 않는다.)
const BANNED =
  /치료|완치|진단|처방|효능|특효|의약품|약을\s*끊|정상\s*수치를?\s*보장|혈당을?\s*낮춰\s*드립|당뇨에서\s*벗어/;

function assertWellness(post: Post) {
  const lines = `${post.data.title}\n${post.data.description}\n${post.body ?? ''}`.split('\n');
  const hits = lines.filter((l) => BANNED.test(l));
  if (hits.length) {
    throw new Error(
      `[혈당 노트] ${post.id}: 웰니스 금지 표현이 있어요 (_guide/domain-glossary.md 참고)\n` +
        hits.map((h) => `  > ${h.trim()}`).join('\n')
    );
  }
}

/** 공개된 글만, 최신순. draft 이거나 publishDate 가 빌드 시점보다 미래면 제외. */
export async function getPublishedPosts(): Promise<Post[]> {
  const now = Date.now();
  const posts = await getCollection('blog', (p) => !p.data.draft && p.data.publishDate.valueOf() <= now);
  posts.forEach(assertWellness);
  return posts.sort((a, b) => b.data.publishDate.valueOf() - a.data.publishDate.valueOf());
}

export const postPath = (post: Post) => `/blog/${post.id}/`;

/** 2026년 10월 25일 */
export const formatDate = (d: Date) =>
  d.toLocaleDateString('ko-KR', { year: 'numeric', month: 'long', day: 'numeric', timeZone: 'Asia/Seoul' });

/** 2026-10-25 (datetime 속성·JSON-LD 용) */
export const isoDate = (d: Date) => d.toISOString().slice(0, 10);
