'use client';

import { use, useEffect, useState } from 'react';
import ProductForm from '@/components/admin/ProductForm';
import { supabase } from '@/lib/supabase';

export default function EditProductPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const [productData, setProductData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchProduct() {
      try {
        const { data, error } = await supabase
          .from('products')
          .select('*')
          .eq('id', resolvedParams.id)
          .single();

        if (error) throw error;

        const [{ data: variants }, { data: images }, { data: extraCategories }] = await Promise.all([
          supabase.from('product_variants').select('*').eq('product_id', resolvedParams.id),
          supabase.from('product_images').select('*').eq('product_id', resolvedParams.id).order('position', { ascending: true }),
          supabase
            .from('product_category_links')
            .select('category_id')
            .eq('product_id', resolvedParams.id),
        ]);

        setProductData({
          ...data,
          product_variants: variants || [],
          product_images: images || [],
          extra_categories: (extraCategories || []).map((r: any) => ({ id: r.category_id })),
        });
      } catch (error) {
        console.error('Error fetching product:', error);
      } finally {
        setLoading(false);
      }
    }

    if (resolvedParams.id) {
      fetchProduct();
    }
  }, [resolvedParams.id]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <i className="ri-loader-4-line text-4xl text-gray-700 animate-spin mb-4 block"></i>
          <p className="text-gray-500 font-medium">Loading product details...</p>
        </div>
      </div>
    );
  }

  if (!productData) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <i className="ri-error-warning-line text-4xl text-red-500 mb-4 block"></i>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Product Not Found</h2>
          <p className="text-gray-600">The product you are trying to edit does not exist or has been deleted.</p>
        </div>
      </div>
    );
  }

  return <ProductForm initialData={productData} isEditMode={true} />;
}
