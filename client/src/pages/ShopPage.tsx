import React, { useState, useMemo, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import api from '@/lib/api';
import ProductCard from '@/components/ProductCard';
import { useCart } from '@/context/CartContext';
import { useToast } from '@/context/ToastContext';

// Dynamic icon resolver for database categories
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

  const allProducts: any[] = productsData?.products || [];
  const dbCategories: any[] = categoriesData || [];

  // Reset activeCategory if URL category slug does not exist in dbCategories
  useEffect(() => {
    const urlCat = searchParams.get('category');
    if (urlCat && urlCat !== 'all' && dbCategories.length > 0) {
      const exists = dbCategories.some(
        (c) => c.slug === urlCat || c.id === urlCat
      );
      if (!exists) {
        setActiveCategory('all');
        searchParams.delete('category');
        setSearchParams(searchParams, { replace: true });
      } else {
        setActiveCategory(urlCat);
      }
    }
  }, [searchParams, dbCategories]);

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

  // 4. Filter products by search and category
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
        (p) =>
          p.category?.slug === activeCategory ||
          p.categoryId === activeCategory ||
          p.category?.id === activeCategory
      );
    }

    return result;
  }, [allProducts, searchQuery, activeCategory]);

  // 5. Dynamic Category Sections for the Showcase View
  const categorySections = useMemo(() => {
    return dbCategories
      .map((cat) => {
        const prods = allProducts.filter(
          (p) =>
            p.categoryId === cat.id ||
            p.category?.slug === cat.slug ||
            p.category?.id === cat.id
        );
        return {
          id: cat.id,
          categoryName: cat.name,
          slug: cat.slug,
          description: cat.description,
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

  return (
    <div className="flex flex-col w-full bg-[#fafbf5] text-[#2d2a26] min-h-screen pb-24">
      {/* ─── 1. Clean Products Navbar + Small Search (Right under Main Header) ── */}
      <nav className="sticky top-16 md:top-20 z-30 w-full bg-[#fafbf5]/95 backdrop-blur-md border-b border-[#e5e2da] py-2 px-4 md:px-8 shadow-xs">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-3">
          {/* Scrollable Category Pills from Database */}
          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar flex-grow py-0.5">
            {categoryTabs.map((tab) => {
              const isSelected = activeCategory === tab.slug;
              return (
                <button
                  key={tab.slug}
                  onClick={() => selectCategory(tab.slug)}
                  className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap uppercase tracking-wider transition-all cursor-pointer border ${
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

          {/* Compact Small Search on the right */}
          <div className="relative shrink-0 w-36 sm:w-56 md:w-64">
            <span className="material-symbols-outlined absolute left-3 top-2 text-[#7d7567] text-base">
              search
            </span>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search items..."
              className="w-full bg-[#f4f4ec] text-[#2d2a26] text-xs pl-8 pr-7 py-1.5 rounded-full border border-[#e5e2da] focus:outline-none focus:border-[#6e3418] focus:bg-[#fafbf5] placeholder:text-[#7d7567] transition-all"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-1.5 text-[#7d7567] hover:text-[#2d2a26] cursor-pointer"
              >
                <span className="material-symbols-outlined text-sm">close</span>
              </button>
            )}
          </div>
        </div>
      </nav>

      {/* ─── 2. Main Product Showcase & Grid (Zero Extra Headings) ─────────── */}
      <main className="max-w-7xl mx-auto w-full px-4 md:px-8 py-6 space-y-12">
        {isProductsLoading || isCategoriesLoading ? (
          <div className="py-24 text-center text-[#7d7567] font-serif">
            <span className="spinner mb-2 inline-block" />
            <p>Loading fresh products...</p>
          </div>
        ) : searchQuery.trim() ? (
          /* ─── Search Results View ────────────────────────────────────────── */
          <div className="space-y-6">
            <div className="flex items-center justify-between border-b border-[#e5e2da] pb-3">
              <span className="font-serif text-lg text-[#2d2a26] font-bold">
                Results for &ldquo;{searchQuery}&rdquo;
              </span>
              <span className="text-xs text-[#7d7567]">
                {filteredProducts.length} {filteredProducts.length === 1 ? 'item' : 'items'}
              </span>
            </div>

            {filteredProducts.length === 0 ? (
              <div className="py-20 text-center space-y-3">
                <p className="font-serif text-base text-[#7d7567]">No products matched your search.</p>
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="px-5 py-2 rounded-full bg-[#6e3418] text-[#fafbf5] text-xs font-semibold uppercase tracking-wider cursor-pointer"
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
          /* ─── Category-by-Category Showcase View ─────────────────────────── */
          <div className="space-y-12">
            {categorySections.length === 0 ? (
              <div className="py-20 text-center text-[#7d7567] font-serif">
                No products found in the catalog.
              </div>
            ) : (
              categorySections.map((sec) => (
                <section key={sec.slug} className="space-y-4">
                  {/* Category Section Header */}
                  <div className="flex items-center justify-between border-b border-[#e5e2da] pb-2.5">
                    <div className="flex items-center gap-2">
                      <span className="material-symbols-outlined text-lg text-[#6e3418]">
                        {sec.icon}
                      </span>
                      <h2 className="font-serif text-xl sm:text-2xl text-[#2d2a26] font-bold">
                        {sec.categoryName}
                      </h2>
                    </div>

                    <button
                      type="button"
                      onClick={() => selectCategory(sec.slug)}
                      className="inline-flex items-center gap-1 text-xs font-bold uppercase tracking-wider text-[#3f674f] hover:text-[#2d4d3a] hover:underline cursor-pointer"
                    >
                      <span>View All ({sec.products.length})</span>
                      <span className="material-symbols-outlined text-sm">arrow_forward</span>
                    </button>
                  </div>

                  {/* Products Grid */}
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
          /* ─── Single Selected Category View ──────────────────────────────── */
          <div className="space-y-6">
            {filteredProducts.length === 0 ? (
              <div className="py-20 text-center space-y-3">
                <p className="font-serif text-base text-[#7d7567]">No products in this category yet.</p>
                <button
                  type="button"
                  onClick={() => selectCategory('all')}
                  className="px-5 py-2 rounded-full bg-[#6e3418] text-[#fafbf5] text-xs font-semibold uppercase tracking-wider cursor-pointer"
                >
                  View All Products
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
