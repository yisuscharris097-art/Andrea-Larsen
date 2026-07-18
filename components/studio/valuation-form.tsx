'use client';

/**
 * ValuationForm — lead magnet de /sell: "Get your free home valuation".
 * Mismo patrón que ContactForm (mailto hasta que haya CRM/endpoint).
 */

import { useState } from 'react';
import { agent } from '@/components/agent-data';
import { Reveal, Line, Fade } from './ui';

const field: React.CSSProperties = {
  width: '100%', border: '1px solid var(--st-line)', borderRadius: 14,
  padding: '0.95em 1.15em', fontFamily: 'var(--body)', fontSize: '0.95rem',
  color: 'var(--st-ink)', background: '#fff', outline: 'none',
};
const labelCss: React.CSSProperties = {
  display: 'block', fontSize: '0.72rem', textTransform: 'uppercase',
  letterSpacing: '0.12em', color: 'var(--st-grey)', margin: '0 0 0.5rem 0.2rem',
};

export default function ValuationForm() {
  const [sent, setSent] = useState(false);

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    const subject = encodeURIComponent(`Home valuation request — ${f.get('address')}`);
    const body = encodeURIComponent(
      `Name: ${f.get('name')}\nEmail: ${f.get('email')}\nPhone: ${f.get('phone')}\nProperty: ${f.get('address')}\nType: ${f.get('ptype')}\nOwner's estimate: ${f.get('estimate') || '—'}\nTimeline: ${f.get('timeline')}\n\n${f.get('message') || ''}`,
    );
    window.location.href = `mailto:${agent.contact.email}?subject=${subject}&body=${body}`;
    setSent(true);
  };

  return (
    <section id="valuation" className="st-section" style={{ background: '#EDEDEA' }}>
      <div className="st-wrap st-contact-grid" style={{ display: 'grid', gridTemplateColumns: 'minmax(260px, 1fr) minmax(0, 1.4fr)', gap: '3.5rem', alignItems: 'start' }}>
        <Reveal>
          <span className="st-eyebrow">Free home valuation</span>
          <h2 className="st-h2" style={{ margin: '1rem 0 1.4rem' }}>
            <Line i={0}>What is your</Line>
            <Line i={1}>home <span className="st-it">worth?</span></Line>
          </h2>
          <Fade i={2}>
            <p className="st-body">
              A real valuation from real comparables, prepared personally by Andrea — no obligation,
              no automated guess. Usually ready within 48 hours.
            </p>
          </Fade>
        </Reveal>

        <Reveal>
          <form onSubmit={onSubmit} style={{ background: '#fff', borderRadius: 22, padding: 'clamp(1.4rem, 3vw, 2.4rem)', border: '1px solid var(--st-line)', display: 'grid', gap: '1.2rem' }}>
            <div className="st-contact-two" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.2rem' }}>
              <div>
                <label htmlFor="vf-name" style={labelCss}>Name</label>
                <input id="vf-name" name="name" required autoComplete="name" placeholder="Your name" style={field} />
              </div>
              <div>
                <label htmlFor="vf-email" style={labelCss}>Email</label>
                <input id="vf-email" name="email" type="email" required autoComplete="email" placeholder="you@email.com" style={field} />
              </div>
            </div>
            <div className="st-contact-two" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.2rem' }}>
              <div>
                <label htmlFor="vf-phone" style={labelCss}>Phone</label>
                <input id="vf-phone" name="phone" type="tel" required autoComplete="tel" placeholder="(555) 555-5555" style={field} />
              </div>
              <div>
                <label htmlFor="vf-ptype" style={labelCss}>Property type</label>
                <select id="vf-ptype" name="ptype" style={{ ...field, appearance: 'none' }} defaultValue="House">
                  <option>House</option><option>Condo</option><option>Townhouse</option><option>Multi-unit</option><option>Land</option>
                </select>
              </div>
            </div>
            <div>
              <label htmlFor="vf-address" style={labelCss}>Property address</label>
              <input id="vf-address" name="address" required placeholder="123 Ocean Ave, Ocean City, NJ" style={field} />
            </div>
            <div className="st-contact-two" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.2rem' }}>
              <div>
                <label htmlFor="vf-estimate" style={labelCss}>Your estimate <span style={{ opacity: 0.6 }}>(optional)</span></label>
                <select id="vf-estimate" name="estimate" style={{ ...field, appearance: 'none' }} defaultValue="">
                  <option value="">Not sure</option>
                  <option>Under $1M</option><option>$1M – $2M</option><option>$2M – $4M</option><option>$4M+</option>
                </select>
              </div>
              <div>
                <label htmlFor="vf-timeline" style={labelCss}>Timeline to sell</label>
                <select id="vf-timeline" name="timeline" style={{ ...field, appearance: 'none' }} defaultValue="Just exploring">
                  <option>0–3 months</option><option>3–6 months</option><option>6–12 months</option><option>Just exploring</option>
                </select>
              </div>
            </div>
            <div>
              <label htmlFor="vf-msg" style={labelCss}>Anything else? <span style={{ opacity: 0.6 }}>(optional)</span></label>
              <textarea id="vf-msg" name="message" rows={3} placeholder="Renovations, rental history, special features…" style={{ ...field, resize: 'vertical' }} />
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
              <button type="submit" className="st-pill st-pill--solid" style={{ border: 0, padding: '1em 2.2em', fontSize: '0.85rem' }}>
                Get my free valuation →
              </button>
              {sent && <span style={{ fontSize: '0.85rem', color: '#4a5d23' }}>✓ Opening your email app — press send and Andrea takes it from there.</span>}
            </div>
          </form>
        </Reveal>
      </div>
    </section>
  );
}
