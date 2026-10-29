// 빌드 타임 사이트맵 — 패키지 없이 src/pages/*.astro 목록에서 생성.
// 결과: dist/sitemap.xml (robots.txt 가 가리킴). 혈당 노트 글은 컬렉션에서 lastmod 와 함께 추가.
import type { APIRoute } from 'astro';
import { SITE_URL } from '../lib/seo';
import { getPublishedPosts, isoDate, postPath } from '../lib/blog';

// 실제 서빙 URL(GitHub Pages, build.format=directory)은 트레일링 슬래시 형태 → canonical 과 동일.
const EXCLUDE = new Set(['404', 'features']); // features → /about 으로 이동하는 안내 페이지

const pages = import.meta.glob('./**/*.astro');

function toPath(file: string): string | null {
  const name = file.replace(/^\.\//, '').replace(/\.astro$/, '');
  if (name.startsWith('_') || name.includes('[') || EXCLUDE.has(name)) return null;
  if (name === 'index') return '/';
  return `/${name.replace(/\/index$/, '')}/`;
}

export const GET: APIRoute = async () => {
  const urls = Object.keys(pages)
    .map(toPath)
    .filter((p): p is string => p !== null)
    .sort((a, b) => (a === '/' ? -1 : b === '/' ? 1 : a.localeCompare(b)));
  const posts = await getPublishedPosts();

  const body = [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
    ...urls.map((p) => `  <url><loc>${SITE_URL}${p}</loc></url>`),
    ...posts.map(
      (p) =>
        `  <url><loc>${SITE_URL}${postPath(p)}</loc><lastmod>${isoDate(p.data.updatedDate ?? p.data.publishDate)}</lastmod></url>`
    ),
    '</urlset>',
    '',
  ].join('\n');

  return new Response(body, {
    headers: { 'Content-Type': 'application/xml; charset=utf-8' },
  });
};
