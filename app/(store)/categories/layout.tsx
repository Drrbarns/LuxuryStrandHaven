import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Hair Categories — Wigs, Bundles, Closures & More',
  description: 'Explore all hair categories at Luxury Strand Haven. Shop custom luxury wigs, factory wigs, raw hair bundles, 100% virgin hair, closures & frontals, braiding extensions and more.',
  keywords: [
    'hair categories Ghana', 'wig categories Ghana', 'custom luxury wigs Ghana', 'factory wigs Ghana',
    'hair bundles categories', 'closures frontals Ghana', 'braiding extensions Ghana',
    'virgin hair Ghana', 'raw hair Ghana', 'products and tools Ghana',
  ].join(', '),
  openGraph: {
    title: 'Hair Categories | Luxury Strand Haven Ghana',
    description: 'All hair categories — wigs, bundles, closures, frontals, braiding extensions and more at Luxury Strand Haven.',
    images: [{ url: '/logo.png?v=3', alt: 'Luxury Strand Haven', type: 'image/png' }],
    url: '/categories',
    locale: 'en_GH',
  },
  twitter: {
    card: 'summary',
    title: 'Hair Categories | Luxury Strand Haven',
    description: 'All hair categories at Luxury Strand Haven Ghana.',
    images: ['/logo.png?v=3'],
  },
  alternates: { canonical: '/categories' },
};

export default function CategoriesLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
