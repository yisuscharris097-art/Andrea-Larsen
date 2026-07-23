'use client';

/** ValuationCta — bloque de valuación gratis en la home. Campo de dirección →
 *  /sell#valuation con la dirección precargada. El mejor activo de captación de
 *  sellers, al alcance desde la home (antes solo por el menú). */
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { Reveal, Line, Fade } from './ui';

export default function ValuationCta() {
  const router = useRouter();
  const [addr, setAddr] = useState('');

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const q = addr.trim() ? `?address=${encodeURIComponent(addr.trim())}` : '';
    router.push(`/sell${q}#valuation`);
  };

  return (
    <section className="st st-light-s st-section vcta-section" aria-label="Free home valuation">
      <div className="st-wrap vcta-card">
        <Reveal>
          <span className="st-eyebrow" style={{ color: 'rgba(255,255,255,0.8)' }}>For sellers · Free &amp; no obligation</span>
          <h2 className="st-h2" style={{ color: '#FCFCFA', margin: '1.1rem 0 0' }}>
            <Line i={0}>What is your home</Line>
            <Line i={1}><span className="st-it">worth</span> today?</Line>
          </h2>
        </Reveal>
        <Reveal>
          <Fade i={0}>
            <p className="st-body" style={{ color: 'rgba(255,255,255,0.82)', maxWidth: '46ch', marginTop: '1.2rem' }}>
              A real valuation from real comparables, prepared personally by Andrea — not an automated
              guess. Enter your address to start.
            </p>
          </Fade>
          <Fade i={1}>
            <form className="vcta-form" onSubmit={submit}>
              <input
                value={addr}
                onChange={(e) => setAddr(e.target.value)}
                placeholder="123 Ocean Ave, Ocean City, NJ"
                aria-label="Property address"
                autoComplete="street-address"
              />
              <button type="submit">Value my home →</button>
            </form>
          </Fade>
        </Reveal>
      </div>
    </section>
  );
}
