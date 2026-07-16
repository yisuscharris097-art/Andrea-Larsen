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

const DET = 'https://andrealarsen.foxroach.com/realestate/details/';

export const properties: Property[] = [
  {
    slug: '71-morningside-road',
    mlsRef: '55804564',
    address: '71 Morningside Road', city: 'Ocean City', state: 'NJ', zip: '08226',
    price: 5995000, priceDisplay: '$5,995,000', beds: 6, baths: 5,
    status: 'For Sale', type: 'House',
    photo: '/oc/oc-01.jpg', photos: ['/oc/oc-01.jpg'],
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
    photo: '/oc/oc-02.jpg', photos: ['/oc/oc-02.jpg'],
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
    photo: '/oc/oc-03.jpg', photos: ['/oc/oc-03.jpg'],
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
    photo: '/oc/oc-04.jpg', photos: ['/oc/oc-04.jpg'],
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
    photo: '/oc/oc-05.jpg', photos: ['/oc/oc-05.jpg'],
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
    photo: '/oc/oc-06.jpg', photos: ['/oc/oc-06.jpg'],
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
    photo: '/oc/oc-07.jpg', photos: ['/oc/oc-07.jpg'],
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
    photo: '/oc/oc-08.jpg', photos: ['/oc/oc-08.jpg'],
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
    photo: '/oc/oc-09.jpg', photos: ['/oc/oc-09.jpg'],
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
    photo: '/oc/oc-10.jpg', photos: ['/oc/oc-10.jpg'],
    features: ['Jersey Shore', 'Central location', '4 bedrooms'],
    description: 'Central Avenue, four bedrooms — the address that puts the boardwalk, the bay and the bakery all within a bike ride. Descriptive brief pending; data direct from the BHHS Fox & Roach feed.',
    pendingCopy: true,
    detailUrl: DET + '59603605/1100-central-ave-ocean-city-nj-08226/601906',
    map: { x: 52, y: 70 },
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
