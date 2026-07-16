'use client';

/**
 * ListingGallery — "Exterior & Interior" estilo Monte: masonry editorial con
 * las primeras fotos + "View all N photos" que abre el lightbox premium.
 */

import { useState } from 'react';
import { Lightbox } from './lightbox';

export default function ListingGallery({ photos, alt, tourHref }: { photos: string[]; alt: string; tourHref: string }) {
  const [lb, setLb] = useState<number | null>(null);
  const shown = photos.slice(0, 9);

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', margin: '3.4rem 0 1.2rem', gap: '1rem', flexWrap: 'wrap' }}>
        <span className="st-eyebrow">Exterior &amp; interior</span>
        <div style={{ display: 'flex', gap: '0.6rem' }}>
          {photos.length > 1 && (
            <button className="st-pill st-pill--dark" onClick={() => setLb(0)} style={{ border: '1px solid var(--st-ink)' }}>
              View all {photos.length} photos
            </button>
          )}
          <a className="st-pill st-pill--solid" href={tourHref} target="_blank" rel="noopener noreferrer">Request tour</a>
        </div>
      </div>

      {photos.length > 1 ? (
        <div style={{ columns: '3 220px', columnGap: '0.9rem' }}>
          {shown.map((p, i) => (
            <button key={p} onClick={() => setLb(i)} aria-label={`Open photo ${i + 1} of ${photos.length}`}
              className="st-skel" style={{ display: 'block', width: '100%', border: 0, padding: 0, marginBottom: '0.9rem', borderRadius: 14, overflow: 'hidden', cursor: 'zoom-in', background: '#e2e2de', breakInside: 'avoid' }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={p} alt={`${alt} — photo ${i + 1}`} loading={i < 2 ? 'eager' : 'lazy'} style={{ width: '100%', display: 'block', transition: 'transform 500ms var(--ease-o)' }}
                onMouseOver={(e) => (e.currentTarget.style.transform = 'scale(1.04)')}
                onMouseOut={(e) => (e.currentTarget.style.transform = 'scale(1)')} />
            </button>
          ))}
          {photos.length > 9 && (
            <button onClick={() => setLb(9)} className="st-pill st-pill--solid" style={{ width: '100%', justifyContent: 'center', padding: '1em', border: 0 }}>
              +{photos.length - 9} more photos
            </button>
          )}
        </div>
      ) : (
        <div style={{ border: '1px dashed var(--st-line)', borderRadius: 18, display: 'grid', placeItems: 'center', color: 'var(--st-grey)', fontSize: '0.85rem', textAlign: 'center', padding: '2.5rem 1rem' }}>
          ◌ Full photo set pending for this listing — request the complete gallery on tour.
        </div>
      )}

      <Lightbox photos={photos} alt={alt} index={lb} onClose={() => setLb(null)} onIndex={setLb} />
    </div>
  );
}
