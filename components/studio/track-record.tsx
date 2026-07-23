'use client';

/** TrackRecord — prueba social por números (volumen, transacciones, días en
 *  mercado, % sobre lista). NÚMEROS ILUSTRATIVOS marcados como SAMPLE hasta que
 *  el cliente entregue las cifras reales de su historial BHHS/MLS — misma regla
 *  honesta que testimonios y just-sold. Editar STATS y quitar sample al tenerlas. */
import { Reveal, Fade, CountUp } from './ui';

const SAMPLE = true; // ← poner false cuando las cifras sean reales y verificadas

const STATS: { to?: number; prefix?: string; suffix?: string; static?: string; label: string }[] = [
  { prefix: '$', to: 180, suffix: 'M+', label: 'In career sales volume' },
  { to: 300, suffix: '+', label: 'Transactions closed' },
  { to: 18, label: 'Avg. days on market' },
  { to: 99, suffix: '%', label: 'Sale-to-list price' },
];

export default function TrackRecord() {
  return (
    <section className="st st-light-s st-section" aria-label="Track record" style={{ paddingTop: 'clamp(2rem, 5vh, 4rem)', paddingBottom: 'clamp(2rem, 5vh, 4rem)' }}>
      <Reveal className="st-wrap">
        <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.9rem', flexWrap: 'wrap', marginBottom: '2rem' }}>
          <span className="st-eyebrow">The track record</span>
          {SAMPLE && (
            <span style={{ fontSize: '0.62rem', fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#8a6d2f', background: '#f3ecdd', border: '1px solid #e6d9bd', borderRadius: 999, padding: '0.3em 0.7em' }}>
              Sample
            </span>
          )}
        </div>
        <div className="st-stats">
          {STATS.map((s, i) => (
            <Fade key={s.label} i={i} className="st-stat" style={{ ['--i' as never]: i }}>
              <div className="v">
                {s.static ? s.static : <CountUp to={s.to as number} prefix={s.prefix} suffix={s.suffix} />}
              </div>
              <div className="l">{s.label}</div>
            </Fade>
          ))}
        </div>
        {SAMPLE && (
          <p style={{ fontSize: '0.76rem', color: 'var(--st-grey)', marginTop: '1.6rem', maxWidth: '60ch' }}>
            ◌ Illustrative figures shown while Andrea&apos;s verified production numbers are compiled from her
            BHHS Fox &amp; Roach record. Exact, current figures available on request.
          </p>
        )}
      </Reveal>
    </section>
  );
}
