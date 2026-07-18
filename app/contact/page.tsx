import type { Metadata } from 'next';
import Link from 'next/link';
import { agent } from '@/components/agent-data';
import ContactForm from '@/components/studio/contact-form';
import CursorFX from '@/components/studio/cursor-fx';
import Curtain from '@/components/studio/curtain';
import '../studio.css';

export const metadata: Metadata = {
  title: 'Contact Andrea Larsen — Ocean City NJ Real Estate | BHHS Fox & Roach',
  description:
    'Reach Andrea Larsen: cell 856-448-2229, office (609) 957-6787. Berkshire Hathaway HomeServices Fox & Roach, 730 West Avenue, Ocean City, NJ.',
};

export default function ContactPage() {
  return (
    <main className="st st-light-s" style={{ minHeight: '100vh' }}>
      <CursorFX />
      <Curtain />

      <nav style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1.2rem clamp(1.25rem, 5vw, 6.5rem)' }}>
        <Link href="/" className="st-pill st-pill--dark" data-curtain="Home">← Home</Link>
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <Link href="/properties" className="st-pill st-pill--dark" data-curtain="Properties">Properties</Link>
          <Link href="/about" className="st-pill st-pill--dark" data-curtain="About">About</Link>
        </div>
      </nav>

      {/* el formulario completo del design system */}
      <ContactForm />

      {/* oficina + licencias + horario */}
      <section className="st-section" style={{ paddingTop: '3rem' }}>
        <div className="st-wrap">
          <dl className="st-sheet">
            <div>
              <dt>Office</dt>
              <dd style={{ fontSize: '1rem', fontFamily: 'var(--body)', fontWeight: 400, lineHeight: 1.55, color: '#555' }}>
                {agent.office.name}<br />{agent.office.address}
              </dd>
            </div>
            <div>
              <dt>Direct</dt>
              <dd style={{ fontSize: '1rem', fontFamily: 'var(--body)', fontWeight: 400, lineHeight: 1.55 }}>
                <a href={`tel:${agent.contact.phone.replace(/[^\d]/g, '')}`} style={{ color: 'var(--st-ink)', textDecoration: 'none' }}>Cell — {agent.contact.phone}</a><br />
                <a href={`tel:${agent.office.phone.replace(/[^\d]/g, '')}`} style={{ color: 'var(--st-ink)', textDecoration: 'none' }}>Office — {agent.office.phone}</a><br />
                <a href={`mailto:${agent.contact.email}`} style={{ color: '#4E2A4F', textDecoration: 'none' }}>{agent.contact.email}</a>
              </dd>
            </div>
            <div>
              <dt>Hours</dt>
              <dd style={{ fontSize: '1rem', fontFamily: 'var(--body)', fontWeight: 400, lineHeight: 1.55, color: '#555' }}>
                Showings by appointment,<br />seven days a week.
              </dd>
            </div>
            <div>
              <dt>Licensing</dt>
              <dd style={{ fontSize: '1rem', fontFamily: 'var(--body)', fontWeight: 400, lineHeight: 1.55, color: '#555' }}>
                Licensed in New Jersey,<br />Florida and Arizona.<br />Equal Housing Opportunity.
              </dd>
            </div>
          </dl>

          <a
            href={`https://maps.google.com/?q=${encodeURIComponent(agent.office.address)}`}
            target="_blank" rel="noopener noreferrer"
            className="st-pill st-pill--dark"
            style={{ marginTop: '2.4rem' }}
          >
            Open the office in Google Maps ↗
          </a>
        </div>
      </section>
    </main>
  );
}
