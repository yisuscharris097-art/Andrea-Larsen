'use client';

/** HomeMap — wrapper client del mapa real para la sección de la home.
 *  Muestra las 20 propiedades con pins de precio; reusa PropertiesMap. */
import { useState } from 'react';
import { properties } from '@/lib/properties';
import PropertiesMap from './properties-map';

export default function HomeMap() {
  const [hovered, setHovered] = useState<string | null>(null);
  return (
    <div className="home-map">
      <PropertiesMap results={properties} hoveredSlug={hovered} onPinHover={setHovered} />
    </div>
  );
}
