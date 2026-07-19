'use client';

/** ListingMap — mapa de ubicación en la ficha de propiedad (PDP).
 *  Lazy (inicia al entrar al viewport), pin custom plum, popup con dirección,
 *  y CTA "Get directions" a Google Maps. Gestos cooperativos para no
 *  secuestrar el scroll de la página. */
import { useEffect, useRef } from 'react';
import type { Map as MLMap } from 'maplibre-gl';
import { createShoreMap, whenVisible, type GeoPoint } from './map-core';

export default function ListingMap({ geo, address, city, state, zip, status }: {
  geo: GeoPoint;
  address: string;
  city: string;
  state: string;
  zip: string;
  status: string;
}) {
  const boxRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<MLMap | null>(null);

  useEffect(() => {
    const box = boxRef.current;
    if (!box) return;
    let dead = false;
    const stop = whenVisible(box, async () => {
      if (dead || mapRef.current) return;
      const maplibre = (await import('maplibre-gl')).default;
      const map = await createShoreMap(box, { center: [geo.lng, geo.lat], zoom: 14.6 });
      if (dead) { map.remove(); return; }
      mapRef.current = map;

      const el = document.createElement('div');
      el.className = 'lmap-pin';
      el.setAttribute('aria-label', `${address}, ${city}`);
      const popup = new maplibre.Popup({ offset: 26, closeButton: false, maxWidth: '260px' })
        .setHTML(`<div class="lmap-pop"><strong>${address}</strong><span>${city}, ${state} ${zip}</span><em>${status}</em></div>`);
      new maplibre.Marker({ element: el, anchor: 'center' }).setLngLat([geo.lng, geo.lat]).setPopup(popup).addTo(map);
    });
    return () => { dead = true; stop(); mapRef.current?.remove(); mapRef.current = null; };
  }, [geo.lat, geo.lng, address, city, state, zip, status]);

  const gmaps = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(`${address}, ${city}, ${state} ${zip}`)}`;

  return (
    <div id="location" style={{ marginTop: '3.4rem' }}>
      <span className="st-eyebrow">Location</span>
      <div className="lmap-box" style={{ position: 'relative', marginTop: '1.2rem', borderRadius: 20, overflow: 'hidden', border: '1px solid var(--st-line)', background: '#eceded' }}>
        <div ref={boxRef} className="lmap-canvas" role="region" aria-label={`Map showing ${address}, ${city}`} />
        <a href={gmaps} target="_blank" rel="noopener noreferrer" className="st-pill lmap-cta">
          Get directions ↗
        </a>
      </div>
    </div>
  );
}
