import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/api';
import { formatPrice, formatDate } from '@/lib/utils';
import { useToast } from '@/context/ToastContext';

export default function AdminPriceHistory() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const [selectedVariantId, setSelectedVariantId] = useState('');
  const [newPrice, setNewPrice] = useState<number>(0);
  const [newCompareAt, setNewCompareAt] = useState<number | undefined>(undefined);
  const [reason, setReason] = useState('');

  const { data: productsData } = useQuery({
    queryKey: ['admin-products-prices'],
    queryFn: async () => {
      const res = await api.get('/admin/products?limit=100');
      return res.data;
    },
  });

  const { data: historyData, isLoading: isHistoryLoading } = useQuery({
    queryKey: ['admin-variant-price-history', selectedVariantId],
    queryFn: async () => {
      const res = await api.get(`/admin/variants/${selectedVariantId}/price-history`);
      return res.data.history || [];
    },
    enabled: !!selectedVariantId,
  });

  const updatePriceMutation = useMutation({
    mutationFn: (payload: any) =>
      api.patch(`/admin/variants/${selectedVariantId}/price`, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-products-prices'] });
      queryClient.invalidateQueries({ queryKey: ['admin-variant-price-history', selectedVariantId] });
      toast({ title: 'Price Updated', description: 'New pricing saved and logged to audit trail', variant: 'success' });
      setReason('');
    },
    onError: (err: any) => {
      toast({ title: 'Error', description: err.message || err.response?.data?.error || 'Could not update price', variant: 'error' });
    },
  });

  const allVariants: any[] = [];
  productsData?.products?.forEach((p: any) => {
    p.variants?.forEach((v: any) => {
      allVariants.push({
        ...v,
        productName: p.name,
      });
    });
  });

  const handleVariantSelect = (vId: string) => {
    setSelectedVariantId(vId);
    const found = allVariants.find((v) => v.id === vId);
    if (found) {
      setNewPrice(Math.round(found.price / 100));
      setNewCompareAt(found.compareAtPrice ? Math.round(found.compareAtPrice / 100) : undefined);
    }
  };

  const handlePriceSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedVariantId || !newPrice) return;
    updatePriceMutation.mutate({
      price: newPrice * 100,
      compareAtPrice: newCompareAt ? newCompareAt * 100 : undefined,
      reason: reason || 'Routine market price adjustment',
    });
  };

  return (
    <div className="space-y-8 max-w-4xl">
      <div>
        <h1 className="font-serif text-2xl font-bold text-[#2d2a26]">Price Governance & History</h1>
        <p className="text-xs text-[#7d7567] mt-0.5">Audit trail of all pricing changes across sizes and variants</p>
      </div>

      {/* Select and Update Card */}
      <div className="card p-6 border-[#e5e2da] bg-[#fafbf5] rounded-3xl shadow-sm">
        <h2 className="font-serif text-base font-bold text-[#2d2a26] mb-4 pb-2 border-b border-[#e5e2da] flex items-center gap-2">
          <span className="material-symbols-outlined text-[#6e3418] text-base">currency_rupee</span> Update Variant Pricing
        </h2>

        <form onSubmit={handlePriceSubmit} className="space-y-4">
          <div>
            <label className="label">Select Product & Size *</label>
            <select
              value={selectedVariantId}
              onChange={(e) => handleVariantSelect(e.target.value)}
              className="select text-xs rounded-xl"
              required
            >
              <option value="">-- Choose Product Variant --</option>
              {allVariants.map((v) => (
                <option key={v.id} value={v.id}>
                  {v.productName} - {v.name} (Current: {formatPrice(v.price)})
                </option>
              ))}
            </select>
          </div>

          {selectedVariantId && (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="label">Selling Price (₹) *</label>
                  <input
                    type="number"
                    required
                    min={1}
                    value={newPrice}
                    onChange={(e) => setNewPrice(parseInt(e.target.value) || 0)}
                    className="input text-xs font-semibold rounded-xl"
                  />
                </div>
                <div>
                  <label className="label">MRP / Compare At Price (₹)</label>
                  <input
                    type="number"
                    min={1}
                    value={newCompareAt || ''}
                    onChange={(e) => setNewCompareAt(parseInt(e.target.value) || undefined)}
                    className="input text-xs rounded-xl"
                    placeholder="Leave empty if no discount"
                  />
                </div>
              </div>

              <div>
                <label className="label">Reason for Price Change *</label>
                <input
                  type="text"
                  required
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  placeholder="e.g. Raw mustard seed procurement cost adjustment"
                  className="input text-xs rounded-xl"
                />
              </div>

              <button
                type="submit"
                disabled={updatePriceMutation.isPending}
                className="btn-primary py-2.5 px-6 text-xs rounded-full shadow-sm cursor-pointer disabled:opacity-50"
              >
                {updatePriceMutation.isPending ? 'Saving...' : 'Apply Price & Record Audit'}
              </button>
            </>
          )}
        </form>
      </div>

      {/* History Log */}
      {selectedVariantId && (
        <div className="card border-[#e5e2da] bg-[#fafbf5] overflow-hidden rounded-3xl shadow-sm">
          <div className="p-4 border-b border-[#e5e2da] font-serif font-bold text-[#2d2a26] text-sm flex items-center gap-2">
            <span className="material-symbols-outlined text-[#6e3418] text-base">history</span> Historical Price Changes
          </div>
          <div className="divide-y divide-[#e5e2da]">
            {isHistoryLoading ? (
              <p className="p-6 text-center text-xs text-[#7d7567] font-sans uppercase tracking-wider">Loading history audit register...</p>
            ) : historyData?.length === 0 ? (
              <p className="p-6 text-center text-xs text-[#7d7567]">No previous price revisions recorded for this variant.</p>
            ) : (
              historyData.map((h: any) => (
                <div key={h.id} className="p-4 text-xs flex justify-between items-center">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-[#2d2a26]">{formatPrice(h.oldPrice)}</span>
                      <span className="material-symbols-outlined text-[#7d7567] text-sm">arrow_forward</span>
                      <span className="font-bold text-[#6e3418]">{formatPrice(h.newPrice)}</span>
                    </div>
                    <p className="text-[#4a463e] mt-1">{h.reason}</p>
                    <p className="text-[10px] text-[#7d7567] mt-0.5">
                      Changed by {h.changedBy?.name || 'Admin'} on {formatDate(h.createdAt)}
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}
