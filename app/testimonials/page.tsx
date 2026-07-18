import type { Metadata } from 'next';
import Link from 'next/link';
import { agent } from '@/components/agent-data';
import { Reveal, Line, Fade } from '@/components/studio/ui';
import CursorFX from '@/components/studio/cursor-fx';
import Curtain from '@/components/studio/curtain';
import '../studio.css';

export const metadata: Metadata = {
  title: 'Client Reviews — Andrea Larsen, Ocean City NJ REALTOR®',
  description:
    'What clients say about working with Andrea Larsen — reviews on Zillow and Google for the Top 1% Jersey Shore agent at BHHS Fox & Roach.',
};

/**
 * Honestidad primero: NO publicamos testimonios inventados. Esta página
 * enlaza a los perfiles de reseñas reales y queda lista para recibir los
 * testimonios verificados (con permiso) cuando el cliente los provea.
 */

const PLATFORMS = [
  { name: 'Zillow reviews', href: 'https://www.zillow.com/profile/andrealarsen', d: 'Verified transaction reviews from buyers and sellers.' },
  { name: 'Google reviews', href: 'https://www.google.com/search?q=Andrea+Larsen+realtor+Ocean+City+NJ+reviews', d: 'What the shore community says.' },
  { name: 'BHHS profile', href: 'https://www.foxroach.com/bio/andrealarsen', d: 'Official Berkshire Hathaway HomeServices Fox & Roach profile.' },
];

export default function TestimonialsPage() {
  return (
    <main className="st st-light-s" style={{ minHeight: '100vh' }}>
      <CursorFX />
      <Curtain />

      <nav style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1.2rem clamp(1.25rem, 5vw, 6.5rem)' }}>
        <Link href="/" className="st-pill st-pill--dark" data-curtain="Home">← Home</Link>
        <Link href="/contact" className="st-pill st-pill--solid" data-curtain="Contact">Work with Andrea</Link>
      </nav>

      <header className="st-section" style={{ paddingTop: '2.5rem' }}>
        <Reveal>
          <span className="st-eyebrow">Client words</span>
          <h1 className="st-h1" style={{ margin: '1.2rem 0 1.4rem' }}>
            <Line i={0}>Don&apos;t take</Line>
            <Line i={1}>our word <span className="st-it">for it.</span></Line>
          </h1>
          <Fade i={2}>
            <p className="st-body">
              Real reviews live where they can&apos;t be edited — on the platforms that verify them.
              Read what buyers and sellers say about working with Andrea:
            </p>
          </Fade>
        </Reveal>
      </header>

      <section className="st-section" style={{ paddingTop: 0 }}>
        <Reveal>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1.4rem', maxWidth: 1000 }}>
            {PLATFORMS.map((p, i) => (
              <Fade key={p.name} i={i}>
                <a href={p.href} target="_blank" rel="noopener noreferrer" style={{ display: 'block', textDecoration: 'none', color: 'inherit', background: '#fff', border: '1px solid var(--st-line)', borderRadius: 20, padding: '1.8rem 1.6rem', height: '100%' }}>
                  <h2 style={{ fontFamily: 'var(--grotesk)', fontWeight: 500, fontStretch: '115%', fontSize: '1.3rem', letterSpacing: '-0.01em', color: '#4E2A4F', margin: '0 0 0.5rem' }}>{p.name} ↗</h2>
                  <p style={{ color: '#555', margin: 0, fontSize: '0.92rem', lineHeight: 1.55 }}>{p.d}</p>
                </a>
              </Fade>
            ))}
          </div>
        </Reveal>
      </section>

      <section className="st-mist-s st-section">
        <div className="st-wrap" style={{ textAlign: 'center' }}>
          <Reveal>
            <Fade i={0}>
              <p className="st-body" style={{ margin: '0 auto 1.8rem', maxWidth: '54ch', color: '#2e373a' }}>
                Worked with Andrea? Your words help the next family find their shore home — and
                featured testimonials (with your permission) will live right here.
              </p>
              <a className="st-pill st-pill--solid" href={`mailto:${agent.contact.email}?subject=${encodeURIComponent('My experience working with Andrea')}`}>
                Share your experience →
              </a>
            </Fade>
          </Reveal>
        </div>
      </section>
    </main>
  );
}
