import React, { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import api from '@/lib/api';
import { formatPrice, discountPercent } from '@/lib/utils';
import { useCart } from '@/context/CartContext';
import { useToast } from '@/context/ToastContext';
import ProductCard from '@/components/ProductCard';

export default function ProductPage() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const { addItem } = useCart();
  const { toast } = useToast();

  const [selectedVariantId, setSelectedVariantId] = useState<string | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [activeTab, setActiveTab] = useState<'description' | 'benefits' | 'usage' | 'quality'>('description');
  const [isAdding, setIsAdding] = useState(false);

  const { data: product, isLoading, error } = useQuery({
    queryKey: ['product', slug],
    queryFn: async () => {
      const res = await api.get(`/products/${slug}`);
      return res.data.product;
    },
    enabled: !!slug,
  });

  const { data: relatedProducts } = useQuery({
    queryKey: ['related-products', product?.categoryId],
    queryFn: async () => {
      if (!product?.categoryId) return [];
      const res = await api.get(`/products?categoryId=${product.categoryId}&limit=4`);
      return res.data.products.filter((p: any) => p.id !== product.id).slice(0, 4);
    },
    enabled: !!product?.categoryId,
  });

  const variants = product?.variants || [];
  const currentVariant = variants.find((v: any) => v.id === selectedVariantId) || variants[0] || null;

  const handleVariantSelect = (vId: string) => {
    setSelectedVariantId(vId);
    setQuantity(1);
  };

  const handleAddToCart = async (goToCheckout = false) => {
    if (!currentVariant) return;
    try {
      setIsAdding(true);
      await addItem(currentVariant.id, quantity);
      const varLabel = currentVariant.name || currentVariant.title || 'Standard';
      toast({
        title: 'Added to Basket',
        description: `${product.name} (${varLabel}) added.`,
        variant: 'success',
      });
      if (goToCheckout) {
        navigate('/checkout');
      }
    } catch (err: any) {
      toast({
        title: 'Could Not Add',
        description: err.response?.data?.message || 'Error updating basket',
        variant: 'error',
      });
    } finally {
      setIsAdding(false);
    }
  };

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-gutter-mobile md:px-margin py-20 text-center text-on-surface-variant font-serif text-xl">
        Retrieving harvest lot records...
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center">
        <h1 className="font-serif text-3xl text-on-surface mb-3">Product Not Found</h1>
        <p className="text-on-surface-variant max-w-md mx-auto mb-8 text-sm">
          This harvest item could not be located in our current lot inventory.
        </p>
        <Link
          to="/shop"
          className="bg-primary text-on-primary font-label-md text-label-md uppercase px-8 py-3.5 tracking-wider hover:bg-secondary transition-colors inline-block font-semibold"
        >
          Browse Catalogue
        </Link>
      </div>
    );
  }

  const rawImages = product.images || [];
  const images: string[] = rawImages
    .map((img: any) => (typeof img === 'string' ? img : img?.url))
    .filter(Boolean);

  if (images.length === 0) {
    const name = product.name?.toLowerCase() || '';
    if (name.includes('mustard') || name.includes('sarson')) {
      images.push('https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?auto=format&fit=crop&w=800&q=80');
    } else if (name.includes('sesame') || name.includes('til')) {
      images.push('https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&w=800&q=80');
    } else if (name.includes('coconut') || name.includes('nariyal')) {
      images.push('https://images.unsplash.com/photo-1526947425960-945c6e72858f?auto=format&fit=crop&w=800&q=80');
    } else if (name.includes('ghee') || name.includes('bilona')) {
      images.push('https://images.unsplash.com/photo-1631451095765-2c91616fc9e6?auto=format&fit=crop&w=800&q=80');
    } else if (name.includes('turmeric') || name.includes('haldi')) {
      images.push('https://images.unsplash.com/photo-1615485500704-8e990f9900f7?auto=format&fit=crop&w=800&q=80');
    } else {
      images.push('https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?auto=format&fit=crop&w=800&q=80');
    }
  }

  const discount = currentVariant?.compareAtPrice
    ? discountPercent(currentVariant.compareAtPrice, currentVariant.price)
    : 0;

  const isPricePending = !currentVariant?.price || currentVariant.price <= 0;
  const currentStock = currentVariant?.stock ?? currentVariant?.inventoryQty ?? 10;
  const isOutOfStock = currentVariant ? (isPricePending || currentStock <= 0) : false;
  const isLowStock = currentVariant && !isPricePending ? currentStock > 0 && currentStock <= 5 : false;

  return (
    <div className="max-w-7xl mx-auto px-gutter-mobile md:px-margin py-10">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-xs text-on-surface-variant uppercase tracking-wider mb-8">
        <Link to="/" className="hover:text-primary transition-colors">Home</Link>
        <span className="text-outline">/</span>
        <Link to="/shop" className="hover:text-primary transition-colors">Shop</Link>
        <span className="text-outline">/</span>
        {product.category && (
          <>
            <Link to={`/shop/${product.category.slug}`} className="hover:text-primary transition-colors">
              {product.category.name}
            </Link>
            <span className="text-outline">/</span>
          </>
        )}
        <span className="text-primary font-semibold truncate max-w-xs">{product.name}</span>
      </nav>

      {/* Main product showcase */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start mb-20">
        {/* Images - 7 cols */}
        <div className="lg:col-span-7 space-y-4">
          <div className="relative aspect-square sm:aspect-[4/3] bg-surface-container-high border border-outline-variant/30 rounded-3xl overflow-hidden shadow-md">
            <img
              src={images[selectedImageIndex]}
              alt={product.name}
              className="w-full h-full object-cover transition-opacity duration-300"
              onError={(e) => {
                (e.target as HTMLImageElement).src =
                  'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?auto=format&fit=crop&w=1000&q=80';
              }}
            />
            {discount > 0 && (
              <span className="absolute top-4 left-4 bg-primary text-on-primary font-label-sm text-xs uppercase tracking-widest px-3.5 py-1.5 rounded-full font-semibold shadow-xs">
                Save {discount}%
              </span>
            )}
          </div>

          {images.length > 1 && (
            <div className="flex gap-3 overflow-x-auto pb-2 no-scrollbar">
              {images.map((img: string, idx: number) => (
                <button
                  key={idx}
                  onClick={() => setSelectedImageIndex(idx)}
                  className={`relative w-20 h-20 flex-shrink-0 rounded-2xl overflow-hidden border-2 transition-all cursor-pointer ${
                    selectedImageIndex === idx ? 'border-primary ring-2 ring-primary/20' : 'border-outline-variant/40 hover:border-primary'
                  }`}
                >
                  <img src={img} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Product Info - 5 cols */}
        <div className="lg:col-span-5 space-y-6">
          <div>
            {product.category && (
              <span className="text-xs uppercase font-bold tracking-widest text-secondary mb-1 block">
                {product.category.name}
              </span>
            )}
            <h1 className="font-headline-lg text-headline-lg text-primary font-serif leading-tight">
              {product.name}
            </h1>
          </div>

          {/* Pricing */}
          <div className="flex items-baseline gap-3 pb-4 border-b border-outline-variant/30">
            {isPricePending ? (
              <div className="flex items-center gap-3">
                <span className="text-xl font-bold font-serif bg-amber-50 text-amber-900 border border-amber-200 px-3.5 py-1 rounded-full">
                  Price on Request
                </span>
                <span className="text-xs text-on-surface-variant font-medium">Awaiting price review</span>
              </div>
            ) : (
              <>
                <span className="text-3xl font-bold text-primary font-serif">
                  {currentVariant ? formatPrice(currentVariant.price) : '0'}
                </span>
                {currentVariant?.compareAtPrice && currentVariant.compareAtPrice > currentVariant.price && (
                  <>
                    <span className="text-base text-outline line-through">
                      {formatPrice(currentVariant.compareAtPrice)}
                    </span>
                    <span className="text-xs font-bold text-secondary uppercase tracking-wider">
                      Save {formatPrice(currentVariant.compareAtPrice - currentVariant.price)}
                    </span>
                  </>
                )}
                <span className="text-xs text-on-surface-variant ml-auto">(Inclusive of statutory taxes)</span>
              </>
            )}
          </div>

          {/* Short description */}
          {product.shortDescription && (
            <p className="text-on-surface-variant text-sm leading-relaxed">
              {product.shortDescription}
            </p>
          )}

          {/* Variant Selector with curved pills */}
          {variants.length > 0 && (
            <div className="space-y-3">
              <label className="block text-xs font-bold uppercase tracking-wider text-on-surface">
                Select Size / Pack: <span className="text-primary font-normal">{currentVariant?.name || currentVariant?.title || 'Standard'}</span>
              </label>
              <div className="flex flex-wrap gap-2.5">
                {variants.map((v: any) => {
                  const isSelected = (currentVariant?.id || variants[0]?.id) === v.id;
                  const varStock = v.stock ?? v.inventoryQty ?? 10;
                  const isVarOutOfStock = varStock <= 0;
                  const varLabel = v.name || v.title || 'Standard';
                  return (
                    <button
                      key={v.id}
                      onClick={() => handleVariantSelect(v.id)}
                      className={`px-4 py-2 text-sm font-medium rounded-full border transition-all cursor-pointer ${
                        isSelected
                          ? 'border-primary bg-primary text-on-primary font-semibold shadow-xs'
                          : 'border-outline-variant/40 text-on-surface hover:border-primary bg-surface-container'
                      } ${isVarOutOfStock ? 'opacity-50 line-through' : ''}`}
                    >
                      <span>{varLabel}</span>
                      <span className="block text-xs opacity-80">{formatPrice(v.price)}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Stock status */}
          <div>
            {isOutOfStock ? (
              <p className="text-sm font-semibold text-red-700">
                Currently Out of Stock
              </p>
            ) : isLowStock ? (
              <p className="text-sm font-semibold text-primary">
                Fresh Press Remaining: Only {currentStock} units in current batch
              </p>
            ) : (
              <p className="text-sm font-semibold text-secondary">
                In Stock : Direct Dispatch from Cold Mill
              </p>
            )}
          </div>

          {/* Quantity and Actions with smooth curves */}
          <div className="space-y-3 pt-2">
            {isPricePending ? (
              <div className="space-y-3">
                <a
                  href={`https://wa.me/917976123348?text=${encodeURIComponent(`Namaste Krishna Vedic, I would like to inquire about the current selling price and availability of "${product.name}".`)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full bg-[#25D366] hover:bg-[#20bd5a] text-white py-3.5 px-6 rounded-full font-label-md text-xs uppercase tracking-wider font-semibold transition-all flex items-center justify-center gap-2 cursor-pointer shadow-md active:scale-95"
                >
                  <span className="material-symbols-outlined text-base">chat</span>
                  Inquire on WhatsApp (+91 7976123348)
                </a>
                <p className="text-center text-[11px] text-on-surface-variant">
                  This product is currently undergoing seasonal price &amp; harvest weight verification at our Jaipur mill. Contact us directly for daily spot rates.
                </p>
              </div>
            ) : (
              <>
                <div className="flex items-center gap-4">
                  <div className="flex items-center border border-outline-variant/40 bg-surface-container-low rounded-full px-1">
                    <button
                      type="button"
                      disabled={quantity <= 1 || isOutOfStock}
                      onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                      className="w-9 h-9 rounded-full flex items-center justify-center text-on-surface hover:text-primary disabled:opacity-40 cursor-pointer font-bold"
                    >
                      −
                    </button>
                    <span className="w-10 text-center font-bold text-on-surface text-sm">
                      {quantity}
                    </span>
                    <button
                      type="button"
                      disabled={isOutOfStock || (currentVariant && quantity >= (currentVariant.stock ?? currentVariant.inventoryQty ?? 99))}
                      onClick={() => setQuantity((q) => q + 1)}
                      className="w-9 h-9 rounded-full flex items-center justify-center text-on-surface hover:text-primary disabled:opacity-40 cursor-pointer font-bold"
                    >
                      +
                    </button>
                  </div>

                  <button
                    type="button"
                    disabled={isOutOfStock || isAdding}
                    onClick={() => handleAddToCart(false)}
                    className="flex-1 bg-primary hover:bg-secondary text-on-primary py-3.5 px-6 rounded-full font-label-md text-xs uppercase tracking-wider font-semibold transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 shadow-md active:scale-95"
                  >
                    <span className="material-symbols-outlined text-base">shopping_bag</span>
                    {isAdding ? 'Adding...' : 'Add to Basket'}
                  </button>
                </div>

                <button
                  type="button"
                  disabled={isOutOfStock || isAdding}
                  onClick={() => handleAddToCart(true)}
                  className="w-full py-3.5 px-6 font-label-md text-xs uppercase tracking-wider font-semibold rounded-full border border-primary text-primary hover:bg-primary hover:text-on-primary transition-all text-center cursor-pointer shadow-xs active:scale-95"
                >
                  Buy Now with 1-Click
                </button>
              </>
            )}
          </div>

          {/* Vedic Guarantees Specification Strip */}
          <div className="grid grid-cols-2 gap-3 pt-6 border-t border-outline-variant/30 text-xs text-on-surface-variant">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-base text-secondary">verified</span>
              <span>100% Raw &amp; Unadulterated</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-base text-secondary">hourglass_bottom</span>
              <span>Wood-Pressed Under 38°C</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-base text-secondary">local_shipping</span>
              <span>Fast All-Bharat Delivery</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-base text-secondary">inventory_2</span>
              <span>Zero-Plastic Glass Bottles</span>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="mb-20">
        <div className="flex border-b border-outline-variant/30 overflow-x-auto gap-8">
          {(['description', 'benefits', 'usage', 'quality'] as const).map((tab) => {
            const labels = {
              description: 'Product Story & Details',
              benefits: 'Ayurvedic & Nutritional Matrix',
              usage: 'Culinary Recommendations',
              quality: 'Purity Standard & Lab Assay',
            };
            return (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`py-4 text-sm font-serif font-bold whitespace-nowrap border-b-2 transition-colors cursor-pointer ${
                  activeTab === tab
                    ? 'border-primary text-primary'
                    : 'border-transparent text-on-surface-variant hover:text-primary'
                }`}
              >
                {labels[tab]}
              </button>
            );
          })}
        </div>

        <div className="py-8 max-w-3xl space-y-4 text-on-surface-variant leading-relaxed text-sm">
          {activeTab === 'description' && (
            <div className="space-y-4">
              <p>{product.description || 'Our artisanal oils and spices are handcrafted using age-old Vedic methods to retain maximum aroma, nutrient vitality, and authentic flavor.'}</p>
              <p>Every bottle is carefully extracted without thermal degradation, chemical solvents, or artificial refining agents. You experience pure nature direct from our farming guilds.</p>
            </div>
          )}
          {activeTab === 'benefits' && (
            <div className="space-y-4">
              <h3 className="font-serif text-lg text-primary font-bold">Ayurvedic Wisdom &amp; Fatty Acid Profile</h3>
              <ul className="space-y-2 list-none">
                <li>• Naturally occurring tocopherols, vitamin E, and essential polyunsaturated omega complexes.</li>
                <li>• Zero chemical deodorization, zero trans-fats, and unbleached amber extract.</li>
                <li>• Balances doshas and stimulates natural agni digestive fire in traditional cooking.</li>
                <li>• Retains active phytonutrients destroyed by high-RPM industrial expellers.</li>
              </ul>
            </div>
          )}
          {activeTab === 'usage' && (
            <div className="space-y-4">
              <h3 className="font-serif text-lg text-primary font-bold">Culinary Instructions</h3>
              <p>Ideal for everyday traditional Indian temperings (tadka), slow simmering, shallow frying, and cold finishing dressings.</p>
              <p className="text-xs text-outline">Storage: Store in a cool dry pantry away from direct sunlight. Seal cap tightly after each use.</p>
            </div>
          )}
          {activeTab === 'quality' && (
            <div className="space-y-4">
              <h3 className="font-serif text-lg text-primary font-bold">Purity Standard &amp; Batch Assay</h3>
              <p>Every batch is assayed for acid values, moisture content, peroxide levels, and complete absence of argemone or mineral oils.</p>
              <div className="p-4 bg-surface-container-low border border-outline-variant/30">
                <p className="font-bold text-primary text-sm font-serif">FSSAI Certified &amp; NABL Tested</p>
                <p className="text-xs text-on-surface-variant mt-1">Processed in food-grade wood expeller units under license #11521018000342.</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Related Products */}
      {relatedProducts && relatedProducts.length > 0 && (
        <div className="border-t border-outline-variant/30 pt-16">
          <div className="mb-8">
            <span className="font-label-md text-label-md uppercase tracking-widest text-secondary block mb-1 font-bold">
              Complementary Lots
            </span>
            <h2 className="font-headline-lg text-headline-lg text-primary font-serif">
              You May Also Like
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {relatedProducts.map((p: any) => (
              <ProductCard
                key={p.id}
                product={p}
                onAddToCart={(vId) => addItem(vId, 1)}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
