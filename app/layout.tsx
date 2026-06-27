import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Andrea Larsen — The Collection | Love Living Coast2Coast',
  description:
    'A coming-soon collection of luxury residences presented by Andrea Larsen — Love Living Coast2Coast.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link
          href="https://fonts.googleapis.com/css2?family=Archivo:wght@400;500;600;700;800;900&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
