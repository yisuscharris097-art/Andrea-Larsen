'use client';

/** GateRelease — al volver a la home desde una propiedad (back / breadcrumb),
 *  el navegador restaura el scroll a mitad de página pero el hero remonta con
 *  el gate activo (Lenis detenido) → la página queda congelada. Este componente
 *  observa unos segundos: si la home montó ya scrolleada más allá del hero,
 *  libera el gate. No toca la mecánica del scrub. */
import { useEffect } from 'react';

type LenisLike = { isStopped?: boolean; start: () => void };

export default function GateRelease() {
  useEffect(() => {
    let tries = 0;
    const id = setInterval(() => {
      tries++;
      const lenis = (window as unknown as { __descentLenis?: LenisLike }).__descentLenis;
      const qvOpen = document.querySelector('[role="dialog"][aria-modal="true"]');
      if (!qvOpen && lenis?.isStopped && window.scrollY > window.innerHeight * 0.5) {
        lenis.start();
        clearInterval(id);
        return;
      }
      if (tries > 25) clearInterval(id); // ~2.5s de ventana para el scroll restoration
    }, 100);
    return () => clearInterval(id);
  }, []);
  return null;
}
