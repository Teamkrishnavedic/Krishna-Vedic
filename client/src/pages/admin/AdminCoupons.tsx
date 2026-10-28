import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/api';
import { formatPrice } from '@/lib/utils';
import { useToast } from '@/context/ToastContext';

export default function AdminCoupons() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    code: '',
    description: '',
    discountType: 'PERCENTAGE',
    discountValue: 10,
    minOrderValue: 500,
    maxUses: 100,
    maxUsesPerUser: 1,
    isActive: true,
  });

  const { data: coupons = [], isLoading } = useQuery({
    queryKey: ['admin-coupons'],
    queryFn: async () => {
      const res = await api.get('/admin/coupons');
      return res.data.coupons || [];
    },
  });

  const createMutation = useMutation({
    mutationFn: (data: any) => {
      const payload = {
        code: data.code.toUpperCase(),
        description: data.description,
        discountType: data.discountType,
        discountValue: data.discountType === 'PERCENTAGE' ? data.discountValue * 100 : data.discountValue * 100,
        minOrderValue: data.minOrderValue * 100,
        maxUses: data.maxUses ? parseInt(data.maxUses) : undefined,
        maxUsesPerUser: parseInt(data.maxUsesPerUser) || 1,
        isActive: data.isActive,
      };
      return api.post('/admin/coupons', payload);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-coupons'] });
      toast({ title: 'Coupon Created Successfully', variant: 'success' });
      setShowForm(false);
      setFormData({
        code: '',
        description: '',
        discountType: 'PERCENTAGE',
        discountValue: 10,
        minOrderValue: 500,
        maxUses: 100,
        maxUsesPerUser: 1,
        isActive: true,
      });
    },
    onError: (err: any) => {
      toast({ title: 'Error', description: err.message || err.response?.data?.error || 'Could not create coupon', variant: 'error' });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => api.delete(`/admin/coupons/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-coupons'] });
      toast({ title: 'Coupon Deleted', variant: 'success' });
    },
    onError: (err: any) => {
      toast({ title: 'Delete Failed', description: err.message || err.response?.data?.error || 'Could not delete coupon', variant: 'error' });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.code) return;
    createMutation.mutate(formData);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-serif text-2xl font-bold text-[#2d2a26]">Promotions & Coupons</h1>
          <p className="text-xs text-[#7d7567] mt-0.5">Manage discounts, promotional voucher codes, and usage limits</p>
        </div>
        {!showForm && (
          <button
            onClick={() => setShowForm(true)}
            className="btn-primary py-2.5 px-5 text-xs flex items-center gap-1.5 rounded-full shadow-sm"
          >
            <span className="material-symbols-outlined text-sm">add</span> Create Coupon
          </button>
        )}
      </div>

      {/* Create form */}
      {showForm && (
        <div className="card p-6 border-[#e5e2da] bg-[#fafbf5] mb-6 rounded-3xl shadow-sm">
          <h2 className="font-serif text-base font-bold text-[#2d2a26] mb-4 pb-2 border-b border-[#e5e2da]">
            Create Promotional Coupon
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="label">Promo Code *</label>
                <input
                  type="text"
                  required
                  value={formData.code}
                  onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
                  placeholder="e.g. VEDIC10"
                  className="input uppercase font-mono text-xs rounded-xl"
                />
              </div>

              <div>
                <label className="label">Discount Type</label>
                <select
                  value={formData.discountType}
                  onChange={(e) => setFormData({ ...formData, discountType: e.target.value })}
                  className="select text-xs rounded-xl"
                >
                  <option value="PERCENTAGE">Percentage (%)</option>
                  <option value="FLAT">Flat Amount (₹)</option>
                </select>
              </div>

              <div>
                <label className="label">Discount Value ({formData.discountType === 'PERCENTAGE' ? '%' : '₹'}) *</label>
                <input
                  type="number"
                  required
                  min={1}
                  value={formData.discountValue}
                  onChange={(e) => setFormData({ ...formData, discountValue: parseInt(e.target.value) || 0 })}
                  className="input text-xs font-semibold rounded-xl"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="label">Min. Order Value (₹)</label>
                <input
                  type="number"
                  min={0}
                  value={formData.minOrderValue}
                  onChange={(e) => setFormData({ ...formData, minOrderValue: parseInt(e.target.value) || 0 })}
                  className="input text-xs rounded-xl"
                />
              </div>

              <div>
                <label className="label">Max Overall Uses</label>
                <input
                  type="number"
                  min={1}
                  value={formData.maxUses}
                  onChange={(e) => setFormData({ ...formData, maxUses: parseInt(e.target.value) || 100 })}
                  className="input text-xs rounded-xl"
                />
              </div>

              <div>
                <label className="label">Max Uses Per Customer</label>
                <input
                  type="number"
                  min={1}
                  value={formData.maxUsesPerUser}
                  onChange={(e) => setFormData({ ...formData, maxUsesPerUser: parseInt(e.target.value) || 1 })}
                  className="input text-xs rounded-xl"
                />
              </div>
            </div>

            <div>
              <label className="label">Description</label>
              <input
                type="text"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="e.g. 10% off for first-time cold-press buyers"
                className="input text-xs rounded-xl"
              />
            </div>

            <div className="flex items-center gap-3 pt-2">
              <button
                type="submit"
                disabled={createMutation.isPending}
                className="btn-primary py-2.5 px-6 text-xs rounded-full cursor-pointer disabled:opacity-50"
              >
                {createMutation.isPending ? 'Saving...' : 'Save Coupon'}
              </button>
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="btn-ghost py-2.5 px-4 text-xs rounded-full cursor-pointer"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Coupons Table */}
      <div className="card border-[#e5e2da] bg-[#fafbf5] overflow-hidden rounded-3xl shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#f4f4ec] border-b border-[#e5e2da] text-[#2d2a26] uppercase font-semibold">
              <tr>
                <th className="py-3 px-4">Coupon Code</th>
                <th className="py-3 px-4">Benefit</th>
                <th className="py-3 px-4">Min. Order</th>
                <th className="py-3 px-4 text-center">Usage Count</th>
                <th className="py-3 px-4 text-center">Status</th>
                <th className="py-3 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#e5e2da]">
              {isLoading ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-[#7d7567] font-sans text-xs uppercase tracking-wider">
                    Loading promotional ledger...
                  </td>
                </tr>
              ) : coupons.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-[#7d7567]">
                    No active discount coupons found.
                  </td>
                </tr>
              ) : (
                coupons.map((coupon: any) => (
                  <tr key={coupon.id} className="hover:bg-[#f4f4ec]/60">
                    <td className="py-3 px-4 font-mono font-bold text-[#2d2a26]">
                      {coupon.code}
                    </td>
                    <td className="py-3 px-4 font-semibold text-[#6e3418]">
                      {coupon.discountType === 'PERCENTAGE'
                        ? `${coupon.discountValue / 100}% OFF`
                        : `₹${coupon.discountValue / 100} FLAT OFF`}
                    </td>
                    <td className="py-3 px-4 text-[#4a463e]">
                      {formatPrice(coupon.minOrderValue)}
                    </td>
                    <td className="py-3 px-4 text-center text-[#4a463e]">
                      {coupon.usedCount} / {coupon.maxUses || 'Unlimited'}
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      <span className={`px-2.5 py-0.5 border font-semibold text-[10px] rounded-full ${
                        coupon.isActive ? 'border-[#3f674f] text-[#3f674f] bg-[#eef5f1]' : 'border-[#e5e2da] text-[#7d7567] bg-[#f4f4ec]'
                      }`}>
                        {coupon.isActive ? 'Active' : 'Disabled'}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <button
                        onClick={() => {
                          if (window.confirm(`Delete coupon ${coupon.code}?`)) {
                            deleteMutation.mutate(coupon.id);
                          }
                        }}
                        className="w-8 h-8 rounded-full inline-flex items-center justify-center text-[#7d7567] hover:text-red-700 hover:bg-red-50 transition-colors cursor-pointer"
                        title="Delete coupon"
                      >
                        <span className="material-symbols-outlined text-base">delete</span>
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
