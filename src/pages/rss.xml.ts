// 빌드 타임 RSS — 패키지 없이 생성. 네이버 서치어드바이저 'RSS 제출'에 https://gluming.app/rss.xml 을 넣는다.
import type { APIRoute } from 'astro';
import { SITE_URL } from '../lib/seo';
import { BLOG_DESCRIPTION, BLOG_TITLE, getPublishedPosts, postPath } from '../lib/blog';

const esc = (s: string) =>
  s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

export const GET: APIRoute = async () => {
  const posts = await getPublishedPosts();
  const items = posts.map((p) => {
    const link = `${SITE_URL}${postPath(p)}`;
    return [
      '    <item>',
      `      <title>${esc(p.data.title)}</title>`,
      `      <link>${link}</link>`,
      `      <guid isPermaLink="true">${link}</guid>`,
      `      <description>${esc(p.data.description)}</description>`,
      `      <category>${esc(p.data.category)}</category>`,
      `      <pubDate>${p.data.publishDate.toUTCString()}</pubDate>`,
      '    </item>',
    ].join('\n');
  });

  const body = [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">',
    '  <channel>',
    `    <title>${esc(`글루밍 ${BLOG_TITLE}`)}</title>`,
    `    <link>${SITE_URL}/blog/</link>`,
    `    <description>${esc(BLOG_DESCRIPTION)}</description>`,
    '    <language>ko-KR</language>',
    `    <atom:link href="${SITE_URL}/rss.xml" rel="self" type="application/rss+xml" />`,
    ...(posts[0] ? [`    <lastBuildDate>${posts[0].data.publishDate.toUTCString()}</lastBuildDate>`] : []),
    ...items,
    '  </channel>',
    '</rss>',
    '',
  ].join('\n');

  return new Response(body, { headers: { 'Content-Type': 'application/rss+xml; charset=utf-8' } });
};
