/**
 * Reels — carrusel vertical estilo Reels/TikTok. El resto del sitio consume esto.
 *
 * ► Para activar el video real: sube el MP4 (Mux / Cloudflare Stream / Vercel Blob)
 *   y pon la URL en `video`. Sin `video`, el reel muestra el poster (foto real de
 *   la propiedad) con un movimiento sutil — la sección funciona igual, video-ready.
 * ► `poster` opcional: si el fotograma elegido por el agente difiere de la foto de
 *   portada, ponlo aquí (formato vertical 9:16 idealmente). Por defecto usa la
 *   portada del listing.
 * ► `result`: SOLO con datos verificados (p.ej. { sold: true, price: '$X', days: N }).
 *   No se inventa — sin esto, el chip muestra el status real del listing.
 * ► `cta`: el botón de la sección va al VENDEDOR (/sell) por decisión comercial.
 */
export type Reel = {
  slug: string;        // enlaza a /listing/<slug>
  caption?: string;    // línea corta sobre el reel
  video?: string;      // MP4 (opcional hasta subir los reales)
  poster?: string;     // fotograma vertical (opcional; por defecto = portada del listing)
  instagram?: string;  // link a Instagram como acción secundaria
  result?: { label: string; sold?: boolean }; // solo si es real y verificable
};

export const reels: Reel[] = [
  { slug: '71-morningside-road', caption: 'Six bedrooms, steps from the sand' },
  { slug: '522-waverly-blvd', caption: 'Inside the Gardens' },
  { slug: '1-leyte-ln', caption: 'Bayside light' },
  { slug: '114-wesley-road', caption: 'A block from the beach' },
  { slug: '3213-bayland-dr', caption: 'On the back bay' },
  { slug: '315-bay-ave', caption: 'Sunset side of the island' },
];
