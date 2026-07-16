import HeroDescent from '@/components/descent/hero-descent';
import { HeroParallax } from '@/components/hero-parallax';
import { ListingGrid } from '@/components/listing-grid';
import { AgentSection } from '@/components/agent-section';
import { listings } from '@/components/listings-data';

/*
 * NOTA: ParallaxHero (FIND-style) y ScrollExpandRealEstate siguen en el repo,
 * intactos, pero fuera del flujo: el hero ahora es HeroDescent (el descenso
 * de drone scrubbeado por scroll que aterriza en Andrea).
 */

export default function Home() {
  return (
    <>
      {/* 1 · EL DESCENSO — drone scrub: nubes → Miami → familia → Andrea */}
      <HeroDescent />

      {/* 2 · La colección — parallax 3D + grid seleccionable */}
      <div id="collection">
        <HeroParallax products={listings} />
        <ListingGrid listings={listings} />
      </div>

      {/* 3 · Andrea */}
      <AgentSection />
    </>
  );
}
