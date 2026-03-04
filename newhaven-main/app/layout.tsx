import type { Metadata } from "next";
import Script from "next/script";
import { Pacifico, Playfair_Display, Outfit } from "next/font/google";
import { CartProvider } from "@/context/CartContext";
import { WishlistProvider } from "@/context/WishlistContext";
import "./globals.css";

const pacifico = Pacifico({ weight: '400', subsets: ['latin'], variable: '--font-pacifico' });
const playfair = Playfair_Display({
  weight: ['400', '500', '600', '700'],
  style: ['normal', 'italic'],
  subsets: ['latin'],
  variable: '--font-playfair',
});
const outfit = Outfit({ weight: ['300', '400', '500', '600', '700'], subsets: ['latin'], variable: '--font-outfit' });

const siteUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://luxury-strand-haven.vercel.app';
const siteName = 'Luxury Strand Haven';
const siteTagline = 'Premium Wigs & Hair in Ghana';
const siteDescription = 'Shop 100% human hair wigs, bundles, closures & frontals at Luxury Strand Haven. Custom luxury wigs, HD lace frontals, raw hair bundles, virgin hair & more. Fast delivery across Ghana. Ghana\'s premier premium hair destination.';

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: `${siteName} | ${siteTagline}`,
    template: `%s | ${siteName}`,
  },
  description: siteDescription,
  keywords: [
    'luxury wigs Ghana',
    'human hair wigs Ghana',
    'custom wigs Ghana',
    'lace front wigs Ghana',
    'HD lace wigs Ghana',
    'virgin hair bundles Ghana',
    'hair extensions Ghana',
    'closures and frontals Ghana',
    'wig shop Ghana',
    'premium hair Ghana',
    'buy wigs online Ghana',
    'raw hair bundles Ghana',
    'braiding extensions Ghana',
    'wig making classes Ghana',
    'hair academy Ghana',
    '100% human hair',
    'Luxury Strand Haven',
    'factory wigs Ghana',
    'pre order wigs Ghana',
    'hair bundles Accra',
    'wigs Accra Ghana',
    'best wig shop Ghana',
  ],
  authors: [{ name: siteName, url: siteUrl }],
  creator: siteName,
  publisher: siteName,
  category: 'Hair & Beauty',
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  icons: {
    icon: [
      { url: '/logo.png', type: 'image/png' },
    ],
    apple: '/logo.png',
    shortcut: '/logo.png',
  },
  manifest: '/manifest.json',
  verification: {
    google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION || '',
  },
  openGraph: {
    type: 'website',
    locale: 'en_GH',
    url: siteUrl,
    title: `${siteName} | ${siteTagline}`,
    description: siteDescription,
    siteName: siteName,
    images: [
      {
        url: '/og-home.png',
        width: 1200,
        height: 630,
        alt: `${siteName} — Premium Hair Collection Ghana`,
        type: 'image/png',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: `${siteName} | ${siteTagline}`,
    description: siteDescription,
    images: [{ url: '/og-home.png', alt: `${siteName} — Premium Hair Collection Ghana` }],
    creator: '@luxurystrandhaven',
    site: '@luxurystrandhaven',
  },
  alternates: {
    canonical: siteUrl,
  },
  other: {
    'theme-color': '#000000',
    'msapplication-TileColor': '#000000',
    'apple-mobile-web-app-capable': 'yes',
    'apple-mobile-web-app-status-bar-style': 'black-translucent',
    'apple-mobile-web-app-title': siteName,
    'format-detection': 'telephone=no',
  },
};

// Google Analytics Measurement ID
const GA_MEASUREMENT_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;
// Google reCAPTCHA v3 Site Key
const RECAPTCHA_SITE_KEY = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en-GH">
      <head>
        <link
          href="https://cdn.jsdelivr.net/npm/remixicon@4.1.0/fonts/remixicon.css"
          rel="stylesheet"
        />
        {/* Organization Schema */}
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Organization",
          "name": "Luxury Strand Haven",
          "alternateName": "LSH",
          "url": siteUrl,
          "logo": { "@type": "ImageObject", "url": `${siteUrl}/logo.png`, "width": 1024, "height": 1024 },
          "image": `${siteUrl}/og-home.png`,
          "description": "Ghana's premier destination for 100% human hair wigs, bundles, closures & frontals. Custom luxury wigs, HD lace, raw hair and more.",
          "foundingDate": "2020",
          "addressCountry": "GH",
          "address": { "@type": "PostalAddress", "addressCountry": "GH", "addressRegion": "Greater Accra" },
          "contactPoint": [
            { "@type": "ContactPoint", "contactType": "customer service", "availableLanguage": ["English"], "areaServed": "GH" }
          ],
          "sameAs": [
            "https://www.instagram.com/luxurystrandhaven",
            "https://www.facebook.com/luxurystrandhaven",
            "https://www.tiktok.com/@luxurystrandhaven"
          ],
          "hasOfferCatalog": {
            "@type": "OfferCatalog",
            "name": "Premium Hair Collection",
            "itemListElement": [
              { "@type": "Offer", "itemOffered": { "@type": "Product", "name": "Custom Luxury Wigs" } },
              { "@type": "Offer", "itemOffered": { "@type": "Product", "name": "Factory Wigs" } },
              { "@type": "Offer", "itemOffered": { "@type": "Product", "name": "Raw Hair Bundles" } },
              { "@type": "Offer", "itemOffered": { "@type": "Product", "name": "100% Virgin Hair Bundles" } },
              { "@type": "Offer", "itemOffered": { "@type": "Product", "name": "Closures & Frontals" } },
              { "@type": "Offer", "itemOffered": { "@type": "Product", "name": "Braiding Extensions" } }
            ]
          }
        })}} />

        {/* WebSite Schema with SearchAction */}
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "WebSite",
          "name": "Luxury Strand Haven",
          "url": siteUrl,
          "description": "Ghana's premier premium hair destination — custom wigs, bundles, closures, frontals & hair academy.",
          "inLanguage": "en-GH",
          "potentialAction": {
            "@type": "SearchAction",
            "target": { "@type": "EntryPoint", "urlTemplate": `${siteUrl}/shop?search={search_term_string}` },
            "query-input": "required name=search_term_string"
          }
        })}} />

        {/* FAQ Schema for rich results */}
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "FAQPage",
          "mainEntity": [
            { "@type": "Question", "name": "Do you sell 100% human hair wigs in Ghana?", "acceptedAnswer": { "@type": "Answer", "text": "Yes! Luxury Strand Haven specializes in 100% human hair wigs including custom luxury wigs, factory wigs, HD lace frontals and more. All our wigs are premium quality with fast delivery across Ghana." } },
            { "@type": "Question", "name": "What types of hair bundles do you sell?", "acceptedAnswer": { "@type": "Answer", "text": "We sell raw hair bundles and 100% virgin hair bundles in various textures — straight, body wave, deep wave, kinky curly and more. All bundles are sourced from premium raw hair vendors." } },
            { "@type": "Question", "name": "Do you offer custom wig making?", "acceptedAnswer": { "@type": "Answer", "text": "Yes, we offer custom luxury wigs tailored to your specifications — length, density, lace type, color and more. Contact us to place a custom wig order." } },
            { "@type": "Question", "name": "Do you ship across Ghana?", "acceptedAnswer": { "@type": "Answer", "text": "Yes! We offer fast delivery across all regions of Ghana including Accra, Kumasi, Tamale, Takoradi and more." } },
            { "@type": "Question", "name": "Do you offer online hair classes?", "acceptedAnswer": { "@type": "Answer", "text": "Yes! Luxury Strand Haven's Hair Academia offers online classes in wig making, HD lace techniques, hair business management and professional hair styling." } },
            { "@type": "Question", "name": "Do you sell closures and frontals?", "acceptedAnswer": { "@type": "Answer", "text": "Yes, we sell a wide range of HD lace closures and frontals in both raw hair and 100% virgin hair. Available in 4x4, 5x5, 13x4, 13x6 and more." } }
          ]
        })}} />

        {/* LocalBusiness Schema */}
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Store",
          "name": "Luxury Strand Haven",
          "description": "Premium human hair wigs, bundles, closures & frontals. Custom wigs and hair academy. Fast delivery across Ghana.",
          "url": siteUrl,
          "image": `${siteUrl}/og-home.png`,
          "logo": `${siteUrl}/logo.png`,
          "priceRange": "GHS",
          "currenciesAccepted": "GHS",
          "paymentAccepted": "Mobile Money, Bank Transfer, Cash",
          "address": { "@type": "PostalAddress", "addressCountry": "GH", "addressRegion": "Greater Accra" },
          "areaServed": { "@type": "Country", "name": "Ghana" },
          "hasMap": "https://www.google.com/maps/search/Luxury+Strand+Haven+Ghana",
          "sameAs": [
            "https://www.instagram.com/luxurystrandhaven",
            "https://www.facebook.com/luxurystrandhaven"
          ]
        })}} />
      </head>

      {/* Google Analytics */}
      {GA_MEASUREMENT_ID && (
        <>
          <Script
            src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`}
            strategy="afterInteractive"
          />
          <Script id="google-analytics" strategy="afterInteractive">
            {`
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', '${GA_MEASUREMENT_ID}', {
                page_path: window.location.pathname,
              });
            `}
          </Script>
        </>
      )}

      {/* Google reCAPTCHA v3 */}
      {RECAPTCHA_SITE_KEY && (
        <Script
          src={`https://www.google.com/recaptcha/api.js?render=${RECAPTCHA_SITE_KEY}`}
          strategy="afterInteractive"
        />
      )}

      <body className={`antialiased font-sans overflow-x-hidden ${pacifico.variable} ${playfair.variable} ${outfit.variable}`}>
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-[10000] focus:px-6 focus:py-3 focus:bg-gray-900 focus:text-white focus:rounded-lg focus:font-semibold focus:shadow-lg"
        >
          Skip to main content
        </a>
        <CartProvider>
          <WishlistProvider>
            <div id="main-content">
              {children}
            </div>
          </WishlistProvider>
        </CartProvider>
      </body>
    </html>
  );
}
