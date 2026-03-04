import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Hair Academia — Online Wig & Hair Classes',
  description: 'Join Luxury Strand Haven\'s Hair Academia — Ghana\'s premier online hair education platform. Learn wig making, HD lace techniques, hair business management and professional styling from industry experts.',
  keywords: [
    'hair academy Ghana', 'online wig classes Ghana', 'wig making course Ghana',
    'hair business course Ghana', 'HD lace training Ghana', 'learn wig making online',
    'hair styling classes Ghana', 'hair education Ghana', 'professional wig making Ghana',
    'Luxury Strand Haven academia',
  ].join(', '),
  openGraph: {
    title: 'Hair Academia — Online Classes | Luxury Strand Haven',
    description: 'Learn wig making, HD lace techniques and hair business management from Ghana\'s premier hair experts.',
    images: [{ url: '/og-academia.png', width: 1200, height: 630, alt: 'Hair Academia — Luxury Strand Haven Online Classes Ghana', type: 'image/png' }],
    url: '/academia',
    locale: 'en_GH',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Hair Academia | Luxury Strand Haven',
    description: 'Online wig making and hair classes from Ghana\'s premier hair brand.',
    images: [{ url: '/og-academia.png', alt: 'Hair Academia — Luxury Strand Haven' }],
  },
  alternates: { canonical: '/academia' },
};

export default function AcademiaLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
