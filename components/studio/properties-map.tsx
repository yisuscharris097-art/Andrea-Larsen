'use client';

/** PropertiesMap — mapa real de /properties (map view).
 *  Pins custom con precio (plum = For Sale, gris = Pending), popup con foto y
 *  link a la ficha, sync bidireccional lista↔pin, fit a resultados filtrados
 *  (debounced) y botón Reset view. */
import { useEffect, useRef } from 'react';
import type { Map as MLMap, Marker } from 'maplibre-gl';
import type { Property } from '@/lib/properties';
import geoJson from '@/lib/geo.json';
import { createShoreMap, whenVisible, type GeoPoint } from './map-core';

const GEO = geoJson as Record<string, GeoPoint>;

export default function PropertiesMap({ results, hoveredSlug, onPinHover }: {
  results: Property[];
  hoveredSlug: string | null;
  onPinHover: (slug: string | null) => void;
}) {
  const boxRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<MLMap | null>(null);
  const markersRef = useRef(new Map<string, Marker>());
  const resultsRef = useRef(results);
  resultsRef.current = results;

  // init lazy
  useEffect(() => {
    const box = boxRef.current;
    if (!box) return;
    let dead = false;
    const stop = whenVisible(box, async () => {
      if (dead || mapRef.current) return;
      const map = await createShoreMap(box, { zoom: 10.4 });
      if (dead) { map.remove(); return; }
      mapRef.current = map;
      syncMarkers();
      fit(false);
    });
    return () => { dead = true; stop(); markersRef.current.clear(); mapRef.current?.remove(); mapRef.current = null; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function fit(animate: boolean) {
    const map = mapRef.current;
    const pts = resultsRef.current.map((p) => GEO[p.slug]).filter(Boolean);
    if (!map || pts.length === 0) return;
    let minLng = 180, maxLng = -180, minLat = 90, maxLat = -90;
    for (const g of pts) {
      minLng = Math.min(minLng, g.lng); maxLng = Math.max(maxLng, g.lng);
      minLat = Math.min(minLat, g.lat); maxLat = Math.max(maxLat, g.lat);
    }
    map.fitBounds([[minLng, minLat], [maxLng, maxLat]], {
      padding: { top: 70, bottom: 50, left: 60, right: 60 },
      maxZoom: 13.2,
      duration: animate ? 700 : 0,
    });
  }

  async function syncMarkers() {
    const map = mapRef.current;
    if (!map) return;
    const maplibre = (await import('maplibre-gl')).default;
    const keep = new Set(resultsRef.current.map((p) => p.slug));
    // quitar los filtrados (con fade)
    markersRef.current.forEach((mk, slug) => {
      if (!keep.has(slug)) {
        const el = mk.getElement();
        el.classList.add('pmap-out');
        markersRef.current.delete(slug);
        setTimeout(() => mk.remove(), 240);
      }
    });
    // agregar los nuevos
    for (const p of resultsRef.current) {
      if (markersRef.current.has(p.slug)) continue;
      const g = GEO[p.slug];
      if (!g) continue;
      const el = document.createElement('button');
      el.className = 'pmap-pin';
      el.dataset.status = p.status;
      el.textContent = `$${(p.price / 1e6).toFixed(1)}M`;
      el.setAttribute('aria-label', `${p.address} — ${p.priceDisplay}, ${p.status}`);
      el.addEventListener('mouseenter', () => onPinHover(p.slug));
      el.addEventListener('mouseleave', () => onPinHover(null));
      const meta = [p.beds && `${p.beds} bd`, p.baths && `${p.baths} ba`, p.sqft && `${p.sqft.toLocaleString('en-US')} sq ft`].filter(Boolean).join(' · ');
      const popup = new maplibre.Popup({ offset: 20, closeButton: false, maxWidth: '270px' }).setHTML(
        `<a class="pmap-pop" href="/listing/${p.slug}">
          <span class="ph" style="background-image:url('${p.photo}')"></span>
          <strong>${p.priceDisplay}</strong>
          <span>${p.address}, ${p.city}</span>
          <em>${meta || p.type}</em>
          <b>View listing →</b>
        </a>`,
      );
      const mk = new maplibre.Marker({ element: el, anchor: 'bottom', offset: [0, -4] }).setLngLat([g.lng, g.lat]).setPopup(popup).addTo(map);
      markersRef.current.set(p.slug, mk);
    }
  }

  // filtros → pins en tiempo real (debounce ligero para el slider de precio)
  useEffect(() => {
    const t = setTimeout(() => { syncMarkers(); fit(true); }, 180);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [results]);

  // hover en lista → resaltar pin
  useEffect(() => {
    markersRef.current.forEach((mk, slug) => {
      mk.getElement().classList.toggle('pmap-hot', slug === hoveredSlug);
    });
  }, [hoveredSlug]);

  return (
    <div className="pmap-wrap">
      <div ref={boxRef} className="pmap-canvas" role="region" aria-label="Map of available properties" />
      <button className="st-pill pmap-reset" onClick={() => fit(true)}>Reset view</button>
    </div>
  );
}
