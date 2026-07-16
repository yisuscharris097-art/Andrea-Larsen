import HeroDescent from '@/components/descent/hero-descent';
import Flagship from '@/components/descent/flagship';
import Finale from '@/components/descent/finale';
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

      {/* 2 · FLAGSHIP — Pineville $18.8M, expansión de imagen + tipografía */}
      <Flagship />

      {/* 3 · La colección — parallax 3D + grid en formación */}
      <div id="collection">
        <HeroParallax products={listings} />
        <ListingGrid listings={listings} />
      </div>

      {/* 4 · Andrea */}
      <AgentSection />

      {/* 5 · Cierre — CTA magnético */}
      <Finale />
    </>
  );
}
