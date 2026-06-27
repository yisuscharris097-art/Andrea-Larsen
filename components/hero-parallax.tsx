'use client';
import React from 'react';
import {
  motion,
  useScroll,
  useTransform,
  useSpring,
  MotionValue,
} from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import type { Listing } from './listings-data';

/**
 * HeroParallax (Aceternity) — adaptado a luxury real estate:
 * blanco + oxblood, copy de la colección, tarjetas = propiedades clicables.
 */
export const HeroParallax = ({ products }: { products: Listing[] }) => {
  // 3 filas de 5 (15). Si hay menos, ciclamos para llenar las filas.
  const cards =
    products.length >= 15
      ? products.slice(0, 15)
      : Array.from({ length: 15 }, (_, i) => products[i % products.length]);
  const firstRow = cards.slice(0, 5);
  const secondRow = cards.slice(5, 10);
  const thirdRow = cards.slice(10, 15);
  const ref = React.useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start start', 'end start'],
  });

  const springConfig = { stiffness: 300, damping: 30, bounce: 100 };

  const translateX = useSpring(useTransform(scrollYProgress, [0, 1], [0, 1000]), springConfig);
  const translateXReverse = useSpring(useTransform(scrollYProgress, [0, 1], [0, -1000]), springConfig);
  const rotateX = useSpring(useTransform(scrollYProgress, [0, 0.2], [15, 0]), springConfig);
  const opacity = useSpring(useTransform(scrollYProgress, [0, 0.2], [0.2, 1]), springConfig);
  const rotateZ = useSpring(useTransform(scrollYProgress, [0, 0.2], [20, 0]), springConfig);
  const translateY = useSpring(useTransform(scrollYProgress, [0, 0.2], [-700, 500]), springConfig);

  return (
    <div
      ref={ref}
      className="h-[300vh] py-32 md:py-40 overflow-hidden antialiased relative flex flex-col self-auto bg-paper [perspective:1000px] [transform-style:preserve-3d]"
    >
      <Header />
      <motion.div style={{ rotateX, rotateZ, translateY, opacity }}>
        <motion.div className="flex flex-row-reverse space-x-reverse space-x-8 md:space-x-20 mb-8 md:mb-20">
          {firstRow.map((product, i) => (
            <ProductCard product={product} translate={translateX} key={'r1-' + i} />
          ))}
        </motion.div>
        <motion.div className="flex flex-row mb-8 md:mb-20 space-x-8 md:space-x-20">
          {secondRow.map((product, i) => (
            <ProductCard product={product} translate={translateXReverse} key={'r2-' + i} />
          ))}
        </motion.div>
        <motion.div className="flex flex-row-reverse space-x-reverse space-x-8 md:space-x-20">
          {thirdRow.map((product, i) => (
            <ProductCard product={product} translate={translateX} key={'r3-' + i} />
          ))}
        </motion.div>
      </motion.div>
    </div>
  );
};

export const Header = () => {
  return (
    <div className="max-w-7xl relative mx-auto py-16 md:py-28 px-4 w-full left-0 top-0">
      <span className="inline-flex items-center gap-3 text-ox font-bold uppercase tracking-[0.26em] text-[0.72rem]">
        <span className="w-8 h-px bg-ox" /> Coming Soon · The Collection
      </span>
      <h1 className="text-4xl md:text-7xl lg:text-8xl font-extrabold tracking-tight text-ink mt-6 leading-[0.92]">
        Ten extraordinary <br /> residences.
      </h1>
      <p className="max-w-2xl text-base md:text-xl mt-8 text-ink/70 leading-relaxed">
        From the Pennsylvania countryside to the Chesapeake shore — a private portfolio,
        presented by Andrea Larsen · Love Living Coast2Coast.
      </p>
    </div>
  );
};

export const ProductCard = ({
  product,
  translate,
}: {
  product: Listing;
  translate: MotionValue<number>;
}) => {
  return (
    <motion.div
      style={{ x: translate }}
      whileHover={{ y: -20 }}
      className="group/product h-72 w-[22rem] md:h-96 md:w-[30rem] relative flex-shrink-0"
    >
      <Link
        href={product.link}
        target="_blank"
        rel="noopener noreferrer"
        className="block rounded-2xl overflow-hidden shadow-[0_24px_70px_-32px_rgba(26,23,20,0.55)] group-hover/product:shadow-2xl"
      >
        <Image
          src={product.thumbnail}
          height={600}
          width={600}
          className="object-cover object-center absolute h-full w-full inset-0"
          alt={product.title}
        />
      </Link>
      <div className="absolute inset-0 h-full w-full opacity-0 group-hover/product:opacity-90 bg-gradient-to-t from-ox via-ox/35 to-transparent pointer-events-none transition-opacity duration-500 rounded-2xl" />
      <div className="absolute bottom-5 left-5 right-5 opacity-0 group-hover/product:opacity-100 transition-opacity duration-500 pointer-events-none">
        <p className="text-white text-2xl md:text-3xl font-extrabold tracking-tight">{product.price}</p>
        <h2 className="text-white/85 text-sm mt-1">{product.title}</h2>
      </div>
    </motion.div>
  );
};
