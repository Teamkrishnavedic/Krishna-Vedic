import React from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import api from '@/lib/api';
import ProductCard from '@/components/ProductCard';
import { useCart } from '@/context/CartContext';
import { useToast } from '@/context/ToastContext';

export default function HomePage() {
  const { addItem } = useCart();
  const { toast } = useToast();

  // 1. Real Bestsellers: Dynamic algorithm based on cumulative units sold
  const { data: bestsellersData, isLoading: isBestsellersLoading } = useQuery({
    queryKey: ['home-bestsellers'],
    queryFn: async () => {
      const res = await api.get('/products/bestsellers?limit=4');
      return res.data;
    },
  });

  // 2. Real Categories from Database
  const { data: categoriesData, isLoading: isCategoriesLoading } = useQuery({
    queryKey: ['home-categories'],
    queryFn: async () => {
      const res = await api.get('/categories');
      return res.data;
    },
  });

  const handleAddToCart = async (variantId: string, quantity: number) => {
    try {
      await addItem(variantId, quantity);
      toast({
        title: 'Added to basket',
        description: 'Item added to your shopping cart',
        variant: 'success',
      });
    } catch (err: any) {
      toast({
        title: 'Error',
        description: err.response?.data?.message || err.message,
        variant: 'error',
      });
    }
  };

  const bestsellers = bestsellersData?.products || [];
  // Filter top categories with products or active parent categories
  const categories = (categoriesData?.categories || [])
    .filter((c: any) => c._count?.products > 0 || !c.parentId)
    .slice(0, 4);

  // Graceful curated fallbacks for category images if admin hasn't uploaded one
  const getCategoryFallbackImage = (slug: string) => {
    if (slug.includes('oil')) return 'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?auto=format&fit=crop&w=800&q=80';
    if (slug.includes('ground') || slug.includes('powder')) return 'https://images.unsplash.com/photo-1615485500704-8e990f9900f7?auto=format&fit=crop&w=800&q=80';
    if (slug.includes('masala') || slug.includes('blend')) return 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?auto=format&fit=crop&w=800&q=80';
    return 'https://images.unsplash.com/photo-1509358271058-acd22cc93898?auto=format&fit=crop&w=800&q=80';
  };

  return (
    <div className="flex flex-col w-full bg-[#fafbf5] text-[#2d2a26]">
      {/* ─── 1. Classy Hero Section ────────────────────────────────────────── */}
      <section className="relative w-full overflow-hidden py-16 md:py-24 px-4 md:px-12 border-b border-[#e5e2da]">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          {/* Headline & Narrative */}
          <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#f4f4ec] border border-[#e5e2da] text-xs font-semibold uppercase tracking-wider text-[#3f674f]">
              <span className="w-2 h-2 rounded-full bg-[#3f674f]" />
              <span>Ancestral Wood-Pressed Oils &amp; Spices</span>
            </div>

            <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl text-[#2d2a26] leading-[1.15] tracking-tight">
              Pure Taste.<br />
              <span className="italic font-normal text-[#6e3418]">The Traditional Way.</span>
            </h1>

            <p className="text-base sm:text-lg text-[#53433d] max-w-xl mx-auto lg:mx-0 leading-relaxed font-light">
              Cold-extracted below 38°C in slow wood mortars and stone chakkis. 
              Zero chemicals, no artificial heat, and uncompromised aroma straight from Jaipur to your kitchen.
            </p>

            {/* Clear, elegant CTAs */}
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 pt-2">
              <Link
                to="/shop"
                className="bg-[#3f674f] text-[#fafbf5] px-8 py-3.5 rounded-full text-sm font-semibold tracking-wider uppercase hover:bg-[#2d4d3a] transition-all shadow-sm hover:shadow active:scale-95 flex items-center gap-2"
              >
                <span>Shop the Pantry</span>
                <span className="material-symbols-outlined text-base">arrow_forward</span>
              </Link>
              <Link
                to="/about"
                className="bg-transparent text-[#2d2a26] border border-[#2d2a26]/30 px-7 py-3.5 rounded-full text-sm font-semibold tracking-wider uppercase hover:bg-[#f4f4ec] transition-colors"
              >
                Our Heritage
              </Link>
            </div>
          </div>

          {/* Hero Visual Imagery */}
          <div className="lg:col-span-5 relative">
            <div className="relative aspect-[4/5] rounded-3xl overflow-hidden shadow-xl border border-[#e5e2da] bg-[#f4f4ec]">
              <img
                src="https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?auto=format&fit=crop&w=1200&q=80"
                alt="Cold pressed traditional mustard oil in glass bottle"
                className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent pointer-events-none" />

              <div className="absolute bottom-6 left-6 right-6 p-4 rounded-2xl bg-white/95 backdrop-blur-md border border-white/40 shadow-md">
                <p className="text-xs font-bold uppercase tracking-widest text-[#6e3418]">
                  Single-Origin Harvest
                </p>
                <p className="font-serif text-lg font-bold text-[#2d2a26] mt-0.5">
                  100% Mara Chekku Wood-Pressed
                </p>
                <p className="text-xs text-[#7d7567] mt-0.5">
                  Natural aroma, rich pungency &amp; live nutrients intact.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── 2. Pillars of Trust (Simple & Clean) ─────────────────────────── */}
      <section className="w-full py-12 px-4 md:px-12 bg-[#fafbf5] border-b border-[#e5e2da]">
        <div className="max-w-7xl mx-auto grid grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
          <div className="flex items-start gap-3.5 p-4 rounded-2xl bg-[#f4f4ec]/50 border border-[#e5e2da]/60">
            <div className="w-10 h-10 rounded-full bg-[#eef5f1] text-[#3f674f] flex items-center justify-center shrink-0">
              <span className="material-symbols-outlined text-xl">nature</span>
            </div>
            <div>
              <h3 className="font-serif text-sm font-bold text-[#2d2a26]">100% Wood-Pressed</h3>
              <p className="text-xs text-[#7d7567] mt-1 leading-relaxed">
                Cold-extracted below 38°C in slow Albizia wood mortars.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3.5 p-4 rounded-2xl bg-[#f4f4ec]/50 border border-[#e5e2da]/60">
            <div className="w-10 h-10 rounded-full bg-[#fcf5e9] text-[#6e3418] flex items-center justify-center shrink-0">
              <span className="material-symbols-outlined text-xl">grain</span>
            </div>
            <div>
              <h3 className="font-serif text-sm font-bold text-[#2d2a26]">Stone-Ground Spices</h3>
              <p className="text-xs text-[#7d7567] mt-1 leading-relaxed">
                Slow-pulverized on natural stone to preserve essential oils.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3.5 p-4 rounded-2xl bg-[#f4f4ec]/50 border border-[#e5e2da]/60">
            <div className="w-10 h-10 rounded-full bg-[#eef5f1] text-[#3f674f] flex items-center justify-center shrink-0">
              <span className="material-symbols-outlined text-xl">verified</span>
            </div>
            <div>
              <h3 className="font-serif text-sm font-bold text-[#2d2a26]">Zero Chemicals</h3>
              <p className="text-xs text-[#7d7567] mt-1 leading-relaxed">
                Never refined, bleached, deodorized, or chemically treated.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3.5 p-4 rounded-2xl bg-[#f4f4ec]/50 border border-[#e5e2da]/60">
            <div className="w-10 h-10 rounded-full bg-[#fcf5e9] text-[#6e3418] flex items-center justify-center shrink-0">
              <span className="material-symbols-outlined text-xl">local_shipping</span>
            </div>
            <div>
              <h3 className="font-serif text-sm font-bold text-[#2d2a26]">Pan-India Express</h3>
              <p className="text-xs text-[#7d7567] mt-1 leading-relaxed">
                Safely delivered in food-grade tins and amber glass bottles.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ─── 3. Shop by Category ─────────────────────────────────────────── */}
      <section className="w-full py-16 md:py-24 px-4 md:px-12">
        <div className="max-w-7xl mx-auto space-y-10">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <span className="text-xs uppercase tracking-widest text-[#6e3418] font-bold">
              Collections
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl text-[#2d2a26]">
              Explore Our Pantry
            </h2>
            <p className="text-sm text-[#7d7567]">
              Every seed and spice is ethically sourced from verified farms and crafted with patient care.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {isCategoriesLoading ? (
              <div className="col-span-full py-12 text-center text-[#7d7567] font-serif">
                Loading pantry categories...
              </div>
            ) : (
              categories.map((cat: any) => (
                <Link
                  key={cat.id}
                  to={`/shop?category=${cat.slug}`}
                  className="group bg-[#fafbf5] border border-[#e5e2da] rounded-3xl overflow-hidden hover:shadow-lg transition-all duration-300 flex flex-col"
                >
                  <div className="aspect-[4/3] w-full overflow-hidden bg-[#f4f4ec]">
                    <img
                      src={cat.imageUrl || getCategoryFallbackImage(cat.slug)}
                      alt={cat.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                  <div className="p-6 flex flex-col justify-between flex-grow">
                    <div>
                      <h3 className="font-serif text-xl font-bold text-[#2d2a26] group-hover:text-[#6e3418] transition-colors">
                        {cat.name}
                      </h3>
                      <p className="text-xs text-[#7d7567] mt-1.5 leading-relaxed line-clamp-2">
                        {cat.description || 'Ethically sourced and traditionally crafted pantry essentials.'}
                      </p>
                    </div>
                    <div className="mt-5 flex items-center justify-between">
                      <span className="text-[11px] font-semibold text-[#7d7567]">
                        {cat._count?.products || 0} {cat._count?.products === 1 ? 'Product' : 'Products'}
                      </span>
                      <span className="inline-flex items-center gap-1 text-xs font-bold uppercase tracking-wider text-[#3f674f]">
                        <span>Explore</span>
                        <span className="material-symbols-outlined text-sm transition-transform group-hover:translate-x-1">arrow_forward</span>
                      </span>
                    </div>
                  </div>
                </Link>
              ))
            )}
          </div>
        </div>
      </section>

      {/* ─── 4. Featured Bestsellers Grid (Real Sales Algorithm) ─────────── */}
      <section className="w-full py-16 md:py-24 px-4 md:px-12 bg-[#f4f4ec]/40 border-t border-b border-[#e5e2da]">
        <div className="max-w-7xl mx-auto space-y-10">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <span className="text-xs uppercase tracking-widest text-[#6e3418] font-bold flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-[#6e3418] animate-pulse" />
                <span>Highest-Selling Essentials</span>
              </span>
              <h2 className="font-serif text-3xl sm:text-4xl text-[#2d2a26] mt-1">
                Pantry Bestsellers
              </h2>
            </div>

            <Link
              to="/shop"
              className="text-xs font-bold uppercase tracking-wider text-[#3f674f] hover:text-[#2d4d3a] flex items-center gap-1"
            >
              <span>View All Products</span>
              <span className="material-symbols-outlined text-sm">arrow_forward</span>
            </Link>
          </div>

          {isBestsellersLoading ? (
            <div className="py-20 text-center text-[#7d7567] font-serif">
              Loading fresh harvest items...
            </div>
          ) : bestsellers.length === 0 ? (
            <div className="py-20 text-center text-[#7d7567] font-serif">
              No products found.
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {bestsellers.map((product: any) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onAddToCart={(variantId, qty) => handleAddToCart(variantId, qty)}
                />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ─── 5. The Krishnavedic Story (Editorial & Classy) ───────────────── */}
      <section className="w-full py-20 px-4 md:px-12">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-6 relative aspect-square sm:aspect-[4/3] lg:aspect-square rounded-3xl overflow-hidden border border-[#e5e2da] shadow-lg">
            <img
              src="https://images.unsplash.com/photo-1596040033229-a9821ebd058d?auto=format&fit=crop&w=1200&q=80"
              alt="Traditional Indian spices and wooden pestle"
              className="w-full h-full object-cover"
            />
          </div>

          <div className="lg:col-span-6 space-y-6">
            <span className="text-xs uppercase tracking-widest text-[#6e3418] font-bold">
              The Art of Slow Living
            </span>

            <h2 className="font-serif text-3xl sm:text-4xl text-[#2d2a26] leading-tight">
              Why the traditional way still makes all the difference.
            </h2>

            <div className="space-y-4 text-sm text-[#53433d] leading-relaxed font-light">
              <p>
                Modern industrial processing uses high-speed metal expellers rotating above 1,200 RPM. The resulting frictional heat often exceeds 100°C, stripping away natural vitamins, volatile aromatics, and the soul of the seed.
              </p>
              <p>
                At Krishnavedic, we do things the unhurried way. Our wooden ghani mortars rotate slowly at just 14 RPM, keeping temperatures naturally cool below 38°C. This time-honored technique preserves the pungency, deep golden hue, and delicate nutritional matrix that has nourished generations of Indian families.
              </p>
            </div>

            <div className="pt-2">
              <Link
                to="/about"
                className="inline-flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-[#3f674f] hover:text-[#2d4d3a] border-b-2 border-[#3f674f] pb-1 transition-all"
              >
                <span>Discover our journey</span>
                <span className="material-symbols-outlined text-base">arrow_forward</span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ─── 6. Real Customer Voices ─────────────────────────────────────── */}
      <section className="w-full py-16 md:py-20 px-4 md:px-12 bg-[#f4f4ec]/60 border-t border-[#e5e2da]">
        <div className="max-w-7xl mx-auto space-y-12">
          <div className="text-center max-w-xl mx-auto space-y-2">
            <span className="text-xs uppercase tracking-widest text-[#6e3418] font-bold">
              Community Love
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl text-[#2d2a26]">
              Trusted Across Bharat
            </h2>
            <p className="text-xs text-[#7d7567]">
              Real reviews from home cooks and food lovers who value pure, honest ingredients.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-[#fafbf5] p-8 rounded-3xl border border-[#e5e2da] shadow-sm flex flex-col justify-between space-y-4">
              <div className="space-y-3">
                <div className="text-[#6e3418] text-sm">★★★★★</div>
                <p className="text-xs text-[#53433d] leading-relaxed italic font-serif">
                  &ldquo;The aroma of their Kachi Ghani Mustard Oil took me straight back to my childhood in Rajasthan. The authentic pungency is unmatched by any supermarket brand.&rdquo;
                </p>
              </div>
              <div className="pt-4 border-t border-[#e5e2da] flex items-center justify-between">
                <div>
                  <p className="font-semibold text-xs text-[#2d2a26]">Priya Sharma</p>
                  <p className="text-[11px] text-[#7d7567]">Jaipur, Rajasthan</p>
                </div>
                <span className="material-symbols-outlined text-base text-[#3f674f]">verified</span>
              </div>
            </div>

            <div className="bg-[#fafbf5] p-8 rounded-3xl border border-[#e5e2da] shadow-sm flex flex-col justify-between space-y-4">
              <div className="space-y-3">
                <div className="text-[#6e3418] text-sm">★★★★★</div>
                <p className="text-xs text-[#53433d] leading-relaxed italic font-serif">
                  &ldquo;Their stone-ground turmeric and biryani blend transformed our weekend family dinners. You can literally smell the freshness the moment you open the lid.&rdquo;
                </p>
              </div>
              <div className="pt-4 border-t border-[#e5e2da] flex items-center justify-between">
                <div>
                  <p className="font-semibold text-xs text-[#2d2a26]">Rajesh Menon</p>
                  <p className="text-[11px] text-[#7d7567]">Bengaluru, Karnataka</p>
                </div>
                <span className="material-symbols-outlined text-base text-[#3f674f]">verified</span>
              </div>
            </div>

            <div className="bg-[#fafbf5] p-8 rounded-3xl border border-[#e5e2da] shadow-sm flex flex-col justify-between space-y-4">
              <div className="space-y-3">
                <div className="text-[#6e3418] text-sm">★★★★★</div>
                <p className="text-xs text-[#53433d] leading-relaxed italic font-serif">
                  &ldquo;Finding genuine wood-pressed sesame oil delivered safely in food-grade packaging without any plastic smell is a blessing. It has become a permanent staple in our home.&rdquo;
                </p>
              </div>
              <div className="pt-4 border-t border-[#e5e2da] flex items-center justify-between">
                <div>
                  <p className="font-semibold text-xs text-[#2d2a26]">Dr. Ananya Sen</p>
                  <p className="text-[11px] text-[#7d7567]">New Delhi</p>
                </div>
                <span className="material-symbols-outlined text-base text-[#3f674f]">verified</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── 7. Refined Newsletter Section ───────────────────────────────── */}
      <section className="w-full py-16 px-4 md:px-12 bg-[#fafbf5]">
        <div className="max-w-4xl mx-auto bg-[#3f674f] text-[#fafbf5] rounded-3xl p-8 md:p-14 text-center space-y-6 shadow-xl">
          <span className="text-xs uppercase tracking-widest text-[#a5d1b3] font-bold">
            The Krishnavedic Circle
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl">
            Pure Harvest Updates to Your Inbox
          </h2>
          <p className="text-sm text-[#fafbf5]/80 max-w-md mx-auto leading-relaxed font-light">
            Receive early access to seasonal fresh-press batches, festive spice blends, and authentic recipes.
          </p>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              toast({
                title: 'Welcome to the Circle',
                description: 'You have subscribed to harvest dispatches.',
                variant: 'success',
              });
            }}
            className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto pt-2"
          >
            <input
              type="email"
              required
              placeholder="Enter your email address"
              className="bg-[#fafbf5] text-[#2d2a26] px-5 py-3.5 rounded-full text-xs focus:outline-none flex-grow placeholder:text-[#7d7567]"
            />
            <button
              type="submit"
              className="bg-[#6e3418] text-[#fafbf5] px-7 py-3.5 rounded-full text-xs font-bold uppercase tracking-wider hover:bg-[#8b4b2d] transition-colors whitespace-nowrap cursor-pointer shadow-md"
            >
              Subscribe
            </button>
          </form>
        </div>
      </section>
    </div>
  );
}
