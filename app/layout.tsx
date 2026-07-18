import type { Metadata } from 'next';
import Script from 'next/script';
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
  metadataBase: new URL('https://project-625st.vercel.app'),
  title: {
    default: 'Andrea Larsen — Jersey Shore Luxury Real Estate | Ocean City, NJ',
    template: '%s',
  },
  description:
    'Luxury shore residences with Andrea Larsen — REALTOR®, Top 1% in state, 27+ years. Berkshire Hathaway HomeServices Fox & Roach, Ocean City NJ. Licensed in NJ, FL and AZ.',
  openGraph: {
    siteName: 'Andrea Larsen — Love Living Coast2Coast',
    type: 'website',
    locale: 'en_US',
  },
};

/** Schema.org RealEstateAgent — NAP consistente para SEO local. */
const agentJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'RealEstateAgent',
  name: 'Andrea Larsen',
  url: 'https://project-625st.vercel.app',
  telephone: '+1-856-448-2229',
  email: 'andrea@lovelivingcoast2coast.com',
  address: {
    '@type': 'PostalAddress',
    streetAddress: '730 West Avenue',
    addressLocality: 'Ocean City',
    addressRegion: 'NJ',
    postalCode: '08226',
    addressCountry: 'US',
  },
  areaServed: ['Ocean City NJ', 'Wildwood Crest NJ', 'North Wildwood NJ', 'Linwood NJ', 'Jersey Shore'],
  parentOrganization: { '@type': 'Organization', name: 'Berkshire Hathaway HomeServices Fox & Roach, REALTORS' },
};

// GA4: definir NEXT_PUBLIC_GA_ID en Vercel para activar (sin ID no se carga nada)
const GA_ID = process.env.NEXT_PUBLIC_GA_ID;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${archivo.variable} ${instrument.variable} ${inter.variable}`}>
      <body>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(agentJsonLd) }} />
        {children}
        {GA_ID && (
          <>
            <Script src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`} strategy="afterInteractive" />
            <Script id="ga4" strategy="afterInteractive">
              {`window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config','${GA_ID}');`}
            </Script>
          </>
        )}
      </body>
    </html>
  );
}
