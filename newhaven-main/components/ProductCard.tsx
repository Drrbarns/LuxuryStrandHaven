'use client';

import { useState } from 'react';
import Link from 'next/link';
import LazyImage from './LazyImage';
import { useCart } from '@/context/CartContext';

// Map common color names to hex values for swatches
const COLOR_MAP: Record<string, string> = {
  black: '#000000', white: '#FFFFFF', red: '#EF4444', blue: '#3B82F6',
  navy: '#1E3A5F', green: '#22C55E', yellow: '#EAB308', orange: '#F97316',
  pink: '#EC4899', purple: '#A855F7', brown: '#92400E', beige: '#D4C5A9',
  grey: '#6B7280', gray: '#6B7280', cream: '#FFFDD0', teal: '#14B8A6',
  maroon: '#800000', coral: '#FF7F50', burgundy: '#800020', olive: '#808000',
  tan: '#D2B48C', khaki: '#C3B091', charcoal: '#36454F', ivory: '#FFFFF0',
  gold: '#FFD700', silver: '#C0C0C0', rose: '#FF007F', lavender: '#E6E6FA',
  mint: '#98FB98', peach: '#FFDAB9', wine: '#722F37', denim: '#1560BD',
  nude: '#E3BC9A', camel: '#C19A6B', sage: '#BCB88A', rust: '#B7410E',
  mustard: '#FFDB58', plum: '#8E4585', lilac: '#C8A2C8', stone: '#928E85',
  sand: '#C2B280', taupe: '#483C32', mauve: '#E0B0FF', sky: '#87CEEB',
  forest: '#228B22', cobalt: '#0047AB', emerald: '#50C878', scarlet: '#FF2400',
  aqua: '#00FFFF', turquoise: '#40E0D0', indigo: '#4B0082', crimson: '#DC143C',
  magenta: '#FF00FF', cyan: '#00FFFF', chocolate: '#7B3F00', coffee: '#6F4E37',
};

export function getColorHex(colorName: string): string | null {
  const lower = colorName.toLowerCase().trim();
  if (COLOR_MAP[lower]) return COLOR_MAP[lower];
  for (const [key, val] of Object.entries(COLOR_MAP)) {
    if (lower.includes(key)) return val;
  }
  return null;
}

export interface ColorVariant {
  name: string;
  hex: string;
}

interface ProductCardProps {
  id: string;
  slug: string;
  name: string;
  price: number;
  originalPrice?: number;
  image: string;
  rating?: number;
  reviewCount?: number;
  badge?: string;
  inStock?: boolean;
  maxStock?: number;
  moq?: number;
  hasVariants?: boolean;
  minVariantPrice?: number;
  colorVariants?: ColorVariant[];
  brand?: string;
}

export default function ProductCard({
  id,
  slug,
  name,
  price,
  originalPrice,
  image,
  rating = 5,
  reviewCount = 0,
  badge,
  inStock = true,
  maxStock = 50,
  moq = 1,
  hasVariants = false,
  minVariantPrice,
  colorVariants = [],
  brand,
}: ProductCardProps) {
  const { addToCart } = useCart();
  const [activeColor, setActiveColor] = useState<string | null>(null);
  const displayPrice = hasVariants && minVariantPrice ? minVariantPrice : price;
  const discount = originalPrice ? Math.round((1 - displayPrice / originalPrice) * 100) : 0;
  const MAX_SWATCHES = 5;

  const formatPrice = (val: number) => `GH₵${val.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

  return (
    <div className="group bg-white h-full flex flex-col">
      {/* Image: full width, square-ish, no rounded corners */}
      <Link
        href={`/product/${slug}`}
        className="relative block aspect-[3/4] overflow-hidden bg-gray-100"
      >
        <LazyImage
          src={image}
          alt={name}
          className="w-full h-full object-cover object-top group-hover:scale-[1.02] transition-transform duration-500"
        />
        {badge && (
          <span className="absolute top-3 left-3 bg-white/90 text-gray-900 text-[10px] uppercase tracking-wider font-semibold px-2.5 py-1">
            {badge}
          </span>
        )}
        {discount > 0 && (
          <span className="absolute top-3 left-3 bg-red-50 text-red-700 text-[10px] uppercase tracking-wider font-semibold px-2.5 py-1">
            -{discount}%
          </span>
        )}
        {!inStock && (
          <div className="absolute inset-0 bg-white/70 flex items-center justify-center">
            <span className="text-gray-900 text-sm font-medium">Out of Stock</span>
          </div>
        )}
      </Link>

      {/* Product info: left-aligned, serif name/brand, bold price */}
      <div className="flex flex-col flex-grow pt-4 pb-2 text-left">
        <Link href={`/product/${slug}`} className="mb-0.5">
          <h3 className="font-serif text-[1.05rem] leading-snug text-black font-medium line-clamp-2 group-hover:underline">
            {name}
          </h3>
        </Link>
        {brand && (
          <p className="font-serif text-sm text-black/80 font-normal mb-1.5">
            {brand}
          </p>
        )}

        {colorVariants.length > 0 && (
          <div className="flex items-center gap-1.5 mb-2">
            {colorVariants.slice(0, MAX_SWATCHES).map((color) => (
              <button
                key={color.name}
                title={color.name}
                onClick={(e) => {
                  e.preventDefault();
                  setActiveColor(activeColor === color.name ? null : color.name);
                }}
                className={`w-4 h-4 rounded-full border transition-all duration-200 flex-shrink-0 ${
                  activeColor === color.name
                    ? 'ring-2 ring-offset-1 ring-black'
                    : 'hover:scale-110'
                } ${color.hex === '#FFFFFF' ? 'border-gray-300' : 'border-transparent'}`}
                style={{ backgroundColor: color.hex }}
              />
            ))}
            {colorVariants.length > MAX_SWATCHES && (
              <span className="text-xs text-gray-400 ml-0.5">+{colorVariants.length - MAX_SWATCHES}</span>
            )}
          </div>
        )}

        <div className="mb-3">
          {hasVariants && minVariantPrice != null ? (
            <span className="font-sans text-xl font-bold text-black">From {formatPrice(minVariantPrice)}</span>
          ) : (
            <span className="font-sans text-xl font-bold text-black">{formatPrice(price)}</span>
          )}
          {originalPrice && originalPrice > price && (
            <span className="font-sans text-sm text-gray-500 line-through ml-2">{formatPrice(originalPrice)}</span>
          )}
        </div>

        {/* Add to cart: full width, thin black border, transparent bg */}
        {hasVariants ? (
          <Link
            href={`/product/${slug}`}
            className="w-full border border-black py-3 px-4 text-center text-black font-medium text-sm hover:bg-black hover:text-white transition-colors"
          >
            Select Options
          </Link>
        ) : (
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              addToCart({ id, name, price, image, quantity: moq, slug, maxStock, moq });
            }}
            disabled={!inStock}
            className="w-full border border-black py-3 px-4 text-center text-black font-medium text-sm hover:bg-black hover:text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Add to cart
          </button>
        )}
      </div>
    </div>
  );
}
