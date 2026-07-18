import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { properties } from '@/lib/properties';
import { Reveal, Line, Fade } from '@/components/studio/ui';
import CursorFX from '@/components/studio/cursor-fx';
import Curtain from '@/components/studio/curtain';
import '../studio.css';

export const metadata: Metadata = {
  title: 'The Collection — Hand-picked Jersey Shore Homes | Andrea Larsen',
  description:
    'Andrea Larsen’s curated collection of Jersey Shore residences — Ocean City, Wildwood Crest, North Wildwood and beyond. $999K to $6M.',
};

export default function CollectionPage() {
  const curated = properties.filter((p) => p.status === 'For Sale');
  const pending = properties.filter((p) => p.status === 'Pending');

  return (
    <main className="st st-light-s" style={{ minHeight: '100vh' }}>
      <CursorFX />
      <Curtain />

      <nav style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1.2rem clamp(1.25rem, 5vw, 6.5rem)' }}>
        <Link href="/" className="st-pill st-pill--dark" data-curtain="Home">← Home</Link>
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <Link href="/properties" className="st-pill st-pill--dark" data-curtain="Properties">Search all</Link>
          <Link href="/contact" className="st-pill st-pill--solid" data-curtain="Contact">Schedule a viewing</Link>
        </div>
      </nav>

      <header className="st-section" style={{ paddingTop: '2.5rem', paddingBottom: '3rem' }}>
        <Reveal>
          <span className="st-eyebrow">The collection · Hand-picked by Andrea</span>
          <h1 className="st-h1" style={{ margin: '1.2rem 0 1.4rem' }}>
            <Line i={0}>Chosen, not</Line>
            <Line i={1}><span className="st-it">listed.</span></Line>
          </h1>
          <Fade i={2}>
            <p className="st-body">
              Every address here is one Andrea would walk a friend through — beach blocks, bayfronts
              and boardwalk-close homes across the Jersey Shore, selected from her active portfolio.
            </p>
          </Fade>
        </Reveal>
      </header>

      {/* disponibles */}
      <section className="st-section" style={{ paddingTop: 0 }}>
        <Reveal>
          <span className="st-eyebrow">Available now — {curated.length} residences</span>
          <div className="st-grid-cards" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '2.4rem 1.8rem', marginTop: '1.6rem' }}>
            {curated.map((p, i) => (
              <Fade key={p.slug} i={i % 3}>
                <Link href={`/listing/${p.slug}`} className="st-card-l" data-cursor="View →">
                  <div className="ph st-skel">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={p.photo} alt={p.address} loading={i < 3 ? undefined : 'lazy'} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
                    <span className="badge">{p.status}</span>
                    <span className="arrow" aria-hidden>→</span>
                  </div>
                  <div className="meta">
                    {p.beds ? <span>{p.beds} Beds · {p.baths} Baths</span> : <span>{p.lotAcres} acres</span>}
                    {p.sqft ? <span>· {p.sqft.toLocaleString('en-US')} sq ft</span> : null}
                  </div>
                  <div className="name">{p.address}</div>
                  <div className="price-row">
                    <span className="price">{p.priceDisplay}</span>
                    <span className="addr">{p.city}, {p.state}</span>
                  </div>
                </Link>
              </Fade>
            ))}
          </div>
        </Reveal>
      </section>

      {/* bajo contrato — prueba social */}
      <section className="st-mist-s st-section">
        <div className="st-wrap">
          <Reveal>
            <span className="st-eyebrow" style={{ color: '#4a5457' }}>Under contract — moving fast</span>
            <h2 className="st-h2" style={{ margin: '1rem 0 2.2rem' }}>
              <Line i={0}>Spoken <span className="st-it">for.</span></Line>
            </h2>
          </Reveal>
          <Reveal>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: '1.4rem' }}>
              {pending.map((p, i) => (
                <Fade key={p.slug} i={i % 4}>
                  <Link href={`/listing/${p.slug}`} style={{ display: 'block', textDecoration: 'none', color: 'inherit', background: '#FCFCFA', borderRadius: 16, overflow: 'hidden', border: '1px solid rgba(35,41,44,0.12)' }} data-cursor="View →">
                    <div style={{ position: 'relative', aspectRatio: '4/3', filter: 'saturate(0.75)' }}>
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={p.photo} alt={p.address} loading="lazy" style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
                    </div>
                    <div style={{ padding: '0.9rem 1rem' }}>
                      <div style={{ fontFamily: 'var(--grotesk)', fontWeight: 500, fontSize: '1rem', letterSpacing: '-0.01em' }}>{p.address}</div>
                      <div style={{ fontSize: '0.8rem', color: 'var(--st-grey)', marginTop: 2 }}>{p.priceDisplay} · Pending</div>
                    </div>
                  </Link>
                </Fade>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      <section className="st-section" style={{ textAlign: 'center' }}>
        <Reveal>
          <Fade i={0}>
            <p className="st-body" style={{ margin: '0 auto 2rem', maxWidth: '52ch' }}>
              Want first word when something new reaches the collection — before it lists publicly?
            </p>
            <Link href="/contact" className="st-pill st-pill--solid" data-curtain="Contact">Get early access →</Link>
          </Fade>
        </Reveal>
      </section>
    </main>
  );
}
