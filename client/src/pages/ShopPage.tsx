import React, { useState, useMemo, useEffect } from 'react';
import { Link, useSearchParams, useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import {
  ChevronLeft,
  ChevronRight,
  SlidersHorizontal,
  CheckCircle2,
  Sparkles,
  Phone,
  MessageCircle,
  X,
} from 'lucide-react';
import api from '@/lib/api';
import ProductCard from '@/components/ProductCard';
import { useCart } from '@/context/CartContext';
import { useToast } from '@/context/ToastContext';
import { useStoreSettings } from '@/hooks/useStoreSettings';

// Dynamic icon resolver for database categories
const getCategoryIcon = (name: string, slug: string) => {
  const s = (name + ' ' + slug).toLowerCase();
  if (s.includes('oil') && !s.includes('cake') && !s.includes('khal')) return 'water_drop';
  if (s.includes('flour') || s.includes('atta')) return 'grain';
  if (s.includes('spice') || s.includes('ground') || s.includes('powder')) return 'grain';
  if (s.includes('masala') || s.includes('blend')) return 'restaurant_menu';
  if (s.includes('grain') || s.includes('cereal') || s.includes('seed')) return 'spa';
  if (s.includes('ghee') || s.includes('honey') || s.includes('dairy')) return 'hive';
  if (s.includes('cake') || s.includes('khal')) return 'inventory_2';
  return 'category';
};

const CATEGORY_ALIASES: Record<string, string> = {
  oil: 'cold-pressed-oils',
  oils: 'cold-pressed-oils',
  'edible-oils': 'cold-pressed-oils',
  'wood-pressed-oils': 'cold-pressed-oils',
  masala: 'spices-masalas',
  masalas: 'spices-masalas',
  'masala-blends': 'spices-masalas',
  spices: 'spices-masalas',
  'ghee-honey': 'ghee-honey-other-products',
  ghee: 'ghee-honey-other-products',
  honey: 'ghee-honey-other-products',
  flour: 'flour-atta',
  atta: 'flour-atta',
  grains: 'whole-grains-cereals',
  cereals: 'whole-grains-cereals',
  'oil-cakes': 'oil-cakes-khal',
  khal: 'oil-cakes-khal',
};

const resolveCategory = (cat: string | null) => {
  if (!cat || cat === 'all') return 'all';
  const lower = cat.toLowerCase().trim();
  return CATEGORY_ALIASES[lower] || lower;
};

interface CategoryMeta {
  title: string;
  subtitle: string;
  tag: string;
  highlights: string[];
}

const CATEGORY_METAS: Record<string, CategoryMeta> = {
  'cold-pressed-oils': {
    title: 'Wood-Pressed & Kachi Ghani Oils',
    subtitle:
      'Extracted slowly in ancestral Vagai wood ghanis below 38°C to retain living antioxidants, natural vitamins, and raw aromatic pungency. Zero solvents, zero hexane, zero heating.',
    tag: 'Bull & Wood-Ghani Ethos',
    highlights: [
      'Vagai Wood Kohlu Press',
      '<38°C Cold Extraction',
      'Zero Solvents or Hexane',
      'Natural Sediment Clarity',
    ],
  },
  'flour-atta': {
    title: 'Stone-Ground Whole Grain Flours (Atta)',
    subtitle:
      'Slow-milled on traditional emery stone chakkis without friction heating, preserving 100% natural wheat germ, bran, and high dietary fiber. Pure unbleached whole grain.',
    tag: 'Cold Stone-Chakki Milled',
    highlights: [
      'Slow Stone Chakki Ground',
      '100% Whole Grain Bran & Germ',
      'Zero Chemical Bleaches',
      'Fresh Small-Batch Milling',
    ],
  },
  'spices-masalas': {
    title: 'Stone-Pounded Spices & Masala Blends',
    subtitle:
      'Single-origin spices sun-dried and slowly hand-pounded on granite mortars to retain natural essential oils and volatile flavors. Lab-assayed for high curcumin and purity.',
    tag: 'Single-Origin & Granite Pounded',
    highlights: [
      'Sun-Dried Single Origin',
      'Granite Mortar Pounded',
      'High Natural Curcumin',
      'Zero Synthetic Colorants',
    ],
  },
  'ghee-honey-other-products': {
    title: 'Desi Gir Cow Bilona Ghee & Raw Forest Honey',
    subtitle:
      'Cultured A2 bilona ghee slow-cooked from cultured curd of grass-fed indigenous cows, paired with wild, unheated multi-floral honey sustainably harvested from tribal forest guilds.',
    tag: 'Vedic A2 Bilona & Wild Harvest',
    highlights: [
      'Traditional Curd Churned',
      'A2 Beta-Casein Certified',
      'Raw Unheated Forest Honey',
      'Handmade in Clay Pots',
    ],
  },
  'whole-grains-cereals': {
    title: 'Indigenous Ancient Grains & Millets',
    subtitle:
      'Climate-resilient indigenous millets and unpolished ancient grains cultivated using ancestral organic farming techniques. Naturally nutrient-dense with high dietary fiber.',
    tag: 'Ancestral Heirloom Harvest',
    highlights: [
      'Native Heirloom Seeds',
      '100% Unpolished & Raw',
      'High Fiber & Low Glycemic',
      'Direct Farmer Sourcing',
    ],
  },
  'oil-cakes-khal': {
    title: 'Pure Cold-Pressed Oil Cakes (Khal)',
    subtitle:
      'Nutrient-dense, unrefined seed cakes remaining directly after cold wood-press extraction. Chemical-free high-protein sustenance for livestock and natural organic soil rejuvenation.',
    tag: '100% Raw Cattle & Soil Nutrition',
    highlights: [
      'Zero Chemical Solvents',
      'High Natural Protein & Fiber',
      'Direct Mill Freshness',
      'Natural Farm Bio-Fertilizer',
    ],
  },
  all: {
    title: 'The Complete Vedic Harvest Pantry',
    subtitle:
      'Sacred, unadulterated everyday nutrition handcrafted direct from ancestral farming guilds across Rajasthan, Malabar, and the Deccan plateau. Pure, honest nourishment for your family.',
    tag: '100% Raw · Wood-Pressed · Lab Assayed',
    highlights: [
      'Ancestral Wood-Press Ethos',
      'FSSAI & NABL Lab Certified',
      'Direct Pan-Bharat Dispatch',
      'Glass & Tin Packaging',
    ],
  },
};

export default function ShopPage() {
  const { addItem } = useCart();
  const { toast } = useToast();
  const { supportPhone, getWhatsappUrl } = useStoreSettings();
  const [searchParams, setSearchParams] = useSearchParams();

  const { category: routeCategory } = useParams<{ category?: string }>();
  const [activeCategory, setActiveCategory] = useState<string>(
    resolveCategory(routeCategory || searchParams.get('category'))
  );
  const [searchQuery, setSearchQuery] = useState<string>(
    searchParams.get('q') || ''
  );
  const [sortBy, setSortBy] = useState<string>('featured');
  const [isSearchOpen, setIsSearchOpen] = useState<boolean>(false);
  const [currentPage, setCurrentPage] = useState<number>(1);

  // 1. Fetch all published products from API
  const { data: productsData, isLoading: isProductsLoading } = useQuery({
    queryKey: ['shop-all-products'],
    queryFn: async () => {
      const res = await api.get('/products?limit=100');
      return res.data;
    },
    staleTime: 5 * 60 * 1000,
  });

  // 2. Fetch live categories directly from database (admin added / updated)
  const { data: categoriesData, isLoading: isCategoriesLoading } = useQuery({
    queryKey: ['categories'],
    queryFn: async () => {
      const res = await api.get('/categories');
      return res.data.categories || [];
    },
    staleTime: 5 * 60 * 1000,
  });

  const allProducts: any[] = productsData?.products || [];
  const dbCategories: any[] = categoriesData || [];

  // Synchronize category from URL with alias support (both searchParams and routeParams)
  useEffect(() => {
    const rawCat = routeCategory || searchParams.get('category');
    if (!rawCat || rawCat === 'all') {
      setActiveCategory('all');
      return;
    }
    const canonical = resolveCategory(rawCat);
    if (dbCategories.length > 0) {
      const exists = dbCategories.some(
        (c) => c.slug === canonical || c.id === canonical || c.slug === rawCat
      );
      if (exists) {
        setActiveCategory(canonical);
      } else {
        setActiveCategory('all');
      }
    } else {
      setActiveCategory(canonical);
    }
  }, [searchParams, routeCategory, dbCategories]);

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

  // 3. Dynamic Category Tabs: 'All Products' + every category in the database
  const categoryTabs = useMemo(() => {
    const tabs = [{ label: 'All Products', slug: 'all', icon: 'apps' }];

    for (const cat of dbCategories) {
      tabs.push({
        label: cat.name,
        slug: cat.slug,
        icon: getCategoryIcon(cat.name, cat.slug),
      });
    }

    return tabs;
  }, [dbCategories]);

  // 4. Filter and Sort products
  const filteredProducts = useMemo(() => {
    let result = [...allProducts];

    // Search filter
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      result = result.filter((p) => {
        const nameMatch = (p.name || '').toLowerCase().includes(q);
        const descMatch = (p.description || '').toLowerCase().includes(q);
        const tagMatch = (p.tags || '').toLowerCase().includes(q);
        const catMatch = (p.category?.name || '').toLowerCase().includes(q);
        return nameMatch || descMatch || tagMatch || catMatch;
      });
    }

    // Category filter
    if (activeCategory !== 'all') {
      const canonical = resolveCategory(activeCategory);
      result = result.filter(
        (p) =>
          p.category?.slug === canonical ||
          p.category?.slug === activeCategory ||
          p.categoryId === canonical ||
          p.categoryId === activeCategory ||
          p.category?.id === activeCategory
      );
    }

    // Sort
    if (sortBy === 'price-asc') {
      result.sort((a, b) => {
        const pa = a.variants?.[0]?.price || 0;
        const pb = b.variants?.[0]?.price || 0;
        return pa - pb;
      });
    } else if (sortBy === 'price-desc') {
      result.sort((a, b) => {
        const pa = a.variants?.[0]?.price || 0;
        const pb = b.variants?.[0]?.price || 0;
        return pb - pa;
      });
    } else if (sortBy === 'name-asc') {
      result.sort((a, b) => (a.name || '').localeCompare(b.name || ''));
    }

    return result;
  }, [allProducts, searchQuery, activeCategory, sortBy]);

  // Reset to page 1 whenever category or search filter changes
  useEffect(() => {
    setCurrentPage(1);
  }, [activeCategory, searchQuery, sortBy]);

  // Smart Pagination:
  // On desktop (4 columns), 12 items creates 3 complete symmetrical rows of 4.
  // On mobile (2 columns), 12 items creates 6 symmetrical rows of 2.
  // If a category has 16 or fewer products (e.g. Cold-Pressed Oils has 8),
  // show all items on 1 page so desktop never has empty slots or an awkward 2-item page 2!
  const ITEMS_PER_PAGE = 12;
  const shouldPaginate = filteredProducts.length > 16;
  const totalPages = shouldPaginate
    ? Math.max(1, Math.ceil(filteredProducts.length / ITEMS_PER_PAGE))
    : 1;

  const startIndex = shouldPaginate ? (currentPage - 1) * ITEMS_PER_PAGE : 0;
  const endIndex = shouldPaginate
    ? Math.min(startIndex + ITEMS_PER_PAGE, filteredProducts.length)
    : filteredProducts.length;

  const paginatedProducts = useMemo(() => {
    if (!shouldPaginate) return filteredProducts;
    return filteredProducts.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  }, [filteredProducts, startIndex, shouldPaginate]);

  const changePage = (newPage: number) => {
    if (newPage < 1 || newPage > totalPages) return;
    setCurrentPage(newPage);
    const element = document.getElementById('products-catalogue-grid');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    } else {
      window.scrollTo({ top: 110, behavior: 'smooth' });
    }
  };

  const selectCategory = (slug: string) => {
    const canonical = resolveCategory(slug);
    setActiveCategory(canonical);
    const newParams = new URLSearchParams(searchParams);
    if (canonical === 'all') {
      newParams.delete('category');
    } else {
      newParams.set('category', canonical);
    }
    setSearchParams(newParams);
  };

  const activeCategoryMeta =
    CATEGORY_METAS[activeCategory] ||
    CATEGORY_METAS[resolveCategory(activeCategory)] ||
    CATEGORY_METAS.all;

  const activeCategoryTitle =
    activeCategory === 'all'
      ? 'All Heritage Harvests'
      : dbCategories.find((c) => c.slug === activeCategory || c.id === activeCategory)
          ?.name || activeCategoryMeta.title;

  return (
    <div className="flex flex-col w-full bg-[#fafbf5] text-[#2d2a26] min-h-screen pb-20">
      {/* ─── 1. Clean Products Navbar + Compact Search ───────────────────── */}
      <nav className="sticky top-[80px] sm:top-[88px] md:top-[104px] z-30 w-full bg-[#fafbf5]/95 backdrop-blur-md border-b border-[#e5e2da] py-2.5 px-3 sm:px-4 md:px-8 shadow-xs">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-2 sm:gap-4">
          {/* Scrollable Category Pills from Database */}
          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar flex-grow py-0.5">
            {categoryTabs.map((tab) => {
              const isSelected = activeCategory === tab.slug;
              return (
                <button
                  key={tab.slug}
                  onClick={() => selectCategory(tab.slug)}
                  className={`flex items-center gap-1.5 px-3 sm:px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap uppercase tracking-wider transition-all cursor-pointer border ${
                    isSelected
                      ? 'bg-[#6e3418] text-[#fafbf5] border-[#6e3418] shadow-xs'
                      : 'bg-[#f4f4ec] text-[#2d2a26] border-[#e5e2da] hover:bg-[#e8e8dc] hover:text-[#6e3418]'
                  }`}
                >
                  <span className="material-symbols-outlined text-sm">
                    {tab.icon}
                  </span>
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>

          {/* Compact Smart Search (Takes minimal space on mobile unless opened) */}
          <div className="shrink-0 flex items-center gap-2">
            {!isSearchOpen && !searchQuery ? (
              <button
                type="button"
                onClick={() => setIsSearchOpen(true)}
                className="sm:hidden flex items-center justify-center w-8 h-8 rounded-full bg-[#f4f4ec] text-[#6e3418] border border-[#e5e2da] hover:bg-[#6e3418] hover:text-[#fafbf5] transition-all cursor-pointer active:scale-95 shadow-2xs"
                title="Search items"
                aria-label="Open search"
              >
                <span className="material-symbols-outlined text-base">search</span>
              </button>
            ) : null}

            <div
              className={`${
                isSearchOpen || searchQuery ? 'flex' : 'hidden sm:flex'
              } relative items-center w-36 xs:w-44 sm:w-52 md:w-64 transition-all`}
            >
              <span className="material-symbols-outlined absolute left-2.5 top-2 text-[#7d7567] text-base pointer-events-none">
                search
              </span>
              <input
                type="text"
                autoFocus={isSearchOpen}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search oils, atta, spices..."
                className="w-full bg-[#f4f4ec] text-[#2d2a26] text-xs pl-8 pr-7 py-1.5 rounded-full border border-[#e5e2da] focus:outline-none focus:border-[#6e3418] focus:bg-[#fafbf5] placeholder:text-[#7d7567] transition-all"
              />
              {(searchQuery || isSearchOpen) && (
                <button
                  type="button"
                  onClick={() => {
                    setSearchQuery('');
                    setIsSearchOpen(false);
                  }}
                  className="absolute right-2.5 top-1.5 text-[#7d7567] hover:text-[#2d2a26] cursor-pointer"
                  aria-label="Close search"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* ─── 2. Majestic Artisanal Hero Header (Fills PC Screen Elegantly) ── */}
      <section className="w-full bg-gradient-to-b from-[#f4f4ec]/80 to-[#fafbf5] border-b border-[#e5e2da]/70 px-4 md:px-8 py-6 sm:py-8">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div className="max-w-3xl space-y-2">
            {/* Breadcrumb & Craft Badge */}
            <div className="flex items-center gap-2 flex-wrap text-[11px] font-semibold uppercase tracking-wider text-[#7d7567]">
              <Link to="/" className="hover:text-[#6e3418] transition-colors">
                Home
              </Link>
              <span>/</span>
              <Link to="/shop" className="hover:text-[#6e3418] transition-colors">
                Shop
              </Link>
              <span>/</span>
              <span className="text-[#6e3418] font-bold">{activeCategoryTitle}</span>
              <span className="bg-[#6e3418]/10 text-[#6e3418] px-2 py-0.5 rounded-full text-[10px] font-bold">
                {activeCategoryMeta.tag}
              </span>
            </div>

            {/* Category Title */}
            <h1 className="font-serif text-2xl sm:text-3xl md:text-4xl font-bold text-[#2d2a26] tracking-tight">
              {activeCategoryMeta.title}
            </h1>

            {/* Artisanal Provenance Description */}
            <p className="text-xs sm:text-sm text-[#52443c] leading-relaxed max-w-2xl font-sans">
              {activeCategoryMeta.subtitle}
            </p>

            {/* Craft Proof Highlights */}
            <div className="pt-2 flex flex-wrap gap-2 sm:gap-3">
              {activeCategoryMeta.highlights.map((h, idx) => (
                <div
                  key={idx}
                  className="inline-flex items-center gap-1.5 bg-[#fafbf5] border border-[#e5e2da] px-2.5 py-1 rounded-full text-[11px] font-medium text-[#2d2a26]"
                >
                  <CheckCircle2 className="w-3 h-3 text-[#3f674f] shrink-0" />
                  <span>{h}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Stats Pill on Desktop */}
          <div className="shrink-0 flex flex-col sm:flex-row md:flex-col items-start md:items-end gap-1.5 pt-2 md:pt-0">
            <span className="bg-[#f4f4ec] border border-[#e5e2da] text-[#6e3418] font-serif font-bold text-xs sm:text-sm px-3 py-1 rounded-full shadow-2xs">
              {filteredProducts.length} Authentic Harvest Batches
            </span>
            <span className="text-[11px] text-[#7d7567] font-medium flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-amber-600" />
              Direct Mill-to-Door Dispatch
            </span>
          </div>
        </div>
      </section>

      {/* ─── 3. Filter & Sort Toolbar ────────────────────────────────────── */}
      <section className="max-w-7xl mx-auto w-full px-4 md:px-8 pt-4 pb-2">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-3 border-b border-[#e5e2da]">
          {/* Active Filter & Count */}
          <div className="flex items-center gap-2 flex-wrap text-xs text-[#7d7567]">
            <span>
              Showing{' '}
              <strong className="text-[#2d2a26] font-semibold">
                {filteredProducts.length > 0 ? startIndex + 1 : 0}–{endIndex}
              </strong>{' '}
              of{' '}
              <strong className="text-[#2d2a26] font-semibold">
                {filteredProducts.length}
              </strong>{' '}
              authentic harvests
            </span>

            {activeCategory !== 'all' && (
              <button
                type="button"
                onClick={() => selectCategory('all')}
                className="inline-flex items-center gap-1 bg-[#f4f4ec] hover:bg-[#6e3418] text-[#6e3418] hover:text-[#fafbf5] px-2.5 py-0.5 rounded-full text-[11px] font-semibold transition-all border border-[#e5e2da] cursor-pointer"
              >
                <span>Clear Category</span>
                <X className="w-3 h-3" />
              </button>
            )}

            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="inline-flex items-center gap-1 bg-amber-50 hover:bg-amber-600 text-amber-900 hover:text-white px-2.5 py-0.5 rounded-full text-[11px] font-semibold transition-all border border-amber-200 cursor-pointer"
              >
                <span>Clear &quot;{searchQuery}&quot;</span>
                <X className="w-3 h-3" />
              </button>
            )}
          </div>

          {/* Sort By Dropdown */}
          <div className="flex items-center gap-2 self-end sm:self-auto">
            <SlidersHorizontal className="w-3.5 h-3.5 text-[#7d7567]" />
            <label
              htmlFor="shop-sort-select"
              className="text-xs uppercase tracking-wider font-semibold text-[#7d7567]"
            >
              Sort:
            </label>
            <select
              id="shop-sort-select"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="bg-[#f4f4ec] hover:bg-[#e8e8dc] text-[#2d2a26] text-xs font-medium px-3 py-1.5 rounded-full border border-[#e5e2da] focus:outline-none focus:border-[#6e3418] cursor-pointer transition-all"
            >
              <option value="featured">Featured Curations</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
              <option value="name-asc">Alphabetical: A–Z</option>
            </select>
          </div>
        </div>
      </section>

      {/* ─── 4. Products Catalogue Grid ─────────────────────────────────── */}
      <main id="products-catalogue-grid" className="max-w-7xl mx-auto w-full px-4 md:px-8 py-4 flex-grow">
        {isProductsLoading || isCategoriesLoading ? (
          <div className="py-24 text-center text-[#7d7567] font-serif">
            <span className="spinner mb-2 inline-block" />
            <p>Gathering fresh artisanal harvest lots...</p>
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="py-20 text-center space-y-4 max-w-md mx-auto">
            <div className="w-14 h-14 mx-auto rounded-full bg-[#f4f4ec] flex items-center justify-center text-[#6e3418] border border-[#e5e2da]">
              <span className="material-symbols-outlined text-2xl">eco</span>
            </div>
            <h3 className="font-serif text-lg font-bold text-[#2d2a26]">
              {searchQuery.trim()
                ? `No harvests matched "${searchQuery}"`
                : 'Seasonal harvest lot being prepared'}
            </h3>
            <p className="text-xs text-[#7d7567] leading-relaxed">
              Our small-batch pressers are currently preparing fresh lots. Explore our complete pantry in the meantime.
            </p>
            <button
              type="button"
              onClick={() => {
                setSearchQuery('');
                selectCategory('all');
              }}
              className="px-6 py-2.5 rounded-full bg-[#6e3418] text-[#fafbf5] text-xs font-semibold uppercase tracking-wider hover:bg-[#522510] transition-colors cursor-pointer shadow-xs"
            >
              View All Pantry Products
            </button>
          </div>
        ) : (
          <>
            {/* Symmetrical 4-Column Responsive Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-6">
              {paginatedProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onAddToCart={(variantId, qty) => handleAddToCart(variantId, qty)}
                />
              ))}
            </div>

            {/* Pagination Controls (Only shown when items exceed single page threshold) */}
            {shouldPaginate && totalPages > 1 && (
              <div className="mt-10 pt-6 border-t border-[#e5e2da] flex flex-col sm:flex-row items-center justify-between gap-4">
                <p className="text-xs text-[#7d7567] font-medium order-2 sm:order-1 text-center sm:text-left">
                  Showing {startIndex + 1}–{endIndex} of {filteredProducts.length} authentic harvests
                </p>

                <div className="flex items-center gap-1.5 sm:gap-2 order-1 sm:order-2">
                  {/* Prev Button */}
                  <button
                    type="button"
                    disabled={currentPage === 1}
                    onClick={() => changePage(currentPage - 1)}
                    className={`flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wider transition-all border ${
                      currentPage === 1
                        ? 'opacity-40 cursor-not-allowed bg-[#f4f4ec] text-[#7d7567] border-[#e5e2da]'
                        : 'bg-[#fafbf5] hover:bg-[#6e3418] text-[#2d2a26] hover:text-[#fafbf5] border-[#e5e2da] cursor-pointer shadow-2xs active:scale-95'
                    }`}
                  >
                    <ChevronLeft className="w-3.5 h-3.5" />
                    <span>Prev</span>
                  </button>

                  {/* Page Numbers */}
                  <div className="flex items-center gap-1">
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => {
                      const isActive = p === currentPage;
                      return (
                        <button
                          key={p}
                          type="button"
                          onClick={() => changePage(p)}
                          className={`w-8 h-8 rounded-full text-xs font-semibold transition-all flex items-center justify-center cursor-pointer ${
                            isActive
                              ? 'bg-[#6e3418] text-[#fafbf5] font-bold shadow-xs'
                              : 'bg-[#fafbf5] text-[#2d2a26] border border-[#e5e2da] hover:bg-[#f4f4ec] hover:border-[#6e3418]/30'
                          }`}
                        >
                          {p}
                        </button>
                      );
                    })}
                  </div>

                  {/* Next Button */}
                  <button
                    type="button"
                    disabled={currentPage === totalPages}
                    onClick={() => changePage(currentPage + 1)}
                    className={`flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wider transition-all border ${
                      currentPage === totalPages
                        ? 'opacity-40 cursor-not-allowed bg-[#f4f4ec] text-[#7d7567] border-[#e5e2da]'
                        : 'bg-[#fafbf5] hover:bg-[#6e3418] text-[#2d2a26] hover:text-[#fafbf5] border-[#e5e2da] cursor-pointer shadow-2xs active:scale-95'
                    }`}
                  >
                    <span>Next</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </main>

      {/* ─── 5. Bottom Artisanal Assurance Strip (Fills Desktop Space) ───── */}
      <section className="max-w-7xl mx-auto w-full px-4 md:px-8 mt-12">
        <div className="bg-[#f4f4ec] rounded-3xl p-6 sm:p-8 border border-[#e5e2da] shadow-xs">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8 items-center">
            {/* Left 2 Cols: Custom Mill Inquiries */}
            <div className="lg:col-span-2 space-y-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#6e3418]">
                Direct Mill Partnerships &amp; Bulk Orders
              </span>
              <h3 className="font-serif text-xl sm:text-2xl font-bold text-[#2d2a26]">
                Need Custom Cold-Pressing Tins or Bulk Guild Supplies?
              </h3>
              <p className="text-xs sm:text-sm text-[#52443c] leading-relaxed max-w-xl">
                We supply ancestral wood-pressed oils in 5-litre and 15-litre food-grade tins for discerning kitchens, Ayurvedic vaidyas, and organic food societies across Bharat.
              </p>
            </div>

            {/* Right Col: Quick Direct Action Buttons */}
            <div className="flex flex-col sm:flex-row lg:flex-col gap-2.5 lg:items-end justify-center">
              <a
                href={getWhatsappUrl('Hello Krishna Vedic, I would like to inquire about bulk cold-pressed oil tins and custom mill extraction.')}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 bg-[#25D366] hover:bg-[#20ba5a] text-white px-5 py-2.5 rounded-full text-xs font-semibold tracking-wider uppercase transition-all shadow-xs cursor-pointer"
              >
                <MessageCircle className="w-4 h-4" />
                <span>WhatsApp Mill Desk</span>
              </a>
              <a
                href={`tel:${supportPhone}`}
                className="inline-flex items-center justify-center gap-2 bg-[#fafbf5] hover:bg-[#6e3418] text-[#2d2a26] hover:text-[#fafbf5] border border-[#e5e2da] px-5 py-2.5 rounded-full text-xs font-semibold tracking-wider uppercase transition-all shadow-2xs cursor-pointer"
              >
                <Phone className="w-3.5 h-3.5" />
                <span>Call {supportPhone}</span>
              </a>
            </div>
          </div>

          {/* 3 Pillar Guarantee Micro-Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-6 mt-6 border-t border-[#e5e2da]">
            <div className="flex items-start gap-3">
              <span className="material-symbols-outlined text-[#6e3418] text-xl shrink-0 mt-0.5">
                nature
              </span>
              <div>
                <h4 className="text-xs font-bold text-[#2d2a26]">Ancestral Wood Ghanis</h4>
                <p className="text-[11px] text-[#7d7567] leading-relaxed">
                  Slow 14 RPM rotation below 38°C preserves living nutrients and enzymes.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <span className="material-symbols-outlined text-[#6e3418] text-xl shrink-0 mt-0.5">
                science
              </span>
              <div>
                <h4 className="text-xs font-bold text-[#2d2a26]">Zero Plastic Guarantee</h4>
                <p className="text-[11px] text-[#7d7567] leading-relaxed">
                  Only premium food-grade tin and amber glass containers — zero microplastics.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <span className="material-symbols-outlined text-[#6e3418] text-xl shrink-0 mt-0.5">
                local_shipping
              </span>
              <div>
                <h4 className="text-xs font-bold text-[#2d2a26]">Pan-Bharat Fast Dispatch</h4>
                <p className="text-[11px] text-[#7d7567] leading-relaxed">
                  Freshly extracted and safely packed with leak-proof protection to your doorstep.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
