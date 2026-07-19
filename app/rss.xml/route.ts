import { allPosts } from '@/lib/blog';

const BASE = 'https://project-625st.vercel.app';

export function GET() {
  const items = allPosts()
    .map(
      (p) => `    <item>
      <title><![CDATA[${p.title}]]></title>
      <link>${BASE}/blog/${p.slug}</link>
      <guid>${BASE}/blog/${p.slug}</guid>
      <pubDate>${new Date(p.date + 'T12:00:00Z').toUTCString()}</pubDate>
      <category>${p.category}</category>
      <description><![CDATA[${p.excerpt}]]></description>
    </item>`,
    )
    .join('\n');

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0">
  <channel>
    <title>The Journal — Andrea Larsen, Jersey Shore Real Estate</title>
    <link>${BASE}/blog</link>
    <description>Market updates, neighborhood guides, and straight talk about buying and selling at the Jersey Shore.</description>
    <language>en-us</language>
${items}
  </channel>
</rss>`;
  return new Response(xml, { headers: { 'Content-Type': 'application/rss+xml; charset=utf-8' } });
}
