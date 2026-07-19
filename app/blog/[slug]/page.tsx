import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { allPosts, postBySlug, relatedPosts } from '@/lib/blog';
import { agent } from '@/components/agent-data';
import ShareButton from '@/components/studio/share-button';
import CursorFX from '@/components/studio/cursor-fx';
import Curtain from '@/components/studio/curtain';
import '../../studio.css';

export function generateStaticParams() {
  return allPosts().map((p) => ({ slug: p.slug }));
}

export function generateMetadata({ params }: { params: { slug: string } }): Metadata {
  const p = postBySlug(params.slug);
  if (!p) return {};
  return {
    title: `${p.title} | Andrea Larsen`,
    description: p.excerpt.slice(0, 158),
    keywords: p.keywords,
    openGraph: { title: p.title, description: p.excerpt.slice(0, 158), images: [{ url: p.image }], type: 'article' },
  };
}

export default function BlogPost({ params }: { params: { slug: string } }) {
  const p = postBySlug(params.slug);
  if (!p) notFound();
  const related = relatedPosts(p);

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: p.title,
    datePublished: p.date,
    image: `https://project-625st.vercel.app${p.image}`,
    author: { '@type': 'Person', name: 'Andrea Larsen', url: 'https://project-625st.vercel.app/about' },
    publisher: { '@type': 'Organization', name: 'Andrea Larsen — Love Living Coast2Coast' },
    description: p.excerpt,
  };

  return (
    <main className="st st-light-s" style={{ minHeight: '100vh' }}>
      <CursorFX />
      <Curtain />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <nav style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1.2rem clamp(1.25rem, 5vw, 6.5rem)' }}>
        <Link href="/blog" className="st-pill st-pill--dark" data-curtain="The Journal">← The Journal</Link>
        <Link href="/contact" className="st-pill st-pill--solid" data-curtain="Contact">Talk to Andrea</Link>
      </nav>

      <article>
        <header className="st-section" style={{ paddingTop: '2.5rem', paddingBottom: '2rem', maxWidth: 1000 }}>
          <span style={{ fontSize: '0.72rem', textTransform: 'uppercase', letterSpacing: '0.14em', color: 'var(--st-grey)' }}>
            {p.category} · {p.dateDisplay} · {p.readMin} min read
          </span>
          <h1 className="st-h2" style={{ margin: '1rem 0 0' }}>{p.title}</h1>
        </header>

        <div style={{ padding: '0 clamp(1.25rem, 5vw, 6.5rem)' }}>
          <div className="st-skel" style={{ position: 'relative', aspectRatio: '21/9', borderRadius: 24, overflow: 'hidden', minHeight: 300 }}>
            <Image src={p.image} alt={p.title} fill priority sizes="100vw" style={{ objectFit: 'cover' }} />
          </div>
        </div>

        <div className="blog-body st-section" style={{ paddingTop: '3rem', maxWidth: 860 }}
          dangerouslySetInnerHTML={{ __html: p.html }} />
      </article>

      {/* newsletter + CTA */}
      <section className="st-section" style={{ paddingTop: 0, maxWidth: 860 }}>
        <div style={{ background: '#EDEDEA', borderRadius: 22, padding: '2.2rem 2rem', display: 'grid', gap: '1rem' }}>
          <span className="st-eyebrow">Stay in the loop</span>
          <p style={{ margin: 0, fontFamily: 'var(--grotesk)', fontWeight: 500, fontStretch: '115%', fontSize: '1.4rem', letterSpacing: '-0.01em', color: '#4E2A4F' }}>
            Get monthly market updates in your inbox.
          </p>
          <div style={{ display: 'flex', gap: '0.6rem', flexWrap: 'wrap' }}>
            <a className="st-pill st-pill--solid" href={`mailto:${agent.contact.email}?subject=${encodeURIComponent('Subscribe me to market updates')}&body=${encodeURIComponent('Hi Andrea — please add me to your monthly Jersey Shore market updates.')}`}>
              Subscribe by email →
            </a>
            <a className="st-pill st-pill--dark" href={agent.contact.calendly} target="_blank" rel="noopener noreferrer">
              Thinking of buying or selling? Schedule a call
            </a>
          </div>
          <div style={{ maxWidth: 240 }}>
            <ShareButton title={p.title} label="Share this article" />
          </div>
        </div>
      </section>

      {/* related */}
      {related.length > 0 && (
        <section className="st-section" style={{ paddingTop: 0 }}>
          <span className="st-eyebrow">Related articles</span>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1.6rem', marginTop: '1.4rem' }}>
            {related.map((r) => (
              <Link key={r.slug} href={`/blog/${r.slug}`} className="st-card-l" data-cursor="Read →">
                <div className="ph st-skel" style={{ position: 'relative', aspectRatio: '16/10' }}>
                  <Image src={r.image} alt={r.title} fill sizes="30vw" style={{ objectFit: 'cover' }} />
                  <span className="badge">{r.category}</span>
                </div>
                <div className="name" style={{ marginTop: '0.8rem', fontSize: '1.1rem', color: '#4E2A4F' }}>{r.title}</div>
              </Link>
            ))}
          </div>
        </section>
      )}
    </main>
  );
}
