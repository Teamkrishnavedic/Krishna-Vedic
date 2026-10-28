import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import api from '@/lib/api';
import ProductCard from '@/components/ProductCard';
import { useCart } from '@/context/CartContext';
import { useToast } from '@/context/ToastContext';

export default function SearchPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialQuery = searchParams.get('q') || '';
  const [searchInput, setSearchInput] = useState(initialQuery);
  const [query, setQuery] = useState(initialQuery);
  const [sortBy, setSortBy] = useState('featured');

  const { addItem } = useCart();
  const { toast } = useToast();

  useEffect(() => {
    const q = searchParams.get('q') || '';
    setSearchInput(q);
    setQuery(q);
  }, [searchParams]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSearchParams(searchInput.trim() ? { q: searchInput.trim() } : {});
    setQuery(searchInput.trim());
  };

  const { data, isLoading } = useQuery({
    queryKey: ['search', query, sortBy],
    queryFn: async () => {
      if (!query) return { products: [], pagination: { total: 0 } };
      const res = await api.get(`/products?search=${encodeURIComponent(query)}&sort=${sortBy}&limit=24`);
      return res.data;
    },
    enabled: query.length > 0,
  });

  const handleAddToCart = async (variantId: string, name: string) => {
    try {
      await addItem(variantId, 1);
      toast({ title: 'Added to basket', description: name, variant: 'success' });
    } catch (err: any) {
      toast({ title: 'Error', description: err.message, variant: 'error' });
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-gutter-mobile md:px-margin py-12">
      <div className="max-w-2xl mx-auto text-center mb-10 space-y-3">
        <span className="font-label-md text-label-md uppercase tracking-widest text-secondary font-bold">
          Store Catalogue Search
        </span>
        <h1 className="font-headline-lg text-headline-lg text-primary font-serif">
          Find Your Vedic Essentials
        </h1>

        {/* Search bar with smooth curves */}
        <form onSubmit={handleSearchSubmit} className="relative flex items-center border border-outline-variant/40 bg-surface-container-lowest rounded-full p-1.5 shadow-sm">
          <span className="material-symbols-outlined text-xl text-outline absolute left-4 pointer-events-none">
            search
          </span>
          <input
            type="search"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            placeholder="Search oils, masalas, spices, turmeric..."
            className="w-full bg-transparent pl-12 pr-28 py-2.5 text-sm text-on-surface focus:outline-none placeholder:text-outline"
          />
          <button
            type="submit"
            className="absolute right-1.5 px-6 py-2.5 bg-primary text-on-primary font-label-md text-xs uppercase tracking-wider hover:bg-secondary transition-all cursor-pointer font-semibold rounded-full shadow-xs active:scale-95"
          >
            Search
          </button>
        </form>
      </div>

      {query ? (
        <div>
          <div className="flex items-center justify-between pb-4 border-b border-outline-variant/30 mb-8">
            <p className="text-sm text-on-surface-variant">
              Showing results for <span className="font-bold text-on-surface">"{query}"</span> ({data?.pagination?.total || 0} harvest lots found)
            </p>
            <div className="flex items-center gap-2">
              <label className="text-xs text-on-surface-variant font-label-sm uppercase">Sort</label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="bg-surface text-on-surface border border-outline-variant/40 text-xs py-1.5 px-2 focus:outline-none cursor-pointer"
              >
                <option value="featured">Featured Heritage</option>
                <option value="createdAt">New Harvest</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
              </select>
            </div>
          </div>

          {isLoading ? (
            <div className="p-12 text-center text-on-surface-variant font-serif text-lg border border-outline-variant/30 bg-surface-container-lowest">
              Searching harvest records for "{query}"...
            </div>
          ) : data?.products?.length === 0 ? (
            <div className="text-center py-16 bg-surface-container-low border border-outline-variant/30 max-w-xl mx-auto space-y-4">
              <span className="material-symbols-outlined text-4xl text-outline">search_off</span>
              <h2 className="font-serif text-2xl text-on-surface">No harvest lots found</h2>
              <p className="text-on-surface-variant text-sm max-w-md mx-auto">
                We could not find any products matching "{query}". Try checking your spelling or using more general terms like mustard, turmeric, or chilli.
              </p>
              <Link
                to="/shop"
                className="inline-block bg-primary text-on-primary px-6 py-2.5 font-label-md text-label-md uppercase tracking-wider hover:bg-secondary transition-colors"
              >
                Explore Full Catalogue
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {data?.products?.map((product: any) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onAddToCart={(vId) => handleAddToCart(vId, product.name)}
                />
              ))}
            </div>
          )}
        </div>
      ) : (
        <div className="text-center py-16 text-on-surface-variant text-sm">
          Popular searches: Mustard Oil, Salem Turmeric, Byadagi Chilli, Wood-Pressed Til Sesame Oil
        </div>
      )}
    </div>
  );
}
