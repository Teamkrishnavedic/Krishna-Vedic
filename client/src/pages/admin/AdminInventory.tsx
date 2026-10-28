import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/api';
import { formatDate } from '@/lib/utils';
import { useToast } from '@/context/ToastContext';

export default function AdminInventory() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const [selectedVariantId, setSelectedVariantId] = useState('');
  const [adjustmentQty, setAdjustmentQty] = useState(10);
  const [adjustmentType, setAdjustmentType] = useState<'RESTOCK' | 'CORRECTION' | 'DAMAGE'>('RESTOCK');
  const [reason, setReason] = useState('Fresh batch from Jaipur wood press');

  const { data: productsData } = useQuery({
    queryKey: ['admin-products-inventory'],
    queryFn: async () => {
      const res = await api.get('/admin/products?limit=100');
      return res.data;
    },
  });

  const { data: movementsData } = useQuery({
    queryKey: ['admin-inventory-movements'],
    queryFn: async () => {
      const res = await api.get('/admin/inventory/movements?limit=20');
      return res.data;
    },
  });

  const adjustMutation = useMutation({
    mutationFn: (payload: any) => api.post('/admin/inventory/adjust', payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-products-inventory'] });
      queryClient.invalidateQueries({ queryKey: ['admin-inventory-movements'] });
      queryClient.invalidateQueries({ queryKey: ['admin-dashboard'] });
      toast({ title: 'Stock Adjusted Successfully', variant: 'success' });
      setAdjustmentQty(10);
      setReason('');
    },
    onError: (err: any) => {
      toast({ title: 'Adjustment Failed', description: err.message || err.response?.data?.error || 'Error updating stock', variant: 'error' });
    },
  });

  const handleAdjustSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedVariantId) {
      toast({ title: 'Select Variant', description: 'Please choose which product size/variant to adjust', variant: 'error' });
      return;
    }
    const finalQty = adjustmentType === 'DAMAGE' ? -Math.abs(adjustmentQty) : adjustmentQty;
    adjustMutation.mutate({
      variantId: selectedVariantId,
      quantity: finalQty,
      type: adjustmentType,
      reason: reason || 'Inventory manual adjustment',
    });
  };

  const allVariants: any[] = [];
  productsData?.products?.forEach((p: any) => {
    p.variants?.forEach((v: any) => {
      allVariants.push({
        ...v,
        productName: p.name,
      });
    });
  });

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-serif text-2xl font-bold text-[#2d2a26]">Inventory & Stock Control</h1>
        <p className="text-xs text-[#7d7567] mt-0.5">Track warehouse levels, restock batches, and view audit trail</p>
      </div>

      {/* Adjust Form */}
      <div className="card p-6 border-[#e5e2da] bg-[#fafbf5] rounded-3xl shadow-xs">
        <h2 className="font-serif text-base font-bold text-[#2d2a26] mb-4 pb-2 border-b border-[#e5e2da] flex items-center gap-2">
          <span className="material-symbols-outlined text-[#6e3418] text-base">warehouse</span> Log Stock Inflow / Adjustment
        </h2>

        <form onSubmit={handleAdjustSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
            <div className="sm:col-span-2">
              <label className="label">Select Product Variant *</label>
              <select
                value={selectedVariantId}
                onChange={(e) => setSelectedVariantId(e.target.value)}
                className="select text-xs rounded-xl"
                required
              >
                <option value="">-- Choose Product & Size --</option>
                {allVariants.map((v) => (
                  <option key={v.id} value={v.id}>
                    {v.productName} - {v.name} (Current Stock: {v.stock})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="label">Adjustment Type</label>
              <select
                value={adjustmentType}
                onChange={(e) => setAdjustmentType(e.target.value as any)}
                className="select text-xs rounded-xl"
              >
                <option value="RESTOCK">Restock (Add to Stock)</option>
                <option value="CORRECTION">Manual Count Correction</option>
                <option value="DAMAGE">Damaged / Expired (Deduct)</option>
              </select>
            </div>

            <div>
              <label className="label">Quantity Units *</label>
              <input
                type="number"
                required
                value={adjustmentQty}
                onChange={(e) => setAdjustmentQty(parseInt(e.target.value) || 0)}
                className="input text-xs font-bold rounded-xl"
              />
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 items-end">
            <div className="flex-1 w-full">
              <label className="label">Reason / Batch Ref *</label>
              <input
                type="text"
                required
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                placeholder="e.g. Lot #KV-OCT-26 freshly pressed"
                className="input text-xs rounded-xl"
              />
            </div>

            <button
              type="submit"
              disabled={adjustMutation.isPending}
              className="bg-[#6e3418] hover:bg-[#522510] text-[#fafbf5] py-2.5 px-6 text-xs font-semibold uppercase tracking-wider whitespace-nowrap self-stretch sm:self-auto rounded-full transition-all cursor-pointer shadow-xs active:scale-95"
            >
              {adjustMutation.isPending ? 'Updating...' : 'Commit Adjustment'}
            </button>
          </div>
        </form>
      </div>

      {/* Grid: Current Stock Levels & Movement History */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Stock List (7 cols) */}
        <div className="lg:col-span-7 card border-[#e5e2da] bg-[#fafbf5] overflow-hidden rounded-3xl shadow-xs">
          <div className="p-4 border-b border-[#e5e2da] font-serif font-bold text-[#2d2a26] text-sm">
            Current Stock Levels
          </div>
          <div className="overflow-x-auto max-h-96">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#f4f4ec] border-b border-[#e5e2da] text-[#2d2a26] uppercase font-semibold sticky top-0">
                <tr>
                  <th className="py-2.5 px-3">Product</th>
                  <th className="py-2.5 px-3">Variant</th>
                  <th className="py-2.5 px-3">SKU</th>
                  <th className="py-2.5 px-3 text-right">Available Stock</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#e5e2da]">
                {allVariants.map((v) => {
                  const isLow = v.stock <= (v.lowStockThreshold || 5);
                  return (
                    <tr key={v.id} className="hover:bg-[#f4f4ec]/60">
                      <td className="py-2.5 px-3 font-medium text-[#2d2a26]">
                        {v.productName}
                      </td>
                      <td className="py-2.5 px-3 text-[#7d7567]">{v.name}</td>
                      <td className="py-2.5 px-3 font-mono text-[11px] text-[#7d7567]">{v.sku}</td>
                      <td className="py-2.5 px-3 text-right font-bold">
                        <span className={`px-2.5 py-0.5 border text-xs rounded-full font-bold ${
                          isLow ? 'border-red-400 text-red-800 bg-red-50' : 'border-[#3f674f] text-[#3f674f] bg-[#eef5f1]'
                        }`}>
                          {v.stock} units
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Movements History (5 cols) */}
        <div className="lg:col-span-5 card border-[#e5e2da] bg-[#fafbf5] overflow-hidden rounded-none">
          <div className="p-4 border-b border-[#e5e2da] font-serif font-bold text-[#2d2a26] text-sm flex items-center gap-2">
            <span className="material-symbols-outlined text-[#6e3418] text-base">history</span> Recent Inventory Movements
          </div>
          <div className="divide-y divide-[#e5e2da] max-h-96 overflow-y-auto">
            {movementsData?.movements?.map((m: any) => (
              <div key={m.id} className="p-3 text-xs flex justify-between items-center">
                <div>
                  <p className="font-semibold text-[#2d2a26]">{m.variant?.product?.name}</p>
                  <p className="text-[11px] text-[#7d7567]">{m.reason || m.type} • {formatDate(m.createdAt)}</p>
                </div>
                <span className={`font-mono font-bold text-xs ${m.quantity > 0 ? 'text-[#3f674f]' : 'text-red-700'}`}>
                  {m.quantity > 0 ? `+${m.quantity}` : m.quantity}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
