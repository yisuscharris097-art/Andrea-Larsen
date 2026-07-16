import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { properties, bySlug, related, AREA } from '@/lib/properties';
import { agent } from '@/components/agent-data';
import ListingGallery from '@/components/studio/listing-gallery';
import '../../studio.css';

export function generateStaticParams() {
  return properties.map((p) => ({ slug: p.slug }));
}

export function generateMetadata({ params }: { params: { slug: string } }): Metadata {
  const p = bySlug(params.slug);
  if (!p) return {};
  const title = `${p.address}, ${p.city} ${p.state} — ${p.priceDisplay} | Andrea Larsen`;
  const description = `${p.beds ? `${p.beds} bed · ` : ''}${p.baths ? `${p.baths} bath · ` : ''}${p.status} in ${p.city}, ${p.state}. Presented by Andrea Larsen, BHHS Fox & Roach.`;
  return {
    title,
    description,
    openGraph: { title, description, images: [{ url: p.photo }] },
  };
}

export default function ListingPage({ params }: { params: { slug: string } }) {
  const p = bySlug(params.slug);
  if (!p) notFound();

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'RealEstateListing',
    name: `${p.address}, ${p.city}, ${p.state}`,
    url: `https://andrea-larsen.vercel.app/listing/${p.slug}`,
    image: p.photo,
    offers: { '@type': 'Offer', price: p.price, priceCurrency: 'USD', availability: p.status === 'For Sale' ? 'https://schema.org/InStock' : 'https://schema.org/LimitedAvailability' },
    address: { '@type': 'PostalAddress', streetAddress: p.address, addressLocality: p.city, addressRegion: p.state, postalCode: p.zip, addressCountry: 'US' },
  };

  return (
    <main className="st st-light-s" style={{ minHeight: '100vh' }}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      {/* nav mínima */}
      <nav style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1.2rem clamp(1.25rem, 5vw, 6.5rem)' }}>
        <Link href="/" className="st-pill st-pill--dark">← Home</Link>
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <Link href="/properties" className="st-pill st-pill--dark">All properties</Link>
          <a href={agent.contact.calendly} target="_blank" rel="noopener noreferrer" className="st-pill st-pill--solid">Schedule a viewing</a>
        </div>
      </nav>

      {/* breadcrumb */}
      <div style={{ padding: '0 clamp(1.25rem, 5vw, 6.5rem)', fontSize: '0.78rem', color: 'var(--st-grey)' }}>
        <Link href="/properties" style={{ color: 'inherit', textDecoration: 'none' }}>Properties for sale in {p.city}</Link>
        <span aria-hidden> › </span>
        <span style={{ color: 'var(--st-ink)' }}>{p.address}</span>
      </div>

      {/* header Monte: titular / foto / precio+specs */}
      <header className="st-section lst-head" style={{ paddingTop: '2rem', display: 'grid', gridTemplateColumns: 'minmax(220px, 1fr) minmax(0, 1.6fr) minmax(220px, 0.9fr)', gap: '2.5rem', alignItems: 'center' }}>
        <div>
          <span className="st-eyebrow">{p.status} · {p.type}</span>
          <h1 className="st-h2" style={{ margin: '1rem 0 0' }}>
            {p.beds ? `${p.beds} bedroom` : `${p.lotAcres} acre`} {p.type === 'Land' ? 'parcel' : p.type.toLowerCase()} at <span className="st-it">{p.city}</span>
          </h1>
        </div>
        <div style={{ position: 'relative', borderRadius: 24, overflow: 'hidden', aspectRatio: '16/11', background: '#e2e2de' }}>
          <Image src={p.photo} alt={`${p.address}, ${p.city} ${p.state}`} fill priority sizes="(max-width: 900px) 100vw, 55vw" style={{ objectFit: 'cover' }} />
          <a href={`https://maps.google.com/?q=${encodeURIComponent(`${p.address}, ${p.city}, ${p.state} ${p.zip}`)}`} target="_blank" rel="noopener noreferrer" className="st-pill" style={{ position: 'absolute', left: 14, bottom: 14 }}>
            View on map ↗
          </a>
        </div>
        <div>
          <span className="st-eyebrow">Asking price</span>
          <div style={{ fontFamily: 'var(--grotesk)', fontWeight: 500, fontVariantNumeric: 'tabular-nums', fontSize: 'clamp(2rem, 3.6vw, 3.2rem)', letterSpacing: '-0.02em', marginTop: '0.4rem' }}>{p.priceDisplay}</div>
          <div style={{ color: 'var(--st-grey)', margin: '0.4rem 0 1.2rem' }}>{p.address}, {p.city}, {p.state} {p.zip}</div>
          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
            {p.features.map((f) => (
              <span key={f} style={{ border: '1px solid var(--st-line)', borderRadius: 999, padding: '0.45em 1em', fontSize: '0.78rem', background: '#fff' }}>
                <span style={{ color: '#8C6D2F' }}>✓</span> {f}
              </span>
            ))}
          </div>
        </div>
      </header>

      {/* cuerpo: descripción + ficha + entorno | card sticky */}
      <div className="st-section lst-body" style={{ paddingTop: 0, display: 'grid', gridTemplateColumns: 'minmax(0, 1.8fr) minmax(280px, 1fr)', gap: '3.5rem', alignItems: 'start' }}>
        <div>
          <span className="st-eyebrow">Description</span>
          <p className="st-body" style={{ marginTop: '1rem', maxWidth: '68ch' }}>{p.description}</p>
          {p.pendingCopy && (
            <p style={{ fontSize: '0.78rem', color: 'var(--st-grey)', marginTop: '0.6rem' }}>
              ◌ Representative copy — final listing brief pending. Property data from the BHHS Fox &amp; Roach feed.
            </p>
          )}

          <dl className="st-sheet" style={{ marginTop: '3rem' }}>
            <div><dt>Address</dt><dd style={{ fontSize: '1.1rem' }}>{p.address}</dd></div>
            <div><dt>Price</dt><dd className="st-num">{p.priceDisplay}</dd></div>
            {p.beds ? <div><dt>Beds</dt><dd className="st-num">{p.beds}</dd></div> : null}
            {p.baths ? <div><dt>Baths</dt><dd className="st-num">{p.baths}</dd></div> : null}
            {p.sqft ? <div><dt>Sq Ft</dt><dd className="st-num">{p.sqft.toLocaleString('en-US')}</dd></div> : null}
            {p.lotAcres ? <div><dt>Lot</dt><dd className="st-num">{p.lotAcres} ac</dd></div> : null}
            <div><dt>Status</dt><dd style={{ fontSize: '1.1rem' }}>{p.status}</dd></div>
          </dl>

          {/* galería completa (masonry + lightbox) */}
          <ListingGallery photos={p.photos} alt={`${p.address}, ${p.city} ${p.state}`} tourHref={agent.contact.calendly} />

          {/* entorno */}
          <span className="st-eyebrow" style={{ display: 'inline-flex', marginTop: '3.4rem' }}>The area — Ocean City</span>
          <dl className="st-sheet" style={{ marginTop: '1.2rem' }}>
            {AREA.map((a) => (
              <div key={a.key}>
                <dt>{a.key}</dt>
                <dd style={{ fontSize: '0.95rem', fontFamily: 'var(--body)', fontWeight: 400, lineHeight: 1.5, color: '#555' }}>{a.d}</dd>
              </div>
            ))}
          </dl>
        </div>

        {/* Andrea sticky */}
        <aside style={{ position: 'sticky', top: '1.4rem', border: '1px solid var(--st-line)', borderRadius: 20, padding: '1.4rem', background: '#fff' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.9rem' }}>
            <Image src={agent.photo} alt={agent.name} width={56} height={56} style={{ borderRadius: 999, objectFit: 'cover', width: 56, height: 56 }} />
            <div>
              <div style={{ fontFamily: 'var(--grotesk)', fontWeight: 500 }}>{agent.name}</div>
              <div style={{ fontSize: '0.76rem', color: 'var(--st-grey)' }}>{agent.titles[0]} · {agent.rank}</div>
            </div>
          </div>
          <div style={{ display: 'grid', gap: '0.5rem', marginTop: '1.1rem' }}>
            <a className="st-pill st-pill--solid" style={{ justifyContent: 'center' }} href={agent.contact.calendly} target="_blank" rel="noopener noreferrer">Schedule a private viewing</a>
            <a className="st-pill st-pill--dark" style={{ justifyContent: 'center' }} href={`tel:${agent.office.phone.replace(/[^\d]/g, '')}`}>{agent.office.phone}</a>
            <a className="st-pill st-pill--dark" style={{ justifyContent: 'center' }} href={p.detailUrl} target="_blank" rel="noopener noreferrer">Official listing ↗</a>
          </div>
          <p style={{ fontSize: '0.72rem', color: 'var(--st-grey)', lineHeight: 1.5, marginTop: '1rem' }}>
            {agent.office.name} · {agent.office.address}. {agent.compliance}
          </p>
        </aside>
      </div>

      {/* relacionadas */}
      <section className="st-section" style={{ paddingTop: 0 }}>
        <span className="st-eyebrow">More at the shore</span>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '1.6rem', marginTop: '1.4rem' }}>
          {related(p.slug).map((r) => (
            <Link key={r.slug} href={`/listing/${r.slug}`} className="st-card-l">
              <div className="ph" style={{ aspectRatio: '4/3' }}>
                <Image src={r.photo} alt={r.address} width={640} height={480} />
                <span className="badge">{r.status}</span>
              </div>
              <div className="name" style={{ marginTop: '0.8rem' }}>{r.address}</div>
              <div className="price-row"><span className="price">{r.priceDisplay}</span><span className="addr">{r.city}, {r.state}</span></div>
            </Link>
          ))}
        </div>
      </section>

      <style>{`
        @media (max-width: 980px) {
          .lst-head { grid-template-columns: 1fr !important; }
          .lst-body { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </main>
  );
}
