import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Check } from 'lucide-react';
import { formatPrice } from '@/lib/utils';

interface Variant {
  id: string;
  name?: string;
  title?: string;
  sku: string;
  price: number;
  compareAtPrice?: number;
  stock: number;
  inventoryQty?: number;
}

interface Product {
  id: string;
  name: string;
  slug: string;
  shortDescription?: string;
  description?: string;
  category?: { name: string; slug: string };
  images: any[];
  variants?: Variant[];
  unitsSold?: number;
}

interface ProductCardProps {
  product: Product;
  onAddToCart?: (variantId: string, quantity: number) => void;
}

export default function ProductCard({ product, onAddToCart }: ProductCardProps) {
  const variants = product.variants || [];
  const [selectedVariantId, setSelectedVariantId] = useState<string>(
    variants[0]?.id || ''
  );
  const [added, setAdded] = useState(false);

  const currentVariant =
    variants.find((v) => v.id === selectedVariantId) || variants[0] || null;

  const currentPrice = currentVariant ? currentVariant.price : 0;
  const compareAtPrice = currentVariant?.compareAtPrice;
  const isOutOfStock = currentVariant
    ? (currentVariant.stock ?? currentVariant.inventoryQty ?? 1) <= 0
    : false;

  // Safe image URL resolver with authentic artisanal fallbacks
  const getImageUrl = () => {
    const first = product.images?.[0];
    if (typeof first === 'string' && first.startsWith('http')) return first;
    if (typeof first === 'object' && first?.url) return first.url;

    const name = product.name.toLowerCase();
    if (name.includes('mustard') || name.includes('sarson')) {
      return 'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?auto=format&fit=crop&w=800&q=80';
    }
    if (name.includes('sesame') || name.includes('til')) {
      return 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&w=800&q=80';
    }
    if (name.includes('coconut') || name.includes('nariyal')) {
      return 'https://images.unsplash.com/photo-1526947425960-945c6e72858f?auto=format&fit=crop&w=800&q=80';
    }
    if (name.includes('ghee') || name.includes('bilona')) {
      return 'https://images.unsplash.com/photo-1631451095765-2c91616fc9e6?auto=format&fit=crop&w=800&q=80';
    }
    if (name.includes('groundnut') || name.includes('peanut')) {
      return 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?auto=format&fit=crop&w=800&q=80';
    }
    if (name.includes('turmeric') || name.includes('haldi')) {
      return 'https://images.unsplash.com/photo-1615485500704-8e990f9900f7?auto=format&fit=crop&w=800&q=80';
    }
    if (name.includes('chilli') || name.includes('mirch')) {
      return 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?auto=format&fit=crop&w=800&q=80';
    }
    if (name.includes('coriander') || name.includes('dhaniya')) {
      return 'https://images.unsplash.com/photo-1532336414038-cf19250c5757?auto=format&fit=crop&w=800&q=80';
    }
    if (name.includes('pepper') || name.includes('laung') || name.includes('clove') || name.includes('cinnamon')) {
      return 'https://images.unsplash.com/photo-1509358271058-acd22cc93898?auto=format&fit=crop&w=800&q=80';
    }
    if (name.includes('saffron') || name.includes('kesar')) {
      return 'https://images.unsplash.com/photo-1514733670139-4d87a1941d55?auto=format&fit=crop&w=800&q=80';
    }
    if (name.includes('cardamom') || name.includes('elaichi')) {
      return 'https://images.unsplash.com/photo-1599940824399-b87987ceb72a?auto=format&fit=crop&w=800&q=80';
    }
    if (name.includes('garam masala') || name.includes('biryani') || name.includes('curry') || name.includes('sambhar')) {
      return 'https://images.unsplash.com/photo-1585032226651-759b368d7246?auto=format&fit=crop&w=800&q=80';
    }
    if (name.includes('chest') || name.includes('box') || name.includes('hamper')) {
      return 'https://images.unsplash.com/photo-1513885535751-8b9238bd345a?auto=format&fit=crop&w=800&q=80';
    }
    return 'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?auto=format&fit=crop&w=800&q=80';
  };

  const imageUrl = getImageUrl();

  const handleAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (currentVariant && onAddToCart && !isOutOfStock) {
      onAddToCart(currentVariant.id, 1);
      setAdded(true);
      setTimeout(() => setAdded(false), 1200);
    }
  };

  return (
    <article className="group bg-[#fafbf5] flex flex-col rounded-2xl overflow-hidden border border-[#e5e2da] hover:border-[#6e3418]/40 hover:shadow-md transition-all duration-300">
      {/* ─── 1. Product Image: 1:1 Square, Clean & Spacious ─────────── */}
      <div className="relative aspect-square w-full overflow-hidden bg-[#f4f4ec]">
        <Link to={`/products/${product.slug}`} className="block w-full h-full">
          <img
            src={imageUrl}
            alt={product.name}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            loading="lazy"
            onError={(e) => {
              (e.target as HTMLImageElement).src =
                'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?auto=format&fit=crop&w=800&q=80';
            }}
          />
        </Link>

        {/* Single subtle tag: Bestseller or Sale only — never overlapping tags */}
        {product.unitsSold && product.unitsSold > 0 ? (
          <span className="absolute top-2.5 left-2.5 bg-[#6e3418] text-[#fafbf5] text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full shadow-xs">
            Bestseller
          </span>
        ) : compareAtPrice && compareAtPrice > currentPrice ? (
          <span className="absolute top-2.5 left-2.5 bg-[#3f674f] text-[#fafbf5] text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full shadow-xs">
            Save {Math.round(((compareAtPrice - currentPrice) / compareAtPrice) * 100)}%
          </span>
        ) : null}
      </div>

      {/* ─── 2. Product Details ─────────────────────────────────────── */}
      <div className="p-3 sm:p-4 flex flex-col flex-grow justify-between gap-2.5">
        <div>
          {/* Category subtitle */}
          <p className="text-[10px] sm:text-[11px] uppercase tracking-wider font-semibold text-[#7d7567] truncate">
            {product.category?.name || 'Artisan Pantry'}
          </p>

          {/* Product Title: 2 lines max, legible, never awkwardly truncated */}
          <h3 className="font-serif text-sm sm:text-base font-bold text-[#2d2a26] group-hover:text-[#6e3418] transition-colors leading-snug line-clamp-2 mt-1 min-h-[2.5rem]">
            <Link to={`/products/${product.slug}`}>
              {product.name}
            </Link>
          </h3>
        </div>

        {/* ─── 3. Variant Selector (if more than 1 size) ───────────── */}
        {variants.length > 1 && (
          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-0.5">
            {variants.map((v) => {
              const isSelected = v.id === currentVariant?.id;
              return (
                <button
                  key={v.id}
                  type="button"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    setSelectedVariantId(v.id);
                  }}
                  className={`text-[10px] sm:text-[11px] px-2 py-0.5 rounded-full border transition-all cursor-pointer whitespace-nowrap font-medium ${
                    isSelected
                      ? 'bg-[#6e3418] text-[#fafbf5] border-[#6e3418] font-semibold'
                      : 'bg-[#f4f4ec] text-[#52443c] border-[#e5e2da] hover:border-[#6e3418]/40'
                  }`}
                >
                  {v.name || v.title}
                </button>
              );
            })}
          </div>
        )}

        {/* ─── 4. Price & Action ───────────────────────────────────── */}
        <div className="pt-2 border-t border-[#e5e2da] flex items-center justify-between gap-2">
          <div className="flex flex-col min-w-0">
            <div className="flex items-baseline gap-1.5 flex-wrap">
              <span className="font-sans text-base sm:text-lg font-bold text-[#2d2a26] tracking-tight">
                {formatPrice(currentPrice)}
              </span>
              {compareAtPrice && compareAtPrice > currentPrice && (
                <span className="font-sans text-xs text-[#7d7567] line-through">
                  {formatPrice(compareAtPrice)}
                </span>
              )}
            </div>
            {variants.length === 1 && (
              <span className="text-[10px] text-[#7d7567] font-medium truncate">
                {variants[0].name || variants[0].title}
              </span>
            )}
          </div>

          {/* Quick Add Button */}
          <button
            type="button"
            disabled={isOutOfStock}
            onClick={handleAdd}
            className={`px-3 py-1.5 sm:px-3.5 sm:py-1.5 rounded-full text-xs font-semibold uppercase tracking-wider transition-all flex items-center gap-1 cursor-pointer active:scale-95 shrink-0 ${
              isOutOfStock
                ? 'bg-neutral-200 text-neutral-400 cursor-not-allowed'
                : added
                ? 'bg-[#3f674f] text-[#fafbf5]'
                : 'bg-[#6e3418] hover:bg-[#522510] text-[#fafbf5] shadow-xs'
            }`}
          >
            {isOutOfStock ? (
              <span className="text-[10px]">Sold Out</span>
            ) : added ? (
              <>
                <Check className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Added</span>
              </>
            ) : (
              <>
                <Plus className="w-3.5 h-3.5" />
                <span>Add</span>
              </>
            )}
          </button>
        </div>
      </div>
    </article>
  );
}
