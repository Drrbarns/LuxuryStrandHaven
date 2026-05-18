import { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Luxury Strand Haven',
    short_name: 'LSH Hair',
    description: "Ghana's premier destination for premium human hair wigs, bundles, closures & frontals.",
    start_url: '/',
    display: 'standalone',
    background_color: '#000000',
    theme_color: '#000000',
    orientation: 'portrait-primary',
    categories: ['shopping', 'beauty', 'lifestyle'],
    lang: 'en-GH',
    icons: [
      { src: '/logo.png?v=3', sizes: '192x192', type: 'image/png', purpose: 'any' },
      { src: '/logo.png?v=3', sizes: '192x192', type: 'image/png', purpose: 'maskable' },
      { src: '/logo.png?v=3', sizes: '512x512', type: 'image/png', purpose: 'any' },
      { src: '/logo.png?v=3', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
    ],
    screenshots: [
      { src: '/logo.png?v=3', sizes: '1024x1024', type: 'image/png', label: 'Luxury Strand Haven' },
    ],
    shortcuts: [
      { name: 'Shop Wigs', short_name: 'Wigs', description: 'Browse luxury wigs', url: '/shop?category=wigs', icons: [{ src: '/logo.png?v=3', sizes: '96x96' }] },
      { name: 'Shop Bundles', short_name: 'Bundles', description: 'Browse hair bundles', url: '/shop?category=bundles', icons: [{ src: '/logo.png?v=3', sizes: '96x96' }] },
      { name: 'Academia', short_name: 'Classes', description: 'Online hair classes', url: '/academia', icons: [{ src: '/logo.png?v=3', sizes: '96x96' }] },
    ],
    related_applications: [],
    prefer_related_applications: false,
  };
}
