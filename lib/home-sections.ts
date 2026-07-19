/**
 * Contenido de las secciones nuevas del home.
 * ⚠️ testimonials y justSold arrancan VACÍOS a propósito: sus secciones no se
 * renderizan hasta que el cliente provea el contenido real del documento
 * (nombres/quotes con permiso, ventas cerradas verificables). NO inventar.
 */

export type Testimonial = { name: string; city: string; property?: string; quote: string; photo?: string };
export type SoldHome = { address: string; city: string; listPrice?: string; salePrice?: string; photo: string; note?: string };

export const testimonials: Testimonial[] = [
  // ← pegar aquí los 3 testimonios reales del documento (foto, nombre, quote)
];

export const justSold: SoldHome[] = [
  // ← pegar aquí las 3-4 ventas cerradas reales del documento
];

export const HOW_IT_WORKS = [
  { t: 'Tell Andrea your summer', d: 'A call or a note — what home means to you, your budget, your timeline. She listens first.' },
  { t: 'Tour the shortlist', d: 'Private showings of homes that actually fit — including coming-soon addresses before they list.' },
  { t: 'Offer with an edge', d: '27 years of negotiation and market data behind every number you put on the table.' },
  { t: 'Close and get the keys', d: 'Inspections, timelines and paperwork handled — down to the moment the door opens.' },
];

/** Afiliaciones y credenciales verificables (no premios inventados). */
export const AFFILIATIONS = [
  'Berkshire Hathaway HomeServices Fox & Roach',
  'REALTOR®',
  'Top 1% Producer — Statewide',
  'Equal Housing Opportunity',
  'Licensed NJ · FL · AZ',
  '27+ Years in Real Estate',
];
