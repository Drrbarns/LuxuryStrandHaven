import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Contact Us — Luxury Strand Haven Ghana',
  description: 'Get in touch with Luxury Strand Haven. Contact us for custom wig orders, wholesale enquiries, hair consultations or any questions about our premium hair collection. Fast response guaranteed.',
  keywords: [
    'contact Luxury Strand Haven', 'custom wig order Ghana', 'hair consultation Ghana',
    'wig shop contact Ghana', 'wholesale hair Ghana', 'hair enquiry Ghana', 'order wigs Ghana',
  ].join(', '),
  openGraph: {
    title: 'Contact Luxury Strand Haven | Premium Hair Ghana',
    description: 'Contact us for custom wig orders, wholesale enquiries and hair consultations.',
    images: [{ url: '/logo.png?v=4', alt: 'Luxury Strand Haven', type: 'image/png' }],
    url: '/contact',
    locale: 'en_GH',
  },
  twitter: {
    card: 'summary',
    title: 'Contact Luxury Strand Haven | Premium Hair Ghana',
    description: 'Contact us for custom wig orders and hair consultations.',
    images: ['/logo.png?v=4'],
  },
  alternates: { canonical: '/contact' },
};

export default function ContactLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
