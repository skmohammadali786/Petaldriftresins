import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Petal Drift | Luxury Handmade Resin Art',
  description: 'Premium handcrafted resin art, preserved flowers, ocean pieces, custom gifts, home décor, jewelry, keepsakes, and boutique resin creations.',
  keywords: ['resin art', 'preserved flowers', 'custom resin gifts', 'handmade decor', 'Petal Drift'],
  openGraph: { title: 'Petal Drift', description: 'Where nature lives forever in handcrafted resin art.', type: 'website' }
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
