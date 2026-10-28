import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/api';
import { useToast } from '@/context/ToastContext';

export default function AdminProducts() {
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const { data: productsData, isLoading } = useQuery({
    queryKey: ['admin-products', search, selectedCategory],
    queryFn: async () => {
      let url = `/admin/products?limit=50`;
      if (search) url += `&search=${encodeURIComponent(search)}`;
      if (selectedCategory) url += `&categoryId=${selectedCategory}`;
      const res = await api.get(url);
      return res.data;
    },
  });

  const { data: categories = [] } = useQuery({
    queryKey: ['admin-categories-list'],
    queryFn: async () => {
      const res = await api.get('/admin/categories');
      return res.data.categories || [];
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => api.delete(`/admin/products/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-products'] });
      toast({ title: 'Product Deleted', variant: 'success' });
    },
    onError: (err: any) => {
      toast({ title: 'Error', description: err.message || err.response?.data?.error || 'Could not delete product', variant: 'error' });
    },
  });

  const handleDelete = (id: string, name: string) => {
    if (window.confirm(`Are you sure you want to delete "${name}"?`)) {
      deleteMutation.mutate(id);
    }
  };

  const getProductImage = (p: any): string => {
    const first = p.images?.[0];
    if (typeof first === 'string' && first.startsWith('http')) return first;
    if (typeof first === 'object' && first?.url) return first.url;

    const name = (p.name || '').toLowerCase();
    if (name.includes('mustard') || name.includes('sarson')) {
      return 'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?auto=format&fit=crop&w=300&q=80';
    }
    if (name.includes('sesame') || name.includes('til')) {
      return 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&w=300&q=80';
    }
    if (name.includes('coconut') || name.includes('nariyal')) {
      return 'https://images.unsplash.com/photo-1526947425960-945c6e72858f?auto=format&fit=crop&w=300&q=80';
    }
    if (name.includes('ghee') || name.includes('bilona')) {
      return 'https://images.unsplash.com/photo-1631451095765-2c91616fc9e6?auto=format&fit=crop&w=300&q=80';
    }
    if (name.includes('groundnut') || name.includes('peanut')) {
      return 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?auto=format&fit=crop&w=300&q=80';
    }
    if (name.includes('turmeric') || name.includes('haldi')) {
      return 'https://images.unsplash.com/photo-1615485500704-8e990f9900f7?auto=format&fit=crop&w=300&q=80';
    }
    if (name.includes('chilli') || name.includes('mirch')) {
      return 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?auto=format&fit=crop&w=300&q=80';
    }
    if (name.includes('coriander') || name.includes('dhaniya')) {
      return 'https://images.unsplash.com/photo-1532336414038-cf19250c5757?auto=format&fit=crop&w=300&q=80';
    }
    if (name.includes('pepper') || name.includes('clove') || name.includes('cinnamon') || name.includes('spices')) {
      return 'https://images.unsplash.com/photo-1509358271058-acd22cc93898?auto=format&fit=crop&w=300&q=80';
    }
    return 'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?auto=format&fit=crop&w=300&q=80';
  };

  const products = productsData?.products || [];

  return (
    <div className="space-y-6">
      {/* Top Header with curved action button */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#e5e2da]">
        <div>
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[#6e3418] text-2xl">inventory_2</span>
            <h1 className="font-serif text-2xl font-bold text-[#2d2a26]">Products &amp; Visual Inventory</h1>
          </div>
          <p className="text-xs text-[#7d7567] mt-1">
            Manage wood-pressed oils, stone-ground spices, live product photography, and inventory packs
          </p>
        </div>
        <Link
          to="/admin/products/new"
          className="bg-[#6e3418] hover:bg-[#522510] text-[#fafbf5] py-2.5 px-5 text-xs uppercase tracking-wider font-semibold rounded-full flex items-center gap-2 transition-all cursor-pointer self-start sm:self-auto shadow-sm active:scale-95"
        >
          <span className="material-symbols-outlined text-sm">add_photo_alternate</span> Add New Product
        </Link>
      </div>

      {/* Filters Bar with smooth curves */}
      <div className="bg-[#fafbf5] p-4 rounded-2xl border border-[#e5e2da] flex flex-col sm:flex-row gap-4 justify-between items-center shadow-xs">
        <div className="relative w-full sm:w-80">
          <input
            type="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search oils, spices, SKU..."
            className="w-full bg-[#f4f4ec] text-[#2d2a26] border border-[#e5e2da] pl-10 pr-4 py-2 text-xs rounded-full focus:outline-none focus:border-[#6e3418] focus:ring-1 focus:ring-[#6e3418]"
          />
          <span className="material-symbols-outlined text-base text-[#7d7567] absolute left-3.5 top-2 pointer-events-none">
            search
          </span>
        </div>

        <div className="flex items-center gap-2.5 w-full sm:w-auto">
          <label className="text-xs text-[#7d7567] uppercase font-semibold whitespace-nowrap">Category:</label>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="bg-[#f4f4ec] text-[#2d2a26] border border-[#e5e2da] text-xs py-2 px-4 rounded-full focus:outline-none focus:border-[#6e3418] cursor-pointer"
          >
            <option value="">All Categories ({categories.length})</option>
            {categories.map((c: any) => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Table Card with smooth curves */}
      <div className="bg-[#fafbf5] border border-[#e5e2da] rounded-3xl overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#f4f4ec] border-b border-[#e5e2da] text-[#2d2a26] uppercase font-bold tracking-wider">
              <tr>
                <th className="py-3.5 px-5">Photo &amp; Product</th>
                <th className="py-3.5 px-4">Category</th>
                <th className="py-3.5 px-4">Master SKU</th>
                <th className="py-3.5 px-4">Packaging Packs</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#f4f4ec]">
              {isLoading ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-[#7d7567]">
                    Retrieving product catalogue &amp; high-res visual assets...
                  </td>
                </tr>
              ) : products.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-[#7d7567]">
                    No products found matching your search.
                  </td>
                </tr>
              ) : (
                products.map((p: any) => {
                  const imgUrl = getProductImage(p);
                  const hasMultipleImages = Array.isArray(p.images) && p.images.length > 1;

                  return (
                    <tr key={p.id} className="hover:bg-[#f4f4ec]/60 transition-colors">
                      {/* Product & Visual Thumbnail */}
                      <td className="py-3.5 px-5">
                        <div className="flex items-center gap-3.5">
                          <div className="relative w-14 h-14 bg-[#f4f4ec] rounded-2xl border border-[#e5e2da] overflow-hidden flex-shrink-0 shadow-xs group">
                            <img
                              src={imgUrl}
                              alt={p.name}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                              onError={(e) => {
                                (e.target as HTMLImageElement).src =
                                  'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?auto=format&fit=crop&w=300&q=80';
                              }}
                            />
                            {hasMultipleImages && (
                              <span className="absolute bottom-0 right-0 bg-[#2d2a26]/80 text-[#fafbf5] text-[9px] font-bold px-1 rounded-tl-md">
                                {p.images.length}
                              </span>
                            )}
                          </div>
                          <div>
                            <Link
                              to={`/admin/products/${p.id}/edit`}
                              className="font-bold text-[#2d2a26] hover:text-[#6e3418] transition-colors text-sm"
                            >
                              {p.name}
                            </Link>
                            <div className="flex items-center gap-2 mt-0.5">
                              <span className="text-[11px] font-mono text-[#7d7567]">
                                /{p.slug}
                              </span>
                              {p.isFeatured && (
                                <span className="bg-[#ca8a04]/20 text-[#854d0e] text-[10px] font-bold px-1.5 py-0.2 rounded-full uppercase">
                                  Featured
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Category */}
                      <td className="py-3.5 px-4">
                        <span className="px-2.5 py-1 bg-[#f4f4ec] rounded-full text-[11px] font-medium text-[#52443c] border border-[#e5e2da]">
                          {p.category?.name || 'General'}
                        </span>
                      </td>

                      {/* SKU */}
                      <td className="py-3.5 px-4 font-mono text-xs text-[#7d7567]">
                        {p.sku}
                      </td>

                      {/* Variants */}
                      <td className="py-3.5 px-4 text-[#52443c]">
                        <span className="font-semibold">{p.variants?.length || 0}</span> pack size(s)
                      </td>

                      {/* Status */}
                      <td className="py-3.5 px-4">
                        <span className={`px-2.5 py-1 rounded-full font-bold text-[10px] uppercase tracking-wider ${
                          p.status === 'PUBLISHED'
                            ? 'bg-[#3f674f] text-[#fafbf5]'
                            : 'bg-[#f4f4ec] text-[#7d7567] border border-[#e5e2da]'
                        }`}>
                          {p.status}
                        </span>
                      </td>

                      {/* Actions */}
                      <td className="py-3.5 px-5 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <Link
                            to={`/products/${p.slug}`}
                            target="_blank"
                            className="w-8 h-8 rounded-full flex items-center justify-center text-[#7d7567] hover:text-[#6e3418] hover:bg-[#f4f4ec] transition-colors"
                            title="Preview on Storefront"
                          >
                            <span className="material-symbols-outlined text-base">visibility</span>
                          </Link>
                          <Link
                            to={`/admin/products/${p.id}/edit`}
                            className="w-8 h-8 rounded-full flex items-center justify-center text-[#7d7567] hover:text-[#6e3418] hover:bg-[#f4f4ec] transition-colors"
                            title="Edit Product & Photos"
                          >
                            <span className="material-symbols-outlined text-base">edit</span>
                          </Link>
                          <button
                            type="button"
                            onClick={() => handleDelete(p.id, p.name)}
                            className="w-8 h-8 rounded-full flex items-center justify-center text-[#7d7567] hover:text-red-700 hover:bg-red-50 transition-colors cursor-pointer"
                            title="Delete Product"
                          >
                            <span className="material-symbols-outlined text-base">delete</span>
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
