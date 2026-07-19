import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { allPosts, CATEGORIES } from '@/lib/blog';
import { Reveal, Line, Fade } from '@/components/studio/ui';
import CursorFX from '@/components/studio/cursor-fx';
import Curtain from '@/components/studio/curtain';
import '../studio.css';

export const metadata: Metadata = {
  title: 'The Journal — Jersey Shore Real Estate Insights | Andrea Larsen',
  description:
    'Market updates, neighborhood guides, and straight talk about buying and selling at the Jersey Shore — from Andrea Larsen, BHHS Fox & Roach.',
};

export default function BlogIndex() {
  const posts = allPosts();
  const featured = posts.find((p) => p.featured) || posts[0];
  const rest = posts.filter((p) => p.slug !== featured?.slug);

  return (
    <main className="st st-light-s" style={{ minHeight: '100vh' }}>
      <CursorFX />
      <Curtain />

      <nav style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1.2rem clamp(1.25rem, 5vw, 6.5rem)' }}>
        <Link href="/" className="st-pill st-pill--dark" data-curtain="Home">← Home</Link>
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <Link href="/properties" className="st-pill st-pill--dark" data-curtain="Properties">Properties</Link>
          <Link href="/contact" className="st-pill st-pill--solid" data-curtain="Contact">Contact</Link>
        </div>
      </nav>

      <header className="st-section" style={{ paddingTop: '2.5rem', paddingBottom: '2.5rem' }}>
        <Reveal>
          <span className="st-eyebrow">The Journal</span>
          <h1 className="st-h1" style={{ margin: '1.2rem 0 1.2rem' }}>
            <Line i={0}>Insights from</Line>
            <Line i={1}>the <span className="st-it">shore.</span></Line>
          </h1>
          <Fade i={2}>
            <p className="st-body">
              Market updates, neighborhood guides, and straight talk about buying and selling at the
              Jersey Shore.
            </p>
          </Fade>
          <Fade i={3}>
            <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginTop: '1.8rem' }}>
              <span className="st-pill st-pill--solid" style={{ cursor: 'default' }}>All</span>
              {CATEGORIES.map((c) => (
                <Link key={c.slug} href={`/blog/category/${c.slug}`} className="st-pill st-pill--dark">{c.name}</Link>
              ))}
            </div>
          </Fade>
        </Reveal>
      </header>

      {featured && (
        <section className="st-section" style={{ paddingTop: 0, paddingBottom: '2rem' }}>
          <Reveal>
            <Link href={`/blog/${featured.slug}`} data-cursor="Read →" className="blog-featured" style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1.4fr) minmax(280px, 1fr)', gap: '2.5rem', alignItems: 'center', textDecoration: 'none', color: 'inherit', background: '#fff', border: '1px solid var(--st-line)', borderRadius: 24, overflow: 'hidden' }}>
              <div className="st-skel" style={{ position: 'relative', aspectRatio: '16/10', minHeight: 320 }}>
                <Image src={featured.image} alt={featured.title} fill priority sizes="(max-width: 900px) 100vw, 60vw" style={{ objectFit: 'cover' }} />
              </div>
              <div style={{ padding: '2rem 2.4rem 2rem 0' }}>
                <span style={{ fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '0.14em', color: 'var(--st-grey)' }}>
                  {featured.category} · {featured.dateDisplay}
                </span>
                <h2 style={{ fontFamily: 'var(--grotesk)', fontWeight: 500, fontStretch: '115%', fontSize: 'clamp(1.6rem, 3vw, 2.4rem)', letterSpacing: '-0.02em', color: '#4E2A4F', margin: '0.7rem 0' }}>
                  {featured.title}
                </h2>
                <p style={{ color: '#555', lineHeight: 1.6, fontSize: '0.95rem', margin: '0 0 1.2rem' }}>{featured.excerpt}</p>
                <span style={{ fontWeight: 600, color: '#4E2A4F', fontSize: '0.88rem' }}>Read the article → <span style={{ color: 'var(--st-grey)', fontWeight: 400 }}>· {featured.readMin} min</span></span>
              </div>
            </Link>
          </Reveal>
        </section>
      )}

      <section className="st-section" style={{ paddingTop: 0 }}>
        <Reveal>
          <div className="st-grid-cards" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '2rem 1.6rem' }}>
            {rest.map((p, i) => (
              <Fade key={p.slug} i={i % 3}>
                <Link href={`/blog/${p.slug}`} className="st-card-l" data-cursor="Read →">
                  <div className="ph st-skel" style={{ position: 'relative', aspectRatio: '16/10' }}>
                    <Image src={p.image} alt={p.title} fill sizes="(max-width: 760px) 92vw, 30vw" style={{ objectFit: 'cover' }} />
                    <span className="badge">{p.category}</span>
                  </div>
                  <div className="meta" style={{ marginTop: '0.9rem' }}>{p.dateDisplay} · {p.readMin} min read</div>
                  <div className="name" style={{ color: '#4E2A4F' }}>{p.title}</div>
                </Link>
              </Fade>
            ))}
          </div>
        </Reveal>
      </section>
    </main>
  );
}
