import Link from 'next/link';
import './studio.css';

/** 404 con marca — nunca la default de Next. */
export default function NotFound() {
  return (
    <main className="st st-light-s" style={{ minHeight: '100vh', display: 'grid', placeItems: 'center', textAlign: 'center', padding: '2rem' }}>
      <div>
        <span className="st-eyebrow" style={{ justifyContent: 'center' }}>404 — off the map</span>
        <h1 className="st-h1" style={{ margin: '1.2rem 0 1rem' }}>
          This address<br /><span className="st-it">doesn&apos;t exist.</span>
        </h1>
        <p className="st-body" style={{ margin: '0 auto 2.4rem', maxWidth: '44ch' }}>
          Even at the shore, some streets end at the dunes. Let&apos;s get you back to the ones that don&apos;t.
        </p>
        <div style={{ display: 'flex', justifyContent: 'center', gap: '0.8rem', flexWrap: 'wrap' }}>
          <Link href="/" className="st-pill st-pill--solid">Back home</Link>
          <Link href="/properties" className="st-pill st-pill--dark">Browse properties</Link>
        </div>
        <div aria-hidden style={{ overflow: 'hidden', lineHeight: 0, marginTop: '4rem' }}>
          <span className="st-wordmark" style={{ fontSize: 'clamp(4rem, 14vw, 11rem)' }}>andrea</span>
        </div>
      </div>
    </main>
  );
}
