import React, { useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import api from '@/lib/api';
import ProductCard from '@/components/ProductCard';
import { useCart } from '@/context/CartContext';
import { useToast } from '@/context/ToastContext';

interface Department {
  id: string;
  name: string;
  slug: string;
  icon: string;
  tagline: string;
  description: string;
  image: string;
  subcategories: {
    title: string;
    query: string;
    desc: string;
  }[];
}

const DEPARTMENTS: Department[] = [
  {
    id: 'oils',
    name: 'Wood-Pressed Oils',
    slug: 'cold-pressed-oils',
    icon: 'water_drop',
    tagline: '100% Mara Chekku • Unrefined & Chemical-Free',
    description: 'Cold-extracted in slow Albizia wood mortars below 38°C to retain live micro-nutrients and deep natural pungency.',
    image: 'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?auto=format&fit=crop&w=800&q=80',
    subcategories: [
      { title: 'Black Mustard Oil (Kachi Ghani)', query: 'mustard', desc: 'Pungent, cold-pressed from Rajasthan black sarson' },
      { title: 'Yellow Mustard Oil', query: 'yellow mustard', desc: 'Milder aroma, perfect for delicate curries & pickles' },
      { title: 'Groundnut Oil (Peanut)', query: 'groundnut', desc: 'Nutty, high smoke point oil for everyday sautéing' },
      { title: 'White Sesame Oil (Til)', query: 'sesame', desc: 'Vedic gingelly oil, rich in zinc and antioxidants' },
      { title: 'Virgin Coconut Oil', query: 'coconut', desc: 'Raw, unbleached oil extracted from coastal fresh copra' },
    ],
  },
  {
    id: 'spices',
    name: 'Stone-Ground Spices',
    slug: 'ground-spices',
    icon: 'grain',
    tagline: 'Slow-Milled on Natural Granite Chakkis',
    description: 'Pulverized at low RPM without friction heat to protect fragile volatile essential oils and curcumin potency.',
    image: 'https://images.unsplash.com/photo-1615485500704-8e990f9900f7?auto=format&fit=crop&w=800&q=80',
    subcategories: [
      { title: 'Salem Haldi (Turmeric)', query: 'turmeric', desc: 'Lab assayed 5.2% high-curcumin single origin haldi' },
      { title: 'Red Chilli (Mirch)', query: 'chilli', desc: 'Dual blend of fiery Guntur and vibrant Kashmiri red' },
      { title: 'Coriander (Dhaniya)', query: 'coriander', desc: 'Citrusy, slow-roasted Rajasthani whole dhaniya powder' },
      { title: 'Cumin (Jeera)', query: 'cumin', desc: 'Aromatic desert cumin ground with natural oils intact' },
    ],
  },
  {
    id: 'masalas',
    name: 'Heritage Masalas',
    slug: 'masala-blends',
    icon: 'restaurant_menu',
    tagline: 'Authentic Regional Family Formulations',
    description: 'Artisanal spice formulations roasted and blended using heirloom proportions for memorable feast cooking.',
    image: 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?auto=format&fit=crop&w=800&q=80',
    subcategories: [
      { title: 'Royal Garam Masala', query: 'garam masala', desc: '14 whole spices roasted for aromatic royal gravy' },
      { title: 'Kitchen King All-Rounder', query: 'kitchen king', desc: 'Harmonious daily masala for paneer & seasonal sabzis' },
      { title: 'Lucknowi Biryani Blend', query: 'biryani', desc: 'Shahi jeera, mace, nutmeg & saffron infused spice mix' },
      { title: 'Madras Sambhar Podi', query: 'sambhar', desc: 'Traditional roasted lentil and spice blend for rasam & sambhar' },
    ],
  },
  {
    id: 'whole-spices',
    name: 'Whole Spices',
    slug: 'whole-spices',
    icon: 'spa',
    tagline: 'Sun-Dried & Hand-Sorted Whole Botanicals',
    description: 'Direct from plantation harvests across Kerala, Karnataka, and Rajasthan. Bold grades, zero broken husks.',
    image: 'https://images.unsplash.com/photo-1509358271058-acd22cc93898?auto=format&fit=crop&w=800&q=80',
    subcategories: [
      { title: 'Malabar Black Peppercorn', query: 'pepper', desc: 'Extra-bold TGSEB grade harvested from Idukki hills' },
      { title: 'Green Cardamom (Elaichi)', query: 'cardamom', desc: '8mm bold fragrant green pods with concentrated seeds' },
      { title: 'Ceylon Cinnamon (Dalchini)', query: 'cinnamon', desc: 'True thin-bark sweet cinnamon sticks, coumarin-safe' },
      { title: 'Cloves (Laung)', query: 'clove', desc: 'Whole aromatic clove buttons with intact oil heads' },
    ],
  },
  {
    id: 'ghee-honey',
    name: 'Ghee & Natural Honey',
    slug: 'edible-oils',
    icon: 'hive',
    tagline: 'Ancestral Dairy & Forest Wild Harvests',
    description: 'A2 Vedic Bilona cultured cow ghee and raw unprocessed forest honey made through ethical, non-violent harvesting.',
    image: 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?auto=format&fit=crop&w=800&q=80',
    subcategories: [
      { title: 'Gir Cow A2 Bilona Ghee', query: 'ghee', desc: 'Traditional curd-churned golden grain ghee in glass jars' },
      { title: 'Raw Multi-Flora Forest Honey', query: 'honey', desc: 'Unpasteurized honey collected from wild flora nectar' },
      { title: 'Vedic Wellness Combos', query: 'combo', desc: 'Curated pantry hampers in heirloom wooden gift packaging' },
    ],
  },
];

export default function CategoriesPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const activeSlug = searchParams.get('dept') || DEPARTMENTS[0].slug;
  const currentDept = DEPARTMENTS.find((d) => d.slug === activeSlug) || DEPARTMENTS[0];

  const { addItem } = useCart();
  const { toast } = useToast();

  // Fetch real products for the active department
  const { data: productsData, isLoading } = useQuery({
    queryKey: ['dept-products', currentDept.slug],
    queryFn: async () => {
      const res = await api.get(`/products?category=${currentDept.slug}&limit=12`);
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

  const products = productsData?.products || [];

  return (
    <div className="flex flex-col w-full bg-[#fafbf5] text-[#2d2a26] min-h-screen pt-4 pb-20">
      {/* ─── Page Header / Breadcrumb ─────────────────────────────────────── */}
      <div className="max-w-7xl mx-auto w-full px-4 md:px-8 py-4 border-b border-[#e5e2da]">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <div className="flex items-center gap-2 text-xs text-[#7d7567] uppercase tracking-wider">
              <Link to="/" className="hover:text-[#6e3418]">Home</Link>
              <span>/</span>
              <span className="text-[#6e3418] font-bold">Product Categories</span>
            </div>
            <h1 className="font-serif text-2xl sm:text-3xl text-[#2d2a26] mt-1 font-bold">
              Shop by Pantry Department
            </h1>
          </div>
          <Link
            to="/shop"
            className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#3f674f] hover:text-[#2d4d3a]"
          >
            <span>View All Products in Catalog</span>
            <span className="material-symbols-outlined text-sm">arrow_forward</span>
          </Link>
        </div>
      </div>

      {/* ─── Main Two-Column Amazon-Style Department Browser ──────────────── */}
      <div className="max-w-7xl mx-auto w-full px-4 md:px-8 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Department List Tabs (Desktop & Mobile Scroll) */}
          <div className="lg:col-span-4 xl:col-span-3 space-y-2 lg:sticky lg:top-24">
            <p className="text-xs font-bold uppercase tracking-widest text-[#7d7567] px-2 mb-2">
              Select Category
            </p>

            <div className="flex lg:flex-col gap-2 overflow-x-auto no-scrollbar pb-2 lg:pb-0">
              {DEPARTMENTS.map((dept) => {
                const isActive = dept.slug === currentDept.slug;
                return (
                  <button
                    key={dept.id}
                    onClick={() => setSearchParams({ dept: dept.slug })}
                    className={`w-full text-left px-4 py-3.5 rounded-2xl transition-all flex items-center justify-between shrink-0 cursor-pointer border ${
                      isActive
                        ? 'bg-[#6e3418] text-[#fafbf5] border-[#6e3418] shadow-md font-semibold'
                        : 'bg-[#fafbf5] text-[#2d2a26] border-[#e5e2da] hover:bg-[#f4f4ec] hover:border-[#6e3418]/30'
                    }`}
                  >
                    <div className="flex items-center gap-3 min-w-[160px] lg:min-w-0">
                      <span className={`material-symbols-outlined text-xl ${isActive ? 'text-[#fafbf5]' : 'text-[#6e3418]'}`}>
                        {dept.icon}
                      </span>
                      <span className="text-xs sm:text-sm font-serif font-bold">
                        {dept.name}
                      </span>
                    </div>
                    <span className={`material-symbols-outlined text-sm hidden lg:inline ${isActive ? 'text-[#fafbf5]' : 'text-[#7d7567]'}`}>
                      chevron_right
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Right Column: Active Department Detail & Subclassifications */}
          <div className="lg:col-span-8 xl:col-span-9 space-y-8">
            {/* Department Hero Banner */}
            <div className="relative rounded-3xl overflow-hidden bg-[#3f674f] text-[#fafbf5] p-6 sm:p-10 shadow-lg border border-[#e5e2da]">
              <div className="relative z-10 max-w-xl space-y-3">
                <span className="inline-block px-3 py-1 rounded-full bg-white/15 backdrop-blur-sm text-[11px] font-semibold uppercase tracking-wider text-[#fafbf5]">
                  {currentDept.tagline}
                </span>
                <h2 className="font-serif text-2xl sm:text-4xl font-bold">
                  {currentDept.name}
                </h2>
                <p className="text-xs sm:text-sm text-[#fafbf5]/90 font-light leading-relaxed">
                  {currentDept.description}
                </p>
                <div className="pt-2">
                  <Link
                    to={`/shop?category=${currentDept.slug}`}
                    className="inline-flex items-center gap-2 bg-[#fafbf5] text-[#2d2a26] px-6 py-2.5 rounded-full text-xs font-bold uppercase tracking-wider hover:bg-[#f4f4ec] transition-all shadow-sm"
                  >
                    <span>Browse All in {currentDept.name}</span>
                    <span className="material-symbols-outlined text-sm">arrow_forward</span>
                  </Link>
                </div>
              </div>
            </div>

            {/* Sub-classifications Grid (Amazon Style Variety Navigation) */}
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b border-[#e5e2da] pb-3">
                <h3 className="font-serif text-lg font-bold text-[#2d2a26]">
                  Popular Varieties in {currentDept.name}
                </h3>
                <span className="text-xs text-[#7d7567]">
                  Tap any variety to filter
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                {currentDept.subcategories.map((sub, idx) => (
                  <Link
                    key={idx}
                    to={`/search?q=${encodeURIComponent(sub.query)}`}
                    className="p-4 rounded-2xl bg-[#f4f4ec]/60 border border-[#e5e2da] hover:border-[#6e3418] hover:bg-[#fafbf5] hover:shadow-sm transition-all group flex items-start justify-between"
                  >
                    <div className="space-y-1 pr-2">
                      <h4 className="font-serif text-sm font-bold text-[#2d2a26] group-hover:text-[#6e3418] transition-colors">
                        {sub.title}
                      </h4>
                      <p className="text-xs text-[#7d7567] leading-relaxed">
                        {sub.desc}
                      </p>
                    </div>
                    <span className="material-symbols-outlined text-base text-[#7d7567] group-hover:text-[#6e3418] group-hover:translate-x-1 transition-all shrink-0 mt-1">
                      arrow_forward
                    </span>
                  </Link>
                ))}
              </div>
            </div>

            {/* Live Products Inside this Department */}
            <div className="space-y-4 pt-4">
              <div className="flex items-center justify-between border-b border-[#e5e2da] pb-3">
                <h3 className="font-serif text-lg font-bold text-[#2d2a26]">
                  Available Products
                </h3>
                <Link
                  to={`/shop?category=${currentDept.slug}`}
                  className="text-xs font-bold uppercase tracking-wider text-[#3f674f] hover:text-[#2d4d3a]"
                >
                  View All
                </Link>
              </div>

              {isLoading ? (
                <div className="py-16 text-center text-[#7d7567] font-serif text-sm">
                  Loading {currentDept.name}...
                </div>
              ) : products.length === 0 ? (
                <div className="py-16 text-center text-[#7d7567] font-serif text-sm space-y-3">
                  <p>No products currently found in this category.</p>
                  <Link
                    to="/shop"
                    className="inline-block px-5 py-2 rounded-full bg-[#6e3418] text-[#fafbf5] text-xs font-semibold uppercase tracking-wider"
                  >
                    View All Products
                  </Link>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                  {products.map((product: any) => (
                    <ProductCard
                      key={product.id}
                      product={product}
                      onAddToCart={(variantId, qty) => handleAddToCart(variantId, qty)}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
