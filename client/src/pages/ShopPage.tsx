import React, { useState, useMemo } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import api from '@/lib/api';
import ProductCard from '@/components/ProductCard';
import { useCart } from '@/context/CartContext';
import { useToast } from '@/context/ToastContext';

export default function ShopPage() {
  const { addItem } = useCart();
  const { toast } = useToast();
  const [searchParams] = useSearchParams();

  const [page, setPage] = useState(1);
  const [sortBy, setSortBy] = useState('featured');
  const [gridCols, setGridCols] = useState<3 | 4>(3);
  const [priceCeiling, setPriceCeiling] = useState<number>(1800);
  const [selectedCategory, setSelectedCategory] = useState<string>(
    searchParams.get('category') || 'all'
  );
  const [extractionFilter, setExtractionFilter] = useState<string[]>([]);
  const [provenanceFilter, setProvenanceFilter] = useState<string[]>([]);
  const [inStockOnly, setInStockOnly] = useState<boolean>(false);

  // Fetch products from API
  const { data, isLoading } = useQuery({
    queryKey: ['products', page, sortBy, selectedCategory],
    queryFn: () => {
      const catQuery = selectedCategory !== 'all' ? `&category=${selectedCategory}` : '';
      return api
        .get(`/products?page=${page}&limit=24&sort=${sortBy}${catQuery}`)
        .then((r) => r.data);
    },
  });

  const { data: categories } = useQuery({
    queryKey: ['categories'],
    queryFn: () => api.get('/categories').then((r) => r.data.categories),
  });

  const handleAddToCart = async (variantId: string, name: string) => {
    try {
      await addItem(variantId, 1);
      toast({ title: 'Added to cart', description: name, variant: 'success' });
    } catch (err: any) {
      toast({ title: 'Error', description: err.message, variant: 'error' });
    }
  };

  const toggleExtraction = (method: string) => {
    setExtractionFilter((prev) =>
      prev.includes(method) ? prev.filter((m) => m !== method) : [...prev, method]
    );
  };

  const toggleProvenance = (region: string) => {
    setProvenanceFilter((prev) =>
      prev.includes(region) ? prev.filter((r) => r !== region) : [...prev, region]
    );
  };

  const clearAllFilters = () => {
    setSelectedCategory('all');
    setExtractionFilter([]);
    setProvenanceFilter([]);
    setPriceCeiling(1800);
    setInStockOnly(false);
  };

  const filteredProducts = useMemo(() => {
    if (!data?.products) return [];
    return data.products.filter((p: any) => {
      const minPricePaise = p.variants?.length
        ? Math.min(...p.variants.map((v: any) => v.price))
        : 0;
      const minPriceRupees = minPricePaise / 100;
      if (minPriceRupees > priceCeiling) return false;

      if (extractionFilter.length > 0) {
        const desc = (p.description || '').toLowerCase() + (p.name || '').toLowerCase();
        const matches = extractionFilter.some((m) => desc.includes(m.toLowerCase()));
        if (!matches) return false;
      }

      if (provenanceFilter.length > 0) {
        const origin = (p.origin || '').toLowerCase() + (p.description || '').toLowerCase();
        const matches = provenanceFilter.some((reg) => origin.includes(reg.toLowerCase()));
        if (!matches) return false;
      }

      if (inStockOnly) {
        const hasStock = p.variants?.some((v: any) => (v.stock ?? v.inventoryQty ?? v.inventory ?? 1) > 0);
        if (!hasStock) return false;
      }

      return true;
    });
  }, [data?.products, priceCeiling, extractionFilter, provenanceFilter, inStockOnly]);

  const totalCount = data?.pagination?.total || (data?.products ? data.products.length : 24);

  return (
    <div className="w-full flex flex-col bg-surface min-h-screen">
      {/* Top Category Banner & Breadcrumb Area */}
      <section className="w-full bg-surface-container-low px-gutter-mobile md:px-margin py-space-xl border-b border-outline-variant/30">
        <div className="max-w-7xl mx-auto flex flex-col gap-space-md">
          {/* Breadcrumb navigation */}
          <nav className="flex items-center gap-2 font-label-md text-label-md text-on-surface-variant uppercase tracking-widest text-xs">
            <Link to="/" className="hover:text-primary transition-colors">
              Home
            </Link>
            <span className="text-outline">/</span>
            <span className="text-primary font-semibold">Shop All Products</span>
            <span className="bg-surface px-2.5 py-0.5 text-on-surface-variant font-label-sm text-xs ml-2 rounded-full border border-outline-variant/20">
              {totalCount} Harvest Items
            </span>
          </nav>

          {/* Main Editorial Header */}
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-space-lg">
            <div className="max-w-3xl space-y-2">
              <span className="font-label-md text-xs uppercase tracking-widest text-primary font-bold flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-primary inline-block"></span>
                Heritage Bull-Ghani &amp; Single-Origin Harvest
              </span>
              <h1 className="font-headline-lg text-headline-lg text-primary tracking-tight font-serif">
                Cold-Pressed Oils, Stone-Ground Masalas &amp; Whole Spices
              </h1>
              <p className="font-body-md text-body-md text-on-surface-variant pt-1 leading-relaxed">
                Slowly wood-pressed in Mara Chekku ghanis below 38°C and stone-pulverized on traditional chakkis.
                Retaining full-bodied aroma, essential volatiles, and natural antioxidants direct from our farmer guilds.
              </p>
            </div>

            {/* Quick Guild Certification Seals */}
            <div className="flex items-center gap-3 self-start lg:self-auto bg-surface p-space-md rounded-2xl border border-outline-variant/30 shadow-xs">
              <div className="flex flex-col text-right">
                <span className="font-label-sm text-xs uppercase tracking-wider text-secondary font-bold">
                  Lab Assayed
                </span>
                <span className="font-body-sm text-xs text-on-surface font-medium">
                  100% Raw &amp; Unadulterated
                </span>
              </div>
              <span
                className="material-symbols-outlined text-secondary text-2xl"
                style={{ fontVariationSettings: "'FILL' 1" }}
              >
                verified
              </span>
            </div>
          </div>

          {/* Quick Category Navigation Tabs with smooth curves */}
          <div className="flex items-center gap-2 overflow-x-auto pt-space-md no-scrollbar">
            <button
              onClick={() => setSelectedCategory('all')}
              className={`px-5 py-2 font-label-md text-xs uppercase tracking-wider whitespace-nowrap transition-all cursor-pointer rounded-full border ${
                selectedCategory === 'all'
                  ? 'bg-primary text-on-primary border-primary font-semibold shadow-xs'
                  : 'bg-surface hover:bg-surface-container text-on-surface-variant border-outline-variant/30 hover:text-primary'
              }`}
              type="button"
            >
              All Products ({totalCount})
            </button>
            {categories?.map((cat: any) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.slug)}
                className={`px-5 py-2 font-label-md text-xs uppercase tracking-wider whitespace-nowrap transition-all cursor-pointer rounded-full border ${
                  selectedCategory === cat.slug
                    ? 'bg-primary text-on-primary border-primary font-semibold shadow-xs'
                    : 'bg-surface hover:bg-surface-container text-on-surface-variant border-outline-variant/30 hover:text-primary'
                }`}
                type="button"
              >
                {cat.name}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Main Catalog Workplace (Sidebar Filters + Product Grid) */}
      <section className="w-full px-gutter-mobile md:px-margin py-space-xl max-w-7xl mx-auto">
        {/* Action Bar: Applied Filters, Sorter, Grid Layout Switcher */}
        <div className="bg-surface-container-low p-space-md mb-space-xl rounded-2xl flex flex-col md:flex-row items-start md:items-center justify-between gap-space-md border border-outline-variant/30 shadow-xs">
          {/* Left: Active Filter Chips */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="font-label-sm text-xs uppercase tracking-wider text-on-surface-variant font-medium">
              Active Filters:
            </span>
            <span className="bg-surface px-3 py-1 font-label-sm text-xs text-on-surface flex items-center gap-1.5 rounded-full border border-outline-variant/30">
              Category: {selectedCategory === 'all' ? 'All' : selectedCategory}
              {selectedCategory !== 'all' && (
                <button
                  onClick={() => setSelectedCategory('all')}
                  className="text-outline hover:text-primary leading-none text-xs ml-1 cursor-pointer"
                  type="button"
                >
                  ×
                </button>
              )}
            </span>
            {extractionFilter.map((m) => (
              <span
                key={m}
                className="bg-surface px-3 py-1 font-label-sm text-xs text-on-surface flex items-center gap-1.5 rounded-full border border-outline-variant/30"
              >
                Extraction: {m}
                <button
                  onClick={() => toggleExtraction(m)}
                  className="text-outline hover:text-primary leading-none text-xs ml-1 cursor-pointer"
                  type="button"
                >
                  ×
                </button>
              </span>
            ))}
            {provenanceFilter.map((r) => (
              <span
                key={r}
                className="bg-surface px-2.5 py-1 font-label-sm text-label-sm text-on-surface flex items-center gap-1.5 border border-outline-variant/30"
              >
                Origin: {r}
                <button
                  onClick={() => toggleProvenance(r)}
                  className="text-outline hover:text-primary leading-none text-xs ml-1 cursor-pointer"
                  type="button"
                >
                  ×
                </button>
              </span>
            ))}
            {(selectedCategory !== 'all' ||
              extractionFilter.length > 0 ||
              provenanceFilter.length > 0 ||
              priceCeiling < 1800 ||
              inStockOnly) && (
              <button
                onClick={clearAllFilters}
                className="font-label-sm text-label-sm text-primary uppercase underline underline-offset-4 font-semibold hover:text-secondary pl-2 cursor-pointer"
                type="button"
              >
                Clear All
              </button>
            )}
          </div>

          {/* Right: Sorting & Display Density */}
          <div className="flex items-center gap-space-md w-full md:w-auto justify-between md:justify-end">
            <div className="flex items-center gap-2">
              <label
                className="font-label-sm text-label-sm uppercase tracking-wider text-on-surface-variant whitespace-nowrap"
                htmlFor="catalog-sort"
              >
                Sort By:
              </label>
              <select
                className="bg-surface text-on-surface font-body-sm text-body-sm px-space-md py-2 focus:outline-none focus:bg-surface-container-high transition-colors cursor-pointer border border-outline-variant/40"
                id="catalog-sort"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
              >
                <option value="featured">Featured Heritage Selection</option>
                <option value="createdAt">Freshly Pressed / New Harvest</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
              </select>
            </div>

            {/* Grid Column Controls */}
            <div className="hidden sm:flex items-center bg-surface p-1 gap-1 rounded-full border border-outline-variant/30">
              <button
                aria-label="3 column layout"
                onClick={() => setGridCols(3)}
                className={`p-1.5 rounded-full transition-colors cursor-pointer ${
                  gridCols === 3
                    ? 'bg-surface-container-highest text-primary font-bold'
                    : 'text-on-surface-variant hover:text-primary'
                }`}
                title="3-Column Editorial View"
                type="button"
              >
                <span className="material-symbols-outlined text-lg leading-none">view_column</span>
              </button>
              <button
                aria-label="4 column layout"
                onClick={() => setGridCols(4)}
                className={`p-1.5 rounded-full transition-colors cursor-pointer ${
                  gridCols === 4
                    ? 'bg-surface-container-highest text-primary font-bold'
                    : 'text-on-surface-variant hover:text-primary'
                }`}
                title="4-Column Compact View"
                type="button"
              >
                <span className="material-symbols-outlined text-lg leading-none">grid_view</span>
              </button>
            </div>
          </div>
        </div>

        {/* Layout Grid: Left Sidebar + Right Products */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-space-xl items-start">
          {/* FILTER SIDEBAR (3 Cols on lg) */}
          <aside className="lg:col-span-3 flex flex-col gap-space-lg bg-surface-container-low p-space-lg rounded-3xl border border-outline-variant/30 shadow-xs">
            <div className="flex items-center justify-between pb-space-sm bg-surface-container-high p-3 rounded-2xl border-b border-outline-variant/30">
              <span className="font-headline-sm text-headline-sm text-primary font-serif">
                Refine Harvest
              </span>
              <span className="material-symbols-outlined text-primary text-xl">tune</span>
            </div>

            {/* Filter 1: Extraction Technique */}
            <div className="flex flex-col gap-space-sm bg-surface p-space-md rounded-2xl border border-outline-variant/20 shadow-xs">
              <h3 className="font-label-lg text-label-lg uppercase tracking-wider text-primary font-bold">
                Extraction Method
              </h3>
              <div className="flex flex-col gap-2 pt-1 font-body-sm text-body-sm">
                {[
                  { label: 'Wood-Pressed Ghani', key: 'wood' },
                  { label: 'Slow Stone-Ground', key: 'stone' },
                  { label: 'Hand-Pounded Masala', key: 'pound' },
                  { label: 'Sun-Dried Whole Pods', key: 'sun' },
                ].map((item) => (
                  <label
                    key={item.key}
                    className="flex items-center justify-between cursor-pointer group"
                  >
                    <span className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={extractionFilter.includes(item.key)}
                        onChange={() => toggleExtraction(item.key)}
                        className="w-4 h-4 accent-primary rounded-none cursor-pointer"
                      />
                      <span className="text-on-surface group-hover:text-primary transition-colors">
                        {item.label}
                      </span>
                    </span>
                  </label>
                ))}
              </div>
            </div>

            {/* Filter 2: Price Range Slider */}
            <div className="flex flex-col gap-space-sm bg-surface p-space-md rounded-2xl border border-outline-variant/20 shadow-xs">
              <div className="flex items-center justify-between">
                <h3 className="font-label-lg text-label-lg uppercase tracking-wider text-primary font-bold">
                  Price Ceiling
                </h3>
                <span className="font-label-md text-label-md text-primary font-bold">
                  ₹150 to ₹{priceCeiling}
                </span>
              </div>
              <input
                className="w-full accent-primary cursor-pointer mt-2"
                max={1800}
                min={150}
                step={50}
                type="range"
                value={priceCeiling}
                onChange={(e) => setPriceCeiling(Number(e.target.value))}
              />
              <div className="flex justify-between font-label-sm text-label-sm text-on-surface-variant">
                <span>₹150 Spices</span>
                <span>₹1,800 Ghani 5L</span>
              </div>
            </div>

            {/* Filter 3: Micro-Region Provenance */}
            <div className="flex flex-col gap-space-sm bg-surface p-space-md rounded-2xl border border-outline-variant/20 shadow-xs">
              <h3 className="font-label-lg text-label-lg uppercase tracking-wider text-primary font-bold">
                Micro-Region Provenance
              </h3>
              <div className="flex flex-col gap-2 pt-1 font-body-sm text-body-sm">
                {[
                  { name: 'Rajasthan (Black Mustard)', key: 'rajasthan' },
                  { name: 'Salem, TN (High-Curcumin)', key: 'salem' },
                  { name: 'Karnataka (Byadagi Chilli)', key: 'karnataka' },
                  { name: 'Wayanad (Malabar Peppercorn)', key: 'wayanad' },
                ].map((reg) => (
                  <label
                    key={reg.key}
                    className="flex items-center justify-between cursor-pointer group"
                  >
                    <span className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={provenanceFilter.includes(reg.key)}
                        onChange={() => toggleProvenance(reg.key)}
                        className="w-4 h-4 accent-primary rounded cursor-pointer"
                      />
                      <span className="text-on-surface group-hover:text-primary transition-colors">
                        {reg.name}
                      </span>
                    </span>
                  </label>
                ))}
              </div>
            </div>

            {/* Filter 4: Batch Availability */}
            <div className="flex flex-col gap-space-sm bg-surface p-space-md rounded-2xl border border-outline-variant/20 shadow-xs">
              <h3 className="font-label-lg text-label-lg uppercase tracking-wider text-primary font-bold">
                Harvest Status
              </h3>
              <div className="flex flex-col gap-2 font-body-sm text-body-sm">
                <label className="flex items-center justify-between cursor-pointer">
                  <span className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={inStockOnly}
                      onChange={(e) => setInStockOnly(e.target.checked)}
                      className="w-4 h-4 accent-secondary rounded cursor-pointer"
                    />
                    <span className="text-on-surface font-medium">In Stock &amp; Bottled</span>
                  </span>
                  <span className="bg-secondary-fixed text-on-secondary-fixed px-2 py-0.5 rounded-full font-label-sm text-xs font-semibold">
                    Live
                  </span>
                </label>
              </div>
            </div>

            {/* Guild Seal Certificate Box */}
            <div className="bg-surface-container-highest p-space-md rounded-2xl flex flex-col gap-2 border border-outline-variant/30 shadow-xs">
              <span className="font-label-sm text-label-sm uppercase tracking-widest text-primary font-bold">
                Provenance Pledge
              </span>
              <p className="font-body-sm text-body-sm text-on-surface-variant leading-relaxed">
                Every glass bottle carries its master miller signature and direct QR linking to the
                NABL moisture and acid value assay report.
              </p>
              <Link
                to="/about"
                className="font-label-md text-label-md text-secondary font-bold uppercase tracking-wider hover:text-primary mt-1"
              >
                Read Assay Protocol &rarr;
              </Link>
            </div>
          </aside>

          {/* PRODUCT SHOWCASE GRID (9 Cols on lg) */}
          <main className="lg:col-span-9 flex flex-col gap-space-xl">
            {isLoading ? (
              <div className="p-12 text-center text-on-surface-variant font-serif text-lg border border-outline-variant/30 bg-surface-container-lowest">
                Retrieving small-batch harvest logs...
              </div>
            ) : filteredProducts.length === 0 ? (
              <div className="bg-surface-container-lowest p-12 text-center border border-outline-variant/30 space-y-4">
                <span className="material-symbols-outlined text-4xl text-outline">search_off</span>
                <h3 className="font-title-lg text-title-lg text-on-surface font-serif">
                  No harvest products matched your filters
                </h3>
                <p className="font-body-sm text-body-sm text-on-surface-variant max-w-md mx-auto">
                  Try widening your price ceiling or deselecting specific extraction methods to discover available small-batch lots.
                </p>
                <button
                  onClick={clearAllFilters}
                  className="bg-primary text-on-primary px-6 py-2.5 font-label-md text-label-md uppercase tracking-wider hover:bg-secondary transition-colors cursor-pointer"
                >
                  Reset All Filters
                </button>
              </div>
            ) : (
              <div
                className={`grid gap-space-lg ${
                  gridCols === 4
                    ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4'
                    : 'grid-cols-1 md:grid-cols-2 xl:grid-cols-3'
                }`}
                id="product-grid"
              >
                {filteredProducts.map((product: any) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    onAddToCart={(variantId, qty) => handleAddToCart(variantId, product.name)}
                  />
                ))}
              </div>
            )}

            {/* Pagination Controls */}
            {data?.pagination && (
              <div className="bg-surface-container-low p-space-md flex flex-col sm:flex-row items-center justify-between gap-space-md border border-outline-variant/30">
                <span className="font-body-sm text-body-sm text-on-surface-variant">
                  Showing{' '}
                  <strong className="text-on-surface font-semibold">
                    {Math.min(1, filteredProducts.length)} to {filteredProducts.length}
                  </strong>{' '}
                  of <strong className="text-on-surface font-semibold">{totalCount}</strong> products
                </span>
                <div className="flex items-center gap-1">
                  <button
                    disabled={page <= 1}
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                    className="px-3 py-1.5 bg-surface text-outline hover:text-primary font-label-md text-label-md disabled:opacity-50 transition-colors border border-outline-variant/30 cursor-pointer"
                    type="button"
                  >
                    &larr; Prev
                  </button>
                  {Array.from({ length: Math.min(5, data.pagination.pages || 1) }, (_, i) => i + 1).map(
                    (p) => (
                      <button
                        key={p}
                        onClick={() => setPage(p)}
                        className={`px-3.5 py-1.5 font-label-md text-label-md transition-colors cursor-pointer border ${
                          p === page
                            ? 'bg-primary text-on-primary border-primary font-bold'
                            : 'bg-surface hover:bg-surface-container text-on-surface border-outline-variant/30'
                        }`}
                        type="button"
                      >
                        {p}
                      </button>
                    )
                  )}
                  <button
                    disabled={page >= (data.pagination.pages || 1)}
                    onClick={() => setPage((p) => p + 1)}
                    className="px-3 py-1.5 bg-surface text-on-surface hover:text-primary font-label-md text-label-md disabled:opacity-50 transition-colors border border-outline-variant/30 cursor-pointer"
                    type="button"
                  >
                    Next &rarr;
                  </button>
                </div>
              </div>
            )}
          </main>
        </div>
      </section>

      {/* Harvest Proof Assurance Strip */}
      <section className="w-full bg-surface-container-high py-space-xl px-gutter-mobile md:px-margin border-t border-outline-variant/30">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-space-lg items-center">
          <div className="flex items-start gap-space-md">
            <span className="material-symbols-outlined text-primary text-3xl">hourglass_bottom</span>
            <div className="space-y-1">
              <h4 className="font-title-lg text-title-lg text-primary font-bold font-serif">
                Cold Ghani Pressed Under 38°C
              </h4>
              <p className="font-body-sm text-body-sm text-on-surface-variant">
                Our slow wooden pestles rotate at 14 RPM to ensure vital antioxidants and monounsaturated fatty acids never degrade.
              </p>
            </div>
          </div>
          <div className="flex items-start gap-space-md">
            <span className="material-symbols-outlined text-primary text-3xl">receipt_long</span>
            <div className="space-y-1">
              <h4 className="font-title-lg text-title-lg text-primary font-bold font-serif">
                Traceable Lab Certificate
              </h4>
              <p className="font-body-sm text-body-sm text-on-surface-variant">
                Scan the batch QR stamp on any bottle to view the exact NABL purity assay, FFA levels, and peroxide index.
              </p>
            </div>
          </div>
          <div className="flex items-start gap-space-md">
            <span className="material-symbols-outlined text-primary text-3xl">local_shipping</span>
            <div className="space-y-1">
              <h4 className="font-title-lg text-title-lg text-primary font-bold font-serif">
                Zero-Plastic Glass Delivery
              </h4>
              <p className="font-body-sm text-body-sm text-on-surface-variant">
                Packed in UV-shielding amber glass bottles and sealed food-grade tins, shipped with biodegradable husk cushions.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
