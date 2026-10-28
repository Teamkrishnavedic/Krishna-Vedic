import React, { useState, useMemo } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import api from '@/lib/api';
import ProductCard from '@/components/ProductCard';
import { useCart } from '@/context/CartContext';
import { useToast } from '@/context/ToastContext';

// Helper to assign a fitting icon to any database category dynamically
const getCategoryIcon = (name: string, slug: string) => {
  const s = (name + ' ' + slug).toLowerCase();
  if (s.includes('oil')) return 'water_drop';
  if (s.includes('spice') || s.includes('ground') || s.includes('powder')) return 'grain';
  if (s.includes('masala') || s.includes('blend')) return 'restaurant_menu';
  if (s.includes('whole') || s.includes('seed')) return 'spa';
  if (s.includes('ghee') || s.includes('honey') || s.includes('dairy')) return 'hive';
  return 'category';
};

export default function ShopPage() {
  const { addItem } = useCart();
  const { toast } = useToast();
  const [searchParams, setSearchParams] = useSearchParams();

  const [activeCategory, setActiveCategory] = useState<string>(
    searchParams.get('category') || 'all'
  );
  const [searchQuery, setSearchQuery] = useState<string>(
    searchParams.get('q') || ''
  );
  const [sortBy, setSortBy] = useState<string>('featured');

  // 1. Fetch all published products from API
  const { data: productsData, isLoading: isProductsLoading } = useQuery({
    queryKey: ['shop-all-products'],
    queryFn: async () => {
      const res = await api.get('/products?limit=100');
      return res.data;
    },
  });

  // 2. Fetch live categories directly from database (admin added / updated)
  const { data: categoriesData, isLoading: isCategoriesLoading } = useQuery({
    queryKey: ['categories'],
    queryFn: async () => {
      const res = await api.get('/categories');
      return res.data.categories || [];
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

  const allProducts: any[] = productsData?.products || [];
  const dbCategories: any[] = categoriesData || [];

  // 3. 100% Dynamic Category Tabs: 'All Products' + every category in the database
  const categoryTabs = useMemo(() => {
    const tabs = [
      { label: 'All Products', slug: 'all', icon: 'apps' },
    ];

    for (const cat of dbCategories) {
      tabs.push({
        label: cat.name,
        slug: cat.slug,
        icon: getCategoryIcon(cat.name, cat.slug),
      });
    }

    return tabs;
  }, [dbCategories]);

  // 4. Filter & sort products
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
      result = result.filter(
        (p) => p.category?.slug === activeCategory || p.categoryId === activeCategory
      );
    }

    // Sort
    if (sortBy === 'price-asc') {
      result.sort((a, b) => {
        const priceA = a.variants?.[0]?.price || 0;
        const priceB = b.variants?.[0]?.price || 0;
        return priceA - priceB;
      });
    } else if (sortBy === 'price-desc') {
      result.sort((a, b) => {
        const priceA = a.variants?.[0]?.price || 0;
        const priceB = b.variants?.[0]?.price || 0;
        return priceB - priceA;
      });
    } else if (sortBy === 'name') {
      result.sort((a, b) => a.name.localeCompare(b.name));
    }

    return result;
  }, [allProducts, searchQuery, activeCategory, sortBy]);

  // 5. 100% Dynamic Category Sections for the Showcase View
  // Every category created in admin that has products appears automatically!
  const categorySections = useMemo(() => {
    return dbCategories
      .map((cat) => {
        const prods = allProducts.filter(
          (p) => p.categoryId === cat.id || p.category?.slug === cat.slug || p.category?.id === cat.id
        );
        return {
          id: cat.id,
          categoryName: cat.name,
          slug: cat.slug,
          description:
            cat.description ||
            `Handcrafted traditional ${cat.name.toLowerCase()} direct from verified ancestral farm harvests.`,
          icon: getCategoryIcon(cat.name, cat.slug),
          products: prods,
        };
      })
      .filter((sec) => sec.products.length > 0);
  }, [dbCategories, allProducts]);

  const selectCategory = (slug: string) => {
    setActiveCategory(slug);
    if (slug === 'all') {
      searchParams.delete('category');
    } else {
      searchParams.set('category', slug);
    }
    setSearchParams(searchParams);
  };

  const activeCategoryTitle =
    categoryTabs.find((t) => t.slug === activeCategory)?.label || 'Products';

  return (
    <div className="flex flex-col w-full bg-[#fafbf5] text-[#2d2a26] min-h-screen pb-24">
      {/* ─── 1. Clean Top Header & Search Bar ──────────────────────────────── */}
      <section className="w-full bg-[#fafbf5] border-b border-[#e5e2da] pt-6 pb-5 px-4 md:px-8">
        <div className="max-w-7xl mx-auto space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <div className="flex items-center gap-2 text-xs text-[#7d7567] uppercase tracking-wider">
                <Link to="/" className="hover:text-[#6e3418]">Home</Link>
                <span>/</span>
                <span className="text-[#6e3418] font-bold">Products &amp; Pantry</span>
              </div>
              <h1 className="font-serif text-2xl sm:text-3xl text-[#2d2a26] font-bold mt-1">
                The Krishnavedic Pantry
              </h1>
            </div>

            {/* Sort Dropdown */}
            <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
              <span className="text-xs text-[#7d7567] hidden sm:inline">Sort:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="bg-[#f4f4ec] text-[#2d2a26] text-xs font-semibold px-3.5 py-2 rounded-full border border-[#e5e2da] focus:outline-none focus:border-[#6e3418] cursor-pointer"
              >
                <option value="featured">Featured / Recommended</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
                <option value="name">Alphabetical (A-Z)</option>
              </select>
            </div>
          </div>

          {/* Clean Top Instant Search Bar */}
          <div className="relative w-full max-w-2xl">
            <span className="material-symbols-outlined absolute left-4 top-3 text-[#7d7567] text-lg">
              search
            </span>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by product name, ingredient, haldi, oil, masalas..."
              className="w-full bg-[#f4f4ec] text-[#2d2a26] text-sm pl-11 pr-10 py-2.5 rounded-full border border-[#e5e2da] focus:outline-none focus:border-[#6e3418] focus:bg-[#fafbf5] placeholder:text-[#7d7567] transition-all"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute right-3.5 top-2.5 text-[#7d7567] hover:text-[#2d2a26] cursor-pointer"
              >
                <span className="material-symbols-outlined text-lg">close</span>
              </button>
            )}
          </div>
        </div>
      </section>

      {/* ─── 2. Top Department Navbar (100% Dynamic from Database) ─────────── */}
      <nav className="sticky top-16 md:top-20 z-30 w-full bg-[#fafbf5]/95 backdrop-blur-md border-b border-[#e5e2da] py-2.5 px-4 md:px-8 shadow-xs">
        <div className="max-w-7xl mx-auto flex items-center gap-2 overflow-x-auto no-scrollbar">
          {categoryTabs.map((tab) => {
            const isSelected = activeCategory === tab.slug;
            return (
              <button
                key={tab.slug}
                onClick={() => selectCategory(tab.slug)}
                className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs font-semibold whitespace-nowrap uppercase tracking-wider transition-all cursor-pointer border ${
                  isSelected
                    ? 'bg-[#6e3418] text-[#fafbf5] border-[#6e3418] shadow-xs'
                    : 'bg-[#f4f4ec] text-[#2d2a26] border-[#e5e2da] hover:bg-[#e8e8dc] hover:text-[#6e3418]'
                }`}
              >
                <span className="material-symbols-outlined text-base">
                  {tab.icon}
                </span>
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </nav>

      {/* ─── 3. Main Product Showcase / Grid ───────────────────────────────── */}
      <main className="max-w-7xl mx-auto w-full px-4 md:px-8 py-8 space-y-12">
        {isProductsLoading || isCategoriesLoading ? (
          <div className="py-24 text-center text-[#7d7567] font-serif">
            <span className="spinner mb-2 inline-block" />
            <p>Loading fresh harvest products...</p>
          </div>
        ) : searchQuery.trim() ? (
          /* ─── Search Results View ────────────────────────────────────────── */
          <div className="space-y-6">
            <div className="flex items-center justify-between border-b border-[#e5e2da] pb-3">
              <h2 className="font-serif text-xl sm:text-2xl text-[#2d2a26] font-bold">
                Search Results for &ldquo;{searchQuery}&rdquo;
              </h2>
              <span className="text-xs text-[#7d7567]">
                {filteredProducts.length} {filteredProducts.length === 1 ? 'item' : 'items'} found
              </span>
            </div>

            {filteredProducts.length === 0 ? (
              <div className="py-20 text-center space-y-3">
                <p className="font-serif text-lg text-[#7d7567]">No products matched your search.</p>
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="px-6 py-2 rounded-full bg-[#6e3418] text-[#fafbf5] text-xs font-semibold uppercase tracking-wider cursor-pointer"
                >
                  Clear Search
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {filteredProducts.map((product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    onAddToCart={(variantId, qty) => handleAddToCart(variantId, qty)}
                  />
                ))}
              </div>
            )}
          </div>
        ) : activeCategory === 'all' ? (
          /* ─── Category-by-Category Showcase View (100% Database Driven) ─── */
          <div className="space-y-16">
            {categorySections.length === 0 ? (
              <div className="py-20 text-center text-[#7d7567] font-serif">
                No products found in the catalog.
              </div>
            ) : (
              categorySections.map((sec) => (
                <section key={sec.slug} className="space-y-6">
                  {/* Category Showcase Header */}
                  <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 border-b border-[#e5e2da] pb-4">
                    <div className="space-y-1">
                      <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#6e3418]">
                        <span className="material-symbols-outlined text-base">{sec.icon}</span>
                        <span>Department</span>
                      </div>
                      <h2 className="font-serif text-2xl sm:text-3xl text-[#2d2a26] font-bold">
                        {sec.categoryName}
                      </h2>
                      <p className="text-xs text-[#7d7567] max-w-xl">
                        {sec.description}
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={() => selectCategory(sec.slug)}
                      className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#3f674f] hover:text-[#2d4d3a] hover:underline cursor-pointer self-start sm:self-auto shrink-0"
                    >
                      <span>View All {sec.categoryName} ({sec.products.length})</span>
                      <span className="material-symbols-outlined text-sm">arrow_forward</span>
                    </button>
                  </div>

                  {/* Products Grid (Shows live products of this category from database) */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {sec.products.slice(0, 4).map((product) => (
                      <ProductCard
                        key={product.id}
                        product={product}
                        onAddToCart={(variantId, qty) => handleAddToCart(variantId, qty)}
                      />
                    ))}
                  </div>
                </section>
              ))
            )}
          </div>
        ) : (
          /* ─── Single Category View (When specific tab is clicked) ────────── */
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#e5e2da] pb-4">
              <div>
                <h2 className="font-serif text-2xl sm:text-3xl text-[#2d2a26] font-bold">
                  {activeCategoryTitle}
                </h2>
                <p className="text-xs text-[#7d7567] mt-0.5">
                  Showing all {filteredProducts.length} authentic handcrafted items
                </p>
              </div>

              <button
                type="button"
                onClick={() => selectCategory('all')}
                className="inline-flex items-center gap-1 text-xs font-semibold text-[#7d7567] hover:text-[#6e3418] cursor-pointer"
              >
                <span className="material-symbols-outlined text-sm">arrow_back</span>
                <span>Back to All Categories</span>
              </button>
            </div>

            {filteredProducts.length === 0 ? (
              <div className="py-20 text-center space-y-3">
                <p className="font-serif text-lg text-[#7d7567]">No products in this category yet.</p>
                <button
                  type="button"
                  onClick={() => selectCategory('all')}
                  className="px-6 py-2 rounded-full bg-[#6e3418] text-[#fafbf5] text-xs font-semibold uppercase tracking-wider cursor-pointer"
                >
                  View All Categories
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {filteredProducts.map((product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    onAddToCart={(variantId, qty) => handleAddToCart(variantId, qty)}
                  />
                ))}
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}
