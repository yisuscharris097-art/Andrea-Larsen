/**
 * Blog — motor de contenido en markdown local (content/blog/*.md).
 * Sin CMS por ahora (opción "markdown files" del brief) — migrable a Sanity
 * cuando el cliente lo pida: solo se reemplaza este loader.
 * Server-only: usa fs (importar únicamente desde Server Components).
 */

import fs from 'fs';
import path from 'path';

export type Post = {
  slug: string;
  title: string;
  category: string;
  categorySlug: string;
  date: string; // ISO
  dateDisplay: string;
  excerpt: string;
  image: string;
  keywords: string;
  html: string;
  readMin: number;
  featured?: boolean;
};

export const CATEGORIES = [
  { name: 'Buying Guides', slug: 'buying' },
  { name: 'Selling Guides', slug: 'selling' },
  { name: 'Market Updates', slug: 'market-updates' },
  { name: 'Neighborhoods', slug: 'neighborhoods' },
  { name: 'Lifestyle', slug: 'lifestyle' },
];

const DIR = path.join(process.cwd(), 'content', 'blog');

/** Markdown mínimo y controlado (nuestro propio contenido): h2/h3, bold,
 *  itálica, links, listas y párrafos. */
function md(src: string): string {
  const inline = (s: string) =>
    s
      .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
      .replace(/\*([^*]+)\*/g, '<em>$1</em>')
      .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2">$1</a>');

  const blocks = src.trim().split(/\n\s*\n/);
  return blocks
    .map((b) => {
      const t = b.trim();
      if (t.startsWith('### ')) return `<h3>${inline(t.slice(4))}</h3>`;
      if (t.startsWith('## ')) return `<h2>${inline(t.slice(3))}</h2>`;
      if (/^(-\s)/m.test(t)) {
        const items = t.split(/\n/).filter((l) => l.trim().startsWith('- ')).map((l) => `<li>${inline(l.trim().slice(2))}</li>`).join('');
        return `<ul>${items}</ul>`;
      }
      if (/^\d+\.\s/m.test(t)) {
        const items = t.split(/\n/).filter((l) => /^\d+\.\s/.test(l.trim())).map((l) => `<li>${inline(l.trim().replace(/^\d+\.\s/, ''))}</li>`).join('');
        return `<ol>${items}</ol>`;
      }
      return `<p>${inline(t)}</p>`;
    })
    .join('\n');
}

function parse(file: string): Post {
  const raw = fs.readFileSync(path.join(DIR, file), 'utf8');
  const m = raw.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);
  const meta: Record<string, string> = {};
  if (m) {
    m[1].split('\n').forEach((l) => {
      const i = l.indexOf(':');
      if (i > 0) meta[l.slice(0, i).trim()] = l.slice(i + 1).trim().replace(/^"(.*)"$/, '$1');
    });
  }
  const body = m ? m[2] : raw;
  const cat = CATEGORIES.find((c) => c.slug === meta.category) || CATEGORIES[0];
  const words = body.split(/\s+/).length;
  const date = meta.date || '2026-07-01';
  return {
    slug: file.replace(/\.md$/, ''),
    title: meta.title || file,
    category: cat.name,
    categorySlug: cat.slug,
    date,
    dateDisplay: new Date(date + 'T12:00:00Z').toLocaleDateString('en-US', { month: 'long', year: 'numeric' }),
    excerpt: meta.excerpt || '',
    image: meta.image || '/oc/oc-01.jpg',
    keywords: meta.keywords || '',
    html: md(body),
    readMin: Math.max(3, Math.round(words / 220)),
    featured: meta.featured === 'true',
  };
}

export function allPosts(): Post[] {
  if (!fs.existsSync(DIR)) return [];
  return fs
    .readdirSync(DIR)
    .filter((f) => f.endsWith('.md'))
    .map(parse)
    .sort((a, b) => (a.date < b.date ? 1 : -1));
}

export const postBySlug = (slug: string) => allPosts().find((p) => p.slug === slug);
export const postsByCategory = (cat: string) => allPosts().filter((p) => p.categorySlug === cat);
export const relatedPosts = (post: Post, n = 3) =>
  [...postsByCategory(post.categorySlug).filter((p) => p.slug !== post.slug),
   ...allPosts().filter((p) => p.slug !== post.slug && p.categorySlug !== post.categorySlug)].slice(0, n);
