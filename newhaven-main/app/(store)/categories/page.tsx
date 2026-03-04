import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import ScrollReveal from '@/components/ScrollReveal';

export const revalidate = 0; // Ensure fresh data on every visit

export default async function CategoriesPage() {
  const { data: categoriesData } = await supabase
    .from('categories')
    .select(`
      id,
      name,
      slug,
      description,
      image_url,
      position
    `)
    .eq('status', 'active')
    .order('position', { ascending: true });

  // Palette to cycle through for visual variety since DB doesn't have colors
  const palette = [
    { color: 'from-stone-800 to-stone-900', icon: 'ri-store-2-line', accent: 'bg-stone-100 text-stone-900' },
    { color: 'from-neutral-800 to-neutral-900', icon: 'ri-shopping-bag-3-line', accent: 'bg-neutral-100 text-neutral-900' },
    { color: 'from-zinc-800 to-zinc-900', icon: 'ri-t-shirt-line', accent: 'bg-zinc-100 text-zinc-900' },
    { color: 'from-slate-800 to-slate-900', icon: 'ri-home-smile-line', accent: 'bg-slate-100 text-slate-900' },
    { color: 'from-gray-800 to-gray-900', icon: 'ri-heart-line', accent: 'bg-gray-100 text-gray-900' },
    { color: 'from-ash-800 to-ash-900', icon: 'ri-star-smile-line', accent: 'bg-gray-100 text-gray-900' },
  ];

  const categories = categoriesData?.map((c, i) => {
    const style = palette[i % palette.length];
    return {
      ...c,
      image: c.image_url || 'https://images.unsplash.com/photo-1560869713-7d0a29430803?q=80&w=2626&auto=format&fit=crop',
      color: style.color,
      icon: style.icon,
      accent: style.accent,
      productCount: 'Browse',
    };
  }) || [];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-gray-900 text-white pb-32 lg:pb-48 pt-24 lg:pt-32 relative overflow-hidden">
        <div className="absolute inset-0 opacity-35">
           <img 
            src="https://images.unsplash.com/photo-1560869713-7d0a29430803?q=80&w=2626&auto=format&fit=crop" 
            alt="Categories Background" 
            className="w-full h-full object-cover"
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-b from-gray-900/50 to-gray-900"></div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6 tracking-tight">Collections</h1>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto leading-relaxed font-light">
            Explore our curated selection of premium hair products and accessories.
          </p>
        </div>
      </div>

      <ScrollReveal direction="up" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-24 lg:-mt-32 relative z-20 pb-24">
        {categories.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {categories.map((category, index) => (
              <Link
                key={category.id}
                href={`/shop?category=${category.slug}`}
                className={`group relative overflow-hidden rounded-3xl aspect-[4/5] cursor-pointer shadow-sm hover:shadow-2xl transition-all duration-500 hover-lift ${index % 3 === 1 ? 'lg:translate-y-12' : ''}`}
              >
                <div className="absolute inset-0 bg-gray-200">
                  <img
                    src={category.image}
                    alt={category.name}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-60 group-hover:opacity-80 transition-opacity duration-500"></div>
                </div>
                
                <div className="absolute inset-0 p-8 flex flex-col justify-end text-white">
                  <div className="transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                    <div className="flex items-center gap-3 mb-4 opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-100">
                      <span className={`inline-flex items-center justify-center w-10 h-10 rounded-full bg-white/20 backdrop-blur-md`}>
                        <i className={`${category.icon} text-xl`}></i>
                      </span>
                      <span className="text-sm font-medium tracking-wide uppercase text-gray-200">Collection</span>
                    </div>
                    
                    <h3 className="text-3xl font-bold mb-3 leading-tight">{category.name}</h3>
                    
                    <p className="text-gray-300 line-clamp-2 mb-6 opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-200 text-sm leading-relaxed max-w-[90%]">
                      {category.description || 'Discover our exclusive range of products in this category, designed for quality and style.'}
                    </p>
                    
                    <div className="flex items-center gap-2 font-medium text-sm border-b border-white/30 pb-1 w-fit group-hover:border-white transition-colors duration-300">
                      <span>Explore Collection</span>
                      <i className="ri-arrow-right-line group-hover:translate-x-1 transition-transform"></i>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center py-32 bg-white rounded-3xl border border-dashed border-gray-200 shadow-xl">
            <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6 shadow-sm">
              <i className="ri-store-2-line text-4xl text-gray-300"></i>
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">No collections found</h3>
            <p className="text-gray-500">Check back soon for new arrivals.</p>
          </div>
        )}
      </ScrollReveal>

      <ScrollReveal direction="scale" className="bg-gray-900 text-white py-24 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
          <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-gray-800 to-transparent"></div>
          <div className="absolute bottom-0 left-0 w-1/2 h-full bg-gradient-to-r from-gray-800 to-transparent"></div>
        </div>
        
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <span className="inline-block py-1 px-3 rounded-full bg-white/10 backdrop-blur-sm text-sm font-medium mb-6 border border-white/10">
            Need Help?
          </span>
          <h2 className="text-4xl md:text-5xl font-bold mb-6 tracking-tight">Can't Find What You're Looking For?</h2>
          <p className="text-xl text-gray-300 mb-10 leading-relaxed max-w-2xl mx-auto">
            Our stylists are here to help you find the perfect match. Try our advanced search or get in touch for personalized recommendations.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link
              href="/shop"
              className="inline-flex items-center gap-2 bg-white text-gray-900 px-8 py-4 rounded-full font-bold hover:bg-gray-100 transition-all hover:shadow-lg hover:-translate-y-1"
            >
              <i className="ri-search-line"></i>
              Browse All Products
            </Link>
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 bg-transparent border border-white text-white px-8 py-4 rounded-full font-bold hover:bg-white/10 transition-all hover:-translate-y-1"
            >
              <i className="ri-customer-service-line"></i>
              Contact Support
            </Link>
          </div>
        </div>
      </ScrollReveal>
    </div>
  );
}
