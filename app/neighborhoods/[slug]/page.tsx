import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { neighborhoods, bySlugNb, listingsIn } from '@/lib/neighborhoods';
import { Reveal, Line, Fade } from '@/components/studio/ui';
import CursorFX from '@/components/studio/cursor-fx';
import Curtain from '@/components/studio/curtain';
import '../../studio.css';

export function generateStaticParams() {
  return neighborhoods.map((n) => ({ slug: n.slug }));
}

export function generateMetadata({ params }: { params: { slug: string } }): Metadata {
  const n = bySlugNb(params.slug);
  if (!n) return {};
  return {
    title: `${n.name}, NJ — Neighborhood Guide & Homes for Sale | Andrea Larsen`,
    description: `${n.tagline}. Living in ${n.name}, New Jersey: beaches, lifestyle and current luxury listings with Andrea Larsen, BHHS Fox & Roach.`,
  };
}

export default function NeighborhoodPage({ params }: { params: { slug: string } }) {
  const n = bySlugNb(params.slug);
  if (!n) notFound();
  const homes = listingsIn(n.name);

  return (
    <main className="st st-light-s" style={{ minHeight: '100vh' }}>
      <CursorFX />
      <Curtain />

      <nav style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1.2rem clamp(1.25rem, 5vw, 6.5rem)' }}>
        <Link href="/" className="st-pill st-pill--dark" data-curtain="Home">← Home</Link>
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          {neighborhoods.filter((x) => x.slug !== n.slug).map((x) => (
            <Link key={x.slug} href={`/neighborhoods/${x.slug}`} className="st-pill st-pill--dark">{x.name}</Link>
          ))}
        </div>
      </nav>

      <header className="st-section" style={{ paddingTop: '2.5rem', paddingBottom: '3rem' }}>
        <Reveal>
          <span className="st-eyebrow">Neighborhood guide · {n.tagline}</span>
          <h1 className="st-h1" style={{ margin: '1.2rem 0 1.4rem' }}>
            <Line i={0}>Living in</Line>
            <Line i={1}><span className="st-it">{n.name}.</span></Line>
          </h1>
          <Fade i={2}>
            <p className="st-body" style={{ maxWidth: '62ch' }}>{n.vibe}</p>
          </Fade>
        </Reveal>
      </header>

      <section className="st-mist-s st-section">
        <div className="st-wrap">
          <Reveal>
            <dl className="st-sheet" style={{ borderColor: 'rgba(35,41,44,0.2)' }}>
              {n.bullets.map((b) => (
                <div key={b.k}>
                  <dt style={{ color: '#4a5457' }}>{b.k}</dt>
                  <dd style={{ fontSize: '0.95rem', fontFamily: 'var(--body)', fontWeight: 400, lineHeight: 1.55, color: '#2e373a' }}>{b.d}</dd>
                </div>
              ))}
            </dl>
          </Reveal>
        </div>
      </section>

      {homes.length > 0 && (
        <section className="st-section">
          <Reveal>
            <span className="st-eyebrow">On the market in {n.name} — {homes.length}</span>
            <div className="st-grid-cards" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '2rem 1.6rem', marginTop: '1.6rem' }}>
              {homes.map((p, i) => (
                <Fade key={p.slug} i={i % 3}>
                  <Link href={`/listing/${p.slug}`} className="st-card-l" data-cursor="View →">
                    <div className="ph st-skel" style={{ position: 'relative' }}>
                      <Image src={p.photo} alt={p.address} fill sizes="(max-width: 760px) 92vw, 30vw" style={{ objectFit: 'cover' }} />
                      <span className="badge">{p.status}</span>
                      <span className="arrow" aria-hidden>→</span>
                    </div>
                    <div className="name" style={{ marginTop: '0.9rem' }}>{p.address}</div>
                    <div className="price-row">
                      <span className="price">{p.priceDisplay}</span>
                      <span className="addr">{p.beds ? `${p.beds} bd · ${p.baths} ba` : `${p.lotAcres} ac`}</span>
                    </div>
                  </Link>
                </Fade>
              ))}
            </div>
          </Reveal>
        </section>
      )}

      <section className="st-section" style={{ textAlign: 'center', paddingTop: 0 }}>
        <Reveal>
          <Fade i={0}>
            <Link href="/contact" className="st-pill st-pill--solid" data-curtain="Contact">Ask Andrea about {n.name} →</Link>
          </Fade>
        </Reveal>
      </section>
    </main>
  );
}
