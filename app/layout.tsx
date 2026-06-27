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
      <body>{children}</body>
    </html>
  );
}
