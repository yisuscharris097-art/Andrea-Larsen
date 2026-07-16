import type { Metadata } from 'next';
import { Archivo, Instrument_Serif, Inter } from 'next/font/google';
import './globals.css';
import './studio.css';

const archivo = Archivo({
  subsets: ['latin'],
  axes: ['wdth'],
  variable: '--font-grotesk',
  display: 'swap',
});

const instrument = Instrument_Serif({
  subsets: ['latin'],
  weight: '400',
  style: ['normal', 'italic'],
  variable: '--font-serif',
  display: 'swap',
});

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-body',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Andrea Larsen — Luxury Real Estate | Love Living Coast2Coast',
  description:
    'Luxury residences presented by Andrea Larsen — REALTOR®, Top 1% in state, 27+ years. Berkshire Hathaway HomeServices Fox & Roach. Licensed in AZ, FL and NJ.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${archivo.variable} ${instrument.variable} ${inter.variable}`}>
      <body>{children}</body>
    </html>
  );
}
