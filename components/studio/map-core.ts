'use client';

/**
 * map-core — base compartida de los mapas del sitio (MapLibre GL + OpenFreeMap).
 * Sin API key: tiles de openfreemap.org (estilo "positron", vector, gratis).
 * El estilo se parchea en runtime a la paleta del sitio (off-white / mist / greys)
 * para que el mapa parezca parte del design system y no un widget embebido.
 * Para migrar a Mapbox: reemplazar STYLE_URL por el style de Mapbox + token.
 */
import type { Map as MLMap, StyleSpecification } from 'maplibre-gl';

export const STYLE_URL = 'https://tiles.openfreemap.org/styles/positron';
export const SHORE_CENTER: [number, number] = [-74.59, 39.28];

export type GeoPoint = { lat: number; lng: number };

/* Paleta del sitio aplicada sobre positron */
const PALETTE = {
  land: '#f4f4f2',
  water: '#c3ccd0', // mist un paso más profundo para que el agua lea como agua
  green: '#e9ebe5',
  road: '#e3e3df',
  roadMajor: '#d8d8d3',
  text: '#8a8a8a',
  halo: '#f4f4f2',
};

export function patchStyle(style: StyleSpecification): StyleSpecification {
  const layers = (style.layers || []).filter((l) => {
    // menos ruido: fuera POIs, números de casa y aeropuertos
    return !/poi|housenumber|aeroway|airport/i.test(l.id);
  });
  for (const l of layers) {
    const paint: Record<string, unknown> = (l.paint as Record<string, unknown>) || {};
    if (l.type === 'background') paint['background-color'] = PALETTE.land;
    if (l.type === 'fill') {
      if (/water/i.test(l.id)) paint['fill-color'] = PALETTE.water;
      else if (/park|green|wood|grass|cemetery|pitch|landcover/i.test(l.id)) paint['fill-color'] = PALETTE.green;
      else if (/landuse|residential|building/i.test(l.id)) paint['fill-color'] = PALETTE.land;
    }
    if (l.type === 'line') {
      if (/motorway|trunk|primary/i.test(l.id)) paint['line-color'] = PALETTE.roadMajor;
      else paint['line-color'] = PALETTE.road;
    }
    if (l.type === 'symbol') {
      paint['text-color'] = PALETTE.text;
      paint['text-halo-color'] = PALETTE.halo;
    }
    l.paint = paint as never;
  }
  style.layers = layers;
  return style;
}

/** Crea un mapa con el estilo del sitio. El caller es dueño del ciclo de vida. */
export async function createShoreMap(container: HTMLElement, opts: {
  center?: [number, number];
  zoom?: number;
  interactive?: boolean;
  cooperative?: boolean;
}): Promise<MLMap> {
  const maplibre = (await import('maplibre-gl')).default;
  const styleJson = patchStyle(await (await fetch(STYLE_URL)).json());
  const map = new maplibre.Map({
    container,
    style: styleJson,
    center: opts.center || SHORE_CENTER,
    zoom: opts.zoom ?? 11,
    attributionControl: { compact: true },
    cooperativeGestures: opts.cooperative ?? true,
    fadeDuration: 220,
  });
  map.addControl(new maplibre.NavigationControl({ showCompass: false }), 'top-right');
  map.touchPitch.disable();
  map.dragRotate.disable();
  return map;
}

/** Lazy-init: resuelve cuando el contenedor entra al viewport (una sola vez). */
export function whenVisible(el: HTMLElement, cb: () => void) {
  if (!('IntersectionObserver' in window)) { cb(); return () => {}; }
  const io = new IntersectionObserver((entries) => {
    if (entries.some((e) => e.isIntersecting)) { io.disconnect(); cb(); }
  }, { rootMargin: '240px' });
  io.observe(el);
  return () => io.disconnect();
}
