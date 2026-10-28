import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import api from '@/lib/api';
import ProductCard from '@/components/ProductCard';
import { useCart } from '@/context/CartContext';
import { useToast } from '@/context/ToastContext';

export default function CategoryPage() {
  const { category: slug } = useParams<{ category: string }>();
  const { addItem } = useCart();
  const { toast } = useToast();
  const [page, setPage] = useState(1);
  const [sortBy, setSortBy] = useState('featured');
  const [gridCols, setGridCols] = useState<3 | 4>(3);

  const { data: categoryData, isLoading: isCatLoading } = useQuery({
    queryKey: ['category', slug],
    queryFn: () => api.get(`/categories/${slug}`).then((r) => r.data.category),
    enabled: !!slug,
  });

  const { data: productsData, isLoading: isProdLoading } = useQuery({
    queryKey: ['category-products', slug, page, sortBy],
    queryFn: () =>
      api
        .get(`/products?category=${slug}&page=${page}&limit=24&sort=${sortBy}`)
        .then((r) => r.data),
    enabled: !!slug,
  });

  const handleAddToCart = async (variantId: string, name: string) => {
    try {
      await addItem(variantId, 1);
      toast({ title: 'Added to cart', description: name, variant: 'success' });
    } catch (err: any) {
      toast({ title: 'Error', description: err.message, variant: 'error' });
    }
  };

  const isLoading = isCatLoading || isProdLoading;
  const totalCount = productsData?.pagination?.total || productsData?.products?.length || 0;

  return (
    <div className="w-full flex flex-col bg-surface min-h-screen">
      {/* Top Category Banner & Breadcrumb Area */}
      <section className="w-full bg-surface-container-low px-gutter-mobile md:px-margin py-space-xl border-b border-outline-variant/30">
        <div className="max-w-7xl mx-auto flex flex-col gap-space-md">
          {/* Breadcrumb navigation */}
          <nav className="flex items-center gap-2 font-label-md text-label-md text-on-surface-variant uppercase tracking-widest">
            <Link to="/" className="hover:text-primary transition-colors">
              Home
            </Link>
            <span className="text-outline">/</span>
            <Link to="/shop" className="hover:text-primary transition-colors">
              Shop All
            </Link>
            <span className="text-outline">/</span>
            <span className="text-primary font-semibold">{categoryData?.name || slug}</span>
            <span className="bg-surface px-2 py-0.5 text-on-surface-variant font-label-sm text-label-sm ml-2">
              {totalCount} Harvest Items
            </span>
          </nav>

          {/* Main Editorial Header */}
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-space-lg">
            <div className="max-w-3xl space-y-2">
              <span className="font-label-md text-label-md uppercase tracking-widest text-primary font-bold flex items-center gap-2">
                <span className="w-2 h-2 bg-primary inline-block"></span>
                Heritage Guild Collective
              </span>
              <h1 className="font-headline-lg text-headline-lg text-primary tracking-tight font-serif">
                {categoryData?.name || 'Artisanal Collection'}
              </h1>
              <p className="font-body-md text-body-md text-on-surface-variant pt-1 leading-relaxed">
                {categoryData?.description ||
                  'Extracted slowly in ancestral wood-presses and stone chakkis. Retaining uncompromised aroma, pungency, and vital phytonutrients straight from our farming guilds.'}
              </p>
            </div>

            {/* Quick Guild Certification Seals */}
            <div className="flex items-center gap-3 self-start lg:self-auto bg-surface p-space-md border border-outline-variant/20">
              <div className="flex flex-col text-right">
                <span className="font-label-sm text-label-sm uppercase tracking-wider text-secondary font-bold">
                  Lab Assayed
                </span>
                <span className="font-body-sm text-body-sm text-on-surface">
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
        </div>
      </section>

      {/* Main Catalog Section */}
      <section className="w-full px-gutter-mobile md:px-margin py-space-xl max-w-7xl mx-auto">
        {/* Action Bar */}
        <div className="bg-surface-container-low p-space-md mb-space-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-space-md border border-outline-variant/20">
          <div className="flex items-center gap-2 font-label-sm text-label-sm uppercase tracking-wider text-on-surface-variant">
            <span>Showing harvest lots for:</span>
            <span className="bg-surface px-2.5 py-1 text-primary font-bold border border-outline-variant/20">
              {categoryData?.name || slug}
            </span>
          </div>

          <div className="flex items-center gap-space-md w-full md:w-auto justify-between md:justify-end">
            <div className="flex items-center gap-2">
              <label
                className="font-label-sm text-label-sm uppercase tracking-wider text-on-surface-variant whitespace-nowrap"
                htmlFor="cat-sort"
              >
                Sort By:
              </label>
              <select
                className="bg-surface text-on-surface font-body-sm text-body-sm px-space-md py-2 focus:outline-none focus:bg-surface-container-high transition-colors cursor-pointer border border-outline-variant/30"
                id="cat-sort"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
              >
                <option value="featured">Featured Heritage Selection</option>
                <option value="createdAt">Freshly Pressed / New Harvest</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
                <option value="rating">Highest Customer Rating</option>
              </select>
            </div>

            {/* Grid Column Controls */}
            <div className="hidden sm:flex items-center bg-surface p-1 gap-1 border border-outline-variant/20">
              <button
                aria-label="3 column layout"
                onClick={() => setGridCols(3)}
                className={`p-1 transition-colors ${
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
                className={`p-1 transition-colors ${
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

        {/* Product Grid */}
        {isLoading ? (
          <div className="py-20 text-center font-sans text-xs uppercase tracking-widest text-on-surface-variant border border-outline-variant/20 bg-surface-container-lowest">
            Consulting seasonal harvest register...
          </div>
        ) : productsData?.products?.length === 0 ? (
          <div className="bg-surface-container-lowest p-16 text-center border border-outline-variant/30 space-y-4">
            <span className="material-symbols-outlined text-5xl text-outline">eco</span>
            <h3 className="font-headline-sm text-headline-sm text-on-surface font-serif">
              New Harvest Bottling In Progress
            </h3>
            <p className="font-body-md text-body-md text-on-surface-variant max-w-md mx-auto">
              Our small-batch pressers are currently preparing this seasonal lot. Explore our full pantry catalog in the meantime.
            </p>
            <Link
              to="/shop"
              className="inline-block bg-primary text-on-primary px-8 py-3 font-label-md text-label-md uppercase tracking-wider hover:bg-secondary transition-colors"
            >
              Browse All Products
            </Link>
          </div>
        ) : (
          <div
            className={`grid gap-space-lg ${
              gridCols === 4
                ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4'
                : 'grid-cols-1 md:grid-cols-2 xl:grid-cols-3'
            }`}
          >
            {productsData?.products?.map((product: any, idx: number) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.04 }}
              >
                <ProductCard
                  product={product}
                  onAddToCart={(variantId) => handleAddToCart(variantId, product.name)}
                />
              </motion.div>
            ))}
          </div>
        )}

        {/* Pagination Controls */}
        {productsData?.pagination && productsData.pagination.pages > 1 && (
          <div className="bg-surface-container-low p-space-md flex flex-col sm:flex-row items-center justify-between gap-space-md border border-outline-variant/20 mt-space-xl">
            <span className="font-body-sm text-body-sm text-on-surface-variant">
              Showing page <strong className="text-on-surface font-semibold">{page}</strong> of{' '}
              <strong className="text-on-surface font-semibold">{productsData.pagination.pages}</strong>
            </span>
            <div className="flex items-center gap-1">
              <button
                disabled={page <= 1}
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                className="px-3 py-1.5 bg-surface text-outline hover:text-primary font-label-md text-label-md disabled:opacity-50 transition-colors border border-outline-variant/20 cursor-pointer"
                type="button"
              >
                ← Prev
              </button>
              {Array.from({ length: productsData.pagination.pages }, (_, i) => i + 1).map((p) => (
                <button
                  key={p}
                  onClick={() => setPage(p)}
                  className={`px-3.5 py-1.5 font-label-md text-label-md transition-colors cursor-pointer ${
                    p === page
                      ? 'bg-primary text-on-primary font-bold'
                      : 'bg-surface hover:bg-surface-container text-on-surface border border-outline-variant/20'
                  }`}
                  type="button"
                >
                  {p}
                </button>
              ))}
              <button
                disabled={page >= productsData.pagination.pages}
                onClick={() => setPage((p) => p + 1)}
                className="px-3 py-1.5 bg-surface text-on-surface hover:text-primary font-label-md text-label-md disabled:opacity-50 transition-colors border border-outline-variant/20 cursor-pointer"
                type="button"
              >
                Next →
              </button>
            </div>
          </div>
        )}
      </section>

      {/* Harvest Proof & Batch Verification Banner */}
      <section className="w-full bg-surface-container-high py-space-xl px-gutter-mobile md:px-margin mt-space-xl border-t border-outline-variant/30">
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
