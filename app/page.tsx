import ScrollExpandRealEstate from '@/components/scroll-expand-real-estate';
import { HeroParallax } from '@/components/hero-parallax';
import { ListingGrid } from '@/components/listing-grid';
import { listings } from '@/components/listings-data';

export default function Home() {
  return (
    <>
      {/* 1 · Hero cinematográfico scroll-to-expand (flagship) */}
      <ScrollExpandRealEstate />

      {/* 2 · Transición hermosa al listing — parallax 3D de la colección */}
      <HeroParallax products={listings} />

      {/* 3 · Todas las residencias, visibles y seleccionables */}
      <ListingGrid listings={listings} />
    </>
  );
}
