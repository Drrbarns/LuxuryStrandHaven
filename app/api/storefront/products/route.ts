import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase-admin';

const DEFAULT_LIMIT = 50;
const MAX_LIMIT = 24;

function sortImages(products: any[] | null) {
    if (!products) return [];
    return products.map((p) => {
        const images = Array.isArray(p.product_images)
            ? [...p.product_images].sort(
                  (a, b) => (a?.position ?? 0) - (b?.position ?? 0)
              )
            : p.product_images;
        return { ...p, product_images: images };
    });
}

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const featured = searchParams.get('featured') === 'true';
    const limit = Math.min(
        parseInt(searchParams.get('limit') || String(DEFAULT_LIMIT), 10) || DEFAULT_LIMIT,
        MAX_LIMIT
    );
    const category = searchParams.get('category');

    try {
        let query = supabaseAdmin
            .from('products')
            .select(`
                id, name, slug, price, compare_at_price, quantity, description, metadata, brand, vendor, featured,
                categories(id, name, slug),
                product_images(url, position),
                product_variants(id, name, price, quantity, option1, option2, image_url)
            `)
            .eq('status', 'active');

        if (featured) {
            query = query.eq('featured', true).order('updated_at', { ascending: false }).limit(limit);
        } else if (category) {
            query = query.order('created_at', { ascending: false }).limit(limit);
        } else {
            query = query.order('created_at', { ascending: false }).limit(limit);
        }

        const { data, error } = await query;

        if (error) {
            console.error('[Storefront API] Products error:', error);
            return NextResponse.json({ error: 'Failed to fetch products' }, { status: 500 });
        }

        return NextResponse.json(sortImages(data), {
            headers: {
                'Cache-Control': featured
                    ? 'public, s-maxage=60, stale-while-revalidate=120'
                    : 'public, s-maxage=120, stale-while-revalidate=300',
            },
        });
    } catch (err: unknown) {
        const message = err instanceof Error ? err.message : 'Unknown error';
        console.error('[Storefront API] Error:', err);
        return NextResponse.json({ error: message }, { status: 500 });
    }
}
