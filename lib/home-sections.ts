/**
 * Contenido de las secciones nuevas del home.
 * ⚠️ testimonials y justSold arrancan VACÍOS a propósito: sus secciones no se
 * renderizan hasta que el cliente provea el contenido real del documento
 * (nombres/quotes con permiso, ventas cerradas verificables). NO inventar.
 */

export type Testimonial = { name: string; city: string; property?: string; quote: string; photo?: string; sample?: boolean };
export type SoldHome = { address: string; city: string; listPrice?: string; salePrice?: string; photo: string; note?: string };

/** ⚠️ SAMPLE: contenido ilustrativo con chip visible "Sample" en la UI.
 *  Reemplazar por reviews verificadas (con permiso) cuando el cliente las provea:
 *  quitar `sample: true` y poner nombre/foto reales. */
export const testimonials: Testimonial[] = [
  { name: 'J. & M. R.', city: 'Ocean City buyers', quote: 'She knew the block, the builder and the bay breeze before we ever asked. We closed on the house our kids will remember forever.', sample: true },
  { name: 'S. K.', city: 'Wildwood Crest seller', quote: 'Listed on Friday, four offers by Tuesday. Andrea priced it like she had seen the future.', sample: true },
  { name: 'The D. Family', city: 'Linwood buyers', quote: 'Three states, two markets, one agent who answered every call. We would not do the shore with anyone else.', sample: true },
];

/** REAL: propiedades de Andrea actualmente bajo contrato (feed BHHS).
 *  Cuando el cliente provea ventas CERRADAS, cambiar note a 'SOLD' + salePrice. */
export const justSold: SoldHome[] = [
  { address: '905-907 Brighton Pl', city: 'Ocean City, NJ', photo: '/oc/oc-04.jpg', note: 'Under contract' },
  { address: '1 Leyte Ln', city: 'Ocean City, NJ', listPrice: '$3,295,000', photo: '/oc/oc-06.jpg', note: 'Under contract' },
  { address: '855 4th Street #2', city: 'Ocean City, NJ', listPrice: '$2,395,000', photo: '/oc/oc-13.jpg', note: 'Under contract' },
  { address: '901 Gardens Pkwy', city: 'Ocean City, NJ', listPrice: '$2,295,000', photo: '/oc/oc-15.jpg', note: 'Under contract' },
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
