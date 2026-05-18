import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'About Us — Ghana\'s Premier Hair Destination',
  description: 'Learn about Luxury Strand Haven — Ghana\'s most trusted premium hair brand. We specialize in 100% human hair wigs, bundles, closures & frontals. Elevating hair standards across Ghana with quality, elegance and expertise.',
  keywords: [
    'about Luxury Strand Haven', 'premium hair brand Ghana', 'best wig brand Ghana',
    'human hair Ghana brand', 'trusted hair shop Ghana', 'Accra hair brand',
    'luxury hair Ghana story', 'Ghana hair company',
  ].join(', '),
  openGraph: {
    title: 'About Luxury Strand Haven | Ghana\'s Premier Hair Brand',
    description: 'Ghana\'s most trusted premium hair brand — custom wigs, bundles, closures & frontals.',
    images: [{ url: '/logo.png?v=4', alt: 'Luxury Strand Haven', type: 'image/png' }],
    url: '/about',
    locale: 'en_GH',
  },
  twitter: {
    card: 'summary',
    title: 'About Luxury Strand Haven | Ghana\'s Premier Hair Brand',
    description: 'Ghana\'s most trusted premium hair brand.',
    images: ['/logo.png?v=4'],
  },
  alternates: { canonical: '/about' },
};

export default function AboutLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
