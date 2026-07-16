/**
 * Properties — modelo de datos IDX-ready.
 * Fuente: feed real de Andrea Larsen en BHHS Fox & Roach
 * (andrealarsen.foxroach.com/Featured-Properties, extraído 2026-07-16).
 * Direcciones, precios, beds/baths, estado y fotos = REALES.
 * `pendingCopy: true` marca texto descriptivo representativo aún no
 * confirmado por el cliente (placeholder claramente señalizado).
 * Para conectar un feed IDX/MLS: mapear el payload a `Property` y reemplazar
 * el array estático — el resto del sitio consume solo este módulo.
 */

export type PropertyType = 'House' | 'Condo' | 'Townhouse' | 'Land';
export type PropertyStatus = 'For Sale' | 'Pending';

export type Property = {
  slug: string;
  mlsRef: string; // referencia del detalle en el feed
  address: string;
  city: string;
  state: string;
  zip: string;
  price: number;
  priceDisplay: string;
  beds?: number;
  baths?: number;
  sqft?: number;
  lotAcres?: number;
  status: PropertyStatus;
  type: PropertyType;
  photo: string; // foto principal (local, optimizada)
  photos: string[]; // galería — hoy 1 real por propiedad
  features: string[]; // pills honestas (derivadas de datos reales / geografía)
  description: string;
  pendingCopy: boolean; // true = descripción representativa, pendiente de brief
  detailUrl: string; // detalle oficial en foxroach.com
  map: { x: number; y: number }; // posición en el mapa estilizado (0–100)
};


import galleryManifest from './gallery-manifest.json';

/** Fotos de la galería local de una propiedad (01.jpg..NN.jpg). */
const gal = (slug: string): string[] => {
  const n = (galleryManifest as Record<string, number>)[slug] || 0;
  return n > 0
    ? Array.from({ length: n }, (_, i) => `/oc/gal/${slug}/${String(i + 1).padStart(2, '0')}.jpg`)
    : [];
};

const DET = 'https://andrealarsen.foxroach.com/realestate/details/';

export const properties: Property[] = [
  {
    slug: '71-morningside-road',
    mlsRef: '55804564',
    address: '71 Morningside Road', city: 'Ocean City', state: 'NJ', zip: '08226',
    price: 5995000, priceDisplay: '$5,995,000', beds: 6, baths: 5,
    status: 'For Sale', type: 'House',
    photo: '/oc/oc-01.jpg', photos: [ '/oc/oc-01.jpg', ...gal('71-morningside-road') ],
    features: ['Jersey Shore', 'Near the beach', '6 bedrooms'],
    description: 'The crown of the current collection — a six-bedroom Ocean City residence built for full-family summers, minutes from the sand. Descriptive brief pending; data direct from the BHHS Fox & Roach feed.',
    pendingCopy: true,
    detailUrl: DET + '55804564/71-morningside-road-ocean-city-nj-08226/601043',
    map: { x: 62, y: 24 },
  },
  {
    slug: '210-gull-road',
    mlsRef: '52992582',
    address: '210 Gull Road', city: 'Ocean City', state: 'NJ', zip: '08226',
    price: 4995000, priceDisplay: '$4,995,000', lotAcres: 0.15,
    status: 'Pending', type: 'Land',
    photo: '/oc/oc-02.jpg', photos: [ '/oc/oc-02.jpg', ...gal('210-gull-road') ],
    features: ['Jersey Shore', '0.15 acres', 'Build opportunity'],
    description: 'A rare 0.15-acre parcel in Ocean City — the chance to draw your own beach house from line one. Descriptive brief pending; data direct from the BHHS Fox & Roach feed.',
    pendingCopy: true,
    detailUrl: DET + '52992582/210-gull-road-ocean-city-nj-08226/608909',
    map: { x: 38, y: 36 },
  },
  {
    slug: '522-waverly-blvd',
    mlsRef: '55550699',
    address: '522 Waverly Blvd', city: 'Ocean City', state: 'NJ', zip: '08226',
    price: 4995000, priceDisplay: '$4,995,000', beds: 5, baths: 5,
    status: 'For Sale', type: 'House',
    photo: '/oc/oc-03.jpg', photos: [ '/oc/oc-03.jpg', ...gal('522-waverly-blvd') ],
    features: ['Jersey Shore', 'Near the beach', '5 bedrooms'],
    description: 'Five bedrooms and five baths on Waverly Boulevard — Ocean City living at its widest. Descriptive brief pending; data direct from the BHHS Fox & Roach feed.',
    pendingCopy: true,
    detailUrl: DET + '55550699/522-waverly-blvd-ocean-city-nj-08226/607348',
    map: { x: 55, y: 46 },
  },
  {
    slug: '905-907-brighton-pl',
    mlsRef: '76331513',
    address: '905-907 Brighton Pl', city: 'Ocean City', state: 'NJ', zip: '08226',
    price: 4789000, priceDisplay: '$4,789,000',
    status: 'Pending', type: 'House',
    photo: '/oc/oc-04.jpg', photos: [ '/oc/oc-04.jpg', ...gal('905-907-brighton-pl') ],
    features: ['Jersey Shore', 'Multi-unit', 'Investment'],
    description: 'A double address on Brighton Place — space for the whole story, two doors at a time. Descriptive brief pending; data direct from the BHHS Fox & Roach feed.',
    pendingCopy: true,
    detailUrl: DET + '76331513/905-907-brighton-pl-ocean-city-nj-08226/601468',
    map: { x: 47, y: 58 },
  },
  {
    slug: '114-wesley-road',
    mlsRef: '57087951',
    address: '114 Wesley Road', city: 'Ocean City', state: 'NJ', zip: '08226',
    price: 3795000, priceDisplay: '$3,795,000', beds: 5, baths: 5,
    status: 'For Sale', type: 'House',
    photo: '/oc/oc-05.jpg', photos: [ '/oc/oc-05.jpg', ...gal('114-wesley-road') ],
    features: ['Jersey Shore', 'Near the beach', '5 bedrooms'],
    description: 'Wesley Road, five bedrooms, five baths — a shore classic in the making. Descriptive brief pending; data direct from the BHHS Fox & Roach feed.',
    pendingCopy: true,
    detailUrl: DET + '57087951/114-wesley-road-ocean-city-nj-08226/601039',
    map: { x: 68, y: 40 },
  },
  {
    slug: '1-leyte-ln',
    mlsRef: '24417341',
    address: '1 Leyte Ln', city: 'Ocean City', state: 'NJ', zip: '08226',
    price: 3295000, priceDisplay: '$3,295,000', beds: 5, baths: 3, sqft: 2382,
    status: 'Pending', type: 'House',
    photo: '/oc/oc-06.jpg', photos: [ '/oc/oc-06.jpg', ...gal('1-leyte-ln') ],
    features: ['Jersey Shore', '2,382 sq ft', '5 bedrooms'],
    description: 'Corner of Leyte Lane: 2,382 square feet of shore house, five bedrooms deep. Descriptive brief pending; data direct from the BHHS Fox & Roach feed.',
    pendingCopy: true,
    detailUrl: DET + '24417341/1-leyte-ln-ocean-city-nj-08226/609565',
    map: { x: 30, y: 62 },
  },
  {
    slug: '6-walnut-road',
    mlsRef: '5085664',
    address: '6 Walnut Road', city: 'Ocean City', state: 'NJ', zip: '08226',
    price: 3295000, priceDisplay: '$3,295,000', beds: 4, baths: 5,
    status: 'Pending', type: 'House',
    photo: '/oc/oc-07.jpg', photos: [ '/oc/oc-07.jpg', ...gal('6-walnut-road') ],
    features: ['Jersey Shore', 'Near the beach', '4 bedrooms'],
    description: 'Walnut Road with four bedrooms and five baths — more bathrooms than excuses to leave the beach. Descriptive brief pending; data direct from the BHHS Fox & Roach feed.',
    pendingCopy: true,
    detailUrl: DET + '5085664/6-walnut-road-ocean-city-nj-08226/600991',
    map: { x: 74, y: 54 },
  },
  {
    slug: '3213-bayland-dr',
    mlsRef: '59603142',
    address: '3213 Bayland Dr', city: 'Ocean City', state: 'NJ', zip: '08226',
    price: 2995000, priceDisplay: '$2,995,000', beds: 5, baths: 6,
    status: 'For Sale', type: 'House',
    photo: '/oc/oc-08.jpg', photos: [ '/oc/oc-08.jpg', ...gal('3213-bayland-dr') ],
    features: ['Jersey Shore', 'Bayside', '5 bedrooms'],
    description: 'Bayland Drive — five bedrooms and six baths on the bay side of the island, where the sunsets do the staging. Descriptive brief pending; data direct from the BHHS Fox & Roach feed.',
    pendingCopy: true,
    detailUrl: DET + '59603142/3213-bayland-dr-ocean-city-nj-08226/608466',
    map: { x: 22, y: 44 },
  },
  {
    slug: '907-brighton-pl-2',
    mlsRef: '76329344',
    address: '907 Brighton Pl #2', city: 'Ocean City', state: 'NJ', zip: '08226',
    price: 2795000, priceDisplay: '$2,795,000', beds: 5, baths: 4,
    status: 'Pending', type: 'Condo',
    photo: '/oc/oc-09.jpg', photos: [ '/oc/oc-09.jpg', ...gal('907-brighton-pl-2') ],
    features: ['Jersey Shore', 'Condo', '5 bedrooms'],
    description: 'Unit 2 at 907 Brighton Place — five-bedroom condo living, lock-and-leave for the off-season. Descriptive brief pending; data direct from the BHHS Fox & Roach feed.',
    pendingCopy: true,
    detailUrl: DET + '76329344/907-brighton-pl-2-ocean-city-nj-08226/601464',
    map: { x: 45, y: 60 },
  },
  {
    slug: '1100-central-ave',
    mlsRef: '59603605',
    address: '1100 Central Ave', city: 'Ocean City', state: 'NJ', zip: '08226',
    price: 2595000, priceDisplay: '$2,595,000', beds: 4, baths: 3,
    status: 'Pending', type: 'House',
    photo: '/oc/oc-10.jpg', photos: [ '/oc/oc-10.jpg', ...gal('1100-central-ave') ],
    features: ['Jersey Shore', 'Central location', '4 bedrooms'],
    description: 'Central Avenue, four bedrooms — the address that puts the boardwalk, the bay and the bakery all within a bike ride. Descriptive brief pending; data direct from the BHHS Fox & Roach feed.',
    pendingCopy: true,
    detailUrl: DET + '59603605/1100-central-ave-ocean-city-nj-08226/601906',
    map: { x: 52, y: 70 },
  },
    {
    slug: '40-sunset-blvd',
    mlsRef: '5122300',
    address: '40 Sunset Blvd', city: 'Egg Harbor Township', state: 'NJ', zip: '08403',
    price: 2495000, priceDisplay: '$2,495,000', beds: 4, baths: 3, sqft: 3780,
    status: 'For Sale', type: 'House',
    photo: '/oc/oc-11.jpg', photos: [ '/oc/oc-11.jpg', ...gal('40-sunset-blvd') ],
    features: ['Jersey Shore', '3,780 sq ft', '4 bedrooms'],
    description: 'Sunset Boulevard in Anchorage Poin — 3,780 square feet pointed at the evening sky. Descriptive brief pending; data direct from the BHHS Fox & Roach feed.',
    pendingCopy: true,
    detailUrl: DET + '5122300/40-sunset-blvd-egg-harbor-township-nj-08403/607753',
    map: { x: 18, y: 20 },
  },
  {
    slug: '32-central-ave',
    mlsRef: '53587431',
    address: '32 Central Ave', city: 'Ocean City', state: 'NJ', zip: '08226',
    price: 2399000, priceDisplay: '$2,399,000', beds: 5, baths: 5, sqft: 2700,
    status: 'For Sale', type: 'House',
    photo: '/oc/oc-12.jpg', photos: [ '/oc/oc-12.jpg', ...gal('32-central-ave') ],
    features: ['Jersey Shore', 'Near the beach', '2,700 sq ft'],
    description: 'Central Avenue at the north end — five bedrooms, five baths, and an open house on the calendar. Descriptive brief pending; data direct from the BHHS Fox & Roach feed.',
    pendingCopy: true,
    detailUrl: DET + '53587431/32-central-ave-ocean-city-nj-08226/605191',
    map: { x: 58, y: 16 },
  },
  {
    slug: '855-4th-street-2',
    mlsRef: '138879723',
    address: '855 4th Street #2', city: 'Ocean City', state: 'NJ', zip: '08226',
    price: 2395000, priceDisplay: '$2,395,000', beds: 5, baths: 4, sqft: 2500,
    status: 'Pending', type: 'Condo',
    photo: '/oc/oc-13.jpg', photos: [ '/oc/oc-13.jpg', ...gal('855-4th-street-2') ],
    features: ['Jersey Shore', 'Condo', '2,500 sq ft'],
    description: 'Unit 2 on 4th Street — 2,500 square feet of shore condo a short walk from the sand. Descriptive brief pending; data direct from the BHHS Fox & Roach feed.',
    pendingCopy: true,
    detailUrl: DET + '138879723/855-4th-street-2-ocean-city-nj-08226/605056',
    map: { x: 63, y: 20 },
  },
  {
    slug: '5606-pacific-ave',
    mlsRef: '1808981',
    address: '5606 Pacific Ave', city: 'Wildwood Crest', state: 'NJ', zip: '08260',
    price: 2350000, priceDisplay: '$2,350,000', beds: 9, baths: 7, sqft: 3407,
    status: 'For Sale', type: 'House',
    photo: '/oc/oc-14.jpg', photos: [ '/oc/oc-14.jpg', ...gal('5606-pacific-ave') ],
    features: ['Jersey Shore', '9 bedrooms', 'Investment'],
    description: 'Nine bedrooms on Pacific Avenue, Wildwood Crest — a shore house that sleeps the whole reunion. Descriptive brief pending; data direct from the BHHS Fox & Roach feed.',
    pendingCopy: true,
    detailUrl: DET + '1808981/5606-pacific-ave-wildwood-crest-nj-08260/607414',
    map: { x: 40, y: 86 },
  },
  {
    slug: '901-gardens-pkwy',
    mlsRef: '43583623',
    address: '901 Gardens Pkwy', city: 'Ocean City', state: 'NJ', zip: '08226',
    price: 2295000, priceDisplay: '$2,295,000', beds: 4, baths: 3, sqft: 2424,
    status: 'Pending', type: 'House',
    photo: '/oc/oc-15.jpg', photos: [ '/oc/oc-15.jpg', ...gal('901-gardens-pkwy') ],
    features: ['Jersey Shore', 'Gardens', '2,424 sq ft'],
    description: 'Gardens Parkway — the address Ocean City reserves for its quietest blocks. Descriptive brief pending; data direct from the BHHS Fox & Roach feed.',
    pendingCopy: true,
    detailUrl: DET + '43583623/901-gardens-pkwy-ocean-city-nj-08226/608820',
    map: { x: 55, y: 12 },
  },
  {
    slug: '302-e-13th-avenue',
    mlsRef: '1823317',
    address: '302 E 13th Avenue', city: 'North Wildwood', state: 'NJ', zip: '08260',
    price: 2150000, priceDisplay: '$2,150,000', beds: 5, baths: 4,
    status: 'For Sale', type: 'House',
    photo: '/oc/oc-16.jpg', photos: [ '/oc/oc-16.jpg', ...gal('302-e-13th-avenue') ],
    features: ['Jersey Shore', 'Near the beach', '5 bedrooms'],
    description: 'Thirteenth Avenue, North Wildwood — five bedrooms a few blocks from the widest beach on the island. Descriptive brief pending; data direct from the BHHS Fox & Roach feed.',
    pendingCopy: true,
    detailUrl: DET + '1823317/302-e-13th-avenue-north-wildwood-nj-08260/261287',
    map: { x: 48, y: 80 },
  },
  {
    slug: '39-spruce-road',
    mlsRef: '5153087',
    address: '39 Spruce Road', city: 'Ocean City', state: 'NJ', zip: '08226',
    price: 1995000, priceDisplay: '$1,995,000', beds: 5, baths: 3, sqft: 2886,
    status: 'For Sale', type: 'House',
    photo: '/oc/oc-17.jpg', photos: [ '/oc/oc-17.jpg', ...gal('39-spruce-road') ],
    features: ['Jersey Shore', '2,886 sq ft', '5 bedrooms'],
    description: 'Spruce Road — 2,886 square feet with room for every cousin. Descriptive brief pending; data direct from the BHHS Fox & Roach feed.',
    pendingCopy: true,
    detailUrl: DET + '5153087/39-spruce-road-ocean-city-nj-08226/609251',
    map: { x: 70, y: 48 },
  },
  {
    slug: '315-bay-ave',
    mlsRef: '5129650',
    address: '315 Bay Ave', city: 'Ocean City', state: 'NJ', zip: '08226',
    price: 1925000, priceDisplay: '$1,925,000', beds: 5, baths: 5,
    status: 'For Sale', type: 'House',
    photo: '/oc/oc-18.jpg', photos: [ '/oc/oc-18.jpg', ...gal('315-bay-ave') ],
    features: ['Jersey Shore', 'Bayside', '5 bedrooms'],
    description: 'Bay Avenue with five bedrooms and five baths — sunsets included at no extra charge. Descriptive brief pending; data direct from the BHHS Fox & Roach feed.',
    pendingCopy: true,
    detailUrl: DET + '5129650/315-bay-ave-ocean-city-nj-08226/608787',
    map: { x: 34, y: 30 },
  },
  {
    slug: '857-st-charles-pl-1',
    mlsRef: '141597525',
    address: '857 St Charles Pl #1', city: 'Ocean City', state: 'NJ', zip: '08226',
    price: 1695000, priceDisplay: '$1,695,000', beds: 5, baths: 4, sqft: 1748,
    status: 'Pending', type: 'Condo',
    photo: '/oc/oc-19.jpg', photos: [ '/oc/oc-19.jpg', ...gal('857-st-charles-pl-1') ],
    features: ['Jersey Shore', 'Condo', '1,748 sq ft'],
    description: 'St Charles Place, unit 1 — five bedrooms of lock-and-leave shore living. Descriptive brief pending; data direct from the BHHS Fox & Roach feed.',
    pendingCopy: true,
    detailUrl: DET + '141597525/857-st-charles-pl-1-ocean-city-nj-08226/609426',
    map: { x: 50, y: 64 },
  },
  {
    slug: '17-creek-view-ln',
    mlsRef: '139970908',
    address: '17 Creek View Ln', city: 'Linwood', state: 'NJ', zip: '08221',
    price: 1299000, priceDisplay: '$1,299,000', beds: 4, baths: 5, sqft: 2764,
    status: 'For Sale', type: 'Townhouse',
    photo: '/oc/oc-20.jpg', photos: [ '/oc/oc-20.jpg', ...gal('17-creek-view-ln') ],
    features: ['New construction', '2,764 sq ft', '4 bedrooms'],
    description: 'Creek View Lane, Linwood — new-construction living on the mainland side of the shore (one of several units available). Descriptive brief pending; data direct from the BHHS Fox & Roach feed.',
    pendingCopy: true,
    detailUrl: DET + '139970908/17-creek-view-ln-linwood-nj-08221/607305',
    map: { x: 14, y: 40 },
  },
];

export const bySlug = (slug: string) => properties.find((p) => p.slug === slug);
export const flagship = properties[0];
export const related = (slug: string, n = 3) => properties.filter((p) => p.slug !== slug).slice(0, n);

/** Área de Ocean City — datos generales del entorno (no específicos por propiedad). */
export const AREA = [
  { key: 'Beach', d: 'Ocean City is a barrier island — every address lives minutes from the sand.' },
  { key: 'Boardwalk', d: '2.5 miles of the Jersey Shore’s most famous family boardwalk.' },
  { key: 'Dining & shopping', d: 'Asbury Avenue’s downtown blocks: bakeries, boutiques and BYOB dining.' },
  { key: 'Marinas', d: 'Bayside marinas and back-bay launches for boats, kayaks and paddleboards.' },
];
