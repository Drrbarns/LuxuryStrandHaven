import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Shop Premium Hair Collection',
  description: 'Browse Luxury Strand Haven\'s full collection of 100% human hair wigs, bundles, closures & frontals. Custom luxury wigs, HD lace, raw hair bundles, virgin hair — all available for fast delivery across Ghana.',
  keywords: [
    'buy wigs Ghana', 'human hair wigs shop Ghana', 'lace front wigs Ghana', 'HD lace wigs Ghana',
    'virgin hair bundles Ghana', 'closures frontals Ghana', 'hair shop Accra', 'wig store Ghana',
    'custom wigs online Ghana', 'cheap human hair wigs Ghana', 'luxury wigs for sale Ghana',
    '100% human hair Ghana', 'raw hair bundles Ghana', 'braiding extensions Ghana',
  ].join(', '),
  openGraph: {
    title: 'Shop Premium Hair Collection | Luxury Strand Haven',
    description: 'Browse our full range of 100% human hair wigs, bundles, closures & frontals. Custom luxury wigs, HD lace, virgin hair — fast delivery across Ghana.',
    images: [{ url: '/og-shop.png', width: 1200, height: 630, alt: 'Shop Premium Hair Collection — Luxury Strand Haven Ghana', type: 'image/png' }],
    url: '/shop',
    type: 'website',
    locale: 'en_GH',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Shop Premium Hair Collection | Luxury Strand Haven',
    description: 'Browse wigs, bundles, closures & frontals at Luxury Strand Haven Ghana.',
    images: [{ url: '/og-shop.png', alt: 'Shop Premium Hair — Luxury Strand Haven' }],
  },
  alternates: { canonical: '/shop' },
};

export default function ShopLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
