'use client';

import Link from 'next/link';
import { useCMS } from '@/context/CMSContext';
import { usePageTitle } from '@/hooks/usePageTitle';

export default function AboutPage() {
  usePageTitle('Our Story');
  const { getSetting } = useCMS();

  const siteName = getSetting('site_name') || 'Luxury Strand Haven';

  // CMS-driven content
  const heroTitle = getSetting('about_hero_title') || 'Our Story';
  const heroSubtitle = getSetting('about_hero_subtitle') || 'A journey of passion, quality, and beauty.';
  const storyTitle = getSetting('about_story_title') || 'From Passion to Business';
  const storyContent = getSetting('about_story_content') || '';
  const storyImage = getSetting('about_story_image') || '/hero4.jpeg';
  const founderName = getSetting('about_founder_name') || 'Founder';
  const founderTitle = getSetting('about_founder_title') || 'CEO';
  const mission1Title = getSetting('about_mission1_title') || 'Direct Sourcing';
  const mission1Content = getSetting('about_mission1_content') || '';
  const mission2Title = getSetting('about_mission2_title') || 'Quality For Everyone';
  const mission2Content = getSetting('about_mission2_content') || '';
  const valuesTitle = getSetting('about_values_title') || 'Why Shop With Us?';
  const valuesSubtitle = getSetting('about_values_subtitle') || 'Quality and value, guaranteed.';
  const ctaTitle = getSetting('about_cta_title') || 'Ready to experience the difference?';
  const ctaSubtitle = getSetting('about_cta_subtitle') || 'Join thousands of happy customers.';

  // Story paragraphs (split by newlines)
  const storyParagraphs = storyContent.split('\n').filter((p: string) => p.trim());

  const values = [
    {
      icon: 'ri-verified-badge-line',
      title: 'Authenticity',
      description: 'Handpicked with care. We document the sourcing journey so you know exactly what you are buying.'
    },
    {
      icon: 'ri-money-dollar-circle-line',
      title: 'Unbeatable Value',
      description: 'Direct from the factory to you. We cut out the middleman to offer premium quality at wholesale prices.'
    },
    {
      icon: 'ri-star-smile-line',
      title: 'Quality Assured',
      description: 'Every product is inspected personally. If it doesn\'t meet our standards, it doesn\'t make it to the store.'
    },
    {
      icon: 'ri-group-line',
      title: 'Community First',
      description: 'Built on trust and connection. We listen to our customers and find the products you actually want.'
    }
  ];

  return (
    <div className="min-h-screen bg-white font-sans">
      <div className="bg-black text-white pb-32 lg:pb-48 pt-24 lg:pt-32 relative overflow-hidden">
        <div className="absolute inset-0 opacity-40">
          <img
            src="/hero7.jpeg"
            alt="About Background"
            className="w-full h-full object-cover"
            onError={(e) => { const t = e.currentTarget; if (t.src !== '/hero7.jpeg') t.src = '/hero6.jpeg'; }}
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 to-black"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <h1 className="text-4xl md:text-6xl font-serif mb-6 tracking-tight text-white drop-shadow-lg">{heroTitle}</h1>
          <p className="text-xl text-gray-200 max-w-2xl mx-auto leading-relaxed font-light">
            {heroSubtitle}
          </p>
        </div>
      </div>

      {/* Story Section - Scrolling Narrative */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-24 lg:-mt-32 relative z-20 pb-24">
        <div className="bg-white rounded-3xl shadow-xl p-8 lg:p-12 border border-gray-100">
          <div className="grid lg:grid-cols-2 gap-16 lg:gap-24 items-center">
            <div className="order-2 lg:order-1 relative">
              <div className="relative z-10 rounded-3xl overflow-hidden shadow-2xl aspect-[4/5] lg:aspect-[3/4]">
                <img
                  src="/hero4.jpeg"
                  alt={`${founderName} - ${founderTitle}`}
                  className="w-full h-full object-cover object-center transition-transform duration-700 hover:scale-105 filter contrast-110"
                  onError={(e) => { const t = e.currentTarget; if (t.src !== '/hero4.jpeg') t.src = '/hero3.jpeg'; }}
                />
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-gray-900/90 via-gray-900/40 to-transparent p-8 lg:p-12 text-white">
                  <p className="font-serif text-2xl mb-1">{founderName}</p>
                  <p className="text-gray-300 font-medium tracking-wide uppercase text-sm">{founderTitle}</p>
                </div>
              </div>

              {/* Decorative Elements */}
              <div className="absolute -top-12 -left-12 w-64 h-64 bg-stone-100 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob"></div>
              <div className="absolute -bottom-12 -right-12 w-64 h-64 bg-stone-200 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob animation-delay-2000"></div>
            </div>

            <div className="order-1 lg:order-2">
              <span className="inline-block py-1 px-3 rounded-full bg-stone-100 text-gray-900 text-xs font-bold mb-6 tracking-wide uppercase">
                Our Beginning
              </span>
              <h2 className="text-4xl lg:text-5xl font-serif text-gray-900 mb-8 leading-tight">{storyTitle}</h2>
              <div className="space-y-6 text-lg text-gray-600 leading-relaxed font-light">
                {storyParagraphs.length > 0 ? (
                  storyParagraphs.map((p: string, i: number) => <p key={i}>{p}</p>)
                ) : (
                  <>
                    <p>
                      Our journey started with a simple vision: to bring quality products directly to you at prices that make sense.
                    </p>
                    <p>
                      By sourcing directly and cutting out middlemen, we pass the savings on to our customers while maintaining the highest quality standards.
                    </p>
                    <p>
                      <strong className="font-bold text-gray-900">{siteName}</strong> was born from this commitment to quality, value, and community. We believe that everyone deserves to feel beautiful and confident.
                    </p>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Mission Section - Split Cards */}
      <section className="bg-stone-50 py-24 lg:py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-20">
            <span className="text-gray-500 font-medium tracking-widest uppercase text-xs mb-3 block">Our Mission</span>
            <h2 className="text-3xl md:text-4xl font-serif text-gray-900">What Drives Us Forward</h2>
          </div>

          <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
            <div className="bg-white p-10 lg:p-14 rounded-3xl shadow-sm border border-stone-100 hover:shadow-xl transition-all duration-300 group">
              <div className="w-16 h-16 bg-black rounded-2xl flex items-center justify-center mb-8 shadow-lg group-hover:scale-110 transition-transform duration-300">
                <i className="ri-plane-line text-3xl text-white"></i>
              </div>
              <h3 className="text-2xl font-serif text-gray-900 mb-4">{mission1Title}</h3>
              <p className="text-gray-600 text-lg leading-relaxed font-light">
                {mission1Content || 'We believe in going to the source. By visiting manufacturers directly, we eliminate middlemen who inflate prices. This hands-on approach guarantees that you aren\'t paying for invisible markups—just great products.'}
              </p>
            </div>

            <div className="bg-black p-10 lg:p-14 rounded-3xl shadow-sm hover:shadow-xl transition-all duration-300 group text-white">
              <div className="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center mb-8 shadow-inner group-hover:scale-110 transition-transform duration-300">
                <i className="ri-heart-line text-3xl text-white"></i>
              </div>
              <h3 className="text-2xl font-serif mb-4">{mission2Title}</h3>
              <p className="text-gray-300 text-lg leading-relaxed font-light">
                {mission2Content || '"Luxury" shouldn\'t be exclusive. Our mission is to democratize access to quality goods. Whether it\'s skincare, fashion, or home essentials, we believe everyone deserves the best, regardless of their budget.'}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section - Grid */}
      <section className="py-24 lg:py-32 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
            <div className="max-w-2xl">
              <h2 className="text-4xl font-serif text-gray-900 mb-4">{valuesTitle}</h2>
              <p className="text-xl text-gray-600 font-light">{valuesSubtitle}</p>
            </div>
            <Link href="/shop" className="inline-flex items-center gap-2 text-gray-900 font-bold hover:gap-4 transition-all">
              Start Shopping <i className="ri-arrow-right-line"></i>
            </Link>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <div key={index} className="bg-stone-50 p-8 rounded-2xl hover:bg-white hover:shadow-xl transition-all duration-300 border border-transparent hover:border-gray-100 group">
                <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center mb-6 shadow-sm group-hover:bg-black transition-colors duration-300">
                  <i className={`${value.icon} text-2xl text-gray-900 group-hover:text-white transition-colors duration-300`}></i>
                </div>
                <h3 className="text-xl font-serif text-gray-900 mb-3">{value.title}</h3>
                <p className="text-gray-600 leading-relaxed font-light text-sm">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-black relative overflow-hidden flex items-center justify-center">
        <div className="absolute inset-0 opacity-30">
          <img
            src="https://images.unsplash.com/photo-1562322140-8baeececf3df?q=80&w=2669&auto=format&fit=crop"
            alt="Background"
            className="w-full h-full object-cover grayscale"
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/80 to-black/60"></div>

        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10 text-white">
          <h2 className="text-4xl md:text-6xl font-serif mb-8 tracking-tight drop-shadow-lg">{ctaTitle}</h2>
          <p className="text-xl md:text-2xl text-gray-300 mb-12 leading-relaxed font-light max-w-2xl mx-auto">
            {ctaSubtitle}
          </p>
          <Link
            href="/shop"
            className="inline-flex items-center gap-3 bg-white text-gray-900 px-10 py-5 rounded-full font-bold text-lg hover:bg-gray-100 transition-colors shadow-lg hover:shadow-white/20 transform hover:-translate-y-1"
          >
            Start Shopping
            <i className="ri-arrow-right-line"></i>
          </Link>
        </div>
      </section>
    </div>
  );
}
