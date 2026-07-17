'use client';

/**
 * ContactForm — formulario de contacto del design system (labels reales,
 * focus visible, AA). Sin backend aún: arma un mailto: al email real de
 * Andrea con el mensaje prellenado + accesos directos de tel/WhatsApp.
 * Para conectar un CRM/endpoint: reemplazar el handler de onSubmit.
 */

import { useState } from 'react';
import { agent } from '@/components/agent-data';
import { properties } from '@/lib/properties';
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

export default function ContactForm() {
  const [sent, setSent] = useState(false);

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    const subject = encodeURIComponent(`Website inquiry — ${f.get('interest') || 'General'}`);
    const body = encodeURIComponent(
      `Name: ${f.get('name')}\nEmail: ${f.get('email')}\nPhone: ${f.get('phone') || '—'}\nInterested in: ${f.get('interest') || 'General'}\n\n${f.get('message')}`,
    );
    window.location.href = `mailto:${agent.contact.email}?subject=${subject}&body=${body}`;
    setSent(true);
  };

  return (
    <section className="st st-light-s st-section" id="contact" style={{ background: '#EDEDEA' }}>
      <div className="st-wrap st-contact-grid" style={{ display: 'grid', gridTemplateColumns: 'minmax(260px, 1fr) minmax(0, 1.4fr)', gap: '3.5rem', alignItems: 'start' }}>
        <Reveal>
          <span className="st-eyebrow">Contact</span>
          <h2 className="st-h2" style={{ margin: '1rem 0 1.4rem' }}>
            <Line i={0}>Tell Andrea</Line>
            <Line i={1}>what <span className="st-it">home</span></Line>
            <Line i={2}>means to you<span className="st-dash">.</span></Line>
          </h2>
          <Fade i={3}>
            <p className="st-body">
              A note about the house you loved, the block you grew up on, or the summer you&apos;re
              planning — she answers personally.
            </p>
            <div style={{ display: 'grid', gap: '0.6rem', marginTop: '2rem', fontSize: '0.9rem' }}>
              <a href={`tel:${agent.contact.phone.replace(/[^\d]/g, '')}`} style={{ color: 'var(--st-ink)', textDecoration: 'none' }}>📞 Cell — {agent.contact.phone}</a>
              <a href={`tel:${agent.office.phone.replace(/[^\d]/g, '')}`} style={{ color: 'var(--st-ink)', textDecoration: 'none' }}>🏢 Office — {agent.office.phone}</a>
              <a href={`https://wa.me/1${agent.contact.phone.replace(/[^\d]/g, '')}`} target="_blank" rel="noopener noreferrer" style={{ color: 'var(--st-ink)', textDecoration: 'none' }}>💬 WhatsApp</a>
              <span style={{ color: 'var(--st-grey)', fontSize: '0.78rem', marginTop: '0.4rem' }}>{agent.office.name} · {agent.office.address}</span>
            </div>
          </Fade>
        </Reveal>

        <Reveal>
          <form onSubmit={onSubmit} style={{ background: '#fff', borderRadius: 22, padding: 'clamp(1.4rem, 3vw, 2.4rem)', border: '1px solid var(--st-line)', display: 'grid', gap: '1.2rem' }}>
            <div className="st-contact-two" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.2rem' }}>
              <div>
                <label htmlFor="cf-name" style={labelCss}>Name</label>
                <input id="cf-name" name="name" required autoComplete="name" placeholder="Your name" style={field} />
              </div>
              <div>
                <label htmlFor="cf-email" style={labelCss}>Email</label>
                <input id="cf-email" name="email" type="email" required autoComplete="email" placeholder="you@email.com" style={field} />
              </div>
            </div>
            <div className="st-contact-two" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.2rem' }}>
              <div>
                <label htmlFor="cf-phone" style={labelCss}>Phone <span style={{ opacity: 0.6 }}>(optional)</span></label>
                <input id="cf-phone" name="phone" type="tel" autoComplete="tel" placeholder="(555) 555-5555" style={field} />
              </div>
              <div>
                <label htmlFor="cf-interest" style={labelCss}>I&apos;m interested in</label>
                <select id="cf-interest" name="interest" style={{ ...field, appearance: 'none' }} defaultValue="">
                  <option value="">General inquiry</option>
                  <option value="Buying at the shore">Buying at the shore</option>
                  <option value="Selling my home">Selling my home</option>
                  {properties.slice(0, 8).map((p) => (
                    <option key={p.slug} value={`${p.address}, ${p.city}`}>{p.address} — {p.priceDisplay}</option>
                  ))}
                </select>
              </div>
            </div>
            <div>
              <label htmlFor="cf-msg" style={labelCss}>Message</label>
              <textarea id="cf-msg" name="message" required rows={5} placeholder="Tell her about the home you're looking for…" style={{ ...field, resize: 'vertical' }} />
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
              <button type="submit" className="st-pill st-pill--solid" style={{ border: 0, padding: '1em 2.2em', fontSize: '0.85rem' }}>
                Send message →
              </button>
              {sent && <span style={{ fontSize: '0.85rem', color: '#4a5d23' }}>✓ Opening your email app — press send there and it&apos;s on its way.</span>}
            </div>
            <p style={{ margin: 0, fontSize: '0.72rem', color: 'var(--st-grey)' }}>
              Sent directly to {agent.contact.email}. {agent.compliance}
            </p>
          </form>
        </Reveal>
      </div>
      <style>{`@media (max-width: 900px){ .st-contact-grid{ grid-template-columns: 1fr !important; } .st-contact-two{ grid-template-columns: 1fr !important; } }
        #contact input:focus, #contact select:focus, #contact textarea:focus { border-color: var(--st-plum); box-shadow: 0 0 0 3px rgba(78,42,79,0.25); }`}</style>
    </section>
  );
}
