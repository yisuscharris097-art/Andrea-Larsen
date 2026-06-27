import { ParallaxHero } from '@/components/parallax-hero';
import { HeroParallax } from '@/components/hero-parallax';
import { ListingGrid } from '@/components/listing-grid';
import { AgentSection } from '@/components/agent-section';
import { listings } from '@/components/listings-data';

/*
 * NOTA (REGLA #0): el componente ScrollExpandRealEstate sigue en el repo
 * (components/scroll-expand-real-estate.tsx, intacto) pero queda FUERA del flujo:
 * su scroll-lock global es incompatible con un hero por encima. Reintegrable
 * con un pequeño rework si se desea.
 *   import ScrollExpandRealEstate from '@/components/scroll-expand-real-estate';
 */

export default function Home() {
  return (
    <>
      {/* 1 · HERO PARALLAX cinematográfico (FIND) — apertura */}
      <ParallaxHero />

      {/* 2 · La colección — parallax 3D + grid seleccionable (existente, intacto) */}
      <HeroParallax products={listings} />
      <ListingGrid listings={listings} />

      {/* 3 · Andrea (nueva) */}
      <AgentSection />

      {/* ─────────── 4 · DRONE VIDEO FINALE (último efecto de scroll) ───────────
          Slot reservado para el cierre con el clip de drone (Higgsfield).
          NO construir aún. ───────────────────────────────────────────────────── */}
    </>
  );
}
