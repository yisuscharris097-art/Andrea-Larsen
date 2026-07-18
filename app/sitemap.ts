import type { MetadataRoute } from 'next';
import { properties } from '@/lib/properties';
import { neighborhoods } from '@/lib/neighborhoods';

const BASE = 'https://project-625st.vercel.app';

export default function sitemap(): MetadataRoute.Sitemap {
  const statics = ['', '/properties', '/collection', '/about', '/contact', '/sell', '/testimonials'].map((r) => ({
    url: `${BASE}${r}`,
    changeFrequency: 'weekly' as const,
    priority: r === '' ? 1 : 0.8,
  }));
  const listings = properties.map((p) => ({
    url: `${BASE}/listing/${p.slug}`,
    changeFrequency: 'daily' as const,
    priority: 0.9,
  }));
  const guides = neighborhoods.map((n) => ({
    url: `${BASE}/neighborhoods/${n.slug}`,
    changeFrequency: 'monthly' as const,
    priority: 0.7,
  }));
  return [...statics, ...listings, ...guides];
}
