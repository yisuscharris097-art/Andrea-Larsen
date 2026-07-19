/**
 * Home extras — las 6 secciones nuevas del documento, SIN tocar las existentes.
 * Testimonials y JustSold se auto-ocultan hasta que lib/home-sections.ts
 * reciba el contenido real (regla: cero testimonios/ventas inventados).
 */

import Image from 'next/image';
import Link from 'next/link';
import { agent } from '@/components/agent-data';
import { neighborhoods } from '@/lib/neighborhoods';
import { testimonials, justSold, HOW_IT_WORKS, AFFILIATIONS } from '@/lib/home-sections';
import { Reveal, Line, Fade } from './ui';

/* 1 · Testimonials — después de Featured Listings */
export function TestimonialsHome() {
  if (testimonials.length === 0) return null;
  return (
    <section className="st st-light-s st-section" aria-label="Client testimonials">
      <div className="st-wrap">
        <Reveal>
          <span className="st-eyebrow">Client words</span>
          <h2 className="st-h2" style={{ margin: '1rem 0 2.6rem' }}>
            <Line i={0}>They said it</Line>
            <Line i={1}><span className="st-it">better.</span></Line>
          </h2>
        </Reveal>
        <Reveal>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.6rem' }}>
            {testimonials.map((t, i) => (
              <Fade key={t.name} i={i}>
                <figure style={{ margin: 0, background: '#fff', border: '1px solid var(--st-line)', borderRadius: 20, padding: '2rem 1.8rem', height: '100%' }}>
                  <blockquote style={{ margin: 0, fontFamily: 'var(--grotesk)', fontWeight: 500, fontSize: '1.15rem', lineHeight: 1.3, letterSpacing: '-0.01em', color: '#4E2A4F' }}>
                    “{t.quote}”
                  </blockquote>
                  <figcaption style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', marginTop: '1.4rem' }}>
                    {t.photo && <Image src={t.photo} alt={t.name} width={44} height={44} style={{ borderRadius: 999, objectFit: 'cover', width: 44, height: 44 }} />}
                    <div>
                      <div style={{ fontWeight: 600, fontSize: '0.9rem' }}>{t.name}</div>
                      <div style={{ fontSize: '0.78rem', color: 'var(--st-grey)' }}>{t.city}{t.property ? ` · ${t.property}` : ''}</div>
                    </div>
                  </figcaption>
                </figure>
              </Fade>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}

/* 2 · Just Sold — después de Testimonials */
export function JustSold() {
  if (justSold.length === 0) return null;
  return (
    <section className="st st-mist-s st-section" aria-label="Recently sold">
      <div className="st-wrap">
        <Reveal>
          <span className="st-eyebrow" style={{ color: '#4a5457' }}>Just sold</span>
          <h2 className="st-h2" style={{ margin: '1rem 0 2.6rem' }}>
            <Line i={0}>Recently <span className="st-it">closed.</span></Line>
          </h2>
        </Reveal>
        <Reveal>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1.4rem' }}>
            {justSold.map((h, i) => (
              <Fade key={h.address} i={i}>
                <div style={{ background: '#FCFCFA', borderRadius: 18, overflow: 'hidden', border: '1px solid rgba(35,41,44,0.12)' }}>
                  <div style={{ position: 'relative', aspectRatio: '4/3' }}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={h.photo} alt={h.address} loading="lazy" style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
                    <span style={{ position: 'absolute', top: 12, left: 12, background: '#4E2A4F', color: '#fff', borderRadius: 999, padding: '0.4em 1em', fontSize: '0.72rem', fontWeight: 600 }}>SOLD</span>
                  </div>
                  <div style={{ padding: '1rem 1.1rem' }}>
                    <div style={{ fontFamily: 'var(--grotesk)', fontWeight: 500, fontSize: '1.02rem' }}>{h.address}</div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--st-grey)', marginTop: 2 }}>
                      {h.city}{h.salePrice ? ` · Sold ${h.salePrice}` : ''}{h.note ? ` · ${h.note}` : ''}
                    </div>
                  </div>
                </div>
              </Fade>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}

/* 3 · Neighborhoods — después del Flagship */
export function NeighborhoodsHome() {
  return (
    <section className="st st-light-s st-section" aria-label="Neighborhoods">
      <div className="st-wrap">
        <Reveal>
          <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'flex-end', justifyContent: 'space-between', gap: '1.5rem', marginBottom: '2.8rem' }}>
            <div>
              <span className="st-eyebrow">Where she works</span>
              <h2 className="st-h2" style={{ margin: '1rem 0 0' }}>
                <Line i={0}>Six shores,</Line>
                <Line i={1}>one <span className="st-it">agent.</span></Line>
              </h2>
            </div>
          </div>
        </Reveal>
        <Reveal>
          <div className="st-grid-cards" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1.4rem' }}>
            {neighborhoods.map((n, i) => (
              <Fade key={n.slug} i={i % 3}>
                <Link href={`/neighborhoods/${n.slug}`} data-cursor="View →" style={{ display: 'block', textDecoration: 'none', color: 'inherit', background: '#fff', border: '1px solid var(--st-line)', borderRadius: 20, padding: '1.8rem 1.6rem', height: '100%', position: 'relative', overflow: 'hidden' }}>
                  <span aria-hidden style={{ position: 'absolute', right: 8, bottom: -30, fontFamily: 'var(--grotesk)', fontWeight: 500, fontSize: '7rem', lineHeight: 1, color: 'rgba(78,42,79,0.06)' }}>{String(i + 1).padStart(2, '0')}</span>
                  <h3 style={{ fontFamily: 'var(--grotesk)', fontWeight: 500, fontStretch: '115%', fontSize: '1.45rem', letterSpacing: '-0.01em', color: '#4E2A4F', margin: 0 }}>{n.name}</h3>
                  <p style={{ color: 'var(--st-grey)', fontSize: '0.82rem', margin: '0.3rem 0 0.8rem', textTransform: 'uppercase', letterSpacing: '0.08em' }}>{n.tagline}</p>
                  <p style={{ color: '#555', fontSize: '0.9rem', lineHeight: 1.55, margin: 0, display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{n.vibe}</p>
                  <span style={{ display: 'inline-block', marginTop: '1rem', fontSize: '0.82rem', fontWeight: 600, color: '#4E2A4F' }}>Explore {n.name} →</span>
                </Link>
              </Fade>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}

/* 4 · How it works — después de Neighborhoods */
export function HowItWorks() {
  return (
    <section className="st st-mist-s st-section" aria-label="How buying works">
      <div className="st-wrap">
        <Reveal>
          <span className="st-eyebrow" style={{ color: '#4a5457' }}>For buyers</span>
          <h2 className="st-h2" style={{ margin: '1rem 0 2.6rem' }}>
            <Line i={0}>How it</Line>
            <Line i={1}><span className="st-it">works.</span></Line>
          </h2>
        </Reveal>
        <Reveal>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.2rem' }}>
            {HOW_IT_WORKS.map((s, i) => (
              <Fade key={s.t} i={i}>
                <div style={{ background: '#FCFCFA', borderRadius: 18, padding: '1.7rem 1.5rem', height: '100%', border: '1px solid rgba(35,41,44,0.12)', position: 'relative', overflow: 'hidden' }}>
                  <span aria-hidden style={{ position: 'absolute', right: 6, bottom: -26, fontFamily: 'var(--grotesk)', fontWeight: 500, fontSize: '6.5rem', lineHeight: 1, color: 'rgba(35,41,44,0.06)' }}>{String(i + 1).padStart(2, '0')}</span>
                  <h3 style={{ fontFamily: 'var(--grotesk)', fontWeight: 500, fontStretch: '115%', fontSize: '1.15rem', letterSpacing: '-0.01em', color: '#4E2A4F', margin: '0 0 0.5rem' }}>{i + 1}. {s.t}</h3>
                  <p style={{ color: '#555', lineHeight: 1.55, margin: 0, fontSize: '0.9rem' }}>{s.d}</p>
                </div>
              </Fade>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}

/* 5 · Press & Affiliations — después de How it works */
export function PressAwards() {
  return (
    <section className="st st-light-s" aria-label="Affiliations and credentials" style={{ padding: 'clamp(2.5rem, 6vh, 4rem) clamp(1.25rem, 5vw, 6.5rem)', borderTop: '1px solid var(--st-line)', borderBottom: '1px solid var(--st-line)' }}>
      <Reveal>
        <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'center', gap: '1rem 2.6rem' }}>
          {AFFILIATIONS.map((a, i) => (
            <Fade key={a} i={i % 4}>
              <span style={{ fontFamily: 'var(--grotesk)', fontWeight: 500, fontStretch: '115%', fontSize: 'clamp(0.85rem, 1.4vw, 1.05rem)', letterSpacing: '0.06em', textTransform: 'uppercase', color: 'var(--st-grey)', whiteSpace: 'nowrap' }}>
                {a}
              </span>
            </Fade>
          ))}
        </div>
      </Reveal>
    </section>
  );
}

/* 6 · Final CTA banner — última antes del footer */
export function FinalCta() {
  return (
    <section aria-label="Start your search" style={{ position: 'relative', minHeight: '68svh', display: 'grid', placeItems: 'center', overflow: 'hidden' }}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src="/oc/gal/1-leyte-ln/03.jpg" alt="" aria-hidden loading="lazy" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }} />
      <div aria-hidden style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(30,18,30,0.78), rgba(30,18,30,0.35))' }} />
      <Reveal className="st-wrap" >
        <div style={{ position: 'relative', textAlign: 'center', padding: '5rem 1.5rem' }}>
          <span className="st-eyebrow" style={{ color: 'rgba(255,255,255,0.85)', justifyContent: 'center' }}>Ocean City · The Jersey Shore</span>
          <h2 style={{ fontFamily: 'var(--grotesk)', fontWeight: 500, fontStretch: '115%', fontSize: 'clamp(2.6rem, 7vw, 6rem)', lineHeight: 0.98, letterSpacing: '-0.03em', color: '#FCFCFA', margin: '1.2rem 0 1.2rem', textShadow: '0 2px 30px rgba(10,8,10,0.4)' }}>
            <Line i={0}>Your summer</Line>
            <Line i={1}><span className="st-it" style={{ fontWeight: 400 }}>address awaits.</span></Line>
          </h2>
          <Fade i={2}>
            <div style={{ display: 'flex', justifyContent: 'center', gap: '0.8rem', flexWrap: 'wrap', marginTop: '1.6rem' }}>
              <Link href="/properties" className="st-pill" data-curtain="Properties" style={{ background: '#FCFCFA', color: '#4E2A4F', borderColor: '#FCFCFA', fontWeight: 600 }}>Browse the collection</Link>
              <a href={agent.contact.calendly} target="_blank" rel="noopener noreferrer" className="st-pill">Schedule a call</a>
            </div>
          </Fade>
        </div>
      </Reveal>
    </section>
  );
}
