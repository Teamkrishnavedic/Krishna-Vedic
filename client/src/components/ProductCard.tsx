import React, { useState } from 'react';
import { Link } from 'react-router-dom';
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
  const [quantity, setQuantity] = useState(1);

  const currentVariant =
    variants.find((v) => v.id === selectedVariantId) || variants[0] || null;

  const currentPrice = currentVariant ? currentVariant.price : 0;
  const compareAtPrice = currentVariant?.compareAtPrice;
  const isOutOfStock = currentVariant
    ? (currentVariant.stock ?? currentVariant.inventoryQty ?? 1) <= 0
    : false;

  // Safe image URL resolver with authentic bull-driven oil & spice fallbacks
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

  const originTag =
    product.name.toLowerCase().includes('mustard')
      ? 'Rajasthan Ghani'
      : product.name.toLowerCase().includes('turmeric')
      ? 'Salem Origin'
      : product.name.toLowerCase().includes('chilli')
      ? 'Guntur & Byadgi'
      : product.name.toLowerCase().includes('sesame')
      ? 'Tamil Chekku'
      : product.name.toLowerCase().includes('coconut')
      ? 'Kerala Palm'
      : product.name.toLowerCase().includes('cumin')
      ? 'Nagaur Desert'
      : product.name.toLowerCase().includes('ghee')
      ? 'Gir Cow Bilona'
      : 'Vedic Provenance';

  const extractionTag =
    product.name.toLowerCase().includes('oil')
      ? 'Bull-Driven Wood Ghani'
      : product.name.toLowerCase().includes('ghee')
      ? 'Hand-Churned Bilona'
      : product.name.toLowerCase().includes('masala')
      ? 'Stone-Pounded Blend'
      : 'Cold Stone Ground';

  const labSpec =
    product.name.toLowerCase().includes('oil')
      ? 'FFA < 0.65% • Raw'
      : product.name.toLowerCase().includes('ghee')
      ? 'A2 Beta-Casein Certified'
      : product.name.toLowerCase().includes('turmeric')
      ? 'Curcumin 5.2% Assayed'
      : product.name.toLowerCase().includes('chilli')
      ? 'Pure Capsaicin • Zero Dyes'
      : 'NABL Lab Certified';

  const handleAddToCartClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (currentVariant && onAddToCart) {
      onAddToCart(currentVariant.id, quantity);
    }
  };

  return (
    <article className="bg-[#fafbf5] flex flex-col rounded-2xl overflow-hidden border border-[#e5e2da] hover:border-[#6e3418] transition-all duration-200">
      {/* Product Visual Header with Badges */}
      <div className="relative overflow-hidden aspect-[4/3] bg-[#f4f4ec] rounded-t-2xl">
        <Link to={`/products/${product.slug}`} className="block w-full h-full">
          <img
            src={imageUrl}
            alt={product.name}
            className="w-full h-full object-cover transition-opacity duration-300"
            loading="lazy"
            onError={(e) => {
              // Fallback if network fails
              (e.target as HTMLImageElement).src =
                'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?auto=format&fit=crop&w=800&q=80';
            }}
          />
        </Link>
        {product.unitsSold && product.unitsSold > 0 ? (
          <span className="absolute top-3 left-3 bg-[#6e3418] text-[#fafbf5] text-[11px] uppercase tracking-wider px-3 py-1 rounded-full font-bold shadow-sm">
            Bestseller • {product.unitsSold} sold
          </span>
        ) : (
          <span className="absolute top-3 left-3 bg-[#3f674f] text-[#fafbf5] font-label-sm text-[11px] uppercase tracking-wider px-3 py-1 rounded-full font-semibold">
            {product.name.toLowerCase().includes('oil')
              ? 'Wood-Pressed'
              : product.name.toLowerCase().includes('masala')
              ? 'Heritage Blend'
              : 'Stone-Ground'}
          </span>
        )}
        <span className="absolute top-3 right-3 bg-[#fafbf5]/95 text-[#6e3418] font-label-sm text-[11px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full border border-[#e5e2da]">
          {originTag}
        </span>
      </div>

      {/* Card Body */}
      <div className="p-5 flex flex-col flex-grow justify-between gap-3.5">
        <div className="space-y-1.5">
          <div className="flex items-center justify-between text-[#7d7567] text-xs">
            <span className="font-semibold text-[#6e3418] uppercase tracking-wider text-[11px]">
              {extractionTag}
            </span>
            <span className="text-[11px] text-[#4a463e] font-medium bg-[#f4f4ec] px-2.5 py-0.5 rounded-full border border-[#e5e2da]">
              {labSpec}
            </span>
          </div>

          <h3 className="font-serif text-base font-bold text-[#2d2a26] hover:text-[#6e3418] transition-colors leading-snug line-clamp-1">
            <Link to={`/products/${product.slug}`}>
              {product.name}
            </Link>
          </h3>

          <p className="text-xs text-[#7d7567] line-clamp-2 leading-relaxed">
            {product.shortDescription ||
              product.description ||
              'Slowly extracted in traditional Vagai wood ghanis below 38°C to retain vital living enzymes, raw aroma, and natural antioxidants.'}
          </p>
        </div>

        {/* Size selector pill row with smooth curves */}
        {variants.length > 0 && (
          <div className="space-y-1.5 pt-1">
            <div className="flex items-center justify-between text-[11px] font-semibold text-[#7d7567] uppercase tracking-wider">
              <span>Select Size:</span>
              <span className="text-[#6e3418] font-bold">
                {currentVariant?.name || currentVariant?.title}
              </span>
            </div>
            <div className="flex flex-wrap gap-1.5 text-xs">
              {variants.map((v) => {
                const isSelected = v.id === currentVariant?.id;
                return (
                  <button
                    key={v.id}
                    type="button"
                    onClick={() => setSelectedVariantId(v.id)}
                    className={`py-1 px-3 text-center transition-all cursor-pointer rounded-full text-xs border ${
                      isSelected
                        ? 'bg-[#6e3418] text-[#fafbf5] border-[#6e3418] font-semibold'
                        : 'bg-[#f4f4ec] text-[#4a463e] border-[#e5e2da] hover:bg-[#e9e9e0]'
                    }`}
                  >
                    {v.name || v.title}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Pricing & Add to Cart */}
        <div className="pt-3 flex flex-col gap-2.5 border-t border-[#e5e2da]">
          <div className="flex items-baseline justify-between">
            <div className="flex items-baseline gap-2">
              <span className="font-serif text-lg text-[#2d2a26] font-bold">
                {formatPrice(currentPrice)}
              </span>
              {compareAtPrice && compareAtPrice > currentPrice && (
                <span className="text-xs text-[#7d7567] line-through">
                  {formatPrice(compareAtPrice)}
                </span>
              )}
            </div>
            <span
              className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${
                isOutOfStock ? 'bg-red-50 text-red-700 border border-red-200' : 'bg-[#eef5f1] text-[#3f674f] border border-[#3f674f]/30'
              }`}
            >
              {isOutOfStock ? 'Out of Stock' : 'Fresh Harvest'}
            </span>
          </div>

          <div className="flex items-center gap-2">
            {/* Quantity stepper with curved edges */}
            <div className="flex items-center bg-[#f4f4ec] border border-[#e5e2da] rounded-xl overflow-hidden">
              <button
                type="button"
                onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                className="w-8 h-9 flex items-center justify-center text-[#2d2a26] hover:bg-[#e5e2da] font-bold text-sm cursor-pointer"
              >
                −
              </button>
              <span className="w-8 text-center text-xs font-semibold text-[#2d2a26]">
                {quantity}
              </span>
              <button
                type="button"
                onClick={() => setQuantity((q) => q + 1)}
                className="w-8 h-9 flex items-center justify-center text-[#2d2a26] hover:bg-[#e5e2da] font-bold text-sm cursor-pointer"
              >
                +
              </button>
            </div>

            {/* Add to Cart button with curved edges */}
            <button
              type="button"
              disabled={isOutOfStock}
              onClick={handleAddToCartClick}
              className="flex-grow bg-[#6e3418] hover:bg-[#522510] text-[#fafbf5] py-2 px-4 rounded-xl text-xs font-semibold uppercase tracking-wider transition-colors flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50 h-9"
            >
              <span className="material-symbols-outlined text-base">shopping_bag</span>
              Add to Basket
            </button>
          </div>
        </div>
      </div>
    </article>
  );
}
